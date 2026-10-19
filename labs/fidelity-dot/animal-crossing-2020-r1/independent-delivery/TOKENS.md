# Tokens and bounded layout
Version: ACNH-suite-candidate-0.1
Units below are logical CSS pixels at 1280 × 720, not physical display pixels.
No general-purpose assertion of an ornament-safe area is made outside these implementations.

## Shared visual roles
Paper cream: Pockets inherited assets; Shop #fffbe7.
Choice pale yellow: #fff0a1.
Ink brown gray: #7b7258 / choice #7e6944.
Highlight turquoise: #03b3c8 / price #00b8d2.
Selection yellow: #ffdf00; Pockets backing and teal ring remain inherited.
Speaker orange: #e8912a, label ink #5d3a1f.
Shelf: rgba(65,44,9,.88), shelf edge #947343.
Fonts: "Arial Rounded MT Bold", "Trebuchet MS", Arial, sans-serif.
These are installed-system substitutes, not bundled or official fonts.
Actual metrics differ; inspect the runtime on the receiver's platform.

## Scaling and tools
Logical stage1280 ×720; scale=min(1,availableClientWidth/1280,availableClientHeight/720),
rounded DOWN to six decimal places.
Available client dimensions are limited by visualViewport when present.
Supported: landscape and actual scaled stage>=960 ×540.
Below that threshold: notice visible, stage.inert=true; full-text/editor remain outside stage.
No overflow-x:hidden trick to pretend a too-wide stage fits.
Review controls and diagnostics remain ordinary document flow after the stage.
Visible nonempty diagnostic is keyboard-operable; clearing overflow hides it.

## Pockets inherited geometry
X centers:345,411,477,543,609,675,741,807,873,939.
Y rows:
160,132,116,111,110,111,112,124,139,157
215,193,179,174,173,175,176,185,202,214
277,256,244,237,233,235,238,246,263,276
338,320,307,301,297,300,305,312,327,341
Button64 ×68; yellow backing48 ×58.
Coordinates are not recalculated from item count: slot is an explicit0..39 position.
Empty items leave gaps, not a different web grid.

### Pockets scorpion visible-body normalization
Source canvas1150 ×1367.
Receiver-measured alpha>=128 body:(221,286)-(925,1162),704 ×876.
Faint alpha>0 bounds are intentionally not used.
CSS framing rectangle:(185,245),780 ×960; ending(965,1205).
Body clearance:left36/right40/top41/bottom43 sourcepixels.
Slot crop viewport55.25 ×68, left4.375 inside64 ×68.
Detail crop viewport91 ×112.
Both reference assets/scorpion.png:
image left=-23.7179487179%, top=-25.5208333333%,
width=147.4358974359%, height=142.3958333333%, object-fit:fill.
The viewport aspect equals780/960, so these paired dimensions preserve source proportions.
Estimated visible body at slot≈49.87 ×62.05 logicalpixels.
This is component framing, not a new PNG or binary alpha cleanup.
Other icons use full-image contain and never inherit this crop.
Receiver actually accepted this v0.3 framing at the representative-screen scope.

## Shop geometry
Shelf:left545/top65/width530/height367; category tab left120/top-45 within shelf,
width290/height54; text28/34px.
Shelf grid:4 columns,2 rows, row130px; column gap4, row gap9; item image86 ×85 contain.
Price25/32px. Goods count1..8; unused positions remain vacant.
Wallet:right27/top48/min-width165/max-width260/height76; numeric38/48px.
Speech:left220/top438/width840/height231.
Speaker:left23/top-22/max-width220/height49; text28/38px; rotation-6deg.
Speech text:left61/right50/top32/bottom27; font38px bold.
Product line height56, one line ellipsis; dialogue line-height1.4 (=53.2px).
Default two-line dialogue plus product line fits the declared region arithmetically;
actual glyph/layout behavior still requires browser verification.
Choice balloon:left846/top251/width434/height231 for2/3choices.
Four choices:top209/height273, same bottom482.
Padding top30/right22/bottom29/left53; gap4.
Choice text30/38px, one line bounded; full labels remain in full text and export.
Selected backing is yellow lower-band; hand55 ×55 left-53 aligned to row center.
Do not hide focus outline or change the imported label to fit.
Bottom hints:right38/bottom10; 28px type/32px line-height.
Full text dialog:up to760px or92vw,85vh; text20px/1.5, internal scrolling.

## Rules for additional screens
These coordinates describe only the existing pages.
Measure every new content region AND hover/keyboard-focus/selection effects.
Do not assume a default unselected screenshot proves clearance.
Do not move diagnostics into decorative regions without an actual clearance check.
Do not apply a crop globally by generic img selectors.
