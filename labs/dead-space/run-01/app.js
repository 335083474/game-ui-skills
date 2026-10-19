(function () {
  'use strict';

  const modules = {
    'survey-lens': { name: 'Survey Lens', slot: 'Utility' },
    'tether-coil': { name: 'Tether Coil', slot: 'Utility' }
  };
  const items = {
    'patch-kit': { name: 'Patch Kit', price: 14, stockKey: 'patchKit' },
    'charge-cells': { name: 'Charge Cells', price: 22, stockKey: 'chargeCells' }
  };
  const targets = {
    'cargo-lift': { name: 'Cargo Lift', range: '86 m', bearing: '042°' },
    'tram-access': { name: 'Tram Access', range: '124 m', bearing: '310°' }
  };
  const validScreens = ['rig-inventory', 'store-kiosk', 'locator'];

  function createSession() {
    return {
      installedUtility: 'survey-lens', pendingUtility: null,
      credits: 48, stock: { patchKit: 1, chargeCells: 2 }, purchasePending: null, purchased: { 'patch-kit': false, 'charge-cells': false },
      trackedTarget: null, locatorPending: null,
      suitNote: 'Check the utility slot before leaving', kioskNote: 'Keep one repair kit in reserve', locatorNote: 'Follow the lit side of the cargo spine'
    };
  }

  function transition(previous, action, value) {
    const state = JSON.parse(JSON.stringify(previous));
    let message = '';
    if (action === 'utility-preview' && modules[value]) {
      if (value === state.installedUtility) {
        state.pendingUtility = null;
        message = modules[value].name + ' is already installed in the Utility slot.';
      }
      else {
        state.pendingUtility = value;
        message = modules[value].name + ' module preview ready. Install to confirm the replacement.';
      }
    } else if (action === 'utility-install') {
      if (!state.pendingUtility) message = 'Preview a utility module before installing it.';
      else if (state.pendingUtility === state.installedUtility) message = modules[state.installedUtility].name + ' is already installed.';
      else {
        state.installedUtility = state.pendingUtility;
        state.pendingUtility = null;
        message = modules[state.installedUtility].name + ' installed in the Utility slot for this page session.';
      }
    } else if (action === 'utility-cancel') {
      state.pendingUtility = null;
      message = modules[state.installedUtility].name + ' remains installed; module preview cleared.';
    } else if (action === 'item-preview' && items[value]) {
      if (state.purchased[value]) message = items[value].name + ' was already purchased in this page session.';
      else if (state.credits < items[value].price) message = 'Unavailable: ' + items[value].name + ' costs ' + items[value].price + ' credits; only ' + state.credits + ' remain.';
      else {
        state.purchasePending = value;
        message = items[value].name + ' cost preview ready. Confirm the order to update this page session.';
      }
    } else if (action === 'purchase-confirm') {
      const item = items[state.purchasePending];
      if (!item) message = 'Preview an available supply before confirming the order.';
      else if (state.purchased[state.purchasePending]) message = item.name + ' was already purchased; repeat orders are blocked this page session.';
      else if (state.credits < item.price) message = 'Purchase blocked: insufficient demo credit.';
      else {
        const id = state.purchasePending;
        state.credits -= item.price;
        state.stock[item.stockKey] += 1;
        state.purchased[id] = true;
        state.purchasePending = null;
        message = item.name + ' purchased for ' + item.price + ' credits; ' + state.credits + ' credits remain.';
      }
    } else if (action === 'purchase-cancel') {
      state.purchasePending = null;
      message = 'Order preview cancelled. Demo credit and stock are unchanged.';
    } else if (action === 'locator-preview' && targets[value]) {
      state.locatorPending = value;
      message = targets[value].name + ' bearing preview ready. Track the target to confirm.';
    } else if (action === 'locator-confirm') {
      if (!state.locatorPending) message = 'Preview a destination before tracking it.';
      else {
        state.trackedTarget = state.locatorPending;
        state.locatorPending = null;
        const target = targets[state.trackedTarget];
        message = target.name + ' tracked for this page session at ' + target.range + ' / ' + target.bearing + ' bearing.';
      }
    } else if (action === 'locator-cancel') {
      state.locatorPending = null;
      message = state.trackedTarget ? targets[state.trackedTarget].name + ' remains tracked; preview cleared.' : 'Tracking preview cleared. No target is tracked.';
    }
    return { state: state, message: message };
  }

  if (typeof module !== 'undefined' && module.exports) module.exports = { createSession: createSession, transition: transition };
  if (typeof window === 'undefined' || !document.getElementById('screen-root')) return;

  let session = createSession();
  const root = document.getElementById('screen-root');
  const feedback = document.getElementById('feedback');
  function currentRoute() {
    const candidate = window.location.hash.slice(1);
    return validScreens.includes(candidate) ? candidate : 'rig-inventory';
  }
  function bind(fragment, key, value) { fragment.querySelectorAll('[data-bind="' + key + '"]').forEach(function (node) { node.textContent = value; }); }
  function stockLabel(key) { return 'x' + session.stock[key]; }

  function decorateRig(fragment) {
    const installed = modules[session.installedUtility];
    const pending = session.pendingUtility ? modules[session.pendingUtility] : null;
    bind(fragment, 'utilityInstalled', installed.name.toUpperCase());
    bind(fragment, 'utilityPending', pending ? pending.name.toUpperCase() : 'NO MODULE PREVIEWED');
    bind(fragment, 'utilityStatus', pending ? 'PREVIEW' : 'STABLE');
    bind(fragment, 'utilitySubline', 'Utility slot / currently installed');
    bind(fragment, 'utilityFeedback', pending ? pending.name + ' previewed. ' + installed.name + ' remains installed until confirmed.' : installed.name + ' remains in the Utility slot.');
    bind(fragment, 'patchStock', stockLabel('patchKit'));
    bind(fragment, 'cellStock', stockLabel('chargeCells'));
    fragment.querySelectorAll('[data-action="utility-preview"]').forEach(function (button) {
      const id = button.dataset.value;
      button.setAttribute('aria-pressed', String(session.pendingUtility === id));
      button.classList.toggle('is-pending', session.pendingUtility === id);
      button.classList.toggle('is-installed', session.installedUtility === id);
      button.disabled = session.installedUtility === id;
      if (button.disabled) button.setAttribute('aria-describedby', 'rig-help');
      else button.removeAttribute('aria-describedby');
    });
    fragment.querySelector('[data-action="utility-install"]').disabled = !session.pendingUtility || session.pendingUtility === session.installedUtility;
    fragment.querySelector('[data-action="utility-cancel"]').disabled = !session.pendingUtility;
    fragment.querySelector('[data-edit="suitNote"]').value = session.suitNote;
  }

  function decorateKiosk(fragment) {
    const pending = session.purchasePending ? items[session.purchasePending] : null;
    const remaining = pending ? session.credits - pending.price : session.credits;
    bind(fragment, 'credits', String(session.credits));
    bind(fragment, 'patchStock', stockLabel('patchKit'));
    bind(fragment, 'cellStock', stockLabel('chargeCells'));
    bind(fragment, 'purchaseName', pending ? pending.name.toUpperCase() : 'NO ITEM');
    bind(fragment, 'purchasePrice', pending ? pending.price + ' CR' : '— CR');
    bind(fragment, 'remainingCredits', remaining + ' CR');
    bind(fragment, 'purchaseFeedback', pending ? pending.name + ' selected. Review the remaining credit before confirming.' : 'Select a supply to preview its cost before purchase.');
    const guardMessages = ['Each supply can be purchased once per page session.'];
    Object.keys(items).forEach(function (id) {
      if (session.purchased[id]) guardMessages.push(items[id].name + ' unavailable: already purchased.');
      else if (session.credits < items[id].price) guardMessages.push(items[id].name + ' unavailable: costs ' + items[id].price + ' credits; ' + session.credits + ' remain.');
    });
    bind(fragment, 'purchaseGuard', guardMessages.join(' '));
    fragment.querySelectorAll('[data-action="item-preview"]').forEach(function (button) {
      const id = button.dataset.value;
      const item = items[id];
      const unavailable = session.purchased[id] || session.credits < item.price;
      button.setAttribute('aria-pressed', String(session.purchasePending === id));
      button.classList.toggle('is-selected', session.purchasePending === id);
      button.disabled = unavailable;
      if (unavailable) button.setAttribute('aria-describedby', 'purchase-guard');
      else button.removeAttribute('aria-describedby');
    });
    const item = pending;
    fragment.querySelector('[data-action="purchase-confirm"]').disabled = !item || session.purchased[session.purchasePending] || session.credits < item.price;
    fragment.querySelector('[data-action="purchase-cancel"]').disabled = !pending;
    fragment.querySelector('[data-edit="kioskNote"]').value = session.kioskNote;
  }

  function decorateLocator(fragment) {
    const shown = session.locatorPending || session.trackedTarget;
    const target = shown ? targets[shown] : null;
    bind(fragment, 'trackedState', session.locatorPending ? 'PREVIEW TARGET' : 'TRACKED OBJECTIVE');
    bind(fragment, 'trackedName', target ? target.name.toUpperCase() : 'NO TARGET');
    bind(fragment, 'trackedBearing', target ? target.bearing : '—');
    bind(fragment, 'trackedRange', target ? target.range + ' / SYNTHETIC' : 'Select a destination');
    bind(fragment, 'locatorFeedback', session.locatorPending ? targets[session.locatorPending].name + ' is previewed; confirm or clear tracking.' : session.trackedTarget ? targets[session.trackedTarget].name + ' is tracked for this page session.' : 'Choose one target below to preview its bearing.');
    fragment.querySelector('[data-bind-class="vectorActive"]').classList.toggle('is-active', Boolean(shown));
    fragment.querySelectorAll('[data-action="locator-preview"]').forEach(function (button) {
      const selected = session.locatorPending === button.dataset.value;
      button.setAttribute('aria-pressed', String(selected));
      button.classList.toggle('is-selected', selected);
    });
    fragment.querySelector('[data-action="locator-confirm"]').disabled = !session.locatorPending;
    fragment.querySelector('[data-action="locator-cancel"]').disabled = !session.locatorPending;
    fragment.querySelector('[data-edit="locatorNote"]').value = session.locatorNote;
  }

  function render(focusAction) {
    const route = currentRoute();
    const fragment = document.getElementById('screen-' + route).content.cloneNode(true);
    if (route === 'rig-inventory') decorateRig(fragment);
    if (route === 'store-kiosk') decorateKiosk(fragment);
    if (route === 'locator') decorateLocator(fragment);
    root.replaceChildren(fragment);
    document.querySelectorAll('[data-route]').forEach(function (link) {
      if (link.dataset.route === route) link.setAttribute('aria-current', 'page'); else link.removeAttribute('aria-current');
    });
    if (focusAction) {
      const target = root.querySelector('[data-action="' + focusAction + '"]');
      if (target && !target.disabled) target.focus(); else feedback.focus();
    }
  }
  function dispatch(action, value) {
    const result = transition(session, action, value);
    session = result.state;
    feedback.textContent = result.message;
    render(action);
  }

  document.addEventListener('click', function (event) {
    const button = event.target.closest('button[data-action]');
    if (!button || button.disabled) return;
    dispatch(button.dataset.action, button.dataset.value);
  });
  document.addEventListener('input', function (event) {
    const key = event.target.dataset.edit;
    if (key && Object.prototype.hasOwnProperty.call(session, key)) session[key] = event.target.value;
  });
  document.addEventListener('keydown', function (event) {
    if (event.key !== 'Escape') return;
    const route = currentRoute();
    const action = route === 'rig-inventory' ? 'utility-cancel' : route === 'store-kiosk' ? 'purchase-cancel' : 'locator-cancel';
    const pending = route === 'rig-inventory' ? session.pendingUtility : route === 'store-kiosk' ? session.purchasePending : session.locatorPending;
    if (pending) dispatch(action);
  });
  window.addEventListener('hashchange', function () { render(); });
  if (!window.location.hash || !validScreens.includes(window.location.hash.slice(1))) window.history.replaceState(null, '', '#rig-inventory');
  render();
}());
