---
name: darkest-dungeon-ui
description: Build browser-game interfaces with gothic crowquill marks, heavy silhouettes, stained ledgers, and stress as a red signal. Use for expedition roster, provisions, or reward-choice studies; this is an experimental interpretation, not official game UI.
---

# Darkest Dungeon UI reference

Use this self-contained package to create editable browser-game UI in a gothic ink direction. It is a visual reference with original vector specimens, not an official asset pack or engine integration.

Read the [visual rules](references/visual-rules.md), [local tokens](assets/tokens.css), and [usage notes](USAGE.md). Open the [editable component specimens](assets/components/index.html) in a browser. The [direction artwork](assets/references/direction-board.svg) is original vector art, not a game screenshot.

The approved experiments are:

- **expedition-roster:** compact hero silhouette, rank, vitality, and stress. Red is reserved for the stress state.
- **provision-shop:** hand-marked supply objects with quantity and cost close by.
- **expedition-reward:** a small choice of heirlooms with one distinct focus edge and a separate action rail.

Keep information readable and preserve the playable dungeon view when an interface is layered over a live scene. Use semantic controls, keyboard focus, responsive layout, and the local system font stacks. Read [sources and limits](references/sources.md) before treating a visual statement as canonical.

## Rendered component reference

Inspect [component-board.png](references/images/component-board.png), the actual browser rendering of the editable primitives. This is a component reference; compose the requested screens independently.
