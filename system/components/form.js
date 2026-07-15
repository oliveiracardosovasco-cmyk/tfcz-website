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
