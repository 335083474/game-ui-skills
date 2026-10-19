# Screen patterns

These are composition and state contracts for a fresh output. They do not provide finished screen layouts. All example values in the component board are synthetic.

## Inventory (`inventory`)

**Structure:** A 9-column item matrix with a compact equipment rail, selected-slot treatment, stack counts, and a separate hotbar.

**Design/use:** Keep item identity and stack count visible at a glance. Empty cells stay empty; they are not decorative tiles. Provide a textual selected-item readout and a clear drag/tap target.

## Crafting (`crafting`)

**Structure:** A recipe grid with input slots, a single output slot, and explicit ready, missing, and blocked states.

**Design/use:** Keep ingredients and output in a stable left-to-right relationship. A ready output needs a visible craft action; a partial recipe names the missing ingredient.

## Building Palette (`building-palette`)

**Structure:** A compact block palette grouped by material and use, with swatch, name, and selection state.

**Design/use:** Use material families and simple geometry instead of a card wall. Show the active block and the placement target as separate states; the world preview remains primary.

## Shared behavior

- Use semantic buttons or links, an accessible text name for pictorial controls, and visible focus.
- Separate preview from commit; show disabled, selected, or unavailable states with a label or shape cue as well as color.
- Preserve the primary play/map/work surface at narrow widths. Respect reduced-motion settings.
