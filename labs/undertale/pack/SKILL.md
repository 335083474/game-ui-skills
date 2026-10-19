---
name: undertale-ui
description: Create original monochrome pixel-RPG interfaces with square white frames, terse command choices, a small heart-shaped pointer, item lists, and readable dialogue. Use for the 2015 original's menu hypothesis, not Deltarune or a generic pixel HUD.
---

# Monochrome command-box interface reference

Use the selected **Undertale (2015 original)** direction for original battle-command, inventory, and dialogue surfaces. This experimental package captures a UI hypothesis; it is not an official Toby Fox asset pack or pixel-exact reconstruction.

Read [visual-rules.md](references/visual-rules.md), [tokens.json](references/tokens.json), and the relevant pattern in [screen-patterns.md](references/screen-patterns.md). Inspect the code-native [style-reference.svg](references/images/style-reference.svg) and editable primitives in [components/index.html](assets/components/index.html). They show the command-box and frame grammar, not finished target screens.

Keep the playfield mostly empty and black. Use square white outlines, crisp monospace text, a small heart pointer, and a small number of word-led choices. Command, item, and dialogue surfaces should share one line weight and left alignment. State changes come from selection, confirm, and cancel; an open list does not spend an item. Use a stable text / numeric status where necessary. Avoid gradients, glossy panels, decorative HUD clutter, rounded cards, and color-heavy rarity systems.

Use [battle commands](references/screen-patterns.md#battle-commands), [items](references/screen-patterns.md#items), and [dialogue](references/screen-patterns.md#dialogue) for the three composition contracts. Write new labels and dialogue; do not copy characters, monsters, text, fonts, screenshots, logos, or music cues. Keep the original edition boundary distinct from Deltarune. See [sources.md](references/sources.md) for scope and market limits.

Use [USAGE.md](USAGE.md) for a copy-ready prompt. The package contains only authored HTML / CSS / SVG and system fonts; it works offline. Keep finished screen layouts and browser evidence outside this frozen package.

## Rendered component reference

Inspect [component-board.png](references/images/component-board.png), the actual browser rendering of the editable primitives. This is a component reference; compose the requested screens independently.
