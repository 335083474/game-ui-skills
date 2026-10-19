'use strict';
const $ = id => document.getElementById(id);
let data;
let selected = 0;
function el(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}
function status(message) { $('event-log').textContent = message; }
function render() {
  selected = Math.max(0, Math.min(selected, data.options.length - 1));
  $('heading').textContent = data.title;
  $('subtitle').textContent = data.subtitle;
  $('options').replaceChildren();
  data.options.forEach((option, index) => {
    const button = el('button', 'row ' + option.rarity.toLowerCase());
    button.type = 'button';
    button.setAttribute('role', 'option');
    button.setAttribute('aria-selected', String(index === selected));
    button.setAttribute('aria-label', [option.title, option.rarity, option.description, option.stat].join(', '));
    button.tabIndex = index === selected ? 0 : -1;
    const base = el('img', 'base'); base.src = 'components/neutral-row-v27.png'; base.alt = '';
    const symbol = el('span', 'symbol'); symbol.setAttribute('aria-hidden', 'true');
    const icon = el('img', 'boon-icon'); icon.src = option.icon; icon.alt = '';
    icon.onerror = () => { button.dataset.assetError = 'true'; status('Missing local icon: ' + option.icon); };
    symbol.append(icon);
    const content = el('span', 'text');
    const line = el('span', 'title-line');
    line.append(el('span', 'title-name', option.title), el('span', 'rarity-label', option.rarity));
    content.append(line, el('p', 'description', option.description), el('span', 'stat', option.stat));
    const wedge = el('span', 'rarity-wedge'); wedge.setAttribute('aria-hidden', 'true');
    const overlay = el('img', 'base selection-art'); overlay.src = 'components/selection-overlay-v27.png'; overlay.alt = '';
    const warning = el('span', 'overflow-note'); warning.hidden = true;
    button.append(base, wedge, symbol, content, overlay, warning);
    function select(next) {
      selected = next; render();
      document.querySelectorAll('#options .row')[selected].focus();
      status('Selected ' + data.options[selected].title);
    }
    button.onclick = () => select(index);
    button.onkeydown = event => {
      if (['ArrowDown', 'ArrowRight', 'ArrowUp', 'ArrowLeft', 'Home', 'End'].includes(event.key)) {
        event.preventDefault();
        select(HadesDataIO.nextIndex(selected, event.key, data.options.length));
      } else if (event.key === 'Enter') { event.preventDefault(); showDetails(true); }
    };
    $('options').append(button);
  });
  const option = data.options[selected];
  $('detail').replaceChildren(el('h3', '', option.title), el('p', '', option.rarity),
    el('p', '', option.description), el('p', 'stat', option.stat));
  [...$('edit-option').options].forEach((node, index) => { node.textContent = data.options[index].title; });
  $('add-option').disabled = data.options.length >= 4;
  $('remove-option').disabled = data.options.length <= 2;
  $('option-count').textContent = data.options.length + ' options (allowed: 2–4)';
  HadesOverflow.observe(document);
}
function showDetails(details) {
  $('screen-select').hidden = details;
  $('screen-detail').hidden = !details;
  status(details ? 'Opened ' + data.options[selected].title : 'Showing boon selection');
  if (details) $('back').focus();
  else document.querySelectorAll('#options .row')[selected].focus();
  HadesOverflow.schedule();
}
function fillEditor() {
  $('edit-heading').value = data.title;
  $('edit-subtitle').value = data.subtitle;
  const option = data.options[Number($('edit-option').value) || 0];
  for (const field of ['title', 'icon', 'description', 'stat', 'rarity']) {
    $('edit-' + field).value = option[field];
    $('edit-' + field).setCustomValidity('');
  }
}
function replaceData(next) {
  data = HadesDataIO.validate(next);
  selected = 0;
  $('edit-option').replaceChildren();
  data.options.forEach((option, index) => {
    const node = el('option', '', option.title); node.value = index; $('edit-option').append(node);
  });
  fillEditor(); render();
}
function commit(input, update) {
  try {
    const next = JSON.parse(JSON.stringify(data));
    update(next);
    data = HadesDataIO.validate(next);
    input.setCustomValidity('');
    render();
    status('Edited in this page only. Export JSON, then import it in the assembled scene.');
  } catch (error) {
    input.setCustomValidity(error.message);
    status('Edit not applied: ' + error.message);
  }
}
$('add-option').onclick = () => {
  if (!data || data.options.length >= 4) return;
  const next = JSON.parse(JSON.stringify(data));
  next.options.push({title: 'New boon', rarity: 'Rare', description: 'Describe this boon.', stat: '+10%', icon: 'components/icon-haste-ref.png'});
  replaceData(next);
  $('edit-option').value = String(data.options.length - 1);
  fillEditor();
  $('edit-title').focus();
  status('Added option. Export JSON to save or transfer.');
};
$('remove-option').onclick = () => {
  if (!data || data.options.length <= 2) return;
  const index = Number($('edit-option').value);
  const next = JSON.parse(JSON.stringify(data));
  next.options.splice(index, 1);
  replaceData(next);
  $('edit-option').value = String(Math.min(index, data.options.length - 1));
  fillEditor();
  $('edit-option').focus();
  status('Removed option. Export JSON to save or transfer.');
};
$('edit-heading').oninput = event => commit(event.target, next => { next.title = event.target.value; });
$('edit-subtitle').oninput = event => commit(event.target, next => { next.subtitle = event.target.value; });
$('edit-option').onchange = fillEditor;
for (const field of ['title', 'icon', 'description', 'stat', 'rarity']) {
  $('edit-' + field).oninput = event => commit(event.target, next => {
    next.options[Number($('edit-option').value)][field] = event.target.value;
  });
}
$('editor-import').onchange = async event => {
  try { replaceData(await HadesDataIO.readFile(event.target.files[0])); status('Imported JSON into this editor. Export to save subsequent edits.'); }
  catch (error) { status('Import rejected: ' + error.message); }
  finally { event.target.value = ''; }
};
$('editor-export').onclick = () => {
  try { HadesDataIO.download(data); status('Export requested: hades-scene-data.json. Import that file in scene.html.'); }
  catch (error) { status('Export failed: ' + error.message); }
};
$('long-text').onclick = () => {
  if (!data) { status('Import valid JSON before running this test.'); return; }
  data.options[Number($('edit-option').value)].description = 'This deliberately long description tests actual layout overflow while keeping complete text available in details. '.repeat(7);
  fillEditor(); render();
};
$('selection-view').onclick = () => showDetails(false);
$('details-view').onclick = () => showDetails(true);
$('back').onclick = () => showDetails(false);
try { replaceData(window.HADES_DRAFT); }
catch (error) { status('Invalid data.js: ' + error.message + '. Import valid JSON to recover.'); }
