# TFCZ – Website (Neubau v2)

> Claude-generated | Stand 19.06.2026 | Quelle: Iteration mit Vasco

Single-File-Website (HTML/CSS/JS) nach dem TFCZ Design-System. Zwei Dateien:
`index.html` (Auslieferung) und `index-cms.html` (gleiche Seite **mit Inline-CMS**).
Liegt im Repo unter `site/`; Live via GitHub Pages (Action veröffentlicht `site/`).

---

## Sektionen (Reihenfolge)

1. **Hero** „Wo Zürich kickt." — Foto-Hintergrund (kein Logo/Pattern-Wasserzeichen), Stats: 100+ Mitglieder · 10× Leonhart · mind. 2×/Woche · 100 m².
2. **Laufband** (Marquee) — Angebote, gleichmässige Rauten-Trennung, navy umrandet.
3. **Mitspielen** „Einfach vorbeikommen" — zwei **Flip-Karten** (Di Offenes Training / Mi Crazy DYP) mit ausführlicher Erklärung + WhatsApp-CTA. **Steht bewusst vor „Der Verein".**
4. **Der Verein** — dunkle `band-img`-Sektion (Foto-Hintergrund), Text + **Kartenstapel** „Auf einen Blick" (Adresse, Lokal, Tische, Offen, Träger, Kontakt) mit CTA-Links.
5. **Angebot** (früher „Formate") — kompakte Cards + Kategorie-Filter.
6. **Mitgliedschaft** „Werde eine:r von uns" — Social-Proof + 3 gestaffelte Preis-Cards (Mitte gross, Hover-Zoom) + Sponsor/Gönner-Box.
7. **Kalender** — Umschalter **Liste ⇄ Kalender** (Monatsraster mit Time-Slots), Kategorie-Filter, keine Fremdlinks.
8. **Tische** „Wir sind ein Leonhart-Verein" — **Flip-Karten** mit Tisch-Wiki (Herkunft, warum). Nur Leonhart hervorgehoben.
9. **Events** — `band-img` (Foto), Event-Typen (Firma/Geburtstag/Polterabend/Gruppe), „unverbindlich anfragen". Eigene Events-Landingpage folgt später.
10. **Kindertraining** · **Foto-Galerie** (laufende Slideshow) · **Social** (nur Instagram + YouTube) · **Kontakt** (Google-Maps-Embed) · CTA · Footer.

---

## CMS (`index-cms.html`)

Button „✎ Bearbeiten" → Panel: Texte & **Menüpunkte** editierbar, **alle Bilder** per Klick
ersetzbar, **Link- & Schriftgrössen-Leiste** pro Element, Repeater (＋/⧉/✕), Sektionen
ein-/ausblenden & sortieren, Design-Regler (Schriftgrösse/Abstände/Radius/Hintergrund),
**Speichern** (localStorage), **HTML-Export**, **JSON-Backup**.

---

## Offene Punkte

- **Live-Feed** Instagram/YouTube: aktuell nur Verlinkung. Für echten Feed braucht es den
  YouTube-Kanal-Link (Embed) und ein Instagram-Embed-Widget.
- Eigene **Events-Landingpage** mit Detail-Optionen geplant.

> Design-System & Komponenten: siehe `Assets/Brand-Guide/DESIGN-SYSTEM.md`.
