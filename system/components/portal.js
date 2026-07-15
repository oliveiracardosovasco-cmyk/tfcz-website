/* ============================================================
   TFCZ · BAUSTEIN: Portal-Schliessen

   JEDES Fenster, Popup, Modal oder Overlay verschwindet mit derselben
   Animation: es holt kurz Luft, sinkt weich zu einem Lichtspalt zusammen und
   verblasst. Egal ob X-Button, Esc, Backdrop-Klick oder „Weiter" — dieselbe Geste.

   Weich statt schnappend (Vasco 14.07.2026): ~0.62s, ease-out
   (cubic-bezier(.22,.61,.24,1)), ausschliesslich transform + opacity → läuft auf
   der GPU, kein Layout, kein Ruckeln.

   Einbinden (vor den anderen Bausteinen):
     <script defer src="system/components/portal.js"></script>

   Benutzen — statt das Fenster sofort zu verstecken:

     TFCZ.portal.close(fensterEl, function () {
       overlay.classList.remove('on');     // erst NACH der Animation aufräumen
     });

   fensterEl = die BOX/das Fenster (nicht der Backdrop). Läuft die Animation
   durch, wird der Callback aufgerufen; `prefers-reduced-motion` überspringt sie.
   Doppelte Aufrufe (X + Esc gleichzeitig) sind abgesichert.

   Alias `window.TFCZ_PORTAL` bleibt bestehen (das Design Studio ruft ihn so auf).

   Das Öffnen bleibt unberührt (weiterhin das jeweilige Aufgeh-Verhalten).
   ============================================================ */
(function () {
  if (window.__tfczPortal) return;
  window.__tfczPortal = true;

  if (!document.getElementById('tfcz-portal-css')) {
    /* Weich statt schnappend: das Fenster atmet minimal aus, sinkt dann sanft in
       einen Lichtspalt zusammen und verblasst.

       Bewusst NUR transform + opacity — beides läuft auf der GPU (kein Layout,
       kein Repaint). Die frühere clip-path-Variante wirkte hart und ruckelte.
       Das Easing bremst am Ende lange aus (ease-out, kein Bounce), darum wirkt
       es edel statt schnappend. */
    var css =
      '@keyframes tfczPortalClose{' +
        '0%{opacity:1; transform:scale(1,1)}' +
        '22%{opacity:1; transform:scale(1.012,1.008)}' +   /* kurz Luft holen */
        '55%{opacity:.85; transform:scale(.995,.52)}' +
        '85%{opacity:.25; transform:scale(.985,.09)}' +
        '100%{opacity:0; transform:scale(.97,.012)}' +     /* Lichtspalt */
      '}' +
      '.tfcz-portal-closing{' +
        'animation:tfczPortalClose .62s cubic-bezier(.22,.61,.24,1) forwards;' +
        'transform-origin:center center;' +
        'will-change:transform,opacity;' +
        'backface-visibility:hidden;' +   /* kein Flimmern beim Skalieren */
        'pointer-events:none' +
      '}' +
      '@media(prefers-reduced-motion:reduce){.tfcz-portal-closing{animation:none; opacity:0}}';
    var st = document.createElement('style');
    st.id = 'tfcz-portal-css';
    st.textContent = css;
    document.head.appendChild(st);
  }

  function close(el, fertig) {
    if (!el) { if (fertig) fertig(); return; }

    /* schon am Schliessen? nicht doppelt starten */
    if (el.classList.contains('tfcz-portal-closing')) return;

    var reduziert = matchMedia('(prefers-reduced-motion:reduce)').matches;

    var erledigt = false;
    function ende() {
      if (erledigt) return;
      erledigt = true;
      el.removeEventListener('animationend', ende);
      clearTimeout(t);
      el.classList.remove('tfcz-portal-closing');
      if (fertig) fertig();
    }

    if (reduziert) { ende(); return; }

    el.classList.add('tfcz-portal-closing');
    el.addEventListener('animationend', ende);
    var t = setTimeout(ende, 780);   // Sicherheitsnetz, falls animationend ausbleibt (> Animationsdauer)
  }

  window.TFCZ = window.TFCZ || {};
  TFCZ.portal = { close: close };
  window.TFCZ_PORTAL = TFCZ.portal;   // Alias (Design Studio)
})();
