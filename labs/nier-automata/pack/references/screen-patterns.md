# Screen and state patterns

Use one shared invented save state across all three views. These patterns describe composition and behavior, not the original game's exact data or mechanics.

## Chip Loadout — `chip-loadout`

Synthetic state: 28 / 64 memory units in use; installed chips: Auto-Use 8, Shock Wave 4, Offensive Heal 8, Drop Rate 4, and Critical Up 4. Available: Weapon Attack +3 (8), HP +2 (6), Empty Slot Expansion (12).

Arrange a shallow loadout matrix beside a narrow inventory list. Capacity is always printed as `28 / 64`; the thin meter is supplementary. Selecting a chip previews its cost and effect. Confirming an install replaces only the chosen empty/occupied slot and recalculates capacity once. Reject an install that exceeds 64 with a reason; Back discards the preview. A slot can be cleared without consuming inventory.

## Item Case — `item-case`

Synthetic state: Recovery Unit 5, Melee Attack Up 2, Small Recovery 7, Fish 1. Show one compact category strip, a vertically aligned list, and a quiet detail line. The active item's quantity sits in a fixed right column.

Use Recovery Unit on a damaged test unit to restore 160 of 240 HP, capped at max, and decrement one only when HP changes. A full target or zero quantity disables confirmation with an explanation. Category changes preserve the selected item when it remains in that category; otherwise select the first available row. Do not add invented rarity colors.

## System Settings — `system-settings`

Synthetic state: vibration on, camera sensitivity 5/10, minimap rotation off, auto-lock on. Use one settings list with values aligned right and short descriptions below only for the selected row.

Left/right changes a slider by one step; Enter toggles booleans; Reset asks for a reversible confirmation. Values persist while navigating among the three demo views and reset only through the labeled Reset Demo action. Keep the global help line short.

## Shared interaction contract

Use semantic buttons or listbox options, visible focus, arrow-key navigation, Enter/Space to commit, and Escape/Back to discard or return. Pointer activation has identical results. Settings, installed chips, item counts, and HP must remain internally consistent. All names, effects, and quantities above are synthetic.
