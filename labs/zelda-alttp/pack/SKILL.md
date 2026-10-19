---
name: zelda-alttp-ui
description: "Create original browser-game UI studies in The Legend of Zelda: A Link to the Past's 1991 Super Nintendo direction. Use for compact item grids, dungeon-room maps, or item-shop surfaces; this is an independent visual reference, not official game art or a modern Zelda interface."
---

# Zelda: A Link to the Past UI reference

Use this experimental Skill for the fixed target: 1991 Super Nintendo original direction. Build a compact dark menu with double gold edging, square item slots, a small red heart row, and an original room-by-room dungeon map. Keep the visual grammar restrained and console-like.

Read [visual rules](references/visual-rules.md), [screen patterns](references/screen-patterns.md), and [tokens](references/tokens.json). Inspect the original [reference board](references/images/reference-board.svg), reusable [local glyphs](assets/art/ui-atlas.svg), and editable [component specimens](assets/components/index.html). The specimen page is a parts board, not a finished screen.

The authored patterns are:

- inventory: square item slots, a red selected frame, and a compact assignment cue.
- dungeon-map: small room cells with current, explored, and unknown states.
- item-shop: a short item and price list with distinct preview and confirm actions.

Do not use modern Zelda map or inventory conventions. Treat sample items, prices, rooms, and states as invented. Use semantic controls, visible focus, touch targets of at least 44px, and responsive behavior through 390px. Respect reduced motion. Local controls do not update a save or complete a purchase.

The illustrations and components are original local assets. [Sources and boundaries](references/sources.md) records the product/manual context and asset provenance. Do not claim exact game fidelity, engine integration, official artwork, or measured search demand.

## Use this Skill

Give an AI the complete package and specify the player task, viewport, item or room data, controls, and required states. Ask it to reuse the visual grammar while composing a new layout, then save the result outside this package. Do not return the component board unchanged as a finished screen.

## Rendered component reference

Inspect [component-board.png](references/images/component-board.png), the actual browser rendering of the editable primitives. This is a component reference; compose the requested screens independently.
