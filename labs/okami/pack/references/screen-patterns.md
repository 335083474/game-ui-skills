# Screen patterns

## Item scroll

A scroll catalog groups collected objects by use and story role while keeping the field scene visible.

Use Scroll entry as a reusable primitive. Keep identity, currently selected item/slot, and one contextual action in a tight cluster. Avoid reproducing game-specific icons.

## Technique selection

A small technique set shows input gesture, cost, and equipped state with an accessible text alternative.

Use Brush technique mark as a reusable primitive. Show cost, ownership/equipped state, valid target, and result text before the player commits. Keep scene movement available when the surface is not modal.

## Field journal

A calm record ties discovered places and completed favors to dates and readable progress.

Use Journal seal as a reusable primitive. Keep primary result information stable in the reading order; provide replay/back as separate actions.

## Synthetic state and behavior

The examples in demo-state.json are invented. Keep stable IDs and explicit state fields. Preview changes only selectedId/selection; commit changes only the field declared by the product contract. Cancellation restores the previous selection. Item use returns a specific outcome and never silently consumes an item on a rejected target.

Acceptance checks: keyboard and pointer select the same item; focus is visible; action has a separate textual name; disabled reasons are readable and announced; meaningful updates appear in a polite live region; layout reflows at 320 CSS px; reduced-motion preferences suppress decorative movement.

