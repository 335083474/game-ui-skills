---
name: potion-craft-ui
description: Build hand-illustrated alchemy interfaces with parchment route maps, botanical ingredients, corked bottle studies, and ledger-like trade rows. Targets the 2022 Potion Craft release direction.
---

# Potion Craft UI reference

Create original Web interfaces using this package's 2022 Potion Craft-inspired hand-drawn workshop grammar. It is an experimental style reference, not an official asset pack or exact reconstruction.

Read [visual-rules.md](references/visual-rules.md), [tokens.json](references/tokens.json), and the requested [screen pattern](references/screen-patterns.md). Inspect [style-board.svg](references/images/style-board.svg) and the [editable specimens](assets/components/index.html) before composing screens. They are references and primitives, not completed application layouts.

The defining surface is cream parchment with inked boundaries, route-map geometry, ingredient silhouettes, and distinct colored potion glass. Keep text like a shopkeeper's book: serif headings, compact readable body copy, ruled entries, and occasional hand-written emphasis. The map is a playable diagram with a path and effect nodes; it is not a generic parchment background behind a dashboard. Avoid pixel wood frames, UI pills, glossy fantasy icons, and dense metallic steampunk trim.

Use the included original transparent art atlas through the CSS crop classes in [theme.css](assets/components/theme.css). Reuse its blank scroll and bottle assets rather than redrawing the same role. Keep the three screens on a shared synthetic inventory: Alchemy Map, Recipe Ledger, and Trade Counter. Path selection previews ingredient cost and potion outcome; recipe saving uses named recipes; sales update coin and stock counts.

No font is copied. Use the tokenized system serif fallback and never claim it matches the game font. Synthetic ingredients, effects, names, and prices are examples only. Sources and the 2022 edition boundary are in [sources.md](references/sources.md), with generated-art provenance in [asset-map.json](references/asset-map.json).

## Rendered component reference

Inspect [component-board.png](references/images/component-board.png), the actual browser rendering of the editable primitives. This board is a component reference; compose the requested screens independently.
