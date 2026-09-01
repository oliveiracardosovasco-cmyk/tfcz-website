# Design Studio · Section „Schilder"

Turnier- und Clubschilder von A5 bis A0, als Vektor-PDF für die Druckerei.
Zu finden über **Motiv wählen → Schilder**.

## Was dazugekommen ist

| Datei | Zweck |
|---|---|
| `system/schild-renderer.js` | **zeichnet das Schild** — Formate, Designs, Druckmasse, Auto-Fit |
| `system/schild.css` | die Stile dazu |
| `system/studio-schilder.js` | Motiv, Formate und Bedienfeld im Studio |
| `system/studio-schilder.css` | die Stile des Bedienfelds |

Die Assets waren schon da: `assets/img/pattern.svg`, `logo-horizontal-white.svg`,
die Lucide-Icons und `lucide-index.json`. Nichts wurde doppelt abgelegt.

In `design-studio.html` sind **vier Zeilen** dazugekommen — drei im `<head>`
(Z. 20–22) und eine vor `</body>` (Z. 8282). **Keine bestehende Zeile wurde
geändert.** `studio-schilder.js` ergänzt die Datenobjekte (`FORMATS`, `DEF`,
`TPLNAME`, `READY`, `MEDNM`, `SERIEN`) und legt sich von aussen um sieben
Funktionen (`rebuild`, `refreshSidebar`, `fmtsFor`, `capApplicableFormats`,
`medOf`, `catOf`, `navGo`). Nimmt man das eine Script-Tag heraus, ist das
Studio exakt wie vorher. Stand davor: `_snapshots/40-vor-schilder/`.

## Bedienung

Das Bedienfeld sitzt rechts unter **Texte** — dort, wo bei einem Schild sonst
„keine freien Textfelder" stünde: Design (Mitte · Sockel · Rahmen · Kappe ·
Fokus) · Kategorie · Titel · Erklärung (leer lassen, wenn das Schild nur eine
Sache sagt) · Icon · Druckhilfen · Format · Druckmasse · PDF.

**Icon-Suche auf Deutsch:** „rauch" findet `cigarette-off`, „park" findet
`circle-parking`, „pfeil" findet die Pfeile. Die Brücke steht in
`studio-schilder.js` im Objekt `DE` — fehlt ein Wort, kommt es dort dazu.
Dahinter liegen alle 1750 Lucide-Icons.

**Format:** im Bedienfeld, nicht in der Kopfleiste — zwölf Grössen passen dort
nicht hin. Die Kopfleiste zeigt die gewählte Ausgabe.

## Ausgabe

- **PDF für die Druckerei** — der blaue Knopf. Setzt die Seitengrösse exakt
  aufs Datenformat. Im Druckdialog: Ziel „Als PDF sichern", Ränder „keine",
  Hintergrundgrafiken „ein". Vollständig vektoriell, in jedem Format scharf.
- **PNG** — der bestehende Download des Studios, für Vorschau und Social.

## Beim Weiterbauen

Ein neues Design entsteht in `system/schild-renderer.js` (`DESIGNS.name = …`)
plus einem Block `.d-name` in `system/schild.css`; im Studio taucht es von
allein auf. Die eine Regel dabei: **`mm()` für alles Gestaltete, `abs()` nur
für Anschnitt und Ösen** — sonst geht das Schild in A0 nicht mehr auf.

Druckdaten, Formattabelle und der Hintergrund stehen in
`../Print-Social/Schilder/DRUCK-UND-STUDIO.md`.
