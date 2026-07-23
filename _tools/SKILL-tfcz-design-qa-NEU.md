---
name: tfcz-design-qa
description: >
  Systematischer Design-/Code-QA-Durchlauf über die TFCZ-Website (TFCZ-v3, Ordner
  "ocsav - tfcz_Web"). Nutze diesen Skill IMMER wenn Vasco eine Fehlersuche, ein Audit, einen
  "Feinschliff", eine Konsistenzprüfung oder QA über die Seiten will (z. B. "such Fehler",
  "geh die Seite durch", "prüf die Brandguide-Konformität", "stimmt alles noch überein",
  "Design QA"). Nutze ihn AUCH als Pflicht-Abschluss nach JEDER Änderung an HTML/CSS der
  Website — bevor du "fertig" sagst. Findet mechanische Schäden (Selektor-Trümmer, Kontrast,
  Icon-Grösse, Overflow, JS-Fehler) über ein Messskript und Abweichungen von CLAUDE.md +
  brandguide.html über gezielte Prüfung.
---

# TFCZ Design-QA — messen statt meinen

Du bist misstrauisch gegen **deine eigene Arbeit**. Der teuerste Fehler dieses Projekts war nicht
ein Bug — es war eine Prüfung, die "0 Rest-Vorkommen" gezählt und daraus "sauber" geschlossen hat.
Zählen ist keine Prüfung. **Lies, was du verändert hast, und miss das Ergebnis im Browser.**

## Regel 0 — das Skript läuft IMMER, und zwar zuerst

```
cd "ocsav - tfcz_Web" && node _tools/pruefen.mjs        # Exit 1 = nicht ausliefern
```

Es prüft mechanisch: Selektor-Trümmer · Klammer-Balance · Kontrast (Gold-Button = dunkler Text) ·
Icon-Grösse im Button · X-Overflow (Desktop **und** Mobile 390px) · JS-Fehler · Emojis ·
Button-Token-Treue. **Nie "fertig" sagen, solange es rot ist.** Ergebnis im Bericht nennen —
nicht "sieht gut aus".

**Baust du einen neuen Check: Gegenprobe ist Pflicht.** Lass ihn gegen einen bekannt kaputten
Snapshot (`_snapshots/57-vor-reparatur/`) laufen. Meldet er den NICHT als kaputt, prüft er nichts.
Und prüfe ihn auf Fehlalarm (der erste Entwurf hielt CSS-Kommentare für Trümmer).

## Quellen der Wahrheit
1. `~/Claude/Projects/TFCZ-v3/CLAUDE.md` — verbindliche Regeln (gewinnt bei Widerspruch).
2. `ocsav - tfcz_Web/brandguide.html` — Brand Guide (Live-Bausteine, Tokens, CTA-System).
3. `ocsav - tfcz_Web/index.html` — Home = Referenz für globale Elemente.
4. `ocsav - tfcz_Web/system/` — die Bausteine. Ändert sich ein Element, ändert es sich HIER.

## Live-Seiten (immer alle prüfen)
`index.html` (Home), `mitglied.html`, `tfcz-training.html`, `tfcz-firmenevents.html`,
`tfcz-geschichte.html`, `tfcz-ueber-uns.html`, `tfcz-regeln.html`, `tfcz-medien.html`,
`login.html`, `dashboard.html`, `brandguide.html`.
Ordner mit `_` (`_snapshots`, `_secret`, `_module`, `_tools`) sind **nie** Live.

## Ablauf bei JEDER Änderung (nicht verhandelbar)
1. **Snapshot ZUERST**: `_snapshots/NN-vor-<thema>/` (HTML + `system/`). Ohne Snapshot kein Diff,
   ohne Diff keine Prüfung.
2. Ändern — **Regex so eng wie möglich**.
3. **Diff gegen den Snapshot LESEN** (nicht zählen). Sonderzeichen mitprüfen: `·`, `–`, `→`,
   `&shy;`, `&nbsp;`, Umlaute, Betreff-/Mailtexte.
4. `node _tools/pruefen.mjs` — grün.
5. Bericht: was geändert, was gemessen, wie zurückrollen (`cp _snapshots/NN-…/*.html .`).

## Die fünf Fehlermuster, die hier wirklich passiert sind

1. **Regex trifft Teil-Selektoren.** `\.acta\{...\}` schlug mitten in `.acard a.acta{...}` zu →
   `.acard a` blieb als **Trümmer ohne Block** stehen. Ein solcher Rest **frisst die nächste Regel**
   (der Parser liest ihn als Selektor-Fortsetzung) — dadurch griff `.acard a.acta svg{width:15px}`
   nicht mehr und das Icon wurde **175px**. Immer über den **ganzen** Selektor matchen
   (`^[^{}]*\.acta[^{}]*\{`), nie über das Klassen-Fragment.
2. **Layout-Props verschwinden mit.** Beim Löschen einer Alt-Klasse geht auch ihr Layout
   (`align-self:flex-start`, `margin`, `position`). Vor dem Löschen trennen: Farbe/Radius/Padding →
   Baustein; Layout bleibt als **Layout-Hook**.
3. **Seiten-Regeln schlagen den Baustein.** `.acard a{color:gold}` (0-1-1) überschreibt
   `.btn-gold{color:navy}` (0-1-0) → Gold auf Gold. Fix ist **nicht** Farbe pro Seite
   nachpflastern, sondern die Seiten-Regel ausnehmen: `.acard a:not(.btn)`.
4. **Generische Klassennamen gehören dir nicht.** Die Kicker-Regel auf `.lbl` zerschoss die
   Barometer-Balken-Beschriftung. Vor globalen Regeln auf `.lbl`/`.tag`/`.on`/`.sub` **projektweit
   greppen**, wer sie sonst nutzt.
5. **SVG ohne Grösse explodiert.** Ein Icon ohne `width`/`height` wird im Flex-Container riesig
   (oder 0). Der Baustein setzt `.btn svg{width:1.15em}` — beim Bauen neuer Komponenten mitdenken.

## Was das Skript NICHT kann (dafür bist du da)
Design-Urteile: "wirkt komisch", Rhythmus, Hierarchie, ob ein Text stimmt. Ebenso:
Single-Source-Verstösse (dasselbe Element zweimal gebaut), CTA-Semantik (Gold nur Conversion/Lead),
tote/falsche Links, Regelverstösse gegen CLAUDE.md. Diese Punkte prüfst du **gezielt und mit Beleg
(Datei + Zeile)** — raten ist verboten, `grep`/lesen ist Pflicht.

## Single-Source-Check (der wichtigste inhaltliche Teil)
Jedes Element auf ≥2 Seiten MUSS aus `system/` kommen. Divergenz = Fehler. Typischer Fund:
eine Seite hat noch eine **eigene Kopie** einer Regel, die längst im Baustein steht (so überlebte
der abgeschaffte Shiny-Glow in `index.html`, obwohl er im Baustein schon weg war). Suche daher
nicht nur nach der Klasse, sondern nach dem **Muster** (z. B. `left:-80%` + `skewX`).

## Bericht (Format)
- **Was gemessen** (Skript-Ergebnis, Diff gegen welchen Snapshot).
- **Funde** priorisiert: kaputt > Regelverstoss > Inkonsistenz > Kosmetik. Jeder mit Datei + Zeile.
- **Was ich geändert habe** und was bewusst **nicht**.
- **Rollback-Befehl**.
- Bei Unsicherheit: fragen, nicht raten.
