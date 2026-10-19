# Visual rules

## Read the two references together

The reward study has a blue-black vaulted ruin, distant cool arches and small torch pools at the sides. Its three tall choices have slate frames, irregular gold corners, large painted objects and parchment name/effect areas. The selected middle choice has a heavier warm edge, modest glow and an explicit selected plaque. Its centered title is warm gold, and the subtitle is a muted cool gray.

The component study is closer and more tactile: a large weathered paper card, a painterly red potion, square recessed inventory tiles and a long deep red button encased in old gold. Its rough paper and red action refine the first reference. Keep the first reference's legibility and quiet background while borrowing the second's worn edges and warm material contrast. Do not introduce elaborate ornament on every small label.

## Material and color

| Layer | Treatment |
|---|---|
| World | Near-black blue/green stone, broad uneven masonry, distant cool arches; torch amber at the outer edges |
| Recess | Matte charcoal/slate, dark inner edge and a subtle surface grain |
| Metal | Old ochre-gold, dark brown bevel, a pale broken highlight; clipped or chipped corners |
| Paper | Tan parchment, warm fiber/grain and uneven edge; dark umber text |
| Primary action | Deep red painted inset with gold frame; cream serif label |
| Selection | Brighter gold, slightly raised object, label/check; low-intensity warm halo |
| Disabled | Desaturated, darker surface with readable explanation; do not rely on opacity alone |

Base palette: dungeon `#10191e`, stone `#26343b`, recess `#172126`, old gold `#a77a3d`, highlight `#e4bd71`, parchment `#cfb17b`, ink `#30251c`, action `#8f2f29`, action hover `#ad4032`, light copy `#eee0bc`, cool muted copy `#a8b7b6`. Read the token file for exact Web values.

## Shape and texture

Prefer tall card silhouettes, square inventory cells and broad low action plaques. Borders are 2–6px at desktop scale, with clipped corners and uneven inner highlights. Gold sits around stone or red; parchment sits within a frame. Use modest shadows close to the surface rather than soft floating SaaS cards. Keep radii near zero except painted object silhouettes. Texture is secondary to readable text and cannot substitute for geometry.

Do not add CRT scan lines, chromatic aberration, casino felt, poker suits, pixel art, glossy rounded pills, neon gradients or modern dashboard cards. This is a hand-painted dungeon system, not another pack with recolored tokens.

## Typography

Bundled Alegreya SC is the title, item-name and action face. Crimson Text is the body, price and quantity face. Use normal character spacing for prose and slight tracking for short all-caps labels. Desktop guide: display 44–56px, page heading 32–40px, item title 25–30px, body 20–22px, support 17–18px. Numbers must remain easy to scan.

Fonts cover Latin. For Chinese content, keep the hierarchy and use an available CJK serif (`Songti SC`, `STSong`, `SimSun`, then generic serif); these are system fallbacks, not bundled font assets. Check the actual rendered language. Do not force a Latin font to supply missing CJK glyphs or claim fully local CJK coverage.

## Composition and motion

Give the central task a clear reading order. Background ruins remain low contrast. Leave breathing space around art and a consistent baseline under item names. Use 120–180ms hover/press transitions with a small lift and edge change; selected does not pulse. Respect reduced motion. At narrow widths, reflow real components into rows or a single column instead of shrinking the entire scene.
