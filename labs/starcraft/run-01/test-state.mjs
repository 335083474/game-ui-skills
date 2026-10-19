import assert from "node:assert/strict";
import { readFileSync, existsSync, writeFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { spawnSync } from "node:child_process";
import { runInNewContext } from "node:vm";
const root=dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/,"$1"));
const html=readFileSync(resolve(root,"index.html"),"utf8"),css=readFileSync(resolve(root,"style.css"),"utf8"),appPath=resolve(root,"app.js"),app=readFileSync(appPath,"utf8"),spec=JSON.parse(readFileSync(resolve(root,"screens.json"),"utf8"));
const checks=[];
const syntax=spawnSync(process.execPath,["--check",appPath],{encoding:"utf8"});assert.equal(syntax.status,0,syntax.stderr);checks.push("Node syntax: app.js parses cleanly.");
const ids=spec.screens.map(s=>s.id);assert.deepEqual(ids,["command-console","unit-roster","mission-brief"]);for(const id of ids){assert.match(html,new RegExp('id="'+id+'"'));assert.match(html,new RegExp('href="#'+id+'"'))}checks.push("Route/resource structure: all three approved routes are present.");
const refs=[...html.matchAll(/(?:href|src)="([^"]+)"/g)].map(m=>m[1]).filter(v=>v.startsWith("./"));for(const ref of refs)assert.ok(existsSync(resolve(root,ref.split("#")[0])),"Missing local resource: "+ref);
const atlas=readFileSync(resolve(root,"assets/symbol-atlas.svg"),"utf8");for(const m of html.matchAll(/symbol-atlas\.svg#([a-z-]+)/g))assert.match(atlas,new RegExp('<symbol id="'+m[1]+'"'));
assert.match(css,/:focus-visible/);assert.match(css,/max-width:480px/);assert.doesNotMatch(app,/\b(fetch|localStorage|sessionStorage|XMLHttpRequest)\b/);checks.push("Local resources: local file and atlas-symbol checks, mobile/focus rules, and no network or persistence calls pass.");
const context={window:{}};runInNewContext(app,context,{filename:"app.js"});const demo=context.window.GameDemo;assert.ok(demo);
demo.reset();demo.dispatch("issue-order","Move to North Ridge");assert.equal(demo.getState().order,"Moving to North Ridge");assert.equal(demo.getState().fieldPosition,"NORTH RIDGE");assert.equal(demo.getState().fieldUpdate,"Marine / Rook-03 · order transmitted: Moving to North Ridge.");
demo.reset();demo.dispatch("select-unit","Firebat / Torch-02");demo.dispatch("assign-bravo");assert.equal(demo.getState().assignment,"BRAVO / WEST RIDGE");assert.equal(demo.getState().bravoCount,3);assert.match(demo.getState().assignmentStatus,/Firebat \/ Torch-02 assigned/);
demo.reset();demo.dispatch("launch");assert.equal(demo.getState().launched,false);demo.dispatch("confirm-brief");demo.dispatch("launch");assert.equal(demo.getState().launched,true);assert.equal(demo.getState().briefStatus,"Operation Glass Harbor launched. Field comms are live.");assert.equal(demo.getState().launchCue,"TRANSMISSION LIVE · Echo relay secured");checks.push("State logic: field orders update map sector, roster selection/squad assignment, and confirm-before-launch gate pass.");
const result={slug:"starcraft",checkedAt:new Date().toISOString(),runtime:process.version,browserCheck:false,checks};writeFileSync(resolve(root,"verification-results.json"),JSON.stringify(result,null,2)+"\n");console.log(JSON.stringify(result,null,2));

