# Screen and state patterns

These are implementation contracts for small original experiments. Explicit demo choices below are not claims about every Diablo II patch. Use named objects and stable IDs, not DOM labels as the state store.

## Shared state

Maintain `character {level,strength,dexterity,life,mana,gold}`, `items [{id,kind,name,w,h,requirements,price}]`, `backpack [{itemId,x,y}]`, `equipment {head,neck,weapon,offhand,torso,hands,belt,feet,ringLeft,ringRight}`, `skills {unspent,ranks}`, `merchant [{itemId,stock,buyPrice,sellPrice}]`. Coordinates are zero-based. Gold, stock, ranks and unspent points are nonnegative integers. Derive totals and disabled reasons from state; never update text alone. Local persistence is optional, but if used expose Reset and keep one versioned storage key shared by the three screens.

## Equipment / inventory

Show body-shaped slots above or beside a 10 × 4 backpack, character attributes in compact rows, a selected-item tooltip and visible actions. At minimum support selecting a backpack item, equipping into a compatible slot and returning equipment to the bag. Keyboard: select item, then Equip/Unequip; pointer drag may supplement this.

An item at `(x,y)` occupies `[x,x+w)` × `[y,y+h)`. Reject out-of-bounds and any overlapping occupied rectangle. Suggested original specimen footprints: sword 1 × 3, helmet 2 × 2, potion 1 × 1, round shield 2 × 2, amulet 1 × 1. These are declared experiment data, not universal dimensions of all official items. Items do not rotate in the classic-style experiment.

Equip transaction: validate kind/slot, level, strength and dexterity. Compute the destination of displaced equipment before mutating. Temporarily remove the incoming bag item, then place the displaced item in the first legal bag rectangle scanning top-to-bottom, left-to-right. If no rectangle exists, reject the entire swap; preserve item locations and stats. If supporting a two-handed weapon, require offhand clearance and reserve space for every displaced item atomically; otherwise constrain the demo to one-handed weapons and say so. Reject with a concrete reason: `Requires Strength 50`, `Helmet slot only`, `No room for equipped shield`. Never silently delete an item or drop it offscreen.

After a successful move, the same item ID exists in exactly one location. Unequip requires a legal free bag rectangle. Update derived defense/damage from equipment; don't grant the bonus again on repeated clicks. Potion Use removes exactly one potion and clamps life to maximum; a full-life refusal should not consume it. A no-selection state explains how to select an item.

## Skill tree

Use three tabs with a legible branching tree, not a modern card list. A reduced tree is acceptable if labeled an original sample; do not present six nodes as the game's complete 30-skill class tree. Choose distinct names for any sample abilities and provide declared required levels, prerequisite IDs and rank effects. Flame atlas art is one specimen, not six different official skills; other sample nodes may use engraved text glyphs or silhouettes with clear labels.

For the classic-style rule, spending one hard point requires: unspent > 0; all prerequisite hard ranks >= 1; character level >= required level; current hard rank < 20; and current hard rank < `character level - required level + 1`. The last condition prevents spending saved points past the per-level cap. Item bonuses do not satisfy prerequisite hard ranks. Deduct one point and increment one rank in one update. Separate selecting a node (inspect details) from the Spend point action so discovery cannot accidentally spend.

Show rank, next-rank benefit, mana if relevant, required level and each missing prerequisite. Distinguish `Locked: learn Ember first`, `Requires level 18`, `No skill points`, and `Rank limit reached`. Zero-point and maximum-rank states must remain inspectable. State whether reset is a demo reset; do not imply unrestricted respec in original Diablo II. Changing tabs preserves ranks and points. A chosen active skill is distinct from a learned passive rank.

## Merchant trade

This package's test contract is a finite merchant stock model. Actual game vendor behavior varies by item and context; the experiment intentionally uses finite stock so changes can be verified. Label merchant content and prices as sample data.

Place merchant stock on the left, the same player backpack on the right, gold and selected item details between/below. Buying requires a selected stock item, stock > 0, enough carried gold, and a legal backpack rectangle. Compute space first. A successful buy creates one new unique item ID, deducts buyPrice and stock by exactly one, and places one item. Repeat clicks cannot purchase sold-out stock or cause negative gold. Failure leaves all state unchanged and shows `Not enough gold`, `No room in backpack`, or `Sold out`.

Selling requires an owned backpack item. Show exact proceeds before commit; remove that instance, increase carried gold by sellPrice and add one unit to merchant stock. If only finite predefined stock types are supported, either register the sold item type or refuse unsupported sale with a reason. Never sell equipment implicitly. Give buy and sell prices separate fields; `sellPrice <= buyPrice` prevents a buy/sell loop creating gold. No background restocking, timers or free gold on route changes. A reset restores all shared sample state explicitly.

Use an inline result message linked to the action, plus updated numbers and occupied cells. Buttons are disabled when impossible, but reasons remain visible and logic revalidates on activation. Close returns to the chosen parent view; navigation does not reset gold, items or learned ranks.
