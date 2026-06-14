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


const COLOR_HEX_MAP={'Purple':'#7a5a9a','Blue':'#4a7aaa','Green':'#4a8a5a','Pink':'#d4839a','Red':'#b04a4a','Orange':'#c4683a','Yellow':'#c9a832','Black':'#3a3530','White':'#d8d4ce','Brown':'#8b6f47','Gray':'#8a8a8a','Multi':'#9a7a8a'};

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
function noPhotoZoneHtml(c){
  const cats=(c.col_cats&&c.col_cats.length>0)?c.col_cats:[];
  const hexMap=COLOR_HEX_MAP;
  let orb=c.ch||'#d8d4ce';
  let extra='';
  if(cats.length>1){
    const cols=cats.slice(0,4).map(x=>hexMap[x]||c.ch||'#d8d4ce');
    const pct=100/cols.length;
    const stops=cols.map((col,i)=>`${col} ${i*pct}% ${(i+1)*pct}%`).join(', ');
    orb=`conic-gradient(${stops})`;
    extra=' multi';
  }
  return`<div class="card-img-zone no-photo"><span class="no-photo-orb${extra}" style="--orb:${orb};background:${orb}"></span></div>`;
}

function stripInlineCardColor(html){
  return String(html||'').replace(/<div class="card-color">[\s\S]*?<\/div>/,'');
}

