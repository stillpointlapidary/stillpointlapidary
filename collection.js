// ── COLLECTION ──
function syncCollMobileToggle(mode){
  const isWish=mode==='wish'||mode==='tier-wish';
  const chipColl=document.getElementById('coll-chip-collection');
  const chipWish=document.getElementById('coll-chip-wish');
  if(chipColl)chipColl.classList.toggle('coll-chip--active',!isWish);
  if(chipWish)chipWish.classList.toggle('coll-chip--active',isWish);
}

function collMobileTab(mode){
  setCollQuickFilter(mode);
  const isWish=mode==='wish'||mode==='tier-wish';
  const chipColl=document.getElementById('coll-chip-collection');
  const chipWish=document.getElementById('coll-chip-wish');
  if(chipColl)chipColl.classList.toggle('coll-chip--active',!isWish);
  if(chipWish)chipWish.classList.toggle('coll-chip--active',isWish);
}

// ── Mobile filter bottom sheet ──

function openMobileFilterSheet(){
  buildMobileFilterSheet();
  syncSortPanelChecks();
  const sortValEl=document.getElementById('coll-fsval-sort');
  if(sortValEl) sortValEl.textContent=_COLL_SORT_OPTS.find(o=>o.val===_collMobileSort)?.label||'Recently added';
  document.getElementById('coll-fs-overlay').classList.add('open');
  document.getElementById('coll-fs').classList.add('open');
  document.getElementById('coll-fs').classList.remove('sort-open');
  document.body.style.overflow='hidden';
}

function closeMobileFilterSheet(){
  document.getElementById('coll-fs-overlay').classList.remove('open');
  document.getElementById('coll-fs').classList.remove('open');
  document.body.style.overflow='';
}

function buildMobileFilterSheet(){
  const forms=['Tumble','Palm Stone','Worry Stone','Heart','Sphere','Egg','Tower','Pyramid','Cube','Freeform','Flame','Bowl / Dish','Raw / Natural','Specimen','Point','Cluster','Geode','Druzy','Slice / Slab','Moon','Star','Mushroom','Wand','Carving','Other'];
  const sizes=['XS','S','M','L','XL'];
  const cfams=[...new Set(CRYSTALS.map(c=>c.fam||'').filter(Boolean))].sort();
  const materials=[...new Set(CRYSTALS.map(c=>c.mt||'').filter(Boolean))].sort();
  const formations=[...new Set(CRYSTALS.map(c=>c.fo||'').filter(Boolean))].sort();
  const usedShelves=[...new Set(collection.map(p=>p.shelf||p.locCustom||'').filter(Boolean))].sort();
  const shelfOpts=usedShelves.length?usedShelves:['Shelf 1','Shelf 2','Shelf 3','Shelf 4','Altar','Bedside','Cabinet','Office desk'];
  const colorOpts=(typeof COLOR_OPTS!=='undefined'?COLOR_OPTS:[]);
  const chakraOpts=(typeof CHAKRA_OPTS!=='undefined'?CHAKRA_OPTS:[]);
  const themeOpts=(typeof THEME_OPTS!=='undefined'?THEME_OPTS:[]);
  const mohsOpts=[{val:'soft',label:'Soft (1–4)'},{val:'medium',label:'Medium (5–6)'},{val:'hard',label:'Hard (7+)'}];

  const defs={
    ccolor: colorOpts,
    cchakra: chakraOpts,
    ctheme: themeOpts,
    cfam: cfams,
    form: forms,
    size: sizes,
    cshelf: shelfOpts,
    cmohs: mohsOpts,
    cformation: formations,
    cmaterial: materials
  };

  Object.keys(defs).forEach(key=>{
    const container=document.getElementById('coll-fspills-'+key);
    if(!container||container.dataset.built==='1')return;
    container.dataset.built='1';
    const opts=defs[key];
    const cur=collFilters[key]||'all';
    container.innerHTML='<button class="fpill'+(cur==='all'?' active':'')+'" onclick="mobileSetFilter(\''+key+'\',\'all\',this)">All</button>'+
      opts.map(o=>{
        const val=typeof o==='object'?(o.val||o):o;
        const lbl=typeof o==='object'?(o.label||o.val||o):o;
        const swatch=key==='ccolor'&&o.hex?'<span class="cswatch" style="background:'+o.hex+'"></span>':'';
        return'<button class="fpill'+(cur===String(val)?' active':'')+'" data-value="'+escapeAttr(String(val))+'" onclick="mobileSetFilter(\''+key+'\','+jsArg(String(val))+',this)">'+swatch+escapeAttr(String(lbl))+'</button>';
      }).join('');
  });
  updateMobileFilterValues();
}

