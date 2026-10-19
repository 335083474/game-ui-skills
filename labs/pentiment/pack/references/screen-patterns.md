# Screen patterns and state contracts

These patterns target narrative/navigation surfaces, not a generic shop or inventory shell. Keep each view purpose-built.

## Relationship map

A readable web of people, places, and testimony, with uncertainty shown in words as well as line style.

Structure: A chapter label with a red initial and an ink-black title, using hierarchy rather than boxes. Show selected identity, status, and consequence before confirmation. Provide a compact summary that survives responsive reflow.

## Investigation log

A chronological record of clues and contradictions that preserves source and confidence.

Structure: A clipped manuscript note with source, confidence, and a contradiction marker. Keep story copy short enough to scan, let the player compare consequences, and retain a clearly labeled return path.

## Dialogue exchange

A character-forward conversation with clear speaker attribution, response voice, and controlled text width.

Structure: Two response lines with distinct rhetorical tones and a clear selected state. Commit must be explicit; cancellation must not alter the underlying record. State unavailable choices in text, not only faded color.

## Synthetic contract

See demo-state.json. It is invented demonstration state and should be adapted to the actual product. Preserve stable IDs so selection does not depend on list position. A selected option is preview-only until commit. On commit, update only the declared fields; on cancel, restore the previous selection and leave inventory, relationships, clues, or results unchanged.

## Behavior acceptance

- Pointer and keyboard select the same stable ID; Tab order follows the visual order.
- Enter/Space previews, and a separate labeled action commits consequential choices.
- Disabled actions expose a short reason in nearby text and in an accessible description.
- State change updates visible values and a polite live region; no color-only feedback.
- Back/cancel returns to the prior surface without silently committing.
- At 320 CSS px, primary content and action remain visible without horizontal scrolling.

