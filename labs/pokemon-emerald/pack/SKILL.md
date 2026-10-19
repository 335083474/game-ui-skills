---
name: pokemon-emerald-ui
description: Build compact Web party, bag and battle interfaces in the Pokemon Emerald GBA visual language using local pixel primitives and explicit game-state contracts. Use for this classic handheld direction, not modern Pokemon UI.
---

# Pokemon Emerald GBA reference UI

Create an unofficial, reference-driven interface with the density and framing of Emerald's Game Boy Advance menus. This package is reusable input, not a collection of finished party/bag/battle pages. Keep text and state in HTML/JavaScript; never flatten a generated reference into the interface.

## Start here

1. Read [visual rules](references/visual-rules.md) and [tokens](references/tokens.json). Inspect [generated direction](references/images/screen-direction.png). Its soft shading and symmetrical party grid are loose interpretation: the written geometry wins.
2. Inspect the editable [primitive board](assets/components/index.html) and its [CSS](assets/components/theme.css). The [captured board](references/images/component-board.png) is a render of those primitives, added during packaging. If absent, use the HTML source; do not claim a captured review happened.
3. Read the relevant [screen/state contract](references/patterns-and-state.md), use the same party and bag data across screens, and consult the [asset map](references/asset-map.md) before cropping sprites.
4. Implement the requested screen and its meaningful transitions. Keep the nominal 240×160 frame at integer pixel scale inside responsive surroundings. At narrow widths use 1× with room to scroll rather than compressing source pixels.
5. Run the [consistency checks](references/consistency-checks.md), including keyboard input and visible state updates.

## Essential identity

- Hard stepped 1–2 source-pixel navy edges; cream text boxes with dark double frames; flat restrained teal/green party surfaces. No modern card dashboard, soft drop shadows, glass, wood, giant pill controls, or orange farming-game treatment.
- Use local Pixelify Sans for compact Latin glyphs. Keep source text around 9–11px, enlarged only with the same integer scale as the UI. Critical labels remain readable and unclipped.
- Party: six members at most, emphasized lead slot at left, compact reserve tiles at right, name/Lv/status/HP tied to the same entity. Bag: pocket tabs, item list, count, selected description, small bag motif. Battle: opposing status plates and bottom prompt + four-choice 2×2 command panel.
- Visible focus uses a dark triangular cursor and/or stepped outline. Selected, keyboard focus, disabled, fainted, low HP and resolving states must be distinguishable. Mouse and keyboard must both work.
- Match the Emerald-era layout grammar; CC0 substitute creatures and demo rules are experimental adaptations. Do not call generated images Nintendo screenshots or claim gameplay-engine fidelity.

## Files and portability

Use [INSTALL.md](INSTALL.md) for installation and adaptation. Everything needed at runtime is local: CSS, font and editable primitives. [sources](references/sources.md) records the verified Nintendo links and the limits of that evidence; [generation.json](references/generation.json) records built-in generation prompts and outcomes. The requested generated atlas was blocked by output moderation; the approved fallback is unmodified CC0 Tiny Creatures and Tiny Dungeon sprite sheets. See asset-map.md for exact crops and original licenses.

