---
name: tunic-ui
description: Build browser-game interfaces with miniature isometric terrain and a separate printed-manual surface. Use for inventory, instruction pages, or island-map studies; this is an experimental interpretation, not official game UI.
---

# TUNIC UI reference

Use this self-contained package to create editable browser-game UI in a miniature-isometric direction. The package separates modeled world geometry from printed paper. It includes original vector studies, not official assets or an engine integration.

Read the [visual rules](references/visual-rules.md), [local tokens](assets/tokens.css), and [usage notes](USAGE.md). Open the [editable component specimens](assets/components/index.html) in a browser. The [direction artwork](assets/references/direction-board.svg) is original vector art, not a game screenshot.

The approved experiments are:

- **inventory:** a few sculpted item silhouettes in a compact, tactile slot grid.
- **manual:** a separate paper leaf with a page number, original diagrams, and short text.
- **island-map:** an oblique miniature terrain fragment with a route marker.

Keep the playfield readable during live movement. Use explicit pause states for inventory and manual, and pause camera look while a pointer-driven surface is active. Use semantic controls, keyboard focus, responsive layout, and local system font stacks. Read [sources and limits](references/sources.md) before treating a visual statement as canonical.

## Rendered component reference

Inspect [component-board.png](references/images/component-board.png), the actual browser rendering of the editable primitives. This is a component reference; compose the requested screens independently.
