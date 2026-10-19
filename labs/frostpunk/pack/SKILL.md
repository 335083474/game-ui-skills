---
name: frostpunk-ui
description: Create severe city-survival interfaces with coal-dark panels, frost-pale type, temperature gauges, pressure marks, and formal decree or technology slips. Targets the 2018 first game, not Frostpunk 2.
---

# Frostpunk UI reference

Use this experimental package to create original interfaces informed by Frostpunk 1's 2018 city-survival direction. It is not an 11 bit studios asset pack or a reconstruction of exact game screens.

Read [visual-rules.md](references/visual-rules.md), [tokens.json](references/tokens.json), and the pattern for each requested [screen](references/screen-patterns.md). Inspect [style-board.svg](references/images/style-board.svg) and the isolated [editable specimens](assets/components/index.html). The visual board is a component grammar reference, not a ready-made screen.

Build from cold chalk, soot charcoal, steel, and a small hazard-amber signal. The main motifs are a circular temperature instrument, heavy industrial separators, formal ordinance sheets, and slender resource readouts. Snow and steam are environmental image accents; they should not turn every module into a scenic card. Do not use brass Art Deco fan rays, cozy wood frames, glossy glass panels, or a glowing generic steampunk cockpit.

Reuse the included original transparent atlas for generator, houses, fuel, gauge, paper, and frozen-city objects. Keep the state coherent across Book of Laws, Technology Tree, and City Resource HUD. Numeric resource changes and temperature thresholds must be explicit; rule consequences are shown before a law is enacted.

No font is copied and the CSS fallback is a practical substitute only. Art and city resources are original demo material. Edition limits and source scope are in [sources.md](references/sources.md); the full generation prompt is in [asset-map.json](references/asset-map.json).

## Rendered component reference

Inspect [component-board.png](references/images/component-board.png), the actual browser rendering of the editable primitives. This is a component reference; compose the requested screens independently.
