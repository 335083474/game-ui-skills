# Screen and state patterns

Use one invented squad and shared test state. These are not XCOM rules or recorded game values.

Synthetic squad: Vesper (Ranger, 6/6 HP, 2 actions), Holt (Grenadier, 5/6 HP, 2 actions), Nia (Specialist, 6/6 HP, 1 action). Loadout: Vesper has Pulse Carbine and Medikit; Holt has Shard Launcher; Nia has Arc Thrower. Tactical mission: extract a civilian from a city block, objective remaining 3 turns.

## Squad Equipment — `squad-equipment`

Use a roster rail with selected-soldier dossier, slot list, and compact current/preview comparison. Selecting the Arc Rifle candidate previews +1 aim and −1 mobility in the synthetic values. Confirm equips it; returning to the roster shows it in the same soldier slot. Escape cancels preview. Do not use an avatar wall or generic inventory cards.

## Tactical Orders — `tactical-orders`

Keep the mission playfield clear and anchor a compact selected-soldier dossier and command strip to a lower edge. Commands: Move (1 action), Overwatch (1), Fire (1), Reload (1), Heavy Grenade (both actions). Selecting a destination previews cover and movement range; confirm consumes one action. Synthetic shot against a named training target has 72% hit chance and a visible “demo chance” label.

After one action, the action pips update. A soldier at zero actions cannot commit another command. Back returns to the command list without spending an action. Show the objective and 3-turn countdown in a small edge chip only.

## Research — `research`

Show the selected project, assigned scientist count, progress, and remaining hours. Synthetic projects: Modular Weapons (6h remaining), Medikit Upgrade (10h), Resistance Radio (14h). Assigning one of two scientists speeds the chosen project by one demo hour per simulated day; confirm changes assignment once. Keep projects in a compact list with a single detail surface, not a laboratory dashboard.

## Shared interaction contract

Keep equipment, soldier HP/actions, objective turns, and project assignments coherent. All chance, duration, and effect values above are invented. Use semantic controls, visible focus, keyboard and pointer parity, and explicit confirmation for action-consuming moves.
