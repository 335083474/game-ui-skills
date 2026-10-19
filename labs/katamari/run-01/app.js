(function () {
  'use strict';

  const routes = ['collection-book', 'level-select', 'roll-results'];
  const itemNames = {
    'citrus-wedge': 'Citrus wedge',
    'blue-kettle': 'Blue kettle',
    'paper-kite': 'Paper kite'
  };
  const itemDetails = {
    'citrus-wedge': 'A bright kitchen find, filed under little circles.',
    'blue-kettle': 'A warm, round kitchen find with a whistle-like orbit.',
    'paper-kite': 'A new sky find. Record the roll to add it to this book.'
  };
  const routeNames = { seaside: 'Seaside', rooftops: 'Rooftops' };
  const routeDetails = {
    seaside: 'Seaside: a wide harbor loop for gathering the first few small finds.',
    rooftops: 'Rooftops: short turns, narrow ledges, and a higher path.'
  };

  function createModel() {
    return {
      selectedFind: 'citrus-wedge',
      pinnedFind: 'blue-kettle',
      foundIds: ['blue-kettle', 'citrus-wedge'],
      selectedRoute: 'seaside',
      stagedRoute: null,
      stagedRouteCount: 0,
      rollRecorded: false,
      recordCount: 0,
      stars: 0,
      message: ''
    };
  }

  function transition(model, action, payload) {
    const next = Object.assign({}, model, { foundIds: model.foundIds.slice() });
    const id = payload && payload.id;
    if (action === 'select-find' && itemNames[id]) {
      next.selectedFind = id;
      next.message = 'Previewing ' + itemNames[id] + '. No collection state changed.';
    } else if (action === 'pin-find') {
      const name = itemNames[next.selectedFind];
      if (!next.foundIds.includes(next.selectedFind)) {
        next.message = name + ' has not been filed yet; record the roll first.';
      } else if (next.pinnedFind === next.selectedFind) {
        next.message = name + ' is already pinned; the note was not duplicated.';
      } else {
        next.pinnedFind = next.selectedFind;
        next.message = name + ' is pinned to the field notes.';
      }
    } else if (action === 'select-route' && routeNames[id]) {
      next.selectedRoute = id;
      next.message = routeNames[id] + ' is selected for preview. The roll has not started.';
    } else if (action === 'stage-route') {
      if (next.stagedRouteCount === 0) {
        next.stagedRoute = next.selectedRoute;
        next.stagedRouteCount = 1;
        next.message = routeNames[next.stagedRoute] + ' route is staged for a 15 cm target.';
      } else {
        next.message = routeNames[next.stagedRoute] + ' route is already staged; no second roll was created.';
      }
    } else if (action === 'record-roll') {
      if (!next.rollRecorded) {
        next.rollRecorded = true;
        next.recordCount = 1;
        next.stars += 1;
        if (!next.foundIds.includes('paper-kite')) next.foundIds.push('paper-kite');
        next.message = 'Roll recorded: 18 cm and 1 star added. Paper kite is now in the book.';
      } else {
        next.message = 'This roll is already recorded; no extra star was added.';
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
    return routes.includes(candidate) ? candidate : 'collection-book';
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
    if (route === 'collection-book') hydrateCollection();
    if (route === 'level-select') hydrateLevel();
    if (route === 'roll-results') hydrateResults();
    if (focusAction) {
      let selector = 'button[data-action="' + focusAction + '"]';
      if (focusId) selector += '[data-id="' + focusId + '"]';
      const target = screen.querySelector(selector);
      if (target && !target.disabled) target.focus();
      else if (focusAction === 'pin-find' || focusAction === 'stage-route' || focusAction === 'record-roll') screen.querySelector('[data-status]').focus();
    }
  }

  function hydrateCollection() {
    const active = model.selectedFind;
    screen.querySelectorAll('[data-action="select-find"]').forEach(function (button) {
      const id = button.getAttribute('data-id');
      button.classList.toggle('is-selected', id === active);
      button.setAttribute('aria-pressed', id === active ? 'true' : 'false');
      const found = model.foundIds.includes(id);
      const state = screen.querySelector('[data-find-state="' + id + '"]');
      if (state) state.textContent = found ? 'FOUND' : 'NOT FOUND';
      button.classList.toggle('is-locked', !found);
    });
    screen.querySelector('[data-selected-name]').textContent = itemNames[active];
    screen.querySelector('[data-selected-detail]').textContent = itemDetails[active];
    screen.querySelector('[data-pinned-name]').textContent = itemNames[model.pinnedFind];
    screen.querySelector('[data-star-count]').textContent = model.stars + ' ✦';
    const pin = screen.querySelector('[data-action="pin-find"]');
    const found = model.foundIds.includes(active);
    pin.disabled = !found || model.pinnedFind === active;
    pin.textContent = model.pinnedFind === active ? itemNames[active] + ' is already pinned' : 'Pin ' + itemNames[active] + ' to field notes';
    const reason = screen.querySelector('[data-pin-reason]');
    reason.textContent = !found ? 'Not filed yet. Record the roll to add this find.' : (model.pinnedFind === active ? 'This favorite is already pinned.' : 'Preview is reversible; pinning is explicit.');
    screen.querySelector('[data-status]').textContent = model.message || 'Choose a found object to preview. A pin changes only the field-note favorite.';
  }

  function hydrateLevel() {
    screen.querySelectorAll('[data-action="select-route"]').forEach(function (button) {
      const selected = button.getAttribute('data-id') === model.selectedRoute;
      button.classList.toggle('is-selected', selected);
      button.setAttribute('aria-pressed', selected ? 'true' : 'false');
    });
    screen.querySelector('[data-route-summary]').textContent = routeDetails[model.selectedRoute];
    const start = screen.querySelector('[data-action="stage-route"]');
    start.textContent = 'Begin ' + routeNames[model.selectedRoute] + ' roll';
    screen.querySelector('[data-status]').textContent = model.message || 'Route choice is a preview until you begin the roll.';
  }

  function hydrateResults() {
    const record = screen.querySelector('[data-action="record-roll"]');
    const done = model.rollRecorded;
    record.disabled = done;
    record.textContent = done ? 'Roll already recorded' : 'Record this roll';
    screen.querySelector('[data-status]').textContent = model.message || 'This result is still a preview. Recording adds one star and files Paper kite.';
  }

  screen.addEventListener('click', function (event) {
    const button = event.target.closest('button[data-action]');
    if (!button) return;
    model = transition(model, button.getAttribute('data-action'), { id: button.getAttribute('data-id') });
    const route = currentRoute();
    renderRoute(route, button.getAttribute('data-action'), button.getAttribute('data-id'));
  });

  window.addEventListener('hashchange', function () { renderRoute(currentRoute()); });
  renderRoute(currentRoute());
}());
