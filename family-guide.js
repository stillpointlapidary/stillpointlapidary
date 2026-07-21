/* ── FAMILY GUIDE (pilot: Calcite) ──
   Approved route: encyclopedia.html?tab=family&family=<slug>[#anchor]
   Lives inside the existing encyclopedia.html SPA. Reuses CRYSTALS, openDetail(),
   jumpToFamily(), firstEncyclopediaPhoto(), and the existing switchTabByName()/
   syncTabUrl() tab machinery — no standalone template, no second Quick View/
   card/Supabase path.

   Visual rebuild (2026-07): museum-guide-style page — feature bands, uniform
   stone cards, compact fact modules. Approved public section order:
   1. Hero  2. Short overview  3. Meet Eight Common Calcite Varieties
   4. How to Recognize Calcite  5. Shapes Calcite Takes
   6. The Calcite Extended Family  7. Calcite Essentials  8. Closing callout.

   Content source: data/family-guides.json. Fields no longer rendered by this
   page (familyFitsTogether, otherCalcites, whatIsCalcite, identificationBuyingCare,
   relatedCarbonates full detail, sourceReferences, factualFlags) are kept in the
   data file as an archival record of the earlier approved Draft 1 copy — they are
   simply not read by any function below. Nothing here deletes that content. */

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

function fgReducedMotion(){
  try{ return window.matchMedia('(prefers-reduced-motion: reduce)').matches; }catch(e){ return false; }
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
    const behavior = fgReducedMotion() ? 'auto' : 'smooth';
    try{ el.scrollIntoView({behavior,block:'start'}); }catch(e){ el.scrollIntoView(); }
  },60);
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

/* ── Small content helpers ─────────────────────────────────────────────── */
function fgList(items){
  return `<ul class="fg-list">${(items||[]).map(i=>`<li>${escapeAttr(i)}</li>`).join('')}</ul>`;
}
function fgCrystal(stoneId){
  return (typeof CRYSTALS!=='undefined' && CRYSTALS.find) ? CRYSTALS.find(x=>x.i===stoneId) : null;
}

/* ── 1. Hero — warm near-white split composition: editorial copy left, true-
   color photo zone right. No dark overlay, no buttons. Christie has not yet
   supplied the final Calcite family photograph, so the photo zone is filled
   with a temporary collage built only from existing approved encyclopedia
   photos already used elsewhere in this guide — never new/invented photography
   — and is labeled as a placeholder. The zone keeps the approved eventual
   16:9 ratio so swapping in the real photo later is a single-image change. */
function fgHeroMediaHtml(guide){
  const ids = ['C-0007','C-0016','C-0014','C-0015']; // Blue, Orange, Mangano, Optical — representative spread
  const imgs = ids.map(id=>{
    const c = fgCrystal(id);
    const src = (c && typeof firstEncyclopediaPhoto==='function') ? firstEncyclopediaPhoto(c) : '';
    return src ? `<img src="${escapeAttr(src)}" alt="${escapeAttr(c.n)}" loading="lazy">` : '';
  }).filter(Boolean);
  if(!imgs.length && guide.hero && guide.hero.image){
    imgs.push(`<img src="${escapeAttr(SUPABASE_ENC+guide.hero.image)}" alt="${escapeAttr(guide.displayName||guide.slug)}">`);
  }
  return `<div class="fg-hero-media">
    <div class="fg-hero-media-grid">${imgs.join('')}</div>
    <span class="fg-hero-media-label">Family photograph — coming soon</span>
  </div>`;
}
function familyGuideHeroHtml(guide){
  const hero = guide.hero||{};
  return `<section class="fg-hero" id="fg-hero">
    <div class="fg-hero-grid">
      <div class="fg-hero-copy">
        ${hero.eyebrow?`<div class="fg-eyebrow">${escapeAttr(hero.eyebrow)}</div>`:''}
        <h1 class="fg-hero-title">${escapeAttr(hero.title||guide.displayName)}</h1>
        ${hero.signatureLine?`<p class="fg-hero-sub">${escapeAttr(hero.signatureLine)}</p>`:''}
        ${hero.condensedIntro?`<p class="fg-hero-body">${escapeAttr(hero.condensedIntro)}</p>`:''}
        ${hero.centralIdea?`<p class="fg-hero-italic">${escapeAttr(hero.centralIdea)}</p>`:''}
        ${hero.question?`<div class="fg-hero-prompt">
          ${hero.promptLeadIn?`<div class="fg-hero-prompt-lead">${escapeAttr(hero.promptLeadIn)}</div>`:''}
          <div class="fg-hero-question">${escapeAttr(hero.question)}</div>
          ${hero.questionSub?`<div class="fg-hero-prompt-sub">${escapeAttr(hero.questionSub)}</div>`:''}
        </div>`:''}
      </div>
      ${fgHeroMediaHtml(guide)}
    </div>
  </section>`;
}

