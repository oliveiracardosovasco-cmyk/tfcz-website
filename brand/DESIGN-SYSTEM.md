# TFCZ Web Design-System

> Verbindliche Design-Guideline für alle TFCZ-Landingpages und Web-Tools.
> Ergänzt den Brand Guide (Marke/Logo) um konkrete Werte für Layout, Typo, Spacing
> und Komponenten. Bei Markenregeln gilt `CLAUDE.md` als oberste Quelle der Wahrheit.

---

## 1. Farben (kanonisch)

| Rolle | Hex | Einsatz |
|---|---|---|
| Blau Primär | `#5ca7dc` | Akzente, Links, Kategorie „Für alle" |
| Blau Sekundär 1 | `#4489c7` | Hintergrund-Linien, Hover |
| Blau Sekundär 2 | `#005a94` | Kategorie „Events/Spezial", tiefe Akzente |
| Navy | `#0d273d` | Haupthintergrund, Text auf Hell |
| Navy 2 / 3 | `#0a1f31` / `#081826` | dunklere Bands, Footer |
| Gold Primär | `#cda857` | Titel-Akzent (Kicker), Buttons, Kategorie „Pro" |
| Gold Sekundär 1 | `#e9c475` | helles Gold, Hover, Eyebrow-Text |
| Gold Sekundär 2 / Sand | `#e6e3da` | ruhige Flächen |

**Neutrale Helfer (nur Web, kein Brand-Konflikt):**
`--ink-2:#33475a` (Fliesstext auf Hell) · `--line:#e6ebf0` (Trennlinien) · `--bg-light:#f4f6f8` (heller Band-Hintergrund).

### Kategorie-Akzent-System (Hierarchie)
Anlässe werden farblich klar unterschieden — konsequent über alle Seiten:

| Kategorie | Farbe | Beispiele |
|---|---|---|
| **Für alle** | Blau `#5ca7dc` | Offenes Training, Crazy DYP, Käsekick |
| **Wettkampf / Pro** | Gold `#cda857` | STF Regio, Zürich Open, STS, P4P |
| **Events / Spezial** | Tiefblau `#005a94` | Firmenevents, Geburtstage, Kindertraining, Vermietung |

---

## 2. Brand-Line & Kicker-Signature (Markenzeichen)

**Brand-Line (strikt):** Blau oben, Gold unten. Je 5px. Kein Mischen, keine Verläufe in Print/Social.
Rahmt zentrale Blöcke (Nav, CTA-Strip).

**Kicker-Signature** — der goldene Section-Titel mit Strich + Punkt-Trenner.
Wird zum festen TFCZ-Stilelement für alle Seiten:

```
[—— Goldstrich]  KICKER-TEXT IN GROSSBUCHSTABEN
```

- Goldener Strich (`28px × 2px`, Farbe Gold) links vom Text
- Text: Nunito Sans **900**, `12px`, `letter-spacing:.18em`, UPPERCASE
- Farbe: auf Navy `--gold-lt`, auf Hell `--blue-dk`
- Punkt-Trenner `·` zwischen Wortgruppen (z.B. „Zürich Wipkingen · seit Jahren am Kicken")

CSS-Referenz:
```css
.kicker{display:inline-flex;align-items:center;gap:10px;font-weight:900;
  font-size:12px;letter-spacing:.18em;text-transform:uppercase;color:var(--blue-dk)}
.kicker::before{content:"";width:28px;height:2px;background:var(--gold)}
```

---

## 3. Typografie

**Schrift:** Nunito Sans — Gewichte 400, 500, 700, 900 (900 für alle Titel).

| Token | Wert | Einsatz |
|---|---|---|
| `--fs-hero` | `clamp(54px, 9vw, 128px)` | Hero-H1, UPPERCASE, `line-height:.92` |
| `--fs-h2` | `clamp(34px, 5vw, 58px)` | Section-Titel, UPPERCASE, `line-height:.98` |
| `--fs-h3` | `20px` | Card-Titel |
| `--fs-body` | `17px` | Fliesstext, `line-height:1.6` |
| klein | `13–14.5px` | Meta, Tags, Captions |

Titel: `letter-spacing:-.02em`. Labels/Kicker: `letter-spacing:.1–.22em`, UPPERCASE.

---

## 4. Spacing & Layout

8pt-Skala: `--s1:8 · --s2:16 · --s3:24 · --s4:32 · --s5:48 · --s6:64 · --s7:96`.

| Element | Wert |
|---|---|
| Section-Padding vertikal (`--band-pad`) | `104px` Desktop · `70px` Mobile |
| Section-Head Abstand unten | `48px` (`--s5`) |
| Content-Maxbreite | `1240px` |
| Seitliches Padding (`.wrap`) | `28px` Desktop · `20px` Mobile |
| Grid-Gap Cards | `22–24px` |
| Border-Radius | Karten `16px` · grosse Blöcke `22px` · Pills `30px` |

**Globaler Abstands-Regler:** `--space-scale` (0.85 kompakt / 1 normal / 1.2 luftig) skaliert `--band-pad` — vom Inline-Editor steuerbar.

**Breakpoints:** `1024px` (Tablet, Grids → 2 oder 1 Spalte) · `680px` (Mobile, Burger-Menü, 1 Spalte).

---

## 5. Komponenten

- **Buttons:** `padding:16px 30px`, `radius:12px`, weight 900. Varianten: `btn-gold` (primär), `btn-ghost` (sekundär, auf Dunkel), `btn-navy`, `btn-wa` (WhatsApp-Grün `#25D366`). Hover: `translateY(-3px)` + Schatten.
- **Cards:** Hover `translateY(-7px)` + Schatten. Kategorie über `border-top:3px` in Akzentfarbe.
- **Tags/Badges:** Pill, UPPERCASE 11.5px/900, Kategorie-Farbe.
- **Section-Bands:** `band-light` (hell) · `band-navy` (transparent über Canvas) · `band-deep` (Navy-Verlauf).
- **Reveal:** `opacity:0 → 1`, `translateY(34px) → 0`, `.7s`, via IntersectionObserver.

---

## 6. Bewegung / Hintergrund

- **Animierter Canvas:** 5 sanfte, sinusförmige Blau/Gold-Linien, maus-reaktiv (Parallax). Fixiert hinter dem Inhalt, `pointer-events:none`.
- **Marquee:** goldenes Laufband, navy umrandet, eigener Block (nie von Bands überlappt).
- **Foto-Karussell:** zwei gegenläufige Reihen (oben grösser ~260px, unten ~180px), Endlos-Loop, Pause bei Hover, Klick → Lightbox.
- **Fakten-Karussell:** Auto-Rotation 3.8s, Icon + Label + Wert, Dots.

---

## 7. Output-Konvention

- Primär **Single-File HTML/CSS** (alles inline), Assets relativ unter `assets/img/`.
- Inhalte mit `data-edit` (Text) bzw. `data-img` (Bild) markieren → vom Inline-Editor bearbeitbar.
- Neue Landingpages erben dieses `:root`-Token-Set 1:1.
