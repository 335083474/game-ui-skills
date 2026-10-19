---
name: ace-attorney-ui
description: Create original courtroom mystery interfaces with a testimony console, witness identity strip, and filed evidence record. Use for the 2019 HD Trilogy direction, separate from Danganronpa's moving tribunal interface.
---

# Courtroom evidence interface reference

Use the selected **Phoenix Wright: Ace Attorney Trilogy (2019 HD collection)** direction for original evidence, testimony, and episode-selection screens. This experimental package interprets an edition; it is not an official Capcom art pack or a pixel-exact reproduction.

Read [visual-rules.md](references/visual-rules.md), [tokens.json](references/tokens.json), and the relevant section of [screen-patterns.md](references/screen-patterns.md). Inspect the original witness portrait in [witness-portrait.png](assets/witness-portrait.png) and editable controls in [components/index.html](assets/components/index.html). The components are isolated specimens, not finished screens.

Center the grammar on a courtroom record: a named witness, a sequence of individually selectable testimony statements, and evidence that can be inspected or presented as a separate action. Use crisp dossier edges, a restrained navy / paper / crimson palette, and clear chapter order. `PRESS` asks for detail on the current statement; `PRESENT` opens the evidence record. Do not blend these actions or let a portrait become the whole interface.

For [evidence file](references/screen-patterns.md#evidence-file), [cross-examination](references/screen-patterns.md#cross-examination), and [episode selection](references/screen-patterns.md#episode-selection), keep one fictional case and all IDs consistent. The trilogy entry is not the original GBA screen target; do not replace its direction with Danganronpa's pink/black timing surfaces. Invent all testimony, names, evidence, and outcomes. See [sources.md](references/sources.md) for edition and evidence limits.

Use [USAGE.md](USAGE.md) for a copy-ready prompt. No game assets or font binaries are bundled; finished screens and browser evidence belong outside this package.

## Rendered component reference

Inspect [component-board.png](references/images/component-board.png), the actual browser rendering of the editable primitives. This is a component reference; compose the requested screens independently.
