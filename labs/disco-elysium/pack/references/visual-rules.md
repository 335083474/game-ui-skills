# Visual rules

## Scope and dominant gesture

This package follows a painterly, literary detective menu direction for **The Final Cut**. The recognizable gesture is an impasto portrait clipping beside a calm text column, interrupted by a skill voice or a thought fragment. It is about reading, noticing, and interpreting. Do not lay out the information like a tactical RPG inventory or a web chat product.

## Palette and materials

Use a deep, dusty blue-green (`#1c2a2b`) or charcoal background; weathered paper (`#d8d1bd`) for primary text; washed slate (`#7e8d86`) for secondary labels; tobacco ochre (`#b6854c`) for active thought or check emphasis; and muted brick (`#a95545`) for tension. Keep the palette fogged and low saturation. Use a single fine rule, paper-like clipping, or an imperfect brush-edge mask instead of a glossy card frame. Avoid pure-black/pure-white everywhere, candy hues, glowing gradients, and ornamental detective clichés.

## Typography and reading flow

Use a literary system serif such as Georgia for long dialogue, with a humanist sans for compact navigation and monospaced numerals for dice / modifiers. The text column should be 56–74 characters wide on desktop. Use 17–20px body type in an accessible Web adaptation, line height 1.5–1.7, and clear paragraph breaks. Speaker labels are restrained small caps or short uppercase text; they do not become giant title banners. Choices read as offset lines or quiet links with strong focus indication rather than repeated rounded speech bubbles.

## Portrait and interruption anatomy

The portrait is a clipped painted bust or narrow vertical strip, never a circular avatar. Keep it subordinate to the story. Bundled [archivist-portrait.png](../assets/archivist-portrait.png) is an original impasto portrait; use it as a single supporting character clipping and let empty space retain its rough painted edge. A skill interruption can sit in the margin or between dialogue paragraphs with a short skill name, a plain-language voice line, a check threshold, and modifier provenance. The chance/result must also appear as text; color is decoration, not the state source.

## Thought cards and data

Thought cabinet pieces resemble index slips or clipped notes: thin rough border, idea name, current phase, progress, and compact consequence. Use uneven but deliberate alignment. Distinguish a thought under consideration, internalizing, completed, or forgotten with label and icon/text. Do not make the cards into a uniform deck with rarity colors. The effect should be stated in plain language and the synthetic demo should show the same thought state everywhere.

## Composition and responsive behavior

- Dialogue uses one scrolling narrative feed as the primary column. A thin portrait / skill rail may sit beside it at wide sizes; it moves above the feed on narrow screens.
- Skills are a compact categorized index plus one selected skill's internal monologue and modifier breakdown. Keep every percentage accompanied by a reason or modifier list.
- Thought cabinet is a lightly irregular pinboard or index-card surface with a bounded number of ideas and an explicit detail area. Use a drawer for long effects.

Do not show every skill explanation, clue, quest, and thought at once. Keep scroll position when the user inspects a check. At mobile widths use one text column and let the selected portrait become a small inline clipping. Reduce non-essential transitions under `prefers-reduced-motion`; focus needs a visible outline that does not depend on painted texture.

## Asset boundary

The included portrait was created with the built-in image generator and an original prompt; provenance is in [generation.json](generation.json). It contains no named character or official art. There is no local font or copied screenshot. Do not reproduce existing dialogue, portraits, UI screenshots, or logos. A painterly texture cannot be replaced with a flat vector silhouette when that texture is carrying the art direction.
