# QA-Tools

## check-render.js — Render-Prüfung (PFLICHT nach globalen Refactors)
Lädt jede Live-Seite headless (jsdom) und fängt Laufzeitfehler ab, die ein Inline-Script
abbrechen — z. B. ein verwaister `getElementById('yr')` nach dem Auslagern des Footers.
Solche Abbrüche stoppen u. a. den Reveal-Observer → `.reveal`-Inhalte (`opacity:0`) bleiben
unsichtbar und die Seite wirkt LEER, obwohl das HTML da ist.

    cd 01_Web/website-v2
    npm i jsdom        # einmalig
    node tools/check-render.js

Ausgabe `OK`/`FAIL` je Seite (Textmenge · reveal in/total · echte Fehler). Canvas-Meldungen
von `bg-swirl.js` sind jsdom-Limitierungen und werden gefiltert (kein echter Bug).
