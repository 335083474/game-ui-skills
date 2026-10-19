(function (root) {
  "use strict";
  const routes = ["sticker-book", "costume-workbench", "level-pods"];
  const labels = {
    "sun-patch": "Sun patch", "wave-patch": "Wave patch", "star-patch": "Star patch",
    tide: "Tide", berry: "Berry", marigold: "Marigold",
    "cloud-pod": "Cloud Garden", "button-pod": "Button Hollow", "night-pod": "Night Loom"
  };
  function makeSession() {
    return {
      "sticker-book": { selected: null, committed: null, note: "" },
      "costume-workbench": { selected: null, applied: null, note: "" },
      "level-pods": { selected: null, opened: null, note: "" }
    };
  }
  function transition(session, route, type, value) {
    const s = session[route];
    if (!s) return { ok: false, text: "Unknown screen." };
    if (type === "note") { s.note = String(value || "").slice(0, 100); return { ok: true, text: "Session note updated." }; }
    if (route === "sticker-book") {
      if (type === "select") {
        if (value === "star-patch") return { ok: false, text: "Star patch is locked. Earn it in a future level." };
        s.selected = value; return { ok: true, text: `Previewing ${labels[value]}. Nothing has been placed yet.` };
      }
      if (type === "cancel") { s.selected = null; return { ok: true, text: "Sticker preview cleared. The page is unchanged." }; }
      if (type === "commit") {
        if (s.committed) return { ok: false, text: "That sticker is already placed." };
        if (!s.selected) return { ok: false, text: "Choose a sticker before placing it." };
        s.committed = s.selected; return { ok: true, text: `Placed: ${labels[s.committed]} on the Sunny scraps page.` };
      }
      if (type === "undo") { if (!s.committed) return { ok: false, text: "There is no placed sticker to remove." }; s.committed = null; s.selected = null; return { ok: true, text: "Placed sticker removed. The page is clear again." }; }
    }
    if (route === "costume-workbench") {
      if (type === "select") { s.selected = value; return { ok: true, text: `Previewing ${labels[value]} fabric. Your outfit has not changed.` }; }
      if (type === "cancel") { s.selected = null; return { ok: true, text: "Fabric preview cleared. The worn piece stays in place." }; }
      if (type === "commit") {
        if (!s.selected) return { ok: false, text: "Choose a fabric swatch before applying the costume." };
        if (s.applied === s.selected) return { ok: false, text: `${labels[s.applied]} is already applied.` };
        s.applied = s.selected; return { ok: true, text: `Applied: ${labels[s.applied]} fabric. This outfit change is session-only.` };
      }
    }
    if (route === "level-pods") {
      if (type === "select") {
        if (value === "night-pod") return { ok: false, text: "Night Loom is locked. Its status is unavailable." };
        s.selected = value; return { ok: true, text: `Previewing ${labels[value]}. The pod has not opened.` };
      }
      if (type === "cancel") { s.selected = null; return { ok: true, text: "Pod preview cleared. No destination was opened." }; }
      if (type === "commit") {
        if (s.opened) return { ok: false, text: "A pod is already open in this session." };
        if (!s.selected) return { ok: false, text: "Choose an available pod before opening it." };
        s.opened = s.selected; return { ok: true, text: `Opening ${labels[s.opened]}. New destination selected for this session.` };
      }
    }
    return { ok: false, text: "This action is unavailable." };
  }
  if (typeof module !== "undefined" && module.exports) module.exports = { routes, makeSession, transition };
  if (!root || !root.document) return;

  const art = "assets/reference-plate.png";
  const session = makeSession();
  const screen = root.document.getElementById("screen");
  const escape = (v) => String(v).replace(/[&<>"']/g, (c) => ({ "&":"&amp;", "<":"&lt;", ">":"&gt;", "\"":"&quot;", "'":"&#39;" }[c]));
  function noteField(route, s) { return `<label class="session-edit">Session note <input maxlength="100" aria-label="Session note for ${route}" data-note="${route}" value="${escape(s.note)}" placeholder="Add a note for this visit"></label>`; }
  function shell(route, content) { return `<div class="screen-heading"><div><p class="kicker">${route === "sticker-book" ? "Volume 01 / sunny scraps" : route === "costume-workbench" ? "At the fabric bench" : "Cardboard destinations"}</p><h2>${route === "sticker-book" ? "Sticker Book" : route === "costume-workbench" ? "Costume Workbench" : "Level Pods"}</h2></div><p>Choose first. The wooden-button action makes the change.</p></div>${content}${noteField(route, session[route])}`; }
  function renderSticker() {
    const s = session["sticker-book"];
    const patch = s.committed || s.selected;
    const placeDisabled = !s.selected || s.committed;
    return shell("sticker-book", `<div class="craft-board book"><div class="book-cap"><strong>Sunny scraps <span aria-hidden="true">✦</span></strong><span class="stamp">COLLECTED CUTOUTS</span></div><div class="spread"><section class="page-leaf"><p class="label">Patch drawer</p><div class="patch-row"><button class="patch sun" data-action="select" data-route="sticker-book" data-value="sun-patch" aria-label="Choose Sun patch" aria-pressed="${s.selected === "sun-patch"}" ${s.committed ? "disabled" : ""}><span class="patch-name">Sun patch</span></button><button class="patch wave" data-action="select" data-route="sticker-book" data-value="wave-patch" aria-label="Choose Wave patch" aria-pressed="${s.selected === "wave-patch"}" ${s.committed ? "disabled" : ""}><span class="patch-name">Wave patch</span></button><button class="patch" data-action="select" data-route="sticker-book" data-value="star-patch" aria-label="Star patch — locked" aria-disabled="true" disabled><span class="patch-name">Locked<br>Star</span></button></div><p class="label">${s.committed ? "One patch is attached to this page." : "Lift a patch to preview its place."}</p><p id="sticker-status" class="state-line" role="status">${s.committed ? `Placed: ${labels[s.committed]} on the Sunny scraps page.` : s.selected ? `Preview: ${labels[s.selected]} is lifted above the page.` : "No patch selected."}</p><div class="actions"><button class="primary" data-action="commit" data-route="sticker-book" aria-label="Place sticker" ${placeDisabled ? "disabled" : ""}>Place sticker</button><button class="secondary" data-action="cancel" data-route="sticker-book" aria-label="Cancel sticker preview" ${!s.selected || s.committed ? "disabled" : ""}>Put it back</button><button class="secondary" data-action="undo" data-route="sticker-book" aria-label="Remove placed sticker" ${!s.committed ? "disabled" : ""}>Remove placed patch</button></div></section><section class="page-leaf right"><p class="label">Open page / 04</p><figure class="photo-window"><img src="${art}" alt="Original felt explorer beside a stitched cardboard pod in a small craft landscape"><figcaption>Thread holds the cardboard edge. Felt stays soft.</figcaption>${patch ? `<span class="placed-patch" aria-label="${escape(labels[patch])} preview">${escape(labels[patch])}</span>` : `<span class="empty-patch">Sticker<br>landing spot</span>`}</figure><p class="state-line">${s.committed ? "Placed state · removable" : s.selected ? "Preview state · not attached" : "The patch lands here when placed."}</p></section></div></div>`);
  }
  function renderCostume() {
    const s = session["costume-workbench"];
    const current = s.applied ? labels[s.applied] : "Tide cloth";
    return shell("costume-workbench", `<div class="craft-board costume-stage"><figure class="costume-art"><img src="${art}" alt="Original felt explorer wearing a teal fabric coat and berry scarf"><figcaption class="art-caption"><span>Felt explorer / trail set</span><span>Hand-stitched seam</span></figcaption></figure><section class="worktable"><div><p class="label">Worn piece</p><h3>Trail coat</h3><p class="worn-piece">Applied fabric: <strong>${escape(current)}</strong></p><p class="label" style="margin-top:20px">Swatches / one piece at a time</p><div class="swatches"><button class="swatch tide" data-action="select" data-route="costume-workbench" data-value="tide" aria-label="Preview Tide fabric" aria-pressed="${s.selected === "tide"}">Tide fabric</button><button class="swatch berry" data-action="select" data-route="costume-workbench" data-value="berry" aria-label="Preview Berry fabric" aria-pressed="${s.selected === "berry"}">Berry fabric</button><button class="swatch marigold" data-action="select" data-route="costume-workbench" data-value="marigold" aria-label="Preview Marigold fabric" aria-pressed="${s.selected === "marigold"}">Marigold fabric</button></div><p class="preview-chip" role="status">${s.selected ? `Preview only: ${labels[s.selected]} fabric is pinned beside the coat.` : "Choose a scrap to preview it beside the coat."}</p></div><div><div class="actions"><button class="primary" data-action="commit" data-route="costume-workbench" aria-label="Apply costume" ${!s.selected || s.applied === s.selected ? "disabled" : ""}>Apply costume</button><button class="secondary" data-action="cancel" data-route="costume-workbench" aria-label="Cancel fabric preview" ${!s.selected ? "disabled" : ""}>Clear preview</button></div><p class="confirmation" role="status">${s.applied ? `Applied: ${labels[s.applied]} fabric. This outfit change is session-only.` : "Nothing is applied yet. Swatch selection is reversible."}</p></div><span class="woodbench" aria-hidden="true"></span></section></div>`);
  }
  function renderPods() {
    const s = session["level-pods"];
    const pods = [["cloud-pod","Cloud Garden","Played","☁"],["button-pod","Button Hollow","New","✿"],["night-pod","Night Loom","Locked","◌"]];
    return shell("level-pods", `<div class="craft-board pod-land"><div class="pod-skyline" aria-hidden="true"></div><h3 class="pod-title">A shelf of cardboard destinations</h3><div class="pod-shelf" aria-label="Available level pods">${pods.map(([id,name,state,icon]) => `<button class="pod" data-action="select" data-route="level-pods" data-value="${id}" aria-label="${name} pod — ${state.toLowerCase()}${state === "Locked" ? "; locked" : ""}" aria-pressed="${s.selected === id}" ${state === "Locked" || s.opened ? "disabled" : ""}><span class="pod-icon" aria-hidden="true">${icon}</span><strong>${name}</strong><span class="pod-status">${state === "Played" ? "Played before" : state === "New" ? "New pod" : "Locked · unavailable"}</span></button>`).join("")}</div><div class="pod-actions"><div><p class="label">Preview a pod, then open it</p><p class="state-line" role="status">${s.opened ? `Opening ${labels[s.opened]}. New destination selected for this session.` : s.selected ? `Preview: ${labels[s.selected]}. It is not open yet.` : "No destination selected."}</p></div><div class="actions"><button class="primary" data-action="commit" data-route="level-pods" aria-label="Open pod" ${!s.selected || s.opened ? "disabled" : ""}>Open pod</button><button class="secondary" data-action="cancel" data-route="level-pods" aria-label="Cancel pod preview" ${!s.selected || s.opened ? "disabled" : ""}>Clear preview</button></div></div></div>`);
  }
  function render() {
    let route = root.location.hash.slice(1);
    if (!routes.includes(route)) { route = routes[0]; if (root.location.hash !== `#${route}`) root.history.replaceState(null, "", `#${route}`); }
    root.document.querySelectorAll("[data-route]").forEach((a) => { if (a.tagName === "A") { if (a.dataset.route === route) a.setAttribute("aria-current", "page"); else a.removeAttribute("aria-current"); } });
    screen.innerHTML = route === "sticker-book" ? renderSticker() : route === "costume-workbench" ? renderCostume() : renderPods();
  }
  root.addEventListener("hashchange", render);
  root.document.addEventListener("input", (event) => { const route = event.target.dataset.note; if (route) transition(session, route, "note", event.target.value); });
  root.document.addEventListener("click", (event) => {
    const button = event.target.closest("button[data-action]"); if (!button) return;
    const result = transition(session, button.dataset.route, button.dataset.action, button.dataset.value);
    if (!result.ok) { const status = screen.querySelector('[role="status"]'); if (status) status.textContent = result.text; return; }
    render();
  });
  render();
})(globalThis);
