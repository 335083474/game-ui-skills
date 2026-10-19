---
name: gris-ui
description: Create original narrative interfaces with watercolor bleed, architectural linework, negative space, and restrained color progression. Use for chapter, memory, and pause surfaces; avoid copying GRIS's heroine or scenes.
---

# Watercolor narrative game UI

This package studies a quiet watercolor-and-architecture direction associated with GRIS (2018 original). It is an unofficial reference for original game interfaces, not a reconstruction or an official asset pack.

## Read before designing

1. Read [visual rules](references/visual-rules.md), [tokens](references/tokens.json), and the relevant [screen patterns](references/screen-patterns.md).
2. Inspect the original watercolor architecture plate at [reference-atmosphere.png](assets/reference-atmosphere.png). It contains no heroine or copied scene. Use it for paper, pigment, and negative-space cues; keep functional text on its own calm surface.
3. Compose from the editable [component specimens](assets/components/index.html) and [theme.css](assets/components/theme.css). They are primitives, not finished game screens.
4. Treat [demo-state.json](references/demo-state.json) as invented fixture data. Check [local asset map](references/local-asset-map.md) and [sources](references/sources.md) for version and provenance boundaries.

## Direction and behavior

Let architecture, open paper, and gradual pigment carry atmosphere. Keep the live playfield visible. A chapter preview remains separate from entering that chapter; reading a memory is a view action and must not invent a new collectible. Pause is a short interruption, not a settings dashboard.

Use the target project's real state and controls when supplied. Keep status understandable in words and shape as well as color. Provide semantic keyboard controls, stable focus order, visible focus, and clear feedback. At narrow widths, preserve the chapter path and stack details without covering the central scene.

Use local or system fonts and bundled local assets only. Respect reduced motion by stopping pigment drift and non-essential fades. Do not fabricate official UI details, SEO demand, game data, persistent saves, or engine exports from this visual study.


## Rendered component reference

Inspect [component-board.png](references/images/component-board.png), the actual browser rendering of the editable primitives. This is a component reference; compose the requested screens independently.
