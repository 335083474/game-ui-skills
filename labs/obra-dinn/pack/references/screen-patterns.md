# Screen patterns and synthetic behavior

## Crew roster

A stable crew index supports sorting by name, location, and identity confidence.

Primitive: Identity line. A ledger row with stable ID, confidence label, and status glyph.

## Investigation log

A chronological deduction record separates observed evidence from inferred fate.

Primitive: Evidence entry. A dated note labels observed fact separately from inference.

## Chapter index

A ship and deck index reveals access and completion while preserving the investigative route.

Primitive: Deck marker. A minimal map coordinate with accessible chapter label and unlocked state.

## Contract
demo-state.json contains invented examples. IDs remain stable when sorted. Identity confidence has at least the values suspected and confirmed. Every log record labels evidence as observed or inferred. Previewing a person or chapter changes focus only. Confirmation is required before a persistent note or status is changed.

## Acceptance
- Roster sort preserves selected stable ID.
- Observed and inferred notes have text labels and unique symbols.
- Keyboard and pointer can select, open details, and return.
- The current location and locked state are written, not conveyed only by inversion.
- At 320px, long names wrap without hiding status or back control.

