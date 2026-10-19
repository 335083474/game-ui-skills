# Screen patterns

Use one coherent synthetic deck and token state across all views. These are composition and behavior contracts, not finished layouts.

## Card reward

Offer two or three full-height card choices on a low-detail tabletop. Each card has a title, upper-left cost, one central creature illustration, attack / health values, and a short sigil row. Selection should be visually distinct without obscuring the cost or statistics. A detail line beside or below the selected card can explain its ability in one sentence. Confirm adds exactly one card to the shared deck; Back leaves the state unchanged. If a reward is free, say so explicitly instead of displaying an empty cost mark.

Synthetic example: “Ash Owl,” 1 dusk token, 1 / 2, sigil “Watch.” The name, mechanics, and numbers are invented for the UI study.

## Deck

Use a binder-like list or overlapping paper spread to show the owned cards, with name, count, cost type, and visible attack / health. Keep a distinct detail area for the selected card's sigils and one-line rules text. Filters may switch between creature / event / resource; they should not change the shared deck. Removing a card requires an explicit action and confirmation. A selected item must retain the same art crop and data when returning from the reward view. Avoid a dense merchant inventory with price tags on every row.

Synthetic example: six owned entries, with two copies of “Ash Owl.” Sorting changes presentation only; a remove action updates the deck count once and announces the result.

## Trade table

Show the player's offered object and the received object on opposite sides of a single exchange mark. Each side names what leaves and enters the shared collection. Place the cost pips between the objects; show insufficient currency before the final action. “Inspect” changes the preview only. “Trade” changes both inventories atomically, and a failed / cancelled trade leaves both unchanged. Use a small exchange ledger or hand-space indicator as supporting detail; do not use a cart, checkout progress bar, or SaaS-style order summary.

Synthetic example: exchange two dusk tokens for a fictional “Moss Bell” event card. After commit, the token count decreases by two and the event appears in the binder; retrying the action cannot duplicate it.
