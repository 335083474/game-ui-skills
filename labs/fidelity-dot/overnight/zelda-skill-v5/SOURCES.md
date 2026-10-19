# Component provenance and rights status

## Scope of the record

The supplied screenshot was an external visual reference for this Zelda-style study. It is not bundled. No ROM, official font file, screenshot crop or original sprite sheet is required by the package. The distributable components were authored as character/binary/indexed grids or procedural integer-coordinate drawings, then rendered to PNG. They are approximations, not extracted or recovered original game assets.

The underlying model identifier used while authoring these source grids was not recorded in the artifact metadata and is therefore unknown. No particular image-generation model is claimed for these assets. Procedural generation describes how the supplied source becomes pixels; it is not a rights-clearance claim.

No verified commercial license or rights clearance for the underlying game design, recognizable motifs or names is supplied. Original source-grid authorship does not establish that a commercial derivative use is cleared. These are not official Nintendo assets or an official game font. Resolve the intended use and rights separately before external distribution or commercial deployment.

## Individual sprite ledger

Every row below is an independent native PNG rendered from its matching entry in `sources/sprites/sprite_grids.json` and shared `sources/sprites/palette.json`. Method: newly authored palette-index character matrix, no reference-pixel extraction. Model metadata: not recorded. Rights status: no clearance asserted. All coordinates are native integer pixels; alpha is binary.

| Component / native output | Native size | Authored feature and limitation |
|---|---|---|
| `components/sprite_bow_native.png` | 16×16 | Gold arc, white string, diagonal arrow; contour and crossing are approximate. |
| `components/sprite_boomerang_native.png` | 16×16 | Red elbow with light top and darker lower/right surfaces. |
| `components/sprite_hookshot_native.png` | 16×16 | Gray/white diagonal shaft and red grip; tip silhouette is approximate. |
| `components/sprite_bomb_native.png` | 16×16 | Round blue body with offset highlight and authored fuse. |
| `components/sprite_mushroom_native.png` | 16×16 | Spotted ochre cap, shaded underside and stem. |
| `components/sprite_fire_rod_native.png` | 16×16 | Red faceted head and shaded gold shaft. |
| `components/sprite_ice_rod_native.png` | 16×16 | Blue faceted head and shaded gold shaft. |
| `components/sprite_medallion_lightning_native.png` | 16×16 | Gold beveled disc with newly drawn lightning-like emblem. |
| `components/sprite_medallion_flame_native.png` | 16×16 | Gold beveled disc with newly drawn flame-like emblem. |
| `components/sprite_medallion_quake_native.png` | 16×16 | Gold beveled disc with newly drawn zigzag emblem. |
| `components/sprite_lantern_native.png` | 16×16 | Red housing, dark inset cavity, flame and pale base. |
| `components/sprite_hammer_gold_native.png` | 16×16 | Broad shaded gold head and wooden handle; fuller than reference. |
| `components/sprite_flute_observed_native.png` | 16×16 | Rounded diagonal blue body, pale contour and dark recesses; no bird anatomy. |
| `components/sprite_bug_net_native.png` | 16×16 | Gray hoop, alternating mesh and shaded handle. |
| `components/sprite_book_green_native.png` | 16×16 | Green cover, dark spine and light page rows; invented cover mark. |
| `components/sprite_bottle_red_native.png` | 16×16 | White rim, transparent gaps and shaded red liquid. |
| `components/sprite_cane_red_native.png` | 16×16 | Hooked red shaft with highlight, shadow and gold tip. |
| `components/sprite_cane_blue_native.png` | 16×16 | Hooked blue shaft with highlight, shadow and gold tip. |
| `components/sprite_cape_red_native.png` | 16×16 | White ties, red folds and dark hem. |
| `components/sprite_mirror_native.png` | 16×16 | Layered blue rim, dark face and diagonal highlight. |
| `components/sprite_sword_metal_native.png` | 16×16 | White/cyan/blue blade planes, gold guard and shaded grip. |
| `components/sprite_shield_gold_native.png` | 16×16 | Gold bevel, shaded pale face and new red central motif. |
| `components/sprite_armor_red_native.png` | 16×16 | Layered red shoulders/body, collar recess and gold belt. |
| `components/sprite_boots_gold_native.png` | 16×16 | Gold cuff, straps, toe highlight and layered outsole. |
| `components/sprite_glove_gold_native.png` | 16×16 | Gold highlights and shadow masses; simplified fingers. |
| `components/sprite_flippers_blue_native.png` | 16×16 | Multi-lobed upper contour feeding a broad blue/cyan web. |
| `components/sprite_pearl_red_native.png` | 16×16 | Pale rim and red light/mid/dark volume. |
| `components/sprite_crystal_faceted_native.png` | 6×8 | New six-by-eight blue/cyan faceted design. |
| `components/sprite_heart_red_native.png` | 16×16 | New red heart with pale rim and darker right/lower faces. |

## Other component sources

| Component | Editable source / method | Provenance and limitation |
|---|---|---|
| Five panel backgrounds | `sources/panels.json`; integer-coordinate polygon rails | Newly authored black keyline, two colored rails and white inner rail. No original image pixels; corners/geometry approximate the reference |
| Background | `sources/background/map_indices.json` and `palette.json`; indexed raster | Newly authored terrain approximation. Hidden geography was inferred; not a recovered map |
| Background regeneration | `sources/background/generate_background.py` | Optional procedural reset. It may replace edited palette/matrix inputs; use only when that replacement is intended |
| Direct background rendering | `sources/background/render_from_matrix.py` | Renders supplied edited matrix/palette without recreating the inferred map |
| Bitmap glyphs | `sources/glyphs/font_arrays.json`; binary rows and explicit metrics, with compatibility exports | Custom-authored bitmap letters, digits and punctuation. No official font or extracted font file; letter shapes remain approximations |
| Compact/display labels, A/Y markers and counter | Glyph arrays plus layout/metrics | Glyph rendering is separate from panel backgrounds. Multiplication mark and count digit are text rather than sword artwork |
| Title cutouts and dashed separator | Layout plus integer-coordinate drawing | Newly authored independent layers; no screenshot crop |
| Runtime selection and dialogs | Local runtime Canvas primitives and custom bitmap glyphs | New interaction states made for this candidate. Their existence is not a claim about the reference game's exact UI behavior |

The single supplied screenshot does not prove animation, selection, pagination or other runtime behavior. Such behavior in this package is an authored candidate implementation. Prior static review and technical pixel checks are not proof that every new runtime state has been accepted.
