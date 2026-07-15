/* ============================================================
   TFCZ · PRÜFER — findet mechanisch, was beim Ändern kaputtgeht.

   Warum es das gibt (15.07.2026): Beim Button-Umbau haben Regex-Läufe
   stillen Schaden angerichtet — Selektor-Trümmer (`.acard a` ohne Block),
   gelöschtes Layout, Gold-Text auf Gold-Fläche, 175px-Icons. Nichts davon
   war ein Fehler in der Konsole; die Seite „lief". Gefunden hat es der
   MENSCH, nicht die Prüfung. Genau das soll dieses Skript ersetzen.

   Aufruf (im Ordner "ocsav - tfcz_Web"):
       node _tools/pruefen.mjs

   Prüft — jeder Punkt entspricht einem echten Schaden von heute:
     1  CSS-Trümmer        nackter Selektor ohne {...}  -> killt Folgeregeln
     2  Klammer-Balance    { und } müssen aufgehen
     3  Kontrast           Gold-Button = dunkler Text · gefüllt = heller Text
     4  Icon-Grösse        SVG im Button darf nicht explodieren
     5  X-Overflow         Desktop (1280) UND Mobile (390)
     6  JS-Fehler          Konsole muss leer sein
     7  Emojis             Soll: 0 (Icons sind Lucide)
     8  Button-Token       jeder Button folgt --btn-radius (Chips ausgenommen)

   Exit-Code 1, wenn irgendein Punkt fehlschlägt.
   ============================================================ */
import { chromium } from 'playwright-core';
import { readFileSync, readdirSync } from 'fs';

const BIN = process.env.CHROME_BIN
  || '/sessions/nice-fervent-shannon/.cache/ms-playwright/chromium-1228/chrome-linux/chrome';
const BASE = 'file://' + process.cwd() + '/';

const SEITEN = readdirSync('.').filter(f => f.endsWith('.html') && !f.startsWith('_'));
const CHIP = /chip|toggle|csw|langtoggle|db-user|ic-cat|^on$|lg-dl|seg/;   // Chips/Toggles dürfen pill sein

let fehler = 0;
const melde = (ok, text) => { if (!ok) fehler++; console.log((ok ? '  ✓ ' : '  ✗ ') + text); };

/* ---------- 1 + 2 + 7: statisch, ohne Browser ---------- */
console.log('\n── Statisch (CSS-Struktur, Emojis) ──');
const EMOJI = /[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]/u;
for (const f of SEITEN) {
  const s = readFileSync(f, 'utf8');
  const cssRoh = [...s.matchAll(/<style>([\s\S]*?)<\/style>/g)].map(m => m[1]).join('\n');
  // Kommentare RAUS, bevor geprüft wird — sonst hält der Prüfer Kommentartext für Trümmer
  const css = cssRoh.replace(/\/\*[\s\S]*?\*\//g, '');

  // 1 · Selektor-Trümmer: Zeile sieht aus wie ein Selektor, hat aber keinen Block und kein Komma
  const truemmer = css.split('\n').map(l => l.trim()).filter(t =>
    t && !t.startsWith('@') &&
    /^[.#a-zA-Z][^{}:;]*$/.test(t) && !t.endsWith(',') && t.length < 70);
  melde(truemmer.length === 0, `${f}: Selektor-Trümmer ${truemmer.length ? JSON.stringify(truemmer.slice(0, 3)) : '0'}`);

  // 2 · Klammern
  const auf = (css.match(/\{/g) || []).length, zu = (css.match(/\}/g) || []).length;
  melde(auf === zu, `${f}: Klammer-Balance ${auf}/${zu}`);

  // 7 · Emojis
  const em = [...s].filter(c => EMOJI.test(c));
  melde(em.length === 0, `${f}: Emojis ${em.length}`);
}

/* ---------- 3–6 + 8: im echten Browser ---------- */
const b = await chromium.launch({ executablePath: BIN, args: ['--no-sandbox', '--disable-gpu'] });

for (const [breite, label] of [[1280, 'Desktop'], [390, 'Mobile']]) {
  console.log(`\n── Browser ${label} (${breite}px) ──`);
  const p = await b.newPage({ viewport: { width: breite, height: 900 } });
  const js = [];
  p.on('pageerror', e => js.push(e.message.slice(0, 60)));

  for (const f of SEITEN) {
    js.length = 0;
    await p.goto(BASE + f);
    await p.waitForTimeout(400);

    const r = await p.evaluate((chipSrc) => {
      const chip = new RegExp(chipSrc);
      const lum = (c) => {
        const m = c.match(/\d+/g); if (!m) return 0;
        const [r, g, bl] = m.map(Number).map(v => { v /= 255; return v <= .03928 ? v / 12.92 : Math.pow((v + .055) / 1.055, 2.4); });
        return .2126 * r + .7152 * g + .0722 * bl;
      };
      const out = { kontrast: [], icons: [], radius: [], ovf: false };
      out.ovf = document.documentElement.scrollWidth > document.documentElement.clientWidth + 1;

      // 3 · Kontrast
      for (const el of document.querySelectorAll('.btn-gold,.btn-blue,.btn-danger,.btn-success')) {
        if (!el.offsetWidth) continue;
        const l = lum(getComputedStyle(el).color);
        const gold = el.classList.contains('btn-gold');
        if (gold && l > 0.2) out.kontrast.push('gold+heller Text: ' + el.textContent.trim().slice(0, 20));
        if (!gold && l < 0.5) out.kontrast.push('gefüllt+dunkler Text: ' + el.textContent.trim().slice(0, 20));
      }
      // 4 · Icon-Grösse
      for (const s of document.querySelectorAll('a svg, button svg')) {
        const w = s.getBoundingClientRect().width;
        if (w > 60) out.icons.push(Math.round(w) + 'px in ' + (s.closest('a,button').className || '?').slice(0, 22));
      }
      // 8 · Button folgt dem Token
      for (const el of document.querySelectorAll('a,button')) {
        const cn = typeof el.className === 'string' ? el.className : '';
        if (!cn || chip.test(cn) || el.closest('.leaflet-container,.tfcz-lb')) continue;
        const cs = getComputedStyle(el);
        const rad = cs.borderTopLeftRadius;
        if (parseFloat(rad) >= 20 && rad !== '50%' && el.offsetWidth > 40 && el.offsetHeight > 18)
          out.radius.push(cn.slice(0, 24) + ' ' + rad);
      }
      return out;
    }, CHIP.source);

    const probs = [];
    if (r.ovf) probs.push('X-OVERFLOW');
    if (r.kontrast.length) probs.push('Kontrast: ' + r.kontrast.join(', '));
    if (r.icons.length) probs.push('Riesen-Icon: ' + r.icons.join(', '));
    if (r.radius.length && breite === 1280) probs.push('ignoriert Token: ' + r.radius.join(', '));
    if (js.length) probs.push('JS: ' + [...new Set(js)].join(' | '));
    melde(probs.length === 0, `${f}${probs.length ? ' → ' + probs.join(' · ') : ''}`);
  }
  await p.close();
}
await b.close();

console.log('\n' + (fehler === 0
  ? '── ALLES SAUBER ──'
  : `── ${fehler} PROBLEM(E) — nicht ausliefern ──`));
process.exit(fehler ? 1 : 0);
