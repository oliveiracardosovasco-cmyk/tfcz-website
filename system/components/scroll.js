/* ============================================================
   TFCZ · BAUSTEIN: Scroll zu Anker

   Ein Sprungverhalten für alle Seiten:
     · sanftes, etwas langsameres Ausbremsen (ease-out-cubic, ~760 ms)
     · Stopp UNTERHALB der sticky Menüleiste — der Titel verschwindet nie
       hinter der Nav (das war der Grund für die Regel)
     · `prefers-reduced-motion` -> sofortiger Sprung

   Einbinden:
     <script defer src="system/components/scroll.js"></script>

   Wichtig: `scroll-behavior:smooth` im Seiten-CSS muss WEG — es kollidiert mit
   dem eigenen Easing (der Browser bremst dann zweimal). Der Baustein entfernt
   die Eigenschaft nicht selbst; sie wurde aus den Seiten entfernt.

   Ausgenommen: das Kopf-Logo (hat sein eigenes Press-/Sprung-Verhalten) und
   Links mit `data-noscroll`.
   ============================================================ */
(function () {
  if (window.__tfczScroll) return;
  window.__tfczScroll = true;

  var DAUER = 760;

  function navHoehe() {
    var v = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--tfcz-navh'), 10);
    if (v) return v;
    var n = document.querySelector('nav.nav, header.top, .top');
    return n ? Math.round(n.getBoundingClientRect().height) : 64;
  }

  function easeOutCubic(t) { return 1 - Math.pow(1 - t, 3); }

  function springe(ziel) {
    var start = scrollY;
    var ende = Math.max(0, ziel.getBoundingClientRect().top + scrollY - navHoehe() - 12);
    var weg = ende - start;

    if (matchMedia('(prefers-reduced-motion:reduce)').matches || Math.abs(weg) < 4) {
      scrollTo(0, ende);
      return;
    }

    var t0 = null;
    function schritt(ts) {
      if (t0 === null) t0 = ts;
      var p = Math.min(1, (ts - t0) / DAUER);
      scrollTo(0, start + weg * easeOutCubic(p));
      if (p < 1) requestAnimationFrame(schritt);
    }
    requestAnimationFrame(schritt);
  }

  document.addEventListener('click', function (e) {
    var a = e.target.closest('a[href^="#"], a[href*=".html#"]');
    if (!a || a.hasAttribute('data-noscroll')) return;
    if (a.closest('.logo')) return;                  /* Logo hat eigenes Verhalten */

    var href = a.getAttribute('href') || '';
    var i = href.indexOf('#');
    if (i < 0) return;

    /* Link auf eine ANDERE Seite: normal navigieren lassen */
    var seite = href.slice(0, i);
    if (seite && seite.indexOf('.html') >= 0) {
      var hier = location.pathname.split('/').pop() || 'index.html';
      if (seite !== hier) return;
    }

    var id = href.slice(i + 1);
    if (!id) return;
    var ziel = document.getElementById(id);
    if (!ziel) return;

    e.preventDefault();
    springe(ziel);
    history.replaceState(null, '', '#' + id);
  });
})();
