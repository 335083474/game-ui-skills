# Consistency and acceptance checks

## Visual comparison

Open the generated direction and a real browser render of the implementation side by side. Use the component board for editable anatomy. Check at a desktop viewport near 1440×1000 and at 390×844; capture actual pages and label generated references separately.

- Blue dominates every window; the top-left is brighter than the lower-right. Frames have a fine silver outer/inner edge, not a thick white outline or neon glow. Radius stays under 4px.
- Type is the bundled sans, small relative to windows. Primary names/values are white, metadata can be cyan, disabled rows muted. Fonts and atlas load offline without network requests.
- Numbers align by column and use tabular digits. HP/MP values do not collide at 4-digit HP or 3-digit MP. Portrait, name and resources form a row rather than three unrelated cards.
- Cursor is visible at the selected row, and the selected background remains blue. Focus is usable without a mouse. No emoji cursor, letters in place of portraits, circular avatar, pill or dashboard card has slipped in.
- All screens use the same three original portrait crops and frame recipe. The atlas sword, wristguard and green orb remain in the intended cells and preserve transparency. Green orb belongs to materia visual language.
- Equipment is dense and aligned; comparison shows both numbers plus an arrow/signed delta. Battle distinguishes HP, MP, Limit and Time, with commands near the status band.
- At mobile size windows stack, labels remain readable, controls have useful hit areas and no whole-page horizontal overflow appears. Scroll a dense internal list if needed.

## Observable behavior

Use demo-state.json or another coherent documented initial state. Check outcomes, not only button styling.

1. Select each party member. Detail data and pointer follow the ID and the portrait remains consistent. If Order is implemented, swap first/third; equipment and resources travel with member IDs.
2. Use one Potion on initial Rook. HP becomes 740/892 and quantity becomes 5. Re-rendering or switching screens must not repeat the effect. Back before confirm must leave both unchanged. At max HP or zero quantity, show a reason and do not consume.
3. Preview Alloy Sword for Rook. Attack reads 48→56 (+8) while committed attack remains 48. Cancel and confirm unchanged state. Preview again, commit once, then party details read 56 and Attack battle damage becomes 112. Reconfirming the already equipped item is a no-op.
4. Swap to Reinforced Guard and verify defense 42. Inventory free counts account for equipped copies. Try an incompatible slot/candidate; block it with a reason.
5. Open Magic. Show spell names and MP costs. Back cancels without expenditure. Confirm initial Rook Fire on Training Drone: MP 37, enemy HP 280, actor Time 0, Waiting status. A double click cannot consume twice.
6. Advance time until Lyra is ready; show Flare 80 unavailable at 67 MP. Confirm cannot open a valid target flow or deduct MP. Cure restores capped ally HP and spends exactly 5 MP only on confirmation.
7. Attack targets living enemies only. Defend changes visible actor status and consumes Time. After all enemies reach 0 HP, commands stop at Victory. Reset Demo restores the initial coherent shared state if supplied.
8. Repeat one entire submenu→target→confirm flow by keyboard and one cancel flow. Focus returns to the opening choice. Screen readers receive action/result text and numeric resource updates.

## Honest completion

The isolated primitive board is input evidence, not a successful three-screen forward test. A package can be structurally valid before the independent usage test finishes. Report which runnable screens, states, viewport captures and checks actually ran. Never fabricate screenshots or label the generated direction image a browser capture. Do not alter frozen package inputs to hide implementation defects.
