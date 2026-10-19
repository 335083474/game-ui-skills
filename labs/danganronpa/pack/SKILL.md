---
name: danganronpa-ui
description: Create original black-white-pink mystery trial interfaces with slanted testimony, evidence shots, a rotating roundtable index, and rapid contradiction feedback. Use for the first PC game's trial direction, not Ace Attorney courtroom consoles.
---

# Pop-trial interface reference

Use the selected **Danganronpa: Trigger Happy Havoc first PC version** direction for original handbook, evidence, and debate screens. This is an experimental design interpretation, not an official Spike Chunsoft pack or a pixel-exact recreation.

Read [visual-rules.md](references/visual-rules.md), [tokens.json](references/tokens.json), and the relevant part of [screen-patterns.md](references/screen-patterns.md). Inspect the original graphic student portrait in [student-portrait.png](assets/student-portrait.png) and the individual editable specimens in [components/index.html](assets/components/index.html). These components are not a finished trial screen.

Build the grammar from hard black / white contrast, hot-pink accents, clipped geometry, angled statement strips, a roundtable navigation motif, and evidence tokens that can be selected then matched to a claim. Rapid feedback is part of the style, but every action must remain readable and recoverable. A highlighted claim and selected evidence are separate states. Do not flatten this into the calm two-pane witness/evidence desk used by the Ace Attorney package.

Use [student handbook](references/screen-patterns.md#student-handbook), [evidence locker](references/screen-patterns.md#evidence-locker), and [trial debate](references/screen-patterns.md#trial-debate) as the three output contracts. Keep one synthetic class investigation consistent. Never copy existing character designs, phrases, screenshots, logos, or mascot imagery. See [sources.md](references/sources.md) for edition and research limits.

Use [USAGE.md](USAGE.md) for a copy-ready request. The portrait is original generated art; the package includes no fonts or official game files. Keep finished screens and browser evidence outside this frozen package.

## Rendered component reference

Inspect [component-board.png](references/images/component-board.png), the actual browser rendering of the editable primitives. This is a component reference; compose the requested screens independently.
