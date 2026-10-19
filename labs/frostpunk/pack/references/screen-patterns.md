# Screen and state patterns

The settlement state is invented and shared across the three views: temperature −20°C, coal 450, wood 120, steel 36, food rations 86, hope 52/100, discontent 21/100, population 42. Do not imply these values match a real scenario.

## Book of Laws — `book-of-laws`

Use a compact header showing temperature and one line of settlement status. The book itself is a stack of two or three ordinance slips, with one selected. Synthetic proposals: Emergency Shift (coal output +20, discontent +8), Shared Kitchens (food use −4/day, hope +3), Child Shelters (wood −18, hope +5). Show the forecast before enactment.

Signing Shared Kitchens commits its resource/civic changes once and marks the law signed. A second click is a no-op. Keep an Undo Demo action separate and label it clearly. Never state fictional consequences as original game balance.

## Technology Tree — `technology-tree`

Draw three short branches: Heat, Exploration, Food. Available nodes show a steel-outline icon, short title, and research-day cost. Completed nodes are chalk-bright; blocked nodes show a named prerequisite.

Synthetic state: 28 research hours available; Steam Hub (20h, requires Generator Range I), Sawmill (16h, available), Beacon (24h, available). Starting completed: Generator Range I and Workshop. Select a node to preview cost; commit removes the exact research hours and marks the node complete. The simplified demo does not advance a calendar.

## City Resource HUD — `city-resource-hud`

Show temperature and generator level as the first cluster, then coal/wood/steel/food in a narrow strip with numeric values and daily trend labels. Place one small settlement vignette or building silhouette at an edge; never cover a large live playfield with panels.

Synthetic trends: coal −18/day, wood +6/day, steel +2/day, food −11/day. Toggle “Coal Throttle” to reduce generator coal use by 4/day while changing the temperature warning to “lower heat output”; this is a demo switch, not a game rule. Keep hope and discontent accessible in a secondary drawer.

## Shared interaction contract

All values above are synthetic. Use buttons for laws/nodes/toggles with keyboard focus. Previews do not mutate state. Confirm commits exactly once; reset is explicit. Keep all counts numeric and show units or per-day trend in text.
