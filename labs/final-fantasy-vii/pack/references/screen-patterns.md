# Screen and state patterns

These are compositional and behavior contracts, not complete screen templates. All values in [demo-state.json](demo-state.json) are original demonstration data, not a certified FFVII rules database. Use one shared state for all requested screens; changes to HP, inventory, equipment or MP must carry between them for the current session.

## Party

Place three portrait/resource rows in a wide left window, with a narrow right command window. A compact member-detail or help window can occupy a lower edge. Show name, level, HP current/max, MP current/max and relevant status. Optional original-menu anchors include Location, Time and Gil. Keep art subordinate to numbers.

Baseline: Rook 640/892 HP, 41/80 MP; Bran 908/1284 HP, 20/48 MP; Lyra 410/735 HP, 67/120 MP. Selection changes the cursor and member details; it does not silently mutate stats. Support one meaningful secondary operation, or both if requested:

- Potion use: choose Item → Potion → party target → confirm. Potion restores 100 HP, capped at max, and removes one from inventory only when HP actually increases. Rook goes 640→740 and count 6→5. If the target is full or count is zero, disable confirmation with a help-line reason. Back cancels without cost. Display feedback in a blue help strip and update number and gauge together.
- Order: choose Order, select source member, then destination; swap member IDs in the party-order array. Keep character resources and gear attached to IDs, not visual positions. Selecting the same member cancels the swap; Back leaves order unchanged. A source pointer and a distinct destination pointer can coexist during swap targeting.

Details should reflect the selected character's real equipped gear and derived stats. Use original names Rook / Bran / Lyra with the atlas rather than the generated direction image's accidental franchise labels.

## Equipment

A small selected-member header sits above a slot window; slot selection opens the compatible candidate list. Keep a current→preview stat table beside that list and a one-line item explanation below. Candidate hover/focus previews numbers; selection commits. Escape/Back closes the candidate list and discards preview. Equipped marker and inventory availability must agree after commit.

Use Weapon / Armour / Accessory slots, with optional tiny materia socket circles on weapon/armour lines. The green orb is a materia study; it is not an equipment-slot shortcut. It may be shown in a socket detail or art specimen, but no materia mechanics are required unless requested.

Sample deterministic derived stats:

`attack = base.strength + weapon.attack`

`defense = base.vitality + armour.defense`

`magic = base.magic + accessory.magic`

`magicDefense = base.spirit + armour.magicDefense`

These are simplified demo formulas, not a reconstruction of every original game mechanic or port bug. Rook begins with Steel Sword (+18 attack), Silver Wristguard (+14 defense/+4 magic defense), Copper Charm (+0 magic). Thus attack 48, defense 32, magic 26, magic defense 24. Preview Alloy Sword (+26 attack) as 48→56 (+8); commit and show 56 in every subsequent member-detail and battle calculation. Reinforced Guard previews defense 32→42 (+10). Memory Charm previews magic 26→32 (+6). A candidate cannot be equipped in the wrong slot or by a member absent from its compatibility list. Avoid permanently adding bonuses during repeated clicks: always derive from base plus current equipment IDs.

The sample inventory owns one of each candidate. A free copy is ownership count minus the number currently equipped. Selecting a new item returns the old one to free inventory and consumes a free copy of the new item. Already equipped selection is a no-op; it must not duplicate or delete an item. Disable unavailable rows with an explicit reason.

## Battle commands

Use a quiet dark arena, a bottom party status band and a compact overlapping command list. Distinguish member names, HP, MP, Limit and Time. Add a short top or bottom help window. The arena may use simple HTML/CSS silhouettes and target labels; no new artwork is necessary. Avoid importing modern FFVII action HUD motifs.

State flow: `command → ability/item → target → resolving → waiting`, then `command` when a member becomes ready. Back unwinds one layer to its previous selection. Never spend MP or inventory merely by opening a submenu or previewing a target. The command list contains Attack, Magic, Item, Defend. Attack opens enemy targeting, Magic opens a named costed spell list, Item opens inventory counts and target selection, Defend resolves a self action.

- Start with Rook ready (Time 100), Bran at 40, Lyra at 72. Only a ready living actor can commit a command. A demo may freeze time while menus are open and provide an explicit Advance Time control. Label this as a simplified ATB simulation.
- Fire costs 4 MP and deals 140 damage to one living enemy. Cure costs 5 MP and heals one living ally for 180 HP, capped at maximum. Blizzard costs 4 MP and deals 130 damage. Flare costs 80 MP and is unavailable for Lyra's starting 67 MP. Display costs before target confirmation and explain insufficient MP in the help line.
- Attack deals `2 × current actor.attack`; Rook's initial attack deals 96, Alloy Sword deals 112. A target with 0 HP cannot be selected again. Clamp all HP at 0/max.
- Confirm Fire against Training Drone: Rook MP 41→37; drone HP 420→280; Rook Time 100→0; help line reports actor, spell and target. Confirm Attack initially: drone 420→324. The reference does not require complex enemy AI.
- Confirm Potion on Rook: same shared inventory and +100 capped healing as Party. One count is consumed once. Confirm Defend: set a visible Defending status and reset actor Time; do not open a target submenu.
- After any resolution, clear pending targets/costs, prevent repeated activation and show Waiting until a living actor is ready. An Advance Time step may add 30 Time to each living member, capped at 100, then choose the first ready member in party order. Selecting a ready member can switch actors. Defending clears when that member's next action resolves.
- If all enemies reach 0 HP, enter Victory, disable combat commands and show the result in the same blue-window language. A Reset Demo control may restore the initial shared state, and must be labeled accordingly.

Keyboard: arrows navigate the active list; Enter/Space selects; Escape/Back unwinds; Tab reaches cross-window controls. Preserve focus on the opening row after returning from a submenu. Pointer selection and keyboard selection perform the same action. Use semantic buttons, named lists and live feedback.

## Connecting screens

Use a modest text navigation row outside the game stage, or small same-style window tabs. The navigation is demo infrastructure; do not let it dominate the menu. Screen changes preserve shared character and inventory state. Portrait identity, frame colors, numeric alignment, item art and resource semantics must remain stable across all screens.
