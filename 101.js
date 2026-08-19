// ── CRYSTALS 101 DATA ──
const C101_WATER = ["Angelite", "Black Kyanite", "Black Opal", "Blue Calcite", "Blue Fluorite", "Blue Kyanite", "Blue Opal", "Caribbean Calcite", "Chalcopyrite", "Cinnabar", "Clear Calcite", "Fire Opal", "Galena", "Green Calcite", "Green Fluorite", "Green Kyanite", "Green Opal", "Halite", "Honey Calcite", "Lapis Lazuli", "Lemurian Aquatine Calcite", "Lepidolite", "Malachite", "Mangano Calcite", "Opal", "Optical Calcite", "Orange Calcite", "Orange Kyanite", "Orange Selenite", "Pink Fluorite", "Pink Opal", "Purple Fluorite", "Pyrite", "Rainbow Fluorite", "Ruby in Kyanite", "Satin Spar Gypsum", "Selenite", "Teal Fluorite", "Turquoise", "White Opal", "Yellow Fluorite", "Zebra Calcite"];
const C101_SUN = ["Amethyst", "Aquamarine", "Black Amethyst", "Black Opal", "Blue Fluorite", "Blue Opal", "Blue Topaz", "Brandberg Amethyst", "Celestite", "Chevron Amethyst", "Fire Opal", "Green Fluorite", "Green Opal", "Imperial Topaz", "Kunzite", "Lavender Rose Quartz", "Opal", "Pink Fluorite", "Pink Opal", "Purple Fluorite", "Rainbow Fluorite", "Rose Quartz", "Teal Fluorite", "Topaz", "White Opal", "Yellow Fluorite"];
const C101_CHAKRAS = [
    {name:'Root',color:'#8A2F2B',loc:'Base of spine',num:120,theme:'Safety, stability, physical health, belonging, survival instincts',imbalance:'Anxiety, disconnection from body, financial stress, feeling ungrounded'},
    {name:'Sacral',color:'#A9562A',loc:'Below the navel',num:37,theme:'Creativity, pleasure, emotional flow, sexuality, relationships',imbalance:'Creative blocks, emotional rigidity, guilt, numbness or overwhelm in feelings'},
    {name:'Solar Plexus',color:'#A77A1E',loc:'Upper abdomen',num:74,theme:'Personal power, confidence, self-worth, will, digestion',imbalance:'Low self-esteem, powerlessness, people-pleasing, control issues'},
    {name:'Heart',color:'#55775A',loc:'Center of chest',num:105,theme:'Love, compassion, grief, forgiveness, connection to others',imbalance:'Closed heart, resentment, codependency, difficulty giving or receiving love'},
    {name:'Throat',color:'#3F7284',loc:'Throat',num:54,theme:'Communication, truth, self-expression, listening, authenticity',imbalance:'Difficulty speaking up, fear of judgment, talking without listening, dishonesty'},
    {name:'Third Eye',color:'#4A477F',loc:'Between the eyebrows',num:121,theme:'Intuition, perception, imagination, inner vision, clarity',imbalance:'Mental fog, ignoring intuition, over-rationalization, poor memory'},
    {name:'Crown',color:'#746284',loc:'Top of head',num:122,theme:'Connection to the divine, expanded consciousness, spiritual purpose',imbalance:'Spiritual disconnection, cynicism, feeling meaningless, over-attachment to ego'},
    {name:'Earth Star',color:'#5A4B42',loc:'Below the feet',num:6,theme:'Deep grounding, ancestral connection, earth anchoring, embodied safety',imbalance:'Feeling untethered, spiritually floaty, disconnected from place or body'},
];


const C101_FAMILIES=[["Quartz", 79, "The most abundant crystal family on Earth. Clear Quartz amplifies energy; colored varieties like Amethyst and Citrine carry their own distinct properties.", "Amplification · Clarity · Versatility", "Most varieties are durable (Mohs 7). Safe for water, sunlight, and most cleansing methods."], ["Feldspar", 9, "Includes Moonstone, Labradorite, and Sunstone. Known for adularescence \u2014 the inner glow that seems to move. Deeply connected to intuition and cycles.", "Intuition · Cycles · Inner light", "Mohs 6\u20136.5. Avoid harsh chemicals. Some varieties sensitive to sunlight over time."], ["Calcite", 13, "Soft, colorful, and energetically amplifying. Each color carries specific properties \u2014 orange for creativity, blue for calm, green for renewal. Easy to work with for beginners.", "Amplification · Emotional healing · Gentle energy", "Soft (Mohs 3). Do not use in water. Polish carefully."], ["Tourmaline", 6, "One of the most electrically active mineral families \u2014 tourmaline generates a charge when heated or compressed. Black Tourmaline is the premier protective stone.", "Protection · Grounding · Electromagnetic shielding", "Mohs 7\u20137.5. Generally durable. Black Tourmaline safe for most uses."], ["Garnet", 7, "A large family with many varieties \u2014 not just red. Known for passion, vitality, and grounding life-force energy. Almandine, Pyrope, and Grossular are all garnets.", "Vitality · Passion · Grounding", "Mohs 6.5\u20137.5. Generally durable and water-safe."], ["Jasper", 0, "A form of chalcedony, opaque and richly patterned. Nurturing, stabilizing stones that support endurance and connection to the earth.", "Grounding · Endurance · Nurturing", "Mohs 6.5\u20137. Durable and generally safe for all cleansing methods."], ["Obsidian", 6, "Volcanic glass \u2014 not technically a mineral but a natural glass formed from lava. Deeply protective and truth-revealing. Works fast and can be intense.", "Protection · Shadow work · Truth", "Mohs 5\u20135.5. Handle with care (sharp edges when fractured). Safe for water."], ["Agate", 0, "Banded chalcedony formed in cavities in volcanic rock. Stabilizing, grounding, and protective. Each variety has its own character depending on pattern and color.", "Stability · Grounding · Balance", "Mohs 7. Very durable. Safe for water and most cleansing."], ["Fluorite", 8, "Highly ordered crystal structure that makes it a powerful mental clarifier. Available in many colors; rainbow fluorite integrates all of them. Absorbs and neutralizes negative energy.", "Clarity · Mental focus · Neutralizing", "Soft (Mohs 4). Do not use in water. Sunlight may fade color over time."], ["Kyanite", 6, "One of the few stones said to never need cleansing \u2014 it doesn't accumulate negative energy. Available in blue, black, green, and orange. Aligns chakras automatically.", "Alignment · Communication · Self-cleansing", "Mohs 4.5\u20137 depending on direction. Handle carefully. Do not use in water."], ["Aragonite", 5, "A calcium carbonate mineral closely related to Calcite. Grounding, stabilizing, and supportive during stress. Star Aragonite radiates energy in all directions.", "Grounding · Patience · Stress relief", "Soft (Mohs 3.5\u20134). Do not use in water. Handle with care."], ["Opal", 7, "Unique structure that diffracts light into spectral colors. Amplifies emotions and traits \u2014 use intentionally. Ethiopian and Australian opals have different characters.", "Amplification · Emotion · Inspiration", "Soft (Mohs 5.5\u20136.5). Very water-sensitive \u2014 do not soak. Avoid heat and harsh light."]];
function set101StickyTop(){
  const sidebar = document.querySelector('.c101-sidebar');
  if(!sidebar || window.innerWidth <= 600) return;
  // Measure the sidebar's natural position BEFORE any scroll happens and lock it in
  requestAnimationFrame(function(){
    const top = sidebar.getBoundingClientRect().top;
    if(top > 0){
      sidebar.style.top = top + 'px';
      window._c101LayoutTop = top; // save for sidebar-click scroll target
    }
  });
}

function init101(){
  // If this is called from a restored tab before the later 101 constants have initialized,
  // retry after the script finishes instead of throwing and breaking the page.
  try { CRYSTAL_GRIDS; CRYSTAL_SHAPES; C101_FAM_DATA; } catch(e) { setTimeout(init101,0); return; }
  set101StickyTop();
  if(!window._101inited){
    window._101inited=true;
    initFamilies();
    renderShapes();
  } else {
    initFamilies();
    renderShapes();
  }
  init101Grids();
  show101('work',document.querySelector('.c101-sidebar-item[onclick*="work"]'));
  // Water pills
  const wp = document.getElementById('water-pills');
  if(wp) wp.innerHTML = '';
  if(wp) C101_WATER.forEach(n=>{
    const p=document.createElement('span');
    p.className='stone-pill';p.textContent=n;
    p.onclick=()=>jumpToStone(n);wp.appendChild(p);
  });
  // Sun pills
  const sp = document.getElementById('sun-pills');
  if(sp) sp.innerHTML = '';
  if(sp) C101_SUN.forEach(n=>{
    const p=document.createElement('span');
    p.className='stone-pill';p.textContent=n;
    p.onclick=()=>jumpToStone(n);sp.appendChild(p);
  });
  // Chakra cards
  const cc = document.getElementById('chakra-cards');
  if(cc) cc.innerHTML = '';
  if(cc) C101_CHAKRAS.forEach(ch=>{
    const d=document.createElement('div');
    d.className='chakra-card';
    const imbalanceTags=(ch.imbalance||'').split(',').map(s=>s.trim()).filter(Boolean).map(item=>`<span class="chakra-imbalance-tag">${escapeAttr(item)}</span>`).join('');
    d.innerHTML=`<div class="chakra-name"><span class="chakra-dot" style="background:${ch.color}"></span>${ch.name}</div>
      <div class="chakra-loc">${ch.loc}</div>
      <div class="chakra-theme">${ch.theme}</div>
      <div class="chakra-imbalance"><span class="chakra-imbalance-label">Signs of imbalance</span><div class="chakra-imbalance-tags">${imbalanceTags}</div></div>`;
    d.onclick=()=>jumpToChakra(ch.name);
    cc.appendChild(d);
  });
  // Family cards are rendered by renderPrimaryFamilies() via initFamilies() above
}

function ensure101BackTopButtons(){
  document.querySelectorAll('.c101-section').forEach(section=>{
    if(section.querySelector('.c101-backtop-wrap'))return;
    section.insertAdjacentHTML('beforeend','<div class="c101-backtop-wrap"><button class="c101-backtop" onclick="scrollTo101Top();return false;">Back to top</button></div>');
  });
}
function scrollTo101Top(){
  try{window.scrollTo({top:0,left:0,behavior:'smooth'});}catch(e){window.scrollTo(0,0);}
}
function roleSlugFromCard(card){
  const raw=card?.getAttribute('onclick')||'';
  const match=raw.match(/openEnergeticRole\('([^']+)'\)/);
  return match?match[1]:'';
}
function setupMobileRoleAccordion(){
  const cards=[...document.querySelectorAll('#s101-roles .role-card')];
  if(!cards.length)return;
  cards.forEach((card,idx)=>{
    if(!card.classList.contains('role-accordion-ready')){
      card.classList.add('role-accordion-ready');
      card.classList.remove('open');
      card.setAttribute('aria-expanded','false');
      const roleName=(card.querySelector('.role-name')?.textContent||'Role').trim();
      const slug=roleSlugFromCard(card);
      const body=card.querySelector('.role-body');
      if(body&&!body.querySelector('.role-cta')){
        const cta=document.createElement('button');
        cta.type='button';
        cta.className='role-cta';
        cta.textContent=`Browse ${roleName} stones →`;
        cta.addEventListener('click',function(e){
          e.preventDefault();
          e.stopPropagation();
          if(slug)openEnergeticRole(slug);
        });
        body.appendChild(cta);
      }
    }
  });
}
function show101(sec,btn){
  ensure101BackTopButtons();
  try{localStorage.setItem('spl_101_section',sec);}catch(e){}
  document.querySelectorAll('.c101-section').forEach(s=>s.classList.remove('active'));
  document.querySelectorAll('.c101-sidebar-item').forEach(p=>p.classList.remove('active'));
  // Scroll so the layout top sits at the same position it naturally had on load
  const layout = document.querySelector('.c101-layout');
  if(layout){ const offset = window._c101LayoutTop || 180; const y = layout.getBoundingClientRect().top + window.scrollY - offset; window.scrollTo({top:Math.max(0,y),behavior:'smooth'}); }
  const section=document.getElementById('s101-'+sec);
  if(section)section.classList.add('active');
  // 2026-07-23 fix: no longer falls back to the global `event` object. That
  // fallback was written for click handlers (where it resolved to the clicked
  // element) but also ran for programmatic calls with no click in flight —
  // e.g. the family-guide popstate handler calling show101(sec) on Back —
  // where `event` (if defined at all) is the popstate Event, so event.target
  // is `window`, which has no .classList and threw. btn is only trusted when
  // it's an actual Element; otherwise this looks up the matching sidebar item
  // itself (present for every real 101 subsection, including 'families'),
  // never fabricating a button and never throwing when none resolves.
  const activeBtn=(btn instanceof Element)?btn:document.querySelector(`.c101-sidebar-item[onclick*="${sec}"]`);
  if(activeBtn&&activeBtn.classList)activeBtn.classList.add('active');
  sync101Dropdown(sec);
  if(sec==='grids')init101Grids();
  if(sec==='shapes'){renderShapes();requestAnimationFrame(function(){setTimeout(function(){if(window._updateShapeArrows)window._updateShapeArrows();},100);});}
  if(sec==='families')initFamilies();
  if(sec==='roles'){setupMobileRoleAccordion();if(typeof equalizeKitCardHeights==='function')requestAnimationFrame(equalizeKitCardHeights);}
}

function sync101Dropdown(sec){
  const opt=document.querySelector(`.c101-mobile-nav-option[data-sec="${sec}"]`);
  if(!opt)return;
  const label=document.getElementById('c101-dropdown-label');
  if(label)label.textContent=opt.childNodes[0].textContent.trim();
  document.querySelectorAll('.c101-mobile-nav-option').forEach(o=>{o.classList.remove('active');o.setAttribute('aria-selected','false');});
  opt.classList.add('active');
  opt.setAttribute('aria-selected','true');
}

function toggle101Dropdown(e){
  e.stopPropagation();
  const trigger=document.getElementById('c101-dropdown-trigger');
  const panel=document.getElementById('c101-dropdown-panel');
  if(!trigger||!panel)return;
  const open=panel.classList.toggle('open');
  trigger.setAttribute('aria-expanded',open?'true':'false');
}

function select101Dropdown(sec,label,el){
  const panel=document.getElementById('c101-dropdown-panel');
  const trigger=document.getElementById('c101-dropdown-trigger');
  if(panel)panel.classList.remove('open');
  if(trigger)trigger.setAttribute('aria-expanded','false');
  show101(sec, document.querySelector(`.c101-sidebar-item[onclick*="${sec}"]`));
}

// Close dropdown when clicking outside
document.addEventListener('click',function(e){
  const nav=document.getElementById('c101-mobile-nav');
  if(nav&&!nav.contains(e.target)){
    const panel=document.getElementById('c101-dropdown-panel');
    const trigger=document.getElementById('c101-dropdown-trigger');
    if(panel)panel.classList.remove('open');
    if(trigger)trigger.setAttribute('aria-expanded','false');
  }
});

function jumpToStone(name){
  switchTab('encyclopedia', document.querySelector('[onclick*=encyclopedia]'));
  setTimeout(()=>{
    resetEncyclopediaFiltersForJump();
    const searchEl = document.getElementById('enc-search');
    if(searchEl){ searchEl.value=name; searchEl.dispatchEvent(new Event('input')); }
    setTimeout(scrollToEncyclopediaResults, 150);
  },100);
}

function resetEncyclopediaFiltersForJump(){
  filters={fam:'all',theme:'all',color:'all',chakra:'all',mohs:'all',formation:'all',material:'all',tier:'all'};
  ['fam','theme','color','chakra','mohs','formation','material','tier'].forEach(k=>{
    document.querySelectorAll('#pills-'+k+' .fpill').forEach(p=>p.classList.toggle('active',p.textContent.trim()==='All'));
    updateBtn('fbtn-'+k,'fval-'+k,'all');
  });
  const searchEl=document.getElementById('enc-search');
  if(searchEl)searchEl.value='';
}
function activateEncyclopediaFilter(key,val){
  filters[key]=val;
  const pills=document.querySelectorAll('#pills-'+key+' .fpill');
  pills.forEach(p=>p.classList.toggle('active',p.textContent.trim()===val));
  updateBtn('fbtn-'+key,'fval-'+key,val);
  closeAllPanels();
  encRender();
  setTimeout(scrollToEncyclopediaResults,120);
}
function scrollToEncyclopediaResults(){
  const el=document.getElementById('enc-search')||document.getElementById('enc-count')||document.getElementById('crystal-grid');
  if(!el)return;
  const y=el.getBoundingClientRect().top+window.scrollY-130;
  try{window.scrollTo({top:Math.max(0,y),left:0,behavior:'smooth'});}catch(e){window.scrollTo(0,Math.max(0,y));}
}
function jumpToFilteredEncyclopedia(key,val){
  switchTabByName('encyclopedia');
  setTimeout(()=>{
    resetEncyclopediaFiltersForJump();
    activateEncyclopediaFilter(key,val);
    setTimeout(scrollToEncyclopediaResults,180);
  },80);
}
function jumpToChakra(chakra){
  jumpToFilteredEncyclopedia('chakra',chakra);
}
function jumpToFamily(family){
  jumpToFilteredEncyclopedia('fam',family);
}
// ── Smaller Families Explore-button Back navigation (2026-08-05) — scoped
// only to the six Smaller Families profile-row Explore controls, not the
// shared jumpToFamily()/chakra/theme/primary-tile navigation used
// elsewhere. Mirrors the pattern family-guide.js's fgPatchOriginHistoryEntry
// + openFamilyGuide() already use for guide Back-navigation: patch the
// CURRENT entry (the Crystal Families page) so it records which profile
// was open, then push a new entry for the destination so Back has
// somewhere real to land instead of leaving the page. Restoration on
// popstate reads the URL's own query params (not event.state, which
// switchTabByName()'s syncTabUrl() replaces with null on every tab
// switch) — see the popstate handler in family-guide.js for the read side.
function jumpToSmallFamilyProfile(family){
  try{
    const originParams=new URLSearchParams(window.location.search);
    originParams.set('tab','101');
    originParams.set('section','families');
    originParams.set('profile',family);
    const originUrl=window.location.pathname+'?'+originParams.toString()+window.location.hash;
    history.replaceState(history.state,'',originUrl);
    const destParams=new URLSearchParams();
    destParams.set('tab','encyclopedia');
    destParams.set('fam',family);
    const destUrl=window.location.pathname+'?'+destParams.toString();
    history.pushState({smallFamilyResultsFor:family},'',destUrl);
  }catch(e){}
  jumpToFamily(family);
}
function jumpToTheme(theme){
  jumpToFilteredEncyclopedia('theme',theme);
}

