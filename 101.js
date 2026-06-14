// ── CRYSTALS 101 DATA ──
const C101_WATER = ["Angelite", "Black Kyanite", "Black Opal", "Blue Calcite", "Blue Fluorite", "Blue Halite", "Blue Kyanite", "Blue Opal", "Caribbean Calcite", "Chalcopyrite", "Cinnabar", "Clear Calcite", "Clear Fluorite", "Fire Opal", "Galena", "Green Calcite", "Green Fluorite", "Green Kyanite", "Green Opal", "Halite", "Honey Calcite", "Lapis Lazuli", "Lemurian Aquatine Calcite", "Lepidolite", "Malachite", "Mangano Calcite", "Opal", "Optical Calcite", "Orange Calcite", "Orange Kyanite", "Orange Selenite", "Pink Fluorite", "Pink Halite", "Pink Opal", "Purple Fluorite", "Pyrite", "Rainbow Fluorite", "Red Calcite", "Ruby in Kyanite", "Satin Spar Gypsum", "Selenite", "Teal Fluorite", "Turquoise", "White Kyanite", "White Opal", "Yellow Fluorite", "Zebra Calcite"];
const C101_SUN = ["Amethyst", "Aquamarine", "Black Amethyst", "Black Opal", "Blue Fluorite", "Blue Opal", "Blue Topaz", "Brandberg Amethyst", "Celestite", "Chevron Amethyst", "Clear Fluorite", "Fire Opal", "Green Fluorite", "Green Opal", "Imperial Topaz", "Kunzite", "Lavender Rose Quartz", "Opal", "Pink Fluorite", "Pink Opal", "Purple Fluorite", "Rainbow Fluorite", "Rose Quartz", "Teal Fluorite", "Topaz", "Vera Cruz Amethyst", "White Opal", "White Topaz", "Yellow Fluorite"];
const C101_CHAKRAS = [
    {name:'Root',color:'#8B2020',loc:'Base of spine',num:120,theme:'Safety, stability, physical health, belonging, survival instincts',imbalance:'Anxiety, disconnection from body, financial stress, feeling ungrounded'},
    {name:'Sacral',color:'#C45A10',loc:'Below the navel',num:37,theme:'Creativity, pleasure, emotional flow, sexuality, relationships',imbalance:'Creative blocks, emotional rigidity, guilt, numbness or overwhelm in feelings'},
    {name:'Solar Plexus',color:'#B8920A',loc:'Upper abdomen',num:74,theme:'Personal power, confidence, self-worth, will, digestion',imbalance:'Low self-esteem, powerlessness, people-pleasing, control issues'},
    {name:'Heart',color:'#2A7A3A',loc:'Center of chest',num:105,theme:'Love, compassion, grief, forgiveness, connection to others',imbalance:'Closed heart, resentment, codependency, difficulty giving or receiving love'},
    {name:'Throat',color:'#1A5A8A',loc:'Throat',num:54,theme:'Communication, truth, self-expression, listening, authenticity',imbalance:'Difficulty speaking up, fear of judgment, talking without listening, dishonesty'},
    {name:'Third Eye',color:'#3A2A8A',loc:'Between the eyebrows',num:121,theme:'Intuition, perception, imagination, inner vision, clarity',imbalance:'Mental fog, ignoring intuition, over-rationalization, poor memory'},
    {name:'Crown',color:'#6A3A9A',loc:'Top of head',num:122,theme:'Connection to the divine, expanded consciousness, spiritual purpose',imbalance:'Spiritual disconnection, cynicism, feeling meaningless, over-attachment to ego'},
    {name:'Earth Star',color:'#4A3525',loc:'Below the feet',num:6,theme:'Deep grounding, ancestral connection, earth anchoring, embodied safety',imbalance:'Feeling untethered, spiritually floaty, disconnected from place or body'},
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
  // Family cards are rendered by renderFamilies() via initFamilies() above
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
  const activeBtn=btn || (typeof event!=='undefined'&&event?event.target:null) || document.querySelector(`.c101-sidebar-item[onclick*="${sec}"]`);
  if(activeBtn)activeBtn.classList.add('active');
  sync101Dropdown(sec);
  if(sec==='grids')init101Grids();
  if(sec==='shapes'){renderShapes();requestAnimationFrame(function(){setTimeout(function(){if(window._updateShapeArrows)window._updateShapeArrows();},100);});}
  if(sec==='families')initFamilies();
  if(sec==='roles')setupMobileRoleAccordion();
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


