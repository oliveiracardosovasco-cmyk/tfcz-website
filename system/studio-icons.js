/* ============================================================
   TFCZ · ICONS FÜR ALLE FLYER
   ------------------------------------------------------------
   Die Icon-Bibliothek (system/icon-picker.js) hängt hier am
   Design Studio: überall, wo eine Brand-Komponente ein Icon
   führt, wird es über die Bibliothek gewählt — nicht getippt
   und nicht aus einer kurzen Liste geklaubt.

   Was diese Datei tut:
     1. Inspector-Feld  — typ:'icon' wird ein Knopf mit Vorschau.
     2. Nachladen       — brand-components.js zeichnet synchron und
                          kennt nur die eingebauten Icons. Vor dem
                          Zeichnen melden die Komponenten über
                          iconsAus(), welche Icons sie brauchen;
                          fehlende werden geholt und einmal neu
                          gezeichnet.
     3. Schnell-Knopf   — „Icon" im Hinzufügen-Block setzt eine
                          Icon-Komponente und öffnet gleich die
                          Bibliothek.

   Einbinden NACH design-studio.html's eigenem Skript:
       <script src="system/studio-icons.js"></script>
   ============================================================ */
(function(){

  /* ---------- 1. Inspector-Feld ---------- */
  window.iconFeldRow = function(host, el, fd, p){
    var w = document.createElement('div'); w.className = 'rw';
    var l = document.createElement('label'); l.textContent = fd.label; w.appendChild(l);

    var b = document.createElement('button');
    b.type = 'button'; b.className = 'ic-feld';
    b.innerHTML = '<span class="ic-vor"></span><span class="ic-nam"></span>'
                + '<span class="ic-akt">Ändern</span>';

    var vor = b.querySelector('.ic-vor'), nam = b.querySelector('.ic-nam');
    function zeigen(n){
      nam.textContent = n || '— keines —';
      vor.innerHTML = '';
      if (!n || !window.TFCZ || !TFCZ.iconWahl) return;
      TFCZ.iconWahl.svg(n).then(function(t){ vor.innerHTML = t || ''; });
    }
    zeigen(p[fd.k]);

    b.onclick = function(){
      if (!window.TFCZ || !TFCZ.iconWahl){ console.warn('[Icons] Bibliothek fehlt'); return; }
      TFCZ.iconWahl.oeffnen({ wert: p[fd.k], onWahl: function(n){
        if (typeof beginEdit === 'function') beginEdit();
        compSet(el, fd.k, n);
        zeigen(n);
        TFCZ.iconWahl.bereitstellen([n]).then(function(){
          save(); rebuild(); buildCompInspector(el);
        });
      }});
    };

    if (el.props && el.props[fd.k] !== undefined) w.classList.add('ov');
    w.appendChild(b); host.appendChild(w);
  };

  /* Von aussen: für die zuletzt gesetzte Komponente die Bibliothek öffnen.
     Der Schnell-Knopf „Icon" fügt ein und fragt sofort, welches. */
  window.iconWaehlenFuerSel = function(){
    setTimeout(function(){
      if (typeof sel === 'undefined' || !sel) return;
      var el = getEl(sel); if (!el || el.type !== 'comp') return;
      var def = compDef(el); if (!def || !def.felder) return;
      var fd = def.felder.filter(function(f){ return f.typ === 'icon'; })[0];
      if (!fd || !window.TFCZ || !TFCZ.iconWahl) return;
      TFCZ.iconWahl.oeffnen({ wert: compProps(el)[fd.k], onWahl: function(n){
        if (typeof beginEdit === 'function') beginEdit();
        compSet(el, fd.k, n);
        TFCZ.iconWahl.bereitstellen([n]).then(function(){
          save(); rebuild(); syncInspector();
        });
      }});
    }, 40);
  };

  /* ---------- 2. Fehlende Icons nachladen ---------- */
  /* Ein Flyer aus dem Speicher kann Icons führen, die brand-components.js nicht
     bei sich trägt. Nach jedem Zeichnen sammeln wir, was die Komponenten melden,
     holen das Fehlende und zeichnen EINMAL nach. Die Sperre verhindert, dass sich
     Nachladen und Zeichnen gegenseitig aufschaukeln. */
  var laeuft = false;

  function gebrauchteIcons(){
    var d = (typeof cur === 'function') ? cur() : null;
    if (!d || !d.els) return [];
    var raus = [];
    d.els.forEach(function(e){
      if (e.type !== 'comp') return;
      var def = (typeof compDef === 'function') ? compDef(e) : null;
      if (!def) return;
      var p = compProps(e);
      if (typeof def.iconsAus === 'function'){
        try { raus = raus.concat(def.iconsAus(p) || []); } catch(err){}
      }
      (def.felder || []).forEach(function(f){ if (f.typ === 'icon' && p[f.k]) raus.push(p[f.k]); });
    });
    return raus.filter(Boolean);
  }

  function umlegen(name, neu){
    var alt = window[name];
    if (typeof alt !== 'function') return false;
    window[name] = neu(alt);
    return true;
  }

  umlegen('rebuild', function(alt){
    return function(){
      var r = alt.apply(this, arguments);
      if (laeuft || !window.TFCZ || !TFCZ.iconWahl || !TFCZ.iconWahl.bereitstellen) return r;
      var noetig = gebrauchteIcons();
      if (!noetig.length) return r;
      laeuft = true;
      TFCZ.iconWahl.bereitstellen(noetig).then(function(neuDabei){
        laeuft = false;
        if (neuDabei) rebuild();                 /* einmal, mit vollständigen Icons */
      }).catch(function(){ laeuft = false; });
      return r;
    };
  });

})();
