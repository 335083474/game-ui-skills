(function (root) {
  "use strict";
  const weapons = {
    "rivet-7": { id: "rivet-7", name: "Rivet-7", art: "rivet", type: "launcher", tier: "uncommon", tierClass: "common", level: 8, maker: "Nut & Bolt Co.", power: 34, rate: 2.1, mag: 6, shock: 0, element: "Kinetic", description: "A spring-driven launcher with a stubborn iron frame." },
    "arc-slinger": { id: "arc-slinger", name: "Arc Slinger", art: "pulse", type: "pistol", tier: "rare", tierClass: "rare", level: 8, maker: "Copper Kite Works", power: 29, rate: 2.4, mag: 12, shock: 8, element: "Shock", description: "A compact coil pistol with a blue charge cell." },
    "coil-driver": { id: "coil-driver", name: "Coil Driver", art: "coil", type: "rifle", tier: "epic", tierClass: "epic", level: 9, maker: "Mothlight Fabrication", power: 42, rate: 1.4, mag: 5, shock: 0, element: "Kinetic", description: "A long pressure rail with hand-wrapped insulation." }
  };
  const inventoryItems = [
    { id: "rivet-7", name: "Rivet-7", type: "launcher", tier: "uncommon", level: 8, note: "Equipped · 6 shell capacity", weapon: true },
    { id: "arc-slinger", name: "Arc Slinger", type: "pistol", tier: "rare", level: 8, note: "Shock 8 · 12 charge capacity", weapon: true },
    { id: "coil-driver", name: "Coil Driver", type: "rifle", tier: "epic", level: 9, note: "Kinetic · 5 rail charges", weapon: true },
    { id: "patch", name: "Patch Kit", type: "recovery", tier: "common", level: 6, note: "One sealed field dressing", mark: "+" },
    { id: "bolt-bundle", name: "Bolt Bundle", type: "ammo", tier: "common", level: 7, note: "Twenty-four spare fasteners", mark: "B" },
    { id: "flare-cell", name: "Flare Cell", type: "utility", tier: "uncommon", level: 7, note: "A single bright salvage flare", mark: "F" },
    { id: "knuckle-wrap", name: "Knuckle Wrap", type: "mod", tier: "rare", level: 8, note: "Workshop wrap · grip +1", mark: "K" },
    { id: "static-fuse", name: "Static Fuse", type: "upgrade", tier: "uncommon", level: 8, note: "Spare insulation fuse", mark: "S" }
  ];
  function initialState() {
    return { route: "weapon-comparison", equipped: "rivet-7", candidate: "arc-slinger", inventory: inventoryItems.map(function (i) { return i.id; }), inventoryChoice: "arc-slinger", inventorySort: "type", pendingDrop: null, skillPoints: 3, quickHands: false, capacitorLoop: false, selectedNode: "quick-hands", notice: "Candidate focused; equipped gear has not changed." };
  }
  function transition(state, action) {
    const next = Object.assign({}, state, { inventory: state.inventory.slice() });
    if (action.type === "SELECT_WEAPON" && weapons[action.id] && action.id !== state.equipped) {
      next.candidate = action.id; next.notice = weapons[action.id].name + " focused for comparison. The equipped marker remains on " + weapons[state.equipped].name + ".";
    } else if (action.type === "EQUIP_WEAPON" && weapons[action.id] && action.id !== state.equipped && state.inventory.indexOf(action.id) >= 0) {
      next.equipped = action.id;
      next.candidate = Object.keys(weapons).find(function (id) { return id !== action.id; });
      next.notice = "Equipped item changed: " + weapons[action.id].name + " is now in the equipped slot.";
    } else if (action.type === "SELECT_INVENTORY" && state.inventory.indexOf(action.id) >= 0) {
      next.inventoryChoice = action.id; next.pendingDrop = null; next.notice = weapons[action.id] ? weapons[action.id].name + " selected for inspection; equipping and dropping are separate actions." : inventoryItems.find(function (i) { return i.id === action.id; }).name + " selected for inspection.";
    } else if (action.type === "SORT" && ["type", "level", "tier"].indexOf(action.value) >= 0) {
      next.inventorySort = action.value; next.notice = "Bag sorted by " + action.value + "; selected item and ownership are unchanged.";
    } else if (action.type === "ASK_DROP" && state.inventoryChoice && state.inventoryChoice !== state.equipped) {
      next.pendingDrop = state.inventoryChoice; next.notice = "Confirm before dropping " + itemName(state.inventoryChoice) + ".";
    } else if (action.type === "CANCEL_DROP") {
      next.pendingDrop = null; next.notice = "Drop cancelled. The bag is unchanged.";
    } else if (action.type === "CONFIRM_DROP" && state.pendingDrop && state.pendingDrop !== state.equipped && state.inventory.indexOf(state.pendingDrop) >= 0) {
      const removed = state.pendingDrop;
      next.inventory = state.inventory.filter(function (id) { return id !== removed; }); next.pendingDrop = null;
      if (next.inventoryChoice === removed) next.inventoryChoice = "rivet-7";
      next.notice = "Dropped " + itemName(removed) + " from the bag. Bag count: " + next.inventory.length + ".";
    } else if (action.type === "SELECT_NODE" && ["quick-hands", "capacitor-loop"].indexOf(action.id) >= 0) {
      next.selectedNode = action.id; next.notice = nodeName(action.id) + " selected. Prerequisites and point cost are shown.";
    } else if (action.type === "BUY_NODE" && action.id === "quick-hands" && !state.quickHands && state.skillPoints >= 1) {
      next.quickHands = true; next.skillPoints -= 1; next.selectedNode = action.id; next.notice = "Quick Hands purchased. Skill points remaining: " + next.skillPoints + ". Capacitor Loop is now available.";
    } else if (action.type === "BUY_NODE" && action.id === "capacitor-loop" && state.quickHands && !state.capacitorLoop && state.skillPoints >= 2) {
      next.capacitorLoop = true; next.skillPoints -= 2; next.selectedNode = action.id; next.notice = "Capacitor Loop purchased. Skill points remaining: " + next.skillPoints + ".";
    }
    return next;
  }
  function itemName(id) {
    const weapon = weapons[id];
    if (weapon) return weapon.name;
    const item = inventoryItems.find(function (i) { return i.id === id; });
    return item ? item.name : id;
  }
  function nodeName(id) { return id === "quick-hands" ? "Quick Hands" : "Capacitor Loop"; }
  const api = { initialState: initialState, transition: transition, weapons: weapons, inventoryItems: inventoryItems };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  if (!root || !root.document) return;

  let state = initialState();
  const app = root.document.getElementById("app");
  const tierOrder = { common: 1, uncommon: 2, rare: 3, epic: 4 };
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]; }); }
  function routeId() {
    const id = root.location.hash.replace(/^#/, "");
    return ["weapon-comparison", "inventory", "skill-tree"].indexOf(id) >= 0 ? id : "weapon-comparison";
  }
  function nav(id) {
    return '<nav class="route-nav" aria-label="Scrap ledger pages"><a href="#weapon-comparison" ' + (id === "weapon-comparison" ? 'aria-current="page"' : "") + '>01 · Compare</a><a href="#inventory" ' + (id === "inventory" ? 'aria-current="page"' : "") + '>02 · Bag</a><a href="#skill-tree" ' + (id === "skill-tree" ? 'aria-current="page"' : "") + '>03 · Skill branch</a></nav>';
  }
  function weaponArt(w) {
    const artFiles = { rivet: "rivet-launcher.png", pulse: "pulse-pistol.png", coil: "coil-rifle.png" };
    const labels = { rivet: "Original rivet launcher silhouette", pulse: "Original pulse pistol silhouette", coil: "Original coil rifle silhouette" };
    return '<img class="weapon-art" src="./assets/' + artFiles[w.art] + '" alt="' + labels[w.art] + '">';
  }
  function delta(candidate, current, unit) {
    const n = candidate - current;
    const sign = n > 0 ? "+" : (n < 0 ? "−" : "±0");
    const kind = n > 0 ? "up" : (n < 0 ? "down" : "flat");
    return '<div class="delta-line ' + kind + '">' + sign + (n === 0 ? "" : String(Math.abs(n))) + (unit || "") + '</div>';
  }
  function weaponPanel(w, which) {
    return '<article class="weapon-plate ' + which + '"><div class="weapon-top"><span>' + (which === "current" ? "Equipped · " : "Candidate · ") + w.tier + '</span><span>LV ' + String(w.level).padStart(2, "0") + '</span></div>' +
      '<h3>' + w.name + '</h3><span class="maker">' + w.maker + '</span>' + weaponArt(w) +
      '<div class="weapon-stats"><span>Power</span><strong>' + w.power + '</strong><span>Fire rate</span><strong>' + w.rate.toFixed(1) + ' / s</strong><span>Capacity</span><strong>' + w.mag + '</strong><span>Element</span><strong>' + (w.shock ? "Shock " + w.shock : "Kinetic") + '</strong></div>' +
      '<p><span class="tier ' + w.tierClass + '">' + w.tier + ' · ' + (w.tierClass === "common" ? "solid edge" : w.tierClass === "rare" ? "double edge" : "angled cut") + '</span></p></article>';
  }
  function compareScreen() {
    const current = weapons[state.equipped], candidate = weapons[state.candidate];
    const deltas = [
      ["Power", delta(candidate.power, current.power, "")],
      ["Fire rate", delta(candidate.rate, current.rate, " / s")],
      ["Capacity", delta(candidate.mag, current.mag, "")],
      ["Shock", delta(candidate.shock, current.shock, "")]
    ];
    return '<p class="kicker">Pause catalogue / current slot stays marked</p><h2 class="screen-title">Weapon comparison</h2><p class="intro">Focus a candidate to read its silhouette and signed deltas. Equip commits once and changes the shared loadout.</p><section class="plate"><div class="compare-grid">' + weaponPanel(current, "current") +
      '<div class="delta-column" aria-label="Candidate minus equipped stat deltas">' + deltas.map(function (d) { return '<div><span>' + d[0] + '</span>' + d[1] + '</div>'; }).join("") + '</div>' + weaponPanel(candidate, "candidate") + '</div>' +
      '<div class="candidate-picker" role="group" aria-label="Candidate weapons">' + Object.keys(weapons).filter(function (id) { return id !== state.equipped; }).map(function (id) { return '<button class="picker" type="button" data-action="focus-weapon" data-id="' + id + '" aria-label="Focus ' + weapons[id].name + '" aria-pressed="' + (id === state.candidate) + '">' + weapons[id].name + '</button>'; }).join("") + '</div>' +
      '<div class="action-row"><button class="action primary" data-action="equip" data-id="' + state.candidate + '"' + (state.equipped === state.candidate ? " disabled" : "") + '>Equip ' + candidate.name + '</button></div><p class="status" role="status" aria-live="polite">' + esc(state.notice) + '</p></section>';
  }
  function inventoryScreen() {
    const items = state.inventory.map(function (id) { return inventoryItems.find(function (item) { return item.id === id; }); }).filter(Boolean);
    items.sort(function (a, b) {
      if (state.inventorySort === "level") return b.level - a.level || a.name.localeCompare(b.name);
      if (state.inventorySort === "tier") return tierOrder[b.tier] - tierOrder[a.tier] || a.name.localeCompare(b.name);
      return a.type.localeCompare(b.type) || a.name.localeCompare(b.name);
    });
    const selected = inventoryItems.find(function (i) { return i.id === state.inventoryChoice; }) || inventoryItems[0];
    const weapon = weapons[state.inventoryChoice];
    return '<p class="kicker">Eight slots / selection is inspection only</p><h2 class="screen-title">Inventory</h2><p class="intro">Sort changes the bag order only. The selected item has separate inspect, equip, and confirmed drop actions.</p><section class="plate bag-layout"><div><div class="bag-tools"><span class="sort-label">Sort bag</span><button class="sort" data-action="sort" data-value="type" aria-pressed="' + (state.inventorySort === "type") + '">Type</button><button class="sort" data-action="sort" data-value="level" aria-pressed="' + (state.inventorySort === "level") + '">Level</button><button class="sort" data-action="sort" data-value="tier" aria-pressed="' + (state.inventorySort === "tier") + '">Tier</button><span class="sort-label">Slots ' + items.length + ' / 8</span></div><div class="bag-list" aria-label="Bag items">' +
      items.map(function (item) {
        const weaponItem = weapons[item.id];
        return '<button class="bag-item" data-action="inventory-select" data-id="' + item.id + '" aria-label="Select ' + item.name + '" aria-pressed="' + (item.id === state.inventoryChoice) + '"><span class="item-mark">' + (weaponItem ? item.id === "rivet-7" ? "R7" : item.id === "arc-slinger" ? "AS" : "CD" : item.mark) + '</span><span><span class="item-name">' + item.name + '</span><small class="item-meta">' + item.type + ' · ' + item.tier + ' · LV ' + item.level + '</small></span></button>';
      }).join("") + '</div></div><article class="detail-plate"><p class="kicker">Selected item / ' + (state.equipped === selected.id ? "equipped" : "in bag") + '</p><h3>' + selected.name + '</h3><span class="tier ' + (weapons[selected.id] ? weapons[selected.id].tierClass : "common") + '">' + selected.tier + ' · named tier</span><p>' + (weapon ? weapon.description : selected.note) + '</p><div class="detail-lines"><div class="detail-line"><span>Type / level</span><b>' + selected.type + ' / ' + selected.level + '</b></div><div class="detail-line"><span>Ownership</span><b>' + (state.equipped === selected.id ? "Equipped slot" : "1 in bag") + '</b></div>' +
      (weapon ? '<div class="detail-line"><span>Power / rate</span><b>' + weapon.power + ' / ' + weapon.rate.toFixed(1) + '</b></div>' : "") + '</div>' +
      (state.pendingDrop ? '<div class="confirm-strip" role="alert">Drop ' + itemName(state.pendingDrop) + ' from the bag?</div><div class="action-row"><button class="action primary" data-action="drop-confirm">Confirm drop ' + itemName(state.pendingDrop) + '</button><button class="action" data-action="drop-cancel">Cancel drop</button></div>' :
      '<div class="action-row">' + (weapon && state.equipped !== selected.id ? '<button class="action" data-action="equip-inventory" data-id="' + selected.id + '">Equip ' + selected.name + '</button>' : "") + '<button class="action" data-action="drop-ask"' + (state.equipped === selected.id ? ' disabled aria-describedby="drop-limit"' : "") + '>Drop ' + selected.name + '</button></div>' + (state.equipped === selected.id ? '<p class="item-meta" id="drop-limit">Equipped gear cannot be dropped from this demo slot.</p>' : "")) +
      '<p class="status" role="status" aria-live="polite">' + esc(state.notice) + '</p></article></section>';
  }
  function skillScreen() {
    const quick = state.quickHands, cap = state.capacitorLoop;
    return '<p class="kicker">Three points / one connected branch</p><h2 class="screen-title">Skill tree</h2><p class="intro">Select a node to preview its prerequisite and cost. Purchase is explicit and points are deducted once.</p><section class="plate"><div class="tree-summary"><strong>Salvage rig / field training</strong><span class="points">Skill points · ' + state.skillPoints + '</span></div><div class="tree" role="group" aria-label="Connected skill nodes">' +
      '<button class="skill-node ' + (quick ? "purchased" : "available") + '" data-action="node" data-id="quick-hands" data-nav-group="nodes" aria-pressed="' + (state.selectedNode === "quick-hands") + '"><span class="node-name">Quick Hands</span><span class="node-cost">Cost 1 point</span><p>Reduce the next reload pause by one beat.</p><span class="node-status">' + (quick ? "Purchased" : "Available · no prerequisite") + '</span></button><span class="connector" aria-hidden="true"></span>' +
      '<button class="skill-node ' + (cap ? "purchased" : quick && state.skillPoints >= 2 ? "available" : "locked") + '" data-action="node" data-id="capacitor-loop" data-nav-group="nodes" aria-label="Capacitor Loop; prerequisite Quick Hands; cost 2 points; ' + (cap ? "purchased" : quick && state.skillPoints >= 2 ? "available" : "locked") + '"' + (!quick || state.skillPoints < 2 ? " disabled" : "") + ' aria-pressed="' + (state.selectedNode === "capacitor-loop") + '"><span class="node-name">Capacitor Loop</span><span class="node-cost">Cost 2 points</span><p>Hold one extra charge in the insulated coil.</p><span class="node-status">' + (cap ? "Purchased" : quick ? "Available · needs Quick Hands" : "Locked · needs Quick Hands") + '</span></button></div>' +
      '<div class="branch-note">Prerequisite: Quick Hands → Capacitor Loop. All effects and point values are invented for this interface study.</div><div class="action-row">' +
      '<button class="action primary" data-action="buy-node" data-id="quick-hands"' + (quick || state.skillPoints < 1 ? " disabled" : "") + '>' + (quick ? "Quick Hands purchased" : "Purchase Quick Hands (1 point)") + '</button>' +
      '<button class="action primary" data-action="buy-node" data-id="capacitor-loop"' + (!quick || cap || state.skillPoints < 2 ? " disabled" : "") + '>' + (cap ? "Capacitor Loop purchased" : "Purchase Capacitor Loop (2 points)") + '</button></div><p class="status" role="status" aria-live="polite">' + esc(state.notice) + '</p></section>';
  }
  function render() {
    const id = routeId(); state.route = id;
    const content = id === "weapon-comparison" ? compareScreen() : (id === "inventory" ? inventoryScreen() : skillScreen());
    app.innerHTML = '<main class="catalog"><header class="mast"><h1>Scrap Ledger / Field Catalogue</h1><span class="edition">Original gear · synthetic values</span></header>' + nav(id) + content + '</main>';
  }
  app.addEventListener("click", function (event) {
    const button = event.target.closest("[data-action]");
    if (!button || button.disabled) return;
    const type = button.dataset.action;
    if (type === "focus-weapon") state = transition(state, { type: "SELECT_WEAPON", id: button.dataset.id });
    else if (type === "equip") state = transition(state, { type: "EQUIP_WEAPON", id: button.dataset.id });
    else if (type === "inventory-select") state = transition(state, { type: "SELECT_INVENTORY", id: button.dataset.id });
    else if (type === "sort") state = transition(state, { type: "SORT", value: button.dataset.value });
    else if (type === "drop-ask") state = transition(state, { type: "ASK_DROP" });
    else if (type === "drop-cancel") state = transition(state, { type: "CANCEL_DROP" });
    else if (type === "drop-confirm") state = transition(state, { type: "CONFIRM_DROP" });
    else if (type === "equip-inventory") state = transition(state, { type: "EQUIP_WEAPON", id: button.dataset.id });
    else if (type === "node") state = transition(state, { type: "SELECT_NODE", id: button.dataset.id });
    else if (type === "buy-node") state = transition(state, { type: "BUY_NODE", id: button.dataset.id });
    render();
  });
  app.addEventListener("keydown", function (event) {
    if (!["ArrowLeft", "ArrowRight"].includes(event.key)) return;
    const active = root.document.activeElement;
    if (!active || !active.dataset.navGroup) return;
    const group = active.dataset.navGroup;
    const buttons = Array.from(app.querySelectorAll('[data-nav-group="' + group + '"]')).filter(function (b) { return !b.disabled; });
    const index = buttons.indexOf(active);
    if (index >= 0 && buttons.length) { event.preventDefault(); buttons[(index + (event.key === "ArrowRight" ? 1 : -1) + buttons.length) % buttons.length].focus(); }
  });
  root.addEventListener("hashchange", render);
  render();
})(typeof window !== "undefined" ? window : null);
