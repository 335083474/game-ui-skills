# Verified sources and interpretation

Checked 2026-10-16 using Web open.

| Primary page | What was verified | Limits |
|---|---|---|
| [Nintendo: Pokemon Emerald](https://www.nintendo.co.jp/n08/bpej/index.html) | Official Japanese title landing page identifies Game Boy Advance, 2004-09-16 release, Emerald title and 2004 copyright. | This is promotional material, not a full party/bag UI specification. |
| [Nintendo: Hoenn, another adventure](https://www.nintendo.co.jp/n08/bpej/houen/index.html) | Official page describes Emerald as a Ruby/Sapphire version, Hoenn setting and three initial partners; it links game-screen GIFs and official creature art. | Its displayed game-screen links do not directly establish the party/bag contracts in this package. |

The Hoenn page links actual Nintendo game-screen resources including `https://www.nintendo.co.jp/n08/bpej/houen/g_01.gif`, `g_02.gif` and `g_04.gif`. Web confirmed the links but could not display them because that tool does not support GIF content. No official screenshot is copied into this package, and no direct visual inspection of those GIFs is claimed.

The GBA UI grammar in the written rules is an authored reference interpretation informed by the requested game era. `screen-direction.png` is generated, not an official Nintendo screenshot. Its soft shading and simplified party grid are not authoritative. `component-board.png`, once captured, is a browser render of our editable primitives, not a game capture. State contracts and original monster names are demo design choices; do not cite them as Emerald game mechanics.

Pixelify Sans origin: [font](https://raw.githubusercontent.com/google/fonts/main/ofl/pixelifysans/PixelifySans%5Bwght%5D.ttf) and [OFL](https://raw.githubusercontent.com/google/fonts/main/ofl/pixelifysans/OFL.txt). The package copies the existing project-local unmodified font and license. Runtime never requests those URLs.

## Approved runtime sprite fallback

[Tiny Creatures creator upload](https://opengameart.org/node/160872) identifies Clint Bellanger, 16×16 creatures, and CC0 1.0. [Tiny Dungeon creator upload](https://opengameart.org/content/tiny-dungeon) identifies Kenney and CC0. Checked 2026-10-16. The bundled original license files preserve each creator's notice. These are coherent Tiny-style substitutes, not exact Emerald monster art. See asset-map.md for archive entries and CSS cell coordinates. The imagegen atlas failures and changed art scope are recorded in generation.json.

