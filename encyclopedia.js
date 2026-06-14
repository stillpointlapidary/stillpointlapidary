// ── FILTER PANELS ──
function buildEncPanels(){
  const famOpts=FAM_OPTS.filter(f=>CRYSTALS.some(c=>c.fam===f||c.sp===f));
  buildPanel('pills-fam','fam',famOpts.map(f=>({val:f,label:f})));
  buildThemedPanel('pills-theme','theme');
  buildColorPanel();
  buildPanel('pills-chakra','chakra',CHAKRA_OPTS.map(c=>({val:c,label:c})));
  buildPanel('pills-mohs','mohs',[
    {val:'soft',label:'Soft (1–4)'},
    {val:'medium',label:'Medium (5–6)'},
    {val:'hard',label:'Hard (7+)'},
  ]);
  buildPanel('pills-formation','formation',[
    {val:'Igneous',label:'Igneous'},
    {val:'Metamorphic',label:'Metamorphic'},
    {val:'Sedimentary',label:'Sedimentary'},
    {val:'Hydrothermal',label:'Hydrothermal'},
    {val:'Secondary',label:'Secondary'},
    {val:'Extraterrestrial',label:'Extraterrestrial'},
    {val:'Biological',label:'Biological'},
  ]);
  buildPanel('pills-material','material',[
    {val:'Mineral',label:'Mineral'},
    {val:'Mineraloid',label:'Mineraloid'},
    {val:'Aggregate',label:'Aggregate'},
    {val:'Organic',label:'Organic'},
    {val:'Fossil',label:'Fossil'},
    {val:'Synthetic',label:'Synthetic'},
  ]);
  buildPanel('pills-tier','tier',[
    {val:'1',label:'Essentials'},
    {val:'2',label:'Shelf Builders'},
    {val:'3',label:'Collector Favorites'},
    {val:'4',label:'Rare Finds'},
  ]);
}

function buildPanel(containerId,filterKey,items){
  const wrap=document.getElementById(containerId);
  if(!wrap)return;
  wrap.innerHTML=`<button class="fpill active" onclick="setFilter('${filterKey}','all',this)">All</button>`+
    items.map(it=>`<button class="fpill" onclick="setFilter('${filterKey}','${it.val}',this)">${it.label}</button>`).join('');
}

function buildThemedPanel(containerId,filterKey){
  const wrap=document.getElementById(containerId);
  if(!wrap)return;
  let html=`<button class="fpill active" onclick="setFilter('${filterKey}','all',this)">All</button>`;
  THEME_GROUPS.forEach(g=>{
    html+=`<div class="theme-group-label">${g.label}</div>`;
    html+=g.themes.map(t=>`<button class="fpill" onclick="setFilter('${filterKey}','${t}',this)">${t}</button>`).join('');
  });
  wrap.innerHTML=html;
}

function buildColorPanel(){
  const wrap=document.getElementById('pills-color');
  if(!wrap)return;
  wrap.innerHTML=`<button class="fpill active" onclick="setFilter('color','all',this)">All</button>`+
    COLOR_OPTS.map(c=>`<button class="fpill" onclick="setFilter('color','${c.val}',this)"><span class="cswatch" style="background:${c.hex}"></span>${c.val}</button>`).join('');
}

function buildCollColorPanel(){
  const wrap=document.getElementById('cpills-ccolor');
  if(!wrap)return;
  wrap.innerHTML=`<button class="fpill active" onclick="setCollFilter('ccolor','all',this)">All</button>`+
    COLOR_OPTS.map(c=>`<button class="fpill" onclick="setCollFilter('ccolor',${jsArg(c.val)},this)"><span class="cswatch" style="background:${c.hex}"></span>${escapeAttr(c.val)}</button>`).join('');
}
function collectionStoneMatchesMohs(c,val){
  if(val==='all')return true;
  const raw=String(c?.m||'').match(/[0-9.]+/g);
  if(!raw||!raw.length)return false;
  const nums=raw.map(Number).filter(n=>Number.isFinite(n));
  const max=Math.max(...nums);
  if(val==='soft')return max<=4;
  if(val==='medium')return max>=5&&max<=6;
  if(val==='hard')return max>=7;
  return true;
}
function collectionStoneMatchesTheme(c,val){
  if(val==='all')return true;
  return (c?.primary_theme===val)||((c?.all_themes||[]).includes(val));
}
function collectionStoneMatchesColor(c,val){
  if(val==='all')return true;
  return c?.col_cat===val||((c?.col_cats||[]).includes(val));
}
function collectionStoneMatchesChakra(c,val){
  if(val==='all')return true;
  return (c?.chakras||[]).includes(val);
}
function collectionStoneMatchesMaterial(c,val){
  if(val==='all')return true;
  return c?.mt===val;
}
function collectionStoneMatchesFormation(c,val){
  if(val==='all')return true;
  return c?.fo===val;
}
function passesCollStoneFilters(c){
  return !!c &&
    (collFilters.cfam==='all'||c.fam===collFilters.cfam||c.sp===collFilters.cfam)&&
    collectionStoneMatchesTheme(c,collFilters.ctheme)&&
    collectionStoneMatchesColor(c,collFilters.ccolor)&&
    collectionStoneMatchesChakra(c,collFilters.cchakra)&&
    collectionStoneMatchesMohs(c,collFilters.cmohs)&&
    collectionStoneMatchesFormation(c,collFilters.cformation)&&
    collectionStoneMatchesMaterial(c,collFilters.cmaterial);
}
function passesCollPieceFilters(p){
  const loc=p.shelf||p.locCustom||'';
  return (collFilters.form==='all'||p.form===collFilters.form)&&
    (collFilters.size==='all'||p.size===collFilters.size)&&
    (collFilters.cshelf==='all'||loc.includes(collFilters.cshelf));
}
function buildCollPanels(){
  const forms=['Tumble','Palm Stone','Worry Stone','Heart','Sphere','Egg','Tower','Pyramid','Cube','Freeform','Flame','Bowl / Dish','Raw / Natural','Specimen','Point','Cluster','Geode','Druzy','Slice / Slab','Moon','Star','Mushroom','Wand','Carving','Other'];
  const sizes=['XS','S','M','L','XL'];
  const cfams=[...new Set(CRYSTALS.map(c=>c.fam||'').filter(Boolean))].sort();
  const materials=[...new Set(CRYSTALS.map(c=>c.mt||'').filter(Boolean))].sort();
  const formations=[...new Set(CRYSTALS.map(c=>c.fo||'').filter(Boolean))].sort();
  const cf=document.getElementById('cpills-form');
  const cs=document.getElementById('cpills-size');
  const cc=document.getElementById('cpills-cfam');
  const ct=document.getElementById('cpills-ctheme');
  const cch=document.getElementById('cpills-cchakra');
  const cm=document.getElementById('cpills-cmohs');
  const cfo=document.getElementById('cpills-cformation');
  const cmt=document.getElementById('cpills-cmaterial');
  if(cc)cc.innerHTML=`<button class="fpill active" onclick="setCollFilter('cfam','all',this)">All</button>`+cfams.map(f=>`<button class="fpill" onclick="setCollFilter('cfam',${jsArg(f)},this)">${escapeAttr(f)}</button>`).join('');
  if(ct)ct.innerHTML=`<button class="fpill active" onclick="setCollFilter('ctheme','all',this)">All</button>`+THEME_OPTS.map(t=>`<button class="fpill" onclick="setCollFilter('ctheme',${jsArg(t)},this)">${escapeAttr(t)}</button>`).join('');
  buildCollColorPanel();
  if(cch)cch.innerHTML=`<button class="fpill active" onclick="setCollFilter('cchakra','all',this)">All</button>`+CHAKRA_OPTS.map(ch=>`<button class="fpill" onclick="setCollFilter('cchakra',${jsArg(ch)},this)">${escapeAttr(ch)}</button>`).join('');
  if(cm)cm.innerHTML=`<button class="fpill active" onclick="setCollFilter('cmohs','all',this)">All</button>`+[
    {val:'soft',label:'Soft (1–4)'},{val:'medium',label:'Medium (5–6)'},{val:'hard',label:'Hard (7+)'}
  ].map(x=>`<button class="fpill" data-value="${x.val}" onclick="setCollFilter('cmohs','${x.val}',this)">${x.label}</button>`).join('');
  if(cfo)cfo.innerHTML=`<button class="fpill active" onclick="setCollFilter('cformation','all',this)">All</button>`+formations.map(f=>`<button class="fpill" onclick="setCollFilter('cformation',${jsArg(f)},this)">${escapeAttr(f)}</button>`).join('');
  if(cmt)cmt.innerHTML=`<button class="fpill active" onclick="setCollFilter('cmaterial','all',this)">All</button>`+materials.map(m=>`<button class="fpill" onclick="setCollFilter('cmaterial',${jsArg(m)},this)">${escapeAttr(m)}</button>`).join('');
  if(cf)cf.innerHTML=`<button class="fpill active" onclick="setCollFilter('form','all',this)">All</button>`+forms.map(f=>`<button class="fpill" onclick="setCollFilter('form',${jsArg(f)},this)">${escapeAttr(f)}</button>`).join('');
  if(cs)cs.innerHTML=`<button class="fpill active" onclick="setCollFilter('size','all',this)">All</button>`+sizes.map(sz=>`<button class="fpill" onclick="setCollFilter('size',${jsArg(sz)},this)">${escapeAttr(sz)}</button>`).join('');
  const usedShelves=[...new Set(collection.map(p=>p.shelf||p.locCustom||'').filter(Boolean))].sort();
  const shelfOpts=usedShelves.length?usedShelves:['Shelf 1','Shelf 2','Shelf 3','Shelf 4','Altar','Bedside','Cabinet','Office desk'];
  const csh=document.getElementById('cpills-cshelf');
  if(csh)csh.innerHTML=`<button class="fpill active" onclick="setCollFilter('cshelf','all',this)">All</button>`+shelfOpts.map(sh=>`<button class="fpill" onclick="setCollFilter('cshelf',${jsArg(sh)},this)">${escapeAttr(sh)}</button>`).join('');
  ['cfam','ctheme','ccolor','cchakra','cmohs','cformation','cmaterial','form','size','cshelf'].forEach(k=>{
    const val=collFilters[k]||'all';
    document.querySelectorAll('#cpills-'+k+' .fpill').forEach(p=>p.classList.toggle('active', p.textContent.trim()===String(val) || (val==='all'&&p.textContent.trim()==='All')));
    updateBtn('cfbtn-'+k,'cfval-'+k,val);
  });
}
function togglePanel(key,e){
  if(e)e.stopPropagation();
  const panel=document.getElementById('panel-'+key);
  const btn=document.getElementById('fbtn-'+key);
  if(!panel||!btn)return;
  if(isMobileView())dismissEncDoorway();
  if(openPanel===key){panel.classList.remove('open');btn.classList.remove('open');openPanel=null;}
  else{closeAllPanels();panel.classList.add('open');btn.classList.add('open');openPanel=key;}
  if(isMobileView())setTimeout(()=>encScrollToSearchArea(false),20);
}

function toggleCollPanel(key,e){
  if(e)e.stopPropagation();
  const panel=document.getElementById('cpanel-'+key);
  const btn=document.getElementById('cfbtn-'+key);
  if(!panel||!btn)return;
  const pkey='c'+key;
  if(openPanel===pkey){panel.classList.remove('open');btn.classList.remove('open');openPanel=null;}
  else{closeAllPanels();panel.classList.add('open');btn.classList.add('open');openPanel=pkey;}
}

function closeAllPanels(){
  document.querySelectorAll('.filter-panel').forEach(p=>p.classList.remove('open'));
  document.querySelectorAll('.filter-cat-btn').forEach(b=>b.classList.remove('open'));
  openPanel=null;
}

function handleOutsideClick(e){
  if(!e.target.closest('.filter-cat-btn')&&!e.target.closest('.filter-panel'))closeAllPanels();
}

function updateBtn(btnId,valId,val){
  const btn=document.getElementById(btnId);
  const valEl=document.getElementById(valId);
  if(btn)btn.classList.toggle('has-val',val!=='all');
  if(valEl)valEl.textContent=val==='all'?'':String(val);
  updateMoreFilterButtons();
}

