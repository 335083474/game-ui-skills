(() => {
  const ids = ["scanner", "specimen-catalog", "field-log"];
  const returns = [
    { id: "R-01", label: "ridge", x: 156, y: 248, coordinate: "(03,11)", className: "r01" },
    { id: "R-02", label: "moving speck", x: 361, y: 232, coordinate: "(04,12)", className: "r02" },
    { id: "R-03", label: "hollow", x: 641, y: 182, coordinate: "(05,13)", className: "r03" }
  ];
  const samples = {
    "S-01": { name: "Ribbon glider", tag: "OBSERVATION / DRIFTING", coordinate: "(03,11)", art: "sample-art-ribbon", note: "Ribbon-like drift aligned with the eastern current." },
    "S-02": { name: "Glass cup", tag: "OBSERVATION / TRANSLUCENT", coordinate: "(04,12)", art: "sample-art-glass", note: "Clear cup shell; returning blue edge." },
    "S-03": { name: "Dapple float", tag: "OBSERVATION / UNCLASSIFIED", coordinate: "(05,13)", art: "sample-art-float", note: "Pale edge response; shape not classified." }
  };
  const records = [
    { time: "08:12", coordinate: "(03,11)", observation: "Cyan return behind the shelf.", interpretation: "Possible ridge turbulence; unconfirmed." },
    { time: "08:19", coordinate: "(04,12)", observation: "Ellery's suit marker moved east.", interpretation: "The marker may follow the yellow route; unconfirmed." },
    { time: "08:26", coordinate: "(05,13)", observation: "Route ended at an uncharted contour.", interpretation: "A hollow could lie beyond the visible shelf; unconfirmed." }
  ];
  let selectedReturn = "R-01";
  let selectedSample = "S-01";
  let selectedRecord = 0;
  const markedReturns = new Set();
  const notes = Object.fromEntries(Object.entries(samples).map(([id, sample]) => [id, sample.note]));
  const showScreen = (id) => {
    const target = ids.includes(id) ? id : ids[0];
    document.querySelectorAll(".screen").forEach((screen) => { screen.hidden = screen.id !== target; });
    document.querySelectorAll(".screen-nav a").forEach((link) => link.hash === `#${target}` ? link.setAttribute("aria-current", "page") : link.removeAttribute("aria-current"));
  };
  const setRoute = (id) => { if (location.hash !== `#${id}`) location.hash = id; else showScreen(id); };
  const drawReturnHotspots = () => {
    const host = document.getElementById("return-targets");
    returns.forEach((item) => {
      const button = document.createElement("button");
      button.type = "button"; button.className = "return-hotspot";
      button.style.left = `${item.x / 7.2}%`; button.style.top = `${item.y / 3.8}%`;
      button.dataset.return = item.id; button.setAttribute("aria-label", "Locate " + item.id + " " + item.label + " on map");
      button.setAttribute("aria-pressed", String(item.id === selectedReturn));
      button.addEventListener("click", () => selectReturn(item.id));
      host.appendChild(button);
    });
  };
  const selectReturn = (id) => {
    selectedReturn = id;
    const item = returns.find((value) => value.id === id);
    document.querySelectorAll(".return-choice").forEach((button) => {
      const active = button.dataset.return === id;
      button.classList.toggle("is-selected", active); button.setAttribute("aria-pressed", String(active));
    });
    document.querySelectorAll(".return-hotspot").forEach((button) => button.setAttribute("aria-pressed", String(button.dataset.return === id)));
    document.getElementById("coordinate-readout").textContent = `${item.id} / ${item.coordinate} · SYNTHETIC`;
    document.getElementById("scan-feedback").textContent = `${item.id} / ${item.label.toUpperCase()} · COORDINATE ${item.coordinate}`;
    const isMarked = markedReturns.has(id);
    document.getElementById("mark-return").textContent = isMarked ? "Remove local note mark" : "Mark return in local notes";
  };
  const selectSample = (id) => {
    selectedSample = id;
    const sample = samples[id];
    document.querySelectorAll(".specimen-choice").forEach((button) => {
      const active = button.dataset.sample === id; button.classList.toggle("is-selected", active); button.setAttribute("aria-pressed", String(active));
    });
    document.getElementById("sample-code").textContent = `${id} / FICTION`;
    document.getElementById("sample-name").textContent = sample.name;
    document.getElementById("sample-tag").textContent = sample.tag;
    document.getElementById("sample-coordinate").innerHTML = `${sample.coordinate}<small>DEMO COORD.</small>`;
    document.querySelectorAll(".sample-art").forEach((art) => { art.toggleAttribute("hidden", art.id !== sample.art); });
    document.getElementById("specimen-note").value = notes[id];
    document.getElementById("note-feedback").textContent = "NOT SAVED / LOCAL EDIT";
  };
  const selectRecord = (index) => {
    selectedRecord = index;
    const record = records[index];
    document.querySelectorAll(".log-entry").forEach((button) => {
      const active = Number(button.dataset.log) === index; button.classList.toggle("is-selected", active); button.setAttribute("aria-pressed", String(active));
    });
    document.getElementById("selected-observation").textContent = record.observation;
    document.getElementById("selected-interpretation").textContent = record.interpretation;
    document.getElementById("log-feedback").textContent = `RECORD ${record.time} / OBSERVATION AND INTERPRETATION ARE SEPARATE`;
  };

  drawReturnHotspots();
  document.querySelectorAll(".return-choice").forEach((button) => button.addEventListener("click", () => selectReturn(button.dataset.return)));
  document.getElementById("mark-return").addEventListener("click", () => {
    const item = returns.find((value) => value.id === selectedReturn);
    if (markedReturns.has(selectedReturn)) {
      markedReturns.delete(selectedReturn);
      document.getElementById("scan-feedback").textContent = `${item.id} LOCAL NOTE MARK REMOVED`;
    } else {
      markedReturns.add(selectedReturn);
      document.getElementById("scan-feedback").textContent = `${item.id} MARKED IN LOCAL NOTES`;
    }
    document.getElementById("mark-return").textContent = markedReturns.has(selectedReturn) ? "Remove local note mark" : "Mark return in local notes";
  });
  document.querySelectorAll(".specimen-choice").forEach((button) => button.addEventListener("click", () => selectSample(button.dataset.sample)));
  document.getElementById("save-specimen-note").addEventListener("click", () => {
    notes[selectedSample] = document.getElementById("specimen-note").value.trim();
    document.getElementById("note-feedback").textContent = `NOTE SAVED TO THIS PAGE · ${selectedSample}`;
  });
  document.querySelectorAll(".log-entry").forEach((button) => button.addEventListener("click", () => selectRecord(Number(button.dataset.log))));
  document.getElementById("add-log-note").addEventListener("click", () => {
    const value = document.getElementById("interpretation-note").value.trim();
    if (!value) {
      document.getElementById("log-feedback").textContent = "ENTER A LOCAL INTERPRETATION FIRST";
      return;
    }
    records[selectedRecord].interpretation = value;
    document.getElementById("selected-interpretation").textContent = value;
    document.getElementById("interpretation-note").value = "";
    document.getElementById("log-feedback").textContent = `LOCAL NOTE ADDED TO ${records[selectedRecord].time} ENTRY.`;
  });
  document.querySelectorAll(".screen-nav a").forEach((link) => link.addEventListener("click", () => showScreen(link.hash.slice(1))));
  window.addEventListener("hashchange", () => showScreen(location.hash.slice(1)));
  selectReturn(selectedReturn); selectSample(selectedSample); selectRecord(selectedRecord);
  if (!ids.includes(location.hash.slice(1))) history.replaceState(null, "", `#${ids[0]}`);
  showScreen(location.hash.slice(1));
})();
