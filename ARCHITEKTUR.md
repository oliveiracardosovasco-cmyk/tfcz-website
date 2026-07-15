# TFCZ Web — Architektur: eine Quelle für alles

Ziel: **Ein Punkt referenziert, alles folgt.** Ändere ich einen CTA, das Logo, die
Karte oder eine Farbe an EINER Stelle, ändert es sich auf allen Seiten.

Diese Datei beschreibt (1) wie das System aussieht und (2) **wie wir dorthin
migrieren, ohne die Seiten wieder zu zerlegen.**

---

## 1 · Warum der erste Versuch gescheitert ist

Nicht das Ziel war falsch, sondern die Methode:

- Ich habe die geteilten Klassen aus allen Seiten **herausgelöscht** und durch einen
  „Mehrheitswert" in einer gemeinsamen Datei ersetzt.
- Das ist ein Eingriff in acht Seiten **gleichzeitig** — jede Fehlentscheidung schlägt
  überall durch (Nav gebrochen, Abstände verschoben, Parallax raus, CTAs tot).
- Verifiziert wurde nur, dass kein Script abstürzt. Über Layout sagt das **nichts**.

**Konsequenz — drei harte Regeln:**

1. **Additiv, nie verschmelzend.** Wir führen neue Bausteine ein. Wir fassen
   bestehendes Seiten-CSS **nicht** an und löschen es nicht.
2. **Ein Baustein pro Runde.** Einbauen → ansehen → freigeben → erst dann der nächste.
3. **Visuelle Kontrolle gehört zur Fertigstellung.** „Kein JS-Fehler" ist kein Beweis.

---

## 2 · Wie das System aufgebaut ist

```
system/
  content.js          ← die INHALTE, die überall gleich sein müssen
  cta.js              ← CTA-Registry: Label → Ziel → Stil
  components/
    nav.js            ← Menübalken: Logo, Links, Zurück-Knopf, Burger, Drawer
    footer.js         ← Footer
    map.js            ← Karte
    gallery.js        ← Foto-Galerie + Bild-Player
    likes.js          ← Like-Zähler (pro Bild, seitenübergreifend)
    drinks.js         ← Getränkeliste
    baro.js           ← Fun-Barometer
    portal.js         ← Schliess-Animation für alle Fenster
  tokens.css          ← Farben, Abstände, Radien, Schatten  (ZULETZT, siehe §4)
```

### Das Prinzip: Bausteine hängen sich selbst ein

Die Seite schreibt **nur einen Platzhalter**, kein Markup:

```html
<div data-tfcz="footer"></div>
<div data-tfcz="map"></div>
<section data-tfcz="gallery"></section>
```

Der Baustein liefert Markup **und** sein eigenes CSS mit. Kein Copy-Paste zwischen
Seiten mehr. Ändere ich `footer.js`, ändert sich der Footer überall — automatisch.

**Wichtig:** Jeder Baustein bringt CSS mit **eigenem Präfix** (`.tfcz-footer`,
`.tfcz-map` …). Dadurch kollidiert er **nicht** mit dem bestehenden Seiten-CSS.
Genau das ist der Unterschied zum gescheiterten Versuch.

### Inhalte an einer Stelle (`content.js`)

Alles, was auf mehreren Seiten identisch sein muss:

```js
TFCZ.content = {
  logo:    'assets/img/logo-horizontal-white.png',   // das EINE Logo
  name:    'Tischfussball Club Zürich',
  adresse: 'Landenbergstrasse 10 · 8037 Zürich',
  mail:    'info@tfcz.ch',
  ort:     { lat: 47.3969, lng: 8.5312 },            // die EINE Koordinate
  social:  { instagram: '…', youtube: '…', whatsapp: '…' },
  getraenke: [ … ]                                    // die EINE Getränkeliste
}
```

Logo in der Menübar, Adresse im Footer, Pin auf der Karte — alles zieht von hier.

### CTAs an einer Stelle (`cta.js`)