function isMobileView(){
  return window.matchMedia&&window.matchMedia('(max-width: 600px)').matches;
}

function encSearchValue(){
  const desktop=document.getElementById('enc-search');
  const mobile=document.getElementById('enc-mobile-search');
  const primary=isMobileView()?mobile:desktop;
  const fallback=isMobileView()?desktop:mobile;
  return (primary?.value || fallback?.value || '').trim();
}

function syncEncSearch(source){
  const desktop=document.getElementById('enc-search');
  const mobile=document.getElementById('enc-mobile-search');
  const val=(source==='mobile'?mobile:desktop)?.value || '';
  if(source==='mobile'&&desktop)desktop.value=val;
  if(source==='desktop'&&mobile)mobile.value=val;
  if(isMobileView())dismissEncDoorway();
  encRender();
  if(isMobileView())encScrollToSearchArea(false);
}

function encScrollToSearchArea(smooth=true){
  const target=document.getElementById('enc-search-results-panel')||document.getElementById('enc-filter-cats');
  if(!target)return;
  const y=target.getBoundingClientRect().top+window.scrollY-118;
  try{window.scrollTo({top:Math.max(0,y),left:0,behavior:smooth?'smooth':'auto'});}catch(e){window.scrollTo(0,Math.max(0,y));}
}

function encEnterSearchMode(scroll=true){
  dismissEncDoorway();
  encRender();
  if(scroll!==false)setTimeout(()=>encScrollToSearchArea(true),40);
}


function encLandingSearchFocus(){
  if(!isMobileView())return;
  encEnterSearchMode(true);
  setTimeout(()=>document.getElementById('enc-mobile-search')?.focus(),80);
}

function renderEncActiveFilters(){
  const row=document.getElementById('enc-active-filter-row');
  if(!row)return;
  const chips=[];
  const names={fam:'Family',theme:'Theme',color:'Color',chakra:'Chakra',tier:'Tier',mohs:'Hardness',formation:'Formation',material:'Material'};
  Object.keys(filters).forEach(k=>{
    if(filters[k]&&filters[k]!=='all')chips.push(`<button class="enc-active-chip" type="button" onclick="clearEncFilter('${k}')">${names[k]||k}: ${escapeAttr(filters[k])} ×</button>`);
  });
  const q=encSearchValue();
  if(q)chips.push(`<button class="enc-active-chip" type="button" onclick="clearEncSearch()">Search: ${escapeAttr(q)} ×</button>`);
  row.innerHTML=chips.length?`<span class="enc-active-label">Active filters</span>${chips.join('')}<button class="enc-clear-all" type="button" onclick="clearEncAllFilters()">Clear All</button>`:'';
}

function clearEncFilter(key){
  filters[key]='all';
  document.querySelectorAll('#pills-'+key+' .fpill').forEach((p,i)=>p.classList.toggle('active',i===0));
  updateBtn('fbtn-'+key,'fval-'+key,'all');
  closeAllPanels();
  encRender();
  if(isMobileView())encScrollToSearchArea(true);
}

function clearEncSearch(){
  const desktop=document.getElementById('enc-search');
  const mobile=document.getElementById('enc-mobile-search');
  if(desktop)desktop.value='';
  if(mobile)mobile.value='';
  encRender();
  if(isMobileView())encScrollToSearchArea(true);
}

function clearEncAllFilters(){
  filters={fam:'all',theme:'all',color:'all',chakra:'all',mohs:'all',formation:'all',material:'all',tier:'all'};
  const desktop=document.getElementById('enc-search');
  const mobile=document.getElementById('enc-mobile-search');
  if(desktop)desktop.value='';
  if(mobile)mobile.value='';
  ['fam','theme','color','chakra','mohs','formation','material','tier'].forEach(k=>{
    document.querySelectorAll('#pills-'+k+' .fpill').forEach((p,i)=>p.classList.toggle('active',i===0));
    updateBtn('fbtn-'+k,'fval-'+k,'all');
  });
  closeAllPanels();
  encEnterSearchMode(false);
  if(isMobileView())encScrollToSearchArea(true);
}

function updateMoreFilterButtons(){
  const encMore=document.getElementById('fbtn-more');
  if(encMore){
    encMore.classList.toggle('has-val',['mohs','formation','material'].some(k=>filters&&filters[k]&&filters[k]!=='all'));
  }
  const collMore=document.getElementById('cfbtn-more');
  if(collMore){
    collMore.classList.toggle('has-val',['cmohs','cformation','cmaterial'].some(k=>collFilters&&collFilters[k]&&collFilters[k]!=='all'));
  }
}

function setFilter(key,val,btn){
  filters[key]=val;
  document.querySelectorAll('#pills-'+key+' .fpill').forEach(p=>p.classList.remove('active'));
  if(btn)btn.classList.add('active');
  updateBtn('fbtn-'+key,'fval-'+key,val);
  closeAllPanels();
  encRender();
  if(isMobileView())encScrollToSearchArea(false);
}

function setCollFilter(key,val,btn){
  collFilters[key]=val;
  document.querySelectorAll('#cpills-'+key+' .fpill').forEach(p=>p.classList.remove('active'));
  if(btn)btn.classList.add('active');
  updateBtn('cfbtn-'+key,'cfval-'+key,val);
  closeAllPanels();
  renderCollection();
}

function initCollectionFilterDelegation(){
  const shell=document.getElementById('collection-filter-shell')||document.querySelector('#tab-collection [style*="position:relative"]');
  if(!shell||shell.dataset.filterDelegated==='1')return;
  shell.dataset.filterDelegated='1';
  shell.addEventListener('click',function(e){
    const pill=e.target.closest('.filter-panel .fpill');
    if(!pill)return;
    const panel=pill.closest('.filter-panel');
    if(!panel||!panel.id||!panel.id.startsWith('cpanel-'))return;
    e.preventDefault();
    e.stopPropagation();
    const key=panel.id.replace('cpanel-','');
    const raw=pill.getAttribute('data-value')||pill.textContent.trim();
    const val=(raw==='All')?'all':raw;
    setCollFilter(key,val,pill);
  });
}

function resetFilters(){
  filters={fam:'all',theme:'all',color:'all',chakra:'all',mohs:'all',formation:'all',material:'all',tier:'all'};
  const s=document.getElementById('enc-search');
  if(s)s.value='';
  const ms=document.getElementById('enc-mobile-search');
  if(ms)ms.value='';
  ['fam','theme','color','chakra','mohs','formation','material','tier'].forEach(k=>{
    document.querySelectorAll('#pills-'+k+' .fpill').forEach((p,i)=>p.classList.toggle('active',i===0));
    updateBtn('fbtn-'+k,'fval-'+k,'all');
  });
  restoreEncLanding();
  encRender();
}

function resetCollFilters(){
  collFilters={cfam:'all',ctheme:'all',ccolor:'all',cchakra:'all',cmohs:'all',cformation:'all',cmaterial:'all',form:'all',size:'all',cshelf:'all'};
  ['cfam','ctheme','ccolor','cchakra','cmohs','cformation','cmaterial','form','size','cshelf'].forEach(k=>{
    document.querySelectorAll('#cpills-'+k+' .fpill').forEach((p,i)=>p.classList.toggle('active',i===0));
    document.querySelectorAll('#coll-fspills-'+k+' .fpill').forEach((p,i)=>p.classList.toggle('active',i===0));
    updateBtn('cfbtn-'+k,'cfval-'+k,'all');
  });
  updateMobileFilterValues();
  renderCollection();
}

// ── ENCYCLOPEDIA ──
function encSort(v){sortBy=v;encRender();}

function getFiltered(){
  const q=encSearchValue().toLowerCase();
  return CRYSTALS.filter(c=>{
    const famOk=filters.fam==='all'||c.fam===filters.fam||c.sp===filters.fam;
    const themeOk=filters.theme==='all'||
      (c.all_themes&&c.all_themes.some(t=>t.toLowerCase().includes(filters.theme.toLowerCase())))||
      [c.er1,c.er2,c.er3].some(v=>v&&v.toLowerCase().includes(filters.theme.toLowerCase()));
    const colorOk=filters.color==='all'||(c.col_cats&&c.col_cats.includes(filters.color));
    const chakraOk=filters.chakra==='all'||(c.chakras&&(c.chakras.includes(filters.chakra)||c.chakras.includes('All')));
    const mohsVal=parseFloat(c.m)||0;
    const mohsOk=filters.mohs==='all'||
      (filters.mohs==='soft'&&mohsVal<=4)||
      (filters.mohs==='medium'&&mohsVal>=5&&mohsVal<=6.5)||
      (filters.mohs==='hard'&&mohsVal>=7);
    const formOk=filters.formation==='all'||(c.fo&&c.fo.toLowerCase().includes(filters.formation.toLowerCase()));
    const matOk=filters.material==='all'||(c.mt&&c.mt.toLowerCase().includes(filters.material.toLowerCase()));
    const tierOk=filters.tier==='all'||String(c.tier)===filters.tier;
    const searchOk=!q||[c.n,c.a,c.er1,c.er2,c.er3,c.uw,c.c,c.g,c.fam].some(v=>v&&v.toLowerCase().includes(q));
    return famOk&&themeOk&&colorOk&&chakraOk&&mohsOk&&formOk&&matOk&&tierOk&&searchOk;
  }).sort((a,b)=>{
    if(sortBy==='tier')return (a.tier||99)-(b.tier||99)||a.n.localeCompare(b.n);
    if(sortBy==='name')return a.n.localeCompare(b.n);
    if(sortBy==='mohs')return parseFloat(a.m||0)-parseFloat(b.m||0);
    if(sortBy==='family')return(a.fam+a.n).localeCompare(b.fam+b.n);
    return a.i.localeCompare(b.i);
  });
}


function colorDotsHtml(c){
  const hexMap=COLOR_HEX_MAP;
  const cats=(c.col_cats&&c.col_cats.length>0)?c.col_cats:[];
  if(cats.length>1){
    const cols=cats.slice(0,4).map(x=>hexMap[x]||c.ch||'#aaa');
    const pct=100/cols.length;
    const stops=cols.map((col,i)=>`${col} ${i*pct}% ${(i+1)*pct}%`).join(', ');
    return`<span class="color-dot" style="background:conic-gradient(${stops});margin-right:2px" title="${cats.join(', ')}"></span>`;
  }
  const col=hexMap[cats[0]]||c.ch||'#aaa';
  return`<span class="color-dot" style="background:${col};margin-right:2px"></span>`;
}


function hexToWash(hex){
  try{
    const h=hex.replace('#','');
    const r=parseInt(h.slice(0,2),16),g=parseInt(h.slice(2,4),16),b=parseInt(h.slice(4,6),16);
    const mix=(v)=>Math.round(v+(245-v)*0.78);
    return`rgb(${mix(r)},${mix(g)},${mix(b)})`;
  }catch(e){return'#f0ece6';}
}
function stripInlineCardColor(html){
  return String(html||'').replace(/<div class="card-color">[\s\S]*?<\/div>/,'');
}

