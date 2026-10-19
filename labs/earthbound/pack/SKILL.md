---
name: earthbound-ui
description: "Create original browser-game UI studies in the 1994 EarthBound Super Nintendo direction. Use for goods, party-status, or battle-command surfaces with chunky rounded windows and bright psychedelic surroundings; this is an independent visual reference, not official game art."
---

# EarthBound UI reference

Use this experimental Skill for the fixed target: 1994 Super Nintendo original direction. Place chunky black-and-white rounded windows over a bright, unexpected field. Keep everyday item names concrete, party status readable, and rolling HP visible as a labeled number trail.

Read [visual rules](references/visual-rules.md), [screen patterns](references/screen-patterns.md), and [tokens](references/tokens.json). Inspect the original [reference board](references/images/reference-board.svg), reusable [local glyphs](assets/art/ui-atlas.svg), and editable [component specimens](assets/components/index.html). The specimen page is a parts board, not a finished screen.

The authored patterns are:

- goods: a rounded inventory window with quantities and one selected row.
- party-status: four readable party rows and an explicitly labeled rolling-HP sample.
- battle-commands: a bright battle field behind a stable command window with action and target cues.

Keep sample values labeled as examples. Use semantic controls, visible keyboard focus, readable selected/preview states, touch targets of at least 44px, and responsive behavior through 390px. Respect reduced-motion settings. Local buttons do not run combat or update a save.

The illustrations and components are original local assets. [Sources and boundaries](references/sources.md) records product context and asset provenance. Do not claim exact game fidelity, engine integration, official artwork, or measured search demand.

## Use this Skill

Give an AI the complete package and name the player task, viewport, content, controls, and required states. Ask it to reuse the visual grammar while composing a new layout, then save the result outside this package. Do not return the component board unchanged as a finished screen.

## Rendered component reference

Inspect [component-board.png](references/images/component-board.png), the actual browser rendering of the editable primitives. This is a component reference; compose the requested screens independently.
