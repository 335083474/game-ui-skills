# Screen composition and behavior

These are composition constraints, not finished page templates. Create the requested content and game state separately from the component specimens.

## Reward · a focused ceremony

Use one centered broad paper board. A clear title and short instruction lead to three generous framed choices. Show each item's name and explicit effect. Add one confirmation action below. On a small viewport, stack choices and retain the confirmation near the selected summary.

Selection alone does not grant the reward. Confirmation applies exactly one selected effect, marks the reward event claimed and prevents repeated activation by click, keyboard or rerender. An unselected confirmation is disabled with a reason. After claiming, show the claimed item and updated amount. If claiming a potion as inventory, state “+1 potion”; if claiming direct healing, state “restore 20 HP” and cap the result at maximum HP. Do not silently mix the two effects.

## Inventory · a working tray

Use a compact top identity/status strip, then a multirow item grid and a visibly different side detail pane. A typical desktop split is 60/40; move detail below the grid on mobile. Categories may be horizontal tabs or a short side rail. Slot quantities remain at the lower right; selection has a marker as well as amber border.

Selecting a slot updates item name, quantity, description and action in the detail pane. A potion use reduces quantity by exactly one and sets `hp = min(maxHp, hp + healAmount)`. Prevent use at zero quantity; when HP is full, disable use with an explicit reason and do not consume stock. Show current/max HP and a visible use result. Empty slots must not display stale item data.

Strawberries, watering cans and seed packets may be present as descriptive inventory. State whether an item is consumable, a tool or seed stock, and display its quantity. Do not display an active “Water” or “Plant” button without a real implemented target and result.

## Shop · a market counter

Use a shop identity/stock header, persistent coin balance, then product rows or a catalog beside a compact transaction panel. Price, owned count, available stock and purchase action should be readable together. This must have a different silhouette from reward selection and inventory.

A purchase atomically checks coins, stock and positive quantity, then deducts coins, reduces stock and increases inventory by the purchased amount. Invalid purchases leave all three unchanged. Update action state immediately after each purchase. Cover affordable, insufficient coins and sold-out states; show their reasons as text. Demo currency is fictional in-game coins, with no real payment flow.

## State model and handoff

Use a single authoritative model for coin balance, inventory quantities, HP/maxHP and reward-claim flag when screens share a session. A small local state object is enough for an offline prototype. If reset or persistence exists, label its scope; don't claim server persistence. Keep the user's game rules when given, and record any demo defaults such as 100 maxHP and 20 potion healing.
