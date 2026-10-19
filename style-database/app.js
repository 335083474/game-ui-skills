const $=id=>document.getElementById(id);
const esc=(value='')=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const statusNames={complete:'完整实验包',study:'仅有视觉样品',researched:'已有研究',candidate:'新候选 · 未制作'};
const axes={style:'美术风格',dimension:'表现维度',perspective:'视角',presentation:'呈现形式',descriptor:'评价与观感'};
let data,view='styles',returnFocus;
const familyOf=id=>data.families.find(f=>f.id===id);
const tagOf=id=>data.steamTags.find(t=>t.id===id);
function matchingFamilies(){
 const q=$('query').value.trim().toLowerCase(),parent=$('parent').value,tag=$('tag').value;
 return data.families.filter(f=>(parent==='all'||f.parent===parent)&&(tag==='all'||f.tagIds.includes(tag))&&(!q||[f.label,f.description,f.uiOpportunity,...f.gameIds.map(id=>{const g=data.games.find(g=>g.id===id);return `${g.title} ${g.englishTitle}`;}),...f.tagIds.map(id=>tagOf(id).name)].join(' ').toLowerCase().includes(q)));
}
function badge(status){return `<span class="badge ${status==='complete'?'done':status==='study'?'partial':'missing'}">${statusNames[status]}</span>`;}
function render(){
 const families=matchingFamilies(),q=$('query').value.trim().toLowerCase();
 $('coverage-label').hidden=view!=='styles';$('status-label').hidden=view!=='games';
 $('results').className=view==='games'?'game-grid':view==='styles'?'style-grid':'table-wrap';
 let count=0;
 if(view==='styles'){
  const coverage=$('coverage').value;
  const filtered=families.filter(f=>coverage==='all'||(coverage==='missing'?f.completeCount===0:f.coverage===coverage));count=filtered.length;
  filtered.sort((a,b)=>(a.completeCount>0)-(b.completeCount>0)||a.label.localeCompare(b.label,'zh'));
  $('results').innerHTML=filtered.map(f=>`<article class="style-card"><div class="card-top"><span class="parent-label">${esc(f.parent)}</span><span class="badge ${f.coverage==='covered'?'done':f.coverage==='study-only'?'partial':'missing'}">${f.coverage==='covered'?'已有完整包':f.coverage==='study-only'?'缺口 · 仅有样品':'缺口 · 尚无完整包'}</span></div><h3>${esc(f.label)}</h3><p>${esc(f.description)}</p><div class="term-pills">${f.tagIds.map(id=>`<span>${esc(tagOf(id).name)}</span>`).join('')}</div><div class="coverage-line"><span><strong>${f.completeCount}</strong> 完整包</span><span>${f.studyCount} 样品</span><span>${f.gameIds.length} 个参考</span></div><div class="opportunity">可验证的界面：${esc(f.uiOpportunity)}</div><div class="game-buttons">${f.gameIds.map(id=>{const g=data.games.find(g=>g.id===id);return `<button type="button" data-game="${esc(id)}">${esc(g.title)}${g.status==='complete'?' ↗':' · 待做'}</button>`;}).join('')}</div></article>`).join('');
  $('result-count').textContent=`显示 ${count} / ${data.families.length} 个细分风格`;
  $('view-note').textContent=data.summary.missingFamilies===0?`当前 ${data.families.length} 个已归类方向均已有实验参考包，仍有 ${data.games.filter(g=>g.status!=='complete').length} 个游戏变体未做。细分类与词条关系属于人工整理；范围限于本站种子库。`:'缺口按本站完整参考包计算；一个大风格已覆盖，其下的游戏变体仍可能未制作。细分类与词条关系属于人工整理。';
 }else if(view==='games'){
  const status=$('status').value;
  const allowed=new Set(families.map(f=>f.id));
  const filtered=data.games.filter(g=>g.familyIds.some(id=>allowed.has(id))&&(status==='all'||(status==='unmade'?g.status!=='complete':g.status===status))&&(!q||[g.title,g.englishTitle,g.variant,...g.familyIds.flatMap(id=>{const f=familyOf(id);return[f.label,f.description,f.uiOpportunity,...f.tagIds.flatMap(id=>[tagOf(id).name,tagOf(id).zh])];})].join(' ').toLowerCase().includes(q)));count=filtered.length;
  $('results').innerHTML=filtered.map(g=>`<article class="game-card">${g.preview?`<img src="${esc(g.preview)}" alt="${esc(g.title)}本站 UI 样品，非官方截图" loading="lazy">`:`<div class="no-preview"><strong>${esc(g.englishTitle)}</strong><small>参考候选 · 尚无本站样品</small></div>`}<div class="game-info">${badge(g.status)}<h3>${esc(g.title)}</h3><p>${esc(g.englishTitle)}<br>${esc(g.variant)}</p><p>${g.familyIds.map(id=>esc(familyOf(id).label)).join(' / ')}</p><button type="button" data-game="${esc(g.id)}">查看 ${esc(g.englishTitle)} 的来源与状态 ↗</button></div></article>`).join('');
  $('result-count').textContent=`显示 ${count} / ${data.games.length} 个游戏条目`;
  $('view-note').textContent='“未做完整包”包含只有样品、已有研究与新候选。图片均为本站制作的参考样品；没有预览的条目保留为空。';
 }else{
  const selected=$('tag').value,parent=$('parent').value;
  const filtered=data.steamTags.filter(t=>(selected==='all'||t.id===selected)&&(!q||`${t.name} ${t.zh} ${axes[t.axis]}`.toLowerCase().includes(q))&&(parent==='all'||data.families.some(f=>f.parent===parent&&f.tagIds.includes(t.id))));count=filtered.length;
  $('results').innerHTML=`<table><thead><tr><th>SteamDB 原词</th><th>拆分维度</th><th>本站映射</th><th>来源</th></tr></thead><tbody>${filtered.map(t=>{const f=data.families.filter(f=>f.tagIds.includes(t.id)),covered=f.filter(f=>f.completeCount>0);return `<tr><td><button type="button" class="tag-link" data-tag="${t.id}">${esc(t.name)}</button><small>${esc(t.zh)}</small></td><td>${esc(axes[t.axis])}</td><td>${f.length} 个细分类<small>${covered.length} 类有完整包；${f.length-covered.length} 类尚未覆盖</small></td><td><a class="source-link" href="${esc(t.sourceUrl)}" target="_blank" rel="noopener">SteamDB ↗</a></td></tr>`;}).join('')}</tbody></table>`;
  $('result-count').textContent=`显示 ${count} / ${data.steamTags.length} 个 SteamDB 视觉词条`;
  $('view-note').textContent='29 个词条原属 Visuals & Viewpoint；拆轴及映射是本站整理。0 个映射代表尚未归类，不代表 Steam 上没有此类游戏或需求。';
 }
 $('empty').hidden=count>0;
 $('empty').querySelector('h3').textContent=view==='styles'&&$('coverage').value==='missing'&&data.summary.missingFamilies===0?'当前细分类的风格缺口已补齐':'没有匹配的条目';
 $('empty').querySelector('p').textContent=view==='styles'&&$('coverage').value==='missing'&&data.summary.missingFamilies===0?'切到“游戏资料 → 未做完整包”，继续找同一风格下尚未制作的游戏变体。':'试试清除条件。词条暂无映射，只表示本资料库尚未归类。';
 if(data.summary.complete===data.summary.games){
  if((view==='games'&&$('status').value==='unmade')||(view==='styles'&&$('coverage').value==='missing')){
   $('empty').querySelector('h3').textContent=`当前 ${data.games.length} 款种子游戏均已完成参考包`;
   $('empty').querySelector('p').textContent='清除筛选可查看现有 Skill。范围限于本站已收录游戏，后续可继续研究新的风格与游戏候选。';
  }
 }
 document.querySelectorAll('[data-view]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.view===view)));
}
function openGame(id,trigger){
 const g=data.games.find(g=>g.id===id);if(!g)return;returnFocus=trigger;
 const families=g.familyIds.map(familyOf),terms=[...new Set(families.flatMap(f=>f.tagIds))].map(tagOf);
 const sourceLabel=g.sourceType==='primary-page-checked-this-run'?'本次核实官方商店页':'沿用原合集资料与本地文件';
 $('detail-content').innerHTML=`${badge(g.status)}<h2 id="detail-title">${esc(g.title)}</h2><p>${esc(g.englishTitle)} · ${esc(g.version)}</p>${g.preview?`<img src="${esc(g.preview)}" alt="${esc(g.title)}本站参考 UI 样品">`:''}<dl><dt>细分风格</dt><dd>${families.map(f=>esc(f.label)).join(' / ')}</dd><dt>界面方向</dt><dd>${esc(g.variant)}</dd><dt>制作记录</dt><dd>${g.status==='complete'?'存在完整 ZIP 与可运行 Web 示例。':'尚无完整 Skill 包；'+statusNames[g.status]+'。'}</dd><dt>词表映射</dt><dd>${terms.map(t=>esc(t.name)).join(' / ')}<br>本站人工映射；未核实该游戏的 SteamDB 标签档案。</dd><dt>官方标签记录</dt><dd>${g.observedSteamTags?esc(g.observedSteamTags.join(' / '))+'（本次读取的 Steam 商店部分标签）':'未录入逐游戏的官方标签快照，保留为未知。'}</dd><dt>来源状态</dt><dd>${sourceLabel} · ${esc(g.evidenceDate)}</dd><dt>搜索与付费需求</dt><dd>未知；没有使用游戏标签或口碑替代需求验证。</dd></dl><p>${esc(g.notes)}</p><div class="detail-links">${g.labUrl?`<a href="${esc(g.labUrl)}">打开完整参考与界面 ↗</a>`:''}${g.archiveUrl?`<a href="${esc(g.archiveUrl)}" download>下载 Skill ↓</a>`:''}${g.officialUrl?`<a href="${esc(g.officialUrl)}" target="_blank" rel="noopener">官方资料 ↗</a>`:''}${g.steamdbUrl?`<a href="${esc(g.steamdbUrl)}" target="_blank" rel="noopener">SteamDB 游戏入口 ↗</a>`:''}</div><div class="provenance">来源与推断分开记录。SteamDB 负责词表入口；画法、材质、界面机会及覆盖归类属于本站判断。游戏名称标识参考方向。完整包仍是实验性 Web 参考资料。</div>`;
 $('detail').showModal();
}
try{
 const response=await fetch('./data.json');if(!response.ok)throw Error('Data unavailable');data=await response.json();
 if(data.summary.missingFamilies===0)$('coverage').value='all';
 $('terms-total').textContent=data.summary.steamdbTerms;$('families-total').textContent=data.summary.families;$('games-total').textContent=data.summary.games;
 $('stats').innerHTML=[[data.summary.games,'游戏资料'],[data.summary.complete,'完整实验包'],[data.summary.study,'仅有样品'],[data.summary.researched+data.summary.candidate,'研究与新候选'],[data.summary.missingFamilies,'细分风格缺口']].map(([n,label])=>`<div><b>${n}</b><span>${label}</span></div>`).join('');
 $('parent').innerHTML+=[...new Set(data.families.map(f=>f.parent))].map(p=>`<option value="${esc(p)}">${esc(p)}</option>`).join('');
 $('tag').innerHTML+=Object.entries(axes).map(([axis,label])=>`<optgroup label="${label}">${data.steamTags.filter(t=>t.axis===axis).map(t=>`<option value="${t.id}">${esc(t.zh)} · ${esc(t.name)}</option>`).join('')}</optgroup>`).join('');
 for(const id of ['query','parent','tag','coverage','status'])$(id).addEventListener(id==='query'?'input':'change',render);
 document.querySelector('.view-tabs').addEventListener('click',e=>{const button=e.target.closest('[data-view]');if(button){view=button.dataset.view;render();}});
 $('reset').addEventListener('click',()=>{$('query').value='';for(const id of ['parent','tag','status'])$(id).value='all';$('coverage').value='all';render();});
 $('results').addEventListener('click',e=>{const g=e.target.closest('[data-game]');if(g)openGame(g.dataset.game,g);const t=e.target.closest('[data-tag]');if(t){view='styles';$('tag').value=t.dataset.tag;$('coverage').value='all';$('query').value='';render();}});
 $('close-detail').addEventListener('click',()=>$('detail').close());$('detail').addEventListener('close',()=>returnFocus?.focus());
 render();
}catch(error){$('results').textContent='数据库暂时无法读取，请刷新后重试。';console.error(error);}
