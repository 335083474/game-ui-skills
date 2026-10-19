# Balatro-style shop representative v3

A focused static representative candidate, not a complete Skill or interactive shop. Same shop state: cash9, prices4/4/10/4/4, Hands4, Discards3, Ante3/8, Round1, deck52/52. Nine AI card assets, the accepted ticket geometry and the sculpted SHOP marquee are unchanged. Apply the source delta only over the exact v2 package described in APPLY-v3.md.

## View and rebuild
Open index.html. Native image: output/balatro-shop-1024x576.png; nearest2×: output/balatro-shop-2x.png. These are offline component renders, not browser screenshots. Font comparison without CRT: output/glyph-specimens/button_price_comparison_no_crt.png. Score-fit examples: output/score-fit-cases.png.

Python3/Pillow: run python render.py. Run python check.py and python test_v3.py for supplied verification. Normal rendering reads frozen bitmap masters and exact metrics, never runtime TTF/FreeType. All paths are script-relative and text I/O is UTF-8. Do not run font authoring/reset helpers during verification.

## Focused changes
- B02 revised direction: restore blue(25,312,94,47), red(147,312,94,47), dark28px gap. Blue values right-align and red values left-align toward the gap, with8px horizontal inner margins. Red × centers atx133 in the gap. Glyph-aware fitting selects a supplied frozen master within78×35px boxes; oversized strings raise a clear error rather than clipping.
- B01: separate fixed masks19 for main buttons,24 for prices,18 for sidebar labels,26 for tagline. No final-screen stretch or runtime rasterization. Next/Round/Reroll widths33/40/39 approximately match measured source widths33/40/39; their14px ink is about1px taller. Price$4 is20×18 versus source≈19×18. Stats18 are slightly wider than the source. Tagline26 matches≈182px width but has23px ink versus≈20. All remain reviewable approximations.
- The already-approved32px count roles are retained. Digits4/3/1/0 at32 are pixel-identical to v2, including Hands4. The40px open4 was not clipped, but that optical change is not used for these approved counts. Large cash and score digits remain48.
- B05: visible, gentle domain-warped green flow strands; no radial/concentric formula. This remains soft procedural bands rather than a reproduction of the original fluid marbling.

## Editable sources
- sources/layout.json: state, card positions/prices, score slots and font-role summary
- sources/palette.json: named UI colors
- fonts/canonical/:11 independently frozen font masters, fixed-point advances, exact metrics, test vectors and measured source comparisons
- sources/decor/: unchanged editable ticket/marquee geometry and SHOP letter masks
- sources/generated-card-sheet.png/card-regions.json: unchanged newly generated card art and component separation
- render.py: source composition, palette/geometry construction, glyph fitting and background flow

The creator TTF/attribution remains in fonts/. Font: m6x11 by Daniel Linssen, https://managore.itch.io/m6x11 ; permission recorded as free to use with attribution, not OFL/CC0. Exact game-shipped font variant is unverified.

## Verification status
Recipient v2 Windows verification matched all24 PNG pixels and closed B06 for that delivered v2. This is not relabeled as a v3 result. Cloud v3 checks block ImageFont.truetype, verify143 frozen mask vectors, preserve approved count masks, and test six numeric pairs plus an explicit oversize error. v3 native Windows output and visual acceptance remain pending. See output/v3-test-results.json and SOURCES.md.
