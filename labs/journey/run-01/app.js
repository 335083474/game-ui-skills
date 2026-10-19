(function () {
  "use strict";

  const screens = [
    { id: "chapter-gates", title: "Gates along the route", description: "A scene-based gate path previews the next destination and requires an explicit crossing action." },
    { id: "journey-progress", title: "Named waypoints", description: "Passed, current, and ahead locations communicate progress without an invented route percentage." },
    { id: "companion-signals", title: "Companion signal", description: "Brief signal choices remain previews until an explicit local send action is selected." }
  ];

  function freshState() {
    return {
      currentGate: "Sand Arch",
      previewGate: "Wind Gate",
      confirmGate: false,
      waypointIndex: 1,
      confirmWaypoint: false,
      pendingSignal: "Chime",
      sentSignal: null,
      confirmSignal: false,
      notice: {
        "chapter-gates": "Gate selection is a preview only.",
        "journey-progress": "No route percentage is shown because total route length is unknown.",
        "companion-signals": "A chosen signal stays local until you confirm it."
      }
    };
  }

  function transition(state, action) {
    const next = Object.assign({}, state, { notice: Object.assign({}, state.notice) });
    if (action.type === "preview-gate") {
      next.previewGate = action.name;
      next.confirmGate = false;
      next.notice["chapter-gates"] = action.name === "High Dune"
        ? "High Dune is distant; it remains a destination preview."
        : "Preview: " + action.name + ". No crossing has happened.";
    }
    if (action.type === "request-crossing") {
      if (next.previewGate === "High Dune") {
        next.notice["chapter-gates"] = "High Dune is distant and cannot be crossed in this sample.";
      } else if (next.previewGate === next.currentGate) {
        next.notice["chapter-gates"] = next.currentGate + " is already the current local gate.";
      } else {
        next.confirmGate = true;
        next.notice["chapter-gates"] = "Confirm the crossing or keep the current gate.";
      }
    }
    if (action.type === "confirm-crossing" && next.confirmGate) {
      next.currentGate = next.previewGate;
      next.confirmGate = false;
      next.notice["chapter-gates"] = "Local route point changed to " + next.currentGate + ". No game progress was saved.";
    }
    if (action.type === "cancel-crossing" && next.confirmGate) {
      next.confirmGate = false;
      next.previewGate = next.currentGate;
      next.notice["chapter-gates"] = "Crossing canceled. " + next.currentGate + " remains current.";
    }
    if (action.type === "request-waypoint") {
      if (next.waypointIndex >= 2) {
        next.notice["journey-progress"] = "Sunlit Rise is the final waypoint in this local example.";
      } else {
        next.confirmWaypoint = true;
        next.notice["journey-progress"] = "Confirm the next crossing or remain at Sand Step.";
      }
    }
    if (action.type === "confirm-waypoint" && next.confirmWaypoint) {
      next.waypointIndex = Math.min(2, next.waypointIndex + 1);
      next.confirmWaypoint = false;
      next.notice["journey-progress"] = "Crossing confirmed. You are now at Sunlit Rise in this local example.";
    }
    if (action.type === "cancel-waypoint" && next.confirmWaypoint) {
      next.confirmWaypoint = false;
      next.notice["journey-progress"] = "Crossing canceled. Sand Step remains current.";
    }
    if (action.type === "preview-signal") {
      next.pendingSignal = action.name;
      next.confirmSignal = false;
      next.notice["companion-signals"] = action.name + " selected for preview; no signal has been sent.";
    }
    if (action.type === "request-signal") {
      next.confirmSignal = true;
      next.notice["companion-signals"] = "Confirm this local signal or cancel it.";
    }
    if (action.type === "confirm-signal" && next.confirmSignal) {
      next.sentSignal = next.pendingSignal;
      next.confirmSignal = false;
      next.notice["companion-signals"] = next.sentSignal + " is recorded in this local example; no other traveler received it.";
    }
    if (action.type === "cancel-signal" && next.confirmSignal) {
      next.confirmSignal = false;
      next.sentSignal = null;
      next.notice["companion-signals"] = "Signal canceled. " + next.pendingSignal + " remains only a preview.";
    }
    return next;
  }

  if (typeof module !== "undefined" && module.exports) {
    module.exports = { screens: screens, freshState: freshState, transition: transition };
    return;
  }

  const app = document.getElementById("app");
  let state = freshState();
  let hasRendered = false;
  const gates = [
    { name: "Sand Arch", state: "here", label: "Here", mark: "○" },
    { name: "Wind Gate", state: "ahead", label: "Ahead", mark: "◯" },
    { name: "High Dune", state: "distant", label: "Distant", mark: "○" }
  ];
  const waypointNames = ["Lower Shelf", "Sand Step", "Sunlit Rise"];
  const signalNames = ["Chime", "Wave", "Glow"];
  const signalMarks = { Chime: "◌", Wave: "∿", Glow: "✧" };

  function escapeText(value) {
    return String(value).replace(/[&<>"]/g, function (char) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[char];
    });
  }

  function routeId() {
    const id = location.hash.replace(/^#/, "");
    return screens.some(function (screen) { return screen.id === id; }) ? id : "chapter-gates";
  }

  function nav(active) {
    return '<header class="topline"><div class="brand"><span class="brand-mark" aria-hidden="true"></span><span>JOURNEY · 2019 PC DIRECTION</span></div>' +
      '<nav class="route-nav" aria-label="Study screens">' + screens.map(function (screen) {
        return '<button type="button" data-route="' + screen.id + '"' +
          (screen.id === active ? ' aria-current="page"' : "") + '>' + escapeText(screen.title) + '</button>';
      }).join("") + '</nav></header>';
  }

  function sceneCredit() {
    return '<p class="scene-credit">Generated desert and textile plate · no traveler or multiplayer link</p>';
  }

  function renderGates() {
    const choices = gates.map(function (gate) {
      const selected = state.previewGate === gate.name;
      return '<button class="gate-choice" type="button" data-gate="' + escapeText(gate.name) + '" data-state="' + gate.state + '" aria-label="' + escapeText(gate.name) + '" aria-pressed="' + String(selected) +
        '" data-focus="gate-' + gate.name.toLowerCase().replace(/ /g, "-") + '"><span class="gate-shape" aria-hidden="true"><span></span></span>' +
        '<span class="gate-name">' + escapeText(gate.name) + '</span><span class="gate-state">' + gate.label + '</span></button>';
    }).join("");
    const canCross = state.previewGate !== "High Dune" && state.previewGate !== state.currentGate;
    const confirm = state.confirmGate
      ? '<div class="confirm-row" role="group" aria-label="Confirm gate crossing"><p>Cross ' + escapeText(state.previewGate) + '? This changes only the local route marker.</p>' +
        '<button class="action" type="button" data-action="confirm-crossing" data-focus="confirm-gate">Confirm crossing to ' + escapeText(state.previewGate) + '</button>' +
        '<button class="secondary" type="button" data-action="cancel-crossing" data-focus="cancel-gate">Keep current gate</button></div>'
      : "";
    return '<main class="screen gates-screen">' + nav("chapter-gates") +
      '<section class="scene" aria-labelledby="screen-title"><div class="intro"><p class="eyebrow">SAND, STONE, AND RED CLOTH</p>' +
      '<h1 id="screen-title" tabindex="-1">Follow the quiet horizon.</h1><p class="lead">A gate is a place ahead, held in view until the traveler chooses to cross.</p></div>' +
      '<div class="gate-line" role="group" aria-label="Preview a gate">' + choices + '</div>' +
      '<div class="commit-strip"><p>Current gate: <strong>' + escapeText(state.currentGate) + '</strong> · Preview: <strong>' + escapeText(state.previewGate) + '</strong></p>' +
      '<button class="action" type="button" data-action="request-crossing" data-focus="request-crossing" ' + (canCross ? "" : "disabled") + '>Cross gate</button>' +
      '<p class="commit-status" role="status" aria-live="polite">' + escapeText(state.notice["chapter-gates"]) + '</p>' + confirm + '</div></section>' +
      sceneCredit() + '</main>';
  }

  function renderProgress() {
    const items = waypointNames.map(function (name, index) {
      const status = index < state.waypointIndex ? "passed" : (index === state.waypointIndex ? "here" : "ahead");
      const label = status === "passed" ? "Passed" : (status === "here" ? "Here" : "Ahead");
      const mark = status === "passed" ? "✓" : (status === "here" ? "●" : "○");
      return '<div class="waypoint" data-state="' + status + '"><span class="waypoint-mark" aria-hidden="true">' + mark + '</span>' +
        '<span class="waypoint-name">' + name + '</span><span class="waypoint-state">' + label + '</span></div>';
    }).join("");
    const confirm = state.confirmWaypoint
      ? '<div class="confirm-row" role="group" aria-label="Confirm waypoint crossing"><p>Cross from Sand Step to Sunlit Rise?</p>' +
        '<button class="action" type="button" data-action="confirm-waypoint" data-focus="confirm-waypoint">Confirm crossing to Sunlit Rise</button>' +
        '<button class="secondary" type="button" data-action="cancel-waypoint" data-focus="cancel-waypoint">Remain at Sand Step</button></div>'
      : "";
    const canAdvance = state.waypointIndex < 2;
    return '<main class="screen progress-scene">' + nav("journey-progress") +
      '<section class="scene progress-scene" aria-labelledby="screen-title"><div class="progress-intro"><p class="eyebrow">A ROUTE WITHOUT A METER</p>' +
      '<h1 id="screen-title" tabindex="-1">Know the place you are.</h1><p class="lead">Names and marks offer orientation while the dunes stay open.</p></div>' +
      '<div class="waypoints" aria-label="Named route waypoints">' + items + '</div>' +
      '<div class="progress-strip"><p>Current waypoint: <strong>' + waypointNames[state.waypointIndex] + '</strong><br>No percentage; the full route length is unknown.</p>' +
      '<button class="action" type="button" data-action="request-waypoint" data-focus="request-waypoint" ' + (canAdvance ? "" : "disabled") + '>Confirm next crossing</button>' +
      '<p class="commit-status" role="status" aria-live="polite">' + escapeText(state.notice["journey-progress"]) + '</p>' + confirm + '</div></section>' +
      sceneCredit() + '</main>';
  }

  function renderSignals() {
    const options = signalNames.map(function (name) {
      return '<button class="signal-option" type="button" data-signal="' + name + '" aria-pressed="' + String(state.pendingSignal === name) +
        '" data-focus="signal-' + name.toLowerCase() + '"><span class="signal-glyph" aria-hidden="true">' + signalMarks[name] + '</span>' + name + '</button>';
    }).join("");
    const confirm = state.confirmSignal
      ? '<div class="confirm-row" role="group" aria-label="Confirm a local signal"><p>Send ' + escapeText(state.pendingSignal) + '? This specimen has no network connection.</p>' +
        '<button class="action" type="button" data-action="confirm-signal" data-focus="confirm-signal">Confirm local ' + escapeText(state.pendingSignal) + '</button>' +
        '<button class="secondary" type="button" data-action="cancel-signal" data-focus="cancel-signal">Cancel signal</button></div>'
      : "";
    return '<main class="screen signal-screen">' + nav("companion-signals") +
      '<section class="scene" aria-labelledby="screen-title"><div class="signal-intro"><p class="eyebrow">A BRIEF COMPANION SIGNAL</p>' +
      '<h1 id="screen-title" tabindex="-1">Let the cloth speak.</h1><p class="lead">Choose a small expression. This local preview cannot reach another traveler.</p></div>' +
      '<section class="signal-console" aria-labelledby="signal-title"><h2 id="signal-title">Choose a signal</h2><p>Only the selected name is prepared.</p>' +
      '<div class="signal-options" role="group" aria-label="Preview a signal">' + options + '</div>' +
      '<div class="signal-actions"><button class="action" type="button" data-action="request-signal" data-focus="request-signal">Send signal</button>' +
      (state.sentSignal ? '<span class="signal-status">Last local signal: ' + escapeText(state.sentSignal) + '</span>' : "") + '</div>' +
      '<p class="signal-status" role="status" aria-live="polite">' + escapeText(state.notice["companion-signals"]) + '</p>' + confirm + '</section></section>' +
      sceneCredit() + '</main>';
  }

  function render(focusKey, moveToHeading) {
    const id = routeId();
    app.innerHTML = id === "chapter-gates" ? renderGates() : (id === "journey-progress" ? renderProgress() : renderSignals());
    if (moveToHeading && hasRendered) {
      const heading = app.querySelector("#screen-title");
      if (heading) heading.focus();
    } else if (focusKey) {
      const target = Array.from(app.querySelectorAll("[data-focus]")).find(function (item) { return item.dataset.focus === focusKey; });
      if (target) target.focus();
    }
    hasRendered = true;
  }

  app.addEventListener("click", function (event) {
    const button = event.target.closest("button");
    if (!button) return;
    const focusKey = button.dataset.focus || "";
    if (button.dataset.route) {
      const nextHash = "#" + button.dataset.route;
      if (location.hash === nextHash) render("", false);
      else location.hash = nextHash;
      return;
    }
    if (button.dataset.gate) {
      state = transition(state, { type: "preview-gate", name: button.dataset.gate });
      render(focusKey, false);
      return;
    }
    if (button.dataset.signal) {
      state = transition(state, { type: "preview-signal", name: button.dataset.signal });
      render(focusKey, false);
      return;
    }
    if (!button.dataset.action) return;
    state = transition(state, { type: button.dataset.action });
    render(focusKey, false);
  });

  document.addEventListener("keydown", function (event) {
    if (event.key !== "Escape") return;
    let focusKey = "";
    if (state.confirmGate) {
      state = transition(state, { type: "cancel-crossing" });
      focusKey = "cancel-gate";
    } else if (state.confirmWaypoint) {
      state = transition(state, { type: "cancel-waypoint" });
      focusKey = "cancel-waypoint";
    } else if (state.confirmSignal) {
      state = transition(state, { type: "cancel-signal" });
      focusKey = "cancel-signal";
    } else return;
    render(focusKey, false);
  });

  window.addEventListener("hashchange", function () { render("", true); });
  if (!location.hash || !screens.some(function (screen) { return screen.id === location.hash.slice(1); })) {
    history.replaceState(null, "", location.pathname + location.search + "#chapter-gates");
  }
  render("", false);
}());
