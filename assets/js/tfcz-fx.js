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
  try{ NOTIFIED=localStorage.getItem('tfcz_fx_n')==='1'; }catch(e){}
  try{ REWARD_SHOWN=localStorage.getItem('tfcz_fx_r')==='1'; }catch(e){}
  /* Stumm ist IMMER pro Eintrag (nie global) — der Toggle im Popup betrifft nur genau dieses Ei. */
  try{ (JSON.parse(localStorage.getItem('tfcz_fx_m')||'[]')||[]).forEach(function(k){MUTES[k]=1;}); }catch(e){}
  function isMuted(id){ return !!MUTES[id]; }
  function setMute(id,on){ if(on) MUTES[id]=1; else delete MUTES[id];
    var a=[],k; for(k in MUTES) if(MUTES[k]) a.push(k);
    try{ localStorage.setItem('tfcz_fx_m',JSON.stringify(a)); }catch(e){} }
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
    var SPR=document.createElement('canvas'); SPR.width=SPR.height=72;
    var sc=SPR.getContext('2d'); sc.font='58px "Apple Color Emoji","Segoe UI Emoji","Noto Color Emoji","Twemoji Mozilla",sans-serif';
    sc.textAlign='center'; sc.textBaseline='middle'; sc.fillText('\uD83E\uDDC0',36,40);
    var field=document.createElement('canvas');
    field.style.cssText='position:fixed;inset:0;width:100vw;height:100vh;z-index:6;pointer-events:none;transition:opacity .45s ease';
    ov.insertBefore(field, ov.firstChild);
    var erupt=document.createElement('canvas');
    erupt.style.cssText='position:absolute;inset:0;width:100%;height:100%;z-index:5;pointer-events:none';
    box.appendChild(erupt);
    var fx=field.getContext('2d'), ex=erupt.getContext('2d'), dpr=Math.min(window.devicePixelRatio||1,2), W,H, bx;
    function resize(){ W=innerWidth;H=innerHeight; field.width=W*dpr;field.height=H*dpr; fx.setTransform(dpr,0,0,dpr,0,0);
      bx=box.getBoundingClientRect(); erupt.width=Math.max(1,bx.width*dpr); erupt.height=Math.max(1,bx.height*dpr); ex.setTransform(dpr,0,0,dpr,0,0); }
    resize();
    var ps=[], raf, run=true, tick=0, MAX=200, mouse={x:-9999,y:-9999},
        RAYS=[-150,-128,-106,-74,-52,-30].map(function(d){return d*Math.PI/180;});
    function emc(){var e=emb.getBoundingClientRect();return {x:e.left+e.width/2,y:e.top+e.height*0.42};}
    function spawn(){var o=emc(),a=RAYS[(Math.random()*RAYS.length)|0]+(Math.random()-.5)*0.2,sp=7.5+Math.random()*4.5,s=18+Math.random()*10;
      ps.push({x:o.x,y:o.y,vx:Math.cos(a)*sp,vy:Math.sin(a)*sp,rot:Math.random()*6.28,vr:(Math.random()-.5)*.35,s:s,r:s*0.42,out:false});}
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
          /* Kaese duerfen den Rahmen ueberdecken und stapeln sich vom unteren Bildschirmrand (Vasco, Mobile-Fix) */
          if(p.x<p.r){p.x=p.r;p.vx*=-0.5;} if(p.x>W-p.r){p.x=W-p.r;p.vx*=-0.5;}
          if(p.y>FL-p.r){p.y=FL-p.r;p.vy*=-0.4;p.vx*=0.8;p.vr*=0.7;if(Math.abs(p.vy)<1)p.vy=0;}
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
    if(count()>=GOAL && !REWARD_SHOWN){ REWARD_SHOWN=true; try{localStorage.setItem('tfcz_fx_r','1');}catch(e){} reward=true; }
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
          var acc=0, fired=false, sx=null, tx=null;
          function bump(d){ if(fired)return; acc+=Math.abs(d||0); if(acc>=40){ fired=true; find(id); } }
          nd.addEventListener('wheel',function(e){ bump(e.deltaX); },{passive:true});
          nd.addEventListener('scroll',function(){ if(sx!==null) bump(nd.scrollLeft-sx); sx=nd.scrollLeft; },{passive:true});
          nd.addEventListener('touchstart',function(e){ tx=(e.touches&&e.touches[0])?e.touches[0].clientX:null; },{passive:true});
          nd.addEventListener('touchmove',function(e){ var x=(e.touches&&e.touches[0])?e.touches[0].clientX:null; if(tx!==null&&x!==null){ bump(x-tx); tx=x; } },{passive:true});
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

  window.TFCZ_FX={ total:N, count:count,
    onLogin:function(){ var k; for(k in SESSION){ if(SESSION[k]) SAVED[k]=1; } SESSION={}; apiSave(savedIds()); maybeReward(); syncDot(); },
    reset:function(){ SESSION={}; SAVED={}; NOTIFIED=false; REWARD_SHOWN=false; MUTES={};
      try{['tfcz_fx_f','tfcz_fx_n','tfcz_fx_r','tfcz_fx_m'].forEach(function(k){localStorage.removeItem(k);});}catch(e){}
      apiSave([]); syncDot(); syncHint(); } };
})();
