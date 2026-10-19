(function () {
  'use strict';

  const routeNames = {
    'north-arcade': { name: 'North Arcade Switchback', detail: '5 wall tags · 02:40 demo window · narrow roof line' },
    'canal-market': { name: 'Canal Market Loop', detail: '4 wall tags · 03:10 demo window · broad plaza' }
  };
  const crewNames = {
    arlo: { name: 'Arlo', style: 'Line cutter', initial: 'A' },
    mina: { name: 'Mina', style: 'Wall painter', initial: 'M' },
    jo: { name: 'Jo', style: 'Switchback', initial: 'J' }
  };
  const routeIds = ['crew-select', 'city-missions', 'graffiti-results'];

  function createSession() {
    return {
      crewActive: 'mina', crewPending: null,
      routePending: null, routeActive: null,
      resultPreview: false, resultStamped: false,
      crewNote: 'Paint the long wall after the turn',
      routeNote: 'Watch the roof gap near the relay',
      runCaption: 'High line / North Ward'
    };
  }

  function transition(previous, action, value) {
    const state = JSON.parse(JSON.stringify(previous));
    let message = '';
    if (action === 'crew-preview' && crewNames[value]) {
      state.crewPending = value;
      message = crewNames[value].name + ' crew preview ready. Confirm to lock this page-session choice.';
    } else if (action === 'crew-confirm') {
      if (!state.crewPending) message = 'Preview a crew before locking it.';
      else if (state.crewPending === state.crewActive) message = crewNames[state.crewActive].name + ' is already active for this page session.';
      else {
        state.crewActive = state.crewPending;
        state.crewPending = null;
        message = crewNames[state.crewActive].name + ' is locked as active crew for this page session.';
      }
    } else if (action === 'crew-cancel') {
      state.crewPending = null;
      message = 'Crew preview cleared. ' + crewNames[state.crewActive].name + ' remains active.';
    } else if (action === 'route-preview' && routeNames[value]) {
      state.routePending = value;
      message = routeNames[value].name + ' is previewed. Tag in to confirm the route.';
    } else if (action === 'route-confirm') {
      if (!state.routePending) message = 'Choose a route on the map before tagging in.';
      else {
        state.routeActive = state.routePending;
        state.routePending = null;
        message = routeNames[state.routeActive].name + ' locked for this page session.';
      }
    } else if (action === 'route-cancel') {
      state.routePending = null;
      message = state.routeActive ? routeNames[state.routeActive].name + ' remains locked; preview cleared.' : 'Route preview cleared. No route is locked.';
    } else if (action === 'result-preview') {
      if (state.resultStamped) message = 'The synthetic result is already stamped for this page session.';
      else {
        state.resultPreview = true;
        message = 'Synthetic S result preview is ready. Confirm the stamp to record it locally.';
      }
    } else if (action === 'result-cancel') {
      state.resultPreview = false;
      message = 'Result stamp preview cancelled. No reward mark was recorded.';
    } else if (action === 'result-confirm') {
      if (state.resultStamped) message = 'One result mark is already recorded; this session blocks a repeat stamp.';
      else if (!state.resultPreview) message = 'Preview the result mark before stamping it.';
      else {
        state.resultStamped = true;
        state.resultPreview = false;
        message = 'Synthetic run result stamped once this page session.';
      }
    }
    return { state: state, message: message };
  }

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = { createSession: createSession, transition: transition };
  }

  if (typeof window === 'undefined' || !document.getElementById('screen-root')) return;

  let session = createSession();
  const root = document.getElementById('screen-root');
  const feedback = document.getElementById('feedback');

  function currentRoute() {
    const candidate = window.location.hash.slice(1);
    return routeIds.includes(candidate) ? candidate : 'crew-select';
  }

  function setBoundText(fragment, key, value) {
    fragment.querySelectorAll('[data-bind="' + key + '"]').forEach(function (node) { node.textContent = value; });
  }

  function decorateCrew(fragment) {
    const shown = session.crewPending || session.crewActive;
    const crew = crewNames[shown];
    setBoundText(fragment, 'crewPreviewLabel', session.crewPending ? 'PENDING CREW / PREVIEW' : 'ACTIVE RIDER');
    setBoundText(fragment, 'crewPreviewName', crew.name);
    setBoundText(fragment, 'crewPreviewStyle', crew.style);
    setBoundText(fragment, 'activeInitial', crewNames[session.crewActive].initial);
    setBoundText(fragment, 'crewFeedback', session.crewPending ? crew.name + ' is previewed; the active crew remains ' + crewNames[session.crewActive].name + '.' : crewNames[session.crewActive].name + ' is active for this page session.');
    fragment.querySelectorAll('[data-action="crew-preview"]').forEach(function (button) {
      const id = button.dataset.value;
      button.setAttribute('aria-pressed', String(session.crewPending ? session.crewPending === id : session.crewActive === id));
      button.classList.toggle('is-pending', session.crewPending === id);
      button.classList.toggle('is-active', !session.crewPending && session.crewActive === id);
    });
    fragment.querySelector('[data-action="crew-confirm"]').disabled = !session.crewPending || session.crewPending === session.crewActive;
    const input = fragment.querySelector('[data-edit="crewNote"]');
    input.value = session.crewNote;
  }

  function decorateRoute(fragment) {
    const id = session.routePending || session.routeActive;
    const route = id ? routeNames[id] : null;
    setBoundText(fragment, 'routePreviewName', route ? route.name : 'Choose a line on the map');
    setBoundText(fragment, 'routePreviewDetail', route ? route.detail + ' · synthetic route data' : 'Stops, tag count, and time window are synthetic demo values.');
    setBoundText(fragment, 'routeFeedback', session.routePending ? routeNames[session.routePending].name + ' is previewed; confirm or cancel the route.' : session.routeActive ? routeNames[session.routeActive].name + ' is locked for this page session.' : 'No route has been previewed.');
    fragment.querySelectorAll('[data-action="route-preview"]').forEach(function (button) {
      const selected = session.routePending === button.dataset.value;
      button.setAttribute('aria-pressed', String(selected));
      button.classList.toggle('is-selected', selected);
    });
    const a = fragment.querySelector('[data-bind-class="routeA"]');
    const b = fragment.querySelector('[data-bind-class="routeB"]');
    a.classList.toggle('is-live', id === 'north-arcade');
    b.classList.toggle('is-live', id === 'canal-market');
    fragment.querySelector('[data-action="route-confirm"]').disabled = !session.routePending;
    fragment.querySelector('[data-edit="routeNote"]').value = session.routeNote;
  }

  function decorateResults(fragment) {
    setBoundText(fragment, 'stampState', session.resultStamped ? 'ONE STAMP / PAGE SESSION' : session.resultPreview ? 'PREVIEW READY / NOT STAMPED' : 'NO PAGE-SESSION STAMP');
    setBoundText(fragment, 'stampHeading', session.resultStamped ? 'Synthetic mark recorded once.' : session.resultPreview ? 'S demo mark is waiting for your confirm.' : 'Preview the synthetic result mark.');
    fragment.querySelector('[data-action="result-confirm"]').disabled = !session.resultPreview || session.resultStamped;
    fragment.querySelector('[data-action="result-cancel"]').disabled = !session.resultPreview;
    fragment.querySelector('[data-action="result-preview"]').disabled = session.resultStamped;
    fragment.querySelector('[data-edit="runCaption"]').value = session.runCaption;
  }

  function render(focusAction) {
    const route = currentRoute();
    const template = document.getElementById('screen-' + route);
    const fragment = template.content.cloneNode(true);
    if (route === 'crew-select') decorateCrew(fragment);
    if (route === 'city-missions') decorateRoute(fragment);
    if (route === 'graffiti-results') decorateResults(fragment);
    root.replaceChildren(fragment);
    document.querySelectorAll('[data-route]').forEach(function (link) {
      if (link.dataset.route === route) link.setAttribute('aria-current', 'page');
      else link.removeAttribute('aria-current');
    });
    if (focusAction) {
      const target = root.querySelector('[data-action="' + focusAction + '"]');
      if (target && !target.disabled) target.focus();
      else feedback.focus();
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
    const action = route === 'crew-select' ? 'crew-cancel' : route === 'city-missions' ? 'route-cancel' : 'result-cancel';
    const pending = route === 'crew-select' ? session.crewPending : route === 'city-missions' ? session.routePending : session.resultPreview;
    if (pending) dispatch(action);
  });

  window.addEventListener('hashchange', function () { render(); });
  if (!window.location.hash || !routeIds.includes(window.location.hash.slice(1))) window.history.replaceState(null, '', '#crew-select');
  render();
}());
