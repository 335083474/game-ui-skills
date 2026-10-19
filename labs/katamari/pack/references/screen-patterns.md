# Screen patterns and state contracts

These patterns target narrative/navigation surfaces, not a generic shop or inventory shell. Keep each view purpose-built.

## Collection book

A playful catalog grouped by found-object families, with readable names and personal discovery states.

Structure: An item tag with a cutout silhouette, found-state stamp, and playful but legible name. Show selected identity, status, and consequence before confirmation. Provide a compact summary that survives responsive reflow.

## Level select

A bold destination picker with one clear objective, size target, and accessible route choice.

Structure: A large objective circle paired with concise size target and route selector. Keep story copy short enough to scan, let the player compare consequences, and retain a clearly labeled return path.

## Roll results

A celebratory result reveal that communicates size, new finds, and replay choices without hiding the score.

Structure: An oversized score seal plus compact new-find chips; decorative burst does not carry meaning alone. Commit must be explicit; cancellation must not alter the underlying record. State unavailable choices in text, not only faded color.

## Synthetic contract

See demo-state.json. It is invented demonstration state and should be adapted to the actual product. Preserve stable IDs so selection does not depend on list position. A selected option is preview-only until commit. On commit, update only the declared fields; on cancel, restore the previous selection and leave inventory, relationships, clues, or results unchanged.

## Behavior acceptance

- Pointer and keyboard select the same stable ID; Tab order follows the visual order.
- Enter/Space previews, and a separate labeled action commits consequential choices.
- Disabled actions expose a short reason in nearby text and in an accessible description.
- State change updates visible values and a polite live region; no color-only feedback.
- Back/cancel returns to the prior surface without silently committing.
- At 320 CSS px, primary content and action remain visible without horizontal scrolling.

