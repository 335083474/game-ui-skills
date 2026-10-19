# Screen patterns

Use one invented protagonist, encounter, inventory, and conversation across all three views. These are composition / state contracts, not complete screen layouts.

## Battle commands

Keep the central field quiet. Put a compact status line and a small set of command choices at the lower edge. The heart pointer has one selected choice at a time. Commands that need an enemy or ally open a target list as the next layer. Back returns to the command row and retains the prior focus. Confirm does not repeat when the user presses Enter twice quickly. If a result changes a numeric status, show the before / after values in text.

Synthetic example labels: `STRIKE`, `SPEAK`, `ITEMS`, `WITHDRAW`. An invented paper golem has 18 stamina; the UI shows that value separately from the command cursor. These are not game mechanics or character names.

## Items

Use a bounded black list with square outline, the heart at the active row, item name, quantity, and a short effect note. A target / confirmation layer appears only when required. Inspecting an item never consumes it. Confirm updates inventory exactly once; cancel returns the count unchanged. A full-health or unavailable target is disabled with a text reason. Do not replace the list with colorful inventory tiles.

Synthetic example: “Mint Biscuit” ×2, restores 8 stamina in the local demo. Selecting highlights the item; using it consumes one only after target confirmation.

## Dialogue

Use a single high-contrast white frame with left-aligned text and enough inner space for comfortable reading. A small speaker label is optional; do not put a portrait on every line. Continue / advance is clear and keyboard accessible. A branch appears as two or three concise text choices inside the frame or directly below it. Typewriter animation is optional, skippable, and never blocks screen-reader text. Return from a branch with the conversation state intact.

Synthetic example: “The paper golem points to a door with no handle.” Choices: “Ask about the hinge,” “Offer the mint biscuit,” or “Wait.” All copy is invented.
