(function (root) {
  "use strict";
  const exhibits = [
    { id: "E-01", name: "Mooring Log", type: "Harbor record", source: "Pilot shed · counter 04", date: "18 / 08 / 2026 · 20:42", facts: ["The north mooring line was still secured at 20:42.", "The log does not record when the ferry left."], field: "Mooring status", value: "Secured at 20:42" },
    { id: "E-02", name: "Rain Map", type: "Route sketch", source: "Coastal survey desk", date: "18 / 08 / 2026 · 18:10", facts: ["Rain crossed the north quay after 20:30.", "The map does not record a departure time."], field: "Weather", value: "Rain after 20:30" },
    { id: "E-03", name: "Wet Station Ticket", type: "Printed ticket", source: "Found near North Quay", date: "18 / 08 / 2026 · 21:18", facts: ["Printed departure: 21:10.", "One corner is torn; the ticket does not identify who carried it."], field: "Departure", value: "21:10" }
  ];
  const statements = [
    { id: "01", text: "I closed the archive office before the rain reached the quay.", followup: "I put the key in the brass drawer. I did not see the ferry then." },
    { id: "02", text: "I heard one bell while I was crossing the covered walk.", followup: "It was the second bell, I think. I was carrying a stack of files." },
    { id: "03", text: "The ferry was already gone before 21:00.", followup: "I did not check a clock. I judged by the last light on the water." }
  ];
  const episodeRows = [
    { id: "case-01", title: "The Night Ferry", premise: "A missing ledger page and a disputed departure.", status: "open" },
    { id: "case-02", title: "A Quiet Archive", premise: "A sealed room with two copies of one key.", status: "locked" },
    { id: "case-03", title: "The Brass Index", premise: "A catalog entry that appears in two hands.", status: "locked" }
  ];
  function initialState() {
    return { route: "evidence-file", selectedExhibit: "E-03", flagged: {}, selectedStatement: "03", pressed: false, chooserOpen: false, chooserEvidence: "", presented: false, presentationResult: "", episodes: { "case-01": "open", "case-02": "locked", "case-03": "locked" }, selectedEpisode: "case-01", startedEpisode: null, notice: "All exhibits and testimony in this record are synthetic." };
  }
  function transition(state, action) {
    const next = Object.assign({}, state, { flagged: Object.assign({}, state.flagged), episodes: Object.assign({}, state.episodes) });
    const exhibit = exhibits.find(function (e) { return e.id === action.id; });
    if (action.type === "SELECT_EXHIBIT" && exhibit) {
      next.selectedExhibit = exhibit.id; next.notice = exhibit.id + " selected. Source, date, and known facts are shown on the filed sheet.";
    } else if (action.type === "FLAG_EXHIBIT" && exhibit) {
      next.flagged[exhibit.id] = !state.flagged[exhibit.id]; next.notice = exhibit.id + (next.flagged[exhibit.id] ? " flagged for testimony review." : " removed from the review flag.");
    } else if (action.type === "SELECT_STATEMENT" && statements.some(function (s) { return s.id === action.id; }) && !state.presented) {
      next.selectedStatement = action.id; next.pressed = false; next.chooserOpen = false; next.chooserEvidence = ""; next.notice = "Statement " + action.id + " selected. PRESS and PRESENT remain separate actions.";
    } else if (action.type === "PRESS" && !state.presented) {
      next.pressed = true; next.notice = "PRESS revealed a follow-up on statement " + state.selectedStatement + "; the testimony has not advanced.";
    } else if (action.type === "OPEN_CHOOSER" && !state.presented) {
      next.chooserOpen = true; next.chooserEvidence = ""; next.notice = "Evidence file opened for statement " + state.selectedStatement + ". Choose an exhibit, then submit it.";
    } else if (action.type === "CHOOSE_PRESENTATION" && state.chooserOpen && exhibit) {
      next.chooserEvidence = exhibit.id; next.notice = exhibit.id + " selected for statement " + state.selectedStatement + "; it has not been presented.";
    } else if (action.type === "CANCEL_CHOOSER") {
      next.chooserOpen = false; next.chooserEvidence = ""; next.notice = "Evidence picker closed. Statement " + state.selectedStatement + " is still selected.";
    } else if (action.type === "SUBMIT_PRESENTATION" && state.chooserOpen && state.chooserEvidence && !state.presented) {
      next.chooserOpen = false; next.presented = true;
      if (state.selectedStatement === "03" && state.chooserEvidence === "E-03") {
        next.presentationResult = "Timeline conflict: E-03 records 21:10, after the claimed departure before 21:00.";
      } else {
        next.presentationResult = "No timeline conflict is established by " + state.chooserEvidence + " for statement " + state.selectedStatement + ". The exhibit is not consumed; the statement stays selected.";
      }
      next.notice = next.presentationResult;
    } else if (action.type === "SELECT_EPISODE" && ["open", "complete"].indexOf(state.episodes[action.id]) >= 0) {
      next.selectedEpisode = action.id; next.notice = episodeName(action.id) + " selected · " + state.episodes[action.id] + ".";
    } else if (action.type === "CONTINUE_EPISODE" && ["open", "complete"].indexOf(state.episodes[state.selectedEpisode]) >= 0) {
      next.startedEpisode = state.selectedEpisode; next.notice = state.episodes[state.selectedEpisode] === "complete" ? "Reviewing completed case: " + episodeName(state.selectedEpisode) + "." : episodeName(state.selectedEpisode) + " started. You can inspect the synthetic case before marking it complete.";
    } else if (action.type === "COMPLETE_EPISODE" && state.startedEpisode === "case-01" && state.episodes["case-01"] !== "complete") {
      next.episodes["case-01"] = "complete"; next.episodes["case-02"] = "open";
      next.notice = "Case 01 complete · A Quiet Archive unlocked.";
    }
    return next;
  }
  function episodeName(id) {
    const row = episodeRows.find(function (episode) { return episode.id === id; });
    return row ? row.title : id;
  }
  const api = { initialState: initialState, transition: transition, exhibits: exhibits, statements: statements };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  if (!root || !root.document) return;

  let state = initialState();
  const app = root.document.getElementById("app");
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]; }); }
  function routeId() {
    const id = root.location.hash.replace(/^#/, "");
    return ["evidence-file", "cross-examination", "episode-selection"].indexOf(id) >= 0 ? id : "evidence-file";
  }
  function nav(id) {
    return '<nav class="route-nav" aria-label="Court record pages"><a href="#evidence-file" ' + (id === "evidence-file" ? 'aria-current="page"' : "") + '>01 · Evidence file</a><a href="#cross-examination" ' + (id === "cross-examination" ? 'aria-current="page"' : "") + '>02 · Cross-examination</a><a href="#episode-selection" ' + (id === "episode-selection" ? 'aria-current="page"' : "") + '>03 · Episode index</a></nav>';
  }
  function evidenceFile() {
    const e = exhibits.find(function (item) { return item.id === state.selectedExhibit; });
    return '<p class="label">Case 01 / evidence record</p><h2 class="screen-title">Evidence file</h2><p class="intro">Stable exhibit IDs keep each source and known fact traceable. Unknown details stay unresolved.</p><section class="court-surface file-layout"><nav class="exhibit-index" aria-label="Exhibit index">' +
      exhibits.map(function (item) { return '<button class="exhibit-tab" data-action="exhibit" data-id="' + item.id + '" aria-label="Select ' + item.id + ' ' + item.name + '" aria-pressed="' + (item.id === e.id) + '"><span class="exhibit-id">' + item.id + ' · ' + item.type + '</span><span class="exhibit-name">' + item.name + '</span></button>'; }).join("") +
      '</nav><article class="evidence-sheet"><p class="label">' + e.id + ' / ' + e.type + '</p><h3>' + e.name + '</h3><p class="evidence-copy">' + e.facts.map(esc).join("<br>") + '</p><div class="evidence-meta">SOURCE · ' + e.source + '<br>DATE · ' + e.date + '<br>KNOWN FIELD · ' + e.field + ': ' + e.value + '</div><button class="flag" data-action="flag" data-id="' + e.id + '" aria-pressed="' + !!state.flagged[e.id] + '">' + (state.flagged[e.id] ? "Flagged for testimony review" : "Flag exhibit for testimony") + '</button><p class="status" role="status" aria-live="polite">' + esc(state.notice) + '</p></article></section>';
  }
  function crossExam() {
    const statement = statements.find(function (s) { return s.id === state.selectedStatement; });
    return '<p class="label">Case 01 / witness sequence 01—03</p><h2 class="screen-title">Cross-examination</h2><p class="intro">Select a line. PRESS asks for detail; PRESENT opens a separate evidence record and requires a second submit action.</p><section class="court-surface"><div class="witness-strip"><span class="portrait" role="img" aria-label="Original fictional witness portrait"></span><span><strong class="witness-name">Mara Venn</strong><span class="witness-role">Night archivist · witness 02</span></span></div><div class="testimony-list" aria-label="Witness statements">' +
      statements.map(function (s) { return '<button class="statement" data-action="statement" data-id="' + s.id + '" aria-label="Select statement ' + s.id + '" aria-pressed="' + (s.id === state.selectedStatement) + '"><small>Statement ' + s.id + (s.id === state.selectedStatement ? " · selected" : "") + '</small><span class="statement-text">“' + s.text + '”</span></button>'; }).join("") +
      '</div>' + (state.pressed ? '<p class="statement-followup" role="status"><strong>Follow-up / statement ' + statement.id + ':</strong> “' + statement.followup + '”</p>' : "") +
      '<div class="actions"><button class="court-button" data-action="press"' + (state.presented ? " disabled" : "") + '>PRESS current statement</button><button class="court-button present" data-action="present-open"' + (state.presented ? " disabled" : "") + '>PRESENT evidence</button></div>' +
      (state.chooserOpen ? '<div class="picker" role="group" aria-label="Evidence picker"><h3>Choose an exhibit for statement ' + statement.id + '</h3>' + exhibits.map(function (e) { return '<button class="picker-option" data-action="present-choice" data-id="' + e.id + '" aria-label="Choose ' + e.id + ' · ' + e.name + '" aria-pressed="' + (state.chooserEvidence === e.id) + '">' + e.id + ' · ' + e.name + ' <small>· ' + e.field + ': ' + e.value + '</small></button>'; }).join("") +
      '<div class="actions"><button class="court-button present" data-action="present-submit"' + (!state.chooserEvidence ? " disabled" : "") + '>Submit ' + (state.chooserEvidence || "selected exhibit") + ' to statement ' + statement.id + '</button><button class="court-button secondary" data-action="present-cancel">Cancel evidence picker</button></div></div>' : "") +
      (state.presentationResult ? '<div class="result-box" role="status">' + esc(state.presentationResult) + '</div>' : "") +
      '<p class="status" role="status" aria-live="polite">' + esc(state.notice) + '</p></section>';
  }
  function episodeSelection() {
    const id = state.selectedEpisode;
    const row = episodeRows.find(function (e) { return e.id === id; });
    const status = state.episodes[id];
    return '<p class="label">Case order / first fictional trilogy index</p><h2 class="screen-title">Episode selection</h2><p class="intro">The case order, lock reason, and completed state remain visible. Opening a completed episode is a review action.</p><section class="court-surface episode-layout"><div class="case-list" aria-label="Ordered episode list">' +
      episodeRows.map(function (e, index) { const s = state.episodes[e.id]; return '<button class="case-row" data-action="episode" data-id="' + e.id + '" aria-label="Select Case ' + String(index + 1).padStart(2, "0") + ' ' + e.title + (s === "locked" ? " · Locked until Case 01 is complete" : "") + '" aria-pressed="' + (id === e.id) + '"' + (s === "locked" ? ' disabled aria-describedby="case-lock-reason"' : "") + '><span class="case-number">' + String(index + 1).padStart(2, "0") + '</span><span><span class="case-title">' + e.title + '</span><span class="case-premise">' + e.premise + '</span></span><span class="case-status">' + s + '</span></button>'; }).join("") +
      '<p id="case-lock-reason" class="case-premise">Locked cases open after the prior synthetic case is marked complete.</p></div><article class="case-detail"><p class="label">Selected / ' + status + '</p><h3>' + row.title + '</h3><p>' + row.premise + '</p><div class="case-state">Case ' + String(episodeRows.findIndex(function (e) { return e.id === id; }) + 1).padStart(2, "0") + ' · ' + status + '</div>' +
      '<div class="actions"><button class="court-button" data-action="continue" ' + (status === "locked" ? "disabled" : "") + '>' + (status === "complete" ? "Review Case " : "Continue Case ") + String(episodeRows.findIndex(function (e) { return e.id === id; }) + 1).padStart(2, "0") + '</button>' +
      (state.startedEpisode === "case-01" && state.episodes["case-01"] !== "complete" ? '<button class="court-button present" data-action="complete">Mark Case 01 demo complete</button>' : "") + '</div><p class="status" role="status" aria-live="polite">' + esc(state.notice) + '</p></article></section>';
  }
  function render() {
    const id = routeId(); state.route = id;
    const content = id === "evidence-file" ? evidenceFile() : (id === "cross-examination" ? crossExam() : episodeSelection());
    app.innerHTML = '<main class="court"><header class="mast"><h1>Night Ferry / Court Record</h1><span class="edition">Original case study · all records synthetic</span></header>' + nav(id) + content + '</main>';
  }
  app.addEventListener("click", function (event) {
    const button = event.target.closest("[data-action]");
    if (!button || button.disabled) return;
    const type = button.dataset.action;
    if (type === "exhibit") state = transition(state, { type: "SELECT_EXHIBIT", id: button.dataset.id });
    else if (type === "flag") state = transition(state, { type: "FLAG_EXHIBIT", id: button.dataset.id });
    else if (type === "statement") state = transition(state, { type: "SELECT_STATEMENT", id: button.dataset.id });
    else if (type === "press") state = transition(state, { type: "PRESS" });
    else if (type === "present-open") state = transition(state, { type: "OPEN_CHOOSER" });
    else if (type === "present-choice") state = transition(state, { type: "CHOOSE_PRESENTATION", id: button.dataset.id });
    else if (type === "present-cancel") state = transition(state, { type: "CANCEL_CHOOSER" });
    else if (type === "present-submit") state = transition(state, { type: "SUBMIT_PRESENTATION" });
    else if (type === "episode") state = transition(state, { type: "SELECT_EPISODE", id: button.dataset.id });
    else if (type === "continue") state = transition(state, { type: "CONTINUE_EPISODE" });
    else if (type === "complete") state = transition(state, { type: "COMPLETE_EPISODE" });
    render();
  });
  root.addEventListener("hashchange", render);
  render();
})(typeof window !== "undefined" ? window : null);
