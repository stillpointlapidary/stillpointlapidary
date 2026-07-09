// ── IDENTIFY WIZARD ──

const IDENTIFY_STEPS = [
  {
    id: 'color',
    question: 'What is the dominant color?',
    hint: 'Choose the most prominent color. Multicolor stones with no single dominant color — select Multi.',
    type: 'grid',
    options: [
      {val:'Purple', label:'Purple / Violet', hex:'#7a5a9a'},
      {val:'Blue', label:'Blue / Indigo', hex:'#5a8ab0'},
      {val:'Green', label:'Green / Teal', hex:'#4a8a5a'},
      {val:'Pink', label:'Pink / Rose', hex:'#d4839a'},
      {val:'Red', label:'Red / Crimson', hex:'#b04a4a'},
      {val:'Orange', label:'Orange / Peach', hex:'#d4783a'},
      {val:'Yellow', label:'Yellow / Gold', hex:'#c9a832'},
      {val:'Black', label:'Black', hex:'#3a3530'},
      {val:'White', label:'White / Clear', hex:'#e8e4de'},
      {val:'Brown', label:'Brown / Earth tones', hex:'#8b6f47'},
      {val:'Gray', label:'Gray / Silver / Metallic', hex:'#8a8a8a'},
      {val:'Multi', label:'Multicolor / Iridescent', hex:'#9a8a7a'},
    ],
    filter: (crystals, val) => crystals.filter(c => c.col_cats && c.col_cats.includes(val)),
  },
  {
    id: 'transparency',
    question: 'Can you see light through it?',
    hint: 'Hold it up to a light source or window.',
    type: 'list',
    options: [
      {val:'Transparent', label:'Fully transparent', desc:'You can see clearly through it like glass'},
      {val:'Translucent', label:'Translucent', desc:'Light passes through but you cannot see clearly through it'},
      {val:'Opaque', label:'Opaque', desc:'No light passes through at all'},
    ],
    filter: (crystals, val) => {
      const map = {
        'Transparent': ['Transparent','Transparent to Translucent'],
        'Translucent': ['Translucent','Transparent to Translucent','Translucent to Opaque'],
        'Opaque': ['Opaque','Translucent to Opaque'],
      };
      const valid = map[val] || [];
      return crystals.filter(c => c.tr && valid.some(v => c.tr.includes(v)));
    },
  },
  {
    id: 'luster',
    question: 'How does the surface catch light?',
    hint: 'Look at a fresh surface or polished face, not a weathered outside.',
    type: 'list',
    options: [
      {val:'vitreous', label:'Glassy / Vitreous', desc:'Bright, glass-like shine (most common in crystals)'},
      {val:'metallic', label:'Metallic', desc:'Shiny like metal — gold, silver, or bronze'},
      {val:'pearly', label:'Pearly / Silky', desc:'Soft sheen like a pearl or silk fabric'},
      {val:'resinous', label:'Resinous / Waxy', desc:'Like dried resin or candle wax'},
      {val:'earthy', label:'Dull / Earthy', desc:'Matte, no shine at all'},
      {val:'adamantine', label:'Brilliant / Adamantine', desc:'Exceptionally bright, diamond-like fire'},
    ],
    filter: (crystals, val) => {
      // Map luster to material types and known stones
      const metallic = ['Pyrite','Hematite','Galena','Chalcopyrite','Peacock Ore','Stibnite','Marcasite','Magnetite','Lodestone','Copper','Bornite'];
      const pearly = ['Selenite','Satin Spar Gypsum','Lepidolite','Muscovite','Mica','Petalite','Stilbite','Tremolite','Talc'];
      const earthy = ['Jasper','Turquoise','Chrysocolla','Serpentine','Howlite','Magnesite','Rhyolite'];
      const adamantine = ['Diamond','Zircite','Sphene','Sphalerite','Rhodizite','Cassiterite','Cerussite'];
      const resinous = ['Amber','Jet','Obsidian','Opal'];
      if(val==='metallic') return crystals.filter(c=>metallic.some(n=>c.n.includes(n))||c.mt==='Sulfide'||(c.c&&c.c.toLowerCase().includes('metallic')));
      if(val==='pearly') return crystals.filter(c=>pearly.some(n=>c.n.includes(n))||(c.tr&&c.tr.toLowerCase().includes('translucent'))&&(c.fam==='Gypsum'||c.fam==='Mica'));
      if(val==='earthy') return crystals.filter(c=>earthy.some(n=>c.n.includes(n))||c.mt==='Aggregate'||(c.sy&&c.sy==='Polymineralic'));
      if(val==='adamantine') return crystals.filter(c=>adamantine.some(n=>c.n.includes(n)));
      if(val==='resinous') return crystals.filter(c=>resinous.some(n=>c.n.includes(n))||c.mt==='Organic'||c.mt==='Mineraloid');
      // vitreous = most minerals, default fallback
      return crystals.filter(c=>!metallic.some(n=>c.n.includes(n))&&!pearly.some(n=>c.n.includes(n))&&!earthy.some(n=>c.n.includes(n)));
    },
  },
  {
    id: 'hardness',
    question: 'How hard is the stone?',
    hint: 'Test carefully on an inconspicuous spot. Soft stones will scratch with a fingernail.',
    type: 'list',
    options: [
      {val:'very_soft', label:'Very soft (Mohs 1–3)', desc:'A fingernail easily scratches it'},
      {val:'soft', label:'Soft (Mohs 3–5)', desc:'A copper coin scratches it, not a fingernail'},
      {val:'medium', label:'Medium (Mohs 5–6.5)', desc:'A steel knife scratches it, not a copper coin'},
      {val:'hard', label:'Hard (Mohs 6.5–8)', desc:'A steel knife does NOT scratch it. It scratches glass.'},
      {val:'very_hard', label:'Very hard (Mohs 8+)', desc:'Extremely difficult to scratch. Very rare.'},
    ],
    filter: (crystals, val) => {
      const ranges = {
        very_soft: [0,3], soft: [2.5,5], medium: [4.5,6.5], hard: [6,8.5], very_hard: [7.5,11]
      };
      const [mn,mx] = ranges[val];
      return crystals.filter(c=>{
        const m = parseFloat(c.m);
        return !isNaN(m) && m>=mn && m<=mx;
      });
    },
  },
  {
    id: 'form',
    question: 'What is its natural form or structure?',
    hint: 'This refers to how it was formed, not how it was cut or polished.',
    type: 'list',
    options: [
      {val:'cubic', label:'Cubic / Blocky crystals', desc:'Square or octahedral shapes — pyrite, fluorite, garnet'},
      {val:'prismatic', label:'Prismatic columns', desc:'Long hexagonal or rectangular columns — quartz, tourmaline, beryl'},
      {val:'bladed', label:'Bladed / Flat', desc:'Thin flat blades or plates — kyanite, selenite, mica'},
      {val:'botryoidal', label:'Rounded / Botryoidal', desc:'Grape-like bubbled surfaces — malachite, chalcedony, smithsonite'},
      {val:'massive', label:'Massive / No visible crystals', desc:'Solid with no distinct crystal faces — most tumbled stones, jaspers'},
      {val:'fibrous', label:'Fibrous / Silky', desc:'Hair-like or needle-like structure — satin spar, ulexite, rutile'},
      {val:'dendritic', label:'Dendritic / Branching', desc:'Tree or fern-like inclusions — dendritic agate, pyrolusite'},
    ],
    filter: (crystals, val) => {
      const cubic_fams = ['Fluorite','Garnet','Obsidian','Iron Minerals'];
      const cubic_names = ['Pyrite','Galena','Magnetite','Halite','Diamond','Spinel','Sodalite'];
      const prismatic_fams = ['Quartz','Tourmaline','Beryl','Kyanite','Apatite'];
      const prismatic_sys = ['Trigonal','Hexagonal','Tetragonal'];
      const bladed = ['Kyanite','Selenite','Mica','Satin Spar','Barite','Stilbite','Wulfenite'];
      const botryoidal = ['Malachite','Chalcedony','Smithsonite','Hemimorphite','Prehnite','Chrysocolla','Goethite'];
      const fibrous = ['Ulexite','Satin Spar Gypsum','Tremolite','Tiger','Asbestos','Howlite'];
      const dendritic = ['Dendritic','Moss Agate','Pyrolusite','Psilomelane'];
      
      if(val==='cubic') return crystals.filter(c=>cubic_fams.some(f=>c.fam===f)||cubic_names.some(n=>c.n.includes(n))||c.sy==='Cubic');
      if(val==='prismatic') return crystals.filter(c=>prismatic_fams.some(f=>c.fam===f)||prismatic_sys.some(s=>c.sy===s));
      if(val==='bladed') return crystals.filter(c=>bladed.some(n=>c.n.includes(n))||c.sy==='Triclinic'||c.sy==='Monoclinic');
      if(val==='botryoidal') return crystals.filter(c=>botryoidal.some(n=>c.n.includes(n)));
      if(val==='fibrous') return crystals.filter(c=>fibrous.some(n=>c.n.includes(n)));
      if(val==='dendritic') return crystals.filter(c=>dendritic.some(n=>c.n.includes(n)));
      // massive = everything else
      return crystals.filter(c=>!prismatic_sys.some(s=>c.sy===s)||c.mt==='Aggregate');
    },
  },
  {
    id: 'formation',
    question: 'Where or how do you think it formed?',
    hint: 'This is optional but very helpful. Skip if unsure.',
    type: 'list',
    options: [
      {val:'Igneous', label:'From volcanic / magma activity', desc:'Formed in cooling lava or magma — obsidian, basalt, granite-family'},
      {val:'Metamorphic', label:'Deep earth pressure & heat', desc:'Transformed under extreme conditions — garnet, kyanite, ruby, jade'},
      {val:'Sedimentary', label:'Layers of sediment', desc:'Built up over time in layers — calcite, jasper, some agates'},
      {val:'Hydrothermal', label:'Hot water through rock', desc:'Crystallized from hot mineral-rich fluids — quartz, fluorite, pyrite'},
      {val:'Secondary', label:'From weathering / oxidation', desc:'Formed when other minerals broke down — malachite, azurite, chrysocolla'},
    ],
    filter: (crystals, val) => crystals.filter(c=>c.fo&&c.fo.toLowerCase().includes(val.toLowerCase())),
  }
];

