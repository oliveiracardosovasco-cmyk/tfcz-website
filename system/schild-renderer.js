/* ============================================================
   TFCZ · SCHILD-RENDERER  —  Design-Template
   ------------------------------------------------------------
   Eine Quelle für alle Turnier- und Clubschilder. Wird so, wie
   sie ist, ins Design Studio übernommen: das Studio liefert nur
   die Konfiguration, das Zeichnen macht diese Datei.

       TFCZ.schild.render(el, {
         design:    'mitte' | 'sockel' | 'rahmen' | 'kappe' | 'fokus',
         format:    'a4' | 'a3q',
         kategorie: 'verbot' | 'info' | 'hinweis' | 'weg',
         icon:      'cigarette-off',      // Lucide-Name
         titel:     'Rauchen|nur draussen',   // | = Zeilenumbruch
         sub:       'Kurzer Erklärsatz.',
         liste:     [['Tisch 1 – 3','Halle']],   // optional
         anschnitt: true,       // Blatt im Datenformat (+5 mm rundum)
         hilfen:    false       // Schnittmarken + Ösen-Freizonen zeigen
       });

   Druckdaten (wir-machen-druck.ch, Hohlkammerplatte A3 quer):
     Endformat 420 × 297 · Datenformat 430 × 307 (5 mm Anschnitt)
     Ösen/Bohrung 4,5 mm bei 15 mm Eckenabstand
     -> in den vier Ecken bleiben 25 mm frei. Der Renderer hält
        diese Zone selbst frei; `hilfen:true` macht sie sichtbar.
   ============================================================ */
