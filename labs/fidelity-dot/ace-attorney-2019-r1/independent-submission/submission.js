(()=>{'use strict';
const BUILD='AA2019-submission-repair-r1';
// Keep the original data contract so existing failure fixtures remain importable.
const VERSION='AA2019-submission-v0.1';
const ICONS=Object.freeze({badge:'assets/badge.png',statue:'assets/statue.svg',shards:'assets/shards.svg',note:'assets/note.svg',phone:'assets/phone.svg',envelope:'assets/envelope.svg'});
const $=id=>document.getElementById(id);
const allowed=(obj,keys,label)=>{if(!obj||typeof obj!=='object'||Array.isArray(obj)||Object.keys(obj).length!==keys.length||keys.some(k=>!Object.hasOwn(obj,k)))throw Error(label+'：字段不符合契约');};
const checkText=(val,max,label)=>{if(typeof val!=='string'||val.length>max)throw Error(label+'：必须为不超过 '+max+' 个 UTF-16 单位的字符串');return val;};
function validate(input){
 allowed(input,['schemaVersion','version','selectedId','items'],'文档');
 if(input.schemaVersion!==1||input.version!==VERSION)throw Error('schemaVersion 或 version 不匹配');
 if(!Array.isArray(input.items)||input.items.length<1||input.items.length>6)throw Error('items 必须包含 1–6 个证物');
 const seen=new Set(),items=input.items.map((it,i)=>{
  allowed(it,['id','name','icon','description'],'items['+i+']');
  if(typeof it.id!=='string'||!/^[A-Za-z0-9][A-Za-z0-9_-]{0,39}$/.test(it.id)||seen.has(it.id))throw Error('无效或重复的 id：'+String(it.id));
  seen.add(it.id);
  if(typeof it.icon!=='string'||!Object.hasOwn(ICONS,it.icon))throw Error('不允许的 icon 键：'+String(it.icon));
  return {id:it.id,name:checkText(it.name,300,'name'),icon:it.icon,description:checkText(it.description,20000,'description')};
 });
 if(input.selectedId!==null&&(typeof input.selectedId!=='string'||!seen.has(input.selectedId)))throw Error('selectedId 必须为 null 或候选中的 id');
 return {schemaVersion:1,version:VERSION,selectedId:input.selectedId??items[0].id,items};
}
let state=null,screen='select',committed=null,returnTarget=null,detailReturn=null;
let supported=true,focusRedirecting=false,notice='',diagnosticFrame=0;
const failedAssets=new Set();
const selected=()=>state.items.find(it=>it.id===state.selectedId)||state.items[0];
const modalActive=()=>screen!=='select';
const activeItem=()=>screen==='result'?committed:selected();
function publish(){
 $('status').textContent=[notice,...failedAssets].filter(Boolean).join('\n');
}
function announce(msg){notice=msg;publish();}
function visible(el){return !!(el&&el.isConnected&&!el.disabled&&!el.closest('[hidden],[inert]')&&el.getClientRects().length);}
function selectedButton(){return [...$('slots').querySelectorAll('button')].find(b=>b.dataset.id===state?.selectedId);}
function captureTarget(el){
 if(el?.classList.contains('slot'))return {slot:el.dataset.id};
 return {id:el?.id||'submitBtn'};
}
function resolveTarget(target){
 return target?.slot?[...$('slots').querySelectorAll('button')].find(b=>b.dataset.id===target.slot):$(target?.id||'submitBtn');
}
function currentStepButton(){return $('stepActions').querySelector('button[data-initial="true"]')||$('stepActions').querySelector('button');}
function safeFocus(preferred){
 if(!supported&&!$('detailDialog').open){$('sizeNotice').focus();return;}
 const candidates=modalActive()?[preferred,currentStepButton(),$('stepPanel')]:[preferred,selectedButton(),$('submitBtn'),$('importBtn')];
 const target=candidates.find(el=>visible(el)&&(!modalActive()||$('stepPanel').contains(el)));
 if(target)target.focus({preventScroll:true});
}
function syncIsolation(){
 const modal=modalActive();
 $('selectionLayer').inert=modal;
 $('selectionLayer').style.visibility=modal?'hidden':'';
 if(modal)$('selectionLayer').setAttribute('aria-hidden','true');else $('selectionLayer').removeAttribute('aria-hidden');
 $('workspace').inert=modal;
 $('pageHeader').inert=modal;
 $('stage').inert=!supported;
 $('stepPanel').hidden=!modal;
}
function resize(){
 const w=window.innerWidth,h=Math.max(0,window.innerHeight-$('pageHeader').getBoundingClientRect().height);
 const scale=Math.max(0,Math.min(1,w/1280,h/720)),was=supported;
 supported=w>=window.innerHeight&&scale>=.75;
 $('viewport').style.width=1280*scale+'px';$('viewport').style.height=720*scale+'px';
 $('stage').style.transform=`scale(${scale})`;
 $('sizeNotice').hidden=supported;$('sizeNotice').tabIndex=-1;
 const stageHadFocus=$('stage').contains(document.activeElement);
 syncIsolation();
 if(!$('detailDialog').open){
  if(!supported&&stageHadFocus)$('sizeNotice').focus();
  else if(supported&&!was&&modalActive())safeFocus(currentStepButton());
 }
 queueDiagnostics();
}
function asset(img,path,alt){
 img.onload=()=>{failedAssets.delete('缺图：'+path);publish();};
 img.onerror=()=>{failedAssets.add('缺图：'+path+'；请核对本地相对路径。');publish();};
 img.src=path;img.alt=alt;
}
function queueDiagnostics(){
 cancelAnimationFrame(diagnosticFrame);
 diagnosticFrame=requestAnimationFrame(()=>{
  if(!state)return;
  const name=modalActive()?$('stepName'):$('itemName');
  const desc=modalActive()?$('stepDesc'):$('description');
  const overflow=name.scrollWidth>name.clientWidth+1||name.scrollHeight>name.clientHeight+1||desc.scrollHeight>desc.clientHeight+1||desc.scrollWidth>desc.clientWidth+1;
  const msg=overflow?'显示区有省略或滚动内容；“查看完整文字”保留完整名称和说明。':'';
  $('detailsBtn').title=msg;$('stepPanel').dataset.hasOverflow=String(overflow);
  // Full-text controls are always available, including inside confirmation/result.
  $('stepActions').querySelector('[data-full-text]')?.setAttribute('title',msg||'查看完整名称和说明');
 });
}
function render(){
 if(!state)return;
 const it=selected();$('itemName').textContent=it.name;$('description').textContent=it.description;
 asset($('preview'),ICONS[it.icon],it.name);
 $('slots').replaceChildren();
 state.items.forEach((item,i)=>{
  const b=document.createElement('button');b.type='button';b.className='slot';b.dataset.id=item.id;
  b.setAttribute('aria-label',`${i+1}/${state.items.length}：${item.name}`);b.setAttribute('aria-pressed',String(item.id===state.selectedId));b.title=item.name;
  const img=document.createElement('img'),corners=document.createElement('img');
  asset(img,ICONS[item.icon],'');asset(corners,'assets/corners.svg','');corners.className='corners';
  b.append(img,corners);
  b.addEventListener('click',()=>{if(screen!=='select'||!supported)return;state.selectedId=item.id;render();safeFocus(selectedButton());});
  b.addEventListener('dblclick',()=>{if(screen!=='select'||!supported)return;state.selectedId=item.id;render();showConfirm({slot:item.id});});
  $('slots').append(b);
 });
 if(modalActive())renderStep();
 syncIsolation();queueDiagnostics();
}
function action(label,id,cb,primary=false){
 const b=document.createElement('button');b.type='button';b.id=id;b.textContent=label;
 if(primary)b.className='primary';b.addEventListener('click',cb);$('stepActions').append(b);return b;
}
function renderStep(){
 const it=activeItem();
 $('stepTag').textContent=screen==='confirm'?'CONFIRM / 提交前确认':'RESULT / 提交结果';
 $('stepTitle').textContent=screen==='confirm'?'要提交这件证物吗？':'证物已提交';
 $('stepName').textContent=it.name;$('stepDesc').textContent=it.description;
 $('stepDesc').scrollTop=0;asset($('stepIcon'),ICONS[it.icon],it.name);$('stepActions').replaceChildren();
 const full=action('查看完整文字','stepFullText',()=>detail(document.activeElement));full.dataset.fullText='true';
 if(screen==='confirm'){
  const cancel=action('取消 Esc','cancelSubmission',backToSelect);cancel.dataset.initial='true';
  action('确认提交','acceptSubmission',accept,true);
 }else{
  const back=action('返回重新选择','returnSelection',backToSelect,true);back.dataset.initial='true';
 }
}
function showConfirm(target){
 if(!state||screen!=='select'||!supported)return;
 returnTarget=target||captureTarget(document.activeElement);screen='confirm';render();safeFocus(currentStepButton());
}
function accept(){
 if(screen!=='confirm'||!supported)return;
 committed={...selected()};screen='result';render();safeFocus(currentStepButton());
 announce('已提交：'+committed.name+'（仅本地界面演示，没有发送至服务器）');
}
function backToSelect(){
 if(screen==='select')return;
 const target=returnTarget;screen='select';committed=null;render();safeFocus(resolveTarget(target));returnTarget=null;
}
function detail(trigger){
 if(!state||$('detailDialog').open)return;
 const it=activeItem();detailReturn=trigger||document.activeElement;
 $('detailTitle').textContent='证物完整文字';
 $('detailText').textContent='名称\n'+it.name+'\n\n说明\n'+it.description;
 $('detailDialog').showModal();$('closeDetail').focus();
}
function editLoad(){if(!state||modalActive())return;$('jsonEditor').value=JSON.stringify(state,null,2);announce('已载入当前数据；未写入磁盘。');}
function apply(){
 if(modalActive())return;
 try{
  if($('jsonEditor').value.length>1000000)throw Error('JSON 长度超限');
  const fresh=validate(JSON.parse($('jsonEditor').value));
  state=fresh;screen='select';committed=null;returnTarget=null;render();safeFocus(selectedButton());
  announce('校验通过：已应用 '+state.items.length+' 个证物。刷新仍使用 submission-data.js。');
 }catch(err){announce('导入失败（原数据未更改）：'+err.message);}
}
function exportJSON(){
 if(!state||modalActive())return;
 const url=URL.createObjectURL(new Blob([JSON.stringify(state,null,2)+'\n'],{type:'application/json;charset=utf-8'}));
 const a=document.createElement('a');a.href=url;a.download='submission-candidates.json';document.body.append(a);a.click();a.remove();
 setTimeout(()=>URL.revokeObjectURL(url),1500);announce('已触发当前JSON下载；数据契约 '+VERSION+'，界面 '+BUILD+'。');
}
$('submitBtn').addEventListener('click',()=>showConfirm({id:'submitBtn'}));
$('loadBtn').addEventListener('click',editLoad);$('importBtn').addEventListener('click',apply);$('exportBtn').addEventListener('click',exportJSON);
$('detailsBtn').addEventListener('click',()=>detail($('detailsBtn')));
$('closeDetail').addEventListener('click',()=>$('detailDialog').close());
$('detailDialog').addEventListener('cancel',e=>{e.preventDefault();$('detailDialog').close();});
$('detailDialog').addEventListener('close',()=>{safeFocus(detailReturn);detailReturn=null;});
function stepFocusable(){return [...$('stepPanel').querySelectorAll('button,[tabindex="0"]')].filter(visible);}
// Modal focus containment supplements inert; no global Enter-to-accept mapping.
document.addEventListener('focusin',e=>{
 if(focusRedirecting||!supported||!modalActive()||$('detailDialog').open||$('stepPanel').contains(e.target))return;
 focusRedirecting=true;safeFocus(currentStepButton());focusRedirecting=false;
});
document.addEventListener('keydown',e=>{
 if(!state||$('detailDialog').open)return;
 if(!supported)return;
 if(modalActive()){
  if(e.key==='Escape'){e.preventDefault();backToSelect();return;}
  if(e.key==='Tab'){
   const list=stepFocusable(),i=list.indexOf(document.activeElement);
   if(!list.length){e.preventDefault();$('stepPanel').focus();return;}
   if(i<0||(!e.shiftKey&&i===list.length-1)||(e.shiftKey&&i===0)){
    e.preventDefault();list[e.shiftKey?list.length-1:0].focus();
   }
   return;
  }
  // Avoid a held activation key firing again after a state transition.
  if(e.repeat&&(e.key==='Enter'||e.key===' ')&&e.target.closest('button'))e.preventDefault();
  // Otherwise Enter/Space are the focused native button's normal click semantics.
  return;
 }
 if(e.ctrlKey||e.metaKey||e.altKey||e.target.closest('textarea,input,select,[contenteditable]'))return;
 if(!$('selectionLayer').contains(e.target))return;
 const slot=e.target.closest('.slot');
 if(slot){
  const index=state.items.findIndex(x=>x.id===state.selectedId);let next=null;
  if(e.key==='ArrowRight')next=Math.min(index+1,state.items.length-1);
  else if(e.key==='ArrowLeft')next=Math.max(index-1,0);
  else if(e.key==='Home')next=0;else if(e.key==='End')next=state.items.length-1;
  if(next!==null){e.preventDefault();state.selectedId=state.items[next].id;render();safeFocus(selectedButton());return;}
  if(e.key==='Enter'||e.key===' '){e.preventDefault();if(!e.repeat)detail(slot);return;}
 }
 if(e.key.toLowerCase()==='s'&&(slot||e.target===$('description'))){e.preventDefault();if(!e.repeat)showConfirm(captureTarget(e.target));}
});
window.addEventListener('resize',resize);
for(const id of ['room','panel']){
 const img=$(id),path=img.getAttribute('src');
 img.addEventListener('error',()=>{failedAssets.add('缺图：'+path+'；请核对本地相对路径。');publish();});
 if(img.complete&&!img.naturalWidth){failedAssets.add('缺图：'+path+'；请核对本地相对路径。');}
}
try{
 state=validate(window.AA_SUBMISSION_DATA);render();editLoad();resize();
 announce('准备完成。确认与结果中的Enter/Space仅激活当前聚焦按钮。');
}catch(err){
 $('submitBtn').disabled=true;announce('启动失败：'+err.message);resize();
}
})();