/* ============================================================
   TFCZ · BAUSTEIN: Seiten-Sichtbarkeit

   Entscheidet je Seite, ob sie LIVE oder PAUSIERT ist — und welche Fassung
   einer Seite gezeigt wird (z. B. „Training mit Philipp": Anmeldung läuft
   vs. Training läuft). Geschaltet wird im Login-Portal (seiten.html).

   Einbauen — als ERSTES Skript im <head>, blockierend (nicht defer!), damit
   eine pausierte Seite gar nicht erst aufblitzt:

     <script src="system/seiten.js"></script>

   Der Schlüssel einer Seite ist ihr DATEINAME (`tfcz-regeln.html`). Damit
   braucht dieser Baustein keine zweite Seitenliste neben system/content.js —
   die Links im Menü und im Footer tragen denselben Namen.

   Drei Stufen, in dieser Reihenfolge:
     1. STAND  — der beim letzten Veröffentlichen eingebackene Stand (unten).
                 Gilt sofort, ohne Netz, ohne Warten.
     2. Zwischenspeicher — was dieser Browser beim letzten Besuch vom Server
                 geholt hat. Wird synchron gelesen, also ebenfalls ohne Flackern.
     3. Server — okapi (`/api/settings/public/website`). Kommt asynchron nach,
                 aktualisiert Menü und Zwischenspeicher.

   Fällt der Server aus, läuft alles auf Stufe 1/2 weiter. Nichts bricht.
   ============================================================ */
