# Visual rules

## HD-2D stage

Preserve the contrast between crisp pixel figures and a dimensional 3D stage. Characters should have deliberate stepped edges and a small readable silhouette. Architecture, ground, and distant scenery can use volumetric light, parallax-like depth, and softened distance. Keep edges crisp around pixel sprites; do not smooth them into painterly characters.

The style is also not a flat full-scene GBA pixel treatment. Give the stage depth through layered lighting, foreground framing, and atmospheric distance. The generated reference image contains an original pixel party in a new plaza; it is not a source-game screenshot.

## Composition and hierarchy

Compose battle controls into the stage: a narrow turn strip near an edge, readable active-member state, and a compact command surface near the active party. Keep the center of the scene open enough to read actors and action. Use a full-width stage for the battle specimen instead of placing a decorative scene in one column and a long unrelated list in another.

Use a compact party rail for roster state. Put equipment comparison on an equipment surface with the chosen actor, slot, current item, preview, and explicit apply/cancel actions. Use the palette from tokens.json. Warm gold marks focus and intent; blue-gray anchors shadow; readable text uses an opaque dark backing where needed.

## State and input

A chosen party member does not become leader until an explicit action. An equipment item stays pending until Apply; Cancel restores the current item. A battle command remains a preview until Confirm action. Example names, stats, and turn order are invented and must not be presented as live game data.

Use semantic buttons with visible focus and a predictable keyboard order. Pair color with shape or a label. Keep targets at least 44 CSS pixels. At narrow widths, let the stage remain first and move commands to a short edge-aligned stack. Respect reduced motion by disabling particles and non-essential camera-like drift.

