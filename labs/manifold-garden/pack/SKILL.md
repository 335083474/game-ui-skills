---
name: manifold-garden-ui
description: Build sparse first-person game UI over impossible repeating architecture. Use for pause, chapter-gate, or spatial-hint components that protect the scene; this is an experimental interpretation, not official game UI.
---

# Manifold Garden UI reference

Use this self-contained package to create editable browser-game UI in a scene-first geometric direction. It includes original vector architecture and interface fragments, not official assets or an engine integration.

Read the [visual rules](references/visual-rules.md), [local tokens](assets/tokens.css), and [usage notes](USAGE.md). Open the [editable component specimens](assets/components/index.html) in a browser. The [direction artwork](assets/references/direction-board.svg) is original vector art, not a game screenshot.

The approved experiments are:

- **pause:** a narrow edge menu shown in a paused state while the scene remains dominant.
- **chapter-gates:** a brief transition label treated as a small architectural marker.
- **spatial-hint:** one geometric glyph and one instruction near an edge.

Keep the first-person playfield readable. Gate camera look while pointer-driven pause UI is open, and restore it after dismissal. Keep the center and lower-middle scene clear during movement. Use semantic controls, keyboard focus, responsive layout, local system font stacks, and reduced-motion behavior. Read [sources and limits](references/sources.md) before treating a visual statement as canonical.

## Rendered component reference

Inspect [component-board.png](references/images/component-board.png), the actual browser rendering of the editable primitives. This is a component reference; compose the requested screens independently.
