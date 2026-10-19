# Zelda-style pixel UI Skill candidate v5

Two local runtime examples built from editable, newly authored pixel components:

- `inventory.html`: inventory selection, preview, editable item count and full-text access
- `equipment.html`: equipment selection and paginated native-scene details

`index.html` links to both. This is a candidate implementation for review, not an official game UI, original game font or commercial-rights clearance. See `SOURCES.md` for the individual component ledger. The external reference screenshot is not bundled or needed to run the examples.

## Clean offline launch

1. Extract the complete package into a folder, preserving relative paths
2. Open `index.html`, then either example in a modern browser with JavaScript enabled
3. Click the canvas or focus it with Tab. Use arrows/Home/End to select and Enter/Space to open full text. The visible buttons support confirmation, back, equipment view and text pages
4. Open “Editable data and JSON” to change an entry or import a dataset

No build, account, CDN, fetch request or internet connection is needed for the supplied browser examples. Local scripts and PNG files are bundled. The HTML editor and full-text dialog use system text outside the 256×224 pixel canvas. Native Canvas drawing uses bitmap glyphs and integer scaling.

If a browser blocks local iframe access for the optional browser harness, serve this folder locally with `python -m http.server 8000 --bind 127.0.0.1`, then open `http://127.0.0.1:8000/tests/browser-harness.html`. This is an optional localhost test route, not a hosted deployment. Stop the server when finished.

## Edit, save and reuse data

The selected-entry form edits name, icon path, count and description. Apply updates the open page. The JSON editor also changes IDs, title, item order, initial selection and equipment records. Inventory supports 2–20 entries; equipment supports 1–3; count must be an integer 0–9999. The complete schema and API are in `references/runtime-contract.md`.

Edits are page-local until exported. Export creates `zelda-v5-data.json`; import it into either example to reuse the changes. There is no autosave or cross-tab synchronization. Long original names/descriptions remain in the data and full-text dialog. The scene paginates its bounded text regions; unsupported glyphs are shown as `?` with diagnostics rather than removed from the original text.

To change packaged defaults, edit `example-data.json` and run:

```sh
python build_data.py
```

This regenerates browser bindings from `example-data.json` and `sources/layout.json`. Reload the page afterward. The runtime validator runs when data is loaded; the binding script is not itself a full semantic validator.

## Editable sources and regeneration

Python regeneration requires Python 3 and Pillow available in the environment. Runtime viewing does not require Python. The scripts use explicit UTF-8 and paths relative to their own location, so commands can be run from another working directory using the script's full path.

| Change | Canonical input | Regenerate |
|---|---|---|
| Item/default data | `example-data.json` | `python build_data.py` |
| Background pixels/colors | `sources/background/map_indices.json`, `palette.json` | `python build_assets.py` |
| Sprite pixels/colors | `sources/sprites/sprite_grids.json`, `palette.json` | `python build_assets.py` |
| Panel size/rails/colors | `sources/panels.json` | `python build_assets.py`; coordinate changes may also require runtime updates |
| General glyphs/metrics | `sources/glyphs/font_arrays.json` | `python build_runtime_fonts.py` |
| Bound layout values | `sources/layout.json` | `python build_data.py`; inspect corresponding runtime uses |
| Offline native/4× preview | Current packaged data/components | `python render_preview.py` |

Refresh the browser after regenerating assets or bindings. Keep custom item/equipment icons 16×16 for this layout; a valid relative PNG path alone does not validate image dimensions. Do not edit a flattened screenshot and treat it as the canonical component source.

The optional `sources/background/generate_background.py` is a procedural reset workflow. It can replace hand-edited palette/matrix inputs. Ordinary background editing should use direct matrix rendering through `build_assets.py` instead.

Offline preview outputs are `output/inventory_offline_native.png`, `inventory_offline_4x.png`, `equipment_offline_native.png`, and `equipment_offline_4x.png`. These are Python/Pillow component renders of initial states, not browser screenshots or interaction tests. Subsequent in-browser data edits do not automatically rewrite them.

## Test the actual behavior

With Node available, run:

```sh
node tests/data.test.cjs
```

This checks the shared validator/navigation logic, including entry/count limits, invalid paths/IDs, selection bounds, copying and long original text preservation. It does not drive the browser.

Open `tests/browser-harness.html` and click its Run button for recipient-side selection/dialog checks. The harness is supplied for execution; its presence is not proof it passed. Also manually review:

- Mouse and keyboard selection, including an incomplete last row and wrap behavior
- Equipment selection independence, Back, confirmation, dialog Close/Escape and focus
- Selected count, first-equipment counter and exported counts after edits
- Long names/descriptions across all pages and their original full text
- Unsupported-character diagnostics without missing-glyph crashes
- Missing-image diagnostics and replacement after fixing the local path
- Native/2×/4× visual readability and appearance at narrow window widths
- Reload/export/import behavior and the fact that unexported edits are not persisted

Keep results distinguished: data tests, offline renders, actual browser observations, Windows checks and visual acceptance are separate. Do not infer Windows/default-GBK success from Linux UTF-8 tests. The scripts explicitly specify UTF-8; no locale setting should be needed to preserve `×` and supported punctuation.

## Troubleshooting

| Symptom | Check or action |
|---|---|
| Blank page or missing runtime | Extract the whole archive; keep JS/CSS and components at their relative paths; check the browser console |
| Arrows do not select | Focus the canvas; keys in an editor field edit text instead |
| Red square/question mark in an icon position | Inspect missingAssets diagnostics; correct the relative PNG path, confirm the file exists, then reload |
| `?` in scene text | Inspect unsupported code point; the original remains in full text/export. Add a custom glyph only if required, rebuild font bindings and retest |
| Long title is cut to one line | The top rail has a 128-pixel title region. Overflow is diagnosed; full title remains in JSON and the dialog |
| Changed JSON not visible on reload | Apply/import changes for the current page, or regenerate example-data.js with build_data.py for new defaults |
| Changed font not visible | Edit canonical font_arrays.json and run build_runtime_fonts.py; do not change only a stale compatibility export |
| Background edit disappears | Do not run the procedural reset generator after editing matrix/palette unless replacement is intended |
| Count or collection rejected | Use numeric integers and the documented 0–9999 / 2–20 / 1–3 limits; keep selectedIndex valid |
| Different layout after source edits | Some runtime anchors are explicit code. Read visual-spec.md and test both examples rather than assuming every JSON value is automatically bound |

## Further use

`SKILL.md` is the reusable workflow entry. `references/visual-spec.md` records native dimensions, panel rail order, palette sources, glyph metrics and placements. `references/runtime-contract.md` records implemented state/data/API behavior. `SOURCES.md` records original procedural authorship and unknown rights/model metadata. No third screen or new game example is included in this candidate.
