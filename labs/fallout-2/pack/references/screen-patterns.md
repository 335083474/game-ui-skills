# Screen patterns

These are composition and state contracts for a fresh output. They do not provide finished screen layouts. All example values in the component board are synthetic.

## Character Record (`character`)

**Structure:** A dense character sheet with seven attribute rows, condition markers, and a compact monochrome status panel.

**Design/use:** Keep attribute names and sample values aligned as a table. Use a separate selected-condition state and label every demo value; avoid a dashboard of floating stat cards.

## Inventory (`inventory`)

**Structure:** A tightly packed item field with count/weight, selected-object description, and a small action strip.

**Design/use:** Let item silhouette, name, count, and weight cooperate. The grid may be dense but must not overlap; select one item and expose its description in a stable lower or side rail.

## Barter Ledger (`barter`)

**Structure:** Two offer columns, a visible balance/gap, and an explicit propose/withdraw state.

**Design/use:** Make ownership and requested goods unambiguous. Show totals and imbalance as text and shape, not color alone. Proposing a trade is a separate explicit action.

## Shared behavior

- Use semantic buttons or links, an accessible text name for pictorial controls, and visible focus.
- Separate preview from commit; show disabled, selected, or unavailable states with a label or shape cue as well as color.
- Preserve the primary play/map/work surface at narrow widths. Respect reduced-motion settings.
