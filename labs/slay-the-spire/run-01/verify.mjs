import assert from 'node:assert/strict';
import { readFile,writeFile,readdir } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import { initialState,validState,selectReward,claimReward,usePotion,potionReason,purchase,purchaseReason } from './state.mjs';
const results=[];
function test(name,fn){fn();results.push({name,status:'PASS'});}
test('Fresh state is valid and independent',()=>{const a=initialState(),b=initialState();a.inventory.potion=9;assert.equal(b.inventory.potion,2);assert(validState(b));});
test('Selection grants no reward; confirmation requires a choice',()=>{const s=initialState();assert(!claimReward(s).ok);selectReward(s,'coins');assert.equal(s.gold,125);assert.equal(s.claimed,false);});
test('Gold reward grants exactly once under 100 repeated activations',()=>{const s=initialState();selectReward(s,'coins');assert(claimReward(s).ok);for(let i=0;i<100;i++)assert(!claimReward(s).ok);assert.equal(s.gold,175);assert(!selectReward(s,'potion'));assert.equal(s.inventory.potion,2);});
test('Item rewards increment exactly their own inventory',()=>{for(const id of ['potion','crystal']){const s=initialState(),before=s.inventory[id];selectReward(s,id);assert(claimReward(s).ok);assert.equal(s.inventory[id],before+1);assert.equal(s.gold,125);}});
test('Claim survives a serialized session round trip',()=>{const s=initialState();selectReward(s,'potion');claimReward(s);const saved=JSON.parse(JSON.stringify(s));assert(validState(saved));assert(!claimReward(saved).ok);assert.equal(saved.inventory.potion,3);});
test('Near-max potion heals only 7 HP and consumes exactly one',()=>{const s=initialState();const r=usePotion(s);assert(r.ok);assert.equal(s.hp,65);assert.equal(s.inventory.potion,1);assert.match(r.message,/Recovered 7 HP/);});
test('Full HP blocks consumption with readable reason',()=>{const s=initialState();s.hp=65;assert.match(potionReason(s),/Health is full/);assert(!usePotion(s).ok);assert.equal(s.inventory.potion,2);});
test('Zero potions blocks healing with readable reason',()=>{const s=initialState();s.inventory.potion=0;assert.match(potionReason(s),/No draughts/);assert(!usePotion(s).ok);assert.equal(s.hp,58);});
test('Normal +20 heal and zero quantity after last use',()=>{const s=initialState();s.hp=10;s.inventory.potion=1;assert(usePotion(s).ok);assert.equal(s.hp,30);assert.equal(s.inventory.potion,0);assert(!usePotion(s).ok);});
test('Purchase subtracts price, adds item and reduces stock',()=>{const s=initialState();assert(purchase(s,'potion').ok);assert.equal(s.gold,90);assert.equal(s.inventory.potion,3);assert.equal(s.offers.potion.stock,1);});
test('Sold-out blocks repeated purchase without mutation',()=>{const s=initialState();purchase(s,'potion');purchase(s,'potion');assert.equal(s.gold,55);assert.equal(s.offers.potion.stock,0);const snapshot=JSON.stringify(s);assert.match(purchaseReason(s,'potion'),/Sold out/);for(let i=0;i<100;i++)assert(!purchase(s,'potion').ok);assert.equal(JSON.stringify(s),snapshot);});
test('Insufficient gold differs from sold-out and preserves state',()=>{const s=initialState(),snapshot=JSON.stringify(s);assert.match(purchaseReason(s,'relic'),/need 15 more/);assert(!purchase(s,'relic').ok);assert.equal(JSON.stringify(s),snapshot);});
test('Exact balance succeeds, then no negatives across every offer',()=>{const s=initialState();s.gold=35;assert(purchase(s,'potion').ok);assert.equal(s.gold,0);for(let i=0;i<50;i++)for(const id of Object.keys(s.offers))purchase(s,id);assert(s.gold>=0);assert(Object.values(s.offers).every(o=>o.stock>=0));});
test('Reward, purchase and potion share the same run data',()=>{const s=initialState();selectReward(s,'coins');claimReward(s);purchase(s,'relic');usePotion(s);assert.equal(s.gold,35);assert.equal(s.inventory.relic,1);assert.equal(s.hp,65);assert.equal(s.inventory.potion,1);assert(validState(s));});
test('Invalid restored states are rejected',()=>{for(const mutate of [s=>s.gold=-1,s=>s.hp=66,s=>s.inventory.potion=-1,s=>s.offers.relic.stock=99,s=>s.claimed=true,s=>s.selectedItemId='unknown']){const s=initialState();mutate(s);assert(!validState(s));}});
const root=path.dirname(fileURLToPath(import.meta.url));
const resources=[];
for(const filename of ['index.html','style.css','app.js','assets/components/theme.css']){
 const content=await readFile(path.join(root,filename),'utf8');
 const refs=filename.endsWith('.html')?[...content.matchAll(/(?:src|href)="([^"#]+)"/g)].map(m=>m[1]):filename.endsWith('.css')?[...content.matchAll(/url\(["']?([^\)"']+)["']?\)/g)].map(m=>m[1]):[...content.matchAll(/from ['"]([^'"]+)['"]/g)].map(m=>m[1]);
 for(const ref of refs){assert(!/^(https?:|data:|\/\/)/.test(ref),`Nonlocal runtime resource ${ref}`);const resolved=path.resolve(path.dirname(path.join(root,filename)),ref);assert(resolved.startsWith(root));await readFile(resolved);resources.push(`${filename} → ${ref}`);}
}
const atlas=await readFile(path.join(root,'assets/items-atlas.png'));
assert.equal(atlas.readUInt32BE(16),1536);assert.equal(atlas.readUInt32BE(20),1024);assert.equal(atlas[25],6);
for(const folder of ['alegreya-sc','crimson-text']){const files=await readdir(path.join(root,'assets/fonts',folder));assert(files.includes('OFL.txt'));assert.equal(files.filter(n=>n.endsWith('.ttf')).length,2);}
results.push({name:'All runtime resource references resolve locally; RGBA atlas is 1536×1024; four fonts and two OFL notices present',status:'PASS',references:resources});
const served=[];
for(const file of ['index.html','style.css','app.js','state.mjs','assets/items-atlas.png','assets/components/theme.css','assets/components/stone.svg','assets/components/paper.svg','assets/fonts/alegreya-sc/AlegreyaSC-Regular.ttf','assets/fonts/alegreya-sc/AlegreyaSC-Bold.ttf','assets/fonts/crimson-text/CrimsonText-Regular.ttf','assets/fonts/crimson-text/CrimsonText-Bold.ttf']){
 const url=`http://127.0.0.1:4173/labs/slay-the-spire/run-01/${file}`;
 const response=await fetch(url);assert.equal(response.status,200,url);const local=await readFile(path.join(root,file));const remote=Buffer.from(await response.arrayBuffer());assert.equal(createHash('sha256').update(remote).digest('hex'),createHash('sha256').update(local).digest('hex'));served.push(file);
}
results.push({name:'Existing HTTP server returns byte-identical runtime resources',status:'PASS',files:served});
const report={executedAt:new Date().toISOString(),runner:process.version,scope:'Node state tests, filesystem resource inspection and HTTP fetch only; no browser rendering or browser interaction',checks:results};
await writeFile(path.join(root,'checks.json'),JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify({checks:results.length,status:'PASS',browser:'NOT EXECUTED',report:'checks.json'},null,2));
