# Patterns and state contracts

These contracts define coherent demo behavior for generated Web screens, not the full Emerald battle engine. Reuse one shared store; changes in a bag target flow must appear in party and battle views. Keep names short and original, e.g. LEAFLET, CINDER, RIPPLE.

## Shared model

```js
state = {
  party: [{id:'leaf', name:'LEAFLET', sprite:'green-dragon', level:12,
    hp:24, maxHp:36, status:'OK', moves:[
      {id:'tackle',name:'TACKLE',type:'NORMAL',pp:14,maxPp:20,cost:1,power:7,target:'enemy'},
      {id:'leaf',name:'LEAF CUT',type:'GRASS',pp:8,maxPp:10,cost:1,power:10,target:'enemy'}
    ]}, /* at most 5 more; use fire-spirit and water-spirit for other demo members */],
  inventory: {potion:3, tonic:2, remedy:0},
  ui: {screen:'party', selectedPartyId:'leaf', pocket:'items', selectedItemId:'potion', mode:'select'},
  battle: {phase:'command', activeId:'leaf', enemy:{name:'WILD MOSS',hp:30,maxHp:30,power:5},
    turn:0, escapeAttempts:0, canEscape:true, outcome:null, log:[]}
}
```

IDs, not array indices, identify entities. HP is an integer 0…maxHp. Stock and PP are nonnegative integers; PP cannot exceed maxPp. State transitions run once per accepted action. Persist in memory across view changes; optional localStorage must validate loaded values. Reload persistence is not required unless requested.

## Party selection and details

- Default view shows the lead slot and reserve slots, each with sprite, name, Lv, HP bar and numeric HP. Select a member with pointer or arrow keys; selection changes the shared ID and highlight but does not heal or switch active battler.
- Confirm opens that member's details or action menu. Details shows real current HP, level, status and move PP, with Back/Escape returning to the previous member and cursor. Empty slots are not selectable entities.
- A Heal action uses a specific bag item. With Potion: `actualHeal = min(20, maxHp - hp)`. Allow only stock > 0 and `0 < hp < maxHp`. Commit HP and stock together, once; record `LEAFLET recovered 12 HP.` Fainted creatures require a revive, not Potion. Full HP, missing stock, invalid target or cancellation changes nothing and gives a visible explanation.
- Potion count is shared with bag. Double-clicking or held confirm during an animation must not consume two items. A transient resolving lock or synchronous guarded reducer is acceptable. Changing selection while resolving is blocked.
- At zero HP show `FNT` and an empty bar. Use green when ratio > 0.5, yellow when 0.2 < ratio ≤ 0.5, red when 0 < ratio ≤ 0.2. Use ceil for a nonzero visible bar segment, clamped to width; 0 HP has no fill.

## Bag pockets and item use

Canonical pockets: Items, Poké Balls, TMs/HMs, Berries, Key Items. Each remembers its list cursor. Items examples: Potion, Tonic, Remedy. Poké Balls and Berries can be empty: no matching art is bundled. Key Items and TM examples may be informational if their effects are not implemented. Do not display a working-looking Use button that silently does nothing.

1. Select a pocket; show its filtered list, name/count and selected description. Empty pocket says `No items.` Selection cannot point to an entry from another pocket.
2. Confirm an item to show Use/Cancel or an honest disabled reason. Potion opens a party target picker. Back returns to that item's pocket and row with no consumption.
3. Confirm an eligible target. Potion heals 20 capped; Tonic heals 10 capped. The bag count decreases only if actualHeal > 0; both screens update immediately. Zero stock remains visible and disabled or disappears with cursor moved to the nearest valid row.
4. A future Capture Sphere item cannot heal and cannot be used from the field menu. Its battle action may be explicitly disabled as outside this experiment, or implemented with a documented result. Never decrement it without an attempted supported action. Key Items are not consumed.

## Battle commands and turns

Phases: `command → moves → target → resolving → message → command`, with terminal `won`, `lost` or `escaped`. Fight opens up to four move rows. Each shows name and type; the selected detail area shows `PP current/max`. Emerald uses **PP per move**, not a single MP pool. A custom MP variant is allowed only when explicitly requested and clearly labelled as an adaptation; its resource check must be equally transactional.

- FIGHT does not spend PP by opening the menu. Select a move, check `pp >= cost`, then choose an eligible living enemy target (for this one-enemy demo, confirmation may auto-target the displayed enemy). Cancel spends no PP and no turn.
- Commit: lock inputs, decrement PP by cost once, clamp enemy HP after damage, append the move result. Sample deterministic demo damage can be the declared move `power`; disclose it as demo logic. If enemy HP becomes zero, set `won`, log the result and skip enemy response.
- Otherwise the enemy acts once in the same turn: reduce the active member's HP by enemy.power, clamp to zero, and log the response. At zero mark FNT; if no living party member remains set `lost`; otherwise require a valid switch before another move. Increment turn exactly once for the committed player action. Do not resolve another action while a result message is awaiting confirmation.
- Insufficient PP leaves all HP, PP, stock and turn unchanged and shows `No PP left!`. A disabled styling alone is insufficient. Terminal battle controls cannot keep damaging targets.
- BAG opens the same bag in battle context. Successful healing consumes one turn and receives one enemy response; invalid use/cancel consumes neither. POKéMON opens party selection; choosing an eligible living reserve updates activeId and costs a turn with enemy response. Selecting the current/fainted member explains why it cannot switch. Cancel returns to commands.
- RUN has a documented observable result. For a deterministic demo: canEscape=false → `Can't escape!`, costs a turn, enemy responds; canEscape=true → first attempt fails, second succeeds. Increment escapeAttempts per accepted Run. Failed attempt costs a turn and enemy responds; successful attempt sets outcome escaped, logs `Got away safely!`, and has **no** enemy response. Alternate deterministic rules are acceptable if the UI states the rule honestly. Never use a cosmetic toast while battle remains active after success.

## Keyboard and feedback contract

Arrow keys navigate only the active menu. Enter/Space confirms, Escape goes back one level; pocket tabs also support Left/Right. Page navigation must not steal in-game keys while a form or unrelated control is focused. Cursor, DOM focus and selected IDs stay synchronized. A result message is text in an `aria-live="polite"` region; HP/stock/PP remain visible. Keyboard focus is retained after updates. Menus indicate busy/disabled states semantically (`disabled`, `aria-disabled`, `aria-busy`) as appropriate.

## Observable acceptance examples

- Potion at 30/36 with stock 2 → 36/36 and stock 1; Potion again changes neither. At 0/36 it does not revive.
- Potion from bag targets the same party ID visible in party details; going Back displays the changed HP and stock.
- TACKLE at PP 1/20 → enemy loses declared damage, PP 0/20, one enemy response and one turn; next attempt leaves all values unchanged.
- Killing blow skips the response. Back from move or target selection spends nothing. Failed Run receives one response; successful Run ends battle and receives none.

