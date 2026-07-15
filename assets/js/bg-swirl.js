/* ============================================================
   TFCZ Hintergrund — Schwerkraft-Wirbel (globaler Standard)
   Eine Quelle der Wahrheit für ALLE Seiten. Einbinden:
     <script defer src="assets/js/bg-swirl.js"></script>
   - erstellt bei Bedarf selbst ein <canvas id="bg"> + CSS (z-index:0)
   - wirbelt NUR solange die Maus sich bewegt
   - stoppt die Maus (~140ms), kehren die Punkte langsam & smooth
     (Genie-Feder ~0.010 / Dämpfung ~0.91) an ihre Position zurück
   - Loop hält an, wenn alles ruht (CPU/Akku), startet bei Bewegung neu
   - aus auf kleinen Screens (≤760px) & bei prefers-reduced-motion
   Werte deckungsgleich mit dem früheren Home-Inline-Stand (Brand-Guide-Standard).
   ============================================================ */
(function(){
  if(window.__tfczBg) return; window.__tfczBg=true;

  // CSS sicherstellen
  if(!document.getElementById('tfcz-bg-style')){
    var st=document.createElement('style'); st.id='tfcz-bg-style';
    st.textContent='#bg{position:fixed;inset:0;width:100vw;height:100vh;z-index:0;pointer-events:none}';
    document.head.appendChild(st);
  }
  // Canvas sicherstellen
  var cv=document.getElementById('bg');
  if(!cv){ cv=document.createElement('canvas'); cv.id='bg'; cv.setAttribute('aria-hidden','true'); document.body.insertBefore(cv, document.body.firstChild); }

  var ctx=cv.getContext('2d'), dpr=Math.min(window.devicePixelRatio||1,2), W,H, pts=[],
      mouse={x:-9999,y:-9999,on:false}, bR={left:0,top:0}, lastMove=0, running=false,
      REDUCE=matchMedia('(prefers-reduced-motion:reduce)').matches;

  function build(){ pts=[]; var g=38; for(var y=g/2;y<H;y+=g) for(var x=g/2;x<W;x+=g) pts.push({bx:x,by:y,x:x,y:y,vx:0,vy:0}); }
  function rs(){ bR=cv.getBoundingClientRect(); W=bR.width; H=bR.height;
    var cap=2800, edpr=Math.min(dpr, cap/Math.max(1,W), cap/Math.max(1,H));
    cv.width=Math.max(1,Math.round(W*edpr)); cv.height=Math.max(1,Math.round(H*edpr)); ctx.setTransform(edpr,0,0,edpr,0,0); build(); }
  var _rt=0;
  function rsThrottled(){ if(_rt)cancelAnimationFrame(_rt); _rt=requestAnimationFrame(function(){ _rt=0; rs(); kick(); }); }
  function shouldRun(){ return !REDUCE && !matchMedia('(max-width:760px)').matches; }
  function now(){ return (window.performance&&performance.now())||Date.now(); }

  addEventListener('resize', rsThrottled);
  addEventListener('scroll', function(){ bR=cv.getBoundingClientRect(); }, {passive:true});
  addEventListener('mousemove', function(e){ mouse.x=e.clientX-bR.left; mouse.y=e.clientY-bR.top; mouse.on=true; lastMove=now(); kick(); });
  addEventListener('mouseleave', function(){ mouse.on=false; });

  function frame(){
    if(!shouldRun()){ ctx.clearRect(0,0,W,H); running=false; return; }
    ctx.clearRect(0,0,W,H);
    var moving = mouse.on && (now()-lastMove < 140);   // Idle = Maus steht → kein Wirbel, nur Rückkehr
    var R=180, active=false;
    for(var i=0;i<pts.length;i++){ var p=pts[i];
      if(moving){ var dx=p.x-mouse.x, dy=p.y-mouse.y, d=Math.sqrt(dx*dx+dy*dy)||1;
        if(d<R){ var k=(1-d/R), ux=dx/d, uy=dy/d; p.vx+=(-uy)*k*2.0+(-ux)*k*0.7; p.vy+=(ux)*k*2.0+(-uy)*k*0.7; } }
      // langsame, smoothe „Genie"-Rückkehr an die Ausgangsposition
      p.vx+=(p.bx-p.x)*0.010; p.vy+=(p.by-p.y)*0.010; p.vx*=0.91; p.vy*=0.91; p.x+=p.vx; p.y+=p.vy;
      var sp=Math.min(1,(Math.abs(p.vx)+Math.abs(p.vy))/8);
      if(sp>0.004 || Math.abs(p.x-p.bx)>0.35 || Math.abs(p.y-p.by)>0.35) active=true;
      ctx.beginPath(); ctx.arc(p.x,p.y,1.4+sp*2.6,0,6.2832);
      ctx.fillStyle = sp>0.3 ? 'rgba(233,196,117,'+(0.24+sp*0.35)+')' : 'rgba(255,255,255,.21)'; ctx.fill();
    }
    if(moving||active) requestAnimationFrame(frame); else running=false;   // settled → Loop anhalten
  }
  function kick(){ if(shouldRun()){ if(!running){ running=true; requestAnimationFrame(frame); } } else { ctx.clearRect(0,0,W,H); running=false; } }

  rs(); kick();
})();
