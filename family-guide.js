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
   are simply not read by any function below. Nothing here deletes that content.

   2026-07-23 — Back-navigation fix: opening a guide from Crystals 101 ->
   Crystal Families now patches the *origin* history entry (via
   fgPatchOriginHistoryEntry(), called from openFamilyGuide() below) so its
   URL also records the active 101 subsection, and the shared popstate
   handler restores that subsection after Back. See the comments on both
   functions for the root cause and why the fix is scoped the way it is. */

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

// ── Origin-state capture for family-guide Back navigation (2026-07-23) ──
// Root cause of the reported bug: switching to the Crystals 101 tab (via
// switchTab/switchTabByName, including the one this popstate handler already
// called) always runs init101(), which unconditionally shows the "work"
// subsection — the active Crystal Families/Grids/Shapes/Roles subsection was
// never part of the URL, only a same-tab in-page toggle. So the history
// entry a family-guide's pushState left behind (created the moment a Crystal
// Families tile was clicked) always resolved back to a bare tab=101 URL, and
// Back landed on the 101 landing view instead of Crystal Families.
//
// Fix, kept to one shared, guide-agnostic helper: right before pushing the
// new history entry for the guide, patch the CURRENT entry (the one the
// pushState will sit on top of) via replaceState so its URL also records
// which 101 subsection was active — read from the same localStorage key
// (spl_101_section) that show101() in 101.js already wrote on every
// subsection switch, previously unread by anything. No new state-tracking
// mechanism, no per-guide branching: any tab could adopt this same
// "?section=" convention later without touching this function again, and
// nothing here fires unless the tab the guide was opened from is '101'.
function fgPatchOriginHistoryEntry(){
  try{
    const params = new URLSearchParams(window.location.search);
    if(params.get('tab')==='101'){
      let sec = null;
      try{ sec = localStorage.getItem('spl_101_section'); }catch(e){}
      if(sec){
        params.set('section', sec);
        const url = window.location.pathname+'?'+params.toString()+window.location.hash;
        history.replaceState(history.state, '', url);
      }
    }
  }catch(e){}
}

// ── Entry point for tile/link clicks — pushes a new history entry so Back
// returns to whatever the user was looking at before opening the guide. ──
function openFamilyGuide(rawSlug, opts){
  const slug = familyGuideSlugify(rawSlug);
  if(!slug) return;
  opts = opts || {};
  fgPatchOriginHistoryEntry();
  const params = new URLSearchParams(window.location.search);
  params.set('tab','family');
  params.set('family',slug);
  params.delete('section'); // origin-only marker (see fgPatchOriginHistoryEntry); not meaningful on a guide URL
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
  fgSetFooterCreditsLink(slug);
  if(opts.scrollToHash!==false) scrollToFamilyGuideHash();
}

