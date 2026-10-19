# Visual rules

## Art direction

A playable corridor first, with a few blunt instruments at the edge of the view.

## Reusable grammar

- Keep the imagined playfield dominant. Use a hard-edged first-person corridor, low-resolution texture blocks, strong vanishing lines, and a small HUD anchored to the frame edges.
- Render UI silhouettes with chunky pixels and limited colors: bone/cream for stable information, red for health or threat, gold for ammunition, and restrained green for a positive state. Never blur or antialias the intended low-res art.
- Weapon choices are a compact, readable strip of silhouettes and ammo counts. Combat HUD components must show their perimeter relationship to the scene, not become floating app cards over the center.
- Pause settings are plain, decisive controls with keyboard focus and a clear selected state. They can be denser than the live HUD because gameplay is paused.
- Do not blend the DUSK HD remaster or modern high-resolution reinterpretations into the 2018 original direction. Keep the original art study separate from any official assets.

## Screen patterns

Read [screen-patterns.md](screen-patterns.md) for the three screen contracts. Reuse only the components that serve the requested task.

## Source and accuracy boundary

The product page and original-art boundary are recorded in [sources.md](sources.md). Treat every supplied number, item, route, and status as a synthetic specimen unless a future output has its own authoritative data source.
