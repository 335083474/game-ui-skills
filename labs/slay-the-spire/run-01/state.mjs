export const ITEMS = {
  potion: { name: 'Healing Draught', kind: 'Consumable', description: 'A ruby-red tonic, warm even in the coldest vault.', effect: 'Restore up to 20 HP. Consumed on use.' },
  crystal: { name: 'Verdant Crystal', kind: 'Curio', description: 'A shard of green light, patiently waiting for a worthy altar.', effect: 'Carried for a future encounter.' },
  scroll: { name: 'Sealed Scroll', kind: 'Quest item', description: 'A brittle scroll bound with the seal of the old keepers.', effect: 'Carried for a future encounter.' },
  key: { name: 'Warden’s Key', kind: 'Quest item', description: 'Heavy iron, worn smooth by hands long forgotten.', effect: 'Carried for a future encounter.' },
  relic: { name: 'Sun Relic', kind: 'Relic', description: 'A small sun on a crimson cord. Its surface remembers the daylight.', effect: 'Carried as a keepsake on this journey.' }
};
export const REWARDS = [
  { id: 'coins', name: 'The Guardian’s Purse', effect: '+50 game gold', description: 'A little weight. A few more possibilities.' },
  { id: 'potion', name: ITEMS.potion.name, effect: '+1 healing draught', description: 'Save it for a difficult stretch of the climb.' },
  { id: 'crystal', name: ITEMS.crystal.name, effect: '+1 verdant crystal', description: 'Some treasures reveal their purpose later.' }
];
export function initialState() { return { version: 1, gold: 125, hp: 58, maxHp: 65, selectedRewardId: null, claimed: false, selectedItemId: 'potion', inventory: { potion: 2, crystal: 1, scroll: 1, key: 1, relic: 0 }, offers: { potion: { price: 35, stock: 2 }, crystal: { price: 60, stock: 2 }, scroll: { price: 45, stock: 1 }, relic: { price: 140, stock: 1 } } }; }
export function selectReward(s,id) { if(s.claimed || !REWARDS.some(x=>x.id===id)) return false; s.selectedRewardId=id; return true; }
export function claimReward(s) {
  if(s.claimed) return { ok:false, message:'Your reward has already been claimed.' };
  const reward=REWARDS.find(x=>x.id===s.selectedRewardId);
  if(!reward) return { ok:false, message:'Choose one treasure before claiming it.' };
  if(reward.id==='coins') s.gold+=50; else s.inventory[reward.id]+=1;
  s.claimed=true;
  return { ok:true, message:`Claimed ${reward.name}. ${reward.effect} added to your journey.` };
}
export function potionReason(s) { return s.inventory.potion<=0?'No draughts remaining. Visit the merchant to replenish.':s.hp>=s.maxHp?'Health is full. Save your draught for later.':''; }
export function usePotion(s) {
  const reason=potionReason(s); if(reason) return {ok:false,message:reason};
  const restored=Math.min(20,s.maxHp-s.hp); s.hp+=restored; s.inventory.potion-=1;
  return {ok:true,message:`Recovered ${restored} HP. ${s.inventory.potion} ${s.inventory.potion===1?'draught remains':'draughts remain'}.`};
}
export function purchaseReason(s,id) { const offer=s.offers[id]; return !offer?'Offer unavailable.':offer.stock<=0?'Sold out — the merchant has no more.':s.gold<offer.price?`Not enough gold — need ${offer.price-s.gold} more.`:''; }
export function purchase(s,id) {
  const reason=purchaseReason(s,id); if(reason) return {ok:false,message:reason};
  const offer=s.offers[id]; s.gold-=offer.price; offer.stock-=1; s.inventory[id]+=1;
  return {ok:true,message:`Bought ${ITEMS[id].name} for ${offer.price} game gold. ${s.gold} gold remains.`};
}
export function validState(s) {
  const base=initialState();
  return !!s && s.version===1 && Number.isInteger(s.gold) && s.gold>=0 && s.maxHp===65 && Number.isInteger(s.hp) && s.hp>=0 && s.hp<=65 && typeof s.claimed==='boolean' && (s.selectedRewardId===null||REWARDS.some(r=>r.id===s.selectedRewardId)) && (!s.claimed||s.selectedRewardId!==null) && !!ITEMS[s.selectedItemId] && Object.keys(base.inventory).every(id=>Number.isInteger(s.inventory?.[id])&&s.inventory[id]>=0) && Object.keys(base.offers).every(id=>s.offers?.[id]?.price===base.offers[id].price&&Number.isInteger(s.offers[id].stock)&&s.offers[id].stock>=0&&s.offers[id].stock<=base.offers[id].stock);
}
