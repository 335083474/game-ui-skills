import assert from "node:assert/strict";
import { readFileSync, existsSync, writeFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { spawnSync } from "node:child_process";
import { runInNewContext } from "node:vm";

const root = dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1"));
const html = readFileSync(resolve(root, "index.html"), "utf8");
const css = readFileSync(resolve(root, "style.css"), "utf8");
const appPath = resolve(root, "app.js");
const app = readFileSync(appPath, "utf8");
const spec = JSON.parse(readFileSync(resolve(root, "screens.json"), "utf8"));
const checks = [];

const syntax = spawnSync(process.execPath, ["--check", appPath], { encoding: "utf8" });
assert.equal(syntax.status, 0, syntax.stderr);
checks.push("Node syntax: app.js parses cleanly.");

const ids = spec.screens.map(screen => screen.id);
assert.deepEqual(ids, ["inventory", "crafting", "equipment"]);
for (const id of ids) {
  assert.match(html, new RegExp('id="' + id + '"'));
  assert.match(html, new RegExp('href="#' + id + '"'));
}
checks.push("Route/resource structure: three approved IDs have screen sections and navigation links.");

const assetRefs = [...html.matchAll(/(?:href|src)="([^"]+)"/g)].map(match => match[1]).filter(value => value.startsWith("./"));
for (const reference of assetRefs) {
  const localPath = reference.split("#")[0];
  assert.ok(existsSync(resolve(root, localPath)), "Missing local resource: " + reference);
}
const atlas = readFileSync(resolve(root, "assets/symbol-atlas.svg"), "utf8");
for (const match of html.matchAll(/symbol-atlas\.svg#([a-z-]+)/g)) assert.match(atlas, new RegExp('<symbol id="' + match[1] + '"'));
assert.match(css, /:focus-visible/);
assert.match(css, /max-width:420px/);
assert.doesNotMatch(app, /\b(fetch|localStorage|sessionStorage|XMLHttpRequest)\b/);
checks.push("Local resources: every local href/src exists, every referenced atlas symbol exists, mobile and focus rules are present, and app.js has no network or persistence calls.");

const context = { window: {} };
runInNewContext(app, context, { filename: "app.js" });
const demo = context.window.GameDemo;
assert.ok(demo, "GameDemo state API is exposed for this DOM-free check.");
demo.reset();
demo.dispatch("inspect", "Moon Ore");
demo.dispatch("equip-tool");
assert.equal(demo.getState().tool, "Moon Ore");
assert.equal(demo.getState().toolStatus, "Moon Ore assigned to the quickbar tool slot.");
demo.reset();
demo.dispatch("craft-flask");
assert.deepEqual({ gel: demo.getState().gel, root: demo.getState().root, flasks: demo.getState().flasks }, { gel: 4, root: 0, flasks: 1 });
assert.equal(demo.getState().craftStatus, "Crafted 1 Glowroot Flask. Gel 4, Glowroot 0.");
demo.dispatch("craft-flask");
assert.equal(demo.getState().flasks, 1, "Unavailable recipe must not craft.");
demo.reset();
demo.dispatch("equip-helm");
assert.deepEqual({ head: demo.getState().head, defense: demo.getState().defense }, { head: "Cobalt Helm", defense: 9 });
checks.push("State logic: tool assignment, ingredient consumption/output, no-craft disabled budget, and armor replacement/defense gain pass.");

const result = { slug: "terraria", checkedAt: new Date().toISOString(), runtime: process.version, browserCheck: false, checks };
writeFileSync(resolve(root, "verification-results.json"), JSON.stringify(result, null, 2) + "\n");
console.log(JSON.stringify(result, null, 2));
