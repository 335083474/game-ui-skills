(function () {
  'use strict';

  const routes = {
    'canal-edge': { name: 'Canal Edge', detail: '2.4 km demo estimate · open crossing' },
    'service-roof': { name: 'Service Roof', detail: '3.1 km demo estimate · covered approach' }
  };
  const validScreens = ['runner-map', 'mission-brief', 'movement-hud'];

  function createSession() {
    return { routePending: null, routeActive: null, briefAccepted: false, cuePreview: false, cueUsed: false, cueVisible: true, routeNote: 'Stay near the north wall', briefNote: 'Packet stays sealed until the stair' };
  }

  function transition(previous, action, value) {
    const state = JSON.parse(JSON.stringify(previous));
    let message = '';
    if (action === 'map-preview' && routes[value]) {
      state.routePending = value;
      message = routes[value].name + ' route preview ready. Plot the line to confirm it.';
    } else if (action === 'map-confirm') {
      if (!state.routePending) message = 'Preview a route on the map before plotting it.';
      else {
        state.routeActive = state.routePending;
        state.routePending = null;
        message = routes[state.routeActive].name + ' confirmed for this page session.';
      }
    } else if (action === 'map-cancel') {
      state.routePending = null;
      message = state.routeActive ? routes[state.routeActive].name + ' remains confirmed; preview cleared.' : 'Route preview cleared. No line is confirmed.';
    } else if (action === 'brief-accept') {
      if (state.briefAccepted) message = 'North Relay Courier is already accepted for this page session.';
      else {
        state.briefAccepted = true;
        message = 'North Relay Courier accepted for this page session.';
      }
    } else if (action === 'brief-back') {
      message = state.briefAccepted ? 'The accepted brief remains active for this page session.' : 'Brief left unaccepted. No page-session choice was made.';
    } else if (action === 'cue-preview') {
      state.cuePreview = true;
      state.cueVisible = true;
      message = 'Low barrier cue preview ready. Use it to record this local demo action.';
    } else if (action === 'cue-use') {
      if (state.cueUsed) message = 'This page session already recorded the low barrier cue.';
      else if (!state.cuePreview) message = 'Preview the low barrier cue before using it.';
      else {
        state.cueUsed = true;
        state.cuePreview = false;
        state.cueVisible = true;
        message = 'Low barrier cue used for this page session; Space remains a demo-only label.';
      }
    } else if (action === 'cue-cancel') {
      state.cuePreview = false;
      message = 'Cue preview cancelled. The movement view remains open.';
    } else if (action === 'cue-dismiss') {
      state.cueVisible = false;
      message = 'Cue hidden. The objective remains in the page-session route view.';
    } else if (action === 'cue-restore') {
      state.cueVisible = true;
      message = 'Movement cue restored.';
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
    return validScreens.includes(candidate) ? candidate : 'runner-map';
  }
  function bind(fragment, key, value) { fragment.querySelectorAll('[data-bind="' + key + '"]').forEach(function (node) { node.textContent = value; }); }

  function decorateMap(fragment) {
    const shown = session.routePending || session.routeActive;
    const route = shown ? routes[shown] : null;
    bind(fragment, 'routeName', route ? route.name : 'No line selected');
    bind(fragment, 'routeDetail', route ? route.detail + ' · synthetic route data' : 'Select a red marker to see its route trade-off.');
    bind(fragment, 'routeFeedback', session.routePending ? routes[session.routePending].name + ' is previewed; confirm or clear the line.' : session.routeActive ? routes[session.routeActive].name + ' is locked for this page session.' : 'No route is locked.');
    fragment.querySelectorAll('[data-action="map-preview"]').forEach(function (button) {
      const selected = session.routePending === button.dataset.value;
      button.setAttribute('aria-pressed', String(selected));
      button.classList.toggle('is-selected', selected);
    });
    fragment.querySelector('[data-route-line="canal-edge"]').classList.toggle('is-live', shown === 'canal-edge');
    fragment.querySelector('[data-route-line="service-roof"]').classList.toggle('is-live', shown === 'service-roof');
    fragment.querySelector('[data-action="map-confirm"]').disabled = !session.routePending;
    fragment.querySelector('[data-edit="routeNote"]').value = session.routeNote;
  }
  function decorateBrief(fragment) {
    bind(fragment, 'briefState', session.briefAccepted ? 'BRIEF ACCEPTED / PAGE SESSION' : 'BRIEF NOT ACCEPTED');
    fragment.querySelector('[data-action="brief-accept"]').disabled = session.briefAccepted;
    fragment.querySelector('[data-edit="briefNote"]').value = session.briefNote;
  }
  function decorateMovement(fragment) {
    bind(fragment, 'cueState', session.cueUsed ? 'RECORDED' : session.cuePreview ? 'PREVIEW' : 'READY');
    bind(fragment, 'cueFeedback', session.cueUsed ? 'Cue recorded once in this page session.' : session.cuePreview ? 'Cue is previewed; confirm use or cancel the preview.' : 'The barrier cue is ready for preview.');
    fragment.querySelector('[data-bind-class="cueHidden"]').classList.toggle('is-hidden', !session.cueVisible);
    fragment.querySelector('[data-action="cue-use"]').disabled = !session.cuePreview || session.cueUsed;
    fragment.querySelector('[data-action="cue-cancel"]').disabled = !session.cuePreview;
    fragment.querySelector('[data-action="cue-preview"]').disabled = session.cueUsed;
  }
  function render(focusAction) {
    const route = currentRoute();
    const fragment = document.getElementById('screen-' + route).content.cloneNode(true);
    if (route === 'runner-map') decorateMap(fragment);
    if (route === 'mission-brief') decorateBrief(fragment);
    if (route === 'movement-hud') decorateMovement(fragment);
    root.replaceChildren(fragment);
    document.querySelectorAll('[data-route]').forEach(function (link) {
      if (link.dataset.route === route) link.setAttribute('aria-current', 'page');
      else link.removeAttribute('aria-current');
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
    const action = route === 'runner-map' ? 'map-cancel' : route === 'movement-hud' ? 'cue-cancel' : 'brief-back';
    const pending = route === 'runner-map' ? session.routePending : route === 'movement-hud' ? session.cuePreview : !session.briefAccepted;
    if (pending) dispatch(action);
  });
  window.addEventListener('hashchange', function () { render(); });
  if (!window.location.hash || !validScreens.includes(window.location.hash.slice(1))) window.history.replaceState(null, '', '#runner-map');
  render();
}());
