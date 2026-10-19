# Screen patterns

Keep one invented household, room catalog, and social graph state shared across the three views. These are composition and behavior contracts, not finished layouts.

## Needs

Show a selected household member with name, current location, and a compact switcher for other members. Arrange six need meters in two short columns or one vertical list, each with name, textual level, icon / cue, and accessible progress value. Keep the current mood / aspiration as secondary detail. Switching member changes which values are shown; it does not mutate needs. Any simulation that changes a need must identify the action and show the updated value. Avoid showing all household data as separate dashboard cards.

Synthetic example: Sam Iri, in “Kitchen Nook,” with Energy 42/100, Hunger 68/100, Social 76/100, Hygiene 54/100, Fun 31/100, and Bladder 88/100. These numbers are invented and do not model actual game mechanics.

## Build catalogue

Use a room / category filter and an object shelf with a small set of clearly labeled tiles. Each tile shows object name, price, and category. Selection opens a single larger placement preview plus rotate / place controls. A cost can be reviewed before purchase; clicking a tile must not deduct currency. A confirmed purchase updates the shared household budget and placed-object list exactly once. Include an empty / insufficient-budget state with its reason in text.

Synthetic example: “Cove Reading Chair,” living room, 240§. Selecting changes the preview; “Place” commits the synthetic object and reduces the example budget from 1,100§ to 860§. No official item or price is asserted.

## Relationships

Represent a small set of household and outside relationships as named nodes connected by labeled ties. One relationship is selected at a time and opens a detail line for the two people, tie type, and direction if relevant. Make filtering / selecting non-destructive. If the user changes a synthetic relation state, use explicit action and show before / after text. Keep a table or linear list as an accessible fallback to any free-position graph.

Synthetic example: Sam Iri — “roommate” — Jo Ren; Jo's trust is “steady” in the demo. A graph line does not imply a numeric game value unless the requested version provides it.
