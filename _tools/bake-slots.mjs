#!/usr/bin/env node
/* TFCZ — Slot-Bilder ins HTML backen.
   Liest assets/fotos/galerie/mapping.json (Quelle der Wahrheit) und schreibt für jedes
   <img data-slot="K"> auf JEDER Seite:  (1) das gemappte Bild direkt ins src (kein Flash),
   (2) loading="lazy" ausser Hero-Slots (die bleiben eager fürs LCP), (3) decoding="async".
   Karussell-Slots (Array/Objekt) und Hintergrund-<div> bleiben dem JS überlassen.
   CLS ist bereits über die CSS-Container (feste/geclampte Höhe + object-fit) gelöst → keine width/height.

   AUTO-DISCOVERY: verarbeitet automatisch alle *.html im Projekt-Root — neue Seiten also ohne
   Zutun. Ausgeschlossen sind nur Tools/Demos (Brandguide, Design-Studio, Widgets), weil die
   data-slot in Code-Beispielen zeigen.
   Aufruf:  node _tools/bake-slots.mjs [projekt-root]   — läuft im Publish automatisch. */
import { readFileSync, writeFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
const ROOT = process.argv[2] || process.cwd();
const EXCLUDE = new Set([
  "brandguide.html","design-studio.html","guide-emblem-avatar.html",
  "camera-frame-widget.html","possession-widget.html","scoreboard-widget.html","spielstatistik-widget.html",
]);
const map = JSON.parse(readFileSync(join(ROOT, "assets/fotos/galerie/mapping.json"), "utf8"));
const pages = readdirSync(ROOT).filter(f => f.endsWith(".html") && !EXCLUDE.has(f)).sort();
let total = 0, lazyN = 0, touched = 0;
for (const p of pages) {
  let html; try { html = readFileSync(join(ROOT, p), "utf8"); } catch { continue; }
  let changed = 0;
  const next = html.replace(/<img\b[^>]*\bdata-slot="([^"]+)"[^>]*>/gi, (tag, key) => {
    const v = map[key];
    if (typeof v !== "string") return tag;
    let out = /\bsrc="/.test(tag) ? tag.replace(/(\bsrc=")[^"]*(")/, `$1${v}$2`)
                                  : tag.replace(/<img\b/i, `<img src="${v}"`);
    if (/hero/i.test(key)) { out = out.replace(/\s+loading="[^"]*"/i, ""); }
    else if (/\bloading="/i.test(out)) out = out.replace(/(\bloading=")[^"]*(")/i, "$1lazy$2");
    else { out = out.replace(/<img\b/i, '<img loading="lazy"'); lazyN++; }
    if (!/\bdecoding="/i.test(out)) out = out.replace(/<img\b/i, '<img decoding="async"');
    if (out !== tag) changed++;
    return out;
  });
  if (changed) { writeFileSync(join(ROOT, p), next); total += changed; touched++; console.log(`  ${p.padEnd(30)} ${changed} Slot-<img>`); }
}
console.log(`\nGescannt: ${pages.length} Seiten · geändert: ${touched} · ${total} Slot-<img> gebacken, ${lazyN} neu lazy.`);