(function () {
  if (window.TFCZ && TFCZ.seiten) return;

  /* ==== STAND-ANFANG · wird beim Veröffentlichen geschrieben (_tools/bake-seiten.mjs) ====
     Von Hand ändern ist erlaubt, aber der nächste Publish überschreibt es mit
     dem Stand aus dem Portal. */
  var STAND = {
    "stand": "2026-09-01",
    "seiten": {
      "mitglied.html": {
        "status": "live"
      },
      "tfcz-training.html": {
        "status": "live",
        "variante": "laufend"
      },
      "tfcz-firmenevents.html": {
        "status": "live"
      },
      "tfcz-ueber-uns.html": {
        "status": "live"
      },
      "tfcz-geschichte.html": {
        "status": "live"
      },
      "tfcz-regeln.html": {
        "status": "live"
      },
      "tfcz-medien.html": {
        "status": "live"
      },
      "galerie.html": {
        "status": "live"
      }
    }
  };
  /* ==== STAND-ENDE ==== */

  /* Welche Seite hat mehrere Fassungen — und wie heissen sie im Portal?
     Steht bewusst HIER und nicht im Stand: die Fassungen gehören zur Seite,
     nicht zum Schaltzustand. Neue Fassung = hier eintragen und im HTML der
     Seite die Blöcke mit  data-var="<id>"  markieren. */
  var VARIANTEN = {
    'tfcz-training.html': [
      { id: 'anmeldung', text: 'Anmeldung läuft',  hilfe: 'Mit Anmeldeformular und Gold-CTA „Platz sichern".' },
      { id: 'laufend',   text: 'Semester läuft',   hilfe: 'Ohne Anmeldung — Hinweis auf das nächste Semester.' }
    ]
  };

  var API   = (window.TFCZ_OKAPI || 'https://tfvzuerich.ch/api').replace(/\/+$/, '');
  var CACHE = 'tfcz_seiten_stand';

  window.TFCZ = window.TFCZ || {};

  /* ---------- Stand ermitteln (synchron, ohne Netz) ---------- */
  var stand = STAND;
  try {
    var roh = localStorage.getItem(CACHE);
    if (roh) {
      var c = JSON.parse(roh);
      if (c && c.seiten) stand = c;
    }
  } catch (e) { /* privater Modus o. ä. — dann gilt der gebackene Stand */ }

  /* ---------- Welche Datei bin ich? ---------- */
  function dateiname(href) {
    if (!href) return '';
    var s = String(href).split('#')[0].split('?')[0];
    s = s.substring(s.lastIndexOf('/') + 1);
    return s || 'index.html';
  }
  var HIER = dateiname(location.pathname);

  function eintrag(datei) { return (stand.seiten && stand.seiten[dateiname(datei)]) || null; }
  function pausiert(datei) { var e = eintrag(datei); return !!e && e.status === 'pausiert'; }
  function variante(datei) { var e = eintrag(datei); return (e && e.variante) || null; }

  /* ---------- Fassung dieser Seite ---------- */
  var wurzel = document.documentElement;
  /* Kennt der Stand keine Fassung (neue Seite, alter Server), gilt die Fassung,
     die die Seite selbst als Standard deklariert: <html data-variante-standard="…">.
     Ohne diesen Rückfall wären auf einer Seite mit zwei Fassungen BEIDE sichtbar. */
  var VAR = variante(HIER) || wurzel.getAttribute('data-variante-standard');
  if (VAR) {
    wurzel.setAttribute('data-variante', VAR);
    /* Reine CSS-Regel: alles, was eine ANDERE Fassung trägt, bleibt aus.
       Der aktiven Fassung wird kein display aufgezwungen — sie behält ihr eigenes. */
    stil('tfcz-variante-css',
      'html[data-variante="' + VAR + '"] [data-var]:not([data-var~="' + VAR + '"]){display:none !important}');
  }

  /* ---------- Pausiert-Zustand ---------- */
  function stil(id, css) {
    var st = document.getElementById(id);
    if (!st) { st = document.createElement('style'); st.id = id; document.head.appendChild(st); }
    st.textContent = css;
    return st;
  }

  var SCHIRM_CSS =
    /* Inhalt aus, Kopfleiste und Hintergrund bleiben — der Besucher kann weiternavigieren */
    'html.tfcz-pausiert body > *:not(nav):not(header):not(footer):not(script):not(style)' +
      ':not(canvas):not(.tfcz-pause):not(.tn-drawer):not(.tn-scrim){display:none !important}' +
    /* Die Sprungmarken der Seite selbst zeigen ins Leere, solange der Inhalt aus ist.
       Der Burger bleibt — über ihn kommt man weiter. */
    'html.tfcz-pausiert .nav .navlinks,html.tfcz-pausiert .nav .lnk{display:none !important}' +
    '.tfcz-pause{max-width:640px; margin:clamp(60px,14vh,140px) auto clamp(80px,16vh,160px);' +
      'padding:38px 30px 34px; text-align:center;' +
      'border-radius:var(--r-xl,22px);' +
      'border:1px solid var(--card-brd,rgba(255,255,255,.14));' +
      'border-top:3px solid var(--blue,#5ca7dc); border-bottom:3px solid var(--gold,#cda857);' +
      'background:linear-gradient(155deg, rgba(17,34,51,.74), rgba(9,21,33,.60));' +
      'backdrop-filter:blur(var(--frost,10px)); -webkit-backdrop-filter:blur(var(--frost,10px));' +
      'font-family:"Nunito Sans",system-ui,-apple-system,sans-serif; color:#fff}' +
    '.tfcz-pause .kicker{display:inline-flex; align-items:center; gap:10px; margin-bottom:14px;' +
      'font-size:11px; font-weight:900; letter-spacing:.18em; text-transform:uppercase;' +
      'color:var(--gold-lt,#e9c475)}' +
    '.tfcz-pause .kicker::before{content:""; width:28px; height:2px; border-radius:2px;' +
      'background:var(--gold,#cda857); flex:none}' +
    '.tfcz-pause h1{margin:0 0 12px; font-size:clamp(28px,4.4vw,40px); font-weight:900; line-height:1.12}' +
    '.tfcz-pause p{margin:0 auto 24px; max-width:46ch; font-size:16px; line-height:1.6;' +
      'color:var(--ink-mut,#c3d2e0)}' +
    '.tfcz-pause .wege{display:flex; flex-wrap:wrap; gap:10px; justify-content:center}';

  var schirmGebaut = false;

  function schirmBauen() {
    if (schirmGebaut || !document.body) return;
    schirmGebaut = true;

    var e = eintrag(HIER) || {};
    var satz = e.hinweis ||
      'Wir überarbeiten diese Seite gerade. Sie ist in Kürze wieder da — schau in der Zwischenzeit auf der Startseite vorbei.';

    var box = document.createElement('div');
    box.className = 'tfcz-pause';
    box.setAttribute('role', 'status');
    box.innerHTML =
      '<span class="kicker">Vorübergehend pausiert</span>' +
      '<h1>Diese Seite ist gerade nicht verfügbar</h1>' +
      '<p></p>' +
      '<div class="wege">' +
        '<a class="btn btn-ghost" href="index.html">Zur Startseite</a>' +
        '<a class="btn btn-text" href="mailto:info@tfcz.ch">Frage an den Verein</a>' +
      '</div>';
    box.querySelector('p').textContent = satz;   /* Text nie als HTML einsetzen */

    /* Direkt hinter die Kopfleiste, sonst an den Anfang des Body */
    var kopf = document.querySelector('nav.nav, header.top, header');
    if (kopf && kopf.parentNode === document.body) kopf.parentNode.insertBefore(box, kopf.nextSibling);
    else document.body.insertBefore(box, document.body.firstChild);
  }

  function schirmWeg() {
    var b = document.querySelector('.tfcz-pause');
    if (b && b.parentNode) b.parentNode.removeChild(b);
    schirmGebaut = false;
  }

  function anwenden() {
    var aus = pausiert(HIER);
    wurzel.classList.toggle('tfcz-pausiert', aus);

    if (aus) {
      stil('tfcz-pause-css', SCHIRM_CSS);
      /* Suchmaschinen sollen eine pausierte Seite nicht anzeigen. Endgültig setzt
         das der Publish-Lauf ins HTML — das hier greift sofort. */
      if (!document.querySelector('meta[name="robots"][data-tfcz-pause]')) {
        var m = document.createElement('meta');
        m.name = 'robots'; m.content = 'noindex,follow';
        m.setAttribute('data-tfcz-pause', '');
        document.head.appendChild(m);
      }
      if (document.body) schirmBauen();
      else document.addEventListener('DOMContentLoaded', schirmBauen);
    } else {
      var m2 = document.querySelector('meta[name="robots"][data-tfcz-pause]');
      if (m2 && m2.parentNode) m2.parentNode.removeChild(m2);
      schirmWeg();
    }
  }

  /* ---------- Links auf pausierte Seiten ausblenden ----------
     Zentral hier statt in nav.js/footer.js: es gibt EINE Regel, und sie greift
     auch für Links, die eine Seite selbst gesetzt hat.

     Betroffen sind
       · Links in der Kopfleiste, im Menü-Drawer und im Footer
       · jedes Element mit  data-seite="datei.html"  (z. B. eine Karte auf der
         Startseite, die auf eine pausierte Seite führt)

     Ausgeblendet wird mit  hidden , nicht gelöscht — kommt die Seite zurück,
     ist der Link ohne Neuladen wieder da. */
  function linkeAufraeumen() {
    var bereiche = document.querySelectorAll('nav, .tn-drawer, .tfcz-footer');
    [].forEach.call(bereiche, function (b) {
      [].forEach.call(b.querySelectorAll('a[href]'), function (a) {
        var ziel = a.getAttribute('href') || '';
        if (ziel.charAt(0) === '#' || /^(https?:|mailto:|tel:)/i.test(ziel)) return;
        var weg = pausiert(ziel);
        if (weg) a.setAttribute('hidden', '');
        else if (a.hasAttribute('hidden')) a.removeAttribute('hidden');
      });
    });

    [].forEach.call(document.querySelectorAll('[data-seite]'), function (el) {
      var weg = pausiert(el.getAttribute('data-seite'));
      if (weg) el.setAttribute('hidden', '');
      else if (el.hasAttribute('hidden')) el.removeAttribute('hidden');
    });

    /* Eine Menü-Gruppe, von der nichts mehr übrig ist, verschwindet mit */
    [].forEach.call(document.querySelectorAll('.tn-group'), function (g) {
      var sub = g.querySelector('.tn-sub');
      if (!sub) return;
      var sichtbar = sub.querySelectorAll('a:not([hidden])').length;
      var kopf = g.querySelector('.tn-row .tn-lnk');
      var kopfZiel = kopf ? (kopf.getAttribute('href') || '') : '';
      var kopfWeg = kopf ? pausiert(kopfZiel) && kopfZiel.charAt(0) !== '#' : false;
      var tog = g.querySelector('.tn-tog');
      if (tog) tog.hidden = !sichtbar;
      if (!sichtbar && kopfWeg) g.setAttribute('hidden', '');
      else if (g.hasAttribute('hidden')) g.removeAttribute('hidden');
    });
  }

  /* `hidden` allein reicht nicht, wenn ein Link per CSS auf display:flex steht */
  stil('tfcz-seiten-hidden-css',
    'nav [hidden],.tn-drawer [hidden],.tfcz-footer [hidden],[data-seite][hidden]{display:none !important}');

  /* ---------- Öffentliche Schnittstelle ---------- */
  var horcher = [];
  TFCZ.seiten = {
    stand:      function () { return stand; },
    status:     function (datei) { return pausiert(datei) ? 'pausiert' : 'live'; },
    pausiert:   pausiert,
    variante:   variante,
    hier:       function () { return HIER; },
    dateiname:  dateiname,
    varianten:  function (datei) { return VARIANTEN[dateiname(datei)] || []; },
    alleSeiten: function () { return Object.keys((stand.seiten) || {}); },
    /* fn wird gerufen, sobald ein neuer Stand vom Server da ist */
    abonnieren: function (fn) { if (typeof fn === 'function') horcher.push(fn); }
  };

  anwenden();

  /* Nav und Footer bauen sich erst bei DOMContentLoaded — darum danach noch einmal */
  function spaeterAufraeumen() { setTimeout(linkeAufraeumen, 0); }
  if (document.readyState === 'loading') addEventListener('DOMContentLoaded', spaeterAufraeumen);
  else spaeterAufraeumen();
  addEventListener('load', linkeAufraeumen);

  /* ---------- Stufe 3: Server nachfragen (asynchron, darf fehlschlagen) ---------- */
  function frischHolen() {
    if (!window.fetch) return;
    var stop = window.AbortController ? new AbortController() : null;
    if (stop) setTimeout(function () { stop.abort(); }, 4000);

    fetch(API + '/settings/public/website', stop ? { signal: stop.signal } : undefined)
      .then(function (r) { return r.ok ? r.json() : null; })
      .then(function (j) {
        var neu = j && j.data && (j.data.website_seiten || j.data);
        if (!neu || !neu.seiten) return;
        if (JSON.stringify(neu) === JSON.stringify(stand)) return;
        stand = neu;
        try { localStorage.setItem(CACHE, JSON.stringify(neu)); } catch (e) {}
        anwenden();
        linkeAufraeumen();
        horcher.forEach(function (fn) { try { fn(neu); } catch (e) {} });
      })
      .catch(function () { /* Server weg — der bekannte Stand bleibt gültig */ });
  }

  if (document.readyState === 'loading') addEventListener('DOMContentLoaded', frischHolen);
  else frischHolen();
})();
