# Screen patterns and invented demo state

All items, metrics, prices, ranges, and statuses below are invented for the Web specimen.

## RIG Inventory — rig-inventory

Show suit status, equipment slots, and one selected-item inspection. The utility module remains pending until Install is pressed. Cancel restores the installed module.

Demo loadout: Arc Tool; Air Capsule; Patch Kit x1; Charge Cells x2; Survey Lens installed in Utility. Pending alternative: Tether Coil. Demo readouts: hull reserve 72/100; air 04:30; power cells 2. Confirm Tether Coil to replace Survey Lens in this page session.

## Store Kiosk — store-kiosk

Show available credit, item, price, and remaining credit. Purchase is disabled if balance is too low. Cancel clears the preview. Confirm decrements credit and increments the shared page-session stock count.

Starting credit: 48. Patch Kit: 14 credits. Charge Cells: 22 credits. Prices and stock are synthetic and are not saved.

## Locator — locator

Show a selected objective, directional vector, landmark, and demo range. Choose a target to preview its bearing; Track target commits it for this page session. Clear tracking cancels.

Targets: Cargo Lift / 86 m / 042 degrees; Tram Access / 124 m / 310 degrees. Values are illustrative, not game measurements. Keep the path graphic spatial and the objective label short.

## Interaction contract

Preview and commit remain distinct. Update stock and balance consistently across the RIG and Kiosk. Use aria-live, semantic buttons, focus-visible outlines, and reduced-motion support. Nothing is persisted after reload.
