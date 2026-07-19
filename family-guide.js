/* ── FAMILY GUIDE (pilot: Calcite) ──
   Approved route: encyclopedia.html?tab=family&family=<slug>[#anchor]
   Lives inside the existing encyclopedia.html SPA. Reuses CRYSTALS, encCardHtml(),
   openDetail(), jumpToFamily(), firstEncyclopediaPhoto(), and the existing
   switchTabByName()/syncTabUrl() tab machinery — no standalone template, no
   second Quick View/card/Supabase path.

   Content source: data/family-guides.json. That file carries the complete
   supplied Draft 1 copy verbatim, plus two internal-only fields that are never
   rendered here: `sourceReferences` (id -> {url,label}) and `factualFlags`.
   Any content block that cites a source carries a `sourceRefIds` array; see
   fgSourced() below for how the association is preserved without printing a
   raw URL on the page. */

let FAMILY_GUIDES = null;
let _familyGuidesLoadPromise = null;
let activeFamilyGuideSlug = null;

function loadFamilyGuides(){
  if(_familyGuidesLoadPromise) return _familyGuidesLoadPromise;
  _familyGuidesLoadPromise = fetch('data/family-guides.json').then(r=>r.json()).then(d=>{
    FAMILY_GUIDES = d || {};
    return FAMILY_GUIDES;
  }).catch(()=>{ FAMILY_GUIDES = {}; return FAMILY_GUIDES; });
  return _familyGuidesLoadPromise;
}

function familyGuideSlugify(v){
  return String(v||'').toLowerCase().trim().replace(/[^a-z0-9]+/g,'-').replace(/^-+|-+$/g,'');
}

// ── Entry point for tile/link clicks — pushes a new history entry so Back
// returns to whatever the user was looking at before opening the guide. ──
function openFamilyGuide(rawSlug, opts){
  const slug = familyGuideSlugify(rawSlug);
  if(!slug) return;
  opts = opts || {};
  const params = new URLSearchParams(window.location.search);
  params.set('tab','family');
  params.set('family',slug);
  const hash = opts.anchor ? ('#'+opts.anchor) : '';
  const url = window.location.pathname+'?'+params.toString()+hash;
  try{ history.pushState({familyGuide:slug}, '', url); }catch(e){}
  renderFamilyGuideView(slug, {scrollToHash:!!hash});
}

// ── Core render dispatch — shows the #tab-family section and fills it in. ──
function renderFamilyGuideView(rawSlug, opts){
  opts = opts || {};
  const slug = familyGuideSlugify(rawSlug);
  activeFamilyGuideSlug = slug;
  switchTabByName('family');
  const root = document.getElementById('tab-family');
  if(!root) return;
  if(!FAMILY_GUIDES){
    root.innerHTML = '<div class="fg-loading">Loading family guide…</div>';
    loadFamilyGuides().then(()=>{
      if(activeFamilyGuideSlug===slug) renderFamilyGuideView(slug, opts);
    });
    return;
  }
  const guide = FAMILY_GUIDES[slug];
  if(!guide){
    root.innerHTML = familyGuideNotFoundHtml(slug);
    return;
  }
  root.innerHTML = familyGuideHtml(guide);
  if(opts.scrollToHash!==false) scrollToFamilyGuideHash();
}