function firstCollectionPhoto(p){
  const photos=(p&&p.photos)||[];
  const first=photos.length?photos[0]:null;
  return collectionPhotoUrl(first);
}
function isReferencePhotoUrl(src,c){
  if(!src)return false;
  const ref=firstEncyclopediaPhoto(c);
  return (!!ref&&src===ref)||String(src).includes('/stone-images/encyclopedia/');
}
function uniquePhotoSources(sources){
  const seen=new Set();
  return (sources||[]).filter(src=>{
    if(!src||seen.has(src))return false;
    seen.add(src);
    return true;
  });
}
function collCardPhotoNav(btn,dir,event){
  if(event)event.stopPropagation();
  const wrap=btn.closest('.coll-card-photo-wrap');
  if(!wrap)return;
  let sources=[];
  try{sources=JSON.parse(wrap.dataset.sources||'[]');}catch(e){}
  if(!sources.length)return;
  let idx=parseInt(wrap.dataset.photoIndex||'0',10);
  idx=(idx+dir+sources.length)%sources.length;
  wrap.dataset.photoIndex=String(idx);
  const img=wrap.querySelector('img');
  if(img)img.src=sources[idx];
}
function getCardPhotoIndex(el){
  const wrap=el&&el.closest?el.closest('.coll-card-photo-wrap'):el;
  const idx=parseInt(wrap?.dataset?.photoIndex||'0',10);
  return Number.isFinite(idx)?idx:0;
}
function collectionCardPhotoHtml(p,c,name,idx){
  const ownPhotos=uniquePhotoSources(allCollectionPhotos(p));
  const refPhoto=firstEncyclopediaPhoto(c);
  const sources=ownPhotos.length?ownPhotos:(refPhoto?[refPhoto]:[]);
  if(sources.length){
    const isRef=!ownPhotos.length&&!!refPhoto;
    const badge=isRef?'<span class="reference-image-badge">Reference image</span>':'';
    const refAlt=isRef&&c&&c.n?`${c.n} reference image`:name;
    const nav=sources.length>1?`<button class="coll-card-photo-nav prev" onclick="collCardPhotoNav(this,-1,event)" aria-label="Previous photo">‹</button><button class="coll-card-photo-nav next" onclick="collCardPhotoNav(this,1,event)" aria-label="Next photo">›</button>`:'';
    return`<div class="coll-card-photo-wrap zoomable" data-photo-index="0" data-sources='${escapeAttr(JSON.stringify(sources))}' onclick="openCollectionPhotoLightbox(${idx},getCardPhotoIndex(this),event)" title="Enlarge ${isRef?'image':'photo'}"><img class="coll-card-photo" src="${escapeAttr(sources[0])}" alt="${escapeAttr(refAlt)}" loading="lazy">${nav}${badge}</div>`;
  }
  return`<div class="coll-card-nophoto"><span>No photo</span></div>`;
}
let collFamilyPhotoSources={};
let collFamilyPhotoLabels={};
function familyPhotoItems(entries){
  const seen=new Set();
  const items=[];
  (entries||[]).forEach(entry=>{
    const label=(entry.crystal&&entry.crystal.n)||collPieceName(entry.piece,entry.crystal)||'Collection photo';
    collectionPhotoSources(entry.piece,entry.crystal).forEach(src=>{
      if(!src||seen.has(src))return;
      seen.add(src);
      items.push({src,label});
    });
  });
  return items;
}
function familyPhotoSources(entries){
  return familyPhotoItems(entries).map(item=>item.src);
}
function familyCardPhotoHtml(fam,entries){
  const items=familyPhotoItems(entries);
  const sources=items.map(item=>item.src);
  collFamilyPhotoSources[fam]=sources;
  collFamilyPhotoLabels[fam]=items.map(item=>item.label);
  if(!sources.length)return`<div class="coll-card-nophoto"><span>No photo</span></div>`;
  const key=encodeURIComponent(fam);
  const nav=sources.length>1?`<button class="coll-card-photo-nav prev" onclick="collCardPhotoNav(this,-1,event)" aria-label="Previous photo">‹</button><button class="coll-card-photo-nav next" onclick="collCardPhotoNav(this,1,event)" aria-label="Next photo">›</button>`:'';
  return`<div class="coll-card-photo-wrap zoomable" data-photo-index="0" data-sources='${escapeAttr(JSON.stringify(sources))}' onclick="openFamilyPhotoLightbox('${key}',getCardPhotoIndex(this),event)" title="Enlarge family images"><img class="coll-card-photo" src="${escapeAttr(sources[0])}" alt="${escapeAttr(fam)} collection images" loading="lazy">${nav}</div>`;
}
function openFamilyPhotoLightbox(encodedFam,startIndex,event){
  if(event)event.stopPropagation();
  const fam=decodeURIComponent(encodedFam||'');
  const sources=collFamilyPhotoSources[fam]||[];
  if(!sources.length)return;
  const lb=document.getElementById('photo-lightbox');
  if(!lb)return;
  photoLightboxSources=sources;
  photoLightboxIndex=Math.max(0,Math.min(startIndex||0,sources.length-1));
  photoLightboxLabels=collFamilyPhotoLabels[fam]||null;
  photoLightboxAlt=(photoLightboxLabels&&photoLightboxLabels[photoLightboxIndex])||fam;
  setPhotoLightboxImage();
  lb.classList.toggle('has-nav',photoLightboxSources.length>1);
  lb.classList.add('open');
  document.body.style.overflow='hidden';
}
function wishlistCardPhotoHtml(c){
  const refPhoto=firstEncyclopediaPhoto(c);
  if(refPhoto){
    const refAlt=c&&c.n?`${c.n} reference image`:'Wishlist reference image';
    return`<div class="coll-card-photo-wrap"><img class="coll-card-photo" src="${escapeAttr(refPhoto)}" alt="${escapeAttr(refAlt)}" loading="lazy"></div>`;
  }
  return`<div class="coll-card-nophoto" style="background:var(--stone2)"><span style="font-size:18px">♡</span></div>`;
}

function collectionPieceSignature(p){
  if(!p)return'';
  const photoCount=(p.photos&&p.photos.length)||0;
  const combos=(p.comboCrystals||[]).slice().sort().join('|');
  return [
    p.crystalId||'',
    p.isCombo?'combo':'single',
    combos,
    p.nickname||'',
    p.form||'',
    p.size||'',
    p.treated||'',
    p.condition||'',
    p.locCustom||'',
    p.shelf||'',
    p.tier||'',
    p.pos||'',
    p.acquired||'',
    p.source||'',
    p.price||'',
    p.notes||'',
    photoCount
  ].map(v=>String(v).trim().toLowerCase()).join('::');
}
function dedupedCollectionItems(list){
  const seen=new Set();
  const out=[];
  (list||[]).forEach(p=>{
    const sig=collectionPieceSignature(p);
    if(!sig||seen.has(sig))return;
    seen.add(sig);
    out.push(p);
  });
  return out;
}

function encCardHtml(c){
  const isOwned=!!owned[c.i], isWish=!!wish[c.i];
  const badge=isOwned?'<span class="card-badge badge-owned"></span>':(isWish?'<span class="card-badge badge-wish"></span>':'');
  const props=(c.card_props&&c.card_props.length?c.card_props:[c.er1,c.er2,c.er3]).filter(Boolean).slice(0,3);
  const pillsHtml=props.length?`<div class="stone-card-properties">${props.map(t=>`<span class="card-role">${t}</span>`).join('')}</div>`:'';
  const bestForHtml=c.card_best_for?`<div class="stone-card-best-for"><span class="stone-card-best-for-label">BEST FOR</span><p>${c.card_best_for}</p></div>`:'';
  const encPhotos=ENCYCLOPEDIA_PHOTOS[c.i];
  const imgSrc=encPhotos?SUPABASE_ENC+encPhotos[0]:null;
  const imgZone=imgSrc
    ?`<div class="card-img-zone has-photo" onclick="openEncLightbox('${imgSrc}','${c.n.replace(/'/g,"\\'")}',event)" title="View larger" style="cursor:zoom-in"><img src="${imgSrc}" alt="${c.n}" loading="lazy"></div>`
    :`<div onclick="openDetail('${c.i}')">${noPhotoZoneHtml(c)}</div>`;
  return`<div class="crystal-card">${badge}${imgZone}<div class="card-body" onclick="openDetail('${c.i}')" style="cursor:pointer"><div class="card-name">${c.n}</div>${pillsHtml}${bestForHtml}</div></div>`;
}

const pagedStoneLists={};

function ensureStoneListLoadMore(container,id){
  if(!container)return null;
  let wrap=document.getElementById(id);
  if(!wrap){
    wrap=document.createElement('div');
    wrap.id=id;
    wrap.className='stone-list-load-more';
    container.after(wrap);
  }
  return wrap;
}

function renderPagedStoneList({stones,container,stateKey,renderCard,loadMoreContainer,batchSize=RESULT_BATCH_SIZE}){
  if(!container)return;
  const list=stones||[];
  const existing=pagedStoneLists[stateKey];
  const visible=existing&&existing.list===list?existing.visible:batchSize;
  pagedStoneLists[stateKey]={list,container,stateKey,renderCard,loadMoreContainer,batchSize,visible};
  const shown=list.slice(0,visible);
  container.innerHTML=shown.map(renderCard).join('');
  updatePagedStoneLoadMore(stateKey);
}

function updatePagedStoneLoadMore(stateKey){
  const state=pagedStoneLists[stateKey];
  if(!state)return;
  const actual=Math.min(state.visible,state.list.length);
  const remaining=state.list.length-actual;
  let wrap=state.loadMoreContainer;
  if(typeof wrap==='string')wrap=document.getElementById(wrap);
  if(!wrap)wrap=ensureStoneListLoadMore(state.container,'load-more-'+stateKey.replace(/[^a-z0-9_-]/gi,'-'));
  state.loadMoreContainer=wrap;
  if(!wrap)return;
  if(remaining>0){
    wrap.style.display='block';
    wrap.innerHTML=`<button class="load-more-btn" type="button" onclick="pagedStoneListLoadMore('${stateKey}')">Load more stones</button><div class="load-more-count">${actual} of ${state.list.length} shown &mdash; ${remaining} more</div>`;
  }else{
    wrap.style.display='none';
    wrap.innerHTML='';
  }
}

function pagedStoneListLoadMore(stateKey){
  const state=pagedStoneLists[stateKey];
  if(!state)return;
  state.visible+=state.batchSize;
  const shown=state.list.slice(0,state.visible);
  state.container.innerHTML=shown.map(state.renderCard).join('');
  updatePagedStoneLoadMore(stateKey);
}

function encRender(){
  const list = getFiltered();

  const filtersActive = Object.values(filters).some(v => v !== 'all') ||
    encSearchValue().length > 0;

  const desktopSearch=document.getElementById('enc-search');
  const keepDesktopSearchOpen=!isMobileView() && document.activeElement===desktopSearch;
  if(filtersActive&&!keepDesktopSearchOpen)dismissEncDoorway();
  if(filtersActive&&keepDesktopSearchOpen){
    encDoorwayDismissed=true;
    const tierLanding=document.getElementById('enc-tier-landing');
    if(tierLanding)tierLanding.style.display='none';
  }

  // Active filter count
  const activeCount = Object.values(filters).filter(v => v !== 'all').length +
    (encSearchValue().length > 0 ? 1 : 0);

  // Results count + filter indicator — only shown when a filter or search is active
  const cnt = document.getElementById('enc-count');
  if(cnt){
    if(filtersActive){
      cnt.textContent = list.length + ' of ' + CRYSTALS.length + ' stones';
      if(activeCount > 0) cnt.textContent += ' · ' + activeCount + ' filter' + (activeCount > 1 ? 's' : '') + ' active';
      cnt.style.display = '';
    } else {
      cnt.textContent = '';
      cnt.style.display = 'none';
    }
  }

  // Show Reset only when filters are on
  document.querySelectorAll('.reset-link').forEach(el => el.classList.toggle('filters-on', filtersActive));
  renderEncActiveFilters();

  const grid = document.getElementById('crystal-grid');
  if(!grid) return;
  if(!list.length){
    grid.innerHTML = '<div class="empty-coll-state"><div class="empty-coll-icon">✦</div><div class="empty-coll-title">No stones found</div><div class="empty-coll-text">Try adjusting your filters or search for something different.</div><button class="empty-coll-btn" onclick="resetFilters()">Clear filters</button></div>';
    document.getElementById('load-more-wrap').style.display = 'none';
    return;
  }

  window._encList = list;
  window._encPage = 1;

  renderPagedStoneList({
    stones:list,
    container:grid,
    stateKey:'enc-main',
    renderCard:encCardHtml,
    loadMoreContainer:document.getElementById('load-more-wrap'),
    batchSize:isMobileView()?10:RESULT_BATCH_SIZE
  });
}

function loadMoreStones(){
  pagedStoneListLoadMore('enc-main');
}

function updateLoadMore(list, showing){
  const wrap = document.getElementById('load-more-wrap');
  const btn = document.getElementById('load-more-btn');
  const countEl = document.getElementById('load-more-count');
  const actual = Math.min(showing, list.length);
  const remaining = list.length - actual;
  if(remaining > 0){
    wrap.style.display = 'block';
    btn.disabled = false;
    btn.textContent = 'Load more stones';
    countEl.textContent = actual + ' of ' + list.length + ' shown — ' + remaining + ' more';
  } else {
    wrap.style.display = actual < list.length ? 'none' : 'none';
    if(actual >= list.length) wrap.style.display = 'none';
  }
}

