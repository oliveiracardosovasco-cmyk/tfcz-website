# TFCZ Website — API-Vertrag

**Für den Backend-Entwickler.** Diese Datei ist die **einzige verlässliche Referenz** für alle
Schnittstellen zwischen Website und Server. Sie beschreibt, was das Frontend **heute schon aufruft**
(der Code steht, die Aufrufe sind live) und was noch dazukommt.

**Regel:** Ein neuer Endpunkt wird **zuerst hier** eingetragen, dann im Code gebaut. Nicht umgekehrt.

Stand: 14.07.2026

---

## 1 · Konfiguration — wie das Frontend den Server findet

Drei globale Variablen, gesetzt **bevor** die Bausteine laden (z. B. in einem kleinen
`config.js` im `<head>`, oder vom Server ins HTML gerendert):

```html
<script>
  window.TFCZ_API   = 'https://api.tfcz.ch';   // Basis-URL, ohne Schrägstrich am Ende
  window.TFCZ_USER  = { id: 42, name: 'Vasco' }; // eingeloggtes Profil (oder nicht gesetzt)
  window.TFCZ_TOKEN = 'eyJhbGciOi…';           // Bearer-Token für geschützte Aufrufe
</script>
```

**Wichtig — das Frontend darf nie brechen:**

* Ist `TFCZ_API` **nicht gesetzt**, läuft die Seite vollständig weiter: Getränke zeigen den
  Platzhalter, Likes leben in `localStorage`, Formulare gehen per `mailto`. Das ist der **heutige
  Zustand** und muss so bleiben.
* Antwortet der Server **nicht** oder mit einem Fehler, fällt jeder Baustein still auf denselben
  lokalen Weg zurück. Kein Aufruf blockiert die Seite, kein `await` im Renderpfad.
* Wird `TFCZ_API` **nachträglich** gesetzt (z. B. nach dem Login), holt der Getränke-Baustein die
  Liste selbstständig nach (kurzes Polling, dann Ruhe).

**CORS:** Die Seite läuft auf `tfcz.ch`, die API vermutlich auf einer Subdomain — `Access-Control-Allow-Origin`
für die Website-Domain wird gebraucht, für die Like-/Formular-`POST`s auch `Content-Type: application/json`
in `Access-Control-Allow-Headers`.

**Auth:** Wo unten „geschützt" steht, erwartet das Frontend, `Authorization: Bearer <TFCZ_TOKEN>`
mitzuschicken. Öffentliche Endpunkte (Getränke, Like-Zähler lesen) brauchen keinen Token.

---

## 2 · Endpunkte, die das Frontend HEUTE aufruft

### 2.1 Getränke — `GET /api/drinks`

Aufrufer: `system/components/drinks.js` · Datenquelle im Frontend: `system/drinks.js` (nur Fallback-Struktur).

**Die Preise gehören dem Server.** Im Frontend steht überall `preis: null` — das heisst „kommt vom
Server", nicht „fehlt". Preise werden **nie** ins HTML oder in `drinks.js` geschrieben.

```jsonc
// Antwort
{
  "kategorien": [
    {
      "id": "bier",                    // stabil: bier | kalt | heiss | snacks
      "name": "Bier & Cider",
      "icon": "beer",                  // Lucide-Icon-Name (beer, cup-soda, coffee, cookie)
      "artikel": [
        { "name": "Stange / Flasche", "preis": 4.5 },   // Zahl -> "CHF 4.50"
        { "name": "Cider",            "preis": "6.–" }, // String wird 1:1 gezeigt
        { "name": "Alkoholfreies Bier", "preis": null } // noch offen -> Platzhalter
      ]
    }
  ],
  "zahlung": "Zahlung per Karte / Twint · kein Bargeld"
}
```

Englische Feldnamen (`categories` / `items` / `price` / `payment`) werden **ebenfalls akzeptiert** —
der Renderer normalisiert beides. Deutsch ist bevorzugt.

Heutiges Sortiment (Struktur, ohne Preise): `bier` (3 Artikel) · `kalt` (3) · `heiss` (2) · `snacks` (2).
Die Seite „Firmenevents" blendet `snacks` aus — das ist eine Frontend-Option, keine Server-Sache.

Später lesen **Bar-Display und Kassensystem** dieselbe Quelle.

---

### 2.2 Foto-Likes

Aufrufer: `system/likes.js`. **Bild-ID = Dateiname ohne Endung** (`action-04`, `atmosphaere-01`).
Ein veröffentlichtes Bild wird nie umbenannt, sonst startet sein Zähler bei null.

**`GET /api/likes`** — alle Zähler (öffentlich)

```jsonc
{ "action-01": 12, "action-04": 3, "atmosphaere-05": 7 }
```

**`POST /api/likes/<bildId>`** — liken / entliken

```jsonc
// Body
{ "delta": 1, "liked": true, "user": 42 }   // delta: +1 oder -1 · user: null wenn nicht eingeloggt
// Antwort
{ "count": 13 }                              // der neue Gesamtzähler
```

> **Der Server erzwingt: ein Like je (Nutzer, Bild).** Das Frontend schickt zwar `delta`, aber die
> Wahrheit liegt beim Server — er darf `delta` ignorieren und den Zustand selbst bestimmen. Antwortet
> er mit `count`, übernimmt das Frontend diesen Wert. Ohne Login (`user: null`) reicht eine
> Zählung pro Gerät; wie streng ihr das macht, entscheidet ihr.

