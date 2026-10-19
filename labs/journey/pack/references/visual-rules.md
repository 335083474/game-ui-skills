# Visual rules

## Scene and material

Use broad sand-gold light, weathered sandstone, and a narrow rust-red textile accent. Keep horizons, sky, and open dunes visible. Place chapter gates and path marks into the scene as simple geometry with enough contrast to read. A generated fabric study can guide material and scale, but should not become a full-screen background beneath controls.

Prefer subtle edge labels and a few named waypoints. Avoid permanent meters, large cards, or boxed maps that compete with the world. Progress should be understandable through location names and clear markers; do not invent a percentage when the source state is unknown.

## Symbols and typography

Build original open circles, arches, and geometric cuts from simple shapes. Do not trace proprietary Journey glyphs or use a named character. Use system sans for controls and a local system serif for brief destination names. No remote font is required.

Use the palette in tokens.json. Red fabric is an accent for signal or direction, not the only indication of state. Pair all states with labels or distinct marker shapes.

## State and input

Gate selection is a destination preview. Crossing requires an explicit action. Progress updates only after an explicit crossing event in the target game. A companion signal is a pending expression until the user sends it; never imply that a remote traveler received it unless a real connection confirms delivery.

Use semantic buttons, visible focus, predictable keyboard order, live status text, and touch targets of at least 44 CSS pixels. Under reduced motion, freeze cloth drift and remove non-essential transitions while keeping the selected state clear.

