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
  "C-0396": ["phantom-amethyst.webp"],
  "C-0397": ["phoenix-stone-large-sphere.webp", "phoenix-stone-palm.webp", "phoenix-stone-tower.webp", "phoenix-stone-small-sphere.webp"],
  "C-0398": ["pink-amethyst-heart.webp", "pink-amethyst-tumble.webp", "pink-amethyst-large-sphere.webp"],
  "C-0399": ["pink-petrified-wood-tumble.webp"],
  "C-0400": ["pink-serpentine-tumble.webp"],
  "C-0401": ["polarity-moonstone-sphere.webp"],
  "C-0402": ["preseli-bluestone-tumble.webp"],
  "C-0403": ["quartz-and-mica-on-dolomite-specimen.webp"],
  "C-0404": ["que-sera-stone-tumble.webp"],
  "C-0405": ["rainforest-jasper-tower.webp", "rainforest-rhyolite-tumble.webp"],
  "C-0406": ["red-hematite-specimen.webp"],
  "C-0407": ["red-vein-jasper-mushroom.webp"],
  "C-0408": ["rosasite-in-dolomite-specimen.webp"],
  "C-0409": ["rubellite-heart.webp", "rubellite-tumble.webp"],
  "C-0410": ["sardonyx-heart-family.webp", "sardonyx-palm.webp"],
  "C-0411": ["silver-sheen-obsidian-heart.webp"],
  "C-0412": ["sunset-sodalite-sphere.webp", "sunset-sodalite-tower.webp"],
  "C-0413": ["tiffany-stone-tumble.webp"],
  "C-0414": ["turquoise-in-quartz-specimen.webp"],
  "C-0415": ["unicorn-stone-tower.webp"],
  "C-0416": ["utah-wildfire-bubble-opal-heart.webp"],
  "C-0418": ["yellow-calcite-sphere.webp"],
};

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

const SFC_CHAKRA_COLORS={
  'Earth Star':   {bg:'#dedad6',text:'#5a5249'},
  'Root':         {bg:'#e6d0d0',text:'#6b3636'},
  'Sacral':       {bg:'#eeddd4',text:'#6b4530'},
  'Solar Plexus': {bg:'#ede8d0',text:'#6b5520'},
  'Heart':        {bg:'#d6e6d8',text:'#385838'},
  'Throat':       {bg:'#d4e0e8',text:'#2e4858'},
  'Third Eye':    {bg:'#dbd6e8',text:'#453868'},
  'Crown':        {bg:'#ded7ef',text:'#5e5080'}
};

// Banner colors — ultra-light chakra wash, barely deeper than the card ivory.
// Derived by blending each chakra hue ~8% into white; Third Eye targets #f3f0f8.
const SFC_BANNER_COLORS={
  'Earth Star':   '#f5f4f3',
  'Root':         '#f5f0f0',
  'Sacral':       '#f6f3f1',
  'Solar Plexus': '#f6f5f0',
  'Heart':        '#f1f6f2',
  'Throat':       '#f0f3f6',
  'Third Eye':    '#f3f0f8',
  'Crown':        '#f4f1fa',
};

// Button colors — pale tinted fill, ~5 units below the pill; clearly lighter than the banner.
// Keeps "View Full Entry" coordinated with the pill while being clearly distinct from plain text.
const SFC_BUTTON_COLORS={
  'Earth Star':   {bg:'#d9d5d1',border:'#b5afa8',text:'#5a5249'},
  'Root':         {bg:'#e0caca',border:'#c09090',text:'#6b3636'},
  'Sacral':       {bg:'#e8d7ce',border:'#c8a890',text:'#6b4530'},
  'Solar Plexus': {bg:'#e7e2ca',border:'#c5bb8a',text:'#6b5520'},
  'Heart':        {bg:'#d0e0d2',border:'#8ab88e',text:'#385838'},
  'Throat':       {bg:'#cedae2',border:'#8ab0c8',text:'#2e4858'},
  'Third Eye':    {bg:'#d6d1e4',border:'#a898cc',text:'#453868'},
  'Crown':        {bg:'#d9d2e9',border:'#b0a0d8',text:'#5e5080'},
};

// Kicker/icon accent colors — dark enough for ≥4.5:1 on the ultra-light header wash.
// Declared explicitly per chakra; do not derive at runtime from other palettes.
const SFC_KICKER_COLORS={
  'Earth Star':   '#5a5249',
  'Root':         '#6b3636',
  'Sacral':       '#6b4530',
  'Solar Plexus': '#6b5520',
  'Heart':        '#385838',
  'Throat':       '#2e4858',
  'Third Eye':    '#453868',
  'Crown':        '#5e5080',
};

// ── Chakra normalization ──────────────────────────────────────────────────────
// Canonical key list — the only values palette objects recognize.
const _SOTD_CHAKRA_CANONICAL=['Earth Star','Root','Sacral','Solar Plexus','Heart','Throat','Third Eye','Crown'];
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

// ── SOTD CALENDAR DATA LAYER ──────────────────────────────────────────────────
/**
 * Returns normalized SOTD data for every populated date in the requested month.
 * Reads stone_of_day_history (resolved dates, source of truth) and
 * stone_of_day_schedule (active editorial/special future dates).
 * Ordinary unresolved future dates are left empty — nothing is resolved or written.
 *
 * @param {number} year   Full year, e.g. 2026
 * @param {number} month  1-indexed month, e.g. 6 for June
 * @returns {Promise<Array<SotdCalendarEntry>|null>}
 *   null means the history query itself failed (caller should surface an error).
 *   An empty array means Supabase is reachable but no rows exist for the month.
 *
 * SotdCalendarEntry shape:
 *   date           {string}       'YYYY-MM-DD'
 *   stoneId        {string}
 *   source         {'history'|'schedule'}
 *   selectionType  {string|null}
 *   eventName      {string|null}
 *   eventCategory  {string|null}
 *   eventPriority  {number|null}
 *   eventLocation  {string|null}
 *   editorialNote  {string|null}
 *   sourceUrl      {string|null}
 *   isToday        {boolean}
 *   isPast         {boolean}
 *   isFuture       {boolean}
 */
async function getSotdCalendarMonth(year, month) {
  // "Today" in America/Chicago — for isToday / isPast / isFuture flags only.
  // Intl gives the correct Chicago date without an extra RPC round-trip.
  const todayChicago = new Date().toLocaleDateString('en-CA', { timeZone: 'America/Chicago' });

  if (typeof _supa === 'undefined') {
    console.warn('[SOTD Calendar] Supabase client unavailable — returning empty month.');
    return [];
  }

  const { data, error } = await _supa.rpc('get_sotd_calendar_month', {
    p_year:  year,
    p_month: month,
  });

  if (error) {
    console.error('[SOTD Calendar] get_sotd_calendar_month RPC failed:', error);
    return null;
  }

  const rows = data || [];

  // Map RPC snake_case columns to the public camelCase shape and attach
  // date-relative flags (computed client-side against Chicago today).
  return rows.map(r => ({
    date:          r.feature_date,
    stoneId:       r.stone_id,
    source:        r.source,                    // 'history' | 'schedule'
    selectionType: r.selection_type  || null,
    eventName:     r.event_name      || null,
    eventCategory: r.event_category  || null,
    eventPriority: r.event_priority  ?? null,
    eventLocation: r.event_location  || null,
    editorialNote: r.editorial_note  || null,
    sourceUrl:     r.source_url      || null,
    isToday:       r.feature_date === todayChicago,
    isPast:        r.feature_date <  todayChicago,
    isFuture:      r.feature_date >  todayChicago,
  }));
  // Note: RPC returns rows already sorted by feature_date; no client sort needed.
}

// ── SOTD CALENDAR UI ─────────────────────────────────────────────────────────

let _sotdCalYear  = null;
let _sotdCalMonth = null;
const _sotdCalCache     = new Map(); // 'YYYY-MM' → entries[] | null
const _sotdCalEntryStore = new Map(); // 'YYYY-MM-DD' → entry — for passing full entry to drawer

function _sotdCalChicagoToday() {
  return new Date().toLocaleDateString('en-CA', { timeZone: 'America/Chicago' });
}

// Look up a stone name from the already-loaded CRYSTALS array.
// Falls back to an empty string rather than exposing a raw ID.
function _sotdCalStoneName(stoneId) {
  const c = CRYSTALS.find(cr => cr.i === stoneId);
  return c ? c.n : '';
}

function _sotdCalMonthLabel(month) {
  return ['January','February','March','April','May','June',
          'July','August','September','October','November','December'][month - 1];
}

function openSotdCalendar(year, month) {
  if(!isAdminUser(_currentUser))return;
  const today = _sotdCalChicagoToday();
  const [ty, tm] = today.split('-').map(Number);
  _sotdCalYear  = year  || ty;
  _sotdCalMonth = month || tm;

  const overlay = document.getElementById('sotd-cal-overlay');
  if (!overlay) return;
  overlay.classList.add('open');
  document.body.classList.add('sotd-cal-open');

  _sotdCalRenderMonth(_sotdCalYear, _sotdCalMonth);

  // Return focus to close button after rendering settles.
  setTimeout(() => { document.getElementById('sotd-cal-close-btn')?.focus(); }, 60);
}

function closeSotdCalendar() {
  const overlay = document.getElementById('sotd-cal-overlay');
  if (!overlay) return;
  overlay.classList.remove('open');
  document.body.classList.remove('sotd-cal-open');
  document.getElementById('manage-btn')?.focus();
}

// ── Sitewide Icon Audition Library (admin-only, temporary) ───────────────────
// Consistent visual system: viewBox 0 0 24 24, stroke-width 1.5, round caps/joins, fill:none.
// All icons use currentColor. Do not update live mappings until each concept is approved.
const _si=p=>`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${p}</svg>`;

