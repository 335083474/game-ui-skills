# Screen and state patterns

All map features, object labels, equipment values, coordinates, and events below are invented demo state. They do not reproduce a saved game or identify a particular Cogmind build.

## Equipment — `equipment`

Use a compact slot table with five rows: `CORE / Micro Reactor / 82%`, `PROPULSION / Aluminum Leg / 64%`, `UTILITY / Terrain Scanner / 91%`, `UTILITY / Signal Interpreter / 73%`, and `WEAPON / Arc Projector / 58%`. Prefix each row with an original single-character glyph. Selecting a row reveals its synthetic condition and a one-line function. `Enter` inspects; `Esc` closes the detail. No item has a claimed game balance value.

## Exploration Map — `exploration-map`

Use a 17-column by 9-row glyph map. Start cursor at `(8,4)` on `@`; room walls are `#`, a closed door is `+`, debris is `%`, a data terminal is `&`, a hazard is `^`, a stair is `>`, and unknown space is `?`. Arrow keys or `h/j/k/l` move the cursor within the map bounds. `Enter` inspects a cell and updates a short text status. The legend must remain visible and text-labeled.

## Event Log — `event-log`

Show newest first, with stable sequence labels: `E-017 / scanner / An irregular return appears on the east wall.`; `E-016 / movement / Position recorded at (8,4).`; `E-015 / salvage / A sealed component case is marked nearby.` Use original text and distinguish info, warning, and discovery with a glyph plus a text label.

## Shared interaction contract

Use the same map coordinates and component labels across all three screens. Keyboard and pointer selection should resolve to the same focused row or cell. The values and events are synthetic; avoid implying world simulation, combat resolution, or an exact in-game control mapping.

