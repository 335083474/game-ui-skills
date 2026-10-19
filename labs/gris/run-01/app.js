(function () {
  "use strict";

  const screens = [
    { id: "chapter-selection", title: "Chapter threshold", description: "A sparse architectural path marks visited, current, and unreached chapters while separating preview from entry." },
    { id: "memories", title: "Memory fragment", description: "A quiet found-memory detail opens and closes as a view action without changing collection state." },
    { id: "pause", title: "Small pause surface", description: "A restrained Continue action and two secondary disclosures keep the scene present." }
  ];

  function freshState() {
    return {
      chapter: "Quiet Bridge",
      previewChapter: "Quiet Bridge",
      confirmChapter: false,
      memoryOpen: false,
      notice: {
        "chapter-selection": "A chapter becomes active only after a separate confirmation.",
        memories: "Reading opens a view; it does not change collection state.",
        pause: "The world remains visible behind the pause choices."
      }
    };
  }

  function transition(state, action) {
    const next = Object.assign({}, state, { notice: Object.assign({}, state.notice) });
    if (action.type === "preview-chapter") {
      next.previewChapter = action.name;
      next.confirmChapter = false;
      next.notice["chapter-selection"] = action.name === "Blue Arch"
        ? "Blue Arch is unreached; it remains a preview."
        : "Preview: " + action.name + ". Quiet Bridge remains current.";
    }
    if (action.type === "request-entry") {
      if (next.previewChapter === "Blue Arch") {
        next.notice["chapter-selection"] = "Blue Arch is unreached, so it cannot be entered in this sample.";
      } else if (next.previewChapter === next.chapter) {
        next.notice["chapter-selection"] = next.chapter + " is already the current local chapter.";
      } else {
        next.confirmChapter = true;
        next.notice["chapter-selection"] = "Confirm the chapter change or keep the current chapter.";
      }
    }
    if (action.type === "confirm-entry" && next.confirmChapter) {
      next.chapter = next.previewChapter;
      next.confirmChapter = false;
      next.notice["chapter-selection"] = "Local chapter changed to " + next.chapter + ". It resets when this page reloads.";
    }
    if (action.type === "cancel-entry" && next.confirmChapter) {
      next.confirmChapter = false;
      next.previewChapter = next.chapter;
      next.notice["chapter-selection"] = "Entry canceled. " + next.chapter + " remains current.";
    }
    if (action.type === "open-memory") {
      next.memoryOpen = true;
      next.notice.memories = "Paper bird opened for reading; collection state is unchanged.";
    }
    if (action.type === "close-memory") {
      next.memoryOpen = false;
      next.notice.memories = "Memory closed. No collection state changed.";
    }
    if (action.type === "continue") next.notice.pause = "Continue chosen for this local example; no game session is running.";
    return next;
  }

  if (typeof module !== "undefined" && module.exports) {
    module.exports = { screens: screens, freshState: freshState, transition: transition };
    return;
  }

  const app = document.getElementById("app");
  let state = freshState();
  let hasRendered = false;
  const chapters = [
    { name: "Stone Steps", state: "visited", mark: "◇", label: "Visited" },
    { name: "Quiet Bridge", state: "current", mark: "●", label: "Current" },
    { name: "Blue Arch", state: "unreached", mark: "○", label: "Unreached" }
  ];

  function escapeText(value) {
    return String(value).replace(/[&<>"]/g, function (char) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[char];
    });
  }

  function routeId() {
    const id = location.hash.replace(/^#/, "");
    return screens.some(function (screen) { return screen.id === id; }) ? id : "chapter-selection";
  }

  function nav(active) {
    return '<header class="topline"><div class="brand"><span class="brand-mark" aria-hidden="true"></span><span>GRIS · ORIGINAL 2018 DIRECTION</span></div>' +
      '<nav class="route-nav" aria-label="Study screens">' + screens.map(function (screen) {
        return '<button type="button" data-route="' + screen.id + '"' +
          (screen.id === active ? ' aria-current="page"' : "") + '>' + escapeText(screen.title) + '</button>';
      }).join("") + '</nav></header>';
  }

  function caption() {
    return '<p class="scene-caption">Original watercolor architecture study · no character art</p>';
  }

  function renderChapters() {
    const choices = chapters.map(function (item) {
      const selected = state.previewChapter === item.name;
      return '<button class="chapter-node" type="button" data-chapter="' + escapeText(item.name) + '" data-state="' + item.state + '" aria-label="' + escapeText(item.name) + '" aria-pressed="' + String(selected) +
        '" data-focus="chapter-' + item.name.toLowerCase().replace(/ /g, "-") + '"><span class="arch-mark" aria-hidden="true">' + item.mark +
        '</span><span class="chapter-name">' + escapeText(item.name) + '</span><span class="chapter-state">' + item.label + '</span></button>';
    }).join("");
    const canEnter = state.previewChapter !== "Blue Arch" && state.previewChapter !== state.chapter;
    const confirm = state.confirmChapter
      ? '<div class="confirm-row" role="group" aria-label="Confirm chapter entry"><p>Enter ' + escapeText(state.previewChapter) + '? This only changes the local sample chapter.</p>' +
        '<button class="action" type="button" data-action="confirm-entry" data-focus="confirm">Confirm entry to ' + escapeText(state.previewChapter) + '</button>' +
        '<button class="secondary" type="button" data-action="cancel-entry" data-focus="cancel">Keep Quiet Bridge</button></div>'
      : "";
    return '<main class="screen chapter-screen">' + nav("chapter-selection") +
      '<section class="scene" aria-labelledby="screen-title"><div class="hero-copy"><p class="eyebrow">COLOR HELD IN OPEN SPACE</p>' +
      '<h1 id="screen-title" tabindex="-1">A threshold in the pale air.</h1><p class="lead">Stone, quiet water and a few marks give the next chapter a place to rest.</p></div>' +
      '<div class="chapter-path" role="group" aria-label="Preview a chapter">' + choices + '</div>' +
      '<div class="path-footer"><p class="path-preview">Current chapter<br><strong>' + escapeText(state.chapter) + '</strong><br>Preview: <strong>' + escapeText(state.previewChapter) + '</strong></p>' +
      '<button class="action" type="button" data-action="request-entry" data-focus="request" ' + (canEnter ? "" : "disabled") + '>Enter chapter</button>' +
      '<p class="path-status" role="status" aria-live="polite">' + escapeText(state.notice["chapter-selection"]) + '</p>' + confirm + '</div></section>' +
      caption() + '</main>';
  }

  function renderMemories() {
    const reading = state.memoryOpen
      ? '<div class="reading"><p>A folded shape rests where the wind turns quiet. The line catches a little rose light, then lets it go.</p>' +
        '<button class="secondary" type="button" data-action="close-memory" data-focus="close-memory">Close fragment</button></div>'
      : "";
    return '<main class="screen memory-screen">' + nav("memories") +
      '<section class="scene memory-screen" aria-labelledby="screen-title"><div class="memory-intro"><p class="eyebrow">A SMALL THING KEPT</p>' +
      '<h1 id="screen-title" tabindex="-1">Light settles on the ledge.</h1><p class="lead">A found fragment is a moment to look at, not a counter to fill.</p></div>' +
      '<span class="memory-tuft" aria-hidden="true"></span><article class="memory-fragment"><div class="memory-heading">' +
      '<span class="memory-mark" aria-hidden="true">◇</span><h2>Paper bird</h2><button class="action" type="button" data-action="open-memory" data-focus="open-memory" ' +
      (state.memoryOpen ? "hidden" : "") + '>Read</button></div><p class="memory-state">Found · local example state</p>' + reading +
      '<p class="status" role="status" aria-live="polite">' + escapeText(state.notice.memories) + '</p></article></section>' +
      caption() + '</main>';
  }

  function renderPause() {
    return '<main class="screen pause-screen">' + nav("pause") +
      '<section class="scene pause-screen" aria-labelledby="screen-title"><div class="pause-copy"><p class="eyebrow">LET THE PIGMENT SETTLE</p>' +
      '<h1 id="screen-title" tabindex="-1">A quiet pause.</h1><p class="lead">The sky can stay open while a few choices wait at the edge.</p>' +
      '<div class="pause-line"><span class="pause-mark" aria-hidden="true"></span><span>Paused</span></div>' +
      '<div class="pause-actions"><button class="action" type="button" data-action="continue" data-focus="continue">Continue</button>' +
      '<button class="secondary" type="button" data-route="chapter-selection">Chapters</button>' +
      '<button class="secondary" type="button" data-route="memories">Memories</button></div>' +
      '<p class="status" role="status" aria-live="polite">' + escapeText(state.notice.pause) + '</p></div></section>' +
      caption() + '</main>';
  }

  function render(focusKey, moveToHeading) {
    const id = routeId();
    app.innerHTML = id === "chapter-selection" ? renderChapters() : (id === "memories" ? renderMemories() : renderPause());
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
    if (button.dataset.chapter) {
      state = transition(state, { type: "preview-chapter", name: button.dataset.chapter });
      render(focusKey, false);
      return;
    }
    if (!button.dataset.action) return;
    state = transition(state, { type: button.dataset.action });
    render(focusKey, false);
  });

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape" && state.confirmChapter) {
      state = transition(state, { type: "cancel-entry" });
      render("cancel", false);
    }
  });

  window.addEventListener("hashchange", function () { render("", true); });
  if (!location.hash || !screens.some(function (screen) { return screen.id === location.hash.slice(1); })) {
    history.replaceState(null, "", location.pathname + location.search + "#chapter-selection");
  }
  render("", false);
}());
