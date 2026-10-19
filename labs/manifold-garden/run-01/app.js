(function (root, factory) {
  const api = factory();
  root.GameUiStudy = api;
  if (typeof module === "object" && module.exports) module.exports = api;
  if (root && root.document) api.mount(root.document, root);
})(globalThis, function () {
  "use strict";

  function createInitialState() {
    return {
      paused: true,
      cameraLocked: true,
      gateEntered: false,
      gravityAligned: false,
      moving: false,
      messages: {}
    };
  }

  function reduce(state, event) {
    const next = { ...state, messages: { ...state.messages } };
    if (event.screenId === "pause") {
      if (event.action === "resume") {
        next.paused = false;
        next.cameraLocked = false;
        next.messages.pause = "Movement resumed · camera input restored.";
      } else if (event.action === "pause") {
        next.paused = true;
        next.cameraLocked = true;
        next.messages.pause = "Paused · camera input locked.";
      } else if (event.action === "restart") {
        next.paused = true;
        next.cameraLocked = true;
        next.messages.pause = "Room restarted · camera input locked.";
      }
    } else if (event.screenId === "chapter-gates" && event.action === "enter" && !next.gateEntered) {
      next.gateEntered = true;
      next.cameraLocked = false;
      next.messages["chapter-gates"] = "Entered Rooted Gate · movement restored.";
    } else if (event.screenId === "spatial-hint") {
      if (event.action === "rotate" && !next.gravityAligned) {
        next.gravityAligned = true;
        next.messages["spatial-hint"] = "Gravity aligned · path open.";
      } else if (event.action === "resume" && next.gravityAligned) {
        next.moving = true;
        next.cameraLocked = false;
        next.messages["spatial-hint"] = "Movement resumed · camera input restored.";
      }
    }
    return next;
  }

  function bindText(doc, state) {
    doc.querySelectorAll("[data-result]").forEach(function (node) {
      const screen = node.closest("[data-screen]");
      if (screen && state.messages[screen.id]) node.textContent = state.messages[screen.id];
    });
    const chapter = doc.querySelector('[data-bind="gate-chapter"]');
    if (chapter) chapter.textContent = state.gateEntered ? "V · FOLDING" : "IV · ROOTED";
    const hintCopy = doc.querySelector('[data-bind="hint-copy"]');
    if (hintCopy) hintCopy.textContent = state.gravityAligned ? "The landing face is open." : "Turn toward the open face.";

    doc.querySelectorAll("[data-show-when]").forEach(function (node) {
      const shouldShow = node.dataset.showWhen === "paused" ? state.paused : state.moving;
      node.hidden = !shouldShow;
    });

    const gateButton = doc.querySelector('#chapter-gates [data-commit="enter"]');
    if (gateButton && state.gateEntered) {
      gateButton.disabled = true;
      gateButton.textContent = "Gate entered";
    }
    const rotateButton = doc.querySelector('#spatial-hint [data-commit="rotate"]');
    if (rotateButton) rotateButton.disabled = state.gravityAligned;
    const resumeButton = doc.querySelector('#spatial-hint [data-commit="resume"]');
    if (resumeButton) resumeButton.disabled = !state.gravityAligned || state.moving;
  }

  function route(doc, win, moveFocus) {
    const hashId = decodeURIComponent((win.location.hash || "").slice(1));
    const target = doc.getElementById(hashId);
    const active = target && target.matches("[data-screen]") ? target : doc.getElementById("pause");
    doc.querySelectorAll("[data-screen]").forEach(function (screen) { screen.hidden = screen !== active; });
    doc.querySelectorAll(".route-nav a").forEach(function (link) {
      if (link.getAttribute("href") === "#" + active.id) link.setAttribute("aria-current", "page");
      else link.removeAttribute("aria-current");
    });
    if (moveFocus) {
      const heading = active.querySelector("h1");
      if (heading) heading.focus({ preventScroll: true });
    }
  }

  function mount(doc, win) {
    const state = createInitialState();
    route(doc, win, false);
    bindText(doc, state);
    doc.addEventListener("click", function (event) {
      const button = event.target.closest("[data-commit]");
      if (!button || button.disabled) return;
      const screen = button.closest("[data-screen]");
      Object.assign(state, reduce(state, {
        screenId: screen.id,
        action: button.dataset.commit
      }));
      bindText(doc, state);
    });
    win.addEventListener("hashchange", function () { route(doc, win, true); });
    return state;
  }

  return { createInitialState: createInitialState, reduce: reduce, mount: mount };
});