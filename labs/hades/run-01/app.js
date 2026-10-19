(function () {
  "use strict";

  const catalog = {
    "boon-choice": {
      eyebrow: "A NEW OFFERING",
      title: "Choose what changes the next room",
      description: "Three gifts, three different answers to the dark. Preview a path before you bind it.",
      chip: "DESCENT 04 · ASHEN GATE",
      items: [
        { name: "Ember pulse", kind: "CALL · STRIKE", glyph: "bolt", effect: "Your next clean strike leaves a brief ember mark.", stat: "STRIKE +12%", result: "Ember pulse is bound to this descent." },
        { name: "Quiet bulwark", kind: "GUARD · ESCAPE", glyph: "shield", effect: "A precise dash leaves a small guarded interval.", stat: "GUARD +1 BEAT", result: "Quiet bulwark is bound to this descent." },
        { name: "Last cup", kind: "RESTORE · AFTER ROOM", glyph: "cup", effect: "A measured rest restores a little strength.", stat: "RESTORE +18", result: "Last cup is bound to this descent." }
      ],
      action: "Claim boon"
    },
    "weapon-aspects": {
      eyebrow: "ARMORY · ASPECT STUDY",
      title: "One blade, three tempos",
      description: "The armament stays familiar; the rhythm belongs to the aspect you carry.",
      chip: "OATHBOUND BLADE · LEVEL 02",
      items: [
        { name: "Serrated Rest", kind: "ASPECT A", glyph: "blade", effect: "A measured pause gathers force for the following cut.", stat: "HEAVY HIT +9%", result: "Serrated Rest is now set on the Oathbound Blade." },
        { name: "Longstep Edge", kind: "ASPECT B", glyph: "spear", effect: "A short advance adds reach without slowing the return.", stat: "REACH +1", result: "Longstep Edge is now set on the Oathbound Blade." },
        { name: "Coalbound Pair", kind: "ASPECT C", glyph: "bolt", effect: "A second light cut follows a clean opening strike.", stat: "FOLLOW-UP +1", result: "Coalbound Pair is now set on the Oathbound Blade." }
      ],
      action: "Set aspect"
    },
    "keepsakes": {
      eyebrow: "A SMALL THING KEPT",
      title: "Carry one story through the gate",
      description: "A keepsake takes a single worn place. Its quiet promise should be clear before you leave.",
      chip: "WORN PLACE · ONE TOKEN",
      items: [
        { name: "Split laurel", kind: "WORN · RETURNING", glyph: "laurel", effect: "A familiar room gives a little more time to breathe.", stat: "REST +1", result: "Split laurel is now worn for this passage." },
        { name: "Silt coin", kind: "FOUND · READY", glyph: "ring", effect: "The first locked door gives up a modest reserve.", stat: "OBOL +12", result: "Silt coin is now worn for this passage." },
        { name: "First coal", kind: "FOUND · READY", glyph: "star", effect: "A first strike warms the path ahead for one beat.", stat: "OPENING +1", result: "First coal is now worn for this passage." }
      ],
      action: "Wear keepsake"
    }
  };

  const state = {};
  Object.keys(catalog).forEach(function (id) { state[id] = { selected: 0, committed: false, result: "" }; });

  function icon(name, className) {
    return '<svg class="sigil ' + (className || "") + '" viewBox="0 0 48 48" aria-hidden="true"><use href="assets/icons.svg#' + name + '"></use></svg>';
  }
  function preview(id) {
    const item = catalog[id].items[state[id].selected];
    return state[id].committed ? state[id].result : "Preview: " + item.name + " · " + item.stat;
  }
  function pickButton(id, index, variant) {
    const item = catalog[id].items[index];
    const chosen = state[id].selected === index;
    const status = state[id].committed && chosen ? "COMMITTED" : (chosen ? "PREVIEW SELECTED" : "AVAILABLE");
    return '<button type="button" class="pick ' + variant + (chosen ? ' is-selected' : '') + '" data-pick="' + id + ':' + index + '" aria-label="Choose ' + item.name + '" aria-pressed="' + chosen + '">' +
      '<span class="pick-top"><span class="icon-box">' + icon(item.glyph) + '</span><span class="pick-status">' + status + '</span></span>' +
      '<span class="pick-kind">' + item.kind + '</span><strong>' + item.name + '</strong><span class="pick-effect">' + item.effect + '</span><span class="pick-stat">' + item.stat + '</span></button>';
  }
  function actionRow(id) {
    const screen = catalog[id];
    return '<div class="decision-row"><p class="preview" id="result-' + id + '" role="status">' + preview(id) + '</p><button class="commit" type="button" data-commit="' + id + '">' + screen.action + '</button></div>';
  }
  function intro(id, number) {
    const screen = catalog[id];
    return '<div class="screen-intro"><div><p class="eyebrow"><span>' + number + '</span> ' + screen.eyebrow + '</p><h1>' + screen.title + '</h1><p class="lead">' + screen.description + '</p></div><span class="run-chip">' + screen.chip + '</span></div>';
  }
  function screen(id) {
    if (id === "boon-choice") {
      return '<section class="screen boon-screen" id="boon-choice" aria-labelledby="title-boon-choice"><div class="boon-orbit" aria-hidden="true"><span class="orbit-ring"></span><span class="orbit-star">✦</span><span class="orbit-laurel">◜</span><span class="orbit-laurel orbit-right">◝</span><span class="orbit-caption">THREE PROMISES · ONE CHOICE</span></div><div class="screen-content">' +
        intro(id, "01 /") + '<div class="boon-offerings">' + catalog[id].items.map(function (_, i) { return pickButton(id, i, "boon-pick"); }).join("") + '</div>' + actionRow(id) + '<p class="micro-note">Selection is only a preview until the offering is claimed.</p></div></section>';
    }
    if (id === "weapon-aspects") {
      const picked = catalog[id].items[state[id].selected];
      return '<section class="screen aspect-screen" id="weapon-aspects" aria-labelledby="title-weapon-aspects"><div class="aspect-art"><div class="weapon-frame"><img src="assets/hero-illustration.svg" alt="Original silhouette study of a traveler carrying a spear"><div class="weapon-seal">✦</div></div><span class="art-label">ORIGINAL VECTOR ART</span><div class="weapon-ribbon"><span>WEAPON</span><strong>Oathbound blade</strong><small>BASE ATTACK · 42</small></div></div><div class="screen-content">' +
        intro(id, "02 /") + '<div class="aspect-compare"><div class="compare-head"><span>ASPECT LEDGER</span><span>ACTIVE PREVIEW · ' + picked.stat + '</span></div>' +
        catalog[id].items.map(function (item, i) { return '<button type="button" class="aspect-line' + (state[id].selected === i ? ' is-selected' : '') + '" data-pick="' + id + ':' + i + '" aria-label="Choose ' + item.name + '" aria-pressed="' + (state[id].selected === i) + '"><span class="line-number">0' + (i + 1) + '</span><span class="aspect-glyph">' + icon(item.glyph) + '</span><span class="aspect-copy"><small>' + item.kind + '</small><strong>' + item.name + '</strong><span>' + item.effect + '</span></span><b class="aspect-stat">' + item.stat + '</b></button>'; }).join("") +
        '</div>' + actionRow(id) + '<p class="micro-note">The weapon stays; only the handling note changes.</p></div></section>';
    }
    const item = catalog[id].items[state[id].selected];
    return '<section class="screen keepsake-screen" id="keepsakes" aria-labelledby="title-keepsakes"><div class="screen-content">' + intro(id, "03 /") +
      '<div class="keepsake-composition"><div class="keepsake-shelf">' + catalog[id].items.map(function (entry, i) { return '<button type="button" class="keepsake-token' + (state[id].selected === i ? ' is-selected' : '') + '" data-pick="' + id + ':' + i + '" aria-label="Choose ' + entry.name + '" aria-pressed="' + (state[id].selected === i) + '"><span class="token-halo">' + icon(entry.glyph) + '</span><small>' + entry.kind + '</small><strong>' + entry.name + '</strong><span class="token-effect">' + entry.effect + '</span><span class="token-count">' + entry.stat + '</span></button>'; }).join("") + '</div>' +
      '<aside class="worn-place"><div class="portrait-window"><img src="assets/hero-illustration.svg" alt="Original bronze-lit underworld traveler illustration"></div><span class="eyebrow">WORN PLACE · 01</span><strong>' + (state[id].committed ? item.name : "Empty until bound") + '</strong><p>' + (state[id].committed ? "Ready for the passage ahead." : "Preview the token, then commit it to this run.") + '</p><span class="worn-emblem">' + icon(item.glyph) + '</span></aside></div>' + actionRow(id) + '</div></section>';
  }
  function activeId() {
    const id = window.location.hash.slice(1);
    return catalog[id] ? id : "boon-choice";
  }
  function updateNav(id) {
    document.querySelectorAll(".screen-nav a").forEach(function (link) {
      if (link.getAttribute("href") === "#" + id) link.setAttribute("aria-current", "page");
      else link.removeAttribute("aria-current");
    });
  }
  function render(id) {
    const app = document.getElementById("app");
    if (!app) return;
    app.innerHTML = screen(id);
    updateNav(id);
  }
  function select(id, index) {
    if (!catalog[id] || !catalog[id].items[index]) return null;
    state[id].selected = index;
    state[id].committed = false;
    state[id].result = "";
    render(id);
    return catalog[id].items[index].name;
  }
  function commit(id) {
    if (!catalog[id]) return null;
    state[id].committed = true;
    state[id].result = catalog[id].items[state[id].selected].result;
    render(id);
    return state[id].result;
  }
  function navigate(id) {
    if (!catalog[id]) return null;
    window.location.hash = "#" + id;
    render(id);
    return id;
  }
  document.addEventListener("click", function (event) {
    const pick = event.target.closest("[data-pick]");
    const commitButton = event.target.closest("[data-commit]");
    if (pick) {
      const parts = pick.dataset.pick.split(":");
      select(parts[0], Number(parts[1]));
      const next = document.querySelector('[data-pick="' + parts[0] + ':' + parts[1] + '"]');
      if (next) next.focus();
    } else if (commitButton) {
      const id = commitButton.dataset.commit;
      commit(id);
      const next = document.querySelector('[data-commit="' + id + '"]');
      if (next) next.focus();
    }
  });
  window.addEventListener("hashchange", function () { render(activeId()); });
  window.run01Controller = Object.freeze({
    navigate: navigate,
    select: select,
    commit: commit,
    snapshot: function () { return JSON.parse(JSON.stringify(state)); }
  });
  render(activeId());
}());

