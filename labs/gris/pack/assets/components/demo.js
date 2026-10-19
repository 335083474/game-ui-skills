const updateStatus = (card, message) => {
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
    updateStatus(card, "Chapter preview changed. Use Enter chapter to commit.");
  });
});

document.querySelectorAll("[data-action]").forEach((button) => {
  button.addEventListener("click", () => {
    const card = button.closest(".specimen");
    const action = button.dataset.action;
    if (action === "enter") updateStatus(card, "Chapter entry confirmed in this specimen only.");
    if (action === "continue") updateStatus(card, "Continue chosen; no game session is running.");
    if (action === "open-memory") {
      card.querySelector("[data-memory]").hidden = false;
      updateStatus(card, "Memory opened for reading; collection state is unchanged.");
    }
    if (action === "close-memory") {
      card.querySelector("[data-memory]").hidden = true;
      updateStatus(card, "Memory closed. No collection state changed.");
    }
  });
});
