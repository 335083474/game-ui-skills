# Screen patterns

Use one invented case, witness, three exhibits, and episode index across the screens. These are layout and behavior contracts, not finished screens.

## Evidence file

Present a case-record index with stable exhibit IDs and short titles. Selecting an exhibit opens a detail sheet with source, date, visible evidence facts, and optional original image. The user can return to the same list position. A cross-reference or attach action is explicit and never silently edits testimony. Keep unknown facts labeled unknown; a blank field is not a match. If an exhibit can be presented during testimony, show its compatible statement only after that statement is selected.

Synthetic example: Exhibit E-03 “Wet Station Ticket,” found near a fictional north pier; recorded time 21:10. This supports one invented testimony phrase about a departure, but does not itself prove guilt.

## Cross-examination

Use a persistent witness name strip and a statement sequence with one clearly active line. Include `PRESS` for an elaboration and `PRESENT` for opening the evidence file. Press keeps the current statement selected and appends or reveals one follow-up. Presenting opens an exhibit chooser, requires a second submit action, and returns to the same statement on cancel. On a contradiction, state the conflicting exhibit and field in plain text; on a non-contradiction, show a recoverable response and keep the case state stable. Do not auto-advance on hover or on opening the record.

Synthetic example: The witness says a ferry left before 21:00. E-03 records a station ticket at 21:10; the demo labels this “timeline conflict” without implying a real investigation result.

## Episode selection

Represent episodes as a numbered sequence or case file index. Each row shows a title, status, and one small premise line. A selected episode has an explicit continue button; locked episodes expose a textual reason. Completed episodes remain revisitable without changing evidence or case state. The index may scroll, but the current selection and progress remain in view. Avoid arbitrary thumbnails or large equal-size tiles that hide chronological order.

Synthetic example: Case 01 “The Night Ferry” is open; Case 02 “A Quiet Archive” is locked until the first case is completed. Both titles are invented.
