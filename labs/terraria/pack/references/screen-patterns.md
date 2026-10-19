# Screen patterns

Use one clearly labeled synthetic demo state across related screens. These contracts define hierarchy and interaction intent, not original-game rules.

### Inventory — inventory

A compact grid, quickbar, equipment rail, and selected-item detail.

Show counts in fixed corners, keep the selected slot visible, and place the inspector beside the grid on desktop.

### Crafting — crafting

A recipe bench that groups ingredients, output, and availability.

List the ingredient check beside an original output icon; make one explicit button the commit action.

### Equipment — equipment

Named head, chest, leg, accessory, and tool specimens.

Use distinct slot labels and show one selected comparison without relying on color alone.

## Shared responsive contract

Selection updates a visible preview; an explicit commit control is the only action that implies a state change. At 390 px, reflow secondary details and item grids instead of shrinking labels or introducing horizontal overflow. Provide visible keyboard focus in authored screens.