let identifyCandidates = [];
let identifyAnswers = {};
let identifyStepHistory = [];
let identifyCurrentStep = 0;

function startIdentify(){
  identifyCandidates = [...CRYSTALS];
  identifyAnswers = {};
  identifyStepHistory = [];
  identifyCurrentStep = 0;
  document.getElementById('identify-start').style.display='none';
  document.getElementById('identify-wizard').style.display='block';
  document.getElementById('identify-results').style.display='none';
  showIdentifyStep(0);
}

function resetIdentify(){
  identifyCandidates = [...CRYSTALS];
  identifyAnswers = {};
  identifyStepHistory = [];
  identifyCurrentStep = 0;
  document.getElementById('identify-start').style.display='block';
  document.getElementById('identify-wizard').style.display='none';
  document.getElementById('identify-results').style.display='none';
}

function showIdentifyStep(stepIdx){
  identifyCurrentStep = stepIdx;
  const step = IDENTIFY_STEPS[stepIdx];
  const totalSteps = IDENTIFY_STEPS.length;
  const progress = (stepIdx / totalSteps) * 100;
  
  document.getElementById('id-progress-bar').style.width = progress+'%';
  document.getElementById('id-step-label').textContent = 'Step '+(stepIdx+1)+' of '+totalSteps;
  document.getElementById('id-back-btn').style.display = stepIdx>0?'':'none';
  
  // Candidate count
  const bar = document.getElementById('id-candidate-bar');
  if(identifyCandidates.length < CRYSTALS.length){
    bar.style.display='block';
    bar.textContent = identifyCandidates.length+' possible matches remaining';
  } else {
    bar.style.display='none';
  }
  
  // Render question
  const qa = document.getElementById('id-question-area');
  qa.innerHTML = `
    <div style="font-family:'Cormorant Garamond',serif;font-size:22px;font-weight:300;color:var(--ink);margin-bottom:6px">${step.question}</div>
    <div style="font-size:12px;color:var(--ink3);margin-bottom:1.25rem;line-height:1.6">${step.hint}</div>
    <div id="id-options-container">${renderIdentifyOptions(step)}</div>
  `;
}

