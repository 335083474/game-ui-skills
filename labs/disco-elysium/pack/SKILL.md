---
name: disco-elysium-ui
description: Create original literary detective RPG interfaces with impasto portrait clippings, a flowing dialogue feed, skill interruptions, and a thought cabinet. Use for The Final Cut menu direction, not generic fantasy dialogue boxes.
---

# Literary detective interface reference

Use the selected **The Final Cut menu direction** to create original narrative, skill, and thought-management screens. This experimental package is an interpretation, not an official ZA/UM resource or a pixel-exact recreation.

Read [visual-rules.md](references/visual-rules.md), [tokens.json](references/tokens.json), and the relevant pattern in [screen-patterns.md](references/screen-patterns.md). Inspect the original impasto portrait in [archivist-portrait.png](assets/archivist-portrait.png) and editable primitives in [components/index.html](assets/components/index.html); the specimen board is not a finished screen. The portrait is local generated art for this package.

Make text the primary surface. Dialogue should flow as a narrow literary column with speaker identity and only a small supporting portrait. Choices stay in the reading flow, while a skill interruption has a distinct voice marker, modifier, and check outcome. The thought cabinet is a pinboard of evolving ideas with visible progress and consequences, not a loot-card collection. Use imperfect painted edges and a restrained dusty palette; avoid glossy gradients, uniform chat bubbles, hero art taking half the screen, and generic dialogue trees.

For [dialogue and check](references/screen-patterns.md#dialogue-and-check), [skills](references/screen-patterns.md#skills), and [thought cabinet](references/screen-patterns.md#thought-cabinet), keep one synthetic case state and invented dialogue consistent. Do not quote the game or reproduce a known character. Use the edition boundary and evidence limits in [sources.md](references/sources.md). Keep choices reversible until the user confirms them; make probabilities and modifiers textual, and never use color as the only sign of a result.

See [USAGE.md](USAGE.md) for an example request. No external network or font files are needed; use the listed system serif / sans-serif stacks.

## Rendered component reference

Inspect [component-board.png](references/images/component-board.png), the actual browser rendering of the editable primitives. This is a component reference; compose the requested screens independently.
