# TFCZ Website — To-Do (Neustart nach Reset, 14.07.2026)

Stand: Seiten sind auf dem funktionierenden Backup-Stand zurückgesetzt.
Diese Liste enthält **nur, was du wolltest**: echte Bugs und Design-Wünsche.
Die strukturellen Umbauten (CSS-Bibliothek, Tokens, Modul-Auslagerung) sind
bewusst **nicht** drin — die haben mehr kaputt gemacht als gelöst.

**Arbeitsregel:** EIN Punkt nach dem anderen. Nach jedem Punkt: Seite neu laden,
ansehen, freigeben. Erst dann der nächste. Keine Sammel-Batches mehr.

Alle Module aus den Batches liegen inaktiv in `_module/` und können einzeln
zurückgeholt werden (siehe Abschnitt „Aus `_module/` zurückholen").

---

## A · Echte Bugs (waren schon vor den Batches da)

- [x] **Footer auf Unterseiten**: kürzer und transparenter als auf der Home.
 Soll: überall identisch, über die **volle Breite**.
- [x] **Footer-Inhalt zentrieren**: Logo + „Tischfussball Club Zürich" + Adresse,
 Nav-Links und Copyright mittig. **Mail-Adresse zentriert unter dem Copyright.**
- [x] **Footer-Link zum Brand Guide** fehlt.
- [x] **Verirrtes `{T}`-Zeichen** unten links auf mehreren Seiten entfernen.
- [x] **Kontrast**: blaue Headline-Akzente auf dunklem Foto (Training) sind kaum
 lesbar → Akzent in **Gold** oder Weiss. (Regel: Blau nie als Headline auf dunklem Grund.)
- [x] **Goldener Balken am Unterseiten-Menü ist abgerundet** → soll **gerade** sein
 (auch im Brand Guide und im Starter-Template).

## B · CTA-Ziele (führen ins Leere / an die falsche Stelle)

- [x] „Mitglied werden" auf **Geschichte** zeigt auf den Home-Anker → `mitglied.html`
- [x] „Mitglied werden" auf **Über uns** zeigt auf den Home-Anker → `mitglied.html`
- [x] Nav-Link „Mitglied" auf **Regeln** zeigt auf den Home-Anker → `mitglied.html`
- [x] Gold-CTA „Erster Abend gratis" auf der **Home** führt nur zum Abschnitt →
 soll auf `mitglied.html` (Paket Schnuppern)
- [x] **Regel festhalten:** Gold nur für echte Conversion („Mitglied werden").
 Login = Ghost, Registrieren = Blau. Benannte CTAs führen immer ans gleiche Ziel.

## C · Menü / Navigation

- [x] **Burger fehlt auf den Unterseiten** — er ist nur auf der Home. Soll auf
 **jeder** Seite sichtbar sein.
- [x] **Zurück-Knopf** soll ein **Knopf** sein und **links vom Burger** stehen.
- [x] **Nav-Hover folgt der Menü-Ausrichtung:**
 linksbündiges Menü (Unterseiten) → **blauer Strich OBERHALB** des Textes ·
 rechtsbündiges Menü (Home) → **goldener Strich UNTERHALB**.
 Merksatz: Menü links = Strich oben/blau · Menü rechts = Strich unten/gold.
- [x] **Drawer**: hängt unter der Goldlinie, klappt als **Akkordeon nach unten** auf
 (kein Slide-in von rechts), **rechtsbündig am Fensterrand**, nimmt die **volle
 Seitenhöhe** ein.

## D · Icons & Emojis (Regel: keine Emojis, nur Lucide)

- [x] **Getränkeliste**: Emojis () durch Lucide-Icons ersetzen.
- [x] **Regel-Icons** auf Home + Regeln: 16 Emojis (…) durch Lucide ersetzen.
- [x] **Externe-Link-Pfeile** (↗) durch Lucide `external-link` ersetzen.
- [x] **Herz/Like am Foto-Player**: kein ``-Glyph, kein selbstgezeichneter Pfad →
 **Lucide-Herz**. Ruhe = weisse Outline, geliked = **blau gefüllt** (blau, nicht
 gold — ein Like ist eine Aktion, keine Conversion).
- [x] **Lucide-Bibliothek vervollständigen**: der Sprite kennt 1746 Icons, als
 Einzeldateien liegen nur 103 vor.
- [x] **Pfeil-CTAs**: überall derselbe Pfeil (Lucide `arrow-right`) mit **identischer**
 Hover-Animation — nie mal animiert, mal statisch, nie ein Text-Glyph „→".

## E · Foto-Galerie & Likes

- [x] **Training**: Foto-Strecke ist ein reines Marquee **ohne Bild-Player** →
 soll das Home-Karussell **mit Player** sein (X, Pfeile, Thumbnail-Dock, Like).
- [x] **Firmenevents**: dasselbe — Bilder sind nicht klickbar, kein Player.
- [x] **Like-Zähler pro Bild seiten-übergreifend teilen**: dasselbe Foto auf einer
 Unterseite zählt mit.
- [x] **Ein Like pro Nutzer und Bild** — er sieht sofort, dass er schon geliked hat.

## F · Barometer

- [x] **Im Brand Guide steht das FALSCHE Barometer** (vereinfachter Nachbau).
 Das richtige ist das von der Home (Tube + Beschreibungs-Panel mit Kennwert-Balken).
- [x] **Barometer-Icons** (oben Spass / unten Wettkampf) sind noch nicht die richtigen.
- [x] **Regel:** Barometer immer **zusammen mit dem Beschreibungs-Panel** — nie nur die Tube.

## G · Brand Guide (Design-Wünsche)

- [x] **Inhaltsverzeichnis links** als Sidebar — aufklappbar, **Default: offen**.
- [ ] **Effekte dokumentieren oder entfernen**: Flip-Cards, Zahlen-Counter,
 Parallax-Bänder, Shiny-Glow-Sweep, Text-hinter-Bild-Reveal. Undokumentiert = Fehler.
- [ ] **Tabellen-Stil** definieren und alle Tabellen daran angleichen.
- [ ] **Zeitstrahl** (Geschichte) im Brand Guide definieren.
- [ ] **Toggle / Sprach-Switcher** als Standard definieren (Pill, Gold = aktiv,
 Hover = Brand-Rahmen ohne Layout-Sprung).
- [ ] **Schatten-Regel**: grosse ruhende Container tragen keine schweren Schatten —
 sie decken das animierte Hintergrund-Punktfeld zu.

## H · Verhalten & Interaktion

- [x] **Portal-Schliessanimation**: jedes Fenster/Popup/Modal, das über X (oder Esc /
 Klick daneben) geschlossen wird, zieht sich vertikal zu einem **Lichtspalt**
 zusammen. Gilt für Bild-Player, Video-Modal, Tages-Maske, Barometer-Info,
 Menü-Drawer, Egg-Popup.
- [x] **Scroll zu Anker**: sanfteres, etwas langsameres Ausbremsen; Stopp unterhalb
 des sticky Menüs.
- [x] **Getränkeliste** überall identisch (eine Quelle) — später über Backend gefüllt.
- [x] **Karte** im **Dark-Mode**, und auch auf Firmenevents (wie auf der Home).

## I · Backend-Vorbereitung

- [x] **API-Schnittstellen anlegen** für: Getränke, Kalender/Events, Formulare,
 Login/Auth, Profil-Speichern, Likes.
 Zentral und **im Code auffindbar**, damit der Kollege sie findet und nutzen kann.
 (Vorbereitet in `_module/js/tfcz-api.js` + `_module/API.md`.)

---

## Aus `_module/` zurückholen (jeweils einzeln + Sichtprüfung)

Diese Module sind fertig und getestet, aber **nicht eingebunden**:

| Modul | Löst welche Punkte |
|---|---|
| `tfcz-footer.js` | A: Footer voll breit, zentriert, Brand-Guide-Link |
| `tfcz-gallery.js` + `tfcz-likes.js` | E: Karussell mit Player, Like-Zähler geteilt |
| `tfcz-drinks.js` | D/H: Getränkeliste eine Quelle, ohne Emojis |
| `tfcz-maps.js` | H: Karte im Dark-Mode |
| `tfcz-baro.js` | F: das richtige Barometer, überall gleich |
| `tfcz-drawer.js` + `tfcz-portal.js` | C/H: Burger überall, Drawer, Portal-Schliessen |
| `tfcz-ui.js` | D/H: Pfeil-CTAs, Scroll-zu-Anker |
| `tfcz-form.js` | Formularfelder + Brand-Dropdown einheitlich |
| `tfcz-api.js` | I: Backend-Schnittstellen |

**Nicht** zurückholen: `css/tfcz-base.css` und `css/tfcz-tokens.css` — die CSS-Bibliothek
war der Umbau, der die Seiten zerlegt hat. Wenn wir das je wieder angehen, dann
langsam, Klasse für Klasse, mit Sichtprüfung.

## Offen · Bugs (14.07.2026 notiert)

- **`design-studio.html`: 3 JS-Fehler beim Laden.** Bestehen unabhängig von den Bausteinen (schon vor
  dem Emoji-Purge und vor dem Portal-Umbau vorhanden — gegen Snapshot geprüft). Noch nicht analysiert,
  nicht untergehen lassen.
