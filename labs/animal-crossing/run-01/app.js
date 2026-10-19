(function(){
  const initial={cones:7,shells:5,fiber:2,chimes:0,selectedPocket:"Cedar Cone",destination:"North Grove",destinationNote:"Listen for the cicadas beneath the old cedar trees.",pocketStatus:"Selected: Cedar Cone × 7.",diyStatus:"Ingredients are ready. Your hands are free.",mapStatus:"A little walk to North Grove is planned."};
  const notes={"North Grove":"Listen for the cicadas beneath the old cedar trees.","South Dock":"Watch the silver boats drift in with the tide.","Cove Garden":"Follow the sweet scent of mint and warm soil."};
  let state=copy(initial);
  function copy(value){return JSON.parse(JSON.stringify(value))}
  function dispatch(action,value){
    if(action==="select-pocket"){state.selectedPocket=value||"Cedar Cone";state.pocketStatus="Selected: "+state.selectedPocket+" × "+(state.selectedPocket==="Cedar Cone"?state.cones:state.selectedPocket==="Shell"?state.shells:state.selectedPocket==="Tidefish"?2:1)+"."}
    if(action==="place-item"){
      if(state.selectedPocket==="Cedar Cone"&&state.cones>0){state.cones-=1;state.pocketStatus="Cedar Cone placed beside the north path. "+state.cones+" remain."}
      else{state.pocketStatus="Choose a Cedar Cone before placing it."}
    }
    if(action==="make-chime"){
      if(state.shells>=3&&state.fiber>=1){state.shells-=3;state.fiber-=1;state.chimes+=1;state.diyStatus="Made 1 Shell Wind Chime. "+state.shells+" shells and "+state.fiber+" twine remain."}
      else{state.diyStatus="The recipe needs 3 shells and 1 twine. Nothing was used."}
    }
    if(action==="select-destination"&&notes[value]){state.destination=value;state.destinationNote=notes[value];state.mapStatus="Ready to set a walk to "+value+"."}
    if(action==="set-destination"){state.mapStatus="Route set to "+state.destination+". Pack a light lunch and go."}
    render();return copy(state)
  }
  function render(){
    if(typeof document==="undefined")return;
    document.querySelectorAll("[data-bind]").forEach(function(node){const key=node.getAttribute("data-bind");if(Object.prototype.hasOwnProperty.call(state,key))node.textContent=String(state[key])});
    document.querySelectorAll("[data-action=select-pocket]").forEach(function(node){const active=node.getAttribute("data-value")===state.selectedPocket;node.setAttribute("aria-pressed",String(active));node.classList.toggle("selected",active)});
    document.querySelectorAll("[data-action=select-destination]").forEach(function(node){node.setAttribute("aria-pressed",String(node.getAttribute("data-value")===state.destination))});
    const place=document.querySelector("[data-action=place-item]");if(place)place.disabled=state.selectedPocket!=="Cedar Cone"||state.cones<1;
    const make=document.querySelector("[data-action=make-chime]");if(make)make.disabled=state.shells<3||state.fiber<1;
    const route=(location.hash||"#pockets").slice(1),ids=["pockets","diy-recipes","island-map"],active=ids.indexOf(route)>=0?route:"pockets";
    document.querySelectorAll(".screen").forEach(function(screen){screen.hidden=screen.id!==active});
    document.querySelectorAll(".island-nav a").forEach(function(link){if(link.hash==="#"+active)link.setAttribute("aria-current","page");else link.removeAttribute("aria-current")});
  }
  if(typeof document!=="undefined"){document.addEventListener("click",function(event){const button=event.target.closest("[data-action]");if(button&&!button.disabled)dispatch(button.getAttribute("data-action"),button.getAttribute("data-value"))});window.addEventListener("hashchange",render)}
  window.GameDemo={dispatch:dispatch,getState:function(){return copy(state)},reset:function(){state=copy(initial);render();return copy(state)}};
  render();
})();
