/* ============================================================
   TFCZ · BAUSTEIN: Fun-Barometer

   EIN Barometer für alle Seiten. Vorher gab es zwei: das echte auf der Home und
   einen vereinfachten Nachbau mit Emojis im Brand Guide. Der Nachbau ist abgelöst.

   Einbauen — die Seite schreibt nur den Platzhalter:
     <div data-tfcz="baro"></div>
     <script defer src="system/components/baro.js"></script>

   Was drin ist:
     · Tube („Spass" oben / „Wettkampf" unten), Füllstand je Stufe
     · Auswahlliste der 5 Stufen (Hover = Brand-Rahmen, Auswahl = Gold — nie beides)
     · Beschreibungs-Panel mit Kennwert-Balken (Spass / Wettkampf / Einstiegshürde)
     · Konfetti beim Käsekick (voller Spass)
     · Info-Button öffnet ein Sheet mit dem ausführlichen Text
       (Standard-X: rund, Hover rot, Quetschen · Esc · Klick daneben)

   Icons: Lucide (party-popper / trophy) — NIE Emojis.
   Entfernt (Vasco 14.07.2026): der mitlaufende Marker-Stab mit Knopf an der Tube.

   Die 5 Stufen samt Texten und Kennwerten stehen NUR hier. Nie ein zweites
   Barometer bauen.
   ============================================================ */
