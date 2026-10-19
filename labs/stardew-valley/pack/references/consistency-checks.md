# Acceptance checks

## Reference fidelity

- Both approved images have been viewed, and the result has been compared with the rendered specimens.
- Wood has an outer dark edge, warm bevel and lower depth; paper is warm cream; primary actions are amber; dark brown is the dominant text color.
- Scenery reads as a calm farm setting. No CRT, poker emblems, neon, glossy app cards or full-reference-image background appears.
- Fonts, frame construction, slot treatment, quantity placement and selection marker match across screens. The three screen silhouettes differ for their task.
- All six atlas cells show the intended isolated item, with transparency, no neighboring object and no baked labels. Inspect over cream and green surfaces.

## Editable implementation

- All names, quantities, effects, prices and status labels are DOM text or state data. No functional label is embedded in a screenshot.
- The output uses local font/image paths and works with the project's supported local serving method. No CDN is required by the package.
- Main action targets are at least 44px; keyboard navigation has visible focus; selected and disabled states include text or a marker.
- At desktop width 1280px and narrow width 390px, text remains readable, no horizontal page overflow occurs, and the main action is reachable. Inspect long translated names too.

## Behavior evidence for an interactive family

| Test | Expected result |
|---|---|
| Confirm without a reward selection | Disabled; reason shown. |
| Select, then claim a reward, then try again | One effect applied once; subsequent claim unavailable. |
| Use one potion below max HP | Quantity decreases by one; HP rises by heal amount, capped at maxHP. |
| Use potion near max HP | HP stops at maxHP; exactly one potion consumed. |
| Try at full HP or zero potions | Disabled with reason; quantity unchanged. |
| Buy with enough coins and available stock | Exact cost deducted; stock down and inventory up by the quantity. |
| Buy with insufficient coins or no stock | Text reason shown; balances and inventory unchanged. |
| Repeated rapid clicks | No negative quantities, negative coins or duplicate reward. |
| Inspect farm tools | Quantity and intended use clear; no unimplemented farming action advertised as working. |

Record viewport, tested actions and actual results. A component-board screenshot proves visual rendering only; it does not prove reward, inventory or shop behavior. A Web pass does not validate a game engine, Figma implementation, asset licensing for a specific commercial release or live backend.
