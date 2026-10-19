# Install and use

Copy the entire `pokemon-emerald-ui` directory to your Codex skills directory (typically `~/.codex/skills/`) or provide its `SKILL.md` path to your own agent. Keep subdirectories together. This is an experimental reference Skill, not an engine plugin or a bundled game.

Example request: “Use $pokemon-emerald-ui to make related party, bag and battle-command Web screens. Share party HP and item stock between them; support pointer and keyboard; use the local assets and GBA integer scaling.”

For a frontend, copy `assets/components/theme.css`, `assets/fonts/` and `assets/sprites/` into your project preserving their relative URLs, or update those URLs explicitly. The component HTML is an offline specimen page that opens directly as a file; it has no external fonts, modules, CDN, or server dependency. Adapt its pieces; do not ship the specimen headings as game UI.

`references/tokens.json` contains source-pixel values. At 3×, a 1px source edge becomes 3 CSS pixels. The provided `.emu-viewport` chooses a 1×/2×/3× integer scale with media queries; preserve the 240×160 content coordinate system. Larger windows can add neutral surroundings or a modest page-level navigation region. Keep browser navigation outside the game frame.

The font is an unmodified local copy of Pixelify Sans with its SIL OFL in `assets/fonts/OFL.txt`. Latin text is supported; other scripts use system fallback and need their own layout review. The direction reference is AI-generated; runtime sprite sheets are unchanged CC0 art by Clint Bellanger and Kenney with original licenses in `assets/licenses/`. No official game art is included. See the provenance and generation files before redistribution. Do not claim this package grants rights to official game branding or official art.

Before a frozen handoff, ensure `references/images/component-board.png` has been captured from the primitive HTML and both sprite sheets exist and their documented 16×16 cell crops pass inspection. The rejected generated atlas is documented and is not a deliverable.

