(function () {
  'use strict';
  const M = window.LuckyTrail;
  const storageKey = 'lucky-trail-balatro-run-01-v1';
  let state = M.fresh();
  let storageAvailable = true;
  try { const saved = JSON.parse(localStorage.getItem(storageKey)); if (M.valid(saved)) state = saved; }
  catch (_) { storageAvailable = false; }
  const ui = { reward: state.rewardId || 'potion', selected: 'potion', filter: 'all' };
  const items = {
    potion: { name: 'Healing potion', short: 'Potion', category: 'supplies', tag: 'CONSUMABLE', effect: 'Restore 20 HP', description: 'A little courage in a bottle. Restores 20 health, up to your maximum of 60.', action: 'Use potion' },
    crystal: { name: 'Lucky crystal', short: 'Crystal', category: 'treasures', tag: 'PASSIVE', effect: '+1 luck each', description: 'Every crystal in your pack adds one luck. Its effect is active while you carry it.', action: 'Already active' },
    heart: { name: 'Royal heart', short: 'Heart', category: 'treasures', tag: 'KEEPSAKE', effect: 'A trusty keepsake', description: 'A crowned heart from your first victory. Keep it close on the long road ahead.', action: 'Keepsake only' },
    key: { name: 'Silver key', short: 'Key', category: 'supplies', tag: 'UTILITY', effect: 'For a future locked chest', description: 'A key for a chest further along the trail. There is no locked chest in this stop.', action: 'No chest nearby' },
    chips: { name: 'Green chips', short: 'Chips', category: 'treasures', tag: 'COLLECTIBLE', effect: 'A souvenir from the table', description: 'Three lucky table chips. Collectibles stay in your pack; they cannot be spent as coins.', action: 'Collectible only' }
  };
  const screen = document.querySelector('#screen');
  function icon(id) { return `<span class="bui-icon" data-item="${id}" aria-hidden="true"></span>`; }
  function route() { return ['reward', 'inventory', 'shop'].includes(location.hash.slice(1)) ? location.hash.slice(1) : 'reward'; }
  function save() { try { localStorage.setItem(storageKey, JSON.stringify(state)); } catch (_) { storageAvailable = false; } }
  function feedback(message, ok) {
    const el = document.querySelector('#feedback');
    el.textContent = message + (storageAvailable ? '' : ' This session is held in memory; browser storage is unavailable.');
    el.classList.toggle('success', !!ok);
  }
  function hud() {
    document.querySelector('#hud').innerHTML = `<div class="bui-counter">${icon('coins')}<span class="hud-label">COINS</span><strong class="bui-price">${state.coins}</strong></div><div class="bui-counter health-counter"><span class="hud-label">HP</span><strong>${state.hp} / ${state.maxHp}</strong><div class="bui-meter" role="meter" aria-label="Health" aria-valuemin="0" aria-valuemax="60" aria-valuenow="${state.hp}"><span style="width:${state.hp / state.maxHp * 100}%"></span></div></div><div class="bui-counter luck-counter"><span class="hud-label">LUCK</span><strong>+${state.luck}</strong></div>`;
  }
  function heading(kicker, title, text, tag, sub) {
    return `<header class="screen-heading"><div><p class="bui-label">${kicker}</p><h1 class="bui-title">${title}</h1><p>${text}</p></div><div class="round-tag"><small>${sub}</small>${tag}</div></header>`;
  }
  function reward() {
    const choices = [
      { id: 'coins', suit: '♠', name: 'Coin purse', effect: '+50 coins' },
      { id: 'potion', suit: '♥', name: 'Healing potion', effect: 'Restore 20 HP' },
      { id: 'crystal', suit: '♣', name: 'Lucky crystal', effect: '+1 luck' }
    ];
    return heading('VICTORY / THE CROSSROADS', 'Choose your reward', 'One good find. One step further along the trail.', state.rewardClaimed ? 'CLAIMED' : 'PICK ONE', 'ROUND 01') +
      `<div class="reward-grid" role="group" aria-label="Reward choices">${choices.map(c => `<button class="bui-card reward-card ${ui.reward === c.id ? 'is-selected' : ''}" data-reward="${c.id}" aria-pressed="${ui.reward === c.id}" ${state.rewardClaimed ? 'disabled' : ''}><span class="bui-suit" aria-hidden="true">${c.suit}</span>${icon(c.id)}<span class="bui-card-title">${c.name}</span><span class="bui-card-value">${c.effect}</span><span class="card-marker ${ui.reward === c.id ? 'bui-selected' : ''}">${ui.reward === c.id ? (state.rewardClaimed ? '✓ CLAIMED' : '✓ SELECTED') : 'CHOOSE'}</span></button>`).join('')}</div>` +
      `<div class="reward-controls"><button id="claim" class="bui-button" ${state.rewardClaimed ? 'disabled' : ''}>${state.rewardClaimed ? 'Reward claimed' : 'Claim reward'}</button>${state.rewardClaimed ? '<a href="#inventory" class="bui-button is-secondary nav-next">Open inventory →</a>' : ''}<p class="action-help">${state.rewardClaimed ? 'Your reward has been applied. Reset adventure to choose again.' : 'Select a card, then claim. Healing applies immediately; crystals stay in your pack.'}</p></div>`;
  }
  function filteredItems() { return Object.keys(items).filter(id => ui.filter === 'all' || items[id].category === ui.filter); }
  function inventory() {
    const visible = filteredItems();
    if (!visible.includes(ui.selected)) ui.selected = visible[0] || null;
    const total = Object.values(state.inventory).reduce((a,b) => a+b,0);
    const slots = visible.map(id => `<div class="slot-wrap"><button class="bui-slot ${ui.selected === id ? 'is-selected' : ''}" data-inventory="${id}" aria-pressed="${ui.selected === id}" aria-label="${items[id].name}, quantity ${state.inventory[id]}${ui.selected === id ? ', selected' : ''}">${icon(id)}${ui.selected === id ? '<span class="slot-selected" aria-hidden="true">✓</span>' : ''}<span class="slot-count">×${state.inventory[id]}</span></button><span class="slot-name">${items[id].short}</span></div>`);
    while (slots.length < 12) slots.push('<div class="slot-wrap"><div class="bui-slot is-empty" aria-label="Empty slot"><span class="empty-mark" aria-hidden="true">+</span></div><span class="slot-name">Empty</span></div>');
    const item = items[ui.selected];
    const reason = ui.selected === 'potion' ? M.potionReason(state) : item.action;
    const detail = `<section class="bui-card detail-card" aria-label="Selected item details"><div class="detail-top">${icon(ui.selected)}<div><span class="bui-label">${item.tag}</span><h2 class="bui-card-title">${item.name}</h2><span class="bui-selected">✓ SELECTED</span></div></div><p>${item.description}</p><div class="detail-stats"><span>In your pack</span><strong>×${state.inventory[ui.selected]}</strong></div><button id="use" class="bui-button" ${reason ? 'disabled' : ''}>${reason || item.action}</button><p class="action-help">${ui.selected === 'potion' ? (reason ? reason + '. Buy supplies at the shop or reset to replay.' : 'Consumes one potion. Any healing beyond full health is unused.') : item.effect + ' · No use action at this stop.'}</p></section>`;
    return heading('YOUR GEAR / READY FOR THE ROAD', 'Inventory', 'Travel light. Keep the lucky things.', `${total} ITEMS`, 'IN YOUR PACK') +
      `<div class="inventory-layout"><section class="bui-panel inventory-panel" aria-label="Inventory slots"><div class="panel-top"><h2>Your pack</h2><span>${Object.keys(items).length} / 12 slots</span></div><div class="filters" role="group" aria-label="Item categories">${[['all','All items'],['supplies','Supplies'],['treasures','Treasures']].map(([id,label]) => `<button class="filter" data-filter="${id}" aria-pressed="${ui.filter === id}">${label}</button>`).join('')}</div><div class="slots">${slots.join('')}</div><p class="capacity">Select a slot to inspect its contents.</p></section>${detail}</div>`;
  }
  function shop() {
    return heading('THE WAYSIDE / TRADING POST', 'A little preparation', 'Spend a few coins. Go a little further.', 'OPEN', 'TRADING POST') +
      `<div class="shop-layout"><aside class="bui-panel merchant">${icon('coins')}<div><h2>Your purse</h2><p>Good supplies.<br>Fair prices.<br>Limited stock.</p><strong class="bui-price">${state.coins} coins</strong></div><a href="#inventory" class="bui-button is-secondary">Leave shop →</a></aside><section aria-label="Items for sale"><div class="shelf">${Object.keys(M.offers).map(id => {
        const item = items[id], reason = M.buyReason(state,id);
        return `<article class="bui-card shop-offer">${icon(id)}<div class="offer-copy"><h2 class="bui-card-title">${item.name}</h2><p>${item.effect}</p><span class="stock">${state.stock[id]} in stock · You own ${state.inventory[id]}</span></div><div class="buy-column"><span class="bui-price">${M.offers[id].price} coins</span><button class="bui-button" data-buy="${id}" ${reason ? 'disabled' : ''} aria-label="${reason ? reason + ': ' : 'Buy '}${item.name}">${reason ? (state.stock[id] === 0 ? 'Sold out' : 'Too costly') : 'Buy item'}</button>${reason ? `<span class="buy-reason">${reason}</span>` : ''}</div></article>`;
      }).join('')}</div><p class="shop-footnote">All purchases go to your pack. Crystal luck applies immediately.</p></section></div>`;
  }
  function render() {
    const current = route();
    document.title = `Lucky Trail — ${current.charAt(0).toUpperCase() + current.slice(1)}`;
    hud();
    document.querySelectorAll('[data-route]').forEach(a => { if (a.dataset.route === current) a.setAttribute('aria-current','page'); else a.removeAttribute('aria-current'); });
    screen.innerHTML = ({reward,inventory,shop})[current]();
  }
  function perform(result, focusSelector) { save(); render(); feedback(result.message, result.ok); if (focusSelector) screen.querySelector(focusSelector)?.focus(); }
  screen.addEventListener('click', e => {
    const target = e.target.closest('button'); if (!target || target.disabled) return;
    if (target.dataset.reward) { ui.reward = target.dataset.reward; render(); screen.querySelector(`[data-reward="${ui.reward}"]`).focus(); }
    if (target.dataset.inventory) { ui.selected = target.dataset.inventory; render(); screen.querySelector(`[data-inventory="${ui.selected}"]`).focus(); }
    if (target.dataset.filter) { ui.filter = target.dataset.filter; render(); screen.querySelector(`[data-filter="${ui.filter}"]`).focus(); }
    if (target.id === 'claim') perform(M.claim(state,ui.reward),'.nav-next');
    if (target.id === 'use' && ui.selected === 'potion') perform(M.usePotion(state),'[data-inventory="potion"]');
    if (target.dataset.buy) perform(M.buy(state,target.dataset.buy),`[data-buy="${target.dataset.buy}"]:not(:disabled)`);
  });
  document.querySelector('#reset').addEventListener('click',() => {
    state = M.fresh(); ui.reward = 'potion'; ui.selected = 'potion'; ui.filter = 'all';
    save(); render(); feedback('Adventure reset. 24 coins, 32/60 HP, 2 potions. Reward and shop stock restored.',true);
  });
  window.addEventListener('hashchange', () => { render(); feedback('The trail is yours. Make your next move.',false); });
  if (!location.hash || !['#reward','#inventory','#shop'].includes(location.hash)) history.replaceState(null,'','#reward');
  render();
  if (!storageAvailable) feedback('Ready to play.',false);
})();