const _SICA_LIB=[

{family:'Daily Selection',desc:'Replaces generic clock — should read "chosen / curated" not "timekeeping"',options:[
  {label:'A — Rays (no circle)',svg:_si('<path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.93 4.93l2.12 2.12M16.95 16.95l2.12 2.12M4.93 19.07l2.12-2.12M16.95 7.05l2.12-2.12"/>')},
  {label:'B — Sun + circle',svg:_si('<circle cx="12" cy="12" r="4"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.93 4.93l2.12 2.12M16.95 16.95l2.12 2.12M4.93 19.07l2.12-2.12M16.95 7.05l2.12-2.12"/>')},
  {label:'C — 4-pt star',svg:_si('<path d="M12 2l2.5 7.5L22 12l-7.5 2.5L12 22l-2.5-7.5L2 12l7.5-2.5z"/>')},
  {label:'D — 8-ray sparkle',svg:_si('<path d="M12 2v4M12 18v4M2 12h4M18 12h4M5.64 5.64l2.83 2.83M15.54 15.54l2.83 2.83M5.64 18.36l2.83-2.83M15.54 8.46l2.83-2.83"/>')},
]},

{family:'Lunar',desc:'Must read as moon/lunar, not timekeeping. Stroke-consistent with set.',options:[
  {label:'A — Crescent (stroke)',svg:_si('<path d="M12 3a9 9 0 1 0 0 18A7 7 0 0 1 12 3z"/>')},
  {label:'B — Crescent + star',svg:_si('<path d="M12 3a9 9 0 1 0 0 18A7 7 0 0 1 12 3z"/><path d="M18.5 7.5l.7 2 2 .7-2 .7-.7 2-.7-2-2-.7 2-.7z"/>')},
  {label:'C — Thin crescent',svg:_si('<path d="M12 4a8 8 0 0 0 0 16A6 6 0 0 1 12 4z"/>')},
  {label:'D — Half-moon D-shape',svg:_si('<path d="M12 4a8 8 0 0 1 0 16V4z"/>')},
]},

{family:'Eclipse',desc:'Current two-circle version is promising. Three alternatives shown.',options:[
  {label:'A — Two circles (current)',svg:_si('<circle cx="9" cy="12" r="7"/><path d="M14.9 6.3A7 7 0 0 1 14.9 17.7"/>')},
  {label:'B — Annular ring',svg:_si('<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5.5"/>')},
  {label:'C — Offset overlap',svg:_si('<circle cx="10" cy="12" r="6.5"/><circle cx="15" cy="12" r="5.5"/>')},
  {label:'D — Circle + corona arc',svg:_si('<circle cx="12" cy="12" r="6"/><path d="M4.93 4.93A11 11 0 0 1 19.07 19.07M19.07 4.93A11 11 0 0 1 4.93 19.07"/>')},
]},

{family:'Celestial',desc:'Must differ clearly from Tradition. Suggest comet, orbit, or hex star.',options:[
  {label:'A — Comet + tail',svg:_si('<circle cx="7.5" cy="15.5" r="2.5"/><path d="M9.5 13.5L18 5"/><path d="M12 10.5l2-5.5M14 9.5l5.5-2.5"/>')},
  {label:'B — Orbit ellipse',svg:_si('<ellipse cx="12" cy="12" rx="10" ry="4.5" transform="rotate(-25 12 12)"/><circle cx="12" cy="2.5" r="2"/>')},
  {label:'C — 6-pt star (hex)',svg:_si('<path d="M12 2l2.4 4.2 4.8.6-3.4 3.4.8 4.8L12 12.8l-4.6 2.2.8-4.8-3.4-3.4 4.8-.6z"/><path d="M8.6 17.4l-2 4.6M15.4 17.4l2 4.6M3.8 8.8l-1.8 0M22 8.8l-1.8 0"/>')},
  {label:'D — Shooting star arc',svg:_si('<path d="M5 19L19 5"/><path d="M19 5l-4 1M19 5l-1 4"/><path d="M5 19l1-4M5 19l4-1"/><circle cx="12" cy="12" r="1.5"/>')},
]},

{family:'Meteor',desc:'Current reads as arrow. Should convey falling/impact, not direction.',options:[
  {label:'A — Fireball + trail',svg:_si('<circle cx="7" cy="16" r="3"/><path d="M9.5 13.5L18 5"/><path d="M13 9.5l3.5-6.5M15 8.5l6-2"/>')},
  {label:'B — Three streaks shower',svg:_si('<path d="M17 3L7 17M20 6L10 20M14 2L4 16"/>')},
  {label:'C — Streak + impact burst',svg:_si('<path d="M18 3L8 16"/><circle cx="7.5" cy="16.5" r="2.5"/><path d="M4 14l1.5 2M3 17l2 .5M5 20l1.5-1.5M9 19l.5-2"/>')},
  {label:'D — Radiant falling',svg:_si('<path d="M12 2l-4 16M12 2l0 16M12 2l4 16"/><path d="M7 15l-.5 1.5M12 15v1.5M17 15l.5 1.5"/>')},
]},

{family:'Tradition',desc:'Must differ from Celestial. Cultural warmth: candle, lantern, lotus.',options:[
  {label:'A — Candle + flame',svg:_si('<rect x="9" y="9" width="6" height="13" rx="1"/><path d="M12 9V6"/><path d="M10.5 7.5C10.5 5.5 12 4 12 2c.5 2 1.5 3 1.5 5.5"/>')},
  {label:'B — Lantern',svg:_si('<path d="M10 5h4M9 8V5M15 8V5M8 8h8a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H8a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1z"/><path d="M8 12h8M10 19v2M14 19v2"/>')},
  {label:'C — Lotus',svg:_si('<path d="M12 18V9"/><path d="M12 9c-1-3-4-5-5-4s0 4 5 9"/><path d="M12 9c1-3 4-5 5-4s0 4-5 9"/><path d="M12 14c-3-1-5-4-4-6s3.5.5 4 6z"/><path d="M12 14c3-1 5-4 4-6s-3.5.5-4 6z"/><path d="M8 20h8"/>')},
  {label:'D — Chalice',svg:_si('<path d="M8 4h8l-2 9H10z"/><path d="M10 13c0 2.5 2 4 2 4s2-1.5 2-4"/><path d="M9 17h6"/><path d="M12 18v3M10 21h4"/>')},
]},

{family:'Location',desc:'Pin and compass are both promising. Mountain and horizon shown as alternatives.',options:[
  {label:'A — Pin (current)',svg:_si('<path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>')},
  {label:'B — Compass',svg:_si('<circle cx="12" cy="12" r="9"/><path d="M16.24 7.76l-2.12 6.36-6.36 2.12 2.12-6.36z"/><circle cx="12" cy="12" r="1.5"/>')},
  {label:'C — Mountain peaks',svg:_si('<path d="M3 20l5-9 4 6 3-4 6 7z"/><path d="M2 20h20"/>')},
  {label:'D — Horizon + rising',svg:_si('<path d="M2 17h20"/><path d="M7 17l5-9 5 9"/><path d="M12 5V3M8.5 6.5l-1.5-1.5M15.5 6.5l1.5-1.5M6 10H4M18 10h2"/>')},
]},

{family:'Geology',desc:'Strata and geode convey geology more precisely than crystal form.',options:[
  {label:'A — Strata layers',svg:_si('<path d="M3 8c2.5-1.5 5.5-1.5 9 0s6.5 1.5 9 0M3 12c2.5-1.5 5.5-1.5 9 0s6.5 1.5 9 0M3 16c2.5-1.5 5.5-1.5 9 0s6.5 1.5 9 0"/>')},
  {label:'B — Crystal (current)',svg:_si('<path d="M6 3l6 4 6-4v14l-6 4-6-4V3z"/><line x1="12" y1="7" x2="12" y2="17"/>')},
  {label:'C — Geode half',svg:_si('<path d="M5 12a7 7 0 0 0 14 0z"/><path d="M7.5 12a4.5 4.5 0 0 0 9 0"/><path d="M10 12a2 2 0 0 0 4 0"/><path d="M4 12H2M20 12h2"/>')},
  {label:'D — Mountain + strata',svg:_si('<path d="M3 20l5-8 4 5 4-6 5 9z"/><path d="M3 20h18"/><path d="M8.5 16l4-4"/>')},
]},

{family:'Anniversary',desc:'Radial burst is the current icon. Laurel wreath shows most distinctly celebratory.',options:[
  {label:'A — Radial burst (current)',svg:_si('<circle cx="12" cy="12" r="3"/><path d="M12 2v4M12 18v4M2 12h4M18 12h4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M19.07 4.93l-2.83 2.83M7.76 16.24l-2.83 2.83"/>')},
  {label:'B — Star in ring',svg:_si('<circle cx="12" cy="12" r="9"/><path d="M12 6l1.5 4.5H18l-3.75 2.73 1.43 4.41L12 15.13l-3.68 2.61 1.43-4.41L6 10.5h4.5z"/>')},
  {label:'C — Medal / badge',svg:_si('<circle cx="12" cy="9" r="6"/><path d="M8.21 13.89L7 23l5-3 5 3-1.21-9.12"/>')},
  {label:'D — Laurel wreath',svg:_si('<path d="M12 19V9"/><path d="M12 9C10 7 7 7 5.5 9c2-.5 4.5.5 6.5 5"/><path d="M12 9c2-2 5-2 6.5 0-2-.5-4.5.5-6.5 5"/><path d="M12 14c-2-1-4 0-5 2 2-.5 4 .5 5 4"/><path d="M12 14c2-1 4 0 5 2-2-.5-4 .5-5 4"/><path d="M9 21h6"/>')},
]},

{family:'Crystal (single)',desc:'Single terminated crystal for stone identification and detail views.',options:[
  {label:'A — Tall pointed',svg:_si('<path d="M12 2l3 5v12l-3 3-3-3V7z"/><path d="M9 7h6"/>')},
  {label:'B — Faceted gem',svg:_si('<path d="M12 3l5 5.5-5 13.5-5-13.5z"/><path d="M7 8.5h10"/><path d="M9.5 8.5L12 3l2.5 5.5"/>')},
  {label:'C — Hexagonal prism',svg:_si('<path d="M12 3l5.2 3v7l-5.2 3-5.2-3V6z"/><path d="M6.8 9l5.2 3 5.2-3"/><path d="M12 12v9"/>')},
  {label:'D — Double terminated',svg:_si('<path d="M12 2l3 5v10l-3 5-3-5V7z"/><path d="M9 7h6M9 17h6"/>')},
]},

{family:'Crystal Cluster',desc:'Multi-point cluster for encyclopedia and collection contexts.',options:[
  {label:'A — Three varied crystals',svg:_si('<path d="M9 20V12l3-6 3 6v8"/><path d="M5.5 20V15l2-4 2.5 3V20"/><path d="M14.5 20V14l2-4 2.5 4V20"/><path d="M4 20h16"/>')},
  {label:'B — Radiating from base',svg:_si('<path d="M12 20V10l3-7"/><path d="M12 20l-5-4 3-4"/><path d="M12 20l5-4-3-4"/><path d="M12 20l-7-2 4-2"/><path d="M12 20l7-2-4-2"/><path d="M9 3l3 7"/>')},
  {label:'C — Cluster + ground',svg:_si('<path d="M8 20V13l2.5-5 2.5 5v7"/><path d="M5 20v-5l2-3.5 1.5 2.5V20"/><path d="M14 20v-5.5l2-4 2 4V20"/><path d="M4 20h16"/>')},
  {label:'D — Geode cross-section',svg:_si('<path d="M4 12a8 8 0 0 0 16 0z"/><path d="M6.5 12a5.5 5.5 0 0 0 11 0"/><path d="M9.5 12a2.5 2.5 0 0 0 5 0"/>')},
]},

{family:'Book / Reference',desc:'For encyclopedia drawer and entry view contexts.',options:[
  {label:'A — Open book (current)',svg:_si('<path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>')},
  {label:'B — Closed book + lines',svg:_si('<path d="M4 2h13l3 3v17H4z"/><path d="M8 2v20"/><path d="M11 7h5M11 11h5M11 15h3"/>')},
  {label:'C — Book + bookmark',svg:_si('<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/><path d="M14 2v8l-2-2-2 2V2"/>')},
  {label:'D — Scroll',svg:_si('<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/><path d="M9 13h6M9 17h4"/>')},
]},

{family:'Collection',desc:'For saved / owned stones. Should feel curated, personal.',options:[
  {label:'A — Stones in a row',svg:_si('<circle cx="6" cy="15" r="3.5"/><circle cx="12" cy="13" r="4.5"/><circle cx="18" cy="15" r="3.5"/><path d="M2 19h20"/>')},
  {label:'B — Cabinet shelves',svg:_si('<rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M3 15h18"/><path d="M9 9v6M15 9v6"/>')},
  {label:'C — Three gems arranged',svg:_si('<path d="M5 10l2-4h4l2 4-4 8z"/><path d="M3 10h8"/><path d="M11 10l2-4h4l2 4-4 8z"/><path d="M9 10h8"/>')},
  {label:'D — Jar with gems',svg:_si('<path d="M8 4h8l1 3H7zM7 7v12a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V7"/><circle cx="10" cy="13" r="1.5"/><circle cx="14" cy="11" r="1.5"/><circle cx="12" cy="15.5" r="1.5"/>')},
]},

{family:'Wishlist',desc:'For saved / wanted stones. Distinct from Collection.',options:[
  {label:'A — Bookmark (current)',svg:_si('<path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>')},
  {label:'B — Tag / label',svg:_si('<path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><circle cx="7" cy="7" r="1.5"/>')},
  {label:'C — Heart outline',svg:_si('<path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>')},
  {label:'D — Star',svg:_si('<path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>')},
]},

{family:'Pair With',desc:'Two complementary stones. Must not be confused with Wishlist or Collection.',options:[
  {label:'A — Two circles (current)',svg:_si('<circle cx="9" cy="12" r="6"/><circle cx="15" cy="12" r="6"/>')},
  {label:'B — Two linked rings',svg:_si('<circle cx="9" cy="12" r="5"/><circle cx="15" cy="12" r="5"/>')},
  {label:'C — Two gems faceted',svg:_si('<path d="M3 9l2-4h4l2 4-4 9z"/><path d="M1 9h8"/><path d="M13 9l2-4h4l2 4-4 9z"/><path d="M11 9h8"/>')},
  {label:'D — Two teardrops',svg:_si('<path d="M9 4c0 0-5 5-5 9a5 5 0 0 0 10 0c0-4-5-9-5-9z"/><path d="M15 4c0 0-5 5-5 9a5 5 0 0 0 10 0c0-4-5-9-5-9z"/>')},
]},

{family:'Chakra',desc:'Energy center concept. Lotus, wheel, or concentric forms all appropriate.',options:[
  {label:'A — 8-spoke wheel',svg:_si('<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="3"/><path d="M12 3v6M12 15v6M3 12h6M15 12h6M5.64 5.64l4.24 4.24M14.12 14.12l4.24 4.24M18.36 5.64l-4.24 4.24M9.88 14.12l-4.24 4.24"/>')},
  {label:'B — Lotus (current paths)',svg:_si('<path d="M32 48C23 40 21 29 32 16c11 13 9 24 0 32Z" transform="scale(0.5) translate(-12 -18)"/><circle cx="12" cy="12" r="3"/><path d="M12 9V4M9 12H4M15 12h5M9.9 9.9L6.3 6.3M14.1 14.1l3.6 3.6M14.1 9.9l3.6-3.6M9.9 14.1l-3.6 3.6"/>')},
  {label:'C — 8-petal ring',svg:_si('<circle cx="12" cy="12" r="2.5"/><ellipse cx="12" cy="6.5" rx="1.5" ry="3.5"/><ellipse cx="12" cy="17.5" rx="1.5" ry="3.5"/><ellipse cx="6.5" cy="12" rx="3.5" ry="1.5"/><ellipse cx="17.5" cy="12" rx="3.5" ry="1.5"/><ellipse cx="7.87" cy="7.87" rx="1.5" ry="3.5" transform="rotate(45 7.87 7.87)"/><ellipse cx="16.13" cy="16.13" rx="1.5" ry="3.5" transform="rotate(45 16.13 16.13)"/><ellipse cx="16.13" cy="7.87" rx="1.5" ry="3.5" transform="rotate(-45 16.13 7.87)"/><ellipse cx="7.87" cy="16.13" rx="1.5" ry="3.5" transform="rotate(-45 7.87 16.13)"/>')},
  {label:'D — Concentric rings',svg:_si('<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5.5"/><circle cx="12" cy="12" r="2"/>')},
]},

{family:'Best For',desc:'The intended use or benefit of a stone.',options:[
  {label:'A — Target / bullseye',svg:_si('<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.5"/>')},
  {label:'B — Lightning bolt',svg:_si('<path d="M13 2L4.5 13h7L10 22l9.5-11H13z"/>')},
  {label:'C — Check in circle',svg:_si('<circle cx="12" cy="12" r="9"/><path d="M8 12l3 3 5-6"/>')},
  {label:'D — Upward spark',svg:_si('<path d="M12 20V10"/><path d="M8 14l4-4 4 4"/><path d="M9 7l3-5 3 5"/><path d="M7 4l2 2M15 4l-2 2"/>')},
]},

{family:"Today's Practice",desc:'Ritual, meditation, or intentional use guidance.',options:[
  {label:'A — Seated figure',svg:_si('<circle cx="12" cy="5" r="2"/><path d="M12 7v4M9 11c0 2.5-2 4-2 6h14c0-2-2-3.5-2-6"/><path d="M7 17l-1 4M17 17l1 4"/>')},
  {label:'B — Hands cupped',svg:_si('<path d="M7 12V8a1.5 1.5 0 0 1 3 0v2M10 8V7a1.5 1.5 0 0 1 3 0v5M13 7a1.5 1.5 0 0 1 3 0v5M16 9a1.5 1.5 0 0 1 3 0v3c0 3.5-3 6-7 6s-7-2.5-7-6v-2"/>')},
  {label:'C — Infinity loop',svg:_si('<path d="M12 12c-1.5-3.5-4-5-6-4.5S2.5 12 4.5 14 10 14 12 12c1.5 3.5 4 5 6 4.5S21.5 12 19.5 10 14 10 12 12z"/>')},
  {label:'D — Spiral',svg:_si('<path d="M12 12a1 1 0 1 0 0-2 1 1 0 0 0 0 2zM12 10a3 3 0 1 0-3 3M12 7a5 5 0 1 1-5 5M12 4a8 8 0 1 0 8 8"/>')},
]},

{family:'Identify / Camera',desc:'For the photo-based stone identification feature.',options:[
  {label:'A — Camera',svg:_si('<path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/>')},
  {label:'B — Aperture iris',svg:_si('<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="3.5"/><path d="M12 3v4M12 17v4M3 12h4M17 12h4"/>')},
  {label:'C — Viewfinder crosshair',svg:_si('<circle cx="12" cy="12" r="5"/><path d="M12 2v5M12 17v5M2 12h5M17 12h5"/>')},
  {label:'D — Magnifier + gem',svg:_si('<circle cx="10.5" cy="10.5" r="7"/><path d="M21 21l-4.5-4.5"/><path d="M8.5 8l1-2H12l1.5 2-3 7z"/><path d="M7 8h7"/>')},
]},

{family:'Search',desc:'General encyclopedia and catalog search.',options:[
  {label:'A — Magnifier (clean)',svg:_si('<circle cx="10.5" cy="10.5" r="7.5"/><path d="M21 21l-5.2-5.2"/>')},
  {label:'B — Magnifier + plus',svg:_si('<circle cx="10" cy="10" r="7"/><path d="M20.5 20.5L15 15"/><path d="M10 7v6M7 10h6"/>')},
  {label:'C — Eye outline',svg:_si('<path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12z"/><circle cx="12" cy="12" r="3"/>')},
  {label:'D — Magnifier + star',svg:_si('<circle cx="10" cy="10" r="7"/><path d="M20.5 20.5L15 15"/><path d="M10 7l1.2 3.7H14.7l-2.9 2.1.9 3L10 13.9l-2.7 1.9.9-3L5.3 10.7H8.8z"/>')},
]},

{family:'Filter',desc:'For collection / encyclopedia filtering controls.',options:[
  {label:'A — Funnel',svg:_si('<path d="M22 3H2l8 9.46V19l4 2v-8.54z"/>')},
  {label:'B — Three sliders',svg:_si('<path d="M4 6h16M4 12h16M4 18h16"/><circle cx="8" cy="6" r="2"/><circle cx="16" cy="12" r="2"/><circle cx="10" cy="18" r="2"/>')},
  {label:'C — Tapering lines',svg:_si('<path d="M3 6h18M6 12h12M9 18h6"/>')},
  {label:'D — Lines with arrows',svg:_si('<path d="M3 6h18M3 12h18M3 18h18"/><path d="M8 4l-2 2 2 2M15 10l2 2-2 2M10 16l-2 2 2 2"/>')},
]},

{family:'Forms / Shapes',desc:'Crystal habit, shape classification, mineral form.',options:[
  {label:'A — Hexagon',svg:_si('<path d="M12 2l8.66 5v10L12 22l-8.66-5V7z"/>')},
  {label:'B — Mixed shapes',svg:_si('<circle cx="6.5" cy="7.5" r="4"/><rect x="13" y="3.5" width="7.5" height="7.5" rx="1"/><path d="M2.5 20.5l4.5-8h9l4.5 8z"/>')},
  {label:'C — Faceted diamond',svg:_si('<path d="M12 3l5 5.5-5 13.5-5-13.5z"/><path d="M7 8.5h10"/><path d="M9.5 8.5L12 3l2.5 5.5"/>')},
  {label:'D — Octagon',svg:_si('<path d="M7.86 2h8.28L22 7.86v8.28L16.14 22H7.86L2 16.14V7.86L7.86 2z"/>')},
]},

{family:'Care / Cleansing',desc:'Stone care methods: water, sunlight, smoke, moonlight.',options:[
  {label:'A — Water drop',svg:_si('<path d="M12 2c0 0-7 8-7 13a7 7 0 0 0 14 0c0-5-7-13-7-13z"/>')},
  {label:'B — Flame',svg:_si('<path d="M12 22a6 6 0 0 0 6-6c0-3-2-5-2-8-1.5 2-2 3.5-4 4-1-2-1.5-4-1.5-4C9.5 11 8 14 8 16a6 6 0 0 0 4 5.66V22z"/>')},
  {label:'C — Moon + drops',svg:_si('<path d="M14 3.5a9 9 0 1 0 0 17A7 7 0 0 1 14 3.5z"/><path d="M18 13.5c0 1-1 2.5-1 4"/><path d="M20.5 11.5c0 1-.5 2.5-.5 4"/>')},
  {label:'D — Sun rays (sunlight)',svg:_si('<circle cx="12" cy="12" r="5"/><path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83"/>')},
]},

{family:'Rarity / Tier',desc:'Collection tier and rarity classification.',options:[
  {label:'A — Crown',svg:_si('<path d="M2 20h20M3 20l2-10 4 5 3-9 3 9 4-5 2 10"/>')},
  {label:'B — Diamond / gem',svg:_si('<path d="M5.5 8.5L12 3l6.5 5.5-6.5 13.5z"/><path d="M5.5 8.5h13"/><path d="M9 8.5L12 3l3 5.5"/>')},
  {label:'C — Tier steps',svg:_si('<path d="M4 20h4v-4H4zM9 20h4v-8H9zM14 20h4V8h-4z"/><path d="M4 20h14"/>')},
  {label:'D — Star in circle',svg:_si('<circle cx="12" cy="12" r="9"/><path d="M12 7l1.5 4.5H18l-3.75 2.72 1.43 4.41L12 15.9l-3.68 2.72 1.43-4.41L6 11.5h4.5z"/>')},
]},

{family:'Add Piece',desc:'Add a stone to the collection or wishlist.',options:[
  {label:'A — Plus in circle',svg:_si('<circle cx="12" cy="12" r="9"/><path d="M12 8v8M8 12h8"/>')},
  {label:'B — Plus in rounded square',svg:_si('<rect x="3" y="3" width="18" height="18" rx="4"/><path d="M12 8v8M8 12h8"/>')},
  {label:'C — Gem + plus',svg:_si('<path d="M6 9l2-5h4l2 5-4 9z"/><path d="M4 9h12"/><path d="M17 5v6M14 8h6"/>')},
  {label:'D — Crystal + plus',svg:_si('<path d="M9 20V13l3-6 3 6v7"/><path d="M8 20h8"/><path d="M18 4v7M14.5 7.5h7"/>')},
]},

{family:'Calendar',desc:'SOTD calendar and date-based scheduling.',options:[
  {label:'A — Grid calendar (current)',svg:_si('<rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/><path d="M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01M16 18h.01"/>')},
  {label:'B — Calendar + moon',svg:_si('<rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/><path d="M9 17a4 4 0 0 0 6.7-2.9 3 3 0 0 1-4.2.1A3 3 0 0 1 9 17z"/>')},
  {label:'C — Calendar + star',svg:_si('<rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/><path d="M12 14l.9 2.7h2.8l-2.3 1.7.9 2.7L12 19.4l-2.3 1.7.9-2.7-2.3-1.7H11z"/>')},
  {label:'D — Page / event',svg:_si('<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/><path d="M9 13h6M9 17h4"/>')},
]},

];