**`GET /api/likes/mine?user=<id>`** — meine Likes (geschützt)

```jsonc
{ "action-04": true, "action-07": true }
```

Damit folgen Likes dem **Profil statt dem Gerät**: nach dem Login sieht der Nutzer auf jedem Gerät,
was er schon geliked hat.

---

### 2.3 Formulare — `POST /api/forms/<formId>`

Aufrufer: `system/components/form.js`. Der `mailto`-Weg läuft **zusätzlich und unabhängig** weiter —
der `POST` ist „Feuern und vergessen": schlägt er fehl, merkt der Nutzer nichts, die Mail geht trotzdem raus.
(Sobald der Server zuverlässig läuft, kann man den mailto-Weg zum reinen Fallback machen.)

```jsonc
// Body
{
  "formular": "firmenevent",
  "felder":   { "firma": "Muster AG", "person": "…", "email": "…", "anzahl": "16",
                "datum": "Di, 14. Juli 2026", "zeit": "17:00–19:00" },
  "betreff":  "TFCZ · Firmenevent-Anfrage — Muster AG",
  "text":     "Anfrage Firmenevent\n————…"   // der fertige Mailtext
}
```

**Die acht Formular-IDs und ihre Feld-Schlüssel** (`*` = Pflichtfeld, `?` = optional) — genau so,
wie sie im Body ankommen:

| `formId` | Felder |
|---|---|
| `mitglied-schnuppern` | vorname\* nachname\* email\* tel? wann\* msg? |
| `mitglied-aktiv` | vorname\* nachname\* email\* tel? geburt? level\* msg? |
| `mitglied-key` | vorname\* nachname\* email\* tel? level\* motivation\* |
| `mitglied-goenner` | vorname\* nachname\* firma? email\* tel? betrag\* turnus\* msg? |
| `mitglied-sponsor` | firma\* person\* email\* tel? art\* budget? msg? |
| `training` | vorname\* nachname\* email\* tel\* mitglied\* adresse? tag\* semester\* msg? |
| `firmenevent` | firma\* person\* email\* tel? anzahl\* datum\* zeit? msg? |
| `medien` | name\* medium\* email\* tel? anliegen\* frist? msg? |

Die Feld-Definitionen stehen in `system/forms.js` — **ändert sich dort ein Schlüssel, ändert er sich
auch hier.** Der Server sollte unbekannte Schlüssel tolerieren (nicht ablehnen), damit ein neues Feld
im Frontend nichts kaputt macht.

Empfänger für den Mail-Weg: `info@tfcz.ch` (aus `system/content.js`).

---

## 3 · Endpunkte, die noch kommen

Diese ruft das Frontend **noch nicht** auf — hier ist der Vertrag noch verhandelbar. Bevor sie gebaut
werden, tragen wir sie hier ein.

### 3.1 Login / Auth

`login.html` existiert heute nur als Hülle: es gibt kein Anmelden dahinter.

Erwartung des Frontends:

```jsonc
POST /api/login      { "email": "…", "passwort": "…" }
  -> { "token": "…", "user": { "id": 42, "name": "Vasco", "rolle": "mitglied" } }

POST /api/logout     (geschützt) -> 204
GET  /api/me         (geschützt) -> { "id": 42, "name": "Vasco", "rolle": "mitglied" }
```

Nach dem Login setzt die Seite `window.TFCZ_USER` und `window.TFCZ_TOKEN` — ab dann folgen Likes und
Profil dem Nutzer.

**Passwörter, Sessions und Rate-Limiting sind Server-Sache.** Das Frontend speichert kein Passwort
und baut keine eigene Krypto. Wenn ihr `httpOnly`-Cookies statt Bearer-Token wollt: auch recht, dann
entfällt `TFCZ_TOKEN` — sagt uns nur, welchen Weg ihr geht.

**Rollen:** heute relevant wären `gast` · `mitglied` · `admin` (der geschützte Bereich — POS, Cockpit,
Design Studio — soll später an derselben Anmeldung hängen).

### 3.2 Events / Kalender

Die Events liegen heute **hartkodiert im Seitencode** (`index.html`). Das ist der nächste Kandidat für
den Server:

```jsonc
GET /api/events?von=2026-07-01&bis=2026-09-30
  -> [ { "id": 1, "titel": "Käsekick", "kategorie": "fun",
         "datum": "2026-07-31", "zeit": "19:00", "ende": "23:00",
         "info": "inkl. Raclette", "preis": 5 } ]
```

`kategorie` ist eine der vier bestehenden Kategorien (`fun` · `training` · `dyp` · `pro` · `elite`) —
sie steuert Farbe und Badge im Kalender.

### 3.3 Profil / Anmeldungen

Später: „meine Anmeldungen", „meine Konsumationen", Profil speichern. Vertrag folgt, wenn der
geschützte Bereich gebaut wird.

---

## 4 · Wo im Code was steht

| Thema | Datei |
|---|---|
| Basis-Konfiguration | `window.TFCZ_API` / `TFCZ_USER` / `TFCZ_TOKEN` (global) |
| Getränke | `system/drinks.js` (Struktur) · `system/components/drinks.js` (Aufruf) |
| Likes | `system/likes.js` |
| Formulare | `system/forms.js` (Felder) · `system/components/form.js` (Aufruf) |
| Inhalte (Mail, Adresse, Koordinate) | `system/content.js` |

Suchbegriffe im Code: `TFCZ_API`, `/api/`.
