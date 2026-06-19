# TFCZ Brand Guide – Quick Reference

> Quelle: TFCZ Brand Manual 2026 (PDF)  
> Claude-generated — letzte Aktualisierung: 2026-06-18

> ⚠️ **Verbindliche Regeln stehen in Projekt-`CLAUDE.md`** (Quelle der Wahrheit). Diese Seite ist
> die ausführliche Wissensbasis fürs Team. Bei Abweichungen gilt CLAUDE.md.

---

## Marken-Linie (Signature) ⭐

**Blaue Linie oben, goldene Linie unten** — als Rahmen um Layouts. Das ist ein **permanentes
Markenzeichen** des TFCZ und durchzieht alle Kanäle: Print, Social **und** Stream/Broadcast.

- Reihenfolge strikt: **Blau oben (`#5ca7dc`), Gold unten (`#cda857`)** — nie mischen, nie tauschen.
- In Print/Social: **volle Linien, kein Verlauf**.
- Ausnahme Screen-UI (POS/Bar-Display/Overlay-Deko): dekorativer Blau→Gold-Verlauf erlaubt,
  die Rahmen-Linie selbst bleibt aber voll.

> Entscheidung aus Arbeitssession 2026-06-18 — als feste Markenregel bestätigt.

---

## Primärfarben

| Name | HEX | RGB | CMYK | Pantone |
|---|---|---|---|---|
| **TFCZ Blue** (Primary) | `#4489c7` | 68, 137, 199 | 73, 38, 0, 0 | – |
| TFCZ Blue Dark | `#005a94` | – | – | – |
| TFCZ Blue Navy | `#0d273d` | – | – | – |
| TFCZ Blue Light | `#5ca7dc` | – | – | – |
| **TFCZ Gold** (Primary) | `#cda857` | 205, 168, 87 | 21, 32, 78, 0 | 7563 C |
| TFCZ Gold Light | `#e9c475` | – | – | – |
| TFCZ Neutral (Hintergrund) | `#e6e3da` | 230, 227, 218 | 9, 7, 12, 0 | – |

> Print: CMYK verwenden. Digital: RGB/HEX verwenden.

## Sekundärfarben (Akzente – max. 5% der Fläche)

| Farbe | HEX hell | HEX dunkel |
|---|---|---|
| Grün | `#67b57d` | `#3b7657` |
| Orange/Gold | `#e49b2c` | `#db7f27` |
| Rot | `#DA2929` | `#BB2025` |

Schwarz und Weiss: hauptsächlich für Typografie.

---

## Gradients (erlaubt, max. 2 Farben)

- `#005a94` → `#4489c7` (Blue)
- `#4489c7` → `#cda857` (Blue-Gold)
- `#0d273d` → `#005a94` (Dark Navy)
- `#5ca7dc` → `#e9c475` (Light Blue-Gold)

Gradients primär für Hintergründe.

---

## Logo-Regeln

### Versionen
- **Primary Logo** = Schild-Symbol + Wordmark "TISCHFUSSBALL CLUB ZÜRICH" → Standardverwendung
- **Secondary Logo** = Schild + Kürzel "TFCZ" → nur mit Teamzustimmung
- **Symbol alone** = nur für Favicon, App-Icon

### Farbe nach Hintergrund

| Hintergrund | Logo-Version |
|---|---|
| Weiss / <40% Grau | Farbversion (TFCZ Blue) oder Schwarz |
| TFCZ Blue | Logo mit weissem Graphic Device + weisse Schrift |
| TFCZ Gold | Logo mit weissem Graphic Device + weisse Schrift |
| Schwarz / >40% Grau | Logo mit weissem Graphic Device (nicht invertieren!) |

### Was NICHT erlaubt ist
- ❌ Schatten oder Texturen auf dem Logo
- ❌ Verzerren, strecken, rotieren, schräg stellen
- ❌ Andere Farben / Recolouring
- ❌ Anderen Font statt dem offiziellen Wordmark-Font
- ❌ Kontrast nicht eingehalten (z.B. blaues Logo auf blauem BG)
- ❌ Symbol und Wordmark neu positionieren

### Safe Zone
- Horizontal: Freizone = Höhe des «Z» im Wordmark
- Vertikal: Freizone = Breite des «Z»
- Symbol: Freizone = Abstand zwischen Schild und Figur (links)

---

## Typografie

**Font: Nunito Sans** (Google Fonts – kostenlos)  
Gewichte: Extralight, Light, Regular, Semibold, Bold, Extrabold, Black + je Kursiv

Fallback wenn Nunito Sans nicht verfügbar: moderner, serifenloser Font (z.B. Inter, Open Sans).

