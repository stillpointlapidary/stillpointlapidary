// ── MOOD TAB ──

function filterIntentionTier(stones){return intentionIncludeTier4?stones:stones.filter(c=>Number(c&&c.tier)!==4);}

function toggleIntentionTier4(checkbox){
  intentionIncludeTier4=checkbox.checked;
  if(!activeIntentionGroup)return;
  const matches=getIntentionGroupMatches(activeIntentionGroup);
  activeIntentionVisibleCount=intentionPageSize();
  activeIntentionFilter='all';
  document.querySelectorAll('#sub-filter-pills .sfpill').forEach(p=>p.classList.toggle('active',(p.dataset.subfilter||'all')==='all'));
  renderIntentionResults(matches,activeIntentionGroup);
}

function intentionTierRangeLabel(){return intentionIncludeTier4?'Tier 1–4':'Tier 1–3';}

function intentionFilterHaystack(c){
  return [
    c.n,c.a,c.uw,c.er1,c.er2,c.er3,c.primary_theme,
    ...(c.all_themes||[])
  ].filter(Boolean).join(' ').toLowerCase();
}

// Resolves the stones matching a single sub-intention filter definition
// (curated Supabase rows take priority; a recognized curated slug returning
// 0 rows is a data/mapping error and must never silently fall back). This is
// the one working child-pill predicate — reused for both individual child
// selections and the parent "All" union below, so there is a single source
// of truth for what "matches this intention" means.
function getIntentionFilterMatches(filter){
  if(!filter)return[];
  const slug=filter.slug;
  if(slug&&CURATED_INTENTION_SLUGS.has(slug)){
    const rows=curatedIntentionIndex[slug]||[];
    if(rows.length===0){
      console.error('[Intention] Recognized slug returned 0 curated rows:',slug,'— check Supabase data, RLS, and loadStoneIntentionReasons()');
      return[];
    }
    return filterIntentionTier(rows.map(r=>{
      const stone=CRYSTALS.find(c=>c.i===r.stone_slug);
      if(!stone)console.warn('[Intention] stone_slug not found in CRYSTALS:',r.stone_slug,'(intention:',slug+')');
      return stone;
    }).filter(Boolean));
  }
  return filterIntentionTier(CRYSTALS.filter(c=>{
    if(slug&&c.intention_tags&&c.intention_tags.length>0){
      return c.intention_tags.includes(slug);
    }
    const themes=c.all_themes||[];
    const themeHit=(filter.themes||[]).some(t=>themes.includes(t)||c.primary_theme===t);
    if(themeHit)return true;
    const hay=intentionFilterHaystack(c);
    return (filter.keywords||[]).some(k=>hay.includes(String(k).toLowerCase()));
  }));
}

// A parent category's "All" match set is the deduplicated union of every one
// of its child intentions' matches — never a literal parent-level tag/slug,
// which (even when populated) is a separate, much smaller editorial list.
function getIntentionGroupMatches(group){
  activeCuratedSlug=null;
  const defs=INTENTION_SUB_FILTERS[group]||[];
  if(defs.length){
    const seen=new Set();
    const union=[];
    defs.forEach(def=>{
      getIntentionFilterMatches(def).forEach(stone=>{
        if(stone&&!seen.has(stone.i)){
          seen.add(stone.i);
          union.push(stone);
        }
      });
    });
    return union;
  }
  // Groups with no defined child filters fall back to intention_tags/themes.
  const parentSlug=INTENTION_PARENT_SLUGS[group];
  return filterIntentionTier(CRYSTALS.filter(c=>{
    if(parentSlug&&c.intention_tags&&c.intention_tags.length>0){
      return c.intention_tags.includes(parentSlug);
    }
    const themes=INTENTION_THEME_MAP[group]||[];
    return themes.some(t=>(c.all_themes||[]).includes(t));
  }));
}

function applyIntentionSubFilter(matches, group, filterLabel){
  if(!filterLabel||filterLabel==='all'){
    activeCuratedSlug=null;
    return matches;
  }
  const defs=(INTENTION_SUB_FILTERS[group]||[]).length?INTENTION_SUB_FILTERS[group]:activeIntentionFilterDefs;
  const filter=defs.find(f=>f.label===filterLabel);
  if(!filter)return matches;
  if(filter.slug&&CURATED_INTENTION_SLUGS.has(filter.slug)){
    activeCuratedSlug=filter.slug;
    return getIntentionFilterMatches(filter);
  }
  activeCuratedSlug=null;
  return matches.filter(c=>{
    if(filter.slug&&c.intention_tags&&c.intention_tags.length>0){
      return c.intention_tags.includes(filter.slug);
    }
    const themes=c.all_themes||[];
    const themeHit=(filter.themes||[]).some(t=>themes.includes(t)||c.primary_theme===t);
    if(themeHit)return true;
    const hay=intentionFilterHaystack(c);
    return (filter.keywords||[]).some(k=>hay.includes(String(k).toLowerCase()));
  });
}

function intentionTierRank(c){
  const tier=Number(c&&c.tier);
  if(tier===0)return 0;
  if(FEATURED_STONES.some(s=>s.id===(c&&c.i)))return 0;
  return Number.isFinite(tier)?tier:9;
}

