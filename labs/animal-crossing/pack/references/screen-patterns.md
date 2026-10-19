# Screen patterns

Use one clearly labeled synthetic demo state across related screens. These contracts define hierarchy and interaction intent, not original-game rules.

### Pockets — pockets

A dotted pocket grid with a selected object, quantity, and touch-sized quick actions.

Keep the selected object name and count visible; pocket cells should remain generous on narrow screens.

### DIY Recipes — diy-recipes

A paper recipe card with an original handmade object, ingredient checklist, and make action.

Show output first, ingredient readiness second, and one make action. Mark synthetic object and resource names.

### Island Map — island-map

An original island sketch with named destinations, soft paths, and a small destination card.

Use a soft organic land silhouette, dotted route, and place labels that stay readable at mobile width.

## Shared responsive contract

Selection updates a visible preview; an explicit commit control is the only action that implies a state change. At 390 px, reflow secondary details and item grids instead of shrinking labels or introducing horizontal overflow. Provide visible keyboard focus in authored screens.
