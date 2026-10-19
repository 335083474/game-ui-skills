# Screen patterns and state contracts

These patterns target narrative/navigation surfaces, not a generic shop or inventory shell. Keep each view purpose-built.

## Caravan preparation

A compact roster, provisions ledger, and road-party selection before departure.

Structure: A single focused choice row with a red oath stroke and a clear consequence hint. Show selected identity, status, and consequence before confirmation. Provide a compact summary that survives responsive reflow.

## Roadside event

A consequential travel vignette with a short narrative, two grounded choices, and visible supplies at stake.

Structure: Three unequal portrait tokens with role, fatigue, and a compact provision count. Keep story copy short enough to scan, let the player compare consequences, and retain a clearly labeled return path.

## Camp trade

A low-noise barter table that keeps scarcity, item condition, and accept/cancel consequences legible.

Structure: A paper-and-stitched item line with quantity, scarcity mark, and disabled reason. Commit must be explicit; cancellation must not alter the underlying record. State unavailable choices in text, not only faded color.

## Synthetic contract

See demo-state.json. It is invented demonstration state and should be adapted to the actual product. Preserve stable IDs so selection does not depend on list position. A selected option is preview-only until commit. On commit, update only the declared fields; on cancel, restore the previous selection and leave inventory, relationships, clues, or results unchanged.

## Behavior acceptance

- Pointer and keyboard select the same stable ID; Tab order follows the visual order.
- Enter/Space previews, and a separate labeled action commits consequential choices.
- Disabled actions expose a short reason in nearby text and in an accessible description.
- State change updates visible values and a polite live region; no color-only feedback.
- Back/cancel returns to the prior surface without silently committing.
- At 320 CSS px, primary content and action remain visible without horizontal scrolling.

