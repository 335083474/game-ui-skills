# Shop components
Version: ACNH-shop-v0.1 / candidate, unverified runtime

## Layer order and edit ownership
1. assets/shop-background.png: new generated room illustration, no menu text.
2. #shelf: independent CSS translucent dark surface and dotted low-contrast material.
   Category and all product prices are DOM strings. Goods are independent buttons/images.
3. #wallet: CSS currency bubble with DOM balance. The star/club money marks are substitutes.
4. #speech: CSS asymmetric cream form. #speaker is a separately positioned orange label.
   #productName and #dialogue are DOM strings; no glyphs baked into the background.
5. #choicePanel: independent CSS pale-yellow balloon. Each choice is a real button.
   .selected controls the yellow backing and inherited assets/hand.svg pseudo-element.
6. #gameControls: native cancel/select buttons. Review tools are outside #stage.

## Files
shop.html defines the sample composition.
shop.css contains the component shapes, roles and bounded layout.
shop.js handles validation, DOM rendering, arithmetic, focus and full text.
shop-data.js contains the editable initial data.
assets/shop-background.png: generated background, normal cover for1280:720.
assets/customization-kit.png: generated transparent item; normal contain.
assets/shop-seed.svg and assets/shop-sapling.svg: separately authored editable vector paths.
assets/hand.svg: unchanged Pockets component, reused through relative path.

## Component samples
The two supplied SVG files are independent image samples; open either directly.
Their nominal canvas is100 ×120; all shapes are source paths, no text.
In the Shop runtime select a shelf item to see its associated choice prices and name.
All previews of a given icon must resolve the same ICONS token/path.
The full-text dialog currently presents all values as text; it does not invent a second
large product illustration. If an additional preview is requested, reuse the same asset.

## Public composition classes
.good contains one image and one price output.
.choice contains .line and optional .cost; selected/focus are CSS state, not image variants.
#speechText bounds the product heading plus dialogue.
#diagnostic is a native button outside the stage and opens complete text.
Do not use these shapes as screenshots with transparent hotspots.

## Source-specific approximations
The generated interior changes villager pose and cabinet proportions.
The customization kit is a new craft-box interpretation.
Seed and sapling are simplified source-drawn samples; game identity is not asserted.
Currency symbols, system font and CSS material are approximations.
Actual default composite, small-icon legibility, all choice counts and extreme text need
receiver visual review; component existence does not close that review.

## Common editing errors
Wrong image path: use a declared token; do not place raw URLs in data.
Need a truly new image: first add a separately sourced local file and explicitly update
the token whitelist in a NEW version, then test its errors and transparency.
Long category/speaker/name/choice: keep the complete value; bound only presentation.
Long dialogue: retain it, warn via diagnostic and provide full-text access.
Many options: accept only2..4 in this candidate. Do not squeeze an unlimited list.
Many products: accept only1..8. A separate scrolling/catalog design needs a new contract.
Insufficient funds: maintain balance and inventory; show status without a partial mutation.
New focus treatment: include its entire visible outline/hand in collision checks.
