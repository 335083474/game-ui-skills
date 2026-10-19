(function (root, factory) {
  const api = factory();
  root.GameUiStudy = api;
  if (typeof module === "object" && module.exports) module.exports = api;
  if (root && root.document) api.mount(root.document, root);
})(globalThis, function () {
  "use strict";

  const titles = {
    "mask-collection": "Masks",
    "quest-journal": "Journal",
    "desert-map": "Map"
  };

  const entries = {
    "old-hull": { number: "06", title: "A Place to Call Home", copy: "Find the machinist near the old hull. She knows which parts can still cross the western flats.", clue: "Follow the long shadow toward the broken mast." },
    "glass-well": { number: "11", title: "Water Below the Glass", copy: "A pale seam crosses the basin. Look for a blue glint where the dune settles.", clue: "Keep the sun on your left until the stones turn white." },
    "north-fork": { number: "14", title: "The North Fork", copy: "A rider left a mark where the wind splits around the low ridge.", clue: "Take the quieter track past the three dark posts." }
  };

  const maskNames = { ibex: "Ibex", beetle: "Beetle", hare: "Hare", makak: "Makak" };
  const landmarkNames = { windmill: "Windmill", "old-hull": "Old Hull", "salt-road": "Salt Road" };

  function createInitialState() {
    return {
      selected: {},
      messages: {},
      wornMask: "makak",
      trackedLead: null,
      waypoint: null,
      activeEntry: "old-hull"
    };
  }

  function reduce(state, event) {
    const next = { ...state, selected: { ...state.selected }, messages: { ...state.messages } };
    if (event.type === "select") {
      next.selected[event.screenId] = event.key;
      if (event.screenId === "quest-journal" && entries[event.key]) next.activeEntry = event.key;
      return next;
    }
    if (event.type !== "commit") return next;
    const choice = next.selected[event.screenId];

    if (event.screenId === "mask-collection" && event.action === "wear" && choice) {
      next.wornMask = choice;
      next.messages[event.screenId] = maskNames[choice] + " mask worn. Journey continues.";
    } else if (event.screenId === "quest-journal" && event.action === "track" && choice) {
      next.trackedLead = choice;
      const title = entries[choice].title;
      next.messages[event.screenId] = title + " marked for your next ride.";
    } else if (event.screenId === "desert-map" && event.action === "waypoint" && choice) {
      next.waypoint = choice;
      next.messages[event.screenId] = landmarkNames[choice] + " waypoint set · 2.4 km east.";
    }
    return next;
  }

  function bindText(doc, state) {
    const entry = entries[state.activeEntry] || entries["old-hull"];
    const selectedLead = state.selected["quest-journal"];
    const selectedLandmark = state.selected["desert-map"];
    const values = {
      "worn-mask": state.wornMask ? maskNames[state.wornMask] : "None",
      "entry-number": selectedLead ? entry.number : "—",
      "clue-number": selectedLead ? entry.number : "06",
      "lead-title": entry.title,
      "lead-copy": entry.copy,
      "route-clue": entry.clue,
      "waypoint": state.waypoint ? landmarkNames[state.waypoint] : "None marked"
    };
    doc.querySelectorAll("[data-bind]").forEach(function (node) {
      if (Object.prototype.hasOwnProperty.call(values, node.dataset.bind)) {
        node.textContent = values[node.dataset.bind];
      }
    });
    doc.querySelectorAll("[data-result]").forEach(function (node) {
      const screen = node.closest("[data-screen]");
      if (screen && state.messages[screen.id]) node.textContent = state.messages[screen.id];
    });
    doc.querySelectorAll("[data-screen]").forEach(function (screen) {
      const chosen = state.selected[screen.id];
      screen.querySelectorAll("[data-select]").forEach(function (button) {
        button.setAttribute("aria-pressed", String(button.dataset.select === chosen));
      });
      screen.querySelectorAll("[data-commit]").forEach(function (button) {
        button.disabled = !chosen;
      });
    });
  }

  function route(doc, win, moveFocus) {
    const hashId = decodeURIComponent((win.location.hash || "").slice(1));
    const target = doc.getElementById(hashId);
    const active = target && target.matches("[data-screen]") ? target : doc.getElementById("mask-collection");
    doc.querySelectorAll("[data-screen]").forEach(function (screen) { screen.hidden = screen !== active; });
    doc.querySelectorAll(".route-nav a").forEach(function (link) {
      if (link.getAttribute("href") === "#" + active.id) link.setAttribute("aria-current", "page");
      else link.removeAttribute("aria-current");
    });
    if (moveFocus) {
      const heading = active.querySelector("h1");
      if (heading) heading.focus({ preventScroll: true });
    }
  }

  function mount(doc, win) {
    const state = createInitialState();
    route(doc, win, false);
    bindText(doc, state);
    doc.addEventListener("click", function (event) {
      const selectButton = event.target.closest("[data-select]");
      if (selectButton && !selectButton.disabled) {
        const screen = selectButton.closest("[data-screen]");
        Object.assign(state, reduce(state, { type: "select", screenId: screen.id, key: selectButton.dataset.select }));
        bindText(doc, state);
        return;
      }
      const commitButton = event.target.closest("[data-commit]");
      if (commitButton && !commitButton.disabled) {
        const screen = commitButton.closest("[data-screen]");
        Object.assign(state, reduce(state, { type: "commit", screenId: screen.id, action: commitButton.dataset.commit }));
        bindText(doc, state);
      }
    });
    win.addEventListener("hashchange", function () { route(doc, win, true); });
    return state;
  }

  return { createInitialState: createInitialState, reduce: reduce, mount: mount };
});