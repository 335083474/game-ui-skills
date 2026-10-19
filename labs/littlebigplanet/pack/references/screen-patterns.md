# Approved screen patterns

These are layout grammars for three player tasks. Use actual game content and data when composing a requested screen; the component page is only a specimen board.

## sticker-book

Treat the book as an open craft surface with a visible binding edge. Group stickers by material or earned set, keep cutout silhouettes distinct, and show locked, selected, and placed states with both outline and label. Selection previews placement. A named action such as “Place sticker” commits it; provide undo or removal after placement. On mobile, use one scrollable page at a time and keep the selected sticker tray reachable.

## costume-workbench

Make the character or costume silhouette the focus, with one small set of fabric swatches beside it. Show the currently worn piece, the previewed piece, and unavailable options separately. Previewing never changes the outfit. “Apply costume” is the explicit commit, with clear confirmation and a reversible way back. Avoid a dense inventory grid that hides the character.

## level-pods

Present pods as chunky cardboard destinations with a readable title, completion marker, and one short status. Use a small spatial row or shelf rather than equal dashboard cards. A pod may be highlighted while browsing, but launching or pinning it must be a separate explicit action. Keep progress and online/community status as distinct fields; do not invent network state.
