(()=>{
"use strict";
const $=id=>document.getElementById(id);
const C=window.AA_EVIDENCE_CONTRACT;
if(!C){
 $("tools").open=true;
 $("editStatus").textContent="Required evidence-contract.js failed to load.";
 return;
}
let state={schemaVersion:1,version:C.VERSION,selectedId:null,items:[]};
let buttons=[],returnTarget=null,fileReadSerial=0;
const current=()=>state.items.find(item=>item.id===state.selectedId)||null;
const selectedButton=()=>buttons.find(b=>b.dataset.itemId===state.selectedId)||null;
const iconPath=key=>C.ICONS[key];
function status(message){$("editStatus").textContent=message;}
function serialise(){return JSON.stringify(state,null,2);}
function canFocus(element){
 return !!(element&&element.isConnected&&!element.disabled&&!element.closest("[hidden],[inert]")&&element.getClientRects().length);
}
function fallbackFocus(){
 const target=selectedButton();
 if(canFocus(target)){target.focus();return;}
 $("tools").open=true;
 const alternative=$("addItem").disabled?$("loadJson"):$("addItem");
 alternative.focus();
}
function diagnose(){
 const lines=[],item=current();
 if(item){
  for(const id of ["itemName","description"]){
   const e=$(id);
   if(e.scrollWidth>e.clientWidth+1||e.scrollHeight>e.clientHeight+1)
    lines.push(id+" is bounded; full text remains available below.");
  }
 }
 document.querySelectorAll("#stage img[src]").forEach(img=>{
  if(img.complete&&!img.naturalWidth)lines.push("Image failed: "+img.getAttribute("src"));
 });
 $("diagnostic").textContent=[...new Set(lines)].join("\n");
 $("fullText").hidden=!item||!lines.length;
}
const later=()=>requestAnimationFrame(diagnose);
function display(){
 const item=current(),empty=!item;
 $("itemName").textContent=item?item.name:"No evidence";
 $("description").textContent=item?item.description:"This collection is empty.";
 $("description").scrollTop=0;
 $("preview").hidden=empty;
 if(item){$("preview").src=iconPath(item.icon);$("preview").alt=item.name;}
 else{$("preview").removeAttribute("src");$("preview").alt="";}
 $("nameEdit").value=item?item.name:"";
 $("descriptionEdit").value=item?item.description:"";
 $("iconEdit").value=item?item.icon:"badge";
 for(const id of ["nameEdit","descriptionEdit","iconEdit","applyItem","deleteItem"])$(id).disabled=empty;
 $("addItem").disabled=state.items.length>=10;
 $("collectionStatus").textContent=state.items.length+" / 10 evidence items";
 buttons.forEach(b=>{
  const chosen=b.dataset.itemId===state.selectedId;
  b.setAttribute("aria-pressed",String(chosen));b.tabIndex=chosen?0:-1;
 });
 later();
}
function select(index,focus=false){
 const n=state.items.length;
 if(!n){state.selectedId=null;display();if(focus)fallbackFocus();return;}
 state.selectedId=state.items[((index%n)+n)%n].id;
 display();if(focus)fallbackFocus();
}
function showFull(trigger){
 const item=current();if(!item)return;
 returnTarget=trigger;
 $("detailTitle").textContent=item.name;
 $("detailBody").textContent=item.name+"\n\n"+item.description;
 $("detail").showModal();$("closeDetail").focus();
}
function build(){
 buttons=[];$("rail").replaceChildren();
 for(let i=0;i<10;i++){
  if(i>=state.items.length){
   const empty=document.createElement("div");empty.className="slot empty";
   empty.setAttribute("aria-hidden","true");$("rail").append(empty);continue;
  }
  const item=state.items[i],b=document.createElement("button");
  b.type="button";b.className="slot";b.dataset.itemId=item.id;
  b.setAttribute("aria-label",item.name||"Unnamed evidence "+(i+1));
  const icon=document.createElement("img");
  icon.className="icon";icon.alt="";icon.src=iconPath(item.icon);
  const corner=document.createElement("img");
  corner.className="selection";corner.alt="";corner.src="assets/corners.svg";
  for(const img of [icon,corner]){
   img.addEventListener("load",later);img.addEventListener("error",later);
  }
  b.append(icon,corner);
  b.addEventListener("click",()=>select(i,true));
  b.addEventListener("keydown",e=>{
   if(["ArrowLeft","ArrowRight","Home","End"].includes(e.key)){
    e.preventDefault();
    const position=state.items.findIndex(v=>v.id===state.selectedId);
    select(e.key==="Home"?0:e.key==="End"?state.items.length-1:
     position+(e.key==="ArrowLeft"?-1:1),true);
   }else if(e.key==="Enter"||e.key===" "){e.preventDefault();showFull(b);}
  });
  buttons.push(b);$("rail").append(b);
 }
 display();
}
function commit(result,message,focus){
 state=result.state;
 build();
 status(message+(result.selectionAdjusted?" Selected item was unavailable; selection reset to "+(state.selectedId||"empty")+".":""));
 if(focus)fallbackFocus();
}
function reject(error){
 status("Rejected; current collection and selection retained. "+error.message);
}
function importText(raw){
 try{const result=C.parse(raw);commit(result,"Imported "+result.state.items.length+" items.",true);}
 catch(error){reject(error);}
}
function resize(){
 const availableHeight=Math.max(0,window.innerHeight-40);
 const scale=Math.min(1,window.innerWidth/1280,availableHeight/720);
 const activeWasInStage=$("stage").contains(document.activeElement);
 $("viewport").style.width=(1280*scale)+"px";
 $("viewport").style.height=(720*scale)+"px";
 $("stage").style.transform="scale("+scale+")";
 const unsupported=window.innerHeight>window.innerWidth||scale<.75;
 $("stage").inert=unsupported;$("sizeNotice").hidden=!unsupported;
 if(unsupported&&activeWasInStage)fallbackFocus();
 later();
}
$("editor").addEventListener("submit",e=>{
 e.preventDefault();
 const item=current();if(!item){status("No evidence selected. Add an item or import a collection.");return;}
 const candidate={
  ...state,
  items:state.items.map(v=>v.id===item.id?
   {...v,name:$("nameEdit").value,description:$("descriptionEdit").value,icon:$("iconEdit").value}:{...v})
 };
 try{commit(C.validate(candidate),"Applied. Export JSON to retain all values.",false);}
 catch(error){reject(error);}
});
$("addItem").addEventListener("click",()=>{
 if(state.items.length>=10){status("Maximum 10 items; collection retained.");return;}
 let n=1;while(state.items.some(v=>v.id==="item-"+n))n++;
 const item={id:"item-"+n,name:"New evidence",icon:"badge",description:"Editable demonstration text."};
 try{commit(C.validate({...state,selectedId:item.id,items:[...state.items,item]}),"Added "+item.id+".",true);}
 catch(error){reject(error);}
});
$("deleteItem").addEventListener("click",()=>{
 const index=state.items.findIndex(v=>v.id===state.selectedId);
 if(index<0){status("Nothing to remove.");return;}
 const removed=state.items[index].id;
 const items=state.items.filter((_,i)=>i!==index);
 const next=items.length?items[Math.min(index,items.length-1)].id:null;
 try{commit(C.validate({...state,items,selectedId:next}),"Removed "+removed+". Export if you want to keep this change.",true);}
 catch(error){reject(error);}
});
$("loadJson").addEventListener("click",()=>{
 $("jsonEdit").value=serialise();status("Current collection copied to the JSON text area.");
});
$("importJson").addEventListener("click",()=>{
 fileReadSerial++;importText($("jsonEdit").value);
});
$("importFile").addEventListener("change",async()=>{
 const file=$("importFile").files[0];if(!file)return;
 const serial=++fileReadSerial;
 try{
  if(file.size>2000000)throw new Error("File exceeds 2,000,000 bytes.");
  const raw=await file.text();
  if(serial!==fileReadSerial)return;
  importText(raw);
 }catch(error){if(serial===fileReadSerial)reject(error);}
 finally{if(serial===fileReadSerial)$("importFile").value="";}
});
$("export").addEventListener("click",()=>{
 const url=URL.createObjectURL(new Blob([serialise()],{type:"application/json;charset=utf-8"}));
 const a=document.createElement("a");a.href=url;a.download="aa2019-evidence-v04.json";
 document.body.append(a);a.click();a.remove();
 setTimeout(()=>URL.revokeObjectURL(url),1000);
});
$("fullText").addEventListener("click",()=>showFull($("fullText")));
$("closeDetail").addEventListener("click",()=>$("detail").close());
$("detail").addEventListener("close",()=>requestAnimationFrame(()=>{
 if(canFocus(returnTarget))returnTarget.focus();else fallbackFocus();
 returnTarget=null;
}));
window.addEventListener("resize",resize);
document.querySelectorAll("#stage img").forEach(img=>{
 img.addEventListener("load",later);img.addEventListener("error",later);
});
if(document.fonts)document.fonts.ready.then(later);
try{
 const result=C.validate(window.AA_EVIDENCE_DATA);
 state=result.state;
 if(result.selectionAdjusted)status("Initial selection reset to the first available item.");
}catch(error){
 $("tools").open=true;
 status("Initial data rejected; empty collection retained. "+error.message);
}
build();resize();$("jsonEdit").value=serialise();
})();