(function(){
  var TFCZ = window.TFCZ = window.TFCZ || {};

  var C = {
    blue:'#5ca7dc', blueMid:'#4489c7', blueDk:'#005a94',
    navy:'#0d273d', navy2:'#0a1f31', navy3:'#081826',
    gold:'#cda857', goldLt:'#e9c475',
    red:'#da2929', green:'#67b57d', sand:'#e6e3da',
    ink:'#eef4fa', inkMut:'#c3d2e0'
  };

  var KAT = {
    verbot:  { label:'Verbot',      farbe:C.red,    text:'#fff' },
    info:    { label:'Information', farbe:C.blueDk, text:'#fff' },
    hinweis: { label:'Hinweis',     farbe:C.gold,   text:C.navy },
    weg:     { label:'Wegweiser',   farbe:C.green,  text:'#fff' }
  };

  /* Lucide-Icons — Quelle assets/icons/lucide. Ergänzen: Pfade aus der
     SVG-Datei kopieren, Schlüssel = Dateiname. */
  var IC = {
    'cigarette-off':'<path d="M12 12H3a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1h13"/><path d="M18 8c0-2.5-2-2.5-2-5"/><path d="m2 2 20 20"/><path d="M21 12a1 1 0 0 1 1 1v2a1 1 0 0 1-.5.866"/><path d="M22 8c0-2.5-2-2.5-2-5"/><path d="M7 12v4"/>',
    'circle-parking':'<circle cx="12" cy="12" r="10"/><path d="M9 17V7h4a3 3 0 0 1 0 6H9"/>',
    'toilet':'<path d="M7 12h13a1 1 0 0 1 1 1 5 5 0 0 1-5 5h-.598a.5.5 0 0 0-.424.765l1.544 2.47a.5.5 0 0 1-.424.765H5.402a.5.5 0 0 1-.424-.765L7 18"/><path d="M8 18a5 5 0 0 1-5-5V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v8"/>',
    'door-open':'<path d="M11 20H2"/><path d="M11 4.562v16.157a1 1 0 0 0 1.242.97L19 20V5.562a2 2 0 0 0-1.515-1.94l-4-1A2 2 0 0 0 11 4.561z"/><path d="M11 4H8a2 2 0 0 0-2 2v14"/><path d="M14 12h.01"/><path d="M22 20h-3"/>',
    'volume-x':'<path d="M11 4.702a.705.705 0 0 0-1.203-.498L6.413 7.587A1.4 1.4 0 0 1 5.416 8H3a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h2.416a1.4 1.4 0 0 1 .997.413l3.383 3.384A.705.705 0 0 0 11 19.298z"/><line x1="22" x2="16" y1="9" y2="15"/><line x1="16" x2="22" y1="9" y2="15"/>',
    'arrow-right':'<path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>',
    'arrow-left':'<path d="M19 12H5"/><path d="m12 19-7-7 7-7"/>',
    'trophy':'<path d="M10 14.66v1.626a2 2 0 0 1-.976 1.696A5 5 0 0 0 7 21.978"/><path d="M14 14.66v1.626a2 2 0 0 0 .976 1.696A5 5 0 0 1 17 21.978"/><path d="M18 9h1.5a1 1 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M6 9a6 6 0 0 0 12 0V3a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1z"/><path d="M6 9H4.5a1 1 0 0 1 0-5H6"/>',
    'beer':'<path d="M17 11h1a3 3 0 0 1 0 6h-1"/><path d="M9 12v6"/><path d="M13 12v6"/><path d="M14 7.5c-1 0-1.44.5-3 .5s-2-.5-3-.5-1.72.5-2.5.5a2.5 2.5 0 0 1 0-5c.78 0 1.57.5 2.5.5S9.44 2 11 2s2 1.5 3 1.5 1.72-.5 2.5-.5a2.5 2.5 0 0 1 0 5c-.78 0-1.5-.5-2.5-.5Z"/><path d="M5 8v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V8"/>',
    'info':'<circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/>',
    'triangle-alert':'<path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"/><path d="M12 9v4"/><path d="M12 17h.01"/>',
    'users':'<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><path d="M16 3.128a4 4 0 0 1 0 7.744"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><circle cx="9" cy="7" r="4"/>',
    'camera-off':'<path d="M14.564 14.558a3 3 0 1 1-4.122-4.121"/><path d="m2 2 20 20"/><path d="M20 20H4a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h1.997a2 2 0 0 0 .819-.175"/><path d="M9.695 4.024A2 2 0 0 1 10.004 4h3.993a2 2 0 0 1 1.76 1.05l.486.9A2 2 0 0 0 18.003 7H20a2 2 0 0 1 2 2v7.344"/>',
    'map-pin':'<path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"/><circle cx="12" cy="10" r="3"/>',
    'clock':'<circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>'
  };

  /* Bildpfade — im Design Studio ggf. einmal umbiegen.
     ALLES HIER IST VEKTOR (SVG). Das ist der Grund, warum dasselbe
     Schild in A5 und in A0 gleich scharf ist. Wer hier ein PNG
     einträgt, nimmt dem Schild die Grossformat-Tauglichkeit.
     Quelle der SVGs: „TFCZ – Ordner" -> Logo/Logo/RGB/PDF und
     Logo/Pattern/Pattern.pdf, aus den Original-Vektoren erzeugt. */
  var IMG = {
    basis: '../../ocsav - tfcz_Web/assets/img/',
    wortmarkeWeiss:  'logo-horizontal-white.svg',
    wortmarkeDunkel: 'logo-horizontal-black.svg',
    wappen:          'pattern.svg',
    emblem:          'logo-shield.png'
  };

  /* --- Formate --------------------------------------------------
     Die ganze DIN-A-Reihe, jeweils hoch und quer. Endformat in mm;
     der Anschnitt kommt beim Rendern dazu.                        */
  var A_REIHE = {
    a0:{b:841,h:1189}, a1:{b:594,h:841}, a2:{b:420,h:594},
    a3:{b:297,h:420},  a4:{b:210,h:297}, a5:{b:148,h:210}
  };
  var FORMATE = {};
  Object.keys(A_REIHE).forEach(function(k){
    var f = A_REIHE[k];
    FORMATE[k]      = { b:f.b, h:f.h, quer:false, name:k.toUpperCase()+' hoch' };
    FORMATE[k+'q']  = { b:f.h, h:f.b, quer:true,  name:k.toUpperCase()+' quer' };
  });

  /* Anschnitt je Formatklasse — grosse Platten wollen mehr Rand.
     Die Druckerei nennt den Wert pro Produkt; das hier sind die
     üblichen Werte und der Vorgabewert, wenn nichts angegeben ist. */
  var ANSCHNITT_JE_FORMAT = { a0:10, a1:10, a2:5, a3:5, a4:5, a5:3 };
  var ANSCHNITT = 5;      // Rückfall
  var OESE = 25;          // Ösen-Freizone in den Ecken, physisch, skaliert NIE

  /* --- Massstab --------------------------------------------------
     Jedes Design ist auf A4 entworfen. Für jedes andere Format wird
     alles mit der Wurzel des Flächenverhältnisses skaliert — genau
     so, wie die DIN-Reihe selbst aufgebaut ist (A3 = Wurzel 2 mal
     A4, A2 = 2 mal A4 …). Dadurch sieht dasselbe Schild in A5 und
     in A0 identisch aus, nur grösser.

     ACHTUNG beim Erweitern: mm() ist das SKALIERENDE Mass (alles,
     was zum Design gehört), abs() das physische (Anschnitt, Ösen,
     Blattgrösse). Wer hier mm() und abs() vertauscht, bekommt ein
     Schild, das in A0 nicht mehr aufgeht. */
  var K = 1;                                  // aktueller Massstab
  var BEZUG = 210 * 297;                      // A4 als Bezugsfläche
  function massstab(f){ return Math.sqrt((f.b*f.h)/BEZUG); }

  function mm(v){ return (v*K)+'mm'; }        // Design-Mass — skaliert
  function abs(v){ return v+'mm'; }           // physisches Mass — skaliert nie
  /* Icon zeichnen. Ist der Name nicht im eingebauten Satz, wird die
     SVG-Datei aus dem Lucide-Ordner nachgeladen und der Platzhalter
     danach ersetzt — so stehen alle rund 1750 Icons zur Verfügung,
     ohne dass sie hier drinstehen müssen. */
  function icon(name, groesseMm, strich){
    if (!IC[name]) return icon_nachladen(name, groesseMm, strich);
    var d = IC[name];
    return '<svg viewBox="0 0 24 24" style="width:'+mm(groesseMm)+';height:'+mm(groesseMm)+
           ';fill:none;stroke:currentColor;stroke-width:'+(strich||1.5)+
           ';stroke-linecap:round;stroke-linejoin:round;display:block">'+d+'</svg>';
  }
  var LADE_NR = 0, LADE_LAUFEND = {};
  function icon_nachladen(name, groesseMm, strich){
    var id = 'tfcz-ic-' + (++LADE_NR);
    if (!LADE_LAUFEND[name]){
      LADE_LAUFEND[name] = fetch(TFCZ.schild.iconQuelle + name + '.svg')
        .then(function(r){ if(!r.ok) throw 0; return r.text(); })
        .then(function(t){
          IC[name] = t.replace(/^[\s\S]*?<svg[^>]*>/, '').replace('</svg>', '');
          return IC[name];
        })
        .catch(function(){ IC[name] = IC.info; return IC[name]; });
    }
    LADE_LAUFEND[name].then(function(d){
      var ziel = document.getElementById(id);
      if (ziel) ziel.innerHTML = d;
    });
    return '<svg id="'+id+'" viewBox="0 0 24 24" style="width:'+mm(groesseMm)+
      ';height:'+mm(groesseMm)+';fill:none;stroke:currentColor;stroke-width:'+(strich||1.5)+
      ';stroke-linecap:round;stroke-linejoin:round;display:block"></svg>';
  }

  function zeilen(t){ return String(t||'').split('|'); }
  /* Titel: jede Zeile ein eigener Block ohne Umbruch — so kann fit()
     messen und die Schrift so weit verkleinern, bis alles passt. */
  function titel(t, groesseMm){
    return '<h1 class="gross" data-fs="'+groesseMm+'" data-k="'+K+'" style="font-size:'+mm(groesseMm)+'">'+
      zeilen(t).map(function(z){ return '<span class="zl">'+esc(z)+'</span>'; }).join('')+
      '</h1>';
  }
  function esc(s){ return String(s==null?'':s).replace(/[&<>]/g,function(c){
    return {'&':'&amp;','<':'&lt;','>':'&gt;'}[c]; }); }

  /* Wortmarke oben mittig — auf JEDEM Schild, immer gleich. */
  function wortmarke(hellerGrund, hoeheMm, obenMm){
    return '<img class="tfcz-wm" src="'+IMG.basis+
      (hellerGrund ? IMG.wortmarkeDunkel : IMG.wortmarkeWeiss)+
      '" alt="Tischfussball Club Zürich" style="height:'+mm(hoeheMm)+
      ';top:'+mm(obenMm)+'">';
  }

  /* ============================================================
     Die fünf Designs. Jedes bekommt (cfg, m) und gibt HTML zurück.
     m = Masse des aktuellen Formats in mm.
     ============================================================ */
  var DESIGNS = {};

  /* Das Wappen im Hintergrund — auf jedem Design GANZ sichtbar, nie
     angeschnitten, und so zurückgenommen, dass der Text vorn bleibt.
     Das Motiv sitzt in der Bilddatei nach rechts unten versetzt, darum
     -44% statt -50% für die optische Mitte. */
  function wappen(hoeheMm, obenProzent, deck, extra){
    return '<img class="wp" src="'+IMG.basis+IMG.wappen+'" alt="" style="height:'+mm(hoeheMm)+
      ';left:50%;top:'+obenProzent+'%;transform:translate(-50%,-50%);opacity:'+deck+
      (extra||'')+'">';
  }

  /* Platzfaktoren: mit Erklärbox wird der Kopf (Icon, Ring, Titel) etwas
     kleiner, damit der Satz in jedem Format in die Höhe passt. */
  function fIcon(cfg){ return cfg.sub ? (cfg.kat && cfg._quer ? .60 : .76) : 1; }
  function fTitel(cfg){ return cfg.sub ? (cfg._quer ? .74 : .84) : 1; }

  /* Erklärbox unter dem Titel — erscheint nur, wenn Text da ist.
     Ein Schild ohne Erklärung bleibt leer und ruhig. */
  function box(cfg, q, breit){
    if (!cfg.sub) return '';
    return '<div class="tfcz-box" style="padding:'+mm(q?9:7)+' '+mm(q?14:10)+
      ';max-width:'+(breit||(q?'76%':'86%'))+';font-size:'+mm(q?8:7)+'">'+
      esc(cfg.sub)+'</div>';
  }

  /* --- 1 · MITTE -------------------------------------------------
     Das Wappen liegt vollständig hinter dem Satz, Icon im Goldring,
     Titel, Erklärbox. Der Grundtyp.                                 */
  DESIGNS.mitte = function(cfg, m){
    var q = m.quer, k = cfg.kat;
    return ''+
    wappen(q?196:178, 54, .11)+
    wortmarke(false, q?15:14, m.padTop)+
    '<div class="mt-body" style="padding:'+mm(m.padTop+(q?28:32))+' '+mm(m.padX)+' '+mm(m.padBot+16)+'">'+
      '<div class="mt-kat" style="border-color:'+k.farbe+';color:'+k.farbe+';font-size:'+mm(q?6.6:5.8)+'">'+
        esc(k.label)+'</div>'+
      '<div class="mt-ring" style="width:'+mm((q?80:68)*fIcon(cfg))+';height:'+mm((q?80:68)*fIcon(cfg))+
        ';color:'+C.gold+'">'+icon(cfg.icon, (q?42:36)*fIcon(cfg), 1.45)+'</div>'+
      titel(cfg.titel, (q?36:25)*fTitel(cfg))+
      box(cfg, q)+
    '</div>';
  };

  /* --- 2 · SOCKEL ------------------------------------------------
     Das Wappen steht ganz in der unteren Hälfte, der Satz darüber.
     Unten schliesst ein Kategorieband ab.                           */
  DESIGNS.sockel = function(cfg, m){
    var q = m.quer, k = cfg.kat;
    return ''+
    wappen(q?162:150, 68, .13)+
    wortmarke(false, q?15:14, m.padTop)+
    '<div class="sk-body" style="padding:'+mm(m.padTop+(q?40:46))+' '+mm(m.padX)+' '+mm(m.padBot+(q?30:34))+'">'+
      '<div class="sk-ic" style="color:'+C.gold+'">'+icon(cfg.icon, (q?50:42)*fIcon(cfg), 1.4)+'</div>'+
      titel(cfg.titel, (q?38:26)*fTitel(cfg))+
      box(cfg, q)+
    '</div>'+
    '<div class="sk-band" style="bottom:'+mm(m.padBot-4)+';height:'+mm(q?17:18)+
      ';background:'+k.farbe+';color:'+k.text+';font-size:'+mm(q?7:6.4)+'">'+esc(k.label)+'</div>';
  };

  /* --- 3 · RAHMEN ------------------------------------------------
     Ein feiner Goldrahmen fasst das Blatt, das Wappen liegt ganz
     darin. Die Kategorie sitzt oben auf der Rahmenlinie.            */
  DESIGNS.rahmen = function(cfg, m){
    var q = m.quer, k = cfg.kat;
    return ''+
    wappen(q?178:162, 56, .10)+
    wortmarke(false, q?15:14, m.padTop)+
    '<div class="rh-rahmen" style="top:'+mm(m.padTop+(q?30:32))+';bottom:'+mm(m.padBot+10)+
      ';left:'+mm(m.padX-6)+';right:'+mm(m.padX-6)+'">'+
      '<span class="rh-kat" style="background:'+k.farbe+';color:'+k.text+';font-size:'+mm(q?6.4:5.8)+'">'+
        esc(k.label)+'</span>'+
    '</div>'+
    '<div class="rh-body" style="padding:'+mm(m.padTop+(q?46:50))+' '+mm(m.padX+10)+' '+mm(m.padBot+24)+'">'+
      '<div class="rh-ic" style="color:'+C.gold+'">'+icon(cfg.icon, (q?44:38)*fIcon(cfg), 1.4)+'</div>'+
      titel(cfg.titel, (q?34:23)*fTitel(cfg))+
      box(cfg, q, q?'58%':'82%')+
    '</div>';
  };

  /* --- 4 · KAPPE -------------------------------------------------
     Das Wappen sitzt ganz oben unter der Wortmarke, das Icon liegt
     darin. Titel und Erklärung stehen darunter.                     */
  DESIGNS.kappe = function(cfg, m){
    var q = m.quer, k = cfg.kat;
    return ''+
    wappen(q?118:106, 30, .17)+
    wortmarke(false, q?15:14, m.padTop)+
    '<div class="kp-ic" style="top:'+(q?'30':'30')+'%;color:'+C.gold+'">'+
      icon(cfg.icon, (q?44:38)*fIcon(cfg), 1.45)+'</div>'+
    '<div class="kp-body" style="padding:'+mm(m.padTop+(q?106:118))+' '+mm(m.padX)+' '+mm(m.padBot+18)+'">'+
      '<div class="kp-kat"><span style="background:'+k.farbe+'"></span>'+
        '<b style="color:'+k.farbe+';font-size:'+mm(q?6.6:5.8)+'">'+esc(k.label)+'</b>'+
        '<span style="background:'+k.farbe+'"></span></div>'+
      titel(cfg.titel, (q?38:26)*fTitel(cfg))+
      box(cfg, q)+
    '</div>';
  };

  /* --- 5 · FOKUS -------------------------------------------------
     Wie Mitte, aber das Wappen trägt die Kategoriefarbe und das Icon
     steht ohne Ring gross davor. Am direktesten.                    */
  DESIGNS.fokus = function(cfg, m){
    var q = m.quer, k = cfg.kat;
    return ''+
    '<div class="fk-schein" style="background:radial-gradient(closest-side,'+k.farbe+'2e,transparent 72%);'+
      'width:'+mm(q?250:215)+';height:'+mm(q?250:215)+'"></div>'+
    wappen(q?200:182, 55, .14)+
    wortmarke(false, q?15:14, m.padTop)+
    '<div class="fk-body" style="padding:'+mm(m.padTop+(q?30:34))+' '+mm(m.padX)+' '+mm(m.padBot+16)+'">'+
      '<div class="fk-ic" style="color:'+C.gold+'">'+icon(cfg.icon, (q?62:52)*fIcon(cfg), 1.35)+'</div>'+
      titel(cfg.titel, (q?38:26)*fTitel(cfg))+
      '<div class="fk-strich" style="background:'+k.farbe+'"></div>'+
      box(cfg, q)+
    '</div>';
  };

  function liste(cfg, q){
    if (!cfg.liste || !cfg.liste.length) return '';
    return '<div class="tfcz-liste" style="margin-top:'+mm(q?12:9)+';font-size:'+mm(q?8.5:6.6)+'">'+
      cfg.liste.map(function(z){
        return '<div class="tfcz-li"><span>'+esc(z[0])+'</span><span>'+esc(z[1])+'</span></div>';
      }).join('')+'</div>';
  }

  /* ============================================================
     Render
     ============================================================ */
  function render(el, cfg){
    cfg = cfg || {};
    var schluessel = cfg.format || 'a4';
    var f = FORMATE[schluessel] || FORMATE.a4;
    var klasse = schluessel.replace('q','');
    var an = cfg.anschnitt === false ? 0
           : (typeof cfg.anschnitt === 'number' ? cfg.anschnitt
             : (ANSCHNITT_JE_FORMAT[klasse] || ANSCHNITT));

    K = massstab(f);                     // ab hier rechnet mm() im Zielformat

    /* Ränder: der Design-Rand wächst mit dem Format mit, unterschreitet
       aber nie die Ösen-Freizone — sonst bohrt die Öse in den Text. */
    var m = {
      quer: f.quer,
      format: schluessel,
      k: K,
      padTop: f.quer ? 14 : 15,
      padBot: f.quer ? 12 : 14,
      padX:   Math.max(OESE/K, f.quer ? 26 : 24)   // in Design-Einheiten
    };
    cfg.kat = KAT[cfg.kategorie] || KAT.info;
    cfg.icon = cfg.icon || 'info';
    cfg._quer = f.quer;

    el.className = 'tfcz-schild d-' + (cfg.design||'mitte') + (f.quer?' quer':'');
    el.style.width  = abs(f.b + 2*an);
    el.style.height = abs(f.h + 2*an);
    el.setAttribute('data-format', schluessel);

    var bau = DESIGNS[cfg.design] || DESIGNS.mitte;
    el.innerHTML =
      '<div class="tfcz-blatt" style="inset:'+abs(an)+'">'+
        '<div class="tfcz-bl-top" style="height:'+mm(4)+'"></div>'+
        '<div class="tfcz-bl-bot" style="height:'+mm(4)+'"></div>'+
        bau(cfg, m)+
      '</div>'+
      (cfg.hilfen ? hilfen(f, an) : '');

    einpacken(el);
    if (el.isConnected) { fit(el); hoeheAnpassen(el); }
    else if (window.requestAnimationFrame)
      requestAnimationFrame(function(){ fit(el); hoeheAnpassen(el); });
    return el;
  }

  var SATZ_WAHL = '.mt-body,.sk-body,.rh-body,.kp-body,.fk-body';

  /* Der ganze Satz kommt in einen Wrapper — nur so lässt er sich als
     Block messen und im Notfall als Ganzes verkleinern. */
  function einpacken(el){
    var body = el.querySelector(SATZ_WAHL);
    if (!body || body.querySelector(':scope > .tfcz-satz')) return;
    var w = document.createElement('div');
    w.className = 'tfcz-satz';
    while (body.firstChild) w.appendChild(body.firstChild);
    body.appendChild(w);
  }

  /* Notbremse gegen Überlauf: passt der Satz nicht in die Blatthöhe,
     wird er als Ganzes proportional verkleinert. Damit kann im Studio
     beliebig viel Text eingegeben werden, ohne dass etwas aus dem
     Blatt läuft — die Gestaltung bleibt dabei erhalten. */
  function hoeheAnpassen(el){
    var body = el.querySelector(SATZ_WAHL); if (!body) return;
    var w = body.querySelector(':scope > .tfcz-satz'); if (!w) return;
    w.style.transform = '';
    var cs = getComputedStyle(body);
    var verfuegbar = body.clientHeight - parseFloat(cs.paddingTop) - parseFloat(cs.paddingBottom);
    var noetig = w.scrollHeight;
    if (verfuegbar > 0 && noetig > verfuegbar + 1){
      var z = Math.max(0.45, verfuegbar / noetig);
      w.style.transform = 'scale(' + z + ')';
    }
  }

  /* Auto-Fit: verkleinert den Titel so weit, bis jede Zeile in die
     verfügbare Breite passt. Damit kann im Design Studio beliebiger
     Text eingegeben werden, ohne dass ein Wort umbricht. */
  function fit(root){
    Array.prototype.forEach.call(root.querySelectorAll('h1.gross'), function(h){
      var start = (parseFloat(h.dataset.fs) || 24) * (parseFloat(h.dataset.k) || 1);
      var fs = start, minFs = start*0.40;
      var zl = h.querySelectorAll('.zl');
      h.style.fontSize = fs + 'mm';
      for (var i=0; i<48 && fs > minFs; i++){
        var breite = h.clientWidth, passt = true;
        for (var j=0; j<zl.length; j++) if (zl[j].scrollWidth > breite + 1) { passt = false; break; }
        if (passt) break;
        fs *= 0.945; h.style.fontSize = fs + 'mm';
      }
    });
  }

  /* Schnittkante + die vier Ösen-Freizonen sichtbar machen. */
  function hilfen(f, an){
    var h = '<div class="tfcz-hilfe">'+
      '<div class="tfcz-schnitt" style="inset:'+abs(an)+'"></div>';
    [['top','left'],['top','right'],['bottom','left'],['bottom','right']].forEach(function(p){
      var st = 'width:'+abs(OESE)+';height:'+abs(OESE)+';'+p[0]+':'+abs(an)+';'+p[1]+':'+abs(an);
      h += '<div class="tfcz-oese" style="'+st+'"><i style="'+p[0]+':'+abs(15-2.25)+';'+p[1]+':'+abs(15-2.25)+'"></i></div>';
    });
    return h + '</div>';
  }

  /* Druck-PDF: setzt die Seitengrösse exakt aufs Datenformat und druckt
     nur dieses eine Schild. Aus dem Browser-Druckdialog dann „Als PDF
     sichern", Ränder „keine", Hintergrundgrafiken „ein".
     Das Ergebnis ist ein Vektor-PDF: Text bleibt Text, Icons bleiben
     Pfade. Nur Wappen und Wortmarke sind heute noch Pixelbilder — für
     A2 und grösser gehören dort SVG-Fassungen hin. */
  function drucken(el){
    var k = el.getAttribute('data-format') || 'a4';
    var d = TFCZ.schild.datenformat(k); if (!d) return;
    var st = document.getElementById('tfcz-druckformat');
    if (!st){ st = document.createElement('style'); st.id = 'tfcz-druckformat';
              document.head.appendChild(st); }
    st.textContent =
      '@page{size:'+d.daten[0]+'mm '+d.daten[1]+'mm;margin:0}'+
      '@media print{body>*{display:none!important}'+
      '.tfcz-drucken{display:block!important;position:fixed!important;'+
      'top:0!important;left:0!important;transform:none!important;'+
      'box-shadow:none!important}}';
    var vorher = document.querySelector('.tfcz-drucken');
    if (vorher) vorher.classList.remove('tfcz-drucken');
    el.classList.add('tfcz-drucken');
    /* der Schild-Knoten muss beim Drucken direktes Kind von body sein */
    var platz = document.createComment('tfcz-platz');
    el.parentNode.insertBefore(platz, el);
    document.body.appendChild(el);
    window.print();
    platz.parentNode.insertBefore(el, platz);
    platz.parentNode.removeChild(platz);
    el.classList.remove('tfcz-drucken');
  }

  TFCZ.schild = {
    render: render,
    drucken: drucken,
    fit: fit,
    hoeheAnpassen: hoeheAnpassen,
    /* Ordner mit den Lucide-SVGs — im Design Studio einmal umbiegen.
       Alles, was nicht im eingebauten Satz steht, wird von hier geladen. */
    iconQuelle: '../../ocsav - tfcz_Web/assets/icons/lucide/',
    bilder: IMG,
    designs: Object.keys(DESIGNS),
    kategorien: KAT,
    icons: Object.keys(IC),
    formate: FORMATE,
    farben: C,
    druck: { anschnittJeFormat: ANSCHNITT_JE_FORMAT, oeseFrei: OESE,
             bohrung: 4.5, eckAbstand: 15 },
    /* Datenformat (Endformat + Anschnitt) für die Bestellung */
    datenformat: function(schluessel){
      var f = FORMATE[schluessel]; if (!f) return null;
      var an = ANSCHNITT_JE_FORMAT[schluessel.replace('q','')] || ANSCHNITT;
      return { end:[f.b, f.h], daten:[f.b+2*an, f.h+2*an], anschnitt:an };
    }
  };
})();
