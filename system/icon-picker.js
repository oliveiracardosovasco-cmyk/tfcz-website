/* ============================================================
   TFCZ · ICON-BIBLIOTHEK
   ------------------------------------------------------------
   Ein Wähler über alle Lucide-Icons: suchen, nach Kategorie
   filtern, anklicken. Eigenständiger Baustein — er weiss nichts
   über Schilder oder Flyer und lässt sich überall anbinden:

       TFCZ.iconWahl.oeffnen({
         wert: 'cigarette-off',            // aktuell gewähltes Icon
         onWahl: function(name){ … }       // wird beim Klick gerufen
       });

   Einbinden:
       <link rel="stylesheet" href="system/icon-picker.css">
       <script src="system/icon-picker.js"></script>

   Quellen (beide liegen schon im Web-Ordner):
       assets/icons/lucide/<name>.svg   — die Icons
       assets/icons/lucide-index.json   — name, tags, use, category

   Die SVGs werden erst geladen, wenn eine Kachel ins Bild kommt.
   1750 Dateien auf einmal wäre sonst weder schnell noch nötig.
   ============================================================ */
(function(){
  var TFCZ = window.TFCZ = window.TFCZ || {};

  var QUELLE = 'assets/icons/lucide/';
  var INDEX  = 'assets/icons/lucide-index.json';

  /* Die Lucide-Stichworte sind englisch, gesucht wird auf Deutsch.
     Dieselbe Brücke wie in der Schilder-Section — hier ist sie
     zentral, damit sie überall gilt. */
  var DE = {
    rauch:'smoking', rauchen:'smoking', zigarette:'cigarette',
    park:'parking', parkplatz:'parking', auto:'car', velo:'bike', fahrrad:'bike',
    wc:'toilet', toilette:'toilet', klo:'toilet',
    pfeil:'arrow', richtung:'arrow', weg:'arrow',
    essen:'food', speise:'utensils', trinken:'drink', bier:'beer', kaffee:'coffee',
    leise:'volume', laut:'volume', ruhe:'volume', musik:'music',
    tuer:'door', 'tür':'door', eingang:'door', ausgang:'exit',
    uhr:'clock', zeit:'clock', kalender:'calendar', datum:'calendar',
    foto:'camera', kamera:'camera', video:'video', handy:'phone', telefon:'phone',
    feuer:'fire', warnung:'warning', achtung:'alert', gefahr:'alert',
    verbot:'ban', gesperrt:'lock', schloss:'lock', schluessel:'key', 'schlüssel':'key',
    info:'info', hinweis:'info', frage:'help',
    pokal:'trophy', sieger:'trophy', spiel:'game', tisch:'table',
    wlan:'wifi', strom:'power', licht:'light',
    abfall:'trash', muell:'trash', 'müll':'trash', putzen:'clean',
    garderobe:'shirt', kleidung:'shirt', tasche:'bag',
    geld:'money', bezahlen:'credit-card', kasse:'wallet',
    person:'user', leute:'users', gruppe:'users', kind:'baby', hund:'dog',
    haus:'home', ort:'map-pin', karte:'map', herz:'heart', stern:'star',
    treppe:'stairs', lift:'elevator', dusche:'shower', wasser:'droplet',
    ball:'ball', fussball:'football', sport:'trophy', tor:'goal'
  };

  /* Der Lucide-Index bringt keine Kategorien mit — nur Name, Tags und
     eine Verwendungsnotiz. Statt leerer Chips stehen hier Gruppen, die
     zum Vereinsalltag passen. Eine Gruppe trifft, wenn eines ihrer
     Stichworte im Namen oder in den Tags vorkommt. */
  var GRUPPEN = [
    ['Wege & Verkehr',   ['arrow','car','parking','map','signpost','navigation','bike','bus','train','footprints','move']],
    ['Haus & Raum',      ['door','toilet','home','stairs','key','lock','elevator','shower','building','lamp','bed','sofa']],
    ['Verbot & Warnung', ['ban','off','alert','warning','triangle','octagon','shield','eye-off','x-circle','circle-slash']],
    ['Essen & Trinken',  ['beer','coffee','wine','utensils','cup','pizza','apple','milk','soup','ice-cream','glass']],
    ['Sport & Turnier',  ['trophy','medal','goal','target','flag','timer','clock','calendar','users','user','crown','award']],
    ['Technik & Medien', ['wifi','power','video','camera','phone','monitor','mic','music','volume','cast','battery','plug']],
    ['Zeichen & Symbole',['star','heart','check','info','circle','square','plus','minus','smile','sparkles','bell','gift']]
  ];

  var ALLE = null, SVG = {}, beobachter = null;

  function laden(){
    if (ALLE) return Promise.resolve(ALLE);
    return fetch(INDEX)
      .then(function(r){ return r.ok ? r.json() : null; })
      .then(function(j){
        var roh = j && (j.icons || j);
        ALLE = Array.isArray(roh) ? roh
          : (roh ? Object.keys(roh).map(function(n){
              var e = roh[n] || {};
              return { name:n, tags:e.tags||[], use:e.use||'' };
            }) : []);
        return ALLE;
      })
      .catch(function(){ ALLE = []; return ALLE; });
  }

  /* Reihenfolge: exakt, Namensanfang, eigenes Wort im Namen, irgendwo,
     zuletzt nur ein Stichwort. Ohne das stünde bei „park" die
     Weinflasche vor dem Parkplatz. */
  function suchen(alle, eingabe, kategorie){
    var q = DE[eingabe] || eingabe;
    var liste = alle;
    if (kategorie){
      var worte = null;
      GRUPPEN.forEach(function(g){ if (g[0] === kategorie) worte = g[1]; });
      if (worte) liste = liste.filter(function(e){
        var heu = e.name + ' ' + (e.tags||[]).join(' ');
        return worte.some(function(w){ return heu.indexOf(w) >= 0; });
      });
    }
    if (!q) return liste.slice(0, 400);
    return liste.map(function(e){
      var n = e.name, r = 9;
      if (n === q) r = 0;
      else if (n.indexOf(q) === 0) r = 1;
      else if (n.indexOf('-'+q) >= 0) r = 2;
      else if (n.indexOf(q) >= 0) r = 3;
      else if ((e.tags||[]).some(function(t){ return String(t).toLowerCase().indexOf(q) >= 0; })) r = 4;
      return { e:e, r:r };
    }).filter(function(x){ return x.r < 9; })
      .sort(function(a,b){ return a.r - b.r || a.e.name.length - b.e.name.length; })
      .slice(0, 400).map(function(x){ return x.e; });
  }

  function svgLaden(name, ziel){
    if (SVG[name]){ ziel.innerHTML = SVG[name]; return; }
    fetch(QUELLE + name + '.svg')
      .then(function(r){ return r.ok ? r.text() : ''; })
      .then(function(t){ SVG[name] = t || ''; ziel.innerHTML = SVG[name]; })
      .catch(function(){});
  }

  function beobachten(kachel){
    if (!window.IntersectionObserver){ svgLaden(kachel.dataset.n, kachel.querySelector('i')); return; }
    if (!beobachter){
      beobachter = new IntersectionObserver(function(eintraege){
        eintraege.forEach(function(x){
          if (!x.isIntersecting) return;
          var k = x.target;
          svgLaden(k.dataset.n, k.querySelector('i'));
          beobachter.unobserve(k);
        });
      }, { root: null, rootMargin: '200px' });
    }
    beobachter.observe(kachel);
  }

  var fenster = null, stand = { wert:'', kategorie:'', onWahl:null };

  function bauen(){
    if (fenster) return fenster;
    fenster = document.createElement('div');
    fenster.id = 'tfczIconWahl';
    fenster.innerHTML =
      '<div class="iw-karte">'+
        '<div class="iw-kopf">'+
          '<b>Icon wählen</b>'+
          '<span class="iw-zahl" id="iwZahl"></span>'+
          '<button class="iw-zu" id="iwZu" title="Schliessen">&#215;</button>'+
        '</div>'+
        '<input class="iw-suche" id="iwSuche" placeholder="Suchen — deutsch geht auch: rauch, park, wc" autocomplete="off">'+
        '<div class="iw-kats" id="iwKats"></div>'+
        '<div class="iw-raster" id="iwRaster"></div>'+
      '</div>';
    document.body.appendChild(fenster);

    fenster.addEventListener('click', function(e){
      if (e.target === fenster) schliessen();
    });
    fenster.querySelector('#iwZu').onclick = schliessen;
    fenster.querySelector('#iwSuche').oninput = zeichnen;
    document.addEventListener('keydown', function(e){
      if (e.key === 'Escape' && fenster && fenster.classList.contains('auf')) schliessen();
    });
    return fenster;
  }

  function zeichnen(){
    var f = bauen();
    var q = (f.querySelector('#iwSuche').value || '').trim().toLowerCase();
    laden().then(function(alle){
      var treffer = suchen(alle, q, stand.kategorie);
      var raster = f.querySelector('#iwRaster');
      raster.innerHTML = '';
      f.querySelector('#iwZahl').textContent =
        treffer.length + (treffer.length === 400 ? '+' : '') + ' Icons';

      treffer.forEach(function(e){
        var k = document.createElement('button');
        k.className = 'iw-i' + (e.name === stand.wert ? ' on' : '');
        k.dataset.n = e.name;
        k.title = e.name + (e.use ? ' — ' + e.use : '');
        k.innerHTML = '<i></i><span>'+e.name+'</span>';
        k.onclick = function(){
          stand.wert = e.name;
          if (stand.onWahl) stand.onWahl(e.name);
          schliessen();
        };
        raster.appendChild(k);
        beobachten(k);
      });

      if (!treffer.length)
        raster.innerHTML = '<p class="iw-leer">Nichts gefunden. Versuch ein anderes Wort — '+
                           'oder tippe den englischen Namen.</p>';
    });
  }

  function kategorien(){
    var f = bauen(), host = f.querySelector('#iwKats');
    host.innerHTML = '<button class="iw-kat'+(stand.kategorie?'':' on')+'" data-k="">Alle</button>' +
      GRUPPEN.map(function(g){
        return '<button class="iw-kat'+(stand.kategorie===g[0]?' on':'')+
               '" data-k="'+g[0]+'">'+g[0]+'</button>';
      }).join('');
    host.querySelectorAll('.iw-kat').forEach(function(b){
      b.onclick = function(){ stand.kategorie = b.dataset.k; kategorien(); zeichnen(); };
    });
  }

  function oeffnen(o){
    o = o || {};
    var f = bauen();
    stand.wert = o.wert || '';
    stand.onWahl = o.onWahl || null;
    f.querySelector('#iwSuche').value = '';
    f.classList.add('auf');
    kategorien();
    zeichnen();
    setTimeout(function(){ f.querySelector('#iwSuche').focus(); }, 60);
  }

  function schliessen(){ if (fenster) fenster.classList.remove('auf'); }

  /* ===== Icons fuer die Brand-Komponenten bereitstellen =====
     brand-components.js zeichnet synchron: es hat nur die Icons, die als Markup
     in der Datei stehen. Damit dort JEDES Lucide-Icon ankommt, laden wir die
     fehlenden nach und legen ihr Innenleben (ohne die <svg>-Huelle) in
     window.TFCZ_ICON_EXTRA. Danach zeichnet der Renderer sie wie die eigenen.
     Rueckgabe: Promise(true), wenn mindestens eines neu dazukam. */
  function innenleben(txt){
    var m = String(txt||'').match(/<svg[^>]*>([\s\S]*)<\/svg>/i);
    return m ? m[1].trim() : '';
  }
  function bereitstellen(namen){
    var EX = window.TFCZ_ICON_EXTRA = window.TFCZ_ICON_EXTRA || {};
    var offen = (namen||[]).filter(function(n){
      return n && !EX[n] && !(window.TFCZ_COMPONENTS && window.TFCZ_COMPONENTS.hat && window.TFCZ_COMPONENTS.hat(n));
    });
    if (!offen.length) return Promise.resolve(false);
    return Promise.all(offen.map(function(n){
      return TFCZ.iconWahl.svg(n).then(function(t){
        var i = innenleben(t); if (i) EX[n] = i; return !!i;
      });
    })).then(function(r){ return r.some(Boolean); });
  }

  TFCZ.iconWahl = {
    oeffnen: oeffnen,
    schliessen: schliessen,
    quelle: QUELLE,
    bereitstellen: bereitstellen,
    /* Ein einzelnes Icon als SVG holen — für Vorschauen ausserhalb. */
    svg: function(name){
      if (SVG[name]) return Promise.resolve(SVG[name]);
      return fetch(QUELLE + name + '.svg')
        .then(function(r){ return r.ok ? r.text() : ''; })
        .then(function(t){ SVG[name] = t || ''; return SVG[name]; })
        .catch(function(){ return ''; });
    }
  };
})();
