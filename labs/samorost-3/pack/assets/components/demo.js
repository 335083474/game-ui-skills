"use strict";

const combineGroup = document.querySelector("[data-combine-group]");
const objectButtons = Array.from(combineGroup.querySelectorAll("[data-object]"));
const combineMessage = document.getElementById("combine-status");
objectButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const selected = button.getAttribute("aria-pressed") === "true";
    button.setAttribute("aria-pressed", String(!selected));
    const count = objectButtons.filter((item) => item.getAttribute("aria-pressed") === "true").length;
    combineMessage.textContent = count + " object" + (count === 1 ? "" : "s") + " selected. Choose two, then try the pair.";
  });
});

document.getElementById("combine-button").addEventListener("click", () => {
  const selected = objectButtons.filter((item) => item.getAttribute("aria-pressed") === "true");
  if (selected.length !== 2) {
    combineMessage.textContent = "Select exactly two objects before combining.";
    return;
  }
  combineMessage.textContent = selected.map((item) => item.dataset.name).join(" + ") + " tried in this local specimen; result remains unknown.";
});

const hintToggle = document.getElementById("hint-toggle");
const hintCopy = document.getElementById("hint-copy");
hintToggle.addEventListener("click", () => {
  const expanded = hintToggle.getAttribute("aria-expanded") === "true";
  hintToggle.setAttribute("aria-expanded", String(!expanded));
  hintCopy.hidden = expanded;
  hintToggle.textContent = expanded ? "Show picture clue" : "Hide picture clue";
});

const planetGroup = document.querySelector(".orbit[data-select-group]");
const worlds = Array.from(planetGroup.querySelectorAll("[data-select]"));
const routeMessage = planetGroup.parentElement.querySelector("[data-message]");
const routeButton = planetGroup.parentElement.querySelector("[data-apply]");
let selectedWorld = null;
worlds.forEach((world) => {
  world.addEventListener("click", () => {
    selectedWorld = world;
    worlds.forEach((item) => item.setAttribute("aria-pressed", String(item === world)));
    routeMessage.textContent = world.dataset.name + " selected as a route preview.";
  });
});
routeButton.addEventListener("click", () => {
  routeMessage.textContent = selectedWorld
    ? selectedWorld.dataset.name + " set in this local specimen. No game data was saved."
    : "Choose a world before setting the route.";
});
