(function(){
  const initial={selectedItem:"Cobalt Pick",tool:"Copper Axe",toolStatus:"Cobalt Pick is ready to equip.",gel:6,root:1,flasks:0,craftStatus:"Bench is clear. One flask can be made.",head:"Tin Cap",defense:6,gearStatus:"Cobalt Helm selected · +3 defense."};
  let state=copy(initial);
  function copy(value){return JSON.parse(JSON.stringify(value))}
  function dispatch(action,value){
    if(action==="inspect"){state.selectedItem=value||"Cobalt Pick";state.toolStatus=state.selectedItem+" selected for inspection."}
    if(action==="equip-tool"){state.tool=state.selectedItem;state.toolStatus=state.tool+" assigned to the quickbar tool slot."}
    if(action==="craft-flask"){
      if(state.gel>=2&&state.root>=1){state.gel-=2;state.root-=1;state.flasks+=1;state.craftStatus="Crafted 1 Glowroot Flask. Gel "+state.gel+", Glowroot "+state.root+"."}
      else{state.craftStatus="Not enough ingredients. No resources were spent."}
    }
    if(action==="equip-helm"){
      if(state.head!=="Cobalt Helm"){state.head="Cobalt Helm";state.defense+=3;state.gearStatus="Cobalt Helm equipped. Defense is now "+state.defense+"."}
      else{state.gearStatus="Cobalt Helm is already equipped."}
    }
    render();return copy(state)
  }
  function render(){
    if(typeof document==="undefined")return;
    document.querySelectorAll("[data-bind]").forEach(function(node){const key=node.getAttribute("data-bind");if(Object.prototype.hasOwnProperty.call(state,key))node.textContent=String(state[key])});
    document.querySelectorAll("[data-action=inspect]").forEach(function(node){const active=node.getAttribute("data-value")===state.selectedItem;node.setAttribute("aria-pressed",String(active));node.classList.toggle("chosen",active)});
    const craft=document.querySelector("[data-action=craft-flask]");if(craft)craft.disabled=state.gel<2||state.root<1;
    const route=(location.hash||"#inventory").slice(1),ids=["inventory","crafting","equipment"],active=ids.indexOf(route)>=0?route:"inventory";
    document.querySelectorAll(".screen").forEach(function(screen){screen.hidden=screen.id!==active});
    document.querySelectorAll(".routebar a").forEach(function(link){if(link.hash==="#"+active)link.setAttribute("aria-current","page");else link.removeAttribute("aria-current")});
  }
  if(typeof document!=="undefined"){document.addEventListener("click",function(event){const button=event.target.closest("[data-action]");if(button&&!button.disabled)dispatch(button.getAttribute("data-action"),button.getAttribute("data-value"))});window.addEventListener("hashchange",render)}
  window.GameDemo={dispatch:dispatch,getState:function(){return copy(state)},reset:function(){state=copy(initial);render();return copy(state)}};
  render();
})();
