# Screen patterns and invented demo state

Every name, route, score, and effect below is invented for this component study. The HTML specimen says so on screen.

## Crew Select — crew-select

Show three distinct crew entries in a short rail and one larger dossier for the pending choice. The dossier can contain a nickname, a short riding style, one accessible symbol, and an active/preview label. Do not rely on color alone to distinguish selected from pending.

Demo entries: Arlo / “line cutter”; Mina / “wall painter”; Jo / “switchback”. Select one entry to preview it. “Lock crew” commits the active crew for this page session. “Cancel” restores the last active member. No selection is saved between page loads.

## City Missions — city-missions

Show a drawn route with three named stops and a clear destination marker. Pair route options with the objective count, demo time window, and a concise route note. Selecting a route updates the path preview; “Tag in” confirms it for the page session. “Cancel route” clears the preview.

Demo route A: North Arcade Switchback, 5 wall tags, 02:40 demo window, narrow roof line. Demo route B: Canal Market Loop, 4 wall tags, 03:10 demo window, broad plaza. These values are illustrative and are not official game content.

## Graffiti Results — graffiti-results

Lead with a score burst and one rank stamp. Show three separate evidence measures: tag coverage, combo continuity, and line style. The measures communicate different run qualities rather than three variants of the same score.

Synthetic result: 82,400 demo points, 5/6 tags, 8-beat combo, “High Line” style, S demo stamp. “Stamp demo result” adds a temporary badge to this page session. “Undo stamp” removes it. Do not claim the score reflects a game formula.

## Interaction contract

Preview state is not committed state. Confirm and cancel buttons must remain separate and clearly named. Use aria-live for the result of a local interaction. Native buttons provide keyboard access; keep focus visible. Reduced-motion users receive the same state change without movement effects.
