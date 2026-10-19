---
name: banner-saga-ui
description: Create original browser-game interfaces with nordic hand-painted travel and war ui. Use for The Banner Saga (2014) as an art-direction reference, not for an official or pixel-exact recreation.
---

# Nordic hand-painted travel and war UI

Use this package to establish an original interface direction for narrative game surfaces. It captures a visual grammar and interaction constraints; the fictional labels, generated artwork, and synthetic values are not game canon.

## Read the local references

- Start with [visual-rules.md](references/visual-rules.md) and [tokens.json](references/tokens.json).
- Inspect the original generated study at [banner-saga-art.png](assets/illustrations/banner-saga-art.png), then use it as a local art cue or crop. Do not stretch it into a screen background.
- Build from the editable fragments in [the component specimen board](assets/components/index.html) and [theme.css](assets/components/theme.css).
- Choose the requested surface pattern in [screen-patterns.md](references/screen-patterns.md); use [demo-state.json](references/demo-state.json) as a synthetic contract example.
- Check provenance, edition boundary, and research limits in [sources.md](references/sources.md).

## Direction and interaction

Austere, weathered, human, and hand-painted. brush-grained fields, carved knotwork corners, stitched seams, smoke-soft edges, narrow red oath marks. Use the palette and type roles in the token file; preserve generous contrast and let illustration carry atmosphere rather than interface state. generic fantasy gold frames, glossy RPG cards, faux runes used as unreadable decoration, copying Stoic character or clan designs.

Treat every choice as stateful. Show the current selection in shape, label, and focus state; expose costs and unavailable reasons before commit; keep cancel/back available; announce material state changes to assistive technology. Keyboard and pointer must reach the same actions. On narrow displays, collapse secondary detail into an explicit drawer or stacked region while keeping the main decision visible.

Create the requested screens as separate compositions. The component board is a set of reusable fragments, not a finished screen shell. Use original names and imagery; the direction is interpretive, non-official, and does not reproduce the source game's proprietary assets.


## Rendered component reference

Inspect [component-board.png](references/images/component-board.png), the actual browser rendering of the editable primitives. This is a component reference; compose the requested screens independently.
