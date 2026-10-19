---
name: dont-starve-ui
description: Create original browser-game interfaces using Don’t Starve’s 荒诞钢笔 direction. Use for workbench, field pack, nightfall hud studies; this is an independent reference package, not official game UI.
---

# Don’t Starve UI reference

Use this experimental package to create original browser-game interfaces informed by **Don’t Starve**. Target edition or direction: 2013 single-player original direction / not Together. The sample data and artwork are an authored interpretation, not a claim of frame-accurate recreation.

Read the [visual rules](references/visual-rules.md), [screen patterns](references/screen-patterns.md), [local tokens](assets/tokens.css), and [source notes](references/sources.md) before composing a new screen. The [editable component specimen](assets/components/index.html) demonstrates the approved screen patterns and local selection states. Reuse its original [character illustration](assets/art/hero-illustration.svg) and [icon atlas](assets/art/icons.svg) where they fit; recompose the requested interface for its actual player task.

Keep the art direction distinct: A crooked survival notebook drawn in dry ink on weathered paper. Keep text readable, show interaction states with both labels and shape, preserve visible keyboard focus, and adapt to a 390px viewport. The examples use local system font stacks and have no runtime network dependencies.

The product source and interpretation boundary are documented in [sources.md](references/sources.md). Do not present this package as official game art, a game-engine export, an exact recreation, a current live-build specification, or measured search-demand evidence.

## Rendered component reference

Inspect [component-board.png](references/images/component-board.png), the actual browser rendering of the editable primitives. This is a component reference; compose the requested screens independently.
