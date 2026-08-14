# TFCZ · Umbau der Navigation — Variante 2 „Vier Kapitel, eine Navigation"

**Für:** den Kollegen mit dem aktuellen Stand von `ocsav - tfcz_Web`
**Referenz zum Anschauen:** `nav-demo-2.html` (Startseite) und `nav-demo-2-unterseite.html` (Unterseite) liegen im Projekt-Root. Beide öffnen, die Leiste vergleichen — sie ist Zeichen für Zeichen dieselbe, nur der aktive Punkt wandert.

---

## Warum überhaupt

Nutzer melden: „verwirrend, alles doppelt, man findet sich nicht zurecht". Nachgemessen sind es **drei** Probleme, nicht eins:

1. **Zwei Menüs gleichzeitig.** Der Burger aus `system/components/nav.js` hat keine Breakpoint-Regel und ist auf jeder Bildschirmbreite sichtbar. `system/nav.css` Zeile 68 blendet die Linkliste erst unter 861px aus. Am Desktop laufen also zwei Menüs parallel — und der Burger enthält dieselben Punkte plus die Unterseiten, ist also eine Obermenge.
2. **Gemischtes Verhalten.** `TFCZ.content.menu` mischt Anker (`#woche`) und Seiten (`mitglied.html`). Manche Klicks scrollen, manche wechseln die Seite. Man weiss vorher nicht, was passiert.
3. **Die Leiste bedeutet auf jeder Seite etwas anderes.** Startseite: die Home-Abschnitte. `mitglied.html`: „Pakete · Anmelden · Gönner". `tfcz-training.html`: „Termine · Warum · Ablauf · Platz sichern". `tfcz-ueber-uns.html`: „Verein · Stream · Social · Clubliga · Community". Gleiche Optik, gleiche Position, jedes Mal eine andere Bedeutung. **Das ist der Hauptgrund für die Desorientierung.**

Dazu zwei kleinere Befunde: „Mitspielen" springt zum Abschnitt *Formate & Wettkampf*, während der Abschnitt namens *Mitspielen* am Punkt „Kalender" hängt — und `#galerie` steht in gar keinem Menü.

---

## TEIL A · Der Prompt

> Alles zwischen den Linien kopieren und dem KI-Assistenten geben. Er braucht Schreibzugriff auf das Projekt.

---

Du arbeitest im TFCZ-Web-Projekt (Ordner `ocsav - tfcz_Web`).

**Vorher lesen, verbindlich:** `CLAUDE.md`, `system/tokens.css`, `system/buttons.css`, `brandguide.html`, `system/content.js`, `system/components/nav.js`, `system/nav.css`. Keine Farb-, Radius- oder Abstandswerte erfinden — alles kommt aus `tokens.css`. Bestehende Bausteine wiederverwenden, nichts nachbauen.

**Auftrag:** Baue die Navigation auf „Variante 2 — vier Kapitel, eine Navigation" um. Halte dabei drei Regeln ausnahmslos ein:

1. **Die Leiste enthält nur Seiten.** Ein Klick wechselt immer die Seite. Kein einziger Anker (`#…`) darf in Leiste, Menüfeld oder Burger-Menü stehen.
2. **Die Leiste ist auf jeder Seite identisch.** Gleiche Punkte, gleiche Reihenfolge, gleicher Gold-Knopf. Nur der aktive Punkt wandert — daran erkennt man, wo man ist.
3. **Abschnitte sind keine Navigation.** Die Sprungliste einer Seite steht als Pillen-Reihe im Inhalt unter dem Titel, ist nicht klebend und sieht nicht aus wie das Menü.

Die Leiste und das Burger-Menü müssen aus **derselben Quelle** gebaut werden (`TFCZ.content.menu`), damit sie nie auseinanderlaufen können. Am Desktop ist die Leiste sichtbar und der Burger versteckt; ab 900px abwärts umgekehrt. Nie beides gleichzeitig.

Die Zielstruktur, die Datei-für-Datei-Änderungen und den fertigen Code findest du in `UMBAU-NAVIGATION-Variante-2.md` im Projekt-Root — arbeite die Abschnitte D1 bis D5 der Reihe nach ab.

