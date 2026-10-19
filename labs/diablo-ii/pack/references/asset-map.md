# Local assets

| Path | Use / provenance |
| --- | --- |
| `references/images/screen-direction.png` | Generated original visual interpretation, 1536 × 1024; not an official screenshot, no editable text |
| `references/images/component-board.png` | Browser capture of local editable board, integrated before freeze; do not treat it as official art |
| `assets/components/index.html` | Editable component specimens; no finished forward-test screens |
| `assets/components/theme.css` | Shared local fonts, textures, bevels, atlas selectors and states |
| `assets/items-atlas.png` | Generated transparent 1536 × 1024 sprite atlas; preserve original alpha |
| `assets/tokens.json` | Named color/type/geometry/behavior tokens |
| `assets/fonts/alegreya-sc/*` | Alegreya SC Regular/Bold plus OFL license; title substitute |
| `assets/fonts/crimson-text/*` | Crimson Text Regular/Bold plus OFL license; body substitute |

Atlas is exactly 3 columns × 2 rows of 512 × 512 cells. Use whole cells as transparent images; do not remove background with a pixel threshold. CSS `.item-art` uses `background-size:300% 200%`; position percentages below isolate one cell. Center an atlas cell inside the item's logical occupied rectangle with contain-like sizing. Keep all gutters and avoid stretching art.

| Icon | Column,row | Pixel origin | CSS position | Suggested backpack cells |
| --- | --- | --- | --- | --- |
| sword | 0,0 | 0,0 | 0% 0% | 1 × 3 |
| hornless iron helmet | 1,0 | 512,0 | 50% 0% | 2 × 2 |
| red potion | 2,0 | 1024,0 | 100% 0% | 1 × 1 |
| round shield | 0,1 | 0,512 | 0% 100% | 2 × 2 |
| amulet | 1,1 | 512,512 | 50% 100% | 1 × 1 |
| flame skill emblem | 2,1 | 1024,512 | 100% 100% | skill icon only |

The logical item footprint is independent of the square atlas region. For a sword in a narrow 1 × 3 bag rectangle, let the transparent sprite box extend only within that rectangle and select a square sized to its narrowest dimension if necessary; a larger tooltip or equipment well can show the same art larger. Avoid using the flame emblem as a tradable item unless explicitly declared by the new scenario.

Original generated files and exact prompts are logged in `generation.json`. All official source links are research provenance, not bundled game assets. The fonts were copied with their OFL texts from the existing local Slay the Spire package; no styling or game imagery was copied from that package.
