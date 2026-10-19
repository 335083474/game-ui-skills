---
name: limbo-ui
description: Create original low-interface game surfaces using a monochrome fog, silhouette, and mechanical-forest direction. Use for pause, chapter, and contextual-hint interfaces; avoid copying LIMBO characters or exact scenes.
---

# Monochrome liminal game UI

This self-contained reference studies the visual restraint associated with LIMBO (2010 original). It is an unofficial direction for original game interfaces, not a recreation or an official asset pack.

## Read before designing

1. Read [visual rules](references/visual-rules.md), [tokens](references/tokens.json), and the patterns for the requested [screen type](references/screen-patterns.md).
2. Inspect the original atmosphere plate at [reference-atmosphere.png](assets/reference-atmosphere.png). It is generated scenery without the boy or a copied game scene. Treat it as a material and mood reference; do not place a full image underneath functional text.
3. Use the editable [component specimens](assets/components/index.html) and [theme.css](assets/components/theme.css) as small primitives, not finished screens.
4. Check [synthetic demo state](references/demo-state.json), [local asset map](references/local-asset-map.md), and [source boundaries](references/sources.md).

## Direction and behavior

Keep the play scene visible. Use a quiet pause veil, a narrow chapter path, or one transient context hint. Use smoke-gray rules and backings only where text needs contrast. A hint disappears after dismissal; chapter selection is only a preview until the player confirms starting at that checkpoint. Resume and other state-changing actions must be explicit.

Build from the user's engine and content when supplied. Keep labels, values, and state in real controls and data. Native buttons must work with pointer and keyboard input, expose selection with text or shape as well as tone, and show a visible focus ring. Size touch targets for mobile. At narrow widths, stack or shorten the surface without covering the central play view.

Use local or system fonts and local assets. Respect reduced-motion preferences by removing fog drift, flicker, and non-essential transitions. Do not invent a shop, inventory, full-screen dashboard, story character, or game-engine export unless the request calls for it. Do not claim keyword demand, engine integration, or persistent saves from this reference package.


## Rendered component reference

Inspect [component-board.png](references/images/component-board.png), the actual browser rendering of the editable primitives. This is a component reference; compose the requested screens independently.
