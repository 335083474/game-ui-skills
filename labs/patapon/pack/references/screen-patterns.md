# Screen patterns and interaction contract

## Squad loadout
A unit formation keeps role, count, and equipment readable through repeated shape and text.
Primitive: Unit totem. Keep role and count next to each silhouette. Preview formation changes before apply.

## Expedition select
A route choice shows danger and supply cost in a clear rhythm-friendly selection sequence.
Primitive: Route beat. Provide current selection, cost, danger label, and an explicit launch action.

## Rhythm HUD
Beat prompts use bold symbols, timing window, and text feedback with visual alternatives to sound.
Primitive: Beat glyph. Present past/current/next beats in sequence; distinguish the active timing window from a successful input, then show a stable result.

## Behavior
The sample state is fictional. Use stable IDs for units and routes. Keyboard and pointer select equivalent units and routes. Replacing formation or route is a reversible preview until apply/launch. Beat input emits one named result per command (ready, hit, late, or missed); avoid announcing each animation frame. Reduced motion leaves timing window and result legible. Sound is optional feedback, never the sole signal.