// ── ENERGETIC ROLES (curated from stone_energetic_roles) ──
const ENERGETIC_ROLE_LABELS={
  'grounding':'Grounding',
  'protection':'Protection',
  'vitality':'Vitality / Energy',
  'heart-healing':'Heart Healing',
  'calm-peace':'Calm & Peace',
  'emotional-regulation':'Emotional Regulation',
  'clarity-focus':'Clarity & Focus',
  'intuition':'Intuition',
  'spiritual-connection':'Spiritual Connection',
  'transformation':'Transformation',
  'manifestation':'Manifestation',
  'amplification':'Amplification'
};
let _activeEnergeticRoleSlug=null;
let _activeEnergeticRoleRows=[];
let _activeEnergeticRoleFilter='primary'; // 'primary' (strength=3) or 'all' (strength>=2)

async function loadEnergeticRoleCounts(){
  try{
    const{data,error}=await _supa
      .from('stone_energetic_roles')
      .select('role_slug')
      .eq('active',true);
    if(error||!data)return;
    const counts={};
    data.forEach(r=>{counts[r.role_slug]=(counts[r.role_slug]||0)+1;});
    document.querySelectorAll('.er-role-count[data-role-slug]').forEach(el=>{
      const n=counts[el.dataset.roleSlug];
      if(n)el.textContent=n+' stones';
    });
  }catch(e){}
}

async function openEnergeticRole(slug){
  _activeEnergeticRoleSlug=slug;
  _activeEnergeticRoleFilter='primary';
  const tiles=document.getElementById('s101-roles-tiles');
  const result=document.getElementById('s101-roles-result');
  const grid=document.getElementById('s101-roles-result-grid');
  const title=document.getElementById('s101-roles-result-title');
  const meta=document.getElementById('s101-roles-result-meta');
  if(!result||!grid||!title)return;
  if(tiles)tiles.style.display='none';
  result.style.display='';
  title.textContent=ENERGETIC_ROLE_LABELS[slug]||slug;
  meta.textContent='';
  _updateErFilterUI();
  grid.innerHTML='<div style="padding:1rem;color:var(--ink3);font-size:13px">Loading...</div>';
  // scroll to top of the block (not result panel bottom)
  const block=document.getElementById('s101-roles-main-block');
  if(block){const y=block.getBoundingClientRect().top+window.scrollY-100;window.scrollTo({top:Math.max(0,y),behavior:'smooth'});}
  try{
    const{data,error}=await _supa
      .from('stone_energetic_roles')
      .select('stone_id,display_order,match_strength,reason_text')
      .eq('role_slug',slug)
      .eq('active',true)
      .order('display_order',{ascending:true});
    if(error)throw error;
    _activeEnergeticRoleRows=data||[];
    _renderEnergeticRoleGrid();
  }catch(e){
    grid.innerHTML='<div style="padding:1rem;color:var(--ink3);font-size:13px">Could not load stones. Please try again.</div>';
  }
}

function _renderEnergeticRoleGrid(){
  const grid=document.getElementById('s101-roles-result-grid');
  const meta=document.getElementById('s101-roles-result-meta');
  const allBtn=document.getElementById('er-filter-all');
  if(!grid)return;
  const all=_activeEnergeticRoleRows;
  const primary=all.filter(r=>r.match_strength===3);
  const visible=_activeEnergeticRoleFilter==='primary'?primary:all;
  if(allBtn)allBtn.textContent='All '+all.length;
  const primaryCount=primary.length;
  const allCount=all.length;
  if(_activeEnergeticRoleFilter==='primary'){
    meta.textContent=primaryCount+' primary match'+(primaryCount===1?'':'es')+' · '+allCount+' total';
  }else{
    meta.textContent=allCount+' stone'+(allCount===1?'':'s');
  }
  grid.innerHTML=visible.length
    ?visible.map(row=>{
        const stone=CRYSTALS.find(c=>c.i===row.stone_id);
        return stone?energeticRoleCardHtml(stone,row.reason_text,_activeEnergeticRoleSlug):'';
      }).join('')
    :'<div style="padding:1rem;color:var(--ink3);font-size:13px">No stones found.</div>';
}

function _updateErFilterUI(){
  const pBtn=document.getElementById('er-filter-primary');
  const aBtn=document.getElementById('er-filter-all');
  if(pBtn)pBtn.classList.toggle('active',_activeEnergeticRoleFilter==='primary');
  if(aBtn)aBtn.classList.toggle('active',_activeEnergeticRoleFilter==='all');
}

function setEnergeticRoleFilter(filter){
  _activeEnergeticRoleFilter=filter;
  _updateErFilterUI();
  _renderEnergeticRoleGrid();
}

function energeticRoleCardHtml(c,reasonText,slug){
  const encPhotos=ENCYCLOPEDIA_PHOTOS[c.i];
  const imgSrc=encPhotos?SUPABASE_ENC+encPhotos[0]:null;
  const imgZone=imgSrc
    ?`<div class="er-card-img"><img src="${imgSrc}" alt="${escapeAttr(c.n)}" loading="lazy"></div>`
    :`<div class="er-card-img"><div class="er-card-img-empty"></div></div>`;
  const whyHtml=reasonText?`<div class="er-card-why"><span class="er-card-why-label">Why:</span>${escapeAttr(reasonText)}</div>`:'';
  return `<div class="er-result-card" onclick="openEnergeticRoleDetail('${escapeAttr(c.i)}','${escapeAttr(slug)}')">${imgZone}<div class="er-card-body"><div class="er-card-name">${escapeAttr(c.n)}</div>${whyHtml}</div></div>`;
}

function openEnergeticRoleDetail(stoneId,slug){
  detailReturnContext={type:'energeticRole',slug:slug,scrollY:window.scrollY};
  openDetail(stoneId);
}

function closeEnergeticRoleResults(){
  const tiles=document.getElementById('s101-roles-tiles');
  const result=document.getElementById('s101-roles-result');
  if(result)result.style.display='none';
  if(tiles)tiles.style.display='';
  const prevSlug=_activeEnergeticRoleSlug;
  _activeEnergeticRoleSlug=null;
  _activeEnergeticRoleRows=[];
  // scroll to the previously selected tile if available, else section top
  let target=null;
  if(prevSlug){
    target=document.querySelector(`#s101-roles-tiles .role-card[onclick*="'${prevSlug}'"]`);
  }
  if(!target)target=document.getElementById('s101-roles');
  if(target){const y=target.getBoundingClientRect().top+window.scrollY-120;window.scrollTo({top:Math.max(0,y),behavior:'smooth'});}
}



// ── CARE SEARCH ──
const TOXIC_NOTES = {
  'Malachite':        'Copper-based — never use in water elixirs. Wash hands after handling raw or powdered specimens.',
  'Cinnabar':         'Mercury sulfide — display only. Wash hands after every handling session.',
  'Galena':           'Lead sulfide — wash hands after handling. Never use in water. Keep away from children.',
  'Pyrite':           'Can release sulfuric acid when wet — keep dry.',
  'Vanadinite':       'Lead vanadate — wash hands after handling. Display only; never use in water.',
  'Chalcopyrite':     'Copper-iron sulfide — keep dry, wash hands after handling.',
  'Bumblebee Jasper': 'Contains arsenic minerals — wash hands after handling. Never use in water or elixirs.',
  'Wulfenite':        'Lead molybdate — wash hands after handling. Display only; never use in water.',
  'Pyromorphite':     'Lead chlorophosphate — wash hands after handling. Display only; never use in water.',
  'Stibnite':         'Antimony sulfide — wash hands after handling. Never use in water.',
  'Sulfur':           'Avoid inhaling dust or fumes. Never use in water. Keep away from heat and open flame.',
  'Vivianite':        'Iron phosphate — safe to handle; keep dry. Oxidizes with prolonged air and light exposure.',
  'Zincite':          'Contains zinc oxide — wash hands after handling. Avoid inhaling dust from raw specimens.',
  'Tremolite':        'May contain asbestiform fibers — handle polished specimens only. Never sand, cut, or break.',
};

