---
name: borderlands-2-ui
description: Create original cel-shaded looter-shooter interfaces with inked weapon catalogues, angled plates, rarity signals, and stat comparisons. Use for Borderlands 2-era inventory grammar, not generic comic HUDs.
---

# Cel-shaded loot catalogue reference

Use the selected **Borderlands 2 (2012)** direction for original weapon, inventory, and skill-tree screens. This is an experimental style interpretation, not an official Gearbox / 2K pack or pixel-exact recreation.

Read [visual-rules.md](references/visual-rules.md), [tokens.json](references/tokens.json), and the requested pattern in [screen-patterns.md](references/screen-patterns.md). The local, original weapon atlas in [comic-weapons.png](assets/comic-weapons.png) and controls in [components/index.html](assets/components/index.html) show the intended ink / stat grammar. The specimen board is not a finished screen.

Make the style structural: heavy black contours, clipped or slanted plate edges, rough hatch and halftone accents, short inventory labels, and dense aligned comparisons. Rarity is a named tier plus color and shape. Weapons lead with a distinct silhouette, then level / power / element, then readable stat deltas. A comparison must make the equipped and candidate item easy to tell apart. A skill tree uses connected nodes and point costs, not an icon menu.

For [weapon comparison](references/screen-patterns.md#weapon-comparison), [inventory](references/screen-patterns.md#inventory), and [skill tree](references/screen-patterns.md#skill-tree), use coherent invented gear and a shared synthetic character state. Keep important numbers in text and show positive / negative stat direction with symbols or labels in addition to color. Do not copy any branded weapon, character, logo, screenshot, or game text. Review [sources.md](references/sources.md) for scope and keyword limits.

Use [USAGE.md](USAGE.md) for a copy-ready prompt. No font files or external assets are required; finished screens and evidence belong outside this package.

## Rendered component reference

Inspect [component-board.png](references/images/component-board.png), the actual browser rendering of the editable primitives. This is a component reference; compose the requested screens independently.
