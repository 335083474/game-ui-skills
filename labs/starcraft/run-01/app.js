(function(){
  const initial={selectedUnit:"Marine / Rook-03",order:"Hold position · Awaiting command",fieldUpdate:"Ready for tactical input.",fieldPosition:"BASELINE",assignment:"ALPHA / NORTH",assignmentStatus:"Rook-03 holds the north position.",bravoCount:2,crewNote:"Steady aim under pressure. Last signal: north ridge watch.",briefConfirmed:false,briefStatus:"Brief not yet confirmed. Check the two primary orders.",launchCue:"AWAITING CONFIRMATION",launched:false};
  const crew={"Marine / Rook-03":"Steady aim under pressure. Last signal: north ridge watch.","Marine / Vale-12":"A reliable cover line. Last signal: west ridge overwatch.","Firebat / Torch-02":"Breach specialist. Heat pack is stable.","Supply Drone / Mule-1":"Cargo bay clear. Awaiting the convoy route."};
  let state=copy(initial);
  function copy(value){return JSON.parse(JSON.stringify(value))}
  function dispatch(action,value){
    if(action==="select-unit"){state.selectedUnit=value||initial.selectedUnit;state.crewNote=crew[state.selectedUnit]||crew[initial.selectedUnit];state.fieldUpdate=state.selectedUnit+" selected."}
    if(action==="issue-order"){
      const labels={"Move to North Ridge":"Moving to North Ridge","Attack Supply Cache":"Attacking Supply Cache","Hold at relay":"Holding at relay","Patrol Glass Harbor":"Patrolling Glass Harbor"};
      state.order=labels[value]||"Holding position";state.fieldPosition=value==="Move to North Ridge"?"NORTH RIDGE":value==="Attack Supply Cache"?"SUPPLY CACHE":value==="Patrol Glass Harbor"?"GLASS HARBOR":"RELAY";state.fieldUpdate=state.selectedUnit+" · order transmitted: "+state.order+".";
    }
    if(action==="assign-bravo"){if(state.assignment!=="BRAVO / WEST RIDGE"){state.assignment="BRAVO / WEST RIDGE";state.bravoCount+=1;state.assignmentStatus=state.selectedUnit+" assigned to Bravo / west ridge."}else{state.assignmentStatus=state.selectedUnit+" is already assigned to Bravo / west ridge."}}
    if(action==="confirm-brief"){state.briefConfirmed=true;state.briefStatus="Echo relay confirmed · 2 primary orders, 1 optional."}
    if(action==="launch"){if(state.briefConfirmed){state.launched=true;state.briefStatus="Operation Glass Harbor launched. Field comms are live.";state.launchCue="TRANSMISSION LIVE · Echo relay secured"}else{state.briefStatus="Confirm the mission brief before launch."}}
    render();return copy(state)
  }
  function render(){
    if(typeof document==="undefined")return;
    document.querySelectorAll("[data-bind]").forEach(function(node){const key=node.getAttribute("data-bind");if(Object.prototype.hasOwnProperty.call(state,key))node.textContent=key==="bravoCount"?String(state[key])+" / 4":String(state[key])});
    document.querySelectorAll("[data-action=select-unit]").forEach(function(node){const active=node.getAttribute("data-value")===state.selectedUnit;node.setAttribute("aria-pressed",String(active));node.classList.toggle("active",active);node.classList.toggle("selected-unit",active);if(active)node.setAttribute("data-position",state.fieldPosition)});
    const launch=document.querySelector("[data-action=launch]");if(launch)launch.disabled=!state.briefConfirmed||state.launched;
    const route=(location.hash||"#command-console").slice(1),ids=["command-console","unit-roster","mission-brief"],active=ids.indexOf(route)>=0?route:"command-console";
    document.querySelectorAll(".screen").forEach(function(screen){screen.hidden=screen.id!==active});
    document.querySelectorAll(".routebar a").forEach(function(link){if(link.hash==="#"+active)link.setAttribute("aria-current","page");else link.removeAttribute("aria-current")});
  }
  if(typeof document!=="undefined"){document.addEventListener("click",function(event){const button=event.target.closest("[data-action]");if(button&&!button.disabled)dispatch(button.getAttribute("data-action"),button.getAttribute("data-value"))});window.addEventListener("hashchange",render)}
  window.GameDemo={dispatch:dispatch,getState:function(){return copy(state)},reset:function(){state=copy(initial);render();return copy(state)}};
  render();
})();


