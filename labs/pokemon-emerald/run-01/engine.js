/* Deterministic, transactional demo rules. No browser or persistence required. */
(function(root){
  'use strict';
  function createState(){
    const moves=()=>[
      {id:'tackle',name:'TACKLE',type:'NORMAL',pp:14,maxPp:20,cost:1,power:7,target:'enemy'},
      {id:'leaf-cut',name:'LEAF CUT',type:'GRASS',pp:8,maxPp:10,cost:1,power:10,target:'enemy'},
      {id:'quick-hit',name:'QUICK HIT',type:'NORMAL',pp:1,maxPp:10,cost:1,power:4,target:'enemy'},
      {id:'seed-shot',name:'SEED SHOT',type:'GRASS',pp:0,maxPp:5,cost:1,power:8,target:'enemy'}
    ];
    return {
      party:[
        {id:'leaf',name:'LEAFLET',sprite:'green-dragon',level:12,hp:24,maxHp:36,status:'OK',moves:moves()},
        {id:'fire',name:'CINDER',sprite:'fire-spirit',level:13,hp:40,maxHp:40,status:'OK',moves:[
          {id:'tackle',name:'TACKLE',type:'NORMAL',pp:12,maxPp:20,cost:1,power:7,target:'enemy'},
          {id:'ember',name:'EMBER',type:'FIRE',pp:6,maxPp:10,cost:1,power:10,target:'enemy'}]},
        {id:'water',name:'RIPPLE',sprite:'water-spirit',level:11,hp:0,maxHp:32,status:'FNT',moves:[
          {id:'splash',name:'SPLASH',type:'WATER',pp:10,maxPp:10,cost:1,power:6,target:'enemy'}]}
      ],
      inventory:{potion:3,tonic:2,remedy:0},
      ui:{screen:'party',selectedPartyId:'leaf',pocket:'items',selectedItemId:'potion',mode:'select',context:'field',cursors:{items:'potion',balls:null,tms:null,berries:null,key:null},command:0,move:0,messageIndex:0},
      battle:{phase:'command',activeId:'leaf',enemy:{name:'WILD MOSS',sprite:'green-dragon',level:10,hp:30,maxHp:30,power:5},turn:0,escapeAttempts:0,canEscape:true,outcome:null,log:[],message:'',messages:[]}
    };
  }
  const member=(s,id)=>s.party.find(p=>p.id===id);
  const reject=message=>({ok:false,message});
  function guard(s){
    if(s.battle.outcome)return reject('Battle ended. Reset to play again.');
    if(s.battle.phase==='message'||s.battle.phase==='resolving')return reject('Read the battle result first.');
    return null;
  }
  function respond(s,lines){
    const b=s.battle,p=member(s,b.activeId);
    if(b.enemy.hp>0&&p&&p.hp>0){
      const damage=Math.min(p.hp,b.enemy.power);p.hp-=damage;p.status=p.hp===0?'FNT':'OK';
      lines.push(`${b.enemy.name} hit ${p.name} for ${damage} HP.`);
      if(!p.hp){lines.push(`${p.name} fainted!`);if(!s.party.some(x=>x.hp>0))b.outcome='lost';else lines.push('Choose a living member.');}
    }
    b.turn++;
    b.phase='message';b.message=lines.join(' ');b.messages=lines;b.log.push(...lines);s.ui.messageIndex=0;
    return {ok:true,message:b.message};
  }
  function heal(s,itemId,targetId,context='field'){
    const amount={potion:20,tonic:10}[itemId];
    if(s.battle.phase==='message'||s.battle.phase==='resolving')return reject('Read the battle result first.');
    if(context==='battle'){const bad=guard(s);if(bad)return bad;if(member(s,s.battle.activeId).hp===0)return reject('Choose a living battler first.');}
    if(!amount)return reject('REMEDY has no supported effect in this demo.');
    if(!Number.isInteger(s.inventory[itemId])||s.inventory[itemId]<=0)return reject('No stock left!');
    const p=member(s,targetId);
    if(!p)return reject('Choose a valid party member.');
    if(p.hp===0)return reject(`${p.name} is fainted. A revive is required.`);
    if(p.hp>=p.maxHp)return reject(`${p.name} already has full HP.`);
    const n=Math.min(amount,p.maxHp-p.hp);
    p.hp+=n;s.inventory[itemId]--;p.status='OK';
    const line=`${p.name} recovered ${n} HP.`;
    return context==='battle'?respond(s,[line]):{ok:true,message:line};
  }
  function attack(s,moveId){
    const bad=guard(s);if(bad)return bad;
    const p=member(s,s.battle.activeId);
    if(!p||p.hp<=0)return reject('Choose a living battler first.');
    const m=p.moves.find(x=>x.id===moveId);
    if(!m)return reject('Choose a valid move.');
    if(m.pp<m.cost)return reject('No PP left!');
    if(s.battle.enemy.hp<=0)return reject('There is no living target.');
    s.battle.phase='resolving';m.pp-=m.cost;
    const damage=Math.min(m.power,s.battle.enemy.hp);s.battle.enemy.hp-=damage;
    const lines=[`${p.name} used ${m.name}! ${damage} damage.`];
    if(!s.battle.enemy.hp){s.battle.outcome='won';lines.push('WILD MOSS fainted. You won!');}
    return respond(s,lines);
  }
  function switchBattler(s,id){
    const bad=guard(s);if(bad)return bad;
    const p=member(s,id);
    if(!p)return reject('Choose a valid party member.');
    if(!p.hp)return reject(`${p.name} cannot battle: FNT.`);
    if(id===s.battle.activeId)return reject(`${p.name} is already battling.`);
    s.battle.activeId=id;
    return respond(s,[`Go, ${p.name}!`]);
  }
  function run(s){
    const bad=guard(s);if(bad)return bad;
    if(!member(s,s.battle.activeId).hp)return reject('Choose a living battler first.');
    const b=s.battle;b.escapeAttempts++;
    if(b.canEscape&&b.escapeAttempts>=2){
      b.outcome='escaped';b.phase='message';b.turn++;b.message='Got away safely!';b.messages=[b.message];s.ui.messageIndex=0;b.log.push(b.message);
      return {ok:true,message:b.message};
    }
    return respond(s,["Can't escape!"]);
  }
  function acknowledge(s){if(s.battle.phase==='message'){s.battle.phase=s.battle.outcome||'command';s.battle.message='';}}
  function validate(s){
    const errors=[];
    if(!s.party.length||s.party.length>6)errors.push('party size');
    if(new Set(s.party.map(p=>p.id)).size!==s.party.length)errors.push('duplicate party id');
    for(const p of s.party){
      if(!Number.isInteger(p.hp)||p.hp<0||p.hp>p.maxHp)errors.push(p.id+' hp');
      if((p.hp===0)!==(p.status==='FNT'))errors.push(p.id+' status');
      for(const m of p.moves)if(!Number.isInteger(m.pp)||m.pp<0||m.pp>m.maxPp)errors.push(p.id+' pp');
    }
    for(const n of Object.values(s.inventory))if(!Number.isInteger(n)||n<0)errors.push('inventory');
    const e=s.battle.enemy;if(!Number.isInteger(e.hp)||e.hp<0||e.hp>e.maxHp)errors.push('enemy hp');
    if(!member(s,s.battle.activeId))errors.push('active id');
    if(!Number.isInteger(s.battle.turn)||s.battle.turn<0)errors.push('turn');
    return errors;
  }
  root.EmeraldDemo={createState,member,heal,attack,switchBattler,run,acknowledge,validate};
  if(typeof module!=='undefined'&&module.exports)module.exports=root.EmeraldDemo;
})(globalThis);