function mobileSetFilter(key,val,btn){
  collFilters[key]=val;
  document.querySelectorAll('#cpills-'+key+' .fpill').forEach(p=>p.classList.remove('active'));
  document.querySelectorAll('#coll-fspills-'+key+' .fpill').forEach(p=>p.classList.remove('active'));
  if(btn)btn.classList.add('active');
  const safeVal=val.replace(/"/g,'\\"');
  const desktopPill=document.querySelector('#cpills-'+key+' .fpill[data-value="'+safeVal+'"]');
  if(desktopPill)desktopPill.classList.add('active');
  else if(val==='all'){const first=document.querySelector('#cpills-'+key+' .fpill');if(first)first.classList.add('active');}
  updateBtn('cfbtn-'+key,'cfval-'+key,val);
  updateMobileFilterValues();
  updateMobileFilterBar();
  renderCollection();
}

function toggleMobileFilterRow(key){
  const pills=document.getElementById('coll-fspills-'+key);
  const chev=document.getElementById('coll-fschev-'+key);
  if(!pills)return;
  const isOpen=pills.classList.contains('open');
  pills.classList.toggle('open',!isOpen);
  if(chev)chev.classList.toggle('open',!isOpen);
}

function updateMobileFilterValues(){
  const keyToLabel={
    ccolor:'ccolor',cchakra:'cchakra',ctheme:'ctheme',cfam:'cfam',
    form:'form',size:'size',cshelf:'cshelf',
    cmohs:'cmohs',cformation:'cformation',cmaterial:'cmaterial'
  };
  let moreActive=0;
  Object.keys(keyToLabel).forEach(key=>{
    const val=collFilters[key]||'all';
    const el=document.getElementById('coll-fsval-'+key);
    if(el){el.textContent=val==='all'?'All':String(val);el.classList.toggle('active-val',val!=='all');}
    if(['cmohs','cformation','cmaterial'].includes(key)&&val!=='all')moreActive++;
  });
  const moreEl=document.getElementById('coll-fsval-more');
  if(moreEl){moreEl.textContent=moreActive>0?moreActive+' active':'All';moreEl.classList.toggle('active-val',moreActive>0);}
}

function updateMobileFilterBar(){
  const keys=['cfam','ctheme','ccolor','cchakra','cmohs','cformation','cmaterial','form','size','cshelf'];
  const n=keys.filter(k=>collFilters[k]&&collFilters[k]!=='all').length;
  const hasCustomSort=_collMobileSort!=='recent';
  const sortLabel=_COLL_SORT_OPTS.find(o=>o.val===_collMobileSort)?.label||'Recently added';
  let text;
  if(n===0&&!hasCustomSort) text='Filter & Sort';
  else if(n>0&&!hasCustomSort) text=n===1?'1 Filter Applied':n+' Filters Applied';
  else if(n===0&&hasCustomSort) text='Sorted: '+sortLabel;
  else text=n+(n===1?' Filter':' Filters')+' · '+sortLabel;
  const lbl=document.getElementById('coll-mfr-label');
  const row=document.getElementById('coll-mobile-filter-row');
  if(lbl)lbl.textContent=text;
  if(row)row.classList.toggle('has-filters',n>0||hasCustomSort);
}

function clearMobileFilters(){
  resetCollFilters();
  document.querySelectorAll('[id^="coll-fspills-"]').forEach(c=>c.dataset.built='');
  buildMobileFilterSheet();
  updateMobileFilterValues();
  updateMobileFilterBar();
  closeMobileFilterSheet();
}

function applyMobileFilters(){
  closeMobileFilterSheet();
}

function openSortPanel(){
  syncSortPanelChecks();
  document.getElementById('coll-fs').classList.add('sort-open');
}

function closeSortPanel(){
  document.getElementById('coll-fs').classList.remove('sort-open');
}

function syncSortPanelChecks(){
  document.querySelectorAll('.coll-fs-sort-option').forEach(el=>{
    el.classList.toggle('active', el.dataset.sort === _collMobileSort);
  });
}

function applyCollMobileSort(items){
  if(_collMobileSort==='recent') return items;
  const arr=[...items];
  const crystalOf=p=>resolveStoneById(p.crystalId);
  switch(_collMobileSort){
    case 'name-az':
      arr.sort((a,b)=>{
        const na=a.nickname||(crystalOf(a)?.n||'');
        const nb=b.nickname||(crystalOf(b)?.n||'');
        return na.localeCompare(nb);
      });break;
    case 'name-za':
      arr.sort((a,b)=>{
        const na=a.nickname||(crystalOf(a)?.n||'');
        const nb=b.nickname||(crystalOf(b)?.n||'');
        return nb.localeCompare(na);
      });break;
    case 'tier':
      arr.sort((a,b)=>(Number(crystalOf(a)?.tier)||99)-(Number(crystalOf(b)?.tier)||99));
      break;
    case 'color':
      arr.sort((a,b)=>(crystalOf(a)?.col_cat||'').localeCompare(crystalOf(b)?.col_cat||''));
      break;
    case 'chakra':
      arr.sort((a,b)=>((crystalOf(a)?.chakras||[])[0]||'').localeCompare(((crystalOf(b)?.chakras||[])[0]||'')));
      break;
  }
  return arr;
}

function setMobileSort(val){
  _collMobileSort = val;
  syncSortPanelChecks();
  const sortLabel = _COLL_SORT_OPTS.find(o=>o.val===val)?.label || 'Recently added';
  const valEl = document.getElementById('coll-fsval-sort');
  if(valEl) valEl.textContent = sortLabel;
  updateMobileFilterBar();
  renderCollection();
  closeSortPanel();
}

function renderMobileProgressCard(){
  const container=document.getElementById('coll-progress-tiers');
  if(!container||!CRYSTALS.length)return;
  const displayCollection=dedupedCollectionItems(collection);
  const ownedIds=new Set(displayCollection.map(p=>p.crystalId));
  const wishIds=new Set(Object.keys(wish));
  const tiers=[
    {num:1,label:'Essentials'},
    {num:2,label:'Shelf Builders'},
    {num:3,label:'Favorites'},
    {num:4,label:'Rare Finds'},
  ];
  container.innerHTML=tiers.map(t=>{
    const tierStones=CRYSTALS.filter(c=>c.tier===t.num||Number(c.tier)===t.num);
    const total=tierStones.length;
    if(!total)return'<div class="coll-pt-col"><div class="coll-pt-label">'+t.label+'</div><div class="coll-pt-pct">—</div><div class="coll-pt-track"></div></div>';
    const owned=tierStones.filter(c=>ownedIds.has(c.i)).length;
    const wl=tierStones.filter(c=>wishIds.has(c.i)).length;
    const pct=Math.round(owned/total*100);
    const ownedW=(owned/total*100).toFixed(1);
    const wlW=Math.min(wl/total*100,100-parseFloat(ownedW)).toFixed(1);
    return`<div class="coll-pt-col">
      <div class="coll-pt-label">${t.label}</div>
      <div class="coll-pt-pct">${pct}%</div>
      <div class="coll-pt-track"><div class="coll-pt-owned" style="width:${ownedW}%"></div><div class="coll-pt-wish" style="width:${wlW}%"></div></div>
    </div>`;
  }).join('');
}

let _syncToastTimer=null;
function showCollSyncToast(msg){
  if(!isMobileView())return;
  const el=document.getElementById('coll-sync-toast');
  if(!el)return;
  el.textContent=msg;
  el.classList.add('show');
  if(_syncToastTimer)clearTimeout(_syncToastTimer);
  _syncToastTimer=setTimeout(()=>el.classList.remove('show'),2200);
}

function openCollFabSheet(){
  document.getElementById('coll-fab-overlay').classList.add('open');
  document.getElementById('coll-fab-sheet').classList.add('open');
  document.body.style.overflow='hidden';
}

function closeCollFabSheet(){
  document.getElementById('coll-fab-overlay').classList.remove('open');
  document.getElementById('coll-fab-sheet').classList.remove('open');
  document.body.style.overflow='';
}

function setCollQuickFilter(mode){
  collQuickFilter=mode;
  // Update active stat cell
  document.querySelectorAll('.stat-clickable').forEach(el=>el.classList.remove('active-stat'));
  const cellMap={'all':'stat-cell-total','wish':'stat-cell-wish'};
  const cell=document.getElementById(cellMap[mode]);
  if(cell)cell.classList.add('active-stat');
  syncCollMobileToggle(mode);
  renderCollection();
}

function openFamilyDetail(fam){
  collQuickFilter='__family__';
  collActiveFamilyName=fam;
  document.querySelectorAll('.stat-clickable').forEach(el=>el.classList.remove('active-stat'));
  const total=document.getElementById('stat-cell-total');
  if(total)total.classList.add('active-stat');
  renderCollection();
  const wrap=document.getElementById('coll-wrap');
  if(wrap){const y=wrap.getBoundingClientRect().top+window.scrollY-120;window.scrollTo({top:Math.max(0,y),behavior:'smooth'});}
}
function setCollFamilyFilter(fam){
  collQuickFilter='all';
  collFilters.cfam=fam;
  document.querySelectorAll('.stat-clickable').forEach(el=>el.classList.remove('active-stat'));
  const total=document.getElementById('stat-cell-total');
  if(total)total.classList.add('active-stat');
  renderCollection();
  // Show a "back to families" banner above the results
  const wrap=document.getElementById('coll-wrap');
  if(wrap){
    const banner=document.createElement('div');
    banner.id='fam-back-banner';
    banner.style.cssText='display:flex;align-items:center;gap:10px;margin-bottom:1rem;padding:8px 12px;background:var(--stone2);border-radius:8px;font-family:Jost,sans-serif;font-size:12px;letter-spacing:0.06em;text-transform:uppercase;color:var(--ink2)';
    banner.innerHTML='<button onclick="setCollQuickFilter(\'families\')" style="background:none;border:none;cursor:pointer;font-family:Jost,sans-serif;font-size:12px;letter-spacing:0.06em;text-transform:uppercase;color:var(--accent);padding:0">← All Families</button><span style="color:var(--ink3)">·</span><span>'+fam+'</span>';
    wrap.insertBefore(banner,wrap.firstChild);
  }
  scrollPageTop();
}

function filterCollByTierOwned(tierNum){
  _collTierNum=tierNum;
  collQuickFilter='tier-owned';
  document.querySelectorAll('.stat-clickable').forEach(el=>el.classList.remove('active-stat'));
  renderCollection();
  const wrap=document.getElementById('coll-wrap');
  if(wrap){setTimeout(()=>{const y=wrap.getBoundingClientRect().top+window.scrollY-120;window.scrollTo({top:Math.max(0,y),left:0,behavior:'smooth'});},50);}
}
function filterCollByTierWish(tierNum){
  _collTierNum=tierNum;
  collQuickFilter='tier-wish';
  document.querySelectorAll('.stat-clickable').forEach(el=>el.classList.remove('active-stat'));
  renderCollection();
  const wrap=document.getElementById('coll-wrap');
  if(wrap){setTimeout(()=>{const y=wrap.getBoundingClientRect().top+window.scrollY-120;window.scrollTo({top:Math.max(0,y),left:0,behavior:'smooth'});},50);}
}

// ── Mobile sort state ──
let _collMobileSort = 'recent';
const _COLL_SORT_OPTS = [
  {val:'recent',  label:'Recently added'},
  {val:'name-az', label:'Stone name A–Z'},
  {val:'name-za', label:'Stone name Z–A'},
  {val:'tier',    label:'Collector tier'},
  {val:'color',   label:'Color'},
  {val:'chakra',  label:'Chakra'},
];

// ── Collection Tier Bars ──
let _tierWishlistOn = true;

function renderTierBars(){
  const container = document.getElementById('tier-bars');
  if(!container||!CRYSTALS.length)return;
  const displayCollection=dedupedCollectionItems(collection);
  const ownedIds=new Set(displayCollection.map(p=>p.crystalId));
  const wishIds=new Set(Object.keys(wish));
  const tiers=[
    {num:1,label:'The Essentials'},
    {num:2,label:'Shelf Builders'},
    {num:3,label:'Collector Favorites'},
    {num:4,label:'Rare Finds'},
  ];

  const showWish = _tierWishlistOn;

  const colHeaders = `<div class="tier-bar-headers${showWish?'':' no-wish'}">
    <div></div><div></div>
    <div class="tier-bar-col-hdr owned-hdr">Owned</div>
    ${showWish?'<div class="tier-bar-col-hdr wish-hdr">Wishlist</div>':''}
    <div class="tier-bar-col-hdr">In Tier</div>
    <div class="tier-bar-col-hdr">%</div>
  </div>`;

  const rows = tiers.map(t=>{
    const tierStones=CRYSTALS.filter(c=>c.tier===t.num||Number(c.tier)===t.num);
    const total=tierStones.length;
    if(!total)return'';
    const owned=tierStones.filter(c=>ownedIds.has(c.i)).length;
    const wl=tierStones.filter(c=>wishIds.has(c.i)).length;
    const pct=Math.round(owned/total*100);
    const ownedW=(owned/total*100).toFixed(1);
    const wlW=showWish?Math.min(wl/total*100,100-parseFloat(ownedW)).toFixed(1):'0';
    return`<div class="tier-bar-row${showWish?'':' no-wish'}">
      <div class="tier-bar-lbl tb-lbl-click" onclick="jumpToFilteredEncyclopedia('tier','${t.num}')" title="Browse ${t.label} in Encyclopedia">${t.label}</div>
      <div class="tier-bar-track"><div class="tier-bar-owned" style="width:${ownedW}%"></div><div class="tier-bar-wish" style="width:${wlW}%"></div></div>
      <div class="tier-bar-num owned${owned>0?' tb-click':''}" data-label="Owned" ${owned>0?`onclick="filterCollByTierOwned(${t.num})" title="View ${owned} owned piece${owned===1?'':'s'}"`:''}>${owned}</div>
      ${showWish?`<div class="tier-bar-num wish${wl===0?' dim':''}${wl>0?' tb-click':''}" data-label="Wishlist" ${wl>0?`onclick="filterCollByTierWish(${t.num})" title="View ${wl} wishlist item${wl===1?'':'s'}"`:''}>${wl}</div>`:''}
      <div class="tier-bar-num total tb-click" data-label="Total" onclick="jumpToFilteredEncyclopedia('tier','${t.num}')" title="Browse ${t.label} in Encyclopedia">${total}</div>
      <div class="tier-bar-num pct" data-label="Complete">${pct}%</div>
    </div>`;
  }).join('');

  container.innerHTML = colHeaders + rows;

  // Re-attach toggle listener (container is re-rendered each time)
  const toggle = document.getElementById('tier-wish-toggle');
  if(toggle) toggle.addEventListener('change', ()=>{ _tierWishlistOn=toggle.checked; renderTierBars(); });
}

function renderCollection(){
  if(typeof ensureRetiredTermsLoaded==='function' && !_retiredTermsLoadPromise){
    ensureRetiredTermsLoaded().then(()=>renderCollection());
  }
  const wrap=document.getElementById('coll-wrap');
  const collectionTab=document.getElementById('tab-collection');
  const isSignedOut=!_currentUser;
  const isMobileSignedOut=isSignedOut&&window.matchMedia&&window.matchMedia('(max-width: 600px)').matches;
  if(collectionTab){
    collectionTab.classList.toggle('collection-signed-out', isSignedOut);
    collectionTab.classList.toggle('collection-signed-out-mobile', isMobileSignedOut);
  }
  if(isMobileSignedOut){
    if(wrap) wrap.innerHTML=_emptyCollHtml();
    return;
  }

  buildCollPanels();
  initCollectionFilterDelegation();

  // Stats use the visible collection list, with exact duplicate rows collapsed.
  // This protects against accidental double/triple saves without hiding genuinely different pieces.
  const displayCollection=dedupedCollectionItems(collection);
  const st=document.getElementById('stat-total');
  const sw=document.getElementById('stat-wish');
  const collCount=displayCollection.length;
  const wishCount=Object.keys(wish).length;
  if(st)st.textContent=collCount;
  if(sw)sw.textContent=wishCount;
  const mpc=document.getElementById('coll-chip-pieces-num');
  const mwc=document.getElementById('coll-chip-wish-num');
  if(mpc)mpc.textContent=collCount;
  if(mwc)mwc.textContent=wishCount;
  renderTierBars();
  renderMobileProgressCard();
  updateMobileFilterBar();

  if(!wrap)return;

  const _tierLabels={1:'The Essentials',2:'Shelf Builders',3:'Collector Favorites',4:'Rare Finds'};
  if(collQuickFilter==='tier-owned'||collQuickFilter==='tier-wish'){
    const isTierWish=collQuickFilter==='tier-wish';
    const tNum=_collTierNum;
    const tLabel=_tierLabels[tNum]||('Tier '+tNum);
    const backBtn=`<div style="margin-bottom:1rem;padding:8px 12px;background:var(--stone2);border-radius:8px;font-family:Jost,sans-serif;font-size:12px;letter-spacing:0.06em;text-transform:uppercase;color:var(--ink2);display:flex;align-items:center;gap:10px"><button onclick="setCollQuickFilter('all')" style="background:none;border:none;cursor:pointer;font-family:Jost,sans-serif;font-size:12px;letter-spacing:0.06em;text-transform:uppercase;color:var(--accent);padding:0">← All</button><span style="color:var(--ink3)">·</span><span>${tLabel} ${isTierWish?'Wishlist':'Owned'}</span></div>`;
    if(isTierWish){
      const wishIds=Object.keys(wish);
      const items=wishIds.map(id=>resolveStoneById(id)).filter(c=>c&&Number(c.tier)===tNum);
      if(!items.length){wrap.innerHTML=backBtn+'<div class="empty-coll">No wishlist items in '+tLabel+'.</div>';return;}
      wrap.innerHTML=backBtn+'<div class="coll-grid">'+items.map(c=>`<div class="coll-card" onclick="viewEncyclopediaFromWishlist('${c.i}')">
        ${wishlistCardPhotoHtml(c)}
        <div class="coll-card-name">${escapeAttr(c.n)}</div>
        <div class="coll-card-meta">${escapeAttr([c.er1,c.er2,c.er3].filter(Boolean).join(' · '))}</div>
      </div>`).join('')+'</div>';
    } else {
      const items=displayCollection.filter(p=>{const c=resolveStoneById(p.crystalId);return c&&Number(c.tier)===tNum&&passesCollPieceFilters(p);});
      if(!items.length){wrap.innerHTML=backBtn+'<div class="empty-coll">No owned pieces in '+tLabel+'.</div>';return;}
      wrap.innerHTML=backBtn+'<div class="coll-grid">'+items.map(p=>{
        const c=resolveStoneById(p.crystalId);
        const name=p.nickname||(p.isCombo?'Combo piece':(c?.n||'Unknown'));
        const locParts=[p.locCustom,p.shelf,p.tier,p.pos].filter(Boolean);
        const loc=locParts.slice(0,2).join(' · ');
        const ri=collection.indexOf(p);
        const photoHtml=collectionCardPhotoHtml(p,c,name,ri);
        return`<div class="coll-card" onclick="openCollDetail(${ri})">${photoHtml}<div class="coll-card-name">${escapeAttr(name)}</div><div class="coll-card-meta">${escapeAttr(c?.n||'')} ${p.size?'· '+escapeAttr(p.size):''}</div><div class="coll-card-loc">${escapeAttr(loc)}</div></div>`;
      }).join('')+'</div>';
    }
    return;
  }

  if(collQuickFilter==='wish'){
    const wishIds=Object.keys(wish);
    let wishCrystals=wishIds.map(id=>resolveStoneById(id)).filter(Boolean);
    wishCrystals=wishCrystals.filter(c=>passesCollStoneFilters(c));
    if(!wishCrystals.length){
      wrap.innerHTML=wishIds.length?'<div class="empty-coll">No wishlist items match your filters.</div>':_emptyWishHtml();
      return;
    }
    wrap.innerHTML='<div class="coll-grid">'+wishCrystals.map(c=>`<div class="coll-card" onclick="viewEncyclopediaFromWishlist('${c.i}')">
      ${wishlistCardPhotoHtml(c)}
      <div class="coll-card-name">${escapeAttr(c.n)}</div>
      <div class="coll-card-meta">${escapeAttr([c.er1,c.er2,c.er3].filter(Boolean).join(' · '))}</div>
    </div>`).join('')+'</div>';
    return;
  }

  if(collQuickFilter==='families'){
    const groups={};
    displayCollection.forEach(p=>{
      const c=resolveStoneById(p.crystalId);
      if(!c||!passesCollStoneFilters(c)||!passesCollPieceFilters(p))return;
      const fam=c?.fam||c?.sp||'Other';
      if(!groups[fam])groups[fam]=[];
      groups[fam].push({piece:p,crystal:c});
    });
    const fams=Object.keys(groups).sort((a,b)=>a.localeCompare(b));
    if(!fams.length){
      wrap.innerHTML=displayCollection.length?'<div class="empty-coll">No families match your filters.</div>':_emptyCollHtml();
      return;
    }
    collFamilyPhotoSources={};
    wrap.innerHTML='<div class="coll-grid">'+fams.map(fam=>{
      const entries=groups[fam];
      const names=[...new Set(entries.map(x=>x.crystal?.n||'Unknown'))].slice(0,4).join(' · ');
      const count=entries.length;
      const photoHtml=familyCardPhotoHtml(fam,entries);
      return`<div class="coll-card" onclick="openFamilyDetail('${fam.replace(/'/g,"\\'")}')" >
        ${photoHtml}
        <div class="coll-card-name">${escapeAttr(fam)}</div>
        <div class="coll-card-piece-count">${count} ${count===1?'piece':'pieces'}</div>
        <div class="coll-card-meta">${escapeAttr(names)}</div>
        <div class="coll-card-loc">Tap to view family</div>
      </div>`;
    }).join('')+'</div>';
    return;
  }

  if(collQuickFilter==='__family__'){
    const fam=collActiveFamilyName;
    const items=displayCollection.filter(p=>{
      const c=resolveStoneById(p.crystalId);
      return (c?.fam===fam||c?.sp===fam)&&passesCollPieceFilters(p);
    });
    if(!items.length){
      wrap.innerHTML=`<div class="empty-coll">No pieces found in ${escapeAttr(fam)}.</div>`;
      return;
    }
    wrap.innerHTML=
      `<div id="fam-detail-banner" style="display:flex;align-items:center;gap:10px;margin-bottom:1rem;padding:8px 12px;background:var(--stone2);border-radius:8px;font-family:Jost,sans-serif;font-size:12px;letter-spacing:0.06em;text-transform:uppercase;color:var(--ink2)">
        <button onclick="setCollQuickFilter('families')" style="background:none;border:none;cursor:pointer;font-family:Jost,sans-serif;font-size:12px;letter-spacing:0.06em;text-transform:uppercase;color:var(--accent);padding:0">← All Families</button>
        <span style="color:var(--ink3)">·</span>
        <span>${escapeAttr(fam)}</span>
        <span style="color:var(--ink3);margin-left:4px">${items.length} ${items.length===1?'piece':'pieces'}</span>
      </div>
      <div class="coll-grid">`+
      items.map(p=>{
        const c=resolveStoneById(p.crystalId);
        const name=p.nickname||(p.isCombo?'Combo piece':(c?.n||'Unknown'));
        const locParts=[p.locCustom,p.shelf,p.tier,p.pos].filter(Boolean);
        const loc=locParts.slice(0,2).join(' · ');
        const ri=collection.indexOf(p);
        const photoHtml=collectionCardPhotoHtml(p,c,name,ri);
        return`<div class="coll-card" onclick="openCollDetailFromFamily(${ri},'${fam.replace(/'/g,"\\'")}')">${photoHtml}<div class="coll-card-name">${escapeAttr(name)}</div><div class="coll-card-meta">${escapeAttr(c?.n||'')} ${p.size?'· '+escapeAttr(p.size):''}</div><div class="coll-card-loc">${escapeAttr(loc)}</div></div>`;
      }).join('')+
      `</div>`;
    return;
  }

  let items=displayCollection.filter(p=>{
    const c=resolveStoneById(p.crystalId);
    return passesCollStoneFilters(c)&&passesCollPieceFilters(p);
  });
  items=applyCollMobileSort(items);
  if(!items.length){
    wrap.innerHTML=displayCollection.length?'<div class="empty-coll">No pieces match your filters.</div>':_emptyCollHtml();
    return;
  }
  wrap.innerHTML='<div class="coll-grid">'+items.map(p=>{
    const c=resolveStoneById(p.crystalId);
    const name=p.nickname||(p.isCombo?'Combo piece':(c?.n||'Unknown'));
    const locParts=[p.locCustom,p.shelf,p.tier,p.pos].filter(Boolean);
    const loc=locParts.slice(0,2).join(' · ');
    const ri=collection.indexOf(p);
    const photoHtml=collectionCardPhotoHtml(p,c,name,ri);
    return`<div class="coll-card" onclick="openCollDetail(${ri})">${photoHtml}<div class="coll-card-name">${escapeAttr(name)}</div><div class="coll-card-meta">${escapeAttr(c?.n||'')} ${p.size?'· '+escapeAttr(p.size):''}</div><div class="coll-card-loc">${escapeAttr(loc)}</div></div>`;
  }).join('')+'</div>';
}


function collPieceName(p,c){
  return p?.nickname || (p?.isCombo ? 'Combo piece' : (c?.n || 'Unknown piece'));
}
function collPieceLocation(p){
  return [p?.locCustom,p?.shelf,p?.tier,p?.pos].filter(Boolean).join(' · ');
}
function collDetailPhotoHtml(p,c,name){
  const idx=(currentCollDetailIdx!==null&&currentCollDetailIdx!==undefined)?currentCollDetailIdx:collection.indexOf(p);
  const ownPhoto=firstCollectionPhoto(p);
  if(ownPhoto){
    const refBadge=isReferencePhotoUrl(ownPhoto,c)?'<span class="reference-image-badge">Reference image</span>':'';
    return`<div class="coll-detail-photo-wrap zoomable" onclick="openCollectionPhotoLightbox(${idx},0,event)" title="Enlarge photo"><img src="${escapeAttr(ownPhoto)}" alt="${escapeAttr(name)}">${refBadge}</div>`;
  }
  const refPhoto=firstEncyclopediaPhoto(c);
  if(refPhoto){
    const refAlt=c&&c.n?`${c.n} reference image`:name;
    return`<div class="coll-detail-photo-wrap zoomable" onclick="openCollectionPhotoLightbox(${idx},0,event)" title="Enlarge image"><img src="${escapeAttr(refPhoto)}" alt="${escapeAttr(refAlt)}"><span class="reference-image-badge">Reference image</span></div>`;
  }
  return`<div class="coll-detail-nophoto">No photo</div>`;
}
function formatDisplayDate(value){
  if(!value)return'';
  const m=String(value).match(/^(\d{4})-(\d{2})-(\d{2})/);
  if(!m)return value;
  return `${m[2]}/${m[3]}/${m[1]}`;
}
function formatDisplayPrice(value){
  if(value===undefined||value===null||String(value).trim()==='')return'';
  const raw=String(value).trim();
  const n=Number(raw.replace(/[^0-9.-]/g,''));
  if(!Number.isFinite(n))return raw.startsWith('$')?raw:`$${raw}`;
  return n%1===0?`$${n.toFixed(0)}`:`$${n.toFixed(2)}`;
}
function collRow(label,value){
  if(value===undefined||value===null||String(value).trim()==='')return'';
  return`<tr><td>${escapeAttr(label)}</td><td>${escapeAttr(value)}</td></tr>`;
}
function openCollDetail(idx){
  const p=collection[idx];if(!p)return;
  currentCollDetailIdx=idx;
  const c=resolveStoneById(p.crystalId);
  const name=collPieceName(p,c);
  const loc=collPieceLocation(p);
  const comboNames=(p.comboCrystalNames&&p.comboCrystalNames.length?p.comboCrystalNames:(p.comboCrystals||[]).map(id=>resolveStoneById(id)?.n||'').filter(Boolean));
  const detail=document.getElementById('coll-detail-content');if(!detail)return;
  const refLine=c?.uw||[c?.er1,c?.er2,c?.er3].filter(Boolean).join(' · ')||'';
  detail.innerHTML=`
    <div class="popup-title" style="margin-bottom:1rem">Collection piece</div>
    <div class="coll-detail-grid">
      ${collDetailPhotoHtml(p,c,name)}
      <div>
        <div class="coll-detail-name">${escapeAttr(name)}</div>
        <div class="coll-detail-sub">${escapeAttr(c?.n||'')} ${p.size?'· '+escapeAttr(p.size):''}</div>
        <table class="coll-detail-table">
          ${collRow('Form',p.form)}
          ${collRow('Size',p.size)}
          ${collRow('Location',loc)}
          ${collRow('Treatment',p.treated)}
          ${collRow('Condition',p.condition)}
          ${collRow('Acquired',formatDisplayDate(p.acquired))}
          ${collRow('Source',p.source)}
          ${collRow('Price',formatDisplayPrice(p.price))}
          ${comboNames.length?collRow('Combo',comboNames.join(' · ')):''}
          ${collRow('Notes',p.notes)}
        </table>
      </div>
    </div>
    ${c?`<div class="coll-ref-box"><div class="coll-ref-title">Stone reference</div>${escapeAttr(refLine||'Open the encyclopedia entry for full scientific, care, and metaphysical notes.')}</div>`:''}
    <div class="form-footer" style="justify-content:space-between;gap:8px;flex-wrap:wrap">
      <button class="btn" onclick="editCollPiece(${idx})">Edit piece</button>
      <button class="btn" onclick="deleteCollPiece(${idx})">Delete piece</button>
      ${c?`<button class="btn btn-accent" onclick="viewEncyclopediaFromColl('${c.i}')">View encyclopedia</button>`:''}
    </div>`;
  document.getElementById('coll-detail-overlay').classList.add('open');
}
function openCollDetailFromFamily(idx,fam){
  collDetailReturnFamily=fam;
  openCollDetail(idx);
}
function closeCollDetail(){
  const el=document.getElementById('coll-detail-overlay');if(el)el.classList.remove('open');
  if(collDetailReturnFamily){
    const fam=collDetailReturnFamily;
    collDetailReturnFamily=null;
    openFamilyDetail(fam);
  }
}
function viewEncyclopediaFromColl(stoneId){
  const p=(currentCollDetailIdx!==null)?collection[currentCollDetailIdx]:null;
  detailReturnContext={type:'collection',pieceId:p&&p.id?p.id:null,idx:currentCollDetailIdx};
  collDetailReturnFamily=null;
  closeCollDetail();
  switchTabByName('encyclopedia');
  setTimeout(()=>openDetail(stoneId),0);
}
function viewEncyclopediaFromWishlist(stoneId){
  detailReturnContext={type:'wishlist'};
  switchTabByName('encyclopedia');
  setTimeout(()=>openDetail(stoneId),0);
}
function editCollPiece(idx){
  const p=collection[idx];if(!p)return;
  collDetailReturnFamily=null;
  closeCollDetail();
  editingCollectionIndex=idx;
  openAddForm(p.crystalId||'');

  const title=document.querySelector('#add-form-overlay .form-title');if(title)title.textContent='Edit piece';
  const sub=document.querySelector('#add-form-overlay .form-sub');if(sub)sub.textContent='Update this specific physical piece in your collection.';
  const saveBtn=document.querySelector('#add-form-overlay .form-footer .btn-accent');if(saveBtn)saveBtn.textContent='Save changes';
  setFormVal('f-nick',p.nickname||'');
  setFormVal('f-form',p.form||'');
  setFormVal('f-size',p.size||'');
  setFormVal('f-treated',p.treated||'');
  setFormVal('f-condition',p.condition||'');
  setFormVal('f-source',p.source||'');
  setFormVal('f-price',p.price||'');
  setFormVal('f-acquired',p.acquired||'');
  setFormVal('f-loc-custom',p.locCustom||'');
  setFormVal('f-notes',p.notes||'');
  existingEditPhotos=(p.photos||[]).slice(0,3);
  editPrimaryPhotoKey=existingEditPhotos.length?photoKey(existingEditPhotos[0],'existing',0):null;
  pendingPhotos=[];
  renderPhotoPreviewRow();
  const combo=document.getElementById('f-combo');
  if(combo){combo.checked=!!p.isCombo;toggleCombo();}
  const rows=document.getElementById('combo-rows');
  if(rows&&p.isCombo){
    const ids=(p.comboCrystals||[]).slice(0,3);
    rows.innerHTML=ids.length?ids.map(()=>'<div class="combo-row"><select class="csel"><option value="">Select crystal…</option></select><button class="rm-combo" onclick="rmCombo(this)">×</button></div>').join(''):'<div class="combo-row"><select class="csel"><option value="">Select crystal…</option></select><button class="rm-combo" onclick="rmCombo(this)">×</button></div>';
    populateCombos();
    Array.from(rows.querySelectorAll('.csel')).forEach((sel,i)=>{sel.value=ids[i]||'';});
  }
}
function setFormVal(id,val){const el=document.getElementById(id);if(el)el.value=val;}
async function deleteCollPiece(idx){
  const p=collection[idx];if(!p)return;
  const c=resolveStoneById(p.crystalId);
  const name=collPieceName(p,c);
  if(!confirm(`Delete ${name} from your collection?`))return;
  collDetailReturnFamily=null;
  try{
    if(_currentUser&&p.id){
      const { error } = await _supa.from('collection_items').delete().eq('user_id',_currentUser.id).eq('id',p.id);
      if(error)throw error;
      closeCollDetail();
      await loadSupabaseState();
    }else{
      collection.splice(idx,1);
      localStorage.setItem('lap_coll',JSON.stringify(collection));
      localStorage.setItem('lap_last_saved',new Date().toISOString());
      closeCollDetail();renderCollection();encRender();updateLastSaved();
    }
  }catch(err){
    console.error('Delete piece failed',err);
    alert('Could not delete piece: '+(err.message||err));
  }
}

// ── DATE CASCADE ──
function updateDateCascade(prefix){
  prefix=prefix||'f';
  const yr=document.getElementById(prefix+'-year');
  const mo=document.getElementById(prefix+'-month');
  const dy=document.getElementById(prefix+'-day');
  if(!yr||!mo||!dy)return;
  mo.disabled=!yr.value;
  if(!yr.value){mo.value='';mo.disabled=true;dy.value='';dy.disabled=true;return;}
  mo.disabled=false;
  dy.disabled=!mo.value;
  if(!mo.value){dy.value='';dy.disabled=true;return;}
  dy.disabled=false;
  const DIM={January:31,February:29,March:31,April:30,May:31,June:30,July:31,August:31,September:30,October:31,November:30,December:31};
  const max=DIM[mo.value]||31;
  const cur=dy.value;
  dy.innerHTML='<option value="">Day…</option>';
  for(let d=1;d<=max;d++) dy.innerHTML+=`<option value="${d}"${String(d)===cur?' selected':''}>${d}</option>`;
}

function getAcquiredStr(prefix){
  prefix=prefix||'f';
  const yr=document.getElementById(prefix+'-year')?.value||'';
  const mo=document.getElementById(prefix+'-month')?.value||'';
  const dy=document.getElementById(prefix+'-day')?.value||'';
  return [mo,dy,yr].filter(Boolean).join(' ').trim();
}

// ── ADD FORM — moved to app.js ──

// ── BATCH ADD ──
function openBatchForm(){
  batchEntries=[];
  const be=document.getElementById('batch-entries');if(be)be.innerHTML='';
  const bsb=document.getElementById('batch-save-btn');if(bsb)bsb.style.display='none';
  document.getElementById('batch-form-overlay').classList.add('open');
}
function closeBatchForm(){
  document.getElementById('batch-form-overlay').classList.remove('open');
  document.getElementById('batch-form-overlay').querySelectorAll('input:not([type=file]),select').forEach(el=>el.value='');

  batchEntries=[];
  const be=document.getElementById('batch-entries');if(be)be.innerHTML='';
  const bsb=document.getElementById('batch-save-btn');if(bsb)bsb.style.display='none';
}

function loadBatchPhotos(input){
  const files=Array.from(input.files||[]);
  batchEntries=[];
  const container=document.getElementById('batch-entries');
  if(container)container.innerHTML='';
  files.forEach((file,fileIdx)=>{
    const reader=new FileReader();
    reader.onload=e=>{
      const entryIdx=batchEntries.length;
      batchEntries.push({photo:e.target.result,file:file,crystalId:'',nickname:''});
      const div=document.createElement('div');
      div.style.cssText='display:grid;grid-template-columns:80px 1fr 1fr;gap:10px;align-items:center;background:var(--white);border:0.5px solid var(--border);border-radius:8px;padding:10px';
      div.innerHTML=`<img src="${e.target.result}" style="width:80px;height:80px;object-fit:cover;border-radius:6px">
        <div style="display:flex;flex-direction:column;gap:4px"><label style="font-size:10px;letter-spacing:0.06em;text-transform:uppercase;color:var(--ink3)">Crystal *</label>
          <div class="combobox-wrap">
            <input type="text" class="combobox-input" id="b-crystal-input-${entryIdx}" placeholder="Type to search…" autocomplete="off"
              oninput="batchComboFilter(${entryIdx})"
              onfocus="batchComboFocus(${entryIdx})"
              onkeydown="batchComboKey(event,${entryIdx})"
              style="padding:7px 10px;font-size:12px">
            <div class="combobox-dropdown" id="b-crystal-drop-${entryIdx}"></div>
          </div>
        </div>
        <div style="display:flex;flex-direction:column;gap:4px"><label style="font-size:10px;letter-spacing:0.06em;text-transform:uppercase;color:var(--ink3)">Nickname</label>
          <input type="text" placeholder="Optional…" onchange="batchEntries[${entryIdx}].nickname=this.value" style="padding:7px 10px;border:0.5px solid var(--border);border-radius:6px;background:var(--stone);font-family:'Jost',sans-serif;font-size:12px;color:var(--ink);outline:none">
        </div>`;
      if(container)container.appendChild(div);
      if(batchEntries.length===files.length){
        const bsb=document.getElementById('batch-save-btn');if(bsb)bsb.style.display='';
      }
    };
    reader.readAsDataURL(file);
  });
  input.value='';
}
function batchComboRender(idx,query){
  const drop=document.getElementById(`b-crystal-drop-${idx}`);if(!drop)return;
  const q=(query||'').toLowerCase().trim();
  const source=sortedCrystals(CRYSTALS);
  const matches=q?source.filter(c=>c.n.toLowerCase().includes(q)||(c.a&&c.a.toLowerCase().includes(q))).slice(0,50):source.slice(0,50);
  drop.innerHTML='';
  if(!matches.length){drop.innerHTML='<div class="combobox-empty">No crystals found</div>';return;}
  matches.forEach(c=>{
    const opt=document.createElement('div');
    opt.className='combobox-option';
    opt.textContent=c.n;
    opt.addEventListener('mousedown',e=>{e.preventDefault();batchComboSelect(idx,c.i,c.n,e);});
    opt.addEventListener('click',e=>batchComboSelect(idx,c.i,c.n,e));
    drop.appendChild(opt);
  });
}
function batchComboFocus(idx){
  const input=document.getElementById(`b-crystal-input-${idx}`);
  const drop=document.getElementById(`b-crystal-drop-${idx}`);
  if(!input||!drop)return;
  drop.classList.add('open');
  batchComboRender(idx,input.value||'');
}
function batchComboFilter(idx){
  const input=document.getElementById(`b-crystal-input-${idx}`);
  const drop=document.getElementById(`b-crystal-drop-${idx}`);
  if(batchEntries[idx])batchEntries[idx].crystalId='';
  if(!input||!drop)return;
  if(!input.value){drop.classList.remove('open');return;}
  drop.classList.add('open');
  batchComboRender(idx,input.value);
}
function batchComboSelect(idx,crystalId,crystalName,e){
  e&&e.stopPropagation();
  if(batchEntries[idx])batchEntries[idx].crystalId=crystalId;
  const input=document.getElementById(`b-crystal-input-${idx}`);if(input)input.value=crystalName;
  const drop=document.getElementById(`b-crystal-drop-${idx}`);if(drop)drop.classList.remove('open');
}
function batchComboKey(e,idx){
  const drop=document.getElementById(`b-crystal-drop-${idx}`);if(!drop)return;
  const opts=drop.querySelectorAll('.combobox-option');
  const focused=drop.querySelector('.combobox-option.focused');
  let pos=focused?Array.from(opts).indexOf(focused):-1;
  if(e.key==='ArrowDown'){e.preventDefault();pos=Math.min(pos+1,opts.length-1);opts.forEach((o,i)=>o.classList.toggle('focused',i===pos));}
  else if(e.key==='ArrowUp'){e.preventDefault();pos=Math.max(pos-1,0);opts.forEach((o,i)=>o.classList.toggle('focused',i===pos));}
  else if(e.key==='Enter'&&focused){e.preventDefault();focused.click();}
  else if(e.key==='Escape'){drop.classList.remove('open');}
}

async function saveBatch(){
  const source=document.getElementById('b-source')?.value||'';
  const loc=document.getElementById('b-loc')?.value||'';
  const form=document.getElementById('b-form')?.value||'';
  const acquired=document.getElementById('b-acquired')?.value||'';
  const validEntries=(batchEntries||[]).filter(entry=>entry&&entry.crystalId);
  if(!validEntries.length){alert('Please assign at least one photo to a crystal.');return;}
  const saveBtn=document.getElementById('batch-save-btn');
  const oldText=saveBtn?saveBtn.textContent:'';
  if(saveBtn){saveBtn.disabled=true;saveBtn.textContent='Saving…';}
  let saved=0;
  try{
    if(_currentUser&&_supa){
      for(const entry of validEntries){
        const payload={
          user_id:_currentUser.id,
          stone_id:entry.crystalId,
          form_type:form||null,
          size:null,
          notes:null,
          acquired_from:source.trim()||null,
          acquired_date:acquired||null,
          price_paid:null,
          nickname:(entry.nickname||'').trim()||null,
          treatment:'Natural',
          condition:null,
          location:loc.trim()||null,
          is_combo:false,
          combo_stone_ids:[],
          combo_stone_names:[]
        };
        const { data, error } = await _supa
          .from('collection_items')
          .insert(payload)
          .select('id')
          .single();
        if(error)throw error;
        if(entry.file instanceof File){
          await _uploadCollectionPhotos(data.id,[{file:entry.file,_pendingId:'batch-'+saved}],1);
        }
        saved++;
      }
      closeBatchForm();
      // Give Supabase a tiny breath, then reload the collection so newly saved batch items appear immediately.
      await new Promise(resolve=>setTimeout(resolve,350));
      collQuickFilter='all';
      document.querySelectorAll('.stat-clickable').forEach(el=>el.classList.remove('active-stat'));
      const totalCell=document.getElementById('stat-cell-total');
      if(totalCell)totalCell.classList.add('active-stat');
      await loadSupabaseState();
      renderCollection();
      encRender();
      updateLastSaved();
      scrollPageTop();
      alert(`Saved ${saved} piece${saved!==1?'s':''} to your collection.`);
    }else{
      validEntries.forEach(entry=>{
        collection.push({
          id:Date.now()+Math.random(),crystalId:entry.crystalId,isCombo:false,comboCrystals:[],
          nickname:entry.nickname,form,size:'',dims:'',treated:'Natural',
          locCustom:loc,shelf:'',tier:'',pos:'',acquired,source,price:'',notes:'',
          photos:entry.photo?[entry.photo]:[],
        });
        owned[entry.crystalId]=true;
        saved++;
      });
      localStorage.setItem('lap_coll',JSON.stringify(collection));
      localStorage.setItem('lap_owned',JSON.stringify(owned));
      localStorage.setItem('lap_last_saved',new Date().toISOString());
      closeBatchForm();renderCollection();encRender();scrollPageTop();
      alert(`Saved ${saved} piece${saved!==1?'s':''} to your collection.`);
    }
  }catch(err){
    console.error('Batch save failed',err);
    alert('Could not save batch entries: '+(err.message||err));
  }finally{
    if(saveBtn){saveBtn.disabled=false;saveBtn.textContent=oldText||'Save all entries';}
  }
}

// ── ENCYCLOPEDIA ENTRY ──
function openAddEncForm(){document.getElementById('add-enc-form-overlay').classList.add('open');}
function encCheckDupe(val){
  const warn=document.getElementById('enc-duplicate-warn');
  if(!warn)return;
  const match=val.trim()&&CRYSTALS.find(x=>x.n.toLowerCase()===val.trim().toLowerCase());
  if(match){warn.textContent='⚠ "'+match.n+'" already exists ('+match.i+')';warn.style.display='block';}
  else{warn.style.display='none';}
}
async function encAutoFill(){
  const name=(document.getElementById('enc-name')?.value||'').trim();
  if(!name){alert('Enter a stone name first.');return;}
  const btn=document.getElementById('enc-autofill-btn');
  const status=document.getElementById('enc-autofill-status');
  if(btn){btn.disabled=true;btn.textContent='✦ Looking up…';}
  if(status){status.textContent='Asking Claude about '+name+'…';status.style.display='block';}
  try{
    const resp=await fetch('https://vxujlgyhgnihnqrxzefw.supabase.co/functions/v1/claude-stone-lookup',{
      method:'POST',
      headers:{'Content-Type':'application/json','Authorization':'Bearer sb_publishable_LfVL1UL-_8_8hXQktiF1BQ_UgbWvAPb'},
      body:JSON.stringify({name})
    });
    const d=await resp.json();
    if(!resp.ok){throw new Error(d.message||d.error||'HTTP '+resp.status);}
    if(d.error){throw new Error(d.error);}
    const set=(id,val)=>{const el=document.getElementById(id);if(el&&val!==undefined)el.value=val;};
    set('enc-alt',d.a);set('enc-fam',d.fam);set('enc-sp',d.sp);
    set('enc-c',d.c);set('enc-cc',d.cc);set('enc-g',d.g);
    set('enc-er',[d.er1,d.er2,d.er3].filter(Boolean).join(' / '));set('enc-uw',d.uw);set('enc-chakra',Array.isArray(d.chakras)?d.chakras.join(', '):d.chakras);
    set('enc-element',d.element);set('enc-aff',d.aff);
    if(d.m){const parts=String(d.m).split(/[-–]/);set('enc-mmin',parts[0]?.trim());set('enc-mmax',parts[1]?.trim()||parts[0]?.trim());}
    const syEl=document.getElementById('enc-sy');if(syEl&&d.sy)syEl.value=d.sy;
    const foEl=document.getElementById('enc-fo');if(foEl&&d.fo)foEl.value=d.fo;
    const trEl=document.getElementById('enc-tr');if(trEl&&d.tr)trEl.value=d.tr;
    if(status){status.textContent='✓ Fields populated — review and adjust before saving.';}
  }catch(err){
    if(status){status.textContent='Something went wrong: '+err.message;}
  }finally{
    if(btn){btn.disabled=false;btn.textContent='✦ Auto-fill with AI';}
  }
}
function closeAddEncForm(){
  document.getElementById('add-enc-form-overlay').classList.remove('open');
  document.getElementById('add-enc-form-overlay').querySelectorAll('input,select,textarea').forEach(el=>el.value='');
}
async function saveEncEntry(){
  const name=document.getElementById('enc-name').value.trim();
  if(!name){alert('Name is required.');return;}
  const uw=document.getElementById('enc-uw').value.trim();
  const er=document.getElementById('enc-er').value.trim();
  const chakraStr=document.getElementById('enc-chakra').value.trim();
  const chakras=chakraStr?chakraStr.split(',').map(s=>s.trim()).filter(Boolean):[];
  const mmin=document.getElementById('enc-mmin').value.trim();
  const mmax=document.getElementById('enc-mmax').value.trim();
  const mohs=mmin&&mmax?(mmin===mmax?mmin:mmin+'–'+mmax):(mmin||mmax||'');
  const c=document.getElementById('enc-c').value.trim();
  const alt=document.getElementById('enc-alt').value.trim();
  const fam=document.getElementById('enc-fam').value.trim();
  const sp=document.getElementById('enc-sp').value.trim();
  const element=document.getElementById('enc-element').value.trim();
  const aff=document.getElementById('enc-aff').value.trim();
  const g=document.getElementById('enc-g').value.trim();
  const cc=document.getElementById('enc-cc').value.trim();

  // Save to Supabase as the source of truth
  if(_supa&&_currentUser){
    const saveBtn=document.querySelector('#add-enc-form-overlay .btn-accent');
    if(saveBtn){saveBtn.disabled=true;saveBtn.textContent='Saving…';}
    // Generate next C-9xxx ID
    const {data:maxRow}=await _supa.from('stones').select('id').like('id','C-9%').order('id',{ascending:false}).limit(1).maybeSingle();
    const nextNum=maxRow?parseInt(maxRow.id.replace('C-',''))+1:9001;
    const newId='C-'+nextNum.toString().padStart(4,'0');
    const payload={
      id:newId,
      name,alternate_names:alt||null,family:fam||null,species:sp||null,
      crystal_system:document.getElementById('enc-sy').value||null,
      formation:document.getElementById('enc-fo').value||null,
      transparency:document.getElementById('enc-tr').value||null,
      color:c||null,color_hex:'#c8b89a',color_cause:cc||null,
      mohs:mohs||null,geo_notes:g||null,
      energetic_role_1:er||null,use_when:uw||null,affirmation:aff||null,
      chakras:chakras.length?chakras:null,element:element||null,
      color_categories:['Multi'],all_themes:[],primary_theme:'',
    };
    const {data,error}=await _supa.from('stones').insert(payload).select('id').single();
    if(saveBtn){saveBtn.disabled=false;saveBtn.textContent='Save entry';}
    if(error){alert('Error saving to database: '+error.message);return;}
    const newEntry={
      i:newId,n:name,a:alt,fam,sp,
      sy:document.getElementById('enc-sy').value,
      fo:document.getElementById('enc-fo').value,tr:document.getElementById('enc-tr').value,
      c,ch:'#c8b89a',cc,m:mohs,g,er1:er,er2:'',er3:'',uw,o:false,w:false,
      chakras,element,zodiac:'',aff,col_cats:['Multi'],all_themes:[],primary_theme:'',_search:er,
    };
    CRYSTALS.push(newEntry);
    closeAddEncForm();encRender();
    updateStoneCounts();
    alert(`"${name}" added to encyclopedia as ${newId}.`);
  } else {
    alert('You must be signed in to add encyclopedia entries.');
  }
}

// ── EXPORT ──
function exportPhotoValue(photo){
  if(!photo)return '';
  const raw=(typeof photo==='string')?photo:(photo.storage_path||photo.path||photo.name||photo.url||photo.signedUrl||photo.preview||photo.src||'');
  if(!raw)return '';
  if(String(raw).startsWith('data:image/'))return '[embedded local image omitted from CSV]';
  return raw;
}
function normalizePhotoList(piece){
  const photos=(piece&&Array.isArray(piece.photos))?piece.photos:[];
  return photos.map(exportPhotoValue).filter(Boolean);
}

function exportJSON(){dl(JSON.stringify({collection,owned,wish,exported:new Date().toISOString()},null,2),'application/json','TheLapidary_backup.json');}
function csvCell(value){return `"${String(value??'').replace(/"/g,'""')}"`;}
function downloadCSV(rows,filename){
  const csv='\ufeff'+rows.map(r=>r.map(csvCell).join(',')).join('\n');
  dl(csv,'text/csv;charset=utf-8',filename);
}
function exportCollectionCSV(){
  const rows=[['Piece ID','Crystal ID','Crystal','Nickname','Combo','Combo Stones','Form','Size','Treatment','Condition','Location','Acquired','Source','Price Paid','Primary Photo','Photo Count','Photo URLs','Notes']];
  const exportItems=dedupedCollectionItems(collection);
  exportItems.forEach(p=>{
    const c=resolveStoneById(p.crystalId);
    const comboNames=(p.comboCrystalNames&&p.comboCrystalNames.length?p.comboCrystalNames:(p.comboCrystals||[]).map(id=>resolveStoneById(id)?.n||'').filter(Boolean));
    const photos=normalizePhotoList(p);
    rows.push([
      p.id||'',
      p.crystalId||'',
      c?.n||'',
      p.nickname||'',
      p.isCombo?'Yes':'No',
      comboNames.join(' · '),
      p.form||'',
      p.size||'',
      p.treated||'',
      p.condition||'',
      collPieceLocation(p)||'',
      formatDisplayDate(p.acquired)||'',
      p.source||'',
      formatDisplayPrice(p.price)||'',
      photos[0]||'',
      photos.length,
      photos.join(' | '),
      p.notes||''
    ]);
  });
  downloadCSV(rows,'StillPointLapidary_collection.csv');
}
function exportWishlistCSV(){
  const rows=[['Crystal ID','Crystal','Alternate Names','Family','Species','Material Type','Crystal System','Dominant Color','Mohs','Energetic Role','Use When','Chakras','Primary Theme','All Themes']];
  const wishIds=Object.keys(wish||{}).filter(id=>wish[id]);
  wishIds.map(id=>resolveStoneById(id)).filter(Boolean).forEach(c=>{
    rows.push([
      c.i||'',
      c.n||'',
      c.a||'',
      c.fam||'',
      c.sp||'',
      c.mt||'',
      c.sy||'',
      c.c||'',
      c.m||'',
      [c.er1,c.er2,c.er3].filter(Boolean).join(' / '),
      c.uw||'',
      (c.chakras||[]).join(' · '),
      c.primary_theme||'',
      (c.all_themes||[]).join(' · ')
    ]);
  });
  downloadCSV(rows,'StillPointLapidary_wishlist.csv');
}
function exportCSV(){exportCollectionCSV();}
function exportEncyclopedia(){
  const rows=[['ID','Name','Alt Names','Family','Species','Material','System','Formation','Transparency','Color','Color Cause','Mohs','Geology Notes','Energetic Role 1','Energetic Role 2','Energetic Role 3','Use When','Chakras','Element','Zodiac','Intention','Primary Theme','All Themes']];
  CRYSTALS.forEach(c=>{rows.push([c.i,c.n,c.a||'',c.fam||'',c.sp||'',c.mt||'',c.sy||'',c.fo||'',c.tr||'',c.c||'',c.cc||'',c.m||'',c.g||'',c.er1||'',c.er2||'',c.er3||'',c.uw||'',(c.chakras||[]).join('; '),c.element||'',c.zodiac||'',c.aff||'',c.primary_theme||'',(c.all_themes||[]).join('; ')]);});
  dl(rows.map(r=>r.map(v=>`"${String(v).replace(/"/g,'""')}"`).join(',')).join('\n'),'text/csv','TheLapidary_Encyclopedia.csv');
}
function importJSON(input){
  const file=input.files[0];if(!file)return;
  const reader=new FileReader();
  reader.onload=e=>{
    try{
      const p=JSON.parse(e.target.result);
      if(p.collection){collection=p.collection;localStorage.setItem('lap_coll',JSON.stringify(collection));}
      if(p.owned){owned=p.owned;localStorage.setItem('lap_owned',JSON.stringify(owned));}
      if(p.wish){wish=p.wish;localStorage.setItem('lap_wish',JSON.stringify(wish));}
      renderCollection();encRender();alert('Restored '+collection.length+' pieces.');
    }catch(err){alert('Could not read file. Use a valid Lapidary JSON backup.');}
  };
  reader.readAsText(file);input.value='';
}
function dl(content,type,filename){const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([content],{type}));a.download=filename;a.click();}

