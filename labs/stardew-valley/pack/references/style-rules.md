# Visual rules · warm pastoral pixel craft

## What the approved images establish

`reward-direction.png` shows a large cream paper board held by dark outer wood, warm orange inner bevels and blocky corner fasteners. Each choice remains a separate framed paper surface. Selection adds a bright amber inner frame plus an explicit selected strip. The background is rural depth: grass, fence, trees, mountains and a small farmhouse.

`component-direction.png` brings the camera closer to material construction. Its square inset slots carry large crisp objects with count text at the lower right. A sprout medallion bridges the board's top edge; leaf clusters and small flowers stay at the perimeter. Use this for material and ornament, not as a requirement to add a sprout to every header.

## Fixed material hierarchy

| Layer | Rule |
|---|---|
| Scenery | Blue daylight, leafy greens, sparse cream flowers and wood fence. Keep the area behind text quiet. |
| Outer frame | Dark brown hard silhouette; 12px warm wood; light top/left and dark bottom/right bevel; 8px hard lower depth. |
| Paper | Warm cream, with subtle light/shade bands. A flat CSS surface is preferable to noise that harms labels. |
| Inner card | 6px wooden frame and recessed paper interior. Read as a wooden tray, not a playing card. |
| Slot | Square inset, 4px frame, same paper family; lower-right quantity in dark brown. |
| Primary control | Amber face, cream upper shine, orange/brown lower lip; visible 5px depth. |
| Secondary control | Muted leaf green; retain the same hard wood construction. |
| Text | Dark brown on paper. Main heading 44px, body 18px. English pixel type; readable CJK fallback. |

Numbers in tokens are Web CSS pixels at 100% zoom. Adjust composition responsively without silently changing the common material tokens.

## Shape and pixel treatment

- Use square corners or stepped corner cuts. Avoid pill shapes, glass panels, blur shadows, smooth vector icons, neon, CRT overlays, poker motifs and scanlines.
- Create depth with discrete nested borders and hard offset shadows. A gradual low-contrast paper fill is allowed, but edges remain crisp.
- Base layout spacing on 4px. Keep panel padding 24–32px on desktop and at least 16px on narrow screens.
- Keep main sprites approximately 80–112px within 112–144px slots; use the whole fixed 512px source cell. Use `image-rendering: pixelated`, no blur filter, and avoid CSS rotation of sprites.
- Let leaves, studs, dividers and flowers decorate edges, never overlap names, prices, quantities or focus indicators. No ornament carries essential information.
- Code-drawn scenery may use stepped hills, grass marks and a fence. A new large background illustration is optional. Neither approved reference may be pasted beneath working DOM controls.

## State anatomy

| State | Required visible result |
|---|---|
| Rest | Wood frame, cream surface, readable label. |
| Hover | Amber edge/upper highlight; no large movement or scale. |
| Pressed | Lower the face by 3px and reduce the depth lip. Keep the hit target stable. |
| Selected | Amber frame, check and text marker; expose `aria-pressed` or an appropriate selected state. |
| Disabled | Muted paper/wood, explanatory text, native disabled behavior. Retain readable contrast. |
| Focus | Dark green 3px outline with 4px offset; do not remove it for visual purity. |

Use a native button for actionable cards, with content spans instead of nested buttons. Show changes in a visible status region; do not rely on color or a transient animation alone. Respect `prefers-reduced-motion`.

## Intentional variation

Keep the same materials but vary page silhouette: a ceremony-like reward board, a utilitarian inventory grid with a side detail pane, and a market counter/catalog with purchasing detail. A consistent system is recognizable even when these layouts differ.
