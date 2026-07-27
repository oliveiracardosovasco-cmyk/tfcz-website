/* ============================================================
   TFCZ · BAUSTEIN: Formulare

   Ein Verhalten für alle Formulare: Felder rendern, Pflichtfelder prüfen,
   Mail bauen, „Mail geöffnet?"-Fallback zeigen, Text kopieren.

   Einbauen — die Seite behält ihr Markup, sagt nur, WELCHES Formular es ist:

     <form id="trForm" data-tfcz="form" data-form="training" novalidate>
       <div class="fgrid" id="fFields"></div>   <!-- Felder kommen vom Baustein -->
       …
     </form>
     <script src="system/content.js"></script>
     <script src="system/forms.js"></script>
     <script defer src="system/components/form.js"></script>

   Der Baustein nutzt die vorhandenen Klassen/IDs der Seite (.field / #fErr /
   #fEdit / #fDone / #doneOpen / #doneCopy / #fBack / #toast) — die Optik bleibt
   also exakt, wie sie ist. Additiv, kein CSS-Umbau.

   Felder + Mail-Texte stehen in system/forms.js, der Empfänger in
   system/content.js (TFCZ.content.mail) — nirgends im HTML.

   ── Backend (vorbereitet) ───────────────────────────────────
   Ist window.TFCZ_API gesetzt, wird die Anfrage zusätzlich gesendet:
       POST {API}/api/forms/<formId>   Body {formular, felder:{k:v}, betreff, text}
   Antwortet der Server nicht (oder fehlt er), bleibt der mailto-Weg — das
   Formular funktioniert also immer.
   ============================================================ */
