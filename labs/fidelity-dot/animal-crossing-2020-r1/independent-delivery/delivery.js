"use strict";
(()=>{
const $=id=>document.getElementById(id), icons={seed:"assets/shop-seed.svg",sapling:"assets/shop-sapling.svg",kit:"assets/customization-kit.png",shovel:"assets/shovel.svg",net:"assets/net.svg",rod:"assets/fishing-rod.svg",axe:"assets/axe.svg",ladder:"assets/ladder.svg",slingshot:"assets/slingshot.svg",wateringCan:"assets/watering-can.svg"};
const keys=(v,k)=>v&&typeof v==="object"&&!Array.isArray(v)&&Object.keys(v).sort().join("|")===k.slice().sort().join("|");
const rootKeys=["schemaVersion","version","title","requester","message","items","list","phase","result"],itemKeys=["id","name","icon","owned","required","description"],lineKeys=["id","quantity"],resultKeys=["lines","totalUnits"];
const idOK=s=>typeof s==="string"&&/^[A-Za-z0-9][A-Za-z0-9_-]{0,39}$/.test(s),str=(s,max,nonempty=false)=>typeof s==="string"&&s.length<=max&&(!nonempty||s.length>0),num=(n,max,min=0)=>Number.isSafeInteger(n)&&n>=min&&n<=max;
function validate(d){if(!keys(d,rootKeys)||d.schemaVersion!==1||d.version!=="ACNH-delivery-research-v0.1")throw Error("根数据字段或版本不符合交付协议");if(!str(d.title,300,true)||!str(d.requester,300,true)||!str(d.message,20000))throw Error("文案长度不符合限制");if(!Array.isArray(d.items)||d.items.length>12||!Array.isArray(d.list)||d.list.length>12)throw Error("候选或清单最多 12 项");let ids=new Set();for(const i of d.items){if(!keys(i,itemKeys)||!idOK(i.id)||ids.has(i.id)||typeof i.icon!=="string"||!Object.hasOwn(icons,i.icon)||!str(i.name,300,true)||!str(i.description,20000)||!num(i.owned,9999)||!num(i.required,9999))throw Error("候选物品字段、图标、库存或 ID 无效");ids.add(i.id)}let selected=new Set();for(const l of d.list){if(!keys(l,lineKeys)||!ids.has(l.id)||selected.has(l.id)||!num(l.quantity,9999,1))throw Error("清单有重复、未知物品或无效数量");selected.add(l.id)}if(!["editing","delivered"].includes(d.phase))throw Error("交付阶段无效");if(d.phase==="editing"&&d.result!==null)throw Error("编辑阶段结果必须为 null");if(d.phase==="delivered"){if(!keys(d.result,resultKeys)||!Array.isArray(d.result.lines)||!num(d.result.totalUnits,119988))throw Error("交付结果格式无效");let sum=0,seen=new Set();for(const l of d.result.lines){if(!keys(l,["id","name","quantity","before","after"])||!idOK(l.id)||seen.has(l.id)||!str(l.name,300,true)||!num(l.quantity,9999,1)||!num(l.before,9999)||!num(l.after,9999)||l.before-l.quantity!==l.after||!ids.has(l.id)||d.items.find(i=>i.id===l.id).owned!==l.after)throw Error("交付回执不一致");seen.add(l.id);sum+=l.quantity}if(sum!==d.result.totalUnits||d.result.lines.length===0||d.list.length!==0)throw Error("回执合计或已结清清单不正确")}}

// Independent original + dot repair-r1. JSON schema/version and validation above are inherited.
const BUILD="ACNH-delivery-research-repair-r1", PAGE_SIZE=6;
let data=structuredClone(window.ACNH_DELIVERY_INITIAL);validate(data);
let pending=false,page=0,supported=true,fullReturn=null,diagnosticFrame=0;
const missingImages=new Set();
const item=id=>data.items.find(i=>i.id===id),fmt=n=>n.toLocaleString("zh-CN"),total=()=>data.list.reduce((n,l)=>n+l.quantity,0),shortage=()=>data.list.filter(l=>l.quantity>item(l.id).owned),editable=()=>data.phase==="editing";
const el=(tag,cls,txt)=>{const e=document.createElement(tag);if(cls)e.className=cls;if(txt!==undefined)e.textContent=txt;return e};
const pages=()=>Math.max(1,Math.ceil(data.items.length/PAGE_SIZE));
const canAdd=id=>{const it=item(id),line=data.list.find(l=>l.id===id);return !!(it&&editable()&&it.owned>0&&(!line||line.quantity<it.owned))};
document.title="岛民委托交付清单 · repair-r1";
document.querySelector(".review>p").textContent="独立新功能初稿 + dot repair-r1 · 研究候选，待接收方复验 · 原冻结两页包不变";
$("sizeNotice").tabIndex=-1;
$("candidateList").setAttribute("aria-label","分页候选物品");
const pager=el("nav");pager.id="candidatePager";pager.setAttribute("aria-label","候选分页");
const prev=el("button","","上一页"),next=el("button","","下一页"),pageLabel=el("span");
prev.type=next.type="button";prev.id="candidatePrev";next.id="candidateNext";pageLabel.id="candidatePageLabel";
pageLabel.setAttribute("aria-live","polite");pager.append(prev,pageLabel,next);$("candidatePanel").append(pager);
const diagnosticButton=el("button");diagnosticButton.id="textDiagnostic";diagnosticButton.type="button";diagnosticButton.hidden=true;$("status").after(diagnosticButton);
const modalOpen=()=>["confirmDialog","resultDialog","fullDialog"].some(id=>$(id).open);
function usable(node){return !!(node?.isConnected&&!node.disabled&&!node.hidden&&!node.closest("[inert],[hidden]")&&node.getClientRects().length)}
function candidateButton(id){return [...$("candidateList").querySelectorAll("button")].find(b=>b.dataset.itemId===id)}
function entryButton(id,action){return [...$("entryList").querySelectorAll("button")].find(b=>b.dataset.itemId===id&&b.dataset.action===action)}
function captureFocus(){
 const node=document.activeElement;
 if(node?.classList.contains("candidate"))return{scope:"candidate",id:node.dataset.itemId,at:data.items.findIndex(i=>i.id===node.dataset.itemId)};
 if(node?.dataset.action)return{scope:"entry",id:node.dataset.itemId,action:node.dataset.action,at:data.list.findIndex(l=>l.id===node.dataset.itemId)};
 return{scope:"external",node};
}
function revealEntry(node){
 const row=node.closest(".entry");if(!row)return;
 const list=$("entryList"),top=row.offsetTop-6,bottom=row.offsetTop+row.offsetHeight+6;
 if(top<list.scrollTop)list.scrollTop=Math.max(0,top);
 else if(bottom>list.scrollTop+list.clientHeight)list.scrollTop=bottom-list.clientHeight;
}
function focusNode(node){
 if(!usable(node))return false;
 node.focus({preventScroll:true});revealEntry(node);return document.activeElement===node;
}
function focusCandidate(id){
 if(!supported||!canAdd(id))return false;
 const targetPage=Math.floor(data.items.findIndex(i=>i.id===id)/PAGE_SIZE);
 if(page!==targetPage){page=targetPage;render({scope:"none"})}
 return focusNode(candidateButton(id));
}
function nearestEntries(at){
 const n=Math.max(0,Math.min(at,data.list.length));
 return [...data.list.slice(n),...data.list.slice(0,n).reverse()];
}
function nearestCandidates(at){
 const n=Math.max(0,Math.min(at,data.items.length));
 return [...data.items.slice(n),...data.items.slice(0,n).reverse()];
}
function restoreFocus(mark){
 if(!mark||mark.scope==="none"||modalOpen())return;
 if(mark.scope==="external"){
  if(mark.node!==document.body&&usable(mark.node))focusNode(mark.node);
  return;
 }
 if(!supported){focusNode($("full"));return}
 if(mark.scope==="candidate"){
  if(focusCandidate(mark.id))return;
  // At the add limit, the same item's minus control is the nearest useful action.
  if(focusNode(entryButton(mark.id,"minus")))return;
  for(const it of nearestCandidates(mark.at))if(focusCandidate(it.id))return;
 }else if(mark.scope==="entry"){
  if(focusNode(entryButton(mark.id,mark.action)))return;
  for(const action of ["minus","remove","plus"])if(focusNode(entryButton(mark.id,action)))return;
  for(const line of nearestEntries(mark.at)){
   for(const action of [mark.action,"minus","remove","plus"])if(focusNode(entryButton(line.id,action)))return;
  }
  if(focusCandidate(mark.id))return;
  for(const it of data.items)if(focusCandidate(it.id))return;
 }
 if(focusNode($("submit")))return;focusNode($("full"));
}
function queueDiagnostics(){
 cancelAnimationFrame(diagnosticFrame);
 diagnosticFrame=requestAnimationFrame(()=>{
  const nodes=[$("heading"),$("requester"),$("speaker"),$("message"),...document.querySelectorAll(".candidateName,.entryName strong")];
  const clipped=nodes.some(n=>n.getClientRects().length&&(n.scrollWidth>n.clientWidth+1||n.scrollHeight>n.clientHeight+1));
  const text=[clipped?"部分名称或留言在舞台内省略；点击阅读完整文字，原值及导出未删减。":"",
  missingImages.size?"缺少图像："+[...missingImages].join("、"):""].filter(Boolean).join(" ");
  const hadFocus=document.activeElement===diagnosticButton;
  diagnosticButton.textContent=text;diagnosticButton.hidden=!text;
  if(hadFocus&&!text&&!modalOpen())focusNode($("full"));
 });
}
function makeImg(it){
 const img=el("img"),path=icons[it.icon];img.alt="";
 img.addEventListener("error",()=>{missingImages.add(path);queueDiagnostics()});
 img.addEventListener("load",()=>{missingImages.delete(path);queueDiagnostics()});
 img.src=path;return img;
}
function inventoryText(it,missing=false){
 const small=el("small");
 small.append(el("span","","需 "+it.required),el("span",missing?"shortage":"","有 "+it.owned+(missing?" · 不足":"")));
 return small;
}
function editLine(id,action){
 if(!editable()||!supported||modalOpen())return;
 const index=data.list.findIndex(l=>l.id===id),line=data.list[index];
 if(!line)return;
 const mark={scope:"entry",id,action,at:index};
 if(action==="minus"){if(line.quantity===1)data.list.splice(index,1);else line.quantity--}
 else if(action==="plus"){if(line.quantity>=item(id).owned||line.quantity>=9999)return;line.quantity++}
 else if(action==="remove")data.list.splice(index,1);
 render(mark);$("status").textContent="清单已更新："+item(id).name;
}
function add(id){
 if(!supported||modalOpen()||!canAdd(id))return;
 const mark={scope:"candidate",id,at:data.items.findIndex(i=>i.id===id)};
 const line=data.list.find(l=>l.id===id);if(line)line.quantity++;else data.list.push({id,quantity:1});
 render(mark);$("status").textContent="已加入："+item(id).name;
}
function render(mark=captureFocus()){
 const scroll=$("entryList").scrollTop;
 page=Math.max(0,Math.min(page,pages()-1));
 $("heading").textContent=data.title;$("requester").textContent=data.requester;$("speaker").textContent=data.requester;$("message").textContent=data.message;
 $("candidateList").replaceChildren();
 for(const it of data.items.slice(page*PAGE_SIZE,(page+1)*PAGE_SIZE)){
  const b=el("button","candidate");b.type="button";b.dataset.itemId=it.id;b.disabled=!canAdd(it.id);
  b.title=it.name+"｜需要 "+it.required+"｜持有 "+it.owned+"｜"+it.description;
  b.setAttribute("aria-label","添加 "+it.name+"；需要 "+it.required+"；持有 "+it.owned);
  b.append(makeImg(it),el("span","candidateName",it.name),inventoryText(it));
  b.onclick=()=>add(it.id);$("candidateList").append(b);
 }
 if(!data.items.length)$("candidateList").append(el("p","emptyState","没有候选物品"));
 pageLabel.textContent=(page+1)+" / "+pages()+" 页 · "+data.items.length+" 件";
 prev.disabled=page===0;next.disabled=page===pages()-1;
 $("entryList").replaceChildren();
 if(!data.list.length)$("entryList").append(el("p","emptyState",data.phase==="delivered"?"交付完毕！清单已结清":"清单还是空的…\n从左侧选择物品吧！"));
 for(const l of data.list){
  const it=item(l.id),row=el("div","entry"),name=el("div","entryName"),controls=el("div","quantityControls");
  row.dataset.itemId=it.id;name.append(el("strong","",it.name),inventoryText(it,l.quantity>it.owned));
  const minus=el("button","","−"),plus=el("button","","+"),remove=el("button","remove","×"),out=el("output","",String(l.quantity));
  for(const [b,action,label] of [[minus,"minus","减少"],[plus,"plus","增加"],[remove,"remove","移除"]]){
   b.type="button";b.dataset.itemId=it.id;b.dataset.action=action;b.setAttribute("aria-label",label+" "+it.name);
   b.disabled=!editable()||(action==="plus"&&(l.quantity>=it.owned||l.quantity>=9999));
   b.onclick=()=>editLine(it.id,action);
  }
  out.setAttribute("aria-label",it.name+"交付数量");controls.append(minus,out,plus,remove);
  row.append(makeImg(it),name,controls);$("entryList").append(row);
 }
 $("entryList").scrollTop=scroll;
 $("count").textContent="("+data.list.length+"项)";
 $("subtotal").textContent="合计 "+fmt(total())+" 件"+(shortage().length?"\n数量不足":"");
 $("submit").disabled=!editable()||data.list.length===0||shortage().length>0;
 $("submit").textContent=data.phase==="delivered"?"已交付 ✓":"确认交付 ➜";
 $("editor").value=JSON.stringify(data,null,2);
 restoreFocus(mark);queueDiagnostics();
}
function changePage(delta,trigger){
 if(!supported||modalOpen())return;
 page=Math.max(0,Math.min(page+delta,pages()-1));render({scope:"none"});
 const first=[...$("candidateList").querySelectorAll("button")].find(usable);
 if(focusNode(first))return;
 if(focusNode(trigger))return;
 if(focusNode(delta>0?prev:next))return;focusNode($("full"));
}
prev.onclick=()=>changePage(-1,prev);next.onclick=()=>changePage(1,next);
$("candidateList").addEventListener("keydown",e=>{
 if(!supported||modalOpen()||!e.target.classList.contains("candidate"))return;
 const all=data.items.filter(it=>canAdd(it.id));if(!all.length)return;
 let n=all.findIndex(it=>it.id===e.target.dataset.itemId);
 if(e.key==="ArrowRight"||e.key==="ArrowDown")n=(n+1)%all.length;
 else if(e.key==="ArrowLeft"||e.key==="ArrowUp")n=(n+all.length-1)%all.length;
 else if(e.key==="Home")n=0;else if(e.key==="End")n=all.length-1;
 else return;
 e.preventDefault();focusCandidate(all[n].id);
});
function confirm(){
 if(!supported||modalOpen())return;
 if(!editable()||!data.list.length){$("status").textContent="清单为空，无法提交";return}
 if(shortage().length){$("status").textContent="数量不足："+shortage().map(l=>item(l.id).name).join("、");return}
 $("confirmText").textContent=data.list.map(l=>item(l.id).name+" × "+l.quantity+"（持有 "+item(l.id).owned+"）").join("\n")+"\n\n总计 "+total()+" 件。确认后会扣减持有量。";
 pending=true;$("confirmDialog").showModal();$("no").focus();
}
$("submit").onclick=confirm;
$("no").onclick=()=>{$("confirmDialog").close();$("status").textContent="已取消：库存和清单均未改变"};
$("confirmDialog").addEventListener("cancel",()=>{$("status").textContent="已取消：库存和清单均未改变"});
$("confirmDialog").addEventListener("close",()=>{
 pending=false;
 // A confirmed submission opens the result dialog; never steal that dialog's focus.
 if(modalOpen())return;
 if(!focusNode($("submit")))focusNode($("full"));
});
$("yes").onclick=()=>{
 if(!pending||!editable()||!$("confirmDialog").open)return;
 if(!data.list.length||shortage().length){$("confirmDialog").close();$("status").textContent="库存或清单已改变，请重新确认";return}
 const lines=data.list.map(l=>{const it=item(l.id);return{id:it.id,name:it.name,quantity:l.quantity,before:it.owned,after:it.owned-l.quantity}});
 for(const l of lines)item(l.id).owned=l.after;
 data.result={lines,totalUnits:lines.reduce((n,l)=>n+l.quantity,0)};data.list=[];data.phase="delivered";pending=false;
 $("confirmDialog").close();render({scope:"none"});
 $("resultText").textContent=lines.map(l=>l.name+"：交付 "+l.quantity+"（"+l.before+" → "+l.after+"）").join("\n")+"\n\n本次共交付 "+data.result.totalUnits+" 件。\n本次已完成，不会重复扣减。";
 $("status").textContent="本次交付成功："+data.result.totalUnits+" 件（已结清）";
 $("resultDialog").showModal();$("resultClose").focus();
};
$("resultClose").onclick=()=>$("resultDialog").close();
$("resultDialog").addEventListener("close",()=>focusNode($("full")));
function apply(raw){
 if(raw.length>500000)throw Error("JSON 文本不能超过 500000 字符");
 const parsed=JSON.parse(raw);validate(parsed);data=structuredClone(parsed);page=0;
 render();$("error").textContent="";$("status").textContent="已校验并应用完整 JSON";
}
$("apply").onclick=()=>{try{apply($("editor").value)}catch(e){$("error").textContent=e.message}};
$("import").onchange=async e=>{
 const f=e.target.files[0];if(!f)return;
 try{if(f.size>2000000)throw Error("文件超过 2 MB");apply(await f.text())}catch(err){$("error").textContent=err.message}e.target.value="";
};
function example(kind){
 data=structuredClone(window.ACNH_DELIVERY_INITIAL);page=0;
 if(kind==="empty")data.list=[];
 if(kind==="low")data.list=[{id:"shovel",quantity:2}];
 render();$("error").textContent="";
 $("status").textContent=kind==="empty"?"空清单：无法提交":kind==="low"?"数量不足：需交付 2、持有 1，提交被禁用；可减少数量或移除":"已恢复普通演示状态";
}
$("reset").onclick=()=>example("reset");$("empty").onclick=()=>example("empty");$("low").onclick=()=>example("low");
function openFull(trigger){
 if(modalOpen())return;fullReturn=captureFocus();if(trigger)fullReturn={scope:"external",node:trigger};
 $("fullText").textContent=["标题："+data.title,"委托者："+data.requester,"委托原文：\n"+data.message,"候选物品：",...data.items.map(i=>i.name+" / 需 "+i.required+" / 持有 "+i.owned+"\n"+i.description),"当前清单：",...data.list.map(l=>item(l.id).name+" × "+l.quantity),"交付回执：",JSON.stringify(data.result,null,2),"完整 JSON：",JSON.stringify(data,null,2)].join("\n\n");
 $("fullDialog").showModal();$("fullClose").focus();
}
$("full").onclick=()=>openFull($("full"));diagnosticButton.onclick=()=>openFull(diagnosticButton);
$("fullClose").onclick=()=>$("fullDialog").close();
$("fullDialog").addEventListener("close",()=>{
 if(fullReturn?.scope==="external"&&!usable(fullReturn.node)){focusNode($("full"));return}
 restoreFocus(fullReturn);
});
$("export").onclick=()=>{
 const blob=new Blob([JSON.stringify(data,null,2)],{type:"application/json;charset=utf-8"}),url=URL.createObjectURL(blob),a=document.createElement("a");
 a.href=url;a.download="islander-delivery-data.json";a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
};
function resize(){
 const vv=window.visualViewport,w=Math.min(document.documentElement.clientWidth,vv?.width??Infinity),h=Math.min(document.documentElement.clientHeight,vv?.height??Infinity),scale=Math.floor(Math.min(1,w/1280,h/720)*1e6)/1e6,ok=w>=h&&1280*scale>=960&&720*scale>=540;
 $("viewport").style.width=(1280*scale)+"px";$("viewport").style.height=(720*scale)+"px";$("stage").style.transform="scale("+scale+")";
 const held=$("stage").contains(document.activeElement);supported=ok;$("stage").inert=!ok;$("sizeNotice").hidden=ok;
 if(!ok&&held&&!modalOpen())focusNode($("sizeNotice"));
 queueDiagnostics();
}
window.addEventListener("resize",resize);window.visualViewport?.addEventListener("resize",resize);
render({scope:"none"});resize();
})();
