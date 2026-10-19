# Screen and state patterns

Use one shared invented test account. Names, values, abilities and puzzle route are synthetic and not claims about BioShock balance.

## Tonic Vending — `tonic-vending`

Starting funds 54 ADAM-like tokens (label the synthetic currency simply as Scrip to avoid implying original mechanics). Shelf stock: Health Tonic 18, Salt Tonic 24, Brass Key 40. Show a tall machine plaque, compact shelf rows, remaining Scrip, and one selected-item detail.

Preview does not spend currency. Confirm Health Tonic leaves 36 Scrip and decrements stock once. If the balance is short, show the exact difference and keep the row selectable. Never add a modern product-card grid.

## Plasmid Upgrade — `plasmid-upgrade`

Synthetic account: 2 upgrade seals. Upgrades: Arc Current level 1→2 costs 1; Stone Veil level 0→1 costs 2; remaining seals shown numerically. Selecting an upgrade previews current and next values side by side. Confirm commits once and decrements seals. Escape returns to the list without spending. Do not describe an upgrade as an official game mechanic or copy exact ability text.

## Hacking Relay — `hacking-relay`

Build a 4×4 grid of rectangular relay nodes; synthetic start at row 4, column 1 and destination at row 1, column 4. The goal is to route power through four connected nodes while avoiding two locked hazards. Show short timer as a textual countdown and progress as node count.

Arrow keys move focus; Enter toggles a route node. A complete valid route changes status to “Relay connected”; Reset clears only the current path. Timer expiry reports failure but leaves a reset action available. Do not imply this reproduces the original hacking minigame.

## Shared interaction contract

Use accessible labels for each row and grid cell, visible keyboard focus, and equivalent pointer behavior. Purchase and upgrade operations commit exactly once; all previews are reversible. Keep Scrip, upgrade seals and selected module consistent while navigating.
