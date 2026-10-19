# Visual rules

## Glyph-first terminal

Use actual text characters and a system monospace stack for maps, markers, equipment signs, and log prefixes. The core visual texture comes from character spacing, line breaks, box glyphs, and deliberate empty space; do not rasterize text into a texture or substitute a generic dashboard with a dashed font.

Set the field near-black with a soft forest-green text layer. Use amber for the focused cell, selected part, and warning; reserve cyan for machine-readable or scan data. Keep glow and scan texture light. The selected glyph should remain crisp and readable at normal zoom.

## Information structure

Treat the map as navigable information, not decoration. Keep the player's position and coordinate visible, provide a compact glyph legend, and pair special symbols with text labels. Use a map frame with thin grid lines, a few blank breathing spaces, and a purposeful mix of room, passage, object, and hazard glyphs.

Equipment should read as a slot schematic with part, condition, and function. Keep slots and statuses aligned in columns; avoid loot-card stacks and character portraits. Event logs should use a clear ordering cue, short lines, and distinct but labeled alert levels. Do not convey severity by color alone.

## Keyboard and focus

Show the supported keys beside the relevant component. In the specimens, arrows or `h/j/k/l` move the map cursor, Enter inspects the focused location, and Escape returns to the neutral state. List rows and commands must also be focusable and usable with standard keyboard activation. Provide visible focus treatment and a text status update after interaction.

The component page demonstrates local input behavior only. Do not claim complete game controls, pathfinding, world simulation, or build-specific key bindings.

## Responsive behavior

Keep the glyph grid aligned at narrow widths by reducing its cell spacing rather than wrapping individual rows. Let detail columns stack below the focused surface. Use scrollable containers for long logs only when needed, with a visible start/end cue. Respect reduced motion; terminal text remains still by default.

