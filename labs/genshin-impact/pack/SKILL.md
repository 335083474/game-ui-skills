---
name: genshin-impact-ui
description: Create original browser-game interfaces using Genshin Impact’s 清雅幻想 direction. Use for traveler profile, equipment, travel journal studies; this is an independent reference package, not official game UI.
---

# Genshin Impact UI reference

Use this experimental package to create original browser-game interfaces informed by **Genshin Impact**. Target edition or direction: early Mondstadt-era character/equipment direction / no current live-build claim. The sample data and artwork are an authored interpretation, not a claim of frame-accurate recreation.

Read the [visual rules](references/visual-rules.md), [screen patterns](references/screen-patterns.md), [local tokens](assets/tokens.css), and [source notes](references/sources.md) before composing a new screen. The [editable component specimen](assets/components/index.html) demonstrates the approved screen patterns and local selection states. Reuse its original [character illustration](assets/art/hero-illustration.svg) and [icon atlas](assets/art/icons.svg) where they fit; recompose the requested interface for its actual player task.

Keep the art direction distinct: A quiet celestial grammar in navy, cream, and fine gold, with room for character art. Keep text readable, show interaction states with both labels and shape, preserve visible keyboard focus, and adapt to a 390px viewport. The examples use local system font stacks and have no runtime network dependencies.

The product source and interpretation boundary are documented in [sources.md](references/sources.md). Do not present this package as official game art, a game-engine export, an exact recreation, a current live-build specification, or measured search-demand evidence.

## Rendered component reference

Inspect [component-board.png](references/images/component-board.png), the actual browser rendering of the editable primitives. This is a component reference; compose the requested screens independently.
