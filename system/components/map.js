/* ============================================================
   TFCZ · BAUSTEIN: Karte  (Google Maps, hell, an die Adresse gepinnt)

   Eine Karte fuer alle Seiten. Fruehere Stände: Home = Google-Embed,
   Firmenevents = OSM-Embed, danach Leaflet + CARTO (dunkel). JETZT:
   ein einziger Google-Maps-Embed, hell, mit Pin direkt auf der Vereins-
   adresse. Keyless (klassischer `output=embed`), kein API-Key, keine Kosten.

   WARUM SO (Vasco, 20.07.2026):
     · Es soll erkennbar GOOGLE MAPS sein (nicht OSM/Leaflet).
     · Pin exakt an der Adresse — darum wird die ADRESSE als Suchbegriff
       an Google uebergeben (q=...), nicht eine Koordinate. Google geocodiert
       selbst und setzt den Marker genau richtig. (Die alten Registry-Koordinaten
       waren der generische Zuerich-Default und sassen daneben.)
     · Dark Mode bewusst NICHT: ein echtes dunkles Google Maps braucht die
       JavaScript-API + API-Key (Billing). Vasco will es hell und keyless lassen.
     · `loading="lazy"` — die Karte laedt erst, wenn man hinscrollt (Performance).

   Einbauen — die Seite schreibt nur den Platzhalter:
     <div data-tfcz="map"></div>
     <script src="system/content.js"></script>
     <script defer src="system/components/map.js"></script>

   Die Adresse kommt aus system/content.js (TFCZ.content.ort.label) — EINE Quelle.
   Verein zieht um → genau eine Zeile in content.js aendern.

   Optional pro Platzhalter:
     data-q="Strasse 1, 8000 Ort"   Adresse ueberschreiben (Sonderfall)
     data-zoom="16"                 Zoomstufe (Default 16)
   ============================================================ */
(function () {
  if (window.__tfczMap) return;
  window.__tfczMap = true;

  var ADR_FALLBACK = 'Landenbergstrasse 10, 8037 Zürich';

  if (!document.getElementById('tfcz-map-css')) {
    var css =
      '.tfcz-map{position:relative; width:100%; height:100%; min-height:240px; background:#0d273d; overflow:hidden}' +
      '.tfcz-map iframe{position:absolute; inset:0; width:100%; height:100%; border:0; display:block}' +
      '.tfcz-map-fallback{display:flex; align-items:center; justify-content:center; height:100%;' +
        'min-height:240px; padding:20px; text-align:center; color:#cda857; font-weight:800; text-decoration:none}';
    var st = document.createElement('style');
    st.id = 'tfcz-map-css';
    st.textContent = css;
    document.head.appendChild(st);
  }

  function bauen(el) {
    if (el.__tfczMap) return;
    el.__tfczMap = true;
    el.classList.add('tfcz-map');

    var ort = (window.TFCZ && TFCZ.content && TFCZ.content.ort) || {};
    var q    = el.getAttribute('data-q') || ort.label || ADR_FALLBACK;
    var zoom = parseInt(el.getAttribute('data-zoom'), 10) || 16;
    var enc  = encodeURIComponent(q);
    var src   = 'https://www.google.com/maps?q=' + enc + '&z=' + zoom + '&hl=de&output=embed';
    var route = 'https://www.google.com/maps/dir/?api=1&destination=' + enc;

    var ifr = document.createElement('iframe');
    ifr.src = src;
    ifr.title = 'Google Maps · ' + q;
    ifr.loading = 'lazy';
    ifr.referrerPolicy = 'no-referrer-when-downgrade';
    ifr.setAttribute('allowfullscreen', '');
    /* Fallback-Link, falls der Embed blockiert/nicht laedt (offline, Tracking-Blocker) */
    ifr.addEventListener('error', function () {
      el.innerHTML = '<a class="tfcz-map-fallback" href="' + route + '" target="_blank" rel="noopener">Karte öffnen · ' + q + '</a>';
    });
    el.appendChild(ifr);
  }

  function init() {
    [].forEach.call(document.querySelectorAll('[data-tfcz="map"]'), bauen);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