Umlaute (ä, ö, ü) und ß-Ersatz (ss) sind unterstützt.

---

## Design-System (UI & Layout) — für Flyer, Overlay, Landingpage

> Diese Sektion legt fest, **wie** mit Farben, Fonts, Cornerings, Buttons, Spacing & Schatten
> gearbeitet wird. Ziel: jeder neue Flyer / jedes Overlay / jede Landingpage startet konsistent.
> Abgeleitet aus den gebauten TFCZ-Tools (Stream-Overlay, POS, Bar-Display).

### Farb-Rollen (UI) — was wofür

| Token | HEX | Rolle |
|---|---|---|
| `--c-blue` | `#4489c7` | **Primär-Fläche**: Buttons, Akzente, Flächen (das kräftige Blau) |
| `--c-blue-bright` | `#5ca7dc` | Helles Akzentblau **+ Brand-Linie oben**, Hover-Highlights |
| `--c-blue-deep` | `#005a94` | Tiefe, Verläufe, Button-Hover (dunkler) |
| `--c-navy` | `#0d273d` | Dunkle Panels, Text-auf-hell, Frosted-Basis |
| `--c-gold` | `#cda857` | Prestige-Akzent **+ Brand-Linie unten**, CTA, Trennlinien |
| `--c-gold-light` | `#e9c475` | Gold-Highlight (Gewinner, Hover-Gold) |
| `--c-sand` | `#e6e3da` | Neutraler heller Hintergrund / Sekundärtext |

> Gold ist **Akzent**, nie Grossfläche (max. ~5–10 %). Text auf Blau/Navy = Weiss; auf Gold = Navy.
> Nie reines Schwarz auf Blau.
> ⚠️ CLAUDE.md nennt `#5ca7dc` als „Primär" — in der UI-Praxis trägt `#4489c7` die Primärfläche.
> Offene Klärung; bei Konflikt gilt CLAUDE.md.

### Cornerings (Border-Radius) — Skala

| Token | Wert | Einsatz |
|---|---|---|
| `--r-xs` | `4px` | Innen-Details, kleine Marker, Flaggen |
| `--r-sm` | `6px` | Chips, Tags, Badges, kleine Buttons |
| `--r-md` | `9px` | Buttons, Inputs, Bugs |
| `--r-lg` | `12px` | Cards, Panels |
| `--r-xl` | `16px` | Grosse Cards, Modals, Hero-Flächen |
| `--r-pill` | `999px` | Toggles, Status-Pills, runde Buttons |

> **Regel:** konsistente Radien statt Zufallswerte. Elemente, die an einer Kante „andocken"
> (z. B. Tag über einer Box), nur die **oberen** Ecken runden: `6px 6px 0 0`.

### Spacing — 4px-Raster

`4 · 8 · 12 · 16 · 20 · 24 · 32 · 48`

- **Rand-Abstand** (Overlay/Layout zum Bildrand): `48px`.
- **Button-Padding:** `12px 16px`. **Card-Padding:** `16px`. **Bug/Pill-Padding:** `7px 14px`.
- **Gaps** zwischen Elementen: `8–14px`.

### Elevation / Schatten

| Token | Wert | Einsatz |
|---|---|---|
| `--e-1` | `0 6px 16px rgba(0,0,0,.30)` | Bugs, kleine Elemente |
| `--e-2` | `0 12px 30px rgba(0,0,0,.45)` | Cards, Panels |
| `--e-3` | `0 14px 34px rgba(0,0,0,.55)` | Lower-Third, Hero |
| Inset-Highlight | `inset 0 1px 0 rgba(255,255,255,.12)` | feiner Lichtrand oben auf dunklen Panels |

> **Frosted-Panel (nur Screen/Overlay, nicht Print):** `background: rgba(13,39,61,.55)` +
> `backdrop-filter: blur(8px)`. Wirkt weich und broadcast-tauglich.

### Buttons

| Typ | Fläche | Hover | Text | Radius |
|---|---|---|---|---|
| **Primär** | `#4489c7` | `#5ca7dc` | Weiss, 900 | `9px` |
| **CTA / Gold** | `#cda857` | `#e9c475` | Navy `#0d273d` | `9px` |
| **Sekundär / Ghost (auf dunkel)** | `#1b3346` | `#005a94` | Weiss | `9px` |
| **Ghost (auf hell)** | transparent, 1px Border `#4489c7` | Fläche `#4489c7` | `#4489c7` → Weiss | `9px` |
| **Danger (sparsam)** | `#3a1f24` | `#52262c` | `#ffb4b4` | `9px` |

