# Current layout: hades-draft-v2.10

Authoritative inputs: spec.json. Run python build_spec.py to regenerate; python build_spec.py --check detects drift. No historical overrides apply.

Scene is16:9 fitted below42px toolbar with8px page padding. Portrait left0/top19%/width30%/height81%; background covers scene. Main panel left24%/top15.5%/width53%/height73.5% for3 options (bottom89%); counts2/4 retain84.5%, border3 scene cqw. Choose one left28%, top calc(15.5% +3.04cqw), size1.6 scene cqw, line-height1.1; it is below the border in black interior.

## 2 options
- --list-left: 27.65%
- --list-top: 33%
- --list-width: 45.5%
- --list-gap: 1cqw
- --row-text-top: 4%
- --row-text-bottom: 4%
- --body-row-size: 3.841758cqw
- --boon-title-size: 3.63956cqw
- --stat-row-size: 2.72967cqw
## 3 options
- --list-left: 28.4%
- --list-top: 27%
- --list-width: 44%
- --list-gap: .3cqw
- --row-text-top: 4%
- --row-text-bottom: 4%
- --body-row-size: 3.972727cqw
- --boon-title-size: 3.763636cqw
- --stat-row-size: 2.822727cqw
## 4 options
- --list-left: 33.4%
- --list-top: 31.5%
- --list-width: 34%
- --list-gap: .15cqw
- --row-text-top: 1%
- --row-text-bottom: 1%
- --body-row-size: 5.19cqw
- --boon-title-size: 4.82cqw
- --stat-row-size: 3.65cqw

Font units: body/title/stat tokens are row-container cqw; heading/label/frame units are scene cqw. At1024scene width, all counts retain body≈17.9–18.1px. Three-row width44% is a disclosed adaptation from reference≈46% to preserve readable density and retained alpha>1 glow under the interior label; do not call original composition fidelity approved. Four-row gaps are intentionally tight.

Text starts23% of row, right6%. Symbol left2%, width17.2%, square and vertically centered; icon92% within, CSS diamond frame extends3%. Default title line-height1.15/body1.2/stat inherits1.25. Four-row title/body/stat1.1. Description preserves newlines, maximum2lines. There is no reliable universal character limit: at1024 scene width aim for about35–40 ordinary English characters per line, fewer with wide capitals; explicit two-line fixture uses short plain sentences, and recipient normal copy must also be checked. Never truncate data to a character count; genuine overflow is reported and full copy available in dialog, never treated as a fit pass.

## Raster geometry
```json
{
  "row": {
    "normal": "components/neutral-row-v27.png",
    "normalCanvas": [
      1942,
      809
    ],
    "normalAlpha32": [
      25,
      165,
      1918,
      600
    ],
    "selection": "components/selection-overlay-v27.png",
    "selectionCanvas": [
      1945,
      809
    ],
    "selectionAlpha32": [
      22,
      161,
      1925,
      607
    ],
    "core": [
      1893,
      435
    ],
    "origin": [
      25,
      165
    ],
    "normalAlphaNonzero": [
      0,
      23,
      1923,
      728
    ],
    "selectionAlphaNonzero": [
      0,
      13,
      1944,
      809
    ],
    "renderViewport": [
      10,
      151,
      1935,
      619
    ],
    "normalAlphaAbove1": [
      23,
      162,
      1920,
      603
    ],
    "selectionAlphaAbove1": [
      10,
      151,
      1935,
      619
    ],
    "viewportPolicy": "Choice-screen CSS clips only source margins with alpha<=1; all alpha>1 retained. Source PNG bytes unchanged. Full canvas containment no longer claimed for three-row layout."
  },
  "header": {
    "asset": "components/header-banner.png",
    "canvas": [
      2206,
      713
    ],
    "slicesX": [
      0,
      450,
      1756,
      2206
    ],
    "width": "77%",
    "left": "12.5%",
    "top": ".2%",
    "titleCenterY": 292.5,
    "subtitleCenterY": 480,
    "titleLineHeight": 1.5,
    "tracking": ".3845em",
    "titleTargetWidth": "approximately42% scene width for BOONS OF HERMES, font outline advances plus CSS letter spacing; actual browser measure pending"
  },
  "frame": {
    "asset": "components/greek-frame-v27.png",
    "canvas": [
      1448,
      1086
    ],
    "alpha32": [
      34,
      69,
      1415,
      1030
    ],
    "slices": [
      190,
      155,
      180,
      155
    ],
    "border": "3cqw",
    "repeat": "round"
  },
  "emblem": {
    "asset": "components/hermes-emblem-v27.png",
    "canvas": [
      1254,
      1254
    ],
    "alpha32": [
      19,
      5,
      1240,
      1244
    ],
    "box": "left3% top4% width12.5% square"
  },
  "icons": {
    "canvas": [
      1254,
      1254
    ],
    "evasionAlpha32": [
      0,
      0,
      1254,
      1253
    ],
    "hasteAlpha32": [
      0,
      0,
      1254,
      1254
    ],
    "strikeAlpha32": [
      1,
      0,
      1247,
      1242
    ],
    "symbolWidth": "17.2%",
    "imageWithinSymbol": "92%",
    "left": "2%",
    "textStart": "23%"
  }
}
```
Normal/selected scale is rowWidth/1893 with source origin25,165. Distinct1942/1945 canvas widths are preserved. Choice-screen rendered viewport bounds must fit panel interior and clear label. R20 clips only alpha<=1 margins; every source pixel with alpha>1 is retained. Full source-canvas containment is not claimed for three rows. Four-row prior full-canvas checks remain supplemental/strict; alpha>=32 alone is never the pass criterion.

