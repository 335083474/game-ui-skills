# Source and use boundaries

Reference only: official publisher/developer press-kit screenshot at https://www.playbalatro.com/press-kit/Screenshots/Balatro_ui_3840x2160_2.png . It is stored separately and excluded from this package. Inspection informed layout, state, palette and component categories. No screenshot pixels are inputs to rendering. Public availability is not a redistribution or derivative-work license.

Nine card illustrations: newly generated with the visible image_gen tool. Underlying model/version is UNKNOWN. Prompt summary: create an independent transparent3×3sheet of reference-informed pixel-art orange/red/purple/teal Jokers, Wheel of Fortune, green Joker, ballot Joker, Buffoon pack and Arcana pack. These are approximations; generated lettering may differ from the original.

Source generation output: exec-b59634f0-f58f-483f-a479-30dbd5c4a76e.png. Packaged as sources/generated-card-sheet.png. SHA256: bee2693361e6d264a5f36b0e187ef13e76fd3f94143512216b7b5e9caa9eff92

Card components are rectangular separations documented in sources/card-regions.json. They are crops of the NEW generated sheet, not crops of the original game screenshot. Straight cell bounds avoid broad noisy gutters but do not establish pixel-perfect transparent edges. Rendering uses nearest-neighbor resizing.

Background, UI panels/shadows, marquees, chip, voucher and deck: independently authored procedural geometry/palette in render.py and separate_cards.py. These are not extracted game assets.

The underlying game identity, recognizable card concepts, source screenshot and branding may have separate rights. No commercial-use clearance, license compatibility finding, or legal conclusion is asserted. Generated-art ownership/licensing terms and exact game-font version remain unverified. This is a private representative review candidate, not approval for publication.

## Actual font dependency

fonts/m6x11.ttf is retained as the creator source for the v3 frozen bitmap masters; normal v3 rendering does not load the TTF. It was obtained from Daniel Linssen’s creator download at https://managore.itch.io/m6x11 . Published permission: “free to use with attribution.” Credit: Font: m6x11 by Daniel Linssen. License/attribution statement is retained in fonts/LICENSE-AND-ATTRIBUTION.txt. Not described as OFL or CC0. Exact Balatro shipped font binary/variant remains unverified. Font SHA256: 64697c6fefd4a084dbe28f3df3e658b1f72bd148f81c4ec10fd1f8f944f18a20

## v3 frozen font masters and preserved decor
Normal rendering uses fonts/canonical/canonical_atlas_*.png and canonical_metrics.json:11 independently frozen sizes from the same creator TTF. There is no runtime FreeType or between-size resampling. Fixed-point advances make glyph placement explicit. Source measurements are documented in fonts/canonical/reference_measurements.json; no source screenshot/crop pixels are included.

The source font attribution remains in fonts/LICENSE-AND-ATTRIBUTION.txt. Recipient v2 Windows PNG pixel matching is recorded as v2 evidence only; v3 still needs recipient verification.

SHOP and voucher remain the accepted v2 procedural components in sources/decor/, with editable SHOP masks. Nine generated card crops and their source sheet remain unchanged from v1/v2. The image-generation model remains UNKNOWN. There are no new game extractions or original screenshot files. Overall rights/visual clearance remains unresolved.

## v4 runtime and evidence boundaries

The v4 Shop and Collection examples reuse the accepted v3 static components, independent frozen font masters and generated-card source; they introduce local browser interaction and editable demo data. The runtime is not a capture of the commercial game's UI or a reimplementation of its rules. Purchase and reroll operate on local virtual demo state only.

The official reference screenshot's exact capture platform, operating system, game build and renderer configuration remain UNKNOWN. Do not infer those facts from its dimensions or from the recipient's Windows testing. The image-generation tool was used for the new card sheet, but the underlying generation model/version remains UNKNOWN. No additional model identity is inferred from a filename.

Browser font PNGs under fonts/browser are alpha-mask derivatives of the frozen creator-font atlases, for browser tinting/drawing. They are not new font designs or system-font fallbacks. Font attribution remains required as recorded in fonts/LICENSE-AND-ATTRIBUTION.txt. The separate generator/rebuild scripts are authoring tools, not runtime FreeType dependencies.

Source screenshots/reference-only crops are excluded from the distributable. The generated card sheet is separate from those references; its separation into component PNGs does not prove perfect silhouettes or grant rights to the game's visual identity. The underlying game branding, recognizable concepts, generated-art terms and other third-party rights remain unresolved for commercial publication. This document is provenance disclosure, not legal clearance.

Acceptance and test scope must remain revision-specific: v3 static approval does not establish v4 browser behavior; previous Windows pixel matching does not establish a new revision's cross-platform results. Use the actual v4 test reports and any recipient review, distinguishing Node model checks, offline raster checks and real browser interaction. No unperformed browser or Windows check is claimed here.
