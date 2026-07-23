#!/usr/bin/env node
/**
 * TFCZ Accessibility- & Best-Practices-Audit (echter Browser) — wie die Profi-Tools.
 *
 * Nutzt dieselbe Engine wie Google Lighthouse: **axe-core** (Deque). Prüft je Seite
 * echte WCAG-Verstösse (Farbkontrast, ARIA, fehlende Namen, Formular-Labels, …) und
 * dazu die Lighthouse-Best-Practices/Mobile-Checks, die ein statischer Scan nicht kann:
 *
 *   • axe-core WCAG-Verstösse nach Schwere (critical/serious/moderate/minor)
 *   • Konsolen-Fehler & Seiten-Fehler beim Laden (Best Practices)
 *   • Tap-Targets zu klein (< 24 px, WCAG 2.2 Target Size)
 *   • Lesbare Schriftgrössen (Anteil Text < 12 px)
 *
 * Voraussetzung: playwright + axe-core installiert. Fehlt eins, meldet das Skript das
 * ehrlich und bricht mit Exit 2 ab. Reine MESSUNG, ändert nie Dateien.
 *   npm i -D playwright axe-core  &&  npx playwright install chromium
 *   node _tools/audit-a11y.mjs [projekt-root]
 * Ausgabe: Tabelle + `_tools/audit-a11y.json`.
 */
import { createServer } from "node:http";
import { readFileSync, existsSync, statSync, writeFileSync } from "node:fs";
import { join, resolve, extname } from "node:path";
import { createRequire } from "node:module";

const ROOT = resolve(process.argv[2] || process.cwd());
const PAGES = [
  ["/","index.html"],["/training","tfcz-training.html"],["/firmenevents","tfcz-firmenevents.html"],
  ["/geschichte","tfcz-geschichte.html"],["/ueber-uns","tfcz-ueber-uns.html"],["/regeln","tfcz-regeln.html"],
  ["/medien","tfcz-medien.html"],["/mitglied","mitglied.html"],
];
const MIME={".html":"text/html",".css":"text/css",".js":"text/javascript",".json":"application/json",".svg":"image/svg+xml",".png":"image/png",".jpg":"image/jpeg",".jpeg":"image/jpeg",".webp":"image/webp",".woff2":"font/woff2",".woff":"font/woff",".ttf":"font/ttf",".ico":"image/x-icon",".xml":"application/xml",".txt":"text/plain"};

const req = createRequire(import.meta.url);
let chromium, axePath;
try {
  try { ({ chromium } = await import("playwright")); } catch { chromium = req("playwright").chromium; }
  axePath = req.resolve("axe-core/axe.min.js");
} catch {
  console.error("\x1b[31mplaywright oder axe-core fehlt.\x1b[0m  Einmalig: npm i -D playwright axe-core && npx playwright install chromium");
  process.exit(2);
}
const AXE = readFileSync(axePath, "utf8");

const server = createServer((rq, rs) => {
  try { let p = decodeURIComponent(rq.url.split("?")[0]); if (p.endsWith("/")) p += "index.html";
    const abs = join(ROOT, p);
    if (!abs.startsWith(ROOT) || !existsSync(abs) || statSync(abs).isDirectory()) { rs.writeHead(404); rs.end(); return; }
    rs.writeHead(200, { "Content-Type": MIME[extname(abs).toLowerCase()] || "application/octet-stream" }); rs.end(readFileSync(abs));
  } catch { rs.writeHead(500); rs.end(); }
});
await new Promise(r => server.listen(0, r));
const PORT = server.address().port;

const browser = await chromium.launch({ args: ["--no-sandbox"] });
const results = [];