// ── DETAIL DRAWER — moved to app.js ──

// ── Encyclopedia Landing ──
let encDoorwayDismissed=false;

function dismissEncDoorway(){
  encDoorwayDismissed=true;
  const landing=document.getElementById('enc-landing');
  const tierLanding=document.getElementById('enc-tier-landing');
  const orDivider=document.getElementById('enc-mobile-or-divider');
  if(landing)landing.style.display='none';
  if(tierLanding)tierLanding.style.display='none';
  if(orDivider)orDivider.style.display='none';
}

function restoreEncLanding(){
  encDoorwayDismissed=false;
  const landing=document.getElementById('enc-landing');
  const tierLanding=document.getElementById('enc-tier-landing');
  const orDivider=document.getElementById('enc-mobile-or-divider');
  if(landing)landing.style.display='';
  if(tierLanding)tierLanding.style.display='';
  if(orDivider)orDivider.style.display='';
  const grid=document.getElementById('crystal-grid');
  if(grid)grid.innerHTML='';
  const loadMore=document.getElementById('load-more-wrap');
  if(loadMore){loadMore.style.display='none';loadMore.innerHTML='';}
}

function encDoorwayBrowse(key){
  dismissEncDoorway();
  setTimeout(()=>{
    closeAllPanels();
    const panel=document.getElementById('panel-'+key);
    const btn=document.getElementById('fbtn-'+key);
    if(panel&&btn){panel.classList.add('open');btn.classList.add('open');openPanel=key;}
    if(isMobileView())encScrollToSearchArea(true);
    else scrollToPageSection('#enc-filter-cats');
  },150);
}

function encDoorwayIntention(){
  if(isMobileView())encDoorwayBrowse('theme');
  else switchTabByName('mood');
}

function encBrowseTier(num){
  dismissEncDoorway();
  setTimeout(()=>{
    closeAllPanels();
    setFilter('tier',String(num));
    if(isMobileView())encScrollToSearchArea(true);
    else scrollToPageSection('#enc-filter-cats');
  },150);
}

function renderEncTierPreview(){
  if(!CRYSTALS.length)return;
  const t1=document.getElementById('enc-tier-1-grid');
  if(t1&&!t1.dataset.rendered){
    const allT1=CRYSTALS.filter(c=>Number(c.tier)===1);
    encTier1RenderUpTo(allT1,12,t1);
    t1.dataset.rendered='1';
  }
}

function encTier1RenderUpTo(allStones,upTo,grid){
  grid.innerHTML=allStones.slice(0,upTo).map(c=>encCardHtml(c)).join('');
  const remaining=allStones.length-upTo;
  const existingPill=document.getElementById('enc-t1-more-pill');
  if(existingPill)existingPill.remove();
  if(remaining>0){
    const nextBatch=Math.min(30,remaining);
    const pill=document.createElement('div');
    pill.id='enc-t1-more-pill';
    pill.className='enc-tier-more-wrap';
    pill.innerHTML=`<button class="enc-more-pill" type="button" onclick="encTier1ShowMore(${upTo},${upTo+nextBatch})">View ${nextBatch} more Essentials</button>`;
    grid.after(pill);
  }
}

function encTier1ShowMore(currentCount,newCount){
  const allT1=CRYSTALS.filter(c=>Number(c.tier)===1);
  const t1=document.getElementById('enc-tier-1-grid');
  if(!t1)return;
  encTier1RenderUpTo(allT1,newCount,t1);
}

function renderEncTierCounts(){
  if(!CRYSTALS.length)return;
  const counts={};
  CRYSTALS.forEach(c=>{const t=Number(c.tier);if(t>=1&&t<=4)counts[t]=(counts[t]||0)+1;});
  const set=(id,n)=>{const el=document.getElementById(id);if(el)el.textContent=n?n+' stones':'';};
  set('enc-t1-count',counts[1]);
  set('enc-t2-count',counts[2]);
  set('enc-t2-count-teaser',counts[2]);
  set('enc-t3-count',counts[3]);
  set('enc-t4-count',counts[4]);
}

function encTierAccordionExpand(num){
  const body=document.getElementById('enc-acc-'+num+'-body');
  const grid=document.getElementById('enc-acc-'+num+'-grid');
  const caret=document.getElementById('enc-acc-'+num+'-caret');
  if(!body)return;
  if(body.style.display!=='none'){
    body.style.display='none';
    if(caret)caret.textContent='▾';
    return;
  }
  if(grid){
    const stones=CRYSTALS.filter(c=>Number(c.tier)===num);
    renderPagedStoneList({
      stones,
      container:grid,
      stateKey:'enc-tier-'+num,
      renderCard:encCardHtml,
      loadMoreContainer:ensureStoneListLoadMore(grid,'enc-tier-'+num+'-more'),
      batchSize:isMobileView()?10:RESULT_BATCH_SIZE
    });
  }
  body.style.display='';
  if(caret)caret.textContent='▴';
  setTimeout(()=>scrollToPageSection(document.getElementById('enc-acc-'+num)),50);
}

// ── Sitewide Icon Audition Library (admin-only, temporary) ───────────────────
// Consistent visual system: viewBox 0 0 24 24, stroke-width 1.5, round caps/joins, fill:none.
// All icons use currentColor. Do not update live mappings until each concept is approved.
const _si=p=>`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${p}</svg>`;

