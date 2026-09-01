# -*- coding: utf-8 -*-
"""Baut die Fassung C. Quelle: tfcz-training.html. Ziel: Datei aus sys.argv[2].
   Mit --vorschau wird zusaetzlich die Fassung fest verdrahtet (fuer den lokalen Blick)."""
import io, re, sys

ziel = sys.argv[1]
vorschau = '--vorschau' in sys.argv
s = io.open('tfcz-training.html', encoding='utf-8').read()

def one(alt, neu, name):
    global s
    assert s.count(alt) == 1, name + ' -> ' + str(s.count(alt))
    s = s.replace(alt, neu)

def many(alt, neu, name, erwartet):
    global s
    assert s.count(alt) == erwartet, name + ' -> ' + str(s.count(alt))
    s = s.replace(alt, neu)

# ---------------------------------------------------------------- 1 · CSS
# Gold ist auf dieser Seite die Farbe der Einladung («Platz sichern»).
# «Ausgebucht» ist das Gegenteil und darf nicht dieselbe Farbe tragen.
# Bewusste Seiten-Ausnahme zu system/tokens.css, darum hier und mit Begruendung.
one('.pg-note b{color:#fff}',
'''.pg-note b{color:#fff}
/* ---- Fassung „laufend": ausgebucht wird ROT gezeigt, nicht in Gold.
   Gold heisst auf dieser Seite «komm dazu» (Platz sichern, Gratis für Mitglieder);
   «voll» ist das Gegenteil und braucht darum eine eigene Farbe. Bewusste
   Seiten-Ausnahme zu system/tokens.css. ---- */
.urg.voll{border-color:rgba(218,41,41,.55); background:rgba(41,11,13,.55)}
.urg.voll .dot{background:#ff6b6b; box-shadow:0 0 0 0 rgba(218,41,41,.6)}
.urg.voll b{color:#ff9090}
.pg-chip.voll{color:#ff9a9a; border-color:rgba(218,41,41,.45); background:rgba(58,14,16,.42)}
.pg-chip.voll svg{color:#ff9090}
.pg-chip.voll b{color:#ffd9d9}
.pg-voll{display:flex; align-items:center; gap:10px; margin:0 0 12px; padding:11px 15px; border-radius:var(--r-md); border:1px solid rgba(218,41,41,.42); background:rgba(58,14,16,.35); font-size:13px; line-height:1.5; color:var(--ink-mut)}
.pg-voll svg{width:17px; height:17px; flex:none; color:#ff9090}
.pg-voll b{color:#ff9a9a; font-weight:900; letter-spacing:.03em}
.pg-note.voll svg{color:#ff9090}
/* «Trainer offen» ist laenger als das frühere «offen»: das Datum soll ganz
   bleiben, das Etikett darf auf die zweite Zeile rutschen. */
.pg-day.prov{flex-wrap:wrap}
.pg-day.prov .pg-dt{white-space:nowrap}
.pg-day.prov .pg-tag{margin-left:41px}''', 'css')

# ---------------------------------------------------------------- 2 · Hero
one('      <div class="urg" data-var="laufend" data-aos="fade-up" data-aos-delay="170"><span class="dot"></span><span><b>Das Semester läuft</b> — die Anmeldung ist geschlossen</span></div>',
    '      <div class="urg voll" data-var="laufend" data-aos="fade-up" data-aos-delay="170"><span class="dot"></span><span><b>Ausgebucht</b> — 34 dabei · Liste fürs nächste Semester ist offen</span></div>', 'urg')

one('      <p class="sub" data-var="laufend" data-aos="fade-up" data-aos-delay="200">14 Einheiten Technik, mit der du in Wochen sichtbar besser wirst — für Einsteiger wie für ambitionierte Spieler. Das laufende Semester ist gestartet, das nächste kommt.</p>',
    '      <p class="sub" data-var="laufend" data-aos="fade-up" data-aos-delay="200">14 Einheiten Technik, mit der du in Wochen sichtbar besser wirst. Das Herbstsemester ist mit <b>34 Angemeldeten</b> gestartet und voll — für das nächste kannst du dich schon auf die Liste setzen.</p>', 'sub')

one('<a class="btn btn-ghost" href="#voranmelden"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 16v-4M12 8h.01"/></svg>Nächstes Semester</a>',
    '<a class="btn btn-ghost" href="#voranmelden"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>Auf die Liste</a>', 'hero-cta')

one('      <a class="lnk" data-var="laufend" href="#voranmelden">Nächstes Semester</a>',
    '      <a class="lnk" data-var="laufend" href="#voranmelden">Auf die Liste</a>', 'nav')

# ---------------------------------------------------------------- 3 · Termine
CHIP = ('Gratis für Mitglieder</span>\n'
        '          <span class="pg-chip voll" data-var="laufend"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">'
        '<circle cx="12" cy="12" r="9"/><path d="M15 9l-6 6M9 9l6 6"/></svg><b>Ausgebucht</b>&nbsp;· 34 angemeldet</span>')
many('Gratis für Mitglieder</span>', CHIP, 'chip', 2)

BANNER = ('        <div class="pg-voll" data-var="laufend"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">'
          '<circle cx="12" cy="12" r="9"/><path d="M15 9l-6 6M9 9l6 6"/></svg>'
          '<span><b>ALLE TERMINE AUSGEBUCHT</b> — beide Gruppen sind voll, das Semester läuft bereits.</span></div>\n')
many('      <div class="pg-months">', BANNER.replace('        <div', '      <div') + '      <div class="pg-months">', 'banner-di', 1)
many('        <div class="pg-months" data-mirror-di>', BANNER + '        <div class="pg-months" data-mirror-di>', 'banner-mi', 1)

