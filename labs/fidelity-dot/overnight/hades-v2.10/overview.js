'use strict';
(function(){
 const $=id=>document.getElementById(id),form=$('overview-form'),dialog=$('overview-dialog');
 let data=HadesDataIO.validate(window.HADES_OVERVIEW),selected=0,returnFocus=null;
 const el=(tag,cls,text)=>{const n=document.createElement(tag);if(cls)n.className=cls;if(text!==undefined)n.textContent=text;return n;};
 const announce=text=>{$('overview-status').textContent=text;};
 function measure(){const box=document.querySelector('.overview-details .safe-panel-body');$('overview-detail-warning').hidden=box.scrollHeight<=box.clientHeight+1;const title=$('overview-title'),subtitle=$('overview-subtitle');$('banner-warning').hidden=title.scrollHeight<=title.clientHeight+1&&title.scrollWidth<=title.clientWidth+1&&subtitle.scrollHeight<=subtitle.clientHeight+1&&subtitle.scrollWidth<=subtitle.clientWidth+1;}
 function render(){
  selected=Math.max(0,Math.min(selected,data.options.length-1));document.querySelector('.overview-scene').dataset.count=data.options.length;
  $('overview-title').textContent=data.title;$('overview-subtitle').textContent=data.subtitle;$('overview-list').replaceChildren();
  data.options.forEach((item,index)=>{
   const row=el('button','row '+item.rarity.toLowerCase());row.type='button';row.setAttribute('role','option');row.setAttribute('aria-selected',index===selected);row.tabIndex=index===selected?0:-1;
   const base=el('img','base');base.src='components/neutral-row-v27.png';base.alt='';
   const icon=el('img','boon-icon');icon.src=item.icon;icon.alt='';const symbol=el('span','symbol');symbol.append(icon);symbol.setAttribute('aria-hidden','true');
   const text=el('span','text'),line=el('span','title-line');line.append(el('span','title-name',item.title),el('span','rarity-label',item.rarity));text.append(line,el('span','stat',item.stat));
   const wedge=el('span','rarity-wedge'),overlay=el('img','base selection-art');overlay.src='components/selection-overlay-v27.png';overlay.alt='';row.append(base,wedge,symbol,text,overlay);
   row.onclick=()=>select(index);row.onkeydown=e=>{if(['ArrowDown','ArrowUp','ArrowRight','ArrowLeft','Home','End'].includes(e.key)){e.preventDefault();select(HadesDataIO.nextIndex(selected,e.key,data.options.length));}else if(e.key==='Enter'){e.preventDefault();$('overview-detail-title').focus();announce('Details: '+data.options[selected].title);}};
   $('overview-list').append(row);
  });
  const item=data.options[selected];$('overview-detail-title').textContent=item.title;$('overview-detail-title').tabIndex=-1;$('overview-rarity').textContent=item.rarity;document.querySelector('.overview-details').dataset.rarity=item.rarity;$('overview-detail-icon').src=item.icon;$('overview-description').textContent=item.description;$('overview-stat').textContent=item.stat;requestAnimationFrame(measure);
 }
 function select(index){selected=index;render();$('overview-list').children[selected].focus();announce('Selected '+data.options[selected].title);}
 function open(){returnFocus=document.activeElement;const item=data.options[selected];for(const key of ['title','rarity','icon','description','stat'])form.elements[key].value=item[key];form.elements.screenTitle.value=data.title;form.elements.subtitle.value=data.subtitle;dialog.hidden=false;$('overview-toolbar').inert=true;$('overview-stage').inert=true;$('overview-close').focus();}
 function close(){dialog.hidden=true;$('overview-toolbar').inert=false;$('overview-stage').inert=false;(returnFocus&&returnFocus.isConnected?returnFocus:$('overview-edit')).focus();}
 $('overview-edit').onclick=open;$('overview-close').onclick=close;
 form.onsubmit=e=>{e.preventDefault();try{const next=JSON.parse(JSON.stringify(data));next.title=form.elements.screenTitle.value;next.subtitle=form.elements.subtitle.value;for(const key of ['title','rarity','icon','description','stat'])next.options[selected][key]=form.elements[key].value;data=HadesDataIO.validate(next);render();announce('Updated selected boon: '+data.options[selected].title);$('overview-edit-status').textContent='Applied '+data.options[selected].title+' in this page. Export JSON to preserve.';}catch(error){$('overview-edit-status').textContent=error.message;}};
 document.addEventListener('keydown',e=>{if(e.key==='Escape'){if(!dialog.hidden)close();else $('overview-list').children[selected].focus();}if(e.key==='Tab'&&!dialog.hidden){const controls=[...dialog.querySelectorAll('button,input,select,textarea')].filter(n=>!n.disabled);const first=controls[0],last=controls.at(-1);if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus();}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}}});
 document.addEventListener('focusin',e=>{if(!dialog.hidden&&!dialog.contains(e.target))$('overview-close').focus();});
 $('overview-import').onchange=async e=>{try{data=await HadesDataIO.readFile(e.target.files[0]);selected=0;render();announce('Imported overview JSON into this page.');}catch(error){announce('Import rejected: '+error.message);}finally{e.target.value='';}};
 $('overview-export').onclick=()=>HadesDataIO.download(data,'hades-collected-boons.json');
 addEventListener('resize',measure);document.fonts.ready.then(measure);document.addEventListener('load',measure,true);render();
})();