**Zum Schluss** die Abnahmeliste in Abschnitt E messen (nicht behaupten) und den Skill `tfcz-design-qa` laufen lassen. Erst dann „fertig" melden. Nicht deployen.

---

## TEIL B · Die drei Regeln (die eigentliche Entscheidung)

Der Grund, warum man sich bei Apple nie verläuft, ist nicht die Optik der Knöpfe, sondern eine Regel dahinter: **ein Steuerelement hat immer genau ein Verhalten, und ein Ort hat immer genau eine Bedeutung.** Die Apple-Leiste navigiert ausnahmslos, sie scrollt nie, und sie sieht auf jeder Seite gleich aus.

Übertragen:

| | Regel | Folge |
|---|---|---|
| 1 | Leiste = nur Seiten | Ein Klick wechselt immer die Seite. Man weiss es vorher. |
| 2 | Leiste überall identisch | Der Ort „oben" bedeutet immer dasselbe. Der aktive Punkt beantwortet „wo bin ich". |
| 3 | Abschnitte ≠ Navigation | Sprungliste im Inhalt, nicht klebend, andere Optik. Kein zweites Menü. |

Wer eine dieser Regeln für einen Einzelfall aufweicht, holt sich Problem 2 oder 3 zurück. Es gibt keine harmlose Ausnahme.

---

## TEIL C · Ziel-Struktur

Drei Kapitel plus ein Gold-Knopf. „Kontakt" verlässt das Menü und lebt im Fuss und als Abschnitt der Startseite — wie bei den meisten Vereins- und Produktseiten.

```
Leiste:   [Logo]   Spielen ▾   Angebote ▾   Verein ▾        [Mitglied werden]

Spielen                        → index.html   (die Startseite IST dieses Kapitel)
  ├ Startseite                 → index.html      Abschnitte: Kalender, Formate, Tische, Galerie, Kontakt
  └ Regeln                     → tfcz-regeln.html

Angebote                       → angebote.html  (NEU)
  ├ Angebote — Übersicht       → angebote.html   Abschnitte: Training, Nachwuchs, Firmenevents
  ├ Training mit Philipp       → tfcz-training.html
  └ Firmenevents & Vermietung  → tfcz-firmenevents.html

Verein                         → tfcz-ueber-uns.html
  ├ Über uns                   → tfcz-ueber-uns.html
  ├ Geschichte                 → tfcz-geschichte.html
  ├ Medien                     → tfcz-medien.html
  └ Mitglied werden            → mitglied.html

Gold-Knopf: Mitglied werden    → mitglied.html   (Aktion; steht zusätzlich unter „Verein" als Ort)
```

**Was von der Startseite wegzieht:** die drei Abschnitte `Training`, `Nachwuchsförderung`, `Firmenevents` (heute alle unter `#angebote`) wandern auf die neue Seite `angebote.html`.
**Was auf der Startseite bleibt:** Kalender, Formate, Tische, Galerie, Kontakt.

---

## TEIL D · Der Code

### D1 · `system/content.js`

Ersetze den `menu:`-Block. Neu ist ein `seiten`-Array pro Kapitel (die Einträge des Menüfelds) und ein `cta`-Objekt. `kinder` fällt weg.

```js
  /* ---- Die EINE Menü-Struktur — Leiste UND Burger lesen von hier ----
     REGEL: href zeigt IMMER auf eine Seite. NIE auf einen Anker (#…).
     Anker gehören in die Sprungliste der jeweiligen Seite, nicht ins Menü. */
  menu: [
    { text: 'Spielen', seiten: [
        { text: 'Startseite',                href: 'index.html',             info: 'Kalender, Formate, Tische, Galerie, Kontakt' },
        { text: 'Regeln',                    href: 'tfcz-regeln.html',       info: 'Wie bei uns gespielt wird' }
    ]},
    { text: 'Angebote', seiten: [
        { text: 'Angebote — Übersicht',      href: 'angebote.html',          info: 'Training, Nachwuchs, Firmenevents auf einen Blick' },
        { text: 'Training mit Philipp',      href: 'tfcz-training.html',     info: 'Einzel- und Gruppentraining' },
        { text: 'Firmenevents & Vermietung', href: 'tfcz-firmenevents.html', info: 'Halle und Tische mieten' }
    ]},
    { text: 'Verein', seiten: [
        { text: 'Über uns',                  href: 'tfcz-ueber-uns.html',    info: 'Wer wir sind, wie wir ticken' },
        { text: 'Geschichte',                href: 'tfcz-geschichte.html',   info: 'Seit 1990 in Zürich' },
        { text: 'Medien',                    href: 'tfcz-medien.html',       info: 'Presse und Berichte' },
        { text: 'Mitglied werden',           href: 'mitglied.html',          info: 'Pakete, Anmeldung, Gönner' }
    ]}
  ],

  /* ---- Der EINE Gold-Knopf in der Leiste (Conversion) ---- */
  cta: { text: 'Mitglied werden', href: 'mitglied.html' },
```

