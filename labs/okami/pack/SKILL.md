---
name: okami-ui
description: Create original browser-game interfaces with japanese ink-scroll action ui. Use the visual direction of Ōkami HD (2017 PC direction), not as an official or pixel-exact recreation.
---

# Japanese ink-scroll action UI

This package provides a visual grammar, reusable fragments, and synthetic interaction contracts for original game interfaces. Its names and values are fictional examples.

## Read and inspect

- Read [visual-rules.md](references/visual-rules.md), [tokens.json](references/tokens.json), and the requested pattern in [screen-patterns.md](references/screen-patterns.md).
- Inspect the original generated plate at [okami-art.png](assets/illustrations/okami-art.png). Use a crop as an art cue; do not stretch it across a screen.
- Build from [editable component specimens](assets/components/index.html) and [theme.css](assets/components/theme.css).
- Match synthetic data and observable behavior to [demo-state.json](references/demo-state.json).
- Confirm edition and source limits in [sources.md](references/sources.md).

## Direction rules

Spare, lyrical, ink-led, and deliberate. Use dry-brush edges, flowing ink stems, sparse vermilion seals, vertical scroll rhythm, generous quiet space. Favor clear silhouettes and readable action labels. The art may carry atmosphere, while UI state stays in HTML text and accessible semantics. heavy HUD borders, generic parchment cards, copied divine beasts or game-specific brush icons, texture behind small text.

Choose the pattern that matches the request: item-scroll, technique-selection, or field-journal. Compose each requested surface for its actual player task; this board is a specimen sheet, never a full application. Keep scene space visible for active play and place secondary reference material behind an intentional open/close control.

Selection and preview must be reversible until explicit confirmation. Explain cost, target, and invalid use in words. Make pointer, keyboard, and assistive-technology feedback equivalent. Honor reduced motion and maintain readable contrast over painted scenes.


## Rendered component reference

Inspect [component-board.png](references/images/component-board.png), the actual browser rendering of the editable primitives. This is a component reference; compose the requested screens independently.
