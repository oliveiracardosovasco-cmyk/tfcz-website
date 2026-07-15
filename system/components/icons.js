/* ============================================================
   TFCZ · BAUSTEIN: Pfeile & Icon-Glyphen

   EIN Pfeil, EINE Animation — überall. Vorher standen Text-Glyphen („→", „↗")
   in Buttons und Links: mal animiert, mal statisch, mal fett, mal dünn.

   Einbinden (nach den anderen Bausteinen):
     <script defer src="system/components/icons.js"></script>

   Was der Baustein macht (automatisch, ohne Markup-Änderung):
     · Ein „→" am ENDE eines Links oder Buttons wird zum Lucide `arrow-right`
       (<svg class="tfcz-arw">) mit der immer gleichen Hover-Animation:
       3px nach rechts, .22s.
     · Ein „↗" bei einem externen Link wird zum Lucide `external-link` — vorne
       oder hinten, je nachdem, wo es stand.

   NICHT angefasst: Pfeile im FLIESSTEXT (z. B. „Spielbeginn → Kick-off" in den
   Regeln). Das ist Inhalt, kein Icon. Der Baustein ersetzt nur, was am Rand
   eines Links/Buttons steht — also als Icon gemeint war.
   ============================================================ */
(function () {
  if (window.__tfczIcons) return;
  window.__tfczIcons = true;

  var ARROW = '<svg class="tfcz-arw" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';
  var EXTERN = '<svg class="tfcz-ext" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 3h6v6M10 14 21 3M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/></svg>';

  if (!document.getElementById('tfcz-icons-css')) {
    var css =
      /* Pfeil: überall gleich gross, gleiche Hover-Animation */
      '.tfcz-arw{width:1.05em; height:1.05em; flex:none; display:inline-block; vertical-align:-.15em;' +
        'margin-left:.35em; transition:transform .22s cubic-bezier(.4,0,.2,1)}' +
      'a:hover .tfcz-arw, button:hover .tfcz-arw{transform:translateX(3px)}' +
      '.tfcz-ext{width:1em; height:1em; flex:none; display:inline-block; vertical-align:-.12em;' +
        'margin:0 .3em; opacity:.85; transition:opacity .22s ease}' +
      'a:hover .tfcz-ext{opacity:1}' +
      '@media(prefers-reduced-motion:reduce){.tfcz-arw{transition:none}}';
    var st = document.createElement('style');
    st.id = 'tfcz-icons-css';
    st.textContent = css;
    document.head.appendChild(st);
  }

  /* Alle Textknoten im Link/Button durchgehen (auch in verschachtelten Spans —
     z. B. die Sprach-Varianten auf „Über uns"). Ein Glyph am Ende eines Textknotens
     ist als Icon gemeint und wird ersetzt; mitten im Satz bleibt er stehen. */
  function ersetze(el) {
    var walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT, null);
    var knoten = [], n;
    while ((n = walker.nextNode())) knoten.push(n);

    knoten.forEach(function (k) {
      var v = k.nodeValue;
      var eltern = k.parentNode;

      /* „→" am Ende -> Lucide arrow-right */
      if (/→\s*$/.test(v)) {
        k.nodeValue = v.replace(/\s*→\s*$/, '');
        eltern.insertAdjacentHTML('beforeend', ARROW);
        v = k.nodeValue;
      }
      /* „↗" am Anfang -> external-link vorne, am Ende -> hinten */
      if (/^\s*↗/.test(v)) {
        k.nodeValue = v.replace(/^\s*↗\s*/, '');
        eltern.insertAdjacentHTML('afterbegin', EXTERN);
      } else if (/↗\s*$/.test(v)) {
        k.nodeValue = v.replace(/\s*↗\s*$/, '');
        eltern.insertAdjacentHTML('beforeend', EXTERN);
      }
    });
  }

  function init() {
    [].forEach.call(document.querySelectorAll('a, button'), function (el) {
      if (el.querySelector('svg.tfcz-arw, svg.tfcz-ext')) return;
      var t = el.textContent || '';
      if (t.indexOf('→') < 0 && t.indexOf('↗') < 0) return;
      ersetze(el);
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
