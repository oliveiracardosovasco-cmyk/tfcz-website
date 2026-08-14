/* ===== TFCZ · Vorschaubilder für den Reiter „Präsentationen" =====
   Rendert von JEDEM Deck aus `praesentationen/index.js` die ERSTE FOLIE
   und legt sie als `praesentationen/covers/<id>.jpg` ab. Damit ist das
   Vorschaubild im Design Studio immer die echte erste Folie — niemand
   pflegt ein Cover von Hand, und ein neues Deck bekommt seins automatisch.

   Aufrufen nach JEDER Änderung an einem Deck und nach jedem neuen Eintrag:
       node _tools/praesi-cover.mjs
   Braucht Playwright (`npm i -D playwright && npx playwright install chromium`).
   Eigener Browser-Pfad: `TFCZ_CHROMIUM=/pfad/zu/chromium node _tools/praesi-cover.mjs`.
   Ohne Playwright bleibt das alte
   Cover liegen — das Studio zeigt dann eben den letzten Stand.
*/
import { chromium } from 'playwright';
import { readFileSync, mkdirSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join, resolve } from 'node:path';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const REG  = join(ROOT, 'praesentationen', 'index.js');
const OUT  = join(ROOT, 'praesentationen', 'covers');

const sandbox = { window: {} };
new Function('window', readFileSync(REG, 'utf8'))(sandbox.window);
const decks = sandbox.window.TFCZ_PRAESI || [];
if (!decks.length) { console.log('Register leer — nichts zu tun.'); process.exit(0); }
if (!existsSync(OUT)) mkdirSync(OUT, { recursive: true });

const browser = await chromium.launch(process.env.TFCZ_CHROMIUM?{executablePath:process.env.TFCZ_CHROMIUM}:{});
const page = await browser.newPage({ viewport: { width: 1600, height: 900 } });
for (const d of decks) {
  const file = join(ROOT, d.datei);
  if (!existsSync(file)) { console.log('fehlt:', d.datei); continue; }
  await page.goto('file://' + file);
  await page.waitForSelector('.slide.on', { timeout: 15000 });
  await page.waitForTimeout(2500);           // Hintergrundfoto einblenden lassen
  await page.evaluate(() => {                 // Bedien-Elemente gehoeren nicht ins Cover
    ['dots', 'counter', 'hint', 'bar'].forEach(id => {
      const e = document.getElementById(id); if (e) e.style.display = 'none';
    });
  });
  await page.screenshot({ path: join(OUT, d.id + '.jpg'), type: 'jpeg', quality: 78 });
  console.log('Cover:', d.id + '.jpg');
}
await browser.close();
