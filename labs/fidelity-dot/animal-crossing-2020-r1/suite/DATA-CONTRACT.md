# Data contracts
Version: ACNH-suite-candidate-0.1
All text length limits count JavaScript UTF-16 code units, not graphemes.
Unknown object fields, duplicate IDs and invalid ranges are rejected before state replacement.
Only JSON is imported. Strings are rendered as text, never interpreted as markup.
Pockets and Shop use different schemas; importing one into the other is invalid.

## Pockets (frozen implementation)
Exact root fields:schemaVersion,version,selectedId,items.
schemaVersion=1; version="ACNH-pockets-v0.1" even though implementation isv0.3.
items length0..40.
Exact item fields:id,slot,name,icon,quantity,dimmed,description.
id:string matching /^[A-Za-z0-9][A-Za-z0-9_-]{0,39}$/, unique.
slot:unique integer0..39.
name:string0..300; description:string0..20000.
quantity:integer0..9999. dimmed:boolean.
icon:string in scorpion,shovel,axe,slingshot,wateringCan,fishingRod,ladder,net.
selectedId:null or syntactically valid ID.
After validation, items sort by slot. A missing/disabled selected item falls back to the
first enabled item; if none exists, selectedId becomes null.
Empty/all-dimmed collections disable selection/Confirm and hide the pointer/name.
Pockets Confirm is a demonstration action, not Shop monetary arithmetic.
Read the frozen source for its exact existing JSON file-size handling.

Minimal valid empty input:
{"schemaVersion":1,"version":"ACNH-pockets-v0.1","selectedId":null,"items":[]}

## Shop
Exact root fields:
schemaVersion,version,category,speaker,balance,dialogue,products,selectedId,
options,selectedOptionId,phase,receipt.
schemaVersion=1; version="ACNH-shop-v0.1".
category/speaker:nonblank strings1..300.
dialogue:string0..20000.
balance:safe integer0..999999999.
products:array1..8. Zero products intentionally unsupported in this purchase screen.
Exact product fields:id,name,icon,unitPrice,owned,description.
id:same pattern as Pockets, unique among products.
name:nonblank string1..300.
description:string0..20000.
icon:STRING kit,seed or sapling; arrays/raw paths/URLs rejected.
unitPrice:safe integer0..999999; owned:safe integer0..999999.
selectedId:valid ID that must refer to an existing product.
Deleting the selected product requires selecting another in the same import.

options:array2..4, with exactly one cancel and1..3 buy options.
Exact option fields:id,kind,label,quantity.
id:unique among options, same ID pattern.
kind:"buy" or "cancel".
label:nonblank string1..300.
buy quantity:integer1..99; cancel quantity:exactly0.
selectedOptionId:valid ID that must exist in options.
The cancel position is not hardcoded: its kind controls cancellation.
Deleting the selected option requires updating selectedOptionId in the same import.
A fifth option is rejected, not silently hidden.

phase:"choosing","purchased" or "cancelled".
receipt:null for choosing/cancelled; an exact object for purchased:
productId,quantity,unitPrice,total,before,after.
Receipt productId must exist; quantity1..99; unitPrice0..999999;
total0..98999901; before/after0..999999999; all safe integers.
Required arithmetic:total=quantity*unitPrice; after=before-total; after=balance.
Receipt is a local explanatory record, not signed proof of payment or anti-tamper storage.
Product's current unitPrice may differ from a historical receipt's unitPrice after editing.

Import limits:source text<=500000 UTF-16 units; uploaded file<=2000000 bytes.
No arbitrary dynamic image fetch. A schema-valid named token can still fail if its bundled
file is missing; this reports a missing-image diagnostic, not successful image rendering.

## Shop transition rules
Choosing+buy:
- Derive cost from current product price × requested quantity; never trust displayed label.
- Insufficient balance or owned+quantity>999999: no balance/owned mutation, remain choosing.
- Otherwise atomically subtract, increment owned, record receipt, enter purchased.
- Hide choices and disable bottom Cancel/Select; focus the outside Open purchase choices button.
- Repeated input does not execute another buy unless a new choice is explicitly opened.

Choosing+cancel:
- Balance/owned unchanged; receipt null; enter cancelled.
- Focus Open purchase choices.

Open purchase choices or explicit shelf selection:
- Enter choosing, clear old receipt, select first buy option, preserve balance/owned.
- Selecting a shelf product changes selectedId.
- This is the user's explicit new transaction action; no automatic repurchase.

Enter/Space:
- Native button semantics, including cancel.
- Arrows/Home/End only move focus/selection inside the choice list.
- Escape within the stage cancels an active choice, except while native full-text dialog is open.
- Editors are outside the stage, so ordinary typing does not buy/cancel.

## Editable complete example (one product, two choices)
{
 "schemaVersion":1,
 "version":"ACNH-shop-v0.1",
 "category":"Miscellaneous",
 "speaker":"Timmy",
 "balance":29729,
 "dialogue":"I can sell in singles or in bulk.\nHow many would you like?",
 "products":[{"id":"kit","name":"Customization kit","icon":"kit","unitPrice":600,"owned":0,"description":"Demonstration kit."}],
 "selectedId":"kit",
 "options":[
  {"id":"one","kind":"buy","label":"Just 1.","quantity":1},
  {"id":"cancel","kind":"cancel","label":"I've changed my mind.","quantity":0}
 ],
 "selectedOptionId":"one",
 "phase":"choosing",
 "receipt":null
}

Expected buy outcome:balance29129, owned1, phase purchased;
receipt={"productId":"kit","quantity":1,"unitPrice":600,"total":600,"before":29729,"after":29129}.
Expected cancel outcome:balance29729, owned0, phase cancelled, receipt null.

## Boundary tests (specified; Shop not producer-executed)
Accept1/8 products and2/3/4 choices; reject0/9 products and1/5 choices.
Accept name/category/speaker/label300, descriptions/dialogue20000, declared maxima.
Reject301/20001, floats/negative numeric fields, icon array, duplicate IDs,
extra root/item/option fields, missing selected IDs, invalid receipt arithmetic and bad JSON.
Failed import preserves prior state. Importing a short valid record should clear overflow
diagnostics after rendering; full original values must remain in export.
Test successful and insufficient purchases, cancellation by mouse/Enter/Space,
full-text Escape focus return, actual minimum viewport and portrait suspension.
