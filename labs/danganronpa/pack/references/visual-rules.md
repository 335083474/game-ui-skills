# Visual rules

## Edition and visual identity

Target the first PC release of **Trigger Happy Havoc**. The package author's interpretation centers on a graphic pop-trial: black-and-white fields, hot-pink interruptions, clipped panels, diagonal testimony, and a roundtable / evidence-selection rhythm. The screen should feel more kinetic than a conventional courtroom transcript. Distinguish it from red-black heist typography and from a calm evidence dossier.

## Color, geometry, and type

Use ink black (`#17171b`), paper white (`#f5f2ef`), hot pink (`#ed1d72`), and a small yellow evidence accent (`#f4d83f`). Add gray only for inactive / muted information. Separate states by label, icon, and shape as well as color. Use sharp black borders, hard offset shadows, clipped corners, thin diagonal separators, and occasional radial spokes. Pink should highlight the active mechanism, not coat every panel. Do not use simulated blood, gore, or a copied bear mascot.

Use a heavy geometric sans for loud short labels and a neutral sans for statements. Body text stays 16–20px with short line length; stat / evidence IDs may use monospace. Avoid tiny condensed body text and ornate serif. Slanted bars are good for emphasis, not for long paragraphs. Use high contrast, not transparent glow.

## Portrait and evidence

Use one rectangular graphic student portrait at a modest size, with halftone or diagonal backdrop as a supporting fragment. The included `student-portrait.png` is an original generated fictional student; it is not a game character. Do not create a circular avatar. Evidence is a selectable shell / capsule with a readable name and a source line; it represents proof, not ammunition for a shooter HUD. Its selected state is explicit. Make the active argument another independent target, then require a match / fire action.

## Trial rhythm and feedback

The debate surface can use a short statement stream, timed progression, and a small lateral timeline or roundtable selector. A correct match identifies the contradiction; a wrong match shows a recoverable “not this statement” state and consumes only the synthetic attempt / time budget defined for the demo. Never hide the claim or evidence behind motion. A user must be able to inspect selected evidence before firing. Keyboard selection and confirmation mirror pointer actions. Pause or reduce timed behavior for accessibility if the requested product needs it.

## Screen anatomy

- Handbook: ring / wedge navigation distinguishes profile, map, and case tabs; the selected page is one readable sheet, not an icon-only wheel.
- Evidence locker: compact evidence list with one selected evidence detail, source / date, and a small portrait / witness connection. Keep proof statements traceable.
- Debate: current statement at center, claim sequence or timeline at one edge, selected evidence tokens at another; no dominant portrait or full-screen decoration.

Reserve the brightest pink for current state and the yellow accent for a concrete evidence match. At smaller sizes, use a horizontal ring index or numbered tabs rather than shrinking labels along a radial wheel. Stack the debate targets in a deliberate order and keep hit areas at least 44px. Respect reduced motion and do not auto-fire when a timer reaches zero.

## Asset boundary

The included student cutout was generated with the built-in image tool; see [generation.json](generation.json) for its prompt. The only figure is an original fictional character. No official art, UI screenshots, logos, named characters, game text, or font files are included. Do not imitate the game's mascot; create new supporting art only when needed.