# Der Mittwoch-Hinweis spricht von «bei der Anmeldung» — gilt nur in der Anmelde-Fassung.
ALT_NOTE = '<div class="pg-note"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg><span>Der <b>Dienstag</b> ist der Haupttag, die <b>Mittwoch-Gruppe</b> läuft parallel — je max. 20 Plätze. Wer nur am Mittwoch kann, meldet sich trotzdem an; gib bei der Anmeldung einfach deine Wunsch-Option an.</span></div>'
NEU_NOTE = (ALT_NOTE.replace('<div class="pg-note">', '<div class="pg-note" data-var="anmeldung">') +
'''
      <div class="pg-note voll" data-var="laufend"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg><span>Der <b>Dienstag</b> ist der Haupttag, die <b>Mittwoch-Gruppe</b> läuft parallel — je max. 20 Plätze. Beide sind für dieses Semester <b>voll</b>; die Termine stehen hier, damit du siehst, wie ein Semester abläuft.</span></div>''')
one(ALT_NOTE, NEU_NOTE, 'note')

one('        <a class="btn btn-gold" data-var="anmeldung" data-cta="training-anmelden" href="#voranmelden"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>Platz sichern</a>',
'''        <a class="btn btn-gold" data-var="anmeldung" data-cta="training-anmelden" href="#voranmelden"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>Platz sichern</a>
        <a class="btn btn-ghost" data-var="laufend" href="#voranmelden"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>Auf die Liste fürs nächste Semester</a>''', 'cta')

# «offen» hiess bisher «Trainer noch nicht fix». Neben «ausgebucht» liest es sich
# als «noch Plätze frei» — darum benennen wir das Etikett, statt es zu verstecken.
many('<span class="pg-tag">offen</span>', '<span class="pg-tag">Trainer offen</span>', 'tag', 2)

# ---------------------------------------------------------------- 4 · Abschnitt unten
ABSCHNITT = re.compile(r'    <!-- Fassung „laufend": Semester ist gestartet, es wird nicht mehr angemeldet -->.*?(?=\n    <div class="formbox" data-var="anmeldung")', re.S)
NEU = '''    <!-- Fassung „laufend": Semester läuft und ist voll — es wird Interesse gesammelt, NICHT angemeldet -->
    <div class="lbl" data-var="laufend" data-aos="fade-up">Liste fürs nächste Semester</div>
    <h2 class="h2" data-var="laufend" data-aos="fade-up">Steh auf der <span class="g">Liste</span>, wenn es losgeht</h2>
    <p class="intro" data-var="laufend" data-aos="fade-up">Das Herbstsemester ist mit 34 Anmeldungen voll und läuft bereits. So geht es weiter:</p>
    <div class="pg-note" data-var="laufend" data-aos="fade-up"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 8v5l3 2"/></svg><span><b>1 · Du trägst dich ein.</b> Nur Name und E-Mail — mehr braucht es jetzt nicht.</span></div>
    <div class="pg-note" data-var="laufend" data-aos="fade-up"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/></svg><span><b>2 · Wir melden uns mit den Infos</b>, sobald Daten, Tage und Plätze stehen.</span></div>
    <div class="pg-note" data-var="laufend" data-aos="fade-up"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6L9 17l-5-5"/></svg><span><b>3 · Dann erst kommt die Anmeldung.</b> Wer auf der Liste steht, erfährt es zuerst.</span></div>
    <div class="pg-note voll" data-var="laufend" data-aos="fade-up"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 16v-4M12 8h.01"/></svg><span><b>Das ist keine Anmeldung.</b> Du sagst uns nur, dass dich das nächste Semester interessiert — die Daten und die richtige Anmeldung folgen später hier auf der Seite.</span></div>
    <div class="formbox" data-var="laufend" data-aos="fade-up" style="margin-top:22px">
      <h2>Auf die Liste setzen</h2>
      <div class="fsub">Das kostet nichts und verpflichtet zu nichts — es sorgt nur dafür, dass du die Infos zuerst bekommst.</div>
      <form id="trIntForm" data-tfcz="form" data-form="training-interesse" novalidate>
        <div class="fgrid"></div>
        <div class="fnote"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/></svg><span>Beim Senden öffnet sich dein Mailprogramm mit Empfänger, Betreff und Text — alles schon ausgefüllt.</span></div>
        <div class="btnrow">
          <button class="btn btn-gold" type="submit"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round"><path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/></svg>Auf die Liste setzen</button>
          <span class="formerr">Bitte fülle die markierten Pflichtfelder aus.</span>
        </div>
      </form>
    </div>
'''
assert len(ABSCHNITT.findall(s)) == 1
s = ABSCHNITT.sub(lambda m: NEU, s)

# ---------------------------------------------------------------- 5 · nur Vorschau
if vorschau:
    s = s.replace('<html lang="de" data-variante-standard="anmeldung">',
                  '<html lang="de" data-variante-standard="anmeldung" data-variante="laufend">', 1)
    s = s.replace('<style id="tfcz-var-fallback">',
                  '<style id="tfcz-vorschau">[data-var]:not([data-var~="laufend"]){display:none !important}</style>\n<style id="tfcz-var-fallback">', 1)
    s = s.replace('<script src="system/seiten.js"></script>',
                  '<!-- seiten.js in der Vorschau weggelassen: es wuerde die Fassung ueberschreiben -->', 1)
    s = s.replace('<script defer src="system/cta.js"></script>',
                  '<script defer src="_vorschau-forms.js"></script>\n<script defer src="system/cta.js"></script>', 1)

io.open(ziel, 'w', encoding='utf-8').write(s)
print('geschrieben:', ziel, len(s), 'Zeichen')