Ergänze in `seiten:` den neuen Eintrag und nimm ihn in `footerLinks` auf:

```js
    angebote:    { href: 'angebote.html',          text: 'Angebote' },
```

```js
  footerLinks: ['angebote','training','firmenevents','mitglied','ueberuns','geschichte','regeln','medien','brandguide','designstudio','fotomanager']
```

---

### D2 · `system/components/nav.js`

Drei Eingriffe. Der Baustein baut ab jetzt **beides** — Leiste und Burger-Menü — aus `TFCZ.content.menu`.

**(a) CSS ergänzen.** In den `var css = [ … ]`-Block aufnehmen, vor der schliessenden `].join('')`:

```js
      /* ---- Breakpoint: entweder Leiste ODER Burger. NIE beides. ---- */
      '@media(min-width:901px){ .tn-burger{display:none !important} }',
      '@media(max-width:900px){ .nav .navlinks{display:none !important} .nav .tn-cta-bar{display:none !important} }',

      /* ---- Menüfeld am Desktop: listet die SEITEN eines Kapitels ---- */
      '.tn-mega{position:absolute; left:0; right:0; top:100%; z-index:95; display:none;',
        'background:linear-gradient(155deg,#0f2b44,#0a1c2c);',
        'border-bottom:3px solid var(--gold,#cda857); box-shadow:var(--e-3,0 22px 54px rgba(0,0,0,.5))}',
      '.tn-mega.on{display:block}',
      /* Leiste + offenes Feld bilden EINEN Rahmen: blau oben, gold unten.
         Darum verliert die Leiste ihre Goldkante, solange ein Feld offen ist —
         sonst stehen zwei Linien übereinander (Brand-Line-Regel). */
      '.nav.tn-megaopen{border-bottom-color:transparent}',
      '.tn-mega .tn-mwrap{max-width:var(--wrap,1160px); margin:0 auto; padding:20px var(--wrap-pad,22px) 22px;',
        'display:grid; gap:8px}',
      '@media(min-width:901px){ .tn-mega .tn-mwrap{grid-template-columns:repeat(3,1fr); gap:10px 22px} }',
      '.tn-mega h4{grid-column:1/-1; margin:0 0 4px; font-size:11.5px; letter-spacing:.16em;',
        'text-transform:uppercase; color:var(--gold-lt,#e9c475)}',
      '.tn-mega a{display:block; padding:12px 14px; min-height:44px; border-radius:var(--r-md,12px);',
        'text-decoration:none; border:1px solid transparent}',
      '.tn-mega a:hover{background:rgba(255,255,255,.06); border-color:var(--card-brd,rgba(255,255,255,.13))}',
      '.tn-mega a b{display:block; font-size:15px; font-weight:900; color:#fff}',
      '.tn-mega a small{display:block; margin-top:3px; font-size:12.5px; line-height:1.45; color:var(--ink-mut,#c3d2e0)}',
      '.tn-mega a[aria-current="page"] b::after{content:" · du bist hier"; font-weight:700;',
        'font-size:12px; color:var(--gold-lt,#e9c475)}',

      /* ---- Kapitel-Knöpfe in der Leiste ---- */
      '.nav .navlinks{display:flex; align-items:center; gap:4px; margin-left:22px}',
      '.nav .lnk{position:relative; display:inline-flex; align-items:center; gap:6px; cursor:pointer;',
        'padding:10px 14px; min-height:40px; border:0; background:none; border-radius:var(--r-sm,8px);',
        'font-family:var(--font); font-size:14.5px; font-weight:700; color:var(--ink-mut,#c3d2e0);',
        'white-space:nowrap; text-decoration:none}',
      '.nav .lnk:hover{color:#fff; background:rgba(92,167,220,.16)}',
      '.nav .lnk svg{width:14px; height:14px; flex:none; transition:transform .18s ease}',
      '.nav .lnk[aria-expanded="true"] svg{transform:rotate(180deg)}',
      /* aktives Kapitel: genau EIN goldener Strich, nie zwei */
      '.nav .lnk[aria-current="true"]{color:#fff}',
      '.nav .lnk[aria-current="true"]::after{content:""; position:absolute; left:14px; right:14px; bottom:2px;',
        'height:2px; border-radius:2px; background:var(--gold,#cda857)}',

      /* ---- Sprungliste im Inhalt (KEINE Navigation, darum bewusst andere Optik) ---- */
      '.jump{display:flex; flex-wrap:wrap; align-items:center; gap:8px; margin:26px 0 0}',
      '.jump .lbl{margin-right:2px; font-size:10.5px; font-weight:900; letter-spacing:.16em;',
        'text-transform:uppercase; color:var(--ink-mut,#c3d2e0); opacity:.75}',
      '.jump a{display:inline-flex; align-items:center; min-height:40px; padding:9px 15px;',
        'border-radius:var(--r-pill,999px); background:rgba(255,255,255,.06);',
        'border:1px solid var(--card-brd,rgba(255,255,255,.13)); color:var(--ink,#eef4fa);',
        'text-decoration:none; font-size:13px; font-weight:800}',
      '.jump a:hover{background:rgba(255,255,255,.12); color:#fff}',
```

