# Schriften — Nunito Sans (SIL Open Font License)

Die TFCZ-Hausschrift liegt hier als Datei im Repo, statt sie von Google Fonts zu laden.

**Warum selbst hosten?**
- **Ohne Internet** (Datei per Doppelklick, Offline-Arbeit) war die Schrift vorher weg —
  dann fiel alles auf eine Systemschrift zurück und der Flyer sah falsch aus.
- **Datenschutz:** kein Aufruf an Google-Server beim Öffnen einer TFCZ-Seite.
- **Export:** der PNG-Export (html2canvas) rendert nur zuverlässig, was der Browser sicher hat.

**Schnitte**
| Datei | Gewicht |
|---|---|
| NunitoSans-Regular.ttf | 400 |
| NunitoSans-Bold.ttf | 700 |
| NunitoSans-Black.ttf | 900 |

Die Gewichte 500 und 800 aus dem Brand Guide werden vom Browser aus dem nächstliegenden
Schnitt synthetisiert. Wer sie exakt braucht, legt die zugehörigen Dateien hier ab und
ergänzt einen weiteren `@font-face`-Block in `assets/css/tfcz-fonts.css`.

Eingebunden über `assets/css/tfcz-fonts.css` — diese Datei wird VOR den Tokens geladen.
