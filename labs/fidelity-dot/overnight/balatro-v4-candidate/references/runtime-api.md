# Runtime data and state API

## Files and entry points

`shop.html` and `collection.html` are the two example entries. They share `model.js`, `text-layout.js`, `pixel-font.js`, `scene.js`, `runtime.js`, `style.css`, `example-data.js`, `font-data.js` and relative PNG assets. The data scripts provide synchronous local bindings; the app does not depend on fetch or a remote API.

`model.js` exports `BalatroModel` in the browser and a CommonJS object through `require('./model.js')` in Node. Its state functions return cloned/new states instead of mutating the supplied state. Validation errors throw; rejected business operations return a state with an explanatory `status`.

## Editable schema

`example-data.json` is the human-readable starter fixture. `example-data.js` is its browser-loadable counterpart. Runtime JSON editing/import operates on a data object with:

| Field | Contract |
|---|---|
| schemaVersion | Exactly 1 |
| cash | Integer 0..999999 |
| rerollPrice | Integer 0..999999 |
| runStats | Required object with jokersUsed, jokersMax, consumablesUsed, consumablesMax; each integer 0..999; used cannot exceed its corresponding max |
| title | String, at most 10000 JavaScript UTF-16 code units |
| products | Array of 2..20 items |
| collection | Array of 0..100 items |

`runStats` supplies illustrative run-slot counters (starter 4/5 Jokers and 1/2 consumables). These are independent of the demo owned-card collection and its 100-entry capacity. Buying a product changes collection/cash, not runStats. The Collection heading is “Owned cards” because the list may include Tarot or other card types.

Each item has:

| Field | Contract |
|---|---|
| id | Nonempty string, unique within its own array |
| name | String, at most 10000 UTF-16 code units |
| description | String, at most 10000 UTF-16 code units |
| icon | Relative `components/*.png` path; letters, digits, underscores, hyphens and subdirectory slashes only; no `..` |
| price | Integer 0..999999; no dollar sign or decimal string |
| count | Integer 0..999 |
| sold | Boolean |

An ID may appear once in products and once in collection: purchase then merges quantity into that existing collection item. `count` is the quantity transferred/merged, not automatically decremented inventory stock. Zero count is currently accepted by the schema. Additional properties are copied but are not a promise of UI support. Path validation checks syntax, not whether an image exists.

## State shape

`create(data, screen='shop')` returns:

- `data`: validated clone
- `screen`: `shop` or `collection`
- `selected`: zero-based index, initially 0
- `detailPage`: initially 0
- `status`: user-readable status
- `revision`: initially 0

Selection indices are indices into the full active array, not just the current visible page. Noninteger selection indices explicitly throw an Error. The Shop displays5 items per page; Collection displays8. The UI's page navigation exposes later entries rather than dropping them.

## Functions

| Function | Result |
|---|---|
| validate(data) | Returns a cloned validated data object or throws an Error |
| create(data, screen) | New initial state; unknown screen throws |
| items(state) | Active products/collection array |
| select(state, index) | Wraps an integer index through active items, resets detailPage, updates status; empty collection stays selected 0 |
| setScreen(state, screen) | Preserves data/revision, resets selection/detail page for the target screen |
| purchase(state) | Local shop purchase described below |
| reroll(state) | Local paid reorder described below |
| replaceData(state, data) | Validates replacement data, keeps screen, clamps previous selection, increments revision |

### Purchase

Only Shop purchase is allowed. The model rejects already-sold offers, insufficient cash, collection capacity above 100 entries, or merged count above 999. Those rejections leave money/items unchanged and set a status message. On success it subtracts price, marks the offer sold, appends a collection item or adds to the existing count, and increments revision.

This is an in-memory demonstration using integer virtual cash. It performs no payment, purchase order, network request or authentic game-effect resolution.

### Reroll

If cash is sufficient, subtract `rerollPrice`, rotate the products array left by one, reset selection/detail page, increment revision and report the charge. Sold flags are preserved. This is a deterministic offer reorder, not random item generation, stock replenishment or an implementation of Balatro's actual reroll rules. Insufficient cash returns a status without a charge. The model rejects reroll outside Shop with a status and no charge.

## Concrete transition examples

With the supplied starter data:

```js
const Model = require('./model.js');
const data = require('./example-data.json');
const start = Model.create(data, 'shop');
const bought = Model.purchase(start);
// cash 9 ->5; first $4 offer sold; collection receives its quantity; revision 1
const duplicate = Model.purchase(bought);
// no additional charge; status explains already sold
const expensive = Model.purchase(Model.select(start, 2));
// $10 voucher with cash 9: no charge, insufficient-funds status
const rolled = Model.reroll(start);
// cash 9 ->4; second original offer is now first; sold flags preserved
const collection = Model.setScreen(bought, 'collection');
// owned data survives; selection resets to0
```

Invalid examples rejected by `validate`: price`"$4"`, count`2.5`, duplicate IDs within products, negative cash, `../outside.png`, or a remote URL for icon. Fix data before applying; do not coerce invalid prices silently.

## Text behavior

Names/descriptions are stored as full strings. `pixel-font.js` uses frozen glyph masks and fixed-point advances. Missing glyphs display `?` and create `UNSUPPORTED_GLYPH` diagnostics; no system font is silently substituted. Source Unicode remains available through the editor/full-text detail view.

Visual word wrapping normalizes boundary whitespace and splits overlong words when needed. It is a presentation transform, not an edit to the stored description. The native panel pages its content; the accessible details dialog exposes full text. Do not claim that visual wrapped lines preserve byte-for-byte spacing. A text column narrower than one glyph is a layout error and must be corrected rather than clipping/dropping the glyph.

## Lifetime

In-app screen switching preserves the current state. Opening/reloading a separate entry page starts again from the packaged example unless JSON is imported. No automatic persistence or cross-tab synchronization is promised. Export data before closing if changes matter.

## Browser integration API

After initial font/component loading succeeds, `window.BalatroApp.ready` is true and the object exposes:

- `getState()`: deep-cloned current state
- `getScene()`: current scene command/hit-region object; inspect it without mutating it
- `act(id)`: dispatches known scene actions, including purchase, reroll, shop, collection, previous-item, next-item, prev, next, detail-next, details and editor
- `apply(data)`: validates/replaces data, returns true/false, then asynchronously loads referenced images
- `render()`: rebuilds/draws the current scene

`ready` describes initial setup, not completion of every later imported image load. Inspect visible asset diagnostics after importing icon paths. `apply` is full data replacement, not a field patch. An unapplied editor draft survives selection/purchase/navigation; applying an older draft can deliberately replace newer cash and sold flags. Review it before applying. Export serializes current applied data, not the unapplied textarea draft.
