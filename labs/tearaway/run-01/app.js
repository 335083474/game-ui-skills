(function (root) {
  "use strict";
  const routes = ["collection-scrapbook", "paper-outfit", "folded-world-map"];
  const labels = { "paper-kite":"Paper kite", "folded-shell":"Folded shell", "red-rosette":"Red rosette", sky:"Sky cape", red:"Red collar", leaf:"Leaf pin", "reed-bridge":"Reed Bridge", "wind-mill":"Windmill Hill", "blue-gate":"Blue Gate" };
  function makeSession() {
    return {
      "collection-scrapbook": { selected:null, pinned:null, note:"" },
      "paper-outfit": { selected:null, applied:null, note:"" },
      "folded-world-map": { selected:null, route:null, note:"" }
    };
  }
  function transition(session, route, type, value) {
    const s = session[route]; if (!s) return { ok:false, text:"Unknown screen." };
    if (type === "note") { s.note = String(value || "").slice(0,100); return { ok:true, text:"Session note updated." }; }
    if (route === "collection-scrapbook") {
      if (type === "select") { if (value === "red-rosette") return { ok:false, text:"Red rosette is locked and unavailable." }; s.selected = value; return { ok:true, text:`Preview: ${labels[value]} is lifted from the pocket.` }; }
      if (type === "cancel") { s.selected = null; return { ok:true, text:"Cutout preview cleared. The book is unchanged." }; }
      if (type === "commit") { if (s.pinned) return { ok:false, text:"A cutout is already pinned in this session." }; if (!s.selected) return { ok:false, text:"Choose a cutout before pinning it." }; s.pinned = s.selected; return { ok:true, text:`Pinned: ${labels[s.pinned]} to the collected cutouts page.` }; }
      if (type === "undo") { if (!s.pinned) return { ok:false, text:"There is no pinned cutout to lift." }; s.pinned = null; s.selected = null; return { ok:true, text:"Pinned cutout lifted. The page is clear again." }; }
    }
    if (route === "paper-outfit") {
      if (type === "select") { s.selected = value; return { ok:true, text:`Previewing ${labels[value]} on the courier. Nothing has been folded on yet.` }; }
      if (type === "cancel") { s.selected = null; return { ok:true, text:"Paper preview removed. The outfit stays as it was." }; }
      if (type === "commit") { if (!s.selected) return { ok:false, text:"Choose a paper piece before folding it on." }; if (s.applied === s.selected) return { ok:false, text:`${labels[s.applied]} is already applied.` }; s.applied = s.selected; return { ok:true, text:`Folded ${labels[s.applied]} onto the courier outfit.` }; }
    }
    if (route === "folded-world-map") {
      if (type === "select") { if (value === "blue-gate") return { ok:false, text:"Blue Gate is locked. The route is unavailable." }; s.selected = value; return { ok:true, text:`Route preview: ${labels[value]}. It has not unfolded yet.` }; }
      if (type === "cancel") { s.selected = null; return { ok:true, text:"Route preview folded away. No stop was chosen." }; }
      if (type === "commit") { if (s.route) return { ok:false, text:"A route is already unfolded in this session." }; if (!s.selected) return { ok:false, text:"Choose an available stop before unfolding the route." }; s.route = s.selected; return { ok:true, text:`Unfolded route to ${labels[s.route]}. This route choice is session-only.` }; }
    }
    return { ok:false, text:"This action is unavailable." };
  }
  if (typeof module !== "undefined" && module.exports) module.exports = { routes, makeSession, transition };
  if (!root || !root.document) return;

  const art = "assets/reference-plate.png", session = makeSession(), screen = root.document.getElementById("screen");
  const esc = (v) => String(v).replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;", "'":"&#39;"}[c]));
  const noteField = (route) => `<label class="session-edit">Field note for this visit <input maxlength="100" aria-label="Session note for ${route}" data-note="${route}" value="${esc(session[route].note)}" placeholder="Write a small note"></label>`;
  const shell = (route,title,sub,content) => `<div class="screen-heading"><div><p class="kicker">${sub}</p><h2>${title}</h2></div><p>Lift the paper to preview. A labeled action pins, folds, or unfolds it.</p></div>${content}${noteField(route)}`;
  function scrapbook() {
    const s=session["collection-scrapbook"], lifted=s.pinned||s.selected;
    return shell("collection-scrapbook","Collection Scrapbook","A / Pocket folio · collected cutouts",`<div class="paper-field scrapbook"><div class="book-ribbon"><strong>Collected cutouts</strong><span class="folio-tag">PAGE 07 · PAPER KEEPSAKES</span></div><div class="scrap-spread"><section class="paper-page left"><p class="label">Pocket contents</p><div class="cutouts"><button class="cutout" style="--cut:#f1cf64" data-action="select" data-route="collection-scrapbook" data-value="paper-kite" aria-label="Select paper kite" aria-pressed="${s.selected==="paper-kite"}" ${s.pinned?"disabled":""}><span><span class="cutout-icon" aria-hidden="true">◇</span><span class="cutout-name">Paper kite</span></span></button><button class="cutout" style="--cut:#c8e6ed" data-action="select" data-route="collection-scrapbook" data-value="folded-shell" aria-label="Select folded shell" aria-pressed="${s.selected==="folded-shell"}" ${s.pinned?"disabled":""}><span><span class="cutout-icon" aria-hidden="true">⌒</span><span class="cutout-name">Folded shell</span></span></button><button class="cutout" style="--cut:#df8a7d" data-action="select" data-route="collection-scrapbook" data-value="red-rosette" aria-label="Red rosette — locked" aria-disabled="true" disabled><span><span class="cutout-icon" aria-hidden="true">✿</span><span class="cutout-name">Locked<br>rosette</span></span></button></div><div class="pocket"><span class="label">Selection state</span><p class="pocket-status" role="status">${s.pinned?`Pinned: ${labels[s.pinned]} to the collected cutouts page.`:s.selected?`Preview: ${labels[s.selected]} is lifted from the pocket.`:"Choose a cutout to lift it from the pocket."}</p><div class="paper-actions"><button class="primary" data-action="commit" data-route="collection-scrapbook" aria-label="Pin to book" ${!s.selected||s.pinned?"disabled":""}>Pin to book</button><button class="secondary" data-action="cancel" data-route="collection-scrapbook" aria-label="Cancel cutout preview" ${!s.selected||s.pinned?"disabled":""}>Slide back</button><button class="secondary" data-action="undo" data-route="collection-scrapbook" aria-label="Lift pinned cutout" ${!s.pinned?"disabled":""}>Lift pinned piece</button></div></div></section><section class="paper-page right"><p class="label">Scene clipping / river path</p><figure class="field-photo"><img src="${art}" alt="Original folded-paper courier beside a stream, windmill, and cut-paper hills"><figcaption>The landscape is a cut-paper keepsake.</figcaption></figure><p class="result-strip">${lifted?`${s.pinned?"Pinned":"Lifted for preview"}: ${labels[lifted]}.`:"No cutout is on this page yet."}</p></section></div></div>`);
  }
  function outfit() {
    const s=session["paper-outfit"], worn=s.applied?labels[s.applied]:"Sky cape";
    return shell("paper-outfit","Paper Outfit","B / Wearable fold · courier set",`<div class="paper-field outfit-scene"><figure class="courier-photo"><img src="${art}" alt="Original folded paper courier standing above a tiny stream"><span class="folded-cape" aria-hidden="true"></span><figcaption class="courier-caption">A paper courier, built from cut planes and scored edges.</figcaption></figure><section class="outfit-panel"><div><p class="label">The traveler stays in view</p><h3>Courier's shoulder piece</h3><p class="worn">Currently folded on: <strong>${esc(worn)}</strong></p><p class="label" style="margin-top:18px">Loose paper pieces</p><div class="paper-pieces"><button class="piece sky" data-action="select" data-route="paper-outfit" data-value="sky" aria-label="Preview Sky cape" aria-pressed="${s.selected==="sky"}">Sky cape</button><button class="piece red" data-action="select" data-route="paper-outfit" data-value="red" aria-label="Preview Red collar" aria-pressed="${s.selected==="red"}">Red collar</button><button class="piece leaf" data-action="select" data-route="paper-outfit" data-value="leaf" aria-label="Preview Leaf pin" aria-pressed="${s.selected==="leaf"}">Leaf pin</button></div><p class="preview-note" role="status">${s.selected?`Preview only: ${labels[s.selected]} is held beside the traveler.`:"A paper piece stays loose until you fold it onto the outfit."}</p></div><div><div class="paper-actions"><button class="primary" data-action="commit" data-route="paper-outfit" aria-label="Fold onto outfit" ${!s.selected||s.applied===s.selected?"disabled":""}>Fold onto outfit</button><button class="secondary" data-action="cancel" data-route="paper-outfit" aria-label="Cancel outfit preview" ${!s.selected?"disabled":""}>Unpin preview</button></div><p class="result-strip" role="status">${s.applied?`Folded ${labels[s.applied]} onto the courier outfit.`:"No loose piece is applied."}</p></div></section></div>`);
  }
  function map() {
    const s=session["folded-world-map"], stops=[["reed-bridge","Reed Bridge","Visited","⌁"],["wind-mill","Windmill Hill","New fold","✳"],["blue-gate","Blue Gate","Locked","◇"]];
    return shell("folded-world-map","Folded World Map","C / Accordion route · three paper panels",`<div class="paper-field accordion"><div class="map-art"><img src="${art}" alt="Folded-paper hills, a river bridge, windmill, and distant gate"><span class="map-label">The small road east</span></div><div class="route-strip" aria-label="Accordion route stops">${stops.map(([id,name,state,icon])=>`<section class="route-panel"><span class="route-stop" aria-hidden="true">${icon}</span><button data-action="select" data-route="folded-world-map" data-value="${id}" aria-label="Preview ${name} stop — ${state.toLowerCase()}${state==="Locked"?"; locked":""}" aria-pressed="${s.selected===id}" ${state==="Locked"||s.route?"disabled":""}>${name}<span class="route-state">${state==="Visited"?"Visited":state==="New fold"?"New fold":"Locked · unavailable"}</span></button></section>`).join("")}</div><div class="map-controls"><div><p class="label">Fold preview</p><p class="result-strip" role="status">${s.route?`Unfolded route to ${labels[s.route]}. This route choice is session-only.`:s.selected?`Route preview: ${labels[s.selected]}. It has not unfolded yet.`:"Choose a stop to raise its folded panel."}</p></div><div class="paper-actions"><button class="primary" data-action="commit" data-route="folded-world-map" aria-label="Unfold route" ${!s.selected||s.route?"disabled":""}>Unfold route</button><button class="secondary" data-action="cancel" data-route="folded-world-map" aria-label="Cancel route preview" ${!s.selected||s.route?"disabled":""}>Fold preview away</button></div></div></div>`);
  }
  function render() {
    let route=root.location.hash.slice(1); if(!routes.includes(route)){route=routes[0];if(root.location.hash!==`#${route}`)root.history.replaceState(null,"",`#${route}`);}
    root.document.querySelectorAll("[data-route]").forEach(a=>{if(a.tagName==="A"){if(a.dataset.route===route)a.setAttribute("aria-current","page");else a.removeAttribute("aria-current");}});
    screen.innerHTML=route==="collection-scrapbook"?scrapbook():route==="paper-outfit"?outfit():map();
  }
  root.addEventListener("hashchange",render);
  root.document.addEventListener("input",e=>{if(e.target.dataset.note)transition(session,e.target.dataset.note,"note",e.target.value);});
  root.document.addEventListener("click",e=>{const b=e.target.closest("button[data-action]");if(!b)return;const r=transition(session,b.dataset.route,b.dataset.action,b.dataset.value);if(!r.ok){const status=screen.querySelector('[role="status"]');if(status)status.textContent=r.text;return;}render();});
  render();
})(globalThis);
