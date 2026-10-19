# Assets and provenance

| Local file | Purpose and origin |
|---|---|
| `images/reward-direction.png` | Approved generated study copied from project `public/previews/slay-the-spire.png` |
| `images/component-direction.png` | Approved generated material study copied from `public/style-studies/v2/slay-the-spire.png` |
| `images/component-board.png` | Browser capture of the editable component specimens, added in package assembly |
| `../assets/items-atlas.png` | Newly generated transparent six-object sheet, art-directed from these two studies |
| `../assets/components/index.html` | Editable isolated specimens, not finished screen layouts |
| `../assets/components/theme.css` | Authored shared material system, typography and states |
| `../assets/components/stone.svg`, `paper.svg` | Authored procedural stone masonry and paper grain; no extracted textures |
| `../assets/tokens.json` | Shared authored design values and exact atlas cells |
| `generation.json` | Built-in image generation prompt, the two reference paths and original output provenance |
| `../assets/fonts/alegreya-sc/*` | Unmodified Alegreya SC Regular/Bold and its SIL OFL notice |
| `../assets/fonts/crimson-text/*` | Unmodified Crimson Text Regular/Bold and its SIL OFL notice |

The generated studies and items are unofficial interpretations. No official logo, game screenshot, extracted art or original game files are bundled. The game title identifies the requested inspiration. This provenance record does not establish commercial clearance or warrant all downstream uses. Font reuse follows the included licenses; this package does not relicense those fonts.

## Sprite mapping

Atlas: 1536×1024 RGBA; 3 columns × 2 rows, each 512×512. Every item uses a square element with `background-size: 300% 200%`. `sui-icon` implements these fixed crops. Do not use object-fit on the entire sheet, fractional source guesses or CSS image-rendering pixelated.

| Item ID | Column,row (zero based) | CSS background position |
|---|---|---|
| coins | 0,0 | `0% 0%` |
| potion | 1,0 | `50% 0%` |
| crystal | 2,0 | `100% 0%` |
| scroll | 0,1 | `0% 100%` |
| key | 1,1 | `50% 100%` |
| relic | 2,1 | `100% 100%` |

Keep each item's natural proportions within its square; compare actual transparency over parchment and dark recesses. A slot count is separate editable text, never baked into the object image.

Generation source: built-in `image_gen`, output `exec-81173e74-eb5b-48cf-8bab-5da3b4eb41bf.png`. The prompt is preserved in `generation.json`; its original workstation paths are provenance, not runtime dependencies.

## Font sources

Downloaded unmodified from the official Google Fonts repository:

- Alegreya SC Regular: https://raw.githubusercontent.com/google/fonts/main/ofl/alegreyasc/AlegreyaSC-Regular.ttf
- Alegreya SC Bold: https://raw.githubusercontent.com/google/fonts/main/ofl/alegreyasc/AlegreyaSC-Bold.ttf
- Alegreya SC SIL OFL: https://raw.githubusercontent.com/google/fonts/main/ofl/alegreyasc/OFL.txt
- Crimson Text Regular: https://raw.githubusercontent.com/google/fonts/main/ofl/crimsontext/CrimsonText-Regular.ttf
- Crimson Text Bold: https://raw.githubusercontent.com/google/fonts/main/ofl/crimsontext/CrimsonText-Bold.ttf
- Crimson Text SIL OFL: https://raw.githubusercontent.com/google/fonts/main/ofl/crimsontext/OFL.txt

Web specimen `@font-face` URLs load these files locally. CJK system serif fallbacks are not bundled or represented as local assets.
