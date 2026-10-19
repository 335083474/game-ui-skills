# Runtime data and state contract

This document describes `data.cjs` and `runtime.js`, not original-game behavior.

## JSON input

```json
{
  "title": "ITEM",
  "selectedIndex": 0,
  "items": [
    {"id": "flute", "name": "FLUTE", "icon": "components/sprite_flute_observed_native.png", "count": 1, "description": "A blue instrument with recessed holes."},
    {"id": "bomb", "name": "BOMB", "icon": "components/sprite_bomb_native.png", "count": 4, "description": "Change this description or count in the editor."}
  ],
  "equipment": [
    {"id": "sword", "name": "SWORD", "icon": "components/sprite_sword_metal_native.png", "count": 1, "description": "Selected equipment details."}
  ]
}
```

- Top level must be an object. `title` is a string; `selectedIndex` is a valid zero-based inventory index
- `items` has 2–20 entries; `equipment` has 1–3 entries
- Every entry requires string `id`, `name`, `icon`, `description`, and integer `count` from 0 through 9999
- IDs must be nonempty and unique within their collection. The validator does not require cross-collection uniqueness
- The icon path must match a relative `components/*.png` path containing only letters, digits, underscore, dot, slash and hyphen, with no `..` sequence. Absolute paths and URLs are rejected
- Use native 16×16 item/equipment icons for this layout. The data validator checks the path string, not PNG dimensions or file existence
- Names/descriptions retain original text. This schema imposes no explicit length cap; extremely large data still costs browser memory and layout time
- The validator constructs a new object containing the declared fields. Unrecognized extra fields are not part of the saved contract

Invalid input throws. UI handlers show the error instead of replacing data with a partially validated object. A syntactically valid missing icon passes the data validator but produces a visible missing-asset state when the image fails to load.

## Public browser API

Open either example before using these methods in its browser console:

| Method | Behavior |
|---|---|
| `ZeldaUI.getData()` | Returns a deep copy of current JSON data |
| `ZeldaUI.setData(object)` | Validates/copies data, applies selectedIndex, clamps the current equipment index, resets text page and redraws; throws on invalid data |
| `ZeldaUI.select(index)` | Selects a valid zero-based index in the active collection, resets page; throws if out of range |
| `ZeldaUI.setScreen('inventory'|'equipment')` | Changes between the two implemented views and resets page; rejects other names |
| `ZeldaUI.confirm()` | Opens the HTML full-text dialog for the current entry, preserving its complete name and description |
| `ZeldaUI.back()` | Returns to inventory and resets page |
| `ZeldaUI.diagnostics()` | Returns current glyph/layout messages, failed asset paths, screen, active collection index and page |

Diagnostics shape is `{unsupported: string[], missingAssets: string[], screen, index, page}`. Page is zero-based. Only failed paths used in the current drawing are reported; after correcting the bytes at a previously failed path, reload and retest. Unsupported messages come from the currently laid-out content, not a comprehensive scan of every inactive entry.

## Interaction states

- Inventory: 5-column grid, up to four rows; selected outline and matching preview. Left/right move by one, up/down by five, wrapping modulo item count. Home/End select first/last
- Equipment: the selected equipment's name, count and description occupy the left panel; the lower-right equipment icons remain selectable. Left/up move back one, right/down advance one; Home/End work here too
- Enter or Space on the focused canvas, the Confirm button, or a preview click opens the HTML dialog. Close or Escape closes it and restores focus to the prior control when possible
- Escape on the canvas returns to inventory. The visible Back button also returns focus to the canvas
- Clicking an inventory cell selects it. Clicking a lower-right equipment cell enters equipment view and selects that entry
- Previous/Next text page buttons operate the current page. Selection and screen changes reset the page

Keyboard handling is attached to the canvas. Click or Tab to focus it before using arrow keys; editor fields retain normal text editing.

## Long text and glyph policy

The scene draws custom bitmap glyphs. The runtime explicitly converts displayed characters to uppercase before lookup; the original strings remain unchanged in data, the editor, exported JSON and the full-text dialog. The font helpers themselves do not silently normalize input.

- Inventory preview names wrap preferentially at spaces within 64 native pixels, falling back to Unicode-codepoint wrapping for an overlong token, and show one line per page
- Equipment details wrap `name + newline + COUNT + count + newline + description` within 120 native pixels, nine lines per page, with ten-pixel line spacing
- Wrapping prefers existing spaces and falls back to Unicode code points rather than UTF-16 halves; this is not grapheme-cluster shaping
- Equipment preview names share the equipment detail page index. The total page count is at least the preview-name line count, with PAGE n/N in the left panel and a + preview continuation marker. They do not have a separate independent pager; the complete name is also in the detail text and full-text dialog
- Unknown glyphs render `?` and produce visible diagnostics with the original code point. They are not deleted from the saved text
- The top title uses the first compact-font line within 128 pixels; it is not a paginated title region. Keep it short. Overflow produces a diagnostic; the complete title remains in JSON/editor data and the full-text dialog
- Full-text access uses a scrollable HTML dialog and system text, not a pixel-canvas expansion. This is intentional so original unsupported characters and lengthy descriptions remain available

The seven crystals, lower-left action art and heart are fixed decorative examples, not inventory fields. The visible selected count is data-driven; it is not a promise of game logic, item use, persistence or consumption.

## Editing and persistence

The selected-entry editor changes name, icon, count and description. Edit IDs, title, collection membership/order or selectedIndex in the JSON editor. Add/Remove inventory controls obey the 2–20 limit. JSON also supports 1–3 equipment entries.

Export downloads `zelda-v5-data.json`. Import or Apply JSON validates and applies the supplied data. Edits exist only in the open page until exported; there is no server, automatic save or cross-tab synchronization. Export from one example and import into the other when sharing a changed dataset. `example-data.js` is the browser's initial default; `example-data.json` is its editable data counterpart, so run `python build_data.py` after editing the JSON defaults.

## Concrete success and failure checks

- Success: copy getData(), change an item count from 4 to 12, setData(copy), select that item, and verify the count in the scene, status, dialog and exported JSON
- Success: use a description spanning several equipment pages. Advance to the last page and inspect the complete original in the HTML dialog
- Expected failure: `count: "4"`, count -1/10000, selectedIndex outside items, duplicate IDs, one inventory item or a `components/../...` icon path are rejected
- Expected diagnostic: a nonexistent relative PNG shows a red placeholder/question mark and missing-asset path. This is not a successful icon render
- Expected diagnostic: a character absent from the custom font appears as `?` in the scene while remaining intact in full text and exported JSON