const _SICA_LIB=[

{family:'Daily Selection',desc:'Replaces generic clock — should read "chosen / curated" not "timekeeping"',options:[
  {label:'A — Rays (no circle)',svg:_si('<path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.93 4.93l2.12 2.12M16.95 16.95l2.12 2.12M4.93 19.07l2.12-2.12M16.95 7.05l2.12-2.12"/>')},
  {label:'B — Sun + circle',svg:_si('<circle cx="12" cy="12" r="4"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.93 4.93l2.12 2.12M16.95 16.95l2.12 2.12M4.93 19.07l2.12-2.12M16.95 7.05l2.12-2.12"/>')},
  {label:'C — 4-pt star',svg:_si('<path d="M12 2l2.5 7.5L22 12l-7.5 2.5L12 22l-2.5-7.5L2 12l7.5-2.5z"/>')},
  {label:'D — 8-ray sparkle',svg:_si('<path d="M12 2v4M12 18v4M2 12h4M18 12h4M5.64 5.64l2.83 2.83M15.54 15.54l2.83 2.83M5.64 18.36l2.83-2.83M15.54 8.46l2.83-2.83"/>')},
]},

{family:'Lunar',desc:'Must read as moon/lunar, not timekeeping. Stroke-consistent with set.',options:[
  {label:'A — Crescent (stroke)',svg:_si('<path d="M12 3a9 9 0 1 0 0 18A7 7 0 0 1 12 3z"/>')},
  {label:'B — Crescent + star',svg:_si('<path d="M12 3a9 9 0 1 0 0 18A7 7 0 0 1 12 3z"/><path d="M18.5 7.5l.7 2 2 .7-2 .7-.7 2-.7-2-2-.7 2-.7z"/>')},
  {label:'C — Thin crescent',svg:_si('<path d="M12 4a8 8 0 0 0 0 16A6 6 0 0 1 12 4z"/>')},
  {label:'D — Half-moon D-shape',svg:_si('<path d="M12 4a8 8 0 0 1 0 16V4z"/>')},
]},

{family:'Eclipse',desc:'Current two-circle version is promising. Three alternatives shown.',options:[
  {label:'A — Two circles (current)',svg:_si('<circle cx="9" cy="12" r="7"/><path d="M14.9 6.3A7 7 0 0 1 14.9 17.7"/>')},
  {label:'B — Annular ring',svg:_si('<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5.5"/>')},
  {label:'C — Offset overlap',svg:_si('<circle cx="10" cy="12" r="6.5"/><circle cx="15" cy="12" r="5.5"/>')},
  {label:'D — Circle + corona arc',svg:_si('<circle cx="12" cy="12" r="6"/><path d="M4.93 4.93A11 11 0 0 1 19.07 19.07M19.07 4.93A11 11 0 0 1 4.93 19.07"/>')},
]},

{family:'Celestial',desc:'Must differ clearly from Tradition. Suggest comet, orbit, or hex star.',options:[
  {label:'A — Comet + tail',svg:_si('<circle cx="7.5" cy="15.5" r="2.5"/><path d="M9.5 13.5L18 5"/><path d="M12 10.5l2-5.5M14 9.5l5.5-2.5"/>')},
  {label:'B — Orbit ellipse',svg:_si('<ellipse cx="12" cy="12" rx="10" ry="4.5" transform="rotate(-25 12 12)"/><circle cx="12" cy="2.5" r="2"/>')},
  {label:'C — 6-pt star (hex)',svg:_si('<path d="M12 2l2.4 4.2 4.8.6-3.4 3.4.8 4.8L12 12.8l-4.6 2.2.8-4.8-3.4-3.4 4.8-.6z"/><path d="M8.6 17.4l-2 4.6M15.4 17.4l2 4.6M3.8 8.8l-1.8 0M22 8.8l-1.8 0"/>')},
  {label:'D — Shooting star arc',svg:_si('<path d="M5 19L19 5"/><path d="M19 5l-4 1M19 5l-1 4"/><path d="M5 19l1-4M5 19l4-1"/><circle cx="12" cy="12" r="1.5"/>')},
]},

{family:'Meteor',desc:'Current reads as arrow. Should convey falling/impact, not direction.',options:[
  {label:'A — Fireball + trail',svg:_si('<circle cx="7" cy="16" r="3"/><path d="M9.5 13.5L18 5"/><path d="M13 9.5l3.5-6.5M15 8.5l6-2"/>')},
  {label:'B — Three streaks shower',svg:_si('<path d="M17 3L7 17M20 6L10 20M14 2L4 16"/>')},
  {label:'C — Streak + impact burst',svg:_si('<path d="M18 3L8 16"/><circle cx="7.5" cy="16.5" r="2.5"/><path d="M4 14l1.5 2M3 17l2 .5M5 20l1.5-1.5M9 19l.5-2"/>')},
  {label:'D — Radiant falling',svg:_si('<path d="M12 2l-4 16M12 2l0 16M12 2l4 16"/><path d="M7 15l-.5 1.5M12 15v1.5M17 15l.5 1.5"/>')},
]},

{family:'Tradition',desc:'Must differ from Celestial. Cultural warmth: candle, lantern, lotus.',options:[
  {label:'A — Candle + flame',svg:_si('<rect x="9" y="9" width="6" height="13" rx="1"/><path d="M12 9V6"/><path d="M10.5 7.5C10.5 5.5 12 4 12 2c.5 2 1.5 3 1.5 5.5"/>')},
  {label:'B — Lantern',svg:_si('<path d="M10 5h4M9 8V5M15 8V5M8 8h8a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H8a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1z"/><path d="M8 12h8M10 19v2M14 19v2"/>')},
  {label:'C — Lotus',svg:_si('<path d="M12 18V9"/><path d="M12 9c-1-3-4-5-5-4s0 4 5 9"/><path d="M12 9c1-3 4-5 5-4s0 4-5 9"/><path d="M12 14c-3-1-5-4-4-6s3.5.5 4 6z"/><path d="M12 14c3-1 5-4 4-6s-3.5.5-4 6z"/><path d="M8 20h8"/>')},
  {label:'D — Chalice',svg:_si('<path d="M8 4h8l-2 9H10z"/><path d="M10 13c0 2.5 2 4 2 4s2-1.5 2-4"/><path d="M9 17h6"/><path d="M12 18v3M10 21h4"/>')},
]},

{family:'Location',desc:'Pin and compass are both promising. Mountain and horizon shown as alternatives.',options:[
  {label:'A — Pin (current)',svg:_si('<path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>')},
  {label:'B — Compass',svg:_si('<circle cx="12" cy="12" r="9"/><path d="M16.24 7.76l-2.12 6.36-6.36 2.12 2.12-6.36z"/><circle cx="12" cy="12" r="1.5"/>')},
  {label:'C — Mountain peaks',svg:_si('<path d="M3 20l5-9 4 6 3-4 6 7z"/><path d="M2 20h20"/>')},
  {label:'D — Horizon + rising',svg:_si('<path d="M2 17h20"/><path d="M7 17l5-9 5 9"/><path d="M12 5V3M8.5 6.5l-1.5-1.5M15.5 6.5l1.5-1.5M6 10H4M18 10h2"/>')},
]},

{family:'Geology',desc:'Strata and geode convey geology more precisely than crystal form.',options:[
  {label:'A — Strata layers',svg:_si('<path d="M3 8c2.5-1.5 5.5-1.5 9 0s6.5 1.5 9 0M3 12c2.5-1.5 5.5-1.5 9 0s6.5 1.5 9 0M3 16c2.5-1.5 5.5-1.5 9 0s6.5 1.5 9 0"/>')},
  {label:'B — Crystal (current)',svg:_si('<path d="M6 3l6 4 6-4v14l-6 4-6-4V3z"/><line x1="12" y1="7" x2="12" y2="17"/>')},
  {label:'C — Geode half',svg:_si('<path d="M5 12a7 7 0 0 0 14 0z"/><path d="M7.5 12a4.5 4.5 0 0 0 9 0"/><path d="M10 12a2 2 0 0 0 4 0"/><path d="M4 12H2M20 12h2"/>')},
  {label:'D — Mountain + strata',svg:_si('<path d="M3 20l5-8 4 5 4-6 5 9z"/><path d="M3 20h18"/><path d="M8.5 16l4-4"/>')},
]},

{family:'Anniversary',desc:'Radial burst is the current icon. Laurel wreath shows most distinctly celebratory.',options:[
  {label:'A — Radial burst (current)',svg:_si('<circle cx="12" cy="12" r="3"/><path d="M12 2v4M12 18v4M2 12h4M18 12h4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M19.07 4.93l-2.83 2.83M7.76 16.24l-2.83 2.83"/>')},
  {label:'B — Star in ring',svg:_si('<circle cx="12" cy="12" r="9"/><path d="M12 6l1.5 4.5H18l-3.75 2.73 1.43 4.41L12 15.13l-3.68 2.61 1.43-4.41L6 10.5h4.5z"/>')},
  {label:'C — Medal / badge',svg:_si('<circle cx="12" cy="9" r="6"/><path d="M8.21 13.89L7 23l5-3 5 3-1.21-9.12"/>')},
  {label:'D — Laurel wreath',svg:_si('<path d="M12 19V9"/><path d="M12 9C10 7 7 7 5.5 9c2-.5 4.5.5 6.5 5"/><path d="M12 9c2-2 5-2 6.5 0-2-.5-4.5.5-6.5 5"/><path d="M12 14c-2-1-4 0-5 2 2-.5 4 .5 5 4"/><path d="M12 14c2-1 4 0 5 2-2-.5-4 .5-5 4"/><path d="M9 21h6"/>')},
]},

{family:'Crystal (single)',desc:'Single terminated crystal for stone identification and detail views.',options:[
  {label:'A — Tall pointed',svg:_si('<path d="M12 2l3 5v12l-3 3-3-3V7z"/><path d="M9 7h6"/>')},
  {label:'B — Faceted gem',svg:_si('<path d="M12 3l5 5.5-5 13.5-5-13.5z"/><path d="M7 8.5h10"/><path d="M9.5 8.5L12 3l2.5 5.5"/>')},
  {label:'C — Hexagonal prism',svg:_si('<path d="M12 3l5.2 3v7l-5.2 3-5.2-3V6z"/><path d="M6.8 9l5.2 3 5.2-3"/><path d="M12 12v9"/>')},
  {label:'D — Double terminated',svg:_si('<path d="M12 2l3 5v10l-3 5-3-5V7z"/><path d="M9 7h6M9 17h6"/>')},
]},

{family:'Crystal Cluster',desc:'Multi-point cluster for encyclopedia and collection contexts.',options:[
  {label:'A — Three varied crystals',svg:_si('<path d="M9 20V12l3-6 3 6v8"/><path d="M5.5 20V15l2-4 2.5 3V20"/><path d="M14.5 20V14l2-4 2.5 4V20"/><path d="M4 20h16"/>')},
  {label:'B — Radiating from base',svg:_si('<path d="M12 20V10l3-7"/><path d="M12 20l-5-4 3-4"/><path d="M12 20l5-4-3-4"/><path d="M12 20l-7-2 4-2"/><path d="M12 20l7-2-4-2"/><path d="M9 3l3 7"/>')},
  {label:'C — Cluster + ground',svg:_si('<path d="M8 20V13l2.5-5 2.5 5v7"/><path d="M5 20v-5l2-3.5 1.5 2.5V20"/><path d="M14 20v-5.5l2-4 2 4V20"/><path d="M4 20h16"/>')},
  {label:'D — Geode cross-section',svg:_si('<path d="M4 12a8 8 0 0 0 16 0z"/><path d="M6.5 12a5.5 5.5 0 0 0 11 0"/><path d="M9.5 12a2.5 2.5 0 0 0 5 0"/>')},
]},

{family:'Book / Reference',desc:'For encyclopedia drawer and entry view contexts.',options:[
  {label:'A — Open book (current)',svg:_si('<path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>')},
  {label:'B — Closed book + lines',svg:_si('<path d="M4 2h13l3 3v17H4z"/><path d="M8 2v20"/><path d="M11 7h5M11 11h5M11 15h3"/>')},
  {label:'C — Book + bookmark',svg:_si('<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/><path d="M14 2v8l-2-2-2 2V2"/>')},
  {label:'D — Scroll',svg:_si('<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/><path d="M9 13h6M9 17h4"/>')},
]},

{family:'Collection',desc:'For saved / owned stones. Should feel curated, personal.',options:[
  {label:'A — Stones in a row',svg:_si('<circle cx="6" cy="15" r="3.5"/><circle cx="12" cy="13" r="4.5"/><circle cx="18" cy="15" r="3.5"/><path d="M2 19h20"/>')},
  {label:'B — Cabinet shelves',svg:_si('<rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M3 15h18"/><path d="M9 9v6M15 9v6"/>')},
  {label:'C — Three gems arranged',svg:_si('<path d="M5 10l2-4h4l2 4-4 8z"/><path d="M3 10h8"/><path d="M11 10l2-4h4l2 4-4 8z"/><path d="M9 10h8"/>')},
  {label:'D — Jar with gems',svg:_si('<path d="M8 4h8l1 3H7zM7 7v12a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V7"/><circle cx="10" cy="13" r="1.5"/><circle cx="14" cy="11" r="1.5"/><circle cx="12" cy="15.5" r="1.5"/>')},
]},

{family:'Wishlist',desc:'For saved / wanted stones. Distinct from Collection.',options:[
  {label:'A — Bookmark (current)',svg:_si('<path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>')},
  {label:'B — Tag / label',svg:_si('<path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><circle cx="7" cy="7" r="1.5"/>')},
  {label:'C — Heart outline',svg:_si('<path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>')},
  {label:'D — Star',svg:_si('<path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>')},
]},

{family:'Pair With',desc:'Two complementary stones. Must not be confused with Wishlist or Collection.',options:[
  {label:'A — Two circles (current)',svg:_si('<circle cx="9" cy="12" r="6"/><circle cx="15" cy="12" r="6"/>')},
  {label:'B — Two linked rings',svg:_si('<circle cx="9" cy="12" r="5"/><circle cx="15" cy="12" r="5"/>')},
  {label:'C — Two gems faceted',svg:_si('<path d="M3 9l2-4h4l2 4-4 9z"/><path d="M1 9h8"/><path d="M13 9l2-4h4l2 4-4 9z"/><path d="M11 9h8"/>')},
  {label:'D — Two teardrops',svg:_si('<path d="M9 4c0 0-5 5-5 9a5 5 0 0 0 10 0c0-4-5-9-5-9z"/><path d="M15 4c0 0-5 5-5 9a5 5 0 0 0 10 0c0-4-5-9-5-9z"/>')},
]},

{family:'Chakra',desc:'Energy center concept. Lotus, wheel, or concentric forms all appropriate.',options:[
  {label:'A — 8-spoke wheel',svg:_si('<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="3"/><path d="M12 3v6M12 15v6M3 12h6M15 12h6M5.64 5.64l4.24 4.24M14.12 14.12l4.24 4.24M18.36 5.64l-4.24 4.24M9.88 14.12l-4.24 4.24"/>')},
  {label:'B — Lotus (current paths)',svg:_si('<path d="M32 48C23 40 21 29 32 16c11 13 9 24 0 32Z" transform="scale(0.5) translate(-12 -18)"/><circle cx="12" cy="12" r="3"/><path d="M12 9V4M9 12H4M15 12h5M9.9 9.9L6.3 6.3M14.1 14.1l3.6 3.6M14.1 9.9l3.6-3.6M9.9 14.1l-3.6 3.6"/>')},
  {label:'C — 8-petal ring',svg:_si('<circle cx="12" cy="12" r="2.5"/><ellipse cx="12" cy="6.5" rx="1.5" ry="3.5"/><ellipse cx="12" cy="17.5" rx="1.5" ry="3.5"/><ellipse cx="6.5" cy="12" rx="3.5" ry="1.5"/><ellipse cx="17.5" cy="12" rx="3.5" ry="1.5"/><ellipse cx="7.87" cy="7.87" rx="1.5" ry="3.5" transform="rotate(45 7.87 7.87)"/><ellipse cx="16.13" cy="16.13" rx="1.5" ry="3.5" transform="rotate(45 16.13 16.13)"/><ellipse cx="16.13" cy="7.87" rx="1.5" ry="3.5" transform="rotate(-45 16.13 7.87)"/><ellipse cx="7.87" cy="16.13" rx="1.5" ry="3.5" transform="rotate(-45 7.87 16.13)"/>')},
  {label:'D — Concentric rings',svg:_si('<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5.5"/><circle cx="12" cy="12" r="2"/>')},
]},

{family:'Best For',desc:'The intended use or benefit of a stone.',options:[
  {label:'A — Target / bullseye',svg:_si('<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.5"/>')},
  {label:'B — Lightning bolt',svg:_si('<path d="M13 2L4.5 13h7L10 22l9.5-11H13z"/>')},
  {label:'C — Check in circle',svg:_si('<circle cx="12" cy="12" r="9"/><path d="M8 12l3 3 5-6"/>')},
  {label:'D — Upward spark',svg:_si('<path d="M12 20V10"/><path d="M8 14l4-4 4 4"/><path d="M9 7l3-5 3 5"/><path d="M7 4l2 2M15 4l-2 2"/>')},
]},

{family:"Today's Practice",desc:'Ritual, meditation, or intentional use guidance.',options:[
  {label:'A — Seated figure',svg:_si('<circle cx="12" cy="5" r="2"/><path d="M12 7v4M9 11c0 2.5-2 4-2 6h14c0-2-2-3.5-2-6"/><path d="M7 17l-1 4M17 17l1 4"/>')},
  {label:'B — Hands cupped',svg:_si('<path d="M7 12V8a1.5 1.5 0 0 1 3 0v2M10 8V7a1.5 1.5 0 0 1 3 0v5M13 7a1.5 1.5 0 0 1 3 0v5M16 9a1.5 1.5 0 0 1 3 0v3c0 3.5-3 6-7 6s-7-2.5-7-6v-2"/>')},
  {label:'C — Infinity loop',svg:_si('<path d="M12 12c-1.5-3.5-4-5-6-4.5S2.5 12 4.5 14 10 14 12 12c1.5 3.5 4 5 6 4.5S21.5 12 19.5 10 14 10 12 12z"/>')},
  {label:'D — Spiral',svg:_si('<path d="M12 12a1 1 0 1 0 0-2 1 1 0 0 0 0 2zM12 10a3 3 0 1 0-3 3M12 7a5 5 0 1 1-5 5M12 4a8 8 0 1 0 8 8"/>')},
]},

{family:'Identify / Camera',desc:'For the photo-based stone identification feature.',options:[
  {label:'A — Camera',svg:_si('<path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/>')},
  {label:'B — Aperture iris',svg:_si('<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="3.5"/><path d="M12 3v4M12 17v4M3 12h4M17 12h4"/>')},
  {label:'C — Viewfinder crosshair',svg:_si('<circle cx="12" cy="12" r="5"/><path d="M12 2v5M12 17v5M2 12h5M17 12h5"/>')},
  {label:'D — Magnifier + gem',svg:_si('<circle cx="10.5" cy="10.5" r="7"/><path d="M21 21l-4.5-4.5"/><path d="M8.5 8l1-2H12l1.5 2-3 7z"/><path d="M7 8h7"/>')},
]},

{family:'Search',desc:'General encyclopedia and catalog search.',options:[
  {label:'A — Magnifier (clean)',svg:_si('<circle cx="10.5" cy="10.5" r="7.5"/><path d="M21 21l-5.2-5.2"/>')},
  {label:'B — Magnifier + plus',svg:_si('<circle cx="10" cy="10" r="7"/><path d="M20.5 20.5L15 15"/><path d="M10 7v6M7 10h6"/>')},
  {label:'C — Eye outline',svg:_si('<path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12z"/><circle cx="12" cy="12" r="3"/>')},
  {label:'D — Magnifier + star',svg:_si('<circle cx="10" cy="10" r="7"/><path d="M20.5 20.5L15 15"/><path d="M10 7l1.2 3.7H14.7l-2.9 2.1.9 3L10 13.9l-2.7 1.9.9-3L5.3 10.7H8.8z"/>')},
]},

{family:'Filter',desc:'For collection / encyclopedia filtering controls.',options:[
  {label:'A — Funnel',svg:_si('<path d="M22 3H2l8 9.46V19l4 2v-8.54z"/>')},
  {label:'B — Three sliders',svg:_si('<path d="M4 6h16M4 12h16M4 18h16"/><circle cx="8" cy="6" r="2"/><circle cx="16" cy="12" r="2"/><circle cx="10" cy="18" r="2"/>')},
  {label:'C — Tapering lines',svg:_si('<path d="M3 6h18M6 12h12M9 18h6"/>')},
  {label:'D — Lines with arrows',svg:_si('<path d="M3 6h18M3 12h18M3 18h18"/><path d="M8 4l-2 2 2 2M15 10l2 2-2 2M10 16l-2 2 2 2"/>')},
]},

{family:'Forms / Shapes',desc:'Crystal habit, shape classification, mineral form.',options:[
  {label:'A — Hexagon',svg:_si('<path d="M12 2l8.66 5v10L12 22l-8.66-5V7z"/>')},
  {label:'B — Mixed shapes',svg:_si('<circle cx="6.5" cy="7.5" r="4"/><rect x="13" y="3.5" width="7.5" height="7.5" rx="1"/><path d="M2.5 20.5l4.5-8h9l4.5 8z"/>')},
  {label:'C — Faceted diamond',svg:_si('<path d="M12 3l5 5.5-5 13.5-5-13.5z"/><path d="M7 8.5h10"/><path d="M9.5 8.5L12 3l2.5 5.5"/>')},
  {label:'D — Octagon',svg:_si('<path d="M7.86 2h8.28L22 7.86v8.28L16.14 22H7.86L2 16.14V7.86L7.86 2z"/>')},
]},

{family:'Care / Cleansing',desc:'Stone care methods: water, sunlight, smoke, moonlight.',options:[
  {label:'A — Water drop',svg:_si('<path d="M12 2c0 0-7 8-7 13a7 7 0 0 0 14 0c0-5-7-13-7-13z"/>')},
  {label:'B — Flame',svg:_si('<path d="M12 22a6 6 0 0 0 6-6c0-3-2-5-2-8-1.5 2-2 3.5-4 4-1-2-1.5-4-1.5-4C9.5 11 8 14 8 16a6 6 0 0 0 4 5.66V22z"/>')},
  {label:'C — Moon + drops',svg:_si('<path d="M14 3.5a9 9 0 1 0 0 17A7 7 0 0 1 14 3.5z"/><path d="M18 13.5c0 1-1 2.5-1 4"/><path d="M20.5 11.5c0 1-.5 2.5-.5 4"/>')},
  {label:'D — Sun rays (sunlight)',svg:_si('<circle cx="12" cy="12" r="5"/><path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83"/>')},
]},

{family:'Rarity / Tier',desc:'Collection tier and rarity classification.',options:[
  {label:'A — Crown',svg:_si('<path d="M2 20h20M3 20l2-10 4 5 3-9 3 9 4-5 2 10"/>')},
  {label:'B — Diamond / gem',svg:_si('<path d="M5.5 8.5L12 3l6.5 5.5-6.5 13.5z"/><path d="M5.5 8.5h13"/><path d="M9 8.5L12 3l3 5.5"/>')},
  {label:'C — Tier steps',svg:_si('<path d="M4 20h4v-4H4zM9 20h4v-8H9zM14 20h4V8h-4z"/><path d="M4 20h14"/>')},
  {label:'D — Star in circle',svg:_si('<circle cx="12" cy="12" r="9"/><path d="M12 7l1.5 4.5H18l-3.75 2.72 1.43 4.41L12 15.9l-3.68 2.72 1.43-4.41L6 11.5h4.5z"/>')},
]},

{family:'Add Piece',desc:'Add a stone to the collection or wishlist.',options:[
  {label:'A — Plus in circle',svg:_si('<circle cx="12" cy="12" r="9"/><path d="M12 8v8M8 12h8"/>')},
  {label:'B — Plus in rounded square',svg:_si('<rect x="3" y="3" width="18" height="18" rx="4"/><path d="M12 8v8M8 12h8"/>')},
  {label:'C — Gem + plus',svg:_si('<path d="M6 9l2-5h4l2 5-4 9z"/><path d="M4 9h12"/><path d="M17 5v6M14 8h6"/>')},
  {label:'D — Crystal + plus',svg:_si('<path d="M9 20V13l3-6 3 6v7"/><path d="M8 20h8"/><path d="M18 4v7M14.5 7.5h7"/>')},
]},

{family:'Calendar',desc:'SOTD calendar and date-based scheduling.',options:[
  {label:'A — Grid calendar (current)',svg:_si('<rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/><path d="M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01M16 18h.01"/>')},
  {label:'B — Calendar + moon',svg:_si('<rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/><path d="M9 17a4 4 0 0 0 6.7-2.9 3 3 0 0 1-4.2.1A3 3 0 0 1 9 17z"/>')},
  {label:'C — Calendar + star',svg:_si('<rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/><path d="M12 14l.9 2.7h2.8l-2.3 1.7.9 2.7L12 19.4l-2.3 1.7.9-2.7-2.3-1.7H11z"/>')},
  {label:'D — Page / event',svg:_si('<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/><path d="M9 13h6M9 17h4"/>')},
]},

];

