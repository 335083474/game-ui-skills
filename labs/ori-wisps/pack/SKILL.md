---
name: ori-wisps-ui
description: Create original forest-action interfaces using the atmospheric hand-painted direction of Ori and the Will of the Wisps. Use for abilities, spirit shards, and map surfaces; do not mix in Blind Forest UI references or copy Ori.
---

# Atmospheric hand-painted forest UI

This package captures a restrained, luminous forest direction for original interfaces. It targets Ori and the Will of the Wisps (2020) as a broad mood reference, not an official asset or exact UI reconstruction.

## Read and inspect
- Read [visual-rules.md](references/visual-rules.md), [tokens.json](references/tokens.json), and the relevant part of [screen-patterns.md](references/screen-patterns.md).
- Inspect the original forest art plate in [ori-wisps-art.png](assets/illustrations/ori-wisps-art.png). The image contains fictional scenery and a tiny invented moth spirit, not Ori. Crop it for reference; do not put text on top of the full image.
- Use [editable component specimens](assets/components/index.html) and [theme.css](assets/components/theme.css) as modular fragments.
- Bind to actual game state; the [demo-state.json](references/demo-state.json) is synthetic.
- Verify title and edition boundaries in [sources.md](references/sources.md). A found ArtStation UI source is for Blind Forest and must not be used to assert Will of the Wisps UI details.

## Direction rules
Use deep layered forest values, hand-painted edges, thin organic linework, and small, controlled cyan and amber highlights. Keep most regions quiet and make illumination a cue for current focus, rarity, or path only. Preserve contrast with calm opaque surfaces and readable text.

Build the requested abilities, spirit shards, and forest map as separate views. Do not produce generic neon cards or copy Ori, other creatures, exact environmental art, or proprietary glyphs. Keep map state distinguishable through shape and labels as well as hue. A shard replacement is preview-only until the player applies it. Keyboard and pointer navigation must share the same focus and state; reduce glow/motion under reduced-motion preferences.


## Rendered component reference

Inspect [component-board.png](references/images/component-board.png), the actual browser rendering of the editable primitives. This is a component reference; compose the requested screens independently.
