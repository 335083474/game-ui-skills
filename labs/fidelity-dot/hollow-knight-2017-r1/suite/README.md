# Hollow Knight reference UI suite

Documentation revision: HK-suite-four-pages-doc-r1
Status: research candidate; reviewerAccepted=false; customerReady=false
Release: not published; commercial and public redistribution rights unresolved

## What this contains

Four editable, browser-based reference interfaces inspired by Hollow Knight
(2017):

1. index.html — Charms selection
2. inventory.html — Inventory equipment and abilities
3. save-select.html — save selection demonstration
4. pause-options.html — pause and options demonstration

Charms and Inventory were compared with specific original screenshots.
Save and Pause are independently authored extensions of the reference language;
they are not documented as replicas of verified original game screens.
This is a static UI research suite, not a game engine or a working Hollow Knight
save editor. Do not use it to read or change actual game saves.

## Exact assembly inputs

Base: HK-suite-shared-title-r2-sourcefix, receiver-frozen ZIP SHA256:
a224133e2778ef8fa2a47e60817c3d3c7f886c1e6f155955d03d5d82869d1ae6
This contains 31 production files plus the receiver's historical manifest.

Pause extension after status repair r1, receiver-frozen ZIP SHA256:
d29d61eb6cbe5e4f8b1d0374b36a847646b944379ab629aeebb53b91646f0551
This is the receiver's 11-file repair package, including its new manifest.

These hashes identify assembly inputs, not the new combined output. Replacing
these five documents changes the final package bytes. No final output SHA256
or final file count is asserted in this document.

## Assembly and preservation

The receiver assembles a new directory; old ZIPs and frozen directories remain
unchanged. Use the base runtime and assets unchanged, and the repaired Pause
extension unchanged. Replace only these documentation files:

- README.md
- CANDIDATE-SKILL.md
- COMPONENTS.md
- SOURCES.md
- CROSS-SCREEN-SAFETY-ADDENDUM-r1.md

Keep pause-options.html, pause-options.css, pause-options.js, README-NEW.md and
shared-style.css. shared-style.css is the exact base style.css copy used by the
Pause extension. Keep both filenames because the entry pages refer to them.
Do not silently merge, rename or delete either stylesheet.

The four same-name shared SVG assets are reused at their existing relative
paths. Verify their bytes match before reusing them; do not duplicate or replace
them with new drawings. Preserve every remaining runtime dependency at its
original relative path.

Old manifests describe their historical packages only. They must not be
presented as verification of this merged directory. The receiver should preserve
those historical manifests with their source ZIPs or in clearly labelled
historical evidence outside the active runtime manifest. Generate a fresh
current manifest from the actual final files and identify its own inclusion or
exclusion rule. Do not copy historical counts or hashes into a current checksum
claim. Do not include private screenshots or test logs in public assets.

## Opening the suite

1. Extract the final assembled ZIP to a clean directory, preserving paths.
2. Open index.html in a desktop browser, then open each of the other three entry
   pages from the same directory. Inventory also has a Charms navigation link.
3. If local file navigation is blocked by the host/browser, use an ordinary
   static HTTP preview supplied by the receiver. No build step is required.
4. Keep scripts, styles and assets local. No npm installation, API key, network
   font or private service is needed for the UI.
5. If assets fail to load, resolve the reported relative path against the
   extracted directory. Do not substitute original game images.

Direct file access and HTTP access are separate test conditions. A host's
file:// policy denial is not a successful file:// test. No new hosting or
execution permission is granted by these instructions.

## Editing and saving data

Use each page's review/edit controls for the fields it exposes. Apply updates
through those controls; use Import JSON for complete supported page data and
Export JSON to save a copy. Start with that page's exported JSON as the schema
example. Do not interchange JSON between the four entry pages.

Expected output is the updated live UI and an exported JSON preserving accepted
full strings and values. The editor is not a file writer for source assets.
Keep downloaded JSON explicitly; no durable game-save or cloud-sync guarantee
is made. Reload/reset behavior is page-specific.

Editable data includes titles, item text, supported icon paths, counts and
selection on the relevant item pages. Pause exposes its own title, introduction,
five action labels, key-help entries and volume settings; it does not expose an
item collection editor.

## Data boundaries

- Charms: supported collection size 1–40. Use its exported schema and existing
  validator for item fields and Cost. A different page's limits are not a
  substitute for that validator.
- Inventory: supported collection size 1–20; Geo 0–999999; item quantity null
  or integer 0–9999. Placement is an irregular composition, not a Charms grid.
- Save selection: three demonstration slots. Title, name and location up to
  300 characters; description up to 20000; minutes up to 999999; completion up
  to 112. These are prototype bounds, not verified official game rules.
- Pause: title up to 300; introduction up to 20000; each of five labels up to
  300; at most 20 key-help strings, each up to 300; master/effects volume integer
  0–100. Modes are paused, playing and title in this UI demonstration.

Use the unmodified validators for all additional schema/type/path checks.
Import must be rejected without replacing valid state when validation fails.
Collection bounds and permitted fields differ by page. The demonstrations are
not a general-purpose JSON or arbitrary filesystem loader.

## Display and interaction

The composition uses logical 1920×1080 coordinates, uniformly scaled. The target
is desktop/landscape with at least a 960×540 actual stage. Portrait or an
insufficient stage displays a limitation notice and disables the stage; this is
not a mobile-layout claim.

Long titles and text retain their complete data. Bounded visual regions may
truncate or scroll; use the page's complete-text entry to read the full value.
Export must preserve accepted strings. Do not remove diagnostics to conceal a
layout defect.

Pause's diagnostic is intentionally outside the scaled stage in document flow,
12 CSS px below the viewport. It is a review diagnostic, not a new game HUD.
A nonempty long-text diagnostic remains readable, keyboard-focusable and opens
full text with Enter or Space. Escape restores focus to it. An empty diagnostic
is hidden without leaving a blank block. Page scrolling may be needed to reach
it; the game composition must not be compressed to hide that fact.

## Evidence and remaining checks

The receiver reports limited successful visual and interaction checks for
Charms/Inventory, shared-title-r2, Save r1 repairs and Pause status-r1. These are
receiver tests, not tests executed by dot. See the safety addendum for the exact
scope and retained failures.

The original independent Save and Pause outputs had real failures. Repairs and
later receiver regression do not rewrite those attempts as original passes.

Still pending for this final merged version:
- freezing and verifying the current complete package/manifest
- a fresh independent context receiving only that final ZIP and a new demand
- receiver review of that new output
- final package/page/download consistency and any authorized publication

Do not infer whole-suite approval, user-personal visual approval, commercial
clearance or deployment from individual closed defects.

## Reading order

CANDIDATE-SKILL.md — reuse workflow and input/output contract
COMPONENTS.md — components, geometry and dependencies
CROSS-SCREEN-SAFETY-ADDENDUM-r1.md — mandatory text/focus safety rules
SOURCES.md — authorship, reference chain and rights boundaries
README-NEW.md — Pause-specific repaired extension instructions

SKILL.md and other earlier page documents are retained historical/page-level
material. For merged-suite status and cross-screen safety, use this revision and
its listed companion documents; do not revive superseded safe-area claims.