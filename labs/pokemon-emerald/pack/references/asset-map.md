# Asset map and provenance

| Relative path | Role and origin |
|---|---|
| `references/images/screen-direction.png` | Built-in AI-generated 1536×1024 visual direction; an interpretation, not an official screenshot. |
| `references/images/component-board.png` | Actual browser capture of the editable primitive page, rendered and visually inspected by root during packaging. |
| `assets/sprites/tiny-creatures.png` | Unmodified CC0 Tiny Creatures 1.0 packed sheet by Clint Bellanger, 160×288 indexed PNG with palette transparency. |
| `assets/sprites/tiny-dungeon.png` | Unmodified CC0 Tiny Dungeon 1.0 packed sheet by Kenney, 192×176 indexed PNG with palette transparency. |
| `assets/licenses/tiny-creatures-License.txt` | Original license from creator-uploaded Tiny Creatures archive. |
| `assets/licenses/tiny-dungeon-License.txt` | Original license from creator-uploaded Tiny Dungeon archive. |
| `assets/components/index.html` | Authored offline HTML primitive specimens, not finished screens. |
| `assets/components/theme.css` | Shared source-pixel primitives, integer-scale wrapper, font and exact sprite crops. |
| `assets/fonts/PixelifySans.ttf` and `OFL.txt` | Existing unmodified project font and original SIL OFL; a Latin approximation, not the game font. |
| `references/generation.json` | Exact prompts, output path, failed atlas attempts and approved CC0 fallback. |

## Sprite sheet coordinates

The requested 1536×1024 generated atlas failed at output moderation. No generated atlas or placeholder exists. The approved fallback uses two **unmodified** coherent Tiny-style CC0 sheets acquired from primary creator uploads. They are not official Pokemon art or AI-generated art. Their compact 16×16 monsters approximate content needs while the authored frames and layout carry Emerald identity.

Each cell is 16×16 pixels with no inter-cell spacing. The CSS uses source-pixel crop positions; `.em-sprite` sets `--ss:1`, `.em-sprite--double` sets 2, and `.em-sprite--battle` sets 3. A 16px sprite enlarged by 3 occupies 48×48 source UI pixels. The outer frame then enlarges the UI by its integer scale. Do not use 512px atlas formulas or `background-size:300% 200%`.

| ID / CSS modifier | Sheet | Col,row zero-based | Source x,y |
|---|---|---|---|
| green-dragon | tiny-creatures.png | 4,3 | 64,48 |
| fire-spirit | tiny-creatures.png | 5,4 | 80,64 |
| water-spirit | tiny-creatures.png | 6,4 | 96,64 |
| potion | tiny-dungeon.png | 5,10 | 80,160 |
| tonic | tiny-dungeon.png | 6,10 | 96,160 |
| remedy | tiny-dungeon.png | 7,10 | 112,160 |

Use `.em-sprite--item` for item sheet crops in addition to the ID modifier. At sprite scale k the background position is `(-16*k*column)px (-16*k*row)px`, background dimensions are the sheet's dimensions multiplied by k, and viewport is `16*k` square. Palette and pixels remain unchanged. Front-facing sprites stand in for battle creatures; a mirrored image is not a rear sprite.

Decorative sprites beside names use `aria-hidden="true"`; standalone meaningful sprites need an accessible label. Counts and names remain editable DOM siblings. Ball and berry pockets may be empty in the demo; do not mislabel medicine icons as capture spheres or berries.

## Original acquisition

- Tiny Creatures creator page: https://opengameart.org/node/160872 ; creator download: https://opengameart.org/sites/default/files/tiny-creatures.zip ; entry: `tiny-creatures/Tilemap/tilemap_packed.png` ; license entry: `tiny-creatures/License.txt`.
- Tiny Dungeon creator page: https://opengameart.org/content/tiny-dungeon ; creator download: https://opengameart.org/sites/default/files/kenney_tinydungeon.zip ; entry: `Tilemap/tilemap_packed.png` ; license entry: `License.txt`.
- Archives were read in memory; PNGs and licenses were copied unchanged. Original archives are not packaged. `sources.md` records official-game evidence and font source URLs. `generation.json` records image-generation outcomes and fallback provenance.

CC0 creator credit is retained here voluntarily: Tiny Creatures by Clint Bellanger; Tiny Dungeon by Kenney. All runtime paths are local. Official Nintendo screenshots/art are only linked and not packaged. Provenance does not imply Nintendo endorsement or permission to use official game branding.


