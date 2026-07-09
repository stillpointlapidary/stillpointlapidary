// ── CRYSTALS 101 DATA ──
const C101_WATER = ["Angelite", "Black Kyanite", "Black Opal", "Blue Calcite", "Blue Fluorite", "Blue Halite", "Blue Kyanite", "Blue Opal", "Caribbean Calcite", "Chalcopyrite", "Cinnabar", "Clear Calcite", "Fire Opal", "Galena", "Green Calcite", "Green Fluorite", "Green Kyanite", "Green Opal", "Halite", "Honey Calcite", "Lapis Lazuli", "Lemurian Aquatine Calcite", "Lepidolite", "Malachite", "Mangano Calcite", "Opal", "Optical Calcite", "Orange Calcite", "Orange Kyanite", "Orange Selenite", "Pink Fluorite", "Pink Halite", "Pink Opal", "Purple Fluorite", "Pyrite", "Rainbow Fluorite", "Red Calcite", "Ruby in Kyanite", "Satin Spar Gypsum", "Selenite", "Teal Fluorite", "Turquoise", "White Opal", "Yellow Fluorite", "Zebra Calcite"];
const C101_SUN = ["Amethyst", "Aquamarine", "Black Amethyst", "Black Opal", "Blue Fluorite", "Blue Opal", "Blue Topaz", "Brandberg Amethyst", "Celestite", "Chevron Amethyst", "Fire Opal", "Green Fluorite", "Green Opal", "Imperial Topaz", "Kunzite", "Lavender Rose Quartz", "Opal", "Pink Fluorite", "Pink Opal", "Purple Fluorite", "Rainbow Fluorite", "Rose Quartz", "Teal Fluorite", "Topaz", "White Opal", "White Topaz", "Yellow Fluorite"];
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




