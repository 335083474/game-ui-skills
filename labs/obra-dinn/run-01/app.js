(() => {
  "use strict";

  const SCREENS = [
    { id: "crew-roster", title: "Crew roster", description: "A stable crew index supports sorting by name, location, and identity confidence." },
    { id: "investigation-log", title: "Investigation log", description: "A chronological deduction record separates observed evidence from inferred fate." },
    { id: "chapter-index", title: "Chapter index", description: "A ship and deck index reveals access and completion while preserving the investigative route." }
  ];
  const INITIAL_CREW = [
    { id: "crew-07", name: "Ada Bell", identity: "suspected", lastSeen: "lower deck" },
    { id: "crew-08", name: "Niko Venn", identity: "confirmed", lastSeen: "cargo hold" }
  ];
  const INITIAL_LOG = [
    { id: "observation-01", kind: "observed", text: "Lantern found at stairwell", chapterId: "night-02", label: "Night watch · record 01" },
    { id: "deduction-02", kind: "inferred", text: "Crew member left deck before bell", chapterId: "night-02", label: "Night watch · record 02" }
  ];
  const CHAPTERS = [
    { id: "night-02", label: "Night watch", location: "lower deck", unlocked: true, complete: false, coordinate: "B / 02" },
    { id: "night-03", label: "Fog passage", location: "upper deck", unlocked: false, complete: false, coordinate: "C / 03" },
    { id: "cargo-01", label: "Cargo manifest", location: "cargo hold", unlocked: true, complete: true, coordinate: "A / 01" }
  ];

  function createInitialState() {
    return {
      crew: INITIAL_CREW.map((person) => ({ ...person })),
      crewFocus: "crew-07",
      crewSort: "name",
      crewFilter: "",
      log: INITIAL_LOG.map((entry) => ({ ...entry })),
      logFocus: "observation-01",
      note: "A shadow crossed the lower stair.",
      chapterFilter: "",
      selectedChapter: "night-02",
      reviewedChapters: [],
      pending: null,
      nextTransaction: 1,
      committed: []
    };
  }

  function selectCrew(state, crewId) {
    const person = state.crew.find((candidate) => candidate.id === crewId);
    if (!person) return { ok: false, reason: "unknown-crew-member" };
    state.crewFocus = person.id;
    return { ok: true, person };
  }

  function toggleRosterSort(state) {
    const selectedId = state.crewFocus;
    state.crewSort = state.crewSort === "name" ? "location" : "name";
    state.crew.sort((a, b) => {
      const order = state.crewSort === "name" ? a.name.localeCompare(b.name) : a.lastSeen.localeCompare(b.lastSeen);
      return order || a.id.localeCompare(b.id);
    });
    state.crewFocus = selectedId;
    return { ok: true, selectedId, sort: state.crewSort };
  }

  function selectLog(state, logId) {
    const entry = state.log.find((candidate) => candidate.id === logId);
    if (!entry) return { ok: false, reason: "unknown-log-entry" };
    state.logFocus = logId;
    return { ok: true, entry };
  }

  function selectChapter(state, chapterId) {
    const chapter = CHAPTERS.find((candidate) => candidate.id === chapterId);
    if (!chapter || !chapter.unlocked) return { ok: false, reason: "chapter-locked" };
    state.selectedChapter = chapterId;
    return { ok: true, chapter };
  }

  function beginTransaction(state, kind) {
    if (state.pending) return { ok: false, reason: "transaction-already-open" };
    let transaction;
    if (kind === "identity") {
      const person = state.crew.find((candidate) => candidate.id === state.crewFocus);
      if (!person) return { ok: false, reason: "unknown-crew-member" };
      if (person.identity !== "suspected") return { ok: false, reason: "identity-not-suspected" };
      transaction = { kind, crewId: person.id, name: person.name, label: `Confirm identity: ${person.name}`, copy: `Change the fictional record for ${person.name} from SUSPECTED to CONFIRMED? Review the evidence before writing this status.` };
    } else if (kind === "log") {
      const text = String(state.note).trim();
      if (!text) return { ok: false, reason: "empty-note" };
      if (state.log.some((entry) => entry.kind === "inferred" && entry.text.trim() === text)) return { ok: false, reason: "duplicate-deduction" };
      transaction = { kind, text, chapterId: "night-02", label: "Record inferred note for Night watch", copy: `Record this as an INFERRED deduction under Night watch? “${text}” Observed evidence remains unchanged.` };
    } else if (kind === "chapter") {
      const chapter = CHAPTERS.find((candidate) => candidate.id === state.selectedChapter);
      if (!chapter || !chapter.unlocked) return { ok: false, reason: "chapter-locked" };
      if (state.reviewedChapters.includes(chapter.id)) return { ok: false, reason: "already-reviewed" };
      transaction = { kind, chapterId: chapter.id, label: `Mark ${chapter.label} record reviewed`, copy: `Mark ${chapter.label} as reviewed for this page session? The chapter remains unlocked and incomplete.` };
    } else {
      return { ok: false, reason: "unknown-transaction" };
    }
    transaction.id = `dinn-tx-${state.nextTransaction++}`;
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
    if (transaction.kind === "identity") {
      const person = state.crew.find((candidate) => candidate.id === transaction.crewId);
      if (!person || person.identity !== "suspected") {
        state.pending = null;
        return { ok: false, reason: "identity-state-changed" };
      }
      person.identity = "confirmed";
      result = { ok: true, message: `${transaction.name} now marked CONFIRMED in this session. Identity updated once.` };
    } else if (transaction.kind === "log") {
      if (state.log.some((entry) => entry.kind === "inferred" && entry.text.trim() === transaction.text.trim())) {
        state.pending = null;
        return { ok: false, reason: "duplicate-deduction" };
      }
      const id = `deduction-${state.nextTransaction}`;
      state.log.push({ id, kind: "inferred", text: transaction.text, chapterId: transaction.chapterId, label: "Night watch · new deduction" });
      state.logFocus = id;
      result = { ok: true, message: `Inference added to Night watch: “${transaction.text}”` };
    } else {
      if (state.reviewedChapters.includes(transaction.chapterId)) {
        state.pending = null;
        return { ok: false, reason: "already-reviewed" };
      }
      state.reviewedChapters.push(transaction.chapterId);
      result = { ok: true, message: `Night watch record reviewed for this session. Chapter access is still unlocked.` };
    }
    state.committed.push(transaction.id);
    state.pending = null;
    return result;
  }

  const model = { createInitialState, selectCrew, toggleRosterSort, selectLog, selectChapter, beginTransaction, cancelTransaction, confirmTransaction, screens: SCREENS };
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

  function header(label, title, intro) {
    return `<header class="record-heading"><div><p class="eyebrow">${label}</p><h1>${title}</h1><p class="record-intro">${intro}</p></div><figure class="case-plate"><img src="art.png" alt="Original one-bit dithered ship interior with anonymous sailors, a chart, and lantern light"><figcaption>ORIGINAL GENERATED DITHER STUDY · FICTIONAL CREW</figcaption></figure></header>`;
  }

  function crewScreen() {
    const active = state.crew.find((person) => person.id === state.crewFocus) || state.crew[0];
    const visibleCrew = state.crew.filter((person) => `${person.name} ${person.lastSeen} ${person.identity}`.toLowerCase().includes(state.crewFilter.toLowerCase()));
    const rows = visibleCrew.map((person) => `<tr><td colspan="4"><button type="button" class="crew-row" data-crew="${person.id}" aria-label="Select ${person.name}, ${person.identity}, ${person.lastSeen}" aria-pressed="${person.id === state.crewFocus}"><span class="crew-glyph" aria-hidden="true">${person.identity === "confirmed" ? "■" : "□"}</span><span><strong>${escapeHtml(person.name)}</strong><small>${person.lastSeen.toUpperCase()}</small></span><span class="crew-status">${person.identity.toUpperCase()}</span><span class="crew-id">${person.id.toUpperCase()}</span></button></td></tr>`).join("");
    const identityButton = active.identity === "suspected" ? `<button type="button" class="ledger-button inverted" data-begin="identity">Review identity for ${active.name}</button>` : `<button type="button" class="ledger-button" disabled aria-label="${active.name} already confirmed">Identity confirmed</button>`;
    return `<section class="record-page">${header("ROSTER INDEX · SORT PRESERVES SELECTED ID", "Crew roster", "Stable names and locations stay aligned with written confidence labels. SUSPECTED and CONFIRMED are separate records, not color states.")}
      <div class="ledger-grid"><section class="record-block" aria-labelledby="roster-title"><div class="block-head"><h2 id="roster-title">Persons on file</h2><span class="folio">${visibleCrew.length} / ${state.crew.length} SHOWN</span></div><div class="tools-row"><label for="crew-search">SEARCH THE ROSTER</label><input id="crew-search" type="search" value="${escapeHtml(state.crewFilter)}" placeholder="Name, deck, status" aria-label="Filter crew by name, location, or confidence"><button type="button" data-sort aria-label="Sort crew by ${state.crewSort === "name" ? "last seen location" : "name"}">SORT: ${state.crewSort.toUpperCase()}</button></div>
        <table class="crew-table"><thead><tr><th scope="col">MARK / NAME</th><th scope="col">LAST SEEN</th><th scope="col">IDENTITY</th><th scope="col">STABLE ID</th></tr></thead><tbody>${rows || `<tr><td colspan="4">No crew match this filter.</td></tr>`}</tbody></table><p class="identity-note">■ CONFIRMED · □ SUSPECTED · Labels always remain in the row.</p></section>
        <section class="record-block" aria-labelledby="dossier-title"><div class="block-head"><h2 id="dossier-title">Selected record</h2><span class="folio">${active.id.toUpperCase()}</span></div><div class="selected-dossier"><p class="eyebrow">${active.identity.toUpperCase()} · IDENTITY CONFIDENCE</p><h3>${escapeHtml(active.name)}</h3><p>Last seen at <b>${active.lastSeen}</b>.</p><div class="tag-line"><span>${active.identity === "confirmed" ? "CONFIRMED IDENTITY" : "IDENTITY SUSPECTED"}</span><span>FOCUS ONLY</span></div></div><div class="button-row">${identityButton}<button type="button" class="ledger-button" data-cancel-preview>Clear focus</button></div><p class="fineprint">Changing confidence requires a review and a second explicit confirmation. The fictional roster is not written to disk.</p><p class="status" role="status" aria-live="polite">${escapeHtml(state.status || "Select a row to inspect the stable record ID.")}</p></section></div>
    </section>`;
  }

  function logScreen() {
    const ordered = [...state.log].sort((a, b) => a.id.localeCompare(b.id));
    const rows = ordered.map((entry) => `<article class="log-entry" data-kind="${entry.kind}" aria-current="${entry.id === state.logFocus}"><span class="kind-mark" aria-label="${entry.kind}">${entry.kind === "observed" ? "[O]" : "[?]"}</span><div><strong>${entry.kind.toUpperCase()} · ${entry.label.toUpperCase()}</strong><p>${escapeHtml(entry.text)}</p><small>CHAPTER ${entry.chapterId.toUpperCase()}</small></div><button type="button" class="log-select" data-log="${entry.id}" aria-label="Focus ${entry.kind} entry: ${escapeHtml(entry.text)}">FOCUS</button></article>`).join("");
    const active = state.log.find((entry) => entry.id === state.logFocus) || ordered[0];
    return `<section class="record-page">${header("EVIDENCE DESK · CHRONOLOGY KEPT INTACT", "Investigation log", "Observed evidence and inferred explanations use different labels and marks. A new deduction is written only into the inference column after confirmation.")}
      <div class="ledger-grid"><section class="record-block" aria-labelledby="log-title"><div class="block-head"><h2 id="log-title">Night watch · chronological fragments</h2><span class="folio">CHAPTER 02</span></div><div class="evidence-key"><span><b>[O]</b> OBSERVED · recorded fact</span><span><b>[?]</b> INFERRED · explanation</span></div><div class="log-list">${rows}</div></section>
        <section class="record-block" aria-labelledby="note-title"><div class="block-head"><h2 id="note-title">Write a deduction</h2><span class="folio">INFERENCE ONLY</span></div><div class="selected-dossier"><p class="eyebrow">FOCUSED ENTRY · ${active.kind.toUpperCase()}</p><h3>${active.kind === "observed" ? "Observed evidence remains fixed" : "Inference may be reviewed"}</h3><p>${escapeHtml(active.text)}</p><div class="tag-line"><span>CHAPTER: NIGHT WATCH</span><span>NO FATE ASSIGNED</span></div></div><div class="composer"><label for="new-deduction">Editable inferred note</label><textarea id="new-deduction" class="ledger-input" maxlength="140" aria-label="Editable inferred note">${escapeHtml(state.note)}</textarea><div class="button-row"><button type="button" class="ledger-button inverted" data-begin="log">Review inference entry</button><button type="button" class="ledger-button" data-clear-note>Clear draft</button></div></div><p class="fineprint">This creates a new INFERRED line. Existing OBSERVED fragments remain unchanged.</p><p class="status" role="status" aria-live="polite">${escapeHtml(state.status || "No new deduction has been recorded.")}</p></section></div>
    </section>`;
  }

  function chapterScreen() {
    const selected = CHAPTERS.find((chapter) => chapter.id === state.selectedChapter) || CHAPTERS[0];
    const markers = CHAPTERS.map((chapter) => {
      const reviewed = state.reviewedChapters.includes(chapter.id);
      const label = `${chapter.label}, ${chapter.location}, ${chapter.unlocked ? "unlocked" : "locked"}, ${chapter.complete ? "complete" : "incomplete"}`;
      return `<button type="button" class="chapter-marker" data-chapter="${chapter.id}" aria-label="Select ${label}" aria-pressed="${chapter.id === selected.id}" ${chapter.unlocked ? "" : "disabled"}><span class="coordinate">${chapter.coordinate}</span><strong>${escapeHtml(chapter.label)}</strong><small>${escapeHtml(chapter.location.toUpperCase())}<br>${chapter.unlocked ? "UNLOCKED" : "LOCKED"} · ${chapter.complete ? "COMPLETE" : reviewed ? "REVIEWED THIS SESSION" : "INCOMPLETE"}</small></button>`;
    }).join("");
    const alreadyReviewed = state.reviewedChapters.includes(selected.id);
    return `<section class="record-page">${header("SHIP INDEX · ACCESS WRITTEN IN WORDS", "Chapter index", "Route markers identify location, access, and completion with text. Locked records explain their state and cannot be opened by selection.")}
      <div class="ledger-grid"><section class="record-block" aria-labelledby="map-title"><div class="block-head"><h2 id="map-title">Deck and chapter markers</h2><span class="folio">ROUTE GRID · NOT TO SCALE</span></div><div class="location-band"><strong>CURRENT LOCATION:</strong> Night watch / lower deck</div><div class="tools-row"><label for="chapter-search">FIND A CHAPTER</label><input id="chapter-search" type="search" value="${escapeHtml(state.chapterFilter)}" placeholder="Title or deck" aria-label="Filter chapters by title or deck"></div><div class="chapter-map">${markers}</div><p class="fineprint">The route diagram is a fictional index. Selecting a marker changes focus only.</p></section>
        <section class="record-block" aria-labelledby="chapter-title"><div class="block-head"><h2 id="chapter-title">Focused chapter</h2><span class="folio">${selected.coordinate}</span></div><div class="chapter-detail"><p class="eyebrow">${selected.unlocked ? "ACCESS: UNLOCKED" : "ACCESS: LOCKED"} · ${selected.complete ? "COMPLETE" : "INCOMPLETE"}</p><h3>${escapeHtml(selected.label)} / ${escapeHtml(selected.location)}</h3><p>${selected.unlocked ? "Record can be reviewed. Access state is unchanged." : "This chapter is locked. The route must be unlocked before review."}</p><p>${alreadyReviewed ? "Record review is complete for this page session." : "Opening details will not alter evidence or identity."}</p></div><div class="button-row"><button type="button" class="ledger-button inverted" data-begin="chapter" ${!selected.unlocked || alreadyReviewed ? "disabled" : ""}>Review chapter opening</button><button type="button" class="ledger-button" data-reset-review ${!alreadyReviewed ? "disabled" : ""}>Undo review marker</button></div><p class="status" role="status" aria-live="polite">${escapeHtml(state.status || "Focus is on Night watch / lower deck.")}</p><p class="fineprint">Review marker is a temporary page-session note. It does not unlock or complete a chapter.</p></section></div>
    </section>`;
  }

  function openConfirmation(transaction) {
    dialogTitle.textContent = transaction.kind === "identity" ? "Write this identity status?" : transaction.kind === "log" ? "Record this as an inference?" : "Mark this chapter reviewed?";
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
    host.innerHTML = currentScreen === "crew-roster" ? crewScreen() : currentScreen === "investigation-log" ? logScreen() : chapterScreen();
    document.title = `The Lantern Ledger — ${SCREENS.find((screen) => screen.id === currentScreen).title}`;
    bindActions();
  }

  function status(message) {
    state.status = message;
    const node = host.querySelector("[role=status]");
    if (node) node.textContent = message;
  }

  function bindActions() {
    host.querySelectorAll("[data-crew]").forEach((button) => button.addEventListener("click", () => {
      const result = selectCrew(state, button.dataset.crew);
      status(result.ok ? `${result.person.name} focused. Stable record ${result.person.id} remains selected.` : "Crew member not found.");
      render();
      host.querySelector(`[data-crew="${button.dataset.crew}"]`)?.focus();
    }));
    host.querySelector("[data-sort]")?.addEventListener("click", () => {
      const result = toggleRosterSort(state);
      status(`Roster sorted by ${result.sort === "name" ? "name" : "last seen location"}. Selected ID ${result.selectedId} preserved.`);
      render();
      host.querySelector("[data-sort]")?.focus();
    });
    const filter = host.querySelector("#crew-search");
    if (filter) filter.addEventListener("input", () => { state.crewFilter = filter.value; render(); const next = host.querySelector("#crew-search"); next.focus(); next.setSelectionRange(next.value.length, next.value.length); });
    host.querySelector("[data-cancel-preview]")?.addEventListener("click", () => { state.status = "Focus cleared. No identity status changed."; render(); host.querySelector("[data-cancel-preview]")?.focus(); });
    host.querySelectorAll("[data-log]").forEach((button) => button.addEventListener("click", () => {
      const result = selectLog(state, button.dataset.log);
      status(result.ok ? `${result.entry.kind.toUpperCase()} entry focused. Record text is unchanged.` : "Log entry not found.");
      render();
      host.querySelector(`[data-log="${button.dataset.log}"]`)?.focus();
    }));
    host.querySelectorAll("[data-chapter]").forEach((button) => button.addEventListener("click", () => {
      const result = selectChapter(state, button.dataset.chapter);
      status(result.ok ? `${result.chapter.label} focused. ${result.chapter.unlocked ? "UNLOCKED" : "LOCKED"} · ${result.chapter.complete ? "COMPLETE" : "INCOMPLETE"}.` : "This route is LOCKED. No chapter was opened.");
      render();
      host.querySelector(`[data-chapter="${button.dataset.chapter}"]`)?.focus();
    }));
    host.querySelectorAll("[data-begin]").forEach((button) => button.addEventListener("click", () => {
      const result = beginTransaction(state, button.dataset.begin);
      if (!result.ok) {
        const messages = { "identity-not-suspected": "This identity is already confirmed.", "empty-note": "Write a note before reviewing the inference.", "chapter-locked": "This chapter is locked. No record was changed.", "already-reviewed": "The chapter record is already reviewed for this session." };
        status(messages[result.reason] || "That record cannot be reviewed.");
        return;
      }
      openConfirmation(result.transaction);
    }));
    const draft = host.querySelector("#new-deduction");
    if (draft) draft.addEventListener("input", () => { state.note = draft.value.slice(0, 140); });
    const chapterSearch = host.querySelector("#chapter-search");
    if (chapterSearch) chapterSearch.addEventListener("input", () => {
      state.chapterFilter = chapterSearch.value;
      const query = state.chapterFilter.toLowerCase();
      host.querySelectorAll("[data-chapter]").forEach((button) => { button.hidden = !button.textContent.toLowerCase().includes(query); });
    });
    host.querySelector("[data-clear-note]")?.addEventListener("click", () => { state.note = ""; render(); host.querySelector("#new-deduction")?.focus(); status("Draft cleared. No evidence or inference was recorded."); });
    host.querySelector("[data-reset-review]")?.addEventListener("click", () => {
      state.reviewedChapters = state.reviewedChapters.filter((id) => id !== state.selectedChapter);
      status("Temporary review marker removed. Chapter access and completion are unchanged.");
      render();
      host.querySelector("[data-reset-review]")?.focus();
    });
  }

  confirmButton.addEventListener("click", () => {
    const result = confirmTransaction(state);
    dialog.close();
    status(result.ok ? result.message : "This record could not be changed again. No second entry was made.");
    render();
    host.querySelector("[role=status]")?.focus({ preventScroll: true });
  });
  cancelButton.addEventListener("click", () => {
    cancelTransaction(state);
    dialog.close();
    status("Entry cancelled. No identity, evidence, or chapter state changed.");
    render();
  });
  dialog.addEventListener("cancel", () => { cancelTransaction(state); status("Entry cancelled. No identity, evidence, or chapter state changed."); });
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
