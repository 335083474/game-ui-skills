# Screen patterns

## Equipment cards

A clear loadout compares shot, charm, and super choices with readable names and selected checkmarks.

Use Loadout ticket as a reusable primitive. Keep identity, currently selected item/slot, and one contextual action in a tight cluster. Avoid reproducing game-specific icons.

## Shop counter

A compact purchase counter exposes price and owned state, previews the item, and separates buy from back.

Use Purchase placard as a reusable primitive. Show cost, ownership/equipped state, valid target, and result text before the player commits. Keep scene movement available when the surface is not modal.

## Level results

A punchy results reveal reads grade, time, and objective marks in a stable order before replay choices.

Use Grade seal as a reusable primitive. Keep primary result information stable in the reading order; provide replay/back as separate actions.

## Synthetic state and behavior

The examples in demo-state.json are invented. Keep stable IDs and explicit state fields. Preview changes only selectedId/selection; commit changes only the field declared by the product contract. Cancellation restores the previous selection. Item use returns a specific outcome and never silently consumes an item on a rejected target.

Acceptance checks: keyboard and pointer select the same item; focus is visible; action has a separate textual name; disabled reasons are readable and announced; meaningful updates appear in a polite live region; layout reflows at 320 CSS px; reduced-motion preferences suppress decorative movement.

