/* ===== TFCZ · Register der Präsentationen =====
   EINZIGE Quelle für den Reiter „Präsentationen" im Design Studio.
   Neues Deck: HTML-Datei nach `praesentationen/` legen und hier EINEN Eintrag ergänzen.
   Pfade sind relativ zum Web-Root (dort liegt design-studio.html), damit sie
   auch über file:// funktionieren — kein fetch, keine JSON-Ladefehler.

   Felder
     id      kebab-case, eindeutig
     titel   wie im Studio angezeigt
     anlass  Gruppierung in der Übersicht (Turnier · Verein · Sponsoring …)
     datum   TT.MM.JJJJ (leer lassen, wenn zeitlos)
     datei   Pfad zum Deck (liefert auch die Vorschau: die erste Folie, live gerendert)
     folien  Anzahl Folien (nur Startwert — das Studio liest sie aus dem Deck nach)
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
  }
];
