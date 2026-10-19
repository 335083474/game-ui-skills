---
name: bioshock-ui
description: "Design original interfaces using the first BioShock's 2007 Art Deco grammar: stepped brass frames, radial geometry, enamel labels, and industrial vending controls. Excludes Infinite's art direction."
---

# BioShock UI reference

Use this experimental reference package to create original Web interfaces informed by the 2007 first BioShock's Art Deco and industrial signage direction. It is not an official 2K asset pack or a screen-accurate reconstruction.

Read [visual-rules.md](references/visual-rules.md), [tokens.json](references/tokens.json), and each requested [screen pattern](references/screen-patterns.md). Inspect [style-board.svg](references/images/style-board.svg) and the isolated [editable components](assets/components/index.html). Build requested screens from these primitives; do not use the style board as a finished interface.

The signature is geometric precision: stepped corners, mirrored brass linework, fan rays, dark enamel, and narrow machine labels. The frame should feel manufactured and symmetrical. Use warm brass sparingly over deep marine charcoal, with aged ivory for text. Do not substitute generic steampunk gears, grungy pipe wallpaper, green glass panels, or BioShock Infinite's brighter carnival vocabulary.

Reuse the original transparent object atlas through [theme.css](assets/components/theme.css). The synthetic screens are Tonic Vending, Plasmid Upgrade, and Hacking Relay. Every purchase or upgrade needs an explicit resource cost, preview, and committed state; hacking failure must have a reversible reset.

No font is copied. CSS uses local system serif/sans fallbacks. Generated images are original studies, not extracted game assets. See [sources.md](references/sources.md) for the exact edition boundary and [asset-map.json](references/asset-map.json) for provenance.

## Rendered component reference

Inspect [component-board.png](references/images/component-board.png), the actual browser rendering of the editable primitives. This is a component reference; compose the requested screens independently.
