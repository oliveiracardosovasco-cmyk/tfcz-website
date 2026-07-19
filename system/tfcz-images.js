/* TFCZ Bild-Loader — setzt Bilder/Backgrounds aus assets/fotos/galerie/mapping.json.
   Einbinden am Ende des <body>:  <script defer src="system/tfcz-images.js"></script>
   Markup:  <img data-slot="index.hero" ...>   ·   <div data-slot="index.bg-bar" ...> (Background) */
(function(){
  var URL='assets/fotos/galerie/mapping.json';
  function apply(map){
    document.querySelectorAll('[data-slot]').forEach(function(el){
      var src=map[el.getAttribute('data-slot')]; if(!src) return;
      if(el.tagName==='IMG'){ if(el.getAttribute('src')!==src) el.setAttribute('src',src); }
      else { el.style.backgroundImage="url('"+src+"')"; }
    });
  }
  try{ fetch(URL,{cache:'no-cache'}).then(function(r){return r.ok?r.json():null;}).then(function(m){if(m)apply(m);}).catch(function(){}); }catch(e){}
})();
