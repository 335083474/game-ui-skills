import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';

const root=process.cwd();
const meta=JSON.parse(fs.readFileSync(path.join(root,'screens.json'),'utf8'));
const app=fs.readFileSync(path.join(root,'app.js'),'utf8');
class NodeMock {
  constructor(){this.dataset={};this.attributes={};this.style={};this.listeners={};this.value='';this.textContent='';this.innerHTML='';this.disabled=false;this.classes=new Set();this.nodes=new Map();this.classList={add:(...xs)=>xs.forEach(x=>this.classes.add(x)),remove:(...xs)=>xs.forEach(x=>this.classes.delete(x)),contains:x=>this.classes.has(x),toggle:(x,on)=>{if(on===undefined)on=!this.classes.has(x);if(on)this.classes.add(x);else this.classes.delete(x);return on}}}
  setAttribute(k,v){this.attributes[k]=String(v)} removeAttribute(k){delete this.attributes[k]} addEventListener(k,fn){this.listeners[k]=fn}
  closest(s){return s==='[data-screen]'?this.screen||null:null}
  querySelector(s){if(this.screen)return this.screen.querySelector(s);if(!this.nodes.has(s))this.nodes.set(s,new NodeMock());return this.nodes.get(s)}
}
class ButtonMock extends NodeMock{constructor(screen,select,value){super();this.screen=screen;this.dataset={select,value};this.setAttribute('aria-pressed','false')}}
class ScreenMock extends NodeMock{
  constructor(id,values,selectType){super();this.dataset={screen:id};this.buttons=values.map(([group,value])=>new ButtonMock(this,group,value));this.commit=new NodeMock();this.commit.screen=this;this.commit.dataset={commit:true};this.selects=[];this.pips=Array.from({length:6},()=>new NodeMock());
    if(selectType){const defs=Array.isArray(selectType)?selectType:[selectType];this.selects=defs.map(({label,value})=>{const n=new NodeMock();n.screen=this;n.label=label;n.value=value;return n})}
  }
  querySelector(s){
    if(s==='[data-commit]')return this.commit;
    if(s==='[data-select]')return this.buttons[0]||new NodeMock();
    const group=s.match(/\[data-select="([^"]+)"\]/);if(group)return this.buttons.find(b=>b.dataset.select===group[1])||null;
    const value=s.match(/\[data-value="([^"]+)"\]/);if(value)return this.buttons.find(b=>b.dataset.value===value[1])||this.node(s);
    const queue=s.match(/\[data-queue-member="([^"]+)"\]/);if(queue)return this.node(`queue-row:${queue[1]}`);
    if(s==='select')return this.selects[0]||this.node(s);
    const label=s.match(/select\[aria-label="([^"]+)"\]/);if(label)return this.selects.find(x=>x.label===label[1])||this.node(s);
    return this.node(s);
  }
  node(s){if(!this.nodes.has(s)){const n=new NodeMock();n.screen=this;this.nodes.set(s,n)}return this.nodes.get(s)}
  querySelectorAll(s){
    if(s==='.pips i')return this.pips;
    if(s==='[data-select]'||s.includes('data-select="')){const g=s.match(/data-select="([^"]+)"/);return g?this.buttons.filter(b=>b.dataset.select===g[1]):this.buttons}
    if(s==='.item-slot[data-select]')return this.buttons.filter(b=>b.dataset.select==='item');
    return [];
  }
}
const configs={
 'paper-mario':[
  ['badges',[['badge','Sunlit Spark'],['badge','Cloud Bell'],['badge','Leafstep'],['badge','Ticket Wink']]],
  ['items',[['item','Honeycomb Tart'],['item','Breeze Ribbon'],['item','Pocket Ticket'],['item','Daisy Seed']]],
  ['battle-orders',[['command','Hammer'],['command','Jump'],['command','Partner Flourish']],{label:'Select front-row target',value:'Lantern Wisp'}]
 ],
 'earthbound':[
  ['goods',[['good','Maple bar'],['good','Bus pass'],['good','Old mixtape'],['good','Pocket notebook']]],
  ['party-status',[['person','Alex'],['person','Bea'],['person','Cal'],['person','Dee']]],
  ['battle-commands',[['action','Bash'],['action','PSI Spark'],['action','Goods'],['action','Guard']],{label:'Choose a target',value:'Radio Static'}]
 ],
 'chrono-trigger':[
  ['party',[['member','Ryn'],['member','Ora'],['member','Unit-7']]],
  ['techs',[['tech','Aether Arc'],['tech','Twin Flare'],['tech','Triad Burst']]],
  ['battle-orders',[['order','Strike'],['order','Tech'],['order','Item']],[{label:'Choose command slot',value:'Ryn'},{label:'Choose target',value:'Vale Sentinel'}]]
 ],
 'zelda-alttp':[
  ['inventory',[['item','Crest Blade'],['item','Round Guard'],['item','Sun Lantern'],['item','Red Tonic'],['item','Old Key'],['item','Room Map'],['item','Star Ring']],{label:'Choose assignment slot',value:'A'}],
  ['dungeon-map',[['room','B-1'],['room','C-1'],['room','D-1'],['room','A-2'],['room','B-2'],['room','C-2'],['room','D-2'],['room','E-2'],['room','B-3'],['room','C-3'],['room','D-3'],['room','A-4'],['room','B-4'],['room','C-4'],['room','D-4'],['room','E-4'],['room','B-5'],['room','C-5'],['room','D-5']]],
  ['item-shop',[['offer','Moon Dew'],['offer','Copper Bell'],['offer','Blue Resin']]]
 ]
};
const screens=configs[meta.slug].map(([id,values,select])=>new ScreenMock(id,values,select));
const links=['badges','items','battle-orders','goods','party-status','battle-commands','party','techs','inventory','dungeon-map','item-shop'].map(id=>{const n=new NodeMock();n.hash=`#${id}`;return n});
const kicker=new NodeMock(),money=[new NodeMock(),new NodeMock()];
const document={body:new NodeMock(),querySelector:s=>{
  if(s==='#screen-kicker')return kicker;
  const member=s.match(/\.member-card\[data-value="([^"]+)"\]/);if(member){const party=screens.find(x=>x.dataset.screen==='party');return party?.buttons.find(b=>b.dataset.value===member[1])||null}
  return new NodeMock();
},querySelectorAll:s=>{
  if(s==='[data-screen]')return screens;
  if(s==='.screen-nav a')return links;
  if(s==='select')return screens.flatMap(x=>x.selects);
  if(s==='[data-rupees]')return money;
  return [];
}};
const window={addEventListener(){}};
const location={hash:''};
vm.runInNewContext(app,{document,window,location});
const lab=window.GameLab;
const screen=id=>screens.find(x=>x.dataset.screen===id);
const choose=(id,value)=>lab.select(id,value);
const commit=id=>lab.commit(id);

