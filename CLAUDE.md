# TFCZ — Projektinstruktionen für Claude

Dieses Projekt ist die Arbeitsumgebung für alles rund um den **Tischfussball Club Zürich (TFCZ)**.
Wenn Vasco hier etwas anfragt, geht es um den Verein: Web/UI-Tools, Brand- & Print-Assets,
Dokumente/Texte oder Fotos/Events. Halte dich immer an den Brand Guide unten.

---

## 1. Marke & Brand-Specs (verbindlich)

**Verein:** Tischfussball Club Zürich (TFCZ), Zürich. Schweiz-Kontext: Währung **CHF**,
Inhalte oft auf **Deutsch** (Getränke, Schliessen, Gast, etc.).

**Farben (kanonisch — immer exakt diese Werte verwenden):**

| Rolle | Hex |
|---|---|
| Blau Primär | `#5ca7dc` |
| Blau Sekundär 1 | `#4489c7` |
| Blau Sekundär 2 | `#005a94` |
| Navy | `#0d273d` |
| Gold Primär | `#cda857` |
| Gold Sekundär 1 | `#e9c475` |
| Gold Sekundär 2 | `#e6e3da` |

**Typografie:** **Nunito Sans**. Gewichte im Einsatz: 400, 500, 700, 900.

**Brand-Line-Regel (STRIKT, keine Ausnahme in Print/Social):**
**Blau oben, Gold unten.** Kein Mischen, keine Verläufe in Print-/Social-Kontexten.
Dies war eine ausdrückliche Korrektur — bitte nie verletzen.

**Gold:** Premium-/Prestige-Sekundärfarbe, breit einsetzbar — nicht an eine einzelne
Event-Serie gebunden.

**CTA-Regel — Gold nur für Conversion (verbindlich, freigegeben Vasco 09.07.2026):** Der **goldene
CTA-Button** (`.btn-gold`) ist **ausschliesslich** Aktionen vorbehalten, die den Nutzer **in den
Verein bewegen** bzw. eine **echte Conversion** auslösen — primär **„Mitglied werden"** (und
gleichwertige Beitritts-/Anmelde-Handlungen). **Alle anderen** Buttons — Navigation, „mehr erfahren",
„Alle Regeln", Info-/Sekundär-Links — dürfen **NICHT goldig** sein und nutzen einen anderen CTA-Stil
(Ghost `.btn-ghost` bzw. blauer Aktions-Button). So bleibt Gold die knappe, wertvolle „Komm zu uns"-
Farbe und nutzt sich nicht ab. (Referenz: `index.html` — „Mitglied werden" = gold, „Alle Regeln" /
„Mehr erfahren" = ghost.)

**Ausnahme nur für Screen-UI:** In Kassensystem & Bar-Display ist ein
Links-nach-rechts-Verlauf **Blau→Gold** für dekorative Balken/Rahmen erlaubt und erwünscht
(getrennt von der Print-Brand-Line-Regel).

**Fenster-Signatur (Screen-UI, verbindlich — freigegeben Vasco 03.07.2026):**
Fenster, Modals, Popups und Cards im Screen-UI tragen die Brand-Line als **Rahmen**:
**oben eine blaue Linie (`#5ca7dc`), unten eine goldene Linie (`#cda857`)**, umgesetzt als
`border-top` / `border-bottom` auf dem **abgerundeten** Container (border-radius). Dadurch läuft die
Linie über die Rundung und **läuft an den Ecken schmaler aus** — genau dieser Effekt ist gewünscht.
Dicke ~3px. Das ist die **Standard-Umrahmung für alle UI-Fenster** und soll überall konsistent so
umgesetzt werden. (Ergänzt die Brand-Line-Regel „blau oben / gold unten"; Print/Social bleibt harter
Schnitt.)

**Einsatz der Fenster-Signatur (Präzisierung, freigegeben Vasco 04.07.2026):** Die Blau/Gold-Rahmen-
Signatur wird nur gesetzt, wenn es auf der Seite **genau ein Fenster/eine Box** gibt. Bei **mehreren
Fenstern/Boxen lenkt die Linie ab** — dann NICHT jede Box umranden, sondern die Marken-Signatur **einmal
als Seitenrahmen** zeigen (dünne blaue Linie ganz oben, goldene ganz unten am Viewport/Seite) und die
einzelnen Boxen dezent lösen (frosted Fläche + feine 1px-Border, ggf. Kategorie-Akzent als Seitenstreifen).
Print/Social bleibt davon unberührt (dort weiter blau oben / gold unten je Layout).

**Ausnahme — Sticky Menüs/Bars tragen IMMER die Streifen (freigegeben Vasco 04.07.2026):** Sobald ein
**sticky** Element existiert (Navbar, Toolbar, sticky Kopfzeile/Menü), bekommt dieses **immer** die
Brand-Line-Signatur (`border-top` blau `#5ca7dc` / `border-bottom` gold `#cda857` ~3px am abgerundeten
Container) — unabhängig davon, wie viele andere Boxen es auf der Seite gibt. Das sticky Menü ist der
dauerhafte Signatur-Träger der Seite; die restlichen Inhaltsboxen bleiben dezent (frosted + 1px-Border).

**Unterseiten-Menü (verbindlich, freigegeben Vasco 09.07.2026):** Jede **Unterseite** (alles ausser der
Home, z. B. `mitglied.html`, `tfcz-geschichte.html`, `tfcz-regeln.html`) trägt oben ein **sticky Menü mit
unten abgerundeten Ecken** (`border-radius:0 0 16px 16px`) plus Brand-Line-Signatur (blau oben `#5ca7dc` /
gold unten `#cda857` ~3px). **Feste Anordnung (verbindlich, freigegeben Vasco 09.07.2026):**
1. **Logo ganz links** (`flex:none`, verlinkt auf die Home `index.html`).
2. **Menüstruktur direkt daneben, nach LINKS eingerückt** — die Nav-Links sitzen unmittelbar rechts vom
   Logo (`.navlinks{margin-left:~18px}`), **nicht** über die ganze Breite nach rechts verteilt. Das Logo
   trägt **kein** `margin-right:auto` mehr.
3. **Zurück-Knopf, dann Burger — in dieser Reihenfolge (verbindlich, freigegeben Vasco 11.07.2026):**
   Rechts im Kopf steht zuerst der **Zurück-Knopf** „← Zur Website" (`.back{margin-left:auto}`, dezenter
   Ghost-**Button**; Hover = Brand-Rahmen blau oben/gold unten, nur via `inset box-shadow`), und **rechts
   daneben — als äusserstes Element — der Burger**. Der Zurück-Knopf steht also IMMER **links vom Burger**.
   Kein Gold-CTA an dieser Position.
