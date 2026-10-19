# Assets and provenance

| File | Role and origin |
|---|---|
| `images/reward-direction.png` | Approved generated reward study from project `public/previews/balatro.png` |
| `images/component-direction.png` | Approved generated study from `public/style-studies/v2/balatro.png` |
| `../assets/items-atlas.png` | New six-item art made with built-in image_gen using both studies as style references |
| `images/component-board.png` | Browser screenshot of the editable specimen page, added during packaging |
| `../assets/components/*` | Authored HTML/CSS primitives and deterministic felt drawing |
| `../assets/fonts/PixelifySans.ttf` | Unmodified Google Fonts Pixelify Sans; included SIL OFL at `../assets/fonts/OFL.txt` |

Studies and items are AI-generated interpretations. No official game logo, screenshot, source files or extracted textures are distributed. Balatro identifies the requested inspiration; the package is unofficial. This prototype records provenance and does not represent a clearance or warranty for every commercial use. The font retains its included OFL terms.

## Atlas positions

1536x1024 RGBA, six 512px square cells. Use a square CSS background box, `background-size:300% 200%`; not object-fit on the whole sheet.

| ID | Column / row, zero-based | Background position |
|---|---|---|
| coins | 0 / 0 | 0% 0% |
| potion | 1 / 0 | 50% 0% |
| crystal | 2 / 0 | 100% 0% |
| heart | 0 / 1 | 0% 100% |
| key | 1 / 1 | 50% 100% |
| chips | 2 / 1 | 100% 100% |

`bui-icon` implements these positions. Use common viewports for comparable items; coin purse is wider than potion. Verify over cream and dark surfaces.

Font source: https://raw.githubusercontent.com/google/fonts/main/ofl/pixelifysans/PixelifySans%5Bwght%5D.ttf

Font license: https://raw.githubusercontent.com/google/fonts/main/ofl/pixelifysans/OFL.txt
