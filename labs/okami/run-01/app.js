(() => {
  "use strict";

  const SCREENS = [
    { id: "item-scroll", title: "Item scroll", description: "A scroll catalog groups collected objects by use and story role while keeping the field scene visible." },
    { id: "technique-selection", title: "Technique selection", description: "A small technique set shows input gesture, cost, and equipped state with an accessible text alternative." },
    { id: "field-journal", title: "Field journal", description: "A calm record ties discovered places and completed favors to dates and readable progress." }
  ];
  const ITEMS = [
    { id: "bark-ward", name: "Bark Ward", role: "Keepsake · active pouch", glyph: "✧", detail: "A woven bark charm for the road ahead." },
    { id: "lotus-charm", name: "Lotus Charm", role: "Keepsake · unplaced", glyph: "◇", detail: "A pale lotus charm, kept for quiet crossings." },
    { id: "spring-seed", name: "Spring Seed", role: "Field tool · 2 carried", glyph: "❋", detail: "A seed packet collected beside the reed bank." }
  ];
  const TECHNIQUES = [
    { id: "still-reed", name: "Still Reed", key: "●  ○", cost: 0, detail: "Hold a steady line · no ink cost", gesture: "A quiet line for a narrow crossing." },
    { id: "reed-arc", name: "Reed Arc", key: "⌒  •", cost: 2, detail: "2 ink · sweep across a marked gap", gesture: "A lifting curve that opens a safe passage." },
    { id: "rain-mark", name: "Rain Mark", key: "╱  ╲", cost: 3, detail: "3 ink · reveal a rain-worn path", gesture: "A crossing stroke for a hidden trail." }
  ];
  const JOURNAL = [
    { id: "crane-marsh", date: "DAY 12 · FIRST LIGHT", title: "Crane Marsh", detail: "A heron lifted from the pale reeds; fresh tracks turn toward the old bridge." },
    { id: "cedar-step", date: "DAY 11 · LATE AFTERNOON", title: "Cedar Steps", detail: "The cedar path is open again. A small favor was finished before dusk." },
    { id: "quiet-ford", date: "DAY 09 · MIST", title: "Quiet Ford", detail: "Water has receded from the stepping stones. The north bank remains unmarked." }
  ];

  function createInitialState() {
    return {
      itemSelection: "bark-ward",
      equippedItem: "bark-ward",
      techniqueSelection: "still-reed",
      equippedTechnique: "still-reed",
      ink: 4,
      techniqueNote: "Trace the curve at first light.",
      journalSelection: "crane-marsh",
      note: "Reed beds are opening after rain.",
      stamped: [],
      pending: null,
      nextTransaction: 1,
      committed: []
    };
  }

  function selectItem(state, itemId) {
    const item = ITEMS.find((entry) => entry.id === itemId);
    if (!item) return { ok: false, reason: "unknown-item" };
    state.itemSelection = itemId;
    return { ok: true, item };
  }

  function selectTechnique(state, techniqueId) {
    const technique = TECHNIQUES.find((entry) => entry.id === techniqueId);
    if (!technique) return { ok: false, reason: "unknown-technique" };
    state.techniqueSelection = techniqueId;
    return { ok: true, technique };
  }

  function selectJournal(state, entryId) {
    const entry = JOURNAL.find((candidate) => candidate.id === entryId);
    if (!entry) return { ok: false, reason: "unknown-entry" };
    state.journalSelection = entryId;
    return { ok: true, entry };
  }

  function beginTransaction(state, kind) {
    if (state.pending) return { ok: false, reason: "transaction-already-open" };
    let transaction;
    if (kind === "item") {
      const item = ITEMS.find((candidate) => candidate.id === state.itemSelection);
      if (!item || item.id === state.equippedItem) return { ok: false, reason: "no-item-change" };
      transaction = { kind, itemId: item.id, itemName: item.name, label: `Place ${item.name} in pouch A`, copy: `Place ${item.name} in active pouch A? ${ITEMS.find((candidate) => candidate.id === state.equippedItem).name} remains there until confirmation.` };
    } else if (kind === "technique") {
      const technique = TECHNIQUES.find((candidate) => candidate.id === state.techniqueSelection);
      if (!technique || technique.id === state.equippedTechnique) return { ok: false, reason: "technique-already-equipped" };
      if (state.ink < technique.cost) return { ok: false, reason: "insufficient-ink" };
      transaction = { kind, techniqueId: technique.id, techniqueName: technique.name, cost: technique.cost, label: `Confirm technique: ${technique.name} for ${technique.cost} ink`, copy: `Equip ${technique.name} for ${technique.cost} ink? You have ${state.ink} ink. The cost is taken once, only after confirmation.` };
    } else if (kind === "journal") {
      const entry = JOURNAL.find((candidate) => candidate.id === state.journalSelection);
      if (!entry) return { ok: false, reason: "unknown-entry" };
      if (state.stamped.includes(entry.id)) return { ok: false, reason: "already-stamped" };
      transaction = { kind, entryId: entry.id, entryTitle: entry.title, note: String(state.note), label: `Seal field note for ${entry.title}`, copy: `Add this note to the ${entry.title} page: “${String(state.note)}”` };
    } else {
      return { ok: false, reason: "unknown-transaction" };
    }
    transaction.id = `okami-tx-${state.nextTransaction++}`;
    state.pending = transaction;
    return { ok: true, transaction };
  }

  function cancelTransaction(state) {
    if (!state.pending) return { ok: false, reason: "no-open-transaction" };
    state.pending = null;
    return { ok: true };
  }

  function cancelPreview(state, kind) {
    state.pending = null;
    if (kind === "item") state.itemSelection = state.equippedItem;
    if (kind === "technique") state.techniqueSelection = state.equippedTechnique;
    return { ok: true };
  }

  function confirmTransaction(state) {
    const transaction = state.pending;
    if (!transaction) return { ok: false, reason: "no-open-transaction" };
    let result;
    if (transaction.kind === "item") {
      if (state.equippedItem === transaction.itemId) {
        state.pending = null;
        return { ok: false, reason: "already-equipped" };
      }
      state.equippedItem = transaction.itemId;
      result = { ok: true, message: `${transaction.itemName} placed in active pouch A. Change confirmed once.` };
    } else if (transaction.kind === "technique") {
      const technique = TECHNIQUES.find((candidate) => candidate.id === transaction.techniqueId);
      if (!technique || state.equippedTechnique === transaction.techniqueId || state.ink < transaction.cost) {
        state.pending = null;
        return { ok: false, reason: "technique-state-changed" };
      }
      state.ink -= transaction.cost;
      state.equippedTechnique = transaction.techniqueId;
      result = { ok: true, message: `Technique equipped: ${transaction.techniqueName}. ${state.ink} ink remains; change recorded once.` };
    } else {
      if (state.stamped.includes(transaction.entryId)) {
        state.pending = null;
        return { ok: false, reason: "already-stamped" };
      }
      state.stamped.push(transaction.entryId);
      result = { ok: true, message: `Field note sealed for ${transaction.entryTitle}: “${transaction.note}”` };
    }
    state.committed.push(transaction.id);
    state.pending = null;
    return result;
  }

  const model = { createInitialState, selectItem, selectTechnique, selectJournal, beginTransaction, cancelTransaction, cancelPreview, confirmTransaction, screens: SCREENS };
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

  function escapeAttr(value) {
    return String(value).replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char]);
  }

  function header(label, title, intro, artAlt, artPosition) {
    return `<div class="page-heading"><div><p class="eyebrow">${label}</p><h1>${title}</h1><p class="page-intro">${intro}</p></div><figure class="art-panel"><img src="art.png" alt="${artAlt}" style="object-position:${artPosition}"><figcaption>ORIGINAL GENERATED FIELD PLATE · NOT SOURCE-GAME ART</figcaption></figure></div>`;
  }

  function listItems() {
    return ITEMS.map((item) => `<button type="button" class="scroll-row ${state.itemSelection === item.id ? "selected-row" : ""}" data-item="${item.id}" aria-label="Select ${item.name} — ${item.role.toLowerCase()}" aria-pressed="${state.itemSelection === item.id}"><span class="scroll-symbol" aria-hidden="true">${item.glyph}</span><span><strong>${item.name}</strong><small>${item.role}</small></span><span class="row-state">${state.equippedItem === item.id ? "IN POUCH A" : state.itemSelection === item.id ? "PREVIEW" : "CARRIED"}</span></button>`).join("");
  }

  function itemScreen() {
    const chosen = ITEMS.find((item) => item.id === state.itemSelection);
    return `<section class="page">
      ${header("SCROLL 01 · WHAT TRAVELS WITH YOU", "Things carried", "A narrow field scroll keeps the landscape in view. Choose an item to preview its pouch position; the old charm stays put until you confirm.", "Original ink-wash scene of a heron in a reed marsh under a pine branch and a pale vermilion sun", "16% 55%")}
      <div class="content-scroll"><section class="scroll-sheet" aria-labelledby="item-list-title"><div class="sheet-heading"><h2 id="item-list-title">Field satchel</h2><span class="sheet-index">03 OBJECTS</span></div>
        <figure class="item-art"><img src="art.png" alt="Original field scene showing a heron standing among reeds" style="object-position:16% 56%"><figcaption>CRANE MARSH · NORTH SHORE</figcaption></figure>
        <div class="scroll-tools"><label for="scroll-index">FIND A THING</label><input id="scroll-index" type="search" placeholder="Type an item name" aria-label="Search the item scroll"></div>
        <div class="item-list">${listItems()}</div>
      </section><section class="detail-leaf" aria-labelledby="item-title"><p class="eyebrow">ACTIVE POUCH · SLOT A</p><h2 id="item-title">${chosen.name}</h2><p>${chosen.detail}</p><div class="meta-line"><span>Role: ${chosen.role.split(" · ")[0]}</span><span>${state.equippedItem === chosen.id ? "Equipped" : "Preview only"}</span></div><div class="brush-mark" aria-hidden="true"><span></span><span></span><span></span></div>
        <p id="pouch-state">Pouch A currently holds <b>${ITEMS.find((item) => item.id === state.equippedItem).name}</b>.</p><p class="preview-note">${state.itemSelection === state.equippedItem ? "This is the current pouch arrangement." : "Preview: the pouch will change only after you review and confirm."}</p>
        <div class="action-row"><button type="button" class="ink-action" data-begin="item" ${state.itemSelection === state.equippedItem ? "disabled" : ""}>Review pouch change</button><button type="button" class="quiet-action" data-revert="item">Restore pouch preview</button></div><p class="fineprint">Selecting an item costs nothing. The replacement is reversible until you confirm.</p><p class="status" role="status" aria-live="polite">${state.status || ""}</p>
      </section></div>
    </section>`;
  }

  function techniqueScreen() {
    const selected = TECHNIQUES.find((technique) => technique.id === state.techniqueSelection);
    const rows = TECHNIQUES.map((technique) => `<div class="gesture" aria-pressed="${state.techniqueSelection === technique.id}"><button type="button" class="gesture-key" data-technique="${technique.id}" aria-label="Select ${technique.name}, ${technique.cost} ink">${technique.key}</button><div><h3>${technique.name}</h3><p>${technique.gesture}</p></div><span class="cost">${technique.cost ? `${technique.cost} INK` : "NO COST"}<br>${state.equippedTechnique === technique.id ? "EQUIPPED" : state.techniqueSelection === technique.id ? "PREVIEW" : "READY"}</span></div>`).join("");
    return `<section class="page">
      ${header("BRUSH PRACTICE · GESTURE AND COST", "Ink gestures", "A spare technique scroll pairs each gesture with its written name and ink cost. Equip one only after you inspect the cost.", "Ink-wash field scene with a white heron, pine bough, distant reeds, and vermilion sun", "48% 52%")}
      <div class="content-scroll"><section class="scroll-sheet" aria-labelledby="gesture-title"><div class="sheet-heading"><h2 id="gesture-title">Available marks</h2><span class="sheet-index">4 / 5 INK</span></div><div class="gesture-list">${rows}</div><p class="fineprint">Gesture marks are original study symbols. Text labels carry the command meaning.</p></section>
        <section class="detail-leaf" aria-labelledby="technique-name"><p class="eyebrow">CURRENT INK · ${state.ink} AVAILABLE</p><h2 id="technique-name">${selected.name}</h2><p>${selected.gesture}</p><div class="brush-mark" aria-hidden="true"><span style="width:70%;height:6px"></span><span style="width:16%"></span><span style="width:9%"></span></div><div class="meta-line"><span>Gesture ${selected.key}</span><span>Cost ${selected.cost} ink</span><span>${state.equippedTechnique === selected.id ? "Equipped" : "Preview"}</span></div>
          <p>${state.equippedTechnique === selected.id ? `${selected.name} is currently equipped.` : `After confirmation, ${selected.cost} ink will remain from your ${state.ink} available.`}</p><label class="field-label" for="technique-note">Editable brush note</label><input class="field" id="technique-note" maxlength="70" value="${escapeAttr(state.techniqueNote)}" aria-label="Editable brush note">
          <div class="action-row"><button type="button" class="ink-action" data-begin="technique" ${state.techniqueSelection === state.equippedTechnique || state.ink < selected.cost ? "disabled" : ""}>Review technique: ${selected.name}, ${selected.cost} ink</button><button type="button" class="quiet-action" data-revert="technique">Keep current gesture</button></div><p class="status" role="status" aria-live="polite">${state.status || "Choose a mark to see its input gesture and cost."}</p>
        </section></div>
    </section>`;
  }

  function journalScreen() {
    const selected = JOURNAL.find((entry) => entry.id === state.journalSelection);
    const entries = JOURNAL.map((entry) => `<li class="journal-entry" aria-current="${entry.id === state.journalSelection}"><button type="button" class="entry-select" data-journal="${entry.id}" aria-label="Read journal entry ${entry.title}, ${entry.date.toLowerCase()}"><span class="entry-date">${entry.date}</span><strong>${entry.title}</strong><small>${entry.detail}</small></button></li>`).join("");
    const already = state.stamped.includes(selected.id);
    return `<section class="page">
      ${header("FIELD JOURNAL · SIGNS AND SMALL FAVORS", "After the rain", "A quiet dated record gathers places and finished favors. Select an entry to read it; a new note is sealed only after confirmation.", "Original ink-wash heron in a broad reed marsh beneath a pine branch and red sun", "25% 48%")}
      <div class="content-scroll"><section class="scroll-sheet" aria-labelledby="journal-title"><div class="sheet-heading"><h2 id="journal-title">Places remembered</h2><span class="sheet-index">3 OF 8 MARKED</span></div><ol class="journal-list">${entries}</ol></section>
        <section class="detail-leaf" aria-labelledby="journal-entry-title"><p class="eyebrow">${selected.date} · DISCOVERED</p><h2 id="journal-entry-title">${selected.title}</h2><p>${selected.detail}</p><div class="meta-line"><span>Province: Pine &amp; Reed</span><span>Favor: ${selected.id === "cedar-step" ? "Finished" : "Open"}</span></div><label class="field-label" for="field-note">Write a field note</label><textarea class="field" id="field-note" rows="3" maxlength="120" aria-label="Editable field journal note">${escapeAttr(state.note)}</textarea><div class="action-row"><button type="button" class="ink-action" data-begin="journal" ${already ? "disabled" : ""}>Review journal annotation</button><button type="button" class="quiet-action" data-clear-note>Clear annotation</button></div><p class="fineprint">${already ? "This entry is sealed for this page session." : "The note remains editable until you seal it. It will be held in memory only."}</p><p class="status" role="status" aria-live="polite">${state.status || ""}</p>
        </section></div>
    </section>`;
  }

  function openConfirmation(transaction) {
    dialogTitle.textContent = transaction.kind === "item" ? "Change the active pouch?" : transaction.kind === "technique" ? "Spend ink on this technique?" : "Seal this journal note?";
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
    const page = currentScreen === "item-scroll" ? itemScreen() : currentScreen === "technique-selection" ? techniqueScreen() : journalScreen();
    host.innerHTML = page;
    document.title = `Pine-and-Reed Province — ${SCREENS.find((screen) => screen.id === currentScreen).title}`;
    bindActions();
  }

  function status(message) {
    state.status = message;
    const element = host.querySelector("[role=status]");
    if (element) element.textContent = message;
  }

  function bindActions() {
    host.querySelectorAll("[data-item]").forEach((button) => button.addEventListener("click", () => {
      const result = selectItem(state, button.dataset.item);
      status(result.ok ? `${result.item.name} selected for pouch preview. No item changed yet.` : "That item is not in the satchel.");
      render();
      host.querySelector(`[data-item="${button.dataset.item}"]`)?.focus();
    }));
    host.querySelectorAll("[data-technique]").forEach((button) => button.addEventListener("click", () => {
      const result = selectTechnique(state, button.dataset.technique);
      status(result.ok ? `${result.technique.name} preview shown. Ink cost is ${result.technique.cost}; no ink was spent.` : "That gesture is unavailable.");
      render();
      host.querySelector(`[data-technique="${button.dataset.technique}"]`)?.focus();
    }));
    host.querySelectorAll("[data-journal]").forEach((button) => button.addEventListener("click", () => {
      const result = selectJournal(state, button.dataset.journal);
      status(result.ok ? `${result.entry.title} opened. No entry was changed.` : "That journal entry is unavailable.");
      render();
      host.querySelector(`[data-journal="${button.dataset.journal}"]`)?.focus();
    }));
    host.querySelectorAll("[data-begin]").forEach((button) => button.addEventListener("click", () => {
      const result = beginTransaction(state, button.dataset.begin);
      if (!result.ok) {
        const messages = { "no-item-change": "Choose a different item before reviewing the pouch.", "technique-already-equipped": "That technique is already equipped; no ink was spent.", "insufficient-ink": "Not enough ink for this gesture. No ink was spent.", "already-stamped": "This entry already has a field note for this page session." };
        status(messages[result.reason] || "That change cannot be reviewed.");
        return;
      }
      openConfirmation(result.transaction);
    }));
    host.querySelectorAll("[data-revert]").forEach((button) => button.addEventListener("click", () => {
      cancelPreview(state, button.dataset.revert);
      status(button.dataset.revert === "item" ? "Pouch restored. The previous charm is still equipped." : "Gesture restored. The previous technique remains equipped.");
      render();
      host.querySelector(`[data-revert="${button.dataset.revert}"]`)?.focus();
    }));
    const search = host.querySelector("#scroll-index");
    if (search) search.addEventListener("input", () => {
      const value = search.value.toLowerCase();
      host.querySelectorAll("[data-item]").forEach((button) => { button.hidden = !button.textContent.toLowerCase().includes(value); });
    });
    const fieldNote = host.querySelector("#field-note");
    if (fieldNote) fieldNote.addEventListener("input", () => { state.note = fieldNote.value.slice(0, 120); });
    const techniqueNote = host.querySelector("#technique-note");
    if (techniqueNote) techniqueNote.addEventListener("input", () => { state.techniqueNote = techniqueNote.value.slice(0, 70); });
    const clear = host.querySelector("[data-clear-note]");
    if (clear) clear.addEventListener("click", () => {
      state.note = "";
      render();
      host.querySelector("#field-note")?.focus();
      status("Annotation cleared. No journal entry changed.");
    });
  }

  confirmButton.addEventListener("click", () => {
    const result = confirmTransaction(state);
    dialog.close();
    status(result.ok ? result.message : "This action could not be committed again. No second change was made.");
    render();
    host.querySelector("[role=status]")?.focus({ preventScroll: true });
  });
  cancelButton.addEventListener("click", () => {
    cancelTransaction(state);
    dialog.close();
    status("Confirmation cancelled. Ink, items, and journal state are unchanged.");
    render();
  });
  dialog.addEventListener("cancel", () => { cancelTransaction(state); status("Confirmation cancelled. Ink, items, and journal state are unchanged."); });
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
