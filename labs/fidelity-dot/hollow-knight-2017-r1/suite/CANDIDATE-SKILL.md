# Editable Hollow Knight reference UI candidate

Revision: HK-suite-four-pages-doc-r1
Acceptance: pending final-package review and fresh independent reuse

## Purpose and limits

Use this suite to construct editable static reference interfaces with a near-
black stage, open information layout, restrained serif typography, independent
white ornamental frame and separately selectable icon components.

Only Charms and Inventory have the specific screenshot references listed in
SOURCES.md. Save selection and Pause/Options extend the visual language. Do not
claim unverified screens, official fonts, exact pixel copying, engine integration
or commercial permission.

## Inputs

Required:
- the complete frozen package and its current manifest
- the requested screen's purpose and actual actions
- editable text, initial state and supported image paths
- intended landscape display size and expected longest valid content

Optional:
- a clearly sourced reference-only screenshot for a different composition
- new replacement icons with an explicit source/rights record

Do not use private screenshots as distributable output. Do not require a private
URL, the maker's computer or oral instructions absent from the package.

## Outputs

Produce complete relative-path HTML/CSS/JS and data for the requested screen,
independent reusable assets where necessary, updated documentation and a precise
changed/new-file list. Provide real state transitions, not a screenshot with
invisible hotspots. Preserve full accepted text in data and export.

A screenshot is a preview only. Code, dependencies, actual interaction and source
records remain required. Report untested behavior as unverified.

## Existing examples

- index.html: Charms, staggered collection and shared selected/detail icon
- inventory.html: irregular equipment/ability layout with quantity/Geo data
- save-select.html: slot selection, details and confirmation/focus behavior
- pause-options.html: bounded introduction, action list, volume sliders, help,
  confirmation and demonstration paused/playing/title transitions

Select an example because its information and state model fit the request. Do
not obtain Inventory by relabelling the Charms grid.

## Reuse procedure

1. Verify the supplied current package and read README, COMPONENTS, SOURCES and
   the cross-screen safety addendum. Historical hashes are provenance, not a
   checksum for newly modified output.
2. Open the relevant existing example. Identify its page-specific data schema
   using its export and validator before authoring new data.
3. Reuse the frozen frame and appropriate component paths. Keep imagery,
   geometry, text and state independent. Reuse one icon file for a selected
   item and its detail preview.
4. Reserve title, content and action regions before adding decorative details.
   Preserve the accepted title geometry when using the same frame. Do not infer
   safety from a coordinate alone; inspect visible frame intersections.
5. Render real text/data. Bound title/description regions, retain original full
   values and provide an explicit complete-text route when the display is
   abbreviated. Include title-only overflow in that route.
6. Define action/state behavior and validation before attaching events. Invalid
   edits/imports must retain the previous valid state. Destructive demonstration
   actions need a clear confirmation/cancel path.
7. Implement mouse and keyboard selection and dialog focus. After state changes,
   restore focus to a connected, enabled, visible target, with a stable selected
   item or enabled action fallback.
8. Place review diagnostics outside the stage if no proven unobstructed internal
   region exists. Keep all nonempty information and keyboard access intact.
9. Check default, short-restored, maximum accepted text, quantity limits, missing
   assets, invalid imports and supported landscape sizes. Record actual results
   separately from planned tests.
10. Deliver a fresh version with complete changed files and provenance. Preserve
    the input package. Independent reuse is a subsequent test by a new context,
    not a conclusion the maker can grant itself.

## Input/output examples

Example A — Inventory editing:
Input: existing Inventory export, title BOMB MARK 2, another supplied icon,
quantity 12, a long description.
Expected: the editor applies valid data; the selected preview uses the chosen
asset; full description remains accessible and export preserves it.
Receiver previously exercised this kind of editing on the Inventory candidate;
it does not establish arbitrary new asset compatibility.

Example B — maximum Pause text:
Input: title T repeated 300 times, introduction of 20000 characters, five labels
of 300 characters and 20 valid key-help entries.
Expected: no overlap with frame or actions; long-text diagnostic below viewport;
Tab then Enter/Space reaches full text; Escape returns focus; export retains all
accepted text. Receiver tested the repaired Pause page, not this newly merged
ZIP as a whole.

Example C — rejection:
Input: Pause volume 101 or title of 301 characters.
Expected: explicit validation failure; prior valid data remains unchanged.
No clamping or silent deletion may substitute for the declared behavior.

## Failure examples and correction

- Failure: long menu title crosses frame curls despite being inside a nominal
  320 px rectangle. Correction: use shared-title-r2's narrower, raised title box,
  bounded display and full-text route; visually check the actual frame.
- Failure: diagnostic at logical top 945 crosses bottom ornament.
  Correction: Pause status-r1 places it in normal document flow outside viewport.
  Do not just move it a few pixels and declare an untested safe zone.
- Failure: long location/description covers save actions.
  Correction: distinct bounded text and action regions with accessible full text.
- Failure: deleting a save disables the previous focus target and leaves BODY
  focused. Correction: validate the target after state update and choose the
  selected empty slot or another enabled fallback.
- Failure: all files attributed to dot. Correction: preserve independent-context
  authorship and distinguish subsequent dot repairs and receiver assembly/tests.

## Acceptance contract

Passing one representative screen or a technical test is insufficient. The final
version needs actual visual comparison, editable components and state, complete
instructions/dependencies, independent ZIP-only reuse, multi-screen checks,
source/rights boundaries and package/download consistency.

Current reviewerAccepted=false and customerReady=false. No new independent test
outcome, public deployment or commercial authorization is asserted here.