# Screen and state patterns

Use one invented save across all three views. No names or numbers are official game data.

## Weapon Kit — `weapon-kit`

Synthetic player: Kelp, level 18, cash 1,450. Kit: Inkline Shooter, Burst Canister sub, Splash Beacon special. Gear: Slate Cap (Run Speed), Pop Jacket (Ink Saver), Citrus Trainers (Swim Speed).

Show one angled weapon silhouette at upper left with separate sub/special sticker labels. Keep gear as three distinct paper tiles with an ability line. Changing a gear tile updates the kit summary immediately; compare preview must not commit until confirmed. Labels stay upright even if a sticker backing is tilted.

## Catalog Shop — `catalog-shop`

Synthetic catalog: Patchwork High-Tops 920, Fizz Visor 780, Tide Jacket 1,250. Starting cash 1,450. Show a short vertical rack, original item art, price stamps, and a pinned preview area.

Selecting an item previews the price and attributes. Confirming the 920-credit shoes leaves 530 once; purchasing again is disabled if cash or stock is insufficient. Cancel returns to the shelf without a cost. Avoid loot rarity frames or generic ecommerce cards.

## Match Results — `match-results`

Synthetic match: Kelp Team (cyan diagonal hatch) 62.4% turf; Grit Team (coral dot hatch) 37.6%. Player contribution: 1,280p, 7 splats, 3 assists; placement label: Third. Display the territory split as a bold uneven band and show numbers as text, not only bar lengths.

A New Match action resets only the match panel. Gear and cash remain unchanged. The result medal label is visible in text for screen readers and remains understandable if colors are removed.

## Shared interaction contract

Use semantic buttons, visible focus, Enter/Space to confirm, Escape to back out, and arrow keys within the active gear/catalog list. Pointer actions match keyboard actions. Keep player name and selection stable when moving between the three views.
