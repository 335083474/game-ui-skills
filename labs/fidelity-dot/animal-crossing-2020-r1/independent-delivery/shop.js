"use strict";
(()=>{
 const $=id=>document.getElementById(id);
 const ICONS=Object.freeze({kit:"assets/customization-kit.png",seed:"assets/shop-seed.svg",sapling:"assets/shop-sapling.svg"});
 const BUILD="ACNH-shop-v0.1",clone=x=>JSON.parse(JSON.stringify(x));
 const missing=new Set();let state,supported=false,returnFocus=null,resizeFrame=0;
 function fail(s){throw new Error(s)}
 function exact(o,keys,path){
  if(!o||typeof o!=="object"||Array.isArray(o))fail(path+" must be an object");
  if(Object.keys(o).length!==keys.length||keys.some(k=>!Object.hasOwn(o,k)))fail(path+" has missing or extra fields");
 }
 function str(v,max,path,empty=true){if(typeof v!=="string"||v.length>max||(!empty&&!v.trim()))fail(path+" must be text of "+(empty?"0":"1")+".."+max+" UTF-16 units")}
 function int(v,min,max,path){if(!Number.isSafeInteger(v)||v<min||v>max)fail(path+" must be an integer "+min+".."+max)}
 function id(v,path){if(typeof v!=="string"||! /^[A-Za-z0-9][A-Za-z0-9_-]{0,39}$/.test(v))fail(path+" is not a valid id")}
 function validate(raw){
  exact(raw,["schemaVersion","version","category","speaker","balance","dialogue","products","selectedId","options","selectedOptionId","phase","receipt"],"root");
  if(raw.schemaVersion!==1||raw.version!==BUILD)fail("Unsupported schemaVersion/version");
  str(raw.category,300,"category",false);str(raw.speaker,300,"speaker",false);str(raw.dialogue,20000,"dialogue");
  int(raw.balance,0,999999999,"balance");
  if(!Array.isArray(raw.products)||raw.products.length<1||raw.products.length>8)fail("products must contain 1..8 entries");
  const ids=new Set();
  for(const [i,p] of raw.products.entries()){
   exact(p,["id","name","icon","unitPrice","owned","description"],"products["+i+"]");
   id(p.id,"product id");if(ids.has(p.id))fail("Duplicate product id");ids.add(p.id);
   str(p.name,300,"product name",false);str(p.description,20000,"product description");
   if(typeof p.icon!=="string"||!Object.hasOwn(ICONS,p.icon))fail("Unknown icon token; raw paths are not accepted");
   int(p.unitPrice,0,999999,"unitPrice");int(p.owned,0,999999,"owned");
  }
  id(raw.selectedId,"selectedId");if(!ids.has(raw.selectedId))fail("selectedId must refer to an existing product");
  if(!Array.isArray(raw.options)||raw.options.length<2||raw.options.length>4)fail("options must contain 2..4 entries: one cancel plus 1..3 purchases");
  const opts=new Set();let cancelCount=0;
  for(const o of raw.options){
   exact(o,["id","kind","label","quantity"],"option");id(o.id,"option id");
   if(opts.has(o.id))fail("Duplicate option id");opts.add(o.id);str(o.label,300,"option label",false);
   if(o.kind==="cancel"){cancelCount++;if(o.quantity!==0)fail("Cancel quantity must be zero")}
   else if(o.kind==="buy")int(o.quantity,1,99,"quantity");else fail("kind must be buy or cancel");
  }
  if(cancelCount!==1)fail("Exactly one cancel option is required");
  id(raw.selectedOptionId,"selectedOptionId");if(!opts.has(raw.selectedOptionId))fail("selectedOptionId must exist");
  if(!["choosing","purchased","cancelled"].includes(raw.phase))fail("Invalid phase");
  if(raw.phase!=="purchased"){if(raw.receipt!==null)fail("Receipt must be null outside purchased phase")}
  else{
   const r=raw.receipt;exact(r,["productId","quantity","unitPrice","total","before","after"],"receipt");
   if(!ids.has(r.productId))fail("Receipt product is missing");
   int(r.quantity,1,99,"receipt quantity");int(r.unitPrice,0,999999,"receipt unitPrice");int(r.total,0,98999901,"receipt total");int(r.before,0,999999999,"receipt before");int(r.after,0,999999999,"receipt after");
   if(r.total!==r.quantity*r.unitPrice||r.after!==r.before-r.total||r.after!==raw.balance)fail("Receipt arithmetic does not match balance");
  }
  return clone(raw);
 }
 function current(){return state.products.find(p=>p.id===state.selectedId)}
 function cash(v){return v.toLocaleString("en-US")}
 function report(text){$("status").textContent=text}
 function image(path,alt=""){
  const im=document.createElement("img");im.alt=alt;
  im.onload=()=>{missing.delete(path);diagnostics()};
  im.onerror=()=>{missing.add(path);diagnostics()};
  im.src=path;return im;
 }
 function diagnostics(){
  const clipped=[];
  for(const el of [$("category"),$("speaker"),$("productLine"),$("speechText"),...document.querySelectorAll(".choice .line"),...document.querySelectorAll(".good output")]){
   if(el&&el.getClientRects().length&&(el.scrollWidth>el.clientWidth+1||el.scrollHeight>el.clientHeight+1))clipped.push(el.id||el.className||"price");
  }
  const text=[clipped.length?"Bounded text: "+[...new Set(clipped)].join(", ")+". Read all text preserves the complete values.":"",
  missing.size?"Missing image: "+[...missing].join(", "):""].filter(Boolean).join(" ");
  $("diagnostic").textContent=text;$("diagnostic").hidden=!text;
 }
 function focusOption(){
  if(!supported)return;
  const el=[...$("choices").querySelectorAll("button")].find(b=>b.dataset.optionId===state.selectedOptionId);
  el?.focus();
 }
 function chooseProduct(productId){
  if(!supported)return;
  state.selectedId=productId;state.phase="choosing";state.receipt=null;
  state.selectedOptionId=state.options.find(o=>o.kind==="buy").id;
  report("");render();focusOption();
 }
 function render(){
  const p=current();$("category").textContent=state.category;$("speaker").textContent=state.speaker;
  $("balance").textContent=cash(state.balance);$("productName").textContent=p.name;$("dialogue").textContent=state.dialogue;
  $("goods").replaceChildren();
  for(const product of state.products){
   const b=document.createElement("button");b.className="good";b.type="button";b.dataset.productId=product.id;
   b.setAttribute("aria-label",product.name+", "+product.unitPrice+" Bells, owned "+product.owned);
   b.append(image(ICONS[product.icon]));
   const cost=document.createElement("output");cost.textContent="♧ "+cash(product.unitPrice);b.append(cost);
   b.onclick=()=>chooseProduct(product.id);$("goods").append(b);
  }
  $("choices").replaceChildren();$("choicePanel").dataset.count=String(state.options.length);
  for(const o of state.options){
   const b=document.createElement("button");b.type="button";b.className="choice"+(o.id===state.selectedOptionId?" selected":"");b.dataset.optionId=o.id;
   const line=document.createElement("span");line.className="line";line.append(document.createTextNode(o.label));
   if(o.kind==="buy"){
    line.append(document.createTextNode(" ("));
    const price=document.createElement("span");price.className="cost";price.textContent="♧"+cash(p.unitPrice*o.quantity);line.append(price,document.createTextNode(")"));
   }
   b.append(line);b.setAttribute("aria-label",o.label+(o.kind==="buy"?", "+(p.unitPrice*o.quantity)+" Bells":""));
   b.onfocus=()=>{state.selectedOptionId=o.id;for(const other of $("choices").children)other.classList.toggle("selected",other===b)};
   b.onclick=()=>activate(o.id);$("choices").append(b);
  }
  const choosing=state.phase==="choosing";$("choicePanel").hidden=!choosing;
  $("cancel").disabled=!choosing;$("select").disabled=!choosing;
  $("reopen").disabled=choosing;
  if(state.phase==="purchased"){const r=state.receipt;report("Purchased "+r.quantity+" × "+state.products.find(x=>x.id===r.productId).name+". Paid "+cash(r.total)+". Balance "+cash(r.after)+". Use Open purchase choices to start another transaction.")}
  if(state.phase==="cancelled")report("Cancelled. Balance and owned quantities were not changed.");
  $("editor").value=JSON.stringify(state,null,2);requestAnimationFrame(diagnostics);
 }
 function activate(optionId){
  if(!supported||state.phase!=="choosing"||$("detail").open)return;
  const o=state.options.find(x=>x.id===optionId);if(!o)return;
  state.selectedOptionId=o.id;
  if(o.kind==="cancel"){state.phase="cancelled";state.receipt=null;render();$("reopen").focus();return}
  const p=current(),total=p.unitPrice*o.quantity;
  if(state.balance<total){report("Insufficient Bells. Nothing purchased; balance and quantity unchanged.");focusOption();return}
  if(p.owned+o.quantity>999999){report("Owned quantity limit would be exceeded. Nothing purchased.");focusOption();return}
  const before=state.balance;state.balance-=total;p.owned+=o.quantity;
  state.phase="purchased";state.receipt={productId:p.id,quantity:o.quantity,unitPrice:p.unitPrice,total,before,after:state.balance};
  render();$("reopen").focus();
 }
 function cancel(){const o=state.options.find(x=>x.kind==="cancel");activate(o.id)}
 function readAll(trigger){
  returnFocus=trigger||document.activeElement;
  $("fullText").textContent="Category: "+state.category+"\nSpeaker: "+state.speaker+"\nBalance: "+state.balance+"\nSelected: "+current().name+"\n\n"+state.dialogue+"\n\n"+state.products.map(p=>p.name+"\nPrice: "+p.unitPrice+" · Owned: "+p.owned+"\n"+p.description).join("\n\n")+"\n\nOptions\n"+state.options.map(o=>o.label+" · "+o.kind+" · "+o.quantity).join("\n")+"\n\nComplete JSON\n"+JSON.stringify(state,null,2);
  $("detail").showModal();$("fullText").focus();
 }
 $("full").onclick=e=>readAll(e.currentTarget);$("diagnostic").onclick=e=>readAll(e.currentTarget);
 $("closeDetail").onclick=()=>$("detail").close();
 $("detail").addEventListener("close",()=>{
  if(returnFocus?.isConnected&&!returnFocus.disabled&&!returnFocus.hidden&&!returnFocus.closest("[inert]"))returnFocus.focus();
  else $("full").focus();
 });
 $("select").onclick=()=>activate(state.selectedOptionId);$("cancel").onclick=cancel;
 $("reopen").onclick=()=>{
  state.phase="choosing";state.receipt=null;state.selectedOptionId=state.options.find(o=>o.kind==="buy").id;
  report("");render();if(supported)focusOption();
 };
 $("choices").addEventListener("keydown",e=>{
  if(!supported||$("detail").open||state.phase!=="choosing")return;
  let i=state.options.findIndex(o=>o.id===state.selectedOptionId);
  if(e.key==="ArrowDown"||e.key==="ArrowRight")i=(i+1)%state.options.length;
  else if(e.key==="ArrowUp"||e.key==="ArrowLeft")i=(i+state.options.length-1)%state.options.length;
  else if(e.key==="Home")i=0;else if(e.key==="End")i=state.options.length-1;else return;
  e.preventDefault();state.selectedOptionId=state.options[i].id;focusOption();
 });
 $("stage").addEventListener("keydown",e=>{
  if(e.key==="Escape"&&!$("detail").open&&state.phase==="choosing"){e.preventDefault();cancel()}
 });
 function applyText(text){
  try{
   if(text.length>500000)fail("JSON text exceeds 500,000 UTF-16 units");
   const next=validate(JSON.parse(text));state=next;missing.clear();$("editError").textContent="";report("Imported valid data.");render();resize();
  }catch(e){$("editError").textContent="Not applied: "+e.message}
 }
 $("apply").onclick=()=>applyText($("editor").value);
 $("import").onchange=async e=>{
  const f=e.target.files[0];if(!f)return;
  try{if(f.size>2000000)fail("File exceeds 2,000,000 bytes");applyText(await f.text())}catch(error){$("editError").textContent="Not applied: "+error.message}
  e.target.value="";
 };
 $("export").onclick=()=>{
  const blob=new Blob([JSON.stringify(state,null,2)],{type:"application/json;charset=utf-8"});
  const url=URL.createObjectURL(blob),a=document.createElement("a");a.href=url;a.download="acnh-shop-data.json";document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);
 };
 function resize(){
  const root=document.documentElement,vv=window.visualViewport;
  const w=Math.max(0,Math.min(root.clientWidth,vv?vv.width:root.clientWidth));
  const h=Math.max(0,Math.min(root.clientHeight,vv?vv.height:root.clientHeight));
  const s=Math.floor(Math.max(0,Math.min(1,w/1280,h/720))*1000000)/1000000;
  const sw=1280*s,sh=720*s;supported=w>=h&&sw>=960&&sh>=540;
  $("viewport").style.width=sw+"px";$("viewport").style.height=sh+"px";$("stage").style.transform="scale("+s+")";
  const held=$("stage").contains(document.activeElement);$("stage").inert=!supported;$("sizeNotice").hidden=supported;
  if(!supported&&held&&!$("detail").open)$("sizeNotice").focus();
  diagnostics();
 }
 function schedule(){cancelAnimationFrame(resizeFrame);resizeFrame=requestAnimationFrame(resize)}
 window.addEventListener("resize",schedule);window.visualViewport?.addEventListener("resize",schedule);
 if(typeof ResizeObserver!=="undefined"){const observer=new ResizeObserver(schedule);observer.observe(document.documentElement)}
 $("room").onerror=()=>{missing.add("assets/shop-background.png");diagnostics()};
 $("room").onload=()=>{missing.delete("assets/shop-background.png");diagnostics()};
 state=validate(window.ACNH_SHOP_INITIAL);render();resize();
})();