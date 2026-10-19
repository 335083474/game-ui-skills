# Evidence data contract v1
Runtime version: AA2019-editable-v0.4

## Exact JSON shape
Top-level fields, all required:
- schemaVersion: integer1
- version: exact string AA2019-editable-v0.4
- selectedId: null or an ID matching the item-ID format
- items: array with0–10 entries

Each item has exactly these four fields:
- id: unique string matching ^[A-Za-z0-9][A-Za-z0-9_-]{0,39}$
- name: string, maximum300 UTF-16 code units
- icon: badge | statue | shards | note | phone | envelope
- description: string, maximum20000 UTF-16 code units

Unknown and missing fields are rejected. Duplicate IDs are rejected.
Numbers, arrays and null are not accepted in text fields.
Text may be empty and is rendered through textContent.
No HTML evaluation or arbitrary asset URLs are supported.

## Selection normalization
Empty items always normalizes selectedId to null.
With nonempty items, a selectedId found in items is retained.
A syntactically valid but absent selectedId, or null, selects the first item.
The UI reports this normalization explicitly. It is not a corrupt import.

Removing the selected item chooses the item now at the same array position;
removing the last item chooses its previous neighbor.
Removing the final item makes the collection empty and focuses Add evidence.
0 items never enters a modulo operation.

## Atomic validation
The complete candidate is validated and copied before changing runtime state.
Any validation/parse failure preserves current items and selectedId.
The rejected JSON remains in the text editor for correction.
A selected-item edit also validates a complete candidate before commit.

File import maximum:2,000,000 bytes.
Text parser maximum:1,000,000 UTF-16 code units.
Only the most recently started file read is accepted; a text import supersedes
a pending file read. No server upload occurs in this UI.

The file-size limits exceed the expected valid10-item text payload, but are
explicit limits rather than a promise to import arbitrary files.

## Working examples
Empty:
{"schemaVersion":1,"version":"AA2019-editable-v0.4","selectedId":null,"items":[]}

One item:
{"schemaVersion":1,"version":"AA2019-editable-v0.4","selectedId":"phone-1","items":[{"id":"phone-1","name":"Phone","icon":"phone","description":"Editable full description."}]}

Six items: use the supplied evidence-data.js initial object.
Ten items: start from that object, add four entries with distinct IDs and
approved icon keys, then import. The ten slots stay on the same rail.
Eleven entries: reject; do not truncate silently.

Selection disappearing:
Import the one-item example with selectedId changed to badge.
It is a valid ID absent from items, so selection becomes phone-1 with a message.

Invalid examples:
- icon:"../private.svg" or icon:"https://example.com/a.png": reject
- duplicate id values: reject
- name with301 code units: reject
- description with20001 code units: reject
- schemaVersion2, missing version, or a v0.3 document: reject
- items as a string, malformed JSON, or extra path field: reject

## Editing defaults and migration
Edit evidence-data.js to change startup data. Keep the assignment to
window.AA_EVIDENCE_DATA and preserve valid JavaScript syntax.
For ordinary users, use Load current JSON, edit, Import JSON, then Export JSON.
Import changes the live page; it does not overwrite evidence-data.js.
Reload restores the startup file. There is no implicit local/cloud save.

The older v0.3 export shape used numeric selected and no schemaVersion.
It is deliberately not auto-imported. To migrate, construct the exact v1
shape and convert the old selected index to that item's ID, or null if empty.
Do not silently treat an incompatible document as current data.

## Acceptance still required
Receiver should test0,1,6,10 items and rejection of11; empty-key handling;
deleting first/middle/last/final items; import with missing selected item;
keyboard focus after valid/invalid import; long text and icon replacement;
real JSON download and reload behavior.
These are test requirements, not producer-executed results.