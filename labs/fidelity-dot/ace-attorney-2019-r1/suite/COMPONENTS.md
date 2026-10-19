# AA2019 v0.4 component specification
Candidate measurements, not claims about official source code.

## Shared layout/type tokens
stage1280x720; scale maximum1; minimum interactive scale0.75; landscape.
stage font: Times New Roman, Times, serif; installed substitutes.
paper #f6f5f0; title #ffc51d; selection #ffd22d;
preview gray #bfbfbf; rule #646464.

panel x152 y60 width974 height412.
tab label x160 y63 font22px/28px white.
preview box x182 y109 width209 height208.
name x412 y116 width684 height52 paddingX11 font40px/48px weight400.
yellow name stripe local y6..37.
description x412 y182 width684 height137 paddingX11 font36px/45px.
rule tile5x45 with3px horizontal grey stroke and2px gap.
rail x190 y350, ten90px positions, zero gap, height90.
selected corners90x90 independent SVG; ordinary white corners CSS.
keyboard outline separate from selected corners.

## Evidence
assets/panel.svg: inherited text-free panel/tab/rail.
assets/corners.svg: shared selected corners.
assets/badge.png: generated badge.
assets/statue.svg,shards.svg,note.svg,phone.svg,envelope.svg:
standalone100x100 source SVG icons.
assets/room-v03.png: generated office/background illustration.
assets/room.svg: historical rejected background, retained but not referenced.

Preview image186x186 centered,object-fit contain.
Slot image76x76 at local7,7,contain.
All large/small paths come from evidence-contract.js ICONS.

## Profiles
assets/profiles/panel.svg: new panel, no fixed pointer, pale lower control strip.
assets/profiles/p01.png through p09.png and dee.png: ten generated standalone portraits.
assets/profiles/room.png: separately generated wood-room background.
Same shared corners.svg, no duplicate selected-corner binary.

Preview209x208,contain; slot portrait86x86 at2,2,contain.
Pointer is CSS triangle20px wide/11px tall:
top338, left190+90*selectedIndex+35; hidden with0 profiles.
Bottom controls left844 top445 width270 height24.
Controls22px/24px serif; B/R badges16px/18px.
New panel control strip local coordinates starts near x680y386.
Controls/labels are DOM; no typography baked into panel artwork.

Original Profiles reference1200x675 is mapped to1280x720 (factor16/15).
Default selection index9, nameDee Vasquez,age34.
First nine metadata entries are explicitly demonstrations.

## Dependency graph
Evidence:
index.html -> evidence.css, evidence-contract.js, evidence-data.js, evidence.js.
Runtime -> old assets listed above, excluding unreferenced room.svg.

Profiles:
profiles.html -> evidence.css, profiles.css, profiles-data.js, profiles.js.
Runtime -> shared corners.svg plus all assets/profiles files.
Profiles does not import the Evidence runtime or data contract.

No network font, npm, secret, private path or external runtime service.
Full-screen generated visual study is not used by either page.

## State and text
Collections0–10; unused slots are inert decoration.
Only existing entries are buttons.
No selected entry -> hide preview/remove src, disable selected-entry editing,
retain Add and import/export controls.
Both schemas validate complete candidates before replacing state.
Long text stays intact in JSON and full-text view.

Description boxes scroll; names ellipsize.
Diagnostics/full-text controls remain outside the stage.
Do not hide focus or overlap status with decoration to make screenshots pass.

## Verified binary evidence inherited from v0.3
Receiver measured:
badge.png1254x1254 RGBA,1337512bytes:
42db1decc1cc8d2ed39566f219c864edac51d330263a5e097ed2d5bed6865282
room-v03.png1672x941 RGB,1664854bytes:
e93e04026210acbdbd57bd2c3c6010029611e09a6aaa246efce5af272f417acc

New Profiles bytes/hashes require receiver verification.
Producer saw generated pixels, not a runtime composite.

## Limits
Original likeness, poses, cabinet proportions, facial relief, stroke weight and
shading are approximate. No official font/art identity is asserted.
Both runtime states and focused controls require fresh review.
System-font metrics vary; no bundled font binary.