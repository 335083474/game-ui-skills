---
name: the-sims-4-ui
description: Create original bright life-simulation interfaces with a selected household member, readable need meters, a searchable build catalogue, and relationship links. Use for the base-game UI hypothesis, not a generic CRM dashboard.
---

# Bright life-simulation interface reference

Use the selected **The Sims 4 base-game UI direction** to create original needs, build-catalogue, and relationship views. This is a reference hypothesis, not an official EA style guide or an exact current-patch reconstruction.

Read [visual-rules.md](references/visual-rules.md), [tokens.json](references/tokens.json), and the relevant [screen-patterns.md](references/screen-patterns.md) section. Inspect the native UI primitive reference in [style-reference.svg](references/images/style-reference.svg) and editable controls in [components/index.html](assets/components/index.html). They are specimens, not finished screens.

Use a white / cool-neutral shell, restrained sky-blue and teal actions, green-positive need states, soft rounded member / object panels, and meters that pair icon and label with their fill. The relationship view is a small connected social graph, not an equal-size contact-card grid. The build catalogue is a searchable object shelf with price, room / category, and one placement preview. Avoid the visual language of a corporate CRM or an analytics dashboard.

Follow [needs](references/screen-patterns.md#needs), [build catalogue](references/screen-patterns.md#build-catalogue), and [relationships](references/screen-patterns.md#relationships) as three separate surface patterns. Keep synthetic household state coherent and never imply that colors or meters represent undocumented game rules. The frozen research entry does not record a build number or completed current-patch UI capture; treat this package as a design hypothesis and re-sample the chosen build before exact replication. Read [sources.md](references/sources.md).

Use [USAGE.md](USAGE.md) for a copy-ready request. All examples and SVGs are locally authored and work offline; no external fonts, portraits, game assets, or screenshots are included.

## Rendered component reference

Inspect [component-board.png](references/images/component-board.png), the actual browser rendering of the editable primitives. This is a component reference; compose the requested screens independently.