function intentionRelevanceScore(c, context){
  if(!c)return 0;
  if(activeIntentionScoreMap[c.i]!=null)return activeIntentionScoreMap[c.i];
  const themes=c.all_themes||[];
  const hay=intentionFilterHaystack(c);
  let score=0;
  const group=context&&context.group;
  const filterLabel=context&&context.filterLabel;
  const groupThemes=(context&&context.themes)||INTENTION_THEME_MAP[group]||[];
  groupThemes.forEach(t=>{
    if(c.primary_theme===t)score+=8;
    if(themes.includes(t))score+=5;
    if([c.er1,c.er2,c.er3].includes(t))score+=3;
  });
  const filter=((INTENTION_SUB_FILTERS[group]||[]).length ? INTENTION_SUB_FILTERS[group] : activeIntentionFilterDefs).find(f=>f.label===filterLabel);
  if(filter){
    (filter.themes||[]).forEach(t=>{
      if(c.primary_theme===t)score+=10;
      if(themes.includes(t))score+=7;
      if([c.er1,c.er2,c.er3].includes(t))score+=4;
    });
    (filter.keywords||[]).forEach(k=>{if(hay.includes(String(k).toLowerCase()))score+=2;});
  }
  return score;
}

function sortIntentionMatches(matches, context){
  if(activeCuratedSlug)return(matches||[]).slice();
  return (matches||[]).slice().sort((a,b)=>{
    const scoreDiff=intentionRelevanceScore(b,context)-intentionRelevanceScore(a,context);
    if(scoreDiff)return scoreDiff;
    const tierDiff=intentionTierRank(a)-intentionTierRank(b);
    if(tierDiff)return tierDiff;
    return String(a.n||'').localeCompare(String(b.n||''));
  });
}

function intentionCategoryDisplayName(group){
  return INTENTION_SHOWING_LABELS[group] || group || 'these stones';
}

function intentionResultsTitle(){
  if(activeIntentionMode==='ai')return'Stones for you right now';
  if(activeIntentionMode==='category')return`Stones for ${intentionCategoryDisplayName(activeIntentionGroup).toLowerCase()}`;
  if(activeIntentionMode==='mood'&&activeMoodIdx!==null){
    const mood=MOOD_DATA[activeMoodIdx];
    return mood?`Stones for ${mood.label.replace(/^I (feel|need|want|am|\'m) /i,'').toLowerCase()}`:'Stones for this intention';
  }
  return'Stones for this intention';
}

function buildAiSubFilters(stones){
  const ordered=['Grounding','Protection','Heart Healing','Emotional Regulation','Calm & Peace','Self-Love','Clarity & Focus','Communication','Intuition','Spiritual Connection','Vitality','Transformation','Manifestation','Confidence'];
  const present=new Set();
  stones.forEach(c=>{
    (c.all_themes||[]).forEach(t=>present.add(t));
    [c.primary_theme,c.er1,c.er2,c.er3].filter(Boolean).forEach(t=>present.add(t));
  });
  return ordered.filter(t=>present.has(t)).slice(0,8).map(label=>({label,themes:[label],keywords:[label.toLowerCase()]}));
}

function buildSharedSubFilters(filters){
  const row=document.getElementById('sub-filter-row');
  const pillsEl=document.getElementById('sub-filter-pills');
  if(!row || !pillsEl)return;
  const subs=filters||[];
  if(!subs.length){row.style.display='none';pillsEl.innerHTML='';return;}
  row.style.display='flex';
  const chips=[{label:'All'},...subs];
  pillsEl.innerHTML=chips.map(ch=>{
    const label=ch.label;
    const value=label==='All'?'all':label;
    const active=(activeIntentionFilter||'all')===value;
    return`<button class="sfpill${active?' active':''}" type="button" data-subfilter="${escapeAttr(value)}">${escapeAttr(label)}</button>`;
  }).join('');
}

function buildIntentionSubFilters(group){
  buildSharedSubFilters(INTENTION_SUB_FILTERS[group]||[]);
}

function renderIntentionStoneCards(){
  const stoneGrid = document.getElementById('mood-stone-grid');
  if (!stoneGrid) return;
  stoneGrid.style.display = 'grid';
  const visible=activeCuratedSlug?activeIntentionMatches.slice():activeIntentionMatches.slice(0,activeIntentionVisibleCount);
  if (!visible.length) {
    stoneGrid.innerHTML = '<div class="empty-state">No stones found for this intention yet.</div>';
  }else{
    stoneGrid.innerHTML = visible.map(intentionStoneCardHtml).join('');
  }

  const loadMore=document.getElementById('mood-load-more');
  if(loadMore){
    if(!activeCuratedSlug&&activeIntentionMatches.length>activeIntentionVisibleCount){
      loadMore.style.display='block';
      const ps=intentionPageSize();loadMore.innerHTML=`<div class="mood-load-more-text">Showing ${visible.length} of ${activeIntentionMatches.length} ${intentionTierRangeLabel()} results</div><button class="mood-load-more-btn" type="button" onclick="loadMoreIntentionStones()">Load ${ps} more results</button><div class="mood-backtop-wrap"><button class="mood-backtop" type="button" onclick="document.getElementById('mood-selected-view')?.scrollIntoView({behavior:'smooth',block:'start'})">Back to top</button></div>`;
    }else{
      loadMore.style.display='none';
      loadMore.innerHTML='';
    }
  }
}

function updateIntentionCount(){
  const countEl = document.getElementById('mood-results-count');
  const titleEl = document.getElementById('mood-shared-results-title');
  if(titleEl)titleEl.textContent=intentionResultsTitle();
  if(!countEl)return;
  const vis=activeCuratedSlug?activeIntentionMatches.length:Math.min(activeIntentionVisibleCount,activeIntentionMatches.length);
  countEl.textContent = `Showing ${vis} of ${activeIntentionMatches.length}` + (activeIntentionFilter && activeIntentionFilter!=='all' ? ' · ' + activeIntentionFilter : '');
}

