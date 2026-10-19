(function (root, factory) {
  const api = factory();
  root.GameUiStudy = api;
  if (typeof module === "object" && module.exports) module.exports = api;
  if (root && root.document) api.mount(root.document, root);
})(globalThis, function () {
  "use strict";

  function createInitialState() {
    return { selected: {}, messages: {}, rosterSlot: null, purse: 250, bandages: 0, claimedReward: null, lastPurchase: null };
  }

  function reduce(state, event) {
    const next = { ...state, selected: { ...state.selected }, messages: { ...state.messages } };
    if (event.type === "select") {
      next.selected[event.screenId] = event.key;
      if (event.screenId === "provision-shop") next.lastPurchase = null;
      return next;
    }
    if (event.type !== "commit") return next;
    const choice = next.selected[event.screenId];

    if (event.screenId === "expedition-roster" && event.action === "deploy" && choice) {
      const names = { rook: "Rook Vale", althea: "Sister Althea", bram: "Bram Holt" };
      next.rosterSlot = choice;
      next.messages[event.screenId] = names[choice] + " assigned to the first rank.";
    } else if (event.screenId === "provision-shop" && event.action === "purchase" && choice) {
      const prices = { bandage: 35, torch: 20, ration: 25 };
      const names = { bandage: "Bandage", torch: "Torch", ration: "Ration" };
      const price = prices[choice];
      if (next.purse >= price) {
        next.purse -= price;
        next.lastPurchase = choice;
        if (choice === "bandage") next.bandages += 1;
        next.messages[event.screenId] = names[choice] + " added to provisions · " + next.purse + " gold remaining.";
      } else {
        next.messages[event.screenId] = "The purse is too light for that supply.";
      }
    } else if (event.screenId === "expedition-reward" && event.action === "claim" && choice && !next.claimedReward) {
      const names = { portrait: "Ancient Portrait", deed: "Torn Deed", journal: "Worn Journal" };
      next.claimedReward = choice;
      next.messages[event.screenId] = names[choice] + " secured for the journey.";
    }
    return next;
  }

  function bindText(doc, state) {
    const names = { rook: "Rook Vale", althea: "Sister Althea", bram: "Bram Holt" };
    const supplies = { bandage: "Bandage · 35 gold", torch: "Torch · 20 gold", ration: "Ration · 25 gold" };
    const prices = { bandage: 35, torch: 20, ration: 25 };
    doc.querySelectorAll("[data-bind]").forEach(function (node) {
      const screen = node.closest("[data-screen]");
      const screenId = screen ? screen.id : "";
      const choice = state.selected[screenId];
      switch (node.dataset.bind) {
        case "roster-slot":
          node.textContent = state.rosterSlot ? names[state.rosterSlot].toUpperCase() : "OPEN";
          break;
        case "purse":
          node.textContent = String(state.purse);
          break;
        case "bandages":
          node.textContent = String(state.bandages);
          break;
        case "supply":
          node.textContent = supplies[choice] || "—";
          break;
        case "after-price":
          node.textContent = choice ? (state.lastPurchase === choice ? state.purse : state.purse - prices[choice]) + " gold" : "—";
          break;
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
        if (screen.id === "expedition-reward" && state.claimedReward) {
          button.disabled = true;
          button.textContent = "Heirloom secured";
        }
      });
    });
  }

  function route(doc, win, moveFocus) {
    const hashId = decodeURIComponent((win.location.hash || "").slice(1));
    const target = doc.getElementById(hashId);
    const active = target && target.matches("[data-screen]") ? target : doc.getElementById("expedition-roster");
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