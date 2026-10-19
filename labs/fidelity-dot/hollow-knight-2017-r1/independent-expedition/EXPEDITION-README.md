# Expedition Result — independent reference extension

Revision: action-clearance-r1
Status: repair candidate; reviewerAccepted=false; customerReady=false
Not published. Runtime verification of this repair remains pending.

## Origin and exact inputs

The original five extension source/document files were authored by independent
ordinary-web context 16 using only the receiver's frozen four-page package and
a new expedition-results request. The exact model/version was not exposed.

Frozen four-page input ZIP SHA256:
e858586d62aba8795990537b7e5c61519d3a7193635f4538647e2ed72a3874a8

Independent original 16-file extension ZIP SHA256:
21506508d25388d45f30bae55dbd3b603a06a7b51959892b62178546211b4906

The original 37-file input remains unchanged. The receiver reports the copied
style.css and ten SVGs match that input byte-for-byte. No original game
screenshot is an extension asset.

Dot subsequently authored this targeted action-clearance-r1 repair in ordinary
chat. Only expedition.css and this README are replaced in a new extension copy.
The CSS has three substantive changes:
- #statistics top: 423px -> 403px
- #rewardArea top: 580px -> 560px
- #actions top: 882px -> 850px

All other CSS declarations are retained. Keep expedition.html,
expedition-data.js, expedition.js, style.css and every SVG unchanged.
Do not overwrite the original independent ZIP or the frozen 37-file input.
The receiver creates the revised manifest/ZIP; no new hash is asserted here.
Any old manifest describes its historical file set, not this repair.

## Purpose

This is a fictional settlement/results UI with success/failure text, three
statistics, 1–6 rewards, selection, actions, a review editor and JSON import/
export. It does not connect to a game engine, change actual saves or establish
official Hollow Knight menu fidelity. Reward names and prose are demonstration
content, not a factual official-item guide.

## Launch and dependencies

Open expedition.html with its relative files intact. If the host blocks file://,
use a receiver-provided ordinary static HTTP preview. No build, npm, network
font, API or external service is required. Installed system serif fonts can
render differently across machines.

Local dependencies:
- style.css: unchanged copied base stylesheet
- assets/background.svg
- assets/frame.svg
- assets/selection.svg
- assets/socket.svg
- assets/inventory/crest.svg
- assets/inventory/geo.svg
- assets/inventory/scroll.svg
- assets/inventory/spirit.svg
- assets/inventory/focus.svg
- assets/inventory/old-nail.svg
- expedition-data.js and expedition.js
- expedition.css

Only the six listed Inventory SVG paths are permitted reward icon values.
No new picture was generated, extracted or downloaded for this repair.
Shared artwork and system-font source/rights limitations inherit the frozen
SOURCES.md. No commercial or public redistribution clearance is established.

## Interaction and state

Click a reward to select it. With reward focus, arrows navigate (up/down moves
three), Home/End selects the first/last item, Enter/Space opens its full text.
The selected small icon and large preview use the same asset path.

Continue opens an informational demonstration dialog. Retry opens confirmation:
Cancel retains state; Confirm sets outcome to failure and selected to zero while
retaining statistics and reward data. Dialog close/Escape restores focus using
the existing enabled/visible target fallback. This repair does not change that
JavaScript or its state model.

The external editor changes title, both result headings/notes, outcome, three
statistic labels/values, reward count and the selected reward's text/icon.
Switching the edited reward temporarily retains its fields in page state;
Apply validates and renders. Export saves current state as JSON. Import
validates before replacing state. Reload restores initial data. No automatic
persistence is claimed.

## Schema and bounds — unchanged

schema: hk-expedition-result-v1
- title: string, maximum 300 characters
- outcome: success or failure
- results.success and results.failure: each heading <=300, note <=20000
- stats: exactly three objects, each label/value string <=300
- rewards: 1–6 objects
- reward id: nonempty unique string <=80
- reward name <=300; description <=20000
- icon: exactly one of the six permitted relative paths
- selected: integer within the rewards array
- imported file: at most 2000000 bytes

Invalid imports retain prior valid state. Full strings stay in state/export.
Bounded display areas scroll or ellipsis; overflow diagnostics and the separate
readAll button below the stage expose complete text. Title-only overflow is
included. Restoring short content clears the diagnostic and hides readAll.
No validation limit or full-text behavior changes in this repair.

