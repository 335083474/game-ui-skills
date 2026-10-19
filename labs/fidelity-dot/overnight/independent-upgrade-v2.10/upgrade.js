'use strict';
(() => {
  const $ = id => document.getElementById(id);
  const node = (tag, cls, text) => {const e=document.createElement(tag);if(cls)e.className=cls;if(text!==undefined)e.textContent=text;return e;};
  // The package schema discards upgrade fields. Validate base fields with it,
  // then explicitly validate and copy the customer extension instead of changing it.
  function validate(input) {
    const base=HadesDataIO.validate({...input,options:input.options.map(o=>({...o,stat:''}))});
    if(base.options.length!==3)throw Error('This customer screen requires exactly three boons.');
    if(!Number.isSafeInteger(input.balance)||input.balance<0)throw Error('Balance must be a nonnegative integer.');
    return {...base,balance:input.balance,options:base.options.map((o,i)=>{
      const x=input.options[i];
      for(const key of ['current','increment','price'])if(!Number.isSafeInteger(x[key])||x[key]<0||(key==='increment'&&x[key]===0))throw Error(key+' must be a safe nonnegative integer; increment must be positive.');
      for(const key of ['metric','unit'])if(typeof x[key]!=='string')throw Error(key+' must be text.');
      return {...o,current:x.current,increment:x.increment,price:x.price,metric:x.metric,unit:x.unit};
    })};
  }
  let data, selected=0, pending=null, returnFocus=null;
  const dialog=$('confirm-dialog'), full=$('description-dialog');
  // Explicit wrapping keeps Tab within the dialog, including its single-button case.
  [dialog,full].forEach(modal=>modal.addEventListener('keydown',e=>{
    if(e.key!=='Tab')return;
    const controls=[...modal.querySelectorAll('button')].filter(b=>!b.disabled);
    const first=controls[0],last=controls[controls.length-1];
    if(e.shiftKey&&(document.activeElement===first||!modal.contains(document.activeElement))){e.preventDefault();last.focus();}
    else if(!e.shiftKey&&(document.activeElement===last||!modal.contains(document.activeElement))){e.preventDefault();first.focus();}
  }));
  const value=(o,n)=>'+'+n+o.unit;
  function say(s){$('status').textContent=s;}
  function rowFocus(){document.querySelectorAll('.row')[selected]?.focus();}
  function render(){
    $('scene-title').textContent=data.title;$('scene-subtitle').textContent=data.subtitle;
    $('scene-options').replaceChildren();
    data.options.forEach((o,i)=>{
      const b=node('button','row '+o.rarity.toLowerCase());b.type='button';b.setAttribute('role','option');b.setAttribute('aria-selected',String(i===selected));b.tabIndex=i===selected?0:-1;
      b.setAttribute('aria-label',`${o.title}, ${o.rarity}, current ${value(o,o.current)}, after ${value(o,o.current+o.increment)}, costs ${o.price} coins`);
      const base=node('img','base');base.src='components/neutral-row-v27.png';base.alt='';
      const wedge=node('span','rarity-wedge');wedge.setAttribute('aria-hidden','true');
      const symbol=node('span','symbol');const icon=node('img','boon-icon');icon.src=o.icon;icon.alt='';icon.onerror=()=>{b.dataset.assetError='true';say('Missing local icon: '+o.icon);};symbol.append(icon);
      const text=node('span','text'), title=node('span','title-line');title.append(node('span','title-name',o.title),node('span','rarity-label',o.rarity));
      text.append(title,node('p','description',o.description),node('span','stat',`${value(o,o.current)} → ${value(o,o.current+o.increment)} · ${o.price} coins`));
      const overlay=node('img','base selection-art');overlay.src='components/selection-overlay-v27.png';overlay.alt='';const warning=node('span','overflow-note');warning.hidden=true;
      b.append(base,wedge,symbol,text,overlay,warning);b.onclick=()=>select(i);
      b.onkeydown=e=>{if(['ArrowDown','ArrowUp','ArrowRight','ArrowLeft','Home','End'].includes(e.key)){e.preventDefault();select(HadesDataIO.nextIndex(selected,e.key,3));}else if(e.key==='Enter'){e.preventDefault();preview();}};
      $('scene-options').append(b);
    });
    const o=data.options[selected], enough=data.balance>=o.price;
    $('balance').textContent=data.balance+' coins';$('preview-name').textContent=o.title;$('metric').textContent=o.metric;
    $('before').textContent=value(o,o.current);$('after').textContent=value(o,o.current+o.increment);$('cost').textContent='Upgrade cost: '+o.price+' coins';
    $('remaining').textContent=enough?'Balance after: '+(data.balance-o.price)+' coins':'Need '+(o.price-data.balance)+' more coins';
    $('buy').disabled=!enough;$('buy').textContent=enough?'Preview upgrade':'Not enough coins';
    HadesOverflow.observe(document);requestAnimationFrame(()=>HadesPanelLayout.check());
  }
  function select(i){selected=i;render();rowFocus();say('Selected '+data.options[i].title+'.');}
  function preview(){
    const o=data.options[selected];if(data.balance<o.price){say('Not enough coins. Need '+(o.price-data.balance)+' more.');return;}
    pending={index:selected,current:o.current,price:o.price};returnFocus=document.activeElement;
    $('confirm-copy').textContent='Upgrade '+o.title+' for '+o.price+' coins?';
    $('confirm-values').textContent=`${o.metric}: ${value(o,o.current)} → ${value(o,o.current+o.increment)}. Balance: ${data.balance} → ${data.balance-o.price} coins.`;
    dialog.showModal();$('confirm-cancel').focus();
  }
  function closeConfirm(message){dialog.close();pending=null;(returnFocus?.isConnected?returnFocus:document.querySelectorAll('.row')[selected]).focus();if(message)say(message);}
  $('buy').onclick=preview;
  $('confirm-purchase').onclick=()=>{
    if(!pending)return;const p=pending,o=data.options[p.index];
    if(o.current!==p.current||o.price!==p.price||data.balance<o.price){closeConfirm('Upgrade unavailable. Preview again.');return;}
    if(!Number.isSafeInteger(o.current+o.increment)){closeConfirm('Upgrade value exceeds supported range.');return;}
    data.balance-=o.price;o.current+=o.increment;const message=`Upgraded ${o.title} to ${value(o,o.current)}. Spent ${o.price} coins; ${data.balance} remain.`;
    closeConfirm();render();rowFocus();say(message);
  };
  $('confirm-cancel').onclick=()=>closeConfirm('Upgrade cancelled. No coins spent.');
  dialog.addEventListener('cancel',e=>{e.preventDefault();closeConfirm('Upgrade cancelled. No coins spent.');});
  $('cancel').onclick=()=>{rowFocus();say('Upgrade cancelled. No coins spent.');};
  function description(){const o=data.options[selected];returnFocus=document.activeElement;$('description-title').textContent=o.title+' · '+o.rarity;$('description-copy').textContent=o.description;$('description-values').textContent=`${o.metric}: ${value(o,o.current)} → ${value(o,o.current+o.increment)}. Upgrade cost: ${o.price} coins.`;full.showModal();$('close-description').focus();}
  function closeFull(){full.close();(returnFocus?.isConnected?returnFocus:document.querySelectorAll('.row')[selected]).focus();}
  $('details').onclick=description;$('full-text').onclick=description;$('close-description').onclick=closeFull;full.addEventListener('cancel',e=>{e.preventDefault();closeFull();});
  document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!dialog.open&&!full.open){e.preventDefault();rowFocus();say('Upgrade cancelled. No coins spent.');}});
  $('reset').onclick=()=>{data=validate(window.UPGRADE_DATA);selected=0;pending=null;render();say('Demo reset. Balance restored to '+data.balance+' coins.');rowFocus();};
  try{data=validate(window.UPGRADE_DATA);render();}catch(e){$('scene-options').replaceChildren(node('p','data-error','Invalid upgrade-data.js: '+e.message));$('buy').disabled=true;say('Data validation failed. Correct upgrade-data.js and reload.');}
})();
