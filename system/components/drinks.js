/* ============================================================
   TFCZ · BAUSTEIN: Getränke-/Preisliste

   Rendert die Liste aus system/drinks.js — auf jeder Seite gleich.
   Die Seite schreibt nur den Platzhalter:

     <div data-tfcz="drinks"></div>
     <script src="system/drinks.js"></script>
     <script defer src="system/components/drinks.js"></script>

   Optionen am Platzhalter:
     data-snacks="0"        Snacks-Kategorie weglassen (z. B. Firmenevents)
     data-preis="vor Ort"   Text für noch offene Preise (Default aus drinks.js)
     data-spalten="3"       Spalten auf grossen Screens (Default: automatisch)
     data-zahlung="1"       Zahlungs-Hinweis unter der Liste anzeigen

   Kategorie-Icons sind Lucide (nie Emojis).

   PREISE: kommen aus der API (GET {TFCZ_API}/api/drinks), nicht aus dem HTML und
   nicht aus system/drinks.js — die dortige Liste ist nur Struktur/Fallback.
   Sobald window.TFCZ_API gesetzt ist (auch nachträglich), holt der Baustein die
   Live-Liste und rendert neu. Antwortet der Server nicht, bleibt der Platzhalter.
   ============================================================ */
(function () {
  if (window.__tfczDrinks) return;
  window.__tfczDrinks = true;

  /* Lucide-Icons inline (gleiche Pfade wie assets/icons/lucide/<name>.svg) */
  var ICONS = {
    'beer': '<path d="M17 11h1a3 3 0 0 1 0 6h-1"/><path d="M9 12v6"/><path d="M13 12v6"/><path d="M14 7.5c-1 0-1.44.5-3 .5s-2-.5-3-.5-1.72.5-2.5.5a2.5 2.5 0 0 1 0-5c.78 0 1.57.5 2.5.5S9.44 2 11 2s2 1.5 3 1.5 1.72-.5 2.5-.5a2.5 2.5 0 0 1 0 5c-.78 0-1.5-.5-2.5-.5Z"/><path d="M5 8v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V8"/>',
    'cup-soda': '<path d="m6 8 1.75 12.28a2 2 0 0 0 2 1.72h4.54a2 2 0 0 0 2-1.72L18 8"/><path d="M5 8h14"/><path d="M7 15a6.47 6.47 0 0 1 5 0 6.47 6.47 0 0 0 5 0"/><path d="m12 8 1-6h2"/>',
    'coffee': '<path d="M10 2v2"/><path d="M14 2v2"/><path d="M16 8a1 1 0 0 1 1 1v8a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V9a1 1 0 0 1 1-1h14a4 4 0 1 1 0 8h-1"/><path d="M6 2v2"/>',
    'cookie': '<path d="M12 2a10 10 0 1 0 10 10 4 4 0 0 1-5-5 4 4 0 0 1-5-5"/><path d="M8.5 8.5v.01"/><path d="M16 15.5v.01"/><path d="M12 12v.01"/><path d="M11 17v.01"/><path d="M7 14v.01"/>'
  };
  function icon(name) {
    var p = ICONS[name] || ICONS['cup-soda'];
    return '<svg class="tfcz-menu-ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" ' +
           'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + p + '</svg>';
  }

  /* ---------- CSS (eigener Präfix `tfcz-menu`) ---------- */
  if (!document.getElementById('tfcz-drinks-css')) {
    var css = [
      '.tfcz-menu{display:grid; grid-template-columns:repeat(var(--tfcz-menu-cols,3),1fr); gap:14px}',
      '@media(max-width:820px){.tfcz-menu{grid-template-columns:1fr 1fr}}',
      '@media(max-width:520px){.tfcz-menu{grid-template-columns:1fr}}',
      '.tfcz-menu-cat{background:var(--frost, linear-gradient(155deg, rgba(18,36,54,.92), rgba(10,23,36,.88)));',
        'border:1px solid var(--card-brd,rgba(255,255,255,.14)); border-radius:var(--r-lg,16px); padding:20px}',
      '.tfcz-menu-cat h3{display:flex; align-items:center; gap:8px; font-size:15px; font-weight:900; color:var(--gold-lt,#e9c475);',
        'text-transform:uppercase; letter-spacing:.06em; margin:0 0 12px}',
      '.tfcz-menu-ic{width:18px; height:18px; flex:none; color:var(--gold-lt,#e9c475)}',
      '.tfcz-menu-row{display:flex; align-items:baseline; gap:8px; padding:8px 0; font-size:14px;',
        'border-bottom:1px dashed rgba(255,255,255,.10)}',
      '.tfcz-menu-row:last-child{border-bottom:0}',
      '.tfcz-menu-row .n{color:#fff; font-weight:700; min-width:0}',
      '.tfcz-menu-row .dots{flex:1; border-bottom:1px dotted rgba(255,255,255,.22); transform:translateY(-3px)}',
      '.tfcz-menu-row .p{color:var(--gold-lt,#e9c475); font-weight:900; font-size:13px; white-space:nowrap}',
      '.tfcz-menu-row .p.offen{color:var(--ink-mut,#9fb2c4); font-weight:700}',
      '.tfcz-menu-pay{margin-top:14px; font-size:13px; color:var(--ink-mut,#9fb2c4)}'
    ].join('');
    var st = document.createElement('style');
    st.id = 'tfcz-drinks-css';
    st.textContent = css;
    document.head.appendChild(st);
  }

  function preisText(p, offen) {
    if (p === null || p === undefined || p === '') return '<span class="p offen">' + offen + '</span>';
    var n = (typeof p === 'number') ? ('CHF ' + p.toFixed(2).replace('.00', '.–')) : String(p);
    return '<span class="p">' + n + '</span>';
  }

  function render(slot) {
    var D = (window.TFCZ && TFCZ.drinks) || null;
    if (!D) return;

    var mitSnacks = slot.getAttribute('data-snacks') !== '0';
    var offen = slot.getAttribute('data-preis') || D.platzhalter || 'vor Ort';
    var spalten = slot.getAttribute('data-spalten');

    var kats = D.kategorien.filter(function (k) { return mitSnacks || k.id !== 'snacks'; });

    var html = '<div class="tfcz-menu"' + (spalten ? ' style="--tfcz-menu-cols:' + spalten + '"' : '') + '>' +
      kats.map(function (k) {
        return '<div class="tfcz-menu-cat">' +
                 '<h3>' + icon(k.icon) + k.name + '</h3>' +
                 k.artikel.map(function (a) {
                   return '<div class="tfcz-menu-row"><span class="n">' + a.name + '</span>' +
                          '<span class="dots"></span>' + preisText(a.preis, offen) + '</div>';
                 }).join('') +
               '</div>';
      }).join('') +
    '</div>';

    if (slot.getAttribute('data-zahlung') === '1' && D.zahlung) {
      html += '<p class="tfcz-menu-pay">' + D.zahlung + '</p>';
    }

    slot.innerHTML = html;
    if (!spalten) slot.querySelector('.tfcz-menu').style.setProperty('--tfcz-menu-cols', Math.min(kats.length, 3));
  }

  function alle() {
    [].forEach.call(document.querySelectorAll('[data-tfcz="drinks"]'), render);
  }

  /* ---------- Backend ----------
     Die Preise kommen aus der API, nicht aus system/drinks.js.
     GET {TFCZ_API}/api/drinks -> {kategorien:[{id,name,icon,artikel:[{name,preis}]}], zahlung}
     Englische Feldnamen (categories/items/price) werden ebenfalls akzeptiert. */
  function normalisiere(d) {
    var kats = d.kategorien || d.categories;
    if (!kats || !kats.length) return null;
    return {
      kategorien: kats.map(function (k) {
        return {
          id: k.id,
          name: k.name,
          icon: k.icon,
          artikel: (k.artikel || k.items || []).map(function (a) {
            var p = (a.preis !== undefined) ? a.preis : a.price;
            return { name: a.name, preis: (p === undefined ? null : p) };
          })
        };
      }),
      zahlung: d.zahlung || d.payment || null
    };
  }

  function refresh() {
    var A = String(window.TFCZ_API || '').replace(/\/+$/, '');
    if (!A || !window.TFCZ || !TFCZ.drinks) return;
    try {
      fetch(A + '/api/drinks')
        .then(function (r) { return r.ok ? r.json() : null; })
        .then(function (d) {
          var n = d && normalisiere(d);
          if (!n) return;
          TFCZ.drinks.kategorien = n.kategorien;
          if (n.zahlung) TFCZ.drinks.zahlung = n.zahlung;
          alle();
        })
        .catch(function () {});   // Server weg = Fallback-Liste bleibt stehen
    } catch (e) {}
  }

  /* Wird TFCZ_API erst nach dem Laden gesetzt (z. B. durch ein Config-Script),
     holen wir die Liste nach. Kurzes Polling, dann Ruhe. */
  function warteAufApi() {
    if (window.TFCZ_API) { refresh(); return; }
    var n = 0;
    var t = setInterval(function () {
      if (window.TFCZ_API) { clearInterval(t); refresh(); }
      else if (++n > 20) clearInterval(t);   // ~10s, dann aufhören
    }, 500);
  }

  function init() { alle(); warteAufApi(); }

  window.TFCZ = window.TFCZ || {};
  TFCZ.drinksUI = { render: alle, refresh: refresh };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