// ── Page-specific footer Photo Credits routing (2026-08-05) — the footer
// itself is static per-page markup (encyclopedia.html), shared across
// every tab including every family guide, so this cannot be a hard-coded
// href change without redirecting every guide/tab to the Copper section.
// Instead: switchTab()/switchTabByName() in app.js reset the footer link
// (id="footerCreditsLink") to its normal "credits.html" destination at
// the start of every tab switch; this function then runs afterward, once
// per family-guide render, and only overrides it to an anchored
// "credits.html#<slug>" destination for guides listed in anchoredSlugs
// below (Copper, Calcite, Garnet, Tourmaline). Every other guide/tab keeps
// the default reset value untouched.
function fgSetFooterCreditsLink(slug){
  const link = document.getElementById('footerCreditsLink');
  if(!link) return;
  const anchoredSlugs = {copper:'credits.html#copper-minerals', calcite:'credits.html#calcite', garnet:'credits.html#garnet', tourmaline:'credits.html#tourmaline', beryl:'credits.html#beryl'};
  link.setAttribute('href', anchoredSlugs[slug] || 'credits.html');
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
  // Restore the originating Crystal Families (or other) 101 subsection when
  // the entry we've popped back to carries one — see fgPatchOriginHistoryEntry
  // above for how/why it got there. switchTabByName('101') already ran
  // init101() synchronously above, which always defaults to 'work'; this
  // runs after it in the same tick, so it's the last word on which
  // subsection ends up active. No-op for every other tab and for any 101
  // entry that never went through openFamilyGuide (e.g. a plain 101 nav
  // click), so ordinary Crystals 101 navigation is unaffected.
  if(t==='101'){
    const sec = params && params.get('section');
    if(sec && typeof show101==='function') show101(sec);
    // Smaller Families Explore-button Back navigation (2026-08-05) — scoped
    // to the six Smaller Families profile-row Explore controls only (see
    // jumpToSmallFamilyProfile() in 101.js, which is the only code that
    // ever sets this "profile" param). No-op for every other 101 entry,
    // including plain Crystal Families navigation and family-guide Back.
    // show101('families') above already ran initFamilies()/
    // renderSecondaryFamilies() synchronously, so the target card exists
    // in the DOM by the time this runs.
    const profile = sec==='families' && params && params.get('profile');
    if(profile){
      // A single deferred scroll (even one timed to the DOM update via
      // rAF) was reported landing back at the top in real Chrome, though
      // it could not be reproduced locally, including under simulated slow
      // network/CPU. Something after the first scroll — a late layout
      // shift the local repro couldn't trigger — is the likely cause. This
      // re-asserts the scroll position several times over the following
      // second instead of trusting one attempt: each pass is an instant
      // (non-smooth) snap, so it can't fight an in-progress animation the
      // way a repeated 'smooth' call could.
      const scrollToProfileCard=()=>{
        const card=Array.from(document.querySelectorAll('#fam-cards-secondary .smallfam-card'))
          .find(c=>{const n=c.querySelector('.smallfam-name');return n&&n.textContent===profile;});
        if(!card) return;
        try{ card.scrollIntoView({behavior:'auto',block:'center'}); }catch(e){ card.scrollIntoView(); }
      };
      requestAnimationFrame(()=>{ requestAnimationFrame(scrollToProfileCard); });
      [150,350,600,1000].forEach(ms=>setTimeout(scrollToProfileCard,ms));
    }
  }
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
// ── Image-resolution logic shared by fgHeroMediaHtml (below) and the
// Calcite-only hero recomposition (familyGuideCalciteHeroHtml, added in the
// Calcite cleanup pass) — extracted so the second consumer doesn't fork or
// re-derive this fallback chain. Returns just the <img> markup array;
// fgHeroMediaHtml's own output is unchanged by this extraction. ──
function fgHeroMediaImgs(guide){
  let ids = (guide.hero && guide.hero.mediaStoneIds)
    || (guide.slug==='calcite' ? ['C-0007','C-0016','C-0014','C-0015'] : []); // legacy Calcite spread: Blue, Orange, Mangano, Optical
  // Dynamic fallback (2026-07-23, added for Agate) — used only when a guide
  // supplies guide.hero.mediaDynamicFilterValue instead of a curated
  // mediaStoneIds list, e.g. because the exact live roster couldn't be
  // verified against Supabase in the authoring session and a hardcoded list
  // risked showing stones that aren't actually tagged that family. Pulls the
  // first four live CRYSTALS matching that family value, same field (c.fam)
  // and same live-data source the Crystals 101 family tiles already use.
  // Every other guide always supplies mediaStoneIds directly, so this branch
  // never runs for Calcite/Quartz/Fluorite/Feldspar/Chalcedony.
  if(!ids.length && guide.hero && guide.hero.mediaDynamicFilterValue && typeof CRYSTALS!=='undefined' && Array.isArray(CRYSTALS)){
    ids = CRYSTALS.filter(c=>c.fam===guide.hero.mediaDynamicFilterValue).map(c=>c.i).slice(0,4);
  }
  const imgs = ids.map(id=>{
    const c = fgCrystal(id);
    const src = (c && typeof firstEncyclopediaPhoto==='function') ? firstEncyclopediaPhoto(c) : '';
    return src ? `<img src="${escapeAttr(src)}" alt="${escapeAttr(c.n)}" loading="lazy">` : '';
  }).filter(Boolean);
  // guide.hero.mediaFiles (2026-08-19, added for Obsidian's revision pass) —
  // exact encyclopedia filenames instead of a stoneId lookup. Needed because
  // firstEncyclopediaPhoto always resolves a stoneId to the FIRST entry in its
  // ENCYCLOPEDIA_PHOTOS array, which would give Gold Sheen Obsidian
  // (C-0140) its plain gold-sheen-obsidian.webp — but Obsidian's brief
  // specifically calls for the "-large-sphere" second array entry in the
  // hero (while the roster card two sections below correctly keeps the
  // plain default). No other guide sets this field, so every existing
  // mediaStoneIds/mediaDynamicFilterValue/image/imageUrl hero is unaffected.
  if(!imgs.length && guide.hero && Array.isArray(guide.hero.mediaFiles) && guide.hero.mediaFiles.length){
    guide.hero.mediaFiles.forEach(mf=>{
      const file = typeof mf==='string' ? mf : (mf && mf.file);
      if(!file) return;
      const alt = (mf && mf.alt) || guide.displayName || guide.slug;
      imgs.push(`<img src="${escapeAttr(SUPABASE_ENC+file)}" alt="${escapeAttr(alt)}" loading="lazy">`);
    });
  }
  if(!imgs.length && guide.hero && guide.hero.image){
    imgs.push(`<img src="${escapeAttr(SUPABASE_ENC+guide.hero.image)}" alt="${escapeAttr(guide.displayName||guide.slug)}">`);
  }
  // guide.hero.imageUrl (2026-08-07, added for Agate) — a fully-resolved
  // image path (local assets/family-guide-<slug>/ file or an absolute URL)
  // for a curated, non-stone-derived family photograph, distinct from
  // guide.hero.image above which always prefixes SUPABASE_ENC and therefore
  // only ever resolves to the encyclopedia stone-photo bucket. No other
  // guide sets this field, so every existing hero.image/mediaStoneIds/
  // mediaDynamicFilterValue path is unaffected.
  if(!imgs.length && guide.hero && guide.hero.imageUrl){
    imgs.push(`<img src="${escapeAttr(guide.hero.imageUrl)}" alt="${escapeAttr(guide.hero.imageAlt||guide.displayName||guide.slug)}">`);
  }
  return imgs;
}
function fgHeroMediaHtml(guide){
  const imgs = fgHeroMediaImgs(guide);
  // 2026-07-23 (added for Chalcedony, whose roster has only two members):
  // a plain 2x2 grid leaves an empty bottom row when there are only two
  // images. This modifier switches to a single row instead; it's applied
  // purely based on imgs.length, so every existing guide's four-image hero
  // (Calcite, Quartz, Fluorite, Feldspar) keeps the exact same 2x2 markup.
  // 2026-07-31 (added for Copper Minerals' three-stone hero spread): a
  // single row of three instead of a 2x2 grid with an empty fourth cell.
  // Only applied when exactly three images are supplied; every existing
  // four-image or two-image hero is unaffected.
  const gridModClass = imgs.length===2 ? ' fg-hero-media-grid--2' : (imgs.length===3 ? ' fg-hero-media-grid--3' : '');
  return `<div class="fg-hero-media">
    <div class="fg-hero-media-grid${gridModClass}">${imgs.join('')}</div>
    <span class="fg-hero-media-label">Family photograph — coming soon</span>
  </div>`;
}
/* Hero bottom band accepts either guide.overview.paragraph (single string,
   Calcite's original shape) or guide.overview.paragraphs (array, used by
   Quartz to preserve its approved two-paragraph introduction break). Both
   render with the same .fg-hero-intro-text styling.
   hero.imageLegend (2026-08-19, added for Beryl) — an optional short
   identification caption ("1 Golden Beryl · 2 Heliodor · ...") rendered
   directly beneath the hero photo, distinct from the photo credit (still
   routed through the shared footer pattern). Only wraps fgHeroMediaHtml's
   output in an extra column div when the field is set, so every other
   guide's hero media markup is completely unchanged. */
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
        ${Array.isArray(hero.condensedIntro)
          ? hero.condensedIntro.map(p=>`<p class="fg-hero-body">${escapeAttr(p)}</p>`).join('')
          : (hero.condensedIntro?`<p class="fg-hero-body">${escapeAttr(hero.condensedIntro)}</p>`:'')}
        ${hero.emphasisLine?`<p class="fg-hero-emphasis">${escapeAttr(hero.emphasisLine)}</p>`:''}
        ${hero.question?`<div class="fg-hero-prompt">
          ${hero.promptLeadIn?`<div class="fg-hero-prompt-lead">${escapeAttr(hero.promptLeadIn)}</div>`:''}
          <div class="fg-hero-question">${escapeAttr(hero.question)}</div>
          ${hero.supportingLine?`<div class="fg-hero-supporting">${escapeAttr(hero.supportingLine)}</div>`:''}
        </div>`:''}
      </div>
      ${hero.imageLegend
        ? `<div class="fg-hero-media-col">${fgHeroMediaHtml(guide)}<p class="fg-hero-media-legend">${escapeAttr(hero.imageLegend)}</p></div>`
        : fgHeroMediaHtml(guide)}
    </div>
    ${introParas.length?`<div class="fg-hero-divider"></div>
    <div class="fg-hero-intro">
      ${introParas.map(p=>`<p class="fg-hero-intro-text">${escapeAttr(p)}</p>`).join('')}
    </div>`:''}
  </section>`;
}

/* ── Calcite-only hero recomposition (final cleanup pass, scoped to
   Calcite per Christie's review) — a single top row: copy column left
   (eyebrow, title, subtitle, opening paragraph, then the reflective
   prompt "Calcite asks: / What wants to move?" directly beneath it) and
   the collage right, both top-aligned. The prompt previously lived in its
   own full-width row below the top row (with, at an earlier point, a
   divider above it); both the separate row and the divider are gone —
   it's now just the last block in the copy column, separated from the
   opening paragraph by ordinary margin spacing (see styles.css). The hero
   box ends right after it. The geological overview paragraph that used to
   render inside the hero as .fg-hero-intro still renders unboxed, outside
   the hero, via familyGuideCalciteBridgeHtml below. familyGuideHeroHtml
   above centers the media column vertically and has no equivalent
   top-aligned/compact layout, so this stays a dedicated function called
   only from Calcite's own assembly, leaving familyGuideHeroHtml
   completely untouched for every other guide. Reuses fgHeroMediaImgs()
   for the identical image-resolution logic (including Calcite's legacy
   four-ID fallback); only the surrounding markup differs from
   fgHeroMediaHtml — the "Family photograph — coming soon" label moves out
   of the image overlay to a caption below the collage (see
   .fg-hero-media-caption in styles.css). */
function familyGuideCalciteHeroHtml(guide){
  const hero = guide.hero||{};
  const imgs = fgHeroMediaImgs(guide);
  const gridModClass = imgs.length===2 ? ' fg-hero-media-grid--2' : (imgs.length===3 ? ' fg-hero-media-grid--3' : '');
  return `<section class="fg-hero" id="fg-hero">
    <div class="fg-hero-top">
      <div class="fg-hero-copy">
        ${hero.eyebrow?`<div class="fg-eyebrow">${escapeAttr(hero.eyebrow)}</div>`:''}
        <h1 class="fg-hero-title">${escapeAttr(hero.title||guide.displayName)}</h1>
        ${hero.signatureLine?`<p class="fg-hero-sub">${escapeAttr(hero.signatureLine)}</p>`:''}
        ${hero.condensedIntro?`<p class="fg-hero-body">${escapeAttr(hero.condensedIntro)}</p>`:''}
        ${hero.emphasisLine?`<p class="fg-hero-emphasis">${escapeAttr(hero.emphasisLine)}</p>`:''}
        ${hero.question?`<div class="fg-hero-prompt">
          ${hero.promptLeadIn?`<div class="fg-hero-prompt-lead">${escapeAttr(hero.promptLeadIn)}</div>`:''}
          <div class="fg-hero-question">${escapeAttr(hero.question)}</div>
          ${hero.supportingLine?`<div class="fg-hero-supporting">${escapeAttr(hero.supportingLine)}</div>`:''}
        </div>`:''}
      </div>
      <div class="fg-hero-media-col">
        <div class="fg-hero-media">
          <div class="fg-hero-media-grid${gridModClass}">${imgs.join('')}</div>
        </div>
        <div class="fg-hero-media-caption">Family photograph — coming soon</div>
      </div>
    </div>
  </section>`;
}

/* ── Editorial bridge paragraph (cleanup pass, Calcite-only) — the
   geological overview paragraph ("Calcite is one of Earth's most common
   minerals...") formerly rendered inside the hero box as .fg-hero-intro;
   Christie's review asked for it to sit unboxed, in the shared primary
   content frame, between the hero and "Meet Eight Common Calcite
   Varieties". Reuses the existing .fg-hero-intro-text paragraph styling
   (left-aligned serif) so no new typography is introduced — only the
   wrapping .fg-calcite-bridge container (styles.css) controls its
   spacing above/below. */
function familyGuideCalciteBridgeHtml(guide){
  const ov = guide.overview||{};
  const introParas = Array.isArray(ov.paragraphs) ? ov.paragraphs : (ov.paragraph ? [ov.paragraph] : []);
  if(!introParas.length) return '';
  return `<div class="fg-calcite-bridge">
    ${introParas.map(p=>`<p class="fg-hero-intro-text">${escapeAttr(p)}</p>`).join('')}
  </div>`;
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
  // opts.splitPhrase (2026-08-07, added for Agate's visual correction pass)
  // — breaks phraseText into two visual paragraphs at the first sentence
  // boundary ("first sentence. rest.") instead of one dense block, purely
  // as a presentation split; the underlying approved copy string is
  // unchanged. Opt-in only — no other caller sets this, so every existing
  // card's single-block phrase is byte-for-byte unaffected.
  let phraseInner = escapeAttr(phraseText);
  if(opts.splitPhrase && phraseText){
    const splitAt = phraseText.indexOf('. ');
    if(splitAt !== -1){
      const first = phraseText.slice(0, splitAt+1);
      const rest = phraseText.slice(splitAt+2);
      phraseInner = `<span class="fg-stonecard-phrase-p">${escapeAttr(first)}</span><span class="fg-stonecard-phrase-p">${escapeAttr(rest)}</span>`;
    }
  }
  return `<div class="fg-stonecard"${idAttr}>
    <button type="button" class="fg-stonecard-media" onclick="openDetail('${escapeAttr(c.i)}')" title="Open ${escapeAttr(c.n)} in Quick View">${imgHtml}</button>
    <div class="fg-stonecard-body">
      <div class="fg-stonecard-name">${escapeAttr(c.n)}</div>
      ${identityHtml}
      <div class="${phraseClass}">${phraseInner}</div>
      ${badgeHtml}
      <button type="button" class="fg-stonecard-qv" onclick="openDetail('${escapeAttr(c.i)}')">${escapeAttr(opts.qvLabel||'Quick View')}</button>
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
  // member.image (2026-07-24, added for Candy Fluorite) lets a name-only
  // expression card show an approved teaching photo from the family's own
  // assets/family-guide-<folder>/ directory instead of the "Photo pending"
  // placeholder. Yttrium Fluorite has no image field, so its output is
  // unchanged. opts.folder defaults to 'family-guide-fluorite' since this
  // dispatcher is currently only called by the Fluorite guide.
  const folder = opts.folder || 'family-guide-fluorite';
  const imgHtml = member.image
    ? `<img src="${escapeAttr('assets/'+folder+'/'+member.image)}" alt="${escapeAttr(member.alt||name)}" loading="lazy">`
    : `<div class="fg-stonecard-noimg fg-stonecard-noimg--labeled"><span>Photo pending</span></div>`;
  const identityHtml = (opts.showIdentity && member.identityLabel)
    ? `<div class="fg-stonecard-identity">${escapeAttr(member.identityLabel)}</div>` : '';
  let phraseText = member.quickView||member.headline||'';
  let phraseClass = 'fg-stonecard-phrase';
  if(!phraseText){
    phraseText = 'Photo and editorial identity pending.';
    phraseClass += ' fg-placeholder-note';
  }
  // opts.splitPhrase (2026-08-08, added for Quartz's Growth Forms &
  // Inclusions section, whose Phantom Quartz card has no resolvable Stone
  // ID and so renders through this unlinked branch) — same two-sentence
  // visual split fgStoneCardHtml already supports, so an unlinked card's
  // copy gets the same breathing room as its linked siblings in the same
  // grid. No existing caller (Fluorite) sets this, so its cards are
  // unaffected.
  let phraseInner = escapeAttr(phraseText);
  if(opts.splitPhrase && phraseText){
    const splitAt = phraseText.indexOf('. ');
    if(splitAt !== -1){
      const first = phraseText.slice(0, splitAt+1);
      const rest = phraseText.slice(splitAt+2);
      phraseInner = `<span class="fg-stonecard-phrase-p">${escapeAttr(first)}</span><span class="fg-stonecard-phrase-p">${escapeAttr(rest)}</span>`;
    }
  }
  // opts.hideBadge (2026-08-14, added for Quartz's Phantom Quartz card) —
  // suppresses only the "FAMILY-GUIDE EXPRESSION" status pill for this one
  // card while leaving the badge's default-on behavior unchanged for every
  // other unlinked family-guide-only card (e.g. Fluorite's Yttrium/Candy
  // Fluorite), which never set this flag.
  const badgePillHtml = opts.hideBadge ? '' : `<span class="fg-badge">FAMILY-GUIDE EXPRESSION</span>`;
  return `<div class="fg-stonecard fg-stonecard--unlinked">
    <div class="fg-stonecard-media" title="${escapeAttr(name)} — family-guide expression, not a linked encyclopedia entry">${imgHtml}</div>
    <div class="fg-stonecard-body">
      <div class="fg-stonecard-name">${escapeAttr(name)}</div>
      ${identityHtml}
      <div class="${phraseClass}">${phraseInner}</div>
      ${badgePillHtml}
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
   assets/family-guide-calcite/ by default) or, for the "many colors"
   recognition card, a small swatch grid built from existing approved
   encyclopedia photos (item.swatchStoneIds) — no new third-party photography
   involved. opts.folder (2026-07-24, added for Jasper's Pattern Guide cards)
   lets a caller supply a different assets/family-guide-<slug>/ folder for the
   item.image branch; it defaults to 'family-guide-calcite' so every existing
   caller that never passes opts (Calcite's Recognition/Shapes, Fluorite's
   Cube/Octahedron/Cleavage, Feldspar's When the Light Moves, Jasper's
   compareItems/Rough-Cut-Polished, etc.) resolves to the exact same path as
   before — purely additive, opt-in per call site. ── */
function fgPhotoCardHtml(item, opts){
  const folder = (opts && opts.folder) || 'family-guide-calcite';
  // opts.containMedia (2026-07-23, added for Feldspar's When the Light Moves
  // cards) swaps the media tile's default object-fit:cover crop for
  // object-fit:contain via the .fg-photocard-media--contain modifier, so
  // optical effects (adularescence/labradorescence/aventurescence) aren't
  // cropped out of frame. Opt-in only — every existing caller (Calcite,
  // Fluorite, Jasper) never sets this, so their cropped-to-fill cards are
  // completely unchanged.
  const mediaClass = (opts && opts.containMedia) ? 'fg-photocard-media fg-photocard-media--contain' : 'fg-photocard-media';
  let mediaHtml;
  if(item.swatchStoneIds){
    const imgs = item.swatchStoneIds.map(id=>{
      const c = fgCrystal(id);
      const src = (c && typeof firstEncyclopediaPhoto==='function') ? firstEncyclopediaPhoto(c) : '';
      return src ? `<div class="fg-photocard-swatch-cell"><img src="${escapeAttr(src)}" alt="${escapeAttr(c.n)}" loading="lazy"></div>` : '';
    }).filter(Boolean).join('');
    const sizeClass = item.swatchStoneIds.length===6 ? ' fg-photocard-swatch--6' : '';
    mediaHtml = `<div class="fg-photocard-swatch${sizeClass}">${imgs}</div>`;
  }else if(item.singleStoneId){
    // Single existing-encyclopedia-photo branch (2026-07-23, added for
    // Jasper's Rough-vs-Polished comparison, which illustrates "polished"
    // with Red Jasper's own already-approved canonical photo rather than a
    // new/invented image). Deliberately separate from swatchStoneIds — a
    // one-item swatch grid would leave three visibly empty cells. No
    // existing caller (Calcite, Fluorite, Feldspar) sets this field, so
    // this branch is purely additive.
    const c = fgCrystal(item.singleStoneId);
    const src = (c && typeof firstEncyclopediaPhoto==='function') ? firstEncyclopediaPhoto(c) : '';
    mediaHtml = src
      ? `<img src="${escapeAttr(src)}" alt="${escapeAttr(item.alt||c.n)}" loading="lazy">`
      : `<div class="fg-stonecard-noimg fg-stonecard-noimg--labeled"><span>Photo pending</span></div>`;
  }else if(item.url){
    // Absolute-URL branch (2026-08-01, added for Copper's grow-together
    // features) — for approved images hosted directly in Supabase Storage
    // (stone-images/family-guides/<slug>/) rather than a local
    // assets/family-guide-<slug>/ file. Every existing caller uses
    // item.image (a local asset filename) instead, so this is purely
    // additive and doesn't touch their resolved path.
    mediaHtml = `<img src="${escapeAttr(item.url)}" alt="${escapeAttr(item.alt||'')}" loading="lazy">`;
  }else if(item.image){
    mediaHtml = `<img src="${escapeAttr('assets/'+folder+'/'+item.image)}" alt="${escapeAttr(item.alt||'')}" loading="lazy">`;
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
  // item.caption (2026-08-01, added for Copper's Sonora Sunrise and Mixed
  // Copper Minerals/Quantum Quattro features) — a short image-context line
  // distinct from the main body copy, for representative/non-authenticated
  // photos that need an accurate caption without altering the approved
  // body paragraph. No other caller sets this, so their cards are
  // unaffected.
  const captionHtml = item.caption ? `<p class="fg-photocard-caption">${escapeAttr(item.caption)}</p>` : '';
  return `<div class="fg-photocard">
    <div class="${mediaClass}">${mediaHtml}</div>
    <div class="fg-photocard-body">
      <div class="fg-photocard-title">${escapeAttr(item.title||'')}</div>
      <p class="${textClass}">${escapeAttr(item.body||'')}</p>
      ${captionHtml}
    </div>
  </div>`;
}

/* ── 4. How to Recognize Calcite ─────────────────────────────────────── */
function familyGuideRecognitionHtml(guide){
  const items = (guide.recognition||{}).items||[];
  const cards = items.map(fgPhotoCardHtml).join('');
  return `<section class="fg-section" id="fg-recognize">
    <h2 class="fg-h2">How to Recognize Calcite</h2>
    <p class="fg-lead">At first glance, Calcite’s colors and forms can make its varieties seem unrelated. Look closer and the family resemblance begins to appear in its glassy luster, distinctive cleavage, shifting translucency, and remarkable optical effects.</p>
    <div class="fg-photo-grid fg-photo-grid--4">${cards}</div>
  </section>`;
}

/* ── 5. Shapes Calcite Takes ─────────────────────────────────────────── */
function familyGuideShapesHtml(guide){
  const items = (guide.shapes||{}).items||[];
  const cards = items.map(fgPhotoCardHtml).join('');
  return `<section class="fg-section" id="fg-shapes">
    <h2 class="fg-h2">Shapes Calcite Takes</h2>
    <p class="fg-lead">Calcite is a mineral of many silhouettes. It may rise in pointed crystals, split into slanted blocks, or gather into dense, banded masses, each form offering another clue to how it grew.</p>
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
   fg-placeholder-note instead of the normal fg-fact-body styling.
   c.rememberThis/c.watchFor (2026-08-19, added for Beryl) now also accept an
   array of paragraph strings, rendered as separate <p> tags, alongside the
   original single-string shape every other guide still uses unchanged. ── */
function familyGuideCollectionHtml(guide){
  const c = guide.collection||{};
  const care = c.careForIt||{};
  const pending = !!c.editorialNote;
  const bodyClass = pending ? 'fg-fact-body fg-placeholder-note' : 'fg-fact-body';
  // c.useSectionIntro (2026-07-23, added for Jasper) opts into the new shared
  // .fg-section-intro treatment (title -> one-sentence italic Georgia intro
  // -> content) instead of the original .fg-lead fg-lead--wide styling.
  // Calcite/Quartz/Fluorite/Feldspar/Chalcedony/Agate never set this flag, so
  // their intro paragraphs are completely unchanged by this addition.
  const introClass = c.useSectionIntro ? 'fg-section-intro' : 'fg-lead fg-lead--wide';
  return `<section class="fg-section" id="fg-collection">
    <h2 class="fg-h2">${escapeAttr(c.title||'In Your Collection')}</h2>
    ${c.intro?`<p class="${introClass}">${escapeAttr(c.intro)}</p>`:''}
    ${pending?`<p class="fg-placeholder-banner">Editorial copy pending — layout shell for review only.</p>`:''}
    <div class="fg-collection-grid">
      <div class="fg-collection-care">
        <div class="fg-collection-panel-title">Care for It</div>
        ${care.intro?`<p class="${bodyClass}">${escapeAttr(care.intro)}</p>`:''}
        ${fgList(care.bullets||[], pending?'fg-placeholder-note':'')}
      </div>
      <div class="fg-collection-sub">
        <div class="fg-collection-panel-title">Remember This</div>
        ${Array.isArray(c.rememberThis)
          ? c.rememberThis.map(p=>`<p class="${bodyClass}">${escapeAttr(p)}</p>`).join('')
          : `<p class="${bodyClass}">${escapeAttr(c.rememberThis||'')}</p>`}
      </div>
      <div class="fg-collection-sub">
        <div class="fg-collection-panel-title">Watch For</div>
        ${Array.isArray(c.watchFor)
          ? c.watchFor.map(p=>`<p class="${bodyClass}">${escapeAttr(p)}</p>`).join('')
          : `<p class="${bodyClass}">${escapeAttr(c.watchFor||'')}</p>`}
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
  // guide.closingSupportingCopy (2026-07-23, added for Garnet) — an optional
  // second line rendered between the closing callout and the Return button.
  // No other guide's data sets this field, so their closing panels are
  // completely unchanged by this addition.
  const supporting = guide.closingSupportingCopy || '';
  const supportingHtml = Array.isArray(supporting)
    ? supporting.map(p=>`<p class="fg-closing-supporting">${escapeAttr(p)}</p>`).join('')
    : (supporting?`<p class="fg-closing-supporting">${escapeAttr(supporting)}</p>`:'');
  // guide.closingBridge (2026-08-07, added for Agate's visual correction
  // pass) — ordinary left-aligned editorial paragraphs rendered as their
  // own .fg-section, immediately before the closing box, using the same
  // .fg-garnet-bridge treatment already established on this page for "What
  // Agate Actually Is." Distinct from closingSupportingCopy above, which
  // renders inside the box itself. No other guide sets this field.
  const bridge = guide.closingBridge || [];
  const bridgeHtml = bridge.length
    ? `<div class="fg-section" id="fg-closing-bridge"><div class="fg-garnet-bridge">${bridge.map(p=>`<p>${escapeAttr(p)}</p>`).join('')}</div></div>`
    : '';
  // guide.closingEmphasis (2026-08-07, added for Agate) — an italicized
  // clause appended inline to the end of the same closing-line paragraph,
  // so "Agate does not reveal everything at once. It rewards the second
  // look." reads as one continuous statement rather than two stacked
  // elements. Opt-in only; every other guide's closingCallout renders as a
  // single, fully-italic line exactly as before.
  const emphasis = guide.closingEmphasis || '';
  // guide.closingButton (2026-07-31, added for Copper) — an optional
  // override for the Return button's label and destination. Every other
  // guide has no closingButton field, so they keep the exact original
  // "Return to Encyclopedia" button/behavior below unchanged. Copper's
  // brief specifically calls for returning to Crystal Families (not just
  // relying on browser Back), so its data sets
  // closingButton:{label:'Return to Crystal Families', target:'crystalFamilies'}.
  const cb = guide.closingButton;
  const btnLabel = (cb && cb.label) || 'Return to Encyclopedia';
  const btnOnclick = (cb && cb.target==='crystalFamilies') ? 'fgReturnToCrystalFamilies()' : "switchTabByName('encyclopedia')";
  const lineHtml = line?`<p class="fg-closing-line">${escapeAttr(line)}${emphasis?` <em>${escapeAttr(emphasis)}</em>`:''}</p>`:'';
  const bodyHtml = guide.closingSupportingFirst ? (supportingHtml + lineHtml) : (lineHtml + supportingHtml);
  return `${bridgeHtml}<section class="fg-closing" id="fg-closing">
    ${bodyHtml}
    <button type="button" class="btn btn-accent fg-closing-btn" onclick="${btnOnclick}">${escapeAttr(btnLabel)}</button>
  </section>`;
}

// ── Return-to-Crystal-Families helper (2026-07-31, added for Copper's
// closing button — a forward navigation, not a Back-button case, so it
// can't rely on the existing origin-history-patch mechanism above, which
// only fires on the tile-click -> guide path. Writes the same
// spl_101_section localStorage key show101() already writes on every
// subsection switch, so the sidebar/section state stays consistent with
// however the user reaches Crystal Families next. ──
function fgReturnToCrystalFamilies(){
  try{ localStorage.setItem('spl_101_section','families'); }catch(e){}
  const url = window.location.pathname+'?tab=101&section=families';
  try{ history.pushState({tab:'101',section:'families'}, '', url); }catch(e){}
  switchTabByName('101');
  if(typeof show101==='function'){
    show101('families', document.querySelector('.c101-sidebar-item[onclick*="families"]'));
  }
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
  // w.gridCols (2026-07-23, added for Jasper's three-category "Pattern Is Not
  // the Same as Identity" reuse of this component) — an optional modifier
  // class for category counts other than the default five (only "--3" is
  // defined in styles.css so far). Quartz never sets this, so its five-
  // category grid is completely unaffected.
  const gridModClass = (w.gridCols && w.gridCols!==5) ? ` fg-namegrid--${w.gridCols}` : '';
  // w.sectionIntro (2026-07-23, added for Jasper) opts into the new shared
  // .fg-section-intro one-sentence treatment, rendered above the existing
  // w.question flourish (unchanged) rather than replacing it. Quartz's data
  // has no sectionIntro, so its output is byte-for-byte unaffected.
  return `<section class="fg-section" id="fg-name-change">
    <h2 class="fg-h2">${escapeAttr(w.title||'What Changes the Name?')}</h2>
    ${w.sectionIntro?`<p class="fg-section-intro">${escapeAttr(w.sectionIntro)}</p>`:''}
    ${w.question?`<p class="fg-lead fg-lead--question">${escapeAttr(w.question)}</p>`:''}
    <div class="fg-namegrid${gridModClass}">${cards}</div>
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
   QUARTZ FAMILY GUIDE — Revision pass (2026-08-08) implementing Christie's
   locked Quartz Family Guide Revision brief. Quartz moves off the generic
   assembly (familyGuideGenericHtml/familyGuideWhatChangesNameHtml/
   familyGuideGrowthFormsInclusionsHtml/familyGuideRelationshipHtml above
   are untouched and still available as the fallback path for any future
   guide with no dedicated assembly) onto its own dedicated section
   renderers and assembly below, matching the Agate/Copper visual-
   standardization baseline (see the [data-family-slug="quartz"] CSS in
   styles.css). ══ */

/* ── Bridge paragraph — the former in-hero "Quartz is familiar enough to
   seem simple..." paragraph is replaced with Christie's new bridge copy
   and moved out of the hero box entirely, reusing the same unboxed
   .fg-section/#fg-*-bridge/.fg-garnet-bridge pattern Agate's and Jasper's
   own hero-to-first-section bridges already established (see
   familyGuideWhatAgateIsHtml/familyGuideWhatJasperIsHtml). No heading —
   this is a continuation of the hero's opening thought, not its own named
   section. ── */
function familyGuideQuartzBridgeHtml(guide){
  const paras = guide.quartzBridge||[];
  if(!paras.length) return '';
  return `<div class="fg-section" id="fg-quartz-bridge"><div class="fg-garnet-bridge">${paras.map(p=>`<p>${escapeAttr(p)}</p>`).join('')}</div></div>`;
}

/* ── Why Quartz Names Change — four compact name+description cards
   (Brandberg Amethyst, Tibetan Quartz, Crackle Quartz, Dream Quartz),
   replacing the prior pass's five-category "What Changes the Name?" chip
   grid. Reuses the existing .fg-namegrid/.fg-namecard layout with new
   .fg-namecard-body content instead of the numbered-index/chip-list
   markup familyGuideWhatChangesNameHtml renders — that function is
   untouched and still used by its .fg-namegrid--3 variant (Tourmaline's
   triple-caption grid reuses the bare grid CSS only, not this markup).
   Correction (2026-08-12): Arkansas Quartz card removed per the reversed
   Arkansas Quartz/Clear Quartz no-merge catalog decision (see
   ENCYCLOPEDIA-CATALOG-DECISIONS.md §11) — Arkansas Quartz is consolidated
   into Clear Quartz and no longer gets separate family-guide treatment,
   so the grid now runs four cards, not five (see the matching
   [data-family-slug="quartz"] #fg-name-change .fg-namegrid column-count
   overrides in styles.css). Each card now also carries a short
   ex.label naming-category eyebrow (Locality / Claimed Locality /
   Treatment / Collector Name) via the new .fg-namecard-category class,
   so the module reads as a naming decoder rather than four
   undifferentiated text boxes — approved per Christie's 2026-08-12
   direction. ex.anchor (Dream Quartz only, "dream-quartz") gives that
   card a stable id, same pattern as fgStoneCardHtml's opts.anchorId
   (see familyGuideVarietiesHtml's #red-calcite legacy anchor), so it
   stays a real, findable, deep-linkable section of the page rather than
   inert placeholder text.
   Visual correction (2026-08-20): a two-sentence ex.body now renders as
   two separate .fg-namecard-body paragraphs (split at the first ". ",
   same convention as fgStoneCardHtml's opts.splitPhrase) instead of one
   run-on block, so the "what it is / why that distinction matters" beats
   read with visible separation. Approved wording is unchanged — this only
   changes how it's broken into paragraphs. ex.image (optional, a local
   filename under assets/family-guide-quartz/) renders through the
   .fg-namecard-media white contain well when an approved image exists.
   Pending-photo wells (2026-08-12): every card without ex.image now
   renders that same .fg-namecard-media well with the sitewide
   .fg-stonecard-noimg--labeled "Photo pending" treatment inside it
   (background overridden to white via the matching styles.css rule, same
   pattern already used for #fg-growth-forms's Phantom Quartz/Lemurian
   Seed Crystal wells) instead of omitting the media block — a structural
   placeholder only, no temporary or invented imagery. All four current
   examples are in this state; swapping in ex.image later needs no further
   markup change. ── */
function familyGuideQuartzNamingHtml(guide){
  const w = guide.whyNamesChange;
  if(!w) return '';
  const cards = (w.examples||[]).map(ex=>{
    const bodyClass = ex.bodyPending ? 'fg-namecard-body fg-placeholder-note' : 'fg-namecard-body';
    const body = ex.body || 'Editorial copy pending.';
    let bodyHtml;
    const splitAt = body.indexOf('. ');
    if(splitAt !== -1){
      const first = body.slice(0, splitAt+1);
      const rest = body.slice(splitAt+2);
      bodyHtml = `<p class="${bodyClass}">${escapeAttr(first)}</p><p class="${bodyClass}">${escapeAttr(rest)}</p>`;
    }else{
      bodyHtml = `<p class="${bodyClass}">${escapeAttr(body)}</p>`;
    }
    const mediaHtml = ex.image
      ? `<div class="fg-namecard-media"><img src="${escapeAttr('assets/family-guide-quartz/'+ex.image)}" alt="${escapeAttr(ex.alt||ex.name||'')}" loading="lazy"></div>`
      : `<div class="fg-namecard-media"><div class="fg-stonecard-noimg fg-stonecard-noimg--labeled"><span>Photo pending</span></div></div>`;
    const categoryHtml = ex.label ? `<div class="fg-namecard-category">${escapeAttr(ex.label)}</div>` : '';
    const idAttr = ex.anchor ? ` id="${escapeAttr(ex.anchor)}"` : '';
    return `<div class="fg-namecard"${idAttr}>
      ${mediaHtml}
      ${categoryHtml}
      <div class="fg-namecard-label">${escapeAttr(ex.name||'')}</div>
      ${bodyHtml}
    </div>`;
  }).join('');
  return `<section class="fg-section" id="fg-name-change">
    <h2 class="fg-h2">${escapeAttr(w.title||'Why Quartz Names Change')}</h2>
    ${w.intro?`<p class="fg-section-intro">${escapeAttr(w.intro)}</p>`:''}
    <div class="fg-namegrid">${cards}</div>
  </section>`;
}

/* ── Growth Forms & Inclusions — Quartz-dedicated replacement for the
   generic familyGuideGrowthFormsInclusionsHtml above, now carrying
   Christie's approved two-sentence body copy per stone (member.headline)
   instead of a placeholder-only shell. Each card renders through
   fgExpressionCardHtml with opts.splitPhrase so the two sentences get
   visual breathing room instead of collapsing into one dense block (see
   the [data-family-slug="quartz"] #fg-growth-forms CSS in styles.css for
   the matching white contain-well/16px description treatment already
   established for Agate's roster). Phantom Quartz (inclusions.items[0])
   has no stoneId — its Stone ID could not be resolved against
   pipeline/data/structured-values.generated.json, so it renders via
   fgExpressionCardHtml's non-clickable "FAMILY-GUIDE EXPRESSION" path
   rather than an invented catalog link; see the editorialStatusNote for
   this open gap. ── */
function familyGuideQuartzGrowthFormsHtml(guide){
  const g = guide.growthFormsInclusions;
  if(!g) return '';
  const growth = g.growthForms||{};
  const incl = g.inclusions||{};
  const growthCards = (growth.items||[]).map(m=>fgExpressionCardHtml(m, {splitPhrase:true})).filter(Boolean).join('');
  // hideBadge:true (2026-08-14) — Phantom Quartz (incl.items[0], no
  // stoneId) is the only card in this grid, or on the whole Quartz guide,
  // that renders through fgExpressionCardHtml's unlinked branch; its
  // "FAMILY-GUIDE EXPRESSION" pill read as an inappropriate public status
  // label and is suppressed here only. Quick View, name, description, and
  // photo-pending treatment are all unaffected — see fgExpressionCardHtml.
  const inclCards = (incl.items||[]).map(m=>fgExpressionCardHtml(m, {splitPhrase:true, hideBadge:true})).filter(Boolean).join('');
  return `<section class="fg-section" id="fg-growth-forms">
    <h2 class="fg-h2">${escapeAttr(g.title||'Growth Forms & Inclusions')}</h2>
    ${g.intro?`<p class="fg-section-intro">${escapeAttr(g.intro)}</p>`:''}
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

/* ── Where Agate, Chalcedony & Jasper Fit — Quartz-dedicated replacement
   for the generic familyGuideRelationshipHtml above (that function is
   untouched and still available as a fallback). Simplified per Christie's
   brief to plain prose (reusing .fg-garnet-bridge, the same untitled-
   paragraph treatment as the bridge above) plus three compact pill links
   to the built Chalcedony/Agate/Jasper guides — no branch photo cards. ── */
function familyGuideQuartzRelationshipHtml(guide){
  const r = guide.quartzRelationship;
  if(!r) return '';
  const paras = (r.paragraphs||[]).map(p=>`<p>${escapeAttr(p)}</p>`).join('');
  const links = (r.links||[]).map(l=>`<button type="button" class="btn fg-quartz-relationship-pill" onclick="openFamilyGuide('${escapeAttr(l.slug)}')">${escapeAttr(l.label)}</button>`).join('');
  return `<section class="fg-section" id="fg-relationship">
    <h2 class="fg-h2">${escapeAttr(r.title||'Where Agate, Chalcedony & Jasper Fit')}</h2>
    <div class="fg-garnet-bridge">${paras}</div>
    ${links?`<div class="fg-quartz-relationship-links">${links}</div>`:''}
  </section>`;
}

/* ── Quartz guide assembly — approved section order: Hero, bridge
   paragraph, Meet Eight Quartz Expressions, Why Quartz Names Change,
   Growth Forms & Inclusions, Where Agate/Chalcedony/Jasper Fit, Quartz in
   Your Collection (reuses familyGuideGarnetCollectionHtml/
   .fg-garnet-collection-grid exactly as Garnet/Agate/Jasper's own
   text-only three-card collection sections do, via guide.garnetCollection
   — see that function's own comment; field name is a reused, non-
   garnet-specific component per established convention), Closing. No
   familyGuideImageCreditsHtml call — this pass uses no new third-party
   photography, so Photo Credits stays on the shared footer link. ── */
function familyGuideQuartzHtml(guide){
  return `
  <div class="fg-guide" data-family-slug="${escapeAttr(guide.slug)}">
    ${familyGuideHeroHtml(guide)}
    ${familyGuideQuartzBridgeHtml(guide)}
    ${familyGuideExpressionsHtml(guide)}
    ${familyGuideQuartzNamingHtml(guide)}
    ${familyGuideQuartzGrowthFormsHtml(guide)}
    ${familyGuideQuartzRelationshipHtml(guide)}
    ${familyGuideGarnetCollectionHtml(guide)}
    ${familyGuideClosingHtml(guide)}
  </div>`;
}

/* ══════════════════════════════════════════════════════════════════════
   FLUORITE FAMILY GUIDE — dedicated section renderers (2026-07-22 first
   implementation pass). Fluorite's page order (One Mineral Many Colors,
   Cube/Octahedron/Cleavage, Zoning & Phantoms, Fluorescence) has no overlap
   with Quartz's generic-path sections, so it gets its own assembly function
   below rather than being forced into familyGuideGenericHtml. This is
   purely additive: Quartz's generic path and Calcite's fixed path are both
   untouched by anything in this block. ══ */

/* ── What Does "Opalized Fluorite" Mean? (2026-08-02 correction pass) — a
   compact, non-card, non-major-section inset between the Expressions grid
   and How Fluorite Gets Its Color, explaining the "opalized fluorite"
   market name (Tiffany Stone) without adding a ninth Expression card. No
   image, no Quick View, no inferred Stone ID — Tiffany Stone's roster
   entry (if any) is unresolved and out of scope for this brief. Rendered
   as its own top-level div (not .fg-section) so it does not receive the
   76px major-section rhythm on either side; see .fg-fluorite-opalized-note
   in styles.css for its restrained internal spacing instead. ── */
function familyGuideOpalizedFluoriteNoteHtml(guide){
  const n = guide.opalizedFluoriteNote;
  if(!n) return '';
  return `<div class="fg-fluorite-opalized-note" id="fg-opalized-fluorite">
    <div class="fg-fluorite-opalized-note-title">${escapeAttr(n.title||'')}</div>
    <p class="fg-fluorite-opalized-note-body">${escapeAttr(n.body||'')}</p>
  </div>`;
}

/* ── How Fluorite Gets Its Color (2026-08-02 correction pass — renamed and
   rebuilt from "One Mineral, Many Colors") — one restrained three-panel
   teaching module (Trace elements / Color centers / More than one answer).
   No photos are used here; guide.manyColors.panels[].accent picks a
   subtle, restrained Fluorite-derived top-accent color per panel (see
   .fg-fluorite-color-panel in styles.css) — never a rainbow gradient or
   decorative treatment. The old detached closing terminology-note line is
   removed per this pass's brief; nothing replaces it. ── */
function fgFluoriteColorPanelHtml(panel){
  if(!panel) return '';
  const accentClass = panel.accent ? ` fg-fluorite-color-panel--${escapeAttr(panel.accent)}` : '';
  return `<div class="fg-fluorite-color-panel${accentClass}">
    <div class="fg-fluorite-color-panel-label">${escapeAttr(panel.label||'')}</div>
    <p class="fg-fluorite-color-panel-body">${escapeAttr(panel.body||'')}</p>
  </div>`;
}
function familyGuideManyColorsHtml(guide){
  const m = guide.manyColors;
  if(!m) return '';
  const panels = (m.panels||[]).map(fgFluoriteColorPanelHtml).join('');
  return `<section class="fg-section" id="fg-many-colors">
    <h2 class="fg-h2">${escapeAttr(m.title||'How Fluorite Gets Its Color')}</h2>
    ${m.intro?`<p class="fg-lead fg-lead--wide">${escapeAttr(m.intro)}</p>`:''}
    <div class="fg-fluorite-color-panels">${panels}</div>
  </section>`;
}

/* ── How Fluorite Records Its Growth (2026-08-02 correction pass — renamed
   and moved directly after "How Fluorite Gets Its Color", ahead of
   Cube/Octahedron/Cleavage) — the existing approved zoning image beside the
   three actual terms (Zoning / Banding / Phantoms) it illustrates, reusing
   the same .fg-explain-grid/.fg-explain-media/.fg-explain-copy two-column
   layout Jasper's "What Jasper Actually Is" already established.
   guide.zoningPhantoms.closingLine now renders as the last item inside
   .fg-explain-copy, alongside the terms, rather than as a detached line
   below the whole composition — per this pass's explicit "belongs inside
   the teaching composition, not a detached clarification or warning"
   instruction. ── */
function fgFluoriteZoningTermHtml(term){
  if(!term) return '';
  return `<div class="fg-fluorite-zoning-term">
    <div class="fg-fluorite-zoning-term-label">${escapeAttr(term.label||'')}</div>
    <p class="fg-fluorite-zoning-term-body">${escapeAttr(term.body||'')}</p>
  </div>`;
}
function familyGuideZoningHtml(guide){
  const z = guide.zoningPhantoms;
  if(!z) return '';
  const terms = (z.terms||[]).map(fgFluoriteZoningTermHtml).join('');
  const visualHtml = z.image
    ? `<img src="${escapeAttr('assets/family-guide-fluorite/'+z.image)}" alt="${escapeAttr(z.imageAlt||'')}" loading="lazy">`
    : `<div class="fg-stonecard-noimg fg-stonecard-noimg--labeled"><span>Photo pending</span></div>`;
  const closingHtml = z.closingLine?`<p class="fg-fluorite-zoning-closing">${escapeAttr(z.closingLine)}</p>`:'';
  return `<section class="fg-section" id="fg-zoning">
    <h2 class="fg-h2">${escapeAttr(z.title||'How Fluorite Records Its Growth')}</h2>
    ${z.intro?`<p class="fg-lead fg-lead--wide">${escapeAttr(z.intro)}</p>`:''}
    <div class="fg-explain-grid fg-fluorite-zoning-grid">
      <div class="fg-explain-media">${visualHtml}</div>
      <div class="fg-explain-copy">${terms}${closingHtml}</div>
    </div>
  </section>`;
}

/* ── Cube, Octahedron, or Cleavage Piece? — three-position comparison using
   Christie's approved explanatory copy verbatim for each position. Reuses
   fgPhotoCardHtml's item.image branch (2026-07-24, folder:'family-guide-
   fluorite') now that the three licensed educational images (see
   guide.cubeOctahedronCleavage.items[].pendingAsset for filename/creator/
   license) are retained locally. guide.cubeOctahedronCleavage.intro
   (2026-08-02) adds the section's short purpose-setting introduction,
   rendered the same way every other guide's section intro is. ── */
function familyGuideCubeOctahedronHtml(guide){
  const s = guide.cubeOctahedronCleavage;
  if(!s) return '';
  const cards = (s.items||[]).map(item=>fgPhotoCardHtml(item, {folder:'family-guide-fluorite'})).join('');
  return `<section class="fg-section" id="fg-cube-octahedron">
    <h2 class="fg-h2">${escapeAttr(s.title||'Cube, Octahedron, or Cleavage Piece?')}</h2>
    ${s.intro?`<p class="fg-lead fg-lead--wide">${escapeAttr(s.intro)}</p>`:''}
    <div class="fg-photo-grid fg-photo-grid--3">${cards}</div>
  </section>`;
}

/* ── Why Some Fluorite Glows (2026-08-02 correction pass — replaces the
   side-by-side .fg-explain-grid composition, which vertically centered a
   short panoramic image beside a much taller text column and left a large
   dead area around the image). New stacked structure: heading, intro, the
   existing normal-light/UV comparison image centered beneath the intro at
   its natural panoramic ratio (moderate max-width, not a tall fixed-height
   well), then the same four approved lessons — copy unchanged — in a 2x2
   desktop grid (.fg-fluorite-lesson-grid) that stacks to one column on
   mobile via the guide's existing 900px breakpoint. ── */
function fgFluoriteFluorescenceLessonHtml(lesson){
  if(!lesson) return '';
  return `<div class="fg-fluorite-lesson-card">
    <div class="fg-fluorite-lesson-card-label">${escapeAttr(lesson.label||'')}</div>
    <p class="fg-fluorite-lesson-card-body">${escapeAttr(lesson.body||'')}</p>
  </div>`;
}
function familyGuideFluorescenceHtml(guide){
  const f = guide.fluorescence;
  if(!f) return '';
  const visualHtml = f.image
    ? `<img src="${escapeAttr('assets/family-guide-fluorite/'+f.image)}" alt="${escapeAttr(f.imageAlt||'')}" loading="lazy">`
    : `<div class="fg-stonecard-noimg fg-stonecard-noimg--labeled"><span>Photo pending</span></div>`;
  const lessons = (f.lessons||[]).map(fgFluoriteFluorescenceLessonHtml).join('');
  return `<section class="fg-section" id="fg-fluorescence">
    <h2 class="fg-h2">${escapeAttr(f.title||'Why Some Fluorite Glows')}</h2>
    ${f.intro?`<p class="fg-lead fg-lead--wide">${escapeAttr(f.intro)}</p>`:''}
    <div class="fg-fluorite-uv-visual">${visualHtml}</div>
    <div class="fg-fluorite-lesson-grid">${lessons}</div>
  </section>`;
}

/* ── Fluorite in Your Collection (2026-08-02 correction pass — rebuilt from
   the shared Care-for-It/Remember-This/Watch-For schema, which carried a
   warning tone and an italic pending note, into three plain peer teaching
   cards: Handle gently / Change the angle / Look closely). The first card
   is wider (1.4fr) than the other two (1fr each); all three stretch to the
   tallest card's height via CSS grid row stretch (default align-items:
   stretch), not a fixed pixel height, so the row still expands naturally
   if any card's text wraps to more lines. Dedicated function/CSS
   (.fg-fluorite-collection-grid/-card) rather than reusing
   familyGuideCollectionHtml, whose three-part schema doesn't fit this
   design. ── */
function fgFluoriteCollectionCardHtml(card){
  if(!card) return '';
  return `<div class="fg-fluorite-collection-card">
    <div class="fg-fluorite-collection-card-title">${escapeAttr(card.title||'')}</div>
    <p class="fg-fluorite-collection-card-body">${escapeAttr(card.body||'')}</p>
  </div>`;
}
function familyGuideFluoriteCollectionHtml(guide){
  const c = guide.collection;
  if(!c) return '';
  const cards = (c.cards||[]).map(fgFluoriteCollectionCardHtml).join('');
  return `<section class="fg-section" id="fg-collection">
    <h2 class="fg-h2">${escapeAttr(c.title||'Fluorite in Your Collection')}</h2>
    ${c.intro?`<p class="fg-lead fg-lead--wide">${escapeAttr(c.intro)}</p>`:''}
    <div class="fg-fluorite-collection-grid">${cards}</div>
  </section>`;
}

/* ── Fluorite hero — dedicated variant (2026-08-02 normalization pass) that
   drops the shared familyGuideHeroHtml's bottom .fg-hero-intro/.fg-hero-
   divider block entirely: the hero ends immediately after the reflective
   prompt, with no divider. The overview paragraph ("Fluorite is calcium
   fluoride...") that block used to render is now handled separately by
   familyGuideFluoriteBridgeHtml below, as an unboxed full-width bridge
   before "Meet Eight Fluorite Expressions" — same technique already
   established for Calcite (familyGuideCalciteHeroHtml/
   familyGuideCalciteBridgeHtml). Hero title, copy, media, labels, and
   prompt copy/markup are otherwise byte-for-byte identical to the shared
   familyGuideHeroHtml. ── */
function familyGuideFluoriteHeroHtml(guide){
  const hero = guide.hero||{};
  return `<section class="fg-hero" id="fg-hero">
    <div class="fg-hero-grid">
      <div class="fg-hero-copy">
        ${hero.eyebrow?`<div class="fg-eyebrow">${escapeAttr(hero.eyebrow)}</div>`:''}
        <h1 class="fg-hero-title">${escapeAttr(hero.title||guide.displayName)}</h1>
        ${hero.signatureLine?`<p class="fg-hero-sub">${escapeAttr(hero.signatureLine)}</p>`:''}
        ${hero.condensedIntro?`<p class="fg-hero-body">${escapeAttr(hero.condensedIntro)}</p>`:''}
        ${hero.emphasisLine?`<p class="fg-hero-emphasis">${escapeAttr(hero.emphasisLine)}</p>`:''}
        ${hero.question?`<div class="fg-hero-prompt">
          ${hero.promptLeadIn?`<div class="fg-hero-prompt-lead">${escapeAttr(hero.promptLeadIn)}</div>`:''}
          <div class="fg-hero-question">${escapeAttr(hero.question)}</div>
          ${hero.supportingLine?`<div class="fg-hero-supporting">${escapeAttr(hero.supportingLine)}</div>`:''}
        </div>`:''}
      </div>
      ${fgHeroMediaHtml(guide)}
    </div>
  </section>`;
}

/* ── Fluorite bridge paragraph (2026-08-02 normalization pass) — the
   existing approved "Fluorite is calcium fluoride..." overview paragraph,
   moved outside the hero box into the shared primary content frame,
   unboxed, directly above "Meet Eight Fluorite Expressions". Copy is
   unchanged; only its position and container changed. Reuses the same
   .fg-hero-intro-text paragraph typography as every other guide's bridge
   paragraph (Calcite's .fg-calcite-bridge, Garnet's .fg-garnet-bridge). ── */
function familyGuideFluoriteBridgeHtml(guide){
  const ov = guide.overview||{};
  const introParas = Array.isArray(ov.paragraphs) ? ov.paragraphs : (ov.paragraph ? [ov.paragraph] : []);
  if(!introParas.length) return '';
  return `<div class="fg-fluorite-bridge">
    ${introParas.map(p=>`<p class="fg-hero-intro-text">${escapeAttr(p)}</p>`).join('')}
  </div>`;
}

/* ── Fluorite guide assembly — its own approved section order. ── */
function familyGuideFluoriteHtml(guide){
  return `
  <div class="fg-guide" data-family-slug="${escapeAttr(guide.slug)}">
    ${familyGuideFluoriteHeroHtml(guide)}
    ${familyGuideFluoriteBridgeHtml(guide)}
    ${familyGuideExpressionsHtml(guide)}
    ${familyGuideOpalizedFluoriteNoteHtml(guide)}
    ${familyGuideManyColorsHtml(guide)}
    ${familyGuideZoningHtml(guide)}
    ${familyGuideCubeOctahedronHtml(guide)}
    ${familyGuideFluorescenceHtml(guide)}
    ${familyGuideFluoriteCollectionHtml(guide)}
    ${familyGuideClosingHtml(guide)}
    ${familyGuideImageCreditsHtml(guide)}
  </div>`;
}

/* ══════════════════════════════════════════════════════════════════════
   FELDSPAR FAMILY GUIDE — correction pass (2026-08-01, second same-day
   pass) applied on top of the prior controlled rebuild, per a follow-up
   brief that explicitly supersedes feldspar-family-guide-final-copy-and-
   visual-plan.md wherever the two differ. Current approved section order:
   Hero (full-width prompt row, no bridge), Meet Eight Feldspar
   Expressions, One Family/Two Great Branches (Alkali Feldspar / Plagioclase
   Feldspar, enlarged labeled familiar-stone images), Sunstone Connects the
   Branches (compact connector, not a full section), Glow/Flash/Sparkle,
   Moonstone decoder (five-card 3-2 grid, Green Moonstone included),
   Labradorite/Spectrolite/Larvikite (no bottom-line strip), Collection
   (unchanged this pass — see familyGuideFeldsparCollectionHtml), Closing
   (bare italic line + pill, no box). Purely Feldspar-scoped: nothing here
   touches a Calcite, Quartz, Fluorite, Chalcedony, Agate, Jasper, Garnet,
   Tourmaline, Obsidian, or Copper selector, function, or data field. ══ */

/* ── 1. Hero — dedicated Feldspar layout (the shared familyGuideHeroHtml
   keeps the "Feldspar asks" prompt inside the copy column; this brief
   requires it to break out and span the full hero width below the two-
   column row instead), so Feldspar gets its own hero function rather than
   a shared-component change that would affect every other guide. Reuses
   fgHeroMediaImgs() unchanged for the temporary family-image source/
   treatment. No bridge, no divider — the hero still ends immediately
   after the question. ── */
function familyGuideFeldsparHeroHtml(guide){
  const hero = guide.hero||{};
  return `<section class="fg-hero" id="fg-hero">
    <div class="fg-hero-grid">
      <div class="fg-hero-copy">
        ${hero.eyebrow?`<div class="fg-eyebrow">${escapeAttr(hero.eyebrow)}</div>`:''}
        <h1 class="fg-hero-title">${escapeAttr(hero.title||guide.displayName)}</h1>
        ${hero.signatureLine?`<p class="fg-hero-sub">${escapeAttr(hero.signatureLine)}</p>`:''}
        ${hero.condensedIntro?`<p class="fg-hero-body">${escapeAttr(hero.condensedIntro)}</p>`:''}
      </div>
      ${fgHeroMediaHtml(guide)}
    </div>
    ${hero.question?`<div class="fg-hero-prompt fg-feldspar-hero-prompt">
      ${hero.promptLeadIn?`<div class="fg-hero-prompt-lead">${escapeAttr(hero.promptLeadIn)}</div>`:''}
      <div class="fg-hero-question">${escapeAttr(hero.question)}</div>
      ${hero.supportingLine?`<div class="fg-hero-supporting">${escapeAttr(hero.supportingLine)}</div>`:''}
    </div>`:''}
  </section>`;
}

/* ── 2. Meet Eight Feldspar Expressions — unchanged component (reuses
   Copper's fgMineralCardHtml in the shared four-column .fg-card-grid--4),
   just fed this pass's shorter one-sentence-per-stone copy. ── */
function familyGuideFeldsparExpressionsHtml(guide){
  const ex = guide.expressions;
  if(!ex) return '';
  const cards = (ex.members||[]).map(fgMineralCardHtml).filter(Boolean).join('');
  return `<section class="fg-section" id="fg-expressions">
    <h2 class="fg-h2">${escapeAttr(ex.title||'Meet Eight Feldspar Expressions')}</h2>
    ${ex.intro?`<p class="fg-prose">${escapeAttr(ex.intro)}</p>`:''}
    <div class="fg-card-grid fg-card-grid--4">${cards}</div>
  </section>`;
}

/* ── 3. One Family, Two Great Branches — two equal panels, each with a
   slim colored accent rule (warm for Alkali Feldspar, cool for Plagioclase
   — see .fg-feldspar-branch--alkali/--plagioclase in styles.css, now
   rendered as top borders instead of side borders per the 2026-08-01
   visual-correction pass), the body paragraph, and a "Familiar Stones"
   label over enlarged labeled specimen images (item.thumbs:
   [{stoneId,name}]). No old "Home to..." subtitle, no old text-only
   familiar-names line, no mineral-classification line (removed per the
   same correction pass — do not reintroduce), no arrows, stems, or
   connector diagrams. fgFeldsparBranchThumbHtml is also reused as-is by
   the Sunstone connector below so both share identical specimen-well
   scale/treatment. ── */
function fgFeldsparBranchThumbHtml(thumb){
  const c = fgCrystal(thumb.stoneId);
  if(!c) return '';
  const imgSrc = (typeof firstEncyclopediaPhoto==='function') ? firstEncyclopediaPhoto(c) : '';
  const imgHtml = imgSrc ? `<img src="${escapeAttr(imgSrc)}" alt="${escapeAttr(c.n)}" loading="lazy">` : '';
  return `<button type="button" class="fg-feldspar-branch-thumb" onclick="openDetail('${escapeAttr(c.i)}')" title="Open ${escapeAttr(c.n)} in Quick View">${imgHtml}<span>${escapeAttr(thumb.name||c.n)}</span></button>`;
}
function fgFeldsparBranchPanelHtml(item){
  const thumbs = (item.thumbs||[]).map(fgFeldsparBranchThumbHtml).filter(Boolean).join('');
  return `<div class="fg-feldspar-branch-panel fg-feldspar-branch--${escapeAttr(item.accent||'')}">
    <div class="fg-branch-title">${escapeAttr(item.title||'')}</div>
    ${item.body?`<p class="fg-prose">${escapeAttr(item.body)}</p>`:''}
    ${item.familiarStonesLabel?`<div class="fg-feldspar-branch-line-label">${escapeAttr(item.familiarStonesLabel)}</div>`:''}
    ${thumbs?`<div class="fg-feldspar-branch-thumbs">${thumbs}</div>`:''}
  </div>`;
}
function familyGuideFeldsparBranchesHtml(guide){
  const b = guide.branches;
  if(!b) return '';
  const cards = (b.items||[]).map(fgFeldsparBranchPanelHtml).join('');
  return `<section class="fg-section" id="fg-branches">
    <h2 class="fg-h2">${escapeAttr(b.title||'One Family, Two Great Branches')}</h2>
    ${b.intro?`<p class="fg-prose">${escapeAttr(b.intro)}</p>`:''}
    <div class="fg-branch-grid">${cards}</div>
  </section>`;
}

/* ── 4. Sunstone Connects the Branches — a compact connector, visibly
   subordinate to the two branch panels above it (no oversized image
   wells, no placeholder, no pills/badges, no terminology note). The
   dual-accent top rule (half warm/half cool, referencing both branches)
   is preserved. guide.sunstoneConnector.stoneId (2026-08-01 visual-
   correction pass) reuses fgFeldsparBranchThumbHtml — the same existing
   Sunstone roster entry (C-0029) already used by the Meet Eight Feldspar
   Expressions card above, resolved via the same fgCrystal/
   firstEncyclopediaPhoto/openDetail path, not a new or substituted image
   — centered as the sole specimen so Sunstone matches the two branch
   cards' image scale and label treatment exactly. ── */
function familyGuideFeldsparSunstoneConnectorHtml(guide){
  const s = guide.sunstoneConnector;
  if(!s) return '';
  const thumb = s.stoneId ? fgFeldsparBranchThumbHtml({stoneId:s.stoneId, name:s.name}) : '';
  return `<div class="fg-feldspar-sunstone-connector" id="fg-sunstone-connector">
    <h3 class="fg-feldspar-connector-heading">${escapeAttr(s.title||'Sunstone Connects the Branches')}</h3>
    ${s.body?`<p class="fg-fact-body">${escapeAttr(s.body)}</p>`:''}
    ${thumb?`<div class="fg-feldspar-branch-thumbs fg-feldspar-sunstone-thumbs">${thumb}</div>`:''}
  </div>`;
}

/* ── 5. Glow, Flash, Sparkle — three equal comparison cards. "What to
   notice" renders as a quiet inline closing line after the explanatory
   body paragraph (2026-08-20 simplification pass — no more beige inset
   box). No closing sentence beneath the cards. ── */
function fgFeldsparLightCardHtml(item){
  const imgHtml = item.image
    ? `<img src="${escapeAttr('assets/family-guide-feldspar/'+item.image)}" alt="${escapeAttr(item.alt||'')}" loading="lazy">`
    : '';
  return `<div class="fg-photocard fg-feldspar-light-card">
    <div class="fg-photocard-media fg-photocard-media--contain">${imgHtml}</div>
    <div class="fg-photocard-body">
      <div class="fg-feldspar-light-word">${escapeAttr(item.plainWord||'')}</div>
      <div class="fg-feldspar-light-term">${escapeAttr(item.technicalTerm||'')}</div>
      <p class="fg-photocard-text">${escapeAttr(item.body||'')}</p>
      ${item.whatToNotice?`<p class="fg-feldspar-notice"><span>What to notice:</span> ${escapeAttr(item.whatToNotice)}</p>`:''}
    </div>
  </div>`;
}
function familyGuideFeldsparLightHtml(guide){
  const l = guide.lightMoves;
  if(!l) return '';
  const cards = (l.items||[]).map(fgFeldsparLightCardHtml).join('');
  return `<section class="fg-section" id="fg-light-moves">
    <h2 class="fg-h2">${escapeAttr(l.title||'Glow, Flash, Sparkle')}</h2>
    ${l.intro?`<p class="fg-prose">${escapeAttr(l.intro)}</p>`:''}
    <div class="fg-photo-grid fg-photo-grid--3">${cards}</div>
  </section>`;
}

/* ── 6. Moonstone Is More Complicated Than Its Name Suggests — a single
   five-card 3-2 grid (Moonstone, Rainbow Moonstone, Peach Moonstone, Black
   Moonstone, Green Moonstone), the two-row layout produced by
   .fg-feldspar-decoder-grid's flex-wrap (three cards fixed-width on row
   one, the remaining two centered on row two — see styles.css). Green
   Moonstone is the fifth card, not a separate strip; its
   item.identityLabel ("Not Feldspar · Usually Garnierite") renders as a
   plain caption line directly beneath the stone name, styled like any
   other body text — never as an alarming warning badge. Each card's
   bestClue string (e.g. "Best clue: A soft internal glow.") is split at
   its leading label so it can share the exact same quiet inline-line
   treatment as "What to notice" in Glow, Flash, Sparkle — the label
   bolded, the rest regular weight, no background/border/rounded
   container (see .fg-feldspar-notice in styles.css). The clue now closes
   the card after the explanatory paragraph (2026-08-20 simplification
   pass — previously it rendered as a beige box above the paragraph). The
   stored wording itself is untouched — only how it's split into
   label/remainder for rendering. ── */
function fgFeldsparCluePillHtml(clue){
  if(!clue) return '';
  const m = /^([^:]+:)\s*(.*)$/.exec(clue);
  const label = m ? m[1] : 'Best clue:';
  const rest = m ? m[2] : clue;
  return `<p class="fg-feldspar-notice fg-feldspar-clue-pill"><span>${escapeAttr(label)}</span> ${escapeAttr(rest)}</p>`;
}
function fgFeldsparDecoderCardHtml(item){
  const c = fgCrystal(item.stoneId);
  if(!c) return '';
  const imgSrc = (typeof firstEncyclopediaPhoto==='function') ? firstEncyclopediaPhoto(c) : '';
  const imgHtml = imgSrc
    ? `<img src="${escapeAttr(imgSrc)}" alt="${escapeAttr(c.n)}" loading="lazy">`
    : `<div class="fg-stonecard-noimg fg-stonecard-noimg--labeled"><span>Photo pending</span></div>`;
  return `<div class="fg-relationship-card">
    <button type="button" class="fg-relationship-media" onclick="openDetail('${escapeAttr(c.i)}')" title="Open ${escapeAttr(c.n)} in Quick View">${imgHtml}</button>
    <div class="fg-relationship-label">${escapeAttr(item.label||c.n)}</div>
    ${item.identityLabel?`<div class="fg-feldspar-identity-label">${escapeAttr(item.identityLabel)}</div>`:''}
    ${item.body?`<p class="fg-fact-body">${escapeAttr(item.body)}</p>`:''}
    ${fgFeldsparCluePillHtml(item.bestClue)}
  </div>`;
}
function familyGuideFeldsparMoonstoneDecoderHtml(guide){
  const m = guide.moonstoneDecoder;
  if(!m) return '';
  const cards = (m.items||[]).map(fgFeldsparDecoderCardHtml).filter(Boolean).join('');
  return `<section class="fg-section" id="fg-moonstone-decoder">
    <h2 class="fg-h2">${escapeAttr(m.title||'Moonstone Is More Complicated Than Its Name Suggests')}</h2>
    ${m.intro?`<p class="fg-prose">${escapeAttr(m.intro)}</p>`:''}
    <div class="fg-feldspar-decoder-grid">${cards}</div>
  </section>`;
}

/* ── 7. Labradorite, Spectrolite & Larvikite — unchanged three-card layout
   and image treatment; this pass only updates the identity/body copy and
   removes the bottom comparison-line strip (no replacement summary). ── */
function fgFeldsparLslCardHtml(item){
  const c = fgCrystal(item.stoneId);
  if(!c) return '';
  const imgSrc = (typeof firstEncyclopediaPhoto==='function') ? firstEncyclopediaPhoto(c) : '';
  const imgHtml = imgSrc
    ? `<img src="${escapeAttr(imgSrc)}" alt="${escapeAttr(c.n)}" loading="lazy">`
    : `<div class="fg-stonecard-noimg fg-stonecard-noimg--labeled"><span>Photo pending</span></div>`;
  return `<div class="fg-relationship-card">
    <button type="button" class="fg-relationship-media" onclick="openDetail('${escapeAttr(c.i)}')" title="Open ${escapeAttr(c.n)} in Quick View">${imgHtml}</button>
    <div class="fg-relationship-label">${escapeAttr(item.label||c.n)}</div>
    ${item.body?`<p class="fg-fact-body">${escapeAttr(item.body)}</p>`:''}
  </div>`;
}
function familyGuideFeldsparLslHtml(guide){
  const s = guide.lsl;
  if(!s) return '';
  const cards = (s.items||[]).map(fgFeldsparLslCardHtml).filter(Boolean).join('');
  return `<section class="fg-section" id="fg-lsl">
    <h2 class="fg-h2">${escapeAttr(s.title||'Labradorite, Spectrolite & Larvikite')}</h2>
    ${s.intro?`<p class="fg-prose">${escapeAttr(s.intro)}</p>`:''}
    <div class="fg-relationship-grid">${cards}</div>
  </section>`;
}

/* ── 9. Feldspar in Your Collection — three equal, text-led teaching cards
   (Display It Where the Light Can Find It / Protect It / Learn the Name).
   Reuses the existing neutral .fg-collection-sub panel styling in a new
   three-column grid (.fg-feldspar-collection-grid) rather than the shared
   Care-for-it/Remember-this/Watch-for layout familyGuideCollectionHtml
   renders for other guides — that component's three-part schema doesn't
   fit this brief's three-equal-panel design. No large decorative images,
   per the approved plan. ── */
function familyGuideFeldsparCollectionHtml(guide){
  const c = guide.collection;
  if(!c) return '';
  const cards = (c.cards||[]).map(card=>`<div class="fg-collection-sub">
    <div class="fg-collection-panel-title">${escapeAttr(card.title||'')}</div>
    ${(card.paragraphs||[]).map(p=>`<p class="fg-fact-body">${escapeAttr(p)}</p>`).join('')}
  </div>`).join('');
  return `<section class="fg-section" id="fg-collection">
    <h2 class="fg-h2">${escapeAttr(c.title||'Feldspar in Your Collection')}</h2>
    ${c.intro?`<p class="fg-prose">${escapeAttr(c.intro)}</p>`:''}
    <div class="fg-feldspar-collection-grid">${cards}</div>
  </section>`;
}

/* ── Feldspar in Your Collection — UNCHANGED this pass. The follow-up
   brief asks for this section's three care-oriented cards (Display It
   Where the Light Can Find It / Protect It / Learn the Name) to be
   replaced with three approved teaching cards ("Two Branches" / "What
   Moves the Light" / "Recognizing Feldspar") "already stored in the
   Feldspar data" — but no such objects exist anywhere in
   data/family-guides.json or this file. Per the brief's own explicit stop
   condition for this section ("if those exact three objects are not
   present... stop and report... do not invent replacements"), no swap was
   made; this function and guide.collection are untouched. See the
   editorialStatusNote above and the correction-pass report for details. ── */
function familyGuideFeldsparCollectionHtml(guide){
  const c = guide.collection;
  if(!c) return '';
  const cards = (c.cards||[]).map(card=>`<div class="fg-collection-sub">
    <div class="fg-collection-panel-title">${escapeAttr(card.title||'')}</div>
    ${(card.paragraphs||[]).map(p=>`<p class="fg-fact-body">${escapeAttr(p)}</p>`).join('')}
  </div>`).join('');
  return `<section class="fg-section" id="fg-collection">
    <h2 class="fg-h2">${escapeAttr(c.title||'Feldspar in Your Collection')}</h2>
    ${c.intro?`<p class="fg-prose">${escapeAttr(c.intro)}</p>`:''}
    <div class="fg-feldspar-collection-grid">${cards}</div>
  </section>`;
}

/* ── Feldspar guide assembly — approved section order. No bridge (deleted
   this pass, no replacement transition). No in-page
   familyGuideImageCreditsHtml() call — guide.imageCredits still powers
   credits.html generically (see fgSetFooterCreditsLink() above for the
   still-unresolved dedicated-anchor gap). ── */
function familyGuideFeldsparHtml(guide){
  return `
  <div class="fg-guide" data-family-slug="${escapeAttr(guide.slug)}">
    ${familyGuideFeldsparHeroHtml(guide)}
    ${familyGuideFeldsparExpressionsHtml(guide)}
    ${familyGuideFeldsparBranchesHtml(guide)}
    ${familyGuideFeldsparSunstoneConnectorHtml(guide)}
    ${familyGuideFeldsparLightHtml(guide)}
    ${familyGuideFeldsparMoonstoneDecoderHtml(guide)}
    ${familyGuideFeldsparLslHtml(guide)}
    ${familyGuideFeldsparCollectionHtml(guide)}
    ${familyGuideClosingHtml(guide)}
  </div>`;
}

/* ══════════════════════════════════════════════════════════════════════
   CHALCEDONY FAMILY GUIDE — dedicated section renderers (2026-07-23 first
   implementation pass). Chalcedony's job is to be the conceptual bridge
   between Quartz (macrocrystalline) and Agate/Jasper (its own microcrystalline-
   quartz-family neighbors, cataloged separately) — its section order has no
   overlap with any other guide's, so it gets its own assembly function below.
   Purely additive: nothing here touches a Calcite, Quartz, Fluorite, or
   Feldspar selector or function. Its roster (Blue and Pink Chalcedony) is
   intentionally small — see fg-card-grid--2 in styles.css — and Agate/Jasper
   roster stones are never pulled into that roster grid; they only appear as
   representative photos in the separate Chalcedony/Agate/Jasper relationship
   section below, the same pattern Quartz's own relationship section already
   established and had approved. ══ */

/* ── 2. Meet the Chalcedony Family — exactly two rostered expressions.
   Deliberately not forced into an eight-card grid; fg-card-grid--2 gives a
   centered, intentional two-card layout instead. No identity/quickView copy
   is supplied in the data (see below), so cards show name + Quick View only,
   never invented identity or metaphysical language. ── */
function familyGuideMeetFamilyHtml(guide){
  const m = guide.meetTheFamily;
  if(!m) return '';
  let members = m.members || [];
  // Dynamic roster (2026-07-23, added for Agate) — an opt-in alternative to
  // a curated members array. Chalcedony's two-member roster was handed to
  // us directly and verified, so it stays a hardcoded, exact list. Agate's
  // live roster could not be verified against Supabase in this session, so
  // rather than guess which "*Agate*"-named stones are actually tagged
  // family:"Agate" today, this resolves the roster from live CRYSTALS at
  // render time — the same c.fam field and the same live-data approach the
  // Crystals 101 family tiles already use for their stone counts/examples.
  // Only runs when a guide has no explicit members array, so Calcite,
  // Quartz, Fluorite, Feldspar, and Chalcedony are all unaffected.
  let gridMod = 'fg-card-grid--2';
  if(!members.length && m.dynamicFilterValue && typeof CRYSTALS!=='undefined' && Array.isArray(CRYSTALS)){
    members = CRYSTALS.filter(c=>c.fam===m.dynamicFilterValue)
      .slice()
      .sort((a,b)=>(a.n>b.n?1:(a.n<b.n?-1:0)))
      .map(c=>({stoneId:c.i}));
    gridMod = members.length<=2 ? 'fg-card-grid--2' : 'fg-card-grid--4';
  }
  // m.gridClass (2026-07-23, added for Jasper's fixed twelve-member roster)
  // — an explicit override for guides whose card count doesn't fit the
  // existing --2/--4 modifiers. Chalcedony and Agate never set this, so the
  // computed gridMod above still decides their layout exactly as before.
  if(m.gridClass) gridMod = m.gridClass;
  const cards = members.map(mem=>fgExpressionCardHtml(mem, {showIdentity:true, placeholderOk:true, splitPhrase:m.splitPhrase})).filter(Boolean).join('');
  const emptyNote = (m.dynamicFilterValue && !members.length)
    ? `<p class="fg-fact-body fg-note-center">Live roster still loading — please check back once the encyclopedia has finished loading.</p>` : '';
  // m.useSectionIntro (2026-07-23, added for Jasper) opts into the new shared
  // .fg-section-intro treatment instead of .fg-lead. Chalcedony/Agate never
  // set this, so their intro paragraphs are unchanged.
  const introClass = m.useSectionIntro ? 'fg-section-intro' : 'fg-lead';
  // m.paragraphs (2026-08-04, added for Jasper's two-sentence "Meet Jasper
  // Expressions" intro) — an optional array alternative to the single-string
  // m.intro above. Every other guide's data only ever sets m.intro, so this
  // is purely additive and changes no existing guide's output.
  const introHtml = Array.isArray(m.paragraphs) && m.paragraphs.length
    ? m.paragraphs.map(p=>`<p class="${introClass}">${escapeAttr(p)}</p>`).join('')
    : (m.intro?`<p class="${introClass}">${escapeAttr(m.intro)}</p>`:'');
  return `<section class="fg-section" id="fg-meet-family">
    <h2 class="fg-h2">${escapeAttr(m.title||'Meet the Family')}</h2>
    ${introHtml}
    <div class="fg-card-grid ${gridMod}">${cards}</div>
    ${emptyNote}
  </section>`;
}

/* ── 3. What Chalcedony Actually Is — the structural explanation (Quartz is
   the broader family; chalcedony is fine intergrowths of quartz and moganite,
   too small to see without magnification; that structure, not a different
   chemistry, produces the smooth/waxy/translucent look). Restrained working
   copy restating only the facts supplied for this pass — no invented
   technical claims. The macrocrystalline/microcrystalline comparison has no
   approved licensed photography yet, so both positions render as labeled
   pending placeholders rather than substituting any other image. ── */
function familyGuideWhatChalcedonyIsHtml(guide){
  const w = guide.whatChalcedonyIs;
  if(!w) return '';
  const paras = (w.paragraphs||[]).map(p=>`<p class="fg-prose">${escapeAttr(p)}</p>`).join('');
  return `<section class="fg-section" id="fg-what-chalcedony-is">
    <h2 class="fg-h2">${escapeAttr(w.title||'What Chalcedony Actually Is')}</h2>
    <div class="fg-prose-block">${paras}</div>
    <div class="fg-compare-grid">
      <div class="fg-single-visual"><div class="fg-stonecard-noimg fg-stonecard-noimg--labeled"><span>Photo pending — macrocrystalline Quartz</span></div></div>
      <div class="fg-single-visual"><div class="fg-stonecard-noimg fg-stonecard-noimg--labeled"><span>Photo pending — microcrystalline Chalcedony</span></div></div>
    </div>
  </section>`;
}

/* ── 2. What Agate Actually Is (2026-08-07, revision pass implementing
   Christie's locked Agate Family Guide brief) — a plain unboxed identity
   bridge, matching familyGuideWhatJasperIsHtml's pattern exactly (no image,
   no compare-grid, no placeholder wells; the approved brief explicitly
   calls for "one restrained identity module, not a large specimen feature"
   and says the section "can also work as prose without an additional
   image"). Replaces the prior pass's unbanded-Chalcedony/banded-Agate
   placeholder comparison entirely — that markup and its two "Photo
   pending" wells are removed, not just unassembled. Reuses the shared
   .fg-garnet-bridge paragraph styling already established by Jasper/
   Garnet's own hero-to-roster bridges. guide.whatAgateIs is unchanged as
   the data field name; only this function's markup changes. ── */
function familyGuideWhatAgateIsHtml(guide){
  const w = guide.whatAgateIs;
  if(!w) return '';
  const paras = (w.paragraphs||[]).map(p=>`<p>${escapeAttr(p)}</p>`).join('');
  if(!paras) return '';
  return `<section class="fg-section" id="fg-what-agate-is">
    <h2 class="fg-h2">${escapeAttr(w.title||'What Agate Actually Is')}</h2>
    <div class="fg-garnet-bridge">${paras}</div>
  </section>`;
}

/* ── Family-fit card — Chalcedony/Agate/Jasper branch cards, reusing
   .fg-relationship-card/.fg-relationship-media/.fg-relationship-label as-is
   and adding one footer action: the current guide's own family gets a "you
   are here" badge, a family with a built guide gets a real openFamilyGuide()
   button (Chalcedony's guide now qualifies, alongside Quartz), and a family
   with no guide yet (currently just Jasper) gets a disabled button — never
   a dead link, per the brief's explicit guardrail. Reused as-is by both the
   Chalcedony and Agate guides' relationship sections; only the guide.data
   passed to familyGuideAgateJasperFitHtml() differs between them. ── */
function fgFamilyFitCardHtml(item){
  const c = fgCrystal(item.stoneId);
  if(!c) return '';
  const imgSrc = (typeof firstEncyclopediaPhoto==='function') ? firstEncyclopediaPhoto(c) : '';
  const imgHtml = imgSrc
    ? `<img src="${escapeAttr(imgSrc)}" alt="${escapeAttr(c.n)}" loading="lazy">`
    : `<div class="fg-stonecard-noimg fg-stonecard-noimg--labeled"><span>Photo pending</span></div>`;
  let actionHtml;
  if(item.current){
    actionHtml = `<span class="fg-badge">YOU ARE HERE</span>`;
  }else if(item.guideSlug){
    actionHtml = `<button type="button" class="btn btn-sm" onclick="openFamilyGuide('${escapeAttr(item.guideSlug)}')">Open ${escapeAttr(item.label)} Family Guide</button>`;
  }else{
    actionHtml = `<button type="button" class="btn btn-sm" disabled title="Family guide coming soon">Family guide coming soon</button>`;
  }
  return `<div class="fg-relationship-card">
    <button type="button" class="fg-relationship-media" onclick="openDetail('${escapeAttr(c.i)}')" title="Open ${escapeAttr(c.n)} in Quick View">${imgHtml}</button>
    <div class="fg-relationship-label">${escapeAttr(item.label||c.n)}</div>
    ${item.description?`<p class="fg-fact-body">${escapeAttr(item.description)}</p>`:''}
    <div class="fg-family-fit-action">${actionHtml}</div>
  </div>`;
}

/* ── 4. Chalcedony, Agate & Jasper — the family-grouping explanation:
   mineralogically all three belong to the wider quartz story, but this
   encyclopedia catalogs Agate and Jasper as their own families. A real link
   to the (existing) Quartz Family Guide sits below the three branch cards. ── */
function familyGuideAgateJasperFitHtml(guide){
  const r = guide.agateJasperFit;
  if(!r) return '';
  const branches = (r.branches||[]).map(fgFamilyFitCardHtml).filter(Boolean).join('');
  // r.useSectionIntro (2026-07-23, added for Jasper) opts into the new shared
  // .fg-section-intro treatment instead of .fg-lead fg-lead--wide. Chalcedony
  // and Agate never set this, so their already-approved intro paragraphs
  // here are completely unchanged.
  const introClass = r.useSectionIntro ? 'fg-section-intro' : 'fg-lead fg-lead--wide';
  // r.note (2026-08-04, added for Jasper's revised "Jasper, Agate, or
  // Chalcedony?" section) — an optional closing observation rendered below
  // the branch cards and above the Quartz link button. Chalcedony and Agate
  // never set this, so their output is unchanged.
  return `<section class="fg-section" id="fg-agate-jasper-fit">
    <h2 class="fg-h2">${escapeAttr(r.title||'Chalcedony, Agate & Jasper')}</h2>
    ${r.intro?`<p class="${introClass}">${escapeAttr(r.intro)}</p>`:''}
    <div class="fg-relationship-grid">${branches}</div>
    ${r.note?`<p class="fg-fact-body fg-note-center">${escapeAttr(r.note)}</p>`:''}
    ${r.quartzLinkLabel?`<div class="fg-quartz-link-wrap"><button type="button" class="btn" onclick="openFamilyGuide('quartz')">${escapeAttr(r.quartzLinkLabel)}</button></div>`:''}
  </section>`;
}

/* ── 5. Color, Translucency & Surface — the recognizable-qualities chip list
   (soft translucency, waxy luster, even color, clouding, subtle patterning,
   botryoidal surfaces). Framed explicitly as not a guaranteed test, per the
   brief's guardrail against overstating identification cues. One pending
   placeholder visual; no licensed photo approved yet for this section. ── */
function familyGuideColorTranslucencyHtml(guide){
  const s = guide.colorTranslucencySurface;
  if(!s) return '';
  const chips = (s.qualities||[]).map(q=>`<span class="fg-chip">${escapeAttr(q)}</span>`).join('');
  return `<section class="fg-section" id="fg-color-translucency">
    <h2 class="fg-h2">${escapeAttr(s.title||'Color, Translucency & Surface')}</h2>
    ${s.intro?`<p class="fg-lead fg-lead--wide">${escapeAttr(s.intro)}</p>`:''}
    <div class="fg-single-visual"><div class="fg-stonecard-noimg fg-stonecard-noimg--labeled"><span>Photo pending</span></div></div>
    <div class="fg-zoning-chips">${chips}</div>
    ${s.note?`<p class="fg-fact-body fg-note-center">${escapeAttr(s.note)}</p>`:''}
  </section>`;
}

/* ── 6. Forms Chalcedony Takes — reuses fgPhotoCardHtml exactly as Calcite's
   Shapes section does. No licensed photography approved yet for any of these
   forms, so every card renders via the existing placeholderLabel branch. ── */
function familyGuideFormsHtml(guide){
  const f = guide.forms;
  if(!f) return '';
  const cards = (f.items||[]).map(fgPhotoCardHtml).join('');
  return `<section class="fg-section" id="fg-forms">
    <h2 class="fg-h2">${escapeAttr(f.title||'Forms Chalcedony Takes')}</h2>
    ${f.intro?`<p class="fg-lead">${escapeAttr(f.intro)}</p>`:''}
    <div class="fg-photo-grid fg-photo-grid--4">${cards}</div>
  </section>`;
}

/* ── 7. Chalcedony in the Wider Quartz Story — plain, non-clickable chips
   (Carnelian, Chrysoprase, Onyx, Agate, Jasper). Educational relationships
   only: no stone links, no roster implication, and an explicit note that
   this is not a claim about how the encyclopedia currently browses/groups
   these materials, per the brief's guardrail. ── */
function familyGuideWiderQuartzStoryHtml(guide){
  const w = guide.widerQuartzStory;
  if(!w) return '';
  const chips = (w.examples||[]).map(e=>`<span class="fg-chip">${escapeAttr(e)}</span>`).join('');
  return `<section class="fg-section" id="fg-wider-quartz-story">
    <h2 class="fg-h2">${escapeAttr(w.title||'Chalcedony in the Wider Quartz Story')}</h2>
    ${w.intro?`<p class="fg-lead fg-lead--wide">${escapeAttr(w.intro)}</p>`:''}
    <div class="fg-zoning-chips">${chips}</div>
    ${w.note?`<p class="fg-fact-body fg-note-center">${escapeAttr(w.note)}</p>`:''}
  </section>`;
}

/* ── Chalcedony guide assembly — its own approved section order. ── */
function familyGuideChalcedonyHtml(guide){
  return `
  <div class="fg-guide" data-family-slug="${escapeAttr(guide.slug)}">
    ${familyGuideHeroHtml(guide)}
    ${familyGuideMeetFamilyHtml(guide)}
    ${familyGuideWhatChalcedonyIsHtml(guide)}
    ${familyGuideAgateJasperFitHtml(guide)}
    ${familyGuideColorTranslucencyHtml(guide)}
    ${familyGuideFormsHtml(guide)}
    ${familyGuideWiderQuartzStoryHtml(guide)}
    ${familyGuideCollectionHtml(guide)}
    ${familyGuideClosingHtml(guide)}
    ${familyGuideImageCreditsHtml(guide)}
  </div>`;
}

/* ══ AGATE FAMILY GUIDE — Implementation pass (2026-08-07) building
   Christie's locked Agate Family Guide brief verbatim: approved copy,
   approved 8-section order, and a fixed 10-stone featured roster (replacing
   the prior pass's live dynamicFilterValue resolution, which this brief's
   own roster now supersedes). familyGuideAgateJasperFitHtml, ColorTranslucency,
   Forms, and WiderQuartzStory are no longer used by Agate's assembly — they
   remain fully intact and still power Chalcedony's guide unchanged. Four new
   section renderers below (pattern decoder, comparison table, naming
   examples, collection panels) are Agate-only additions that touch no other
   guide's function, data, or output. ══ */

/* ── 4. How Agate Gets Its Patterns — a compact four-part image-led pattern
   decoder (layered growth, mineral inclusions, botryoidal growth,
   interference color), reusing fgPhotoCardHtml exactly as Jasper's own
   pattern-guide module does. Three panels' images are existing approved
   roster photos via singleStoneId; the interference-color panel uses
   opts.folder:'family-guide-agate' to resolve its item.image
   (fire-agate-iridescence-wc.webp) from the local Agate asset folder
   instead of the default family-guide-calcite folder. ── */
function familyGuideAgatePatternDecoderHtml(guide){
  const p = guide.agatePatternDecoder;
  if(!p) return '';
  const cards = (p.items||[]).map(cat=>fgPhotoCardHtml(cat, {folder:'family-guide-agate'})).join('');
  return `<section class="fg-section" id="fg-agate-pattern">
    <h2 class="fg-h2">${escapeAttr(p.title||'How Agate Gets Its Patterns')}</h2>
    ${p.intro?`<p class="fg-section-intro">${escapeAttr(p.intro)}</p>`:''}
    <div class="fg-photo-grid fg-photo-grid--4">${cards}</div>
  </section>`;
}

/* ── 5. Agate, Chalcedony, or Jasper? — a compact three-column comparison
   table (Material / What it tells you / What to notice), reusing the
   generic fgFormationTableHtml table renderer Copper's "One Deposit, Many
   Outcomes" module already established. Deliberately does not reuse
   familyGuideAgateJasperFitHtml's branch-card component — the approved
   brief calls for exact tabular comparison, not photo cards or catalog
   links, and explicitly says the module "does not need decorative specimen
   cards." familyGuideAgateJasperFitHtml itself is untouched and still
   powers Chalcedony's and Jasper's own relationship sections. ── */
function familyGuideAgateComparisonHtml(guide){
  const c = guide.agateComparison;
  if(!c) return '';
  return `<section class="fg-section" id="fg-agate-comparison">
    <h2 class="fg-h2">${escapeAttr(c.title||'Agate, Chalcedony, or Jasper?')}</h2>
    ${c.intro?`<p class="fg-section-intro">${escapeAttr(c.intro)}</p>`:''}
    ${fgFormationTableHtml(c.table)}
    ${c.note?`<p class="fg-fact-body fg-note-center">${escapeAttr(c.note)}</p>`:''}
  </section>`;
}

/* ── 6. What an Agate Name Can Tell You — three compact illustrated naming
   examples (Gobi Agate, Thunderegg, Turritella Agate), reusing
   fgPhotoCardHtml's singleStoneId branch and the existing .fg-photo-grid--3
   modifier. Grape Agate is deliberately not repeated here — it stays in the
   featured roster and pattern decoder only, per the approved brief. ── */
function familyGuideAgateNamingHtml(guide){
  const n = guide.agateNaming;
  if(!n) return '';
  const cards = (n.items||[]).map(cat=>fgPhotoCardHtml(cat)).join('');
  const introHtml = Array.isArray(n.intro)
    ? n.intro.map(p=>`<p class="fg-section-intro">${escapeAttr(p)}</p>`).join('')
    : (n.intro?`<p class="fg-section-intro">${escapeAttr(n.intro)}</p>`:'');
  return `<section class="fg-section" id="fg-agate-naming">
    <h2 class="fg-h2">${escapeAttr(n.title||'What an Agate Name Can Tell You')}</h2>
    ${introHtml}
    <div class="fg-photo-grid fg-photo-grid--3">${cards}</div>
  </section>`;
}

/* ── 7. Agate in Your Collection — three restrained, text-only care panels,
   reusing the generic fgGarnetCollectionCardHtml/.fg-garnet-collection-grid
   component exactly as Jasper's own collection section does. No decorative
   specimen image, per the approved brief. ── */
function familyGuideAgateCollectionHtml(guide){
  const c = guide.agateCollection;
  if(!c) return '';
  const cards = (c.cards||[]).map(fgGarnetCollectionCardHtml).filter(Boolean).join('');
  return `<section class="fg-section" id="fg-agate-collection">
    <h2 class="fg-h2">${escapeAttr(c.title||'Agate in Your Collection')}</h2>
    ${c.intro?`<p class="fg-section-intro">${escapeAttr(c.intro)}</p>`:''}
    <div class="fg-garnet-collection-grid">${cards}</div>
  </section>`;
}

/* ── Hero — dedicated Agate layout (visual correction, 2026-08-07, third
   pass). The shared familyGuideHeroHtml keeps "Agate asks" inside the
   two-column .fg-hero-copy, so its available width is capped by whatever
   is left after the media column — not enough for Agate's approved
   57-character question to fit on one line at normal desktop width
   without either shrinking the image to a sliver or shrinking the
   approved 28px prompt typography, both of which the brief rules out.
   Feldspar already solved exactly this by breaking guide.hero.question
   out of .fg-hero-copy into its own full-width fg-hero-prompt row below
   the two-column grid (familyGuideFeldsparHeroHtml) — this reuses that
   exact established pattern rather than inventing a new one, so Agate
   gets its own dedicated hero function for the same reason Feldspar and
   Calcite do. Everything else (eyebrow/title/subtitle/two-paragraph
   condensedIntro/media) is identical to the shared familyGuideHeroHtml
   markup. ── */
function familyGuideAgateHeroHtml(guide){
  const hero = guide.hero||{};
  return `<section class="fg-hero" id="fg-hero">
    <div class="fg-hero-grid">
      <div class="fg-hero-copy">
        ${hero.eyebrow?`<div class="fg-eyebrow">${escapeAttr(hero.eyebrow)}</div>`:''}
        <h1 class="fg-hero-title">${escapeAttr(hero.title||guide.displayName)}</h1>
        ${hero.signatureLine?`<p class="fg-hero-sub">${escapeAttr(hero.signatureLine)}</p>`:''}
        ${Array.isArray(hero.condensedIntro)
          ? hero.condensedIntro.map(p=>`<p class="fg-hero-body">${escapeAttr(p)}</p>`).join('')
          : (hero.condensedIntro?`<p class="fg-hero-body">${escapeAttr(hero.condensedIntro)}</p>`:'')}
      </div>
      ${fgHeroMediaHtml(guide)}
    </div>
    ${hero.question?`<div class="fg-hero-prompt fg-agate-hero-prompt">
      ${hero.promptLeadIn?`<div class="fg-hero-prompt-lead">${escapeAttr(hero.promptLeadIn)}</div>`:''}
      <div class="fg-hero-question">${escapeAttr(hero.question)}</div>
      ${hero.supportingLine?`<div class="fg-hero-supporting">${escapeAttr(hero.supportingLine)}</div>`:''}
    </div>`:''}
  </section>`;
}

/* ── Agate guide assembly — approved 8-section order: Hero, What Agate
   Actually Is, Meet Ten Agate Expressions, How Agate Gets Its Patterns,
   Agate/Chalcedony/Jasper comparison, What an Agate Name Can Tell You,
   Agate in Your Collection, Closing. familyGuideImageCreditsHtml is not
   called — no published third-party image is used on this pass (Christie's
   hero photo needs no attribution; the Fire Agate Wikimedia Commons image
   remains unpublished pending the exact approved EB file — see report), so
   Photo Credits routes through the shared footer link only, matching the
   Garnet/Jasper/Copper pattern. ── */
function familyGuideAgateHtml(guide){
  return `
  <div class="fg-guide" data-family-slug="${escapeAttr(guide.slug)}">
    ${familyGuideAgateHeroHtml(guide)}
    ${familyGuideWhatAgateIsHtml(guide)}
    ${familyGuideMeetFamilyHtml(guide)}
    ${familyGuideAgatePatternDecoderHtml(guide)}
    ${familyGuideAgateComparisonHtml(guide)}
    ${familyGuideAgateNamingHtml(guide)}
    ${familyGuideAgateCollectionHtml(guide)}
    ${familyGuideClosingHtml(guide)}
  </div>`;
}

/* ══════════════════════════════════════════════════════════════════════
   JASPER FAMILY GUIDE — Revision pass (2026-08-04) implementing Christie's
   locked Jasper Family Guide Revision brief. Both rough-vs-polished modules
   and the five-category "Pattern Is Not the Same as Identity" naming grid
   are fully removed (function definitions deleted, not just unassembled),
   along with their empty cards, missing-image wells, and working-draft
   placeholder language. Reuses Chalcedony/Agate's generic Agate/Jasper-Fit
   component unchanged (guide.agateJasperFit, opted in via useSectionIntro),
   plus the generic three-card heading/body component first built for Garnet
   (fgGarnetCollectionCardHtml/.fg-garnet-collection-grid) for both What a
   Jasper Name Can Tell You and Jasper in Your Collection below. ══ */

/* ── 2. What Jasper Actually Is — a plain unboxed geological bridge (no
   image, no card system, per the brief's explicit instruction), sitting
   between the hero and Meet Jasper Expressions. Reuses the same
   .fg-garnet-bridge paragraph styling Garnet's hero-to-roster bridge
   already established (a shared, non-garnet-specific component despite its
   original name — see Tourmaline's .fg-card-grid--garnet-roster reuse for
   precedent), wrapped in its own titled .fg-section so it participates in
   the ordinary major-section rhythm. ── */
function familyGuideWhatJasperIsHtml(guide){
  const w = guide.whatJasperIs;
  if(!w) return '';
  const paras = (w.paragraphs||[]).map(p=>`<p>${escapeAttr(p)}</p>`).join('');
  if(!paras) return '';
  return `<section class="fg-section" id="fg-what-jasper-is">
    <h2 class="fg-h2">${escapeAttr(w.title||'What Jasper Actually Is')}</h2>
    <div class="fg-garnet-bridge">${paras}</div>
  </section>`;
}

/* ── 4. How Jasper Gets Its Patterns — a four-card image-led teaching
   module (Broken and Rejoined, Layered and Scenic, Rounded and Orbicular,
   Spotted and Mottled). Each card's image reuses the named roster stone's
   own existing approved encyclopedia photo via fgPhotoCardHtml's
   singleStoneId branch (Brecciated/Picture/Ocean/Leopard Skin) — no new
   photography sourced, per the brief's "reuse the same existing images"
   instruction. ── */
function familyGuideJasperPatternHtml(guide){
  const p = guide.patternGuide;
  if(!p) return '';
  const cards = (p.categories||[]).map(cat=>fgPhotoCardHtml(cat)).join('');
  return `<section class="fg-section" id="fg-jasper-pattern">
    <h2 class="fg-h2">${escapeAttr(p.title||'How Jasper Gets Its Patterns')}</h2>
    ${p.sectionIntro?`<p class="fg-section-intro">${escapeAttr(p.sectionIntro)}</p>`:''}
    <div class="fg-photo-grid fg-photo-grid--4">${cards}</div>
  </section>`;
}

/* ── 5. What a Jasper Name Can Tell You — three compact teaching panels
   (Appearance, Place, Trade Use), reusing the generic three-card
   heading/body component first built for Garnet in Your Collection
   (fgGarnetCollectionCardHtml/.fg-garnet-collection-grid — plain neutral
   cards, not garnet-specific styling). Replaces the prior numbered
   classification grid and stone-name pill cluster entirely. ── */
function familyGuideJasperNameHtml(guide){
  const n = guide.whatJasperNameTells;
  if(!n) return '';
  const cards = (n.panels||[]).map(fgGarnetCollectionCardHtml).filter(Boolean).join('');
  return `<section class="fg-section" id="fg-jasper-name">
    <h2 class="fg-h2">${escapeAttr(n.title||'What a Jasper Name Can Tell You')}</h2>
    ${n.intro?`<p class="fg-section-intro">${escapeAttr(n.intro)}</p>`:''}
    <div class="fg-garnet-collection-grid">${cards}</div>
    ${n.note?`<p class="fg-fact-body fg-note-center">${escapeAttr(n.note)}</p>`:''}
  </section>`;
}

/* ── 7. Jasper in Your Collection — three restrained practical cards
   (Everyday Handling, Care & Cleaning, Buying by Name), reusing the same
   generic three-card component as What a Jasper Name Can Tell You above.
   Its own dedicated function/data field (guide.jasperCollection) rather
   than the shared Care-for-It/Remember-This/Watch-For familyGuideCollection
   Html, which doesn't fit this brief's plain three-card design. ── */
function familyGuideJasperCollectionHtml(guide){
  const c = guide.jasperCollection;
  if(!c) return '';
  const cards = (c.cards||[]).map(fgGarnetCollectionCardHtml).filter(Boolean).join('');
  return `<section class="fg-section" id="fg-jasper-collection">
    <h2 class="fg-h2">${escapeAttr(c.title||'Jasper in Your Collection')}</h2>
    ${c.intro?`<p class="fg-section-intro">${escapeAttr(c.intro)}</p>`:''}
    <div class="fg-garnet-collection-grid">${cards}</div>
  </section>`;
}

/* ── Jasper guide assembly — approved 8-section order: Hero, What Jasper
   Actually Is, Meet Jasper Expressions, How Jasper Gets Its Patterns, What
   a Jasper Name Can Tell You, Jasper/Agate/Chalcedony, Jasper in Your
   Collection, Closing. familyGuideImageCreditsHtml is not called — no
   third-party imagery is used on this page, matching the Garnet/Copper
   pattern of routing Photo Credits through the shared footer link instead. ── */
function familyGuideJasperHtml(guide){
  return `
  <div class="fg-guide" data-family-slug="${escapeAttr(guide.slug)}">
    ${familyGuideHeroHtml(guide)}
    ${familyGuideWhatJasperIsHtml(guide)}
    ${familyGuideMeetFamilyHtml(guide)}
    ${familyGuideJasperPatternHtml(guide)}
    ${familyGuideJasperNameHtml(guide)}
    ${familyGuideAgateJasperFitHtml(guide)}
    ${familyGuideJasperCollectionHtml(guide)}
    ${familyGuideClosingHtml(guide)}
  </div>`;
}

/* ══════════════════════════════════════════════════════════════════════
   GARNET FAMILY GUIDE — complete rebuild (2026-08-01) per Christie's locked
   "Complete Garnet Family-Guide Rebuild" brief. Replaces the prior six-
   section Garnet implementation entirely with the approved structure: a
   restrained hero (three white image wells: Pyrope, Spessartine,
   Uvarovite), an unboxed geological bridge paragraph, six equal Meet the
   Garnets tiles (Pyrope intentionally non-clicking — no approved Stone ID),
   a two-panel Six Foundations/Two Connected Groups relationship module,
   four compact Familiar Names teaching cards, three text-only Garnet in
   Your Collection cards, and a restrained closing + compact Return pill.
   Purely Garnet-scoped: nothing here touches a Calcite/Quartz/Fluorite/
   Feldspar/Chalcedony/Agate/Jasper/Tourmaline/Obsidian/Copper selector,
   function, or data field. ══ */

/* ── Hero — dedicated to Garnet because its three-image collage mixes two
   family-guide-only assets (Pyrope, Spessartine — no Stone ID, so they
   cannot resolve through fgCrystal/firstEncyclopediaPhoto) with one
   existing-roster image (Uvarovite, C-0355, resolved normally so its
   underlying encyclopedia image is reused, not replaced). Each of the
   three collage images gets its own restrained white well
   (.fg-garnet-hero-well, object-fit:contain) rather than the shared
   .fg-hero-media-grid's cover-cropped, non-white cells, per the brief's
   explicit white-image-well requirement. No divider, no emphasis line, no
   supporting line — the hero ends after the reflective prompt. ── */
function fgGarnetHeroWellHtml(m){
  if(!m) return '';
  let src = '', alt = m.alt || m.name || '';
  if(m.url){
    src = m.url;
  }else if(m.stoneId){
    const c = fgCrystal(m.stoneId);
    if(c){
      src = (typeof firstEncyclopediaPhoto==='function') ? firstEncyclopediaPhoto(c) : '';
      alt = alt || c.n;
    }
  }
  if(!src) return '';
  return `<div class="fg-garnet-hero-well"><img src="${escapeAttr(src)}" alt="${escapeAttr(alt)}" loading="lazy"></div>`;
}
/* 2026-08 correction: the reflective prompt sits below the complete
   two-column .fg-hero-grid, spanning the hero's full interior width. The
   lead-in ("Garnet asks:") and the question are two separate block-level
   divs (not inline spans relying on wrapping), so "Garnet asks:" always
   renders on its own first line and the question always begins on its own
   next line, at every viewport width — a reliable structural break rather
   than an accidental wrap. */
function familyGuideGarnetHeroHtml(guide){
  const hero = guide.hero||{};
  const wells = (hero.media||[]).map(fgGarnetHeroWellHtml).filter(Boolean).join('');
  return `<section class="fg-hero fg-garnet-hero" id="fg-hero">
    <div class="fg-hero-grid">
      <div class="fg-hero-copy">
        ${hero.eyebrow?`<div class="fg-eyebrow">${escapeAttr(hero.eyebrow)}</div>`:''}
        <h1 class="fg-hero-title">${escapeAttr(hero.title||guide.displayName)}</h1>
        ${hero.subhead?`<p class="fg-garnet-hero-subhead">${escapeAttr(hero.subhead)}</p>`:''}
        ${hero.openingParagraph?`<p class="fg-hero-body">${escapeAttr(hero.openingParagraph)}</p>`:''}
      </div>
      <div class="fg-garnet-hero-wells">${wells}</div>
    </div>
    ${hero.question?`<div class="fg-garnet-hero-prompt">
      ${hero.promptLeadIn?`<div class="fg-garnet-hero-prompt-lead">${escapeAttr(hero.promptLeadIn)}</div>`:''}
      <div class="fg-garnet-hero-prompt-question">${escapeAttr(hero.question)}</div>
    </div>`:''}
  </section>`;
}

/* ── Geological bridge — one unboxed paragraph sitting outside the hero, in
   the complete shared primary content width, giving a visually grounded
   (quiet side-accent, not a large decorative card) transition into Meet
   the Garnets. 2026-08 correction: previously constrained to an arbitrary
   82ch measure, which read as narrower than every other Garnet section —
   now uses the full frame like the rest of the page. ── */
function familyGuideGarnetBridgeHtml(guide){
  const text = guide.geologicalBridge;
  if(!text) return '';
  return `<div class="fg-garnet-bridge"><p>${escapeAttr(text)}</p></div>`;
}

/* ── Meet the Garnets — normalized (2026-08 correction) to reuse the
   established Featured Copper Minerals card anatomy verbatim: the shared
   .fg-mineralcard/.fg-mineralcard-media/.fg-mineralcard-header/
   .fg-stonecard-qv/.fg-mineralcard-text component and the
   .fg-card-grid--garnet-roster grid Copper's six-card roster already uses
   (three-up/two-row desktop, 46%-flex tablet, 100%-flex mobile — all via
   existing rules, no new Garnet-specific grid CSS needed). Only the image
   resolution differs from fgMineralCardHtml's default (member.stoneId ->
   firstEncyclopediaPhoto only): Spessartine has a Stone ID (C-0131) but no
   canonical encyclopedia photo on file, so it — like Pyrope — needs its
   uploaded family-guide asset instead. fgGarnetSpeciesImage (shared with
   the Six Foundations panel thumbnails below) resolves member.image first,
   falling back to firstEncyclopediaPhoto(stoneId), so every card still
   shows its exact existing approved image. Pyrope has no stoneId at all —
   its card renders through the same unlinked branch fgMineralCardHtml
   already established for Copper's Plancheite: no button, no onclick, no
   Quick View, name still anchored in the same header-row position as the
   other five. ── */
function fgGarnetFeaturedCardHtml(mem){
  if(!mem) return '';
  const crystal = mem.stoneId ? fgCrystal(mem.stoneId) : null;
  const src = mem.image || (crystal && typeof firstEncyclopediaPhoto==='function' ? firstEncyclopediaPhoto(crystal) : '');
  const imgHtml = src
    ? `<img src="${escapeAttr(src)}" alt="${escapeAttr(mem.name||'')}" loading="lazy">`
    : `<div class="fg-stonecard-noimg fg-stonecard-noimg--labeled"><span>Photo pending</span></div>`;
  const clickable = !!crystal;
  const mediaHtml = clickable
    ? `<button type="button" class="fg-mineralcard-media" onclick="openDetail('${escapeAttr(crystal.i)}')" title="Open ${escapeAttr(crystal.n)} in Quick View">${imgHtml}</button>`
    : `<div class="fg-mineralcard-media" title="${escapeAttr(mem.name||'')} — no standalone encyclopedia entry">${imgHtml}</div>`;
  const qvHtml = clickable
    ? `<button type="button" class="fg-stonecard-qv" onclick="openDetail('${escapeAttr(crystal.i)}')">Quick View</button>`
    : '';
  return `<div class="fg-mineralcard${clickable?'':' fg-mineralcard--unlinked'}">
    ${mediaHtml}
    <div class="fg-mineralcard-body">
      <div class="fg-mineralcard-header">
        <div class="fg-stonecard-name">${escapeAttr(mem.name||'')}</div>
        ${qvHtml}
      </div>
      <p class="fg-mineralcard-text">${escapeAttr(mem.caption||'')}</p>
    </div>
  </div>`;
}
function familyGuideMeetTheGarnetsHtml(guide){
  const m = guide.meetTheGarnets;
  if(!m) return '';
  const cards = (m.members||[]).map(fgGarnetFeaturedCardHtml).filter(Boolean).join('');
  return `<section class="fg-section" id="fg-meet-the-garnets">
    <h2 class="fg-h2">${escapeAttr(m.title||'Meet the Garnets')}</h2>
    ${m.intro?`<p class="fg-section-intro">${escapeAttr(m.intro)}</p>`:''}
    <div class="fg-card-grid fg-card-grid--garnet-roster">${cards}</div>
  </section>`;
}

/* ── Six Foundations, Two Connected Groups — one integrated teaching
   composition: two balanced panels (Pyralspite/Ugrandite) plus a
   connecting note, all within one .fg-section so the standard 76px/56px
   major-section gap applies once, after the whole composition, per the
   brief's "integrated composition = one major section" rule. Small
   non-clickable thumbnails (2026-08 correction) are added beside each
   name/caption pair — visual reminders only, so readers can connect a
   panel entry back to its Meet the Garnets tile without a second large
   gallery. Each thumbnail resolves through the exact same image already
   used for that species in Meet the Garnets (fgGarnetSpeciesImage below),
   never a re-fetched or substituted image. Ugrandite's item order (Andradite, Grossular,
   Uvarovite) is authored directly in guide.sixFoundationsTwoGroups.
   rightPanel.items — this function renders items in whatever order the
   data provides, it does not itself impose an order. ── */
function fgGarnetSpeciesImage(name, guide){
  const members = (guide.meetTheGarnets && guide.meetTheGarnets.members) || [];
  const mem = members.find(m => m.name === name);
  if(!mem) return { src: '', alt: name };
  let src = '';
  if(mem.image){
    src = mem.image;
  }else if(mem.stoneId){
    const c = fgCrystal(mem.stoneId);
    src = c && typeof firstEncyclopediaPhoto==='function' ? firstEncyclopediaPhoto(c) : '';
  }
  return { src, alt: name };
}
function fgGarnetGroupPanelHtml(panel, modifier, guide){
  if(!panel) return '';
  const items = (panel.items||[]).map(it=>{
    const img = fgGarnetSpeciesImage(it.name, guide);
    const mediaHtml = img.src
      ? `<div class="fg-garnet-group-item-media"><img src="${escapeAttr(img.src)}" alt="${escapeAttr(img.alt)}" loading="lazy"></div>`
      : `<div class="fg-garnet-group-item-media"></div>`;
    return `<div class="fg-garnet-group-item">
    ${mediaHtml}
    <div class="fg-garnet-group-item-text">
      <div class="fg-garnet-group-item-name">${escapeAttr(it.name||'')}</div>
      <p class="fg-garnet-group-item-caption">${escapeAttr(it.caption||'')}</p>
    </div>
  </div>`;
  }).join('');
  return `<div class="fg-garnet-group-panel fg-garnet-group-panel--${modifier}">
    <div class="fg-garnet-group-heading">${escapeAttr(panel.heading||'')}</div>
    ${panel.intro?`<p class="fg-garnet-group-intro">${escapeAttr(panel.intro)}</p>`:''}
    ${items}
  </div>`;
}
function familyGuideSixFoundationsHtml(guide){
  const s = guide.sixFoundationsTwoGroups;
  if(!s) return '';
  return `<section class="fg-section" id="fg-six-foundations">
    <h2 class="fg-h2">${escapeAttr(s.title||'Six Foundations, Two Connected Groups')}</h2>
    ${s.intro?`<p class="fg-section-intro">${escapeAttr(s.intro)}</p>`:''}
    <div class="fg-garnet-groups">
      ${fgGarnetGroupPanelHtml(s.leftPanel, 'left', guide)}
      ${fgGarnetGroupPanelHtml(s.rightPanel, 'right', guide)}
    </div>
    ${s.connectedNote?`<p class="fg-garnet-connected-note">${escapeAttr(s.connectedNote)}</p>`:''}
  </section>`;
}

/* ── Where Familiar Garnet Names Fit — four compact illustrated cards
   (Rhodolite, Tsavorite, Hessonite, Demantoid). Each uses its own uploaded
   family-guide asset (guide.familiarNames.cards[].image, a direct Supabase
   Storage URL — none of these four has a Stone ID), rendered in a small
   fixed-height white well so the photo stays secondary to the relationship
   copy, per the brief. No Quick View, no openDetail() call, no invented
   encyclopedia link — see the brief's explicit "do not infer links"
   instruction. ── */
function fgGarnetNameCardHtml(card){
  if(!card) return '';
  const imgHtml = card.image
    ? `<img src="${escapeAttr(card.image)}" alt="${escapeAttr(card.alt||card.name||'')}" loading="lazy">`
    : `<div class="fg-stonecard-noimg fg-stonecard-noimg--labeled"><span>Photo pending</span></div>`;
  return `<div class="fg-garnet-name-card">
    <div class="fg-garnet-name-media">${imgHtml}</div>
    <div class="fg-garnet-name-title">${escapeAttr(card.name||'')}</div>
    <p class="fg-garnet-name-caption">${escapeAttr(card.caption||'')}</p>
  </div>`;
}
function familyGuideFamiliarNamesHtml(guide){
  const f = guide.familiarNames;
  if(!f) return '';
  const cards = (f.cards||[]).map(fgGarnetNameCardHtml).filter(Boolean).join('');
  return `<section class="fg-section" id="fg-familiar-names">
    <h2 class="fg-h2">${escapeAttr(f.title||'Where Familiar Garnet Names Fit')}</h2>
    ${f.intro?`<p class="fg-section-intro">${escapeAttr(f.intro)}</p>`:''}
    <div class="fg-garnet-name-grid">${cards}</div>
  </section>`;
}

/* ── Garnet in Your Collection — three compact text-only teaching cards
   (Read the full name / Let color guide, not decide / Notice how it
   occurs). Deliberately its own small renderer rather than reusing the
   shared familyGuideCollectionHtml's Care-for-It/Remember-This/Watch-For
   schema, which doesn't fit this brief's three-card, no-thumbnail,
   no-catalog-links design. ── */
function fgGarnetCollectionCardHtml(card){
  if(!card) return '';
  return `<div class="fg-garnet-collection-card">
    <div class="fg-garnet-collection-card-heading">${escapeAttr(card.heading||'')}</div>
    <p class="fg-garnet-collection-card-body">${escapeAttr(card.body||'')}</p>
  </div>`;
}
function familyGuideGarnetCollectionHtml(guide){
  const c = guide.garnetCollection;
  if(!c) return '';
  const cards = (c.cards||[]).map(fgGarnetCollectionCardHtml).filter(Boolean).join('');
  return `<section class="fg-section" id="fg-garnet-collection">
    <h2 class="fg-h2">${escapeAttr(c.title||'Garnet in Your Collection')}</h2>
    ${c.intro?`<p class="fg-section-intro">${escapeAttr(c.intro)}</p>`:''}
    <div class="fg-garnet-collection-grid">${cards}</div>
  </section>`;
}

/* ── Garnet guide assembly — its own approved section order. Purely
   additive: nothing here changes any other guide's assembly, data, or
   rendered output. familyGuideImageCreditsHtml is deliberately not called
   here — Photo Credits routing is the shared footer link -> credits.html#
   garnet (see fgSetFooterCreditsLink's anchoredSlugs), matching the
   Copper/Calcite pattern, so no redundant in-page credits disclosure is
   rendered. ── */
function familyGuideGarnetHtml(guide){
  return `
  <div class="fg-guide" data-family-slug="${escapeAttr(guide.slug)}">
    ${familyGuideGarnetHeroHtml(guide)}
    ${familyGuideGarnetBridgeHtml(guide)}
    ${familyGuideMeetTheGarnetsHtml(guide)}
    ${familyGuideSixFoundationsHtml(guide)}
    ${familyGuideFamiliarNamesHtml(guide)}
    ${familyGuideGarnetCollectionHtml(guide)}
    ${familyGuideClosingHtml(guide)}
  </div>`;
}

/* ══════════════════════════════════════════════════════════════════════
   TOURMALINE FAMILY GUIDE — controlled rebuild (Claude Code Brief:
   Tourmaline Family Guide Rebuild), replacing the prior 2026-07-23
   implementation entirely rather than patching it. Built directly in the
   finalized shared family-guide system per the approved Markdown
   (Tourmaline-Family-Guide.md) and visual plan
   (Tourmaline-Family-Guide-Visual-Plan.md), with this brief's explicit
   corrections controlling wherever it differs from those sources (hero
   eyebrow/prompt copy, "Chosen for:" label, exact metaphysical-use lines,
   and the two-step "How Tourmaline Gets Its Color" / "Color Zoning" split).
   Reuses shared components wherever one already fits (fgPhotoCardHtml,
   fgFormationTableHtml, .fg-branch-grid, .fg-prose-block/.fg-prose,
   .fg-lead, familyGuideCollectionHtml, familyGuideClosingHtml); new
   markup/CSS is confined to the genuinely unique pieces this guide needs
   (the "Chosen for:" line, the takeaway-strip component, and the
   electrical module's panel/facts composition). Nothing here touches a
   Calcite/Quartz/
   Fluorite/Feldspar/Chalcedony/Agate/Jasper/Garnet/Obsidian/Copper
   selector, function, or data field. ══ */

/* ── 1. Meet the Tourmaline Family — six featured cards (five catalog
   stones plus Blue Tourmaline as a non-catalog teaching card). Reuses the
   shared .fg-mineralcard/-media/-header/.fg-stonecard-name/.fg-stonecard-qv
   grammar (same anatomy as Garnet's/Copper's featured rosters) but needs
   its own card function because this guide's brief calls for two
   independent body lines per card — a physical-identification sentence
   and a distinctly separated "Chosen for:" metaphysical-use line — which
   neither fgGarnetFeaturedCardHtml nor fgStoneCardHtml supports. Blue
   Tourmaline (no stoneId) renders through the same unlinked branch already
   established by fgGarnetFeaturedCardHtml for Garnet's Pyrope: no Stone
   ID, slug, Quick View, or invented catalog link. ── */
function fgTourmalineFamilyCardHtml(mem){
  if(!mem) return '';
  const crystal = mem.stoneId ? fgCrystal(mem.stoneId) : null;
  const src = mem.image || (crystal && typeof firstEncyclopediaPhoto==='function' ? firstEncyclopediaPhoto(crystal) : '');
  const imgHtml = src
    ? `<img src="${escapeAttr(src)}" alt="${escapeAttr(mem.name||'')}" loading="lazy">`
    : `<div class="fg-stonecard-noimg fg-stonecard-noimg--labeled"><span>Photo pending</span></div>`;
  const clickable = !!crystal;
  const mediaHtml = clickable
    ? `<button type="button" class="fg-mineralcard-media" onclick="openDetail('${escapeAttr(crystal.i)}')" title="Open ${escapeAttr(mem.name||crystal.n)} in Quick View">${imgHtml}</button>`
    : `<div class="fg-mineralcard-media" title="${escapeAttr(mem.name||'')} — family-guide teaching card, not a linked encyclopedia entry">${imgHtml}</div>`;
  const qvHtml = clickable
    ? `<button type="button" class="fg-stonecard-qv" onclick="openDetail('${escapeAttr(crystal.i)}')">Quick View</button>`
    : '';
  return `<div class="fg-mineralcard${clickable?'':' fg-mineralcard--unlinked'}">
    ${mediaHtml}
    <div class="fg-mineralcard-body">
      <div class="fg-mineralcard-header">
        <div class="fg-stonecard-name">${escapeAttr(mem.name||'')}</div>
        ${qvHtml}
      </div>
      <p class="fg-mineralcard-text">${escapeAttr(mem.identSentence||'')}</p>
      ${mem.chosenFor?`<div class="fg-tourmaline-chosen-for"><span class="fg-tourmaline-chosen-label">Chosen for:</span> ${escapeAttr(mem.chosenFor)}</div>`:''}
    </div>
  </div>`;
}
function familyGuideMeetTourmalineFamilyHtml(guide){
  const m = guide.meetTourmalineFamily;
  if(!m) return '';
  const cards = (m.members||[]).map(fgTourmalineFamilyCardHtml).filter(Boolean).join('');
  return `<section class="fg-section" id="fg-meet-tourmaline-family">
    <h2 class="fg-h2">${escapeAttr(m.title||'Meet the Tourmaline Family')}</h2>
    ${m.intro?`<p class="fg-lead">${escapeAttr(m.intro)}</p>`:''}
    <div class="fg-card-grid fg-card-grid--garnet-roster">${cards}</div>
  </section>`;
}

/* ── 2. What Tourmaline Actually Is — short text-led identity section:
   two plain paragraphs and one restrained typographic emphasis line
   ("Shared structure. Variable chemistry."), reusing the existing
   .fg-prose-block/.fg-prose pattern already established for What
   Chalcedony Actually Is, plus the previously-defined-but-unused shared
   .fg-prose-emphasis class for the takeaway line. No card grid and no
   image, per the visual plan — the titled section sits directly after the
   hero, with no untitled bridge paragraph. ── */
function familyGuideWhatTourmalineIsHtml(guide){
  const w = guide.whatTourmalineIs;
  if(!w) return '';
  const paras = (w.paragraphs||[]).map(p=>`<p class="fg-prose">${escapeAttr(p)}</p>`).join('');
  return `<section class="fg-section" id="fg-what-tourmaline-is">
    <h2 class="fg-h2">${escapeAttr(w.title||'What Tourmaline Actually Is')}</h2>
    <div class="fg-prose-block">${paras}${w.emphasis?`<p class="fg-prose-emphasis">${escapeAttr(w.emphasis)}</p>`:''}</div>
  </section>`;
}

/* ── 4. Schorl, Dravite, Elbaite: What Do Those Names Mean? — rebuilt
   again (Claude Code Brief: Final Tourmaline Corrections) as one
   full-width editorial comparison table, replacing the two-row card
   arrangement (and its "The Species Beneath the Color" subheading)
   entirely. Reuses fgFormationTableHtml/.fg-table verbatim — the same
   shared component already approved for Copper's "One Deposit, Many
   Outcomes" and Agate's Agate/Chalcedony/Jasper comparison, including its
   built-in narrow-mobile behavior (stacked rows with field labels, no
   horizontal scroll). No Tourmaline-specific table CSS needed. ── */
function familyGuideTourmalineNamingHtml(guide){
  const n = guide.namingDecoder;
  if(!n) return '';
  return `<section class="fg-section" id="fg-tourmaline-naming">
    <h2 class="fg-h2">${escapeAttr(n.title||'Schorl, Dravite, Elbaite: What Do Those Names Mean?')}</h2>
    ${n.intro?`<p class="fg-lead">${escapeAttr(n.intro)}</p>`:''}
    ${fgFormationTableHtml(n.table)}
  </section>`;
}

/* ── 5. How Tourmaline Gets Its Color — plain prose only, no image. Kept
   as its own titled section, separate from Color Zoning below, per this
   brief's explicit numbered page structure (steps 5 and 6), which
   supersedes the visual plan's embedded single-section treatment. ── */
function familyGuideTourmalineColorHtml(guide){
  const c = guide.tourmalineColor;
  if(!c) return '';
  const paras = (c.paragraphs||[]).map(p=>`<p class="fg-prose">${escapeAttr(p)}</p>`).join('');
  return `<section class="fg-section" id="fg-tourmaline-color">
    <h2 class="fg-h2">${escapeAttr(c.title||'How Tourmaline Gets Its Color')}</h2>
    <div class="fg-prose-block">${paras}</div>
  </section>`;
}

/* ── 6. Color Zoning — one integrated image-led teaching composition
   (Claude Code Brief: Tourmaline Family Guide: Final Layout Corrections):
   intro paragraph, then a short lead-in sentence immediately above the
   two matched zoning examples (longitudinal and center-outward), reusing
   fgPhotoCardHtml/.fg-photo-grid--2 exactly as every other guide's two-up
   image comparison already does. The prior post-card "WHAT THIS SHOWS"
   eyebrow/divider treatment is removed entirely — this sentence now reads
   as an ordinary body lead-in before the cards, not a labeled takeaway
   after them. .fg-tourmaline-zoning-leadin only overrides the lead-in's
   own bottom margin (~24px to the card row); normal paragraph spacing
   from the intro above is untouched (see styles.css). ── */
function familyGuideTourmalineZoningHtml(guide){
  const z = guide.colorZoning;
  if(!z) return '';
  const cards = (z.examples||[]).map(ex=>fgPhotoCardHtml(ex, {folder:'family-guide-tourmaline'})).join('');
  return `<section class="fg-section" id="fg-tourmaline-zoning">
    <h2 class="fg-h2">${escapeAttr(z.title||'Color Zoning')}</h2>
    ${z.intro?`<p class="fg-lead">${escapeAttr(z.intro)}</p>`:''}
    ${z.leadIn?`<p class="fg-lead fg-tourmaline-zoning-leadin">${escapeAttr(z.leadIn)}</p>`:''}
    <div class="fg-photo-grid fg-photo-grid--2">${cards}</div>
  </section>`;
}

/* ── 7. Why Tourmaline Crystals Are So Ribbed — intro prose plus a
   compact two-part visual lesson (lengthwise ribs, rounded-triangular
   cross section), reusing fgPhotoCardHtml/.fg-photo-grid--2 exactly as
   Color Zoning above. ── */
function familyGuideTourmalineRibbingHtml(guide){
  const r = guide.tourmalineRibbing;
  if(!r) return '';
  const paras = (r.paragraphs||[]).map(p=>`<p class="fg-prose">${escapeAttr(p)}</p>`).join('');
  const cards = (r.examples||[]).map(ex=>fgPhotoCardHtml(ex, {folder:'family-guide-tourmaline'})).join('');
  return `<section class="fg-section" id="fg-tourmaline-ribbing">
    <h2 class="fg-h2">${escapeAttr(r.title||'Why Tourmaline Crystals Are So Ribbed')}</h2>
    <div class="fg-prose-block">${paras}</div>
    <div class="fg-photo-grid fg-photo-grid--2">${cards}</div>
  </section>`;
}

/* ── 8. Tourmaline's Electrical Quirk — rebuilt (Claude Code Brief: Final
   Tourmaline Corrections) as two substantial equal sibling panels using
   the approved Feldspar branch-panel format as the visual model, per the
   brief. Reuses the shared .fg-branch-grid (2 columns desktop, stacks at
   900px — already the exact behavior Feldspar's own branch grid uses) and
   the generic .fg-branch-title class for each panel's Georgia name.
   .fg-tourmaline-electric-panel copies Feldspar's .fg-feldspar-branch-
   panel property values (white ground, thin border, 12px radius, 3px
   accent top border) rather than reusing that class directly, since it is
   named/scoped to Feldspar; two quiet, distinct accent colors reuse the
   same warm/cool pair already approved for Feldspar's own two branches.
   The prior shallow comparison cards and oversized development-
   placeholder illustration well are both removed entirely — no
   replacement image, diagram, icon, or decorative graphic, per the brief.
   The historical note becomes a full-width "THE ASH PULLER" takeaway
   strip (shared .fg-tourmaline-takeaway component, also used by Color
   Zoning's "WHAT THIS SHOWS" note), read as the conclusion of the same
   composition rather than a separate card. The prior disclaimer sentence
   ("These are physical properties...") is removed per the brief. ── */
function fgTourmalineElectricFactHtml(fact){
  if(!fact) return '';
  return `<div class="fg-tourmaline-electric-fact">
    <div class="fg-tourmaline-electric-fact-label">${escapeAttr(fact.label||'')}</div>
    <p class="fg-tourmaline-electric-fact-value">${escapeAttr(fact.value||'')}</p>
  </div>`;
}
function fgTourmalineElectricPanelHtml(panel, modifier){
  if(!panel) return '';
  const facts = (panel.facts||[]).map(fgTourmalineElectricFactHtml).join('');
  return `<div class="fg-tourmaline-electric-panel fg-tourmaline-electric-panel--${escapeAttr(modifier)}">
    <div class="fg-branch-title">${escapeAttr(panel.title||'')}</div>
    ${panel.secondary?`<div class="fg-tourmaline-electric-secondary">${escapeAttr(panel.secondary)}</div>`:''}
    ${panel.body?`<p class="fg-prose">${escapeAttr(panel.body)}</p>`:''}
    ${facts?`<div class="fg-tourmaline-electric-facts">${facts}</div>`:''}
  </div>`;
}
function familyGuideTourmalineElectricalHtml(guide){
  const e = guide.electrical;
  if(!e) return '';
  const panels = (e.panels||[]).map((p,i)=>fgTourmalineElectricPanelHtml(p, i===0?'a':'b')).join('');
  return `<section class="fg-section" id="fg-tourmaline-electrical">
    <h2 class="fg-h2">${escapeAttr(e.title||"Tourmaline's Electrical Quirk")}</h2>
    ${e.intro?`<p class="fg-lead">${escapeAttr(e.intro)}</p>`:''}
    <div class="fg-branch-grid">${panels}</div>
    ${e.takeaway?`<div class="fg-tourmaline-takeaway">
      ${e.takeawayLabel?`<div class="fg-tourmaline-takeaway-label">${escapeAttr(e.takeawayLabel)}</div>`:''}
      <p class="fg-tourmaline-takeaway-body">${escapeAttr(e.takeaway)}</p>
    </div>`:''}
  </section>`;
}

/* ── 9. How Tourmaline Appears in a Collection — five compact recognition
   cards (form name, one representative image, one "look for" statement),
   reusing fgPhotoCardHtml/.fg-photo-grid--3 (the existing readable 3-up
   shared grid, wrapping 3-then-2) — corrected from the original .fg-photo-
   grid--5 modifier, which packed five text-heavy cards into one unreadable
   row and has been removed from styles.css since nothing else used it. No
   Quick View on any card — each represents a general form, not one exact
   resolvable stone, per the visual plan's explicit guardrail. ── */
function familyGuideTourmalineCollectionFormsHtml(guide){
  const c = guide.collectionForms;
  if(!c) return '';
  const cards = (c.items||[]).map(it=>fgPhotoCardHtml(it, {folder:'family-guide-tourmaline'})).join('');
  return `<section class="fg-section" id="fg-tourmaline-collection-forms">
    <h2 class="fg-h2">${escapeAttr(c.title||'How Tourmaline Appears in a Collection')}</h2>
    ${c.intro?`<p class="fg-lead">${escapeAttr(c.intro)}</p>`:''}
    <div class="fg-photo-grid fg-photo-grid--3">${cards}</div>
  </section>`;
}

/* ── 10. Tourmaline in Your Collection — rebuilt (Claude Code Brief:
   Tourmaline Family Guide: Final Layout Corrections) to structurally and
   visually match the approved Feldspar "In Your Collection" implementation
   (familyGuideFeldsparCollectionHtml) exactly: equal three-column card
   grid (.fg-feldspar-collection-grid — equal thirds, no permanently wider
   "Care for It" panel), uniform .fg-collection-sub card treatment for all
   three cards (same fill/border/radius/padding on every card, no white-
   vs-stone2 split), and .fg-collection-panel-title/.fg-fact-body card
   typography. Replaces the prior familyGuideCollectionHtml call, whose
   shared .fg-collection-grid gives Care for It a wider 1.55fr column and a
   different (white) background than the other two — exactly the
   inconsistency this correction removes. Card content (titles Care for
   It/Remember This/Watch For, and their approved copy) is unchanged —
   only guide.collection's shape moved from {careForIt,rememberThis,
   watchFor} to Feldspar's {cards:[{title,paragraphs}]} array. ── */
function familyGuideTourmalineCollectionHtml(guide){
  const c = guide.collection;
  if(!c) return '';
  const cards = (c.cards||[]).map(card=>`<div class="fg-collection-sub">
    <div class="fg-collection-panel-title">${escapeAttr(card.title||'')}</div>
    ${(card.paragraphs||[]).map(p=>`<p class="fg-fact-body">${escapeAttr(p)}</p>`).join('')}
  </div>`).join('');
  return `<section class="fg-section" id="fg-collection">
    <h2 class="fg-h2">${escapeAttr(c.title||'Tourmaline in Your Collection')}</h2>
    ${c.intro?`<p class="fg-prose">${escapeAttr(c.intro)}</p>`:''}
    <div class="fg-feldspar-collection-grid">${cards}</div>
  </section>`;
}

/* ── Tourmaline guide assembly — approved public section order per this
   brief's page structure. 10. Tourmaline in Your Collection (see above).
   11. Return to Crystal Families reuses the shared familyGuideClosingHtml
   for its centered italic reflective line (guide.closingCallout) and
   Return pill — matching the same established family-guide closing
   treatment (no enclosing box) already used by Garnet/Fluorite/Feldspar.
   Photo credits route through the shared footer-anchored pattern (see
   fgSetFooterCreditsLink's anchoredSlugs) matching Copper/Calcite/Garnet —
   no in-page familyGuideImageCreditsHtml call, so credits are not
   duplicated. ── */
function familyGuideTourmalineHtml(guide){
  return `
  <div class="fg-guide" data-family-slug="${escapeAttr(guide.slug)}">
    ${familyGuideHeroHtml(guide)}
    ${familyGuideWhatTourmalineIsHtml(guide)}
    ${familyGuideMeetTourmalineFamilyHtml(guide)}
    ${familyGuideTourmalineNamingHtml(guide)}
    ${familyGuideTourmalineColorHtml(guide)}
    ${familyGuideTourmalineZoningHtml(guide)}
    ${familyGuideTourmalineRibbingHtml(guide)}
    ${familyGuideTourmalineElectricalHtml(guide)}
    ${familyGuideTourmalineCollectionFormsHtml(guide)}
    ${familyGuideTourmalineCollectionHtml(guide)}
    ${familyGuideClosingHtml(guide)}
  </div>`;
}

/* ══════════════════════════════════════════════════════════════════════
   BERYL FAMILY GUIDE (2026-08-19, Claude Code Brief: Beryl Family Guide
   Implementation). Reuses the shared system throughout: familyGuideHeroHtml
   (with the new hero.imageLegend addition, see above) for the hero,
   fgTourmalineFamilyCardHtml/.fg-card-grid--garnet-roster (unchanged, same
   card anatomy already reused by Tourmaline/Obsidian) for the five-card
   catalog roster, .fg-explain-grid/.fg-explain-copy/.fg-explain-media
   (already used by Copper's closing essay) for Built in Six Sides,
   fgFormationTableHtml/.fg-table (already used by Tourmaline's naming
   table) for the color table, and the shared familyGuideCollectionHtml
   Care for It/Remember This/Watch For layout (already used by Calcite,
   with this pass's array-paragraph addition) for the collection section.
   Only two genuinely new pieces exist: familyGuideBerylNamingHtml's
   four-card teaching grid (reuses .fg-namegrid/.fg-namecard, styled to a
   2x2 layout via a guide-scoped styles.css rule since no existing guide
   needed exactly four undecorated text cards) and familyGuideBerylSixSidesHtml
   itself (thin wiring around the shared explain-grid). Nothing here touches
   a Calcite/Quartz/Fluorite/Feldspar/Chalcedony/Agate/Jasper/Garnet/
   Tourmaline/Obsidian/Copper selector, function, or data field. ══ */

/* ── 1. What Beryl Is — two plain left-aligned paragraphs, no emphasis
   line, no image, matching the brief's explicit "do not italicize the
   opening and do not add another introduction." Reuses the same
   .fg-prose-block/.fg-prose pattern as familyGuideWhatTourmalineIsHtml. ── */
function familyGuideWhatBerylIsHtml(guide){
  const w = guide.whatBerylIs;
  if(!w) return '';
  const paras = (w.paragraphs||[]).map(p=>`<p class="fg-prose">${escapeAttr(p)}</p>`).join('');
  return `<section class="fg-section" id="fg-what-beryl-is">
    <h2 class="fg-h2">${escapeAttr(w.title||'What Beryl Is')}</h2>
    <div class="fg-prose-block">${paras}</div>
  </section>`;
}

/* ── 2. Meet Five Beryl Expressions — the five verified catalog stones
   (Emerald, Aquamarine, Morganite, Heliodor, Goshenite), reusing
   fgTourmalineFamilyCardHtml/.fg-card-grid--garnet-roster exactly as
   Obsidian's roster does. Every member here carries a stoneId, so every
   card renders clickable with a working Quick View — there is no
   unlinked/teaching-card branch in this section (Red Beryl, the family's
   one non-catalog example, appears only in familyGuideBerylNamingHtml
   below, never here). No mem.image is set — each card resolves its photo
   through fgCrystal(stoneId) + firstEncyclopediaPhoto exactly like the
   catalog's own first/only entry for that stone (emerald.webp,
   aquamarine.webp, morganite-tumble-family.webp, heliodor-wc.webp,
   goshenite.webp — verified against ENCYCLOPEDIA_PHOTOS in app.js), so
   there is no separate hardcoded image path to drift out of sync. ── */
function familyGuideMeetBerylFamilyHtml(guide){
  const m = guide.meetBerylFamily;
  if(!m) return '';
  const cards = (m.members||[]).map(fgTourmalineFamilyCardHtml).filter(Boolean).join('');
  return `<section class="fg-section" id="fg-meet-beryl-family">
    <h2 class="fg-h2">${escapeAttr(m.title||'Meet Five Beryl Expressions')}</h2>
    ${m.intro?`<p class="fg-lead">${escapeAttr(m.intro)}</p>`:''}
    <div class="fg-card-grid fg-card-grid--garnet-roster">${cards}</div>
  </section>`;
}

/* ── 3. Built in Six Sides — proportional text-and-image split reusing the
   existing .fg-explain-grid/.fg-explain-copy/.fg-explain-media component
   (already used by Copper's closing essay), not a new layout. The image
   well is forced to a bounded white well via the guide-scoped styles.css
   override (matching Copper's own .fg-explain-media white-background
   override) since the base component defaults to the warm --stone2 tone.
   No visible caption renders beneath this image — its photo credit is
   guide.imageCredits-only, routed through the shared footer pattern. ── */
function familyGuideBerylSixSidesHtml(guide){
  const s = guide.builtInSixSides;
  if(!s) return '';
  const paras = (s.paragraphs||[]).map(p=>`<p class="fg-prose">${escapeAttr(p)}</p>`).join('');
  const mediaHtml = s.image
    ? `<img src="${escapeAttr(s.image)}" alt="${escapeAttr(s.imageAlt||'')}" loading="lazy">`
    : `<div class="fg-stonecard-noimg fg-stonecard-noimg--labeled"><span>Photo pending</span></div>`;
  return `<section class="fg-section" id="fg-beryl-six-sides">
    <h2 class="fg-h2">${escapeAttr(s.title||'Built in Six Sides')}</h2>
    <div class="fg-explain-grid">
      <div class="fg-explain-copy">${paras}</div>
      <div class="fg-explain-media">${mediaHtml}</div>
    </div>
  </section>`;
}

/* ── 4. How Beryl Gets Its Color — the exact five-variety/color/cause
   mapping as a comparison table, reusing fgFormationTableHtml/.fg-table
   verbatim (already approved for Tourmaline's Schorl/Dravite/Elbaite
   table and Copper's/Agate's own comparison tables), plus two ordinary
   prose paragraphs after the table. No diagrams, no duplicate photos. ── */
function familyGuideBerylColorHtml(guide){
  const c = guide.berylColor;
  if(!c) return '';
  const paras = (c.paragraphs||[]).map(p=>`<p class="fg-prose">${escapeAttr(p)}</p>`).join('');
  return `<section class="fg-section" id="fg-beryl-color">
    <h2 class="fg-h2">${escapeAttr(c.title||"How Beryl Gets Its Color")}</h2>
    ${c.intro?`<p class="fg-lead">${escapeAttr(c.intro)}</p>`:''}
    ${fgFormationTableHtml(c.table)}
    <div class="fg-prose-block">${paras}</div>
  </section>`;
}

/* ── 5. Understanding Beryl Names — four compact teaching cards (Emerald/
   Green Beryl, Heliodor/Golden Beryl, Goshenite, Red Beryl), reusing the
   existing .fg-namegrid/.fg-namecard components (already established by
   Quartz's four-card "Why Quartz Names Change" naming decoder) but with no
   image well, no ex.label category eyebrow, and no numbered index circle —
   just a Georgia label and one or two plain body paragraphs — per the
   brief's explicit "do not add images... repeated uppercase eyebrows."
   Red Beryl's card is text-only teaching copy like the other three: no
   stoneId is ever read here, so it can never render a Quick View, catalog
   link, or badge. The guide-scoped styles.css rule below switches the
   shared 5-column .fg-namegrid to a balanced 2x2 layout for these four
   cards only. ── */
function fgBerylNameCardHtml(card){
  if(!card) return '';
  const body = card.body || '';
  const splitAt = body.indexOf('. ');
  const bodyHtml = splitAt !== -1
    ? `<p class="fg-namecard-body">${escapeAttr(body.slice(0, splitAt+1))}</p><p class="fg-namecard-body">${escapeAttr(body.slice(splitAt+2))}</p>`
    : `<p class="fg-namecard-body">${escapeAttr(body)}</p>`;
  return `<div class="fg-namecard">
    <div class="fg-namecard-label">${escapeAttr(card.label||'')}</div>
    ${bodyHtml}
  </div>`;
}
function familyGuideBerylNamingHtml(guide){
  const n = guide.berylNaming;
  if(!n) return '';
  const cards = (n.cards||[]).map(fgBerylNameCardHtml).join('');
  return `<section class="fg-section" id="fg-beryl-naming">
    <h2 class="fg-h2">${escapeAttr(n.title||'Understanding Beryl Names')}</h2>
    ${n.intro?`<p class="fg-lead">${escapeAttr(n.intro)}</p>`:''}
    <div class="fg-namegrid">${cards}</div>
  </section>`;
}

/* ── Beryl guide assembly — approved section order per the brief: Hero,
   What Beryl Is, Meet Five Beryl Expressions, Built in Six Sides, How
   Beryl Gets Its Color, Understanding Beryl Names, Beryl in Your
   Collection (shared familyGuideCollectionHtml, same Care for It/Remember
   This/Watch For layout as Calcite), Closing (shared familyGuideClosingHtml,
   no enclosing box per the guide-scoped styles.css override below). Photo
   credits route through the shared footer-anchored pattern (see
   fgSetFooterCreditsLink's anchoredSlugs) — no in-page
   familyGuideImageCreditsHtml call, so credits are not duplicated. ── */
function familyGuideBerylHtml(guide){
  return `
  <div class="fg-guide" data-family-slug="${escapeAttr(guide.slug)}">
    ${familyGuideHeroHtml(guide)}
    ${familyGuideWhatBerylIsHtml(guide)}
    ${familyGuideMeetBerylFamilyHtml(guide)}
    ${familyGuideBerylSixSidesHtml(guide)}
    ${familyGuideBerylColorHtml(guide)}
    ${familyGuideBerylNamingHtml(guide)}
    ${familyGuideCollectionHtml(guide)}
    ${familyGuideClosingHtml(guide)}
  </div>`;
}

/* ══════════════════════════════════════════════════════════════════════
   OBSIDIAN FAMILY GUIDE — visual-correction pass (2026-08-20). Christie's
   approved reference for section-heading/body-copy scale, content width,
   left-aligned editorial flow, and spacing is the completed Tourmaline
   guide (Feldspar is cited only as the model for the final collection-
   card-row/closing pattern, not as a general template). Purely additive/
   Obsidian-scoped: nothing here touches a Calcite/Quartz/Fluorite/
   Feldspar/Chalcedony/Agate/Jasper/Garnet/Tourmaline/Copper selector,
   function, or data field — this guide now has its own dedicated
   collection-section function (familyGuideObsidianCollectionHtml) instead
   of calling the Feldspar-named one, even though it reuses the same
   generic .fg-feldspar-collection-grid/.fg-collection-sub classes every
   other guide's collection section already shares. ══ */

/* ── 1. Meet the Obsidian Family — unchanged this pass: six rostered
   expressions in the brief's exact desktop order (Black, Gold Sheen,
   Silver Sheen / Rainbow, Snowflake, Mahogany), reusing
   fgTourmalineFamilyCardHtml's description + "Chosen for:" card anatomy
   and the shared .fg-card-grid--garnet-roster flex-wrap grid (3+3 desktop,
   2-up intermediate, 1-up mobile, source order preserved). ── */
function familyGuideMeetObsidianFamilyHtml(guide){
  const m = guide.meetObsidianFamily;
  if(!m) return '';
  const cards = (m.members||[]).map(fgTourmalineFamilyCardHtml).filter(Boolean).join('');
  return `<section class="fg-section" id="fg-meet-obsidian-family">
    <h2 class="fg-h2">${escapeAttr(m.title||'Meet the Obsidian Family')}</h2>
    ${m.intro?`<p class="fg-lead">${escapeAttr(m.intro)}</p>`:''}
    <div class="fg-card-grid fg-card-grid--garnet-roster">${cards}</div>
  </section>`;
}

/* ── 2. How Lava Becomes Obsidian — replaces "Obsidian Is Glass, Not
   Crystal" entirely: one left-aligned .fg-lead opening paragraph (no
   comparison cards, no "lesser version" language, nothing implying a
   crystal turns into Obsidian), a plain three-step Molten Lava -> Quick
   Cooling -> Obsidian Glass process (.fg-obsidian-process — text-only
   boxes joined by a plain chevron, deliberately not the numbered-circle
   .fg-progression-number sequence used elsewhere on this page, since this
   must read as one continuous transformation rather than a measured
   sequence with stops), and a left-aligned closing sentence in
   .fg-prose-emphasis (the shared Georgia-italic editorial-emphasis
   treatment already established for Tourmaline's "What Tourmaline
   Actually Is" — left-aligned and body-scale here, not an oversized
   centered quotation). ── */
function familyGuideHowLavaBecomesObsidianHtml(guide){
  const g = guide.howLavaBecomesObsidian;
  if(!g) return '';
  const steps = (g.steps||[]).map((st,i,arr)=>`<div class="fg-obsidian-process-step">
    <div class="fg-obsidian-process-step-title">${escapeAttr(st.title||'')}</div>
  </div>${i<arr.length-1?'<div class="fg-obsidian-process-arrow" aria-hidden="true">→</div>':''}`).join('');
  return `<section class="fg-section" id="fg-how-lava-becomes-obsidian">
    <h2 class="fg-h2">${escapeAttr(g.title||'How Lava Becomes Obsidian')}</h2>
    ${g.intro?`<p class="fg-lead">${escapeAttr(g.intro)}</p>`:''}
    <div class="fg-obsidian-process">${steps}</div>
    ${g.closing?`<p class="fg-prose-emphasis fg-obsidian-process-closing">${escapeAttr(g.closing)}</p>`:''}
  </section>`;
}

/* ── 3. What the Lava Preserves — one .fg-lead intro paragraph, then a
   proper two-column table (fgFormationTableHtml/.fg-table, the exact
   shared component already approved for Tourmaline's Schorl/Dravite/
   Elbaite naming table — rounded container, shaded header row, row
   dividers, no separate arrow column), replacing the prior arrow-row
   decoder entirely. ── */
function familyGuideLavaPreservesHtml(guide){
  const l = guide.lavaPreserves;
  if(!l) return '';
  return `<section class="fg-section" id="fg-lava-preserves">
    <h2 class="fg-h2">${escapeAttr(l.title||'What the Lava Preserves')}</h2>
    ${l.intro?`<p class="fg-lead">${escapeAttr(l.intro)}</p>`:''}
    ${fgFormationTableHtml(l.table)}
  </section>`;
}

/* ── 4. Color in the Glass, Color in the Light — one .fg-lead intro
   paragraph, two broad Tourmaline-style photo cards (fgPhotoCardHtml via
   its item.url branch, each stone's own already-approved encyclopedia
   photo, white contain-fit wells scoped in styles.css to match
   Tourmaline's Color Zoning/Ribbing treatment), and the "Names to Verify"
   subsection: two paragraphs left, the existing yellow-obsidian-family.webp
   photograph right (small, ~235px, no caption/credit/label of any kind),
   photo second in DOM so it stacks below the text on mobile. Yellow
   Obsidian has no stoneId/catalog entry by design and is rendered here by
   filename only from the local assets/family-guide-obsidian/ folder — it
   can never be mistaken for a linked encyclopedia entry. ── */
function familyGuideColorInGlassHtml(guide){
  const c = guide.colorInGlass;
  if(!c) return '';
  const cards = (c.cards||[]).map(card=>fgPhotoCardHtml(card)).join('');
  const n = c.namesToVerify || {};
  const nParas = (n.paragraphs||[]).map(p=>`<p class="fg-prose">${escapeAttr(p)}</p>`).join('');
  const photo = n.photo;
  const photoHtml = photo ? `<div class="fg-obsidian-verify-media">
    <img src="${escapeAttr('assets/family-guide-obsidian/'+photo.image)}" alt="${escapeAttr(photo.alt||'')}" loading="lazy">
  </div>` : '';
  return `<section class="fg-section" id="fg-color-in-glass">
    <h2 class="fg-h2">${escapeAttr(c.title||'Color in the Glass, Color in the Light')}</h2>
    ${c.intro?`<p class="fg-lead">${escapeAttr(c.intro)}</p>`:''}
    <div class="fg-photo-grid fg-photo-grid--2">${cards}</div>
    <div class="fg-obsidian-verify">
      <h2 class="fg-h2">${escapeAttr(n.title||'Names to Verify')}</h2>
      <div class="fg-obsidian-verify-split">
        <div class="fg-obsidian-verify-text">${nParas}</div>
        ${photoHtml}
      </div>
    </div>
  </section>`;
}

/* ── 5. Obsidian in Your Collection — its own dedicated function (not a
   call into familyGuideFeldsparCollectionHtml), keeping the exact approved
   three-card content/order (Choose the Strength / Turn the Stone / Protect
   the Polish) and reusing the same generic .fg-feldspar-collection-grid/
   .fg-collection-sub/.fg-collection-panel-title/.fg-fact-body classes
   Tourmaline's own collection section already shares — those are existing
   shared family-guide classes, not Feldspar-exclusive markup, so this
   satisfies "give Obsidian its own renderer using shared generic classes
   where appropriate" without a second copy of new CSS. ── */
function familyGuideObsidianCollectionHtml(guide){
  const c = guide.collection;
  if(!c) return '';
  const cards = (c.cards||[]).map(card=>`<div class="fg-collection-sub">
    <div class="fg-collection-panel-title">${escapeAttr(card.title||'')}</div>
    ${(card.paragraphs||[]).map(p=>`<p class="fg-fact-body">${escapeAttr(p)}</p>`).join('')}
  </div>`).join('');
  return `<section class="fg-section" id="fg-collection">
    <h2 class="fg-h2">${escapeAttr(c.title||'Obsidian in Your Collection')}</h2>
    ${c.intro?`<p class="fg-lead">${escapeAttr(c.intro)}</p>`:''}
    <div class="fg-feldspar-collection-grid">${cards}</div>
  </section>`;
}

/* ── Obsidian guide assembly — Hero, Meet the Obsidian Family, How Lava
   Becomes Obsidian, What the Lava Preserves, Color in the Glass Color in
   the Light (incl. Names to Verify), Obsidian in Your Collection, then the
   shared unboxed closing (guide.closingCallout + Return to Crystal
   Families pill, centered — the only intentionally centered elements on
   the page) and image credits (empty list — no in-page output). ── */
function familyGuideObsidianHtml(guide){
  return `
  <div class="fg-guide" data-family-slug="${escapeAttr(guide.slug)}">
    ${familyGuideHeroHtml(guide)}
    ${familyGuideMeetObsidianFamilyHtml(guide)}
    ${familyGuideHowLavaBecomesObsidianHtml(guide)}
    ${familyGuideLavaPreservesHtml(guide)}
    ${familyGuideColorInGlassHtml(guide)}
    ${familyGuideObsidianCollectionHtml(guide)}
    ${familyGuideClosingHtml(guide)}
    ${familyGuideImageCreditsHtml(guide)}
  </div>`;
}

/* ══════════════════════════════════════════════════════════════════════
   COPPER MINERALS FAMILY GUIDE — dedicated section renderers (2026-07-31
   first implementation pass, built from Christie's approved
   copper-minerals-family-guide.md and copper-minerals-visual-plan.md;
   2026-08-03 correction restored the original approved hero and folded the
   Native Copper feature into a single compact two-column lead-in with
   "One Deposit, Many Outcomes" — see familyGuideOneDepositHtml and
   familyGuideCopperHtml's assembly order below for the current sequence).
   Copper's page order (hero, combined Native Copper / One Deposit Many
   Outcomes introduction + formation table, Featured Copper Minerals, More
   Expressions of Copper, Blue/Green/Both color comparison, When Copper
   Minerals Grow Together, Copper Minerals in Your Collection, closing
   essay) has no overlap with any other guide's sections, and — per
   Christie's explicit direction — carries none of Calcite's metaphysical/
   energy-role framing, chakra content, or trade-material badges. It
   therefore gets its own assembly function and section renderers below
   rather than reusing familyGuideGenericHtml or any Calcite-derived path.
   Purely additive/Copper-scoped: nothing here touches a Calcite/Quartz/
   Fluorite/Feldspar/Chalcedony/Agate/Jasper/Garnet/Tourmaline/Obsidian
   selector, function, or data field. ══ */

/* ── 1. One Deposit, Many Outcomes — a compact two-column editorial lead-in
   (2026-08-03 recomposition) combining the Native Copper specimen (image +
   Quick View, left column) with the condensed formation explanation
   (heading + two paragraphs, right column), immediately followed by the
   formation table at the shared content width. Replaces the earlier
   separate "The Copper Behind the Color" feature and the longer
   free-standing prose block — there is exactly one introductory text area
   here, not three. fgFormationTableHtml renders a real <table> for desktop
   legibility and screen-reader semantics; the mobile stacked-card fallback
   is pure CSS (data-label attributes + a media query), so no separate
   mobile-only markup path is needed. ── */
function fgFormationTableHtml(table){
  if(!table || !table.rows || !table.rows.length) return '';
  const headers = table.headers||[];
  const thead = `<thead><tr>${headers.map(h=>`<th>${escapeAttr(h)}</th>`).join('')}</tr></thead>`;
  const tbody = `<tbody>${table.rows.map(row=>`<tr>${row.map((cell,i)=>`<td data-label="${escapeAttr(headers[i]||'')}">${escapeAttr(cell)}</td>`).join('')}</tr>`).join('')}</tbody>`;
  return `<div class="fg-table-wrap"><table class="fg-table">${thead}${tbody}</table></div>`;
}
function familyGuideOneDepositHtml(guide){
  const o = guide.oneDeposit;
  if(!o) return '';
  const paras = (o.paragraphs||[]).map(p=>`<p class="fg-prose">${escapeAttr(p)}</p>`).join('');
  const f = guide.copperFeature;
  let mediaHtml = '';
  if(f && f.stoneId){
    const c = fgCrystal(f.stoneId);
    if(c){
      const imgSrc = (typeof firstEncyclopediaPhoto==='function') ? firstEncyclopediaPhoto(c) : '';
      const imgHtml = imgSrc
        ? `<img src="${escapeAttr(imgSrc)}" alt="${escapeAttr(c.n)}" loading="lazy">`
        : `<div class="fg-stonecard-noimg fg-stonecard-noimg--labeled"><span>Photo pending</span></div>`;
      mediaHtml = `<div class="fg-copper-intro-media">
        <button type="button" class="fg-copper-intro-media-img" onclick="openDetail('${escapeAttr(c.i)}')" title="Open ${escapeAttr(c.n)} in Quick View">${imgHtml}</button>
        <div class="fg-mineralcard-header fg-copper-intro-namerow">
          <div class="fg-stonecard-name">${escapeAttr(c.n)}</div>
          <button type="button" class="fg-stonecard-qv" onclick="openDetail('${escapeAttr(c.i)}')">Quick View</button>
        </div>
      </div>`;
    }
  }
  return `<section class="fg-section" id="fg-one-deposit">
    <div class="fg-copper-intro-grid">
      ${mediaHtml}
      <div class="fg-copper-intro-copy">
        <h2 class="fg-h2">${escapeAttr(o.title||'One Deposit, Many Outcomes')}</h2>
        ${paras}
      </div>
    </div>
    ${fgFormationTableHtml(guide.formationTable)}
  </section>`;
}

/* ── 2. Meet the Copper Minerals — six primary cards carrying the full
   approved mineral copy (not a one-line phrase), since the brief calls for
   the actual article paragraphs on each card. fgStoneCardHtml's compact
   single-phrase design doesn't fit that, so this is a new, dedicated card
   type (fgMineralCardHtml) rather than a repurposing of any shared
   component used by another guide. Reuses the existing
   .fg-card-grid--garnet-roster flex layout (already established for
   Garnet's five-card and Obsidian's six-card rosters) since six 310px-wide
   cards naturally wrap 3-then-3 in it with no new grid CSS needed. The
   secondary Turquoise/Ajoite row uses a smaller, horizontal card
   (fgMineralCardSecondaryHtml) in a plain two-column grid. Plancheite is
   never given its own card — it only appears inside Shattuckite's
   paragraph copy, exactly as approved. ── */
function fgMineralCardHtml(member){
  // No-stoneId branch (2026-08-01, added for Plancheite, which moved from
  // a small compact secondary card into "Other Copper Minerals to Know" —
  // the same full mineral-card treatment as the six primary Copper cards.
  // Plancheite has no canonical roster entry or encyclopedia page, so it
  // renders from an approved image URL (member.url) instead of
  // firstEncyclopediaPhoto(), with no Quick View button and no
  // openDetail() call — same "don't invent a roster link" principle
  // fgExpressionCardHtml already applies for Fluorite's non-roster
  // expressions. Every other caller (all six primary Copper cards,
  // Turquoise, Ajoite) still carries a stoneId, so their markup and Quick
  // View behavior below are completely unchanged.
  if(!member.stoneId){
    const name = member.name||'';
    if(!name) return '';
    const imgHtml = member.url
      ? `<img src="${escapeAttr(member.url)}" alt="${escapeAttr(member.alt||name)}" loading="lazy">`
      : `<div class="fg-stonecard-noimg fg-stonecard-noimg--labeled"><span>Photo pending</span></div>`;
    const paras = (member.paragraphs||[]).map(p=>`<p class="fg-mineralcard-text">${escapeAttr(p)}</p>`).join('');
    // 2026-08-02: name-only header row (no Quick View button here since
    // Plancheite has no roster entry) — kept as its own row/class so the
    // stoneId branch below (which does add a Quick View button into this
    // same row) shares identical header markup/spacing.
    return `<div class="fg-mineralcard fg-mineralcard--unlinked">
      <div class="fg-mineralcard-media" title="${escapeAttr(name)} — no standalone encyclopedia entry">${imgHtml}</div>
      <div class="fg-mineralcard-body">
        <div class="fg-mineralcard-header">
          <div class="fg-stonecard-name">${escapeAttr(name)}</div>
        </div>
        ${paras}
      </div>
    </div>`;
  }
  const c = fgCrystal(member.stoneId);
  if(!c) return '';
  const imgSrc = (typeof firstEncyclopediaPhoto==='function') ? firstEncyclopediaPhoto(c) : '';
  const imgHtml = imgSrc
    ? `<img src="${escapeAttr(imgSrc)}" alt="${escapeAttr(c.n)}" loading="lazy">`
    : `<div class="fg-stonecard-noimg fg-stonecard-noimg--labeled"><span>Photo pending</span></div>`;
  const paras = (member.paragraphs||[]).map(p=>`<p class="fg-mineralcard-text">${escapeAttr(p)}</p>`).join('');
  // 2026-08-02: name and Quick View share one header row (name left,
  // Quick View right) instead of Quick View sitting in its own row below
  // the paragraphs — matches the restrained utility-link treatment
  // restored for Copper (see fg-stonecard-qv's reverted font-size).
  return `<div class="fg-mineralcard">
    <button type="button" class="fg-mineralcard-media" onclick="openDetail('${escapeAttr(c.i)}')" title="Open ${escapeAttr(c.n)} in Quick View">${imgHtml}</button>
    <div class="fg-mineralcard-body">
      <div class="fg-mineralcard-header">
        <div class="fg-stonecard-name">${escapeAttr(c.n)}</div>
        <button type="button" class="fg-stonecard-qv" onclick="openDetail('${escapeAttr(c.i)}')">Quick View</button>
      </div>
      ${paras}
    </div>
  </div>`;
}
function familyGuideMeetCopperFamilyHtml(guide){
  const m = guide.meetCopperFamily;
  if(!m) return '';
  const cards = (m.members||[]).map(fgMineralCardHtml).filter(Boolean).join('');
  // m.intro (2026-08-06) — same fg-prose pattern already used by
  // otherCopperMinerals.intro below: left-aligned, full guide width, no
  // narrower wrapper. `.fg-h2 + *` (styles.css) gives it the same
  // moderate heading gap every other Copper section intro already has;
  // .fg-prose's own bottom margin gives the same gap before the card grid.
  return `<section class="fg-section" id="fg-meet-copper-family">
    <h2 class="fg-h2">${escapeAttr(m.title||'Featured Copper Minerals')}</h2>
    ${m.intro?`<p class="fg-prose">${escapeAttr(m.intro)}</p>`:''}
    <div class="fg-card-grid fg-card-grid--garnet-roster">${cards}</div>
  </section>`;
}

/* ── 2b. Other Copper Minerals to Know — Turquoise, Ajoite, and Plancheite,
   restyled (2026-08-01) as a continuation of the primary mineral gallery
   rather than the old compact horizontal secondary cards: same
   fgMineralCardHtml component and .fg-card-grid--garnet-roster grid as the
   six primary cards above, just its own heading/intro and section. Ends
   with the "Explore All Copper Minerals" secondary action, which reuses
   the exact existing prefiltered-encyclopedia handler
   (jumpToFamily -> jumpToFilteredEncyclopedia('fam', family)) that the
   Crystal Families tile itself used before it was wired to
   openFamilyGuide() — preserved here rather than rebuilt, per the
   brief's explicit "don't reconstruct or guess the filter parameters". ── */
function familyGuideOtherCopperMineralsHtml(guide){
  const o = guide.otherCopperMinerals;
  if(!o) return '';
  const cards = (o.members||[]).map(fgMineralCardHtml).filter(Boolean).join('');
  // 2026-08-06: moved off the shared .btn/.btn-sm classes onto the new
  // unified Copper pill system (fg-copper-pill, see styles.css) — .btn was
  // getting bumped to 16px by the Copper-scoped ".fg-guide .btn" rule
  // while keeping .btn-sm's small padding, which read as oversized/
  // mismatched. jumpToFamily(...) onclick and exploreAllFamily/-Label data
  // are completely unchanged, so filtering/navigation behavior is intact.
  const exploreBtn = (o.exploreAllFamily && typeof jumpToFamily==='function')
    ? `<div class="fg-copper-explore-all"><button type="button" class="fg-copper-pill fg-copper-pill--explore" onclick="jumpToFamily('${escapeAttr(o.exploreAllFamily)}')">${escapeAttr(o.exploreAllLabel||'Explore All Copper Minerals')}</button></div>`
    : '';
  return `<section class="fg-section" id="fg-other-copper-minerals">
    <h2 class="fg-h2">${escapeAttr(o.title||'More Expressions of Copper')}</h2>
    ${o.intro?`<p class="fg-prose">${escapeAttr(o.intro)}</p>`:''}
    <div class="fg-card-grid fg-card-grid--garnet-roster">${cards}</div>
    ${exploreBtn}
  </section>`;
}

/* ── 3. Blue, Green, or Both? — the approved explanatory paragraphs, a
   three-column grouping of small clickable thumbnails (never the full
   mineral cards from Section 2, per the visual plan), and the single
   approved sentence rendered as the page's only pull-quote (reuses the
   existing .fg-lead--question italic-Georgia treatment already used
   elsewhere as a one-off flourish, rather than inventing a new emphasis
   style). ── */
function fgColorGroupThumbHtml(stoneId){
  const c = fgCrystal(stoneId);
  if(!c) return '';
  const imgSrc = (typeof firstEncyclopediaPhoto==='function') ? firstEncyclopediaPhoto(c) : '';
  const imgHtml = imgSrc
    ? `<img src="${escapeAttr(imgSrc)}" alt="${escapeAttr(c.n)}" loading="lazy">`
    : '';
  return `<div class="fg-colorgroup-thumb">
    <button type="button" onclick="openDetail('${escapeAttr(c.i)}')" title="Open ${escapeAttr(c.n)} in Quick View">${imgHtml}</button>
    <div class="fg-colorgroup-thumb-name">${escapeAttr(c.n)}</div>
  </div>`;
}
function familyGuideColorComparisonHtml(guide){
  const cc = guide.colorComparison;
  if(!cc) return '';
  const paras = (cc.paragraphs||[]).map(p=>`<p class="fg-prose">${escapeAttr(p)}</p>`).join('');
  // 2026-08-01 redesign: each group is a bordered card (equal outer height
  // via the parent grid's default stretch) instead of a bare label +
  // scattered thumbnail row. 2026-08-02 correction: the three cards keep
  // one consistent thumbnail size — the third group (three specimens
  // instead of two) gets a wider *column* via .fg-colorgroups'
  // grid-template-columns instead of shrinking its thumbnails, so all
  // three groups stay visually consistent while still fitting three
  // thumbnails on one row.
  const groups = (cc.groups||[]).map(g=>`<div class="fg-colorgroup">
    <div class="fg-colorgroup-title">${escapeAttr(g.label||'')}</div>
    <div class="fg-colorgroup-thumbs">${(g.stoneIds||[]).map(fgColorGroupThumbHtml).filter(Boolean).join('')}</div>
  </div>`).join('');
  return `<section class="fg-section" id="fg-color-comparison">
    <h2 class="fg-h2">${escapeAttr(cc.title||'Blue, Green, or Both?')}</h2>
    <div class="fg-prose-block">${paras}</div>
    <div class="fg-colorgroups">${groups}</div>
    ${cc.pullQuote?`<p class="fg-copper-pullquote">${escapeAttr(cc.pullQuote)}</p>`:''}
  </section>`;
}

/* ── 4. When Copper Minerals Grow Together — four features in a two-column
   desktop / one-column mobile grid (reuses the existing .fg-card-grid--2
   modifier, already established for Obsidian's two-item comparison).
   Reuses fgPhotoCardHtml exactly as Fluorite's Cube/Octahedron/Cleavage
   and Obsidian's comparison cards do: item.singleStoneId pulls an
   existing, already-approved encyclopedia photo (Azurmalachite);
   item.placeholderLabel renders a clean, clearly labeled "Photo pending"
   card — never an invented or substituted image — for Chrysocolla in
   Quartz/Gem Silica, Sonora Sunrise, and Quantum Quattro, none of which
   has an approved dedicated photograph on file. Quantum Quattro
   deliberately stays inside this shared grid rather than getting a
   standalone card, hero treatment, or badge, per the brief. ── */
function familyGuideGrowTogetherHtml(guide){
  const g = guide.growTogether;
  if(!g) return '';
  const cards = (g.features||[]).map(f=>fgPhotoCardHtml(f)).join('');
  return `<section class="fg-section" id="fg-grow-together">
    <h2 class="fg-h2">${escapeAttr(g.title||'When Copper Minerals Grow Together')}</h2>
    ${g.intro?`<p class="fg-prose">${escapeAttr(g.intro)}</p>`:''}
    <div class="fg-photo-grid fg-photo-grid--4">${cards}</div>
    ${g.closingNote?`<p class="fg-copper-note">${escapeAttr(g.closingNote)}</p>`:''}
  </section>`;
}

/* ── 5. Copper Minerals in Your Collection — two calm, equal panels
   (Handle Gently / Avoid Dust, Drinking Water, and Elixirs), reusing the
   existing .fg-collection-sub neutral panel styling but in a plain
   two-column grid rather than the three-part care/remember/watch-for
   layout familyGuideCollectionHtml renders for other guides — that
   component's schema doesn't fit Copper's simpler two-panel brief, so this
   is a small dedicated renderer instead of forcing Copper's data into it.
   No red/yellow warning styling, no hazard icons, per the brief. ── */
function familyGuideCopperCareHtml(guide){
  const c = guide.copperCare;
  if(!c) return '';
  const panels = (c.panels||[]).map(p=>`<div class="fg-collection-sub">
    <div class="fg-collection-panel-title">${escapeAttr(p.title||'')}</div>
    <p class="fg-fact-body">${escapeAttr(p.body||'')}</p>
  </div>`).join('');
  return `<section class="fg-section" id="fg-copper-care">
    <h2 class="fg-h2">${escapeAttr(c.title||'Copper Minerals in Your Collection')}</h2>
    ${c.intro?`<p class="fg-prose">${escapeAttr(c.intro)}</p>`:''}
    <div class="fg-copper-care-grid">${panels}</div>
  </section>`;
}

/* ── 6. Closing essay — "A Family Written in Color." Unlike every other
   guide's one-line closingCallout (rendered by the shared
   familyGuideClosingHtml), Copper's brief calls for the full two-paragraph
   closing essay paired with one detailed image, kept visually quiet.
   Reuses the existing .fg-explain-grid image+prose split (already used
   elsewhere for a photo-beside-text layout) rather than inventing a new
   one. The essay's own finalLine already carries the guide's single
   italic closing statement, so Copper does NOT call the shared
   familyGuideClosingHtml afterward (2026-08-03 correction) — that would
   duplicate the line and add a large boxed callout the brief explicitly
   asked to remove. familyGuideCopperClosingPillHtml below replaces it with
   a quiet centered nav-only pill, scoped to Copper's own assembly; every
   other guide keeps calling familyGuideClosingHtml unchanged. ── */
function familyGuideCopperClosingEssayHtml(guide){
  const ce = guide.closingEssay;
  if(!ce) return '';
  const c = ce.singleStoneId ? fgCrystal(ce.singleStoneId) : null;
  const imgSrc = c ? ((typeof firstEncyclopediaPhoto==='function') ? firstEncyclopediaPhoto(c) : '') : '';
  const mediaHtml = imgSrc
    ? `<img src="${escapeAttr(imgSrc)}" alt="${escapeAttr(ce.alt||(c&&c.n)||'')}" loading="lazy">`
    : `<div class="fg-stonecard-noimg fg-stonecard-noimg--labeled"><span>Photo pending</span></div>`;
  const paras = (ce.paragraphs||[]).map(p=>`<p class="fg-prose">${escapeAttr(p)}</p>`).join('');
  // ce.finalLine (2026-08-01) — one restrained concluding line rendered
  // after the two closing paragraphs, left-aligned and slightly
  // emphasized (not a centered pull-quote, not a banner, no extra image).
  const finalLineHtml = ce.finalLine ? `<p class="fg-copper-closing-final">${escapeAttr(ce.finalLine)}</p>` : '';
  return `<section class="fg-section" id="fg-copper-closing-essay">
    <h2 class="fg-h2">${escapeAttr(ce.title||'A Family Written in Color')}</h2>
    <div class="fg-explain-grid">
      <div class="fg-explain-copy">${paras}${finalLineHtml}</div>
      <div class="fg-explain-media">${mediaHtml}</div>
    </div>
  </section>`;
}

/* ── Copper-only closing navigation pill (2026-08-03) — replaces the
   shared familyGuideClosingHtml's large boxed callout for Copper only.
   The closing essay's finalLine already carries the guide's one italic
   closing statement, so this is navigation only: a small, quiet, centered
   pill. 2026-08-06: moved off .fg-catalog-link (Garnet's pill, a
   different size/shape spec) onto the same unified fg-copper-pill system
   the Explore All pill now uses, so the two Copper nav pills visibly
   match — fg-copper-pill--return is the quieter, neutral-toned variant.
   Reuses guide.closingButton unchanged (same label/target Copper has used
   since ca78a4c) and the existing fgReturnToCrystalFamilies() navigation
   helper. ── */
function familyGuideCopperClosingPillHtml(guide){
  const cb = guide.closingButton;
  const btnLabel = (cb && cb.label) || 'Return to Crystal Families';
  const btnOnclick = (cb && cb.target==='crystalFamilies') ? 'fgReturnToCrystalFamilies()' : "switchTabByName('encyclopedia')";
  return `<div class="fg-copper-closing-pill-wrap">
    <button type="button" class="fg-copper-pill fg-copper-pill--return" onclick="${btnOnclick}">${escapeAttr(btnLabel)}</button>
  </div>`;
}

/* ── 2026-08-05: the in-page "Photo Credits" link (familyGuideCopperCreditsLinkHtml,
   added 2026-08-02) was removed — the footer's own Photo Credits link is
   now made page-specific for Copper instead (see the footer-credits-link
   handling in renderFamilyGuideView above), so the guide no longer needs
   its own separate link to the same destination. The full credit records
   still live in guide.imageCredits and still render in full on
   credits.html (pcLoadFamilyGuideSection() there reads that same array
   directly) — nothing about the credit data itself changed. Every other
   guide still calls familyGuideImageCreditsHtml() unchanged. ── */

/* ── Copper Minerals guide assembly — its own approved section order.
   Purely additive: nothing here changes any other guide's assembly, data,
   or rendered output. ── */
function familyGuideCopperHtml(guide){
  return `
  <div class="fg-guide" data-family-slug="${escapeAttr(guide.slug)}">
    ${familyGuideHeroHtml(guide)}
    ${familyGuideOneDepositHtml(guide)}
    ${familyGuideMeetCopperFamilyHtml(guide)}
    ${familyGuideOtherCopperMineralsHtml(guide)}
    ${familyGuideColorComparisonHtml(guide)}
    ${familyGuideGrowTogetherHtml(guide)}
    ${familyGuideCopperCareHtml(guide)}
    ${familyGuideCopperClosingEssayHtml(guide)}
    ${familyGuideCopperClosingPillHtml(guide)}
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
   overlap with Quartz's); every guide with no dedicated assembly below
   falls through to the generic assembly above. */
function familyGuideHtml(guide){
  if(guide.slug==='fluorite') return familyGuideFluoriteHtml(guide);
  if(guide.slug==='feldspar') return familyGuideFeldsparHtml(guide);
  if(guide.slug==='chalcedony') return familyGuideChalcedonyHtml(guide);
  if(guide.slug==='agate') return familyGuideAgateHtml(guide);
  if(guide.slug==='jasper') return familyGuideJasperHtml(guide);
  if(guide.slug==='garnet') return familyGuideGarnetHtml(guide);
  if(guide.slug==='tourmaline') return familyGuideTourmalineHtml(guide);
  if(guide.slug==='obsidian') return familyGuideObsidianHtml(guide);
  if(guide.slug==='copper') return familyGuideCopperHtml(guide);
  if(guide.slug==='quartz') return familyGuideQuartzHtml(guide);
  if(guide.slug==='beryl') return familyGuideBerylHtml(guide);
  if(guide.slug!=='calcite') return familyGuideGenericHtml(guide);
  // Note (2026-07-31, Calcite normalization pass): the in-page "Image
  // credits" <details> disclosure (familyGuideImageCreditsHtml) is
  // deliberately no longer rendered below — Photo Credits routing moved to
  // the shared footer link -> credits.html#calcite (see
  // fgSetFooterCreditsLink above), per Christie's approved pass. The
  // imageCredits records themselves are untouched in data/family-guides.json
  // and still power that central credits.html page.
  // Note (cleanup pass): uses familyGuideCalciteHeroHtml, not the shared
  // familyGuideHeroHtml — see that function's comment for why. The
  // unboxed geological paragraph (familyGuideCalciteBridgeHtml) now sits
  // between the hero and the varieties section, outside the hero box.
  return `
  <div class="fg-guide" data-family-slug="${escapeAttr(guide.slug)}">
    ${familyGuideCalciteHeroHtml(guide)}
    ${familyGuideCalciteBridgeHtml(guide)}
    ${familyGuideVarietiesHtml(guide)}
    ${familyGuideRecognitionHtml(guide)}
    ${familyGuideShapesHtml(guide)}
    ${familyGuideExtendedFamilyHtml(guide)}
    ${familyGuideCollectionHtml(guide)}
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
  if(document.getElementById('fam-cards') && typeof renderPrimaryFamilies==='function'){
    renderPrimaryFamilies();
  }
});
