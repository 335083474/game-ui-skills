# Visual rules

## Engineering schematic

The ship layout is the primary picture: flat top-down rooms with hard rectangular walls, short door connections, and minimal interior marks. Use the local vector blueprint as a starting primitive, then adapt the room count to the requested ship. Do not use a glossy 3D ship render, atmospheric nebula background, or a centered marketing hero.

Surround the ship with small operational modules. Keep the stage almost black and panels charcoal or pale iron; use clear 1px or 2px outlines. System modules are rectangular and compact with a name, one status line, and power pips. Use crisp square corners and flat fills. Avoid gradients, rounded cards, bevels, and decorative glow.

## Power and danger semantics

Reactor power is represented as discrete pips. Assigning one point moves a pip between reactor reserve and a named system; total power must remain conserved. Disabled systems show a clear label. A system at zero pips stays present but visibly unpowered.

Green marks operational, amber marks low reserve or warning, and red marks hull breach, fire, or other active danger. Color is always paired with text or a distinct symbol. Crew tokens are small rectangular chips with name, room, and task. Do not use circle portrait avatars. Use a short progress bar only for weapon charge or a timed event.

## Shop and upgrade surfaces

A shop is a compact vertical manifest with item/system name, type, price in scrap, and current stock. Preview preserves current balance; a confirmed purchase deducts once and updates installed state. A ship upgrade screen displays hull, reactor, weapons, shields, and doors as editable components rather than large equal-weight cards. Show current value and proposed increase.

Crew and room HUD is an operational board. Put oxygen, hull, and system power in a narrow edge strip. Keep long event text and inventory behind pause or a side drawer. Do not show every system detail in the normal view.

## Interaction and responsive behavior

Pause time while inventory or shop menus are open. Pointer-driven controls must not accidentally move crew or fire weapons underneath. Use keyboard navigation with visible focus and Enter/Space to commit; Escape exits a preview. On mobile, pan the ship board horizontally while keeping the power strip visible. Respect reduced motion; allow a short pip transfer animation only on confirmed reassignment.
