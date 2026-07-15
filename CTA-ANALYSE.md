# CTA / Button-Analyse — Website TFCZ (ocsav)

**Stand:** 15.07.2026 · **Zweck:** Grundlage für die Entscheidung, wie wir die Buttons
vereinheitlichen. **Kein Umbau — nur Bestandsaufnahme + Vorschlag.** Alle Zahlen sind im
Code gemessen (`grep` über die 10 Live-Seiten + Design Studio + Brand Guide), nicht geschätzt.

---

## 1. Das Kernproblem in einem Satz

Es gibt **~30 verschiedene Button-Klassen**, und die Basis-Klasse `.btn` wird **nirgends zentral
definiert** — **0 Regeln in `system/`**. Stattdessen hat **jede Seite ihre eigene `.btn`-Kopie
inline** im `<style>` (index 6×, training 6×, über-uns 6× …).

**Folge — und die Antwort auf deine Frage:**
Wenn du heute in der Brand Guide den Radius eines Buttons änderst, ändert sich auf den anderen
9 Seiten **nichts**. Jede Seite trägt ihre eigene Definition. Sogar dieselbe `.btn-gold` läuft
schon auseinander: Training/Firmenevents geben ihr `border-radius:var(--r-pill)`, die übrigen
Seiten gar keine eigene Regel. `system/cta.js` setzt heute nur **Ziel (href) + Text**, **nicht
den Stil**.

**Das Ziel, das du willst:** Radius/Padding/Font **einmal** an einer Stelle ändern → **alle
Buttons auf allen Seiten** ändern sich mit, **der Text im HTML bleibt unberührt**. Das geht nur,
wenn der Button-Stil **einmal** in einem Baustein steht und alle Seiten dieselbe Klasse benutzen.

---

## 2. Was heute existiert (gemessen)

### 2a. Öffentliche Website — echte CTA-Typen

| Klasse | Vorkommen | Seiten | Was es ist |
|---|---|---|---|
| `.btn` | **114×** | alle | Basis-Klasse (Radius, Padding, Font, Pfeil) — inline je Seite definiert |
| `.btn-gold` | 10× | index, firmenevents, geschichte, training, über-uns, BG | Conversion / Lead (gold gefüllt) |
| `.btn-ghost` | 17× | 8 Seiten | Navigation / „mehr erfahren" (Outline) |
| `.btn-blue` | 6× | login, über-uns | Primär-Aktion (blau gefüllt) |
| `.btn-primary` | 12× | **nur** Brand Guide | **Dublette** von `.btn-blue` |
| `.btn-send` | 9× | mitglied, firmenevents, medien, training, BG | Formular-Absenden (blau gefüllt) = `.btn-blue` |
| `.btn-danger` | 1× | Brand Guide | Löschen/Abbrechen (rot) |

### 2b. Ghost-Varianten — dasselbe in drei Farben

| Klasse | Vorkommen | Sinn |
|---|---|---|
| `.btn-ghostd` | 5× (nur BG) | Ghost auf dunklem Grund |
| `.btn-ghostw` | 1× (nur BG) | Ghost auf hellem Grund |
| `.btn-ghosth` | 1× (nur BG) | Ghost „hover"-Demo |

→ Drei Klassen für **einen** Zweck. Gehört zu **einem** `.btn-ghost` zusammengefasst (Farbe
regelt der Hintergrund automatisch, nicht drei Klassen).

### 2c. Einmalige Spezial-Buttons (je 1–4×) — meist umbenannte Standard-Buttons

| Klasse | Seite | Optik | Ist eigentlich |
|---|---|---|---|
| `.btn-copy` | mitglied | frosted | `.btn-ghost` |
| `.btn-wa` / `.wa-btn` | index, training | WhatsApp-Grün | Sonderfall „WhatsApp" (Fremdmarke) |
| `.dlbtn` | medien (10×) | erbt | Download-Zeile → `.btn-ghost` + Icon |
| `.vbtn` | medien | card-soft | `.btn-ghost` |
| `.mbtn` | index | erbt | Mail-Popup-Button → `.btn-blue`/`.btn-ghost` |
| `.mmore-btn` | index | erbt | „mehr laden" → `.btn-ghost` |
| `.rmore-btn` | regeln | erbt | „mehr Regeln" → `.btn-ghost` |
| `.calfilterbtn` | index | erbt | Kalender-Filter-Chip → **Chip**, kein Button |
| `.pillbtn` | Brand Guide | gold | Demo → `.btn-gold` (klein) |
| `.db-btn` | dashboard | blau | = `.btn-blue` (neu, Dashboard) |
| `.db-icbtn` | dashboard | rund | Icon-Button → `.btn-icon` |

### 2d. Design Studio — Editor-eigene Toolbar (SEPARAT lassen)

`tb-btn` (17×), `pm-tbtn` (11×), `xbtn` (9×), `tbtn` (13×), `nf-btn/2/3`, `ytt-btn` — **~60
Vorkommen, fast alle im Design Studio**. Das ist **Editor-UI** (Werkzeugleiste, Ebenen, Tabs),
kein Website-CTA. Editor-Farbsemantik ist bewusst anders (Gold = Auswahl/Aktiv, nicht CTA — siehe
CLAUDE.md §1). **Vorschlag: bleibt getrennt**, wird in dieser CTA-Vereinheitlichung **nicht**
angefasst. (Kann später einen eigenen `ds-`-Präfix-Satz bekommen.)

---

