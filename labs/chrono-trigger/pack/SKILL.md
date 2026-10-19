---
name: chrono-trigger-ui
description: "Create original browser-game UI studies for Chrono Trigger's 1995 Super Nintendo interface direction. Use for compact party, Tech-combination, or ATB battle surfaces; this is an independent visual reference, not official game art or the later PC UI."
---

# Chrono Trigger UI reference

Use this experimental Skill for the fixed target: 1995 Super Nintendo interface direction, not the later PC UI. Build compact translucent blue windows with crisp edges, a three-person party, readable Tech-combination requirements, and clearly labeled Active Time Battle states.

Read [visual rules](references/visual-rules.md), [screen patterns](references/screen-patterns.md), and [tokens](references/tokens.json). Inspect the original [reference board](references/images/reference-board.svg), reusable [local glyphs](assets/art/ui-atlas.svg), and editable [component specimens](assets/components/index.html). The specimen page is a parts board, not a finished screen.

The authored patterns are:

- party: three compact member records with abstract portraits, HP/MP, and one focused member.
- techs: one-, two-, and three-person Tech options with named participants.
- battle-orders: a labeled ATB strip and distinct ready/waiting command states.

Keep selection and execution separate. Use semantic controls, visible keyboard focus, legible numeric states, touch targets of at least 44px, and responsive behavior through 390px. Respect reduced-motion settings. Sample values and local selections do not simulate a battle.

The illustrations and components are original local assets. [Sources and boundaries](references/sources.md) records the product context and asset provenance. Do not claim exact game fidelity, engine integration, source-game artwork, or measured search demand.

## Use this Skill

Give an AI the complete package and name the player task, viewport, party data, controls, and required states. Ask it to reuse the visual grammar while composing a new layout, then save its result outside this package. Do not return the component board unchanged as a finished screen.

## Rendered component reference

Inspect [component-board.png](references/images/component-board.png), the actual browser rendering of the editable primitives. This is a component reference; compose the requested screens independently.
