---
name: inscryption-ui
description: Create original Act 1 forest-card interfaces with carved paper, cost pips, sigils, and tabletop trade grammar. Use for the Leshy cabin direction only, not later acts or generic horror dashboards.
---

# Act 1 forest-card interface reference

Use the selected **Act 1 / Leshy tabletop** direction as a design reference. This is an original experimental package, not an official asset pack or a pixel-exact recreation.

Read [visual-rules.md](references/visual-rules.md), [tokens.json](references/tokens.json), and the relevant section of [screen-patterns.md](references/screen-patterns.md). Inspect the carved creature art in [woodcut-creatures.png](assets/woodcut-creatures.png) and editable primitives in [components/index.html](assets/components/index.html); the primitive page is a specimen board, not a finished game screen. The art is original and may be reused locally in work created with this package.

Keep the UI tactile and legible: aged ivory card stock on a dark wood field, rough ink contours, cost marks near the upper edge, creature art as the card's center of gravity, and compact power / health / sigil marks at the base. A reward choice is a card held over the table; a deck view is a binder or card spread; a trade is a physical exchange across a marked table. Do not turn these into a row of modern rounded product tiles.

For this package's three suggested outputs, use coherent invented card data and the same art / token grammar: [card reward](references/screen-patterns.md#card-reward), [deck](references/screen-patterns.md#deck), and [trade table](references/screen-patterns.md#trade-table). Read [sources.md](references/sources.md) for the edition boundary and evidence limits. Never mix in later-act interfaces, official character art, logos, copied card frames, or names from the game. Provide keyboard and pointer selection, distinguish selected / unaffordable / disabled states, and keep text readable over paper texture.

Use [USAGE.md](USAGE.md) for a copy-ready request. All bundled files work offline; no font is copied, and system serif / monospace stacks are intentional fallbacks.

## Rendered component reference

Inspect [component-board.png](references/images/component-board.png), the actual browser rendering of the editable primitives. This board is a component reference; compose the requested screens independently.
