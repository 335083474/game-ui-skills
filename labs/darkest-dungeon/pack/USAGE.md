# Using the Darkest Dungeon reference package

Start with [SKILL.md](SKILL.md), then read [visual rules](references/visual-rules.md) and inspect the [component specimens](assets/components/index.html). This board contains reusable component fragments, not finished full-screen flows.

## Local files

- [tokens.css](assets/tokens.css) defines the palette, system font stacks, and specimen styling.
- [components/index.html](assets/components/index.html) shows three approved screen patterns.
- [direction-board.svg](assets/references/direction-board.svg) is original vector artwork made for this package.
- [authoring status](authoring-status.json) lists the approved screen IDs and current scope.

No remote runtime assets, custom fonts, JavaScript dependency, or build step is required. Open the HTML file directly, or copy its HTML, CSS, and SVG with relative paths into a project. Replace sample names and state with user-provided content; do not present invented values as live game state.

This is an experimental visual reference. It does not include game logic, framework integration, verified runtime behavior, or canonical game assets.
