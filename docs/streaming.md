# TFCZ Streaming

> Claude-generated | Quellen: Master-Prompt, tfcz.ch | 2026-06-17 (Overlays aktualisiert 2026-06-18)

---

## Aktueller Stand

**YouTube-Kanal:** @tischfussballclubzuerich  
**Handle:** https://youtube.com/@tischfussballclubzuerich  
**Beschreibung:** „Das Tischfussball Lokal in Zürich"  
**Einsatz:** Bei grossen Turnieren (z.B. Zürich Open / STF Regio Tour Pro) mit Kommentator

---

## Setup (Zürich Open / grössere Turniere)

| Kamera | Position |
|---|---|
| 2× Tischkamera | Nahaufnahme Spielfeld |
| 2× Spielerkamera | Gesichter/Reaktionen |
| 1× Umgebungskamera | Atmo, Publikum, Lokal |

**Kommentatoren:** 2 (Lead + Support), auf Deutsch  
**Helfer:** 2 TFCZ-Mitglieder (Strom, Internet, Support)  
**Technik:** Externes Streamteam (bringt Technik mit)

---

## Kosten (wenn eingekauft)

- Ca. **CHF 2'000.-** pro Streamabend (externes Streamteam)
- Alternativ: Revenue-Split oder Hybridmodell

---

## Plattform-Entscheid (noch offen)

| | **YouTube** | **Twitch** |
|---|---|---|
| Monetarisierung | Besser (AdSense, Memberships) | Schlechter |
| Highlights/VOD | Einfacher | Eingeschränkter |
| Community-Features | Weniger direkt | Stärker |
| Live-Interaktion | Gut | Sehr gut |
| Algorithmus-Reichweite | Hoch (SEO) | Eingeschränkter |
| Empfehlung | **Primär für Monetarisierung** | **Primär für Community** |

> Noch kein definitiver Entscheid. Strategisch abwägen: Was ist die Hauptpriorität — Reichweite oder Community?

---

## Content-Typen

- **Live-Stream** — Turniertag (Qualifikation + KO, je nach Entscheid)
- **Highlightschnitte** — nach dem Event
- **Interviews** — Spieler vor/nach Spielen
- **Kurzformate** — für Instagram (Reels aus Stream-Material)

---

## Für die geplante Turnierserie (Premier League)

Streaming ist **zentral** für das Format. Ideen:
- Regelmässige wöchentliche Spieltage = kontinuierliche Stream-Präsenz aufbauen
- Spielerpersönlichkeiten durch Interviews und Porträts aufbauen
- Zuschauer aktivieren: Ranglisten, Votings, Beliebtheitswert
- Sponsor-Integration via Overlays, Namensnennung, Produkt-Placements

---

## Stream-Overlays (gebaut — OBS)

Werkzeug: **OBS** (Browser-Quellen). Broadcast-Overlays im TFCZ-Look, Stil „Profi-Sport".
Dateien im Projektordner: `TFCZ/01_Web/OBS-Stream-Overlay/`
- `tfcz-overlay.html` — die sichtbaren Einblendungen (Browser-Quelle 1920×1080, transparent)
- `tfcz-control.html` — Steuerpult (Namen, Tore, Sätze, Ein-/Ausblenden), Live-Sync via localStorage + BroadcastChannel
- `_Vorschau.html` — Vorschau/Animationstest ohne OBS
- `ANLEITUNG.md` — Setup & Bedienung

### Elemente (Stand 2026-06-18)
- [x] **Marken-Rahmen** — blaue Linie oben, goldene unten (permanentes Markenzeichen, siehe `brand-guide.md`)
- [x] **Logo-Bug** oben links (weiss, brand-konform)
- [x] **Lower-Third unten links — Tennis-Stil:** Titel-Tag, zwei Spielerzeilen, Sätze als Spalten (Gewinner pro Satz in Gold, laufender Satz als letzte Spalte). Kein separater Score-Bug oben mehr — alles unten links gebündelt.
- [x] **Satzgewinn-Zoom** — Gewinner-Zahl zoomt gross auf (Gold-Glow), nur auf der Siegerseite
- [x] **Resultate-Karussell** oben rechts — scrollt endlos durch parallele Spiele (z.B. 10 Tische), 3 sichtbar, mit LIVE-Badge
- [x] **Nationen-Flaggen** — sehr schlicht, je Spieler via Kürzel `[CH]` `[DE]` `[AT]` `[FR]` `[IT]` `[ES]` `[PT]` im Namensfeld
- [x] **Turniername** oben Mitte — wird später **automatisch aus Coral webgescraped**
- [x] **Instagram-Bug** unten rechts — dezent (@tischfussballclubzuerich)
- [ ] **Sponsor-Logo-Platz** — noch offen
- [ ] **Intro-/Outro-Animation** — noch offen
- [ ] **Zwischen-Match-Screens** (Tableau/Rangliste, „gleich geht's los") — später

### Entscheide (2026-06-18)
- Nur **Tisch 1** wird gestreamt.
- **Kein QR-Code** — das Publikum schaut den Stream ohnehin am Handy.
- **Kein Match-Kontext** (H2H/Stats/Aufschlag) gewünscht — bewusst schlicht.
- **Kein LIVE-Badge** — entfernt.

### Feinschliff (2026-06-18, 2. Runde)
- **LIVE-Badge** komplett entfernt.
- **Turniername** dezenter (frosted/transparent, dünner) — klar abgesetzt vom Resultate-Panel.
- Panel umbenannt in **„Gespielte Spiele"**, weicheres (frosted) Blau; zeigt **Satz-Resultate**
  (Best of 3 → 2-0/2-1, Best of 5 → 3-1 …); **Sieger farblich** hervorgehoben, Verlierer gedimmt.
- **Best-of-Anzeige** unten links (BEST OF 3 / 5).
- **Satzgewinn-Animation:** zusätzlich poppt jetzt auch der **Gewinner-Name** (Zeilen-Flash + Scale).
- **Spielerwechsel-Animation** auffälliger/langsamer (Slide + Gold-Ring-Flash).
- **Verein-Infos** unten rechts — jetzt **eine schlichte Zeile** (Insta · Website · Adresse), gleich grosse Icons, weicher.
- **Logo:** Original-Farbversion (blau, `Logo-Main-Secondary-Colored-RGB-01`, beschnitten → `assets/tfcz-logo-color.png`), **deutlich grösser** skaliert.
- **Font:** Nunito Sans (verbindlich) — via Google Fonts geladen.
- **Spielmodus:** Satz bis 5 Tore; Entscheidungssatz mit 2 Abstand bis max. 8 (Best-of-abhängig).

### Spielmodus (eingebaut)
Best-of-5: Satz bis 5 Tore, Entscheidungssatz (5.) bis 8. Overlay zeigt Satzziel automatisch.

### Referenz
Vorlage für die Tennis-Satzanzeige war das bestehende On-Stream-Scoreboard
(Open Doubles / A-Tableau / Final). Sieger pro Satz bewusst in **Gold** statt Cyan (TFCZ-Identität).

---

## Offene Fragen

- YouTube oder Twitch als Primärplattform?
- Eigenes Stream-Equipment aufbauen oder immer extern einkaufen?
- Revenue-Split-Modell mit Streamteam: Konditionen definieren
- Wie oft streamen — nur Grossturniere oder auch Mittwochs-DYP?
- Clip-Verwertung für Instagram automatisieren?
