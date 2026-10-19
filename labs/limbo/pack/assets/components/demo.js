const setStatus = (card, message) => {
  const status = card.querySelector(".status");
  if (status) status.textContent = message;
};

document.querySelectorAll(".chapter").forEach((button) => {
  button.addEventListener("click", () => {
    const card = button.closest(".specimen");
    card.querySelectorAll(".chapter").forEach((item) => {
      item.classList.remove("selected");
      item.setAttribute("aria-pressed", "false");
    });
    button.classList.add("selected");
    button.setAttribute("aria-pressed", "true");
    card.querySelector("[data-preview]").textContent = "Preview: " + button.dataset.chapter;
    setStatus(card, "Checkpoint preview changed. No chapter has started.");
  });
});

document.querySelectorAll("[data-action]").forEach((button) => {
  button.addEventListener("click", () => {
    const card = button.closest(".specimen");
    const action = button.dataset.action;
    if (action === "resume") setStatus(card, "Resume chosen in this specimen; no game session is running.");
    if (action === "commit-chapter") setStatus(card, "Checkpoint start explicitly confirmed in the specimen only.");
    if (action === "inspect") setStatus(card, "Inspect chosen for the visible prompt; no world state changed.");
    if (action === "dismiss") {
      card.querySelector("[data-hint]").hidden = true;
      card.querySelector("[data-action='show-hint']").hidden = false;
      setStatus(card, "Hint dismissed. Use Show prompt to restore it.");
    }
    if (action === "show-hint") {
      card.querySelector("[data-hint]").hidden = false;
      button.hidden = true;
      setStatus(card, "Context hint restored.");
    }
  });
});
