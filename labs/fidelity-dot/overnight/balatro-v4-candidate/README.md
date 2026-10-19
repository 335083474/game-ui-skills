# Balatro-style UI skill v4: Shop + Collection

This local component/runtime candidate contains two examples: an editable Shop and a Collection view. It reuses the accepted static v3 visual assets and frozen creator-font masters, adding local state transitions and JSON editing. It is not the commercial game, a real shop, a screenshot viewer, or a promise of commercial-use clearance.

Read `SKILL.md` as the reusable skill entry. Detailed contracts are in:

- `references/runtime-api.md`: schema, state API, success/rejection behavior and text handling
- `references/components-and-tokens.md`: components, runtime/static token locations and font roles
- `references/authoring-guide.md`: editing, requested future-screen workflow and acceptance cases
- `SOURCES.md`: actual provenance, attribution and unresolved rights

## Open locally

Keep the extracted folder intact. Open `shop.html` for Shop or `collection.html` for Collection in a modern browser. The package is designed to work directly from `file://` using local JavaScript data and relative PNG files; it does not fetch a remote API. Actual file:// behavior must be verified in the browser you use rather than inferred from Node/Python tests.

If your browser blocks local assets, serve the same folder over loopback HTTP:

```sh
cd "/path/to/balatro-skill-v4"
python -m http.server 8000 --bind 127.0.0.1
```

On Windows, the folder can be a quoted Windows path, for example `cd "C:\Projects\balatro-skill-v4"`. Then open:

- `http://127.0.0.1:8000/shop.html`
- `http://127.0.0.1:8000/collection.html`

Stop the optional server with Ctrl+C. Browser viewing needs no Python packages. Python/Pillow are only needed for rebuilding data/alpha assets or offline previews; Node is used for model checks and scene-command export. No npm installation or build server is required for the shipped pages.

The canvas is logically 1024×576. The page fits it to the viewport and reports the display scale. Fractional downscaling can soften apparent pixels even with pixelated rendering; use native/integer scale for a visual comparison. Do not resize the completed screenshot to fix component proportions.

## Use the two examples

- Click a card or use the accessible item controls to select it
- With the canvas focused, arrow keys move selection; Home/End choose the first/last item; PageUp/PageDown change card pages; Enter opens details
- Details shows full original text, price, quantity and icon path. Back/close or Escape closes it
- Buy selected in Shop performs an in-memory virtual-cash purchase. Sold/insufficient-funds/capacity failures produce a status without a charge
- Reroll deducts the configured fee and rotates current offers. It preserves sold flags; it does not generate new random cards or emulate official game rules
- Switch between Shop and Collection inside the app to retain current state. Escape from the focused Collection canvas returns to Shop
- Shop shows 5 offers per page; Collection shows 8 entries. Description panels page long text, and the full-text dialog remains available

Selection and action status are also exposed as HTML text. These controls support non-canvas interaction, but the package does not claim a formal accessibility audit.

## Edit names, descriptions, icons, prices and counts

Use the visible textarea and **Apply JSON**. **Import JSON** loads a local JSON file (maximum 2 MB); **Export JSON** saves current data as `balatro-example-state.json`; **Reset example** restores the packaged starter data in the current view.

Unapplied textarea drafts are preserved across scene actions. Apply JSON replaces the entire data object, including cash and sold flags; review a stale draft before applying it after purchases/rerolls. Export saves applied state, not an unapplied draft.

Data validation rejects malformed or out-of-range fields. Prices/cash are integers, not formatted dollar strings. Icons must be safe relative `components/*.png` paths and the files must actually exist. Long names/descriptions remain in the source data; visual previews may wrap/page or show an ellipsis. Unsupported glyphs visibly fall back to `?` with diagnostics; originals remain in the editor and full-text dialog.

Export before closing. There is no automatic localStorage/database persistence, cross-tab synchronization or save-back to the package. A reload or separate entry-page load resets to starter data unless you import an export. Header/editor links to another entry are full page loads; in-app navigation is the state-preserving route.

### Change the packaged starter permanently

Edit `example-data.json` in a UTF-8 text editor, keeping the schema valid, then run from the package folder:

```sh
python build_data.py
```

This rebuilds `example-data.js`, `font-data.js` and browser alpha-atlas derivatives from local source files. It does not rerasterize the TTF or generate new font shapes. Reload the page after rebuilding. Editing JSON without rebuilding its JavaScript binding does not change the file:// starter.

