# Pause & Options v0.1 — Dot status repair r1

Research extension; reviewerAccepted=false; customerReady=false; not published.
This revision addresses P2-PAUSE-01 only. Producer runtime/visual verification of this repair: not performed.

## Authorship and frozen lineage

The original four new files pause-options.html, pause-options.css,
pause-options.js and README-NEW.md were authored by an independent temporary
ordinary-web conversation. That context received only this frozen suite ZIP
and a new interface requirement:
a224133e2778ef8fa2a47e60817c3d3c7f886c1e6f155955d03d5d82869d1ae6

The receiver reports the independent10-file output ZIP SHA256:
e4552e05be58fb86a5a84b029df5b571621b84a5d35ab69992ad25edff014614

shared-style.css and four SVG dependencies were copied from the frozen input;
the receiver verified their bytes match. They were not newly authored by the
independent context. Their prior provenance remains described by input SOURCES.md.
The independent context's precise model/version is not established here.

Dot subsequently read the four source texts and the supplied failing JSON,
viewed the receiver screenshot, and supplied this narrowly scoped repair.
Dot is the repair author, not the sole author of the independent extension.
The receiver performs verbatim assembly, freezing, browser tests and any later
publication. Do not attribute receiver operations to dot.

## Apply in a NEW extension copy

Replace exactly these3 files:
- pause-options.html
- pause-options.css
- README-NEW.md

Keep pause-options.js, shared-style.css and all four SVG assets byte-identical.
Keep any other delivered package file unchanged; no added dependency is needed.
Do not alter the original32-file input, original independent output ZIP or its
failed-state evidence. Retain original long-edit-export.json as a regression
fixture. The corrected ZIP must receive its own actual receiver-computed hash.
Old hashes must not be assigned to modified bytes.

If the extension contains an integrity manifest, it describes the old bytes
until the receiver issues an explicitly versioned refreshed manifest. No new
hash or successful manifest validation is asserted by this text.

## Entry and dependencies

Open pause-options.html. It links shared-style.css, pause-options.css and
pause-options.js, all in its directory. Required relative artwork:
assets/frame.svg, assets/background.svg, assets/selection.svg, assets/socket.svg.
No build, library installation, hosted API, network font or new asset is needed.
Font stack uses installed Times New Roman / Georgia / serif; not official game
fonts, with platform-dependent metrics.
The original source package's documentation and rights limits remain applicable.

## What changed

The former status region was inside the logical stage at x400,y945,w1120,
maximum height56. Receiver screenshots show it crossed the central bottom
frame scrollwork. The earlier statement that it avoided frame edges is withdrawn.

The same #stageStatus element now follows </main> and precedes the external
Review/edit details. It is outside both #stage and #viewport, in normal document
flow. Its original role/status announcement is retained, with explicit polite
and atomic live-region attributes. No status text or original data was removed.

CSS uses position:static, auto width/height, no maximum height, no clipping,
16px/1.6 unscaled serif text,12px vertical and16px horizontal margins,8px vertical
padding, pre-wrap and overflow-wrap:anywhere. Nonempty text may increase document
height. Only an empty status element is display:none.
A visible2px focus outline with4px offset is added.

The original JS still fills the element, sets tabIndex=0 for text overflow,
handles click/Enter/Space to open complete text, clears the status for short
restoration, and restores modal focus through its existing logic.
The diagnostic ID is retained for compatibility; its name no longer implies
that it is geometrically inside the game stage.

No shared title, frame path, game operation geometry, validation limits, state
transition, slider handler, dialog handler or JSON behavior was rewritten.
The draft caption identifies the repair while keeping the independent origin.

## Geometry and access contract

The game viewport retains its existing fixed-height formula and scaled1920×1080
composition. This repair does not subtract diagnostic height from game space.
The diagnostic sits after the viewport in page flow and therefore cannot cover
its frame or controls. If the browser needs more vertical room, scroll the page
normally; do not overlay the diagnostic onto the stage to avoid that scroll.

On a supported960×540 actual stage and common landscape windows, diagnostic text
remains16px unscaled. Users can Tab to it when overflow exists, inspect all its
wrapped text and press Enter/Space to open the complete data dialog.
Moving it out of #stage also keeps stage arrow-navigation handling from capturing
its navigation events. Original full-text body scroll behavior is unchanged.

The diagnostic is an authoring/review UI outside the game composition, like the
existing editor. This is a deliberate scope choice, not an additional game HUD.
Future in-game diagnostic placement would require a separately verified clear
region; no replacement in-game safe coordinates are claimed here.

## Existing operations and data

Mouse and keyboard operate five pause controls. Volume values0–100 model state
only; no sound engine. Up/down navigate controls; left/right adjust native ranges.
Help opens key text; Escape closes dialogs or toggles paused/playing demo state.
Title transition requires confirmation; cancel preserves data/mode. Back returns
to pause. These are demonstrations, not original engine integration.

Editor accepts title≤300, intro≤20000, five labels≤300 each, up to20 key lines
of≤300 each, using the original JavaScript string-length checks.
Export preserves state including text, volume and mode; validated import commits
only after success. Invalid input preserves old state; reload resets defaults.
No automatic persistence, real save files, key rebinding or real title integration.

## Evidence attribution

Receiver actually ran the independent original output and reported limited passes:
- recognizable same-suite default appearance
- master volume75 to76 and directional focus
- help Escape focus restoration
- title cancellation and confirmed transition/focus
- playing transition and Escape return
- long field editing and full JSON export
- invalid volume101/title301 rejection preserving state

Receiver also reported actual status/frame overlap with the supplied failing
JSON and settled screenshot. Those passes did not make the extension accepted.

The original independent README reported syntax/integrity checks and blocked
browser attempts. Those were statements by that context, not operations by dot;
they are not adopted as proof that this repair ran or passed.
Dot used ordinary text reading, image viewing and source authoring for this
repair, without executing the revised page or claiming a new ZIP/hash.

## Required receiver regression

1. Default data: empty diagnostic does not leave a phantom strip or cover art.
2. Original failure JSON: title300, intro20000, five labels300 and20 key rows;
   diagnostic is wholly below viewport, complete and legible, with no overlay.
3. Tab reaches nonempty diagnostic, visible focus, Enter/Space opens full text;
   Escape/Close restoration remains usable. Check last character of long fields
   and actual export, not just displayed prefixes.
4. Restore short data: stale diagnostic clears and leaves no empty space.
5. Actual stage960×540 and common landscape, including1265×750 window; page
   scrolling must not turn the diagnostic into a positioned overlay.
6. Existing volume/help/cancel/confirm/playing/back and invalid-import passes
   regress without shared-title or frame changes.

These are tests to run, not claimed results. Exact-version receiver review and
any further package-only independent reuse remain outstanding.

## Source and release boundary

Pause & Options is an extrapolated new interface, not an asserted reproduction
of an original Hollow Knight pause screenshot. Reference-based shared artwork
retains unresolved rights and original model unknowns; no new art is introduced.
No official affiliation, font match, commercial license, public redistribution
clearance or customer-ready status is established by this repair.