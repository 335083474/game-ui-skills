# Concrete native-pixel specification

The frame is 256×224 pixels. Item/equipment/heart sprites are transparent 16×16; the crystal is 6×8. Render at integer coordinates with image smoothing off. Browser display selects integer scales 1–4 using both available container width and remaining viewport height; smaller containers scroll rather than requiring fractional sprite resampling. The browser editor and full-text HTML dialog deliberately use ordinary accessible HTML outside the native scene.

## Five panel frames

Coordinates below include the exterior black keyline. These dimensions are authored package values, not a claim of exact source-game geometry.

| Panel | Top-left | Size | Colored rails |
|---|---|---|---|
| Items/details | 8,15 | 152×120 | RGB 56,208,64 |
| Selected preview | 168,15 | 80×48 | RGB 56,208,64 |
| Crystals | 168,64 | 80×71 | RGB 232,192,0 |
| Actions | 8,143 | 152×72 | RGB 240,24,24 |
| Equipment | 168,143 | 80×72 | RGB 232,192,0 |

Outside to inside: one black keyline, two contiguous colored rails, one warm-white rail (248,248,240), then black interior. There is no black channel between the two colored rails. Corner steps are 4,3,2,1 pixels. Panels contain no baked lettering. ITEM and DO use separate top-border cutouts; CRYSTALS/EQUIPMENT sit inside their panels.

Canonical panel colors/size are in `sources/panels.json`. Runtime anchors are in `runtime.js`; static reference anchors are in `sources/layout.json`. Changing source geometry alone does not automatically rewrite runtime coordinates: update the corresponding render anchors deliberately and retest.

## Native placements

- Inventory grid origin (31,31), 24-pixel spacing, five columns and up to four rows
- Selected sprite preview origin (200,23); label origin (177,48), 64-pixel line width
- Selected count origin (177,40); lower-right counter origin (177,172) uses the first equipment entry's count
- Equipment icons at (175,158), (199,158), (223,158)
- Action sprites at (32,191), (64,191), (96,191), (128,191)
- Heart origin (200,191)
- Crystal origins: (196,87), (212,87), (188,103), (204,103), (220,103), (196,119), (212,119)
- Dashed separator: y179, four white pixels followed by four empty pixels, beginning x177
- Detail text begins (29,30), 120 pixels wide; nine lines per page with ten-pixel spacing. Page indicator (30,125), compact5, ends at y129 before the interior rail. Preview continuation + is at (237,40). Equipment selection is an underline at y177, avoiding the heading at y152–156

The selection outlines and detail state are newly authored runtime behavior. The static supplied reference does not establish their original-game appearance.

## Palette and separable components

Sprite colors are explicit RGBA entries in `sources/sprites/palette.json`; transparent pixels are alpha0 and opaque pixels alpha255. Blue volumes use pale cyan/light blue/mid blue/navy; gold objects use cream/yellow/ochre/brown; red objects use light red/red/dark red; the book uses light green/green/dark green plus page colors. Do not replace these cluster-based shades with gradients or antialiasing.

The background uses a separate indexed palette with 21 named terrain colors: water/banks, earth, grass, path and masonry. `map_indices.json` is a 224-row by 256-column index matrix. Editing the matrix/palette is distinct from running the optional procedural reset generator. The covered terrain is inferred, not a recovered original map.

Keep sprite, text, panel, background and runtime state layers independent. The full-frame preview PNG is a review output, not the source for future edits.

## Bitmap glyphs and metrics

Canonical source: `sources/glyphs/font_arrays.json`. Compatibility row arrays: `sources/glyphs/glyph_arrays.json`. Runtime binding: `font-data.js`. Regenerate compatibility/binding outputs from canonical source rather than editing exports independently.

| Font | Height | Source lineHeight | Normal tracking | Purpose |
|---|---:|---:|---:|---|
| compact5 | 5 | 7 | 1 | Compact labels/counts; variable widths |
| display6 | 6 | 8 | 2 | Preview names/actions/details; most letters width6, advance8 |
| marker15 | 15 | 17 | Explicit metrics | Thick 7×15 A/Y markers |
| do_title5 | 5 | Explicit metrics | Explicit metrics | Specialized DO title |
| counter7 | Specialized | Explicit metrics | Explicit metrics | Retained counter glyph family |

Read each glyph's width, advance and bearings. Compact M/N/W are five pixels wide; punctuation varies. Runtime detail layout intentionally adds ten-pixel line spacing rather than using display6's source lineHeight8 directly.

Both main fonts include A–Z, digits0–9, space, and these punctuation characters:

`. , ' - : ; ? ! / ( ) × + = % _ [ ] "`

Glyph helpers are case-sensitive and expose `?` fallback plus diagnostics. Runtime display separately normalizes uppercase while retaining original input. CR/LF handling in the standalone helpers preserves source code points; do not assume a custom renderer inherits those helper guarantees unless it actually calls them.

A general period has positive advance. Both runtime and offline renderer apply a dedicated LIFT.3 override. The font helper's optional `liftSeparator` setting uses advance0 and bearingX−1 for a period within the dedicated LIFT.3 action label. Never apply that special tracking-gap treatment to ordinary prose punctuation.

## Review boundaries

Passing dimensions, palette and nearest-neighbor tests does not establish visual likeness. Review silhouette occupancy, shaded color clusters, spacing, border corners and native-size readability. The glyphs are custom bitmap approximations, not the original game font. Runtime interaction checks, actual browser captures, offline Pillow renders and user visual approval are separate forms of evidence and should be labeled separately.
