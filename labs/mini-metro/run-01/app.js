(() => {
  const ids = ["route-editor", "capacity-upgrade", "day-results"];
  const stations = [
    { name: "Mill", x: 105, y: 390, shape: "circle" }, { name: "Yard", x: 235, y: 325, shape: "square" },
    { name: "Market", x: 365, y: 325, shape: "triangle" }, { name: "Transfer 05", x: 495, y: 195, shape: "circle" },
    { name: "Junction", x: 625, y: 195, shape: "diamond" }, { name: "North Square", x: 755, y: 130, shape: "square" },
    { name: "Pier", x: 885, y: 130, shape: "circle" }, { name: "Vista", x: 1015, y: 65, shape: "triangle" },
    { name: "North", x: 1110, y: 65, shape: "circle" }, { name: "Queue", x: 625, y: 325, shape: "circle" }
  ];
  const state = { day: 18, line: "blue", start: null, end: null, routeSegments: [], upgrade: "carriage", tokens: 2, links: 3, passengers: 1284, queue: 37 };
  const root = document.getElementById("app");
  const showScreen = (id) => {
    const target = ids.includes(id) ? id : ids[0];
    document.querySelectorAll(".screen").forEach((screen) => { screen.hidden = screen.id !== target; });
    document.querySelectorAll(".screen-nav a").forEach((link) => link.hash === `#${target}` ? link.setAttribute("aria-current", "page") : link.removeAttribute("aria-current"));
  };
  const stationByName = (name) => stations.find((station) => station.name === name);
  const drawHotspots = () => {
    const host = document.getElementById("route-hotspots");
    stations.forEach((station) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "station-hit";
      button.dataset.station = station.name;
      button.dataset.shape = station.shape;
      button.setAttribute("aria-label", `Station ${station.name}`);
      button.setAttribute("aria-pressed", "false");
      button.style.left = `${station.x / 12}%`;
      button.style.top = `${station.y / 5.2}%`;
      button.addEventListener("click", () => selectStation(station.name));
      host.appendChild(button);
    });
  };
  const lineColors = { blue: "#427fc2", red: "#d9584b", yellow: "#d2a929" };
  const setRouteLineColor = () => {
    document.querySelectorAll(".draft-path").forEach((path) => { path.style.stroke = lineColors[state.line]; });
  };
  const updateRouteDrawings = () => {
    const paths = state.routeSegments.map((segment) => {
      const start = stationByName(segment.start); const end = stationByName(segment.end);
      return { d: `M ${start.x} ${start.y} L ${end.x} ${end.y}`, line: segment.line };
    });
    const committed = document.getElementById("committed-routes");
    committed.replaceChildren();
    paths.forEach((segment) => {
      const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
      path.setAttribute("d", segment.d); path.setAttribute("fill", "none"); path.setAttribute("stroke", lineColors[segment.line]);
      path.setAttribute("stroke-width", "11"); path.setAttribute("stroke-linecap", "round"); path.setAttribute("stroke-linejoin", "round");
      committed.appendChild(path);
    });
    const draftStart = stationByName(state.start); const draftEnd = stationByName(state.end);
    document.getElementById("draft-route").setAttribute("d", draftStart && draftEnd ? `M ${draftStart.x} ${draftStart.y} L ${draftEnd.x} ${draftEnd.y}` : "");
    document.querySelectorAll(".station-hit").forEach((button) => button.setAttribute("aria-pressed", String(button.dataset.station === state.start || button.dataset.station === state.end)));
    const screen = document.getElementById("route-editor");
    const ready = Boolean(state.start && state.end);
    screen.classList.toggle("draft-ready", ready);
    document.getElementById("apply-route").disabled = !ready;
    document.getElementById("cancel-route").disabled = !state.start;
    setRouteLineColor();
  };
  const selectStation = (name) => {
    if (!state.start || (state.start && state.end)) {
      state.start = name; state.end = null;
      document.getElementById("route-feedback").textContent = `START AT ${name.toUpperCase()} · CHOOSE AN END STATION`;
    } else if (name === state.start) {
      document.getElementById("route-feedback").textContent = `START IS ${name.toUpperCase()} · CHOOSE A DIFFERENT STATION`;
    } else {
      state.end = name;
      document.getElementById("route-feedback").textContent = `DRAFT: ${state.start.toUpperCase()} → ${name.toUpperCase()} · APPLY TO LOCAL MAP`;
    }
    updateRouteDrawings();
  };
  const setUpgrade = (button) => {
    state.upgrade = button.dataset.upgrade;
    document.querySelectorAll(".token-option").forEach((option) => {
      const selected = option === button;
      option.classList.toggle("is-selected", selected);
      option.setAttribute("aria-pressed", String(selected));
    });
    const labels = { carriage: "CARRIAGE CAPACITY", signal: "SIGNAL FREQUENCY", interchange: "INTERCHANGE LINKS" };
    document.getElementById("capacity-feedback").textContent = `SELECTED: ${labels[state.upgrade]}`;
    document.getElementById("upgrade-feedback").textContent = "NO RESOURCE SPENT · CHOICE IS A PREVIEW";
  };
  const updateDay = () => {
    document.getElementById("route-day").textContent = String(state.day);
    document.getElementById("results-day").textContent = String(state.day);
    document.getElementById("advance-day").textContent = `Advance to day ${state.day + 1} ↗`;
    document.getElementById("advance-day").setAttribute("aria-label", `Advance to day ${state.day + 1}`);
    document.getElementById("passenger-count").textContent = state.passengers.toLocaleString("en-US");
    document.getElementById("queue-count").textContent = `${state.queue} PEOPLE`;
  };

  drawHotspots();
  document.getElementById("active-line").addEventListener("change", (event) => {
    state.line = event.currentTarget.value;
    document.getElementById("route-feedback").textContent = `${state.line.toUpperCase()} LINE SELECTED · ROUTE CHANGES ARE A LOCAL PREVIEW`;
    setRouteLineColor();
  });
  document.getElementById("apply-route").addEventListener("click", () => {
    if (!state.start || !state.end) return;
    state.routeSegments.push({ start: state.start, end: state.end, line: state.line });
    const message = `${state.line.toUpperCase()} ROUTE APPLIED • ${state.start.toUpperCase()} → ${state.end.toUpperCase()}`;
    state.start = null; state.end = null;
    document.getElementById("route-feedback").textContent = message;
    updateRouteDrawings();
  });
  document.getElementById("cancel-route").addEventListener("click", () => {
    state.start = null; state.end = null;
    document.getElementById("route-feedback").textContent = "DRAFT CLEARED · NETWORK RESTORED";
    updateRouteDrawings();
  });
  document.querySelectorAll(".token-option").forEach((button) => button.addEventListener("click", () => setUpgrade(button)));
  document.getElementById("reserve-upgrade").addEventListener("click", () => {
    if (!state.tokens) {
      document.getElementById("upgrade-feedback").textContent = "NO TOKENS REMAIN · NOTHING CHANGED";
      return;
    }
    state.tokens -= 1;
    if (state.upgrade === "interchange") {
      const before = state.links; state.links += 1;
      document.getElementById("link-count").textContent = String(state.links);
      document.getElementById("upgrade-feedback").textContent = `TRANSFER 05 CAPACITY • ${before} → ${state.links} LINKS`;
    } else if (state.upgrade === "carriage") {
      document.getElementById("upgrade-feedback").textContent = "TRANSFER 05 CAPACITY • +2 SEATS PER TRAIN";
    } else {
      document.getElementById("upgrade-feedback").textContent = "TRANSFER 05 CAPACITY • +1 TRAIN ON BLUE LINE";
    }
    document.getElementById("token-count").textContent = String(state.tokens).padStart(2, "0");
  });
  document.getElementById("advance-day").addEventListener("click", () => {
    state.day += 1; state.passengers += 46; state.queue = Math.max(12, state.queue - 3);
    updateDay();
    document.getElementById("advance-feedback").textContent = `DAY ${state.day} READY • LOCAL DEMO`;
  });
  document.querySelectorAll(".screen-nav a").forEach((link) => link.addEventListener("click", () => showScreen(link.hash.slice(1))));
  window.addEventListener("hashchange", () => showScreen(location.hash.slice(1)));
  updateRouteDrawings(); updateDay();
  if (!ids.includes(location.hash.slice(1))) history.replaceState(null, "", `#${ids[0]}`);
  showScreen(location.hash.slice(1));
})();
