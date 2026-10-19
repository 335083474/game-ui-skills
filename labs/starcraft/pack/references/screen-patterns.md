# Screen patterns

Use one clearly labeled synthetic demo state across related screens. These contracts define hierarchy and interaction intent, not original-game rules.

### Command Console — command-console

A central battlefield sample with narrow telemetry and the actual command console along its lower edge.

Leave the field as the largest area. Put the selected unit, order summary, command matrix, and compact radar below it.

### Unit Roster — unit-roster

A compact roster of original unit portraits, role labels, assignment state, and selected-unit summary.

Use an original generic silhouette for each entry and show selection with a border, label, and status marker.

### Mission Brief — mission-brief

A pre-mission specimen with ordered objectives, sector sketch, comms identity, and launch action.

Keep brief text short, mark demo objectives as synthetic, and separate launch confirmation from preview.

## Shared responsive contract

Selection updates a visible preview; an explicit commit control is the only action that implies a state change. At 390 px, reflow secondary details and item grids instead of shrinking labels or introducing horizontal overflow. Provide visible keyboard focus in authored screens.

For command-console states, the battlefield remains central and the command console remains below it.
