"use strict";
(() => {
const $=id=>document.getElementById(id),VERSION="Inventory-v0.1";
let state=JSON.parse(JSON.stringify(window.HK_INVENTORY_INITIAL)),buttons=[],textErrors=[];
const assetErrors=new Set();
const validPath=p=>typeof p==="string"&&/^assets\/[A-Za-z0-9_./-]+\.(svg|png|jpg|jpeg|webp)$/i.test(p)&&!p.split("/").includes("..");
const integer=(v,a,b)=>Number.isInteger(v)&&v>=a&&v<=b;
function validate(s){
 if(!s||typeof s.title!=="string"||s.title.length>300)throw Error("Menu title: maximum 300 characters");
 if(!integer(s.geo,0,999999))throw Error("Geo must be an integer 0–999999");
 if(!Array.isArray(s.items)||s.items.length<1||s.items.length>20)throw Error("Use 1–20 items");
 if(!integer(s.selected,0,s.items.length-1))throw Error("Selected index is outside items");
 const ids=new Set();
 const items=s.items.map((v,i)=>{
  if(!v||typeof v.id!=="string"||!v.id||ids.has(v.id))throw Error("Unique nonempty item ids required");ids.add(v.id);
  if(typeof v.name!=="string"||v.name.length>300||typeof v.description!=="string"||v.description.length>20000)throw Error("Invalid text on item "+(i+1));
  if(!validPath(v.icon))throw Error("Use a relative assets/ image path without parent traversal");
  if(v.quantity!==null&&!integer(v.quantity,0,9999))throw Error("Quantity must be null or integer 0–9999");
  for(const k of ["x","y","w","h","artW","artH"])if(!Number.isFinite(v[k]))throw Error("Invalid geometry: "+k);
  if(v.x<160||v.y<200||v.w<70||v.h<70||v.x+v.w>1220||v.y+v.h>850)throw Error("Item bounds: x160–1220, y200–850; minimum70×70");
  if(v.artW<1||v.artH<1||v.artW>v.w||v.artH>v.h)throw Error("Artwork must fit its item box");
  return {id:v.id,name:v.name,icon:v.icon,quantity:v.quantity,description:v.description,x:v.x,y:v.y,w:v.w,h:v.h,artW:v.artW,artH:v.artH};
 });
 return {version:VERSION,title:s.title,geo:s.geo,selected:s.selected,items};
}
function diagnostics(){$("assetWarning").textContent=[...assetErrors,...textErrors].join(" · ");}
function missing(path){assetErrors.add("Missing image: "+path);diagnostics();}
function overflow(el){return el.scrollWidth>el.clientWidth+1||el.scrollHeight>el.clientHeight+1;}
function checkText(){
 textErrors=[];const menu=overflow($("menuTitle")),name=overflow($("invName")),body=overflow($("invDescription"));
 if(menu)textErrors.push("Menu title shortened; complete title via X / Read full text");
 if(name)textErrors.push("Item name shortened; complete name via X / Read full text");
 if(body)textErrors.push("Description scrolls; complete text via X / Read full text");
 $("invFull").hidden=!(menu||name||body);diagnostics();
}
function resize(){
 const v=$("viewport"),s=$("stage"),scale=Math.min(v.clientWidth/1920,v.clientHeight/1080);
 s.style.transform="scale("+scale+")";s.style.left=((v.clientWidth-1920*scale)/2)+"px";s.style.top=((v.clientHeight-1080*scale)/2)+"px";
 const unsupported=window.innerHeight>window.innerWidth||scale<.5;
 v.classList.toggle("unsupported",unsupported);s.inert=unsupported;$("sizeNotice").hidden=!unsupported;
 $("sizeNotice").textContent=unsupported?"Desktop/landscape only. Minimum game area 960×540; recommended browser 1280×720 or larger. 竖屏或过小画面不支持操作，请放大窗口；下方仍可编辑数据。":"";
 requestAnimationFrame(checkText);
}
function syncEditor(){
 const v=state.items[state.selected];$("editTitle").value=state.title;$("editGeo").value=state.geo;$("editIndex").value=(state.selected+1)+" / "+state.items.length;
 $("editName").value=v.name;$("editIcon").value=v.icon;$("editDescription").value=v.description;$("editQuantity").value=v.quantity===null?"":String(v.quantity);
}
function select(index,focus=false){
 state.selected=((index%state.items.length)+state.items.length)%state.items.length;
 buttons.forEach((b,i)=>{const a=i===state.selected;b.tabIndex=a?0:-1;b.setAttribute("aria-pressed",String(a));});
 const v=state.items[state.selected];$("invName").textContent=v.name;$("invName").title=v.name;$("invDescription").replaceChildren();
 v.description.split(/\n\s*\n/).forEach(t=>{const p=document.createElement("p");p.textContent=t;$("invDescription").append(p);});
 $("invDescription").scrollTop=0;syncEditor();requestAnimationFrame(checkText);if(focus&&!$("stage").inert)buttons[state.selected].focus({preventScroll:true});
}
function navigate(key){
 const d={ArrowLeft:[-1,0],ArrowRight:[1,0],ArrowUp:[0,-1],ArrowDown:[0,1]}[key];if(!d)return;
 const a=state.items[state.selected],ax=a.x+a.w/2,ay=a.y+a.h/2;let best=-1,score=Infinity;
 state.items.forEach((b,i)=>{if(i===state.selected)return;const dx=b.x+b.w/2-ax,dy=b.y+b.h/2-ay,f=dx*d[0]+dy*d[1];if(f<=1)return;const q=f+Math.abs(dx*d[1]-dy*d[0])*2.5;if(q<score){score=q;best=i;}});
 if(best<0)best=state.selected+(key==="ArrowLeft"||key==="ArrowUp"?-1:1);select(best,true);
}
function openDetails(){
 const v=state.items[state.selected];$("dialogTitle").textContent=v.name;$("dialogBody").textContent="Menu: "+state.title+"\nItem: "+v.name+"\nQuantity: "+(v.quantity===null?"not shown":v.quantity)+"\nGeo: "+state.geo+"\n\n"+v.description;$("dialog").showModal();
}
function render(){
 assetErrors.clear();textErrors=[];diagnostics();$("menuTitle").textContent=state.title;$("menuTitle").title=state.title;$("geoValue").textContent=String(state.geo);$("items").replaceChildren();buttons=[];
 state.items.forEach((v,i)=>{
  const b=document.createElement("button");b.type="button";b.className="inv-item";b.setAttribute("aria-label",v.name);Object.assign(b.style,{left:v.x+"px",top:v.y+"px",width:v.w+"px",height:v.h+"px"});
  const art=document.createElement("img");art.src=v.icon;art.alt="";art.className="item-art";art.style.width=v.artW+"px";art.style.height=v.artH+"px";art.addEventListener("error",()=>missing(v.icon));b.append(art);
  for(const c of ["tl","tr","bl","br"]){const el=document.createElement("span");el.className="corner "+c;el.setAttribute("aria-hidden","true");b.append(el);}
  if(v.quantity!==null){const q=document.createElement("span");q.className="item-quantity";q.textContent=String(v.quantity);b.append(q);}
  b.addEventListener("click",()=>select(i,true));b.addEventListener("keydown",e=>{
   if(e.key.startsWith("Arrow")){e.preventDefault();navigate(e.key);}
   if(e.key==="Home"||e.key==="End"){e.preventDefault();select(e.key==="Home"?0:state.items.length-1,true);}
   if(e.key==="Enter"||e.key===" "||e.key.toLowerCase()==="x"){e.preventDefault();openDetails();}
  });buttons.push(b);$("items").append(b);
 });select(state.selected);resize();document.querySelectorAll("#stage img").forEach(img=>{if(img.complete&&img.naturalWidth===0)missing(img.getAttribute("src"));});
}
$("inspect").addEventListener("click",openDetails);$("invFull").addEventListener("click",openDetails);
$("dialog").addEventListener("close",()=>{if(!$("stage").inert)buttons[state.selected]?.focus({preventScroll:true});});
document.querySelectorAll("#stage img").forEach(img=>img.addEventListener("error",()=>missing(img.getAttribute("src"))));
$("invEditor").addEventListener("submit",e=>{
 e.preventDefault();try{const n=JSON.parse(JSON.stringify(state));n.title=$("editTitle").value;n.geo=Number($("editGeo").value);
 Object.assign(n.items[n.selected],{name:$("editName").value,icon:$("editIcon").value,description:$("editDescription").value,quantity:$("editQuantity").value===""?null:Number($("editQuantity").value)});state=validate(n);render();$("invStatus").textContent="Applied; export JSON to retain changes.";
 }catch(err){$("invStatus").textContent="Not applied: "+err.message;}
});
$("invExport").addEventListener("click",()=>{const u=URL.createObjectURL(new Blob([JSON.stringify(state,null,2)],{type:"application/json;charset=utf-8"}));const a=document.createElement("a");a.href=u;a.download="inventory-v0.1-data.json";a.click();setTimeout(()=>URL.revokeObjectURL(u),1000);});
$("invImport").addEventListener("change",async e=>{const f=e.target.files[0];if(!f)return;try{if(f.size>2000000)throw Error("JSON exceeds 2 MB");const n=validate(JSON.parse(await f.text()));state=n;render();$("invStatus").textContent="Imported "+state.items.length+" items";}catch(err){$("invStatus").textContent="Import rejected; old state retained: "+err.message;}e.target.value="";});
new ResizeObserver(resize).observe($("viewport"));window.addEventListener("resize",resize);
try{state=validate(state);render();if(document.fonts?.ready)document.fonts.ready.then(checkText);}catch(err){$("invStatus").textContent="Initial data invalid: "+err.message;}
})();