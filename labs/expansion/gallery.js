const $ = (id) => document.getElementById(id);
const escape = (text = '') => String(text).replace(/[&<>"']/g, (c) => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const groups = {
  '全部': null,
  '本轮剩余 14 款': ['hades','hollow-knight','dont-starve','persona-5','genshin-impact','terraria','animal-crossing','starcraft','paper-mario','earthbound','heroes-iii','warcraft-iii','chrono-trigger','zelda-alttp'],
  '数据库缺口 14 种': ['darkest-dungeon','minecraft','cyberpunk-2077','fallout-2','sable','mundaun','dusk','her-story','cogmind','mini-metro','in-other-waters','hypnospace-outlaw','tunic','manifold-garden'],
  '系统与科幻': ['nier-automata','xcom-2','ftl','dead-space','mirrors-edge'],
  '纸本与档案': ['papers-please','potion-craft','pentiment','obra-dinn','ace-attorney'],
  '漫画与街头': ['splatoon-3','borderlands-2','danganronpa','jet-set-radio'],
  '复古与像素': ['bioshock','undertale','cuphead','octopath-traveler'],
  '手绘与剪影': ['banner-saga','curse-monkey-island','okami','patapon','ori-wisps'],
  '策略与生活': ['frostpunk','civilization-vi','the-sims-4','katamari'],
  '木刻与卡牌': ['inscryption'],
  '水彩与氛围': ['limbo','gris','journey'],
  '手工与材质': ['littlebigplanet','tearaway','hylics-2','samorost-3'],
};
let selected = '全部';
let catalog;
const labels = {'browser-checked':'浏览器检查完成','implemented':'独立界面已实现','pack-ready':'参考包已冻结','authoring':'参考包制作中'};
function render() {
  const query = $('search').value.trim().toLowerCase();
  const state = $('state').value;
  const batch=$('batch').value;
  const batchEntries=catalog.entries.filter(e=>batch==='all'||e.batch===batch);
  $('stats').innerHTML=[`${batchEntries.length} 种${batch==='all'?'扩展':'本轮'}方向`,`${batchEntries.filter(e=>e.archiveUrl).length} 套参考包`,`${batchEntries.reduce((n,e)=>n+e.screens.length,0)} 个界面`,`${batchEntries.filter(e=>e.state==='browser-checked').length} 套完成浏览器检查`].map(x=>`<span>${x}</span>`).join('');
  const entries = catalog.entries.filter((e) => (batch==='all'||e.batch===batch) && (!groups[selected] || groups[selected].includes(e.slug)) && (state === 'all' || state === e.state) && [e.title,e.englishTitle,e.visualFamily,e.uiHypothesis].join(' ').toLowerCase().includes(query));
  $('result-count').textContent = `显示 ${entries.length} / ${catalog.entries.length} 种新增风格`;
  $('empty').hidden = entries.length > 0;
  $('collection').innerHTML = entries.map((e) => {
    const image = e.image ? `<img src="${escape(e.image)}" alt="${escape(e.title+' '+e.imageKind)}" loading="lazy"><span class="image-kind">${escape(e.imageKind)}</span>` : `<div class="placeholder"><strong>${escape(e.visualFamily)}</strong><small>参考包制作中</small></div>`;
    const visual = e.labUrl ? `<a href="${escape(e.labUrl)}" aria-label="查看${escape(e.title)} Skill">${image}</a>` : `<div class="visual">${image}</div>`;
    return `<article class="exp-card" id="${escape(e.slug)}">${visual}<div class="card-body"><div class="card-status"><i class="status-dot ${e.state==='browser-checked'?'checked':''}"></i>${labels[e.state]} · LUNA / MAX</div><h3>${escape(e.title)}</h3><p class="english">${escape(e.englishTitle)}</p><p class="family">${escape(e.visualFamily)}</p><p class="grammar">${escape(e.uiHypothesis)}</p><div class="card-links">${e.labUrl?`<a href="${escape(e.labUrl)}">参考包与界面 ↗</a>`:''}${e.archiveUrl?`<a download href="${escape(e.archiveUrl)}">下载 Skill ↓</a>`:''}<a target="_blank" rel="noopener" href="${escape(e.officialSource)}">原作参考 ↗</a></div></div></article>`;
  }).join('');
}
try {
  const response = await fetch('./catalog.json');
  if (!response.ok) throw new Error('catalog unavailable');
  catalog = await response.json();
  document.title=`${catalog.entries.length} 种游戏风格 · Luna Skill 实验`;
  const initialBatch=new URLSearchParams(location.search).get('batch');
  if(['materials-11','gaps-14','remaining-14'].includes(initialBatch))$('batch').value=initialBatch;
  const s=catalog.summary;
  $('stats').innerHTML = [`${s.requested} 种新增方向`,`${s.packaged} 套参考包`,`${s.newScreens} 个新界面`,`${s.checked} 套完成浏览器检查`].map((x)=>`<span>${x}</span>`).join('');
  $('filters').innerHTML = Object.keys(groups).map((name)=>`<button type="button" aria-pressed="${name===selected}" data-group="${escape(name)}">${escape(name)}</button>`).join('');
  $('filters').addEventListener('click', (event)=>{const button=event.target.closest('button');if(!button)return;selected=button.dataset.group;for(const item of $('filters').querySelectorAll('button'))item.setAttribute('aria-pressed',String(item===button));render();});
  $('search').addEventListener('input',render);
  $('state').addEventListener('change',render);
  $('batch').addEventListener('change',render);
  $('research').innerHTML = (catalog.nextResearch.entries || []).map((e)=>`<article class="research-card"><span class="research-label">RESEARCH CANDIDATE · 研究候选</span><h3>${escape(e.title)}</h3><p><strong>${escape(e.visualFamily)}</strong><br>${escape(e.uiHypothesis)}</p><p>${escape(e.limit)}</p>${e.reviewRanking?`<p class="small"><a href="${escape(e.reviewRanking.url)}" target="_blank" rel="noopener">Steam 250 · ${escape(e.reviewRanking.tag)} #${e.reviewRanking.rank}</a><br>游戏口碑名次 · ${escape(e.reviewRanking.checkedAt)}，搜索量未知</p>`:''}<a href="${escape(e.source)}" target="_blank" rel="noopener">官方参考 ↗</a></article>`).join('');
  render();
} catch(error) {
  $('collection').textContent='风格目录暂时无法读取，请刷新后重试。';
  console.error(error);
}