function openSotdIconAudition(){
  if(!isAdminUser(_currentUser))return;
  const body=document.getElementById('sica-body');
  if(!body)return;
  const sizes=[{px:15,lbl:'15 px'},{px:24,lbl:'24 px'},{px:32,lbl:'32 px'}];
  body.innerHTML=_SICA_LIB.map(sec=>{
    const cards=sec.options.map(opt=>{
      const szHtml=sizes.map(s=>`
        <div class="sica-sz">
          <div class="sica-sz-icon" style="min-width:${s.px+10}px;min-height:${s.px+10}px">
            <span style="display:inline-flex;width:${s.px}px;height:${s.px}px" aria-hidden="true">${opt.svg}</span>
          </div>
          <span class="sica-sz-lbl">${s.lbl}</span>
        </div>`).join('');
      return`<div class="sica-card"><div class="sica-card-label">${escapeAttr(opt.label)}</div><div class="sica-sizes">${szHtml}</div></div>`;
    }).join('');
    return`<div class="sica-section">
      <div class="sica-section-hdr">${escapeAttr(sec.family)}<span style="font-weight:400;letter-spacing:0;text-transform:none;margin-left:8px;color:#9a8878;font-size:9.5px">${escapeAttr(sec.desc||'')}</span></div>
      <div class="sica-options">${cards}</div>
    </div>`;
  }).join('');
  const overlay=document.getElementById('sotd-icon-audition');
  if(overlay){overlay.classList.add('open');document.body.style.overflow='hidden';}
}
function closeSotdIconAudition(){
  const overlay=document.getElementById('sotd-icon-audition');
  if(overlay){overlay.classList.remove('open');document.body.style.overflow='';}
  document.getElementById('manage-btn')?.focus();
}
// ── end Sitewide Icon Audition ────────────────────────────────────────────────

async function _sotdCalRenderMonth(year, month) {
  _sotdCalYear  = year;
  _sotdCalMonth = month;

  const key     = `${year}-${String(month).padStart(2, '0')}`;
  const today   = _sotdCalChicagoToday();
  const [ty, tm] = today.split('-').map(Number);

  // Month title
  const titleEl = document.getElementById('sotd-cal-title');
  if (titleEl) {
    titleEl.textContent = `${_sotdCalMonthLabel(month)} ${year}`;
  }

  // Today button: hidden when already on the current month
  const todayBtn = document.getElementById('sotd-cal-today-btn');
  if (todayBtn) todayBtn.hidden = (year === ty && month === tm);

  const grid = document.getElementById('sotd-cal-grid');
  if (!grid) return;

  // Serve from cache if available
  if (_sotdCalCache.has(key)) {
    _sotdCalBuildGrid(_sotdCalCache.get(key), year, month, today);
    return;
  }

  // Loading state
  grid.innerHTML = '<div class="sotd-cal-loading" aria-live="polite" role="status">Loading…</div>';

  const entries = await getSotdCalendarMonth(year, month);
  _sotdCalCache.set(key, entries);

  // Re-check: user may have navigated away while awaiting
  if (_sotdCalYear !== year || _sotdCalMonth !== month) return;

  if (entries === null) {
    grid.innerHTML = `<div class="sotd-cal-error" role="alert">
      <p>Unable to load stone data for this month.</p>
      <button class="sotd-cal-retry-btn" type="button" onclick="_sotdCalRetry()">Retry</button>
    </div>`;
    return;
  }

  _sotdCalBuildGrid(entries, year, month, today);
}

function _sotdCalRetry() {
  const key = `${_sotdCalYear}-${String(_sotdCalMonth).padStart(2, '0')}`;
  _sotdCalCache.delete(key);
  _sotdCalRenderMonth(_sotdCalYear, _sotdCalMonth);
}

function _sotdCalBuildGrid(entries, year, month, today) {
  const grid = document.getElementById('sotd-cal-grid');
  if (!grid) return;

  // Refresh entry store for this month so _sotdCalOpenStone can pass full entry to drawer.
  _sotdCalEntryStore.clear();
  for (const e of entries) { _sotdCalEntryStore.set(e.date, e); }

  const entryMap   = new Map(entries.map(e => [e.date, e]));
  const firstDate  = new Date(year, month - 1, 1);
  const startDow   = firstDate.getDay();            // 0 = Sun
  const daysInMonth = new Date(year, month, 0).getDate();
  const mm          = String(month).padStart(2, '0');
  const monthLabel  = _sotdCalMonthLabel(month);

  const cells = [];

  // Leading ghost cells for grid alignment
  for (let i = 0; i < startDow; i++) {
    cells.push('<div class="sotd-cal-cell sotd-cal-cell--outside" aria-hidden="true"></div>');
  }

  for (let d = 1; d <= daysInMonth; d++) {
    const dd      = String(d).padStart(2, '0');
    const dateStr = `${year}-${mm}-${dd}`;
    const entry   = entryMap.get(dateStr);
    const isToday = dateStr === today;
    const todayAttr = isToday ? ' aria-current="date"' : '';

    if (!entry) {
      const emptyLabel = `${isToday ? 'Today, ' : ''}${d} ${monthLabel}, no stone recorded`;
      cells.push(
        `<div class="sotd-cal-cell sotd-cal-cell--empty${isToday ? ' sotd-cal-cell--today' : ''}"` +
        ` role="gridcell" aria-label="${emptyLabel}"${todayAttr}>` +
        `<span class="sotd-cal-day-num">${d}</span></div>`
      );
    } else {
      const isSchedule  = entry.source === 'schedule';
      const isEditorial = _isSotdEditorial(entry);
      const stoneName   = _sotdCalStoneName(entry.stoneId);
      const pres        = isEditorial ? getSotdEventPresentation(entry.eventCategory) : null;
      const cellClass   = [
        'sotd-cal-cell sotd-cal-cell--populated',
        isSchedule ? 'sotd-cal-cell--schedule' : 'sotd-cal-cell--history',
        isToday ? 'sotd-cal-cell--today' : '',
        pres ? `sotd-cal-cell--${pres.family}` : '',
      ].filter(Boolean).join(' ');

      const ariaLabel = [
        isToday ? 'Today, ' : '',
        `${d} ${monthLabel}`,
        stoneName ? `: ${stoneName}` : '',
        isEditorial && entry.eventName ? `, chosen for ${entry.eventName}` : '',
      ].join('');

      const markerHtml = isEditorial && pres
        ? `<span class="sotd-cal-event-icon" aria-hidden="true">${pres.icon}</span>`
        : (isSchedule ? '<span class="sotd-cal-sched-dot" aria-hidden="true"></span>' : '');

      cells.push(
        `<button class="${cellClass}" type="button" role="gridcell"` +
        ` onclick="_sotdCalOpenStone('${entry.stoneId}','${dateStr}',${year},${month})"` +
        ` aria-label="${ariaLabel.replace(/"/g,"'")}"${todayAttr}>` +
        `<span class="sotd-cal-day-num">${d}</span>` +
        (stoneName ? `<span class="sotd-cal-stone-name">${stoneName}</span>` : '') +
        (entry.eventName ? `<span class="sotd-cal-event-name">${entry.eventName}</span>` : '') +
        markerHtml +
        `</button>`
      );
    }
  }

  // Trailing ghost cells to complete the last row
  const rem = (startDow + daysInMonth) % 7;
  if (rem > 0) {
    for (let i = 0; i < 7 - rem; i++) {
      cells.push('<div class="sotd-cal-cell sotd-cal-cell--outside" aria-hidden="true"></div>');
    }
  }

  grid.innerHTML = cells.join('');

  // Empty-month message sits below the grid, not inside it
  const emptyMsg = document.querySelector('.sotd-cal-empty-msg');
  if (emptyMsg) emptyMsg.remove();
  if (entries.length === 0) {
    const msg = document.createElement('p');
    msg.className = 'sotd-cal-empty-msg';
    msg.textContent = 'No stones have been recorded or scheduled for this month.';
    grid.after(msg);
  }
}

function _sotdCalNav(dir) {
  let y = _sotdCalYear, m = _sotdCalMonth + dir;
  if (m > 12) { y++; m = 1; }
  if (m <  1) { y--; m = 12; }
  _sotdCalRenderMonth(y, m);
}

function _sotdCalGoToday() {
  const today = _sotdCalChicagoToday();
  const [ty, tm] = today.split('-').map(Number);
  _sotdCalRenderMonth(ty, tm);
}

function _sotdCalOpenStone(stoneId, dateStr, year, month) {
  const entry = _sotdCalEntryStore.get(dateStr) || null;
  setSotdContext('calendar', entry);
  detailReturnContext = { type: 'sotd-calendar', year, month, entry };
  openDetail(stoneId);
}

// Keyboard: Escape closes the calendar (when the encyclopedia drawer is not open).
document.addEventListener('keydown', function(e) {
  if (e.key !== 'Escape') return;
  const overlay = document.getElementById('sotd-cal-overlay');
  if (!overlay || !overlay.classList.contains('open')) return;
  const drawerOverlay = document.getElementById('drawer-overlay');
  if (drawerOverlay && drawerOverlay.classList.contains('open')) return; // drawer takes priority
  closeSotdCalendar();
});

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
  document.addEventListener('click',handleOutsideClick);
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


