/* ============================================================
   NAV-DEMO · gemeinsames Verhalten
   Fenster/Overlays öffnen und schliessen SOFORT — Entscheid 26.07.2026,
   keine Auf-/Zu-Animation. Einzige Ausnahme bleibt die X-Quetschung.
   ============================================================ */
/* In der Vergleichs-Vorschau (im Rahmen) stoert die Demo-Leiste nur — dort ausblenden. */
if(window.top !== window.self){
  document.addEventListener('DOMContentLoaded', function(){
    var d = document.querySelector('.demobar'); if(d) d.hidden = true;
  });
}

window.TFCZDemo = (function(){

  /* --- Drawer / Vollbild-Overlay: X, Esc, Backdrop, Klick auf einen Link --- */
  function drawer(opts){
    opts = opts || {};
    var burger = document.getElementById(opts.burger || 'burger');
    var panel  = document.getElementById(opts.panel  || 'drawer');
    var scrim  = document.getElementById(opts.scrim  || 'scrim');
    var close  = document.getElementById(opts.close  || 'dclose');
    if(!burger || !panel) return;
    var last = null;

    function open(){
      last = document.activeElement;
      panel.classList.add('on');
      if(scrim) scrim.classList.add('on');
      burger.setAttribute('aria-expanded','true');
      document.body.style.overflow = 'hidden';
      document.body.classList.add('menuopen');
      var first = panel.querySelector('a,button');
      if(first) first.focus();
    }
    function shut(){
      panel.classList.remove('on');
      if(scrim) scrim.classList.remove('on');
      burger.setAttribute('aria-expanded','false');
      document.body.style.overflow = '';
      document.body.classList.remove('menuopen');
      if(last && last.focus) last.focus();
    }

    burger.addEventListener('click', function(){
      panel.classList.contains('on') ? shut() : open();
    });
    if(close) close.addEventListener('click', shut);
    if(scrim) scrim.addEventListener('click', shut);
    document.addEventListener('keydown', function(e){
      if(e.key === 'Escape' && panel.classList.contains('on')) shut();
    });
    panel.addEventListener('click', function(e){
      if(e.target.closest('a')) shut();
    });
    /* Fokus im offenen Fenster halten */
    panel.addEventListener('keydown', function(e){
      if(e.key !== 'Tab') return;
      var f = panel.querySelectorAll('a[href],button:not([disabled])');
      if(!f.length) return;
      var first = f[0], lastEl = f[f.length-1];
      if(e.shiftKey && document.activeElement === first){ e.preventDefault(); lastEl.focus(); }
      else if(!e.shiftKey && document.activeElement === lastEl){ e.preventDefault(); first.focus(); }
    });
    return { open: open, close: shut };
  }

  /* --- Scrollspy: markiert genau EINEN aktiven Abschnitt in Leiste und Anzeige --- */
  function spy(ids){
    var secs = ids.map(function(id){ return document.getElementById(id); }).filter(Boolean);
    var links = [].slice.call(document.querySelectorAll('.spy a, .nav a.lnk, .paths a'));
    var ticking = false;

    function mark(){
      ticking = false;
      var probe = window.scrollY + window.innerHeight * 0.32;
      var current = secs[0];
      secs.forEach(function(s){ if(s.offsetTop <= probe) current = s; });
      var hash = '#' + (current ? current.id : '');
      links.forEach(function(a){
        var on = a.getAttribute('href') === hash;
        if(on) a.setAttribute('aria-current','true'); else a.removeAttribute('aria-current');
        if(on && a.closest('.spy')) a.scrollIntoView({block:'nearest', inline:'center'});
      });
    }
    function onScroll(){ if(!ticking){ ticking = true; requestAnimationFrame(mark); } }
    window.addEventListener('scroll', onScroll, {passive:true});
    window.addEventListener('resize', onScroll);
    mark();
  }

  return { drawer: drawer, spy: spy };
})();
