(() => {
  const screenIds = ["weapon-loadout", "combat-hud", "pause-settings"];
  const ammo = { clip: 8, reserve: 24, magazine: 8, shots: 0 };
  const weapons = {
    scattergun: { name: "SCATTERGUN", count: "8 SHELLS", clip: 8, reserve: 24 },
    rivet: { name: "RIVET GUN", count: "24 NAILS", clip: 24, reserve: 48 },
    sheller: { name: "SHELL LAUNCHER", count: "4 ROUNDS", clip: 4, reserve: 12 }
  };
  let selectedWeapon = "scattergun";
  let equippedWeapon = "scattergun";

  const showScreen = (id) => {
    const target = screenIds.includes(id) ? id : "combat-hud";
    document.querySelectorAll(".screen").forEach((screen) => { screen.hidden = screen.id !== target; });
    document.querySelectorAll(".screen-nav a").forEach((link) => {
      if (link.hash === `#${target}`) link.setAttribute("aria-current", "page");
      else link.removeAttribute("aria-current");
    });
  };
  const setRoute = (id) => { if (location.hash !== `#${id}`) location.hash = id; else showScreen(id); };
  const pad = (number) => String(number).padStart(3, "0");
  const updateAmmo = () => {
    document.getElementById("clip-value").textContent = pad(ammo.clip);
    document.getElementById("reserve-value").textContent = pad(ammo.reserve);
  };
  const feedback = (message) => { document.getElementById("combat-feedback").textContent = message; };
  const fire = () => {
    if (ammo.clip < 1) { feedback("CLIP EMPTY · RELOAD TO CONTINUE"); return; }
    ammo.clip -= 1;
    ammo.shots += 1;
    updateAmmo();
    feedback(`LOCAL INPUT ECHO · SHOT ${ammo.shots}`);
  };
  const reload = () => {
    const moved = Math.min(ammo.magazine - ammo.clip, ammo.reserve);
    if (!moved) { feedback("MAGAZINE READY · NO ROUNDS MOVED"); return; }
    ammo.clip += moved;
    ammo.reserve -= moved;
    updateAmmo();
    feedback(`LOCAL RELOAD · ${pad(ammo.clip)} IN CLIP`);
  };
  const chooseWeapon = (button) => {
    selectedWeapon = button.dataset.weapon;
    document.querySelectorAll(".weapon-option").forEach((option) => {
      const active = option === button;
      option.classList.toggle("is-selected", active);
      option.setAttribute("aria-pressed", String(active));
      option.querySelector(".slot-state").textContent = active ? "SELECTED" : (option.dataset.weapon === equippedWeapon ? "EQUIPPED" : "READY");
    });
    const selection = weapons[selectedWeapon];
    document.getElementById("loadout-feedback").textContent = `${selection.name} SELECTED · ${selection.count} (DEMO)`;
  };
  const applySetting = (button) => {
    const enabled = button.getAttribute("aria-pressed") !== "true";
    button.setAttribute("aria-pressed", String(enabled));
    button.classList.toggle("is-on", enabled);
    const name = button.dataset.setting === "shake" ? "Screen shake" : "Pixel filter";
    button.setAttribute("aria-label", `${name} ${enabled ? "On" : "Off"}`);
    button.textContent = enabled ? "ON" : "OFF";
    document.getElementById("settings-feedback").textContent = `${name.toUpperCase()} · ${enabled ? "ON" : "OFF"} / PREVIEW`;
  };

  document.querySelectorAll(".screen-nav a").forEach((link) => link.addEventListener("click", () => showScreen(link.hash.slice(1))));
  window.addEventListener("hashchange", () => showScreen(location.hash.slice(1)));
  document.querySelectorAll(".weapon-option").forEach((button) => button.addEventListener("click", () => chooseWeapon(button)));
  document.querySelectorAll(".switch-button").forEach((button) => button.addEventListener("click", () => applySetting(button)));
  document.getElementById("look-sensitivity").addEventListener("input", (event) => {
    document.getElementById("look-value").value = event.currentTarget.value;
    document.getElementById("settings-feedback").textContent = `LOOK SENSITIVITY · ${event.currentTarget.value} / PREVIEW`;
  });
  document.querySelectorAll("[data-action]").forEach((button) => button.addEventListener("click", () => {
    switch (button.dataset.action) {
      case "fire": fire(); break;
      case "reload": reload(); break;
      case "pause": setRoute("pause-settings"); break;
      case "resume": setRoute("combat-hud"); break;
      case "equip":
        equippedWeapon = selectedWeapon;
        ammo.clip = weapons[equippedWeapon].clip;
        ammo.reserve = weapons[equippedWeapon].reserve;
        ammo.magazine = weapons[equippedWeapon].clip;
        updateAmmo();
        document.getElementById("equipped-readout").textContent = weapons[equippedWeapon].name;
        document.getElementById("weapon-readout").textContent = weapons[equippedWeapon].name;
        document.querySelectorAll(".weapon-option").forEach((option) => {
          option.querySelector(".slot-state").textContent = option.dataset.weapon === equippedWeapon ? "EQUIPPED" : "READY";
        });
        document.getElementById("loadout-feedback").textContent = `${weapons[equippedWeapon].name} READY — ${weapons[equippedWeapon].count} / LOCAL DEMO`;
        break;
      case "apply-settings": document.getElementById("settings-feedback").textContent = "SETTINGS APPLIED FOR THIS PAGE"; break;
    }
  }));
  window.addEventListener("keydown", (event) => {
    if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement || event.target instanceof HTMLSelectElement) return;
    const active = document.querySelector(".screen:not([hidden])")?.id;
    if (event.code === "Escape") {
      event.preventDefault();
      setRoute(active === "pause-settings" ? "combat-hud" : "pause-settings");
    } else if (active === "combat-hud" && event.code === "Space") {
      event.preventDefault(); fire();
    } else if (active === "combat-hud" && event.key.toLowerCase() === "r") {
      reload();
    }
  });
  updateAmmo();
  if (!screenIds.includes(location.hash.slice(1))) history.replaceState(null, "", "#combat-hud");
  showScreen(location.hash.slice(1));
})();
