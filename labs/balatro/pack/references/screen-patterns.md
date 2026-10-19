# Screen patterns

Information and behavior requirements, not finished layouts. Compose each screen from common components.

## Reward choice

One heading and short instruction. Three comparable cards: Coins (+50), Healing potion (restore 20 HP), Lucky crystal (+1 luck). One selected item, explicit marker and single confirm action. Interactive confirmation applies the effect exactly once and shows the result. Choosing another card afterward must not grant a second reward. Provide explicit reset for replay.

## Inventory

Visible item count, categories, compact slot grid, selected item detail panel. Detail identifies name, quantity, effect and action. Items reuse purse/potion/crystal/heart/key/chips illustrations; empty slots share the slot frame. Potions may increase health to cap; decrement quantity and show feedback. Filtering cannot leave stale details for items outside the filter. Zero quantity and full health need explicit unavailable states. Do not turn inventory into three giant reward cards.

## Shop

Balance, purchasable items, prices, selected detail or price/stock on cards, exit/continue action. Example prices: potion 8, crystal 12, key 6. Purchase subtracts currency, changes stock/count and confirms. Insufficient funds and sold out must be visibly unavailable; money cannot go negative. Reroll optional; if present, show price and change offers without resetting money. No real-money checkout.

## New screens

Carry the grammar forward: cards, slots, buttons, markers, typography and HUD. Adapt density and arrangement to the task. State features that remain illustrative.
