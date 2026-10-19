---
name: acnh-research-ui
description: Build editable local research UI in the visual language of the Animal Crossing New Horizons 2020 Switch Pockets and shop references. Use the bundled independent components and strict data contracts; not a licensed game asset kit.
---
# ACNH research UI skill

## Scope and limits
Read SUITE-README.md first. This candidate includes TWO runtime examples, not a whole game:
index.html Pockets and shop.html purchase quantity selection.
Do not claim official fidelity, original fonts, commercial clearance or complete acceptance.
Do not use the private reference screenshots as distributed backgrounds or crop their icons.
A third new-screen independent-use test is reserved for the receiver after final freeze.

## Inputs to obtain
For a new request ask for: screen purpose, reference/version if fidelity is required,
text, items/options, starting numeric state, intended interaction and target viewport.
Defaults may be explicitly declared for demonstration data.
If the reference's actual pixels are unavailable, do not claim inspection from a URL.
Read SOURCES.md for the reference pages and what was actually observed.

## Outputs
Return separate HTML/CSS/JS/data, independent assets, a readable source/dependency record,
the full edit contract and a change/ancestry list. Keep established runtime files frozen.
A new screen must include real state transitions, full text, keyboard interaction and export.
A generated mockup is optional visual study; it cannot replace the editable runtime.
Runtime screenshots must be captured from that runtime and labelled separately from AI imagery.

## Read before implementing
1. TOKENS.md: color, type, logical coordinate and component role.
2. DATA-CONTRACT.md: strict JSON inputs, numeric limits and failure semantics.
3. SHOP-COMPONENTS.md and inherited COMPONENTS.md: layouts and image treatment.
4. SOURCES.md: generated/direct-source/inherited assets and unknown rights.
5. INHERITANCE.md: exact frozen base and added files.
6. Actual HTML/CSS/JS: executable source is the implementation, not a vague style description.

## Visual grammar
Use soft irregular cream/light-yellow forms with asymmetric rounded contours, warm
brown-gray rounded system substitute text, restrained turquoise highlights, yellow
selection backing, and a separate white pointing hand. Use the game scene behind.
Do not introduce a marketing title, modern dashboard grid, SaaS navigation or uniform
rectangular information cards around the game.
Keep review tools outside the stage and label them as tools.
Pockets: 40 possible arced slot locations, separate yellow backings and normalized item art.
Shop: dark translucent shelf upper-right, separate wallet, pale-yellow choice balloon,
lower cream speech form with orange name tab, turquoise product name/prices and bottom hints.
Do not merely change Pockets labels to call it a shop.

## Implementation steps
1. Copy approved bytes into a NEW candidate folder, preserving the input ZIP separately.
2. Select the closest component roles, not the entire page image.
3. Keep each illustration separate from text/state. The small and large views of an item
   reference the same asset and the same declared normalized crop, if one is required.
4. Define the data schema and supported quantities/options BEFORE laying out edge cases.
5. Reserve bounded regions for text, actions and their hover/focus effects.
6. Render strings with textContent/text nodes. Never inject imported HTML.
7. Validate all imported data before committing any state. Reject unknown fields,
   duplicate IDs, unsafe/raw icon paths and out-of-range values with an explicit message.
8. Route Enter/Space through native focused buttons. Avoid document-wide accept shortcuts.
9. Preserve complete data in an accessible dialog and export. Diagnose actual overflow,
   including vertical line boxes and translated/injected environmental content separately.
10. Scale the logical 1280 × 720 scene using available client space, excluding scrollbars.
    Gate the actual stage below 960 × 540 or portrait; use inert, not a visual warning alone.
11. Test all declared limits, focus return and data changes in supported real browsers.
12. Deliver evidence or mark each unperformed check UNVERIFIED. Never self-sign receiver acceptance.

## Component normalization
For Pockets scorpion only, use the measured visible subject and shared viewport specified
in TOKENS.md. Alpha>0 noise and whole canvas size are not meaningful visible body bounds.
Never compensate for padding by shrinking yellow backings or moving the forty slots.
Shop kit is a separate normal contain image. Do not apply scorpion framing globally.

## Example input and expected output
Input: "In the bundled Shop, demonstrate buying five customization kits at 600 Bells each
from 29,729 Bells; allow cancellation and show a receipt."
Expected: shop-data.js sets kit unitPrice600, balance29729, buy option quantity5.
Selecting the buy button produces balance26729, owned+5, phase purchased and receipt3000.
Selecting cancel produces cancelled with unchanged balance/owned and no receipt.
Both routes retain editable data, full text and native focus behavior.

Input: "Replace a Shop item picture with sapling and use a 300-character name."
Expected: icon token sapling, unchanged original text in data/export, bounded visible name,
readable complete text entry and overflow diagnostic. No arbitrary URL fetch.

## Successful patterns / failure patterns
Supported design pattern (receiver-tested in Pockets v0.3): shared crop for slot/detail,
full values retained, real client-space viewport gate, invalid import preserving state.
Shop patterns are supplied for receiver testing; they are NOT claimed tested successes.
Failure: art occupies only 35 × 44 of a 64 × 68 icon box because padding was ignored.
Correction: explicitly normalize meaningful visible bounds in both views.
Failure: use window.innerWidth while classic scrollbar consumes15px.
Correction: measure documentElement.clientWidth and visualViewport limits.
Failure: cancel focused but a global Enter handler submits.
Correction: native button activation; scope arrows only to the relevant list.
Failure: text or focus outline overlaps a decorative edge.
Correction: change the content/action area, preserve focus indication, and recheck actual pixels.
Failure: long value is silently deleted to fit.
Correction: preserve full value, bound presentation, diagnose, and expose full text/export.
Failure: all generated or inherited code attributed to a single author without evidence.
Correction: list actual authorship/inheritance and unknown model details.

## Acceptance handoff
Supply original input hash, exact changes, inherited files, new sources and known differences.
Receiver must independently run, compare, freeze and test reuse from only the final ZIP.
Do not pre-author the reserved third-screen solution or call producer changes an independent pass.
