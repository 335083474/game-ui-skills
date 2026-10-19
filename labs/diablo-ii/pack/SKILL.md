---
name: diablo-ii-ui
description: Build dense classic Diablo II inspired game menus with carved gothic frames, equipment grids, skill prerequisites and merchant transactions. Use for original late-1990s PC dark-fantasy UI direction, not Diablo III or IV.
---

# Diablo II classic UI

Create editable, original interfaces in the visual language of the original Diablo II PC menus. This experimental reference package supplies visual decisions and components; it is not an official asset pack or a game engine integration.

Read [style rules](references/style-rules.md), [tokens](assets/tokens.json), and inspect [screen direction](references/images/screen-direction.png) before laying out a screen. Treat that generated image as material, mood and anatomy guidance. Exact geometry, readable text and real behavior come from the rules and editable specimens, not baked image pixels. Its decorative empty area is not a required layout zone.

Open [the component specimens](assets/components/index.html) locally, or read their [CSS](assets/components/theme.css). They demonstrate components rather than finished equipment, skill or trade screens. A screenshot of this board is supplied at `references/images/component-board.png` during package integration; the HTML is authoritative and usable without the screenshot.

For equipment, skills or merchant work, use the relevant section of [screen and state patterns](references/screen-patterns.md). Keep one shared inventory, gold, equipment and skill model across related screens. Use semantic controls, readable feedback and keyboard access while preserving square dense game anatomy.

Use the supplied [item atlas and font map](references/asset-map.md); copy consumed assets into the deliverable with relative paths so it works offline. Slots and item footprints have different geometry: a sword can occupy 1 × 3 backpack cells while its sprite is one square atlas cell. Never stretch or tile the sword to fill three cells. Do not request or invent additional official game artwork.

Before delivery, run [consistency checks](references/consistency-checks.md). Report actual runnable checks and remaining limitations. Keep new finished screens and their test evidence outside this package. Read [usage and installation](references/usage.md) for offline handoff, and [sources](references/sources.md) for the distinction between official evidence and original generated interpretation.
