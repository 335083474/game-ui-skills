(function(root){
  'use strict';
  const defaults=Object.freeze({volume:70,largeText:false,texture:true});
  const key='last-table-run02-settings-v1';
  function normalize(value){return {volume:Number.isFinite(value?.volume)?Math.max(0,Math.min(100,Math.round(value.volume))):70,largeText:typeof value?.largeText==='boolean'?value.largeText:false,texture:typeof value?.texture==='boolean'?value.texture:true};}
  function createSettings(storage){
    let saved={...defaults};let available=true;
    try{const raw=storage.getItem(key);if(raw)saved=normalize(JSON.parse(raw));}catch{available=false;}
    let draft={...saved};
    return {get saved(){return {...saved};},get draft(){return {...draft};},get available(){return available;},get dirty(){return JSON.stringify(saved)!==JSON.stringify(draft);},update(patch){draft=normalize({...draft,...patch});return this.draft;},cancel(){draft={...saved};return this.draft;},restore(){draft={...defaults};return this.draft;},save(){try{storage.setItem(key,JSON.stringify(draft));saved={...draft};available=true;return true;}catch{available=false;return false;}}};
  }
  const branches={
    stakes:{reply:'What is at stake tonight?',tag:'THE PRICE OF A SEAT',line:'Your chips buy a seat. Your nerve keeps it. The back room opens only to a player who knows when to walk away.',continueLabel:'Ask about the back room',end:'Then take this warning: the quietest player at that table has never lost. Watch their hands, not their smile.',outcome:'You learned who to watch.'},
    key:{reply:'Who does that blue key belong to?',tag:'A LOCKED DOOR',line:'It was my partner\'s. He left it here after his last hand. I keep the door locked until someone brings me his missing chip.',continueLabel:'Offer to look for the chip',end:'Find a green chip with a split edge. Bring it to me before the final deal, and I will open the back room myself.',outcome:'A lead recorded: find the split green chip.'},
    trust:{reply:'Why should I trust your advice?',tag:'READING THE DEALER',line:'You should not. Trust the cards you can see. But I would rather deal to a skeptic than collect from a fool.',continueLabel:'Tell her you will watch the cards',end:'Good. Keep that habit. If a deal looks too kind, ask who paid for it. Now, shall we see how carefully you play?',outcome:'Mara respects your caution.'}
  };
  const api={defaults,key,normalize,createSettings,branches};root.TableState=api;
  if(typeof module!=='undefined'&&module.exports)module.exports=api;
})(typeof globalThis!=='undefined'?globalThis:this);
