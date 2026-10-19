---
name: nier-automata-ui
description: Create calm, legible game menus with NieR:Automata's warm beige system language, fine grids, score-line ornaments, and restrained black selection rules. Targets the original 2017 UI direction, not generic sci-fi HUDs.
---

# NieR:Automata UI reference

Use this experimental reference package to create original interfaces informed by the 2017 NieR:Automata UI. It is a design interpretation, not a Square Enix asset pack or exact game reconstruction.

Read [visual-rules.md](references/visual-rules.md), [tokens.json](references/tokens.json), and the screen pattern for each requested view. Inspect [style-board.svg](references/images/style-board.svg) and [editable specimens](assets/components/index.html). The board demonstrates visual grammar only; compose the requested screens independently.

Preserve the warm, low-chroma beige system surface, quiet fine grid, crisp horizontal divisions, compact type, and occasional abstract score-like double bars. Active selection is a short black rule or dark text weight. Keep the background nearly flat. Use color only when a value needs meaning; never add neon, holographic glow, military brackets, ornamental fantasy frames, or a dashboard card grid.

The suggested screens share one synthetic save: Chip Loadout, Item Case, and System Settings. Keep chip capacity and installed-slot state, item counts, and settings toggles coherent across views. Keyboard and pointer must produce the same selection and commit behavior. Numeric and textual labels carry meaning independently of color.

Reuse the local [score rule](assets/art/score-rule.svg) and copy or adapt the primitives in [theme.css](assets/components/theme.css). The specimen board is a starting kit, not an application shell. No custom font is copied; use the system sans stack in tokens.

This package contains no finished game screen and no official art. Official references and edition limits are in [sources.md](references/sources.md); provenance for local vector assets is in [asset-map.json](references/asset-map.json).

## Rendered component reference

Inspect [component-board.png](references/images/component-board.png), the actual browser rendering of the editable primitives. This board is a component reference; compose the requested screens independently.
