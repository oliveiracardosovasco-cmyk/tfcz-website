/* ============================================================
   TFCZ · CTA-REGISTRY — die EINE Quelle für Buttons und ihre Ziele.

   In der Seite steht nur noch:
       <a data-cta="mitglied-werden" class="btn btn-gold">Mitglied werden</a>

   Ziel (href) kommt aus dieser Registry. Ändert sich ein Ziel, ändert es sich
   auf ALLEN Seiten — auch wenn ein Dritter den Button irgendwo einbaut.

   Einbinden (nach system/content.js):
       <script src="system/cta.js"></script>
       <script defer src="system/components/cta.js"></script>

   ── FARBREGEL (verbindlich, freigegeben Vasco 14.07.2026) ───
   gold  = ECHTE CONVERSION **oder** LEAD-ANFRAGE:
             · in den Verein eintreten / sich anmelden
               („Mitglied werden", „Erster Abend gratis", „Platz sichern")
             · eine qualifizierte Anfrage auslösen, die zu einem Lead wird
               („Verfügbarkeit prüfen", „Diesen Termin anfragen" auf Firmenevents)
           Das ist jeweils die ZENTRALE Handlung der Seite.
   blau  = normale Aktion (Absenden, Öffnen, Erstellen).
   ghost = Navigation, „mehr erfahren", sekundär.
   NICHT gold: reine Navigation — auch wenn sie einladend klingt
   (z. B. „Komm vorbei" führt in den Kalender → ghost).
   Gold bleibt dadurch knapp und wertvoll.
   ============================================================ */
window.TFCZ = window.TFCZ || {};

TFCZ.ctas = {
  /* ---- Conversion: in den Verein (GOLD) ---- */
  'mitglied-werden': {
    href: 'mitglied.html',
    text: 'Mitglied werden',
    stil: 'gold'
  },
  'schnuppern': {
    href: 'mitglied.html?paket=schnuppern',
    text: 'Erster Abend gratis',
    stil: 'gold'
  },
  'training-anmelden': {          // Semester-Anmeldung = Anmelde-Handlung → gold
    href: '#voranmelden',
    text: 'Platz sichern',
    stil: 'gold'
  },

  /* ---- Lead-Anfrage: zentrale Handlung der Firmenevents-Seite (GOLD) ---- */
  'firmenevent-verfuegbarkeit': {
    href: '#verfuegbar',
    text: 'Verfügbarkeit prüfen',
    stil: 'lead'
  },
  'firmenevent-termin': {
    href: '#anfrage-formular',
    text: 'Diesen Termin anfragen',
    stil: 'lead'
  },

  /* ---- Navigation / sekundär (GHOST) ---- */
  'komm-vorbei':  { href: 'index.html#woche',        text: 'Komm vorbei',        stil: 'ghost' },
  'kalender':     { href: 'index.html#woche',        text: 'Kalender',           stil: 'ghost' },
  'regeln':       { href: 'tfcz-regeln.html',        text: 'Alle Regeln',        stil: 'ghost' },
  'training':     { href: 'tfcz-training.html',      text: 'Training mit Philipp', stil: 'ghost' },
  'firmenevents': { href: 'tfcz-firmenevents.html',  text: 'Firmenevents',       stil: 'ghost' },
  'ueberuns':     { href: 'tfcz-ueber-uns.html',     text: 'Über uns',           stil: 'ghost' },
  'geschichte':   { href: 'tfcz-geschichte.html',    text: 'Geschichte',         stil: 'ghost' },
  'medien':       { href: 'tfcz-medien.html',        text: 'Medien',             stil: 'ghost' },
  'brandguide':   { href: 'brandguide.html',  text: 'Brand Guide',        stil: 'ghost' }
};
