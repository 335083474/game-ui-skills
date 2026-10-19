# Screen patterns

These are composition and state contracts for a fresh output. They do not provide finished screen layouts. All example values in the component board are synthetic.

## Cyberware (`cyberware`)

**Structure:** A body-slot schematic with installed implants, a selected module, and a compact before/after capability readout.

**Design/use:** Separate slot identity from implant stats. Highlight one focused slot and show what is equipped, available, or locked. Use original abstract glyphs rather than copied cyberware icons.

## Mission Journal (`mission-journal`)

**Structure:** A dense job ledger with one active objective, related entries, and a short action/status rail.

**Design/use:** Distinguish active, tracked, and archived jobs through markers and verbs as well as color. Keep the selected objective in a concise detail panel; avoid prose walls.

## District Map (`district-map`)

**Structure:** An angular city-grid map with route traces, district labels, selected location, and a narrow destination inspector.

**Design/use:** The map is the main surface. Use line weight and node shape to express route and waypoint states; do not crowd it with repeated cards or decorative city data.

## Shared behavior

- Use semantic buttons or links, an accessible text name for pictorial controls, and visible focus.
- Separate preview from commit; show disabled, selected, or unavailable states with a label or shape cue as well as color.
- Preserve the primary play/map/work surface at narrow widths. Respect reduced-motion settings.
