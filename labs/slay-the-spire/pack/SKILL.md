---
name: slay-the-spire-ui
description: Create Slay the Spire-inspired Web game interfaces from bundled dungeon references, painted item art, editable components and serif typography. Use for reward, inventory and shop flows when this visual direction is requested.
metadata:
  version: "1.0.0"
---

# Slay the Spire UI

Build an unofficial, reference-driven dungeon interface: worn gold, blue-black stone, warm parchment, painted objects and deep red actions. The studies and item art are generated interpretations, not official game assets.

## Look before building

1. Read [visual rules](references/style-rules.md) and [tokens](assets/tokens.json).
2. Visually inspect both [reward reference](references/images/reward-direction.png) and [component reference](references/images/component-direction.png). The first establishes dungeon atmosphere and choice hierarchy; the second establishes worn material, item framing and the deep red action. Neither is a background for functional controls.
3. Open [editable component specimens](assets/components/index.html), inspect [their CSS](assets/components/theme.css), and compare the [component board](references/images/component-board.png) when available. These are isolated primitives, not completed screen templates.
4. Inspect [the item atlas](assets/items-atlas.png) and read [asset mapping and provenance](references/asset-map.md). Use the actual shared sprites for the same items across every screen.

If images cannot be inspected, report that limitation and describe the result as text-guided. Do not claim visual verification from token matching alone.

## Compose the requested interface

Use the user's stack and content. With no requested stack, make an offline HTML/CSS/JS prototype. Copy the needed CSS, atlas, textures and fonts into its output, retaining relative resource paths and font licenses. Keep all labels, quantities, prices, descriptions and buttons as editable DOM text.

- Treat stone, metal and parchment as distinct layers. Preserve the jagged gold corners, matte dark recesses, readable paper and restrained warm selection light. Use painted atlas art with smooth resampling; do not pixelate it.
- Apply the shared serif hierarchy and material system to new compositions. Read [screen patterns and state contracts](references/screen-patterns.md) before making rewards, inventory or shops. Those pages require different layouts; do not repeat a three-card reward layout everywhere.
- Reuse `.sui-*` primitives where useful. The [usage guide](references/usage.md) explains what to copy and how to add editable content. CSS classes are a starting vocabulary, not a requirement to override an existing application's architecture.
- Keep selection, confirmation, owned quantity, HP, stock and currency in explicit data. A selected item must have a visible label or check as well as a gold edge. Explain disabled actions. Use native buttons and visible keyboard focus.
- When an interactive prototype is requested, implement actual state changes: a reward can be claimed once, potion use consumes one and caps HP, and purchases charge game currency, increase inventory, decrement stock and handle insufficient funds. Keep game currency visibly fictional.
- Generate new object art only when needed and with an available image tool, using the bundled atlas as the material reference. Background stone and firelight can be code-drawn. Do not rasterize functional text or use the full study as the UI.

## Verify and deliver

Use [acceptance checks](references/consistency-checks.md). Render and compare related screens together at the same viewport, then test meaningful state transitions. Record actual observations, remaining visual drift and any untested behavior. Deliver editable code, local assets, previews and a concise verification note.

This package provides Web specimens and a workflow. It does not provide verified Unity, Godot, Unreal or Figma exports. Generated studies are unofficial reference art; this package does not establish commercial rights clearance for a finished product. Keep the included SIL OFL notices with the unmodified fonts.