function renderIdentifyOptions(step){
  if(step.type==='grid'){
    return '<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(140px,1fr));gap:8px">'+
      step.options.map(opt=>`
        <button onclick="selectIdentifyAnswer('${step.id}','${opt.val}',this)" style="padding:14px 10px;border:0.5px solid var(--border);border-radius:8px;background:var(--white);cursor:pointer;font-family:'Jost',sans-serif;font-size:12px;color:var(--ink2);transition:all 0.15s;display:flex;align-items:center;gap:8px;text-align:left">
          <span style="width:18px;height:18px;border-radius:50%;background:${opt.hex};border:0.5px solid rgba(0,0,0,0.1);flex-shrink:0"></span>
          ${opt.label}
        </button>`).join('')+
      '</div>';
  }
  return '<div style="display:flex;flex-direction:column;gap:8px">'+
    step.options.map(opt=>`
      <button onclick="selectIdentifyAnswer('${step.id}','${opt.val}',this)" style="padding:14px 16px;border:0.5px solid var(--border);border-radius:8px;background:var(--white);cursor:pointer;font-family:'Jost',sans-serif;text-align:left;transition:all 0.15s;display:flex;flex-direction:column;gap:3px">
        <span style="font-size:13px;color:var(--ink);font-weight:500">${opt.label}</span>
        <span style="font-size:11px;color:var(--ink3)">${opt.desc}</span>
      </button>`).join('')+
    '</div>';
}

