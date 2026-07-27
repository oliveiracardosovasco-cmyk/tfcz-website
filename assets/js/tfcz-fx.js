/* ============================================================
   TFCZ · tfcz-fx.js — Interaktions-Modul (Community-Überraschung)
   ------------------------------------------------------------
   SPOILER-BITTE AN MENSCHEN:
   Dieses Modul enthält eine Überraschung für unsere Besucher. Die Konfiguration
   liegt bewusst nur als Blob vor. Bitte nicht auspacken und nicht verraten —
   der Spass lebt davon, dass man es selber entdeckt. Danke! — TFCZ

   Einbinden: <script defer src="assets/js/tfcz-fx.js"></script>
   Optional:  window.TFCZ_USER (Login) · window.TFCZ_FX_API {load,save}
              window.TFCZ_FX_NOTIFY(payload) · window.TFCZ_FX_LOGIN()
   ------------------------------------------------------------
   Performance & Physik der Feier (startCheese) — dokumentiert, Vasco 22.07.2026:
   * Partikel gedeckelt: Mobile (innerWidth<=600) 120, sonst 200 — haelt die
     O(n^2)-Kollisionspruefung guenstig (Haupt-CPU-Posten).
   * Fallflaechen-Canvas dpr auf 1.5 gekappt (statt 2) -> ~1.8x weniger Fuellrate/Grafikspeicher.
   * prefers-reduced-motion -> Feier wird KOMPLETT uebersprungen (keine Partikel, kein Canvas).
   * Kaese fallen & bleiben liegen: kein Aufspringen, kein Eigendreh; Klick/Wischen schleudert sie hoch.
   * Selbst-Stopp: beide Canvas werden beim Schliessen aus dem DOM entfernt (kein Leck; Heap ~1-2 MB).
   * Gemessen (Chromium/CDP, 390x844): Mobile 4x CPU 28->34 fps, 6x CPU 23->30 fps.
   * Doku/Referenz: component-library.html -> Sektion 16.
   ============================================================ */
