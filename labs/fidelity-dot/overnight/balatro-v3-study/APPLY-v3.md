# Apply v3 source delta

Required base: the complete, verified v2 folder. This is NOT a delta directly against v1.
Base v2 MANIFEST.json SHA256: a5d73e5ce7a2e39e9b2543354a5848467a443b7d47729c0eef2ced615fa23c4f
Base v2 delta ZIP SHA256: e36c4b13f0e9ceea11627d7f3604f626992a9b713f128eeec9f5899f21040f65
Cloud complete v2 backup ZIP SHA256: 84372767b2eadac16fa0b8b0d3f86c4f2815110a63131529feba26f9cf143695

1. Verify the base v2 manifest hash and every file it lists, then copy that complete folder. Keep frozen v2 unchanged.
2. Extract balatro-shop-v3-delta.zip directly into the copy, replacing the listed paths. There is no outer folder and no executable patch.
3. Remove ONLY the obsolete paths listed below from the new copy.
4. Verify every file against the new MANIFEST.json, and ensure removed files are absent. The manifest excludes itself; its SHA256 is in TRANSFER.json. Verify before running scripts that regenerate outputs.
5. Open index.html or the delivered PNG. Optional checks are in README.md. v3 visual and Windows pixel acceptance remain pending. The recipient Windows result recorded for v2 does not prove v3.

Deleted files:
- APPLY-v2.md
- fonts/canonical/canonical_atlas.png
- fonts/canonical/canonical_glyph_rows.json
- fonts/canonical/rebuild_from_rows.py
- fonts/canonical/test_canonical_font.py
- output/glyph-specimens/font_16_no_crt.png
- output/glyph-specimens/font_32_no_crt.png
- output/glyph-specimens/font_48_no_crt.png
- output/v2-test-results.json
- test_v2.py

All changed or added files:
- APPLY-v3.md
- MANIFEST.json
- README.md
- SOURCES.md
- components/background.png
- components/labels.png
- components/panels.png
- fonts/canonical/README.md
- fonts/canonical/canonical_atlas_16.png
- fonts/canonical/canonical_atlas_18.png
- fonts/canonical/canonical_atlas_19.png
- fonts/canonical/canonical_atlas_20.png
- fonts/canonical/canonical_atlas_22.png
- fonts/canonical/canonical_atlas_24.png
- fonts/canonical/canonical_atlas_26.png
- fonts/canonical/canonical_atlas_32.png
- fonts/canonical/canonical_atlas_40.png
- fonts/canonical/canonical_atlas_48.png
- fonts/canonical/canonical_atlas_96.png
- fonts/canonical/canonical_font.py
- fonts/canonical/canonical_metrics.json
- fonts/canonical/comparison_metrics.json
- fonts/canonical/expected_vectors.json
- fonts/canonical/generate_masters.py
- fonts/canonical/reference_measurements.json
- fonts/canonical/test_font.py
- fonts/canonical/v2_control_validation.json
- fonts/canonical/v2_count_controls.json
- fonts/canonical/validation.json
- index.html
- output/balatro-shop-1024x576.png
- output/balatro-shop-2x.png
- output/glyph-specimens/button_price_comparison_no_crt.png
- output/glyph-specimens/button_price_comparison_no_crt_2x.png
- output/render-report.json
- output/score-fit-cases.png
- output/v3-test-results.json
- render.py
- sources/layout.json
- test_v3.py
