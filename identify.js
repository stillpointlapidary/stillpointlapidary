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
  const base=encCardHtml(c).replace(/onclick="openDetail\(/g,'onclick="openDetailFromIdentify(');
  const themes=(c.all_themes||[]).filter(Boolean).slice(0,3);
  if(!themes.length)return base;
  const tags=`<div class="mood-theme-tags">${themes.map(t=>`<span class="mood-theme-tag">${escapeAttr(t)}</span>`).join('')}</div>`;
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

