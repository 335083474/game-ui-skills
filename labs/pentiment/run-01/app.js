(function(){
  "use strict";
  const state={
    focusPerson:"prior",selectedPerson:"marta",relationshipNotice:"The selected identity is a preview; the inquiry focus is still Prior.",
    selectedClue:"wax-fragment",compared:{},logNotice:"Sources and confidence remain attached to each clue.",
    selectedResponse:null,loggedResponse:null,dialogueNotice:"Marta's line is ready. No response has been recorded.",
    note:"The bell book and the wax fragment speak from different places."
  };
  const people=[
    {id:"marta",name:"Marta",relation:"Witness",mark:"✦",detail:"Her account is linked to the bell book, recorded in the sacristy ledger."},
    {id:"prior",name:"Prior",relation:"Subject",mark:"✧",detail:"The wax fragment is uncertain and currently supports this line of inquiry."},
    {id:"leon",name:"Leon",relation:"Neighbor",mark:"◇",detail:"No testimony is attached yet. Keep the blank margin visible."}
  ];
  const clues=[
    {id:"wax-fragment",name:"Wax fragment",source:"Vestry floor",confidence:"Uncertain",supports:"Prior",symbol:"✦",detail:"A chipped seal is described in the margin. The source is recorded; the reading remains uncertain."},
    {id:"bell-book",name:"Bell book",source:"Sacristy ledger",confidence:"Recorded",supports:"Marta",symbol:"✧",detail:"The ledger keeps a time entry beside Marta's testimony. It is recorded, not independently verified."}
  ];
  const responses=[
    {id:"ask-bell-time",name:"Ask when she heard the final bell.",voice:"Careful",mark:"…",short:"A narrow question about timing."},
    {id:"challenge-account",name:"Point to the time in the ledger.",voice:"Direct",mark:"!",short:"A direct comparison with the record."}
  ];
  const screen=document.getElementById("screen"),dialogRoot=document.getElementById("dialog-root"),live=document.getElementById("live"),note=document.getElementById("marginal-note");
  let cancelDialog=null;
  function esc(value){return String(value).replace(/[&<>"']/g,function(ch){return{"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;"}[ch]})}
  function person(id){return people.find(function(p){return p.id===id})||people[0]}
  function clue(id){return clues.find(function(c){return c.id===id})||clues[0]}
  function response(id){return responses.find(function(r){return r.id===id})}
  function head(title,copy,stamp){return'<section class="page-heading"><div><p class="chapter-tag">CHAPTER III · THE BELLS AT VESPERS</p><h1><span class="rubric">'+title.charAt(0)+'</span>'+title.slice(1)+'</h1><p class="lede">'+copy+'</p></div><span class="folio-stamp">'+stamp+'</span></section>'}
  function plate(alt,caption,pos){return'<figure class="illuminated-plate"><img src="./assets/pentiment-art.png" alt="'+alt+'" style="object-position:'+pos+'"><figcaption>'+caption+'</figcaption></figure>'}
  function relationship(){
    const selected=person(state.selectedPerson),focus=person(state.focusPerson);
    const nodes=people.map(function(p){return'<button class="person-node" data-person="'+p.id+'" aria-label="Focus '+p.name+', '+p.relation.toLowerCase()+'" aria-pressed="'+(p.id===selected.id)+'"><span class="person-glyph" aria-hidden="true">'+p.mark+'</span><strong>'+p.name+'</strong><small>'+p.relation+'</small></button>'}).join("");
    const canSet=selected.id!==focus.id;
    return head("The people around the bells","Names, testimony, and uncertainty sit together on one open leaf. Select a person to examine their links.","PEOPLE · 03")+
      '<section class="book-layout" aria-label="Relationship map">'+plate("An original apprentice at a writing desk, a dog, marginal doodles, and a star chart","Original scriptorium plate · a local art-direction study","24% center")+
      '<div class="folio-panel"><div class="panel-top"><div><p class="chapter-tag">01 · RELATIONSHIP MAP</p><h2><span class="chapter-initial">B</span>ells at Vespers</h2><p>People and testimony · fictional case record</p></div><span class="folio-index">03 / 12</span></div>'+
      '<p class="section-label">PEOPLE IN THIS ACCOUNT</p><div class="people-web">'+nodes+'</div>'+
      '<div class="relation-lines" aria-label="Testimony links"><div class="relation-line"><span class="line-mark uncertain" aria-hidden="true"></span><span>Wax fragment → Prior</span><small>Dashed · uncertain</small></div><div class="relation-line"><span class="line-mark" aria-hidden="true"></span><span>Bell book → Marta</span><small>Solid · recorded</small></div></div>'+
      '<section class="focus-record" aria-live="polite"><p class="section-label">SELECTED IDENTITY · '+selected.relation.toUpperCase()+'</p><h3>'+selected.name+'</h3><p>'+selected.detail+'</p><p>Current inquiry focus: <strong>'+focus.name+'</strong> · '+focus.relation.toLowerCase()+'.</p><div class="actions"><button class="primary" data-set-focus'+(canSet?"":" disabled")+'>Set inquiry focus to '+selected.name+'</button></div><p class="status-line">'+esc(state.relationshipNotice)+'</p></section></div></section>';
  }
  function investigation(){
    const active=clue(state.selectedClue);
    const entries=clues.map(function(c,index){const marked=!!state.compared[c.id];return'<button class="clue-entry" data-clue="'+c.id+'" aria-label="Open '+c.name.toLowerCase()+' clue" aria-pressed="'+(c.id===active.id)+'"><span class="timeline-mark" aria-hidden="true">'+(marked?"✓":c.symbol)+'</span><span><strong>'+String(index+1).padStart(2,"0")+' · '+c.name+(marked?" · comparison marked":"")+'</strong><small>Source · '+c.source+' · supports '+c.supports+'</small></span><span class="confidence '+(c.confidence==="Uncertain"?"uncertain":"")+'">'+c.confidence.toUpperCase()+'</span></button>'}).join("");
    const markText=state.compared[active.id]
      ? '<span class="comparison-mark">ALREADY MARKED FOR COMPARISON</span><p class="consequence">This mark cannot be added twice during this visit.</p>'
      : '<div class="actions"><button class="primary" data-mark-clue>Mark '+active.name.toLowerCase()+' for comparison</button></div>';
    return head("A margin for contradictions","Follow the order of the record. Each clue keeps its source and confidence beside the reading.","EVIDENCE · 02")+
      '<section class="book-layout" aria-label="Investigation log">'+plate("A handwritten early-print study with an apprentice, a small dog, and a star chart","Original manuscript plate · quiet space for reading the record","70% 60%")+
      '<div class="folio-panel"><div class="panel-top"><div><p class="chapter-tag">02 · INVESTIGATION LOG</p><h2>Evidence in the margin</h2><p>Source and confidence stay attached.</p></div><span class="folio-index">DAY 03</span></div>'+
      '<p class="section-label">CHRONOLOGICAL ENTRIES</p><div class="clue-timeline">'+entries+'</div>'+
      '<section class="clue-detail" aria-live="polite"><p class="section-label">SELECTED CLUE · '+active.confidence.toUpperCase()+'</p><h3>'+active.name+'</h3><p>'+active.detail+'</p><p>Source: <strong>'+active.source+'</strong> · supports <strong>'+active.supports+'</strong>.</p>'+markText+'</section>'+
      '<p class="status-line" id="log-status">'+esc(state.logNotice)+'</p><a class="return-link" href="#relationship-map">← Return to the people map</a></div></section>';
  }
  function dialogue(){
    const chosen=response(state.selectedResponse);
    const options=responses.map(function(r){return'<button class="response-option" data-response="'+r.id+'" aria-label="Choose '+(r.voice==="Careful"?"careful question about the bell time":"direct challenge to the account")+'" aria-pressed="'+(state.selectedResponse===r.id)+'"><span class="voice-mark" aria-hidden="true">'+r.mark+'</span><span><strong>'+r.name+'</strong><small>'+r.short+'</small></span><span class="voice-tag">'+r.voice.toUpperCase()+'</span></button>'}).join("");
    const action=state.loggedResponse?'<button class="primary" disabled>Response recorded once</button>':chosen?'<button class="primary" data-record-response>Record '+(chosen.id==="ask-bell-time"?"careful question to Marta":"direct challenge to Marta")+'</button>':'<button class="primary" disabled>Choose a response first</button>';
    return head("At the vestry door","A character-forward exchange with a controlled reading width. The response stays a preview until recorded.","DIALOGUE · 03")+
      '<section class="book-layout dialogue-page" aria-label="Dialogue exchange">'+plate("Original apprentice and dog in a scriptorium, with a broad inked margin and star chart","Original generated study · character and room are fictional","21% 46%")+
      '<div class="folio-panel"><div class="panel-top"><div><p class="chapter-tag">03 · DIALOGUE EXCHANGE</p><h2>One question at a time</h2><p>Response voice stays visible before commit.</p></div><span class="folio-index">MARTA · WITNESS</span></div>'+
      '<div class="speaker-card"><span class="speaker-seal" aria-hidden="true">M</span><span><strong>Marta · witness</strong><small>Expression cue · a careful pause, eyes lowered toward the ledger</small></span></div>'+
      '<blockquote class="spoken-line">“The bells had already fallen quiet when I left the vestry.”</blockquote>'+
      '<p class="section-label">CHOOSE YOUR RESPONSE</p>'+options+
      '<div class="actions">'+action+'<button class="secondary" data-replay>Replay the exchange</button></div>'+
      '<p class="status-line" id="dialogue-status">'+esc(state.dialogueNotice)+'</p><a class="return-link" href="#investigation-log">← Return to the investigation log</a></div></section>';
  }
  function render(){
    const route=(location.hash||"#relationship-map").slice(1);
    const page=["relationship-map","investigation-log","dialogue-exchange"].indexOf(route)>=0?route:"relationship-map";
    document.querySelectorAll("[data-route]").forEach(function(a){if(a.dataset.route===page)a.setAttribute("aria-current","page");else a.removeAttribute("aria-current")});
    screen.innerHTML=page==="investigation-log"?investigation():page==="dialogue-exchange"?dialogue():relationship();
    note.value=state.note;dialogRoot.innerHTML="";live.textContent="";
  }
  function announce(text){live.textContent="";requestAnimationFrame(function(){live.textContent=text})}
  function closeDialog(message){dialogRoot.innerHTML="";cancelDialog=null;render();if(message)announce(message)}
  function confirm(title,description,label,commit,onCancel){
    dialogRoot.innerHTML='<div class="dialog-shade"><section class="confirm-dialog" role="dialog" aria-modal="true" aria-labelledby="confirm-title" aria-describedby="confirm-copy"><p class="chapter-tag">CASE RECORD · CONFIRM</p><h2 id="confirm-title">'+title+'</h2><p id="confirm-copy">'+description+'</p><div class="actions"><button class="primary" data-confirm>'+label+'</button><button class="secondary" data-cancel>Keep current record</button></div></section></div>';
    const ok=dialogRoot.querySelector("[data-confirm]"),cancel=dialogRoot.querySelector("[data-cancel]");
    cancelDialog=function(){closeDialog(onCancel?onCancel():"Cancelled. The case record remains unchanged.")};
    cancel.addEventListener("click",cancelDialog,{once:true});
    ok.addEventListener("click",function(){closeDialog(commit())},{once:true});
    ok.focus();
  }
  document.addEventListener("keydown",function(e){
    const d=dialogRoot.querySelector('[role="dialog"]');if(!d)return;
    if(e.key==="Escape"&&cancelDialog){e.preventDefault();cancelDialog();return}
    if(e.key==="Tab"){const b=d.querySelectorAll("button");if(e.shiftKey&&document.activeElement===b[0]){e.preventDefault();b[b.length-1].focus()}else if(!e.shiftKey&&document.activeElement===b[b.length-1]){e.preventDefault();b[0].focus()}}
  });
  document.addEventListener("click",function(e){
    const p=e.target.closest("[data-person]");
    if(p){state.selectedPerson=p.dataset.person;state.relationshipNotice="Preview: "+person(state.selectedPerson).name+". Inquiry focus remains "+person(state.focusPerson).name+".";render();return}
    if(e.target.closest("[data-set-focus]")){
      const selected=person(state.selectedPerson);
      if(selected.id===state.focusPerson)return;
      confirm("Set a new inquiry focus?",selected.name+" becomes the inquiry focus. Their relationship label and clue links remain as recorded.","Confirm focus on "+selected.name,function(){
        state.focusPerson=selected.id;state.relationshipNotice="Inquiry focus set to "+selected.name+". Her relation remains "+selected.relation.toLowerCase()+".";return state.relationshipNotice
      },function(){state.selectedPerson=state.focusPerson;state.relationshipNotice="No focus change was recorded. "+person(state.focusPerson).name+" remains the inquiry focus.";return state.relationshipNotice});return
    }
    const c=e.target.closest("[data-clue]");
    if(c){state.selectedClue=c.dataset.clue;state.logNotice="Selected "+clue(state.selectedClue).name+". Source and confidence are unchanged.";render();return}
    if(e.target.closest("[data-mark-clue]")){
      const active=clue(state.selectedClue);
      if(state.compared[active.id])return;
      confirm("Add a comparison mark?",active.name+" will be flagged for later comparison. Its source ("+active.source+") and confidence ("+active.confidence.toLowerCase()+") stay unchanged.","Confirm comparison mark for "+active.name.toLowerCase(),function(){
        if(state.compared[active.id])return state.logNotice;
        state.compared[active.id]=true;state.logNotice=active.name+" is marked for comparison. Source remains "+active.source.toLowerCase()+"; confidence remains "+active.confidence.toLowerCase()+".";return state.logNotice
      });return
    }
    const r=e.target.closest("[data-response]");
    if(r){state.selectedResponse=r.dataset.response;const current=response(state.selectedResponse);state.dialogueNotice="Preview: "+current.voice.toLowerCase()+" voice. No response has been recorded.";render();return}
    if(e.target.closest("[data-record-response]")&&state.selectedResponse&&!state.loggedResponse){
      const current=response(state.selectedResponse);
      const concise=current.id==="ask-bell-time"?"careful question about the bell time":"direct comparison with the ledger";
      const label=current.id==="ask-bell-time"?"Confirm and record careful question":"Confirm and record direct challenge";
      const previousSelection=state.loggedResponse;
      confirm("Record this response?",current.name+" The case record will note only the response choice; Marta's source remains unchanged.",label,function(){
        if(state.loggedResponse)return state.dialogueNotice;
        state.loggedResponse=current.id;state.dialogueNotice="Recorded: a "+concise+". Marta's source remains unaltered.";return state.dialogueNotice
      },function(){state.selectedResponse=previousSelection;state.dialogueNotice="No response was recorded. Marta's testimony remains unchanged.";return state.dialogueNotice});return
    }
    if(e.target.closest("[data-replay]")){
      state.selectedResponse=null;state.loggedResponse=null;state.dialogueNotice="The exchange is ready again. No response is recorded.";render();announce(state.dialogueNotice)
    }
  });
  note.addEventListener("input",function(){state.note=note.value});
  window.addEventListener("hashchange",render);
  if(!location.hash)history.replaceState(null,"","#relationship-map");
  render();
})();
