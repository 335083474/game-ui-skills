'use strict';
// Dependency-free checks of state, UI event wiring in a DOM stub, and local assets.
// This is not a browser renderer and cannot establish visual or accessibility QA.
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const crypto=require('node:crypto');
const root=__dirname;
// Evaluate the ordinary browser script in this CommonJS context without a DOM.
vm.runInThisContext(fs.readFileSync(path.join(root,'state.js'),'utf8'));
const api=globalThis.TableState;
const data=new Map();
const storage={getItem:k=>data.get(k)??null,setItem:(k,v)=>data.set(k,v)};
const model=api.createSettings(storage);
assert.deepEqual(model.saved,api.defaults);
model.update({volume:31,largeText:true,texture:false});
assert.equal(model.dirty,true);
assert.equal(model.save(),true);
assert.deepEqual(api.createSettings(storage).saved,{volume:31,largeText:true,texture:false});
model.update({volume:9,largeText:false});model.cancel();
assert.deepEqual(model.draft,{volume:31,largeText:true,texture:false});
model.restore();assert.deepEqual(model.draft,api.defaults);assert.equal(model.dirty,true);
model.cancel();assert.equal(model.draft.volume,31);
model.restore();model.save();assert.deepEqual(api.createSettings(storage).saved,api.defaults);
assert.deepEqual(api.normalize({volume:999,largeText:'yes',texture:null}),{volume:100,largeText:false,texture:true});
const failure=api.createSettings({getItem:()=>'{broken',setItem:()=>{throw Error('blocked');}});
assert.equal(failure.available,false);failure.update({volume:12});assert.equal(failure.save(),false);assert.equal(failure.dirty,true);
class Element{
  constructor(){this.children=[];this.listeners={};this.attributes={};this.disabled=false;this.value='';this.checked=false;this.hidden=false;this.textContent='';this.classes=new Set();this.classList={toggle:(name,on)=>on?this.classes.add(name):this.classes.delete(name)};}
  addEventListener(name,fn){this.listeners[name]=fn;}
  append(...nodes){this.children.push(...nodes);}
  replaceChildren(...nodes){this.children=nodes;}
  setAttribute(k,v){this.attributes[k]=v;}
  removeAttribute(k){delete this.attributes[k];}
  focus(){}
  click(){if(!this.disabled)this.listeners.click?.({target:this});}
}
const ids=[...fs.readFileSync(path.join(root,'index.html'),'utf8').matchAll(/id="([^"]+)"/g)].map(m=>m[1]);
assert.equal(new Set(ids).size,ids.length,'unique HTML ids');
const elements=Object.fromEntries(ids.map(id=>[id,new Element()]));
const body=new Element();const location={hash:'#dialogue'};const windowEvents={};
const context={TableState:api,location,document:{body,getElementById:id=>{assert.ok(elements[id],id);return elements[id];},createElement:()=>new Element()},window:{localStorage:storage,addEventListener:(key,fn)=>windowEvents[key]=fn}};
vm.runInNewContext(fs.readFileSync(path.join(root,'app.js'),'utf8'),context);
assert.equal(elements.choices.children.length,3);
assert.equal(elements['dialogue-back'].disabled,true);
const followups=new Set();const endings=new Set();
for(let i=0;i<3;i++){
  elements.choices.children[i].click();followups.add(elements['npc-line'].textContent);
  assert.equal(elements['dialogue-result'].classes.has('is-chosen'),true);
  assert.equal(elements.choices.children.length,1);
  elements.choices.children[0].click();endings.add(elements['npc-line'].textContent);
  elements['dialogue-back'].click();assert.equal(followups.has(elements['npc-line'].textContent),true);
  elements.restart.click();assert.equal(elements.choices.children.length,3);
}
assert.equal(followups.size,3);assert.equal(endings.size,3);
location.hash='#settings';windowEvents.hashchange();assert.equal(elements['settings-screen'].hidden,false);assert.equal(elements['dialogue-screen'].hidden,true);
elements['large-text'].checked=true;elements['large-text'].listeners.change({target:elements['large-text']});assert.equal(body.classes.has('large-text'),true);
elements['table-texture'].checked=false;elements['table-texture'].listeners.change({target:elements['table-texture']});assert.equal(body.classes.has('no-texture'),true);
elements['cancel-settings'].click();assert.equal(body.classes.has('large-text'),false);assert.equal(body.classes.has('no-texture'),false);
elements.volume.value='42';elements.volume.listeners.input({target:elements.volume});elements['settings-form'].listeners.submit({preventDefault(){}});assert.equal(api.createSettings(storage).saved.volume,42);
elements['restore-defaults'].click();assert.equal(elements.volume.value,70);assert.equal(api.createSettings(storage).saved.volume,42,'restore does not save until submit');elements['cancel-settings'].click();assert.equal(elements.volume.value,42);
location.hash='#dialogue';windowEvents.hashchange();assert.equal(elements['dialogue-screen'].hidden,false);
let checked=0;
for(const file of ['index.html','style.css','assets/components/theme.css']){
  const content=fs.readFileSync(path.join(root,file),'utf8');
  const references=file.endsWith('.html')?[...content.matchAll(/(?:src|href)="([^"]+)"/g)].map(m=>m[1]):[...content.matchAll(/url\(['"]?([^)'"\s]+)['"]?\)/g)].map(m=>m[1]);
  for(const ref of references){if(ref.startsWith('#'))continue;assert.ok(!/^(?:https?:|\/)/.test(ref),'offline relative resource: '+ref);assert.ok(fs.existsSync(path.resolve(root,path.dirname(file),ref)),file+' -> '+ref);checked++;}
}
const hash=file=>crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
// Locate the explicitly allowed frozen package only, without scanning other outputs.
const frozen='D:/SEA/game-ui-skills/skill-packages/balatro-ui';
for(const file of ['assets/components/theme.css','assets/components/felt.svg','assets/fonts/PixelifySans.ttf','assets/fonts/OFL.txt','assets/items-atlas.png','assets/tokens.json'])assert.equal(hash(path.join(root,file)),hash(path.join(frozen,file)),file+' copied unchanged');
console.log(JSON.stringify({state:'PASS',dialogueEventWiring:'PASS: 3 distinct branches, continue, back, restart',settingsEventWiring:'PASS: live classes, cancel, save, defaults draft',navigation:'PASS: hash route event wiring',localReferences:checked,copiedAssets:'PASS: 6 SHA-256 matches',browserRendering:'NOT TESTED'},null,2));
