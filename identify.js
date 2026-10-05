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
// Hardness step: a fingernail is roughly Mohs 2.5. Mohs values are text (single numbers, ranges like
// "3.5–4" or "2.5–4 variable", or blank). Missing data is not evidence, so a stone with no usable value stays
// eligible for both answers; a range that straddles 2.5 is ambiguous and also stays eligible for both.
const FINGERNAIL_MOHS=2.5;
function mohsRange(c){
  const n=(String(c.m||'').match(/\d+(?:\.\d+)?/g)||[]).map(Number);
  return n.length?{lo:Math.min(...n),hi:Math.max(...n)}:null;
}
const HARD_FN={
  mark:  c=>{const r=mohsRange(c);return !r||r.lo<FINGERNAIL_MOHS;},
  nomark:c=>{const r=mohsRange(c);return !r||r.hi>=FINGERNAIL_MOHS;},
};
const ID2_STEPS=[
  {key:'color', name:'Color',        question:'What color is it?',                        tip:null,  skippable:false, type:'color'},
  {key:'trans', name:'Transparency', question:'Transparency: Can you see through it?',    tip:'Hold the stone up to a window or light. Fully clear = transparent; glows or lets light through = translucent; no light passes at all = opaque.', skippable:true, type:'pills', options:[{label:'Clear like glass',val:'Transparent'},{label:'Light gets through',val:'Translucent'},{label:'Fully solid',val:'Opaque'}]},
  {key:'luster',name:'Luster',       question:'Luster: How does the surface look in light?', tip:'Glassy = bright mirror-like shine; silky/pearly = soft satiny sheen; metallic = catches light like metal; earthy = matte with no shine; iridescent = shifts color as you tilt.', skippable:true, type:'pills', options:[{label:'Glassy & bright',val:'glassy'},{label:'Silky or pearly',val:'silky'},{label:'Metallic',val:'metallic'},{label:'Dull or earthy',val:'earthy'},{label:'Iridescent',val:'iridescent'}]},
  {key:'hard',  name:'Hardness',     question:'Hardness: Does a fingernail leave a mark?',     tip:'<strong>Optional hardness check</strong> If you\'re comfortable testing it, choose an inconspicuous spot and gently see whether a fingernail leaves a mark. Skip this if the piece is delicate, valuable, polished, or you simply don\'t want to test it.', skippable:true, type:'pills', options:[{label:'A fingernail leaves a mark',val:'mark'},{label:'No mark',val:'nomark'},{label:'I\'d rather not test it',val:'__skip__'}]},
  {key:'heft',  name:'Weight',       question:'Weight: How heavy does it feel for its size?', tip:'Compare to a similarly-sized piece of glass. Most stones feel about right — but some (malachite, hematite) feel noticeably heavier, and some (selenite, howlite) feel surprisingly light.', skippable:true, type:'pills', options:[{label:'Lighter than expected',val:'light'},{label:'About right',val:'average'},{label:'Heavier than expected',val:'heavy'}]},
];
const ID2_NUMS=['①','②','③','④','⑤'];