## P2-EXP-01 and proposed spatial correction

The receiver reproduced a real collision after Continue dialog close/Escape:
its restored keyboard focus displayed the selection graphic and outline over
the lower frame ornament. Both short one-reward and long six-reward states
failed. A default unfocused screenshot was insufficient evidence.

The repaired arrangement moves the statistics and rewards upward together,
then raises actions more, without reducing text, preview, reward or focus sizes.
Logical coordinates remain relative to the 1920×1080 stage:

- Result header: unchanged, top 168; ordinary declared note box ends near 374.
- Statistics: top 403, declared height 135, bottom 538.
- Rewards: top 560; heading height 43, list local top 65.
- Detail: local top 66, hence stage top 626.
- Detail grid rows include a 62px name row and 140px description; budget to 828
  for this content, not merely the nominal 200px parent bottom at 826.
- Actions: top 850, declared navigation height 76.
- Buttons: unchanged height 66, bottom 916.
- Action selection graphic: unchanged 64×64, local top 1, vertical 851–915.
- Dotted action focus outline: unchanged 2px with 1px offset. Its expected outer
  vertical footprint is approximately 847–919; conservatively allow 846–920
  when checking browser rendering.

Thus the declared detail content to conservative focus footprint has 18 logical
pixels of separation, or 9 displayed pixels at scale 0.5. The whole action
focus footprint is raised by 32 logical pixels versus the failed version.
Statistics-to-reward-heading spacing is 22 logical pixels.

These are source-derived layout budgets, not browser measurements or a signed
safe-area claim. Actual glyphs, outline rendering and the frame's painted paths
must still be checked. The frame has irregular contours; its viewBox or a
single guessed horizontal boundary cannot prove clearance.

Selection graphics, focus outlines, hover states and frame art are not hidden,
reduced, covered or removed. Text sizes/heights and the full six-reward layout
remain intact. The diagnostic remains outside the stage.

## Mandatory state-aware clearance rule

Reserve space for the complete painted interaction footprint, including hover,
focus-visible outlines, outline offset and selection-image canvas. The text box
alone is not the action boundary. Check restored focus after modal close and
confirmation, not only the initial unselected page.

A successful clearance check must simultaneously show separation from both the
lower decoration and the adjacent detail content. Do not obtain lower-frame
clearance by pushing actions into descriptions. Do not suppress indicators,
remove rewards or shorten accepted content to satisfy the check.

## Receiver evidence before this repair

The receiver reports successful limited checks of the independent original:
- recognizable shared visual language and distinct new layout
- four reward selections and same-source large preview
- arrows/Home/Enter/full text/Escape focus restoration
- Retry cancel retention, confirm failure/first reward and retryButton focus
- Continue dialog/Escape return to continueButton
- six rewards, changed focus.svg, maximum title/result/text/statistic fields,
  real full-data export and 43209-character complete-text view
- rejection of seven rewards, traversal icon path and duplicate IDs, retaining
  prior valid six-item/long-text data
- valid one-item short import clearing diagnostics and hiding readAll
- actual 960×540 stage, 1280×800 and portrait-disabled behavior

The same receiver also found P2-EXP-01. Those successes do not cancel the
collision or establish whole-package acceptance. Dot did not run those tests.

## Required receiver regression for this repair

Test both supplied JSON fixtures, plus both success and failure states, with one
and six rewards. Retain the maximum accepted fields and full export.
At actual 960×540 and common supported landscape sizes:
1. Inspect Continue and Retry while hovered and keyboard focused.
2. Open Continue, close with button and Escape, then inspect restored focus.
3. Open Retry, cancel and confirm separately; inspect focus after each path.
4. Confirm selection images and complete focus outlines have visible clearance
   from the painted frame and reward details, including after settled rendering.
5. Check all six reward slots, long description scroll/full-text routes and
   diagnostics; compare exported full values.
6. Recheck short restoration, invalid-import retention and unsupported portrait.

Only source/text inspection and the supplied actual screenshot were used by dot
for this repair. No runtime test, new ZIP or self-signed pass is claimed.
Original independent failure records remain preserved. Later repair/regression
must not be recorded as the original independent output having passed unchanged.
Final suite acceptance, further independent reuse and publication remain with
the receiver under the user's instructions.