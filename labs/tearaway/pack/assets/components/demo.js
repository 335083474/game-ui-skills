"use strict";

document.querySelectorAll("[data-select-group]").forEach((group) => {
  const options = Array.from(group.querySelectorAll("[data-select]"));
  const apply = group.parentElement.querySelector("[data-apply]");
  const message = group.parentElement.querySelector("[data-message]");
  let selected = null;

  options.forEach((option) => {
    option.addEventListener("click", () => {
      selected = option;
      options.forEach((item) => item.setAttribute("aria-pressed", String(item === selected)));
      message.textContent = option.dataset.name + " previewed. Use the paper tab to commit it.";
    });
  });

  apply.addEventListener("click", () => {
    if (!selected) {
      message.textContent = "Choose an available paper piece before continuing.";
      return;
    }
    message.textContent = selected.dataset.name + " confirmed in this local specimen. No game data was saved.";
  });
});
