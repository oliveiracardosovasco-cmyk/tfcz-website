/* ============================================================
   TFCZ · BAUSTEIN: CTA-Verdrahtung

   Liest die Registry (system/cta.js) und verdrahtet jeden Button, der
   `data-cta="…"` trägt:

     · setzt das ZIEL (href)  — immer aus der Registry
     · setzt den TEXT         — nur, wenn das Element leer ist
                                (Buttons mit eigenem Markup, z. B. Sprach-Spans
                                 oder Swap-Animation, bleiben unangetastet)

   Damit führt ein benannter CTA IMMER ans gleiche Ziel — auch wenn ihn jemand
   später woanders einbaut. Ändert sich das Ziel, ändert es sich überall.

   Einbauen:
     <a data-cta="mitglied-werden" class="btn btn-gold">Mitglied werden</a>

   ── Farbregel-Kontrolle ─────────────────────────────────────
   Der Baustein ÄNDERT keine Farben (das wäre ein optischer Eingriff), aber er
   MELDET Verstösse in der Browser-Konsole: ein Button mit Gold-Optik, dessen
   Registry-Eintrag weder `stil:'gold'` (Conversion) noch `stil:'lead'`
   (Lead-Anfrage) ist, wird als Warnung ausgegeben.
   So ist die Farbregel überprüfbar statt nur dokumentiert.
   ============================================================ */
(function () {
  if (window.__tfczCta) return;
  window.__tfczCta = true;

  function apply() {
    var reg = (window.TFCZ && TFCZ.ctas) || {};
    var nodes = document.querySelectorAll('[data-cta]');
    var unbekannt = [];
    var goldVerstoss = [];

    [].forEach.call(nodes, function (el) {
      var key = el.getAttribute('data-cta');
      var cta = reg[key];

      if (!cta) { unbekannt.push(key); return; }

      /* Ziel — immer aus der Registry */
      if (el.tagName === 'A') el.setAttribute('href', cta.href);

      /* Text — nur setzen, wenn der Button leer ist.
         Buttons mit eigenem Innenleben (Sprach-Spans, Swap-Animation, Icons)
         behalten ihr Markup. */
      if (!el.innerHTML.trim() && cta.text) el.textContent = cta.text;

      /* Farbregel prüfen (nur melden, nichts ändern) */
      var goldOptik = /btn-gold|hc-cta10/.test(el.className);
      var goldErlaubt = (cta.stil === 'gold' || cta.stil === 'lead');
      if (goldOptik && !goldErlaubt) {
        goldVerstoss.push(key + ' (' + (cta.text || '') + ')');
      }
    });

    if (unbekannt.length) {
      console.warn('[TFCZ-CTA] Unbekannte CTA-Schlüssel (nicht in system/cta.js):', unbekannt);
    }
    if (goldVerstoss.length) {
      console.warn('[TFCZ-CTA] Gold-Regel verletzt — Gold ist nur für echte Conversion:', goldVerstoss);
    }
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', apply);
  else apply();
})();