// ── CRYSTAL FAMILIES DATA ──
// Representative gradient colors per family — used as placeholder until a real photo is added
// To add a photo: set photo:'fam-quartz.webp' on the family entry in C101_FAM_DATA
const FAM_PHOTO_COLORS={
  'Quartz':       'linear-gradient(145deg,#c9b8d8 0%,#9b7ab5 50%,#7a5a9a 100%)',
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
const C101_FAM_DATA=[{"n": "Quartz", "tier": "major", "desc": "Silicon dioxide — the most abundant mineral family on Earth. Includes Clear Quartz, Amethyst, Rose Quartz, Citrine, Jasper, Agate, and Chalcedony.", "energy": "Amplifying, clarifying, versatile. Most Quartzes enhance intention and energy.", "care": "Mohs 7. Safe for water. Amethyst and Rose Quartz fade in prolonged sun."}, {"n": "Feldspar", "tier": "major", "desc": "One of the most common mineral groups on Earth. Includes Moonstone, Labradorite, Amazonite, and Sunstone.", "energy": "Luminous, intuitive, often connected to cycles and inner glow. Many show adularescence.", "care": "Mohs 6–6.5. Moderate water tolerance; avoid prolonged soaking."}, {"n": "Calcite", "tier": "major", "desc": "Calcium carbonate crystals found in every color. Soft and often waxy to vitreous.", "energy": "Emotionally amplifying and clearing — each color adds a specific chakra quality.", "care": "Mohs 3. Never use water. Scratches easily. Store carefully."}, {"n": "Garnet", "tier": "major", "desc": "Iron-rich silicates with deep luster. Not always red — green Tsavorite, orange Spessartine, violet Rhodolite.", "energy": "Energizing, passionate, grounding. Strong root and sacral energy as a family.", "care": "Mohs 6.5–7.5. Durable. Safe for water and daily wear."}, {"n": "Tourmaline", "tier": "major", "desc": "Complex boron silicate minerals with a striking color range. Often striated along the length.", "energy": "Strongly protective and balancing. Black Tourmaline is the most widely used protective stone.", "care": "Mohs 7–7.5. Durable. Safe for water. Excellent for jewelry."}, {"n": "Obsidian", "tier": "major", "desc": "Volcanic glass formed from rapidly cooled lava. Always black or near-black.", "energy": "Powerful shadow work, truth-revealing, and protective. One of the most intense families.", "care": "Mohs 5–5.5. Safe for water. Edges can be razor-sharp on raw pieces."}, {"n": "Fluorite", "tier": "major", "desc": "Calcium fluoride. One of the most colorful families — purple, green, blue, or rainbow.", "energy": "The clearest thinking stone. Cuts through confusion and supports focus. Color adds specificity.", "care": "Mohs 4. Never use water. Has perfect cleavage — drops can split it. Fades in sun."}, {"n": "Silicates", "tier": "common", "desc": "The largest mineral class. A broad catch-all for many diverse stones not in other families.", "energy": "Properties vary widely. Check individual entries rather than relying on family tendencies.", "care": "Hardness varies. Check individual entries."}, {"n": "Aggregate", "tier": "common", "desc": "Rocks made of multiple mineral grains — Jaspers, some Agates, Rhyolite, Unakite.", "energy": "Generally grounding, stabilizing, nature-connected. Earthy energy as a rule.", "care": "Usually durable. Most safe for water. Avoid prolonged soaking."}, {"n": "Oxides", "tier": "common", "desc": "Minerals built from oxygen and metals — Hematite, Corundum (Ruby/Sapphire), Magnetite.", "energy": "Strongly grounding, protective, and physically activating. Iron-rich oxides especially earthy.", "care": "Generally durable. Hematite rusts if left wet."}, {"n": "Carbonates", "tier": "common", "desc": "Includes Malachite, Rhodochrosite, Dolomite, and Magnesite. Softness and color vary.", "energy": "Emotional in nature — heart-connected, transformative, or stabilizing depending on the stone.", "care": "Mostly water-sensitive. Malachite can be toxic — avoid in water elixirs, wash hands."}, {"n": "Phosphates", "tier": "common", "desc": "Includes Turquoise, Apatite, Vivianite, and Lazulite. Often vivid blues and greens.", "energy": "Communication, truth, and throat/third eye energy run throughout this family.", "care": "Most are water-sensitive. Turquoise discolors with water, oils, and chemicals."}, {"n": "Sulfides", "tier": "common", "desc": "Metal sulfide minerals — Pyrite, Galena, Cinnabar, Covellite. Often metallic and heavy.", "energy": "Shadow work, protection, and deep earth energy. Pyrite is the main manifestation stone here.", "care": "Never use water — sulfides oxidize and some are toxic. Wash hands after handling raw pieces."}, {"n": "Opal", "tier": "common", "desc": "Hydrated silica — a mineraloid, not a true crystal. Famous for play-of-color.", "energy": "Emotional amplification, creativity, and spontaneity. Intensifies what you bring to it.", "care": "Mohs 5.5–6.5. Water-sensitive despite being hydrated — soaking causes crazing."}, {"n": "Other Mineral", "tier": "common", "desc": "Stones that do not fit neatly into other families — a diverse group of unique specimens.", "energy": "Properties are stone-specific. Check individual entries for energy, care, and use.", "care": "Varies widely. Check individual entries."}, {"n": "Beryl", "tier": "specialty", "desc": "Beryllium aluminum silicate. Includes Emerald, Aquamarine, Morganite, and Heliodor.", "energy": "Each color has distinct energy — heart (Emerald/Morganite), throat/third eye (Aquamarine), solar (Heliodor).", "care": "Mohs 7.5–8. Durable. Safe for water and jewelry."}, {"n": "Kyanite", "tier": "specialty", "desc": "Aluminum silicate with blade-like crystals. Blue, black, green, and orange varieties.", "energy": "Self-aligning — said not to accumulate negative energy and rarely needs cleansing.", "care": "Mohs 4.5–7 (directional). Avoid water."}, {"n": "Aventurine", "tier": "specialty", "desc": "Quartz with sparkly mineral inclusions. Green, blue, and pink varieties.", "energy": "Luck, opportunity, and heart energy. Green Aventurine is one of the most popular prosperity stones.", "care": "Mohs 7. Safe for water. Stable in sun."}, {"n": "Aragonite", "tier": "specialty", "desc": "Calcium carbonate polymorph with different structure than Calcite. Often star-shaped.", "energy": "Grounding, centering, and emotionally stabilizing. Excellent for earth-connection work.", "care": "Mohs 3.5–4. Avoid water. Fragile; handle gently."}, {"n": "Copper Minerals", "tier": "specialty", "desc": "Copper-based minerals including Malachite, Azurite, Dioptase, and Shattuckite.", "energy": "Heart opening, communication, and emotional truth. Copper is considered a conductor of energy.", "care": "Water-sensitive. Can be toxic — avoid in water elixirs, wash hands."}, {"n": "Gypsum", "tier": "specialty", "desc": "Hydrated calcium sulfate. Includes Selenite, Satin Spar, and Desert Rose.", "energy": "Cleansing, purifying, and connecting to higher guidance. Selenite is the most used clearing tool.", "care": "Mohs 2. Never use water — dissolves over time. Self-cleansing; rarely needs clearing."}, {"n": "Apatite", "tier": "specialty", "desc": "Calcium phosphate minerals — same mineral as teeth and bones. Blue, green, or yellow.", "energy": "Manifestation, motivation, and clearing confusion. Strong connection to personal truth.", "care": "Mohs 5. Avoid water and acids. Somewhat brittle."}, {"n": "Iron Minerals", "tier": "specialty", "desc": "Iron-rich minerals including Hematite, Magnetite, Lodestone, and Goethite.", "energy": "Deeply grounding, protective, and physically activating. Lodestone used for attraction work.", "care": "Avoid water — iron rusts. Safe for daily handling otherwise."}, {"n": "Meteoritic Material", "tier": "rare", "desc": "Stones from space — Moldavite, Meteorite, Libyan Desert Glass, and Tektite.", "energy": "Intensely transformative and high-vibration. Moldavite especially is known for accelerating change.", "care": "Varies. Moldavite should not be soaked. Handle meteorites with clean dry hands."}, {"n": "Fossil Material", "tier": "rare", "desc": "Mineralized remains of ancient life — Ammonite, Orthoceras, Petrified Wood, Stromatolite.", "energy": "Ancient wisdom, ancestral connection, and deep time. Living records of life millions of years ago.", "care": "Generally durable. Most safe for brief water contact; some matrix material can be fragile."}, {"n": "Organic Material", "tier": "rare", "desc": "Materials of biological origin — Amber, Jet, Pearl, Coral. Not minerals in the traditional sense.", "energy": "Warmth, protection, and connection to ancient life. Amber is fossilized tree resin; Jet is fossilized wood.", "care": "Soft and scratch-prone. Avoid harsh chemicals, prolonged water, and heat."}, {"n": "Corundum", "tier": "rare", "desc": "Aluminum oxide — Ruby and Sapphire. Second hardest natural mineral after Diamond.", "energy": "Power, clarity, and divine connection. Ruby activates passion; Sapphire opens wisdom and truth.", "care": "Mohs 9. Extremely durable. Safe for water, jewelry, and daily wear."}, {"n": "Spodumene", "tier": "rare", "desc": "Lithium aluminum silicate — Kunzite (pink) and Hiddenite (green).", "energy": "Gentle heart opening, love, and gratitude. Unusually soft and tender in energetic quality.", "care": "Mohs 6.5–7. Kunzite fades rapidly in sunlight. Has perfect cleavage — handle with care."}, {"n": "Tiger's Eye", "tier": "rare", "desc": "Pseudomorphic quartz after crocidolite. Chatoyant (cat's-eye effect) in gold, red, and blue.", "energy": "Courage, confidence, and clear-eyed perception. The moving light band is distinctive.", "care": "Mohs 7. Safe for water. Stable in sun."}, {"n": "Serpentine", "tier": "rare", "desc": "Magnesium silicate group with green, mottled appearance. Includes Healerite and Atlantisite.", "energy": "Heart healing, emotional release, and connection to ancient nature energy.", "care": "Mohs 3–5. Avoid prolonged water exposure."}, {"n": "Halite", "tier": "rare", "desc": "Sodium chloride — rock salt crystals. Blue and pink varieties are collectors pieces.", "energy": "Purification, emotional clearing, and dissolving energetic residue. Ancient and elemental.", "care": "Mohs 2.5. Literally dissolves in water. Never wet. Very fragile."}, {"n": "Shungite", "tier": "rare", "desc": "A unique carbon-based mineraloid from Russia, over 2 billion years old.", "energy": "EMF shielding, purification, and ancient earth grounding. One of the most studied stones.", "care": "Mohs 3.5–4. Elite Shungite only in water. Leaves black residue initially."}, {"n": "Synthetic Material", "tier": "rare", "desc": "Lab-created or enhanced stones — Opalite, Goldstone, some Aura Quartzes.", "energy": "Often beautiful and energetically useful. Aura Quartzes (metal-bonded) are a popular example.", "care": "Varies. Generally durable. Be transparent about synthetic vs. natural origin."}, {"n": "Sulfates", "tier": "rare", "desc": "Sulfate minerals including Barite and Celestite. Often pastel and very delicate.", "energy": "Calming, higher guidance, and angelic connection. Celestite is beloved for its serene energy.", "care": "Mohs 3–3.5. Very fragile. Never use water. Store padded and separate."}, {"n": "Borates", "tier": "rare", "desc": "Borate minerals including Howlite and Ulexite. White or gray with distinctive veining.", "energy": "Calming, patience, and emotional attunement. Howlite is often dyed blue and sold as Turquoise.", "care": "Mohs 3–3.5. Avoid prolonged water contact."}];
const C101_TIERS=[
  {id:'major',label:'The Big Seven',sub:'The families you will encounter most often.'},
  {id:'common',label:'Common Families',sub:'Regularly found in shops and collections.'},
  {id:'specialty',label:'Specialty Families',sub:'Require more knowledge but reward the effort.'},
  {id:'rare',label:'Rare & Exotic',sub:'Less common, more specialized or demanding.'},
];
function renderFamilies(tier){
  const fc=document.getElementById('fam-cards');
  if(!fc)return;
  const q=(document.getElementById('fam-search-input')||{}).value||'';
  if(!window.FAM_COUNTS){window.FAM_COUNTS={};CRYSTALS.forEach(c=>{if(c.fam)window.FAM_COUNTS[c.fam]=(window.FAM_COUNTS[c.fam]||0)+1;});}
  let filtered=C101_FAM_DATA.filter(f=>(tier==='all'||f.tier===tier)&&(!q||f.n.toLowerCase().includes(q.toLowerCase())||f.desc.toLowerCase().includes(q.toLowerCase())));
  if(!filtered.length){fc.innerHTML='<div style="color:var(--ink3);font-size:13px;grid-column:1/-1;padding:1rem">No families match.</div>';return;}
  // Sort by stone count descending; within 'all' view, order by tier group first then count
  if(tier==='all'){
    const tierOrder={major:0,common:1,specialty:2,rare:3};
    filtered=filtered.slice().sort((a,b)=>{const td=(tierOrder[a.tier]||99)-(tierOrder[b.tier]||99);if(td!==0)return td;return(window.FAM_COUNTS[b.n]||0)-(window.FAM_COUNTS[a.n]||0);});
  } else {
    filtered=filtered.slice().sort((a,b)=>(window.FAM_COUNTS[b.n]||0)-(window.FAM_COUNTS[a.n]||0));
  }
  fc.innerHTML=filtered.map(f=>{
    const cnt=window.FAM_COUNTS[f.n]||0;
    const fArg=jsArg(f.n);
    const examples=CRYSTALS.filter(c=>c.fam===f.n).sort((a,b)=>(a.tier||9)-(b.tier||9)||(a.n>b.n?1:-1)).slice(0,4).map(c=>c.n).join(' · ');
    const photoSlot=f.photo
      ?`<img class="fam-photo-img" src="${escapeAttr(f.photo)}" alt="${escapeAttr(f.n)}" loading="lazy">`
      :`<div class="fam-photo-placeholder" style="background:${FAM_PHOTO_COLORS[f.n]||'var(--stone3)'}"></div>`;
    return`<div class="fam-card" data-family="${escapeAttr(f.n)}" onclick="jumpToFamily(${fArg});return false;" title="View ${escapeAttr(f.n)} stones in the encyclopedia"><div class="fam-photo">${photoSlot}</div><div class="fam-body"><div class="fam-name">${f.n}</div>${cnt?`<div class="fam-count">${cnt} stone${cnt===1?'':'s'}</div>`:''}<div class="fam-energy">${f.energy||f.desc}</div>${examples?`<div class="fam-examples">${examples}</div>`:''}</div></div>`;
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
      jumpToFamily(fam);
    });
  }
  const nav=document.getElementById('fam-tier-nav');
  if(nav&&!nav.children.length){
    C101_TIERS.forEach(t=>{const btn=document.createElement('button');btn.className='c101-pill';btn.textContent=t.label;btn.onclick=()=>setFamTier(t.id,btn);if(t.id==='major')btn.classList.add('active');nav.appendChild(btn);});
    const allBtn=document.createElement('button');allBtn.className='c101-pill';allBtn.textContent='All families';allBtn.onclick=()=>setFamTier('all',allBtn);nav.appendChild(allBtn);
  }
  window.currentFamTier='major';renderFamilies('major');
}
function setFamTier(tier,btn){document.querySelectorAll('#fam-tier-nav .c101-pill').forEach(p=>p.classList.remove('active'));btn.classList.add('active');window.currentFamTier=tier;renderFamilies(tier);}
function famSearch(){renderFamilies(window.currentFamTier||'all');}



