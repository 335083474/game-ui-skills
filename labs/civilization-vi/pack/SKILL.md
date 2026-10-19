---
name: civilization-vi-ui
description: Create cartographic strategy interfaces with illustrated hex terrain, navy-and-gold controls, resource medallions, and prerequisite-linked research nodes. Targets Civilization VI, not Civilization VII.
---

# Civilization VI UI reference

Use this package to create original Web interfaces informed by Civilization VI's map-table and grand-strategy direction. It is an experimental reference, not an official Firaxis asset kit or exact UI reconstruction.

Read [visual-rules.md](references/visual-rules.md), [tokens.json](references/tokens.json), and the relevant [screen pattern](references/screen-patterns.md). Inspect [style-board.svg](references/images/style-board.svg) and [editable specimens](assets/components/index.html). These are visual and component references, not finished application screens.

Keep the map and its hex topology prominent. Pair painterly terrain miniatures with a clean navy/blue-and-gold control language, readable resource medallions, crisp labels, and branching research nodes. The map is the spatial source of truth; the surrounding control surfaces explain selection and consequences. Do not substitute Potion Craft's meandering ingredient route, a parchment notebook, fantasy filigree, or a generic dashboard.

Reuse the included original terrain-and-symbol atlas through the crop classes in [theme.css](assets/components/theme.css). The suggested screens are Technology Tree, City Production, and Diplomatic Trade. Preserve one turn's synthetic research, queue, treasury, and diplomacy state across them. Prerequisites, queue order, and trade resources must respond to explicit actions.

No font is copied. The game listing and fixed boundary are documented in [sources.md](references/sources.md); the generated-art prompt and crop map are in [asset-map.json](references/asset-map.json).

## Rendered component reference

Inspect [component-board.png](references/images/component-board.png), the actual browser rendering of the editable primitives. This is a component reference; compose the requested screens independently.
