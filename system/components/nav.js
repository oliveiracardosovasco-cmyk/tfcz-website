/* ============================================================
   TFCZ · BAUSTEIN: Navigation (Burger · Drawer · Hover-Strich)

   EIN Nav-Verhalten für ALLE Seiten. Vorher hatte nur die Home einen Burger und
   ein Menü — die sieben Unterseiten hatten nur einen Zurück-Knopf. Das war der
   Fehler „nur Home".

   Einbauen — die Seite braucht nur ihre bestehende `<nav class="nav">`:

     <script src="system/content.js"></script>
     <script defer src="system/components/portal.js"></script>
     <script defer src="system/components/nav.js"></script>

   Was der Baustein macht:
     · hängt den Burger („Scroll-Loop", blau/weiss/gold, wird NIE zum X) als
       ÄUSSERSTES Element rechts in die Nav — der Zurück-Knopf steht dadurch
       automatisch LINKS vom Burger
     · baut Scrim + Drawer aus TFCZ.content.menu (eine Menü-Struktur für alle Seiten)
     · Drawer klappt als AKKORDEON nach unten auf (kein Slide von rechts), hängt
       unter der goldenen Linie der Nav, rechtsbündig, volle Resthöhe
     · Einträge fallen gestaffelt herein (Drop-Cascade)
     · Schliessen (X, Esc, Scrim, Link) läuft IMMER über den Portal-Baustein
     · Hover-Strich folgt der Menü-Ausrichtung:
         Links (Unterseiten, Nav-Links neben dem Logo) -> BLAUER Strich OBERHALB
         Rechts (Home, Links nach rechts geschoben)    -> GOLDENER Strich UNTERHALB

   Anker (`#woche`) werden auf Unterseiten automatisch zu `index.html#woche`.
   ============================================================ */