function openSotdIconAudition(){
  if(!isAdminUser(_currentUser))return;
  const body=document.getElementById('sica-body');
  if(!body)return;
  const sizes=[{px:15,lbl:'15 px'},{px:24,lbl:'24 px'},{px:32,lbl:'32 px'}];
  body.innerHTML=_SICA_LIB.map(sec=>{
    const cards=sec.options.map(opt=>{
      const szHtml=sizes.map(s=>`
        <div class="sica-sz">
          <div class="sica-sz-icon" style="min-width:${s.px+10}px;min-height:${s.px+10}px">
            <span style="display:inline-flex;width:${s.px}px;height:${s.px}px" aria-hidden="true">${opt.svg}</span>
          </div>
          <span class="sica-sz-lbl">${s.lbl}</span>
        </div>`).join('');
      return`<div class="sica-card"><div class="sica-card-label">${escapeAttr(opt.label)}</div><div class="sica-sizes">${szHtml}</div></div>`;
    }).join('');
    return`<div class="sica-section">
      <div class="sica-section-hdr">${escapeAttr(sec.family)}<span style="font-weight:400;letter-spacing:0;text-transform:none;margin-left:8px;color:#9a8878;font-size:9.5px">${escapeAttr(sec.desc||'')}</span></div>
      <div class="sica-options">${cards}</div>
    </div>`;
  }).join('');
  const overlay=document.getElementById('sotd-icon-audition');
  if(overlay){overlay.classList.add('open');document.body.style.overflow='hidden';}
}
function closeSotdIconAudition(){
  const overlay=document.getElementById('sotd-icon-audition');
  if(overlay){overlay.classList.remove('open');document.body.style.overflow='';}
  document.getElementById('manage-btn')?.focus();
}
// ── end Sitewide Icon Audition ────────────────────────────────────────────────

// ── SOTD CALENDAR DATA LAYER ──────────────────────────────────────────────────
/**
 * Returns normalized SOTD data for every populated date in the requested month.
 * Reads stone_of_day_history (resolved dates, source of truth) and
 * stone_of_day_schedule (active editorial/special future dates).
 * Ordinary unresolved future dates are left empty — nothing is resolved or written.
 *
 * @param {number} year   Full year, e.g. 2026
 * @param {number} month  1-indexed month, e.g. 6 for June
 * @returns {Promise<Array<SotdCalendarEntry>|null>}
 *   null means the history query itself failed (caller should surface an error).
 *   An empty array means Supabase is reachable but no rows exist for the month.
 *
 * SotdCalendarEntry shape:
 *   date           {string}       'YYYY-MM-DD'
 *   stoneId        {string}
 *   source         {'history'|'schedule'}
 *   selectionType  {string|null}
 *   eventName      {string|null}
 *   eventCategory  {string|null}
 *   eventPriority  {number|null}
 *   eventLocation  {string|null}
 *   editorialNote  {string|null}
 *   sourceUrl      {string|null}
 *   isToday        {boolean}
 *   isPast         {boolean}
 *   isFuture       {boolean}
 */
async function getSotdCalendarMonth(year, month) {
  // "Today" in America/Chicago — for isToday / isPast / isFuture flags only.
  // Intl gives the correct Chicago date without an extra RPC round-trip.
  const todayChicago = new Date().toLocaleDateString('en-CA', { timeZone: 'America/Chicago' });

  if (typeof _supa === 'undefined') {
    console.warn('[SOTD Calendar] Supabase client unavailable — returning empty month.');
    return [];
  }

  const { data, error } = await _supa.rpc('get_sotd_calendar_month', {
    p_year:  year,
    p_month: month,
  });

  if (error) {
    console.error('[SOTD Calendar] get_sotd_calendar_month RPC failed:', error);
    return null;
  }

  const rows = data || [];

  // Map RPC snake_case columns to the public camelCase shape and attach
  // date-relative flags (computed client-side against Chicago today).
  return rows.map(r => ({
    date:          r.feature_date,
    stoneId:       r.stone_id,
    source:        r.source,                    // 'history' | 'schedule'
    selectionType: r.selection_type  || null,
    eventName:     r.event_name      || null,
    eventCategory: r.event_category  || null,
    eventPriority: r.event_priority  ?? null,
    eventLocation: r.event_location  || null,
    editorialNote: r.editorial_note  || null,
    sourceUrl:     r.source_url      || null,
    isToday:       r.feature_date === todayChicago,
    isPast:        r.feature_date <  todayChicago,
    isFuture:      r.feature_date >  todayChicago,
  }));
  // Note: RPC returns rows already sorted by feature_date; no client sort needed.
}

// ── SOTD CALENDAR UI ─────────────────────────────────────────────────────────

let _sotdCalYear  = null;
let _sotdCalMonth = null;
const _sotdCalCache     = new Map(); // 'YYYY-MM' → entries[] | null
const _sotdCalEntryStore = new Map(); // 'YYYY-MM-DD' → entry — for passing full entry to drawer

function _sotdCalChicagoToday() {
  return new Date().toLocaleDateString('en-CA', { timeZone: 'America/Chicago' });
}

// Look up a stone name from the already-loaded CRYSTALS array.
// Falls back to an empty string rather than exposing a raw ID.
function _sotdCalStoneName(stoneId) {
  const c = CRYSTALS.find(cr => cr.i === stoneId);
  return c ? c.n : '';
}

function _sotdCalMonthLabel(month) {
  return ['January','February','March','April','May','June',
          'July','August','September','October','November','December'][month - 1];
}

function openSotdCalendar(year, month) {
  if(!isAdminUser(_currentUser))return;
  const today = _sotdCalChicagoToday();
  const [ty, tm] = today.split('-').map(Number);
  _sotdCalYear  = year  || ty;
  _sotdCalMonth = month || tm;

  const overlay = document.getElementById('sotd-cal-overlay');
  if (!overlay) return;
  overlay.classList.add('open');
  document.body.classList.add('sotd-cal-open');

  _sotdCalRenderMonth(_sotdCalYear, _sotdCalMonth);

  // Return focus to close button after rendering settles.
  setTimeout(() => { document.getElementById('sotd-cal-close-btn')?.focus(); }, 60);
}

