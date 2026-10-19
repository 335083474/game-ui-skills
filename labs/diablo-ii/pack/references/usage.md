# Use and install

This folder is a self-contained experimental reference Skill. It includes no official game sprites, no finished application and no engine export. It can guide a capable coding assistant without a specific plugin, API key, build service or network connection.

1. Copy the entire `diablo-ii-ui` folder into the target assistant's Skill directory (for Codex, `~/.codex/skills/diablo-ii-ui`). Do not flatten its subfolders. Restart/reload discovery if that environment requires it.
2. Invoke `$diablo-ii-ui` with the desired screen, output directory and framework. For an assistant without Skill discovery, attach `SKILL.md` and the whole folder, then ask it to read the linked files and inspect the references.
3. Example: `Use $diablo-ii-ui to create a runnable local equipment menu, a connected reduced skill tree and a finite-stock merchant. Use shared sample state, preserve multi-cell inventory rules, and put outputs in my chosen directory. Include keyboard controls and test failed transactions.`
4. Open `assets/components/index.html` directly to review the offline specimen board. It has local fonts and atlas art, no install step or external requests. Its controls are visual state specimens, not completed inventory transactions.
5. Copy only needed assets into the new app while preserving relative links and both OFL licenses if the fonts ship. Use your framework's state system; the pattern contracts deliberately do not prescribe one.

Maintain provenance when sharing: say `original Diablo II classic inspired study`; generated references and icons are interpretations, not screenshots or extracted Blizzard artwork. This package does not establish rights to game names, branding or third-party product use. Keep independently generated finished screens and browser test evidence outside the Skill input folder.