// ── CRYSTAL GRIDS ──

const CRYSTAL_GRIDS = [
  {
    id: 'protection',
    name: 'Protection Grid',
    tagline: 'Clear and shield your energy field',
    moodLink: 4,
    layout: 'star',
    color: '#3a3530',
    activation: 'I define the boundary of my energy. What is not mine cannot enter here.',
    use: 'Set at the four corners of a room, or around your bed. Refresh weekly.',
    intro: 'A protection grid creates a defined energetic boundary — something to deflect what isn\'t yours and transmute what gets through anyway. One of the most practical grids to build and maintain.',
    stones: [
      {name:'Black Tourmaline', id:'C-0129', hex:'#3a3530', role:'Center',    purpose:'Primary shield and anchor'},
      {name:'Labradorite',      id:'C-0028', hex:'#5a8ab0', role:'Inner ×2',  purpose:'Deflects unwanted energy'},
      {name:'Hematite',         id:'C-0041', hex:'#666666', role:'Inner ×2',  purpose:'Grounds the protective field'},
      {name:'Smoky Quartz',     id:'C-0103', hex:'#8b6f47', role:'Outer ×4',  purpose:'Transmutes what enters'},
      {name:'Clear Quartz',     id:'C-0105', hex:'#e0dbd4', role:'Amplifier', purpose:'Amplifies the entire grid'},
    ],
    diagram: drawStarGrid,
  },
  {
    id: 'abundance',
    name: 'Abundance Grid',
    tagline: 'Align with prosperity and open flow',
    moodLink: 17, moodLinks: [17, 18, 19],
    layout: 'flower',
    color: '#c9a832',
    activation: 'I am open to receiving. I am aligned with what I am building.',
    use: 'On a desk or workspace. Set a specific intention before activating. Refresh monthly.',
    intro: 'Abundance grids work best when paired with a clear, specific intention. The stones here are magnetic: they don\'t create luck, they help you recognize and act on what\'s already available.',
    stones: [
      {name:'Citrine',            id:'C-0121', hex:'#c9a832', role:'Center',    purpose:'Core attractor'},
      {name:'Pyrite',             id:'C-0137', hex:'#c9b030', role:'Inner ×3',  purpose:'Confidence and magnetic pull'},
      {name:'Green Aventurine',   id:'C-0178', hex:'#4a8a5a', role:'Outer ×3',  purpose:'Opens to opportunity'},
      {name:"Tiger's Eye", id:'C-0168', hex:'#b08a30', role:'Outer ×3',  purpose:'Discernment and action'},
      {name:'Malachite',          id:'C-0020', hex:'#3a7a4a', role:'Base',      purpose:'Growth anchor'},
      {name:'Clear Quartz',       id:'C-0105', hex:'#e0dbd4', role:'Amplifier', purpose:'Top amplifier'},
    ],
    diagram: drawFlowerGrid,
  },
  {
    id: 'heart',
    name: 'Heart Healing Grid',
    tagline: 'Soften, release, and restore the heart',
    moodLink: 9,
    layout: 'circle',
    color: '#d4839a',
    activation: 'I am allowed to heal at the pace that is true for me.',
    use: 'Bedside or in private space. Hold the center stone first, then place the others outward.',
    intro: 'Built for the slow work — grief, loss, heartbreak, or the accumulated weight of being human for a while. The circle layout has no hard edges: it contains without constraining.',
    stones: [
      {name:'Rose Quartz',      id:'C-0108', hex:'#d4839a', role:'Center',   purpose:'Unconditional love, the foundation'},
      {name:'Rhodochrosite',    id:'C-0213', hex:'#d4739a', role:'Inner ×2', purpose:'Self-love and grief'},
      {name:'Morganite',        id:'C-0024', hex:'#e0a0b0', role:'Inner ×2', purpose:'Divine love and loss'},
      {name:'Rhodonite',        id:'C-0214', hex:'#c46880', role:'Outer ×2', purpose:'Forgiveness'},
      {name:'Green Aventurine', id:'C-0178', hex:'#4a8a5a', role:'Outer ×2', purpose:'Renewal'},
      {name:'Clear Quartz',     id:'C-0105', hex:'#e0dbd4', role:'Top',      purpose:'Drawing healing inward'},
    ],
    diagram: drawCircleGrid,
  },
  {
    id: 'clarity',
    name: 'Clarity Grid',
    tagline: 'Cut through fog, sharpen focus, decide',
    moodLink: 13,
    layout: 'triangle',
    color: '#4a6aaa',
    activation: 'I see clearly. I trust my own reasoning.',
    use: 'On a desk during work, study, or decision-making. The upward triangle directs energy forward.',
    intro: 'When the mind is circling without resolution, a clarity grid interrupts the loop. The upward triangle is directed, focused, moving — exactly what mental fog needs.',
    stones: [
      {name:'Clear Quartz',   id:'C-0105', hex:'#e0dbd4', role:'Center',    purpose:'Pure amplification'},
      {name:'Selenite',       id:'C-0175', hex:'#f0ece6', role:'Sides ×2',  purpose:'Clears mental static'},
      {name:'Sodalite',       id:'C-0218', hex:'#4a6aaa', role:'Corners ×2',purpose:'Logic and pattern recognition'},
      {name:'Lapis Lazuli',   id:'C-0188', hex:'#2a4a8a', role:'Outer ×2',  purpose:'Truth and wisdom'},
      {name:'Herkimer Diamond',id:'C-0123',hex:'#e8e4de', role:'Apex',      purpose:'Precision and high attunement'},
    ],
    diagram: drawTriangleGrid,
  },
  {
    id: 'sleep',
    name: 'Sleep & Rest Grid',
    tagline: 'Quiet the mind and invite deep rest',
    moodLink: 3,
    layout: 'rectangle',
    color: '#7a5a9a',
    activation: 'I release the day. My body knows how to rest.',
    use: 'Place under or around the bed. Activate with breath rather than loud intention.',
    intro: 'This grid doesn\'t push you to sleep — it removes what\'s in the way. The rectangle mirrors the shape of a bed intentionally. The Black Tourmaline at the foot keeps the sleep space sealed.',
    stones: [
      {name:'Amethyst',         id:'C-0119', hex:'#7a5a9a', role:'Center',   purpose:'Calming and protective'},
      {name:'Howlite',          id:'C-0241', hex:'#e8e4de', role:'Head ×2',  purpose:'Quiets the mental loop'},
      {name:'Lepidolite',       id:'C-0254', hex:'#9a7ab0', role:'Sides ×2', purpose:'Lithium-calm for anxiety'},
      {name:'Selenite',         id:'C-0175', hex:'#f0ece6', role:'Sides ×2', purpose:'Cleanses the sleep space'},
      {name:'Black Tourmaline', id:'C-0129', hex:'#3a3530', role:'Foot',     purpose:'Protection from disturbance'},
    ],
    diagram: drawRectangleGrid,
  },
  {
    id: 'transformation',
    name: 'Transformation Grid',
    tagline: 'Support deep change and conscious release',
    moodLink: 24,
    layout: 'star',
    color: '#5a8ab0',
    activation: 'I am willing to release what I have outgrown. I trust what is forming.',
    use: 'During major life transitions. Not for daily use — this grid moves things.',
    intro: 'For when you know something has to change and you\'re done waiting. Labradorite anchors the center — it catalyzes transformation while protecting you through the process.',
    stones: [
      {name:'Labradorite',   id:'C-0028', hex:'#5a8ab0', role:'Center',   purpose:'Catalyst with built-in protection'},
      {name:'Malachite',     id:'C-0020', hex:'#3a7a4a', role:'Inner ×2', purpose:'Transformation and truth'},
      {name:'Charoite',      id:'C-0249', hex:'#7a5a9a', role:'Inner ×2', purpose:'Moving through resistance'},
      {name:'Smoky Quartz',  id:'C-0103', hex:'#8b6f47', role:'Outer ×2', purpose:'Releasing the old'},
      {name:'Black Obsidian',id:'C-0139', hex:'#2a2520', role:'Outer ×2', purpose:'Facing what must go'},
      {name:'Clear Quartz',  id:'C-0105', hex:'#e0dbd4', role:'Top',      purpose:'Amplifier pointing outward'},
    ],
    diagram: drawStarGrid,
  },
];