**(b) Leiste + Menüfelder bauen.** Diese Funktion neu einfügen (z. B. direkt vor `function init()`):

```js
  /* Aktuelle Datei — daran erkennt der Baustein das aktive Kapitel. */
  function dateiJetzt() {
    var f = location.pathname.split('/').pop();
    return f || 'index.html';
  }

  /* Baut die Kapitel-Leiste UND die Menüfelder aus TFCZ.content.menu.
     Damit gibt es genau EINE Quelle für Leiste und Burger-Menü — sie können
     nicht mehr auseinanderlaufen (das war der Grund für „alles doppelt"). */
  function leisteBauen(nav, menu, C) {
    var jetzt = dateiJetzt();

    /* Regel 1 hart durchsetzen: kein Anker im Hauptmenü. */
    menu.forEach(function (kap) {
      (kap.seiten || []).forEach(function (s) {
        if (!s.href || s.href.indexOf('#') >= 0) {
          console.error('[TFCZ nav] Menü-Ziel ist kein Seitenlink: ' + s.text + ' -> ' + s.href);
        }
      });
    });

    var box = nav.querySelector('.navlinks');
    if (!box) { box = document.createElement('div'); box.className = 'navlinks'; }
    box.innerHTML = '';

    menu.forEach(function (kap, i) {
      var id = 'tn-mega-' + i;
      var aktiv = (kap.seiten || []).some(function (s) { return s.href === jetzt; });

      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'lnk';
      btn.setAttribute('aria-expanded', 'false');
      btn.setAttribute('aria-controls', id);
      if (aktiv) btn.setAttribute('aria-current', 'true');
      btn.innerHTML = kap.text + CHEV;
      box.appendChild(btn);

      var panel = document.createElement('div');
      panel.className = 'tn-mega';
      panel.id = id;
      panel.innerHTML = '<div class="tn-mwrap"><h4>' + kap.text + '</h4>' +
        (kap.seiten || []).map(function (s) {
          return '<a href="' + s.href + '"' + (s.href === jetzt ? ' aria-current="page"' : '') + '>' +
                   '<b>' + s.text + '</b>' + (s.info ? '<small>' + s.info + '</small>' : '') +
                 '</a>';
        }).join('') + '</div>';
      nav.appendChild(panel);
      btn.__panel = panel;
    });

    /* Leiste hinter das Logo, vor CTA und Burger */
    var logo = nav.querySelector('.logo');
    if (logo && logo.nextSibling) nav.insertBefore(box, logo.nextSibling); else nav.appendChild(box);

    /* Gold-Knopf aus content.js — ersetzt einen evtl. vorhandenen alten .cta */
    var alt = nav.querySelector('.cta');
    if (alt) alt.remove();
    if (C.cta) {
      var cta = document.createElement('a');
      cta.className = 'btn btn-gold btn-sm cta tn-cta-bar';
      cta.href = C.cta.href;
      cta.setAttribute('data-cta', 'mitglied-werden');
      cta.textContent = C.cta.text;
      nav.appendChild(cta);
    }

    /* Öffnen / Schliessen — sofort, ohne Auf-/Zu-Effekt (Entscheid 26.07.2026) */
    var btns = [].slice.call(box.querySelectorAll('.lnk'));
    function alleZu() {
      btns.forEach(function (b) {
        b.setAttribute('aria-expanded', 'false');
        b.__panel.classList.remove('on');
      });
      nav.classList.remove('tn-megaopen');
    }
    btns.forEach(function (b) {
      b.addEventListener('click', function (e) {
        e.stopPropagation();
        var offen = b.__panel.classList.contains('on');
        alleZu();
        if (!offen) {
          b.__panel.classList.add('on');
          b.setAttribute('aria-expanded', 'true');
          nav.classList.add('tn-megaopen');
        }
      });
    });
    nav.addEventListener('click', function (e) {
      if (e.target.closest('.tn-mega a')) alleZu();
      else if (e.target.closest('.tn-mega')) e.stopPropagation();
    });
    document.addEventListener('click', alleZu);
    addEventListener('keydown', function (e) { if (e.key === 'Escape') alleZu(); });
  }
```

