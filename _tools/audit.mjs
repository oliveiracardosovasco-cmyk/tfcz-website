#!/usr/bin/env node
/**
 * TFCZ Standards-Audit (statisch) — messen statt meinen.
 *
 * Prüft die öffentlichen Seiten auf STANDARD-Qualität nach aussen:
 * SEO/OnPage · AEO/Schema · Accessibility · Performance-Hebel · Sicherheit/Best-Practice.
 * NICHT Design/Mechanik (das ist tfcz-design-qa). Deterministisch, nur Node-Standardlib.
 *
 * ECHTE Ladezeiten (LCP/FCP/CLS/TTFB … im Browser) misst dieses Skript NICHT — dafür
 * gibt es `_tools/audit-perf.mjs` (Playwright, echter Browser). Hier wird der statische
 * Haupt-Hebel gemessen: Seitengewicht der referenzierten lokalen Ressourcen + On-Page-Standards.
 *
 * Aufruf:  node _tools/audit.mjs [projekt-root]        (default: cwd)
 * Exit 1, sobald ein HIGH-Befund offen ist. Launch-/Hosting-Punkte zählen nie als Fehler.
 */
import { readFileSync, existsSync, statSync, writeFileSync, mkdirSync } from "node:fs";
import { join, dirname, resolve } from "node:path";

const ROOT = resolve(process.argv[2] || process.cwd());

// Öffentliche Seiten (indexierbar). Reihenfolge = Bericht-Reihenfolge.
const PAGES = [
  ["/",              "index.html"],
  ["/training",      "tfcz-training.html"],
  ["/firmenevents",  "tfcz-firmenevents.html"],
  ["/geschichte",    "tfcz-geschichte.html"],
  ["/ueber-uns",     "tfcz-ueber-uns.html"],
  ["/regeln",        "tfcz-regeln.html"],
  ["/medien",        "tfcz-medien.html"],
  ["/mitglied",      "mitglied.html"],
];
// noindex-/App-Seiten: nicht SEO-relevant, aber auf Indexierbarkeit geprüft.
const APP_PAGES = ["login.html", "dashboard.html"];

const TITLE_MIN = 30, TITLE_MAX = 62;
const DESC_MIN = 70, DESC_MAX = 160;
const KB = (b) => Math.round(b / 1024);

const findings = [];
const add = (sev, dim, page, msg) => findings.push({ sev, dim, page, msg });
const read = (rel) => { try { return readFileSync(join(ROOT, rel), "utf8"); } catch { return null; } };
const bytes = (abs) => { try { return statSync(abs).size; } catch { return 0; } };