// ── GRID DIAGRAM DRAWING FUNCTIONS ──

function drawStarGrid(stones, svgId) {
  const svg = document.getElementById(svgId);
  if(!svg) return;
  const cx=100, cy=100, r_inner=35, r_outer=70;
  let html = '';
  
  // Draw lines first
  const pts_inner = Array.from({length:6},(_,i)=>{
    const a = i*60-90;
    return [cx+r_inner*Math.cos(a*Math.PI/180), cy+r_inner*Math.sin(a*Math.PI/180)];
  });
  const pts_outer = Array.from({length:6},(_,i)=>{
    const a = i*60-90;
    return [cx+r_outer*Math.cos(a*Math.PI/180), cy+r_outer*Math.sin(a*Math.PI/180)];
  });
  
  // Star lines
  for(let i=0;i<6;i++){
    const j=(i+2)%6;
    html+=`<line x1="${pts_outer[i][0]}" y1="${pts_outer[i][1]}" x2="${pts_outer[j][0]}" y2="${pts_outer[j][1]}" stroke="var(--grid-line)" stroke-width="0.5"/>`;
  }
  for(let i=0;i<6;i++){
    html+=`<line x1="${cx}" y1="${cy}" x2="${pts_outer[i][0]}" y2="${pts_outer[i][1]}" stroke="var(--grid-line)" stroke-width="0.5" stroke-dasharray="2,3"/>`;
  }
  
  // Center stone
  const c = stones[0];
  html += drawDot(cx, cy, 14, c.hex, c.name, true);
  
  // Inner ring (2 stones)
  const inner2 = stones.filter(s=>s.role.includes('Inner ×2'));
  inner2.forEach((s,i)=>{
    html += drawDot(pts_inner[i*3][0], pts_inner[i*3][1], 9, s.hex, s.name, false);
  });
  
  // Outer stones (4 or 2)
  const outer = stones.filter(s=>s.role.includes('Outer'));
  const count = parseInt(outer[0]?.role.match(/\d+/)?.[0]||4);
  for(let i=0;i<Math.min(count,6);i++){
    html += drawDot(pts_outer[i][0], pts_outer[i][1], 9, outer[0].hex, outer[0].name, false);
  }
  
  // Amplifier at top
  const amp = stones.find(s=>s.role.includes('Top')||s.role.includes('Amplifier'));
  if(amp){
    html += drawDot(cx, cy-r_outer-14, 7, amp.hex, amp.name, false);
    html += `<line x1="${cx}" y1="${cy-r_outer}" x2="${cx}" y2="${cy-r_outer-8}" stroke="var(--grid-line)" stroke-width="0.5"/>`;
  }
  
  svg.innerHTML = html;
}

