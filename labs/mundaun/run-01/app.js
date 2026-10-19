(function (root, factory) {
  const api = factory();
  root.GameUiStudy = api;
  if (typeof module === "object" && module.exports) module.exports = api;
  if (root && root.document) api.mount(root.document, root);
})(globalThis, function () {
  "use strict";

  const objects = {
    "brass-key": { name: "Brass key", note: "A small tooth is bent toward the old mill. The ring has gone dark from handling.", weight: "120 G" },
    "lamp-oil": { name: "Lamp oil", note: "The glass is warm. A little remains for one steep walk after sundown.", weight: "340 G" },
    "chapel-rubbing": { name: "Chapel rubbing", note: "Charcoal has caught a crooked mark beneath the chapel bell.", weight: "80 G" },
    "iron-nail": { name: "Iron nail", note: "A square head, pitted at the edge. It may hold a loose board in place.", weight: "45 G" },
    "prayer-knot": { name: "Prayer knot", note: "Two cords pull against each other. One end has begun to fray.", weight: "20 G" },
    "sugar-cube": { name: "Sugar cube", note: "Wrapped against the damp. Save it for the walk above the tree line.", weight: "15 G" }
  };
  const entries = {
    "chapel-tracks": { page: "07", title: "Tracks beside the chapel", copy: "The marks turn uphill where the path narrows. Snow has softened their edges, but not the weight.", thought: "I should leave the lamp lit." },
    "snow-line": { page: "08", title: "Snow line moved", copy: "The old line has climbed above the dark pines. The ground beneath it is softer than it looks.", thought: "Keep to the stones." },
    "bell-rope": { page: "09", title: "Bell rope cut", copy: "The rope ends cleanly at the beam. No fibers caught on the nail, no dust disturbed below.", thought: "Someone wanted silence." }
  };
  const destinations = { "old-chapel": "Old Chapel", "stone-cairn": "Stone Cairn", "upper-mill": "Upper Mill" };

  function createInitialState() {
    return {
      selected: {},
      messages: {},
      quickSlot: null,
      pinnedObservation: null,
      mapDestination: null,
      activeEntry: "chapel-tracks"
    };
  }

  function reduce(state, event) {
    const next = { ...state, selected: { ...state.selected }, messages: { ...state.messages } };
    if (event.type === "select") {
      next.selected[event.screenId] = event.key;
      if (event.screenId === "journal" && entries[event.key]) next.activeEntry = event.key;
      return next;
    }
    if (event.type !== "commit") return next;
    const choice = next.selected[event.screenId];

    if (event.screenId === "satchel" && event.action === "ready" && choice && objects[choice]) {
      next.quickSlot = choice;
      next.messages[event.screenId] = objects[choice].name + " readied in quick slot 1.";
    } else if (event.screenId === "journal" && event.action === "pin" && choice && entries[choice]) {
      next.pinnedObservation = choice;
      next.messages[event.screenId] = entries[choice].title + " pinned to the map.";
    } else if (event.screenId === "trail-map" && event.action === "mark" && choice && destinations[choice]) {
      next.mapDestination = choice;
      next.messages[event.screenId] = destinations[choice] + " marked · follow the red pencil trail.";
    }
    return next;
  }

  function bindText(doc, state) {
    const object = objects[state.selected.satchel] || null;
    const entry = entries[state.activeEntry] || entries["chapel-tracks"];
    const values = {
      "object-name": object ? object.name : "No object chosen",
      "object-note": object ? object.note : "Select one item from the pack to read its margin note.",
      "object-weight": object ? object.weight : "—",
      "quick-slot": state.quickSlot ? objects[state.quickSlot].name.toUpperCase() : "EMPTY",
      "entry-page": entry.page,
      "entry-title": entry.title,
      "entry-copy": entry.copy,
      "entry-thought": entry.thought,
      "map-destination": state.mapDestination ? destinations[state.mapDestination] : "None marked"
    };
    doc.querySelectorAll("[data-bind]").forEach(function (node) {
      if (Object.prototype.hasOwnProperty.call(values, node.dataset.bind)) node.textContent = values[node.dataset.bind];
    });

    const sketch = doc.querySelector(".large-sketch");
    const selectedObject = state.selected.satchel;
    if (sketch && selectedObject) {
      const source = doc.querySelector('#satchel [data-select="' + selectedObject + '"] svg');
      if (source) {
        const copy = source.cloneNode(true);
        sketch.replaceChildren(copy);
      }
    }

    doc.querySelectorAll("[data-result]").forEach(function (node) {
      const screen = node.closest("[data-screen]");
      if (screen && state.messages[screen.id]) node.textContent = state.messages[screen.id];
    });
    doc.querySelectorAll("[data-screen]").forEach(function (screen) {
      const chosen = state.selected[screen.id];
      screen.querySelectorAll("[data-select]").forEach(function (button) {
        button.setAttribute("aria-pressed", String(button.dataset.select === chosen));
      });
      screen.querySelectorAll("[data-commit]").forEach(function (button) { button.disabled = !chosen; });
    });
  }

  function route(doc, win, moveFocus) {
    const hashId = decodeURIComponent((win.location.hash || "").slice(1));
    const target = doc.getElementById(hashId);
    const active = target && target.matches("[data-screen]") ? target : doc.getElementById("satchel");
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