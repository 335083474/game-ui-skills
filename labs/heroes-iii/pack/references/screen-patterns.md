# Screen patterns

Use one clearly labeled synthetic demo state across related screens. These contracts define hierarchy and interaction intent, not original-game rules.

### Hero Sheet — hero-sheet

A framed hero portrait, skill medallions, army row, and concise attribute summary.

Keep portrait and identity first, then skills and a single army row; use repeated small labels for dense data.

### Town Recruitment — town-recruitment

A town specimen with creature family, available quantity, cost, and recruit confirmation.

Group each creature with its original emblem, availability, and synthetic cost; commit recruitment explicitly.

### Spellbook — spellbook

An open parchment book with category rail, selectable spell glyphs, and one selected-spell note.

Keep category tabs and glyph grid within the open book; selected detail should remain short and readable.

## Shared responsive contract

Selection updates a visible preview; an explicit commit control is the only action that implies a state change. At 390 px, reflow secondary details and item grids instead of shrinking labels or introducing horizontal overflow. Provide visible keyboard focus in authored screens.
