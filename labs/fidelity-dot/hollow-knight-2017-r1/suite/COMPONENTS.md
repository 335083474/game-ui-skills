# Components and layout specification

Revision: HK-suite-four-pages-doc-r1
Runtime baseline: shared-title-r2-sourcefix plus Pause status repair r1
This document changes no runtime files or assets.

## Coordinate system and display

Logical stage: 1920×1080, uniform scaling.
Minimum supported actual stage: 960×540, scale 0.5.
Portrait/insufficient-space handling: visible limitation notice and inert stage.
A wide browser viewport alone does not guarantee enough stage space; assess the
actual rendered stage. Do not claim portrait/mobile support.

Style: near-black background/veil, open information areas, white independent
ornament, restrained serif text. Preserve the frozen values in each stylesheet;
do not apply an untested global filter, font replacement or layout redesign.

## Shared title token

For the existing frozen frame, shared-title-r2 uses logical pixels:
- left 856; top 64
- width 208; height 52
- font size 36; line height 52; weight 400
- centered, single line, hidden overflow, ellipsis

The full string remains in data and the complete-text/export routes. A title-only
overflow must expose those routes. This geometry has receiver evidence for the
existing three base pages, and Pause inherits the shared title styling. It is
not a universal safe box for another frame or font.

The old left 800/top 77/width 320/height 52 box intersected the frame with long
text. It is superseded and must not be described as an accepted safe region.

## Shared assets

assets/frame.svg
- Independent transparent white ornament; frame-r3 remains unchanged.
- SHA256: 461b2289ecd47c50548d5b3d60a62aa25ce98af7b758b1b5b7e7231bc2a3eaf1
- Decorative layer must not intercept controls.
- Do not bake text into it or obscure it with opaque title/status patches.

assets/selection.svg
- Independent selection-corner component.
- Position through the relevant item's layout/state, not a whole-screen hotspot.

assets/socket.svg
- Independent circular slot component.
- A reusable ornament/slot, not an embedded item image or text label.

assets/background.svg
- Separate authored background approximation; keep the near-black veil.
- Original scene screenshot is not a distributable background.

These four same-name SVGs are shared by the Pause extension with byte-identical
base files. Reuse the existing paths; do not create duplicate asset sets.

assets/soul-catcher.png
- Independently generated replacement, not an extracted official sprite.
- The selected Charms item and right preview reference the same image file.
- Underlying image model/version and commercial clearance remain unknown.

## Inventory source icons

Seven independent SVGs are under assets/inventory/:
- old-nail.svg — source canvas 100×400
- spirit.svg — 120×88
- focus.svg — 160×166
- scroll.svg — 130×78
- crest.svg — 90×120
- reservoirs.svg — 390×230
- geo.svg — 60×66

These are source-authored approximations with editable SVG paths/gradients, not
original-game extractions. Source canvas size is not the displayed CSS size.
Preserve aspect ratio when placing them. Placeholder names such as Tied Scroll
and Pink Crest are not verified official terminology.

## Typography and dependencies

The runtime uses installed Times New Roman / Georgia / serif fallbacks.
There are no bundled font binaries, network-font dependencies or confirmed
original-game fonts. Browser/platform fallback metrics can differ; run overflow
and visual checks in the receiving environment. Preserve the accepted weight
400 title styling rather than substituting heavy display text.

All UI text and counts are DOM/data values. SVG ornament and icon files remain
separate from those values. No external library or API is required to render the
pages. Keep original relative references and script order.

## Entry dependencies

index.html
- style.css, app.js and referenced shared/Charms assets

inventory.html
- base style.css, inventory.css, inventory-data.js, inventory.js
- shared frame and referenced Inventory SVGs

save-select.html
- base style.css, save-select.css, save-select-data.js, save-select.js
- referenced shared assets

pause-options.html
- shared-style.css, pause-options.css, pause-options.js
- referenced shared SVGs

shared-style.css is retained as the exact style.css copy used by Pause. Both
paths are deliberate dependencies. README-NEW.md remains the Pause-specific
repair documentation. The receiver's final manifest is the authority for the
actual complete file list; this dependency overview is not a checksum manifest.

## Page compositions

Charms
- Staggered collection, selected item corners and separate right detail region.
- Collection size 1–40; item/Cost validation stays in the existing implementation.
- Selection and preview must use the same item data and icon source.

Inventory
- Irregular equipment/ability positions; do not replace with a Charms grid.
- Collection size 1–20; Geo 0–999999; quantity null or integer 0–9999.
- Existing placement model and keyboard navigation remain unchanged.

Save selection
- Three slots; bounded name/location/metrics/description regions and distinct
  full-text/action regions.
- In the repaired detail panel, logical parent geometry is left 1296/top 322,
  width 416/height 535. Local vertical regions: name top 12/height 94; information
  top 118/height 100; description top 232/height 142; full-text control top 386/
  height 42; actions top 446/height 70.
- Preserve the repaired implementation and focus fallback; these numbers do not
  authorize growing text into adjacent action space.

Pause
- View left 440/top 195/width 1040/height 725.
- Introduction width 790/height 76, bounded and scrollable.
- Option list width 690; five control rows, gap 12, minimum row height 72.
- Other-mode view left 500/top 310/width 920.
- The title continues to use the shared title rule above.
- Diagnostic is outside both stage and viewport, before review/edit tools.

## Pause diagnostic specification

#stageStatus is a normal-flow paragraph with the same ID and existing JS
handlers. Its repaired CSS specifies:
- position static; inset auto; z-index auto
- width auto; height auto; max-height none; min-height 0
- margin 12px 16px; padding 8px 0
- overflow visible; white-space pre-wrap; overflow-wrap anywhere
- font 16px/1.6 Times New Roman, Georgia, serif; color #d9b988
- focus-visible outline 2px solid #e7edf9, offset 4px
- :empty display none

These are unscaled CSS pixels outside the game stage. Nonempty long-text
messages keep the existing tabindex/click/Enter/Space/full-dialog behavior.
The full-dialog close restores focus to the diagnostic. The diagnostic may
require ordinary document scrolling at a short window height.

This is review feedback, not a newly inserted game HUD. Do not restore logical
top 945/height 56, which visibly crossed the lower ornament.

## State and editing contracts

Keep state in validated data; render from that data. Do not infer values from
translated display labels. Do not silently truncate stored values to fit a box.
Invalid imports retain previous valid data. Asset failures must remain visible
as diagnostics. Do not accept arbitrary traversal paths as item images.

When closing a dialog after a state change, verify the restoration target is
still connected, enabled, visible and focusable. Fall back to the current
selected slot or an enabled primary action. BODY is not a successful fallback.

## Evidence boundaries

Receiver checks have established limited representative-screen and interaction
results for these frozen predecessors and repairs. No dot-run browser test,
final merged-package acceptance, font identity, pixel-perfect fidelity or
commercial rights determination is asserted by this specification.