/* ── 2. Short family overview — one centered feature paragraph. ────────── */
function familyGuideOverviewHtml(guide){
  const o = guide.overview||{};
  if(!o.paragraph) return '';
  return `<section class="fg-overview" id="fg-overview">
    <p class="fg-overview-text">${escapeAttr(o.paragraph)}</p>
  </section>`;
}

/* ── Uniform stone card — shared by Section 3 (eight common varieties) and
   Section 6 (extended family, with an added identity badge). ── */
function fgStoneCardHtml(member, opts){
  opts = opts || {};
  const c = fgCrystal(member.stoneId);
  if(!c) return ''; // unresolved roster ID — skipped, not fatal (see stop-condition handling)
  const imgSrc = (typeof firstEncyclopediaPhoto==='function') ? firstEncyclopediaPhoto(c) : '';
  const imgHtml = imgSrc
    ? `<img src="${escapeAttr(imgSrc)}" alt="${escapeAttr(c.n)}" loading="lazy">`
    : `<div class="fg-stonecard-noimg"></div>`;
  const badgeHtml = (opts.badge && member.identityBadge)
    ? `<span class="fg-badge">${escapeAttr(member.identityBadge)}</span>` : '';
  const idAttr = opts.anchorId ? ` id="${escapeAttr(opts.anchorId)}"` : '';
  return `<div class="fg-stonecard"${idAttr}>
    <button type="button" class="fg-stonecard-media" onclick="openDetail('${escapeAttr(c.i)}')" title="Open ${escapeAttr(c.n)} in Quick View">${imgHtml}</button>
    <div class="fg-stonecard-body">
      <div class="fg-stonecard-name">${escapeAttr(c.n)}</div>
      <div class="fg-stonecard-phrase">${escapeAttr(member.headline||'')}</div>
      ${badgeHtml}
      <button type="button" class="fg-stonecard-qv" onclick="openDetail('${escapeAttr(c.i)}')">Quick View</button>
    </div>
  </div>`;
}

/* ── 3. Meet Eight Common Calcite Varieties ─────────────────────────────
   Red Calcite (legacy anchor #red-calcite) no longer has a standalone essay
   on the public page. Its closest encyclopedia path is Orange Calcite, so the
   compatibility anchor lives on that card — any existing link or search
   redirect to #red-calcite still resolves and scrolls into context, without
   reintroducing a large visible Red Calcite section. */
function familyGuideVarietiesHtml(guide){
  const f = guide.findYourCalcite||{};
  const members = f.members||[];
  const cards = members.map(m=>fgStoneCardHtml(m, {anchorId: m.stoneId==='C-0016' ? 'red-calcite' : null})).filter(Boolean).join('');
  return `<section class="fg-section" id="fg-varieties">
    <h2 class="fg-h2">Meet Eight Common Calcite Varieties</h2>
    ${f.intro?`<p class="fg-section-sub">${escapeAttr(f.intro)}</p>`:''}
    <div class="fg-card-grid fg-card-grid--4">${cards}</div>
  </section>`;
}

/* ── Compact fact card — shared by Recognition, Shapes, and Essentials. ── */
function fgFactCardHtml(item, icon){
  const iconHtml = icon ? `<span class="enc-icon ${icon} fg-fact-icon" aria-hidden="true"></span>` : '';
  const bodyHtml = item.list ? fgList(item.list) : `<p class="fg-fact-body">${escapeAttr(item.body||'')}</p>`;
  return `<div class="fg-factcard">
    ${iconHtml}
    <div class="fg-fact-title">${escapeAttr(item.title||'')}</div>
    ${bodyHtml}
  </div>`;
}

