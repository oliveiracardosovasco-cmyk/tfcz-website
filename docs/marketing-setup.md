# TFCZ Marketing-Setup – Struktur & AI-Workflow

> Claude-generated — letzte Aktualisierung: 2026-06-16  
> Vasco Oliveira — Marketing TFCZ (kein Vorstand)

---

## Was der Verein macht

| Bereich | Details |
|---|---|
| **Offenes Training** | Di ab 18:00 |
| **Mittwochs-DYP** | Mi ab 19:00 (Start 20:15) |
| **Turniere** | STF Regio Tour (4×/Jahr), DYP-Challenge, Zürich Open |
| **Firmenevents** | Teambuilding / Firmenanlässe im Clublokal |
| **Kindertraining** | Eigenes Angebot |
| **Erwachsenentraining** | Eigenes Angebot |
| **Vermietung** | Lokal vermietbar |
| **Livestream** | YouTube-Stream bei Turnieren (Kameras + Kommentator) |

**Lokal:** Landenbergstrasse 10, 8037 Zürich (Wipkingen)  
**Social:** Instagram @tischfussballclub_zuerich | Facebook-Gruppe | WhatsApp-Gruppe  
**Website:** tfcz.ch (ClubDesk CMS → geplanter Neubau)

---

## Wo was läuft (Tool-Architektur)

### Obsidian / Claude (Vascos Denk- und Arbeitswerkzeug)
Obsidian bleibt Vascos persönliches Second Brain. Claude schreibt in `wiki/tfcz/`.  
**Hier rein:** Strategie, Analysen, Content-Pläne, Briefings, AI-Outputs.

| wiki/tfcz/ Datei | Inhalt |
|---|---|
| `brand-guide.md` | Farben, Logos, Schriften – Quick Reference |
| `turniere.md` | Turnier-Abläufe, Checklisten, Coral-System |
| `marketing-setup.md` | Diese Datei – Gesamtübersicht |
| `content-strategie.md` | Inhalte, Tonalität, Zielgruppen, Kanäle |
| `website-briefing.md` | Anforderungen neue Website |
| `firmenevents.md` | Angebot, Preise, Pitch-Texte |
| `livestream-setup.md` | Kamera-Setup, Overlays, Kommentatoren-Brief |
| `screen-content.md` | Content für Screens im Clublokal |

### Google Drive (Team-Kollaboration)
Für alles, was andere Vereinsmitglieder lesen/bearbeiten müssen.  
Obsidian Sync für mehrere User ist aufwändig — Drive ist einfacher und kostenlos.

**Empfohlene Drive-Struktur:**
```
TFCZ/
├── 🎨 Branding/
│   ├── Brand Guide 2026.pdf
│   ├── Logos/  (alle Varianten: SVG, PNG schwarz, blau, weiss)
│   └── Farben & Fonts.md
├── 📣 Marketing/
│   ├── Content-Plan/  (monatliche Tabellen)
│   ├── Social Media/  (Post-Vorlagen, Bildmaterial)
│   └── Vorlagen/  (Flyer, Einladungen, Ankündigungen)
├── 🏆 Turniere/
│   ├── Leitfäden/  (Turniertag-Handbuch etc.)
│   ├── Ausschreibungen/
│   └── Ergebnisse/
├── 💼 Firmenevents/
│   ├── Angebote/
│   └── Präsentationen/
├── 📺 Livestream & Screens/
│   ├── Overlays/  (Intro, Outro, Lower Thirds)
│   ├── Kamera-Setup/
│   └── Screen-Content/  (was läuft auf den Lokal-Screens)
├── 💻 Software/
│   ├── Kassensystem/  (Doku, Anleitung)
│   └── Coral/  (Anleitung, Manuals)
└── 📋 Protokolle/
    └── (Vorstandssitzungen, Beschlüsse)
```

---

## Marketing-Aufgaben und AI-Unterstützung

| Aufgabe | Claude kann helfen mit |
|---|---|
| Social Media Posts | Text + Hashtag-Vorschläge, brand-konform |
| Turnier-Ankündigungen | Texte für Website, Instagram, WhatsApp |
| Firmenevent-Pitch | Angebots-Texte, E-Mail-Vorlagen |
| Website-Texte | Pro Zielgruppe (Einsteiger, Profi, Firmen) |
| YouTube-Intro/Outro-Text | Kommentator-Briefing, Overlay-Beschreibungen |
| Screen-Content (Lokal) | Slide-Texte, Ankündigungen |
| Content-Plan | Monatliche Planung basierend auf Turnierkalender |
| Branding-Check | Prüft ob ein Text/Konzept Brand Guide-konform ist |

---

## AI-Workflows (Claude-Kommandos)

### Turnier-Ankündigung generieren
```
QUERY: TFCZ
Frage: Schreib eine Instagram-Ankündigung für das Zürich Open am [Datum]
Format: Instagram-Post (max. 200 Wörter + 5 Hashtags)
Hinweis: turniere.md, brand-guide.md
Ton: Energetisch, einladend, auf Deutsch
```

### Content-Plan erstellen
```
QUERY: TFCZ
Frage: Erstelle Content-Plan für Juli 2026 basierend auf Turnierkalender
Format: Tabelle (Datum | Kanal | Thema | Format | Owner)
Hinweis: turniere.md – nächster Termin 18.07.2026
```

### Firmenevent-Pitch
```
QUERY: TFCZ
Frage: Schreib einen kurzen E-Mail-Pitch für Firmenevents
Format: E-Mail (max. 150 Wörter, subject line + body)
Zielgruppe: HR Manager, Zürich
```

### Brand-Compliance-Check
```
QUERY: TFCZ
Frage: Ist der folgende Text/dieses Konzept brand-konform?
Text: [EINFÜGEN]
Hinweis: brand-guide.md
```

---

## Offene Projekte (Roadmap)

| Projekt | Status | Priorität |
|---|---|---|
| Neue Website | Planung | Hoch |
| Kassensoftware-Doku | In Arbeit | Mittel |
| Screen-Content System | Konzept | Mittel |
| Livestream-Overlays / Layout | Konzept | Mittel |
| Brand Guide im Team teilen | Bereit | Hoch |
| Google Drive aufsetzen | → nächster Schritt | Hoch |
| Content-Strategie definieren | → nach Drive | Mittel |

---

## Zielgruppen

| Segment | Beschreibung |
|---|---|
| **Einsteiger** | Interesse an Tischfussball, noch nicht Mitglied |
| **Aktive Mitglieder** | Spielen regelmässig, nehmen an Turnieren teil |
| **Profis / Turnierspieler** | Kommen für STF-Regio, kennen Coral/ITSF |
| **Firmen / HR** | Suchen Teambuilding-Aktivität, Wipkingen/Zürich |
| **Familien / Kinder** | Kindertraining-Zielgruppe |

---

## Tonalität TFCZ

- **Sprache:** Deutsch (Schweizer Konventionen — ss statt ß, CHF statt €)
- **Stil:** Sportlich-herzlich, einladend, nicht akademisch
- **Werte:** Spass, Gemeinschaft, Sport für alle — vom Anfänger bis zum Profi
- **Vermeiden:** Zu formell, elitär, exclusiv klingend