function setIntentionSubFilter(val){
  activeIntentionFilter=val||'all';
  activeIntentionVisibleCount=intentionPageSize();
  activeIntentionMatches=sortIntentionMatches(
    applyIntentionSubFilter(activeIntentionBaseMatches, activeIntentionGroup, activeIntentionFilter),
    {group:activeIntentionGroup,filterLabel:activeIntentionFilter}
  );
  document.querySelectorAll('#sub-filter-pills .sfpill').forEach(p=>p.classList.toggle('active',(p.dataset.subfilter||'all')===activeIntentionFilter));
  updateIntentionCount();
  renderIntentionStoneCards();
}

function loadMoreIntentionStones(){
  activeIntentionVisibleCount+=intentionPageSize();
  renderIntentionStoneCards();
}

function initNarrowByDelegation(){
  const pillsEl=document.getElementById('sub-filter-pills');
  if(!pillsEl||pillsEl.dataset.delegated==='1')return;
  pillsEl.dataset.delegated='1';
  pillsEl.addEventListener('click',function(e){
    const btn=e.target.closest('[data-subfilter]');
    if(!btn||!pillsEl.contains(btn))return;
    e.preventDefault();
    e.stopPropagation();
    const value=btn.dataset.subfilter||'all';
    if(activeIntentionMode==='mood')setSubFilter(value);
    else setIntentionSubFilter(value);
  });
}

function intentionCardClick(group, el) {
  // Clear active state on all cards
  document.querySelectorAll('#intention-grid .intention-card').forEach(c => c.classList.remove('active'));
  el.classList.add('active');

  if (group === 'all') {
    clearMoodResults();
    renderMoodGrid('All');
    const grid = document.getElementById('mood-grid');
    if (grid) {
      grid.style.display = '';
      const rb = document.getElementById('mood-reset-bar');
      if (rb) rb.style.display = '';
      const y = grid.getBoundingClientRect().top + window.scrollY - 148;
      window.scrollTo({ top: Math.max(0, y), behavior: 'smooth' });
    }
    return;
  }

  clearMoodResults();
  activeIntentionMode='category';
  activeIntentionQuery='';
  activeIntentionGroup=group;
  activeIntentionFilter='all';
  activeIntentionFilterDefs=INTENTION_SUB_FILTERS[group]||[];
  activeIntentionVisibleCount=intentionPageSize();
  activeIntentionScoreMap={};
  const matches = sortIntentionMatches(getIntentionGroupMatches(group), {group});
  renderIntentionResults(matches, group);

  // Scroll to results
  const sv = document.getElementById('mood-selected-view');
  if (sv) {
    const y = sv.getBoundingClientRect().top + window.scrollY - 148;
    window.scrollTo({ top: Math.max(0, y), behavior: 'smooth' });
  }
}

function renderIntentionResults(matches, group) {
  // Hide the mood card grid — we're going straight to stones
  const moodGrid = document.getElementById('mood-grid');
  if (moodGrid) moodGrid.style.display = 'none';

  // Show reset bar
  const rb = document.getElementById('mood-reset-bar');
  if (rb) rb.style.display = '';

  // Populate the selected-card header with the category name
  const groupEl = document.getElementById('mood-selected-group');
  const labelEl = document.getElementById('mood-selected-label');
  const subEl   = document.getElementById('mood-selected-sub');
  if (groupEl) groupEl.textContent = '';
  if (labelEl) labelEl.textContent = 'Showing: ' + intentionCategoryDisplayName(group);
  if (subEl)   subEl.textContent   = INTENTION_CARD_SUBS[group] || '';
  const selectedClear=document.querySelector('#mood-selected-card .mood-selected-clear');
  if(selectedClear)selectedClear.textContent='← Change';

  // Show category-level refinement chips
  buildIntentionSubFilters(group);
  const gridBanner = document.getElementById('mood-grid-banner');
  if (gridBanner) gridBanner.style.display = 'none';

  activeIntentionBaseMatches=sortIntentionMatches(matches, {group});
  activeIntentionMatches=activeIntentionBaseMatches;
  updateIntentionCount();

  // Show the selected-view container
  const selectedView = document.getElementById('mood-selected-view');
  if (selectedView) selectedView.style.display = 'block';

  const tier4Row=document.getElementById('mood-tier4-row');
  if(tier4Row)tier4Row.style.display='block';

  renderIntentionStoneCards();
}

function buildMoodGroupPills(){
  const wrap=document.getElementById('mood-group-pills');
  if(!wrap)return;
  wrap.innerHTML=MOOD_GROUPS.map((g,i)=>`<button class="fpill${i===0?' active':''}" onclick="moodGroupFilter('${g}',this)">${g}</button>`).join('');
}

function moodGroupFilter(group,btn){
  document.querySelectorAll('#mood-group-pills .fpill').forEach(p=>p.classList.remove('active'));
  btn.classList.add('active');
  clearMoodResults();
  renderMoodGrid(group);
  const grid=document.getElementById('mood-grid');
  if(grid)grid.style.display='';
  const rb=document.getElementById('mood-reset-bar');
  if(rb)rb.style.display='';
}

