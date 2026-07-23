/* ── FAMILY GUIDE (pilot: Calcite) ──
   Approved route: encyclopedia.html?tab=family&family=<slug>[#anchor]
   Lives inside the existing encyclopedia.html SPA. Reuses CRYSTALS, openDetail(),
   jumpToFamily(), firstEncyclopediaPhoto(), and the existing switchTabByName()/
   syncTabUrl() tab machinery — no standalone template, no second Quick View/
   card/Supabase path.

   Visual rebuild (2026-07): museum-guide-style page — feature bands, uniform
   stone cards, compact fact modules. Revised again (2026-07-22) per Christie's
   approved review: Recognition and Shapes became real photo-led teaching
   sections using license-cleared public educational photography (local files
   under assets/family-guide-calcite/, credited via imageCredits below), and
   Essentials was replaced by a composed Care-for-it/Remember-this/Watch-for
   closing section. Approved public section order:
   1. Hero (now includes the family-overview paragraph as its own bottom
   section, below a divider, per Christie's 2026-07-22 refinement pass)
   2. Meet Eight Common Calcite Varieties
   3. How to Recognize Calcite  4. Shapes Calcite Takes
   5. The Calcite Extended Family  6. Calcite in Your Collection
   7. Closing callout  8. Image credits (below the closing panel, 2026-07-22).

   Content source: data/family-guides.json. Fields no longer rendered by this
   page (familyFitsTogether, otherCalcites, whatIsCalcite, identificationBuyingCare,
   relatedCarbonates full detail, sourceReferences, factualFlags, essentials) are
   kept in the data file as an archival record of earlier approved copy — they
   are simply not read by any function below. Nothing here deletes that content. */

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
function fgList(items, extraClass){
  const cls = extraClass ? `fg-list ${extraClass}` : 'fg-list';
  return `<ul class="${cls}">${(items||[]).map(i=>`<li>${escapeAttr(i)}</li>`).join('')}</ul>`;
}
function fgCrystal(stoneId){
  return (typeof CRYSTALS!=='undefined' && CRYSTALS.find) ? CRYSTALS.find(x=>x.i===stoneId) : null;
}

/* ── 1. Hero — warm near-white split composition: editorial copy left, true-
   color photo zone right. No dark overlay, no buttons. When a guide has no
   final family photograph yet, the photo zone is filled with a temporary
   collage built only from existing approved encyclopedia photos already used
   elsewhere in that guide — never new/invented photography — and is labeled
   as a placeholder. The zone keeps the approved eventual 16:9 ratio so
   swapping in a real photo later is a single-image change. Media stone IDs
   are guide-driven (guide.hero.mediaStoneIds) so each family guide picks its
   own representative spread; Calcite's original hardcoded four-ID fallback is
   kept below so its existing output is unaffected (2026-07-22 generalization
   for the Quartz Family Guide's first pass). */
