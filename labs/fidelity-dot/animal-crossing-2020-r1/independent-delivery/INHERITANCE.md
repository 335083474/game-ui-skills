# Version and inheritance manifest specification
Candidate: ACNH-suite-candidate-0.1
This is a human-readable file/ancestry list, not a computed checksum manifest.
The receiver should generate the actual current manifest and ZIP after copying exact files.
Do not reuse a historical manifest as proof of the assembled candidate.

## Frozen base —17 files, ALL unchanged
Receiver-confirmed Pockets v0.3 ZIP:
SHA256 6ee05c0a45cf72e4ba54a878966a2e557f77d6fee44c4e9fe2ad7668e715aeec
Do not overwrite this ZIP or its source directory.

index.html
pockets.css
pockets.js
pockets-data.js
README.md
COMPONENTS.md
assets/pocket-panel.svg
assets/hand.svg
assets/shovel.svg
assets/axe.svg
assets/slingshot.svg
assets/watering-can.svg
assets/fishing-rod.svg
assets/ladder.svg
assets/net.svg
assets/scorpion.png
assets/background.png

Pockets implementation captionv0.3 and JSONversionv0.1 intentionally differ;
the data version remains compatible with existing receiver fixtures.
This base has receiver-reported representative visual/limited runtime acceptance,
not complete suite or commercial acceptance.

## Fifteen additions
shop.html
shop.css
shop.js
shop-data.js
assets/shop-background.png
assets/customization-kit.png
assets/shop-seed.svg
assets/shop-sapling.svg
SUITE-README.md
SKILL.md
TOKENS.md
SHOP-COMPONENTS.md
DATA-CONTRACT.md
SOURCES.md
INHERITANCE.md

Total content files before a receiver-generated manifest:32.
No inherited file is replaced. No inherited illustration is duplicated under another name.
Shop reuses assets/hand.svg by relative reference.
No whole-screen study, original screenshot, private review log or credentials belongs in the package.

## Exact text delivery precedence
shop.html:source delivered in messageSentinel_8ce1d983fe7c8191831e62861803f958.
shop.css:use the COMPLETE revised text in messageSentinel_040742593f8c8191b97b5d94264b1c50.
The earlier CSS from the first group is superseded only for this new Shop candidate.
The change is #dialogue line-height1.48→1.4, reserving default text line-box space.
shop.js:use COMPLETE revised text in messageSentinel_9544102b83508191b91adbec0af1a615.
The earlier JS from the third group is superseded only for this new Shop candidate.
The change explicitly requires a string icon token before whitelist lookup.
shop-data.js and both newSVGs:messageSentinel_f5b5b38260948191afdbe5ce2e9dfa48.
Other additions use their single complete document text from this delivery.
Retain superseded drafts as private history if needed; do not include two active copies.

## Binary mapping
ACNH_shop_background_v01.png→assets/shop-background.png,1927293 bytes.
ACNH_customization_kit_v01.png→assets/customization-kit.png,1267605 bytes.
These sizes come from successful file preparation/finalization, not a computed ZIP.
They are new, separate generated image files, not source screenshot crops.
The producer has not computed individual SHA256 values or a new combined ZIP hash.

## Known differences and outstanding review
New room pose/cabinet dimensions differ from the original screenshot.
Kit is a generated interpretation; seed/sapling are simplified direct-source art.
System font, monetary marks and CSS material are approximations.
The original shelf's small category/bag and right-side control symbols are not exact
reproductions; the sample focuses on separately editable buying controls and shelf structure.
The candidate's actual composite and icon scale need receiver inspection.
No producer browser screenshot, runtime test, third-screen independent reuse or public
download verification is claimed for this Shop addition.

## Acceptance state and provenance
Pockets limited representative pass:receiver report, exact base hash above.
Shop:new author-produced candidate, not receiver accepted.
Whole two-page suite:reviewerAccepted=false,customerReady=false,unpublished.
Runtime/packaging/freezing/acceptance/publication are receiver responsibilities.
Preserve "producer source delivery → receiver actual tests → defect repair" history.
Only after the two-page package is frozen should the receiver issue a new requirement to
an independent context that receives only that final package, without producer answers.
