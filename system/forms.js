/* ============================================================
   TFCZ · FORMULARE — die EINE Quelle für Felder und Mail-Texte.

   Vorher stand dieselbe Logik VIER Mal im HTML (Mitglied, Training, Firmenevents,
   Medien): Feld-Rendering, Validierung, mailto-Bau, „Mail geöffnet?"-Fallback —
   jedes Mal leicht anders. Ab jetzt: Felder hier, Verhalten im Baustein.

   Einbinden (nach system/content.js):
       <script src="system/forms.js"></script>
       <script defer src="system/components/form.js"></script>

   Feld-Eigenschaften:
     k        Schlüssel (wird zu id="f_<k>")
     label    Beschriftung
     type     text | email | tel | number | date | select | textarea
     opt      true = optional (sonst Pflichtfeld)
     leerText Wird das optionale Feld leer gelassen, steht DIESER Text im Mail-Text
              (statt die Zeile still wegzulassen — so geht nichts verloren)
     ph       Platzhalter
     full     über die ganze Breite
     options  nur bei select

   Empfänger kommt aus system/content.js (TFCZ.content.mail) — nicht hier.
   ============================================================ */
window.TFCZ = window.TFCZ || {};

(function () {
  /* Wiederkehrende Felder — einmal definiert, überall gleich */
  var F = {
    vorname:  { k:'vorname',  label:'Vorname',   type:'text' },
    nachname: { k:'nachname', label:'Nachname',  type:'text' },
    email:    { k:'email',    label:'E-Mail',    type:'email', ph:'name@mail.ch' },
    tel:      { k:'tel',      label:'Telefon',   type:'tel',   ph:'+41 …' },
    msg:      { k:'msg',      label:'Nachricht', type:'textarea', opt:true, full:true, ph:'Fragen, Wünsche?' }
  };

  TFCZ.forms = {
    felder: F,

    /* ---- Formular-Definitionen ---- */
    def: {
      /* ---- Mitgliedschaft: fünf Pakete, je eigene Felder.
             Die Seite (mitglied.html) schaltet über data-form="mitglied-<key>" um. ---- */
      'mitglied-schnuppern': {
        titel: 'Schnuppern — erster Abend gratis',
        paket: 'Schnuppern (Gratis, dann CHF 5 / Eintritt)',
        betreff: function (who) { return 'TFCZ · Schnuppern — ' + (who || 'Interessent'); },
        felder: [
          F.vorname, F.nachname, F.email,
          { k:'tel', label:'Telefon', type:'tel', opt:true, ph:'optional' },
          { k:'wann', label:'Wann möchtest du kommen?', type:'text', ph:'z. B. Dienstag 15. Juli' },
          F.msg
        ]
      },
      'mitglied-aktiv': {
        titel: 'Aktivmitgliedschaft',
        paket: 'Aktivmitglied (CHF 200 / Jahr)',
        betreff: function (who) { return 'TFCZ · Aktivmitglied — ' + (who || 'Interessent'); },
        felder: [
          F.vorname, F.nachname, F.email,
          { k:'tel', label:'Telefon', type:'tel', opt:true, ph:'optional' },
          { k:'geburt', label:'Geburtsdatum', type:'date', opt:true },
          { k:'level', label:'Dein Level', type:'select', options:['Neu / Anfänger','Gelegentlich','Ambitioniert','Wettkampf'] },
          F.msg
        ]
      },
      'mitglied-key': {
        titel: 'Key-Player-Mitgliedschaft',
        paket: 'Key Player (CHF 250 / Jahr)',
        betreff: function (who) { return 'TFCZ · Key Player — ' + (who || 'Interessent'); },
        felder: [
          F.vorname, F.nachname, F.email,
          { k:'tel', label:'Telefon', type:'tel', opt:true, ph:'optional' },
          { k:'level', label:'Dein Level', type:'select', options:['Gelegentlich','Ambitioniert','Wettkampf'] },
          { k:'motivation', label:'Warum Key Player?', type:'textarea', full:true, ph:'Was möchtest du mitgestalten / beitragen?' }
        ]
      },
      'mitglied-goenner': {
        titel: 'Gönner / Fördermitglied',
        paket: 'Gönner (Betrag frei wählbar)',
        betreff: function (who) { return 'TFCZ · Gönner — ' + (who || 'Interessent'); },
        felder: [
          F.vorname, F.nachname,
          { k:'firma', label:'Firma', type:'text', opt:true, ph:'optional' },
          F.email,
          { k:'tel', label:'Telefon', type:'tel', opt:true, ph:'optional' },
          { k:'betrag', label:'Betrag (CHF)', type:'number', ph:'z. B. 100' },
          { k:'turnus', label:'Turnus', type:'select', options:['Jährlich','Einmalig'] },
          F.msg
        ]
      },
      'mitglied-sponsor': {
        titel: 'Sponsoring-Anfrage',
        paket: 'Sponsor (individuell)',
        betreff: function (who) { return 'TFCZ · Sponsoring — ' + (who || 'Firma'); },
        felder: [
          { k:'firma', label:'Firma', type:'text' },
          { k:'person', label:'Ansprechperson', type:'text' },
          F.email,
          { k:'tel', label:'Telefon', type:'tel', opt:true, ph:'optional' },
          { k:'art', label:'Art des Sponsorings', type:'select', options:['Tisch-Sponsoring','Event / Turnier','Trikot / Kleidung','Hauptsponsor','Sonstiges'] },
          { k:'budget', label:'Budget (optional)', type:'text', opt:true, ph:'optional' },
          F.msg
        ]
      },

      'training': {
        titel: 'Training mit Philipp — Voranmeldung',
        betreff: function (who) { return 'TFCZ · Training mit Philipp — Voranmeldung — ' + (who || 'Interessent'); },
        kopf: 'Voranmeldung «Training mit Philipp» (unverbindlich)',
        /* Der KUNDE schreibt an den Verein — der Schlusssatz muss aus SEINER Sicht stehen. */
        fuss: 'Bitte bestätigt mir den Platz, sobald die Termine feststehen.\nGesendet über das Formular auf tfcz.ch',
        felder: [
          F.vorname, F.nachname, F.email,
          { k:'tel', label:'Mobile-Nr.', type:'tel', ph:'+41 …' },
          { k:'mitglied', label:'Bist du TFCZ-Mitglied?', type:'select', options:['Ja','Nein'] },
          { k:'adresse', label:'Adresse (nur Nicht-Mitglieder)', type:'text', opt:true, full:true, ph:'Strasse, PLZ Ort' },
          { k:'tag', label:'Welcher Tag passt dir?', type:'select', options:['Dienstag','Mittwoch','Dienstag oder Mittwoch','Noch offen'] },
          { k:'semester', label:'Für welches Semester?', type:'select', options:['Herbstsemester 2026','Frühlingssemester 2027','Sobald möglich'] },
          { k:'msg', label:'Nachricht', type:'textarea', opt:true, full:true, ph:'Fragen, Level, Wünsche?' }
        ]
      },

      'firmenevent': {
        titel: 'Firmenevent-Anfrage',
        betreff: function (who) { return 'TFCZ · Firmenevent-Anfrage — ' + (who || 'Team'); },
        kopf: 'Anfrage Firmenevent',
        /* Absender ist der KUNDE, nicht der Verein — darum „bitte meldet euch", nicht „wir melden uns". */
        fuss: 'Bitte meldet euch mit Verfügbarkeit und Ablauf.\nGesendet über das Formular auf tfcz.ch',
        felder: [
          { k:'firma', label:'Firma / Organisation', type:'text' },
          { k:'person', label:'Ansprechperson', type:'text' },
          { k:'email', label:'E-Mail', type:'email', ph:'name@firma.ch' },
          { k:'tel', label:'Telefon', type:'tel', opt:true, ph:'optional' },
          { k:'anzahl', label:'Anzahl Personen (ca.)', type:'number', ph:'z. B. 16' },
          { k:'datum', label:'Wunschdatum', type:'text', ph:'aus Kalender oder z. B. Do 12. Nov' },
          { k:'zeit', label:'Wunschzeit', type:'text', opt:true, ph:'z. B. 18:00–20:00', leerText:'noch offen' },
          { k:'msg', label:'Nachricht', type:'textarea', opt:true, full:true, ph:'Anlass, Wünsche, Fragen?' }
        ]
      },

      'medien': {
        titel: 'Medienanfrage',
        betreff: function (who) { return 'TFCZ · Medienanfrage — ' + (who || 'Presse'); },
        kopf: 'Medienanfrage',
        fuss: 'Bitte meldet euch so schnell wie möglich.\nGesendet über das Formular auf tfcz.ch',
        felder: [
          { k:'name', label:'Name', type:'text' },
          { k:'medium', label:'Medium / Redaktion', type:'text', ph:'Zeitung, Blog, Sender …' },
          { k:'email', label:'E-Mail', type:'email', ph:'name@medium.ch' },
          { k:'tel', label:'Telefon', type:'tel', opt:true, ph:'optional' },
          { k:'anliegen', label:'Anliegen', type:'select', options:['Interview / O-Ton','Bildmaterial / Fotos','Logo / Verwendung','Akkreditierung Event','Sonstiges'] },
          { k:'frist', label:'Bis wann?', type:'text', opt:true, ph:'Deadline' },
          { k:'msg', label:'Nachricht', type:'textarea', opt:true, full:true, ph:'Worum geht es?' }
        ]
      }
    },

    /* Alle Mitglied-Pakete teilen Kopf- und Schlusszeile (Absender = Interessent) */
    mitgliedFuss: 'Bitte meldet euch mit den nächsten Schritten.\nGesendet über das Formular auf tfcz.ch',

    /* Welche Feld-Schlüssel bilden den Absender-Namen (für den Betreff) */
    nameKeys: ['vorname','nachname','name','firma','person']
  };
})();
