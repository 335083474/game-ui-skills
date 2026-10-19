# Authoring, examples and review procedure

## Modify one of the two supplied examples

1. Open Shop or Collection and use the visible JSON editor. Change the data fields you need: names, descriptions, icon paths, prices, counts, cash and reroll price
2. Use Apply JSON. It replaces the whole data object, including cash/sold flags; a preserved draft may predate recent actions. If validation fails, correct the reported field; the UI should retain the prior working state rather than apply a partial invalid object
3. Select the changed item. Check its native text, details pagination and full-text dialog. Long text must remain available even if a card label only shows a short visual preview
4. Perform a relevant transition: buy a sufficiently cheap offer, try an unaffordable offer, reroll, or switch to Collection and inspect the owned count
5. Export JSON to retain your edited state. The browser app does not promise automatic persistence; reloading or opening another entry page resets the starter unless you import saved JSON

The schema and exact state transitions are in [runtime-api.md](runtime-api.md). Use only local component PNG paths supported by the validator. Adding a new path is not enough: ship the referenced file and verify its actual load.

## Reuse the system for a requested new screen

This is guidance for a future requested screen, not a third delivered example.

1. Define the screen's purpose and editable data before drawing. Reuse the existing item fields when appropriate; version/validate any genuinely new fields
2. Keep state changes in `model.js` or a similarly pure module. Define success and rejection states; do not mix image loading, DOM writes or real payments into the model
3. Compose the visual layer from background, panels, badges, cards, text and hit regions. Extend `scene.js` rather than drawing over the flattened static PNG
4. Reuse explicit palette/font-role choices. Read actual frozen metrics before choosing widths, numeric alignment and line spacing. Keep long text available through pagination/full-text access
5. Add equivalent accessible HTML controls for canvas actions and map pointer coordinates to the logical 1024×576 canvas. Use DOM text for accessible full content without claiming it is a visual font match
6. Connect the entry page to shared scripts/data/relative assets. Preserve current in-app state when navigating if that is part of the new requirement; otherwise document resets
7. Test the pure model, layout outputs and real browser interactions separately. Check missing images, empty lists, many items, large prices/counts, unsupported Unicode and narrow text areas
8. Deliver editable sources, relative assets, actual test reports and a short limitation summary. Preserve earlier frozen versions and source attribution

Do not add a new game example or replace accepted artwork solely to demonstrate reuse. The current deliverable is exactly Shop plus Collection.

## Observable success cases

- Cash 9 and selected$4 offer: purchase leaves cash 5, marks the offer sold and adds its quantity to Collection
- Purchase an item whose ID is already owned: merge its count, provided the result is at most 999
- Reroll with enough cash: deduct the displayed fee, rotate the offers deterministically, retain sold flags, and report the action
- Change an item's description to a long paragraph: the JSON retains the entire text, the native details panel exposes multiple pages, and full-text access includes the complete original string
- Import more than5 products or8 collection entries: later entries remain reachable through paging
- Switch screens within the app after purchase: owned items and cash remain consistent; illustrative runStats remain unchanged

## Explicit failure/rejection cases

- A$10 offer with cash 9: no charge or item transfer; show insufficient funds
- Purchase the same sold offer twice: no second charge
- Merge beyond count 999 or append beyond 100 collection entries: no charge; show capacity rejection
- Invalid JSON, a decimal price, duplicate IDs, or a nonlocal icon URL: reject the replacement and explain the field/error
- Unsupported emoji/CJK in a native-font label: show a visible fallback plus diagnostics; keep the original text in the editor/full-text view
- Numeric text too wide even at the smallest available master: emit a layout note and show an explicit fallback, rather than draw outside the badge. The complete numeric value remains in editable data/full details
- A referenced image that fails to load: report the asset failure; do not silently claim that card rendering succeeded

## Local acceptance checklist

Check both entry pages. Select every visible item; reach another page with added data; inspect details; buy successfully; retry a sold item; reject insufficient funds; reroll and confirm exact cash change; switch screens; apply/export/import JSON; reload and verify the documented reset behavior. Use a long description and an unsupported character. Inspect prices and counters at native size and larger browser display scales.

A successful Node model test proves state transitions only. A Python PNG test proves that raster path only. A browser screenshot alone does not prove the controls work. Record the browser/OS actually used and the actions actually performed; do not infer Windows or file:// success from a different platform or a local HTTP run.