for (const [urlPath, file] of PAGES) {
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true });
  const page = await ctx.newPage();
  const consoleErrors = [];
  page.on("console", m => { if (m.type() === "error") consoleErrors.push(m.text().slice(0, 140)); });
  page.on("pageerror", e => consoleErrors.push(String(e.message || e).slice(0, 140)));
  let rec = { page: urlPath, file, ok: true };
  try {
    await page.goto(`http://localhost:${PORT}/${file}`, { waitUntil: "networkidle", timeout: 30000 });
    await page.waitForTimeout(400);
    // axe-core injizieren + laufen lassen
    await page.evaluate(AXE);
    const axe = await page.evaluate(async () => {
      const r = await window.axe.run(document, { resultTypes: ["violations"], runOnly: { type: "tag", values: ["wcag2a","wcag2aa","wcag21a","wcag21aa","best-practice"] } });
      const byImpact = { critical: 0, serious: 0, moderate: 0, minor: 0 };
      const rules = [];
      for (const v of r.violations) { byImpact[v.impact] = (byImpact[v.impact] || 0) + v.nodes.length; rules.push({ id: v.id, impact: v.impact, help: v.help, n: v.nodes.length }); }
      return { byImpact, rules, total: r.violations.reduce((s,v)=>s+v.nodes.length,0) };
    });
    // Tap-Targets < 24px & lesbare Schriften
    const ux = await page.evaluate(() => {
      const vis = el => { const r = el.getBoundingClientRect(); const s = getComputedStyle(el); return r.width>0 && r.height>0 && s.visibility!=="hidden" && s.display!=="none"; };
      let smallTargets = 0, targets = 0;
      for (const el of document.querySelectorAll('a,button,input:not([type=hidden]),select,[role=button]')) {
        if (!vis(el)) continue; targets++;
        const r = el.getBoundingClientRect();
        if (r.width < 24 || r.height < 24) smallTargets++;
      }
      // Schriftgrössen: Anteil Textzeichen < 12px
      let small = 0, totalCh = 0;
      const walk = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
      let node;
      while ((node = walk.nextNode())) {
        const t = node.textContent.trim(); if (!t) continue;
        const el = node.parentElement; if (!el) continue;
        const s = getComputedStyle(el); if (s.display==="none"||s.visibility==="hidden") continue;
        const fs = parseFloat(s.fontSize) || 16;
        totalCh += t.length; if (fs < 12) small += t.length;
      }
      return { smallTargets, targets, smallFontPct: totalCh ? Math.round(small/totalCh*100) : 0 };
    });
    rec = { ...rec, axe, ...ux, consoleErrors: consoleErrors.length, consoleSample: consoleErrors.slice(0,3) };
  } catch (e) { rec.ok = false; rec.err = String(e.message || e).split("\n")[0]; }
  results.push(rec);
  await ctx.close();
}
await browser.close(); server.close();

// --- Bericht ---
const C = { off:"\x1b[0m", b:"\x1b[1m", g:"\x1b[32m", y:"\x1b[33m", r:"\x1b[31m", dim:"\x1b[90m" };
const sum = k => results.reduce((s,x)=>s+(x.ok?(x.axe.byImpact[k]||0):0),0);
console.log(`\n${C.b}TFCZ Accessibility-Audit (axe-core · echte WCAG-Prüfung, Mobil-Profil)${C.off}`);
console.log(`Verstösse gesamt: ${C.r}${sum("critical")} critical${C.off} · ${C.r}${sum("serious")} serious${C.off} · ${C.y}${sum("moderate")} moderate${C.off} · ${C.dim}${sum("minor")} minor${C.off}\n`);
console.log(`  ${"Seite".padEnd(15)} ${"crit".padStart(5)} ${"serious".padStart(7)} ${"moder".padStart(6)} ${"minor".padStart(6)} ${"Tap<24".padStart(7)} ${"Font<12".padStart(8)} ${"Konsole".padStart(8)}`);
for (const r of results) {
  if (!r.ok) { console.log(`  ${r.page.padEnd(15)} ${C.r}Fehler: ${r.err}${C.off}`); continue; }
  const bi = r.axe.byImpact;
  console.log(`  ${r.page.padEnd(15)} ${String(bi.critical||0).padStart(5)} ${String(bi.serious||0).padStart(7)} ${String(bi.moderate||0).padStart(6)} ${String(bi.minor||0).padStart(6)} ${String(r.smallTargets+"/"+r.targets).padStart(7)} ${(r.smallFontPct+"%").padStart(8)} ${String(r.consoleErrors).padStart(8)}`);
}
// häufigste Regeln
const ruleAgg = {};
for (const r of results) if (r.ok) for (const rl of r.axe.rules) { ruleAgg[rl.id] = ruleAgg[rl.id] || { id: rl.id, impact: rl.impact, help: rl.help, n: 0, pages: 0 }; ruleAgg[rl.id].n += rl.n; ruleAgg[rl.id].pages++; }
const topRules = Object.values(ruleAgg).sort((a,b)=>b.n-a.n);
if (topRules.length) {
  console.log(`\n${C.b}Häufigste WCAG-Regeln:${C.off}`);
  for (const rl of topRules.slice(0,12)) console.log(`  ${C[rl.impact==='critical'||rl.impact==='serious'?'r':'y']}${(rl.impact||'').padEnd(9)}${C.off} ${rl.id.padEnd(26)} ${rl.n}× auf ${rl.pages} Seite(n) — ${rl.help}`);
} else console.log(`\n${C.g}✓ axe-core meldet keine WCAG-Verstösse.${C.off}`);

writeFileSync(join(ROOT,"_tools","audit-a11y.json"), JSON.stringify({ root: ROOT, results, topRules, totals:{critical:sum("critical"),serious:sum("serious"),moderate:sum("moderate"),minor:sum("minor")} }, null, 2));
console.log(`\nJSON: ${join(ROOT,"_tools","audit-a11y.json")}`);
