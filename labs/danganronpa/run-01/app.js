(function (root) {
  "use strict";
  const exhibits = [
    { id: "EP-01", name: "Wet Sleeve Fiber", source: "West stair rail · sample tray", date: "17:52 · east hall", facts: ["A pale thread was caught on the rail.", "The fiber's owner is not identified."], limited: "It cannot place a person at the clock." },
    { id: "EP-03", name: "Hall Clock Photo", source: "Nari Vale · archive assistant", date: "22:14 · east corridor", facts: ["The clock hands appear stopped at 22:14.", "The image does not show when the mechanism stopped."], limited: "The photo is a possible contradiction, not proof of a person's timing." },
    { id: "EP-04", name: "Torn Schedule", source: "Notice board · lower corner", date: "Collected 22:31 · main hall", facts: ["The final inspection line is missing.", "No name appears on the torn edge."], limited: "The missing line does not identify who removed it." }
  ];
  const claims = [
    { id: "claim-02", label: "Claim 02", text: "The clock read 22:00 after the hall lights failed." },
    { id: "claim-03", label: "Claim 03", text: "Nari watched the clock stop at exactly 22:14." }
  ];
  function initialState() {
    return { route: "student-handbook", handbookPage: "student", reviewed: { student: false, map: false, notes: false }, selectedEvidence: "EP-03", linkedEvidence: "", selectedClaim: "", debateStep: 0, trialResult: "", notice: "One fictional class investigation. Names, records, and claims are invented." };
  }
  function transition(state, action) {
    const next = Object.assign({}, state, { reviewed: Object.assign({}, state.reviewed) });
    if (action.type === "HANDBOOK_PAGE" && ["student", "map", "notes"].includes(action.id)) {
      next.handbookPage = action.id; next.notice = action.id === "student" ? "Student file selected; case clues remain in the investigation index." : action.id === "map" ? "Location map selected; no evidence state changed." : "Case notes selected; the selected clue remains preserved.";
    } else if (action.type === "REVIEW_PAGE" && !state.reviewed[state.handbookPage]) {
      next.reviewed[state.handbookPage] = true;
      next.notice = state.handbookPage === "student" ? "Student file reviewed. Nari Vale's archive-assistant note remains attached to the case." : state.handbookPage === "map" ? "East corridor route reviewed. The hall clock photo remains linked to that location." : "Case notes reviewed. The photo's timing limit remains unresolved.";
    } else if (action.type === "SELECT_EVIDENCE" && exhibits.some(function (e) { return e.id === action.id; })) {
      next.selectedEvidence = action.id; next.notice = action.id + " selected; source, date, and limits are available in the detail strip.";
    } else if (action.type === "LINK_EVIDENCE" && state.route === "evidence-locker" && state.selectedEvidence && state.linkedEvidence !== state.selectedEvidence) {
      next.linkedEvidence = state.selectedEvidence;
      next.notice = state.selectedEvidence === "EP-03" ? "EP-03 linked for review with Claim 02: the stopped hands at 22:14 may conflict, but the photo does not prove when the clock stopped." : state.selectedEvidence + " linked for review with Claim 02. Its listed facts do not establish the clock's stopped time.";
    } else if (action.type === "SELECT_CLAIM" && claims.some(function (c) { return c.id === action.id; }) && claims[state.debateStep] && action.id === claims[state.debateStep].id) {
      next.selectedClaim = action.id; next.trialResult = ""; next.notice = action.id.replace("claim-", "Claim ") + " selected. Choose evidence separately, then submit the comparison.";
    } else if (action.type === "SUBMIT_MATCH" && state.selectedEvidence && state.selectedClaim && claims[state.debateStep] && state.selectedClaim === claims[state.debateStep].id) {
      const correct = state.selectedEvidence === "EP-03" && state.selectedClaim === "claim-02";
      if (correct) {
        next.trialResult = "Possible contradiction: EP-03 shows stopped hands at 22:14, while Claim 02 says 22:00 after the lights failed. The photo cannot establish when the clock stopped, so it does not prove who is mistaken.";
        next.debateStep = 1; next.selectedClaim = ""; next.notice = "Claim 02 compared. The next statement is open; EP-03 remains available.";
      } else {
        next.trialResult = "No contradiction established: " + state.selectedEvidence + " does not support the active claim. Nothing was consumed; choose another evidence token or claim.";
        next.selectedClaim = ""; next.notice = "Recoverable mismatch. The claim stays active and every evidence token remains available.";
      }
    } else if (action.type === "CLEAR_SELECTION") {
      next.selectedEvidence = ""; next.selectedClaim = ""; next.trialResult = ""; next.notice = "Pending match cleared. The evidence file is unchanged.";
    }
    return next;
  }
  const api = { initialState: initialState, transition: transition, exhibits: exhibits, claims: claims };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  if (!root || !root.document) return;

  let state = initialState();
  const app = root.document.getElementById("app");
  function esc(value) { return String(value).replace(/[&<>"']/g, function (c) { return ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]; }); }
  function routeId() { const id = root.location.hash.replace(/^#/, ""); return ["student-handbook", "evidence-locker", "trial-debate"].includes(id) ? id : "student-handbook"; }
  function nav(id) { return '<nav class="route-nav" aria-label="Case pages"><a href="#student-handbook" ' + (id === "student-handbook" ? 'aria-current="page"' : "") + '>01 · Handbook</a><a href="#evidence-locker" ' + (id === "evidence-locker" ? 'aria-current="page"' : "") + '>02 · Evidence locker</a><a href="#trial-debate" ' + (id === "trial-debate" ? 'aria-current="page"' : "") + '>03 · Trial debate</a></nav>'; }
  function handbook() {
    const page = state.handbookPage;
    const labels = { student: "Student file", map: "Location map", notes: "Case notes" };
    let content = "";
    if (page === "student") content = '<div class="student-layout"><span class="student-portrait" role="img" aria-label="Original fictional student portrait of Nari Vale"></span><div><p class="student-id">FILE 07 / ARCHIVE ASSISTANT</p><h3>Nari Vale</h3><ul class="fact-list"><li>Class role: archive assistant</li><li>Last recorded location: east corridor</li><li>Connection: catalogued the hall clock photograph</li></ul><div class="note-strip"><span>Her record names the source of EP-03. It does not say when the clock stopped.</span></div></div></div>';
    else if (page === "map") content = '<h3>East Hall / investigation map</h3><div class="map-board" aria-label="Named school locations"><div class="map-room">Archive</div><div class="map-room current">East corridor<br>EP-03 photo</div><div class="map-room">Main hall</div><div class="map-room">West stairs<br>EP-01 fiber</div><div class="map-room">Notice board<br>EP-04 schedule</div><div class="map-room">Workshop</div></div><p class="map-caption">Location labels remain visible; the route sketch is a synthetic case aid.</p>';
    else content = '<h3>Investigation notes</h3><div class="case-notes"><div class="case-note"><strong>KNOWN / EP-03</strong>The clock hands appear stopped at 22:14 in a photo taken in the east corridor.</div><div class="case-note"><strong>LIMIT / TIME</strong>The image alone cannot prove when the mechanism stopped.</div><div class="case-note"><strong>OPEN / CLAIM 02</strong>One witness says the clock read 22:00 after the lights failed.</div><div class="case-note"><strong>OPEN / CLAIM 03</strong>Another statement places Nari beside the clock at 22:14.</div></div>';
    return '<p class="kicker">Class record / fictional investigation 07</p><h2 class="screen-title">Student handbook</h2><p class="intro">A compact case index keeps the student file, school map, and investigation notes in one stable reading surface.</p><section class="arena"><nav class="roundtable-index" aria-label="Handbook sections"><span class="index-core">CASE<br>INDEX</span>' + Object.keys(labels).map(function (key) { return '<button class="index-tab" data-action="handbook-page" data-id="' + key + '" aria-pressed="' + (page === key) + '" data-nav-group="handbook">' + labels[key] + '</button>'; }).join("") + '</nav><article class="page-panel"><p class="kicker">02 / ' + labels[page] + (state.reviewed[page] ? ' · reviewed' : ' · not reviewed') + '</p>' + content + '<div class="action-row"><button class="action yellow" data-action="review-page"' + (state.reviewed[page] ? " disabled" : "") + '>' + (state.reviewed[page] ? labels[page] + " reviewed" : "Mark " + labels[page].toLowerCase() + " reviewed") + '</button></div></article><p class="status" role="status" aria-live="polite">' + esc(state.notice) + '</p></section>';
  }
  function evidenceLocker() {
    const selected = exhibits.find(function (e) { return e.id === state.selectedEvidence; }) || exhibits[1];
    const linked = state.linkedEvidence === selected.id;
    return '<p class="kicker">Case file / three exhibits</p><h2 class="screen-title">Evidence locker</h2><p class="intro">Select a numbered record to inspect its source, date, and limits. Linking it to a claim is a separate action.</p><section class="arena"><div class="locker-layout"><nav class="evidence-list" aria-label="Exhibit sequence">' + exhibits.map(function (e) { return '<button class="evidence-token" data-action="select-evidence" data-id="' + e.id + '" aria-label="Select ' + e.id + ' ' + e.name + '" aria-pressed="' + (e.id === selected.id) + '" data-nav-group="evidence">' + e.id + ' · ' + e.name + '<small>' + e.source + '</small></button>'; }).join("") + '</nav><article class="evidence-detail"><p class="kicker">Selected exhibit / ' + selected.id + '</p><h3>' + selected.name + '</h3><div class="evidence-meta">SOURCE · ' + selected.source + '<br>DATE · ' + selected.date + '</div><ul class="known-facts">' + selected.facts.map(function (fact) { return '<li>' + esc(fact) + '</li>'; }).join("") + '</ul><p><strong>Limit:</strong> ' + esc(selected.limited) + '</p><button class="action yellow" data-action="link-evidence"' + (linked ? " disabled" : "") + '>' + (linked ? selected.id + " linked to Claim 02" : "Link " + selected.id + " to Claim 02") + '</button>' + (linked ? '<p class="link-state">' + esc(state.notice) + '</p>' : "") + '</article></div><p class="status" role="status" aria-live="polite">' + esc(state.notice) + '</p></section>';
  }
  function trialDebate() {
    const claim = claims[state.debateStep] || claims[1];
    return '<p class="kicker">Roundtable / explicit match / no timer</p><h2 class="screen-title">Trial debate</h2><p class="intro">Choose one evidence token and one claim, then submit. A miss returns to selection without consuming evidence.</p><section class="arena"><ol class="timeline" aria-label="Debate sequence"><li aria-current="step">01 · Claim 02</li><li' + (state.debateStep === 1 ? ' aria-current="step"' : "") + '>02 · Claim 03</li></ol><div class="debate-grid"><div><p class="kicker">Active statement / ' + claim.label + '</p><div class="claim-list" role="group" aria-label="Testimony claims"><button class="claim-strip" data-action="select-claim" data-id="' + claim.id + '" aria-label="Select ' + claim.label + '" aria-pressed="' + (state.selectedClaim === claim.id) + '" data-nav-group="claim"><span><small>' + claim.label + ' · ' + (state.selectedClaim === claim.id ? "selected" : "select this claim") + '</small>' + claim.text + '</span></button></div></div><nav class="evidence-rail" aria-label="Available evidence"><h3>Evidence token</h3>' + exhibits.map(function (e) { return '<button class="evidence-chip" data-action="select-evidence" data-id="' + e.id + '" aria-label="Select ' + e.id + ' ' + e.name + '" aria-pressed="' + (state.selectedEvidence === e.id) + '" data-nav-group="trial-evidence">' + e.id + ' · ' + e.name + '</button>'; }).join("") + '<p class="kicker">Selected · ' + (state.selectedEvidence || "none") + '</p></nav></div><div class="action-row"><button class="action yellow" data-action="submit-match"' + (!state.selectedEvidence || !state.selectedClaim ? " disabled" : "") + '>Submit selected evidence against ' + claim.label + '</button><button class="action secondary" data-action="clear-selection">Back / clear pending match</button></div>' + (state.trialResult ? '<p class="debate-result ' + (state.trialResult.startsWith("No contradiction") ? "miss" : "") + '" role="status">' + esc(state.trialResult) + '</p>' : "") + '<p class="status" role="status" aria-live="polite">' + esc(state.notice) + '</p></section>';
  }
  function render() {
    const id = routeId(); state.route = id;
    const content = id === "student-handbook" ? handbook() : (id === "evidence-locker" ? evidenceLocker() : trialDebate());
    app.innerHTML = '<main class="trial"><header class="mast"><h1>Case Index / Class 07</h1><span class="edition">Original pop-trial study · invented records</span></header>' + nav(id) + content + '</main>';
  }
  app.addEventListener("click", function (event) {
    const button = event.target.closest("[data-action]"); if (!button || button.disabled) return;
    const action = button.dataset.action;
    if (action === "handbook-page") state = transition(state, { type: "HANDBOOK_PAGE", id: button.dataset.id });
    else if (action === "review-page") state = transition(state, { type: "REVIEW_PAGE" });
    else if (action === "select-evidence") state = transition(state, { type: "SELECT_EVIDENCE", id: button.dataset.id });
    else if (action === "link-evidence") state = transition(state, { type: "LINK_EVIDENCE" });
    else if (action === "select-claim") state = transition(state, { type: "SELECT_CLAIM", id: button.dataset.id });
    else if (action === "submit-match") state = transition(state, { type: "SUBMIT_MATCH" });
    else if (action === "clear-selection") state = transition(state, { type: "CLEAR_SELECTION" });
    render();
  });
  app.addEventListener("keydown", function (event) {
    if (event.key === "Escape" && state.route === "trial-debate") { state = transition(state, { type: "CLEAR_SELECTION" }); render(); return; }
    if (!["ArrowLeft", "ArrowRight", "ArrowDown", "ArrowUp"].includes(event.key)) return;
    const active = root.document.activeElement; if (!active || !active.dataset.navGroup) return;
    const group = active.dataset.navGroup;
    const buttons = Array.from(app.querySelectorAll('[data-nav-group="' + group + '"]')).filter(function (b) { return !b.disabled; });
    const index = buttons.indexOf(active); if (index < 0 || !buttons.length) return;
    event.preventDefault(); const forward = event.key === "ArrowRight" || event.key === "ArrowDown" ? 1 : -1; buttons[(index + forward + buttons.length) % buttons.length].focus();
  });
  root.addEventListener("hashchange", render);
  render();
})(typeof window !== "undefined" ? window : null);
