# Assemble the v4 two-example candidate

Required base: a complete verified v3 folder. This delta does not apply directly to v1 or v2.
Base v3 MANIFEST.json SHA256: b7464305d52cbca26070c2309de3f958cc591f82afd78d0c996cd6b9c3c40826
Base v3 delta ZIP SHA256: 6206fb74445ad89919af760decfec77a6818d02068e467914c0003cfb0348025
Cloud complete v3 backup ZIP SHA256: 54a32e3eb8cb8cf641a2c3cdd5e6e492a8ee691a3007c022db0afd841d2f274e

1. Verify the base manifest hash and every listed base file. Make a NEW copy named balatro-skill-v4; leave frozen v3 unchanged.
2. Extract balatro-skill-v4-delta.zip into the new copy, replacing the relative paths below. There is no outer directory or executable patch.
3. Remove only the listed obsolete paths from the NEW copy.
4. Verify every target file against new MANIFEST.json. Its own SHA256 is in TRANSFER.json. Verify before running rebuilding scripts, which can legitimately change outputs.
5. Open shop.html or collection.html as README.md describes. Keep all relative assets together. The complete backup ZIP already contains every dependency and needs no base overlay.
6. Run recipient browser checks. QA.md distinguishes executed cloud tests from pending actual browser/Windows checks.

Deleted paths:
- APPLY-v3.md

All changed/added paths:
- APPLY-v4.md
- MANIFEST.json
- QA.md
- README.md
- SKILL.md
- SOURCES.md
- browser-harness.html
- build_data.py
- check_v4.py
- collection.html
- example-data.js
- example-data.json
- export-scenes.cjs
- font-data.js
- fonts/browser/canonical_atlas_16.png
- fonts/browser/canonical_atlas_18.png
- fonts/browser/canonical_atlas_19.png
- fonts/browser/canonical_atlas_20.png
- fonts/browser/canonical_atlas_22.png
- fonts/browser/canonical_atlas_24.png
- fonts/browser/canonical_atlas_26.png
- fonts/browser/canonical_atlas_32.png
- fonts/browser/canonical_atlas_40.png
- fonts/browser/canonical_atlas_48.png
- fonts/browser/canonical_atlas_96.png
- index.html
- model.js
- output/collection-commands.json
- output/collection-runtime-offline-2x.png
- output/collection-runtime-offline.png
- output/shop-commands.json
- output/shop-runtime-offline-2x.png
- output/shop-runtime-offline.png
- output/v4-static-validation.json
- package.json
- pixel-font.js
- references/authoring-guide.md
- references/components-and-tokens.md
- references/runtime-api.md
- render_runtime_preview.py
- runtime.js
- scene.js
- shop.html
- style.css
- tests/INDEPENDENT-QA.md
- tests/font-layout.cjs
- tests/independent-qa-results.txt
- tests/qa-model.cjs
- tests/qa-runtime-mock.cjs
- tests/qa-scene.cjs
- text-layout.js
