/* Editable DOM views over one in-memory store. Open index.html directly. */
(()=>{
  'use strict';
  const E=window.EmeraldDemo,game=document.getElementById('game');
  let state=E.createState(),feedback='',dialog=null,fieldResult=null,pointerDown=false;
  const pockets=[['items','ITEMS','Items'],['balls','BALLS','Poké Balls'],['tms','TMs','TMs/HMs'],['berries','BERRIES','Berries'],['key','KEY','Key Items']];
  const items=[
    {id:'potion',name:'POTION',pocket:'items',desc:'Restores 20 HP to one living member. Cannot revive.'},
    {id:'tonic',name:'TONIC',pocket:'items',desc:'Restores 10 HP to one living member. Cannot revive.'},
    {id:'remedy',name:'REMEDY',pocket:'items',desc:'No stock. Remedy effects are outside this demo.'}
  ];
  const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const member=id=>E.member(state,id),active=()=>member(state.battle.activeId),selected=()=>member(state.ui.selectedPartyId);
  const sprite=(id,extra='')=>`<span class="em-sprite em-sprite--${id} ${extra}" aria-hidden="true"></span>`;
  function hp(p,withNumbers=false){
    const ratio=p.hp/p.maxHp,cls=!p.hp?' em-hp--fainted':ratio<=.2?' em-hp--low':ratio<=.5?' em-hp--mid':'';
    return `<span class="em-hp${cls}"><span class="em-hp__label">HP</span><span class="em-hp__track"><span class="em-hp__fill" style="--hp:${p.hp?Math.max(1,Math.ceil(100*ratio)):0}%"></span></span>${withNumbers?`<span>${p.hp}/${p.maxHp}</span>`:''}</span>`;
  }
  function announce(text){document.getElementById('announcer').textContent=text;}
  function showMessage(text){feedback=text;announce(text);}
  function button(action,label,extra=''){return `<button type="button" data-action="${action}" ${extra}>${label}</button>`;}
  function focusKey(key){const el=game.querySelector(`[data-key="${key}"]`);if(el)el.focus({preventScroll:true});}
  function partyTile(p,lead=false){
    const isSel=p.id===state.ui.selectedPartyId,cur=isSel?'<i class="selected-cursor" aria-hidden="true"></i>':'';
    const status=p.hp===0?'<span class="em-badge em-badge--fainted">FNT</span>':'<span class="em-label">OK</span>';
    const label=`${p.name}, level ${p.level}, ${p.hp}/${p.maxHp} HP, ${p.status}`;
    const attrs=`class="em-party-tile ${lead?'em-party-lead party-lead':''} ${p.hp?'':'em-party-tile--fainted'}" data-key="party-${p.id}" data-menu="party" data-id="${p.id}" aria-label="${label}" aria-pressed="${isSel}" tabindex="${isSel?'0':'-1'}"`;
    return button('member',lead?`${sprite(p.sprite,'em-sprite--double')}<span class="member-name">${cur}${p.name}</span><span class="member-sub"><span>Lv${p.level}</span>${status}</span>${hp(p)}<span style="text-align:right">${p.hp}/${p.maxHp}</span>`:`${sprite(p.sprite)}<span class="em-party-tile__body"><span class="em-between"><span class="member-name">${cur}${p.name}</span><span class="member-level">Lv${p.level}</span></span><span class="em-party-tile__meta">${hp(p)}${p.hp?`<span>${p.hp}/${p.maxHp}</span>`:`${status}<span>0/${p.maxHp}</span>`}</span></span>`,attrs);
  }
  function partyView(target=false){
    const u=state.ui,p=selected(),item=items.find(x=>x.id===u.selectedItemId);
    const title=target?`${item.name} ×${state.inventory[item.id]} / TARGET`:'PARTY';
    const msg=feedback||(target?'Use on which member?':u.context==='battle'?'Choose a member to send out.':'Choose a member.');
    let out=`<div class="${target?'target-party':''}"><div class="screen-title">${title}${!target?'<br><small>3 / 6 MEMBERS</small>':''}</div>${partyTile(state.party[0],true)}<div class="party-reserves">${state.party.slice(1).map(x=>partyTile(x)).join('')}${Array.from({length:6-state.party.length},()=>'<div class="party-empty" aria-label="Empty party slot">EMPTY</div>').join('')}</div><div class="bottom-panel"><div class="em-frame em-message" role="status" aria-live="polite">${esc(msg)}</div>${button('back','CANCEL','class="cancel-button" data-key="back" data-menu="party"')}</div></div>`;
    if(dialog==='details'){
      const battle=u.context==='battle';
      out+=`<div class="dialog-shade"><section class="em-frame detail-dialog" role="dialog" aria-modal="true" aria-label="${p.name} details"><div class="detail-head">${sprite(p.sprite,'em-sprite--double')}<div><div class="name-level">${p.name}　Lv${p.level}</div><div class="stat-line">STATUS: ${p.hp?'OK':'FNT'}${p.id===state.battle.activeId?' · ACTIVE':''}</div></div></div><div class="detail-stats">${hp(p)}<span>${p.hp}/${p.maxHp}</span></div><div class="detail-moves">${p.moves.map(m=>`<div class="detail-move"><span>${m.name}</span><span>${m.pp}/${m.maxPp}</span></div>`).join('')}</div><div class="detail-feedback" role="status" aria-live="polite">${esc(feedback||'Move values are current PP / max PP.')}</div><div class="detail-actions">${button(battle?'send':'party-heal',battle?'SEND OUT':`POTION ×${state.inventory.potion}`,'class="em-button em-button--active" data-key="detail-action" data-menu="dialog"')}${button('back','BACK','class="em-button" data-key="detail-back" data-menu="dialog"')}</div></section></div>`;
    }
    if(fieldResult)out+=resultOverlay(fieldResult);
    return out;
  }
  function resultOverlay(text){return `<div class="dialog-shade"><section class="em-frame detail-dialog" role="dialog" aria-modal="true" aria-label="Item result"><div class="detail-head">${sprite(state.ui.selectedItemId||'potion','em-sprite--item em-sprite--double')}<span>ITEM RESULT</span></div><p style="font-size:11px;line-height:13px">${esc(text)}</p><p style="font-size:9px">POTION ×${state.inventory.potion}　TONIC ×${state.inventory.tonic}</p><div class="detail-actions">${button('field-continue','CONTINUE','class="em-button em-button--active" data-key="field-continue" data-menu="result"')}</div></section></div>`;}
  function bagView(){
    const u=state.ui,list=items.filter(i=>i.pocket===u.pocket),item=list.find(i=>i.id===u.selectedItemId);
    if(u.mode==='target')return partyView(true);
    let out=`<div class="pocket-strip" role="tablist" aria-label="Bag pockets">${pockets.map(([id,label,full])=>button('pocket',label,`role="tab" aria-label="${full}" aria-selected="${id===u.pocket}" tabindex="${id===u.pocket?'0':'-1'}" class="em-pocket" data-menu="pockets" data-key="pocket-${id}" data-id="${id}"`)).join('')}</div><div class="bag-column"><span class="em-bag-icon" role="img" aria-label="Bag"></span><span class="bag-label">${pockets.find(x=>x[0]===u.pocket)[1]}<br>${u.context==='battle'?'BATTLE BAG':'FIELD BAG'}</span>${item?sprite(item.id,'em-sprite--item em-sprite--double'):''}</div><div class="em-frame bag-list" role="tabpanel" aria-label="${pockets.find(x=>x[0]===u.pocket)[2]}">${list.length?list.map(i=>button('item',`<span class="em-item-row__name ${i.id===u.selectedItemId?'em-cursor':''}">${i.name}</span><span class="item-count">×${state.inventory[i.id]}</span>`,`class="em-item-row" data-menu="items" data-id="${i.id}" data-key="item-${i.id}" aria-selected="${i.id===u.selectedItemId}" aria-disabled="${state.inventory[i.id]===0}" tabindex="${i.id===u.selectedItemId?'0':'-1'}"`)).join(''):'<div class="empty-message">No items.<br><br>Choose another pocket.</div>'}</div><div class="bottom-panel bag-bottom"><div class="em-frame em-message" role="status" aria-live="polite">${esc(feedback||(item?item.desc:'This pocket is empty. No items can be used.'))}</div>${button('back','BACK','class="cancel-button" data-key="back" data-menu="items"')}</div>`;
    if(dialog==='item')out+=`<div class="dialog-shade"><section class="em-frame item-dialog" role="dialog" aria-modal="true" aria-label="${item.name} actions"><div class="item-dialog-label">${item.name} ×${state.inventory[item.id]}</div>${button('use','USE','class="em-choice is-selected" data-key="item-use" data-menu="dialog"')}${button('back','CANCEL','class="em-choice" data-key="item-cancel" data-menu="dialog"')}</section></div>`;
    if(fieldResult)out+=resultOverlay(fieldResult);
    return out;
  }
  function plate(p,enemy=false){return `<div class="em-status ${enemy?'enemy-status':'player-status'}"><div class="em-between"><span class="plate-name">${p.name}</span><span class="plate-level">Lv${p.level}</span></div>${hp(p)}<div class="em-status__numbers">${p.hp===0?'FNT · ':''}${p.hp}/${p.maxHp}</div>${enemy?'':'<div class="em-exp"><span></span></div>'}</div>`;}
  function battleView(){
    const b=state.battle,p=active(),terminal=!!b.outcome;
    let out=`<div class="battle-field"><span class="ground enemy-ground"></span><span class="ground player-ground"></span></div>${plate(b.enemy,true)}${plate(p)}<span class="enemy-creature ${b.enemy.hp?'':'creature-fnt'}">${sprite(b.enemy.sprite,'em-sprite--battle')}</span><span class="player-creature ${p.hp?'':'creature-fnt'}">${sprite(p.sprite,'em-sprite--battle')}</span><span class="battle-caption">TURN ${b.turn} · DEMO</span>${terminal?`<span class="status-outcome">${b.outcome.toUpperCase()}</span>`:''}`;
    if(b.phase==='message')return out+`<div class="battle-result"><div class="em-frame em-message em-message--waiting" role="status" aria-live="polite">${esc(b.messages[state.ui.messageIndex]||b.message)}</div>${button('battle-continue',`NEXT ${state.ui.messageIndex+1}/${b.messages.length}`,'class="cancel-button" data-key="battle-next" data-menu="result"')}</div>`;
    if(terminal)return out+`<div class="battle-result"><div class="em-frame em-message" role="status">${b.outcome==='won'?'Battle won!':b.outcome==='escaped'?'Got away safely!':'No members can battle.'}<br>Reset to play again.</div>${button('reset','RESET','class="cancel-button" data-key="battle-reset" data-menu="result"')}</div>`;
    if(b.phase==='moves'){
      const m=p.moves[state.ui.move]||p.moves[0];
      return out+`<div class="battle-bottom"><div class="em-frame em-move-grid">${p.moves.map((m,i)=>button('move',`${m.name}<small>${m.type}</small>`,`class="em-choice move-choice ${i===state.ui.move?'is-selected':''}" data-menu="moves" data-key="move-${m.id}" data-id="${m.id}" aria-label="${m.name}, ${m.type}, PP ${m.pp}/${m.maxPp}, power ${m.power}" aria-disabled="${m.pp<m.cost}" tabindex="${i===state.ui.move?'0':'-1'}"`)).join('')}</div><div class="em-frame move-detail"><span>PP ${m.pp}/${m.maxPp}</span><span>${feedback?esc(feedback):`POWER ${m.power}`}</span>${button('back','BACK','class="em-choice" data-menu="moves" data-key="move-back"')}</div></div>`;
    }
    const commands=['FIGHT','BAG','POKéMON','RUN'];
    return out+`<div class="battle-bottom"><div class="em-frame em-message" role="status" aria-live="polite">${esc(feedback||(!p.hp?'Choose a living member.':`What will ${p.name} do?`))}</div><div class="em-frame em-command-grid">${commands.map((c,i)=>button('command',c,`class="em-choice ${i===state.ui.command?'is-selected':''}" data-menu="commands" data-key="command-${i}" data-id="${i}" tabindex="${i===state.ui.command?'0':'-1'}" ${!p.hp&&i!==2?'aria-disabled="true"':''}`)).join('')}</div></div>`;
  }
  function render(focus=null){
    const u=state.ui;
    game.innerHTML=u.screen==='party'?partyView():u.screen==='bag'?bagView():battleView();
    game.setAttribute('aria-label',`${u.screen} game screen`);game.setAttribute('aria-busy','false');
    document.getElementById('screen-name').textContent=`${u.screen.toUpperCase()} / ${u.context==='battle'&&u.screen!=='battle'?'BATTLE MENU':u.screen==='battle'?'WILD ENCOUNTER':'FIELD'}`;
    for(const a of document.querySelectorAll('[data-page]')){if(a.dataset.page===u.screen)a.setAttribute('aria-current','page');else a.removeAttribute('aria-current');}
    document.getElementById('context-note').textContent=u.screen==='party'?'The lead slot anchors the party. Choose a member for status, move PP and a capped Potion heal.':u.screen==='bag'?'Five pockets. One inventory. Use medicine on a living member; full HP and fainted targets keep your stock.':'Choose a command. Move power is deterministic; every accepted action receives one enemy response unless the battle ends.';
    document.getElementById('state-output').textContent=JSON.stringify(state,null,2);
    if(focus)focusKey(focus);
  }
  function go(screen,context='field',focus=null){
    state.ui.screen=screen;state.ui.context=context;state.ui.mode='select';dialog=null;feedback='';fieldResult=null;
    if(location.hash!==`#${screen}`)history.replaceState(null,'',`#${screen}`);
    render(focus);
  }
  function result(r,field=false){
    announce(r.message);feedback=r.message;
    if(r.ok&&state.ui.context==='battle'&&!field){go('battle','battle','battle-next');return;}
    if(r.ok){dialog=null;fieldResult=r.message;state.ui.mode='select';render('field-continue');}
    else render(document.activeElement?.dataset.key||null);
  }
  function changePocket(id){
    const u=state.ui;u.pocket=id;u.selectedItemId=u.cursors[id];dialog=null;feedback='';render(`pocket-${id}`);
  }
  function back(){
    if(fieldResult){fieldResult=null;feedback='';render(state.ui.screen==='party'?`party-${state.ui.selectedPartyId}`:`item-${state.ui.selectedItemId}`);return;}
    if(dialog){const was=dialog;dialog=null;feedback='';render(was==='details'?`party-${state.ui.selectedPartyId}`:`item-${state.ui.selectedItemId}`);return;}
    if(state.ui.screen==='bag'&&state.ui.mode==='target'){state.ui.mode='select';feedback='';render(`item-${state.ui.selectedItemId}`);return;}
    if(state.ui.screen==='battle'){
      if(state.battle.phase==='moves'){state.battle.phase='command';feedback='';render(`command-${state.ui.command}`);}
      return;
    }
    if(state.ui.context==='battle'){go('battle','battle',`command-${state.ui.command}`);return;}
    if(state.ui.screen==='bag'){go('party','field',`party-${state.ui.selectedPartyId}`);return;}
    showMessage('Choose a screen above to continue.');render('back');
  }
  function reset(){state=E.createState();dialog=null;feedback='';fieldResult=null;const route=location.hash.slice(1);state.ui.screen=['party','bag','battle'].includes(route)?route:'party';state.ui.context=state.ui.screen==='battle'?'battle':'field';announce('Demo reset. Party HP, stock, moves and battle restored.');render();}
  game.addEventListener('click',event=>{
    const el=event.target.closest('button[data-action]');if(!el)return;
    const action=el.dataset.action,u=state.ui;
    if(fieldResult&&action!=='field-continue')return;
    if(state.battle.phase==='message'&&u.screen==='battle'&&action!=='battle-continue')return;
    switch(action){
      case 'member':u.selectedPartyId=el.dataset.id;feedback='';if(u.mode==='target')result(E.heal(state,u.selectedItemId,u.selectedPartyId,u.context));else{dialog='details';render('detail-action');}break;
      case 'party-heal':u.selectedItemId='potion';result(E.heal(state,'potion',u.selectedPartyId,u.context));break;
      case 'send':result(E.switchBattler(state,u.selectedPartyId));break;
      case 'pocket':changePocket(el.dataset.id);break;
      case 'item':u.selectedItemId=el.dataset.id;u.cursors[u.pocket]=u.selectedItemId;feedback='';if(state.inventory[u.selectedItemId]<=0){showMessage('No stock left!');render(`item-${u.selectedItemId}`);}else{dialog='item';render('item-use');}break;
      case 'use':dialog=null;u.mode='target';feedback='';render(`party-${u.selectedPartyId}`);break;
      case 'back':back();break;
      case 'field-continue':back();break;
      case 'battle-continue':
        if(u.messageIndex<state.battle.messages.length-1){u.messageIndex++;announce(state.battle.messages[u.messageIndex]);render('battle-next');break;}
        E.acknowledge(state);feedback='';if(!state.battle.outcome&&!active().hp){go('party','battle',`party-${u.selectedPartyId}`);}else render(state.battle.outcome?'battle-reset':`command-${u.command}`);break;
      case 'reset':reset();break;
      case 'command':{
        u.command=Number(el.dataset.id);feedback='';
        if(!active().hp&&u.command!==2){showMessage('Choose a living member first.');render(`command-${u.command}`);break;}
        if(u.command===0){state.battle.phase='moves';render(`move-${active().moves[u.move]?.id||active().moves[0].id}`);}
        else if(u.command===1)go('bag','battle',`item-${u.selectedItemId}`);
        else if(u.command===2)go('party','battle',`party-${u.selectedPartyId}`);
        else result(E.run(state));break;
      }
      case 'move':u.move=active().moves.findIndex(m=>m.id===el.dataset.id);result(E.attack(state,el.dataset.id));break;
    }
  });
  game.addEventListener('pointerdown',()=>{pointerDown=true;});
  document.addEventListener('pointerup',()=>{pointerDown=false;});
  document.addEventListener('pointercancel',()=>{pointerDown=false;});
  game.addEventListener('focusin',event=>{
    const el=event.target.closest('button[data-menu]');if(!el||dialog||fieldResult||pointerDown)return;
    let changed=false;
    if(el.dataset.menu==='party'&&el.dataset.id&&state.ui.selectedPartyId!==el.dataset.id){state.ui.selectedPartyId=el.dataset.id;changed=true;}
    if(el.dataset.menu==='items'&&el.dataset.id&&state.ui.selectedItemId!==el.dataset.id){state.ui.selectedItemId=el.dataset.id;state.ui.cursors[state.ui.pocket]=el.dataset.id;feedback='';changed=true;}
    if(el.dataset.menu==='commands'&&state.ui.command!==Number(el.dataset.id)){state.ui.command=Number(el.dataset.id);changed=true;}
    if(el.dataset.menu==='moves'&&el.dataset.id){const n=active().moves.findIndex(m=>m.id===el.dataset.id);if(n!==state.ui.move){state.ui.move=n;feedback='';changed=true;}}
    if(changed)render(el.dataset.key);
  });
  game.addEventListener('keydown',event=>{
    if(event.repeat&&['Enter',' '].includes(event.key)){event.preventDefault();return;}
    if(event.key==='Escape'){event.preventDefault();back();return;}
    const current=event.target.closest('button[data-menu]');if(!current)return;
    if(!['ArrowUp','ArrowDown','ArrowLeft','ArrowRight','Tab'].includes(event.key))return;
    const modal=game.querySelector('[role="dialog"]');
    if(event.key==='Tab'){
      if(!modal)return;
      const buttons=[...modal.querySelectorAll('button')],i=buttons.indexOf(current);event.preventDefault();buttons[(i+(event.shiftKey?-1:1)+buttons.length)%buttons.length].focus();return;
    }
    event.preventDefault();
    const group=current.dataset.menu;
    const buttons=[...(modal||game).querySelectorAll(`button[data-menu="${group}"]`)];
    const index=buttons.indexOf(current),delta=event.key==='ArrowUp'?-1:event.key==='ArrowDown'?1:event.key==='ArrowLeft'?-1:1;
    if(group==='pockets'){
      if(event.key==='ArrowDown'){const first=game.querySelector('[data-menu="items"]');if(first)first.focus();return;}
      changePocket(buttons[(index+delta+buttons.length)%buttons.length].dataset.id);return;
    }
    if(group==='items'&&(event.key==='ArrowLeft'||event.key==='ArrowRight')){const n=pockets.findIndex(x=>x[0]===state.ui.pocket);changePocket(pockets[(n+delta+5)%5][0]);return;}
    let step=delta;
    if((group==='commands'||group==='moves')&&current.dataset.id&&['ArrowUp','ArrowDown'].includes(event.key))step=delta*2;
    buttons[(index+step+buttons.length)%buttons.length]?.focus();
  });
  document.querySelector('.page-nav').addEventListener('click',event=>{
    const link=event.target.closest('[data-page]');if(!link)return;event.preventDefault();
    if(state.battle.phase==='moves')state.battle.phase='command';
    go(link.dataset.page,link.dataset.page==='battle'?'battle':'field');
  });
  document.getElementById('reset').addEventListener('click',reset);
  window.addEventListener('hashchange',()=>{const s=location.hash.slice(1);if(['party','bag','battle'].includes(s))go(s,s==='battle'?'battle':'field');});
  const route=location.hash.slice(1);go(['party','bag','battle'].includes(route)?route:'party',route==='battle'?'battle':'field');
  window.emeraldDemo={getState:()=>JSON.parse(JSON.stringify(state)),reset,validate:()=>E.validate(state)};
})();
