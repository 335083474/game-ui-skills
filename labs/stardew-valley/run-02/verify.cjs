/* A deliberately small DOM harness: state checks only, not browser/layout QA. */
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const checks = [];
function test(name, fn) {fn(); checks.push({name, result:'pass'});}
class Element {
  constructor(id = '') {this.id=id;this.children=[];this.listeners={};this.hidden=false;this.disabled=false;this.checked=false;this.value='';this.textContent='';this.attrs={};this.classes=new Set();this.classList={toggle:(key,on)=>on?this.classes.add(key):this.classes.delete(key)};}
  append(...nodes) {this.children.push(...nodes);}
  replaceChildren(...nodes) {this.children=nodes;}
  addEventListener(name,fn) {(this.listeners[name]??=[]).push(fn);}
  setAttribute(name,value) {this.attrs[name]=value;}
  querySelector() {return this.children[0];}
  focus() {this.focused=true;}
  fire(name) {for (const fn of this.listeners[name]??[]) fn({target:this,preventDefault(){}});}
}
function boot(store = new Map(), hash='#dialogue', storageThrows=false) {
  const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
  const ids=Object.fromEntries([...html.matchAll(/id="([^"]+)"/g)].map(m=>[m[1],new Element(m[1])]));
  const listeners={};
  const ctx={document:{getElementById:id=>ids[id],createElement:()=>new Element(),body:new Element(),title:''},location:{hash},localStorage:{getItem:k=>{if(storageThrows)throw Error('blocked');return store.get(k)??null;},setItem:(k,v)=>{if(storageThrows)throw Error('blocked');store.set(k,v);}},addEventListener:(name,fn)=>{(listeners[name]??=[]).push(fn);}};
  ctx.window=ctx;vm.createContext(ctx);
  for(const f of ['model.js','app.js'])vm.runInContext(fs.readFileSync(path.join(__dirname,f),'utf8'),ctx,{filename:f});
  return {ctx,ids,store,route:hash=>{ctx.location.hash=hash;listeners.hashchange[0]();}};
}
test('Dialogue exposes three distinct reply branches, follow-ups and endings',()=>{
  const b=boot(), responses=b.ids.responses;
  assert.equal(responses.children.length,3);
  const replies=new Set(),endings=new Set();
  for(let i=0;i<3;i++) {
    responses.children[i].fire('click');replies.add(b.ids['npc-text'].textContent);
    assert.match(b.ids['choice-echo'].textContent,/You said/);assert.equal(b.ids['dialogue-actions'].hidden,false);
    b.ids['continue-dialogue'].fire('click');endings.add(b.ids['npc-text'].textContent);assert.equal(b.ids['continue-dialogue'].hidden,true);
    b.ids['back-dialogue'].fire('click');assert.equal(responses.children.length,3);assert.equal(responses.hidden,false);
  }
  assert.equal(replies.size,3);assert.equal(endings.size,3);
  responses.children[0].fire('click');b.ids['restart-dialogue'].fire('click');assert.equal(responses.hidden,false);
});
test('Settings preview changes DOM classes and unsaved marker',()=>{
  const b=boot();b.ids['large-text'].checked=true;b.ids['large-text'].fire('change');
  assert.ok(b.ctx.document.body.classes.has('large-text'));assert.equal(b.ids['save-marker'].textContent,'Unsaved preview');
  b.ids['reduce-motion'].checked=true;b.ids['reduce-motion'].fire('change');assert.ok(b.ctx.document.body.classes.has('reduce-motion'));
});
test('Save survives a new app boot using the same local storage',()=>{
  const store=new Map(), b=boot(store);
  b.ids.volume.value='23';b.ids.volume.fire('input');b.ids['large-text'].checked=true;b.ids['large-text'].fire('change');b.ids['settings-form'].fire('submit');
  assert.match(b.ids['settings-status'].textContent,/saved on this browser/);
  const reload=boot(store,'#settings');assert.equal(reload.ids.volume.value,23);assert.equal(reload.ids['large-text'].checked,true);assert.ok(reload.ctx.document.body.classes.has('large-text'));
});
test('Cancel restores saved volume and comfort settings',()=>{
  const b=boot();b.ids.volume.value='25';b.ids.volume.fire('input');b.ids['settings-form'].fire('submit');
  b.ids.volume.value='90';b.ids.volume.fire('input');b.ids['large-text'].checked=true;b.ids['large-text'].fire('change');b.ids['cancel-settings'].fire('click');
  assert.equal(b.ids.volume.value,25);assert.equal(b.ids['large-text'].checked,false);assert.equal(b.ids['save-settings'].disabled,true);
});
test('Restore defaults remains a draft until saved and can be cancelled',()=>{
  const b=boot();b.ids.volume.value='25';b.ids.volume.fire('input');b.ids['large-text'].checked=true;b.ids['large-text'].fire('change');b.ids['settings-form'].fire('submit');
  b.ids['restore-defaults'].fire('click');assert.equal(b.ids.volume.value,70);assert.equal(b.ids['large-text'].checked,false);
  assert.equal(JSON.parse([...b.store.values()][0]).volume,25);
  b.ids['cancel-settings'].fire('click');assert.equal(b.ids.volume.value,25);assert.equal(b.ids['large-text'].checked,true);
  b.ids['restore-defaults'].fire('click');b.ids['settings-form'].fire('submit');const reload=boot(b.store);assert.equal(reload.ids.volume.value,70);assert.equal(reload.ids['large-text'].checked,false);
});
test('Both hash routes navigate without losing the current conversation',()=>{
  const b=boot();b.ids.responses.children[1].fire('click');const speech=b.ids['npc-text'].textContent;
  b.route('#settings');assert.equal(b.ids['settings-screen'].hidden,false);assert.equal(b.ids['dialogue-screen'].hidden,true);
  b.route('#dialogue');assert.equal(b.ids['dialogue-screen'].hidden,false);assert.equal(b.ids['npc-text'].textContent,speech);
});
test('Unavailable storage reports failed save without claiming persistence',()=>{
  const b=boot(new Map(),'#settings',true);assert.match(b.ids['settings-status'].textContent,/could not be read/);
  b.ids.volume.value='2';b.ids.volume.fire('input');b.ids['settings-form'].fire('submit');assert.match(b.ids['settings-status'].textContent,/could not be saved/);assert.equal(b.ids['save-marker'].textContent,'Unsaved preview');
});
test('Malformed persisted values are safely normalized',()=>{
  const b=boot(new Map([['willowbrook.run02.preferences.v1','{"volume":500,"largeText":"yes","reduceMotion":true}']]));
  assert.equal(b.ids.volume.value,100);assert.equal(b.ids['large-text'].checked,false);assert.equal(b.ids['reduce-motion'].checked,true);
});
test('Every runtime file reference is local and resolves inside run-02',()=>{
  for(const filename of ['index.html','style.css','assets/components/theme.css']) {
    const source=fs.readFileSync(path.join(__dirname,filename),'utf8');
    assert.doesNotMatch(source,/(?:https?:)?\/\/[^\s"')]+/);
    const refs=filename.endsWith('.html') ? [...source.matchAll(/(?:src|href)="([^"]+)"/g)].map(m=>m[1]) : [...source.matchAll(/url\(["']?([^"')]+)["']?\)/g)].map(m=>m[1]);
    for(const ref of refs.filter(r=>!r.startsWith('#'))) {
      const target=path.resolve(__dirname,path.dirname(filename),ref);
      assert.ok(target.startsWith(path.resolve(__dirname)+path.sep));assert.ok(fs.existsSync(target),target);
    }
  }
});
const result={scope:'Node VM with minimal DOM mocks. This does not exercise a browser, layout, accessibility tree or real storage.',checks,passed:checks.length};
fs.writeFileSync(path.join(__dirname,'state-check-results.json'),JSON.stringify(result,null,2)+'\n');
console.log(JSON.stringify(result,null,2));
