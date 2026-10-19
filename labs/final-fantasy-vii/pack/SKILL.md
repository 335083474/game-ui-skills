---
name: final-fantasy-vii-ui
description: Build original Final Fantasy VII inspired blue menu interfaces with compact party resources, equipment comparisons, and nested battle commands. Use for classic 1997/PC menu direction, not Remake or Rebirth interfaces.
---

# Original FFVII menu reference skill

Create new interfaces using the original game's blue-window grammar. This is an experimental reference package: generated art, editable Web primitives, rules and sample state contracts. It is not an official Square Enix asset pack or a pixel-exact game reconstruction.

## Read and inspect

1. Read [visual-rules.md](references/visual-rules.md) and [tokens.json](references/tokens.json).
2. Inspect [screen-direction.png](references/images/screen-direction.png) for window relationships and [assets/components/index.html](assets/components/index.html) for editable primitive anatomy. If present, [component-board.png](references/images/component-board.png) is a browser capture of those primitives. The direction image is a generated interpretation; its names, costs and numbers are not authoritative.
3. Read the relevant [screen-patterns.md](references/screen-patterns.md) sections and [asset-map.json](references/asset-map.json). Reuse the atlas and local font across screens.
4. For evidence and edition boundaries, see [sources.md](references/sources.md). The original menu is the target even though the current Steam listing describes an upgraded port. Do not borrow the Remake's charcoal/teal modern UI.

## Essential decisions

- Use opaque deep-blue corner gradients with thin double silver/white beveled frames and at most a 3px corner radius. Keep the density of a console menu, with a small crisp sans font and aligned numeric columns.
- A small white triangle or hand-shaped cursor carries selection. Keep the selected row blue; do not replace it with a large colored card or pill.
- Portraits stay compact and at the left edge of party rows. Numbers remain readable and are the source of truth for HP/MP. Resource bars are thin, never dashboard-sized.
- Build list-and-window layouts: wide party block beside narrow commands; dense equipment slots beside comparison lists; battle status and commands anchored near the bottom of a quiet arena. Avoid using the generated direction sheet as a flat background.
- The sample characters and statistics are original demonstration data. Equipment, items, MP and target selection must produce observable state changes. Use the contracts as a coherent baseline, adapting to the user's requested behavior.
- Keep critical interaction available by keyboard and pointer. Supply text names for portraits, numeric resource values and a non-color indication of stat changes. Preserve readable type on narrow displays by stacking windows.

## Implement and check

Use [theme.css](assets/components/theme.css) as a starting primitive layer, adjusting relative font/atlas paths when copied. The component HTML is an isolated specimen board, not a finished party/equipment/battle app. Compose screens independently for the actual request; do not turn the board into the application shell.

Run the visual and behavior checks in [consistency-checks.md](references/consistency-checks.md). Capture the implementation in a browser before claiming visual verification. Keep screenshots and usage-test outputs outside the frozen skill inputs.

Installation and invocation examples are in [USAGE.md](USAGE.md). No network or external service is required to use the packaged assets.
