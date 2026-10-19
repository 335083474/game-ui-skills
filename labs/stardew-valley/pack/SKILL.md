---
name: stardew-valley-ui
description: Create warm pastoral pixel game interfaces from bundled Stardew Valley inspired references, wood-and-paper components, item sprites and shared tokens. Use when this farm-game visual direction is requested for rewards, inventories, shops or related Web screens.
metadata:
  version: "1.0.0"
---

# Stardew Valley UI

Build a coherent, warm farm-game interface with sunlit cream paper, substantial wooden frames, amber controls and crisp pixel items. This is an unofficial reference package. Its generated studies and items are interpretations, not official screenshots or extracted assets. Validation covers Web output only.

## Start with the evidence

1. Read [visual rules](references/style-rules.md) and [tokens](assets/tokens.json).
2. Actually view [reward direction](references/images/reward-direction.png) and [component direction](references/images/component-direction.png). The first establishes framing, paper hierarchy and selected amber edges; the second establishes item slots, count placement, wood joinery and pastoral scenery.
3. Open [editable component specimens](assets/components/index.html) and read [their CSS](assets/components/theme.css). Compare with the [rendered component board](references/images/component-board.png) when available. These are primitives, not finished reward, inventory or shop pages.
4. Inspect [the item atlas](assets/items-atlas.png) and read [its map and provenance](references/asset-map.md).

If image inspection is unavailable, disclose that the result is guided by written rules and has not been visually checked. Do not describe unseen references as reviewed.

## Compose the requested interface

Use the user's existing Web stack. Otherwise deliver an offline HTML/CSS/JS prototype with local assets, editable text and working controls. Copy the needed runtime files into the result and preserve relative paths. Read [screen patterns](references/screen-patterns.md) for behavior and distinct composition: reward selection, inventory management and shopping must not all become the same three-card layout.

- Carry the same wood layers, cream paper, dark brown ink, amber action, green supporting accent, inset slots and square pixel edges between screens.
- Separate scenery, panel, illustration, text, quantities and controls. Never use a whole reference image as a functional background or bake editable labels into art.
- Use `svui-icon` and its fixed sprite classes for the six supplied items. Do not show the entire atlas in an item slot. Additional items need matching pixel density and outline treatment.
- Keep state in data. Selected means both a visible border and a text/check marker. Disabled controls explain the reason. Keyboard focus remains visible.
- For an interactive screen family, implement real one-time reward claiming, potion quantity consumption with a maximum HP cap, and purchases using fictional in-game coins with price, stock and insufficient-balance states. Match the user's game rules when supplied; otherwise state the demo defaults.
- Farming tools may show quantities and explain intended use. Do not imply that watering, planting or harvesting works unless those systems are implemented and tested.
- Retain full quantities and prices as DOM text. Pixelify Sans covers Latin; Chinese uses the declared system fallback. Do not claim the package includes a Chinese pixel font.

## Verify and hand off

Use [acceptance checks](references/consistency-checks.md). Render at a shared desktop viewport and a narrow viewport, inspect screens side by side, and test the required state transitions. Record what actually passed and any visual or functional limitations. Tokens alone do not prove visual fidelity.

Deliver editable source, local resources, a visible preview and a short verification note. For image-only requests, label the result a visual mockup. This package supplies no game-engine scenes, Figma file, online model, payment service or commercial-rights clearance. See [usage](INSTALL.md) for invocation and local file layout.
