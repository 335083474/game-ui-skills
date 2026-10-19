(() => {
  const screens = [...document.querySelectorAll('[data-screen]')];
  const links = [...document.querySelectorAll('.screen-nav a')];
  const kicker = document.querySelector('#screen-kicker');
  const titles = {badges:'EQUIPMENT / FOLIO 01',items:'SUPPLIES / FIELD KIT 02','battle-orders':'BATTLE / THEATRE 03'};
  const state = {screen:'badges',badge:'Sunlit Spark',badgeCost:2,usedSlots:3,items:{'Honeycomb Tart':2,'Breeze Ribbon':1,'Pocket Ticket':3,'Daisy Seed':4},command:'Hammer',queue:0};
  const root = document.body;
  function route(id){
    const chosen = screens.some(s=>s.dataset.screen===id) ? id : 'badges';
    state.screen=chosen;
    screens.forEach(s=>{s.hidden=s.dataset.screen!==chosen});
    links.forEach(a=>{if(a.hash===`#${chosen}`) a.setAttribute('aria-current','page'); else a.removeAttribute('aria-current')});
    kicker.textContent=titles[chosen];
  }
  function setSelected(button){
    const screen=button.closest('[data-screen]');
    screen.querySelectorAll(`[data-select="${button.dataset.select}"]`).forEach(b=>{b.classList.remove('selected','chosen');b.setAttribute('aria-pressed','false')});
    button.classList.add('selected','chosen');button.setAttribute('aria-pressed','true');
    const value=button.dataset.value;
    const preview=screen.querySelector('[data-preview]'); if(preview) preview.textContent=value;
    const commit=screen.querySelector('[data-commit]');
    if(commit){commit.disabled=false;commit.textContent=commit.dataset.commit==='equip'?`Equip ${value}`:commit.dataset.commit==='use'?`Use ${value}`:`Lock ${value} on ${screen.querySelector('select').value}`}
    const result=screen.querySelector('[data-result]'); if(result) result.textContent=`${value} selected · preview only.`;
    if(screen.dataset.screen==='badges'){
      state.badge=value;state.badgeCost=value==='Leafstep'||value==='Ticket Wink'?1:2;
      screen.querySelector('[data-cost]').textContent=`0${state.badgeCost} SLOTS`;
    }
    if(screen.dataset.screen==='items'){
      state.item=value;
      screen.querySelector('[data-selected-qty]').textContent=String(state.items[value]||0).padStart(2,'0');
      const notes={'Honeycomb Tart':'Sweet, sturdy, wrapped in a square of sunshine.','Breeze Ribbon':'A paper breeze that points toward a kinder road.','Pocket Ticket':'One seat saved for a small and curious visitor.','Daisy Seed':'A tiny green beginning, packed for the long way.'};
      screen.querySelector('[data-item-note]').textContent=notes[value];
      screen.querySelector('[data-result]').textContent=`${value} selected · sample stock ${state.items[value]||0}.`;
    }
    if(screen.dataset.screen==='battle-orders'){state.command=value;}
  }
  function commit(button){
    if(button.disabled)return;
    const screen=button.closest('[data-screen]'), id=screen.dataset.screen;
    const result=screen.querySelector('[data-result]');
    if(id==='badges'){
      state.usedSlots=Math.min(6,state.usedSlots+state.badgeCost-1);
      const cap=screen.querySelector('[data-capacity]');cap.textContent=`0${state.usedSlots} / 06`;
      const pips=[...screen.querySelectorAll('.pips i')];pips.forEach((p,i)=>p.classList.toggle('filled',i<state.usedSlots));
      screen.querySelector('.pips').setAttribute('aria-label',`${state.usedSlots} of six badge slots used`);
      result.textContent=`${state.badge} is pinned in this session folio · ${6-state.usedSlots} slots remain.`;
    } else if(id==='items'){
      const item=state.item||'Honeycomb Tart';
      if((state.items[item]||0)<=0){result.textContent=`${item} pouch is empty.`;return}
      state.items[item]-=1;
      screen.querySelector(`[data-item-count="${item}"]`).textContent=`× ${state.items[item]}`;
      screen.querySelector('[data-selected-qty]').textContent=String(state.items[item]).padStart(2,'0');
      const total=Object.values(state.items).reduce((a,b)=>a+b,0);
      screen.querySelector('[data-pouch]').textContent=`${String(total).padStart(2,'0')} / 12`;
      result.textContent=`${item} used in the local preview · ${state.items[item]} remain in the pouch.`;
    } else {
      state.queue+=1;
      screen.querySelector('[data-queue]').textContent=String(state.queue).padStart(2,'0');
      const target=screen.querySelector('select').value;
      result.textContent=`${state.command} is locked on ${target} · command queue ${state.queue} (no combat simulated).`;
      button.textContent='Command queued';
    }
  }
  root.addEventListener('click',event=>{
    const select=event.target.closest('[data-select]'); if(select){setSelected(select);return}
    const commitButton=event.target.closest('[data-commit]'); if(commitButton)commit(commitButton);
  });
  document.querySelectorAll('select').forEach(select=>select.addEventListener('change',()=>{
    const screen=select.closest('[data-screen]'), command=screen.querySelector('[data-commit]');
    if(command && state.command)command.textContent=`Lock ${state.command} on ${select.value}`;
    const result=screen.querySelector('[data-result]');if(result)result.textContent=`${state.command||'Hammer'} preview · target ${select.value}.`;
  }));
  window.addEventListener('hashchange',()=>route(location.hash.slice(1)));
  const api={state,route,select:(screenId,value)=>{const screen=screens.find(s=>s.dataset.screen===screenId);const button=screen&&[...screen.querySelectorAll('[data-select]')].find(b=>!value||b.dataset.value===value);if(button)setSelected(button)},commit:screenId=>{const b=screens.find(s=>s.dataset.screen===screenId)?.querySelector('[data-commit]');if(b){if(b.disabled)b.disabled=false;commit(b)}}};
  window.GameLab=api;
  route(location.hash.slice(1)||'badges');
  screens.forEach(screen=>{const first=screen.querySelector('[data-select]');if(first)setSelected(first);screen.querySelector('[data-commit]').disabled=true;});
  route(location.hash.slice(1)||'badges');
})();