// ── CRYSTAL FAMILIES DATA ──
// Representative gradient colors per family — used as placeholder until a real photo is added
// To add a photo: set photo:'fam-quartz.webp' on the family entry in C101_FAM_DATA
const FAM_PHOTO_COLORS={
  'Quartz':       'linear-gradient(145deg,#c9b8d8 0%,#9b7ab5 50%,#7a5a9a 100%)',
  'Feldspar':     'linear-gradient(145deg,#d4c8b8 0%,#b8ccca 50%,#7a9aaa 100%)',
  'Calcite':      'linear-gradient(145deg,#f0d4a0 0%,#d4894a 60%,#c07030 100%)',
  'Garnet':       'linear-gradient(145deg,#c47878 0%,#8b2a2a 60%,#6a1a1a 100%)',
  'Tourmaline':   'linear-gradient(145deg,#5a5a5a 0%,#3a3530 60%,#2a2520 100%)',
  'Obsidian':     'linear-gradient(145deg,#5a5550 0%,#2a2520 60%,#1a1512 100%)',
  'Fluorite':     'linear-gradient(145deg,#b8d4c8 0%,#9a7ab5 50%,#6a8a6a 100%)',
  'Silicates':    'linear-gradient(145deg,#d4c8b8 0%,#b8a898 60%,#9a8878 100%)',
  'Aggregate':    'linear-gradient(145deg,#c8b898 0%,#a89878 60%,#8a7858 100%)',
  'Oxides':       'linear-gradient(145deg,#c8a8a8 0%,#8a5858 60%,#5a3838 100%)',
  'Carbonates':   'linear-gradient(145deg,#c8e8c8 0%,#5a9a5a 60%,#3a7a3a 100%)',
  'Phosphates':   'linear-gradient(145deg,#a8c8d8 0%,#5a8aaa 60%,#3a6a8a 100%)',
  'Sulfides':     'linear-gradient(145deg,#d4c880 0%,#b8a820 60%,#8a7810 100%)',
  'Opal':         'linear-gradient(145deg,#e8e0d8 0%,#d0c8e8 50%,#b8d0e0 100%)',
  'Beryl':        'linear-gradient(145deg,#b8e8d8 0%,#5ab8a8 60%,#3a9888 100%)',
  'Kyanite':      'linear-gradient(145deg,#b8c8e8 0%,#4a7ab8 60%,#2a5a98 100%)',
  'Aventurine':   'linear-gradient(145deg,#c8e8c0 0%,#6ab870 60%,#4a9850 100%)',
  'Gypsum':       'linear-gradient(145deg,#f0ece8 0%,#d8d4ce 60%,#b8b4ae 100%)',
  'Apatite':      'linear-gradient(145deg,#b0d8e8 0%,#4898b8 60%,#2878a0 100%)',
  'Aragonite':    'linear-gradient(145deg,#e8d8c0 0%,#c8a878 60%,#a88858 100%)',
  'Iron Minerals':'linear-gradient(145deg,#b8b0a8 0%,#786860 60%,#584840 100%)',
  'Garnet':       'linear-gradient(145deg,#c47878 0%,#8b2a2a 60%,#6a1a1a 100%)',
  'Meteoritic Material':'linear-gradient(145deg,#d0c8b8 0%,#a09888 60%,#707060 100%)',
  'Fossil Material':'linear-gradient(145deg,#d8c8a8 0%,#a89870 60%,#887850 100%)',
  'Organic Material':'linear-gradient(145deg,#e8d8a8 0%,#c8a840 60%,#a88820 100%)',
  'Corundum':     'linear-gradient(145deg,#e8b0b0 0%,#c84040 60%,#982020 100%)',
  'Spodumene':    'linear-gradient(145deg,#f0d8e8 0%,#d8a8c8 60%,#b888a8 100%)',
  "Tiger's Eye":  'linear-gradient(145deg,#e8c870 0%,#c8a030 60%,#a88010 100%)',
  'Serpentine':   'linear-gradient(145deg,#c8d8b0 0%,#80a860 60%,#608840 100%)',
  'Shungite':     'linear-gradient(145deg,#606060 0%,#303030 60%,#101010 100%)',
  'Sulfates':     'linear-gradient(145deg,#d8e8f0 0%,#a8c8e0 60%,#80a8c8 100%)',
  'Borates':      'linear-gradient(145deg,#e8e4e0 0%,#c8c4b8 60%,#a8a498 100%)',
};
const C101_FAM_DATA=[{"n": "Quartz", "tier": "major", "desc": "Silicon dioxide — the most abundant mineral family on Earth. Includes Clear Quartz, Amethyst, Rose Quartz, Citrine, Jasper, Agate, and Chalcedony.", "energy": "Amplifying, clarifying, versatile. Most Quartzes enhance intention and energy.", "care": "Mohs 7. Safe for water. Amethyst and Rose Quartz fade in prolonged sun."}, {"n": "Feldspar", "tier": "major", "desc": "One of the most common mineral groups on Earth. Includes Moonstone, Labradorite, Amazonite, and Sunstone.", "energy": "Luminous, intuitive, often connected to cycles and inner glow. Many show adularescence.", "care": "Mohs 6–6.5. Moderate water tolerance; avoid prolonged soaking."}, {"n": "Calcite", "tier": "major", "desc": "Calcium carbonate crystals found in every color. Soft and often waxy to vitreous.", "energy": "Emotionally amplifying and clearing — each color adds a specific chakra quality.", "care": "Mohs 3. Never use water. Scratches easily. Store carefully."}, {"n": "Garnet", "tier": "major", "desc": "Iron-rich silicates with deep luster. Not always red — green Tsavorite, orange Spessartine, violet Rhodolite.", "energy": "Energizing, passionate, grounding. Strong root and sacral energy as a family.", "care": "Mohs 6.5–7.5. Durable. Safe for water and daily wear."}, {"n": "Tourmaline", "tier": "major", "desc": "Complex boron silicate minerals with a striking color range. Often striated along the length.", "energy": "Strongly protective and balancing. Black Tourmaline is the most widely used protective stone.", "care": "Mohs 7–7.5. Durable. Safe for water. Excellent for jewelry."}, {"n": "Obsidian", "tier": "major", "desc": "Volcanic glass formed from rapidly cooled lava. Always black or near-black.", "energy": "Powerful shadow work, truth-revealing, and protective. One of the most intense families.", "care": "Mohs 5–5.5. Safe for water. Edges can be razor-sharp on raw pieces."}, {"n": "Fluorite", "tier": "major", "desc": "Calcium fluoride. One of the most colorful families — purple, green, blue, or rainbow.", "energy": "The clearest thinking stone. Cuts through confusion and supports focus. Color adds specificity.", "care": "Mohs 4. Never use water. Has perfect cleavage — drops can split it. Fades in sun."}, {"n": "Silicates", "tier": "common", "desc": "The largest mineral class. A broad catch-all for many diverse stones not in other families.", "energy": "Properties vary widely. Check individual entries rather than relying on family tendencies.", "care": "Hardness varies. Check individual entries."}, {"n": "Aggregate", "tier": "common", "desc": "Rocks made of multiple mineral grains — Jaspers, some Agates, Rhyolite, Unakite.", "energy": "Generally grounding, stabilizing, nature-connected. Earthy energy as a rule.", "care": "Usually durable. Most safe for water. Avoid prolonged soaking."}, {"n": "Oxides", "tier": "common", "desc": "Minerals built from oxygen and metals — Hematite, Corundum (Ruby/Sapphire), Magnetite.", "energy": "Strongly grounding, protective, and physically activating. Iron-rich oxides especially earthy.", "care": "Generally durable. Hematite rusts if left wet."}, {"n": "Carbonates", "tier": "common", "desc": "Includes Malachite, Rhodochrosite, Dolomite, and Magnesite. Softness and color vary.", "energy": "Emotional in nature — heart-connected, transformative, or stabilizing depending on the stone.", "care": "Mostly water-sensitive. Malachite can be toxic — avoid in water elixirs, wash hands."}, {"n": "Phosphates", "tier": "common", "desc": "Includes Turquoise, Apatite, Vivianite, and Lazulite. Often vivid blues and greens.", "energy": "Communication, truth, and throat/third eye energy run throughout this family.", "care": "Most are water-sensitive. Turquoise discolors with water, oils, and chemicals."}, {"n": "Sulfides", "tier": "common", "desc": "Metal sulfide minerals — Pyrite, Galena, Cinnabar, Covellite. Often metallic and heavy.", "energy": "Shadow work, protection, and deep earth energy. Pyrite is the main manifestation stone here.", "care": "Never use water — sulfides oxidize and some are toxic. Wash hands after handling raw pieces."}, {"n": "Opal", "tier": "common", "desc": "Hydrated silica — a mineraloid, not a true crystal. Famous for play-of-color.", "energy": "Emotional amplification, creativity, and spontaneity. Intensifies what you bring to it.", "care": "Mohs 5.5–6.5. Water-sensitive despite being hydrated — soaking causes crazing."}, {"n": "Other Mineral", "tier": "common", "desc": "Stones that do not fit neatly into other families — a diverse group of unique specimens.", "energy": "Properties are stone-specific. Check individual entries for energy, care, and use.", "care": "Varies widely. Check individual entries."}, {"n": "Beryl", "tier": "specialty", "desc": "Beryllium aluminum silicate. Includes Emerald, Aquamarine, Morganite, and Heliodor.", "energy": "Each color has distinct energy — heart (Emerald/Morganite), throat/third eye (Aquamarine), solar (Heliodor).", "care": "Mohs 7.5–8. Durable. Safe for water and jewelry."}, {"n": "Kyanite", "tier": "specialty", "desc": "Aluminum silicate with blade-like crystals. Blue, black, green, and orange varieties.", "energy": "Self-aligning — said not to accumulate negative energy and rarely needs cleansing.", "care": "Mohs 4.5–7 (directional). Avoid water."}, {"n": "Aventurine", "tier": "specialty", "desc": "Quartz with sparkly mineral inclusions. Green, blue, and pink varieties.", "energy": "Luck, opportunity, and heart energy. Green Aventurine is one of the most popular prosperity stones.", "care": "Mohs 7. Safe for water. Stable in sun."}, {"n": "Aragonite", "tier": "specialty", "desc": "Calcium carbonate polymorph with different structure than Calcite. Often star-shaped.", "energy": "Grounding, centering, and emotionally stabilizing. Excellent for earth-connection work.", "care": "Mohs 3.5–4. Avoid water. Fragile; handle gently."}, {"n": "Copper Minerals", "tier": "specialty", "desc": "Copper-based minerals including Malachite, Azurite, Dioptase, and Shattuckite.", "energy": "Heart opening, communication, and emotional truth. Copper is considered a conductor of energy.", "care": "Water-sensitive. Can be toxic — avoid in water elixirs, wash hands."}, {"n": "Gypsum", "tier": "specialty", "desc": "Hydrated calcium sulfate. Includes Selenite, Satin Spar, and Desert Rose.", "energy": "Cleansing, purifying, and connecting to higher guidance. Selenite is the most used clearing tool.", "care": "Mohs 2. Never use water — dissolves over time. Self-cleansing; rarely needs clearing."}, {"n": "Apatite", "tier": "specialty", "desc": "Calcium phosphate minerals — same mineral as teeth and bones. Blue, green, or yellow.", "energy": "Manifestation, motivation, and clearing confusion. Strong connection to personal truth.", "care": "Mohs 5. Avoid water and acids. Somewhat brittle."}, {"n": "Iron Minerals", "tier": "specialty", "desc": "Iron-rich minerals including Hematite, Magnetite, Lodestone, and Goethite.", "energy": "Deeply grounding, protective, and physically activating. Lodestone used for attraction work.", "care": "Avoid water — iron rusts. Safe for daily handling otherwise."}, {"n": "Meteoritic Material", "tier": "rare", "desc": "Stones from space — Moldavite, Meteorite, Libyan Desert Glass, and Tektite.", "energy": "Intensely transformative and high-vibration. Moldavite especially is known for accelerating change.", "care": "Varies. Moldavite should not be soaked. Handle meteorites with clean dry hands."}, {"n": "Fossil Material", "tier": "rare", "desc": "Mineralized remains of ancient life — Ammonite, Orthoceras, Petrified Wood, Stromatolite.", "energy": "Ancient wisdom, ancestral connection, and deep time. Living records of life millions of years ago.", "care": "Generally durable. Most safe for brief water contact; some matrix material can be fragile."}, {"n": "Organic Material", "tier": "rare", "desc": "Materials of biological origin — Amber, Jet, Pearl, Coral. Not minerals in the traditional sense.", "energy": "Warmth, protection, and connection to ancient life. Amber is fossilized tree resin; Jet is fossilized wood.", "care": "Soft and scratch-prone. Avoid harsh chemicals, prolonged water, and heat."}, {"n": "Corundum", "tier": "rare", "desc": "Aluminum oxide — Ruby and Sapphire. Second hardest natural mineral after Diamond.", "energy": "Power, clarity, and divine connection. Ruby activates passion; Sapphire opens wisdom and truth.", "care": "Mohs 9. Extremely durable. Safe for water, jewelry, and daily wear."}, {"n": "Spodumene", "tier": "rare", "desc": "Lithium aluminum silicate — Kunzite (pink) and Hiddenite (green).", "energy": "Gentle heart opening, love, and gratitude. Unusually soft and tender in energetic quality.", "care": "Mohs 6.5–7. Kunzite fades rapidly in sunlight. Has perfect cleavage — handle with care."}, {"n": "Tiger's Eye", "tier": "rare", "desc": "Pseudomorphic quartz after crocidolite. Chatoyant (cat's-eye effect) in gold, red, and blue.", "energy": "Courage, confidence, and clear-eyed perception. The moving light band is distinctive.", "care": "Mohs 7. Safe for water. Stable in sun."}, {"n": "Serpentine", "tier": "rare", "desc": "Magnesium silicate group with green, mottled appearance. Includes Healerite and Atlantisite.", "energy": "Heart healing, emotional release, and connection to ancient nature energy.", "care": "Mohs 3–5. Avoid prolonged water exposure."}, {"n": "Halite", "tier": "rare", "desc": "Sodium chloride — rock salt crystals. Blue and pink varieties are collectors pieces.", "energy": "Purification, emotional clearing, and dissolving energetic residue. Ancient and elemental.", "care": "Mohs 2.5. Literally dissolves in water. Never wet. Very fragile."}, {"n": "Shungite", "tier": "rare", "desc": "A unique carbon-based mineraloid from Russia, over 2 billion years old.", "energy": "EMF shielding, purification, and ancient earth grounding. One of the most studied stones.", "care": "Mohs 3.5–4. Elite Shungite only in water. Leaves black residue initially."}, {"n": "Synthetic Material", "tier": "rare", "desc": "Lab-created or enhanced stones — Opalite, Goldstone, some Aura Quartzes.", "energy": "Often beautiful and energetically useful. Aura Quartzes (metal-bonded) are a popular example.", "care": "Varies. Generally durable. Be transparent about synthetic vs. natural origin."}, {"n": "Sulfates", "tier": "rare", "desc": "Sulfate minerals including Barite and Celestite. Often pastel and very delicate.", "energy": "Calming, higher guidance, and angelic connection. Celestite is beloved for its serene energy.", "care": "Mohs 3–3.5. Very fragile. Never use water. Store padded and separate."}, {"n": "Borates", "tier": "rare", "desc": "Borate minerals including Howlite and Ulexite. White or gray with distinctive veining.", "energy": "Calming, patience, and emotional attunement. Howlite is often dyed blue and sold as Turquoise.", "care": "Mohs 3–3.5. Avoid prolonged water contact."}];
const C101_TIERS=[
  {id:'major',label:'The Big Seven',sub:'The families you will encounter most often.'},
  {id:'common',label:'Common Families',sub:'Regularly found in shops and collections.'},
  {id:'specialty',label:'Specialty Families',sub:'Require more knowledge but reward the effort.'},
  {id:'rare',label:'Rare & Exotic',sub:'Less common, more specialized or demanding.'},
];
function renderFamilies(tier){
  const fc=document.getElementById('fam-cards');
  if(!fc)return;
  const q=(document.getElementById('fam-search-input')||{}).value||'';
  if(!window.FAM_COUNTS){window.FAM_COUNTS={};CRYSTALS.forEach(c=>{if(c.fam)window.FAM_COUNTS[c.fam]=(window.FAM_COUNTS[c.fam]||0)+1;});}
  let filtered=C101_FAM_DATA.filter(f=>(tier==='all'||f.tier===tier)&&(!q||f.n.toLowerCase().includes(q.toLowerCase())||f.desc.toLowerCase().includes(q.toLowerCase())));
  if(!filtered.length){fc.innerHTML='<div style="color:var(--ink3);font-size:13px;grid-column:1/-1;padding:1rem">No families match.</div>';return;}
  // Sort by stone count descending; within 'all' view, order by tier group first then count
  if(tier==='all'){
    const tierOrder={major:0,common:1,specialty:2,rare:3};
    filtered=filtered.slice().sort((a,b)=>{const td=(tierOrder[a.tier]||99)-(tierOrder[b.tier]||99);if(td!==0)return td;return(window.FAM_COUNTS[b.n]||0)-(window.FAM_COUNTS[a.n]||0);});
  } else {
    filtered=filtered.slice().sort((a,b)=>(window.FAM_COUNTS[b.n]||0)-(window.FAM_COUNTS[a.n]||0));
  }
  fc.innerHTML=filtered.map(f=>{
    const cnt=window.FAM_COUNTS[f.n]||0;
    const fArg=jsArg(f.n);
    const examples=CRYSTALS.filter(c=>c.fam===f.n).sort((a,b)=>(a.tier||9)-(b.tier||9)||(a.n>b.n?1:-1)).slice(0,4).map(c=>c.n).join(' · ');
    const photoSlot=f.photo
      ?`<img class="fam-photo-img" src="${escapeAttr(f.photo)}" alt="${escapeAttr(f.n)}" loading="lazy">`
      :`<div class="fam-photo-placeholder" style="background:${FAM_PHOTO_COLORS[f.n]||'var(--stone3)'}"></div>`;
    return`<div class="fam-card" data-family="${escapeAttr(f.n)}" onclick="jumpToFamily(${fArg});return false;" title="View ${escapeAttr(f.n)} stones in the encyclopedia"><div class="fam-photo">${photoSlot}</div><div class="fam-body"><div class="fam-name">${f.n}</div>${cnt?`<div class="fam-count">${cnt} stone${cnt===1?'':'s'}</div>`:''}<div class="fam-energy">${f.energy||f.desc}</div>${examples?`<div class="fam-examples">${examples}</div>`:''}</div></div>`;
  }).join('');
}
function initFamilies(){
  try { C101_FAM_DATA; } catch(e) { setTimeout(initFamilies,0); return; }
  if(!window.FAM_COUNTS){window.FAM_COUNTS={};CRYSTALS.forEach(c=>{if(c.fam)window.FAM_COUNTS[c.fam]=(window.FAM_COUNTS[c.fam]||0)+1;});}
  const fcDelegate=document.getElementById('fam-cards');
  if(fcDelegate&&fcDelegate.dataset.familyDelegated!=='1'){
    fcDelegate.dataset.familyDelegated='1';
    fcDelegate.addEventListener('click',function(e){
      const card=e.target.closest('.fam-card');
      if(!card)return;
      const fam=card.getAttribute('data-family')||card.querySelector('.fam-name')?.textContent?.trim();
      if(!fam)return;
      e.preventDefault();
      e.stopPropagation();
      jumpToFamily(fam);
    });
  }
  const nav=document.getElementById('fam-tier-nav');
  if(nav&&!nav.children.length){
    C101_TIERS.forEach(t=>{const btn=document.createElement('button');btn.className='c101-pill';btn.textContent=t.label;btn.onclick=()=>setFamTier(t.id,btn);if(t.id==='major')btn.classList.add('active');nav.appendChild(btn);});
    const allBtn=document.createElement('button');allBtn.className='c101-pill';allBtn.textContent='All families';allBtn.onclick=()=>setFamTier('all',allBtn);nav.appendChild(allBtn);
  }
  window.currentFamTier='major';renderFamilies('major');
}
function setFamTier(tier,btn){document.querySelectorAll('#fam-tier-nav .c101-pill').forEach(p=>p.classList.remove('active'));btn.classList.add('active');window.currentFamTier=tier;renderFamilies(tier);}
function famSearch(){renderFamilies(window.currentFamTier||'all');}


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



// ── CRYSTAL GRIDS ──

