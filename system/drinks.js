/* ============================================================
   TFCZ · GETRÄNKE — die EINE Quelle für Sortiment und Preise.

   Vorher stand die Liste zweimal im HTML (Über uns: 4 Kategorien mit Emojis und
   „CHF –.–" · Firmenevents: 3 Kategorien ohne Snacks und „vor Ort") — zwei
   Wahrheiten, die auseinanderliefen. Ab jetzt: hier ändern = überall geändert.

   Einbinden (nach system/content.js):
       <script src="system/drinks.js"></script>
       <script defer src="system/components/drinks.js"></script>

   ── PREISE KOMMEN AUS DER API — nicht hier pflegen ──────────
   Diese Datei ist **Struktur + Fallback**, keine Preisliste. Die gültigen
   Preise (und das Sortiment) liefert das Backend:

       GET {TFCZ_API}/api/drinks
         -> { "kategorien": [ { "id", "name", "icon",
                                "artikel": [ { "name", "preis" } ] } ],
              "zahlung": "…" }
         preis: Zahl (4.5) oder String ("4.–"); null/fehlend = noch offen.
       (Englische Feldnamen werden ebenfalls akzeptiert: categories/items/price.)

   Sobald `window.TFCZ_API` gesetzt ist, holt der Renderer die Live-Liste und
   ersetzt die Werte unten — ohne Frontend-Änderung. Bis dahin zeigt die Seite
   den Platzhalter („vor Ort" / „CHF –.–").

   `preis: null` unten bedeutet also NICHT „Preis fehlt", sondern: **kommt vom
   Server**. Hier keine Preise hartkodieren.

   Icons: Lucide-Namen (assets/icons/lucide/<name>.svg) — nie Emojis.
   ============================================================ */
window.TFCZ = window.TFCZ || {};

TFCZ.drinks = {
  /* Wie ein Preis dargestellt wird, solange die API ihn nicht geliefert hat */
  platzhalter: 'vor Ort',

  /* Fallback-Struktur, bis die API antwortet. Preise: IMMER null — sie kommen
     vom Server (GET /api/drinks). Hier nichts eintragen. */
  kategorien: [
    { id: 'bier', name: 'Bier & Cider', icon: 'beer', artikel: [
      { name: 'Stange / Flasche', preis: null },
      { name: 'Alkoholfreies Bier', preis: null },
      { name: 'Cider', preis: null }
    ]},
    { id: 'kalt', name: 'Alkoholfrei', icon: 'cup-soda', artikel: [
      { name: 'Mineral / Softdrinks', preis: null },
      { name: 'Eistee', preis: null },
      { name: 'Energy Drink', preis: null }
    ]},
    { id: 'heiss', name: 'Heiss', icon: 'coffee', artikel: [
      { name: 'Kaffee / Espresso', preis: null },
      { name: 'Tee', preis: null }
    ]},
    { id: 'snacks', name: 'Snacks', icon: 'cookie', artikel: [
      { name: 'Chips / Nüssli', preis: null },
      { name: 'Schoggi / Riegel', preis: null }
    ]}
  ],

  /* Zahlung — steht ebenfalls nur hier */
  zahlung: 'Zahlung per Karte / Twint · kein Bargeld'
};
