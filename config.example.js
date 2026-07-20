/* ============================================================================
 * TFCZ · API-Konfiguration (Vorlage)
 * ----------------------------------------------------------------------------
 * So verbindest du die Website mit dem Backend (backend/):
 *   1. Diese Datei nach "config.js" kopieren.
 *   2. TFCZ_API auf die echte Adresse deines Servers setzen.
 *   3. In den Seiten, die den Login nutzen, ganz oben im <head> einbinden:
 *        <script src="config.js"></script>
 *      (vor allen anderen Skripten — die Bausteine lesen diese Werte beim Start).
 *
 * Ist TFCZ_API NICHT gesetzt (also config.js fehlt), läuft alles weiter wie bisher:
 *   Login zeigt „Server nicht verbunden", Studio bleibt im lokalen Gast/Admin-Modus,
 *   Likes leben in localStorage. Nichts bricht.
 *
 * config.js selbst wird NICHT committet (steht in .gitignore), damit die echte
 * Server-Adresse nicht öffentlich im Repo liegt.
 * ========================================================================== */
window.TFCZ_API = 'http://localhost:3000';   // z. B. später: 'https://api.tfcz.ch'

/* TFCZ_USER und TFCZ_TOKEN NICHT hier setzen — die füllt der Login (login.html)
   nach erfolgreicher Anmeldung selbst und legt sie in localStorage ab. */
