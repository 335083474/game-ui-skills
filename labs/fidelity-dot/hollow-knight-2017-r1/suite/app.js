"use strict";
(() => {
  const $=id=>document.getElementById(id);
  const VERSION="HK-editable-v0.2";
  const DEFAULT_ICON="assets/soul-catcher.png";
  const assetProblems=new Set();
  let layoutProblems=[];
  let buttons=[];
  let state={version:VERSION,title:"Charms",selected:3,
    slots:Array.from({length:40},(_,i)=>({id:"slot-"+(i+1),owned:i===3,
      name:i===3?"Soul Catcher":"Empty slot",icon:DEFAULT_ICON,cost:i===3?2:0,
      description:i===3?"Used by shamans to draw more SOUL from the world around them.\n\nIncreases the amount of SOUL gained when striking an enemy with the nail.":"No charm assigned to this slot."}))};
  function showDiagnostics(){
    $("assetWarning").textContent=[...assetProblems,...layoutProblems].join(" · ");
  }
  function assetProblem(message){assetProblems.add(message);showDiagnostics();}
  function validPath(p){return typeof p==="string"&&/^assets\/[A-Za-z0-9_./-]+\.(png|jpg|jpeg|webp|svg)$/i.test(p)&&!p.split("/").includes("..");}
  function validate(raw){
    if(!raw||typeof raw!=="object"||typeof raw.title!=="string"||raw.title.length>300)throw Error("Menu title must be text, at most 300 characters");
    if(!Array.isArray(raw.slots)||raw.slots.length<1||raw.slots.length>40)throw Error("Use 1–40 slots");
    if(!Number.isInteger(raw.selected)||raw.selected<0||raw.selected>=raw.slots.length)throw Error("Invalid selected index");
    const ids=new Set();
    const slots=raw.slots.map((s,i)=>{
      if(!s||typeof s.id!=="string"||ids.has(s.id))throw Error("Slot ids must be unique");ids.add(s.id);
      if(typeof s.owned!=="boolean"||typeof s.name!=="string"||s.name.length>300)throw Error("Invalid slot "+(i+1));
      if(!validPath(s.icon))throw Error("Icon must be a relative asset path without parent traversal");
      if(!Number.isInteger(s.cost)||s.cost<0||s.cost>9)throw Error("Cost must be an integer 0–9");
      if(typeof s.description!=="string"||s.description.length>20000)throw Error("Description limit is 20,000 characters");
      return {id:s.id,owned:s.owned,name:s.name,icon:s.icon,cost:s.cost,description:s.description};
    });
    return {version:VERSION,title:raw.title,selected:raw.selected,slots};
  }
  function makeImage(path,cls){
    const img=document.createElement("img");img.src=path;img.alt="";img.className=cls;
    img.addEventListener("error",()=>assetProblem("Missing image: "+path));return img;
  }
  function overflows(el){return el.scrollWidth>el.clientWidth+1||el.scrollHeight>el.clientHeight+1;}
  function checkText(){
    const menuOverflow=overflows($("menuTitle"));
    const itemOverflow=overflows($("charmTitle"));
    const bodyOverflow=overflows($("description"));
    layoutProblems=[];
    if(menuOverflow)layoutProblems.push("Menu title shortened on screen; Read full text contains the complete title");
    if(itemOverflow)layoutProblems.push("Item name shortened on screen; Read full text contains the complete name");
    if(bodyOverflow)layoutProblems.push("Description scrolls; complete text is also available in Read full text");
    $("fullText").hidden=!(menuOverflow||itemOverflow||bodyOverflow);
    showDiagnostics();
  }
  function resize(){
    const box=$("viewport"),stage=$("stage");
    const scale=Math.min(box.clientWidth/1920,box.clientHeight/1080);
    stage.style.transform="scale("+scale+")";
    stage.style.left=((box.clientWidth-1920*scale)/2)+"px";
    stage.style.top=((box.clientHeight-1080*scale)/2)+"px";
    const portrait=window.innerHeight>window.innerWidth;
    const tooSmall=scale<0.5;
    const unsupported=portrait||tooSmall;
    box.classList.toggle("unsupported",unsupported);
    stage.inert=unsupported;
    $("sizeNotice").hidden=!unsupported;
    $("sizeNotice").textContent=portrait?
      "Portrait layout is not supported. Use a desktop or landscape window. Minimum game area: 960×540; recommended browser window: 1280×720 or larger. 竖屏不支持，请使用桌面或横屏；这是缩小预览，不是可读性验收。":
      tooSmall?"Game area is below 960×540. Enlarge the window; 1280×720 or larger browser window is recommended. 当前游戏显示区域过小，交互暂停；可在下方编辑数据。":"";
    requestAnimationFrame(checkText);
  }
  function syncEditor(){
    const s=state.slots[state.selected];
    $("titleInput").value=state.title;$("slotNumber").value=(state.selected+1)+" / "+state.slots.length;
    $("ownedInput").checked=s.owned;$("nameInput").value=s.name;
    $("iconInput").value=s.icon;$("costInput").value=String(s.cost);$("descriptionInput").value=s.description;
  }
  function select(index,focus=false){
    state.selected=((index%state.slots.length)+state.slots.length)%state.slots.length;
    buttons.forEach((b,i)=>{const active=i===state.selected;b.setAttribute("aria-pressed",String(active));b.tabIndex=active?0:-1;});
    const s=state.slots[state.selected];
    $("charmTitle").textContent=s.name;$("charmTitle").title=s.name;
    $("preview").src=s.icon;$("preview").alt=s.name;$("preview").hidden=!s.owned;
    $("costDots").replaceChildren();
    for(let i=0;i<s.cost;i++){const dot=document.createElement("i");dot.setAttribute("aria-hidden","true");$("costDots").append(dot);}
    $("costDots").setAttribute("aria-label",s.cost+" notches");
    $("description").replaceChildren();
    s.description.split(/\n\s*\n/).forEach(text=>{const p=document.createElement("p");p.textContent=text;$("description").append(p);});
    $("description").scrollTop=0;syncEditor();requestAnimationFrame(checkText);
    if(focus&&!$("stage").inert)buttons[state.selected].focus({preventScroll:true});
  }
  function openDetails(){
    const s=state.slots[state.selected];
    $("dialogTitle").textContent=s.name;
    $("dialogBody").textContent="Menu: "+state.title+"\nItem: "+s.name+"\nCost: "+s.cost+"\n\n"+s.description;
    $("dialog").showModal();
  }
  function render(){
    assetProblems.clear();layoutProblems=[];showDiagnostics();
    $("menuTitle").textContent=state.title;$("menuTitle").title=state.title;
    $("grid").replaceChildren();buttons=[];
    state.slots.forEach((s,i)=>{
      const row=Math.floor(i/10),col=i%10;
      const b=document.createElement("button");b.type="button";b.className="slot";
      b.style.left=(215+col*93+(row%2?55:0))+"px";b.style.top=(588+row*90)+"px";
      b.setAttribute("aria-label",(i+1)+": "+s.name);
      b.append(makeImage("assets/socket.svg","socket"));if(s.owned)b.append(makeImage(s.icon,"charm"));
      b.append(makeImage("assets/selection.svg","selection"));
      b.addEventListener("click",()=>select(i,true));
      b.addEventListener("keydown",e=>{
        let next=null;
        if(e.key==="ArrowRight")next=state.selected+1;if(e.key==="ArrowLeft")next=state.selected-1;
        if(e.key==="ArrowDown")next=state.selected+10;if(e.key==="ArrowUp")next=state.selected-10;
        if(e.key==="Home")next=0;if(e.key==="End")next=state.slots.length-1;
        if(next!==null){e.preventDefault();select(next,true);}
        if(e.key==="Enter"||e.key===" "){e.preventDefault();openDetails();}
      });
      buttons.push(b);$("grid").append(b);
    });select(state.selected);resize();
    document.querySelectorAll("#stage img").forEach(img=>{
      if(img.complete&&img.naturalWidth===0)assetProblem("An image failed to load: "+img.getAttribute("src"));
    });
  }
  $("fullText").addEventListener("click",openDetails);
  $("dialog").addEventListener("close",()=>{if(!$("stage").inert)buttons[state.selected]?.focus({preventScroll:true});});
  $("preview").addEventListener("error",()=>assetProblem("Selected icon failed to load"));
  document.querySelectorAll("#stage > img,.notches img").forEach(img=>img.addEventListener("error",()=>assetProblem("Frame/background/marker failed: "+img.getAttribute("src"))));
  $("editor").addEventListener("submit",e=>{
    e.preventDefault();try{
      const candidate=JSON.parse(JSON.stringify(state));candidate.title=$("titleInput").value;
      Object.assign(candidate.slots[candidate.selected],{owned:$("ownedInput").checked,name:$("nameInput").value,icon:$("iconInput").value,cost:Number($("costInput").value),description:$("descriptionInput").value});
      state=validate(candidate);render();$("status").textContent="Applied to slot "+(state.selected+1)+". Long titles are retained in full-text view and exported JSON.";
    }catch(err){$("status").textContent="Not applied: "+err.message;}
  });
  $("export").addEventListener("click",()=>{
    const blob=new Blob([JSON.stringify(state,null,2)],{type:"application/json;charset=utf-8"});
    const url=URL.createObjectURL(blob),a=document.createElement("a");a.href=url;a.download="hk-editable-v0.2-data.json";a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
  });
  $("import").addEventListener("change",async e=>{
    const file=e.target.files[0];if(!file)return;
    try{if(file.size>2000000)throw Error("JSON exceeds 2 MB");state=validate(JSON.parse(await file.text()));render();$("status").textContent="Imported "+state.slots.length+" slots";}
    catch(err){$("status").textContent="Import rejected; current data retained: "+err.message;}
    e.target.value="";
  });
  new ResizeObserver(resize).observe($("viewport"));window.addEventListener("resize",resize);
  render();if(document.fonts?.ready)document.fonts.ready.then(checkText);
})();