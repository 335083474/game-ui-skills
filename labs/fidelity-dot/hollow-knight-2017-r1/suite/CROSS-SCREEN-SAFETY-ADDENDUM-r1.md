# Cross-screen safety addendum

Current body revision: HK-suite-four-pages-doc-r1
The filename is retained for existing references; its suffix is not the current
body revision. This replaces earlier text in this document only.

## Applies to

Charms, Inventory, Save Selection and Pause/Options, and subsequent reference
interfaces built from the final package. Runtime changes are not included in
this documentation update.

## 1. Data preservation and bounded presentation

Every accepted string stays complete in state and export. A visible region may
ellipsis, scroll or paginate, provided complete text has a clear, operable route.
Title-only overflow must trigger that route; it must not depend on another field
also overflowing. Do not silently reduce declared input limits to avoid testing.

Reserve separate content and action areas. Names, locations, time/completion
metrics, descriptions, status and controls must not cover each other. Measure
both width and height; automatic wrapping can make scrollWidth alone misleading.
Restoring short content must clear obsolete warnings.

## 2. Ornament-aware title rule

The previous 800/77/320/52 title rectangle was not a valid visual safe region:
long titles crossed frozen frame-r3 in Charms, Inventory and Save Selection.
That earlier safety claim is withdrawn.

The implemented shared-title-r2 box is left 856/top 64/width 208/height 52,
font 36/line-height 52/weight 400, centered single-line ellipsis. Full values
remain accessible. The receiver checked default, the previous 228-character
failure and 300-character titles in the three base pages; the collision closed
for that tested configuration. Pause uses the corresponding shared styling.

A rectangle, z-index or absence of DOM overflow does not prove absence of
ornament collision. Keep visible local comparisons. Do not cover ornament with
black patches or simply raise text over it. Different fonts or frames need a
new visual check.

## 3. Diagnostics may live outside the stage

An authoring/review diagnostic need not be placed inside the game artwork.
When an internal safe region is not demonstrated, use normal document flow
outside the stage and viewport, adjacent to the review controls.

Mandatory behavior:
- nonempty diagnostic information stays complete and accessible
- a full-text trigger is reachable with Tab and usable with Enter and Space
- the full view preserves complete accepted values
- Escape/close returns focus to a valid trigger
- restored short/default content clears the obsolete diagnostic
- an empty diagnostic leaves no blank block
- the document may scroll; the game stage retains its supported geometry

This diagnostic is not a new game HUD. Do not use the rule to move essential
in-game actions out of the intended composition or to hide layout failures.

Pause status-r1 implements this using the existing #stageStatus paragraph after
</main>, before the review/edit tools, with 12px top margin, unrestricted normal-
flow height and unscaled 16px text. Its previous top 945/height 56 location crossed
the lower frame and is superseded.

## 4. Focus after dialogs and state changes

Remember the trigger. After the state update/render, confirm it is connected,
enabled, visible, non-inert and actually focusable. If not, focus the selected
remaining/empty slot or an enabled primary action. Check actual focus, not just
a call to focus(). Cancel must preserve data. Confirmation may change data but
must not strand focus on BODY or a disabled control.

## 5. Validation and supported display

Reject invalid JSON, schema, type, ranges and disallowed asset paths without
replacing previous valid data. Preserve page-specific bounds; do not assume all
four pages accept the same JSON.

Use a logical 1920×1080 landscape composition, minimum actual stage 960×540.
Unsupported portrait/small stages get an explicit notice and inert controls.
Do not claim mobile support based on fitting a tiny horizontal strip.

## 6. Receiver evidence, not producer execution

Save original independent output failed long text/action separation, title
safety and deletion focus. Receiver subsequently closed text/action and focus
issues for Dot r1. Shared-title-r2 closed the subsequently reproduced title/frame
collision across the three base pages. Original failed output remains evidence.

Pause original independent output failed P2-PAUSE-01: the long-text diagnostic
crossed the lower ornament. For repaired ZIP SHA256
 d29d61eb6cbe5e4f8b1d0374b36a847646b944379ab629aeebb53b91646f0551
receiver reports:
- original failure JSON: diagnostic fully below viewport, 12px separation
- default and short restoration: empty, display:none, no blank block
- Enter/Space full-text opening and Escape focus return to stageStatus
- actual 960×540 stage and common landscape separation
- 390×844 notice and inert stage
- regression of volume, help, confirmations/cancel, continue/return focus,
  invalid import retention and actual JSON export

These are limited receiver-tested outcomes. Dot did not execute those tests.
A repaired independent output is not retroactively an original independent pass.

## 7. Final-package gate remains open

The merged package still needs a current manifest/freeze, a new independent
context receiving only that final ZIP and a new request, actual receiver review,
and final delivery/page/download consistency checks. Passing this addendum or
its example repairs does not establish whole-suite acceptance, public release,
user-personal approval or commercial rights.