function fgHeroMediaHtml(guide){
  const ids = (guide.hero && guide.hero.mediaStoneIds)
    || (guide.slug==='calcite' ? ['C-0007','C-0016','C-0014','C-0015'] : []); // legacy Calcite spread: Blue, Orange, Mangano, Optical
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
/* Hero bottom band accepts either guide.overview.paragraph (single string,
   Calcite's original shape) or guide.overview.paragraphs (array, used by
   Quartz to preserve its approved two-paragraph introduction break). Both
   render with the same .fg-hero-intro-text styling. */
function familyGuideHeroHtml(guide){
  const hero = guide.hero||{};
  const ov = guide.overview||{};
  const introParas = Array.isArray(ov.paragraphs) ? ov.paragraphs : (ov.paragraph ? [ov.paragraph] : []);
  return `<section class="fg-hero" id="fg-hero">
    <div class="fg-hero-grid">
      <div class="fg-hero-copy">
        ${hero.eyebrow?`<div class="fg-eyebrow">${escapeAttr(hero.eyebrow)}</div>`:''}
        <h1 class="fg-hero-title">${escapeAttr(hero.title||guide.displayName)}</h1>
        ${hero.signatureLine?`<p class="fg-hero-sub">${escapeAttr(hero.signatureLine)}</p>`:''}
        ${hero.condensedIntro?`<p class="fg-hero-body">${escapeAttr(hero.condensedIntro)}</p>`:''}
        ${hero.question?`<div class="fg-hero-prompt">
          ${hero.promptLeadIn?`<div class="fg-hero-prompt-lead">${escapeAttr(hero.promptLeadIn)}</div>`:''}
          <div class="fg-hero-question">${escapeAttr(hero.question)}</div>
        </div>`:''}
      </div>
      ${fgHeroMediaHtml(guide)}
    </div>
    ${introParas.length?`<div class="fg-hero-divider"></div>
    <div class="fg-hero-intro">
      ${introParas.map(p=>`<p class="fg-hero-intro-text">${escapeAttr(p)}</p>`).join('')}
    </div>`:''}
  </section>`;
}

/* ── Uniform stone card — shared by Section 3 (eight common varieties) and
   Section 6 (extended family, with an added identity badge), and reused by
   the Quartz Family Guide (2026-07-22) for its eight anchor-expression cards
   and its Growth Forms & Inclusions cards. Two additive, opt-in behaviors
   were added for Quartz and do not change any existing caller's output:
   - opts.showIdentity: renders member.identityLabel as its own line above
     the phrase, and uses member.quickView (falling back to member.headline)
     as the phrase text. Calcite's calls never pass this, so its cards are
     byte-for-byte unchanged (identityLabel was already present-but-unread on
     Calcite's member records; this does not newly surface it for Calcite).
   - opts.placeholderOk: when a member has no headline/quickView copy yet,
     shows a clearly marked "Editorial copy pending" note instead of an empty
     phrase line, and labels a missing photo as "Photo pending" instead of a
     silent blank tile. Used only by Quartz's not-yet-written sections. ── */
function fgStoneCardHtml(member, opts){
  opts = opts || {};
  const c = fgCrystal(member.stoneId);
  if(!c) return ''; // unresolved roster ID — skipped, not fatal (see stop-condition handling)
  const imgSrc = (typeof firstEncyclopediaPhoto==='function') ? firstEncyclopediaPhoto(c) : '';
  const imgHtml = imgSrc
    ? `<img src="${escapeAttr(imgSrc)}" alt="${escapeAttr(c.n)}" loading="lazy">`
    : (opts.placeholderOk
        ? `<div class="fg-stonecard-noimg fg-stonecard-noimg--labeled"><span>Photo pending</span></div>`
        : `<div class="fg-stonecard-noimg"></div>`);
  const badgeHtml = (opts.badge && member.identityBadge)
    ? `<span class="fg-badge">${escapeAttr(member.identityBadge)}</span>` : '';
  const idAttr = opts.anchorId ? ` id="${escapeAttr(opts.anchorId)}"` : '';
  const identityHtml = (opts.showIdentity && member.identityLabel)
    ? `<div class="fg-stonecard-identity">${escapeAttr(member.identityLabel)}</div>` : '';
  let phraseText = opts.showIdentity ? (member.quickView||member.headline||'') : (member.headline||'');
  let phraseClass = 'fg-stonecard-phrase';
  if(!phraseText && opts.placeholderOk){
    phraseText = 'Editorial copy pending.';
    phraseClass += ' fg-placeholder-note';
  }
  return `<div class="fg-stonecard"${idAttr}>
    <button type="button" class="fg-stonecard-media" onclick="openDetail('${escapeAttr(c.i)}')" title="Open ${escapeAttr(c.n)} in Quick View">${imgHtml}</button>
    <div class="fg-stonecard-body">
      <div class="fg-stonecard-name">${escapeAttr(c.n)}</div>
      ${identityHtml}
      <div class="${phraseClass}">${escapeAttr(phraseText)}</div>
      ${badgeHtml}
      <button type="button" class="fg-stonecard-qv" onclick="openDetail('${escapeAttr(c.i)}')">Quick View</button>
    </div>
  </div>`;
}

/* ── Expression-card dispatcher (2026-07-22, added for the Fluorite Family
   Guide's first pass). Delegates straight to fgStoneCardHtml when a member
   has a stoneId (Quartz's members always do, so its output is unaffected).
   When a member has no stoneId — Fluorite's Yttrium Fluorite and Candy
   Fluorite, neither of which resolves to a canonical roster entry — it
   renders a visibly non-clickable "family-guide expression" card instead:
   no Quick View, no openDetail() call, no invented stone link, and a badge
   so it can never be mistaken for an encyclopedia entry. ── */
function fgExpressionCardHtml(member, opts){
  if(member.stoneId) return fgStoneCardHtml(member, opts);
  opts = opts || {};
  const name = member.name||'';
  if(!name) return '';
  const imgHtml = `<div class="fg-stonecard-noimg fg-stonecard-noimg--labeled"><span>Photo pending</span></div>`;
  const identityHtml = (opts.showIdentity && member.identityLabel)
    ? `<div class="fg-stonecard-identity">${escapeAttr(member.identityLabel)}</div>` : '';
  let phraseText = member.quickView||member.headline||'';
  let phraseClass = 'fg-stonecard-phrase';
  if(!phraseText){
    phraseText = 'Photo and editorial identity pending.';
    phraseClass += ' fg-placeholder-note';
  }
  return `<div class="fg-stonecard fg-stonecard--unlinked">
    <div class="fg-stonecard-media" title="${escapeAttr(name)} — family-guide expression, not a linked encyclopedia entry">${imgHtml}</div>
    <div class="fg-stonecard-body">
      <div class="fg-stonecard-name">${escapeAttr(name)}</div>
      ${identityHtml}
      <div class="${phraseClass}">${escapeAttr(phraseText)}</div>
      <span class="fg-badge">FAMILY-GUIDE EXPRESSION</span>
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
    ${f.intro?`<p class="fg-lead">${escapeAttr(f.intro)}</p>`:''}
    <div class="fg-card-grid fg-card-grid--4">${cards}</div>
  </section>`;
}

/* ── Photo-led teaching card — shared by Recognition and Shapes. A card
   either shows one local educational photograph (item.image, from
   assets/family-guide-calcite/) or, for the "many colors" recognition card,
   a small swatch grid built from existing approved encyclopedia photos
   (item.swatchStoneIds) — no new third-party photography involved. ── */
function fgPhotoCardHtml(item){
  let mediaHtml;
  if(item.swatchStoneIds){
    const imgs = item.swatchStoneIds.map(id=>{
      const c = fgCrystal(id);
      const src = (c && typeof firstEncyclopediaPhoto==='function') ? firstEncyclopediaPhoto(c) : '';
      return src ? `<div class="fg-photocard-swatch-cell"><img src="${escapeAttr(src)}" alt="${escapeAttr(c.n)}" loading="lazy"></div>` : '';
    }).filter(Boolean).join('');
    const sizeClass = item.swatchStoneIds.length===6 ? ' fg-photocard-swatch--6' : '';
    mediaHtml = `<div class="fg-photocard-swatch${sizeClass}">${imgs}</div>`;
  }else if(item.image){
    mediaHtml = `<img src="${escapeAttr('assets/family-guide-calcite/'+item.image)}" alt="${escapeAttr(item.alt||'')}" loading="lazy">`;
  }else if(item.placeholderLabel){
    // Labeled placeholder (2026-07-22, added for Fluorite's Cube/Octahedron/
    // Cleavage comparison) — used when a card's educational photo is
    // planned but not yet retained locally, so review sessions see an
    // intentional pending state rather than a blank tile. Calcite's items
    // always supply item.image, so this branch never runs for it.
    mediaHtml = `<div class="fg-stonecard-noimg fg-stonecard-noimg--labeled"><span>${escapeAttr(item.placeholderLabel)}</span></div>`;
  }else{
    mediaHtml = '';
  }
  // item.bodyPending (2026-07-23, added for the Feldspar Family Guide's
  // "When the Light Moves" cards) marks the caption itself as provisional
  // via the shared fg-placeholder-note style. Calcite's and Fluorite's items
  // never set this, so their captions render exactly as before.
  const textClass = item.bodyPending ? 'fg-photocard-text fg-placeholder-note' : 'fg-photocard-text';
  return `<div class="fg-photocard">
    <div class="fg-photocard-media">${mediaHtml}</div>
    <div class="fg-photocard-body">
      <div class="fg-photocard-title">${escapeAttr(item.title||'')}</div>
      <p class="${textClass}">${escapeAttr(item.body||'')}</p>
    </div>
  </div>`;
}

/* ── 4. How to Recognize Calcite ─────────────────────────────────────── */
function familyGuideRecognitionHtml(guide){
  const items = (guide.recognition||{}).items||[];
  const cards = items.map(fgPhotoCardHtml).join('');
  return `<section class="fg-section" id="fg-recognize">
    <h2 class="fg-h2">How to Recognize Calcite</h2>
    <p class="fg-lead">Look for these hallmarks that connect the family.</p>
    <div class="fg-photo-grid fg-photo-grid--4">${cards}</div>
  </section>`;
}

/* ── 5. Shapes Calcite Takes ─────────────────────────────────────────── */
function familyGuideShapesHtml(guide){
  const items = (guide.shapes||{}).items||[];
  const cards = items.map(fgPhotoCardHtml).join('');
  return `<section class="fg-section" id="fg-shapes">
    <h2 class="fg-h2">Shapes Calcite Takes</h2>
    <p class="fg-lead">These are the most common forms you’ll see.</p>
    <div class="fg-photo-grid fg-photo-grid--3">${cards}</div>
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
    ${t.sectionIntro?`<p class="fg-lead fg-lead--extended-intro">${escapeAttr(t.sectionIntro)}</p>`:''}
    <div class="fg-card-grid fg-card-grid--4">${cards}</div>
  </section>`;
}

/* ── 7. In Your Collection — one composed closing field-guide section: a
   full-width Care for It panel over two smaller Remember This / Watch For
   panels. Replaces the earlier four-box Essentials section (that data is
   kept archived below as essentials, unused). guide.collection.editorialNote
   (added for Quartz's 2026-07-22 first pass, where no approved collection
   copy exists yet) marks the whole section's body text as a placeholder via
   fg-placeholder-note instead of the normal fg-fact-body styling. ── */
function familyGuideCollectionHtml(guide){
  const c = guide.collection||{};
  const care = c.careForIt||{};
  const pending = !!c.editorialNote;
  const bodyClass = pending ? 'fg-fact-body fg-placeholder-note' : 'fg-fact-body';
  return `<section class="fg-section" id="fg-collection">
    <h2 class="fg-h2">${escapeAttr(c.title||'In Your Collection')}</h2>
    ${c.intro?`<p class="fg-lead fg-lead--wide">${escapeAttr(c.intro)}</p>`:''}
    ${pending?`<p class="fg-placeholder-banner">Editorial copy pending — layout shell for review only.</p>`:''}
    <div class="fg-collection-grid">
      <div class="fg-collection-care">
        <div class="fg-collection-panel-title">Care for It</div>
        ${care.intro?`<p class="${bodyClass}">${escapeAttr(care.intro)}</p>`:''}
        ${fgList(care.bullets||[], pending?'fg-placeholder-note':'')}
      </div>
      <div class="fg-collection-sub">
        <div class="fg-collection-panel-title">Remember This</div>
        <p class="${bodyClass}">${escapeAttr(c.rememberThis||'')}</p>
      </div>
      <div class="fg-collection-sub">
        <div class="fg-collection-panel-title">Watch For</div>
        <p class="${bodyClass}">${escapeAttr(c.watchFor||'')}</p>
        ${c.watchForNote?`<p class="fg-fact-body fg-placeholder-note">${escapeAttr(c.watchForNote)}</p>`:''}
      </div>
    </div>
  </section>`;
}

/* ── Discreet image-credits block for the third-party educational photos
   used in Recognition and Shapes. Source of record: guide.imageCredits. ── */
function familyGuideImageCreditsHtml(guide){
  const items = guide.imageCredits||[];
  if(!items.length) return '';
  const rows = items.map(c=>`<li class="fg-credit-item">
    <span class="fg-credit-title">${escapeAttr(c.title||'')}</span>
    <span class="fg-credit-meta">Photo: ${escapeAttr(c.creator||'')} · <a href="${escapeAttr(c.source||'#')}" target="_blank" rel="noopener">source</a> · <a href="${escapeAttr(c.licenseUrl||'#')}" target="_blank" rel="noopener">${escapeAttr(c.license||'')}</a>${c.modified?' · '+escapeAttr(c.modified):''}</span>
  </li>`).join('');
  return `<details class="fg-credits">
    <summary class="fg-credits-summary">Image credits</summary>
    <ul class="fg-credits-list">${rows}</ul>
  </details>`;
}

/* ── 8. Closing callout — one CTA only. guide.closingCallout carries the
   exact locked one-line closing per guide (added 2026-07-22 alongside the
   Quartz Family Guide; Calcite's data now carries its original hardcoded
   line verbatim so this generalization changes nothing about its output). ── */
function familyGuideClosingHtml(guide){
  const line = guide.closingCallout || '';
  return `<section class="fg-closing" id="fg-closing">
    ${line?`<p class="fg-closing-line">${escapeAttr(line)}</p>`:''}
    <button type="button" class="btn btn-accent fg-closing-btn" onclick="switchTabByName('encyclopedia')">Return to Encyclopedia</button>
  </section>`;
}

/* ══════════════════════════════════════════════════════════════════════
   QUARTZ FAMILY GUIDE — generic-path section renderers (2026-07-22 first
   implementation pass). These are new, reusable component types that the
   Calcite page has no equivalent of (it doesn't need them), so they live
   alongside Calcite's section functions rather than replacing anything.
   Driven entirely by data/family-guides.json — no per-family branching. ══ */

/* ── Meet Eight Expressions — reuses fgExpressionCardHtml in showIdentity
   mode (image, name, identity label, Quick View line, Quick View action)
   per Christie's locked Quartz visual hierarchy. placeholderOk:true was
   added for Fluorite (2026-07-22) so cards with no approved identity/Quick
   View copy yet show a marked "Editorial copy pending" line instead of a
   blank one; Quartz's members all carry real copy, so this is a no-op for
   them. Members with no stoneId (Fluorite's Yttrium and Candy Fluorite)
   render as non-clickable family-guide-only cards via the dispatcher. ── */
function familyGuideExpressionsHtml(guide){
  const ex = guide.expressions||{};
  const cards = (ex.members||[]).map(m=>fgExpressionCardHtml(m, {showIdentity:true, placeholderOk:true})).filter(Boolean).join('');
  return `<section class="fg-section" id="fg-expressions">
    <h2 class="fg-h2">${escapeAttr(ex.title||'Meet the Expressions')}</h2>
    ${ex.intro?`<p class="fg-lead">${escapeAttr(ex.intro)}</p>`:''}
    <div class="fg-card-grid fg-card-grid--4">${cards}</div>
  </section>`;
}

/* ── What Changes the Name? — five-category naming-logic grid. Text-only
   (no photography) by design: the goal is to make the *kind* of distinction
   each name is making legible at a glance, not to catalog every material.
   Each category is a set of word examples, not a claim that every example is
   its own mineral species (per Christie's implementation goals). ── */
function familyGuideWhatChangesNameHtml(guide){
  const w = guide.whatChangesName||{};
  const cats = w.categories||[];
  const cards = cats.map((cat,i)=>`<div class="fg-namecard">
    <div class="fg-namecard-index">${i+1}</div>
    <div class="fg-namecard-label">${escapeAttr(cat.label||'')}</div>
    <div class="fg-namecard-chips">${(cat.examples||[]).map(e=>`<span class="fg-chip">${escapeAttr(e)}</span>`).join('')}</div>
  </div>`).join('');
  return `<section class="fg-section" id="fg-name-change">
    <h2 class="fg-h2">${escapeAttr(w.title||'What Changes the Name?')}</h2>
    ${w.question?`<p class="fg-lead fg-lead--question">${escapeAttr(w.question)}</p>`:''}
    <div class="fg-namegrid">${cards}</div>
  </section>`;
}

/* ── Growth Forms & Inclusions — two labeled subgroups reusing the stone-
   card component in placeholder-aware mode. No approved body copy exists
   for these cards yet (see guide.growthFormsInclusions.editorialNote); each
   card therefore shows its real name and image where available, and a
   visibly marked "Editorial copy pending" / "Photo pending" placeholder
   where not — never invented prose. ── */
function familyGuideGrowthFormsInclusionsHtml(guide){
  const g = guide.growthFormsInclusions;
  if(!g) return '';
  const growth = g.growthForms||{};
  const incl = g.inclusions||{};
  const growthCards = (growth.items||[]).map(m=>fgStoneCardHtml(m, {placeholderOk:true})).filter(Boolean).join('');
  const inclCards = (incl.items||[]).map(m=>fgStoneCardHtml(m, {placeholderOk:true})).filter(Boolean).join('');
  return `<section class="fg-section" id="fg-growth-forms">
    <h2 class="fg-h2">${escapeAttr(g.title||'Growth Forms & Inclusions')}</h2>
    ${g.editorialNote?`<p class="fg-placeholder-banner">Editorial copy pending — layout shell for review only.</p>`:''}
    <div class="fg-subgroup">
      <div class="fg-subgroup-label">${escapeAttr(growth.label||'Growth Forms')}</div>
      <div class="fg-card-grid fg-card-grid--4">${growthCards}</div>
    </div>
    <div class="fg-subgroup">
      <div class="fg-subgroup-label">${escapeAttr(incl.label||'Inclusions & Internal Features')}</div>
      <div class="fg-card-grid fg-card-grid--4">${inclCards}</div>
    </div>
  </section>`;
}

/* ── Where Agate, Chalcedony & Jasper Fit — a simple three-branch
   relationship guide, not a taxonomy chart. No approved relationship copy
   exists yet (see guide.relationship.editorialNote), so each branch shows a
   representative approved photo, its name, and a marked placeholder note. ── */
/* ── Relationship card (generalized 2026-07-23 for the Feldspar Family
   Guide's Moonstone decoder and Labradorite/Spectrolite/Larvikite strip).
   Quartz's Agate/Chalcedony/Jasper call below only ever passes {stoneId,
   label}, so item.badge/identityStatus/roleLines are always undefined for
   it and its markup is byte-for-byte unchanged from before this addition. ── */
function fgRelationshipCardHtml(item){
  const c = fgCrystal(item.stoneId);
  if(!c) return '';
  const imgSrc = (typeof firstEncyclopediaPhoto==='function') ? firstEncyclopediaPhoto(c) : '';
  const imgHtml = imgSrc
    ? `<img src="${escapeAttr(imgSrc)}" alt="${escapeAttr(c.n)}" loading="lazy">`
    : `<div class="fg-stonecard-noimg fg-stonecard-noimg--labeled"><span>Photo pending</span></div>`;
  const badgeHtml = item.badge ? `<span class="fg-badge">${escapeAttr(item.badge)}</span>` : '';
  const identityHtml = item.identityStatus ? `<p class="fg-fact-body">${escapeAttr(item.identityStatus)}</p>` : '';
  const roleHtml = (item.roleLines && item.roleLines.length) ? fgList(item.roleLines) : '';
  return `<div class="fg-relationship-card">
    <button type="button" class="fg-relationship-media" onclick="openDetail('${escapeAttr(c.i)}')" title="Open ${escapeAttr(c.n)} in Quick View">${imgHtml}</button>
    <div class="fg-relationship-label">${escapeAttr(item.label||c.n)}</div>
    ${badgeHtml}
    ${identityHtml}
    ${roleHtml}
    <p class="fg-fact-body fg-placeholder-note">Editorial copy pending.</p>
  </div>`;
}

function familyGuideRelationshipHtml(guide){
  const r = guide.relationship;
  if(!r) return '';
  const branches = (r.branches||[]).map(b=>fgRelationshipCardHtml({stoneId:b.stoneId, label:b.label})).filter(Boolean).join('');
  // r.bodyParagraph (added 2026-07-23, family-grouping correction) carries
  // Christie's approved section-level explanation: Agate, Chalcedony, and
  // Jasper are organized as separate encyclopedia families, not browseable
  // Quartz-family subgroups, even though they share the wider quartz story
  // mineralogically. r.editorialNote still supported for any future guide
  // that reuses this function before its own section-level copy is approved.
  return `<section class="fg-section" id="fg-relationship">
    <h2 class="fg-h2">${escapeAttr(r.title||'Where Agate, Chalcedony & Jasper Fit')}</h2>
    ${r.bodyParagraph?`<p class="fg-lead fg-lead--wide">${escapeAttr(r.bodyParagraph)}</p>`:''}
    ${r.editorialNote?`<p class="fg-placeholder-banner">Editorial copy pending — layout shell for review only.</p>`:''}
    <div class="fg-relationship-grid">${branches}</div>
  </section>`;
}

/* ══════════════════════════════════════════════════════════════════════
   FLUORITE FAMILY GUIDE — dedicated section renderers (2026-07-22 first
   implementation pass). Fluorite's page order (One Mineral Many Colors,
   Cube/Octahedron/Cleavage, Zoning & Phantoms, Fluorescence) has no overlap
   with Quartz's generic-path sections, so it gets its own assembly function
   below rather than being forced into familyGuideGenericHtml. This is
   purely additive: Quartz's generic path and Calcite's fixed path are both
   untouched by anything in this block. ══ */

/* ── One Mineral, Many Colors — reuses the same six-image contained-grid
   pattern established for Calcite's "Many Colors and Patterns" card
   (fg-photocard-swatch--6), built from Fluorite's six canonical color
   entries. No approved body copy exists yet for this section, so only the
   visual grid renders, with a marked pending banner instead of invented
   explanatory text. ── */
function familyGuideManyColorsHtml(guide){
  const m = guide.manyColors;
  if(!m) return '';
  const imgs = (m.swatchStoneIds||[]).map(id=>{
    const c = fgCrystal(id);
    const src = (c && typeof firstEncyclopediaPhoto==='function') ? firstEncyclopediaPhoto(c) : '';
    return src ? `<div class="fg-photocard-swatch-cell"><img src="${escapeAttr(src)}" alt="${escapeAttr(c.n)}" loading="lazy"></div>` : '';
  }).filter(Boolean).join('');
  return `<section class="fg-section" id="fg-many-colors">
    <h2 class="fg-h2">${escapeAttr(m.title||'One Mineral, Many Colors')}</h2>
    ${m.editorialNote?`<p class="fg-placeholder-banner">Editorial copy pending — layout shell for review only.</p>`:''}
    <div class="fg-single-visual"><div class="fg-photocard-swatch fg-photocard-swatch--6">${imgs}</div></div>
  </section>`;
}

/* ── Cube, Octahedron, or Cleavage Piece? — three-position comparison using
   Christie's approved explanatory copy verbatim for each position. Reuses
   fgPhotoCardHtml's new placeholderLabel branch since none of the three
   licensed educational images (see guide.cubeOctahedronCleavage.items[].
   pendingAsset for filename/creator/license) are retained locally yet. ── */
function familyGuideCubeOctahedronHtml(guide){
  const s = guide.cubeOctahedronCleavage;
  if(!s) return '';
  const cards = (s.items||[]).map(fgPhotoCardHtml).join('');
  return `<section class="fg-section" id="fg-cube-octahedron">
    <h2 class="fg-h2">${escapeAttr(s.title||'Cube, Octahedron, or Cleavage Piece?')}</h2>
    <div class="fg-photo-grid fg-photo-grid--3">${cards}</div>
  </section>`;
}

/* ── Color Zoning, Banding & Phantoms — the visual-pattern vocabulary
   (core / edge bands / growth zones / layered bands / box phantoms) is
   rendered as neutral labeled chips, not as sentences, since no approved
   explanatory paragraph exists yet. The one approved educational image
   candidate (see guide.zoningPhantoms.pendingAsset) is not retained
   locally, so a labeled placeholder renders in its place. ── */
function familyGuideZoningHtml(guide){
  const z = guide.zoningPhantoms;
  if(!z) return '';
  const patterns = (z.patterns||[]).map(p=>`<span class="fg-chip">${escapeAttr(p)}</span>`).join('');
  return `<section class="fg-section" id="fg-zoning">
    <h2 class="fg-h2">${escapeAttr(z.title||'Color Zoning, Banding & Phantoms')}</h2>
    ${z.editorialNote?`<p class="fg-placeholder-banner">Editorial copy pending — layout shell for review only.</p>`:''}
    <div class="fg-single-visual"><div class="fg-stonecard-noimg fg-stonecard-noimg--labeled"><span>Photo pending</span></div></div>
    ${patterns?`<div class="fg-zoning-chips">${patterns}</div>`:''}
  </section>`;
}

/* ── Why Some Fluorite Glows — Christie's approved fluorescence paragraph,
   verbatim, plus a labeled placeholder for the one approved comparison
   image candidate (see guide.fluorescence.pendingAsset), not yet retained
   locally. ── */
function familyGuideFluorescenceHtml(guide){
  const f = guide.fluorescence;
  if(!f) return '';
  return `<section class="fg-section" id="fg-fluorescence">
    <h2 class="fg-h2">${escapeAttr(f.title||'Why Some Fluorite Glows')}</h2>
    <div class="fg-single-visual"><div class="fg-stonecard-noimg fg-stonecard-noimg--labeled"><span>Photo pending</span></div></div>
    ${f.paragraph?`<p class="fg-lead fg-lead--wide">${escapeAttr(f.paragraph)}</p>`:''}
  </section>`;
}

/* ── Fluorite guide assembly — its own approved section order. ── */
function familyGuideFluoriteHtml(guide){
  return `
  <div class="fg-guide" data-family-slug="${escapeAttr(guide.slug)}">
    ${familyGuideHeroHtml(guide)}
    ${familyGuideExpressionsHtml(guide)}
    ${familyGuideManyColorsHtml(guide)}
    ${familyGuideCubeOctahedronHtml(guide)}
    ${familyGuideZoningHtml(guide)}
    ${familyGuideFluorescenceHtml(guide)}
    ${familyGuideCollectionHtml(guide)}
    ${familyGuideClosingHtml(guide)}
    ${familyGuideImageCreditsHtml(guide)}
  </div>`;
}

/* ══════════════════════════════════════════════════════════════════════
   FELDSPAR FAMILY GUIDE — dedicated section renderers (2026-07-23 first
   implementation pass). Feldspar's page order (Two Great Branches, When the
   Light Moves, Moonstone decoder, Labradorite/Spectrolite/Larvikite,
   Sunstone) has no overlap with Quartz's generic-path sections or
   Fluorite's dedicated sections, so it gets its own assembly function below.
   Purely additive: nothing here touches a Calcite, Quartz, or Fluorite
   selector or function. ══ */

/* ── Two Great Branches — a plain two-card branch guide (Potassium
   Feldspar / Plagioclase Feldspar), each holding the brief's concise label
   chips. No stone photography by design — these are mineral-species and
   material labels, not roster entries. No approved explanatory prose exists
   yet (see guide.branches.editorialNote). ── */
function familyGuideBranchesHtml(guide){
  const b = guide.branches;
  if(!b) return '';
  const cards = (b.items||[]).map(item=>`<div class="fg-branch-card">
    <div class="fg-branch-title">${escapeAttr(item.title||'')}</div>
    <div class="fg-branch-chips">${(item.labels||[]).map(l=>`<span class="fg-chip">${escapeAttr(l)}</span>`).join('')}</div>
  </div>`).join('');
  return `<section class="fg-section" id="fg-branches">
    <h2 class="fg-h2">${escapeAttr(b.title||'Two Great Branches')}</h2>
    ${b.editorialNote?`<p class="fg-placeholder-banner">Editorial copy pending — layout shell for review only.</p>`:''}
    <div class="fg-branch-grid">${cards}</div>
  </section>`;
}

/* ── When the Light Moves — four-part optical-effects comparison, reusing
   fgPhotoCardHtml's placeholderLabel/pendingAsset branch exactly as
   Fluorite's Cube/Octahedron/Cleavage section does. No approved explanatory
   paragraph exists yet for any of the four cards. ── */
function familyGuideLightMovesHtml(guide){
  const l = guide.lightMoves;
  if(!l) return '';
  const cards = (l.items||[]).map(fgPhotoCardHtml).join('');
  return `<section class="fg-section" id="fg-light-moves">
    <h2 class="fg-h2">${escapeAttr(l.title||'When the Light Moves')}</h2>
    ${l.editorialNote?`<p class="fg-placeholder-banner">Editorial copy pending — layout shell for review only.</p>`:''}
    <div class="fg-photo-grid fg-photo-grid--4">${cards}</div>
  </section>`;
}

/* ── Moonstone Is Not One Simple Name — five-card decoder reusing
   fgRelationshipCardHtml's badge/identityStatus fields. identityStatus text
   reflects only facts already controlled elsewhere (this brief's Rainbow
   Moonstone guardrail; Green Moonstone's existing catalog species of
   Garnierite) — not new editorial claims. Grid uses the --5 modifier so it
   doesn't affect the 3-column Where Agate/Chalcedony/Jasper Fit grid or the
   Labradorite/Spectrolite/Larvikite strip below. ── */
function familyGuideMoonstoneDecoderHtml(guide){
  const m = guide.moonstoneDecoder;
  if(!m) return '';
  const cards = (m.items||[]).map(fgRelationshipCardHtml).filter(Boolean).join('');
  return `<section class="fg-section" id="fg-moonstone-decoder">
    <h2 class="fg-h2">${escapeAttr(m.title||'Moonstone Is Not One Simple Name')}</h2>
    ${m.editorialNote?`<p class="fg-placeholder-banner">Editorial copy pending — layout shell for review only.</p>`:''}
    <div class="fg-relationship-grid fg-relationship-grid--5">${cards}</div>
  </section>`;
}

/* ── Labradorite, Spectrolite & Larvikite — three-card relationship strip
   reusing the plain 3-column fg-relationship-grid. Larvikite carries a
   visible badge identifying it as a rock, not a Labradorite variety. ── */
function familyGuideLslHtml(guide){
  const s = guide.lsl;
  if(!s) return '';
  const cards = (s.items||[]).map(fgRelationshipCardHtml).filter(Boolean).join('');
  return `<section class="fg-section" id="fg-lsl">
    <h2 class="fg-h2">${escapeAttr(s.title||'Labradorite, Spectrolite & Larvikite')}</h2>
    ${s.editorialNote?`<p class="fg-placeholder-banner">Editorial copy pending — layout shell for review only.</p>`:''}
    <div class="fg-relationship-grid">${cards}</div>
  </section>`;
}

/* ── Sunstone and the Spark Within — focused single-stone teaching section:
   one labeled placeholder for the planned aventurescence photo, plus the
   roster's Sunstone card centered below. ── */
function familyGuideSunstoneHtml(guide){
  const s = guide.sunstoneSection;
  if(!s) return '';
  const cardHtml = fgStoneCardHtml({stoneId:s.stoneId}, {placeholderOk:true});
  return `<section class="fg-section" id="fg-sunstone">
    <h2 class="fg-h2">${escapeAttr(s.title||'Sunstone and the Spark Within')}</h2>
    ${s.editorialNote?`<p class="fg-placeholder-banner">Editorial copy pending — layout shell for review only.</p>`:''}
    <div class="fg-single-visual"><div class="fg-stonecard-noimg fg-stonecard-noimg--labeled"><span>Photo pending</span></div></div>
    <div class="fg-sunstone-card-wrap">${cardHtml}</div>
  </section>`;
}

/* ── Feldspar guide assembly — its own approved section order. ── */
function familyGuideFeldsparHtml(guide){
  return `
  <div class="fg-guide" data-family-slug="${escapeAttr(guide.slug)}">
    ${familyGuideHeroHtml(guide)}
    ${familyGuideExpressionsHtml(guide)}
    ${familyGuideBranchesHtml(guide)}
    ${familyGuideLightMovesHtml(guide)}
    ${familyGuideMoonstoneDecoderHtml(guide)}
    ${familyGuideLslHtml(guide)}
    ${familyGuideSunstoneHtml(guide)}
    ${familyGuideCollectionHtml(guide)}
    ${familyGuideClosingHtml(guide)}
    ${familyGuideImageCreditsHtml(guide)}
  </div>`;
}

/* ── Generic guide assembly — for any family guide other than Calcite,
   Fluorite, or Feldspar (currently: Quartz). Calcite keeps its own fixed,
   unmodified assembly below so its approved layout and output are
   guaranteed unaffected by this addition. ── */
function familyGuideGenericHtml(guide){
  return `
  <div class="fg-guide" data-family-slug="${escapeAttr(guide.slug)}">
    ${familyGuideHeroHtml(guide)}
    ${familyGuideExpressionsHtml(guide)}
    ${familyGuideWhatChangesNameHtml(guide)}
    ${familyGuideGrowthFormsInclusionsHtml(guide)}
    ${familyGuideRelationshipHtml(guide)}
    ${familyGuideCollectionHtml(guide)}
    ${familyGuideClosingHtml(guide)}
    ${familyGuideImageCreditsHtml(guide)}
  </div>`;
}

/* ── Full guide assembly — approved public section order. Calcite's path is
   untouched (same functions, same order) so its rendered output cannot
   regress; Fluorite uses its own dedicated assembly (its section set has no
   overlap with Quartz's); every other guide (currently: Quartz) uses the
   generic assembly above. */
function familyGuideHtml(guide){
  if(guide.slug==='fluorite') return familyGuideFluoriteHtml(guide);
  if(guide.slug==='feldspar') return familyGuideFeldsparHtml(guide);
  if(guide.slug!=='calcite') return familyGuideGenericHtml(guide);
  return `
  <div class="fg-guide" data-family-slug="${escapeAttr(guide.slug)}">
    ${familyGuideHeroHtml(guide)}
    ${familyGuideVarietiesHtml(guide)}
    ${familyGuideRecognitionHtml(guide)}
    ${familyGuideShapesHtml(guide)}
    ${familyGuideExtendedFamilyHtml(guide)}
    ${familyGuideCollectionHtml(guide)}
    ${familyGuideClosingHtml(guide)}
    ${familyGuideImageCreditsHtml(guide)}
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
