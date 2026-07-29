/* Beyond the Basics — landing page interactions.
   Renders the featured mosaic and All Articles archive from BTB_DATA
   (beyond-the-basics-data.js), and wires search + category filtering
   and the Mystery Drawer. */
(function () {
  'use strict';

  if (!window.BTB_DATA) return;
  var DATA = window.BTB_DATA;

  function el(tag, attrs, children) {
    var node = document.createElement(tag);
    attrs = attrs || {};
    Object.keys(attrs).forEach(function (k) {
      if (attrs[k] == null) return;
      if (k === 'class') node.className = attrs[k];
      else if (k === 'text') node.textContent = attrs[k];
      else node.setAttribute(k, attrs[k]);
    });
    (children || []).forEach(function (c) { if (c) node.appendChild(c); });
    return node;
  }

  // Description fields may be a plain string or an array of lines that
  // must render as real line breaks (not string concatenation with "\n",
  // which textContent collapses). Array form renders each line as a text
  // node joined by actual <br> elements — same technique already used for
  // the Mystery Drawer heading/desc below.
  function buildMultilineEl(tag, className, value) {
    var node = document.createElement(tag);
    node.className = className;
    var lines = Array.isArray(value) ? value : [value];
    lines.forEach(function (line, i) {
      if (i > 0) node.appendChild(document.createElement('br'));
      node.appendChild(document.createTextNode(line));
    });
    return node;
  }

  function descriptionText(article) {
    return Array.isArray(article.description) ? article.description.join(' ') : (article.description || '');
  }

  function categoryLabel(article) {
    return article.categoryDisplay || article.category;
  }

  // ── Card builders ────────────────────────────────────────────────────

  function buildCardMedia(article) {
    var media = el('div', { class: 'btbl-card-media' });
    if (article.image) {
      media.appendChild(el('img', {
        src: article.image,
        alt: article.alt || '',
        loading: 'lazy'
      }));
    }
    return media;
  }

  function buildCardBody(article, opts) {
    opts = opts || {};
    var eyebrow = el('div', { class: 'btbl-card-eyebrow' }, [
      el('span', { class: 'btbl-card-number', text: article.number }),
      el('span', { 'aria-hidden': 'true', text: '·' }),
      el('span', { text: categoryLabel(article) })
    ]);
    var title = el(opts.headingTag || 'h3', { class: 'btbl-card-title', text: article.title });
    var desc = buildMultilineEl('p', 'btbl-card-desc', article.description);

    var body = el('div', { class: 'btbl-card-body' }, [eyebrow, title, desc]);

    if (article.available && opts.showCta) {
      body.appendChild(el('span', { class: 'btbl-card-cta' }, [
        document.createTextNode('Read Article →')
      ]));
    } else if (!article.available) {
      // Unavailability is communicated to assistive tech only — the visible
      // card stays clean, matching the approved mockup (no "coming soon"
      // copy, no badge). The card's own aria-label also states this.
      body.appendChild(el('span', { class: 'sr-only', text: '(Article page coming soon)' }));
    }

    return body;
  }

  function buildCard(article, opts) {
    opts = opts || {};
    var classes = 'btbl-card' + (opts.extraClass ? ' ' + opts.extraClass : '') + (article.available ? '' : ' is-unavailable');
    var node;

    if (article.available && article.route) {
      node = el('a', {
        class: classes,
        href: article.route,
        'aria-label': article.title + ' — ' + categoryLabel(article)
      });
    } else {
      // Non-clickable: plain container, default cursor, not a link, not
      // focusable via Tab (so it never creates a misleading keyboard stop).
      node = el('div', {
        class: classes,
        'aria-label': article.title + ' — article page coming soon'
      });
    }

    node.appendChild(buildCardMedia(article));
    node.appendChild(buildCardBody(article, opts));
    return node;
  }

  // ── Featured mosaic — full-bleed image tiles with overlaid text ────────
  // Distinct from buildCard()/the archive grid below: one unbroken image
  // per tile, live-HTML copy overlaid on top, no separate caption body.

  function buildFeaturedTile(article, opts) {
    opts = opts || {};
    var tone = opts.tone || 'pale';
    var classes = 'btbl-tile btbl-tile--' + tone + (opts.articleClass ? ' ' + opts.articleClass : '');
    var node;

    if (article.available && article.route) {
      node = el('a', {
        class: classes,
        href: article.route,
        'aria-label': article.title + ' — ' + categoryLabel(article)
      });
    } else {
      node = el('div', {
        class: classes,
        'aria-label': article.title + ' — article page coming soon'
      });
    }

    if (article.image) {
      node.appendChild(el('img', {
        class: 'btbl-tile-media',
        src: article.image,
        alt: article.alt || '',
        loading: 'lazy'
      }));
    }
    node.appendChild(el('div', { class: 'btbl-tile-scrim', 'aria-hidden': 'true' }));

    var eyebrow = el('div', { class: 'btbl-tile-eyebrow' }, [
      el('span', { class: 'btbl-tile-number', text: article.number }),
      el('span', { 'aria-hidden': 'true', text: '·' }),
      el('span', { text: categoryLabel(article) })
    ]);
    var title = el(opts.headingTag || 'h3', { class: 'btbl-tile-title', text: article.title });
    var desc = buildMultilineEl('p', 'btbl-tile-desc', article.description);
    var body = el('div', { class: 'btbl-tile-body' }, [eyebrow, title, desc]);

    if (article.available && opts.showCta) {
      body.appendChild(el('span', { class: 'btbl-tile-cta' }, [
        document.createTextNode('Read Article →')
      ]));
    } else if (!article.available) {
      body.appendChild(el('span', { class: 'sr-only', text: '(Article page coming soon)' }));
    }

    node.appendChild(body);
    return node;
  }

  function renderMosaic() {
    var featured = DATA.getFeaturedArticles();
    if (featured.length < 6) return;

    var row1 = document.getElementById('btbl-row-1');
    var row2 = document.getElementById('btbl-row-2');
    var row3 = document.getElementById('btbl-row-3');
    if (!row1 || !row2 || !row3) return;

    row1.appendChild(buildFeaturedTile(featured[0], { tone: 'dark', showCta: true, headingTag: 'h2', articleClass: 'btbl-tile--article-01' }));
    row1.appendChild(buildFeaturedTile(featured[1], { tone: 'pale', showCta: true, headingTag: 'h2', articleClass: 'btbl-tile--article-02' }));

    row2.appendChild(buildFeaturedTile(featured[2], { tone: 'pale', showCta: true, articleClass: 'btbl-tile--article-03' }));
    row2.appendChild(buildFeaturedTile(featured[3], { tone: 'pale', showCta: true, articleClass: 'btbl-tile--article-04' }));
    row2.appendChild(buildFeaturedTile(featured[4], { tone: 'pale', showCta: true, articleClass: 'btbl-tile--article-05' }));

    row3.appendChild(buildFeaturedTile(featured[5], { tone: 'pale', showCta: true, articleClass: 'btbl-tile--article-06' }));
    row3.appendChild(buildMysteryDrawerTile());
  }

  // ── Mystery Drawer — one full dark image tile; the whole tile is the
  // interactive control (a real <button>). ──────────────────────────────

  function buildMysteryDrawerTile() {
    var d = DATA.mysteryDrawer;
    var btn = el('button', {
      type: 'button',
      class: 'btbl-tile btbl-tile--dark btbl-tile--drawer',
      id: 'btbl-mystery-btn',
      'aria-label': 'Open a mystery drawer to read a random Beyond the Basics article'
    });

    btn.appendChild(el('img', { class: 'btbl-tile-media', src: d.image, alt: d.alt || '', loading: 'lazy' }));
    btn.appendChild(el('div', { class: 'btbl-tile-scrim', 'aria-hidden': 'true' }));

    var heading = el('span', { class: 'btbl-drawer-heading' }, [
      document.createTextNode('Open a'),
      el('br'),
      document.createTextNode('Mystery Drawer')
    ]);
    var arrow = el('span', { class: 'btbl-drawer-arrow', 'aria-hidden': 'true', text: '→' });
    var desc = el('span', { class: 'btbl-drawer-desc' }, [
      document.createTextNode('Discover a random article'),
      el('br'),
      document.createTextNode('from the collection '),
      arrow
    ]);

    btn.appendChild(el('span', { class: 'btbl-tile-body' }, [heading, desc]));

    btn.addEventListener('click', openMysteryDrawer);

    return btn;
  }

  function openMysteryDrawer() {
    var eligible = DATA.getEligibleMysteryArticles();
    if (!eligible.length) return; // no live articles yet — do nothing rather than a dead link
    var pick = eligible[Math.floor(Math.random() * eligible.length)];
    window.location.href = pick.route;
  }

  // ── Archive: search + category filter + grid ───────────────────────

  var activeCategory = 'All';
  var searchTerm = '';

  function matchesFilters(article) {
    var categoryOk = activeCategory === 'All' || article.category === activeCategory;
    if (!categoryOk) return false;
    if (!searchTerm) return true;
    var haystack = (article.title + ' ' + categoryLabel(article) + ' ' + descriptionText(article)).toLowerCase();
    return haystack.indexOf(searchTerm) !== -1;
  }

  function renderArchiveGrid() {
    var grid = document.getElementById('btbl-archive-grid');
    if (!grid) return;
    grid.innerHTML = '';

    var all = DATA.getArchiveArticles();
    var visible = all.filter(matchesFilters);

    if (!visible.length) {
      grid.appendChild(el('div', { class: 'btbl-archive-empty', text: 'No articles match your search.' }));
      return;
    }

    visible.forEach(function (article) {
      grid.appendChild(buildCard(article, { showCta: false }));
    });
  }

  function renderCountLine() {
    var lineEl = document.getElementById('btbl-count-line-text');
    if (!lineEl) return;
    var count = DATA.getArchiveArticles().length;
    lineEl.textContent = count + ' ARTICLES AND GROWING — NEW INSIGHTS ADDED REGULARLY.';
  }

  function buildTopPills() {
    var wrap = document.getElementById('btbl-top-pills');
    if (!wrap) return;
    DATA.topCategories.forEach(function (cat) {
      var pressed = cat === activeCategory;
      var pill = el('button', {
        type: 'button',
        class: 'btbl-pill',
        'aria-pressed': pressed ? 'true' : 'false',
        text: cat
      });
      pill.addEventListener('click', function () { setActiveCategory(cat); });
      wrap.appendChild(pill);
    });
  }

  function buildArchivePills() {
    var wrap = document.getElementById('btbl-archive-pills');
    if (!wrap) return;
    DATA.topCategories.forEach(function (cat) {
      var pressed = cat === activeCategory;
      var pill = el('button', {
        type: 'button',
        class: 'btbl-pill',
        'aria-pressed': pressed ? 'true' : 'false',
        text: cat
      });
      pill.addEventListener('click', function () { setActiveCategory(cat); });
      wrap.appendChild(pill);
    });
  }

  function setActiveCategory(cat) {
    activeCategory = cat;
    document.querySelectorAll('#btbl-top-pills .btbl-pill, #btbl-archive-pills .btbl-pill').forEach(function (btn) {
      btn.setAttribute('aria-pressed', btn.textContent === cat ? 'true' : 'false');
    });
    renderArchiveGrid();
  }

  function wireSearch() {
    var input = document.getElementById('btbl-search-input');
    if (!input) return;
    input.addEventListener('input', function () {
      searchTerm = input.value.trim().toLowerCase();
      renderArchiveGrid();
    });
  }

  // ── Init ─────────────────────────────────────────────────────────────

  document.addEventListener('DOMContentLoaded', function () {
    renderMosaic();
    buildTopPills();
    buildArchivePills();
    wireSearch();
    renderArchiveGrid();
    renderCountLine();
  });

})();