function renderMoodGrid(group){
  const grid=document.getElementById('mood-grid');
  if(!grid)return;
  const items=group==='All'?MOOD_DATA:MOOD_DATA.filter(m=>m.group===group);
  grid.innerHTML=items.map(m=>{
    const idx=MOOD_DATA.indexOf(m);
    return`<div class="mood-card" onclick="showMoodResults(${idx},this)"><div class="mood-group-label">${m.group}</div><div class="mood-label">${m.label}</div><div class="mood-sub-text">${m.sub}</div></div>`;
  }).join('');
}

function getMoodMatches(moodIdx,subFilter){
  const themes=MOOD_THEME_MAP[String(moodIdx)]||[];
  let matches=filterIntentionTier(CRYSTALS.filter(c=>c.all_themes&&themes.some(t=>c.all_themes.includes(t))));
  if(subFilter&&subFilter!=='all'){
    const subKwMap=SUB_FILTER_KW[String(moodIdx)];
    if(subKwMap&&subKwMap[subFilter]){
      const kws=subKwMap[subFilter];
      const filtered=matches.filter(c=>kws.some(k=>((c.uw||'')+(c.er1||'')+(c.er2||'')+(c.er3||'')).toLowerCase().includes(k)));
      matches=filtered;
    }
  }
  return matches;
}

function showMoodResults(idx,el){
  activeIntentionMode='mood';activeMoodIdx=idx;activeSubFilter=null;
  const m=MOOD_DATA[idx];
  // Hide grid, show only selected card + results
  document.getElementById('mood-grid').style.display='none';
  const sv=document.getElementById('mood-selected-view');
  if(sv){
    sv.style.display='block';
    document.getElementById('mood-selected-group').textContent=m.group;
    document.getElementById('mood-selected-label').textContent=m.label;
    document.getElementById('mood-selected-sub').textContent=m.sub;
    const selectedClear=document.querySelector('#mood-selected-card .mood-selected-clear');
    if(selectedClear)selectedClear.textContent='← Change';
  }
  buildSubFilters(idx);
  renderMoodStones(idx,null);
  setTimeout(scrollToMoodNarrowBar,80);
}

function scrollToMoodNarrowBar(){
  const row=document.getElementById('sub-filter-row');
  const selected=document.getElementById('mood-selected-card');
  const target=(row&&row.style.display!=='none')?row:selected;
  if(!target)return;
  const y=target.getBoundingClientRect().top+window.scrollY-135;
  try{window.scrollTo({top:Math.max(0,y),left:0,behavior:'smooth'});}catch(e){window.scrollTo(0,Math.max(0,y));}
}

function buildSubFilters(idx){
  const subs=SUB_FILTERS[String(idx)];
  const row=document.getElementById('sub-filter-row');
  if(!row)return;
  if(!subs||!subs.length){row.style.display='none';return;}
  row.style.display='flex';
  const pillsEl=document.getElementById('sub-filter-pills');
  if(pillsEl)pillsEl.innerHTML=`<button class="sfpill active" type="button" data-subfilter="all">All</button>`+
    subs.map(s=>`<button class="sfpill" type="button" data-subfilter="${escapeAttr(s)}">${escapeAttr(s)}</button>`).join('');
}

function setSubFilter(val){
  activeSubFilter=(val&&val!=='all')?val:null;
  activeIntentionFilter=activeSubFilter||'all';
  activeIntentionVisibleCount=intentionPageSize();
  document.querySelectorAll('#sub-filter-pills .sfpill').forEach(p=>p.classList.toggle('active',(p.dataset.subfilter||'all')===(activeSubFilter||'all')));
  renderMoodStones(activeMoodIdx,activeSubFilter);
}

function renderMoodStones(moodIdx,subFilter){
  const matches=getMoodMatches(moodIdx,subFilter);
  const grid=document.getElementById('mood-stone-grid');
  const countEl=document.getElementById('mood-results-count');
  const selectedView=document.getElementById('mood-selected-view');
  const loadMore=document.getElementById('mood-load-more');
  if(loadMore){loadMore.style.display='none';loadMore.innerHTML='';}
  const oldAi=document.getElementById('ai-results-wrap');
  if(oldAi)oldAi.style.display='none';
  const titleEl=document.getElementById('mood-shared-results-title');
  if(titleEl)titleEl.textContent=intentionResultsTitle();
  if(selectedView)selectedView.style.display='block';
  if(grid)grid.style.display='grid';
  activeIntentionBaseMatches=matches;
  activeIntentionMatches=sortIntentionMatches(matches,{themes:MOOD_THEME_MAP[String(moodIdx)]||[],filterLabel:subFilter});
  if(countEl)countEl.textContent=matches.length+' stones'+(subFilter?' · '+subFilter:'');
  if(!grid)return;
  if(!matches.length){grid.innerHTML='<div class="empty-state">No stones match this combination.</div>';return;}
  const moodGrid=typeof CRYSTAL_GRIDS!=='undefined'&&CRYSTAL_GRIDS.find(g=>(g.moodLinks||[g.moodLink]).includes(moodIdx));
  const gridBanner=document.getElementById('mood-grid-banner');
  if(gridBanner){
    if(moodGrid){
      gridBanner.style.display='block';
      gridBanner.innerHTML=`<div style="margin-top:1rem;padding:0.75rem 1rem;background:var(--stone2);border-radius:8px;display:flex;align-items:center;justify-content:space-between;gap:1rem"><span style="font-size:13px;color:var(--ink2)">There is a grid for this intention.</span><button class="btn btn-sm" onclick="switchTab('101',getTabButton('101'));setTimeout(()=>{show101('grids');openGridModal('${moodGrid.id}');},400)">View ${moodGrid.name} →</button></div>`;
    }else{gridBanner.style.display='none';}
  }
  renderIntentionStoneCards();
}

