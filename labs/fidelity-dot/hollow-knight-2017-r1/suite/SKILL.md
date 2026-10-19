# Hollow Knight Charms — subsystem instructions in shared-title-r2

Suite entry: CANDIDATE-SKILL.md. This file documents Charms only.
Research candidate; reviewerAccepted=false, customerReady=false.
Use the complete package; old instructions to reconstruct v0.2 from five chat files are historical and no longer apply to this candidate.

## Reference / provenance
Hollow Knight (2017), Charms, Soul Catcher selected.
https://interfaceingame.com/screenshots/hollow-knight-charms/
User-provided1920×1080 original; platform/build/capture date unknown; reference-only, excluded from distributable assets.
HTML/CSS/JS and SVG components were newly authored in ordinary chat. Current frame is r3, not the rejected v0.2 frame. It is a visual approximation.
soul-catcher.png is the unchanged generated replacement delivered as HK_soul_catcher_replacement_v1_fresh.png,1,311,275bytes. Not official art; underlying generation model/version not exposed. Rights and commercial clearance unresolved.
System font stack Times New Roman, Georgia, serif; heading weight400. No font binary, official-font claim or cross-platform identical metrics guarantee.

## Start
Open index.html with relative assets intact in a browser supporting dialog, ResizeObserver and inert. No build/CDN/network font required. If file:// is blocked use an already authorized static host, not weaker security.
Fixed1920×1080 stage scales proportionally. Minimum actual game area960×540; recommended browser1280×720+; portrait unsupported. Unsupported stage dims/becomes inert; external edit tools remain available.

## State and editing
Default40 slots, selected index3, owned Soul Catcher,cost2.
Slot fields:id,owned,name,icon,cost,description.
Example:
{"id":"slot-4","owned":true,"name":"Soul Catcher","icon":"assets/soul-catcher.png","cost":2,"description":"First paragraph.\n\nSecond paragraph."}
Select then edit through Review/edit. Both small/large icon placements use the identical slot.icon source.
Export/import1–40 unique slots. Change count by editing JSON and valid selected index; no dedicated Add/Delete controls. Invalid input retains prior state. Image paths start assets/, use supported image extension and no parent traversal; missing files are diagnosed.
Refresh resets defaults; no autosave/cloud save. Equipped/Notches are fixed reference-state markers, not equip gameplay. Empty slots remain selectable.

## Layout
Current shared menu title comes only from style.css: x856,y64,w208,h52,font36/52,weight400. Single line with ellipsis; full original string retained.
Old x800,y77,w320 failed three-screen long-title ornament review. Do not reuse its old safety claim.
The r2 title box is a source-path-reviewed candidate; runtime appearance is unverified.
Grid centers x=215+93*column+(oddRow?55:0),y=588+90*row. Ten columns/four rows maximum; fewer slots leave space.
Socket32×32, selected image104×104, selection142×142, right image150×150. object-fit:contain; source padding changes visible silhouette ratio.
Detail1205,210,width560; item title560×54,font40/54; body top317,height265,font30/1.3,paragraph gap38; full-text top594.
Frame1920×1080 transparent and text-free, not nine-slice. Selection and blue halo separate. Background approximate cavern with92% black veil.

## Full text / interaction
Menu/item headings bounded; complete strings remain in state/editor/DOM/dialog/export.
Existing JS checks width and height overflow independently for menu title, item title and description. Menu-only overflow exposes full text and diagnosis. Rendering/resize/font readiness recompute; short restoration clears text diagnosis. Image diagnosis is separate.
Mouse selects; left/right cycle, up/down move10 with wrap, Home/End first/last, Enter/Space full text. Description scrolls. Escape/close restores selected-slot focus when stage supported.

## Extension and errors
Reuse independent components and actual text; never a full-screen PNG plus hotspots.
Correct: same icon source across placements. Failure: separately generated incompatible icons.
Correct: bounded title also clear of decoration. Failure: assuming a box is safe merely because its height is fixed.
Correct: missing-image warning. Failure: silent emoji fallback.
Correct: explicit portrait notice. Failure: calling a tiny landscape strip mobile-ready.
Follow cross-screen information/action and focus rules in CANDIDATE-SKILL.md and the safety addendum.

## Evidence boundary
Receiver accepted the v0.2+frame-r3 representative Charms effect and specified interaction tests, later withdrew long-title ornament clearance based on actual three-screen images. Normal short-title/default approval remains scoped to the prior version.
This r2 modifies shared title CSS only, not Charms HTML/JS/art. Producer has not executed r2. Default/long/max-title visuals, complete-text/export and regressions remain pending. No complete suite acceptance, commercial clearance or publication follows from this file.