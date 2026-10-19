---
name: zelda-pixel-inventory
description: Build or adapt a local 256x224 pixel-art inventory or equipment-detail interface using this package's editable sprites, bitmap glyphs, panels and JSON runtime. Use for this Zelda-style UI study; assets are authored approximations rather than official game artwork.
---

# Native-pixel inventory and equipment UI

Use the bundled sources and renderer to preserve the authored style while changing real content and state. This candidate supplies two runtime examples: inventory selection and equipment details. A screenshot alone is not a runtime deliverable.

## Start with the actual package

- Read `README.md` for launch, editing and regeneration commands
- Read `references/runtime-contract.md` before changing data or public API calls
- Read `references/visual-spec.md` before changing layout, glyph metrics or pixels
- Read `SOURCES.md` for per-component provenance and rights limitations

## Input and output

Input is an editable JSON object with `title`, zero-based `selectedIndex`, `items`, and `equipment`. Entries have `id`, `name`, relative `icon`, integer `count`, and `description`. The validator enforces 2–20 inventory entries, 1–3 equipment entries and counts from 0 through 9999. Follow the exact contract rather than silently coercing invalid data.

Output is a self-contained folder of local HTML/CSS/JavaScript, relative component PNGs, editable JSON/grid sources, and review evidence. `inventory.html` and `equipment.html` are distinct entry examples sharing the runtime. Native drawing is 256×224. A PNG preview is a separate render artifact, not evidence that browser controls work.

## Workflow

1. Open the relevant existing example and inspect the input data. Preserve source text; lowercase display normalization and missing-glyph diagnostics do not authorize rewriting the content
2. Change JSON data first for names, descriptions, counts, item ordering and local icon references. Keep IDs unique within each collection and selectedIndex valid after list changes
3. Edit the canonical palette/grids or glyph arrays only when an asset actually needs to change. Regenerate through the supplied scripts; do not paint changes into a flattened screen or resize a full image to simulate native pixels
4. Keep panels, title cutouts, labels, item sprites, counters, selection state and background separable. Reuse the same sprite for grid and selected preview. A count is editable data, not pixels baked into a sword
5. Preserve paginated long text and the complete-text access path. Report unsupported characters; do not silently remove them. Follow measured glyph advances, bearings and line bounds rather than assuming monospaced CSS text
6. Verify both visual output and behavior. Exercise selection, confirmation, back navigation, count edits, JSON import/export, long text and unsupported characters. Distinguish automated contract tests, offline PNG rendering and actual browser evidence
7. Deliver the changed source, runnable example and observed test results. State untested platforms and known visual/runtime limits. Do not label a successful build or pixel-grid check as visual approval

## Creating a requested screen from this package

Choose the closest existing entry: inventory for a selectable 5-column collection, equipment for a small selected-entry detail view. Supply the JSON contract, choose local icons, then use the existing screen state and render functions. Keep native anchors and bitmap metrics from the visual specification. If the requested design requires another screen type, implement its state, controls and layout explicitly; the current runtime does not imply arbitrary screen support. This candidate itself includes only the two supplied examples.

## Examples of correct adaptation

- Rename a supplied item, set its count to 12, replace its description with several paragraphs, and point its icon to another bundled native PNG. Validate the data, open both entry pages, verify paging/full text and export the edited JSON
- Replace one sprite by editing its source grid. Rebuild, verify the intended PNG changes, and verify the grid and preview both use it without changing the original reference or frozen prior packages

## Failure cases to avoid

- Passing `count: "4"`, an out-of-range selectedIndex, duplicate collection IDs or a traversal/remote icon URL and claiming the data imported successfully
- Flattening a dynamic count or item label into a screenshot, keeping a stale preview icon, or truncating a long description with no path to its remainder
- Substituting a browser font for the supplied pixel glyphs inside the native scene without treating that as a deliberate design change
- Treating the authored font, palette or recognizable design as official or commercially cleared. No such clearance is provided

## Portability

All text I/O in Python must explicitly use UTF-8. Anchor script paths to `__file__`, not the caller's current directory. Keep web asset references relative. Do not require a system-locale change to read `×` or other supported punctuation. The direct background renderer consumes edited matrix/palette inputs; the optional procedural background generator is a reset operation and can overwrite those edits.