The runtime's authoritative palette, positions and font calls are in `scene.js`. `sources/palette.json` and `sources/layout.json` remain the separate static-v3-render inputs; they are not silently linked to the live scene. Current sidebar score, chips/multiplier, Hands/Discards/Ante/Round and deck examples are illustrative scene values. Editable runtime data controls cash, title, products, collection, reroll price, item fields and runStats. The four required runStats values (jokersUsed/jokersMax/consumablesUsed/consumablesMax) are illustrative run counters, independent of the owned-card storage limit. A purchase changes owned cards, not these counters. The collection heading reads “Owned cards”, covering Jokers and Tarot alike.

## Architecture and outputs

- `model.js`: pure validated state transitions; usable in browser or Node
- `text-layout.js`: pure fixed-metric glyph layout and visual word wrapping
- `scene.js`: shared component-command builder and hit regions for both views
- `pixel-font.js`: browser atlas drawing/tinting; no Canvas system-font text or runtime FreeType
- `runtime.js`: browser loading, state wiring, pointer/keyboard controls, dialog and JSON import/export
- `shop.html`, `collection.html`, `style.css`: two entry pages and surrounding accessible UI
- `example-data.json/.js`, `font-data.js`: editable starter and local browser bindings
- `fonts/canonical/`: frozen masters/metrics and creator-font evidence; `fonts/browser/`: alpha derivatives
- `components/`, `sources/decor/`: independent reusable art and procedural decor sources

Changing the live data does not rewrite static PNGs or package files. The old static frame under `output/balatro-shop-1024x576.png` is retained as static evidence, not presented as a live browser screenshot.

## Rebuild offline scene previews

```sh
node export-scenes.cjs
python render_runtime_preview.py
```

The first command exports Shop/Collection drawing commands from the SAME `scene.js` builder used by the runtime. The second draws them with Pillow to `output/shop-runtime-offline.png` and `output/collection-runtime-offline.png`, plus 2× previews. These are offline component renders, NOT browser screenshots. Canvas/Pillow rounded edges can differ.

Do not run `fonts/canonical/generate_masters.py` as part of ordinary startup or validation. It is a separate explicit atlas-authoring operation; regenerating under another rasterizer would create a new font revision.

## Checks and acceptance scope

From the extracted package directory, run all four Node checks and the Python artifact check:

```sh
node tests/qa-model.cjs
node tests/qa-scene.cjs
node tests/qa-runtime-mock.cjs
node tests/font-layout.cjs
python check_v4.py
```

`package.json` declares CommonJS and provides `npm test` as an equivalent shortcut for the four Node checks. No npm installation is needed. Python artifact checking requires Pillow, as does offline rendering.

- `qa-model.cjs`: model validation, purchase/reroll and state-transition checks
- `qa-scene.cjs`: shared scene commands, editable values, paging and layout checks
- `qa-runtime-mock.cjs`: actual runtime exercised with minimal DOM/canvas mocks; this is not a real browser
- `font-layout.cjs`: 143 frozen-master JS/Python geometry vectors, bounded wrapping and unsupported-character diagnostics
- `check_v4.py`: exact browser-atlas alpha derivatives, local asset paths, default text bounds including shadow, and exact nearest-neighbor 2× offline previews. It writes `output/v4-static-validation.json`

See `tests/INDEPENDENT-QA.md` and the delivered validation outputs for the scope actually exercised. The documented starter purchase/reroll examples have also been checked directly in Node. Do not promote old v3 reports into v4 evidence.

For a real-browser pass, serve the complete folder using the loopback command above, open `http://127.0.0.1:8000/browser-harness.html`, and click **Run browser assertions**. The harness inspects a same-origin Shop iframe; file-URL iframe security may prevent that inspection. It checks purchase/rejection, navigation, dialog behavior, retained long text, scene text/shadow bounds and missing-asset diagnostics. Shipping the harness is not evidence that it has been run. Record the actual browser, OS and result when running it.

Also open both examples and manually exercise pointer selection, Tab/focus cycling, all card/description pages, JSON editing/import/export, downloaded JSON, unsupported characters and responsive widths. Compare actual browser pixels with the intended reference separately; automated assertions do not certify visual fidelity.

This README makes no unperformed browser or Windows claim. Earlier static approval/Windows pixel matching remains scoped to its actual revision. Font/source likeness, generated art edges and commercial rights are not established by model or rendering tests.

## Scope and source boundaries

Exactly two examples are delivered. New-screen instructions explain how to reuse the system when requested; no third game example is included. Purchases use demo numbers only; there are no payment credentials, real money, account login or external service calls.

Font credit: m6x11 by Daniel Linssen, https://managore.itch.io/m6x11 . Preserve `fonts/LICENSE-AND-ATTRIBUTION.txt`. The exact font variant used by the game is unverified. The original screenshot capture platform/build and underlying generated-art model remain unknown. Original screenshot pixels are excluded from distributable assets. See `SOURCES.md` before publication or further sharing.
