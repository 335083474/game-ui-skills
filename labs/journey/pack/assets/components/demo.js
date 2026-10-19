const report = (card, message) => {
  const status = card.querySelector(".status");
  if (status) status.textContent = message;
};

document.querySelectorAll(".gate").forEach((button) => {
  button.addEventListener("click", () => {
    const card = button.closest(".specimen");
    card.querySelectorAll(".gate").forEach((item) => {
      item.classList.remove("selected");
      item.setAttribute("aria-pressed", "false");
    });
    button.classList.add("selected");
    button.setAttribute("aria-pressed", "true");
    card.querySelector("[data-preview]").textContent = "Preview: " + button.dataset.gate;
    report(card, "Gate preview changed; the traveler has not moved.");
  });
});

document.querySelectorAll(".signal").forEach((button) => {
  button.addEventListener("click", () => {
    const card = button.closest(".specimen");
    card.querySelectorAll(".signal").forEach((item) => {
      item.classList.remove("selected");
      item.setAttribute("aria-pressed", "false");
    });
    button.classList.add("selected");
    button.setAttribute("aria-pressed", "true");
    card.querySelector("[data-pending]").textContent = "Pending: " + button.dataset.signal + " · local example";
    report(card, "Signal selected for preview. It has not been sent.");
  });
});

document.querySelectorAll("[data-action]").forEach((button) => {
  button.addEventListener("click", () => {
    const card = button.closest(".specimen");
    const action = button.dataset.action;
    if (action === "cross") {
      const nextGate = card.querySelector(".gate.selected");
      card.querySelectorAll(".gate.current").forEach((gate) => {
        gate.classList.remove("current");
        gate.classList.add("passed");
        gate.querySelector("[data-state]").textContent = "Passed";
      });
      nextGate.classList.remove("distant");
      nextGate.classList.remove("passed");
      nextGate.classList.add("current");
      nextGate.querySelector("[data-state]").textContent = "Here";
      card.querySelector("[data-preview]").textContent = "Current: " + nextGate.dataset.gate;
      report(card, "Gate crossing confirmed in this specimen only; the current gate is now " + nextGate.dataset.gate + ".");
    }
    if (action === "advance") {
      const current = card.querySelector(".waypoint.here");
      const next = card.querySelector(".waypoint.ahead");
      if (current && next) {
        current.classList.remove("here");
        current.classList.add("passed");
        current.querySelector("[data-state]").textContent = "Passed";
        next.classList.remove("ahead");
        next.classList.add("here");
        next.querySelector("[data-state]").textContent = "Here";
        report(card, "Waypoint crossing confirmed locally. " + next.querySelector("span:not(.waypoint-mark)").textContent + " is now current.");
      } else {
        report(card, "No further waypoint is available in this synthetic route.");
      }
    }
    if (action === "send") {
      const selected = card.querySelector(".signal.selected").dataset.signal;
      card.querySelector("[data-pending]").textContent = "Sent: " + selected + " · local example";
      report(card, "Signal marked sent in the local specimen only; no network delivery occurred.");
    }
  });
});