4. **Der Burger ist auf JEDER Seite sichtbar — Home UND alle Unterseiten** (verbindlich, freigegeben
   Vasco 11.07.2026). Er war früher nur auf der Home; das ist ein Fehler. Umgesetzt als globales Modul
   `assets/js/tfcz-drawer.js`: es hängt den Burger („Scroll-Loop", blau/weiss/gold, wird NIE zum X) rechts
   im Kopf ein und erzeugt Scrim + Drawer (Drop-Cascade, aufklappbare Unterseiten-Gruppen, Login/
   Registrieren, Gold-CTA „Mitglied werden") am Body. Einbinden genügt:
   `<script defer src="assets/js/tfcz-portal.js"></script>` + `<script defer src="assets/js/tfcz-drawer.js"></script>`.
   Drawer-Links folgen der CTA-Registry (auf Unterseiten absolut auf `index.html#…`).

Wichtig: Die **Nav-Links sind die EIGENE In-Page-Navigation der Unterseite** (Anker auf die Sektionen DIESER
Seite, z. B. `#pakete`, `#formular`) — **NICHT** Reiter, die auf Home-Sektionen führen. Jede Unterseite hat
ihre eigene Navigation, genau wie `tfcz-geschichte.html` (`#welt`, `#nationen` …). Ein Zurück-Button allein
reicht nicht — die eigene Menüstruktur muss trotzdem da sein. Nav-Links: Hover = Gold-Unterstrich; auf
≤860px werden die Links ausgeblendet (Zurück-Button bleibt). Der **goldene Streifen unten ist abgerundet**
(läuft über die `border-radius:0 0 16px 16px`-Ecken schmaler aus). Referenz:
`ocsav - tfcz_Web/tfcz-geschichte.html`, `tfcz-regeln.html`, `mitglied.html`.

**Unterseiten = EXAKT gleiche Inhaltsbreite & Kopf-Masse wie Home (verbindlich, freigegeben Vasco
09.07.2026):** Jede Unterseite verwendet **denselben Inhalts-Container wie die Home** — `.wrap{max-width:
1160px; padding:0 22px}`, und das sticky Menü fluchtet über `padding:12px max(22px, calc((100% - 1160px)/2
+ 22px))` bündig mit `.wrap`. **Keine abweichenden Breiten** (nie 1000/1080px o. ä.) auf Unterseiten; Footer
(`.fwrap`) ebenfalls 1160px. Das **Logo im Kopf darf NIE schrumpfen/komprimiert werden**, wenn Nav-Links es
nach rechts drücken: Logo-Container `flex:none`, `img{height:38.8px; width:auto}` (Mobile 35.2px) — exakt
die Home-Werte. Solche Inkonsistenzen (Breite/Logo weichen von Home ab) dürfen nicht passieren.
**Ein einziges Logo über ALLE Seiten (verbindlich, freigegeben Vasco 09.07.2026):** Kopf/Nav aller Seiten
(Home + jede Unterseite) verwenden **immer dieselbe Logo-Datei** `assets/img/logo-horizontal-white.png` —
kein anderes Logo, kein Shield + Text-Wortmarke, kein neues Laden. Immer exakt dieselbe Datei nehmen.
**Logo-Klick (verbindlich, freigegeben Vasco 09.07.2026):** Das Kopf-Logo führt immer zur Home. Klick zeigt ein
**Press-Feedback**: `:active{transform:scale(.9)}` plus kurze Bounce-Animation `@keyframes logoPress` (scale 1 → .86 →
1.05 → 1, ~0.42s), Klasse `.pressed` per JS setzen; auf Unterseiten Navigation ~230ms verzögern, damit der Bounce
sichtbar ist. `prefers-reduced-motion` respektieren. Referenz/Live-Demo: `brandguide.html` → „4d · Logo".

**Auswahl-/Selektions-Status (Entscheidung 03.07.2026):** Die Blau/Gold-Doppellinie ist der
**Fenster-Signatur vorbehalten** — NICHT für markierte/selektierte Elemente verwenden (zu unruhig,
verwechselbar mit dem Fenster-Rahmen). **Selektion nutzt EINEN einzigen Brand-Akzent: Gold**
(`#cda857` / `#e9c475`) als Outline/Border — **konsistent über den ganzen Editor** (links wie rechts,
Format-Liste, Ebenen, Swatches, Inputs). Keine gemischten Blau-/Gold-Auswahlzustände mehr.

**Hover-Brand-Rahmen vs. Gold-Auswahl NIE gleichzeitig (verbindlich, freigegeben Vasco 07.07.2026):**
Auf der ganzen Seite gilt: der **Hover-Zustand** eines wählbaren Elements zeigt den **Brand-Rahmen**
(blaue Linie oben / goldene Linie unten), der **Auswahl-Zustand** zeigt den **Gold-Rahmen** — aber
**niemals beide am selben Element gleichzeitig**. Entweder das eine oder das andere. Konkret: sobald ein
Element gehovert wird, wird sein Gold-Auswahlrahmen unterdrückt und nur der Brand-Rahmen gezeigt
(umgesetzt via `.pre`/`:hover` überschreibt `.on`, bzw. JS setzt `.pre` nur wenn Element nicht selektiert).
Gilt überall: Barometer-Liste, Mitglieder-Karten, Wochen-Tage, Monatszellen, Tabs. „Heute" wird als
**goldene Zahl** markiert (kein Goldrahmen), damit es nie mit einem Brand-Hover kollidiert.

**Hover-Brand-Rahmen OHNE Layout-Sprung (verbindlich, freigegeben Vasco 09.07.2026 — NIE mehr verletzen):**
Der Brand-Hover (blaue Linie oben / goldene Linie unten) darf **niemals** die Box-Grösse verändern.
Wiederholter Fehler war: im `:hover` wird `border-top`/`border-bottom` in einer **anderen Dicke** gesetzt
(z. B. Grundzustand `border:1px` → Hover `border-top:2px … border-bottom:2px`). Dadurch wächst die Box um
1–2px und die goldene Linie / der Inhalt **springt nach unten**. Das ist verboten.
**Die EINZIG erlaubte Umsetzung des Hover-Brand-Rahmens ist `inset box-shadow` — nicht `border`:**

```css
/* Grundzustand: normale (ruhige) Border/Optik bleibt unverändert */
.el{ border:1px solid var(--card-brd); border-radius:8px; }
/* Hover: NUR box-shadow, verändert das Layout NIE, folgt der border-radius und läuft an den Ecken aus */
.el:hover{ box-shadow: inset 0 2px 0 var(--blue), inset 0 -2px 0 var(--gold); }
/* hat das Element schon eine Elevation-Shadow, beide kombinieren:
   box-shadow: inset 0 2px 0 var(--blue), inset 0 -2px 0 var(--gold), var(--e-1); */
```

Verbotene Muster (führen zum Sprung): im `:hover` `border-top:Npx …` / `border-bottom:Npx …` mit anderer
Dicke als im Grundzustand; oder `border:0` → Hover `border:2px` (auch mit Padding-Kompensation ist tabu,
weil fehleranfällig). Falls doch mit Border gearbeitet wird (Ausnahme), muss die **Border-Dicke im
Grundzustand bereits identisch** reserviert sein (`border-top/-bottom:Npx solid transparent`) und der Hover
ändert **ausschliesslich** `border-top-color`/`border-bottom-color`. Standard bleibt aber `inset box-shadow`.
Vor dem Ausliefern jeden neuen Hover-Brand-Rahmen gegen Layout-Sprung prüfen.

**Konkreter Wiederholungsfehler (Vasco 09.07.2026, „nie nie nie mehr"):** Der Zurück-Button `.nav .back`
(und generell jeder Button/Chip/Tab mit Ruhezustand-Border) wurde falsch umgesetzt als
`border:1px` im Grundzustand → `:hover{ border-color:transparent; border-top:2px …; border-bottom:2px … }`.
Das setzt die Border-Dicke von 1px auf 2px und schiebt die goldene Linie nach unten. **VERBOTEN.**
Der **einzig korrekte** Hover für solche Elemente (Grundzustand behält seine ruhige 1px-Border):

```css
.el:hover{ border-color:transparent; box-shadow: inset 0 2px 0 var(--blue), inset 0 -2px 0 var(--gold); }
/* mit Elevation: box-shadow: inset 0 2px 0 var(--blue), inset 0 -2px 0 var(--gold), var(--e-1); */
```

Merksatz: Im `:hover` steht **NIE** eine `border-top`/`border-bottom` mit px-Wert. Nur `box-shadow: inset …`
(und optional `border-color`). Gilt für `.nav .back`, `.acc-head`, alle Chips/Tabs/Cards — ausnahmslos.

**Editor-UI-Farbsemantik (verbindlich, 03.07.2026):** Jede Farbe hat GENAU eine Bedeutung —
- **Gold** = nur **Auswahl/Aktiv** (aktiver Tab, selektiertes Format/Ebene/Element, Dreh-Griff). Nie für Buttons/CTAs.
- **Blau** (`#4489c7`/`#5ca7dc`) = **Aktionen/Buttons** (Primär gefüllt; z. B. PNG, Neuer Flyer, Erstellen).
- **Neutral/Grau (ghost)** = sekundäre Aktionen.
- **Rot** (`#da2929`) = ungespeichert / Gefahr (z. B. Bearbeitungsmodus-Balken, Pflichtfeld-Marker).
- **Fokus** von Inputs = Gold-Rahmen (nicht Browser-Blau).
Gilt fürs Editor-UI; auf den **Flyern selbst** bleibt die Brand-Palette (Gold als Prestige/CTA erlaubt).

**Standard-Schliessen-Button „X" (verbindlich, freigegeben Vasco 09.07.2026):** Überall derselbe X-Button —
**runder Kreis 36px**, dezent (`background:rgba(255,255,255,.08)` + `1px` Border `--card-brd`), weisses X. **Hover =
TFCZ-Rot `#da2929`** (Fläche **und** Rand) **plus kurze „Quetsch"-Animation** (`@keyframes xsquish`: `scale(1,1)` →
`scale(1.22,.78)` → zurück, ~0.42s), **Klick/Active = `scale(.9)`**. Gilt für **alle** Modals/Popups/Masken/Drawer/
Sheets (Tages-Maske, Barometer-Info, Video-Modal, Menü-Drawer …) — kein anderer Schliessen-Stil mehr. Der Button sitzt
**innerhalb** seines Containers (nie mit negativem Offset ausserhalb einer `overflow:hidden`-Box, sonst wird er
abgeschnitten). Referenz-Keyframe: `xsquish` in `ocsav - tfcz_Web/index.html`.

**Standard-Menü-/Burger-Button „Scroll-Loop" (verbindlich, freigegeben Vasco 09.07.2026):** Der Menü-/Burger-Button
(und generell jeder Listen-Trigger) ist **überall derselbe**: **drei eng gestapelte Zeilen** (Breite ~22px, Höhe
~2.6px, `margin:~2.2px 0`) in **Brand-Farben — oben Blau `#5ca7dc`, Mitte Weiss, unten Gold `#cda857`**. Er wechselt
**NIE zu einem X** (er öffnet eine Liste/ein Menü, kein Schliessen-Symbol). Animation = **Scroll-Loop mit Bounce**:
beim Hover **und** beim Klick scrollen die drei Zeilen nacheinander (gestaffelt ~0.1s) nach unten weg und kommen oben
smooth wieder herein und positionieren sich neu. Umsetzung (Referenz `ocsav - tfcz_Web/index.html` → `.nav .burger`,
und `preview-burger-varianten-2.html` Variante 11):

```css
.burger{display:inline-grid; place-items:center; padding:9px 10px; border-radius:8px;
  background:rgba(255,255,255,.08); border:1px solid rgba(255,255,255,.28); cursor:pointer}
.burger .bl{display:block; width:22px; height:2.6px; border-radius:3px; margin:2.2px 0}
.burger .bl.a{background:var(--blue)} .burger .bl.b{background:#fff} .burger .bl.c{background:var(--gold)}
@keyframes burgerScroll{0%{transform:translateY(0);opacity:1}35%{transform:translateY(11px);opacity:0}
  36%{transform:translateY(-11px);opacity:0}100%{transform:translateY(0);opacity:1}}
.burger:hover .bl.a,.burger.anim .bl.a{animation:burgerScroll .6s cubic-bezier(.34,1.56,.64,1)}
.burger:hover .bl.b,.burger.anim .bl.b{animation:burgerScroll .6s cubic-bezier(.34,1.56,.64,1) .1s both}
.burger:hover .bl.c,.burger.anim .bl.c{animation:burgerScroll .6s cubic-bezier(.34,1.56,.64,1) .2s both}
```

Markup immer: `<button class="burger">​<span class="bl a"></span><span class="bl b"></span><span class="bl c"></span>​</button>`.
Bei Klick per JS kurz Klasse `.anim` setzen (für Touch, wo kein Hover existiert) und `prefers-reduced-motion` respektieren.

**Standard Menü-Aufklappen „Drop-Cascade" (verbindlich, freigegeben Vasco 09.07.2026):** Wenn die Menü-Liste/der
Drawer aufgeht, fallen die Einträge **gestaffelt von oben** mit leichtem Bounce herein (nicht alle gleichzeitig).
Umsetzung (Referenz `.drawer` in `index.html`, Live-Demo `brandguide.html` → „4c"):

```css
@keyframes drawerDrop{from{opacity:0; transform:translateY(-16px)}to{opacity:1; transform:none}}
.drawer a{opacity:0}
.drawer.open a{animation:drawerDrop .5s cubic-bezier(.34,1.56,.64,1) both}
.drawer.open a:nth-of-type(1){animation-delay:.05s} /* +.05s je weiterem Eintrag */
@media(prefers-reduced-motion:reduce){.drawer a{opacity:1} .drawer.open a{animation:none}}
```

**Zwei Hintergrund-Modi + Floating Lines (verbindlich, freigegeben Vasco 04.07.2026):** Screen-UIs haben
**zwei erlaubte Seiten-Hintergründe**, jeweils mit einem **animierten „floating Lines"-Feld** (magnetische
Diagonallinien ~116°, reagieren auf die Maus, driften im Leerlauf; `prefers-reduced-motion` respektieren):
- **Hell-Blau (Standard / Haupt-Look, z. B. Brand-Guide-Seite):** `linear-gradient(165deg, #5ca7dc, #4489c7,
  #005a94)` + dezente Gold-Radials.
- **Dunkel-Navy (Tools, POS, Dashboards, Overlays):** `linear-gradient(180deg, #0d273d, #0a1f31, #081826)`.
Zwischen den Modi kann umgeschaltet werden. **In BEIDEN Modi bleiben Boxen / Cards / Bausteine dunkel &
frosted — NIE heller Hintergrund** (DarkNavy-Gradient, leicht transparent + feine 1px-Border). Heller Sand
`#e6e3da` nur für Print/Social. Referenz: `ocsav - tfcz_Web/brandguide.html` (Umschalter oben rechts).

**Hintergrund-Zuordnung öffentlich vs. Login (STRIKT, freigegeben Vasco 09.07.2026 — überschreibt „Zwischen den
Modi kann umgeschaltet werden"):** Der **Dunkel-Navy-Hintergrund ist ausschliesslich den TFCZ-internen,
login-geschützten Bereichen** vorbehalten (Kassensystem/POS, Bar-Display, Livestudio/Overlay, Design Studio,
Cockpit/Buchhaltung, Admin — alles hinter einem Login). **Jede öffentliche Seite** (Website/Landingpages,
öffentliche Ausschreibungen, alles ohne Login) trägt **immer den Hellblau-Hintergrund** — auf öffentlichen Seiten
gibt es **keinen Umschalter und keinen Dark Mode**. Boxen/Cards/Bausteine bleiben in beiden Fällen dunkel & frosted.
(Auf der öffentlichen Website `ocsav - tfcz_Web/index.html` wurde der Dark-Mode-Umschalter daher entfernt.)

**Box-/Textbox-Flächen = DarkNavy-Gradient, leicht transparent (verbindlich, freigegeben Vasco 04.07.2026):**
Cards, Textboxen, Popups, Menüs & Bausteine nie als flache Einzelfarbe, sondern als **dunkler Navy-Gradient**
mit leichter Transparenz (Referenzwerte: `linear-gradient(155deg, rgba(17,34,51,.74), rgba(9,21,33,.60))`,
softe Variante `.52→.40`, Popups dichter `~.94→.92`) + `backdrop-filter:blur`. Ergänzt „keine hellen Boxen".

**Hintergrund-Animationen (Screen-UI, freigegeben Vasco 04.07.2026):** Bevorzugter Standard-Hintergrund ist
der **Schwerkraft-Wirbel** (Punktfeld, das um die Maus einen sanften Strudel bildet) — **dezente Farbstärke**
(Idle-Weiss ~.15, aktive Gold-Punkte ~.2–.58, kleine Punkte). Alternativ: **maus-getriggerte „floating Lines"**
(Diagonallinien ~116°). Beide laufen auch ohne Maus (Idle-Bewegung) und respektieren `prefers-reduced-motion`.
Weitere wiederverwendbare Effekte in `(archiviert: TFCZ/01_Web/hintergrund-spielwiese.html)`; copy-fertige Snippets im Brand Guide
(`ocsav - tfcz_Web/brandguide.html`). Nie über Print/Social. (Frühere statische Drift-Ebene ersetzt.)

**Turnier-/Kategorie-Farbsystem (freigegeben Vasco 04.07.2026):** Turniere werden nach Kategorie
eingefärbt (Akzent/Fläche, je nach Element):
- **Fun / für alle** (Käsekick, Offenes Training, Mittwochs Crazy DYP) = **helles Blau `#5ca7dc`**
  (= Käsekicks Hauptfarbe, wie im Flyer-Design-Studio).
- **Pro Turniere / Wettkampf** (STF Regio/STRT, Zürich Open) = **DarkNavy-Blau `#005a94`**.
  (Öffentlicher Begriff neu **„Pro Turniere"**, nicht mehr „Ranglisten-Turniere"; hier qualifiziert man sich für die SM.)
- **Elite** (alles ITSF: Schweizermeisterschaft, STS, P4P, Champions League, Nati, WM) = **Gold `#cda857` nur als Akzent**
  (Rahmen/Text/Badge), Box bleibt dunkel — Gold nie als Grossfläche. **Keine eigene Stufe „SM-Quali" mehr** — SM gehört zu Elite.

**Ausnahme für runde Icon-Rahmen (Insta-Highlights, Profil-/WhatsApp-Bilder, Ankündigungs-Icons)**
(freigegeben von Vasco, 02.07.2026): Der runde Icon-Ring nutzt einen **vertikalen Verlauf Blau→Gold**
(oben blau, unten gold). Wichtig: das Ring-/Icon-Blau ist **Logo-Blau `#4489c7` (Blau Sekundär 1)**,
NICHT das hellere `#5ca7dc`, damit Ring und Logo matchen. Story-/Print-Brand-Line bleibt harter
Schnitt Blau oben / Gold unten mit `#5ca7dc`. Icons: weiss, kein Text, alle auf gleiche Höhe
normalisiert (gleiches Padding). Ring-Specs: Aussenkante 538 (randvoll), **Breite 32** (schmal/edel),
**flacher Ring** (schlichter Blau→Gold-Verlauf, KEINE 3D-Dynamik/kein Glanz — bewusst zurückgenommen).
**Hintergrund der Icon-Scheibe: Radial-Gradient** aus brand-erlaubten Blautönen (innen `#005a94`,
aussen Navy `#0d273d`). Nur der Hauptchat trägt das Logo statt eines Icons. Umsetzung: Skill
**tfcz-icon-builder** (Ring-Stile: `flat` Standard, `gradient`=Tube, `split`).

---

## 2. Designprinzipien

- **Responsive ist nicht verhandelbar.** Frühere Versionen wurden abgelehnt, weil sie nicht
  voll responsive waren. Immer mit Breakpoints arbeiten (Referenz Bar-Display: 640 / 1024 / 1400px).
- **Dense but tappable** ist die UX-Philosophie für POS/Touch: Listen-/Grid-Layouts statt grosser
  Cards, für Touch (iPad-first) optimiert.
- **Farbgenauigkeit** gegen die kanonischen Werte oben prüfen — Farbabweichungen waren früher ein
  Reibungspunkt.
- Designentscheidungen im Brand Guide begründen; Abweichungen brauchen explizite Begründung.
- Primäres Output-Format für Design-Deliverables: **HTML/CSS** (Single-File bevorzugt).

**Wettkampf-/Format-Darstellung (Web) — PFLICHT (freigegeben Vasco 06.07.2026):** Wo immer die
Turnier-/Eventformate nach Wettkampf-Intensität gezeigt werden (Website/Landingpages), MUSS die
Darstellung den **Fun-Barometer (vertikale Tube, Spass oben / Elite unten) MIT einem
Beschreibungs-Panel kombinieren**, das pro gewählter Stufe Format/Meta + **Kennwert-Balken**
(z. B. Spass / Wettkampf / Einstieg) zeigt. Barometer und Balken-Panel gehören zusammen — nie nur eins.
Auswahl (Hover/Klick) einer Stufe steuert Tube-Level, Kategorie-Akzent und Panel-Inhalt.
**Icons am Barometer = Lucide** (`party-popper` oben für Spass, `trophy` unten für Wettkampf) — **nie Emojis**.
**Kein mitlaufender Marker-Stab** an der Tube: der Balken mit dem runden Knopf, der am Füllstand klebte, ist
**entfernt** (Vasco 14.07.2026) und darf nicht zurückkommen. Umsetzung: Baustein `system/components/baro.js`.
Referenz: `ocsav - tfcz_Web/tfcz-club.html` (Sektion „Formate & Wettkampf").

**Nie ein horizontaler Scrollbalken (STRIKT, freigegeben Vasco 07.07.2026):** Auf der ganzen Seite
und in jedem Container darf **niemals** ein horizontaler Scrollbalken entstehen — „das darf nie
passieren". Ursachen sind fast immer (a) ein flex-Textkind ohne `min-width:0`, das lange Strings nicht
schrumpfen lässt, oder (b) ein Scroll-Container mit `overflow-y:auto`, bei dem der Browser `overflow-x`
automatisch mit auf `auto` zieht. Gegenmittel: Text-Flex-Items bekommen `min-width:0`, vertikale
Scroll-Container setzen explizit `overflow-x:hidden`. Vor dem Ausliefern immer gegen ungewollten
X-Overflow prüfen. (Ergänzt „Responsive ist nicht verhandelbar".)

**Elevation-Schatten decken nie den animierten Hintergrund zu (verbindlich, Vasco 10.07.2026):** Grosse,
ruhende Layout-Container (Sektionen, Inhalts-/Demo-Boxen, Grids) tragen KEINE schweren Drop-Shadows —
nur feine 1px-Border + inset-Highlight (max. e-1). e-2/e-3 sind schwebenden Elementen vorbehalten:
Modals/Popups, sticky Bars, Hover-Lift. Grund (Wiederholungsfehler, u. a. brandguide.html):
grosse Schatten (~45% Schwarz, 30px Blur) fluten die Lücken zwischen den Boxen und decken das
Punktfeld/die Hintergrund-Animation komplett zu. Ebenfalls behoben 10.07.2026: brandguide.html
nutzt jetzt das globale `bg-swirl.js` (der dortige Inline-Wirbel hatte noch den alten Dauer-Idle-Stand).
Die Component Library ist versioniert (v2.1) und enthält neu Element-Galerien (Eingabe-Controls,
Navigations-Elemente, Feedback & Status, Daten & Listen), ein Starter-Template und Copy-Werkzeuge.

**Schliess-Animation „Portal" (verbindlich · Animation überarbeitet Vasco 14.07.2026):** **Jedes** Fenster,
Popup, Modal oder Overlay — alles, was über den **X-Button** (oder eine gleichwertige Schliess-Aktion: Esc,
Backdrop-Klick, „Weiter"-Button) geschlossen wird — verschwindet **IMMER** mit der **Portal-Animation**:
das Fenster holt kurz Luft, sinkt **weich** zu einem Lichtspalt zusammen und verblasst. Keine anderen
Schliess-Effekte (kein hartes Ausblenden, kein Wegschieben).

**Die Animation läuft über `transform` + `opacity` — NIE über `clip-path`** (Wechsel 14.07.2026): die alte
clip-path-Fassung wirkte hart und schnappend und lief nicht auf der GPU. Verbindliche Werte:

```css
@keyframes tfczPortalClose{
  0%{  opacity:1;  transform:scale(1,1)}
  22%{ opacity:1;  transform:scale(1.012,1.008)}   /* kurz Luft holen */
  55%{ opacity:.85;transform:scale(.995,.52)}
  85%{ opacity:.25;transform:scale(.985,.09)}
  100%{opacity:0;  transform:scale(.97,.012)}      /* Lichtspalt */
}
.tfcz-portal-closing{
  animation:tfczPortalClose .62s cubic-bezier(.22,.61,.24,1) forwards;
  transform-origin:center center; will-change:transform,opacity;
  backface-visibility:hidden; pointer-events:none;
}
```

**Warum so:** ~0.62s mit langem Ausbremsen (ease-out, kein Bounce) wirkt edel statt schnappend;
`transform`/`opacity` laufen auf der GPU (kein Layout, kein Repaint) — darum ruckelt nichts.
`prefers-reduced-motion` schliesst sofort.

Der **X-Button selbst** bleibt der Standard-X (runder Kreis 36px, Hover = Rot `#da2929` + `xsquish`,
Klick = `scale(.9)`).

**Umsetzung = Baustein `system/components/portal.js` (Single Source, aktiv seit 14.07.2026):**
Nie pro Fenster nachbauen, nie ein Fenster selbst ausblenden. Das Modul liefert die Klasse
`.tfcz-portal-closing` samt Keyframes und die API:

```js
TFCZ.portal.close(fensterEl, function(){ overlay.classList.remove('on'); });
// fensterEl = die BOX/das Fenster (nicht der Backdrop); erst DANACH verstecken/aufräumen
// Alias window.TFCZ_PORTAL bleibt bestehen (Design Studio ruft ihn so auf)
```

Doppelaufrufe (X + Esc gleichzeitig) sind abgesichert, ein Timeout-Sicherheitsnetz fängt ein
ausbleibendes `animationend` ab. **Verdrahtet:** Menü-Drawer, Tages-Maske und Video-Modal (`index.html`),
Bild-Player (`system/components/lightbox.js`), Barometer-Info-Sheet (`system/components/baro.js`),
Brand-Guide-Inhaltsverzeichnis (`assets/js/bg-toc.js`), Demo-Popup im Brand Guide und das **Design Studio**
(dessen lokale Portal-Kopie ist abgelöst). `_module/js/tfcz-portal.js` ist **abgelöst** und bleibt geparkt.

**Popup-Deselektierung / Schliessen (verbindlich, freigegeben Vasco 09.07.2026):** **Alle** Popups,
Modals und Overlays (Bild-Player/Lightbox, Video-Modal, Tages-Maske, Barometer-Info, Mail-Popup,
Egg-/Belohnungs-Popup, Menü-Drawer …) schliessen bei einem Klick **ausserhalb des eigentlichen
Inhalts**: Klick auf den **Backdrop**, auf den **Menü-Balken-Bereich** oder in die **leere Fläche
neben dem Inhalt** deselektiert und schliesst. Zusätzlich schliesst **Esc**. Aktiv bleiben nur der
Inhalt selbst und seine Steuerelemente (beim Bild-Player: Bild, Pfeile, X, Herz — Klick daneben oder
auf den Menübalken schliesst). Das ist die **Standard-Deselektierung für jedes neue Popup** — beim
Bauen immer mitnehmen (Backdrop-Klick + Esc + Klick-neben-Inhalt).

**Idle-Verhalten Hintergrund-Wirbel (verbindlich, freigegeben Vasco 09.07.2026):** Der Schwerkraft-
Wirbel (magnetisches Punktfeld) wirbelt **nur, solange sich die Maus bewegt**. Sobald die Maus
**stoppt** (~140 ms ohne Bewegung), hört das Wirbeln auf und die Punkte kehren **langsam & smooth per
Genie-Feder** an ihre Ausgangsposition zurück (Referenz: Feder ~`0.010`, Dämpfung ~`0.91`); bei
erneuter Mausbewegung startet der Wirbel sofort wieder. **Kein Dauer-Idle-Wirbel** mehr (früher kreiste
ein virtueller Mittelpunkt). Die Render-Schleife hält an, wenn alles zur Ruhe gekommen ist (CPU/Akku),
und startet bei Mausbewegung neu. `prefers-reduced-motion` respektieren. **Ein globales Modul als
einzige Quelle:** `ocsav - tfcz_Web/assets/js/bg-swirl.js` (erstellt bei Bedarf selbst `#bg`-Canvas +
CSS, greift auf **allen** Seiten). Nie mehr pro Seite inline duplizieren — jede neue Seite bindet nur
`<script defer src="assets/js/bg-swirl.js"></script>` ein. Werte zentral im Modul (Feder `0.010`,
Dämpfung `0.91`).

**Website-Kalender — verbindliche Interaktions-Muster (freigegeben Vasco 07.07.2026):** Referenz
`ocsav - tfcz_Web/index.html` (Sektion Kalender, Umschalter Woche/Monat).
- **Woche = Tage-Strip + scrollende Tagesliste.** Der Strip nutzt die **macOS-Dock-Lupe**: der
  gehoverte Tag wird am grössten, die Nachbarn skalieren graduell runter **und werden auseinander-
  geschoben** (symmetrische horizontale Margins, **nie Überlappung**). **Als wiederverwendbarer Baustein niedergeschrieben:** `system/components/dock-magnify.js` — rein GPU (`transform: translateX scale`), animiert **nie** `margin`, misst **nicht** pro Frame das Layout, und rundet den Fokuspunkt **nie** auf die nächste ganze Zelle (stufenlos interpolierter Pivot, sonst springt es sichtbar). Nutzbar für **jede** horizontale Reihe mit gleich breiten Kindern (nicht nur Tage); live im Brand Guide, Sektion 13b »Dock-Lupe«. Die Tages-Karten bleiben klein
  genug, dass die vergrösserte Karte **ohne Clipping** in die fixe Section-Höhe passt (Strip-Höhe/
  Section-Höhe wird dafür **nicht** vergrössert — nur die Karten verkleinern + Kopf-Padding als
  Vergrösserungs-Spielraum). Darunter scrollt die Tagesliste; sticky Tages-Header ohne den
  Kalenderbox-Rahmen zu überlappen.
- **Monat = 6-Wochen-Default.** Standardmässig werden **nur ~6 Wochen (der aktuelle Monat)**
  gezeigt; jeder Klick auf **„Mehr laden" fügt +2 Monate** an (6 Wochen → +2 → +2 …).
- **Monats-Fokuszelle** (angewählter/gehoverter Tag) zeigt pro Event **nur den Kategorie-Badge**
  (kein Uhrzeit-, kein Namens-Text) — der Badge ist die einzige Info in der Fokuszelle.
- **Selektion/Hover** folgen der globalen Regel: Hover = Brand-Rahmen (blau oben/gold unten),
  Auswahl = Gold-Rahmen, **nie beide gleichzeitig** am selben Element; „Heute" = goldene Zahl.

**Kalender-Kategorie „Fun" statt „Plausch" (freigegeben Vasco 07.07.2026):** Der interne Event-Key
`dyp` (Mittwochs-DYP / Plausch-Turnier) trägt im Kalender **Label und Kategorie-Badge „Fun"** (nicht
mehr „Plausch") und die **Fun-Farbe `#5ca7dc`** — konsistent mit Training & Käsekick (alle drei = Fun/
für alle). Der **Event-Titel** „Plausch-Turnier" bleibt als Name bestehen; nur Filter-Badge & Kategorie
heissen „Fun". Mapping: `ocsav - tfcz_Web/okapi-event-mapping.md`.

---

## 3. Laufende Workstreams (Kontext)

1. **Kassensystem (POS-App)** — Touch-optimierter, iPad-first Self-Service-Kiosk: Check-in +
   Getränke-Bestellung. Flows: Kasse Öffnen, Keyplayer Auswahl, Hauptübersicht, Getränkeauswahl,
   Bezahlung, Success, Kasse Schliessen, Sonderkonsumation. Richtung steht; Feintuning läuft.
2. **Bar-Preisanzeige** — HTML für permanenten 60-Zoll-Screen an der Bar. Voll responsive,
   3-Spalten-Grid auf grossen Screens, Produktkategorien mit Emoji-Icons + CHF-Preisen.
3. **Brand-Manual-Landingpage** — interaktiver digitaler Brand Guide (Klick-zum-Kopieren der
   Farbcodes, Logo-Integration).

---

## 3b. Versteckte Überraschung (Eier-Jagd) — GEHEIM (verbindlich, 11.07.2026)

Die Eier-Jagd auf der Website ist **kein offener Code**. Regeln:

- **Klartext-Quelle:** `ocsav - tfcz_Web/_secret/eggs.source.json` (Anzahl, Orte, Trigger, Sprüche,
  Texte). Der Ordner `_secret/` ist **gitignored**, wird **nie deployed** und **nie gepusht**.
  Dort liegen auch die xlsx mit den Texten, die alten Previews und `EGG_API.md`.
- **Bearbeiten:** `_secret/eggs.source.json` ändern → im Ordner `ocsav - tfcz_Web` ausführen:
  `node _secret/build-eggs.js`. Das verschlüsselt die Konfiguration neu in `assets/js/tfcz-fx.js`.
- **Ausgeliefert wird nur** `assets/js/tfcz-fx.js`: eine generische, konfig-getriebene Engine plus
  einen verschlüsselten Base64-Blob. **Keine Selektoren, keine Orte, keine Anzahl, keine Sprüche
  im Klartext.** Die Trigger-Typen sind generisch (`click`, `nav`, `multiclick`, `repeat`,
  `classcheck`, `scrollx`, `scrollend`, `circles`, `dot`).
- **Nie** wieder Ei-Orte/Anzahl/Texte hart in eine ausgelieferte Datei schreiben. Keine Wörter wie
  „Ei/Egg/Easter/Raclette" in Deploy-Dateinamen, Klassen oder IDs (Prefix ist `fx-`, Speicher-Keys
  `tfcz_fx_*`).
- **Ehrliche Einordnung:** Das ist **Verschleierung, keine Sicherheit.** Wer den Blob im Browser
  ausführt bzw. den Code instrumentiert, kommt an die Daten. Vor Lesen (Mensch oder KI) schützt es,
  vor gezieltem Extrahieren nicht. Echte Geheimhaltung ginge nur serverseitig — und auch nur, wenn
  der Betrachter keinen Server-/Secret-Zugriff hat.

---

## 4. Arbeitsweise mit Vasco

**Globale Nav-Verhalten auf JEDER Seite (verbindlich, freigegeben Vasco 09.07.2026):** Marken-weite
UI-Verhalten müssen auf **allen** Seiten (Home UND jede Unterseite/Landingpage) identisch vorhanden
sein — nie nur auf der Home. Insbesondere: das **animierte Kopf-Logo** (Klick = Press-Bounce
`@keyframes logoPress`, `.pressed` per JS, Navigation ~230ms verzögert; `prefers-reduced-motion`
respektieren), der **Burger „Scroll-Loop"**, das **Drop-Cascade**-Menü und die **Fenster-/Brand-Linien-
Signatur**. Beim Bauen einer neuen Seite immer diesen Nav-Baustein 1:1 mitnehmen (Referenz:
`index.html`). Solche Verhalten dürfen nie „nur Home" sein.

**Sprache — NIE gendern (verbindlich, freigegeben Vasco 09.07.2026):** In ALLEN TFCZ-Texten
(Web, Print, Social, Mails, Formulare, Captions) wird **nicht gegendert**. Keine Gender-Notationen
wie `:in` / `:innen` / `*in` / `*innen` / Binnen-I, **keine Doppelnennungen** („jede und jeder",
„Spielerinnen und Spieler") und möglichst keine umständlichen Partizip-Ersatzformen. Stattdessen das
**generische Maskulinum** oder eine **neutrale Umformulierung** nutzen (z. B. „Spieler", „jeder",
„Anfänger", „Gönner", „einer von uns", „Team", „alle", „Leute", „die Community"). Beispiele:
„Werd eine:r von uns" → „Werd einer von uns"; „Anfänger:innen" → „Anfänger"; „jede und jeder ist
willkommen" → „jeder ist willkommen" bzw. „alle sind willkommen". Gilt rückwirkend für bestehende
Texte und für jede neue Seite/Landingpage.

**KEINE EMOJIS — NIRGENDS. Icons sind IMMER Lucide (verbindlich, verschärft Vasco 14.07.2026):**
„Emojis weg. Immer weg." Das gilt für das **ganze Projekt**: Web-UI, Design/Flyer-Studio, Backend-Skripte,
Social-Captions, Persona-Daten, Brand Guide, Doku. Nicht nur als Icon, sondern **auch als Text-Schmuck**.
War ein Icon gemeint, kommt ein **Lucide**-Icon; war es Dekoration, wird es **ersatzlos gestrichen** (Text
sauber umformulieren). Das schliesst Symbol-Glyphen ein, die als Icon missbraucht wurden: `x`-Kreuz → Lucide
`x`, Häkchen → `check`, Stern → `star`, Pfeil-runter → `download`, Herz → `heart`; Länder-Flaggen → weg
(das Land steht als Text). Am 14.07.2026 wurden projektweit **400 Vorkommen in 19 Dateien** entfernt.
Vor jedem Ausliefern gegen Emoji-Unicode-Ranges scannen — Soll: **0**.
Grundsatz (unverändert): In UI/Web werden keine Emojis als Icons verwendet. Stattdessen ausschliesslich **Lucide-
Icons** (Open Source, ISC) aus der Icon-Bibliothek im Brand Guide (`brandguide.html` → Sektion „7c ·
Icons"). Icons liegen als Dateien unter `ocsav - tfcz_Web/assets/icons/lucide/*.svg`; der **maschinen-
lesbare Index** `ocsav - tfcz_Web/assets/icons/lucide-index.json` beschreibt pro Icon `name`, `tags`,
`use` und `category` — damit klar ist, welches Icon wann/wo passt. SVGs nutzen `stroke:currentColor`
(färben sich über `color`). Bestehende Emojis (z. B. in Getränkelisten) nach und nach durch passende
Lucide-Icons ersetzen.

- Vasco arbeitet **iterativ** mit detailliertem, spezifischem Feedback pro Runde — mehrere
  Verfeinerungszyklen einplanen.
- Vasco referenziert frühere Gespräche namentlich (z.B. „Design – Kasse – Players Ansicht") für
  Design-Kontinuität — **Konsistenz über Gespräche hinweg ist wichtig**.
- Antworten knapp und direkt halten (Vascos Präferenz).

---

## 5. Ordnerstruktur dieses Projekts (V3 — Stand 14.07.2026)

**Ein Ordner = ein Repo = ein Zweck.** Der Ordnername sagt, wohin gepusht wird.

```
TFCZ-v3/
├── CLAUDE.md                    ← diese Datei (EINZIGE Quelle der Wahrheit)
├── README.md                    ← Wegweiser: was liegt wo
│
├── ocsav - tfcz_Web/            ← DIE WEBSITE  →  Repo ocsav
│   ├── index.html               ← Home (früher tfcz-2026.html)
│   ├── mitglied · tfcz-training · tfcz-firmenevents · tfcz-regeln
│   ├── tfcz-ueber-uns · tfcz-geschichte · tfcz-medien · login
│   ├── brandguide.html   ← BRAND GUIDE (Referenz für jedes Bauteil)
│   ├── system/                  ← DIE BAUSTEINE (Single Source, aktiv)
│   │   ├── content.js           ← Inhalte: Name, Adresse, Mail, Logo, Koordinate, Seiten
│   │   ├── cta.js               ← CTA-Registry: Ziel + Stil je Button
│   │   └── components/          ← footer.js · cta.js · map.js (bauen sich selbst ein)
│   ├── ARCHITEKTUR.md           ← wie die Bausteine funktionieren + Reihenfolge
│   ├── TODO.md                  ← offene Bugs & Design-Wünsche
│   ├── _module/                 ← GEPARKTE Batch-Module — NICHT aktiv, nicht einbinden
│   ├── _snapshots/              ← Rollback-Stände (ohne git)
│   ├── _secret/                 ← Eier-Jagd-Klartext (gitignored, nie deployen)
│   └── assets/{css,js,img,fotos,icons,lottie,downloads}
│
├── picaso - tfcz_DesignStudio/  ← FLYER-GENERATOR  →  Repo picaso
│   ├── tfcz-flyer-generator.html
│   ├── backend/                 ← Node/Express/MySQL
│   └── assets/
│
├── Brand/                       ← Logo & Brand Guide (Master siehe §6)
├── Print-Social/                ← Flyer, Instagram, WhatsApp, Memes
└── Dokumente/                   ← Texte, Konzepte, Berichte
```

### Bild-Ablage — eine einzige Frage entscheidet (verbindlich, freigegeben Vasco 14.07.2026)

**Gezeichnet oder fotografiert?** Mehr muss man nicht wissen.

| Ordner | Inhalt | Wer ändert das |
|---|---|---|
| `assets/img/` | **Gezeichnetes:** Logo, Emblem, Pattern, Favicon | Anfassen = Brand-Entscheidung |
| `assets/img/tische/` | Herstellerlogos (Leonhart, Bonzini, Garlando …) — auch gezeichnet | selten |
| `assets/fotos/action/` | **Menschen, Spiel, Emotion** — Spielszenen, Wettkampf, Gesichter | Redaktion |
| `assets/fotos/atmosphaere/` | **Raum, Tische, Ausstattung, Stimmung** — das Drumherum, ohne Action | Redaktion |

Ein Logo tauscht man nie, ein Foto jede Saison — darum die Trennung. `action` = was passiert,
`atmosphaere` = wo es passiert.

**Regeln dazu:**
- **Nie Fotos in `img/`.** War der Altfehler (`c01`–`c12`, `g1`–`g6`, `hero-hall`, `wide-hall` lagen
  dort mit nichtssagenden Namen). Bereinigt am 14.07.2026 — `img/` enthält nur noch Gezeichnetes.
- **Dateinamen sind fortlaufend und sprechend:** `action-01.jpg`, `atmosphaere-01.jpg` — keine Lücken,
  keine Kürzel wie `c07`. Der Dateiname ist zugleich die **Like-ID** (`tfcz-likes.js`), also nach dem
  Veröffentlichen **nicht mehr umbenennen** — sonst startet der Like-Zähler des Bildes bei null.
- **Ausnahme — Motiv-Namen sind erlaubt**, wenn ein Bild eine feste inhaltliche Rolle hat und nicht
  Teil der Galerie-Reihe ist: `philipp.jpg` (Trainer), `bar.jpg`, `firmenevent.jpg`, `nachwuchs.jpg`.
  Diese liegen ebenfalls in `action/`, sind aber bewusst benannt statt nummeriert.

**Regeln:**
- **Neue Website-Seite** → bis die Vorlage als Baustein steht: von der Home `index.html` ableiten und
  die aktiven Bausteine einbinden (`system/content.js`, `system/cta.js`, `system/components/*.js`).
  Das alte `_template.html` liegt geparkt in `_module/` und ist **nicht** zu verwenden.
- **Keine `preview-*.html` mehr im Repo.** Design-Experimente gehören in einen Scratch-Ordner
  ausserhalb, nicht neben die Live-Seiten. (Der Altstand — 24 Previews, `index-v2`, `index-cms`,
  `tfcz-neu`, `tfcz-story`, `regeln-varianten`, `tfcz-club`, `tfcz-arcade` — liegt im alten Projekt
  `~/Claude/Projects/TFCZ`, das ab jetzt nur noch Archiv ist.)
- **Nicht mehr in der V3** (liegt im Archiv, auf Zuruf holbar): OBS-Stream-Overlay/Livestudio,
  `kagu-upload/`, alte Tools (`turnier-hierarchie`, `crazy-dyp-generator`, `website-neues-design`,
  `tfcz-dashboard-vorschau`, `GV2026_Praesentation`, `brand-guide-design-system`).

---

## 6. Wo liegen die Original-Assets

Die vollständige Asset-Bibliothek liegt im separaten Ordner **„TFCZ – Ordner"**
(`/Users/vascoairmac/Documents/Privat/TFCZ - Ordner`) mit:
`Brand Guide/` (PDF + HTML), `Logo/` (PNG/AI/EPS/PDF, RGB+CMYK, Pattern),
`Kleidung/` (Clubkleidung 2026), `Fotos/` (Event-Fotos: STF St. Gallen, STRT Tour, u.a.).
Details siehe `ASSETS.md`.

---

## 7. Quelle der Wahrheit & Main-Brain-Vault

**Diese Datei (`CLAUDE.md`) ist die EINZIGE Quelle der Wahrheit** für verbindliche TFCZ-Regeln
(Marke, Farben, Brand-Line, Arbeitsweise). Bei Widersprüchen gilt immer CLAUDE.md.

Der **Obsidian-Vault „Main Brain"** (`/Users/vascoairmac/Documents/Obsidian-MainBrain`,
TFCZ-Wiki unter `wiki/tfcz/`) ist die **abgeleitete Wissensbasis / Shared Club Brain** fürs Team —
kein konkurrierendes Regelwerk. Der Vault muss zu CLAUDE.md passen, nicht umgekehrt.

**Auto-Pflege:** Dauerhafte TFCZ-Entscheidungen aus Arbeitssessions fliessen automatisch in die
passende `wiki/tfcz/*.md` (z.B. Stream/Overlay → `streaming.md`, Markenregeln → `brand-guide.md`)
und werden im `wiki/_log.md` vermerkt. Verbindliche Regeln zusätzlich hier in CLAUDE.md festhalten.


---

## 8. Design Studio, YouTube & Livestudio (Tools-Stand, verbindlich)

**Design Studio** (`picaso - tfcz_DesignStudio/tfcz-flyer-generator.html`, Repo `tfcz-flyer-generator`, GitHub Pages)
= TFCZ-eigenes „Canva" für Flyer / Social / YouTube-Thumbnails.

**Git-Push-Ziel (verbindlich, V3-Fassung 14.07.2026):** Wenn Vasco sagt „pushe das Design Studio",
ist **immer das Repo `picaso`** gemeint: `https://github.com/tischfussball-club-zuerich/picaso.git`,
Branch `main`. Committet wird der **ganze Ordner `picaso - tfcz_DesignStudio/`** — der Ordnername IST
das Push-Ziel, kein Nachdenken nötig. Die alte Konstruktion mit nested `.git` in `website-v2` ist
mit der V3 **abgeschafft** (Website und Design Studio sind jetzt sauber getrennte Ordner/Repos).
Push über HTTPS mit PAT nur einmalig in der Push-URL (`x-access-token:<PAT>@…`), **nie** in
`.git/config` persistieren.

**Git-Push-Ziel Website (verbindlich, V3-Fassung 14.07.2026):** Wenn Vasco sagt „pushe die Website",
ist **immer das Repo `ocsav`** gemeint: `https://github.com/tischfussball-club-zuerich/ocsav.git`,
Branch `main`. Committet wird der **ganze Ordner `ocsav - tfcz_Web/`** (Remote `origin` → ocsav);
`_secret/` bleibt via `.gitignore` draussen. Also: **Ordner `ocsav - …` → Repo `ocsav`, Ordner
`picaso - …` → Repo `picaso`.** PAT nur einmalig in der Push-URL, nie in `.git/config`.

**Home heisst jetzt `index.html`** (früher `tfcz-2026.html`) — damit die Seite unter der nackten
Domain lädt, ohne Dateinamen im Link. Alle 37 internen Referenzen wurden mitgezogen.

- **Login/Rollen:** Beim Start Login-Fenster.
  - *Gast*: darf nur den **Text von Pflichtelementen** ändern (Flyer oder Pflichtfeld-Abfrage), sonst gesperrt; Ebenen zeigen nur Pflichtangaben.
  - *Admin* (Passwort **`tfcz`**): Vollzugriff. Kann Elemente als **Pflichtelement** markieren und den Flyer **„Als Vorlage speichern"**. **„Datei mit Vorlagen exportieren"** backt Vorlagen + Pflichtfelder deploybar in eine HTML-Datei.
- **Fun-Barometer** (Auswahl nach dem Login, nach Spass geordnet): E1 Käsekick · E2 Offenes Training · E3 Plausch-Turnier (Fun, `#5ca7dc`) · E4 Pro Turniere (Wettkampf, `#005a94`; SM-Quali läuft hier) · E5 Elite (alles ITSF inkl. SM, Gold-Akzent). Website-Barometer hat **5 Stufen** (kein separates „SM-Quali" mehr).
- **Fertige Vorlagen:** KäseKick, PRO. **Coming Soon:** DYP, Rangliste, Events.
- **YouTube-Tab** = eigenes **16:9-Thumbnail-Canvas**; rechts wählt man die **Event-Serie** (nicht Instagram/WhatsApp-Grössen). Standard-Design = Crazy DYP (1:1). Export **PNG 1280×720 + HTML**.
- **Editor-Semantik:** Gold = Auswahl/Aktiv, Blau = Aktion, Rot = ungespeichert; Snap zur Mitte + **Canva-Abstandsmessung/gleichmässige Verteilung**; **Lineal-Hilfslinien**; Refresh bleibt am Ort; Fenster-Signatur (blau oben/gold unten) je UI-Fenster bzw. einmal als Seitenrahmen; sticky Bars tragen sie immer.

**Livestudio / Overlay** (`picaso - tfcz_DesignStudio/OBS-Stream-Overlay/`): `tfcz-livestudio.html` (Steuerpult im
Design-Studio-Look **mit Live-Vorschau**) steuert `tfcz-overlay.html` (OBS-Browser-Quelle 1920×1080).
Elemente inkl. **Spieluhr, Satz-/Matchball, Vollbild-Szenen (Gleich los / Pause / Danke),
Interview-Lower-Third, Als-Nächstes-Ticker, Sponsor-Bug**; Lower-Third im Tennis-Stil + Resultate-Karussell.
Best-of-5 (Satz bis 5, Entscheidungssatz bis 8).

**Nachlesen im Vault:** `wiki/tfcz/flyer-guide.md` (Design Studio), `wiki/tfcz/streaming.md` (Livestudio/Overlay),
`wiki/tfcz/brand-guide.md` (Fun-Barometer + UI-Semantik), `wiki/tfcz/_log.md` (Änderungslog).

---

## 9. Governance, Architektur & globale Elemente (verbindlich, freigegeben Vasco 10.07.2026)

**Grundprinzip — Single Source of Truth (STRIKT):** Jedes UI-Element, das auf mehr als einer
Seite vorkommt, existiert **genau einmal** und wird überall wiederverwendet (gleiches Markup +
gleiche Logik). Ziel: ändert man das Element an einer Stelle, ändert es sich überall — die Website
muss von Dritten pflegbar sein, ohne raten zu müssen, wo etwas geändert wird.

**Reuse-First-Regel (STRIKT):** Bevor ein neues Element/eine neue Seite gebaut wird, IMMER zuerst
prüfen, ob das Element irgendwo schon existiert (grep über `ocsav - tfcz_Web`). Wenn ja → das
bestehende **1:1** übernehmen (inkl. aller Zustände/Player/Animationen), nie eine reduzierte
Nachbau-Variante. Beispiel-Fehler: Foto-Karussell ohne Media-Player nachbauen, obwohl das
Home-Karussell einen Player hat.

### Der Baustein-Stand — was WIRKLICH aktiv ist (Stand 14.07.2026)

**Wichtig:** Die früheren „Batch"-Module (`assets/js/tfcz-footer.js`, `tfcz-form.js`, `tfcz-gallery.js`,
`tfcz-likes.js`, `tfcz-drinks.js`, `tfcz-baro.js`, `tfcz-drawer.js`, `tfcz-portal.js`, `tfcz-ui.js`,
`tfcz-api.js`, `assets/css/tfcz-tokens.css`, `tfcz-base.css`, `_template.html`) sind **NICHT aktiv**.
Sie liegen geparkt in `ocsav - tfcz_Web/_module/` und werden **einzeln, einer nach dem anderen**
wieder eingebaut — additiv, mit eigenem Klassen-Präfix, ohne bestehendes Seiten-CSS umzuschreiben.
**Nie eine dieser Dateien einbinden, ohne dass der Baustein freigegeben ist.** Reihenfolge und Regeln:
`ocsav - tfcz_Web/ARCHITEKTUR.md`, offene Punkte: `TODO.md`.

**AKTIV (Single Source, überall eingebunden):**
- `system/content.js` — **die eine Inhalts-Quelle**: Vereinsname, Adresse, Mail, Logo, Koordinate
  (`TFCZ.content.ort`), Social-Links, Seiten-Registry. Ändert sich hier eine Zeile, ändert sie sich
  auf jeder Seite.
- `system/cta.js` — **die CTA-Registry** (Ziel **und** Stil je Button). Siehe „CTA-System" unten.
- `system/components/footer.js` — **Footer**, siehe unten.
- `system/components/cta.js` — verdrahtet `[data-cta]` (Ziel aus der Registry, Farbregel-Kontrolle).
- `system/components/map.js` — **Karte**, siehe unten.
- `system/likes.js` — **Like-Store** (ein Zähler je Bild-ID, seitenübergreifend), siehe unten.
- `system/drinks.js` + `system/components/drinks.js` — **Getränke-/Preisliste**, siehe unten.
- `system/components/baro.js` — **Fun-Barometer**, siehe unten.
- `system/components/portal.js` — **Portal-Schliessen** (jedes Fenster), siehe §2.
- `system/forms.js` + `system/components/form.js` — **Formulare**, siehe unten.
- `system/components/nav.js` — **Navigation** (Burger · Drawer · Hover · Scroll-Spy), siehe unten.
- `system/components/scroll.js` — **Scroll zu Anker** (Easing + Stopp unter dem Menü).
- `system/components/icons.js` — **Pfeile & externe Links** (Lucide statt Text-Glyphen).
- `system/components/dock-magnify.js` — **Dock-Lupe** (macOS-Dock-Vergrösserung für horizontale Reihen mit gleich breiten Kindern), siehe unten.
- `system/tokens.css` — **Design-Tokens** (Farben, Radien, Schatten, Zeiten, Easing), siehe unten.
- `system/components/lightbox.js` — **Bild-Player** (X · Pfeile · Thumbnail-Dock · Herz), siehe unten.
- `assets/js/bg-swirl.js` — Hintergrund-Wirbel (war nie Teil der Batches, bleibt).

**Aufruf-Reihenfolge im `<head>`:** `system/content.js` → `system/cta.js` → `system/components/*.js`
(alle `defer`). Der Baustein baut sich selbst; die Seite schreibt nur den Platzhalter.

**Offen / geplant (noch NICHT gebaut):** Geteilte CSS-Klassen-Bibliothek (`tfcz-base.css`), Icons/Pfeile, Nav (Logo · Burger · Drawer · Zurück), Design-Tokens,
Login/Auth. Was hier steht, ist **Zielbild, noch keine geltende Umsetzung**.

**Globale Elemente (Referenz = Home `index.html`):**
- **Footer** — überall identisch. Baustein `system/components/footer.js`; die Seite schreibt nur
  `<div data-tfcz="footer"></div>`. Inhalte kommen aus `system/content.js`. **Aktiv auf allen Seiten
  inkl. Brand Guide.**
- **Formulare** — **aktiv**: `system/forms.js` (Felder + Mail-Texte) + `system/components/form.js`
  (Verhalten: rendern, Pflichtfelder prüfen, Mail bauen, „Mail geöffnet?"-Fallback, Text kopieren).
  Die Seite schreibt nur `<form data-tfcz="form" data-form="<id>">`; die Felder kommen vom Baustein.
  **Acht Formulare** auf vier Seiten: `mitglied-schnuppern|aktiv|key|goenner|sponsor` (die Paketwahl
  schaltet per `data-form` um und ruft `TFCZ.formUI.neu(form)`), `training`, `firmenevent`, `medien`.
  Vorher stand dieselbe Logik **vier Mal** im HTML. `_module/js/tfcz-form.js` ist **abgelöst**.
  **Regeln:** Der **Absender ist der KUNDE** — Schlusssätze nie aus Vereinssicht formulieren
  („Bitte meldet euch …", nicht „Wir melden uns …"). Ein optionales Feld, dessen Fehlen eine Aussage
  ist (z. B. Wunschzeit), bekommt `leerText` und erscheint dann als „Wunschzeit: noch offen" — es darf
  **nicht stillschweigend aus dem Mailtext verschwinden**. Empfänger kommt aus `system/content.js`.
  Der **Toast** ist ebenfalls global: `TFCZ.toast('…')`.
- **Getränke-/Preisliste** — **aktiv**: `system/drinks.js` (Struktur + Fallback) +
  `system/components/drinks.js` (Renderer). Die Seite schreibt nur `<div data-tfcz="drinks"></div>`;
  Optionen am Platzhalter: `data-snacks="0"` (Kategorie Snacks weglassen — Firmenevents),
  `data-preis="vor Ort"` / `"CHF –.–"` (Text für noch offene Preise), `data-spalten`, `data-zahlung="1"`.
  Kategorie-Icons sind **Lucide** (die alten Emojis auf „Über uns" sind ersetzt).
  Vorher stand die Liste **zweimal** im HTML und lief auseinander (Über uns: 4 Kategorien mit Emojis,
  „CHF –.–" · Firmenevents: 3 Kategorien, „vor Ort"). Das alte `_module/js/tfcz-drinks.js` ist **abgelöst**
  und bleibt geparkt.
  **Regel (verbindlich, freigegeben Vasco 14.07.2026):** *Sortiment und Struktur* stehen ausschliesslich in
  `system/drinks.js` — nie im HTML einer Seite. **PREISE werden NIE hartkodiert**: sie kommen aus der API
  (`GET {TFCZ_API}/api/drinks`). `preis: null` heisst „kommt vom Server", nicht „fehlt". Sobald
  `window.TFCZ_API` gesetzt ist (auch nachträglich), holt der Baustein die Live-Liste und rendert neu;
  antwortet der Server nicht, bleibt der Platzhalter stehen. Der Renderer akzeptiert deutsche
  (`kategorien/artikel/preis`) **und** englische Feldnamen (`categories/items/price`).
- **Fun-Barometer** — **aktiv**: Baustein `system/components/baro.js`, Einbau per `<div data-tfcz="baro"></div>`.
  Ein einziges Bauteil für Website UND Brand Guide (Tube „Spass oben / Wettkampf unten" + Beschreibungs-Panel
  mit Kennwert-Balken, Konfetti beim Käsekick, Info-Sheet). Die 5 Stufen samt Texten und Kennwerten stehen
  **nur** im Baustein. Der vereinfachte Nachbau im Brand Guide ist **abgelöst**; `_module/js/tfcz-baro.js`
  bleibt geparkt. Nie ein zweites Barometer bauen.
- **Bild-Player + Likes** — **aktiv**: Baustein `system/components/lightbox.js` (X · Pfeile ·
  Thumbnail-Dock · Herz) + Like-Store `system/likes.js`. Die Seite markiert **nur ihre Bilder-Gruppe**:
  `<section data-lightbox> … <img …> … </section>` — der Player baut sich selbst und verdrahtet die Klicks.
  Hat die Seite eine eigene Drag-/Klick-Logik (Home-Marquee), setzt sie zusätzlich `data-lightbox-manual`
  und ruft `TFCZ.lightbox.openFrom(imgEl)`. **Zähler-Badges:** jedes Element mit `data-h="<bildId>"` wird
  automatisch mit Lucide-Herz + Zahl gefüllt. **Nie eine reduzierte Bilder-Strecke ohne Player nachbauen**
  (Reuse-First) — Home und Training nutzen denselben Player und teilen die Like-Zähler.
  Die alten Module `_module/js/tfcz-gallery.js` + `tfcz-likes.js` sind damit abgelöst.
  Die **Marquee-/Reihen-Optik** (`.gal`/`.grow`/`.gitem` auf der Home, `.marquee` auf Training) bleibt
  Seiten-Layout — geteilt ist der Player, nicht das Layout.

### Foto-CMS: Slots & Karussells (Bau-Logik, verbindlich, 20.07.2026)

**Single Source = `assets/fotos/galerie/mapping.json`** (slotKey → Wert). Nur diese Datei bestimmt, welches
Bild wo erscheint. Der Foto-Manager (`assets/fotos/galerie/foto-manager.html`, Reiter „Slot-Belegung")
liest sie beim Öffnen und schreibt sie beim Speichern; die Slot-Liste steht in `slots.json`.

**Zwei Slot-Arten (Feld `type` in `slots.json`):**
- **Einzelbild** (`type:"img"` oder `"bg"`): Wert in mapping.json = **ein Bildpfad**. Auf der Seite trägt das
  Element `data-slot="<key>"`; der Loader **`system/tfcz-images.js`** setzt `img.src` bzw.
  `background-image`. `data-slot` sitzt genau am richtigen Element (Match per `slots.current` in
  Dokument-Reihenfolge).
- **Karussell / Feed** (`type:"feed"`): Wert = **Liste von thumb-Pfaden** (feste Reihenfolge, im Manager
  beim Speichern **einmal** gemischt) **ODER** ein Spiegel-Objekt `{"same_as":"<anderer feedKey>"}`.

**„Home"-Karussell = `index.galerie-feed`** ist die Referenz für den Spiegel. Jedes andere Karussell kann
im Manager per Toggle **„Gleich wie Home"** (schreibt `{same_as:"index.galerie-feed"}`) oder **„Eigene
Auswahl"** (eigene Liste) sein. Nicht-Home-Feeds sind **standardmässig Spiegel**. Default-Auswahl eines
Feeds = **alle `schlumpf`-Fotos** (blaue Trikots).

**Loader/Resolver (alle Karussell-Skripte):** immer `resolveFeed(map,key)` — gibt bei Liste die Liste, bei
`{same_as}` rekursiv die Liste des Ziel-Feeds (Tiefe ≤ 4). Kein Wert / kein Ziel → `null` → **Fallback auf
die im HTML hinterlegten Bilder** (nie leer). Marquees verdoppeln die Liste (nahtlose Schleife); nach dem
Neuaufbau `TFCZ.lightbox.paintBadges()` rufen. Lightbox/Likes funktionieren mit dynamischen Bildern, weil
der Player die Bilder erst beim Klick einliest (Delegation).

**Bau-Logik für JEDES neue Karussell (immer diese Struktur):**
1. **`slots.json`**: einen Slot `type:"feed"` mit `key`, `page`, `label`, `page_file`, `anchor` anlegen.
2. **Seite**: den Container markieren und einen Loader einbinden —
   - **Marquee-Strip**: `.mtrack` bekommt `data-feed="<key>"`; am `</body>`
     `<script defer src="system/tfcz-carousel.js"></script>`. Der Loader füllt es automatisch.
   - **Andere Rotations-/Grid-Optik** (z. B. Insta-Diashow): eigene IIFE nach dem Muster
     **fetch(mapping) → `resolveFeed` → Slides/Items neu bauen → Rotation/Setup starten**, mit
     **Fallback** auf die HTML-Bilder, wenn keine Liste da ist (siehe `tfcz-ueber-uns.html`, `#igShow`).
     Die Home-Galerie (`index.html`, `#growA/#growB`) macht es genauso (2 Reihen).
3. **Manager**: nichts extra bauen. Feed-Slots aus `slots.json` erscheinen **automatisch** als Feed-Karte mit
   **Mehrfachauswahl** (im Fotos-Tab an/abklicken), **„Alle Schlumpf" / „Leeren"** und dem **„Gleich wie
   Home / Eigene Auswahl"-Toggle**. Diese Struktur ist Pflicht und gilt für jedes Karussell gleich.
4. Nach dem Zuweisen: **speichern** (mapping.json) und **„Website veröffentlichen"** — sonst greift der
   Fallback und es ändert sich nichts (statische Seite, kein Backend).

- **Karte** — Baustein `system/components/map.js`: **Google Maps** (keyless `output=embed`, kein
  API-Key, keine Kosten), **hell**, mit Pin **direkt an der Vereinsadresse**. Der Pin kommt über die
  **Adresse als Suchbegriff** (`q=`), die Google selbst geocodiert — NICHT über eine Koordinate (die
  alten Registry-Koordinaten `47.3969, 8.5312` waren der generische Zürich-Default und sassen daneben).
  Adresse aus `system/content.js` (`TFCZ.content.ort.label`) — eine Zeile, überall gültig.
  `loading="lazy"` (lädt erst beim Hinscrollen), „Karte öffnen"-Fallback wenn der Embed blockiert ist.
  Die Seite schreibt nur `<div data-tfcz="map"></div>` + `<script defer src="system/components/map.js">`.
  Optional pro Platzhalter: `data-q` (Adresse überschreiben) / `data-zoom` (Default 16). Home und
  Firmenevents nutzen denselben Baustein — **eine Korrektur wirkt auf beiden**. **Dark Mode bewusst
  nicht** (Vasco, 20.07.2026): echtes dunkles Google Maps braucht die JS-API + API-Key/Billing; hell +
  keyless gewollt. Live im Brand Guide, Sektion »Karte«.
- **Hintergrund-Effekt** — ausschliesslich `assets/js/bg-swirl.js` (globales Modul), 1× pro Seite,
  gleiche Parameter; nie inline dupliziert. Muss auf JEDER Seite gleich sein.
- **Navigation** — **aktiv**: Baustein `system/components/nav.js`. Die Seite behält ihren Kopf
  (`nav.nav` oder `header.top > .wrap`), alles andere kommt vom Baustein:
  · **Burger auf JEDER Seite**, immer als **äusserstes Element rechts** — der Zurück-Knopf steht
    dadurch automatisch **links davon**.
  · **Drawer**: Akkordeon nach unten (kein Slide von rechts), hängt unter der goldenen Linie, volle
    Resthöhe, **rechte Kante bündig mit dem Seiteninhalt** (wird gemessen, nicht gerechnet), 460px breit.
    Schliessen (X · Esc · Scrim · Link) läuft über den **Portal-Baustein**.
  · **Menü-Struktur steht EINMAL** in `system/content.js` (`TFCZ.content.menu`); Anker werden auf
    Unterseiten automatisch absolut (`#woche` → `index.html#woche`).
  · **Nav-Links (verbindlich, freigegeben Vasco 14.07.2026):**
    **Hover = leichte hellblaue Fläche** (`rgba(92,167,220,.16)`), **kein Strich**.
    **Strich = nur die Sektion, in der man sich gerade BEFINDET** (Scroll-Spy im Baustein):
    aktiv ist die letzte Sektion, deren Oberkante unter der Menüleiste durchgelaufen ist. Oben im
    Hero gibt es **keinen** Strich. Es ist **immer genau EIN** Strich sichtbar — nie zwei.
    Ausrichtung: Home (Links rechts) → **goldener Strich unten**, Unterseiten (Links links neben dem
    Logo) → **blauer Strich oben**. Der Strich sitzt **am Wort**, nicht an der Leistenkante.
    Statische „active"-Marker sind verboten (der Dauerstrich auf Geschichte war genau das).
  · Gleiche Werte auf allen Seiten: Nav-Höhe, `z-index:90`, Link-Schrift 13.5px, **nie unterstrichen**.
  · Drawer-CTAs: **Login = Ghost · Registrieren = Blau · „Mitglied werden" = Gold**.

**Neue-Seite-Vorlage:** *(geplant — wird erst geschrieben, wenn Nav und Tokens als Bausteine stehen.)*
Sie soll all dies bereits enthalten: globale Tokens, Header-Grössen, Spacing/Margins, Footer-Platzhalter,
bg-swirl, Scroll-Verhalten, Nav, Formular- und Getränke-Einbindung. Bis dahin: **neue Seite von der Home
`index.html` ableiten** und die aktiven Bausteine (`content.js`, `cta.js`, `components/*.js`) einbinden.
Das alte `_template.html` liegt geparkt in `_module/` und ist NICHT zu verwenden.

**Konsistente Grössen (global, nicht pro Seite):** Header-Bildhöhe, H1/H2-Stile & -Grössen,
Inhaltsbreite (`.wrap` 1160px), Sektions-Spacing zwischen Blöcken — alles als **globale Tokens**.
Ändert man z. B. die Header-Bildhöhe oder H1, gilt es für alle Unterseiten. Container-Höhen dürfen
inhaltsabhängig variieren, aber der **Header ist immer gleich hoch**.

**Scroll-zu-Anker (global):** `scroll-behavior:smooth` + sanfteres, etwas langsameres Ausbremsen
(Fade-out-Gefühl). Global geregelt, jede neue Seite erbt es.

### CTA-System — Farbhierarchie (verbindlich, präzisiert Vasco 14.07.2026)
- **Gold** (`.btn-gold`) = echte **Conversion** ODER **Lead-Anfrage** — jeweils die **zentrale
  Handlung der Seite**:
  · Conversion: „Mitglied werden", „Erster Abend gratis", „Platz sichern" (Semester-Anmeldung)
  · Lead-Anfrage: „Verfügbarkeit prüfen" / „Diesen Termin anfragen" (Firmenevents) — eine
    qualifizierte Anfrage, aus der ein Kunde wird.
  **NICHT gold: reine Navigation**, auch wenn sie einladend klingt („Komm vorbei" führt nur in den
  Kalender → Ghost). Gold knapp halten, nie abnutzen.
- **Registry = Single Source:** Ziele **und** Stil stehen in `ocsav - tfcz_Web/system/cta.js`
  (`stil: 'gold' | 'lead' | 'blau' | 'ghost'`). Buttons tragen nur `data-cta="…"`;
  `system/components/cta.js` setzt das Ziel und **meldet in der Konsole**, wenn ein Button mit
  Gold-Optik weder `gold` noch `lead` ist.
- **Blau (gefüllt)** = normale Primär-Aktion (z. B. Absenden, Öffnen, Erstellen).
- **Ghost / Outline** = sekundäre Aktion / Navigation / „mehr erfahren".
- Genug CTA-Varianten in verschiedenen Kontrasten im Brand Guide bereitstellen.
- **Pfeil-CTAs**: immer derselbe Pfeil (Brand-Guide-Pfeil) UND immer gleich animiert (nie mal
  animiert, mal statisch).
- **„Shiny-Glow"-Sweep** an Buttons (`::after` heller Gradient von links nach rechts, skewX): ist
  ab jetzt **spezifiziert** — erlaubt als dezenter Hover-Glanz auf gefüllten Primär-/Gold-Buttons,
  einheitlich (Dauer ~0.5s, `ease`); nirgends als Dauerschleife. Wo nicht gewünscht, überall
  entfernen — nie undokumentiert stehen lassen.

**CTA-Ziel-Registry (verbindlich):** Benannte CTAs führen IMMER ans gleiche Ziel — unabhängig davon,
wer den Button einfügt (auch Dritte, z. B. in der Kassensoftware). Die Registry ist **Code, nicht Doku**:
`ocsav - tfcz_Web/system/cta.js`. Dort steht je CTA **Ziel (`href`) und Stil**; hier wird sie bewusst
nicht zweitkopiert, sonst driften die Listen auseinander.

Im HTML steht nur der Schlüssel:
```html
<a data-cta="mitglied-werden" class="btn btn-gold">Mitglied werden</a>
```
`system/components/cta.js` setzt das Ziel (den Text nur, wenn der Button leer ist — Buttons mit eigenem
Markup wie Sprach-Spans oder Icons bleiben unangetastet) und **meldet in der Konsole**, wenn ein Button
mit Gold-Optik weder `gold` noch `lead` ist.

Grundsatz bleibt: **NIE auf `index.html#…` verlinken, wenn eine echte Unterseite existiert.**

### Unterseiten-Menü (Update, überschreibt frühere Regeln)
- Der **goldene Balken unten am sticky Menü ist GERADE** (kein `border-radius:0 0 16px 16px` mehr) —
  gerade wie oben.
- **Nav-Hover — der Strich folgt der MENÜ-AUSRICHTUNG (verbindlich, freigegeben Vasco 11.07.2026):**
  Kein weiss+gold-Strich mehr. Welcher Strich gilt, hängt davon ab, wie die Nav-Links im Kopf sitzen:
  - **Linksbündige Nav-Links** (alle **Unterseiten**: Links direkt neben dem Logo, `margin-left:18px`)
    → **blauer Strich OBERHALB** des Textes (`#5ca7dc`, ~2px).
  - **Rechtsbündige Nav-Links** (die **Home**: Links nach rechts geschoben) → **goldener Strich
    UNTERHALB** des Textes (`#cda857`, ~2px).
  Merksatz: Menü links = Strich oben/blau · Menü rechts = Strich unten/gold. Umsetzung immer als
  `::after` mit `transform:scaleX(0) → scaleX(1)` (kein Layout-Sprung).

### Burger-Drawer (Update, freigegeben Vasco 11.07.2026 — überschreibt frühere Regeln)
- Der Drawer hängt **UNTER der goldenen Linie** des sticky Menüs (nie oben am Viewport). Die Nav-Höhe
  wird gemessen und als `--tfcz-navh` gesetzt; der Drawer startet bei `top:var(--tfcz-navh)`.
- **Aufklappen als Akkordeon senkrecht nach unten** (`max-height` 0 → voll) — **nie** von rechts
  reinfahren/sliden. Container- und Text-Animation laufen synchron (~.42s), Einträge als Drop-Cascade.
- **Rechtsbündig am Fensterrand** (`right:0`) — **nicht** an `.wrap` eingerückt (frühere Regel ist
  überholt).
- Er nimmt **IMMER die gesamte verbleibende Seitenhöhe** ein: `height:calc(100vh - var(--tfcz-navh))`,
  also von der Goldlinie bis zum unteren Rand.
- Menü-CTAs nach Farbhierarchie: **Gold NUR** für die echte Conversion („Mitglied werden"),
  **Login = Ghost**, **Registrieren = Blau**.
- Schliessen (X, Esc, Scrim, Link) läuft immer über die **Portal-Animation**.
- Umsetzung: globales Modul `assets/js/tfcz-drawer.js` — nie pro Seite nachbauen.

> **Stand 14.07.2026 — OFFEN:** Das Modul ist geparkt in `_module/js/` und **noch nicht aktiv**.
> Beschreibt das Zielbild; wird als eigener Baustein eingebaut (siehe §9 „Der Baustein-Stand").


### Kontrast (verbindlich)
Keine blaue/hellblaue Headline auf dunklem Foto/Navy (kaum lesbar) — Headline-Akzente auf dunklem
Grund in **Gold** oder **Weiss**. Blau als Text nur auf hellem/ausreichendem Kontrast.

### Animationen (dokumentieren oder entfernen)
Jeder Effekt muss im Brand Guide stehen: Flip-Cards, Zahlen-Counter, Parallax-Bänder, Foto-Marquee,
Text-hinter-Bild-Reveal (Hover/Klick), Shiny-Glow, **Foto-Like/Herz** (`heartpop` + `heartfly`).
Undokumentierte Effekte sind ein Fehler. Kein Effekt darf ein Layout-Ruckeln/Sprung auslösen.

### Foto-Like · Herz (verbindlich, freigegeben Vasco 10.07.2026)
Das Like/Herz am Foto-Player (und überall, wo „Gefällt mir" vorkommt) nutzt **ausschliesslich das
Lucide-Herz** (`assets/icons/lucide/heart.svg`) — **nie** ein ``/``-Glyph oder einen selbst
gezeichneten Herz-Pfad (das war Alt-Bestand und ist ersetzt). Zustände: Ruhe = weisse **Outline**
(`stroke:#fff; fill:none`); „gefällt mir" = **Brand-Blau gefüllt** (`fill/stroke:var(--blue)`) mit
`@keyframes heartpop`. Beim Liken steigen kleine, **gefüllte** Lucide-Herzen auf (`@keyframes heartfly`,
`.heartfx`). Der **Zähler-Badge** (früher ` N`) zeigt dasselbe Herz klein &amp; gefüllt (`.hz`) + Zahl —
kein Glyph. **Blau, nicht Gold** — ein Like ist eine Aktion, keine Conversion (Gold bleibt „Mitglied
werden"). `prefers-reduced-motion` respektieren. Referenz: `.lb-like` in `index.html`; Live-Demo im
Brand Guide (`brandguide.html` → Sektion 15).

**Like-Store = globaler Baustein `system/likes.js` (Single Source, verbindlich, freigegeben Vasco
10.07.2026 · aktiv seit 14.07.2026):**
 Likes werden **pro stabiler Bild-ID** (Dateiname, z. B. `action-01`) gespeichert — dadurch
**teilt sich derselbe Zähler seiten-übergreifend** (dasselbe Bild auf einer Unterseite zählt mit) und
**derselbe Nutzer kann ein Bild nur EINMAL liken** (erneuter Klick = Unlike; er sieht sofort, dass es schon
geliked ist). Store hält `liked(id)`, `count(id)`, `toggle(id)`, `subscribe(fn)`, `refresh()`; localStorage-
Fallback (`tfcz_gal_liked` / `tfcz_gal_counts`) + Cross-Tab-Sync via `storage`-Event. **API-Schnittstelle für
spätere Profil-Sync** (vorbereitet): `window.TFCZ_API` (Backend-Basis) + `window.TFCZ_USER` (eingeloggtes
Profil). Backend-Vertrag: `GET {API}/api/likes` → `{bildId:count}` · `POST {API}/api/likes/<bildId>`
Body `{delta, liked, user}` → `{count}` (Server erzwingt 1 Like je (user,bild)) · `GET
{API}/api/likes/mine?user=<id>` → `{bildId:true}` (Likes des Profils, Geräte-Sync). Ohne `TFCZ_USER` läuft
alles lokal; mit Login folgt der Like-Status dem Profil. **Jede** neue Seite mit Foto-Likes bindet nur
`system/likes.js` ein und nutzt denselben Store — nie eine eigene Like-Logik nachbauen.
API: `TFCZ.likes.liked(id)` · `count(id)` · `toggle(id)` · `subscribe(fn)` · `refresh()`.

**Bild-IDs sind Zähler-IDs (verbindlich):** Die ID ist der **Dateiname ohne Endung** (`action-04`).
Ein veröffentlichtes Bild darf **nicht umbenannt** werden — sonst startet sein Like-Zähler bei null.

### Backend-API / Schnittstellen (verbindlich · Kollege baut das Backend, Stand 14.07.2026)

> **Die EINE Referenz ist `ocsav - tfcz_Web/API.md`.** Dort stehen Konfiguration
> (`window.TFCZ_API` / `TFCZ_USER` / `TFCZ_TOKEN`), alle Endpunkte, die das Frontend **heute schon
> aufruft** (`GET /api/drinks` · `GET|POST /api/likes` · `GET /api/likes/mine` · `POST /api/forms/<id>`
> mit allen acht Formular-IDs und ihren Feld-Schlüsseln) und die geplanten (Auth, Events, Profil).
>
> **Regel: Ein neuer Endpunkt wird ZUERST in `API.md` eingetragen, dann im Code gebaut.**
> Das Frontend muss **immer ohne Server funktionieren** (lokaler Fallback) — ein schweigender Server
> darf nie eine Seite brechen.

Für **Getränke, Kalender/Events, Formulare, Login/Auth, Profil-Speichern & Likes** kommen Backend-
Schnittstellen. Diese sind **zentral & auffindbar** an EINER Stelle definiert:
`ocsav - tfcz_Web/assets/js/tfcz-api.js` (`window.TFCZ_API_CLIENT`) plus Katalog
`ocsav - tfcz_Web/API.md`. Wer im Code sucht, findet alles über `TFCZ_API` / `TFCZ_API_CLIENT` /
`/api/`. **Konfig-Globals** (einmalig, sobald Backend steht): `window.TFCZ_API` (Basis-URL),
`window.TFCZ_USER` (Profil/Session), `window.TFCZ_TOKEN` (Bearer für login-geschützte Calls). Ohne
`TFCZ_API` laufen Features mit lokalem Fallback (z. B. Likes über localStorage) — kein Frontend-Umbau
nötig, wenn der Server kommt. **Regel:** Jede neue Funktion mit Server-Bedarf definiert ihren Endpunkt
**zuerst in `tfcz-api.js` + `API.md`** (Vertrag: Methode, Pfad, Body, Antwort) und nutzt den Client —
nie verstreute `fetch`-Aufrufe mit eigener URL-Logik. Feature-Module (`tfcz-likes.js`, `tfcz-drinks.js`,
`tfcz-form.js`) folgen diesem Vertrag bereits.

### Schatten / Elevation (global)
Grosse ruhende Container: feine 1px-Border + max. `--e-1`. `--e-2/--e-3` nur für Schwebendes
(Modals, sticky Bars, Hover-Lift). Regeln getrennt für Home und Unterseiten, aber global definiert.

### Icons (Architektur)
**SVG braucht IMMER eine explizite Grösse (verbindlich, Lehre aus dem Bug vom 14.07.2026):** Wird ein
Text-Glyph (Kreuz, Häkchen, Stern …) durch ein **Lucide-SVG** ersetzt, muss der Button/Container eine
**ausdrückliche `svg`-Grössenregel** bekommen — ein SVG ohne `width`/`height` wird in einem Flex-Container
**auf 0 gequetscht und ist unsichtbar** (genau so verschwand das X im Menü-Drawer). Regel:

```css
.mein-button svg{ width:17px; height:17px; display:block; flex:none }
```

Beim Icon-Tausch also **immer prüfen, ob das Icon danach wirklich sichtbar ist** — nicht nur, ob das Markup
stimmt. Gehört in die Checkliste vor dem Ausliefern.

Nur Lucide (Brand Guide 7c, `assets/icons/`). **Ein semantischer Zweck = EIN Icon überall** (z. B.
„E-Mail senden"). Wird ein Icon-Mapping geändert (z. B. Couvert → `@`), muss es auf ALLEN Seiten
ersetzt werden — zentral kontrollieren. Keine Emojis (Getränke, Social, Turniere): sofort ersetzen.

### CSS-Architektur — drei Ebenen (Ebene 1 steht, Ebene 2 offen)

> **Stand 14.07.2026 — Zwischenstand, ehrlich:**
> **Ebene 1 (Tokens) ist FERTIG** → `system/tokens.css`, aktiv auf allen Seiten (siehe „Globale
> Design-Tokens").
> **Ebene 2 (geteilte Klassen, `tfcz-base.css`) ist OFFEN.** Der erste Versuch, alle Seiten auf eine
> gemeinsame Klassen-Bibliothek umzustellen, hat die Seiten zerlegt und wurde zurückgesetzt; die Datei
> liegt geparkt in `_module/css/`. Wenn wir sie angehen, dann **Klasse für Klasse, additiv, mit
> Screenshot-Vergleich vorher/nachher** (Chromium ist dafür jetzt verfügbar).
> **Ebene 3** = das seiten-eigene `<style>` — das gibt es weiterhin.
> Alles Folgende beschreibt das Zielbild für Ebene 2.
**Befund (die Wurzel fast aller Inkonsistenzen):** Es gab **keine** gemeinsame Bibliothek. Jede Seite
hatte ihre eigene CSS-Kopie — **67 von 118 geteilten Klassen waren pro Seite unterschiedlich definiert**,
inklusive `:root` in **7 Varianten** (Radien, Schatten, Easing, Card-Fläche verschieden), `h1` in 6,
`.nav` in 4, `.btn-gold` in 3. Darum „hatte die eine Seite es und die andere nicht".

**Ab sofort gilt diese Ladereihenfolge im `<head>` — auf JEDER Seite und im Brand Guide:**
1. `assets/css/tfcz-tokens.css` — **alle Tokens** (Farben, Radien, Schatten, Grössen, Abstände, Hero-Typen,
   Kicker). **55 Tokens, EINE Quelle.** Kein `:root` mehr in irgendeiner Seite.
2. `assets/css/tfcz-base.css` — **alle geteilten Klassen** (Reset, `.wrap`, `.nav` + Kinder, `.hero`,
   `.kicker`, `.lead`, Buttons, Cards, `.reveal` …). **~106 Klassen, EINE Quelle.**
3. Das seiten-eigene `<style>` — **nur noch Seiten-Spezifisches**.

**Konsequenz (genau wie gefordert):** Ändere ich eine Margin/Grösse in den Tokens oder in `tfcz-base.css`,
ändert sie sich **auf allen Seiten gleichzeitig** — es ist dieselbe Klasse. Weil die Seite **zuletzt**
lädt, bleibt eine **bewusste Einzel-Anpassung pro Landingpage** möglich; sie muss dort aber **explizit**
stehen (und ist damit sichtbar und dokumentiert).

**Nav vereinheitlicht:** Vier Seiten nutzten `.top`, vier `.nav` — mit unterschiedlichem Padding und
z-index, weshalb der Titel je Seite unterschiedlich weit unter dem Menü begann. Jetzt heisst die Nav
**überall `.nav`** und ist **einmal** definiert.

**Regel beim Bauen:** Kommt eine Klasse auf mehr als einer Seite vor, gehört sie in `tfcz-base.css` —
niemals kopieren. Neue Tokens gehören in `tfcz-tokens.css`. Vor jedem Ausliefern prüfen, dass **keine
geteilte Klasse divergent** in einer Seite steht (Soll: 0).

### Seitenkopf-Standard — zwei Typen, eine Regel (ZIELBILD — hängt am CSS-Baustein)
**Befund (war ein Fehler):** Jede Seite hatte einen eigenen Kopf — 3 Wrapper-Tags, **3 Kicker-Varianten**
(Goldstrich · Pill-Badge · nackter Text), 5 verschiedene Hero-Paddings, und die Home hatte nicht einmal
ein `<h1>` (Headline war ein `<div>`). Dadurch startete der Text z. B. auf Geschichte und Mitglied auf
unterschiedlicher Höhe. Das ist ab sofort geregelt:

**Es gibt GENAU ZWEI Hero-Typen — welcher genommen wird, ist eine Regel, keine Geschmacksfrage:**
1. **Foto-Hero** (`.hero.hero-foto`) — grosses Bild im Hintergrund. **Nur** für emotionale
   **Landing-/Angebotsseiten**, die verkaufen sollen: **Home · Training · Firmenevents**.
   Höhe `var(--hero-h)` (überall gleich) · H1 `var(--h1)`.
2. **Text-Hero** (`.hero.hero-text`) — **kein Bild**, startet direkt mit Text. Für **Inhalts-,
   Dokument- und Formularseiten**: **Mitglied · Regeln · Medien · Geschichte · Über uns**.
   Padding `var(--hero-pad-y) 0 var(--hero-pad-b)` — **identisch**, daher startet der Text auf allen
   diesen Seiten auf **derselben Höhe** · H1 `var(--h1-text)`.

**Aufbau ist in beiden Typen identisch und in dieser Reihenfolge:** `.kicker` → `h1` → `p.lead` →
(optional) CTAs. Die Headline ist **immer ein echtes `<h1>`**.

**Der Kicker ist IMMER die Kicker-Signature** (goldener Strich 28×2px + Uppercase-Gold,
`letter-spacing:.18em`) — im Seitenkopf UND über **jeder** Sektions-Überschrift. **Abgeschafft** (waren
im Einsatz, sind Fehler): `.kick` (ohne Strich), `.est` (Pill-Badge), `.lbl` (Sektions-Label ohne
Strich). Es gibt **keine zweite Kicker-Variante**. Headline-Akzent (`.g`) auf dunklem Grund/Foto immer
**Gold**, nie Blau. Definition: `assets/css/tfcz-tokens.css`; Brand Guide Sektion 17a.

### Globale Design-Tokens (verbindlich · aktiv seit 14.07.2026)

**Eine Datei: `ocsav - tfcz_Web/system/tokens.css`** — 45 Tokens (Farben, Radien, Schatten, Zeiten,
Easing, Kartenflächen). Sie wird **als Erstes im `<head>`** geladen, **vor** dem seiten-eigenen
`<style>`:

```html
<link rel="stylesheet" href="system/tokens.css">
<style> /* nur noch Seiten-Spezifisches */ </style>
```

**Kein `:root` mehr in irgendeiner Seite.** (Ausnahme: der `:root` im *kopierbaren Starter-Template*
im Brand Guide — das ist Beispielcode, kein aktives CSS.)

**Befund vor der Umstellung (gemessen, nicht geschätzt):** 34 der 45 Tokens waren bereits identisch,
**11 liefen auseinander** — `--r-xl` in **4** Varianten (16/22/24/26px), `--r-lg`/`--r-md`/`--r-sm` in
je 3, die Schatten `--e-1`/`--e-2`/`--e-3` in 3/2/2, zwei verschiedene `--ease`-Kurven und zwei
`--card`-Flächen. Genau darum sah dieselbe Karte auf zwei Seiten anders aus.

**Referenz = die Home** (`index.html`), wie im Grundsatz „Globale Elemente (Referenz = Home)".
Ändert man einen Wert in `tokens.css`, ändert er sich auf **allen** Seiten gleichzeitig.

**Eine bewusste Einzel-Anpassung pro Seite bleibt möglich** (die Seite lädt zuletzt) — sie muss dort
aber **explizit** stehen und ist damit sichtbar und dokumentiert.

**Regel beim Bauen:** Neue Tokens gehören in `system/tokens.css`. Vor dem Ausliefern prüfen, dass
**keine Seite ein eigenes `:root`** mitbringt (Soll: 0).

### Scroll-zu-Anker (global, verbindlich · aktiv seit 14.07.2026)

`scroll-behavior:smooth` ist aus **allen** Seiten **entfernt** (kollidierte mit dem eigenen Easing —
der Browser bremste zweimal). Anker-Sprünge laufen über den Baustein
**`system/components/scroll.js`**: sanftes, etwas langsameres Ausbremsen (**ease-out-cubic, ~760 ms**)
und Stopp **unterhalb des sticky Menüs** (`--tfcz-navh` + 12px) — der Titel verschwindet nie hinter
der Leiste. `prefers-reduced-motion` → sofortiger Sprung. Das Kopf-Logo ist ausgenommen (eigenes
Press-Verhalten), ebenso Links mit `data-noscroll`.

### Pfeil-CTAs (global, verbindlich · aktiv seit 14.07.2026)
Überall derselbe Pfeil: **Lucide `arrow-right`** (`<svg class="tfcz-arw">`), gleiche Hover-Animation
(3px nach rechts, .22s) — geliefert vom Baustein **`system/components/icons.js`**. Er ersetzt
automatisch jeden Text-Glyph **am Rand** eines Links/Buttons: „→" → `arrow-right`, „↗" (externer Link)
→ `external-link`. Auch in verschachtelten Spans (z. B. den Sprach-Varianten auf „Über uns").
Nie ein Text-Glyph in Buttons/Links, nie mal animiert / mal statisch.
(Pfeile im **Fliesstext** — z. B. „Spielbeginn → Kick-off" in den Regeln — sind **Inhalt** und bleiben;
der Baustein fasst sie nicht an.)

### Tabellen & Zeitstrahl (definiert, freigegeben Vasco 11.07.2026)
- **Tabellen**: Standard = `.btable` (Brand Guide, Sektion „Daten & Listen") — 13px, Kopf 11px
  Gold-Uppercase, Zellen `--ink-mut`, erste Spalte weiss/800. Alle Tabellen der Website nutzen exakt
  diese Werte (Regeln-Tabellen angeglichen).
- **Zeitstrahl**: vertikale Linie mit Brand-Verlauf **blau → navy → gold**, Ereignis-Punkte als Ringe;
  Punkt-Farbe = Kategorie (Blau = Standard, Navy-Blau `.comp` = Wettkampf/Meilenstein, Gold `.gold` =
  TFCZ-Höhepunkt). Im Brand Guide dokumentiert (Sektion 22); Referenz: `tfcz-geschichte.html`.
- **Toggles / Sprach-Switcher**: Standard im Brand Guide (Sektion 7b) — Pill-Track, Gold-Knopf = aktiv,
  aktives Label gold, Hover = Brand-Rahmen nur via `inset box-shadow`.
- **Tabs / Reiter (Ansichts-Umschalter, verbindlich, freigegeben Vasco 19.07.2026)**: Für den Wechsel
  zwischen ganzen **Ansichten/Inhalten** (nicht 2–3 inline-Optionen — dafür `.seg`) gilt die **Ordner-Reiter**-
  Optik: Reiter mit oben abgerundeten Ecken (`10px 10px 0 0`), **ohne Unterkante**; inaktiv = `--navy-2`-Fläche
  + `--ink-mut`-Text; **aktiver Reiter** = frost-Fläche (`--frost`), heller Text und eine **3px blaue Oberkante**
  (`box-shadow:inset 0 3px 0 var(--blue)`). Die Reiter-Zeile sitzt auf der **goldenen Grundlinie** der Bar/Kopf
  (`border-bottom:3px solid var(--gold)`) — so trägt der Baustein die Brand-Line „Blau oben / Gold unten".
  Klassen `.rtabs`/`.rtab`/`.rtab.on` (Brand Guide / brandguide.html, Sektion Bausteine). Referenz: Foto-Manager
  (`assets/fotos/galerie/foto-manager.html`).

### Footer (verbindlich, freigegeben Vasco 10.07.2026 · Baustein 14.07.2026)
- **Ein globaler Footer** = Baustein `ocsav - tfcz_Web/system/components/footer.js` (Single Source).
  Die Seite schreibt **nur den Platzhalter** `<div data-tfcz="footer"></div>` und bindet ein:
  `<script src="system/content.js"></script>` + `<script defer src="system/components/footer.js"></script>`.
  Der Baustein hängt den `<footer class="tfcz-footer">` selbst an den Body und entfernt den Platzhalter.
  Inhalte (Logo, Name, Adresse, Mail, Links) kommen aus `system/content.js`. Ändert sich der Footer,
  ändert er sich überall — auch im **Brand Guide**, der denselben Baustein nutzt.
  Kein per-Seite-Footer mehr (`.fwrap`/`.foot` abgelöst). Eigener Klassen-Präfix `.tfcz-footer`.
- **Immer volle Breite** — der Footer hängt auf **Body-Ebene** (nie innerhalb `.wrap`/`main`,
  sonst wird er auf 1160px eingeschränkt und ist schmaler als die Home). Die Blau/Gold-Brand-Linie
  (oben blau 4px / unten gold 4px) und der dunkle Navy-Verlauf spannen über die **ganze Viewport-
  Breite**; der Inhalt ist innen auf 1160px zentriert.
- **Inhalt zentriert (verbindlich):** Logo + „Tischfussball Club Zürich" + Adresse, die Nav-Links
  und die Copyright-Zeile sind **alle horizontal zentriert** (gestapelte, mittige Spalte).
- **Deckkraft/Optik = Home-Referenz** (deckender Navy-Verlauf), identisch auf allen Seiten.
- Footer-Links = kanonische Seiten-/CTA-Registry (absolute Ziele, funktionieren überall).

---

## SEO-Meta (Pflicht je öffentliche Seite)

Gilt für jede indexierbare Seite (Startseite + Unterseiten). Beim Bauen einhalten, damit die Suchergebnisse sauber sind:

- Genau **ein** `<title>`, **≤ 60 Zeichen**, einzigartig, Markenname am Ende.
- Genau **eine** Meta-Description, **150–160 Zeichen**, einzigartig, Nutzen bzw. Handlungsaufforderung nach vorne.
- Genau **eine** H1 pro Seite.
- OG-/Twitter-Description dürfen länger sein, müssen aber gesetzt sein.

Prüfung: der `tfcz-audit`-Skill meldet Titel > 60 und Description > 160 Zeichen als Befund.

---

## Bilder — IMMER über Galerie (full/thumb) + Foto-Manager

**Grundregel:** Alle Inhaltsbilder werden über das Galerie-CMS gehandhabt, nie als fester Pfad im HTML/CSS verdrahtet. Jedes Bild existiert als **WebP in zwei Auflösungen**:
- `assets/fotos/galerie/full/…` — grosse Darstellung (Hero, Sektionsbilder, ~1600px)
- `assets/fotos/galerie/thumb/…` — kleine Darstellung (Strips, Feeds, Karussell-Kacheln)

Roh-JPG/PNG-Fotos gehören NICHT direkt in Seiten. (Logos/Embleme/Muster sind keine Galerie-Fotos → geteilte Assets in `assets/img/`.)

**Wie es funktioniert (Slots):**
- Bild-/Hintergrund-Stellen tragen im HTML ein `data-slot="…"` (z. B. `index.hero`). Das `src` wird **beim Veröffentlichen aus `mapping.json` ins HTML gebacken** (`node _tools/bake-slots.mjs`) und ist das **echte Bild** — kein Platzhalter mit Fremdbild. `system/tfcz-images.js` bleibt nur Fallback (setzt denselben Wert). Der Bake setzt zudem `loading="lazy"` (ausser Hero-Slots, die bleiben eager fürs LCP) und `decoding="async"`. **Kein** `width`/`height` nötig: der Layout-Platz ist bereits über die CSS-Container (feste/geclampte Höhe + `object-fit:cover`) reserviert.
- `system/tfcz-images.js` setzt zur Laufzeit das echte Bild bzw. den Background aus `assets/fotos/galerie/mapping.json`; `system/tfcz-carousel.js` macht dasselbe für Karussells.
- **`mapping.json` = Laufzeit-Quelle der Wahrheit** (Slot → Bildpfad). `slots.json` = Slot-Definitionen. `galerie.json` = Foto-Katalog.

**Bilder ändern — nur über den Foto-Manager:**
1. `assets/fotos/galerie/foto-manager.html` öffnen.
2. Pro Slot ein Galerie-Foto wählen — Auflösung **full** oder **thumb**.
3. Speichern → schreibt `mapping.json` (oder „mapping.json exportieren" und in `assets/fotos/galerie/` ersetzen).
4. **`node _tools/bake-slots.mjs`** laufen lassen — bäckt die gemappten Bilder ins `src` jeder Slot-`<img>`. Dann **veröffentlichen**.

**Neue Fotos** in die Galerie kommen ausschliesslich über den `tfcz-fotos`-Skill (erzeugt full+thumb-WebP, katalogisiert in `galerie.json`, fragt vorher nach Event/Kategorie). Nicht von Hand katalogisieren.

**Nie:** Inhaltsbild-Pfade von Hand ins `src` schreiben (das macht `_tools/bake-slots.mjs` aus dem Mapping) · Slot-Bilder ausserhalb von `assets/fotos/galerie/` ablegen (sonst sieht der Foto-Manager sie nicht) · `mapping.json`/`slots.json` von Hand umbiegen, wenn der Foto-Manager es kann.
