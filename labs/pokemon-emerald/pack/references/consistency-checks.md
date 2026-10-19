# Consistency and completion checks

## Visual

- Frame is 240×160 source pixels, integer-scaled without blurry subpixel transforms; page surroundings reflow. At narrow and wide viewports, bottom choices remain visible and no text or cursor is clipped.
- Inspect actual rendered output, not source alone. Hard outlines, cream double frames, restrained teal/green, compact dark pixel typography, numeric HP and PP all remain clear. No modern card chrome, glossy gradients, soft shadow or farming-game wood.
- Party lead and reserves have deliberate hierarchy. Bag pocket/list/description and battle prompt/four-choice 2×2 strip are recognizable. Names, Lv and HP stay grouped.
- Selected, focused, disabled, fainted, low HP, resolving and terminal outcome each have a visible and semantic treatment. HP colors match shared thresholds.
- Both unchanged CC0 sheets are indexed PNGs with transparent palette backgrounds: Tiny Creatures 160×288 and Tiny Dungeon 192×176, each with 16×16 fixed cells. No baked checkerboard, letter substitutes, wrong crop or distortion. Inspect all six documented crop specimens at small display size. No generated atlas should be claimed or required.

## State and input

- Party selection/details/back works for multiple members; target cancellation preserves HP and stock. Full HP, fainted and no-stock healing are rejected. Actual healing caps at maxHp and decrements exactly one item.
- Pockets change content and retain valid cursor; count and selected description match item. Bag healing updates party and battle state. Empty pocket and zero stock are handled.
- Fight opens moves; selected type/PP updates. Confirmed attack spends declared PP once, changes the correct target, receives one turn response, and blocks duplicate clicks. Cancel/no PP spends nothing. Killing blow and terminal outcomes suppress response/actions correctly.
- Battle item/switch uses correct context and turn cost. Failed escape and successful escape have different, observable outcomes.
- Pointer and keyboard navigation both work. Focus stays visible and meaningful after dialogs, pocket changes and state updates. Messages are announced; critical state is editable DOM text.

## Package integrity

- SKILL.md has valid frontmatter and links to the references. agents/openai.yaml names $pokemon-emerald-ui. Relative CSS/font/sprite paths resolve after copying the package.
- All runtime dependencies are local. No CDN, remote font, server, secret or absolute workstation path is required by the consumer.
- Font/OFL and both original CC0 sprite license files are present; generated prompt/output/failure provenance is complete. Generated direction, authored primitives and official links are labelled correctly.
- component-board.png must be a real render capture. Do not claim browser or forward-test evidence from a static reference or from package authoring alone. Keep independent forward-test results outside this frozen package.


