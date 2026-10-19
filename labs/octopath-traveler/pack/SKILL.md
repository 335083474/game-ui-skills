---
name: octopath-traveler-ui
description: Create original HD-2D role-playing game interfaces that combine crisp pixel-party silhouettes with a layered, lit 3D battle stage. Use for party, equipment, and battle-order surfaces; avoid copying named travelers or exact UI.
---

# HD-2D party game UI

This package studies the broad HD-2D visual technique associated with the original OCTOPATH TRAVELER (2019 PC version): pixel characters staged against dimensional environments with layered light. It is an unofficial reference, not a game UI recreation or official asset pack.

## Read before designing

1. Read [visual rules](references/visual-rules.md), [tokens](references/tokens.json), and the requested [screen patterns](references/screen-patterns.md).
2. Inspect [reference-atmosphere.png](assets/reference-atmosphere.png). It is an original stagediorama with newly invented travelers, not official character art.
3. Inspect the editable [component specimens](assets/components/index.html) and [theme.css](assets/components/theme.css). The wide battle stage composes turn order, actors, and commands in one scene; party and equipment fragments support that stage.
4. Use [synthetic demo state](references/demo-state.json), [local asset map](references/local-asset-map.md), and [sources](references/sources.md) to keep example data and version boundaries clear.

## Direction and behavior

Combine crisp, block-edged pixel figures with layered 3D scenery, warm practical lights, and depth in the background. Keep the active battle space integrated: put the turn strip and compact action command near the stage edge, leaving the center visible. Party selection and equipment details belong on their own surfaces or concise overlays, not in an unrelated list beside a decorative scene.

Selection is a preview. Applying equipment or confirming a battle command is a separate, named action. Use the target project's real party and battle state when supplied; otherwise mark invented names, stats, and outcomes as synthetic. Preserve a stable keyboard path, visible focus, descriptive state labels, and touch targets. Stack the battle controls cleanly on small screens without covering the active actors.

Use local or system fonts only. Pixel texture must not make text blurry. Respect reduced motion by stopping floating particles and decorative transitions. Do not use smooth painterly figures or flat full-scene GBA-style pixel art as a substitute for the layered HD-2D mix. Do not claim persistent saves, game-engine exports, SEO demand, or official assets from this package.


## Rendered component reference

Inspect [component-board.png](references/images/component-board.png), the actual browser rendering of the editable primitives. This is a component reference; compose the requested screens independently.
