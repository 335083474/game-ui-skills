(() => {
  "use strict";

  const SCREENS = [
    { id: "squad-loadout", title: "Squad loadout", description: "A unit formation keeps role, count, and equipment readable through repeated shape and text." },
    { id: "expedition-select", title: "Expedition select", description: "A route choice shows danger and supply cost in a clear rhythm-friendly selection sequence." },
    { id: "rhythm-hud", title: "Rhythm HUD", description: "Beat prompts use bold symbols, timing window, and text feedback with visual alternatives to sound." }
  ];
  const INITIAL_SQUAD = [
    { id: "scout-01", role: "scouts", count: 3, formation: "front", glyph: "◆", gear: "short spears" },
    { id: "drummer-01", role: "drummer", count: 1, formation: "rear", glyph: "●", gear: "round drum" }
  ];
  const ROUTES = [
    { id: "reed-pass", label: "Reedstone Pass", danger: "medium", cost: 2, unlocked: true, glyph: "◈", distance: "Short march · 2 rations" },
    { id: "silt-ladder", label: "Silt Ladder", danger: "high", cost: 4, unlocked: false, glyph: "⬢", distance: "Long march · locked" }
  ];
  const SEQUENCE = ["PON", "PATA", "PON", "CHAKA"];

  function createInitialState() {
    return {
      squad: INITIAL_SQUAD.map((unit) => ({ ...unit })),
      activeUnit: "scout-01",
      formationPreview: null,
      callSign: "Reed Runners",
      selectedRoute: "reed-pass",
      rations: 4,
      sortieName: "Northwind sortie",
      launched: false,
      sequence: [...SEQUENCE],
      currentIndex: 1,
      windowMs: 180,
      beatResults: [],
      lastResult: "ready",
      drummerNote: "Hold the gap, then answer PATA.",
      pending: null,
      nextTransaction: 1,
      committed: []
    };
  }

  function selectUnit(state, unitId) {
    const unit = state.squad.find((candidate) => candidate.id === unitId);
    if (!unit) return { ok: false, reason: "unknown-unit" };
    state.activeUnit = unitId;
    state.formationPreview = null;
    return { ok: true, unit };
  }

  function previewFormation(state, formation) {
    const unit = state.squad.find((candidate) => candidate.id === state.activeUnit);
    if (!unit || !["front", "rear"].includes(formation)) return { ok: false, reason: "invalid-formation" };
    state.formationPreview = formation;
    return { ok: true, unit, formation };
  }

  function cancelFormationPreview(state) {
    state.formationPreview = null;
    state.pending = null;
    return { ok: true };
  }

  function selectRoute(state, routeId) {
    const route = ROUTES.find((candidate) => candidate.id === routeId);
    if (!route || !route.unlocked) return { ok: false, reason: "route-locked" };
    state.selectedRoute = routeId;
    return { ok: true, route };
  }

  function inputBeat(state) {
    if (state.currentIndex >= state.sequence.length) return { ok: false, reason: "sequence-complete" };
    const beatNumber = state.currentIndex + 1;
    const command = state.sequence[state.currentIndex];
    state.beatResults.push({ beatNumber, command, result: "HIT" });
    state.currentIndex += 1;
    state.lastResult = "HIT";
    return { ok: true, beatNumber, command, nextCommand: state.sequence[state.currentIndex] || null, complete: state.currentIndex >= state.sequence.length };
  }

  function beginTransaction(state, kind) {
    if (state.pending) return { ok: false, reason: "transaction-already-open" };
    let transaction;
    if (kind === "formation") {
      const unit = state.squad.find((candidate) => candidate.id === state.activeUnit);
      if (!unit || !state.formationPreview || state.formationPreview === unit.formation) return { ok: false, reason: "no-formation-change" };
      const unitLabel = unit.role[0].toUpperCase() + unit.role.slice(1);
      transaction = { kind, unitId: unit.id, unitLabel, formation: state.formationPreview, count: unit.count, label: `Apply ${unitLabel} to ${state.formationPreview} formation`, copy: `Move ${unit.count} ${unit.role} to the ${state.formationPreview} formation? Their current position stays active until you confirm.` };
    } else if (kind === "sortie") {
      const route = ROUTES.find((candidate) => candidate.id === state.selectedRoute);
      if (state.launched) return { ok: false, reason: "already-launched" };
      if (!route || !route.unlocked) return { ok: false, reason: "route-locked" };
      if (state.rations < route.cost) return { ok: false, reason: "insufficient-rations" };
      transaction = { kind, routeId: route.id, routeLabel: route.label, cost: route.cost, label: `Launch ${route.label} · spend ${route.cost} rations`, copy: `Launch ${route.label}? Danger is ${route.danger}. This costs ${route.cost} rations; you have ${state.rations}. The launch can be charged once.` };
    } else if (kind === "reset") {
      transaction = { kind, label: "Reset rhythm sequence", copy: "Reset the practice sequence to Beat 1? This clears the visible session hits only; it spends no supplies." };
    } else {
      return { ok: false, reason: "unknown-transaction" };
    }
    transaction.id = `patapon-tx-${state.nextTransaction++}`;
    state.pending = transaction;
    return { ok: true, transaction };
  }

  function cancelTransaction(state) {
    if (!state.pending) return { ok: false, reason: "no-open-transaction" };
    state.pending = null;
    return { ok: true };
  }

  function confirmTransaction(state) {
    const transaction = state.pending;
    if (!transaction) return { ok: false, reason: "no-open-transaction" };
    let result;
    if (transaction.kind === "formation") {
      const unit = state.squad.find((candidate) => candidate.id === transaction.unitId);
      if (!unit || unit.formation === transaction.formation) {
        state.pending = null;
        return { ok: false, reason: "formation-state-changed" };
      }
      unit.formation = transaction.formation;
      state.formationPreview = null;
      result = { ok: true, message: `${transaction.unitLabel} moved to ${transaction.formation} formation. ${transaction.count} units stay assigned; change recorded once.` };
    } else if (transaction.kind === "sortie") {
      const route = ROUTES.find((candidate) => candidate.id === transaction.routeId);
      if (!route || state.launched || !route.unlocked || state.rations < transaction.cost) {
        state.pending = null;
        return { ok: false, reason: "sortie-state-changed" };
      }
      state.rations -= transaction.cost;
      state.launched = true;
      result = { ok: true, message: `Sortie launched: ${transaction.routeLabel}. ${state.rations} rations remain; launch recorded once.` };
    } else {
      state.sequence = [...SEQUENCE];
      state.currentIndex = 0;
      state.beatResults = [];
      state.lastResult = "ready";
      result = { ok: true, message: "Rhythm drill reset to Beat 1. Supplies unchanged." };
    }
    state.committed.push(transaction.id);
    state.pending = null;
    return result;
  }

  const model = { createInitialState, selectUnit, previewFormation, cancelFormationPreview, selectRoute, inputBeat, beginTransaction, cancelTransaction, confirmTransaction, screens: SCREENS };
  if (typeof module !== "undefined" && module.exports) module.exports = model;
  if (typeof document === "undefined") return;

  const state = createInitialState();
  const host = document.querySelector("#screen");
  const dialog = document.querySelector("#confirm-dialog");
  const dialogTitle = document.querySelector("#confirm-title");
  const dialogCopy = document.querySelector("#confirm-copy");
  const confirmButton = dialog.querySelector("[data-confirm]");
  const cancelButton = dialog.querySelector("[data-cancel]");
  const routeFromHash = () => window.location.hash.slice(1);
  let currentScreen = SCREENS.some((screen) => screen.id === routeFromHash()) ? routeFromHash() : SCREENS[0].id;
  if (!window.location.hash) window.history.replaceState(null, "", `#${currentScreen}`);

  function escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char]);
  }

  function header(label, title, intro, badge) {
    return `<header class="page-head"><div><p class="eyebrow">${label}</p><h1>${title}</h1><p class="page-intro">${intro}</p></div><span class="beat-badge">${badge}</span></header><figure class="march-art"><img src="art.png" alt="Original geometric mask-like soldiers carrying round drums across a coral field"><figcaption>ORIGINAL GEOMETRIC DIRECTION PLATE · NO SOURCE-GAME CHARACTERS</figcaption></figure>`;
  }

  function totems(role, count = 1) {
    return `<span class="totem-line" aria-hidden="true">${Array.from({ length: Math.min(count, 5) }, () => `<i class="totem"><i></i></i>`).join("")}</span>`;
  }

  function squadScreen() {
    const active = state.squad.find((unit) => unit.id === state.activeUnit) || state.squad[0];
    const formation = state.formationPreview || active.formation;
    const label = active.role[0].toUpperCase() + active.role.slice(1);
    const rows = state.squad.map((unit) => {
      const selected = state.activeUnit === unit.id;
      return `<article class="unit-row" data-role="${unit.role}"><button type="button" class="unit-button" data-unit="${unit.id}" aria-pressed="${selected}" aria-label="Select ${unit.role[0].toUpperCase() + unit.role.slice(1)}, ${unit.role === "scouts" ? "scout role" : "drummer role"}, ${unit.count} ${unit.count === 1 ? "unit" : "units"}, ${unit.formation} formation">${totems(unit.role, unit.count)}<span class="unit-copy"><strong>${unit.role}</strong><small>${unit.count} ${unit.count === 1 ? "unit" : "units"} · ${unit.gear}</small></span><span class="unit-state">${unit.formation.toUpperCase()}<br>${selected ? state.formationPreview ? "PREVIEW" : "SELECTED" : "READY"}</span></button></article>`;
    }).join("");
    return `<section class="page">${header("CAMP FORMATION · ROLE, COUNT, POSITION", "Squad loadout", "Give the marching line a shape. Select a unit group, preview its position, then confirm the formation change.", "3 SCOUTS · 1 DRUMMER")}
      <div class="army-grid"><section class="field-panel" aria-labelledby="squad-title"><div class="field-heading"><h2 id="squad-title">Marching formation</h2><span>FRONT / REAR</span></div><div class="army-figures">${totems("scouts", 3)}${totems("drummer", 1)}</div><div class="unit-list">${rows}</div><label class="field-label" for="call-sign">Editable squad call sign</label><input id="call-sign" class="field" value="${escapeHtml(state.callSign)}" maxlength="28" aria-label="Editable squad call sign"><p class="fineprint">Unit marks use original geometric shapes. Role and count are always written beside them.</p></section>
        <section class="field-panel" aria-labelledby="formation-title"><div class="field-heading"><h2 id="formation-title">Position order</h2><span>${label.toUpperCase()} · ${active.count}</span></div><p>Current assignment: <b>${active.formation.toUpperCase()}</b> line. Preview assignment: <b>${formation.toUpperCase()}</b> line.</p><div class="formation-tools"><button type="button" class="formation-choice" data-formation="front" aria-label="Preview Front line" aria-pressed="${formation === "front"}">◆ Front line</button><button type="button" class="formation-choice" data-formation="rear" aria-label="Preview Rear line" aria-pressed="${formation === "rear"}">● Rear line</button></div><p class="preview-note">${state.formationPreview ? "Preview only: no unit has moved yet." : "Choose a position to preview the formation."}</p><div class="button-row"><button type="button" class="command-button dark" data-begin="formation" ${!state.formationPreview || state.formationPreview === active.formation ? "disabled" : ""}>Review formation change</button><button type="button" class="command-button light" data-revert-formation>Cancel preview</button></div><p class="status" role="status" aria-live="polite">${escapeHtml(state.status || "Select Scouts or Drummer to inspect the unit role and count.")}</p><p class="fineprint">No unit count or equipment is changed by preview. Confirmation updates position once.</p></section></div>
    </section>`;
  }

  function routeScreen() {
    const selected = ROUTES.find((route) => route.id === state.selectedRoute) || ROUTES[0];
    const routeCards = ROUTES.map((route) => `<button type="button" class="route-choice" data-route="${route.id}" aria-label="Select ${route.label} route, ${route.danger} danger, costs ${route.cost} rations${route.unlocked ? "" : ", locked"}" aria-pressed="${selected.id === route.id}" ${route.unlocked ? "" : "disabled"}><span class="route-glyph" aria-hidden="true">${route.glyph}</span><span><strong>${route.label}</strong><small>${route.danger.toUpperCase()} DANGER · ${route.distance}</small></span><span class="route-cost">${route.cost} RATIONS<br>${route.unlocked ? "OPEN" : "LOCKED"}</span></button>`).join("");
    return `<section class="page">${header("EXPEDITION BOARD · SUPPLIES SHOWN FIRST", "Choose the march", "Route danger and ration cost are visible before launch. Preview a path, name the sortie, then confirm the one-time supply spend.", "SUPPLY LINE · 04 RATIONS")}
      <div class="army-grid"><section class="field-panel" aria-labelledby="route-title"><div class="field-heading"><h2 id="route-title">Open routes</h2><span>CURRENT CAMP → FIELD</span></div><div class="supply-stamp"><span>RATIONS IN STORES</span><strong>${state.rations}</strong></div><div class="route-list">${routeCards}</div><div class="route-map" aria-label="Route map diagram"><span class="route-node">CAMP<br>SAFE</span><span class="route-dash" aria-hidden="true"></span><span class="route-node active">${selected.label.toUpperCase()}<br>${selected.danger.toUpperCase()} DANGER</span></div><p class="fineprint">Silt Ladder stays locked. Its danger and 4-ration price are written beside the disabled route.</p></section>
        <section class="field-panel" aria-labelledby="sortie-title"><div class="field-heading"><h2 id="sortie-title">Sortie plan</h2><span>1 ROUTE · 1 COMMIT</span></div><p class="eyebrow">${selected.label.toUpperCase()} · ${selected.danger.toUpperCase()} DANGER</p><p>${selected.cost} ration${selected.cost === 1 ? "" : "s"} will be used. ${state.rations} remain in supply before launch.</p><label class="field-label" for="sortie-name">Editable sortie name</label><input id="sortie-name" class="field" maxlength="40" value="${escapeHtml(state.sortieName)}" aria-label="Editable sortie name"><div class="button-row"><button type="button" class="command-button dark" data-begin="sortie" ${state.launched || !selected.unlocked || state.rations < selected.cost ? "disabled" : ""}>Review sortie launch</button><button type="button" class="command-button light" data-cancel-route>Cancel route preview</button></div><p class="status" role="status" aria-live="polite">${escapeHtml(state.status || "No supplies spent. The route is only a preview.")}</p><p class="fineprint">The 2-ration launch can be charged once. Reload to restore this fictional supply state.</p></section></div>
    </section>`;
  }

  function rhythmScreen() {
    const complete = state.currentIndex >= state.sequence.length;
    const beats = state.sequence.map((command, index) => {
      const stateClass = index < state.currentIndex ? "past" : index === state.currentIndex ? "current" : "future";
      return `<span class="beat ${stateClass}" ${index === state.currentIndex ? 'aria-current="step"' : ""}><span>${command}</span></span>`;
    }).join("");
    const command = state.sequence[state.currentIndex] || "DONE";
    const next = state.sequence[state.currentIndex + 1] || "—";
    const figures = state.squad.map((unit) => totems(unit.role, unit.count)).join("");
    return `<section class="page">${header("COMMAND PRACTICE · VISUAL AND TEXT FEEDBACK", "Rhythm HUD", "The current beat is largest; past and future beats remain legible. Timing, command, and result are written down as well as shown.", "WINDOW 180 MS · PRACTICE DRILL")}
      <div class="hud-layout"><figure class="battle-plate"><img src="art.png" alt="Fictional geometric drum soldiers marching in a line on a coral field"><div class="army-figures">${figures}</div><figcaption class="battle-info"><span><strong>Hold the reed pass</strong><small>FIELD PRACTICE · NO AUDIO REQUIRED</small></span><span><small>RHYTHM</small><br><b>${complete ? state.sequence.length : state.currentIndex + 1} / ${state.sequence.length}</b></span></figcaption></figure>
        <section class="beat-panel" aria-labelledby="hud-title"><div><div class="beat-header"><h2 id="hud-title">Command sequence</h2><span class="window-label">${state.windowMs} MS WINDOW</span></div><div class="beats" aria-label="Beat sequence: ${state.sequence.join(", ")}">${beats}</div><p class="beat-label">${complete ? "SEQUENCE COMPLETE" : `BEAT ${state.currentIndex + 1} OF ${state.sequence.length} · PRESS ${command}`}</p><p class="timing-copy">${complete ? "All four commands are recorded for this page session." : `Timing window: ${state.windowMs} milliseconds. Current command: ${command}. Next command: ${next}.`}</p><button type="button" class="beat-input" data-input-beat aria-label="Input ${command} command" ${complete ? "disabled" : ""}>INPUT ${command}</button><p class="beat-status" role="status" aria-live="polite">${escapeHtml(state.status || (state.lastResult === "ready" ? "READY · no command entered yet." : state.status))}</p><p class="key-hint">The button works with pointer, Enter, or Space. No animation or sound is needed to read the result.</p></div><div><label class="field-label" for="drummer-note">Editable drummer note</label><input id="drummer-note" class="rhythm-note" value="${escapeHtml(state.drummerNote)}" maxlength="48" aria-label="Editable drummer note"><button type="button" class="command-button light" data-begin="reset" style="width:100%;margin-top:.65rem">Review drill reset</button></div></section></div>
    </section>`;
  }

  function openConfirmation(transaction) {
    dialogTitle.textContent = transaction.kind === "formation" ? "Change unit position?" : transaction.kind === "sortie" ? "Commit this route?" : "Reset this drill?";
    dialogCopy.textContent = transaction.copy;
    confirmButton.textContent = transaction.label;
    confirmButton.setAttribute("aria-label", transaction.label);
    dialog.showModal();
    confirmButton.focus();
  }

  function render() {
    document.querySelectorAll("[data-screen]").forEach((link) => {
      if (link.dataset.screen === currentScreen) link.setAttribute("aria-current", "page");
      else link.removeAttribute("aria-current");
    });
    host.innerHTML = currentScreen === "squad-loadout" ? squadScreen() : currentScreen === "expedition-select" ? routeScreen() : rhythmScreen();
    document.title = `Drumbeat Muster — ${SCREENS.find((screen) => screen.id === currentScreen).title}`;
    bindActions();
  }

  function status(message) {
    state.status = message;
    const element = host.querySelector("[role=status]");
    if (element) element.textContent = message;
  }

  function bindActions() {
    host.querySelectorAll("[data-unit]").forEach((button) => button.addEventListener("click", () => {
      const result = selectUnit(state, button.dataset.unit);
      status(result.ok ? `${result.unit.role[0].toUpperCase() + result.unit.role.slice(1)} selected. ${result.unit.count} units · ${result.unit.formation} formation.` : "Unit not found.");
      render();
      host.querySelector(`[data-unit="${button.dataset.unit}"]`)?.focus();
    }));
    host.querySelectorAll("[data-formation]").forEach((button) => button.addEventListener("click", () => {
      const result = previewFormation(state, button.dataset.formation);
      status(result.ok ? `${result.unit.role[0].toUpperCase() + result.unit.role.slice(1)} formation preview: ${result.formation}. No units moved yet.` : "That formation is unavailable.");
      render();
      host.querySelector(`[data-formation="${button.dataset.formation}"]`)?.focus();
    }));
    host.querySelector("[data-revert-formation]")?.addEventListener("click", () => {
      cancelFormationPreview(state);
      status("Formation preview cancelled. The original positions are unchanged.");
      render();
      host.querySelector("[data-revert-formation]")?.focus();
    });
    host.querySelectorAll("[data-route]").forEach((button) => button.addEventListener("click", () => {
      const result = selectRoute(state, button.dataset.route);
      status(result.ok ? `${result.route.label} selected for preview. ${result.route.cost} rations required; no supplies spent.` : "That route is locked. No route was selected.");
      render();
      host.querySelector(`[data-route="${button.dataset.route}"]`)?.focus();
    }));
    host.querySelectorAll("[data-begin]").forEach((button) => button.addEventListener("click", () => {
      const result = beginTransaction(state, button.dataset.begin);
      if (!result.ok) {
        const messages = { "no-formation-change": "Preview a different formation before reviewing the change.", "route-locked": "This route is locked. No supplies were spent.", "insufficient-rations": "Not enough rations. No supplies were spent.", "already-launched": "This sortie has already launched for this page session." };
        status(messages[result.reason] || "That command cannot be reviewed.");
        return;
      }
      openConfirmation(result.transaction);
    }));
    host.querySelector("[data-cancel-route]")?.addEventListener("click", () => {
      const result = selectRoute(state, "reed-pass");
      status("Route preview cancelled. Supplies remain unchanged.");
      render();
      host.querySelector("[data-cancel-route]")?.focus();
    });
    host.querySelector("[data-input-beat]")?.addEventListener("click", () => {
      const result = inputBeat(state);
      if (!result.ok) {
        status("Sequence complete. No extra beat was added.");
        render();
        return;
      }
      status(result.complete ? `Beat ${result.beatNumber} of 4 · HIT: ${result.command}. Sequence complete.` : `Beat ${result.beatNumber} of 4 · HIT: ${result.command}. Next command: ${result.nextCommand}.`);
      render();
      host.querySelector("[data-input-beat]")?.focus();
    });
    const callSign = host.querySelector("#call-sign");
    if (callSign) callSign.addEventListener("input", () => { state.callSign = callSign.value.slice(0, 28); });
    const sortieName = host.querySelector("#sortie-name");
    if (sortieName) sortieName.addEventListener("input", () => { state.sortieName = sortieName.value.slice(0, 40); });
    const drummerNote = host.querySelector("#drummer-note");
    if (drummerNote) drummerNote.addEventListener("input", () => { state.drummerNote = drummerNote.value.slice(0, 48); });
  }

  confirmButton.addEventListener("click", () => {
    const result = confirmTransaction(state);
    dialog.close();
    status(result.ok ? result.message : "This command could not be committed again. No second change was made.");
    render();
    host.querySelector("[role=status]")?.focus({ preventScroll: true });
  });
  cancelButton.addEventListener("click", () => {
    cancelTransaction(state);
    dialog.close();
    status("Command cancelled. Formation and supplies are unchanged.");
    render();
  });
  dialog.addEventListener("cancel", () => { cancelTransaction(state); status("Command cancelled. Formation and supplies are unchanged."); });
  window.addEventListener("hashchange", () => {
    cancelTransaction(state);
    if (dialog.open) dialog.close();
    const candidate = routeFromHash();
    currentScreen = SCREENS.some((screen) => screen.id === candidate) ? candidate : SCREENS[0].id;
    state.status = "";
    render();
  });
  render();
})();
