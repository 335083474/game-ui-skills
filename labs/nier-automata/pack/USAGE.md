# Use this reference skill

Give your AI the whole folder so it can read the visual rules, patterns, local assets, and editable Web specimens.

Example request:

> Use the NieR:Automata UI reference skill to make three connected screens: chip loadout, item case, and system settings. Follow the 2017 original UI direction, preserve the warm beige grid and restrained black selection rule, use the synthetic state in screen-patterns.md, and save the runnable implementation outside this skill folder.

Open `assets/components/index.html` directly to inspect the local primitive board. It uses sibling CSS and SVG only. Copy the specific primitives you need and adapt their sizing; do not use the specimen board as the final application.

The package has no network dependency, bundled font, official screenshot, engine scene, or completed screen. For screen composition, follow [screen-patterns.md](references/screen-patterns.md). Treat demo values as invented test data rather than game balance.
