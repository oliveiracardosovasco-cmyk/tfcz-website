/* ============================================================
   TFCZ · LIKE-STORE — die EINE Quelle für Foto-Likes.

   Ein Like hängt an der stabilen BILD-ID (= Dateiname ohne Endung, z. B.
   "action-07"). Dadurch:
     · zählt dasselbe Bild auf jeder Seite auf denselben Zähler
       (Home und Training teilen sich die Likes)
     · kann derselbe Nutzer ein Bild nur EINMAL liken (nochmal klicken = Unlike)

   Einbinden (nach system/content.js):
       <script src="system/likes.js"></script>

   API:
     TFCZ.likes.liked(id)      -> true/false   (habe ICH das Bild geliked)
     TFCZ.likes.count(id)      -> Zahl         (Likes insgesamt)
     TFCZ.likes.toggle(id)     -> true/false   (neuer Zustand; speichert + meldet)
     TFCZ.likes.subscribe(fn)  -> fn(id) bei jeder Änderung (auch aus anderen Tabs)
     TFCZ.likes.refresh()      -> holt die Zähler vom Server (falls TFCZ_API gesetzt)

   ── Speicher ────────────────────────────────────────────────
   Ohne Backend: localStorage
       tfcz_gal_liked  {bildId:true}   — meine Likes auf DIESEM Gerät
       tfcz_gal_counts {bildId:zahl}   — Zähler
   Andere Tabs werden über das `storage`-Event mitgezogen.

   ── Backend (vorbereitet, greift sobald window.TFCZ_API gesetzt ist) ──
       GET  {API}/api/likes                 -> {bildId: count}
       POST {API}/api/likes/<bildId>        Body {delta, liked, user} -> {count}
            (Server erzwingt: 1 Like je (user, bild))
       GET  {API}/api/likes/mine?user=<id>  -> {bildId: true}   (Geräte-Sync)
   Ist window.TFCZ_USER gesetzt, folgt der Like-Status dem Profil statt dem Gerät.
   ============================================================ */
window.TFCZ = window.TFCZ || {};

TFCZ.likes = (function () {
  var K_MINE = 'tfcz_gal_liked', K_CNT = 'tfcz_gal_counts';

  function load(key) {
    try { return JSON.parse(localStorage.getItem(key) || '{}') || {}; }
    catch (e) { return {}; }
  }
  function save(key, obj) {
    try { localStorage.setItem(key, JSON.stringify(obj)); } catch (e) {}
  }

  var MINE = load(K_MINE);
  var COUNTS = load(K_CNT);
  var subs = [];

  function api() { return String(window.TFCZ_API || '').replace(/\/+$/, ''); }
  function user() { var u = window.TFCZ_USER; return (u && (u.id || u)) || null; }

  function melde(id) {
    subs.forEach(function (fn) { try { fn(id); } catch (e) {} });
  }

  function liked(id) { return !!MINE[id]; }
  function count(id) { return COUNTS[id] | 0; }

  function toggle(id) {
    var war = !!MINE[id];
    var delta = war ? -1 : 1;

    if (war) delete MINE[id]; else MINE[id] = true;
    COUNTS[id] = Math.max(0, count(id) + delta);
    save(K_MINE, MINE); save(K_CNT, COUNTS);
    melde(id);

    var A = api();
    if (A) {
      try {
        fetch(A + '/api/likes/' + encodeURIComponent(id), {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ delta: delta, liked: !war, user: user() })
        })
        .then(function (r) { return r.ok ? r.json() : null; })
        .then(function (d) {
          if (d && typeof d.count === 'number') {
            COUNTS[id] = d.count; save(K_CNT, COUNTS); melde(id);
          }
        })
        .catch(function () {});
      } catch (e) {}
    }
    return !war;
  }

  function refresh() {
    var A = api();
    if (!A) return;
    try {
      fetch(A + '/api/likes')
        .then(function (r) { return r.ok ? r.json() : null; })
        .then(function (d) {
          if (!d) return;
          COUNTS = d; save(K_CNT, COUNTS); melde(null);
        }).catch(function () {});

      var u = user();
      if (u) {
        fetch(A + '/api/likes/mine?user=' + encodeURIComponent(u))
          .then(function (r) { return r.ok ? r.json() : null; })
          .then(function (d) {
            if (!d) return;
            MINE = d; save(K_MINE, MINE); melde(null);
          }).catch(function () {});
      }
    } catch (e) {}
  }

  /* Andere Tabs / Fenster: Zustand übernehmen */
  addEventListener('storage', function (e) {
    if (e.key === K_MINE) { MINE = load(K_MINE); melde(null); }
    if (e.key === K_CNT)  { COUNTS = load(K_CNT); melde(null); }
  });

  return {
    liked: liked,
    count: count,
    toggle: toggle,
    refresh: refresh,
    subscribe: function (fn) { if (typeof fn === 'function') subs.push(fn); }
  };
})();
