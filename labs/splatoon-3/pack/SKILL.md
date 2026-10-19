---
name: splatoon-3-ui
description: Create punchy street-ink game menus with tilted sticker labels, halftone bursts, vivid paint fields, and compact gear or match-result modules. Targets Splatoon 3's base Switch game direction.
---

# Splatoon 3 UI reference

Use this experimental package to create original interfaces informed by the base Splatoon 3 game's high-energy ink-and-sticker language. It is not a Nintendo asset pack or a reproduction of the game's screens.

Read [visual-rules.md](references/visual-rules.md), [tokens.json](references/tokens.json), and the requested [screen patterns](references/screen-patterns.md). Inspect [style-board.svg](references/images/style-board.svg) and the isolated [editable primitives](assets/components/index.html). These show component grammar only; compose each requested screen separately.

The visual system is built from overlapping paint swipes, torn stickers, stamped labels, thick dark contours, halftone texture, and slanted display type. Use cyan, acid lime, and coral as rotating team or action colors; preserve readable contrast and never encode team meaning by color alone. Keep the surface lively but leave clear blank paper around text. Avoid Persona 5's strict red-black editorial grid, generic rounded cards, full-screen gradients, squid characters, and any Nintendo logo or official game asset.

Reuse the local transparent atlas through the crop classes in [theme.css](assets/components/theme.css). Match the shared synthetic state across Weapon Kit, Catalog Shop, and Match Results. Equipment selection updates kit labels, purchase decrements currency once, and results show turf/control values as numbers plus a distinct medal or label.

No font is copied. The system condensed sans fallback is an approximation. Generated art is original and contains no characters or logos; provenance and boundaries are in [asset-map.json](references/asset-map.json) and [sources.md](references/sources.md).

## Rendered component reference

Inspect [component-board.png](references/images/component-board.png), the actual browser rendering of the editable primitives. This is a component reference; compose the requested screens independently.
