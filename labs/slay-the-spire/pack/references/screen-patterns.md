# Screen patterns and state contracts

These are composition instructions, not finished templates. Make new screens from the primitives and the user's content.

## Rewards: a focused decision

Use a centered title, small journey context and two or three large selectable objects with short paper descriptions. A shared confirm action follows the decision. Use the bright metal edge and a selected plaque on exactly the current choice. Show the consequence as a number in editable text.

State: `selectedRewardId`, `claimed`, player resources. Selection alone grants nothing. Confirm requires a choice and `claimed === false`; grant the corresponding effect once, set `claimed = true`, lock the choice and announce what changed. Repeated clicks, keyboard activation and switching away/back cannot grant it again. A prototype may use session state; say if a reload resets the run. Healing rewards still cap HP.

## Inventory: scan, inspect, use

Use a dense matrix of square dark slots on the left or center and one parchment detail pane alongside it. Put owned count at a consistent corner. Keep health and capacity visible; show empty cells as actual slots. The selected item drives one detail pane. This must read as storage, not a gallery of reward cards.

State: `inventory[itemId]`, `selectedItemId`, `hp`, `maxHp`. A healing potion uses `hp = Math.min(maxHp, hp + healAmount)` and consumes one owned potion only when use is allowed. Disable at zero quantity or full HP with a visible reason. Test near maximum HP so a nominal +20 heal does not exceed the cap. Use a polite status message such as “Recovered 7 HP. 1 potion remains.” Update numbers and availability immediately.

## Shop: compare offers and manage a purse

Use a merchant counter/offer list, rows or asymmetric grouped shelves; put a persistent purse in the header and a basket/owned summary beside offers. Prices sit next to each offer, with purchase actions close to them. Use short parchment price labels and keep stock readable. Do not reuse three tall centered reward cards.

State: `gold`, `offers[itemId].price`, `stock`, `inventory[itemId]`. Before purchasing check stock and balance. On success subtract the exact price, decrement stock, increment inventory and announce the result. Re-evaluate all offer buttons after every purchase. Insufficient funds and sold-out states have different explanations. Verify no negative gold or stock under repeated activation. Use only fictional game gold, with no real checkout or payment implication.

## Shared screen family

Carry the same fonts, sprite mapping, paper color, metal edges, HP treatment, action anatomy and selected marker across the family. Layout responds to the task. Use the same item ID for the same art and name. Provide obvious navigation between views when a combined prototype is requested. Do not preload this package with finished reward, inventory or shop pages: independent use tests should compose them from these instructions.