function initId2(){
  renderId2Steps();
  pidRender();
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



// ── PHOTO ID BETA ──
// Client for the photo-id edge function. The server owns every limit (photos, one photo retry,
// two questions, four calls, monthly budget); this code only reflects what the server allows.
// Photos live in memory only: they are resized to JPEG in the browser (which also drops EXIF/GPS),
// sent with each analysis request, and discarded on "Try another stone" or page close.
const PID_ENDPOINT='https://vxujlgyhgnihnqrxzefw.supabase.co/functions/v1/photo-id';
const PID_KEY='sb_publishable_LfVL1UL-_8_8hXQktiF1BQ_UgbWvAPb';
const PID_MAX_PHOTOS=3;
const PID_MAX_RAW_BYTES=25*1024*1024;
const PID_MAX_EDGE=1568;
const PID_TIMEOUT_MS=90000;
const PID_ACCEPT='image/jpeg,image/png,image/webp,image/heic,image/heif';
const PID_CONF_LABELS={strong:'Strong visual match',good:'Good visual match',tentative:'Tentative match',more_information_needed:'More information needed'};

function pidFresh(){
  return {phase:'upload',images:[],baseImages:null,changed:false,replaceIdx:null,sessionId:null,
    data:null,error:null,notice:'',lastReq:null,sel:null};
}
let pid=pidFresh();

function pidEsc(v){
  return String(v==null?'':v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
}

function pidThumbsHtml(opts){
  opts=opts||{};
  return `<div class="pid-thumbs${opts.extra?' pid-thumbs--row':''}">${pid.images.map((im,i)=>`<div class="pid-thumb">
    <img src="${im.dataUrl}" alt="Photo ${i+1} of your stone">
    ${opts.remove?`<button type="button" class="pid-thumb-x" onclick="pidRemove(${i})" aria-label="Remove photo ${i+1}">×</button>`:''}
    ${opts.replace?`<button type="button" class="pid-thumb-replace" onclick="pidPickReplace(${i})">Replace</button>`:''}
  </div>`).join('')}${opts.extra||''}</div>`;
}

function pidGuidedLink(){
  return `<button type="button" class="btn btn-accent pid-btn" onclick="pidToGuided()">Use the Guided Identifier →</button>`;
}

function pidToGuided(){
  const el=document.getElementById('id2-guided-top');
  if(el)el.scrollIntoView({behavior:'smooth',block:'start'});
}

function pidRender(){
  const body=document.getElementById('pid-body');
  if(!body)return;
  const f=pid.phase;
  const sec=document.getElementById('pid');
  const leftEl=document.getElementById('pid-left-body');
  const altsEl=document.getElementById('pid-alts');
  const footEl=document.getElementById('pid-foot');
  const titleEl=document.getElementById('pid-heading');
  const m=f==='result'?pidExplorerModel():null;
  if(titleEl)titleEl.textContent=m?'Photo ID':'Identify from a photo';
  if(sec){sec.classList.toggle('pid--result',!!m);if(!m)sec.classList.remove('pid--tie-open');}
  if(m){
    const x=pidRenderExplorer(m);
    if(sec)sec.classList.toggle('pid--tie-open',!!x.open);
    if(leftEl)leftEl.innerHTML=x.left;
    body.innerHTML=x.right;
    if(altsEl)altsEl.innerHTML=x.alts;
    if(footEl)footEl.innerHTML=x.foot;
    return;
  }
  if(leftEl)leftEl.innerHTML='';
  if(altsEl)altsEl.innerHTML='';
  if(footEl)footEl.innerHTML='';
  let h='';
  if(f==='upload')h=pidUploadHtml();
  else if(f==='analyzing')h=pidAnalyzingHtml();
  else if(f==='photo')h=pidPhotoRequestHtml();
  else if(f==='question')h=pidQuestionHtml();
  else if(f==='result')h=pidResultHtml();
  else if(f==='error')h=pidErrorHtml();
  body.innerHTML=h;
  pidFitOptions();
}

function pidUploadHtml(){
  const n=pid.images.length;
  const full=n>=PID_MAX_PHOTOS;
  const slots=[0,1,2].map(i=>pid.images[i]
    ?`<div class="pid-thumb pid-slot pid-slot--filled"><img src="${pid.images[i].dataUrl}" alt="Photo ${i+1} of your stone"><button type="button" class="pid-thumb-x" onclick="pidRemove(${i})" aria-label="Remove photo ${i+1}">×</button></div>`
    :`<div class="pid-slot" aria-hidden="true"><svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"><rect x="3.5" y="5" width="17" height="14" rx="2"/><circle cx="9" cy="10.5" r="1.6"/><path d="M4 17l5-4.5 3.5 3L16 12l4 4.5"/></svg><span>Photo ${i+1}</span></div>`).join('');
  return `<div class="pid-work">
    <div class="pid-photos">
      ${full?`<div class="pid-drop pid-drop--full"><span class="pid-drop-main">${n} of ${PID_MAX_PHOTOS} photos · Maximum reached</span></div>`:`<label class="pid-drop" id="pid-drop" ondragover="pidDrag(event,true)" ondragleave="pidDrag(event,false)" ondrop="pidDrop(event)">
        <input type="file" id="pid-file" accept="${PID_ACCEPT}" multiple onchange="pidFiles(this.files);this.value=''">
        <svg class="pid-drop-icon" viewBox="0 0 24 24" width="30" height="30" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 8.5A1.5 1.5 0 0 1 5.5 7h2l1.4-2h6.2l1.4 2h2A1.5 1.5 0 0 1 20 8.5v9a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 4 17.5z"/><circle cx="12" cy="13" r="3.2"/></svg>
        <span class="pid-drop-main">${n?'Add another photo':'Choose photos'}</span>
        <span class="pid-drop-sub">or drop them here</span>
      </label>`}
      <div class="pid-rail">${slots}</div>
      ${full?'':`<div class="pid-count pid-photos-count">${n} of ${PID_MAX_PHOTOS} photos</div>`}
      <div class="pid-actions pid-photos-act"><button type="button" class="btn btn-accent pid-btn" onclick="pidSubmit()" ${n?'':'disabled'}>Analyze my stone</button></div>
    </div>
    ${pid.notice?`<div class="pid-notice" role="alert">${pidEsc(pid.notice)}</div>`:''}
  </div>`;
}
function pidAnalyzingHtml(){
  return `<div class="pid-wait" role="status"><span class="pid-spinner" aria-hidden="true"></span><span>Looking closely at your stone…</span></div>${pid.images.length?pidThumbsHtml():''}`;
}

function pidRetryTile(){
  return `<label class="pid-drop pid-drop--tile" id="pid-drop" ondragover="pidDrag(event,true)" ondragleave="pidDrag(event,false)" ondrop="pidDrop(event)"><input type="file" accept="${PID_ACCEPT}" onchange="pidFiles(this.files);this.value=''"><svg class="pid-drop-icon" viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 8.5A1.5 1.5 0 0 1 5.5 7h2l1.4-2h6.2l1.4 2h2A1.5 1.5 0 0 1 20 8.5v9a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 4 17.5z"/><circle cx="12" cy="13" r="3.2"/></svg><span class="pid-drop-main">Add a sharper photo</span><span class="pid-drop-sub">or drop it here</span></label>`;
}

function pidPhotoRequestHtml(){
  const d=pid.data||{};
  const n=pid.images.length;
  const canAdd=!pid.changed&&n<PID_MAX_PHOTOS;
  return `<div class="pid-step">
    <h3 class="pid-step-title">One more look would help</h3>
    <p class="pid-copy">${pidEsc([d.photo_problem,d.photo_guidance].filter(Boolean).join(' '))}</p>
    <div class="pid-work">
      ${pidThumbsHtml({replace:!pid.changed,remove:true,extra:canAdd?pidRetryTile():''})}
      <input type="file" id="pid-replace-file" class="pid-hidden-file" accept="${PID_ACCEPT}" onchange="pidReplaceFile(this.files);this.value=''">
      <div class="pid-count">${pid.changed?'Photo updated.':(n>=PID_MAX_PHOTOS?'Replace one photo with a better one.':'Add one photo, or replace one of yours.')}</div>
      ${pid.notice?`<div class="pid-notice" role="alert">${pidEsc(pid.notice)}</div>`:''}
      <div class="pid-actions">
        <button type="button" class="btn btn-accent pid-btn" onclick="pidSubmit()" ${pid.changed&&n>0?'':'disabled'}>Analyze again</button>
        ${pid.changed?`<button type="button" class="pid-link" onclick="pidUndoChange()">Undo change</button>`:''}
      </div>
    </div>
  </div>`;
}

function pidFitOptions(){
  const row=document.querySelector('#pid-body .pid-options');
  if(!row)return;
  row.classList.remove('pid-options--2x2');
  const b=Array.from(row.children);
  if(b.length===4&&new Set(b.map(x=>x.offsetTop)).size>1)row.classList.add('pid-options--2x2');
}
window.addEventListener('resize',pidFitOptions);
if(document.fonts&&document.fonts.ready)document.fonts.ready.then(pidFitOptions);

function pidQuestionHtml(){
  const d=pid.data||{};
  return `<div class="pid-step">
    <div class="pid-count pid-count--top">Question ${d.question_number||1}</div>
    <h3 class="pid-step-title">${pidEsc(d.question)}</h3>
    <div class="id2-pills-row pid-options">${(d.answer_options||[]).map((o,i)=>`<button type="button" class="id2-pill pid-pill" onclick="pidAnswer(${i})">${pidEsc(o)}</button>`).join('')}</div>
  </div>
  ${pidThumbsHtml()}`;
}

// ── Result explorer ──
// Presentation only: reflects the returned result, never alters, re-ranks or re-queries it.
// Alternatives currently arrive as plain names; objects ({name, reason, encyclopedia}) are also accepted
// so richer data renders if the function ever returns it.
function pidCand(x,key){
  const o=typeof x==='string'?{name:x}:(x||{});
  return {key:key,name:o.name||'',reason:o.reason||'',enc:o.encyclopedia||null};
}

function pidRefSrc(enc){
  if(!enc||typeof ENCYCLOPEDIA_PHOTOS==='undefined'||typeof SUPABASE_ENC==='undefined')return '';
  const f=(ENCYCLOPEDIA_PHOTOS[enc.id]||[])[0];
  return f?SUPABASE_ENC+f:'';
}

function pidExplorerModel(){
  const r=pid.data&&pid.data.result;
  if(!r)return null;
  if(r.photo_limit_reached)return {mode:'bad',r:r};
  const alts=(r.alternatives||[]).map((a,i)=>pidCand(a,'a'+i)).filter(c=>c.name);
  if(r.best_match&&r.confidence!=='more_information_needed'){
    const best=Object.assign(pidCand(r.best_match,'best'),{enc:r.encyclopedia||null,best:true});
    const all=[best].concat(alts);
    const main=all.find(c=>c.key===pid.sel)||best;
    return {mode:'win',r:r,main:main,others:all.filter(c=>c!==main)};
  }
  const cands=[];
  if(r.best_match)cands.push(pidCand(r.best_match,'t0'));
  alts.forEach(a=>{if(!cands.some(c=>c.name===a.name))cands.push(Object.assign(a,{key:'t'+cands.length}));});
  const list=cands.slice(0,3);
  if(!list.length)return null;
  return {mode:'tie',r:r,cands:list,sel:list.find(c=>c.key===pid.sel)||null};
}

function pidSelect(key){
  const r=pid.data&&pid.data.result;
  const tie=r&&(!r.best_match||r.confidence==='more_information_needed');
  // Promote in a winner result; toggle selection in a no-winner result (nothing is ever relabelled "best")
  pid.sel=(tie&&pid.sel===key)?null:key;
  pidRender();
}

function pidAddToCollection(id){
  // Same path as the Quick View "Add to collection" pill (sign-in prompt, add form, owned handling)
  const c=(typeof CRYSTALS!=='undefined')&&CRYSTALS.find(x=>x.i===id);
  if(!c)return;
  currentCrystal=c;
  drawerCollectionAction();
}

// Same ownership test and labels as Quick View (updateDrawerStatus): owned -> "In your collection"
function pidOwned(id){
  return !!(typeof _currentUser!=='undefined'&&_currentUser&&typeof owned!=='undefined'&&owned[id]);
}

function pidSyncCollection(){
  document.querySelectorAll('.pid-coll').forEach(b=>{
    const on=pidOwned(b.dataset.stone);
    b.classList.toggle('drawer-pill-active',on);
    const l=b.querySelector('.drawer-pill-label');
    if(l)l.textContent=on?'In your collection':'Add to collection';
  });
}
// Keep the control truthful whenever Quick View's own state refreshes (sign-in, add, remove)
if(typeof updateDrawerStatus==='function'){
  const _pidUds=updateDrawerStatus;
  updateDrawerStatus=function(){const r=_pidUds.apply(this,arguments);pidSyncCollection();return r;};
}

function pidAddHtml(enc){
  if(typeof CRYSTALS==='undefined'||!CRYSTALS.some(x=>x.i===enc.id))return '';
  const isOwned=pidOwned(enc.id);
  return `<button type="button" data-stone="${pidEsc(enc.id)}" class="drawer-pill pid-coll${isOwned?' drawer-pill-active':''}" onclick="pidAddToCollection(${pidEsc(JSON.stringify(enc.id))})"><span class="pid-heart" aria-hidden="true"><span class="enc-icon icon-add-piece"></span></span><span class="drawer-pill-label">${isOwned?'In your collection':'Add to collection'}</span></button>`;
}

function pidExploreHtml(enc){
  return (enc.full_entry&&enc.slug)
    ?`<a class="btn btn-accent pid-btn" href="stones/stone.html?slug=${encodeURIComponent(enc.slug)}">Explore ${pidEsc(enc.name)} →</a>`
    :`<button type="button" class="btn btn-accent pid-btn" onclick="openDetailFromIdentify(${pidEsc(JSON.stringify(enc.id))})">Explore ${pidEsc(enc.name)} →</button>`;
}

function pidResActionsHtml(c){
  let h='';
  if(c&&c.enc)h=`<div class="pid-actions-row">${pidExploreHtml(c.enc)}${pidAddHtml(c.enc)}</div>`;
  else if(c&&c.best)h=`<div class="pid-quiet">Not currently in the Still Point Encyclopedia.</div>`;
  return h;
}

function pidNoRefIcon(size){
  return `<svg viewBox="0 0 24 24" width="${size}" height="${size}" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3.5" y="5" width="17" height="14" rx="2"/><circle cx="9" cy="10.5" r="1.6"/><path d="M4 17l5-4.5 3.5 3L16 12l4 4.5"/></svg>`;
}

// c = a selected candidate: approved reference photo, else a neutral placeholder.
// c = null: the visitor's own photo shown as evidence (no-winner overview, bad-photo state).
function pidRefHtml(c){
  if(!c){
    const mine=pid.images[0]&&pid.images[0].dataUrl;
    return mine?`<figure class="pid-ref"><img src="${pidEsc(mine)}" alt="Your submitted photo of the stone"><figcaption>Your photo</figcaption></figure>`:'';
  }
  const ref=c.enc?pidRefSrc(c.enc):'';
  if(ref)return `<figure class="pid-ref"><img src="${pidEsc(ref)}" alt="${pidEsc(c.name)} reference photo"><figcaption>Still Point reference photo</figcaption></figure>`;
  return `<figure class="pid-ref pid-ref--none"><div class="pid-noref" role="img" aria-label="No reference image">${pidNoRefIcon(28)}<span>No reference image</span></div></figure>`;
}

// Concise rationale for the original best match once it sits in the alternates area:
// the first sentence of the existing "what we're seeing" text, else the first returned visual clues.
function pidBestRationale(){
  const r=(pid.data&&pid.data.result)||{};
  const t=(r.what_we_are_seeing||'').trim();
  if(t){const m=t.match(/^.*?[.!?](?=\s|$)/);return m?m[0]:t;}
  return (r.observed_features||[]).filter(Boolean).slice(0,2).join(' · ');
}

function pidAltCard(c,label,on){
  const ref=c.enc?pidRefSrc(c.enc):'';
  const reason=c.best?pidBestRationale():c.reason;
  const thumb=ref
    ?`<span class="pid-alt-thumb"><img src="${pidEsc(ref)}" alt=""></span>`
    :`<span class="pid-alt-thumb pid-alt-thumb--none">${pidNoRefIcon(18)}<span class="pid-alt-nonetx">No reference image</span></span>`;
  return `<button type="button" class="pid-alt${on?' pid-alt--on':''}" onclick="pidSelect('${c.key}')"${on?' aria-pressed="true"':''}>
    ${thumb}
    <span class="pid-alt-tx"><span class="pid-label">${label}</span><span class="pid-alt-name">${pidEsc(c.name)}</span>${reason?`<span class="pid-alt-reason${c.best?' pid-alt-reason--best':''}">${pidEsc(reason)}</span>`:''}</span>
  </button>`;
}

function pidCluesHtml(r){
  const f=(r.observed_features||[]).filter(Boolean).slice(0,4);
  return f.length?`<div class="pid-block"><div class="pid-label">Key visual clues</div><ul class="pid-list pid-clues">${f.map(x=>`<li>${pidEsc(x)}</li>`).join('')}</ul></div>`:'';
}

// One template for every selected candidate: best match, alternative, or possibility.
function pidDetailHtml(r,c,label,pillText,pillCls){
  // What we're seeing, the confirmation note and the Identity Note are authored around the best match, so only that view shows them
  const seeing=c.best&&r.what_we_are_seeing?`<div class="pid-block"><div class="pid-label">What we're seeing</div><p>${pidEsc(r.what_we_are_seeing)}</p></div>`:'';
  const why=(!c.best&&c.reason)?`<div class="pid-block"><div class="pid-label">Why it remains possible</div><p>${pidEsc(c.reason)}</p></div>`:'';
  const confirm=c.best&&r.confirmation_note?`<div class="pid-block"><div class="pid-label">What would help confirm it</div><p>${pidEsc(r.confirmation_note)}</p></div>`:'';
  const note=c.best&&r.identity_note?`<div class="pid-block pid-identity"><div class="pid-label">Identity note</div><p>${pidEsc(r.identity_note)}</p></div>`:'';
  return `<div class="pid-res">${label?`<div class="pid-label">${label}</div>`:''}<h3 class="pid-match">${pidEsc(c.name)}</h3>
    <div class="pid-conf-row"><span class="pid-conf pid-conf--${pidEsc(pillCls)}">${pidEsc(pillText)}</span></div>
    ${why}${seeing}${pidCluesHtml(r)}${confirm}${note}</div>`;
}

function pidRenderExplorer(m){
  const r=m.r;
  let left,right='',alts='';
  if(m.mode==='bad'){
    left=`<div class="pid-res"><h3 class="pid-step-title">We don't have enough visual detail to identify this reliably.</h3>
      ${r.photo_problem?`<p class="pid-copy">${pidEsc(r.photo_problem)}</p>`:''}
      ${r.what_we_are_seeing?`<div class="pid-block"><div class="pid-label">What we can see</div><p>${pidEsc(r.what_we_are_seeing)}</p></div>`:''}
      <p class="pid-copy">We can't reliably narrow it further from the available visual evidence.</p>
      <p class="pid-copy">You can still keep narrowing it down with the Guided Identifier, which uses characteristics you can observe directly.</p>
      <div class="pid-guided-cta">${pidGuidedLink()}</div></div>`;
    right=pidRefHtml(null);
  }else if(m.mode==='win'){
    const c=m.main;
    left=c.best
      ?pidDetailHtml(r,c,'',PID_CONF_LABELS[r.confidence]||'',r.confidence)
      :pidDetailHtml(r,c,'Viewing alternative','Possible match','possible');
    right=pidRefHtml(c.best&&!c.enc?null:c)+pidResActionsHtml(c);
    const inline=m.others.length===1;
    if(inline)left+=`<div class="pid-alt-inline">${pidAltCard(m.others[0],m.others[0].best?'Best visual match':'Also possible',false)}</div>`;
    alts=(m.others.length&&!inline)?`<div class="pid-alts-row pid-alts-row--${Math.min(m.others.length,3)}">${m.others.map(o=>pidAltCard(o,o.best?'Best visual match':'Also possible',false)).join('')}</div>`:'';
  }else{
    const s=m.sel;
    if(s){
      left=pidDetailHtml(r,Object.assign({tie:true},s),'Viewing possibility','Possible match','possible');
      right=pidRefHtml(s)+pidResActionsHtml(s);
    }else{
      left=`<div class="pid-res"><div class="pid-label">Leading possibilities</div>
        <h3 class="pid-step-title pid-tie-title">We've narrowed it down, but can't reliably choose one from the available evidence.</h3>
        ${r.what_we_are_seeing?`<div class="pid-block"><div class="pid-label">What we're seeing</div><p>${pidEsc(r.what_we_are_seeing)}</p></div>`:''}
        ${pidCluesHtml(r)}
        <p class="pid-copy">No distinguishing feature is strong enough to select one confidently.</p></div>`;
      right=pidRefHtml(null);
    }
    alts=`<div class="pid-alts-row pid-alts-row--${m.cands.length}">${m.cands.map(o=>pidAltCard(o,'Possible match',s&&s.key===o.key)).join('')}</div>`;
  }
  return {left:left,right:right,alts:alts,open:m.mode==='tie'&&!m.sel,foot:'<button type="button" class="pid-link" onclick="pidReset()">Try another stone</button>'};
}

function pidResultHtml(){
  const r=(pid.data&&pid.data.result)||{};
  const thumbs=pid.images.length?pidThumbsHtml():'';
  const again=`<div class="pid-again"><button type="button" class="pid-link" onclick="pidReset()">Try another stone</button></div>`;
  const seeing=r.what_we_are_seeing?`<div class="pid-block"><div class="pid-label">What we're seeing</div><p>${pidEsc(r.what_we_are_seeing)}</p></div>`:'';

  // Terminal pattern: usable photographic evidence could not be obtained
  if(r.photo_limit_reached){
    return `<div class="pid-result">${thumbs}
      <h3 class="pid-step-title">We don't have enough visual detail to identify this reliably.</h3>
      ${r.photo_problem?`<p class="pid-copy">${pidEsc(r.photo_problem)}</p>`:''}
      ${r.what_we_are_seeing?`<div class="pid-block"><div class="pid-label">What we can see</div><p>${pidEsc(r.what_we_are_seeing)}</p></div>`:''}
      <p class="pid-copy">We can't reliably narrow it further from the available visual evidence.</p>
      <div class="pid-handoff"><div class="pid-handoff-title">Want to keep investigating?</div>
        <p class="pid-copy">Our Guided Identifier uses characteristics you can observe directly, so you may be able to narrow the possibilities without another photo.</p>
        ${pidGuidedLink()}</div>
      ${again}</div>`;
  }

  const hasWinner=r.best_match&&r.confidence!=='more_information_needed';
  if(!hasWinner){
    const cands=[];
    if(r.best_match)cands.push(r.best_match);
    (r.alternatives||[]).forEach(a=>{if(cands.indexOf(a)<0)cands.push(a);});
    const list=cands.slice(0,3);
    return `<div class="pid-result">${thumbs}
      <h3 class="pid-step-title">${list.length?"We've narrowed it down, but can't reliably choose one from the available evidence.":"We couldn't reliably identify this from the available evidence."}</h3>
      ${seeing}
      ${list.length?`<div class="pid-block"><div class="pid-label">Leading possibilities</div><ul class="pid-list">${list.map(n=>`<li>${pidEsc(n)}</li>`).join('')}</ul>
        <p class="pid-copy">No distinguishing feature is strong enough to select one confidently.</p></div>`:''}
      ${again}</div>`;
  }

  const enc=r.encyclopedia;
  const explore=enc
    ?(enc.full_entry&&enc.slug
        ?`<a class="btn btn-accent pid-btn" href="stones/stone.html?slug=${encodeURIComponent(enc.slug)}">Explore ${pidEsc(enc.name)} →</a>`
        :`<button type="button" class="btn btn-accent pid-btn" onclick="openDetailFromIdentify(${pidEsc(JSON.stringify(enc.id))})">Explore ${pidEsc(enc.name)} →</button>`)
    :`<div class="pid-quiet">Not currently in the Still Point Encyclopedia.</div>`;
  const alts=(r.alternatives||[]).slice(0,3);
  return `<div class="pid-result">${thumbs}
    <div class="pid-match-row"><span class="pid-label">Best visual match</span><h3 class="pid-match">${pidEsc(r.best_match)}</h3></div>
    <div class="pid-conf-row"><span class="pid-label">Confidence</span><span class="pid-conf pid-conf--${pidEsc(r.confidence)}">${pidEsc(PID_CONF_LABELS[r.confidence]||'')}</span></div>
    ${seeing}
    ${alts.length?`<div class="pid-block"><div class="pid-label">Also possible</div><ul class="pid-list">${alts.map(n=>`<li>${pidEsc(n)}</li>`).join('')}</ul></div>`:''}
    ${r.confirmation_note?`<div class="pid-block"><div class="pid-label">What would help confirm it</div><p>${pidEsc(r.confirmation_note)}</p></div>`:''}
    ${r.identity_note?`<div class="pid-block pid-identity"><div class="pid-label">Identity note</div><p>${pidEsc(r.identity_note)}</p></div>`:''}
    <div class="pid-actions">${explore}</div>
    ${again}</div>`;
}

const PID_ERRORS={
  budget:{title:'Photo ID is taking a short break.',copy:'Photo identification is temporarily unavailable. In the meantime, the Guided Identifier can help you narrow down your stone using visible characteristics.',guided:true},
  rate_limited:{title:'Photo ID needs a short pause.',copy:'Photo ID capacity is currently 6 new identifications per hour and 20 per day. You can try again later, or use the Guided Identifier now.',guided:true},
  session_limit:{title:'This identification has reached its limit.',copy:'Photo ID can only take a few steps per stone. You can use the Guided Identifier to keep narrowing it down.',guided:true,again:true},
  session_not_found:{title:'This identification has ended.',copy:'You can start again with the same stone or a new one.',again:true},
  bad_image_count:{title:'Please choose between 1 and 3 photos.',copy:'',back:true},
  unsupported_image:{title:"We couldn't use one of those photos.",copy:'Please use a JPG, PNG, WebP, or HEIC image.',back:true},
  image_too_large:{title:'One of those photos is too large.',copy:'Please try a smaller image.',back:true},
  _default:{title:"Photo ID couldn't finish this analysis.",copy:'Something went wrong on our side. You can try again in a moment, or use the Guided Identifier instead.',retry:true,guided:true}
};

function pidErrorHtml(){
  const e=PID_ERRORS[pid.error]||PID_ERRORS._default;
  return `<div class="pid-step pid-error">
    <h3 class="pid-step-title">${pidEsc(e.title)}</h3>
    ${e.copy?`<p class="pid-copy">${pidEsc(e.copy)}</p>`:''}
    <div class="pid-actions">
      ${e.retry&&pid.lastReq?`<button type="button" class="btn pid-btn" onclick="pidRetryLast()">Try again</button>`:''}
      ${e.back?`<button type="button" class="btn pid-btn" onclick="pidBackFromError()">Back to my photos</button>`:''}
      ${e.guided?pidGuidedLink():''}
    </div>
    ${e.again?`<div class="pid-again"><button type="button" class="pid-link" onclick="pidReset()">Try another stone</button></div>`:''}
  </div>`;
}

function pidBackFromError(){
  pid.phase=pid.sessionId&&pid.baseImages?'photo':'upload';
  pid.error=null;
  pidRender();
}

function pidReset(){
  pid=pidFresh();
  pidRender();
  const el=document.getElementById('pid');
  if(el)el.scrollIntoView({behavior:'smooth',block:'start'});
}

// ── Photo intake ──
function pidDrag(e,on){
  e.preventDefault();
  const d=document.getElementById('pid-drop');
  if(d)d.classList.toggle('pid-drop--over',on);
}
function pidDrop(e){
  e.preventDefault();
  pidDrag(e,false);
  if(e.dataTransfer&&e.dataTransfer.files)pidFiles(e.dataTransfer.files);
}

function pidLoadImage(file){
  return new Promise((resolve,reject)=>{
    const url=URL.createObjectURL(file);
    const img=new Image();
    img.onload=()=>{URL.revokeObjectURL(url);resolve(img);};
    img.onerror=()=>{URL.revokeObjectURL(url);reject(new Error('decode'));};
    img.src=url;
  });
}

async function pidNormalize(file){
  const okType=/^image\/(jpeg|png|webp|heic|heif)$/i.test(file.type)||/\.(jpe?g|png|webp|heic|heif)$/i.test(file.name||'');
  if(!okType)throw new Error('type');
  if(file.size>PID_MAX_RAW_BYTES)throw new Error('size');
  const img=await pidLoadImage(file).catch(()=>{throw new Error('type');});
  const w=img.naturalWidth,h=img.naturalHeight;
  if(!w||!h)throw new Error('type');
  const scale=Math.min(1,PID_MAX_EDGE/Math.max(w,h));
  const c=document.createElement('canvas');
  c.width=Math.round(w*scale);c.height=Math.round(h*scale);
  const ctx=c.getContext('2d');
  ctx.fillStyle='#fff';ctx.fillRect(0,0,c.width,c.height);
  ctx.drawImage(img,0,0,c.width,c.height);
  return {dataUrl:c.toDataURL('image/jpeg',0.86),name:file.name||'photo'};
}

function pidIntakeNotice(err){
  return err&&err.message==='size'
    ?'That photo is too large. Please try a smaller image.'
    :"We couldn't use that file. Please use a JPG, PNG, WebP, or HEIC photo.";
}

async function pidFiles(fileList){
  const files=Array.from(fileList||[]);
  if(!files.length)return;
  pid.notice='';
  if(pid.phase==='photo'){
    // One additional photo only
    try{
      pid.images.push(await pidNormalize(files[0]));
      pid.changed=true;
    }catch(e){pid.notice=pidIntakeNotice(e);}
    pidRender();
    return;
  }
  const room=Math.max(PID_MAX_PHOTOS-pid.images.length,0);
  if(files.length>room)pid.notice=`You can add up to ${PID_MAX_PHOTOS} photos. We kept the first ${room}.`;
  for(const f of files.slice(0,room)){
    try{pid.images.push(await pidNormalize(f));}
    catch(e){pid.notice=pidIntakeNotice(e);}
  }
  pidRender();
}

function pidRemove(i){
  pid.images.splice(i,1);
  pid.notice='';
  if(pid.phase==='photo')pid.changed=true;
  pidRender();
}

function pidPickReplace(i){
  pid.replaceIdx=i;
  const inp=document.getElementById('pid-replace-file');
  if(inp)inp.click();
}

async function pidReplaceFile(fileList){
  const f=fileList&&fileList[0];
  if(!f||pid.replaceIdx==null)return;
  pid.notice='';
  try{
    pid.images[pid.replaceIdx]=await pidNormalize(f);
    pid.changed=true;
  }catch(e){pid.notice=pidIntakeNotice(e);}
  pid.replaceIdx=null;
  pidRender();
}

function pidUndoChange(){
  if(pid.baseImages)pid.images=pid.baseImages.slice();
  pid.changed=false;
  pid.notice='';
  pidRender();
}

// ── Requests ──
function pidSubmit(){
  if(pid.phase==='upload'){
    if(pid.images.length<1||pid.images.length>PID_MAX_PHOTOS){pid.notice='Please choose between 1 and 3 photos.';pidRender();return;}
    pidSend({kind:'initial'});
  }else if(pid.phase==='photo'&&pid.changed&&pid.images.length>=1){
    pidSend({kind:'retry'});
  }
}

function pidAnswer(i){
  const opts=(pid.data&&pid.data.answer_options)||[];
  if(opts[i]==null)return;
  pidSend({kind:'answer',answer:opts[i]});
}

function pidRetryLast(){
  if(pid.lastReq)pidSend(pid.lastReq);
}

async function pidSend(req){
  pid.lastReq=req;
  const prevPhase=pid.phase;
  pid.phase='analyzing';
  pid.error=null;
  pidRender();
  const ctrl=new AbortController();
  const timer=setTimeout(()=>ctrl.abort(),PID_TIMEOUT_MS);
  try{
    const res=await fetch(PID_ENDPOINT,{
      method:'POST',
      signal:ctrl.signal,
      headers:{'Content-Type':'application/json','Authorization':'Bearer '+PID_KEY},
      body:JSON.stringify({kind:req.kind,session_id:pid.sessionId,answer:req.answer,images:pid.images.map(i=>i.dataUrl)})
    });
    let data=null;
    try{data=await res.json();}catch(e){}
    if(!res.ok||!data||data.error){
      pid.error=(data&&data.error)||'_default';
      pid.phase='error';
      pidRender();
      return;
    }
    pid.sessionId=data.session_id;
    pid.data=data;
    pid.sel=null;
    if(data.phase==='photo'){
      pid.phase='photo';
      pid.baseImages=pid.images.slice();
      pid.changed=false;
    }else if(data.phase==='question'){
      pid.phase='question';
    }else{
      pid.phase='result';
    }
    pid.notice='';
    pidRender();
    const el=document.getElementById('pid');
    if(el&&prevPhase!=='upload')el.scrollIntoView({behavior:'smooth',block:'nearest'});
  }catch(e){
    pid.error='_default';
    pid.phase='error';
    pidRender();
  }finally{
    clearTimeout(timer);
  }
}
