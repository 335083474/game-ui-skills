# Visual rules

## Edition and identity

Target the 2019 HD Trilogy collection as an accessible Web adaptation. Keep the interface in the courtroom-record family: witness identity, testimony that advances one statement at a time, and a separate filed evidence surface. It should read as a clear legal drama, not as a general anime adventure menu and not as a radial, timer-driven tribunal.

## Palette and materials

Use deep courtroom navy (`#182c50`), warm file paper (`#e0d3b4`), ink (`#282a31`), muted slate (`#748094`), and restrained crimson (`#ad3d3e`) for emphasis. Gold or brass may mark an exhibit tab, not every button. Use clean hard-edged panels, narrow inner rules, file tabs, and small red evidence marks. Keep the screen bright enough for paper text and the background calm enough for the portrait. Avoid a full bleeding red background, round mobile-app cards, glass effects, and constant speed-line decoration.

## Type, witness, and name plate

Use a clear humanist sans such as Arial / system sans for dialogue and a compact monospace for evidence IDs and dates. Dialogue uses 18–22px readable body type with 1.4 line height. The speaker strip is a short dark-blue bar with a visible name, role, and optional witness marker. The supplied original portrait is a chest-up witness cutout; keep it at 72–120px near the speaker strip. Do not use circular avatars. Face and statement text should not fight for the same space.

## Statement and evidence anatomy

Split testimony into discrete numbered or progress-labeled statements. The active row gets a strong left edge and explicit selection state. Present / Press actions remain visible and distinct. A press reveals a follow-up line on that same statement; it does not accuse. Presenting evidence opens a court-record picker that shows exhibit name, type, and a compact preview, then requires a second action to submit it. A contradiction explains which exhibit field conflicts with which statement. Don't use color alone for correct / conflicting states.

Evidence is an index file, not a loot-card grid: stable exhibit number, description, source, and status are primary. Use paper tabs and a clean record sheet. Episode selection uses an ordered chapter index with a clear unlocked / completed state; do not sell episodes as inventory items.

## Composition and responsive behavior

- Evidence file: one compact index plus one readable exhibit detail sheet; keep image / object preview subordinate.
- Cross-examination: witness strip at top, statement sequence in a central text surface, and separate `PRESS` / `PRESENT` tools near the current statement.
- Episode select: ordered case timeline with summary detail, progress state, and one explicit continue action.

Keep one dominant reading area. Don't display every piece of evidence, every witness, and a full transcript at once. At mobile sizes, stack portrait above testimony, collapse the case list behind a button, and retain a 44px target for both main actions. Preserve statement index when returning from evidence selection. Respect reduced motion; a short transition may mark a testimony advance but should not repeatedly shake the whole interface.

## Asset boundary

`assets/witness-portrait.png` is original AI-generated fictional art; see [generation.json](generation.json) for prompt and provenance. It is not an official character. No in-game screenshot or file is included. Do not reproduce known characters, quotations, case names, evidence art, logos, or screenshot layouts. The testimony console is a design interpretation, not a claim to an official component specification.
