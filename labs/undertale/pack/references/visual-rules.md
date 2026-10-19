# Visual rules

## Edition and silhouette

Target the 2015 original. The core silhouette is a black field with a few square white frames and text choices, plus a small heart pointer that marks focus. This is not a polished fantasy HUD with permanent panels around every edge. Keep most of the scene unframed; a command box or dialogue box appears when the player needs it.

## Color and pixel edge

Use near-black (`#000000`) for the field, white (`#f8f8f8`) for frame / type, warm red (`#e64a4a`) for a small health / danger cue when required, and muted gray (`#949494`) for disabled text. A single bright cursor color may identify selection. Default UI surfaces are black with white outlines, not gray card panels. Corners stay square. Frame thickness is 3–4px at a Web adaptation scale, with a second inner dark / white inset if needed. Avoid gradients, soft shadows, glass, pill shapes, texture overlays, and excessive glow.

Use a monospace family such as `Consolas`, `Courier New`, or system monospace with enough pixel-like cadence. Do not bundle or imitate a copyrighted game font. Body text should remain 17–20px on desktop, with clear line-height. A pixelated visual rhythm is created by crisp edges and spacing; it does not require shrinking text. Keep line lengths short in dialogue and command labels brief.

## Choice and pointer grammar

The heart pointer sits just left of the selected row or command. It should not overlap the label. Arrows move among sibling choices; Enter / Space confirms; Escape / Back returns exactly one layer. Hover does not confirm. For four command choices, use a compact two-by-two set or a line according to width; keep all labels aligned. Selection should include a visible outline / `aria-pressed` state for assistive tech, not only a red fill.

Inventory appears in one framed list with the selected item description in a second frame or adjacent text region. Selecting an item only previews it. Confirm consumes / uses the item once; Back changes nothing. Dialogue text is contained within a white frame with generous inner padding. Optional typewriter treatment must not prevent immediate reading or keyboard skip. Choice branches are text choices, not a button card grid.

## Screen patterns

- Battle command: leave the center of the field open, put short command choices near the lower edge, and keep party / enemy state compact. A target chooser appears only after a command needs one.
- Items: a bounded list and concise description, with quantity and use target written explicitly. Disable unavailable choices with a reason.
- Dialogue: one text frame with an optional two-to-three-choice prompt. Preserve a stable cursor, readable line spacing, and a clear continue state.

Avoid persistent full-width headers, full-screen cards, large title treatments, and a dashboard body. For mobile, keep the playfield visible above the command list and stack menu layers below; do not scale down the entire canvas. Use at least 44px clickable targets while the visible frame can remain compact. Respect reduced motion; no essential interaction depends on typewriter timing.

## Asset and scope boundary

The style reference is native SVG because the design language is made from code-native boxes, text, cursor, and border geometry. It is original and has no game art. No Undertale sprites, soundtrack, dialogue, logo, or custom typeface is included. The frozen research entry notes stylistic proximity to an EarthBound candidate; distinguish this package by its strong black field, white frame, compact command grammar, and heart cursor rather than generic pixel fonts alone.
