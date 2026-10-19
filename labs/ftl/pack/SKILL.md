---
name: ftl-ui
description: Create compact spaceship-management interfaces with flat room schematics, square system blocks, segmented reactor power, readable crew chips, and amber/red danger states. Targets FTL Advanced Edition.
---

# FTL: Faster Than Light UI reference

Use this experimental package to create original Web interfaces informed by FTL's Advanced Edition spaceship-management grammar. It is not a Subset Games asset pack, pixel-perfect remake, or ship blueprint from the game.

Read [visual-rules.md](references/visual-rules.md), [tokens.json](references/tokens.json), and the requested [screen pattern](references/screen-patterns.md). Inspect [style-board.svg](references/images/style-board.svg) and the editable [component specimens](assets/components/index.html). The board shows a ship-room diagram and modular controls only; compose the requested screens independently.

The identity comes from a top-down ship schematic, square rooms, small door links, crew tokens, hard-edged system panels, and energy split into individual pips. Keep surfaces matte and compact. Use green for powered/ready, amber for low reserve or warning, and red for active danger, always paired with text or an icon. Do not add cyan holograms, bevel-heavy sci-fi panels, large decorative planet scenes, or a generic grid dashboard.

Reuse [ship-plan.svg](assets/art/ship-plan.svg) for the room/corridor primitive and copy the CSS pips or system controls from [theme.css](assets/components/theme.css). Keep the three screens connected: Ship Upgrade, Sector Shop, and Crew & Room HUD. Spend scrap only after explicit confirmation; power assignments and crew location update shared state.

The target direction is Advanced Edition, which the official listing says is included with the game. Synthetic ship, crew, and costs are examples only. See [sources.md](references/sources.md) and [asset-map.json](references/asset-map.json).

## Rendered component reference

Inspect [component-board.png](references/images/component-board.png), the actual browser rendering of the editable primitives. This is a component reference; compose the requested screens independently.
