---
name: aa2019-record-ui-reference
description: Create editable2019HD Ace Attorney-style record research interfaces from local separate artwork, bounded real text, validated collections and visible keyboard states. Evidence and Profiles are provided as candidates.
---

# Purpose
Research approximation of Phoenix Wright: Ace Attorney Trilogy2019HD.
Not GBA pixel UI, official artwork, a commercial license or a complete game engine.

## Inputs and outputs
Inputs:
- target record screen and verified same-version visual reference;
- valid versioned JSON for the chosen example;
- local approved icon/portrait keys;
- supported landscape viewport;
- documented intended differences from reference.

Evidence output:
index.html,0–10 evidence items, selected preview/text, full-text dialog,
editable/exportable JSON under AA2019-editable-v0.4.

Profiles output:
profiles.html,0–10 profiles, selected portrait/name/optional age/biography,
moving pointer, Back/reopen and Evidence navigation, full-text/exportable JSON
under AA2019-profiles-v0.4.

No third independent-test screen or answer is included.

## Read and run
Read README, COMPONENTS, SOURCES, then the selected schema document.
Evidence: DATA-CONTRACT.md.
Profiles: PROFILES-README.md.
Copy all relative dependencies; open the chosen HTML file.
No build, external API, network font or private machine path is needed.

## Evidence variant
Use Load current JSON; change values within the contract; Import, then Export.
Example:
{"schemaVersion":1,"version":"AA2019-editable-v0.4","selectedId":"note-1","items":[{"id":"note-1","name":"Witness Note","icon":"note","description":"New demonstration record, not canonical game text."}]}

Expected: one selectable note, nine inert positions, same-source large image,
real title/body and complete export. Do not fill empty slots with invented data.

## Profiles variant
Example:
{"schemaVersion":1,"version":"AA2019-profiles-v0.4","selectedId":"person-1","items":[{"id":"person-1","name":"Demonstration person","age":null,"portrait":"p02","description":"Editable demonstration biography."}]}

Expected: first occupied portrait selected, pointer over it, full biography,
optional age omitted when null. Change selected portrait key and both sizes update.
Names/biographies of the nine nonselected reference people are demonstration data;
do not invent canonical facts from their visible faces.

## New-screen method
1. Obtain and actually view a genuine2019HD reference for the new screen.
2. Record work/platform/build and unknowns accurately.
3. Identify layout, density, fields, controls and selected/focused states.
4. Reuse material/type rules where appropriate; do not simply rename a page.
5. Define input schema, maxima, empty state and selection/focus transitions.
6. Author new art independently; never extract original screenshots into assets.
7. Keep frame/illustration separate from text and real interaction.
8. Keep all dependencies local and document each actual source.
9. Inspect actual runtime at normal and boundary states.
10. Freeze exact bytes for receiver review and a genuinely new-context reuse test.

Reusing CSS does not automatically validate a new layout.

## Shared rules
- One approved image path per item, shared by thumbnail and preview.
- Real text uses textContent, not innerHTML.
- Ellipsis/scrolling never mutates stored or exported text.
- Full declared text remains keyboard-accessible in a full-text view.
- Diagnostics may sit outside stage; do not place them over decorative/action areas.
- Check width and height after fonts/images load.
- Successful image loading is not evidence of correct art or alpha quality.
- Selected corners and keyboard focus remain distinct and visible.
- Reject arbitrary paths/URLs, extra fields, duplicate IDs and unsupported counts.
- Validate whole candidate before replacing state.
-0 items means no modulo or selected-item dereference.
- After removing selection choose a valid neighbor; empty falls back to Add.
- Dialog close restores a connected visible enabled trigger or a safe fallback.
- Do not restore focus to a disabled control or BODY.
- Profiles pointer follows actual selected index and hides when empty.
- No persistent save or gamepad support is implied.

## Success patterns
A single note entry with nine empty positions.
Both portrait sizes change from one key.
A300-code-unit name remains complete in export and full-text view.
An11-entry import rejects atomically.
A deleted final entry leaves Add usable.
These are intended patterns, not unexecuted test claims.

## Failure examples and fixes
Atlas stripe:
Use standalone icons; do not restore failed SVG fragment views.

Flat art:
Correct panel layout is insufficient. Improve material/contour/shadow and review
the composed runtime, not a separate generated mockup.

Clipped title:
Respect bounded boxes/line-height and inspect real font metrics.
Never hide warning code to pass.

Lost long strings:
Do not slice source data. Bound display and preserve full-text/export access.

Stale pointer:
Compute from selected item position; never bake first-slot pointer into the panel.

Unsafe import:
Allowlisted keys only; exact schema; fresh validated state before commit.

Disabled-focus return:
After removal/navigation choose an enabled selected control or explicit fallback.

Undelivered artwork:
A loading attachment is unresolved. Require actual bytes/pixels before acceptance.

## Required review
Clean relative paths, all assets loaded, mouse/keyboard,0/1/6/10 collections,
11/duplicate/path/schema/length rejection, selected removal, empty state,
long text/full export, missing images and supported landscape sizes.
Inspect default, selected, hovered and focused real screenshots.
Final suite acceptance requires receiver sign-off and independent ZIP-only reuse.
The producer does not supply or pre-answer that third-screen test.