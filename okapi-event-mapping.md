# Okapi-API → TFCZ-Kalender: Event-Typ-Mapping (Vorschlag zur Abnahme)

> Stand 07.07.2026 · Claude-generiert. **Die linke Spalte („Okapi-Wert") bitte mit den
> echten Strings aus deiner Okapi-Instanz bestätigen/korrigieren** — die Public-API ist nicht
> öffentlich dokumentiert, darum sind das plausible Annahmen.

## 1. Was die API liefert (bekannt)

Aus `/public-api/v1/events` pro Event:
`date · startTime · endTime · doorOpeningTime · eventType · status`
Farben/Unterkategorien aus `/sub-event-types` (`name`, `color`).
Externe Buchungen (z. B. `Firmenevent`, `Privatevent`) → **öffentlich anonym** als „Event".

## 2. Unsere Kalender-Kategorien (Ziel)

| Key | Label | Farbe | Kategorie |
|---|---|---|---|
| `training` | Training | `#5ca7dc` | Fun |
| `kaese` | Käsekick | `#5ca7dc` | Fun |
| `kids` | Kids | `#e8883a` | Kids |
| `dyp` | Fun | `#5ca7dc` | Fun |
| `turnier` | Pro | `#005a94` | Pro |
| `elite` | Elite (ITSF: SM, Champions League, Nati, WM) | `#cda857` | Elite |
| `event` | Event (extern, anonym) | `#3b7657` | Event |

## 3. Mapping-Vorschlag

**Regel A – Sichtbarkeit zuerst (status & extern):** *(bestätigt 07.07.2026)*
1. Sichtbarkeit **wie die Website es heute schon macht** — nur veröffentlichte/aktive Events
   anzeigen (gleiche Logik wie aktuell im Kalender), keine Extra-Statuslogik.
2. `eventType` ∈ {`Firmenevent`, `Privatevent`, `Vermietung`, …extern…} → immer `event` (grün).
   **Kein Titel** — nur die **Zeit** (Buchungs-/Einlasszeit) + Hinweis, dass der Club in diesem
   Fenster **ausschliesslich für einen Event reserviert** ist. Keine weiteren Details.

**Regel B – interne Events nach `sub-event-type.name` (case-insensitive, erstes Match):**

| Okapi-Wert (bestätigen) | → Key | Hinweis |
|---|---|---|
| enthält „Käsekick" | `kaese` | Letzter Freitag im Monat |
| enthält „Kinder" / „Jugend" | `kids` | Kindertraining Mi |
| enthält „Training" | `training` | Di offen |
| enthält „DYP" / „Plausch" / „Mittwoch" | `dyp` | Mittwochs-DYP |
| enthält „STRT" / „Regio" / „Zürich Open" / „Rangliste" / „Pro Turnier" | `turnier` | Pro Turniere (STF Regio) — hier qualifiziert man sich für die SM |
| enthält „STS" / „SM" / „Schweizermeister" / „Quali" | `elite` | SM gehört zu Elite (Quali läuft über Pro Turniere) |
| enthält „P4P" / „International" / „ITSF" / „WM" / „EM" / „Champions" / „Elite" | `elite` | alles ITSF = Elite |
| **kein Match** | `turnier` | sicherer Fallback (Pro Turnier) |

**Regel C – Farbe:** *(bestätigt 07.07.2026)*
- **Immer** die kanonischen TFCZ-Brand-Farben des gemappten Keys (Tabelle Abschnitt 2).
- Okapis `color` aus `/sub-event-types` wird **ignoriert** — der Brand Guide gewinnt.

## 4. Umsetzung (Skeleton, ersetzt später `allEv()`)

```js
function mapOkapiEvent(ev, subType){
  if(!isVisible(ev)) return null;                        // Regel A.1 – gleiche Sichtbarkeit wie heute
  if(EXTERNAL.has(ev.eventType))                         // Regel A.2 – extern = anonym
    return { type:'event', color:'#3b7657', anonymous:true,
             time: ev.doorOpeningTime||ev.startTime,     // nur Zeit …
             info:'Reserviert für Event' };              // … + Hinweis, KEIN Titel/Details
  var key = matchByName(subType?.name) || 'turnier';     // Regel B
  return { type:key, label:(subType?.name || TYPES[key].label),
           time:ev.startTime, end:ev.endTime,
           color: TYPES[key].color };                    // Regel C – IMMER Brand-Farbe
}
const EXTERNAL = new Set(['Firmenevent','Privatevent','Vermietung']); // ⟵ finale Liste bei dir bestätigen
```

## 5. Bestätigt (07.07.2026)
1. **Keyword-Mapping & externe Typen: bestätigt.**
2. **Sichtbarkeit: wie die Website heute** — keine zusätzliche Statuslogik.
3. **Externe Events: kein Titel**, nur **Zeit** + Hinweis „Reserviert für Event" (ausschliesslich dafür reserviert).
4. **Farben: immer TFCZ-Brand Guide** — Okapi-`color` wird ignoriert.
5. **Begriffe (aktualisiert 07.07.2026):** „Ranglisten-Turniere" heisst öffentlich neu **„Pro Turniere"**
   (`turnier`). Es gibt **keine eigene Stufe „SM-Quali"** mehr — die **Schweizermeisterschaft gehört zu
   `elite`**, aber man **qualifiziert sich dafür über die Pro Turniere** (STS). **`elite`** bündelt alles ITSF
   (SM, Champions League, Nationalteam, WM).

> Offen bleibt nur: die **finale Liste der externen `eventType`-Strings** in deiner Okapi-Instanz.
