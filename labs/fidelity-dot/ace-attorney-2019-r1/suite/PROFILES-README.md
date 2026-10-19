# AA2019-profiles-v0.4
Second editable example in the AA2019 v0.4 research candidate.
Pending receiver visual/runtime review. No producer execution or ZIP is claimed.

## Reference actually viewed
https://www.mobygames.com/game/69940/phoenix-wright-ace-attorney-trilogy/screenshots/switch/995392/
https://cdn.mobygames.com/screenshots/9163091-phoenix-wright-ace-attorney-trilogy-nintendo-switch-gyakuten-sai.jpg

Receiver supplied the image after ordinary web retrieval returned no pixels.
dot actually viewed the supplied image on2026-10-19.
Original file reported by receiver:
1200x675,112991bytes,
SHA256e86caa6c4c0d557fd35843a8ca7d83729c728aceee51828c73b7f516be89cea7.
The chat-materialized copy was185612bytes; do not claim it has the same hash.
Screenshot platform attribution: Nintendo Switch, from source path/filename.
Specific build and capture date unknown. Parent entry2013 is not the Switch year.
Reference is private/reference-only and is not included in candidate assets.

Observed state:
Profiles; Dee Vasquez (Age:34), final slot selected.
Ten occupied portrait slots. Gray large portrait panel; yellow name band.
Text:
High-ranking producer
at Global Studios. Present
on the day of the crime.
Lower right controls: B Back and R Evidence.
Room behind: wood-paneled walls, blue-gray curtain, folding chairs, table/bin.
The first nine names, ages and biographies are not visible in this screenshot.

## New files
profiles.html
profiles.css
profiles-data.js
profiles.js
PROFILES-README.md
assets/profiles/panel.svg
assets/profiles/dee.png
assets/profiles/p01.png through p09.png
assets/profiles/room.png

Depend on unchanged evidence.css and assets/corners.svg.
No dependency on evidence.js, evidence-data.js or evidence-contract.js.
No original screenshot, atlas extraction or full-screen hotspot layer.

## Installation
Save complete source texts under their exact relative filenames.
Save ordinary binary attachments unchanged:
AA2019_profiles_dee.png -> assets/profiles/dee.png
AA2019_profiles_p01.png -> assets/profiles/p01.png
...through p09...
AA2019_profiles_room.png -> assets/profiles/room.png

Open profiles.html directly or through the receiver's static service.
All dependencies are local. No install, API, execution task or network font.
A missing PNG is a real missing dependency, not a placeholder acceptance.

## Behavior
Default selectedId is dee; it occupies index9.
Click/Left/Right/Home/End select; Enter/Space opens full text.
The same portrait file serves the large preview and selected slot.
White pointer x=190+90*selectedIndex+35, y338; hidden when empty.
The pointer is independent of the panel and cannot remain at the first slot.

Back button or B while focus is in the stage closes the record locally.
The background remains and Open Profiles record receives focus.
Reopen restores the selected profile and focuses it if supported.
This is a prototype return state, not a game conversation implementation.

Evidence button or R while stage-focused follows relative index.html.
This loads the Evidence page's initial data; in-memory edits are not transferred.
Export before navigating away. No gamepad support is claimed.

Portrait/mouse/keyboard editing controls remain separate from artwork.
Export retains full name, age, biography and selectedId.
All editing controls are outside the game image.

## Profiles JSON contract
Top-level exact fields:
schemaVersion:1
version:"AA2019-profiles-v0.4"
selectedId:null or valid ID
items:array0–10

Item exact fields:
id:unique, /^[A-Za-z0-9][A-Za-z0-9_-]{0,39}$/
name:string<=300 UTF-16 code units
age:null or integer0–150
portrait: p01,p02,p03,p04,p05,p06,p07,p08,p09,dee
description:string<=20000 UTF-16 code units

Unknown/missing fields, duplicate IDs, paths/URLs, invalid limits or11 items
reject the complete import and preserve current state.
Text JSON maximum1,000,000 code units; file maximum2,000,000bytes.
Selected ID absent from valid items normalizes to first; empty -> null.
Deleting selected chooses its next occupant or previous last neighbor.
Deleting final item focuses Add, unless record closed, where Reopen is used.

Empty:
{"schemaVersion":1,"version":"AA2019-profiles-v0.4","selectedId":null,"items":[]}

One editable profile:
{"schemaVersion":1,"version":"AA2019-profiles-v0.4","selectedId":"person-1","items":[{"id":"person-1","name":"Demonstration person","age":null,"portrait":"p02","description":"New editable demonstration text."}]}

## Provenance and approximations
All eleven new PNGs were generated separately with ordinary built-in image
generation. Exact model/version was not exposed.
dot viewed their output pixels; this is not browser-composite testing.
Each portrait is an independent PNG, not a cropped group image.
Generated room is separate from all UI and portraits.

Ten portraits roughly follow observed hair/clothing/silhouette vocabulary.
Faces, detail, proportions, line weights and expressions are approximate.
The first nine are labelled Profile01..09 because canonical metadata was
not verified from this screenshot. Dee name/age/three-line description are observed.
No claim is made that generated portraits are official or commercially cleared.

New HTML/CSS/JS/panel source and this document: dot-authored ordinary chat.
Existing Evidence assets and CSS retain their existing provenance.
No additional third-party runtime library or font binary.

## Geometry
Uses1280x720 logical stage, so the1200x675 reference is scaled by16/15.
Main panel same x152y60,w974h412 material vocabulary.
Gray preview x182y109,w209h208; portrait209x208,contain.
Thumbnail86x86 at local2,2 within90px slot.
Bottom controls x844y445,w270h24;22px/24px serif.
New panel has no baked-in selection pointer and has an independent pale
control-strip shape. Controls are real DOM, not panel text.
Name/description/diagnostic bounds inherit evidence.css.
Portrait and undersized stage policy is inherited.

## Receiver checks still required
- Actual eleven-PNG receipt and alpha edges at small/large sizes.
- Default final-slot portrait/name/age/three-line description and pointer.
- Select each of ten slots; pointer and same-source preview follow.
- Bottom controls fit the pale strip and focused outlines stay legible.
- Back/reopen, Evidence navigation and dialog-return focus.
-0/1/6/10 entries,11 rejection, selected removal, bad JSON/path/duplicate ID.
-300 name plus age suffix;20000 biography; full-text/export fidelity.
-960x540 stage and ordinary landscape; portrait restriction.
No items in this list are producer-executed test results.