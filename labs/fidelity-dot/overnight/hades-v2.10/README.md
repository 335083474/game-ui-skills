# Hades v2.10 candidate — full customer package
The assembled package is ready to open. Unzip once, then open scene.html (boon choice), overview.html (collected-boons pause screen), or prototype.html (separate data editor).
All 10 PNGs and 7 TTFs and font licenses are included in the full assembled distribution. No account, CDN, build or additional download is required. Optional integrity check: python verify_assets.py. All Python text I/O is explicit UTF-8.
Select with mouse/arrows; Home/End select first/last. Export JSON preserves edits; Import JSON restores them. Reload resets to bundled data unless re-imported. No automatic cross-page synchronization. API/examples: SKILL.md; current geometry: spec.json and LAYOUT.md.
Success example: edit Greater Haste's title/stat, export JSON, import it into the desired screen; selected name/details/status reflect data. Normal two-line description and stat should fit. These are intended behaviors, not claims of v2.10 browser acceptance.
Failure examples: invalid rarity/remote icon path is rejected without replacing good data. Long copy produces a visible overflow warning and remains available in full-text/editor modal. Missing/corrupt assets produce UNASSEMBLED or verifier failure, never a successful preview.
Troubleshooting:
1. UNASSEMBLED: check complete extraction and retained folders; verify_assets.py identifies exact missing/mismatched files. Do not replace already verified assets.
2. Broken image/fallback font: keep components/ and fonts/ beside HTML; inspect manifest/path results.
3. Policy blocks file URLs: do not bypass policy; use an already approved static HTTP route or ask the environment owner. No serving process is launched by this package.
4. Reload lost edits: export JSON before closing, then import next time.
5. Clipping warning: inspect full copy, viewport and fonts; hiding warnings is not acceptance.
Only received marked-TXT code transport? That is not the assembled customer distribution. INTERNAL_DELIVERY.md explains release assembly.
Overall visual/fresh-context acceptance remains pending. Independent recipient output is external and frozen; this package does not modify it. See QA.md and RIGHTS.md.
