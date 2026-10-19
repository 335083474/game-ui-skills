(function () {
  "use strict";

  const screens = [
    { id: "pause", title: "Pause veil", description: "A sparse pause surface keeps the scene visible and gives Resume a clear, explicit action." },
    { id: "chapters", title: "Chapter path", description: "A quiet checkpoint path marks current, completed, and unknown chapters, with a separate commit to start." },
    { id: "context-hints", title: "Contextual hint", description: "A transient action prompt can be inspected, dismissed, and restored without implying a permanent HUD." }
  ];

  function freshState() {
    return {
      checkpoint: "Old Mill",
      previewCheckpoint: "Old Mill",
      confirmCheckpoint: false,
      hintVisible: true,
      inspected: false,
      notice: {
        pause: "The scene stays visible behind the veil.",
        chapters: "Choosing a marker only previews a destination.",
        "context-hints": "One short prompt appears at the edge of the field."
      }
    };
  }

  function transition(state, action) {
    const next = Object.assign({}, state, { notice: Object.assign({}, state.notice) });
    if (action.type === "preview-checkpoint") {
      next.previewCheckpoint = action.name;
      next.confirmCheckpoint = false;
      next.notice.chapters = action.name === "Upper Woods"
        ? "Upper Woods has an unknown state; it remains a preview."
        : "Preview: " + action.name + ". The current checkpoint has not changed.";
    }
    if (action.type === "request-checkpoint") {
      if (next.previewCheckpoint === "Upper Woods") {
        next.notice.chapters = "Upper Woods is unknown, so it cannot be started in this sample.";
      } else if (next.previewCheckpoint === next.checkpoint) {
        next.notice.chapters = next.checkpoint + " is already the current local checkpoint.";
      } else {
        next.confirmCheckpoint = true;
        next.notice.chapters = "Confirm the checkpoint change or keep the current point.";
      }
    }
    if (action.type === "confirm-checkpoint" && next.confirmCheckpoint) {
      next.checkpoint = next.previewCheckpoint;
      next.confirmCheckpoint = false;
      next.notice.chapters = "Local checkpoint now begins at " + next.checkpoint + ". Progress exists only until reload.";
    }
    if (action.type === "cancel-checkpoint" && next.confirmCheckpoint) {
      next.confirmCheckpoint = false;
      next.previewCheckpoint = next.checkpoint;
      next.notice.chapters = "Checkpoint change canceled. " + next.checkpoint + " remains current.";
    }
    if (action.type === "resume") next.notice.pause = "Pause veil lifted for this local example; no game session is running.";
    if (action.type === "inspect") {
      next.inspected = true;
      next.notice["context-hints"] = "The iron lever is caught under the wheel. This hint is a local example.";
    }
    if (action.type === "dismiss-hint") {
      next.hintVisible = false;
      next.inspected = false;
      next.notice["context-hints"] = "Prompt dismissed. Use Show prompt to restore it.";
    }
    if (action.type === "show-hint") {
      next.hintVisible = true;
      next.inspected = false;
      next.notice["context-hints"] = "Prompt restored at the edge of the field.";
    }
    return next;
  }

  if (typeof module !== "undefined" && module.exports) {
    module.exports = { screens: screens, freshState: freshState, transition: transition };
    return;
  }

  const app = document.getElementById("app");
  let state = freshState();
  let hasRendered = false;
  const checkpointList = [
    { name: "Lowlands", state: "completed", marker: "✓" },
    { name: "Old Mill", state: "current", marker: "●" },
    { name: "Upper Woods", state: "unknown", marker: "○" }
  ];

  function escapeText(value) {
    return String(value).replace(/[&<>"]/g, function (char) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[char];
    });
  }

  function routeId() {
    const id = location.hash.replace(/^#/, "");
    return screens.some(function (screen) { return screen.id === id; }) ? id : "pause";
  }

  function nav(active) {
    return '<header class="topline">' +
      '<div class="brand"><span class="brand-mark" aria-hidden="true"></span><span>LIMBO · ORIGINAL 2010 DIRECTION</span></div>' +
      '<nav class="route-nav" aria-label="Study screens">' +
      screens.map(function (screen) {
        return '<button type="button" data-route="' + screen.id + '"' +
          (screen.id === active ? ' aria-current="page"' : "") + '>' + escapeText(screen.title) + '</button>';
      }).join("") + '</nav></header>';
  }

  function sceneCredit() {
    return '<p class="scene-credit">Generated fog and machinery study · no game scene is shown</p>';
  }

  function renderPause() {
    return '<main class="screen pause-screen">' + nav("pause") +
      '<section class="scene" aria-labelledby="screen-title">' +
      '<div class="scene-copy"><p class="eyebrow">A MOMENT BETWEEN MOVES</p>' +
      '<h1 id="screen-title" tabindex="-1">The clearing holds its breath.</h1>' +
      '<p class="lead">A pause can be quiet. The trees, ash and pale water stay visible beyond the veil.</p>' +
      '<div class="pause-surface"><div class="pause-heading"><span class="state-dot" aria-hidden="true"></span><strong>PAUSED</strong></div>' +
      '<div class="pause-actions"><button class="action-button" type="button" data-action="resume" data-focus="resume">Resume</button>' +
      '<button class="quiet-button" type="button" data-route="chapters">Chapter path</button></div></div></div></section>' +
      '<p class="status-global" role="status" aria-live="polite">' + escapeText(state.notice.pause) + '</p>' + sceneCredit() + '</main>';
  }

  function renderChapters() {
    const points = checkpointList.map(function (item) {
      const selected = state.previewCheckpoint === item.name;
      const marker = item.state === "current" ? "●" : item.marker;
      const label = item.state === "completed" ? "Completed" : (item.state === "current" ? "Current" : "Unknown");
      return '<button class="checkpoint" type="button" data-checkpoint="' + escapeText(item.name) + '" data-state="' + item.state + '"' +
        ' aria-label="' + escapeText(item.name) + '" aria-pressed="' + String(selected) + '" data-focus="checkpoint-' + item.name.toLowerCase().replace(/ /g, "-") + '">' +
        '<span class="checkpoint-marker" aria-hidden="true">' + marker + '</span>' +
        '<span class="checkpoint-name">' + escapeText(item.name) + '</span><span class="checkpoint-state">' + label + '</span></button>';
    }).join("");
    const isStartable = state.previewCheckpoint !== "Upper Woods" && state.previewCheckpoint !== state.checkpoint;
    const transaction = state.confirmCheckpoint
      ? '<div class="confirm-panel" role="group" aria-label="Confirm checkpoint change">' +
        '<p>Start at ' + escapeText(state.previewCheckpoint) + '? This changes only the local sample checkpoint.</p>' +
        '<button class="action-button" type="button" data-action="confirm-checkpoint" data-focus="confirm-checkpoint">Confirm start at ' + escapeText(state.previewCheckpoint) + '</button>' +
        '<button class="quiet-button" type="button" data-action="cancel-checkpoint" data-focus="cancel-checkpoint">Keep current checkpoint</button></div>'
      : "";
    return '<main class="screen chapter-screen">' + nav("chapters") +
      '<section class="scene path-scene" aria-labelledby="screen-title">' +
      '<div class="path-intro"><p class="eyebrow">THREE MARKS IN THE MIST</p><h1 id="screen-title" tabindex="-1">A path through the lowlands.</h1>' +
      '<p class="lead">The pale line is only a route remembered. Select a known checkpoint to preview it.</p></div>' +
      '<div class="route-points" role="group" aria-label="Preview a checkpoint">' + points + '</div>' +
      '<div class="path-control"><p class="path-preview">Current checkpoint<br><strong>' + escapeText(state.checkpoint) + '</strong><br>Preview: <strong>' + escapeText(state.previewCheckpoint) + '</strong></p>' +
      '<button class="action-button" type="button" data-action="request-checkpoint" data-focus="request-checkpoint" ' + (isStartable ? "" : "disabled") + '>Start at checkpoint</button>' +
      '<p class="path-status" role="status" aria-live="polite">' + escapeText(state.notice.chapters) + '</p>' + transaction + '</div></section>' +
      sceneCredit() + '</main>';
  }

  function renderHints() {
    const prompt = state.hintVisible
      ? '<aside class="hint-prompt" aria-label="Context prompt"><div class="prompt-line"><span class="prompt-arrow" aria-hidden="true">↗</span>' +
        '<strong>Inspect the iron lever</strong><kbd>E</kbd></div>' +
        (state.inspected ? '<p class="hint-note">The lever is caught beneath the wheel, just beyond the reeds.</p>' : "") +
        '<div class="hint-actions"><button class="action-button" type="button" data-action="inspect" data-focus="inspect">Inspect</button>' +
        '<button class="quiet-button" type="button" data-action="dismiss-hint" data-focus="dismiss">Dismiss prompt</button></div></aside>'
      : '<button class="quiet-button hint-restore" type="button" data-action="show-hint" data-focus="show">Show prompt</button>';
    return '<main class="screen hint-screen">' + nav("context-hints") +
      '<section class="scene hint-scene" aria-labelledby="screen-title"><div class="scene-copy">' +
      '<p class="eyebrow">A SIGNAL AT THE EDGE</p><h1 id="screen-title" tabindex="-1">One thing moves.</h1>' +
      '<p class="hint-copy">A single prompt can name the next verb, then vanish again. The center of the clearing stays open.</p></div>' + prompt +
      '<p class="status-global" role="status" aria-live="polite">' + escapeText(state.notice["context-hints"]) + '</p></section>' +
      sceneCredit() + '</main>';
  }

  function render(focusKey, moveToHeading) {
    const id = routeId();
    app.innerHTML = id === "pause" ? renderPause() : (id === "chapters" ? renderChapters() : renderHints());
    if (moveToHeading && hasRendered) {
      const heading = app.querySelector("#screen-title");
      if (heading) heading.focus();
    } else if (focusKey) {
      const target = Array.from(app.querySelectorAll("[data-focus]")).find(function (item) { return item.dataset.focus === focusKey; });
      if (target) target.focus();
    }
    hasRendered = true;
  }

  app.addEventListener("click", function (event) {
    const button = event.target.closest("button");
    if (!button) return;
    const focusKey = button.dataset.focus || "";
    if (button.dataset.route) {
      const nextHash = "#" + button.dataset.route;
      if (location.hash === nextHash) render("", false);
      else location.hash = nextHash;
      return;
    }
    if (button.dataset.checkpoint) {
      state = transition(state, { type: "preview-checkpoint", name: button.dataset.checkpoint });
      render(focusKey, false);
      return;
    }
    const type = button.dataset.action;
    if (!type) return;
    state = transition(state, { type: type });
    render(focusKey, false);
  });

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape" && state.confirmCheckpoint) {
      state = transition(state, { type: "cancel-checkpoint" });
      render("cancel-checkpoint", false);
    }
  });

  window.addEventListener("hashchange", function () { render("", true); });
  if (!location.hash || !screens.some(function (screen) { return screen.id === location.hash.slice(1); })) {
    history.replaceState(null, "", location.pathname + location.search + "#pause");
  }
  render("", false);
}());
