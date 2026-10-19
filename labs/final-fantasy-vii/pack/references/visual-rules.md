# Visual rules

## Hierarchy and silhouette

The recognizable unit is a blue rectangular window, not a floating modern card. It has a bright upper-left edge, dark lower-right interior and a fine light frame. Multiple windows abut or overlap by a few pixels; spacing is functional. The outside stage is almost black. Do not add an ambient futuristic background, giant game title, sidebar icons, rounded cards, blurred glass, luminous outlines or cinematic marketing artwork.

Use a 4:3-like composition for menu content inside a wider viewport. On desktop a useful shell is 960–1120px wide with 16–24px text. The original was far smaller; these dimensions are an accessible Web adaptation, not measured game pixels. Preserve small type relative to windows and compact vertical rhythm. At 1440px wide, a party portrait around 88–108px and a 26–32px command row read as classic menus. Main labels are the same scale as list entries. A help strip is one line where possible.

## Gradient and frame

Base corner colors: top left #0000b0, top right #000080, bottom left #000050, bottom right #000020. These are the package's classic-blue interpretation. CSS may use a layered gradient approximation; every window must use the same formula. Never substitute a cyan-to-black diagonal or transparent overlay.

Frame recipe at 1× Web scale: 1px dark outside edge, 1px light silver outer stroke, a dark 1px inset gap and white/silver inner highlight. The supplied CSS uses a 2px border plus inset shadows. Radius 2–3px only; avoid cartoon-thick borders. Leave at least 12px interior clearance for text, and an additional 20px cursor gutter on selectable rows.

## Type and numbers

Bundled IBM Plex Sans is an OFL-licensed substitute, not the extracted game font. Use regular 400 or medium 500, normal case, 18–22px list text at a 1120–1280px board width, line height 1.2–1.35. Use tabular numerals and small black text shadows. No serif, brush display type, faux-terminal all-caps or pixel font with wide letter spacing. Small structural labels may be pale cyan; primary names and values are white. Muted unavailable entries remain legible grey; selected white pointer remains clear.

Right-align numbers, including current/max HP, MP, item counts, spell MP cost and equipment comparisons. Keep digits stable when values change. Equipment comparison columns have separate current, arrow and preview cells; do not make a sentence out of every stat. Improvement is pale yellow/green with + delta, loss is muted red with − delta; unchanged values remain white.

## Selection and states

Use one white right-facing triangle or a small white hand at the row's left. The supplied triangle avoids dependence on an emoji font. A keyboard focus ring may follow the same silver inset frame. Do not select by changing the entire row into lime, cyan, magenta or a rounded pill. Hover is a modest brighter blue; focus and committed selection are distinguishable. Disabled commands show a reason in the help line and cannot mutate state.

## Party, equipment and battle anatomy

- Party: three compact portrait rows in one shared window, portrait left, name/level beside it, numeric resources and skinny bars in aligned columns. Distinguish active member with cursor. Place vertical menu commands in a narrower neighboring window. Small time/gil/location windows may anchor a lower edge.
- Equipment: compact member header, Weapon / Armour / Accessory slots, dense candidate list, aligned current→preview stat table and a short help strip. Weapon and wristguard use the small item art; the green orb represents materia, not a replacement for the entire equipment list. Materia sockets can be tiny circles with subtle metal outlines.
- Battle: quiet arena occupying the upper part; compact command window overlapping a bottom status band, status columns Name / HP / MP / Limit / Time. Spell/item submenus extend alongside the command window. Show target pointer in the arena or a small named target window. Arena art is optional; the menu system must carry recognition without it.

## Resource colors

For this reference adaptation, party HP uses green and MP uses magenta, with explicit HP/MP labels and fractions. The supplied art direction asks for both colored gauges; do not mistake this choice for an assertion that all original FFVII HP/MP bars had those colors. In battle, Limit is magenta and Time/ATB is green/yellow, matching the official gallery's separate gauge semantics. Never label a magenta Limit bar MP. In every case numeric HP/MP state determines fill width.

## Art

Use the atlas's three painted original characters as Rook (scout), Bran (guard), Lyra (mage). Their busts stay rectangular, inside portrait viewports. No circular avatars, letter initials, emoji portraits or modern 3D renders. Use the same crop on every screen. The atlas has actual alpha and broad transparent gutters; its RGB hidden behind zero alpha can appear dark if a viewer discards alpha. Preserve alpha and never remove background with a color-key filter.

## Responsive adaptation

At narrow widths, place command and help windows below the main data window. Keep at least 16px type and 40px interactive hit areas using transparent padding while the visible command line remains compact. Tables can scroll within their own framed window if necessary. Do not shrink the entire stage to unreadable miniature text. Respect reduced motion; cursor and resource changes need no animation.
