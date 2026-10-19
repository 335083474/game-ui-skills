'use strict';
const $ = id => document.getElementById(id);
let data;
let selected = 0;
let returnFocus = null;
const panel = $('notes-panel');
const outsideRegions = [$('scene-toolbar'), $('scene-container')];

function el(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}
function focusableInsidePanel() {
  return [...panel.querySelectorAll('button,a[href],input,select,textarea,[tabindex]')]
    .filter(node => !node.disabled && node.tabIndex >= 0 && !node.hidden && node.getClientRects().length);
}
function openNotes() {
  if (!panel.hidden) return;
  returnFocus = document.activeElement;
  panel.hidden = false;
  outsideRegions.forEach(region => { region.inert = true; });
  $('toggle-notes').setAttribute('aria-expanded', 'true');
  $('close-notes').focus();
}
function closeNotes() {
  if (panel.hidden) return;
  panel.hidden = true;
  outsideRegions.forEach(region => { region.inert = false; });
  $('toggle-notes').setAttribute('aria-expanded', 'false');
  const previousStillUsable = returnFocus && returnFocus.isConnected && !returnFocus.closest('[hidden]');
  (previousStillUsable ? returnFocus : $('toggle-notes')).focus();
  returnFocus = null;
}
function announce(message) { $('scene-state').textContent = message; }
function select(index, restoreRowFocus = true) {
  selected = index;
  render();
  if (restoreRowFocus) document.querySelectorAll('#scene-options .row')[selected].focus();
  announce('Selected ' + data.options[selected].title);
}
function render() {
  selected = Math.max(0, Math.min(selected, data.options.length - 1));
  document.querySelector('.scene').dataset.optionCount = String(data.options.length);
  $('scene-title').textContent = data.title;
  $('scene-subtitle').textContent = data.subtitle;
  $('scene-options').replaceChildren();
  data.options.forEach((option, index) => {
    const button = el('button', 'row ' + option.rarity.toLowerCase());
    button.type = 'button';
    button.setAttribute('role', 'option');
    button.setAttribute('aria-selected', String(selected === index));
    button.setAttribute('aria-label', [option.title, option.rarity, option.description, option.stat].join(', '));
    button.tabIndex = index === selected ? 0 : -1;
    const base = el('img', 'base');
    base.src = 'components/neutral-row-v27.png';
    base.alt = '';
    const symbol = el('span', 'symbol');
    symbol.setAttribute('aria-hidden', 'true');
    const icon = el('img', 'boon-icon');
    icon.src = option.icon;
    icon.alt = '';
    icon.onerror = () => { button.dataset.assetError = 'true'; announce('Missing local icon: ' + option.icon); };
    symbol.append(icon);
    const content = el('span', 'text');
    const title = el('span', 'title-line');
    title.append(el('span', 'title-name', option.title), el('span', 'rarity-label', option.rarity));
    content.append(title, el('p', 'description', option.description), el('span', 'stat', option.stat));
    const wedge = el('span', 'rarity-wedge');
    wedge.setAttribute('aria-hidden', 'true');
    const overlay = el('img', 'base selection-art');
    overlay.src = 'components/selection-overlay-v27.png';
    overlay.alt = '';
    const warning = el('span', 'overflow-note');
    warning.hidden = true;
    button.append(base, wedge, symbol, content, overlay, warning);
    button.onclick = () => select(index);
    button.onkeydown = event => {
      if (['ArrowDown', 'ArrowRight', 'ArrowUp', 'ArrowLeft', 'Home', 'End'].includes(event.key)) {
        event.preventDefault();
        const next = HadesDataIO.nextIndex(selected, event.key, data.options.length);
        select(next);
      } else if (event.key === 'Enter') {
        event.preventDefault();
        announce('Confirmed ' + data.options[selected].title + ' (prototype state only)');
      }
    };
    $('scene-options').append(button);
  });
  const option = data.options[selected];
  $('tooltip-title').textContent = option.title;
  $('tooltip-text').textContent = option.description;
  $('scene-full-text').replaceChildren(
    el('h3', '', data.title), el('p', '', data.subtitle),
    el('h3', '', option.title), el('p', '', option.rarity),
    el('p', '', option.description), el('p', 'stat', option.stat));
  HadesOverflow.observe(document);
}

$('scene-rules').replaceChildren(...window.HADES_RUNTIME_RULES.map(rule => el('li', '', rule)));
$('toggle-notes').onclick = openNotes;
$('close-notes').onclick = closeNotes;
panel.addEventListener('keydown', event => {
  if (event.key !== 'Tab') return;
  const nodes = focusableInsidePanel();
  if (!nodes.length) { event.preventDefault(); panel.focus(); return; }
  const first = nodes[0], last = nodes[nodes.length - 1];
  if (event.shiftKey && (document.activeElement === first || !panel.contains(document.activeElement))) {
    event.preventDefault(); last.focus();
  } else if (!event.shiftKey && (document.activeElement === last || !panel.contains(document.activeElement))) {
    event.preventDefault(); first.focus();
  }
});
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && !panel.hidden) { event.preventDefault(); closeNotes(); }
});
document.addEventListener('focusin', event => {
  if (!panel.hidden && !panel.contains(event.target)) $('close-notes').focus();
});
$('scene-import').onchange = async event => {
  try {
    const imported = await HadesDataIO.readFile(event.target.files[0]);
    data = imported;
    selected = 0;
    render();
    announce('Imported JSON into this page only. Export JSON to preserve or move these edits.');
  } catch (error) { announce('Import rejected: ' + error.message); }
  finally { event.target.value = ''; }
};
$('scene-export').onclick = () => {
  try { HadesDataIO.download(data); announce('Export requested: hades-scene-data.json'); }
  catch (error) { announce('Export failed: ' + error.message); }
};
$('scene-long').onclick = () => {
  if (!data) { announce('Import valid JSON before running this test.'); return; }
  data.options[0].description = 'This deliberately long description exposes actual rendered overflow. Full text remains in this dialog. '.repeat(5);
  selected = 0;
  render();
};
try { data = HadesDataIO.validate(window.HADES_DRAFT); render(); }
catch (error) {
  $('scene-options').replaceChildren(el('p', 'data-error', 'Invalid data.js: ' + error.message));
  announce('Data validation failed. Import valid JSON to recover.');
}
