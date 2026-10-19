(function (root) {
  "use strict";
  const skills = [
    { id: "logic", name: "Logic", group: "Reasoning", value: 4, tone: "steady", voice: "A clean gap is still evidence. Ask what was moved, then let the answer stay uncertain.", modifiers: [["Base voice", "4 / steady"], ["Dock ledger clue", "+1 for this named check"], ["Long shift fatigue", "−8% on the scripted check"]] },
    { id: "empathy", name: "Empathy", group: "Bearing", value: 3, tone: "open", voice: "Mera is holding her breath before she says the date.", modifiers: [["Base voice", "3 / open"], ["Witness posture", "noticed, not scored"], ["Case note", "no numeric change"]] },
    { id: "composure", name: "Composure", group: "Bearing", value: 2, tone: "thin", voice: "The silence is uncomfortable, which does not make it a confession.", modifiers: [["Base voice", "2 / thin"], ["Rain delay", "−1 for this invented scene"], ["Case note", "no numeric change"]] },
    { id: "perception", name: "Perception", group: "Reasoning", value: 5, tone: "sharp", voice: "There is a second imprint beneath the page where the date was written.", modifiers: [["Base voice", "5 / sharp"], ["Paper impression", "+1 observation only"], ["Case note", "no numeric change"]] }
  ];
  const thoughts = {
    "missing-shift": { name: "The Missing Shift", source: "A blank square in the dock ledger", phase: "considering", progress: 1, effect: "Forming it grants one extra interview detail in this synthetic demo.", effectApplied: false },
    "borrowed-umbrella": { name: "Borrowed Umbrella", source: "A dry cuff in the rain", phase: "considering", progress: 0, effect: "A reminder that small comforts can make people speak.", effectApplied: false },
    "quiet-harbor": { name: "Quiet Harbor", source: "A map drawn without the eastern pier", phase: "formed", progress: 3, effect: "The route note is already present in this synthetic folio.", effectApplied: true }
  };
  function initialState() {
    return { route: "dialogue-check", choice: "", responseConfirmed: false, checkResolved: false, selectedSkill: "empathy", fieldNote: false, thoughts: JSON.parse(JSON.stringify(thoughts)), selectedThought: "missing-shift", focusHours: 2, notice: "The dock ledger is damp at the corners. The reading stays yours to interpret." };
  }
  function transition(state, action) {
    const next = Object.assign({}, state, { thoughts: JSON.parse(JSON.stringify(state.thoughts)) });
    if (action.type === "SELECT_CHOICE" && !state.responseConfirmed) {
      next.choice = action.id; next.notice = action.id === "ask-day" ? "Preview: ask Mera about the missing day; no answer has been added yet." : "Preview: leave the ledger alone; the case remains where it is.";
    } else if (action.type === "CONFIRM_RESPONSE" && state.choice && !state.responseConfirmed) {
      next.responseConfirmed = true;
      next.notice = state.choice === "ask-day" ? "Response confirmed: Mera says the page was moved after the final bell." : "Response confirmed: you let the silence stand for now.";
    } else if (action.type === "RESOLVE_CHECK" && state.responseConfirmed && !state.checkResolved) {
      next.checkResolved = true; next.notice = "Logic check resolved: scripted pass (44%). The check is settled once in this demo.";
    } else if (action.type === "SELECT_SKILL" && skills.some(function (s) { return s.id === action.id; })) {
      next.selectedSkill = action.id; next.fieldNote = false; next.notice = skills.find(function (s) { return s.id === action.id; }).name + " selected; modifiers are shown with their source.";
    } else if (action.type === "RECORD_FIELD_NOTE" && !state.fieldNote) {
      next.fieldNote = true; next.notice = skills.find(function (s) { return s.id === state.selectedSkill; }).name + " field note recorded in this synthetic folio.";
    } else if (action.type === "SELECT_THOUGHT" && state.thoughts[action.id]) {
      next.selectedThought = action.id; next.notice = state.thoughts[action.id].name + " selected; its phase and effect are visible below.";
    } else if (action.type === "BEGIN_THOUGHT") {
      const thought = next.thoughts[state.selectedThought];
      if (thought && thought.phase === "considering" && state.focusHours >= 1) {
        thought.phase = "internalizing"; next.focusHours -= 1; next.notice = "Internalizing " + thought.name + " used 1 focus hour; " + next.focusHours + " remain.";
      }
    } else if (action.type === "OBSERVE_THOUGHT") {
      const thought = next.thoughts[state.selectedThought];
      if (thought && thought.phase === "internalizing" && thought.progress < 3) {
        thought.progress += 1;
        if (thought.progress === 3) {
          thought.phase = "formed"; thought.effectApplied = true;
          next.notice = "Thought formed: " + thought.name + ". One synthetic interview detail is now available.";
        } else next.notice = thought.name + " progress: " + thought.progress + " of 3 observations.";
      }
    }
    return next;
  }
  const api = { initialState: initialState, transition: transition, skills: skills, thoughtTemplates: thoughts };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  if (!root || !root.document) return;

  let state = initialState();
  const app = root.document.getElementById("app");
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]; }); }
  function routeId() {
    const id = root.location.hash.replace(/^#/, "");
    return ["dialogue-check", "skills", "thought-cabinet"].indexOf(id) >= 0 ? id : "dialogue-check";
  }
  function nav(id) {
    return '<nav class="route-nav" aria-label="Folio pages"><a href="#dialogue-check" ' + (id === "dialogue-check" ? 'aria-current="page"' : "") + '>01 · Dialogue</a><a href="#skills" ' + (id === "skills" ? 'aria-current="page"' : "") + '>02 · Skills</a><a href="#thought-cabinet" ' + (id === "thought-cabinet" ? 'aria-current="page"' : "") + '>03 · Thought cabinet</a></nav>';
  }
  function checkBox() {
    return '<div class="check-record"><div><strong>LOGIC / TARGET 12</strong><small>Base 42% · +10 clue · −8 fatigue</small></div><span class="chance">44%</span></div>';
  }
  function dialogue() {
    return '<p class="kicker">District case / 06 · East dock office</p><h2 class="screen-title">Dialogue and skill check</h2><p class="intro">A literary feed with one marginal voice. Choices preview a response; the check is resolved as a separate, scripted demo action.</p><div class="reading-layout"><aside class="portrait-rail"><span class="portrait" role="img" aria-label="Original painted portrait of a fictional dock archivist"></span><span class="portrait-caption">Mera Quill<br>night archivist</span></aside><section class="feed" aria-label="Case reading feed"><p class="speaker">Detective · field note</p><p>The dock ledger is damp at the corners. One day has been left blank with a carefulness that feels almost like handwriting.</p><p class="voice">LOGIC <span class="edition">/ an interruption</span><br>“The missing page is too clean to have fallen out. Ask who needed the gap to look accidental.”</p><p class="speaker">Mera Quill · archivist</p><p>“I closed the office after the final bell. The page was there when I left. I think.”</p>' +
      checkBox() + '<ul class="choice-list" aria-label="Response choices"><li><button class="choice-line" data-action="choice" data-id="ask-day" aria-label="— Ask about the missing day" aria-pressed="' + (state.choice === "ask-day") + '">Ask about the missing day</button></li><li><button class="choice-line" data-action="choice" data-id="leave-it" aria-label="— Leave the ledger alone" aria-pressed="' + (state.choice === "leave-it") + '">Leave the ledger alone</button></li></ul>' +
      (state.responseConfirmed ? '<div class="paper-slip"><p>' + (state.choice === "ask-day" ? "Mera says the page was moved after the final bell. The answer adds a time, not a motive." : "You let the silence stand. The ledger remains open to the same blank square.") + '</p></div>' : "") +
      '<div class="inline-actions"><button class="folio-action primary" data-action="confirm-response"' + (!state.choice || state.responseConfirmed ? " disabled" : "") + '>Confirm selected response</button><button class="folio-action" data-action="resolve-check"' + (!state.responseConfirmed || state.checkResolved ? " disabled" : "") + '>Resolve scripted Logic check</button></div>' +
      '<p class="result" role="status" aria-live="polite">' + esc(state.notice) + '</p></section></div>';
  }
  function skillsScreen() {
    const selected = skills.find(function (s) { return s.id === state.selectedSkill; });
    const groups = ["Reasoning", "Bearing"];
    return '<p class="kicker">Detective profile / case-specific voices</p><h2 class="screen-title">Skill journal</h2><p class="intro">The numbers are synthetic study values. Selecting a voice reveals its description and named modifiers.</p><div class="skills-layout"><section aria-label="Skill index">' +
      groups.map(function (group) { return '<div class="skill-group"><h3>' + group + '</h3>' + skills.filter(function (s) { return s.group === group; }).map(function (s) { return '<button class="skill-row" data-action="skill" data-id="' + s.id + '" data-nav-group="skills" aria-label="Select ' + s.name + '" aria-pressed="' + (s.id === state.selectedSkill) + '"><span>' + s.name + '</span><span class="skill-value">' + s.value + ' / ' + s.tone + '</span></button>'; }).join("") + '</div>'; }).join("") +
      '</section><article class="skill-detail"><p class="kicker">Selected voice / ' + selected.group + '</p><h3>' + selected.name + '</h3><span class="value">' + selected.value + ' · ' + selected.tone + '</span><p>' + selected.voice + '</p><ul class="modifier-list">' + selected.modifiers.map(function (m) { return '<li><span>' + m[0] + '</span><b>' + m[1] + '</b></li>'; }).join("") + '</ul>' +
      '<div class="inline-actions"><button class="folio-action primary" data-action="field-note"' + (state.fieldNote ? " disabled" : "") + '>' + (state.fieldNote ? "Field note recorded" : "Record field note for " + selected.name) + '</button></div><p class="result" role="status" aria-live="polite">' + esc(state.notice) + '</p></article></div>';
  }
  function thoughtsScreen() {
    const selected = state.thoughts[state.selectedThought];
    return '<p class="kicker">Loose ideas / one fictional case</p><h2 class="screen-title">Thought cabinet</h2><p class="intro">The slips evolve through considering, internalizing, and formed. Starting one costs a named focus hour; observations are explicit.</p><div class="thought-board">' +
      Object.keys(state.thoughts).map(function (id) {
        const t = state.thoughts[id];
        return '<article class="thought-slip"><span class="pin" aria-hidden="true"></span><button class="thought-select" data-action="thought" data-id="' + id + '" aria-label="Select ' + t.name + '" aria-pressed="' + (state.selectedThought === id) + '">' + t.name + '</button><div class="phase"><span>' + t.phase + '</span><span>' + t.progress + ' / 3 observations</span></div><p>Source: ' + t.source + '</p><p>' + t.effect + '</p><div class="progress-track" role="meter" aria-label="' + t.name + ' thought progress" aria-valuemin="0" aria-valuemax="3" aria-valuenow="' + t.progress + '"><span style="width:' + (t.progress * 33.333) + '%"></span></div></article>';
      }).join("") +
      '<section class="board-detail"><p class="kicker">Selected slip</p><h3>' + selected.name + '</h3><p>Phase: <strong>' + selected.phase + '</strong> · progress ' + selected.progress + ' of 3 · focus hours remaining: ' + state.focusHours + '</p><p>Effect: ' + selected.effect + '</p><div class="inline-actions"><button class="folio-action primary" data-action="begin-thought"' + (selected.phase !== "considering" || state.focusHours < 1 ? " disabled" : "") + '>Begin internalizing — costs 1 focus hour</button><button class="folio-action" data-action="observe-thought"' + (selected.phase !== "internalizing" ? " disabled" : "") + '>Record one observation</button></div><p class="result" role="status" aria-live="polite">' + esc(state.notice) + '</p></section></div>';
  }
  function render() {
    const id = routeId(); state.route = id;
    const content = id === "dialogue-check" ? dialogue() : (id === "skills" ? skillsScreen() : thoughtsScreen());
    app.innerHTML = '<main class="folio"><header class="mast"><h1>Low Tide / Case Folio</h1><span class="edition">Original literary detective study · synthetic case</span></header>' + nav(id) + content + '</main>';
  }
  app.addEventListener("click", function (event) {
    const button = event.target.closest("[data-action]");
    if (!button || button.disabled) return;
    const type = button.dataset.action;
    if (type === "choice") state = transition(state, { type: "SELECT_CHOICE", id: button.dataset.id });
    else if (type === "confirm-response") state = transition(state, { type: "CONFIRM_RESPONSE" });
    else if (type === "resolve-check") state = transition(state, { type: "RESOLVE_CHECK" });
    else if (type === "skill") state = transition(state, { type: "SELECT_SKILL", id: button.dataset.id });
    else if (type === "field-note") state = transition(state, { type: "RECORD_FIELD_NOTE" });
    else if (type === "thought") state = transition(state, { type: "SELECT_THOUGHT", id: button.dataset.id });
    else if (type === "begin-thought") state = transition(state, { type: "BEGIN_THOUGHT" });
    else if (type === "observe-thought") state = transition(state, { type: "OBSERVE_THOUGHT" });
    render();
  });
  app.addEventListener("keydown", function (event) {
    if (!["ArrowDown", "ArrowUp"].includes(event.key)) return;
    const active = root.document.activeElement;
    if (!active || !active.dataset.navGroup) return;
    const group = active.dataset.navGroup;
    const buttons = Array.from(app.querySelectorAll('[data-nav-group="' + group + '"]')).filter(function (b) { return !b.disabled; });
    const index = buttons.indexOf(active);
    if (index >= 0 && buttons.length) { event.preventDefault(); buttons[(index + (event.key === "ArrowDown" ? 1 : -1) + buttons.length) % buttons.length].focus(); }
  });
  root.addEventListener("hashchange", render);
  render();
})(typeof window !== "undefined" ? window : null);
