/* Node-only functional/resource checks. This does not exercise a browser. */
'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const crypto=require('node:crypto');
require('./engine.js');
const E=globalThis.EmeraldDemo;
const results=[];
function test(name,fn){fn();results.push({name,pass:true});}
function snap(s){return JSON.stringify({party:s.party,inventory:s.inventory,battle:s.battle});}
function sameOnReject(s,fn){const old=snap(s);assert.equal(fn().ok,false);assert.equal(snap(s),old);}
test('Initial model, IDs, HP, inventory and PP satisfy invariant checks',()=>{
  const s=E.createState();assert.deepEqual(E.validate(s),[]);assert.equal(s.party[0].hp,24);assert.equal(s.inventory.potion,3);
});
test('Potion caps at max HP and stock commits once; repeat full-HP use is inert',()=>{
  const s=E.createState();const r=E.heal(s,'potion','leaf');assert.equal(r.message,'LEAFLET recovered 12 HP.');assert.equal(s.party[0].hp,36);assert.equal(s.inventory.potion,2);sameOnReject(s,()=>E.heal(s,'potion','leaf'));
  s.party[0].hp=30;E.heal(s,'potion','leaf');assert.equal(s.party[0].hp,36);assert.equal(s.inventory.potion,1);
});
test('Full HP, fainted, unknown target, unsupported effect, zero stock are inert',()=>{
  const s=E.createState();sameOnReject(s,()=>E.heal(s,'potion','fire'));sameOnReject(s,()=>E.heal(s,'potion','water'));sameOnReject(s,()=>E.heal(s,'potion','missing'));sameOnReject(s,()=>E.heal(s,'remedy','leaf'));s.inventory.potion=0;sameOnReject(s,()=>E.heal(s,'potion','leaf'));
});
test('Tonic heals ten capped and decrements only its own stock',()=>{
  const s=E.createState();E.heal(s,'tonic','leaf');assert.equal(s.party[0].hp,34);assert.equal(s.inventory.tonic,1);E.heal(s,'tonic','leaf');assert.equal(s.party[0].hp,36);assert.equal(s.inventory.tonic,0);assert.equal(s.inventory.potion,3);
});
test('Attack at one PP spends once, deals declared damage and gets one response',()=>{
  const s=E.createState();const m=s.party[0].moves.find(x=>x.id==='quick-hit');E.attack(s,m.id);assert.equal(m.pp,0);assert.equal(s.battle.enemy.hp,26);assert.equal(s.party[0].hp,19);assert.equal(s.battle.turn,1);assert.equal(s.battle.messages.length,2);sameOnReject(s,()=>E.attack(s,m.id));E.acknowledge(s);sameOnReject(s,()=>E.attack(s,m.id));
});
test('No PP changes no HP/stock/PP/turn; message opening and cancellation are inert',()=>{
  const s=E.createState();s.battle.phase='moves';const old=snap(s);sameOnReject(s,()=>E.attack(s,'seed-shot'));assert.equal(snap(s),old);s.battle.phase='command';assert.equal(s.party[0].moves[0].pp,14);assert.equal(s.battle.turn,0);
});
test('Killing blow skips enemy response, terminal battle blocks further damage',()=>{
  const s=E.createState();s.battle.enemy.hp=7;E.attack(s,'tackle');assert.equal(s.battle.enemy.hp,0);assert.equal(s.party[0].hp,24);assert.equal(s.battle.outcome,'won');assert.equal(s.battle.turn,1);E.acknowledge(s);assert.equal(s.battle.phase,'won');sameOnReject(s,()=>E.attack(s,'tackle'));sameOnReject(s,()=>E.run(s));
});
test('Battle medicine commits one heal, one stock, one turn and one enemy response',()=>{
  const s=E.createState();E.heal(s,'potion','leaf','battle');assert.equal(s.party[0].hp,31);assert.equal(s.inventory.potion,2);assert.equal(s.battle.turn,1);assert.equal(s.battle.enemy.hp,30);sameOnReject(s,()=>E.heal(s,'potion','leaf','battle'));
});
test('Switch rejects current/FNT; living reserve becomes active and receives response',()=>{
  const s=E.createState();sameOnReject(s,()=>E.switchBattler(s,'leaf'));sameOnReject(s,()=>E.switchBattler(s,'water'));E.switchBattler(s,'fire');assert.equal(s.battle.activeId,'fire');assert.equal(s.party[1].hp,35);assert.equal(s.party[0].hp,24);assert.equal(s.battle.turn,1);
});
test('Zero active HP marks FNT and blocks moves until valid switch',()=>{
  const s=E.createState();s.party[0].hp=5;E.attack(s,'tackle');assert.equal(s.party[0].hp,0);assert.equal(s.party[0].status,'FNT');assert.equal(s.battle.outcome,null);E.acknowledge(s);sameOnReject(s,()=>E.attack(s,'tackle'));E.switchBattler(s,'fire');assert.equal(s.battle.activeId,'fire');assert.equal(s.battle.turn,2);assert.deepEqual(E.validate(s),[]);
});
test('Last living member fainting produces loss and suppresses later actions',()=>{
  const s=E.createState();s.party[0].hp=5;s.party[1].hp=0;s.party[1].status='FNT';E.attack(s,'tackle');assert.equal(s.battle.outcome,'lost');E.acknowledge(s);assert.equal(s.battle.phase,'lost');sameOnReject(s,()=>E.run(s));assert.deepEqual(E.validate(s),[]);
});
test('First Run fails with one response; second escapes with no response',()=>{
  const s=E.createState();E.run(s);assert.equal(s.battle.escapeAttempts,1);assert.equal(s.party[0].hp,19);assert.equal(s.battle.turn,1);E.acknowledge(s);E.run(s);assert.equal(s.battle.escapeAttempts,2);assert.equal(s.battle.outcome,'escaped');assert.equal(s.party[0].hp,19);assert.equal(s.battle.turn,2);E.acknowledge(s);sameOnReject(s,()=>E.attack(s,'tackle'));
});
test('canEscape=false always fails, taking exactly one response each time',()=>{
  const s=E.createState();s.battle.canEscape=false;E.run(s);E.acknowledge(s);E.run(s);assert.equal(s.battle.outcome,null);assert.equal(s.party[0].hp,14);assert.equal(s.battle.turn,2);
});
test('Source/local runtime paths resolve; no remote runtime requests',()=>{
  const files=['index.html','style.css','app.js','engine.js','assets/components/theme.css'];
  for(const f of files){const text=fs.readFileSync(path.join(__dirname,f),'utf8');assert.ok(!/https?:\/\//.test(text),f+' remote URL');for(const match of text.matchAll(/(?:src|href)="([^"#]+)"|url\(['"]?([^'"\)]+)['"]?\)/g)){const ref=match[1]||match[2];if(ref.startsWith('${'))continue;assert.ok(fs.existsSync(path.resolve(path.dirname(path.join(__dirname,f)),ref)),f+' -> '+ref);}}
});
test('Copied font, CSS, both PNGs and original licenses match frozen input SHA-256',()=>{
  const input=process.argv[2];assert.ok(input,'Pass frozen Skill path as argument');
  const files=['assets/components/theme.css','assets/fonts/PixelifySans.ttf','assets/fonts/OFL.txt','assets/sprites/tiny-creatures.png','assets/sprites/tiny-dungeon.png','assets/licenses/tiny-creatures-License.txt','assets/licenses/tiny-dungeon-License.txt'];
  const sha=p=>crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
  for(const f of files)assert.equal(sha(path.join(__dirname,f)),sha(path.join(input,f)),f);
});
test('PNG dimensions/indexed transparency match source atlas contract',()=>{
  for(const [f,w,h] of [['tiny-creatures.png',160,288],['tiny-dungeon.png',192,176]]){const p=fs.readFileSync(path.join(__dirname,'assets/sprites',f));assert.equal(p.readUInt32BE(16),w);assert.equal(p.readUInt32BE(20),h);assert.equal(p[25],3);assert.ok(p.includes(Buffer.from('tRNS')));}
});
const output={scope:'Node-only model and static resource verification. No browser QA.',passed:results.length,results};
fs.writeFileSync(path.join(__dirname,'checks.json'),JSON.stringify(output,null,2)+'\n');
console.log(JSON.stringify(output,null,2));