(function () {
  if (window.__tfczNav) return;
  window.__tfczNav = true;

  var CHEV = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 9l6 6 6-6"/></svg>';
  var IC_X = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>';
  var IC_LOGIN = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M10 17l5-5-5-5M15 12H3M14 3h5a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-5"/></svg>';
  var IC_REG = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM19 8v6M22 11h-6"/></svg>';

  var istHome = /(^|\/)(index\.html)?(\?|#|$)/.test(location.pathname.split('/').pop() + location.search);

  /* Anker auf Unterseiten absolut machen */
  function ziel(href) {
    if (!href) return '#';
    if (href.charAt(0) !== '#') return href;
    return istHome ? href : 'index.html' + href;
  }

  /* ---------- CSS (eigener Präfix `tn-`, plus Hover-Strich auf .nav .lnk) ---------- */
  if (!document.getElementById('tfcz-nav-css')) {
    var css = [
      /* Burger — Scroll-Loop, wird nie zum X */
      '.tn-burger{display:inline-grid; place-items:center; padding:9px 10px; border-radius:8px; flex:none;',
        'background:rgba(255,255,255,.08); border:1px solid rgba(255,255,255,.28); cursor:pointer; margin-left:10px}',
      '.tn-burger .bl{display:block; width:22px; height:2.6px; border-radius:3px; margin:2.2px 0}',
      '.tn-burger .bl.a{background:var(--blue,#5ca7dc)} .tn-burger .bl.b{background:#fff} .tn-burger .bl.c{background:var(--gold,#cda857)}',
      '@keyframes tnBurger{0%{transform:translateY(0);opacity:1}35%{transform:translateY(11px);opacity:0}',
        '36%{transform:translateY(-11px);opacity:0}100%{transform:translateY(0);opacity:1}}',
      '.tn-burger:hover .bl.a,.tn-burger.anim .bl.a{animation:tnBurger .6s cubic-bezier(.34,1.56,.64,1)}',
      '.tn-burger:hover .bl.b,.tn-burger.anim .bl.b{animation:tnBurger .6s cubic-bezier(.34,1.56,.64,1) .1s both}',
      '.tn-burger:hover .bl.c,.tn-burger.anim .bl.c{animation:tnBurger .6s cubic-bezier(.34,1.56,.64,1) .2s both}',

      /* Scrim */
      '.tn-scrim{position:fixed; inset:0; z-index:104; background:rgba(4,10,17,.6); backdrop-filter:blur(2px);',
        'opacity:0; pointer-events:none; transition:opacity .3s cubic-bezier(.4,0,.2,1)}',
      '.tn-scrim.on{opacity:1; pointer-events:auto}',

      /* Drawer — Akkordeon nach unten, unter der Goldlinie, volle Resthöhe.
         Rechte Kante bündig mit dem Seiteninhalt (.wrap, 1160px + 22px Padding):
         auf breiten Screens sitzt er am Inhalts-Anschlag, auf schmalen am Fensterrand. */
      '.tn-drawer{position:fixed; top:var(--tfcz-navh,64px); z-index:105;',
        'right:var(--tfcz-drawer-right,0px);',      /* exakt gemessen: rechte Kante des Seiteninhalts */
        'width:min(92vw,460px);',
        'height:calc(100vh - var(--tfcz-navh,64px)); max-height:0; overflow:hidden;',
        'background:linear-gradient(160deg, rgba(13,39,61,.98), rgba(8,24,38,.97));',
        'border-left:1px solid var(--card-brd,rgba(255,255,255,.14));',
        'border-bottom:3px solid var(--gold,#cda857);',
        'box-shadow:-24px 0 60px rgba(0,0,0,.5);',
        'transition:max-height .42s cubic-bezier(.4,0,.2,1)}',
      /* Zugeklappt darf NICHTS sichtbar sein: max-height:0 blendet den Inhalt aus,
         aber Rand und Schatten bleiben sonst stehen — das war der goldene Balken
         unter der Menüleiste (Vasco 14.07.2026). */
      '.tn-drawer:not(.open){border-width:0; box-shadow:none}',
      '.tn-drawer.open{max-height:calc(100vh - var(--tfcz-navh,64px)); overflow-y:auto;',
        'border-left:1px solid var(--card-brd,rgba(255,255,255,.14));',
        'border-bottom:3px solid var(--gold,#cda857);',
        'box-shadow:-24px 0 60px rgba(0,0,0,.5)}',
      '.tn-inner{padding:16px 16px 22px; display:flex; flex-direction:column}',

      '.tn-head{display:flex; align-items:center; justify-content:space-between; margin-bottom:10px; padding-left:14px}',
      '.tn-head .t{display:inline-flex; align-items:center; gap:10px; font-size:11px; font-weight:900;',
        'letter-spacing:.18em; text-transform:uppercase; color:var(--gold-lt,#e9c475)}',
      '.tn-head .t::before{content:""; width:22px; height:2px; background:var(--gold,#cda857); border-radius:2px; flex:none}',
      /* Standard-X */
      '.tn-x{position:relative; flex:none; width:36px; height:36px; border-radius:50%; display:grid; place-items:center; cursor:pointer;',
        'background:rgba(255,255,255,.08); border:1px solid var(--card-brd,rgba(255,255,255,.14)); color:#fff; transition:.16s ease}',
      '.tn-x svg{width:17px; height:17px; display:block; flex:none}',
      '.tn-x::after{content:""; position:absolute; inset:-8px; border-radius:50%}',   /* Trefferfläche */
      '.tn-x:hover{background:var(--red,#da2929); border-color:var(--red,#da2929); animation:tnSquish .42s}',
      '.tn-x:active{transform:scale(.9)}',
      '@keyframes tnSquish{0%{transform:scale(1,1)}35%{transform:scale(1.22,.78)}70%{transform:scale(.92,1.08)}100%{transform:scale(1,1)}}',

      /* Einträge */
      '.tn-lnk{display:block; padding:11px 14px; border-radius:10px; color:#fff; font-weight:900; font-size:15px;',
        'text-decoration:none; transition:.16s ease}',
      '.tn-lnk:hover{background:rgba(255,255,255,.07); box-shadow:inset 0 2px 0 var(--blue,#5ca7dc), inset 0 -2px 0 var(--gold,#cda857)}',
      '.tn-lnk.sub{font-size:13.5px; font-weight:700; color:var(--ink-mut,#9fb2c4); padding-left:26px}',
      '.tn-row{display:flex; align-items:center; gap:4px}',
      '.tn-row .tn-lnk{flex:1; min-width:0}',
      '.tn-tog{flex:none; width:34px; height:34px; border-radius:8px; display:grid; place-items:center; cursor:pointer;',
        'background:none; border:0; color:var(--gold,#cda857); transition:.16s ease}',
      '.tn-tog svg{width:16px; height:16px; display:block; transition:transform .22s ease}',
      '.tn-tog[aria-expanded="false"] svg{transform:rotate(-90deg)}',
      '.tn-sub{overflow:hidden; max-height:300px; transition:max-height .3s ease}',
      '.tn-tog[aria-expanded="false"] + .tn-sub{max-height:0}',
      '.tn-sep{height:1px; background:rgba(255,255,255,.12); margin:12px 4px}',

      /* Login / Registrieren / Gold-CTA */
      '.tn-auth{display:flex; gap:8px; margin-bottom:8px}',
      '.tn-auth a{flex:1; display:inline-flex; align-items:center; justify-content:center; gap:7px; padding:10px;',
        'border-radius:10px; font-weight:900; font-size:13px; text-decoration:none; transition:.16s ease}',
      '.tn-auth a svg{width:15px; height:15px; flex:none}',
      '.tn-login{background:rgba(255,255,255,.07); color:#fff; border:1.5px solid rgba(255,255,255,.28)}',   /* Ghost */
      '.tn-login:hover{background:rgba(255,255,255,.13)}',
      '.tn-reg{background:var(--blue-mid,#4489c7); color:#fff}',                                             /* Blau */
      '.tn-reg:hover{filter:brightness(1.08)}',
      '.tn-cta{display:block; text-align:center; margin-top:6px; padding:13px; border-radius:11px;',
        'background:var(--gold,#cda857); color:var(--navy,#0d273d); font-weight:900; text-decoration:none; transition:.16s ease}', /* Gold = Conversion */
      '.tn-cta:hover{background:var(--gold-lt,#e9c475)}',

      /* Drop-Cascade */
      '@keyframes tnDrop{from{opacity:0; transform:translateY(-16px)}to{opacity:1; transform:none}}',
      '.tn-inner > *{opacity:0}',
      '.tn-drawer.open .tn-inner > *{animation:tnDrop .5s cubic-bezier(.34,1.56,.64,1) both}',
      '.tn-drawer.open .tn-inner > *:nth-child(1){animation-delay:.03s}',
      '.tn-drawer.open .tn-inner > *:nth-child(2){animation-delay:.07s}',
      '.tn-drawer.open .tn-inner > *:nth-child(3){animation-delay:.11s}',
      '.tn-drawer.open .tn-inner > *:nth-child(4){animation-delay:.15s}',
      '.tn-drawer.open .tn-inner > *:nth-child(5){animation-delay:.19s}',
      '.tn-drawer.open .tn-inner > *:nth-child(6){animation-delay:.23s}',
      '.tn-drawer.open .tn-inner > *:nth-child(7){animation-delay:.27s}',
      '.tn-drawer.open .tn-inner > *:nth-child(8){animation-delay:.31s}',
      '.tn-drawer.open .tn-inner > *:nth-child(n+9){animation-delay:.35s}',

      /* ---- Nav-Links: EIN Verhalten für die Home, EIN Verhalten für alle Unterseiten ----
         HOVER  = leichte hellblaue Fläche (kein Strich!)
         STRICH = nur die Sektion, in der man sich gerade BEFINDET (Scroll-Spy).
                  Es ist immer genau EIN Strich sichtbar — nie zwei.
         Ausrichtung: Menü links (Unterseiten) -> blauer Strich OBEN
                      Menü rechts (Home)       -> goldener Strich UNTEN */
      '.tn-links .lnk,.tn-rechts .lnk{position:relative; text-decoration:none; font-size:13.5px; font-weight:700;',
        'padding:8px 12px; border-radius:8px; white-space:nowrap;',
        'transition:color .18s ease, background .18s ease}',
      '.tn-links .lnk:hover,.tn-rechts .lnk:hover{color:#fff; background:rgba(92,167,220,.16)}',

      '.tn-links .lnk::after,.tn-rechts .lnk::after{content:""; position:absolute; left:11px; right:11px; height:2px;',
        'border-radius:2px; transform:scaleX(0); transition:transform .26s cubic-bezier(.4,0,.2,1)}',
      /* der Strich sitzt INNERHALB des Links, direkt am Wort — nicht an der Leistenkante */
      '.tn-links .lnk::after{top:3px; background:var(--blue,#5ca7dc); transform-origin:left}',
      '.tn-rechts .lnk::after{bottom:3px; background:var(--gold,#cda857); transform-origin:right}',
      /* Strich NUR beim aktiven Eintrag (Scroll-Spy) — nicht beim Hover */
      '.tn-links .lnk.tn-cur::after,.tn-rechts .lnk.tn-cur::after{transform:scaleX(1)}',

      '@media(prefers-reduced-motion:reduce){.tn-drawer,.tn-sub,.tn-inner > *{transition:none; animation:none; opacity:1}}'
    ].join('');
    var st = document.createElement('style');
    st.id = 'tfcz-nav-css';
    st.textContent = css;
    document.head.appendChild(st);
  }

  function navHoehe(nav) {
    /* gleiche Stapel-Ebene auf allen Seiten (war 50/60/90/95) */
    nav.style.zIndex = '90';
    var h = Math.round(nav.getBoundingClientRect().height);
    document.documentElement.style.setProperty('--tfcz-navh', h + 'px');
    return h;
  }

  /* Rechte Kante des SEITENINHALTS messen — dort endet der Drawer (Vasco 14.07.2026).
     Nicht aus max-width rechnen, sondern die tatsächliche Kante nehmen: das trifft
     auch dann, wenn eine Seite eine abweichende Inhaltsbreite hat. Auf schmalen
     Screens (Inhalt füllt das Fenster) bleibt der Drawer am Fensterrand. */
  function kanteMessen() {
    /* die inhaltliche .wrap nehmen — nicht die im Kopf */
    var kandidaten = [].slice.call(document.querySelectorAll('main .wrap, .wrap'));
    var w = null;
    for (var i = 0; i < kandidaten.length; i++) {
      if (!kandidaten[i].closest('nav, header, .nav, .top')) { w = kandidaten[i]; break; }
    }
    var rechts = 0;
    if (w) {
      var r = w.getBoundingClientRect();
      var pad = parseFloat(getComputedStyle(w).paddingRight) || 0;
      /* Kante des sichtbaren Inhalts = rechter Rand der Box minus deren Innenabstand */
      rechts = Math.max(0, Math.round(document.documentElement.clientWidth - (r.right - pad)));
    }
    document.documentElement.style.setProperty('--tfcz-drawer-right', rechts + 'px');
  }

  function eintragHTML(e, i) {
    if (e.kinder && e.kinder.length) {
      return '<div class="tn-group">' +
               '<div class="tn-row">' +
                 '<a class="tn-lnk" href="' + ziel(e.href) + '">' + e.text + '</a>' +
                 '<button class="tn-tog" type="button" aria-expanded="true" aria-label="Unterseiten">' + CHEV + '</button>' +
               '</div>' +
               '<div class="tn-sub">' +
                 e.kinder.map(function (k) {
                   return '<a class="tn-lnk sub" href="' + ziel(k.href) + '">' + k.text + '</a>';
                 }).join('') +
               '</div>' +
             '</div>';
    }
    return '<a class="tn-lnk" href="' + ziel(e.href) + '">' + e.text + '</a>';
  }

  function init() {
    /* Die Seiten haben zwei Kopf-Strukturen (historisch gewachsen):
         a) <nav class="nav"> … </nav>                      (Home, Regeln, Geschichte, Über uns, Brand Guide)
         b) <header class="top"><div class="wrap"> … </div> (Mitglied, Training, Firmenevents, Medien)
       Der Baustein nimmt in beiden Fällen die Leiste, die das Logo enthält. */
    var nav = document.querySelector('nav.nav') ||
              document.querySelector('.top .wrap') ||
              document.querySelector('header .wrap');
    if (!nav || !nav.querySelector('.logo')) return;

    /* Die sticky Leiste selbst (für die Höhe) kann der Eltern-Container sein */
    var leiste = nav.closest('header, nav') || nav;

    var C = (window.TFCZ && TFCZ.content) || {};
    var menu = C.menu || [];

    /* ---- Ausrichtung erkennen: hat die Seite einen Zurück-Knopf, ist sie eine
       Unterseite (Nav-Links linksbündig neben dem Logo) ---- */
    var unterseite = !!nav.querySelector('.back') || !istHome;
    nav.classList.add(unterseite ? 'tn-links' : 'tn-rechts');

    /* ---- Burger: immer als ÄUSSERSTES Element rechts ----
       Dadurch steht ein vorhandener Zurück-Knopf automatisch links davon. */
    var burger = nav.querySelector('.burger, .tn-burger');
    if (!burger) {
      burger = document.createElement('button');
      burger.className = 'tn-burger';
      burger.setAttribute('aria-label', 'Menü öffnen');
      burger.setAttribute('aria-expanded', 'false');
      burger.innerHTML = '<span class="bl a"></span><span class="bl b"></span><span class="bl c"></span>';
    } else {
      burger.classList.add('tn-burger');
    }
    nav.appendChild(burger);   /* ans Ende — immer ganz rechts */

    /* ---- Scrim + Drawer ---- */
    var scrim = document.createElement('div');
    scrim.className = 'tn-scrim';

    var drawer = document.createElement('aside');
    drawer.className = 'tn-drawer';
    drawer.setAttribute('aria-hidden', 'true');
    drawer.setAttribute('aria-label', 'Menü');

    var seiten = C.seiten || {};
    var mitgliedZiel = (seiten.mitglied && seiten.mitglied.href) || 'mitglied.html';
    var loginZiel = (seiten.login && seiten.login.href) || 'login.html';

    drawer.innerHTML =
      '<div class="tn-inner">' +
        '<div class="tn-head"><span class="t">Menü</span>' +
          '<button class="tn-x" aria-label="Menü schliessen">' + IC_X + '</button>' +
        '</div>' +
        menu.map(eintragHTML).join('') +
        '<div class="tn-sep"></div>' +
        '<div class="tn-auth">' +
          '<a class="tn-login" href="' + loginZiel + '">' + IC_LOGIN + 'Login</a>' +
          '<a class="tn-reg" href="' + mitgliedZiel + '">' + IC_REG + 'Registrieren</a>' +
        '</div>' +
        '<a class="tn-cta" data-cta="mitglied-werden" href="' + mitgliedZiel + '">Mitglied werden</a>' +
      '</div>';

    document.body.appendChild(scrim);
    document.body.appendChild(drawer);

    navHoehe(leiste); kanteMessen();
    addEventListener('resize', function () { navHoehe(leiste); kanteMessen(); });

    /* ---- Öffnen / Schliessen ---- */
    function auf() {
      navHoehe(leiste); kanteMessen();
      drawer.classList.add('open');
      scrim.classList.add('on');
      burger.setAttribute('aria-expanded', 'true');
      drawer.setAttribute('aria-hidden', 'false');
    }
    function zu() {
      if (!drawer.classList.contains('open')) return;
      var weg = function () {
        drawer.classList.remove('open');
        scrim.classList.remove('on');
        burger.setAttribute('aria-expanded', 'false');
        drawer.setAttribute('aria-hidden', 'true');
      };
      /* Schliessen IMMER über den Portal-Baustein */
      if (window.TFCZ && TFCZ.portal) TFCZ.portal.close(drawer, weg);
      else weg();
    }

    burger.addEventListener('click', function () {
      burger.classList.remove('anim'); void burger.offsetWidth; burger.classList.add('anim');   /* Touch: kein Hover */
      drawer.classList.contains('open') ? zu() : auf();
    });
    drawer.querySelector('.tn-x').addEventListener('click', zu);
    scrim.addEventListener('click', zu);
    addEventListener('keydown', function (e) { if (e.key === 'Escape') zu(); });

    /* ---- Scroll-Spy: der Strich markiert die Sektion, in der man gerade IST ----
       Regel (bewusst simpel und deterministisch):
         aktiv = die LETZTE Sektion, deren Oberkante bereits unter der Menüleiste
                 durchgelaufen ist.
       Ist noch keine durch (man ist oben im Hero), gibt es KEINEN Strich.
       Dadurch kann nie ein Strich beim Laden stehen — und nie zwei gleichzeitig.
       (Ein Sichtbarkeits-Fenster war hier falsch: auf Seiten mit kurzem Hero ragt
        die erste Sektion schon beim Laden hinein und der Strich erschien sofort.) */
    var links = [].slice.call(nav.querySelectorAll('.lnk'));
    var ziele = [];
    links.forEach(function (a) {
      var h = a.getAttribute('href') || '';
      var i = h.indexOf('#');
      a.classList.remove('active');            /* alte statische Marker */
      if (i < 0) return;
      /* nur Anker auf DIESER Seite (nicht index.html#… von einer Unterseite) */
      var vorAnker = h.slice(0, i);
      if (vorAnker && vorAnker.indexOf('.html') >= 0) return;
      var sec = document.getElementById(h.slice(i + 1));
      if (sec) ziele.push({ a: a, sec: sec });
    });

    var cur = null;
    function spy() {
      var grenze = (parseInt(getComputedStyle(document.documentElement).getPropertyValue('--tfcz-navh'), 10) || 64) + 8;
      var treffer = null;
      ziele.forEach(function (z) {
        var top = z.sec.getBoundingClientRect().top;
        if (top <= grenze) treffer = z.a;      /* Oberkante ist durch -> Kandidat */
      });
      if (treffer === cur) return;
      cur = treffer;
      links.forEach(function (x) { x.classList.toggle('tn-cur', x === cur); });
    }

    if (ziele.length) {
      var tick = false;
      addEventListener('scroll', function () {
        if (tick) return;
        tick = true;
        requestAnimationFrame(function () { tick = false; spy(); });
      }, { passive: true });
      addEventListener('resize', spy);
      spy();   /* Startzustand: oben im Hero -> kein Strich */
    }

    /* Untergruppen auf-/zuklappen · Klick auf einen Link schliesst den Drawer */
    drawer.addEventListener('click', function (e) {
      var tog = e.target.closest('.tn-tog');
      if (tog) {
        e.preventDefault();
        tog.setAttribute('aria-expanded', tog.getAttribute('aria-expanded') === 'true' ? 'false' : 'true');
        return;
      }
      if (e.target.closest('a')) zu();
    });
  }

  window.TFCZ = window.TFCZ || {};
  TFCZ.nav = { init: init };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
