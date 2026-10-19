---
name: cyberpunk-2077-ui
description: Create original browser-game interfaces using Cyberpunk 2077's neon cyber-interface visual language. Use for matching menus, overlays, HUD fragments, or game-management screens; this is an independent reference study, not official game art.
---

# Cyberpunk 2077 UI reference

Use this self-contained experimental Skill to create new interfaces in the visual direction of **Cyberpunk 2077**. Scope: PC 2.0-era interface direction / original study. The intended feel is street-grade diagnostics: precise, compressed, and slightly unstable at the edges.

Read [visual-rules.md](references/visual-rules.md), [tokens.json](references/tokens.json), and the requested section of [screen-patterns.md](references/screen-patterns.md). Inspect the original [style reference](references/images/style-reference.svg), [local scene art](assets/art/scene.svg), and [editable component specimens](assets/components/index.html). Reuse their geometry and state cues, then compose a new layout for the player's task; the specimen page is a parts board, not a finished screen.

The three authored screen patterns are `cyberware`, `mission-journal`, and `district-map`. Keep the core visual grammar from the rules while adjusting information density to the screen's actual purpose. Use accessible names and visible keyboard focus, show selected/disabled/preview/committed states clearly, and reflow for a 390px viewport. Respect reduced motion.

All artwork and examples are original local assets. Product links, art provenance, and limitations are recorded in [sources.md](references/sources.md) and [asset-map.json](references/asset-map.json). Do not claim exact game fidelity, game integration, or measured search demand.

## Use this Skill

Give your AI the complete package and ask for the exact screen(s) and behavior you need. For example:

> Use the cyberpunk-2077-ui reference Skill to design a new cyberware and mission journal. Use the sample states in `references/screen-patterns.md`, preserve the game-specific visual grammar, make selection and commit states keyboard accessible, and save the generated screen outside this Skill folder.

The HTML specimens are local, editable reference parts. Copy only the useful components and recompose the requested screen; do not return the component gallery unchanged.

## Rendered component reference

Inspect [component-board.png](references/images/component-board.png), the actual browser rendering of the editable primitives. This is a component reference; compose the requested screens independently.