function drawCircleGrid(stones, svgId) {
  const svg = document.getElementById(svgId);
  if(!svg) return;
  const cx=100, cy=105, r1=30, r2=60;
  let html = '';
  
  // Circles
  html += `<circle cx="${cx}" cy="${cy}" r="${r1}" fill="none" stroke="var(--grid-line)" stroke-width="0.5"/>`;
  html += `<circle cx="${cx}" cy="${cy}" r="${r2}" fill="none" stroke="var(--grid-line)" stroke-width="0.5"/>`;
  
  // Center
  html += drawDot(cx, cy, 14, stones[0].hex, stones[0].name, true);
  
  // Inner ring (4 stones at cardinal)
  const inner = stones.filter(s=>s.role.includes('Inner'));
  const inner_angles = [270, 0, 90, 180]; // top, right, bottom, left  
  inner_angles.forEach((a,i)=>{
    if(i >= inner.length*2) return;
    const s = inner[Math.floor(i/2)];
    const x = cx + r1*Math.cos(a*Math.PI/180);
    const y = cy + r1*Math.sin(a*Math.PI/180);
    html += drawDot(x, y, 9, s.hex, s.name, false);
  });
  
  // Outer ring (4 stones diagonal)
  const outer = stones.filter(s=>s.role.includes('Outer'));
  const outer_angles = [315, 45, 135, 225];
  outer_angles.forEach((a,i)=>{
    if(i >= outer.length*2) return;
    const s = outer[Math.floor(i/2)];
    const x = cx + r2*Math.cos(a*Math.PI/180);
    const y = cy + r2*Math.sin(a*Math.PI/180);
    html += drawDot(x, y, 9, s.hex, s.name, false);
  });
  
  // Top amplifier
  const top = stones.find(s=>s.role==='Top');
  if(top){
    html += drawDot(cx, cy-r2-14, 7, top.hex, top.name, false);
    html += `<line x1="${cx}" y1="${cy-r2}" x2="${cx}" y2="${cy-r2-8}" stroke="var(--grid-line)" stroke-width="0.5"/>`;
  }
  
  svg.innerHTML = html;
}

