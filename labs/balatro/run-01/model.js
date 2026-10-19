(function (root) {
  'use strict';
  const offers = {
    potion: { price: 8, stock: 3 },
    crystal: { price: 12, stock: 1 },
    key: { price: 6, stock: 2 }
  };
  function fresh() {
    return { version: 1, coins: 24, hp: 32, maxHp: 60, luck: 1,
      rewardClaimed: false, rewardId: null,
      inventory: { potion: 2, crystal: 1, heart: 1, key: 1, chips: 3 },
      stock: { potion: 3, crystal: 1, key: 2 } };
  }
  function valid(s) {
    const int = n => Number.isSafeInteger(n) && n >= 0;
    return !!s && s.version === 1 && int(s.coins) && int(s.hp) && s.maxHp === 60 && s.hp <= s.maxHp && int(s.luck)
      && typeof s.rewardClaimed === 'boolean' && (s.rewardId === null || ['coins', 'potion', 'crystal'].includes(s.rewardId))
      && s.inventory && Object.keys(fresh().inventory).every(k => int(s.inventory[k]))
      && s.stock && Object.keys(offers).every(k => int(s.stock[k]) && s.stock[k] <= offers[k].stock);
  }
  function claim(s, id) {
    if (s.rewardClaimed) return { ok: false, message: 'Reward already claimed. One reward per adventure.' };
    if (!['coins', 'potion', 'crystal'].includes(id)) return { ok: false, message: 'Choose a reward first.' };
    let message;
    if (id === 'coins') { s.coins += 50; message = 'Reward claimed! +50 coins added to your purse.'; }
    if (id === 'potion') { const gain = Math.min(20, s.maxHp - s.hp); s.hp += gain; message = `Reward claimed! Restored ${gain} HP. Health: ${s.hp}/${s.maxHp}.`; }
    if (id === 'crystal') { s.inventory.crystal++; s.luck++; message = 'Reward claimed! Lucky crystal collected. Luck +1.'; }
    s.rewardClaimed = true; s.rewardId = id;
    return { ok: true, message };
  }
  function potionReason(s) { return s.inventory.potion <= 0 ? 'No potions left' : s.hp >= s.maxHp ? 'Health is already full' : ''; }
  function usePotion(s) {
    const reason = potionReason(s);
    if (reason) return { ok: false, message: reason + '.' };
    const gain = Math.min(20, s.maxHp - s.hp); s.hp += gain; s.inventory.potion--;
    return { ok: true, message: `Potion used! Restored ${gain} HP. ${s.inventory.potion} potion${s.inventory.potion === 1 ? '' : 's'} left.` };
  }
  function buyReason(s, id) {
    if (!offers[id]) return 'Unknown item';
    if (s.stock[id] <= 0) return 'Sold out';
    if (s.coins < offers[id].price) return `Need ${offers[id].price - s.coins} more coins`;
    return '';
  }
  function buy(s, id) {
    const reason = buyReason(s, id);
    if (reason) return { ok: false, message: reason + '.' };
    s.coins -= offers[id].price; s.stock[id]--; s.inventory[id]++;
    if (id === 'crystal') s.luck++;
    return { ok: true, message: `Purchased ${id === 'potion' ? 'Healing potion' : id === 'crystal' ? 'Lucky crystal' : 'Silver key'} for ${offers[id].price} coins. Added to inventory.` };
  }
  const api = { fresh, valid, claim, usePotion, potionReason, buy, buyReason, offers };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.LuckyTrail = api;
})(typeof window !== 'undefined' ? window : globalThis);
