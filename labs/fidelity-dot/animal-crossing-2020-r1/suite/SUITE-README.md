# ACNH two-page research candidate
Suite label: ACNH-suite-candidate-0.1
Pockets implementation: ACNH-pockets-v0.3 (data version remains ACNH-pockets-v0.1).
Shop implementation and data: ACNH-shop-v0.1.
Status: Pockets representative screen has receiver-reported limited acceptance.
Shop and the complete suite are UNVERIFIED / NOT ACCEPTED / NOT FOR PURCHASE.
Commercial or public redistribution rights are not established.

## Start here
This SUITE-README.md is the entry document for the combined candidate.
The inherited README.md and COMPONENTS.md describe the frozen Pockets page only.
They are retained byte-for-byte, not silently updated to claim Shop coverage.
Read SKILL.md, TOKENS.md, DATA-CONTRACT.md and SOURCES.md before reuse.

1. Put all 17 unchanged Pockets files and the 15 additions in one folder as listed in INHERITANCE.md.
2. Place ACNH_shop_background_v01.png at assets/shop-background.png.
3. Place ACNH_customization_kit_v01.png at assets/customization-kit.png.
4. Open index.html for Pockets or shop.html for Shop in a modern desktop browser.
   Relative scripts and images need no npm, build step, network font or external API.
   A static HTTP preview is also suitable if the receiver already has one.
5. Use a landscape viewport large enough to provide an ACTUAL 960 × 540 stage.
   Browser scrollbar space counts. A nominal 960px outer viewport can be insufficient.
6. The review/editor lives below the game. Scroll down to edit JSON, read full text or export.
7. Save the exported JSON separately. Reloading restores the initial data file, not the export.

The two pages have independent CSS, JS and data; no shared runtime refactor is performed.
Shop links to the frozen Pockets index.html. Pockets is not changed to add a return link;
open shop.html directly to return.

## Shop interaction
Default reference state: Miscellaneous, Timmy, 29,729 Bells, Customization kit,
Just 1. (600), I'll take 5! (3,000), I've changed my mind.
Shelf goods and prices are independently selectable/editable.
The selected kit appears among the second-row goods and may be covered by the choice
balloon in this screenshot-based composition. Full text/editor exposes every product.
Seed/sapling identity and some prices are demonstration data, not verified catalog facts.

Tab reaches goods and choice buttons. Arrow keys/Home/End within choices change focus
and selection. Native Enter/Space activate ONLY the focused button.
Escape within the game cancels an active choice. No document-wide Enter-to-buy handler exists.
A Select activates the selected option; B Cancel activates the explicit cancel option.
Mouse choice buttons perform the same actions.

A successful purchase subtracts price × quantity and increases that product's owned value.
It records a receipt and ends the current choice. Repeated activation of the old choice
cannot purchase again because phase is no longer choosing.
Open purchase choices, or explicitly selecting a shelf product, starts a new choice.
Cancellation does not change balance or owned quantities. Insufficient funds or owned
overflow do not mutate either. This is a local demonstration, not payment or a game service.
No persistence, cloud inventory, arbitrary asset upload or external transaction is supplied.

## Editing
Use Review / edit complete JSON. Keep the exact schema from DATA-CONTRACT.md.
To edit a purchased state freely, start a fresh choosing phase with receipt:null.
JSON importing is transactional: validation finishes before the current state is replaced.
The product/option IDs selected in the data must exist. When deleting one, update the
corresponding selected ID in the same JSON. Rejection leaves the previous scene unchanged.
Choose kit, seed or sapling tokens to switch Shop graphics; raw paths are rejected.

Full text retains all permitted values, including bounded labels, speaker/category,
product descriptions, prices, quantities, options, receipt and complete JSON.
Long strings may be ellipsized/clipped in their explicitly bounded scene regions.
A visible, keyboard-operable diagnostic below the stage points to the full-text dialog.
This is review/accessibility information outside the game, not an invented original HUD.

## Receiver checks still required
- Compare the actual composite with the reference, not these component images alone.
- Default and 2/3/4 choices; 1/8 goods; long fields; all token images.
- Buy one: 29,729 → 29,129, kit owned 0 → 1.
- Fresh default buy five: 29,729 → 26,729, kit owned 0 → 5.
- Cancel from mouse and focused Enter/Space: balance/owned unchanged.
- Repeated input after purchase; insufficient balance; quantity cap.
- Dialog focus/escape, resized portrait and return, no hidden stage interaction.
- Actual 960 × 540 minimum; classic scrollbars; no horizontal document overflow.
- Import/export equality and rejection of invalid records.
- Pockets byte equality and its existing regression checks.
- Freeze final ZIP, then independent new-context reuse and download/hash verification.

The producer has not run the source or measured browser output in this delivery.
No ZIP hash is invented. Receiver packaging and runtime evidence remain authoritative.
