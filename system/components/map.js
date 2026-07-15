/* ============================================================
   TFCZ · BAUSTEIN: Karte

   Eine Karte für alle Seiten. Vorher hatte die Home einen Google-Embed und
   Firmenevents einen OpenStreetMap-Embed — zwei verschiedene Karten, beide hell.

   Einbauen — die Seite schreibt nur den Platzhalter:
     <div data-tfcz="map"></div>
     <script src="system/content.js"></script>
     <script defer src="system/components/map.js"></script>

   Die Koordinate kommt aus system/content.js (TFCZ.content.ort) — EINE Quelle.
   Ziehst du den Verein um, änderst du genau eine Zeile.

   Eigenschaften:
     · Dark-Mode (Leaflet + CARTO Dark-Tiles, kein API-Key, keine Kosten)
     · Brand-Pin: Gold auf Navy mit blauem Ring
     · „Route öffnen" als Fallback, falls die Karte nicht lädt (offline/blockiert)
     · eigener Klassen-Präfix `.tfcz-map` → kollidiert nicht mit Seiten-CSS

   Optional pro Platzhalter:
     data-zoom="15"   Zoomstufe (Default 15)
     data-lat / data-lng  überschreibt die Registry-Koordinate (Sonderfall)
   ============================================================ */
(function () {
  if (window.__tfczMap) return;
  window.__tfczMap = true;

  var LEAFLET_CSS = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css';
  var LEAFLET_JS  = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.js';

  /* ---------- CSS (eigener Präfix) ---------- */
  if (!document.getElementById('tfcz-map-css')) {
    var css =
      '.tfcz-map{position:relative; width:100%; height:100%; min-height:240px; background:#0d273d}' +
      '.tfcz-map .leaflet-container{background:#0d273d; font-family:inherit}' +
      /* Brand-Pin: Gold, Navy-Rand, blauer Ring */
      '.tfcz-pin span{display:block; width:16px; height:16px; border-radius:50%;' +
        'background:#cda857; border:2px solid #0d273d; box-shadow:0 0 0 3px rgba(92,167,220,.55)}' +
      /* dunkle Bedienelemente */
      '.tfcz-map .leaflet-bar a{background:#0d273d; color:#eef4fa; border-color:rgba(255,255,255,.18)}' +
      '.tfcz-map .leaflet-bar a:hover{background:#12263a}' +
      '.tfcz-map .leaflet-popup-content-wrapper,.tfcz-map .leaflet-popup-tip{background:#0d273d; color:#eef4fa}' +
      '.tfcz-map .leaflet-control-attribution{background:rgba(13,39,61,.7); color:#9fb2c4}' +
      '.tfcz-map .leaflet-control-attribution a{color:#5ca7dc}' +
      /* Fallback, wenn Leaflet nicht lädt */
      '.tfcz-map-fallback{display:flex; align-items:center; justify-content:center; height:100%;' +
        'min-height:240px; padding:20px; text-align:center; color:#cda857; font-weight:800;' +
        'text-decoration:none}';
    var st = document.createElement('style');
    st.id = 'tfcz-map-css';
    st.textContent = css;
    document.head.appendChild(st);
  }

  function ladeCSS() {
    if (document.getElementById('tfcz-leaflet-css')) return;
    var l = document.createElement('link');
    l.id = 'tfcz-leaflet-css'; l.rel = 'stylesheet'; l.href = LEAFLET_CSS;
    document.head.appendChild(l);
  }
  function ladeJS(fertig) {
    if (window.L) return fertig();
    var vorhanden = document.getElementById('tfcz-leaflet-js');
    if (vorhanden) { vorhanden.addEventListener('load', fertig); vorhanden.addEventListener('error', fertig); return; }
    var s = document.createElement('script');
    s.id = 'tfcz-leaflet-js'; s.src = LEAFLET_JS;
    s.onload = fertig; s.onerror = fertig;
    document.head.appendChild(s);
  }

  function bauen(el) {
    if (el.__tfczMap) return;
    el.__tfczMap = true;
    el.classList.add('tfcz-map');

    var ort = (window.TFCZ && TFCZ.content && TFCZ.content.ort) || {};
    var lat  = parseFloat(el.getAttribute('data-lat'))  || ort.lat  || 47.3969;
    var lng  = parseFloat(el.getAttribute('data-lng'))  || ort.lng  || 8.5312;
    var zoom = parseInt(el.getAttribute('data-zoom'), 10) || 15;
    var label = ort.label || '';
    var route = 'https://www.google.com/maps/dir/?api=1&destination=' + lat + ',' + lng;

    function fallback() {
      el.innerHTML = '<a class="tfcz-map-fallback" href="' + route + '" target="_blank" rel="noopener">' +
                     'Karte öffnen · ' + label + '</a>';
    }

    ladeCSS();
    ladeJS(function () {
      if (!window.L) { fallback(); return; }
      try {
        var map = L.map(el, { scrollWheelZoom: false, attributionControl: true }).setView([lat, lng], zoom);
        L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
          maxZoom: 19, subdomains: 'abcd',
          attribution: '&copy; OpenStreetMap &copy; CARTO'
        }).addTo(map);
        var icon = L.divIcon({
          className: 'tfcz-pin', html: '<span></span>',
          iconSize: [20, 20], iconAnchor: [10, 10], popupAnchor: [0, -8]
        });
        L.marker([lat, lng], { icon: icon }).addTo(map).bindPopup(label);
        /* Grösse nach dem Layout korrigieren (Karte sitzt oft in einem Flex-Container) */
        setTimeout(function () { try { map.invalidateSize(); } catch (e) {} }, 60);
      } catch (e) {
        fallback();
      }
    });
  }

  function init() {
    [].forEach.call(document.querySelectorAll('[data-tfcz="map"]'), bauen);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
