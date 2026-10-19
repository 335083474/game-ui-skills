# Visual rules

## Atmosphere and hierarchy

Use deep charcoal silhouettes against layered smoke-gray fog. Keep the center and lower-middle of a live play view open. Treat broken machinery and trees as distant shapes, not decorative UI icons. Place text on a small opaque charcoal backing only when the current scene would otherwise reduce contrast.

The interface should feel nearly absent during movement. At most, show one contextual prompt at the edge. Pause and chapter surfaces may add structure, but they should still leave the scene recognizable behind them.

## Palette and typography

Use the values in tokens.json. Bright gray-white marks focus and current state; mist gray carries secondary information. Avoid pure white fields, color-coded state without labels, bright accent colors, and heavy bevels.

Use a local system sans for controls and a local system serif only for short chapter titles. Keep long labels in the sans. Use spacing and thin rules for grouping instead of dashboard cards. No remote font is required.

## State and input

Show current, completed, and undiscovered chapter states with a label or distinct shape as well as contrast. Selecting a chapter is a preview; starting at a checkpoint requires an explicit action. A dismissed context hint stays hidden until the user asks to show it again. Never imply that a specimen action changed a real save.

Use semantic buttons, a stable keyboard order, visible focus, live status feedback after an action, and at least 44 CSS pixels for touch controls. Reduce motion by default when requested by the operating system.

