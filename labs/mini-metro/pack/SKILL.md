---
name: mini-metro-ui
description: Create original browser-game interfaces using Mini Metro's minimal vector transit map visual language. Use for matching menus, overlays, HUD fragments, or game-management screens; this is an independent reference study, not official game art.
---

# Mini Metro UI reference

Use this self-contained experimental Skill to create new interfaces in the visual direction of **Mini Metro**. Scope: 2015 PC route-map direction / original study. The intended feel is an unfinished paper map where route geometry is the primary control surface.

Read [visual-rules.md](references/visual-rules.md), [tokens.json](references/tokens.json), and the requested section of [screen-patterns.md](references/screen-patterns.md). Inspect the original [style reference](references/images/style-reference.svg), [local scene art](assets/art/scene.svg), and [editable component specimens](assets/components/index.html). Reuse their geometry and state cues, then compose a new layout for the player's task; the specimen page is a parts board, not a finished screen.

The three authored screen patterns are `route-editor`, `capacity-upgrade`, and `day-results`. Keep the core visual grammar from the rules while adjusting information density to the screen's actual purpose. Use accessible names and visible keyboard focus, show selected/disabled/preview/committed states clearly, and reflow for a 390px viewport. Respect reduced motion.

All artwork and examples are original local assets. Product links, art provenance, and limitations are recorded in [sources.md](references/sources.md) and [asset-map.json](references/asset-map.json). Do not claim exact game fidelity, game integration, or measured search demand.

## Use this Skill

Give your AI the complete package and ask for the exact screen(s) and behavior you need. For example:

> Use the mini-metro-ui reference Skill to design a new route editor and capacity upgrade. Use the sample states in `references/screen-patterns.md`, preserve the game-specific visual grammar, make selection and commit states keyboard accessible, and save the generated screen outside this Skill folder.

The HTML specimens are local, editable reference parts. Copy only the useful components and recompose the requested screen; do not return the component gallery unchanged.

## Rendered component reference

Inspect [component-board.png](references/images/component-board.png), the actual browser rendering of the editable primitives. This is a component reference; compose the requested screens independently.