// ── AI FREEFORM SEARCH ────────────────────────────────────────────────────
const AI_FALLBACK_THEMES=[
  {terms:['inspiration','inspired','creative','creativity','create','artist','ideas','spark'],themes:['Joy','Vitality','Manifestation','Confidence'],reason:'supports creative spark and fresh momentum'},
  {terms:['motivation','motivated','momentum','drive','energy','start','stuck','procrastinating'],themes:['Vitality','Confidence','Manifestation'],reason:'helps you move from stuck energy into action'},
  {terms:['work','career','business','project','focus','productivity','study'],themes:['Clarity & Focus','Confidence','Manifestation','Abundance'],reason:'supports focus, confidence, and purposeful work'},
  {terms:['calm','anxious','anxiety','overwhelm','stress','peace','rest'],themes:['Calm & Peace','Emotional Regulation','Grounding'],reason:'helps quiet overwhelm and steady your nervous system'},
  {terms:['sleep','rest','night','insomnia','tired'],themes:['Calm & Peace','Spiritual Connection','Grounding'],reason:'supports winding down and settling into rest'},
  {terms:['love','heart','grief','sad','relationship','forgive','self love','self-love'],themes:['Heart Healing','Self-Love','Emotional Regulation'],reason:'supports emotional softness, heart healing, and self-kindness'},
  {terms:['protect','protection','boundary','shield','negative','energy'],themes:['Protection','Grounding'],reason:'supports energetic boundaries and steadier protection'},
  {terms:['intuition','dream','spiritual','psychic','guidance','third eye'],themes:['Intuition','Spiritual Connection'],reason:'supports inner knowing and spiritual connection'},
  {terms:['change','transition','transform','release','letting go','new chapter'],themes:['Transformation','Grounding'],reason:'supports change, release, and moving through transition'},
  {terms:['money','abundance','prosperity','opportunity','success'],themes:['Abundance','Manifestation','Confidence'],reason:'supports opportunity, confidence, and receiving'}
];

function aiFallbackMatches(query){
  const q=String(query||'').toLowerCase();
  const tokens=q.split(/[^a-z0-9]+/).filter(t=>t.length>2);
  const themeHits=[];
  AI_FALLBACK_THEMES.forEach(group=>{
    if(group.terms.some(term=>q.includes(term))){
      group.themes.forEach(theme=>themeHits.push({theme,reason:group.reason}));
    }
  });
  const scored=CRYSTALS.map(c=>{
    const hay=[
      c.n,c.a,c.er1,c.er2,c.er3,c.uw,c.primary_theme,
      ...(c.all_themes||[])
    ].filter(Boolean).join(' ').toLowerCase();
    let score=0;
    let reason='';
    themeHits.forEach(hit=>{
      if((c.primary_theme||'')===hit.theme || (c.all_themes||[]).includes(hit.theme)){
        score+=5;
        if(!reason)reason=hit.reason;
      }
    });
    tokens.forEach(t=>{ if(hay.includes(t))score+=1; });
    if(c.tier===1)score+=0.5;
    return {c,score,reason};
  }).filter(r=>r.score>0)
    .sort((a,b)=>b.score-a.score || (a.c.tier||9)-(b.c.tier||9) || a.c.n.localeCompare(b.c.n))
    .slice(0,60);

  const fallback=scored.length?scored:CRYSTALS.filter(c=>c.tier===1).slice(0,60).map(c=>({c,score:1,reason:'is a versatile starter stone for finding your footing'}));
  return fallback.map(r=>({
    id:r.c.i,
    name:r.c.n,
    reason:`${r.c.n} ${r.reason || 'matches the feeling and intention in your words'}.`
  }));
}

async function runAISearch(){
  const input=document.getElementById('ai-search-input');
  const btn=document.getElementById('ai-search-btn');
  const errEl=document.getElementById('ai-search-error');
  const query=input.value.trim();
  if(!query){
    if(errEl){
      errEl.textContent='Type a feeling, intention, or situation first.';
      errEl.classList.add('ai-error--gentle');
      errEl.style.display='block';
    }
    if(input)input.focus();
    return;
  }

  // Build compact stone list
  const stones=CRYSTALS.map(s=>({id:s.i,name:s.n,er:[s.er1,s.er2,s.er3].filter(Boolean).join(' / '),uw:s.uw||''}));

  btn.classList.add('loading');
  btn.disabled=true;
  if(errEl){
    errEl.classList.remove('ai-error--gentle');
    errEl.style.display='none';
  }

  try{
    const res=await fetch(
      'https://vxujlgyhgnihnqrxzefw.supabase.co/functions/v1/claude-mood-match',
      {
        method:'POST',
        headers:{
          'Content-Type':'application/json',
          'Authorization':'Bearer sb_publishable_LfVL1UL-_8_8hXQktiF1BQ_UgbWvAPb'
        },
        body:JSON.stringify({query,stones})
      }
    );
    const data=await res.json();
    if(data.error) throw new Error(data.error);
    if(!Array.isArray(data.matches) || !data.matches.length) throw new Error('No AI matches returned');
    renderAIResults(data.matches, query);
  }catch(e){
    console.warn('AI mood match failed; using local fallback.', e);
    renderAIResults(aiFallbackMatches(query), query);
  }finally{
    btn.classList.remove('loading');
    btn.disabled=false;
  }
}

function sentenceWithPeriod(value){
  const trimmed=String(value||'').trim();
  if(!trimmed)return'';
  return /[.!?]$/.test(trimmed)?trimmed:`${trimmed}.`;
}

