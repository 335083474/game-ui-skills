(function (root) {
  'use strict';
  const catalog = {
    potion: {name:'Healing potion', category:'Supplies', kind:'Consumable', price:35, description:'A small bottle of care for the road. Restores 20 HP, up to your maximum of 100.'},
    seeds: {name:'Seed packet', category:'Farm', kind:'Seed stock', price:12, description:'A tidy packet of spring seeds. Stored and counted here; planting is not part of this demo.'},
    crystal: {name:'Lucky crystal', category:'Supplies', kind:'Keepsake', price:180, description:'A bright green keepsake from the hillside. A collectible only; it does not change your luck or stats.'},
    strawberry: {name:'Sweet strawberry', category:'Farm', kind:'Produce', price:8, description:'Sun-ripened fruit, carefully packed for market. Display and collection only in this demo.'},
    'watering-can': {name:'Watering can', category:'Farm', kind:'Tool', price:70, description:'A trusty can intended for tending crops. Display only; there is no watering or crop system in this demo.'}
  };
  const rewards = {coins:{name:'Coin purse',effect:'+50 in-game coins'},potion:{name:'Healing potion',effect:'+1 potion to inventory'},crystal:{name:'Lucky crystal',effect:'+1 crystal to inventory'}};
  const initial = () => ({version:1, coins:125, hp:65, maxHp:100, reward:null, items:{potion:2,seeds:12,crystal:1,strawberry:8,'watering-can':1}, stock:{potion:4,seeds:8,crystal:1,strawberry:0,'watering-can':0}});
  const valid = s => s && s.version===1 && Number.isInteger(s.coins) && s.coins>=0 && s.maxHp===100 && Number.isInteger(s.hp) && s.hp>=0 && s.hp<=100 && (s.reward===null || Object.hasOwn(rewards,s.reward)) && ['items','stock'].every(k=>s[k] && Object.keys(catalog).every(id=>Number.isInteger(s[k][id])&&s[k][id]>=0));
  function claim(s,id) {
    if(s.reward) return {ok:false,message:'This reward has already been claimed.'};
    if(!Object.hasOwn(rewards,id)) return {ok:false,message:'Choose one reward before claiming.'};
    if(id==='coins') s.coins+=50; else s.items[id]+=1;
    s.reward=id;
    return {ok:true,message:`Claimed ${rewards[id].name}: ${rewards[id].effect}. Your reward is now collected.`};
  }
  function usePotion(s) {
    if(s.items.potion<=0) return {ok:false,message:'No potions left. Visit the general store for more.'};
    if(s.hp>=s.maxHp) return {ok:false,message:'HP is full. No potion was used.'};
    const before=s.hp; s.items.potion-=1; s.hp=Math.min(s.maxHp,s.hp+20);
    return {ok:true,message:`Used 1 potion. Restored ${s.hp-before} HP (${s.hp}/${s.maxHp}). ${s.items.potion} potions remaining.`};
  }
  function purchaseReason(s,id,q) {
    if(!Object.hasOwn(catalog,id)) return 'Choose a product.';
    if(!Number.isInteger(q)||q<1||q>99) return 'Enter a whole quantity from 1 to 99.';
    if(s.stock[id]===0) return 'Sold out for today.';
    if(q>s.stock[id]) return `Only ${s.stock[id]} in stock. Choose a smaller quantity.`;
    const cost=catalog[id].price*q;
    if(cost>s.coins) return `Not enough coins. You need ${cost-s.coins} more.`;
    return '';
  }
  function buy(s,id,q) {
    const reason=purchaseReason(s,id,q); if(reason) return {ok:false,message:reason};
    const cost=catalog[id].price*q; s.coins-=cost;s.stock[id]-=q;s.items[id]+=q;
    return {ok:true,message:`Bought ${q} × ${catalog[id].name} for ${cost} in-game coins. Added to your inventory.`};
  }
  const api={catalog,rewards,initial,valid,claim,usePotion,purchaseReason,buy};
  if(typeof module!=='undefined'&&module.exports) module.exports=api; else root.FarmState=api;
})(typeof window!=='undefined'?window:globalThis);
