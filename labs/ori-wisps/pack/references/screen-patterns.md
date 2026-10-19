# Screen patterns and synthetic behavior

## Ability configuration
A compact skill constellation and selected ability details with cost, prerequisite, and equip action.
Primitive: Ability node. A constellation may curve organically, but the focus sequence remains predictable. Each node exposes name, cost, unlock state, prerequisite, and equipped state in text.

## Spirit shard loadout
A limited slot layout compares equipped shards and makes replacement reversible before apply.
Primitive: Shard slot. Choose a slot first, preview a replacement with its benefit and tradeoff, then apply or cancel. Preserve existing equipped state until apply.

## Forest map
A layered location map with discovered route, current position, and accessible region labels.
Primitive: Map waypoint. Mark current, discovered, and unknown locations with text and unique shapes. Keep route relation visible when the map is scaled or stacked.

## Synthetic contract
demo-state.json has invented values. Use stable IDs for abilities, shards, slots, and places. Selecting an ability does not spend points until a named confirmation. A shard swap is pending until apply; cancel clears pendingSwap without changing equipped IDs. Map panning/focus does not silently change current location.

## Observable behavior
- Keyboard traversal follows a stable order even when nodes are positioned organically.
- Locked abilities expose their prerequisite and point cost in text.
- Shard preview announces outgoing and incoming names; apply changes the slot, cancel restores it.
- Map places expose state, label, and route relation without hue-only meaning.
- Focus remains visible on dark paint; body text stays on a quiet backing surface.
- Reduced motion removes ambient shimmer while retaining a still focus ring and updated status.

