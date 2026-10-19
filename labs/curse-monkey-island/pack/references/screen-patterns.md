# Screen patterns

## Inventory tray

A small set of tactile item tokens stays distinct from the scene and supports inspect, select, combine, and cancel.

Use Curious item token as a reusable primitive. Keep identity, currently selected item/slot, and one contextual action in a tight cluster. Avoid reproducing game-specific icons.

## Item interaction

A selected item and target form a clear contextual action with feedback about a plausible or rejected use.

Use Context action as a reusable primitive. Show cost, ownership/equipped state, valid target, and result text before the player commits. Keep scene movement available when the surface is not modal.

## Dialogue scene

A character-forward line, expression cue, and a small response set sit over a mostly open painted scene.

Use Speech response as a reusable primitive. Keep primary result information stable in the reading order; provide replay/back as separate actions.

## Synthetic state and behavior

The examples in demo-state.json are invented. Keep stable IDs and explicit state fields. Preview changes only selectedId/selection; commit changes only the field declared by the product contract. Cancellation restores the previous selection. Item use returns a specific outcome and never silently consumes an item on a rejected target.

Acceptance checks: keyboard and pointer select the same item; focus is visible; action has a separate textual name; disabled reasons are readable and announced; meaningful updates appear in a polite live region; layout reflows at 320 CSS px; reduced-motion preferences suppress decorative movement.

