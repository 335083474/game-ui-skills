(() => {
  'use strict';
  const M=window.FarmState, key='fern-hollow-run01-v1';
  let state=M.initial(), selectedReward=null, selectedItem='potion', selectedProduct='potion', category='All', quantity=1;
  try {const saved=JSON.parse(sessionStorage.getItem(key));if(M.valid(saved)) state=saved;} catch (_) {}
  const screen=document.getElementById('screen'), status=document.getElementById('announcement');
  const icon=(id,size='')=>`<span class="svui-icon ${size?'svui-icon--'+size:''} svui-icon--${id}" aria-hidden="true"></span>`;
  const wallet=()=>`<div class="svui-wallet" aria-label="${state.coins} fictional in-game coins">${icon('coins','small')}<strong data-wallet>${state.coins}</strong><small>IN-GAME<br>COINS</small></div>`;
  const health=()=>`<div class="health"><div><span>HP</span><strong>${state.hp} / ${state.maxHp}</strong></div><div class="hp-track" role="meter" aria-label="Health" aria-valuenow="${state.hp}" aria-valuemin="0" aria-valuemax="${state.maxHp}"><span style="width:${state.hp}%"></span></div></div>`;
  function route(){return ['reward','inventory','shop'].includes(location.hash.slice(1))?location.hash.slice(1):'reward';}
  function save(){try{sessionStorage.setItem(key,JSON.stringify(state));}catch(_){status.textContent='Storage is unavailable. Progress lasts until this page reloads.';}}
  function notify(result){status.textContent=result.message;save();render();}
  function header(kicker,title,note){return `<header class="page-header"><div><p class="svui-kicker">${kicker}</p><h1 class="svui-heading">${title}</h1><p class="svui-subtitle">${note}</p></div><div class="header-status">${health()}${wallet()}</div></header>`;}
  function renderReward(){
    const selected=state.reward||selectedReward;
    return `<div class="reward-screen">${header('A good day’s work','Choose a little reward','One gift for the road. Pick your favorite, then make it yours.')}<div class="ceremony-divider"><span>✦</span> A THANK-YOU FROM FERN HOLLOW <span>✦</span></div><div class="svui-grid-three reward-choices">${Object.entries(M.rewards).map(([id,r],i)=>`<button type="button" data-reward="${id}" class="svui-card reward-card ${selected===id?'is-selected':''}" aria-pressed="${selected===id}" ${state.reward?'disabled':''}><span class="choice-number">0${i+1}</span>${icon(id,'large')}<span class="svui-card-title">${r.name}</span><span class="reward-effect">${r.effect}</span><span class="svui-card-note">${id==='coins'?'A little extra for market day.':id==='potion'?'Save it for when you need it.':'Something lovely to take home.'}</span><span class="svui-marker ${selected===id?'':'svui-marker--quiet'}">${selected===id?(state.reward?'✓ Claimed':'✓ Selected'):(state.reward?'Reward already claimed':'Select this gift')}</span></button>`).join('')}</div><div class="reward-confirm"><p id="claim-reason">${state.reward?`Collected: ${M.rewards[state.reward].effect}. Your shared balance and inventory are updated.`:selectedReward?`Ready to collect: ${M.rewards[selectedReward].effect}.`:'Choose one gift above to enable claiming.'}</p><button type="button" class="svui-button" id="claim-reward" ${state.reward||!selectedReward?'disabled':''} aria-describedby="claim-reason">${state.reward?'Reward collected ✓':'Claim selected reward'}</button>${state.reward?'<a class="next-link" href="#inventory">Open your inventory →</a>':'<small>Selection alone does not collect a reward.</small>'}</div></div>`;
  }
  function renderInventory(){
    const visible=Object.entries(M.catalog).filter(([,i])=>category==='All'||i.category===category);
    if(!visible.some(([id])=>id===selectedItem)) selectedItem=visible[0]?.[0]||null;
    const item=M.catalog[selectedItem];
    return `${header('The things you carry','Your satchel','Keep a little care, a little harvest, and room for what comes next.')}<div class="inventory-layout"><section class="inventory-tray" aria-label="Inventory items"><div class="tray-toolbar"><div class="category-tabs" aria-label="Item category">${['All','Supplies','Farm'].map(c=>`<button type="button" data-category="${c}" class="tab-button" aria-pressed="${category===c}">${c}${category===c?' ✓':''}</button>`).join('')}</div><span class="svui-caption">${visible.length} item types</span></div><div class="inventory-grid">${visible.map(([id,i])=>`<div class="inventory-cell"><button type="button" class="svui-slot" data-item="${id}" aria-pressed="${selectedItem===id}" aria-label="${i.name}, quantity ${state.items[id]}${selectedItem===id?', selected':''}">${icon(id)}<span class="svui-count">${state.items[id]}</span>${selectedItem===id?'<span class="slot-tick" aria-hidden="true">✓</span>':''}</button><span class="svui-slot-name">${selectedItem===id?'✓ ':''}${i.name}</span></div>`).join('')}${Array.from({length:Math.max(1,6-visible.length)},()=>'<div class="inventory-cell empty-cell"><div class="empty-slot" aria-label="Empty inventory slot"><span>+</span></div><span class="svui-slot-name">Empty</span></div>').join('')}</div><p class="tray-note">A place for everything.<br><span>Tools and farm stock are shown for collection and reference.</span></p></section><aside class="detail-pane" aria-label="Selected item detail"><div class="detail-art">${icon(selectedItem,'large')}</div><p class="svui-kicker">${item.kind}</p><h2>${item.name}</h2><div class="detail-owned">In your satchel <strong>${state.items[selectedItem]}</strong></div><p class="description">${item.description}</p>${selectedItem==='potion'?`${health()}<button type="button" class="svui-button" id="use-potion" ${state.hp>=state.maxHp||state.items.potion<=0?'disabled':''} aria-describedby="use-reason">Use 1 potion · +20 HP</button><p class="action-reason" id="use-reason">${state.items.potion<=0?'No potions left. Pick up more at the store.':state.hp>=state.maxHp?'HP is full. No potion will be consumed.':'Uses one potion. Healing stops at 100 HP.'}</p>`:'<div class="info-stamp">Collection item<br><span>No use action in this demo</span></div>'}<a class="next-link" href="#shop">Visit the general store →</a></aside></div>`;
  }
  function renderShop(){
    const item=M.catalog[selectedProduct];
    return `${header('Open until sundown','Fern Hollow general store','A few useful things, a friendly counter, and fair in-game prices.')}<div class="shop-welcome"><span class="shop-sign">TODAY’S SHELVES</span><p>“Take your time. There’s always room for one more seed packet.”</p><span>— The shopkeeper</span></div><div class="shop-layout"><section class="catalog" aria-label="Products"><div class="catalog-labels"><span>GOODS</span><span>PRICE / STOCK</span></div>${Object.entries(M.catalog).map(([id,i])=>`<button type="button" data-product="${id}" class="product-row ${selectedProduct===id?'selected-product':''}" aria-pressed="${selectedProduct===id}"><span class="product-art">${icon(id)}</span><span class="product-name"><strong>${i.name}</strong><small>${i.kind} · Owned ${state.items[id]}</small><span class="product-state">${selectedProduct===id?'✓ Selected · ':''}${state.stock[id]===0?'Sold out':state.coins<i.price?'Not enough coins':'Available today'}</span></span><span class="product-price"><strong>${i.price}</strong><small>in-game coins</small><span>${state.stock[id]} in stock</span></span></button>`).join('')}</section><aside class="detail-pane transaction" aria-label="Purchase detail"><p class="svui-kicker">At the counter</p><div class="detail-art">${icon(selectedProduct,'large')}</div><h2>${item.name}</h2><p class="description">${item.description}</p><div class="purchase-facts"><span>Owned <strong>${state.items[selectedProduct]}</strong></span><span>In stock <strong>${state.stock[selectedProduct]}</strong></span></div><label for="purchase-quantity">Quantity</label><div class="quantity-control"><button type="button" data-quantity="-1" aria-label="Decrease purchase quantity">−</button><input id="purchase-quantity" type="number" min="1" max="99" step="1" value="${quantity}" inputmode="numeric"><button type="button" data-quantity="1" aria-label="Increase purchase quantity">+</button></div><div class="total-row"><span>Total</span><strong id="purchase-total"></strong></div><p class="balance-note">Your balance: <strong>${state.coins} in-game coins</strong></p><button type="button" class="svui-button" id="buy-item" aria-describedby="purchase-reason">Buy item</button><p class="action-reason" id="purchase-reason"></p><div class="shop-fineprint">Paid with fictional game coins.<br>Purchases go straight to your satchel.</div></aside></div>`;
  }
  function updatePurchase(){
    const reason=M.purchaseReason(state,selectedProduct,quantity), valid=Number.isInteger(quantity)&&quantity>0&&quantity<=99;
    document.getElementById('purchase-total').textContent=valid?`${quantity*M.catalog[selectedProduct].price} coins`:'—';
    const button=document.getElementById('buy-item');button.disabled=!!reason;button.textContent=state.stock[selectedProduct]===0?'Sold out':reason?'Purchase unavailable':`Buy ${quantity} × ${M.catalog[selectedProduct].name}`;
    document.getElementById('purchase-reason').textContent=reason||`Leaves ${state.coins-quantity*M.catalog[selectedProduct].price} in-game coins in your purse.`;
  }
  function render(){
    const active=document.activeElement;
    const focusSelector=screen.contains(active)&&active.tagName==='BUTTON' ? (active.id?'#'+active.id:['reward','category','item','product'].map(k=>active.dataset[k]?'[data-'+k+'="'+active.dataset[k]+'"]':'').find(Boolean)) : null;
    const current=route();document.querySelectorAll('[data-route]').forEach(a=>{if(a.dataset.route===current)a.setAttribute('aria-current','page');else a.removeAttribute('aria-current');});
    screen.dataset.screen=current;screen.innerHTML=current==='inventory'?renderInventory():current==='shop'?renderShop():renderReward();
    if(current==='shop') updatePurchase();
    if(focusSelector){const replacement=screen.querySelector(focusSelector);if(replacement&&!replacement.disabled)replacement.focus({preventScroll:true});}
    document.title=`${current==='reward'?'Reward':current==='inventory'?'Inventory':'General store'} · Fern Hollow`;
  }
  screen.addEventListener('click',e=>{
    const el=e.target.closest('button');if(!el||el.disabled)return;
    if(el.dataset.reward){selectedReward=el.dataset.reward;render();}
    else if(el.id==='claim-reward')notify(M.claim(state,selectedReward));
    else if(el.dataset.category){category=el.dataset.category;render();}
    else if(el.dataset.item){selectedItem=el.dataset.item;render();}
    else if(el.id==='use-potion')notify(M.usePotion(state));
    else if(el.dataset.product){selectedProduct=el.dataset.product;quantity=1;render();}
    else if(el.dataset.quantity){quantity=Math.max(1,Math.min(99,(Number.isInteger(quantity)?quantity:1)+Number(el.dataset.quantity)));document.getElementById('purchase-quantity').value=quantity;updatePurchase();}
    else if(el.id==='buy-item')notify(M.buy(state,selectedProduct,quantity));
  });
  screen.addEventListener('input',e=>{if(e.target.id==='purchase-quantity'){quantity=e.target.value===''?NaN:Number(e.target.value);updatePurchase();}});
  document.getElementById('reset-session').addEventListener('click',()=>{state=M.initial();selectedReward=null;selectedItem='potion';selectedProduct='potion';quantity=1;category='All';notify({message:'Demo reset. 125 coins, 65/100 HP, 2 potions, and a fresh reward.'});});
  window.addEventListener('hashchange',()=>{render();screen.focus({preventScroll:true});});
  render();save();
})();
