/* Recipient-run browser tests. NOT executed by author. Requires assembled assets. */
const { chromium } = require('playwright');
const fs = require('fs'), path = require('path'), vm = require('vm'), assert = require('node:assert/strict');
(async () => {
 const base=path.resolve(process.argv[2]), out=path.resolve(process.argv[3]); fs.mkdirSync(out,{recursive:true});
 const context={window:{}};vm.runInNewContext(fs.readFileSync(path.join(base,'data.js'),'utf8'),context);
 const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||'/usr/bin/chromium',headless:true});
 const page=await browser.newPage({viewport:{width:1528,height:651},acceptDownloads:true});
 const errors=[];page.on('pageerror',e=>errors.push(String(e)));
 const results=[];
 for(const [caseIndex,count] of [2,3,4,2,3,4].entries()) {
  const data=JSON.parse(JSON.stringify(context.window.HADES_DRAFT));data.options=Array.from({length:count},(_,i)=>({...data.options[i%3],title:'Choice '+(i+1),description:caseIndex<3?'After taking damage, gain a chance to dodge the next hit.':'You move faster.\nGain bonus speed.',stat:'+30%'}));
  const payload={name:'count.json',mimeType:'application/json',buffer:Buffer.from(JSON.stringify(data))};
  for(const screen of ['prototype','scene']) {
   await page.goto('file://'+base+'/'+screen+'.html');
   await page.locator(screen==='scene'?'#scene-import':'#editor-import').setInputFiles(payload);
   await page.waitForFunction(n=>document.querySelectorAll('.row').length===n,count);
   const rows=page.locator('.row');await rows.first().focus();
   await page.keyboard.press('End');assert.equal(await rows.last().getAttribute('aria-selected'),'true');
   await page.keyboard.press('ArrowDown');assert.equal(await rows.first().getAttribute('aria-selected'),'true');
   await page.keyboard.press('ArrowUp');assert.equal(await rows.last().getAttribute('aria-selected'),'true');
   await page.keyboard.press('Home');assert.equal(await rows.first().getAttribute('aria-selected'),'true');
   await rows.last().click();assert.equal(await rows.last().getAttribute('aria-selected'),'true');
   const pending=page.waitForEvent('download');await page.locator(screen==='scene'?'#scene-export':'#editor-export').click();
   const download=await pending;const file=path.join(out,screen+'-'+count+'.json');await download.saveAs(file);assert.equal(JSON.parse(fs.readFileSync(file)).options.length,count);
   if(screen==='scene') for(const viewport of [{width:1528,height:651},{width:1280,height:720},{width:1920,height:1080}]) {
    await page.setViewportSize(viewport);await page.evaluate(()=>document.fonts.ready);
    await page.evaluate(async()=>{await Promise.all([...document.images].map(img=>img.decode()));});
    await page.waitForTimeout(100);
    const heading=await page.locator('#scene-title').evaluate(n=>({fits:n.scrollHeight<=n.clientHeight+1&&n.scrollWidth<=n.clientWidth+1,rect:n.getBoundingClientRect().toJSON()}));
    assert(heading.fits,'Default BOONS OF HERMES title must fit its real line box');
    const visualMetrics=await page.evaluate(()=>{const scene=document.querySelector('.scene').getBoundingClientRect(),panel=document.querySelector('.outer-panel').getBoundingClientRect();const range=document.createRange();range.selectNodeContents(document.getElementById('scene-title'));return {titleFraction:range.getBoundingClientRect().width/scene.width,frameBottom:(panel.bottom-scene.top)/scene.height};});
    assert(visualMetrics.titleFraction>=.39&&visualMetrics.titleFraction<=.45,'Tracked default title must occupy approximately42% scene width');
    if(count===3)assert(Math.abs(visualMetrics.frameBottom-.89)<.002,'Default three-row frame must end at89%');
    assert(await page.locator('#banner-warning').isHidden(),'Default header must not show clipping warning');
    const caps=await page.evaluate(()=>{const canvas=document.querySelector('.banner-canvas').getBoundingClientRect();return [...document.querySelectorAll('.banner-left,.banner-right')].map(n=>{const r=n.getBoundingClientRect();return Math.abs(r.width/450-canvas.height/713)<.001;});});
    assert(caps.every(Boolean),'Header endcap X/Y scales must match');
    const geometry=await page.evaluate(()=>{const scene=document.querySelector('.scene').getBoundingClientRect();const panel=document.querySelector('.outer-panel');const p=panel.getBoundingClientRect(),c=getComputedStyle(panel);const inner={top:p.top+parseFloat(c.borderTopWidth),bottom:p.bottom-parseFloat(c.borderBottomWidth),left:p.left+parseFloat(c.borderLeftWidth),right:p.right-parseFloat(c.borderRightWidth)};const label=document.querySelector('.choose-label').getBoundingClientRect();return [...document.querySelectorAll('.row')].map(n=>{const r=n.getBoundingClientRect();const art=n.querySelector('.base').getBoundingClientRect();const overlay=n.querySelector('.selection-art');const wasHidden=getComputedStyle(overlay).display==='none';if(wasHidden)overlay.style.display='block';const glow=overlay.getBoundingClientRect();if(wasHidden)overlay.style.display='';const painted=(rect,b,w,h)=>({left:rect.left+rect.width*b[0]/w,top:rect.top+rect.height*b[1]/h,right:rect.left+rect.width*b[2]/w,bottom:rect.top+rect.height*b[3]/h});const normalInk=painted(art,[10,151,1935,619],1942,809),glowInk=painted(glow,[10,151,1935,619],1945,809);const inks=[normalInk,glowInk];const symbol=n.querySelector('.symbol').getBoundingClientRect(),text=n.querySelector('.text').getBoundingClientRect();return {labelInside:label.top>=inner.top&&label.bottom<=inner.bottom&&label.left>=inner.left&&label.right<=inner.right,inkInside:inks.every(a=>a.top>=inner.top&&a.bottom<=inner.bottom&&a.left>=inner.left&&a.right<=inner.right),inkBelowLabel:inks.every(a=>a.top>=label.bottom),symbolWidthRatio:symbol.width/r.width,textStartRatio:(text.left-r.left)/r.width,descriptionFits:n.querySelector('.description').scrollHeight<=n.querySelector('.description').clientHeight+1,statInside:n.querySelector('.stat').getBoundingClientRect().bottom<=text.bottom+.5,contentFits:n.querySelector('.text').scrollHeight<=n.querySelector('.text').clientHeight+1,glowInsidePanel:glow.top>=inner.top&&glow.bottom<=inner.bottom&&glow.left>=inner.left&&glow.right<=inner.right,artInsidePanel:art.top>=inner.top&&art.bottom<=inner.bottom&&art.left>=inner.left&&art.right<=inner.right,artBelowLabel:art.top>=label.bottom,inside:r.top>=scene.top&&r.bottom<=scene.bottom&&r.left>=scene.left&&r.right<=scene.right,overflow:n.dataset.overflow==='true',height:r.height};});});
    assert(geometry.every(g=>g.inside),'All rows must fit scene');
    assert(geometry.every(g=>Math.abs(g.symbolWidthRatio-.172)<.002&&Math.abs(g.textStartRatio-.23)<.002),'R12 icon and text placement ratios');
    assert(geometry.every(g=>g.statInside&&g.contentFits&&g.descriptionFits),'All counts: normal two-line body and stat must fit actual content bounds');
    assert(geometry.every(g=>g.labelInside&&g.inkInside&&g.inkBelowLabel),'Label in panel interior; rendered viewport retaining all alpha>1 normal/selection artwork inside panel and below label');
    if(count===4){assert(geometry.every(g=>g.artInsidePanel&&g.glowInsidePanel),'Full row/selection PNG rectangles must fit panel border-inset interior');assert(geometry.every(g=>g.artBelowLabel),'All artwork must clear Choose one label');}
    results.push({screen,count,caseIndex,viewport,geometry,scope:'Geometry measured; visual fidelity requires screenshot review'});
    await page.screenshot({path:path.join(out,`scene-${count}-${caseIndex}-${viewport.width}.png`)});
   }
  }
 }
 await page.goto('file://'+base+'/prototype.html');
 await page.locator('#edit-rarity option[value=Epic]').evaluate(n=>{n.textContent='Epic 史诗般的';});
 await page.locator('#edit-rarity').selectOption('Epic');
 assert.equal(await page.locator('#edit-rarity').inputValue(),'Epic');
 assert((await page.locator('.row').first().getAttribute('class')).includes('epic'));
 await page.locator('#add-option').click();assert.equal(await page.locator('.row').count(),4);assert(await page.locator('#add-option').isDisabled());
 await page.locator('#remove-option').click();await page.locator('#remove-option').click();assert.equal(await page.locator('.row').count(),2);assert(await page.locator('#remove-option').isDisabled());
 for(const count of [1,5]) {
  const data=JSON.parse(JSON.stringify(context.window.HADES_DRAFT));data.options=Array.from({length:count},()=>data.options[0]);
  await page.locator('#editor-import').setInputFiles({name:'invalid.json',mimeType:'application/json',buffer:Buffer.from(JSON.stringify(data))});
  await page.waitForFunction(()=>document.getElementById('event-log').textContent.startsWith('Import rejected'));
  assert.equal(await page.locator('.row').count(),2);
 }
 assert.equal(errors.length,0);
 fs.writeFileSync(path.join(out,'option-count-results.json'),JSON.stringify({version:'hades-draft-v2.10',results,errors},null,2));await browser.close();
})().catch(e=>{console.error(e);process.exit(1)});