function selectIdentifyAnswer(stepId, val, btn){
  // Highlight selected
  btn.closest('#id-options-container').querySelectorAll('button').forEach(b=>{
    b.style.background='var(--white)';b.style.borderColor='var(--border)';b.style.color='var(--ink2)';
  });
  btn.style.background='var(--ink)';btn.style.borderColor='var(--ink)';btn.style.color='var(--white)';
  btn.querySelectorAll('span').forEach(s=>s.style.color='var(--white)');
  
  // Brief delay then advance
  setTimeout(()=>applyIdentifyAnswer(stepId, val), 280);
}

function applyIdentifyAnswer(stepId, val){
  identifyAnswers[stepId] = val;
  identifyStepHistory.push(identifyCurrentStep);
  
  // Apply filter
  const step = IDENTIFY_STEPS.find(s=>s.id===stepId);
  const filtered = step.filter(identifyCandidates, val);
  
  // Only narrow if we still have reasonable results
  if(filtered.length >= 1){
    identifyCandidates = filtered;
  }
  
  // Check if done or advance
  const nextStep = identifyCurrentStep + 1;
  if(nextStep >= IDENTIFY_STEPS.length || identifyCandidates.length <= 3){
    showIdentifyResults();
  } else {
    showIdentifyStep(nextStep);
  }
}

function identifyBack(){
  if(identifyStepHistory.length === 0)return;
  const prevStep = identifyStepHistory.pop();
  // Undo the last answer's filter by re-running from scratch
  identifyCandidates = [...CRYSTALS];
  const answeredSteps = Object.keys(identifyAnswers).slice(0,-1);
  delete identifyAnswers[IDENTIFY_STEPS[identifyCurrentStep]?.id];
  // Re-apply all previous answers
  answeredSteps.forEach(sid=>{
    const s=IDENTIFY_STEPS.find(x=>x.id===sid);
    if(s){
      const filtered=s.filter(identifyCandidates,identifyAnswers[sid]);
      if(filtered.length>=1)identifyCandidates=filtered;
    }
  });
  showIdentifyStep(prevStep);
}

function identifySkip(){
  identifyStepHistory.push(identifyCurrentStep);
  const nextStep = identifyCurrentStep + 1;
  if(nextStep >= IDENTIFY_STEPS.length){
    showIdentifyResults();
  } else {
    showIdentifyStep(nextStep);
  }
}

