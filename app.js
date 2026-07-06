/* ── Main App JS (from lines 1949–6252) ── */
let CRYSTALS = [];  // populated async from Supabase
const RESULT_BATCH_SIZE = 30;
let MOOD_THEME_MAP={}, SUB_FILTERS={}, SUB_FILTER_KW={};
// ── STATE ──
let filters={fam:'all',theme:'all',color:'all',chakra:'all',mohs:'all',formation:'all',material:'all',tier:'all'};
let collFilters={cfam:'all',ctheme:'all',ccolor:'all',cchakra:'all',cmohs:'all',cformation:'all',cmaterial:'all',form:'all',size:'all',cshelf:'all'};
let collQuickFilter='all';
let collActiveFamilyName=null; // 'all' | 'wish'
let _collTierNum=null;
let sortBy='tier';

function _emptyCollHtml(){
  if(!_currentUser){
    return `<div class="empty-coll-state">
      <div class="empty-coll-icon">◇</div>
      <div class="empty-coll-title">Your collection starts here</div>
      <div class="empty-coll-text">Track the stones you own, build a wishlist, and watch your progress across collector tiers — all saved to your account and available on any device.</div>
      <button class="empty-coll-btn btn-accent" onclick="window._pendingColl=true;_openAuth('collection')">Start Your Collection</button>
    </div>`;
  }
  return `<div class="empty-coll-state">
    <div class="empty-coll-icon">◇</div>
    <div class="empty-coll-title">Your collection is empty</div>
    <div class="empty-coll-text">Add stones you own to track your collection across all your devices.</div>
    <button class="empty-coll-btn" onclick="switchTabByName('encyclopedia')">Explore the Encyclopedia</button>
  </div>`;
}
function _emptyWishHtml(){
  return `<div class="empty-coll-state">
    <div class="empty-coll-icon">♡</div>
    <div class="empty-coll-title">Your wishlist is empty</div>
    <div class="empty-coll-text">Open any stone in the encyclopedia and tap ♡ Add to wishlist to save it here.</div>
    <button class="empty-coll-btn" onclick="switchTabByName('encyclopedia')">Explore the Encyclopedia</button>
  </div>`;
}
let currentCrystal=null;
let openPanel=null;
let activeMoodIdx=null;
let activeSubFilter=null;
let activeIntentionMode=null;
let activeIntentionQuery='';
let activeIntentionGroup=null;
let activeIntentionFilter='all';
let activeIntentionFilterDefs=[];
let activeIntentionBaseMatches=[];
let activeIntentionMatches=[];
let activeIntentionVisibleCount=10;
let activeIntentionScoreMap={};
let intentionIncludeTier4=false;
let curatedIntentionIndex={};
let activeCuratedSlug=null;
let collection=[]; // Supabase-backed; do not seed from legacy browser cache.
let _currentUser=null;
let addPieceReturnContext=null;
let desktopSotdStone=null;
let editingCollectionIndex=null;
let owned={}; // Supabase-backed; do not seed from legacy browser cache.
let wish={}; // Supabase-backed; do not seed from legacy browser cache.
let pendingPhotos=[];
let existingEditPhotos=[];
let editPrimaryPhotoKey=null;
let currentCollDetailIdx=null;
let collDetailReturnFamily=null;
let detailReturnContext=null;
let batchEntries=[];
let customEntries=JSON.parse(localStorage.getItem('lap_enc_custom')||'[]');

// ── SPECIES FAMILIES ──
const SP_FAM={
  'Aragonite':['C-0001','C-0002','C-0003','C-0004','C-0005'],
  'Calcite':['C-0007','C-0009','C-0010','C-0011','C-0012','C-0013','C-0014','C-0015','C-0016','C-0017','C-0018'],
  'Fluorite':['C-0031','C-0032','C-0033','C-0034','C-0035','C-0036'],
  'Kyanite':['C-0063','C-0064','C-0065','C-0066','C-0067','C-0068'],
  'Beryl':['C-0021','C-0022','C-0023','C-0024'],
  'Plagioclase':['C-0028','C-0029','C-0030'],
  'Antigorite':['C-0049','C-0050','C-0051'],
  'Elbaite':['C-0055','C-0056','C-0057','C-0058'],
  'Apatite':['C-0044','C-0045','C-0046'],
  'Gypsum':['C-0173','C-0174','C-0175'],
};

const FAM_OPTS=['Aggregate','Apatite','Aragonite','Beryl','Calcite','Copper Minerals','Feldspar','Fluorite','Fossil Material','Garnet','Gypsum','Iron Minerals','Kyanite','Obsidian','Opal','Organic Material','Quartz','Serpentine','Silicates','Synthetic Material','Tourmaline'];
const THEME_OPTS=['Grounding','Protection','Heart Healing','Emotional Regulation','Calm & Peace','Self-Love','Joy','Clarity & Focus','Communication','Intuition','Spiritual Connection','Vitality','Amplification','Transformation','Manifestation','Confidence'];
const THEME_GROUPS=[
  {label:'Grounded & Protected', themes:['Grounding','Protection']},
  {label:'Heart & Emotions',     themes:['Heart Healing','Emotional Regulation','Calm & Peace','Self-Love','Joy']},
  {label:'Mind & Spirit',        themes:['Clarity & Focus','Communication','Intuition','Spiritual Connection']},
  {label:'Energy & Change',      themes:['Vitality','Amplification','Transformation','Manifestation','Confidence']},
];
const COLOR_OPTS=[
  {val:'Red',hex:'#b04a4a'},{val:'Orange',hex:'#d4783a'},{val:'Yellow',hex:'#c9a832'},
  {val:'Green',hex:'#4a8a5a'},{val:'Pink',hex:'#d4839a'},{val:'Blue',hex:'#5a8ab0'},
  {val:'Purple',hex:'#7a5a9a'},{val:'White',hex:'#ddd8d0'},{val:'Black',hex:'#3a3530'},
  {val:'Brown',hex:'#8b6f47'},{val:'Gray',hex:'#8a8a8a'},{val:'Multi',hex:'#9a8a7a'},
];
const CHAKRA_OPTS=['Root','Sacral','Solar Plexus','Heart','Throat','Third Eye','Crown','Earth Star','All'];
const MOOD_DATA=[
  {group:'Grounding',label:'I feel overwhelmed or overstimulated',sub:'Nervous system · Slowing down · Finding quiet'},
  {group:'Grounding',label:'I feel scattered or anxious',sub:'Grounding · Anchoring · Coming back to earth'},
  {group:'Grounding',label:'I feel stuck and cannot move forward',sub:'Inertia · Resistance · Stagnation'},
  {group:'Grounding',label:'I need better sleep',sub:'Rest · Calming the mind · Night support'},
  {group:'Grounding',label:'I need protection',sub:'Energetic shielding · Boundary holding'},
  {group:'Grounding',label:'I need stability through change',sub:'Steadiness · Structure · Support'},
  {group:'Heart',label:'I am grieving a loss',sub:'Grief · Comfort · Gentle healing · Acceptance'},
  {group:'Heart',label:'I need calm and peace',sub:'Anxiety relief · Nervous system · Soothing'},
  {group:'Heart',label:'I need to release anger or frustration',sub:'Emotional release · Letting go · Processing'},
  {group:'Heart',label:'My heart needs healing',sub:'Grief · Heartbreak · Forgiveness'},
  {group:'Heart',label:'I want joy and creative energy',sub:'Happiness · Optimism · Creative spark'},
  {group:'Heart',label:'I want more self-compassion',sub:'Self-love · Inner kindness · Self-worth'},
  {group:'Heart',label:'I want to improve a relationship',sub:'Connection · Empathy · Communication · Trust'},
  {group:'Mind',label:'I need mental clarity',sub:'Focus · Decision-making · Clear thinking'},
  {group:'Mind',label:'I need motivation and energy',sub:'Vitality · Drive · Getting unstuck · Forward motion'},
  {group:'Mind',label:'I need to communicate better',sub:'Speaking truth · Being heard · Expression'},
  {group:'Mind',label:'I want more confidence',sub:'Boldness · Action · Self-trust · Power'},
  {group:'Mind',label:'I want to attract something into my life',sub:'Manifestation · Abundance · Intention-setting'},
  {group:'Mind',label:'I want to manifest a goal',sub:'Intention · Abundance · Drawing things toward you'},
  {group:'Mind',label:'I want to set an intention',sub:'Ritual · Focused practice · Working with purpose · Beginning'},
  {group:'Mind',label:'I want to start something new',sub:'New beginnings · Fresh starts · Courage to begin'},
  {group:'Spirit',label:'I feel disconnected from my purpose',sub:'Clarity of path · Soul alignment · Meaning'},
  {group:'Spirit',label:'I want deeper intuition',sub:'Inner knowing · Psychic sensitivity · Dreams'},
  {group:'Spirit',label:'I want spiritual connection',sub:'Higher guidance · Meditation · Awareness'},
  {group:'Spirit',label:'I want to deepen my meditation',sub:'Stillness · Focus · Going inward'},
  {group:'Spirit',label:"I'm ready for transformation",sub:'Shadow work · Releasing patterns · Growth'},
  {group:'Body',label:'I am healing or recovering',sub:'Regeneration · Support · Gentle restoration'},
  {group:'Body',label:'I need more physical energy',sub:'Vitality · Stamina · Activation · Life force'},
  {group:'Body',label:'I want to clear stagnant energy',sub:'Purification · Renewal · Moving what is stuck'},
  {group:'Body',label:'I want to feel more present in my body',sub:'Embodiment · Grounding · Physical awareness'}
]
const MOOD_GROUPS=['All','Grounding','Heart','Mind','Spirit','Body'];

// Maps each intention card group to the all_themes values used in Supabase (fallback when intention_tags not present)
const INTENTION_THEME_MAP = {
  'Grounding': ['Grounding', 'Protection', 'Calm & Peace'],
  'Heart':     ['Heart Healing', 'Emotional Balance', 'Self-Love', 'Joy'],
  'Mind':      ['Clarity & Focus', 'Communication', 'Confidence'],
  'Spirit':    ['Intuition', 'Spiritual Connection', 'Transformation'],
  'Body':      ['Vitality', 'Amplification', 'Manifestation'],
};
const INTENTION_CARD_SUBS = {
  'Grounding': 'Presence, stability, inner calm',
  'Heart':     'Love, compassion, forgiveness',
  'Mind':      'Clarity, focus, motivation',
  'Spirit':    'Intuition, inner wisdom, spiritual awareness',
  'Body':      'Energy, resilience, vitality',
};
const INTENTION_SUB_FILTERS = {
  'Grounding': [
    {label:'Anxiety',        slug:'anxiety',        keywords:['anxiety','anxious','worry','overwhelm']},
    {label:'Stability',      slug:'stability',      themes:['Stability','Grounding'], keywords:['stable','stability','steady','steadiness']},
    {label:'Protection',     slug:'protection',     themes:['Protection'], keywords:['protect','shield','boundary']},
    {label:'Overthinking',   slug:'overthinking',   themes:['Clarity & Focus'], keywords:['overthink','racing mind','ruminate','mental clutter']},
    {label:'Nervous System', slug:'nervous-system', keywords:['nervous','sensitiv','soothe','settle']},
    {label:'Sleep',          slug:'sleep',          themes:['Calm & Peace'], keywords:['sleep','rest','night','insomnia']}
  ],
  'Heart': [
    {label:'Self-Love',        slug:'self-love',        themes:['Self-Love'], keywords:['self-love','self love','self-worth','self-compassion']},
    {label:'Grief',            slug:'grief',            themes:['Heart Healing'], keywords:['grief','grieving','loss','mourn']},
    {label:'Compassion',       slug:'compassion',       themes:['Heart Healing','Self-Love'], keywords:['compassion','kindness','empathy']},
    {label:'Forgiveness',      slug:'forgiveness',      themes:['Heart Healing'], keywords:['forgiv','release','let go']},
    {label:'Emotional Balance',slug:'emotional-balance',themes:['Emotional Balance','Emotional Regulation'], keywords:['emotional balance','emotional regulation','balance']},
    {label:'Relationships',    slug:'relationships',    themes:['Heart Healing','Communication'], keywords:['relationship','connection','trust','communication']},
    {label:'Inner Child',      slug:'inner-child',      themes:['Self-Love','Joy'], keywords:['inner child','nurtur','play','gentle']}
  ],
  'Mind': [
    {label:'Clarity',         slug:'clarity',          themes:['Clarity & Focus'], keywords:['clarity','clear','decision']},
    {label:'Focus',           slug:'focus',            themes:['Clarity & Focus'], keywords:['focus','study','concentrat']},
    {label:'Motivation',      slug:'motivation',       themes:['Vitality','Confidence'], keywords:['motivat','drive','momentum']},
    {label:'Confidence',      slug:'confidence',       themes:['Confidence'], keywords:['confidence','self-trust','power']},
    {label:'Communication',   slug:'communication',    themes:['Communication'], keywords:['communicat','speak','voice']},
    {label:'Decision Making', slug:'decision-making',  themes:['Clarity & Focus'], keywords:['decision','choice','direction']},
    {label:'Creativity',      slug:'creativity',       themes:['Joy','Confidence'], keywords:['creativ','artis','expression','imagination']}
  ],
  'Spirit': [
    {label:'Intuition',           slug:'intuition',           themes:['Intuition'], keywords:['intuition','inner knowing','psychic']},
    {label:'Meditation',          slug:'meditation',          themes:['Spiritual Connection','Calm & Peace'], keywords:['meditat','stillness','quiet']},
    {label:'Spiritual Connection',slug:'spiritual-connection',themes:['Spiritual Connection'], keywords:['spiritual','divine','guidance']},
    {label:'Transformation',      slug:'transformation',      themes:['Transformation'], keywords:['transform','shadow','rebirth']},
    {label:'Dream Work',          slug:'dream-work',          themes:['Intuition','Spiritual Connection'], keywords:['dream','vision']},
    {label:'Purpose',             slug:'purpose',             themes:['Clarity & Focus','Spiritual Connection'], keywords:['purpose','path','meaning']},
    {label:'Manifestation',       slug:'manifestation',       themes:['Manifestation'], keywords:['manifest','abundance','intention']}
  ],
  'Body': [
    {label:'Vitality',    slug:'vitality',    themes:['Vitality'], keywords:['vitality','life force','energ']},
    {label:'Energy',      slug:'energetic-lift',themes:['Vitality','Amplification'], keywords:['energy','activation','spark']},
    {label:'Recovery',    slug:'recovery',    themes:['Heart Healing','Vitality'], keywords:['recover','healing','restor']},
    {label:'Stamina',     slug:'stamina',     themes:['Vitality'], keywords:['stamina','endurance','sustain']},
    {label:'Clearing',    slug:'clearing',    themes:['Amplification','Transformation'], keywords:['clearing','cleanse','purif','stuck energy']},
    {label:'Embodiment',  slug:'embodiment',  themes:['Grounding'], keywords:['body','embodiment','somatic','presence']},
    {label:'Resilience',  slug:'resilience',  themes:['Vitality','Grounding'], keywords:['resilience','strength','support']}
  ]
};
// Maps group names to their intention_tags parent slug
const INTENTION_PARENT_SLUGS = {
  'Grounding':'grounding',
  'Heart':'heart-support',
  'Mind':'mental-clarity',
  'Spirit':'intuition',
  'Body':'body-energy',
};
// All 38 slugs with curated Supabase rows. If a recognized slug returns 0 rows,
// it signals a data/mapping error — never fall back to CRYSTALS filtering.
const CURATED_INTENTION_SLUGS = new Set([
  'grounding','heart-support','mental-clarity','intuition','body-energy',
  'anxiety','stability','protection','overthinking','nervous-system','sleep',
  'self-love','grief','compassion','forgiveness','emotional-balance','relationships','inner-child',
  'clarity','focus','motivation','confidence','communication','decision-making','creativity',
  'meditation','spiritual-connection','transformation','dream-work','purpose','manifestation',
  'vitality','energetic-lift','recovery','stamina','clearing','embodiment','resilience'
]);
const INTENTION_SHOWING_LABELS = {
  'Grounding':'Grounding',
  'Heart':'Heart support',
  'Mind':'Mental clarity',
  'Spirit':'Intuition',
  'Body':'Body',
};
const intentionLabelMap = {
  'grounding':'Grounding','heart-support':'Heart support','mental-clarity':'Mental clarity',
  'intuition':'Intuition','body-energy':'Body',
  'anxiety':'Anxiety','stability':'Stability','protection':'Protection','overthinking':'Overthinking',
  'nervous-system':'Nervous system','sleep':'Sleep',
  'self-love':'Self-Love','grief':'Grief','compassion':'Compassion','forgiveness':'Forgiveness',
  'emotional-balance':'Emotional balance','relationships':'Relationships','inner-child':'Inner child',
  'clarity':'Clarity','focus':'Focus','motivation':'Motivation','confidence':'Confidence',
  'communication':'Communication','decision-making':'Decision making','creativity':'Creativity',
  'meditation':'Meditation','spiritual-connection':'Spiritual connection','transformation':'Transformation',
  'dream-work':'Dream work','purpose':'Purpose','manifestation':'Manifestation',
  'vitality':'Vitality','energetic-lift':'Energy','recovery':'Recovery','stamina':'Stamina',
  'clearing':'Clearing','embodiment':'Embodiment','resilience':'Resilience',
};
function getIntentionLabel(slug){ return intentionLabelMap[slug] || slug; }
function intentionPageSize(){return window.innerWidth<=768?10:12;}