(function(){
  var FX_X='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>';
  if(window.__tfczFx) return; window.__tfczFx=true;

  var BASE=(document.currentScript&&document.currentScript.src)?document.currentScript.src.replace(/assets\/js\/tfcz-fx\.js.*$/,''):'';

  /* ---- Payload ---- */
  var _k=[[0x37,0x71,0x5a],[0x2d,0x54,0x66,0x43],[0x7a,0x21,0x39,0x6b,0x58],[0x5f,0x77,0x33,0x62]];
  function _key(){var s='',i,j;for(i=0;i<_k.length;i++)for(j=0;j<_k[i].length;j++)s+=String.fromCharCode(_k[i][j]);return s+String.fromCharCode(0x71,0x38,0x2a,0x4d,0x76,0x30);}
  function _rc(k,d){var S=[],j=0,i,t,o='',y;for(i=0;i<256;i++)S[i]=i;
    for(i=0;i<256;i++){j=(j+S[i]+k.charCodeAt(i%k.length))&255;t=S[i];S[i]=S[j];S[j]=t;}
    i=j=0;for(y=0;y<d.length;y++){i=(i+1)&255;j=(j+S[i])&255;t=S[i];S[i]=S[j];S[j]=t;
      o+=String.fromCharCode(d.charCodeAt(y)^S[(S[i]+S[j])&255]);}return o;}
  /*@P*/var P='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';/*@E*/
  var C;
  try{
    var bin=_rc(_key(),atob(P)), u=new Uint8Array(bin.length), z;
    for(z=0;z<bin.length;z++)u[z]=bin.charCodeAt(z)&255;
    C=JSON.parse(new TextDecoder('utf-8').decode(u));
  }catch(e){ return; }

  var IT=C.items, N=IT.length, GOAL=C.goal, T=C.txt;
  var EMBLEM=BASE+C.emblem, KAL=BASE+C.kalender;
  function fill(s){ return String(s).replace(/\{N\}/g,N).replace(/\{G\}/g,GOAL).replace(/\{KAL\}/g,KAL); }
  function byId(id){for(var i=0;i<N;i++)if(IT[i].i===id)return IT[i];return null;}
  function it(t){for(var i=0;i<N;i++)if(IT[i].t===t)return IT[i];return null;}

  /* ---- Zustand ---- */
  var SESSION={}, SAVED={}, NOTIFIED=false, REWARD_SHOWN=false, MUTES={};
  try{ if(loggedIn()) NOTIFIED=localStorage.getItem('tfcz_fx_n')==='1'; }catch(e){}
  try{ if(loggedIn()) REWARD_SHOWN=localStorage.getItem('tfcz_fx_r')==='1'; }catch(e){}
  /* Stumm ist IMMER pro Eintrag (nie global) — der Toggle im Popup betrifft nur genau dieses Ei. */
  try{ if(loggedIn()) (JSON.parse(localStorage.getItem('tfcz_fx_m')||'[]')||[]).forEach(function(k){MUTES[k]=1;}); }catch(e){}
  function isMuted(id){ return !!MUTES[id]; }
  function setMute(id,on){ if(on) MUTES[id]=1; else delete MUTES[id];
    var a=[],k; for(k in MUTES) if(MUTES[k]) a.push(k);
    try{ if(loggedIn()) localStorage.setItem('tfcz_fx_m',JSON.stringify(a)); }catch(e){} }
  function loggedIn(){ return !!window.TFCZ_USER; }
  function apiLoad(cb){ if(window.TFCZ_FX_API&&window.TFCZ_FX_API.load){ try{var r=window.TFCZ_FX_API.load(); if(r&&r.then)r.then(function(a){cb(a||[]);},function(){cb([]);}); else cb(r||[]);}catch(e){cb([]);} }
    else { try{ cb(JSON.parse(localStorage.getItem('tfcz_fx_f')||'[]')||[]); }catch(e){ cb([]); } } }
  function apiSave(ids){ if(window.TFCZ_FX_API&&window.TFCZ_FX_API.save){ try{window.TFCZ_FX_API.save(ids);}catch(e){} }
    else { try{ localStorage.setItem('tfcz_fx_f',JSON.stringify(ids)); }catch(e){} } }
  function savedIds(){var a=[],k;for(k in SAVED)if(SAVED[k])a.push(k);return a;}
  function count(){var s={},n=0,k;for(k in SAVED)if(SAVED[k])s[k]=1;for(k in SESSION)if(SESSION[k])s[k]=1;for(k in s)n++;return n;}
  function isFound(id){return !!(SAVED[id]||SESSION[id]);}
  if(loggedIn()) apiLoad(function(a){ a.forEach(function(id){SAVED[id]=1;}); syncDot(); });

  /* ---- CSS ---- */
  var css=[
  '.fx-ov{position:fixed;inset:0;z-index:9000;display:none;align-items:center;justify-content:center;padding:22px;opacity:0;transition:opacity .5s ease;font-family:"Nunito Sans",system-ui,sans-serif}',
  '.fx-ov::before{content:"";position:absolute;inset:0;background:radial-gradient(120% 120% at 50% 50%,rgba(4,9,16,.5) 0%,rgba(2,6,11,.86) 70%,#01040a 100%);opacity:0;transition:opacity .6s ease}',
  '.fx-ov.on{display:flex;opacity:1}','.fx-ov.on::before{opacity:1}',
  '.fx-acc{position:absolute;z-index:1;pointer-events:none;opacity:0;width:150px;height:230px;background:radial-gradient(closest-side,rgba(233,196,117,.5),transparent 70%);filter:blur(12px)}',
  '.fx-ov.on .fx-acc{animation:fxSmoke 1.15s ease .02s}',
  '@keyframes fxSmoke{0%{opacity:0;transform:translate(-50%,-30%) scale(.3)}42%{opacity:.85}100%{opacity:0;transform:translate(-50%,-165%) scale(1.4)}}',
  '.fx-pop{position:relative;z-index:2;width:min(410px,94vw);border-radius:24px;padding:32px 24px 22px;text-align:center;overflow:hidden;opacity:0;color:#eef4fa;background:linear-gradient(160deg,rgba(19,38,58,.96),rgba(9,21,33,.95));border:1px solid rgba(255,255,255,.13);border-top:3px solid #5ca7dc;border-bottom:3px solid #cda857;box-shadow:0 30px 80px rgba(0,0,0,.6),0 0 60px rgba(205,168,87,.14)}',
  '.fx-pop.open{animation:fxOpen .72s cubic-bezier(.16,.84,.3,1) forwards}',
  '@keyframes fxOpen{0%{opacity:0;transform:scale(0)}55%{opacity:1}100%{opacity:1;transform:scale(1)}}',
  '.fx-pop.closing{animation:fxPortal .5s cubic-bezier(.2,.7,.2,1) forwards}',
  '@keyframes fxPortal{0%{opacity:1;clip-path:inset(0 0 0 0 round 24px)}70%{opacity:1}100%{opacity:0;clip-path:inset(49% 0 49% 0 round 24px)}}',
  '.fx-x{position:absolute;top:12px;right:12px;width:36px;height:36px;border-radius:50%;background:rgba(255,255,255,.08);border:1px solid rgba(255,255,255,.13);color:#fff;cursor:pointer;display:grid;place-items:center;z-index:9;font-size:15px;transition:background .15s,border-color .15s}',
  '.fx-x:hover{background:#da2929;border-color:#da2929;animation:fxSquish .42s}','.fx-x:active{transform:scale(.9)}',
  '@keyframes fxSquish{0%{transform:scale(1,1)}40%{transform:scale(1.22,.78)}70%{transform:scale(.94,1.06)}100%{transform:scale(1,1)}}',
  '.fx-prog{opacity:0;margin-top:14px}','.fx-pop.reveal .fx-prog{animation:fxIn .5s ease .1s forwards}',
  '.fx-prog .pl{display:flex;justify-content:space-between;font-size:11px;font-weight:900;letter-spacing:.1em;text-transform:uppercase;color:#c3d2e0;margin-bottom:6px}','.fx-prog .pl b{color:#e9c475}',
  '.fx-bar{height:9px;border-radius:6px;background:rgba(255,255,255,.09);border:1px solid rgba(255,255,255,.13);overflow:hidden}',
  '.fx-bar i{display:block;height:100%;width:0;background:linear-gradient(90deg,#5ca7dc,#cda857);border-radius:6px;transition:width 1s cubic-bezier(.2,.7,.2,1)}',
  '.fx-stage{position:relative;z-index:6;height:150px;display:grid;place-items:center;margin:12px 0 2px}',
  '.fx-o{position:relative;width:96px;height:128px}',
  '.fx-o svg{position:absolute;inset:0;width:100%;height:100%;overflow:visible}',
  '.fx-o .half{transition:transform .55s cubic-bezier(.34,1.56,.64,1) 1.55s,opacity .5s ease 1.55s}',
  '.fx-rev{position:absolute;inset:0;display:grid;place-items:center;opacity:0;transform:translateY(30px) scale(.25)}',
  '.fx-rev img{width:66px;filter:drop-shadow(0 8px 16px rgba(0,0,0,.45))}',
  '.fx-pop.crack .fx-o{animation:fxShake 1.3s ease both}',
  '@keyframes fxShake{0%{transform:rotate(0) scale(1)}18%{transform:rotate(-4deg)}34%{transform:rotate(4deg)}50%{transform:rotate(-6deg) scale(1.03)}66%{transform:rotate(6deg) scale(1.05)}82%{transform:rotate(-8deg) scale(1.06)}100%{transform:rotate(0) scale(1.08)}}',
  '.fx-pop.crack .top{transform:translateY(-58px) translateX(-12px) rotate(-30deg);opacity:0}',
  '.fx-pop.crack .bot{animation:fxBot .5s cubic-bezier(.34,1.56,.64,1) 1.55s}',
  '@keyframes fxBot{0%{transform:translateY(0) scaleY(1)}30%{transform:translateY(3px) scaleY(.93)}100%{transform:translateY(0) scaleY(1)}}',
  '.fx-pop.crack .fx-rev{opacity:1;transition:opacity .3s 1.65s;animation:fxSpring .8s cubic-bezier(.34,1.56,.64,1) 1.65s forwards}',
  '@keyframes fxSpring{0%{transform:translateY(30px) scale(.25)}55%{transform:translateY(-34px) scale(1.1)}100%{transform:translateY(-22px) scale(1)}}',
  '.fx-pop.crack .fx-rev img{animation:fxFloat 3.2s ease-in-out 2.5s infinite}',
  '@keyframes fxFloat{0%,100%{transform:translateY(0) rotate(-3deg) scale(1)}50%{transform:translateY(-9px) rotate(3deg) scale(1.06)}}',
  '.fx-h{font-size:23px;font-weight:900;color:#e9c475;text-shadow:0 0 20px rgba(233,196,117,.45);margin:4px 0 4px;opacity:0}',
  '.fx-s{font-size:14.5px;color:#eef4fa;font-weight:700;line-height:1.5;margin:0 auto;max-width:340px;opacity:0}',
  '.fx-how{margin:10px auto 0;max-width:344px;font-size:11.5px;color:#9fb2c4;opacity:0}',
  '.fx-expl{margin:12px auto 0;max-width:344px;font-size:12.5px;color:#c3d2e0;background:rgba(92,167,220,.1);border:1px solid rgba(92,167,220,.3);border-radius:12px;padding:10px 13px;text-align:left;opacity:0}','.fx-expl b{color:#7fc0ea}',
  '.fx-k{color:#e9c475;font-weight:900;text-decoration:underline;text-underline-offset:2px}',
  '.fx-g{margin:12px auto 0;max-width:344px;opacity:0}',
  '.fx-g .rl{font-size:11.5px;font-weight:800;color:#e9c475;margin-bottom:5px}',
  '.fx-g .rb{height:8px;border-radius:6px;background:rgba(255,255,255,.1);border:1px solid rgba(255,255,255,.13);overflow:hidden}',
  '.fx-g .rb i{display:block;height:100%;background:linear-gradient(90deg,#cda857,#e9c475)}',
  '.fx-cta{margin-top:16px;display:flex;flex-direction:column;gap:10px;align-items:center;opacity:0}',
  '.fx-main{font-family:inherit;font-weight:900;font-size:14px;padding:11px 22px;border-radius:12px;border:0;cursor:pointer;background:linear-gradient(155deg,#5ca7dc,#4489c7);color:#fff;transition:transform .15s ease}',
  '.fx-main:hover{transform:translateY(-2px)}',
  '.fx-sec{background:none;border:0;color:#c3d2e0;font-family:inherit;font-weight:800;font-size:12.5px;cursor:pointer;text-decoration:underline;text-underline-offset:3px}','.fx-sec:hover{color:#e9c475}',
  '.fx-mute{display:flex;align-items:center;gap:8px;font-size:11.5px;color:#9fb2c4;font-weight:700;cursor:pointer}',
  '.fx-pop.reveal .fx-h{animation:fxIn .5s ease 1.9s forwards}',
  '.fx-pop.reveal .fx-s{animation:fxIn .5s ease 2.05s forwards}',
  '.fx-pop.reveal .fx-how{animation:fxIn .5s ease 2.15s forwards}',
  '.fx-pop.reveal .fx-expl{animation:fxIn .5s ease 2.25s forwards}',
  '.fx-pop.reveal .fx-g{animation:fxIn .5s ease 2.3s forwards}',
  '.fx-pop.reveal .fx-cta{animation:fxIn .5s ease 2.4s forwards}',
  '@keyframes fxIn{to{opacity:1;transform:none}}',
  '.fx-lv{width:100%;max-width:280px}',
  '.fx-lv .lup{font-size:28px;font-weight:900;letter-spacing:.05em;color:#fff;text-shadow:0 0 18px rgba(233,196,117,.6);opacity:0}',
  '.fx-lv .num{font-size:40px;font-weight:900;color:#e9c475;line-height:1;margin:2px 0 12px;opacity:0}',
  '.fx-lv .xp{height:12px;border-radius:8px;background:rgba(255,255,255,.1);overflow:hidden;border:1px solid rgba(255,255,255,.13)}',
  '.fx-lv .xp i{display:block;height:100%;width:0;background:linear-gradient(90deg,#5ca7dc,#e9c475)}',
  '.fx-pop.reward .fx-lv .lup{animation:fxIn .5s cubic-bezier(.34,1.56,.64,1) .3s forwards}',
  '.fx-pop.reward .fx-lv .num{animation:fxIn .5s cubic-bezier(.34,1.56,.64,1) .5s forwards}',
  '.fx-pop.reward .fx-lv .xp i{animation:fxXp 1s ease .6s forwards}','@keyframes fxXp{to{width:100%}}',
  '#tfczFxDot{position:fixed;width:3px;height:3px;border-radius:50%;background:rgba(255,255,255,.21);z-index:0;pointer-events:none}',
  '.fx-hint{position:relative}',
  '.fx-hint::after{content:"";position:absolute;inset:-4px;border-radius:inherit;pointer-events:none;box-shadow:0 0 0 0 rgba(233,196,117,.55);animation:fxPulse 2.6s ease-out infinite}',
  '@keyframes fxPulse{0%{box-shadow:0 0 0 0 rgba(233,196,117,.55)}70%{box-shadow:0 0 0 12px rgba(233,196,117,0)}100%{box-shadow:0 0 0 0 rgba(233,196,117,0)}}',
  '@media(prefers-reduced-motion:reduce){.fx-pop *,#tfczFxDot,.fx-hint::after{animation:none!important}}'
  ].join('');
  var st=document.createElement('style'); st.textContent=css; document.head.appendChild(st);

  /* ---- Overlay ---- */
  var ov=document.createElement('div'); ov.className='fx-ov';
  ov.innerHTML='<span class="fx-acc"></span><div class="fx-pop"></div>';
  document.body.appendChild(ov);
  var acc=ov.querySelector('.fx-acc'), pop=ov.querySelector('.fx-pop'), cheese=null, closing=false, pending=null;
  var lastPt={x:innerWidth/2,y:innerHeight/2};
  addEventListener('pointerdown',function(e){ lastPt={x:e.clientX,y:e.clientY}; },true);

  /* ---- Schalen (SVG) ---- */
  var BOT_P='M50 128 C20 128 8 104 8 82 C8 74 12 66 18 60 L82 60 C88 66 92 74 92 82 C92 104 80 128 50 128 Z';
  var TOP_P='M50 2 C74 2 92 40 92 62 L8 62 C8 40 26 2 50 2 Z';
  function shellBot(){return '<svg viewBox="0 0 100 130"><defs><linearGradient id="fxB" x1=".2" y1="0" x2=".85" y2="1"><stop offset="0" stop-color="#f6dfae"/><stop offset=".4" stop-color="#e9c475"/><stop offset="1" stop-color="#a8862f"/></linearGradient><radialGradient id="fxBG" cx="32%" cy="28%" r="70%"><stop offset="0" stop-color="#fff" stop-opacity=".38"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient></defs><g class="half bot"><path d="'+BOT_P+'" fill="url(#fxB)"/><path d="'+BOT_P+'" fill="url(#fxBG)"/><circle cx="28" cy="84" r="4.6" fill="#4489c7" opacity=".5"/><circle cx="60" cy="98" r="5.4" fill="#8f6f24" opacity=".38"/><circle cx="44" cy="112" r="3.4" fill="#4489c7" opacity=".4"/><circle cx="74" cy="82" r="3.2" fill="#8f6f24" opacity=".42"/><circle cx="20" cy="102" r="2.6" fill="#4489c7" opacity=".32"/><path d="M18 60 L28 68 L38 60 L48 68 L58 60 L68 68 L78 60 L82 60 L82 65 L18 65 Z" fill="#0d273d" opacity=".55"/><ellipse cx="50" cy="66" rx="33" ry="5" fill="#0d273d" opacity=".38"/></g></svg>';}
  function shellTop(){return '<svg viewBox="0 0 100 130"><defs><linearGradient id="fxT" x1=".2" y1="0" x2=".85" y2="1"><stop offset="0" stop-color="#f8e6bd"/><stop offset=".45" stop-color="#e9c475"/><stop offset="1" stop-color="#b8963f"/></linearGradient><radialGradient id="fxTG" cx="34%" cy="26%" r="68%"><stop offset="0" stop-color="#fff" stop-opacity=".42"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient></defs><g class="half top"><path d="'+TOP_P+'" fill="url(#fxT)"/><path d="'+TOP_P+'" fill="url(#fxTG)"/><ellipse cx="36" cy="25" rx="8" ry="13" fill="#fff" opacity=".3" transform="rotate(-18 36 25)"/><circle cx="63" cy="23" r="4.8" fill="#4489c7" opacity=".5"/><circle cx="30" cy="47" r="5" fill="#8f6f24" opacity=".38"/><circle cx="72" cy="45" r="3.4" fill="#4489c7" opacity=".42"/><circle cx="49" cy="13" r="3" fill="#8f6f24" opacity=".35"/><path d="M8 62 L18 55 L28 62 L38 55 L48 62 L58 55 L68 62 L78 55 L92 62 Z" fill="#0d273d" opacity=".5"/></g></svg>';}

  /* ---- Partikel-Kanone (Sprite, unendlich) ---- */
  function startCheese(emb, box){
    /* Sparmodus/Barrierefreiheit: bei reduzierter Bewegung KEINE Partikel-Feier (Vasco, Perf) */
    if(matchMedia&&matchMedia('(prefers-reduced-motion:reduce)').matches) return { fade:function(){}, stop:function(){} };
    var SPR=document.createElement('canvas'); SPR.width=SPR.height=72;
    var sc=SPR.getContext('2d'); sc.font='58px "Apple Color Emoji","Segoe UI Emoji","Noto Color Emoji","Twemoji Mozilla",sans-serif';
    sc.textAlign='center'; sc.textBaseline='middle'; sc.fillText('\uD83E\uDDC0',36,40);
    var field=document.createElement('canvas');
    field.style.cssText='position:fixed;inset:0;width:100vw;height:100vh;z-index:6;pointer-events:none;transition:opacity .45s ease';
    ov.insertBefore(field, ov.firstChild);
    var erupt=document.createElement('canvas');
    erupt.style.cssText='position:absolute;inset:0;width:100%;height:100%;z-index:5;pointer-events:none';
    box.appendChild(erupt);
    var fx=field.getContext('2d'), ex=erupt.getContext('2d'), dpr=Math.min(window.devicePixelRatio||1,1.5), W,H, bx;  /* Cap 1.5 statt 2: ~1.8x weniger Fuellrate (Vasco, Perf) */
    function resize(){ W=innerWidth;H=innerHeight; field.width=W*dpr;field.height=H*dpr; fx.setTransform(dpr,0,0,dpr,0,0);
      bx=box.getBoundingClientRect(); erupt.width=Math.max(1,bx.width*dpr); erupt.height=Math.max(1,bx.height*dpr); ex.setTransform(dpr,0,0,dpr,0,0); }
    resize();
    var ps=[], raf, run=true, tick=0, MAX=(innerWidth<=600?120:200), mouse={x:-9999,y:-9999},  /* Mobile weniger Partikel: O(n^2)-Kollision guenstiger (Vasco, Perf) */
        RAYS=[-150,-128,-106,-74,-52,-30].map(function(d){return d*Math.PI/180;});
    function emc(){var e=emb.getBoundingClientRect();return {x:e.left+e.width/2,y:e.top+e.height*0.42};}
    function spawn(){var o=emc(),a=RAYS[(Math.random()*RAYS.length)|0]+(Math.random()-.5)*0.2,sp=7.5+Math.random()*4.5,s=18+Math.random()*10;
      ps.push({x:o.x,y:o.y,vx:Math.cos(a)*sp,vy:Math.sin(a)*sp,rot:Math.random()*6.28,vr:0,s:s,r:s*0.42,out:false});}
    function onMove(e){mouse.x=e.clientX;mouse.y=e.clientY;}
    function onOut(){mouse.x=-9999;mouse.y=-9999;}
    function onDown(e){var mx=e.clientX,my=e.clientY;
      for(var i=0;i<ps.length;i++){var p=ps[i];if(!p.out)continue;var dx=p.x-mx,dy=p.y-my,d=Math.hypot(dx,dy);
        if(d<80){var f=1-d/80;p.vx+=(dx/(d||1))*7*f;p.vy-=(9+7*f);p.vr=(Math.random()-.5)*.7;}}}
    addEventListener('resize',resize); addEventListener('mousemove',onMove); addEventListener('mouseout',onOut); addEventListener('pointerdown',onDown);
    var G=0.42;
    function fr(){ if(!run)return; var FL=H-14; tick++;
      if(tick%3===0){ if(ps.length>=MAX) ps.shift(); spawn(); }
      bx=box.getBoundingClientRect();
      for(var i=0;i<ps.length;i++){ if(!ps[i].out)continue; for(var j=i+1;j<ps.length;j++){ if(!ps[j].out)continue;
        var a=ps[i],b=ps[j],dx=b.x-a.x,dy=b.y-a.y,d=Math.hypot(dx,dy)||0.01,mn=a.r+b.r;
        if(d<mn){var ux=dx/d,uy=dy/d,ovl=(mn-d)/2;a.x-=ux*ovl;a.y-=uy*ovl;b.x+=ux*ovl;b.y+=uy*ovl;
          var sep=(b.vx-a.vx)*ux+(b.vy-a.vy)*uy; if(sep<0){var im=sep*0.5;a.vx+=ux*im;a.vy+=uy*im;b.vx-=ux*im;b.vy-=uy*im;}}}}
      fx.clearRect(0,0,W,H); ex.clearRect(0,0,bx.width,bx.height);
      for(var k=0;k<ps.length;k++){var p=ps[k];
        p.vy+=G;
        var mdx=p.x-mouse.x,mdy=p.y-mouse.y,md=Math.hypot(mdx,mdy),R=140;
        if(md<R){var f=1-md/R;p.vx+=(mdx/(md||1))*f*3.4;p.vy+=(mdy/(md||1))*f*3.4;}
        p.vx*=0.992;p.x+=p.vx;p.y+=p.vy;p.rot+=p.vr;
        if(!p.out){ if(p.x+p.r<bx.left||p.x-p.r>bx.right||p.y+p.r<bx.top||p.y-p.r>bx.bottom) p.out=true; }
        else{
          /* Kaese fallen und bleiben liegen: kein Aufspringen, kein Eigendreh. Anklicken schleudert sie hoch (onDown). (Vasco) */
          if(p.x<p.r){p.x=p.r;p.vx=0;} if(p.x>W-p.r){p.x=W-p.r;p.vx=0;}
          if(p.y>FL-p.r){p.y=FL-p.r;p.vy=0;p.vx*=0.8;p.vr*=0.6;if(Math.abs(p.vr)<0.02)p.vr=0;}
        }
        if(p.out){ fx.save();fx.translate(p.x,p.y);fx.rotate(p.rot);fx.drawImage(SPR,-p.s/2,-p.s/2,p.s,p.s);fx.restore(); }
        else { ex.save();ex.translate(p.x-bx.left,p.y-bx.top);ex.rotate(p.rot);ex.drawImage(SPR,-p.s/2,-p.s/2,p.s,p.s);ex.restore(); }
      }
      raf=requestAnimationFrame(fr);}
    fr();
    return { fade:function(){ field.style.opacity='0'; },
      stop:function(){ run=false; if(raf)cancelAnimationFrame(raf);
        removeEventListener('resize',resize); removeEventListener('mousemove',onMove); removeEventListener('mouseout',onOut); removeEventListener('pointerdown',onDown);
        if(field.parentNode)field.parentNode.removeChild(field); if(erupt.parentNode)erupt.parentNode.removeChild(erupt); } };
  }

  /* ---- Belohnung ---- */
  function maybeReward(){
    if(count()>=GOAL && loggedIn() && !NOTIFIED){
      NOTIFIED=true; try{localStorage.setItem('tfcz_fx_n','1');}catch(e){}
      try{ if(window.TFCZ_FX_NOTIFY) window.TFCZ_FX_NOTIFY({user:window.TFCZ_USER,count:count(),at:GOAL}); }catch(e){}
    }
  }

  /* ---- Popup ---- */
  function render(item, reward){
    var c=count(), remain=N-c, first=(c===1);
    var head = reward ? T.headReward : (remain>0 ? (first?T.headFirst:T.head) : T.headAll);
    var stage = reward
      ? '<div class="fx-stage"><div class="fx-lv"><div class="lup">'+T.rewardBadge+'</div><div class="num">'+c+'</div><div class="xp"><i></i></div></div></div>'
      : '<div class="fx-stage"><div class="fx-o"><div class="fx-rev"><img src="'+EMBLEM+'" alt=""></div>'+shellBot()+shellTop()+'</div></div>';
    var body = reward ? fill(T.reward) : item.s;
    var expl = first ? '<div class="fx-expl">'+fill(T.explFirst)+'</div>'
                     : (loggedIn()?'':'<div class="fx-expl">'+fill(T.explLogin)+'</div>');
    var gDone=Math.min(c,GOAL);
    var gTxt = c>=GOAL ? fill(T.racDone) : fill(T.racOpen).replace(/\{R\}/g,(GOAL-c));
    pop.className='fx-pop'+(reward?' reward':'');
    pop.innerHTML='<button class="fx-x" aria-label="Schliessen">'+FX_X+'</button>'
      +'<div class="fx-prog"><div class="pl"><span>'+T.progLabel+'</span><b>'+c+' / '+N+'</b></div><div class="fx-bar"><i style="width:'+(c/N*100)+'%"></i></div></div>'
      +stage
      +'<div class="fx-h">'+head+'</div>'
      +'<p class="fx-s">'+body+'</p>'
      +(reward?'':'<div class="fx-how">'+item.how+'</div>')
      +expl
      +'<div class="fx-g"><div class="rl">'+gTxt+'</div><div class="rb"><i style="width:'+(gDone/GOAL*100)+'%"></i></div></div>'
      +'<div class="fx-cta"><button class="fx-main" data-close>'+T.cta+'</button>'
      +(reward?'':'<label class="fx-mute"><input type="checkbox" id="fxMute"'+(isMuted(item.i)?' checked':'')+'> '+T.mute+'</label>')
      +(loggedIn()?'':'<button class="fx-sec" data-login>'+T.loginCta+'</button>')
      +'</div>';
    ov.classList.add('on');
    acc.style.left=lastPt.x+'px'; acc.style.top=lastPt.y+'px';
    requestAnimationFrame(function(){
      var r=pop.getBoundingClientRect();
      pop.style.transformOrigin=(lastPt.x-r.left)+'px '+(lastPt.y-r.top)+'px';
      requestAnimationFrame(function(){ pop.classList.add('open'); });
    });
    setTimeout(function(){ pop.classList.add('reveal'); if(!reward) pop.classList.add('crack'); }, reward?200:780);
    setTimeout(function(){ if(cheese)cheese.stop(); var im=pop.querySelector('.fx-rev img')||pop.querySelector('.fx-lv'); if(im) cheese=startCheese(im,pop); }, reward?900:2430);
    pop.querySelector('.fx-x').onclick=close;
    var cb=pop.querySelector('[data-close]'); if(cb) cb.onclick=close;
    var lb=pop.querySelector('[data-login]'); if(lb) lb.onclick=function(){ if(window.TFCZ_FX_LOGIN)window.TFCZ_FX_LOGIN(); else location.href=BASE+C.login; };
    /* Toggle betrifft NUR diesen einen Eintrag — alle anderen Popups kommen weiterhin. */
    var mu=pop.querySelector('#fxMute'); if(mu) mu.onchange=function(){ setMute(item.i, mu.checked); };
  }
  function close(){
    if(closing || !ov.classList.contains('on')) return; closing=true;
    pop.classList.add('closing');
    if(cheese) cheese.fade();
    setTimeout(function(){
      ov.classList.remove('on'); pop.className='fx-pop'; pop.style.transformOrigin=''; pop.innerHTML='';
      if(cheese){ cheese.stop(); cheese=null; } closing=false;
      var p=pending; pending=null; if(p) p();
    }, 520);
  }

  /* ---- Fund ---- */
  function find(id, opts){
    opts=opts||{}; var item=byId(id); if(!item) return;
    if(ov.classList.contains('on')){ if(opts.then) opts.then(); return; }
    if(isFound(id) && !opts.force){ if(opts.then) opts.then(); return; }
    if(loggedIn()){ SAVED[id]=1; apiSave(savedIds()); } else { SESSION[id]=1; }
    if(item.t==='dot') syncDot();
    if(item.hint) syncHint();
    maybeReward();
    pending = opts.then || null;
    var reward=false;
    if(count()>=GOAL && !REWARD_SHOWN){ REWARD_SHOWN=true; if(loggedIn()){try{localStorage.setItem('tfcz_fx_r','1');}catch(e){}} reward=true; }
    /* Nur DIESER Eintrag ist stumm → Fund zählt, kein Fenster. Die Belohnung wird trotzdem gezeigt. */
    if(isMuted(id) && !reward){ var p=pending; pending=null; if(p)p(); return; }
    render(item, reward);
  }

  /* ---- Ruhender Punkt ---- */
  var dotCfg=C.dot||{grid:38,right:40,vy:.62,tol:11}, dotItem=it('dot'), dot=null;
  function placeDot(){
    if(!dot) return; var g=dotCfg.grid;
    var x=g*Math.round((innerWidth-dotCfg.right)/g);
    var y=g*Math.round((innerHeight*dotCfg.vy)/g);
    dot.style.left=(x-1.5)+'px'; dot.style.top=(y-1.5)+'px';
  }
  function syncDot(){
    if(!dotItem) return;
    if(isFound(dotItem.i)){ if(dot&&dot.parentNode){dot.parentNode.removeChild(dot); dot=null;} return; }
    if(dot) return;
    dot=document.createElement('div'); dot.id='tfczFxDot';
    document.body.appendChild(dot); placeDot();
    addEventListener('resize',placeDot);
  }
  document.addEventListener('click',function(e){
    if(!dot || !dotItem || isFound(dotItem.i)) return;
    if(e.target.closest && e.target.closest('a,button,input,select,textarea,label,summary')) return;
    var r=dot.getBoundingClientRect(), cx=r.left+r.width/2, cy=r.top+r.height/2;
    if(Math.hypot(e.clientX-cx, e.clientY-cy) <= (dotCfg.tol||11)){ lastPt={x:e.clientX,y:e.clientY}; find(dotItem.i); }
  });

  /* ---- Hinweis-Puls ---- */
  function syncHint(){
    for(var i=0;i<N;i++){ var m=IT[i]; if(!m.hint||!m.sel) continue;
      var el=document.querySelector(m.sel); if(!el) continue;
      if(isFound(m.i)) el.classList.remove('fx-hint'); else el.classList.add('fx-hint'); }
  }

  /* ---- Trigger (generisch, konfig-getrieben) ---- */
  function bind(){
    syncDot(); syncHint();
    var multi={}, rep={};

    document.addEventListener('click',function(e){
      var t=e.target; if(!t.closest) return;
      for(var i=0;i<N;i++){
        var m=IT[i]; if(!m.sel) continue;
        var el=null; try{ el=t.closest(m.sel); }catch(err){ continue; }
        if(!el) continue;
        if(isFound(m.i)) continue;

        if(m.t==='click'){ (function(id){ setTimeout(function(){ find(id); },40); })(m.i); }

        else if(m.t==='multiclick'){
          var now=Date.now(), st2=multi[m.i]||{c:0,t:0};
          st2.c=(now-st2.t < (m.win||600))? st2.c+1 : 1; st2.t=now; multi[m.i]=st2;
          if(st2.c>=(m.k||3)){ st2.c=0; lastPt={x:e.clientX,y:e.clientY}; find(m.i); }
        }

        else if(m.t==='classcheck'){ (function(node,id,cls){ setTimeout(function(){ if(node.classList.contains(cls)) find(id); },0); })(el,m.i,m.cls);}

        else if(m.t==='repeat'){ (function(id,chk,k){ setTimeout(function(){
              if(document.querySelector(chk)){ rep[id]=(rep[id]||0)+1; if(rep[id]>=k){ rep[id]=0; find(id); } }
              else rep[id]=0; },30); })(m.i,m.check,m.k||3); }

        else if(m.t==='nav'){
          e.preventDefault(); lastPt={x:e.clientX,y:e.clientY};
          (function(node,id,ext){ var href=node.getAttribute('href'), tgt=node.getAttribute('target');
            find(id,{then:function(){ if(!href) return; if(ext||tgt==='_blank') window.open(href,'_blank','noopener'); else location.href=href; }});
          })(el,m.i,m.ext);
        }
      }
    });

    for(var i=0;i<N;i++){
      var m=IT[i];
      if(m.t==='scrollx' && m.sel){
        var node=document.querySelector(m.sel);
        if(node){ (function(nd,id){
          /* Nur ECHTE Nutzer-Gesten zaehlen (Wheel/Touch-Drag/Maus-Drag) — NICHT die
             Auto-Scroll-Animation der Faktenbar (die setzt scrollLeft selbst). Darum KEIN
             'scroll'-Listener. Schwelle bewusst hoch, damit es ein absichtliches Wischen braucht. (Vasco) */
          var acc=0, fired=false, tx=null, px=null, drag=false;
          function bump(d){ if(fired)return; acc+=Math.abs(d||0); if(acc>=90){ fired=true; find(id); } }
          nd.addEventListener('wheel',function(e){ bump(e.deltaX); },{passive:true});
          nd.addEventListener('touchstart',function(e){ tx=(e.touches&&e.touches[0])?e.touches[0].clientX:null; },{passive:true});
          nd.addEventListener('touchmove',function(e){ var x=(e.touches&&e.touches[0])?e.touches[0].clientX:null; if(tx!==null&&x!==null){ bump(x-tx); tx=x; } },{passive:true});
          nd.addEventListener('pointerdown',function(e){ if(e.pointerType!=='touch'){ drag=true; px=e.clientX; } },{passive:true});
          nd.addEventListener('pointermove',function(e){ if(drag&&px!==null){ bump(e.clientX-px); px=e.clientX; } },{passive:true});
          var pu=function(){ drag=false; px=null; };
          nd.addEventListener('pointerup',pu,{passive:true}); nd.addEventListener('pointercancel',pu,{passive:true});
        })(node,m.i); }
      }
      if(m.t==='scrollend'){
        var re=new RegExp(m.page,'i');
        if(re.test(location.pathname) || re.test(document.title)){
          (function(id){ var fired=false;
            addEventListener('scroll',function(){ if(fired)return;
              if(innerHeight+scrollY >= document.body.scrollHeight-40){ fired=true; find(id); } },{passive:true});
          })(m.i);
        }
      }
      if(m.t==='circles'){
        (function(id,k){
          var buf=[], ang=0, last=null, ts=0;
          addEventListener('mousemove',function(e){
            if(isFound(id)) return;
            var now=Date.now(); if(now-ts>1200){ buf=[]; ang=0; last=null; } ts=now;
            buf.push({x:e.clientX,y:e.clientY}); if(buf.length>40) buf.shift();
            if(buf.length<12) return;
            var cx=0,cy=0,q; for(q=0;q<buf.length;q++){cx+=buf[q].x;cy+=buf[q].y;} cx/=buf.length; cy/=buf.length;
            if(Math.hypot(e.clientX-cx,e.clientY-cy)<25) return;
            var a=Math.atan2(e.clientY-cy,e.clientX-cx);
            if(last!==null){ var d=a-last; while(d>Math.PI)d-=2*Math.PI; while(d<-Math.PI)d+=2*Math.PI; ang+=d; }
            last=a;
            if(Math.abs(ang)>=(k||5)*2*Math.PI){ ang=0; buf=[]; last=null; lastPt={x:e.clientX,y:e.clientY}; find(id); }
          },{passive:true});
        })(m.i,m.k);
      }
    }
  }

  addEventListener('keydown',function(e){ if(e.key==='Escape') close(); });
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',bind); else bind();

  window.TFCZ_FX={ total:N, count:count, goal:GOAL,
    /* Für die Eierjagd-Seite (hinter dem Login): Liste aller Eier + Fund-Status.
       items enthält je {i,title,how,s}. Die Seite zeigt Fundort/Spruch NUR bei gefundenen. */
    items:IT, isFound:isFound,
    onLogin:function(){ var k; for(k in SESSION){ if(SESSION[k]) SAVED[k]=1; } SESSION={}; apiSave(savedIds()); maybeReward(); syncDot(); },
    reset:function(){ SESSION={}; SAVED={}; NOTIFIED=false; REWARD_SHOWN=false; MUTES={};
      try{['tfcz_fx_f','tfcz_fx_n','tfcz_fx_r','tfcz_fx_m'].forEach(function(k){localStorage.removeItem(k);});}catch(e){}
      apiSave([]); syncDot(); syncHint(); } };
})();