```js
TFCZ.cta = {
  'mitglied-werden': { text:'Mitglied werden', href:'mitglied.html', stil:'gold'  },
  'training':        { text:'Training mit Philipp', href:'tfcz-training.html', stil:'blau' },
  'regeln':          { text:'Alle Regeln', href:'tfcz-regeln.html', stil:'ghost' },
  …
}
```

In der Seite steht nur:

```html
<a data-cta="mitglied-werden"></a>
```

Text, Ziel **und** Stil kommen aus der Registry. Ändere ich dort das Ziel oder die
Farbe, ändert es sich überall — auch wenn ein Dritter den Button einbaut.
Damit ist auch die Regel technisch erzwungen: **Gold gibt es nur für Conversion.**

### Der Brand Guide ist der Master

Der Brand Guide lädt **dieselben** Bausteine und **dieselbe** Registry. Was er zeigt,
**ist** das, was die Seiten benutzen — kein Nachbau. Wenn dort etwas anders aussieht
als auf der Seite, ist das ein Fehler und sofort sichtbar.

---

## 3 · Migration: wie wir dorthin kommen, ohne etwas zu zerstören

Pro Baustein immer derselbe Vierschritt:

1. **Baustein bauen** (isoliert, eigener Klassen-Präfix, eigenes CSS).
2. **Auf EINER Seite einbauen** — altes Markup dort durch den Platzhalter ersetzen.
   Alle anderen Seiten bleiben unberührt.
3. **Du schaust es an.** Stimmt es? → freigeben. Stimmt es nicht? → nur diese eine
   Seite zurückdrehen, sonst ist nichts passiert.
4. **Ausrollen** auf die restlichen Seiten, danach nochmals draufschauen.

Erst wenn ein Baustein freigegeben und ausgerollt ist, beginnt der nächste.

**Rückfahrkarte:** Vor jedem Baustein ein Git-Commit. Geht etwas schief, ist genau
ein Baustein rückgängig zu machen — nie mehr die ganze Seite.

---

## 4 · Reihenfolge (bewusst risikoarm zuerst)

| # | Baustein | Warum an dieser Stelle | Löst aus der To-Do |
|---|---|---|---|
| 1 | **Footer** | Klar abgegrenzter Block ganz unten. Fehler sind sofort sichtbar und harmlos. | A (Footer voll breit, zentriert, Mail, Brand-Guide-Link) |
| 2 | **CTA-Registry** | Ändert nur `href` und Stil einzelner Links. Kein Layout-Risiko. | B (alle falschen CTA-Ziele, Gold-Regel) |
| 3 | **Karte** | Ein isolierter Kasten. | H (Dark-Mode, auch auf Firmenevents) |
| 4 | **Galerie + Likes** | Ersetzt einen abgegrenzten Abschnitt. | E (Player auf Training/Firmenevents, geteilte Zähler) |
| 5 | **Getränke** | Nur eine Liste. | D/H |
| 6 | **Barometer** | Ein Block, aber komplexer. | F |
| 7 | **Portal-Schliessen** | Verhalten, kein Layout. | H |
| 8 | **Icons & Pfeile** | Viele kleine Stellen, aber je Stelle harmlos. | D |
| 9 | **Nav (Logo, Burger, Zurück)** | Greift auf JEDER Seite und ist am heikelsten → bewusst spät, in kleinen Schritten. | C |
| 10 | **Tokens / Typografie** | **Der invasivste Teil.** Nur wenn du es ausdrücklich willst, und dann Wert für Wert mit Sichtprüfung. | G (Schatten, Tabellen, Zeitstrahl, Toggle) |

Die Reihenfolge ist Absicht: Was **einen Block** betrifft, kommt zuerst. Was **jede
Seite** betrifft (Nav, Tokens), kommt zuletzt — und dann in kleinsten Schritten.

---

## 5 · Was wir NICHT wieder machen

- Keine gemeinsame CSS-Bibliothek durch **Verschmelzen** bestehender Klassen.
- Kein „Mehrheitswert" als kanonischer Wert. Kanonisch ist, was du freigibst.
- Keine Änderung an mehreren Seiten, bevor eine Seite freigegeben ist.
- Kein „ist verifiziert", wenn nur geprüft wurde, dass kein Script abstürzt.
