# Screen patterns

These are composition and state contracts for a fresh output. They do not provide finished screen layouts. All example values in the component board are synthetic.

## Route Editor (`route-editor`)

**Structure:** A connected transit topology with station shapes, editable route segments, transfer points, and a compact line legend.

**Design/use:** The network is the primary surface. Keep route selection explicit and show the focused route's endpoints; route drawing should be reversible until applied.

## Capacity Upgrade (`capacity-upgrade`)

**Structure:** A station-centered choice of one capacity token with current/next values and a clear confirmation state.

**Design/use:** Attach resource controls to the map. Distinguish carriage, line, and interchange capacities through original shapes and labels; do not wrap each in a dashboard card.

## Day Results (`day-results`)

**Structure:** A network after a service interval with passenger throughput, queue pressure, and one concise next action.

**Design/use:** Keep the route map in view. Represent flow by line weight and queue pressure by a marked station plus text; a result banner summarizes without replacing topology.

## Shared behavior

- Use semantic buttons or links, an accessible text name for pictorial controls, and visible focus.
- Separate preview from commit; show disabled, selected, or unavailable states with a label or shape cue as well as color.
- Preserve the primary play/map/work surface at narrow widths. Respect reduced-motion settings.
