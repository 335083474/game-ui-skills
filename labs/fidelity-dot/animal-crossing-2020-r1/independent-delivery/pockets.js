(()=>{'use strict';
// Build: ACNH-pockets-v0.3. Retain the v0.1 JSON contract and existing fixtures.
const VERSION='ACNH-pockets-v0.1';
const ICONS=Object.freeze({scorpion:'assets/scorpion.png',shovel:'assets/shovel.svg',axe:'assets/axe.svg',slingshot:'assets/slingshot.svg',wateringCan:'assets/watering-can.svg',fishingRod:'assets/fishing-rod.svg',ladder:'assets/ladder.svg',net:'assets/net.svg'});
const X=[345,411,477,543,609,675,741,807,873,939];
const Y=[[160,132,116,111,110,111,112,124,139,157],[215,193,179,174,173,175,176,185,202,214],[277,256,244,237,233,235,238,246,263,276],[338,320,307,301,297,300,305,312,327,341]];
const pos=n=>({x:X[n%10],y:Y[Math.floor(n/10)][n%10]});
const $=id=>document.getElementById(id);
let state=null,opened=true,supported=true,returnFocus=null,message='',diagnostic='',raf=0,receipt=null;
const errors=new Set();
function exact(v,keys,label){if(!v||typeof v!=='object'||Array.isArray(v)||Object.keys(v).length!==keys.length||keys.some(k=>!Object.hasOwn(v,k)))throw Error(label+': unexpected or missing fields');}
function text(v,max,label){if(typeof v!=='string'||v.length>max)throw Error(label+': expected string of at most '+max+' UTF-16 units');return v;}
function valid(raw){
 exact(raw,['schemaVersion','version','selectedId','items'],'Document');
 if(raw.schemaVersion!==1||raw.version!==VERSION)throw Error('Unsupported schema/version');
 if(!Array.isArray(raw.items)||raw.items.length>40)throw Error('items must contain 0–40 entries');
 const ids=new Set(),slots=new Set();
 const items=raw.items.map((a,i)=>{
  exact(a,['id','slot','name','icon','quantity','dimmed','description'],'Item '+i);
  if(typeof a.id!=='string'||!/^[A-Za-z0-9][A-Za-z0-9_-]{0,39}$/.test(a.id)||ids.has(a.id))throw Error('Invalid/duplicate item ID');ids.add(a.id);
  if(!Number.isInteger(a.slot)||a.slot<0||a.slot>39||slots.has(a.slot))throw Error('Slot must be unique integer 0–39');slots.add(a.slot);
  if(typeof a.icon!=='string'||!Object.hasOwn(ICONS,a.icon))throw Error('Unknown icon key; arbitrary paths/URLs are not accepted');
  if(!Number.isInteger(a.quantity)||a.quantity<0||a.quantity>9999)throw Error('quantity must be integer 0–9999');
  if(typeof a.dimmed!=='boolean')throw Error('dimmed must be boolean');
  return {id:a.id,slot:a.slot,name:text(a.name,300,'name'),icon:a.icon,quantity:a.quantity,dimmed:a.dimmed,description:text(a.description,20000,'description')};
 }).sort((a,b)=>a.slot-b.slot);
 if(raw.selectedId!==null&&(typeof raw.selectedId!=='string'||!/^[A-Za-z0-9][A-Za-z0-9_-]{0,39}$/.test(raw.selectedId)))throw Error('Invalid selectedId');
 const wanted=items.find(x=>x.id===raw.selectedId&&!x.dimmed),fallback=items.find(x=>!x.dimmed);
 return {schemaVersion:1,version:VERSION,selectedId:wanted?.id??fallback?.id??null,items};
}
const current=()=>state?.items.find(x=>x.id===state.selectedId)||null;
const enabled=()=>state.items.filter(x=>!x.dimmed);
const button=id=>[...$('slots').querySelectorAll('button')].find(b=>b.dataset.id===id);
function publish(){ $('status').textContent=[message,diagnostic,...errors].filter(Boolean).join('\n'); }
function say(v){message=v;publish();}
function visible(el){return !!(el&&el.isConnected&&!el.disabled&&!el.closest('[hidden],[inert]')&&el.getClientRects().length);}
function focusBack(el){
 const target=[el,opened&&supported?button(state?.selectedId):null,opened&&supported?$('cancel'):null,$('openPockets'),$('apply')].find(visible);
 target?.focus({preventScroll:true});
}
function setImage(img,path,alt=''){
 img.onload=()=>{errors.delete('Missing image: '+path);publish();};
 img.onerror=()=>{errors.add('Missing image: '+path);publish();};
 img.alt=alt;img.src=path;
}
function diagnostics(){
 cancelAnimationFrame(raf);raf=requestAnimationFrame(()=>{
  const label=$('itemLabel');
  diagnostic=opened&&supported&&!label.hidden&&(label.scrollWidth>label.clientWidth+1||label.scrollHeight>label.clientHeight+1)?'Item label is shortened on the stage. Read full item text retains the complete name and description.':'';
  publish();
 });
}
function resize(){
 // clientWidth/clientHeight exclude classic scrollbars; innerWidth does not.
 const root=document.documentElement,vv=window.visualViewport;
 const availableWidth=Math.max(0,Math.min(root.clientWidth,vv?vv.width:root.clientWidth));
 const availableHeight=Math.max(0,Math.min(root.clientHeight,vv?vv.height:root.clientHeight));
 // Round downward to prevent fractional-pixel overflow at the right edge.
 const scale=Math.floor(Math.max(0,Math.min(1,availableWidth/1280,availableHeight/720))*1000000)/1000000;
 const stageWidth=1280*scale,stageHeight=720*scale;
 supported=availableWidth>=availableHeight&&stageWidth>=960&&stageHeight>=540;
 $('viewport').style.width=stageWidth+'px';$('viewport').style.height=stageHeight+'px';
 $('stage').style.transform='scale('+scale+')';
 const held=$('stage').contains(document.activeElement);
 $('stage').inert=!supported;$('sizeNotice').hidden=supported;
 if(!supported&&held&&!$('detail').open)$('sizeNotice').focus();
 diagnostics();
}
let resizeFrame=0;
function scheduleResize(){
 cancelAnimationFrame(resizeFrame);
 resizeFrame=requestAnimationFrame(resize);
}
function render(){
 $('pockets').hidden=!opened;$('openPockets').hidden=opened;
 $('slots').replaceChildren();
 state.items.forEach(it=>{
  const p=pos(it.slot),b=document.createElement('button');b.type='button';b.className='slot'+(it.icon==='scorpion'?'':' tool')+(it.dimmed?' dimmed':'');
  b.style.left=p.x+'px';b.style.top=p.y+'px';b.dataset.id=it.id;b.disabled=it.dimmed;
  b.setAttribute('aria-label',it.name+'; quantity '+it.quantity+(it.dimmed?'; unavailable':''));b.setAttribute('aria-pressed',String(it.id===state.selectedId));
  const disc=document.createElement('span');disc.className='disc';disc.setAttribute('aria-hidden','true');
  const img=document.createElement('img');img.className='item';setImage(img,ICONS[it.icon]);const art=document.createElement('span');art.className='iconViewport';art.dataset.icon=it.icon;art.append(img);b.append(disc,art);
  if(it.dimmed&&it.icon!=='ladder'){const star=document.createElement('span');star.className='star';star.setAttribute('aria-hidden','true');b.append(star);}
  if(it.dimmed&&it.icon==='net'){const check=document.createElement('span');check.className='check';check.textContent='✓';check.setAttribute('aria-hidden','true');b.append(check);}
  if(it.quantity!==1){const q=document.createElement('span');q.className='qty';q.textContent=String(it.quantity);q.setAttribute('aria-hidden','true');b.append(q);}
  b.addEventListener('click',()=>{if(!opened||!supported||it.dimmed)return;state.selectedId=it.id;render();focusBack(button(it.id));});$('slots').append(b);
 });
 const it=current();$('confirm').disabled=!it;$('select').disabled=!it;$('full').disabled=!it;
 $('itemLabel').hidden=!it;$('hand').hidden=!it;
 if(it){const p=pos(it.slot);$('itemLabel').textContent=it.name;$('itemLabel').style.left=Math.max(225,Math.min(865,p.x-90))+'px';$('itemLabel').style.top=Math.max(38,p.y-107)+'px';$('hand').style.left=p.x+23+'px';$('hand').style.top=p.y+25+'px';}
 diagnostics();
}
function details(trigger){
 const it=current();if(!it||$('detail').open)return;
 returnFocus=trigger||document.activeElement;$('detailViewport').dataset.icon=it.icon;setImage($('detailIcon'),ICONS[it.icon],it.name);
 $('detailText').textContent='Name\n'+it.name+'\n\nQuantity\n'+it.quantity+'\n\nDescription\n'+it.description;
 $('detail').showModal();$('closeDetail').focus();
}
function closePockets(){if(!opened)return;opened=false;render();$('openPockets').focus();say('Pockets closed. Open pockets restores the current selection.');}
function openPockets(){opened=true;render();focusBack(button(state.selectedId));say('Pockets opened.');}
function confirm(){const it=current();if(!opened||!supported||!it)return;receipt={...it};say('Confirmed locally: '+receipt.name+' (quantity '+receipt.quantity+'). No item was transferred or removed.');}
function load(){if(!state)return;$('editor').value=JSON.stringify(state,null,2);say('Current data loaded into editor.');}
function apply(){
 try{if($('editor').value.length>1000000)throw Error('JSON input exceeds 1000000 characters');const fresh=valid(JSON.parse($('editor').value));const corrected=fresh.selectedId!==JSON.parse($('editor').value).selectedId;state=fresh;receipt=null;render();focusBack(button(state.selectedId));say('Applied '+state.items.length+' items.'+(corrected?' Selection adjusted to an available item or null.':''));}
 catch(err){say('Import rejected; previous data retained. '+err.message);}
}
function exportData(){
 if(!state)return;const url=URL.createObjectURL(new Blob([JSON.stringify(state,null,2)+'\n'],{type:'application/json;charset=utf-8'}));
 const a=document.createElement('a');a.href=url;a.download='acnh-pockets-v01.json';document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1500);say('JSON download requested. Browser save must be verified separately.');
}
function move(key){
 const list=enabled();if(!list.length)return;
 let target=null;if(key==='Home')target=list[0];else if(key==='End')target=list[list.length-1];
 else{const it=current()||list[0],p=pos(it.slot),horizontal=key==='ArrowLeft'||key==='ArrowRight',sign=key==='ArrowLeft'||key==='ArrowUp'?-1:1;
  const candidates=list.filter(x=>x.id!==it.id).map(x=>{const q=pos(x.slot),forward=(horizontal?q.x-p.x:q.y-p.y)*sign,cross=Math.abs(horizontal?q.y-p.y:q.x-p.x);return {it:x,forward,score:forward+cross*3};}).filter(x=>x.forward>1).sort((a,b)=>a.score-b.score);
  target=candidates[0]?.it;
 }
 if(target){state.selectedId=target.id;render();focusBack(button(target.id));}
}
$('cancel').addEventListener('click',closePockets);$('openPockets').addEventListener('click',openPockets);$('confirm').addEventListener('click',confirm);
$('select').addEventListener('click',()=>details($('select')));$('full').addEventListener('click',()=>details($('full')));
$('load').addEventListener('click',load);$('apply').addEventListener('click',apply);$('export').addEventListener('click',exportData);
$('closeDetail').addEventListener('click',()=>$('detail').close());$('detail').addEventListener('cancel',e=>{e.preventDefault();$('detail').close();});$('detail').addEventListener('close',()=>{focusBack(returnFocus);returnFocus=null;});
$('stage').addEventListener('keydown',e=>{
 if(!state||!opened||!supported||$('detail').open||e.ctrlKey||e.metaKey||e.altKey)return;
 const slot=e.target.closest('.slot');
 if(slot&&['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','Home','End'].includes(e.key)){e.preventDefault();move(e.key);return;}
 if(slot&&(e.key==='Enter'||e.key===' ')){e.preventDefault();if(!e.repeat)details(slot);return;}
 if(e.key==='Escape'||e.key.toLowerCase()==='b'){e.preventDefault();if(!e.repeat)closePockets();}
 else if(e.key.toLowerCase()==='a'){e.preventDefault();if(!e.repeat)details(document.activeElement);}
 else if(e.key==='+'){e.preventDefault();if(!e.repeat)confirm();}
});
window.addEventListener('resize',scheduleResize);
window.visualViewport?.addEventListener('resize',scheduleResize);
// Refit when document dimensions change, e.g. editor resizing or scrollbar layout.
if(typeof ResizeObserver!=='undefined'){
 const layoutObserver=new ResizeObserver(scheduleResize);
 layoutObserver.observe(document.documentElement);
}
for(const id of ['background','panel','hand']){const img=$(id),path=img.getAttribute('src');setImage(img,path);}
try{state=valid(window.ACNH_POCKETS_DATA);render();load();resize();say('Ready. Default state: last Scorpion selected. All artwork is replacement research material.');}
catch(err){$('pockets').hidden=true;$('confirm').disabled=true;$('select').disabled=true;$('full').disabled=true;$('apply').disabled=true;$('export').disabled=true;say('Startup data invalid: '+err.message);resize();}
})();