function scrollToFamilyGuideHash(){
  const hash=(window.location.hash||'').replace(/^#/,'');
  if(!hash) return;
  setTimeout(()=>{
    const el=document.getElementById(hash);
    if(!el) return;
    try{ el.scrollIntoView({behavior:'smooth',block:'start'}); }catch(e){ el.scrollIntoView(); }
  },60);
}

function fgScrollToId(id){
  const el=document.getElementById(id);
  if(!el) return;
  try{ el.scrollIntoView({behavior:'smooth',block:'start'}); }catch(e){ el.scrollIntoView(); }
}

// ── Route resolution — called on initial load and on popstate. Returns
// true if the URL indicated a family guide (and rendered it), else false. ──
function resolveFamilyGuideFromUrl(){
  let params;
  try{ params=new URLSearchParams(window.location.search); }catch(e){ return false; }
  if(params.get('tab')!=='family') return false;
  const slug=familyGuideSlugify(params.get('family')||'');
  if(!slug) return false;
  renderFamilyGuideView(slug, {scrollToHash:true});
  return true;
}

// Back/forward support — the app has no other popstate listener; ordinary
// tab switches use history.replaceState and are unaffected by this.
window.addEventListener('popstate', function(){
  if(resolveFamilyGuideFromUrl()) return;
  let params; try{ params=new URLSearchParams(window.location.search); }catch(e){ params=null; }
  const t=(params && ['mood','encyclopedia','identify','collection','101'].includes(params.get('tab'))) ? params.get('tab') : 'encyclopedia';
  switchTabByName(t);
  if(t==='encyclopedia' && typeof encRender==='function') encRender();
});

/* ── Small content helpers ──────────────────────────────────────────────
   `fgSourced` accepts either a plain string or {text, sourceRefIds:[...]}.
   The sourceRefIds are attached as a data attribute (internal association
   only, never rendered as visible text or a link) so the claim<->source
   pairing survives in the DOM/data without printing a raw research URL. */
function fgSourced(block){
  if(block==null) return '';
  if(typeof block==='string') return { text: block, refs: [] };
  return { text: block.text||'', refs: block.sourceRefIds||[] };
}
function fgPara(block, cls){
  const b=fgSourced(block);
  if(!b.text) return '';
  const refAttr = b.refs.length ? ` data-fg-source-refs="${escapeAttr(b.refs.join(','))}"` : '';
  return `<p class="${cls||'fg-p'}"${refAttr}>${escapeAttr(b.text)}</p>`;
}
function fgParas(list, cls){
  return (list||[]).map(b=>fgPara(b,cls)).join('');
}
function fgList(items){
  return `<ul class="fg-list">${(items||[]).map(i=>`<li>${escapeAttr(i)}</li>`).join('')}</ul>`;
}
function fgCrystal(stoneId){
  return (typeof CRYSTALS!=='undefined' && CRYSTALS.find) ? CRYSTALS.find(x=>x.i===stoneId) : null;
}
function fgOpenDetailLink(name, stoneId){
  const c = fgCrystal(stoneId);
  if(!c) return escapeAttr(name); // unresolved — render as plain text, never a false link
  return `<button type="button" class="fg-inline-link" onclick="openDetail('${escapeAttr(stoneId)}')">${escapeAttr(name)}</button>`;
}

/* ── 1. Hero ────────────────────────────────────────────────────────── */
function familyGuideHeroHtml(guide){
  const hero = guide.hero||{};
  const img = hero.image ? `<img src="${escapeAttr(SUPABASE_ENC+hero.image)}" alt="${escapeAttr(guide.displayName||guide.slug)}">` : '';
  const primaryBtn = hero.primaryAction
    ? `<button type="button" class="btn btn-accent fg-hero-btn" onclick="fgScrollToId('${escapeAttr(hero.primaryAction.target||'')}')">${escapeAttr(hero.primaryAction.label)}</button>`
    : '';
  const secondaryBtn = (hero.secondaryAction && guide.encyclopediaFilterValue)
    ? `<button type="button" class="btn fg-hero-btn" onclick="jumpToFamily('${escapeAttr(guide.encyclopediaFilterValue)}')">${escapeAttr(hero.secondaryAction.label)}</button>`
    : '';
  return `<div class="fg-hero c101-photo-intro c101-photo-intro--families">
    <div class="c101-photo-copy">
      <div class="fg-hero-title">${escapeAttr(hero.title||guide.displayName)}</div>
      <div class="fg-hero-signature">${escapeAttr(hero.signatureLine||'')}</div>
      ${fgParas(hero.paragraphs,'fg-hero-p')}
      <div class="fg-hero-actions">${primaryBtn}${secondaryBtn}</div>
    </div>
    <figure class="c101-photo-slot">${img}</figure>
  </div>`;
}

/* ── 2. The Energy of Calcite ───────────────────────────────────────── */
function familyGuideEnergyHtml(guide){
  const e = guide.energySection||{};
  return `<div class="c101-block fg-energy" id="fg-energy">
    ${fgParas(e.paragraphs,'fg-energy-p')}
    <div class="fg-energy-leadin">${escapeAttr(e.leadIn||'')}</div>
    <div class="fg-energy-question">${escapeAttr(e.question||'')}</div>
    <div class="fg-energy-afterquestion">${escapeAttr(e.afterQuestion||'')}</div>
    ${fgPara(e.groundingParagraph,'fg-energy-p fg-energy-grounding')}
  </div>`;
}

/* ── 3. Find Your Calcite ───────────────────────────────────────────── */
function familyGuideFindTileHtml(member){
  const c = fgCrystal(member.stoneId);
  if(!c) return ''; // unresolved roster ID — skipped, not fatal (see stop-condition handling)
  const imgSrc = (typeof firstEncyclopediaPhoto==='function') ? firstEncyclopediaPhoto(c) : '';
  const imgHtml = imgSrc
    ? `<img src="${escapeAttr(imgSrc)}" alt="${escapeAttr(c.n)}" loading="lazy">`
    : `<div class="fg-find-tile-noimg"></div>`;
  return `<div class="fg-find-tile" onclick="openDetail('${escapeAttr(c.i)}')" title="Open ${escapeAttr(c.n)} in Quick View">
    <div class="fg-find-tile-img">${imgHtml}</div>
    <div class="fg-find-tile-copy">
      <div class="fg-find-tile-name">${escapeAttr(c.n)}</div>
      <div class="fg-find-tile-headline">${escapeAttr(member.headline||'')}</div>
      <div class="fg-find-tile-distinction">${escapeAttr(member.distinction||'')}</div>
      <div class="fg-identity-label">${escapeAttr(member.identityLabel||'')}</div>
    </div>
  </div>`;
}
function familyGuideFindYourCalciteHtml(guide){
  const f = guide.findYourCalcite||{};
  const tiles = (f.members||[]).map(familyGuideFindTileHtml).filter(Boolean).join('');
  return `<div class="c101-block" id="fg-find-your-calcite">
    <div class="c101-h2">Find Your Calcite</div>
    <div class="fg-find-intro">${escapeAttr(f.intro||'')}</div>
    ${f.intro2?`<div class="c101-body">${escapeAttr(f.intro2)}</div>`:''}
    <div class="fg-find-grid">${tiles}</div>
  </div>`;
}

/* ── 4. Calcite-Rich, Patterned, and Trade Materials ───────────────── */
function familyGuideTradeCardHtml(member){
  const c = fgCrystal(member.stoneId);
  if(!c) return '';
  const imgSrc = (typeof firstEncyclopediaPhoto==='function') ? firstEncyclopediaPhoto(c) : '';
  const imgHtml = imgSrc ? `<img src="${escapeAttr(imgSrc)}" alt="${escapeAttr(c.n)}" loading="lazy">` : `<div class="fg-find-tile-noimg"></div>`;
  const rel = (member.relationship||[]).map(r=>fgPara(r,'fg-trade-relationship')).join('');
  return `<div class="fg-trade-card">
    <div class="fg-trade-card-img" onclick="openDetail('${escapeAttr(c.i)}')" title="Open ${escapeAttr(c.n)} in Quick View">${imgHtml}</div>
    <div class="fg-trade-card-body">
      <div class="fg-find-tile-name">${escapeAttr(c.n)}</div>
      <div class="fg-find-tile-headline">${escapeAttr(member.headline||'')}</div>
      <div class="fg-find-tile-distinction">${escapeAttr(member.distinction||'')}</div>
      <div class="fg-identity-label">${escapeAttr(member.identityLabel||'')}</div>
      ${rel}
      <button type="button" class="fg-inline-link fg-trade-qv" onclick="openDetail('${escapeAttr(c.i)}')">View in Quick View</button>
    </div>
  </div>`;
}
function familyGuideTradeMaterialsHtml(guide){
  const t = guide.tradeMaterials||{};
  const cards = (t.members||[]).map(familyGuideTradeCardHtml).filter(Boolean).join('');
  return `<div class="c101-block" id="fg-trade-materials">
    <div class="c101-h2">Calcite-Rich, Patterned, and Trade Materials</div>
    <div class="c101-body">${escapeAttr(t.intro||'')}</div>
    <div class="fg-trade-grid">${cards}</div>
  </div>`;
}

/* ── 5. How the Family Fits Together ────────────────────────────────── */
function familyGuideFitsPanelHtml(panel){
  let body;
  if(panel.subpanels){
    body = panel.subpanels.map(sp=>`<div class="fg-panel-subpanel"><div class="fg-panel-sublabel">${escapeAttr(sp.label)}</div>${fgParas(sp.paragraphs)}</div>`).join('');
  } else {
    body = fgParas(panel.paragraphs);
  }
  return `<div class="fg-fits-panel">
    <div class="fg-fits-panel-title">${escapeAttr(panel.title)}</div>
    ${body}
  </div>`;
}
function familyGuideFitsTogetherHtml(guide){
  const f = guide.familyFitsTogether||{};
  const panels = (f.panels||[]).map(familyGuideFitsPanelHtml).join('');
  return `<div class="c101-block" id="fg-fits-together">
    <div class="c101-h2">How the Family Fits Together</div>
    ${fgParas(f.intro,'c101-body')}
    <div class="fg-fits-grid">${panels}</div>
  </div>`;
}

/* ── 6. Other Calcites You May Encounter (3 visual levels) ──────────── */
function familyGuideFeaturedProfileHtml(entry){
  const paras = (entry.paragraphs||[]).map(p=>fgPara(p)).join('');
  const listHtml = entry.list ? `${entry.listIntro?`<div class="fg-list-intro">${escapeAttr(entry.listIntro)}</div>`:''}${fgList(entry.list)}` : '';
  const comparisonHtml = entry.comparison ? `<div class="fg-comparison-block">
    <div class="fg-comparison-heading">${escapeAttr(entry.comparison.heading)}</div>
    ${(entry.comparison.lines||[]).map(l=>`<p class="fg-comparison-line">${escapeAttr(l)}</p>`).join('')}
  </div>` : '';
  const closing = entry.closingParagraph ? `<p class="fg-p">${escapeAttr(entry.closingParagraph)}</p>` : '';
  let seeAlsoHtml = '';
  if(entry.seeAlso){
    seeAlsoHtml = `<div class="fg-see-also">See also: ${fgOpenDetailLink(entry.seeAlso.name, entry.seeAlso.stoneId)}</div>`;
  } else if(entry.seeAlsoMultiple){
    seeAlsoHtml = `<div class="fg-see-also">See also: ${entry.seeAlsoMultiple.map(s=>fgOpenDetailLink(s.name,s.stoneId)).join(' · ')}</div>`;
  } else if(entry.closestPaths){
    seeAlsoHtml = `<div class="fg-see-also">${escapeAttr(entry.closestPaths.label)}: ${entry.closestPaths.items.map(s=>fgOpenDetailLink(s.name,s.stoneId)).join(' · ')}</div>`;
  }
  return `<div class="fg-featured-profile" id="${escapeAttr(entry.anchor||'')}">
    <div class="fg-featured-name">${escapeAttr(entry.name)}</div>
    <div class="fg-featured-headline">${escapeAttr(entry.headline||'')}</div>
    ${paras}
    ${listHtml}
    ${comparisonHtml}
    ${closing}
    ${seeAlsoHtml}
  </div>`;
}
function familyGuideCompactDirectoryHtml(other){
  const items = (other.compactDirectory||[]).map(e=>`<div class="fg-compact-item"><span class="fg-compact-name">${escapeAttr(e.name)}</span><span class="fg-compact-body">${escapeAttr(e.body)}</span></div>`).join('');
  return `<div class="fg-level2">
    <div class="fg-level-label">Also seen under these market names</div>
    <div class="c101-body fg-level-intro">${escapeAttr(other.compactDirectoryIntro||'')}</div>
    <div class="fg-compact-grid">${items}</div>
    ${other.compactDirectoryClosing?`<p class="fg-p fg-level-closing">${escapeAttr(other.compactDirectoryClosing)}</p>`:''}
  </div>`;
}
function familyGuideHabitStripHtml(other){
  const items = (other.habitStrip||[]).map(e=>`<div class="fg-habit-chip"><span class="fg-habit-name">${escapeAttr(e.name)}</span><span class="fg-habit-body">${escapeAttr(e.body)}</span></div>`).join('');
  return `<div class="fg-level3">
    <div class="fg-level-label">Named by crystal habit</div>
    <div class="c101-body fg-level-intro">${escapeAttr(other.habitStripIntro||'')}</div>
    <div class="fg-habit-strip">${items}</div>
    ${other.habitStripClosing?`<p class="fg-p fg-level-closing">${escapeAttr(other.habitStripClosing)}</p>`:''}
  </div>`;
}
function familyGuideOtherCalcitesHtml(guide){
  const o = guide.otherCalcites||{};
  const featured = (o.featured||[]).map(familyGuideFeaturedProfileHtml).join('');
  return `<div class="c101-block" id="fg-other-calcites">
    <div class="c101-h2">Other Calcites You May Encounter</div>
    ${fgParas(o.intro,'c101-body')}
    <div class="fg-featured-list">${featured}</div>
    ${familyGuideCompactDirectoryHtml(o)}
    ${familyGuideHabitStripHtml(o)}
  </div>`;
}

/* ── 7. What Is Calcite? ─────────────────────────────────────────────── */
function fgEmphasize(text){
  // Restrained emphasis for the handful of technical terms named in the brief —
  // wraps exact matches in <em>, does not alter wording or add new terms.
  const terms=['CaCO₃','MnCO₃','MgCO₃','FeCO₃','ZnCO₃','CaMg(CO₃)₂','Mohs 3','Mohs hardness of 3','cleavage','acid','double refraction'];
  let out=escapeAttr(text);
  terms.forEach(t=>{
    const esc=escapeAttr(t).replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
    out=out.replace(new RegExp(esc,'g'), m=>`<em class="fg-term">${m}</em>`);
  });
  return out;
}
function fgParaEmph(block){
  const b=fgSourced(block);
  if(!b.text) return '';
  const refAttr = b.refs.length ? ` data-fg-source-refs="${escapeAttr(b.refs.join(','))}"` : '';
  return `<p class="fg-p"${refAttr}>${fgEmphasize(b.text)}</p>`;
}
function familyGuideWhatIsHtml(guide){
  const w = guide.whatIsCalcite||{};
  const wsm = w.whySoManyForms||{};
  return `<div class="c101-block" id="fg-what-is-calcite">
    <div class="c101-h2">What Is Calcite?</div>
    <div class="fg-whatis-sub">${(w.mainIdentity||[]).map(fgParaEmph).join('')}</div>
    <div class="fg-whatis-subhead">Memorable physical characteristics</div>
    <div class="fg-whatis-sub">${(w.physicalCharacteristics||[]).map(fgParaEmph).join('')}</div>
    <div class="fg-whatis-subhead">Why so many forms?</div>
    <div class="fg-whatis-sub">
      <p class="fg-p">${escapeAttr(wsm.intro||'')}</p>
      ${wsm.listIntro?`<div class="fg-list-intro">${escapeAttr(wsm.listIntro)}</div>`:''}
      ${fgList(wsm.list)}
      <p class="fg-p">${escapeAttr(wsm.closing||'')}</p>
    </div>
  </div>`;
}

/* ── 8. Identification, Buying, and Care ────────────────────────────── */
function familyGuideIdBuyingCareHtml(guide){
  const ibc = guide.identificationBuyingCare||{};
  const rec = ibc.recognizing||{}, buy = ibc.buying||{}, care = ibc.care||{};
  return `<div class="c101-block" id="fg-id-buying-care">
    <div class="c101-h2">Identification, Buying, and Care</div>
    <div class="fg-ibc-block">
      <div class="fg-ibc-label">Recognizing Calcite</div>
      <div class="fg-list-intro">${escapeAttr(rec.intro||'')}</div>
      ${fgList(rec.list)}
      ${fgParas(rec.closing)}
    </div>
    <div class="fg-ibc-block">
      <div class="fg-ibc-label">Buying with clearer expectations</div>
      <div class="fg-list-intro">${escapeAttr(buy.intro||'')}</div>
      ${fgList(buy.list)}
      ${fgParas(buy.paragraphs)}
      ${buy.list2Intro?`<div class="fg-list-intro">${escapeAttr(buy.list2Intro)}</div>`:''}
      ${fgList(buy.list2)}
    </div>
    <div class="fg-ibc-block">
      <div class="fg-ibc-label">Care</div>
      ${fgPara(care.intro)}
      ${care.listIntro?`<div class="fg-list-intro">${escapeAttr(care.listIntro)}</div>`:''}
      ${fgList(care.list)}
      ${care.bumblebeeWarning?`<div class="c101-warn fg-bumblebee-warn"><strong>Handling note — Bumblebee Jasper:</strong> ${escapeAttr(fgSourced(care.bumblebeeWarning).text)}</div>`:''}
    </div>
  </div>`;
}

/* ── 9. Related Carbonate Minerals ──────────────────────────────────── */
function familyGuideCarbonateCardHtml(m){
  const explanation = fgPara(m.explanation,'fg-carbonate-explanation');
  return `<div class="fg-carbonate-card">
    <div class="fg-carbonate-name">${escapeAttr(m.name)}</div>
    <div class="fg-carbonate-relation">${escapeAttr(m.relationLine||'')}</div>
    ${explanation}
  </div>`;
}
function familyGuideRelatedCarbonatesHtml(guide){
  const rc = guide.relatedCarbonates||{};
  const cards = (rc.minerals||[]).map(familyGuideCarbonateCardHtml).join('');
  return `<div class="c101-block" id="fg-related-carbonates">
    <div class="c101-h2">Related Carbonate Minerals</div>
    ${fgParas(rc.intro,'c101-body')}
    <div class="fg-carbonate-grid">${cards}</div>
  </div>`;
}

/* ── 10. Closing section ────────────────────────────────────────────── */
function fgClosingActionHtml(action, guide){
  if(action.type==='jumpToFamily' && guide.encyclopediaFilterValue){
    return `<button type="button" class="btn fg-closing-btn" onclick="jumpToFamily('${escapeAttr(guide.encyclopediaFilterValue)}')">${escapeAttr(action.label)}</button>`;
  }
  if(action.type==='openDetail' && action.stoneId){
    const c=fgCrystal(action.stoneId);
    if(!c) return ''; // no false action if the target doesn't resolve
    return `<button type="button" class="btn fg-closing-btn" onclick="openDetail('${escapeAttr(action.stoneId)}')">${escapeAttr(action.label)}</button>`;
  }
  if(action.type==='backTo101'){
    return `<button type="button" class="btn fg-closing-btn" onclick="switchTabByName('101')">${escapeAttr(action.label)}</button>`;
  }
  // 'inert' — no resolvable target yet (e.g. a future Aragonite/Dolomite family
  // guide). Rendered as plain text rather than a false/dead link.
  return `<span class="fg-closing-inert">${escapeAttr(action.label)}</span>`;
}
function familyGuideClosingHtml(guide){
  const cl = guide.closing||{};
  const actions = (cl.actions||[]).map(a=>fgClosingActionHtml(a,guide)).join('');
  return `<div class="c101-block fg-closing" id="fg-closing">
    <div class="c101-h2">${escapeAttr(cl.title||'')}</div>
    ${fgParas(cl.paragraphs)}
    ${cl.listIntro?`<p class="fg-p">${escapeAttr(cl.listIntro)}</p>`:''}
    ${fgList(cl.list)}
    ${cl.finalLine?`<p class="fg-p fg-closing-final">${escapeAttr(cl.finalLine)}</p>`:''}
    <div class="fg-closing-actions">${actions}</div>
  </div>`;
}

/* ── Full guide assembly — approved editorial order ─────────────────── */
function familyGuideHtml(guide){
  return `
  <div class="fg-guide" data-family-slug="${escapeAttr(guide.slug)}">
    ${familyGuideHeroHtml(guide)}
    ${familyGuideEnergyHtml(guide)}
    ${familyGuideFindYourCalciteHtml(guide)}
    ${familyGuideTradeMaterialsHtml(guide)}
    ${familyGuideFitsTogetherHtml(guide)}
    ${familyGuideOtherCalcitesHtml(guide)}
    ${familyGuideWhatIsHtml(guide)}
    ${familyGuideIdBuyingCareHtml(guide)}
    ${familyGuideRelatedCarbonatesHtml(guide)}
    ${familyGuideClosingHtml(guide)}
  </div>`;
}

function familyGuideNotFoundHtml(slug){
  return `<div class="fg-guide fg-not-found">
    <div class="c101-h1">Family guide not found</div>
    <div class="c101-body">"${escapeAttr(slug)}" doesn't match a published Family Guide yet.</div>
    <button type="button" class="btn btn-sm" onclick="switchTabByName('101')">Back to Crystals 101</button>
  </div>`;
}

// Kick off a non-blocking load so the data is ready by the time it's needed —
// same pattern as the other data/*.json fetches in loadStonesAndInit(). If the
// Crystals 101 family tiles already rendered before this resolves, refresh them
// so a guide-enabled tile can pick up its hero image from the guide record.
loadFamilyGuides().then(()=>{
  if(document.getElementById('fam-cards') && typeof renderFamilies==='function'){
    renderFamilies(window.currentFamTier||'major');
  }
});