**(c) In `init()` einhängen und den Scroll-Spy entfernen.** Direkt nach der Zeile `nav.classList.add(unterseite ? 'tn-links' : 'tn-rechts');` einfügen:

```js
    leisteBauen(nav, menu, C);
```

Und den kompletten Scroll-Spy-Block löschen (von `/* ---- Scroll-Spy: … */` bis einschliesslich `spy(); }`) — er markierte Abschnitte in der Leiste. Abschnitte stehen ab jetzt nicht mehr in der Leiste, also hat er kein Ziel mehr. Das aktive Kapitel setzt `leisteBauen` einmalig beim Laden.

**(d) Burger-Menü:** In `eintragHTML` liest der Baustein heute `e.kinder`. Auf `e.seiten` umstellen, damit Burger und Leiste dieselben Einträge zeigen:

```js
  function eintragHTML(e) {
    if (e.seiten && e.seiten.length) {
      return '<div class="tn-group tn-collapsed">' +
               '<div class="tn-row">' +
                 '<span class="tn-lnk">' + e.text + '</span>' +
                 '<button class="tn-tog" type="button" aria-expanded="false" aria-label="Seiten aufklappen">' + CHEV + '</button>' +
               '</div>' +
               '<div class="tn-sub">' +
                 e.seiten.map(function (s) {
                   return '<a class="tn-lnk sub" href="' + s.href + '">' + s.text + '</a>';
                 }).join('') +
               '</div>' +
             '</div>';
    }
    return '<a class="tn-lnk" href="' + e.href + '">' + e.text + '</a>';
  }
```

Der Kapitelname selbst ist kein Link mehr (`<span>` statt `<a>`), weil ein Kapitel keine eigene Seite hat — nur seine Einträge haben eine. Die Funktion `ziel()` wird nicht mehr gebraucht, weil keine Anker mehr im Menü stehen; sie kann bleiben, schadet nicht.

---

### D3 · `system/nav.css`

Die alte Ausblend-Regel ersetzen. Sie war die Ursache der Doppelung:

```css
/* ALT — löschen: */
@media(max-width:860px){ .nav .navlinks{ display:none; } }
```

Der neue Breakpoint steht jetzt in `nav.js` (D2a), damit Leiste und Burger garantiert dieselbe Grenze benutzen. Ebenfalls löschen: der `navRise`-Stagger-Block (`.nav .navlinks a.lnk{animation:…}` samt den acht `nth-child`-Regeln) — er zielt auf `a.lnk`, die Kapitel sind jetzt `button.lnk`, und eine Einschwebe-Animation der Leiste ist nach dem Animations-Entscheid vom 26.07.2026 ohnehin nicht mehr erwünscht.

