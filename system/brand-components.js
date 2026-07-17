/* ============================================================================
   TFCZ · BRAND-KOMPONENTEN — DIE EINE QUELLE
   ----------------------------------------------------------------------------
   Hier steht jede wiederverwendbare Komponente der Marke genau EINMAL:
   Markup, erlaubte Varianten, editierbare Felder und die Regel, wann sie gilt.

   Wer liest diese Datei?
     • Das Design Studio  — bietet die Komponenten zum Einfügen an (Figma-artig)
       und baut daraus den Inspector (welche Felder editierbar sind).
     • Der Brand Guide    — rendert seine Beispiele daraus, statt sie nachzubauen.
   Damit können die beiden nicht auseinanderlaufen. Ändert man hier eine Zeile,
   ändert sie sich im Studio UND im Brand Guide.

   Regeln, die im Code durchgesetzt werden (CLAUDE.md §9):
     • GOLD nur für echte Conversion oder qualifizierte Lead-Anfrage.
       Navigation ist NIE gold — auch wenn sie einladend klingt.
     • Pfeil-CTAs tragen IMMER denselben Lucide-Pfeil und dieselbe Animation.
     • Kicker gibt es nur in EINER Form: Goldstrich + Uppercase-Gold.
   ========================================================================== */
(function (root) {
  'use strict';

  var LU = {"arrow-right": "<path d=\"M5 12h14\" /> <path d=\"m12 5 7 7-7 7\" />","arrow-left": "<path d=\"m12 19-7-7 7-7\" /> <path d=\"M19 12H5\" />","external-link": "<path d=\"M15 3h6v6\" /> <path d=\"M10 14 21 3\" /> <path d=\"M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6\" />","calendar": "<path d=\"M8 2v4\" /> <path d=\"M16 2v4\" /> <rect width=\"18\" height=\"18\" x=\"3\" y=\"4\" rx=\"2\" /> <path d=\"M3 10h18\" />","clock": "<circle cx=\"12\" cy=\"12\" r=\"10\" /> <path d=\"M12 6v6l4 2\" />","map-pin": "<path d=\"M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0\" /> <circle cx=\"12\" cy=\"10\" r=\"3\" />","mail": "<path d=\"m22 7-8.991 5.727a2 2 0 0 1-2.009 0L2 7\" /> <rect x=\"2\" y=\"4\" width=\"20\" height=\"16\" rx=\"2\" />","phone": "<path d=\"M13.832 16.568a1 1 0 0 0 1.213-.303l.355-.465A2 2 0 0 1 17 15h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2A18 18 0 0 1 2 4a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v3a2 2 0 0 1-.8 1.6l-.468.351a1 1 0 0 0-.292 1.233 14 14 0 0 0 6.392 6.384\" />","at-sign": "<circle cx=\"12\" cy=\"12\" r=\"4\" /> <path d=\"M16 8v5a3 3 0 0 0 6 0v-1a10 10 0 1 0-4 8\" />","trophy": "<path d=\"M10 14.66v1.626a2 2 0 0 1-.976 1.696A5 5 0 0 0 7 21.978\" /> <path d=\"M14 14.66v1.626a2 2 0 0 0 .976 1.696A5 5 0 0 1 17 21.978\" /> <path d=\"M18 9h1.5a1 1 0 0 0 0-5H18\" /> <path d=\"M4 22h16\" /> <path d=\"M6 9a6 6 0 0 0 12 0V3a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1z\" /> <path d=\"M6 9H4.5a1 1 0 0 1 0-5H6\" />","medal": "<path d=\"M7.21 15 2.66 7.14a2 2 0 0 1 .13-2.2L4.4 2.8A2 2 0 0 1 6 2h12a2 2 0 0 1 1.6.8l1.6 2.14a2 2 0 0 1 .14 2.2L16.79 15\" /> <path d=\"M11 12 5.12 2.2\" /> <path d=\"m13 12 5.88-9.8\" /> <path d=\"M8 7h8\" /> <circle cx=\"12\" cy=\"17\" r=\"5\" /> <path d=\"M12 18v-2h-.5\" />","dices": "<rect width=\"12\" height=\"12\" x=\"2\" y=\"10\" rx=\"2\" ry=\"2\" /> <path d=\"m17.92 14 3.5-3.5a2.24 2.24 0 0 0 0-3l-5-4.92a2.24 2.24 0 0 0-3 0L10 6\" /> <path d=\"M6 18h.01\" /> <path d=\"M10 14h.01\" /> <path d=\"M15 6h.01\" /> <path d=\"M18 9h.01\" />","party-popper": "<path d=\"M5.8 11.3 2 22l10.7-3.79\" /> <path d=\"M4 3h.01\" /> <path d=\"M22 8h.01\" /> <path d=\"M15 2h.01\" /> <path d=\"M22 20h.01\" /> <path d=\"m22 2-2.24.75a2.9 2.9 0 0 0-1.96 3.12c.1.86-.57 1.63-1.45 1.63h-.38c-.86 0-1.6.6-1.76 1.44L14 10\" /> <path d=\"m22 13-.82-.33c-.86-.34-1.82.2-1.98 1.11c-.11.7-.72 1.22-1.43 1.22H17\" /> <path d=\"m11 2 .33.82c.34.86-.2 1.82-1.11 1.98C9.52 4.9 9 5.52 9 6.23V7\" /> <path d=\"M11 13c1.93 1.93 2.83 4.17 2 5-.83.83-3.07-.07-5-2-1.93-1.93-2.83-4.17-2-5 .83-.83 3.07.07 5 2Z\" />","utensils": "<path d=\"M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2\" /> <path d=\"M7 2v20\" /> <path d=\"M21 15V2a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7\" />","users": "<path d=\"M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2\" /> <path d=\"M16 3.128a4 4 0 0 1 0 7.744\" /> <path d=\"M22 21v-2a4 4 0 0 0-3-3.87\" /> <circle cx=\"9\" cy=\"7\" r=\"4\" />","user-round": "<circle cx=\"12\" cy=\"8\" r=\"5\" /> <path d=\"M20 21a8 8 0 0 0-16 0\" />","star": "<path d=\"M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z\" />","heart": "<path d=\"M2 9.5a5.5 5.5 0 0 1 9.591-3.676.56.56 0 0 0 .818 0A5.49 5.49 0 0 1 22 9.5c0 2.29-1.5 4-3 5.5l-5.492 5.313a2 2 0 0 1-3 .019L5 15c-1.5-1.5-3-3.2-3-5.5\" />","check": "<path d=\"M20 6 9 17l-5-5\" />","x": "<path d=\"M18 6 6 18\" /> <path d=\"m6 6 12 12\" />","info": "<circle cx=\"12\" cy=\"12\" r=\"10\" /> <path d=\"M12 16v-4\" /> <path d=\"M12 8h.01\" />","circle-help": "<circle cx=\"12\" cy=\"12\" r=\"10\" /> <path d=\"M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3\" /> <path d=\"M12 17h.01\" />","ticket": "<path d=\"M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z\" /> <path d=\"M13 5v2\" /> <path d=\"M13 17v2\" /> <path d=\"M13 11v2\" />","banknote": "<rect width=\"20\" height=\"12\" x=\"2\" y=\"6\" rx=\"2\" /> <circle cx=\"12\" cy=\"12\" r=\"2\" /> <path d=\"M6 12h.01M18 12h.01\" />","badge-swiss-franc": "<path d=\"M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z\" /> <path d=\"M11 17V8h4\" /> <path d=\"M11 12h3\" /> <path d=\"M9 16h4\" />","credit-card": "<rect width=\"20\" height=\"14\" x=\"2\" y=\"5\" rx=\"2\" /> <line x1=\"2\" x2=\"22\" y1=\"10\" y2=\"10\" />","gift": "<path d=\"M12 7v14\" /> <path d=\"M20 11v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-8\" /> <path d=\"M7.5 7a1 1 0 0 1 0-5A4.8 8 0 0 1 12 7a4.8 8 0 0 1 4.5-5 1 1 0 0 1 0 5\" /> <rect x=\"3\" y=\"7\" width=\"18\" height=\"4\" rx=\"1\" />","megaphone": "<path d=\"M11 6a13 13 0 0 0 8.4-2.8A1 1 0 0 1 21 4v12a1 1 0 0 1-1.6.8A13 13 0 0 0 11 14H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2z\" /> <path d=\"M6 14a12 12 0 0 0 2.4 7.2 2 2 0 0 0 3.2-2.4A8 8 0 0 1 10 14\" /> <path d=\"M8 6v8\" />","bell": "<path d=\"M10.268 21a2 2 0 0 0 3.464 0\" /> <path d=\"M3.262 15.326A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.673C19.41 13.956 18 12.499 18 8A6 6 0 0 0 6 8c0 4.499-1.411 5.956-2.738 7.326\" />","flame": "<path d=\"M12 3q1 4 4 6.5t3 5.5a1 1 0 0 1-14 0 5 5 0 0 1 1-3 1 1 0 0 0 5 0c0-2-1.5-3-1.5-5q0-2 2.5-4\" />","zap": "<path d=\"M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z\" />","target": "<circle cx=\"12\" cy=\"12\" r=\"10\" /> <circle cx=\"12\" cy=\"12\" r=\"6\" /> <circle cx=\"12\" cy=\"12\" r=\"2\" />","swords": "<polyline points=\"14.5 17.5 3 6 3 3 6 3 17.5 14.5\" /> <line x1=\"13\" x2=\"19\" y1=\"19\" y2=\"13\" /> <line x1=\"16\" x2=\"20\" y1=\"16\" y2=\"20\" /> <line x1=\"19\" x2=\"21\" y1=\"21\" y2=\"19\" /> <polyline points=\"14.5 6.5 18 3 21 3 21 6 17.5 9.5\" /> <line x1=\"5\" x2=\"9\" y1=\"14\" y2=\"18\" /> <line x1=\"7\" x2=\"4\" y1=\"17\" y2=\"20\" /> <line x1=\"3\" x2=\"5\" y1=\"19\" y2=\"21\" />","flag": "<path d=\"M4 22V4a1 1 0 0 1 .4-.8A6 6 0 0 1 8 2c3 0 5 2 7.333 2q2 0 3.067-.8A1 1 0 0 1 20 4v10a1 1 0 0 1-.4.8A6 6 0 0 1 16 16c-3 0-5-2-8-2a6 6 0 0 0-4 1.528\" />","globe": "<circle cx=\"12\" cy=\"12\" r=\"10\" /> <path d=\"M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20\" /> <path d=\"M2 12h20\" />","music": "<path d=\"M9 18V5l12-2v13\" /> <circle cx=\"6\" cy=\"18\" r=\"3\" /> <circle cx=\"18\" cy=\"16\" r=\"3\" />","camera": "<path d=\"M13.997 4a2 2 0 0 1 1.76 1.05l.486.9A2 2 0 0 0 18.003 7H20a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h1.997a2 2 0 0 0 1.759-1.048l.489-.904A2 2 0 0 1 10.004 4z\" /> <circle cx=\"12\" cy=\"13\" r=\"3\" />","image": "<rect width=\"18\" height=\"18\" x=\"3\" y=\"3\" rx=\"2\" ry=\"2\" /> <circle cx=\"9\" cy=\"9\" r=\"2\" /> <path d=\"m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21\" />","video": "<path d=\"m16 13 5.223 3.482a.5.5 0 0 0 .777-.416V7.87a.5.5 0 0 0-.752-.432L16 10.5\" /> <rect x=\"2\" y=\"6\" width=\"14\" height=\"12\" rx=\"2\" />","play": "<path d=\"M5 5a2 2 0 0 1 3.008-1.728l11.997 6.998a2 2 0 0 1 .003 3.458l-12 7A2 2 0 0 1 5 19z\" />","download": "<path d=\"M12 15V3\" /> <path d=\"M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4\" /> <path d=\"m7 10 5 5 5-5\" />","share-2": "<circle cx=\"18\" cy=\"5\" r=\"3\" /> <circle cx=\"6\" cy=\"12\" r=\"3\" /> <circle cx=\"18\" cy=\"19\" r=\"3\" /> <line x1=\"8.59\" x2=\"15.42\" y1=\"13.51\" y2=\"17.49\" /> <line x1=\"15.41\" x2=\"8.59\" y1=\"6.51\" y2=\"10.49\" />","link": "<path d=\"M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71\" /> <path d=\"M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71\" />","lock": "<rect width=\"18\" height=\"11\" x=\"3\" y=\"11\" rx=\"2\" ry=\"2\" /> <path d=\"M7 11V7a5 5 0 0 1 10 0v4\" />","key-round": "<path d=\"M2.586 17.414A2 2 0 0 0 2 18.828V21a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h1a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h.172a2 2 0 0 0 1.414-.586l.814-.814a6.5 6.5 0 1 0-4-4z\" /> <circle cx=\"16.5\" cy=\"7.5\" r=\".5\" fill=\"currentColor\" />","house": "<path d=\"M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8\" /> <path d=\"M3 10a2 2 0 0 1 .709-1.528l7-6a2 2 0 0 1 2.582 0l7 6A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z\" />","building-2": "<path d=\"M10 12h4\" /> <path d=\"M10 8h4\" /> <path d=\"M14 21v-3a2 2 0 0 0-4 0v3\" /> <path d=\"M6 10H4a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-2\" /> <path d=\"M6 21V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v16\" />","car": "<path d=\"M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2\" /> <circle cx=\"7\" cy=\"17\" r=\"2\" /> <path d=\"M9 17h6\" /> <circle cx=\"17\" cy=\"17\" r=\"2\" />","train-front": "<path d=\"M8 3.1V7a4 4 0 0 0 8 0V3.1\" /> <path d=\"m9 15-1-1\" /> <path d=\"m15 15 1-1\" /> <path d=\"M9 19c-2.8 0-5-2.2-5-5v-4a8 8 0 0 1 16 0v4c0 2.8-2.2 5-5 5Z\" /> <path d=\"m8 19-2 3\" /> <path d=\"m16 19 2 3\" />","beer": "<path d=\"M17 11h1a3 3 0 0 1 0 6h-1\" /> <path d=\"M9 12v6\" /> <path d=\"M13 12v6\" /> <path d=\"M14 7.5c-1 0-1.44.5-3 .5s-2-.5-3-.5-1.72.5-2.5.5a2.5 2.5 0 0 1 0-5c.78 0 1.57.5 2.5.5S9.44 2 11 2s2 1.5 3 1.5 1.72-.5 2.5-.5a2.5 2.5 0 0 1 0 5c-.78 0-1.5-.5-2.5-.5Z\" /> <path d=\"M5 8v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V8\" />","coffee": "<path d=\"M10 2v2\" /> <path d=\"M14 2v2\" /> <path d=\"M16 8a1 1 0 0 1 1 1v8a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V9a1 1 0 0 1 1-1h14a4 4 0 1 1 0 8h-1\" /> <path d=\"M6 2v2\" />","wine": "<path d=\"M8 22h8\" /> <path d=\"M7 10h10\" /> <path d=\"M12 15v7\" /> <path d=\"M12 15a5 5 0 0 0 5-5c0-2-.5-4-2-8H9c-1.5 4-2 6-2 8a5 5 0 0 0 5 5Z\" />","pizza": "<path d=\"m12 14-1 1\" /> <path d=\"m13.75 18.25-1.25 1.42\" /> <path d=\"M17.775 5.654a15.68 15.68 0 0 0-12.121 12.12\" /> <path d=\"M18.8 9.3a1 1 0 0 0 2.1 7.7\" /> <path d=\"M21.964 20.732a1 1 0 0 1-1.232 1.232l-18-5a1 1 0 0 1-.695-1.232A19.68 19.68 0 0 1 15.732 2.037a1 1 0 0 1 1.232.695z\" />","cake": "<path d=\"M20 21v-8a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8\" /> <path d=\"M4 16s.5-1 2-1 2.5 2 4 2 2.5-2 4-2 2.5 2 4 2 2-1 2-1\" /> <path d=\"M2 21h20\" /> <path d=\"M7 8v3\" /> <path d=\"M12 8v3\" /> <path d=\"M17 8v3\" /> <path d=\"M7 4h.01\" /> <path d=\"M12 4h.01\" /> <path d=\"M17 4h.01\" />","sparkles": "<path d=\"M11.017 2.814a1 1 0 0 1 1.966 0l1.051 5.558a2 2 0 0 0 1.594 1.594l5.558 1.051a1 1 0 0 1 0 1.966l-5.558 1.051a2 2 0 0 0-1.594 1.594l-1.051 5.558a1 1 0 0 1-1.966 0l-1.051-5.558a2 2 0 0 0-1.594-1.594l-5.558-1.051a1 1 0 0 1 0-1.966l5.558-1.051a2 2 0 0 0 1.594-1.594z\" /> <path d=\"M20 2v4\" /> <path d=\"M22 4h-4\" /> <circle cx=\"4\" cy=\"20\" r=\"2\" />","crown": "<path d=\"M11.562 3.266a.5.5 0 0 1 .876 0L15.39 8.87a1 1 0 0 0 1.516.294L21.183 5.5a.5.5 0 0 1 .798.519l-2.834 10.246a1 1 0 0 1-.956.734H5.81a1 1 0 0 1-.957-.734L2.02 6.02a.5.5 0 0 1 .798-.519l4.276 3.664a1 1 0 0 0 1.516-.294z\" /> <path d=\"M5 21h14\" />","thumbs-up": "<path d=\"M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2a3.13 3.13 0 0 1 3 3.88Z\" /> <path d=\"M7 10v12\" />","hand-heart": "<path d=\"M11 14h2a2 2 0 0 0 0-4h-3c-.6 0-1.1.2-1.4.6L3 16\" /> <path d=\"m14.45 13.39 5.05-4.694C20.196 8 21 6.85 21 5.75a2.75 2.75 0 0 0-4.797-1.837.276.276 0 0 1-.406 0A2.75 2.75 0 0 0 11 5.75c0 1.2.802 2.248 1.5 2.946L16 11.95\" /> <path d=\"m2 15 6 6\" /> <path d=\"m7 20 1.6-1.4c.3-.4.8-.6 1.4-.6h4c1.1 0 2.1-.4 2.8-1.2l4.6-4.4a1 1 0 0 0-2.75-2.91\" />","handshake": "<path d=\"m11 17 2 2a1 1 0 1 0 3-3\" /> <path d=\"m14 14 2.5 2.5a1 1 0 1 0 3-3l-3.88-3.88a3 3 0 0 0-4.24 0l-.88.88a1 1 0 1 1-3-3l2.81-2.81a5.79 5.79 0 0 1 7.06-.87l.47.28a2 2 0 0 0 1.42.25L21 4\" /> <path d=\"m21 3 1 11h-2\" /> <path d=\"M3 3 2 14l6.5 6.5a1 1 0 1 0 3-3\" /> <path d=\"M3 4h8\" />","graduation-cap": "<path d=\"M21.42 10.922a1 1 0 0 0-.019-1.838L12.83 5.18a2 2 0 0 0-1.66 0L2.6 9.08a1 1 0 0 0 0 1.832l8.57 3.908a2 2 0 0 0 1.66 0z\" /> <path d=\"M22 10v6\" /> <path d=\"M6 12.5V16a6 3 0 0 0 12 0v-3.5\" />","book-open": "<path d=\"M12 7v14\" /> <path d=\"M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z\" />","monitor": "<rect width=\"20\" height=\"14\" x=\"2\" y=\"3\" rx=\"2\" /> <line x1=\"8\" x2=\"16\" y1=\"21\" y2=\"21\" /> <line x1=\"12\" x2=\"12\" y1=\"17\" y2=\"21\" />","wifi": "<path d=\"M12 20h.01\" /> <path d=\"M2 8.82a15 15 0 0 1 20 0\" /> <path d=\"M5 12.859a10 10 0 0 1 14 0\" /> <path d=\"M8.5 16.429a5 5 0 0 1 7 0\" />","shield": "<path d=\"M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z\" />","instagram": "<rect x=\"2\" y=\"2\" width=\"20\" height=\"20\" rx=\"5\" ry=\"5\"/><path d=\"M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z\"/><line x1=\"17.5\" y1=\"6.5\" x2=\"17.51\" y2=\"6.5\"/>","youtube": "<path d=\"M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17\"/><path d=\"m10 15 5-3-5-3z\"/>"};
  function icon(name, sz) {
    if (!LU[name]) return '';
    return '<svg class="tfcz-ic" viewBox="0 0 24 24" width="' + (sz || 17) + '" height="' + (sz || 17) +
      '" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + LU[name] + '</svg>';
  }
  function esc(s) {
    return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }


  /* ==========================================================================
     TEXT-STILE — die Typo-Skala des Brand Guides, maschinenlesbar.
     Das Studio bietet sie beim Bearbeiten JEDES Textes als Auswahl an:
     „Diese Zeile ist ein H2" — und Grösse, Gewicht, Farbe, Laufweite kommen
     aus dem Brand Guide, nicht aus dem Bauchgefühl.
     Werte in px @1080 Breite; sie skalieren mit dem Format mit.
     ========================================================================== */
  /* Grössen in px @1080 Breite. Bewusst moderat gehalten: ein Text, den der Nutzer per „H1"
     markiert, soll eine brauchbare Überschrift werden — nicht den halben Flyer füllen.
     Feinjustage danach über die Grösse (−/+ in der Kontext-Leiste). */
  var TEXTSTYLES = {
    h1:      { name: 'H1 · Titel',         size: 54, weight: 900, ls: -0.02,  up: true,  color: 'weiss', italic: true },
    h2:      { name: 'H2 · Überschrift',   size: 38, weight: 900, ls: -0.015, up: true,  color: 'weiss' },
    h3:      { name: 'H3 · Zwischentitel', size: 26, weight: 900, ls: -0.01,  up: true,  color: 'weiss' },
    kicker:  { name: 'Kicker (Gold)',      size: 16, weight: 900, ls: 0.18,   up: true,  color: 'gold-lt' },
    lead:    { name: 'Lead / Intro',       size: 20, weight: 700, ls: 0,      up: false, color: 'ink-mut' },
    body:    { name: 'Fliesstext',         size: 16, weight: 500, ls: 0,      up: false, color: 'ink-mut' },
    small:   { name: 'Klein / Fusszeile',  size: 13, weight: 700, ls: 0.045,  up: true,  color: 'ink-mut' },
    stat:    { name: 'Zahl / Statistik',   size: 60, weight: 900, ls: -0.03,  up: false, color: 'gold-lt', italic: true },
    quote:   { name: 'Zitat',              size: 24, weight: 700, ls: 0,      up: false, color: 'weiss', italic: true }
  };
  var FARBEN = { weiss: '#ffffff', navy: '#0d273d', gold: '#cda857', 'gold-lt': '#e9c475',
                 blau: '#5ca7dc', 'blau-dk': '#005a94', ink: '#eef4fa', 'ink-mut': '#c3d2e0', sand: '#e6e3da' };
  function textCss(st, k, farbe) {
    k = k || 1; var t = TEXTSTYLES[st] || TEXTSTYLES.body;
    return 'font-size:' + Math.round(t.size * k) + 'px;font-weight:' + t.weight + ';letter-spacing:' + t.ls + 'em;' +
      (t.up ? 'text-transform:uppercase;' : '') + (t.italic ? 'font-style:italic;' : '') +
      'color:' + (FARBEN[farbe || t.color] || '#fff') + ';line-height:1.12;';
  }

  /* --- Kanonische Ziele. Wer „Mitglied werden" einfügt, landet IMMER hier. --- */
  var ZIELE = {
    'mitglied-werden': { href: 'mitglied.html', text: 'Mitglied werden', stil: 'gold' },
    'erster-abend-gratis': { href: 'mitglied.html', text: 'Erster Abend gratis', stil: 'gold' },
    'training': { href: 'tfcz-training.html', text: 'Training mit Philipp', stil: 'blau' },
    'firmenevent': { href: 'tfcz-firmenevents.html', text: 'Verfügbarkeit prüfen', stil: 'gold' },
    'kalender': { href: 'index.html#woche', text: 'Komm vorbei', stil: 'ghost' },
    'regeln': { href: 'tfcz-regeln.html', text: 'Alle Regeln', stil: 'ghost' },
    'ueber-uns': { href: 'tfcz-ueber-uns.html', text: 'Über uns', stil: 'ghost' },
    'website': { href: 'https://tfcz.ch', text: 'tfcz.ch', stil: 'ghost' },
    'instagram': { href: 'https://instagram.com/tischfussballclubzuerich', text: '@tischfussballclubzuerich', stil: 'ghost' },
    'youtube': { href: 'https://youtube.com/@tischfussballclubzuerich', text: 'Auf YouTube ansehen', stil: 'ghost' },
    'medien': { href: 'tfcz-medien.html', text: 'Medien & Presse', stil: 'ghost' },
    'geschichte': { href: 'tfcz-geschichte.html', text: 'Unsere Geschichte', stil: 'ghost' },
    'anmelden-turnier': { href: 'https://app.tablesoccer.org', text: 'Zum Turnier anmelden', stil: 'gold' },
    'mail': { href: 'mailto:info@tfcz.ch', text: 'info@tfcz.ch', stil: 'ghost' },
    'route': { href: 'https://maps.apple.com/?q=Landenbergstrasse+10,+8037+Z%C3%BCrich', text: 'Route öffnen', stil: 'ghost' },
    'schnuppern': { href: 'mitglied.html#pakete', text: 'Erster Abend gratis', stil: 'gold' }
  };

  /* --- Button-Stile. Gold ist knapp — der Code sagt es, nicht nur die Doku. --- */
  var BTN = {
    gold: { bg: '#cda857', color: '#0d273d', border: '0', shadow: '0 8px 24px rgba(205,168,87,.34)',
            zweck: 'NUR echte Conversion (Mitglied werden) oder qualifizierte Lead-Anfrage.' },
    blau: { bg: 'linear-gradient(180deg,#5ca7dc,#4489c7)', color: '#fff', border: '0', shadow: '0 8px 22px rgba(68,137,199,.28)',
            zweck: 'Normale Primär-Aktion: absenden, öffnen, erstellen.' },
    ghost: { bg: 'rgba(255,255,255,.07)', color: '#fff', border: '1.5px solid rgba(255,255,255,.28)', shadow: 'none',
             zweck: 'Sekundär / Navigation / „mehr erfahren".' }
  };

  var COMPONENTS = {

    /* ---------------- CTA-Button ---------------- */
    cta: {
      name: 'CTA-Button',
      kategorie: 'Aktionen',
      hint: 'Gold nur für Conversion. Navigation ist ghost.',
      felder: [
        { k: 'ziel', label: 'Ziel', typ: 'select', opts: Object.keys(ZIELE) },
        { k: 'text', label: 'Beschriftung', typ: 'text' },
        { k: 'href', label: 'Link (URL)', typ: 'text' },
        { k: 'stil', label: 'Stil', typ: 'select', opts: ['gold', 'blau', 'ghost'] },
        { k: 'pfeil', label: 'Pfeil', typ: 'bool' },
        { k: 'size', label: 'Grösse (px)', typ: 'zahl' }
      ],
      defaults: function () { var z = ZIELE['mitglied-werden']; return { ziel: 'mitglied-werden', text: z.text, href: z.href, stil: z.stil, pfeil: true, size: 26 }; },
      /* Wechselt der Nutzer das Ziel, ziehen Text/Link/Stil automatisch nach — die Registry gewinnt. */
      onZiel: function (p, ziel) { var z = ZIELE[ziel]; if (!z) return p; p.ziel = ziel; p.text = z.text; p.href = z.href; p.stil = z.stil; return p; },
      warn: function (p) {
        var z = ZIELE[p.ziel];
        if (p.stil === 'gold' && z && z.stil !== 'gold') return 'Gold ist der Conversion vorbehalten — „' + z.text + '" ist Navigation. Bitte Ghost oder Blau.';
        return null;
      },
      render: function (p, k) {
        k = k || 1; var st = BTN[p.stil] || BTN.ghost, fs = Math.round((p.size || 26) * k);
        return '<a class="tfcz-cta" href="' + esc(p.href) + '" style="display:inline-flex;align-items:center;gap:' + (0.45 * fs) + 'px;' +
          'font-weight:900;font-size:' + fs + 'px;text-transform:uppercase;letter-spacing:.01em;text-decoration:none;' +
          'padding:' + (0.62 * fs) + 'px ' + (1.05 * fs) + 'px;border-radius:' + (0.46 * fs) + 'px;white-space:nowrap;' +
          'background:' + st.bg + ';color:' + st.color + ';border:' + st.border + ';box-shadow:' + st.shadow + '">' +
          esc(p.text) + (p.pfeil ? icon('arrow-right', Math.round(fs * 0.86)) : '') + '</a>';
      }
    },


    /* ---------------- Freies Textfeld mit Brand-Stil ---------------- */
    text: {
      name: 'Textfeld',
      kategorie: 'Typografie',
      hint: 'Der Stil kommt aus der Typo-Skala des Brand Guides — nicht frei erfunden.',
      felder: [
        { k: 'text', label: 'Text', typ: 'text' },
        { k: 'stil', label: 'Text-Stil', typ: 'select', opts: Object.keys(TEXTSTYLES) },
        { k: 'farbe', label: 'Farbe', typ: 'select', opts: Object.keys(FARBEN) },
        { k: 'align', label: 'Ausrichtung', typ: 'select', opts: ['left', 'center', 'right'] },
        { k: 'w', label: 'Breite (px, 0 = auto)', typ: 'zahl' }
      ],
      defaults: function () { return { text: 'Neuer Text', stil: 'body', farbe: '', align: 'left', w: 0 }; },
      render: function (p, k) {
        k = k || 1;
        return '<div style="' + textCss(p.stil, k, p.farbe) + 'text-align:' + (p.align || 'left') + ';' +
          (p.w ? 'width:' + Math.round(p.w * k) + 'px;' : 'white-space:nowrap;') + '">' + esc(p.text) + '</div>';
      }
    },

    /* ---------------- Header-Block (Kicker + H1 + Lead) ---------------- */
    header: {
      name: 'Header-Block',
      kategorie: 'Typografie',
      hint: 'Aufbau ist verbindlich: Kicker → H1 → Lead. Immer in dieser Reihenfolge.',
      felder: [
        { k: 'kicker', label: 'Kicker', typ: 'text' },
        { k: 'titel', label: 'Headline (H1)', typ: 'text' },
        { k: 'akzent', label: 'Akzent-Wort (gold)', typ: 'text' },
        { k: 'lead', label: 'Lead-Text', typ: 'text' },
        { k: 'align', label: 'Ausrichtung', typ: 'select', opts: ['left', 'center'] },
        { k: 'w', label: 'Breite (px)', typ: 'zahl' }
      ],
      defaults: function () { return { kicker: 'Jeden Mittwoch', titel: 'Crazy', akzent: 'DYP', lead: 'Dein Partner wird jede Runde neu ausgelost.', align: 'left', w: 760 }; },
      render: function (p, k) {
        k = k || 1; var c = p.align === 'center';
        return '<div style="width:' + Math.round((p.w || 760) * k) + 'px;text-align:' + (c ? 'center' : 'left') + ';display:flex;flex-direction:column;' +
          'align-items:' + (c ? 'center' : 'flex-start') + ';gap:' + Math.round(14 * k) + 'px">' +
          (p.kicker ? COMPONENTS.kicker.render({ text: p.kicker, size: 20 }, k) : '') +
          '<div style="' + textCss('h1', k) + '">' + esc(p.titel) +
            (p.akzent ? ' <span style="color:#e9c475">' + esc(p.akzent) + '</span>' : '') + '</div>' +
          (p.lead ? '<div style="' + textCss('lead', k) + 'line-height:1.35">' + esc(p.lead) + '</div>' : '') +
          '</div>';
      }
    },

    /* ---------------- Icon ---------------- */
    icon: {
      name: 'Icon (Lucide)',
      kategorie: 'Icons',
      hint: 'Nur Lucide. Ein semantischer Zweck = ein Icon, überall dasselbe. Nie Emojis.',
      felder: [
        { k: 'icon', label: 'Icon', typ: 'select', opts: Object.keys(LU).sort() },
        { k: 'farbe', label: 'Farbe', typ: 'select', opts: Object.keys(FARBEN) },
        { k: 'size', label: 'Grösse (px)', typ: 'zahl' }
      ],
      defaults: function () { return { icon: 'trophy', farbe: 'gold-lt', size: 64 }; },
      render: function (p, k) {
        k = k || 1;
        return '<span style="display:inline-flex;color:' + (FARBEN[p.farbe] || '#e9c475') + '">' + icon(p.icon, Math.round((p.size || 64) * k)) + '</span>';
      }
    },

    /* ---------------- Fakten-Liste mit Icons ---------------- */
    liste: {
      name: 'Fakten-Liste',
      kategorie: 'Daten & Listen',
      hint: 'Eine Zeile pro Fakt — Format: icon | Text',
      felder: [
        { k: 'zeilen', label: 'Zeilen (icon | Text)', typ: 'mehrzeilig' },
        { k: 'size', label: 'Grösse (px)', typ: 'zahl' }
      ],
      defaults: function () { return { zeilen: 'calendar | Jeden Mittwoch\nclock | Türöffnung 19:00 · Start 20:15\nmap-pin | Landenbergstrasse 10, Zürich\nbanknote | Preistopf CHF 5000.–', size: 24 }; },
      render: function (p, k) {
        k = k || 1; var fs = Math.round((p.size || 24) * k);
        var rows = String(p.zeilen || '').split('\n').filter(Boolean).map(function (l) {
          var q = l.split('|'), ic = (q[0] || '').trim(), tx = (q.slice(1).join('|') || '').trim();
          return '<div style="display:flex;align-items:center;gap:' + (0.5 * fs) + 'px;font-size:' + fs + 'px;font-weight:700;color:#eef4fa;white-space:nowrap">' +
            '<span style="color:#e9c475;display:inline-flex;flex:none">' + icon(ic, Math.round(fs * 1.05)) + '</span>' + esc(tx) + '</div>';
        }).join('');
        return '<div style="display:flex;flex-direction:column;gap:' + (0.45 * fs) + 'px">' + rows + '</div>';
      }
    },

    /* ---------------- Formular-Block ---------------- */
    formular: {
      name: 'Formular',
      kategorie: 'Formulare',
      hint: 'Absender ist der KUNDE. Schlusssätze nie aus Vereinssicht formulieren.',
      felder: [
        { k: 'titel', label: 'Titel', typ: 'text' },
        { k: 'sub', label: 'Untertitel', typ: 'text' },
        { k: 'felder', label: 'Felder (ein Label pro Zeile)', typ: 'mehrzeilig' },
        { k: 'cta', label: 'Button-Text', typ: 'text' },
        { k: 'stil', label: 'Button-Stil', typ: 'select', opts: ['gold', 'blau', 'ghost'] },
        { k: 'w', label: 'Breite (px)', typ: 'zahl' },
        { k: 'size', label: 'Grösse (px)', typ: 'zahl' }
      ],
      defaults: function () { return { titel: 'Jetzt anmelden', sub: 'Wir melden uns innert 2 Tagen zurück.', felder: 'Name\nE-Mail\nNachricht', cta: 'Absenden', stil: 'blau', w: 560, size: 22 }; },
      render: function (p, k) {
        k = k || 1; var fs = Math.round((p.size || 22) * k), w = Math.round((p.w || 560) * k);
        var inputs = String(p.felder || '').split('\n').filter(Boolean).map(function (lab) {
          return '<div style="margin-top:' + (0.5 * fs) + 'px">' +
            '<div style="font-size:' + Math.round(fs * 0.62) + 'px;font-weight:900;letter-spacing:.1em;text-transform:uppercase;color:#e9c475;margin-bottom:' + (0.22 * fs) + 'px">' + esc(lab) + '</div>' +
            '<div style="height:' + (2.0 * fs) + 'px;border-radius:8px;background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.16)"></div></div>';
        }).join('');
        return '<div style="width:' + w + 'px;background:linear-gradient(155deg,rgba(17,34,51,.74),rgba(9,21,33,.60));' +
          'border:1px solid rgba(255,255,255,.13);border-top:3px solid #5ca7dc;border-bottom:3px solid #cda857;' +
          'border-radius:22px;padding:' + (1.1 * fs) + 'px ' + (1.2 * fs) + 'px;box-shadow:0 16px 40px rgba(0,0,0,.42)">' +
          '<div style="' + textCss('h3', k * 0.62) + '">' + esc(p.titel) + '</div>' +
          (p.sub ? '<div style="margin-top:' + (0.25 * fs) + 'px;font-size:' + Math.round(fs * 0.68) + 'px;color:#c3d2e0">' + esc(p.sub) + '</div>' : '') +
          inputs +
          '<div style="margin-top:' + (0.9 * fs) + 'px">' + COMPONENTS.cta.render({ text: p.cta, href: '#', stil: p.stil, pfeil: false, size: (p.size || 22) * 0.95 }, k) + '</div>' +
          '</div>';
      }
    },

    /* ---------------- Eingabefeld (einzeln) ---------------- */
    input: {
      name: 'Eingabefeld',
      kategorie: 'Formulare',
      hint: 'Fokus-Rahmen ist Gold — nie Browser-Blau.',
      felder: [
        { k: 'label', label: 'Label', typ: 'text' },
        { k: 'ph', label: 'Platzhalter', typ: 'text' },
        { k: 'pflicht', label: 'Pflichtfeld', typ: 'bool' },
        { k: 'w', label: 'Breite (px)', typ: 'zahl' },
        { k: 'size', label: 'Grösse (px)', typ: 'zahl' }
      ],
      defaults: function () { return { label: 'E-Mail', ph: 'name@beispiel.ch', pflicht: true, w: 420, size: 22 }; },
      render: function (p, k) {
        k = k || 1; var fs = Math.round((p.size || 22) * k);
        return '<div style="width:' + Math.round((p.w || 420) * k) + 'px">' +
          '<div style="font-size:' + Math.round(fs * 0.62) + 'px;font-weight:900;letter-spacing:.1em;text-transform:uppercase;color:#e9c475;margin-bottom:' + (0.25 * fs) + 'px">' +
          esc(p.label) + (p.pflicht ? ' <span style="color:#da2929">*</span>' : '') + '</div>' +
          '<div style="height:' + (2.1 * fs) + 'px;display:flex;align-items:center;padding:0 ' + (0.6 * fs) + 'px;border-radius:8px;' +
          'background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.16);font-size:' + Math.round(fs * 0.75) + 'px;color:#8fa3b6">' +
          esc(p.ph) + '</div></div>';
      }
    },

    /* ---------------- Paket-Karte ---------------- */
    paket: {
      name: 'Paket-Karte',
      kategorie: 'Flächen',
      hint: 'Preis, Leistungen, ein CTA. Gold nur, wenn es die Beitritts-Aktion ist.',
      felder: [
        { k: 'titel', label: 'Paket', typ: 'text' },
        { k: 'preis', label: 'Preis', typ: 'text' },
        { k: 'zeilen', label: 'Leistungen (eine pro Zeile)', typ: 'mehrzeilig' },
        { k: 'cta', label: 'Button-Text', typ: 'text' },
        { k: 'stil', label: 'Button-Stil', typ: 'select', opts: ['gold', 'blau', 'ghost'] },
        { k: 'w', label: 'Breite (px)', typ: 'zahl' },
        { k: 'size', label: 'Grösse (px)', typ: 'zahl' }
      ],
      defaults: function () { return { titel: 'Aktivmitglied', preis: 'CHF 200 / Jahr', zeilen: 'Unbegrenzt spielen\nAlle Turniere\nTraining inklusive', cta: 'Mitglied werden', stil: 'gold', w: 420, size: 22 }; },
      render: function (p, k) {
        k = k || 1; var fs = Math.round((p.size || 22) * k);
        var rows = String(p.zeilen || '').split('\n').filter(Boolean).map(function (l) {
          return '<div style="display:flex;align-items:center;gap:' + (0.4 * fs) + 'px;font-size:' + Math.round(fs * 0.78) + 'px;color:#c3d2e0;margin-top:' + (0.3 * fs) + 'px">' +
            '<span style="color:#5ca7dc;display:inline-flex;flex:none">' + icon('check', Math.round(fs * 0.82)) + '</span>' + esc(l) + '</div>';
        }).join('');
        return '<div style="width:' + Math.round((p.w || 420) * k) + 'px;background:linear-gradient(155deg,rgba(17,34,51,.74),rgba(9,21,33,.60));' +
          'border:1px solid rgba(255,255,255,.13);border-top:3px solid #5ca7dc;border-bottom:3px solid #cda857;border-radius:16px;' +
          'padding:' + (1.1 * fs) + 'px;box-shadow:0 8px 22px rgba(0,0,0,.32)">' +
          '<div style="font-weight:900;font-size:' + fs + 'px;color:#fff;text-transform:uppercase">' + esc(p.titel) + '</div>' +
          '<div style="margin-top:' + (0.3 * fs) + 'px;font-weight:900;font-size:' + Math.round(fs * 1.5) + 'px;color:#e9c475">' + esc(p.preis) + '</div>' +
          rows +
          '<div style="margin-top:' + (0.9 * fs) + 'px">' + COMPONENTS.cta.render({ text: p.cta, href: 'mitglied.html', stil: p.stil, pfeil: true, size: (p.size || 22) * 0.9 }, k) + '</div>' +
          '</div>';
      }
    },

    /* ---------------- Tabelle ---------------- */
    tabelle: {
      name: 'Tabelle',
      kategorie: 'Daten & Listen',
      hint: 'Standard-Tabelle: Kopf gold-uppercase, erste Spalte weiss.',
      felder: [
        { k: 'zeilen', label: 'Zeilen (Zellen mit | trennen; erste Zeile = Kopf)', typ: 'mehrzeilig' },
        { k: 'w', label: 'Breite (px)', typ: 'zahl' },
        { k: 'size', label: 'Grösse (px)', typ: 'zahl' }
      ],
      defaults: function () { return { zeilen: 'Runde | Zeit | Modus\n1 | 20:15 | Doppel\n2 | 21:00 | Doppel\nFinal | 22:30 | Best of 3', w: 620, size: 20 }; },
      render: function (p, k) {
        k = k || 1; var fs = Math.round((p.size || 20) * k);
        var rows = String(p.zeilen || '').split('\n').filter(Boolean);
        var html = rows.map(function (r, i) {
          var cells = r.split('|').map(function (c) { return c.trim(); });
          return '<tr>' + cells.map(function (c, j) {
            if (i === 0) return '<th style="text-align:left;padding:' + (0.4 * fs) + 'px ' + (0.6 * fs) + 'px;font-size:' + Math.round(fs * 0.72) + 'px;font-weight:900;letter-spacing:.1em;text-transform:uppercase;color:#e9c475;border-bottom:1px solid rgba(255,255,255,.16)">' + esc(c) + '</th>';
            return '<td style="padding:' + (0.4 * fs) + 'px ' + (0.6 * fs) + 'px;font-size:' + fs + 'px;color:' + (j === 0 ? '#fff;font-weight:800' : '#c3d2e0') + ';border-bottom:1px solid rgba(255,255,255,.08)">' + esc(c) + '</td>';
          }).join('') + '</tr>';
        }).join('');
        return '<table style="width:' + Math.round((p.w || 620) * k) + 'px;border-collapse:collapse">' + html + '</table>';
      }
    },

    /* ---------------- Zahl / Statistik ---------------- */
    stat: {
      name: 'Zahl + Label',
      kategorie: 'Daten & Listen',
      hint: 'Für Belege: 100+ Mitglieder, seit 1990, 10 Leonhart-Tische.',
      felder: [
        { k: 'zahl', label: 'Zahl', typ: 'text' },
        { k: 'label', label: 'Label', typ: 'text' },
        { k: 'size', label: 'Grösse (px)', typ: 'zahl' }
      ],
      defaults: function () { return { zahl: '100+', label: 'Mitglieder', size: 88 }; },
      render: function (p, k) {
        k = k || 1; var fs = Math.round((p.size || 88) * k);
        return '<div style="text-align:center">' +
          '<div style="' + textCss('stat', 1) + 'font-size:' + fs + 'px">' + esc(p.zahl) + '</div>' +
          '<div style="' + textCss('small', k) + 'margin-top:' + (0.06 * fs) + 'px">' + esc(p.label) + '</div></div>';
      }
    },

    /* ---------------- Zitat ---------------- */
    zitat: {
      name: 'Zitat',
      kategorie: 'Typografie',
      hint: 'Echte Stimmen statt Marketing-Sprache.',
      felder: [
        { k: 'text', label: 'Zitat', typ: 'text' },
        { k: 'wer', label: 'Wer', typ: 'text' },
        { k: 'w', label: 'Breite (px)', typ: 'zahl' },
        { k: 'size', label: 'Grösse (px)', typ: 'zahl' }
      ],
      defaults: function () { return { text: 'Ich kam allein rein und ging mit fünf neuen Kollegen raus.', wer: 'Nico, seit 2024 dabei', w: 640, size: 30 }; },
      render: function (p, k) {
        k = k || 1; var fs = Math.round((p.size || 30) * k);
        return '<div style="width:' + Math.round((p.w || 640) * k) + 'px;border-left:' + Math.max(3, 0.1 * fs) + 'px solid #cda857;padding-left:' + (0.7 * fs) + 'px">' +
          '<div style="' + textCss('quote', 1) + 'font-size:' + fs + 'px;line-height:1.3">„' + esc(p.text) + '"</div>' +
          '<div style="' + textCss('small', k) + 'margin-top:' + (0.35 * fs) + 'px">' + esc(p.wer) + '</div></div>';
      }
    },

    /* ---------------- Kicker-Signature ---------------- */
    kicker: {
      name: 'Kicker (Goldstrich)',
      kategorie: 'Typografie',
      hint: 'Der EINE Kicker. Keine zweite Variante — kein Pill-Badge, kein nackter Text.',
      felder: [{ k: 'text', label: 'Text', typ: 'text' }, { k: 'size', label: 'Grösse (px)', typ: 'zahl' }],
      defaults: function () { return { text: 'Jeden Mittwoch', size: 20 }; },
      render: function (p, k) {
        k = k || 1; var fs = Math.round((p.size || 20) * k);
        return '<span style="display:inline-flex;align-items:center;gap:' + (0.5 * fs) + 'px;font-size:' + fs + 'px;font-weight:900;' +
          'letter-spacing:.18em;text-transform:uppercase;color:#e9c475;white-space:nowrap">' +
          '<span style="width:' + (1.4 * fs) + 'px;height:' + Math.max(2, 0.1 * fs) + 'px;background:#cda857;flex:none;border-radius:2px"></span>' +
          esc(p.text) + '</span>';
      }
    },

    /* ---------------- Kategorie-Badge ---------------- */
    badge: {
      name: 'Kategorie-Badge',
      kategorie: 'Status',
      hint: 'Fun = helles Blau · Pro = DarkNavy-Blau · Elite = Gold nur als Akzent.',
      felder: [
        { k: 'text', label: 'Text', typ: 'text' },
        { k: 'kat', label: 'Kategorie', typ: 'select', opts: ['fun', 'pro', 'elite'] },
        { k: 'size', label: 'Grösse (px)', typ: 'zahl' }
      ],
      defaults: function () { return { text: 'Fun', kat: 'fun', size: 20 }; },
      render: function (p, k) {
        k = k || 1; var fs = Math.round((p.size || 20) * k);
        var K = { fun: { bg: 'rgba(92,167,220,.18)', bd: '#5ca7dc', c: '#cfe6f8' },
                  pro: { bg: 'rgba(0,90,148,.28)', bd: '#005a94', c: '#d6e7f4' },
                  elite: { bg: 'rgba(205,168,87,.14)', bd: '#cda857', c: '#e9c475' } }[p.kat] || {};
        return '<span style="display:inline-block;font-size:' + fs + 'px;font-weight:900;text-transform:uppercase;letter-spacing:.1em;' +
          'padding:' + (0.4 * fs) + 'px ' + (0.8 * fs) + 'px;border-radius:999px;white-space:nowrap;' +
          'background:' + K.bg + ';border:' + Math.max(1, 0.06 * fs) + 'px solid ' + K.bd + ';color:' + K.c + '">' + esc(p.text) + '</span>';
      }
    },

    /* ---------------- Card mit Fenster-Signatur ---------------- */
    card: {
      name: 'Card (Fenster-Signatur)',
      kategorie: 'Flächen',
      hint: 'Blau oben / Gold unten am abgerundeten Container. Fläche immer dunkel & frosted.',
      felder: [
        { k: 'titel', label: 'Titel', typ: 'text' },
        { k: 'text', label: 'Text', typ: 'text' },
        { k: 'w', label: 'Breite (px)', typ: 'zahl' },
        { k: 'size', label: 'Grösse (px)', typ: 'zahl' }
      ],
      defaults: function () { return { titel: 'Komm allein', text: 'Kein Partner nötig — Teams werden jede Runde neu ausgelost.', w: 460, size: 22 }; },
      render: function (p, k) {
        k = k || 1; var fs = Math.round((p.size || 22) * k), w = Math.round((p.w || 460) * k);
        return '<div style="width:' + w + 'px;background:linear-gradient(155deg,rgba(17,34,51,.74),rgba(9,21,33,.60));' +
          'border:1px solid rgba(255,255,255,.13);border-top:3px solid #5ca7dc;border-bottom:3px solid #cda857;' +
          'border-radius:16px;padding:' + (0.9 * fs) + 'px ' + (1.1 * fs) + 'px;box-shadow:0 8px 22px rgba(0,0,0,.32)">' +
          '<div style="font-weight:900;font-size:' + fs + 'px;color:#fff;text-transform:uppercase;line-height:1.1">' + esc(p.titel) + '</div>' +
          '<div style="margin-top:' + (0.35 * fs) + 'px;font-weight:600;font-size:' + Math.round(fs * 0.72) + 'px;color:#c3d2e0;line-height:1.35">' + esc(p.text) + '</div>' +
          '</div>';
      }
    },

    /* ---------------- Info-Zeile mit Lucide-Icon ---------------- */
    info: {
      name: 'Info-Zeile (Icon + Text)',
      kategorie: 'Status',
      hint: 'Icons sind IMMER Lucide — nie Emojis.',
      felder: [
        { k: 'icon', label: 'Icon', typ: 'select', opts: ['calendar', 'map-pin', 'mail', 'external-link'] },
        { k: 'text', label: 'Text', typ: 'text' },
        { k: 'size', label: 'Grösse (px)', typ: 'zahl' }
      ],
      defaults: function () { return { icon: 'map-pin', text: 'Landenbergstrasse 10, 8037 Zürich', size: 24 }; },
      render: function (p, k) {
        k = k || 1; var fs = Math.round((p.size || 24) * k);
        return '<span style="display:inline-flex;align-items:center;gap:' + (0.45 * fs) + 'px;font-size:' + fs + 'px;font-weight:800;color:#eef4fa;white-space:nowrap">' +
          icon(p.icon, Math.round(fs * 1.05)) + esc(p.text) + '</span>';
      }
    },

    /* ---------------- Brand-Linie ---------------- */
    brandline: {
      name: 'Brand-Linie (blau / gold)',
      kategorie: 'Flächen',
      hint: 'Blau oben, Gold unten — im Print/Social harter Schnitt, nie gemischt.',
      felder: [
        { k: 'farbe', label: 'Farbe', typ: 'select', opts: ['blau', 'gold'] },
        { k: 'w', label: 'Breite (px)', typ: 'zahl' },
        { k: 'h', label: 'Dicke (px)', typ: 'zahl' }
      ],
      defaults: function () { return { farbe: 'gold', w: 300, h: 4 }; },
      render: function (p, k) {
        k = k || 1;
        return '<div style="width:' + Math.round((p.w || 300) * k) + 'px;height:' + Math.max(2, Math.round((p.h || 4) * k)) + 'px;' +
          'background:' + (p.farbe === 'blau' ? '#5ca7dc' : '#cda857') + ';border-radius:2px"></div>';
      }
    },

    /* ---------------- Bild (frei platzierbar) ---------------- */
    foto: {
      name: 'Bild',
      kategorie: 'Formen',
      hint: 'Freies Bild. Doppelklick / „Ersetzen" wählt aus Action & Atmosphäre.',
      felder: [
        { k: 'src', label: 'Bild-URL', typ: 'text' },
        { k: 'w', label: 'Breite (px)', typ: 'zahl' },
        { k: 'h', label: 'Höhe (px)', typ: 'zahl' },
        { k: 'radius', label: 'Radius (px)', typ: 'zahl' }
      ],
      defaults: function () { return { src: '', w: 360, h: 260, radius: 12 }; },
      render: function (p, k) {
        k = k || 1; var w = Math.round((p.w || 360) * k), h = Math.round((p.h || 260) * k), r = Math.round((p.radius || 12) * k);
        if (p.src) return '<img src="' + esc(p.src) + '" style="width:' + w + 'px;height:' + h + 'px;object-fit:cover;border-radius:' + r + 'px;display:block">';
        return '<div style="width:' + w + 'px;height:' + h + 'px;border-radius:' + r + 'px;display:flex;align-items:center;justify-content:center;' +
          'background:rgba(255,255,255,.05);border:2px dashed rgba(205,168,87,.6);color:rgba(233,196,117,.8);font-weight:800;font-size:' + Math.round(15 * k) + 'px">' +
          icon('image', Math.round(30 * k)) + '</div>';
      }
    },

    /* ---------------- Rechteck / Box ---------------- */
    rect: {
      name: 'Rechteck',
      kategorie: 'Formen',
      hint: 'Fläche für Kästen, Banner, Hintergründe. Frosted oder gefüllt.',
      felder: [
        { k: 'fuellung', label: 'Füllung', typ: 'select', opts: ['frosted', 'navy', 'blau', 'gold', 'weiss', 'transparent'] },
        { k: 'radius', label: 'Radius (px)', typ: 'zahl' },
        { k: 'rahmen', label: 'Rahmen', typ: 'bool' },
        { k: 'signatur', label: 'Fenster-Signatur', typ: 'bool' },
        { k: 'w', label: 'Breite (px)', typ: 'zahl' },
        { k: 'h', label: 'Höhe (px)', typ: 'zahl' }
      ],
      defaults: function () { return { fuellung: 'frosted', radius: 16, rahmen: true, signatur: false, w: 460, h: 260 }; },
      render: function (p, k) {
        k = k || 1;
        var FILL = { frosted: 'linear-gradient(155deg,rgba(17,34,51,.74),rgba(9,21,33,.60))', navy: '#0d273d',
                     blau: '#5ca7dc', gold: '#cda857', weiss: '#ffffff', transparent: 'transparent' }[p.fuellung] || 'transparent';
        var sig = p.signatur ? 'border-top:3px solid #5ca7dc;border-bottom:3px solid #cda857;' : '';
        var brd = p.rahmen && !p.signatur ? 'border:1px solid rgba(255,255,255,.13);' : '';
        return '<div style="width:' + Math.round((p.w || 460) * k) + 'px;height:' + Math.round((p.h || 260) * k) + 'px;' +
          'background:' + FILL + ';border-radius:' + Math.round((p.radius || 16) * k) + 'px;' + brd + sig +
          (p.fuellung === 'frosted' ? 'backdrop-filter:blur(10px);' : '') + '"></div>';
      }
    },

    /* ---------------- Kreis / Ellipse ---------------- */
    circle: {
      name: 'Kreis',
      kategorie: 'Formen',
      hint: 'Für Foto-Rahmen, Badges, Aufzähl-Punkte.',
      felder: [
        { k: 'fuellung', label: 'Füllung', typ: 'select', opts: ['gold', 'blau', 'navy', 'frosted', 'transparent'] },
        { k: 'rahmen', label: 'Rahmen', typ: 'select', opts: ['keiner', 'gold', 'blau', 'weiss'] },
        { k: 'd', label: 'Durchmesser (px)', typ: 'zahl' }
      ],
      defaults: function () { return { fuellung: 'frosted', rahmen: 'gold', d: 180 }; },
      render: function (p, k) {
        k = k || 1; var d = Math.round((p.d || 180) * k);
        var FILL = { gold: '#cda857', blau: '#5ca7dc', navy: '#0d273d',
                     frosted: 'radial-gradient(circle at 40% 35%,#005a94,#0d273d)', transparent: 'transparent' }[p.fuellung] || 'transparent';
        var BRD = { keiner: '0', gold: Math.max(2, 0.018 * d) + 'px solid #cda857', blau: Math.max(2, 0.018 * d) + 'px solid #5ca7dc', weiss: Math.max(2, 0.018 * d) + 'px solid #fff' }[p.rahmen] || '0';
        return '<div style="width:' + d + 'px;height:' + d + 'px;border-radius:50%;background:' + FILL + ';border:' + BRD + '"></div>';
      }
    },

    /* ---------------- Linie ---------------- */
    line: {
      name: 'Linie',
      kategorie: 'Formen',
      hint: 'Trenner. Voll, verlaufend oder gepunktet.',
      felder: [
        { k: 'stil', label: 'Stil', typ: 'select', opts: ['voll', 'verlauf', 'gepunktet'] },
        { k: 'farbe', label: 'Farbe', typ: 'select', opts: ['gold', 'blau', 'weiss'] },
        { k: 'w', label: 'Länge (px)', typ: 'zahl' },
        { k: 'h', label: 'Dicke (px)', typ: 'zahl' }
      ],
      defaults: function () { return { stil: 'verlauf', farbe: 'gold', w: 360, h: 3 }; },
      render: function (p, k) {
        k = k || 1; var C = { gold: '#cda857', blau: '#5ca7dc', weiss: '#ffffff' }[p.farbe] || '#cda857';
        var w = Math.round((p.w || 360) * k), h = Math.max(2, Math.round((p.h || 3) * k)), bg;
        if (p.stil === 'verlauf') bg = 'background:linear-gradient(90deg,transparent,' + C + ',transparent)';
        else if (p.stil === 'gepunktet') bg = 'background:repeating-linear-gradient(90deg,' + C + ' 0 ' + (2 * h) + 'px,transparent ' + (2 * h) + 'px ' + (4 * h) + 'px)';
        else bg = 'background:' + C;
        return '<div style="width:' + w + 'px;height:' + h + 'px;border-radius:2px;' + bg + '"></div>';
      }
    },

    /* ---------------- Pfeil ---------------- */
    arrow: {
      name: 'Pfeil',
      kategorie: 'Formen',
      hint: 'Immer der Lucide-Pfeil — nie ein Text-Glyph.',
      felder: [
        { k: 'richtung', label: 'Richtung', typ: 'select', opts: ['rechts', 'links'] },
        { k: 'farbe', label: 'Farbe', typ: 'select', opts: ['gold-lt', 'gold', 'blau', 'weiss'] },
        { k: 'size', label: 'Grösse (px)', typ: 'zahl' }
      ],
      defaults: function () { return { richtung: 'rechts', farbe: 'gold-lt', size: 48 }; },
      render: function (p, k) {
        k = k || 1;
        return '<span style="display:inline-flex;color:' + (FARBEN[p.farbe] || '#e9c475') + '">' +
          icon(p.richtung === 'links' ? 'arrow-left' : 'arrow-right', Math.round((p.size || 48) * k)) + '</span>';
      }
    },

    /* ---------------- Dreieck ---------------- */
    dreieck: {
      name: 'Dreieck',
      kategorie: 'Formen',
      hint: 'Dreieck-Fläche. Richtung & Farbe frei wählbar.',
      felder: [
        { k: 'fuellung', label: 'Füllung', typ: 'select', opts: ['gold', 'blau', 'navy', 'weiss'] },
        { k: 'richtung', label: 'Richtung', typ: 'select', opts: ['oben', 'unten', 'links', 'rechts'] },
        { k: 'w', label: 'Breite (px)', typ: 'zahl' },
        { k: 'h', label: 'Höhe (px)', typ: 'zahl' }
      ],
      defaults: function () { return { fuellung: 'gold', richtung: 'oben', w: 200, h: 170 }; },
      render: function (p, k) {
        k = k || 1; var w = Math.round((p.w || 200) * k), h = Math.round((p.h || 170) * k);
        var C = { gold: '#cda857', blau: '#5ca7dc', navy: '#0d273d', weiss: '#ffffff' }[p.fuellung] || '#cda857';
        var pts = { oben: '50,0 100,100 0,100', unten: '0,0 100,0 50,100', links: '100,0 100,100 0,50', rechts: '0,0 0,100 100,50' }[p.richtung] || '50,0 100,100 0,100';
        var svg = '<svg xmlns="http://www.w3.org/2000/svg" width="' + w + '" height="' + h + '" viewBox="0 0 100 100" preserveAspectRatio="none"><polygon points="' + pts + '" fill="' + C + '"/></svg>';
        return '<img src="data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg) + '" style="width:' + w + 'px;height:' + h + 'px;display:block">';
      }
    },

    /* ---------------- Brand-Rahmen (oben blau / unten gold) ---------------- */
    brandframe: {
      name: 'Brand-Rahmen (o/u)',
      kategorie: 'Flächen',
      hint: 'Blaue Linie oben, goldene unten — nur die Linien, Fläche transparent. Auf Formatbreite ziehen.',
      felder: [
        { k: 'w', label: 'Breite (px)', typ: 'zahl' },
        { k: 'h', label: 'Höhe (px)', typ: 'zahl' },
        { k: 'dicke', label: 'Linienstärke (px)', typ: 'zahl' }
      ],
      defaults: function () { return { w: 1000, h: 560, dicke: 5 }; },
      render: function (p, k) {
        k = k || 1; var w = Math.round((p.w || 1000) * k), h = Math.round((p.h || 560) * k), d = Math.max(2, Math.round((p.dicke || 5) * k));
        return '<div style="position:relative;width:' + w + 'px;height:' + h + 'px;pointer-events:none">' +
          '<div style="position:absolute;top:0;left:0;right:0;height:' + d + 'px;background:#5ca7dc"></div>' +
          '<div style="position:absolute;bottom:0;left:0;right:0;height:' + d + 'px;background:#cda857"></div>' +
          '</div>';
      }
    }
  };

  root.TFCZ_COMPONENTS = { list: COMPONENTS, ziele: ZIELE, btn: BTN, icon: icon, textstyles: TEXTSTYLES, farben: FARBEN, textCss: textCss };
})(typeof window !== 'undefined' ? window : this);
