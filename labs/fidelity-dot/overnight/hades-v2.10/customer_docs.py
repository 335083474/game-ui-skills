import json
def render(files,s,assets,root):
    counts=f"{len(assets['pngs'])} PNGs and {len(assets['fonts'])} TTFs"
    for key,text in files.items():
        text=text.replace('No binaries are inside the code ZIP.10PNGs and7TTFs are required. Do not overwrite older versioned assets.', 'The full customer folder includes '+counts+' and font licenses. Verify these included files; do not fetch replacements already present.')
        text=text.replace('1. Decode this code ZIP, extract it to a new folder. Supply exact binaries listed in asset-manifest.json; copy unchanged fonts and their three OFL licenses into fonts/. Run python verify_assets.py.', '1. Unzip the full assembled customer package. Included assets/fonts require no downloads. Open scene.html or overview.html; optional integrity check: python verify_assets.py. Marked-TXT code-only transport is different; see INTERNAL_DELIVERY.md.')
        text=text.replace('Tooltip left76%/top66%/width23%/height18%; full text in modal if clipped.', 'Tooltip left76%/top64%/width23%/height24%, right edge99%. Body and status use the safe-panel grid.')
        text=text.replace('height84.5%', 'height73.5% for3 options (bottom89%); counts2/4 retain84.5%')
        text=text.replace('All-count alpha>0 bounds must fit panel interior and clear label, including faint nonzero glow. Full transparent canvases are reported; four-row full-canvas containment remains strict from prior harness. Alpha≥32 bounds are supplemental only and do not replace strict nonzero-alpha tests.', 'Choice-screen rendered viewport bounds must fit panel interior and clear label. R20 clips only alpha<=1 margins; every source pixel with alpha>1 is retained. Full source-canvas containment is not claimed for three rows. Four-row prior full-canvas checks remain supplemental/strict; alpha>=32 alone is never the pass criterion.')
        text=text.replace('reserve entire source canvases and faint glow under the interior label','preserve readable density and retained alpha>1 glow under the interior label')
        files[key]=text
    safe='\n## Safe content/status API\n'+json.dumps(s['safePanel'],indent=2)+'''
Use safe-panel.css and safe-panel.js. Outer panel owns its real border; direct children are .safe-panel-body and .safe-panel-status. Grid reserves status's actual wrapped height, safe padding and gap. Never absolutely position status on the frame. HadesPanelLayout.measure(panel) returns inner/body/status rectangles and inside/bodyFits/statusFits/textFits; check() refreshes visible overflow warnings.
Example markup: <aside class="safe-panel"><div class="safe-panel-body"><h2>Confirm replacement</h2><p>Editable confirmation</p></div><p class="safe-panel-status" role="status">KEPT</p></aside>.
Set owning panel dimensions for the screen. Success: normal body/status fit flags are true and all text stays within inner bounds. Failure: long body/status reports overflow; enlarge/reflow panel or shorten authored copy, never shrink automatically or put text on border.
'''
    files['LAYOUT.md']+=safe;files['SKILL.md']+=safe
    tracking='\n## R21 heading measurement\nEnglish1920 reference heading approximatelyx561–1360 (41.6%scene width);720 guide approximatelyx212–511 (41.5%). Candidate target42%. SpectralSC-Regular BOONS OF HERMES advance9.788em over15characters at2.7scene cqw; old.045em spacing predicted28.25%scene width. New.3845em predicts42.00%, unchanged font and linebox. Browser kerning/letter-spacing and title bounds require recipient measurement; no font/fidelity pass claimed. Longer alternate titles may overflow and must warn.\n'
    files['LAYOUT.md']+=tracking;files['SKILL.md']+=tracking
    viewport='\n## R20 default-three frame and CSS viewport\nDefault3: frame top15.5%, height73.5%, bottom89%; list top27%, width44%, gap.3scene cqw. Rows/fonts/label widths remain unchanged fromv2.9. Counts2/4 retain independent84.5% frame height and prior positioning. With1024scene width, third core bottom is approximately82%scene height; retained viewport bottom approximately82.75%, inside frame innerbottom83.67%, leaving HUD/background below89%.\nSource viewport x10–1935,y151–619 applies to choice row normal/selected canvases. Normal1942x809 clip margins top151,right7,bottom190,left10; selected1945x809 top151,right10,bottom190,left10. Excluded margins contain only alpha0or1; alpha1 is1/255 (0.392%opacity). All alpha>1 pixels remain: normalbbox(23,162)-(1920,603),selected(10,151)-(1935,619). CSS clipping is documented, not described as pure alpha0 removal; PNG bytes/hashes unchanged. Overview geometry is unchanged. Browser seams/fidelity remain pending.\n'
    files['LAYOUT.md']+=viewport;files['SKILL.md']+=viewport

    files['README.md']='''# Hades v2.10 candidate — full customer package
The assembled package is ready to open. Unzip once, then open scene.html (boon choice), overview.html (collected-boons pause screen), or prototype.html (separate data editor).
All '''+counts+''' and font licenses are included in the full assembled distribution. No account, CDN, build or additional download is required. Optional integrity check: python verify_assets.py. All Python text I/O is explicit UTF-8.
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
'''
    files['ASSEMBLE.md']='''# Full-package integrity
Customer package is already assembled. Open README.md and its pages. No asset collection step is needed.
Optional: python verify_assets.py. Success means every required manifest item is VERIFIED. Missing/hash mismatch means incomplete or altered extraction.
Release/transfer assembly is separately documented in INTERNAL_DELIVERY.md; those steps are not customer setup.
'''
    files['INTERNAL_DELIVERY.md']='''# Transfer/release instructions
This deliverable guide is for release assembly, not customer setup. The marked-TXT payload contains code/docs only. Decode BEGIN_BASE64..END_BASE64, verify published ZIP SHA, extract into a new folder. Reuse the exact already-verified '''+counts+''' and licenses from the existing assembled asset folder at their original relative paths. No v2.10 image bytes change.
Run verify_assets.py and build_spec.py --check; then freeze a complete folder ZIP for the customer/fresh-context test. Include overview.html as second scene.
Do not overwrite frozen old packages or independent third-screen output. Customer README assumes assembly complete. A folder containing only code transport must honestly display UNASSEMBLED.
'''
    n=len(json.loads((root/'tests/data-io-results.json').read_text(encoding='utf-8'))['results'])
    files['tests/README.md']=f'''# Tests — {s['version']}
Pure-data recorded cases: {n}, derived from data-io-results.json. Run node tests/data-io.test.cjs.
Non-browser: python tests/spec_consistency.py; python tests/utf8_io.py; python tests/layout_arithmetic.py.
Approved browser environment only:
node tests/safe-panel.cjs /absolute/package /absolute/output
node tests/option-counts.cjs /absolute/package /absolute/output
node overview-browser-test.cjs /absolute/package /absolute/output
Browser scripts are supplied but unexecuted here. safe-panel checks both screens' actual body/status geometry, normal/long statuses, warnings and screenshots. Rendering/fidelity/fresh-context acceptance require recipient review.
'''
    files['QA.md']+='\n## v2.10 R20/R21 evidence\nSource-pixel audit proves every trimmed margin has maximum alpha1; all alpha>1 retained in documented CSS viewport. Source hashes unchanged. Static layout arithmetic passes for2/3/4; source font advances predict42% title width with.3845em tracking. Browser harness asserts three-frame89%, title39–45% width, rendered viewport containment and shared safe panels for2/3/4 on both scenes. Tests are unrun in a browser. v2.9 recipient safe panels passed normal content at reported viewports; those results do not automatically transfer. Independent sell-boon output remains external/frozen.\n'
    return files
