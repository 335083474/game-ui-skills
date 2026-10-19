# Screen patterns and synthetic behavior

## Pause (pause)

Use a compact dim veil with a clear PAUSED label, a primary Resume action, and optional links to chapters or controls. Keep the underlying scene visible. Resume closes the pause surface; it must not be coupled to a hidden selection or another action.

## Chapters (chapters)

Lay out a sparse path of named checkpoints. Distinguish completed, current, and unknown chapters through marker shape and short labels. Selecting a checkpoint changes only the preview. A separate Start from checkpoint action commits the chosen destination.

## Context hints (context-hints)

Show one short, situational verb and its key prompt near the relevant edge, for example “Inspect · E”. Do not leave a permanent control legend over the play view. Dismiss is reversible through a Show prompt control in the specimen.

## Synthetic contract

demo-state.json contains invented chapter labels and hint text. Treat it as a fixture, not as an actual LIMBO save or canonical chapter list. Keep preview and committed values separate. Do not silently move the player, resume gameplay, or alter saved progress.

## Observable behavior

- All actions are native keyboard-accessible buttons with visible focus.
- Selecting a chapter updates its marker and status text, but does not start it.
- Starting a checkpoint has a named confirmation action.
- Dismissing a hint hides it; Show prompt restores it.
- Reduced motion removes fades and ambient effects while keeping state changes visible in text.

