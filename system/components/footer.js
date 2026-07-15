/* ============================================================
   TFCZ · BAUSTEIN: Footer

   Eine Quelle für ALLE Seiten. Vorher gab es zwei völlig verschiedene Footer
   (voller Footer vs. dünne Textzeile `.foot`) — darum war er auf den Unterseiten
   kürzer.

   Einbauen — die Seite schreibt nur den Platzhalter:
     <div data-tfcz="footer"></div>
     <script src="system/content.js"></script>
     <script defer src="system/components/footer.js"></script>

   Inhalte (Logo, Name, Adresse, Mail, Links) kommen aus system/content.js.

   Eigenschaften (deine Vorgaben):
     · immer über die VOLLE Breite (Brand-Linie blau oben / gold unten)
     · Inhalt zentriert: Logo + Name + Adresse, Nav-Links, Copyright
     · Mail-Adresse zentriert UNTER dem Copyright
     · eigener Klassen-Präfix `.tfcz-footer` → kollidiert nicht mit Seiten-CSS
   ============================================================ */
(function(){
  if (window.__tfczFooter) return;
  window.__tfczFooter = true;

  var C = (window.TFCZ && TFCZ.content) || {};

  /* ---------- CSS (eigener Präfix, stört nichts Bestehendes) ---------- */
  if (!document.getElementById('tfcz-footer-css')) {
    var css =
      '.tfcz-footer{position:relative; z-index:1; margin-top:20px; width:100%;' +
        'border-top:4px solid #5ca7dc;' +
        'background:linear-gradient(180deg, rgba(8,20,32,.94), rgba(5,13,21,.97));' +
        'font-family:"Nunito Sans",system-ui,-apple-system,sans-serif}' +
      '.tfcz-footer::after{content:""; display:block; height:4px; background:#cda857}' +

      /* Inhalt: gestapelt und zentriert */
      '.tfcz-footer .fw{max-width:1160px; margin:0 auto; padding:44px 22px 40px;' +
        'display:flex; flex-direction:column; align-items:center; text-align:center; gap:20px}' +

      '.tfcz-footer .brand{display:flex; align-items:center; justify-content:center; gap:12px;' +
        'font-weight:900; color:#fff; text-align:left}' +
      '.tfcz-footer .brand img{width:40px; height:40px; object-fit:contain}' +
      '.tfcz-footer .brand small{display:block; font-weight:700; color:#c3d2e0; font-size:12px}' +

      '.tfcz-footer nav{display:flex; flex-wrap:wrap; justify-content:center; gap:16px}' +
      '.tfcz-footer nav a{color:#c3d2e0; font-size:13px; font-weight:700; text-decoration:none;' +
        'transition:color .16s ease}' +
      '.tfcz-footer nav a:hover{color:#fff}' +

      '.tfcz-footer .copy{width:100%; font-size:12px; color:rgba(255,255,255,.45)}' +
      '.tfcz-footer .mail{display:inline-block; color:#e9c475; font-weight:800; font-size:13px;' +
        'text-decoration:none; transition:color .16s ease}' +
      '.tfcz-footer .mail:hover{color:#fff}';

    var st = document.createElement('style');
    st.id = 'tfcz-footer-css';
    st.textContent = css;
    document.head.appendChild(st);
  }

  /* ---------- Markup aus den Inhalten bauen ---------- */
  function build() {
    var slots = document.querySelectorAll('[data-tfcz="footer"]');
    if (!slots.length) return;

    var seiten = C.seiten || {};
    var links = (C.footerLinks || []).map(function (key) {
      var s = seiten[key];
      return s ? '<a href="' + s.href + '">' + s.text + '</a>' : '';
    }).join('');

    var jahr = new Date().getFullYear();

    var html =
      '<div class="fw">' +
        '<div class="brand">' +
          '<img src="' + (C.logoShield || '') + '" alt="TFCZ">' +
          '<div>' + (C.name || '') +
            '<small>' + (C.adresse || '') + '</small>' +
          '</div>' +
        '</div>' +
        '<nav>' + links + '</nav>' +
        '<div class="copy">© ' + jahr + ' ' + (C.name || '') +
          ' · Mitglied der Swiss Tablesoccer Federation</div>' +
        '<a class="mail" href="mailto:' + (C.mail || '') + '">' + (C.mail || '') + '</a>' +
      '</div>';

    /* Der Footer muss auf Body-Ebene hängen, sonst wird er von einem
       Inhalts-Container auf 1160px beschnitten und ist schmaler als die Home. */
    [].forEach.call(slots, function (slot) {
      var f = document.createElement('footer');
      f.className = 'tfcz-footer';
      f.innerHTML = html;
      document.body.appendChild(f);
      if (slot.parentNode) slot.parentNode.removeChild(slot);
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', build);
  else build();
})();
