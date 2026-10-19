# Visual rules

## Edition and framing

Use the PC desktop workbench direction: the player's attention stays near the document surface and the small set of tools that affect a decision. The center should feel occupied by real paper, not by large explanatory cards. A compressed desk is part of the design; keep page edges, field alignment, and stamp placement readable at native size. Adapt the display for modern screens without smoothing away the deliberate pixel character.

## Paper, desk, and ink

Use dusty desk gray-green (`#454944`), aged paper (`#d8caa5`), old ink (`#302e26`), faded type (`#695f4b`), and a restrained red validation stamp (`#a33d32`). A muted green stamp can mark acceptance, but pair it with its word and a distinct shape. The paper is pale but not pure white; the desk is visible in negative space around sheets. Document borders are squared and thin. Use offset layers to imply paper overlap and a faint one-pixel shadow, not modern rounded cards, blur, glass, gradients, or neon.

## Typography and pixel treatment

Use a system monospace such as `Consolas`, `Courier New`, or `monospace` for field keys, dates, identifiers, and ledger values. Keep prose in the same family or a restrained humanist sans. Use short uppercase labels and a calm baseline grid; avoid huge pixel-display headings. Pixelation is an edge and scale rule, not a license to make text illegible. For any raster texture, render at integer multiples and use `image-rendering: pixelated`; do not blur it. Keep ordinary body text at 16px or larger on current Web layouts.

## Document anatomy and decision states

Forms use aligned label/value rows with a narrow key column, clear document title, issuing authority, and stable identifiers. Passport, permit, and ticket surfaces may overlap, but one active document must remain foremost. Use a selected field outline or an explicit comparison column to show what is being inspected. A disagreement state names both values and the violated rule. A stamp is a separate action surface with a visible word (“APPROVE” / “DENY”) and an unmistakable commit state. Do not use color alone, and never let a hover or selection accidentally issue the decision.

## Composition by task

- Inspection keeps the active documents close together and the current policy visible at the edge of the work area. The comparison is the primary action.
- The handbook uses a bound-page metaphor with stable page tabs and concise policy rows; it is a reference, not an admin settings panel.
- The daily ledger is a narrow typed statement with income, mandatory deductions, and remaining balance aligned in columns; do not turn it into a chart-heavy finance dashboard.

For narrow layouts, stack documents by priority, keep the inspector's active sheet on top, and let the secondary form scroll within its own bounded area. Preserve a clear desk border. Stamp targets should be at least 44px even when the mark itself is compact. Use no motion for the status; a crisp ink mark is sufficient. Respect reduced motion and high-contrast preferences.

## Asset boundary

The standalone reference is an authored SVG made from document geometry, rules, and generic field text. It is not an official screenshot. The package does not include game sprites, stamps, interface files, a custom typeface, or a screenshot archive. Create any people, passport portraits, and seals as original project art; do not use authentic personal identity documents.
