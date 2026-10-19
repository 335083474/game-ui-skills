# Save Selection — shared-title-r2

Research draft; reviewerAccepted=false; customerReady=false.
Data schema stays SaveSelection-v0.1; save-select.js remains the exact repair-r1 implementation. Existing page draft labels may therefore still show v0.1/repair r1; package revision is identified by this README and suite manifest, not altered JS constants.

## Apply / start
Use a NEW copy of receiver r1 ZIP:
d75214e574036ce0e1661a96e4d5150b758fdb9eed4102f57fcf5ff278df941e
Apply the9 replacement files listed in suite README.md. Keep all older ZIPs.
For this page only save-select.css changes: its title override is removed so style.css is the sole shared title rule. HTML/data/JS remain unchanged.
Open save-select.html; dependencies style.css and assets/frame.svg,background.svg,selection.svg,socket.svg remain local. No build/network/new dependencies.

## Current title
x856,y64,w208,h52,font36/52,weight400,centered,nowrap,ellipsis. Full value stays in state, editor, dialog and export.
Former800/77/320/52 rule caused frame intersections and is withdrawn. New geometry is path-reviewed only; actual three-screen text/frame separation is unverified.
No opaque cover, z-index change, frame edit, input-limit change or string deletion.

## Unchanged r1 information/action bounds
Logical1920×1080. Detail parent1296,322,w416,h535.
Relative blocks: name top12,h94; info top118,h100 (location60,metrics38); description top232,h142; full-text top386,h42; actions top446,h70.
All regions remain bounded and independently scrollable as appropriate; text cannot grow their geometry. Button bottom838; parent bottom857. Full-text/action gap18.
Name36/1.3; location27/30; metrics27/38; description26/1.35. Full-text24; action28.

## Text / editing
Exactly3 unique slots. Title/name/location≤300 JavaScript string-length units, description≤20000; minutes0–999999,completion0–112. Empty slots blank/zero.
Read full text is always available and includes title,name,location,formatted time,raw minutes,completion,description. Overflow diagnostics and more label recompute after edit/import/selection/resize/font loading.
Complete strings are never replaced with rendered ellipsis. Export complete JSON; invalid import retains state; refresh resets fixture. No actual game files, autosave or engine.

## Controls / focus
Mouse selects; arrows cycle; Home/End first/last. Continue/New Game disclose prototype scope.
Delete requires confirmation. Cancel/Escape preserve data; confirmation clears one in-memory slot, preserves its ID and selects it.
After DOM update and modal close, focus restoration prefers current slot after deletion. Ordinary close/cancel prefers valid original trigger. Disconnected/disabled/hidden/inert controls are skipped and actual activeElement checked. Unsupported stage falls back to external editTitle input.

## Evidence / regression
Receiver closed r1 text/action overlap and deletion-focus defects after actual browser tests, including original long-edit-export.json and field maxima. This is receiver evidence, not producer execution.
Receiver found r1 long-title ornament intersection and replicated it on Charms/Inventory; that item remains pending for r2.
Recheck default titles, same failing title,300-character strings, unbroken text, all maximum fields, full-text/export, short restoration, deletion/cancel/Escape/focus, supported and unsupported viewports.
Producer has not run r2. Keep original failed independent output and raw fixtures. Repairing this demonstration does not constitute a new independent-context pass.

## Source / rights
Save Selection is a newly extrapolated interface, not a claimed original Hollow Knight save menu. The independent context originally used only the frozen suite and new requirement; Dot then repaired reported defects.
Fixture data is fictional. Shared asset/source limits remain in SOURCES.md. No official font, game-save compatibility, commercial license or publication is asserted.