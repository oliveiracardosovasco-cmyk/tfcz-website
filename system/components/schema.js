/* ============================================================
   TFCZ · BAUSTEIN: SportsClub-Schema (JSON-LD)
   Eine Quelle fuer strukturierte Daten auf allen Unterseiten.
   Idempotent: liegt bereits ein statisches #club-Schema vor (Startseite),
   passiert nichts. Adresse/Geo aendern = nur hier.
   Einbau: <script defer src="system/components/schema.js"></script>
   ============================================================ */
(function(){
  try{
    var has=[].some.call(document.querySelectorAll('script[type="application/ld+json"]'),
      function(s){ return /#club/.test(s.textContent||''); });
    if(has) return;
    var data={
      "@context":"https://schema.org","@type":"SportsClub","@id":"https://tfcz.ch/#club",
      "name":"Tischfussball Club Zürich","alternateName":"TFCZ","url":"https://tfcz.ch/",
      "logo":"https://tfcz.ch/assets/img/logo-shield.png",
      "image":"https://tfcz.ch/assets/fotos/action/action-13.jpg",
      "description":"Grösster Profi-Tischfussball-Verein der Schweiz — und trotzdem sind alle willkommen. Offenes Training, Plausch-Turniere und Käsekick in Zürich Wipkingen.",
      "foundingDate":"1990","email":"info@tfcz.ch","sport":"Tischfussball",
      "address":{"@type":"PostalAddress","streetAddress":"Landenbergstrasse 10","postalCode":"8037","addressLocality":"Zürich","addressRegion":"ZH","addressCountry":"CH"},
      "geo":{"@type":"GeoCoordinates","latitude":47.3918,"longitude":8.5271},
      "sameAs":["https://www.instagram.com/tischfussballclubzuerich/"]
    };
    var el=document.createElement('script');
    el.type='application/ld+json'; el.setAttribute('data-tfcz-schema','');
    el.textContent=JSON.stringify(data);
    document.head.appendChild(el);
  }catch(e){}
})();
