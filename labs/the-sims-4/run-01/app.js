(function (root) {
  "use strict";
  const members = {
    sam: { id: "sam", name: "Sam Iri", location: "Kitchen Nook", mood: "Focused · aspiration: Quiet Home", needs: { Energy: 42, Hunger: 68, Social: 76, Hygiene: 54, Fun: 31, Bladder: 88 } },
    jo: { id: "jo", name: "Jo Ren", location: "Garden Step", mood: "Content · aspiration: Good Neighbors", needs: { Energy: 74, Hunger: 43, Social: 59, Hygiene: 81, Fun: 62, Bladder: 37 } }
  };
  const objects = [
    { id: "chair", name: "Cove Reading Chair", room: "Living room", price: 240, shape: "chair", description: "A cushioned reading seat for the window corner." },
    { id: "table", name: "Round Side Table", room: "Living room", price: 90, shape: "table", description: "A small surface for a lamp and folded notes." },
    { id: "desk", name: "Maple Study Desk", room: "Study", price: 310, shape: "desk", description: "A compact writing desk with room for a notebook." }
  ];
  const relations = [
    { id: "sam-jo", a: "sam", b: "jo", type: "Roommates", filter: "household", detail: "They share the household schedule. Jo's trust is steady in this synthetic profile." },
    { id: "sam-mira", a: "sam", b: "mira", type: "Siblings", filter: "family", detail: "Sam is Mira's older sibling; the tie is described as warm in this demo." },
    { id: "jo-ren", a: "jo", b: "ren", type: "Friends", filter: "friends", detail: "Jo checks in with Ren after work; the tie is friendly in this demo." }
  ];
  const names = { mira: "Mira Iri", ren: "Ren Sol" };
  function initialState() { return { route: "needs", member: "sam", budget: 1100, room: "all", search: "", selectedObject: "chair", pendingPlace: "", placed: [], relationFilter: "all", selectedRelation: "sam-jo", notice: "Synthetic household study. Member switching does not change the listed need values." }; }
  function transition(state, action) {
    const next = Object.assign({}, state, { placed: state.placed.slice() });
    if (action.type === "SELECT_MEMBER" && members[action.id]) {
      next.member = action.id; next.notice = members[action.id].name + " selected; need values unchanged.";
    } else if (action.type === "FILTER_ROOM" && ["all", "Living room", "Study"].includes(action.value)) {
      next.room = action.value; next.notice = action.value === "all" ? "All rooms shown; household budget and placed objects are unchanged." : action.value + " catalogue shown; no object has been placed.";
    } else if (action.type === "SEARCH" && typeof action.value === "string") {
      next.search = action.value.slice(0, 60); next.notice = "Catalogue search updated; selection and household budget are unchanged.";
    } else if (action.type === "SELECT_OBJECT" && objects.some(function (o) { return o.id === action.id; })) {
      next.selectedObject = action.id; next.pendingPlace = ""; next.notice = objectName(action.id) + " preview selected. Budget remains " + state.budget + "§ until a confirmed placement.";
    } else if (action.type === "ASK_PLACE") {
      const object = objects.find(function (o) { return o.id === state.selectedObject; });
      if (object && state.placed.indexOf(object.id) < 0 && state.budget >= object.price) {
        next.pendingPlace = object.id; next.notice = object.name + " selected for placement; confirm spending " + object.price + "§ to place it.";
      } else if (object && state.placed.indexOf(object.id) >= 0) next.notice = object.name + " is already placed in this demo room.";
      else if (object) next.notice = "Cannot place " + object.name + ": budget " + state.budget + "§ is below its " + object.price + "§ price.";
    } else if (action.type === "CANCEL_PLACE" && state.pendingPlace) {
      next.pendingPlace = ""; next.notice = "Placement cancelled. Budget remains " + state.budget + "§.";
    } else if (action.type === "CONFIRM_PLACE" && state.pendingPlace) {
      const object = objects.find(function (o) { return o.id === state.pendingPlace; });
      if (object && state.placed.indexOf(object.id) < 0 && state.budget >= object.price) {
        next.budget -= object.price; next.placed.push(object.id); next.pendingPlace = "";
        next.notice = object.name + " placed. Household budget: " + next.budget + "§.";
      }
    } else if (action.type === "FILTER_RELATIONS" && ["all", "household", "family", "friends"].includes(action.value)) {
      next.relationFilter = action.value;
      const shown = relations.filter(function (r) { return action.value === "all" || r.filter === action.value; });
      if (shown.length && !shown.some(function (r) { return r.id === next.selectedRelation; })) next.selectedRelation = shown[0].id;
      next.notice = action.value === "all" ? "All named ties shown; relation states are unchanged." : action.value.charAt(0).toUpperCase() + action.value.slice(1) + " ties shown; relation states are unchanged.";
    } else if (action.type === "SELECT_RELATION" && relations.some(function (r) { return r.id === action.id; })) {
      next.selectedRelation = action.id; next.notice = relationSentence(action.id);
    }
    return next;
  }
  function objectName(id) { const found = objects.find(function (o) { return o.id === id; }); return found ? found.name : id; }
  function personName(id) { return members[id] ? members[id].name : names[id] || id; }
  function relationSentence(id) {
    const r = relations.find(function (rel) { return rel.id === id; });
    return "Selected tie: " + personName(r.a) + " — " + r.type.toLowerCase() + " — " + personName(r.b) + ". " + r.detail;
  }
  const api = { initialState: initialState, transition: transition, members: members, objects: objects, relations: relations };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  if (!root || !root.document) return;

  let state = initialState();
  const app = root.document.getElementById("app");
  function esc(value) { return String(value).replace(/[&<>"']/g, function (c) { return ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]; }); }
  function routeId() { const id = root.location.hash.replace(/^#/, ""); return ["needs", "build-catalogue", "relationships"].includes(id) ? id : "needs"; }
  function nav(id) { return '<nav class="route-nav" aria-label="Household pages"><a href="#needs" ' + (id === "needs" ? 'aria-current="page"' : "") + '>Needs</a><a href="#build-catalogue" ' + (id === "build-catalogue" ? 'aria-current="page"' : "") + '>Build catalogue</a><a href="#relationships" ' + (id === "relationships" ? 'aria-current="page"' : "") + '>Relationships</a></nav>'; }
  function needsScreen() {
    const sim = members[state.member];
    return '<h2 class="screen-title">Household needs</h2><p class="intro">Six named meters for one selected member. The values are synthetic and remain fixed when you switch people.</p><section class="panel"><p class="panel-kicker">Household 01 / selected member</p><div class="member-layout"><article class="member-card"><span class="member-orb" aria-hidden="true">⌂</span><h3>' + sim.name + '</h3><p>Current location · ' + sim.location + '</p><p class="member-mood">' + sim.mood + '</p><div class="member-switcher" role="group" aria-label="Household members">' + Object.keys(members).map(function (id) { return '<button class="switcher" data-action="member" data-id="' + id + '" aria-label="Select ' + members[id].name + '" aria-pressed="' + (state.member === id) + '">' + members[id].name + '</button>'; }).join("") + '</div></article><div><div class="needs-grid">' + Object.keys(sim.needs).map(function (need) { const value = sim.needs[need]; const cue = value < 35 ? " · low" : value > 80 ? " · high" : ""; return '<div class="need"><div class="need-head"><span>' + need + cue + '</span><strong>' + value + ' / 100</strong></div><div class="meter" role="meter" aria-label="' + need + '" aria-valuemin="0" aria-valuemax="100" aria-valuenow="' + value + '" aria-valuetext="' + value + ' of 100"><span class="meter-fill ' + (value < 35 ? "low" : "") + '" style="--value:' + value + '%"></span></div><span class="need-status">' + (value < 35 ? "Needs attention" : "Current synthetic value") + '</span></div>'; }).join("") + '</div><p class="switch-note">Switching members changes the view only; needs are not simulated or edited.</p></div></div><p class="status" role="status" aria-live="polite">' + esc(state.notice) + '</p></section>';
  }
  function shapeClass(shape) { return shape === "chair" ? "chair-shape" : shape === "table" ? "table-shape" : "desk-shape"; }
  function buildScreen() {
    const selected = objects.find(function (o) { return o.id === state.selectedObject; }) || objects[0];
    const matches = objects.filter(function (o) { return (state.room === "all" || o.room === state.room) && o.name.toLowerCase().includes(state.search.toLowerCase()); });
    const pending = objects.find(function (o) { return o.id === state.pendingPlace; });
    const placed = state.placed.indexOf(selected.id) >= 0;
    const enough = state.budget >= selected.price;
    return '<h2 class="screen-title">Build catalogue</h2><p class="intro">Search a small original object shelf, preview one item, and review its price before committing placement.</p><section class="panel"><div class="catalog-tools"><label class="field-label">Room / category<select data-change="room"><option value="all"' + (state.room === "all" ? " selected" : "") + '>All rooms</option><option value="Living room"' + (state.room === "Living room" ? " selected" : "") + '>Living room</option><option value="Study"' + (state.room === "Study" ? " selected" : "") + '>Study</option></select></label><label class="field-label">Search objects<input type="search" data-change="search" value="' + esc(state.search) + '" placeholder="Try chair or desk"></label></div><div class="catalog-layout"><div class="object-shelf" aria-label="Furniture results">' + (matches.length ? matches.map(function (o) { return '<button class="object-tile" data-action="object" data-id="' + o.id + '" aria-label="Select ' + o.name + '" aria-pressed="' + (state.selectedObject === o.id) + '"><span class="object-art" aria-hidden="true"><span class="' + shapeClass(o.shape) + '"></span></span><b>' + o.name + '</b><small>' + o.room + ' · ' + o.price + '§</small></button>'; }).join("") : '<p>No matching objects in this room.</p>') + '</div><article class="preview"><p class="panel-kicker">Placement preview / ' + selected.room + '</p><h3>' + selected.name + '</h3><div class="preview-art" aria-hidden="true"><span class="' + shapeClass(selected.shape) + '"></span></div><p>' + selected.description + '</p><div class="price-line"><span>Price</span><strong>' + selected.price + '§</strong></div><div class="price-line"><span>Household budget</span><strong>' + state.budget + '§</strong></div>' + (placed ? '<p class="switch-note">Already placed in the demo room.</p>' : !enough ? '<p class="switch-note">Cannot place: budget is below this item price.</p>' : '') + '<button class="action" data-action="ask-place"' + (placed || !enough ? " disabled" : "") + '>' + (placed ? selected.name + " placed" : "Place " + selected.name) + '</button>' + (pending ? '<div class="confirm-box" role="group" aria-label="Confirm object placement"><p>Place ' + pending.name + ' for ' + pending.price + '§? This will reduce the household budget once.</p><button class="action" data-action="confirm-place" aria-label="Confirm placement of ' + pending.name + ' for ' + pending.price + ' simoleons">Confirm placement</button><button class="action secondary" data-action="cancel-place">Cancel</button></div>' : '') + '</article></div><p class="status" role="status" aria-live="polite">' + esc(state.notice) + '</p></section>';
  }
  function relationshipScreen() {
    const shown = relations.filter(function (r) { return state.relationFilter === "all" || r.filter === state.relationFilter; });
    const selected = relations.find(function (r) { return r.id === state.selectedRelation; }) || shown[0] || relations[0];
    return '<h2 class="screen-title">Relationships</h2><p class="intro">A small named graph shows one household and its surrounding ties. Selecting a line only opens its description.</p><section class="panel"><div class="filter-row" role="group" aria-label="Filter relationships">' + [["all", "All ties"], ["household", "Household"], ["family", "Family"], ["friends", "Friends"]].map(function (item) { return '<button class="filter" data-action="relation-filter" data-value="' + item[0] + '" aria-pressed="' + (state.relationFilter === item[0]) + '">' + item[1] + '</button>'; }).join("") + '</div><div class="graph-layout"><div class="social-graph" role="group" aria-label="Relationship graph">' + shown.map(function (r) { return '<div class="tie-row"><span class="graph-node">' + personName(r.a) + '</span><button class="graph-link" data-action="relation" data-id="' + r.id + '" aria-label="Select tie: ' + personName(r.a) + ' and ' + personName(r.b) + '" aria-pressed="' + (selected.id === r.id) + '">' + r.type + '</button><span class="graph-node">' + personName(r.b) + '</span></div>'; }).join("") + '</div><article class="relation-detail"><p class="panel-kicker">Selected connection</p><h3>' + personName(selected.a) + ' · ' + selected.type + ' · ' + personName(selected.b) + '</h3><p>' + selected.detail + '</p><p class="switch-note">Graph selection is descriptive; it does not change a relationship value.</p></article></div><details class="text-fallback"><summary>Read relationships as a text list</summary><ul>' + shown.map(function (r) { return '<li>' + personName(r.a) + ' — ' + r.type.toLowerCase() + ' — ' + personName(r.b) + '. ' + esc(r.detail) + '</li>'; }).join("") + '</ul></details><p class="status" role="status" aria-live="polite">' + esc(state.notice) + '</p></section>';
  }
  function render() { const id = routeId(); state.route = id; const content = id === "needs" ? needsScreen() : (id === "build-catalogue" ? buildScreen() : relationshipScreen()); app.innerHTML = '<main class="home"><header class="mast"><h1>Hearthside / Household 01</h1><small>Original life-simulation study · synthetic home state</small></header>' + nav(id) + content + '</main>'; }
  app.addEventListener("click", function (event) {
    const button = event.target.closest("[data-action]"); if (!button || button.disabled) return;
    const action = button.dataset.action;
    if (action === "member") state = transition(state, { type: "SELECT_MEMBER", id: button.dataset.id });
    else if (action === "object") state = transition(state, { type: "SELECT_OBJECT", id: button.dataset.id });
    else if (action === "ask-place") state = transition(state, { type: "ASK_PLACE" });
    else if (action === "confirm-place") state = transition(state, { type: "CONFIRM_PLACE" });
    else if (action === "cancel-place") state = transition(state, { type: "CANCEL_PLACE" });
    else if (action === "relation-filter") state = transition(state, { type: "FILTER_RELATIONS", value: button.dataset.value });
    else if (action === "relation") state = transition(state, { type: "SELECT_RELATION", id: button.dataset.id });
    render();
  });
  app.addEventListener("change", function (event) {
    const control = event.target.closest("[data-change]"); if (!control) return;
    state = transition(state, control.dataset.change === "room" ? { type: "FILTER_ROOM", value: control.value } : { type: "SEARCH", value: control.value }); render();
  });
  root.addEventListener("hashchange", render);
  render();
})(typeof window !== "undefined" ? window : null);