(function () {
  if (window.__tfczBaro) return;
  window.__tfczBaro = true;

  /* ---------- Die 5 Stufen (einzige Quelle) ---------- */
  var D = [
    { lvl:'Fun · offen für alle', c:'#5ca7dc', lv:100, n:'Käsekick',
      meta:'Letzter Freitag im Monat · ab 19:00 · CHF 5 (inkl. Walliser Raclette)',
      kurz:'Letzter Freitag im Monat',
      p:'Unser herzlichster Abend mit der <strong>kleinsten Einstiegshürde</strong>: Hier sind wirklich <strong>ALLE</strong> eingeladen — und du kannst ganz <strong>problemlos alleine kommen</strong>, Mitspielende findest du garantiert vor Ort. Gespielt wird der spezielle <strong>Monster-Crazy-DYP mit «Lord-Have-Mercy»-KO</strong>: zuerst Vorrunden, dann die Endphase. Dazu ein <strong>Walliser Raclette inklusive</strong>. Komm einfach vorbei, <strong>ohne Voranmeldung</strong> — das Niveau ist an diesem Abend nebensächlich.',
      b:[['Spass',100],['Wettkampf',15],['Einstiegshürde',5]] },
    { lvl:'Fun · offen für alle', c:'#5ca7dc', lv:82, n:'Offenes Training',
      meta:'Jeden Dienstag ab 19:00 · offen für alle · ohne Voranmeldung',
      kurz:'Jeden Dienstag ab 19:00',
      p:'Ganz einfach: der Club ist offen, <strong>alle können ohne Voranmeldung</strong> vorbeikommen — auch <strong>alleine</strong>. Dienstags versammeln sich <strong>über 20 Mitspielende</strong> und trainieren, mal locker im freien Spiel, mal mit konkreten Spielübungen. Genug Tische für alle — und kein besserer Abend, um sich <strong>bei den Besten Tipps</strong> abzuholen.',
      b:[['Spass',92],['Wettkampf',30],['Einstiegshürde',8]] },
    { lvl:'Fun · etwas ernster', c:'#4489c7', lv:66, n:'Plausch-Turnier',
      meta:'Jeden Mittwoch ab 20:15 · Mittwochs-DYP · CHF 5',
      kurz:'Jeden Mittwoch ab 20:15',
      p:'Das <strong>Mittwochs-DYP</strong> ist wie der Käsekick ein super Einstieg — nur eine Spur ernster, mit etwas <strong>offizielleren Regeln</strong>. <strong>Auch hier kannst du alleine kommen</strong>: der Partner wird <strong>zugelost</strong>. Über die Saison wächst ein <strong>Preistopf von über CHF 5’000</strong>, der am Jahresende an die Teilnehmenden ausbezahlt wird. Ohne Voranmeldung.',
      b:[['Spass',85],['Wettkampf',45],['Einstiegshürde',22]] },
    { lvl:'Wettkampf', c:'#005a94', lv:44, n:'Pro Turniere',
      meta:'STF Regio (STRT) & Zürich Open · SM-Quali · ITSF-Regeln',
      kurz:'STF Regio · Zürich Open · SM-Quali',
      p:'Ab hier zählt es: Resultate fliessen in die <strong>Schweizer STF-Rangliste</strong>. Über die <strong>Pro Turniere</strong> — <strong>STF Regio (STRT)</strong> und das <strong>Zürich Open</strong> — sammelst du Punkte und <strong>qualifizierst dich für die Schweizermeisterschaft</strong>. Das Zürich Open ist unser grosser Heimauftritt: 10 Leonhart-Tische, Preisgeld und YouTube-Stream. Anmeldung & Ranglisten laufen über <a href="https://register.swisstablesoccer.ch/" target="_blank" rel="noopener">Coral</a>.',
      b:[['Spass',70],['Wettkampf',82],['Einstiegshürde',55]] },
    { lvl:'Elite — ITSF', c:'#cda857', lv:9, n:'Elite', elite:true,
      meta:'ITSF · Schweizermeisterschaft, Champions League, Nationalteam & WM',
      kurz:'ITSF · SM · Champions League · WM',
      p:'Die absolute Spitze — alles unter dem Dach der <strong>ITSF</strong>: von der <strong>Schweizermeisterschaft</strong> über <strong>Champions-League-Events und die Nationalmannschaft</strong> bis zu den <strong>Weltmeisterschaften</strong>. Für die <strong>SM qualifizierst du dich über die Pro Turniere</strong> (u. a. Swiss Tablesoccer Series, STS) — dafür brauchst du eine <strong>Lizenz</strong>, die du <strong>günstig über den TFCZ</strong> lösen kannst (rund CHF 50 statt CHF 80). Die ITSF ist der internationale Dachverband des Töggelisports (quasi die «FIFA des Tischfussballs»). Mehr auf <a href="https://www.swisstablesoccer.ch/" target="_blank" rel="noopener">swisstablesoccer.ch</a>.',
      b:[['Spass',62],['Wettkampf',100],['Einstiegshürde',85]] }
  ];

  /* ---------- Lucide-Icons (nie Emojis) ---------- */
  var IC_SPASS = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5.8 11.3 2 22l10.7-3.79"/><path d="M4 3h.01"/><path d="M22 8h.01"/><path d="M15 2h.01"/><path d="M22 20h.01"/><path d="m22 2-2.24.75a2.9 2.9 0 0 0-1.96 3.12c.1.86-.57 1.63-1.45 1.63h-.38c-.86 0-1.6.6-1.76 1.44L14 10"/><path d="m22 13-.82-.33c-.86-.34-1.82.2-1.98 1.11c-.11.7-.72 1.22-1.43 1.22H17"/><path d="m11 2 .33.82c.34.86-.2 1.82-1.11 1.98C9.52 4.9 9 5.52 9 6.23V7"/><path d="M11 13c1.93 1.93 2.83 4.17 2 5-.83.83-3.07-.07-5-2-1.93-1.93-2.83-4.17-2-5 .83-.83 3.07.07 5 2Z"/></svg>';
  var IC_WETT  = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M10 14.66v1.626a2 2 0 0 1-.976 1.696A5 5 0 0 0 7 21.978"/><path d="M14 14.66v1.626a2 2 0 0 0 .976 1.696A5 5 0 0 1 17 21.978"/><path d="M18 9h1.5a1 1 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M6 9a6 6 0 0 0 12 0V3a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1z"/><path d="M6 9H4.5a1 1 0 0 1 0-5H6"/></svg>';
  var IC_INFO  = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="9.2"/><path d="M12 11v5.4"/><circle cx="12" cy="7.5" r=".4" fill="currentColor" stroke="none"/></svg>';
  var IC_X     = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>';

  /* ---------- CSS (eigener Präfix `tb-`) ---------- */
  if (!document.getElementById('tfcz-baro-css')) {
    var css = [
      '.tb-box{background:var(--frost,rgba(18,36,54,.9)); border:1px solid var(--card-brd,rgba(255,255,255,.14));',
        'border-radius:var(--r-xl,22px); box-shadow:var(--e-2,0 12px 34px rgba(0,0,0,.35)); padding:clamp(18px,3vw,32px)}',
      '.tb-wrap{display:grid; grid-template-columns:auto 300px 1fr; gap:clamp(18px,3vw,34px); align-items:stretch}',

      /* Tube */
      '.tb-col{position:relative; display:flex; flex-direction:column; align-items:center; gap:6px}',
      '.tb-cap{font-size:10px; font-weight:900; text-transform:uppercase; letter-spacing:.12em; text-align:center; line-height:1.2; color:rgba(219,232,244,.5)}',
      '.tb-ic{position:absolute; left:50%; transform:translateX(-50%); width:22px; height:22px; z-index:4; opacity:.92; pointer-events:none; color:#fff}',
      '.tb-ic svg{display:block; width:100%; height:100%}',
      '.tb-ic.top{top:12px} .tb-ic.bot{bottom:12px}',
      '.tb-tube{--level:50%; position:relative; width:46px; flex:1; min-height:300px; border-radius:var(--r-pill,999px);',
        'background:linear-gradient(to top, rgba(0,90,148,.9), rgba(0,64,105,.72)); border:1px solid rgba(255,255,255,.14);',
        'overflow:hidden; box-shadow:inset 0 2px 12px rgba(0,0,0,.55)}',
      '.tb-fill{position:absolute; left:0; right:0; bottom:0; height:var(--level); background:linear-gradient(to top,#4a9ad0 0%,#7fc0ea 100%);',
        'transition:height .55s cubic-bezier(.2,.7,.2,1); box-shadow:0 0 26px rgba(127,192,234,.5)}',
      '.tb-fill::after{content:""; position:absolute; inset:0; background:repeating-linear-gradient(180deg,rgba(255,255,255,.12) 0 2px,transparent 2px 20px); opacity:.5}',
      '.tb-tube.full .tb-fill{background:linear-gradient(125deg,#5ca7dc,#7fc0ea,#e9c475,#cda857,#4489c7,#5ca7dc); background-size:320% 320%; animation:tbShift 2.8s ease-in-out infinite}',
      '@keyframes tbShift{0%{background-position:0% 50%}50%{background-position:100% 50%}100%{background-position:0% 50%}}',
      '.tb-tube.full{box-shadow:inset 0 2px 12px rgba(0,0,0,.4),0 0 34px rgba(233,196,117,.55); animation:tbPop .55s ease}',
      '@keyframes tbPop{0%{transform:scale(1)}45%{transform:scale(1.05)}100%{transform:scale(1)}}',
      '.tb-cf{position:absolute; width:8px; height:12px; border-radius:2px; pointer-events:none; z-index:150}',

      /* Auswahlliste */
      '.tb-list{display:flex; flex-direction:column; gap:clamp(10px,1.4vw,15px); justify-content:flex-start}',
      '.tb-lvl{display:flex; align-items:center; gap:12px; text-align:left; font-family:inherit; cursor:pointer; padding:12px 14px;',
        'border-radius:var(--r-md,12px); background:var(--card-soft,rgba(17,34,51,.45)); border:1px solid var(--card-brd,rgba(255,255,255,.14));',
        'color:var(--ink-mut,#9fb2c4); transition:.16s cubic-bezier(.4,0,.2,1); transform-origin:center}',
      '@media(hover:hover){.tb-lvl:hover{transform:translateY(-2px); box-shadow:var(--e-1,0 6px 18px rgba(0,0,0,.28))}}',
      '.tb-lvl .sw{width:14px; height:14px; border-radius:50%; flex:none; background:var(--c,#5ca7dc)}',
      '.tb-lvl .bn{flex:1; min-width:0; font-weight:900; color:#fff; font-size:14.5px; line-height:1.2}',
      '.tb-lvl .bn small{display:block; font-weight:700; font-size:11.5px; color:var(--ink-mut,#9fb2c4)}',
      /* Auswahl = Gold */
      '.tb-lvl.on{border-color:var(--gold,#cda857); outline:1.5px solid var(--gold,#cda857); background:var(--card,rgba(17,34,51,.6))}',
      /* Hover = Brand-Rahmen, NUR via inset box-shadow (kein Layout-Sprung), nie zusammen mit Gold */
      '.tb-lvl.pre{box-shadow:inset 0 2px 0 var(--blue,#5ca7dc), inset 0 -2px 0 var(--gold,#cda857)}',
      '.tb-lvl.pre.on{border-color:var(--card-brd,rgba(255,255,255,.14)); outline:none; background:var(--card-soft,rgba(17,34,51,.45))}',
      '.tb-list:has(.tb-lvl.pre) .tb-lvl.on:not(.pre){border-color:var(--card-brd,rgba(255,255,255,.14)); outline:none; background:var(--card-soft,rgba(17,34,51,.45))}',

      /* Panel */
      '.tb-panel{position:relative; --acc:#5ca7dc; background:linear-gradient(155deg, rgba(0,90,148,.28), rgba(9,21,33,.55));',
        'border:1px solid var(--card-brd,rgba(255,255,255,.14)); border-left:4px solid var(--acc); border-radius:var(--r-lg,16px);',
        'padding:clamp(18px,2.6vw,28px); display:flex; flex-direction:column; justify-content:center}',
      '.tb-panel.pop{animation:tbBox .34s cubic-bezier(.4,0,.2,1)}',
      '@keyframes tbBox{0%{transform:scale(.984)}45%{transform:scale(1.014)}100%{transform:scale(1)}}',
      '.tb-panel .lb2{font-size:11.5px; font-weight:900; letter-spacing:.16em; text-transform:uppercase; color:var(--gold-lt,#e9c475); padding-right:42px}',
      '.tb-panel h3{font-size:clamp(22px,2.6vw,30px); font-weight:900; color:#fff; text-transform:uppercase; margin:6px 0 2px; padding-right:42px}',
      '.tb-panel .meta{font-size:13px; font-weight:700; color:var(--ink-mut,#9fb2c4); margin-bottom:10px}',
      '.tb-dbar{display:flex; align-items:center; gap:12px; font-size:10.5px; font-weight:900; text-transform:uppercase; letter-spacing:.06em; color:var(--ink-mut,#9fb2c4); margin-bottom:8px}',
      '.tb-dbar .lbl{flex:none; width:118px}',
      '.tb-dbar .tr{flex:1; height:7px; border-radius:5px; background:rgba(8,18,29,.7); border:1px solid rgba(255,255,255,.08); overflow:hidden}',
      '.tb-dbar .fl{height:100%; border-radius:5px; width:0; transition:width .8s cubic-bezier(.4,0,.2,1)}',

      /* Info-Button */
      '.tb-info{position:absolute; top:14px; right:14px; z-index:5; width:32px; height:32px; border-radius:50%; display:flex; align-items:center; justify-content:center;',
        'background:rgba(92,167,220,.16); border:1px solid rgba(92,167,220,.42); color:var(--ink-mut,#9fb2c4); cursor:pointer;',
        'transition:.16s cubic-bezier(.4,0,.2,1); animation:tbPulse 2.4s cubic-bezier(.4,0,.2,1) infinite}',
      '@media(hover:hover){.tb-info:hover{background:var(--blue-mid,#4489c7); color:#fff; transform:translateY(-1px); animation:none}}',
      '@keyframes tbPulse{0%{box-shadow:0 0 0 0 rgba(92,167,220,.5)}70%{box-shadow:0 0 0 9px rgba(92,167,220,0)}100%{box-shadow:0 0 0 0 rgba(92,167,220,0)}}',
      '.tb-info svg{width:17px; height:17px}',
      '.tb-info::after{content:""; position:absolute; inset:-14px; border-radius:50%}',

      /* Info-Sheet */
      '.tb-sheet{position:fixed; inset:0; z-index:210; display:none}',
      '.tb-sheet.on{display:block}',
      '.tb-sheet .bd{position:absolute; inset:0; background:rgba(4,10,17,.72); backdrop-filter:blur(4px)}',
      '.tb-sheet .card{position:absolute; left:50%; top:50%; transform:translate(-50%,-50%); width:min(620px,92vw); max-height:82vh; overflow-y:auto; overflow-x:hidden;',
        'background:linear-gradient(155deg, rgba(10,26,40,.97), rgba(7,18,30,.96)); border:1px solid var(--card-brd,rgba(255,255,255,.14));',
        'border-top:3px solid var(--blue,#5ca7dc); border-bottom:3px solid var(--gold,#cda857); border-radius:var(--r-lg,16px);',
        'padding:22px; box-shadow:var(--e-3,0 24px 60px rgba(0,0,0,.5)); animation:tbBox .3s cubic-bezier(.4,0,.2,1)}',
      '.tb-sheet .hd{display:flex; align-items:center; justify-content:space-between; gap:12px; margin-bottom:12px}',
      '.tb-sheet .hd h4{margin:0; font-size:18px; font-weight:900; color:#fff; text-transform:uppercase}',
      '.tb-sheet .hd em{font-style:normal; font-weight:700; font-size:12px; color:var(--gold-lt,#e9c475)}',
      '.tb-sheet p{margin:0; color:#fff; font-size:15px; line-height:1.6}',
      '.tb-sheet p strong{font-weight:900}',
      '.tb-sheet p a{color:var(--gold-lt,#e9c475); font-weight:900}',
      '.tb-x{flex:none; width:36px; height:36px; border-radius:50%; background:rgba(255,255,255,.08); border:1px solid var(--card-brd,rgba(255,255,255,.14));',
        'color:#fff; cursor:pointer; display:grid; place-items:center; transition:.16s cubic-bezier(.4,0,.2,1)}',
      '.tb-x svg{width:16px; height:16px}',
      '.tb-x:hover{background:var(--red,#da2929); border-color:var(--red,#da2929); animation:tbSquish .42s}',
      '.tb-x:active{transform:scale(.9)}',
      '@keyframes tbSquish{0%{transform:scale(1,1)}35%{transform:scale(1.22,.78)}70%{transform:scale(.92,1.08)}100%{transform:scale(1,1)}}',

      '@media(max-width:980px){.tb-wrap{grid-template-columns:auto 1fr} .tb-panel{grid-column:1 / -1}}',
      '@media(max-width:640px){.tb-dbar{gap:10px; font-size:9px; margin-bottom:6px} .tb-dbar .lbl{width:88px} .tb-lvl .bn{font-size:13.5px}}',
      '@media(max-width:560px){.tb-wrap{grid-template-columns:1fr}',
      '  .tb-col{flex-direction:row; flex-wrap:wrap; align-items:center; row-gap:8px; width:100%}',
      '  .tb-col .tb-cap{flex:1 1 0%; min-width:0}',
      '  .tb-col .tb-cap:first-of-type{order:2; text-align:right}',
      '  .tb-col .tb-cap:last-of-type{order:1; text-align:left}',
      '  .tb-tube{order:3; flex:1 1 100%; width:100%; min-height:0; height:40px}',
      '  .tb-fill{left:0; right:auto; top:0; bottom:0; height:auto; width:var(--level);',
      '    background:linear-gradient(90deg,#4a9ad0,#7fc0ea); transition:width .55s cubic-bezier(.2,.7,.2,1)}',
      '  .tb-ic.top{top:50%; bottom:auto; left:auto; right:9px; transform:translateY(-50%)}',
      '  .tb-ic.bot{top:50%; bottom:auto; left:9px; right:auto; transform:translateY(-50%)}}',
      '@media(prefers-reduced-motion:reduce){.tb-info,.tb-tube.full,.tb-tube.full .tb-fill{animation:none}}'
    ].join('');
    var st = document.createElement('style');
    st.id = 'tfcz-baro-css';
    st.textContent = css;
    document.head.appendChild(st);
  }

  /* ---------- Info-Sheet (einmal am Body) ---------- */
  var sheet;
  function sheetBauen() {
    if (sheet) return sheet;
    sheet = document.createElement('div');
    sheet.className = 'tb-sheet';
    sheet.innerHTML = '<div class="bd"></div><div class="card">' +
      '<div class="hd"><h4></h4><button class="tb-x" aria-label="Schliessen">' + IC_X + '</button></div><p></p></div>';
    document.body.appendChild(sheet);
    function zu() {
      if (!sheet.classList.contains('on')) return;
      var box = sheet.querySelector('.card');
      var weg = function () { sheet.classList.remove('on'); };
      if (window.TFCZ && TFCZ.portal) TFCZ.portal.close(box, weg);
      else weg();
    }
    sheet.querySelector('.bd').addEventListener('click', zu);
    sheet.querySelector('.tb-x').addEventListener('click', zu);
    addEventListener('keydown', function (e) { if (e.key === 'Escape') zu(); });
    return sheet;
  }
  function infoOeffnen(d) {
    var s = sheetBauen();
    s.querySelector('h4').innerHTML = d.n + ' <em>· ' + d.lvl + '</em>';
    s.querySelector('p').innerHTML = d.p;
    s.classList.add('on');
  }

  /* ---------- Ein Barometer aufbauen ---------- */
  function bauen(slot) {
    if (slot.__tb) return;
    slot.__tb = true;

    slot.innerHTML =
      '<div class="tb-box"><div class="tb-wrap">' +
        '<div class="tb-col">' +
          '<div class="tb-cap">Spass</div>' +
          '<div class="tb-tube">' +
            '<span class="tb-ic top">' + IC_SPASS + '</span>' +
            '<div class="tb-fill"></div>' +
            '<span class="tb-ic bot">' + IC_WETT + '</span>' +
          '</div>' +
          '<div class="tb-cap">Wettkampf</div>' +
        '</div>' +
        '<div class="tb-list">' +
          D.map(function (d, i) {
            return '<button class="tb-lvl' + (i === 0 ? ' on' : '') + '" data-i="' + i + '" style="--c:' + (d.elite ? '#cda857' : d.c) + '">' +
                     '<span class="sw"></span><span class="bn">' + d.n + '<small>' + d.kurz + '</small></span>' +
                   '</button>';
          }).join('') +
        '</div>' +
        '<div class="tb-panel"></div>' +
      '</div></div>';

    var tube = slot.querySelector('.tb-tube');
    var col = slot.querySelector('.tb-col');
    var list = slot.querySelector('.tb-list');
    var panel = slot.querySelector('.tb-panel');
    var btns = [].slice.call(slot.querySelectorAll('.tb-lvl'));
    var selIdx = 0, lastCf = 0;

    function setLevel(v) { tube.style.setProperty('--level', v + '%'); }

    /* Konfetti aus der Tube (nur beim Käsekick = voller Spass) */
    function konfetti() {
      if (matchMedia('(prefers-reduced-motion:reduce)').matches) return;
      var now = Date.now();
      if (now - lastCf < 900) return;
      lastCf = now;
      var cols = ['#5ca7dc','#7fc0ea','#cda857','#e9c475','#4489c7','#ffffff','#67b57d'];
      for (var i = 0; i < 48; i++) {
        (function (i) {
          var p = document.createElement('span');
          p.className = 'tb-cf';
          p.style.background = cols[i % cols.length];
          p.style.left = (50 + (Math.random() * 120 - 60)) + '%';
          p.style.top = (Math.random() * 100) + '%';
          p.style.width = (6 + Math.random() * 6) + 'px';
          p.style.height = (9 + Math.random() * 9) + 'px';
          col.appendChild(p);
          var ang = Math.random() * Math.PI * 2, spd = 45 + Math.random() * 130,
              dx = Math.cos(ang) * spd * (0.7 + Math.random()),
              dy = Math.sin(ang) * spd * 0.55 + 210 + Math.random() * 280,
              rot = Math.random() * 1000 - 500;
          if (!p.animate) { setTimeout(function () { p.remove(); }, 100); return; }
          var an = p.animate([
            { transform:'translate(0,0) rotate(0deg)', opacity:1, offset:0 },
            { opacity:1, offset:.72 },
            { transform:'translate(' + dx + 'px,' + dy + 'px) rotate(' + rot + 'deg)', opacity:0, offset:1 }
          ], { duration: 2600 + Math.random() * 1800, easing:'cubic-bezier(.15,.6,.3,1)' });
          an.onfinish = function () { p.remove(); };
        })(i);
      }
    }

    function panelFuellen(d) {
      panel.style.setProperty('--acc', d.c);
      panel.innerHTML =
        '<button class="tb-info" aria-label="Mehr Infos" title="Mehr Infos">' + IC_INFO + '</button>' +
        '<div class="lb2">' + d.lvl + '</div><h3>' + d.n + '</h3><div class="meta">' + d.meta + '</div>' +
        d.b.map(function (x) {
          return '<div class="tb-dbar"><span class="lbl">' + x[0] + '</span><div class="tr"><div class="fl" style="background:' + d.c + '"></div></div></div>';
        }).join('');
      requestAnimationFrame(function () {
        [].forEach.call(panel.querySelectorAll('.fl'), function (f, k) { f.style.width = d.b[k][1] + '%'; });
      });
    }

    function vorschau(i, ohneKonfetti) {
      var d = D[i];
      setLevel(d.lv);
      tube.classList.toggle('full', i === 0);
      panelFuellen(d);
      if (i === 0 && !ohneKonfetti) konfetti();
    }
    function waehlen(i, ohneKonfetti) {
      selIdx = i;
      vorschau(i, ohneKonfetti);
      btns.forEach(function (b) { b.classList.toggle('on', +b.dataset.i === i); b.classList.remove('pre'); });
      panel.classList.remove('pop'); void panel.offsetWidth; panel.classList.add('pop');
    }

    var kannHover = matchMedia('(hover:hover)').matches;
    btns.forEach(function (b) {
      var i = +b.dataset.i;
      b.addEventListener('click', function () { lastCf = 0; waehlen(i); });
      if (kannHover) b.addEventListener('mouseenter', function () {
        vorschau(i);
        btns.forEach(function (x) { x.classList.remove('pre'); });
        if (i !== selIdx) b.classList.add('pre');
      });
    });
    if (kannHover) list.addEventListener('mouseleave', function () {
      btns.forEach(function (x) { x.classList.remove('pre'); });
      vorschau(selIdx, true);
    });

    panel.addEventListener('click', function (e) {
      if (e.target.closest('.tb-info')) infoOeffnen(D[selIdx < 0 ? 0 : selIdx]);
    });

    /* Genie-Lupe auf der Liste */
    if (kannHover) {
      var raf = false, gy = null;
      function genie() {
        if (gy == null) { btns.forEach(function (b) { b.style.transform = ''; }); return; }
        var unit = btns[0].getBoundingClientRect().height || 44;
        btns.forEach(function (row) {
          var rr = row.getBoundingClientRect();
          var dd = Math.abs((rr.top + rr.height / 2) - gy) / unit;
          var f = Math.exp(-dd * dd / 0.6);
          row.style.transform = 'scale(' + (0.93 + 0.14 * f).toFixed(3) + ')';
        });
      }
      list.addEventListener('mousemove', function (e) {
        gy = e.clientY;
        if (raf) return;
        raf = true;
        requestAnimationFrame(function () { raf = false; genie(); });
      });
      list.addEventListener('mouseleave', function () { gy = null; btns.forEach(function (b) { b.style.transform = ''; }); });
    }

    /* Panel bekommt eine feste Höhe = grösster Inhalt; Liste bündig zur Tube */
    function fitPanel() {
      var keep = selIdx < 0 ? 0 : selIdx;
      panel.style.minHeight = '';
      var max = 0;
      D.forEach(function (d) { panelFuellen(d); if (panel.offsetHeight > max) max = panel.offsetHeight; });
      panelFuellen(D[keep]);
      panel.style.minHeight = max + 'px';
    }
    function syncTube() {
      list.style.marginTop = '';
      if (matchMedia('(min-width:561px)').matches) {
        var wrap = list.parentNode;
        var tr = tube.getBoundingClientRect(), wr = wrap.getBoundingClientRect();
        var off = tr.top - wr.top;
        if (off > 0) list.style.marginTop = off + 'px';
      }
    }
    var tick = false;
    addEventListener('resize', function () {
      if (tick) return;
      tick = true;
      requestAnimationFrame(function () { tick = false; fitPanel(); syncTube(); });
    });
    addEventListener('load', function () { fitPanel(); syncTube(); });

    waehlen(0, true); fitPanel(); syncTube();
  }

  function init() {
    [].forEach.call(document.querySelectorAll('[data-tfcz="baro"]'), bauen);
  }

  window.TFCZ = window.TFCZ || {};
  TFCZ.baro = { stufen: D, init: init };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
