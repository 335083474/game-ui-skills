/* Original package demonstration data and simplified deterministic rules. */
(function(root){
  'use strict';
  const INITIAL = {
  "kind": "Original demonstration data; simplified menu simulation",
  "partyOrder": ["rook", "bran", "lyra"],
  "selectedMemberId": "rook",
  "gil": 1240,
  "location": "Freight Yard",
  "members": [
    {"id":"rook","name":"Rook","role":"Scout","level":23,"portrait":"portrait-scout","hp":640,"maxHp":892,"mp":41,"maxMp":80,"base":{"strength":30,"vitality":18,"magic":26,"spirit":20},"gear":{"weapon":"steel-sword","armour":"silver-wristguard","accessory":"copper-charm"},"spells":["fire","cure"],"time":100,"limit":22,"status":"Ready"},
    {"id":"bran","name":"Bran","role":"Guard","level":22,"portrait":"portrait-guard","hp":908,"maxHp":1284,"mp":20,"maxMp":48,"base":{"strength":34,"vitality":25,"magic":12,"spirit":18},"gear":{"weapon":"guard-blade","armour":"iron-band","accessory":"guard-token"},"spells":["fire"],"time":40,"limit":48,"status":"Waiting"},
    {"id":"lyra","name":"Lyra","role":"Mage","level":22,"portrait":"portrait-mage","hp":410,"maxHp":735,"mp":67,"maxMp":120,"base":{"strength":14,"vitality":14,"magic":38,"spirit":28},"gear":{"weapon":"ash-wand","armour":"cloth-band","accessory":"mage-token"},"spells":["blizzard","cure","flare"],"time":72,"limit":8,"status":"Waiting"}
  ],
  "equipment": [
    {"id":"steel-sword","name":"Steel Sword","slot":"weapon","attack":18,"compatible":["rook"],"owned":1,"art":"steel-sword"},
    {"id":"alloy-sword","name":"Alloy Sword","slot":"weapon","attack":26,"compatible":["rook"],"owned":1,"art":"steel-sword"},
    {"id":"silver-wristguard","name":"Silver Wristguard","slot":"armour","defense":14,"magicDefense":4,"compatible":["rook"],"owned":1,"art":"silver-wristguard"},
    {"id":"reinforced-guard","name":"Reinforced Guard","slot":"armour","defense":24,"magicDefense":6,"compatible":["rook"],"owned":1,"art":"silver-wristguard"},
    {"id":"copper-charm","name":"Copper Charm","slot":"accessory","magic":0,"compatible":["rook"],"owned":1},
    {"id":"memory-charm","name":"Memory Charm","slot":"accessory","magic":6,"compatible":["rook"],"owned":1},
    {"id":"guard-blade","name":"Guard Blade","slot":"weapon","attack":20,"compatible":["bran"],"owned":1,"art":"steel-sword"},
    {"id":"iron-band","name":"Iron Band","slot":"armour","defense":22,"magicDefense":2,"compatible":["bran"],"owned":1,"art":"silver-wristguard"},
    {"id":"guard-token","name":"Guard Token","slot":"accessory","magic":0,"compatible":["bran"],"owned":1},
    {"id":"ash-wand","name":"Ash Wand","slot":"weapon","attack":8,"compatible":["lyra"],"owned":1},
    {"id":"cloth-band","name":"Cloth Band","slot":"armour","defense":8,"magicDefense":8,"compatible":["lyra"],"owned":1},
    {"id":"mage-token","name":"Mage Token","slot":"accessory","magic":3,"compatible":["lyra"],"owned":1}
  ],
  "items": [{"id":"potion","name":"Potion","quantity":6,"effect":"heal","power":100,"target":"living ally"},{"id":"ether","name":"Ether","quantity":0,"effect":"restore MP","power":20,"target":"living ally"}],
  "materiaStudy": {"name":"Verdant Orb","art":"green-orb","note":"Visual materia study; no materia progression modeled"},
  "spells": [
    {"id":"fire","name":"Fire","mpCost":4,"power":140,"effect":"damage","target":"living enemy"},
    {"id":"cure","name":"Cure","mpCost":5,"power":180,"effect":"heal","target":"living ally"},
    {"id":"blizzard","name":"Blizzard","mpCost":4,"power":130,"effect":"damage","target":"living enemy"},
    {"id":"flare","name":"Flare","mpCost":80,"power":500,"effect":"damage","target":"living enemy"}
  ],
  "enemies": [{"id":"drone","name":"Training Drone","hp":420,"maxHp":420},{"id":"sentinel","name":"Yard Sentinel","hp":620,"maxHp":620}],
  "battle": {"phase":"command","activeMemberId":"rook","pendingCommand":null,"pendingTarget":null,"timeMode":"manual demo; +30 per advance"}
}
;
  const copy=x=>JSON.parse(JSON.stringify(x));
  const member=(s,id)=>s.members.find(m=>m.id===id);
  const gear=(s,id)=>s.equipment.find(e=>e.id===id);
  const item=(s,id)=>s.items.find(i=>i.id===id);
  const stats=(s,id,preview)=>{const m=member(s,id), g={...m.gear};if(preview)g[gear(s,preview).slot]=preview;const w=gear(s,g.weapon),a=gear(s,g.armour),c=gear(s,g.accessory);return {attack:m.base.strength+(w.attack||0),defense:m.base.vitality+(a.defense||0),magic:m.base.magic+(c.magic||0),magicDefense:m.base.spirit+(a.magicDefense||0)};};
  const free=(s,id)=>gear(s,id).owned-s.members.filter(m=>Object.values(m.gear).includes(id)).length;
  function equipReason(s,mid,slot,id){const e=gear(s,id),m=member(s,mid);if(!e||e.slot!==slot)return 'This item does not fit this slot.';if(!e.compatible.includes(mid))return 'Incompatible with '+m.name+'.';if(m.gear[slot]!==id&&free(s,id)<1)return 'No free copy available.';return '';}
  function equip(s,mid,slot,id){const reason=equipReason(s,mid,slot,id);if(reason)return {ok:false,message:reason};const m=member(s,mid),e=gear(s,id);if(m.gear[slot]===id)return {ok:true,message:e.name+' is already equipped. No inventory changed.'};m.gear[slot]=id;return {ok:true,message:m.name+' equipped '+e.name+'. Attack '+stats(s,mid).attack+' · Defense '+stats(s,mid).defense+'.'};}
  function potionReason(s,tid){const m=member(s,tid);if(item(s,'potion').quantity<1)return 'No Potions remaining.';if(!m||m.hp<=0)return 'Potion requires a living ally.';if(m.hp===m.maxHp)return m.name+' already has full HP.';return '';}
  function potion(s,tid){const reason=potionReason(s,tid);if(reason)return {ok:false,message:reason};const m=member(s,tid),n=Math.min(100,m.maxHp-m.hp);m.hp+=n;item(s,'potion').quantity--;return {ok:true,message:'Potion restored '+n+' HP to '+m.name+'.',amount:n};}
  function readyReason(s){if(s.enemies.every(e=>e.hp===0))return 'Victory — all training enemies defeated.';const m=member(s,s.battle.activeMemberId);if(!m||m.hp<=0||m.time<100)return 'Waiting — choose Advance Time to ready a member.';return '';}
  function actionReason(s,action){const r=readyReason(s);if(r)return r;const m=member(s,s.battle.activeMemberId);if(action==='attack'||action==='defend')return '';if(action==='potion')return item(s,'potion').quantity>0?'':'No Potions remaining.';if(action==='ether')return 'No Ethers remaining.';const spell=s.spells.find(p=>p.id===action);if(!spell||!m.spells.includes(action))return 'This actor does not know that spell.';return m.mp<spell.mpCost?'Insufficient MP: '+spell.name+' needs '+spell.mpCost+' MP; '+m.name+' has '+m.mp+'.':'';}
  function targetReason(s,action,tid){const r=actionReason(s,action);if(r)return r;if(action==='defend')return '';if(action==='potion')return potionReason(s,tid);const spell=s.spells.find(p=>p.id===action);if(spell&&spell.effect==='heal'){const m=member(s,tid);return !m||m.hp===0?'Choose a living ally.':m.hp===m.maxHp?m.name+' already has full HP.':'';}const e=s.enemies.find(e=>e.id===tid);return !e||e.hp===0?'Choose a living enemy.':'';}
  function resolve(s,action,tid){const r=targetReason(s,action,tid);if(r)return {ok:false,message:r};const m=member(s,s.battle.activeMemberId);let text='';m.status='Waiting';if(action==='defend'){m.status='Defending';text=m.name+' is Defending.';}else if(action==='potion'){text=m.name+' used Potion. '+potion(s,tid).message;}else{const spell=s.spells.find(p=>p.id===action);if(spell)m.mp-=spell.mpCost;if(spell&&spell.effect==='heal'){const t=member(s,tid),heal=Math.min(spell.power,t.maxHp-t.hp);t.hp+=heal;text=m.name+' cast '+spell.name+' on '+t.name+': +'+heal+' HP (−'+spell.mpCost+' MP).';}else{const t=s.enemies.find(e=>e.id===tid),damage=spell?spell.power:2*stats(s,m.id).attack;t.hp=Math.max(0,t.hp-damage);text=m.name+' used '+(spell?spell.name:'Attack')+' on '+t.name+': '+damage+' damage'+(spell?' (−'+spell.mpCost+' MP)':'')+'.';}}
    m.time=0;s.battle.pendingCommand=null;s.battle.pendingTarget=null;s.battle.phase=s.enemies.every(e=>e.hp===0)?'victory':'waiting';if(s.battle.phase==='victory')text+=' Victory!';s.battle.lastOutcome=text;return {ok:true,message:text};
  }
  function advance(s){if(s.battle.phase==='victory')return {ok:false,message:'Victory — Reset Demo to begin again.'};s.members.filter(m=>m.hp>0).forEach(m=>{m.time=Math.min(100,m.time+30);if(m.status!=='Defending')m.status=m.time===100?'Ready':'Waiting';});const id=s.partyOrder.find(id=>{const m=member(s,id);return m.hp>0&&m.time===100;});s.battle.activeMemberId=id||s.battle.activeMemberId;s.battle.phase=id?'command':'waiting';return {ok:true,message:id?member(s,id).name+' is ready. Select a command.':'Waiting — Time advanced by 30.'};}
  function chooseActor(s,id){const m=member(s,id);if(s.battle.phase==='victory')return {ok:false,message:'Victory — Reset Demo to begin again.'};if(m.hp<=0||m.time<100)return {ok:false,message:m.name+' is not ready (Time '+m.time+'/game-ui-skills/100).'};s.battle.activeMemberId=id;s.battle.phase='command';s.battle.pendingCommand=null;s.battle.pendingTarget=null;return {ok:true,message:m.name+' is ready. Select a command.'};}
  const api={create:()=>copy(INITIAL),member,gear,item,stats,free,equipReason,equip,potionReason,potion,readyReason,actionReason,targetReason,resolve,advance,chooseActor};
  if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.FF=api;
})(typeof window==='undefined'?globalThis:window);
