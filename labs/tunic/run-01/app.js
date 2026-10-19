(function (root, factory) {
  const api = factory();
  root.GameUiStudy = api;
  if (typeof module === "object" && module.exports) module.exports = api;
  if (root && root.document) api.mount(root.document, root);
})(globalThis, function () {
  "use strict";

  const items = {
    "worn-blade": { name: "Worn blade", use: "Attack · a small edge for a close path." },
    "red-seed": { name: "Red seed", use: "Growth · plant where the ground is soft." },
    "glass-key": { name: "Glass key", use: "Tool · a bright tooth for a narrow lock." },
    "field-page": { name: "Field page", use: "Notes · a copied mark from leaf 18." },
    "sun-token": { name: "Sun token", use: "Relic · a warm circle with a worn edge." },
    "blue-shard": { name: "Blue shard", use: "Stone · a cool fragment from the shore." }
  };
  const pages = {
    movement: { number: "18", title: "A path beneath the bell", copy: "The bell marks the lower crossing. A small mark appears only after the gate has been opened.", tag1: "MOVE", tag2: "SECRET" },
    marks: { number: "23", title: "Read the stone marks", copy: "Three short lines face the water. Turn the page toward the low light before tracing them.", tag1: "STONE", tag2: "LOOK" },
    secret: { number: "31", title: "What the wall remembers", copy: "A quiet seam waits behind the old painting. The shape is easier to see after the room grows still.", tag1: "HIDDEN", tag2: "WAIT" }
  };
  const destinations = { "bell-tower": "Bell Tower", "stone-quarry": "Stone Quarry", "quiet-grove": "Quiet Grove" };

  function createInitialState() {
    return {
      selected: {},
      messages: {},
      equippedItem: null,
      bookmark: null,
      route: null
    };
  }

  function reduce(state, event) {
    const next = { ...state, selected: { ...state.selected }, messages: { ...state.messages } };
    if (event.type === "select") {
      next.selected[event.screenId] = event.key;
      return next;
    }
    if (event.type !== "commit") return next;
    const choice = next.selected[event.screenId];

    if (event.screenId === "inventory" && event.action === "equip" && choice && items[choice]) {
      next.equippedItem = choice;
      next.messages[event.screenId] = items[choice].name + " equipped · attack slot ready.";
    } else if (event.screenId === "manual" && event.action === "bookmark" && choice && pages[choice]) {
      next.bookmark = choice;
      next.messages[event.screenId] = "Page " + pages[choice].number + " bookmarked · " + (choice === "movement" ? "Movement" : pages[choice].title) + ".";
    } else if (event.screenId === "island-map" && event.action === "route" && choice && destinations[choice]) {
      next.route = choice;
      next.messages[event.screenId] = destinations[choice] + " route set · one crossing.";
    }
    return next;
  }

  function bindText(doc, state) {
    const item = items[state.selected.inventory] || null;
    const page = pages[state.selected.manual] || pages.movement;
    const values = {
      "item-name": item ? item.name : "No item selected",
      "item-use": item ? item.use : "Select an object from the tray.",
      "equipped-item": state.equippedItem ? items[state.equippedItem].name.toUpperCase() : "EMPTY",
      "page-number": page.number,
      "page-number-bottom": page.number,
      "page-title": page.title,
      "page-copy": page.copy,
      "page-tag-one": page.tag1,
      "page-tag-two": page.tag2,
      "map-route": state.route ? destinations[state.route] : "No route marked"
    };
    doc.querySelectorAll("[data-bind]").forEach(function (node) {
      if (Object.prototype.hasOwnProperty.call(values, node.dataset.bind)) node.textContent = values[node.dataset.bind];
    });

    const display = doc.querySelector(".display-object");
    if (display) {
      const selected = state.selected.inventory;
      display.dataset.item = selected || "";
      const source = selected ? doc.querySelector('#inventory [data-select="' + selected + '"] .item-form') : null;
      if (source) display.replaceChildren(source.cloneNode(true));
      else display.replaceChildren();
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
    const active = target && target.matches("[data-screen]") ? target : doc.getElementById("inventory");
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