/* ── 4. How to Recognize Calcite ─────────────────────────────────────── */
const FG_RECOGNITION_ICONS = ['icon-color-optical-effect','icon-forms-shapes','icon-magnifier-gem','icon-color-range'];
function familyGuideRecognitionHtml(guide){
  const items = (guide.recognition||{}).items||[];
  const cards = items.map((it,i)=>fgFactCardHtml(it, FG_RECOGNITION_ICONS[i])).join('');
  return `<section class="fg-section" id="fg-recognize">
    <h2 class="fg-h2">How to Recognize Calcite</h2>
    <p class="fg-section-sub">Look for these hallmarks that connect the family.</p>
    <div class="fg-fact-grid fg-fact-grid--4">${cards}</div>
  </section>`;
}

/* ── 5. Shapes Calcite Takes ─────────────────────────────────────────── */
const FG_SHAPE_ICONS = ['icon-crystal-single','icon-forms-shapes','icon-inclusions-patterns'];
function familyGuideShapesHtml(guide){
  const items = (guide.shapes||{}).items||[];
  const cards = items.map((it,i)=>fgFactCardHtml(it, FG_SHAPE_ICONS[i])).join('');
  return `<section class="fg-section" id="fg-shapes">
    <h2 class="fg-h2">Shapes Calcite Takes</h2>
    <p class="fg-section-sub">These are the most common forms you’ll see.</p>
    <div class="fg-fact-grid fg-fact-grid--3">${cards}</div>
  </section>`;
}

/* ── 6. The Calcite Extended Family — Calcite-rich, patterned, and trade
   materials. Kept visually consistent with Section 3's stone cards, plus a
   compact identity badge so honest material distinctions stay visible. ── */
function familyGuideExtendedFamilyHtml(guide){
  const t = guide.tradeMaterials||{};
  const cards = (t.members||[]).map(m=>fgStoneCardHtml(m, {badge:true})).filter(Boolean).join('');
  return `<section class="fg-section" id="fg-extended">
    <h2 class="fg-h2">The Calcite Extended Family</h2>
    <p class="fg-section-sub">Calcite-rich, patterned, and trade materials.</p>
    <div class="fg-card-grid fg-card-grid--4">${cards}</div>
  </section>`;
}

/* ── 7. Calcite Essentials — exactly four evenly divided modules. ──────── */
const FG_ESSENTIALS_ICONS = ['icon-geology','icon-identify','icon-care-cleaning','icon-crystal-cluster'];
function familyGuideEssentialsHtml(guide){
  const items = (guide.essentials||{}).items||[];
  const cards = items.slice(0,4).map((it,i)=>fgFactCardHtml(it, FG_ESSENTIALS_ICONS[i])).join('');
  return `<section class="fg-section" id="fg-essentials">
    <h2 class="fg-h2">Calcite Essentials</h2>
    <p class="fg-section-sub">What it is, how to recognize it, and how to care for it.</p>
    <div class="fg-essentials-grid">${cards}</div>
  </section>`;
}

/* ── 8. Closing callout — one CTA only. ─────────────────────────────────── */
function familyGuideClosingHtml(guide){
  return `<section class="fg-closing" id="fg-closing">
    <p class="fg-closing-line">Calcite helps life begin moving again.</p>
    <p class="fg-closing-question">Calcite asks: What wants to move next?</p>
    <button type="button" class="btn btn-accent fg-closing-btn" onclick="switchTabByName('encyclopedia')">Return to Encyclopedia</button>
  </section>`;
}

/* ── Full guide assembly — approved public section order ───────────────── */
function familyGuideHtml(guide){
  return `
  <div class="fg-guide" data-family-slug="${escapeAttr(guide.slug)}">
    ${familyGuideHeroHtml(guide)}
    ${familyGuideOverviewHtml(guide)}
    ${familyGuideVarietiesHtml(guide)}
    ${familyGuideRecognitionHtml(guide)}
    ${familyGuideShapesHtml(guide)}
    ${familyGuideExtendedFamilyHtml(guide)}
    ${familyGuideEssentialsHtml(guide)}
    ${familyGuideClosingHtml(guide)}
  </div>`;
}

function familyGuideNotFoundHtml(slug){
  return `<div class="fg-guide fg-not-found">
    <div class="fg-h2">Family guide not found</div>
    <p class="fg-fact-body">"${escapeAttr(slug)}" doesn't match a published Family Guide yet.</p>
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