function cleanIntentionTerm(value){
  return String(value||'').trim().replace(/[.!?]+$/,'');
}

function getIntentionCardDescription(stone, selectedIntention){
  if(!stone)return'A supportive match for this intention based on its energetic profile.';
  const useWhen=[
    stone.useWhen,
    stone.use_when,
    stone.useWhenYou,
    stone.use_when_you,
    stone.use,
    stone.uw
  ].find(v=>typeof v==='string' && v.trim());

  if(useWhen){
    const trimmed=useWhen.trim();
    if(/^use when you\b/i.test(trimmed))return trimmed;
    if(/^when you\b/i.test(trimmed))return sentenceWithPeriod(`Use ${trimmed.charAt(0).toLowerCase()}${trimmed.slice(1)}`);
    if(/^you\b/i.test(trimmed))return sentenceWithPeriod(`Use when ${trimmed.charAt(0).toLowerCase()}${trimmed.slice(1)}`);
    return sentenceWithPeriod(`Use when you ${trimmed.charAt(0).toLowerCase()}${trimmed.slice(1)}`);
  }

  const bestFor=[
    stone.bestFor,
    stone.best_for,
    stone.intentions,
    stone.keywords,
    stone.energeticUses,
    stone.energetic_uses,
    stone.all_themes,
    stone.primary_theme,
    [stone.er1,stone.er2,stone.er3].filter(Boolean)
  ].find(v=>(Array.isArray(v)&&v.length) || (typeof v==='string' && v.trim()));

  if(Array.isArray(bestFor) && bestFor.length){
    const terms=bestFor.map(cleanIntentionTerm).filter(Boolean).slice(0,4);
    if(terms.length)return`Best for: ${terms.join(', ')}.`;
  }

  if(typeof bestFor==='string' && bestFor.trim()){
    return`Best for: ${cleanIntentionTerm(bestFor)}.`;
  }

  return'A supportive match for this intention based on its energetic profile.';
}

function compactIntentionReason(text){
  return String(text||'')
    .replace(/^use when you\s+/i,'')
    .replace(/^use when\s+/i,'')
    .replace(/^best for:\s*/i,'')
    .replace(/\s+/g,' ')
    .trim()
    .replace(/[.!?]+$/,'');
}

function selectedIntentionContextLabel(){
  if(activeIntentionFilter&&activeIntentionFilter!=='all')return activeIntentionFilter;
  if(activeIntentionMode==='mood'&&activeMoodIdx!==null){
    const mood=MOOD_DATA[activeMoodIdx];
    return mood ? mood.label : 'this intention';
  }
  if(activeIntentionMode==='category')return intentionCategoryDisplayName(activeIntentionGroup);
  if(activeIntentionMode==='ai')return activeIntentionQuery || 'this intention';
  return 'this intention';
}

function intentionThemePhrase(stone){
  const themes=[stone.primary_theme,stone.er1,stone.er2,stone.er3,...(stone.all_themes||[])]
    .filter(Boolean)
    .map(t=>String(t).toLowerCase());
  const has=(...terms)=>terms.some(t=>themes.includes(t.toLowerCase()));
  if(has('Grounding','Stability'))return'feeling anchored and steady';
  if(has('Protection'))return'holding clearer energetic boundaries';
  if(has('Calm & Peace','Emotional Regulation'))return'settling overwhelm and finding calm';
  if(has('Heart Healing','Self-Love'))return'softening the heart and supporting self-kindness';
  if(has('Clarity & Focus'))return'clearing mental static and sharpening focus';
  if(has('Communication'))return'speaking clearly and expressing what matters';
  if(has('Intuition','Spiritual Connection'))return'tuning into inner guidance';
  if(has('Vitality'))return'restoring energy and forward momentum';
  if(has('Transformation'))return'moving through change with steadier footing';
  if(has('Manifestation','Abundance'))return'opening to opportunity with clear intention';
  if(has('Confidence'))return'building confidence and self-trust';
  if(stone.uw)return compactIntentionReason(stone.uw);
  return'supporting the selected intention';
}

function intentionContextPhrase(label){
  if(/stability|steady|structure|support/.test(label))return'creating steadier emotional ground';
  if(/ground|earthing|body|embodiment|present/.test(label))return'feeling anchored in your body';
  if(/nervous|overwhelm|anxiety|calm|sleep|rest|winding/.test(label))return'settling the nervous system';
  if(/protect|shield|boundar/.test(label))return'clearer boundaries and energetic protection';
  if(/focus|clarity|decision|overthink|mental/.test(label))return'clearing mental static';
  if(/motivation|energy|stamina|vital|momentum|start/.test(label))return'rebuilding forward momentum';
  if(/confidence|self-trust|power|fear|bold/.test(label))return'supporting self-trust';
  if(/grief|heart|self-love|compassion|forgiv|relationship/.test(label))return'softening emotional edges';
  if(/communication|truth|heard|express/.test(label))return'clearer expression';
  if(/intuition|dream|psychic|guidance|meditation|spiritual/.test(label))return'inner listening and spiritual focus';
  if(/transform|change|release|pattern|rebirth/.test(label))return'moving through change';
  if(/manifest|abundance|opportunity|receive|career|financial/.test(label))return'focusing intention toward opportunity';
  if(/creative|joy|play|optim/.test(label))return'creative spark and lighter energy';
  return'';
}

