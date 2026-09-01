#!/usr/bin/env node
/* ============================================================================
   TFCZ · Website veröffentlichen — der EINE Weg.

   Ersetzt die beiden .command-Dateien vom Juli. Die waren am 01.09.2026 beide
   falsch: die eine behauptete, GitHub Pages sei tfcz.ch (ist es nicht), die
   andere hätte das Vereins-Repo per `git push --force` mit dem flachen
   Website-Ordner überschrieben — samt der Workflow-Datei, die tfcz.ch deployt.
   Beide trugen ausserdem einen GitHub-Token im Klartext.

   ES GIBT ZWEI ZIELE, und nur eines davon ist tfcz.ch:

     Ordner  ocsav - tfcz_Web/           →  Remote `privat`  →  Repo tfcz-website
                                         →  GitHub Pages (Spiegel, NICHT tfcz.ch)

     Repo    ocsav, Ordner website/site/ →  Workflow deploy-website.yml
                                         →  Docker-Image → SSH → Container
                                         →  tfcz.ch

   Dieses Skript bedient beide, in dieser Reihenfolge. Der Server bekommt den
   COMMITTETEN Stand, nie den Arbeitsbaum — halbfertige Arbeit bleibt draussen.

   Aufruf:   node _tools/veroeffentlichen.mjs
             node _tools/veroeffentlichen.mjs --ja        (ohne Rückfrage)
             node _tools/veroeffentlichen.mjs --nur-pages (Server auslassen)

   Zugangsdaten: KEINE im Skript. `privat` läuft über den macOS-Schlüsselbund,
   `ocsav` über SSH. Wer hier je wieder einen Token hineinschreibt, hat den
   Grund für dieses Skript nicht verstanden.
   ============================================================================ */

import { execFileSync, execSync } from 'node:child_process';
import { readFileSync, existsSync, mkdirSync, rmSync, readdirSync, statSync,
         copyFileSync } from 'node:fs';
import { join, dirname, relative, sep } from 'node:path';
import { homedir } from 'node:os';
import { createInterface } from 'node:readline';

const ARG      = process.argv.slice(2);
const OHNE_FRAGE = ARG.includes('--ja');
const NUR_PAGES  = ARG.includes('--nur-pages');

const WEB   = process.cwd();
/* Der Vereins-Klon liegt in einem ANDEREN Projektordner (TFCZ/Ocsav, nicht
   TFCZ-v3/) — genau darum hat ihn am 01.09.2026 niemand gefunden. */
const OCSAV = process.env.TFCZ_OCSAV || join(homedir(), 'Claude/Projects/TFCZ/Ocsav');
const ZIEL  = join(OCSAV, 'website', 'site');
const LISTE = join(WEB, '_tools', 'nicht-veroeffentlichen.txt');

const rot = s => `\x1b[31m${s}\x1b[0m`;
const gruen = s => `\x1b[32m${s}\x1b[0m`;
const fett = s => `\x1b[1m${s}\x1b[0m`;
const schritt = s => console.log('\n' + fett('▸ ' + s));

function stop(text) { console.error('\n' + rot('✗ ' + text) + '\n'); process.exit(1); }
function git(repo, ...args) {
  return execFileSync('git', ['-C', repo, ...args], { encoding: 'utf8' }).trim();
}
function frage(text) {
  if (OHNE_FRAGE) return Promise.resolve(true);
  const rl = createInterface({ input: process.stdin, output: process.stdout });
  return new Promise(r => rl.question(text + ' [j/N] ', a => {
    rl.close(); r(/^j/i.test(a.trim()));
  }));
}

/* ---------------------------------------------------------------- Liste ---- */
/* Semantik in nicht-veroeffentlichen.txt beschrieben: Name ohne Schrägstrich
   greift auf jeder Ebene, Pfad mit Schrägstrich ab der Wurzel, * als Platzhalter. */
