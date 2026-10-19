'use strict';
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');
const io = require('../data-io.js');
const context = { window: {} };
vm.runInNewContext(fs.readFileSync(path.join(__dirname, '../data.js'), 'utf8'), context);
const sample = JSON.parse(JSON.stringify(context.window.HADES_DRAFT));
const results = [];
function test(name, run) { run(); results.push({ name, status: '通过' }); }
function change(fn) { const copy = JSON.parse(JSON.stringify(sample)); fn(copy); return copy; }
test('valid data normalized without mutating input', () => { const before = JSON.stringify(sample); const result = io.validate(sample); assert.equal(result.schemaVersion, 1); assert.equal(result.version, 'hades-draft-v2.10'); assert.equal(JSON.stringify(sample), before); });
test('JSON export/import content round trip', () => { const result = io.validate(sample); assert.deepEqual(io.parse(JSON.stringify(result)), result); });
test('UTF-8 BOM accepted', () => assert.equal(io.parse('\uFEFF' + JSON.stringify(sample)).title, sample.title));
test('unknown fields ignored and no HTML interpretation in validator', () => { const result = io.validate(change(d => { d.title = '<img src=x>'; d.unused = 'ignored'; })); assert.equal(result.title, '<img src=x>'); assert.equal(result.unused, undefined); });
for (const count of [2, 3, 4]) {
  test(count + ' options validate and round-trip', () => { const value = change(d => { d.options = Array.from({length:count}, (_, i) => ({...d.options[i % 3]})); }); assert.equal(io.parse(JSON.stringify(io.validate(value))).options.length, count); });
  test(count + ' options Home/End and wrap', () => { assert.equal(io.nextIndex(0,'End',count),count-1); assert.equal(io.nextIndex(count-1,'Home',count),0); assert.equal(io.nextIndex(count-1,'ArrowDown',count),0); assert.equal(io.nextIndex(0,'ArrowUp',count),count-1); assert.equal(io.nextIndex(count-1,'ArrowRight',count),0); assert.equal(io.nextIndex(0,'ArrowLeft',count),count-1); });
}
test('counts outside 2–4 rejected', () => { for(const count of [0,1,5]) assert.throws(() => io.validate(change(d => { d.options = Array.from({length:count},()=>d.options[0]); })), /two and four/); });
test('rarity enum enforced', () => assert.throws(() => io.validate(change(d => d.options[0].rarity = 'Legendary')), /Rare or Epic/));
test('schema version enforced', () => assert.throws(() => io.validate(change(d => d.schemaVersion = 2)), /schemaVersion/));
test('empty required title rejected', () => assert.throws(() => io.validate(change(d => d.title = '  ')), /nonempty/));
test('numeric content rejected', () => assert.throws(() => io.validate(change(d => d.options[0].description = 99)), /text/));
test('remote icon URL rejected', () => assert.throws(() => io.validate(change(d => d.options[0].icon = 'https://example.com/a.png')), /local/));
test('path traversal and query rejected', () => { for (const icon of ['components/../a.png', '../a.png', 'components/a.png?x=1']) assert.throws(() => io.validate(change(d => d.options[0].icon = icon)), /local/); });
test('Unicode glyph fallback rejected by shared scene contract', () => assert.throws(() => io.validate(change(d => d.options[0].icon = '★')), /local/));
test('long text preserved for DOM measurement, not character-count rejection', () => assert.equal(io.validate(change(d => d.options[0].description = 'W'.repeat(1000))).options[0].description.length, 1000));
(async () => {
  await assert.rejects(io.readFile({ size: 524289, text: async () => '{}' }), /512 KiB/);
  results.push({ name: 'oversize file rejected before parsing', status: '通过' });
  await assert.rejects(io.readFile(null), /Choose/);
  results.push({ name: 'missing file rejected', status: '通过' });
  const imported = await io.readFile({ size: 1000, text: async () => JSON.stringify(sample) });
  assert.equal(imported.title, sample.title);
  results.push({ name: 'file.text JSON import works with file-like test object', status: '通过' });
  process.stdout.write(JSON.stringify({ scope: 'Node pure-data unit tests only; browser download/file picker/render/focus not exercised', results }, null, 2) + '\n');
})().catch(error => { console.error(error); process.exit(1); });