let _reportType='collection';
function toggleExportMenu(id){
  const menu=document.getElementById(id);
  if(!menu)return;
  const isOpen=menu.style.display!=='none';
  ['coll-export-menu','wish-export-menu'].forEach(mid=>{const m=document.getElementById(mid);if(m)m.style.display='none';});
  if(!isOpen)menu.style.display='block';
}
document.addEventListener('click',e=>{
  if(!e.target.closest('[id$="-export-menu"]')&&!e.target.textContent?.includes('▾')){
    ['coll-export-menu','wish-export-menu'].forEach(id=>{const m=document.getElementById(id);if(m)m.style.display='none';});
  }
});
function selectReportLayout(el){
  document.querySelectorAll('.report-layout-opt').forEach(o=>{o.style.border='1px solid var(--border)';o.style.background='';o.classList.remove('selected');});
  el.style.border='1px solid var(--accent2)';el.style.background='#faf6f0';el.classList.add('selected');
  const thumbOpt=document.getElementById('report-thumb-option');
  if(thumbOpt)thumbOpt.style.display=el.dataset.val==='compact'?'block':'none';
}
function openReportOptions(type){
  _reportType=type;
  document.getElementById('report-options-title').textContent=type==='collection'?'Collection Report Options':'Wishlist Report Options';
  const collSection=document.getElementById('report-coll-section');
  if(collSection)collSection.style.display=type==='collection'?'':'none';
  const encPhotoSection=document.getElementById('report-enc-photo-section');
  if(encPhotoSection) encPhotoSection.style.display=type==='collection'?'block':'none';
  const overlay=document.getElementById('report-options-overlay');
  overlay.classList.add('open');
  const box=overlay.querySelector('.popup-box');
  if(box)box.scrollTop=0;
}
function toggleAllReportFields(){
  const boxes=Array.from(document.querySelectorAll('#report-options-overlay input[type=checkbox][data-field]')).filter(cb=>cb.dataset.field!=='thumbs');
  const allChecked=boxes.every(cb=>cb.checked);
  boxes.forEach(cb=>cb.checked=!allChecked);
  const btn=document.getElementById('report-select-all-btn');
  if(btn)btn.textContent=allChecked?'Select all fields':'Deselect all fields';
}
function closeReportOptions(){
  document.getElementById('report-options-overlay').classList.remove('open');
  document.getElementById('report-preparing').style.display='none';
  const btn=document.getElementById('report-generate-btn');
  if(btn){btn.disabled=false;btn.textContent='Generate report';}
}
function _reportFields(){
  const f={};
  document.querySelectorAll('#report-options-overlay input[type=checkbox]').forEach(cb=>{f[cb.dataset.field]=cb.checked;});
  f.layout=document.querySelector('.report-layout-opt.selected')?.dataset.val||'standard';
  return f;
}
function _reportBase(){
  return `@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=Jost:wght@300;400;500&display=swap');
  *{margin:0;padding:0;box-sizing:border-box}body{font-family:'Jost',sans-serif;color:#2a2520;background:#faf8f6;margin:0 auto}
  .sticky-header{background:#faf8f6;padding-bottom:0.75rem;margin-bottom:0.75rem;border-bottom:1.5px solid #c8a96e}
  .report-header{display:flex;align-items:flex-end;justify-content:space-between}
  .report-brand{font-family:'Cormorant Garamond',serif;font-size:26px;font-weight:300;color:#2a2520;letter-spacing:0.04em}
  .report-brand span{color:#c8a96e;font-style:italic}.report-subtitle{font-size:9px;letter-spacing:0.14em;text-transform:uppercase;color:#8a7e72;margin-top:2px}
  .report-meta{font-size:11px;color:#a09890;padding-top:0.3rem;letter-spacing:0.04em}
  .print-toolbar{display:flex;gap:10px;align-items:center;margin-bottom:1rem}
  .print-btn{background:#c8a96e;color:#fff;border:none;padding:8px 18px;font-family:'Jost',sans-serif;font-size:11px;letter-spacing:0.1em;text-transform:uppercase;border-radius:6px;cursor:pointer}
  .stone-name{font-family:'Cormorant Garamond',serif;font-weight:400;color:#2a2520;line-height:1.2}
  .stone-alt{font-size:11px;color:#8a7e72;margin-top:2px;letter-spacing:0.04em}
  .stone-detail{font-size:12px;color:#5a5149;margin-top:5px;line-height:1.5}
  .use-when{color:#5a5149;margin-top:8px;padding:7px 11px;background:#fff;border-left:2.5px solid #c8a96e;line-height:1.6;font-style:italic}
  .fact-grid{display:grid;grid-template-columns:1fr 1fr;gap:4px 16px;margin-top:8px}
  .fact{font-size:11px;color:#a09890;line-height:1.4}.fact strong{color:#5a5149;font-weight:500}
  .meta{font-size:11px;color:#a09890;margin-top:5px;line-height:1.6}
  .notes{font-size:12px;color:#5a5149;margin-top:6px;font-style:italic;line-height:1.5}
  .ref-photo-note{position:absolute;bottom:7px;left:50%;transform:translateX(-50%);font-size:7px;letter-spacing:0.08em;text-transform:uppercase;padding:2px 6px;border-radius:999px;background:rgba(250,248,246,0.85);border:0.5px solid rgba(42,37,32,0.12);color:rgba(60,52,42,0.6);white-space:nowrap;font-family:'Jost',sans-serif}
  .footer{padding-top:1rem;border-top:0.5px solid #e0dbd4;font-size:10px;color:#a09890;text-align:center;letter-spacing:0.08em}
  .report-table{width:100%;border-collapse:collapse}.report-thead-td{padding:0.75rem 0 1.25rem;border-bottom:1.5px solid #c8a96e}
  .report-table thead{display:table-header-group}.content-wrap{padding-top:0;vertical-align:top}
  .gallery-row td{padding-top:0;vertical-align:top}.gallery-row+.gallery-row{page-break-before:always;break-before:page}
  @media print{.print-toolbar{display:none}body{background:#fff}.card{break-inside:avoid;page-break-inside:avoid}.report-table thead{display:table-header-group}.gallery-row+.gallery-row{page-break-before:always;break-before:page}@page{size:portrait;margin:1.2cm 1cm}}`;
}
function _reportStyles(layout){
  const base=_reportBase();
  if(layout==='gallery') return base+`body{padding:0.75rem 1.25rem;max-width:780px}.content-wrap{padding-top:0}.card{padding:0.5rem 0 1rem;margin-top:0.75rem}.card-photo-outer{width:min(100%,420px);margin:0 auto 1rem}.card-photo-wrap{width:100%;position:relative;overflow:hidden;border-radius:10px;box-shadow:0 4px 24px rgba(42,37,32,0.14)}.card-photo-wrap::after{content:'';display:block;padding-bottom:85%}.card-photo{position:absolute;top:0;left:0;width:100%;height:100%;object-fit:cover;border-radius:10px}.card-photo-empty{position:absolute;top:0;left:0;width:100%;height:100%;background:#f0ece7;display:flex;align-items:center;justify-content:center;font-size:12px;color:#b0a89e;border-radius:10px}.stone-name{font-size:26px;margin-bottom:4px}.use-when{font-size:13px}.fact-grid{grid-template-columns:1fr 1fr 1fr}.footer{margin-top:1rem}`;
  if(layout==='standard') return base+`body{padding:0.75rem 1.25rem;max-width:none}.std-cell{width:50%;vertical-align:top;padding-bottom:1rem;page-break-inside:avoid}.std-cell:first-child{padding-right:0.625rem}.std-cell:last-child{padding-left:0.625rem}.card{background:#fff;border-radius:10px;padding:0.75rem;box-shadow:0 1px 8px rgba(42,37,32,0.07);break-inside:avoid;overflow:hidden}.card-photo-wrap{margin-bottom:0.65rem;position:relative;width:100%;overflow:hidden;border-radius:7px;box-shadow:0 2px 8px rgba(42,37,32,0.1)}.card-photo-wrap::after{content:'';display:block;padding-bottom:100%}.card-photo{position:absolute;top:0;left:0;width:100%;height:100%;object-fit:cover;border-radius:7px;display:block}.card-photo-empty{position:absolute;top:0;left:0;width:100%;height:100%;border-radius:7px;background:#f0ece7;display:flex;align-items:center;justify-content:center;font-size:11px;color:#b0a89e}.stone-name{font-size:18px}.use-when{font-size:12px;padding:5px 8px}.footer{margin-top:1rem}`;
  if(layout==='compact') return base+`body{padding:0.75rem 1.25rem;max-width:none}.content-wrap{padding-top:0}.inv-row{display:flex;gap:10px;padding:6px 0;border-bottom:0.5px solid #ede9e4;break-inside:avoid;align-items:flex-start}.inv-row:first-child{border-top:0.5px solid #ede9e4}.inv-thumb-wrap{flex-shrink:0;width:48px}.inv-thumb{width:48px;height:48px;aspect-ratio:1;object-fit:cover;border-radius:4px;display:block}.inv-thumb-empty{width:48px;height:48px;border-radius:4px;background:#f0ece7;display:flex;align-items:center;justify-content:center;font-size:8px;color:#b0a89e;text-align:center;line-height:1.3;padding:2px}.inv-body{flex:1;min-width:0}.stone-name{font-size:14px}.inv-line{font-size:11px;color:#5a5149;margin-top:2px;line-height:1.4}.use-when{font-size:11px;padding:3px 7px;margin-top:4px;border-left-width:2px}.ref-photo-note{max-width:48px;word-wrap:break-word;overflow-wrap:break-word}.footer{margin-top:1.5rem}`;
  return _reportStyles('standard');
}
function _reportHeaderHtml(title,count,unit){
  return `<table class="report-table"><thead><tr><td colspan="2" class="report-thead-td"><div class="report-header"><div><div class="report-brand">STILL POINT <span>Lapidary</span></div><div class="report-subtitle">Crystal Reference Library</div></div><div style="text-align:right;font-size:12px;color:#8a7e72;font-family:'Jost',sans-serif">${title}<br><span style="font-size:11px;color:#a09890">${new Date().toLocaleDateString('en-US',{year:'numeric',month:'long',day:'numeric'})}</span></div></div><div class="report-meta">${count} ${unit}${count!==1?'s':''}</div></td></tr></thead>`;
}
function _reportHeader(title,count,unit){return _reportHeaderHtml(title,count,unit);}
function _photoHtml(photoUrl,name,encFallback,useEnc,cssClass){
  const outer=(cssClass==='card-photo'&&arguments[5])?`<div class="card-photo-outer">`:'';
  const outerClose=outer?'</div>':'';
  if(photoUrl) return `${outer}<div class="card-photo-wrap"><img class="${cssClass}" src="${photoUrl}" alt="${name}"></div>${outerClose}`;
  if(useEnc&&encFallback) return `${outer}<div class="card-photo-wrap" style="position:relative"><img class="${cssClass}" src="${encFallback}" alt="${name} reference image"><div class="ref-photo-note">Reference image</div></div>${outerClose}`;
  return `${outer}<div class="card-photo-wrap"><div class="${cssClass.replace('card-photo','card-photo-empty')} ${cssClass.includes('inv-thumb')?'inv-thumb-empty':''}">No photo</div></div>${outerClose}`;
}
async function generateReport(){
  const btn=document.getElementById('report-generate-btn');
  const prep=document.getElementById('report-preparing');
  if(btn){btn.disabled=true;btn.textContent='Preparing…';}
  if(prep)prep.style.display='block';
  const f=_reportFields();
  try{
    if(_reportType==='collection') await _printCollectionReport(f);
    else _printWishlistReport(f);
  }finally{closeReportOptions();}
}
async function _printCollectionReport(f){
  const layout=f.layout||'standard';
  const items=dedupedCollectionItems(collection);
  if(!items.length){alert('Your collection is empty.');return;}
  const cards=await Promise.all(items.map(async p=>{
    const c=resolveStoneById(p.crystalId);
    const name=c?.n||'Unknown';
    const photoUrl=firstCollectionPhoto(p);
    const encFallbackFile=ENCYCLOPEDIA_PHOTOS[p.crystalId]?.[0];
    const encFallback=encFallbackFile?SUPABASE_ENC+encFallbackFile:null;
    const nickname=p.nickname?` <span style="color:#8a7e72;font-style:italic">"${p.nickname}"</span>`:'';
    const comboNames=(p.comboCrystalNames&&p.comboCrystalNames.length?p.comboCrystalNames:(p.comboCrystals||[]).map(id=>resolveStoneById(id)?.n||'').filter(Boolean));
    const formParts=[f.form&&p.form?`Form: ${p.form}`:'',f.form&&p.size?`Size: ${p.size}`:''].filter(Boolean).join(' · ');
    const treatLine=f.condition&&p.treated?`Treatment: ${p.treated}`:'';
    const condLine=f.condition&&p.condition?`Condition: ${p.condition}`:'';
    const formHtml=[formParts,treatLine,condLine].filter(Boolean).map(l=>`<div>${l}</div>`).join('');
    const metaParts=[f.acquired&&formatDisplayDate(p.acquired)?`Acquired ${formatDisplayDate(p.acquired)}`:'',f.acquired&&p.source?`Source: ${p.source}`:'',f.price&&formatDisplayPrice(p.price)?formatDisplayPrice(p.price):''].filter(Boolean);
    if(layout==='gallery'){
      const ph=_photoHtml(photoUrl,name,encFallback,f.encphoto,'card-photo',true);
      const facts=[[c?.fam,'Family'],[c?.sy,'System'],[c?.fo,'Formation'],[c?.m?c.m+' Mohs':null,'Hardness'],[c?.element,'Element'],[c?.chakras?.join(', '),'Chakra']].filter(r=>r[0]);
      return `<div class="card">${ph}<div class="stone-name">${name}${nickname}</div>${c?.a?`<div class="stone-alt">Also known as: ${c.a}</div>`:''}${p.isCombo&&comboNames.length?`<div class="stone-alt">Combo: ${comboNames.join(' · ')}</div>`:''} ${formHtml?`<div class="stone-detail">${formHtml}</div>`:''} ${f.usewhen&&c?.uw?`<div class="use-when">${c.uw}</div>`:''} ${facts.length?`<div class="fact-grid">${facts.map(([v,l])=>`<div class="fact"><strong>${l}:</strong> ${v}</div>`).join('')}</div>`:''} ${f.location&&collPieceLocation(p)?`<div class="meta">📍 ${collPieceLocation(p)}</div>`:''} ${metaParts.length?`<div class="meta">${metaParts.join(' · ')}</div>`:''} ${f.notes&&p.notes?`<div class="notes">${p.notes}</div>`:''} ${f.aff&&c?.aff?`<div class="meta" style="font-style:italic;margin-top:12px;font-size:13px">"${c.aff}"</div>`:''}</div>`;
    }
    if(layout==='compact'){
      const showThumb=f.thumbs!==false;
      const ph=showThumb?`<div class="inv-thumb-wrap">${_photoHtml(photoUrl,name,encFallback,f.encphoto,'inv-thumb')}</div>`:'';
      return `<div class="inv-row">${ph}<div class="inv-body"><div class="stone-name">${name}${nickname}</div><div class="inv-line">${formHtml}${f.location&&collPieceLocation(p)?`<div>📍 ${collPieceLocation(p)}</div>`:''}</div>${metaParts.length?`<div class="inv-line" style="color:#a09890">${metaParts.join(' · ')}</div>`:''} ${f.usewhen&&c?.uw?`<div class="use-when">${c.uw}</div>`:''} ${f.notes&&p.notes?`<div class="notes">${p.notes}</div>`:''}</div></div>`;
    }
    const ph=_photoHtml(photoUrl,name,encFallback,f.encphoto,'card-photo');
    return `<div class="card">${ph}<div class="stone-name">${name}${nickname}</div>${p.isCombo&&comboNames.length?`<div class="stone-alt">Combo: ${comboNames.join(' · ')}</div>`:''} ${formHtml?`<div class="stone-detail">${formHtml}</div>`:''} ${f.usewhen&&c?.uw?`<div class="use-when">${c.uw}</div>`:''} ${f.er&&c?.er?`<div class="stone-alt" style="margin-top:6px">${c.er}</div>`:''} ${f.location&&collPieceLocation(p)?`<div class="meta">📍 ${collPieceLocation(p)}</div>`:''} ${metaParts.length?`<div class="meta">${metaParts.join(' · ')}</div>`:''} ${f.notes&&p.notes?`<div class="notes">${p.notes}</div>`:''} ${f.chakras&&c?.chakras?.length?`<div class="meta">Chakra: ${c.chakras.join(' · ')}</div>`:''} ${f.aff&&c?.aff?`<div class="meta" style="font-style:italic">"${c.aff}"</div>`:''}</div>`;
  }));
  let tbody;
  if(layout==='gallery') tbody=cards.map(c=>`<tbody class="gallery-row"><tr><td>${c}</td></tr></tbody>`).join('');
  else if(layout==='standard'){const rows2=[];for(let i=0;i<cards.length;i+=2){rows2.push(`<tr><td class="std-cell">${cards[i]}</td><td class="std-cell">${cards[i+1]||''}</td></tr>`);}tbody=`<tbody>${rows2.join('')}<tr><td colspan="2" class="footer" style="padding-top:1rem;text-align:center">stillpointlapidary.com</td></tr></tbody>`;}
  else tbody=`<tbody><tr><td class="content-wrap">${cards.join('')}<div class="footer">stillpointlapidary.com</div></td></tr></tbody>`;
  const galleryFooter=layout==='gallery'?`<tbody><tr><td class="footer" style="padding-top:1rem;text-align:center;font-size:10px;color:#a09890;letter-spacing:0.08em">stillpointlapidary.com</td></tr></tbody>`:'';
  const _collHtml=`<!DOCTYPE html><html><head><meta charset="UTF-8"><title>My Stone Collection — Still Point Lapidary</title><style>${_reportStyles(layout)}</style></head><body><div class="print-toolbar"><button class="print-btn" onclick="window.print()">⎙ Print / Save as PDF</button></div>${_reportHeaderHtml('My Stone Collection',items.length,'piece')}${tbody}${galleryFooter}</table></body></html>`;
  const _collBlob=new Blob([_collHtml],{type:'text/html'});
  window.open(URL.createObjectURL(_collBlob),'_blank');
}
function _printWishlistReport(f){
  const layout=f.layout||'standard';
  const wishIds=Object.keys(wish||{}).filter(id=>wish[id]);
  const items=wishIds.map(id=>resolveStoneById(id)).filter(Boolean);
  if(!items.length){alert('Your wishlist is empty.');return;}
  const cards=items.map(c=>{
    const encFile=ENCYCLOPEDIA_PHOTOS[c.i]?.[0];
    const photoUrl=encFile?SUPABASE_ENC+encFile:null;
    const detailLine=[c.fam,c.c,c.m?c.m+' Mohs':''].filter(Boolean).join(' · ');
    if(layout==='gallery'){
      const ph=photoUrl?`<div class="card-photo-wrap"><img class="card-photo" src="${photoUrl}" alt="${c.n}"></div>`:`<div class="card-photo-wrap"><div class="card-photo-empty">No photo</div></div>`;
      const facts=[[c.fam,'Family'],[c.sy,'System'],[c.fo,'Formation'],[c.m?c.m+' Mohs':null,'Hardness'],[c.element,'Element'],[c.chakras?.join(', '),'Chakra']].filter(r=>r[0]);
      return `<div class="card">${ph}<div class="stone-name">${c.n}</div>${c.a?`<div class="stone-alt">Also known as: ${c.a}</div>`:''}<div class="stone-detail">${detailLine}</div>${f.usewhen&&c.uw?`<div class="use-when">${c.uw}</div>`:''} ${facts.length?`<div class="fact-grid">${facts.map(([v,l])=>`<div class="fact"><strong>${l}:</strong> ${v}</div>`).join('')}</div>`:''} ${f.aff&&c.aff?`<div class="meta" style="font-style:italic;margin-top:12px;font-size:13px">"${c.aff}"</div>`:''}</div>`;
    }
    if(layout==='compact'){
      const showThumb=f.thumbs!==false;
      const ph=showThumb?`<div class="inv-thumb-wrap">${photoUrl?`<img class="inv-thumb" src="${photoUrl}" alt="${c.n}">`:`<div class="inv-thumb-empty">No photo</div>`}</div>`:'';
      return `<div class="inv-row">${ph}<div class="inv-body"><div class="stone-name">${c.n}</div><div class="inv-line">${detailLine}</div>${f.usewhen&&c.uw?`<div class="use-when">${c.uw}</div>`:''}</div></div>`;
    }
    const ph=photoUrl?`<div class="card-photo-wrap"><img class="card-photo" src="${photoUrl}" alt="${c.n}"></div>`:`<div class="card-photo-wrap"><div class="card-photo-empty">No photo</div></div>`;
    return `<div class="card">${ph}<div class="stone-name">${c.n}</div>${c.a?`<div class="stone-alt">Also known as: ${c.a}</div>`:''}<div class="stone-detail">${detailLine}</div>${f.usewhen&&c.uw?`<div class="use-when">${c.uw}</div>`:''} ${f.er&&c.er?`<div class="stone-alt" style="margin-top:6px">${c.er}</div>`:''} ${f.chakras&&c.chakras?.length?`<div class="meta">Chakra: ${c.chakras.join(' · ')}</div>`:''} ${f.aff&&c.aff?`<div class="meta" style="font-style:italic">"${c.aff}"</div>`:''}</div>`;
  });
  let tbody;
  const attrib=f.encphoto?'<div style="font-style:italic;margin-top:3px">Crystal reference images courtesy of Still Point Lapidary</div>':'';
  if(layout==='gallery') tbody=cards.map(c=>`<tbody class="gallery-row"><tr><td>${c}</td></tr></tbody>`).join('');
  else if(layout==='standard'){const rows2=[];for(let i=0;i<cards.length;i+=2){rows2.push(`<tr><td class="std-cell">${cards[i]}</td><td class="std-cell">${cards[i+1]||''}</td></tr>`);}tbody=`<tbody>${rows2.join('')}<tr><td colspan="2" class="footer" style="padding-top:1rem;text-align:center">stillpointlapidary.com${attrib}</td></tr></tbody>`;}
  else tbody=`<tbody><tr><td class="content-wrap">${cards.join('')}<div class="footer">stillpointlapidary.com${attrib}</div></td></tr></tbody>`;
  const galleryFooter=layout==='gallery'?`<tbody><tr><td class="footer" style="padding-top:1rem;text-align:center;font-size:10px;color:#a09890;letter-spacing:0.08em">stillpointlapidary.com${attrib}</td></tr></tbody>`:'';
  const win=window.open('','_blank');
  const _wishHtml=`<!DOCTYPE html><html><head><meta charset="UTF-8"><title>My Wishlist — Still Point Lapidary</title><style>${_reportStyles(layout)}</style></head><body><div class="print-toolbar"><button class="print-btn" onclick="window.print()">⎙ Print / Save as PDF</button></div>${_reportHeaderHtml('My Wishlist',items.length,'stone')}${tbody}${galleryFooter}</table></body></html>`;
  const _wishBlob=new Blob([_wishHtml],{type:'text/html'});
  window.open(URL.createObjectURL(_wishBlob),'_blank');
}

