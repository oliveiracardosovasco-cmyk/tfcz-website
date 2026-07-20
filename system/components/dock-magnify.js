/* ============================================================
   TFCZ · BAUSTEIN: Dock-Magnify  (macOS-Dock-Vergrösserung)
   ------------------------------------------------------------
   Vergrössert die Kinder einer horizontalen Reihe STUFENLOS je nach
   Nähe zur Maus (oder zur Scroll-Mitte) — wie das macOS-Dock, wenn man
   mit der Maus über die App-Icons fährt.

   WARUM SO GEBAUT (nicht verhandelbar, sonst ruckelt es):
     · rein GPU-composited: nur `transform: translateX() scale()` + optional opacity
     · KEIN `margin` animieren  (= Layout jeden Frame → ruckelt)
     · KEIN `getBoundingClientRect` pro Zelle pro Frame (= forced reflow)
     · Spreizung wird STUFENLOS gerechnet: kumulative Position + linear
       interpolierter Pivot. Den Fokuspunkt NIE auf die nächste ganze Zelle
       runden (Math.round) — das springt sichtbar (gemessen ~18px pro
       Mini-Schritt). Interpoliert: ~0.4px = glatt.

   NUTZUNG:
     <script defer src="system/components/dock-magnify.js"></script>
     var m = TFCZ.dockMagnify(document.querySelector('.myrow'), {
       amp: 0.34,          // max. Vergrösserung (+34 %)
       sigma: 1.4,         // Reichweite in "Zellen"
       spread: true,       // Nachbarn auseinanderschieben (Dock) statt nur skalieren
       fade: 0,            // 0..1: entfernte Zellen dimmen (0 = aus)
       scrollFocus: false  // zusätzlich: beim Scrollen die Mitte vergrössern (Touch/Strips)
     });
     m.destroy();          // entfernt Listener + setzt zurück
     m.refresh();          // neu anwenden (z. B. nach Inhaltswechsel)

   VORAUSSETZUNGEN am Container:
     · horizontale Flex-Reihe, KINDER GLEICH BREIT (flex:0 0 <w>)
     · Kind-CSS empfohlen:
         transform-origin: center bottom;   // wächst nach oben wie das Dock
         will-change: transform;
         transition: transform .16s ease;    // optional, sanfteres Ein/Aus
     · respektiert prefers-reduced-motion (dann komplett aus)
   ============================================================ */
(function(){
  window.TFCZ = window.TFCZ || {};
  if (TFCZ.dockMagnify) return;

  TFCZ.dockMagnify = function(el, opts){
    if(!el) return { destroy:function(){}, refresh:function(){} };
    opts = opts || {};
    var amp    = opts.amp    != null ? opts.amp    : 0.34;
    var sigma  = opts.sigma  != null ? opts.sigma  : 1.4;
    var spread = opts.spread !== false;
    var fade   = opts.fade   != null ? opts.fade   : 0;
    var s2 = 2*sigma*sigma, raf = 0, center = null, bw = 1;

    function baseWidth(){ var c = el.children[0]; return c ? (c.getBoundingClientRect().width || 1) : 1; }
    function stride(){ var g = parseFloat(getComputedStyle(el).columnGap || getComputedStyle(el).gap) || 0; return bw + g; }

    function apply(){
      raf = 0;
      var kids = el.children, n = kids.length, i; if(!n) return;
      if(center == null){ for(i=0;i<n;i++){ kids[i].style.transform=''; if(fade)kids[i].style.opacity=''; kids[i].style.zIndex=''; } return; }
      var sc=new Array(n), fa=new Array(n), pos=new Array(n), acc=0, ex;
      for(i=0;i<n;i++){ var d=i-center, f=Math.exp(-(d*d)/s2), s=1+amp*f; sc[i]=s; fa[i]=f; ex=spread?(bw*(s-1))/2:0; pos[i]=acc+ex; acc+=2*ex; }
      var fl=Math.max(0,Math.min(n-1,Math.floor(center))), fr=Math.min(n-1,fl+1), t=center-fl; if(t<0)t=0; if(t>1)t=1;
      var pivot=pos[fl]*(1-t)+pos[fr]*t;
      for(i=0;i<n;i++){ var c=kids[i];
        c.style.transform='translateX('+(pos[i]-pivot).toFixed(1)+'px) scale('+sc[i].toFixed(3)+')';
        if(fade) c.style.opacity=((1-fade)+fade*fa[i]).toFixed(2);
        c.style.zIndex=String(60-Math.abs(Math.round(center-i)));
      }
    }
    function schedule(){ if(!raf) raf = requestAnimationFrame(apply); }

    var reduce = matchMedia('(prefers-reduced-motion:reduce)').matches;
    if(reduce) return { destroy:function(){}, refresh:function(){} };

    function onMove(e){ bw=baseWidth(); var r=el.getBoundingClientRect(); center=Math.max(0,Math.min(el.children.length-1,(e.clientX - r.left + el.scrollLeft)/stride() - 0.5)); schedule(); }
    function onLeave(){ center=null; schedule(); }
    function onScroll(){ if(center!=null && matchMedia('(hover:hover)').matches) return; bw=baseWidth(); center=Math.max(0,Math.min(el.children.length-1,(el.scrollLeft + Math.min(el.clientWidth*0.5,130))/stride() - 0.5)); schedule(); }
    function onResize(){ bw=baseWidth(); }

    bw=baseWidth();
    if(matchMedia('(hover:hover)').matches){ el.addEventListener('mousemove',onMove,{passive:true}); el.addEventListener('mouseleave',onLeave,{passive:true}); }
    if(opts.scrollFocus){ el.addEventListener('scroll',onScroll,{passive:true}); onScroll(); }
    addEventListener('resize',onResize,{passive:true});

    return {
      destroy:function(){ el.removeEventListener('mousemove',onMove); el.removeEventListener('mouseleave',onLeave); el.removeEventListener('scroll',onScroll); removeEventListener('resize',onResize); center=null; apply(); },
      refresh:function(){ bw=baseWidth(); schedule(); }
    };
  };
})();
