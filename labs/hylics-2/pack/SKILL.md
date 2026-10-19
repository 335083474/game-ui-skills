---
name: hylics-2-ui
description: Create original surreal turn-based game interfaces with hand-shaped clay figures, stop-motion irregularity, and psychedelic color inspired by Hylics 2 (2020).
---

# Hylics 2 clay UI reference

Use this reference when an interface needs odd sculptural forms, clay hand marks, off-kilter spacing, and vivid color. The direction is an independent study, not a canonical recreation or source-game asset pack.

Read [visual-rules.md](references/visual-rules.md), [tokens.json](references/tokens.json), and the requested entry in [screen-patterns.md](references/screen-patterns.md). The original [clay plate](references/images/reference-plate.png) is a material and figure cue. Its figures are invented. Do not replace tactile clay with generic smooth 3D gradients.

The approved directions are party, gesture-battle, and curio-bag. Inspect the [component specimens](assets/components/index.html) as separate reusable fragments, not as finished screens. Use the rules to keep party identity, turn choice, and item use distinct.

Selection previews the next state. A “Set active”, “Commit turn”, or “Use item” action is the explicit commit. Make the consequence visible, keep keyboard and pointer behavior equivalent, provide visible focus and text feedback, reflow on narrow screens, and respect reduced motion. The demo changes only local page state.

Edition scope, source evidence, and generated-art provenance are documented in [sources.md](references/sources.md) and [asset-map.json](references/asset-map.json). No canonical character, official font, engine export, external runtime, or search-demand evidence is included.

## Rendered component reference

Inspect [component-board.png](references/images/component-board.png), the actual browser rendering of the editable primitives. This is a component reference; compose the requested screens independently.
