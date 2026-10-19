---
name: paper-mario-ui
description: "Create original browser-game interfaces in the 2024 Paper Mario: The Thousand-Year Door Switch remake's cut-paper theatre direction. Use for menus, inventory, badge folios, or turn-based command surfaces; this is an independent visual study, not official game art."
---

# Paper Mario UI reference

Use this experimental Skill for the fixed target: 2024 Nintendo Switch remake direction. Build from crisp cut-paper layers, confident ink edges, sticker-like badge emblems, and theatre-stage command ribbons. Use clean paper planes and shallow shadows; do not turn the direction into folded origami.

Read [visual rules](references/visual-rules.md), [screen patterns](references/screen-patterns.md), and [tokens](references/tokens.json). Inspect the original [reference board](references/images/reference-board.svg), reusable [local glyphs](assets/art/ui-atlas.svg), and editable [component specimens](assets/components/index.html). The specimen page is a parts board, not a finished screen.

The authored patterns are:

- badges: a paper folio with original emblems, slot cost, and equip preview.
- items: loose cut-paper item slips with quantity and a distinct use action.
- battle-orders: a stage command strip with a selected action, target cue, and supporting audience meter.

Keep selection, preview, and confirmation distinct. Use semantic controls, visible keyboard focus, readable labels, touch targets of at least 44px, and responsive behavior through 390px. Respect reduced-motion settings. Treat unprovided sample data as invented.

The illustrations and components are original local assets. [Sources and boundaries](references/sources.md) records the product context and asset provenance. Do not claim exact game fidelity, engine integration, official artwork, or measured search demand.

## Use this Skill

Give an AI the complete package and name the screen, player task, viewport, content, and required states. Ask it to reuse the visual grammar while composing a new layout, then save the result outside this package. Do not return the component board unchanged as a finished screen.

## Rendered component reference

Inspect [component-board.png](references/images/component-board.png), the actual browser rendering of the editable primitives. This is a component reference; compose the requested screens independently.