const tagAttr = (tag, attr) => {
  const m = tag.match(new RegExp(`\\b${attr}\\s*=\\s*("([^"]*)"|'([^']*)'|([^\\s>]+))`, "i"));
  return m ? (m[2] ?? m[3] ?? m[4] ?? "") : null;
};
const metaContent = (html, key, val) => {
  const re = new RegExp(`<meta\\b[^>]*\\b${key}\\s*=\\s*["']${val}["'][^>]*>`, "i");
  const m = html.match(re);
  return m ? tagAttr(m[0], "content") : null;
};
const headOf = (html) => (html.match(/<head\b[^>]*>([\s\S]*?)<\/head>/i)?.[1]) || "";
const bodyOf = (html) => (html.match(/<body\b[^>]*>([\s\S]*?)<\/body>/i)?.[1]) || html;
const allTags = (html, name) => html.match(new RegExp(`<${name}\\b[^>]*>`, "gi")) || [];
const isExternal = (u) => /^https?:\/\//i.test(u) || u.startsWith("//");
const firstSrcset = (v) => (v || "").split(",")[0]?.trim().split(/\s+/)[0] || "";
const stripTags = (h) => h.replace(/<script[\s\S]*?<\/script>/gi, " ").replace(/<style[\s\S]*?<\/style>/gi, " ").replace(/<[^>]+>/g, " ").replace(/&[a-z#0-9]+;/gi, " ");

// --- Seitengewicht: Summe der referenzierten LOKALEN Ressourcen (Näherung wie Pro-Report) ---
function pageWeight(file, html) {
  const baseDir = dirname(join(ROOT, file));
  const seen = new Set();
  const w = { doc: bytes(join(ROOT, file)), css: 0, js: 0, img: 0, font: 0 };
  let heaviest = { name: file, kb: KB(w.doc), type: "document" };
  const external = new Set();
  const cssFiles = [];

  const consider = (url, type) => {
    if (!url) return;
    url = url.split("?")[0].split("#")[0];
    if (isExternal(url) || url.startsWith("data:")) { external.add(url.slice(0, 60)); return; }
    const abs = resolve(baseDir, url);
    if (seen.has(abs)) return;
    seen.add(abs);
    const b = bytes(abs);
    w[type] += b;
    if (type === "css") cssFiles.push(abs);
    if (KB(b) > heaviest.kb) heaviest = { name: url, kb: KB(b), type };
  };

  for (const t of allTags(html, "link"))
    if (/rel=["']?stylesheet/i.test(t)) consider(tagAttr(t, "href"), "css");
  for (const t of allTags(html, "script"))
    if (tagAttr(t, "src")) consider(tagAttr(t, "src"), "js");
  for (const t of allTags(html, "img")) {
    consider(tagAttr(t, "src"), "img");
    if (tagAttr(t, "srcset")) consider(firstSrcset(tagAttr(t, "srcset")), "img");
  }
  for (const t of allTags(html, "source")) {
    if (tagAttr(t, "srcset")) consider(firstSrcset(tagAttr(t, "srcset")), "img");
    if (tagAttr(t, "src")) consider(tagAttr(t, "src"), "img");
  }
  for (const cssAbs of cssFiles) {
    let css; try { css = readFileSync(cssAbs, "utf8"); } catch { continue; }
    for (const m of css.matchAll(/url\(\s*['"]?([^'")]+\.(?:woff2?|ttf|otf|eot))['"]?\s*\)/gi)) {
      const abs = resolve(dirname(cssAbs), m[1].split("?")[0]);
      if (seen.has(abs)) continue; seen.add(abs);
      const b = bytes(abs); w.font += b;
      if (KB(b) > heaviest.kb) heaviest = { name: m[1], kb: KB(b), type: "font" };
    }
  }
  w.total = w.doc + w.css + w.js + w.img + w.font;
  return { ...w, heaviest, external: [...external] };
}

const weights = [];
const pageMeta = []; // für Cross-Page-Checks (Titel/Description-Duplikate)

function analyzePage(urlPath, file) {
  const html = read(file);
  if (html === null) { add("HIGH", "seo", urlPath, `Datei fehlt: ${file}`); return; }
  const head = headOf(html);
  const body = bodyOf(html);

  // ---------- SEO / OnPage ----------
  const title = (html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1] || "").replace(/\s+/g, " ").trim();
  if (!title) add("HIGH", "seo", urlPath, "Kein <title>.");
  else if (title.length > TITLE_MAX) add("MEDIUM", "seo", urlPath, `Titel ${title.length} Z. (> ${TITLE_MAX}) — wird im SERP abgeschnitten.`);
  else if (title.length < TITLE_MIN) add("LOW", "seo", urlPath, `Titel nur ${title.length} Z. — mehr Kontext möglich.`);

  const desc = metaContent(html, "name", "description");
  if (!desc) add("HIGH", "seo", urlPath, "Keine Meta-Description.");
  else if (desc.length > DESC_MAX) add("MEDIUM", "seo", urlPath, `Description ${desc.length} Z. (> ${DESC_MAX}) — Schluss wird abgeschnitten.`);
  else if (desc.length < DESC_MIN) add("LOW", "seo", urlPath, `Description nur ${desc.length} Z. — kurz.`);
  pageMeta.push({ urlPath, title, desc });

  const h1 = (html.match(/<h1[\s>]/gi) || []).length;
  if (h1 === 0) add("HIGH", "seo", urlPath, "Keine H1.");
  else if (h1 > 1) add("MEDIUM", "seo", urlPath, `${h1} H1 — genau eine pro Seite als eindeutiger Anker.`);

  // Heading-Hierarchie: übersprungene Ebene (h1 -> h3)
  const hs = [...html.matchAll(/<h([1-6])[\s>]/gi)].map(m => +m[1]);
  let prev = 0, skip = false;
  for (const lvl of hs) { if (prev && lvl > prev + 1) skip = true; prev = lvl; }
  if (skip) add("LOW", "a11y", urlPath, "Überschriften-Ebene übersprungen (z. B. H2 → H4) — Gliederung für Screenreader/SEO unklar.");

  if (!html.match(/<link\b[^>]*rel=["']canonical["'][^>]*>/i)) add("MEDIUM", "seo", urlPath, "Kein Canonical.");
  if (!html.match(/<html\b[^>]*\blang=/i)) add("MEDIUM", "seo", urlPath, "Kein lang-Attribut am <html>.");

  // meta viewport / charset (Mobile & Encoding)
  if (!/<meta\b[^>]*name=["']viewport["']/i.test(head)) add("HIGH", "perf", urlPath, "Kein viewport-Meta — Seite ist auf dem Handy nicht responsiv.");
  if (!/<meta\b[^>]*charset=/i.test(head)) add("MEDIUM", "seo", urlPath, "Kein charset-Meta — Encoding nicht deklariert.");
  else { // charset sollte in den ersten 1024 Bytes / früh im <head> stehen
    const idx = head.search(/<meta\b[^>]*charset=/i);
    if (idx > 400) add("LOW", "seo", urlPath, "charset-Meta steht spät im <head> — gehört ganz nach vorne.");
  }
  if (/<meta\b[^>]*http-equiv=["']refresh["']/i.test(head)) add("MEDIUM", "seo", urlPath, "meta-refresh im Head — schlecht für SEO/Barrierefreiheit, per JS/Redirect lösen.");

  // ---------- AEO / Schema ----------
  const ld = html.match(/<script\b[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi) || [];
  if (ld.length === 0) add("MEDIUM", "aeo", urlPath, "Kein JSON-LD — kein maschinenlesbarer Kontext für Such-/KI-Maschinen.");
  else for (const block of ld) { try { JSON.parse(block.replace(/<[^>]+>/g, "")); } catch { add("MEDIUM", "aeo", urlPath, "JSON-LD lässt sich nicht parsen (Syntaxfehler)."); } }

  // ---------- Social / Sharing ----------
  const ogTitle = metaContent(html, "property", "og:title");
  const ogImage = metaContent(html, "property", "og:image");
  const ogUrl   = metaContent(html, "property", "og:url");
  const ogType  = metaContent(html, "property", "og:type");
  if (!ogTitle) add("LOW", "seo", urlPath, "Kein og:title — unschöne Teilen-Vorschau.");
  if (!ogImage) add("MEDIUM", "seo", urlPath, "Kein og:image — geteilte Links erscheinen ohne Vorschaubild.");
  if (!ogUrl)   add("LOW", "seo", urlPath, "Kein og:url.");
  if (!ogType)  add("LOW", "seo", urlPath, "Kein og:type.");
  if (!metaContent(html, "name", "twitter:card")) add("LOW", "seo", urlPath, "Keine twitter:card.");

  // Favicon / Touch-Icon / theme-color
  if (!/<link\b[^>]*rel=["'][^"']*icon[^"']*["']/i.test(head)) add("LOW", "seo", urlPath, "Kein Favicon (<link rel=icon>).");
  if (!/<meta\b[^>]*name=["']theme-color["']/i.test(head)) add("LOW", "seo", urlPath, "Kein theme-color-Meta (Browser-UI-Farbe auf Mobil).");

  // ---------- Accessibility & Bilder ----------
  const imgs = allTags(html, "img");
  let noAlt = 0, noDim = 0, lazy = 0, jpgWithWebp = 0, dataImg = 0;
  for (const tag of imgs) {
    if (tagAttr(tag, "alt") === null) noAlt++;
    if (tagAttr(tag, "width") === null || tagAttr(tag, "height") === null) noDim++;
    if ((tagAttr(tag, "loading") || "").toLowerCase() === "lazy") lazy++;
    const src = tagAttr(tag, "src") || "";
    if (/^data:/i.test(src)) dataImg++;
    if (/\.(jpe?g)$/i.test(src)) {
      const abs = resolve(dirname(join(ROOT, file)), src.split("?")[0]);
      if (existsSync(abs.replace(/\.(jpe?g)$/i, ".webp"))) jpgWithWebp++;
    }
  }
  if (noAlt > 0) add("MEDIUM", "a11y", urlPath, `${noAlt}/${imgs.length} Bilder ohne alt-Attribut.`);
  if (imgs.length > 0 && noDim === imgs.length) add("MEDIUM", "perf", urlPath, `Alle ${imgs.length} Bilder ohne width/height — Layout-Shift (CLS).`);
  else if (noDim > 0) add("LOW", "perf", urlPath, `${noDim}/${imgs.length} Bilder ohne width/height.`);
  if (jpgWithWebp > 0) add("MEDIUM", "perf", urlPath, `${jpgWithWebp} Bild(er) binden JPG ein, obwohl eine WebP-Variante im Repo liegt.`);
  if (imgs.length >= 5 && lazy === 0) add("LOW", "perf", urlPath, `${imgs.length} Bilder, kein loading="lazy".`);
  if (dataImg > 0) add("LOW", "perf", urlPath, `${dataImg} Inline-Base64-Bild(er) — blähen das HTML auf und sind nicht cachebar.`);

  // Links ohne Text/Label & Buttons ohne Namen (a11y)
  let emptyLinks = 0;
  for (const m of body.matchAll(/<a\b([^>]*)>([\s\S]*?)<\/a>/gi)) {
    const attrs = m[1], inner = stripTags(m[2]).trim();
    if (inner || /aria-label=|title=/i.test(attrs) || /<img\b[^>]*\balt=["'][^"']+["']/i.test(m[2])) continue;
    emptyLinks++;
  }
  if (emptyLinks > 0) add("MEDIUM", "a11y", urlPath, `${emptyLinks} Link(s) ohne erkennbaren Text/aria-label — Screenreader liest nur „Link".`);

  // Formularfelder ohne Label/aria-label
  let unlabeled = 0;
  for (const t of [...allTags(html, "input"), ...allTags(html, "select"), ...allTags(html, "textarea")]) {
    const type = (tagAttr(t, "type") || "").toLowerCase();
    if (["hidden", "submit", "button", "reset", "image"].includes(type)) continue;
    const id = tagAttr(t, "id");
    const hasLabel = id && new RegExp(`<label\\b[^>]*for=["']${id.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}["']`, "i").test(html);
    if (!hasLabel && tagAttr(t, "aria-label") === null && tagAttr(t, "aria-labelledby") === null && tagAttr(t, "placeholder") === null) unlabeled++;
  }
  if (unlabeled > 0) add("MEDIUM", "a11y", urlPath, `${unlabeled} Formularfeld(er) ohne Label/aria-label.`);

  // Doppelte id= (HTML-Validität, JS/a11y-Bezüge)
  const ids = {};
  for (const m of html.matchAll(/\bid\s*=\s*["']([^"']+)["']/gi)) ids[m[1]] = (ids[m[1]] || 0) + 1;
  const dupIds = Object.entries(ids).filter(([, n]) => n > 1).map(([k]) => k);
  if (dupIds.length) add("LOW", "a11y", urlPath, `Doppelte id(s): ${dupIds.slice(0, 5).join(", ")}${dupIds.length > 5 ? " …" : ""} — id muss eindeutig sein.`);

  // ---------- Sicherheit / Best Practice ----------
  if (/fonts\.googleapis\.com|fonts\.gstatic\.com/i.test(html))
    add("HIGH", "datenschutz", urlPath, "Google Fonts vom CDN geladen — überträgt Besucher-IP an Google (revDSG/DSGVO). Selbst hosten.");

  // target=_blank ohne rel=noopener → Reverse-Tabnabbing/Perf
  let unsafeBlank = 0;
  for (const t of allTags(html, "a")) {
    if (/target=["']?_blank/i.test(t) && !/rel=["'][^"']*noopener/i.test(t) && !/rel=["'][^"']*noreferrer/i.test(t)) unsafeBlank++;
  }
  if (unsafeBlank > 0) add("LOW", "security", urlPath, `${unsafeBlank} Link(s) mit target="_blank" ohne rel="noopener" — Reverse-Tabnabbing.`);

  // Mixed Content: http:// (nicht https) Ressourcen
  const mixed = new Set();
  for (const m of html.matchAll(/(?:src|href)\s*=\s*["'](http:\/\/[^"']+)["']/gi)) mixed.add(m[1].slice(0, 50));
  if (mixed.size) add("MEDIUM", "security", urlPath, `${mixed.size} Ressource(n) über unverschlüsseltes http:// — auf HTTPS blockiert (Mixed Content).`);

  const blocking = (head.match(/<script\b[^>]*\bsrc=[^>]*>/gi) || []).filter(s => !/\b(defer|async)\b/i.test(s)).length;
  if (blocking > 0) add("MEDIUM", "perf", urlPath, `${blocking} render-blockierende(s) Script(s) im <head> ohne defer/async.`);

  // ---------- Interne kaputte Links/Ressourcen ----------
  const baseDir = dirname(join(ROOT, file));
  const broken = new Set();
  const checkRef = (url) => {
    if (!url) return;
    url = url.trim();
    if (!url || url.startsWith("#") || url.startsWith("data:") || /^(mailto:|tel:|javascript:)/i.test(url)) return;
    if (isExternal(url)) return;
    if (/['"+{}]/.test(url) || url.includes("'+")) return; // JS-Templating (z. B. WhatsApp-Link)
    const clean = url.split("?")[0].split("#")[0];
    if (!clean) return;
    const abs = resolve(baseDir, clean);
    if (!existsSync(abs)) broken.add(clean);
  };
  for (const t of allTags(html, "a")) checkRef(tagAttr(t, "href"));
  for (const t of allTags(html, "link")) checkRef(tagAttr(t, "href"));
  for (const t of allTags(html, "img")) checkRef(tagAttr(t, "src"));
  for (const t of allTags(html, "script")) checkRef(tagAttr(t, "src"));
  if (broken.size) add("HIGH", "seo", urlPath, `${broken.size} interne(r) toter Link/Ressource: ${[...broken].slice(0, 4).join(", ")}${broken.size > 4 ? " …" : ""}`);

  // ---------- Inhaltstiefe ----------
  const words = stripTags(body).split(/\s+/).filter(Boolean).length;
  if (words < 120) add("LOW", "seo", urlPath, `Nur ~${words} Wörter Text — dünner Inhalt kann für Google „thin" wirken.`);

  // ---------- Seitengewicht ----------
  const w = pageWeight(file, html);
  weights.push({ page: urlPath, ...w });
  const totalKb = KB(w.total);
  if (totalKb > 4096) add("HIGH", "perf", urlPath, `Seitengewicht ~${totalKb} KB (> 4 MB) — auf Mobilfunk kaum benutzbar.`);
  else if (totalKb > 2048) add("MEDIUM", "perf", urlPath, `Seitengewicht ~${totalKb} KB (> 2 MB).`);
  if (w.heaviest.type === "img" && w.heaviest.kb > 1024)
    add("MEDIUM", "perf", urlPath, `Grösste Ressource: ${w.heaviest.name} (${w.heaviest.kb} KB) — verkleinern/komprimieren.`);
  else if (w.heaviest.kb > 500)
    add("LOW", "perf", urlPath, `Grösste Ressource: ${w.heaviest.name} (${w.heaviest.kb} KB).`);
}

for (const [u, f] of PAGES) analyzePage(u, f);

// ---------- Cross-Page-Checks ----------
const byTitle = {}, byDesc = {};
for (const p of pageMeta) {
  if (p.title) (byTitle[p.title] ||= []).push(p.urlPath);
  if (p.desc)  (byDesc[p.desc]  ||= []).push(p.urlPath);
}
for (const [t, ps] of Object.entries(byTitle))
  if (ps.length > 1) add("MEDIUM", "seo", ps.join(","), `Identischer <title> auf ${ps.length} Seiten — jede Seite braucht einen eigenen Titel.`);
for (const [d, ps] of Object.entries(byDesc))
  if (ps.length > 1) add("MEDIUM", "seo", ps.join(","), `Identische Meta-Description auf ${ps.length} Seiten — Duplikat verwässert das SERP-Snippet.`);

// Sitemap-Abdeckung: liegt jede öffentliche Seite in der sitemap.xml?
const sitemap = read("sitemap.xml");
if (sitemap) {
  const locs = [...sitemap.matchAll(/<loc>\s*([^<]+?)\s*<\/loc>/gi)].map(m => m[1].replace(/^https?:\/\/tfcz\.ch/, "").replace(/\/$/, "") || "/");
  for (const [u] of PAGES) {
    const norm = u.replace(/\/$/, "") || "/";
    if (!locs.includes(norm)) add("LOW", "seo", u, "Seite fehlt in der sitemap.xml — von Google schlechter auffindbar.");
  }
  if (!/<lastmod>/i.test(sitemap)) add("LOW", "seo", "site", "sitemap.xml ohne <lastmod> — Crawler erkennen Aktualität schlechter.");
}

// App-Seiten müssen noindex sein (dürfen NICHT in Google landen)
for (const f of APP_PAGES) {
  const html = read(f);
  if (html === null) continue;
  if (!/<meta\b[^>]*name=["']robots["'][^>]*noindex/i.test(html))
    add("MEDIUM", "seo", "/" + f.replace(/\.html$/, ""), "App-/Login-Seite ohne <meta robots noindex> — kann versehentlich in Google landen.");
}

// ---------- Site-weit ----------
const robots = read("robots.txt");
if (!robots) add("MEDIUM", "aeo", "site", "Keine robots.txt.");
else if (!/sitemap:/i.test(robots)) add("LOW", "seo", "site", "robots.txt nennt die Sitemap nicht (Sitemap:-Zeile).");
if (!sitemap) add("MEDIUM", "seo", "site", "Keine sitemap.xml.");
if (!read("llms.txt")) add("LOW", "aeo", "site", "Keine llms.txt (KI-Auffindbarkeit).");
if (!existsSync(join(ROOT, "404.html"))) add("LOW", "seo", "site", "Keine 404.html — GitHub zeigt Standard-Fehlerseite.");

const launch = [];
if (!existsSync(join(ROOT, "CNAME")))
  launch.push("Kein CNAME committet → läuft auf github.io. Vor Go-Live: Custom Domain tfcz.ch setzen und Canonical/Sitemap-URLs mit dem realen Ausliefer-Pfad in Übereinstimmung bringen.");
launch.push("Security-Header (CSP/HSTS/X-Frame-Options): auf GitHub Pages nicht setzbar — beim Go-Live via Proxy (z. B. Cloudflare) ergänzen.");
launch.push("Kompression (br/gzip) & Cache-Control: serverseitig, auf GitHub Pages gesetzt — gegen die Live-URL gegenprüfen (nicht aus dem Code messbar).");
launch.push("DMARC/SPF/DKIM: nur relevant, wenn über tfcz.ch Mails versendet werden — in der DNS-Zone prüfen.");
launch.push("Echte Core Web Vitals im Browser: `node _tools/audit-perf.mjs` (Playwright) misst FCP/LCP/CLS/TTFB/Load je Seite lokal; im Feld zusätzlich PageSpeed Insights auf die Live-URL.");

// === Bericht ===
const order = { HIGH: 0, MEDIUM: 1, LOW: 2 };
findings.sort((a, b) => order[a.sev] - order[b.sev]);
const nH = findings.filter(f => f.sev === "HIGH").length;
const nM = findings.filter(f => f.sev === "MEDIUM").length;
const nL = findings.filter(f => f.sev === "LOW").length;

const C = { HIGH: "\x1b[31m", MEDIUM: "\x1b[33m", LOW: "\x1b[90m", off: "\x1b[0m", b: "\x1b[1m", g: "\x1b[32m" };
console.log(`\n${C.b}TFCZ Standards-Audit (statisch)${C.off}  —  ${ROOT}`);
console.log(`${C.HIGH}${nH} HIGH${C.off} · ${C.MEDIUM}${nM} MEDIUM${C.off} · ${C.LOW}${nL} LOW${C.off}\n`);
for (const f of findings)
  console.log(`${C[f.sev]}${f.sev.padEnd(6)}${C.off} [${f.dim.padEnd(11)}] ${f.page.padEnd(16)} ${f.msg}`);

console.log(`\n${C.b}Seitengewicht (referenzierte lokale Ressourcen, Näherung):${C.off}`);
console.log(`  ${"Seite".padEnd(16)} ${"Doc".padStart(6)} ${"CSS".padStart(6)} ${"JS".padStart(6)} ${"Bild".padStart(7)} ${"Font".padStart(6)} ${"GESAMT".padStart(8)}`);
for (const w of weights)
  console.log(`  ${w.page.padEnd(16)} ${(KB(w.doc)+"K").padStart(6)} ${(KB(w.css)+"K").padStart(6)} ${(KB(w.js)+"K").padStart(6)} ${(KB(w.img)+"K").padStart(7)} ${(KB(w.font)+"K").padStart(6)} ${(KB(w.total)+"K").padStart(8)}`);
if (weights.some(w => w.external.length))
  console.log(`  (Extern nicht mitgezählt, z. B. CDN — separat als Befund, falls relevant.)`);

console.log(`\n${C.b}Launch/Hosting & Live-Messung (N/A auf Test-Host — Go-Live-Checkliste):${C.off}`);
for (const l of launch) console.log(`  • ${l}`);

const jsonPath = join(ROOT, "_tools", "audit-report.json");
try {
  mkdirSync(dirname(jsonPath), { recursive: true });
  writeFileSync(jsonPath, JSON.stringify({ root: ROOT, summary: { HIGH: nH, MEDIUM: nM, LOW: nL }, findings, weights, launch }, null, 2));
  console.log(`\nJSON-Befunde: ${jsonPath}`);
} catch { /* optional */ }

console.log(nH === 0
  ? `\n${C.g}✓ Keine HIGH-Befunde — Audit-Gate offen.${C.off}`
  : `\n${C.HIGH}✗ ${nH} HIGH-Befund(e) — erst beheben (über tfcz-web-build → tfcz-design-qa), dann Audit erneut laufen lassen.${C.off}`);

process.exit(nH === 0 ? 0 : 1);