function drawTriangleGrid(stones, svgId) {
  const svg = document.getElementById(svgId);
  if(!svg) return;
  const cx=100, cy=110;
  const tip = [cx, 20];
  const bl  = [cx-75, 185];
  const br  = [cx+75, 185];
  
  let html = '';
  
  // Triangle
  html += `<polygon points="${tip[0]},${tip[1]} ${bl[0]},${bl[1]} ${br[0]},${br[1]}" fill="none" stroke="var(--grid-line)" stroke-width="0.8"/>`;
  
  // Inner triangle
  const ti2=[cx,52], bl2=[cx-40,155], br2=[cx+40,155];
  html += `<polygon points="${ti2[0]},${ti2[1]} ${bl2[0]},${bl2[1]} ${br2[0]},${br2[1]}" fill="none" stroke="var(--grid-line)" stroke-width="0.4" stroke-dasharray="3,3"/>`;
  
  // Centerpoint
  const ctr = [cx, 120];
  html += drawDot(ctr[0], ctr[1], 13, stones[0].hex, stones[0].name, true);
  
  // Side stones (×2)
  const sides = stones.filter(s=>s.role.includes('Sides'));
  if(sides.length){
    [[cx-50,130],[cx+50,130]].forEach(([x,y])=>{
      html += drawDot(x, y, 9, sides[0].hex, sides[0].name, false);
    });
  }
  
  // Corner stones (×2)
  const corners = stones.filter(s=>s.role.includes('Corners'));
  if(corners.length){
    [[bl[0]+15,bl[1]-10],[br[0]-15,br[1]-10]].forEach(([x,y])=>{
      html += drawDot(x, y, 9, corners[0].hex, corners[0].name, false);
    });
  }
  
  // Outer (×2)
  const outer = stones.filter(s=>s.role.includes('Outer'));
  if(outer.length){
    [[bl[0]-8,bl[1]+5],[br[0]+8,br[1]+5]].forEach(([x,y])=>{
      html += drawDot(x, y, 9, outer[0].hex, outer[0].name, false);
    });
  }
  
  // Apex
  const apex = stones.find(s=>s.role==='Apex');
  if(apex) html += drawDot(tip[0], tip[1]-14, 9, apex.hex, apex.name, false);
  
  svg.innerHTML = html;
}

