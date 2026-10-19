# Screen patterns

Use one invented character, one equipped weapon, a small pack, and a short skill branch across the views. These are contracts, not finished screen layouts.

## Weapon comparison

Show current and candidate weapon plates side by side, with silhouette, item name, level, manufacturer, rarity name, element label, and a compact aligned stat list. Insert explicit signed deltas between comparable values. Keep the equipped marker on the current item while moving focus through the candidate list. Previewing a candidate must never equip it. Equip requires one confirm action, updates the current item, and announces the committed change. If a level or slot constraint blocks use, explain it in text.

Synthetic example: “Rivet-7” has Power 34 and Rate 2.1; “Arc Slinger” has Power 29, Rate 2.4 and Shock 8. Values and brands are invented. The example illustrates tradeoffs, not a weapon-performance recommendation.

## Inventory

Use a compact multi-column bag of item silhouettes with a clear type / tier grammar and a selected item detail plate. Sorting by type, level, or tier changes order only. The selected panel identifies current ownership and has separate Inspect / Equip / Drop actions as appropriate. Confirmation gates destructive removal. On a narrow viewport, keep a small item list above a full-width detail panel instead of shrinking every cell. Do not turn all item entries into large feature cards.

Synthetic example: eight items across two types. The selected “Arc Slinger” remains in focus when the sort changes; a unique item cannot be duplicated by repeated clicks.

## Skill tree

Display a small branch with visible connector lines. Each node includes name, point cost, locked / available / purchased status, and one-sentence effect. A locked node points to the prerequisite that must be purchased first. Selecting a node previews its cost and effect; confirming spends one skill point once and updates its descendants. Keep the point total visible beside the branch heading. In a Web adaptation, expose the graph as navigable buttons and give screen-reader users the prerequisite text in order.

Synthetic example: “Quick Hands” (1 point) unlocks “Capacitor Loop” (2 points). The latter stays disabled until its prerequisite is purchased; these mechanics are invented.
