/* ============================================================
   TFCZ · CONTENT — die EINE Quelle für Inhalte, die überall gleich sind.

   Ändere hier das Logo, die Adresse, die Mail oder einen Link — und es ändert
   sich auf JEDER Seite, weil alle Bausteine von hier lesen.

   Einbinden (immer als Erstes, vor den Bausteinen):
     <script src="system/content.js"></script>
   ============================================================ */
window.TFCZ = window.TFCZ || {};

TFCZ.content = {
  /* ---- Verein ---- */
  name:    'Tischfussball Club Zürich',
  adresse: 'Landenbergstrasse 10 · 8037 Zürich · seit 1990',
  mail:    'info@tfcz.ch',

  /* ---- Das EINE Logo (Menübalken, Footer, überall) ---- */
  logo:       'assets/img/logo-horizontal-white.png',   // quer, weiss — für den Kopf
  logoShield: 'assets/img/logo-shield.png',             // Schild — für den Footer

  /* ---- Der EINE Standort (Karte, Kontakt, Anfahrt) ---- */
  ort: { lat: 47.3969, lng: 8.5312, label: 'Landenbergstrasse 10, 8037 Zürich' },

  /* ---- Social ---- */
  social: {
    instagram: 'https://www.instagram.com/tischfussballclubzuerich/',
    youtube:   'https://www.youtube.com/@tischfussballclubzuerich',
    whatsapp:  'https://chat.whatsapp.com/GNawMZIezc39VRN72BAzJX'
  },

  /* ---- Seiten-Registry: EIN Ziel je Seite ----
     Wer irgendwo auf „Regeln" verlinkt, nimmt TFCZ.content.seiten.regeln.
     Ändert sich ein Dateiname, ändert er sich nur hier. */
  seiten: {
    home:        { href: 'index.html',             text: 'Startseite' },
    mitglied:    { href: 'mitglied.html',          text: 'Mitglied werden' },
    training:    { href: 'tfcz-training.html',     text: 'Training mit Philipp' },
    firmenevents:{ href: 'tfcz-firmenevents.html', text: 'Firmenevents' },
    ueberuns:    { href: 'tfcz-ueber-uns.html',    text: 'Über uns' },
    geschichte:  { href: 'tfcz-geschichte.html',   text: 'Geschichte' },
    regeln:      { href: 'tfcz-regeln.html',       text: 'Regeln' },
    medien:      { href: 'tfcz-medien.html',       text: 'Medien' },
    brandguide:  { href: 'component-library.html', text: 'Brand Guide' },
    designstudio:{ href: 'design-studio.html',     text: 'Design Studio' },
    login:       { href: 'login.html',             text: 'Login' }
  },

  /* ---- Die EINE Menü-Struktur (Burger-Drawer auf JEDER Seite) ----
     href: '#anker'  -> Anker auf der HOME (der Nav-Baustein macht daraus auf
                        Unterseiten automatisch 'index.html#anker')
     href: 'seite.html' -> echte Unterseite
     kinder: aufklappbare Untergruppe */
  menu: [
    { text: 'Mitspielen', href: '#wettkampf' },
    { text: 'Kalender',   href: '#woche' },
    { text: 'Mitglied',   href: '#mitglied', kinder: [
        { text: 'Mitglied werden', href: 'mitglied.html' }
    ]},
    { text: 'Sonderevents', href: '#angebote', kinder: [
        { text: 'Training mit Philipp', href: 'tfcz-training.html' },
        { text: 'Firmenevents',         href: 'tfcz-firmenevents.html' }
    ]},
    { text: 'Tische',   href: '#tische' },
    { text: 'Über uns', href: 'tfcz-ueber-uns.html', kinder: [
        { text: 'Geschichte', href: 'tfcz-geschichte.html' },
        { text: 'Regeln',     href: 'tfcz-regeln.html' },
        { text: 'Medien',     href: 'tfcz-medien.html' }
    ]},
    { text: 'Kontakt', href: '#kontakt' }
  ],

  /* ---- Welche Links stehen im Footer (Reihenfolge) ---- */
  footerLinks: ['mitglied','training','firmenevents','ueberuns','geschichte','regeln','medien','brandguide','designstudio']
};