---

### D4 · Die Seiten

**Auf JEDER Seite mit `<nav class="nav">`** — also `index.html`, `mitglied.html`, `tfcz-training.html`, `tfcz-firmenevents.html`, `tfcz-ueber-uns.html`, `tfcz-geschichte.html`, `tfcz-regeln.html`, `tfcz-medien.html`:

1. **Den ganzen `<div class="navlinks">…</div>` löschen.** `nav.js` baut ihn jetzt. Übrig bleibt:

```html
<nav class="nav">
  <a class="logo" href="index.html"><img src="assets/img/logo-horizontal-white.png" alt="Tischfussball Club Zürich"></a>
</nav>
```

2. **Die gelöschten Abschnitts-Links als Sprungliste in den Inhalt setzen**, direkt unter den Lead-Text im Hero:

```html
<nav class="jump" aria-label="Abschnitte dieser Seite">
  <span class="lbl">Auf dieser Seite</span>
  <a href="#pakete">Pakete</a>
  <a href="#formular">Anmelden</a>
  <a href="#goenner">Gönner &amp; Sponsoring</a>
</nav>
```

Die Ziele bleiben unverändert — es sind exakt die Anker, die vorher in der Leiste standen:

| Seite | Sprungliste |
|---|---|
| `index.html` | `#kalender` `#formate` `#tische` `#galerie` `#kontakt` |
| `mitglied.html` | `#pakete` `#formular` `#goenner` |
| `tfcz-training.html` | `#programm` `#warum` `#erwartet` `#voranmelden` |
| `tfcz-ueber-uns.html` | `#geschichte` `#stream` `#social` `#fordere` `#community` |
| `angebote.html` (neu) | `#training` `#nachwuchs` `#firmenevents` |

