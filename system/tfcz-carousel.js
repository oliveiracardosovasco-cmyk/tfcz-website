/* TFCZ Karussell-Loader — füllt Marquee-Strips ([data-feed] auf .mtrack) aus
   assets/fotos/galerie/mapping.json (Liste von Bildpfaden, Reihenfolge fix aus dem Manager).
   Fallback: bleibt bei den im HTML hinterlegten Bildern, wenn keine Liste da ist.
   Einbinden am Ende des <body>:  <script defer src="system/tfcz-carousel.js"></script> */
(function () {
  var URL = 'assets/fotos/galerie/mapping.json';
  function idOf(p){ return String(p).split('?')[0].split('/').pop().replace(/\.(webp|jpg|jpeg|png|avif)$/i,''); }
  function resolveFeed(map, key, d){ d=d||0; var v=map&&map[key]; if(!v||d>4) return null; if(Array.isArray(v)) return v; if(v.same_as) return resolveFeed(map, v.same_as, d+1); return null; }
  function mimg(src){
    return '<div class="mimg"><img src="'+src+'" alt="" loading="lazy" draggable="false">'
         + '<span class="tfcz-like-badge" data-h="'+idOf(src)+'"></span></div>';
  }
  function fill(map){
    var tracks = document.querySelectorAll('.mtrack[data-feed]');
    var touched = false;
    [].forEach.call(tracks, function(tr){
      var list = resolveFeed(map, tr.getAttribute('data-feed'));
      if (!list || !list.length) return;           // Fallback: HTML-Bilder behalten
      tr.innerHTML = list.concat(list).map(mimg).join('');   // doppelt für nahtlose Marquee-Schleife
      touched = true;
    });
    if (touched && window.TFCZ && TFCZ.lightbox && TFCZ.lightbox.paintBadges) {
      TFCZ.lightbox.paintBadges();                 // Like-Badges der neuen Bilder füllen
    }
  }
  try {
    fetch(URL, {cache:'no-cache'})
      .then(function(r){ return r.ok ? r.json() : null; })
      .then(function(m){ if (m) fill(m); })
      .catch(function(){});
  } catch(e){}
})();
