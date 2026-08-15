/* ===== TFCZ · Prompt für neue Präsentationen =====
   Der Text, den der Knopf „Prompt kopieren" im Design-Studio-Reiter
   „Präsentationen" in die Zwischenablage legt. Hier pflegen, nicht im
   Studio-Code — so kann der Prompt wachsen, ohne dass jemand design-studio.html
   anfassen muss.

   Platzhalter stehen in eckigen Klammern und werden vor dem Absenden ersetzt.
   Backticks im Text vermeiden (das ist ein Template-String). */
window.TFCZ_PRAESI_PROMPT =
`Du baust eine Präsentation für den Tischfussballclub Zürich (TFCZ) als
eigenständige HTML-Datei zum Durchklicken am Beamer.

═══ VERBINDLICHE QUELLE — ZUERST LESEN ═══
TFCZ Brand Guide, Sektion 18b „Turnier-Präsentationen & Tagesablauf":
https://tfcz.ch/brandguide.html#turnierpresi

Dort stehen Format, Technik, die Standard-Dramaturgie und die Hausregeln, die an
jedem Turnier gelten. Lies die Sektion, BEVOR du eine Zeile schreibst, und halte
dich daran. Wenn etwas in diesem Prompt dem Brand Guide widerspricht, gilt der
Brand Guide. Farben, Schrift und Bausteine kommen aus dem Brand Guide, nie aus
dem Gedächtnis und nie geraten.

═══ AUFTRAG — BITTE AUSFÜLLEN ═══
Anlass:            [Turnier-Ansage am Morgen / Vereinsanlass / Sponsoring-Termin / …]
Titel:             [z. B. „STS Zürich 2026 — Ansage Samstag"]
Datum:             [TT.MM.JJJJ]
Wer präsentiert:   [Vorname] — die Sprech-Notizen werden für DIESE Person geschrieben
Dauer:             [z. B. 3 Minuten]
Publikum:          [z. B. 120 Spielerinnen und Spieler, stehen verteilt in der Halle]
Das muss hängen bleiben:
                   [3–5 Punkte, das Wichtigste zuerst]
Zahlen & Fakten:   [hier eintragen — oder: „steht im beigelegten Leitfaden Turniertag"]
Fotos:             [welches Ereignis, z. B. „nur Fotos von Zürich Open 1 und 2"]
Besonderes heute:  [z. B. Hitze, Side-Event, Baustelle, geänderte WC-Situation]

═══ WOHER DER INHALT KOMMT ═══
• Bei Turnieren ist der „Leitfaden Turniertag / Organisationshandbuch" die Quelle —
  nicht die Ausschreibung und nicht das letzte Deck. Liegt er nicht bei: anfordern,
  bevor du baust.
• Drei Angaben wandern erfahrungsgemäss bis zum Turniermorgen und müssen kurz vorher
  gegengeprüft werden: welche Tische gestreamt werden, die Essens-Bestellzeiten und
  die WC-Situation.
• Vereinszahlen nie schätzen.
• Nicht jede Tagesangabe ist eine Dauerregel — im Zweifel nachfragen, ob etwas immer
  gilt oder nur an diesem Anlass.

═══ HARTE VORGABEN (Details stehen im Brand Guide) ═══
• Eine self-contained HTML-Datei. Fotos werden REFERENZIERT
  (../assets/fotos/galerie/full/<id>.webp), nicht eingebettet.
• Dunkler Navy-Verlauf, blaue Linie oben und goldene unten am Viewport.
• SEHR grosse Schrift und grosse Lucide-Icons — es muss aus der Halle lesbar sein.
  Höchstens 3 Karten pro Folie. Stichwörter statt Sätze. Keine Emojis.
• Nur ein Rot (#da2929). Kein Wappen oben links.
• Fotos nur mit mehreren Personen und passend zum Anlass.
• Jede Folie bekommt eine ausformulierte Sprech-Notiz (data-note) — ganze Sätze,
  so wie die Person sie vorliest.
• Steuerung: Klick vorwärts, linker Rand zurück, A = Auto-Lauf, L = Auto-Loop,
  N = Notizen, F = Vollbild. Zusätzlich muss ?preview=1 funktionieren.
• Personen nur mit Vornamen. Geldbeträge als 400.– schreiben.
• Der Ort heisst immer „Zürich".

═══ SO WIRD GELIEFERT ═══
1. Datei nach praesentationen/<kebab-case-id>.html
2. Eintrag in praesentationen/index.js ergänzen
   (id, titel, anlass, datum, datei, folien, dauer, text)
3. node _tools/praesi-cover.mjs laufen lassen — rendert das Vorschaubild
   aus der ersten Folie
4. Prüfen: keine JS-Fehler, nichts abgeschnitten auf 1920 / 1440 / 1280,
   Auto-Lauf-Summe passt zur gewünschten Dauer

Danach erscheint die Präsentation im Design Studio unter „Präsentationen"
und lässt sich von dort starten.`;
