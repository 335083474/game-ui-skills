# Balatro v3: independent frozen font masters

The user's revised B01 instruction prioritizes source proportions over the former16-only grid rule. This module freezes appropriate individual masters; it does not stretch the final screen or reintroduce runtime FreeType. v1/v2 remain unchanged.

Font: m6x11 by Daniel Linssen, https://managore.itch.io/m6x11 . Creator attribution and permission record remain unchanged in ../LICENSE-AND-ATTRIBUTION.txt. The exact Balatro-shipped font variant is still unverified. No new licensing or commercial-clearance assertion is made.

## Runtime API and fixed geometry

Copy canonical_font.py, canonical_metrics.json and ALL canonical_atlas_*.png together. Paths are module-relative; all text I/O is UTF-8.

render_mask(text,size=20) returns a tightly cropped binary PIL L mask. measure(text,size=20) returns exact width/height/inkBBox/advance64/rounded advance/lineHeight/diagnostics. center_x(center,text,size=20) centers using ink width. text_mask is an alias.

Available independent masters:16,18,19,20,22,24,26,32,40,48,96. Every master was rasterized once from the verified creator binary and frozen. Runtime never loads ImageFont or the TTF. Unsupported sizes raise a clear error rather than silently resampling. Unknown characters emit an explicit warning/diagnostic and render a visible ?.

Advances are stored as exact integers in1/64-pixel units. Accumulated positions use floor((advance64+32)/64), guaranteeing the same integer glyph placements without runtime FreeType or fractional floating-point accumulation. Ink masks remain1-bit. Unlike v2, non-native master advances can be fractional before this fixed rounding. The size16 advances are unchanged: all124 size16 masks, advances, the atlasPNG and seven control strings including VOUCHER are identical to v2.

## Source-guided roles

reference_measurements.json records source URL/hash, approximate ink measurements and method. The source3840×2160 screenshot was measured read-only, normalized by3.75 to1024×576. White/gold threshold ranges estimate visible ink without shadows; CRT/fringing and region selection introduce uncertainty. These are not extracted glyph masks and no screenshot pixels are included.

Recommended main buttons Next/Round/Reroll use19:
- Next:33×14 vs reference≈33×13
- Round:40×14 vs≈40×13
- Reroll:39×14 vs≈39×13

Price badges use24:
- $4:20×18 vs reference≈19×18
- $10:30×18 vs≈29×18

This replaces v2's too-small16 main buttons and too-large32 prices. Stats18 is an explicit optical enlargement: Hands38×12 and Discards57×12 versus measured≈34×11 and51×11. It addresses the perceived small/thin v2 labels at the cost of slightly wider text, so it is not claimed as an exact source match. Options19 is52×18 versus≈52×16. Run/Info role choice remains reviewable.

Source tagline width≈182: master24 gives168×21; master26 gives182×23 versus≈182×20. That is a documented tradeoff; the module does not silently stretch or declare either exact. Counts can use40/48 independently of button/price choices. lineHeight defaults to the frozen master size; the main19 two-line button spacing aligns with the reference's approximately19-pixel line pitch.

## Evidence and tests

../../output/glyph-specimens/button_price_comparison_no_crt.png compares v2 and new role masks, with measured source dimensions. It contains ONLY generated font specimens, no original screenshot crops. The2× copy uses nearest-neighbor. No CRT, blur or shadow is added.

expected_vectors.json stores143 fixed mask sizes, bounding boxes and raw pixel hashes across11 masters. test_font.py renders with ImageFont.truetype deliberately blocked and checks every vector, centering, binary masks and fallback warning. Tests run from /tmp with Python UTF-8 mode disabled. No actual Windows run is claimed for v3. The recipient's previously successful v2 Windows result is not relabeled as a v3 test.

The40px digit4 was inspected separately and compared to the creator TTF's direct single-glyph raster: both upper stems, crossbar and lower right stem are intact. Its apparent L-like shape at reduced viewing size was not an atlas collision or clipping. v2_control_validation.json confirms preservation of size16 assets.

## Authoring versus verification

canonical_metrics.json is authoritative for fixed metrics; PNG atlases are authoritative for pixels. generate_masters.py is an EXPLICIT authoring/reset operation that requires Pillow/FreeType/fontTools and may change masks if rerun under another rasterizer. Do not invoke it during normal runtime or recipient verification. Dependency versions and source binary hash are recorded in generation metadata.

The supplied expected_vectors.json is frozen verification data; do not regenerate it to make altered masks pass. Run test_font.py against the supplied fixed vectors. Normal runtime requires only Pillow for image pixel operations. This is a font module, not acceptance of the entire shop scene.
