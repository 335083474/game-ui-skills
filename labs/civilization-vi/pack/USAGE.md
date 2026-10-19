# Use this reference skill

Provide your AI the entire package so it can reuse the original cartographic atlas, visual rules, interaction contracts, and editable HTML/CSS primitives.

Example request:

> Use the Civilization VI UI reference skill to create a technology tree, city production queue, and diplomatic trade screen. Keep a shared synthetic turn and treasury, preserve the hex-map context, use navy and gold as structural colors, and implement prerequisite, queue-reorder, and trade-confirm behavior. Save the runnable app and browser captures outside this folder.

Open `assets/components/index.html` to inspect the primitive board. The local atlas is cropped by CSS in `theme.css`; preserve its adjacent asset path or update it.

The package targets Civilization VI and does not blend Civilization VII or a specific expansion UI. No official maps, leaders, screenshots, font files, completed screens, or engine exports are included. All sample data is invented.
