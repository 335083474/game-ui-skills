(function (root) {
  "use strict";
  const commands = ["STRIKE", "SPEAK", "ITEMS", "WITHDRAW"];
  const targets = [{ id: "paper-golem", name: "Paper Golem" }];
  const items = [
    { id: "mint-biscuit", name: "Mint Biscuit", quantity: 2, restore: 8, effect: "A cool mint smell. Restores 8 stamina in this synthetic demo." },
    { id: "warm-broth", name: "Warm Broth", quantity: 1, restore: 5, effect: "A small cup of broth. Restores 5 stamina in this synthetic demo." }
  ];
  const branches = {
    hinge: { label: "Ask about the hinge", response: "The golem points to a loose hinge pin. The door is still shut." },
    biscuit: { label: "Offer the mint biscuit", response: "The golem watches the wrapper, then shakes its head. Your inventory is unchanged." },
    wait: { label: "Wait", response: "Dust settles. The golem draws a second circle beside the door." }
  };
  function initialState() {
    return { route: "battle-commands", selectedCommand: "", selectedTarget: "", targetOpen: false, commandResolved: false, playerStamina: 14, enemyStamina: 18, selectedItem: "mint-biscuit", inventory: { "mint-biscuit": 2, "warm-broth": 1 }, pendingItem: "", itemTarget: "", dialogueStage: 0, selectedChoice: "", dialogueResponse: "", notice: "Encounter 07. Selection and confirmation are separate; this local demo resets on reload." };
  }
  function transition(state, action) {
    const next = Object.assign({}, state, { inventory: Object.assign({}, state.inventory) });
    if (action.type === "SELECT_COMMAND" && commands.includes(action.id) && !state.commandResolved) {
      next.selectedCommand = action.id; next.targetOpen = false; next.notice = action.id + " selected. Confirm or open its target layer before resolving.";
    } else if (action.type === "OPEN_TARGET" && ["STRIKE", "SPEAK"].includes(state.selectedCommand) && !state.commandResolved) {
      next.targetOpen = true; next.notice = "Choose a target for " + state.selectedCommand + ". No encounter state has changed.";
    } else if (action.type === "SELECT_TARGET" && targets.some(function (t) { return t.id === action.id; }) && state.targetOpen) {
      next.selectedTarget = action.id; next.notice = targets.find(function (t) { return t.id === action.id; }).name + " selected for " + state.selectedCommand + ".";
    } else if (action.type === "CONFIRM_COMMAND" && state.targetOpen && state.selectedCommand && state.selectedTarget && !state.commandResolved) {
      next.targetOpen = false; next.commandResolved = true;
      if (state.selectedCommand === "STRIKE") {
        next.enemyStamina = Math.max(0, state.enemyStamina - 6);
        next.notice = "STRIKE resolved once against Paper Golem: stamina " + state.enemyStamina + " → " + next.enemyStamina + ".";
      } else next.notice = "SPEAK resolved with Paper Golem. The encounter remains active; no stamina changed.";
    } else if (action.type === "CONFIRM_WITHDRAW" && state.selectedCommand === "WITHDRAW" && !state.commandResolved) {
      next.commandResolved = true; next.notice = "WITHDRAW confirmed. The encounter is paused in this synthetic demo.";
    } else if (action.type === "CANCEL_LAYER" && state.targetOpen) {
      next.targetOpen = false; next.notice = "Returned to commands. " + state.selectedCommand + " remains selected.";
    } else if (action.type === "SELECT_ITEM" && items.some(function (item) { return item.id === action.id; })) {
      next.selectedItem = action.id; next.pendingItem = ""; next.itemTarget = ""; next.notice = items.find(function (item) { return item.id === action.id; }).name + " selected for inspection; quantity is unchanged.";
    } else if (action.type === "REQUEST_ITEM_USE" && state.inventory[state.selectedItem] > 0 && state.playerStamina < 24) {
      next.pendingItem = state.selectedItem; next.itemTarget = ""; next.notice = "Choose a target for " + itemName(state.selectedItem) + ". Nothing has been consumed.";
    } else if (action.type === "SELECT_ITEM_TARGET" && action.id === "rowan" && state.pendingItem) {
      next.itemTarget = action.id; next.notice = "Rowan selected. Confirm to consume one " + itemName(state.pendingItem) + ".";
    } else if (action.type === "CONFIRM_ITEM_USE" && state.pendingItem && state.itemTarget === "rowan" && state.inventory[state.pendingItem] > 0 && state.playerStamina < 24) {
      const item = items.find(function (entry) { return entry.id === state.pendingItem; });
      const before = state.playerStamina;
      next.inventory[state.pendingItem] -= 1; next.playerStamina = Math.min(24, state.playerStamina + item.restore); next.pendingItem = ""; next.itemTarget = "";
      next.notice = item.name + " used on Rowan: stamina " + before + " → " + next.playerStamina + ". Quantity: " + next.inventory[item.id] + ".";
    } else if (action.type === "CANCEL_ITEM_USE" && state.pendingItem) {
      next.pendingItem = ""; next.itemTarget = ""; next.notice = "Item use cancelled. Inventory and stamina are unchanged.";
    } else if (action.type === "CONTINUE_DIALOGUE" && state.dialogueStage === 0) {
      next.dialogueStage = 1; next.notice = "The passage is fully visible. Choose a text response, then confirm it.";
    } else if (action.type === "SELECT_DIALOGUE_CHOICE" && branches[action.id] && state.dialogueStage === 1) {
      next.selectedChoice = action.id; next.notice = "Preview: " + branches[action.id].label + ". No branch response has been recorded.";
    } else if (action.type === "CONFIRM_DIALOGUE_CHOICE" && state.selectedChoice && state.dialogueStage === 1) {
      next.dialogueResponse = branches[state.selectedChoice].response; next.dialogueStage = 2; next.notice = next.dialogueResponse;
    } else if (action.type === "BACK_TO_CHOICES" && state.dialogueStage === 2) {
      next.dialogueStage = 1; next.notice = "Returned to the choice list. The dialogue remains available.";
    }
    return next;
  }
  function itemName(id) { const item = items.find(function (entry) { return entry.id === id; }); return item ? item.name : id; }
  const api = { initialState: initialState, transition: transition, commands: commands, items: items, branches: branches };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  if (!root || !root.document) return;

  let state = initialState();
  const app = root.document.getElementById("app");
  function esc(value) { return String(value).replace(/[&<>"']/g, function (c) { return ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]; }); }
  function routeId() { const id = root.location.hash.replace(/^#/, ""); return ["battle-commands", "items", "dialogue"].includes(id) ? id : "battle-commands"; }
  function nav(id) { return '<nav class="scene-nav" aria-label="Encounter pages"><a href="#battle-commands" ' + (id === "battle-commands" ? 'aria-current="page"' : "") + '>Battle commands</a><a href="#items" ' + (id === "items" ? 'aria-current="page"' : "") + '>Items</a><a href="#dialogue" ' + (id === "dialogue" ? 'aria-current="page"' : "") + '>Dialogue</a></nav>'; }
  function battle() {
    return '<h2 class="screen-kicker">Battle commands / Encounter 07</h2><div class="playfield" aria-label="Encounter space"><div class="enemy-glyph" aria-hidden="true"><span>◇</span></div><p class="enemy-name">PAPER GOLEM</p><p class="enemy-status">STAMINA <strong>' + state.enemyStamina + ' / 18</strong></p></div><div class="status-line"><span>ROWAN · LV 04</span><span>STAMINA <b>' + state.playerStamina + ' / 24</b></span><span>ENCOUNTER · ACTIVE</span></div><section class="command-frame" aria-label="Battle commands"><div class="command-grid">' + commands.map(function (command) { return '<button class="command" data-action="command" data-id="' + command + '" data-nav-group="commands" aria-label="Select ' + command + '" aria-pressed="' + (state.selectedCommand === command) + '"' + (state.commandResolved ? " disabled" : "") + '><span class="heart" aria-hidden="true"></span>' + command + '</button>'; }).join("") + '</div></section>' + (state.selectedCommand && !state.commandResolved ? '<div class="action-row">' + (["STRIKE", "SPEAK"].includes(state.selectedCommand) ? '<button class="action" data-action="open-target">Choose target for ' + state.selectedCommand + '</button>' : state.selectedCommand === "ITEMS" ? '<a class="action" href="#items">Open item list</a>' : '<button class="action" data-action="withdraw">Confirm WITHDRAW</button>') + '</div>' : "") + (state.targetOpen ? '<section class="target-frame" role="group" aria-label="Choose encounter target"><h3>Target / ' + state.selectedCommand + '</h3>' + targets.map(function (target) { return '<button class="target-choice" data-action="target" data-id="' + target.id + '" aria-pressed="' + (state.selectedTarget === target.id) + '">Select ' + target.name + '</button>'; }).join("") + '<div class="action-row"><button class="action" data-action="confirm-command"' + (!state.selectedTarget ? " disabled" : "") + '>Confirm ' + state.selectedCommand + ' on ' + (state.selectedTarget ? "Paper Golem" : "target") + '</button><button class="action" data-action="cancel-layer">Back to commands</button></div></section>' : "") + '<p class="notice" role="status" aria-live="polite">' + esc(state.notice) + '</p>';
  }
  function itemScreen() {
    const selected = items.find(function (item) { return item.id === state.selectedItem; }) || items[0];
    const pending = items.find(function (item) { return item.id === state.pendingItem; });
    const canUse = state.inventory[selected.id] > 0 && state.playerStamina < 24;
    return '<h2 class="screen-kicker">Item list / Encounter 07</h2><div class="status-line"><span>ROWAN · STAMINA <b>' + state.playerStamina + ' / 24</b></span><span>ITEM COUNT IS LOCAL TO THIS DEMO</span></div><section class="item-frame"><nav aria-label="Inventory items"><ul class="item-list">' + items.map(function (item) { return '<li><button class="item-row" data-action="item" data-id="' + item.id + '" aria-label="Select ' + item.name + '" aria-pressed="' + (selected.id === item.id) + '">' + item.name + '<span class="item-count">×' + state.inventory[item.id] + '</span></button></li>'; }).join("") + '</ul></nav><article class="item-detail"><p><strong>' + selected.name + '</strong> · quantity ' + state.inventory[selected.id] + '</p><p class="item-effect">' + selected.effect + '</p><p>Selection only inspects this line; use and consumption are separate.</p></article></section><div class="action-row"><button class="action" data-action="use-request"' + (!canUse || pending ? " disabled" : "") + '>Use selected item</button>' + (state.playerStamina >= 24 ? '<span class="warning">Rowan stamina is full (24 / 24).</span>' : state.inventory[selected.id] <= 0 ? '<span class="warning">No quantity remains for this item.</span>' : "") + '</div>' + (pending ? '<section class="item-use-layer" role="group" aria-label="Confirm item target"><p>Use ' + pending.name + ' on Rowan? This consumes one item after confirmation.</p><button class="target-choice" data-action="item-target" data-id="rowan" aria-label="Select Rowan" aria-pressed="' + (state.itemTarget === "rowan") + '">Select Rowan</button><div class="action-row"><button class="action" data-action="item-confirm" aria-label="Confirm ' + pending.name + ' on Rowan"' + (!state.itemTarget ? " disabled" : "") + '>Confirm use</button><button class="action" data-action="item-cancel">Cancel</button></div></section>' : "") + '<p class="notice" role="status" aria-live="polite">' + esc(state.notice) + '</p>';
  }
  function dialogue() {
    const opening = "The paper golem points toward a door with no handle.";
    const selected = state.selectedChoice ? branches[state.selectedChoice] : null;
    return '<h2 class="screen-kicker">Dialogue / Encounter 07</h2><section class="dialogue-frame" aria-label="Conversation"><p>' + opening + '</p>' + (state.dialogueStage === 0 ? '<button class="action" data-action="continue-dialogue">Continue to choices</button>' : state.dialogueStage === 1 ? '<p>“The hinge is older than the wall,” the golem says. It waits.</p>' + Object.keys(branches).map(function (id) { return '<button class="dialogue-choice" data-action="dialogue-choice" data-id="' + id + '" aria-label="' + branches[id].label + '" aria-pressed="' + (state.selectedChoice === id) + '" data-nav-group="dialogue">' + branches[id].label + '</button>'; }).join("") + (selected ? '<p class="dialogue-preview">Preview: ' + selected.label + '. Confirm to record this branch.</p><button class="action" data-action="dialogue-confirm">Confirm selected choice</button>' : "") : '<p>' + esc(state.dialogueResponse) + '</p><button class="action" data-action="dialogue-back">Return to choices</button>') + '</section><p class="notice" role="status" aria-live="polite">' + esc(state.notice) + '</p>';
  }
  function render() { const id = routeId(); state.route = id; const content = id === "battle-commands" ? battle() : (id === "items" ? itemScreen() : dialogue()); app.innerHTML = '<main class="field-shell"><div class="scene-meta"><span>BLACK FIELD / ENCOUNTER 07</span><span>Original command study · local synthetic state</span></div>' + nav(id) + content + '</main>'; }
  app.addEventListener("click", function (event) {
    const control = event.target.closest("[data-action]"); if (!control || control.disabled) return;
    const action = control.dataset.action;
    if (action === "command") state = transition(state, { type: "SELECT_COMMAND", id: control.dataset.id });
    else if (action === "open-target") state = transition(state, { type: "OPEN_TARGET" });
    else if (action === "target") state = transition(state, { type: "SELECT_TARGET", id: control.dataset.id });
    else if (action === "confirm-command") state = transition(state, { type: "CONFIRM_COMMAND" });
    else if (action === "withdraw") state = transition(state, { type: "CONFIRM_WITHDRAW" });
    else if (action === "cancel-layer") state = transition(state, { type: "CANCEL_LAYER" });
    else if (action === "item") state = transition(state, { type: "SELECT_ITEM", id: control.dataset.id });
    else if (action === "use-request") state = transition(state, { type: "REQUEST_ITEM_USE" });
    else if (action === "item-target") state = transition(state, { type: "SELECT_ITEM_TARGET", id: control.dataset.id });
    else if (action === "item-confirm") state = transition(state, { type: "CONFIRM_ITEM_USE" });
    else if (action === "item-cancel") state = transition(state, { type: "CANCEL_ITEM_USE" });
    else if (action === "continue-dialogue") state = transition(state, { type: "CONTINUE_DIALOGUE" });
    else if (action === "dialogue-choice") state = transition(state, { type: "SELECT_DIALOGUE_CHOICE", id: control.dataset.id });
    else if (action === "dialogue-confirm") state = transition(state, { type: "CONFIRM_DIALOGUE_CHOICE" });
    else if (action === "dialogue-back") state = transition(state, { type: "BACK_TO_CHOICES" });
    render();
  });
  app.addEventListener("keydown", function (event) {
    if (event.key === "Escape") {
      if (state.targetOpen) state = transition(state, { type: "CANCEL_LAYER" });
      else if (state.pendingItem) state = transition(state, { type: "CANCEL_ITEM_USE" });
      else return;
      render(); return;
    }
    if (!["ArrowLeft", "ArrowRight", "ArrowDown", "ArrowUp"].includes(event.key)) return;
    const active = root.document.activeElement; if (!active || !active.dataset.navGroup) return;
    const group = active.dataset.navGroup; const buttons = Array.from(app.querySelectorAll('[data-nav-group="' + group + '"]')).filter(function (b) { return !b.disabled; });
    const index = buttons.indexOf(active); if (index < 0 || !buttons.length) return;
    event.preventDefault(); const forward = event.key === "ArrowRight" || event.key === "ArrowDown" ? 1 : -1; buttons[(index + forward + buttons.length) % buttons.length].focus();
  });
  root.addEventListener("hashchange", render);
  render();
})(typeof window !== "undefined" ? window : null);
