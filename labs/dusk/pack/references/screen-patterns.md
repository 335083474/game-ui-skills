# Screen patterns

These are composition and state contracts for a fresh output. They do not provide finished screen layouts. All example values in the component board are synthetic.

## Weapon Loadout (`weapon-loadout`)

**Structure:** A compact row of invented weapon silhouettes, ammunition counts, current selection, and one contextual action.

**Design/use:** Keep the selected weapon obvious with outline and number, not just color. Ammo count sits beside its weapon; long descriptions stay behind inspection.

## Combat HUD (`combat-hud`)

**Structure:** A low-chrome live playfield with one central reticle, edge health/ammo readouts, and a transient interaction hint.

**Design/use:** Protect the center and lower-middle of the view. Keep the persistent overlay to a thin frame-edge budget; settings and long lists only appear after pause.

## Pause Settings (`pause-settings`)

**Structure:** A paused control list with keyboard bindings, one selected row, and a small display/audio switch group.

**Design/use:** Use compact rows with explicit current values and a visible focus/selected state. Pause disables camera control while menus take pointer focus.

## Shared behavior

- Use semantic buttons or links, an accessible text name for pictorial controls, and visible focus.
- Separate preview from commit; show disabled, selected, or unavailable states with a label or shape cue as well as color.
- Preserve the primary play/map/work surface at narrow widths. Respect reduced-motion settings.