const CRYSTAL_GRIDS = [
  {
    id: 'protection',
    name: 'Protection Grid',
    tagline: 'Clear and shield your energy field',
    moodLink: 4,
    layout: 'star',
    color: '#3a3530',
    activation: 'I define the boundary of my energy. What is not mine cannot enter here.',
    use: 'Set at the four corners of a room, or around your bed. Refresh weekly.',
    intro: 'A protection grid creates a defined energetic boundary — something to deflect what isn\'t yours and transmute what gets through anyway. One of the most practical grids to build and maintain.',
    stones: [
      {name:'Black Tourmaline', id:'C-0129', hex:'#3a3530', role:'Center',    purpose:'Primary shield and anchor'},
      {name:'Labradorite',      id:'C-0028', hex:'#5a8ab0', role:'Inner ×2',  purpose:'Deflects unwanted energy'},
      {name:'Hematite',         id:'C-0041', hex:'#666666', role:'Inner ×2',  purpose:'Grounds the protective field'},
      {name:'Smoky Quartz',     id:'C-0103', hex:'#8b6f47', role:'Outer ×4',  purpose:'Transmutes what enters'},
      {name:'Clear Quartz',     id:'C-0105', hex:'#e0dbd4', role:'Amplifier', purpose:'Amplifies the entire grid'},
    ],
    diagram: drawStarGrid,
  },
  {
    id: 'abundance',
    name: 'Abundance Grid',
    tagline: 'Align with prosperity and open flow',
    moodLink: 17, moodLinks: [17, 18, 19],
    layout: 'flower',
    color: '#c9a832',
    activation: 'I am open to receiving. I am aligned with what I am building.',
    use: 'On a desk or workspace. Set a specific intention before activating. Refresh monthly.',
    intro: 'Abundance grids work best when paired with a clear, specific intention. The stones here are magnetic: they don\'t create luck, they help you recognize and act on what\'s already available.',
    stones: [
      {name:'Citrine',            id:'C-0121', hex:'#c9a832', role:'Center',    purpose:'Core attractor'},
      {name:'Pyrite',             id:'C-0137', hex:'#c9b030', role:'Inner ×3',  purpose:'Confidence and magnetic pull'},
      {name:'Green Aventurine',   id:'C-0178', hex:'#4a8a5a', role:'Outer ×3',  purpose:'Opens to opportunity'},
      {name:"Gold Tiger's Eye", id:'C-0168', hex:'#b08a30', role:'Outer ×3',  purpose:'Discernment and action'},
      {name:'Malachite',          id:'C-0020', hex:'#3a7a4a', role:'Base',      purpose:'Growth anchor'},
      {name:'Clear Quartz',       id:'C-0105', hex:'#e0dbd4', role:'Amplifier', purpose:'Top amplifier'},
    ],
    diagram: drawFlowerGrid,
  },
  {
    id: 'heart',
    name: 'Heart Healing Grid',
    tagline: 'Soften, release, and restore the heart',
    moodLink: 9,
    layout: 'circle',
    color: '#d4839a',
    activation: 'I am allowed to heal at the pace that is true for me.',
    use: 'Bedside or in private space. Hold the center stone first, then place the others outward.',
    intro: 'Built for the slow work — grief, loss, heartbreak, or the accumulated weight of being human for a while. The circle layout has no hard edges: it contains without constraining.',
    stones: [
      {name:'Rose Quartz',      id:'C-0108', hex:'#d4839a', role:'Center',   purpose:'Unconditional love, the foundation'},
      {name:'Rhodochrosite',    id:'C-0213', hex:'#d4739a', role:'Inner ×2', purpose:'Self-love and grief'},
      {name:'Morganite',        id:'C-0024', hex:'#e0a0b0', role:'Inner ×2', purpose:'Divine love and loss'},
      {name:'Rhodonite',        id:'C-0214', hex:'#c46880', role:'Outer ×2', purpose:'Forgiveness'},
      {name:'Green Aventurine', id:'C-0178', hex:'#4a8a5a', role:'Outer ×2', purpose:'Renewal'},
      {name:'Clear Quartz',     id:'C-0105', hex:'#e0dbd4', role:'Top',      purpose:'Drawing healing inward'},
    ],
    diagram: drawCircleGrid,
  },
  {
    id: 'clarity',
    name: 'Clarity Grid',
    tagline: 'Cut through fog, sharpen focus, decide',
    moodLink: 13,
    layout: 'triangle',
    color: '#4a6aaa',
    activation: 'I see clearly. I trust my own reasoning.',
    use: 'On a desk during work, study, or decision-making. The upward triangle directs energy forward.',
    intro: 'When the mind is circling without resolution, a clarity grid interrupts the loop. The upward triangle is directed, focused, moving — exactly what mental fog needs.',
    stones: [
      {name:'Clear Quartz',   id:'C-0105', hex:'#e0dbd4', role:'Center',    purpose:'Pure amplification'},
      {name:'Selenite',       id:'C-0175', hex:'#f0ece6', role:'Sides ×2',  purpose:'Clears mental static'},
      {name:'Sodalite',       id:'C-0218', hex:'#4a6aaa', role:'Corners ×2',purpose:'Logic and pattern recognition'},
      {name:'Lapis Lazuli',   id:'C-0188', hex:'#2a4a8a', role:'Outer ×2',  purpose:'Truth and wisdom'},
      {name:'Herkimer Diamond',id:'C-0123',hex:'#e8e4de', role:'Apex',      purpose:'Precision and high attunement'},
    ],
    diagram: drawTriangleGrid,
  },
  {
    id: 'sleep',
    name: 'Sleep & Rest Grid',
    tagline: 'Quiet the mind and invite deep rest',
    moodLink: 3,
    layout: 'rectangle',
    color: '#7a5a9a',
    activation: 'I release the day. My body knows how to rest.',
    use: 'Place under or around the bed. Activate with breath rather than loud intention.',
    intro: 'This grid doesn\'t push you to sleep — it removes what\'s in the way. The rectangle mirrors the shape of a bed intentionally. The Black Tourmaline at the foot keeps the sleep space sealed.',
    stones: [
      {name:'Amethyst',         id:'C-0119', hex:'#7a5a9a', role:'Center',   purpose:'Calming and protective'},
      {name:'Howlite',          id:'C-0241', hex:'#e8e4de', role:'Head ×2',  purpose:'Quiets the mental loop'},
      {name:'Lepidolite',       id:'C-0254', hex:'#9a7ab0', role:'Sides ×2', purpose:'Lithium-calm for anxiety'},
      {name:'Selenite',         id:'C-0175', hex:'#f0ece6', role:'Sides ×2', purpose:'Cleanses the sleep space'},
      {name:'Black Tourmaline', id:'C-0129', hex:'#3a3530', role:'Foot',     purpose:'Protection from disturbance'},
    ],
    diagram: drawRectangleGrid,
  },
  {
    id: 'transformation',
    name: 'Transformation Grid',
    tagline: 'Support deep change and conscious release',
    moodLink: 24,
    layout: 'star',
    color: '#5a8ab0',
    activation: 'I am willing to release what I have outgrown. I trust what is forming.',
    use: 'During major life transitions. Not for daily use — this grid moves things.',
    intro: 'For when you know something has to change and you\'re done waiting. Labradorite anchors the center — it catalyzes transformation while protecting you through the process.',
    stones: [
      {name:'Labradorite',   id:'C-0028', hex:'#5a8ab0', role:'Center',   purpose:'Catalyst with built-in protection'},
      {name:'Malachite',     id:'C-0020', hex:'#3a7a4a', role:'Inner ×2', purpose:'Transformation and truth'},
      {name:'Charoite',      id:'C-0249', hex:'#7a5a9a', role:'Inner ×2', purpose:'Moving through resistance'},
      {name:'Smoky Quartz',  id:'C-0103', hex:'#8b6f47', role:'Outer ×2', purpose:'Releasing the old'},
      {name:'Black Obsidian',id:'C-0139', hex:'#2a2520', role:'Outer ×2', purpose:'Facing what must go'},
      {name:'Clear Quartz',  id:'C-0105', hex:'#e0dbd4', role:'Top',      purpose:'Amplifier pointing outward'},
    ],
    diagram: drawStarGrid,
  },
];

// ── GRID DIAGRAM DRAWING FUNCTIONS ──

function drawStarGrid(stones, svgId) {
  const svg = document.getElementById(svgId);
  if(!svg) return;
  const cx=100, cy=100, r_inner=35, r_outer=70;
  let html = '';
  
  // Draw lines first
  const pts_inner = Array.from({length:6},(_,i)=>{
    const a = i*60-90;
    return [cx+r_inner*Math.cos(a*Math.PI/180), cy+r_inner*Math.sin(a*Math.PI/180)];
  });
  const pts_outer = Array.from({length:6},(_,i)=>{
    const a = i*60-90;
    return [cx+r_outer*Math.cos(a*Math.PI/180), cy+r_outer*Math.sin(a*Math.PI/180)];
  });
  
  // Star lines
  for(let i=0;i<6;i++){
    const j=(i+2)%6;
    html+=`<line x1="${pts_outer[i][0]}" y1="${pts_outer[i][1]}" x2="${pts_outer[j][0]}" y2="${pts_outer[j][1]}" stroke="var(--grid-line)" stroke-width="0.5"/>`;
  }
  for(let i=0;i<6;i++){
    html+=`<line x1="${cx}" y1="${cy}" x2="${pts_outer[i][0]}" y2="${pts_outer[i][1]}" stroke="var(--grid-line)" stroke-width="0.5" stroke-dasharray="2,3"/>`;
  }
  
  // Center stone
  const c = stones[0];
  html += drawDot(cx, cy, 14, c.hex, c.name, true);
  
  // Inner ring (2 stones)
  const inner2 = stones.filter(s=>s.role.includes('Inner ×2'));
  inner2.forEach((s,i)=>{
    html += drawDot(pts_inner[i*3][0], pts_inner[i*3][1], 9, s.hex, s.name, false);
  });
  
  // Outer stones (4 or 2)
  const outer = stones.filter(s=>s.role.includes('Outer'));
  const count = parseInt(outer[0]?.role.match(/\d+/)?.[0]||4);
  for(let i=0;i<Math.min(count,6);i++){
    html += drawDot(pts_outer[i][0], pts_outer[i][1], 9, outer[0].hex, outer[0].name, false);
  }
  
  // Amplifier at top
  const amp = stones.find(s=>s.role.includes('Top')||s.role.includes('Amplifier'));
  if(amp){
    html += drawDot(cx, cy-r_outer-14, 7, amp.hex, amp.name, false);
    html += `<line x1="${cx}" y1="${cy-r_outer}" x2="${cx}" y2="${cy-r_outer-8}" stroke="var(--grid-line)" stroke-width="0.5"/>`;
  }
  
  svg.innerHTML = html;
}

function drawCircleGrid(stones, svgId) {
  const svg = document.getElementById(svgId);
  if(!svg) return;
  const cx=100, cy=105, r1=30, r2=60;
  let html = '';
  
  // Circles
  html += `<circle cx="${cx}" cy="${cy}" r="${r1}" fill="none" stroke="var(--grid-line)" stroke-width="0.5"/>`;
  html += `<circle cx="${cx}" cy="${cy}" r="${r2}" fill="none" stroke="var(--grid-line)" stroke-width="0.5"/>`;
  
  // Center
  html += drawDot(cx, cy, 14, stones[0].hex, stones[0].name, true);
  
  // Inner ring (4 stones at cardinal)
  const inner = stones.filter(s=>s.role.includes('Inner'));
  const inner_angles = [270, 0, 90, 180]; // top, right, bottom, left  
  inner_angles.forEach((a,i)=>{
    if(i >= inner.length*2) return;
    const s = inner[Math.floor(i/2)];
    const x = cx + r1*Math.cos(a*Math.PI/180);
    const y = cy + r1*Math.sin(a*Math.PI/180);
    html += drawDot(x, y, 9, s.hex, s.name, false);
  });
  
  // Outer ring (4 stones diagonal)
  const outer = stones.filter(s=>s.role.includes('Outer'));
  const outer_angles = [315, 45, 135, 225];
  outer_angles.forEach((a,i)=>{
    if(i >= outer.length*2) return;
    const s = outer[Math.floor(i/2)];
    const x = cx + r2*Math.cos(a*Math.PI/180);
    const y = cy + r2*Math.sin(a*Math.PI/180);
    html += drawDot(x, y, 9, s.hex, s.name, false);
  });
  
  // Top amplifier
  const top = stones.find(s=>s.role==='Top');
  if(top){
    html += drawDot(cx, cy-r2-14, 7, top.hex, top.name, false);
    html += `<line x1="${cx}" y1="${cy-r2}" x2="${cx}" y2="${cy-r2-8}" stroke="var(--grid-line)" stroke-width="0.5"/>`;
  }
  
  svg.innerHTML = html;
}

function drawTriangleGrid(stones, svgId) {
  const svg = document.getElementById(svgId);
  if(!svg) return;
  const cx=100, cy=110;
  const tip = [cx, 20];
  const bl  = [cx-75, 185];
  const br  = [cx+75, 185];
  
  let html = '';
  
  // Triangle
  html += `<polygon points="${tip[0]},${tip[1]} ${bl[0]},${bl[1]} ${br[0]},${br[1]}" fill="none" stroke="var(--grid-line)" stroke-width="0.8"/>`;
  
  // Inner triangle
  const ti2=[cx,52], bl2=[cx-40,155], br2=[cx+40,155];
  html += `<polygon points="${ti2[0]},${ti2[1]} ${bl2[0]},${bl2[1]} ${br2[0]},${br2[1]}" fill="none" stroke="var(--grid-line)" stroke-width="0.4" stroke-dasharray="3,3"/>`;
  
  // Centerpoint
  const ctr = [cx, 120];
  html += drawDot(ctr[0], ctr[1], 13, stones[0].hex, stones[0].name, true);
  
  // Side stones (×2)
  const sides = stones.filter(s=>s.role.includes('Sides'));
  if(sides.length){
    [[cx-50,130],[cx+50,130]].forEach(([x,y])=>{
      html += drawDot(x, y, 9, sides[0].hex, sides[0].name, false);
    });
  }
  
  // Corner stones (×2)
  const corners = stones.filter(s=>s.role.includes('Corners'));
  if(corners.length){
    [[bl[0]+15,bl[1]-10],[br[0]-15,br[1]-10]].forEach(([x,y])=>{
      html += drawDot(x, y, 9, corners[0].hex, corners[0].name, false);
    });
  }
  
  // Outer (×2)
  const outer = stones.filter(s=>s.role.includes('Outer'));
  if(outer.length){
    [[bl[0]-8,bl[1]+5],[br[0]+8,br[1]+5]].forEach(([x,y])=>{
      html += drawDot(x, y, 9, outer[0].hex, outer[0].name, false);
    });
  }
  
  // Apex
  const apex = stones.find(s=>s.role==='Apex');
  if(apex) html += drawDot(tip[0], tip[1]-14, 9, apex.hex, apex.name, false);
  
  svg.innerHTML = html;
}

function drawRectangleGrid(stones, svgId) {
  const svg = document.getElementById(svgId);
  if(!svg) return;
  const left=30, top=15, w=140, h=140;
  let html = '';
  
  // Rectangle (bed outline)
  html += `<rect x="${left}" y="${top}" width="${w}" height="${h}" rx="4" fill="none" stroke="var(--grid-line)" stroke-width="0.8"/>`;
  html += `<text x="${left+w/2}" y="${top+h/2+16}" text-anchor="middle" font-size="9" fill="var(--ink3)" font-family="Jost,sans-serif" opacity="0.5">bed</text>`;
  
  // Dashed center line
  html += `<line x1="${left+w/2}" y1="${top+5}" x2="${left+w/2}" y2="${top+h-5}" stroke="var(--grid-line)" stroke-width="0.4" stroke-dasharray="3,4"/>`;
  
  // Center stone (middle of bed)
  html += drawDot(left+w/2, top+h/2-10, 13, stones[0].hex, stones[0].name, true);
  
  // Head stones (top)
  const head = stones.filter(s=>s.role.includes('Head'));
  if(head.length){
    [[left+25,top+20],[left+w-25,top+20]].forEach(([x,y])=>{
      html += drawDot(x, y, 9, head[0].hex, head[0].name, false);
    });
  }
  
  // Side stones
  const sides = stones.filter(s=>s.role.includes('Sides'));
  if(sides.length>=2){
    [[left-12,top+h/2-10],[left+w+12,top+h/2-10]].forEach(([x,y],i)=>{
      html += drawDot(x, y, 9, sides[Math.min(i,sides.length-1)].hex, sides[0].name, false);
    });
  }
  
  // Foot stone (bottom center)
  const foot = stones.find(s=>s.role==='Foot');
  if(foot) html += drawDot(left+w/2, top+h+10, 11, foot.hex, foot.name, false);
  
  svg.innerHTML = html;
}

function drawFlowerGrid(stones, svgId) {
  const svg = document.getElementById(svgId);
  if(!svg) return;
  const cx=100, cy=100, r1=32, r2=68;
  let html = '';
  
  // Petal circles (6)
  for(let i=0;i<6;i++){
    const a = i*60-90;
    const px = cx + r1*Math.cos(a*Math.PI/180);
    const py = cy + r1*Math.sin(a*Math.PI/180);
    html += `<circle cx="${px}" cy="${py}" r="${r1}" fill="none" stroke="var(--grid-line)" stroke-width="0.4" opacity="0.6"/>`;
  }
  html += `<circle cx="${cx}" cy="${cy}" r="${r1}" fill="none" stroke="var(--grid-line)" stroke-width="0.5"/>`;
  html += `<circle cx="${cx}" cy="${cy}" r="${r2}" fill="none" stroke="var(--grid-line)" stroke-width="0.4" stroke-dasharray="3,3"/>`;
  
  // Center
  html += drawDot(cx, cy, 14, stones[0].hex, stones[0].name, true);
  
  // Inner ring (3 stones)
  const inner = stones.filter(s=>s.role.includes('Inner'));
  for(let i=0;i<3;i++){
    const a = i*120-90;
    const x = cx + r1*Math.cos(a*Math.PI/180);
    const y = cy + r1*Math.sin(a*Math.PI/180);
    html += drawDot(x, y, 9, inner[0].hex, inner[0].name, false);
  }
  
  // Outer ring (6 alternating: aventurine x3, tiger x3)
  const outer1 = stones.filter(s=>s.role.includes('Outer ×3'))[0];
  const outer2 = stones.filter(s=>s.role.includes('Outer ×3'))[1];
  for(let i=0;i<6;i++){
    const a = i*60-90;
    const x = cx + r2*Math.cos(a*Math.PI/180);
    const y = cy + r2*Math.sin(a*Math.PI/180);
    const s = i%2===0 ? outer1 : outer2;
    if(s) html += drawDot(x, y, 9, s.hex, s.name, false);
  }
  
  // Base and amplifier
  const base = stones.find(s=>s.role==='Base');
  const amp  = stones.find(s=>s.role==='Amplifier');
  if(base) html += drawDot(cx, cy+r2+14, 9, base.hex, base.name, false);
  if(amp)  html += drawDot(cx, cy-r2-14, 9, amp.hex,  amp.name,  false);
  
  svg.innerHTML = html;
}

function drawDot(x, y, r, hex, name, isCenter) {
  const stroke = isCenter ? 'var(--accent)' : 'var(--border)';
  const sw = isCenter ? '1.5' : '0.8';
  // Tooltip via title
  return `<g>
    <circle cx="${Math.round(x)}" cy="${Math.round(y)}" r="${r}" fill="${hex}" stroke="${stroke}" stroke-width="${sw}" opacity="${isCenter?1:0.9}"/>
    ${isCenter ? `<circle cx="${Math.round(x)}" cy="${Math.round(y)}" r="${r+4}" fill="none" stroke="var(--accent)" stroke-width="0.5" opacity="0.4"/>` : ''}
    <title>${name}</title>
  </g>`;
}

// ── RENDER GRID CARDS ──

function renderGridCards() {
  try { CRYSTAL_GRIDS; } catch(e) { setTimeout(renderGridCards,0); return; }
  const container = document.getElementById('grid-cards');
  if(!container) return;
  
  container.innerHTML = CRYSTAL_GRIDS.map(grid => {
    const moodLabel = MOOD_DATA[grid.moodLink]?.label || '';
    return `<div class="grid-card" onclick="openGridModal('${grid.id}')">
      <div class="grid-card-swatch" style="background:${grid.color}20;border-color:${grid.color}40">
        <svg viewBox="0 0 200 200" width="140" height="140" id="card-svg-${grid.id}"></svg>
      </div>
      <div class="grid-card-body">
        <div class="grid-card-name">${grid.name}</div>
        <div class="grid-card-tagline">${grid.tagline}</div>
        <div class="grid-card-mood"><span class="grid-card-mood-arrow">↗</span> Use When: ${moodLabel}</div>
      </div>
    </div>`;
  }).join('');
  
  // Draw card diagrams (simplified)
  CRYSTAL_GRIDS.forEach(grid => {
    setTimeout(() => {
      const svg = document.getElementById(`card-svg-${grid.id}`);
      if(svg) grid.diagram(grid.stones, `card-svg-${grid.id}`);
    }, 50);
  });
}

