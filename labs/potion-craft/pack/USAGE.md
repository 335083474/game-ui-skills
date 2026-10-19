# Use this reference skill

Provide your AI the complete folder, including its local transparent art atlas, visual rules, screen patterns, and editable primitives.

Example request:

> Use the Potion Craft UI reference skill to make an alchemy map, recipe ledger, and trade counter as three linked screens. Keep the parchment route map central, use the synthetic data in screen-patterns.md, reuse the atlas and typography rules, and save the runnable app and browser captures outside the skill folder.

Open `assets/components/index.html` in a browser to see isolated primitives. The atlas crops in `theme.css` use a single local PNG; keep that file adjacent at `assets/art/potion-atlas.png` or update the URLs. Do not stretch the component board into a finished screen.

The generated art is original demo art with transparent background, not extracted Potion Craft art. The package has no network requirement, copied font, finished screens, or production engine export.
