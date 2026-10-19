# Visual rules

## Art direction

A small maker's bench sitting inside a block-built landscape.

## Reusable grammar

- Build every slot and control on a fixed pixel grid. Use crisp edges, square corners, one-pixel outlines, and a small hard offset shadow; avoid rounded app cards and soft glass blur.
- Treat inventory as a spatial matrix: item, count, empty, selected, and unavailable states must remain distinct. Give the selected item a bright double edge and a readable name outside the icon.
- A recipe is a cause-and-effect sentence: ingredients on the left, a single clear arrow, and the resulting block on the right. Show missing ingredients as an explicit state rather than implying the recipe is ready.
- Use block silhouettes and a restrained dirt, grass, stone, wood, and sky palette. Do not cover the world with a wide toolbar; reveal building choices near the action and keep the scene readable.
- At narrow widths, retain recognizable grid geometry and allow horizontal hotbar scrolling. Keep labels and counts in DOM text; do not make pixel-art glyphs the only accessible name.

## Screen patterns

Read [screen-patterns.md](screen-patterns.md) for the three screen contracts. Reuse only the components that serve the requested task.

## Source and accuracy boundary

The product page and original-art boundary are recorded in [sources.md](sources.md). Treat every supplied number, item, route, and status as a synthetic specimen unless a future output has its own authoritative data source.
