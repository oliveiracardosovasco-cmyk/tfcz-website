#!/usr/bin/env node
/* TFCZ — Slot-Bilder ins HTML backen.
   Liest assets/fotos/galerie/mapping.json (die Quelle der Wahrheit) und schreibt
   für jedes <img data-slot="K"> das gemappte Bild direkt ins src. Damit lädt sofort
   das richtige Bild (kein Platzhalter-Flash, kein Doppel-Laden). Karussell-Slots
   (Array/Objekt im Mapping) bleiben dem JS überlassen. Hintergrund-<div>-Slots
   ebenfalls (die zeigen keinen falschen Zwischenzustand).
   Aufruf:  node _tools/bake-slots.mjs [projekt-root]   — VOR jedem Veröffentlichen. */
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
const ROOT = process.argv[2] || process.cwd();
const map = JSON.parse(readFileSync(join(ROOT, "assets/fotos/galerie/mapping.json"), "utf8"));
const PAGES = ["index.html","tfcz-training.html","tfcz-firmenevents.html","tfcz-geschichte.html",
  "tfcz-ueber-uns.html","tfcz-regeln.html","tfcz-medien.html","mitglied.html","login.html","dashboard.html"];
let total = 0;
for (const p of PAGES) {
  let html; try { html = readFileSync(join(ROOT, p), "utf8"); } catch { continue; }
  let changed = 0, skipped = 0;
  html = html.replace(/<img\b[^>]*\bdata-slot="([^"]+)"[^>]*>/gi, (tag, key) => {
    const v = map[key];
    if (typeof v !== "string") { skipped++; return tag; }   // Karussell -> JS
    let out = /\bsrc="/.test(tag) ? tag.replace(/(\bsrc=")[^"]*(")/, `$1${v}$2`)
                                  : tag.replace(/<img\b/i, `<img src="${v}"`);
    if (out !== tag) changed++;
    return out;
  });
  if (changed) writeFileSync(join(ROOT, p), html);
  total += changed;
  if (changed || skipped) console.log(`  ${p.padEnd(26)} ${changed} gebacken${skipped?`, ${skipped} Karussell übersprungen`:""}`);
}
console.log(`\n${total} Slot-<img> ins src gebacken.`);
