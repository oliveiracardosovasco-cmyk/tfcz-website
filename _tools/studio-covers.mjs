/* ============================================================
   TFCZ · VORSCHAUBILDER fuer die Motiv-Galerie im Design Studio

   Warum es das gibt (16.08.2026): Die Galerie zeigt pro Vorlage eine Kachel.
   Mit Platzhalter-Icons sehen alle Kacheln gleich aus — man erkennt die Vorlage
   erst nach dem Klick. Dieses Skript rendert JEDE Vorlage einmal echt und legt
   das Ergebnis als kleines JPEG nach assets/img/studio-covers/<id>.jpg
   (Doppelpunkte im Schluessel werden zu Bindestrichen: thumb:elite_doppel ->
   thumb-elite_doppel.jpg).

   Aufruf (im Ordner "ocsav - tfcz_Web"):
       node _tools/studio-covers.mjs

   Voraussetzungen:
     - Playwright-Chromium (wie bei _tools/pruefen.mjs; CHROME_BIN wird beachtet)
     - Es wird ein lokaler Server gestartet: ueber file:// verweigert der Browser
       den Export, sobald ein Foto aus dem Ordner im Flyer liegt (tainted canvas).
     - Fuer die JPEG-Verkleinerung wird `sharp` genutzt, falls vorhanden;
       sonst bleiben die PNG stehen und werden nur umbenannt-kopiert.

   Wann neu laufen lassen: wenn eine Vorlage optisch geaendert wurde oder eine
   neue Serie in SERIEN dazugekommen ist.
   ============================================================ */
import { chromium } from 'playwright-core';
import { createServer } from 'http';
import { readFileSync, existsSync, mkdirSync, writeFileSync, readdirSync } from 'fs';
import { homedir } from 'os';
import { join, extname } from 'path';

function findeChromium(){
  if (process.env.CHROME_BIN) return process.env.CHROME_BIN;
  const cache = process.env.PLAYWRIGHT_BROWSERS_PATH || join(homedir(), '.cache', 'ms-playwright');
  if (existsSync(cache)) {
    const build = readdirSync(cache).filter(d=>/^chromium-\d+$/.test(d))
      .sort((a,b)=>Number(b.split('-')[1])-Number(a.split('-')[1]))[0];
    if (build) for (const p of [join(cache,build,'chrome-linux','chrome'),
                               join(cache,build,'chrome-mac','Chromium.app','Contents','MacOS','Chromium')])
      if (existsSync(p)) return p;
  }
  return undefined;
}
const MIME={'.html':'text/html','.js':'text/javascript','.css':'text/css','.json':'application/json',
  '.jpg':'image/jpeg','.jpeg':'image/jpeg','.png':'image/png','.webp':'image/webp','.svg':'image/svg+xml',
  '.woff2':'font/woff2','.ttf':'font/ttf'};
const PORT=8731;
const server=createServer((req,res)=>{
  const p=decodeURIComponent(req.url.split('?')[0]).replace(/^\/+/,'')||'index.html';
  if(!existsSync(p)){ res.writeHead(404); res.end('nix'); return; }
  try{ res.writeHead(200,{'content-type':MIME[extname(p)]||'application/octet-stream'});
       res.end(readFileSync(p)); }catch(e){ res.writeHead(500); res.end(''); }
});
await new Promise(r=>server.listen(PORT,r));
console.log('Server auf http://localhost:'+PORT);

const OUT='assets/img/studio-covers'; mkdirSync(OUT,{recursive:true});
const BIN=findeChromium();
const b=await chromium.launch({ ...(BIN?{executablePath:BIN}:{}), args:['--no-sandbox','--disable-gpu'] });
const p=await b.newPage({viewport:{width:1600,height:1000}});
await p.goto('http://localhost:'+PORT+'/design-studio.html');
await p.waitForTimeout(2500);
await p.evaluate(()=>{ try{ hideHome(); setRole('admin');
  const sp=document.getElementById('startPop'); if(sp)sp.style.display='none'; }catch(e){} });
await p.waitForTimeout(600);

const alle=await p.evaluate(()=>{ const o=[];
  Object.keys(SERIEN).forEach(m=>Object.keys(SERIEN[m]).forEach(k=>
    SERIEN[m][k].forEach(se=>se.v.forEach(e=>o.push(e[0]))))); return o; });

let sharp=null; try{ sharp=(await import('sharp')).default; }catch(e){
  console.log('Hinweis: `sharp` fehlt — die Bilder bleiben PNG (grösser). npm i sharp behebt das.'); }

let ok=0, fehler=[];
for(const id of alle){
  await p.evaluate(x=>navGo(x), id);
  await p.waitForTimeout(1500);
  const url=await p.evaluate(async()=>{ try{ return await renderCapture(); }catch(e){ return null; } });
  const slug=id.replace(/:/g,'-');
  if(!url){ fehler.push(slug); continue; }
  const buf=Buffer.from(url.split(',')[1],'base64');
  if(sharp){ await sharp(buf).flatten({background:'#0d273d'}).resize({width:440})
              .jpeg({quality:80,progressive:true}).toFile(join(OUT,slug+'.jpg')); }
  else { writeFileSync(join(OUT,slug+'.png'),buf); }
  ok++; console.log('  ✓ '+slug);
}
await b.close(); server.close();
console.log('\n'+ok+' Vorschaubilder in '+OUT+(fehler.length?('  ·  FEHLER: '+fehler.join(', ')):''));
process.exit(fehler.length?1:0);
