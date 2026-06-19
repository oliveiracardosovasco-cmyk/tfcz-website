# TFCZ Flyer-Guide – Prompts & Briefs

> Claude-generated | 2026-06-17  
> Ziel: Mit minimalem Aufwand brand-konforme Flyer per Claude-Prompt erstellen

---

## Wie Flyer-Erstellung funktioniert

Claude kann keine Bild-Dateien direkt erstellen. Was Claude liefert:
1. **HTML-Mockup** (pixelgenaues Preview im Browser, druckbar)
2. **Design-Brief** (für Canva, Illustrator oder einen Grafiker)
3. **Texte & Copy** (alle Inhalte fertig formuliert)
4. **AI-Image-Prompt** (für Midjourney, DALL-E als Hintergrundbild)

---

## STIL 1: Professional / Sport

**Einsatz:** STF Regio, Zürich Open, Premier League, grosse Turniere

### Visuelle Merkmale
- **Hintergrund:** Dunkel (#0d273d Navy oder Schwarz) + Foto-Overlay (Tisch-Nahaufnahme, spielende Hände), Foto bei 40–60% Deckkraft
- **Primärfarbe:** TFCZ Blue `#4489c7` für Infospalte, Boxen
- **Akzentfarbe:** TFCZ Gold `#cda857` für Preisgeld, Highlights
- **Text:** Weiss (fett) für Headlines, Hellgrau für Subtext
- **Font:** Nunito Sans Black / Extrabold für Titel, Bold für Info, Regular für Fliesstext
- **Logo:** Oben links, weisse Version (mit graphic device)
- **Struktur:** 2 Spalten — links: Kerndaten, rechts: Preise/Modus
- **Anker unten:** Grosser, breiter Titelschriftzug (z.B. „ZÜRICH TOUR 2/4")
- **Datums-Leiste:** Alle Serienturniere oben rechts, aktives Datum hervorgehoben (Gold)

### Claude-Prompt: Turnier-Ankündigung (Stil 1)

```
FLYER: TFCZ Stil 1 (Professional/Sport)

Erstelle ein HTML-Flyer-Mockup für folgendes Turnier:

Event: [NAME]
Datum: [DATUM]
Start: [UHRZEIT]
Ort: Clublokal TFCZ, Landenbergstrasse 10, 8037 Zürich
Format: [z.B. Open Doubles, ITSF-Regelwerk]
Tische: [Anzahl + Typ]
Max. Teams: [Zahl]
Startgeld: CHF [Betrag] / Person
Anmeldung: [z.B. Coral / app.tablesoccer.org]
Modus: [z.B. 6 Runden Schweizer System + A/B/C KO]
Preise: [z.B. 1. CHF 600.-, 2. CHF 300.-, 3. CHF 150.-]
Tour-Preis: [falls Serie, z.B. Leonhart-Tisch CHF 2'200.-]
Side-Event: [falls vorhanden]
Serientitel (gross unten): [z.B. ZÜRICH TOUR 2/4]
Alle Seriendaten (klein): [z.B. 23.05. | 18.07. | 12.09. | 14.11.]

Design-Specs:
- Hintergrund: #0d273d (dunkel navy)
- TFCZ Blue Akzente: #4489c7
- Gold für Preise: #cda857
- Font: Nunito Sans (Google Fonts importieren)
- Logo oben links: weiss, Stil 1 (falls als SVG verfügbar, sonst Platzhalter)
- HTML single-file, 1080x1350px (Instagram Format) oder A4 (Print)
```

---

## STIL 2: Fun / Community

**Einsatz:** Käsekick, monatliche Fun-Events, niederschwellige Abende

### Visuelle Merkmale
- **Hintergrund:** Schwarz / sehr dunkles Dunkelgrau, mit Textur oder Grunge-Overlay
- **Hauptfarbe:** Gold/Gelb, Orange (kein TFCZ Blue als Primärfarbe)
- **Dekorative Elemente:** Themen-spezifisch (Käse, Raclette, Sirenen-Lichter, etc.)
- **Titel-Font:** Gross, dekorativ, thematisch (nicht Nunito Sans für Haupttitel)
- **Info-Boxen:** Mehrere kleine Boxen mit Rand (dunkler BG, heller Text)
- **Ton im Text:** Locker, direkt, mit Emojis und Ausrufezeichen
- **„Alle sind willkommen!"** prominent platziert
- **Preis:** CHF-Betrag sehr sichtbar
- **Community-Element:** Wall-of-Fame, Freigetränk für Sieger
- **Unten:** Nächste Durchführung + Datum „in Kalender notieren"
- **Slogan:** „TÖGGELI. RACLETTE. FREUNDE. LEGENDEN." oder ähnlich

### Claude-Prompt: Fun-Event-Ankündigung (Stil 2)

```
FLYER: TFCZ Stil 2 (Fun/Community)

Erstelle ein HTML-Flyer-Mockup für folgendes Event:

Event-Name: [z.B. "END OF MONTH KÄSEKICK"]
Nummer: [z.B. "7. Käsekick im TFCZ!"]
Datum: [DATUM, WOCHENTAG]
Start: [UHRZEIT, z.B. "Wir starten um 19:30 Uhr"]
Einsteigen bis: [UHRZEIT]
Ende ca.: [UHRZEIT]
Ort: Im Tischfussball Club Zürich, Landenbergstrasse 10
Format: [z.B. La-Regle-Monster-Crazy-DYP + Lord-Have-Mercy-KO]
Tische: [z.B. Garlando Deluxe + Leonhart]
Kosten: CHF [Betrag].-
Inklusive: [z.B. Ein Walliser Raclette]
Regeln: [z.B. Keine Bändeli/Handschuhe, kein Snake]
Darf mitspielen: [z.B. Ja klar! Alle herzlich willkommen]
Gewinnen: [z.B. Wall-of-Fame + Freigetränk]
Wiederholung: [z.B. Immer am letzten Freitag des Monats]
Haupt-Thema: [z.B. Käse / Raclette]
Slogan: [z.B. TÖGGELI. RACLETTE. FREUNDE. LEGENDEN.]
Ton: Locker, mit Emojis, einladend, humorvoll

Design-Specs:
- Hintergrund: Schwarz / sehr dunkel, Grunge-Textur
- Hauptakzente: Gold/Gelb (#e49b2c), Orange (#db7f27)
- Themen-Elemente: Relevant zum Thema (Food, Sirenen, etc.)
- Font: Dekorativ für Titel, klar für Info-Boxen
- Info in mehreren Boxen (Wann / Wer darf / Wo / Was gewinnen)
- TFCZ Logo klein unten (Platzhalter)
- HTML single-file, 1080x1350px (Instagram Format)
```

---

## Schnell-Workflow: Event → Flyer in 3 Schritten

1. **Kopiere den passenden Prompt** (Stil 1 oder Stil 2)
2. **Fülle die eckigen Klammern** mit den Eventdaten aus
3. **Schicke den Prompt an Claude** → bekommst HTML-Mockup zurück

Claude liefert: fertiges HTML (öffnen im Browser, Screenshot = Flyer)  
Für professionellen Druck: Brief aus HTML an Grafiker oder in Canva umsetzen.

---

## Farb-Cheatsheet (für copy-paste)

```
TFCZ Blue (Primary):     #4489c7
TFCZ Blue Dark:          #005a94
TFCZ Blue Navy:          #0d273d
TFCZ Blue Light:         #5ca7dc
TFCZ Gold (Primary):     #cda857
TFCZ Gold Light:         #e9c475
TFCZ Neutral:            #e6e3da
Orange Akzent:           #e49b2c / #db7f27
Schwarz:                 #000000
Weiss:                   #ffffff
```

---

## Checkliste vor Veröffentlichung

- [ ] Richtiger Stil (Sport oder Fun)?
- [ ] Alle Daten korrekt (Datum, Uhrzeit, Preis)?
- [ ] CHF mit Apostrophen (CHF 1'050.-)?
- [ ] Logo korrekt platziert?
- [ ] Anmeldelink/QR vorhanden?
- [ ] Brand-konform (keine falschen Farben, kein schiefes Logo)?
- [ ] Format passt zu Kanal (1080×1350 Insta, A4 Print)?