// ── GRID MODAL ──

function openGridModal(gridId) {
  const grid = CRYSTAL_GRIDS.find(g=>g.id===gridId);
  if(!grid) return;
  
  const stoneRows = grid.stones.map(s => 
    `<tr onclick="detailReturnContext={type:'grid',gridId:'${grid.id}'};closeGridModal();switchTabByName('encyclopedia');openDetail('${s.id}')" style="cursor:pointer">
      <td style="padding:8px 10px 8px 0;vertical-align:middle">
        <span style="display:inline-flex;align-items:center;gap:7px">
          <span style="width:12px;height:12px;border-radius:50%;background:${s.hex};border:0.5px solid rgba(0,0,0,0.1);flex-shrink:0"></span>
          <span style="font-family:'Cormorant Garamond',serif;font-size:16px">${s.name}</span>
        </span>
      </td>
      <td style="padding:8px 0;font-size:11px;letter-spacing:0.04em;text-transform:uppercase;color:var(--ink3)">${s.role}</td>
      <td style="padding:8px 0 8px 12px;font-size:12px;color:var(--ink2)">${s.purpose}</td>
    </tr>`
  ).join('');
  
  document.getElementById('grid-modal-content').innerHTML = `
    <div class="grid-modal-actions"><button class="btn btn-sm" onclick="printGridModal();event.stopPropagation();">Print grid</button></div>
    <div style="margin-bottom:1.5rem">
      <div style="font-size:11px;letter-spacing:0.09em;text-transform:uppercase;color:var(--ink3);margin-bottom:6px">${grid.tagline}</div>
      <div style="font-family:'Cormorant Garamond',serif;font-size:32px;font-weight:300;color:var(--ink);margin-bottom:0.75rem">${grid.name}</div>
      <p style="font-size:13px;color:var(--ink2);line-height:1.7">${grid.intro}</p>
    </div>
    
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:2rem;margin-bottom:1.5rem">
      <div>
        <svg viewBox="0 0 200 220" width="100%" id="modal-svg-${grid.id}" style="max-width:240px;display:block;margin:0 auto"></svg>
      </div>
      <div>
        <div style="font-size:10px;letter-spacing:0.08em;text-transform:uppercase;color:var(--ink3);margin-bottom:8px">Stones</div>
        <table style="width:100%;border-collapse:collapse">
          ${stoneRows}
        </table>
        <p style="font-size:11px;color:var(--ink3);margin-top:8px;font-style:italic">Tap any stone to open its encyclopedia entry.</p>
      </div>
    </div>
    
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin-bottom:1rem">
      <div style="background:var(--stone2);border-radius:8px;padding:1rem">
        <div style="font-size:10px;letter-spacing:0.08em;text-transform:uppercase;color:var(--ink3);margin-bottom:6px">Activation</div>
        <div style="font-family:'Cormorant Garamond',serif;font-size:16px;font-style:italic;color:var(--ink);line-height:1.5">"${grid.activation}"</div>
      </div>
      <div style="background:var(--stone2);border-radius:8px;padding:1rem">
        <div style="font-size:10px;letter-spacing:0.08em;text-transform:uppercase;color:var(--ink3);margin-bottom:6px">Placement & use</div>
        <div style="font-size:13px;color:var(--ink2);line-height:1.6">${grid.use}</div>
      </div>
    </div>
    
    <div style="padding:0.75rem 1rem;border-left:2px solid var(--accent2);background:var(--stone2);border-radius:0 6px 6px 0;font-size:12px;color:var(--ink2)">
      <strong style="color:var(--ink)">How to activate: </strong>Place stones from outside in, ending at the center. Hold your intention clearly, then touch each stone lightly with a clear quartz point to connect them.
    </div>`;
  
  document.getElementById('grid-modal-overlay').classList.add('open');
  setTimeout(() => grid.diagram(grid.stones, `modal-svg-${grid.id}`), 80);
}

function printGridModal(){
  const modal=document.getElementById('grid-modal');
  if(!modal)return;
  const printWin=window.open('','_blank','width=900,height=900');
  if(!printWin){ window.print(); return; }
  const cleaned=modal.cloneNode(true);
  cleaned.querySelectorAll('button,.grid-modal-actions,.grid-modal-close').forEach(el=>el.remove());
  printWin.document.write(`<!doctype html><html><head><title>Crystal Grid</title>
    <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;500&family=Jost:wght@300;400;500&display=swap" rel="stylesheet">
    <style>@page{size:letter portrait;margin:0.35in} *{box-sizing:border-box} body{font-family:Jost,sans-serif;color:#2a2520;padding:0;background:#fff;font-size:11px;line-height:1.35} .grid-modal{width:7.8in;max-height:10.25in;margin:0 auto;overflow:hidden} .grid-modal>div{margin-bottom:0.45rem!important} svg{max-height:2.25in!important} table{page-break-inside:avoid;font-size:10.5px} td{padding:4px 6px!important} p{margin:0!important;line-height:1.35!important} [style*='font-size:32px']{font-size:24px!important;margin-bottom:0.25rem!important} [style*='grid-template-columns:1fr 1fr']{gap:0.5rem!important} [style*='padding:1rem']{padding:0.45rem!important}</style>
    </head><body>${cleaned.outerHTML}</body></html>`);
  printWin.document.close();
  printWin.focus();
  setTimeout(()=>{printWin.print();printWin.close();},350);
}

function closeGridModal() {
  document.getElementById('grid-modal-overlay').classList.remove('open');
}

// Init grids when 101 tab loads
function init101Grids() {
  try { CRYSTAL_GRIDS; } catch(e) { setTimeout(init101Grids,0); return; }
  renderGridCards();
}



// ── CRYSTAL SHAPES ──

const SHAPE_CATEGORIES = [
  { label: 'Holdable', def: 'Pieces meant to be carried, held, or kept close',                          ids: ['tumble','palm','worry','heart'] },
  { label: 'Display',  def: 'Pieces chosen for shape, presence, shelf appeal, or visual structure',     ids: ['sphere','egg','tower','pyramid','cube','freeform','flame','bowl'] },
  { label: 'Natural',  def: 'Pieces that show the stone\'s natural growth, texture, and mineral character', ids: ['raw','specimen','point','cluster','geode','druzy','slice'] },
  { label: 'Symbolic', def: 'Pieces chosen because the shape itself carries meaning',                   ids: ['moon','star','mushroom','wand','carving'] },
];

const CRYSTAL_SHAPES = [
  {
    id: 'tumble',
    name: 'Tumble',
    tagline: 'Polished, softened, accessible',
    tile: 'The most versatile form: smooth, pocket-sized, and gentle enough for daily carry, body work, or gifting.',
    body: 'Machine-polished until smooth. The energy is gentler and more diffuse than raw — easier to carry, hold, and work with daily. Ideal for beginners and for stones used in direct body contact. The most versatile and widely available form.',
    use: 'Daily carry · Body work · Grids · Gifting',
    examples: ['Rose Quartz', 'Carnelian', 'Labradorite', 'Obsidian'],
    draw: drawTumbledShape,
  },
  {
    id: 'palm',
    name: 'Palm Stone',
    tagline: 'Made for touch, somatic, grounding',
    tile: 'Flat and fitted for the palm, the go-to form for anxiety, nervous system work, and any practice that benefits from direct skin contact.',
    body: 'Shaped to fit the palm — flat, smooth, slightly rounded. Direct skin contact amplifies the energetic exchange between stone and body. Ideal for nervous system work, anxiety, and any practice that benefits from physical sensation and presence.',
    use: 'Anxiety · Nervous system · Body presence · Meditation',
    examples: ['Lepidolite', 'Howlite', 'Rhodonite', 'Hematite'],
    draw: drawPalmShape,
  },
  {
    id: 'worry',
    name: 'Worry Stone',
    tagline: 'Repetitive touch, anxiety, presence',
    tile: 'A thumb-indented oval built for repetitive rubbing, as much a somatic tool as an energetic one. Keep one in your pocket.',
    body: 'Flat oval with a thumb-sized indentation. Designed for repetitive rubbing — the physical repetition activates the parasympathetic nervous system and grounds attention in the body. A somatic tool as much as an energetic one. Keep one in a pocket.',
    use: 'Anxiety · Fidgeting · Grounding · Daily carry',
    examples: ['Howlite', 'Amethyst', 'Lepidolite', 'Sodalite'],
    draw: drawWorryShape,
  },
  {
    id: 'heart',
    name: 'Heart',
    tagline: 'Emotional, receptive, heart-centered',
    tile: 'Carved into a heart to concentrate heart-center energy. The shape itself becomes the intention, comforting to hold during emotional work.',
    body: 'Carved into a heart shape to concentrate and activate heart-center energy. The shape itself is an intention. Used in emotional healing, self-love practice, relationship work, and as a physical symbol of what you are working toward. Comforting to hold during difficult emotional work.',
    use: 'Heart healing · Self-love · Grief · Relationship intention',
    examples: ['Rose Quartz', 'Rhodonite', 'Green Aventurine', 'Malachite'],
    draw: drawHeartShape,
  },
  {
    id: 'sphere',
    name: 'Sphere',
    tagline: 'Equal, continuous, panoramic',
    tile: 'Radiates energy equally in all directions with no point or emphasis. The most balanced form, ideal for scrying, meditation, and ambient space work.',
    body: 'Emits energy equally in all directions — no point, no emphasis, no directionality. The most balanced form. Used in scrying, meditation, and spaces where you want steady ambient energy rather than focused projection.',
    use: 'Meditation · Scrying · Ambient energy · Balance work',
    examples: ['Clear Quartz', 'Rose Quartz', 'Obsidian', 'Labradorite'],
    draw: drawSphereShape,
  },
  {
    id: 'egg',
    name: 'Egg',
    tagline: 'New beginnings, fertility, grounding',
    tile: 'A form tied to new beginnings and potential, satisfying to hold and roll in the palms, with energy concentrated at the tapered apex.',
    body: 'The egg shape carries strong symbolism of new beginnings, potential, and fertility — and practically, the rounded base and tapered top create a natural energy concentration at the apex. Satisfying to hold and roll between the palms. Used in body work and new-chapter rituals.',
    use: 'New beginnings · Body rolling · Fertility · Transition work',
    examples: ['Rose Quartz', 'Obsidian', 'Malachite', 'Amazonite'],
    draw: drawEggShape,
  },
  {
    id: 'tower',
    name: 'Tower',
    tagline: 'Directed upward, projecting, anchoring',
    tile: 'A flat-based column that projects energy upward continuously, stable and versatile for rooms, grids, and altars alike.',
    body: 'A flat-based, six-sided column that projects energy upward and outward continuously. Towers are among the most versatile forms — place them in a room to shift the ambient energy, use them in grids as anchor points, or hold during meditation. The flat base makes them stable and easy to place.',
    use: 'Room energy · Grids · Meditation · Intention setting',
    examples: ['Amethyst', 'Selenite', 'Labradorite', 'Black Tourmaline'],
    draw: drawTowerShape,
  },
  {
    id: 'pyramid',
    name: 'Pyramid',
    tagline: 'Concentrating, manifesting, anchoring',
    tile: 'Draws energy in through the base and projects it upward through the apex: a sacred geometry form used in manifestation and grid anchoring.',
    body: 'Four triangular faces meeting at an apex. Draws energy in through the base, concentrates and amplifies it, then projects upward through the point. Used in manifestation work, grid anchoring, and focusing intention. Connected to sacred geometry and ancient protective traditions.',
    use: 'Manifestation · Grid anchor · Intention amplification · Sacred space',
    examples: ['Citrine', 'Clear Quartz', 'Black Tourmaline', 'Pyrite'],
    draw: drawPyramidShape,
  },
  {
    id: 'cube',
    name: 'Cube',
    tagline: 'Grounding, structure, stability',
    tile: 'Six equal faces representing perfect stability. The Earth element in sacred geometry, used for grounding and building energetic structure.',
    body: 'Six equal faces representing perfect stability — the cube corresponds to the Earth element in sacred geometry. Places energy firmly on all six sides simultaneously. Used for grounding work, building stable foundations, and creating energetic structure in a space or intention.',
    use: 'Grounding · Structure · Earth element work · Stability',
    examples: ['Pyrite', 'Fluorite', 'Hematite', 'Black Tourmaline'],
    draw: drawCubeShape,
  },
  {
    id: 'freeform',
    name: 'Freeform',
    tagline: 'Organic, sculptural, one-of-a-kind',
    tile: 'No fixed geometry and no two alike. The most personal and expressive form in a collection, chosen as much for beauty as for practice.',
    body: 'Shaped or naturally formed into an organic, flowing form with no fixed geometry. Each piece is completely unique — no two are alike. Energy moves freely along the curves. Often the most personal and expressive form in a collection, chosen as much for beauty as for practice.',
    use: 'Room presence · Meditation focal point · Display · Personal altar',
    examples: ['Labradorite', 'Rose Quartz', 'Ocean Jasper', 'Malachite'],
    draw: drawFreeformShape,
  },
  {
    id: 'flame',
    name: 'Flame',
    tagline: 'Transformation, upward movement, passion',
    tile: 'A tapering flame silhouette that channels energy upward, associated with transformation, clarity, and movement.',
    body: 'Carved or polished into a tapering flame silhouette — wide at the base, narrowing to a flowing point. Energy rises upward along the form, making it associated with transformation, clarity, and movement. A striking display piece that also functions as a gentle directional energy tool.',
    use: 'Transformation work · Display · Room energy · Meditation focus',
    examples: ['Labradorite', 'Selenite', 'Amethyst', 'Citrine'],
    draw: drawFlameShape,
  },
  {
    id: 'bowl',
    name: 'Bowl / Dish',
    tagline: 'Receiving, holding, offering',
    tile: 'A shallow, receptive form that draws energy inward, used as a charging plate, offering vessel, or altar piece.',
    body: 'A shallow carved bowl or dish. Used as a charging plate for other stones, a vessel for intentions, or a beautiful offering piece. The concave form draws energy inward and holds it — receptive rather than projecting. Practical for display as well as ceremonial use.',
    use: 'Charging other stones · Altar · Intention holding · Display',
    examples: ['Selenite', 'Rose Quartz', 'Amethyst', 'Clear Quartz'],
    draw: drawBowlShape,
  },
  {
    id: 'raw',
    name: 'Raw / Natural',
    tagline: 'Unfiltered, natural energy',
    tile: 'The stone as it formed: uncut, unpolished, broadcasting energy outward in all directions with nothing filtered or softened.',
    body: 'Closest to how the stone formed. Energy radiates outward in all directions, unmodified. Most powerful for grounding, space-holding, and any work where you want the full unmediated quality of the stone. Less refined, but often more potent.',
    use: 'Grounding · Space clearing · Long-term placement · Altars',
    examples: ['Black Tourmaline', 'Selenite', 'Amethyst', 'Citrine'],
    draw: drawRawShape,
  },
  {
    id: 'specimen',
    name: 'Specimen',
    tagline: 'Natural, unmodified, mineral character',
    tile: 'A naturally collected piece showing the stone\'s full mineral character, often with matrix or host rock. Chosen as much for what it teaches as for its energy.',
    body: 'A naturally formed piece collected as found, often including matrix, host rock, or multiple crystal formations. Not cut or polished beyond basic preparation. The most honest expression of how a stone actually grows in the earth — chosen for its mineral character as much as its energy.',
    use: 'Display · Education · Altar · Natural presence',
    examples: ['Pyrite', 'Amethyst', 'Malachite', 'Celestite'],
    draw: drawSpecimenShape,
  },
  {
    id: 'point',
    name: 'Point',
    tagline: 'Directed, focused, activating',
    tile: 'A natural or cut termination that focuses and directs energy out through the apex, essential for grid activation and energy work.',
    body: 'A natural or cut termination that directs energy out through the apex. Used to direct intention, move energy in healing work, and activate crystal grids — touch each stone lightly with the point to connect them. Points can face inward (drawing energy toward you) or outward (projecting away).',
    use: 'Grid activation · Energy direction · Healing work · Amplification',
    examples: ['Clear Quartz', 'Amethyst', 'Citrine', 'Rose Quartz'],
    draw: drawPointShape,
  },
  {
    id: 'cluster',
    name: 'Cluster',
    tagline: 'Radiating, communal, space-filling',
    tile: 'Multiple points on a shared base, each radiating in its own direction. An omnidirectional broadcast that continuously cleanses the energy around it.',
    body: 'Multiple points growing from a shared base. Each crystal in the cluster radiates in its own direction — the result is an omnidirectional broadcast. Excellent for spaces, rooms, and group settings. Clusters also continuously cleanse the energy around them and make impressive display pieces.',
    use: 'Room energy · Space cleansing · Group settings · Display',
    examples: ['Amethyst', 'Quartz', 'Celestite', 'Pyrite'],
    draw: drawClusterShape,
  },
  {
    id: 'geode',
    name: 'Geode',
    tagline: 'Hidden interior, protective, amplifying',
    tile: 'Unremarkable outside, crystalline within. The hollow cavity amplifies and protects, holding intention when closed and broadcasting it when open.',
    body: 'Unremarkable outside, crystalline interior. The hollow cavity amplifies and stores energy. Geodes protect what is inside — energetically and literally. A closed geode holds intention; an open geode broadcasts it. Excellent for spaces, altars, and long-term energetic work.',
    use: 'Space holding · Amplification · Protection · Altar',
    examples: ['Amethyst', 'Quartz', 'Celestite', 'Calcite'],
    draw: drawGeodeShape,
  },
  {
    id: 'druzy',
    name: 'Druzy',
    tagline: 'Amplifying surface, sparkle, coating',
    tile: 'A surface of sparkling micro-crystals that amplifies surrounding energy and adds brilliant visual texture. A natural formation, not a carved shape.',
    body: 'A surface covered in a layer of tiny, sparkling micro-crystals formed within a cavity or on a host stone. Not a carved shape but a natural formation. Amplifies the energy of whatever surrounds it, adds visual brilliance, and is commonly used in jewelry and decorative settings. Often found coating Agate or Chalcedony.',
    use: 'Amplification · Jewelry · Display · Enhancing other stones',
    examples: ['Druzy Agate', 'Grape Agate', 'Chalcopyrite', 'Uvarovite'],
    draw: drawDruzyShape,
  },
  {
    id: 'slice',
    name: 'Slice / Slab',
    tagline: 'Display, altar, writing surface',
    tile: 'A flat cross-section that reveals the stone\'s interior pattern. Used as an altar base, charging plate, or display surface, with energy radiating from the face.',
    body: 'A flat cross-section of a stone or geode, revealing the interior pattern. Used as altar bases, charging plates, display surfaces, and decorative pieces. Agate slices with natural banding are common; geode slices show the crystalline interior. Energy radiates from the flat face.',
    use: 'Altar base · Charging plate · Display · Space energy',
    examples: ['Agate', 'Amethyst', 'Selenite', 'Obsidian'],
    draw: drawSliceShape,
  },
  {
    id: 'moon',
    name: 'Moon',
    tagline: 'Cyclical, intuitive, feminine',
    tile: 'A crescent carved form connected to lunar cycles, intuition, and the rhythm of what to begin, release, and allow to complete.',
    body: 'Usually carved as a crescent. Strongly connected to lunar cycles, the feminine, and intuition. Used in moon rituals, cycle tracking, and any work tied to timing and rhythm — what to begin, what to release, what to allow to complete naturally. A powerful shape for water-sign energy.',
    use: 'Lunar rituals · Intuition · Feminine energy · Cyclical work',
    examples: ['Moonstone', 'Selenite', 'Labradorite', 'Amethyst'],
    draw: drawMoonShape,
  },
  {
    id: 'star',
    name: 'Star',
    tagline: 'Radiating, protection, divine connection',
    tile: 'A carved star whose radiating points send energy outward in multiple directions, used in protection work, sacred space, and grid arrangements.',
    body: 'A five or six-pointed carved star. The radiating points send energy outward in multiple directions simultaneously — similar to a cluster, but intentionally geometric. Used in protection work, sacred space setting, and grid arrangements. The six-pointed star is particularly used in healing and balancing.',
    use: 'Protection · Grids · Sacred geometry · Radiating intention',
    examples: ['Clear Quartz', 'Black Tourmaline', 'Selenite', 'Pyrite'],
    draw: drawStarShape,
  },
  {
    id: 'mushroom',
    name: 'Mushroom',
    tagline: 'Grounding yet reaching, earthy, symbolic',
    tile: 'Rooted in the earth while reaching upward, a symbol of grounding, organic growth, and the quiet intelligence of natural systems.',
    body: 'Carved to echo the mushroom form — a wide cap and narrow stem. Beloved for its symbolism: rooted in the earth while growing upward, and connected to the hidden network beneath the surface. Associated with grounding, organic growth, and the quiet intelligence of natural systems.',
    use: 'Grounding · Growth intention · Symbolic work · Display',
    examples: ['Agate', 'Obsidian', 'Amethyst', 'Rose Quartz'],
    draw: drawMushroomShape,
  },
  {
    id: 'wand',
    name: 'Wand',
    tagline: 'Channeling, directional, healing',
    tile: 'Elongated with a pointed end to channel and direct energy along the body or through a space. The pointed end sends, the rounded end receives.',
    body: 'Elongated and cylindrical, often with one pointed end. Wands channel and direct energy along their length — used in energy healing to move, clear, or focus energy in specific areas of the body or space. The pointed end sends energy; the rounded end receives.',
    use: 'Energy healing · Chakra work · Directing energy · Body work',
    examples: ['Selenite', 'Clear Quartz', 'Rose Quartz', 'Obsidian'],
    draw: drawWandShape,
  },
  {
    id: 'carving',
    name: 'Carving',
    tagline: 'Symbolic, intentional, artisan',
    tile: 'Any carved figure (skull, animal, angel, goddess, and more) layering the meaning of the form over the natural energy of the stone.',
    body: 'Any carved form not covered by the specific shapes listed — skulls, animals, angels, goddess figures, hands, and other figures. The carved form layers symbolic meaning over the stone\'s natural energy. Choose a carving when the shape itself carries personal meaning for your practice or collection.',
    use: 'Symbolic work · Altars · Collection · Gifting',
    examples: ['Obsidian', 'Labradorite', 'Rose Quartz', 'Clear Quartz'],
    draw: drawCarvingShape,
  },
];

