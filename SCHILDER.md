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
| `system/icon-picker.js` + `.css` | **Icon-Bibliothek** — eigener Baustein, überall anbindbar |

Die Assets waren schon da: `assets/img/pattern.svg`, `logo-horizontal-white.svg`,
die Lucide-Icons und `lucide-index.json`. Nichts wurde doppelt abgelegt.

In `design-studio.html` sind **sechs Zeilen** dazugekommen — fünf im `<head>`
(Z. 20–25) und eine vor `</body>` (Z. 8285). **Keine bestehende Zeile wurde
geändert.** `studio-schilder.js` ergänzt die Datenobjekte (`FORMATS`, `DEF`,
`TPLNAME`, `READY`, `MEDNM`, `SERIEN`) und legt sich von aussen um sieben
Funktionen (`rebuild`, `refreshSidebar`, `fmtsFor`, `capApplicableFormats`,
`medOf`, `catOf`, `navGo`). Nimmt man das eine Script-Tag heraus, ist das
Studio exakt wie vorher. Stand davor: `_snapshots/40-vor-schilder/`.

## Bedienung

Ein Schild besteht aus **sechs Ebenen** — Wortmarke, Wappen, Kategorie, Icon,
Titel, Erklärung. Sie liegen als echte Objekte im Datensatz, deshalb greift
die gewohnte Studio-Bedienung:

- **Texte** — Titel und Erklärung stehen im Reiter *Texte*, wie bei jedem
  anderen Motiv. Tippen ändert sofort.
- **Ebenen** — alle sechs stehen im Reiter *Ebenen* und lassen sich einzeln
  ausschalten. Wappen weg, Kategorie weg, nur Icon und Titel: alles möglich.
- **Bedienfeld** (rechts unter *Texte*) — Design, Kategorie, Icon,
  Druckhilfen, Akzentfarbe, Grössen für Icon, Titel und Erklärung, Format,
  Druckmasse und der PDF-Knopf.

Was bewusst **nicht** geht: Elemente frei verschieben. Die Anordnung bleibt
automatisch — nur so geht dasselbe Schild in A5 wie in A0 auf und der Titel
passt sich selbst ein. Wenn das später doch gebraucht wird, wäre der Weg ein
Schalter „frei bewegen" je Element, der genau dieses eine aus der Automatik
löst.

**Die Brand-Line ist geschützt:** blau oben, gold unten sind fest verdrahtet,
nicht über die Tokens. Die Akzentfarbe färbt Icon, Ring und Rahmen — die
Linien nie.

**Icon-Bibliothek:** Klick aufs Icon-Feld öffnet einen Wähler über alle 1750
Lucide-Icons — mit Suchfeld, sieben thematischen Gruppen (Wege & Verkehr, Haus
& Raum, Verbot & Warnung, Essen & Trinken, Sport & Turnier, Technik & Medien,
Zeichen & Symbole) und einem Raster, in dem man die Icons sieht statt nur
Namen zu lesen. **Die Suche versteht Deutsch:** „rauch" findet `cigarette-off`,
„park" den Parkplatz, „pokal" den Trophy. Die Wortbrücke steht in
`icon-picker.js` im Objekt `DE`, die Gruppen darunter in `GRUPPEN` — beides
lässt sich in einer Zeile erweitern.

Der Wähler ist ein **eigenständiger Baustein**: er weiss nichts über Schilder
und lässt sich mit drei Zeilen überall anbinden —

```js
TFCZ.iconWahl.oeffnen({ wert:'trophy', onWahl:function(name){ … } });
```

**Auf jedem Flyer:** die Bibliothek hängt nicht nur an den Schildern. Im Block
*Hinzufügen* gibt es den Knopf **Icon** — er setzt eine Icon-Ebene auf den
Flyer und öffnet gleich die Bibliothek. Danach lässt sie sich verschieben,
drehen, sperren wie jede andere Ebene; Farbe und Grösse stehen im Inspector.
Dasselbe Feld erscheint überall, wo eine Brand-Komponente ein Icon führt
(Icon, Fakten-Liste …): statt einer Auswahlliste ein Knopf mit Vorschau.

Der Renderer `system/brand-components.js` trägt nur die häufigsten Icons als
Markup bei sich — er muss auch ohne Studio zeichnen können (Brand Guide).
Alles Übrige holt `system/studio-icons.js` nach: die Komponenten melden über
`iconsAus()`, welche Icons sie brauchen, fehlende landen in
`window.TFCZ_ICON_EXTRA`, und es wird **einmal** neu gezeichnet. Darum bleiben
1750 Pfade aus der Datei draussen und stehen trotzdem alle zur Verfügung.

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
