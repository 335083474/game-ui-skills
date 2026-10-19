# Visual rules

## Frame and density

A GBA screen is 240×160 pixels, aspect 3:2. Work in that coordinate system and enlarge the whole surface by a whole number: 2× = 480×320, 3× = 720×480, 4× = 960×640. Surroundings may reflow independently. Avoid fractional CSS transforms, device-width stretching, large browser headings inside the frame, or viewport-sized UI cards. Leave browser controls and page navigation outside the game surface.

Use hard stepped 1–2px outlines, mostly flat fills and tiny 1px accents. Cream message interiors sit within a navy border, narrow light inset and dark inner keyline. Avoid rounded modern control silhouettes. A party tile may have a tiny stepped corner rather than a CSS radius. Pixel edges must remain hard at the chosen scale. The generated direction image includes some soft shading; do not reproduce that softness in code.

## Typography and color

Local `PixelifySans.ttf` is a practical redistributable approximation, not the game's original font. Use 9–11px source-sized text, normal weight, 1.1–1.2 line height. Test real strings such as `CHARCOAL`, `SUPER POTION`, `Lv12`, `24/36`, `PP 14/20`; do not replace copy with meaningless blocks. Names and counts are separate elements. Use dark navy rather than pure black and cream rather than pure white. Keep all text high contrast. Use short Latin labels in this experiment; a system CJK fallback is not proof of localized GBA glyph fidelity.

The strongest color field belongs to party/bag structure: muted teal, green and blue-green. Cream is a reading surface, orange-red is a small selection accent, and bright green/yellow/red convey HP. Do not make every component neon emerald. Avoid texture overlays, paper grain, wood or scanlines.

## Anatomy by surface

- **Party:** an emphasized lead member on the left, five compact reserve entries on the right, arranged vertically. Name, gender if used, Lv, HP bar and HP numbers stay together. Bottom cream instruction box and a small Cancel affordance. For an expanded Web layout, preserve lead-vs-reserve hierarchy rather than turning all six into modern equal profile cards. The generated board's 2-column grid is only a sprite/plate study.
- **Bag:** compact pocket tabs at top, bag silhouette or selected-item icon at left, cream list at right, quantities right-aligned, and a bottom description box. Pockets: Items, Poké Balls, TMs/HMs, Berries, Key Items. `Battle Items` is a category inside Items, not a sixth canonical pocket. Keep empty-pocket behavior and list scrolling explicit.
- **Battle:** opponent plate upper left, player plate lower right, creature regions around the center, bottom strip approximately 44–48px tall. Default strip has prompt at left and 2×2 commands at right: FIGHT / BAG / POKéMON / RUN. Fight reveals up to four move choices plus type/PP detail. Avoid a modern full-width action hotbar.

## States and input

A dark triangle indicates the active menu row. Selection uses cream/light green with a small stepped orange border; keyboard focus must remain independently visible. Disabled rows retain legible labels and explain the reason when activated. Low HP changes bar color with the numeric ratio. Fainted shows `FNT` and empty HP; do not identify it by color alone. Menus preserve cursor position when returning. Use real buttons, tab roles for pockets, and live text for action messages. At scale 1 a small button may be historically compact; enlarge the pointer target with outside padding or provide a separate accessible page control without distorting the frame.

No official sprite extraction, logo, or copied game screen is included. The CC0 substitute creatures/items and demo combat rules support working UI examples; they are not claims of exact Emerald simulation.