function ladeListe() {
  if (!existsSync(LISTE)) stop('_tools/nicht-veroeffentlichen.txt fehlt.');
  const namen = [], pfade = [], muster = [];
  for (let zeile of readFileSync(LISTE, 'utf8').split('\n')) {
    zeile = zeile.replace(/\s+#.*$/, '').trim();
    if (!zeile || zeile.startsWith('#')) continue;
    if (zeile.includes('*')) muster.push(new RegExp('^' + zeile.replace(/[.+^${}()|[\]\\]/g, '\\$&').replace(/\*/g, '.*') + '$'));
    else if (zeile.includes('/')) pfade.push(zeile.replace(/\/+$/, ''));
    else namen.push(zeile);
  }
  return { namen, pfade, muster };
}
function verboten(relPfad, liste) {
  const teile = relPfad.split(sep);
  if (teile.some(t => liste.namen.includes(t))) return true;
  if (teile.some(t => liste.muster.some(m => m.test(t)))) return true;
  return liste.pfade.some(p => relPfad === p || relPfad.startsWith(p + sep));
}

/* -------------------------------------------------------------- Kopieren --- */
function kopiere(von, nach, liste, wurzel, zaehler) {
  for (const eintrag of readdirSync(von)) {
    const q = join(von, eintrag);
    const rel = relative(wurzel, q);
    if (verboten(rel, liste)) { zaehler.weg++; continue; }
    if (statSync(q).isDirectory()) {
      mkdirSync(join(nach, eintrag), { recursive: true });
      kopiere(q, join(nach, eintrag), liste, wurzel, zaehler);
    } else {
      mkdirSync(dirname(join(nach, eintrag)), { recursive: true });
      copyFileSync(q, join(nach, eintrag));
      zaehler.kopiert++;
    }
  }
}

/* ==================================================================== Lauf = */
const stand = new Date().toLocaleString('de-CH', { day: '2-digit', month: '2-digit',
                year: 'numeric', hour: '2-digit', minute: '2-digit' }).replace(',', '');

console.log(fett('\nTFCZ · Website veröffentlichen'));
console.log('  Arbeitsordner : ' + WEB);
console.log('  Vereins-Klon  : ' + OCSAV + (existsSync(ZIEL) ? '' : rot('  ← nicht gefunden')));

if (!existsSync(join(WEB, 'index.html'))) stop('Hier liegt keine index.html — im Ordner "ocsav - tfcz_Web" starten.');

/* ---- 1 · Backen -------------------------------------------------------- */
schritt('Backen (Bild-Slots und Seiten-Sichtbarkeit)');
for (const werkzeug of ['bake-slots.mjs', 'bake-seiten.mjs']) {
  try { execSync(`node _tools/${werkzeug} .`, { cwd: WEB, stdio: 'inherit' }); }
  catch { console.log(rot(`  (${werkzeug} übersprungen)`)); }
}

/* ---- 2 · Arbeits-Repo committen --------------------------------------- */
schritt('Änderungen im Arbeits-Repo');
const offen = git(WEB, 'status', '--porcelain');
if (offen) {
  console.log(offen.split('\n').slice(0, 40).join('\n'));
  const n = offen.split('\n').length;
  if (n > 40) console.log(`  … und ${n - 40} weitere`);
  console.log(rot('\n  Alles davon geht live. Halbfertiges vorher wegräumen.'));
  if (!await frage('  Committen und veröffentlichen?')) stop('Abgebrochen — nichts verändert.');
  git(WEB, 'add', '-A');
  git(WEB, 'commit', '-m', `Website: Stand ${stand}`);
  console.log(gruen('  ✓ committet: ') + git(WEB, 'log', '--oneline', '-1'));
} else {
  console.log('  (nichts Neues — es wird der bestehende Stand veröffentlicht)');
}

/* ---- 3 · Pages -------------------------------------------------------- */
schritt('Spiegel auf GitHub Pages (Repo tfcz-website)');
execFileSync('git', ['-C', WEB, 'push', 'privat', 'main'], { stdio: 'inherit' });
console.log(gruen('  ✓ ') + 'https://oliveiracardosovasco-cmyk.github.io/tfcz-website/');

if (NUR_PAGES) { console.log('\n--nur-pages: tfcz.ch bleibt unberührt.\n'); process.exit(0); }

/* ---- 4 · Live-Ordner im Vereins-Repo ---------------------------------- */
schritt('tfcz.ch (Repo ocsav, Ordner website/site)');
if (!existsSync(ZIEL)) stop(`${ZIEL} fehlt. Vereins-Klon anlegen oder TFCZ_OCSAV setzen.`);
git(OCSAV, 'fetch', 'origin');
if (git(OCSAV, 'status', '--porcelain')) stop('Im Vereins-Klon liegen offene Änderungen — zuerst dort aufräumen.');
git(OCSAV, 'pull', '--ff-only');

/* Gespiegelt wird der COMMITTETE Stand, nie der Arbeitsbaum. */
const sha = git(WEB, 'rev-parse', '--short', 'HEAD');
const tmp = join(WEB, '_tools', '.export');
rmSync(tmp, { recursive: true, force: true }); mkdirSync(tmp, { recursive: true });
execSync(`git -C "${WEB}" archive HEAD | tar -x -C "${tmp}"`, { stdio: 'pipe' });

const liste = ladeListe();
const zaehler = { kopiert: 0, weg: 0 };
kopiere(tmp, ZIEL, liste, tmp, zaehler);
rmSync(tmp, { recursive: true, force: true });
console.log(`  aus ${sha}: ${zaehler.kopiert} Dateien gespiegelt, ${zaehler.weg} laut Liste ausgelassen`);

/* Gegenprobe — dieselbe Idee wie in pages.yml: lieber abbrechen als etwas
   Internes ausliefern. */
for (const f of ['_secret', 'CLAUDE.md', '_tools', '_to_delete', 'node_modules']) {
  if (existsSync(join(ZIEL, f))) console.log(rot(`  ! ${f} liegt im Live-Ordner (aus früherem Stand — .dockerignore hält es aus dem Image)`));
}
for (const f of ['index.html', 'tfcz-training.html', 'system/tokens.css', 'system/seiten.js']) {
  if (!existsSync(join(ZIEL, f))) stop(`${f} fehlt im Live-Ordner — die Seite wäre kaputt.`);
}

const geaendert = git(OCSAV, 'status', '--porcelain');
if (!geaendert) {
  console.log(gruen('\n✓ tfcz.ch ist bereits auf diesem Stand.\n'));
  process.exit(0);
}
console.log(`  ${geaendert.split('\n').length} Datei(en) verändern sich auf dem Server`);
if (!await frage('  Auf tfcz.ch veröffentlichen?')) stop('Abgebrochen — Pages ist aktualisiert, der Server nicht.');

git(OCSAV, 'add', '-A');
git(OCSAV, 'commit', '-m', `website: Stand ${stand} (aus ${sha})`);
execFileSync('git', ['-C', OCSAV, 'push', 'origin', 'main'], { stdio: 'inherit' });
console.log(gruen('  ✓ gepusht') + ' — deploy-website.yml baut das Image und startet den Container neu.');

/* ---- 5 · Nachsehen, ob es wirklich live ist --------------------------- */
schritt('Warten, bis tfcz.ch den neuen Stand ausliefert');
const marke = readFileSync(join(ZIEL, 'index.html'), 'utf8').length;
for (let i = 1; i <= 30; i++) {
  await new Promise(r => setTimeout(r, 10000));
  try {
    const antwort = await fetch('https://tfcz.ch/index.html', { cache: 'no-store' });
    const text = await antwort.text();
    if (text.length === marke) {
      console.log(gruen(`\n✓ Live auf https://tfcz.ch nach ~${i * 10}s\n`));
      process.exit(0);
    }
  } catch { /* Server startet gerade neu — weiterprobieren */ }
  process.stdout.write('.');
}
console.log(rot('\n! Nach 5 Minuten noch nicht durch. Lauf ansehen:'));
console.log('  https://github.com/tischfussball-club-zuerich/ocsav/actions\n');
