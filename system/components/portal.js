/* ============================================================
   TFCZ · BAUSTEIN: Portal-Schliessen

   Fenster, Popups, Modals und Overlays schliessen SOFORT — ohne Auf-/Zu-Effekt,
   ohne Zusammensinken, ohne Verblassen. (Vasco 26.07.2026: keine Ein-/Ausblend-
   Animation der Fenster mehr — auch nicht bei den Easter Eggs. Der X-Button
   behält als EINZIGES seine federnde Hover-Quetschung.)

   Einbinden (vor den anderen Bausteinen):
     <script defer src="system/components/portal.js"></script>

   Benutzen — genau wie bisher, damit alle bestehenden Aufrufe unverändert laufen:

     TFCZ.portal.close(fensterEl, function () {
       overlay.classList.remove('on');     // Aufräumen
     });

   `fensterEl` wird nicht mehr animiert; der Callback läuft sofort. Der Alias
   `window.TFCZ_PORTAL` bleibt bestehen (das Design Studio ruft ihn so auf).
   ============================================================ */
(function () {
  if (window.__tfczPortal) return;
  window.__tfczPortal = true;

  /* Sofort schliessen: keine Animation, kein Zustand, keine Timer.
     Der Callback räumt auf (Klasse entfernen / verstecken). */
  function close(el, fertig) {
    if (fertig) fertig();
  }

  window.TFCZ = window.TFCZ || {};
  TFCZ.portal = { close: close };
  window.TFCZ_PORTAL = TFCZ.portal;   // Alias (Design Studio)
})();