function drawRectangleGrid(stones, svgId) {
  const svg = document.getElementById(svgId);
  if(!svg) return;
  const left=30, top=15, w=140, h=140;
  let html = '';
  
  // Rectangle (bed outline)
  html += `<rect x="${left}" y="${top}" width="${w}" height="${h}" rx="4" fill="none" stroke="var(--grid-line)" stroke-width="0.8"/>`;
  html += `<text x="${left+w/2}" y="${top+h/2+16}" text-anchor="middle" font-size="9" fill="var(--ink3)" font-family="Jost,sans-serif" opacity="0.5">bed</text>`;
  
  // Dashed center line
  html += `<line x1="${left+w/2}" y1="${top+5}" x2="${left+w/2}" y2="${top+h-5}" stroke="var(--grid-line)" stroke-width="0.4" stroke-dasharray="3,4"/>`;
  
  // Center stone (middle of bed)
  html += drawDot(left+w/2, top+h/2-10, 13, stones[0].hex, stones[0].name, true);
  
  // Head stones (top)
  const head = stones.filter(s=>s.role.includes('Head'));
  if(head.length){
    [[left+25,top+20],[left+w-25,top+20]].forEach(([x,y])=>{
      html += drawDot(x, y, 9, head[0].hex, head[0].name, false);
    });
  }
  
  // Side stones
  const sides = stones.filter(s=>s.role.includes('Sides'));
  if(sides.length>=2){
    [[left-12,top+h/2-10],[left+w+12,top+h/2-10]].forEach(([x,y],i)=>{
      html += drawDot(x, y, 9, sides[Math.min(i,sides.length-1)].hex, sides[0].name, false);
    });
  }
  
  // Foot stone (bottom center)
  const foot = stones.find(s=>s.role==='Foot');
  if(foot) html += drawDot(left+w/2, top+h+10, 11, foot.hex, foot.name, false);
  
  svg.innerHTML = html;
}

