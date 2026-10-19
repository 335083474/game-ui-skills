"use strict";
(() => {
 const $ = id => document.getElementById(id);
 const VERSION = "SaveSelection-v0.1";
 let state, buttons = [], focusRequest = null, pendingDeleteId = null;
 let textCheckFrame = 0;
 const integer = (v,min,max) => Number.isInteger(v) && v>=min && v<=max;
 const short = (v,max=300) => typeof v === "string" && v.length<=max;
 const fmt = minutes => `${Math.floor(minutes/60)}h ${String(minutes%60).padStart(2,"0")}m`;
 const fullButton = document.createElement("button");
 fullButton.id="saveFullText";fullButton.type="button";
 fullButton.textContent="Read full text";
 $("saveDetails").append(fullButton);
 const warning=document.createElement("p");
 warning.id="saveTextWarning";warning.setAttribute("role","status");
 $("saveEditor").append(warning);
 for(const id of ["saveName","saveDescription","actionBody","confirmBody"]) $(id).tabIndex=0;
 $("stage").tabIndex=-1;
 $("stage").setAttribute("aria-label","Save selection game view");
 document.querySelector(".draft").textContent="Research draft · NOT ACCEPTED · NOT FOR SALE · Save Selection v0.1 / repair r1";

 function validate(source){
   if (!source || !short(source.title)) throw Error("Title must be 300 characters or fewer");
   if (!Array.isArray(source.slots) || source.slots.length!==3) throw Error("Exactly three slots required");
   if (!integer(source.selected,0,2)) throw Error("Selected index must be 0, 1 or 2");
   const ids = new Set();
   const slots = source.slots.map((s,i)=>{
     if(!s || !short(s.id,80) || !s.id || ids.has(s.id)) throw Error("Unique slot id required at "+(i+1));
     ids.add(s.id);
     if(typeof s.occupied!=="boolean" || !short(s.name) || !short(s.location) || !short(s.description,20000)) throw Error("Invalid slot text/occupied at "+(i+1));
     if(!integer(s.minutes,0,999999) || !integer(s.completion,0,112)) throw Error("Invalid play time or completion at "+(i+1));
     if(!s.occupied && (s.name || s.location || s.minutes || s.completion || s.description)) throw Error("Empty slot "+(i+1)+" must have blank content and zero values");
     return {id:s.id,occupied:s.occupied,name:s.name,location:s.location,minutes:s.minutes,completion:s.completion,description:s.description};
   });
   return {version:VERSION,title:source.title,selected:source.selected,slots};
 }
 function overflows(el){return !!el && (el.scrollWidth>el.clientWidth || el.scrollHeight>el.clientHeight);}
 function checkText(){
   textCheckFrame=0;if(!state)return;
   const clipped=[];
   for(const [id,label] of [["menuTitle","menu title"],["saveName","save name"],["saveLocation","location"],["saveMetrics","time / completion"],["saveDescription","description"]]){
     if(overflows($(id)))clipped.push(label);
   }
   const active=buttons[state.selected];
   if(active && [...active.querySelectorAll(".slot-name,.slot-summary")].some(overflows))clipped.push("selected slot summary");
   warning.textContent=clipped.length?"Bounded text: "+clipped.join(", ")+". Use Read full text for the complete selected save and menu title; exported strings are unchanged.":"";
   fullButton.textContent=clipped.length?"Read full text · more":"Read full text";
 }
 function queueTextCheck(){cancelAnimationFrame(textCheckFrame);textCheckFrame=requestAnimationFrame(checkText);}
 function resize(){
   const viewport=$("viewport"),stage=$("stage"),scale=Math.min(viewport.clientWidth/1920,viewport.clientHeight/1080);
   stage.style.transform=`scale(${scale})`;
   stage.style.left=(viewport.clientWidth-1920*scale)/2+"px";
   stage.style.top=(viewport.clientHeight-1080*scale)/2+"px";
   const unsupported=window.innerHeight>window.innerWidth || scale<.5;
   viewport.classList.toggle("unsupported",unsupported);stage.inert=unsupported;
   $("sizeNotice").hidden=!unsupported;
   $("sizeNotice").textContent=unsupported?"Desktop / landscape only. Game area must be at least 960 × 540. 竖屏或窗口过小，暂不支持舞台操作；下方数据编辑器仍可使用。":"";
   queueTextCheck();
 }
 function status(message){$("stageStatus").textContent=message;}
 function editorSync(){
   const slot=state.slots[state.selected];$("editTitle").value=state.title;
   $("editSlot").value=`${state.selected+1} / 3`;
   $("editOccupied").checked=slot.occupied;$("editName").value=slot.name;
   $("editLocation").value=slot.location;$("editMinutes").value=slot.minutes;
   $("editCompletion").value=slot.completion;$("editDescription").value=slot.description;
 }
 function select(index,focus=false){
   state.selected=(index+3)%3;
   buttons.forEach((button,i)=>{const active=i===state.selected;button.setAttribute("aria-pressed",String(active));button.tabIndex=active?0:-1;});
   const s=state.slots[state.selected];
   $("saveName").textContent=s.occupied?s.name:"Empty Save";
   const location=document.createElement("span");location.id="saveLocation";location.tabIndex=0;
   location.textContent=s.occupied?s.location:"An unwritten journey";
   const metrics=document.createElement("span");metrics.id="saveMetrics";metrics.tabIndex=0;
   metrics.textContent=s.occupied?`${fmt(s.minutes)} · ${s.completion}% completion`:"";
   $("saveInfo").replaceChildren(location,metrics);
   $("saveDescription").textContent=s.occupied?s.description:"Choose New Game to fill this slot with a new demonstration save.";
   $("saveName").scrollTop=0;$("saveDescription").scrollTop=0;
   $("primaryAction").textContent=s.occupied?"Continue":"New Game";
   $("deleteAction").disabled=!s.occupied;
   editorSync();queueTextCheck();
   if(focus && !$("stage").inert)buttons[state.selected]?.focus({preventScroll:true});
 }
 function watchImage(img){
   img.addEventListener("error",()=>status("Missing local image: "+img.getAttribute("src")));
   if(img.complete && !img.naturalWidth)status("Missing local image: "+img.getAttribute("src"));
 }
 function render(){
   $("menuTitle").textContent=state.title;$("menuTitle").title=state.title;
   $("saveSlots").replaceChildren();buttons=[];
   state.slots.forEach((s,i)=>{
     const b=document.createElement("button");b.type="button";b.className="save-slot"+(s.occupied?"":" empty");
     b.dataset.slotId=s.id;
     b.setAttribute("aria-label",`Slot ${i+1}: ${s.occupied?s.name:"Empty"}`);
     const sel=document.createElement("img");sel.className="selection";sel.src="assets/selection.svg";sel.alt="";watchImage(sel);
     const emblem=document.createElement("span");emblem.className="slot-emblem";
     const icon=document.createElement("img");icon.src="assets/socket.svg";icon.alt="";watchImage(icon);emblem.append(icon);
     const lines=document.createElement("span");lines.className="slot-lines";
     for(const [cls,text] of [["slot-index",`FILE ${String(i+1).padStart(2,"0")}`],["slot-name",s.occupied?s.name:"Empty Slot"],["slot-summary",s.occupied?`${s.location}  ·  ${fmt(s.minutes)}  ·  ${s.completion}%`:"No save data"]]){
       const span=document.createElement("span");span.className=cls;span.textContent=text;span.title=text;lines.append(span);
     }
     b.append(sel,emblem,lines);
     b.addEventListener("click",()=>select(i,true));
     b.addEventListener("keydown",e=>{
       if(["ArrowDown","ArrowRight","ArrowUp","ArrowLeft","Home","End"].includes(e.key)){
         e.preventDefault();select(e.key==="Home"?0:e.key==="End"?2:state.selected+(["ArrowDown","ArrowRight"].includes(e.key)?1:-1),true);
       }
     });
     buttons.push(b);$("saveSlots").append(b);
   });
   select(state.selected);resize();
 }
 function rememberFocus(){focusRequest={element:document.activeElement,slotId:state.slots[state.selected].id,preferSlot:false};}
 function canFocus(el){
   if(!(el instanceof HTMLElement) || !el.isConnected || el.matches(":disabled") || el.closest("[inert],[hidden]"))return false;
   const css=getComputedStyle(el);
   return css.display!=="none" && css.visibility!=="hidden" && el.getClientRects().length>0;
 }
 function restoreFocus(){
   const request=focusRequest;focusRequest=null;
   requestAnimationFrame(()=>{
     if($("confirmDelete").open || $("actionDialog").open)return;
     const matching=buttons.find(b=>b.dataset.slotId===request?.slotId);
     const selected=buttons[state.selected];
     const candidates=request?.preferSlot?
       [selected,matching,$("primaryAction"),$("stage"),$("editTitle")]:
       [request?.element,matching,selected,$("primaryAction"),$("stage"),$("editTitle")];
     for(const target of candidates){
       if(!canFocus(target))continue;
       target.focus({preventScroll:true});
       if(document.activeElement===target)return;
     }
   });
 }
 function openAction(title,body){
   rememberFocus();$("actionTitle").textContent=title;$("actionBody").textContent=body;
   $("actionBody").scrollTop=0;$("actionDialog").showModal();$("closeAction").focus({preventScroll:true});
 }
 fullButton.addEventListener("click",()=>{
   const s=state.slots[state.selected];
   openAction("Full save text",`Menu title:\n${state.title}\n\nFile ${state.selected+1} (${s.occupied?"Occupied":"Empty"})\n\nSave name:\n${s.name}\n\nLocation:\n${s.location}\n\nPlay time: ${fmt(s.minutes)} (${s.minutes} minutes)\nCompletion: ${s.completion}%\n\nDescription:\n${s.description}`);
 });
 $("primaryAction").addEventListener("click",()=>{
   const s=state.slots[state.selected];
   if(s.occupied)openAction("Continue — prototype",`Slot ${state.selected+1}: ${s.name}\n\nThis is an interface demonstration. No game state can be loaded.`);
   else openAction("New Game — prototype",`Slot ${state.selected+1} is empty.\n\nTo create a demonstration save, open Review / edit save data, check Occupied, fill its fields, and Apply edits. No real game data is created.`);
 });
 $("deleteAction").addEventListener("click",()=>{
   const s=state.slots[state.selected];if(!s.occupied)return;
   rememberFocus();pendingDeleteId=s.id;
   $("confirmDeleteButton").disabled=false;
   $("confirmBody").textContent=`Delete demonstration save in File ${state.selected+1}: “${s.name}”?\nThis action cannot be undone unless you previously exported JSON.`;
   $("confirmBody").scrollTop=0;$("confirmDelete").showModal();$("cancelDelete").focus({preventScroll:true});
 });
 $("cancelDelete").addEventListener("click",()=>$("confirmDelete").close());
 $("confirmDeleteButton").addEventListener("click",()=>{
   if(!$("confirmDelete").open || pendingDeleteId===null)return;
   const i=state.slots.findIndex(s=>s.id===pendingDeleteId);
   pendingDeleteId=null;$("confirmDeleteButton").disabled=true;
   if(i<0 || !state.slots[i].occupied){$("confirmDelete").close();return;}
   const s=state.slots[i];
   state.slots[i]={id:s.id,occupied:false,name:"",location:"",minutes:0,completion:0,description:""};
   state.selected=i;
   if(focusRequest)focusRequest.preferSlot=true;
   render();status(`File ${i+1} cleared in memory. Export JSON to save changes.`);
   $("confirmDelete").close();
 });
 $("confirmDelete").addEventListener("close",()=>{pendingDeleteId=null;restoreFocus();});
 $("closeAction").addEventListener("click",()=>$("actionDialog").close());
 $("actionDialog").addEventListener("close",restoreFocus);
 $("saveEditor").addEventListener("submit",e=>{
   e.preventDefault();try{
     const copy=JSON.parse(JSON.stringify(state)),s=copy.slots[copy.selected];
     copy.title=$("editTitle").value;s.occupied=$("editOccupied").checked;
     if(s.occupied){s.name=$("editName").value;s.location=$("editLocation").value;s.minutes=Number($("editMinutes").value);s.completion=Number($("editCompletion").value);s.description=$("editDescription").value;}
     else Object.assign(s,{name:"",location:"",minutes:0,completion:0,description:""});
     state=validate(copy);render();status("Edits applied to in-memory prototype state.");$("editStatus").textContent="Applied; use Export JSON to retain changes.";
   }catch(err){$("editStatus").textContent="Not applied: "+err.message;}
 });
 $("exportSaves").addEventListener("click",()=>{
   const url=URL.createObjectURL(new Blob([JSON.stringify(state,null,2)],{type:"application/json;charset=utf-8"}));
   const a=document.createElement("a");a.href=url;a.download="save-selection-data.json";a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
 });
 $("importSaves").addEventListener("change",async e=>{
   const file=e.target.files?.[0];if(!file)return;
   try{if(file.size>2000000)throw Error("JSON file exceeds 2 MB");const imported=validate(JSON.parse(await file.text()));state=imported;render();$("editStatus").textContent="Imported three save slots.";}
   catch(err){$("editStatus").textContent="Import rejected, previous data retained: "+err.message;}
   e.target.value="";
 });
 document.querySelectorAll("#stage img").forEach(watchImage);
 try{state=validate(JSON.parse(JSON.stringify(window.HK_SAVE_INITIAL)));render();}catch(err){$("editStatus").textContent="Initial data invalid: "+err.message;}
 new ResizeObserver(resize).observe($("viewport"));window.addEventListener("resize",resize);
 if(document.fonts){document.fonts.ready.then(queueTextCheck);document.fonts.addEventListener("loadingdone",queueTextCheck);}
})();