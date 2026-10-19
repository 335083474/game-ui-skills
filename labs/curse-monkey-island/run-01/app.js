(function () {
  'use strict';

  const routes = ['inventory-tray', 'item-interaction', 'dialogue-scene'];
  const itemNames = {
    'brass-compass': 'Brass compass',
    'waxed-chart': 'Waxed chart',
    'chalk-nub': 'Chalk nub',
    'reef-marked-chart': 'Reef-marked chart'
  };
  const itemDetails = {
    'brass-compass': 'A brass compass with an east-pointing needle and a dent near the hinge.',
    'waxed-chart': 'A waxed chart, folded at the east shoal. It can take a charcoal mark.',
    'chalk-nub': 'A short chalk nub. It can mark the chart once before it runs out.',
    'reef-marked-chart': 'The chart has a new reef note, ready for Captain Vela to inspect.'
  };
  const responseLines = {
    'ask-reef': '“What did you mark east of the shoal?”',
    'ask-tide': '“When does the water uncover it?”',
    'change-subject': '“That parrot has an excellent hat.”'
  };

  function createModel() {
    return {
      inventory: { 'brass-compass': 1, 'waxed-chart': 1, 'chalk-nub': 1, 'reef-marked-chart': 0 },
      selectedItems: [],
      combinationPreview: false,
      combinationCommitted: false,
      selectedUseItem: null,
      selectedTarget: 'waxed-chart',
      usePreview: false,
      chartMarked: false,
      selectedResponse: 'ask-reef',
      dialogueCommitted: false,
      clueKnown: false,
      message: ''
    };
  }

  function transition(model, action, payload) {
    const next = Object.assign({}, model, { inventory: Object.assign({}, model.inventory), selectedItems: model.selectedItems.slice() });
    const id = payload && payload.id;
    if (action === 'toggle-item' && itemNames[id] && next.inventory[id] > 0 && id !== 'reef-marked-chart') {
      next.selectedItems = next.selectedItems.includes(id) ? next.selectedItems.filter(function (item) { return item !== id; }) : next.selectedItems.concat(id);
      next.combinationPreview = false;
      next.message = itemNames[id] + (next.selectedItems.includes(id) ? ' selected for inspection.' : ' removed from selection.');
    } else if (action === 'preview-combination') {
      const validPair = next.selectedItems.length === 2 && next.selectedItems.includes('waxed-chart') && next.selectedItems.includes('chalk-nub') && next.inventory['waxed-chart'] > 0 && next.inventory['chalk-nub'] > 0;
      next.combinationPreview = validPair;
      next.message = validPair ? 'Preview: spend one Waxed chart and one Chalk nub to make a Reef-marked chart. No items spent yet.' : 'Select exactly Waxed chart and Chalk nub, both in the bag, to preview this recipe.';
    } else if (action === 'confirm-combination') {
      if (next.combinationCommitted) {
        next.message = 'The Reef-marked chart is already made; no second set of items was spent.';
      } else if (next.combinationPreview && next.inventory['waxed-chart'] > 0 && next.inventory['chalk-nub'] > 0) {
        next.inventory['waxed-chart'] -= 1;
        next.inventory['chalk-nub'] -= 1;
        next.inventory['reef-marked-chart'] += 1;
        next.selectedItems = [];
        next.combinationPreview = false;
        next.combinationCommitted = true;
        next.message = 'Reef-marked chart is ready; Waxed chart and Chalk nub were spent exactly once.';
      } else {
        next.message = 'Preview the valid recipe before combining. Inventory counts are unchanged.';
      }
    } else if (action === 'cancel-selection') {
      next.selectedItems = [];
      next.combinationPreview = false;
      next.message = 'Selection cleared. Inventory counts are unchanged.';
    } else if (action === 'select-use-item' && itemNames[id] && next.inventory[id] > 0) {
      next.selectedUseItem = id;
      next.usePreview = false;
      next.message = itemNames[id] + ' selected. Choose a scene target to preview the cost.';
    } else if (action === 'select-target' && (id === 'waxed-chart' || id === 'brass-compass')) {
      next.selectedTarget = id;
      next.usePreview = false;
      next.message = itemNames[id] + ' selected as the scene target. No item has been used.';
    } else if (action === 'preview-use') {
      if (!next.selectedUseItem || next.inventory[next.selectedUseItem] < 1) {
        next.usePreview = false;
        next.message = 'Choose an available item before previewing use.';
      } else if (next.selectedTarget !== 'waxed-chart') {
        next.usePreview = false;
        next.message = 'The Brass compass is not a writing surface. Chalk nub stays in your bag.';
      } else if (next.chartMarked) {
        next.usePreview = false;
        next.message = 'The Waxed chart already has its reef note; no second mark is needed.';
      } else {
        next.usePreview = true;
        next.message = 'Preview: spend 1 Chalk nub on the Waxed chart to add the reef note. No item spent yet.';
      }
    } else if (action === 'confirm-use') {
      if (next.chartMarked) {
        next.message = 'The reef note is already on the chart; no second Chalk nub was spent.';
      } else if (next.usePreview && next.selectedUseItem === 'chalk-nub' && next.selectedTarget === 'waxed-chart' && next.inventory['chalk-nub'] > 0) {
        next.inventory['chalk-nub'] -= 1;
        next.chartMarked = true;
        next.usePreview = false;
        next.message = 'The Waxed chart now bears a reef note. Chalk nub consumed: 1.';
      } else {
        next.message = 'Confirm only after a valid preview. No item was consumed.';
      }
    } else if (action === 'select-response' && responseLines[id]) {
      next.selectedResponse = id;
      next.message = 'Response preview: ' + responseLines[id];
    } else if (action === 'speak-response') {
      if (next.dialogueCommitted) {
        next.message = 'That line has already been spoken in this sample scene.';
      } else {
        next.dialogueCommitted = true;
        if (next.selectedResponse === 'ask-reef') next.clueKnown = true;
        next.message = next.selectedResponse === 'ask-reef' ? 'Captain Vela marks the hidden reef on your chart.' : 'Captain Vela answers, then turns back to the tide chart.';
      }
    } else if (action === 'reset-dialogue') {
      if (!next.dialogueCommitted) {
        next.selectedResponse = 'ask-reef';
        next.message = 'Dialogue preview reset. No story state changed.';
      } else {
        next.message = 'This line has been spoken; reload to begin a fresh sample scene.';
      }
    }
    return next;
  }

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = { createModel: createModel, transition: transition, routes: routes };
  }

  if (typeof document === 'undefined') return;

  let model = createModel();
  const screen = document.getElementById('screen');

  function currentRoute() {
    const candidate = window.location.hash.replace(/^#/, '');
    return routes.includes(candidate) ? candidate : 'inventory-tray';
  }

  function setCount(id, value) {
    const node = screen.querySelector('[data-count-for="' + id + '"]');
    if (node) node.textContent = String(value);
  }

  function setStatus() {
    const node = screen.querySelector('[data-status]');
    if (node && model.message) node.textContent = model.message;
  }

  function renderRoute(route, focusAction, focusId) {
    const template = document.querySelector('template[data-screen="' + route + '"]');
    if (!template) return;
    screen.replaceChildren(template.content.cloneNode(true));
    document.querySelectorAll('[data-route]').forEach(function (link) {
      const active = link.getAttribute('data-route') === route;
      if (active) link.setAttribute('aria-current', 'page');
      else link.removeAttribute('aria-current');
    });
    if (route === 'inventory-tray') hydrateInventory();
    if (route === 'item-interaction') hydrateInteraction();
    if (route === 'dialogue-scene') hydrateDialogue();
    if (focusAction) {
      let selector = 'button[data-action="' + focusAction + '"]';
      if (focusId) selector += '[data-id="' + focusId + '"]';
      const target = screen.querySelector(selector);
      if (target && !target.disabled) target.focus();
      else if (focusAction.startsWith('confirm') || focusAction === 'speak-response') screen.querySelector('[data-status]').focus();
    }
  }

  function hydrateInventory() {
    Object.keys(model.inventory).forEach(function (id) { setCount(id, model.inventory[id]); });
    screen.querySelectorAll('[data-action="toggle-item"]').forEach(function (button) {
      const id = button.getAttribute('data-id');
      const selected = model.selectedItems.includes(id);
      button.setAttribute('aria-pressed', selected ? 'true' : 'false');
      button.classList.toggle('is-selected', selected);
      button.disabled = model.inventory[id] < 1;
    });
    const selectedNames = model.selectedItems.map(function (id) { return itemNames[id]; });
    const inspectName = screen.querySelector('[data-inspect-name]');
    const inspectDetail = screen.querySelector('[data-inspect-detail]');
    if (selectedNames.length) {
      inspectName.textContent = selectedNames.join(' + ');
      inspectDetail.textContent = selectedNames.map(function (id) { return itemDetails[model.selectedItems.find(function (key) { return itemNames[key] === id; })]; }).join(' ');
    }
    screen.querySelector('[data-total-items]').textContent = Object.values(model.inventory).reduce(function (sum, count) { return sum + count; }, 0) + ' ITEMS';
    const canPreview = model.selectedItems.length === 2 && model.selectedItems.includes('waxed-chart') && model.selectedItems.includes('chalk-nub') && !model.combinationCommitted;
    screen.querySelector('[data-action="preview-combination"]').disabled = !canPreview;
    const confirm = screen.querySelector('[data-action="confirm-combination"]');
    confirm.disabled = !model.combinationPreview || model.combinationCommitted;
    confirm.textContent = model.combinationCommitted ? 'Recipe already completed' : 'Combine Waxed chart and Chalk nub';
    const review = screen.querySelector('[data-review]');
    if (model.combinationPreview) review.textContent = 'Preview: spend 1 Waxed chart + 1 Chalk nub → make 1 Reef-marked chart. Nothing spent yet.';
    else if (model.combinationCommitted) review.textContent = 'Filed result: 1 Reef-marked chart. Both ingredients were spent once.';
    screen.querySelector('[data-status]').textContent = model.message || 'Selection and inspection are reversible. Combining is a separate, guarded action.';
  }

  function hydrateInteraction() {
    screen.querySelector('[data-chalk-count]').textContent = String(model.inventory['chalk-nub']);
    const source = screen.querySelector('[data-action="select-use-item"]');
    const sourceSelected = model.selectedUseItem === 'chalk-nub';
    source.setAttribute('aria-pressed', sourceSelected ? 'true' : 'false');
    source.classList.toggle('is-selected', sourceSelected);
    source.disabled = model.inventory['chalk-nub'] < 1 || model.chartMarked;
    screen.querySelectorAll('[data-action="select-target"]').forEach(function (button) {
      const selected = button.getAttribute('data-id') === model.selectedTarget;
      button.classList.toggle('is-selected', selected);
      button.setAttribute('aria-pressed', selected ? 'true' : 'false');
    });
    const confirm = screen.querySelector('[data-action="confirm-use"]');
    confirm.disabled = !model.usePreview || model.chartMarked;
    if (model.chartMarked) confirm.textContent = 'Reef note already added';
    screen.querySelector('[data-review]').textContent = model.usePreview ? 'Preview: use 1 Chalk nub on Waxed chart. This costs one item.' : 'Preview first. Your Chalk nub stays in the bag until a valid use is confirmed.';
    screen.querySelector('[data-status]').textContent = model.message || 'Select an item and scene target to see the contextual action.';
  }

  function hydrateDialogue() {
    screen.querySelectorAll('[data-action="select-response"]').forEach(function (button) {
      const selected = button.getAttribute('data-id') === model.selectedResponse;
      button.classList.toggle('is-selected', selected);
      button.setAttribute('aria-pressed', selected ? 'true' : 'false');
    });
    screen.querySelector('[data-response-preview]').textContent = responseLines[model.selectedResponse];
    const speak = screen.querySelector('[data-action="speak-response"]');
    speak.disabled = model.dialogueCommitted;
    speak.textContent = model.dialogueCommitted ? 'Response already spoken' : 'Speak the selected response';
    screen.querySelector('[data-status]').textContent = model.message || 'Your selected line is only a preview until you speak it.';
  }

  screen.addEventListener('click', function (event) {
    const button = event.target.closest('button[data-action]');
    if (!button) return;
    model = transition(model, button.getAttribute('data-action'), { id: button.getAttribute('data-id') });
    renderRoute(currentRoute(), button.getAttribute('data-action'), button.getAttribute('data-id'));
  });

  window.addEventListener('hashchange', function () { renderRoute(currentRoute()); });
  renderRoute(currentRoute());
}());
