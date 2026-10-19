# Screen and state patterns

Use the same invented test ship across all views. Ship: Wayfarer, hull 18/30, scrap 42, reactor capacity 8, available reserve 1. Power assignment: Engines 2, Shields 2, Weapons 2, Oxygen 1. Crew: Ivo in Engines, Ren in Weapons, Sol in Medbay. All names and values are synthetic.

## Ship Upgrade — `ship-upgrade`

Show a compact ship plan beside system rows and reactor reserve. Upgrade options: Engine Mk II costs 20 scrap and adds one engine pip; Reactor Cell costs 14 and increases capacity by one. Selecting previews remaining scrap and capacity. Confirm spends once and updates the ship; if insufficient, keep the item visible but disabled with a stated shortfall.

Power reassignment moves one pip from reserve to a system or back. The total power count cannot exceed capacity. Show each segment individually and print the assigned number.

## Sector Shop — `sector-shop`

Merchant stock: Drone Part 10 scrap, Fuel 4 scrap, Hull Patch 8 scrap. Starting scrap 42. Show the compact manifest and the selected item's use preview. Buying one Drone Part reduces scrap to 32 and inventory stock increases by one. A purchase is committed once; a second activation after state update buys only if the new button is intentionally activated again. Cancel does not change the balance.

## Crew and Room HUD — `crew-room-hud`

The ship schematic is central. Show crew tokens in rooms and system pips in a separate edge strip. Synthetic conditions: Medbay occupied by Sol; Weapons charged 60%; Oxygen 97%; one test Fire marker in the Storage room. Selecting a crew token opens Move To choices. Moving Ren from Weapons to Engines updates both room occupancy and the crew task label.

Show Fire with an icon, red status, and “Fire” text. A demo Vent action sets it to “Vented” after explicit confirmation. Keep the live view compact and put long encounter text in a pause drawer.

## Shared interaction contract

While a modal inventory, shop, or system menu is open, mark simulation paused. Never decrement scrap on preview. All power assignments obey the capacity invariant. Focus is visible; keyboard and pointer actions are equivalent. These samples are not the game's actual ship, event or upgrade rules.
