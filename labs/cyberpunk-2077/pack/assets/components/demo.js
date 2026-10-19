document.addEventListener("click", event => {
  const pick = event.target.closest("[data-select]");
  if (pick && !pick.disabled) {
    const group = pick.dataset.group;
    if (group) {
      const scope = pick.closest("[data-surface]") || document;
      scope.querySelectorAll(`[data-select][data-group="${group}"]`).forEach(item => item.setAttribute("aria-pressed", String(item === pick)));
    }
    const surface = pick.closest("[data-surface]");
    const live = surface && surface.querySelector("[data-live]");
    const label = pick.dataset.label || pick.textContent.trim().replace(/\s+/g, " ");
    if (live && label) live.textContent = `${label} selected · preview only.`;
  }
  const action = event.target.closest("[data-action]");
  if (action) {
    const surface = action.closest("[data-surface]");
    const live = surface && surface.querySelector("[data-live]");
    if (live && action.dataset.result) live.textContent = action.dataset.result;
  }
});