Header uses same unchanged PNG in3CSS slices; x0–450 and1756–2206 endcaps retain scale sceneWidth*.52/2206, central1306px extends horizontally. Overall width77%, left12.5%, top.2%. Canvas aspect169862/37076, upward205/713 shift. Heading source center292.5, line-height1.5; subtitle480, line-height1. Header seams and center weathering elongation remain unverified.

Greek frame uses border-image slices190/155/180/155, round edges. Tooltip left76%/top64%/width23%/height24%, right edge99%. Body and status use the safe-panel grid. Medallion is independent of portrait.

## Safe content/status API
{
  "contract": "CSS grid rows minmax(0,1fr) auto; border-box panel, safe inner padding, body and status are grid children",
  "padding": ".8 scene cqw",
  "gap": ".8 scene cqw",
  "statusFont": "1 scene cqw",
  "statusLineHeight": 1.3,
  "statusBottom": "panel.bottom - computedBorderBottom - computedPaddingBottom",
  "bodyBottom": "status.top - computedRowGap",
  "baseOwner": "right tooltip left76% top64% width23% height24%, border2px",
  "overviewOwner": "right detail panel left53% top22% width42% height66%, border2.7 scene cqw",
  "failure": "If long body or status overflows, report measured bounds; never place text on border or reduce font automatically"
}
Use safe-panel.css and safe-panel.js. Outer panel owns its real border; direct children are .safe-panel-body and .safe-panel-status. Grid reserves status's actual wrapped height, safe padding and gap. Never absolutely position status on the frame. HadesPanelLayout.measure(panel) returns inner/body/status rectangles and inside/bodyFits/statusFits/textFits; check() refreshes visible overflow warnings.
Example markup: <aside class="safe-panel"><div class="safe-panel-body"><h2>Confirm replacement</h2><p>Editable confirmation</p></div><p class="safe-panel-status" role="status">KEPT</p></aside>.
Set owning panel dimensions for the screen. Success: normal body/status fit flags are true and all text stays within inner bounds. Failure: long body/status reports overflow; enlarge/reflow panel or shorten authored copy, never shrink automatically or put text on border.

## R21 heading measurement
English1920 reference heading approximatelyx561–1360 (41.6%scene width);720 guide approximatelyx212–511 (41.5%). Candidate target42%. SpectralSC-Regular BOONS OF HERMES advance9.788em over15characters at2.7scene cqw; old.045em spacing predicted28.25%scene width. New.3845em predicts42.00%, unchanged font and linebox. Browser kerning/letter-spacing and title bounds require recipient measurement; no font/fidelity pass claimed. Longer alternate titles may overflow and must warn.

## R20 default-three frame and CSS viewport
Default3: frame top15.5%, height73.5%, bottom89%; list top27%, width44%, gap.3scene cqw. Rows/fonts/label widths remain unchanged fromv2.9. Counts2/4 retain independent84.5% frame height and prior positioning. With1024scene width, third core bottom is approximately82%scene height; retained viewport bottom approximately82.75%, inside frame innerbottom83.67%, leaving HUD/background below89%.
Source viewport x10–1935,y151–619 applies to choice row normal/selected canvases. Normal1942x809 clip margins top151,right7,bottom190,left10; selected1945x809 top151,right10,bottom190,left10. Excluded margins contain only alpha0or1; alpha1 is1/255 (0.392%opacity). All alpha>1 pixels remain: normalbbox(23,162)-(1920,603),selected(10,151)-(1935,619). CSS clipping is documented, not described as pure alpha0 removal; PNG bytes/hashes unchanged. Overview geometry is unchanged. Browser seams/fidelity remain pending.
