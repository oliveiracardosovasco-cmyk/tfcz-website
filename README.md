# TFCZ — Web, Brand & Vereinswissen (`kagu`)

Gemeinsame Arbeits- und Wissensbasis des **Tischfussball Club Zürich (TFCZ)**:
Website, Brand-/Design-System und Vereinswissen — an einem Ort, versioniert, fürs Team.

## Struktur

| Ordner / Datei | Inhalt |
|---|---|
| **`CLAUDE.md`** | Verbindlicher Kontext & Markenregeln — wird bei jeder Zusammenarbeit geladen |
| **`site/`** | Die Website: `index.html` (Auslieferung), `index-cms.html` (mit eingebautem CMS), `assets/img/` |
| **`brand/`** | `DESIGN-SYSTEM.md` (Layout/Typo/Spacing/Komponenten), `brand-guide.html`, `TFCZ_Brand_Guide.pdf` |
| **`docs/`** | Vereinswissen: Verein, Eventformate, Turniere, Streaming, Marketing, Clubentwicklung … |

## Website bearbeiten (CMS)

`site/index-cms.html` im Browser öffnen → Button **„✎ Bearbeiten"** (unten rechts):
Texte/Bilder/Links anklicken, Einträge mit ＋/⧉/✕, Design-Regler, Sektionen ein-/ausblenden.
**Speichern** (Browser) und **„Fertige HTML exportieren"** für eine eigenständige Datei.

## Brand-Kurzregeln

- Farben: Blau `#5ca7dc` · Navy `#0d273d` · Gold `#cda857` (+ Sekundärtöne → `brand/DESIGN-SYSTEM.md`)
- Brand-Line strikt: **Blau oben, Gold unten**
- Schrift: **Nunito Sans** (400/500/700/900)
- **Leonhart-Verein:** 10 Leonhart + 1 Ullrich permanent, Rest optional

## Hosting

Statische Seite (`site/index.html`). Für GitHub Pages den Ordner `site/` als Quelle wählen,
oder Netlify/Vercel auf `site/` zeigen lassen.

---
© Tischfussball Club Zürich · Landenbergstrasse 10, 8037 Zürich
