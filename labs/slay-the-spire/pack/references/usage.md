# Using the package

Invoke `$slay-the-spire-ui` in an agent that supports local Skills, or give the agent this folder and ask it to read `SKILL.md`. Example request: “Use this Skill to create reward, inventory and shop views for a dungeon run. Use editable text, local resources, and working game-currency interactions.” The target agent still needs file and preview capabilities; this folder does not install a hosted generator.

For an existing Web project, copy the required resources into a stable local asset directory. Preserve `components/theme.css` → `../fonts/…` and `../items-atlas.png` relationships, or update the URLs together. The component stylesheet's stone and paper SVGs live beside it. Load the stylesheet, use `sui-scene` on a wrapper and compose the primitives below. Do not copy the specimen page as a final screen.

```html
<link rel="stylesheet" href="./assets/components/theme.css">
<main class="sui-scene">
  <button class="sui-action" type="button"><span>Continue</span></button>
  <span class="sui-icon sui-icon--potion" role="img" aria-label="Healing potion"></span>
  <span class="sui-money"><span class="sui-icon sui-icon--coins" aria-hidden="true"></span>125 gold</span>
</main>
```

| Primitive | Purpose |
|---|---|
| `sui-scene`, `sui-panel`, `sui-paper` | World surface, stone panel, paper content |
| `sui-title`, `sui-eyebrow`, `sui-muted` | Serif hierarchy and support text |
| `sui-card`, `sui-card__body`, `sui-card__art`, `sui-card__paper` | Layered tall item frame; editable title/effect in paper |
| `sui-action`, `sui-action--secondary` | Gold encased red action and quieter stone alternative |
| `sui-slot`, `sui-slot__count`, `sui-selected` | Recessed square cell, quantity, explicit selected plaque |
| `sui-icon`, `sui-icon--coins/potion/crystal/scroll/key/relic` | Fixed grid atlas crops |
| `sui-money`, `sui-price`, `sui-badge`, `sui-health` | Resource and numerical information |
| `is-selected`, `is-hovered`, `is-pressed`, `:disabled`, `:focus-visible` | Specimen state hooks and real control states |

The `is-hovered` and `is-pressed` hooks display reproducible specimen states; live controls have matching `:hover` and `:active` rules. Use `aria-pressed` for toggle/choice buttons and semantic `disabled` for unavailable actions. Hide decorative repeated art with `aria-hidden`; give meaningful standalone item art an accessible name. Color and glow alone never convey selection.

The board is a component reference, not a behavior harness for final pages. Its action sample only reports activation and its slots demonstrate selection. Implement the domain state contracts in the target project. Check fonts via `document.fonts.ready` before capture; load the page through a local server or an existing preview environment. No network is required after packaging.
