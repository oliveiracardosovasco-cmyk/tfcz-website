#!/usr/bin/env node
/* ============================================================
   TFCZ · Seiten-Sichtbarkeit ins HTML backen.

   Warum es das gibt: Die Website liegt statisch auf GitHub Pages. Der Schalter
   im Portal (seiten.html) wirkt zur Laufzeit — Menü, Links und der Pausiert-
   Hinweis folgen sofort. Aber HTML, Suchmaschinen und die Sitemap wissen davon
   nichts. Dieser Lauf schreibt den Stand beim Veröffentlichen FEST:

     1. holt den aktuellen Stand von okapi (/api/settings/public/website)
        — ist der Server weg, bleibt der Stand, der schon in seiten.js steht
     2. schreibt ihn in den STAND-Block von system/seiten.js
        (damit ein neuer Besucher ohne Zwischenspeicher sofort das Richtige sieht)
     3. setzt auf jeder pausierten Seite  <meta name="robots" content="noindex,follow">
        und nimmt sie wieder weg, sobald die Seite live ist
     4. baut sitemap.xml aus _tools/sitemap.quelle.xml ohne die pausierten Seiten
        (die Zuordnung Datei -> URL kommt aus dem <link rel="canonical"> der Seite)
     5. trägt bei Seiten mit mehreren Fassungen die aktive als
        data-variante-standard="…" ins <html>-Tag ein — kein Flackern beim Laden

   Aufruf:  node _tools/bake-seiten.mjs [projekt-root]   — läuft im Publish automatisch.
   ============================================================ */
import { readFileSync, writeFileSync, existsSync, copyFileSync } from "node:fs";
import { join } from "node:path";

const ROOT = process.argv[2] || process.cwd();
const API  = (process.env.TFCZ_OKAPI || "https://tfvzuerich.ch/api").replace(/\/+$/, "");
const JS   = join(ROOT, "system/seiten.js");
const MARK_A = "/* ==== STAND-ANFANG";
const MARK_E = "/* ==== STAND-ENDE ==== */";

/* ---------- 1 · Stand ermitteln ---------- */
let quelltext = readFileSync(JS, "utf8");
const roh = quelltext.slice(quelltext.indexOf(MARK_A), quelltext.indexOf(MARK_E));
const jsonImCode = roh.slice(roh.indexOf("{"), roh.lastIndexOf("}") + 1);
let stand;
try { stand = JSON.parse(jsonImCode); }
catch { console.error("  ! STAND-Block in system/seiten.js ist kein gültiges JSON — Abbruch."); process.exit(1); }

let quelle = "eingebackener Stand (Server nicht gefragt)";
try {
  const stop = AbortSignal.timeout ? AbortSignal.timeout(6000) : undefined;
  const r = await fetch(API + "/settings/public/website", { signal: stop });
  if (r.ok) {
    const j = await r.json();
    const d = j?.data?.website_seiten || j?.data;
    if (d?.seiten) { stand = d; quelle = "okapi (" + API + ")"; }
  } else quelle = "eingebackener Stand (Server antwortete " + r.status + ")";
} catch { quelle = "eingebackener Stand (Server nicht erreichbar)"; }

console.log("\nSeiten-Sichtbarkeit — Quelle: " + quelle);

/* ---------- 2 · STAND-Block neu schreiben ---------- */
const neuerBlock =
  MARK_A + " · wird beim Veröffentlichen geschrieben (_tools/bake-seiten.mjs) ====\n" +
  "     Von Hand ändern ist erlaubt, aber der nächste Publish überschreibt es mit\n" +
  "     dem Stand aus dem Portal. */\n" +
  "  var STAND = " + JSON.stringify(stand, null, 2).replace(/\n/g, "\n  ") + ";\n  ";
quelltext = quelltext.slice(0, quelltext.indexOf(MARK_A)) + neuerBlock + quelltext.slice(quelltext.indexOf(MARK_E));
writeFileSync(JS, quelltext);

const seiten = stand.seiten || {};
const pausiert = Object.keys(seiten).filter(d => seiten[d]?.status === "pausiert");
console.log("  Stand vom " + (stand.stand || "?") + " · " +
  (pausiert.length ? "pausiert: " + pausiert.join(", ") : "alle Seiten live"));

/* ---------- 3 + 5 · robots-Meta und aktive Fassung je Seite ---------- */
const META = '<meta name="robots" content="noindex,follow" data-tfcz-pause>';
let geaendert = 0;

for (const datei of Object.keys(seiten)) {
  const pfad = join(ROOT, datei);
  if (!existsSync(pfad)) { console.log("  ! " + datei + " gibt es nicht (mehr) — übersprungen"); continue; }
  let html = readFileSync(pfad, "utf8");
  const vorher = html;

  /* robots */
  html = html.replace(/\n?[ \t]*<meta name="robots"[^>]*data-tfcz-pause[^>]*>/g, "");
  if (seiten[datei].status === "pausiert") {
    html = html.replace(/(<meta charset="[^"]*">)/i, "$1\n" + META);
  }

  /* aktive Fassung ins <html>-Tag UND in die Rückfall-Regel der Seite */
  const v = seiten[datei].variante;
  if (v) {
    html = /data-variante-standard="[^"]*"/.test(html)
      ? html.replace(/data-variante-standard="[^"]*"/, 'data-variante-standard="' + v + '"')
      : html.replace(/<html\b([^>]*)>/i, '<html$1 data-variante-standard="' + v + '">');
    /* Greift nur, wenn seiten.js gar nicht lädt — dann steht die richtige Fassung da. */
    html = html.replace(
      /(<style id="tfcz-var-fallback">)[\s\S]*?(<\/style>)/,
      '$1html:not([data-variante]) [data-var]:not([data-var~="' + v + '"]){display:none}$2');
  }

  if (html !== vorher) { writeFileSync(pfad, html); geaendert++; console.log("  " + datei.padEnd(26) + " angepasst"); }
}

/* ---------- 4 · Sitemap ---------- */
const sitemap = join(ROOT, "sitemap.xml");
const vorlage = join(ROOT, "_tools/sitemap.quelle.xml");
if (existsSync(sitemap)) {
  if (!existsSync(vorlage)) { copyFileSync(sitemap, vorlage); console.log("  sitemap.quelle.xml angelegt (Vollbestand als Vorlage)"); }
  let xml = readFileSync(vorlage, "utf8");

  /* Datei -> Sitemap-URL über das canonical der Seite */
  const raus = [];
  for (const datei of pausiert) {
    const pfad = join(ROOT, datei);
    if (!existsSync(pfad)) continue;
    const m = readFileSync(pfad, "utf8").match(/<link rel="canonical" href="([^"]+)"/i);
    if (m) raus.push(m[1].replace(/\/$/, ""));
  }
  let weg = 0;
  for (const url of raus) {
    const re = new RegExp("[ \\t]*<url>(?:(?!</url>)[\\s\\S])*?<loc>" + url.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + "/?</loc>[\\s\\S]*?</url>\\n?", "g");
    const vor = xml; xml = xml.replace(re, "");
    if (xml !== vor) weg++;
  }
  writeFileSync(sitemap, xml);
  console.log("  sitemap.xml geschrieben · " + weg + " von " + raus.length + " pausierten Seiten entfernt");
}

console.log("Fertig: " + geaendert + " Seite(n) angepasst.\n");
