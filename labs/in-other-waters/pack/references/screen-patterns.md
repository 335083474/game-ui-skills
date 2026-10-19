# Screen and state patterns

Every coordinate, organism label, sample value, route, heading, and observation below is invented demo content. These are not recorded game data or biological facts.

## Scanner — `scanner`

Build a radial instrument around `SECTOR 03 / DEPTH 42 m`. Start heading at `064°`; show one yellow survey route and three cyan returns. The returns are `R-01 / ridge`, `R-02 / moving speck`, and `R-03 / hollow`. Selecting a return updates its text label and a small synthetic coordinate. A local “mark return” control may toggle a note state, but must not claim a real scan or completed traversal.

## Specimen Catalog — `specimen-catalog`

Use three original entries: `S-01 / Ribbon glider`, `S-02 / Glass cup`, and `S-03 / Dapple float`. Each has a distinct simple vector mark, an observation tag, and one editable note. Example observation for S-03: `Pale edge response; shape not classified.` Add an explicit `FICTIONAL SAMPLE / NOT TAXONOMY` label. Selection changes the card and highlight, not the underlying data.

## Field Log — `field-log`

Show three short ordered records: `08:12 / (03,11) / Cyan return behind the shelf.`; `08:19 / (04,12) / Ellery's suit marker moved east.`; `08:26 / (05,13) / Route ended at an uncharted contour.` Label times and coordinates as demo state. Separate what was observed from the accompanying invented note or interpretation.

## Shared interaction contract

Reuse the same sector, heading, sample IDs, and local route across all three screens. Selecting a scan return highlights its matching map mark and specimen card if applicable. Every value remains visibly synthetic; no interaction implies a scientifically valid reading or a real game save.

