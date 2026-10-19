---
name: patapon-ui
description: Create original browser-game interfaces with bold tribal silhouettes and rhythm command motifs inspired by Patapon Remastered. Use for formation, route, and beat HUD surfaces, not as a character or UI recreation.
---

# Tribal silhouette and rhythm command UI

Use a flat high-contrast symbol language for original squad, expedition, and rhythm surfaces. The example characters, symbols, and state are fictional.

## Read and inspect
- Start with [visual-rules.md](references/visual-rules.md), [tokens.json](references/tokens.json), and the chosen section of [screen-patterns.md](references/screen-patterns.md).
- Inspect the original [generated art plate](assets/illustrations/patapon-art.png); crop it for reference only, not as a full screen.
- Use [component specimens](assets/components/index.html) and [theme.css](assets/components/theme.css) as modular fragments.
- Adapt [demo-state.json](references/demo-state.json) to the product's stable IDs and available state.
- Review the title source and research limits in [sources.md](references/sources.md).

## Essential direction
Build creatures and unit marks from simple geometric silhouettes, circles, cutout holes, and repeated drum forms. Use a bright flat field, bold contour, and clear rhythmic spacing. Never imitate the source game's mascot or exact character forms. Avoid realistic anatomy, feathers, paper texture, fine timing widgets, and sound-only state.

A rhythm HUD needs a visual beat and timing window paired with a text description, keyboard-accessible input, and a success/miss status that remains readable after motion. Offer reduced-motion behavior without losing timing information. Formation and route controls must distinguish selected, locked, and committed state by label and shape.


## Rendered component reference

Inspect [component-board.png](references/images/component-board.png), the actual browser rendering of the editable primitives. This is a component reference; compose the requested screens independently.
