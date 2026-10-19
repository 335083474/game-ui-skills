# Screen and state patterns

All identifiers, dates, interview labels, transcript fragments, and note text below are original fictional demo data. They are not quotes from the game.

## Keyword Search — `search`

Use the invented archive `CASE 08 / SAMPLE INDEX`. Starter clips: `08-A / Morning interview`, excerpt “The blue envelope was still on the desk when I came back.”; `08-B / Follow-up`, excerpt “I remember the station clock; it was already past nine.”; `08-C / Room check`, excerpt “There was a key beside the paper cup.” Search should match terms in the visible title and excerpt. Searching `key` returns only `08-C`; searching `clock` returns `08-B`; an unmatched term shows an explicit empty state. Selecting a result updates the metadata-only media slot and selected ID.

## Clip Library — `clip-library`

Show the same three fictional clips with session label, duration-like display, and available note count. The media surface remains labeled `SIMULATED / NO FOOTAGE`; any “open” or transport affordance updates selection and metadata only. Do not render a fake moving image or claim playback. Let users filter by interview label and pin a clip to the case-note list.

## Case Notes — `case-notes`

Use a compact note list and an editable detail pane. Starter notes: `Envelope on desk` linked to `08-A`; `Clock remembered` linked to `08-B`; `Key by the cup` linked to `08-C`. Editing a note changes only the local prototype state. Keep the source clip ID visible beside every note, and label all notes as user-authored demo text.

## Shared interaction contract

Search, selection, and note linking must use the same three clip IDs. Query results are derived from the supplied sample strings. Clip selection is reversible and changes metadata only. No state implies a real recording, playback, or clue from *Her Story*.

