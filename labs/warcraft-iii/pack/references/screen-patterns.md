# Screen patterns

Use one clearly labeled synthetic demo state across related screens. These contracts define hierarchy and interaction intent, not original-game rules.

### Command Console — command-console

A broad central playfield with the sculpted Human command console at its lower edge.

Keep terrain as the largest spatial surface; place selected hero, order/health summary, command grid, and compact minimap below.

### Hero Inventory — hero-inventory

An original hero portrait with clearly named equipment slots and a compact skill/status group.

Keep equipment items legible and distinct; show one selected item and a concise synthetic description.

### Quest Log — quest-log

A parchment objective list with main and optional marks, progress text, and a clear active objective.

Keep the active objective concise; show optional progress separately and preserve playfield visibility where possible.

## Shared responsive contract

Selection updates a visible preview; an explicit commit control is the only action that implies a state change. At 390 px, reflow secondary details and item grids instead of shrinking labels or introducing horizontal overflow. Provide visible keyboard focus in authored screens.

For command-console states, the battlefield remains central and the command console remains below it.
