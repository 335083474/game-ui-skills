# Using the Manifold Garden reference package

Start with [SKILL.md](SKILL.md), read [visual rules](references/visual-rules.md), then inspect the [component specimens](assets/components/index.html). The board shows interface fragments against original scene art, not finished full-screen outputs.

## Local files

- [tokens.css](assets/tokens.css) defines the geometric palette, local font stacks, and specimen styling.
- [components/index.html](assets/components/index.html) shows the three approved screen patterns.
- [direction-board.svg](assets/references/direction-board.svg) is original vector artwork made for this package.
- [authoring status](authoring-status.json) lists screen IDs and current scope.

No remote runtime assets, custom fonts, JavaScript dependency, or build step is required. Open the HTML directly, or copy its HTML, CSS, and SVG with relative paths. Replace sample names and state with user-provided content; do not present invented values as live game state.

This is an experimental visual reference. It does not include game logic, camera-input wiring, framework integration, verified runtime behavior, or canonical game assets.
