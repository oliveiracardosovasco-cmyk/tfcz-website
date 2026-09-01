/* NUR VORSCHAU — Feldliste für das Interesse-Formular «nächstes Semester».
   Wird gelöscht, sobald eine Fassung gewählt ist; dann wandert der Block nach system/forms.js. */
(function () {
  if (!window.TFCZ || !TFCZ.forms || !TFCZ.forms.def) return;
  var F = TFCZ.forms.felder;
  TFCZ.forms.def['training-interesse'] = {
    titel: 'Training mit Philipp — Interesse am nächsten Semester',
    betreff: function (who) { return 'TFCZ · Training mit Philipp — Interesse nächstes Semester — ' + (who || 'Interessent'); },
    kopf: 'Interesse am nächsten Semester (KEINE Anmeldung)',
    fuss: 'Bitte informiert mich, sobald die Daten und die Anmeldung fürs nächste Semester stehen.\nGesendet über das Formular auf tfcz.ch',
    felder: [
      F.vorname, F.nachname, F.email,
      { k:'tel', label:'Mobile-Nr.', type:'tel', opt:true, ph:'optional' },
      { k:'mitglied', label:'Bist du TFCZ-Mitglied?', type:'select', options:['Ja','Nein','Noch nicht'] },
      { k:'tag', label:'Welcher Tag passt dir eher?', type:'select', options:['Dienstag','Mittwoch','Beides geht','Weiss ich noch nicht'] },
      { k:'msg', label:'Nachricht', type:'textarea', opt:true, full:true, ph:'Level, Fragen, Wünsche?' }
    ]
  };
})();
