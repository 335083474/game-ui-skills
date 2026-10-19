import assert from "node:assert/strict";
import { readFileSync, existsSync, writeFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { spawnSync } from "node:child_process";
import { runInNewContext } from "node:vm";
const root=dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/,"$1"));
const html=readFileSync(resolve(root,"index.html"),"utf8"),css=readFileSync(resolve(root,"style.css"),"utf8"),appPath=resolve(root,"app.js"),app=readFileSync(appPath,"utf8"),spec=JSON.parse(readFileSync(resolve(root,"screens.json"),"utf8"));
const checks=[];
const syntax=spawnSync(process.execPath,["--check",appPath],{encoding:"utf8"});assert.equal(syntax.status,0,syntax.stderr);checks.push("Node syntax: app.js parses cleanly.");
const ids=spec.screens.map(s=>s.id);assert.deepEqual(ids,["command-console","hero-inventory","quest-log"]);for(const id of ids){assert.match(html,new RegExp('id="'+id+'"'));assert.match(html,new RegExp('href="#'+id+'"'))}checks.push("Route/resource structure: all three frozen screen IDs have local sections and nav links.");
const refs=[...html.matchAll(/(?:href|src)="([^"]+)"/g)].map(m=>m[1]).filter(v=>v.startsWith("./"));for(const ref of refs)assert.ok(existsSync(resolve(root,ref.split("#")[0])),"Missing local resource: "+ref);
const atlas=readFileSync(resolve(root,"assets/symbol-atlas.svg"),"utf8");for(const m of html.matchAll(/symbol-atlas\.svg#([a-z-]+)/g))assert.match(atlas,new RegExp('<symbol id="'+m[1]+'"'));
assert.match(css,/:focus-visible/);assert.match(css,/max-width:480px/);assert.doesNotMatch(app,/\b(fetch|localStorage|sessionStorage|XMLHttpRequest)\b/);checks.push("Local resources: referenced files and atlas symbols exist; mobile/focus rules are present; no network or persistent-storage calls.");
const context={window:{}};runInNewContext(app,context,{filename:"app.js"});const demo=context.window.GameDemo;assert.ok(demo);
demo.reset();demo.dispatch("issue-order","Move to Old Bridge");assert.equal(demo.getState().order,"Move to Old Bridge");assert.equal(demo.getState().fieldPosition,"OLD BRIDGE");assert.match(demo.getState().orderStatus,/Captain Rowan · order issued/);assert.match(readFileSync(resolve(root,"app.js"),"utf8"),/data-position/);
demo.reset();demo.dispatch("select-item","Stormguard Shield");demo.dispatch("equip-item");assert.equal(demo.getState().equipped,"Stormguard Shield");assert.equal(demo.getState().defense,13);assert.equal(demo.getState().itemStatus,"Stormguard Shield equipped. Defense is now 13.");
demo.reset();assert.equal(demo.getState().gold,1240);demo.dispatch("claim-seal");assert.equal(demo.getState().gold,1240);demo.dispatch("mark-signal");demo.dispatch("claim-seal");assert.equal(demo.getState().signalProgress,3);assert.equal(demo.getState().gold,1420);assert.equal(demo.getState().claimed,true);assert.equal(demo.getState().questStatus,"Watchtower Seal claimed. Rowan receives 180 gold.");demo.dispatch("claim-seal");assert.equal(demo.getState().gold,1420);checks.push("State logic: command order/map position, shield equip/armor gain, and signal-gated one-time quest reward pass.");
const result={slug:"warcraft-iii",checkedAt:new Date().toISOString(),runtime:process.version,browserCheck:false,checks};writeFileSync(resolve(root,"verification-results.json"),JSON.stringify(result,null,2)+"\n");console.log(JSON.stringify(result,null,2));