- **Disabled:** 40 % Deckkraft, kein Hover.
- **Toggle-Switch:** Track 40×22 `--r-pill`, off `#33506a`, on `#5ca7dc`, Knopf weiss 18px.
- **Print-„Button"** (kein echtes UI): Gold-Pill mit Navy-Text, Radius `6–9px`.

### Typografie-Skala (Nunito Sans)

Gewichte im Einsatz: **400 / 500 / 700 / 900**.

| Stil | Gewicht | Hinweise |
|---|---|---|
| Display / Hero | 900 | gross, knapp |
| Headline | 800–900 | Titel |
| Subhead | 700 | |
| Body | 400 / 700 | Lauftext |
| Label / Eyebrow | 700–900 | **UPPERCASE**, Letterspacing `.12–.18em` |
| Caption | 700 | klein, Sekundärfarbe |

> Letterspacing nur bei UPPERCASE-Labels (`.12–.22em`), normaler Text = 0.
> Referenz-Grössen Overlay (1080p): Spielername 22, Score 24, Tag 15, Label 12–13, Caption 11 —
> proportional auf andere Formate skalieren.

### Komponenten-Patterns (wiederverwendbar)

- **Tag / Eyebrow:** heller Pill (Weiss .94) + Navy-Text + 2px Gold-Unterstrich, obere Ecken `6px`.
- **Bug (Logo / Info):** dezent, frosted oder transparent; Icons **gleich gross** (16px), Punkt-Trenner.
- **Card / Panel:** frosted Navy/Blau, `--r-lg`, `--e-2`, optional Inset-Highlight, Titelzeile mit Gold-Trennlinie.
- **Daten-Reihen:** Sieger hell/gold, Verlierer gedimmt (Weiss ~42 %) — Hervorhebung ohne den Fokus zu stören.
- **Hervorhebung/Animation:** Gold-Glow + Scale für Gewinner-Momente; sonst ruhig.

### Copy-paste Token-Block (CSS)

```css
:root{
  /* Farben */
  --c-blue:#4489c7; --c-blue-bright:#5ca7dc; --c-blue-deep:#005a94; --c-navy:#0d273d;
  --c-gold:#cda857; --c-gold-light:#e9c475; --c-sand:#e6e3da;
  /* Radius */
  --r-xs:4px; --r-sm:6px; --r-md:9px; --r-lg:12px; --r-xl:16px; --r-pill:999px;
  /* Elevation */
  --e-1:0 6px 16px rgba(0,0,0,.30); --e-2:0 12px 30px rgba(0,0,0,.45); --e-3:0 14px 34px rgba(0,0,0,.55);
  /* Font */
  --font:'Nunito Sans',system-ui,sans-serif;
}
```

### Do / Don't (kurz)

- ✅ Brand-Linie immer (blau oben, gold unten, voll). Token-Radien & 4px-Spacing nutzen.
- ✅ Gold als Akzent (Gewinner, CTA, Trennlinien), nicht als Grossfläche.
- ❌ Zufalls-Radien/-Abstände, harte schwarze Kanten, reines Schwarz auf Blau, Gold-Flächen.

---

## Pattern / Textur

Der Schild-Pattern (subtil) darf als Hintergrundtextur eingesetzt werden. Farbe muss immer **heller als der Hintergrund** sein. Nie dunkler als BG.

---

## Checkliste vor Veröffentlichung

- [ ] Richtiger Logo-Typ für den Hintergrund gewählt?
- [ ] Safe Zone eingehalten?
- [ ] Farbe aus der offiziellen Palette?
- [ ] Font Nunito Sans (oder akzeptierter Fallback)?
- [ ] Kein Verzerren, Rotieren, Recolouring?
- [ ] Kontrast Logo/Hintergrund ausreichend?

---

## Web Design-System (Landingpages)

Verbindliche Layout-/Typo-/Spacing-Werte für alle TFCZ-Webseiten liegen in
`TFCZ-Projekt/Assets/Brand-Guide/DESIGN-SYSTEM.md`.

**Kicker-Signature (festes Stilelement):** Goldener Strich (28×2px) + UPPERCASE-Kicker
(Nunito Sans 900, 12px, letter-spacing .18em), Punkt-Trenner `·` zwischen Wortgruppen.
Auf Navy in `--gold-lt`, auf Hell in `--blue-dk`. Wird auf allen Seiten als Section-Eyebrow genutzt.

**Kategorie-Akzent-System:** Für alle = Blau `#5ca7dc` · Wettkampf/Pro = Gold `#cda857`
· Events/Spezial = Tiefblau `#005a94`. Konsequent über Cards, Tags und Kalender.

> Quelle: Website v2 Iteration mit Vasco, 18.06.2026.