function blendIntentionPhrases(context, theme){
  if(!context)return theme;
  if(!theme || theme==='supporting the selected intention')return context;
  const cleanTheme=theme
    .replace(/^feeling /,'')
    .replace(/^holding /,'')
    .replace(/^settling /,'settling ')
    .replace(/^supporting /,'supporting ');
  if(context.toLowerCase()===cleanTheme.toLowerCase())return context;
  if(context.length+cleanTheme.length>86)return context;
  return `${context} with ${cleanTheme}`;
}

function selectedIntentionPhrase(stone){
  const label=String(selectedIntentionContextLabel()||'').toLowerCase();
  const hay=intentionFilterHaystack(stone);
  const context=intentionContextPhrase(label);
  const theme=intentionThemePhrase(stone);
  if(context)return blendIntentionPhrases(context,theme);
  if(hay.includes(label))return compactIntentionReason(stone.uw) || theme;
  return theme;
}

function normalizeUseWhenToWhy(stone){
  const compact=compactIntentionReason(stone&&stone.uw);
  if(compact&&!isGenericBlurb(compact))return compact;
  return selectedIntentionPhrase(stone);
}

function getStoneWhyText(stone, parentSlug, subSlug){
  const stoneId=stone&&stone.i;
  if(stoneId){
    const stoneMap=stoneIntentionReasonsMap[stoneId];
    if(stoneMap){
      if(subSlug&&stoneMap[subSlug])return stoneMap[subSlug];
      if(parentSlug&&stoneMap[parentSlug])return stoneMap[parentSlug];
    }
  }
  return normalizeUseWhenToWhy(stone);
}

function intentionBestForText(stone){
  if(activeIntentionMode==='ai'){
    const reason=compactIntentionReason(getIntentionCardDescription(stone, activeIntentionQuery));
    if(reason)return reason;
  }
  if(activeCuratedSlug){
    const stoneMap=stoneIntentionReasonsMap[stone&&stone.i];
    if(stoneMap&&stoneMap[activeCuratedSlug])return stoneMap[activeCuratedSlug];
  }
  const parentSlug=INTENTION_PARENT_SLUGS[activeIntentionGroup]||'';
  const subDef=(INTENTION_SUB_FILTERS[activeIntentionGroup]||[]).find(f=>f.label===activeIntentionFilter);
  const subSlug=subDef?subDef.slug:null;
  return getStoneWhyText(stone, parentSlug, subSlug);
}

function intentionTierPillHtml(c){
  const t=Number(c&&c.tier);
  const n=t===1?'Tier 1':t===2?'Tier 2':t===3?'Tier 3':(t===0&&FEATURED_STONES.some(s=>s.id===(c&&c.i)))?'Tier 1':'';
  return n?`<span class="mood-tier-pill">${n}</span>`:'';
}

function isGenericBlurb(text){
  if(!text||text.length<20)return true;
  const t=String(text).toLowerCase();
  return ['supports your intention','helps with energy','good for this goal','aligns with your needs','supports energy','helps with your','good for your intention','useful choice for'].some(g=>t.includes(g));
}

function openIntentionDetail(stoneId){
  detailReturnContext={type:'usewhen',scrollY:window.scrollY};
  openDetail(stoneId);
}

function intentionStoneCardHtml(c){
  const roles=[c.er1,c.er2].filter(Boolean).map(t=>`<span class="card-role">${escapeAttr(t)}</span>`).join('<span class="card-role-sep">·</span>');
  const encPhotos=ENCYCLOPEDIA_PHOTOS[c.i];
  const imgSrc=encPhotos?SUPABASE_ENC+encPhotos[0]:null;
  const imgZone=imgSrc
    ?`<div class="card-img-zone has-photo" onclick="event.stopPropagation();openEncLightbox('${imgSrc}','${c.n.replace(/'/g,"\\'")}',event)" title="View larger" style="cursor:zoom-in"><img src="${escapeAttr(imgSrc)}" alt="${escapeAttr(c.n)}" loading="lazy"></div>`
    :noPhotoZoneHtml(c);
  const reason=intentionBestForText(c);
  const whyHtml=reason&&(activeCuratedSlug||!isGenericBlurb(reason))?`<div class="mood-why-match"><span class="mood-why-label">Why:</span> ${escapeAttr(reason)}</div>`:'';
  const themes=(c.all_themes||[]).filter(Boolean).slice(0,3);
  const themeTagsHtml=themes.length?`<div class="mood-theme-tags">${themes.map(t=>`<span class="mood-theme-tag">${escapeAttr(t)}</span>`).join('')}</div>`:'';
  return `<div class="crystal-card mood-result-card" onclick="openIntentionDetail('${c.i}')" style="cursor:pointer">${imgZone}<div class="card-body"><div class="mood-card-header"><div class="card-name">${escapeAttr(c.n)}</div></div>${roles?`<div class="mood-card-tags">${roles}</div>`:''}${whyHtml}${themeTagsHtml}</div></div>`;
}

