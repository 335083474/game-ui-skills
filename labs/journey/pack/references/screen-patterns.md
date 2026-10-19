# Screen patterns and synthetic behavior

## Chapter gates (chapter-gates)

Place a few original gate forms along the scene's route. Name the current and reachable destinations. A selected gate changes only the preview; crossing it requires a separate Cross gate action. Do not cover the gate or horizon with a large side list.

## Journey progress (journey-progress)

Use named waypoints such as passed, here, and ahead. A narrow path or three-step sequence can communicate orientation without a percentage, dashboard, or world map. A progress update requires a real crossing event or explicit demo action.

## Companion signals (companion-signals)

Offer a few brief, labeled signal choices such as chime, wave, or glow. Selection previews the signal. Send signal is explicit. Treat the specimen as local-only; do not claim delivery to another player or a working network session.

## Synthetic contract

demo-state.json invents the gate labels, waypoint names, and signal. Keep previewGate separate from currentGate, and pendingSignal separate from sentSignal. No value is a canonical Journey location, story fact, or multiplayer record.

## Observable behavior

- Gate preview updates a name and marker without moving the player.
- Crossing has its own explicit action.
- Waypoint progress changes only after an explicit crossing action.
- Signal selection does not send; Send signal announces only a local specimen event.
- Controls remain keyboard accessible, state is labeled beyond color, and reduced motion removes cloth drift.

