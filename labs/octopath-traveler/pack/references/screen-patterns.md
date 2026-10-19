# Screen patterns and synthetic behavior

## Party (party)

Use a concise party rail with named members, roles, and one clearly marked selected member. A selection changes the details being viewed; it does not change party order or the lead until a separate Set lead action. Show health or other values only when real data is available, or label fixture values as examples.

## Character equipment (character-equipment)

Focus one chosen actor and one equipment slot at a time. Compare current and pending item names and effects in text. Apply commits the change; Cancel clears the pending preview. Unknown values remain unknown rather than being filled with invented zeroes.

## Battle orders (battle-orders)

Integrate the turn sequence and compact command choices into the live stage. Keep actors visible and use a stable order for command navigation. Selecting Strike, Guard, or another supplied action previews intent only. Confirm action is the explicit commit. A generic specimen does not simulate combat or imply a real turn was sent.

## Synthetic contract

demo-state.json invents four party members, example equipment, values, and a turn queue. They are interface fixtures, not OCTOPATH TRAVELER data. Keep selectedMember, pendingEquipment, and selectedCommand separate from committed state.

## Observable behavior

- Party selection updates the focus label; Set lead is a separate explicit action.
- Equipment selection shows a pending comparison; Apply and Cancel have distinct outcomes.
- Battle command selection changes preview only; Confirm action is separate.
- Keyboard focus is visible through every specimen, and values remain labeled without relying on color.
- Reduced motion removes ambient particles and transitions without hiding a committed state.