function getStickyScrollOffset(){
  const topbar=document.querySelector('.topbar');
  const nav=document.querySelector('.main-nav-wrap');
  const topbarHeight=topbar?topbar.getBoundingClientRect().height:0;
  const navHeight=nav?nav.getBoundingClientRect().height:0;
  return topbarHeight+navHeight+18;
}
function scrollToPageSection(target){
  const el=typeof target==='string'?document.querySelector(target):target;
  if(!el)return;
  const y=el.getBoundingClientRect().top+window.scrollY-getStickyScrollOffset();
  try{window.scrollTo({top:Math.max(0,y),left:0,behavior:'smooth'});}catch(e){window.scrollTo(0,Math.max(0,y));}
}

// ── PHOTO PLANNING ──
let _ppData={};    // id → {photo_batch}
let _ppFilter='all';
let _ppSaveTimer=null;
let _ppReadOnly=false;

async function openPhotoPlan(){
  openPopup('photo-plan');
  const rows=document.getElementById('pp-rows');
  rows.innerHTML='<div style="padding:24px;text-align:center;color:var(--ink3);font-size:13px">Loading…</div>';
  document.getElementById('pp-summary').textContent='';
  document.getElementById('pp-filters').innerHTML='';

  _ppReadOnly=false;
  let data=null;
  const {data:planData,error}=await _supa.from('stones').select('id,name,tier,collection_tier,photo_batch').order('tier').order('name');
  if(error||!planData){
    _ppReadOnly=true;
    data=CRYSTALS.map(c=>({id:c.i,name:c.n,tier:c.tier,collection_tier:null,photo_batch:''}))
      .sort((a,b)=>(Number(a.tier)||99)-(Number(b.tier)||99)||String(a.name).localeCompare(String(b.name)));
  }else{
    data=planData;
  }

  data.forEach(s=>{ _ppData[s.id]={photo_batch:s.photo_batch??''}; });
  _ppFilter='all';
  renderPhotoPlanFilters(data);
  if(_ppReadOnly){
    document.getElementById('pp-summary').textContent+=' · planning fields unavailable';
  }
  renderPhotoPlanRows(data);
}

