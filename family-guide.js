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
// below (Copper, Calcite). Every other guide/tab keeps the default reset
// value untouched.
function fgSetFooterCreditsLink(slug){
  const link = document.getElementById('footerCreditsLink');
  if(!link) return;
  const anchoredSlugs = {copper:'credits.html#copper-minerals', calcite:'credits.html#calcite'};
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
  if(!imgs.length && guide.hero && guide.hero.image){
    imgs.push(`<img src="${escapeAttr(SUPABASE_ENC+guide.hero.image)}" alt="${escapeAttr(guide.displayName||guide.slug)}">`);
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
        ${hero.emphasisLine?`<p class="fg-hero-emphasis">${escapeAttr(hero.emphasisLine)}</p>`:''}
        ${hero.question?`<div class="fg-hero-prompt">
          ${hero.promptLeadIn?`<div class="fg-hero-prompt-lead">${escapeAttr(hero.promptLeadIn)}</div>`:''}
          <div class="fg-hero-question">${escapeAttr(hero.question)}</div>
          ${hero.supportingLine?`<div class="fg-hero-supporting">${escapeAttr(hero.supportingLine)}</div>`:''}
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
  return `<div class="fg-stonecard"${idAttr}>
    <button type="button" class="fg-stonecard-media" onclick="openDetail('${escapeAttr(c.i)}')" title="Open ${escapeAttr(c.n)} in Quick View">${imgHtml}</button>
    <div class="fg-stonecard-body">
      <div class="fg-stonecard-name">${escapeAttr(c.n)}</div>
      ${identityHtml}
      <div class="${phraseClass}">${escapeAttr(phraseText)}</div>
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
   fg-placeholder-note instead of the normal fg-fact-body styling. ── */
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
  // guide.closingSupportingCopy (2026-07-23, added for Garnet) — an optional
  // second line rendered between the closing callout and the Return button.
  // No other guide's data sets this field, so their closing panels are
  // completely unchanged by this addition.
  const supporting = guide.closingSupportingCopy || '';
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
  return `<section class="fg-closing" id="fg-closing">
    ${line?`<p class="fg-closing-line">${escapeAttr(line)}</p>`:''}
    ${supporting?`<p class="fg-closing-supporting">${escapeAttr(supporting)}</p>`:''}
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
   fgPhotoCardHtml's item.image branch (2026-07-24, folder:'family-guide-
   fluorite') now that the three licensed educational images (see
   guide.cubeOctahedronCleavage.items[].pendingAsset for filename/creator/
   license) are retained locally. ── */
function familyGuideCubeOctahedronHtml(guide){
  const s = guide.cubeOctahedronCleavage;
  if(!s) return '';
  const cards = (s.items||[]).map(item=>fgPhotoCardHtml(item, {folder:'family-guide-fluorite'})).join('');
  return `<section class="fg-section" id="fg-cube-octahedron">
    <h2 class="fg-h2">${escapeAttr(s.title||'Cube, Octahedron, or Cleavage Piece?')}</h2>
    <div class="fg-photo-grid fg-photo-grid--3">${cards}</div>
  </section>`;
}

/* ── Color Zoning, Banding & Phantoms — the visual-pattern vocabulary
   (core / edge bands / growth zones / layered bands / box phantoms) is
   rendered as neutral labeled chips, not as sentences, since no approved
   explanatory paragraph exists yet. guide.zoningPhantoms.image (2026-07-24,
   now retained locally under assets/family-guide-fluorite/ — see
   guide.zoningPhantoms.pendingAsset for filename/creator/license) renders in
   place of the labeled placeholder once set; falls back to the placeholder
   exactly as before when unset. ── */
function familyGuideZoningHtml(guide){
  const z = guide.zoningPhantoms;
  if(!z) return '';
  const patterns = (z.patterns||[]).map(p=>`<span class="fg-chip">${escapeAttr(p)}</span>`).join('');
  const visualHtml = z.image
    ? `<img src="${escapeAttr('assets/family-guide-fluorite/'+z.image)}" alt="${escapeAttr(z.imageAlt||'')}" loading="lazy">`
    : `<div class="fg-stonecard-noimg fg-stonecard-noimg--labeled"><span>Photo pending</span></div>`;
  return `<section class="fg-section" id="fg-zoning">
    <h2 class="fg-h2">${escapeAttr(z.title||'Color Zoning, Banding & Phantoms')}</h2>
    ${z.editorialNote?`<p class="fg-placeholder-banner">Editorial copy pending — layout shell for review only.</p>`:''}
    <div class="fg-single-visual">${visualHtml}</div>
    ${patterns?`<div class="fg-zoning-chips">${patterns}</div>`:''}
  </section>`;
}

/* ── Why Some Fluorite Glows — Christie's approved fluorescence paragraph,
   verbatim, plus guide.fluorescence.image (2026-07-24, now retained locally
   under assets/family-guide-fluorite/ — see guide.fluorescence.pendingAsset
   for filename/creator/license), which renders in place of the labeled
   placeholder once set; falls back to the placeholder exactly as before
   when unset. ── */
function familyGuideFluorescenceHtml(guide){
  const f = guide.fluorescence;
  if(!f) return '';
  const visualHtml = f.image
    ? `<img src="${escapeAttr('assets/family-guide-fluorite/'+f.image)}" alt="${escapeAttr(f.imageAlt||'')}" loading="lazy">`
    : `<div class="fg-stonecard-noimg fg-stonecard-noimg--labeled"><span>Photo pending</span></div>`;
  return `<section class="fg-section" id="fg-fluorescence">
    <h2 class="fg-h2">${escapeAttr(f.title||'Why Some Fluorite Glows')}</h2>
    <div class="fg-single-visual">${visualHtml}</div>
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
   FELDSPAR FAMILY GUIDE — controlled rebuild (2026-08-01) implementing
   feldspar-family-guide-final-copy-and-visual-plan.md verbatim (approved
   section order: Hero, Bridge, Meet Eight Feldspar Expressions, One
   Family/Two Great Branches, Sunstone Refuses to Pick a Side, Three Ways
   Feldspar Plays With Light, Moonstone decoder, Labradorite/Spectrolite/
   Larvikite, Collection, Closing). Replaces the prior 2026-07-23
   placeholder-shell pass below (Two Great Branches / When the Light Moves /
   Moonstone decoder / Labradorite-Spectrolite-Larvikite / Sunstone-and-the-
   Spark-Within) — this is a controlled page-specific rebuild, not an
   additional patch layer, so those five functions and the old single-card
   Sunstone section are replaced outright rather than kept alongside the
   new ones. Purely Feldspar-scoped: nothing here touches a Calcite,
   Quartz, Fluorite, Chalcedony, Agate, Jasper, Garnet, Tourmaline,
   Obsidian, or Copper selector, function, or data field. ══ */

/* ── 2. Bridge — two ordinary left-aligned paragraphs, no card, no tinted
   background, breathing room between hero and the expressions section
   below (see the .fg-guide[data-family-slug="feldspar"] #fg-bridge margin
   in styles.css). No heading, per the approved plan. ── */
function familyGuideFeldsparBridgeHtml(guide){
  const b = guide.bridge;
  if(!b || !(b.paragraphs||[]).length) return '';
  const paras = b.paragraphs.map(p=>`<p class="fg-prose">${escapeAttr(p)}</p>`).join('');
  return `<div class="fg-feldspar-bridge" id="fg-bridge">${paras}</div>`;
}

/* ── 3. Meet Eight Feldspar Expressions — reuses Copper's fgMineralCardHtml
   (image, name + Quick View header, body paragraph) rather than the
   compact one-line fgStoneCardHtml, since the approved copy is a real
   two-sentence paragraph per stone. Placed in the shared four-column
   .fg-card-grid--4 (not the flex-wrap garnet-roster grid) so it follows
   the approved plan's exact desktop/tablet/mobile card-count sequence
   (4 → 2 → 2/1), which .fg-card-grid--4's existing breakpoints already
   provide unchanged. ── */
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

/* ── 4. One Family, Two Great Branches — two equal panels, each carrying a
   slim colored accent rule (warm for Potassium, cool for Plagioclase — see
   .fg-feldspar-branch--potassium/--plagioclase in styles.css), the
   subtitle/body copy, familiar-names and mineral-names lines, and a
   compact row of associated stone thumbnails. No arrows, stems, or
   connector diagrams, per the approved plan. ── */
function fgFeldsparBranchThumbHtml(stoneId){
  const c = fgCrystal(stoneId);
  if(!c) return '';
  const imgSrc = (typeof firstEncyclopediaPhoto==='function') ? firstEncyclopediaPhoto(c) : '';
  const imgHtml = imgSrc ? `<img src="${escapeAttr(imgSrc)}" alt="${escapeAttr(c.n)}" loading="lazy">` : '';
  return `<button type="button" class="fg-feldspar-branch-thumb" onclick="openDetail('${escapeAttr(c.i)}')" title="Open ${escapeAttr(c.n)} in Quick View">${imgHtml}<span>${escapeAttr(c.n)}</span></button>`;
}
function fgFeldsparBranchPanelHtml(item){
  const thumbs = (item.thumbStoneIds||[]).map(fgFeldsparBranchThumbHtml).filter(Boolean).join('');
  return `<div class="fg-feldspar-branch-panel fg-feldspar-branch--${escapeAttr(item.accent||'')}">
    <div class="fg-branch-title">${escapeAttr(item.title||'')}</div>
    ${item.subtitle?`<p class="fg-feldspar-branch-subtitle">${escapeAttr(item.subtitle)}</p>`:''}
    ${item.body?`<p class="fg-prose">${escapeAttr(item.body)}</p>`:''}
    ${item.familiarNames?`<div class="fg-feldspar-branch-line"><span class="fg-feldspar-branch-line-label">${escapeAttr(item.familiarNamesLabel||'Familiar names')}</span>${escapeAttr(item.familiarNames)}</div>`:''}
    ${item.mineralNames?`<div class="fg-feldspar-branch-line"><span class="fg-feldspar-branch-line-label">${escapeAttr(item.mineralNamesLabel||'The mineral names underneath')}</span>${escapeAttr(item.mineralNames)}</div>`:''}
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
    ${b.supportingLine?`<p class="fg-prose fg-prose-emphasis">${escapeAttr(b.supportingLine)}</p>`:''}
  </section>`;
}

/* ── 5. Sunstone Refuses to Pick a Side — spans the combined width of both
   branches above, no connector line. Two small "May occur in" labels near
   the opening, then two equal teaching-image wells: the left is the
   already-approved Sunstone photo (large reflective plates); the right is
   an intentional, brief-mandated placeholder for Christie's still-pending
   fine-shimmer photo — same well container/radius/spacing as the left, a
   calm neutral field, and the exact copy "Fine-shimmer Sunstone photo
   coming soon" (never a broken-image icon or a substituted stock photo).
   Swapping in the real photo later only requires setting
   guide.sunstoneCompare.right.image — no layout change needed, since both
   wells already share the identical .fg-feldspar-sunstone-well markup. ── */
function familyGuideFeldsparSunstoneCompareHtml(guide){
  const s = guide.sunstoneCompare;
  if(!s) return '';
  const paras = (s.paragraphs||[]).map(p=>`<p class="fg-prose">${escapeAttr(p)}</p>`).join('');
  const occurs = (s.occursLabels||[]).map(l=>`<span class="fg-feldspar-occurs-label">${escapeAttr(l)}</span>`).join('');
  const l = s.left||{};
  const leftImg = l.image
    ? `<img src="${escapeAttr('assets/family-guide-feldspar/'+l.image)}" alt="${escapeAttr(l.alt||'')}" loading="lazy">`
    : '';
  const r = s.right||{};
  const rightWell = r.image
    ? `<img src="${escapeAttr('assets/family-guide-feldspar/'+r.image)}" alt="${escapeAttr(r.alt||'')}" loading="lazy">`
    : `<div class="fg-feldspar-sunstone-placeholder"><span>${escapeAttr(r.placeholderText||'Fine-shimmer Sunstone photo coming soon')}</span></div>`;
  return `<section class="fg-section" id="fg-sunstone-compare">
    <h2 class="fg-h2">${escapeAttr(s.title||'Sunstone Refuses to Pick a Side')}</h2>
    ${paras}
    ${occurs?`<div class="fg-feldspar-occurs-row">${occurs}</div>`:''}
    <div class="fg-feldspar-sunstone-grid">
      <div class="fg-feldspar-sunstone-col">
        <h3 class="fg-feldspar-sunstone-heading">${escapeAttr(l.caption||'')}</h3>
        ${l.body?`<p class="fg-prose">${escapeAttr(l.body)}</p>`:''}
        <div class="fg-feldspar-sunstone-well">${leftImg}</div>
        <div class="fg-feldspar-sunstone-caption">${escapeAttr(l.caption||'')}</div>
      </div>
      <div class="fg-feldspar-sunstone-col">
        <h3 class="fg-feldspar-sunstone-heading">${escapeAttr(r.caption||'')}</h3>
        ${r.body?`<p class="fg-prose">${escapeAttr(r.body)}</p>`:''}
        <div class="fg-feldspar-sunstone-well fg-feldspar-sunstone-well--placeholder">${rightWell}</div>
        <div class="fg-feldspar-sunstone-caption">${escapeAttr(r.caption||'')}</div>
      </div>
    </div>
    ${s.boldLine?`<p class="fg-prose fg-prose-emphasis">${escapeAttr(s.boldLine)}</p>`:''}
    ${s.closingParagraph?`<p class="fg-prose">${escapeAttr(s.closingParagraph)}</p>`:''}
    ${s.terminologyNote?`<p class="fg-prose">${escapeAttr(s.terminologyNote)}</p>`:''}
  </section>`;
}

/* ── 6. Three Ways Feldspar Plays With Light — Glow / Flash / Sparkle, each
   card leading with the plain-language word (dominant) over its technical
   term (secondary), then the approved body paragraph and a compact "What
   to notice" strip. Three cards only — no fourth Schiller card, per the
   approved plan (the earlier four-card "When the Light Moves" pass is
   fully replaced, not extended). ── */
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
      ${item.extraLine?`<p class="fg-photocard-text">${escapeAttr(item.extraLine)}</p>`:''}
      ${item.whatToNotice?`<div class="fg-feldspar-notice"><span>What to notice:</span> ${escapeAttr(item.whatToNotice)}</div>`:''}
    </div>
  </div>`;
}
function familyGuideFeldsparLightHtml(guide){
  const l = guide.lightMoves;
  if(!l) return '';
  const cards = (l.items||[]).map(fgFeldsparLightCardHtml).join('');
  return `<section class="fg-section" id="fg-light-moves">
    <h2 class="fg-h2">${escapeAttr(l.title||'Three Ways Feldspar Plays With Light')}</h2>
    ${l.intro?`<p class="fg-prose">${escapeAttr(l.intro)}</p>`:''}
    <div class="fg-photo-grid fg-photo-grid--3">${cards}</div>
    ${l.closingLine?`<p class="fg-prose">${escapeAttr(l.closingLine)}</p>`:''}
  </section>`;
}

/* ── 7. Moonstone Is More Complicated Than Its Name Suggests — a 2x2
   decoder grid (Moonstone, Rainbow Moonstone, Peach Moonstone, Black
   Moonstone), each card carrying its own explanatory paragraph and a
   "Best clue" line — no alarm-heavy badges. Green Moonstone renders
   separately, in its own horizontal teaching strip beneath the grid,
   making it visually clear it leads outside the Feldspar family without
   using caution styling. ── */
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
    ${item.body?`<p class="fg-fact-body">${escapeAttr(item.body)}</p>`:''}
    ${item.bestClue?`<p class="fg-feldspar-best-clue"><span>Best clue:</span> ${escapeAttr(item.bestClue)}</p>`:''}
  </div>`;
}
function familyGuideFeldsparMoonstoneDecoderHtml(guide){
  const m = guide.moonstoneDecoder;
  if(!m) return '';
  const cards = (m.items||[]).map(fgFeldsparDecoderCardHtml).filter(Boolean).join('');
  const paras = (m.paragraphs||[]).map(p=>`<p class="fg-prose">${escapeAttr(p)}</p>`).join('');
  const g = m.greenMoonstone;
  let greenHtml = '';
  if(g){
    const c = fgCrystal(g.stoneId);
    if(c){
      const imgSrc = (typeof firstEncyclopediaPhoto==='function') ? firstEncyclopediaPhoto(c) : '';
      const imgHtml = imgSrc
        ? `<img src="${escapeAttr(imgSrc)}" alt="${escapeAttr(c.n)}" loading="lazy">`
        : `<div class="fg-stonecard-noimg fg-stonecard-noimg--labeled"><span>Photo pending</span></div>`;
      const gParas = (g.paragraphs||[]).map(p=>`<p class="fg-prose">${escapeAttr(p)}</p>`).join('');
      greenHtml = `<div class="fg-feldspar-green-strip">
        <button type="button" class="fg-feldspar-green-media" onclick="openDetail('${escapeAttr(c.i)}')" title="Open ${escapeAttr(c.n)} in Quick View">${imgHtml}</button>
        <div class="fg-feldspar-green-copy">
          <div class="fg-feldspar-green-title">${escapeAttr(g.title||'')}</div>
          ${gParas}
        </div>
      </div>`;
    }
  }
  return `<section class="fg-section" id="fg-moonstone-decoder">
    <h2 class="fg-h2">${escapeAttr(m.title||'Moonstone Is More Complicated Than Its Name Suggests')}</h2>
    ${paras}
    <div class="fg-relationship-grid fg-feldspar-decoder-grid">${cards}</div>
    ${greenHtml}
  </section>`;
}

/* ── 8. Labradorite, Spectrolite & Larvikite — three comparison cards, each
   with an identity subtitle directly beneath the name (no caution badge),
   plus one compact bottom-line comparison strip. ── */
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
    ${item.subtitle?`<p class="fg-feldspar-branch-subtitle">${escapeAttr(item.subtitle)}</p>`:''}
    ${item.body?`<p class="fg-fact-body">${escapeAttr(item.body)}</p>`:''}
  </div>`;
}
function familyGuideFeldsparLslHtml(guide){
  const s = guide.lsl;
  if(!s) return '';
  const cards = (s.items||[]).map(fgFeldsparLslCardHtml).filter(Boolean).join('');
  const bottomLines = (s.bottomLines||[]).map(l=>`<span>${escapeAttr(l)}</span>`).join('');
  return `<section class="fg-section" id="fg-lsl">
    <h2 class="fg-h2">${escapeAttr(s.title||'Labradorite, Spectrolite & Larvikite')}</h2>
    ${s.intro?`<p class="fg-prose">${escapeAttr(s.intro)}</p>`:''}
    <div class="fg-relationship-grid">${cards}</div>
    ${bottomLines?`<div class="fg-feldspar-bottomline">${bottomLines}</div>`:''}
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

/* ── Feldspar guide assembly — approved section order. No in-page
   familyGuideImageCreditsHtml() call, per the approved plan's "remove the
   in-page expandable image-credit block" instruction — guide.imageCredits
   still powers credits.html generically (see fgSetFooterCreditsLink()
   above for the still-unresolved dedicated-anchor gap). ── */
function familyGuideFeldsparHtml(guide){
  return `
  <div class="fg-guide" data-family-slug="${escapeAttr(guide.slug)}">
    ${familyGuideHeroHtml(guide)}
    ${familyGuideFeldsparBridgeHtml(guide)}
    ${familyGuideFeldsparExpressionsHtml(guide)}
    ${familyGuideFeldsparBranchesHtml(guide)}
    ${familyGuideFeldsparSunstoneCompareHtml(guide)}
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
  const cards = members.map(mem=>fgExpressionCardHtml(mem, {showIdentity:true, placeholderOk:true})).filter(Boolean).join('');
  const emptyNote = (m.dynamicFilterValue && !members.length)
    ? `<p class="fg-fact-body fg-note-center">Live roster still loading — please check back once the encyclopedia has finished loading.</p>` : '';
  // m.useSectionIntro (2026-07-23, added for Jasper) opts into the new shared
  // .fg-section-intro treatment instead of .fg-lead. Chalcedony/Agate never
  // set this, so their intro paragraphs are unchanged.
  const introClass = m.useSectionIntro ? 'fg-section-intro' : 'fg-lead';
  return `<section class="fg-section" id="fg-meet-family">
    <h2 class="fg-h2">${escapeAttr(m.title||'Meet the Family')}</h2>
    ${m.intro?`<p class="${introClass}">${escapeAttr(m.intro)}</p>`:''}
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

/* ── 3. What Agate Actually Is (2026-07-23, first Agate pass) — Agate's own
   parallel to familyGuideWhatChalcedonyIsHtml above. Kept as a separate,
   dedicated function/data field (guide.whatAgateIs) rather than renaming or
   reusing Chalcedony's, so the approved Chalcedony guide's code and output
   are left completely untouched. Explains that Agate is banded/patterned
   chalcedony formed by successive silica deposition in a cavity — a pattern
   distinction, not a different mineral. No approved licensed photography
   exists yet, so the unbanded-Chalcedony/banded-Agate comparison renders as
   labeled pending placeholders. ── */
function familyGuideWhatAgateIsHtml(guide){
  const w = guide.whatAgateIs;
  if(!w) return '';
  const paras = (w.paragraphs||[]).map(p=>`<p class="fg-prose">${escapeAttr(p)}</p>`).join('');
  return `<section class="fg-section" id="fg-what-agate-is">
    <h2 class="fg-h2">${escapeAttr(w.title||'What Agate Actually Is')}</h2>
    <div class="fg-prose-block">${paras}</div>
    <div class="fg-compare-grid">
      <div class="fg-single-visual"><div class="fg-stonecard-noimg fg-stonecard-noimg--labeled"><span>Photo pending — unbanded Chalcedony</span></div></div>
      <div class="fg-single-visual"><div class="fg-stonecard-noimg fg-stonecard-noimg--labeled"><span>Photo pending — banded Agate</span></div></div>
    </div>
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
  return `<section class="fg-section" id="fg-agate-jasper-fit">
    <h2 class="fg-h2">${escapeAttr(r.title||'Chalcedony, Agate & Jasper')}</h2>
    ${r.intro?`<p class="${introClass}">${escapeAttr(r.intro)}</p>`:''}
    <div class="fg-relationship-grid">${branches}</div>
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

/* ── Agate guide assembly (2026-07-23) — the second guide to use Agate's
   own "What Agate Actually Is" section, alongside the same generic
   Chalcedony/Agate/Jasper Fit, Color/Translucency/Surface, Forms, and Wider
   Quartz Story sections Chalcedony's page already established (unmodified,
   just fed Agate's own guide data). Meet the Agate Family resolves its
   roster live (guide.meetTheFamily.dynamicFilterValue:"Agate") rather than
   from a hardcoded members list — see familyGuideMeetFamilyHtml() above for
   why. Purely additive: nothing here changes Chalcedony's assembly, data, or
   rendered output. ── */
function familyGuideAgateHtml(guide){
  return `
  <div class="fg-guide" data-family-slug="${escapeAttr(guide.slug)}">
    ${familyGuideHeroHtml(guide)}
    ${familyGuideMeetFamilyHtml(guide)}
    ${familyGuideWhatAgateIsHtml(guide)}
    ${familyGuideAgateJasperFitHtml(guide)}
    ${familyGuideColorTranslucencyHtml(guide)}
    ${familyGuideFormsHtml(guide)}
    ${familyGuideWiderQuartzStoryHtml(guide)}
    ${familyGuideCollectionHtml(guide)}
    ${familyGuideClosingHtml(guide)}
    ${familyGuideImageCreditsHtml(guide)}
  </div>`;
}

/* ══════════════════════════════════════════════════════════════════════
   JASPER FAMILY GUIDE — dedicated section renderers (2026-07-23 first
   implementation pass). Also the first guide to use the new shared
   .fg-section-intro component (title -> one-sentence italic Georgia intro
   -> content), added this pass in styles.css. Reuses Chalcedony/Agate's
   generic Chalcedony/Agate/Jasper-Fit, Collection, and What-Changes-the-
   Name components (each opted in via a new useSectionIntro/sectionIntro
   flag — see those functions above), plus fgPhotoCardHtml/fgExpressionCardHtml
   unchanged. No licensed educational photography could be retained this
   pass (see editorialStatusNote/pendingAssets in the data) — every
   would-be photo slot below renders a labeled pending placeholder instead
   of a substitute image, per the brief's explicit guardrail. ══ */

/* ── 3. What Jasper Actually Is — a large educational image beside
   explanatory copy, with an optional compact rough-vs-polished strip below
   (reusing fgPhotoCardHtml). Kept as its own dedicated function/data field
   (guide.whatJasperIs) rather than reusing or renaming Chalcedony's/Agate's
   parallel sections, so their approved code and output stay untouched. ── */
function familyGuideWhatJasperIsHtml(guide){
  const w = guide.whatJasperIs;
  if(!w) return '';
  const paras = (w.paragraphs||[]).map(p=>`<p class="fg-prose">${escapeAttr(p)}</p>`).join('');
  const mainImgHtml = w.image
    ? `<img src="${escapeAttr('assets/family-guide-jasper/'+w.image)}" alt="${escapeAttr(w.imageAlt||'')}" loading="lazy">`
    : `<div class="fg-stonecard-noimg fg-stonecard-noimg--labeled"><span>${escapeAttr(w.placeholderLabel||'Photo pending')}</span></div>`;
  const compareCount = (w.compareItems||[]).length;
  const compareGridClass = compareCount===2 ? 'fg-photo-grid--2' : (compareCount===3 ? 'fg-photo-grid--3' : 'fg-photo-grid--4');
  const compareHtml = compareCount
    ? `<div class="fg-photo-grid ${compareGridClass} fg-what-jasper-compare">${(w.compareItems||[]).map(fgPhotoCardHtml).join('')}</div>`
    : '';
  return `<section class="fg-section" id="fg-what-jasper-is">
    <h2 class="fg-h2">${escapeAttr(w.title||'What Jasper Actually Is')}</h2>
    ${w.sectionIntro?`<p class="fg-section-intro">${escapeAttr(w.sectionIntro)}</p>`:''}
    <div class="fg-explain-grid">
      <div class="fg-explain-media">${mainImgHtml}</div>
      <div class="fg-explain-copy">${paras}</div>
    </div>
    ${compareHtml}
  </section>`;
}

/* ── 4. How Jasper Makes a Pattern — reader-facing visual pattern
   categories (Brecciated, Scenic, Orbicular, Spotted, Banded, Mottled),
   reusing fgPhotoCardHtml exactly as Calcite's Shapes/Recognition sections
   do. Explicitly not a formal universal classification — see the section
   intro and editorialStatusNote. ── */
function familyGuideJasperPatternHtml(guide){
  const p = guide.patternGuide;
  if(!p) return '';
  const cards = (p.categories||[]).map(cat=>fgPhotoCardHtml(cat, {folder:'family-guide-jasper'})).join('');
  return `<section class="fg-section" id="fg-jasper-pattern">
    <h2 class="fg-h2">${escapeAttr(p.title||'How Jasper Makes a Pattern')}</h2>
    ${p.sectionIntro?`<p class="fg-section-intro">${escapeAttr(p.sectionIntro)}</p>`:''}
    <div class="fg-photo-grid fg-photo-grid--3">${cards}</div>
  </section>`;
}

/* ── 6. Rough, Cut, and Polished — a lapidary-stage comparison (rough,
   cut face, polished slab, cabochon, carving, bead, tumble), reusing
   fgPhotoCardHtml exactly as the Pattern section above does. ── */
function familyGuideRoughCutPolishedHtml(guide){
  const r = guide.roughCutPolished;
  if(!r) return '';
  const cards = (r.items||[]).map(fgPhotoCardHtml).join('');
  return `<section class="fg-section" id="fg-rough-cut-polished">
    <h2 class="fg-h2">${escapeAttr(r.title||'Rough, Cut, and Polished')}</h2>
    ${r.sectionIntro?`<p class="fg-section-intro">${escapeAttr(r.sectionIntro)}</p>`:''}
    <div class="fg-photo-grid fg-photo-grid--4">${cards}</div>
  </section>`;
}

/* ── Jasper guide assembly — its own approved section order. Purely
   additive: nothing here changes Calcite/Quartz/Fluorite/Feldspar/
   Chalcedony/Agate's assembly, data, or rendered output. ── */
function familyGuideJasperHtml(guide){
  return `
  <div class="fg-guide" data-family-slug="${escapeAttr(guide.slug)}">
    ${familyGuideHeroHtml(guide)}
    ${familyGuideMeetFamilyHtml(guide)}
    ${familyGuideWhatJasperIsHtml(guide)}
    ${familyGuideJasperPatternHtml(guide)}
    ${familyGuideWhatChangesNameHtml(guide)}
    ${familyGuideRoughCutPolishedHtml(guide)}
    ${familyGuideAgateJasperFitHtml(guide)}
    ${familyGuideCollectionHtml(guide)}
    ${familyGuideClosingHtml(guide)}
    ${familyGuideImageCreditsHtml(guide)}
  </div>`;
}

/* ══════════════════════════════════════════════════════════════════════
   GARNET FAMILY GUIDE — dedicated section renderers (2026-07-23, revised
   same day into a simpler six-section layout per Christie's "focused layout
   and structure correction" pass: the original eight-section split read as
   fragmented/card-heavy, so Color, Familiar Names, Recognition, and
   Crystal-to-Polished were folded into two broader sections — Major
   Branches now carries color + naming context, and a new "How Garnet
   Appears" section carries the stage sequence + a compact recognition
   list. Section order: Meet the Family, Garnet Is a Group/Not One Stone,
   Major Branches (+ color + names), How Garnet Appears, In Your
   Collection, Closing. Purely additive/Garnet-scoped: nothing here touches
   a Calcite/Quartz/Fluorite/Feldspar/Chalcedony/Agate/Jasper selector,
   function, or data field. All five roster cards use fgStoneCardHtml
   directly in placeholder-aware mode (opts.placeholderOk) since two of the
   five species (Grossular, Spessartine) have no canonical photo on file
   yet — see the brief's explicit guardrail against substituting a
   different stone's image. ══ */

/* ── 1. Meet the Garnet Family — five rostered species. Grid uses
   .fg-card-grid--garnet-roster (flex-wrap + centered rows), which naturally
   lays out as three cards on row one and two centered on row two at
   desktop widths, without a grid-template-areas hack. "QUICK VIEW →"
   button copy per the approved brief (an opt-in fgStoneCardHtml field,
   opts.qvLabel, defaulting to the existing "Quick View" text everywhere
   else so no other guide's cards are affected). ── */
function familyGuideMeetGarnetFamilyHtml(guide){
  const m = guide.meetGarnetFamily;
  if(!m) return '';
  const cards = (m.members||[]).map(mem=>fgStoneCardHtml(mem, {showIdentity:true, placeholderOk:true, qvLabel:'QUICK VIEW →'})).filter(Boolean).join('');
  return `<section class="fg-section" id="fg-meet-garnet-family">
    <h2 class="fg-h2">${escapeAttr(m.title||'Meet the Garnet Family')}</h2>
    ${m.intro?`<p class="fg-section-intro">${escapeAttr(m.intro)}</p>`:''}
    <div class="fg-card-grid fg-card-grid--garnet-roster">${cards}</div>
  </section>`;
}

/* ── 2. Garnet Is a Group, Not One Stone — explanatory copy widened to a
   comfortable reading measure, ending in an emphasized inline line rather
   than a separate bordered three-box visual (removed per the layout
   correction — the prose already makes the point). ── */
function familyGuideGarnetGroupHtml(guide){
  const g = guide.garnetGroup;
  if(!g) return '';
  const paras = (g.paragraphs||[]).map(p=>`<p class="fg-prose">${escapeAttr(p)}</p>`).join('');
  return `<section class="fg-section" id="fg-garnet-group">
    <h2 class="fg-h2">${escapeAttr(g.title||'Garnet Is a Group, Not One Stone')}</h2>
    ${g.intro?`<p class="fg-section-intro">${escapeAttr(g.intro)}</p>`:''}
    <div class="fg-prose-block">
      ${paras}
      ${g.supportingLine?`<p class="fg-prose fg-prose-emphasis">${escapeAttr(g.supportingLine)}</p>`:''}
    </div>
  </section>`;
}

/* ── 3. The Major Garnet Branches — now the dominant, widened visual
   section of the page. Carries the parent/branch/species diagram plus,
   folded in beneath it, the color explanation (two paragraphs + a compact
   horizontal color strip) and a compact "Familiar Names Within the Family"
   note — replacing what were three separate, narrower, card-heavy sections
   in the previous pass. All content remains entirely data-driven from
   guide.majorBranches; nothing here reorders or renames the branches,
   species, colors, or name-map relationships. ── */
const FG_GARNET_COLOR_SWATCHES = {
  'deep red': '#7a2a2a',
  'orange': '#c4713a',
  'yellow to honey': '#d4a53a',
  'green': '#4a7a4a',
  'brown to nearly black': '#3a2a20',
  'purple-red or color-changing': '#7a3a5a'
};
function familyGuideGarnetBranchesHtml(guide){
  const b = guide.majorBranches;
  if(!b) return '';
  const branchesHtml = (b.branches||[]).map(br=>{
    const species = (br.species||[]).map(sp=>`<div class="fg-tree-species-item">
      <div class="fg-tree-species-name">${escapeAttr(sp.name||'')}</div>
      <p class="fg-tree-species-caption">${escapeAttr(sp.caption||'')}</p>
    </div>`).join('');
    return `<div class="fg-tree-branch">
      <div class="fg-tree-branch-title">${escapeAttr(br.title||'')}</div>
      ${br.secondaryLabel?`<div class="fg-tree-branch-secondary">${escapeAttr(br.secondaryLabel)}</div>`:''}
      <div class="fg-tree-species">${species}</div>
    </div>`;
  }).join('');
  const colorParas = (b.colorParagraphs||[]).map(p=>`<p class="fg-prose">${escapeAttr(p)}</p>`).join('');
  const colorChips = (b.colorCells||[]).map(cell=>{
    const key = String(cell.label||'').toLowerCase().trim();
    const color = FG_GARNET_COLOR_SWATCHES[key] || 'var(--stone3)';
    return `<span class="fg-color-chip"><span class="fg-color-chip-dot" style="background:${color}"></span>${escapeAttr(cell.label||'')}</span>`;
  }).join('');
  const nameRows = (b.nameMap||[]).map(row=>`<div class="fg-namemap-row"><span class="fg-namemap-from">${escapeAttr(row.from||'')}</span><span class="fg-namemap-arrow">→</span><span>${escapeAttr(row.to||'')}</span></div>`).join('');
  return `<section class="fg-section" id="fg-garnet-branches">
    <h2 class="fg-h2">${escapeAttr(b.title||'The Major Garnet Branches')}</h2>
    ${b.intro?`<p class="fg-section-intro">${escapeAttr(b.intro)}</p>`:''}
    <div class="fg-tree">
      <div class="fg-tree-parent">
        <div class="fg-tree-parent-title">${escapeAttr((b.parent&&b.parent.title)||'GARNET')}</div>
        <div class="fg-tree-parent-sub">${escapeAttr((b.parent&&b.parent.sub)||'')}</div>
      </div>
      <div class="fg-tree-branches">${branchesHtml}</div>
    </div>
    ${colorParas?`<div class="fg-prose-block fg-garnet-branches-subblock">${colorParas}</div>`:''}
    ${colorChips?`<div class="fg-color-strip">${colorChips}</div>`:''}
    ${b.colorCaption?`<p class="fg-note-center">${escapeAttr(b.colorCaption)}</p>`:''}
    ${nameRows?`<div class="fg-names-note">
      <div class="fg-names-note-title">${escapeAttr(b.namesTitle||'Familiar Names Within the Family')}</div>
      <div class="fg-namemap">${nameRows}</div>
      ${b.namesNote?`<p class="fg-fact-body fg-note-center">${escapeAttr(b.namesNote)}</p>`:''}
    </div>`:''}
  </section>`;
}

/* ── 4. How Garnet Appears — replaces the former separate "How to
   Recognize Garnet" and "From Crystal to Polished Stone" sections: one
   four-stage visual sequence (each stage renders as a labeled pending
   placeholder per the brief's explicit allowance, rather than guessing
   which of Almandine Garnet's existing canonical photos depicts which
   stage), followed by one compact recognition list instead of five
   separate cards with CSS silhouettes. ── */
function familyGuideGarnetAppearanceHtml(guide){
  const a = guide.appearance;
  if(!a) return '';
  const stages = (a.stages||[]).map((st,i)=>`<div class="fg-progression-stage">
    <div class="fg-progression-media"><div class="fg-stonecard-noimg fg-stonecard-noimg--labeled"><span>Photo pending</span></div></div>
    <div class="fg-progression-number">${i+1}</div>
    <div class="fg-progression-body">
      <div class="fg-progression-title">${escapeAttr(st.title||'')}</div>
      <p class="fg-progression-text">${escapeAttr(st.body||'')}</p>
    </div>
  </div>`).join('');
  const recognitionItems = fgList(a.recognitionItems||[], 'fg-garnet-plain-list');
  return `<section class="fg-section" id="fg-garnet-appearance">
    <h2 class="fg-h2">${escapeAttr(a.title||'How Garnet Appears')}</h2>
    ${a.intro?`<p class="fg-section-intro">${escapeAttr(a.intro)}</p>`:''}
    <div class="fg-progression">${stages}</div>
    <div class="fg-garnet-plain-list-wrap">${recognitionItems}</div>
  </section>`;
}

/* ── 5. Garnet in Your Collection — a simple compact list (not four large
   bordered rows) plus the compact linked list of the five canonical
   entries (deliberately not a repeat of the full five-card roster gallery
   from Section 1). ── */
function familyGuideGarnetCollectionHtml(guide){
  const c = guide.garnetCollection;
  if(!c) return '';
  const listItems = fgList(c.listItems||[], 'fg-garnet-plain-list');
  const links = (c.catalogLinks||[]).map(l=>{
    const cr = fgCrystal(l.stoneId);
    if(!cr) return '';
    return `<button type="button" class="fg-catalog-link" onclick="openDetail('${escapeAttr(cr.i)}')">${escapeAttr(l.name||cr.n)}</button>`;
  }).filter(Boolean).join('');
  return `<section class="fg-section" id="fg-garnet-collection">
    <h2 class="fg-h2">${escapeAttr(c.title||'Garnet in Your Collection')}</h2>
    ${c.intro?`<p class="fg-section-intro">${escapeAttr(c.intro)}</p>`:''}
    <div class="fg-garnet-plain-list-wrap">${listItems}</div>
    <div class="fg-catalog-links">${links}</div>
  </section>`;
}

/* ── Garnet guide assembly — its own approved section order. Purely
   additive: nothing here changes any other guide's assembly, data, or
   rendered output. ── */
function familyGuideGarnetHtml(guide){
  return `
  <div class="fg-guide" data-family-slug="${escapeAttr(guide.slug)}">
    ${familyGuideHeroHtml(guide)}
    ${familyGuideMeetGarnetFamilyHtml(guide)}
    ${familyGuideGarnetGroupHtml(guide)}
    ${familyGuideGarnetBranchesHtml(guide)}
    ${familyGuideGarnetAppearanceHtml(guide)}
    ${familyGuideGarnetCollectionHtml(guide)}
    ${familyGuideClosingHtml(guide)}
    ${familyGuideImageCreditsHtml(guide)}
  </div>`;
}

/* ══════════════════════════════════════════════════════════════════════
   TOURMALINE FAMILY GUIDE — dedicated section renderers (2026-07-23,
   built per Christie's lean implementation brief, reusing the corrected
   Garnet layout pattern: wide prose, one dominant visual, a 3+2 roster,
   one appearance sequence, minimal bordered cards. Purely additive/
   Tourmaline-scoped: nothing here touches a Calcite/Quartz/Fluorite/
   Feldspar/Chalcedony/Agate/Jasper/Garnet selector, function, or data
   field. Roster cards reuse fgStoneCardHtml in placeholder-aware mode
   (opts.placeholderOk) since Watermelon Tourmaline has no canonical photo
   on file yet — see the brief's explicit pending-photo allowance. ══ */

/* ── 1. Meet the Tourmaline Family — five rostered species/expressions.
   Reuses .fg-card-grid--garnet-roster: a flex-wrap, centered-row layout
   (3 cards, then 2 centered) that is not garnet-specific in behavior,
   only in its original naming — the exact 3+2/2-col/1-col responsive
   pattern the brief asks this guide to reuse. ── */
function familyGuideMeetTourmalineFamilyHtml(guide){
  const m = guide.meetTourmalineFamily;
  if(!m) return '';
  const cards = (m.members||[]).map(mem=>fgStoneCardHtml(mem, {showIdentity:true, placeholderOk:true, qvLabel:'QUICK VIEW →'})).filter(Boolean).join('');
  return `<section class="fg-section" id="fg-meet-tourmaline-family">
    <h2 class="fg-h2">${escapeAttr(m.title||'Meet the Tourmaline Family')}</h2>
    ${m.intro?`<p class="fg-section-intro">${escapeAttr(m.intro)}</p>`:''}
    <div class="fg-card-grid fg-card-grid--garnet-roster">${cards}</div>
  </section>`;
}

/* ── Shared triple-caption grid — three bordered title+caption cards in a
   centered 3-column grid. Reuses .fg-namegrid--3 (grid layout only) and
   .fg-tree-species-item (bordered card, Georgia name + caption) exactly
   as already styled for Garnet's branch species list — no new CSS. Used
   twice below: the growth-pattern comparison (Section 3) and the species
   comparison (Section 4). ── */
function fgTripleCaptionGridHtml(items){
  const cards = (items||[]).map(it=>`<div class="fg-tree-species-item">
    <div class="fg-tree-species-name">${escapeAttr(it.title||'')}</div>
    <p class="fg-tree-species-caption">${escapeAttr(it.body||'')}</p>
  </div>`).join('');
  return `<div class="fg-namegrid fg-namegrid--3">${cards}</div>`;
}

/* ── 2. Tourmaline Is a Group, Not One Species — wide prose plus one
   simple relationship visual (TOURMALINE -> Schorl/Dravite/Elbaite).
   Reuses .fg-tree/.fg-tree-parent/.fg-tree-branches/.fg-tree-branch as
   Garnet's branch diagram does, but omits the nested species list (this
   guide's branches map directly to a roster color group, not to further
   species), so .fg-tree-species is never rendered empty. ── */
function familyGuideTourmalineGroupHtml(guide){
  const g = guide.tourmalineGroup;
  if(!g) return '';
  const paras = (g.paragraphs||[]).map(p=>`<p class="fg-prose">${escapeAttr(p)}</p>`).join('');
  const tree = g.tree||{};
  const branchesHtml = (tree.branches||[]).map(br=>`<div class="fg-tree-branch">
    <div class="fg-tree-branch-title">${escapeAttr(br.title||'')}</div>
    ${br.secondaryLabel?`<div class="fg-tree-branch-secondary">${escapeAttr(br.secondaryLabel)}</div>`:''}
  </div>`).join('');
  return `<section class="fg-section" id="fg-tourmaline-group">
    <h2 class="fg-h2">${escapeAttr(g.title||'Tourmaline Is a Group, Not One Species')}</h2>
    ${g.intro?`<p class="fg-section-intro">${escapeAttr(g.intro)}</p>`:''}
    <div class="fg-prose-block">${paras}</div>
    <div class="fg-tree">
      <div class="fg-tree-parent">
        <div class="fg-tree-parent-title">${escapeAttr((tree.parent&&tree.parent.title)||'TOURMALINE')}</div>
        <div class="fg-tree-parent-sub">${escapeAttr((tree.parent&&tree.parent.sub)||'')}</div>
      </div>
      <div class="fg-tree-branches">${branchesHtml}</div>
    </div>
    ${g.closingLine?`<p class="fg-note-center">${escapeAttr(g.closingLine)}</p>`:''}
  </section>`;
}

/* ── 3. How Tourmaline Records Growth — the dominant visual section: a
   four-stage growth diagram (reuses .fg-progression, same component as
   Garnet's appearance-stage sequence), a compact three-way comparison
   (fgTripleCaptionGridHtml), a Watermelon note (reuses .fg-names-note),
   and one short recognition line. ── */
function familyGuideGrowthRecordingHtml(guide){
  const r = guide.growthRecording;
  if(!r) return '';
  const paras = (r.paragraphs||[]).map(p=>`<p class="fg-prose">${escapeAttr(p)}</p>`).join('');
  const stages = (r.stages||[]).map((st,i)=>`<div class="fg-progression-stage">
    <div class="fg-progression-media"><div class="fg-stonecard-noimg fg-stonecard-noimg--labeled"><span>Photo pending</span></div></div>
    <div class="fg-progression-number">${i+1}</div>
    <div class="fg-progression-body">
      <div class="fg-progression-title">${escapeAttr(st.title||'')}</div>
      <p class="fg-progression-text">${escapeAttr(st.body||'')}</p>
    </div>
  </div>`).join('');
  const w = r.watermelonNote||{};
  return `<section class="fg-section" id="fg-growth-recording">
    <h2 class="fg-h2">${escapeAttr(r.title||'How Tourmaline Records Growth')}</h2>
    ${r.intro?`<p class="fg-section-intro">${escapeAttr(r.intro)}</p>`:''}
    <div class="fg-prose-block">${paras}</div>
    <div class="fg-progression">${stages}</div>
    ${fgTripleCaptionGridHtml(r.comparison)}
    ${w.body?`<div class="fg-names-note">
      <div class="fg-names-note-title">${escapeAttr(w.title||'Why Watermelon Looks Like Watermelon')}</div>
      <p class="fg-fact-body fg-note-center">${escapeAttr(w.body)}</p>
    </div>`:''}
    ${r.recognitionNote?`<p class="fg-note-center">${escapeAttr(r.recognitionNote)}</p>`:''}
  </section>`;
}

/* ── 4. How Tourmaline Appears — a four-stage sequence (reuses
   .fg-progression again), a species comparison (fgTripleCaptionGridHtml),
   a matrix note, and one contextual link to the Tourmaline Quartz Quartz-
   family entry (reuses .fg-catalog-link — not a sixth roster card, no
   Quick View grid slot, no family-guide route). ── */
function familyGuideTourmalineAppearanceHtml(guide){
  const a = guide.tourmalineAppearance;
  if(!a) return '';
  const stages = (a.stages||[]).map((st,i)=>`<div class="fg-progression-stage">
    <div class="fg-progression-media"><div class="fg-stonecard-noimg fg-stonecard-noimg--labeled"><span>Photo pending</span></div></div>
    <div class="fg-progression-number">${i+1}</div>
    <div class="fg-progression-body">
      <div class="fg-progression-title">${escapeAttr(st.title||'')}</div>
      <p class="fg-progression-text">${escapeAttr(st.body||'')}</p>
    </div>
  </div>`).join('');
  const q = a.quartzLink||{};
  const qc = q.stoneId ? fgCrystal(q.stoneId) : null;
  return `<section class="fg-section" id="fg-tourmaline-appearance">
    <h2 class="fg-h2">${escapeAttr(a.title||'How Tourmaline Appears')}</h2>
    ${a.intro?`<p class="fg-section-intro">${escapeAttr(a.intro)}</p>`:''}
    <div class="fg-progression">${stages}</div>
    ${fgTripleCaptionGridHtml(a.speciesComparison)}
    ${a.matrixNote?`<p class="fg-note-center">${escapeAttr(a.matrixNote)}</p>`:''}
    ${qc?`<div class="fg-names-note">
      <div class="fg-names-note-title">${escapeAttr(q.title||'Tourmaline Quartz')}</div>
      <p class="fg-fact-body fg-note-center">${escapeAttr(q.body||'')}</p>
      <div class="fg-catalog-links"><button type="button" class="fg-catalog-link" onclick="openDetail('${escapeAttr(qc.i)}')">${escapeAttr(q.linkLabel||'Tourmaline Quartz')}</button></div>
    </div>`:''}
  </section>`;
}

/* ── 5. Tourmaline in Your Collection — a simple compact list, one small
   terminology note (Indicolite/Rubellite/Watermelon are names, not
   separate species/roster cards — no cards, routes, or Quick View
   entries are added for them), and the five linked catalog pills. ── */
function familyGuideTourmalineCollectionHtml(guide){
  const c = guide.tourmalineCollection;
  if(!c) return '';
  const listItems = fgList(c.listItems||[], 'fg-garnet-plain-list');
  const links = (c.catalogLinks||[]).map(l=>{
    const cr = fgCrystal(l.stoneId);
    if(!cr) return '';
    return `<button type="button" class="fg-catalog-link" onclick="openDetail('${escapeAttr(cr.i)}')">${escapeAttr(l.name||cr.n)}</button>`;
  }).filter(Boolean).join('');
  return `<section class="fg-section" id="fg-tourmaline-collection">
    <h2 class="fg-h2">${escapeAttr(c.title||'Tourmaline in Your Collection')}</h2>
    ${c.intro?`<p class="fg-section-intro">${escapeAttr(c.intro)}</p>`:''}
    <div class="fg-garnet-plain-list-wrap">${listItems}</div>
    ${c.terminologyNote?`<p class="fg-fact-body fg-note-center">${escapeAttr(c.terminologyNote)}</p>`:''}
    <div class="fg-catalog-links">${links}</div>
  </section>`;
}

/* ── Tourmaline guide assembly — its own approved section order. Purely
   additive: nothing here changes any other guide's assembly, data, or
   rendered output. ── */
function familyGuideTourmalineHtml(guide){
  return `
  <div class="fg-guide" data-family-slug="${escapeAttr(guide.slug)}">
    ${familyGuideHeroHtml(guide)}
    ${familyGuideMeetTourmalineFamilyHtml(guide)}
    ${familyGuideTourmalineGroupHtml(guide)}
    ${familyGuideGrowthRecordingHtml(guide)}
    ${familyGuideTourmalineAppearanceHtml(guide)}
    ${familyGuideTourmalineCollectionHtml(guide)}
    ${familyGuideClosingHtml(guide)}
    ${familyGuideImageCreditsHtml(guide)}
  </div>`;
}

/* ══════════════════════════════════════════════════════════════════════
   OBSIDIAN FAMILY GUIDE — dedicated section renderers (2026-07-23, built
   per Christie's lean implementation brief, reusing the corrected Garnet/
   Tourmaline layout patterns: wide prose, one dominant visual, a 3+3
   roster, one appearance sequence, minimal bordered cards. Purely
   additive/Obsidian-scoped: nothing here touches a Calcite/Quartz/
   Fluorite/Feldspar/Chalcedony/Agate/Jasper/Garnet/Tourmaline selector,
   function, or data field. Roster cards reuse fgStoneCardHtml in
   placeholder-aware mode (opts.placeholderOk); all six roster stones have
   a canonical image on file per the Production Master. ══ */

/* ── Shared bordered title+caption card — reuses .fg-tree-species-item
   exactly as Tourmaline's fgTripleCaptionGridHtml does, but factored so
   the wrapping grid class is caller-supplied: Obsidian needs a 2-up
   comparison (Section 2) and a 4-up comparison (Section 3), neither of
   which match Tourmaline's fixed 3-up grid. No new CSS: fg-card-grid--2
   (2 cols, centered, collapses to 1 on mobile) and fg-card-grid--4 (4/2/1
   responsive) are both existing, already-shipped grid classes reused
   here for text cards instead of their usual stone-photo cards. ── */
function fgCaptionCardsHtml(items){
  return (items||[]).map(it=>`<div class="fg-tree-species-item">
    <div class="fg-tree-species-name">${escapeAttr(it.title||'')}</div>
    <p class="fg-tree-species-caption">${escapeAttr(it.body||'')}</p>
  </div>`).join('');
}

/* ── 1. Meet the Obsidian Family — six rostered expressions. Reuses
   .fg-card-grid--garnet-roster (flex-wrap, centered rows) which, with six
   cards instead of five, naturally lays out as the requested 3+3 rather
   than 3+2 — same component, no new modifier needed. ── */
function familyGuideMeetObsidianFamilyHtml(guide){
  const m = guide.meetObsidianFamily;
  if(!m) return '';
  const cards = (m.members||[]).map(mem=>fgStoneCardHtml(mem, {showIdentity:true, placeholderOk:true, qvLabel:'QUICK VIEW →'})).filter(Boolean).join('');
  return `<section class="fg-section" id="fg-meet-obsidian-family">
    <h2 class="fg-h2">${escapeAttr(m.title||'Meet the Obsidian Family')}</h2>
    ${m.intro?`<p class="fg-section-intro">${escapeAttr(m.intro)}</p>`:''}
    <div class="fg-card-grid fg-card-grid--garnet-roster">${cards}</div>
  </section>`;
}

/* ── 2. Obsidian Is Glass, Not Crystal — wide prose plus one simple
   two-item comparison (Crystalline Mineral vs. Obsidian). No additional
   taxonomy cards, per the brief. ── */
function familyGuideObsidianGroupHtml(guide){
  const g = guide.obsidianGroup;
  if(!g) return '';
  const paras = (g.paragraphs||[]).map(p=>`<p class="fg-prose">${escapeAttr(p)}</p>`).join('');
  return `<section class="fg-section" id="fg-obsidian-group">
    <h2 class="fg-h2">${escapeAttr(g.title||'Obsidian Is Glass, Not Crystal')}</h2>
    ${g.intro?`<p class="fg-section-intro">${escapeAttr(g.intro)}</p>`:''}
    <div class="fg-prose-block">${paras}</div>
    <div class="fg-card-grid fg-card-grid--2">${fgCaptionCardsHtml(g.compare)}</div>
    ${g.closingLine?`<p class="fg-note-center">${escapeAttr(g.closingLine)}</p>`:''}
  </section>`;
}

/* ── 3. What the Lava Preserves — the dominant visual section: a
   four-stage formation sequence (reuses .fg-progression, same component
   as Garnet's/Tourmaline's stage sequences), a compact four-item "what
   creates what" comparison, and one caution line. No standalone sections
   for sheen, rainbow color, Mahogany, or Snowflake, per the brief. ── */
function familyGuideLavaPreservesHtml(guide){
  const l = guide.lavaPreserves;
  if(!l) return '';
  const stages = (l.stages||[]).map((st,i)=>`<div class="fg-progression-stage">
    <div class="fg-progression-media"><div class="fg-stonecard-noimg fg-stonecard-noimg--labeled"><span>Photo pending</span></div></div>
    <div class="fg-progression-number">${i+1}</div>
    <div class="fg-progression-body">
      <div class="fg-progression-title">${escapeAttr(st.title||'')}</div>
      <p class="fg-progression-text">${escapeAttr(st.body||'')}</p>
    </div>
  </div>`).join('');
  return `<section class="fg-section" id="fg-lava-preserves">
    <h2 class="fg-h2">${escapeAttr(l.title||'What the Lava Preserves')}</h2>
    ${l.intro?`<p class="fg-section-intro">${escapeAttr(l.intro)}</p>`:''}
    <div class="fg-progression">${stages}</div>
    <div class="fg-card-grid fg-card-grid--4">${fgCaptionCardsHtml(l.comparison)}</div>
    ${l.cautionNote?`<p class="fg-note-center">${escapeAttr(l.cautionNote)}</p>`:''}
  </section>`;
}

/* ── 4. How Obsidian Appears — a four-stage sequence (reuses
   .fg-progression again), a compact recognition list (reuses .fg-list via
   fgList, same pattern as Garnet's recognitionItems), and one short
   historical note. ── */
function familyGuideObsidianAppearanceHtml(guide){
  const a = guide.obsidianAppearance;
  if(!a) return '';
  const stages = (a.stages||[]).map((st,i)=>`<div class="fg-progression-stage">
    <div class="fg-progression-media"><div class="fg-stonecard-noimg fg-stonecard-noimg--labeled"><span>Photo pending</span></div></div>
    <div class="fg-progression-number">${i+1}</div>
    <div class="fg-progression-body">
      <div class="fg-progression-title">${escapeAttr(st.title||'')}</div>
      <p class="fg-progression-text">${escapeAttr(st.body||'')}</p>
    </div>
  </div>`).join('');
  const recognitionItems = fgList(a.recognitionItems||[], 'fg-garnet-plain-list');
  return `<section class="fg-section" id="fg-obsidian-appearance">
    <h2 class="fg-h2">${escapeAttr(a.title||'How Obsidian Appears')}</h2>
    ${a.intro?`<p class="fg-section-intro">${escapeAttr(a.intro)}</p>`:''}
    <div class="fg-progression">${stages}</div>
    <div class="fg-garnet-plain-list-wrap">${recognitionItems}</div>
    ${a.historicalNote?`<p class="fg-note-center">${escapeAttr(a.historicalNote)}</p>`:''}
  </section>`;
}

/* ── 5. Obsidian in Your Collection — a simple compact list only (revised
   2026-07-23 per Christie's correction: no catalog-link pills, no repeat
   of the six-card roster gallery from Section 1, no new component —
   reuses the same .fg-list/.fg-garnet-plain-list treatment as every
   other guide's compact list). ── */
function familyGuideObsidianCollectionHtml(guide){
  const c = guide.obsidianCollection;
  if(!c) return '';
  const listItems = fgList(c.listItems||[], 'fg-garnet-plain-list');
  return `<section class="fg-section" id="fg-obsidian-collection">
    <h2 class="fg-h2">${escapeAttr(c.title||'Obsidian in Your Collection')}</h2>
    ${c.intro?`<p class="fg-section-intro">${escapeAttr(c.intro)}</p>`:''}
    <div class="fg-garnet-plain-list-wrap">${listItems}</div>
  </section>`;
}

/* ── Obsidian guide assembly — its own approved section order. Purely
   additive: nothing here changes any other guide's assembly, data, or
   rendered output. ── */
function familyGuideObsidianHtml(guide){
  return `
  <div class="fg-guide" data-family-slug="${escapeAttr(guide.slug)}">
    ${familyGuideHeroHtml(guide)}
    ${familyGuideMeetObsidianFamilyHtml(guide)}
    ${familyGuideObsidianGroupHtml(guide)}
    ${familyGuideLavaPreservesHtml(guide)}
    ${familyGuideObsidianAppearanceHtml(guide)}
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
   overlap with Quartz's); every other guide (currently: Quartz) uses the
   generic assembly above. */
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
