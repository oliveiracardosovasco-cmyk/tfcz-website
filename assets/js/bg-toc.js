/* ============================================================
   TFCZ · Brand Guide — aufklappbares Inhaltsverzeichnis

   Nur für den Brand Guide (brandguide.html): die Seite ist lang, das
   Menü im Kopf reicht nicht mehr.

   Was es macht:
     · liest ALLE Sektionen (<section class="cl" id="…"> mit Nummer + Titel)
       automatisch aus dem DOM — neue Sektionen erscheinen von selbst
     · gruppiert sie thematisch (Gruppen unten in GRUPPEN)
     · Gruppen sind Akkordeons: echte <button> mit aria-expanded, Standard offen
     · Klick springt sanft zur Sektion (Stopp unter der sticky Nav)
     · Scroll-Spy: die Sektion, in der man gerade ist, wird gold markiert
     · Desktop: Panel links, offen ab 1400px · Mobile/schmal: Drawer mit Scrim,
       schliesst beim Klick auf einen Eintrag, Esc schliesst
   ============================================================ */
(function () {
  if (window.__tfczToc) return;
  window.__tfczToc = true;

  /* Reihenfolge der Gruppen = Reihenfolge im Panel.
     Eine Sektion, die hier nirgends steht, landet automatisch in „Weiteres". */
  var GRUPPEN = [
    { titel: 'Grundlagen', ids: ['nutzung','positionierung','werte','persoenlichkeit','versprechen','zielgruppen','tone','botschaften','sprache','fakten','playbook'] },
    { titel: 'Farben, Logo & Typo', kurz: 'Farben & Typo', ids: ['farben','logos','typo','tokens'] },
    { titel: 'Komponenten', ids: ['buttons','burger-standard','menu-cascade','logo-standard','signatur','cards','formulare','controls','iconlib','auswahl','hoverregel','badges','pakete','barometer','kalender','navelemente','feedback','daten'] },
    { titel: 'Bausteine & Effekte', kurz: 'Bausteine', ids: ['bildplayer','getraenke','portal','formbaustein','navbaustein','tokendatei','hintergrund','unlocks','easteregg','bausteine','overlay'] },
    { titel: 'Seiten & Auslieferung', kurz: 'Ausliefern', ids: ['geruest','print','starter','checkliste','version'] }
  ];

  /* ---------- CSS ---------- */
  var css = [
    ':root{--toc-w:330px}',

    /* Öffnen-Knopf (immer sichtbar, links unter der Nav) */
    '.toc-btn{position:fixed; left:14px; top:calc(var(--tfcz-navh,64px) + 14px); z-index:95;',
      'display:inline-flex; align-items:center; gap:8px; padding:9px 13px; border-radius:10px; cursor:pointer;',
      'background:linear-gradient(155deg, rgba(10,24,38,.94), rgba(6,15,24,.92)); backdrop-filter:blur(10px);',
      'border:1px solid var(--card-brd); color:#fff; font:900 12.5px/1 "Nunito Sans",system-ui,sans-serif;',
      'letter-spacing:.04em; text-transform:uppercase; box-shadow:var(--e-2); transition:.16s var(--ease)}',
    '.toc-btn:hover{border-color:transparent; box-shadow:inset 0 2px 0 var(--blue), inset 0 -2px 0 var(--gold), var(--e-2)}',
    '.toc-btn:active{transform:scale(.94)}',
    '.toc-btn .bl{display:block; width:16px; height:2.2px; border-radius:3px; margin:2px 0}',
    '.toc-btn .bars{display:inline-grid}',
    '.toc-btn .bl.a{background:var(--blue)} .toc-btn .bl.b{background:#fff} .toc-btn .bl.c{background:var(--gold)}',
    '.toc-open .toc-btn{opacity:0; pointer-events:none}',

    /* Panel */
    '.toc{position:fixed; left:0; top:var(--tfcz-navh,64px); z-index:96; width:var(--toc-w);',
      'height:calc(100vh - var(--tfcz-navh,64px)); display:flex; flex-direction:column;',
      'background:linear-gradient(155deg, rgba(10,24,38,.96), rgba(6,15,24,.94)); backdrop-filter:blur(14px);',
      'border-top:3px solid var(--blue); border-bottom:3px solid var(--gold);',
      'border-right:1px solid var(--card-brd); box-shadow:var(--e-2);',
      'transform:translateX(-100%); transition:transform .34s var(--ease); overflow:hidden}',
    '.toc-open .toc{transform:none}',
    /* Das Panel LIEGT ÜBER dem Inhalt — die Seite wird NIE verschoben. */

    /* Kapitel-Menü im Kopf: die Hauptkapitel (= Gruppen des Inhaltsverzeichnisses).
       Bei wenig Platz horizontal scrollbar, ohne Scrollbalken-Optik. */
    '.toc-kap{display:flex; align-items:center; gap:2px; margin-left:18px; min-width:0;',
      'overflow-x:auto; scrollbar-width:none; -ms-overflow-style:none}',
    '.toc-kap::-webkit-scrollbar{display:none}',

    '.toc-head{display:flex; align-items:center; justify-content:space-between; gap:10px; padding:14px 14px 10px; flex:none}',
    '.toc-head h4{margin:0; font-size:12px; font-weight:900; letter-spacing:.18em; text-transform:uppercase; color:var(--gold)}',
    /* Standard-X (rund, Hover rot, Quetschen) */
    '.toc-x{width:32px; height:32px; border-radius:50%; display:grid; place-items:center; cursor:pointer;',
      'background:rgba(255,255,255,.08); border:1px solid var(--card-brd); color:#fff; transition:.16s var(--ease)}',
    '.toc-x svg{width:15px; height:15px}',
    '.toc-x:hover{background:var(--red); border-color:var(--red); animation:xsquish .42s}',
    '.toc-x:active{transform:scale(.9)}',

    '.toc-body{flex:1; min-height:0; overflow-y:auto; overflow-x:hidden; padding:0 10px 18px; scrollbar-width:thin;',
      '  overscroll-behavior:contain}',   /* am Ende der Liste NICHT die Seite weiterscrollen */
    '.toc-body::-webkit-scrollbar{width:6px} .toc-body::-webkit-scrollbar-thumb{background:rgba(255,255,255,.14); border-radius:3px}',

    /* Gruppe = Akkordeon */
    '.toc-g{margin-bottom:4px}',
    '.toc-gh{width:100%; display:flex; align-items:center; gap:8px; padding:9px 10px; cursor:pointer; text-align:left;',
      'background:none; border:1px solid transparent; border-radius:8px; color:#fff;',
      'font:900 11.5px/1.3 "Nunito Sans",system-ui,sans-serif; letter-spacing:.1em; text-transform:uppercase; transition:.16s var(--ease)}',
    '.toc-gh:hover{box-shadow:inset 0 2px 0 var(--blue), inset 0 -2px 0 var(--gold)}',
    '.toc-gh .chev{margin-left:auto; width:14px; height:14px; flex:none; transition:transform .22s var(--ease); color:var(--gold)}',
    '.toc-gh[aria-expanded="false"] .chev{transform:rotate(-90deg)}',
    '.toc-list{overflow:hidden; max-height:1400px; transition:max-height .32s var(--ease)}',
    '.toc-gh[aria-expanded="false"] + .toc-list{max-height:0}',

    '.toc-list a{display:flex; gap:8px; align-items:baseline; padding:7px 10px 7px 12px; border-radius:8px;',
      'color:var(--ink-mut); font-size:13px; font-weight:700; text-decoration:none; line-height:1.35;',
      'border-left:2px solid transparent; transition:.16s var(--ease)}',
    '.toc-list a .no{flex:none; min-width:22px; font-size:10.5px; font-weight:900; color:rgba(255,255,255,.42)}',
    '.toc-list a:hover{color:#fff; box-shadow:inset 0 2px 0 var(--blue), inset 0 -2px 0 var(--gold)}',
    /* aktive Sektion = Gold (Auswahl), nie zusammen mit dem Hover-Rahmen */
    '.toc-list a.cur{color:var(--gold-lt); border-left-color:var(--gold)}',
    '.toc-list a.cur .no{color:var(--gold)}',
    '.toc-list a.cur:hover{box-shadow:none}',

    /* Scrim (nur schmal) */
    '.toc-scrim{position:fixed; inset:0; z-index:95; background:rgba(4,10,17,.6); backdrop-filter:blur(2px);',
      'opacity:0; pointer-events:none; transition:opacity .3s var(--ease)}',
    '@media(max-width:1399px){.toc-open .toc-scrim{opacity:1; pointer-events:auto}}',

    /* Nach oben — die Seite ist lang, der Weg zurück muss immer da sein */
    '.toc-top{position:fixed; right:22px; bottom:22px; z-index:97; width:46px; height:46px; border-radius:50%;',
      'display:grid; place-items:center; cursor:pointer; color:#fff;',
      'background:linear-gradient(155deg, rgba(10,24,38,.94), rgba(6,15,24,.92)); backdrop-filter:blur(10px);',
      'border:1px solid var(--card-brd); box-shadow:var(--e-2);',
      'opacity:0; pointer-events:none; transform:translateY(10px);',
      'transition:opacity .25s var(--ease), transform .25s var(--ease)}',
    '.toc-top.on{opacity:1; pointer-events:auto; transform:none}',
    '.toc-top svg{width:20px; height:20px; display:block}',
    '.toc-top:hover{border-color:transparent; box-shadow:inset 0 2px 0 var(--blue), inset 0 -2px 0 var(--gold), var(--e-2)}',
    '.toc-top:active{transform:scale(.92)}',
    '@media(max-width:560px){:root{--toc-w:min(88vw,330px)}}',
    '@media(prefers-reduced-motion:reduce){.toc,.toc-list,.toc-gh .chev{transition:none}}'
  ].join('');
  var st = document.createElement('style');
  st.textContent = css;
  document.head.appendChild(st);

  var CHEV = '<svg class="chev" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg>';

  function navH() {
    var n = document.querySelector('.nav');
    var h = n ? Math.round(n.getBoundingClientRect().height) : 64;
    document.documentElement.style.setProperty('--tfcz-navh', h + 'px');
    return h;
  }

  function init() {
    /* Sektionen einsammeln */
    var secs = [].slice.call(document.querySelectorAll('section.cl[id]')).map(function (s) {
      var h2 = s.querySelector('.sec-h h2');
      var num = s.querySelector('.sec-h .num');
      return { id: s.id, el: s, titel: h2 ? h2.textContent.trim() : s.id, num: num ? num.textContent.trim() : '' };
    }).filter(function (s) { return s.titel; });
    if (!secs.length) return;

    var byId = {};
    secs.forEach(function (s) { byId[s.id] = s; });

    /* Gruppen füllen (Reste kommen nach „Weiteres") */
    var benutzt = {};
    var reihenfolge = {};
    secs.forEach(function (s, i) { reihenfolge[s.id] = i; });

    var gruppen = GRUPPEN.map(function (g) {
      var items = g.ids.map(function (id) { benutzt[id] = 1; return byId[id]; }).filter(Boolean);
      /* innerhalb der Gruppe immer in der Reihenfolge, in der die Sektionen
         auf der Seite stehen — sonst springt man beim Klicken wild hin und her */
      items.sort(function (a, b) { return reihenfolge[a.id] - reihenfolge[b.id]; });
      return { titel: g.titel, kurz: g.kurz || g.titel, items: items };
    }).filter(function (g) { return g.items.length; });

    var rest = secs.filter(function (s) { return !benutzt[s.id]; });
    if (rest.length) gruppen.push({ titel: 'Weiteres', items: rest });

    /* Markup */
    var btn = document.createElement('button');
    btn.className = 'toc-btn';
    btn.setAttribute('aria-controls', 'tocPanel');
    btn.setAttribute('aria-expanded', 'false');
    btn.innerHTML = '<span class="bars"><span class="bl a"></span><span class="bl b"></span><span class="bl c"></span></span>Inhalt';

    var scrim = document.createElement('div');
    scrim.className = 'toc-scrim';

    var panel = document.createElement('aside');
    panel.className = 'toc';
    panel.id = 'tocPanel';
    panel.setAttribute('aria-label', 'Inhaltsverzeichnis');
    panel.innerHTML =
      '<div class="toc-head"><h4>Inhalt</h4>' +
        '<button class="toc-x" aria-label="Inhaltsverzeichnis schliessen"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg></button>' +
      '</div>' +
      '<div class="toc-body">' +
        gruppen.map(function (g, gi) {
          return '<div class="toc-g">' +
            '<button class="toc-gh" aria-expanded="true" aria-controls="tocg' + gi + '">' + g.titel + CHEV + '</button>' +
            '<div class="toc-list" id="tocg' + gi + '">' +
              g.items.map(function (s) {
                return '<a href="#' + s.id + '" data-sec="' + s.id + '"><span class="no">' + s.num + '</span><span>' + s.titel + '</span></a>';
              }).join('') +
            '</div>' +
          '</div>';
        }).join('') +
      '</div>';

    /* Nach oben (Lucide arrow-up) */
    var top = document.createElement('button');
    top.className = 'toc-top';
    top.setAttribute('aria-label', 'Nach oben');
    top.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 19V5M5 12l7-7 7 7"/></svg>';
    top.addEventListener('click', function () {
      var sanft = !matchMedia('(prefers-reduced-motion:reduce)').matches;
      scrollTo({ top: 0, behavior: sanft ? 'smooth' : 'auto' });
    });
    addEventListener('scroll', function () {
      top.classList.toggle('on', scrollY > 400);
    }, { passive: true });

    /* ---- Kapitel-Menü in den Kopf (Hauptkapitel) ---- */
    var nav = document.querySelector('nav.nav');
    if (nav) {
      var kap = document.createElement('div');
      kap.className = 'toc-kap';
      kap.innerHTML = gruppen.map(function (g) {
        var erste = g.items[0];
        return '<a class="lnk" href="#' + erste.id + '" data-kap="' + erste.id + '">' + g.kurz + '</a>';
      }).join('');
      /* direkt nach dem Logo einhängen (wie auf den Unterseiten) */
      var logo = nav.querySelector('.logo');
      if (logo && logo.nextSibling) nav.insertBefore(kap, logo.nextSibling);
      else nav.appendChild(kap);

      kap.addEventListener('click', function (e) {
        var a = e.target.closest('a[data-kap]');
        if (!a) return;
        e.preventDefault();
        var s = byId[a.getAttribute('data-kap')];
        if (!s) return;
        var y = s.el.getBoundingClientRect().top + scrollY - navH() - 12;
        var sanft = !matchMedia('(prefers-reduced-motion:reduce)').matches;
        scrollTo({ top: y, behavior: sanft ? 'smooth' : 'auto' });
      });
    }

    document.body.appendChild(scrim);
    document.body.appendChild(panel);
    document.body.appendChild(btn);
    document.body.appendChild(top);

    navH();
    addEventListener('resize', navH);

    /* Öffnen / Schliessen */
    function offen() { return document.body.classList.contains('toc-open'); }
    function auf() { document.body.classList.add('toc-open'); btn.setAttribute('aria-expanded', 'true'); }
    function zu() {
      if (!offen()) return;
      var weg = function () {
        document.body.classList.remove('toc-open');
        btn.setAttribute('aria-expanded', 'false');
      };
      if (window.TFCZ && TFCZ.portal) TFCZ.portal.close(panel, weg);
      else weg();
    }
    btn.addEventListener('click', auf);
    panel.querySelector('.toc-x').addEventListener('click', zu);
    scrim.addEventListener('click', zu);
    addEventListener('keydown', function (e) { if (e.key === 'Escape' && offen()) zu(); });

    /* Standard: offen auf breiten Screens, zu auf schmalen */
    var breit = matchMedia('(min-width:1400px)');
    if (breit.matches) auf();
    if (breit.addEventListener) breit.addEventListener('change', function (e) { e.matches ? auf() : zu(); });

    /* Gruppen-Akkordeon */
    [].forEach.call(panel.querySelectorAll('.toc-gh'), function (h) {
      h.addEventListener('click', function () {
        h.setAttribute('aria-expanded', h.getAttribute('aria-expanded') === 'true' ? 'false' : 'true');
      });
    });

    /* Sanft springen — Stopp unter der sticky Nav */
    var links = [].slice.call(panel.querySelectorAll('.toc-list a'));
    links.forEach(function (a) {
      a.addEventListener('click', function (e) {
        var s = byId[a.getAttribute('data-sec')];
        if (!s) return;
        e.preventDefault();
        var y = s.el.getBoundingClientRect().top + scrollY - navH() - 12;
        var sanft = !matchMedia('(prefers-reduced-motion:reduce)').matches;
        scrollTo({ top: y, behavior: sanft ? 'smooth' : 'auto' });
        history.replaceState(null, '', '#' + s.id);
        if (!breit.matches) zu();
      });
    });

    /* Scroll-Spy */
    /* Merkt sich, ob der Nutzer gerade IM Panel scrollt (dann kein Auto-Scroll) */
    var selbstScrollt = false, sst;
    panel.querySelector('.toc-body').addEventListener('scroll', function () {
      selbstScrollt = true;
      clearTimeout(sst);
      sst = setTimeout(function () { selbstScrollt = false; }, 1200);
    }, { passive: true });

    function markiere(id) {
      links.forEach(function (a) {
        var cur = a.getAttribute('data-sec') === id;
        a.classList.toggle('cur', cur);
        if (cur) {
          var grp = a.closest('.toc-g').querySelector('.toc-gh');
          if (grp.getAttribute('aria-expanded') === 'false') grp.setAttribute('aria-expanded', 'true');

          /* Die Liste zieht den aktiven Eintrag NUR dann nach, wenn der Nutzer
             gerade nicht selbst im Panel scrollt — sonst kämpfen Auto-Scroll und
             Handbewegung gegeneinander (das war das „Zappeln"). */
          if (!selbstScrollt) {
            var b = panel.querySelector('.toc-body');
            var ar = a.getBoundingClientRect(), br = b.getBoundingClientRect();
            if (ar.top < br.top + 8 || ar.bottom > br.bottom - 8) {
              b.scrollTop += (ar.top - br.top) - br.height / 2 + ar.height / 2;
            }
          }
        }
      });
    }
    if ('IntersectionObserver' in window) {
      var sichtbar = {};
      var io = new IntersectionObserver(function (eintraege) {
        eintraege.forEach(function (e) { sichtbar[e.target.id] = e.isIntersecting ? e.intersectionRatio : 0; });
        var best = null, wert = 0;
        secs.forEach(function (s) { if ((sichtbar[s.id] || 0) > wert) { wert = sichtbar[s.id]; best = s.id; } });
        if (best) markiere(best);
      }, { rootMargin: '-20% 0px -60% 0px', threshold: [0, .15, .4, .75, 1] });
      secs.forEach(function (s) { io.observe(s.el); });
    }
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