// ── SVG SHAPE ILLUSTRATIONS ──

function shapeS(){ return 'rgba(42,37,32,0.35)'; }
function shapeF(){ return 'rgba(42,37,32,0.06)'; }
function shapeA(){ return '#8b7355'; }

function drawRawShape(){
  return `<svg viewBox="0 0 120 120" width="78" height="78">
    <polygon points="60,16 92,36 96,64 78,90 42,92 24,66 28,36"
      fill="${shapeF()}" stroke="${shapeS()}" stroke-width="1.2" stroke-linejoin="round"/>
    <line x1="60" y1="16" x2="42" y2="92" stroke="${shapeS()}" stroke-width="0.4" opacity="0.35"/>
    <line x1="92" y1="36" x2="24" y2="66" stroke="${shapeS()}" stroke-width="0.4" opacity="0.35"/>
    <line x1="96" y1="64" x2="28" y2="36" stroke="${shapeS()}" stroke-width="0.4" opacity="0.35"/>
  </svg>`;
}

function drawTumbledShape(){
  return `<svg viewBox="0 0 120 120" width="78" height="78">
    <ellipse cx="60" cy="63" rx="32" ry="27"
      fill="${shapeF()}" stroke="${shapeS()}" stroke-width="1.2"/>
    <ellipse cx="60" cy="63" rx="20" ry="15"
      fill="none" stroke="${shapeS()}" stroke-width="0.4" opacity="0.35"/>
    <circle cx="50" cy="53" r="4" fill="none" stroke="white" stroke-width="1" opacity="0.55"/>
  </svg>`;
}

function drawPalmShape(){
  return `<svg viewBox="0 0 120 120" width="78" height="78">
    <ellipse cx="60" cy="65" rx="42" ry="30"
      fill="${shapeF()}" stroke="${shapeS()}" stroke-width="1.2"/>
    <ellipse cx="60" cy="65" rx="18" ry="10"
      fill="rgba(42,37,32,0.05)" stroke="${shapeS()}" stroke-width="0.8" opacity="0.6"/>
  </svg>`;
}

function drawWorryShape(){
  return `<svg viewBox="0 0 120 120" width="78" height="78">
    <ellipse cx="60" cy="65" rx="42" ry="30"
      fill="${shapeF()}" stroke="${shapeS()}" stroke-width="1.2"/>
    <ellipse cx="60" cy="60" rx="15" ry="10"
      fill="rgba(42,37,32,0.08)" stroke="${shapeS()}" stroke-width="0.9"/>
  </svg>`;
}

function drawSphereShape(){
  return `<svg viewBox="0 0 120 120" width="78" height="78">
    <circle cx="60" cy="60" r="40"
      fill="${shapeF()}" stroke="${shapeS()}" stroke-width="1.2"/>
    <ellipse cx="60" cy="60" rx="40" ry="13"
      fill="none" stroke="${shapeS()}" stroke-width="0.45" opacity="0.45"/>
    <ellipse cx="60" cy="60" rx="13" ry="40"
      fill="none" stroke="${shapeS()}" stroke-width="0.45" opacity="0.45"/>
    <circle cx="47" cy="47" r="5" fill="none" stroke="white" stroke-width="1" opacity="0.6"/>
  </svg>`;
}

function drawEggShape(){
  return `<svg viewBox="0 0 120 120" width="78" height="78">
    <path d="M60,18 C80,18 94,42 94,66 C94,86 79,102 60,102 C41,102 26,86 26,66 C26,42 40,18 60,18 Z"
      fill="${shapeF()}" stroke="${shapeS()}" stroke-width="1.2"/>
    <ellipse cx="60" cy="66" rx="22" ry="16"
      fill="none" stroke="${shapeS()}" stroke-width="0.4" opacity="0.35"/>
    <circle cx="50" cy="46" r="4" fill="none" stroke="white" stroke-width="1" opacity="0.55"/>
  </svg>`;
}

function drawPointShape(){
  return `<svg viewBox="0 0 120 120" width="78" height="78">
    <polygon points="60,14 79,42 79,98 41,98 41,42"
      fill="${shapeF()}" stroke="${shapeS()}" stroke-width="1.2" stroke-linejoin="round"/>
    <line x1="60" y1="14" x2="60" y2="98" stroke="${shapeS()}" stroke-width="0.4" opacity="0.4"/>
    <line x1="41" y1="55" x2="79" y2="55" stroke="${shapeS()}" stroke-width="0.4" opacity="0.35"/>
    <line x1="41" y1="76" x2="79" y2="76" stroke="${shapeS()}" stroke-width="0.4" opacity="0.35"/>
  </svg>`;
}

function drawFlameShape(){
  return `<svg viewBox="0 0 120 120" width="78" height="78">
    <path d="M60,14 C70,22 84,32 86,50 C88,65 80,74 74,82 C68,90 65,96 60,102 C55,96 52,90 46,82 C40,74 32,65 34,50 C36,32 50,22 60,14 Z"
      fill="${shapeF()}" stroke="${shapeS()}" stroke-width="1.2" stroke-linejoin="round"/>
    <path d="M60,30 C66,38 72,46 72,58 C72,68 67,75 60,80"
      fill="none" stroke="${shapeS()}" stroke-width="0.5" opacity="0.35"/>
  </svg>`;
}

function drawPyramidShape(){
  return `<svg viewBox="0 0 120 120" width="78" height="78">
    <polygon points="60,16 102,90 18,90"
      fill="${shapeF()}" stroke="${shapeS()}" stroke-width="1.2" stroke-linejoin="round"/>
    <line x1="60" y1="16" x2="74" y2="90" stroke="${shapeS()}" stroke-width="0.5" opacity="0.45"/>
    <polygon points="60,16 102,90 74,82"
      fill="none" stroke="${shapeS()}" stroke-width="0.4" opacity="0.35"/>
  </svg>`;
}

function drawCubeShape(){
  return `<svg viewBox="0 0 120 120" width="78" height="78">
    <polygon points="60,18 98,38 98,80 60,100 22,80 22,38"
      fill="${shapeF()}" stroke="${shapeS()}" stroke-width="1.2" stroke-linejoin="round"/>
    <line x1="60" y1="18" x2="60" y2="60" stroke="${shapeS()}" stroke-width="0.8" opacity="0.5"/>
    <line x1="22" y1="38" x2="60" y2="60" stroke="${shapeS()}" stroke-width="0.8" opacity="0.5"/>
    <line x1="98" y1="38" x2="60" y2="60" stroke="${shapeS()}" stroke-width="0.8" opacity="0.5"/>
    <line x1="60" y1="60" x2="60" y2="100" stroke="${shapeS()}" stroke-width="0.4" opacity="0.3"/>
    <line x1="60" y1="60" x2="22" y2="80" stroke="${shapeS()}" stroke-width="0.4" opacity="0.3"/>
    <line x1="60" y1="60" x2="98" y2="80" stroke="${shapeS()}" stroke-width="0.4" opacity="0.3"/>
  </svg>`;
}

function drawHeartShape(){
  return `<svg viewBox="0 0 120 120" width="78" height="78">
    <path d="M60,90 C60,90 20,64 20,40 C20,26 32,18 45,24 C52,27 57,33 60,40 C63,33 68,27 75,24 C88,18 100,26 100,40 C100,64 60,90 60,90 Z"
      fill="${shapeF()}" stroke="${shapeS()}" stroke-width="1.2" stroke-linejoin="round"/>
  </svg>`;
}

function drawMoonShape(){
  return `<svg viewBox="0 0 120 120" width="78" height="78">
    <path d="M72,22 C50,22 32,40 32,62 C32,84 50,102 72,102 C60,102 42,90 42,62 C42,34 60,22 72,22 Z"
      fill="${shapeF()}" stroke="${shapeS()}" stroke-width="1.2" stroke-linejoin="round"/>
    <path d="M72,22 C84,30 92,45 92,62 C92,79 84,94 72,102"
      fill="none" stroke="${shapeS()}" stroke-width="1.2"/>
  </svg>`;
}

function drawStarShape(){
  const pts = Array.from({length:5},(_,i)=>{
    const a = (i*72-90)*Math.PI/180;
    const b = (i*72-54)*Math.PI/180;
    return `${Math.round(60+38*Math.cos(a))},${Math.round(60+38*Math.sin(a))} ${Math.round(60+16*Math.cos(b))},${Math.round(60+16*Math.sin(b))}`;
  }).join(' ');
  return `<svg viewBox="0 0 120 120" width="78" height="78">
    <polygon points="${pts}"
      fill="${shapeF()}" stroke="${shapeS()}" stroke-width="1.2" stroke-linejoin="round"/>
  </svg>`;
}

function drawSliceShape(){
  return `<svg viewBox="0 0 120 120" width="78" height="78">
    <ellipse cx="60" cy="62" rx="46" ry="34"
      fill="${shapeF()}" stroke="${shapeS()}" stroke-width="1.2"/>
    <ellipse cx="60" cy="62" rx="36" ry="25"
      fill="none" stroke="${shapeS()}" stroke-width="0.7" opacity="0.5"/>
    <ellipse cx="60" cy="62" rx="24" ry="16"
      fill="none" stroke="${shapeS()}" stroke-width="0.5" opacity="0.4"/>
    <ellipse cx="60" cy="62" rx="12" ry="8"
      fill="none" stroke="${shapeS()}" stroke-width="0.4" opacity="0.35"/>
    <circle cx="60" cy="62" r="3"
      fill="${shapeA()}" opacity="0.4"/>
  </svg>`;
}

function drawClusterShape(){
  return `<svg viewBox="0 0 120 120" width="78" height="78">
    <polygon points="60,18 67,46 76,96 44,96 53,46"
      fill="${shapeF()}" stroke="${shapeS()}" stroke-width="1.2" stroke-linejoin="round"/>
    <polygon points="34,32 40,54 50,92 28,92 26,56"
      fill="${shapeF()}" stroke="${shapeS()}" stroke-width="1" stroke-linejoin="round"/>
    <polygon points="86,28 92,52 96,90 72,92 74,52"
      fill="${shapeF()}" stroke="${shapeS()}" stroke-width="1" stroke-linejoin="round"/>
    <polygon points="47,26 52,48 58,86 37,86 35,50"
      fill="${shapeF()}" stroke="${shapeS()}" stroke-width="0.7" stroke-linejoin="round" opacity="0.7"/>
    <line x1="24" y1="93" x2="96" y2="93" stroke="${shapeS()}" stroke-width="1.5"/>
  </svg>`;
}

function drawDruzyShape(){
  let html = `<svg viewBox="0 0 120 120" width="78" height="78">
    <ellipse cx="60" cy="70" rx="46" ry="28" fill="${shapeF()}" stroke="${shapeS()}" stroke-width="1.2"/>`;
  const crystals = [
    [42,55],[50,48],[58,44],[66,46],[74,52],[80,58],[72,43],[54,38],[63,36],[48,61],[70,39]
  ];
  crystals.forEach(([cx,cy])=>{
    html += `<polygon points="${cx},${cy-10} ${cx+4},${cy} ${cx-4},${cy}" fill="${shapeF()}" stroke="${shapeS()}" stroke-width="0.8"/>`;
  });
  html += `</svg>`;
  return html;
}

