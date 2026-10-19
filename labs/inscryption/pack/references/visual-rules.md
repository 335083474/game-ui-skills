# Visual rules

## Scope and silhouette

This package targets the first-act cabin tabletop direction. Treat each interactive object as a thing placed on, held over, or etched into a rough table. The defining silhouette is a tall, slightly irregular paper card with a clear art window and a heavy lower information band. Keep the surrounding surface dark and quiet. Do not import the later acts' interface languages or turn the scene into a generic occult dashboard.

## Surface, frame, and light

Use smoky near-black brown for the table (`#211b16`), warm umber for recessed areas (`#382b20`), and aged ivory (`#e4d6b1`) for the face of a card. Paper may use tiny noise or uneven edge treatment, but text sits on a mostly calm field. Frames are thin, imperfect dark-ink lines, occasionally doubled; corners may be nicked or clipped rather than rounded. A restrained amber light can catch an edge. Red-orange is reserved for danger or an exchange cost, never a general highlight. Avoid glass, glossy gradients, neon, bright wood grain behind every word, and ornamental filigree that reduces legibility.

## Card anatomy

Keep the title on a short top line. Cost pips sit in a fixed upper-left pocket and remain visible when the card is selected. The illustration is one large central window; use the bundled original woodcut creatures as local art and crop the four atlas cells with `background-size: 400% 100%`. The bottom band carries attack and health as separate high-contrast marks, with sigils in a small named row below. The values must remain textual as well as symbolic. Do not bury health inside the art or make a long prose paragraph part of the card face.

Use a compact serif for names and labels with a system monospace stack for counts. Keep names at 18–22px in accessible web adaptation and rule text at 15–17px. Card titles are not all-caps display logos. Use tabular numbers. At narrow width, enlarge hit areas with transparent padding while preserving the visible paper silhouette.

## Selection, cost, and feedback

Selection uses a lifted shadow and a small amber edge or ink notch. Avoid a large glowing outline. A card that cannot be afforded is visibly muted and disabled, with its cost still readable and a short reason in adjacent help text. Hover may raise the card by a few pixels; keyboard focus needs a crisp, high-contrast inner ring. Confirming an exchange changes the shared deck or token count once; focusing or previewing a card never spends a resource.

Render blood / bone / energy costs as distinct named pips, not color alone. Keep payment order and count visible. Use a plain text “selected” or `aria-pressed` state for assistive technology. Reduced-motion users receive the same state change without lift animation.

## Layout grammar

- Reward: a small group of full-height choices floats over a mostly empty table; reserve more width for art than copy. Do not add a dashboard header, category rail, or oversized lore card.
- Deck: show the owned stack as a tactile spread or compact binder with a separate selection / detail surface. Keep card identity, count, and sigils consistent with reward cards.
- Trade: anchor an offer and a receive area on opposite sides of a narrow exchange line. Make the exchange price and final confirmation explicit. Keep the table as the shared stage; do not substitute a shopping cart grid.

The desktop adaptation can use a centered table board up to about 1100px wide. On mobile, place choice cards in a horizontal scroll lane with snap points or a vertical stack, keep the selected card in view, and avoid shrinking card text. Keep animation sparse: one short lift on selection and one explicit exchange feedback state.

## Art boundary

`assets/woodcut-creatures.png` is an original, AI-generated four-creature atlas. It is not extracted from the game and contains no official characters. Reuse its individual cells consistently. Do not imitate named game cards or copy official logos, card art, text, or icon silhouettes. Build simple pips, rules, and table marks in CSS or SVG; do not use vector shapes as a substitute for the carved illustration texture.
