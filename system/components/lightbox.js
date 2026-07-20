/* ============================================================
   TFCZ · BAUSTEIN: Bild-Player (Lightbox) + Like-Herz

   EIN Player für alle Seiten. Vorher steckte er komplett in der Home; die
   Training-Seite hatte nur eine Bilder-Strecke ohne Player (Reuse-First-Fehler).

   Einbauen — die Seite markiert nur ihre Bilder-Gruppe:
     <section class="gal" data-lightbox> … <img src="assets/fotos/action/action-01.jpg"> … </section>
     <script src="system/content.js"></script>
     <script src="system/likes.js"></script>
     <script defer src="system/components/lightbox.js"></script>

   Der Baustein baut den Player selbst (X · Pfeile · Thumbnail-Dock · Herz),
   hängt ihn an den Body und verdrahtet jeden Klick auf ein Bild der Gruppe.
   Bilder-ID = Dateiname ohne Endung (z. B. "action-07") → die Like-Zähler sind
   dieselben wie auf jeder anderen Seite (system/likes.js).

   API (für Seiten mit eigener Klick-/Drag-Logik, z. B. die Home-Marquee):
     TFCZ.lightbox.openFrom(imgEl)   — öffnet den Player bei diesem Bild
     TFCZ.lightbox.open(liste, i)    — liste = [{id, src, alt}]

   Zähler-Badges: JEDES Element mit `data-h="<bildId>"` wird automatisch mit
   Herz + Zahl gefüllt (leer bei 0). Gilt seitenübergreifend.

   Regeln (CLAUDE.md): Herz = Lucide-Herz, blau gefüllt wenn geliked (Like ist
   eine Aktion, keine Conversion) · X = runder Standard-X mit Quetschen, Hover rot ·
   Schliessen per X, Esc, Klick daneben.
   ============================================================ */
