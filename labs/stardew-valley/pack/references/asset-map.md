# Asset map and provenance

| File | Origin and role |
|---|---|
| `images/reward-direction.png` | Exact copy of approved generated study `public/previews/stardew-valley.png`; broad paper board, selection and farm scenery. |
| `images/component-direction.png` | Exact copy of approved generated study `public/style-studies/v2/stardew-valley.png`; close material, slots and counts. |
| `images/component-board.png` | Browser screenshot of `assets/components/index.html`, added during packaging; editable HTML/CSS remains the source. |
| `../assets/items-atlas.png` | Generated six-item transparent sprite atlas using the approved direction as visual reference; not extracted from a game. |
| `generation.json` | Built-in image generation prompt, input references and original source identifier `exec-45b28a94-2283-430b-8695-f94871826786.png`; copied from project QA record. |
| `../assets/components/index.html` | Authored component specimens, not finished reward/inventory/shop pages. |
| `../assets/components/theme.css` | Authored wood/paper components, CSS scenery and fixed-cell sprites. |
| `../assets/fonts/PixelifySans.ttf` | Unmodified Pixelify Sans font copied from the existing Balatro package; original Google Fonts source below. |
| `../assets/fonts/OFL.txt` | Original SIL Open Font License and copyright notice. |

The studies and item images are unofficial AI-generated interpretations. “Stardew Valley” identifies the requested visual inspiration and does not imply endorsement. No official screenshot, logo, extracted texture or game source is supplied. Provenance is documented, but this package does not establish clearance or a warranty for a specific commercial use. The bundled font retains its included OFL terms.

## Fixed atlas coordinates

Atlas dimensions: **1536×1024 RGBA**, three columns and two rows. Each cell is **512×512**. `svui-icon` sets `background-size: 300% 200%` on a square viewport and each modifier chooses one whole cell. A 96px display box uses a 288×192px CSS background. Avoid `<img>` with object-fit for a single item: it would show the whole sheet.

| ID / CSS class | Column,row (zero-based) | Source x,y | CSS background-position |
|---|---|---|---|
| `coins` / `.svui-icon--coins` | 0,0 | 0,0 | `0% 0%` |
| `potion` / `.svui-icon--potion` | 1,0 | 512,0 | `50% 0%` |
| `crystal` / `.svui-icon--crystal` | 2,0 | 1024,0 | `100% 0%` |
| `strawberry` / `.svui-icon--strawberry` | 0,1 | 0,512 | `0% 100%` |
| `watering-can` / `.svui-icon--watering-can` | 1,1 | 512,512 | `50% 100%` |
| `seeds` / `.svui-icon--seeds` | 2,1 | 1024,512 | `100% 100%` |

For a decorative icon beside a text label, set `aria-hidden="true"`. For a standalone meaningful image, use `role="img"` and an `aria-label`. Counts remain editable sibling text; they are not part of the atlas. The coin purse may be wider than other objects within its square cell: preserve its aspect and padding.

Original font file: https://raw.githubusercontent.com/google/fonts/main/ofl/pixelifysans/PixelifySans%5Bwght%5D.ttf

Original license: https://raw.githubusercontent.com/google/fonts/main/ofl/pixelifysans/OFL.txt

Pixelify Sans is a Latin pixel font. Chinese text uses a system fallback; this is not a bundled Chinese pixel-font implementation. No remote font request is needed at runtime.