function openEncLightbox(src, alt, e){
  if(e) e.stopPropagation();
  const lb = document.getElementById('enc-lightbox');
  const img = document.getElementById('enc-lightbox-img');
  const label = document.getElementById('enc-lightbox-label');
  if(!lb || !img) return;
  img.src = src;
  img.alt = alt || '';
  if(label){ label.textContent = alt || ''; label.style.display = alt ? 'block' : 'none'; }
  lb.classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeEncLightbox(){
  const lb = document.getElementById('enc-lightbox');
  if(lb) lb.classList.remove('open');
  document.body.style.overflow = '';
}
document.addEventListener('keydown', function(e){
  if(e.key === 'Escape') closeEncLightbox();
});

function toggleCareAccordion(hdr){
  const body = hdr.nextElementSibling;
  const isOpen = body.classList.contains('open');
  body.classList.toggle('open', !isOpen);
  hdr.classList.toggle('open', !isOpen);
  hdr.setAttribute('aria-expanded', String(!isOpen));
}

document.addEventListener('click', function(e){
  const hdr = e.target.closest && e.target.closest('.charge-accordion-hdr');
  if(!hdr) return;
  const item = hdr.closest('.charge-accordion-item');
  if(!item) return;
  const isOpen = item.classList.contains('open');
  // Close all, then open this one if it was closed
  item.closest('.charge-accordion-list')
      .querySelectorAll('.charge-accordion-item')
      .forEach(i => { i.classList.remove('open'); i.querySelector('.charge-accordion-toggle').textContent = '+'; });
  if(!isOpen){
    item.classList.add('open');
    hdr.querySelector('.charge-accordion-toggle').textContent = '−';
  }
});

function runCareSearch(val){
  const result = document.getElementById('care-search-result');
  if(!val.trim()){ result.style.display='none'; return; }
  const q = val.toLowerCase().trim();
  const matches = CRYSTALS.filter(c => c.n.toLowerCase().includes(q));
  if(!matches.length){
    result.style.display='block';
    result.style.borderColor='var(--border)';
    result.innerHTML = `<span style="color:var(--ink3)">No stones found matching "<em>${val}</em>"</span>`;
    return;
  }
  const c = matches[0];
  const isWater = C101_WATER.includes(c.n);
  const isSun   = C101_SUN.includes(c.n);
  const toxNote = TOXIC_NOTES[c.n] || null;
  const allGood = !isWater && !isSun && !toxNote;

  let html = `<div style="font-size:14px;font-weight:500;color:var(--ink);margin-bottom:8px">${c.n}</div>`;
  if(allGood){
    html += `<div style="color:#3a6020">✓ Safe for water &nbsp;·&nbsp; ✓ Sun stable &nbsp;·&nbsp; ✓ No toxicity concerns</div>`;
  } else {
    if(isWater) html += `<div style="color:#8a3020;margin-bottom:4px">⚠ Keep dry — water sensitive</div>`;
    else        html += `<div style="color:#3a6020;margin-bottom:4px">✓ Safe for water</div>`;
    if(isSun)   html += `<div style="color:#8a6020;margin-bottom:4px">☀ Avoid extended sunlight — may fade</div>`;
    else        html += `<div style="color:#3a6020;margin-bottom:4px">✓ Sun stable</div>`;
    if(toxNote) html += `<div style="color:#8a3020;margin-bottom:4px">☠ Toxicity: ${toxNote}</div>`;
  }
  if(matches.length > 1){
    html += `<div style="margin-top:8px;font-size:11px;color:var(--ink3)">Also matched: ${matches.slice(1,4).map(x=>x.n).join(', ')}</div>`;
  }
  result.style.display='block';
  result.style.borderColor = allGood ? '#3a6020' : '#b04a4a';
  result.innerHTML = html;
}




// ── CRYSTAL FAMILIES DATA ──
// Representative gradient colors per family — used as placeholder until a real photo is added
// To add a photo: set photo:'fam-quartz.webp' on the family entry in C101_FAM_DATA
const FAM_PHOTO_COLORS={
  'Quartz':       'linear-gradient(145deg,#c9b8d8 0%,#9b7ab5 50%,#7a5a9a 100%)',
  // Chalcedony, Agate, and Jasper reuse the Quartz gradient verbatim (2026-07-23
  // family-grouping correction) — this is only a fallback used when a family
  // has no guide-photo/f.photo of its own (see renderPrimaryFamilies()). All three
  // are now browsable Crystals 101 tiles (below in C101_FAM_DATA,
  // guideSlug:"chalcedony"/"agate"/"jasper") and each supplies its own
  // f.photo, so this gradient no longer actually renders for any of them in
  // practice — the three entries are kept only as an inert fallback safety
  // net. No new color was invented.
  'Chalcedony':   'linear-gradient(145deg,#c9b8d8 0%,#9b7ab5 50%,#7a5a9a 100%)',
  'Agate':        'linear-gradient(145deg,#c9b8d8 0%,#9b7ab5 50%,#7a5a9a 100%)',
  'Jasper':       'linear-gradient(145deg,#c9b8d8 0%,#9b7ab5 50%,#7a5a9a 100%)',
  'Feldspar':     'linear-gradient(145deg,#d4c8b8 0%,#b8ccca 50%,#7a9aaa 100%)',
  'Calcite':      'linear-gradient(145deg,#f0d4a0 0%,#d4894a 60%,#c07030 100%)',
  'Garnet':       'linear-gradient(145deg,#c47878 0%,#8b2a2a 60%,#6a1a1a 100%)',
  'Tourmaline':   'linear-gradient(145deg,#5a5a5a 0%,#3a3530 60%,#2a2520 100%)',
  'Obsidian':     'linear-gradient(145deg,#5a5550 0%,#2a2520 60%,#1a1512 100%)',
  'Fluorite':     'linear-gradient(145deg,#b8d4c8 0%,#9a7ab5 50%,#6a8a6a 100%)',
  'Silicates':    'linear-gradient(145deg,#d4c8b8 0%,#b8a898 60%,#9a8878 100%)',
  'Aggregate':    'linear-gradient(145deg,#c8b898 0%,#a89878 60%,#8a7858 100%)',
  'Oxides':       'linear-gradient(145deg,#c8a8a8 0%,#8a5858 60%,#5a3838 100%)',
  'Carbonates':   'linear-gradient(145deg,#c8e8c8 0%,#5a9a5a 60%,#3a7a3a 100%)',
  'Phosphates':   'linear-gradient(145deg,#a8c8d8 0%,#5a8aaa 60%,#3a6a8a 100%)',
  'Sulfides':     'linear-gradient(145deg,#d4c880 0%,#b8a820 60%,#8a7810 100%)',
  'Opal':         'linear-gradient(145deg,#e8e0d8 0%,#d0c8e8 50%,#b8d0e0 100%)',
  'Beryl':        'linear-gradient(145deg,#b8e8d8 0%,#5ab8a8 60%,#3a9888 100%)',
  'Kyanite':      'linear-gradient(145deg,#b8c8e8 0%,#4a7ab8 60%,#2a5a98 100%)',
  'Aventurine':   'linear-gradient(145deg,#c8e8c0 0%,#6ab870 60%,#4a9850 100%)',
  'Gypsum':       'linear-gradient(145deg,#f0ece8 0%,#d8d4ce 60%,#b8b4ae 100%)',
  'Apatite':      'linear-gradient(145deg,#b0d8e8 0%,#4898b8 60%,#2878a0 100%)',
  'Aragonite':    'linear-gradient(145deg,#e8d8c0 0%,#c8a878 60%,#a88858 100%)',
  'Iron Minerals':'linear-gradient(145deg,#b8b0a8 0%,#786860 60%,#584840 100%)',
  'Garnet':       'linear-gradient(145deg,#c47878 0%,#8b2a2a 60%,#6a1a1a 100%)',
  'Meteoritic Material':'linear-gradient(145deg,#d0c8b8 0%,#a09888 60%,#707060 100%)',
  'Fossil Material':'linear-gradient(145deg,#d8c8a8 0%,#a89870 60%,#887850 100%)',
  'Organic Material':'linear-gradient(145deg,#e8d8a8 0%,#c8a840 60%,#a88820 100%)',
  'Corundum':     'linear-gradient(145deg,#e8b0b0 0%,#c84040 60%,#982020 100%)',
  'Spodumene':    'linear-gradient(145deg,#f0d8e8 0%,#d8a8c8 60%,#b888a8 100%)',
  "Tiger's Eye":  'linear-gradient(145deg,#e8c870 0%,#c8a030 60%,#a88010 100%)',
  'Serpentine':   'linear-gradient(145deg,#c8d8b0 0%,#80a860 60%,#608840 100%)',
  'Shungite':     'linear-gradient(145deg,#606060 0%,#303030 60%,#101010 100%)',
  'Sulfates':     'linear-gradient(145deg,#d8e8f0 0%,#a8c8e0 60%,#80a8c8 100%)',
  'Borates':      'linear-gradient(145deg,#e8e4e0 0%,#c8c4b8 60%,#a8a498 100%)',
};
const C101_FAM_DATA=[{"n": "Quartz", "tier": "major", "desc": "Silicon dioxide — the most abundant mineral family on Earth. Includes Clear Quartz, Amethyst, Rose Quartz, Citrine, Jasper, Agate, and Chalcedony.", "energy": "Amplifying, clarifying, versatile. Most Quartzes enhance intention and energy.", "care": "Mohs 7. Safe for water. Amethyst and Rose Quartz fade in prolonged sun.", "photo": SUPABASE_ENC+"clear-quartz.webp", "guideSlug": "quartz"}, {"n": "Feldspar", "tier": "major", "desc": "One of the most common mineral groups on Earth. Includes Moonstone, Labradorite, Amazonite, and Sunstone.", "energy": "Luminous, intuitive, often connected to cycles and inner glow. Many show adularescence.", "care": "Mohs 6–6.5. Moderate water tolerance; avoid prolonged soaking.", "photo": SUPABASE_ENC+"labradorite.webp", "guideSlug": "feldspar"}, {"n": "Calcite", "tier": "major", "desc": "Calcium carbonate crystals found in every color. Soft and often waxy to vitreous.", "energy": "Emotionally amplifying and clearing — each color adds a specific chakra quality.", "care": "Mohs 3. Never use water. Scratches easily. Store carefully.", "photo": SUPABASE_ENC+"blue-calcite.webp", "guideSlug": "calcite"}, {"n": "Garnet", "tier": "major", "desc": "Iron-rich silicates with deep luster. Not always red — green Tsavorite, orange Spessartine, violet Rhodolite.", "energy": "Energizing, passionate, grounding. Strong root and sacral energy as a family.", "care": "Mohs 6.5–7.5. Durable. Safe for water and daily wear.", "photo": SUPABASE_ENC+"garnet.webp", "guideSlug": "garnet"}, {"n": "Tourmaline", "tier": "major", "desc": "Complex boron silicate minerals with a striking color range. Often striated along the length.", "energy": "Strongly protective and balancing. Black Tourmaline is the most widely used protective stone.", "care": "Mohs 7–7.5. Durable. Safe for water. Excellent for jewelry.", "photo": SUPABASE_ENC+"black-tourmaline.webp"}, {"n": "Obsidian", "tier": "major", "desc": "Volcanic glass formed from rapidly cooled lava. Always black or near-black.", "energy": "Powerful shadow work, truth-revealing, and protective. One of the most intense families.", "care": "Mohs 5–5.5. Safe for water. Edges can be razor-sharp on raw pieces.", "photo": SUPABASE_ENC+"rainbow-obsidian.webp"}, {"n": "Fluorite", "tier": "major", "desc": "Calcium fluoride. One of the most colorful families — purple, green, blue, or rainbow.", "energy": "The clearest thinking stone. Cuts through confusion and supports focus. Color adds specificity.", "care": "Mohs 4. Never use water. Has perfect cleavage — drops can split it. Fades in sun.", "photo": SUPABASE_ENC+"fluorite-pyramid.webp", "guideSlug": "fluorite"}, {"n": "Chalcedony", "tier": "common", "desc": "Microcrystalline quartz — the same silica as Quartz, grown as compact intergrowths too fine to see as individual crystals. Includes Blue and Pink Chalcedony; Agate and Jasper are cataloged as their own separate families.", "energy": "Generally considered calming and steadying; specific properties vary by variety.", "care": "Mohs 6.5–7. Durable. Generally safe for water and most cleansing methods.", "photo": SUPABASE_ENC+"blue-chalcedony-small-sphere.webp", "guideSlug": "chalcedony"}, {"n": "Agate", "tier": "common", "desc": "Banded microcrystalline quartz — Chalcedony formed in layers. Includes many trade and pattern names such as Moss Agate, Blue Lace Agate, and Botswana Agate; Chalcedony and Jasper are cataloged as their own separate families.", "energy": "Generally considered stabilizing and grounding; specific properties vary by variety.", "care": "Mohs 6.5–7. Durable. Generally safe for water and most cleansing methods.", "photo": SUPABASE_ENC+"moss-agate.webp", "guideSlug": "agate"}, {"n": "Jasper", "tier": "common", "desc": "Opaque, fine-grained silica shaped by pattern, mineral inclusions, and geological history. Includes many trade and locality names such as Ocean Jasper, Picture Jasper, and Mookaite Jasper; Chalcedony and Agate are cataloged as their own separate families.", "energy": "Generally considered grounding and stabilizing; specific properties vary by variety.", "care": "Mohs 6.5–7. Durable. Generally safe for water and most cleansing methods.", "photo": SUPABASE_ENC+"red-jasper.webp", "guideSlug": "jasper"}, {"n": "Silicates", "tier": "common", "desc": "The largest mineral class. A broad catch-all for many diverse stones not in other families.", "energy": "Properties vary widely. Check individual entries rather than relying on family tendencies.", "care": "Hardness varies. Check individual entries."}, {"n": "Aggregate", "tier": "common", "desc": "Rocks made of multiple mineral grains — Jaspers, some Agates, Rhyolite, Unakite.", "energy": "Generally grounding, stabilizing, nature-connected. Earthy energy as a rule.", "care": "Usually durable. Most safe for water. Avoid prolonged soaking."}, {"n": "Oxides", "tier": "common", "desc": "Minerals built from oxygen and metals — Hematite, Corundum (Ruby/Sapphire), Magnetite.", "energy": "Strongly grounding, protective, and physically activating. Iron-rich oxides especially earthy.", "care": "Generally durable. Hematite rusts if left wet."}, {"n": "Carbonates", "tier": "common", "desc": "Includes Malachite, Rhodochrosite, Dolomite, and Magnesite. Softness and color vary.", "energy": "Emotional in nature — heart-connected, transformative, or stabilizing depending on the stone.", "care": "Mostly water-sensitive. Malachite can be toxic — avoid in water elixirs, wash hands."}, {"n": "Phosphates", "tier": "common", "desc": "Includes Turquoise, Apatite, Vivianite, and Lazulite. Often vivid blues and greens.", "energy": "Communication, truth, and throat/third eye energy run throughout this family.", "care": "Most are water-sensitive. Turquoise discolors with water, oils, and chemicals."}, {"n": "Sulfides", "tier": "common", "desc": "Metal sulfide minerals — Pyrite, Galena, Cinnabar, Covellite. Often metallic and heavy.", "energy": "Shadow work, protection, and deep earth energy. Pyrite is the main manifestation stone here.", "care": "Never use water — sulfides oxidize and some are toxic. Wash hands after handling raw pieces."}, {"n": "Opal", "tier": "common", "desc": "Hydrated silica — a mineraloid, not a true crystal. Famous for play-of-color.", "energy": "Emotional amplification, creativity, and spontaneity. Intensifies what you bring to it.", "care": "Mohs 5.5–6.5. Water-sensitive despite being hydrated — soaking causes crazing."}, {"n": "Other Mineral", "tier": "common", "desc": "Stones that do not fit neatly into other families — a diverse group of unique specimens.", "energy": "Properties are stone-specific. Check individual entries for energy, care, and use.", "care": "Varies widely. Check individual entries."}, {"n": "Beryl", "tier": "specialty", "desc": "A colorful family with distinct personalities.", "energy": "Aquamarine brings calm clarity, Emerald centers the heart, and Heliodor carries sunny confidence.", "care": "Mohs 7.5–8. Durable. Safe for water and jewelry.", "photo": "https://vxujlgyhgnihnqrxzefw.supabase.co/storage/v1/object/public/stone-images/family-guides/beryl/beryl.webp"}, {"n": "Zeolites", "tier": "specialty", "desc": "Airy, delicate minerals with a gentle presence.", "energy": "Often associated with clarity, calm, spiritual connection, and quiet uplift.", "photo": SUPABASE_ENC+"mesolite.webp"},{"n": "Kyanite", "tier": "specialty", "desc": "Aluminum silicate with blade-like crystals. Blue, black, green, and orange varieties.", "energy": "Self-aligning — said not to accumulate negative energy and rarely needs cleansing.", "care": "Mohs 4.5–7 (directional). Avoid water."}, {"n": "Aventurine", "tier": "specialty", "desc": "Quartz with sparkly mineral inclusions. Green, blue, and pink varieties.", "energy": "Luck, opportunity, and heart energy. Green Aventurine is one of the most popular prosperity stones.", "care": "Mohs 7. Safe for water. Stable in sun."}, {"n": "Aragonite", "tier": "specialty", "desc": "Calcium carbonate polymorph with different structure than Calcite. Often star-shaped.", "energy": "Grounding, centering, and emotionally stabilizing. Excellent for earth-connection work.", "care": "Mohs 3.5–4. Avoid water. Fragile; handle gently."}, {"n": "Copper Minerals", "tier": "specialty", "desc": "Explore the blue, green, and red minerals shaped by changing conditions around copper deposits.", "energy": "Explore the blue, green, and red minerals shaped by changing conditions around copper deposits.", "care": "Water-sensitive. Can be toxic — avoid in water elixirs, wash hands.", "photo": SUPABASE_ENC+"azurmalachite.webp", "guideSlug": "copper"}, {"n": "Gypsum", "tier": "specialty", "desc": "Hydrated calcium sulfate. Includes Selenite, Satin Spar, and Desert Rose.", "energy": "Cleansing, purifying, and connecting to higher guidance. Selenite is the most used clearing tool.", "care": "Mohs 2. Never use water — dissolves over time. Self-cleansing; rarely needs clearing."}, {"n": "Apatite", "tier": "specialty", "desc": "Calcium phosphate minerals — same mineral as teeth and bones. Blue, green, or yellow.", "energy": "Manifestation, motivation, and clearing confusion. Strong connection to personal truth.", "care": "Mohs 5. Avoid water and acids. Somewhat brittle."}, {"n": "Iron Minerals", "tier": "specialty", "desc": "Iron-rich minerals including Hematite, Magnetite, Lodestone, and Goethite.", "energy": "Deeply grounding, protective, and physically activating. Lodestone used for attraction work.", "care": "Avoid water — iron rusts. Safe for daily handling otherwise."}, {"n": "Meteoritic Material", "tier": "rare", "desc": "Stones from space — Moldavite, Meteorite, Libyan Desert Glass, and Tektite.", "energy": "Intensely transformative and high-vibration. Moldavite especially is known for accelerating change.", "care": "Varies. Moldavite should not be soaked. Handle meteorites with clean dry hands."}, {"n": "Fossil Material", "tier": "rare", "desc": "Mineralized remains of ancient life — Ammonite, Orthoceras, Petrified Wood, Stromatolite.", "energy": "Ancient wisdom, ancestral connection, and deep time. Living records of life millions of years ago.", "care": "Generally durable. Most safe for brief water contact; some matrix material can be fragile."}, {"n": "Organic Material", "tier": "rare", "desc": "Materials of biological origin — Amber, Jet, Pearl, Coral. Not minerals in the traditional sense.", "energy": "Warmth, protection, and connection to ancient life. Amber is fossilized tree resin; Jet is fossilized wood.", "care": "Soft and scratch-prone. Avoid harsh chemicals, prolonged water, and heat."}, {"n": "Corundum", "tier": "rare", "desc": "Aluminum oxide — Ruby and Sapphire. Second hardest natural mineral after Diamond.", "energy": "Power, clarity, and divine connection. Ruby activates passion; Sapphire opens wisdom and truth.", "care": "Mohs 9. Extremely durable. Safe for water, jewelry, and daily wear."}, {"n": "Spodumene", "tier": "rare", "desc": "Lithium aluminum silicate — Kunzite (pink) and Hiddenite (green).", "energy": "Gentle heart opening, love, and gratitude. Unusually soft and tender in energetic quality.", "care": "Mohs 6.5–7. Kunzite fades rapidly in sunlight. Has perfect cleavage — handle with care."}, {"n": "Tiger's Eye", "tier": "rare", "desc": "Pseudomorphic quartz after crocidolite. Chatoyant (cat's-eye effect) in gold, red, and blue.", "energy": "Courage, confidence, and clear-eyed perception. The moving light band is distinctive.", "care": "Mohs 7. Safe for water. Stable in sun."}, {"n": "Serpentine", "tier": "rare", "desc": "Magnesium silicate group with green, mottled appearance. Includes Healerite and Atlantisite.", "energy": "Heart healing, emotional release, and connection to ancient nature energy.", "care": "Mohs 3–5. Avoid prolonged water exposure."}, {"n": "Halite", "tier": "rare", "desc": "Sodium chloride — rock salt crystals. Blue and pink varieties are collectors pieces.", "energy": "Purification, emotional clearing, and dissolving energetic residue. Ancient and elemental.", "care": "Mohs 2.5. Literally dissolves in water. Never wet. Very fragile."}, {"n": "Shungite", "tier": "rare", "desc": "A unique carbon-based mineraloid from Russia, over 2 billion years old.", "energy": "EMF shielding, purification, and ancient earth grounding. One of the most studied stones.", "care": "Mohs 3.5–4. Elite Shungite only in water. Leaves black residue initially."}, {"n": "Synthetic Material", "tier": "rare", "desc": "Lab-created or enhanced stones — Opalite, Goldstone, some Aura Quartzes.", "energy": "Often beautiful and energetically useful. Aura Quartzes (metal-bonded) are a popular example.", "care": "Varies. Generally durable. Be transparent about synthetic vs. natural origin."}, {"n": "Sulfates", "tier": "rare", "desc": "Sulfate minerals including Barite and Celestite. Often pastel and very delicate.", "energy": "Calming, higher guidance, and angelic connection. Celestite is beloved for its serene energy.", "care": "Mohs 3–3.5. Very fragile. Never use water. Store padded and separate."}, {"n": "Borates", "tier": "rare", "desc": "Borate minerals including Howlite and Ulexite. White or gray with distinctive veining.", "energy": "Calming, patience, and emotional attunement. Howlite is often dyed blue and sold as Turquoise.", "care": "Mohs 3–3.5. Avoid prolonged water contact."}];
const C101_TIERS=[
  {id:'major',label:'The Big Seven',sub:'The families you will encounter most often.'},
  {id:'common',label:'Common Families',sub:'Regularly found in shops and collections.'},
  {id:'specialty',label:'Specialty Families',sub:'Require more knowledge but reward the effort.'},
  {id:'rare',label:'Rare & Exotic',sub:'Less common, more specialized or demanding.'},
];
// Approved fixed primary roster (2026-07-23): "Ten Families, Many Stories".
// Exact membership and order per Christie/Lyra's approved editorial direction.
// This list — not tier — now determines what the primary Crystal Families
// grid shows; C101_FAM_DATA/C101_TIERS keep every family's full record for
// a possible future "All Families" or "Smaller Families" view.
// 2026-07-31: Chalcedony swapped for Copper Minerals in this primary-grid
// roster only, per Christie's approved landing-grid update. Chalcedony's
// own C101_FAM_DATA entry, family guide, and route are all untouched —
// it simply no longer appears in this fixed ten-tile list.
const C101_PRIMARY_FAMILIES=["Quartz","Calcite","Feldspar","Fluorite","Garnet","Tourmaline","Obsidian","Copper Minerals","Agate","Jasper","Beryl","Zeolites"];
function renderPrimaryFamilies(){
  const fc=document.getElementById('fam-cards');
  if(!fc)return;
  if(!window.FAM_COUNTS){window.FAM_COUNTS={};CRYSTALS.forEach(c=>{if(c.fam)window.FAM_COUNTS[c.fam]=(window.FAM_COUNTS[c.fam]||0)+1;});}
  const byName={};C101_FAM_DATA.forEach(f=>{byName[f.n]=f;});
  const filtered=C101_PRIMARY_FAMILIES.map(n=>byName[n]).filter(Boolean);
  fc.innerHTML=filtered.map(f=>{
    const cnt=window.FAM_COUNTS[f.n]||0;
    const fArg=jsArg(f.n);
    // Guide-enabled families (currently: Calcite) source their tile photo from the
    // Family Guide record once loaded, so the image isn't hand-duplicated in two files.
    const guideRecord=(f.guideSlug&&window.FAMILY_GUIDES&&window.FAMILY_GUIDES[f.guideSlug])||null;
    const guidePhoto=guideRecord&&guideRecord.hero&&guideRecord.hero.image?SUPABASE_ENC+guideRecord.hero.image:null;
    const photo=guidePhoto||f.photo;
    const photoSlot=photo
      ?`<img class="fam-photo-img" src="${escapeAttr(photo)}" alt="${escapeAttr(f.n)}" loading="lazy">`
      :`<div class="fam-photo-placeholder" style="background:${FAM_PHOTO_COLORS[f.n]||'var(--stone3)'}"></div>`;
    // The delegated click listener registered in initFamilies() below is the
    // authoritative click path (it already reliably fires for every tile); this
    // inline handler only needs to suppress default and stay inert so it can't
    // double-fire the navigation alongside the delegated listener.
    const clickAction=f.guideSlug
      ?`return false;`
      :`jumpToFamily(${fArg});return false;`;
    const cardTitle=f.guideSlug?`Open the ${escapeAttr(f.n)} Family Guide`:`View ${escapeAttr(f.n)} stones in the encyclopedia`;
    // Action-line label reflects each tile's actual verified destination
    // (f.guideSlug is set only for families with a real, loading family
    // guide) — never invented independently of that data.
    const actionLabel=f.guideSlug?'Explore family guide →':'Browse family stones →';
    return`<div class="fam-card fam-card--primary" data-family="${escapeAttr(f.n)}" onclick="${clickAction}" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();this.click();}" title="${cardTitle}" tabindex="0" role="button"><div class="fam-photo">${photoSlot}</div><div class="fam-body"><div class="fam-name">${f.n}</div>${cnt?`<div class="fam-count">${cnt} stone${cnt===1?'':'s'}</div>`:''}<div class="fam-energy">${f.energy||f.desc}</div><div class="fam-card-action">${actionLabel}</div></div></div>`;
  }).join('');
}
// ── Smaller Families, Distinct Stories (2026-08-03, revised to the
// approved profile-row design — one full-width row per family: labeled
// FAMILY FOUNDATION / NAMES TO KNOW / WHAT MAKES THEM DISTINCT facts on the
// left, a modest supporting specimen image on the right, subordinate in
// scale to the primary-family tiles above). Verified against the live
// `stones.family` column and ENCYCLOPEDIA_PHOTOS map before wiring (see
// task brief). This is a small, separate roster from
// C101_PRIMARY_FAMILIES/C101_FAM_DATA — it does not touch either.
// linkFamily is the exact `stones.family` value used by
// jumpToFamily()/jumpToFilteredEncyclopedia('fam', ...). Mica/Zoisite/Jade
// were null here until 2026-08-05: their real members (Muscovite/
// Lepidolite/Fuchsite; Tanzanite/Thulite; Jadeite/Nephrite Jade) were filed
// under the catch-all "Silicates" family rather than a clean family value
// of their own. Christie approved reclassifying those 7 stones (plus
// Desert Rose -> Gypsum) in the Production Master; applied there first,
// then to Supabase `stones.family`, via the guarded
// pipeline/tools/update-production-master-row.js + a one-off controlled
// Supabase pass (both verified via save/reopen/reread — see task report).
// All six families now have a working, verified Explore link.
const C101_SECONDARY_FAMILIES=[
  {n:'Gypsum',
    foundation:"Gypsum can grow in forms that look remarkably different while sharing the same mineral identity.",
    names:"Selenite, Satin Spar, and Desert Rose.",
    distinct:"Selenite and Satin Spar have different crystal habits, while Desert Rose forms as Gypsum grows with sand.",
    photo:SUPABASE_ENC+"desert-rose-specimen.webp", linkFamily:'Gypsum', linkLabel:'Explore Gypsum'},
  {n:'Mica',
    foundation:"Mica is a family of minerals united by a layered structure and an unmistakable shimmer.",
    names:"Muscovite, Lepidolite, and Fuchsite, the green chromium-rich variety of Muscovite.",
    distinct:"Different chemistry changes the color, but the layered structure reveals their relationship.",
    photo:SUPABASE_ENC+"lepidolite.webp", linkFamily:'Mica', linkLabel:'Explore Mica'},
  {n:'Corundum',
    foundation:"Ruby and Sapphire are two colorful identities of the same exceptionally hard mineral: Corundum.",
    names:"Ruby and Sapphire.",
    distinct:"Chromium produces Ruby's red, while iron with titanium produces the classic blue of Sapphire. Their different names reflect color and gem history, not a different mineral foundation.",
    photo:SUPABASE_ENC+"ruby-tumble-family.webp", linkFamily:'Corundum', linkLabel:'Explore Corundum'},
  {n:'Spodumene',
    foundation:"Spodumene is a lithium-bearing mineral whose gem varieties can look almost unrelated.",
    names:"Kunzite appears pink to lilac, Hiddenite green, and Triphane yellow to colorless.",
    distinct:"Small changes in chemistry transform the color, and many crystals show different shades when viewed from different directions.",
    photo:SUPABASE_ENC+"kunzite.webp", linkFamily:'Spodumene', linkLabel:'Explore Spodumene'},
  {n:'Zoisite',
    foundation:"Zoisite moves through an extraordinary range of appearances.",
    names:"Tanzanite is its blue-violet gem variety, Thulite is pink, and green Zoisite can grow with vivid Ruby in the material known as Anyolite.",
    distinct:"Color, transparency, and companion minerals can change the look completely. Once the relationship is visible, these seemingly unrelated stones begin to read as one family.",
    photo:SUPABASE_ENC+"tanzanite.webp", linkFamily:'Zoisite', linkLabel:'Explore Zoisite'},
  {n:'Jade',
    foundation:"Jade is one historic name shared by two different materials: Jadeite and Nephrite.",
    names:"Jadeite and Nephrite.",
    distinct:"Their mineral structures differ, but both are exceptionally tough because tiny crystals interlock rather than separating easily. That toughness allowed Jade to become tools, ornaments, and intricate carvings across many cultures.",
    photo:SUPABASE_ENC+"jadeite-wc.webp", linkFamily:'Jade', linkLabel:'Explore Jade'},
];
function renderSecondaryFamilies(){
  const fc=document.getElementById('fam-cards-secondary');
  if(!fc)return;
  if(!C101_SECONDARY_FAMILIES.length){
    fc.outerHTML='<div class="fam-future-note" id="fam-cards-secondary-note">More focused family guides are on the way.</div>';
    return;
  }
  const fact=(label,text)=>`<div class="smallfam-fact"><div class="smallfam-fact-label">${label}</div><p class="smallfam-fact-text">${text}</p></div>`;
  fc.innerHTML=C101_SECONDARY_FAMILIES.map(f=>{
    // Real <button type="button"> with a data-jump-family attribute, read by
    // the delegated listener in initFamilies() below — no href="#" fallback
    // that could ever fall through to a default anchor navigation, and no
    // inline onclick (an earlier onclick="jumpToFamily(${jsArg(...)})"
    // attempt corrupted the double-quoted HTML attribute with jsArg()'s own
    // double-quoted JSON output).
    const linkHtml=f.linkFamily
      ?`<button type="button" class="smallfam-explore-link" data-jump-family="${escapeAttr(f.linkFamily)}">${escapeAttr(f.linkLabel)}</button>`
      :'';
    return`<div class="smallfam-card"><div class="smallfam-content"><div class="smallfam-name">${escapeAttr(f.n)}</div>${fact('Family Foundation',f.foundation)}${fact('Names to Know',f.names)}${fact('What Makes Them Distinct',f.distinct)}${linkHtml}</div><div class="smallfam-photo"><img class="smallfam-photo-img" src="${escapeAttr(f.photo)}" alt="${escapeAttr(f.n)}" loading="lazy"></div></div>`;
  }).join('');
}
function initFamilies(){
  try { C101_FAM_DATA; } catch(e) { setTimeout(initFamilies,0); return; }
  if(!window.FAM_COUNTS){window.FAM_COUNTS={};CRYSTALS.forEach(c=>{if(c.fam)window.FAM_COUNTS[c.fam]=(window.FAM_COUNTS[c.fam]||0)+1;});}
  const fcDelegate=document.getElementById('fam-cards');
  if(fcDelegate&&fcDelegate.dataset.familyDelegated!=='1'){
    fcDelegate.dataset.familyDelegated='1';
    fcDelegate.addEventListener('click',function(e){
      const card=e.target.closest('.fam-card');
      if(!card)return;
      const fam=card.getAttribute('data-family')||card.querySelector('.fam-name')?.textContent?.trim();
      if(!fam)return;
      e.preventDefault();
      e.stopPropagation();
      const famData=C101_FAM_DATA.find(x=>x.n===fam);
      if(famData&&famData.guideSlug&&typeof openFamilyGuide==='function'){
        openFamilyGuide(famData.guideSlug);
      }else{
        jumpToFamily(fam);
      }
    });
  }
  const fcSecondary=document.getElementById('fam-cards-secondary');
  if(fcSecondary&&fcSecondary.dataset.familyDelegated!=='1'){
    fcSecondary.dataset.familyDelegated='1';
    fcSecondary.addEventListener('click',function(e){
      const link=e.target.closest('.smallfam-explore-link');
      if(!link)return;
      const fam=link.getAttribute('data-jump-family');
      if(!fam)return;
      e.preventDefault();
      e.stopPropagation();
      jumpToSmallFamilyProfile(fam);
    });
  }
  renderPrimaryFamilies();
  renderSecondaryFamilies();
}



// ── CRYSTAL GRIDS ──

const CRYSTAL_GRIDS = [
  {
    id: 'safe-grounded',
    name: 'Safe & Grounded',
    tagline: 'Anchor your energy and strengthen your boundaries',
    moodLink: 4,
    layout: 'Hexagram',
    color: '#3a3530',
    intro: 'This grid supports the feeling of being steady, contained, and secure within your own energy. Black Tourmaline anchors the intention, Smoky Quartz creates a grounded inner field, and Hematite reinforces the six outer points of the hexagram. The hexagram\'s intersecting triangles create a balanced structure with six strong outer points, making it well suited to grounding and protection.',
    activation: 'I am grounded, protected, and secure within my own energy.',
    use: 'Place near an entryway, workspace, or any area where you want a steadier sense of boundary. It can also support recovery after crowded spaces, stressful interactions, or periods of overstimulation.',
    howToActivate: [
      'Place Black Tourmaline at the center. Beginning at north, place the six Smoky Quartz stones clockwise around the inner hexagon. Add the six Hematite stones at the outer star points, again beginning at north and moving clockwise.',
      'With your activator wand, trace from Black Tourmaline to each Smoky Quartz and back, then to each Hematite and back, maintaining the same clockwise order. Seal the grid with one continuous clockwise circle around the outer boundary.',
    ],
    stones: [
      {name:'Black Tourmaline', id:'C-0129', slug:'black-tourmaline', hex:'#2e2a26', role:'Center',            purpose:'Anchors the grid and establishes a clear protective focus'},
      {name:'Smoky Quartz',     id:'C-0103', slug:'smoky-quartz',     hex:'#8b6f47', role:'Inner hexagon ×6',  purpose:"Grounds the field and supports the release of heaviness"},
      {name:'Hematite',         id:'C-0041', slug:'hematite',         hex:'#6e6a64', role:'Outer star points ×6', purpose:'Adds stability and reinforces the boundary'},
    ],
    diagram: drawSafeGroundedGrid,
  },
  {
    id: 'opportunity-growth',
    name: 'Opportunity & Growth',
    tagline: 'Open to possibility and support purposeful action',
    moodLink: 20,
    layout: 'Seed of Life',
    color: '#4a8a5a',
    intro: "Opportunity becomes meaningful when openness is paired with action. Green Aventurine holds the intention for growth, Pyrite supports confidence and practical possibility, and Tiger's Eye adds discernment and follow-through. The Seed of Life expands outward from one center, making it a natural shape for beginnings, possibility, and growth.",
    activation: 'I recognize aligned opportunities and act on them with confidence.',
    use: 'Place on a desk or near the plans for a business, application, creative project, or new chapter. Write a specific intention for the opportunity you are ready to recognize and support through action.',
    howToActivate: [
      'Place Green Aventurine at the center. Beginning at north, fill the six surrounding Seed of Life positions clockwise, alternating Pyrite and Tiger\'s Eye.',
      'With your activator wand, trace from Green Aventurine to each surrounding stone and back in the same clockwise order. Seal the grid with one continuous clockwise circle around the outer edge of the Seed of Life.',
    ],
    stones: [
      {name:'Green Aventurine', id:'C-0178', slug:'green-aventurine', hex:'#4a8a5a', role:'Center',            purpose:'Opens the grid toward opportunity, growth, and a fresh beginning'},
      {name:'Pyrite',           id:'C-0137', slug:'pyrite',           hex:'#c9a832', role:'Surrounding positions ×3', purpose:'Supports confidence, resourcefulness, and practical abundance'},
      {name:"Tiger's Eye",      id:'C-0168', slug:'tigers-eye',       hex:'#8a5a2a', role:'Surrounding positions ×3', purpose:'Adds discernment, persistence, and purposeful action'},
    ],
    diagram: drawOpportunityGrowthGrid,
  },
  {
    id: 'self-love-compassion',
    name: 'Self-Love & Compassion',
    tagline: 'Practice compassion, repair, and renewed openness',
    moodLink: 11,
    layout: 'Flower of Life',
    color: '#d4839a',
    intro: "Self-love is not a demand to feel positive all the time. This grid creates space for compassion, repair, and a gentler relationship with yourself. Rose Quartz holds the center, Rhodonite supports emotional mending, and Green Aventurine opens the work toward renewed heart growth. The Flower of Life's interlocking circles emphasize connection and unfolding, supporting a process of compassion, repair, and renewed openness.",
    activation: 'I meet myself with compassion. My heart is safe to soften and grow.',
    use: 'Place beside a journal, near a favorite resting place, or in a private space used for reflection. Return to it when self-criticism is loud, an old hurt is resurfacing, or you want to practice receiving your own care.',
    howToActivate: [
      'Place Rose Quartz at the center. Beginning at north, place the six Rhodonite stones clockwise on the first connected flower nodes. Add the six Green Aventurine stones on the selected outer nodes, beginning with the position nearest north and continuing clockwise.',
      'With your activator wand, trace from Rose Quartz to each Rhodonite and back, then to each Green Aventurine and back. Seal the grid with one continuous clockwise circle around the outer boundary.',
    ],
    stones: [
      {name:'Rose Quartz',      id:'C-0108', slug:'rose-quartz',      hex:'#d4839a', role:'Center',              purpose:'Holds the central intention of compassion and self-regard'},
      {name:'Rhodonite',        id:'C-0214', slug:'rhodonite',        hex:'#c46880', role:'Inner flower nodes ×6', purpose:'Supports emotional repair, forgiveness, and steadiness'},
      {name:'Green Aventurine', id:'C-0178', slug:'green-aventurine', hex:'#4a8a5a', role:'Offset outer nodes ×6', purpose:'Encourages renewed openness and heart-centered growth'},
    ],
    diagram: drawSelfLoveCompassionGrid,
  },
  {
    id: 'clear-focus',
    name: 'Clear Focus',
    tagline: 'Organize your thoughts and direct your attention',
    moodLink: 13,
    layout: 'Equilateral triangle',
    color: '#4a7aaa',
    intro: "This grid gives scattered thought a clear center and a defined direction. Fluorite supports organization and concentration, Sodalite steadies reasoning at the triangle's three vertices, and Clear Quartz points direct the completed pattern inward. The triangle gives the intention a stable, directed structure, helping gather attention toward one clear center.",
    activation: 'My mind is clear. I know what matters, and I direct my attention there.',
    use: 'Place on a desk during study, focused work, planning, or decision-making. Write one question, task, or priority beneath the center so the grid has a defined focus rather than a general request for clarity.',
    howToActivate: [
      'Place Fluorite at the center. Beginning at the northern vertex, place the three Sodalite stones clockwise around the triangle. Set one Clear Quartz point directly beyond each Sodalite, with every tip aimed inward toward Fluorite.',
      'With your activator wand, trace from Fluorite to each Sodalite and back in clockwise order. Then trace from Fluorite through each Sodalite to its Clear Quartz point and back. Seal the grid with one continuous clockwise circle around the three outer points.',
    ],
    stones: [
      {name:'Rainbow Fluorite', id:'C-0035', slug:'fluorite',     hex:'#6a9a7a', role:'Center',              purpose:'Organizes the central intention and supports concentration'},
      {name:'Sodalite',         id:'C-0218', slug:'sodalite',     hex:'#4a5f8a', role:'Triangle vertices ×3', purpose:'Supports orderly thought, discernment, and steady reasoning'},
      {name:'Clear Quartz',     id:'C-0105', slug:'clear-quartz', hex:'#b9c6d1', role:'Points beyond the vertices ×3', purpose:'Directs and amplifies the supporting qualities toward the center'},
    ],
    diagram: drawClearFocusGrid,
  },
  {
    id: 'restful-sleep',
    name: 'Restful Sleep',
    tagline: 'Quiet the mind and ease into rest',
    moodLink: 3,
    layout: 'Circle',
    color: '#7a5a9a',
    intro: 'This quiet, non-directional grid supports the transition from a busy day into rest. Amethyst anchors mental settling, Lepidolite softens the inner emotional field, and Howlite forms a calm, balanced outer boundary. The circle creates a quiet, continuous boundary with no directional pull, making it especially suited to rest.',
    activation: 'I release the day. My mind is quiet, and my body is ready to rest.',
    use: 'Place on a stable bedside surface or dresser where it will not be disturbed. Activate it as part of your evening transition, then keep the surrounding space visually quiet and free from unrelated objects.',
    howToActivate: [
      'Place Amethyst at the center. Beginning at north, place the three Lepidolite stones clockwise around the inner circle to form an even triangle. Place the six Howlite stones clockwise around the outer circle, beginning with the upper position nearest north.',
      'With your activator wand, trace from Amethyst to each Lepidolite and back, then to each Howlite and back, maintaining a slow clockwise order. Seal the grid with one gentle clockwise circle around the Howlite boundary.',
    ],
    stones: [
      {name:'Amethyst',   id:'C-0119', slug:'amethyst',   hex:'#7a5a9a', role:'Center',        purpose:'Anchors quiet, mental settling, and the intention to rest'},
      {name:'Lepidolite', id:'C-0254', slug:'lepidolite', hex:'#9a7ab0', role:'Inner triangle ×3', purpose:"Supports emotional calming and release of the day's tension"},
      {name:'Howlite',    id:'C-0241', slug:'howlite',    hex:'#d8d4ce', role:'Outer circle ×6',   purpose:'Encourages stillness and creates a quiet outer boundary'},
    ],
    diagram: drawRestfulSleepGrid,
  },
  {
    id: 'release-renewal',
    name: 'Release & Renewal',
    tagline: 'Honor what is complete and welcome the next cycle',
    moodLink: 25,
    layout: 'Spiral',
    color: '#68727a',
    intro: 'Change often asks for two kinds of work: releasing what is complete and making room for what follows. Labradorite anchors the transition, Smoky Quartz begins the path with grounding and release, and Moonstone carries that same path into renewal. The spiral creates a continuous path outward, making release and renewal feel like connected stages of one unfolding process.',
    activation: 'I honor what is complete and welcome the next chapter with trust.',
    use: 'Use during a transition, ending, move, habit change, or deliberate new beginning. Place a written statement beneath the center naming what is complete and what you are choosing to welcome next.',
    howToActivate: [
      'Place Labradorite at the center. Follow the spiral outward, placing the three Smoky Quartz stones first and then the three Moonstone, one stone at each marked interval.',
      'With your activator wand, begin at Labradorite and trace along the spiral to the first Smoky Quartz, then return to center. Repeat for each stone in order, moving progressively outward. After linking the final Moonstone, trace the full spiral once from Labradorite to the outer endpoint. Seal the grid with one continuous clockwise circle around its boundary.',
    ],
    stones: [
      {name:'Labradorite', id:'C-0028', slug:'labradorite', hex:'#68727a', role:'Center',        purpose:'Anchors transition, transformation, and trust in the process'},
      {name:'Smoky Quartz',id:'C-0103', slug:'smoky-quartz',hex:'#8b6f47', role:'Inner spiral ×3', purpose:'Supports grounded release as the path begins'},
      {name:'Moonstone',   id:'C-0162', slug:'moonstone',   hex:'#7a93b0', role:'Outer spiral ×3', purpose:'Continues the movement toward renewal and a new cycle'},
    ],
    diagram: drawReleaseRenewalGrid,
  },
];

// ── GRID DIAGRAM DRAWING FUNCTIONS ──
// Shared geometry helpers. Coordinate space is a 400×400 viewBox, center (200,200).

const GRID_CATEGORY_HEX = {
  Purple:'#7a5a9a', Blue:'#4a7aaa', Green:'#4a8a5a', Pink:'#d4839a',
  Red:'#b04a4a', Orange:'#c4683a', Yellow:'#c9a832', Black:'#3a3530',
  White:'#d8d4ce', Brown:'#8b6f47', Gray:'#8a8a8a',
};

// Multi-category stones use their first two category colors in a 135° gradient.
const GRID_STONE_CATS = {
  'hematite':   ['Gray','Black'],
  'rhodonite':  ['Pink','Black'],
  'fluorite':   ['Green','Blue'],
  'sodalite':   ['Blue','White'],
  'lepidolite': ['Pink','Purple'],
  'howlite':    ['Gray','White'],
  'moonstone':  ['Blue','White'],
};

function gridTint(hex){
  const rgb = [1,3,5].map(i=>parseInt(hex.slice(i,i+2),16));
  return '#'+rgb.map(v=>Math.round(v+(255-v)*.6).toString(16).padStart(2,'0')).join('');
}

function gridStoneStops(slug, hex){
  if(slug==='pyrite') return ['#f1cf55','#a87516'];
  if(slug==='tigers-eye') return ['#b8732d','#5f3d24'];
  const cats = GRID_STONE_CATS[slug];
  if(cats) return [GRID_CATEGORY_HEX[cats[0]], GRID_CATEGORY_HEX[cats[1]]];
  return [gridTint(hex), hex];
}

function gridGradientDefs(uid, stones){
  const slugs = [...new Set(stones.map(s=>s.slug))];
  let defs = slugs.map(slug=>{
    const stone = stones.find(s=>s.slug===slug);
    const stops = gridStoneStops(slug, stone.hex);
    return `<linearGradient id="grad-${uid}-${slug}" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="${stops[0]}"/><stop offset="100%" stop-color="${stops[1]}"/></linearGradient>`;
  }).join('');
  if(slugs.includes('clear-quartz')){
    defs += `<linearGradient id="grad-${uid}-clear-quartz-point" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#f7fbff"/><stop offset="100%" stop-color="#aebdca"/></linearGradient>`;
  }
  return `<defs>${defs}</defs>`;
}

function gridNorthMarker(){
  return '<g aria-hidden="true"><line x1="28" y1="22" x2="28" y2="43" stroke="var(--ink3)" stroke-width="1"/><path d="M24 29 L28 22 L32 29" fill="none" stroke="var(--ink3)" stroke-width="1"/><text x="28" y="15" text-anchor="middle" font-size="11" font-family="Jost,sans-serif" fill="var(--ink3)" letter-spacing="0.08em">N</text></g>';
}

function gridStoneMarker(x, y, stone, r, uid, isCenter){
  const cx = (+x).toFixed(2), cy = (+y).toFixed(2);
  const strokeColor = isCenter ? 'var(--accent)' : 'var(--white)';
  const sw = isCenter ? 2 : 3;
  let html = `<g><circle cx="${cx}" cy="${cy}" r="${r}" fill="url(#grad-${uid}-${stone.slug})" stroke="${strokeColor}" stroke-width="${sw}"/>`;
  if(isCenter) html += `<circle cx="${cx}" cy="${cy}" r="${r+4}" fill="none" stroke="var(--accent)" stroke-width="0.75" opacity="0.4"/>`;
  html += `<title>${stone.name}</title></g>`;
  return html;
}

function gridQuartzPoint(x, y, stone, uid, targetX=200, targetY=200){
  const angle = Math.atan2(targetX-x, -(targetY-y)) * 180/Math.PI;
  return `<g><path fill="url(#grad-${uid}-clear-quartz-point)" stroke="var(--ink3)" stroke-width="1" stroke-opacity="0.5" transform="translate(${(+x).toFixed(2)} ${(+y).toFixed(2)}) rotate(${angle.toFixed(4)})" d="M0 -13 L7 7 L0 12 L-7 7 Z"/><title>${stone.name}</title></g>`;
}

function gridPolarPoints(count, radius, startDegrees=-90){
  return Array.from({length:count},(_,i)=>{
    const a = (startDegrees + (360/count)*i) * Math.PI/180;
    return [200 + radius*Math.cos(a), 200 + radius*Math.sin(a)];
  });
}

function drawSafeGroundedGrid(stones, svgId){
  const svg = document.getElementById(svgId);
  if(!svg) return;
  const uid = svgId;
  const outer = [[200,55],[326,127],[326,273],[200,345],[74,273],[74,127]];
  const inner = [[200,128],[263,164],[263,236],[200,272],[137,236],[137,164]];
  const poly = pts => pts.map(p=>p.join(',')).join(' ');
  let geometry = `<polygon points="${poly([outer[0],outer[2],outer[4]])}" fill="none" stroke="var(--grid-line)" stroke-width="1.55"/>`;
  geometry += `<polygon points="${poly([outer[3],outer[5],outer[1]])}" fill="none" stroke="var(--grid-line)" stroke-width="1.55"/>`;
  geometry += `<polygon points="${poly(inner)}" fill="none" stroke="var(--grid-line)" stroke-width="1" opacity="0.72"/>`;
  geometry += `<circle cx="200" cy="200" r="145" fill="none" stroke="var(--grid-line)" stroke-width="1" opacity="0.72"/>`;
  const center = stones.find(s=>s.role==='Center');
  const smoky = stones.find(s=>s.slug==='smoky-quartz');
  const hematite = stones.find(s=>s.slug==='hematite');
  let markers = gridStoneMarker(200,200,center,14,uid,true);
  inner.forEach(p=>{ markers += gridStoneMarker(p[0],p[1],smoky,10,uid,false); });
  outer.forEach(p=>{ markers += gridStoneMarker(p[0],p[1],hematite,10,uid,false); });
  svg.innerHTML = gridGradientDefs(uid, stones) + gridNorthMarker() + geometry + markers;
}

function drawOpportunityGrowthGrid(stones, svgId){
  const svg = document.getElementById(svgId);
  if(!svg) return;
  const uid = svgId;
  const centers = [[200,125],[265,162.5],[265,237.5],[200,275],[135,237.5],[135,162.5]];
  let geometry = `<circle cx="200" cy="200" r="75" fill="none" stroke="var(--grid-line)" stroke-width="1.55"/>`;
  centers.forEach(p=>{ geometry += `<circle cx="${p[0]}" cy="${p[1]}" r="75" fill="none" stroke="var(--grid-line)" stroke-width="1" opacity="0.72"/>`; });
  const center = stones.find(s=>s.role==='Center');
  const pyrite = stones.find(s=>s.slug==='pyrite');
  const tigersEye = stones.find(s=>s.slug==='tigers-eye');
  let markers = gridStoneMarker(200,200,center,14,uid,true);
  centers.forEach((p,i)=>{
    const s = i%2===0 ? pyrite : tigersEye;
    markers += gridStoneMarker(p[0],p[1],s,10,uid,false);
  });
  svg.innerHTML = gridGradientDefs(uid, stones) + gridNorthMarker() + geometry + markers;
}

function drawSelfLoveCompassionGrid(stones, svgId){
  const svg = document.getElementById(svgId);
  if(!svg) return;
  const uid = svgId;
  const ring1 = [[200,142],[250.23,171],[250.23,229],[200,258],[149.77,229],[149.77,171]];
  const ring2 = [[200,84],[250.23,113],[300.46,142],[300.46,200],[300.46,258],[250.23,287],[200,316],[149.77,287],[99.54,258],[99.54,200],[99.54,142],[149.77,113]];
  const allCenters = [[200,200], ...ring1, ...ring2];
  let geometry = allCenters.map(p=>`<circle cx="${p[0]}" cy="${p[1]}" r="58" fill="none" stroke="var(--grid-line)" stroke-width="1" opacity="0.72"/>`).join('');
  geometry += `<circle cx="200" cy="200" r="116" fill="none" stroke="var(--grid-line)" stroke-width="1" opacity="0.72"/>`;
  const outerChosen = [[250.23,113],[300.46,200],[250.23,287],[149.77,287],[99.54,200],[149.77,113]];
  const center = stones.find(s=>s.role==='Center');
  const rhodonite = stones.find(s=>s.slug==='rhodonite');
  const aventurine = stones.find(s=>s.slug==='green-aventurine');
  let markers = gridStoneMarker(200,200,center,14,uid,true);
  ring1.forEach(p=>{ markers += gridStoneMarker(p[0],p[1],rhodonite,10,uid,false); });
  outerChosen.forEach(p=>{ markers += gridStoneMarker(p[0],p[1],aventurine,10,uid,false); });
  svg.innerHTML = gridGradientDefs(uid, stones) + gridNorthMarker() + geometry + markers;
}

function drawClearFocusGrid(stones, svgId){
  const svg = document.getElementById(svgId);
  if(!svg) return;
  const uid = svgId;
  const vertices = gridPolarPoints(3,130,-90);
  const amplifiers = vertices.map(([x,y])=>{
    const dx = x-200, dy = y-200, len = Math.hypot(dx,dy);
    return [x+(dx/len)*36, y+(dy/len)*36];
  });
  let geometry = `<polygon points="${vertices.map(p=>p.map(n=>n.toFixed(2)).join(',')).join(' ')}" fill="none" stroke="var(--grid-line)" stroke-width="1.55"/>`;
  geometry += `<circle cx="200" cy="200" r="73" fill="none" stroke="var(--grid-line)" stroke-width="1" opacity="0.72"/>`;
  const center = stones.find(s=>s.role==='Center');
  const sodalite = stones.find(s=>s.slug==='sodalite');
  const quartz = stones.find(s=>s.slug==='clear-quartz');
  let markers = gridStoneMarker(200,200,center,14,uid,true);
  vertices.forEach(p=>{ markers += gridStoneMarker(p[0],p[1],sodalite,10,uid,false); });
  amplifiers.forEach(p=>{ markers += gridQuartzPoint(p[0],p[1],quartz,uid); });
  svg.innerHTML = gridGradientDefs(uid, stones) + gridNorthMarker() + geometry + markers;
}

function drawRestfulSleepGrid(stones, svgId){
  const svg = document.getElementById(svgId);
  if(!svg) return;
  const uid = svgId;
  const inner = gridPolarPoints(3,68,-90);
  const outer = gridPolarPoints(6,128,-60);
  let geometry = `<circle cx="200" cy="200" r="128" fill="none" stroke="var(--grid-line)" stroke-width="1.55"/>`;
  geometry += `<circle cx="200" cy="200" r="68" fill="none" stroke="var(--grid-line)" stroke-width="1" opacity="0.72"/>`;
  const center = stones.find(s=>s.role==='Center');
  const lepidolite = stones.find(s=>s.slug==='lepidolite');
  const howlite = stones.find(s=>s.slug==='howlite');
  let markers = gridStoneMarker(200,200,center,14,uid,true);
  inner.forEach(p=>{ markers += gridStoneMarker(p[0],p[1],lepidolite,10,uid,false); });
  outer.forEach(p=>{ markers += gridStoneMarker(p[0],p[1],howlite,11,uid,false); });
  svg.innerHTML = gridGradientDefs(uid, stones) + gridNorthMarker() + geometry + markers;
}

function drawReleaseRenewalGrid(stones, svgId){
  const svg = document.getElementById(svgId);
  if(!svg) return;
  const uid = svgId;
  const spiralPoint = theta => {
    const radius = 14.7 * theta;
    const phase = Math.PI * 1.25;
    return [200 + radius*Math.sin(theta+phase), 200 - radius*Math.cos(theta+phase)];
  };
  const endTheta = Math.PI * 2.5;
  const sampleCount = 240;
  const samples = Array.from({length:sampleCount+1},(_,i)=>spiralPoint((endTheta*i)/sampleCount));
  const cumulative = [0];
  for(let i=1;i<samples.length;i++){
    cumulative.push(cumulative[i-1] + Math.hypot(samples[i][0]-samples[i-1][0], samples[i][1]-samples[i-1][1]));
  }
  const totalLength = cumulative[cumulative.length-1];
  const pointAtFraction = fraction => {
    const target = totalLength*fraction;
    const idx = cumulative.findIndex(len=>len>=target);
    if(idx<=0) return samples[0];
    const span = cumulative[idx]-cumulative[idx-1];
    const mix = span ? (target-cumulative[idx-1])/span : 0;
    return [
      samples[idx-1][0] + (samples[idx][0]-samples[idx-1][0])*mix,
      samples[idx-1][1] + (samples[idx][1]-samples[idx-1][1])*mix,
    ];
  };
  const spiralPath = samples.map((p,i)=>`${i?'L':'M'}${p[0].toFixed(2)} ${p[1].toFixed(2)}`).join(' ');
  const geometry = `<path d="${spiralPath}" fill="none" stroke="var(--grid-line)" stroke-width="1.75" opacity="0.75"/>`;
  const placements = Array.from({length:6},(_,i)=>pointAtFraction((i+1)/6));
  const release = placements.slice(0,3);
  const renewal = placements.slice(3);
  const center = stones.find(s=>s.role==='Center');
  const smoky = stones.find(s=>s.slug==='smoky-quartz');
  const moonstone = stones.find(s=>s.slug==='moonstone');
  let markers = gridStoneMarker(200,200,center,14,uid,true);
  release.forEach(p=>{ markers += gridStoneMarker(p[0],p[1],smoky,10,uid,false); });
  renewal.forEach(p=>{ markers += gridStoneMarker(p[0],p[1],moonstone,10,uid,false); });
  svg.innerHTML = gridGradientDefs(uid, stones) + gridNorthMarker() + geometry + markers;
}

// ── RENDER GRID CARDS ──

function renderGridCards() {
  try { CRYSTAL_GRIDS; } catch(e) { setTimeout(renderGridCards,0); return; }
  const container = document.getElementById('grid-cards');
  if(!container) return;
  
  container.innerHTML = CRYSTAL_GRIDS.map(grid => {
    const moodLabel = MOOD_DATA[grid.moodLink]?.label || '';
    return `<div class="grid-card" onclick="openGridModal('${grid.id}')">
      <div class="grid-card-swatch" style="background:${grid.color}20;border-color:${grid.color}40">
        <svg viewBox="0 0 400 400" width="140" height="140" id="card-svg-${grid.id}" role="img" aria-label="${grid.name} grid diagram"></svg>
      </div>
      <div class="grid-card-body">
        <div class="grid-card-name">${grid.name}</div>
        <div class="grid-card-tagline">${grid.tagline}</div>
        <div class="grid-card-mood"><span class="grid-card-mood-arrow">↗</span> Use When: ${moodLabel}</div>
      </div>
    </div>`;
  }).join('');
  
  // Draw card diagrams (simplified)
  CRYSTAL_GRIDS.forEach(grid => {
    setTimeout(() => {
      const svg = document.getElementById(`card-svg-${grid.id}`);
      if(svg) grid.diagram(grid.stones, `card-svg-${grid.id}`);
    }, 50);
  });
}

// ── GRID MODAL ──

function openGridModal(gridId) {
  const grid = CRYSTAL_GRIDS.find(g=>g.id===gridId);
  if(!grid) return;
  
  const stoneRows = grid.stones.map(s => 
    `<tr onclick="detailReturnContext={type:'grid',gridId:'${grid.id}'};closeGridModal();switchTabByName('encyclopedia');openDetail('${s.id}')" style="cursor:pointer">
      <td style="padding:8px 10px 8px 0;vertical-align:middle">
        <span style="display:inline-flex;align-items:center;gap:7px">
          <span style="width:12px;height:12px;border-radius:50%;background:${s.hex};border:0.5px solid rgba(0,0,0,0.1);flex-shrink:0"></span>
          <span style="font-family:'Cormorant Garamond',serif;font-size:16px">${s.name}</span>
        </span>
      </td>
      <td style="padding:8px 0;font-size:11px;letter-spacing:0.04em;text-transform:uppercase;color:var(--ink3)">${s.role}</td>
      <td style="padding:8px 0 8px 12px;font-size:12px;color:var(--ink2)">${s.purpose}</td>
    </tr>`
  ).join('');
  
  document.getElementById('grid-modal-content').innerHTML = `
    <div class="grid-modal-actions"><button class="btn btn-sm" onclick="printGridModal();event.stopPropagation();">Print grid</button></div>
    <div style="margin-bottom:1.5rem">
      <div style="font-size:11px;letter-spacing:0.09em;text-transform:uppercase;color:var(--ink2);font-weight:400;margin-bottom:6px">${grid.tagline}</div>
      <div style="font-family:'Cormorant Garamond',serif;font-size:32px;font-weight:300;color:var(--ink);margin-bottom:0.75rem">${grid.name}</div>
      <p style="font-size:13px;color:var(--ink2);line-height:1.7">${grid.intro}</p>
    </div>
    
    <div class="grid-modal-layout" style="display:grid;grid-template-columns:1fr 1fr;gap:2rem;margin-bottom:1.5rem">
      <div style="min-width:0">
        <svg viewBox="0 0 400 400" width="100%" id="modal-svg-${grid.id}" style="max-width:280px;display:block;margin:0 auto" role="img" aria-label="${grid.name} grid diagram"></svg>
      </div>
      <div style="min-width:0">
        <div style="font-size:10px;letter-spacing:0.08em;text-transform:uppercase;color:var(--ink3);margin-bottom:8px">Stones</div>
        <table style="width:100%;border-collapse:collapse">
          ${stoneRows}
        </table>
        <p style="font-size:11px;color:var(--ink3);margin-top:8px;font-style:italic">Tap any stone to open its encyclopedia entry.</p>
      </div>
    </div>
    
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin-bottom:1rem">
      <div style="background:var(--stone2);border-radius:8px;padding:1rem">
        <div style="font-size:10px;letter-spacing:0.08em;text-transform:uppercase;color:var(--ink3);margin-bottom:6px">Activation</div>
        <div style="font-family:'Cormorant Garamond',serif;font-size:17px;font-weight:500;font-style:italic;color:var(--ink);line-height:1.5">"${grid.activation}"</div>
      </div>
      <div style="background:var(--stone2);border-radius:8px;padding:1rem">
        <div style="font-size:10px;letter-spacing:0.08em;text-transform:uppercase;color:var(--ink3);margin-bottom:6px">Placement & use</div>
        <div style="font-size:13px;color:var(--ink2);line-height:1.6">${grid.use}</div>
      </div>
    </div>
    
    <div style="padding:0.75rem 1rem;border-left:2px solid var(--accent2);background:var(--stone2);border-radius:0 6px 6px 0">
      <div style="font-size:10px;letter-spacing:0.08em;text-transform:uppercase;color:var(--ink3);margin-bottom:8px">How to activate</div>
      <p style="font-size:13px;color:var(--ink2);line-height:1.6;margin:0 0 10px">${grid.howToActivate[0]}</p>
      <p style="font-size:13px;color:var(--ink2);line-height:1.6;margin:0">${grid.howToActivate[1]}</p>
    </div>`;
  
  document.getElementById('grid-modal-overlay').classList.add('open');
  setTimeout(() => grid.diagram(grid.stones, `modal-svg-${grid.id}`), 80);
}

function printGridModal(){
  const modal=document.getElementById('grid-modal');
  if(!modal)return;
  const printWin=window.open('','_blank','width=900,height=900');
  if(!printWin){ window.print(); return; }
  const cleaned=modal.cloneNode(true);
  cleaned.querySelectorAll('button,.grid-modal-actions,.grid-modal-close').forEach(el=>el.remove());
  printWin.document.write(`<!doctype html><html><head><title>Crystal Grid</title>
    <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;500&family=Jost:wght@300;400;500&display=swap" rel="stylesheet">
    <style>@page{size:letter portrait;margin:0.35in} *{box-sizing:border-box} body{font-family:Jost,sans-serif;color:#2a2520;padding:0;background:#fff;font-size:11px;line-height:1.35} .grid-modal{width:7.8in;max-height:10.25in;margin:0 auto;overflow:hidden} .grid-modal>div{margin-bottom:0.45rem!important} svg{max-height:2.25in!important} table{page-break-inside:avoid;font-size:10.5px} td{padding:4px 6px!important} p{margin:0!important;line-height:1.35!important} [style*='font-size:32px']{font-size:24px!important;margin-bottom:0.25rem!important} [style*='grid-template-columns:1fr 1fr']{gap:0.5rem!important} [style*='padding:1rem']{padding:0.45rem!important}</style>
    </head><body>${cleaned.outerHTML}</body></html>`);
  printWin.document.close();
  printWin.focus();
  setTimeout(()=>{printWin.print();printWin.close();},350);
}

function closeGridModal() {
  document.getElementById('grid-modal-overlay').classList.remove('open');
}

// Init grids when 101 tab loads
function init101Grids() {
  try { CRYSTAL_GRIDS; } catch(e) { setTimeout(init101Grids,0); return; }
  renderGridCards();
}



// ── CRYSTAL SHAPES ──

const SHAPE_CATEGORIES = [
  { label: 'Holdable', def: 'Pieces meant to be carried, held, or kept close',                          ids: ['tumble','palm','worry','heart'] },
  { label: 'Display',  def: 'Pieces chosen for shape, presence, shelf appeal, or visual structure',     ids: ['sphere','egg','tower','pyramid','cube','freeform','flame','bowl'] },
  { label: 'Natural',  def: 'Pieces that show the stone\'s natural growth, texture, and mineral character', ids: ['raw','specimen','point','cluster','geode','druzy','slice'] },
  { label: 'Symbolic', def: 'Pieces chosen because the shape itself carries meaning',                   ids: ['moon','star','mushroom','wand','carving'] },
];

const CRYSTAL_SHAPES = [
  {
    id: 'tumble',
    name: 'Tumble',
    tagline: 'Polished, softened, accessible',
    tile: 'The most versatile form: smooth, pocket-sized, and gentle enough for daily carry, body work, or gifting.',
    body: 'Machine-polished until smooth. The energy is gentler and more diffuse than raw — easier to carry, hold, and work with daily. Ideal for beginners and for stones used in direct body contact. The most versatile and widely available form.',
    use: 'Daily carry · Body work · Grids · Gifting',
    examples: ['Rose Quartz', 'Carnelian', 'Labradorite', 'Obsidian'],
    draw: drawTumbledShape,
  },
  {
    id: 'palm',
    name: 'Palm Stone',
    tagline: 'Made for touch, somatic, grounding',
    tile: 'Flat and fitted for the palm, the go-to form for anxiety, nervous system work, and any practice that benefits from direct skin contact.',
    body: 'Shaped to fit the palm — flat, smooth, slightly rounded. Direct skin contact amplifies the energetic exchange between stone and body. Ideal for nervous system work, anxiety, and any practice that benefits from physical sensation and presence.',
    use: 'Anxiety · Nervous system · Body presence · Meditation',
    examples: ['Lepidolite', 'Howlite', 'Rhodonite', 'Hematite'],
    draw: drawPalmShape,
  },
  {
    id: 'worry',
    name: 'Worry Stone',
    tagline: 'Repetitive touch, anxiety, presence',
    tile: 'A thumb-indented oval built for repetitive rubbing, as much a somatic tool as an energetic one. Keep one in your pocket.',
    body: 'Flat oval with a thumb-sized indentation. Designed for repetitive rubbing — the physical repetition activates the parasympathetic nervous system and grounds attention in the body. A somatic tool as much as an energetic one. Keep one in a pocket.',
    use: 'Anxiety · Fidgeting · Grounding · Daily carry',
    examples: ['Howlite', 'Amethyst', 'Lepidolite', 'Sodalite'],
    draw: drawWorryShape,
  },
  {
    id: 'heart',
    name: 'Heart',
    tagline: 'Emotional, receptive, heart-centered',
    tile: 'Carved into a heart to concentrate heart-center energy. The shape itself becomes the intention, comforting to hold during emotional work.',
    body: 'Carved into a heart shape to concentrate and activate heart-center energy. The shape itself is an intention. Used in emotional healing, self-love practice, relationship work, and as a physical symbol of what you are working toward. Comforting to hold during difficult emotional work.',
    use: 'Heart healing · Self-love · Grief · Relationship intention',
    examples: ['Rose Quartz', 'Rhodonite', 'Green Aventurine', 'Malachite'],
    draw: drawHeartShape,
  },
  {
    id: 'sphere',
    name: 'Sphere',
    tagline: 'Equal, continuous, panoramic',
    tile: 'Radiates energy equally in all directions with no point or emphasis. The most balanced form, ideal for scrying, meditation, and ambient space work.',
    body: 'Emits energy equally in all directions — no point, no emphasis, no directionality. The most balanced form. Used in scrying, meditation, and spaces where you want steady ambient energy rather than focused projection.',
    use: 'Meditation · Scrying · Ambient energy · Balance work',
    examples: ['Clear Quartz', 'Rose Quartz', 'Obsidian', 'Labradorite'],
    draw: drawSphereShape,
  },
  {
    id: 'egg',
    name: 'Egg',
    tagline: 'New beginnings, fertility, grounding',
    tile: 'A form tied to new beginnings and potential, satisfying to hold and roll in the palms, with energy concentrated at the tapered apex.',
    body: 'The egg shape carries strong symbolism of new beginnings, potential, and fertility — and practically, the rounded base and tapered top create a natural energy concentration at the apex. Satisfying to hold and roll between the palms. Used in body work and new-chapter rituals.',
    use: 'New beginnings · Body rolling · Fertility · Transition work',
    examples: ['Rose Quartz', 'Obsidian', 'Malachite', 'Amazonite'],
    draw: drawEggShape,
  },
  {
    id: 'tower',
    name: 'Tower',
    tagline: 'Directed upward, projecting, anchoring',
    tile: 'A flat-based column that projects energy upward continuously, stable and versatile for rooms, grids, and altars alike.',
    body: 'A flat-based, six-sided column that projects energy upward and outward continuously. Towers are among the most versatile forms — place them in a room to shift the ambient energy, use them in grids as anchor points, or hold during meditation. The flat base makes them stable and easy to place.',
    use: 'Room energy · Grids · Meditation · Intention setting',
    examples: ['Amethyst', 'Selenite', 'Labradorite', 'Black Tourmaline'],
    draw: drawTowerShape,
  },
  {
    id: 'pyramid',
    name: 'Pyramid',
    tagline: 'Concentrating, manifesting, anchoring',
    tile: 'Draws energy in through the base and projects it upward through the apex: a sacred geometry form used in manifestation and grid anchoring.',
    body: 'Four triangular faces meeting at an apex. Draws energy in through the base, concentrates and amplifies it, then projects upward through the point. Used in manifestation work, grid anchoring, and focusing intention. Connected to sacred geometry and ancient protective traditions.',
    use: 'Manifestation · Grid anchor · Intention amplification · Sacred space',
    examples: ['Citrine', 'Clear Quartz', 'Black Tourmaline', 'Pyrite'],
    draw: drawPyramidShape,
  },
  {
    id: 'cube',
    name: 'Cube',
    tagline: 'Grounding, structure, stability',
    tile: 'Six equal faces representing perfect stability. The Earth element in sacred geometry, used for grounding and building energetic structure.',
    body: 'Six equal faces representing perfect stability — the cube corresponds to the Earth element in sacred geometry. Places energy firmly on all six sides simultaneously. Used for grounding work, building stable foundations, and creating energetic structure in a space or intention.',
    use: 'Grounding · Structure · Earth element work · Stability',
    examples: ['Pyrite', 'Fluorite', 'Hematite', 'Black Tourmaline'],
    draw: drawCubeShape,
  },
  {
    id: 'freeform',
    name: 'Freeform',
    tagline: 'Organic, sculptural, one-of-a-kind',
    tile: 'No fixed geometry and no two alike. The most personal and expressive form in a collection, chosen as much for beauty as for practice.',
    body: 'Shaped or naturally formed into an organic, flowing form with no fixed geometry. Each piece is completely unique — no two are alike. Energy moves freely along the curves. Often the most personal and expressive form in a collection, chosen as much for beauty as for practice.',
    use: 'Room presence · Meditation focal point · Display · Personal altar',
    examples: ['Labradorite', 'Rose Quartz', 'Ocean Jasper', 'Malachite'],
    draw: drawFreeformShape,
  },
  {
    id: 'flame',
    name: 'Flame',
    tagline: 'Transformation, upward movement, passion',
    tile: 'A tapering flame silhouette that channels energy upward, associated with transformation, clarity, and movement.',
    body: 'Carved or polished into a tapering flame silhouette — wide at the base, narrowing to a flowing point. Energy rises upward along the form, making it associated with transformation, clarity, and movement. A striking display piece that also functions as a gentle directional energy tool.',
    use: 'Transformation work · Display · Room energy · Meditation focus',
    examples: ['Labradorite', 'Selenite', 'Amethyst', 'Citrine'],
    draw: drawFlameShape,
  },
  {
    id: 'bowl',
    name: 'Bowl / Dish',
    tagline: 'Receiving, holding, offering',
    tile: 'A shallow, receptive form that draws energy inward, used as a charging plate, offering vessel, or altar piece.',
    body: 'A shallow carved bowl or dish. Used as a charging plate for other stones, a vessel for intentions, or a beautiful offering piece. The concave form draws energy inward and holds it — receptive rather than projecting. Practical for display as well as ceremonial use.',
    use: 'Charging other stones · Altar · Intention holding · Display',
    examples: ['Selenite', 'Rose Quartz', 'Amethyst', 'Clear Quartz'],
    draw: drawBowlShape,
  },
  {
    id: 'raw',
    name: 'Raw / Natural',
    tagline: 'Unfiltered, natural energy',
    tile: 'The stone as it formed: uncut, unpolished, broadcasting energy outward in all directions with nothing filtered or softened.',
    body: 'Closest to how the stone formed. Energy radiates outward in all directions, unmodified. Most powerful for grounding, space-holding, and any work where you want the full unmediated quality of the stone. Less refined, but often more potent.',
    use: 'Grounding · Space clearing · Long-term placement · Altars',
    examples: ['Black Tourmaline', 'Selenite', 'Amethyst', 'Citrine'],
    draw: drawRawShape,
  },
  {
    id: 'specimen',
    name: 'Specimen',
    tagline: 'Natural, unmodified, mineral character',
    tile: 'A naturally collected piece showing the stone\'s full mineral character, often with matrix or host rock. Chosen as much for what it teaches as for its energy.',
    body: 'A naturally formed piece collected as found, often including matrix, host rock, or multiple crystal formations. Not cut or polished beyond basic preparation. The most honest expression of how a stone actually grows in the earth — chosen for its mineral character as much as its energy.',
    use: 'Display · Education · Altar · Natural presence',
    examples: ['Pyrite', 'Amethyst', 'Malachite', 'Celestite'],
    draw: drawSpecimenShape,
  },
  {
    id: 'point',
    name: 'Point',
    tagline: 'Directed, focused, activating',
    tile: 'A natural or cut termination that focuses and directs energy out through the apex, essential for grid activation and energy work.',
    body: 'A natural or cut termination that directs energy out through the apex. Used to direct intention, move energy in healing work, and activate crystal grids — touch each stone lightly with the point to connect them. Points can face inward (drawing energy toward you) or outward (projecting away).',
    use: 'Grid activation · Energy direction · Healing work · Amplification',
    examples: ['Clear Quartz', 'Amethyst', 'Citrine', 'Rose Quartz'],
    draw: drawPointShape,
  },
  {
    id: 'cluster',
    name: 'Cluster',
    tagline: 'Radiating, communal, space-filling',
    tile: 'Multiple points on a shared base, each radiating in its own direction. An omnidirectional broadcast that continuously cleanses the energy around it.',
    body: 'Multiple points growing from a shared base. Each crystal in the cluster radiates in its own direction — the result is an omnidirectional broadcast. Excellent for spaces, rooms, and group settings. Clusters also continuously cleanse the energy around them and make impressive display pieces.',
    use: 'Room energy · Space cleansing · Group settings · Display',
    examples: ['Amethyst', 'Quartz', 'Celestite', 'Pyrite'],
    draw: drawClusterShape,
  },
  {
    id: 'geode',
    name: 'Geode',
    tagline: 'Hidden interior, protective, amplifying',
    tile: 'Unremarkable outside, crystalline within. The hollow cavity amplifies and protects, holding intention when closed and broadcasting it when open.',
    body: 'Unremarkable outside, crystalline interior. The hollow cavity amplifies and stores energy. Geodes protect what is inside — energetically and literally. A closed geode holds intention; an open geode broadcasts it. Excellent for spaces, altars, and long-term energetic work.',
    use: 'Space holding · Amplification · Protection · Altar',
    examples: ['Amethyst', 'Quartz', 'Celestite', 'Calcite'],
    draw: drawGeodeShape,
  },
  {
    id: 'druzy',
    name: 'Druzy',
    tagline: 'Amplifying surface, sparkle, coating',
    tile: 'A surface of sparkling micro-crystals that amplifies surrounding energy and adds brilliant visual texture. A natural formation, not a carved shape.',
    body: 'A surface covered in a layer of tiny, sparkling micro-crystals formed within a cavity or on a host stone. Not a carved shape but a natural formation. Amplifies the energy of whatever surrounds it, adds visual brilliance, and is commonly used in jewelry and decorative settings. Often found coating Agate or Chalcedony.',
    use: 'Amplification · Jewelry · Display · Enhancing other stones',
    examples: ['Grape Agate', 'Chalcopyrite', 'Uvarovite'],
    draw: drawDruzyShape,
  },
  {
    id: 'slice',
    name: 'Slice / Slab',
    tagline: 'Display, altar, writing surface',
    tile: 'A flat cross-section that reveals the stone\'s interior pattern. Used as an altar base, charging plate, or display surface, with energy radiating from the face.',
    body: 'A flat cross-section of a stone or geode, revealing the interior pattern. Used as altar bases, charging plates, display surfaces, and decorative pieces. Agate slices with natural banding are common; geode slices show the crystalline interior. Energy radiates from the flat face.',
    use: 'Altar base · Charging plate · Display · Space energy',
    examples: ['Agate', 'Amethyst', 'Selenite', 'Obsidian'],
    draw: drawSliceShape,
  },
  {
    id: 'moon',
    name: 'Moon',
    tagline: 'Cyclical, intuitive, feminine',
    tile: 'A crescent carved form connected to lunar cycles, intuition, and the rhythm of what to begin, release, and allow to complete.',
    body: 'Usually carved as a crescent. Strongly connected to lunar cycles, the feminine, and intuition. Used in moon rituals, cycle tracking, and any work tied to timing and rhythm — what to begin, what to release, what to allow to complete naturally. A powerful shape for water-sign energy.',
    use: 'Lunar rituals · Intuition · Feminine energy · Cyclical work',
    examples: ['Moonstone', 'Selenite', 'Labradorite', 'Amethyst'],
    draw: drawMoonShape,
  },
  {
    id: 'star',
    name: 'Star',
    tagline: 'Radiating, protection, divine connection',
    tile: 'A carved star whose radiating points send energy outward in multiple directions, used in protection work, sacred space, and grid arrangements.',
    body: 'A five or six-pointed carved star. The radiating points send energy outward in multiple directions simultaneously — similar to a cluster, but intentionally geometric. Used in protection work, sacred space setting, and grid arrangements. The six-pointed star is particularly used in healing and balancing.',
    use: 'Protection · Grids · Sacred geometry · Radiating intention',
    examples: ['Clear Quartz', 'Black Tourmaline', 'Selenite', 'Pyrite'],
    draw: drawStarShape,
  },
  {
    id: 'mushroom',
    name: 'Mushroom',
    tagline: 'Grounding yet reaching, earthy, symbolic',
    tile: 'Rooted in the earth while reaching upward, a symbol of grounding, organic growth, and the quiet intelligence of natural systems.',
    body: 'Carved to echo the mushroom form — a wide cap and narrow stem. Beloved for its symbolism: rooted in the earth while growing upward, and connected to the hidden network beneath the surface. Associated with grounding, organic growth, and the quiet intelligence of natural systems.',
    use: 'Grounding · Growth intention · Symbolic work · Display',
    examples: ['Agate', 'Obsidian', 'Amethyst', 'Rose Quartz'],
    draw: drawMushroomShape,
  },
  {
    id: 'wand',
    name: 'Wand',
    tagline: 'Channeling, directional, healing',
    tile: 'Elongated with a pointed end to channel and direct energy along the body or through a space. The pointed end sends, the rounded end receives.',
    body: 'Elongated and cylindrical, often with one pointed end. Wands channel and direct energy along their length — used in energy healing to move, clear, or focus energy in specific areas of the body or space. The pointed end sends energy; the rounded end receives.',
    use: 'Energy healing · Chakra work · Directing energy · Body work',
    examples: ['Selenite', 'Clear Quartz', 'Rose Quartz', 'Obsidian'],
    draw: drawWandShape,
  },
  {
    id: 'carving',
    name: 'Carving',
    tagline: 'Symbolic, intentional, artisan',
    tile: 'Any carved figure (skull, animal, angel, goddess, and more) layering the meaning of the form over the natural energy of the stone.',
    body: 'Any carved form not covered by the specific shapes listed — skulls, animals, angels, goddess figures, hands, and other figures. The carved form layers symbolic meaning over the stone\'s natural energy. Choose a carving when the shape itself carries personal meaning for your practice or collection.',
    use: 'Symbolic work · Altars · Collection · Gifting',
    examples: ['Obsidian', 'Labradorite', 'Rose Quartz', 'Clear Quartz'],
    draw: drawCarvingShape,
  },
];

// ── SVG SHAPE ILLUSTRATIONS ──

function shapeS(){ return 'rgba(42,37,32,0.35)'; }
function shapeF(){ return 'rgba(42,37,32,0.06)'; }
function shapeA(){ return '#8b7355'; }

function drawRawShape(){
  return `<svg viewBox="0 0 120 120" width="78" height="78">
    <polygon points="60,16 92,36 96,64 78,90 42,92 24,66 28,36"
      fill="${shapeF()}" stroke="${shapeS()}" stroke-width="1.2" stroke-linejoin="round"/>
    <line x1="60" y1="16" x2="42" y2="92" stroke="${shapeS()}" stroke-width="0.4" opacity="0.35"/>
    <line x1="92" y1="36" x2="24" y2="66" stroke="${shapeS()}" stroke-width="0.4" opacity="0.35"/>
    <line x1="96" y1="64" x2="28" y2="36" stroke="${shapeS()}" stroke-width="0.4" opacity="0.35"/>
  </svg>`;
}

function drawTumbledShape(){
  return `<svg viewBox="0 0 120 120" width="78" height="78">
    <ellipse cx="60" cy="63" rx="32" ry="27"
      fill="${shapeF()}" stroke="${shapeS()}" stroke-width="1.2"/>
    <ellipse cx="60" cy="63" rx="20" ry="15"
      fill="none" stroke="${shapeS()}" stroke-width="0.4" opacity="0.35"/>
    <circle cx="50" cy="53" r="4" fill="none" stroke="white" stroke-width="1" opacity="0.55"/>
  </svg>`;
}

function drawPalmShape(){
  return `<svg viewBox="0 0 120 120" width="78" height="78">
    <ellipse cx="60" cy="65" rx="42" ry="30"
      fill="${shapeF()}" stroke="${shapeS()}" stroke-width="1.2"/>
    <ellipse cx="60" cy="65" rx="18" ry="10"
      fill="rgba(42,37,32,0.05)" stroke="${shapeS()}" stroke-width="0.8" opacity="0.6"/>
  </svg>`;
}

function drawWorryShape(){
  return `<svg viewBox="0 0 120 120" width="78" height="78">
    <ellipse cx="60" cy="65" rx="42" ry="30"
      fill="${shapeF()}" stroke="${shapeS()}" stroke-width="1.2"/>
    <ellipse cx="60" cy="60" rx="15" ry="10"
      fill="rgba(42,37,32,0.08)" stroke="${shapeS()}" stroke-width="0.9"/>
  </svg>`;
}

function drawSphereShape(){
  return `<svg viewBox="0 0 120 120" width="78" height="78">
    <circle cx="60" cy="60" r="40"
      fill="${shapeF()}" stroke="${shapeS()}" stroke-width="1.2"/>
    <ellipse cx="60" cy="60" rx="40" ry="13"
      fill="none" stroke="${shapeS()}" stroke-width="0.45" opacity="0.45"/>
    <ellipse cx="60" cy="60" rx="13" ry="40"
      fill="none" stroke="${shapeS()}" stroke-width="0.45" opacity="0.45"/>
    <circle cx="47" cy="47" r="5" fill="none" stroke="white" stroke-width="1" opacity="0.6"/>
  </svg>`;
}

function drawEggShape(){
  return `<svg viewBox="0 0 120 120" width="78" height="78">
    <path d="M60,18 C80,18 94,42 94,66 C94,86 79,102 60,102 C41,102 26,86 26,66 C26,42 40,18 60,18 Z"
      fill="${shapeF()}" stroke="${shapeS()}" stroke-width="1.2"/>
    <ellipse cx="60" cy="66" rx="22" ry="16"
      fill="none" stroke="${shapeS()}" stroke-width="0.4" opacity="0.35"/>
    <circle cx="50" cy="46" r="4" fill="none" stroke="white" stroke-width="1" opacity="0.55"/>
  </svg>`;
}

function drawPointShape(){
  return `<svg viewBox="0 0 120 120" width="78" height="78">
    <polygon points="60,14 79,42 79,98 41,98 41,42"
      fill="${shapeF()}" stroke="${shapeS()}" stroke-width="1.2" stroke-linejoin="round"/>
    <line x1="60" y1="14" x2="60" y2="98" stroke="${shapeS()}" stroke-width="0.4" opacity="0.4"/>
    <line x1="41" y1="55" x2="79" y2="55" stroke="${shapeS()}" stroke-width="0.4" opacity="0.35"/>
    <line x1="41" y1="76" x2="79" y2="76" stroke="${shapeS()}" stroke-width="0.4" opacity="0.35"/>
  </svg>`;
}

function drawFlameShape(){
  return `<svg viewBox="0 0 120 120" width="78" height="78">
    <path d="M60,14 C70,22 84,32 86,50 C88,65 80,74 74,82 C68,90 65,96 60,102 C55,96 52,90 46,82 C40,74 32,65 34,50 C36,32 50,22 60,14 Z"
      fill="${shapeF()}" stroke="${shapeS()}" stroke-width="1.2" stroke-linejoin="round"/>
    <path d="M60,30 C66,38 72,46 72,58 C72,68 67,75 60,80"
      fill="none" stroke="${shapeS()}" stroke-width="0.5" opacity="0.35"/>
  </svg>`;
}

function drawPyramidShape(){
  return `<svg viewBox="0 0 120 120" width="78" height="78">
    <polygon points="60,16 102,90 18,90"
      fill="${shapeF()}" stroke="${shapeS()}" stroke-width="1.2" stroke-linejoin="round"/>
    <line x1="60" y1="16" x2="74" y2="90" stroke="${shapeS()}" stroke-width="0.5" opacity="0.45"/>
    <polygon points="60,16 102,90 74,82"
      fill="none" stroke="${shapeS()}" stroke-width="0.4" opacity="0.35"/>
  </svg>`;
}

function drawCubeShape(){
  return `<svg viewBox="0 0 120 120" width="78" height="78">
    <polygon points="60,18 98,38 98,80 60,100 22,80 22,38"
      fill="${shapeF()}" stroke="${shapeS()}" stroke-width="1.2" stroke-linejoin="round"/>
    <line x1="60" y1="18" x2="60" y2="60" stroke="${shapeS()}" stroke-width="0.8" opacity="0.5"/>
    <line x1="22" y1="38" x2="60" y2="60" stroke="${shapeS()}" stroke-width="0.8" opacity="0.5"/>
    <line x1="98" y1="38" x2="60" y2="60" stroke="${shapeS()}" stroke-width="0.8" opacity="0.5"/>
    <line x1="60" y1="60" x2="60" y2="100" stroke="${shapeS()}" stroke-width="0.4" opacity="0.3"/>
    <line x1="60" y1="60" x2="22" y2="80" stroke="${shapeS()}" stroke-width="0.4" opacity="0.3"/>
    <line x1="60" y1="60" x2="98" y2="80" stroke="${shapeS()}" stroke-width="0.4" opacity="0.3"/>
  </svg>`;
}

function drawHeartShape(){
  return `<svg viewBox="0 0 120 120" width="78" height="78">
    <path d="M60,90 C60,90 20,64 20,40 C20,26 32,18 45,24 C52,27 57,33 60,40 C63,33 68,27 75,24 C88,18 100,26 100,40 C100,64 60,90 60,90 Z"
      fill="${shapeF()}" stroke="${shapeS()}" stroke-width="1.2" stroke-linejoin="round"/>
  </svg>`;
}

function drawMoonShape(){
  return `<svg viewBox="0 0 120 120" width="78" height="78">
    <path d="M72,22 C50,22 32,40 32,62 C32,84 50,102 72,102 C60,102 42,90 42,62 C42,34 60,22 72,22 Z"
      fill="${shapeF()}" stroke="${shapeS()}" stroke-width="1.2" stroke-linejoin="round"/>
    <path d="M72,22 C84,30 92,45 92,62 C92,79 84,94 72,102"
      fill="none" stroke="${shapeS()}" stroke-width="1.2"/>
  </svg>`;
}

function drawStarShape(){
  const pts = Array.from({length:5},(_,i)=>{
    const a = (i*72-90)*Math.PI/180;
    const b = (i*72-54)*Math.PI/180;
    return `${Math.round(60+38*Math.cos(a))},${Math.round(60+38*Math.sin(a))} ${Math.round(60+16*Math.cos(b))},${Math.round(60+16*Math.sin(b))}`;
  }).join(' ');
  return `<svg viewBox="0 0 120 120" width="78" height="78">
    <polygon points="${pts}"
      fill="${shapeF()}" stroke="${shapeS()}" stroke-width="1.2" stroke-linejoin="round"/>
  </svg>`;
}

function drawSliceShape(){
  return `<svg viewBox="0 0 120 120" width="78" height="78">
    <ellipse cx="60" cy="62" rx="46" ry="34"
      fill="${shapeF()}" stroke="${shapeS()}" stroke-width="1.2"/>
    <ellipse cx="60" cy="62" rx="36" ry="25"
      fill="none" stroke="${shapeS()}" stroke-width="0.7" opacity="0.5"/>
    <ellipse cx="60" cy="62" rx="24" ry="16"
      fill="none" stroke="${shapeS()}" stroke-width="0.5" opacity="0.4"/>
    <ellipse cx="60" cy="62" rx="12" ry="8"
      fill="none" stroke="${shapeS()}" stroke-width="0.4" opacity="0.35"/>
    <circle cx="60" cy="62" r="3"
      fill="${shapeA()}" opacity="0.4"/>
  </svg>`;
}

function drawClusterShape(){
  return `<svg viewBox="0 0 120 120" width="78" height="78">
    <polygon points="60,18 67,46 76,96 44,96 53,46"
      fill="${shapeF()}" stroke="${shapeS()}" stroke-width="1.2" stroke-linejoin="round"/>
    <polygon points="34,32 40,54 50,92 28,92 26,56"
      fill="${shapeF()}" stroke="${shapeS()}" stroke-width="1" stroke-linejoin="round"/>
    <polygon points="86,28 92,52 96,90 72,92 74,52"
      fill="${shapeF()}" stroke="${shapeS()}" stroke-width="1" stroke-linejoin="round"/>
    <polygon points="47,26 52,48 58,86 37,86 35,50"
      fill="${shapeF()}" stroke="${shapeS()}" stroke-width="0.7" stroke-linejoin="round" opacity="0.7"/>
    <line x1="24" y1="93" x2="96" y2="93" stroke="${shapeS()}" stroke-width="1.5"/>
  </svg>`;
}

function drawDruzyShape(){
  let html = `<svg viewBox="0 0 120 120" width="78" height="78">
    <ellipse cx="60" cy="70" rx="46" ry="28" fill="${shapeF()}" stroke="${shapeS()}" stroke-width="1.2"/>`;
  const crystals = [
    [42,55],[50,48],[58,44],[66,46],[74,52],[80,58],[72,43],[54,38],[63,36],[48,61],[70,39]
  ];
  crystals.forEach(([cx,cy])=>{
    html += `<polygon points="${cx},${cy-10} ${cx+4},${cy} ${cx-4},${cy}" fill="${shapeF()}" stroke="${shapeS()}" stroke-width="0.8"/>`;
  });
  html += `</svg>`;
  return html;
}

function drawGeodeShape(){
  return `<svg viewBox="0 0 120 120" width="78" height="78">
    <path d="M60,20 C82,20 100,38 100,60 C100,82 82,100 60,100 C38,100 20,82 20,60 C20,38 38,20 60,20 Z"
      fill="${shapeF()}" stroke="${shapeS()}" stroke-width="1.2"/>
    <path d="M60,32 C76,32 88,44 88,60 C88,76 76,88 60,88 C44,88 32,76 32,60 C32,44 44,32 60,32 Z"
      fill="none" stroke="${shapeS()}" stroke-width="0.7" opacity="0.5"/>
    <path d="M60,46 C68,46 74,52 74,60 C74,68 68,74 60,74 C52,74 46,68 46,60 C46,52 52,46 60,46 Z"
      fill="rgba(42,37,32,0.04)" stroke="${shapeA()}" stroke-width="0.6" opacity="0.55"/>
    <line x1="55" y1="50" x2="52" y2="44" stroke="${shapeS()}" stroke-width="0.8" opacity="0.5"/>
    <line x1="60" y1="48" x2="60" y2="42" stroke="${shapeS()}" stroke-width="0.8" opacity="0.5"/>
    <line x1="65" y1="50" x2="68" y2="44" stroke="${shapeS()}" stroke-width="0.8" opacity="0.5"/>
    <line x1="70" y1="57" x2="76" y2="54" stroke="${shapeS()}" stroke-width="0.8" opacity="0.5"/>
    <line x1="50" y1="57" x2="44" y2="54" stroke="${shapeS()}" stroke-width="0.8" opacity="0.5"/>
  </svg>`;
}

function drawWandShape(){
  return `<svg viewBox="0 0 120 120" width="78" height="78">
    <polygon points="60,12 69,30 69,94 51,94 51,30"
      fill="${shapeF()}" stroke="${shapeS()}" stroke-width="1.2" stroke-linejoin="round"/>
    <line x1="51" y1="30" x2="69" y2="30" stroke="${shapeS()}" stroke-width="0.6" opacity="0.5"/>
    <line x1="51" y1="52" x2="69" y2="52" stroke="${shapeS()}" stroke-width="0.35" opacity="0.35"/>
    <line x1="51" y1="73" x2="69" y2="73" stroke="${shapeS()}" stroke-width="0.35" opacity="0.35"/>
    <ellipse cx="60" cy="94" rx="9" ry="4"
      fill="${shapeF()}" stroke="${shapeS()}" stroke-width="0.8"/>
  </svg>`;
}

function drawTowerShape(){
  return `<svg viewBox="0 0 120 120" width="78" height="78">
    <polygon points="60,14 75,34 75,96 45,96 45,34"
      fill="${shapeF()}" stroke="${shapeS()}" stroke-width="1.2" stroke-linejoin="round"/>
    <line x1="60" y1="14" x2="60" y2="96" stroke="${shapeS()}" stroke-width="0.4" opacity="0.4"/>
    <line x1="45" y1="52" x2="75" y2="52" stroke="${shapeS()}" stroke-width="0.4" opacity="0.35"/>
    <line x1="45" y1="74" x2="75" y2="74" stroke="${shapeS()}" stroke-width="0.4" opacity="0.35"/>
    <line x1="45" y1="96" x2="75" y2="96" stroke="${shapeS()}" stroke-width="1.6" opacity="0.5"/>
  </svg>`;
}

function drawFreeformShape(){
  return `<svg viewBox="0 0 120 120" width="78" height="78">
    <path d="M48,18 C60,14 80,22 88,38 C96,54 90,72 78,84 C66,96 48,100 36,88 C24,76 22,58 30,42 C36,30 36,22 48,18 Z"
      fill="${shapeF()}" stroke="${shapeS()}" stroke-width="1.2" stroke-linejoin="round"/>
    <path d="M52,30 C62,28 74,36 78,50 C82,64 74,76 64,80"
      fill="none" stroke="${shapeS()}" stroke-width="0.45" opacity="0.35"/>
  </svg>`;
}

function drawBowlShape(){
  return `<svg viewBox="0 0 120 120" width="78" height="78">
    <path d="M22,52 C22,80 38,96 60,96 C82,96 98,80 98,52 Z"
      fill="${shapeF()}" stroke="${shapeS()}" stroke-width="1.2"/>
    <line x1="22" y1="52" x2="98" y2="52" stroke="${shapeS()}" stroke-width="1.2"/>
    <path d="M34,52 C34,74 44,86 60,86 C76,86 86,74 86,52"
      fill="none" stroke="${shapeS()}" stroke-width="0.45" opacity="0.4"/>
  </svg>`;
}

function drawSpecimenShape(){
  return `<svg viewBox="0 0 120 120" width="78" height="78">
    <polygon points="60,16 80,28 90,52 84,76 66,92 40,88 24,68 28,42 44,24"
      fill="${shapeF()}" stroke="${shapeS()}" stroke-width="1.2" stroke-linejoin="round"/>
    <line x1="60" y1="16" x2="40" y2="88" stroke="${shapeS()}" stroke-width="0.4" opacity="0.3"/>
    <line x1="80" y1="28" x2="24" y2="68" stroke="${shapeS()}" stroke-width="0.4" opacity="0.3"/>
    <line x1="90" y1="52" x2="44" y2="24" stroke="${shapeS()}" stroke-width="0.4" opacity="0.3"/>
    <polygon points="54,34 62,34 66,42 60,48 52,44"
      fill="rgba(42,37,32,0.07)" stroke="${shapeS()}" stroke-width="0.6" opacity="0.6"/>
  </svg>`;
}

function drawMushroomShape(){
  return `<svg viewBox="0 0 120 120" width="78" height="78">
    <path d="M26,64 C26,38 40,20 60,20 C80,20 94,38 94,64 Z"
      fill="${shapeF()}" stroke="${shapeS()}" stroke-width="1.2" stroke-linejoin="round"/>
    <path d="M26,64 C26,70 38,74 60,74 C82,74 94,70 94,64"
      fill="none" stroke="${shapeS()}" stroke-width="1.2"/>
    <rect x="52" y="74" width="16" height="26" rx="4"
      fill="${shapeF()}" stroke="${shapeS()}" stroke-width="1.2"/>
    <ellipse cx="60" cy="100" rx="12" ry="4"
      fill="${shapeF()}" stroke="${shapeS()}" stroke-width="0.8"/>
  </svg>`;
}

function drawCarvingShape(){
  return `<svg viewBox="0 0 120 120" width="78" height="78">
    <ellipse cx="60" cy="52" rx="26" ry="30"
      fill="${shapeF()}" stroke="${shapeS()}" stroke-width="1.2"/>
    <ellipse cx="50" cy="46" rx="7" ry="8"
      fill="rgba(42,37,32,0.07)" stroke="${shapeS()}" stroke-width="0.8"/>
    <ellipse cx="70" cy="46" rx="7" ry="8"
      fill="rgba(42,37,32,0.07)" stroke="${shapeS()}" stroke-width="0.8"/>
    <path d="M50,66 C54,72 66,72 70,66"
      fill="none" stroke="${shapeS()}" stroke-width="1" stroke-linecap="round"/>
    <path d="M44,88 C48,80 52,78 60,78 C68,78 72,80 76,88"
      fill="${shapeF()}" stroke="${shapeS()}" stroke-width="1.2" stroke-linejoin="round"/>
  </svg>`;
}

function drawCabochonShape(){
  return `<svg viewBox="0 0 120 120" width="78" height="78">
    <path d="M18,76 Q18,34 60,30 Q102,34 102,76 L102,82 Q102,88 60,88 Q18,88 18,82 Z"
      fill="${shapeF()}" stroke="${shapeS()}" stroke-width="1.2"/>
    <line x1="18" y1="82" x2="102" y2="82" stroke="${shapeS()}" stroke-width="1.4"/>
    <ellipse cx="60" cy="56" rx="18" ry="9"
      fill="none" stroke="white" stroke-width="0.9" opacity="0.5"/>
  </svg>`;
}

// ── RENDER SHAPES ──

function renderShapes() {
  try { CRYSTAL_SHAPES; SHAPE_CATEGORIES; } catch(e) { setTimeout(renderShapes,0); return; }
  const container = document.getElementById('shapes-grid');
  if(!container) return;
  if(container.children.length > 0) return;

  const shapeMap = Object.fromEntries(CRYSTAL_SHAPES.map(s => [s.id, s]));

  const pane = document.createElement('div');
  pane.className = 'shapes-pane';

  const catCardEls = {};

  function setActiveCat(catLabel) {
    Object.entries(catCardEls).forEach(([lbl, el]) => el.classList.toggle('active', lbl === catLabel));
  }

  // Build 4-category selector
  const selectorOuter = document.createElement('div');
  selectorOuter.className = 'shapes-cat-selector';

  const selectorIntro = document.createElement('div');
  selectorIntro.className = 'shapes-cat-selector-intro';
  selectorIntro.innerHTML = '<span class="shapes-cat-selector-heading">Select a form family to explore.</span><span class="shapes-cat-selector-sub">Each family groups forms with similar ways of being and use.</span>';
  selectorOuter.appendChild(selectorIntro);

  const catCards = document.createElement('div');
  catCards.className = 'shapes-cat-cards';

  SHAPE_CATEGORIES.forEach(cat => {
    const card = document.createElement('button');
    card.className = 'shapes-cat-card';
    card.type = 'button';
    card.innerHTML = `<div class="shapes-cat-card-title">${cat.label}</div><div class="shapes-cat-card-def">${cat.def}</div>`;
    card.addEventListener('click', () => {
      setActiveCat(cat.label);
      showCategoryGrid(cat, pane, shapeMap, setActiveCat);
    });
    catCardEls[cat.label] = card;
    catCards.appendChild(card);
  });

  selectorOuter.appendChild(catCards);
  container.appendChild(selectorOuter);
  container.appendChild(pane);
  renderMobileShapes(container, shapeMap);

  // Default: Holdable
  const firstCat = SHAPE_CATEGORIES[0];
  setActiveCat(firstCat.label);
  showCategoryGrid(firstCat, pane, shapeMap, setActiveCat);
}

function renderMobileShapes(container, shapeMap) {
  const mobile = document.createElement('div');
  mobile.className = 'shapes-mobile';
  mobile.innerHTML = `
    <div class="forms-mobile-prompt">
      <div class="forms-mobile-prompt-heading">Explore by form family</div>
      <div class="forms-mobile-prompt-sub">Choose the kind of piece you're drawn to, then browse the forms within it.</div>
    </div>
    <div class="forms-mobile-landing">
      ${SHAPE_CATEGORIES.map((cat, i) => `
        <button class="forms-mobile-topic${i===0?' active':''}" type="button" data-cat="${cat.label}" aria-selected="${i===0?'true':'false'}">
          <span class="forms-mobile-topic-name">${cat.label}</span>
          <span class="forms-mobile-topic-sub">${cat.def || ''}</span>
        </button>`).join('')}
    </div>
    <div class="forms-mobile-label"><span class="forms-mobile-label-name"></span><span class="forms-mobile-label-def"></span></div>
    <div class="forms-mobile-tile-grid"></div>
    <div class="forms-mobile-detail" aria-live="polite"></div>`;

  const tileGrid = mobile.querySelector('.forms-mobile-tile-grid');
  const detail = mobile.querySelector('.forms-mobile-detail');
  const labelName = mobile.querySelector('.forms-mobile-label-name');
  const labelDef = mobile.querySelector('.forms-mobile-label-def');

  let activeCatShapes = [];
  let activeShapeIdx = 0;

  const chevL = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>`;
  const chevR = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>`;

  function renderMobileDetail(shape, catLabel) {
    const idx = activeCatShapes.findIndex(s => s.id === shape.id);
    const total = activeCatShapes.length;
    const pos = idx >= 0 ? idx + 1 : 1;
    const usePills = shape.use.split('·').map(u => `<span class="mobile-form-use-pill">${u.trim()}</span>`).join('');
    detail.innerHTML = `
      <article class="mobile-form-detail-card">
        <div class="mobile-form-detail-hero">
          <div class="mobile-form-detail-hero-icon">${shape.draw()}</div>
        </div>
        <div class="mobile-form-detail-copy">
          <div class="mobile-form-detail-nav">
            <button class="mobile-form-nav-btn" aria-label="Previous form" data-dir="-1">${chevL}</button>
            <div class="mobile-form-detail-hdr">
              <div class="mobile-form-nav-name">${shape.name}</div>
              <div class="mobile-form-detail-tagline">${shape.tagline}</div>
            </div>
            <button class="mobile-form-nav-btn" aria-label="Next form" data-dir="1">${chevR}</button>
          </div>
          <div class="mobile-form-detail-desc">${shape.body}</div>
          <div class="mobile-form-detail-use-row">
            <div class="mobile-form-detail-use-label">Best for</div>
            <div class="mobile-form-use-pills">${usePills}</div>
          </div>
          <div class="mobile-form-detail-examples">
            ${shape.examples.map(e => `<button type="button" class="shape-pill" onclick="jumpToStone('${e}')">${e}</button>`).join('')}
          </div>
        </div>
        <div class="mobile-form-nav-indicator">${catLabel} · ${pos} of ${total}</div>
      </article>`;

    detail.querySelectorAll('.mobile-form-nav-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const dir = parseInt(btn.dataset.dir, 10);
        activeShapeIdx = (activeShapeIdx + dir + activeCatShapes.length) % activeCatShapes.length;
        const next = activeCatShapes[activeShapeIdx];
        const currentCat = SHAPE_CATEGORIES.find(c => c.ids.includes(next.id)) || SHAPE_CATEGORIES[0];
        syncActiveTile(next.id);
        renderMobileDetail(next, currentCat.label);
      });
    });
  }

  function syncActiveTile(id) {
    tileGrid.querySelectorAll('.mobile-form-tile').forEach(el => {
      el.classList.toggle('active', el.dataset.id === id);
    });
  }

  function setMobileCategory(catLabel, scroll) {
    const cat = SHAPE_CATEGORIES.find(c => c.label === catLabel) || SHAPE_CATEGORIES[0];
    activeCatShapes = cat.ids.map(id => shapeMap[id]).filter(Boolean);
    activeShapeIdx = 0;

    mobile.querySelectorAll('.forms-mobile-topic').forEach(btn => {
      const isActive = btn.dataset.cat === catLabel;
      btn.classList.toggle('active', isActive);
      btn.setAttribute('aria-selected', String(isActive));
    });

    if(labelName) labelName.textContent = cat.label + ' Forms';
    if(labelDef) labelDef.textContent = cat.def || '';

    detail.innerHTML = '';

    tileGrid.innerHTML = activeCatShapes.map((s) => `
      <button class="mobile-form-tile" type="button" data-id="${s.id}">
        <span class="mobile-form-tile-icon">${s.draw()}</span>
        <span class="mobile-form-tile-name">${s.name}</span>
      </button>`).join('');

    tileGrid.querySelectorAll('.mobile-form-tile').forEach(tile => {
      tile.addEventListener('click', () => {
        const shape = shapeMap[tile.dataset.id];
        if(!shape) return;
        activeShapeIdx = activeCatShapes.findIndex(s => s.id === shape.id);
        syncActiveTile(shape.id);
        renderMobileDetail(shape, catLabel);
        requestAnimationFrame(() => detail.scrollIntoView({ behavior: 'smooth', block: 'nearest' }));
      });
    });
    if(scroll) {
      const labelEl = mobile.querySelector('.forms-mobile-label');
      requestAnimationFrame(() => (labelEl||tileGrid).scrollIntoView({ behavior: 'smooth', block: 'start' }));
    }
  }

  mobile.querySelectorAll('.forms-mobile-topic').forEach(btn => {
    btn.addEventListener('click', () => setMobileCategory(btn.dataset.cat, true));
  });

  setMobileCategory(SHAPE_CATEGORIES[0].label, false);
  container.appendChild(mobile);
}

