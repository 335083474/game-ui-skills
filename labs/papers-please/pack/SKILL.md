---
name: papers-please-ui
description: Create original bureaucratic document-inspection interfaces with a low-resolution desktop, paper stacks, fields, stamps, and ledger rules. Use for the PC desk direction, not a modern case-management dashboard.
---

# Document-inspection interface reference

Use the selected **PC desktop / border desk** direction to build original inspection, rulebook, and daily-accounting views. This is an experimental reference package, not a Lucas Pope asset pack or a pixel-exact reconstruction.

Read [visual-rules.md](references/visual-rules.md), [tokens.json](references/tokens.json), and the relevant pattern in [screen-patterns.md](references/screen-patterns.md). Open the native document specimen in [style-reference.svg](references/images/style-reference.svg) and the editable controls in [components/index.html](assets/components/index.html). These are individual interface primitives, not complete screens.

Build around the inspector's desk: a narrow, low-saturation work surface; overlapping paper documents; typed field values; a visible comparison rule; and a decisive stamp. Preserve crisp pixel-like edges with nearest-neighbor scaling when using raster art. The important interaction is comparing documents against a changing rule set. A mismatch must identify the exact field and the conflicting values, not just flash red.

For the three suggested outputs, follow [inspection](references/screen-patterns.md#inspection), [rulebook](references/screen-patterns.md#rulebook), and [daily-ledger](references/screen-patterns.md#daily-ledger). Keep the document work surface visible, but reveal deeper policy and family expenses only when their task requires them. Do not force a three-card reward composition onto these screens. Invent all names, document numbers, policies, and outcomes; do not include official sprites, screenshots, or copied text. The [sources](references/sources.md) file records the edition and evidence boundary.

Use [USAGE.md](USAGE.md) for a copy-ready request. The package works offline and uses system monospace fonts; no font files or external runtime assets are bundled.

## Rendered component reference

Inspect [component-board.png](references/images/component-board.png), the actual browser rendering of the editable primitives. This board is a component reference; compose the requested screens independently.
