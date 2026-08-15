/* ===== TFCZ · Register der Präsentationen =====
   EINZIGE Quelle für den Reiter „Präsentationen" im Design Studio.
   Neues Deck: HTML-Datei nach `praesentationen/` legen und hier EINEN Eintrag ergänzen.
   Pfade sind relativ zum Web-Root (dort liegt design-studio.html), damit sie
   auch über file:// funktionieren — kein fetch, keine JSON-Ladefehler.
   Die Reihenfolge hier ist egal: das Studio sortiert nach Datum (neueste zuerst)
   und bietet Suche, Anlass- und Jahr-Filter an. `anlass` und `datum` sind also
   nicht nur Anzeige, sie speisen die Filter — bitte sauber ausfüllen.

   Felder
     id      kebab-case, eindeutig
     titel   wie im Studio angezeigt
     anlass  Gruppierung in der Übersicht (Turnier · Verein · Sponsoring …)
     datum   TT.MM.JJJJ (leer lassen, wenn zeitlos — sortiert dann ans Ende)
     datei   Pfad zum Deck
     folien  Anzahl Folien
     dauer   Richtwert für den Auto-Lauf
     text    ein Satz, worum es geht
*/
window.TFCZ_PRAESI = [
  {
    id: 'sts-zuerich-2026-samstag',
    titel: 'STS Zürich 2026 — Ansage Samstag',
    anlass: 'Turnier',
    datum: '15.08.2026',
    datei: 'praesentationen/sts-zuerich-2026-samstag.html',
    folien: 14,
    dauer: '≈ 3 Min',
    text: 'Ansage am Turniermorgen: Disziplinen & Zeiten, Coral, Tempo, Stream auf Tisch 1+10, Hausregeln, Hitze, Bar, Parkieren, Preisgeld.'
  },
  {
    id: 'zuerich-open-2-eroeffnung',
    titel: 'Zürich Open #2 — Eröffnung',
    anlass: 'Turnier',
    datum: '19.07.2026',
    datei: 'praesentationen/zuerich-open-2-eroeffnung.html',
    folien: 13,
    dauer: '≈ 3 Min',
    text: 'Eröffnungsrede: 31 Teams, Top-Teams je Tableau, Format & Modus, Verhaltensregeln, Verpflegung, Livestream, Crazy DYP als Side-Event.'
  }
];