function renderPhotoPlanFilters(data){
  const assigned=data.filter(s=>_ppData[s.id].photo_batch!=='');
  const unassigned=data.length-assigned.length;
  document.getElementById('pp-summary').textContent=`${data.length} stones · ${assigned.length} batched · ${unassigned} unbatched`;

  const batches=[...new Set(data.map(s=>_ppData[s.id].photo_batch).filter(b=>b!==''))].sort((a,b)=>a-b);
  const filters=[{val:'all',label:'All'},{val:'unassigned',label:'Unbatched'},...batches.map(b=>({val:'batch'+b,label:'Batch '+b}))];
  const wrap=document.getElementById('pp-filters');
  wrap.innerHTML='';
  filters.forEach(f=>{
    const btn=document.createElement('button');
    btn.className='pp-filter-btn'+(f.val===_ppFilter?' active':'');
    btn.textContent=f.label;
    btn.onclick=()=>{_ppFilter=f.val;renderPhotoPlanRows(data);document.querySelectorAll('.pp-filter-btn').forEach(b=>b.classList.toggle('active',b===btn));};
    wrap.appendChild(btn);
  });
}

function renderPhotoPlanRows(data){
  let rows=data;
  if(_ppFilter==='unassigned') rows=data.filter(s=>_ppData[s.id].photo_batch==='');
  else if(_ppFilter.startsWith('batch')) rows=data.filter(s=>String(_ppData[s.id].photo_batch)===_ppFilter.slice(5));

  const TIER_COLORS={1:'#8b7355',2:'#7a9e8a',3:'#7a7aaa',4:'#aa7a7a'};
  const wrap=document.getElementById('pp-rows');
  if(!rows.length){wrap.innerHTML='<div style="padding:24px;text-align:center;color:var(--ink3);font-size:13px">No stones match this filter.</div>';return;}

  wrap.innerHTML=rows.map(s=>{
    const d=_ppData[s.id];
    const hex=(CRYSTALS.find(c=>c.i===s.id)||{}).ch||'#c8b89a';
    const ct=Number(s.collection_tier||s.tier||0);
    const tierDot=ct?`<span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:${TIER_COLORS[ct]||'#ccc'};flex-shrink:0;margin-right:6px"></span>`:'';
    return`<div class="pp-row" data-id="${s.id}">
      <div style="display:flex;align-items:center;gap:6px;min-width:0">
        <span style="display:inline-block;width:10px;height:10px;border-radius:50%;background:${hex};flex-shrink:0"></span>
        <span style="font-size:13px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${s.name||s.id}</span>
      </div>
      <div style="text-align:center">${tierDot}</div>
      <div><input type="number" class="pp-batch-inp" data-id="${s.id}" value="${d.photo_batch??''}" min="1" max="99" placeholder="—" onchange="ppSaveRow('${s.id}')" style="width:52px;font-size:12px;border:1px solid var(--border);border-radius:4px;padding:3px 6px;background:var(--white);color:var(--ink)"></div>
    </div>`;
  }).join('');
}

async function ppSaveRow(id){
  if(_ppReadOnly){
    const status=document.getElementById('pp-status');
    if(status)status.textContent='Planning fields unavailable.';
    return;
  }
  const inp=document.querySelector(`.pp-batch-inp[data-id="${id}"]`);
  if(!inp)return;
  const photo_batch=inp.value===''?null:parseInt(inp.value,10);
  _ppData[id]={photo_batch:photo_batch??''};

  const status=document.getElementById('pp-status');
  status.textContent='Saving…';
  const {error}=await _supa.from('stones').update({photo_batch}).eq('id',id);
  status.textContent=error?'Error saving.':'Saved.';
  setTimeout(()=>{if(status.textContent==='Saved.')status.textContent='';},2000);
}

