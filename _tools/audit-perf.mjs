#!/usr/bin/env node
/**
 * TFCZ Performance-Audit (echter Browser) — misst ECHTE Ladezeiten je Seite.
 *
 * Ergänzt das statische `_tools/audit.mjs`: startet einen lokalen Server über das
 * Projekt und lädt jede öffentliche Seite in echtem Chromium (Playwright). Gemessen
 * werden die Kennzahlen, die ein externer Auditor (Lighthouse/PageSpeed-Stil) meldet:
 *
 *   TTFB · FCP · LCP · CLS · DOMContentLoaded · Load · übertragene Bytes · Requests.
 *
 * Voraussetzung: Node-Playwright + Chromium installiert. Falls nicht vorhanden,
 * meldet das Skript das ehrlich und bricht sauber ab (kein Schätzen).
 *
 *   npm i -D playwright  &&  npx playwright install chromium      # einmalig
 *   node _tools/audit-perf.mjs [projekt-root]
 *
 * Ausgabe: Tabelle + `_tools/audit-perf.json`. Reine MESSUNG, ändert nie Dateien.
 * Hinweis: lokal (localhost) gibt es keine Netz-Latenz/keine Kompression wie live —
 * die Zahlen sind untere Schranken. Für Feld-Werte zusätzlich PageSpeed Insights.
 */
import { createServer } from "node:http";
import { readFileSync, existsSync, statSync, writeFileSync } from "node:fs";
import { join, resolve, extname } from "node:path";

const ROOT = resolve(process.argv[2] || process.cwd());

const PAGES = [
  ["/",              "index.html"],
  ["/training",      "tfcz-training.html"],
  ["/firmenevents",  "tfcz-firmenevents.html"],
  ["/geschichte",    "tfcz-geschichte.html"],
  ["/ueber-uns",     "tfcz-ueber-uns.html"],
  ["/regeln",        "tfcz-regeln.html"],
  ["/medien",        "tfcz-medien.html"],
  ["/mitglied",      "mitglied.html"],
  ["/zueri-open-2",  "zueri-pro-tour-2-eroeffnung.html"],
];

const MIME = {
  ".html": "text/html; charset=utf-8", ".css": "text/css", ".js": "text/javascript",
  ".mjs": "text/javascript", ".json": "application/json", ".svg": "image/svg+xml",
  ".png": "image/png", ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".webp": "image/webp",
  ".gif": "image/gif", ".ico": "image/x-icon", ".woff": "font/woff", ".woff2": "font/woff2",
  ".ttf": "font/ttf", ".otf": "font/otf", ".txt": "text/plain", ".xml": "application/xml",
};

import { createRequire } from "node:module";
let chromium;
try {
  // erst als ESM (in-project installiert), sonst per require (auch global auffindbar)
  try { ({ chromium } = await import("playwright")); }
  catch { chromium = createRequire(import.meta.url)("playwright").chromium; }
} catch {
  console.error("\x1b[31mPlaywright ist nicht installiert.\x1b[0m");
  console.error("Einmalig:  npm i -D playwright  &&  npx playwright install chromium");
  console.error("Dann:      node _tools/audit-perf.mjs");
  process.exit(2);
}

// --- kleiner statischer Server über ROOT ---
const server = createServer((req, res) => {
  try {
    let p = decodeURIComponent(req.url.split("?")[0]);
    if (p.endsWith("/")) p += "index.html";
    const abs = join(ROOT, p);
    if (!abs.startsWith(ROOT) || !existsSync(abs) || statSync(abs).isDirectory()) {
      res.writeHead(404); res.end("404"); return;
    }
    res.writeHead(200, { "Content-Type": MIME[extname(abs).toLowerCase()] || "application/octet-stream" });
    res.end(readFileSync(abs));
  } catch { res.writeHead(500); res.end("500"); }
});
await new Promise(r => server.listen(0, r));
const PORT = server.address().port;
const BASE = `http://localhost:${PORT}`;

// Observer VOR jeglichem Seiten-Script registrieren
const INIT = `
window.__vitals = { lcp: 0, cls: 0, fcp: 0 };
try {
  new PerformanceObserver((l) => { for (const e of l.getEntries()) window.__vitals.lcp = e.startTime; })
    .observe({ type: 'largest-contentful-paint', buffered: true });
  new PerformanceObserver((l) => { for (const e of l.getEntries()) if (!e.hadRecentInput) window.__vitals.cls += e.value; })
    .observe({ type: 'layout-shift', buffered: true });
  new PerformanceObserver((l) => { for (const e of l.getEntries()) if (e.name === 'first-contentful-paint') window.__vitals.fcp = e.startTime; })
    .observe({ type: 'paint', buffered: true });
} catch (e) {}
`;

const browser = await chromium.launch({ executablePath: process.env.PW_CHROMIUM || undefined, args: ["--no-sandbox"] });
const results = [];