function drawFlowerGrid(stones, svgId) {
  const svg = document.getElementById(svgId);
  if(!svg) return;
  const cx=100, cy=100, r1=32, r2=68;
  let html = '';
  
  // Petal circles (6)
  for(let i=0;i<6;i++){
    const a = i*60-90;
    const px = cx + r1*Math.cos(a*Math.PI/180);
    const py = cy + r1*Math.sin(a*Math.PI/180);
    html += `<circle cx="${px}" cy="${py}" r="${r1}" fill="none" stroke="var(--grid-line)" stroke-width="0.4" opacity="0.6"/>`;
  }
  html += `<circle cx="${cx}" cy="${cy}" r="${r1}" fill="none" stroke="var(--grid-line)" stroke-width="0.5"/>`;
  html += `<circle cx="${cx}" cy="${cy}" r="${r2}" fill="none" stroke="var(--grid-line)" stroke-width="0.4" stroke-dasharray="3,3"/>`;
  
  // Center
  html += drawDot(cx, cy, 14, stones[0].hex, stones[0].name, true);
  
  // Inner ring (3 stones)
  const inner = stones.filter(s=>s.role.includes('Inner'));
  for(let i=0;i<3;i++){
    const a = i*120-90;
    const x = cx + r1*Math.cos(a*Math.PI/180);
    const y = cy + r1*Math.sin(a*Math.PI/180);
    html += drawDot(x, y, 9, inner[0].hex, inner[0].name, false);
  }
  
  // Outer ring (6 alternating: aventurine x3, tiger x3)
  const outer1 = stones.filter(s=>s.role.includes('Outer ×3'))[0];
  const outer2 = stones.filter(s=>s.role.includes('Outer ×3'))[1];
  for(let i=0;i<6;i++){
    const a = i*60-90;
    const x = cx + r2*Math.cos(a*Math.PI/180);
    const y = cy + r2*Math.sin(a*Math.PI/180);
    const s = i%2===0 ? outer1 : outer2;
    if(s) html += drawDot(x, y, 9, s.hex, s.name, false);
  }
  
  // Base and amplifier
  const base = stones.find(s=>s.role==='Base');
  const amp  = stones.find(s=>s.role==='Amplifier');
  if(base) html += drawDot(cx, cy+r2+14, 9, base.hex, base.name, false);
  if(amp)  html += drawDot(cx, cy-r2-14, 9, amp.hex,  amp.name,  false);
  
  svg.innerHTML = html;
}

function drawDot(x, y, r, hex, name, isCenter) {
  const stroke = isCenter ? 'var(--accent)' : 'var(--border)';
  const sw = isCenter ? '1.5' : '0.8';
  // Tooltip via title
  return `<g>
    <circle cx="${Math.round(x)}" cy="${Math.round(y)}" r="${r}" fill="${hex}" stroke="${stroke}" stroke-width="${sw}" opacity="${isCenter?1:0.9}"/>
    ${isCenter ? `<circle cx="${Math.round(x)}" cy="${Math.round(y)}" r="${r+4}" fill="none" stroke="var(--accent)" stroke-width="0.5" opacity="0.4"/>` : ''}
    <title>${name}</title>
  </g>`;
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
        <svg viewBox="0 0 200 200" width="140" height="140" id="card-svg-${grid.id}"></svg>
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
      <div style="font-size:11px;letter-spacing:0.09em;text-transform:uppercase;color:var(--ink3);margin-bottom:6px">${grid.tagline}</div>
      <div style="font-family:'Cormorant Garamond',serif;font-size:32px;font-weight:300;color:var(--ink);margin-bottom:0.75rem">${grid.name}</div>
      <p style="font-size:13px;color:var(--ink2);line-height:1.7">${grid.intro}</p>
    </div>
    
    <div class="grid-modal-layout" style="display:grid;grid-template-columns:1fr 1fr;gap:2rem;margin-bottom:1.5rem">
      <div style="min-width:0">
        <svg viewBox="0 0 200 220" width="100%" id="modal-svg-${grid.id}" style="max-width:240px;display:block;margin:0 auto"></svg>
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
        <div style="font-family:'Cormorant Garamond',serif;font-size:16px;font-style:italic;color:var(--ink);line-height:1.5">"${grid.activation}"</div>
      </div>
      <div style="background:var(--stone2);border-radius:8px;padding:1rem">
        <div style="font-size:10px;letter-spacing:0.08em;text-transform:uppercase;color:var(--ink3);margin-bottom:6px">Placement & use</div>
        <div style="font-size:13px;color:var(--ink2);line-height:1.6">${grid.use}</div>
      </div>
    </div>
    
    <div style="padding:0.75rem 1rem;border-left:2px solid var(--accent2);background:var(--stone2);border-radius:0 6px 6px 0;font-size:12px;color:var(--ink2)">
      <strong style="color:var(--ink)">How to activate: </strong>Place stones from outside in, ending at the center. Hold your intention clearly, then touch each stone lightly with a clear quartz point to connect them.
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
    examples: ['Druzy Agate', 'Grape Agate', 'Chalcopyrite', 'Uvarovite'],
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

