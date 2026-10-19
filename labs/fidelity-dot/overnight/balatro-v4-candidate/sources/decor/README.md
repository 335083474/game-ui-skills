# Balatro-style decor study v2: B03/B04

Two independent newly authored transparent raster components. Frozen v1 files were not changed. No reference pixels, original logo crop, official font or third-party card art are included in these components.

## Outputs and API

- `voucher_art.png`: native 78×122, with no baked caption
- `shop_marquee.png`: native 200×100, including independently drawn SHOP lettering
- Matching `@4x.png` files are exact nearest-neighbor previews
- `draw_decor.py`: editable geometry, colors, compositing and export code
- `shop_letter_masks.json`: canonical editable 35×60 binary masks for S/H/O/P; the generator reads them when present
- `component_specs.json`: output dimensions and integration metadata; it is not a geometry input
- `validation.json`: performed technical checks and review status

With Python and Pillow available, run `python /absolute/path/to/draw_decor.py` from any working directory. It writes outputs beside itself. All text file reads/writes explicitly use UTF-8. No network access or reference image is needed.

For assembly, import the module and call `render_voucher()` or `render_marquee()`. Each returns a native RGBA Pillow image without writing files. `export()` writes the images/specifications.

## Voucher integration

Draw the caption VOUCHER using the shop's canonical bitmap atlas, centered in bounds x9–69/y13–24, color #465971. Fit using actual glyph advance/height; do not replace the caption with a TTF. The artwork intentionally leaves that area blank so the caption stays independent and editable.

The ticket has top/bottom notches open to the transparent outside, a protruding pale header, layered outer/inner contours, discrete pink/plum shading, a cool raised inner plaque and a new white four-lobed/ghost-like emblem. This is not the original voucher artwork. The emblem and material shading are approximations.

## Marquee integration

Use the complete 200×100 component at native size in the 1024×576 scene. SHOP uses independent sculpted masks instead of the ordinary UI font: thick gold faces, stepped rounded contours, pale upper-left bevels, darker lower-right faces and a deep offset extrusion. The warm bulb frame alternates bright and dim layered lights. Do not replace the letter masks with body-font text or bake the external tagline into this component.

## Sources and limitations

The external shop reference was viewed only for visual context. It is not bundled, and no part of it is read by this generator. All geometry and color clusters here are newly authored procedural raster approximation. The underlying model identifier was not recorded in these artifact sources. No official-asset status, source identity, exact likeness or commercial-rights clearance is asserted.

Native and 4× outputs were visually opened. Binary alpha, exact nearest-neighbor previews, deterministic regeneration from another working directory and an isolated edited-letter-mask rebuild were tested. These checks establish construction/editability, not recipient acceptance or visual fidelity.
