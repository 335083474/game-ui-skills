(function () {
  "use strict";
  const state = {
    food:7, days:4, fish:0, fishStock:3, tradeDone:false,
    members:[
      {id:"sigrid",name:"Sigrid",role:"Scout",fatigue:1,mark:"ᛋ"},
      {id:"oren",name:"Oren",role:"Guard",fatigue:3,mark:"ᛟ"},
      {id:"maeve",name:"Maeve",role:"Guide",fatigue:0,mark:"ᛗ"}
    ],
    speaker:"sigrid", selectedSpeaker:"sigrid", pendingSpeaker:null, eventChoice:null, eventResolved:false,
    eventNotice:"Choose one path. The cost is shown before you resolve it.",
    tradeNotice:"Three portions remain in the stall. One purchase can be settled this visit.",
    note:"Keep the west trail clear before the snow turns."
  };
  const screen=document.getElementById("screen");
  const dialogRoot=document.getElementById("dialog-root");
  const live=document.getElementById("live");
  const note=document.getElementById("road-note");
  let cancelDialog=null;
  function esc(value){return String(value).replace(/[&<>"']/g,function(ch){return{"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;"}[ch]})}
  function person(id){return state.members.find(function(m){return m.id===id})}
  function title(name,copy,stamp){return'<section class="page-head"><div><p class="kicker">ASHWATER MARCH · ROAD RECORD</p><h1>'+name+'</h1><p class="lede">'+copy+'</p></div><span class="day-stamp">'+stamp+'</span></section>'}
  function picture(alt,caption,pos){return'<figure class="landscape"><img src="./assets/banner-saga-art.png" alt="'+alt+'" style="object-position:'+pos+'"><figcaption>'+caption+'</figcaption></figure>'}
  function partyToken(m){return'<button class="party-token" data-member="'+m.id+'" aria-label="Choose '+m.name+', '+m.role.toLowerCase()+', fatigue '+m.fatigue+'" aria-pressed="'+(state.selectedSpeaker===m.id)+'"><span class="portrait-mark" aria-hidden="true">'+m.mark+'</span><strong>'+m.name+'</strong><small>'+m.role+'</small><span class="fatigue">FATIGUE · '+m.fatigue+'</span></button>'}
  function prep(){
    const candidate=person(state.selectedSpeaker);
    const tokens=state.members.map(partyToken).join("");
    return title("Before the road begins","Name the voice that will guide this day's choices. The ledger keeps food and shelter days visible.","DAY 04 · DEPARTURE")+
      '<section class="saga-layout" aria-label="Caravan preparation">'+picture("A lone traveler and raven beside a red standard on a blue-gray snow coast","Original winter coast study · caravan on the western trail","18% center")+
      '<div class="paper-panel"><div class="panel-top"><div><p class="kicker">01 · ROAD PARTY</p><h2>Three travel-worn hands</h2><p>Select a road speaker; their fatigue stays visible.</p></div><span class="count-seal">CAMP 04</span></div>'+
      '<p class="section-label">SELECT A SPEAKER</p><div class="party-list">'+tokens+'</div>'+
      '<div class="ledger" aria-label="Provisions ledger"><span>Food provisions</span><strong>'+state.food+' portions</strong><span>Days to next shelter</span><strong>'+state.days+' days</strong><div class="divider"></div><span>Leader candidate</span><strong>'+candidate.name+' · '+candidate.role+'</strong></div>'+
      '<p class="consequence">Assignment changes who speaks for the road. It spends no provisions and changes no fatigue.</p>'+
      '<div class="actions"><button class="primary" data-set-speaker>Set '+candidate.name+' as road speaker</button></div><p class="status-line" id="prep-status">'+(state.speakerNotice||"Speaker choice is a preview until you confirm.")+'</p></div></section>';
  }
  function event(){
    const choices=[
      {id:"pay-ferryman",name:"Pay the ferryman",cost:"Cost · 2 food",effect:"The ferry carries everyone over. Food falls from "+state.food+" to "+Math.max(0,state.food-2)+".",aria:"Choose pay the ferryman",button:"Resolve choice: pay the ferryman"},
      {id:"ford-river",name:"Ford the river",cost:"Cost · +1 Sigrid fatigue",effect:"The scout leads the crossing. Sigrid fatigue rises from "+person("sigrid").fatigue+" to "+(person("sigrid").fatigue+1)+". Food stays "+state.food+".",aria:"Choose ford the river",button:"Resolve choice: ford the river"}
    ];
    const selection=choices.find(function(c){return c.id===state.eventChoice});
    const choiceButtons=choices.map(function(c){return'<button class="event-choice" data-event-choice="'+c.id+'" aria-label="'+c.aria+'" aria-pressed="'+(state.eventChoice===c.id)+'"'+(state.eventResolved?" disabled":"")+'><span><strong>'+c.name+'</strong><small>'+c.effect+'</small></span><span class="choice-cost">'+c.cost+'</span></button>'}).join("");
    let action;
    if(state.eventResolved) action='<button class="primary" disabled>Event settled</button><p class="consequence">This crossing can be settled only once this visit.</p>';
    else if(!selection) action='<button class="primary" disabled>Choose a road first</button><p class="consequence">Select one of the two paths to preview its cost.</p>';
    else if(selection.id==="pay-ferryman"&&state.food<2) action='<button class="primary" disabled>Not enough food</button><p class="consequence">Unavailable: paying the ferryman requires 2 food; the ledger has '+state.food+'.</p>';
    else action='<button class="primary" data-resolve-event>'+selection.button+'</button>';
    return title("Where the river breaks the road","The old ferry rope is frayed. Beyond the far bank, the road climbs toward the next shelter.","EVENT · BROKEN FERRY")+
      '<section class="saga-layout" aria-label="Roadside event">'+picture("Snow coast, caravan and a distant shelter across a wide frozen waterway","A cold crossing before the road resumes","74% 51%")+
      '<div class="paper-panel"><div class="panel-top"><div><p class="kicker">02 · ROADSIDE EVENT</p><h2>The broken ferry</h2><p>Choose how the caravan reaches the far bank.</p></div><span class="count-seal">'+state.food+' FOOD</span></div>'+
      '<div class="road-party" aria-label="Road party fatigue"><div class="traveler"><strong>Sigrid · Scout</strong><small>Fatigue '+person("sigrid").fatigue+'</small></div><div class="traveler"><strong>Oren · Guard</strong><small>Fatigue '+person("oren").fatigue+'</small></div><div class="traveler"><strong>Maeve · Guide</strong><small>Fatigue '+person("maeve").fatigue+'</small></div></div>'+
      '<blockquote class="event-story">The ferryman points to a split plank. The shallows are passable, though the stones are slick beneath the snow.</blockquote>'+
      '<p class="section-label">TWO WAYS ACROSS</p>'+choiceButtons+
      '<div class="actions">'+action+'</div><p class="status-line" id="event-status">'+esc(state.eventNotice)+'</p><a class="return-link" href="#caravan-prep">← Return to the caravan record</a></div></section>';
  }
  function trade(){
    const unavailable=state.tradeDone?"Unavailable: this visit's purchase is already settled.":state.fishStock<1?"Unavailable: no dried fish remains.":state.food<2?"Unavailable: the ledger needs 2 food for this trade.":"One portion costs 2 food. Nothing changes until you confirm.";
    const disabled=state.tradeDone||state.fishStock<1||state.food<2;
    return title("A quiet table at camp","Check the quantity, condition, and price before accepting a barter. A settled trade cannot be repeated this visit.","CAMP · BARTER")+
      '<section class="saga-layout" aria-label="Camp trade">'+picture("Caravan traveler, snowy coast and a sheltered fire on the north road","Camp at the edge of the winter march","42% 50%")+
      '<div class="paper-panel"><div class="panel-top"><div><p class="kicker">03 · CAMP TRADE</p><h2>The salt-fish table</h2><p>Scarcity stays visible beside the offered line.</p></div><span class="count-seal">NO HAGGLE</span></div>'+
      '<div class="ledger" aria-label="Trade ledger"><span>Food on hand</span><strong>'+state.food+' portions</strong><span>Fish already carried</span><strong>'+state.fish+'</strong></div>'+
      '<div class="trade-line"><span class="fish-mark" aria-hidden="true">≋</span><div><h3>Dried fish · 1 portion</h3><p>Condition · wrapped and dry · price · 2 food</p></div><span class="scarcity">'+state.fishStock+' LEFT</span></div>'+
      '<p class="consequence">'+unavailable+'</p><div class="actions"><button class="primary" data-buy'+(disabled?" disabled":"")+'>Buy 1 dried fish for 2 food</button><button class="secondary" data-cancel-trade>Leave the table</button></div>'+
      '<p class="status-line" id="trade-status">'+esc(state.tradeNotice)+'</p><a class="return-link" href="#caravan-prep">← Return to the caravan record</a></div></section>';
  }
  function render(){
    const route=(location.hash||"#caravan-prep").slice(1);
    const page=["caravan-prep","roadside-choice","camp-trade"].indexOf(route)>=0?route:"caravan-prep";
    document.querySelectorAll("[data-route]").forEach(function(a){if(a.dataset.route===page)a.setAttribute("aria-current","page");else a.removeAttribute("aria-current")});
    screen.innerHTML=page==="roadside-choice"?event():page==="camp-trade"?trade():prep();
    note.value=state.note;dialogRoot.innerHTML="";live.textContent="";
  }
  function announce(text){live.textContent="";requestAnimationFrame(function(){live.textContent=text})}
  function closeDialog(message){dialogRoot.innerHTML="";cancelDialog=null;state.pendingSpeaker=null;render();if(message)announce(message)}
  function confirmDialog(heading,copy,label,commit,onCancel){
    dialogRoot.innerHTML='<div class="dialog-shade"><section class="confirm" role="dialog" aria-modal="true" aria-labelledby="confirm-title" aria-describedby="confirm-copy"><p class="kicker">ROAD LEDGER · CONFIRM</p><h2 id="confirm-title">'+heading+'</h2><p id="confirm-copy">'+copy+'</p><div class="actions"><button class="primary" data-confirm>'+label+'</button><button class="secondary" data-cancel>Keep current record</button></div></section></div>';
    const ok=dialogRoot.querySelector("[data-confirm]"),cancel=dialogRoot.querySelector("[data-cancel]");
    cancelDialog=function(){if(onCancel){const message=onCancel();closeDialog(message)}else closeDialog("Cancelled. The ledger and selected records are unchanged.")};
    cancel.addEventListener("click",cancelDialog,{once:true});
    ok.addEventListener("click",function(){const message=commit();closeDialog(message)},{once:true});
    ok.focus();
  }
  document.addEventListener("keydown",function(e){
    const d=dialogRoot.querySelector('[role="dialog"]');if(!d)return;
    if(e.key==="Escape"&&cancelDialog){e.preventDefault();cancelDialog();return}
    if(e.key==="Tab"){const b=d.querySelectorAll("button");if(e.shiftKey&&document.activeElement===b[0]){e.preventDefault();b[b.length-1].focus()}else if(!e.shiftKey&&document.activeElement===b[b.length-1]){e.preventDefault();b[0].focus()}}
  });
  document.addEventListener("click",function(e){
    const member=e.target.closest("[data-member]");
    if(member){state.selectedSpeaker=member.dataset.member;state.speakerNotice="Speaker preview: "+person(state.selectedSpeaker).name+". No record has changed.";render();return}
    if(e.target.closest("[data-set-speaker]")){
      const choice=person(state.selectedSpeaker);state.pendingSpeaker=choice.id;
      confirmDialog("Name the road speaker?",choice.name+" will carry the next decision. Food stays at "+state.food+" and fatigue does not change.","Confirm "+choice.name+" as road speaker",function(){
        const who=person(state.pendingSpeaker);state.speaker=who.id;state.selectedSpeaker=who.id;state.pendingSpeaker=null;state.speakerNotice=who.name+" will speak for the caravan. Supplies remain at "+state.food+" food.";return state.speakerNotice
      },function(){state.selectedSpeaker=state.speaker;state.speakerNotice="No assignment changed. "+person(state.speaker).name+" remains road speaker.";return state.speakerNotice});return
    }
    const eventChoice=e.target.closest("[data-event-choice]");
    if(eventChoice&&!state.eventResolved){state.eventChoice=eventChoice.dataset.eventChoice;const label=state.eventChoice==="pay-ferryman"?"Pay the ferryman · costs 2 food":"Ford the river · adds 1 Sigrid fatigue";state.eventNotice="Preview: "+label+". Choose Resolve to open confirmation.";render();announce(state.eventNotice);return}
    if(e.target.closest("[data-resolve-event]")&&state.eventChoice&&!state.eventResolved){
      const id=state.eventChoice;
      if(id==="pay-ferryman"){
        if(state.food<2)return;
        confirmDialog("Pay the ferryman?", "Spend 2 food from the current "+state.food+" portions. This crossing can be settled only once this visit.", "Confirm ferry: spend 2 food",function(){
          if(state.eventResolved||state.food<2)return "The crossing could not be settled. Food remains "+state.food+".";
          state.food-=2;state.eventResolved=true;state.eventNotice="The ferry carried everyone across. Food is now "+state.food+".";return state.eventNotice
        });
      }else{
        confirmDialog("Ford the river?", "Sigrid takes the slick crossing. Her fatigue rises by 1; no food is spent. This crossing can be settled only once this visit.", "Confirm ford: add 1 fatigue to Sigrid",function(){
          if(state.eventResolved)return "This crossing was already settled.";
          person("sigrid").fatigue+=1;state.eventResolved=true;state.eventNotice="The caravan reached the far bank. Sigrid fatigue is now "+person("sigrid").fatigue+". Food remains "+state.food+".";return state.eventNotice
        });
      }
      return
    }
    if(e.target.closest("[data-buy]")&&!state.tradeDone&&state.food>=2&&state.fishStock>0){
      confirmDialog("Accept this barter?", "Spend 2 of "+state.food+" food for 1 dried fish. Stock will fall from "+state.fishStock+" to "+(state.fishStock-1)+".", "Confirm trade: spend 2 food for 1 dried fish",function(){
        if(state.tradeDone||state.food<2||state.fishStock<1)return "Trade unavailable. The ledger remains unchanged.";
        state.food-=2;state.fish+=1;state.fishStock-=1;state.tradeDone=true;state.tradeNotice="Trade settled: 1 dried fish added; food "+state.food+", stock "+state.fishStock+".";return state.tradeNotice
      });return
    }
    if(e.target.closest("[data-cancel-trade]")){state.tradeNotice="No trade made. Food, carried fish, and stall stock are unchanged.";render();announce(state.tradeNotice)}
  });
  note.addEventListener("input",function(){state.note=note.value});
  window.addEventListener("hashchange",render);
  if(!location.hash)history.replaceState(null,"","#caravan-prep");
  render();
})();
