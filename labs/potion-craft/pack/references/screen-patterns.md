# Screen and state patterns

All values and names here are synthetic. Share one inventory and coin balance across the three suggested screens.

## Alchemy Map — `alchemy-map`

Start with water base 3, firebloom 4, frostcap 2, mint 5, coins 42. The map occupies about two-thirds of the desktop content width. Show a named potion-effect route with 5–7 selectable nodes, obstacle areas, and a current endpoint ring. Ingredient counts sit in a narrow rail.

Selecting a node previews the route's ingredient cost and effect. Confirming the sample Heal path consumes one water and one mint and adds one Heal Draught to stock. If the inventory is short, prevent confirmation and explain which ingredient is missing. Reset Path clears only the uncommitted preview.

## Recipe Ledger — `recipe-ledger`

Show saved recipe rows with small bottle studies, effect label, brew count, and a bookmark indicator. Start with Heal Draught (2 brews), Ember Tonic (1), and Clear Mind (0). A selected recipe loads its route into the shared map state. Bookmark toggles without altering inventory; brew consumes the named recipe's ingredient list and adds one bottle only after all ingredients are available.

## Trade Counter — `trade-counter`

Synthetic customer: Mira requests one restorative draught. Current stock: Heal Draught 2, Ember Tonic 1; coins 42. Show the request on a small ruled paper slip, the selected bottle on a counter surface, and the offer as an aligned coin value.

Accepting the sample Heal Draught sale adds 9 coins and decrements stock once. Declining or changing selection does not change state. Disable Accept if no matching bottle remains. A customer's response can be a short feedback line; avoid inventing a branching dialogue tree.

## Shared interaction contract

Use semantic buttons for route nodes, recipes, customer choice, accept, decline and Reset Path. Arrow keys may move through the active node/list; Enter/Space commits; Escape returns to the prior surface. Keep keyboard focus visible. Pointer and keyboard cause identical state changes. The demo inventory, recipes, costs, names, and prices are not official game data.
