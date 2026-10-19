---
name: mirrors-edge-ui
description: Design high-key first-person traversal interfaces with clean architectural space, precise red route signals, mission placards, and transient movement cues. Use for original Mirror’s Edge era wayfinding studies; exclude Catalyst.
---

# Mirror’s Edge visual reference

Use this experimental package for original interface work within the approved 2008 Mirror’s Edge scope. Catalyst is excluded. This is a wayfinding and movement UI study, not an EA asset pack or a screen reconstruction.

Read [visual-rules.md](references/visual-rules.md), [tokens.json](references/tokens.json), [screen-patterns.md](references/screen-patterns.md), and [demo-state.json](references/demo-state.json). Inspect [style-board.png](references/images/style-board.png) for generated architectural context and [the component specimens](assets/components/index.html) for reusable route, placard, and cue pieces. The generated plate is separate from the official EA reference.

Keep the route and surrounding playfield visually open. A map communicates choice, a brief communicates intent, and the movement cue communicates the next action. Use a thin signal-red line and compact red marker to guide the eye; do not turn every control into a red tile or fill normal traversal with permanent panels.

Route names, objectives, timings, key mappings, and cue responses in this package are synthetic. The HTML specimen is local DOM/CSS. It does not emulate the game, its input bindings, or a 3D engine.

## Rendered component reference

Inspect [component-board.png](references/images/component-board.png), the actual browser rendering of the editable primitives. This is a component reference; compose the requested screens independently.