## 3. Vorschlag: 5 Typen + 2 Modifier, EIN Baustein

Alles Öffentliche fällt auf **fünf Klassen** zusammen:

| Klasse | Zweck | Optik | ersetzt heute |
|---|---|---|---|
| `.btn` | **Basis** — jeder Button trägt sie (Radius, Padding, Font, Pfeil, Hover, Shiny-Glow) | — | 10× inline-Kopie |
| `.btn-gold` | **Conversion / Lead** — „Mitglied werden", „Verfügbarkeit prüfen" | Gold gefüllt | `.btn-gold`, `.pillbtn`, `.ytt-btn` |
| `.btn-blue` | **Primär-Aktion** — Absenden, Öffnen, Erstellen | Blau gefüllt | `.btn-blue`, `.btn-primary`, `.btn-send`, `.db-btn`, `.mbtn` |
| `.btn-ghost` | **Navigation / sekundär** — „mehr erfahren", „mehr laden", Download | Outline | `.btn-ghost(d/w/h)`, `.btn-copy`, `.dlbtn`, `.vbtn`, `.mmore-btn`, `.rmore-btn` |
| `.btn-danger` | **Löschen / Abbrechen / Gefahr** | Rot | `.btn-danger` |

**Zwei Modifier** (kombinierbar, statt eigener Klassen):

| Modifier | Wirkung | ersetzt |
|---|---|---|
| `.btn-sm` | kleiner (Padding/Font runter) | diverse Ad-hoc-Grössen |
| `.btn-icon` | quadratisch/rund, nur Icon | `.xbtn`, `.db-icbtn`, `.vbtn` |

**Zwei bewusste Sonderfälle bleiben** (Fremdmarken-Farbe, kein Brand-CTA):
`.btn-wa` (WhatsApp-Grün) — als **Zusatzklasse** auf `.btn` (`class="btn btn-wa"`), nur die Farbe
überschreibt.

**Ergebnis:** von ~30 Klassen (Website) auf **5 + 2 Modifier + 1 Sonderfarbe**.

---

## 4. So wird „einmal ändern = überall" wahr

Neuer Baustein **`system/buttons.css`** (Single Source), im `<head>` **nach** `tokens.css`
geladen. Alle Maße kommen aus **Tokens** — Beispiel:

```css
/* system/tokens.css — die Stellschrauben */
--btn-radius:  var(--r-md);   /* Radius aller Buttons — HIER ändern = überall */
--btn-pad-y:   14px;
--btn-pad-x:   24px;
--btn-font:    14.5px;

/* system/buttons.css — die eine Definition */
.btn{ border-radius:var(--btn-radius); padding:var(--btn-pad-y) var(--btn-pad-x);
      font-size:var(--btn-font); font-weight:900; /* + Pfeil, Hover, Shiny-Glow */ }
.btn-gold{ background:linear-gradient(155deg,var(--gold),var(--gold-lt)); color:#0d273d }
.btn-blue{ background:linear-gradient(155deg,var(--blue),var(--blue-mid)); color:#fff }
.btn-ghost{ background:transparent; border:1px solid var(--card-brd); color:var(--ink) }
.btn-danger{ background:var(--red); color:#fff }
```

Danach im HTML nur noch: `<a class="btn btn-gold" data-cta="mitglied-werden">Mitglied werden</a>`.
**Änderst du `--btn-radius` von `--r-md` auf `--r-pill`, werden alle Buttons auf allen 10 Seiten
rund** — der Text bleibt, weil er im HTML steht und `cta.js` ihn nicht anfasst.

Die **Rollen bleiben** wie in CLAUDE.md §9 (Gold nur Conversion/Lead, Blau Aktion, Ghost
Navigation) — `system/cta.js` warnt schon heute, wenn ein Gold-Button keine Conversion ist. Neu
ist nur: der **Stil** wird ebenfalls zentral, nicht nur das Ziel.

---

## 5. Migrationsweg (wenn du „bauen" freigibst)

1. `system/tokens.css`: Button-Tokens ergänzen.
2. `system/buttons.css` neu: die 5 Typen + 2 Modifier, aus den heutigen Brand-Guide-Werten
   abgeleitet (damit sich optisch **nichts** ändert — nur die Quelle wird zentral).
3. Brand Guide: eine Sektion „Buttons" mit allen 5 Typen + Modifier live + Copy-Snippet;
   die Dubletten-Demos (`btn-primary`, `btn-ghostd/w/h`) darauf umstellen.
4. Seite für Seite: inline `.btn*`-Regeln raus, `buttons.css` einbinden, **Screenshot vorher/
   nachher** vergleichen. Eine Seite = ein kontrollierter Schritt mit Snapshot + Rollback.
5. Zum Schluss prüfen: **0** inline `.btn{}`-Regeln auf den Website-Seiten (Design Studio
   ausgenommen).

**Risiko ehrlich:** berührt alle 10 Seiten — genau die Art Umbau, die zuletzt Schaden gemacht
hat. Darum additiv + Screenshot-Diff, nie großes Suchen-Ersetzen.

---

## 6. Offene Entscheidungen für dich

1. **5 Typen** so ok, oder brauchst du z. B. noch einen „Text-Link-Button" (ganz ohne Fläche)?
2. **Design-Studio-Buttons** wirklich getrennt lassen (empfohlen), oder später auch angleichen?
3. **`.btn-wa`** (WhatsApp-Grün) behalten, oder WhatsApp-Links auch als `.btn-ghost` mit Icon?
