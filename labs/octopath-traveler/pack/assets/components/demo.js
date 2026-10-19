const setStatus = (card, message) => {
  const status = card.querySelector(".status");
  if (status) status.textContent = message;
};

document.querySelectorAll(".party-member").forEach((button) => {
  button.addEventListener("click", () => {
    const card = button.closest(".specimen");
    card.querySelectorAll(".party-member").forEach((member) => {
      member.classList.remove("selected");
      member.setAttribute("aria-pressed", "false");
    });
    button.classList.add("selected");
    button.setAttribute("aria-pressed", "true");
    card.dataset.pendingLead = button.dataset.member;
    card.querySelector("[data-lead]").textContent = "Preview lead: " + button.dataset.member;
    setStatus(card, button.dataset.member + " selected for preview. The lead has not changed.");
  });
});

document.querySelectorAll(".equipment").forEach((button) => {
  button.addEventListener("click", () => {
    const card = button.closest(".specimen");
    card.querySelectorAll(".equipment").forEach((item) => {
      item.classList.remove("selected");
      item.setAttribute("aria-pressed", "false");
    });
    button.classList.add("selected");
    button.setAttribute("aria-pressed", "true");
    card.dataset.pendingEquipment = button.dataset.gear;
    setStatus(card, button.dataset.gear + " is a pending equipment preview.");
  });
});

document.querySelectorAll(".command").forEach((button) => {
  button.addEventListener("click", () => {
    const stage = button.closest(".battle-stage");
    stage.querySelectorAll(".command").forEach((item) => {
      item.classList.remove("selected");
      item.setAttribute("aria-pressed", "false");
    });
    button.classList.add("selected");
    button.setAttribute("aria-pressed", "true");
    stage.dataset.pendingCommand = button.dataset.command;
    setStatus(stage, button.dataset.command + " selected. Confirm action to commit in this specimen.");
  });
});

document.querySelectorAll("[data-action]").forEach((button) => {
  button.addEventListener("click", () => {
    const card = button.closest(".specimen, .battle-stage");
    const action = button.dataset.action;
    if (action === "set-lead") {
      const member = card.dataset.pendingLead || "Vela";
      card.querySelectorAll(".party-member").forEach((item) => {
        item.querySelector("[data-role-label]").textContent =
          item.dataset.role + (item.dataset.member === member ? " · lead" : "");
      });
      card.querySelector("[data-lead]").textContent = "Lead: " + member;
      setStatus(card, "Lead change confirmed locally; party data was not saved.");
    }
    if (action === "apply-equipment") {
      const gear = card.dataset.pendingEquipment || "Glasswood rod";
      const selected = card.querySelector(".equipment.selected");
      card.querySelectorAll(".equipment").forEach((item) => {
        const equipped = item === selected;
        item.classList.toggle("current", equipped);
        item.querySelector("[data-item-status]").textContent = equipped ? "Equipped now" : "Available";
      });
      setStatus(card, gear + " applied in this specimen only; no save was changed.");
    }
    if (action === "cancel-equipment") {
      card.querySelectorAll(".equipment").forEach((item) => {
        const current = item.classList.contains("current");
        item.classList.toggle("selected", current);
        item.setAttribute("aria-pressed", current ? "true" : "false");
        item.querySelector("[data-item-status]").textContent = current ? "Equipped now" : "Available";
      });
      card.dataset.pendingEquipment = "";
      setStatus(card, "Equipment preview canceled; Bronze staff remains current.");
    }
    if (action === "confirm-command") {
      const command = card.dataset.pendingCommand || "Strike";
      setStatus(card, command + " confirmed in this specimen only; no battle engine is connected.");
    }
  });
});
