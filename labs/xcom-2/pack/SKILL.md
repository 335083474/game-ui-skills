---
name: xcom-2-ui
description: Create turn-based tactical interfaces with charcoal dossiers, angular command brackets, compact action costs, hit-chance readouts, and restrained cyan/orange signals. Targets base XCOM 2; keep War of the Chosen separate.
---

# XCOM 2 tactical UI reference

Use this experimental package to create original interfaces informed by the base XCOM 2 game's turn-based tactical and Avenger-management language. It is not a 2K asset pack or an exact game reconstruction.

Read [visual-rules.md](references/visual-rules.md), [tokens.json](references/tokens.json), and the relevant [screen pattern](references/screen-patterns.md). Inspect [style-board.svg](references/images/style-board.svg) and the editable [component specimens](assets/components/index.html). The board shows reusable dossier, command, and research pieces; it is not a full game screen.

Prioritize readable action economy: soldier identity, two-action budget, movement/cover cue, chance, and confirm. Use hard corners, thin angular brackets, muted cyan scan-lines, charcoal plates, and one restrained orange commit signal. Keep cyan a secondary signal rather than a luminous background. Do not use FTL's flat ship power blocks, Frostpunk's city thermal dial, rounded mobile cards, or constant animated scanlines.

Reuse the original vector target/selection marks in [tactical-markers.svg](assets/art/tactical-markers.svg). Keep squad equipment, tactical orders, and research as different task surfaces that share the same dossier labels and state. Synthetic hit chances must be marked as demo values, and the action cost must be visible before commit.

This package targets the 2016 base release; War of the Chosen is a separate edition. No official art or font is included. Sources and the edition line are in [sources.md](references/sources.md).

## Rendered component reference

Inspect [component-board.png](references/images/component-board.png), the actual browser rendering of the editable primitives. This is a component reference; compose the requested screens independently.
