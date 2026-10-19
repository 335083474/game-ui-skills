---
name: curse-monkey-island-ui
description: Create original browser-game interfaces with hand-painted pirate-cartoon adventure ui. Use the visual direction of The Curse of Monkey Island (1997), not as an official or pixel-exact recreation.
---

# Hand-painted pirate-cartoon adventure UI

This package provides a visual grammar, reusable fragments, and synthetic interaction contracts for original game interfaces. Its names and values are fictional examples.

## Read and inspect

- Read [visual-rules.md](references/visual-rules.md), [tokens.json](references/tokens.json), and the requested pattern in [screen-patterns.md](references/screen-patterns.md).
- Inspect the original generated plate at [curse-monkey-island-art.png](assets/illustrations/curse-monkey-island-art.png). Use a crop as an art cue; do not stretch it across a screen.
- Build from [editable component specimens](assets/components/index.html) and [theme.css](assets/components/theme.css).
- Match synthetic data and observable behavior to [demo-state.json](references/demo-state.json).
- Confirm edition and source limits in [sources.md](references/sources.md).

## Direction rules

Expressive, hand-painted, mischievous, and readable. Use wobbly painted outlines, paper map edges, expressive speech tails, sea-glass blocks, theatrical prop silhouettes. Favor clear silhouettes and readable action labels. The art may carry atmosphere, while UI state stays in HTML text and accessible semantics. photoreal pirate textures, modern inventory-grid cliches, copying named characters or exact scene compositions, tiny item labels.

Choose the pattern that matches the request: inventory-tray, item-interaction, or dialogue-scene. Compose each requested surface for its actual player task; this board is a specimen sheet, never a full application. Keep scene space visible for active play and place secondary reference material behind an intentional open/close control.

Selection and preview must be reversible until explicit confirmation. Explain cost, target, and invalid use in words. Make pointer, keyboard, and assistive-technology feedback equivalent. Honor reduced motion and maintain readable contrast over painted scenes.


## Rendered component reference

Inspect [component-board.png](references/images/component-board.png), the actual browser rendering of the editable primitives. This is a component reference; compose the requested screens independently.
