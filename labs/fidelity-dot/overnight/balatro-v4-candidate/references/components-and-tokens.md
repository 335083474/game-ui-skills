# Components, tokens and font roles

## Logical drawing space

The visual system uses a 1024×576 logical canvas. The reference-style layout has a left sidebar, top card inventory, a central shop region and a lower-right deck. The v4 collection view reuses the same visual language rather than embedding a screenshot. Browser scaling is presentation only: interaction coordinates must map back to the logical canvas. Prefer native or integer display scales for pixel inspection.

The static raster generator and the live canvas runtime are separate consumers of shared assets. `output/balatro-shop-1024x576.png` is a static review frame, not the live runtime and not a replacement for independent UI components.

## Color tokens

The editable static palette is `sources/palette.json`. Color roles:

| Token | Value | Role |
|---|---|---|
| green_dark | #1b5146 | Deep marbled field |
| green_light | #3b7c64 | Light green field |
| sidebar | #2b373b | Sidebar and inset surfaces |
| ink | #142022 | Dark keylines/ink |
| panel | #1c292d | Main panel body |
| rail | #3d555a | Muted blue-gray framing |
| white | #fffdf1 | Foreground text |
| red | #ff4c40 | Primary action/emphasis |
| blue | #079df5 | Chip/count accent |
| green | #32ba89 | Reroll/positive action |
| gold | #f6b742 | Prices and marquee |
| orange | #f39b00 | Secondary action/ante |

The marbled background is a procedural, non-radial approximation with visible gentle flow strands. It is not an extracted shader. Its raster source remains `components/background.png`, with generation parameters in `render.py` and layout notes in `sources/layout.json`.

## Independent components

- `components/shop-marquee.png`: accepted procedural SHOP sign, including bulbs and separately authored lettering; editable sources in `sources/decor/`
- `components/voucher.png`: procedural voucher component retained with its accepted proportions; caption rendering is separately controlled
- `components/joker_*.png`, `wheel_fortune.png`, `buffoon_pack.png`, `arcana_pack.png`: independent image components derived from the newly generated source sheet, not original screenshot crops
- `components/score-chip.png` and `deck.png`: authored supporting components
- Panel wells, buttons, price badges, selection and text: assembled as live UI rather than merged into the card images
- `components/panels.png` / `labels.png`: static-render outputs; do not treat the static labels layer as live data

Component proportions and local integer positioning matter more than a global filter. There is no required CRT overlay. Added blur/shadow effects must not obscure counters, prices or unsupported-text notices.

## Frozen master contract

`fonts/canonical/canonical_metrics.json` and `canonical_atlas_*.png` define the fixed pixels and advances. Creator: m6x11 by Daniel Linssen. Normal rendering does not load `fonts/m6x11.ttf` or rasterize via FreeType. The TTF is retained only as provenance/optional explicit atlas-authoring source.

Available independent masters are 16,18,19,20,22,24,26,32,40,48,96. These are separate frozen masks, not runtime resizes of a16-pixel atlas. Each glyph records its ink rectangle, bearings and integer advance64. Accumulate advance64 and place at floor((total+32)/64). Preserve that rule in every renderer.

Accepted static role mapping in `sources/layout.json`:

| Role | Master |
|---|---:|
| Main buttons |19|
| Prices |24|
| Sidebar labels |18|
| Other body labels |19|
| Tagline |26|
| Regular prominent counts |32|
| Cash/large score |48|
| Voucher caption |16|

Fit helpers may choose a smaller available master for bounded numeric values. Fit ink plus shadow inside the target box; never invent a non-existent master or stretch a glyph to make it fit. Runtime-specific roles should remain explicit in code and must be checked against these static defaults.

The static score slots remain blue(25,312,94,47), red(147,312,94,47), with a28-pixel gutter centered at x133. Chips align right and multiplier aligns left toward the gutter. These static coordinates do not force unrelated screens to reuse the same layout, but preserve the relationship when rendering this score component.

## Known optical tradeoffs

Main master 19 yields widths33/40/39 for Next/Round/Reroll, close to the measured reference. Price24 gives20×18 for$4 and30×18 for$10, approximately one pixel wider than source ink. Sidebar18 is deliberately optically stronger and slightly wider than measured source labels. Tagline26 matches width better but remains taller. These are accepted/reviewable approximations, not claims of original glyph identity.

## Actual v4 scene bindings

`scene.js` exports `BalatroScene.build(state, fontLayout)`, `palette` and `shopSlots`. The build result contains logical width/height, draw commands, hit regions, layout notes and descriptionPages. `runtime.js` consumes that result; `text-layout.js` supplies pure glyph metrics/wrapping and `pixel-font.js` draws browser atlas masks.

The runtime palette is an explicit constant in `scene.js`, currently panel#2b383d, sidebar#29363a, rail#425e66, red#ff4c40, green#2ebc87, blue#009fdd, orange#efa500, gold#f7c253, white#f5f4df, ink#172426. These are close visual-system counterparts, not automatic live reads of `sources/palette.json`. Editing the static palette alone does not update this runtime constant.

Likewise, static `sources/layout.json` records the accepted static frame; the runtime's actual positions and font calls are in `scene.js`. Update the relevant consumer deliberately rather than assuming a single configuration file controls both.

V4 uses master 26 for the one-line title preview,19 for default body/buttons,18 for sidebar captions,24 as the maximum price master,16 for details and collection names,32 for ordinary sidebar numbers, and up to48 for fitted cash. Numeric/button fit selects an available smaller master if needed. The details panel lays out master 16 text on a 19-pixel line pitch.

Shop has 5 visible product slots per page. Collection has 8 cards per page in a 4×2 arrangement. The collection card name preview is at most 2 visual lines with an ellipsis for longer names; complete text remains in details/editor. The title preview is one visual line with a layout note if more is needed. These are presentation limits, not data truncation.

`fonts/browser/canonical_atlas_*.png` are browser alpha-mask derivatives of the canonical font PNGs. `font-data.js` carries their frozen metrics. Browser drawing tints these masks without Canvas fillText or runtime FreeType. Keep the canonical originals and source attribution when redistributing the derivatives.