function closeSotdCalendar() {
  const overlay = document.getElementById('sotd-cal-overlay');
  if (!overlay) return;
  overlay.classList.remove('open');
  document.body.classList.remove('sotd-cal-open');
  document.getElementById('manage-btn')?.focus();
}

async function _sotdCalRenderMonth(year, month) {
  _sotdCalYear  = year;
  _sotdCalMonth = month;

  const key     = `${year}-${String(month).padStart(2, '0')}`;
  const today   = _sotdCalChicagoToday();
  const [ty, tm] = today.split('-').map(Number);

  // Month title
  const titleEl = document.getElementById('sotd-cal-title');
  if (titleEl) {
    titleEl.textContent = `${_sotdCalMonthLabel(month)} ${year}`;
  }

  // Today button: hidden when already on the current month
  const todayBtn = document.getElementById('sotd-cal-today-btn');
  if (todayBtn) todayBtn.hidden = (year === ty && month === tm);

  const grid = document.getElementById('sotd-cal-grid');
  if (!grid) return;

  // Serve from cache if available
  if (_sotdCalCache.has(key)) {
    _sotdCalBuildGrid(_sotdCalCache.get(key), year, month, today);
    return;
  }

  // Loading state
  grid.innerHTML = '<div class="sotd-cal-loading" aria-live="polite" role="status">Loading…</div>';

  const entries = await getSotdCalendarMonth(year, month);
  _sotdCalCache.set(key, entries);

  // Re-check: user may have navigated away while awaiting
  if (_sotdCalYear !== year || _sotdCalMonth !== month) return;

  if (entries === null) {
    grid.innerHTML = `<div class="sotd-cal-error" role="alert">
      <p>Unable to load stone data for this month.</p>
      <button class="sotd-cal-retry-btn" type="button" onclick="_sotdCalRetry()">Retry</button>
    </div>`;
    return;
  }

  _sotdCalBuildGrid(entries, year, month, today);
}

function _sotdCalRetry() {
  const key = `${_sotdCalYear}-${String(_sotdCalMonth).padStart(2, '0')}`;
  _sotdCalCache.delete(key);
  _sotdCalRenderMonth(_sotdCalYear, _sotdCalMonth);
}

function _sotdCalBuildGrid(entries, year, month, today) {
  const grid = document.getElementById('sotd-cal-grid');
  if (!grid) return;

  // Refresh entry store for this month so _sotdCalOpenStone can pass full entry to drawer.
  _sotdCalEntryStore.clear();
  for (const e of entries) { _sotdCalEntryStore.set(e.date, e); }

  const entryMap   = new Map(entries.map(e => [e.date, e]));
  const firstDate  = new Date(year, month - 1, 1);
  const startDow   = firstDate.getDay();            // 0 = Sun
  const daysInMonth = new Date(year, month, 0).getDate();
  const mm          = String(month).padStart(2, '0');
  const monthLabel  = _sotdCalMonthLabel(month);

  const cells = [];

  // Leading ghost cells for grid alignment
  for (let i = 0; i < startDow; i++) {
    cells.push('<div class="sotd-cal-cell sotd-cal-cell--outside" aria-hidden="true"></div>');
  }

  for (let d = 1; d <= daysInMonth; d++) {
    const dd      = String(d).padStart(2, '0');
    const dateStr = `${year}-${mm}-${dd}`;
    const entry   = entryMap.get(dateStr);
    const isToday = dateStr === today;
    const todayAttr = isToday ? ' aria-current="date"' : '';

    if (!entry) {
      const isFutureDate = dateStr > today;
      const emptyLabel = `${isToday ? 'Today, ' : ''}${d} ${monthLabel}, no stone scheduled`;
      if (isFutureDate) {
        cells.push(
          `<button class="sotd-cal-cell sotd-cal-cell--empty sotd-cal-cell--empty-future" type="button" role="gridcell"` +
          ` aria-label="${emptyLabel}" onclick="_sotdCalOpenDay('${dateStr}',${year},${month})">` +
          `<span class="sotd-cal-day-num">${d}</span>` +
          `<span class="sotd-cal-empty-add" aria-hidden="true">+</span></button>`
        );
      } else {
        cells.push(
          `<div class="sotd-cal-cell sotd-cal-cell--empty${isToday ? ' sotd-cal-cell--today' : ''}"` +
          ` role="gridcell" aria-label="${emptyLabel}"${todayAttr}>` +
          `<span class="sotd-cal-day-num">${d}</span></div>`
        );
      }
    } else {
      const isSchedule  = entry.source === 'schedule';
      const isEditorial = _isSotdEditorial(entry);
      const stoneName   = _sotdCalStoneName(entry.stoneId);
      const pres        = isEditorial ? getSotdEventPresentation(entry.eventCategory) : null;
      const cellClass   = [
        'sotd-cal-cell sotd-cal-cell--populated',
        isSchedule ? 'sotd-cal-cell--schedule' : 'sotd-cal-cell--history',
        isToday ? 'sotd-cal-cell--today' : '',
        pres ? `sotd-cal-cell--${pres.family}` : '',
      ].filter(Boolean).join(' ');

      const ariaLabel = [
        isToday ? 'Today, ' : '',
        `${d} ${monthLabel}`,
        stoneName ? `: ${stoneName}` : '',
        isEditorial && entry.eventName ? `, chosen for ${entry.eventName}` : '',
      ].join('');

      const markerHtml = isEditorial && pres
        ? `<span class="sotd-cal-event-icon" aria-hidden="true">${pres.icon}</span>`
        : (isSchedule ? '<span class="sotd-cal-sched-dot" aria-hidden="true"></span>' : '');

      cells.push(
        `<button class="${cellClass}" type="button" role="gridcell"` +
        ` onclick="_sotdCalOpenDay('${dateStr}',${year},${month})"` +
        ` aria-label="${ariaLabel.replace(/"/g,"'")}"${todayAttr}>` +
        `<span class="sotd-cal-day-num">${d}</span>` +
        (stoneName ? `<span class="sotd-cal-stone-name">${stoneName}</span>` : '') +
        (entry.eventName ? `<span class="sotd-cal-event-name">${entry.eventName}</span>` : '') +
        markerHtml +
        `</button>`
      );
    }
  }

  // Trailing ghost cells to complete the last row
  const rem = (startDow + daysInMonth) % 7;
  if (rem > 0) {
    for (let i = 0; i < 7 - rem; i++) {
      cells.push('<div class="sotd-cal-cell sotd-cal-cell--outside" aria-hidden="true"></div>');
    }
  }

  grid.innerHTML = cells.join('');

  // Empty-month message sits below the grid, not inside it
  const emptyMsg = document.querySelector('.sotd-cal-empty-msg');
  if (emptyMsg) emptyMsg.remove();
  if (entries.length === 0) {
    const msg = document.createElement('p');
    msg.className = 'sotd-cal-empty-msg';
    msg.textContent = 'No stones have been recorded or scheduled for this month.';
    grid.after(msg);
  }
}

function _sotdCalNav(dir) {
  let y = _sotdCalYear, m = _sotdCalMonth + dir;
  if (m > 12) { y++; m = 1; }
  if (m <  1) { y--; m = 12; }
  _sotdCalRenderMonth(y, m);
}

function _sotdCalGoToday() {
  const today = _sotdCalChicagoToday();
  const [ty, tm] = today.split('-').map(Number);
  _sotdCalRenderMonth(ty, tm);
}

function _sotdCalOpenStone(stoneId, dateStr, year, month) {
  const entry = _sotdCalEntryStore.get(dateStr) || null;
  setSotdContext('calendar', entry);
  detailReturnContext = { type: 'sotd-calendar', year, month, entry };
  openDetail(stoneId);
}

// Keyboard: Escape closes the calendar (when the encyclopedia drawer is not open).
document.addEventListener('keydown', function(e) {
  if (e.key !== 'Escape') return;
  const overlay = document.getElementById('sotd-cal-overlay');
  if (!overlay || !overlay.classList.contains('open')) return;
  const drawerOverlay = document.getElementById('drawer-overlay');
  if (drawerOverlay && drawerOverlay.classList.contains('open')) return; // drawer takes priority
  closeSotdCalendar();
});
// ── SOTD SCHEDULER MODAL ─────────────────────────────────────────────────────

let _sotdSchedDate  = null;  // 'YYYY-MM-DD' of the date currently open in the scheduler
let _sotdSchedYear  = null;  // calendar year to return to on close
let _sotdSchedMonth = null;  // calendar month to return to on close

// Unified entry point for every calendar cell click.
// Determines modal mode from the entry (or absence of one) and opens the scheduler.
function _sotdCalOpenDay(dateStr, year, month) {
  _sotdSchedDate  = dateStr;
  _sotdSchedYear  = year;
  _sotdSchedMonth = month;

  const entry = _sotdCalEntryStore.get(dateStr) || null;

  const dateEl = document.getElementById('sotd-sched-date-label');
  if (dateEl) {
    const [y, m, d] = dateStr.split('-').map(Number);
    dateEl.textContent = `${_sotdCalMonthLabel(m)} ${d}, ${y}`;
  }

  const body = document.getElementById('sotd-sched-body');
  if (!body) return;

  if (!entry) {
    // Empty future date — schedule form
    body.innerHTML = _sotdSchedFormHTML(null);
    _sotdSchedInitCombo(null);
  } else if (entry.source === 'history') {
    // Resolved history entry — read-only
    body.innerHTML = _sotdSchedHistoryHTML(entry);
  } else if (entry.source === 'schedule') {
    // Existing scheduled entry — editable
    body.innerHTML = _sotdSchedFormHTML(entry);
    _sotdSchedInitCombo(entry);
  } else {
    // Any other future entry — read-only detail
    body.innerHTML = _sotdSchedHistoryHTML(entry);
  }

  const modal = document.getElementById('sotd-sched-modal');
  if (!modal) return;
  modal.classList.add('open');
  document.body.classList.add('sotd-sched-open');
  setTimeout(() => document.querySelector('#sotd-sched-modal .sotd-sched-close')?.focus(), 60);
}

function closeSotdScheduler() {
  const modal = document.getElementById('sotd-sched-modal');
  if (!modal) return;
  modal.classList.remove('open');
  document.body.classList.remove('sotd-sched-open');
  // Return focus to the day cell that was clicked, if it is still in the grid
  if (_sotdSchedDate) {
    const cells = document.querySelectorAll('#sotd-cal-grid [role="gridcell"]');
    for (const c of cells) {
      if (c.getAttribute('aria-label') && c.getAttribute('onclick') &&
          c.getAttribute('onclick').includes(_sotdSchedDate)) {
        c.focus();
        break;
      }
    }
  }
}

