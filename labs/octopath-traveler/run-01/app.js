(function () {
  "use strict";

  const screens = [
    { id: "party", title: "Party rail", description: "A compact roster marks the selected member and keeps lead changes behind an explicit action." },
    { id: "character-equipment", title: "Equipment comparison", description: "One actor and gear slot are compared at a time, with separate Apply and Cancel controls." },
    { id: "battle-orders", title: "Integrated battle stage", description: "Turn order and command choices sit inside one layered stage while the actors remain visible." }
  ];
  const members = [
    { name: "Vela", role: "Wayfinder", hp: "8 / 10", sprite: "gold" },
    { name: "Orin", role: "Guard", hp: "7 / 10", sprite: "blue" },
    { name: "Sela", role: "Scholar", hp: "6 / 10", sprite: "rose" },
    { name: "Bram", role: "Warden", hp: "9 / 10", sprite: "green" }
  ];

  function freshState() {
    return {
      lead: "Vela",
      selectedMember: "Vela",
      pendingLead: "Vela",
      confirmLead: false,
      currentGear: "Bronze staff",
      previewGear: "Glasswood rod",
      confirmGear: false,
      activeIndex: 0,
      turnNumber: 1,
      selectedCommand: "Strike",
      confirmAction: false,
      targetHp: 10,
      guarded: [],
      focusBp: { Vela: 0, Orin: 0, Sela: 0, Bram: 0 },
      notice: {
        party: "Roster and HP values are synthetic sample fixtures.",
        "character-equipment": "Equipment stays pending until you confirm Apply.",
        "battle-orders": "Preview only. Confirm action to resolve one local sample turn."
      }
    };
  }

  function transition(state, action) {
    if (action.type === "commit-action" && !state.confirmAction) return state;
    const next = Object.assign({}, state, {
      guarded: state.guarded.slice(),
      focusBp: Object.assign({}, state.focusBp),
      notice: Object.assign({}, state.notice)
    });
    if (action.type === "select-member") {
      next.selectedMember = action.name;
      next.pendingLead = action.name;
      next.confirmLead = false;
      next.notice.party = action.name + " selected for preview. " + next.lead + " remains the lead.";
    }
    if (action.type === "request-lead") {
      if (next.pendingLead === next.lead) {
        next.notice.party = next.lead + " is already the current lead.";
      } else {
        next.confirmLead = true;
        next.notice.party = "Confirm the lead change or keep " + next.lead + ".";
      }
    }
    if (action.type === "confirm-lead" && next.confirmLead) {
      next.lead = next.pendingLead;
      next.confirmLead = false;
      next.notice.party = "Lead changed to " + next.lead + " in this local sample.";
    }
    if (action.type === "cancel-lead" && next.confirmLead) {
      next.confirmLead = false;
      next.selectedMember = next.lead;
      next.pendingLead = next.lead;
      next.notice.party = "Lead change canceled. " + next.lead + " remains the lead.";
    }
    if (action.type === "select-gear") {
      next.previewGear = action.name;
      next.confirmGear = false;
      next.notice["character-equipment"] = action.name + " is a pending equipment preview.";
    }
    if (action.type === "request-gear") {
      if (next.previewGear === next.currentGear) {
        next.notice["character-equipment"] = next.currentGear + " is already equipped in this local sample.";
      } else {
        next.confirmGear = true;
        next.notice["character-equipment"] = "Confirm the equipment change or cancel it.";
      }
    }
    if (action.type === "confirm-gear" && next.confirmGear) {
      next.currentGear = next.previewGear;
      next.confirmGear = false;
      next.notice["character-equipment"] = next.currentGear + " equipped in this local sample; stats are not game data.";
    }
    if (action.type === "cancel-gear" && next.confirmGear) {
      next.previewGear = next.currentGear;
      next.confirmGear = false;
      next.notice["character-equipment"] = "Equipment change canceled. " + next.currentGear + " remains equipped.";
    }
    if (action.type === "select-command" && !state.confirmAction) {
      next.selectedCommand = action.name;
      next.notice["battle-orders"] = action.name + " preview for " + members[state.activeIndex].name + ". No turn has resolved.";
    }
    if (action.type === "request-action" && !state.confirmAction) {
      next.confirmAction = true;
      next.notice["battle-orders"] = "Confirm " + next.selectedCommand + " for " + members[state.activeIndex].name + "? This is a local sample action.";
    }
    if (action.type === "cancel-action" && state.confirmAction) {
      next.confirmAction = false;
      next.notice["battle-orders"] = next.selectedCommand + " canceled. No sample turn changed.";
    }
    if (action.type === "commit-action" && state.confirmAction) {
      const actor = members[state.activeIndex].name;
      const nextActor = members[(state.activeIndex + 1) % members.length].name;
      if (state.selectedCommand === "Strike") {
        next.targetHp = Math.max(0, state.targetHp - 2);
        next.notice["battle-orders"] = actor + " strikes Stone Mote for 2 sample damage. Target HP: " + next.targetHp + " of 10. " + nextActor + " is next.";
      } else if (state.selectedCommand === "Guard") {
        if (!next.guarded.includes(actor)) next.guarded.push(actor);
        next.notice["battle-orders"] = actor + " braces for the next sample hit. " + nextActor + " is next.";
      } else {
        next.focusBp[actor] = Math.min(3, next.focusBp[actor] + 1);
        next.notice["battle-orders"] = actor + " focuses. Sample BP is now " + next.focusBp[actor] + " of 3. " + nextActor + " is next.";
      }
      next.activeIndex = (state.activeIndex + 1) % members.length;
      next.turnNumber = state.turnNumber + 1;
      next.selectedCommand = "Strike";
      next.confirmAction = false;
    }
    return next;
  }

  if (typeof module !== "undefined" && module.exports) {
    module.exports = { screens: screens, freshState: freshState, transition: transition, members: members };
    return;
  }

  const app = document.getElementById("app");
  let state = freshState();
  let hasRendered = false;
  const gears = [
    { name: "Bronze staff", attack: "ATK sample 6", focus: "Focus sample +0", guard: "Guard sample +0" },
    { name: "Glasswood rod", attack: "ATK sample 8", focus: "Focus sample +2", guard: "Guard sample −1" }
  ];
  const commands = ["Strike", "Guard", "Focus"];

  function escapeText(value) {
    return String(value).replace(/[&<>"]/g, function (char) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[char];
    });
  }

  function routeId() {
    const id = location.hash.replace(/^#/, "");
    return screens.some(function (screen) { return screen.id === id; }) ? id : "party";
  }

  function nav(active) {
    return '<header class="topline"><div class="brand"><span class="brand-mark" aria-hidden="true"></span><span>OCTOPATH TRAVELER · ORIGINAL 2019 PC STUDY</span></div>' +
      '<nav class="route-nav" aria-label="Study screens">' + screens.map(function (screen) {
        return '<button type="button" data-route="' + screen.id + '"' +
          (screen.id === active ? ' aria-current="page"' : "") + '>' + escapeText(screen.title) + '</button>';
      }).join("") + '</nav></header>';
  }

  function sprite(color) {
    return '<span class="pixel-sprite sprite-' + color + '" aria-hidden="true"></span>';
  }

  function renderParty() {
    const selected = members.find(function (member) { return member.name === state.selectedMember; });
    const cards = members.map(function (member) {
      return '<button class="member-card" type="button" data-member="' + member.name + '" aria-label="' + member.name + '" aria-pressed="' +
        String(state.selectedMember === member.name) + '" data-focus="member-' + member.name.toLowerCase() + '">' +
        sprite(member.sprite) + '<strong>' + member.name + '</strong><small class="role-label">' + member.role +
        (state.lead === member.name ? " · lead" : "") + '</small><span class="sample-meter">HP sample ' + member.hp + '</span></button>';
    }).join("");
    const confirm = state.confirmLead
      ? '<div class="confirm-row" role="group" aria-label="Confirm party lead change"><p>Set ' + state.pendingLead + ' as lead? This changes only the local roster sample.</p>' +
        '<button class="action" type="button" data-action="confirm-lead" data-focus="confirm-lead">Confirm lead ' + state.pendingLead + '</button>' +
        '<button class="secondary" type="button" data-action="cancel-lead" data-focus="cancel-lead">Keep ' + state.lead + ' as lead</button></div>'
      : "";
    return '<main class="screen party-screen">' + nav("party") +
      '<section class="scene" aria-labelledby="screen-title"><div class="screen-intro"><p class="eyebrow">FOUR VOICES · ONE ROAD</p>' +
      '<h1 id="screen-title" tabindex="-1">A party in the lantern light.</h1><p class="intro-copy">Choose a member to inspect. The lead changes only after you confirm.</p></div>' +
      '<section class="party-console" aria-label="Party arrangement"><div class="console-heading"><div>' +
      '<strong id="member-heading">' + selected.name + ' · ' + selected.role + '</strong><small>Selected member · HP sample ' + selected.hp + '</small></div>' +
      '<span class="sample-meter">Lead: ' + state.lead + '</span></div><div class="party-rail" role="group" aria-label="Select a party member">' + cards + '</div>' +
      '<div class="commit-row"><span>Preview: ' + state.selectedMember + ' · Current lead: ' + state.lead + '</span>' +
      '<button class="action" type="button" data-action="request-lead" data-focus="request-lead" ' + (state.selectedMember === state.lead ? "disabled" : "") + '>Set lead</button></div>' +
      '<p class="status" role="status" aria-live="polite">' + escapeText(state.notice.party) + '</p>' + confirm + '</section></section></main>';
  }

  function renderEquipment() {
    const options = gears.map(function (gear, index) {
      const current = state.currentGear === gear.name;
      const pending = state.previewGear === gear.name;
      return '<button class="equipment-option" type="button" data-gear="' + escapeText(gear.name) + '" aria-label="' + escapeText(gear.name) +
        '" aria-pressed="' + String(pending) + '" data-focus="gear-' + index + '"><span class="equip-mark" aria-hidden="true">' + (index === 0 ? "I" : "II") +
        '</span><span><strong>' + escapeText(gear.name) + '</strong><small>' + (current ? "Equipped now" : (pending ? "Pending preview" : "Available")) +
        '</small></span><span class="compare">' + gear.attack + '</span></button>';
    }).join("");
    const preview = gears.find(function (gear) { return gear.name === state.previewGear; });
    const confirm = state.confirmGear
      ? '<div class="confirm-row" role="group" aria-label="Confirm equipment change"><p>Equip ' + escapeText(state.previewGear) + ' for Vela?</p>' +
        '<button class="action" type="button" data-action="confirm-gear" data-focus="confirm-gear">Confirm equip ' + escapeText(state.previewGear) + '</button>' +
        '<button class="secondary" type="button" data-action="cancel-gear" data-focus="cancel-gear">Keep ' + escapeText(state.currentGear) + '</button></div>'
      : "";
    return '<main class="screen equipment-scene">' + nav("character-equipment") +
      '<section class="scene equipment-scene" aria-labelledby="screen-title"><div class="screen-intro"><p class="eyebrow">ONE ACTOR · ONE SLOT</p>' +
      '<h1 id="screen-title" tabindex="-1">Choose what travels in hand.</h1><p class="intro-copy">The plaza stays open while one equipment comparison takes focus.</p></div>' +
      '<section class="equipment-console" aria-label="Vela hand equipment"><div class="actor-heading">' + sprite("gold") +
      '<span><strong>Vela · Wayfinder</strong><small>Hand slot · sample values</small></span></div><p class="equipment-slot">Current item: ' +
      escapeText(state.currentGear) + '</p><div class="equipment-list" role="group" aria-label="Preview hand equipment">' + options + '</div>' +
      '<p class="delta">Preview: ' + escapeText(preview.focus) + ' · ' + escapeText(preview.guard) + '</p>' +
      '<div class="equipment-actions"><p>Values are synthetic examples.</p><button class="action" type="button" data-action="request-gear" data-focus="request-gear" ' +
      (state.previewGear === state.currentGear ? "disabled" : "") + '>Apply equipment</button></div>' +
      '<p class="status" role="status" aria-live="polite">' + escapeText(state.notice["character-equipment"]) + '</p>' + confirm + '</section></section></main>';
  }

  function renderBattle() {
    const active = members[state.activeIndex];
    const queue = members.map(function (member, index) {
      return '<span class="turn-chip"' + (index === state.activeIndex ? ' aria-current="step"' : "") + '>' + member.name + '</span>';
    }).join("");
    const actionButtons = commands.map(function (command) {
      return '<button class="command" type="button" data-command="' + command + '" aria-pressed="' + String(state.selectedCommand === command) +
        '" data-focus="command-' + command.toLowerCase() + '"' + (state.confirmAction ? " disabled" : "") + '>' + command + '</button>';
    }).join("");
    const confirm = state.confirmAction
      ? '<div class="confirm-row" role="group" aria-label="Confirm battle action"><p>Resolve ' + escapeText(state.selectedCommand) + ' for ' + active.name + '?</p>' +
        '<button class="action" type="button" data-action="commit-action" data-focus="commit-action">Confirm ' + escapeText(state.selectedCommand) + '</button>' +
        '<button class="secondary" type="button" data-action="cancel-action" data-focus="cancel-action">Cancel action</button></div>'
      : "";
    const guardNames = state.guarded.length ? state.guarded.join(", ") : "None";
    const bpRows = members.map(function (member) { return member.name + " " + state.focusBp[member.name] + "/3"; }).join(" · ");
    return '<main class="screen battle-screen">' + nav("battle-orders") +
      '<section class="scene battle-scene" aria-labelledby="screen-title"><div class="screen-intro"><p class="eyebrow">TURN ' +
      String(state.turnNumber).padStart(2, "0") + ' · SAMPLE BATTLE</p><h1 id="screen-title" tabindex="-1">The plaza becomes a stage.</h1>' +
      '<p class="intro-copy">Party, target and command rail occupy one scene. Every action below is a local synthetic turn.</p></div>' +
      '<div class="turn-strip" aria-label="Synthetic party turn order"><span class="turn-label">ORDER</span>' + queue + '</div>' +
      '<div class="target-readout"><span class="target-mark" aria-hidden="true"></span><span><strong>Stone Mote</strong>' +
      '<small>Target · HP sample ' + state.targetHp + ' / 10</small></span></div>' +
      '<section class="command-console" aria-label="Battle command console"><div class="active-actor">' + sprite(active.sprite) +
      '<span><small>ACTIVE MEMBER · ' + active.role.toUpperCase() + '</small><strong>' + active.name + '</strong></span></div>' +
      '<div class="command-row" role="group" aria-label="Preview a battle command">' + actionButtons + '</div>' +
      '<button class="action confirm-action" type="button" data-action="request-action" data-focus="request-action" ' +
      (state.confirmAction ? "hidden" : "") + '>Confirm action</button>' +
      '<div class="battle-facts"><span>Target HP <strong>' + state.targetHp + ' / 10</strong></span><span>Guarded <strong>' + escapeText(guardNames) +
      '</strong></span><span>Focus BP <strong>' + escapeText(bpRows) + '</strong></span></div>' +
      '<p class="battle-status" role="status" aria-live="polite">' + escapeText(state.notice["battle-orders"]) + '</p>' + confirm + '</section>' +
      '<p class="battle-caption">Original generated HD-2D plaza · sprites and turn values are synthetic</p></section></main>';
  }

  function render(focusKey, moveToHeading) {
    const id = routeId();
    app.innerHTML = id === "party" ? renderParty() : (id === "character-equipment" ? renderEquipment() : renderBattle());
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
    if (button.dataset.member) {
      state = transition(state, { type: "select-member", name: button.dataset.member });
      render(focusKey, false);
      return;
    }
    if (button.dataset.gear) {
      state = transition(state, { type: "select-gear", name: button.dataset.gear });
      render(focusKey, false);
      return;
    }
    if (button.dataset.command) {
      state = transition(state, { type: "select-command", name: button.dataset.command });
      render(focusKey, false);
      return;
    }
    if (!button.dataset.action) return;
    const action = button.dataset.action;
    state = transition(state, { type: action });
    let nextFocusKey = focusKey;
    if (action === "request-lead") nextFocusKey = "confirm-lead";
    else if (action === "confirm-lead" || action === "cancel-lead") nextFocusKey = "member-" + state.lead.toLowerCase();
    else if (action === "request-gear") nextFocusKey = "confirm-gear";
    else if (action === "confirm-gear" || action === "cancel-gear") {
      nextFocusKey = "gear-" + gears.findIndex(function (gear) { return gear.name === state.currentGear; });
    }
    else if (action === "request-action") nextFocusKey = "commit-action";
    else if (action === "commit-action" || action === "cancel-action") nextFocusKey = "command-" + state.selectedCommand.toLowerCase();
    render(nextFocusKey, false);
  });

  document.addEventListener("keydown", function (event) {
    if (event.key !== "Escape") return;
    let focusKey = "";
    if (state.confirmLead) {
      state = transition(state, { type: "cancel-lead" });
      focusKey = "member-" + state.lead.toLowerCase();
    } else if (state.confirmGear) {
      state = transition(state, { type: "cancel-gear" });
      focusKey = "gear-" + gears.findIndex(function (gear) { return gear.name === state.currentGear; });
    } else if (state.confirmAction) {
      state = transition(state, { type: "cancel-action" });
      focusKey = "command-" + state.selectedCommand.toLowerCase();
    } else return;
    render(focusKey, false);
  });

  window.addEventListener("hashchange", function () { render("", true); });
  if (!location.hash || !screens.some(function (screen) { return screen.id === location.hash.slice(1); })) {
    history.replaceState(null, "", location.pathname + location.search + "#party");
  }
  render("", false);
}());
