# Visual rules

## Scope and signature

The target is the 2012 second-game direction. It should feel like a hand-inked catalogue bolted into an industrial shooter: broad black edges, angular plates, slightly messy hatching, and readable stat evidence. A comic treatment alone is too generic. Weapon silhouettes, loot tiers, current-versus-candidate deltas, and connected skills carry the identity. Do not import later-game UI systems, branded manufacturers, or a generic superhero panel layout.

## Palette, contour, and surface

Use soot black (`#16191b`) as the outer stage, bone white (`#eadfca`) for paper / labels, and worn metal gray (`#65645e`) for neutral panels. Reserve hazard orange (`#f07824`) for selection, shock yellow (`#f0cd39`) for a high-priority modifier, oxidized blue (`#62a2b8`) for shield / element, and sour lime (`#a5ce48`) for a named uncommon tier or recovery. Use tier colors consistently, but always show a tier word and an icon / border distinction. Outlines should be heavy (3–5px on a web adaptation) with hard black offset shadows. Panel edges may be clipped, slanted, or torn; avoid rounded cards, glass blur, fine corporate hairlines, and soft gradients.

Halftone and hatch marks are small accents near a plate edge, empty loading strip, or art boundary. Keep noisy pattern away from dense text. Use a diagonal orange stripe only to mark a selected item or active warning, not as the base of every section.

## Type, weapon art, and numbers

Use a sturdy sans for titles and `Consolas` / `Courier New` for inventory codes and stat columns. Keep text short, uppercase only for small section labels, and body rows 15–18px. Tabular numbers line up. The original local atlas in [comic-weapons.png](../assets/comic-weapons.png) contains three invented tool-like sci-fi weapons; use the silhouette as a side-view icon, not a full bleed background. Show each silhouette at a consistent height and preserve the black contour.

Tier appears as color, named label, and border / icon form. Current and candidate compare in parallel fields with equal units. Positive and negative deltas include `+` / `−`, not just green and red. Element type has a text label beside its small swatch. Never use a decorative bar where a stable numeric value is needed.

## Interaction and hierarchy

- Inventory selection changes the detail pane; it does not equip gear until an explicit action.
- Comparison displays current and candidate states together. The equipped marker stays visible while a candidate is focused.
- A skill node shows dependency, point cost, locked / available / purchased state, and a short mechanical effect. Purchase spends one point once.
- Keyboard focus uses a contrasting double rule or offset outline independent of hover. Disabled items name why they cannot be selected.

Keep the most important item silhouette and comparison at the top of the selected surface. The main playfield should remain visible in a combat HUD; these three package targets are pause / inventory surfaces, so a denser catalogue is appropriate while open. Do not persist a 3D HUD across the entire play area.

## Screen geometry and responsive behavior

Weapon compare uses two angular plates separated by a narrow delta column. Inventory uses an icon grid plus one selected item detail area, not equal-weight cards for every statistic. The skill tree uses a few clearly linked nodes with point cost at the node, not a full-width dashboard grid. At narrow width, the current / candidate values stack but preserve a labeled delta and the equipped state. Keep control targets at least 44px high, allow local scroll in an open inventory, and avoid a horizontal page overflow. Respect reduced motion; reserve strong movement for an explicit purchase or tier reveal.

## Asset boundary

The weapon atlas is AI-generated original art with the full prompt in [generation.json](generation.json). It contains no real firearm model or franchise silhouette. All manufacturer names and game data must be invented. Do not reproduce official logos, weapons, character art, screenshots, or copied asset packs. Keep graphic noise and hard outlines code-native; do not flatten component states into a static background.
