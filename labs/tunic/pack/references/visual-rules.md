# Visual rules — miniature geometry direction

The implementation plan distinguishes TUNIC's miniature-isometric family from HD-2D and asks that world modeling and paper instructions stay separate. The official source calls the game isometric and describes a reconstructed Instruction Manual containing maps, tips, techniques, and illustrations. This package uses those cues for original studies; it does not reproduce official page art or claim exact UI fidelity.

## Two visual surfaces

- **Miniature world:** use an oblique view, chunky terrain ledges, visible top planes, short cast shadows, coherent scale, and a compact palette of moss, water, cream stone, and golden light.
- **Manual:** use an independent warm paper field with a page number, printed diagrams, a restrained serif heading, and original abstract glyphs. Do not apply the scene's lighting or bevels to paper.
- **Inventory:** show a few recognizable item silhouettes in tactile slots. Keep each object's shape and proportions intact.

## Type and hierarchy

- Use a local friendly sans-serif for inventory labels and a local serif for manual headings. Reserve a small system monospace face for page numbers, item state, or coordinates.
- Keep item name and function close. Keep long instructional text on the manual page.
- Use amber for focus or one important marker, not for every edge.

## Approved patterns

- **inventory:** compact slot grid, clear active state, and item name/function close to the selected object.
- **manual:** separate paper surface with numbered leaf, heading, short text, and original diagram marks.
- **island-map:** an oblique terrain model with water, stacked landmarks, and a small route or player marker.

## 3D playfield protection

During live movement, keep the modeled world readable and show only a small objective or interaction hint near an edge. Open inventory and manual through explicit pause states; pause camera input while a pointer-driven surface is active. Keep the center and lower-middle playfield clear. On mobile, reduce visible slots or crop the miniature map without flattening its depth cues.

## Local assets

- [Tokens](../assets/tokens.css)
- [Editable specimens](../assets/components/index.html)
- [Original vector direction artwork](../assets/references/direction-board.svg)
