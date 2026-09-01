/* ============================================================
   TFCZ · DESIGN STUDIO — Section „Schilder"
   ------------------------------------------------------------
   Turnier- und Clubschilder von A5 bis A0, als Vektor-PDF für die
   Druckerei. Erreichbar über „Motiv wählen" → Medium „Schilder".

   Diese Datei ändert KEINE bestehende Zeile in design-studio.html.
   Sie ergänzt die Datenobjekte (FORMATS, DEF, TPLNAME, READY, MEDNM,
   SERIEN) und legt sich von aussen um sieben Funktionen. Nimmt man
   das eine <script>-Tag heraus, ist das Studio exakt wie vorher.

   Einbinden in design-studio.html:
     <link rel="stylesheet" href="system/schild.css">        (<head>)
     <link rel="stylesheet" href="system/studio-schilder.css">
     <script src="system/schild-renderer.js"></script>       (<head>)
     <script src="system/studio-schilder.js"></script>       (vor </body>)

   Gezeichnet wird hier nichts — das macht system/schild-renderer.js.
   Diese Datei ist nur Navigation und Bedienung.
   ============================================================ */
(function(){
  if (!window.TFCZ || !TFCZ.schild){ console.warn('[Schilder] Renderer fehlt'); return; }

  /* Die Assets liegen bereits im Web-Ordner — keine zweiten Kopien. */
  TFCZ.schild.bilder.basis = 'assets/img/';
  TFCZ.schild.iconQuelle   = 'assets/icons/lucide/';

  var MM_PX  = 3.779527;   // 1 mm bei 96 dpi
  var MAX_PX = 2400;       // Deckel: html2canvas kippt bei A0 sonst um

  /* ---------- Formate: kommen aus dem Renderer, eine Quelle ---------- */
  Object.keys(TFCZ.schild.formate).forEach(function(k){
    var f = TFCZ.schild.formate[k];
    var d = TFCZ.schild.datenformat(k);
    var lang = Math.max(d.daten[0], d.daten[1]);
    var px = Math.min(MM_PX, MAX_PX / lang);
    FORMATS['schild_'+k] = {
      name: f.name, grp: 'Schild', schildOnly: true, schildKey: k,
      w: Math.round(d.daten[0]*px), h: Math.round(d.daten[1]*px)
    };
  });

  /* ---------- Vorgabe-Schild ----------
     Ein Schild ist ein Datensatz, kein Layout — deshalb kein els-Array
     wie bei den Flyern, sondern genau die Felder, die der Renderer
     kennt. `els:[]` bleibt leer, damit die Ebenenliste still bleibt. */
  /* Jedes Bauteil des Schilds ist eine echte Ebene des Studios. Damit
     erscheinen Titel und Erklärung im Reiter „Texte", alle sechs in der
     Ebenenliste (mit Auge zum Ein- und Ausschalten), und das Studio
     ruft nach jeder Änderung von selbst rebuild(). Was nicht ins
     Ebenen-Modell passt — Design, Kategorie, Icon-Name, Format —
     steht im Bedienfeld. */
  DEF.schild = { layout:'schild', v:1, bg:'navy', dark:0, schild:{
    design:'mitte', kategorie:'verbot', icon:'cigarette-off',
    hilfen:false, akzent:''
  }, els:[
    { id:'wortmarke', name:'Wortmarke',  type:'image', slot:'logo' },
    { id:'wappen',    name:'Wappen',     type:'image', slot:'logo' },
    { id:'kategorie', name:'Kategorie',  type:'image' },
    { id:'icon',      name:'Icon',       type:'image', size:100 },
    { id:'titel',     name:'Titel',      type:'text', text:'Rauchverbot',
      color:'white', weight:900, size:100 },
    { id:'box',       name:'Erklärung',  type:'text', text:'',
      color:'white', weight:500, size:100 }
  ]};
  TPLNAME.schild = 'Schilder';
  READY.schild = 1;

  /* ---------- Motiv-Wähler ----------
     MEDNM erzeugt den Medium-Chip, SERIEN den Inhalt dahinter.
     Kategorie-Chips, Suche und NAVTREE ziehen automatisch nach. */
  MEDNM.schild = 'Schilder';
  SERIEN.schild = { verein: [ { k:'schild', n:'Schilder & Hinweise',
    v: [ ['schild','Rauchverbot, Parkplätze, Wegweiser · A5 bis A0'] ] } ] };

  /* Auswahlreihenfolge im Bedienfeld: von klein nach gross, quer
     jeweils hinter hoch — so sucht man ein Format. */
  var FORMATREIHE = ['a5','a5q','a4','a4q','a3','a3q','a2','a2q','a1','a1q','a0','a0q']
    .filter(function(k){ return !!TFCZ.schild.formate[k]; });

  function istSchild(){ return state.active === 'schild'; }
  window.isSchild = istSchild;

  function cfg(){
    var c = cur();
    if (!c.schild) c.schild = JSON.parse(JSON.stringify(DEF.schild.schild));
    /* Ältere gespeicherte Schilder hatten noch keine Ebenen — nachrüsten,
       und den damals in cfg gespeicherten Text übernehmen. */
    if (!c.els || !c.els.length){
      c.els = JSON.parse(JSON.stringify(DEF.schild.els));
      if (c.schild.titel) ebene(c,'titel').text = c.schild.titel;
      if (c.schild.sub)   ebene(c,'box').text   = c.schild.sub;
      delete c.schild.titel; delete c.schild.sub;
    }
    return c.schild;
  }

  function ebene(d, id){
    d = d || cur();
    var e = (d.els||[]).filter(function(x){ return x.id === id; })[0];
    return e || {};
  }
  function sichtbar(id){ return ebene(null,id).vis !== false; }
  function groesse(id){
    var v = parseFloat(ebene(null,id).size);
    return (v > 0) ? v/100 : 1;
  }

  /* ============================================================
     Zeichnen
     ============================================================ */
  var HOST_ID = 'schildHost';
  /* Die Schichten des Studios (Foto, Scrim, Brand-Streifen, Spalten)
     stören beim Schild — es bringt seine eigenen mit. */
  var SCHICHTEN = ['bgimg','scrim','darklayer','col','profi'];

  function host(){
    var cv = document.getElementById('canvas');
    var h = document.getElementById(HOST_ID);
    if (!h && cv){
      h = document.createElement('div');
      h.id = HOST_ID;
      h.style.cssText = 'position:absolute;top:0;left:0;transform-origin:top left;z-index:4';
      cv.appendChild(h);
    }
    return h;
  }

  function schichten(aus){
    var cv = document.getElementById('canvas');
    if (!cv) return;
    SCHICHTEN.forEach(function(id){
      var e = document.getElementById(id);
      if (e) e.style.display = aus ? 'none' : '';
    });
    ['.ltop','.lbot'].forEach(function(s){
      var e = cv.querySelector(s);
      if (e) e.style.display = aus ? 'none' : '';
    });
    cv.style.background = aus ? '#0d273d' : '';
  }

  function buildSchild(){
    schichten(true);
    var h = host(); if (!h) return;
    h.style.display = '';
    var f = FORMATS[state.fmt] || {};
    var k = f.schildKey || 'a4';
    var c = cfg();

    TFCZ.schild.render(h, {
      design: c.design, format: k, kategorie: c.kategorie, icon: c.icon,
      titel: ebene(null,'titel').text || '',
      sub:   ebene(null,'box').text || '',
      hilfen: c.hilfen,
      akzent: c.akzent || null,
      zeige: {
        wortmarke: sichtbar('wortmarke'), wappen: sichtbar('wappen'),
        kategorie: sichtbar('kategorie'), icon: sichtbar('icon'),
        titel: sichtbar('titel'), box: sichtbar('box')
      },
      skala: { icon: groesse('icon'), titel: groesse('titel'), box: groesse('box') }
    });

    /* Der Renderer rechnet in Millimetern, der Studio-Canvas in Pixeln.
       Das Schild wird deshalb skaliert, nicht umgerechnet — die
       Druckmasse bleiben im Renderer, wo sie hingehören. */
    var mmBreit = parseFloat(h.style.width) || 210;
    h.style.transform = 'scale(' + ((f.w || 800) / (mmBreit * MM_PX)) + ')';
    if (TFCZ.schild.fit) TFCZ.schild.fit(h);
    if (TFCZ.schild.hoeheAnpassen) TFCZ.schild.hoeheAnpassen(h);
  }
  window.buildSchild = buildSchild;

  /* Legt eine neue Fassung um eine bestehende Funktion, ohne sie zu
     ersetzen — die alte läuft weiter, wenn es kein Schild ist. */
  function umlegen(name, neu){
    var alt = window[name];
    if (typeof alt !== 'function'){ console.warn('[Schilder] '+name+' fehlt'); return; }
    window[name] = neu(alt);
  }

  umlegen('rebuild', function(alt){ return function(){
    if (istSchild()){ buildSchild(); return; }
    var h = document.getElementById(HOST_ID);
    if (h) h.style.display = 'none';
    schichten(false);
    return alt.apply(this, arguments);
  };});

  /* ============================================================
     Bedienfeld
     ============================================================ */
  /* Das Bedienfeld sitzt in der rechten Spalte unter „Texte" — das ist
     der Bereich, den das Studio beim Start offen hat. Für ein Schild
     steht dort sonst nur „keine freien Textfelder", weil ein Schild
     keine losen Textebenen hat. */
  function panel(){
    var p = document.getElementById('schildPanel');
    if (!p){
      p = document.createElement('div');
      p.id = 'schildPanel';
      p.className = 'epanel editblk';
      p.style.display = 'none';
      var ziel = document.getElementById('rp_texte')
              || document.getElementById('editHost')
              || document.getElementById('sidebar');
      if (ziel) ziel.appendChild(p);
    }
    return p;
  }

  function zeile(titel, inhalt){
    return '<div class="sf"><label>'+titel+'</label>'+inhalt+'</div>';
  }

  var DESIGNNAMEN = { mitte:'Mitte', sockel:'Sockel', rahmen:'Rahmen',
                      kappe:'Kappe', fokus:'Fokus' };

  function buildSchildPanel(){
    var p = panel(), c = cfg(), kat = TFCZ.schild.kategorien;

    var html = zeile('Design',
      '<div class="sc-chips" id="sc-design">' +
      TFCZ.schild.designs.map(function(d){
        return '<button class="sc-chip'+(c.design===d?' on':'')+'" data-v="'+d+'">'+
               (DESIGNNAMEN[d]||d)+'</button>';
      }).join('') + '</div>');

    html += zeile('Kategorie',
      '<div class="sc-chips" id="sc-kat">' +
      Object.keys(kat).map(function(kk){
        return '<button class="sc-chip'+(c.kategorie===kk?' on':'')+'" data-v="'+kk+'"'+
               ' style="--kf:'+kat[kk].farbe+'">'+kat[kk].label+'</button>';
      }).join('') + '</div>');

    /* Titel und Erklärung stehen im Reiter „Texte" — dort erwartet sie
       jeder, der das Studio kennt. Hier steht, was dort nicht hingehört. */
    html += zeile('Icon',
      '<div class="sc-iconzeile">'+
        '<span class="sc-iconvor" id="sc-iconvor"></span>'+
        '<input class="sc-in" id="sc-icon" value="'+String(c.icon||'')+'" '+
        'placeholder="rauch, park, wc …" autocomplete="off">'+
      '</div>'+
      '<div class="sc-treffer" id="sc-treffer"></div>'+
      '<p class="sc-hint">Deutsch tippen reicht: „rauch", „park", „wc".</p>');

    html += zeile('Druckhilfen',
      '<label class="sc-schalter"><input type="checkbox" id="sc-hilfen"'+
      (c.hilfen?' checked':'')+'> Schnittkante und Ösen-Zonen zeigen</label>');

    html += zeile('Akzentfarbe',
      '<div class="sc-chips" id="sc-akzent">' +
      [['','Gold','#cda857'],['#5ca7dc','Blau','#5ca7dc'],['#ffffff','Weiss','#ffffff']]
      .map(function(a){
        return '<button class="sc-chip'+((c.akzent||'')===a[0]?' on':'')+
               '" data-v="'+a[0]+'" style="--kf:'+a[2]+'">'+a[1]+'</button>';
      }).join('') + '</div>');

    html += zeile('Grössen',
      ['icon','titel','box'].map(function(id){
        var e = ebene(null,id), n = { icon:'Icon', titel:'Titel', box:'Erklärung' }[id];
        return '<div class="sc-reg"><span>'+n+'</span>'+
          '<input type="range" min="60" max="160" step="5" value="'+(e.size||100)+
          '" data-e="'+id+'"><b>'+(e.size||100)+'%</b></div>';
      }).join(''));

    /* Die Formatwahl gehört hierher, nicht in die Kopfleiste: zwölf
       Grössen passen dort nicht hin, und hier steht das Datenformat
       gleich darunter. */
    html += zeile('Format',
      '<div class="sc-chips sc-fmt" id="sc-format">' +
      FORMATREIHE.map(function(k){
        var f = FORMATS['schild_'+k];
        if (!f) return '';
        return '<button class="sc-chip'+(state.fmt==='schild_'+k?' on':'')+
               '" data-v="'+k+'">'+f.name+'</button>';
      }).join('') + '</div>');

    var d = TFCZ.schild.datenformat((FORMATS[state.fmt]||{}).schildKey || 'a4');
    html += '<div class="sc-druck">'+
      '<b>Datenformat</b><span>'+d.daten[0]+' × '+d.daten[1]+' mm</span>'+
      '<b>Endformat</b><span>'+d.end[0]+' × '+d.end[1]+' mm</span>'+
      '<b>Anschnitt</b><span>'+d.anschnitt+' mm rundum</span>'+
      '</div>'+
      '<button class="sc-pdf" id="sc-pdf">PDF für die Druckerei</button>'+
      '<p class="sc-hint">Im Druckdialog: Ziel „Als PDF sichern", Ränder „keine", '+
      'Hintergrundgrafiken „ein".</p>';

    p.innerHTML = html;
    verdrahten(p);
  }
  window.buildSchildPanel = buildSchildPanel;

  function verdrahten(p){
    var c = cfg();
    var neu = function(){ save(); buildSchildPanel(); rebuild(); };

    p.querySelectorAll('#sc-design .sc-chip').forEach(function(b){
      b.onclick = function(){ c.design = b.dataset.v; neu(); };
    });
    p.querySelectorAll('#sc-kat .sc-chip').forEach(function(b){
      b.onclick = function(){ c.kategorie = b.dataset.v; neu(); };
    });

    p.querySelectorAll('#sc-akzent .sc-chip').forEach(function(b){
      b.onclick = function(){ c.akzent = b.dataset.v; neu(); };
    });

    /* Die Regler schreiben in die Ebene, nicht in die Konfiguration —
       so bleibt die Ebenenliste des Studios die eine Quelle. */
    p.querySelectorAll('.sc-reg input[data-e]').forEach(function(r){
      r.oninput = function(){
        var e = ebene(null, r.dataset.e);
        e.size = parseInt(r.value, 10);
        var b = r.parentNode.querySelector('b'); if (b) b.textContent = e.size + '%';
        save(); rebuild();
      };
    });

    var h = p.querySelector('#sc-hilfen');
    if (h) h.onchange = function(){ c.hilfen = h.checked; save(); rebuild(); };

    p.querySelectorAll('#sc-format .sc-chip').forEach(function(b){
      b.onclick = function(){
        state.fmt = 'schild_' + b.dataset.v;
        state.outs = state.outs || {};
        state.outs.schild = [state.fmt];
        save(); switchAll();
      };
    });

    var pdf = p.querySelector('#sc-pdf');
    if (pdf) pdf.onclick = function(){
      var el = document.getElementById(HOST_ID);
      if (!el) return;
      var alt = el.style.transform;
      el.style.transform = '';        // im Druck 1:1, nicht auf Canvas-Pixel skaliert
      TFCZ.schild.drucken(el);
      el.style.transform = alt;
    };

    iconSuche(p);
  }

  /* ---------- Icon-Suche ----------
     Die Lucide-Stichworte sind englisch, gesucht wird auf Deutsch.
     Diese Brücke deckt ab, was auf Schildern vorkommt — fehlt ein
     Wort, kommt es hier dazu. */
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
    treppe:'stairs', lift:'elevator', dusche:'shower', wasser:'droplet'
  };

  var ICONLISTE = null;
  function iconIndex(){
    if (ICONLISTE) return Promise.resolve(ICONLISTE);
    return fetch('assets/icons/lucide-index.json')
      .then(function(r){ return r.ok ? r.json() : null; })
      .then(function(j){
        var roh = j && (j.icons || j);
        ICONLISTE = Array.isArray(roh) ? roh
          : (roh ? Object.keys(roh).map(function(n){
              var e = roh[n] || {}; return { name:n, tags:e.tags||[], use:e.use||'' };
            }) : []);
        return ICONLISTE;
      })
      .catch(function(){ ICONLISTE = []; return ICONLISTE; });
  }

  function iconSuche(p){
    var feld = p.querySelector('#sc-icon'),
        liste = p.querySelector('#sc-treffer'),
        vor = p.querySelector('#sc-iconvor');
    if (!feld || !liste) return;
    var c = cfg();

    function vorschau(name){
      if (!vor) return;
      fetch(TFCZ.schild.iconQuelle + name + '.svg')
        .then(function(r){ return r.ok ? r.text() : ''; })
        .then(function(t){ vor.innerHTML = t || ''; })
        .catch(function(){ vor.innerHTML = ''; });
    }
    vorschau(c.icon);

    feld.oninput = function(){
      var eingabe = feld.value.trim().toLowerCase();
      c.icon = eingabe; save(); rebuild();
      if (eingabe.length < 2){ liste.innerHTML = ''; return; }
      var q = DE[eingabe] || eingabe;
      iconIndex().then(function(alle){
        /* Reihenfolge: exakt, Namensanfang, eigenes Wort im Namen,
           irgendwo, zuletzt nur ein Stichwort. Ohne das stünde bei
           „park" die Weinflasche vor dem Parkplatz. */
        var rang = function(e){
          var n = e.name;
          if (n === q) return 0;
          if (n.indexOf(q) === 0) return 1;
          if (n.indexOf('-'+q) >= 0) return 2;
          if (n.indexOf(q) >= 0) return 3;
          return (e.tags||[]).some(function(tg){
            return String(tg).toLowerCase().indexOf(q) >= 0; }) ? 4 : 9;
        };
        var treffer = alle.map(function(e){ return { e:e, r:rang(e) }; })
          .filter(function(x){ return x.r < 9; })
          .sort(function(a,b){ return a.r - b.r || a.e.name.length - b.e.name.length; })
          .slice(0, 24).map(function(x){ return x.e; });
        liste.innerHTML = treffer.map(function(e){
          return '<button class="sc-treffer-i" data-n="'+e.name+'" title="'+
                 String(e.use||'').replace(/"/g,'&quot;')+'">'+e.name+'</button>';
        }).join('') || '<span class="sc-hint">Nichts gefunden.</span>';
        liste.querySelectorAll('.sc-treffer-i').forEach(function(b){
          b.onclick = function(){
            c.icon = b.dataset.n; feld.value = b.dataset.n; liste.innerHTML = '';
            vorschau(c.icon); save(); rebuild();
          };
        });
      });
    };
  }

  /* ---------- Sidebar ---------- */
  umlegen('refreshSidebar', function(alt){ return function(){
    var r = alt.apply(this, arguments);
    var p = panel();
    if (istSchild()){
      buildSchildPanel();
      ['genericEdit','ausPanel','rankPanel','eventPanel','reelPanel'].forEach(function(id){
        var e = document.getElementById(id); if (e) e.style.display = 'none';
      });
      p.style.display = '';
      var nf = document.getElementById('nfHost'); if (nf) nf.style.display = 'none';
    } else {
      p.style.display = 'none';
    }
    return r;
  };});

  /* ---------- Formate: Schild-Grössen nur im Schilder-Motiv ---------- */
  /* In der Kopfleiste steht nur die gewählte Grösse — die Auswahl
     selbst liegt im Bedienfeld. Zwölf Chips oben wären unlesbar. */
  function nurSchild(){
    var k = String(state.fmt).indexOf('schild_') === 0 ? state.fmt : 'schild_a3q';
    return [k];
  }
  function ohneSchild(liste){
    if (!Array.isArray(liste)) return liste;
    return liste.filter(function(x){
      var k = (typeof x === 'string') ? x : (x && (x.k || x[0]));
      return !(FORMATS[k] && FORMATS[k].schildOnly);
    });
  }
  ['fmtsFor','capApplicableFormats'].forEach(function(name){
    umlegen(name, function(alt){ return function(){
      if (istSchild()) return nurSchild();
      return ohneSchild(alt.apply(this, arguments));
    };});
  });

  /* ---------- Navigation ---------- */
  umlegen('medOf', function(alt){ return function(k){
    if (k === 'schild') return 'schild';
    return alt.apply(this, arguments);
  };});
  umlegen('catOf', function(alt){ return function(){
    if (istSchild()) return 'verein';
    return alt.apply(this, arguments);
  };});
  umlegen('navGo', function(alt){ return function(id){
    /* Vorgabe-Ausgabe setzen, BEVOR das Studio sie selbst bestimmt:
       outsOf() nimmt sonst das erste gültige Format — das wäre A0 hoch. */
    if (id === 'schild'){
      state.outs = state.outs || {};
      if (!state.outs.schild || !state.outs.schild.length)
        state.outs.schild = ['schild_a3q'];
    }
    var r = alt.apply(this, arguments);
    if (id === 'schild' && String(state.fmt).indexOf('schild_') !== 0){
      state.fmt = 'schild_a3q'; save(); switchAll();
    } else if (id !== 'schild' && String(state.fmt).indexOf('schild_') === 0){
      state.fmt = 'ig_feed'; save(); switchAll();
    }
    return r;
  };});

  /* Gespeicherter Stand war schon „Schilder": Format geradeziehen. */
  if (istSchild()){
    state.outs = state.outs || {};
    if (!state.outs.schild || !state.outs.schild.length)
      state.outs.schild = ['schild_a3q'];
    if (String(state.fmt).indexOf('schild_') !== 0) state.fmt = 'schild_a3q';
    if (window.switchAll) switchAll();
  }
})();