function showIdentifyResults(){
  document.getElementById('identify-wizard').style.display='none';
  document.getElementById('identify-results').style.display='block';
  
  const count = identifyCandidates.length;
  const titleEl = document.getElementById('id-results-title');
  const subEl = document.getElementById('id-results-sub');
  
  if(count===0){
    titleEl.textContent='No exact matches found';
    subEl.textContent='Your stone may be rare, unlisted, or the answers may need adjustment. Try starting over with different selections.';
    document.getElementById('id-results-grid').innerHTML='<div class="empty-state">Try starting over and skipping the steps you\'re less certain about.</div>';
    return;
  }
  
  titleEl.textContent = count===1?'1 match found':count+' possible matches';
  subEl.textContent = count<=5?'These are your most likely candidates based on your answers.':'Tap any stone to see its full entry. Start with the most visually similar.';
  
  const grid = document.getElementById('id-results-grid');
  if(grid){
    renderPagedStoneList({
      stones:identifyCandidates,
      container:grid,
      stateKey:'identify-results',
      renderCard:c=>stripInlineCardColor(encCardHtml(c)).replace(/onclick="openDetail\(/g,'onclick="openDetailFromIdentify('),
      loadMoreContainer:ensureStoneListLoadMore(grid,'identify-load-more')
    });
    return;
  }
  const display = identifyCandidates.slice(0,RESULT_BATCH_SIZE);
  grid.innerHTML = display.map(c=>{
    const isOwned=!!owned[c.i],isWish=!!wish[c.i];
    const badge=isOwned?'<span class="card-badge badge-owned"></span>':(isWish?'<span class="card-badge badge-wish"></span>':'');
    const encPhotos=ENCYCLOPEDIA_PHOTOS[c.i];
    const imgZone=encPhotos
      ?`<div class="card-img-zone has-photo"><img src="${SUPABASE_ENC}${encPhotos[0]}" alt="${c.n}" loading="lazy"></div>`
      :noPhotoZoneHtml(c);
    const roles=[c.er1,c.er2].filter(Boolean).map(t=>`<span class="card-role">${t}</span>`).join('<span class="card-role-sep">·</span>');
    return`<div class="crystal-card" onclick="openDetailFromIdentify('${c.i}')">${badge}${imgZone}<div class="card-body"><div class="card-name">${c.n}</div>${roles?`<div>${roles}</div>`:''}</div></div>`;
  }).join('');
}

function openDetailFromIdentify(id){
  // Open detail drawer without switching tab
  openDetail(id);
}




// ── IDENTIFY V2 ──
var id2State={color:null,trans:null,luster:null,hard:null,heft:null};
var id2Revealed={trans:false,luster:false,hard:false,heft:false};
const HEFT_FN={
  light:   c=>['Gypsum','Organic Material','Fossil Material'].includes(c.fam)||['Amber','Selenite','Satin Spar','Pumice','Desert Rose'].some(n=>c.n.includes(n)),
  heavy:   c=>['Iron Minerals','Sulfides'].includes(c.fam)||['Hematite','Pyrite','Galena','Magnetite','Lodestone','Chalcopyrite','Bismuth','Barite','Cassiterite'].some(n=>c.n.includes(n)),
  average: c=>!HEFT_FN.light(c)&&!HEFT_FN.heavy(c),
};
const ID2_COLORS=[
  {val:'Red',hex:'#b04a4a'},{val:'Orange',hex:'#c4683a'},{val:'Yellow',hex:'#c9a832'},
  {val:'Green',hex:'#4a8a5a'},{val:'Pink',hex:'#d4839a'},{val:'Blue',hex:'#4a7aaa'},
  {val:'Purple',hex:'#7a5a9a'},{val:'White',hex:'#d8d4ce'},{val:'Black',hex:'#3a3530'},
  {val:'Brown',hex:'#8b6f47'},{val:'Gray',hex:'#8a8a8a'},
];
const LUSTER_FN={
  glassy:    c=>['Transparent','Translucent'].some(v=>(c.tr||'').includes(v))&&!['Pyrite','Hematite','Galena','Chalcopyrite','Copper','Magnetite','Lodestone'].includes(c.n),
  silky:     c=>['Selenite','Satin Spar','Lepidolite','Muscovite','Mica','Seraphinite','Angelite',"Tiger's Eye",'Blue Tiger','Red Tiger','Ammolite'].some(n=>c.n.includes(n)),
  metallic:  c=>['Pyrite','Hematite','Galena','Chalcopyrite','Copper','Magnetite','Lodestone','Bismuth'].includes(c.n)||(c.fam||'').includes('Iron')||(c.fam||'').includes('Sulfide'),
  earthy:    c=>['Opaque','Translucent to Opaque'].some(v=>(c.tr||'').includes(v))&&['Jasper','Rhyolite','Basalt','Chert','Septarian','Stromatolite','Orthoceras','Turritella'].some(n=>c.n.includes(n)||(c.fam||'').includes(n)),
  iridescent:c=>['Labradorite','Moonstone','Opal','Ammolite','Peacock','Rainbow Obsidian','Spectrolite','Alexandrite','Bismuth','Aura'].some(n=>c.n.includes(n)),
};
const HARD_FN={
  delicate:c=>{const m=parseFloat(c.m);return m>0&&m<=4;},
  everyday:c=>{const m=parseFloat(c.m);return m>=4.5&&m<=6.5;},
  tough:   c=>{const m=parseFloat(c.m);return m>=7;},
};
const ID2_STEPS=[
  {key:'color', name:'Color',        question:'What color is it?',                        tip:null,  skippable:false, type:'color'},
  {key:'trans', name:'Transparency', question:'Transparency: Can you see through it?',    tip:'Hold the stone up to a window or light. Fully clear = transparent; glows or lets light through = translucent; no light passes at all = opaque.', skippable:true, type:'pills', options:[{label:'Clear like glass',val:'Transparent'},{label:'Light gets through',val:'Translucent'},{label:'Fully solid',val:'Opaque'}]},
  {key:'luster',name:'Luster',       question:'Luster: How does the surface look in light?', tip:'Glassy = bright mirror-like shine; silky/pearly = soft satiny sheen; metallic = catches light like metal; earthy = matte with no shine; iridescent = shifts color as you tilt.', skippable:true, type:'pills', options:[{label:'Glassy & bright',val:'glassy'},{label:'Silky or pearly',val:'silky'},{label:'Metallic',val:'metallic'},{label:'Dull or earthy',val:'earthy'},{label:'Iridescent',val:'iridescent'}]},
  {key:'hard',  name:'Hardness',     question:'Hardness: How tough is it?',               tip:'Find a hidden spot and try to scratch it with your fingernail. Scratches easily = delicate (Mohs ~2–3). Fingernail leaves no mark = everyday. Nothing scratches it = very tough (Mohs 7+).', skippable:true, type:'pills', options:[{label:'Scratches easily',val:'delicate'},{label:'Holds up well',val:'everyday'},{label:'Very scratch-proof',val:'tough'}]},
  {key:'heft',  name:'Weight',       question:'Weight: How heavy does it feel for its size?', tip:'Compare to a similarly-sized piece of glass. Most stones feel about right — but some (malachite, hematite) feel noticeably heavier, and some (selenite, howlite) feel surprisingly light.', skippable:true, type:'pills', options:[{label:'Lighter than expected',val:'light'},{label:'About right',val:'average'},{label:'Heavier than expected',val:'heavy'}]},
];
const ID2_NUMS=['①','②','③','④','⑤'];

function initId2(){
  renderId2Steps();
}

function renderId2Steps(){
  const wrap=document.getElementById('id2-steps');
  if(!wrap)return;
  wrap.innerHTML='';

  let activeIdx=0;
  // find first unanswered step
  for(let i=0;i<ID2_STEPS.length;i++){
    const s=ID2_STEPS[i];
    if(id2State[s.key]!==null){activeIdx=i+1;}
    else {activeIdx=i; break;}
    if(i===ID2_STEPS.length-1) activeIdx=ID2_STEPS.length;
  }

  // Intro guidance — appears between the Identify hero and the step progress/cards
  const intro=document.createElement('p');
  intro.className='id2-intro';
  intro.textContent='Start with what you can see. Choose the closest match for each step, or skip anything you’re unsure about. The guide will narrow the possibilities as you go.';
  wrap.appendChild(intro);

  // Progress bar — 5 step pills across the top
  const NUMS=['①','②','③','④','⑤'];
  const prog=document.createElement('div');
  prog.className='id2-progress';
  ID2_STEPS.forEach((s,i)=>{
    const pill=document.createElement('div');
    const isDone=id2State[s.key]!==null;
    const isActive=i===activeIdx;
    pill.className='id2-prog-step'+(isDone?' done':isActive?' active':' ');
    pill.innerHTML=`<span class="id2-prog-num">${NUMS[i]}</span><span>${s.name}</span>`;
    if(isDone) pill.onclick=()=>id2ChangeStep(i);
    prog.appendChild(pill);
  });
  wrap.appendChild(prog);

  // Answered steps
  for(let i=0;i<activeIdx&&i<ID2_STEPS.length;i++){
    const s=ID2_STEPS[i];
    const val=id2State[s.key];
    const displayVal = val==='__skip__' ? 'Skipped'
      : s.type==='color' ? val
      : (s.options||[]).find(o=>o.val===val)?.label || val;
    const card=document.createElement('div');
    card.className='id2-sc id2-sc--answered';
    card.innerHTML=`<div class="id2-sc-answered-row">
      <span class="id2-sc-num">${ID2_NUMS[i]}</span>
      <span class="id2-sc-aname">${s.name}</span>
      <span class="id2-sc-chip${val==='__skip__'?' id2-sc-chip--skip':''}">${displayVal}</span>
      <button class="id2-sc-change" onclick="id2ChangeStep(${i})">change</button>
    </div>`;
    wrap.appendChild(card);
  }

  // Check for zero results before showing the next step
  const hasAnyAnswer=Object.values(id2State).some(v=>v!==null&&v!=='__skip__');
  const zeroResults=hasAnyAnswer&&activeIdx>0&&getId2Results().length===0;

  // Active step — suppressed when current answers already yield zero results
  if(activeIdx<ID2_STEPS.length&&!zeroResults){
    const s=ID2_STEPS[activeIdx];
    const card=document.createElement('div');
    card.className='id2-sc id2-sc--active id2-sc-slidein' + (s.type==='color' ? ' id2-sc--color' : '');

    const tipHtml=s.tip
      ? `<span class="id2-tooltip-wrap"><button class="id2-tip-btn" tabindex="-1">?</button><span class="id2-tooltip">${s.tip}</span></span>`
      : '';

    let bodyHtml='';
    if(s.type==='color'){
      bodyHtml='<div class="id2-color-grid" id="id2-colors"></div>';
    } else {
      const pillsHtml=(s.options||[]).map(o=>
        `<button class="id2-pill" onclick="setId2('${s.key}','${o.val}',this)">${o.label}</button>`
      ).join('');
      const skipHtml=s.skippable
        ? `<button class="id2-skip-pill" onclick="id2Skip('${s.key}')">Skip →</button>`:'';
      bodyHtml=`<div class="id2-pills-row">${pillsHtml}${skipHtml}</div>`;
    }

    card.innerHTML=`<div class="id2-sc-inner">
      <div class="id2-sc-header">
        <span class="id2-sc-num">${ID2_NUMS[activeIdx]}</span>
        <span class="id2-sc-q">${s.question}${tipHtml}</span>
      </div>
      ${bodyHtml}
    </div>`;
    wrap.appendChild(card);

    if(s.type==='color') buildId2Colors();
  }

  // Zero-results recovery prompt
  if(zeroResults){
    // Build tappable chips for each answered (non-skipped) step
    const answeredChips=ID2_STEPS.slice(0,activeIdx).map((s,i)=>{
      const val=id2State[s.key];
      if(!val||val==='__skip__')return '';
      const displayVal=s.type==='color'?val:((s.options||[]).find(o=>o.val===val)?.label||val);
      return `<button class="id2-zero-chip" onclick="id2ChangeStep(${i})">${s.name}: <strong>${displayVal}</strong> <span class="id2-zero-chip-x">×</span></button>`;
    }).join('');
    const card=document.createElement('div');
    card.className='id2-sc id2-sc--zero id2-sc-slidein';
    card.innerHTML=`<div class="id2-sc-inner">
      <div class="id2-zero-icon">✦</div>
      <div class="id2-zero-title">No matches found</div>
      <div class="id2-zero-body">This combination isn't in the library. Tap any answer below to change it, or start over.</div>
      ${answeredChips?`<div class="id2-zero-chips">${answeredChips}</div>`:''}
      <button class="id2-zero-reset" onclick="clearId2()">Clear all and start over</button>
    </div>`;
    wrap.appendChild(card);
    // Scroll zero-state card into view
    setTimeout(()=>card.scrollIntoView({behavior:'smooth',block:'nearest'}),60);
  }

  runId2Results();
}

function buildId2Colors(){
  const grid=document.getElementById('id2-colors');
  if(!grid||grid.children.length>0)return;
  ID2_COLORS.forEach(col=>{
    const btn=document.createElement('button');
    btn.className='id2-color-btn'; btn.title=col.val;
    const gradient=(typeof stoneDotGradient==='function')?stoneDotGradient(col.hex,[]):col.hex;
    const borderColor=col.val==='White'?'var(--border)':'rgba(42,37,32,0.14)';
    btn.style.cssText=`background:${gradient};border-color:${borderColor}`;
    if(id2State.color===col.val){btn.classList.add('active');}
    btn.onclick=()=>{
      id2State.color=col.val;
      renderId2Steps();
    };
    grid.appendChild(btn);
  });
}

function setId2(type,val,el){
  id2State[type]=val;
  renderId2Steps();
}

function id2Skip(type){
  id2State[type]='__skip__';
  renderId2Steps();
}

function id2ChangeStep(idx){
  const s=ID2_STEPS[idx];
  // Clear this step and all after it
  for(let i=idx;i<ID2_STEPS.length;i++) id2State[ID2_STEPS[i].key]=null;
  renderId2Steps();
}

function id2CardHtml(c){
  const base=stripInlineCardColor(encCardHtml(c)).replace(/onclick="openDetail\(/g,'onclick="openDetailFromIdentify(');
  const themes=(c.all_themes||[]).filter(Boolean).slice(0,3);
  if(!themes.length)return base;
  const tags=`<div class="id2-theme-tags">${themes.map(t=>`<span class="id2-theme-tag">${escapeAttr(t)}</span>`).join('')}</div>`;
  return base.slice(0,-12)+tags+'</div></div>';
}

function getId2Results(){
  return CRYSTALS.filter(c=>{
    if(id2State.color&&id2State.color!=='__skip__'&&!(c.col_cats&&c.col_cats.includes(id2State.color)))return false;
    if(id2State.trans&&id2State.trans!=='__skip__'){
      const m={Transparent:['Transparent','Transparent to Translucent'],Translucent:['Translucent','Transparent to Translucent','Translucent to Opaque'],Opaque:['Opaque','Translucent to Opaque']};
      if(!c.tr||!m[id2State.trans].some(v=>c.tr.includes(v)))return false;
    }
    if(id2State.luster&&id2State.luster!=='__skip__'&&LUSTER_FN[id2State.luster]&&!LUSTER_FN[id2State.luster](c))return false;
    if(id2State.hard&&id2State.hard!=='__skip__'&&HARD_FN[id2State.hard]&&!HARD_FN[id2State.hard](c))return false;
    if(id2State.heft&&id2State.heft!=='__skip__'&&HEFT_FN[id2State.heft]&&!HEFT_FN[id2State.heft](c))return false;
    return true;
  }).sort((a,b)=>(Number(a.tier)||9)-(Number(b.tier)||9)||a.n.localeCompare(b.n));
}

function runId2Results(){
  const hasFilter=Object.values(id2State).some(v=>v!==null&&v!=='__skip__');
  const grid=document.getElementById('id2-grid');
  const bar=document.getElementById('id2-result-bar');
  if(!hasFilter){
    if(grid)grid.style.display='none';
    if(bar)bar.style.display='none';
    return;
  }
  // If the zero-state card is showing, hide the result bar — it's redundant
  if(document.querySelector('.id2-sc--zero')){
    if(grid)grid.style.display='none';
    if(bar)bar.style.display='none';
    return;
  }
  if(grid)grid.style.display='';
  if(bar)bar.style.display='';

  const results=getId2Results();
  const n=results.length;
  const countEl=document.getElementById('id2-count');
  if(countEl)countEl.innerHTML=`Possible matches <strong style="color:var(--ink);margin-left:4px">${n}</strong>`;
  const g=document.getElementById('id2-grid');
  if(!g)return;
  const previousId2LoadMore=document.getElementById('id2-load-more');
  if(previousId2LoadMore){previousId2LoadMore.style.display='none';previousId2LoadMore.innerHTML='';}
  if(n){
    renderPagedStoneList({
      stones:results,
      container:g,
      stateKey:'id2-results',
      renderCard:id2CardHtml,
      batchSize:10,
      loadMoreContainer:ensureStoneListLoadMore(g,'id2-load-more')
    });
    return;
  }
  g.innerHTML='<div class="id2-empty">No stones match — try removing a filter.</div>';
}

function clearId2(){
  id2State={color:null,trans:null,luster:null,hard:null,heft:null};
  const loadMore=document.getElementById('id2-load-more');
  if(loadMore){loadMore.style.display='none';loadMore.innerHTML='';}
  renderId2Steps();
}

