(() => {
  const ids = ["desktop", "mail", "file-library"];
  const windowIds = ["browser", "notes", "downloads", "mail-inbox", "mail-detail", "files"];
  const windows = Object.fromEntries(windowIds.map((id) => [id, { visible: true, minimized: false }]));
  const messages = [
    { sender: "Auntie Lune / 09:14", subject: "New fish on my page!", copy: "I added a new little fish counter to the reef page. Tell me if the colors look okay!", suspicious: false },
    { sender: "HypnoMail / 08:02", subject: "Your weekly notice", copy: "Your Pond Party page had 12 local visitors this week. This is a fictional weekly notice for the interface study.", suspicious: false },
    { sender: "Tadpole77 / Yesterday", subject: "Check this link", copy: "hey, found a thing for your reef page. see if this looks familiar!", suspicious: true }
  ];
  const fileMarks = new Set();
  let selectedMessage = 0;
  const showScreen = (id) => {
    const target = ids.includes(id) ? id : ids[0];
    document.querySelectorAll(".screen").forEach((screen) => { screen.hidden = screen.id !== target; });
    document.querySelectorAll(".screen-nav a").forEach((link) => link.hash === `#${target}` ? link.setAttribute("aria-current", "page") : link.removeAttribute("aria-current"));
  };
  const setRoute = (id) => { if (location.hash !== `#${id}`) location.hash = id; else showScreen(id); };
  const applyWindowStates = () => {
    document.querySelectorAll("[data-window]").forEach((element) => {
      const id = element.dataset.window;
      if (windows[id]) element.hidden = !windows[id].visible || windows[id].minimized;
    });
  };
  const windowTitle = { browser: "Mara's Reef Page", notes: "HypnOS Notes", downloads: "Downloads", "mail-inbox": "HypnoMail Inbox", "mail-detail": "Message detail", files: "Downloads — demo folder" };
  const openWindow = (id) => {
    if (!windows[id]) return;
    windows[id].visible = true; windows[id].minimized = false; applyWindowStates();
    const feedback = document.getElementById("desktop-feedback");
    if (feedback) feedback.textContent = `${windowTitle[id]} restored on this desktop.`;
  };
  const updateMessage = (index) => {
    selectedMessage = index;
    const message = messages[index];
    document.querySelectorAll(".message-row").forEach((button) => {
      const active = Number(button.dataset.message) === index; button.classList.toggle("is-selected", active); button.setAttribute("aria-pressed", String(active));
    });
    document.getElementById("mail-sender").textContent = message.sender;
    document.getElementById("mail-subject").textContent = message.subject;
    document.getElementById("mail-copy").textContent = message.copy;
    document.getElementById("mail-warning").hidden = !message.suspicious;
    document.getElementById("mail-link").hidden = !message.suspicious;
  };

  document.querySelectorAll(".screen-nav a").forEach((link) => link.addEventListener("click", () => showScreen(link.hash.slice(1))));
  window.addEventListener("hashchange", () => showScreen(location.hash.slice(1)));
  document.querySelectorAll("[data-window-action]").forEach((button) => button.addEventListener("click", () => {
    const id = button.dataset.window;
    const action = button.dataset.windowAction;
    if (!windows[id]) return;
    if (action === "close") { windows[id].visible = false; windows[id].minimized = false; }
    if (action === "minimize") { windows[id].minimized = true; windows[id].visible = true; }
    if (action === "restore") { windows[id].visible = true; windows[id].minimized = false; }
    applyWindowStates();
    const feedback = document.getElementById("desktop-feedback");
    if (feedback) feedback.textContent = `${windowTitle[id]} ${action === "close" ? "closed" : action === "minimize" ? "minimized" : "restored"} in this page.`;
  }));
  document.querySelectorAll("[data-open-window]").forEach((button) => button.addEventListener("click", () => openWindow(button.dataset.openWindow)));
  document.querySelectorAll(".message-row").forEach((button) => button.addEventListener("click", () => updateMessage(Number(button.dataset.message))));
  document.querySelectorAll("[data-web-link]").forEach((button) => button.addEventListener("click", () => {
    document.getElementById("browser-status").textContent = `${button.dataset.webLink.toUpperCase()} / LOCAL SAMPLE`;
  }));
  document.querySelectorAll("[data-mark-file]").forEach((button) => button.addEventListener("click", () => {
    const name = button.dataset.markFile;
    const state = document.querySelector(`[data-file-state="${name}"]`);
    if (fileMarks.has(name)) fileMarks.delete(name); else fileMarks.add(name);
    const marked = fileMarks.has(name);
    state.textContent = marked ? "MARKED IN THIS PAGE" : "NOT DOWNLOADED";
    state.classList.toggle("is-marked", marked);
    button.textContent = marked ? `Unmark ${name} in demo` : `Mark ${name} for demo`;
    document.getElementById("files-feedback").textContent = `${name} · ${marked ? "MARKED IN THIS PAGE" : "NOT DOWNLOADED"}`;
  }));
  updateMessage(selectedMessage); applyWindowStates();
  if (!ids.includes(location.hash.slice(1))) history.replaceState(null, "", `#${ids[0]}`);
  showScreen(location.hash.slice(1));
})();