// ── IMAGE STORAGE FALLBACKS ──
// Claude's prior version referenced encyclopedia photo constants that were not present in this file.
// Without these guards, encRender() throws a ReferenceError after the Top 10 section and the full encyclopedia never draws.
const SUPABASE_ENC = 'https://vxujlgyhgnihnqrxzefw.supabase.co/storage/v1/object/public/stone-images/encyclopedia/';
const ENCYCLOPEDIA_PHOTOS = {
  "C-0001": ["aragonite-tumble.webp", "aragonite-palm.webp", "aragonite-tower.webp"],
  "C-0005": ["star-aragonite-specimen.webp"],
  "C-0006": ["azurite-heart.webp", "azurite-tower.webp", "azurite-pyramid.webp", "azurite-botryoidal.webp"],
  "C-0008": ["bumblebee-jasper-tumble.webp", "bumblebee-jasper-tumble-2.webp"],
  "C-0009": ["caribbean-calcite-large-sphere.webp", "caribbean-calcite-freeform.webp", "caribbean-calcite-tower.webp"],
  "C-0011": ["cobaltoan-calcite-specimen.webp", "cobaltoan-calcite-specimen-2.webp", "cobaltoan-calcite-tumble.webp"],
  "C-0012": ["green-calcite-mushroom.webp"],
  "C-0013": ["honey-calcite-raw.webp", "honey-calcite-sphere.webp"],
  "C-0014": ["mangano-calcite-tumble.webp"],
  "C-0018": ["zebra-calcite-specimen.webp"],
  "C-0020": ["malachite-tumble.webp", "malachite-slab.webp", "malachite-specimen.webp"],
  "C-0021": ["aquamarine-specimen.webp"],
  "C-0024": ["morganite-tumble-family.webp"],
  "C-0025": ["amazonite-slab.webp", "amazonite-tower.webp", "amazonite-heart.webp"],
  "C-0028": ["labradorite.webp", "labradorite-freeform.webp", "labradorite-raw.webp"],
  "C-0030": ["rainbow-moonstone-specimen.webp"],
  "C-0031": ["blue-fluorite-specimen.webp"],
  "C-0032": ["green-fluorite-heart.webp"],
  "C-0035": ["fluorite-pyramid.webp"],
  "C-0037": ["copper-specimen.webp"],
  "C-0038": ["ruby-tumble-family.webp", "ruby-tumble.webp", "ruby-record-keeper-specimens.webp", "ruby-honeycomb-specimen.webp", "ruby-tumble-2.webp"],
  "C-0041": ["hematite.webp"],
  "C-0047": ["nephrite-jade-tumble.webp", "nephrite-jade-tumble-2.webp"],
  "C-0048": ["garnet-sphere.webp", "garnet-tumble.webp"],
  "C-0049": ["healerite-wand.webp"],
  "C-0050": ["infinite-tumble.webp", "infinite-tumble-2.webp"],
  "C-0054": ["dumortierite-tumble.webp"],
  "C-0055": ["pink-tourmaline-specimen.webp"],
  "C-0060": ["unakite-pyramid.webp", "unakite-tumble.webp"],
  "C-0064": ["blue-kyanite-specimen.webp"],
  "C-0068": ["orange-kyanite-specimen.webp"],
  "C-0070": ["botswana-agate-tumble-family.webp", "botswana-agate-tumble.webp", "botswana-agate-tumble-2.webp", "botswana-agate-egg.webp"],
  "C-0071": ["crazy-lace-agate-freeform.webp", "crazy-lace-agate-tumble.webp", "crazy-lace-agate-star.webp"],
  "C-0074": ["fire-agate-tumble.webp", "fire-agate-heart.webp"],
  "C-0075": ["flower-agate-palm.webp"],
  "C-0076": ["grape-agate-specimen.webp", "grape-agate-sphere.webp", "grape-agate-tumble-family.webp", "grape-agate-tower.webp"],
  "C-0077": ["moss-agate-moon.webp", "moss-agate-moon-2.webp", "moss-agate-tower.webp", "moss-agate-sphere.webp", "moss-agate-freeform.webp"],
  "C-0078": ["orca-agate.webp", "orca-agate-freeform.webp"],
  "C-0079": ["tree-agate-tumble.webp"],
  "C-0080": ["turritella-agate-tumble.webp", "turritella-agate-tumble-2.webp"],
  "C-0082": ["blue-chalcedony-small-sphere.webp"],
  "C-0087": ["brecciated-jasper-tumble.webp"],
  "C-0092": ["leopard-skin-jasper-tumble.webp", "leopard-skin-jasper-tumble-2.webp"],
  "C-0095": ["ocean-jasper-freeform.webp", "ocean-jasper-freeform-2.webp", "ocean-jasper-sphere.webp", "ocean-jasper-tumble-2.webp", "ocean-jasper-tumble-3.webp", "ocean-jasper-tumble.webp", "ocean-jasper-palm.webp"],
  "C-0097": ["picture-jasper-tumble.webp", "picture-jasper-tumble-2.webp", "picture-jasper-raw.webp"],
  "C-0098": ["polychrome-jasper-flame.webp", "polychrome-jasper-sphere.webp"],
  "C-0099": ["red-jasper-specimen.webp"],
  "C-0101": ["yellow-jasper-tumble.webp", "yellow-jasper-tumble-2.webp"],
  "C-0102": ["zebra-jasper-tumble.webp"],
  "C-0103": ["smoky-quartz-specimen.webp", "smoky-quartz-tower.webp", "smoky-quartz-sphere.webp", "smoky-quartz specimen-2.webp"],
  "C-0105": ["clear-quartz.webp", "clear-quartz-cluster.webp", "clear-quartz-point.webp"],
  "C-0108": ["rose-quartz.webp"],
  "C-0109": ["tangerine-quartz-tumble.webp"],
  "C-0114": ["rutilated-quartz-tower.webp", "rutilated-quartz-tumble.webp"],
  "C-0119": ["amethyst-specimen.webp", "amethyst-sphere.webp", "amethyst-seer-stone-tumble.webp", "amethyst-tower.webp"],
  "C-0121": ["citrine-freeform.webp", "citrine-specimen.webp", "citrine-tower.webp"],
  "C-0123": ["herkimer-diamond-specimen.webp"],
  "C-0124": ["crackle-quartz-tumble-display.webp", "crackle-quartz-tumble-family.webp"],
  "C-0129": ["black-tourmaline.webp", "black-tourmaline-tumble.webp"],
  "C-0132": ["kambaba-jasper-large-sphere.webp", "kambaba-jasper-tumble.webp"],
  "C-0133": ["atlantisite-tumble.webp", "atlantisite-freeform.webp"],
  "C-0136": ["galena-specimen.webp"],
  "C-0137": ["pyrite-cube.webp", "pyrite-tumble.webp", "pyrite-sun-specimen.webp"],
  "C-0140": ["gold-sheen-obsidian-large-sphere.webp"],
  "C-0141": ["mahogany-obsidian-tumble.webp"],
  "C-0143": ["snowflake-obsidian-tumble.webp"],
  "C-0146": ["ammolite-specimen.webp"],
  "C-0151": ["bloodstone-sphere.webp"],
  "C-0152": ["blue-chert-tumble.webp"],
  "C-0153": ["carnelian-star.webp", "carnelian.webp", "carnelian-heart.webp"],
  "C-0154": ["chevron-amethyst-tower.webp", "chevron-amethyst-freeform.webp"],
  "C-0156": ["fulgurite-specimen.webp"],
  "C-0159": ["black-moonstone-freeform.webp"],
  "C-0162": ["moonstone-freeform.webp", "moonstone-tumble.webp"],
  "C-0164": ["petrified-wood-tumble.webp"],
  "C-0165": ["pink-opal-tumble.webp", "pink-opal-tumble-2.webp"],
  "C-0171": ["angelite-raw-family.webp"],
  "C-0172": ["desert-rose-specimen.webp"],
  "C-0175": ["selenite.webp"],
  "C-0177": ["blue-aventurine-tower.webp"],
  "C-0178": ["green-aventurine.webp"],
  "C-0180": ["red-aventurine-tumble.webp"],
  "C-0186": ["goldstone-star.webp"],
  "C-0187": ["indigo-gabbro-palm.webp"],
  "C-0188": ["lapis-lazuli-carving.webp"],
  "C-0191": ["nuumite-freeform.webp"],
  "C-0192": ["pietersite-tumble-family.webp", "pietersite-tumble.webp", "pietersite-tower.webp"],
  "C-0193": ["prophecy-stone-tumble.webp"],
  "C-0195": ["ruby-fuschite-family.webp", "ruby-fuschite-tumble.webp"],
  "C-0196": ["ruby-in-zoisite-heart.webp"],
  "C-0198": ["septarian-freeform-front.webp", "septarian-freeform-back.webp", "septarian-tumble.webp"],
  "C-0200": ["shiva-lingam-specimen-family.webp", "shiva-lingam-tumble.webp"],
  "C-0202": ["stromatolite-tumble.webp"],
  "C-0203": ["yooperlite-sphere.webp"],
  "C-0208": ["bismuth-specimen.webp"],
  "C-0210": ["phosphosiderite-heart.webp"],
  "C-0211": ["prehnite-family.webp", "prehnite-tumble.webp", "prehnite-specimen.webp", "prehnite-botryoidal.webp"],
  "C-0212": ["purpurite-raw.webp"],
  "C-0213": ["rhodochrosite-tumble.webp", "rhodochrosite-tumble-2.webp"],
  "C-0214": ["rhodonite-freeform.webp", "rhodonite-tumble-2.webp", "rhodonite-tumble-3.webp"],
  "C-0218": ["sodalite-sphere.webp", "sodalite-tumble.webp"],
  "C-0219": ["staurolite-tumble.webp"],
  "C-0221": ["celestine-egg.webp", "celestine-specimen.webp"],
  "C-0223": ["stichtite-tumble.webp"],
  "C-0227": ["topaz-tumble.webp"],
  "C-0228": ["turquoise-tumble.webp"],
  "C-0229": ["vanadinite-specimen.webp"],
  "C-0238": ["epidote-sphere.webp", "epidote-tumble.webp"],
  "C-0239": ["eudialyte-tumble.webp"],
  "C-0241": ["howlite-tumble-family.webp"],
  "C-0246": ["apophyllite-specimen.webp"],
  "C-0248": ["bronzite-tumble.webp"],
  "C-0250": ["chiastolite-tumble.webp"],
  "C-0253": ["larimar-tumble.webp", "larimar-slab-1.webp", "larimar-heart.webp"],
  "C-0254": ["lepidolite-tumble.webp", "lepidolite-tower.webp", "lepidolite-mica.webp", "lepidolite-botryoidal.webp"],
  "C-0256": ["magnesite-tumble.webp"],
  "C-0266": ["tektite-tumble.webp", "tektite-tumble-2.webp"],
  "C-0268": ["trolleite-tumble.webp", "trolleite-tower.webp"],
  "C-0277": ["aqua-aura-quartz-point.webp"],
  "C-0278": ["axinite-specimen-family.webp", "axinite-specimen.webp", "axinite-specimen-2.webp", "axinite-specimen-3.webp", "axinite-specimen-4.webp"],
  "C-0287": ["buddstone-tumble.webp"],
  "C-0314": ["green-opal-palm.webp"],
  "C-0318": ["hemimorphite-sphere.webp"],
  "C-0320": ["hypersthene-tumble.webp"],
  "C-0327": ["marcasite-tower.webp"],
  "C-0328": ["merlinite-specimen-family.webp"],
  "C-0331": ["peacock-ore-specimen.webp"],
  "C-0342": ["sphalerite-cube.webp"],
  "C-0352": ["tremolite-freeform.webp", "tremolite-raw.webp"],
  "C-0354": ["ulexite-specimen.webp"],
  "C-0356": ["variscite-tumble.webp"],
  "C-0363": ["calligraphy-stone-tumble.webp", "calligraphy-stone-tumble-2.webp"],
  "C-0365": ["afghanite-heart.webp"],
  "C-0366": ["agate-mushroom.webp", "agate-sphere.webp"],
  "C-0367": ["asbolane-specimen.webp"],
  "C-0368": ["banded-agate-mushroom.webp"],
  "C-0369": ["banded-calcite-tumble.webp"],
  "C-0370": ["black-and-peach-moonstone-heart.webp"],
  "C-0371": ["brown-zebra-jasper-tumble.webp"],
  "C-0372": ["chalcedony-druzy-botryoidal-raw.webp"],
  "C-0373": ["chocolate-calcite-carving.webp"],
  "C-0374": ["copal-amber-specimen.webp"],
  "C-0375": ["cotton-candy-agate-specimen.webp"],
  "C-0376": ["ferruginous-quartz-obelisk.webp"],
  "C-0377": ["fluorite-with-pyrite-specimen.webp"],
  "C-0378": ["gobi-mushroom-family.webp", "gobi-agate-green-mushroom.webp", "gobi-agate-red-mushroom.webp"],
  "C-0379": ["green-chalcedony-tumble.webp"],
  "C-0380": ["green-flower-sakura-jasper-heart.webp"],
  "C-0381": ["green-moonstone-sphere.webp"],
  "C-0382": ["heulandite-and-calcite-specimen.webp"],
  "C-0383": ["honey-onyx-specimen.webp"],
  "C-0384": ["honeycomb-ruby-sphere.webp"],
  "C-0385": ["hyalite-opal-specimen.webp"],
  "C-0386": ["jerejimite-specimen.webp"],
  "C-0387": ["king-cobra-jasper-specimen.webp"],
  "C-0388": ["kiwi-jasper-freeform.webp"],
  "C-0389": ["luxullianite-tumble.webp"],
  "C-0390": ["menalite-fairy-stone-specimen.webp"],
  "C-0391": ["moroccan-truffle-chalcedony-specimen.webp"],
  "C-0392": ["nontronite-specimen.webp"],
  "C-0393": ["nunderite-tumble.webp"],
  "C-0394": ["orange-calcite-with-blue-apatite-freeform.webp"],
  "C-0395": ["peach-moonstone-flame.webp", "peach-moonstone-large-sphere.webp"],
  "C-0397": ["phoenix-stone-large-sphere.webp", "phoenix-stone-palm.webp", "phoenix-stone-tower.webp", "phoenix-stone-small-sphere.webp"],
  "C-0405": ["rainforest-jasper-tower.webp", "rainforest-rhyolite-tumble.webp"],
  "C-0406": ["red-hematite-specimen.webp"],
  "C-0407": ["red-vein-jasper-mushroom.webp"],
  "C-0408": ["rosasite-in-dolomite-specimen.webp"],
  "C-0409": ["rubellite-heart.webp", "rubellite-tumble.webp"],
  "C-0410": ["sardonyx-heart-family.webp", "sardonyx-palm.webp"],
  "C-0411": ["silver-sheen-obsidian-heart.webp"],
  "C-0412": ["sunset-sodalite-sphere.webp", "sunset-sodalite-tower.webp"],
  "C-0414": ["turquoise-in-quartz-specimen.webp"],
  "C-0415": ["unicorn-stone-tower.webp"],
  "C-0416": ["utah-wildfire-bubble-opal-heart.webp"],
  "C-0418": ["yellow-calcite-sphere.webp"],
};
function jsArg(v){return JSON.stringify(String(v==null?'':v));}
function escapeAttr(v){
  return String(v||'').replace(/&/g,'&amp;').replace(/"/g,'&quot;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}
function normalizeStoneName(v){
  return String(v||'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();
}

const COLOR_HEX_MAP={'Purple':'#7a5a9a','Blue':'#4a7aaa','Green':'#4a8a5a','Pink':'#d4839a','Red':'#b04a4a','Orange':'#c4683a','Yellow':'#c9a832','Black':'#3a3530','White':'#d8d4ce','Brown':'#8b6f47','Gray':'#8a8a8a','Multi':'#9a7a8a'};

function noPhotoZoneHtml(c){
  const cats=(c.col_cats&&c.col_cats.length>0)?c.col_cats:[];
  const hexMap=COLOR_HEX_MAP;
  let orb=c.ch||'#d8d4ce';
  let extra='';
  if(cats.length>1){
    const cols=cats.slice(0,4).map(x=>hexMap[x]||c.ch||'#d8d4ce');
    const pct=100/cols.length;
    const stops=cols.map((col,i)=>`${col} ${i*pct}% ${(i+1)*pct}%`).join(', ');
    orb=`conic-gradient(${stops})`;
    extra=' multi';
  }
  return`<div class="card-img-zone no-photo"><span class="no-photo-orb${extra}" style="--orb:${orb};background:${orb}"></span></div>`;
}

function collectionPhotoUrl(photo){
  if(!photo)return'';
  if(typeof photo==='string')return photo;
  return photo.preview||photo.url||photo.signedUrl||photo.src||'';
}
function allCollectionPhotos(p){
  return ((p&&p.photos)||[]).map(collectionPhotoUrl).filter(Boolean);
}
function firstEncyclopediaPhoto(c){
  if(!c)return'';
  const encPhotos=ENCYCLOPEDIA_PHOTOS[c.i];
  if(encPhotos&&encPhotos.length)return SUPABASE_ENC+encPhotos[0];
  const featuredMatch=FEATURED_STONES.find(s=>s.id===c.i);
  if(featuredMatch&&featuredMatch.photo)return SUPABASE_STONES+featuredMatch.photo;
  return'';
}
function collectionPhotoSources(p,c){
  const ownPhotos=allCollectionPhotos(p);
  if(ownPhotos.length)return ownPhotos;
  const refPhoto=firstEncyclopediaPhoto(c);
  return refPhoto?[refPhoto]:[];
}

// ── DETAIL DRAWER ──
// ── DRAWER PHOTO CAROUSEL ──
if(typeof TOXIC_NOTES==='undefined') window.TOXIC_NOTES={};
function buildDrawerPhotoHtml(srcs, name){
  if(!srcs || srcs.length === 0) return '';
  if(srcs.length === 1){
    const s = srcs[0].replace(/'/g,"\'");
    const n = name.replace(/'/g,"\'");
    return`<div class="drawer-ref-photo-col"><img class="drawer-ref-photo-thumb" src="${srcs[0]}" alt="${name} crystal specimen" onclick="openPhotoLightbox('${s}','${n}')"><span class="drawer-ref-photo-label" onclick="openPhotoLightbox('${s}','${n}')">Enlarge</span></div>`;
  }
  const dotsHtml = srcs.map((_,i)=>`<span class="drawer-photo-dot${i===0?' active':''}" onclick="drawerPhotoGoto(${i})"></span>`).join('');
  const firstSrc = srcs[0].replace(/'/g,"\'");
  const firstName = name.replace(/'/g,"\'");
  return`<div class="drawer-photo-carousel" id="drawer-carousel" data-srcs='${JSON.stringify(srcs)}' data-name='${name.replace(/'/g,"&#39;")}' data-idx="0">
    <div class="drawer-photo-main-wrap">
      <button class="drawer-photo-nav prev" onclick="drawerPhotoNav(-1)" aria-label="Previous photo">&#8249;</button>
      <img id="drawer-carousel-img" src="${srcs[0]}" alt="${name} crystal specimen" onclick="openPhotoLightbox('${firstSrc}','${firstName}')">
      <button class="drawer-photo-nav next" onclick="drawerPhotoNav(1)" aria-label="Next photo">&#8250;</button>
    </div>
    <div class="drawer-photo-dots" id="drawer-carousel-dots">${dotsHtml}</div>
    <span class="drawer-ref-photo-label" id="drawer-carousel-enlarge" onclick="openPhotoLightbox('${firstSrc}','${firstName}')">Enlarge</span>
  </div>`;
}
function buildDrawerNoPhotoHtml(c){
  const placeholder=noPhotoZoneHtml(c).replace('card-img-zone no-photo','drawer-ref-photo-thumb drawer-ref-photo-placeholder');
  return`<div class="drawer-ref-photo-col">${placeholder}</div>`;
}
function drawerPhotoNav(dir){
  const el = document.getElementById('drawer-carousel');
  if(!el) return;
  const srcs = JSON.parse(el.dataset.srcs);
  const name = el.dataset.name;
  let idx = (parseInt(el.dataset.idx) + dir + srcs.length) % srcs.length;
  drawerPhotoGoto(idx);
}
function drawerPhotoGoto(idx){
  const el = document.getElementById('drawer-carousel');
  if(!el) return;
  const srcs = JSON.parse(el.dataset.srcs);
  const name = el.dataset.name;
  idx = (idx + srcs.length) % srcs.length;
  el.dataset.idx = idx;
  const img = document.getElementById('drawer-carousel-img');
  const enl = document.getElementById('drawer-carousel-enlarge');
  const dots = document.querySelectorAll('#drawer-carousel-dots .drawer-photo-dot');
  if(img){ img.src = srcs[idx]; img.alt = name + ' crystal specimen'; }
  if(enl){
    const s = srcs[idx].replace(/'/g,"\'");
    const n = name.replace(/'/g,"\'");
    enl.onclick = ()=>openPhotoLightbox(s,n);
  }
  if(img){
    const s = srcs[idx].replace(/'/g,"\'");
    const n = name.replace(/'/g,"\'");
    img.onclick = ()=>openPhotoLightbox(s,n);
  }
  dots.forEach((d,i)=>d.classList.toggle('active',i===idx));
}

function openDetail(id){
  const c=CRYSTALS.find(x=>x.i===id);
  if(!c)return;
  currentCrystal=c;
  // Inject reference photo — encyclopedia photos first, then featured stones fallback
  const drawerPhotoWrap = document.getElementById('drawer-ref-photo');
  if(drawerPhotoWrap){
    const encPhotos = ENCYCLOPEDIA_PHOTOS[c.i];
    const featuredMatch = FEATURED_STONES.find(s=>s.id===id);
    if(encPhotos && encPhotos.length > 0){
      const srcs = encPhotos.map(f => SUPABASE_ENC + f);
      drawerPhotoWrap.innerHTML = buildDrawerPhotoHtml(srcs, c.n);
    } else if(featuredMatch && featuredMatch.photo){
      const imgSrc = `${SUPABASE_STONES}${featuredMatch.photo}`;
      drawerPhotoWrap.innerHTML = buildDrawerPhotoHtml([imgSrc], featuredMatch.name);
    } else {
      drawerPhotoWrap.innerHTML = buildDrawerNoPhotoHtml(c);
    }
  }
  document.getElementById('d-id').textContent=c.i;
  document.getElementById('d-name').textContent=c.n;
  document.getElementById('d-alt').textContent=c.a?'Also known as: '+c.a:'';
  document.getElementById('d-fam').textContent=c.fam+(c.sp&&c.sp!==c.fam?' · '+c.sp:'');

  document.getElementById('d-uw').textContent=c.uw||'—';
  document.getElementById('d-geo').textContent=c.g||'—';
  const toxMsg=TOXIC_NOTES[c.n]||c.tox||'';
  const toxBlock=document.getElementById('d-tox-block');
  if(toxBlock){if(toxMsg){document.getElementById('d-tox').textContent=toxMsg;toxBlock.style.display='';}else toxBlock.style.display='none';}
  document.getElementById('d-sy').textContent=c.sy||'—';
  document.getElementById('d-fo').textContent=c.fo||'—';
  document.getElementById('d-m').textContent=c.m?c.m+' Mohs':'—';
  document.getElementById('d-tr').textContent=c.tr||'—';
  document.getElementById('d-c').textContent=c.c||'—';
  document.getElementById('d-cc').textContent=c.cc||'—';
  document.getElementById('d-mt').textContent=c.mt||'—';
  const elW=document.getElementById('d-el-wrap');
  if(elW){if(c.element){document.getElementById('d-el').textContent=c.element;elW.style.display='';}else elW.style.display='none';}
  const cb=document.getElementById('d-chakra-block');
  if(cb){if(c.chakras&&c.chakras.length){document.getElementById('d-chakras').innerHTML=c.chakras.map(ch=>`<span class="chakra-chip">${ch}</span>`).join('');cb.style.display='';}else cb.style.display='none';}
  const zb=document.getElementById('d-zodiac-block');
  if(zb){if(c.zodiac){document.getElementById('d-zodiac').textContent=c.zodiac;zb.style.display='';}else zb.style.display='none';}
  const ab=document.getElementById('d-aff-block');
  if(ab){if(c.aff){document.getElementById('d-aff').textContent='"'+c.aff+'"';ab.style.display='';}else ab.style.display='none';}
  const tags=[c.er1,c.er2,c.er3].filter(Boolean);
  document.getElementById('d-tags').innerHTML=tags.map((t,i)=>`<span class="tag${i===0?' primary':''}">${t}</span>`).join('');
  const sb=document.getElementById('d-sib-block');
  if(sb){const fe=Object.entries(SP_FAM).find(([,ids])=>ids.includes(c.i));if(fe){const oth=fe[1].filter(id=>id!==c.i).map(id=>CRYSTALS.find(x=>x.i===id)).filter(Boolean);if(oth.length){document.getElementById('d-sibs').innerHTML=oth.map(s=>`<span class="sib-tag" onclick="openDetail('${s.i}')">${s.n}</span>`).join('');sb.style.display='';}else sb.style.display='none';}else sb.style.display='none';}
  updateDrawerStatus(c.i);
  _renderSotdEventBanner();
  document.getElementById('drawer-overlay').classList.add('open');
  document.getElementById('detail-drawer').classList.add('open');
}

function openDetailWhenReady(id,tries=0){
  if(!id)return;
  const found=CRYSTALS.find(x=>x.i===id);
  const drawer=document.getElementById('detail-drawer');
  if(found&&drawer){
    openDetail(id);
    return;
  }
  if(tries<20)setTimeout(()=>openDetailWhenReady(id,tries+1),150);
}

function stoneSlug(v){
  return normalizeStoneName(v).replace(/\s+/g,'-');
}

function findStoneEntry(identifier,name){
  const idText=String(identifier||'').trim();
  const idLower=idText.toLowerCase();
  const idNorm=normalizeStoneName(idText);
  const idSlug=stoneSlug(idText);
  const nameNorm=normalizeStoneName(name);
  const nameSlug=stoneSlug(name);
  return CRYSTALS.find(x=>String(x.i).toLowerCase()===idLower)
    || CRYSTALS.find(x=>stoneSlug(x.slug||'')===idSlug)
    || CRYSTALS.find(x=>stoneSlug(x.n)===idSlug)
    || CRYSTALS.find(x=>nameSlug&&stoneSlug(x.n)===nameSlug)
    || CRYSTALS.find(x=>{
      const alt=normalizeStoneName(x.a);
      return !!nameNorm&&(alt.split(/\s*,\s*/).some(a=>normalizeStoneName(a)===nameNorm)||alt.includes(nameNorm));
    })
    || CRYSTALS.find(x=>{
      const n=normalizeStoneName(x.n);
      return !!idNorm&&(n.includes(idNorm)||idNorm.includes(n));
    });
}

let pendingDirectStoneOpen=null;

function openPendingStoneEntry(identifier,name){
  const found=findStoneEntry(identifier,name);
  const drawer=document.getElementById('detail-drawer');
  if(!found){
    console.warn('Still Point: no encyclopedia stone matched deep link', {identifier,name,stoneCount:CRYSTALS.length});
    return false;
  }
  if(!drawer){
    console.warn('Still Point: encyclopedia drawer is not available for deep link', {identifier,name,matchedId:found.i});
    return false;
  }
  try{
    dismissEncDoorway();
    openDetail(found.i);
    return document.getElementById('detail-drawer')?.classList.contains('open') || false;
  }catch(err){
    console.warn('Still Point: matched stone but could not open encyclopedia drawer', {identifier,name,matchedId:found.i,error:err});
    return false;
  }
}

function resolveDirectStoneOpen(){
  if(!pendingDirectStoneOpen)return false;
  if(!document.getElementById('tab-encyclopedia'))return false;
  showEncyclopediaForDirectStoneOpen();
  const opened=openPendingStoneEntry(pendingDirectStoneOpen.identifier,pendingDirectStoneOpen.name);
  if(opened)pendingDirectStoneOpen=null;
  return opened;
}

function queueDirectStoneOpen(identifier,name){
  if(!identifier)return false;
  pendingDirectStoneOpen={identifier,name:name||''};
  return resolveDirectStoneOpen();
}

function showEncyclopediaForDirectStoneOpen(){
  clearInitialTabStyle();
  closeMobileNav();
  rememberActiveTab('encyclopedia');
  document.querySelectorAll('main>section').forEach(s=>s.style.display='none');
  document.querySelectorAll('.nav-tab').forEach(b=>b.classList.remove('active'));
  const tab=document.getElementById('tab-encyclopedia');
  if(tab)tab.style.display='block';
  const navBtn=getTabButton('encyclopedia');
  navBtn?.classList.add('active');
}

function closeDrawer(){
  document.getElementById('drawer-overlay').classList.remove('open');
  document.getElementById('detail-drawer').classList.remove('open');
  currentCrystal=null;
  if(detailReturnContext&&detailReturnContext.type==='collection'){
    const ctx=detailReturnContext;
    detailReturnContext=null;
    switchTabByName('collection');
    setTimeout(()=>{
      let idx=-1;
      if(ctx.pieceId!==null&&ctx.pieceId!==undefined){
        idx=collection.findIndex(p=>String(p.id)===String(ctx.pieceId));
      }
      if(idx<0&&ctx.idx!==null&&ctx.idx!==undefined)idx=ctx.idx;
      if(idx>=0&&collection[idx])openCollDetail(idx);
    },0);
  } else if(detailReturnContext&&detailReturnContext.type==='wishlist'){
    detailReturnContext=null;
    switchTabByName('collection');
    setTimeout(()=>setCollQuickFilter('wish'),0);
  } else if(detailReturnContext&&detailReturnContext.type==='grid'){
    const ctx=detailReturnContext;
    detailReturnContext=null;
    switchTabByName('101');
    setTimeout(()=>{
      show101('grids');
      if(ctx.gridId) openGridModal(ctx.gridId);
    },0);
  } else if(detailReturnContext&&detailReturnContext.type==='energeticRole'){
    const ctx=detailReturnContext;
    detailReturnContext=null;
    switchTabByName('101');
    setTimeout(()=>{
      show101('roles');
      const tiles=document.getElementById('s101-roles-tiles');
      const result=document.getElementById('s101-roles-result');
      const title=document.getElementById('s101-roles-result-title');
      if(result&&title&&ctx.slug===_activeEnergeticRoleSlug&&_activeEnergeticRoleRows.length){
        // cache is warm — re-render in place without re-fetching
        if(tiles)tiles.style.display='none';
        result.style.display='';
        title.textContent=ENERGETIC_ROLE_LABELS[ctx.slug]||ctx.slug;
        _renderEnergeticRoleGrid();
        setTimeout(()=>{window.scrollTo({top:ctx.scrollY||0,behavior:'instant'});},0);
      }else if(ctx.slug){
        openEnergeticRole(ctx.slug).then(()=>{
          setTimeout(()=>{window.scrollTo({top:ctx.scrollY||0,behavior:'instant'});},200);
        });
      }
    },80);
  } else if(detailReturnContext&&detailReturnContext.type==='usewhen'){
    const ctx=detailReturnContext;
    detailReturnContext=null;
    switchTabByName('mood');
    setTimeout(()=>{window.scrollTo({top:ctx.scrollY||0,behavior:'instant'});},0);
  } else if(detailReturnContext&&detailReturnContext.type==='starterStone'){
    const ctx=detailReturnContext;
    detailReturnContext=null;
    setTimeout(()=>{
      if(ctx&&Number.isInteger(ctx.index)){
        openStarterStoneModal(ctx.index, ctx.source);
      }
    },0);
  } else if(detailReturnContext&&detailReturnContext.type==='home-sotd'){
    detailReturnContext=null;
  } else if(detailReturnContext&&detailReturnContext.type==='sotd'){
    detailReturnContext=null;
    window.location.href='index.html#desktop-sotd-section';
  } else if(detailReturnContext&&detailReturnContext.type==='sotd-calendar'){
    // Calendar stays open behind the drawer — nothing to re-open.
    // Clear context so subsequent drawer closes don't re-trigger this branch.
    detailReturnContext=null;
  }
  clearSotdContext();
  _renderSotdEventBanner();
}
let photoLightboxSources=[];
let photoLightboxIndex=0;
let photoLightboxAlt='';
let photoLightboxLabels=null;
function openPhotoLightbox(src,alt){
  const lb=document.getElementById('photo-lightbox');
  const img=document.getElementById('photo-lightbox-img');
  if(!lb||!img)return;
  photoLightboxAlt=alt||'';
  photoLightboxLabels=null;
  photoLightboxSources=[src];
  photoLightboxIndex=0;
  const carousel=document.getElementById('drawer-carousel');
  if(carousel && carousel.dataset.srcs){
    try{
      const srcs=JSON.parse(carousel.dataset.srcs);
      const found=srcs.indexOf(src);
      if(srcs.length>0){
        photoLightboxSources=srcs;
        photoLightboxIndex=found>=0?found:(parseInt(carousel.dataset.idx)||0);
      }
    }catch(e){}
  }
  setPhotoLightboxImage();
  lb.classList.toggle('has-nav',photoLightboxSources.length>1);
  lb.classList.add('open');
  document.body.style.overflow='hidden';
}
function setPhotoLightboxImage(){
  const img=document.getElementById('photo-lightbox-img');
  const label=document.getElementById('photo-lightbox-label');
  if(!img)return;
  const src=photoLightboxSources[photoLightboxIndex];
  img.src=src;
  const activeLabel=(photoLightboxLabels&&photoLightboxLabels[photoLightboxIndex])||photoLightboxAlt||'Crystal reference photo';
  img.alt=activeLabel;
  if(label){
    label.textContent=activeLabel;
    label.style.display=activeLabel?'block':'none';
  }
}
function photoLightboxNav(dir){
  if(!photoLightboxSources || photoLightboxSources.length<2)return;
  photoLightboxIndex=(photoLightboxIndex+dir+photoLightboxSources.length)%photoLightboxSources.length;
  setPhotoLightboxImage();
}
function closePhotoLightbox(){
  const lb=document.getElementById('photo-lightbox');
  if(lb){lb.classList.remove('open');lb.classList.remove('has-nav');}
  photoLightboxLabels=null;
  const label=document.getElementById('photo-lightbox-label');
  if(label)label.textContent='';
  document.body.style.overflow='';
}
function openCollectionPhotoLightbox(idx,startIndex,event){
  if(event)event.stopPropagation();
  const p=collection[idx];
  if(!p)return;
  const c=CRYSTALS.find(x=>x.i===p.crystalId);
  const sources=collectionPhotoSources(p,c);
  if(!sources.length)return;
  const lb=document.getElementById('photo-lightbox');
  if(!lb)return;
  photoLightboxSources=sources;
  photoLightboxIndex=Math.max(0,Math.min(startIndex||0,sources.length-1));
  photoLightboxLabels=null;
  photoLightboxAlt=(c&&c.n)||collPieceName(p,c)||'Collection photo';
  setPhotoLightboxImage();
  lb.classList.toggle('has-nav',photoLightboxSources.length>1);
  lb.classList.add('open');
  document.body.style.overflow='hidden';
}
document.addEventListener('keydown',function(e){
  const lb=document.getElementById('photo-lightbox');
  if(!lb || !lb.classList.contains('open'))return;
  if(e.key==='ArrowLeft') photoLightboxNav(-1);
  if(e.key==='ArrowRight') photoLightboxNav(1);
  if(e.key==='Escape') closePhotoLightbox();
});
function filterByFamily(){
  if(!currentCrystal)return;
  const fam=currentCrystal.fam;
  closeDrawer();
  if(!document.getElementById('tab-encyclopedia')){
    const target=new URL('encyclopedia.html',window.location.href);
    target.searchParams.set('fam',fam);
    window.location.href=target.href;
    return;
  }
  jumpToFamily(fam);
}

const PENDING_DRAWER_ACTION_KEY='spl_pending_drawer_action';

function savePendingDrawerAction(actionType,stone){
  if(!stone||!stone.i)return;
  try{
    sessionStorage.setItem(PENDING_DRAWER_ACTION_KEY,JSON.stringify({
      action:actionType,
      stoneId:stone.i,
      stoneName:stone.n||'',
      returnPath:window.location.pathname+window.location.search+window.location.hash
    }));
  }catch(e){}
}

function readPendingDrawerAction(){
  try{
    const raw=sessionStorage.getItem(PENDING_DRAWER_ACTION_KEY);
    return raw?JSON.parse(raw):null;
  }catch(e){return null;}
}

function clearPendingDrawerAction(){
  try{sessionStorage.removeItem(PENDING_DRAWER_ACTION_KEY);}catch(e){}
}

function pendingDrawerAuthReason(actionType){
  return actionType==='add_to_wishlist'?'save-wishlist':'save-collection';
}

function requestDrawerSaveSignIn(actionType){
  if(!currentCrystal)return;
  savePendingDrawerAction(actionType,currentCrystal);
  _openAuth(pendingDrawerAuthReason(actionType));
}

function updateDrawerStatus(id){
  const isOwned=!!owned[id];
  const isWish=!!wish[id];
  const signedIn=!!_currentUser;
  const pillOwned=document.getElementById('drawer-pill-owned');
  const pillWish=document.getElementById('drawer-pill-wish');
  if(pillOwned){
    pillOwned.textContent=isOwned?'In your collection':(signedIn?'Add to collection':'Save to collection');
    pillOwned.classList.toggle('drawer-pill-active',isOwned);
  }
  if(pillWish){
    pillWish.textContent=isWish?'On your wishlist':(signedIn?'Add to wishlist':'Save to wishlist');
    pillWish.classList.toggle('drawer-pill-active',isWish);
  }
  const viewLinks=document.getElementById('drawer-view-links');
  const viewColl=document.getElementById('drawer-view-coll');
  const viewWish=document.getElementById('drawer-view-wish');
  if(viewLinks){
    if(viewColl) viewColl.style.display=isOwned?'inline':'none';
    if(viewWish) viewWish.style.display=isWish?'inline':'none';
    viewLinks.style.display=(isOwned||isWish)?'flex':'none';
  }
}

function drawerCollectionAction(){
  if(!currentCrystal)return;
  if(!_currentUser){
    requestDrawerSaveSignIn('add_to_collection');
    return;
  }
  if(owned[currentCrystal.i])toggleOwned();
  else addFromDetail();
}

function drawerWishlistAction(){
  if(!currentCrystal)return;
  if(!_currentUser){
    requestDrawerSaveSignIn('add_to_wishlist');
    return;
  }
  const wasWished=!!wish[currentCrystal.i];
  toggleWish();
  if(!wasWished){
    const pill=document.getElementById('drawer-pill-wish');
    if(pill){pill.textContent='Added!';setTimeout(()=>{updateDrawerStatus(currentCrystal?.i);},1200);}
  }
}
// toggleOwned and toggleWish are defined as window.toggleOwned / window.toggleWish
// near the Supabase write layer (async, Supabase-backed).
function addFromDetail(){
  const c=currentCrystal;
  const savedCtx=detailReturnContext;
  detailReturnContext=null;
  addPieceReturnContext=savedCtx&&savedCtx.type==='sotd'
    ?{type:'sotd',stoneId:c?.i||null}
    :{type:'encyclopedia',stoneId:c?.i||null};
  closeDrawer();
  openAddForm(c?.i);
}

// ── TEN STONES WORTH KNOWING ──
const SUPABASE_STONES = SUPABASE_ENC;
const FEATURED_STONES = [
  {id:'C-0119', name:'Amethyst',         hex:'#7a5a9a', photo:'amethyst-sphere.webp',        use:'Calm · Sleep · Protection',      intention:'I am clear, calm, and protected.'},
  {id:'C-0108', name:'Rose Quartz',      hex:'#d4839a', photo:'rose-quartz.webp',     use:'Love · Heart · Self-compassion',  intention:'I am worthy of love.'},
  {id:'C-0105', name:'Clear Quartz',     hex:'#e0dbd4', photo:'clear-quartz.webp',    use:'Amplification · Clarity · Focus', intention:'I amplify what is already true.'},
  {id:'C-0121', name:'Citrine',          hex:'#c9a832', photo:'citrine-freeform.webp',         use:'Abundance · Confidence · Energy', intention:'I welcome abundance.'},
  {id:'C-0028', name:'Labradorite',      hex:'#4a7aaa', photo:'labradorite.webp',     use:'Intuition · Magic · Transition',  intention:'I trust my perception.'},
  {id:'C-0175', name:'Selenite',         hex:'#f0ece6', photo:'selenite.webp',        use:'Cleansing · Clarity · Space',     intention:'I cleanse everything I carry and begin again.'},
  {id:'C-0178', name:'Green Aventurine', hex:'#4a8a5a', photo:'green-aventurine.webp',use:'Opportunity · Heart · Growth',    intention:'I am open to good things.'},
  {id:'C-0153', name:'Carnelian',        hex:'#b04a4a', photo:'carnelian.webp',       use:'Motivation · Creativity · Action',intention:'I am alive, motivated, and ready.'},
  {id:'C-0041', name:'Hematite',         hex:'#5a5a5a', photo:'hematite.webp',        use:'Grounding · Body · Stability',    intention:'I am in my body. I am here.'},
  {id:'C-0129', name:'Black Tourmaline', hex:'#3a3530', photo:'black-tourmaline.webp',use:'Protection · Grounding · Shield', intention:'I am protected. Nothing that is not mine can enter.'},
];

const STARTER_STONE_BEST_FOR = {
  'C-0119': 'Winding down, meditation, and emotional reset.',
  'C-0108': 'Softening self-talk and opening the heart.',
  'C-0105': 'Clarifying intentions and amplifying other stones.',
  'C-0121': 'Confidence, fresh momentum, and welcoming opportunity.',
  'C-0028': 'Trusting intuition through change or uncertainty.',
  'C-0175': 'Clearing stagnant energy and refreshing a space.',
  'C-0178': 'Heart-led growth, optimism, and new openings.',
  'C-0153': 'Creative energy, courage, and getting started.',
  'C-0041': 'Coming back to the body and steadying scattered energy.',
  'C-0129': 'Energetic boundaries, grounding, and protection.'
};

let starterStoneModalIndex = 0;
let starterStoneModalSource = FEATURED_STONES;
let starterStonePreviousFocus = null;
let mobileSotdStone = null;

function featuredStoneQualities(s){
  if(s.qualities && s.qualities.length) return s.qualities;
  return String(s.use || '').replace(/\u00c2/g,'').split(/\s*\u00b7\s*/).filter(Boolean);
}


function starterStoneQualitiesHtml(s){
  return featuredStoneQualities(s).map(q => `<span>${escapeAttr(q)}</span>`).join('');
}

function activeStarterStoneList(){
  return (Array.isArray(starterStoneModalSource) && starterStoneModalSource.length) ? starterStoneModalSource : FEATURED_STONES;
}

function openStarterStoneModal(index, source){
  const overlay = document.getElementById('starter-stone-modal-overlay');
  const content = document.getElementById('starter-stone-modal-content');
  if(!overlay || !content) return;
  starterStoneModalSource = (Array.isArray(source) && source.length) ? source : FEATURED_STONES;
  const stones = activeStarterStoneList();
  starterStoneModalIndex = (index + stones.length) % stones.length;
  const s = stones[starterStoneModalIndex];
  const photoHtml = s.photo
    ? `<img class="starter-stone-modal-image" src="${SUPABASE_STONES}${s.photo}" alt="${escapeAttr(s.name)} crystal specimen">`
    : `<div class="starter-stone-modal-dot" style="background:${escapeAttr(s.hex)}"></div>`;
  content.innerHTML = `
    <div class="starter-stone-modal-media">${photoHtml}</div>
    <div class="starter-stone-modal-copy">
      <h2 class="starter-stone-modal-title" id="starter-stone-modal-title">${escapeAttr(s.name)}</h2>
      <div class="starter-stone-modal-qualities">${starterStoneQualitiesHtml(s)}</div>
      <div class="starter-stone-modal-best"><span>Best for</span>${escapeAttr(s.bestFor || STARTER_STONE_BEST_FOR[s.id] || '')}</div>
      ${s.intention?`<div class="starter-stone-modal-intention">"${escapeAttr(s.intention)}"</div>`:''}
      <button class="starter-stone-modal-learn" type="button" onclick="learnMoreStarterStone()">View full entry →</button>
    </div>`;
  starterStonePreviousFocus = document.activeElement;
  overlay.classList.add('open');
  overlay.setAttribute('aria-hidden','false');
  document.body.style.overflow = 'hidden';
  const closeBtn = overlay.querySelector('.starter-stone-modal-close');
  if(closeBtn) closeBtn.focus();
}

function closeStarterStoneModal(){
  const overlay = document.getElementById('starter-stone-modal-overlay');
  if(!overlay) return;
  overlay.classList.remove('open');
  overlay.setAttribute('aria-hidden','true');
  document.body.style.overflow = '';
  if(starterStonePreviousFocus && starterStonePreviousFocus.focus) starterStonePreviousFocus.focus();
  starterStonePreviousFocus = null;
}

function navStarterStoneModal(dir){
  openStarterStoneModal(starterStoneModalIndex + dir, activeStarterStoneList());
}

function starterStoneOverlayClick(e){
  if(e.target && e.target.id === 'starter-stone-modal-overlay') closeStarterStoneModal();
}

function learnMoreStarterStone(){
  const s = activeStarterStoneList()[starterStoneModalIndex];
  if(!s) return;
  const identifier=s.id || normalizeStoneName(s.name).replace(/\s+/g,'-');
  const onHomepage=!document.getElementById('tab-encyclopedia');
  if(onHomepage && document.getElementById('detail-drawer')){
    const returnIndex=starterStoneModalIndex;
    const returnSource=activeStarterStoneList().slice();
    closeStarterStoneModal();
    detailReturnContext={type:'starterStone',index:returnIndex,source:returnSource};
    if(openPendingStoneEntry(identifier,s.name))return;
    detailReturnContext=null;
  }
  closeStarterStoneModal();
  queueDirectStoneOpen(identifier,s.name);
}

document.addEventListener('keydown',function(e){
  const overlay = document.getElementById('starter-stone-modal-overlay');
  if(!overlay || !overlay.classList.contains('open')) return;
  if(e.key === 'Escape') closeStarterStoneModal();
  if(e.key === 'ArrowLeft') navStarterStoneModal(-1);
  if(e.key === 'ArrowRight') navStarterStoneModal(1);
});
// ── STONE OF THE DAY ──
function localDateKey(d){
  const date=d||new Date();
  const y=date.getFullYear();
  const m=String(date.getMonth()+1).padStart(2,'0');
  const day=String(date.getDate()).padStart(2,'0');
  return `${y}-${m}-${day}`;
}

function stonePhotoFile(c){
  return (c && ENCYCLOPEDIA_PHOTOS[c.i] && ENCYCLOPEDIA_PHOTOS[c.i][0]) || '';
}

function crystalToFeaturedStone(c){
  if(!c)return null;
  const photo=stonePhotoFile(c);
  const qualities=[c.er1,c.er2,c.er3].filter(Boolean).slice(0,3);
  const fallbackThemes=(c.all_themes||[]).filter(Boolean).slice(0,3);
  const finalQualities=(qualities.length?qualities:fallbackThemes).slice(0,3);
  return {
    id:c.i,
    name:c.n,
    hex:c.ch || '#c8bca8',
    photo,
    qualities:finalQualities,
    use:finalQualities.join(' Â· '),
    bestFor:c.uw || '',
    intention:c.aff || '',
    tier:Number(c.tier)||0
  };
}

function deterministicSotdFallback(){
  const withPhotos=CRYSTALS.filter(c=>stonePhotoFile(c));
  const source=withPhotos.length ? withPhotos : CRYSTALS;
  const tier0=source.filter(c=>Number(c.tier)===0);
  const tier1=source.filter(c=>Number(c.tier)===1);
  const eligible=(tier0.length ? tier0 : (tier1.length ? tier1 : source))
    .slice()
    .sort((a,b)=>String(a.i).localeCompare(String(b.i)));
  if(!eligible.length)return FEATURED_STONES[Math.floor(Date.now()/86400000)%FEATURED_STONES.length];
  const day=Math.floor(new Date(localDateKey()+'T00:00:00').getTime()/86400000);
  return crystalToFeaturedStone(eligible[day%eligible.length]) || FEATURED_STONES[day%FEATURED_STONES.length];
}

async function scheduledSotdStone(){
  if(typeof _supa==='undefined')return null;
  try{
    const today=localDateKey();
    const {data,error}=await _supa
      .from('stone_of_day_schedule')
      .select('stone_id')
      .eq('feature_date',today)
      .eq('is_active',true)
      .maybeSingle();
    if(error || !data || !data.stone_id)return null;
    return crystalToFeaturedStone(findStoneEntry(data.stone_id,'')) || null;
  }catch(e){
    console.warn('Stone of the Day schedule unavailable; using deterministic fallback.', e);
    return null;
  }
}

function sotdUseSentence(s){
  const text=String(s.bestFor || STARTER_STONE_BEST_FOR[s.id] || '').trim();
  if(!text)return '';
  if(/^use when/i.test(text))return text;
  return 'Use when you ' + text.charAt(0).toLowerCase() + text.slice(1);
}

const SOTD_TIER_LABELS={1:'The Essentials',2:'Shelf Builders',3:'Collector Favorites',4:'Rare Finds'};

const _SOTD_EDITORIAL={
  'Calm & Peace':'A quieting stone for mental stillness, ease, and emotional steadiness.',
  'Grounding':'A stabilizing stone for anchoring scattered energy and returning to center.',
  'Stability':'A grounding stone for steadiness through change and uncertain ground.',
  'Protection':'A shielding stone for energetic boundaries, clarity, and steady ground.',
  'Heart Healing':'A softening stone for grief, forgiveness, and the slow work of the heart.',
  'Self-Love':'A nurturing stone for inner kindness and the practice of caring for yourself.',
  'Clarity & Focus':'A clarifying stone for mental precision, intention, and clear thinking.',
  'Intuition':'An opening stone for inner knowing, subtle perception, and quiet guidance.',
  'Spiritual Connection':'A contemplative stone for deepening practice and expanding awareness.',
  'Transformation':'A catalyst stone for release, renewal, and moving through thresholds.',
  'Confidence':'An empowering stone for self-trust, forward motion, and personal authority.',
  'Manifestation':'An activating stone for aligning intention with action and drawing results.',
  'Joy':'A brightening stone for optimism, creative spark, and the lighter side of being.',
  'Vitality':'An energizing stone for physical momentum, stamina, and renewed drive.',
  'Communication':'A clarifying stone for honest expression, being heard, and speaking truth.',
};
const _SOTD_PAIRING={
  'Calm':'Amethyst or Smoky Quartz','Peace':'Amethyst or Smoky Quartz','Sleep':'Lepidolite or Amethyst',
  'Protection':'Black Tourmaline or Hematite','Grounding':'Black Tourmaline or Obsidian','Stabil':'Black Tourmaline or Smoky Quartz',
  'Heart':'Rose Quartz or Rhodonite','Love':'Rose Quartz or Rhodonite','Self':'Rose Quartz or Kunzite',
  'Confidence':'Citrine or Tiger\'s Eye','Manifestation':'Citrine or Pyrite',
  'Clarity':'Clear Quartz or Fluorite','Focus':'Clear Quartz or Fluorite',
  'Creativity':'Carnelian or Sunstone','Joy':'Carnelian or Citrine',
  'Intuition':'Labradorite or Selenite','Spiritual':'Labradorite or Moonstone',
  'Communication':'Aquamarine or Blue Lace Agate','Transform':'Malachite or Labradorite',
  'Vitality':'Carnelian or Red Jasper',
};
const _SOTD_PROMPT={
  'Calm':'Hold for 60 seconds before replying, deciding, or spiraling.',
  'Peace':'Hold for 60 seconds before replying, deciding, or spiraling.',
  'Sleep':'Place it on your nightstand or under your pillow tonight.',
  'Protection':'Set it near your front door or workspace as an anchor.',
  'Grounding':'Hold it in both palms and take three slow breaths.',
  'Stabil':'Hold it in both palms and take three slow breaths.',
  'Heart':'Place it over your sternum and breathe into the space there.',
  'Love':'Place it over your sternum and breathe into the space there.',
  'Self':'Place it over your sternum and breathe gently.',
  'Clarity':'Keep it nearby when you need a quieter, more precise mind.',
  'Focus':'Place it at your workspace before starting something that matters.',
  'Confidence':'Hold it before a conversation that requires your full voice.',
  'Manifestation':'Write one clear intention nearby and let it hold the focus.',
  'Creativity':'Keep it visible while you work on something you care about.',
  'Joy':'Set it somewhere you\'ll see it and let it be a small, quiet reminder.',
  'Intuition':'Sit with it for a few minutes before a decision or creative choice.',
  'Spiritual':'Use it to open or close a meditation or intention-setting session.',
  'Communication':'Hold it before a conversation that needs your most honest voice.',
  'Transform':'Let it sit nearby as a marker of the change you are moving through.',
  'Vitality':'Keep it close when your energy needs a slow, steady lift.',
};

function _sotdLookup(map,q){
  if(!q)return null;
  const exact=map[q];if(exact)return exact;
  for(const k of Object.keys(map)){if(q.toLowerCase().includes(k.toLowerCase()))return map[k];}
  return null;
}

function getSotdEditorialLine(s){
  const q=(s.qualities&&s.qualities[0])||'';
  return _sotdLookup(_SOTD_EDITORIAL,q)||'';
}

function getStonePairing(s){
  const q=(s.qualities&&s.qualities[0])||'';
  return _sotdLookup(_SOTD_PAIRING,q)||'Clear Quartz or Amethyst';
}

function getStoneDailyPrompt(s){
  const q=(s.qualities&&s.qualities[0])||'';
  return _sotdLookup(_SOTD_PROMPT,q)||'Keep it nearby today as a quiet point of focus.';
}

// ── STONE OF THE DAY ─────────────────────────────────────────────────────────

// Pill background + text (accent). Keys are canonical chakra names.
// Mineral Ink palette (approved 2026-07-06). 'Soul Star' has no approved
// entry of its own; it uses the Crown tokens, mirroring the existing
// 'All Chakras' → Crown fallback pattern used in stones/stone.html.
const SFC_CHAKRA_COLORS={
  'Earth Star':   {bg:'#F1EEEB',text:'#2E2621'},
  'Root':         {bg:'#F7EFEC',text:'#4A1513'},
  'Sacral':       {bg:'#F8F0E9',text:'#5A2815'},
  'Solar Plexus': {bg:'#F8F3E7',text:'#5B4214'},
  'Heart':        {bg:'#EEF3EE',text:'#283C2C'},
  'Throat':       {bg:'#EDF3F5',text:'#1F3A44'},
  'Third Eye':    {bg:'#F0F0F6',text:'#25223F'},
  'Crown':        {bg:'#F3F0F5',text:'#352B40'},
  'Soul Star':    {bg:'#F3F0F5',text:'#352B40'},
};

// Banner/wash colors — ultra-light chakra tint, barely deeper than card ivory.
const SFC_BANNER_COLORS={
  'Earth Star':   '#F1EEEB',
  'Root':         '#F7EFEC',
  'Sacral':       '#F8F0E9',
  'Solar Plexus': '#F8F3E7',
  'Heart':        '#EEF3EE',
  'Throat':       '#EDF3F5',
  'Third Eye':    '#F0F0F6',
  'Crown':        '#F3F0F5',
  'Soul Star':    '#F3F0F5',
};

// Button colors — pill fill + canonical border + accent text.
const SFC_BUTTON_COLORS={
  'Earth Star':   {bg:'#F1EEEB',border:'#5A4B42',text:'#2E2621'},
  'Root':         {bg:'#F7EFEC',border:'#8A2F2B',text:'#4A1513'},
  'Sacral':       {bg:'#F8F0E9',border:'#A9562A',text:'#5A2815'},
  'Solar Plexus': {bg:'#F8F3E7',border:'#A77A1E',text:'#5B4214'},
  'Heart':        {bg:'#EEF3EE',border:'#55775A',text:'#283C2C'},
  'Throat':       {bg:'#EDF3F5',border:'#3F7284',text:'#1F3A44'},
  'Third Eye':    {bg:'#F0F0F6',border:'#4A477F',text:'#25223F'},
  'Crown':        {bg:'#F3F0F5',border:'#746284',text:'#352B40'},
  'Soul Star':    {bg:'#F3F0F5',border:'#746284',text:'#352B40'},
};

// Kicker/icon accent colors — dark enough for ≥4.5:1 on the ultra-light wash.
// Declared explicitly per chakra; do not derive at runtime from other palettes.
const SFC_KICKER_COLORS={
  'Earth Star':   '#5A4B42',
  'Root':         '#8A2F2B',
  'Sacral':       '#A9562A',
  'Solar Plexus': '#A77A1E',
  'Heart':        '#55775A',
  'Throat':       '#3F7284',
  'Third Eye':    '#4A477F',
  'Crown':        '#746284',
  'Soul Star':    '#746284',
};

// Deep/dark accent — for hover states, focus rings, or high-contrast contexts.
const SFC_DEEP_COLORS={
  'Earth Star':   '#2E2621',
  'Root':         '#4A1513',
  'Sacral':       '#5A2815',
  'Solar Plexus': '#5B4214',
  'Heart':        '#283C2C',
  'Throat':       '#1F3A44',
  'Third Eye':    '#25223F',
  'Crown':        '#352B40',
  'Soul Star':    '#352B40',
};

// ── Chakra normalization ──────────────────────────────────────────────────────
// Canonical key list — the only values palette objects recognize.
// Soul Star is canonical (palette reserved) but not surfaced in UI filters unless stone data uses it.
const _SOTD_CHAKRA_CANONICAL=['Earth Star','Root','Sacral','Solar Plexus','Heart','Throat','Third Eye','Crown','Soul Star'];
// Lowercase→canonical map (pre-computed once, not rebuilt per render).
const _SOTD_CHAKRA_NORM_MAP=Object.fromEntries(
  _SOTD_CHAKRA_CANONICAL.map(k=>[k.toLowerCase().replace(/\s+/g,' '),k])
);
// Returns the canonical key, or '' for null/blank/unknown/multi-chakra values.
function normalizeSotdChakra(raw){
  if(!raw)return'';
  return _SOTD_CHAKRA_NORM_MAP[String(raw).trim().replace(/\s+/g,' ').toLowerCase()]||'';
}

function sfcPillStyle(chakra){
  const c=SFC_CHAKRA_COLORS[chakra]||{bg:'#e5dfd8',text:'#6b6258'};
  return `background:${c.bg};color:${c.text}`;
}

// ── SOTD EVENT ANNOUNCEMENT SYSTEM ───────────────────────────────────────────

const _SOTD_EVT_ICONS={
  lunar:      `<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>`,
  eclipse:    `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" aria-hidden="true"><circle cx="9" cy="12" r="7"/><path d="M14.9 6.3A7 7 0 0 1 14.9 17.7"/></svg>`,
  celestial:  `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`,
  meteor:     `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="19" y1="5" x2="5" y2="19"/><polyline points="19 11 19 5 13 5"/><circle cx="7.5" cy="16.5" r="2" fill="currentColor" opacity=".35"/></svg>`,
  tradition:  `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z"/></svg>`,
  location:   `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>`,
  geology:    `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 3l6 4 6-4v14l-6 4-6-4V3z"/><line x1="12" y1="7" x2="12" y2="17"/></svg>`,
  anniversary:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="3"/><line x1="12" y1="2" x2="12" y2="6"/><line x1="12" y1="18" x2="12" y2="22"/><line x1="2" y1="12" x2="6" y2="12"/><line x1="18" y1="12" x2="22" y2="12"/><line x1="4.93" y1="4.93" x2="7.76" y2="7.76"/><line x1="16.24" y1="16.24" x2="19.07" y2="19.07"/><line x1="19.07" y1="4.93" x2="16.24" y2="7.76"/><line x1="7.76" y1="16.24" x2="4.93" y2="19.07"/></svg>`,
  generic:    `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 8v4l3 3"/></svg>`,
};

const SOTD_EVENT_PRESENTATION={
  'Lunar phase':                {family:'lunar',      categoryClass:'sotd-event--lunar'},
  'Solar eclipse':              {family:'eclipse',    categoryClass:'sotd-event--eclipse'},
  'Lunar eclipse':              {family:'eclipse',    categoryClass:'sotd-event--eclipse'},
  'Lunar phase / eclipse':      {family:'eclipse',    categoryClass:'sotd-event--eclipse'},
  'Seasonal astronomy':         {family:'celestial',  categoryClass:'sotd-event--celestial'},
  'Orbital event':              {family:'celestial',  categoryClass:'sotd-event--celestial'},
  'Editorial astronomy':        {family:'celestial',  categoryClass:'sotd-event--celestial'},
  'Meteor shower':              {family:'meteor',     categoryClass:'sotd-event--meteor'},
  'Meteorite history':          {family:'meteor',     categoryClass:'sotd-event--meteor'},
  'Cultural holiday':           {family:'tradition',  categoryClass:'sotd-event--tradition'},
  'Seasonal tradition':         {family:'tradition',  categoryClass:'sotd-event--tradition'},
  'Calendar tradition':         {family:'tradition',  categoryClass:'sotd-event--tradition'},
  'Cultural / lunar tradition': {family:'tradition',  categoryClass:'sotd-event--tradition'},
  'Rare calendar event':        {family:'tradition',  categoryClass:'sotd-event--tradition'},
  'Location spotlight':         {family:'location',   categoryClass:'sotd-event--location'},
  'Geology observance':         {family:'geology',    categoryClass:'sotd-event--geology'},
  'Site anniversary':           {family:'anniversary',categoryClass:'sotd-event--anniversary'},
};

function getSotdEventPresentation(eventCategory){
  const p=SOTD_EVENT_PRESENTATION[eventCategory||''];
  if(!p)return{family:'generic',categoryClass:'sotd-event--generic',artwork:null,icon:_SOTD_EVT_ICONS.generic};
  return{...p,icon:_SOTD_EVT_ICONS[p.family]||_SOTD_EVT_ICONS.generic};
}

function _isSotdEditorial(entry){
  if(!entry)return false;
  const name=entry.eventName||entry.event_name||'';
  const type=entry.selectionType||entry.selection_type||'';
  return!!(name&&type!=='random'&&type!=='emergency');
}

function _isSafeUrl(url){
  if(!url||typeof url!=='string')return false;
  try{const u=new URL(url);return u.protocol==='https:'||u.protocol==='http:';}catch{return false;}
}

// Structured SOTD context — carries source and entry independently.
// source: 'home' | 'calendar' | null
// entry:  raw entry object (SOTD stone or calendar entry); null for ordinary opens
let _sotdContext = { source: null, entry: null };

function setSotdContext(source, entry) {
  _sotdContext = { source: source || null, entry: entry || null };
}

function clearSotdContext() {
  _sotdContext = { source: null, entry: null };
}

// Returns the entry only when it qualifies as an editorial event; null otherwise.
function _sotdContextEvent() {
  return _isSotdEditorial(_sotdContext.entry) ? _sotdContext.entry : null;
}

// Always renders a header band. Editorial days show event context; ordinary days
// show a neutral "Daily Selection / Chosen for Today" version with no extras.
function renderSotdEventAnnouncement(entry){
  if(!entry)return'';
  if(_isSotdEditorial(entry)){
    const eventName =entry.eventName ||entry.event_name ||'';
    const eventCat  =entry.eventCategory||entry.event_category||'';
    const editNote  =entry.editorialNote||entry.editorial_note||'';
    const location  =entry.eventLocation||entry.event_location||'';
    const srcUrl    =entry.sourceUrl    ||entry.source_url    ||'';
    const pres=getSotdEventPresentation(eventCat);
    const artworkHtml=pres.artwork
      ?`<img class="sotd-event-artwork" src="${escapeAttr(pres.artwork)}" alt="" aria-hidden="true" onerror="this.style.display='none'" loading="lazy">`
      :'';
    const iconHtml=pres.icon
      ?`<span class="sotd-event-icon" aria-hidden="true">${pres.icon}</span>`
      :'';
    const noteHtml=editNote?`<p class="sotd-event-note">${escapeAttr(editNote)}</p>`:'';
    const locHtml =location?`<span class="sotd-event-location">${escapeAttr(location)}</span>`:'';
    const srcHtml =_isSafeUrl(srcUrl)
      ?`<a class="sotd-event-source" href="${escapeAttr(srcUrl)}" target="_blank" rel="noopener noreferrer" aria-label="Learn more about ${escapeAttr(eventName)}">Learn more</a>`
      :'';
    const metaHtml=(locHtml||srcHtml)?`<div class="sotd-event-meta">${locHtml}${srcHtml}</div>`:'';
    return`<div class="sotd-event-announcement ${pres.categoryClass}">
      <div class="sotd-event-body">
        <div class="sotd-event-kicker">${iconHtml}<span class="sotd-event-kicker-text">Today's Selection</span></div>
        <div class="sotd-event-heading">Chosen for ${escapeAttr(eventName)}</div>
        ${noteHtml}${metaHtml}
      </div>
      ${artworkHtml}
    </div>`;
  }
  // Ordinary day — neutral header, same structure, no editorial content
  const dailyIcon=`<span class="sotd-event-icon" aria-hidden="true">${_SOTD_EVT_ICONS.generic}</span>`;
  const dailyDate=new Date().toLocaleDateString('en-US',{timeZone:'America/Chicago',month:'long',day:'numeric'});
  return`<div class="sotd-event-announcement">
    <div class="sotd-event-body">
      <div class="sotd-event-kicker">${dailyIcon}<span class="sotd-event-kicker-text">Daily Selection</span></div>
      <div class="sotd-event-heading">Chosen for ${dailyDate}</div>
    </div>
  </div>`;
}

function _renderSotdEventBanner(){
  const el=document.getElementById('sotd-event-banner');
  if(!el)return;
  const evt=_sotdContextEvent();
  if(evt){
    el.innerHTML=renderSotdEventAnnouncement(evt);
    el.hidden=false;
  }else{
    el.innerHTML='';
    el.hidden=true;
  }
}

function renderDesktopSotdCard(s){
  const container=document.getElementById('desktop-sotd-wrap');
  if(!container||!s)return;
  desktopSotdStone=s;
  const photoHtml=s.photo
    ?`<img class="sotd-photo" src="${SUPABASE_STONES}${escapeAttr(s.photo)}" alt="${escapeAttr(s.name)} crystal" loading="lazy">`
    :`<div class="sotd-photo-fallback"><span class="no-photo-orb" style="--orb:${escapeAttr(s.hex||'#c8bca8')};background:${escapeAttr(s.hex||'#c8bca8')}"></span></div>`;
  const _dChakra=normalizeSotdChakra(s.primary_chakra);
  const pillStyle=sfcPillStyle(_dChakra);
  const _dBtn=SFC_BUTTON_COLORS[_dChakra]||{bg:'rgba(150,136,179,.18)',border:'#b0a0d8',text:'#5e5080'};
  const _dBanner=SFC_BANNER_COLORS[_dChakra]||'#f4f2f6';
  const _dKicker=SFC_KICKER_COLORS[_dChakra]||'#6b5e52';
  const _dCardVars=`--sotd-btn-bg:${_dBtn.bg};--sotd-btn-border:${_dBtn.border};--sotd-btn-text:${_dBtn.text};--sotd-banner-bg:${_dBanner};--sotd-banner-border:${_dBtn.border};--sotd-kicker-color:${_dKicker}`;
  const _dEventHtml=renderSotdEventAnnouncement(s);
  const ICON_BESTFOR=`<svg class="sotd-detail-icon-svg" viewBox="0 0 64 64" aria-hidden="true">
    <path d="M27 10c-9.4 0-17 7.6-17 17 0 5.8 2.9 10.9 7.3 14v10h18v-8.2c5.2-2.9 8.7-8.5 8.7-14.8C44 18.1 36.4 10 27 10Z"/>
    <path d="M22 22c2.4-4.8 9.8-4.8 12.2 0 4.8-.2 7.1 5.7 3.4 8.7 2.2 4.4-2.4 8.8-6.7 6.6-3 3.7-8.8 1.4-8.6-3.4-4.7-.9-5.9-7.1-1.8-9.6.1-.8.6-1.6 1.5-2.3Z"/>
    <path d="M27 18v21M20 28h16M24 22l6 6M32 22l-6 6"/>
  </svg>`;
  const ICON_CHAKRA=`<svg class="sotd-detail-icon-svg" viewBox="0 0 64 64" aria-hidden="true">
    <path d="M32 48C23 40 21 29 32 16c11 13 9 24 0 32Z"/>
    <path d="M32 48C20 46 12 38 11 25c12 2 19 10 21 23Z"/>
    <path d="M32 48c12-2 20-10 21-23-12 2-19 10-21 23Z"/>
    <path d="M32 48c-8 4-17 2-23-6 9-3 17-1 23 6Z"/>
    <path d="M32 48c8 4 17 2 23-6-9-3-17-1-23 6Z"/>
    <path d="M16 54h32"/>
  </svg>`;
  const ICON_PAIR=`<svg class="sotd-detail-icon-svg" viewBox="0 0 64 64" aria-hidden="true">
    <circle cx="25" cy="32" r="14"/>
    <circle cx="39" cy="32" r="14"/>
  </svg>`;
  const bestForRow=s.card_best_for?`
      <div class="sotd-detail-row">
        <div class="sotd-detail-icon" aria-hidden="true">${ICON_BESTFOR}</div>
        <div class="sotd-detail-copy">
          <span class="sotd-detail-label">Best for</span>
          <span class="sotd-detail-value">${escapeAttr(s.card_best_for)}</span>
        </div>
      </div>`:'';
  const chakraRow=s.primary_chakra?`
      <div class="sotd-detail-row">
        <div class="sotd-detail-icon" aria-hidden="true">${ICON_CHAKRA}</div>
        <div class="sotd-detail-copy">
          <span class="sotd-detail-label">Primary chakra</span>
          <span class="sotd-detail-value">${escapeAttr(s.primary_chakra)}</span>
        </div>
      </div>`:'';
  const pairRow=s.card_pair_with?`
      <div class="sotd-detail-row">
        <div class="sotd-detail-icon" aria-hidden="true">${ICON_PAIR}</div>
        <div class="sotd-detail-copy">
          <span class="sotd-detail-label">Pair with</span>
          <span class="sotd-detail-value">${escapeAttr(s.card_pair_with)}</span>
        </div>
      </div>`:'';
  const hasDetails=bestForRow||chakraRow||pairRow;
  container.innerHTML=`
    <section class="sotd-card" style="${_dCardVars}" aria-labelledby="sotd-heading">
      <div class="sotd-event-row">${_dEventHtml}</div>
      <div class="sotd-photo-panel" aria-label="${escapeAttr(s.name)} photo">
        <div class="sotd-photo-frame">
          ${photoHtml}
          <div class="sotd-photo-caption">
            <span class="sotd-photo-name">${escapeAttr(s.name)}</span>
            <span class="sotd-photo-rule" aria-hidden="true"></span>
          </div>
        </div>
      </div>
      <div class="sotd-main">
        <p class="sotd-eyebrow">Today's Stone</p>
        <div class="sotd-title-row">
          <h2 id="sotd-heading" class="sotd-title">${escapeAttr(s.name)}</h2>
          ${s.card_quality_pill?`<div class="sotd-quality-pill" style="${pillStyle}">${escapeAttr(s.card_quality_pill)}</div>`:''}
        </div>
        ${s.card_use_when?`<p class="sotd-use-when">${escapeAttr(s.card_use_when)}</p>`:''}
        <div class="sotd-actions">
          <button class="sotd-button sotd-button-primary sfc-btn-enc" type="button"><span class="sotd-action-icon" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg></span><span class="sotd-action-label">View Full Entry</span></button>
          <button class="sotd-button sotd-button-secondary sfc-btn-coll" type="button" data-sotd-id="${escapeAttr(String(s.id))}" data-sotd-name="${escapeAttr(s.name)}"><span class="sotd-action-icon" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8Z"/></svg></span><span class="sotd-action-label">Add to Collection</span></button>
          <button class="sotd-button sotd-button-secondary sotd-button-wish sfc-btn-wish" type="button" data-sotd-id="${escapeAttr(String(s.id))}" data-sotd-name="${escapeAttr(s.name)}" aria-pressed="false"><span class="sotd-action-icon" aria-hidden="true"><svg class="sotd-wish-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg></span><span class="sotd-action-label">Wishlist</span></button>
          <span class="sfc-signin">Sign in to save to your collection</span>
        </div>
      </div>
      ${hasDetails||s.card_note?`
      <aside class="sotd-details" aria-label="Stone details">
        ${hasDetails?`${bestForRow}${chakraRow}${pairRow}`:''}
      </aside>`:''}
      ${s.card_note?`<div class="sotd-practice">
        <div class="sotd-practice-label">Today's Practice</div>
        <div class="sotd-practice-text">${escapeAttr(s.card_note)}</div>
      </div>`:''}
    </section>`;
  const encBtn=container.querySelector('.sfc-btn-enc');
  if(encBtn)encBtn.addEventListener('click',()=>{setSotdContext('home',s);detailReturnContext={type:'home-sotd'};openDetail(s.id);});
  const collBtn=container.querySelector('.sfc-btn-coll');
  if(collBtn){
    collBtn.addEventListener('click',function(){
      const sid=this.dataset.sotdId;
      const sname=this.dataset.sotdName||'';
      if(!_currentUser){savePendingDrawerAction('add_to_collection',{i:sid,n:sname});_openAuth('save-collection');return;}
      addPieceReturnContext={type:'sotd',stoneId:sid};
      openAddForm(sid);
    });
  }
  const wishBtn=container.querySelector('.sfc-btn-wish');
  if(wishBtn){
    wishBtn.addEventListener('click',function(){
      const sid=this.dataset.sotdId;
      const sname=this.dataset.sotdName||'';
      if(!_currentUser){savePendingDrawerAction('add_to_wishlist',{i:sid,n:sname});_openAuth('save-wishlist');return;}
      sotdWishlistDirect(sid);
    });
  }
  updateDesktopSotdAuth();updateMobileSotdAuth();
}

// Shared helper — safely updates label span only, never clobbers icon markup
function _sotdSetBtnLabel(btn,text){
  if(!btn)return;
  const lbl=btn.querySelector('.sotd-action-label');
  if(lbl)lbl.textContent=text;
}
function _sotdSetWishState(btn,wishlisted){
  if(!btn)return;
  _sotdSetBtnLabel(btn,wishlisted?'Wishlisted':'Wishlist');
  btn.setAttribute('aria-pressed',wishlisted?'true':'false');
  btn.disabled=false;
  const icon=btn.querySelector('.sotd-wish-icon');
  if(icon){
    if(wishlisted){icon.setAttribute('fill','currentColor');}
    else{icon.setAttribute('fill','none');}
  }
}

function updateDesktopSotdAuth(){
  const container=document.getElementById('desktop-sotd-wrap');
  if(!container)return;
  const signin=container.querySelector('.sfc-signin');
  const collBtn=container.querySelector('.sfc-btn-coll');
  const wishBtn=container.querySelector('.sfc-btn-wish');
  const stone=desktopSotdStone;
  const isOwned=stone&&!!owned[stone.id];
  const isWished=stone&&!!wish[stone.id];
  if(signin)signin.style.display=_currentUser?'none':'';
  if(collBtn){
    collBtn.style.display='';
    _sotdSetBtnLabel(collBtn,_currentUser&&isOwned?'Add Another Piece':'Add to Collection');
  }
  if(wishBtn){
    wishBtn.style.display='';
    _sotdSetWishState(wishBtn,_currentUser&&isWished);
  }
}

function updateMobileSotdAuth(){
  const container=document.getElementById('mobile-sotd-card-wrap');
  if(!container)return;
  const collBtn=container.querySelector('.msfc-btn-coll');
  const wishBtn=container.querySelector('.msfc-btn-wish');
  const stone=mobileSotdStone;
  const isOwned=stone&&!!owned[stone.id];
  const isWished=stone&&!!wish[stone.id];
  if(collBtn){
    collBtn.style.display='';
    _sotdSetBtnLabel(collBtn,_currentUser&&isOwned?'Add Another Piece':'Add to Collection');
  }
  if(wishBtn){
    wishBtn.style.display='';
    _sotdSetWishState(wishBtn,_currentUser&&isWished);
  }
}

async function sotdWishlistDirect(stoneId){
  if(!_currentUser)return;
  const dWishBtn=document.querySelector('#desktop-sotd-wrap .sfc-btn-wish');
  const mWishBtn=document.querySelector('#mobile-sotd-card-wrap .msfc-btn-wish');
  const alreadyWished=!!wish[stoneId];
  if(alreadyWished){
    // toggle off
    try{
      await _supa.from('wishlist_items').delete().eq('user_id',_currentUser.id).eq('stone_id',stoneId);
      wish[stoneId]=false;
      localStorage.setItem('lap_wish',JSON.stringify(wish));
    }catch(err){console.warn('SOTD wishlist remove failed',err);}
  } else {
    try{
      await _supa.from('wishlist_items').insert({user_id:_currentUser.id,stone_id:stoneId});
      wish[stoneId]=true;
      localStorage.setItem('lap_wish',JSON.stringify(wish));
    }catch(err){console.warn('SOTD wishlist save failed',err);}
  }
  _sotdSetWishState(dWishBtn,!!wish[stoneId]);
  _sotdSetWishState(mWishBtn,!!wish[stoneId]);
}

function renderMobileSotdCard(s){
  mobileSotdStone=s;
  const container=document.getElementById('mobile-sotd-card-wrap');
  if(!container||!s)return;
  const photoHtml=s.photo
    ?`<img class="msotd-img" src="${SUPABASE_STONES}${escapeAttr(s.photo)}" alt="${escapeAttr(s.name)}" loading="lazy">`
    :`<div class="msotd-img-fallback"><span class="no-photo-orb" style="--orb:${escapeAttr(s.hex||'#c8bca8')};background:${escapeAttr(s.hex||'#c8bca8')}"></span></div>`;
  const _mChakra=normalizeSotdChakra(s.primary_chakra);
  const pillStyle=sfcPillStyle(_mChakra);
  const _mBtn=SFC_BUTTON_COLORS[_mChakra]||{bg:'rgba(150,136,179,.18)',border:'#b0a0d8',text:'#5e5080'};
  const _mBanner=SFC_BANNER_COLORS[_mChakra]||'#f4f2f6';
  const _mKicker=SFC_KICKER_COLORS[_mChakra]||'#6b5e52';
  const _mCardVars=`--sotd-btn-bg:${_mBtn.bg};--sotd-btn-border:${_mBtn.border};--sotd-btn-text:${_mBtn.text};--sotd-banner-bg:${_mBanner};--sotd-banner-border:${_mBtn.border};--sotd-kicker-color:${_mKicker}`;
  // Build mobile selection header — replaces old plain "TODAY'S STONE" eyebrow
  let _mEyebrowHtml;
  if(_isSotdEditorial(s)){
    const _evtName=s.eventName||s.event_name||'';
    const _evtCat =s.eventCategory||s.event_category||'';
    const _pres   =getSotdEventPresentation(_evtCat);
    const _evtIcon=_pres.icon?`<span class="sotd-event-icon" aria-hidden="true">${_pres.icon}</span>`:'';
    _mEyebrowHtml=`<div class="msotd-eyebrow"><div class="sotd-event-kicker">${_evtIcon}<span class="sotd-event-kicker-text">Today's Selection</span></div><div class="sotd-event-heading">Chosen for ${escapeAttr(_evtName)}</div></div>`;
  }else{
    const _mDailyDate=new Date().toLocaleDateString('en-US',{timeZone:'America/Chicago',month:'long',day:'numeric'});
    const _mDailyIcon=`<span class="sotd-event-icon" aria-hidden="true">${_SOTD_EVT_ICONS.generic}</span>`;
    _mEyebrowHtml=`<div class="msotd-eyebrow"><div class="sotd-event-kicker">${_mDailyIcon}<span class="sotd-event-kicker-text">Today's Selection</span></div><div class="sotd-event-heading">Chosen for ${_mDailyDate}</div></div>`;
  }
  const sid=String(s.id);
  const sname=escapeAttr(s.name);
  const nameLen=s.name.length;
  const nameSizeClass=nameLen>22?'msotd-name--long':nameLen>14?'msotd-name--med':'';
  // Strip leading "Use when you " / "Use when " for mobile display only
  let useWhenText=s.card_use_when||'';
  useWhenText=useWhenText.replace(/^Use when you\s+/i,'You ').replace(/^Use when\s+/i,'');
  const SVG_BOOK=`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>`;
  const SVG_HEART=`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>`;
  const SVG_BOOKMARK=`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>`;
  const SVG_BESTFOR=`<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M27 10c-9.4 0-17 7.6-17 17 0 5.8 2.9 10.9 7.3 14v10h18v-8.2c5.2-2.9 8.7-8.5 8.7-14.8C44 18.1 36.4 10 27 10Z"/><path d="M22 22c2.4-4.8 9.8-4.8 12.2 0 4.8-.2 7.1 5.7 3.4 8.7 2.2 4.4-2.4 8.8-6.7 6.6-3 3.7-8.8 1.4-8.6-3.4-4.7-.9-5.9-7.1-1.8-9.6.1-.8.6-1.6 1.5-2.3Z"/></svg>`;
  const SVG_CHAKRA=`<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M32 52C22 35 21 24 32 12C43 24 42 35 32 52Z"/><path d="M32 52C21 42 13 34 12 20C25 23 31 32 32 52Z"/><path d="M32 52C43 42 51 34 52 20C39 23 33 32 32 52Z"/></svg>`;
  const SVG_PAIR=`<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2"><circle cx="25" cy="32" r="14"/><circle cx="39" cy="32" r="14"/></svg>`;
  const bestForRow=s.card_best_for?`
    <div class="msotd-detail-row">
      <div class="msotd-badge msotd-badge--bestfor">${SVG_BESTFOR}</div>
      <div class="msotd-detail-copy"><span class="msotd-detail-lbl">Best For</span><span class="msotd-detail-val">${escapeAttr(s.card_best_for)}</span></div>
    </div>`:'';
  const chakraRow=s.primary_chakra?`
    <div class="msotd-detail-row">
      <div class="msotd-badge msotd-badge--chakra">${SVG_CHAKRA}</div>
      <div class="msotd-detail-copy"><span class="msotd-detail-lbl">Primary Chakra</span><span class="msotd-detail-val">${escapeAttr(s.primary_chakra)}</span></div>
    </div>`:'';
  const pairRow=s.card_pair_with?`
    <div class="msotd-detail-row">
      <div class="msotd-badge msotd-badge--pair">${SVG_PAIR}</div>
      <div class="msotd-detail-copy"><span class="msotd-detail-lbl">Pair With</span><span class="msotd-detail-val">${escapeAttr(s.card_pair_with)}</span></div>
    </div>`:'';
  const detailRows=bestForRow||chakraRow||pairRow
    ?`<div class="msotd-details">${bestForRow}${chakraRow}${pairRow}</div>`:'';
  container.innerHTML=`
    <div class="msotd-card" style="${_mCardVars}">
      ${_mEyebrowHtml}
      <div class="msotd-image-wrap">
        ${photoHtml}
        <div class="msotd-overlay">
          <h3 class="msotd-name ${nameSizeClass}">${sname}</h3>
          <span class="msotd-name-rule" aria-hidden="true"></span>
          ${s.card_quality_pill?`<div class="msotd-pill" style="${pillStyle}">${escapeAttr(s.card_quality_pill)}</div>`:''}
        </div>
      </div>
      <div class="msotd-body">
        ${useWhenText?`<div class="msotd-use-when"><span class="msotd-use-label">Use When</span><p class="msotd-use-text">${escapeAttr(useWhenText)}</p></div>`:''}
        <div class="msotd-actions">
          <button class="msotd-btn-primary msfc-btn-enc" type="button" data-sotd-id="${sid}" data-sotd-name="${sname}"><span class="sotd-action-icon msotd-btn-icon" aria-hidden="true">${SVG_BOOK}</span><span class="sotd-action-label">View Full Entry</span></button>
          <div class="msotd-secondary-row">
            <button class="msotd-btn-secondary msfc-btn-coll" type="button" data-sotd-id="${sid}" data-sotd-name="${sname}"><span class="sotd-action-icon msotd-btn-icon" aria-hidden="true">${SVG_HEART}</span><span class="sotd-action-label">Add to Collection</span></button>
            <button class="msotd-btn-secondary msfc-btn-wish" type="button" data-sotd-id="${sid}" data-sotd-name="${sname}" aria-pressed="false"><span class="sotd-action-icon msotd-btn-icon" aria-hidden="true">${SVG_BOOKMARK}</span><span class="sotd-action-label">Wishlist</span></button>
          </div>
        </div>
        ${detailRows}
      </div>
      ${s.card_note?`<div class="msotd-practice"><div class="msotd-practice-label">✦ TODAY'S PRACTICE ✦</div><p class="msotd-practice-text">${escapeAttr(s.card_note)}</p></div>`:''}
    </div>`;
  container.querySelector('.msfc-btn-enc').addEventListener('click',()=>{
    setSotdContext('home',s);detailReturnContext={type:'home-sotd'};openDetail(s.id);
  });
  const mCollBtn=container.querySelector('.msfc-btn-coll');
  if(mCollBtn){
    mCollBtn.addEventListener('click',function(){
      if(!_currentUser){savePendingDrawerAction('add_to_collection',{i:sid,n:s.name});_openAuth('save-collection');return;}
      addPieceReturnContext={type:'sotd',stoneId:sid};openAddForm(sid);
    });
  }
  const mWishBtn=container.querySelector('.msfc-btn-wish');
  if(mWishBtn){
    mWishBtn.addEventListener('click',function(){
      if(!_currentUser){savePendingDrawerAction('add_to_wishlist',{i:sid,n:s.name});_openAuth('save-wishlist');return;}
      sotdWishlistDirect(sid);
    });
  }
  updateMobileSotdAuth();
}

function _sotdMapStone(stone,meta){
  const c=CRYSTALS.find(cr=>cr.i===stone.id);
  return{
    id:stone.id,
    name:stone.name,
    photo:c?stonePhotoFile(c):'',
    hex:c?(c.ch||'#c8bca8'):(stone.color_hex||'#c8bca8'),
    card_quality_pill:stone.card_quality_pill||'',
    card_summary:stone.card_summary||'',
    card_use_when:stone.card_use_when||'',
    card_best_for:stone.card_best_for||'',
    primary_chakra:stone.primary_chakra||'',
    card_pair_with:stone.card_pair_with||'',
    card_note:stone.card_note||'',
    event_name:meta&&meta.event_name||null,
    event_category:meta&&meta.event_category||null,
    selection_type:meta&&meta.selection_type||null
  };
}

async function renderSotd(){
  let s=null;
  let isOfflineFallback=false;

  if(typeof _supa!=='undefined'){
    // Step 1 — server-side resolver (authoritative)
    try{
      const {data,error}=await _supa.rpc('get_stone_of_day');
      if(!error&&data&&data.stone){
        s=_sotdMapStone(data.stone,data);
      }
    }catch(err){console.warn('SOTD RPC failed, trying history fallback:',err);}

    // Step 2 — direct history read (RPC failed but Supabase is reachable)
    if(!s){
      try{
        const today=localDateKey();
        const {data:hRow,error:hErr}=await _supa
          .from('stone_of_day_history')
          .select('stone_id,selection_type,event_name,event_category')
          .eq('feature_date',today)
          .maybeSingle();
        if(!hErr&&hRow&&hRow.stone_id){
          const {data:stoneRow,error:sErr}=await _supa
            .from('stones')
            .select('id,name,card_quality_pill,card_summary,card_use_when,card_best_for,primary_chakra,card_pair_with,card_note,color_hex,collection_tier')
            .eq('id',hRow.stone_id)
            .single();
          if(!sErr&&stoneRow){
            s=_sotdMapStone(stoneRow,hRow);
          }
        }
      }catch(err){console.warn('SOTD history fallback failed, trying schedule:',err);}
    }

    // Step 3 — direct schedule read (history also failed, read-only display)
    if(!s){
      try{
        const today=localDateKey();
        const {data:sched,error:scErr}=await _supa
          .from('stone_of_day_schedule')
          .select('stone_id,selection_type,event_name,event_category')
          .eq('feature_date',today)
          .eq('is_active',true)
          .maybeSingle();
        if(!scErr&&sched&&sched.stone_id){
          const {data:stoneRow,error:sErr}=await _supa
            .from('stones')
            .select('id,name,card_quality_pill,card_summary,card_use_when,card_best_for,primary_chakra,card_pair_with,card_note,color_hex,collection_tier')
            .eq('id',sched.stone_id)
            .single();
          if(!sErr&&stoneRow){
            s=_sotdMapStone(stoneRow,sched);
          }
        }
      }catch(err){console.warn('SOTD schedule fallback failed, using offline local fallback:',err);}
    }
  }

  // Step 4 — offline local fallback (Supabase completely unreachable)
  if(!s){
    isOfflineFallback=true;
    console.warn('SOTD: Supabase unavailable — displaying local offline fallback. This stone has NOT been written to history.');
    s=deterministicSotdFallback();
  }
  if(!s)return;
  renderMobileSotdCard(s);
  renderDesktopSotdCard(s);
  // Wire up the hero "Today's stone" line
  const sotdRow=document.getElementById('hero-sotd-row');
  const sotdLink=document.getElementById('hero-sotd-link');
  if(sotdRow&&sotdLink){
    sotdLink.textContent=s.name+' →';
    sotdLink.onclick=(e)=>{e.preventDefault();openDetail(s.id);};
    sotdRow.style.display='flex';
  }
  const container=document.getElementById('sotd-container');
  if(!container)return;
  const cardInner=s.photo
    ?`<img class="sotd-card-img" src="${SUPABASE_STONES}${s.photo}" alt="${s.name}" loading="lazy">`
    :``;
  const cardStyle=s.photo?``:`style="background:${s.hex||'#c8bca8'}"`;
  container.innerHTML=`<div class="sotd-wrap">
    <div class="sotd-card" onclick="openDetail('${s.id}')" style="cursor:pointer" ${cardStyle}>
      ${cardInner}
      <div class="sotd-card-overlay${s.photo?'':' sotd-card-overlay--nophoto'}">
        <div class="sotd-card-label">Stone of the Day</div>
        <div class="sotd-card-name">${s.name}</div>
        <div class="sotd-card-tagline">${s.use}</div>
      </div>
    </div>
  </div>`;
}

// ── SOTD Calendar — moved to encyclopedia.js ──

// ── INIT ──
function updateStoneCounts(){
  const n=CRYSTALS.length;
  const stoneCountEl=document.getElementById('stone-count');
  if(stoneCountEl)stoneCountEl.textContent=n+' entries';
  ['intro-stone-count','browse-stone-count','divider-stone-count','hero-stone-count','explore-stone-count'].forEach(id=>{const el=document.getElementById(id);if(el)el.textContent=n;});
}

function init(){
  if('scrollRestoration' in history){history.scrollRestoration='manual';}
  renderSotd();
  // Load custom encyclopedia entries
  customEntries.forEach(e=>{if(!CRYSTALS.find(c=>c.i===e.i))CRYSTALS.push(e);});
  updateStoneCounts();
  // Encyclopedia-only initialisation (skipped on homepage)
  const isEncyclopediaPage=!!document.getElementById('crystal-grid');
  if(isEncyclopediaPage){
    buildEncPanels();
    renderEncTierPreview();
    renderEncTierCounts();
    buildMoodGroupPills();
    initNarrowByDelegation();
    buildYearSelect('f-year');

    // Read the intended tab BEFORE any rendering so we can hide encyclopedia immediately
    // and avoid the flash where encyclopedia briefly appears before the real target tab.
    const urlTab=(()=>{try{const p=new URLSearchParams(window.location.search).get('tab');return(['mood','encyclopedia','identify','collection','101'].includes(p)?p:null);}catch(e){return null;}})();
    const rememberedTab=urlTab||'encyclopedia';

    // Apply the target tab immediately — before encRender() — so the correct tab is
    // the first thing the user sees. encRender() then renders into a hidden section.
    if(['mood','collection','identify','101'].includes(rememberedTab)){
      switchTabByName(rememberedTab);
      if(rememberedTab==='collection'){
        // Auth hasn't resolved yet; show a loading state until loadSupabaseState fires.
        const wrap=document.getElementById('coll-wrap');
        if(wrap)wrap.innerHTML='<div class="empty-coll">Loading your collection…</div>';
      }
    }

    // Always populate the encyclopedia grid (it may be hidden, but ready on tab switch).
    encRender();
    resolveDirectStoneOpen();

    // Populate collection stats for non-collection tabs (collection tab is handled above
    // and will be re-rendered by loadSupabaseState once auth resolves).
    if(rememberedTab!=='collection'){
      renderCollection();
    }
  }
  scrollPageTop();
  if(typeof handleOutsideClick==='function') document.addEventListener('click',handleOutsideClick);
  initPWA();
}

function buildYearSelect(id){
  const sel=document.getElementById(id);
  if(!sel||sel.options.length>1)return;
  const yr=new Date().getFullYear();
  for(let y=yr;y>=2010;y--) sel.innerHTML+=`<option value="${y}">${y}</option>`;
  sel.innerHTML+=`<option value="2009">2009 or earlier</option>`;
}

// ── TABS ──
function clearInitialTabStyle(){
  const el=document.getElementById('initial-tab-style');
  if(el)el.remove();
}
function rememberActiveTab(name){
  try{localStorage.setItem('spl_active_tab',name);}catch(e){}
}
function syncTabUrl(name){
  if(!document.getElementById('crystal-grid') || !history.replaceState) return;
  try{
    const url=new URL(window.location.href);
    url.searchParams.set('tab',name);
    history.replaceState(null,'',url.pathname+url.search+url.hash);
  }catch(e){}
}
function getTabButton(name){
  const map={mood:1,encyclopedia:2,identify:3,collection:4,'101':5};
  const idx=map[name];
  return idx===undefined?null:document.querySelectorAll('.nav-tab')[idx];
}
function setMobileMenuOpen(open){
  document.body.classList.toggle('mobile-nav-open', !!open);
  document.querySelectorAll('.mobile-menu-toggle').forEach(btn=>{
    btn.classList.toggle('active', !!open);
    btn.setAttribute('aria-expanded', String(!!open));
    btn.setAttribute('aria-label', open ? 'Close navigation menu' : 'Open navigation menu');
  });
}
function toggleMobileNav(btn){
  const open=!document.body.classList.contains('mobile-nav-open');
  setMobileMenuOpen(open);
  if(btn) btn.setAttribute('aria-expanded', String(open));
}
function closeMobileNav(){
  setMobileMenuOpen(false);
}
function switchToWishlist(btn){
  closeMobileNav();
  switchTab('collection', getTabButton('collection'));
  setCollQuickFilter('wish');
  document.querySelectorAll('.nav-tab').forEach(b=>b.classList.remove('active'));
  if(btn) btn.classList.add('active');
}
function setWishlistNavActive(){
  if(!window.matchMedia || !window.matchMedia('(max-width: 768px)').matches) return;
  document.querySelectorAll('.nav-tab').forEach(b=>b.classList.remove('active'));
  const wishBtn=document.querySelector('.nav-tab-mobile-only');
  if(wishBtn)wishBtn.classList.add('active');
}
function switchTab(name,btn){
  clearInitialTabStyle();
  closeMobileNav();
  rememberActiveTab(name);
  syncTabUrl(name);
  document.querySelectorAll('main>section').forEach(s=>s.style.display='none');
  document.querySelectorAll('.nav-tab').forEach(b=>b.classList.remove('active'));
  const tab=document.getElementById('tab-'+name);
  if(tab)tab.style.display='block';
  const _navBtn=btn||getTabButton(name);
  _navBtn?.classList.add('active');
  _navBtn?.scrollIntoView({behavior:'smooth',block:'nearest',inline:'center'});
  scrollPageTop();
  if(name==='101'){init101();setTimeout(()=>{const pane=document.querySelector('.c101-content-pane');if(pane)pane.scrollTop=0;},50);}
  if(name==='identify'){initId2();}
  if(name==='collection'){collQuickFilter='all';document.querySelectorAll('.stat-clickable').forEach(el=>el.classList.remove('active-stat'));const tc=document.getElementById('stat-cell-total');if(tc)tc.classList.add('active-stat');renderCollection();}
  if(name==='encyclopedia'){restoreEncLanding();}
}
function switchTabByName(name){
  clearInitialTabStyle();
  closeMobileNav();
  rememberActiveTab(name);
  syncTabUrl(name);
  document.querySelectorAll('main>section').forEach(s=>s.style.display='none');
  document.querySelectorAll('.nav-tab').forEach(b=>b.classList.remove('active'));
  const tab=document.getElementById('tab-'+name);
  if(tab)tab.style.display='block';
  const _navBtn=getTabButton(name);
  _navBtn?.classList.add('active');
  _navBtn?.scrollIntoView({behavior:'smooth',block:'nearest',inline:'center'});
  scrollPageTop();
  if(name==='101'){init101();}
  if(name==='identify'){initId2();}
  if(name==='collection'){renderCollection();}
  if(name==='encyclopedia'){restoreEncLanding();}
}

function scrollToTabTop(name){
  let el;
  if(name==='101'){
    el=document.getElementById('c101-nav')||document.getElementById('tab-101');
  }else{
    el=document.getElementById('tab-'+name)||document.querySelector('main.content');
  }
  if(!el)return;
  const y=el.getBoundingClientRect().top+window.scrollY-112;
  try{window.scrollTo({top:Math.max(0,y),left:0,behavior:'smooth'});}catch(e){window.scrollTo(0,Math.max(0,y));}
}

// ── POPUPS ──
function openPopup(n){const el=document.getElementById('popup-'+n);if(el)el.classList.add('open');}
function closePopup(n){const el=document.getElementById('popup-'+n);if(el)el.classList.remove('open');}

// ── COMBOBOX / TYPE-AHEAD ──
function sortedCrystals(list){
  return [...list].sort((a,b)=>(a.n||'').localeCompare((b.n||''),undefined,{sensitivity:'base'}));
}
function comboRender(dropId,valId,query){
  const drop=document.getElementById(dropId);
  if(!drop)return;
  const q=(query||'').toLowerCase().trim();
  const source=sortedCrystals(CRYSTALS);
  const matches=q?source.filter(c=>c.n.toLowerCase().includes(q)||(c.a&&c.a.toLowerCase().includes(q))).slice(0,50):source.slice(0,50);
  drop.innerHTML='';
  if(!matches.length){drop.innerHTML='<div class="combobox-empty">No crystals found</div>';return;}
  matches.forEach(c=>{
    const opt=document.createElement('div');
    opt.className='combobox-option';
    opt.textContent=c.n;
    opt.dataset.id=c.i;
    opt.dataset.name=c.n;
    opt.addEventListener('mousedown',function(e){
      e.preventDefault();
      comboSelect(c.i,c.n,e,dropId,valId);
    });
    opt.addEventListener('click',function(e){
      comboSelect(c.i,c.n,e,dropId,valId);
    });
    drop.appendChild(opt);
  });
}
function comboFilter(wrapId,inputId,dropId,valId){
  const input=document.getElementById(inputId);
  const valEl=document.getElementById(valId);
  if(valEl)valEl.value='';
  const q=input?input.value:'';
  if(q.length===0){comboClose(dropId);return;}
  comboOpen(dropId);
  comboRender(dropId,valId,q);
}
function comboOpen(dropId){document.getElementById(dropId)?.classList.add('open');}
function comboClose(dropId){document.getElementById(dropId)?.classList.remove('open');}
function comboSelect(crystalId,crystalName,e,dropId,valId){
  e&&e.stopPropagation();
  const valEl=document.getElementById(valId);if(valEl)valEl.value=crystalId;
  const inputId=dropId.replace('-drop','-input');
  const input=document.getElementById(inputId);if(input)input.value=crystalName;
  const selId=dropId.replace('-drop','-selected');
  const selEl=document.getElementById(selId);if(selEl)selEl.textContent=crystalId;
  comboClose(dropId);
}
function comboKey(e,dropId,inputId,valId){
  const drop=document.getElementById(dropId);if(!drop)return;
  const opts=drop.querySelectorAll('.combobox-option');
  const focused=drop.querySelector('.combobox-option.focused');
  let idx=focused?Array.from(opts).indexOf(focused):-1;
  if(e.key==='ArrowDown'){e.preventDefault();idx=Math.min(idx+1,opts.length-1);opts.forEach((o,i)=>o.classList.toggle('focused',i===idx));}
  else if(e.key==='ArrowUp'){e.preventDefault();idx=Math.max(idx-1,0);opts.forEach((o,i)=>o.classList.toggle('focused',i===idx));}
  else if(e.key==='Enter'&&focused){focused.click();}
  else if(e.key==='Escape'){comboClose(dropId);}
}
document.addEventListener('click',function(e){
  if(!e.target.closest('.combobox-wrap')){
    document.querySelectorAll('.combobox-dropdown').forEach(d=>d.classList.remove('open'));
  }
});

const ADMIN_EMAILS = ['kikiholz31@duck.com', 'christieholzwarth@gmail.com', 'dustin@stillpointdfw.com'];
function isAdminUser(user){
  const email=(user&&user.email?user.email:'').toLowerCase();
  return ADMIN_EMAILS.map(e=>String(e).toLowerCase()).includes(email);
}
function updateAdminEntryButtons(){
  const add=document.getElementById('add-entry-btn');
  const req=document.getElementById('request-entry-btn');
  const isAdmin=isAdminUser(_currentUser);
  if(add)add.style.display=isAdmin?'':'none';
  if(req)req.style.display=isAdmin?'none':'';
  document.querySelectorAll('.manage-admin-only').forEach(el=>el.style.display=isAdmin?'flex':'none');
}
function openEntryRequestForm(){
  const el=document.getElementById('entry-request-form-overlay');if(el)el.classList.add('open');
}
document.addEventListener('DOMContentLoaded',function(){
  document.getElementById('request-entry-btn')?.addEventListener('click',openEntryRequestForm);
});
function closeEntryRequestForm(){
  const el=document.getElementById('entry-request-form-overlay');if(el)el.classList.remove('open');
  ['req-stone-name','req-stone-notes'].forEach(id=>{const field=document.getElementById(id);if(field)field.value='';});
}
function entryRequestText(){
  const name=(document.getElementById('req-stone-name')?.value||'').trim();
  const notes=(document.getElementById('req-stone-notes')?.value||'').trim();
  if(!name){alert('Stone / Variety name is required.');return'';}
  return `Still Point Lapidary entry request

Stone / Variety: ${name}

Notes:
${notes||'—'}`;
}
async function copyEntryRequest(){
  const text=entryRequestText();if(!text)return;
  try{await navigator.clipboard.writeText(text);alert('Entry request copied.');}
  catch(e){alert(text);}
}
async function submitEntryRequest(){
  const name=(document.getElementById('req-stone-name')?.value||'').trim();
  const notes=(document.getElementById('req-stone-notes')?.value||'').trim();
  if(!name){alert('Stone / Variety name is required.');return;}
  const btn=document.querySelector('#entry-request-form-overlay .btn-accent');
  const oldText=btn?btn.textContent:'';
  if(btn){btn.disabled=true;btn.textContent='Sending…';}
  try{
    const res=await fetch('https://formspree.io/f/xeedwkly',{
      method:'POST',
      headers:{'Content-Type':'application/json','Accept':'application/json'},
      body:JSON.stringify({'Stone name':name,'Notes':notes||'—'})
    });
    if(res.ok){
      closeEntryRequestForm();
      alert('Request sent! We\'ll review it and add it to the encyclopedia.');
    } else {
      alert('Something went wrong. Please try again.');
    }
  }catch(e){
    alert('Could not send — please check your connection and try again.');
  }finally{
    if(btn){btn.disabled=false;btn.textContent=oldText;}
  }
}

function updateLastSaved(){
  const el=document.getElementById('last-saved-display');
  if(!el)return;
  const ts=localStorage.getItem('lap_last_saved');
  if(!ts){el.textContent='';return;}
  const d=new Date(ts);
  el.textContent='Last piece added: '+d.toLocaleDateString()+' at '+d.toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'});
}

// ── START ──
async function loadStonesAndInit() {
  // Load mood data JSON files non-blocking; used only when user enters mood/intention features
  fetch('data/mood-theme-map.json').then(r=>r.json()).then(d=>{MOOD_THEME_MAP=d;}).catch(()=>{});
  fetch('data/sub-filters.json').then(r=>r.json()).then(d=>{SUB_FILTERS=d;}).catch(()=>{});
  fetch('data/sub-filter-kw.json').then(r=>r.json()).then(d=>{SUB_FILTER_KW=d;}).catch(()=>{});
  loadStoneIntentionReasons(); // non-blocking; enriches Why text when stones are available
  const CACHE_KEY = 'spl_stones_cache';
  const CACHE_VER = 'v4';

  function mapRow(r) {
    const cats = Array.isArray(r.color_categories) ? r.color_categories : (r.color_categories ? [r.color_categories] : []);
    const er1  = (r.energetic_role_1 || '').toLowerCase();
    const er2  = (r.energetic_role_2 || '').toLowerCase();
    const er3  = (r.energetic_role_3 || '').toLowerCase();
    const pt   = (r.primary_theme   || '').toLowerCase();
    const at   = (r.all_themes      || []).map(t => t.toLowerCase()).join(' ');
    return {
      i:             r.id,
      slug:          r.slug              || '',
      n:             r.name              || '',
      a:             r.alternate_names   || '',
      fam:           r.family            || '',
      sp:            r.species           || '',
      sy:            r.crystal_system    || '',
      fo:            r.formation         || '',
      tr:            r.transparency      || '',
      c:             r.color             || '',
      ch:            r.color_hex         || '',
      cc:            r.color_cause       || '',
      m:             r.mohs              || '',
      g:             r.geo_notes         || '',
      er1:           r.energetic_role_1  || '',
      er2:           r.energetic_role_2  || '',
      er3:           r.energetic_role_3  || '',
      uw:            r.use_when          || '',
      chakras:       r.chakras           || [],
      element:       r.element           || '',
      zodiac:        r.zodiac            || '',
      aff:           r.affirmation       || '',
      col_cat:       cats[0]             || '',
      col_cats:      cats,
      isMulti:       cats.length > 1,
      primary_theme:  r.primary_theme     || '',
      all_themes:     r.all_themes       || [],
      intention_tags: r.intention_tags   || [],
      tier:           r.collection_tier  || null,
      man_made:      r.is_man_made       || false,
      tox:           r.toxicity_note     || '',
      card_props:    Array.isArray(r.card_properties) ? r.card_properties : [],
      card_best_for: r.card_best_for     || '',
      o:             false,
      w:             false,
      _search:       [er1, er2, er3, pt, at].join(' '),
    };
  }

  function fetchFresh() {
    return _supa.from('stones').select('*').order('id').then(({ data, error }) => {
      if (error || !data || !data.length) throw error || new Error('No data');
      const mapped = data.map(mapRow);
      try {
        localStorage.setItem(CACHE_KEY, JSON.stringify({ ver: CACHE_VER, data: mapped, ts: Date.now() }));
      } catch(e) {}
      return mapped;
    });
  }

  // ── Try cache ──
  let hasCacheData = false;
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (raw) {
      const cached = JSON.parse(raw);
      if (cached.ver === CACHE_VER && Array.isArray(cached.data) && cached.data.length > 0) {
        CRYSTALS.push(...cached.data);
        hasCacheData = true;
      }
    }
  } catch(e) {}

  if (hasCacheData) {
    // Init immediately, refresh silently in background
    init();
    updateLastSaved();
    fetchFresh().then(fresh => {
      CRYSTALS.length = 0;
      CRYSTALS.push(...fresh);
      updateStoneCounts();
      if(document.getElementById('crystal-grid')){
        // Reset tier preview so it re-renders with fresh data
        const t1=document.getElementById('enc-tier-1-grid');
        if(t1)delete t1.dataset.rendered;
        ['2','3','4'].forEach(n=>{const g=document.getElementById('enc-acc-'+n+'-grid');if(g)delete g.dataset.rendered;});
        renderEncTierPreview();
        renderEncTierCounts();
        if(!encDoorwayDismissed)return;
        encRender();
        resolveDirectStoneOpen();
      }
    }).catch(e => console.warn('Background stone refresh failed:', e));
  } else {
    // First visit — show loader, wait for fetch, then init
    const loader = document.getElementById('stones-loader');
    if (loader) loader.style.display = 'flex';
    let loadFailed = false;
    try {
      const fresh = await fetchFresh();
      CRYSTALS.push(...fresh);
    } catch(e) {
      console.error('Failed to load stones from Supabase:', e);
      loadFailed = true;
    }
    if (loader) loader.style.display = 'none';
    if (loadFailed) {
      const errEl = document.getElementById('stones-error');
      if (errEl) errEl.style.display = 'block';
    }
    init();
    updateLastSaved();
  }
}


function scrollPageTop(){
  try{window.scrollTo({top:0,left:0,behavior:'smooth'});}catch(e){window.scrollTo(0,0);}
}
function scrollElementTop(id){
  const el=document.getElementById(id);
  if(el)el.scrollTop=0;
}

// ── ADD FORM ──
function openAddForm(preselect){
  const title=document.querySelector('#add-form-overlay .form-title');if(title)title.textContent='Add a piece';
  const sub=document.querySelector('#add-form-overlay .form-sub');if(sub)sub.textContent='Each entry is a specific physical piece in your collection.';
  const saveBtn=document.querySelector('#add-form-overlay .form-footer .btn-accent');if(saveBtn)saveBtn.textContent='Save piece';
  // Init combobox
  const ci2=document.getElementById('f-crystal-input');const cv2=document.getElementById('f-crystal-val');const cs3=document.getElementById('f-crystal-selected');
  if(preselect){const pc=CRYSTALS.find(x=>x.i===preselect);if(ci2&&pc)ci2.value=pc.n;if(cv2)cv2.value=preselect||'';if(cs3)cs3.textContent=preselect||'';}else{if(ci2)ci2.value='';if(cv2)cv2.value='';if(cs3)cs3.textContent='';}
  comboRender('f-crystal-drop','f-crystal-val',preselect&&CRYSTALS.find(x=>x.i===preselect)?CRYSTALS.find(x=>x.i===preselect).n:'');
  populateCombos();pendingPhotos=[];existingEditPhotos=[];editPrimaryPhotoKey=null;
  const pr=document.getElementById('photo-preview-row');if(pr)pr.innerHTML='';
  document.getElementById('add-form-overlay').classList.add('open');
  scrollElementTop('add-form-overlay');
  scrollPageTop();
}
function closeAddForm(){
  const _returnIdx=editingCollectionIndex;
  editingCollectionIndex=null;
  const title=document.querySelector('#add-form-overlay .form-title');if(title)title.textContent='Add a piece';
  const sub=document.querySelector('#add-form-overlay .form-sub');if(sub)sub.textContent='Each entry is a specific physical piece in your collection.';
  const saveBtn=document.querySelector('#add-form-overlay .form-footer .btn-accent');if(saveBtn)saveBtn.textContent='Save piece';
  document.getElementById('add-form-overlay').classList.remove('open');
  document.getElementById('add-form-overlay').querySelectorAll('input:not([type=file]),select,textarea').forEach(el=>el.value='');
  document.querySelectorAll('#add-form-overlay input[type=checkbox]').forEach(el=>el.checked=false);
  const ci=document.getElementById('f-crystal-input');const cv=document.getElementById('f-crystal-val');const cs2=document.getElementById('f-crystal-selected');
  if(ci)ci.value='';if(cv)cv.value='';if(cs2)cs2.textContent='';
  const cs=document.getElementById('combo-section');if(cs)cs.style.display='none';
  const cr=document.getElementById('combo-rows');if(cr)cr.innerHTML='<div class="combo-row"><select class="csel"><option value="">Select crystal…</option></select><button class="rm-combo" onclick="rmCombo(this)">×</button></div>';
  populateCombos();pendingPhotos=[];existingEditPhotos=[];editPrimaryPhotoKey=null;
  const pr=document.getElementById('photo-preview-row');if(pr)pr.innerHTML='';
  // Reset date dropdowns
  const mo=document.getElementById('f-month');const dy=document.getElementById('f-day');
  if(mo){mo.disabled=true;}if(dy){dy.disabled=true;}
  if(addPieceReturnContext&&addPieceReturnContext.type==='sotd'){addPieceReturnContext=null;window.location.href='index.html';return;}
  if(_returnIdx!==null&&_returnIdx!==undefined)openCollDetail(_returnIdx);
}
function toggleCombo(){
  const cs=document.getElementById('combo-section');
  if(cs)cs.style.display=document.getElementById('f-combo').checked?'block':'none';
}
function populateCombos(){
  const opts='<option value="">Select crystal…</option>'+sortedCrystals(CRYSTALS).map(c=>`<option value="${c.i}">${c.n}</option>`).join('');
  document.querySelectorAll('.csel').forEach(s=>s.innerHTML=opts);
}
function addComboRow(){
  const rows=document.getElementById('combo-rows');
  if(!rows||rows.querySelectorAll('.combo-row').length>=3)return;
  const div=document.createElement('div');div.className='combo-row';
  div.innerHTML='<select class="csel"><option value="">Select crystal…</option></select><button class="rm-combo" onclick="rmCombo(this)">×</button>';
  rows.appendChild(div);populateCombos();
}
function rmCombo(btn){const r=btn.closest('.combo-row');if(document.getElementById('combo-rows').querySelectorAll('.combo-row').length>1)r.remove();}


function photoSrcForPreview(item){
  if(!item)return'';
  if(typeof item==='string')return item;
  return item.preview||item.url||item.signedUrl||item.src||'';
}
function photoKey(item,kind,idx){
  if(!item)return kind+'-'+idx;
  if(item.id)return 'existing-'+item.id;
  if(item.storage_path)return 'path-'+item.storage_path;
  if(item._pendingId)return item._pendingId;
  return kind+'-'+idx;
}
function renderPhotoPreviewRow(){
  const row=document.getElementById('photo-preview-row');
  if(!row)return;
  const existing=(editingCollectionIndex!==null)?existingEditPhotos:[];
  const all=[...existing.map((p,i)=>({item:p,kind:'existing',idx:i})),...pendingPhotos.map((p,i)=>({item:p,kind:'pending',idx:i}))];
  row.innerHTML='';
  all.forEach(entry=>{
    const src=photoSrcForPreview(entry.item);
    if(!src)return;
    const key=photoKey(entry.item,entry.kind,entry.idx);
    if(!editPrimaryPhotoKey&&entry.idx===0&&entry.kind==='existing')editPrimaryPhotoKey=key;
    const item=document.createElement('div');
    item.className='photo-preview-item'+(editPrimaryPhotoKey===key?' primary':'');
    const rm=entry.kind==='pending'?`<button class="photo-preview-rm" onclick="removePhoto(${entry.idx},this)">×</button>`:'';
    item.innerHTML=`<img src="${escapeAttr(src)}" alt="preview">${rm}<button type="button" class="photo-preview-primary" onclick="setPrimaryPhoto('${escapeAttr(key)}')">Primary</button>`;
    row.appendChild(item);
  });
}
function setPrimaryPhoto(key){
  editPrimaryPhotoKey=key;
  renderPhotoPreviewRow();
}
function previewPhotos(input){
  const existingCount=(editingCollectionIndex!==null?existingEditPhotos.length:0);
  const slots=Math.max(0,3-existingCount-pendingPhotos.length);
  Array.from(input.files).slice(0,slots).forEach(file=>{
    const reader=new FileReader();
    reader.onload=e=>{
      pendingPhotos.push({file:file,preview:e.target.result,_pendingId:'pending-'+Date.now()+'-'+Math.random().toString(36).slice(2)});
      if(!editPrimaryPhotoKey&&existingCount===0&&pendingPhotos.length===1){
        editPrimaryPhotoKey=pendingPhotos[0]._pendingId;
      }
      renderPhotoPreviewRow();
    };
    reader.readAsDataURL(file);
  });
  if(input.files&&input.files.length>slots&&slots===0){
    alert('You can keep up to 3 photos per piece.');
  }
  input.value='';
}
function removePhoto(idx,btn){
  const removed=pendingPhotos.splice(idx,1)[0];
  if(removed&&editPrimaryPhotoKey===removed._pendingId)editPrimaryPhotoKey=null;
  renderPhotoPreviewRow();
}

// ── PWA ADD TO HOME SCREEN ──
function initPWA(){
  // Only show once per browser session (sessionStorage resets when tab closes)
  if(sessionStorage.getItem('spl-pwa-shown')) return;
  // Don't show if permanently dismissed
  if(localStorage.getItem('spl-pwa-dismissed')) return;
  // Don't show if already installed as PWA
  if(window.matchMedia('(display-mode: standalone)').matches) return;
  setTimeout(()=>{
    // Don't show if user is logged in
    if(_currentUser) return;
    const banner = document.getElementById('pwa-banner');
    if(!banner) return;
    sessionStorage.setItem('spl-pwa-shown','1');
    const title = document.getElementById('pwa-banner-title');
    const body  = document.getElementById('pwa-banner-body');
    const cta   = document.getElementById('pwa-banner-cta');
    if(title) title.textContent = 'Every stone you love, in one place';
    if(body)  body.textContent  = 'Create a free account to save the stones you own, build your wishlist, and carry your collection with you.';
    if(cta){  cta.textContent = 'Create account'; cta.onclick = ()=>{ dismissPWA(true); _openAuth(); }; }
    banner.style.display='flex';
  }, 3000);
}
function dismissPWA(permanent){
  const banner = document.getElementById('pwa-banner');
  if(banner) banner.style.display='none';
  if(permanent) localStorage.setItem('spl-pwa-dismissed','1');
}