(function () {
  if (window.__tfczForm) return;
  window.__tfczForm = true;

  function el(id) { return document.getElementById(id); }
  function mail() { return (window.TFCZ && TFCZ.content && TFCZ.content.mail) || 'info@tfcz.ch'; }

  /* ---------- Feld-CSS (Single Source): Wunschzeitfenster-Picker + Datumsfeld zähmen ---------- */
  function injectCSS() {
    if (document.getElementById('tfcz-form-css')) return;
    var css = [
      /* Wunschzeitfenster: Startzeit-Picker (kein natives Widget, Brand-Optik wie .field) */
      '.tfcz-tp{position:relative; width:100%}',
      '.tfcz-tp-btn{width:100%; display:flex; align-items:center; justify-content:space-between; gap:10px; font-family:var(--font); font-size:14.5px; font-weight:600; color:#fff; text-align:left; background:linear-gradient(155deg,rgba(17,34,51,.66),rgba(9,21,33,.5)); border:1px solid var(--card-brd); border-radius:var(--r-sm); padding:11px 13px; cursor:pointer; transition:border-color var(--t-fast),box-shadow var(--t-fast)}',
      '.tfcz-tp-btn.ph .tfcz-tp-txt{color:var(--ink-mut); font-weight:500}',
      '.tfcz-tp-txt{overflow:hidden; text-overflow:ellipsis; white-space:nowrap; min-width:0}',
      '.tfcz-tp-ch{width:16px; height:16px; flex:none; color:var(--ink-mut); transition:transform .25s ease}',
      '.tfcz-tp.open .tfcz-tp-ch{transform:rotate(180deg); color:var(--gold-lt)}',
      '.tfcz-tp-btn:focus-visible,.tfcz-tp.open .tfcz-tp-btn{border-color:var(--gold); outline:none; box-shadow:0 0 0 3px rgba(205,168,87,.18)}',
      '.field.err .tfcz-tp-btn{border-color:var(--red); box-shadow:0 0 0 3px rgba(218,41,41,.2)}',
      '.tfcz-tp-menu{position:absolute; top:calc(100% + 8px); left:0; right:0; z-index:80; display:none; border-radius:12px; border:1px solid var(--card-brd); border-top:2px solid var(--blue); border-bottom:2px solid var(--gold); background:linear-gradient(160deg,rgba(13,39,61,.97),rgba(8,24,38,.96)); box-shadow:0 12px 30px rgba(0,0,0,.45); overflow:hidden}',
      '.tfcz-tp.open .tfcz-tp-menu{display:block}',
      '.tfcz-tp-hint{font-size:11px; font-weight:800; letter-spacing:.02em; color:var(--ink-mut); padding:11px 13px 5px}',
      '.tfcz-tp-grid{display:grid; grid-template-columns:repeat(3,1fr); gap:6px; padding:6px 10px 12px; max-height:232px; overflow-y:auto; overflow-x:hidden}',
      '.tfcz-tp-opt{font-family:var(--font); color:#fff; background:rgba(255,255,255,.05); border:1px solid transparent; border-radius:8px; padding:8px 4px; cursor:pointer; text-align:center; line-height:1.15; transition:box-shadow var(--t-fast),background var(--t-fast)}',
      '.tfcz-tp-opt b{display:block; font-size:14px; font-weight:800}',
      '.tfcz-tp-opt i{display:block; font-style:normal; font-size:10.5px; font-weight:700; color:var(--gold-lt); margin-top:1px}',
      /* Hover = Brand-Rahmen (inset, kein Layout-Sprung); Auswahl = Gold; nie beide zugleich */
      '.tfcz-tp-opt:hover{border-color:transparent; box-shadow:inset 0 2px 0 var(--blue),inset 0 -2px 0 var(--gold)}',
      '.tfcz-tp-opt.on{border-color:var(--gold); background:rgba(205,168,87,.14)}',
      '.tfcz-tp-opt.on:hover{border-color:transparent}',
      /* Einheitliche Feldhöhe für ALLE einzeiligen Controls (Text/E-Mail/Tel/Zahl/Datum/Select/Zeit-Picker).
         Behebt, dass das native Datumsfeld (v. a. Safari/iOS) niedriger rendert als die anderen —
         und gibt nebenbei ein sauberes 44px-Tap-Ziel (mobil). */
      '.field input:not([type="checkbox"]):not([type="radio"]), .field select, .field .tfcz-tp-btn{min-height:44px}',
      /* Datumsfeld: native Chrome zähmen, damit es im einheitlichen .field-Stil bleibt (nicht ausbricht) */
      '.field input[type="date"]{-webkit-appearance:none; appearance:none; line-height:1.2}',
      '.field input[type="date"]::-webkit-date-and-time-value{text-align:left; margin:0; line-height:1.2}',
      '.field input[type="date"]::-webkit-datetime-edit{padding:0; color:#fff}',
      '.field input[type="date"]::-webkit-inner-spin-button,.field input[type="date"]::-webkit-clear-button{display:none; -webkit-appearance:none}',
      '.field input[type="date"]::-webkit-calendar-picker-indicator{margin:0; opacity:.75; cursor:pointer; filter:invert(1) brightness(1.4)}',
      '.field input[type="date"]::-webkit-calendar-picker-indicator:hover{opacity:1}'
    ].join('');
    var st = document.createElement('style');
    st.id = 'tfcz-form-css';
    st.textContent = css;
    document.head.appendChild(st);
  }

  /* ---------- Wunschzeitfenster-Picker: globale Delegation (übersteht Neu-Rendern) ---------- */
  function schliesseAlle(ausser) {
    [].forEach.call(document.querySelectorAll('.tfcz-tp.open'), function (tp) {
      if (tp !== ausser) {
        tp.classList.remove('open');
        var b = tp.querySelector('.tfcz-tp-btn'); if (b) b.setAttribute('aria-expanded', 'false');
      }
    });
  }
  function initPicker() {
    if (window.__tfczPicker) return;
    window.__tfczPicker = true;

    document.addEventListener('click', function (e) {
      var btn = e.target.closest('.tfcz-tp-btn');
      if (btn) {
        e.preventDefault();
        var tp = btn.closest('.tfcz-tp');
        var offen = tp.classList.contains('open');
        schliesseAlle(tp);
        tp.classList.toggle('open', !offen);
        btn.setAttribute('aria-expanded', offen ? 'false' : 'true');
        return;
      }
      var opt = e.target.closest('.tfcz-tp-opt');
      if (opt) {
        e.preventDefault();
        var tp2 = opt.closest('.tfcz-tp');
        var hid = tp2.querySelector('input[type="hidden"]');
        var txt = tp2.querySelector('.tfcz-tp-txt');
        var b2  = tp2.querySelector('.tfcz-tp-btn');
        [].forEach.call(tp2.querySelectorAll('.tfcz-tp-opt.on'), function (o) { o.classList.remove('on'); });
        opt.classList.add('on');
        if (hid) hid.value = opt.getAttribute('data-v') || '';
        if (txt) txt.textContent = opt.getAttribute('data-v') || '';
        if (b2) b2.classList.remove('ph');
        var fld = tp2.closest('.field'); if (fld) fld.classList.remove('err');
        tp2.classList.remove('open');
        if (b2) b2.setAttribute('aria-expanded', 'false');
        return;
      }
      /* Klick ausserhalb eines offenen Pickers → schliessen */
      if (!e.target.closest('.tfcz-tp')) schliesseAlle(null);
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' || e.keyCode === 27) schliesseAlle(null);
    });
  }

  /* Toast — eine Quelle fuer alle Seiten (jede Seite hat ein <div id="toast">).
     Wird auch ausserhalb der Formulare gebraucht (z. B. "Link kopiert"). */
  var tt;
  function toastZeigen(text) {
    var t = el('toast');
    if (!t) return;
    t.textContent = text;
    t.classList.add('on');
    clearTimeout(tt);
    tt = setTimeout(function () { t.classList.remove('on'); }, 1600);
  }

  /* ---------- Zeit-Helfer für das Wunschzeitfenster ---------- */
  function pad2(n) { return (n < 10 ? '0' : '') + n; }
  function hhmm(min) { return pad2(Math.floor(min / 60) % 24) + ':' + pad2(min % 60); }
  /* Startzeiten von f.from bis f.to (Minutenraster f.step); Ende = Start + f.dur. Wert = „Start – Ende". */
  function zeitOptionen(f) {
    function toMin(s) { var p = String(s || '').split(':'); return (+p[0] || 0) * 60 + (+p[1] || 0); }
    var von = toMin(f.from || '09:00'), bis = toMin(f.to || '22:00');
    var step = f.step || 30, dur = f.dur || 120, out = [];
    for (var m = von; m <= bis; m += step) {
      var s = hhmm(m), e = hhmm(m + dur), v = s + ' – ' + e;
      out.push('<button type="button" class="tfcz-tp-opt" data-v="' + v + '" role="option">' +
               '<b>' + s + '</b><i>bis ' + e + '</i></button>');
    }
    return out.join('');
  }
  var CHEV = '<svg class="tfcz-tp-ch" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 9l6 6 6-6"/></svg>';

  /* ---------- Feld-Markup (nutzt die Seiten-Klassen) ---------- */
  function feldHTML(f) {
    var id = 'f_' + f.k;
    var req = f.opt ? '' : ' <span class="req">*</span>';
    var reqA = f.opt ? '' : ' data-req="1"';
    var ph = f.ph || '';
    var inner;

    if (f.type === 'textarea') {
      inner = '<textarea id="' + id + '" name="' + f.k + '"' + reqA + ' placeholder="' + ph + '"></textarea>';
    } else if (f.type === 'select') {
      inner = '<select id="' + id + '" name="' + f.k + '"' + reqA + '>' +
              '<option value="" disabled selected hidden>Bitte wählen …</option>' +
              (f.options || []).map(function (o) { return '<option>' + o + '</option>'; }).join('') +
              '</select>';
    } else if (f.type === 'timerange') {
      /* Startzeit-Picker: Startzeit anklicken → +Dauer wird angezeigt (z. B. 13:30 → 13:30 – 15:30). */
      inner = '<div class="tfcz-tp"' + reqA + '>' +
                '<button type="button" class="tfcz-tp-btn ph" aria-haspopup="listbox" aria-expanded="false">' +
                  '<span class="tfcz-tp-txt">' + (ph || 'Startzeit wählen') + '</span>' + CHEV +
                '</button>' +
                '<input type="hidden" id="' + id + '" name="' + f.k + '">' +
                '<div class="tfcz-tp-menu" role="listbox">' +
                  '<div class="tfcz-tp-hint">Startzeit wählen — 2 Std. rechnen wir dazu</div>' +
                  '<div class="tfcz-tp-grid">' + zeitOptionen(f) + '</div>' +
                '</div>' +
              '</div>';
    } else {
      inner = '<input id="' + id + '" name="' + f.k + '" type="' + (f.type || 'text') + '"' + reqA + ' placeholder="' + ph + '">';
    }

    return '<div class="field' + (f.full || f.type === 'textarea' ? ' full' : '') + '" data-k="' + f.k + '">' +
             '<label for="' + id + '">' + f.label + req + '</label>' + inner +
           '</div>';
  }

  /* ---------- Ein Formular verdrahten ---------- */
  function bauen(form) {
    if (form.__tfczForm) return;
    form.__tfczForm = true;

    /* Welches Formular gilt, steht IMMER im aktuellen data-form-Attribut.
       Die Mitglied-Seite schaltet es beim Paketwechsel um — darum dynamisch lesen,
       nie in einer Variablen einfrieren. */
    function id()  { return form.getAttribute('data-form'); }
    function def() { return (window.TFCZ && TFCZ.forms && TFCZ.forms.def && TFCZ.forms.def[id()]) || null; }

    var grid = form.querySelector('[data-felder]') || form.querySelector('#fFields') || form.querySelector('.fgrid');
    if (!grid) return;

    /* Felder rendern — auch bei jedem Paketwechsel erneut aufrufbar */
    form.__tfczRender = function () {
      var D = def();
      if (!D) { console.warn('[TFCZ-FORM] Unbekanntes Formular:', id()); return; }
      grid.innerHTML = D.felder.map(feldHTML).join('');
    };
    form.__tfczRender();

    var fehler = el('fErr');
    var fEdit = el('fEdit'), fDone = el('fDone');
    var doneOpen = el('doneOpen'), doneCopy = el('doneCopy'), fBack = el('fBack');
    var letzte = null;
    function kopiere(txt) {
      if (navigator.clipboard && navigator.clipboard.writeText) return navigator.clipboard.writeText(txt);
      var ta = document.createElement('textarea');
      ta.value = txt; ta.style.position = 'fixed'; ta.style.opacity = '0';
      document.body.appendChild(ta); ta.select();
      try { document.execCommand('copy'); } catch (e) {}
      document.body.removeChild(ta);
      return Promise.resolve();
    }

    /* Prüfen + Mail bauen */
    function bauenMail() {
      var D = def();
      if (!D) return null;
      var ok = true, zeilen = [], namen = [], werte = {};
      var nameKeys = (TFCZ.forms.nameKeys || []);

      D.felder.forEach(function (f) {
        var e = el('f_' + f.k);
        var v = ((e && e.value) || '').trim();
        var wrap = e ? e.closest('.field') : null;

        if (!f.opt && !v) { ok = false; if (wrap) wrap.classList.add('err'); }
        else if (wrap) { wrap.classList.remove('err'); }

        if (v) {
          zeilen.push(f.label + ': ' + v);
          werte[f.k] = v;
          if (nameKeys.indexOf(f.k) >= 0) namen.push(v);
        } else if (f.leerText) {
          /* Optionales Feld leer, aber wichtig (z. B. Wunschzeit): trotzdem ausweisen,
             damit die Information nicht stillschweigend verschwindet. */
          zeilen.push(f.label + ': ' + f.leerText);
        }
      });

      if (!ok) { if (fehler) fehler.classList.add('on'); return null; }
      if (fehler) fehler.classList.remove('on');

      var who = namen.join(' ');
      var betreff = (typeof D.betreff === 'function') ? D.betreff(who) : (D.betreff || D.titel);
      /* Mitglied-Pakete: „Paket: …" als Kopfzeile, gemeinsamer Schlusssatz */
      var kopf = D.kopf || (D.paket ? 'Paket: ' + D.paket : '');
      var fuss = D.fuss || (D.paket ? (TFCZ.forms.mitgliedFuss || '') : '');
      var text = (kopf ? kopf + '\n————————————\n' : '') +
                 zeilen.join('\n') +
                 (fuss ? '\n————————————\n' + fuss : '');

      return { betreff: betreff, text: text, werte: werte };
    }

    function mailtoURL(m) {
      return 'mailto:' + mail() + '?subject=' + encodeURIComponent(m.betreff) + '&body=' + encodeURIComponent(m.text);
    }

    /* Optional an den Server melden — der mailto-Weg läuft unabhängig weiter */
    function anServer(m) {
      var A = String(window.TFCZ_API || '').replace(/\/+$/, '');
      if (!A) return;
      try {
        fetch(A + '/api/forms/' + encodeURIComponent(id()), {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ formular: id(), felder: m.werte, betreff: m.betreff, text: m.text })
        }).catch(function () {});
      } catch (e) {}
    }

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var m = bauenMail();
      if (!m) return;
      letzte = m;
      anServer(m);

      if (doneOpen) doneOpen.setAttribute('href', mailtoURL(m));
      window.location.href = mailtoURL(m);   /* Mailprogramm anstossen (öffnet nicht auf jedem Gerät) */

      if (fEdit && fDone) {
        fEdit.hidden = true;
        fDone.hidden = false;
        var box = form.closest('.formbox');
        if (box) { try { box.scrollIntoView({ behavior: 'smooth', block: 'center' }); } catch (err) {} }
      }
    });

    if (doneCopy) doneCopy.addEventListener('click', function () {
      if (!letzte) return;
      kopiere('An: ' + mail() + '\nBetreff: ' + letzte.betreff + '\n\n' + letzte.text)
        .then(function () { toastZeigen('Text kopiert — an ' + mail() + ' senden'); });
    });
    if (fBack) fBack.addEventListener('click', function () {
      if (fDone) fDone.hidden = true;
      if (fEdit) fEdit.hidden = false;
    });
  }

  function init() {
    injectCSS();
    initPicker();
    [].forEach.call(document.querySelectorAll('form[data-tfcz="form"]'), bauen);
  }

  /* Paketwechsel (mitglied.html): NUR die Felder neu rendern.
     Die Verdrahtung (submit, kopieren, zurück) bleibt bestehen — sonst hingen die
     Listener mehrfach am selben Formular. */
  function neu(form) {
    if (!form) return;
    if (form.__tfczRender) form.__tfczRender();
    else bauen(form);
  }

  window.TFCZ = window.TFCZ || {};
  TFCZ.formUI = { init: init, neu: neu, feldHTML: feldHTML };
  TFCZ.toast = toastZeigen;   /* auch fuer Meldungen ausserhalb von Formularen */

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
