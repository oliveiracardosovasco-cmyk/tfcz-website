# TFCZ — Projektkontext (Quelle der Wahrheit)

Dieses Repository ist die gemeinsame Arbeits- und Wissensbasis für alles rund um den
**Tischfussball Club Zürich (TFCZ)**: Website, Brand-/Design-Assets und Vereinswissen.

> **Diese Datei wird bei jeder Zusammenarbeit (Mensch oder KI) als Kontext geladen.**
> Bei Widersprüchen gilt **`CLAUDE.md` als oberste Quelle der Wahrheit**; alles unter
> `docs/` ist abgeleitetes Vereinswissen und muss zu dieser Datei passen, nicht umgekehrt.

---

## 1. Repo-Struktur

```
/
├── CLAUDE.md          ← diese Datei (verbindlicher Kontext + Regeln)
├── README.md          ← Übersicht
├── site/              ← die Website (index.html, index-cms.html, assets/img/)
├── brand/             ← Marke & Design (DESIGN-SYSTEM.md, brand-guide.html, Brand-Guide.pdf)
└── docs/              ← Vereinswissen (Verein, Events, Turniere, Streaming, Marketing …)
```

**Verweise für jede Zusammenarbeit:**
- Verbindliches **Web-Design-System** → [`brand/DESIGN-SYSTEM.md`](brand/DESIGN-SYSTEM.md)
- **Vereinsfakten** → [`docs/verein.md`](docs/verein.md)
- **Eventformate** → [`docs/eventformate.md`](docs/eventformate.md)
- **Turniere** → [`docs/turniere.md`](docs/turniere.md)
- **Streaming/Overlay** → [`docs/streaming.md`](docs/streaming.md)

---

## 2. Marke & Brand-Specs (verbindlich)

**Verein:** Tischfussball Club Zürich (TFCZ), Zürich. Schweiz-Kontext: Währung **CHF**,
Inhalte oft auf **Deutsch**.

**Farben (kanonisch — immer exakt diese Werte):**

| Rolle | Hex |
|---|---|
| Blau Primär | `#5ca7dc` |
| Blau Sekundär 1 | `#4489c7` |
| Blau Sekundär 2 | `#005a94` |
| Navy | `#0d273d` |
| Gold Primär | `#cda857` |
| Gold Sekundär 1 | `#e9c475` |
| Gold Sekundär 2 / Sand | `#e6e3da` |

**Typografie:** **Nunito Sans** (Gewichte 400, 500, 700, 900).

**Brand-Line-Regel (STRIKT):** **Blau oben, Gold unten.** Kein Mischen, keine Verläufe in
Print-/Social-Kontexten. Ausnahme nur für Screen-UI (Kassensystem/Bar-Display): dekorativer
Links-nach-rechts-Verlauf Blau→Gold erlaubt.

**Kicker-Signature:** Goldstrich (28×2px) + UPPERCASE-Kicker (900, 12px, letter-spacing .18em),
`·` als Wortgruppen-Trenner. Auf Navy `--gold-lt`, auf Hell `--blue-dk`.

**Kategorie-Akzent-System:** Für alle = Blau `#5ca7dc` · Wettkampf/Pro = Gold `#cda857`
· Events/Spezial = Tiefblau `#005a94`.

→ Vollständige Werte (Typo-Skala, Spacing, Komponenten): **`brand/DESIGN-SYSTEM.md`**.

---

## 3. Designprinzipien

- **Responsive ist nicht verhandelbar** (Breakpoints 1024 / 680px; POS-Referenz 640/1024/1400).
- **Dense but tappable** für POS/Touch (iPad-first).
- **Farbgenauigkeit** strikt gegen die kanonischen Werte prüfen.
- Primäres Output-Format für Web-Deliverables: **HTML/CSS (Single-File bevorzugt)**.

---

## 4. Kernfakten Verein (verbindlich)

- **Standort:** Landenbergstrasse 10, 8037 Zürich (Wipkingen). Ein Lokal, ca. 100 m².
- **Leonhart-Verein:** **10 Leonhart-Turniertische permanent** + **1 Ullrich**; alle weiteren
  Tische (Garlando, Bonzini, Roberto Sport, Tornado) optional je nach Anlass.
- **Offen:** Di (Offenes Training, 18:00) & Mi (Crazy DYP, Start 20:15) + Events/Spontanöffnungen.
- **Mitgliedschaft:** Schnuppertag gratis → danach CHF 5.–/Eintritt · Aktivmitglied **CHF 200/Jahr**
  · Key Player **CHF 250/Jahr** (Schlüssel + Verantwortung) · Gönner auf Anfrage.
- **Kanäle:** WhatsApp (intern/Öffnungen), Instagram `@tischfussballclub_zuerich`, YouTube (Stream),
  Facebook-Gruppe. Kontakt `info@tfcz.ch`, Web `tfcz.ch`.

→ Details: **`docs/verein.md`**, **`docs/eventformate.md`**, **`docs/turniere.md`**.

---

## 5. Arbeitsweise

- **Iterativ** mit detailliertem Feedback pro Runde — mehrere Verfeinerungszyklen einplanen.
- **Konsistenz über Gespräche & Personen hinweg** ist wichtig.
- Antworten **knapp und direkt**.
- Dauerhafte TFCZ-Entscheidungen in die passende `docs/*.md` einpflegen und in `docs/_log.md`
  vermerken; verbindliche Regeln zusätzlich hier in `CLAUDE.md`.
