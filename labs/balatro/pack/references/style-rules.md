# Visual grammar v1.0.0

## The visual target

Use the approved Balatro-inspired studies as the target: a dark flowing teal table, ivory poker-card surfaces, emphatic pixel typography, thick dark depth shadows and saturated arcade actions. The target is this particular study, not a claim of pixel-perfect reproduction of the game's actual UI.

## Fixed decisions across a screen family

| Role | Value | Usage |
|---|---|---|
| Table base | `#073b36` | Full playfield |
| Table depth | `#062825` | Recessed slots and dark panels |
| Ink / depth | `#101f27` | Text on cream; hard shadow |
| Paper | `#f3e7c9` | Cards and details |
| Paper edge | `#c9bfa6` | Inner card stroke |
| Foreground | `#fff6df` | On dark fields |
| Quiet foreground | `#c0d4c8` | Secondary text on dark fields |
| Primary | `#ef4935` | Confirm, purchase, use; selection mark |
| Primary depth | `#9d2925` | Bottom face of primary button |
| Secondary | `#247eb5` | Navigate, inspect, reroll |
| Secondary depth | `#155373` | Bottom face of secondary button |
| Gold | `#f2bf50` | Currency / price |
| Success | `#36b78d` | Positive completed action |

Exact values also live in `assets/tokens.json`. Reuse them; do not recolor each screen. Illustration shading may use additional shades.

## Geometry and material

- Base spacing unit 4px. Typical gaps 12, 16, 24, 32px. Screen safe area at least 24px desktop, 16px mobile. Content width approximately 1120px on a 1440px canvas.
- Cards: cream fill, 3px navy outline, 2px inset muted-cream line, compact 8px corners, hard offset shadow 0 6px 0 navy. Corner suit marks are small cues, never large competing illustrations.
- Buttons: solid coral primary or blue secondary, minimum 48px tall (44px compact), 3px dark outline, 5px bottom depth face, 4px hard navy shadow. Compact corners; no pill buttons. Press translates down 3px and reduces depth.
- Selected items have coral outline plus `SELECTED`/check. Hover is not selection. Disabled has desaturated fill and no lift. Keyboard focus is visible cream dashed outline on dark / coral on light.
- Inventory slots use the same cream edge and recessed dark field. Do not introduce a grey spreadsheet grid.
- CRT scanlines: decorative, 0.04 opacity, 3px pitch, `pointer-events:none`. No flicker or animation required. Text remains crisp and readable.
- Felt is a secondary flowing teal graphic behind content. No glassmorphism, glossy 3D, neon HUD frames, parchment ornaments or modern white dashboard cards.

## Typography

Bundled Pixelify Sans, weights 600–700 display and 400–500 body. Screen headings 48–64px desktop, 28–36px mobile; card names 22–28px; values 28–40px; body 18–20px; metadata at least 14px. Hard heading shadow 2px 3px 0 navy. Body line-height 1.2–1.4. No all-caps long paragraphs.

The font covers Latin, not Chinese. For Chinese, use the project's available CJK font (default `Microsoft YaHei`, then system sans), without claiming a bundled pixel font. Preserve palette, hierarchy and frame anatomy; test long translated labels.

## Illustration

Reuse the actual atlas. Pixel silhouettes have stepped dark outlines and chunky highlight bands. Same object retains the same illustration and semantic color: red healing potion, green luck crystal, gold purse, blue/silver key, red heart, green chips. Do not switch to emoji, line icons or soft painted icons in one screen.

Atlas is transparent 1536x1024, three columns by two rows. Use square viewports, `background-size:300% 200%`, and asset-map positions. Do not stretch or recolor. The tool left a soft low-alpha halo; this is an illustration characteristic, not a state effect.