function drawGeodeShape(){
  return `<svg viewBox="0 0 120 120" width="78" height="78">
    <path d="M60,20 C82,20 100,38 100,60 C100,82 82,100 60,100 C38,100 20,82 20,60 C20,38 38,20 60,20 Z"
      fill="${shapeF()}" stroke="${shapeS()}" stroke-width="1.2"/>
    <path d="M60,32 C76,32 88,44 88,60 C88,76 76,88 60,88 C44,88 32,76 32,60 C32,44 44,32 60,32 Z"
      fill="none" stroke="${shapeS()}" stroke-width="0.7" opacity="0.5"/>
    <path d="M60,46 C68,46 74,52 74,60 C74,68 68,74 60,74 C52,74 46,68 46,60 C46,52 52,46 60,46 Z"
      fill="rgba(42,37,32,0.04)" stroke="${shapeA()}" stroke-width="0.6" opacity="0.55"/>
    <line x1="55" y1="50" x2="52" y2="44" stroke="${shapeS()}" stroke-width="0.8" opacity="0.5"/>
    <line x1="60" y1="48" x2="60" y2="42" stroke="${shapeS()}" stroke-width="0.8" opacity="0.5"/>
    <line x1="65" y1="50" x2="68" y2="44" stroke="${shapeS()}" stroke-width="0.8" opacity="0.5"/>
    <line x1="70" y1="57" x2="76" y2="54" stroke="${shapeS()}" stroke-width="0.8" opacity="0.5"/>
    <line x1="50" y1="57" x2="44" y2="54" stroke="${shapeS()}" stroke-width="0.8" opacity="0.5"/>
  </svg>`;
}

function drawWandShape(){
  return `<svg viewBox="0 0 120 120" width="78" height="78">
    <polygon points="60,12 69,30 69,94 51,94 51,30"
      fill="${shapeF()}" stroke="${shapeS()}" stroke-width="1.2" stroke-linejoin="round"/>
    <line x1="51" y1="30" x2="69" y2="30" stroke="${shapeS()}" stroke-width="0.6" opacity="0.5"/>
    <line x1="51" y1="52" x2="69" y2="52" stroke="${shapeS()}" stroke-width="0.35" opacity="0.35"/>
    <line x1="51" y1="73" x2="69" y2="73" stroke="${shapeS()}" stroke-width="0.35" opacity="0.35"/>
    <ellipse cx="60" cy="94" rx="9" ry="4"
      fill="${shapeF()}" stroke="${shapeS()}" stroke-width="0.8"/>
  </svg>`;
}

function drawTowerShape(){
  return `<svg viewBox="0 0 120 120" width="78" height="78">
    <polygon points="60,14 75,34 75,96 45,96 45,34"
      fill="${shapeF()}" stroke="${shapeS()}" stroke-width="1.2" stroke-linejoin="round"/>
    <line x1="60" y1="14" x2="60" y2="96" stroke="${shapeS()}" stroke-width="0.4" opacity="0.4"/>
    <line x1="45" y1="52" x2="75" y2="52" stroke="${shapeS()}" stroke-width="0.4" opacity="0.35"/>
    <line x1="45" y1="74" x2="75" y2="74" stroke="${shapeS()}" stroke-width="0.4" opacity="0.35"/>
    <line x1="45" y1="96" x2="75" y2="96" stroke="${shapeS()}" stroke-width="1.6" opacity="0.5"/>
  </svg>`;
}

function drawFreeformShape(){
  return `<svg viewBox="0 0 120 120" width="78" height="78">
    <path d="M48,18 C60,14 80,22 88,38 C96,54 90,72 78,84 C66,96 48,100 36,88 C24,76 22,58 30,42 C36,30 36,22 48,18 Z"
      fill="${shapeF()}" stroke="${shapeS()}" stroke-width="1.2" stroke-linejoin="round"/>
    <path d="M52,30 C62,28 74,36 78,50 C82,64 74,76 64,80"
      fill="none" stroke="${shapeS()}" stroke-width="0.45" opacity="0.35"/>
  </svg>`;
}

function drawBowlShape(){
  return `<svg viewBox="0 0 120 120" width="78" height="78">
    <path d="M22,52 C22,80 38,96 60,96 C82,96 98,80 98,52 Z"
      fill="${shapeF()}" stroke="${shapeS()}" stroke-width="1.2"/>
    <line x1="22" y1="52" x2="98" y2="52" stroke="${shapeS()}" stroke-width="1.2"/>
    <path d="M34,52 C34,74 44,86 60,86 C76,86 86,74 86,52"
      fill="none" stroke="${shapeS()}" stroke-width="0.45" opacity="0.4"/>
  </svg>`;
}

function drawSpecimenShape(){
  return `<svg viewBox="0 0 120 120" width="78" height="78">
    <polygon points="60,16 80,28 90,52 84,76 66,92 40,88 24,68 28,42 44,24"
      fill="${shapeF()}" stroke="${shapeS()}" stroke-width="1.2" stroke-linejoin="round"/>
    <line x1="60" y1="16" x2="40" y2="88" stroke="${shapeS()}" stroke-width="0.4" opacity="0.3"/>
    <line x1="80" y1="28" x2="24" y2="68" stroke="${shapeS()}" stroke-width="0.4" opacity="0.3"/>
    <line x1="90" y1="52" x2="44" y2="24" stroke="${shapeS()}" stroke-width="0.4" opacity="0.3"/>
    <polygon points="54,34 62,34 66,42 60,48 52,44"
      fill="rgba(42,37,32,0.07)" stroke="${shapeS()}" stroke-width="0.6" opacity="0.6"/>
  </svg>`;
}

function drawMushroomShape(){
  return `<svg viewBox="0 0 120 120" width="78" height="78">
    <path d="M26,64 C26,38 40,20 60,20 C80,20 94,38 94,64 Z"
      fill="${shapeF()}" stroke="${shapeS()}" stroke-width="1.2" stroke-linejoin="round"/>
    <path d="M26,64 C26,70 38,74 60,74 C82,74 94,70 94,64"
      fill="none" stroke="${shapeS()}" stroke-width="1.2"/>
    <rect x="52" y="74" width="16" height="26" rx="4"
      fill="${shapeF()}" stroke="${shapeS()}" stroke-width="1.2"/>
    <ellipse cx="60" cy="100" rx="12" ry="4"
      fill="${shapeF()}" stroke="${shapeS()}" stroke-width="0.8"/>
  </svg>`;
}

function drawCarvingShape(){
  return `<svg viewBox="0 0 120 120" width="78" height="78">
    <ellipse cx="60" cy="52" rx="26" ry="30"
      fill="${shapeF()}" stroke="${shapeS()}" stroke-width="1.2"/>
    <ellipse cx="50" cy="46" rx="7" ry="8"
      fill="rgba(42,37,32,0.07)" stroke="${shapeS()}" stroke-width="0.8"/>
    <ellipse cx="70" cy="46" rx="7" ry="8"
      fill="rgba(42,37,32,0.07)" stroke="${shapeS()}" stroke-width="0.8"/>
    <path d="M50,66 C54,72 66,72 70,66"
      fill="none" stroke="${shapeS()}" stroke-width="1" stroke-linecap="round"/>
    <path d="M44,88 C48,80 52,78 60,78 C68,78 72,80 76,88"
      fill="${shapeF()}" stroke="${shapeS()}" stroke-width="1.2" stroke-linejoin="round"/>
  </svg>`;
}

function drawCabochonShape(){
  return `<svg viewBox="0 0 120 120" width="78" height="78">
    <path d="M18,76 Q18,34 60,30 Q102,34 102,76 L102,82 Q102,88 60,88 Q18,88 18,82 Z"
      fill="${shapeF()}" stroke="${shapeS()}" stroke-width="1.2"/>
    <line x1="18" y1="82" x2="102" y2="82" stroke="${shapeS()}" stroke-width="1.4"/>
    <ellipse cx="60" cy="56" rx="18" ry="9"
      fill="none" stroke="white" stroke-width="0.9" opacity="0.5"/>
  </svg>`;
}

// ── RENDER SHAPES ──

function renderShapes() {
  try { CRYSTAL_SHAPES; SHAPE_CATEGORIES; } catch(e) { setTimeout(renderShapes,0); return; }
  const container = document.getElementById('shapes-grid');
  if(!container) return;
  if(container.children.length > 0) return;

  const shapeMap = Object.fromEntries(CRYSTAL_SHAPES.map(s => [s.id, s]));

  const pane = document.createElement('div');
  pane.className = 'shapes-pane';

  const catCardEls = {};

  function setActiveCat(catLabel) {
    Object.entries(catCardEls).forEach(([lbl, el]) => el.classList.toggle('active', lbl === catLabel));
  }

  // Build 4-category selector
  const selectorOuter = document.createElement('div');
  selectorOuter.className = 'shapes-cat-selector';

  const selectorIntro = document.createElement('div');
  selectorIntro.className = 'shapes-cat-selector-intro';
  selectorIntro.innerHTML = '<span class="shapes-cat-selector-heading">Select a form family to explore.</span><span class="shapes-cat-selector-sub">Each family groups forms with similar ways of being and use.</span>';
  selectorOuter.appendChild(selectorIntro);

  const catCards = document.createElement('div');
  catCards.className = 'shapes-cat-cards';

  SHAPE_CATEGORIES.forEach(cat => {
    const card = document.createElement('button');
    card.className = 'shapes-cat-card';
    card.type = 'button';
    card.innerHTML = `<div class="shapes-cat-card-title">${cat.label}</div><div class="shapes-cat-card-def">${cat.def}</div>`;
    card.addEventListener('click', () => {
      setActiveCat(cat.label);
      showCategoryGrid(cat, pane, shapeMap, setActiveCat);
    });
    catCardEls[cat.label] = card;
    catCards.appendChild(card);
  });

  selectorOuter.appendChild(catCards);
  container.appendChild(selectorOuter);
  container.appendChild(pane);
  renderMobileShapes(container, shapeMap);

  // Default: Holdable
  const firstCat = SHAPE_CATEGORIES[0];
  setActiveCat(firstCat.label);
  showCategoryGrid(firstCat, pane, shapeMap, setActiveCat);
}

function renderMobileShapes(container, shapeMap) {
  const mobile = document.createElement('div');
  mobile.className = 'shapes-mobile';
  mobile.innerHTML = `
    <div class="forms-mobile-prompt">
      <div class="forms-mobile-prompt-heading">Explore by form family</div>
      <div class="forms-mobile-prompt-sub">Choose the kind of piece you're drawn to, then browse the forms within it.</div>
    </div>
    <div class="forms-mobile-landing">
      ${SHAPE_CATEGORIES.map((cat, i) => `
        <button class="forms-mobile-topic${i===0?' active':''}" type="button" data-cat="${cat.label}" aria-selected="${i===0?'true':'false'}">
          <span class="forms-mobile-topic-name">${cat.label}</span>
          <span class="forms-mobile-topic-sub">${cat.def || ''}</span>
        </button>`).join('')}
    </div>
    <div class="forms-mobile-label"><span class="forms-mobile-label-name"></span><span class="forms-mobile-label-def"></span></div>
    <div class="forms-mobile-tile-grid"></div>
    <div class="forms-mobile-detail" aria-live="polite"></div>`;

  const tileGrid = mobile.querySelector('.forms-mobile-tile-grid');
  const detail = mobile.querySelector('.forms-mobile-detail');
  const labelName = mobile.querySelector('.forms-mobile-label-name');
  const labelDef = mobile.querySelector('.forms-mobile-label-def');

  let activeCatShapes = [];
  let activeShapeIdx = 0;

  const chevL = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>`;
  const chevR = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>`;

  function renderMobileDetail(shape, catLabel) {
    const idx = activeCatShapes.findIndex(s => s.id === shape.id);
    const total = activeCatShapes.length;
    const pos = idx >= 0 ? idx + 1 : 1;
    const usePills = shape.use.split('·').map(u => `<span class="mobile-form-use-pill">${u.trim()}</span>`).join('');
    detail.innerHTML = `
      <article class="mobile-form-detail-card">
        <div class="mobile-form-detail-hero">
          <div class="mobile-form-detail-hero-icon">${shape.draw()}</div>
        </div>
        <div class="mobile-form-detail-copy">
          <div class="mobile-form-detail-nav">
            <button class="mobile-form-nav-btn" aria-label="Previous form" data-dir="-1">${chevL}</button>
            <div class="mobile-form-detail-hdr">
              <div class="mobile-form-nav-name">${shape.name}</div>
              <div class="mobile-form-detail-tagline">${shape.tagline}</div>
            </div>
            <button class="mobile-form-nav-btn" aria-label="Next form" data-dir="1">${chevR}</button>
          </div>
          <div class="mobile-form-detail-desc">${shape.body}</div>
          <div class="mobile-form-detail-use-row">
            <div class="mobile-form-detail-use-label">Best for</div>
            <div class="mobile-form-use-pills">${usePills}</div>
          </div>
          <div class="mobile-form-detail-examples">
            ${shape.examples.map(e => `<button type="button" class="shape-pill" onclick="jumpToStone('${e}')">${e}</button>`).join('')}
          </div>
        </div>
        <div class="mobile-form-nav-indicator">${catLabel} · ${pos} of ${total}</div>
      </article>`;

    detail.querySelectorAll('.mobile-form-nav-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const dir = parseInt(btn.dataset.dir, 10);
        activeShapeIdx = (activeShapeIdx + dir + activeCatShapes.length) % activeCatShapes.length;
        const next = activeCatShapes[activeShapeIdx];
        const currentCat = SHAPE_CATEGORIES.find(c => c.ids.includes(next.id)) || SHAPE_CATEGORIES[0];
        syncActiveTile(next.id);
        renderMobileDetail(next, currentCat.label);
      });
    });
  }

  function syncActiveTile(id) {
    tileGrid.querySelectorAll('.mobile-form-tile').forEach(el => {
      el.classList.toggle('active', el.dataset.id === id);
    });
  }

  function setMobileCategory(catLabel, scroll) {
    const cat = SHAPE_CATEGORIES.find(c => c.label === catLabel) || SHAPE_CATEGORIES[0];
    activeCatShapes = cat.ids.map(id => shapeMap[id]).filter(Boolean);
    activeShapeIdx = 0;

    mobile.querySelectorAll('.forms-mobile-topic').forEach(btn => {
      const isActive = btn.dataset.cat === catLabel;
      btn.classList.toggle('active', isActive);
      btn.setAttribute('aria-selected', String(isActive));
    });

    if(labelName) labelName.textContent = cat.label + ' Forms';
    if(labelDef) labelDef.textContent = cat.def || '';

    detail.innerHTML = '';

    tileGrid.innerHTML = activeCatShapes.map((s) => `
      <button class="mobile-form-tile" type="button" data-id="${s.id}">
        <span class="mobile-form-tile-icon">${s.draw()}</span>
        <span class="mobile-form-tile-name">${s.name}</span>
      </button>`).join('');

    tileGrid.querySelectorAll('.mobile-form-tile').forEach(tile => {
      tile.addEventListener('click', () => {
        const shape = shapeMap[tile.dataset.id];
        if(!shape) return;
        activeShapeIdx = activeCatShapes.findIndex(s => s.id === shape.id);
        syncActiveTile(shape.id);
        renderMobileDetail(shape, catLabel);
        requestAnimationFrame(() => detail.scrollIntoView({ behavior: 'smooth', block: 'nearest' }));
      });
    });
    if(scroll) {
      const labelEl = mobile.querySelector('.forms-mobile-label');
      requestAnimationFrame(() => (labelEl||tileGrid).scrollIntoView({ behavior: 'smooth', block: 'start' }));
    }
  }

  mobile.querySelectorAll('.forms-mobile-topic').forEach(btn => {
    btn.addEventListener('click', () => setMobileCategory(btn.dataset.cat, true));
  });

  setMobileCategory(SHAPE_CATEGORIES[0].label, false);
  container.appendChild(mobile);
}

function showCategoryGrid(cat, pane, shapeMap, setActiveCat) {
  const shapes = cat.ids.map(id => shapeMap[id]).filter(Boolean);
  const chevL = `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>`;

  pane.innerHTML = `
    <div class="cat-grid-header">
      <span class="cat-grid-title">${cat.label}</span>
      <span class="cat-grid-sub">${cat.def || ''}</span>
    </div>
    <div class="cat-grid">
      ${shapes.map(s => `
        <div class="cat-card" data-id="${s.id}">
          <div class="cat-card-illus">${s.draw()}</div>
          <div class="cat-card-body">
            <div class="cat-card-name">${s.name}</div>
            <div class="cat-card-tagline">${s.tagline}</div>
            <div class="cat-card-desc">${s.tile||s.body}</div>
          </div>
        </div>`).join('')}
    </div>`;

  pane.querySelectorAll('.cat-card').forEach(card => {
    const shape = shapeMap[card.dataset.id];
    if(!shape) return;
    card.addEventListener('click', () => {
      setActiveCat(cat.label);
      showShapeDetail(shape, cat, pane, shapeMap, setActiveCat);
    });
  });
}

function showShapeDetail(shape, cat, pane, shapeMap, setActiveCat) {
  const chevL = `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>`;
  pane.innerHTML = `
    <button class="shape-back-link">${chevL} Back to ${cat.label}</button>
    <div class="shape-pane-layout">
      <div class="shape-illustration">${shape.draw()}</div>
      <div>
        <div class="shape-name">${shape.name}</div>
        <div class="shape-tagline">${shape.tagline}</div>
        <div class="shape-desc">${shape.body}</div>
        <div class="shape-use"><span class="shape-use-label">Best for</span> ${shape.use}</div>
        <div class="shape-examples">${shape.examples.map(e=>`<span class="shape-pill" onclick="jumpToStone('${e}')">${e}</span>`).join('')}</div>
      </div>
    </div>`;
  pane.querySelector('.shape-back-link').addEventListener('click', () => {
    setActiveCat(cat.label);
    showCategoryGrid(cat, pane, shapeMap, setActiveCat);
  });
}