3. **Nur `index.html`:** Die Abschnitts-IDs an die Beschriftungen angleichen, damit Überschrift und Sprungziel gleich heissen (das war Befund „Mitspielen springt woanders hin"):
   `#wettkampf` → `#formate`, `#woche` → `#kalender`. Der Abschnitt `#angebote` verschwindet — sein Inhalt zieht nach `angebote.html`. `#mitglied` verschwindet ebenfalls; die Seite `mitglied.html` deckt das ab.
   **Wichtig:** Danach im ganzen Projekt nach `#woche`, `#wettkampf`, `#angebote` und `#mitglied` suchen und die Treffer nachziehen (Footer, CTA-Karten, `sitemap.xml`, Mail-Vorlagen).

---

### D5 · `angebote.html` (neu)

Als Kopie von `tfcz-training.html` anlegen (gleiches Kopf-Gerüst, gleiche CSS-Einbindung) und den Inhalt aus den drei Blöcken der Startseite unter `#angebote` übernehmen: *Training mit Philipp*, *Nachwuchsförderung*, *Firmenevents & Vermietung*. Jeder Block bekommt eine eigene ID (`#training`, `#nachwuchs`, `#firmenevents`) und die beiden Blöcke mit eigener Detailseite je einen Weiterlesen-Knopf (`.btn-ghost`) auf `tfcz-training.html` bzw. `tfcz-firmenevents.html`.

Pflicht im `<head>`, in dieser Reihenfolge (wie auf allen anderen Seiten):

```html
<link rel="stylesheet" href="assets/css/tfcz-fonts.css">
<link rel="stylesheet" href="system/tokens.css">
<!-- seiten-eigener <style> -->
<link rel="stylesheet" href="system/page.css">
<link rel="stylesheet" href="system/buttons.css">
```

Und nicht vergessen: `sitemap.xml` und `llms.txt` um die neue Seite ergänzen, Titel + Description + Canonical setzen.

---

## TEIL E · Abnahme — messen, nicht behaupten

In der Konsole jeder Seite ausführbar. Alle acht Punkte müssen zutreffen.

```js
// 1 · Nie Leiste UND Burger gleichzeitig sichtbar (bei 390, 900, 1440 prüfen)
(() => { const v = e => e && e.offsetParent !== null;
  return { leiste: v(document.querySelector('.navlinks')), burger: v(document.querySelector('.tn-burger')) }; })()
// erwartet: genau einer der beiden true

// 2 · Kein Anker im Hauptmenü — Regel 1
[...document.querySelectorAll('.navlinks a, .tn-mega a, .tn-drawer a')]
  .map(a => a.getAttribute('href')).filter(h => h && h.includes('#'))
// erwartet: []

// 3 · Genau ein aktives Kapitel
document.querySelectorAll('.nav .lnk[aria-current]').length
// erwartet: 1

// 4 · Leiste überall gleich — auf jeder Seite ausführen, muss identisch sein
[...document.querySelectorAll('.nav .lnk')].map(b => b.textContent.trim()).join(' | ')
// erwartet überall: "Spielen | Angebote | Verein"

// 5 · Kein horizontaler Scroll
document.documentElement.scrollWidth - document.documentElement.clientWidth
// erwartet: 0

// 6 · Sprungliste ist NICHT klebend (Regel 3)
getComputedStyle(document.querySelector('.jump')).position
// erwartet: "static"

// 7 · Keine Konsolenfehler beim Laden
// erwartet: leer — insbesondere kein "[TFCZ nav] Menü-Ziel ist kein Seitenlink"
```

**8 · Von Hand:** Mit Tabulator durch die Leiste, Menüfeld mit Enter öffnen, mit Esc schliessen — der Fokus muss auf dem Kapitel-Knopf zurückbleiben. Auf dem Handy Burger öffnen, X, Esc und Klick daneben schliessen alle. Menü öffnet und schliesst **ohne** Auf-/Zu-Animation.

Zum Schluss den Skill **`tfcz-design-qa`** laufen lassen (Pflicht nach jeder HTML/CSS-Änderung) und den Befund beilegen.

---

## TEIL F · Reihenfolge und Rückweg

Empfohlene Reihenfolge, jeder Schritt für sich testbar:

1. D1 `content.js` — Struktur umstellen (Seite sieht danach kurz kaputt aus, das ist erwartet)
2. D2 `nav.js` — Leiste und Menüfelder bauen, Spy raus
3. D3 `nav.css` — alte Ausblend-Regel und Stagger raus
4. D4 auf **einer** Seite testen (`mitglied.html` ist die kleinste), dann die übrigen
5. D5 `angebote.html`, Anker nachziehen, Sitemap
6. Abnahme E

Vor dem Start `_snapshots/NN-vor-navigation/` anlegen (Konvention im Projekt), danach den Diff **lesen**, nicht nur zählen. Nicht deployen — der Live-Push läuft ausschliesslich über `Website veröffentlichen.command`.

**Zwei Dinge, die beim Umbau leicht schiefgehen:**

- Wird die Leiste erst per JS gebaut, sieht man beim Laden kurz eine leere Kopfzeile. `nav.js` ist mit `defer` eingebunden, das ist akzeptabel — falls es doch stört, ist die Lösung, die Kopfzeilenhöhe per CSS zu reservieren (`.nav{height:72px}` steht bereits in `page.css`), **nicht** die Leiste wieder ins HTML zu schreiben. Sonst hat man zwei Quellen und Problem 1 ist zurück.
- Das offene Menüfeld hängt direkt unter der Leiste. Ohne `.nav.tn-megaopen{border-bottom-color:transparent}` stehen dann Gold- und Blaulinie übereinander — das verletzt die Brand-Line-Regel („blau oben, gold unten, nie zwei Linien"). Die Regel ist in D2a enthalten, sie darf nicht wegoptimiert werden.

**Warum das Menüfeld als Kind von `.nav` funktioniert:** `system/page.css` gibt `.nav` ein `transform: translateZ(0)` (Compositor-Ebene, Entscheid 27.07.2026) und `height:72px !important`. Das `transform` macht `.nav` zum Bezugsrahmen für absolut positionierte Kinder — `top:100%; left:0; right:0` sitzt dadurch exakt unter der Leiste, ohne dass am HTML einer Seite etwas umgebaut werden muss. Die feste Höhe stört nicht, weil das Feld aus dem Fluss genommen ist und die Leiste nicht dehnt.
