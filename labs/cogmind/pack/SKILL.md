---
name: cogmind-ui
description: Build sci-fi roguelike interfaces with real text glyph maps, equipment schematics, compact event logs, and explicit keyboard controls. Use when a user requests a Cogmind-inspired ASCII or terminal-style interface; keep all values and layouts labeled as original study material.
---

# Cogmind ASCII interface reference

Use this experimental reference for original interfaces informed by *Cogmind*'s ASCII-forward, component-built sci-fi roguelike presentation. It is not an official asset pack or an exact reconstruction of any pinned build.

Read [visual rules](references/visual-rules.md), [screen patterns](references/screen-patterns.md), and [sources and limits](references/sources.md). The editable component plate is [assets/components/index.html](assets/components/index.html); its map, slot rows, and log are reusable specimens, not a full game screen.

Render map and equipment marks as actual text glyphs in a monospace layout. Preserve deliberate spacing and glyph contrast. Show keyboard commands next to the surface they control, and give focused rows and the selected map cell a visible state. Use green as the working signal, amber for active selection or warning, and a small cool cyan for machine or data cues.

All maps, equipment, status values, and log events in this package are invented examples. The local SVG is an original typographic study, not a screenshot. No official game art, game font, copied item art, or exact interface dimensions are included.

Use [USAGE.md](USAGE.md) to prompt a downstream screen implementation. Keep exploration, loadout, and event review as distinct tasks that share the same terminal vocabulary.


## Rendered component reference

Inspect [component-board.png](references/images/component-board.png), the actual browser rendering of the editable primitives. This is a component reference; compose the requested screens independently.
