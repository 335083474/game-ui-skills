(()=>{
"use strict";
const $=id=>document.getElementById(id);
const VERSION="AA2019-profiles-v0.4";
const portraits=Object.freeze({
 p01:"assets/profiles/p01.png",p02:"assets/profiles/p02.png",
 p03:"assets/profiles/p03.png",p04:"assets/profiles/p04.png",
 p05:"assets/profiles/p05.png",p06:"assets/profiles/p06.png",
 p07:"assets/profiles/p07.png",p08:"assets/profiles/p08.png",
 p09:"assets/profiles/p09.png",dee:"assets/profiles/dee.png"
});
const idPattern=/^[A-Za-z0-9][A-Za-z0-9_-]{0,39}$/;
let state={schemaVersion:1,version:VERSION,selectedId:null,items:[]};
let buttons=[],returnTarget=null,readSerial=0;
function exact(value,expected,label){
 if(!value||typeof value!=="object"||Array.isArray(value))throw new Error(label+" must be an object.");
 if(Object.keys(value).length!==expected.length||expected.some(k=>!Object.prototype.hasOwnProperty.call(value,k)))
  throw new Error(label+" has missing or unsupported fields.");
}
function validate(input){
 exact(input,["schemaVersion","version","selectedId","items"],"Document");
 if(input.schemaVersion!==1||input.version!==VERSION)throw new Error("Unsupported schema or version.");
 if(!Array.isArray(input.items)||input.items.length>10)throw new Error("Expected 0–10 profiles.");
 if(input.selectedId!==null&&(typeof input.selectedId!=="string"||!idPattern.test(input.selectedId)))
  throw new Error("Invalid selectedId.");
 const seen=new Set();
 const items=input.items.map((v,i)=>{
  exact(v,["id","name","age","portrait","description"],"items["+i+"]");
  if(typeof v.id!=="string"||!idPattern.test(v.id)||seen.has(v.id))throw new Error("Invalid or duplicate ID at "+i+".");
  seen.add(v.id);
  if(typeof v.name!=="string"||v.name.length>300)throw new Error("Name limit is 300 UTF-16 code units.");
  if(typeof v.description!=="string"||v.description.length>20000)throw new Error("Description limit is 20000 UTF-16 code units.");
  if(v.age!==null&&(!Number.isInteger(v.age)||v.age<0||v.age>150))throw new Error("Age must be null or integer 0–150.");
  if(typeof v.portrait!=="string"||!Object.prototype.hasOwnProperty.call(portraits,v.portrait))throw new Error("Unapproved portrait key.");
  return {id:v.id,name:v.name,age:v.age,portrait:v.portrait,description:v.description};
 });
 const selectedId=items.length?(seen.has(input.selectedId)?input.selectedId:items[0].id):null;
 return {state:{schemaVersion:1,version:VERSION,selectedId,items},adjusted:selectedId!==input.selectedId};
}
const current=()=>state.items.find(v=>v.id===state.selectedId)||null;
const selectedButton=()=>buttons.find(b=>b.dataset.itemId===state.selectedId)||null;
const title=v=>v.name+(v.age===null?"":" (Age: "+v.age+")");
const serialise=()=>JSON.stringify(state,null,2);
const status=text=>$("editStatus").textContent=text;
function visibleTarget(e){
 return !!(e&&e.isConnected&&!e.disabled&&!e.closest("[hidden],[inert]")&&e.getClientRects().length);
}
function fallbackFocus(){
 if($("record").hidden){$("openRecord").focus();return;}
 const b=selectedButton();if(visibleTarget(b)){b.focus();return;}
 $("tools").open=true;
 ($("addItem").disabled?$("loadJson"):$("addItem")).focus();
}
function diagnose(){
 const lines=[],v=current();
 if(!$("record").hidden&&v){
  for(const id of ["itemName","description"]){
   const e=$(id);if(e.scrollWidth>e.clientWidth+1||e.scrollHeight>e.clientHeight+1)
    lines.push(id+" is bounded; full text is available below.");
  }
 }
 document.querySelectorAll("#stage img[src]").forEach(img=>{
  if(img.complete&&!img.naturalWidth)lines.push("Image failed: "+img.getAttribute("src"));
 });
 $("diagnostic").textContent=[...new Set(lines)].join("\n");
 $("fullText").hidden=!v||!lines.length||$("record").hidden;
}
const later=()=>requestAnimationFrame(diagnose);
function display(){
 const v=current();
 $("itemName").textContent=v?title(v):"No profiles";
 $("description").textContent=v?v.description:"This collection is empty.";
 $("description").scrollTop=0;
 $("preview").hidden=!v;
 if(v){$("preview").src=portraits[v.portrait];$("preview").alt=v.name;}
 else{$("preview").removeAttribute("src");$("preview").alt="";}
 const index=state.items.findIndex(item=>item.id===state.selectedId);
 $("profilePointer").hidden=index<0;
 if(index>=0)$("profilePointer").style.left=(190+90*index+35)+"px";
 $("nameEdit").value=v?v.name:"";
 $("ageEdit").value=v&&v.age!==null?String(v.age):"";
 $("descriptionEdit").value=v?v.description:"";
 $("portraitEdit").value=v?v.portrait:"dee";
 for(const id of ["nameEdit","ageEdit","descriptionEdit","portraitEdit","applyItem","deleteItem"])$(id).disabled=!v;
 $("addItem").disabled=state.items.length>=10;
 $("collectionStatus").textContent=state.items.length+" / 10 profiles";
 buttons.forEach(b=>{
  const chosen=b.dataset.itemId===state.selectedId;
  b.setAttribute("aria-pressed",String(chosen));b.tabIndex=chosen?0:-1;
 });
 later();
}
function select(index,focus){
 if(!state.items.length){state.selectedId=null;display();if(focus)fallbackFocus();return;}
 const n=state.items.length;state.selectedId=state.items[((index%n)+n)%n].id;
 display();if(focus)fallbackFocus();
}
function full(trigger){
 const v=current();if(!v)return;
 returnTarget=trigger;$("detailTitle").textContent=title(v);
 $("detailBody").textContent=title(v)+"\n\n"+v.description;
 $("detail").showModal();$("closeDetail").focus();
}
function build(){
 buttons=[];$("rail").replaceChildren();
 for(let i=0;i<10;i++){
  const v=state.items[i];
  if(!v){const e=document.createElement("div");e.className="slot empty";e.setAttribute("aria-hidden","true");$("rail").append(e);continue;}
  const b=document.createElement("button");b.type="button";b.className="slot";
  b.dataset.itemId=v.id;b.setAttribute("aria-label",v.name||"Unnamed profile "+(i+1));
  const image=document.createElement("img");image.className="icon";image.alt="";image.src=portraits[v.portrait];
  const corners=document.createElement("img");corners.className="selection";corners.alt="";corners.src="assets/corners.svg";
  for(const img of [image,corners]){img.addEventListener("load",later);img.addEventListener("error",later);}
  b.append(image,corners);b.addEventListener("click",()=>select(i,true));
  b.addEventListener("keydown",e=>{
   if(["ArrowLeft","ArrowRight","Home","End"].includes(e.key)){
    e.preventDefault();
    const n=state.items.findIndex(v=>v.id===state.selectedId);
    select(e.key==="Home"?0:e.key==="End"?state.items.length-1:n+(e.key==="ArrowLeft"?-1:1),true);
   }else if(e.key==="Enter"||e.key===" "){e.preventDefault();full(b);}
  });
  buttons.push(b);$("rail").append(b);
 }
 display();
}
function commit(result,message,focus){
 state=result.state;build();
 status(message+(result.adjusted?" Selection reset to "+(state.selectedId||"empty")+".":""));
 if(focus)fallbackFocus();
}
function reject(error){status("Rejected; current profiles and selection retained. "+error.message);}
function importText(raw){
 try{
  if(typeof raw!=="string"||raw.length>1000000)throw new Error("JSON text limit is 1,000,000 code units.");
  let input;try{input=JSON.parse(raw);}catch(_){throw new Error("Invalid JSON syntax.");}
  commit(validate(input),"Profiles imported.",true);
 }catch(error){reject(error);}
}
function resize(){
 const scale=Math.min(1,innerWidth/1280,Math.max(0,innerHeight-40)/720);
 const wasInside=$("stage").contains(document.activeElement);
 $("viewport").style.width=1280*scale+"px";$("viewport").style.height=720*scale+"px";
 $("stage").style.transform="scale("+scale+")";
 const unsupported=innerHeight>innerWidth||scale<.75;
 $("stage").inert=unsupported;$("sizeNotice").hidden=!unsupported;
 if(unsupported&&wasInside)fallbackFocus();later();
}
function closeRecord(){
 $("record").hidden=true;$("openRecord").hidden=false;
 later();$("openRecord").focus();
}
$("backRecord").addEventListener("click",closeRecord);
$("openRecord").addEventListener("click",()=>{
 $("record").hidden=false;$("openRecord").hidden=true;
 display();fallbackFocus();
});
$("stage").addEventListener("keydown",e=>{
 if(e.altKey||e.ctrlKey||e.metaKey||e.target.closest("input,textarea,select")||$("detail").open)return;
 if(e.key.toLowerCase()==="b"){e.preventDefault();closeRecord();}
 if(e.key.toLowerCase()==="r"){e.preventDefault();$("evidenceLink").click();}
});
$("editor").addEventListener("submit",e=>{
 e.preventDefault();const v=current();if(!v)return;
 const raw=$("ageEdit").value;
 const age=raw===""?null:Number(raw);
 try{commit(validate({...state,items:state.items.map(item=>item.id===v.id?{...item,name:$("nameEdit").value,age,description:$("descriptionEdit").value,portrait:$("portraitEdit").value}:{...item})}),"Applied. Export to retain edits.",false);}
 catch(error){reject(error);}
});
$("addItem").addEventListener("click",()=>{
 if(state.items.length>=10){status("Maximum 10 profiles; data retained.");return;}
 let i=1;while(state.items.some(v=>v.id==="profile-"+i))i++;
 const v={id:"profile-"+i,name:"New profile",age:null,portrait:"dee",description:"Editable demonstration profile."};
 try{commit(validate({...state,selectedId:v.id,items:[...state.items,v]}),"Profile added.",true);}
 catch(error){reject(error);}
});
$("deleteItem").addEventListener("click",()=>{
 const i=state.items.findIndex(v=>v.id===state.selectedId);if(i<0)return;
 const items=state.items.filter((_,n)=>n!==i),selectedId=items.length?items[Math.min(i,items.length-1)].id:null;
 try{commit(validate({...state,items,selectedId}),"Selected profile removed.",true);}
 catch(error){reject(error);}
});
$("loadJson").addEventListener("click",()=>{$("jsonEdit").value=serialise();status("Current profiles copied to JSON text.");});
$("importJson").addEventListener("click",()=>{readSerial++;importText($("jsonEdit").value);});
$("importFile").addEventListener("change",async()=>{
 const file=$("importFile").files[0];if(!file)return;const serial=++readSerial;
 try{if(file.size>2000000)throw new Error("File exceeds 2,000,000 bytes.");
 const raw=await file.text();if(serial===readSerial)importText(raw);}
 catch(error){if(serial===readSerial)reject(error);}
 finally{if(serial===readSerial)$("importFile").value="";}
});
$("export").addEventListener("click",()=>{
 const url=URL.createObjectURL(new Blob([serialise()],{type:"application/json;charset=utf-8"}));
 const a=document.createElement("a");a.href=url;a.download="aa2019-profiles-v04.json";
 document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);
});
$("fullText").addEventListener("click",()=>full($("fullText")));
$("closeDetail").addEventListener("click",()=>$("detail").close());
$("detail").addEventListener("close",()=>requestAnimationFrame(()=>{
 if(visibleTarget(returnTarget))returnTarget.focus();else fallbackFocus();returnTarget=null;
}));
document.querySelectorAll("#stage img").forEach(img=>{img.addEventListener("load",later);img.addEventListener("error",later);});
window.addEventListener("resize",resize);if(document.fonts)document.fonts.ready.then(later);
try{const result=validate(window.AA_PROFILES_DATA);state=result.state;}
catch(error){$("tools").open=true;status("Initial profiles rejected; empty state retained. "+error.message);}
build();resize();$("jsonEdit").value=serialise();
})();