function renderAIResults(matches, query){
  const errEl=document.getElementById('ai-search-error');
  if(errEl){
    errEl.classList.remove('ai-error--gentle');
    errEl.style.display='none';
  }
  const oldWrap=document.getElementById('ai-results-wrap');
  if(oldWrap)oldWrap.style.display='none';
  clearMoodResults();
  document.querySelectorAll('#intention-grid .intention-card').forEach(c=>c.classList.remove('active'));
  activeIntentionScoreMap={};
  matches.forEach((m,idx)=>{
    const c=CRYSTALS.find(s=>s.i===m.id) || CRYSTALS.find(s=>s.n===m.name);
    if(c)activeIntentionScoreMap[c.i]=(matches.length-idx)*10;
  });
  const stones=filterIntentionTier(matches.map(m=>CRYSTALS.find(s=>s.i===m.id) || CRYSTALS.find(s=>s.n===m.name)).filter(Boolean));
  activeIntentionMode='ai';
  activeIntentionQuery=query;
  activeIntentionGroup=null;
  activeIntentionFilter='all';
  activeIntentionVisibleCount=intentionPageSize();
  activeIntentionBaseMatches=sortIntentionMatches(stones,{});
  activeIntentionMatches=activeIntentionBaseMatches;
  activeIntentionFilterDefs=buildAiSubFilters(stones);
  const moodGrid=document.getElementById('mood-grid');
  if(moodGrid)moodGrid.style.display='none';
  const rb=document.getElementById('mood-reset-bar');
  if(rb)rb.style.display='';
  const groupEl=document.getElementById('mood-selected-group');
  const labelEl=document.getElementById('mood-selected-label');
  const subEl=document.getElementById('mood-selected-sub');
  if(groupEl)groupEl.textContent='AI search';
  if(labelEl)labelEl.textContent='Showing stones for: “'+query+'”';
  if(subEl)subEl.textContent='Matched from your words and the stone profiles.';
  const selectedClear=document.querySelector('#mood-selected-card .mood-selected-clear');
  if(selectedClear)selectedClear.textContent='← Try different words';
  buildSharedSubFilters(activeIntentionFilterDefs);
  const gridBanner=document.getElementById('mood-grid-banner');
  if(gridBanner)gridBanner.style.display='none';
  const selectedView=document.getElementById('mood-selected-view');
  if(selectedView)selectedView.style.display='block';
  updateIntentionCount();
  renderIntentionStoneCards();
  const top = selectedView ? selectedView.getBoundingClientRect().top + window.scrollY - 120 : 0;
  window.scrollTo({top:Math.max(0,top), behavior:'smooth'});
}

function clearAIResults(){
  const wrap=document.getElementById('ai-results-wrap');
  if(wrap)wrap.style.display='none';
  const input=document.getElementById('ai-search-input');
  if(input){input.value='';input.focus();}
  clearMoodResults();
  const errEl=document.getElementById('ai-search-error');
  if(errEl){
    errEl.classList.remove('ai-error--gentle');
    errEl.style.display='none';
  }
}
// ─────────────────────────────────────────────────────────────────────────────

function handleIntentionResultsChange(){
  if(activeIntentionMode==='ai'){
    clearAIResults();
    const input=document.getElementById('ai-search-input');
    if(input){
      const y=input.getBoundingClientRect().top+window.scrollY-145;
      window.scrollTo({top:Math.max(0,y),behavior:'smooth'});
      setTimeout(()=>input.focus(),150);
    }
    return;
  }
  clearMoodResults();
}

function clearMoodResults(){
  const grid=document.getElementById('mood-grid');
  if(grid)grid.style.display='';
  const rb=document.getElementById('mood-reset-bar');
  if(rb)rb.style.display='';
  const sv=document.getElementById('mood-selected-view');
  if(sv)sv.style.display='none';
  const oldAi=document.getElementById('ai-results-wrap');
  if(oldAi)oldAi.style.display='none';
  const loadMore=document.getElementById('mood-load-more');
  if(loadMore){loadMore.style.display='none';loadMore.innerHTML='';}
  const tier4Row=document.getElementById('mood-tier4-row');
  if(tier4Row)tier4Row.style.display='none';
  const tier4Check=document.getElementById('mood-tier4-check');
  if(tier4Check)tier4Check.checked=false;
  intentionIncludeTier4=false;
  const titleEl=document.getElementById('mood-shared-results-title');
  if(titleEl)titleEl.textContent='';
  const selectedClear=document.querySelector('#mood-selected-card .mood-selected-clear');
  if(selectedClear)selectedClear.textContent='← Change';
  document.querySelectorAll('.mood-card').forEach(c=>c.classList.remove('active-mood'));
  activeMoodIdx=null;activeSubFilter=null;activeCuratedSlug=null;
  activeIntentionMode=null;activeIntentionQuery='';activeIntentionGroup=null;activeIntentionFilter='all';activeIntentionFilterDefs=[];activeIntentionBaseMatches=[];activeIntentionMatches=[];activeIntentionVisibleCount=intentionPageSize();
}

function resetUseWhen(){
  const grid=document.getElementById('mood-grid');
  if(grid)grid.style.display='none';
  const rb=document.getElementById('mood-reset-bar');
  if(rb)rb.style.display='none';
  const sv=document.getElementById('mood-selected-view');
  if(sv)sv.style.display='none';
  const oldAi=document.getElementById('ai-results-wrap');
  if(oldAi)oldAi.style.display='none';
  const loadMore=document.getElementById('mood-load-more');
  if(loadMore){loadMore.style.display='none';loadMore.innerHTML='';}
  const titleEl=document.getElementById('mood-shared-results-title');
  if(titleEl)titleEl.textContent='';
  document.querySelectorAll('#intention-grid .intention-card').forEach(c=>c.classList.remove('active'));
  document.querySelectorAll('.mood-card').forEach(c=>c.classList.remove('active-mood'));
  activeMoodIdx=null;activeSubFilter=null;
  activeIntentionMode=null;activeIntentionQuery='';activeIntentionGroup=null;activeIntentionFilter='all';activeIntentionFilterDefs=[];activeIntentionBaseMatches=[];activeIntentionMatches=[];activeIntentionVisibleCount=intentionPageSize();
}

