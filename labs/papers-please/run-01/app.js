(function (root) {
  "use strict";
  const pages = [
    { title: "Entry permits", date: "Effective 01 / 08 / 2026", rules: [["District", "Permit district must match the visitor's arrival card."], ["Expiration", "Reject documents that expired before today's date."], ["Issuing office", "The office mark must be legible on the original sheet."]] },
    { title: "Transit dates", date: "Effective 02 / 08 / 2026", rules: [["Arrival window", "The entry date must fall within the listed transit window."], ["Departure", "Transit visitors may remain for six calendar days."], ["Unclear date", "Ask for a corrected card; do not guess at a smudged digit."]] },
    { title: "Work authorizations", date: "Effective 03 / 08 / 2026", rules: [["Employer", "The named employer must match the work pass."], ["Permit class", "A work stamp is required for paid labor."], ["Unknown field", "Leave an unreadable value unresolved until a clear copy is presented."]] }
  ];
  function initialState() {
    return { route: "inspection", selectedField: "District", compared: false, pendingDecision: null, decision: null, page: 0, detailOpen: false, settled: false, notice: "Synthetic case 018. No decision has been stamped." };
  }
  function transition(state, action) {
    const next = Object.assign({}, state);
    if (action.type === "FIELD") {
      next.selectedField = action.field; next.compared = false; next.pendingDecision = null;
      next.notice = action.field + " selected. Compare the printed values before choosing a stamp.";
    } else if (action.type === "COMPARE") {
      next.compared = true;
      next.notice = action.field === "District" ?
        "District mismatch: Entry Permit says North Quay; Arrival Card says Old Market." :
        action.field + " matches across the visible papers.";
    } else if (action.type === "CHOOSE_DECISION" && !state.decision) {
      next.pendingDecision = action.decision;
      next.notice = action.decision + " selected for case 018. Confirm to record it.";
    } else if (action.type === "CANCEL_DECISION") {
      next.pendingDecision = null; next.notice = "Stamp cancelled. Case 018 remains pending.";
    } else if (action.type === "COMMIT_DECISION" && state.pendingDecision && !state.decision) {
      next.decision = state.pendingDecision; next.pendingDecision = null;
      next.notice = "Case 018 recorded: " + next.decision + ". District mismatch — Entry Permit says North Quay; Arrival Card says Old Market.";
    } else if (action.type === "PAGE" && action.index >= 0 && action.index < pages.length) {
      next.page = action.index; next.notice = "Page " + String(action.index + 1).padStart(2, "0") + " · " + pages[action.index].title + ".";
    } else if (action.type === "NEXT_PAGE" && state.page < pages.length - 1) {
      next.page = state.page + 1; next.notice = "Page " + String(next.page + 1).padStart(2, "0") + " · " + pages[next.page].title + ".";
    } else if (action.type === "PREVIOUS_PAGE" && state.page > 0) {
      next.page = state.page - 1; next.notice = "Page " + String(next.page + 1).padStart(2, "0") + " · " + pages[next.page].title + ".";
    } else if (action.type === "TOGGLE_DETAIL") {
      next.detailOpen = !state.detailOpen; next.notice = next.detailOpen ? "Household line expanded; the typed amount stays 0." : "Household detail closed.";
    } else if (action.type === "SETTLE") {
      next.notice = state.settled ? "Today's ledger was already settled; the balance was not applied twice." : "Day ledger settled. Closing balance 30.";
      next.settled = true;
    }
    return next;
  }
  const api = { initialState: initialState, transition: transition, pages: pages };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  if (!root || !root.document) return;

  let state = initialState();
  const app = root.document.getElementById("app");
  const fields = ["District", "Expiration", "Office"];
  const values = {
    District: ["North Quay", "Old Market"],
    Expiration: ["12 / 08 / 2026", "12 / 08 / 2026"],
    Office: ["West Desk 4", "West Desk 4"]
  };
  function escape(s) { return String(s).replace(/[&<>"]/g, function (c) { return ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]; }); }
  function routeId() {
    const id = root.location.hash.replace(/^#/, "");
    return ["inspection", "rulebook", "daily-ledger"].indexOf(id) >= 0 ? id : "inspection";
  }
  function nav(id) {
    return '<nav class="route-nav" aria-label="Border desk pages">' +
      '<a href="#inspection" ' + (id === "inspection" ? 'aria-current="page"' : "") + '>01 · Inspection</a>' +
      '<a href="#rulebook" ' + (id === "rulebook" ? 'aria-current="page"' : "") + '>02 · Rulebook</a>' +
      '<a href="#daily-ledger" ' + (id === "daily-ledger" ? 'aria-current="page"' : "") + '>03 · Daily ledger</a></nav>';
  }
  function inspection() {
    const chosen = state.selectedField;
    function documentCard(title, code, index) {
      return '<article class="document ' + (index ? "secondary" : "") + '"><div class="doc-title"><span>' + title + '</span><span>' + code + '</span></div><p class="doc-sub">' + (index ? "VISITOR DECLARATION · CASE 018" : "ENTRY PERMIT · CASE 018") + '</p><div class="field-list">' +
        fields.map(function (field) {
          const val = values[field][index];
          const highlighted = state.compared && field === chosen && field === "District";
          return '<div class="field-row"><button type="button" data-action="field" data-field="' + field + '" aria-pressed="' + (chosen === field) + '">' + field + '</button><span class="field-value ' + (highlighted ? "mismatch" : "") + '">' + val + '</span></div>';
        }).join("") + '</div><div class="doc-sub">RECORDED 18 / 08 / 2026 · TYPEWRITTEN COPY</div></article>';
    }
    return '<p class="section-label">Desk task 01 / compare before marking</p><h2 class="screen-title">Document inspection</h2><p class="intro">Choose one field, compare both papers against the current rule, then confirm a separate stamp action.</p><section class="workspace"><div class="work-head"><span>Active file · visitor 018</span><span>Current rule: matching district</span></div><div class="papers">' +
      documentCard("ENTRY PERMIT", "EP-018-A", 0) + documentCard("ARRIVAL CARD", "AC-018-B", 1) + '</div><aside class="policy-slip"><strong>Rule 4 / Permit district</strong>Both current documents must name the same district. The visible field values remain inspectable even before comparison.</aside>' +
      '<div class="tool-row"><button class="tool secondary" data-action="compare">Compare ' + escape(chosen) + ' across both papers</button>' +
      '<button class="tool approve" data-action="decision" data-decision="APPROVE"' + (state.decision ? " disabled" : "") + '>APPROVE</button><button class="tool deny" data-action="decision" data-decision="DENY"' + (state.decision ? " disabled" : "") + '>DENY</button>' +
      (state.decision ? '<span class="stamp ' + (state.decision === "APPROVE" ? "approved" : "") + '">' + state.decision + '</span>' : "") + '</div>' +
      (state.compared ? '<div class="comparison"><strong>' + (chosen === "District" ? "Mismatch named: District." : "Comparison result: " + chosen + ".") + '</strong><br>' + (chosen === "District" ? "Entry Permit: North Quay. Arrival Card: Old Market. The permit rule requires a match." : values[chosen][0] + " appears on both papers.") + '</div>' : "") +
      (state.pendingDecision ? '<div class="confirm-box"><p>Record ' + state.pendingDecision + ' for synthetic case 018?</p><div class="tool-row"><button class="tool ' + (state.pendingDecision === "DENY" ? "deny" : "approve") + '" data-action="commit">Confirm ' + state.pendingDecision + ' for case 018</button><button class="tool secondary" data-action="cancel">Cancel stamp</button></div></div>' : "") +
      '<p class="status" role="status" aria-live="polite">' + escape(state.notice) + '</p></section>';
  }
  function rulebook() {
    const page = pages[state.page];
    return '<p class="section-label">Bound reference · stable page tabs</p><h2 class="screen-title">Policy handbook</h2><p class="intro">The manual stays a reference surface. Turning a page does not change the active visitor file.</p><section class="workspace"><div class="book"><aside class="book-index"><h3>RULE INDEX</h3><nav aria-label="Rulebook pages">' +
      pages.map(function (p, index) { return '<button class="page-tab" data-action="page" data-index="' + index + '" aria-pressed="' + (index === state.page) + '">' + String(index + 1).padStart(2, "0") + ' · ' + p.title + '</button>'; }).join("") +
      '</nav></aside><article class="book-page"><p class="page-overline">Page ' + String(state.page + 1).padStart(2, "0") + ' of 03 / Border desk circular</p><h3>' + page.title + '</h3><p class="effective">' + page.date + ' · Fictional policy sample</p>' +
      page.rules.map(function (rule) { return '<div class="rule"><strong>' + rule[0] + '</strong><span>' + rule[1] + '</span></div>'; }).join("") +
      '<div class="book-controls"><button class="tool secondary" data-action="previous"' + (state.page === 0 ? " disabled" : "") + '>Previous page</button><span class="meta">Page ' + (state.page + 1) + ' / 3</span><button class="tool secondary" data-action="next"' + (state.page === pages.length - 1 ? " disabled" : "") + '>Next rulebook page</button></div></article></div><p class="status" role="status" aria-live="polite">' + escape(state.notice) + '</p></section>';
  }
  function ledger() {
    return '<p class="section-label">Statement 018 / typed household account</p><h2 class="screen-title">Daily ledger</h2><p class="intro">Wages, deductions, and the remaining balance stay aligned as a ruled statement.</p><section class="workspace"><article class="ledger"><header class="ledger-head"><h3>HOUSEHOLD 018 · DAILY CLOSE</h3><span>18 / 08 / 2026</span></header>' +
      '<div class="ledger-row"><span>Wages received</span><strong>+ 70</strong></div><div class="ledger-row"><span>Rent</span><strong>− 20</strong></div><div class="ledger-row"><span>Food</span><strong>− 15</strong></div><div class="ledger-row"><span>Heat</span><strong>− 5</strong></div><div class="ledger-row"><span>Medicine <button class="line-action" data-action="detail">' + (state.detailOpen ? "Hide" : "Inspect") + ' household line</button></span><strong>− 0</strong></div>' +
      (state.detailOpen ? '<div class="line-detail">No medicine charge is recorded in this synthetic sample today. The value is explicitly zero.</div>' : "") +
      '<div class="ledger-row total"><span>Remaining</span><strong>30</strong></div>' +
      '<div class="tool-row"><button class="tool" data-action="settle"' + (state.settled ? " disabled" : "") + '>' + (state.settled ? "Ledger settled" : "Settle ledger: 30 remaining") + '</button></div>' +
      '<p class="status" role="status" aria-live="polite">' + escape(state.notice) + '</p></article></section>';
  }
  function render() {
    const id = routeId(); state.route = id;
    const content = id === "inspection" ? inspection() : (id === "rulebook" ? rulebook() : ledger());
    app.innerHTML = '<main class="desk-app"><header class="mast"><h1>Border Desk / Original Document Study</h1><span class="meta">Fictional records · no real identities</span></header>' + nav(id) + content + '</main>';
  }
  app.addEventListener("click", function (event) {
    const button = event.target.closest("[data-action]");
    if (!button || button.disabled) return;
    const type = button.dataset.action;
    if (type === "field") state = transition(state, { type: "FIELD", field: button.dataset.field });
    else if (type === "compare") state = transition(state, { type: "COMPARE", field: state.selectedField });
    else if (type === "decision") state = transition(state, { type: "CHOOSE_DECISION", decision: button.dataset.decision });
    else if (type === "commit") state = transition(state, { type: "COMMIT_DECISION" });
    else if (type === "cancel") state = transition(state, { type: "CANCEL_DECISION" });
    else if (type === "page") state = transition(state, { type: "PAGE", index: Number(button.dataset.index) });
    else if (type === "next") state = transition(state, { type: "NEXT_PAGE" });
    else if (type === "previous") state = transition(state, { type: "PREVIOUS_PAGE" });
    else if (type === "detail") state = transition(state, { type: "TOGGLE_DETAIL" });
    else if (type === "settle") state = transition(state, { type: "SETTLE" });
    render();
  });
  root.addEventListener("hashchange", render);
  render();
})(typeof window !== "undefined" ? window : null);