switch(meta.slug){
  case 'paper-mario':
    choose('badges','Cloud Bell');commit('badges');assert.equal(lab.state.usedSlots,4);assert.match(screen('badges').querySelector('[data-capacity]').textContent,/04 \/ 06/);
    choose('items','Breeze Ribbon');commit('items');assert.equal(lab.state.items['Breeze Ribbon'],0);assert.match(screen('items').querySelector('[data-pouch]').textContent,/09 \/ 12/);
    choose('battle-orders','Jump');screen('battle-orders').querySelector('select').value='Paper Moth';commit('battle-orders');assert.equal(lab.state.queue,1);assert.match(screen('battle-orders').querySelector('[data-result]').textContent,/Jump is locked on Paper Moth/);break;
  case 'earthbound':
    choose('goods','Pocket notebook');commit('goods');assert.equal(lab.state.items['Pocket notebook'],3);
    choose('party-status','Dee');commit('party-status');assert.equal(lab.state.people.Dee.hp,60);assert.equal(lab.state.bandages,1);
    choose('battle-commands','PSI Spark');screen('battle-commands').querySelector('select').value='Neon Pigeon';commit('battle-commands');assert.equal(lab.state.pp,50);assert.equal(lab.state.queue,1);break;
  case 'chrono-trigger':
    choose('party','Ora');commit('party');assert.equal(lab.state.focus,'Ora');
    choose('techs','Triad Burst');commit('techs');assert.equal(lab.state.reserved[0],'Triad Burst');assert.equal(Object.values(lab.members).reduce((n,m)=>n+m.mp,0),56);
    choose('battle-orders','Tech');screen('battle-orders').querySelector('select[aria-label="Choose command slot"]').value='Ora';screen('battle-orders').querySelector('select[aria-label="Choose target"]').value='Glass Warden';commit('battle-orders');assert.equal(lab.state.locked,1);assert.match(screen('battle-orders').querySelector('[data-queue-member="Ora"]').querySelector('.queue-action').textContent,/TECH/);break;
  case 'zelda-alttp':
    choose('inventory','Sun Lantern');screen('inventory').querySelector('select').value='A';commit('inventory');assert.equal(lab.state.assignments.A,'Sun Lantern');
    choose('dungeon-map','D-3');commit('dungeon-map');assert.equal(lab.state.room,'D-3');assert.equal(lab.state.rooms['C-3'],'explored');
    choose('item-shop','Moon Dew');commit('item-shop');assert.equal(lab.state.rupees,72);assert.equal(lab.state.stock['Moon Dew'],false);break;
  default: throw new Error(`Unknown lab ${meta.slug}`);
}
assert.equal(meta.screens.length,3);assert.equal(meta.smokeTests.length,3);
for(const file of ['index.html','style.css','app.js','screens.json','assets/ui-atlas.svg'])assert.ok(fs.existsSync(path.join(root,file)),`missing local file ${file}`);
console.log(`${meta.slug}: 3 screen workflows passed; resource/status mutations asserted; all five local runtime paths exist`);
