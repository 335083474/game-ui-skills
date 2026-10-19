// Dependency-free state checks. This is a small DOM stub, not browser QA.
const fs = require('node:fs');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const path = require('node:path');
const html = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');
const source = fs.readFileSync(path.join(__dirname, 'app.js'), 'utf8');
let assertions = 0;
const check = (actual, expected) => { assert.deepEqual(actual, expected); assertions++; };
class Element {
  constructor(tag = 'div') { this.tag = tag; this.children = []; this.handlers = {}; this.attrs = {}; this.dataset = {}; this.classNames = new Set(); this.textContent = ''; this.value = ''; this.checked = false; this.disabled = false; this.hidden = false; this.classList = { toggle: (name, force) => { if (force) this.classNames.add(name); else this.classNames.delete(name); } }; this.style = { setProperty() {} }; }
  addEventListener(type, fn) { (this.handlers[type] ??= []).push(fn); }
  append(...children) { this.children.push(...children); }
  replaceChildren(...children) { this.children = children; }
  setAttribute(name, value) { this.attrs[name] = value; }
  removeAttribute(name) { delete this.attrs[name]; }
  focus() { this.focused = true; }
  trigger(type) { if (this.disabled) return; for (const fn of this.handlers[type] ?? []) fn({ preventDefault() {} }); }
}
function boot(storage, hash = '#dialogue', failWrites = false) {
  const nodes = {};
  for (const match of html.matchAll(/id="([^"]+)"/g)) nodes[match[1]] = new Element();
  const nav = ['dialogue', 'settings'].map(route => { const el = new Element('a'); el.dataset.route = route; return el; });
  const document = { getElementById: id => nodes[id], createElement: tag => new Element(tag), querySelectorAll: () => nav, body: new Element('body'), title: '' };
  const location = { hash };
  const events = {};
  vm.runInNewContext(source, { document, location, localStorage: { getItem: key => storage[key] ?? null, setItem: (key, value) => { if (failWrites) throw new Error('storage blocked'); storage[key] = value; } }, window: { addEventListener: (name, fn) => { events[name] = fn; } } });
  return { nodes, document, nav, location, events };
}
const storage = {};
const app = boot(storage);
let n = app.nodes;
check(n.choices.children.length, 3);
check(n['dialogue-back'].disabled, true);
const endings = new Set();
for (let index = 0; index < 3; index++) {
  n.choices.children[index].trigger('click');
  check(n['chapter-label'].textContent, 'A different thread');
  check(n.speech.focused, true);
  n.choices.children.find(el => el.tag === 'button').trigger('click');
  check(n['chapter-label'].textContent, 'Conversation complete');
  endings.add(n['speech-text'].textContent);
  n.choices.children[0].trigger('click');
  check(n.choices.children.length, 3);
}
check(endings.size, 3);
n.choices.children[1].trigger('click'); n['dialogue-back'].trigger('click'); check(n.choices.children.length, 3);
n.choices.children[2].trigger('click'); n['dialogue-restart'].trigger('click'); check(n.choices.children.length, 3);
app.location.hash = '#settings'; app.events.hashchange(); check(n.settings.hidden, false); check(n.dialogue.hidden, true); check(app.nav[1].attrs['aria-current'], 'page');
n.volume.value = '31'; n['large-text'].checked = true; n['reduce-motion'].checked = true; n['settings-form'].trigger('input');
check(app.document.body.classNames.has('large-text'), true); check(app.document.body.classNames.has('reduce-motion'), true); check(n['save-state'].textContent, 'Unsaved preview');
n['settings-form'].trigger('submit'); check(n['save-state'].textContent, 'Saved');
const reload = boot(storage, '#settings'); n = reload.nodes; check(n.volume.value, 31); check(n['large-text'].checked, true); check(n['reduce-motion'].checked, true); check(reload.document.body.classNames.has('large-text'), true);
n.volume.value = '99'; n['large-text'].checked = false; n['reduce-motion'].checked = false; n['settings-form'].trigger('input'); n['cancel-settings'].trigger('click');
check(n.volume.value, 31); check(n['large-text'].checked, true); check(n['reduce-motion'].checked, true); check(n['save-state'].textContent, 'Saved');
n['restore-defaults'].trigger('click'); check(n.volume.value, 70); check(n['large-text'].checked, false); check(n['reduce-motion'].checked, false); check(n['save-state'].textContent, 'Unsaved preview');
check(boot(storage).nodes.volume.value, 31);
n['cancel-settings'].trigger('click'); check(n.volume.value, 31);
n['restore-defaults'].trigger('click'); n['settings-form'].trigger('submit');
check(boot(storage).nodes.volume.value, 70); check(boot(storage).nodes['large-text'].checked, false);
const blocked = boot({}, '#settings', true); blocked.nodes.volume.value = '15'; blocked.nodes['settings-form'].trigger('input'); blocked.nodes['settings-form'].trigger('submit');
check(blocked.nodes['save-state'].textContent, 'Unsaved preview'); check(blocked.nodes['settings-status'].textContent.includes('Could not save'), true);
const malformed = boot({ 'ember-archive.run02.preferences.v1': '{broken' }); check(malformed.nodes.volume.value, 70);
const invalidValues = boot({ 'ember-archive.run02.preferences.v1': JSON.stringify({ volume: 400, largeText: 'yes', reduceMotion: null }) }); check(invalidValues.nodes.volume.value, 100); check(invalidValues.nodes['large-text'].checked, false);
console.log(JSON.stringify({ result: 'PASS', assertions, scope: 'Node VM with minimal DOM stub; no real browser, layout, accessibility tree, or actual browser persistence verified' }, null, 2));
