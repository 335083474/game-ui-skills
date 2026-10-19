(function(){
  const initial={gold:1240,order:"Defend the old bridge",fieldPosition:"OLD BRIDGE",orderStatus:"Captain Rowan guards the crossing.",heroName:"Captain Rowan",health:"320 / 420",healthCurrent:320,defense:11,selectedItem:"Stormguard Shield",equipped:"Bronze Kite Shield",armorChange:"+2",itemNote:"A broad oak core with a blue-steel rim. Adds two armor while equipped.",itemStatus:"Stormguard Shield is ready to equip.",signalProgress:2,signalCount:"2 / 3 MARKED",beaconLabel:"AWAITING",questStatus:"West beacon still needs a signal.",claimed:false};
  const items={"Stormguard Shield":{icon:"shield",note:"A broad oak core with a blue-steel rim. Adds two armor while equipped.",type:"equipment"},"Dawnflask":{icon:"potion",note:"A quick-use draught with a warm golden glow. Restores a little health.",type:"consumable"},"Pathfinder Token":{icon:"skill",note:"A carved charm that marks old roads and safe crossings.",type:"charm"}};
  let state=copy(initial);
  function copy(value){return JSON.parse(JSON.stringify(value))}
  function dispatch(action,value){
    if(action==="select-hero"){state.heroName=value==="Western Beacon"?"Western Beacon":"Captain Rowan";state.orderStatus=state.heroName==="Captain Rowan"?"Captain Rowan guards the crossing.":"Western Beacon selected as a field marker."}
    if(action==="issue-order"){
      const orders={"Move to Old Bridge":["Move to Old Bridge","OLD BRIDGE"],"Attack bandit camp":["Attack bandit camp","WEST CAMP"],"Hold at the ford":["Hold at the ford","THE FORD"],"Rally at Stormwatch":["Rally at Stormwatch","STORMWATCH KEEP"],"Train at the keep":["Train at the keep","STORMWATCH KEEP"],"Patrol the western road":["Patrol the western road","WEST ROAD"]};
      const picked=orders[value]||orders["Hold at the ford"];state.order=picked[0];state.fieldPosition=picked[1];state.orderStatus=state.heroName+" · order issued: "+state.order+".";
    }
    if(action==="select-item"&&items[value]){state.selectedItem=value;state.itemNote=items[value].note;state.armorChange=value==="Stormguard Shield"?"+2":items[value].type.toUpperCase();state.itemStatus=value+" selected. Review the slot before equipping."}
    if(action==="equip-item"){
      if(state.selectedItem==="Stormguard Shield"&&state.equipped!=="Stormguard Shield"){state.equipped="Stormguard Shield";state.defense+=2;state.armorChange="EQUIPPED";state.itemStatus="Stormguard Shield equipped. Defense is now "+state.defense+"."}
      else if(state.selectedItem==="Stormguard Shield"){state.itemStatus="Stormguard Shield is already equipped."}
      else{state.itemStatus=state.selectedItem+" is a "+items[state.selectedItem].type+"; it stays in the satchel."}
    }
    if(action==="mark-signal"){
      if(state.signalProgress<3){state.signalProgress=3;state.signalCount="3 / 3 MARKED";state.beaconLabel="MARKED";state.questStatus="West beacon marked. Main objective complete; claim the Watchtower Seal."}
      else{state.questStatus="All ridge fires are already marked."}
    }
    if(action==="claim-seal"){
      if(state.signalProgress>=3&&!state.claimed){state.claimed=true;state.gold+=180;state.questStatus="Watchtower Seal claimed. Rowan receives 180 gold."}
      else if(state.claimed){state.questStatus="The Watchtower Seal has already been claimed."}
      else{state.questStatus="Mark the West Beacon before claiming the seal."}
    }
    render();return copy(state)
  }
  function render(){
    if(typeof document==="undefined")return;
    document.querySelectorAll("[data-bind]").forEach(function(node){const key=node.getAttribute("data-bind");if(Object.prototype.hasOwnProperty.call(state,key)){let value=state[key];if(key==="gold")value=Number(value).toLocaleString("en-US");node.textContent=String(value)}});
    document.querySelectorAll("[data-action=select-item]").forEach(function(node){const active=node.getAttribute("data-value")===state.selectedItem;node.setAttribute("aria-pressed",String(active));node.classList.toggle("selected",active)});
    const itemIcon=items[state.selectedItem].icon;document.querySelectorAll(".item-inspect use").forEach(function(use){use.setAttribute("href","./assets/symbol-atlas.svg#"+itemIcon)});
    const heroMarker=document.querySelector(".token-hero");if(heroMarker)heroMarker.setAttribute("data-position",state.fieldPosition);
    const mark=document.querySelector("[data-action=mark-signal]");if(mark)mark.disabled=state.signalProgress>=3;
    const claim=document.querySelector("[data-action=claim-seal]");if(claim)claim.disabled=state.signalProgress<3||state.claimed;
    const west=document.querySelector('[data-bind-row="west"]');if(west)west.classList.toggle("complete",state.signalProgress>=3);
    const route=(location.hash||"#command-console").slice(1),ids=["command-console","hero-inventory","quest-log"],active=ids.indexOf(route)>=0?route:"command-console";
    document.querySelectorAll(".screen").forEach(function(screen){screen.hidden=screen.id!==active});
    document.querySelectorAll(".nav a").forEach(function(link){if(link.hash==="#"+active)link.setAttribute("aria-current","page");else link.removeAttribute("aria-current")});
  }
  if(typeof document!=="undefined"){document.addEventListener("click",function(event){const button=event.target.closest("[data-action]");if(button&&!button.disabled)dispatch(button.getAttribute("data-action"),button.getAttribute("data-value"))});window.addEventListener("hashchange",render)}
  window.GameDemo={dispatch:dispatch,getState:function(){return copy(state)},reset:function(){state=copy(initial);render();return copy(state)}};
  render();
})();