(function () {
  if (window.__tfczLightbox) return;
  window.__tfczLightbox = true;

  var HEART = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>';

  /* ---------- CSS (eigener Präfix `tfcz-lb`) ---------- */
  if (!document.getElementById('tfcz-lb-css')) {
    var css = [
      '.tfcz-lb{position:fixed; inset:0; z-index:200; background:rgba(4,10,17,.92); backdrop-filter:blur(6px); display:none; flex-direction:column; align-items:center; justify-content:center; padding:clamp(14px,3vw,34px) clamp(14px,4vw,72px) clamp(12px,2vw,22px)}',
      '.tfcz-lb.on{display:flex}',
      '.tfcz-lb-stage{position:relative; display:flex; align-items:center; justify-content:center; flex:1; min-height:0; width:100%}',
      '.tfcz-lb-imgwrap{position:relative; display:inline-block; line-height:0; max-width:100%; animation:tfczLbPop .3s cubic-bezier(.4,0,.2,1)}',
      '.tfcz-lb-stage img{display:block; max-width:min(1180px,92vw); max-height:74vh; width:auto; height:auto; border-radius:var(--r-lg,16px); border-top:3px solid var(--blue,#5ca7dc); border-bottom:3px solid var(--gold,#cda857); box-shadow:var(--e-3,0 24px 60px rgba(0,0,0,.5))}',
      '@keyframes tfczLbPop{from{opacity:0; transform:scale(.97)}to{opacity:1; transform:none}}',

      /* X — runder Standard-Schliessen-Button */
      '.tfcz-lb-x{position:absolute; top:10px; right:10px; width:38px; height:38px; border-radius:50%; background:rgba(9,21,33,.62); backdrop-filter:blur(6px); border:1px solid var(--card-brd,rgba(255,255,255,.14)); color:#fff; cursor:pointer; display:grid; place-items:center; z-index:4; transition:.16s ease}',
      '.tfcz-lb-x svg{width:17px; height:17px}',
      '.tfcz-lb-x:hover{background:var(--red,#da2929); border-color:var(--red,#da2929); animation:tfczXsquish .42s}',
      '.tfcz-lb-x:active{transform:scale(.9)}',
      '@keyframes tfczXsquish{0%{transform:scale(1,1)}35%{transform:scale(1.22,.78)}70%{transform:scale(.92,1.08)}100%{transform:scale(1,1)}}',

      /* Pfeile */
      '.tfcz-lb-nav{position:absolute; top:50%; transform:translateY(-50%); width:clamp(40px,5vw,52px); height:clamp(40px,5vw,52px); border-radius:50%; background:rgba(13,39,61,.55); backdrop-filter:blur(8px); border:1px solid var(--card-brd,rgba(255,255,255,.14)); color:#fff; font-size:26px; line-height:1; cursor:pointer; display:grid; place-items:center; z-index:3; transition:.16s cubic-bezier(.4,0,.2,1)}',
      '.tfcz-lb-nav:hover{transform:translateY(-50%) scale(1.08); box-shadow:inset 0 2px 0 var(--blue,#5ca7dc), inset 0 -2px 0 var(--gold,#cda857)}',
      '.tfcz-lb-prev{left:clamp(6px,2vw,20px)} .tfcz-lb-next{right:clamp(6px,2vw,20px)}',
      '.tfcz-lb-nav svg{width:22px; height:22px; display:block}',

      /* Herz */
      '.tfcz-lb-like{position:absolute; right:14px; bottom:14px; width:48px; height:48px; border-radius:50%; background:rgba(13,39,61,.6); backdrop-filter:blur(8px); border:1px solid var(--card-brd,rgba(255,255,255,.14)); cursor:pointer; display:grid; place-items:center; z-index:3; transition:transform .16s cubic-bezier(.4,0,.2,1), border-color .16s}',
      '.tfcz-lb-like svg{display:block; width:24px; height:24px; fill:none; stroke:#fff; stroke-width:2; stroke-linejoin:round; transition:.2s cubic-bezier(.4,0,.2,1)}',
      '.tfcz-lb-like:hover{box-shadow:inset 0 2px 0 var(--blue,#5ca7dc), inset 0 -2px 0 var(--gold,#cda857)}',
      '.tfcz-lb-like:active{transform:scale(.85)}',
      '.tfcz-lb-like.liked svg{fill:var(--blue,#5ca7dc); stroke:var(--blue,#5ca7dc); animation:tfczHeartPop .42s cubic-bezier(.4,0,.2,1)}',
      '@keyframes tfczHeartPop{0%{transform:scale(1)}35%{transform:scale(1.4)}60%{transform:scale(.9)}100%{transform:scale(1)}}',
      '.tfcz-lb-cnt{position:absolute; top:-4px; right:-4px; min-width:18px; height:18px; padding:0 5px; border-radius:9px; background:var(--gold,#cda857); color:var(--navy,#0d273d); font-size:11px; font-weight:900; display:none; align-items:center; justify-content:center; box-shadow:var(--e-1,0 2px 8px rgba(0,0,0,.3))}',
      '.tfcz-lb-cnt.on{display:flex}',

      /* aufsteigende Herzen */
      '.tfcz-heartfx{position:absolute; z-index:5; pointer-events:none; color:var(--blue,#5ca7dc); will-change:transform,opacity; animation:tfczHeartFly 1s ease-out forwards}',
      '.tfcz-heartfx svg{width:100%; height:100%; display:block; fill:currentColor; stroke:currentColor}',
      '@keyframes tfczHeartFly{0%{opacity:1; transform:translate(-50%,0) scale(.6)}100%{opacity:0; transform:translate(var(--dx,-50%),-120px) scale(1.3)}}',

      /* Thumbnail-Dock */
      '.tfcz-lb-strip{display:flex; gap:8px; margin-top:14px; padding:8px 6px 12px; max-width:100%; overflow-x:auto; overflow-y:hidden; scrollbar-width:none; align-items:center}',
      '.tfcz-lb-strip::-webkit-scrollbar{display:none}',
      '.tfcz-lb-thumb{flex:none; width:60px; height:44px; border-radius:8px; overflow:hidden; cursor:pointer; border:2px solid transparent; opacity:.55; transition:transform .2s cubic-bezier(.4,0,.2,1), margin .2s cubic-bezier(.4,0,.2,1), opacity .2s; position:relative; padding:0; background:none}',
      '.tfcz-lb-thumb img{width:100%; height:100%; object-fit:cover; display:block}',
      '.tfcz-lb-strip:hover .tfcz-lb-thumb{opacity:.4}',
      '.tfcz-lb-strip .tfcz-lb-thumb:hover{transform:scale(1.45); margin:0 12px; opacity:1; z-index:2; box-shadow:inset 0 3px 0 var(--blue,#5ca7dc), inset 0 -3px 0 var(--gold,#cda857)}',
      '.tfcz-lb-thumb.cur{opacity:1; border-color:var(--gold,#cda857)}',

      /* Zähler-Badge auf Thumbnails und auf den Bildern der Seite */
      '.tfcz-h{display:inline-flex; align-items:center; gap:3px; line-height:1}',
      '.tfcz-h svg{width:1em; height:1em; fill:var(--blue,#5ca7dc); stroke:var(--blue,#5ca7dc); stroke-width:2; display:block}',
      '.tfcz-lb-thumb .tfcz-mini{position:absolute; right:3px; bottom:3px; font-size:9.5px; font-weight:900; color:#fff; background:color-mix(in srgb, var(--blue,#5ca7dc) 78%, rgba(9,21,33,.6)); border-radius:6px; padding:1px 4px; line-height:1.3; box-shadow:0 1px 3px rgba(0,0,0,.5)}',
      '.tfcz-lb-thumb .tfcz-mini:empty{display:none}',
      '.tfcz-lb-thumb .tfcz-mini svg{fill:#fff; stroke:#fff}',
      /* Badge für Seiten ohne eigenes Badge-CSS (z. B. Training-Marquee) */
      '.tfcz-like-badge{position:absolute; right:8px; bottom:8px; z-index:2; font-size:12px; font-weight:900; color:#fff; background:rgba(9,21,33,.86); border-radius:999px; padding:3px 9px; line-height:1.2; box-shadow:0 2px 6px rgba(0,0,0,.5); pointer-events:none}',
      '.tfcz-like-badge:empty{display:none}',

      '@media(max-width:640px){',
      '  .tfcz-lb{padding:10px 6px 8px}',
      '  .tfcz-lb-stage img{max-height:62vh; max-width:96vw}',
      '  .tfcz-lb-nav{width:38px; height:38px; font-size:22px}',
      '  .tfcz-lb-prev{left:5px} .tfcz-lb-next{right:5px}',
      '  .tfcz-lb-x{top:8px; right:8px; width:34px; height:34px}',
      '  .tfcz-lb-like{width:42px; height:42px; right:10px; bottom:10px}',
      '  .tfcz-lb-thumb{width:50px; height:36px}',
      '  .tfcz-lb-strip .tfcz-lb-thumb:hover{transform:scale(1.25); margin:0 7px}',
      '}',
      '@media(prefers-reduced-motion:reduce){.tfcz-lb-imgwrap,.tfcz-lb-like.liked svg,.tfcz-heartfx{animation:none}}'
    ].join('');
    var st = document.createElement('style');
    st.id = 'tfcz-lb-css';
    st.textContent = css;
    document.head.appendChild(st);
  }

  /* ---------- Player bauen (einmal, am Body) ---------- */
  var lb = document.createElement('div');
  lb.className = 'tfcz-lb';
  lb.setAttribute('aria-hidden', 'true');
  var ARR_L='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>';
  var ARR_R='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>';
  lb.innerHTML =
    '<div class="tfcz-lb-stage">' +
      '<button class="tfcz-lb-nav tfcz-lb-prev" aria-label="Vorheriges Bild">'+ARR_L+'</button>' +
      '<button class="tfcz-lb-nav tfcz-lb-next" aria-label="Nächstes Bild">'+ARR_R+'</button>' +
      '<div class="tfcz-lb-imgwrap">' +
        '<img alt="Foto gross" draggable="false">' +
        '<button class="tfcz-lb-x" aria-label="Schliessen"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg></button>' +
        '<button class="tfcz-lb-like" aria-label="Gefällt mir">' + HEART + '<span class="tfcz-lb-cnt"></span></button>' +
      '</div>' +
    '</div>' +
    '<div class="tfcz-lb-strip"></div>';

  var stage, img, strip, likeBtn, cntEl, thumbs = [];
  var LISTE = [], cur = 0;

  function q(sel) { return lb.querySelector(sel); }

  function mount() {
    if (lb.parentNode) return;
    document.body.appendChild(lb);
    stage = q('.tfcz-lb-stage'); img = q('.tfcz-lb-stage img');
    strip = q('.tfcz-lb-strip'); likeBtn = q('.tfcz-lb-like'); cntEl = q('.tfcz-lb-cnt');

    q('.tfcz-lb-x').addEventListener('click', close);
    q('.tfcz-lb-prev').addEventListener('click', function () { show(cur - 1); });
    q('.tfcz-lb-next').addEventListener('click', function () { show(cur + 1); });
    likeBtn.addEventListener('click', toggle);
    img.addEventListener('dblclick', toggle);
    strip.addEventListener('click', function (e) {
      var t = e.target.closest('.tfcz-lb-thumb');
      if (t) show(+t.getAttribute('data-i'));
    });
    /* Deselektierung: Klick neben das Bild (Backdrop / leere Stage) schliesst */
    lb.addEventListener('click', function (e) {
      if (e.target === lb || e.target === stage || (e.target.classList && e.target.classList.contains('tfcz-lb-imgwrap'))) close();
    });
    addEventListener('keydown', function (e) {
      if (!lb.classList.contains('on')) return;
      if (e.key === 'Escape') close();
      else if (e.key === 'ArrowLeft') show(cur - 1);
      else if (e.key === 'ArrowRight') show(cur + 1);
      else if (e.key === ' ') { e.preventDefault(); toggle(); }
    });
    var _tx = null;
    stage.addEventListener('touchstart', function (e) { if (e.touches && e.touches.length === 1) _tx = e.touches[0].clientX; }, { passive: true });
    stage.addEventListener('touchend', function (e) { if (_tx == null) return; var dx = e.changedTouches[0].clientX - _tx; _tx = null; if (Math.abs(dx) > 40) show(dx < 0 ? cur + 1 : cur - 1); }, { passive: true });
  }

  /* ---------- Likes ---------- */
  function L() { return (window.TFCZ && TFCZ.likes) || null; }
  function count(id) { var s = L(); return s ? s.count(id) : 0; }
  function liked(id) { var s = L(); return s ? s.liked(id) : false; }

  function badgeHTML(id) {
    var c = count(id);
    return c > 0 ? '<span class="tfcz-h">' + HEART + c + '</span>' : '';
  }
  /* JEDES Element mit data-h="<id>" auf der Seite bekommt Herz + Zahl */
  function paintBadges(id) {
    var sel = id ? '[data-h="' + id + '"]' : '[data-h]';
    [].forEach.call(document.querySelectorAll(sel), function (el) {
      el.innerHTML = badgeHTML(el.getAttribute('data-h'));
    });
  }
  function syncLike() {
    if (!LISTE.length) return;
    var id = LISTE[cur].id;
    likeBtn.classList.toggle('liked', liked(id));
    var c = count(id);
    cntEl.textContent = c;
    cntEl.classList.toggle('on', c > 0);
  }
  function burst() {
    var r = likeBtn.getBoundingClientRect(), sr = stage.getBoundingClientRect();
    var cx = r.left - sr.left + r.width / 2, cy = r.top - sr.top + r.height / 2;
    for (var k = 0; k < 7; k++) {
      (function (k) {
        var s = document.createElement('span');
        s.className = 'tfcz-heartfx';
        s.innerHTML = HEART;
        var size = 14 + Math.random() * 16;
        s.style.left = cx + 'px'; s.style.top = cy + 'px';
        s.style.width = size + 'px'; s.style.height = size + 'px';
        s.style.setProperty('--dx', (Math.random() * 80 - 40 - 50) + '%');
        s.style.animationDelay = (k * 0.04) + 's';
        stage.appendChild(s);
        setTimeout(function () { s.remove(); }, 1100 + k * 40);
      })(k);
    }
  }
  function toggle() {
    var s = L(); if (!s || !LISTE.length) return;
    var id = LISTE[cur].id;
    var jetzt = s.toggle(id);
    if (jetzt) burst();
  }

  /* ---------- Anzeigen ---------- */
  function renderStrip() {
    strip.innerHTML = LISTE.map(function (b, i) {
      return '<button class="tfcz-lb-thumb" data-i="' + i + '">' +
               '<img src="' + b.src + '" alt="" loading="lazy" draggable="false">' +
               '<span class="tfcz-mini" data-h="' + b.id + '"></span>' +
             '</button>';
    }).join('');
    thumbs = [].slice.call(strip.querySelectorAll('.tfcz-lb-thumb'));
    paintBadges();
  }
  function show(i) {
    if (!LISTE.length) return;
    cur = (i % LISTE.length + LISTE.length) % LISTE.length;
    img.src = LISTE[cur].full || LISTE[cur].src;
    img.alt = LISTE[cur].alt || 'Foto gross';
    thumbs.forEach(function (t, j) { t.classList.toggle('cur', j === cur); });
    var ct = thumbs[cur];
    if (ct) { try { ct.scrollIntoView({ inline: 'center', block: 'nearest', behavior: 'smooth' }); } catch (e) {} }
    syncLike();
  }
  function open(liste, i) {
    if (!liste || !liste.length) return;
    mount();
    LISTE = liste;
    renderStrip();
    show(i || 0);
    lb.classList.add('on');
    lb.setAttribute('aria-hidden', 'false');
  }
  function close() {
    if (!lb.classList.contains('on')) return;
    var box = lb.querySelector('.tfcz-lb-imgwrap');
    var weg = function () {
      lb.classList.remove('on');
      lb.setAttribute('aria-hidden', 'true');
    };
    /* Portal-Schliessen (Baustein). Fehlt es, sofort schliessen. */
    if (window.TFCZ && TFCZ.portal) TFCZ.portal.close(box, weg);
    else weg();
  }

  /* ---------- Bilder-Gruppen einer Seite einlesen ---------- */
  function idOf(src) {
    var f = String(src).split('?')[0].split('#')[0].split('/').pop();
    return f.replace(/\.(jpg|jpeg|png|webp|avif)$/i, '');
  }
  function fullOf(src){ return String(src).indexOf('/galerie/thumb/') >= 0 ? src.replace('/galerie/thumb/','/galerie/full/') : src; }
  function listeVon(container) {
    var seen = {}, out = [];
    [].forEach.call(container.querySelectorAll('img'), function (im) {
      var src = im.getAttribute('src') || im.src;
      if (!src) return;
      var id = idOf(src);
      if (seen[id]) return;          // die Marquee zeigt jedes Bild doppelt
      seen[id] = true;
      out.push({ id: id, src: src, full: fullOf(src), alt: im.getAttribute('alt') || '' });
    });
    return out;
  }
  function gruppeVon(el) {
    return el.closest('[data-lightbox]');
  }

  function openFrom(imEl) {
    var g = gruppeVon(imEl);
    if (!g) return;
    var liste = listeVon(g);
    var id = idOf(imEl.getAttribute('src') || imEl.src);
    var i = 0;
    for (var k = 0; k < liste.length; k++) if (liste[k].id === id) { i = k; break; }
    open(liste, i);
  }

  function init() {
    mount();

    /* Klick auf ein Bild einer markierten Gruppe öffnet den Player.
       Seiten mit eigener Drag-Logik (Home-Marquee) rufen openFrom() selbst auf
       und setzen dafür `data-lightbox-manual` auf den Container. */
    [].forEach.call(document.querySelectorAll('[data-lightbox]'), function (g) {
      if (g.hasAttribute('data-lightbox-manual')) return;
      g.style.cursor = 'pointer';
      g.addEventListener('click', function (e) {
        var im = e.target.closest('img');
        if (im && g.contains(im)) openFrom(im);
      });
    });

    paintBadges();
    var s = L();
    if (s) {
      s.subscribe(function (id) { paintBadges(id || null); syncLike(); });
      s.refresh();
    }
  }

  window.TFCZ = window.TFCZ || {};
  TFCZ.lightbox = { open: open, openFrom: openFrom, close: close, paintBadges: paintBadges };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
