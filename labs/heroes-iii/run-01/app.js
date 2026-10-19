(function(){
  const initial={gold:1240,selectedStack:"Griffins",formation:"1 · Vanguard",ranks:{Griffins:"1 · Vanguard",Wardens:"2 · Support",Sentinels:"3 · Rear"},heroStatus:"Griffins already hold the vanguard.",creature:"Gate Wardens",wardens:14,griffins:6,sentinels:2,rawCost:480,cost:"480 gold",recruitStatus:"Three Gate Wardens are available for this order.",recruited:0,school:"AIR",spellSchool:"AIR MAGIC",spell:"Wayfinder's Mark",spellCost:4,spellNote:"A light wind remembers the trail and turns toward the nearest safe road.",mana:18,prepared:"None yet",spellStatus:"Wayfinder's Mark is ready to memorize."};
  const creatures={"Gate Wardens":{cost:160,stock:"wardens",icon:"blade"},"Cloud Griffins":{cost:320,stock:"griffins",icon:"griffin"},"Stone Sentinels":{cost:500,stock:"sentinels",icon:"tower"}};
  const spellData={"Wayfinder's Mark":{cost:4,school:"AIR",note:"A light wind remembers the trail and turns toward the nearest safe road.",icon:"rune"},"Gale Ward":{cost:5,school:"AIR",note:"A firm current turns aside one troubling strike and steadies the front rank.",icon:"blade"},"Sky Lantern":{cost:3,school:"AIR",note:"A silver mote rises above the path and reveals the safe way through.",icon:"griffin"},"Stone Call":{cost:6,school:"EARTH",note:"The old stones answer, strengthening a friendly line for the next clash.",icon:"tower"},"Quiet Passage":{cost:4,school:"WATER",note:"A clear ribbon of water marks a calm crossing through the lowlands.",icon:"rune"},"Bright Ember":{cost:5,school:"FIRE",note:"A small bright spark flares at the edge of the field, then fades.",icon:"blade"}};
  const schoolFirst={AIR:"Wayfinder's Mark",EARTH:"Stone Call",WATER:"Quiet Passage",FIRE:"Bright Ember"};
  let state=copy(initial);
  function copy(value){return JSON.parse(JSON.stringify(value))}
  function dispatch(action,value){
    if(action==="select-stack"&&state.ranks[value]){state.selectedStack=value;state.formation=state.ranks[value];state.heroStatus=value+" selected · "+state.formation+"."}
    if(action==="move-front"){
      const current=state.ranks[state.selectedStack];
      if(current==="1 · Vanguard"){state.heroStatus=state.selectedStack+" already holds the vanguard."}
      else{const front=Object.keys(state.ranks).find(function(key){return state.ranks[key]==="1 · Vanguard"});state.ranks[front]=current;state.ranks[state.selectedStack]="1 · Vanguard";state.formation="1 · Vanguard";state.heroStatus=state.selectedStack+" moved to the vanguard. "+front+" now hold rank "+current.charAt(0)+"."}
    }
    if(action==="select-creature"&&creatures[value]){state.creature=value;state.rawCost=creatures[value].cost*3;state.cost=String(state.rawCost)+" gold";state.recruitStatus="Three "+value+" are available for this order."}
    if(action==="recruit-three"){
      const unit=creatures[state.creature],available=state[unit.stock];
      if(state.gold>=state.rawCost&&available>=3){state.gold-=state.rawCost;state[unit.stock]-=3;state.recruited+=3;state.recruitStatus="Recruited 3 "+state.creature+" for "+state.rawCost+" gold. "+state.gold.toLocaleString("en-US")+" gold remain."}
      else{state.recruitStatus="Not enough stock or gold for 3 "+state.creature+". No resources were spent."}
    }
    if(action==="select-school"&&schoolFirst[value.toUpperCase()]){state.school=value.toUpperCase();setSpell(schoolFirst[state.school]);state.spellStatus=state.spell+" is ready to memorize."}
    if(action==="select-spell"&&spellData[value]){setSpell(value);state.school=spellData[value].school;state.spellStatus=state.spell+" is ready to memorize."}
    if(action==="memorize"){
      if(state.prepared===state.spell){state.spellStatus=state.spell+" is already prepared."}
      else if(state.mana>=state.spellCost){state.mana-=state.spellCost;state.prepared=state.spell;state.spellStatus="Memorized "+state.spell+". "+state.mana+" mana remains."}
      else{state.spellStatus="Not enough mana to memorize "+state.spell+"."}
    }
    render();return copy(state)
  }
  function setSpell(name){const info=spellData[name];state.spell=name;state.spellCost=info.cost;state.spellNote=info.note;state.spellSchool=info.school+" MAGIC"}
  function render(){
    if(typeof document==="undefined")return;
    document.querySelectorAll("[data-bind]").forEach(function(node){const key=node.getAttribute("data-bind");if(Object.prototype.hasOwnProperty.call(state,key)){let value=state[key];if(key==="gold")value=Number(value).toLocaleString("en-US");node.textContent=String(value)}});
    document.querySelectorAll("[data-action=select-stack]").forEach(function(node){node.setAttribute("aria-pressed",String(node.getAttribute("data-value")===state.selectedStack))});
    document.querySelectorAll("[data-action=select-creature]").forEach(function(node){node.setAttribute("aria-pressed",String(node.getAttribute("data-value")===state.creature))});
    document.querySelectorAll("[data-action=select-spell]").forEach(function(node){const active=node.getAttribute("data-value")===state.spell;node.setAttribute("aria-pressed",String(active));node.classList.toggle("selected",active)});
    document.querySelectorAll("[data-action=select-school]").forEach(function(node){const active=node.getAttribute("data-value").toUpperCase()===state.school;node.setAttribute("aria-pressed",String(active));node.classList.toggle("active",active)});
    const stock=creatures[state.creature].stock,btn=document.querySelector("[data-action=recruit-three]");if(btn)btn.disabled=state.gold<state.rawCost||state[stock]<3;
    const memo=document.querySelector("[data-action=memorize]");if(memo)memo.disabled=state.prepared===state.spell||state.mana<state.spellCost;
    const iconFor={"Gate Wardens":"blade","Cloud Griffins":"griffin","Stone Sentinels":"tower"};
    const uses=document.querySelectorAll(".selected-creature use");uses.forEach(function(use){use.setAttribute("href","./assets/symbol-atlas.svg#"+iconFor[state.creature])});
    const spellIcon=document.querySelector(".spell-art use");if(spellIcon)spellIcon.setAttribute("href","./assets/symbol-atlas.svg#"+spellData[state.spell].icon);
    const route=(location.hash||"#hero-sheet").slice(1),ids=["hero-sheet","town-recruitment","spellbook"],active=ids.indexOf(route)>=0?route:"hero-sheet";
    document.querySelectorAll(".screen").forEach(function(screen){screen.hidden=screen.id!==active});
    document.querySelectorAll(".tabs a").forEach(function(link){if(link.hash==="#"+active)link.setAttribute("aria-current","page");else link.removeAttribute("aria-current")});
  }
  if(typeof document!=="undefined"){document.addEventListener("click",function(event){const button=event.target.closest("[data-action]");if(button&&!button.disabled)dispatch(button.getAttribute("data-action"),button.getAttribute("data-value"))});window.addEventListener("hashchange",render)}
  window.GameDemo={dispatch:dispatch,getState:function(){return copy(state)},reset:function(){state=copy(initial);render();return copy(state)}};
  render();
})();