// Returns the HTML string for the editable schedule form.
// entry is null for new, or an existing SotdCalendarEntry for edits.
function _sotdSchedFormHTML(entry) {
  const isEdit = !!(entry && entry.source === 'schedule');
  const stoneName = entry ? _sotdCalStoneName(entry.stoneId) : '';

  const catOptions = ['', ...Object.keys(SOTD_EVENT_PRESENTATION)]
    .map(k => `<option value="${k}"${entry && entry.eventCategory === k ? ' selected' : ''}>${k || '— none —'}</option>`)
    .join('');

  return `
    <form class="sotd-sched-form" id="sotd-sched-form" onsubmit="return false">
      <div class="sotd-sched-field">
        <label class="sotd-sched-label" for="sotd-sched-stone-input">Stone</label>
        <div class="combobox-wrap" id="sotd-sched-stone-wrap">
          <input type="text" id="sotd-sched-stone-input" class="sotd-sched-input" autocomplete="off"
            placeholder="Search stones…" value="${stoneName.replace(/"/g,'&quot;')}"
            oninput="comboFilter('sotd-sched-stone-wrap','sotd-sched-stone-input','sotd-sched-stone-drop','sotd-sched-stone-val')"
            onkeydown="comboKey(event,'sotd-sched-stone-drop','sotd-sched-stone-input','sotd-sched-stone-val')">
          <div class="combobox-dropdown" id="sotd-sched-stone-drop"></div>
          <input type="hidden" id="sotd-sched-stone-val" value="${entry ? entry.stoneId : ''}">
        </div>
      </div>

      <div class="sotd-sched-divider">Event context <span class="sotd-sched-optional">(optional)</span></div>

      <div class="sotd-sched-field">
        <label class="sotd-sched-label" for="sotd-sched-event-name">Event name</label>
        <input type="text" id="sotd-sched-event-name" class="sotd-sched-input"
          placeholder="e.g. Winter Solstice" value="${(entry && entry.eventName || '').replace(/"/g,'&quot;')}">
      </div>

      <div class="sotd-sched-field">
        <label class="sotd-sched-label" for="sotd-sched-event-cat">Category</label>
        <select id="sotd-sched-event-cat" class="sotd-sched-select">${catOptions}</select>
      </div>

      <div class="sotd-sched-field">
        <label class="sotd-sched-label" for="sotd-sched-event-loc">Location</label>
        <input type="text" id="sotd-sched-event-loc" class="sotd-sched-input"
          placeholder="e.g. Northern hemisphere" value="${(entry && entry.eventLocation || '').replace(/"/g,'&quot;')}">
      </div>

      <div class="sotd-sched-field">
        <label class="sotd-sched-label" for="sotd-sched-event-priority">Priority</label>
        <input type="number" id="sotd-sched-event-priority" class="sotd-sched-input sotd-sched-input--narrow"
          min="1" max="10" placeholder="1–10" value="${entry && entry.eventPriority != null ? entry.eventPriority : ''}">
      </div>

      <div class="sotd-sched-field">
        <label class="sotd-sched-label" for="sotd-sched-editorial-note">Editorial note</label>
        <textarea id="sotd-sched-editorial-note" class="sotd-sched-textarea"
          placeholder="Internal note for this date…" rows="3">${entry && entry.editorialNote || ''}</textarea>
      </div>

      <div class="sotd-sched-field">
        <label class="sotd-sched-label" for="sotd-sched-source-url">Source URL</label>
        <input type="url" id="sotd-sched-source-url" class="sotd-sched-input"
          placeholder="https://…" value="${(entry && entry.sourceUrl || '').replace(/"/g,'&quot;')}">
      </div>

      <div id="sotd-sched-error" class="sotd-sched-error" hidden></div>

      <div class="sotd-sched-actions">
        <button type="button" id="sotd-sched-save-btn" class="sotd-sched-btn sotd-sched-btn--primary"
          onclick="_sotdCalSaveSchedule()">${isEdit ? 'Save Changes' : 'Save Schedule'}</button>
        ${isEdit
          ? `<button type="button" id="sotd-sched-delete-btn" class="sotd-sched-btn sotd-sched-btn--danger"
              onclick="_sotdCalConfirmDelete()">Remove Schedule</button>`
          : ''}
        <button type="button" class="sotd-sched-btn sotd-sched-btn--ghost"
          onclick="closeSotdScheduler()">Cancel</button>
      </div>
      ${isEdit ? '<div id="sotd-sched-delete-confirm" class="sotd-sched-delete-confirm" hidden>' +
        '<span>Remove this scheduled entry? This cannot be undone.</span>' +
        '<button type="button" class="sotd-sched-btn sotd-sched-btn--danger" onclick="_sotdCalDeleteSchedule()">Yes, remove</button>' +
        '<button type="button" class="sotd-sched-btn sotd-sched-btn--ghost" onclick="_sotdCalCancelDelete()">Keep it</button>' +
        '</div>' : ''}
    </form>
  `;
}

// Pre-fill the stone combobox after the form has been injected into the DOM.
function _sotdSchedInitCombo(entry) {
  if (entry && entry.stoneId) {
    const name = _sotdCalStoneName(entry.stoneId);
    const inp = document.getElementById('sotd-sched-stone-input');
    if (inp) inp.value = name;
  }
}

// Returns the HTML string for a read-only detail view (history or generated entry).
function _sotdSchedHistoryHTML(entry) {
  const stoneName = _sotdCalStoneName(entry.stoneId);
  const crystal   = CRYSTALS.find(c => c.i === entry.stoneId);
  const tier      = crystal ? (crystal.tier || crystal.t || '') : '';
  const chakra    = crystal ? (crystal.primary_chakra || crystal.pc || '') : '';

  const isEditorial = _isSotdEditorial(entry);
  const pres        = isEditorial ? getSotdEventPresentation(entry.eventCategory) : null;

  const sourceLabel = entry.source === 'history' ? 'Resolved' : 'Scheduled';
  const selType     = entry.selectionType || '';

  let eventBanner = '';
  if (isEditorial && pres) {
    eventBanner = `<div class="sotd-sched-event-banner sotd-sched-event-banner--${pres.family}">` +
      `<span class="sotd-sched-event-icon" aria-hidden="true">${pres.icon}</span>` +
      `<span class="sotd-sched-event-label">${entry.eventName || entry.eventCategory || ''}</span></div>`;
  }

  const metaRows = [
    entry.eventCategory  ? `<tr><th>Category</th><td>${entry.eventCategory}</td></tr>`  : '',
    entry.eventLocation  ? `<tr><th>Location</th><td>${entry.eventLocation}</td></tr>`  : '',
    entry.eventPriority != null ? `<tr><th>Priority</th><td>${entry.eventPriority}</td></tr>` : '',
    entry.editorialNote  ? `<tr><th>Editorial note</th><td>${entry.editorialNote}</td></tr>` : '',
    entry.sourceUrl && _isSafeUrl(entry.sourceUrl)
      ? `<tr><th>Source</th><td><a href="${entry.sourceUrl}" target="_blank" rel="noopener noreferrer" class="sotd-sched-link">${entry.sourceUrl}</a></td></tr>` : '',
  ].filter(Boolean).join('');

  return `
    <div class="sotd-sched-hist">
      ${eventBanner}
      <div class="sotd-sched-hist-stone">
        <div class="sotd-sched-hist-name">${stoneName || entry.stoneId}</div>
        <div class="sotd-sched-hist-meta">
          ${tier   ? `<span class="sotd-sched-hist-tag">${tier}</span>` : ''}
          ${chakra ? `<span class="sotd-sched-hist-tag">${chakra}</span>` : ''}
        </div>
      </div>
      <table class="sotd-sched-hist-table">
        <tr><th>Source</th><td>${sourceLabel}</td></tr>
        ${selType ? `<tr><th>Selection type</th><td>${selType}</td></tr>` : ''}
        ${metaRows}
      </table>
      <div class="sotd-sched-actions">
        <button type="button" class="sotd-sched-btn sotd-sched-btn--secondary"
          onclick="_sotdCalOpenStoneFromScheduler('${entry.stoneId}')">View stone</button>
        <button type="button" class="sotd-sched-btn sotd-sched-btn--ghost"
          onclick="closeSotdScheduler()">Close</button>
      </div>
    </div>
  `;
}

// Opens the encyclopedia detail drawer for a stone while the scheduler is open.
// The calendar return context is preserved so back-nav returns to the calendar.
function _sotdCalOpenStoneFromScheduler(stoneId) {
  const entry = _sotdSchedDate ? (_sotdCalEntryStore.get(_sotdSchedDate) || null) : null;
  closeSotdScheduler();
  setSotdContext('calendar', entry);
  detailReturnContext = { type: 'sotd-calendar', year: _sotdSchedYear, month: _sotdSchedMonth, entry };
  openDetail(stoneId);
}

// Reads the scheduler form and writes to stone_of_day_schedule.
async function _sotdCalSaveSchedule() {
  const stoneId     = (document.getElementById('sotd-sched-stone-val')?.value || '').trim();
  const eventName   = (document.getElementById('sotd-sched-event-name')?.value || '').trim();
  const eventCat    = (document.getElementById('sotd-sched-event-cat')?.value || '').trim();
  const eventLoc    = (document.getElementById('sotd-sched-event-loc')?.value || '').trim();
  const priorityRaw = (document.getElementById('sotd-sched-event-priority')?.value || '').trim();
  const editNote    = (document.getElementById('sotd-sched-editorial-note')?.value || '').trim();
  const sourceUrl   = (document.getElementById('sotd-sched-source-url')?.value || '').trim();

  const errEl  = document.getElementById('sotd-sched-error');
  const saveBtn = document.getElementById('sotd-sched-save-btn');

  function showError(msg) {
    if (errEl) { errEl.textContent = msg; errEl.hidden = false; }
  }
  function clearError() {
    if (errEl) { errEl.textContent = ''; errEl.hidden = true; }
  }

  clearError();

  if (!stoneId) { showError('Please select a stone before saving.'); return; }
  if (!_sotdSchedDate) { showError('No date selected — close and reopen the calendar.'); return; }

  const eventPriority = priorityRaw !== '' ? Number(priorityRaw) : null;
  const existingEntry = _sotdCalEntryStore.get(_sotdSchedDate);
  const isEdit = !!(existingEntry && existingEntry.source === 'schedule');

  if (saveBtn) { saveBtn.disabled = true; saveBtn.textContent = 'Saving…'; }

  const payload = {
    stone_id:       stoneId,
    event_name:     eventName   || null,
    event_category: eventCat    || null,
    event_location: eventLoc    || null,
    event_priority: eventPriority,
    editorial_note: editNote    || null,
    source_url:     sourceUrl   || null,
  };

  let error;
  if (isEdit) {
    ({ error } = await _supa
      .from('stone_of_day_schedule')
      .update(payload)
      .eq('feature_date', _sotdSchedDate)
      .eq('is_active', true));
  } else {
    ({ error } = await _supa
      .from('stone_of_day_schedule')
      .insert({
        ...payload,
        feature_date:   _sotdSchedDate,
        is_active:      true,
        selection_type: 'fixed',
      }));
  }

  if (error) {
    console.error('[SOTD Scheduler] Save failed:', error);
    showError(`Save failed: ${error.message || 'Unknown error'}. Please try again.`);
    if (saveBtn) {
      saveBtn.disabled = false;
      saveBtn.textContent = isEdit ? 'Save Changes' : 'Save Schedule';
    }
    return;
  }

  // Invalidate cache for this month and re-render the calendar.
  const key = `${_sotdSchedYear}-${String(_sotdSchedMonth).padStart(2,'0')}`;
  _sotdCalCache.delete(key);

  closeSotdScheduler();
  _sotdCalRenderMonth(_sotdSchedYear, _sotdSchedMonth);
}

// Shows the inline delete confirmation row.
function _sotdCalConfirmDelete() {
  const confirm = document.getElementById('sotd-sched-delete-confirm');
  const deleteBtn = document.getElementById('sotd-sched-delete-btn');
  if (confirm) confirm.hidden = false;
  if (deleteBtn) deleteBtn.hidden = true;
}

function _sotdCalCancelDelete() {
  const confirm = document.getElementById('sotd-sched-delete-confirm');
  const deleteBtn = document.getElementById('sotd-sched-delete-btn');
  if (confirm) confirm.hidden = true;
  if (deleteBtn) deleteBtn.hidden = false;
}

async function _sotdCalDeleteSchedule() {
  if (!_sotdSchedDate) return;

  const errEl = document.getElementById('sotd-sched-error');
  function showError(msg) {
    if (errEl) { errEl.textContent = msg; errEl.hidden = false; }
  }

  const { error } = await _supa
    .from('stone_of_day_schedule')
    .delete()
    .eq('feature_date', _sotdSchedDate)
    .eq('is_active', true);

  if (error) {
    console.error('[SOTD Scheduler] Delete failed:', error);
    showError(`Remove failed: ${error.message || 'Unknown error'}. Please try again.`);
    _sotdCalCancelDelete();
    return;
  }

  const key = `${_sotdSchedYear}-${String(_sotdSchedMonth).padStart(2,'0')}`;
  _sotdCalCache.delete(key);

  closeSotdScheduler();
  _sotdCalRenderMonth(_sotdSchedYear, _sotdSchedMonth);
}

// Keyboard: Escape also closes the scheduler if it is open.
document.addEventListener('keydown', function(e) {
  if (e.key !== 'Escape') return;
  const modal = document.getElementById('sotd-sched-modal');
  if (modal && modal.classList.contains('open')) {
    closeSotdScheduler();
  }
});

// ── end SOTD Scheduler ────────────────────────────────────────────────────────

// ── end SOTD Calendar ─────────────────────────────────────────────────────────
