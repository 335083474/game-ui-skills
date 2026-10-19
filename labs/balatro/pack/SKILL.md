---
name: balatro-ui
description: Create coherent Balatro-inspired game interfaces using bundled visual references, pixel item art, design tokens and component specimens. Use for reward choices, inventories, shops or related retro card-game screens when this visual direction is requested.
metadata:
  version: "1.0.0"
---

# Balatro UI

Make new game interfaces feel like parts of one tactile, retro poker-table system. This is an unofficial, Balatro-inspired reference workflow. The images are generated studies, not official screenshots or extracted game assets.

## Read and look before creating

1. Read [style rules](references/style-rules.md) and [tokens](assets/tokens.json).
2. Visually inspect both [reward direction](references/images/reward-direction.png) and [component direction](references/images/component-direction.png). They define materials and pixel treatment; do not paste either whole image behind functional controls.
3. Inspect [component specimens](assets/components/index.html), or its [rendered board](references/images/component-board.png) when present. Read [component CSS](assets/components/theme.css) for exact states, typography and geometry. These are reusable primitives, not finished screen layouts.
4. Inspect the [six-item atlas](assets/items-atlas.png). The [asset map](references/asset-map.md) explains the cells and provenance.

If the agent cannot inspect images, state that limitation. Use written rules but describe the result as text-guided, not visually verified.

## Create from the user's content

Use the project's existing stack and conventions. If neither stack nor deliverable is specified, create an offline HTML/CSS/JS prototype with editable text and real controls. Ask only for inputs that block the work; otherwise state reasonable assumptions. Default copy is English, with title/content localized to the user's request.

- Use supplied CSS/font/atlas for web output, or map the same tokens and component anatomy to the requested stack. Copy runtime resources into the output with relative paths; do not depend on an installed Skill's absolute path.
- Use [screen patterns](references/screen-patterns.md) for relevant information and behavior. Compose new layouts from primitives; do not make every screen three cards.
- Separate background, panel, illustration, name, numerical effect, selection marker and action. Text, prices and state must remain editable. Use the atlas for the supplied items; new items should match its pixel scale and outline.
- Carry the same font, cream cards, teal felt, navy depth shadow, coral primary action, blue secondary action and explicit selected marker across screens. Screen meaning changes layout, not the design system.
- Keep interaction state in data. A selected card has a label/check AND a border treatment. A disabled action explains why. Confirm, purchase and use actions must produce observable results when an interactive prototype is requested.
- If additional art needs generation, use an available image tool with the atlas as a style reference. Do not claim model integration, engine export or generation service exists unless implemented and tested.

## Verify the result

Read [consistency checks](references/consistency-checks.md). Render the output and compare to reference images and specimens. For a screen family, inspect screens together at the same viewport, check shared components, then test one meaningful interaction per screen. Record actual checks, visual drift and stack limitations. A matching token file alone does not establish visual consistency.

Deliver editable implementation, local assets, a visible preview and concise verification note. A PNG-only request may be delivered as images, labeled a visual mockup. This package itself does not provide Figma documents, game-engine scenes, authentication, hosted generation or payment services.
