(function () {
  "use strict";
  const state = {
    points: 4, selectedAbility: "quiet-step", unlocked: { "quiet-step": true }, equippedAbility: "quiet-step",
    selectedSlot: "slot-1", shards: { "slot-1": "riverward-weave", "slot-2": "moss-guard" },
    selectedShard: "moonlit-lens", pendingShard: null, pendingAbility: null,
    currentPlace: "willow-bank", selectedPlace: "willow-bank", destination: null,
    abilityNotice: "No light points have been spent this visit.", shardNotice: "",
    note: "The blue stream bends toward the old root arch."
  };
  const abilities = [
    { id:"quiet-step", name:"Quiet Step", glyph:"✧", cost:0, prereq:"No prerequisite", description:"A soft landing gathers no attention and keeps your path steady." },
    { id:"air-bloom", name:"Air Bloom", glyph:"❋", cost:2, prereq:"Quiet Step", description:"Open a brief lift of light to cross a broken root or rising stream." },
    { id:"root-glide", name:"Root Glide", glyph:"⌁", cost:1, prereq:"No prerequisite", description:"Ride the low current along the forest floor without losing direction." },
    { id:"veil-anchor", name:"Veil Anchor", glyph:"◇", cost:2, prereq:"Air Bloom", description:"Hold a place in the air long enough to read a distant route." }
  ];
  const shards = [
    { id:"moonlit-lens", name:"Moonlit Lens", symbol:"◈", benefit:"Reveals route hints", tradeoff:"Slower focus recovery" },
    { id:"bark-heart", name:"Bark Heart", symbol:"✦", benefit:"Steadies landings", tradeoff:"Less gliding lift" },
    { id:"reed-song", name:"Reed Song", symbol:"⌁", benefit:"Softens water drift", tradeoff:"Longer quiet-step pause" },
    { id:"riverward-weave", name:"Riverward Weave", symbol:"❋", benefit:"Keeps a calm current", tradeoff:"No route hint bonus" },
    { id:"moss-guard", name:"Moss Guard", symbol:"⬡", benefit:"Softens a rough landing", tradeoff:"No aerial lift bonus" }
  ];
  const places = [
    { id:"willow-bank", name:"Willow Bank", state:"current", marker:"●", relation:"You are here", detail:"A quiet bank beside the blue stream." },
    { id:"root-arch", name:"Root Arch", state:"discovered", marker:"◇", relation:"Found · east path", detail:"A stone-framed crossing follows the stream east." },
    { id:"echo-hollow", name:"Echo Hollow", state:"unknown", marker:"○", relation:"Unknown · beyond ridge", detail:"No route is recorded beyond the distant ridge." }
  ];
  const screen = document.getElementById("screen");
  const dialogRoot = document.getElementById("dialog-root");
  const live = document.getElementById("live-region");
  const noteField = document.getElementById("field-note");
  let cancelDialog = null;

  function esc(value) {
    return String(value).replace(/[&<>"']/g, function (ch) {
      return { "&":"&amp;", "<":"&lt;", ">":"&gt;", "\"":"&quot;", "'":"&#39;" }[ch];
    });
  }
  function head(title, description, marker) {
    return '<section class="screen-head"><div><p class="eyebrow">GLOAMWATER · FOREST RECORD</p><h1>' + title + '</h1><p class="lede">' + description + '</p></div><div class="region-tag">' + marker + '</div></section>';
  }
  function plate(alt, caption, position) {
    return '<figure class="scene-plate"><img src="./assets/ori-wisps-art.png" alt="' + alt + '" style="object-position:' + position + '"><figcaption>' + caption + '</figcaption></figure>';
  }
  function ability(id) { return abilities.find(function (item) { return item.id === id; }) || abilities[0]; }
  function shard(id) { return shards.find(function (item) { return item.id === id; }) || shards[0]; }
  function abilityScreen() {
    const item = ability(state.selectedAbility);
    const locked = item.prereq === "Air Bloom" && !state.unlocked["air-bloom"];
    const equipped = item.id === state.equippedAbility;
    const status = equipped ? "Equipped" : state.unlocked[item.id] ? "Known" : locked ? "Locked" : "Available";
    const action = locked
      ? '<p class="map-state">Prerequisite: equip Air Bloom first. This node remains locked.</p>'
      : equipped
        ? '<p class="map-state">This ability is equipped. No points are spent again.</p>'
        : state.unlocked[item.id]
          ? '<button class="primary-action" data-equip="' + item.id + '">Equip ' + item.name + '</button>'
          : '<button class="primary-action" data-equip="' + item.id + '"' + (state.points < item.cost ? " disabled" : "") + '>Unlock and equip ' + item.name + '</button>';
    const nodes = abilities.map(function (entry) {
      const nodeStatus = state.equippedAbility === entry.id ? "Equipped" : state.unlocked[entry.id] ? "Known" : (entry.prereq === "Air Bloom" && !state.unlocked["air-bloom"]) ? "Locked" : "Available";
      const isLocked = nodeStatus === "Locked";
      return '<button class="ability-choice" data-ability="' + entry.id + '" aria-pressed="' + (state.selectedAbility === entry.id) + '" aria-label="Choose ' + entry.name + (isLocked ? " (locked)" : "") + '"><span class="ability-glyph" aria-hidden="true">' + entry.glyph + '</span><span><span class="ability-name">' + entry.name + '</span><span class="ability-meta">Cost ' + entry.cost + ' light points · ' + entry.prereq + '</span></span><span class="ability-state">' + nodeStatus + '</span></button>';
    }).join("");
    return head("A constellation of small lights", "Choose an ability to read its cost and prerequisite. Unlocking asks before it spends a light point.", "WILLOW BANK · ABILITY RECORD") +
      '<section class="scene-layout" aria-label="Ability configuration">' +
      plate("Blue hour forest with a stream, natural stone arch, and small luminous moth spirit", "Original forest plate · focus rests on the lit stream and arch", "64% 50%") +
      '<div class="scene-panel"><div class="panel-heading"><div><p class="eyebrow">01 · ABILITY CONSTELLATION</p><h2>Carry one clear intention</h2><p>Four nodes · steady keyboard order</p></div><div class="points" aria-label="' + state.points + ' light points remaining">' + state.points + ' LIGHT</div></div>' +
      '<div class="ability-list" aria-label="Ability nodes">' + nodes + '</div>' +
      '<section class="detail-block" aria-live="polite"><p class="eyebrow">SELECTED ABILITY · ' + status.toUpperCase() + '</p><h3>' + item.name + '</h3><p>' + item.description + '</p><div class="detail-requirement"><span>Cost <strong>' + item.cost + ' light points</strong></span><span>Prerequisite <strong>' + item.prereq + '</strong></span></div><div class="action-row">' + action + '</div></section></div></section>' +
      '<div class="story-band"><p><strong>Focus rule</strong> &nbsp; Current and locked states have names and shapes as well as a quiet glow.</p><p id="ability-feedback" class="map-state">' + esc(state.abilityNotice) + '</p></div>';
  }
  function shardScreen() {
    const slot = state.selectedSlot;
    const current = shard(state.shards[slot]);
    const chosen = shard(state.selectedShard);
    const slotOne = shard(state.shards["slot-1"]).name;
    const slotTwo = shard(state.shards["slot-2"]).name;
    const options = shards.filter(function (item) { return item.id !== current.id; }).map(function (item) {
      return '<button class="shard-pick" data-shard="' + item.id + '" aria-label="Choose ' + item.name + '" aria-pressed="' + (state.selectedShard === item.id) + '"><strong>' + item.symbol + ' ' + item.name + '</strong><small>' + item.benefit + '</small></button>';
    }).join("");
    const preview = state.pendingShard
      ? '<div class="preview-card"><p><strong>Preview only</strong> &nbsp; ' + esc(chosen.name) + ' for ' + (slot === "slot-1" ? "Slot 1" : "Slot 2") + '.</p><p>Benefit: ' + esc(chosen.benefit) + ' · tradeoff: ' + esc(chosen.tradeoff) + '. Equipped shard stays unchanged until confirmation.</p></div>'
      : '<div class="preview-card"><p><strong>Choose a slot, then preview a shard.</strong></p><p>Equipped IDs stay as they are until a confirmed replacement.</p></div>';
    return head("A quiet balance of found things", "Choose a slot and preview a shard. Nothing changes until the replacement is confirmed.", "GLOAMWATER · LOADOUT") +
      '<section class="scene-layout" aria-label="Spirit shard loadout">' +
      plate("Layered forest, stone arch, and luminous spirit beside a blue stream", "Original forest plate · a still place to consider a loadout", "78% 50%") +
      '<div class="scene-panel"><div class="panel-heading"><div><p class="eyebrow">02 · SPIRIT SHARDS</p><h2>Two held places</h2><p>Each choice has a benefit and a tradeoff.</p></div><div class="points">NO COST</div></div>' +
      '<div class="shard-slots" aria-label="Equipped shard slots">' +
      '<button class="shard-slot" data-slot="slot-1" aria-label="Select slot 1" aria-pressed="' + (slot === "slot-1") + '"><span class="slot-symbol">◈</span><span><strong>' + esc(shard(state.shards["slot-1"]).name) + '</strong><small>' + esc(shard(state.shards["slot-1"]).benefit) + '</small></span><span class="slot-label">SLOT 1</span></button>' +
      '<button class="shard-slot" data-slot="slot-2" aria-label="Select slot 2" aria-pressed="' + (slot === "slot-2") + '"><span class="slot-symbol">✦</span><span><strong>' + esc(shard(state.shards["slot-2"]).name) + '</strong><small>' + esc(shard(state.shards["slot-2"]).benefit) + '</small></span><span class="slot-label">SLOT 2</span></button></div>' +
      '<p class="eyebrow">AVAILABLE SHARDS · SELECTED: ' + esc(chosen.name.toUpperCase()) + '</p><div class="shard-picker" aria-label="Available shard replacements">' + options + '</div>' + preview +
      '<div class="action-row"><button class="primary-action" data-request-shard' + (state.pendingShard ? "" : " disabled") + '>Replace ' + (slot === "slot-1" ? "slot 1" : "slot 2") + ' with ' + esc(chosen.name) + '</button><button class="quiet-action" data-cancel-preview>Clear preview</button></div>' +
      '<p class="shard-state" id="shard-feedback">' + esc(state.shardNotice || ("Equipped now: Slot 1 · " + slotOne + " / Slot 2 · " + slotTwo)) + '</p></div></section>' +
      '<div class="story-band"><p><strong>Selected slot</strong> &nbsp; ' + (slot === "slot-1" ? "Slot 1" : "Slot 2") + ' carries ' + esc(current.name) + ' until an apply is confirmed.</p><p class="map-state">Incoming shards are previewed before they are applied.</p></div>';
  }
  function mapScreen() {
    const selected = places.find(function (item) { return item.id === state.selectedPlace; }) || places[0];
    const current = places.find(function (item) { return item.id === state.currentPlace; }) || places[0];
    const destination = places.find(function (item) { return item.id === state.destination; });
    const marks = places.map(function (item, index) {
      const mark = '<button class="map-waypoint" data-place="' + item.id + '" data-state="' + item.state + '" aria-pressed="' + (selected.id === item.id) + '" aria-label="Focus ' + item.name + ', ' + item.state + '"><span class="waypoint-shape" aria-hidden="true"><span>' + item.marker + '</span></span><strong>' + item.name + '</strong><small>' + item.relation + '</small></button>';
      return mark + (index < places.length - 1 ? '<span class="map-branch" aria-hidden="true"></span>' : "");
    }).join("");
    const routeText = destination ? "Planned route · " + current.name + " → " + destination.name : "No route planned";
    const action = selected.state === "discovered"
      ? '<button class="primary-action" data-plot-route="' + selected.id + '">Plot path to ' + selected.name + '</button>'
      : '<button class="primary-action" disabled>' + (selected.state === "current" ? "Already at " + selected.name : "Route unavailable while unknown") + '</button>';
    const feedback = destination ? "Route planned: " + current.name + " → " + destination.name + ". Current location is still " + current.name + "." : "Map focus does not change your current location.";
    return head("Read the forest by its paths", "Focus reveals a place. Plotting a route records an intention; it does not move your current position.", "WILLOW BANK · MAP") +
      '<section class="scene-layout" aria-label="Forest map">' +
      plate("Waterfall, stream and forest arch in deep blue green light", "Original forest plate · route marks stay on a calm map surface", "50% 58%") +
      '<div class="scene-panel"><div class="panel-heading"><div><p class="eyebrow">03 · FOREST MAP</p><h2>Three places in view</h2><p>Shape and label mark each state.</p></div><div class="points">NORTH WOOD</div></div>' +
      '<div class="map-route" role="group" aria-label="Known path from current place toward unknown ground">' + marks + '</div>' +
      '<section class="map-copy" aria-live="polite"><p class="eyebrow">' + selected.state.toUpperCase() + ' · FOCUS ONLY</p><h3>' + selected.name + '</h3><p>' + selected.detail + '</p><p>Relation: ' + selected.relation + ' · Current place: ' + current.name + '.</p><span class="destination-tag">' + esc(routeText) + '</span><div class="action-row">' + action + '<button class="quiet-action" data-reset-map>Return focus to current place</button></div></section>' +
      '<p class="shard-state" id="map-feedback">' + esc(feedback) + '</p></div></section>' +
      '<div class="story-band"><p><strong>Wayfinding</strong> &nbsp; Current is a filled circle, discovered is a diamond, unknown is a dashed ring.</p><p class="map-state">Selecting a mark never teleports the player.</p></div>';
  }
  function render() {
    const route = (location.hash || "#abilities").slice(1);
    const page = ["abilities", "shards", "forest-map"].indexOf(route) >= 0 ? route : "abilities";
    document.querySelectorAll("[data-route]").forEach(function (link) {
      if (link.dataset.route === page) link.setAttribute("aria-current", "page");
      else link.removeAttribute("aria-current");
    });
    screen.innerHTML = page === "shards" ? shardScreen() : page === "forest-map" ? mapScreen() : abilityScreen();
    noteField.value = state.note;
    dialogRoot.innerHTML = "";
    live.textContent = "";
  }
  function announce(message) {
    live.textContent = "";
    window.requestAnimationFrame(function () { live.textContent = message; });
  }
  function closeDialog(message) {
    dialogRoot.innerHTML = "";
    state.pendingAbility = null;
    state.pendingShard = null;
    cancelDialog = null;
    render();
    if (message) announce(message);
  }
  function showDialog(title, description, confirmName, commit) {
    dialogRoot.innerHTML = '<div class="dialog-shade"><section class="confirm-dialog" role="dialog" aria-modal="true" aria-labelledby="dialog-title" aria-describedby="dialog-description"><p class="eyebrow">CONFIRM BEFORE APPLY</p><h2 id="dialog-title">' + title + '</h2><p id="dialog-description">' + description + '</p><div class="action-row"><button class="primary-action" data-confirm-dialog>' + confirmName + '</button><button class="quiet-action" data-cancel-dialog>Keep current state</button></div></section></div>';
    const confirm = dialogRoot.querySelector("[data-confirm-dialog]");
    const cancel = dialogRoot.querySelector("[data-cancel-dialog]");
    cancelDialog = function () { closeDialog("No changes were applied. The existing loadout remains in place."); };
    cancel.addEventListener("click", cancelDialog, { once:true });
    confirm.addEventListener("click", function () {
      const message = commit();
      closeDialog(message);
    }, { once:true });
    confirm.focus();
  }
  document.addEventListener("keydown", function (event) {
    const dialog = dialogRoot.querySelector('[role="dialog"]');
    if (!dialog) return;
    if (event.key === "Escape" && cancelDialog) { event.preventDefault(); cancelDialog(); return; }
    if (event.key === "Tab") {
      const buttons = dialog.querySelectorAll("button");
      if (event.shiftKey && document.activeElement === buttons[0]) { event.preventDefault(); buttons[buttons.length - 1].focus(); }
      else if (!event.shiftKey && document.activeElement === buttons[buttons.length - 1]) { event.preventDefault(); buttons[0].focus(); }
    }
  });
  document.addEventListener("click", function (event) {
    const choice = event.target.closest("[data-ability]");
    if (choice) { state.selectedAbility = choice.dataset.ability; render(); return; }
    const equip = event.target.closest("[data-equip]");
    if (equip) {
      const item = ability(equip.dataset.equip);
      const prerequisite = abilities.find(function (entry) { return entry.name === item.prereq; });
      const prereqMet = item.prereq === "No prerequisite" || (!!prerequisite && !!state.unlocked[prerequisite.id]);
      if (state.unlocked[item.id] || state.pendingAbility || state.points < item.cost || !prereqMet) return;
      state.pendingAbility = item.id;
      showDialog("Spend light points?", "Unlock and equip " + item.name + " for " + item.cost + " light points. You have " + state.points + ". Nothing is spent until you confirm.", "Confirm spend " + item.cost + " light points on " + item.name, function () {
        const pending = state.pendingAbility;
        const chosen = ability(pending);
        if (state.unlocked[pending] || state.points < chosen.cost) {
          state.abilityNotice = "The ability could not be equipped. Your points remain unchanged.";
          return state.abilityNotice;
        }
        state.points -= chosen.cost;
        state.unlocked[pending] = true;
        state.equippedAbility = pending;
        state.selectedAbility = pending;
        state.pendingAbility = null;
        state.abilityNotice = chosen.name + " is now equipped. " + state.points + " light points remain.";
        return state.abilityNotice;
      });
      return;
    }
    const slot = event.target.closest("[data-slot]");
    if (slot) {
      state.selectedSlot = slot.dataset.slot;
      state.pendingShard = null;
      state.shardNotice = "";
      state.selectedShard = shards.find(function (item) { return item.id !== state.shards[state.selectedSlot]; }).id;
      render();
      return;
    }
    const shardChoice = event.target.closest("[data-shard]");
    if (shardChoice) {
      const id = shardChoice.dataset.shard;
      if (id === state.shards[state.selectedSlot]) return;
      state.selectedShard = id;
      state.pendingShard = { slot:state.selectedSlot, shard:id };
      state.shardNotice = "";
      render();
      announce("Preview: " + shard(id).name + " for " + (state.selectedSlot === "slot-1" ? "Slot 1" : "Slot 2") + ". The equipped shard is unchanged.");
      return;
    }
    if (event.target.closest("[data-request-shard]") && state.pendingShard) {
      const pending = { slot:state.pendingShard.slot, shard:state.pendingShard.shard };
      const incoming = shard(pending.shard);
      const slotName = pending.slot === "slot-1" ? "slot 1" : "slot 2";
      showDialog("Apply this shard change?", "Replace the current shard in " + slotName + " with " + incoming.name + ". Benefit: " + incoming.benefit + ". Tradeoff: " + incoming.tradeoff + ". This swap has no point cost.", "Confirm replace " + slotName, function () {
        if (state.shards[pending.slot] === pending.shard) {
          state.shardNotice = "That shard is already equipped. No change was needed.";
          state.pendingShard = null;
          return state.shardNotice;
        }
        state.shards[pending.slot] = pending.shard;
        state.selectedSlot = pending.slot;
        state.selectedShard = shards.find(function (item) { return item.id !== pending.shard; }).id;
        state.pendingShard = null;
        state.shardNotice = (pending.slot === "slot-1" ? "Slot 1" : "Slot 2") + " now carries " + incoming.name + ". Benefit: " + incoming.benefit + ".";
        return state.shardNotice;
      });
      return;
    }
    if (event.target.closest("[data-cancel-preview]")) {
      state.pendingShard = null;
      state.shardNotice = "";
      state.selectedShard = shards.find(function (item) { return item.id !== state.shards[state.selectedSlot]; }).id;
      render();
      announce("Shard preview cleared. Equipped shards were not changed.");
      return;
    }
    const place = event.target.closest("[data-place]");
    if (place) { state.selectedPlace = place.dataset.place; render(); return; }
    const plot = event.target.closest("[data-plot-route]");
    if (plot && plot.dataset.plotRoute === "root-arch" && state.selectedPlace === "root-arch") {
      state.destination = "root-arch";
      render();
      announce("Route planned: Willow Bank → Root Arch. Current location is still Willow Bank.");
      return;
    }
    if (event.target.closest("[data-reset-map]")) {
      state.selectedPlace = state.currentPlace;
      render();
      announce("Focus returned to Willow Bank. Your route and current location are unchanged.");
    }
  });
  noteField.addEventListener("input", function () { state.note = noteField.value; });
  window.addEventListener("hashchange", render);
  if (!location.hash) history.replaceState(null, "", "#abilities");
  render();
})();
