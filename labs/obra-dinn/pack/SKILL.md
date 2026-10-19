---
name: obra-dinn-ui
description: Create original game interfaces with a 1-bit nautical ledger direction inspired by Return of the Obra Dinn. Use for forensic rosters and investigation records, not as a pixel-exact source-game recreation.
---

# 1-bit nautical ledger UI

Build original roster, investigation, and chapter surfaces with a strict two-tone visual grammar. The examples and data are fictional.

## Read and inspect
- Read [visual-rules.md](references/visual-rules.md), [tokens.json](references/tokens.json), and the relevant section of [screen-patterns.md](references/screen-patterns.md).
- Inspect the original generated [direction plate](assets/illustrations/obra-dinn-art.png); use a crop only, never as a full-screen background.
- Use [component specimens](assets/components/index.html) as editable fragments, not a full app.
- Adapt [demo-state.json](references/demo-state.json) and check the edition/evidence boundary in [sources.md](references/sources.md).

## Essential decisions
Use sparse single-bit silhouettes, ruled ledger columns, a block-like cursor, and precise monospace labels. Separate observed evidence from inference. Mark suspected versus confirmed identity with text and symbols. Avoid generic commerce or reward surfaces, smooth gradients, multicolor glow, or color-only status.
Keep the investigation readable at narrow widths. Preserve stable IDs across sorting, announce selected entries, and make open/close or back actions explicit. Selection is reversible; consequential evidence edits require an explicit confirmation.


## Rendered component reference

Inspect [component-board.png](references/images/component-board.png), the actual browser rendering of the editable primitives. This is a component reference; compose the requested screens independently.
