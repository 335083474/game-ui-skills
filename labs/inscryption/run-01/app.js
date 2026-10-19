(function (root) {
  "use strict";
  const cards = {
    "ash-owl": { name: "Ash Owl", art: "owl", kind: "creature", costText: "1 ember", cost: { ember: 1 }, attack: 1, health: 2, sigil: "WATCH", rule: "Keeps a quiet watch over the next turn." },
    "burrow-mouse": { name: "Burrow Mouse", art: "mouse", kind: "creature", costText: "free", cost: {}, attack: 1, health: 1, sigil: "NEST", rule: "Leaves one small trace when it departs." },
    "bracken-boar": { name: "Bracken Boar", art: "boar", kind: "creature", costText: "6 bone", cost: { bone: 6 }, attack: 2, health: 3, sigil: "ROOTED", rule: "Holds the line through rough ground." },
    "lantern-moth": { name: "Lantern Moth", art: "moth", kind: "creature", costText: "1 ember", cost: { ember: 1 }, attack: 1, health: 2, sigil: "LURE", rule: "Draws the eye away from a neighboring space." },
    "moss-bell": { name: "Moss Bell", art: "moth", kind: "event", costText: "trade", cost: {}, attack: null, health: null, sigil: "EVENT", rule: "A small bell that calls the forest to listen." }
  };
  const rewardIds = ["ash-owl", "burrow-mouse", "bracken-boar"];
  function initialState() {
    return {
      ember: 1, bone: 4, route: "card-reward", rewardChoice: "ash-owl", rewardClaimed: false,
      deck: { "ash-owl": 2, "burrow-mouse": 1, "lantern-moth": 1 },
      deckChoice: "ash-owl", deckFilter: "all", pendingRemove: null,
      tradeInspected: false, traded: false, notice: "Choose a card to study. Inspecting never spends a cost."
    };
  }
  function ownsCost(state, card) {
    return (!card.cost.ember || state.ember >= card.cost.ember) && (!card.cost.bone || state.bone >= card.cost.bone);
  }
  function transition(state, action) {
    const next = Object.assign({}, state, { deck: Object.assign({}, state.deck) });
    const card = cards[action.id];
    if (action.type === "SELECT_REWARD" && card && ownsCost(state, card) && !state.rewardClaimed) {
      next.rewardChoice = action.id; next.notice = card.name + " selected for inspection; no card or resource has changed.";
    } else if (action.type === "CLAIM_REWARD") {
      const reward = cards[state.rewardChoice];
      if (state.rewardClaimed) next.notice = "This reward was already claimed. The deck did not change again.";
      else if (!reward || !ownsCost(state, reward)) next.notice = "That card cannot be claimed with the tokens on the table.";
      else {
        next.deck[state.rewardChoice] = (next.deck[state.rewardChoice] || 0) + 1;
        next.ember -= reward.cost.ember || 0; next.bone -= reward.cost.bone || 0;
        next.rewardClaimed = true; next.deckChoice = state.rewardChoice;
        next.notice = "Reward added once: " + reward.name + " joined the binder.";
      }
    } else if (action.type === "SELECT_DECK" && card && (state.deck[action.id] || 0) > 0) {
      next.deckChoice = action.id; next.pendingRemove = null; next.notice = card.name + " selected. Removal requires a separate confirmation.";
    } else if (action.type === "FILTER") {
      next.deckFilter = action.filter; next.notice = "Binder view filtered to " + action.filter + "; collection counts are unchanged.";
    } else if (action.type === "ASK_REMOVE") {
      if ((state.deck[state.deckChoice] || 0) > 0) { next.pendingRemove = state.deckChoice; next.notice = "Confirm before removing one copy of " + cards[state.deckChoice].name + "."; }
    } else if (action.type === "CANCEL_REMOVE") {
      next.pendingRemove = null; next.notice = "Removal cancelled. The binder is unchanged.";
    } else if (action.type === "CONFIRM_REMOVE") {
      const id = state.pendingRemove;
      if (id && (state.deck[id] || 0) > 0) {
        next.deck[id] -= 1; if (next.deck[id] === 0) delete next.deck[id];
        next.pendingRemove = null; next.notice = "Removed one copy of " + cards[id].name + ". Binder count is now " + (next.deck[id] || 0) + ".";
      }
    } else if (action.type === "INSPECT_TRADE" && !state.traded) {
      next.tradeInspected = true; next.notice = "Exchange inspected: 2 bone leave the pouch; Moss Bell enters the binder.";
    } else if (action.type === "CANCEL_TRADE") {
      next.tradeInspected = false; next.notice = "Exchange cancelled. Tokens and binder are unchanged.";
    } else if (action.type === "COMMIT_TRADE") {
      if (state.traded) next.notice = "This exchange is already complete; no second card was created.";
      else if (!state.tradeInspected) next.notice = "Inspect the exchange before confirming it.";
      else if (state.bone < 2) next.notice = "Trade unavailable: 2 bone are required; " + state.bone + " are on the table.";
      else {
        next.bone -= 2; next.deck["moss-bell"] = (next.deck["moss-bell"] || 0) + 1;
        next.traded = true; next.notice = "Trade complete: Moss Bell entered your binder; bones 4 → 2.";
      }
    }
    return next;
  }
  const api = { initialState: initialState, transition: transition, cards: cards, rewardIds: rewardIds };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  if (!root || !root.document) return;

  let state = initialState();
  const app = root.document.getElementById("app");
  const esc = function (s) { return String(s).replace(/[&<>"]/g, function (c) { return ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]; }); };
  function routeId() {
    const id = root.location.hash.replace(/^#/, "");
    return ["card-reward", "deck", "trade-table"].indexOf(id) >= 0 ? id : "card-reward";
  }
  function nav(id) {
    return '<nav class="route-nav" aria-label="Cabin table pages">' +
      '<a href="#card-reward" ' + (id === "card-reward" ? 'aria-current="page"' : "") + '>01 · Card reward</a>' +
      '<a href="#deck" ' + (id === "deck" ? 'aria-current="page"' : "") + '>02 · Deck binder</a>' +
      '<a href="#trade-table" ' + (id === "trade-table" ? 'aria-current="page"' : "") + '>03 · Trade table</a></nav>';
  }
  function cardFace(id, disabled) {
    const c = cards[id], chosen = state.rewardChoice === id;
    return '<button class="forest-card" type="button" data-action="reward-select" data-id="' + id + '" aria-pressed="' + chosen + '"' + (disabled ? ' disabled aria-describedby="reward-limit"' : "") + '>' +
      '<span class="card-head"><span>' + c.name + '</span><span class="cost">' + (c.cost.ember ? '<span class="pip">E</span>' : "") + (c.cost.bone ? '<span class="pip bone">B</span>' : "") + esc(c.costText) + '</span></span>' +
      '<span class="creature ' + c.art + '" role="img" aria-label="Original carved ' + c.name.toLowerCase() + ' illustration"></span>' +
      '<span class="card-rule">' + c.rule + '</span><span class="card-stats"><span>' + (c.attack === null ? "—" : c.attack + " ATK") + '</span><span>' + (c.health === null ? "—" : c.health + " HP") + '</span></span>' +
      '<span class="sigil">' + c.sigil + ' · ' + c.kind.toUpperCase() + '</span>' +
      (disabled ? '<span class="unaffordable">Need 6 bone; carry ' + state.bone + '. Unaffordable.</span>' : "") + '</button>';
  }
  function rewardScreen() {
    const c = cards[state.rewardChoice];
    return '<p class="eyebrow">A card offered at the forest table</p><h2 class="screen-title">Card reward</h2><p class="screen-lead">Hold a choice over the lamp, read its cost and sigil, then add it once to the binder.</p>' +
      '<section class="desk" aria-label="Reward cards on the table"><div class="reward-lane">' +
      rewardIds.map(function (id) { return cardFace(id, !ownsCost(state, cards[id]) || state.rewardClaimed); }).join("") +
      '</div><div class="work-row"><div class="selected-paper"><p class="eyebrow">Selected under the lamp</p><h3>' + c.name + '</h3><p>' + c.rule + '</p><div class="ledger-line"><span>Cost</span><strong>' + c.costText + '</strong></div><div class="ledger-line"><span>Tokens left</span><strong>' + state.ember + ' ember · ' + state.bone + ' bone</strong></div>' +
      '<div class="actions"><button class="action primary" data-action="reward-claim" type="button"' + (state.rewardClaimed || !ownsCost(state, c) ? " disabled" : "") + '>' + (state.rewardClaimed ? "Reward already claimed" : "Add " + c.name + " to deck") + '</button></div></div>' +
      '<aside class="detail-paper"><p class="eyebrow">Reading the marks</p><p><strong>Attack ' + c.attack + '</strong> · <strong>Health ' + c.health + '</strong></p><p>' + c.sigil + ' is named in text, not only by its carved mark.</p><p id="reward-limit" class="mono">Unavailable choice: the Bracken Boar needs 6 bone.</p></aside></div>' +
      '<p class="statusline" role="status" aria-live="polite">' + esc(state.notice) + '</p></section>';
  }
  function deckScreen() {
    const selected = cards[state.deckChoice] || cards["ash-owl"];
    const entries = Object.keys(state.deck).filter(function (id) { return state.deck[id] > 0 && (state.deckFilter === "all" || cards[id].kind === state.deckFilter); });
    return '<p class="eyebrow">Owned cards · selection does not remove</p><h2 class="screen-title">Deck binder</h2><p class="screen-lead">Turn the paper tabs to browse. A selected card remains in the binder until a removal is confirmed.</p><section class="desk binder">' +
      '<div><div class="filter-row" role="group" aria-label="Filter binder"><button class="filter" data-action="filter" data-filter="all" aria-pressed="' + (state.deckFilter === "all") + '">All</button><button class="filter" data-action="filter" data-filter="creature" aria-pressed="' + (state.deckFilter === "creature") + '">Creatures</button><button class="filter" data-action="filter" data-filter="event" aria-pressed="' + (state.deckFilter === "event") + '">Events</button></div><div class="card-index" aria-label="Cards in binder">' +
      entries.map(function (id) { return '<button class="binder-entry" type="button" data-action="deck-select" data-id="' + id + '" aria-label="Select ' + cards[id].name + '" aria-pressed="' + (state.deckChoice === id) + '"><span>' + cards[id].name + '<small class="mono"> · ' + cards[id].costText + '</small></span><span class="copy-count">×' + state.deck[id] + '</span></button>'; }).join("") +
      (entries.length ? "" : '<p>No cards under this tab.</p>') + '</div></div>' +
      '<article class="detail-paper"><p class="eyebrow">Binder leaf · owned ×' + (state.deck[state.deckChoice] || 0) + '</p><h3>' + selected.name + '</h3><p>' + selected.rule + '</p><div class="ledger-line"><span>Type</span><strong>' + selected.kind + '</strong></div><div class="ledger-line"><span>Cost / marks</span><strong>' + selected.costText + ' · ' + selected.attack + '/game-ui-skills/' + selected.health + '</strong></div><div class="ledger-line"><span>Sigil</span><strong>' + selected.sigil + '</strong></div>' +
      (state.pendingRemove ? '<div class="notice" role="alert">Remove one copy of ' + cards[state.pendingRemove].name + '? This is a separate confirmation.</div><div class="actions"><button class="action primary" data-action="remove-confirm">Confirm remove ' + cards[state.pendingRemove].name + '</button><button class="action" data-action="remove-cancel">Cancel removal</button></div>' :
      '<div class="actions"><button class="action" data-action="remove-ask"' + (!(state.deck[state.deckChoice] > 0) ? " disabled" : "") + '>Remove one copy</button></div>') +
      '<p class="statusline" role="status" aria-live="polite">' + esc(state.notice) + '</p></article></section>';
  }
  function tradeScreen() {
    return '<p class="eyebrow">Offer on the left · receive on the right</p><h2 class="screen-title">Trade table</h2><p class="screen-lead">Inspect both sides and the token price before committing one atomic exchange.</p><section class="desk">' +
      '<div class="trade-stage"><article class="trade-object"><p class="eyebrow">Leaves your pouch</p><h3>Two bone tokens</h3><p>Payment: 2 bone</p><div class="ledger-line"><span>Available</span><strong>' + state.bone + ' bone</strong></div></article><div class="exchange-mark" aria-hidden="true">⇄</div><article class="trade-object"><p class="eyebrow">Enters the binder</p><h3>Moss Bell</h3><p>A small event card with the “Listen” mark.</p><div class="ledger-line"><span>Collection</span><strong>×' + (state.deck["moss-bell"] || 0) + '</strong></div></article></div>' +
      '<div class="actions"><button class="action" data-action="trade-inspect"' + (state.traded ? " disabled" : "") + '>Inspect exchange</button>' +
      '<button class="action primary" data-action="trade-commit"' + (!state.tradeInspected || state.traded || state.bone < 2 ? " disabled" : "") + '>Confirm trade: pay 2 bone for Moss Bell</button>' +
      '<button class="action" data-action="trade-cancel"' + (!state.tradeInspected || state.traded ? " disabled" : "") + '>Cancel exchange</button></div>' +
      (state.tradeInspected && !state.traded ? '<div class="notice">Review: 2 bone leave; Moss Bell enters. Both sides change together after confirmation.</div>' : "") +
      '<p class="statusline" role="status" aria-live="polite">' + esc(state.notice) + '</p></section>';
  }
  function render() {
    const id = routeId(); state.route = id;
    const screen = id === "card-reward" ? rewardScreen() : (id === "deck" ? deckScreen() : tradeScreen());
    app.innerHTML = '<main class="cabin"><header class="mast"><h1>Cabin Table / Original Forest Study</h1><span class="edition">Synthetic cards · offline prototype</span></header>' + nav(id) + screen + '</main>';
  }
  app.addEventListener("click", function (event) {
    const button = event.target.closest("[data-action]");
    if (!button || button.disabled) return;
    const kind = button.dataset.action;
    if (kind === "reward-select") state = transition(state, { type: "SELECT_REWARD", id: button.dataset.id });
    else if (kind === "reward-claim") state = transition(state, { type: "CLAIM_REWARD" });
    else if (kind === "deck-select") state = transition(state, { type: "SELECT_DECK", id: button.dataset.id });
    else if (kind === "filter") state = transition(state, { type: "FILTER", filter: button.dataset.filter });
    else if (kind === "remove-ask") state = transition(state, { type: "ASK_REMOVE" });
    else if (kind === "remove-cancel") state = transition(state, { type: "CANCEL_REMOVE" });
    else if (kind === "remove-confirm") state = transition(state, { type: "CONFIRM_REMOVE" });
    else if (kind === "trade-inspect") state = transition(state, { type: "INSPECT_TRADE" });
    else if (kind === "trade-cancel") state = transition(state, { type: "CANCEL_TRADE" });
    else if (kind === "trade-commit") state = transition(state, { type: "COMMIT_TRADE" });
    render();
  });
  root.addEventListener("hashchange", render);
  render();
})(typeof window !== "undefined" ? window : null);
