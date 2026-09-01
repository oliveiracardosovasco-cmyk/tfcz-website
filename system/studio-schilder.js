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
    groesse:'a3', hilfen:false, akzent:''
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
  var GROESSEN = ['a5','a4','a3','a2','a1','a0']
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
      '<button class="sc-iconwahl" id="sc-iconwahl">'+
        '<span class="sc-iconvor" id="sc-iconvor"></span>'+
        '<span class="sc-iconname" id="sc-iconname">'+(c.icon||'auswählen')+'</span>'+
        '<span class="sc-iconmehr">Bibliothek</span>'+
      '</button>'+
      '<p class="sc-hint">Alle Lucide-Icons, suchbar auf Deutsch: „rauch", „park", „wc".</p>');

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

    /* Hier steht die Grösse. Hoch und quer sind die zwei Ausgaben dazu
       und stehen als ankreuzbare Chips oben in der Kopfleiste — genau
       so wie bei den Flyern. */
    html += zeile('Grösse',
      '<div class="sc-chips sc-fmt" id="sc-groesse">' +
      GROESSEN.map(function(g){
        return '<button class="sc-chip'+((c.groesse||'a3')===g?' on':'')+
               '" data-v="'+g+'">'+g.toUpperCase()+'</button>';
      }).join('') + '</div>' +
      '<p class="sc-hint">Hoch und quer wählst du oben bei den Ausgaben — '+
      'beide ankreuzen geht auch.</p>');

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

    p.querySelectorAll('#sc-groesse .sc-chip').forEach(function(b){
      b.onclick = function(){
        /* Die Orientierung bleibt, nur die Grösse wechselt. */
        var quer = /q$/.test(String(state.fmt).replace('schild_',''));
        c.groesse = b.dataset.v;
        state.fmt = 'schild_' + c.groesse + (quer ? 'q' : '');
        state.outs = state.outs || {};
        state.outs.schild = [state.fmt];
        save(); switchAll();
      };
    });

    var pdf = p.querySelector('#sc-pdf');
    if (pdf) pdf.onclick = pdfDrucken;

    iconSuche(p);
  }

  /* Die Icon-Bibliothek ist ein eigener Baustein (system/icon-picker.js)
     und kennt die deutsche Suche. Hier steht nur die Anbindung. */

  function iconSuche(p){
    var knopf = p.querySelector('#sc-iconwahl'),
        vor   = p.querySelector('#sc-iconvor'),
        name  = p.querySelector('#sc-iconname');
    if (!knopf) return;
    var c = cfg();

    function vorschau(n){
      if (!vor) return;
      if (TFCZ.iconWahl) TFCZ.iconWahl.svg(n).then(function(t){ vor.innerHTML = t || ''; });
      else fetch(TFCZ.schild.iconQuelle + n + '.svg')
        .then(function(r){ return r.ok ? r.text() : ''; })
        .then(function(t){ vor.innerHTML = t || ''; })
        .catch(function(){});
    }
    vorschau(c.icon);

    knopf.onclick = function(){
      if (!TFCZ.iconWahl){ console.warn('[Schilder] Icon-Bibliothek fehlt'); return; }
      TFCZ.iconWahl.oeffnen({ wert: c.icon, onWahl: function(n){
        c.icon = n;
        if (name) name.textContent = n;
        vorschau(n);
        save(); rebuild();
      }});
    };
  }

  /* ---------- PDF im Download-Menü ----------
     Der Studio-Download liefert PNG. Für die Druckerei braucht es ein
     Vektor-PDF, und der einzige verlässliche Weg dorthin führt aus dem
     Browser über „Drucken → Als PDF sichern". Deshalb steht der Eintrag
     dort, wo man den Download sucht, statt nur unten im Bedienfeld. */
  function pdfEintrag(){
    var menu = document.getElementById('ddMenu');
    if (!menu) return null;
    var b = document.getElementById('schildPdfMenu');
    if (!b){
      var kat = document.createElement('div');
      kat.className = 'tb-mcat'; kat.id = 'schildPdfKat'; kat.textContent = 'Druck';
      b = document.createElement('button');
      b.className = 'tb-mitem'; b.id = 'schildPdfMenu';
      b.innerHTML = '<span data-ic="file-text"></span> PDF für die Druckerei (Vektor)';
      b.onclick = function(){ pdfDrucken(); };
      menu.insertBefore(kat, menu.firstChild);
      menu.insertBefore(b, kat.nextSibling);
      if (window.TFCZ_ICONS && TFCZ_ICONS.render) TFCZ_ICONS.render(menu);
    }
    return b;
  }

  function pdfDrucken(){
    var el = document.getElementById(HOST_ID);
    if (!el) return;
    var alt = el.style.transform;
    el.style.transform = '';        // im Druck 1:1, nicht auf Canvas-Pixel skaliert
    TFCZ.schild.drucken(el);
    el.style.transform = alt;
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
      var mb = pdfEintrag();
      if (mb){ mb.style.display = ''; 
        var mk = document.getElementById('schildPdfKat'); if (mk) mk.style.display = ''; }
    } else {
      p.style.display = 'none';
      var mb2 = document.getElementById('schildPdfMenu');
      if (mb2){ mb2.style.display = 'none';
        var mk2 = document.getElementById('schildPdfKat'); if (mk2) mk2.style.display = 'none'; }
    }
    return r;
  };});

  /* ---------- Formate: Schild-Grössen nur im Schilder-Motiv ---------- */
  /* Die Kopfleiste zeigt genau zwei Ausgaben: die gewählte Grösse in hoch
     und in quer. Beide ankreuzbar, „Alle Formate" exportiert dann beide.
     Die Grösse selbst wählt man im Bedienfeld — zwölf Chips oben wären
     unlesbar. */
  function nurSchild(){
    var d = (typeof cur === 'function') ? cur() : null;
    var g = (d && d.schild && d.schild.groesse) || 'a3';
    if (!FORMATS['schild_'+g]) g = 'a3';
    return ['schild_'+g, 'schild_'+g+'q'];
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
