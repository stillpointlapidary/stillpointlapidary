/*
 * Beyond the Basics — centralized article registry.
 *
 * Single operational source for the landing page: featured mosaic, All
 * Articles archive, search, category filtering, and the Mystery Drawer.
 *
 * Per Christie's 2026-07-27 correction pass: this landing-page registry
 * uses the approved mockup's display copy (titles, categories, numbering)
 * for both the featured mosaic and the All Articles archive. That copy is
 * an approved landing-page presentation layer and is allowed to differ
 * from the long-term 76-article production roster (Beyond the Basics/
 * Canonical Articles/Still-Point-Lapidary-Beyond-the-Basics-Master-
 * Production-Order.docx) — reconciling the two belongs to a later
 * editorial phase, once individual article HTML pages are built. Nothing
 * here edits canonical article Markdown, front matter, or the production
 * plan.
 *
 * Verified, live HTML routes today: Article 1 (Why Some Crystals Glow),
 * Article 2 (What's Inside a Crystal?), Article 3 (How Crystals Form),
 * Article 4 (Mohs Hardness Is Not the Whole Story), and Article 13 (the
 * fossils article). Those are the only clickable cards anywhere on the page.
 */
(function (global) {
  'use strict';

  var IMG_BASE = 'https://vxujlgyhgnihnqrxzefw.supabase.co/storage/v1/object/public/stone-images/beyond-the-basics/';
  var ENC_BASE = 'https://vxujlgyhgnihnqrxzefw.supabase.co/storage/v1/object/public/stone-images/encyclopedia/';

  var IMG_01 = IMG_BASE + 'article-01-tile-image.webp';
  var IMG_02 = IMG_BASE + 'article-02-tile-image.webp';
  var IMG_03 = IMG_BASE + 'article-03-tile-image.webp';
  var IMG_04 = IMG_BASE + 'article-04-tile-image.webp';
  var IMG_05 = IMG_BASE + 'article-05-tile-image.webp';
  var IMG_06 = IMG_BASE + 'article-06-tile-image.webp';

  var ALT_01 = 'A glowing purple and orange mineral cluster photographed under ultraviolet light.';
  var ALT_02 = 'Blue kyanite blades emerging from a matrix of host rock.';
  var ALT_03 = 'A dendritic opal egg showing dark, branching mineral inclusions.';
  var ALT_04 = 'A rough diamond crystal with a pointed scribe testing its surface.';
  var ALT_05 = 'A cluster of pink rhodochrosite crystals.';
  var ALT_06 = 'A polished labradorite stone catching blue and gold light on a soft cloth.';

  var BTB_ARTICLES = [

    // ── Featured mosaic (approved mockup copy, exact) ──────────────────────
    {
      // Mirrors archive-01: this article is live, the featured mosaic's
      // copy of it was simply never wired to available/route.
      id: 'featured-01', showIn: ['featured'], featuredPosition: 1,
      number: '01', category: 'Phenomena',
      title: 'Why Some\nCrystals Glow',
      description: ['Fluorescence, phosphorescence,', 'and what ultraviolet light reveals.'],
      image: IMG_01, alt: ALT_01, slug: null,
      route: 'beyond-the-basics/why-some-crystals-glow.html', available: true
    },
    {
      id: 'featured-02', showIn: ['featured'], featuredPosition: 2,
      number: '02', category: 'Formation',
      title: 'Born Under Pressure',
      description: 'How minerals respond to the forces that shape them.',
      image: IMG_02, alt: ALT_02, slug: null, route: null, available: false
    },
    {
      // Mirrors archive-03's production-order reconciliation: supersedes
      // the stale "What an Inclusion Remembers" mockup identity here too.
      id: 'featured-03', showIn: ['featured'], featuredPosition: 3,
      number: '03', category: 'Formation',
      title: 'How Crystals Form',
      description: 'Why crystals can look so different.',
      // No approved tile image exists for this identity (see archive-03).
      image: null, alt: '', slug: 'how-crystals-form',
      route: 'beyond-the-basics/how-crystals-form.html', available: true
    },
    {
      // Mirrors archive-04's production-order reconciliation: supersedes
      // the stale "The Truth About Mohs Hardness" mockup identity here too.
      id: 'featured-04', showIn: ['featured'], featuredPosition: 4,
      number: '04', category: 'Care',
      title: 'Mohs Hardness Is Not the Whole Story',
      description: 'What scratch resistance can tell you, and what it cannot.',
      // No approved tile image exists for this identity (see archive-04).
      image: null, alt: '', slug: 'mohs-hardness-is-not-the-whole-story',
      route: 'beyond-the-basics/mohs-hardness-is-not-the-whole-story.html', available: true
    },
    {
      id: 'featured-05', showIn: ['featured'], featuredPosition: 5,
      number: '05', category: 'Identity & Names',
      title: 'Names the Mineral Trade Invented',
      description: 'A guide to common names, market labels, and myths.',
      image: IMG_05, alt: ALT_05, slug: null, route: null, available: false
    },
    {
      id: 'featured-06', showIn: ['featured'], featuredPosition: 6,
      number: '06', category: 'Practice',
      title: 'Seven Ways to Sit With a Stone',
      description: 'Simple practices to build a real relationship.',
      image: IMG_06, alt: ALT_06, slug: null, route: null, available: false
    },

    // ── All Articles archive (approved mockup order, exact) ────────────────
    // Articles 01-06 mirror the featured mosaic and reuse the same approved
    // tile art intentionally (not a placeholder substitution).
    {
      id: 'archive-01', showIn: ['archive'], archivePosition: 1,
      number: '01', category: 'Phenomena',
      title: 'Why Some Crystals Glow',
      description: ['Fluorescence, phosphorescence,', 'and what ultraviolet light reveals.'],
      image: IMG_01, alt: ALT_01, slug: null,
      route: 'beyond-the-basics/why-some-crystals-glow.html', available: true
    },
    {
      id: 'archive-02', showIn: ['archive'], archivePosition: 2,
      number: '02', category: 'Formation',
      title: 'Born Under Pressure',
      description: 'How minerals respond to the forces that shape them.',
      image: IMG_02, alt: ALT_02, slug: null, route: null, available: false
    },
    {
      // Per Christie's production-order reconciliation (this implementation
      // phase): the Master Production Order now controls Article 3 identity
      // and supersedes the 2026-07-27 mockup-numbering placeholder that
      // previously occupied this slot ("What an Inclusion Remembers").
      id: 'archive-03', showIn: ['archive'], archivePosition: 3,
      number: '03', category: 'Formation',
      title: 'How Crystals Form',
      description: 'Why crystals can look so different.',
      // No approved tile image exists for this canonical identity: IMG_03/
      // ALT_03 are the retired "What an Inclusion Remembers" dendritic-opal
      // photo (article-03-tile-image.webp) and would misrepresent this
      // article. Left unset until Christie supplies an approved Article 3
      // tile image rather than authoring a substitute.
      image: null, alt: '', slug: 'how-crystals-form',
      route: 'beyond-the-basics/how-crystals-form.html', available: true
    },
    {
      // Per Christie's production-order reconciliation (same resolution as
      // Article 3): the Master Production Order now controls Article 4
      // identity and supersedes the 2026-07-27 mockup-numbering placeholder
      // that previously occupied this slot ("The Truth About Mohs Hardness").
      id: 'archive-04', showIn: ['archive'], archivePosition: 4,
      number: '04', category: 'Care',
      title: 'Mohs Hardness Is Not the Whole Story',
      description: 'What scratch resistance can tell you, and what it cannot.',
      // No approved tile image exists for this canonical identity: IMG_04/
      // ALT_04 are the retired "The Truth About Mohs Hardness" mockup photo
      // (a diamond with a scribe) and would misrepresent this article. Left
      // unset until Christie supplies an approved Article 4 tile image.
      image: null, alt: '', slug: 'mohs-hardness-is-not-the-whole-story',
      route: 'beyond-the-basics/mohs-hardness-is-not-the-whole-story.html', available: true
    },
    {
      id: 'archive-05', showIn: ['archive'], archivePosition: 5,
      number: '05', category: 'Identity & Names',
      title: 'Names the Mineral Trade Invented',
      description: 'A guide to common names, market labels, and myths.',
      image: IMG_05, alt: ALT_05, slug: null, route: null, available: false
    },
    {
      id: 'archive-06', showIn: ['archive'], archivePosition: 6,
      number: '06', category: 'Practice',
      title: 'Seven Ways to Sit With a Stone',
      description: 'Simple practices to build a real relationship.',
      image: IMG_06, alt: ALT_06, slug: null, route: null, available: false
    },
    {
      id: 'archive-07', showIn: ['archive'], archivePosition: 7,
      number: '07', category: 'Care',
      title: 'Sunlight, Heat, and Moisture',
      description: 'How light, warmth, and humidity affect stones on display.',
      image: null, alt: '', slug: null, route: null, available: false
    },
    {
      id: 'archive-08', showIn: ['archive'], archivePosition: 8,
      number: '08', category: 'Practice',
      title: 'A 60-Second Reset With a Stone',
      description: 'A brief, repeatable practice for coming back to the present.',
      image: null, alt: '', slug: null, route: null, available: false
    },
    {
      id: 'archive-09', showIn: ['archive'], archivePosition: 9,
      number: '09', category: 'Perspectives',
      title: 'Can Science and Crystal Tradition Coexist?',
      description: 'How evidence, tradition, and personal experience can sit side by side.',
      image: null, alt: '', slug: null, route: null, available: false
    },
    {
      // Production HTML exists (Website/beyond-the-basics/whats-inside-a-crystal.html)
      // and is now wired live; not a broader renumbering, only the route/
      // availability fields required to resolve this completed article.
      id: 'archive-10', showIn: ['archive'], archivePosition: 10,
      number: '10', category: 'Materials',
      title: 'What’s Inside a Crystal?',
      description: 'Inclusions, phantoms, and the story a crystal’s interior can tell.',
      image: null, alt: '', slug: 'whats-inside-a-crystal',
      route: 'beyond-the-basics/whats-inside-a-crystal.html', available: true
    },
    {
      id: 'archive-11', showIn: ['archive'], archivePosition: 11,
      number: '11', category: 'Phenomena',
      title: 'Why Some Crystals Glow Blue, Red, or Green',
      description: 'How different minerals and impurities produce different glow colors.',
      image: null, alt: '', slug: null, route: null, available: false
    },
    {
      id: 'archive-12', showIn: ['archive'], archivePosition: 12,
      number: '12', category: 'Practice',
      title: 'What If You Don’t Feel Anything?',
      description: 'Why a quiet response to a stone is not a failure.',
      image: null, alt: '', slug: null, route: null, available: false
    },
    {
      id: 'archive-13', showIn: ['archive'], archivePosition: 13,
      number: '13', category: 'Materials',
      title: 'Fossils in a Crystal Collection: What Are You Actually Holding?',
      description: 'A fossil carries two histories at once: the life that once existed and the geological change that allowed some part of it to remain.',
      image: ENC_BASE + 'orthoceras.webp',
      alt: 'Polished Orthoceras fossil specimen.',
      slug: 'fossils-in-a-crystal-collection-what-are-you-actually-holding',
      route: 'beyond-the-basics/fossils-in-a-crystal-collection-what-are-you-actually-holding.html',
      available: true
    }
  ];

  var MYSTERY_DRAWER = {
    heading: 'Open a Mystery Drawer',
    description: 'Discover a random article from the collection.',
    image: IMG_BASE + 'mystery-drawer-card.webp',
    alt: 'An illustrated wooden specimen drawer with a brass label plate and pull.'
  };

  var TOP_CATEGORIES = ['All', 'Perspectives', 'Practice', 'Phenomena', 'Formation', 'Collecting', 'Care'];

  function getArchiveArticles() {
    return BTB_ARTICLES.filter(function (a) { return a.showIn.indexOf('archive') !== -1; })
      .sort(function (a, b) { return a.archivePosition - b.archivePosition; });
  }

  function getFeaturedArticles() {
    return BTB_ARTICLES.filter(function (a) { return a.showIn.indexOf('featured') !== -1; })
      .sort(function (a, b) { return a.featuredPosition - b.featuredPosition; });
  }

  function getEligibleMysteryArticles() {
    // Mystery Drawer must only ever select articles with a verified, live route.
    return getArchiveArticles().filter(function (a) { return a.available && a.route; });
  }

  global.BTB_DATA = {
    articles: BTB_ARTICLES,
    mysteryDrawer: MYSTERY_DRAWER,
    topCategories: TOP_CATEGORIES,
    getArchiveArticles: getArchiveArticles,
    getFeaturedArticles: getFeaturedArticles,
    getEligibleMysteryArticles: getEligibleMysteryArticles
  };

})(window);