function showCategoryGrid(cat, pane, shapeMap, setActiveCat) {
  const shapes = cat.ids.map(id => shapeMap[id]).filter(Boolean);
  const chevL = `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>`;

  pane.innerHTML = `
    <div class="cat-grid-header">
      <span class="cat-grid-title">${cat.label}</span>
      <span class="cat-grid-sub">${cat.def || ''}</span>
    </div>
    <div class="cat-grid">
      ${shapes.map(s => `
        <div class="cat-card" data-id="${s.id}">
          <div class="cat-card-illus">${s.draw()}</div>
          <div class="cat-card-body">
            <div class="cat-card-name">${s.name}</div>
            <div class="cat-card-tagline">${s.tagline}</div>
            <div class="cat-card-desc">${s.tile||s.body}</div>
          </div>
        </div>`).join('')}
    </div>`;

  pane.querySelectorAll('.cat-card').forEach(card => {
    const shape = shapeMap[card.dataset.id];
    if(!shape) return;
    card.addEventListener('click', () => {
      setActiveCat(cat.label);
      showShapeDetail(shape, cat, pane, shapeMap, setActiveCat);
    });
  });
}

function showShapeDetail(shape, cat, pane, shapeMap, setActiveCat) {
  const chevL = `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>`;
  pane.innerHTML = `
    <button class="shape-back-link">${chevL} Back to ${cat.label}</button>
    <div class="shape-pane-layout">
      <div class="shape-illustration">${shape.draw()}</div>
      <div>
        <div class="shape-name">${shape.name}</div>
        <div class="shape-tagline">${shape.tagline}</div>
        <div class="shape-desc">${shape.body}</div>
        <div class="shape-use"><span class="shape-use-label">Best for</span> ${shape.use}</div>
        <div class="shape-examples">${shape.examples.map(e=>`<span class="shape-pill" onclick="jumpToStone('${e}')">${e}</span>`).join('')}</div>
      </div>
    </div>`;
  pane.querySelector('.shape-back-link').addEventListener('click', () => {
    setActiveCat(cat.label);
    showCategoryGrid(cat, pane, shapeMap, setActiveCat);
  });
}

