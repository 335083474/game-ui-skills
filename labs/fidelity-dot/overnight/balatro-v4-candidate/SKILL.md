---
name: balatro-style-ui
description: Create or edit a local Balatro-inspired card-shop or collection interface using the bundled components, fixed font masters, editable JSON and two-screen runtime. Use for this visual system and its data-driven screen variants, not for extracting game assets or reproducing game rules.
---

# Balatro-style UI

Use the bundled implementation as a reusable visual system, not as a screenshot to paint over. Its two supplied examples are Shop and Collection. Preserve accepted static v3 assets while editing v4 data/runtime; a new example does not authorize changing older frozen packages.

## Start with the actual contract

Read [README.md](README.md) for local entry points and editing commands. Read [runtime-api.md](references/runtime-api.md) before changing data or state transitions. Read [components-and-tokens.md](references/components-and-tokens.md) when changing appearance. Use [authoring-guide.md](references/authoring-guide.md) for a new screen or validation examples. Consult [SOURCES.md](SOURCES.md) before adding, replacing or sharing assets.

## Assemble from independent parts

- Use the 1024×576 logical canvas, separate marbled background, panels, sprite/card images, buttons, badges and glyph layers
- Select the appropriate independently frozen font master for each role. Use the shipped atlas pixels and fixed advances; do not call runtime FreeType, use system text as a silent substitute, or scale an entire completed screen to repair text proportions
- Keep names, descriptions, prices, counts and selection in editable data/state. Do not bake changing labels into card art or reuse the flattened static reference as a live interactive scene
- Fit numeric text inside its component's bounds, including shadows. Preserve the visible chips/multiplier gutter and its operator rather than covering it with long values
- Keep long strings and unsupported characters in the source data. Surface fallback diagnostics and provide full text access; pagination is not permission to discard later pages

## Build only the requested scope

The bundled purchase/reroll operations are local demo-state transitions, not payments or official game rules. Do not add accounts, network services, persistence, new artwork, third-party sharing or additional game examples without an applicable request. The package supplies two examples; this task does not include a third.

## Verify observable behavior

Run the provided checks for the actual files changed. Inspect both examples at native resolution and in the browser when browser access is available. Check selection/details, successful and rejected purchase, reroll cost, navigation, editable/imported data, large numbers and long/unsupported text. Distinguish pure state tests, static raster tests and real browser interaction; none substitutes for the others.

Report outputs and remaining limitations accurately. Earlier static acceptance or Windows pixel matching does not establish that a new runtime revision passed browser, accessibility, persistence or cross-platform checks. Preserve font attribution and unresolved rights/provenance boundaries.