function collectionPhotoUrl(photo){
  if(!photo)return'';
  if(typeof photo==='string')return photo;
  return photo.preview||photo.url||photo.signedUrl||photo.src||'';
}
function firstCollectionPhoto(p){
  const photos=(p&&p.photos)||[];
  const first=photos.length?photos[0]:null;
  return collectionPhotoUrl(first);
}
function allCollectionPhotos(p){
  return ((p&&p.photos)||[]).map(collectionPhotoUrl).filter(Boolean);
}
function firstEncyclopediaPhoto(c){
  if(!c)return'';
  const encPhotos=ENCYCLOPEDIA_PHOTOS[c.i];
  if(encPhotos&&encPhotos.length)return SUPABASE_ENC+encPhotos[0];
  const featuredMatch=FEATURED_STONES.find(s=>s.id===c.i);
  if(featuredMatch&&featuredMatch.photo)return SUPABASE_STONES+featuredMatch.photo;
  return'';
}
function collectionPhotoSources(p,c){
  const ownPhotos=allCollectionPhotos(p);
  if(ownPhotos.length)return ownPhotos;
  const refPhoto=firstEncyclopediaPhoto(c);
  return refPhoto?[refPhoto]:[];
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

// ── DETAIL DRAWER ──
// ── DRAWER PHOTO CAROUSEL ──
function buildDrawerPhotoHtml(srcs, name){
  if(!srcs || srcs.length === 0) return '';
  if(srcs.length === 1){
    const s = srcs[0].replace(/'/g,"\'");
    const n = name.replace(/'/g,"\'");
    return`<div class="drawer-ref-photo-col"><img class="drawer-ref-photo-thumb" src="${srcs[0]}" alt="${name} crystal specimen" onclick="openPhotoLightbox('${s}','${n}')"><span class="drawer-ref-photo-label" onclick="openPhotoLightbox('${s}','${n}')">Enlarge</span></div>`;
  }
  const dotsHtml = srcs.map((_,i)=>`<span class="drawer-photo-dot${i===0?' active':''}" onclick="drawerPhotoGoto(${i})"></span>`).join('');
  const firstSrc = srcs[0].replace(/'/g,"\'");
  const firstName = name.replace(/'/g,"\'");
  return`<div class="drawer-photo-carousel" id="drawer-carousel" data-srcs='${JSON.stringify(srcs)}' data-name='${name.replace(/'/g,"&#39;")}' data-idx="0">
    <div class="drawer-photo-main-wrap">
      <button class="drawer-photo-nav prev" onclick="drawerPhotoNav(-1)" aria-label="Previous photo">&#8249;</button>
      <img id="drawer-carousel-img" src="${srcs[0]}" alt="${name} crystal specimen" onclick="openPhotoLightbox('${firstSrc}','${firstName}')">
      <button class="drawer-photo-nav next" onclick="drawerPhotoNav(1)" aria-label="Next photo">&#8250;</button>
    </div>
    <div class="drawer-photo-dots" id="drawer-carousel-dots">${dotsHtml}</div>
    <span class="drawer-ref-photo-label" id="drawer-carousel-enlarge" onclick="openPhotoLightbox('${firstSrc}','${firstName}')">Enlarge</span>
  </div>`;
}
function buildDrawerNoPhotoHtml(c){
  const placeholder=noPhotoZoneHtml(c).replace('card-img-zone no-photo','drawer-ref-photo-thumb drawer-ref-photo-placeholder');
  return`<div class="drawer-ref-photo-col">${placeholder}</div>`;
}
function drawerPhotoNav(dir){
  const el = document.getElementById('drawer-carousel');
  if(!el) return;
  const srcs = JSON.parse(el.dataset.srcs);
  const name = el.dataset.name;
  let idx = (parseInt(el.dataset.idx) + dir + srcs.length) % srcs.length;
  drawerPhotoGoto(idx);
}
function drawerPhotoGoto(idx){
  const el = document.getElementById('drawer-carousel');
  if(!el) return;
  const srcs = JSON.parse(el.dataset.srcs);
  const name = el.dataset.name;
  idx = (idx + srcs.length) % srcs.length;
  el.dataset.idx = idx;
  const img = document.getElementById('drawer-carousel-img');
  const enl = document.getElementById('drawer-carousel-enlarge');
  const dots = document.querySelectorAll('#drawer-carousel-dots .drawer-photo-dot');
  if(img){ img.src = srcs[idx]; img.alt = name + ' crystal specimen'; }
  if(enl){
    const s = srcs[idx].replace(/'/g,"\'");
    const n = name.replace(/'/g,"\'");
    enl.onclick = ()=>openPhotoLightbox(s,n);
  }
  if(img){
    const s = srcs[idx].replace(/'/g,"\'");
    const n = name.replace(/'/g,"\'");
    img.onclick = ()=>openPhotoLightbox(s,n);
  }
  dots.forEach((d,i)=>d.classList.toggle('active',i===idx));
}

function openDetail(id){
  const c=CRYSTALS.find(x=>x.i===id);
  if(!c)return;
  currentCrystal=c;
  // Inject reference photo — encyclopedia photos first, then featured stones fallback
  const drawerPhotoWrap = document.getElementById('drawer-ref-photo');
  if(drawerPhotoWrap){
    const encPhotos = ENCYCLOPEDIA_PHOTOS[c.i];
    const featuredMatch = FEATURED_STONES.find(s=>s.id===id);
    if(encPhotos && encPhotos.length > 0){
      const srcs = encPhotos.map(f => SUPABASE_ENC + f);
      drawerPhotoWrap.innerHTML = buildDrawerPhotoHtml(srcs, c.n);
    } else if(featuredMatch && featuredMatch.photo){
      const imgSrc = `${SUPABASE_STONES}${featuredMatch.photo}`;
      drawerPhotoWrap.innerHTML = buildDrawerPhotoHtml([imgSrc], featuredMatch.name);
    } else {
      drawerPhotoWrap.innerHTML = buildDrawerNoPhotoHtml(c);
    }
  }
  document.getElementById('d-id').textContent=c.i;
  document.getElementById('d-name').textContent=c.n;
  document.getElementById('d-alt').textContent=c.a?'Also known as: '+c.a:'';
  document.getElementById('d-fam').textContent=c.fam+(c.sp&&c.sp!==c.fam?' · '+c.sp:'');
  
  document.getElementById('d-uw').textContent=c.uw||'—';
  document.getElementById('d-geo').textContent=c.g||'—';
  const toxMsg=TOXIC_NOTES[c.n]||c.tox||'';
  const toxBlock=document.getElementById('d-tox-block');
  if(toxBlock){if(toxMsg){document.getElementById('d-tox').textContent=toxMsg;toxBlock.style.display='';}else toxBlock.style.display='none';}
  document.getElementById('d-sy').textContent=c.sy||'—';
  document.getElementById('d-fo').textContent=c.fo||'—';
  document.getElementById('d-m').textContent=c.m?c.m+' Mohs':'—';
  document.getElementById('d-tr').textContent=c.tr||'—';
  document.getElementById('d-c').textContent=c.c||'—';
  document.getElementById('d-cc').textContent=c.cc||'—';
  document.getElementById('d-mt').textContent=c.mt||'—';
  const elW=document.getElementById('d-el-wrap');
  if(elW){if(c.element){document.getElementById('d-el').textContent=c.element;elW.style.display='';}else elW.style.display='none';}
  const cb=document.getElementById('d-chakra-block');
  if(cb){if(c.chakras&&c.chakras.length){document.getElementById('d-chakras').innerHTML=c.chakras.map(ch=>`<span class="chakra-chip">${ch}</span>`).join('');cb.style.display='';}else cb.style.display='none';}
  const zb=document.getElementById('d-zodiac-block');
  if(zb){if(c.zodiac){document.getElementById('d-zodiac').textContent=c.zodiac;zb.style.display='';}else zb.style.display='none';}
  const ab=document.getElementById('d-aff-block');
  if(ab){if(c.aff){document.getElementById('d-aff').textContent='"'+c.aff+'"';ab.style.display='';}else ab.style.display='none';}
  const tags=[c.er1,c.er2,c.er3].filter(Boolean);
  document.getElementById('d-tags').innerHTML=tags.map((t,i)=>`<span class="tag${i===0?' primary':''}">${t}</span>`).join('');
  const sb=document.getElementById('d-sib-block');
  if(sb){const fe=Object.entries(SP_FAM).find(([,ids])=>ids.includes(c.i));if(fe){const oth=fe[1].filter(id=>id!==c.i).map(id=>CRYSTALS.find(x=>x.i===id)).filter(Boolean);if(oth.length){document.getElementById('d-sibs').innerHTML=oth.map(s=>`<span class="sib-tag" onclick="openDetail('${s.i}')">${s.n}</span>`).join('');sb.style.display='';}else sb.style.display='none';}else sb.style.display='none';}
  updateDrawerStatus(c.i);
  _renderSotdEventBanner();
  document.getElementById('drawer-overlay').classList.add('open');
  document.getElementById('detail-drawer').classList.add('open');
}

function openDetailWhenReady(id,tries=0){
  if(!id)return;
  const found=CRYSTALS.find(x=>x.i===id);
  const drawer=document.getElementById('detail-drawer');
  if(found&&drawer){
    openDetail(id);
    return;
  }
  if(tries<20)setTimeout(()=>openDetailWhenReady(id,tries+1),150);
}

function stoneSlug(v){
  return normalizeStoneName(v).replace(/\s+/g,'-');
}

function findStoneEntry(identifier,name){
  const idText=String(identifier||'').trim();
  const idLower=idText.toLowerCase();
  const idNorm=normalizeStoneName(idText);
  const idSlug=stoneSlug(idText);
  const nameNorm=normalizeStoneName(name);
  const nameSlug=stoneSlug(name);
  return CRYSTALS.find(x=>String(x.i).toLowerCase()===idLower)
    || CRYSTALS.find(x=>stoneSlug(x.slug||'')===idSlug)
    || CRYSTALS.find(x=>stoneSlug(x.n)===idSlug)
    || CRYSTALS.find(x=>nameSlug&&stoneSlug(x.n)===nameSlug)
    || CRYSTALS.find(x=>{
      const alt=normalizeStoneName(x.a);
      return !!nameNorm&&(alt.split(/\s*,\s*/).some(a=>normalizeStoneName(a)===nameNorm)||alt.includes(nameNorm));
    })
    || CRYSTALS.find(x=>{
      const n=normalizeStoneName(x.n);
      return !!idNorm&&(n.includes(idNorm)||idNorm.includes(n));
    });
}

let pendingDirectStoneOpen=null;

function openPendingStoneEntry(identifier,name){
  const found=findStoneEntry(identifier,name);
  const drawer=document.getElementById('detail-drawer');
  if(!found){
    console.warn('Still Point: no encyclopedia stone matched deep link', {identifier,name,stoneCount:CRYSTALS.length});
    return false;
  }
  if(!drawer){
    console.warn('Still Point: encyclopedia drawer is not available for deep link', {identifier,name,matchedId:found.i});
    return false;
  }
  try{
    dismissEncDoorway();
    openDetail(found.i);
    return document.getElementById('detail-drawer')?.classList.contains('open') || false;
  }catch(err){
    console.warn('Still Point: matched stone but could not open encyclopedia drawer', {identifier,name,matchedId:found.i,error:err});
    return false;
  }
}

function resolveDirectStoneOpen(){
  if(!pendingDirectStoneOpen)return false;
  if(!document.getElementById('tab-encyclopedia'))return false;
  showEncyclopediaForDirectStoneOpen();
  const opened=openPendingStoneEntry(pendingDirectStoneOpen.identifier,pendingDirectStoneOpen.name);
  if(opened)pendingDirectStoneOpen=null;
  return opened;
}

function queueDirectStoneOpen(identifier,name){
  if(!identifier)return false;
  pendingDirectStoneOpen={identifier,name:name||''};
  return resolveDirectStoneOpen();
}

function showEncyclopediaForDirectStoneOpen(){
  clearInitialTabStyle();
  closeMobileNav();
  rememberActiveTab('encyclopedia');
  document.querySelectorAll('main>section').forEach(s=>s.style.display='none');
  document.querySelectorAll('.nav-tab').forEach(b=>b.classList.remove('active'));
  const tab=document.getElementById('tab-encyclopedia');
  if(tab)tab.style.display='block';
  const navBtn=getTabButton('encyclopedia');
  navBtn?.classList.add('active');
}

function closeDrawer(){
  document.getElementById('drawer-overlay').classList.remove('open');
  document.getElementById('detail-drawer').classList.remove('open');
  currentCrystal=null;
  if(detailReturnContext&&detailReturnContext.type==='collection'){
    const ctx=detailReturnContext;
    detailReturnContext=null;
    switchTabByName('collection');
    setTimeout(()=>{
      let idx=-1;
      if(ctx.pieceId!==null&&ctx.pieceId!==undefined){
        idx=collection.findIndex(p=>String(p.id)===String(ctx.pieceId));
      }
      if(idx<0&&ctx.idx!==null&&ctx.idx!==undefined)idx=ctx.idx;
      if(idx>=0&&collection[idx])openCollDetail(idx);
    },0);
  } else if(detailReturnContext&&detailReturnContext.type==='wishlist'){
    detailReturnContext=null;
    switchTabByName('collection');
    setTimeout(()=>setCollQuickFilter('wish'),0);
  } else if(detailReturnContext&&detailReturnContext.type==='grid'){
    const ctx=detailReturnContext;
    detailReturnContext=null;
    switchTabByName('101');
    setTimeout(()=>{
      show101('grids');
      if(ctx.gridId) openGridModal(ctx.gridId);
    },0);
  } else if(detailReturnContext&&detailReturnContext.type==='energeticRole'){
    const ctx=detailReturnContext;
    detailReturnContext=null;
    switchTabByName('101');
    setTimeout(()=>{
      show101('roles');
      const tiles=document.getElementById('s101-roles-tiles');
      const result=document.getElementById('s101-roles-result');
      const title=document.getElementById('s101-roles-result-title');
      if(result&&title&&ctx.slug===_activeEnergeticRoleSlug&&_activeEnergeticRoleRows.length){
        // cache is warm — re-render in place without re-fetching
        if(tiles)tiles.style.display='none';
        result.style.display='';
        title.textContent=ENERGETIC_ROLE_LABELS[ctx.slug]||ctx.slug;
        _renderEnergeticRoleGrid();
        setTimeout(()=>{window.scrollTo({top:ctx.scrollY||0,behavior:'instant'});},0);
      }else if(ctx.slug){
        openEnergeticRole(ctx.slug).then(()=>{
          setTimeout(()=>{window.scrollTo({top:ctx.scrollY||0,behavior:'instant'});},200);
        });
      }
    },80);
  } else if(detailReturnContext&&detailReturnContext.type==='usewhen'){
    const ctx=detailReturnContext;
    detailReturnContext=null;
    switchTabByName('mood');
    setTimeout(()=>{window.scrollTo({top:ctx.scrollY||0,behavior:'instant'});},0);
  } else if(detailReturnContext&&detailReturnContext.type==='starterStone'){
    const ctx=detailReturnContext;
    detailReturnContext=null;
    setTimeout(()=>{
      if(ctx&&Number.isInteger(ctx.index)){
        openStarterStoneModal(ctx.index, ctx.source);
      }
    },0);
  } else if(detailReturnContext&&detailReturnContext.type==='home-sotd'){
    detailReturnContext=null;
  } else if(detailReturnContext&&detailReturnContext.type==='sotd'){
    detailReturnContext=null;
    window.location.href='index.html#desktop-sotd-section';
  } else if(detailReturnContext&&detailReturnContext.type==='sotd-calendar'){
    // Calendar stays open behind the drawer — nothing to re-open.
    // Clear context so subsequent drawer closes don't re-trigger this branch.
    detailReturnContext=null;
  }
  clearSotdContext();
  _renderSotdEventBanner();
}
let photoLightboxSources=[];
let photoLightboxIndex=0;
let photoLightboxAlt='';
let photoLightboxLabels=null;
function openPhotoLightbox(src,alt){
  const lb=document.getElementById('photo-lightbox');
  const img=document.getElementById('photo-lightbox-img');
  if(!lb||!img)return;
  photoLightboxAlt=alt||'';
  photoLightboxLabels=null;
  photoLightboxSources=[src];
  photoLightboxIndex=0;
  const carousel=document.getElementById('drawer-carousel');
  if(carousel && carousel.dataset.srcs){
    try{
      const srcs=JSON.parse(carousel.dataset.srcs);
      const found=srcs.indexOf(src);
      if(srcs.length>0){
        photoLightboxSources=srcs;
        photoLightboxIndex=found>=0?found:(parseInt(carousel.dataset.idx)||0);
      }
    }catch(e){}
  }
  setPhotoLightboxImage();
  lb.classList.toggle('has-nav',photoLightboxSources.length>1);
  lb.classList.add('open');
  document.body.style.overflow='hidden';
}
function setPhotoLightboxImage(){
  const img=document.getElementById('photo-lightbox-img');
  const label=document.getElementById('photo-lightbox-label');
  if(!img)return;
  const src=photoLightboxSources[photoLightboxIndex];
  img.src=src;
  const activeLabel=(photoLightboxLabels&&photoLightboxLabels[photoLightboxIndex])||photoLightboxAlt||'Crystal reference photo';
  img.alt=activeLabel;
  if(label){
    label.textContent=activeLabel;
    label.style.display=activeLabel?'block':'none';
  }
}
function photoLightboxNav(dir){
  if(!photoLightboxSources || photoLightboxSources.length<2)return;
  photoLightboxIndex=(photoLightboxIndex+dir+photoLightboxSources.length)%photoLightboxSources.length;
  setPhotoLightboxImage();
}
function closePhotoLightbox(){
  const lb=document.getElementById('photo-lightbox');
  if(lb){lb.classList.remove('open');lb.classList.remove('has-nav');}
  photoLightboxLabels=null;
  const label=document.getElementById('photo-lightbox-label');
  if(label)label.textContent='';
  document.body.style.overflow='';
}
function openCollectionPhotoLightbox(idx,startIndex,event){
  if(event)event.stopPropagation();
  const p=collection[idx];
  if(!p)return;
  const c=CRYSTALS.find(x=>x.i===p.crystalId);
  const sources=collectionPhotoSources(p,c);
  if(!sources.length)return;
  const lb=document.getElementById('photo-lightbox');
  if(!lb)return;
  photoLightboxSources=sources;
  photoLightboxIndex=Math.max(0,Math.min(startIndex||0,sources.length-1));
  photoLightboxLabels=null;
  photoLightboxAlt=(c&&c.n)||collPieceName(p,c)||'Collection photo';
  setPhotoLightboxImage();
  lb.classList.toggle('has-nav',photoLightboxSources.length>1);
  lb.classList.add('open');
  document.body.style.overflow='hidden';
}
document.addEventListener('keydown',function(e){
  const lb=document.getElementById('photo-lightbox');
  if(!lb || !lb.classList.contains('open'))return;
  if(e.key==='ArrowLeft') photoLightboxNav(-1);
  if(e.key==='ArrowRight') photoLightboxNav(1);
  if(e.key==='Escape') closePhotoLightbox();
});
function filterByFamily(){
  if(!currentCrystal)return;
  const fam=currentCrystal.fam;
  closeDrawer();
  if(!document.getElementById('tab-encyclopedia')){
    const target=new URL('encyclopedia.html',window.location.href);
    target.searchParams.set('fam',fam);
    window.location.href=target.href;
    return;
  }
  jumpToFamily(fam);
}

const PENDING_DRAWER_ACTION_KEY='spl_pending_drawer_action';

function savePendingDrawerAction(actionType,stone){
  if(!stone||!stone.i)return;
  try{
    sessionStorage.setItem(PENDING_DRAWER_ACTION_KEY,JSON.stringify({
      action:actionType,
      stoneId:stone.i,
      stoneName:stone.n||'',
      returnPath:window.location.pathname+window.location.search+window.location.hash
    }));
  }catch(e){}
}

function readPendingDrawerAction(){
  try{
    const raw=sessionStorage.getItem(PENDING_DRAWER_ACTION_KEY);
    return raw?JSON.parse(raw):null;
  }catch(e){return null;}
}

function clearPendingDrawerAction(){
  try{sessionStorage.removeItem(PENDING_DRAWER_ACTION_KEY);}catch(e){}
}

function pendingDrawerAuthReason(actionType){
  return actionType==='add_to_wishlist'?'save-wishlist':'save-collection';
}

function requestDrawerSaveSignIn(actionType){
  if(!currentCrystal)return;
  savePendingDrawerAction(actionType,currentCrystal);
  _openAuth(pendingDrawerAuthReason(actionType));
}

function updateDrawerStatus(id){
  const isOwned=!!owned[id];
  const isWish=!!wish[id];
  const pillOwned=document.getElementById('drawer-pill-owned');
  const pillWish=document.getElementById('drawer-pill-wish');
  if(pillOwned){
    pillOwned.textContent=isOwned?'♥ In your collection':'+ Add to collection';
    pillOwned.classList.toggle('drawer-pill-active',isOwned);
  }
  if(pillWish){
    pillWish.textContent=isWish?'♥ On your wishlist':'♡ Add to wishlist';
    pillWish.classList.toggle('drawer-pill-active',isWish);
  }
  const viewLinks=document.getElementById('drawer-view-links');
  const viewColl=document.getElementById('drawer-view-coll');
  const viewWish=document.getElementById('drawer-view-wish');
  if(viewLinks){
    if(viewColl) viewColl.style.display=isOwned?'inline':'none';
    if(viewWish) viewWish.style.display=isWish?'inline':'none';
    viewLinks.style.display=(isOwned||isWish)?'flex':'none';
  }
}

function drawerCollectionAction(){
  if(!currentCrystal)return;
  if(owned[currentCrystal.i]){
    // Already owned — remove via synced toggle
    toggleOwned();
  } else {
    // Not owned — open add piece form
    addFromDetail();
  }
}
function drawerWishlistAction(){
  if(!currentCrystal)return;
  const wasWished=!!wish[currentCrystal.i];
  // Use synced toggleWish (saves to Supabase for logged-in users)
  toggleWish();
  if(!wasWished){
    // Brief confirmation on add
    const pill=document.getElementById('drawer-pill-wish');
    if(pill){pill.textContent='✓ Added!';setTimeout(()=>{updateDrawerStatus(currentCrystal?.i);},1200);}
  }
}
function updateDrawerStatus(id){
  const isOwned=!!owned[id];
  const isWish=!!wish[id];
  const signedIn=!!_currentUser;
  const pillOwned=document.getElementById('drawer-pill-owned');
  const pillWish=document.getElementById('drawer-pill-wish');
  if(pillOwned){
    pillOwned.textContent=isOwned?'In your collection':(signedIn?'Add to collection':'Save to collection');
    pillOwned.classList.toggle('drawer-pill-active',isOwned);
  }
  if(pillWish){
    pillWish.textContent=isWish?'On your wishlist':(signedIn?'Add to wishlist':'Save to wishlist');
    pillWish.classList.toggle('drawer-pill-active',isWish);
  }
  const viewLinks=document.getElementById('drawer-view-links');
  const viewColl=document.getElementById('drawer-view-coll');
  const viewWish=document.getElementById('drawer-view-wish');
  if(viewLinks){
    if(viewColl) viewColl.style.display=isOwned?'inline':'none';
    if(viewWish) viewWish.style.display=isWish?'inline':'none';
    viewLinks.style.display=(isOwned||isWish)?'flex':'none';
  }
}

function drawerCollectionAction(){
  if(!currentCrystal)return;
  if(!_currentUser){
    requestDrawerSaveSignIn('add_to_collection');
    return;
  }
  if(owned[currentCrystal.i])toggleOwned();
  else addFromDetail();
}

function drawerWishlistAction(){
  if(!currentCrystal)return;
  if(!_currentUser){
    requestDrawerSaveSignIn('add_to_wishlist');
    return;
  }
  const wasWished=!!wish[currentCrystal.i];
  toggleWish();
  if(!wasWished){
    const pill=document.getElementById('drawer-pill-wish');
    if(pill){pill.textContent='Added!';setTimeout(()=>{updateDrawerStatus(currentCrystal?.i);},1200);}
  }
}
// toggleOwned and toggleWish are defined as window.toggleOwned / window.toggleWish
// near the Supabase write layer (async, Supabase-backed).
function addFromDetail(){
  const c=currentCrystal;
  const savedCtx=detailReturnContext;
  detailReturnContext=null;
  addPieceReturnContext=savedCtx&&savedCtx.type==='sotd'
    ?{type:'sotd',stoneId:c?.i||null}
    :{type:'encyclopedia',stoneId:c?.i||null};
  closeDrawer();
  openAddForm(c?.i);
}

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

