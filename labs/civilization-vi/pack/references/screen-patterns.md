# Screen and state patterns

All figures, names and turn values are invented and should be presented as a synthetic save. Share one state across the three screens: Turn 47, Science 17/turn, Culture 11/turn, Gold 126, Faith 38, 2 Envoys, 3 cities.

## Technology Tree — `technology-tree`

Use a short branching graph with prerequisite connectors and one selected node detail surface. Sample nodes: Apprenticeship (2 turns, unlocked by Mining), Education (4 turns, requires Apprenticeship), Machinery (3 turns, requires Engineering). Mining and Engineering are complete; Apprenticeship is available.

Selecting Education before its prerequisite is complete shows its blocker but cannot start it. Starting Apprenticeship marks it as current research; completing it can unlock Education in the same shared state. Keep the tree compact and scroll within the tree area, not the whole page.

## City Production — `city-production`

Selected city: Rivermouth, population 5, 8 turns of food. Queue: Monument (3 turns), Trader (4), Archer (2). Show production per turn, current item preview, and queue position number.

Arrow controls reorder items and the estimated turns update using the synthetic per-turn output: 7 production. Selecting a new unit adds it to the queue only after confirmation. Preserve city identity when moving to other screens.

## Diplomatic Trade — `diplomatic-trade`

Counterpart: Amber Coast. Synthetic treasury 126 Gold, 38 Faith, 2 Envoys. Offer panel starts empty. Candidate exchange: Amber Coast offers 24 Gold for 1 Envoy; sample AI acceptance label is “Fair” and is explicitly treated as demo text, not an actual diplomacy model.

Adjust quantities with plus/minus controls. The balance line compares offered totals but does not claim a real game valuation. Confirm transfers only the shown items once; Cancel clears the draft and preserves treasury. Keep both offer columns visible at desktop width.

## Shared interaction contract

Use one explicit commit for research, queue changes, and offers. Preview and selection never mutate state. Provide visible focus and text labels for map, resources, nodes, and quantities. These examples do not reproduce Civilization VI rules, timings, diplomacy logic, or specific expansion behavior.
