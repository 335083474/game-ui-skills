# Use this reference skill

This package helps your AI build original FFVII inspired blue-window menus. It contains editable Web primitives, visual guidance, two generated raster assets, a local OFL font and demonstration state contracts. It does not contain finished party/equipment/battle applications, extracted game assets or engine exports.

## Use from this folder

Give your AI the complete folder, including assets and references. Example:

> Use the final-fantasy-vii-ui skill in this folder to create three connected Web screens: party, equipment and battle commands. Reuse the provided original character atlas and font, preserve the classic blue windows, and implement the state transitions. Save runnable output and browser evidence in a separate output folder.

Open `assets/components/index.html` directly in a browser to inspect local editable specimens. It loads only sibling files and works offline. The component board's cursor buttons are isolated demonstrations; they do not navigate finished screens. Copy/adapt `theme.css` and the needed assets into your app, then update font and atlas relative paths. Do not embed the direction sheet as your application.

## Install in Codex

Copy this entire `final-fantasy-vii-ui` folder into your personal skills directory, normally `%USERPROFILE%\.codex\skills\` on Windows or `~/.codex/skills/` on macOS/Linux. If your Codex setup uses a different `CODEX_HOME`, use its `skills` directory. Keep `SKILL.md` at the folder root. Do not copy only the Markdown file.

Invoke `$final-fantasy-vii-ui` in a request. If it is not discovered in the current session, provide the absolute path to `SKILL.md` and ask your AI to read it. The package itself requires no API key, asset downloads or build tools. Your chosen implementation stack may have its own dependencies.

## Suggested requests

- “Use $final-fantasy-vii-ui to build a party menu with working selection and potion targeting.”
- “Use $final-fantasy-vii-ui for an equipment menu where previews show real stat deltas and committing gear changes shared character stats.”
- “Use $final-fantasy-vii-ui for a battle command menu with Magic/Item submenus, target selection, MP costs and visible turn status.”

Read the desired screen's pattern rather than assuming all game mechanics are included. Demo values are simplified original examples. Preserve the distinction between the generated direction image, official sources, editable specimens and actual implementation evidence. See `references/sources.md`, `asset-map.json`, `generation.json` and the included font license for provenance.
