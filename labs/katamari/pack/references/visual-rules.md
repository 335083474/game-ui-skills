# Visual rules

## Material, hierarchy, and motion

- Tone: Cheerful, tactile, surprising, and deliberately handmade.
- Material cues: cut-paper edges, sticker bursts, oversized circles, misregistered print, found-object silhouettes.
- The hierarchy should be determined by the player's current decision. Reserve the strongest accent for the selected choice, critical status, or confirmation.
- Use a consistent baseline and deliberately varied scale. Keep supporting metadata short and aligned; do not simulate texture behind small text.
- Add atmosphere with local illustration, edge detail, and subtle surface variation. Keep the text field quiet and opaque enough to pass contrast.
- Give focus a visible outline and selection more than a color change. Avoid constant idle animation; use a brief transition only for selection, reveal, or commit.
- At compact widths, reflow collections and lists to a single column. Keep controls reachable and preserve the narrative/action hierarchy.

## Palette

Use the CSS custom properties in tokens.json as the source of truth. The light paper/surface colors support text; ink is the main copy color. Accent red/pink/green is for high-salience actions and selected state only. Secondary colors distinguish a category or authored mark but must not encode a required state alone.

## Type and shape

Use Georgia, serif for title or authored-note moments and 'Trebuchet MS', Arial, sans-serif for controls, labels, and numeric data. A system font is intentional: no local font license is bundled. Keep long copy in an ordinary, readable face. Use cut-paper edges, sticker bursts, oversized circles, misregistered print, found-object silhouettes as restrained edge vocabulary; do not let ornament affect hit areas or crowd selection.

## Avoid

generic neon gradients, tiny dense labels, exact Prince/King character designs, replacing found-object collage with interchangeable cards. Do not use the generated reference as a flat full-viewport background. Never rely on color, texture, or icon alone to communicate a required state.

