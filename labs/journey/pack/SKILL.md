---
name: journey-ui
description: Create original low-interface exploration surfaces with sand-gold light, red woven accents, spare geometry, and scene-led navigation. Use for gates, journey progress, and companion signals; do not copy Journey characters or exact symbols.
---

# Desert journey game UI

This package is an original visual study informed by Journey's 2019 PC edition. It is an unofficial reference for low-UI exploration games, not a reconstruction or an official asset pack.

## Read before designing

1. Read [visual rules](references/visual-rules.md), [tokens](references/tokens.json), and the relevant [screen pattern](references/screen-patterns.md).
2. Inspect the original desert and fabric plate at [reference-atmosphere.png](assets/reference-atmosphere.png). It contains no traveler. Use it for broad light, textile, and architecture cues; do not use source-game artwork or copy a proprietary symbol.
3. Use the [editable component specimens](assets/components/index.html) and [theme.css](assets/components/theme.css) as small reusable fragments, not complete screens.
4. Check [synthetic state](references/demo-state.json), [local asset map](references/local-asset-map.md), and [source boundaries](references/sources.md) before reusing the direction.

## Direction and behavior

Let the desert and open sky carry the experience. Keep persistent UI to a few edge signals. Arrange chapter gates within a scene-based path, progress as named waypoints rather than a dashboard meter, and companion communication as brief expressive signals. A selected gate is a preview until Cross gate is activated. A chosen signal is not sent until Send signal is activated.

Use real target-game state and controls when available. Show progress with labels and shapes as well as color. Keep the central travel view clear, use keyboard-accessible native controls with a stable focus order, and adapt to narrow screens without filling the playfield. Use local/system fonts and local assets only. Respect reduced-motion preferences by stopping fabric drift and other non-essential movement.

Do not invent a shop, map percentage, network connection, collectible record, official symbol set, SEO demand, or engine export. The included labels and states are examples only.


## Rendered component reference

Inspect [component-board.png](references/images/component-board.png), the actual browser rendering of the editable primitives. This is a component reference; compose the requested screens independently.
