(() => {
  "use strict";

  const SCREENS = [
    { id: "equipment-cards", title: "Equipment cards", description: "A theatrical loadout compares shot, charm, and super choices before the player commits." },
    { id: "shop-counter", title: "Shop counter", description: "A fictional counter previews cost and stock, then confirms a purchase exactly once." },
    { id: "level-results", title: "Level results", description: "A grade seal presents time and objectives before the player records a stage memo." }
  ];
  const EQUIPMENT = {
    shot: [
      { id: "spread", name: "Spread Shot", detail: "Close-range fan · steady damage" },
      { id: "charge", name: "Charge Shot", detail: "Long-range burst · hold to release" }
    ],
    charm: [
      { id: "smoke-dash", name: "Smoke Dash", detail: "Slip through one hazard" },
      { id: "heart-ring", name: "Heart Ring", detail: "A safer stage, slower finish" }
    ],
    super: [
      { id: "beam", name: "Energy Beam", detail: "A straight theatrical flourish" },
      { id: "ghost", name: "Ghost Parade", detail: "A sweeping invulnerable arc" }
    ]
  };
  const SHOP = [
    { id: "roundabout", name: "Roundabout Shot", cost: 3, detail: "A returning shot for crowded lanes" },
    { id: "extra-heart", name: "Extra Heart", cost: 5, detail: "One more chance; the price is shown first" }
  ];

  function createInitialState() {
    return {
      slot: "shot",
      equipped: { shot: "spread", charm: "smoke-dash", super: "beam" },
      preview: {},
      loadoutNote: "A bright close-range setup",
      coins: 4,
      owned: [],
      shopNote: "One ticket at a time",
      memo: "Parried through the spinning reel",
      resultRecorded: false,
      pending: null,
      nextTransaction: 1,
      committed: []
    };
  }

  function previewEquipment(state, slot, itemId) {
    const item = EQUIPMENT[slot]?.find((candidate) => candidate.id === itemId);
    if (!item) return { ok: false, reason: "unknown-equipment" };
    state.slot = slot;
    state.preview[slot] = itemId;
    return { ok: true, item };
  }

  function cancelPreview(state) {
    state.preview = {};
    state.pending = null;
    return { ok: true };
  }

  function beginTransaction(state, kind, data = {}) {
    if (state.pending) return { ok: false, reason: "transaction-already-open" };
    let transaction;
    if (kind === "equipment") {
      const slot = state.slot;
      const itemId = state.preview[slot];
      const item = EQUIPMENT[slot]?.find((candidate) => candidate.id === itemId);
      if (!item || state.equipped[slot] === itemId) return { ok: false, reason: "no-equipment-change" };
      transaction = { kind, slot, itemId, itemName: item.name, label: `Confirm loadout: ${item.name}`, copy: `Replace the ${slot} slot with ${item.name}? The current equipment stays active until you confirm.` };
    } else if (kind === "purchase") {
      const item = SHOP.find((candidate) => candidate.id === data.itemId);
      if (!item) return { ok: false, reason: "unknown-item" };
      if (state.owned.includes(item.id)) return { ok: false, reason: "already-owned" };
      if (state.coins < item.cost) return { ok: false, reason: "insufficient-coins" };
      transaction = { kind, itemId: item.id, itemName: item.name, cost: item.cost, label: `Confirm purchase: ${item.name} for ${item.cost} coins`, copy: `Spend ${item.cost} coins on ${item.name}? You have ${state.coins} coins. This confirmation is charged once.` };
    } else if (kind === "result") {
      if (state.resultRecorded) return { ok: false, reason: "already-recorded" };
      transaction = { kind, memo: String(state.memo), label: "Record Grade A- to notebook", copy: `Record Grade A- and this stage note: “${String(state.memo)}”` };
    } else {
      return { ok: false, reason: "unknown-transaction" };
    }
    transaction.id = `cuphead-tx-${state.nextTransaction++}`;
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
    if (state.committed.includes(transaction.id)) {
      state.pending = null;
      return { ok: false, reason: "duplicate-transaction" };
    }
    let result;
    if (transaction.kind === "equipment") {
      state.equipped[transaction.slot] = transaction.itemId;
      delete state.preview[transaction.slot];
      result = { ok: true, message: `${transaction.slot[0].toUpperCase()}${transaction.slot.slice(1)} slot updated to ${transaction.itemName}. Loadout change committed once.` };
    } else if (transaction.kind === "purchase") {
      const item = SHOP.find((candidate) => candidate.id === transaction.itemId);
      if (!item || state.owned.includes(transaction.itemId) || state.coins < transaction.cost) {
        state.pending = null;
        return { ok: false, reason: "purchase-state-changed" };
      }
      state.coins -= transaction.cost;
      state.owned.push(transaction.itemId);
      result = { ok: true, message: `Purchase complete: ${transaction.itemName} added. ${state.coins} coin${state.coins === 1 ? "" : "s"} left.` };
    } else {
      if (state.resultRecorded) {
        state.pending = null;
        return { ok: false, reason: "already-recorded" };
      }
      state.resultRecorded = true;
      result = { ok: true, message: `Stage grade A- recorded once; notebook line: “${transaction.memo}”` };
    }
    state.committed.push(transaction.id);
    state.pending = null;
    return result;
  }

  const model = { createInitialState, previewEquipment, cancelPreview, beginTransaction, cancelTransaction, confirmTransaction, screens: SCREENS };
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

  function html(strings, ...values) {
    return String.raw({ raw: strings }, ...values);
  }

  function header(eyebrow, title, intro, stamp) {
    return `<div class="stage-heading"><div><p class="eyebrow">${eyebrow}</p><h1>${title}</h1><p class="stage-intro">${intro}</p></div><span class="chapter-tag">${stamp}</span></div>`;
  }

  function poster(alt, caption, position = "center 49%") {
    return `<figure class="poster"><img src="art.png" alt="${alt}" style="object-position:${position}"><figcaption>${caption}</figcaption></figure>`;
  }

  function equipmentScreen() {
    const activeId = state.preview[state.slot] || state.equipped[state.slot];
    const items = EQUIPMENT[state.slot].map((item, index) => `
      <button type="button" class="choice" data-equipment="${item.id}" aria-label="Select ${item.name}, ${item.detail.toLowerCase()}" aria-pressed="${activeId === item.id}">
        <span class="choice-mark" aria-hidden="true">${index === 0 ? "✦" : "◇"}</span>
        <span><strong>${item.name}</strong><small>${item.detail}</small></span>
        <span class="choice-state">${state.equipped[state.slot] === item.id ? "EQUIPPED" : activeId === item.id ? "PREVIEW" : "READY"}</span>
      </button>`).join("");
    const slotNames = { shot: "Shot", charm: "Charm", super: "Super" };
    return `<section class="stage">
      ${header("EQUIPMENT TICKET · STAGE READY", "Loadout cards", "Choose a slot, preview a replacement, then give the ticket a final look before it changes the loadout.", "TICKET 01")}
      <div class="scene-grid">${poster("Original stage still life with a wheeled calliope, spring-mounted tap shoes, a striped parasol, and brass horn", "ORIGINAL STAGE PLATE · OPENING ACT", "center 48%")}
        <section class="play-panel" aria-labelledby="panel-title"><div class="panel-heading"><div><p class="eyebrow">CURRENTLY ON THE BILL</p><h2 id="panel-title">${slotNames[state.slot]} selection</h2></div><span class="seal-star" aria-hidden="true">✦</span></div>
          <div class="slot-tabs" role="group" aria-label="Equipment slot">${Object.entries(slotNames).map(([slot, name]) => `<button type="button" data-slot="${slot}" aria-pressed="${state.slot === slot}">${name}</button>`).join("")}</div>
          <div class="choice-list">${items}</div>
          <p class="preview-note" id="equipment-preview">${state.preview[state.slot] ? "Preview only — the equipped item is unchanged until confirmation." : `Equipped: ${EQUIPMENT[state.slot].find((item) => item.id === state.equipped[state.slot]).name}.`}</p>
          <label class="field-label" for="loadout-note">Editable loadout note</label><input class="field" id="loadout-note" maxlength="60" value="${escapeAttr(state.loadoutNote)}" aria-label="Editable loadout note">
          <div class="actions"><button type="button" class="button button-hot" data-begin="equipment" ${activeId === state.equipped[state.slot] ? "disabled" : ""}>Review equipment change</button><button type="button" class="button button-quiet" data-revert>Revert preview</button></div>
          <p class="fineprint">No inventory is spent by previewing. A change takes effect only after the last confirmation.</p><p class="status" role="status" aria-live="polite">${state.status || ""}</p>
        </section>
      </div>
    </section>`;
  }

  function shopScreen() {
    const items = SHOP.map((item) => {
      const owned = state.owned.includes(item.id);
      const affordable = state.coins >= item.cost;
      return `<article class="shop-item ${state.selectedShop === item.id ? "selected" : ""}">
        <span class="item-sticker" aria-hidden="true">${item.id === "roundabout" ? "↶" : "♥"}</span>
        <div><h3>${item.name}</h3><p>${item.detail}</p><span class="price-tag">${item.cost} COINS · ${owned ? "IN THE CASE" : affordable ? "IN STOCK" : `NEED ${item.cost - state.coins} MORE`}</span></div>
        <button type="button" class="button ${owned ? "button-quiet" : "button-hot"}" data-buy="${item.id}" aria-label="${owned ? `${item.name} already owned` : `Review purchase: ${item.name}, ${item.cost} coins`}" ${owned || !affordable ? "disabled" : ""}>${owned ? "OWNED" : affordable ? "PREVIEW" : "SHORT"}</button>
      </article>`;
    }).join("");
    return `<section class="stage">
      ${header("SHOP COUNTER · PRICES BEFORE PROMISES", "The prop-shop window", "Every placard shows the price and stock state. A purchase stays pending until you confirm it.", "OPEN TODAY")}
      <div class="scene-grid">${poster("Original vaudeville stage plate with brass calliope, spring shoes, and a striped parasol", "THE MARQUEE PROP SHOP · FICTIONAL GOODS", "48% 44%")}
        <section class="play-panel" aria-labelledby="shop-title"><div class="panel-heading"><div><p class="eyebrow">PICK A PLACARD</p><h2 id="shop-title">Today’s counter</h2></div><span class="chapter-tag">2 ITEMS</span></div>
          <div class="shop-layout"><div><div class="coin-box"><span>YOUR COIN PURSE</span><strong>${state.coins} <small>COINS</small></strong></div>${items}<p class="preview-note">${state.status || "Choose an item to review its exact cost before purchase."}</p></div>
            <aside class="receipt-card"><p class="eyebrow">COUNTER RULE</p><h3>One ticket.<br>One charge.</h3><p>Roundabout Shot costs 3 coins. Extra Heart costs 5. You start with 4.</p><p>Unavailable stock stays disabled with the shortfall written beside it.</p><label class="field-label" for="counter-note">Editable counter note</label><input class="field" id="counter-note" maxlength="60" value="${escapeAttr(state.shopNote)}" aria-label="Editable counter note"></aside>
          </div><p class="status" role="status" aria-live="polite">${state.status || ""}</p><p class="fineprint">Purchases live in this page session only; reloading restores the fictional opening purse.</p>
        </section>
      </div>
    </section>`;
  }

  function resultScreen() {
    const objectives = [
      ["✓", "Parries landed", "4"],
      ["✓", "Health lost", "1"],
      ["—", "All objectives", "INCOMPLETE"]
    ];
    return `<section class="stage">
      ${header("STAGE RESULTS · THE LAST CURTAIN", "A clean finish", "The grade stays in view while you decide whether to add this run to the notebook.", "BOARD 07")}
      <div class="scene-grid">${poster("An original illustrated theatre still life with brass pipes, spring shoes, parasol, and stage lamps", "THE CURTAIN CALL · ORIGINAL ART STUDY", "left 55%")}
        <section class="play-panel" aria-labelledby="results-title"><div class="panel-heading"><div><p class="eyebrow">RESULT SLIP · 01:12</p><h2 id="results-title">Stage ledger</h2></div><span class="seal-star" aria-hidden="true">✦</span></div>
          <div class="stage-results"><div class="grade-panel"><div class="grade-seal" aria-label="Grade A minus">A-</div><div class="grade-details"><p class="eyebrow">FINAL GRADE</p><h2>Bravo, player.</h2><p>Time: <b>01:12</b></p><p>Parries: <b>4</b></p></div></div>
            <ul class="objective-list" aria-label="Stage objectives">${objectives.map(([mark, label, result]) => `<li><b aria-hidden="true">${mark}</b><span>${label}</span><strong>${result}</strong></li>`).join("")}</ul></div>
          <label class="field-label" for="stage-memo">Add a line to this stage’s notebook</label><input class="field" id="stage-memo" maxlength="80" value="${escapeAttr(state.memo)}" aria-label="Stage notebook note">
          <div class="actions" style="margin-top:.8rem"><button type="button" class="button button-hot" data-begin="result" ${state.resultRecorded ? "disabled" : ""}>Review stage ledger</button><a class="button button-quiet" href="#equipment-cards" style="display:grid;place-items:center;text-decoration:none">Back to loadout</a></div>
          <p class="fineprint">Recording changes only the in-memory session sample. Nothing is written to disk.</p><p class="status" role="status" aria-live="polite">${state.status || ""}</p>
        </section>
      </div>
    </section>`;
  }

  function escapeAttr(value) {
    return String(value).replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char]);
  }

  function openConfirmation(transaction) {
    dialogTitle.textContent = transaction.kind === "equipment" ? "Ticket ready for the stage?" : transaction.kind === "purchase" ? "Settle this counter ticket?" : "Write this result to the notebook?";
    dialogCopy.textContent = transaction.copy;
    confirmButton.textContent = transaction.label;
    confirmButton.setAttribute("aria-label", transaction.label);
    dialog.showModal();
    confirmButton.focus();
  }

  function closeConfirmation() {
    if (dialog.open) dialog.close();
  }

  function render() {
    document.querySelectorAll("[data-screen]").forEach((link) => {
      if (link.dataset.screen === currentScreen) link.setAttribute("aria-current", "page");
      else link.removeAttribute("aria-current");
    });
    const page = currentScreen === "equipment-cards" ? equipmentScreen() : currentScreen === "shop-counter" ? shopScreen() : resultScreen();
    host.innerHTML = page;
    const title = SCREENS.find((screen) => screen.id === currentScreen).title;
    document.title = `The Laughing Marquee — ${title}`;
    bindPageActions();
  }

  function setStatus(message) {
    state.status = message;
    const status = host.querySelector("[role=status]");
    if (status) status.textContent = message;
  }

  function bindPageActions() {
    host.querySelectorAll("[data-slot]").forEach((button) => button.addEventListener("click", () => {
      state.slot = button.dataset.slot;
      render();
      host.querySelector(`[data-slot="${state.slot}"]`)?.focus();
    }));
    host.querySelectorAll("[data-equipment]").forEach((button) => button.addEventListener("click", () => {
      const result = previewEquipment(state, state.slot, button.dataset.equipment);
      setStatus(result.ok ? `${result.item.name} selected for preview. The equipped item has not changed.` : "That equipment choice is unavailable.");
      render();
      host.querySelector(`[data-equipment="${button.dataset.equipment}"]`)?.focus();
    }));
    host.querySelectorAll("[data-revert]").forEach((button) => button.addEventListener("click", () => {
      cancelPreview(state);
      setStatus("Preview cleared. The original loadout is still equipped.");
      render();
      host.querySelector("[data-revert]")?.focus();
    }));
    host.querySelectorAll("[data-begin]").forEach((button) => button.addEventListener("click", () => {
      const transaction = beginTransaction(state, button.dataset.begin);
      if (!transaction.ok) {
        setStatus(transaction.reason === "no-equipment-change" ? "Choose a replacement before reviewing the ticket." : transaction.reason === "already-recorded" ? "This result is already recorded for the current page session." : "That action is not available.");
        return;
      }
      openConfirmation(transaction.transaction);
    }));
    host.querySelectorAll("[data-buy]").forEach((button) => button.addEventListener("click", () => {
      const item = SHOP.find((candidate) => candidate.id === button.dataset.buy);
      state.selectedShop = item.id;
      const transaction = beginTransaction(state, "purchase", { itemId: item.id });
      if (!transaction.ok) {
        setStatus(transaction.reason === "insufficient-coins" ? `Purchase paused: ${item.name} costs ${item.cost} coins, but you have ${state.coins}. No coin was spent.` : "This prop is already in the case.");
        render();
        return;
      }
      openConfirmation(transaction.transaction);
    }));
    const memo = host.querySelector("#stage-memo");
    if (memo) memo.addEventListener("input", () => { state.memo = memo.value.trim().slice(0, 80); });
    const loadoutNote = host.querySelector("#loadout-note");
    if (loadoutNote) loadoutNote.addEventListener("input", () => { state.loadoutNote = loadoutNote.value.slice(0, 60); });
    const counterNote = host.querySelector("#counter-note");
    if (counterNote) counterNote.addEventListener("input", () => { state.shopNote = counterNote.value.slice(0, 60); });
  }

  confirmButton.addEventListener("click", () => {
    const result = confirmTransaction(state);
    closeConfirmation();
    if (result.ok) setStatus(result.message);
    else setStatus("This action could not be committed again. No second change was made.");
    render();
    host.querySelector("[role=status]")?.focus({ preventScroll: true });
  });
  cancelButton.addEventListener("click", () => {
    cancelTransaction(state);
    closeConfirmation();
    setStatus("Confirmation cancelled. No coins or equipment changed.");
    render();
  });
  dialog.addEventListener("cancel", () => { cancelTransaction(state); setStatus("Confirmation cancelled. No coins or equipment changed."); });
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