for (const [urlPath, file] of PAGES) {
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 }); // Mobil-Profil
  const page = await ctx.newPage();
  await page.addInitScript(INIT);
  let ok = true, err = "";
  try {
    await page.goto(`${BASE}/${file}`, { waitUntil: "load", timeout: 30000 });
    await page.waitForTimeout(2500); // LCP/CLS nachwirken lassen
    // sanft scrollen, damit lazy-Bilder & späte Shifts erfasst werden
    await page.evaluate(() => new Promise(r => { let y = 0; const t = setInterval(() => { window.scrollBy(0, 600); y += 600; if (y > document.body.scrollHeight) { clearInterval(t); r(); } }, 100); }));
    await page.waitForTimeout(800);
  } catch (e) { ok = false; err = String(e.message || e).split("\n")[0]; }

  let m = null;
  try {
    m = await page.evaluate(() => {
      const nav = performance.getEntriesByType("navigation")[0] || {};
      const res = performance.getEntriesByType("resource");
      const byType = {}; let bytes = 0, biggest = { name: "", kb: 0 };
      for (const r of res) {
        const t = r.initiatorType || "other";
        const b = r.transferSize || r.encodedBodySize || 0;
        byType[t] = (byType[t] || 0) + 1;
        bytes += b;
        if (b / 1024 > biggest.kb) biggest = { name: (r.name.split("/").pop() || r.name).split("?")[0], kb: Math.round(b / 1024) };
      }
      const docBytes = (nav.transferSize || nav.encodedBodySize || 0);
      return {
        ttfb: Math.round((nav.responseStart || 0) - (nav.requestStart || 0)),
        fcp: Math.round(window.__vitals.fcp),
        lcp: Math.round(window.__vitals.lcp),
        cls: +window.__vitals.cls.toFixed(3),
        dcl: Math.round(nav.domContentLoadedEventEnd || 0),
        load: Math.round(nav.loadEventEnd || 0),
        requests: res.length + 1,
        transferKb: Math.round((bytes + docBytes) / 1024),
        byType, biggest,
      };
    });
  } catch (e) { if (ok) { ok = false; err = String(e.message || e).split("\n")[0]; } }

  results.push({ page: urlPath, file, ok, err, ...(m || {}) });
  await ctx.close();
}

await browser.close();
server.close();

// --- Bewertung (Lighthouse-nahe Schwellen, mobil) ---
const rate = (v, good, poor) => v <= good ? "gut" : v <= poor ? "okay" : "schlecht";
const TH = {
  lcp: [2500, 4000], fcp: [1800, 3000], cls: [0.1, 0.25],
  load: [3000, 6000], ttfb: [800, 1800],
};
const C = { off: "\x1b[0m", b: "\x1b[1m", g: "\x1b[32m", y: "\x1b[33m", r: "\x1b[31m", dim: "\x1b[90m" };
const col = (r) => r === "gut" ? C.g : r === "okay" ? C.y : C.r;

console.log(`\n${C.b}TFCZ Performance-Audit (echter Chromium, Mobil-Profil 390px, lokal)${C.off}`);
console.log(`${C.dim}localhost ohne Netz-Latenz/Kompression → Werte sind untere Schranken; live via PageSpeed gegenprüfen.${C.off}\n`);
const H = `  ${"Seite".padEnd(15)} ${"TTFB".padStart(6)} ${"FCP".padStart(6)} ${"LCP".padStart(6)} ${"CLS".padStart(6)} ${"DCL".padStart(6)} ${"Load".padStart(6)} ${"Req".padStart(4)} ${"Bytes".padStart(7)}`;
console.log(C.b + H + C.off);
for (const r of results) {
  if (!r.ok && r.load == null) { console.log(`  ${r.page.padEnd(15)} ${C.r}Fehler: ${r.err}${C.off}`); continue; }
  const cell = (v, key, unit = "ms") => {
    const s = key === "cls" ? v.toFixed(3) : v + (unit === "ms" ? "" : "");
    return `${col(rate(v, ...TH[key]))}${String(s).padStart(6)}${C.off}`;
  };
  console.log(
    `  ${r.page.padEnd(15)} ${cell(r.ttfb,"ttfb")} ${cell(r.fcp,"fcp")} ${cell(r.lcp,"lcp")} ${cell(r.cls,"cls")} ` +
    `${String(r.dcl).padStart(6)} ${cell(r.load,"load")} ${String(r.requests).padStart(4)} ${(r.transferKb+"K").padStart(7)}`
  );
}
console.log(`\n${C.dim}Zeiten in ms · CLS = Layout-Shift-Score (0 = kein Springen) · Bytes = übertragen (lokal, unkomprimiert).${C.off}`);
console.log(`${C.dim}Schwellen (mobil): LCP ≤2500 gut / ≤4000 okay · FCP ≤1800/3000 · CLS ≤0.1/0.25 · Load ≤3000/6000 · TTFB ≤800/1800.${C.off}`);

const worst = results.filter(r => r.ok);
const slowLcp = worst.filter(r => r.lcp > 4000).map(r => r.page);
const highCls = worst.filter(r => r.cls > 0.25).map(r => r.page);
if (slowLcp.length) console.log(`\n${C.r}LCP schlecht (> 4 s):${C.off} ${slowLcp.join(", ")}`);
if (highCls.length) console.log(`${C.r}CLS schlecht (> 0.25):${C.off} ${highCls.join(", ")}`);

const outPath = join(ROOT, "_tools", "audit-perf.json");
try { writeFileSync(outPath, JSON.stringify({ root: ROOT, base: BASE, results }, null, 2)); console.log(`\nJSON: ${outPath}`); } catch {}
