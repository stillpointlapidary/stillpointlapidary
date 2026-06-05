/* ── Main App JS (from lines 1949–6252) ── */
let CRYSTALS = [];  // populated async from Supabase
const MOOD_THEME_MAP={"0": ["Grounding", "Calm & Peace"], "1": ["Grounding", "Stability"], "2": ["Grounding", "Confidence"], "3": ["Calm & Peace"], "4": ["Protection"], "5": ["Stability", "Grounding"], "6": ["Heart Healing", "Self-Love"], "7": ["Calm & Peace"], "8": ["Transformation", "Clarity & Focus"], "9": ["Heart Healing"], "10": ["Joy", "Vitality"], "11": ["Self-Love"], "12": ["Communication", "Heart Healing"], "13": ["Clarity & Focus"], "14": ["Vitality", "Confidence"], "15": ["Communication"], "16": ["Confidence"], "17": ["Manifestation", "Confidence"], "18": ["Manifestation", "Confidence"], "20": ["Confidence", "Manifestation"], "21": ["Spiritual Connection", "Clarity & Focus"], "22": ["Intuition"], "23": ["Spiritual Connection", "Intuition"], "24": ["Spiritual Connection", "Calm & Peace"], "25": ["Transformation"], "26": ["Heart Healing", "Vitality"], "27": ["Vitality"], "28": ["Transformation", "Protection"], "29": ["Grounding", "Vitality"], "19": ["Spiritual Connection", "Clarity & Focus"]};
const SUB_FILTERS={"0": ["Calming Down", "Nervous System", "Sensory Overwhelm", "Racing Mind"], "1": ["Earthing & Body", "Centering", "Scattered Energy", "Overwhelm"], "2": ["Fear & Resistance", "Inertia", "Blocked Forward Motion", "Moving Through"], "3": ["Falling Asleep", "Staying Asleep", "Anxiety at Night", "Winding Down"], "4": ["Energetic Shielding", "Boundary Setting", "Psychic Protection", "Space Clearing"], "5": ["Through Change", "Emotional Structure", "Steady Support"], "6": ["Grief", "Loss of a Person", "Endings & Goodbyes", "Comfort in Sadness"], "7": ["Anxiety", "Sleep & Rest", "Nervous System", "Overwhelm"], "8": ["Releasing Anger", "Processing Hurt", "Letting Go", "Finding Peace"], "9": ["Grief & Loss", "Heartbreak", "Forgiveness", "Deep Wounds"], "10": ["Creative Spark", "Optimism", "Mood Lifting", "Playfulness"], "11": ["Self-Worth", "Inner Kindness", "After Self-Criticism", "Nurturing"], "12": ["Building Trust", "Opening Communication", "Healing a Rift", "Deepening Connection"], "13": ["Focus & Study", "Decision Making", "Mental Clutter", "Overthinking"], "14": ["Physical Energy", "Mental Drive", "Getting Started", "Sustaining Momentum"], "15": ["Speaking Truth", "Being Heard", "Difficult Conversations", "Honest Expression"], "16": ["Bold Action", "Self-Trust", "Personal Power", "Overcoming Fear"], "17": ["Abundance", "Drawing In Love", "Attracting Opportunity", "Opening to Receive"], "18": ["Career & Work", "Financial Goals", "Creative Projects", "Personal Growth"], "19": ["Before Meditation", "Before a Grid", "New Moon Practice", "Working with a Stone"], "20": ["Life Direction", "Soul Calling", "Meaning & Purpose", "Reconnecting to Self"], "21": ["Inner Knowing", "Dream Work", "Psychic Sensitivity", "Visions"], "22": ["Meditation", "Higher Guidance", "Divine Connection", "Spiritual Growth"], "23": ["Deepening Practice", "Stillness", "Going Inward", "Spiritual Focus"], "24": ["Shadow Work", "Releasing Patterns", "Rebirth & Growth", "Ancestral Work"], "25": ["Physical Recovery", "Emotional Healing", "After Illness", "Gentle Support"], "26": ["Stamina", "Activation", "Life Force", "Physical Vitality"], "27": ["Clearing Space", "Moving Stuck Energy", "Purification", "Fresh Energy"], "28": ["Body Awareness", "Grounding in the Body", "Somatic Presence", "Embodiment"]};
const SUB_FILTER_KW={"0": {"Calming Down": ["calm", "settle", "slow down"], "Nervous System": ["nervous", "overwhelm", "sensitiv"], "Sensory Overwhelm": ["sensitiv", "overload", "too much"], "Racing Mind": ["racing", "busy mind", "overthink", "restless"]}, "1": {"Earthing & Body": ["body", "earth", "earthing"], "Centering": ["center", "pulled back"], "Scattered Energy": ["scatter", "drained"], "Overwhelm": ["overwhelm"]}, "2": {"Fear & Resistance": ["fear", "resist", "block", "hesit"], "Inertia": ["stuck", "inertia", "stagnant", "static"], "Blocked Forward Motion": ["forward", "momentum", "move", "start"], "Moving Through": ["moving", "unstuck", "progress", "through"]}, "3": {"Falling Asleep": ["sleep", "insomnia", "rest"], "Staying Asleep": ["sleep", "night", "disturb", "wake"], "Anxiety at Night": ["anxiety", "night", "worry", "restless"], "Winding Down": ["calm", "quiet", "unwind", "relax"]}, "4": {"Energetic Shielding": ["shield", "protect", "block"], "Boundary Setting": ["boundary"], "Psychic Protection": ["psychic"], "Space Clearing": ["clearing", "heavy energy"]}, "5": {"Through Change": ["chang", "transit", "shift"], "Emotional Structure": ["structur", "anchor", "stable"], "Steady Support": ["steady", "support", "hold"]}, "6": {"Grief": ["grief", "griev", "mourn"], "Loss of a Person": ["loss", "loved one", "death", "bereav"], "Endings & Goodbyes": ["ending", "goodbye", "letting go", "closure"], "Comfort in Sadness": ["comfort", "support", "hold", "gentl"]}, "7": {"Anxiety": ["anxiety", "anxious", "worry", "fear"], "Sleep & Rest": ["sleep", "rest", "insomnia"], "Nervous System": ["nervous", "sensitiv", "hyperv"], "Overwhelm": ["overwhelm", "too much"]}, "8": {"Releasing Anger": ["anger", "rage", "frustrat", "irritat"], "Processing Hurt": ["hurt", "wound", "pain", "betray"], "Letting Go": ["release", "let go", "forgiv", "move on"], "Finding Peace": ["peace", "calm", "accept", "resolv"]}, "9": {"Grief & Loss": ["grief", "griev", "mourn", "loss"], "Heartbreak": ["heartbreak", "heartbroken", "romantic"], "Forgiveness": ["forgiv", "release", "let go"], "Deep Wounds": ["deep wound", "trauma", "old hurt"]}, "10": {"Creative Spark": ["creat", "inspir", "idea"], "Optimism": ["optim", "hope", "brightl"], "Mood Lifting": ["mood", "lift", "uplift", "depress"], "Playfulness": ["play", "fun", "joy", "light"]}, "11": {"Self-Worth": ["worth", "deserv", "enough"], "Inner Kindness": ["kind", "gentle", "soft"], "After Self-Criticism": ["critic", "judg", "shame"], "Nurturing": ["nurtur", "care", "support"]}, "12": {"Building Trust": ["trust", "safe", "open", "connect"], "Opening Communication": ["communicat", "speak", "express", "honest"], "Healing a Rift": ["heal", "repair", "reconcil", "rift"], "Deepening Connection": ["deep", "bond", "intimac", "close"]}, "13": {"Focus & Study": ["focus", "study", "concentr"], "Decision Making": ["decis", "choice", "clarity"], "Mental Clutter": ["clutter", "fog", "confused"], "Overthinking": ["overthink", "loop", "ruminate"]}, "14": {"Physical Energy": ["energy", "vitality", "stamina", "activat"], "Mental Drive": ["motivat", "drive", "purpose", "direction"], "Getting Started": ["start", "begin", "initiat", "action"], "Sustaining Momentum": ["momentum", "sustain", "persist", "continue"]}, "15": {"Speaking Truth": ["truth", "honest", "authentic"], "Being Heard": ["heard", "voice", "express"], "Difficult Conversations": ["difficult", "hard conversation", "confrontat"], "Honest Expression": ["express", "articulate", "clear"]}, "16": {"Bold Action": ["bold", "action", "courage"], "Self-Trust": ["trust", "instinct", "inner knowing"], "Personal Power": ["power", "authority", "strength"], "Overcoming Fear": ["fear", "hesit", "doubt"]}, "17": {"Abundance": ["abundan", "prosper", "wealth", "financial"], "Drawing In Love": ["love", "relationship", "partner", "attract"], "Attracting Opportunity": ["opportun", "luck", "success", "open"], "Opening to Receive": ["receiv", "allow", "welcome", "open"]}, "18": {"Career & Work": ["career", "work", "profession", "success"], "Financial Goals": ["financial", "money", "prosper", "abundan"], "Creative Projects": ["creat", "project", "vision", "idea"], "Personal Growth": ["growth", "personal", "develop", "become"]}, "19": {"Before Meditation": ["meditat", "stillness", "focus", "center"], "Before a Grid": ["grid", "layout", "sacred", "space"], "New Moon Practice": ["new moon", "lunar", "cycle", "plant"], "Working with a Stone": ["stone", "crystal", "hold", "work"]}, "20": {"Life Direction": ["direction", "path", "purpose", "calling"], "Soul Calling": ["soul", "calling", "mean", "destined"], "Meaning & Purpose": ["meaning", "purpose", "why", "alive"], "Reconnecting to Self": ["reconnect", "self", "identity", "return"]}, "21": {"Inner Knowing": ["inner knowing", "gut", "instinct"], "Dream Work": ["dream", "visions", "sleep"], "Psychic Sensitivity": ["psychic", "sensitiv", "perceptive"], "Visions": ["vision", "seeing", "clairvoy"]}, "22": {"Meditation": ["meditat", "stillness", "quiet mind"], "Higher Guidance": ["higher", "divine", "guidance"], "Divine Connection": ["divine", "sacred", "holy"], "Spiritual Growth": ["growth", "evolv", "ascend"]}, "23": {"Deepening Practice": ["deepen", "practice", "discipl"], "Stillness": ["still", "quiet", "silent", "inner peace"], "Going Inward": ["inward", "inner", "within", "contempl"], "Spiritual Focus": ["focus", "concentrat", "present", "aware"]}, "24": {"Shadow Work": ["shadow", "unconscious", "hidden"], "Releasing Patterns": ["pattern", "habit", "cycle"], "Rebirth & Growth": ["rebirth", "new", "transform"], "Ancestral Work": ["ancestral", "lineage", "inherited"]}, "25": {"Physical Recovery": ["physical", "body", "recover", "restor"], "Emotional Healing": ["emotional", "heart", "wound", "heal"], "After Illness": ["illness", "sick", "weak", "depleted"], "Gentle Support": ["gentl", "soft", "nurtur", "support"]}, "26": {"Stamina": ["stamina", "endur", "persist", "sustain"], "Activation": ["activat", "energiz", "spark", "vitalize"], "Life Force": ["life force", "prana", "chi", "vital"], "Physical Vitality": ["physical", "body", "strength", "vigor"]}, "27": {"Clearing Space": ["space", "room", "environment", "clear"], "Moving Stuck Energy": ["stuck", "stagnant", "heavy", "dense"], "Purification": ["purif", "cleanse", "reset", "fresh"], "Fresh Energy": ["fresh", "renew", "new", "uplift"]}, "28": {"Body Awareness": ["body", "somatic", "sensation", "physical"], "Grounding in the Body": ["ground", "earth", "anchor", "roots"], "Somatic Presence": ["somatic", "present", "here", "aware"], "Embodiment": ["embod", "inhabit", "physical", "flesh"]}};
// ── STATE ──
let filters={fam:'all',theme:'all',color:'all',chakra:'all',mohs:'all',formation:'all',material:'all'};
let collFilters={cfam:'all',ctheme:'all',ccolor:'all',cchakra:'all',cmohs:'all',cformation:'all',cmaterial:'all',form:'all',size:'all',cshelf:'all'};
let collQuickFilter='all';
let collActiveFamilyName=null; // 'all' | 'wish'
let sortBy='name';

function _emptyCollHtml(){
  return `<div class="empty-coll-state">
    <div class="empty-coll-icon">◇</div>
    <div class="empty-coll-title">Your collection is empty</div>
    <div class="empty-coll-text">Add stones you own to build your collection and track them across all your devices.</div>
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
let collection=[]; // Supabase-backed; do not seed from legacy browser cache.
let addPieceReturnContext=null;
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
  {group:'Grounding & Stability',label:'I feel overwhelmed or overstimulated',sub:'Nervous system · Slowing down · Finding quiet'},
  {group:'Grounding & Stability',label:'I feel scattered or anxious',sub:'Grounding · Anchoring · Coming back to earth'},
  {group:'Grounding & Stability',label:'I feel stuck and cannot move forward',sub:'Inertia · Resistance · Stagnation'},
  {group:'Grounding & Stability',label:'I need better sleep',sub:'Rest · Calming the mind · Night support'},
  {group:'Grounding & Stability',label:'I need protection',sub:'Energetic shielding · Boundary holding'},
  {group:'Grounding & Stability',label:'I need stability through change',sub:'Steadiness · Structure · Support'},
  {group:'Heart & Emotional',label:'I am grieving a loss',sub:'Grief · Comfort · Gentle healing · Acceptance'},
  {group:'Heart & Emotional',label:'I need calm and peace',sub:'Anxiety relief · Nervous system · Soothing'},
  {group:'Heart & Emotional',label:'I need to release anger or frustration',sub:'Emotional release · Letting go · Processing'},
  {group:'Heart & Emotional',label:'My heart needs healing',sub:'Grief · Heartbreak · Forgiveness'},
  {group:'Heart & Emotional',label:'I want joy and creative energy',sub:'Happiness · Optimism · Creative spark'},
  {group:'Heart & Emotional',label:'I want more self-compassion',sub:'Self-love · Inner kindness · Self-worth'},
  {group:'Heart & Emotional',label:'I want to improve a relationship',sub:'Connection · Empathy · Communication · Trust'},
  {group:'Mind & Will',label:'I need mental clarity',sub:'Focus · Decision-making · Clear thinking'},
  {group:'Mind & Will',label:'I need motivation and energy',sub:'Vitality · Drive · Getting unstuck · Forward motion'},
  {group:'Mind & Will',label:'I need to communicate better',sub:'Speaking truth · Being heard · Expression'},
  {group:'Mind & Will',label:'I want more confidence',sub:'Boldness · Action · Self-trust · Power'},
  {group:'Mind & Will',label:'I want to attract something into my life',sub:'Manifestation · Abundance · Intention-setting'},
  {group:'Mind & Will',label:'I want to manifest a goal',sub:'Intention · Abundance · Drawing things toward you'},
  {group:'Mind & Will',label:'I want to set an intention',sub:'Ritual · Focused practice · Working with purpose · Beginning'},
  {group:'Mind & Will',label:'I want to start something new',sub:'New beginnings · Fresh starts · Courage to begin'},
  {group:'Spirit & Intuition',label:'I feel disconnected from my purpose',sub:'Clarity of path · Soul alignment · Meaning'},
  {group:'Spirit & Intuition',label:'I want deeper intuition',sub:'Inner knowing · Psychic sensitivity · Dreams'},
  {group:'Spirit & Intuition',label:'I want spiritual connection',sub:'Higher guidance · Meditation · Awareness'},
  {group:'Spirit & Intuition',label:'I want to deepen my meditation',sub:'Stillness · Focus · Going inward'},
  {group:'Spirit & Intuition',label:"I'm ready for transformation",sub:'Shadow work · Releasing patterns · Growth'},
  {group:'Body & Vitality',label:'I am healing or recovering',sub:'Regeneration · Support · Gentle restoration'},
  {group:'Body & Vitality',label:'I need more physical energy',sub:'Vitality · Stamina · Activation · Life force'},
  {group:'Body & Vitality',label:'I want to clear stagnant energy',sub:'Purification · Renewal · Moving what is stuck'},
  {group:'Body & Vitality',label:'I want to feel more present in my body',sub:'Embodiment · Grounding · Physical awareness'}
]
const MOOD_GROUPS=['All','Grounding & Stability','Heart & Emotional','Mind & Will','Spirit & Intuition','Body & Vitality'];


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

function renderFeaturedStones(){
  const container = document.getElementById('featured-cards');
  if(!container || container.children.length > 0) return;
  container.innerHTML = FEATURED_STONES.map(s => {
    const hasPhoto = !!s.photo;
    const photoHtml = hasPhoto
      ? `<img class="featured-card-photo" src="${SUPABASE_STONES}${s.photo}" alt="${s.name} crystal specimen" loading="lazy">`
      : '';
    const dotHtml = !hasPhoto
      ? `<div class="featured-card-dot" style="background:${s.hex}"></div>`
      : '';
    return `
    <div class="featured-card${hasPhoto?' has-photo':''}" onclick="openDetail('${s.id}')">
      ${photoHtml}
      <div class="featured-card-name-row" style="display:flex;align-items:center;gap:0.6rem${hasPhoto?'':';padding:0'}">
        ${dotHtml}
        <div class="featured-card-name">${s.name}</div>
      </div>
      <div class="featured-card-use">${s.use}</div>
      <div class="featured-card-intention">"${s.intention}"</div>
    </div>`;
  }).join('');
}
// ── STONE OF THE DAY ──
function renderSotd(){
  const container=document.getElementById('sotd-container');
  if(!container)return;
  const day=Math.floor(Date.now()/86400000);
  const s=FEATURED_STONES[day%FEATURED_STONES.length];
  if(!s)return;
  const photoHtml=s.photo?`<div class="sotd-card-photo"><img src="${SUPABASE_STONES}${s.photo}" alt="${s.name}" loading="lazy"></div>`:'';
  container.innerHTML=`<div class="sotd-card" onclick="openDetail('${s.id}')" style="cursor:pointer">
    ${photoHtml}
    <div class="sotd-card-body">
      <div class="sotd-card-label">Stone of the Day</div>
      <div class="sotd-card-name">${s.name}</div>
      <div class="sotd-card-tagline">${s.use}</div>
      <div class="sotd-card-desc">"${s.intention}"</div>
      <div class="sotd-card-link">View ${s.name} in the encyclopedia →</div>
    </div>
  </div>`;
}

// ── INIT ──
function init(){
  if('scrollRestoration' in history){history.scrollRestoration='manual';}
  renderFeaturedStones();
  renderSotd();
  // Load custom encyclopedia entries
  customEntries.forEach(e=>{if(!CRYSTALS.find(c=>c.i===e.i))CRYSTALS.push(e);});
  const n=CRYSTALS.length;
  const stoneCountEl=document.getElementById('stone-count');
  if(stoneCountEl)stoneCountEl.textContent=n+' entries';
  ['intro-stone-count','browse-stone-count','divider-stone-count'].forEach(id=>{const el=document.getElementById(id);if(el)el.textContent=n;});
  // Encyclopedia-only initialisation (skipped on homepage)
  const isEncyclopediaPage=!!document.getElementById('crystal-grid');
  if(isEncyclopediaPage){
    buildEncPanels();
    buildMoodGroupPills();
    renderMoodGrid('All');
    buildYearSelect('f-year');
    encRender();
    const rememberedTab=(()=>{try{return localStorage.getItem('spl_active_tab')||'encyclopedia';}catch(e){return'encyclopedia';}})();
    if(rememberedTab==='collection'){
      const wrap=document.getElementById('coll-wrap');
      if(wrap)wrap.innerHTML='<div class="empty-coll">Loading your collection…</div>';
    }else{
      renderCollection();
    }
    if(['encyclopedia','mood','collection','identify','101'].includes(rememberedTab)&&rememberedTab!=='encyclopedia'){
      switchTabByName(rememberedTab);
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

// ── FILTER PANELS ──
function buildEncPanels(){
  const famOpts=FAM_OPTS.filter(f=>CRYSTALS.some(c=>c.fam===f||c.sp===f));
  buildPanel('pills-fam','fam',famOpts.map(f=>({val:f,label:f})));
  buildThemedPanel('pills-theme','theme');
  buildColorPanel();
  buildPanel('pills-chakra','chakra',CHAKRA_OPTS.map(c=>({val:c,label:c})));
  buildPanel('pills-mohs','mohs',[
    {val:'soft',label:'Soft (1–4)'},
    {val:'medium',label:'Medium (5–6)'},
    {val:'hard',label:'Hard (7+)'},
  ]);
  buildPanel('pills-formation','formation',[
    {val:'Igneous',label:'Igneous'},
    {val:'Metamorphic',label:'Metamorphic'},
    {val:'Sedimentary',label:'Sedimentary'},
    {val:'Hydrothermal',label:'Hydrothermal'},
    {val:'Secondary',label:'Secondary'},
    {val:'Extraterrestrial',label:'Extraterrestrial'},
    {val:'Biological',label:'Biological'},
  ]);
  buildPanel('pills-material','material',[
    {val:'Mineral',label:'Mineral'},
    {val:'Mineraloid',label:'Mineraloid'},
    {val:'Aggregate',label:'Aggregate'},
    {val:'Organic',label:'Organic'},
    {val:'Fossil',label:'Fossil'},
    {val:'Synthetic',label:'Synthetic'},
  ]);
}

function buildPanel(containerId,filterKey,items){
  const wrap=document.getElementById(containerId);
  if(!wrap)return;
  wrap.innerHTML=`<button class="fpill active" onclick="setFilter('${filterKey}','all',this)">All</button>`+
    items.map(it=>`<button class="fpill" onclick="setFilter('${filterKey}','${it.val}',this)">${it.label}</button>`).join('');
}

function buildThemedPanel(containerId,filterKey){
  const wrap=document.getElementById(containerId);
  if(!wrap)return;
  let html=`<button class="fpill active" onclick="setFilter('${filterKey}','all',this)">All</button>`;
  THEME_GROUPS.forEach(g=>{
    html+=`<div class="theme-group-label">${g.label}</div>`;
    html+=g.themes.map(t=>`<button class="fpill" onclick="setFilter('${filterKey}','${t}',this)">${t}</button>`).join('');
  });
  wrap.innerHTML=html;
}

function buildColorPanel(){
  const wrap=document.getElementById('pills-color');
  if(!wrap)return;
  wrap.innerHTML=`<button class="fpill active" onclick="setFilter('color','all',this)">All</button>`+
    COLOR_OPTS.map(c=>`<button class="fpill" onclick="setFilter('color','${c.val}',this)"><span class="cswatch" style="background:${c.hex}"></span>${c.val}</button>`).join('');
}

function buildCollColorPanel(){
  const wrap=document.getElementById('cpills-ccolor');
  if(!wrap)return;
  wrap.innerHTML=`<button class="fpill active" onclick="setCollFilter('ccolor','all',this)">All</button>`+
    COLOR_OPTS.map(c=>`<button class="fpill" onclick="setCollFilter('ccolor',${jsArg(c.val)},this)"><span class="cswatch" style="background:${c.hex}"></span>${escapeAttr(c.val)}</button>`).join('');
}
function collectionStoneMatchesMohs(c,val){
  if(val==='all')return true;
  const raw=String(c?.m||'').match(/[0-9.]+/g);
  if(!raw||!raw.length)return false;
  const nums=raw.map(Number).filter(n=>Number.isFinite(n));
  const max=Math.max(...nums);
  if(val==='soft')return max<=4;
  if(val==='medium')return max>=5&&max<=6;
  if(val==='hard')return max>=7;
  return true;
}
function collectionStoneMatchesTheme(c,val){
  if(val==='all')return true;
  return (c?.primary_theme===val)||((c?.all_themes||[]).includes(val));
}
function collectionStoneMatchesColor(c,val){
  if(val==='all')return true;
  return c?.col_cat===val||((c?.col_cats||[]).includes(val));
}
function collectionStoneMatchesChakra(c,val){
  if(val==='all')return true;
  return (c?.chakras||[]).includes(val);
}
function collectionStoneMatchesMaterial(c,val){
  if(val==='all')return true;
  return c?.mt===val;
}
function collectionStoneMatchesFormation(c,val){
  if(val==='all')return true;
  return c?.fo===val;
}
function buildCollPanels(){
  const forms=['Tumbled','Palm stone','Raw / Rough','Freeform','Polished freeform','Tower / Point','Sphere','Egg','Cluster','Geode','Slice','Heart','Moon','Star','Mushroom','Wand','Skull','Carved','Cabochon','Other'];
  const sizes=['XS','S','M','L','XL'];
  const cfams=[...new Set(CRYSTALS.map(c=>c.fam||'').filter(Boolean))].sort();
  const materials=[...new Set(CRYSTALS.map(c=>c.mt||'').filter(Boolean))].sort();
  const formations=[...new Set(CRYSTALS.map(c=>c.fo||'').filter(Boolean))].sort();
  const cf=document.getElementById('cpills-form');
  const cs=document.getElementById('cpills-size');
  const cc=document.getElementById('cpills-cfam');
  const ct=document.getElementById('cpills-ctheme');
  const cch=document.getElementById('cpills-cchakra');
  const cm=document.getElementById('cpills-cmohs');
  const cfo=document.getElementById('cpills-cformation');
  const cmt=document.getElementById('cpills-cmaterial');
  if(cc)cc.innerHTML=`<button class="fpill active" onclick="setCollFilter('cfam','all',this)">All</button>`+cfams.map(f=>`<button class="fpill" onclick="setCollFilter('cfam',${jsArg(f)},this)">${escapeAttr(f)}</button>`).join('');
  if(ct)ct.innerHTML=`<button class="fpill active" onclick="setCollFilter('ctheme','all',this)">All</button>`+THEME_OPTS.map(t=>`<button class="fpill" onclick="setCollFilter('ctheme',${jsArg(t)},this)">${escapeAttr(t)}</button>`).join('');
  buildCollColorPanel();
  if(cch)cch.innerHTML=`<button class="fpill active" onclick="setCollFilter('cchakra','all',this)">All</button>`+CHAKRA_OPTS.map(ch=>`<button class="fpill" onclick="setCollFilter('cchakra',${jsArg(ch)},this)">${escapeAttr(ch)}</button>`).join('');
  if(cm)cm.innerHTML=`<button class="fpill active" onclick="setCollFilter('cmohs','all',this)">All</button>`+[
    {val:'soft',label:'Soft (1–4)'},{val:'medium',label:'Medium (5–6)'},{val:'hard',label:'Hard (7+)'}
  ].map(x=>`<button class="fpill" data-value="${x.val}" onclick="setCollFilter('cmohs','${x.val}',this)">${x.label}</button>`).join('');
  if(cfo)cfo.innerHTML=`<button class="fpill active" onclick="setCollFilter('cformation','all',this)">All</button>`+formations.map(f=>`<button class="fpill" onclick="setCollFilter('cformation',${jsArg(f)},this)">${escapeAttr(f)}</button>`).join('');
  if(cmt)cmt.innerHTML=`<button class="fpill active" onclick="setCollFilter('cmaterial','all',this)">All</button>`+materials.map(m=>`<button class="fpill" onclick="setCollFilter('cmaterial',${jsArg(m)},this)">${escapeAttr(m)}</button>`).join('');
  if(cf)cf.innerHTML=`<button class="fpill active" onclick="setCollFilter('form','all',this)">All</button>`+forms.map(f=>`<button class="fpill" onclick="setCollFilter('form',${jsArg(f)},this)">${escapeAttr(f)}</button>`).join('');
  if(cs)cs.innerHTML=`<button class="fpill active" onclick="setCollFilter('size','all',this)">All</button>`+sizes.map(sz=>`<button class="fpill" onclick="setCollFilter('size',${jsArg(sz)},this)">${escapeAttr(sz)}</button>`).join('');
  const usedShelves=[...new Set(collection.map(p=>p.shelf||p.locCustom||'').filter(Boolean))].sort();
  const shelfOpts=usedShelves.length?usedShelves:['Shelf 1','Shelf 2','Shelf 3','Shelf 4','Altar','Bedside','Cabinet','Office desk'];
  const csh=document.getElementById('cpills-cshelf');
  if(csh)csh.innerHTML=`<button class="fpill active" onclick="setCollFilter('cshelf','all',this)">All</button>`+shelfOpts.map(sh=>`<button class="fpill" onclick="setCollFilter('cshelf',${jsArg(sh)},this)">${escapeAttr(sh)}</button>`).join('');
  ['cfam','ctheme','ccolor','cchakra','cmohs','cformation','cmaterial','form','size','cshelf'].forEach(k=>{
    const val=collFilters[k]||'all';
    document.querySelectorAll('#cpills-'+k+' .fpill').forEach(p=>p.classList.toggle('active', p.textContent.trim()===String(val) || (val==='all'&&p.textContent.trim()==='All')));
    updateBtn('cfbtn-'+k,'cfval-'+k,val);
  });
}
function togglePanel(key,e){
  if(e)e.stopPropagation();
  const panel=document.getElementById('panel-'+key);
  const btn=document.getElementById('fbtn-'+key);
  if(!panel||!btn)return;
  if(openPanel===key){panel.classList.remove('open');btn.classList.remove('open');openPanel=null;}
  else{closeAllPanels();panel.classList.add('open');btn.classList.add('open');openPanel=key;}
}

function toggleCollPanel(key,e){
  if(e)e.stopPropagation();
  const panel=document.getElementById('cpanel-'+key);
  const btn=document.getElementById('cfbtn-'+key);
  if(!panel||!btn)return;
  const pkey='c'+key;
  if(openPanel===pkey){panel.classList.remove('open');btn.classList.remove('open');openPanel=null;}
  else{closeAllPanels();panel.classList.add('open');btn.classList.add('open');openPanel=pkey;}
}

function closeAllPanels(){
  document.querySelectorAll('.filter-panel').forEach(p=>p.classList.remove('open'));
  document.querySelectorAll('.filter-cat-btn').forEach(b=>b.classList.remove('open'));
  openPanel=null;
}

function handleOutsideClick(e){
  if(!e.target.closest('.filter-cat-btn')&&!e.target.closest('.filter-panel'))closeAllPanels();
}

function updateBtn(btnId,valId,val){
  const btn=document.getElementById(btnId);
  const valEl=document.getElementById(valId);
  if(btn)btn.classList.toggle('has-val',val!=='all');
  if(valEl)valEl.textContent=val==='all'?'':'· '+val;
}

function setFilter(key,val,btn){
  filters[key]=val;
  document.querySelectorAll('#pills-'+key+' .fpill').forEach(p=>p.classList.remove('active'));
  btn.classList.add('active');
  updateBtn('fbtn-'+key,'fval-'+key,val);
  closeAllPanels();
  encRender();
}

function setCollFilter(key,val,btn){
  collFilters[key]=val;
  document.querySelectorAll('#cpills-'+key+' .fpill').forEach(p=>p.classList.remove('active'));
  if(btn)btn.classList.add('active');
  updateBtn('cfbtn-'+key,'cfval-'+key,val);
  closeAllPanels();
  renderCollection();
}

function initCollectionFilterDelegation(){
  const shell=document.getElementById('collection-filter-shell')||document.querySelector('#tab-collection [style*="position:relative"]');
  if(!shell||shell.dataset.filterDelegated==='1')return;
  shell.dataset.filterDelegated='1';
  shell.addEventListener('click',function(e){
    const pill=e.target.closest('.filter-panel .fpill');
    if(!pill)return;
    const panel=pill.closest('.filter-panel');
    if(!panel||!panel.id||!panel.id.startsWith('cpanel-'))return;
    e.preventDefault();
    e.stopPropagation();
    const key=panel.id.replace('cpanel-','');
    const raw=pill.getAttribute('data-value')||pill.textContent.trim();
    const val=(raw==='All')?'all':raw;
    setCollFilter(key,val,pill);
  });
}

function resetFilters(){
  filters={fam:'all',theme:'all',color:'all',chakra:'all',mohs:'all',formation:'all',material:'all'};
  const s=document.getElementById('enc-search');
  if(s)s.value='';
  ['fam','theme','color','chakra','mohs','formation','material'].forEach(k=>{
    document.querySelectorAll('#pills-'+k+' .fpill').forEach((p,i)=>p.classList.toggle('active',i===0));
    updateBtn('fbtn-'+k,'fval-'+k,'all');
  });
  encRender();
}

function resetCollFilters(){
  collFilters={cfam:'all',ctheme:'all',ccolor:'all',cchakra:'all',cmohs:'all',cformation:'all',cmaterial:'all',form:'all',size:'all',cshelf:'all'};
  ['cfam','ctheme','ccolor','cchakra','cmohs','cformation','cmaterial','form','size','cshelf'].forEach(k=>{
    document.querySelectorAll('#cpills-'+k+' .fpill').forEach((p,i)=>p.classList.toggle('active',i===0));
    updateBtn('cfbtn-'+k,'cfval-'+k,'all');
  });
  renderCollection();
}

// ── ENCYCLOPEDIA ──
function encSort(v){sortBy=v;encRender();}

function getFiltered(){
  const q=(document.getElementById('enc-search')?.value||'').toLowerCase().trim();
  return CRYSTALS.filter(c=>{
    const famOk=filters.fam==='all'||c.fam===filters.fam||c.sp===filters.fam;
    const themeOk=filters.theme==='all'||
      (c.all_themes&&c.all_themes.some(t=>t.toLowerCase().includes(filters.theme.toLowerCase())))||
      [c.er1,c.er2,c.er3].some(v=>v&&v.toLowerCase().includes(filters.theme.toLowerCase()));
    const colorOk=filters.color==='all'||(c.col_cats&&c.col_cats.includes(filters.color));
    const chakraOk=filters.chakra==='all'||(c.chakras&&(c.chakras.includes(filters.chakra)||c.chakras.includes('All')));
    const mohsVal=parseFloat(c.m)||0;
    const mohsOk=filters.mohs==='all'||
      (filters.mohs==='soft'&&mohsVal<=4)||
      (filters.mohs==='medium'&&mohsVal>=5&&mohsVal<=6.5)||
      (filters.mohs==='hard'&&mohsVal>=7);
    const formOk=filters.formation==='all'||(c.fo&&c.fo.toLowerCase().includes(filters.formation.toLowerCase()));
    const matOk=filters.material==='all'||(c.mt&&c.mt.toLowerCase().includes(filters.material.toLowerCase()));
    const searchOk=!q||[c.n,c.a,c.er1,c.er2,c.er3,c.uw,c.c,c.g,c.fam].some(v=>v&&v.toLowerCase().includes(q));
    return famOk&&themeOk&&colorOk&&chakraOk&&mohsOk&&formOk&&matOk&&searchOk;
  }).sort((a,b)=>{
    if(sortBy==='name')return a.n.localeCompare(b.n);
    if(sortBy==='mohs')return parseFloat(a.m||0)-parseFloat(b.m||0);
    if(sortBy==='family')return(a.fam+a.n).localeCompare(b.fam+b.n);
    return a.i.localeCompare(b.i);
  });
}


function colorDotsHtml(c){
  const hexMap={'Purple':'#7a5a9a','Blue':'#4a7aaa','Green':'#4a8a5a','Pink':'#d4839a','Red':'#b04a4a','Orange':'#c4683a','Yellow':'#c9a832','Black':'#3a3530','White':'#d8d4ce','Brown':'#8b6f47','Gray':'#8a8a8a','Multi':'#9a7a8a'};
  const cats=(c.col_cats&&c.col_cats.length>0)?c.col_cats:[];
  if(cats.length>1){
    const cols=cats.slice(0,4).map(x=>hexMap[x]||c.ch||'#aaa');
    const pct=100/cols.length;
    const stops=cols.map((col,i)=>`${col} ${i*pct}% ${(i+1)*pct}%`).join(', ');
    return`<span class="color-dot" style="background:conic-gradient(${stops});margin-right:2px" title="${cats.join(', ')}"></span>`;
  }
  const col=hexMap[cats[0]]||c.ch||'#aaa';
  return`<span class="color-dot" style="background:${col};margin-right:2px"></span>`;
}


function hexToWash(hex){
  try{
    const h=hex.replace('#','');
    const r=parseInt(h.slice(0,2),16),g=parseInt(h.slice(2,4),16),b=parseInt(h.slice(4,6),16);
    const mix=(v)=>Math.round(v+(245-v)*0.78);
    return`rgb(${mix(r)},${mix(g)},${mix(b)})`;
  }catch(e){return'#f0ece6';}
}
function noPhotoZoneHtml(c){
  const cats=(c.col_cats&&c.col_cats.length>0)?c.col_cats:[];
  const hexMap={'Purple':'#7a5a9a','Blue':'#4a7aaa','Green':'#4a8a5a','Pink':'#d4839a','Red':'#b04a4a','Orange':'#c4683a','Yellow':'#c9a832','Black':'#3a3530','White':'#d8d4ce','Brown':'#8b6f47','Gray':'#8a8a8a','Multi':'#9a7a8a'};
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

function jsArg(v){return JSON.stringify(String(v==null?'':v));}
function escapeAttr(v){
  return String(v||'').replace(/&/g,'&amp;').replace(/"/g,'&quot;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}
function collectionPhotoUrl(photo){
  if(!photo)return'';
  if(typeof photo==='string')return photo;
  return photo.preview||photo.url||photo.signedUrl||photo.src||'';
}
function firstCollectionPhoto(p){
  const photos=(p&&p.photos)||[];
  const first=photos.length?photos[0]:null;
  return collectionPhotoUrl(first);
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
function isReferencePhotoUrl(src,c){
  if(!src)return false;
  const ref=firstEncyclopediaPhoto(c);
  return (!!ref&&src===ref)||String(src).includes('/stone-images/encyclopedia/');
}
function uniquePhotoSources(sources){
  const seen=new Set();
  return (sources||[]).filter(src=>{
    if(!src||seen.has(src))return false;
    seen.add(src);
    return true;
  });
}
function collCardPhotoNav(btn,dir,event){
  if(event)event.stopPropagation();
  const wrap=btn.closest('.coll-card-photo-wrap');
  if(!wrap)return;
  let sources=[];
  try{sources=JSON.parse(wrap.dataset.sources||'[]');}catch(e){}
  if(!sources.length)return;
  let idx=parseInt(wrap.dataset.photoIndex||'0',10);
  idx=(idx+dir+sources.length)%sources.length;
  wrap.dataset.photoIndex=String(idx);
  const img=wrap.querySelector('img');
  if(img)img.src=sources[idx];
}
function getCardPhotoIndex(el){
  const wrap=el&&el.closest?el.closest('.coll-card-photo-wrap'):el;
  const idx=parseInt(wrap?.dataset?.photoIndex||'0',10);
  return Number.isFinite(idx)?idx:0;
}
function collectionCardPhotoHtml(p,c,name,idx){
  const ownPhotos=uniquePhotoSources(allCollectionPhotos(p));
  const refPhoto=firstEncyclopediaPhoto(c);
  const sources=ownPhotos.length?ownPhotos:(refPhoto?[refPhoto]:[]);
  if(sources.length){
    const isRef=!ownPhotos.length&&!!refPhoto;
    const badge=isRef?'<span class="reference-image-badge">Reference image</span>':'';
    const refAlt=isRef&&c&&c.n?`${c.n} reference image`:name;
    const nav=sources.length>1?`<button class="coll-card-photo-nav prev" onclick="collCardPhotoNav(this,-1,event)" aria-label="Previous photo">‹</button><button class="coll-card-photo-nav next" onclick="collCardPhotoNav(this,1,event)" aria-label="Next photo">›</button>`:'';
    return`<div class="coll-card-photo-wrap zoomable" data-photo-index="0" data-sources='${escapeAttr(JSON.stringify(sources))}' onclick="openCollectionPhotoLightbox(${idx},getCardPhotoIndex(this),event)" title="Enlarge ${isRef?'image':'photo'}"><img class="coll-card-photo" src="${escapeAttr(sources[0])}" alt="${escapeAttr(refAlt)}" loading="lazy">${nav}${badge}</div>`;
  }
  return`<div class="coll-card-nophoto"><span>No photo</span></div>`;
}
let collFamilyPhotoSources={};
let collFamilyPhotoLabels={};
function familyPhotoItems(entries){
  const seen=new Set();
  const items=[];
  (entries||[]).forEach(entry=>{
    const label=(entry.crystal&&entry.crystal.n)||collPieceName(entry.piece,entry.crystal)||'Collection photo';
    collectionPhotoSources(entry.piece,entry.crystal).forEach(src=>{
      if(!src||seen.has(src))return;
      seen.add(src);
      items.push({src,label});
    });
  });
  return items;
}
function familyPhotoSources(entries){
  return familyPhotoItems(entries).map(item=>item.src);
}
function familyCardPhotoHtml(fam,entries){
  const items=familyPhotoItems(entries);
  const sources=items.map(item=>item.src);
  collFamilyPhotoSources[fam]=sources;
  collFamilyPhotoLabels[fam]=items.map(item=>item.label);
  if(!sources.length)return`<div class="coll-card-nophoto"><span>No photo</span></div>`;
  const key=encodeURIComponent(fam);
  const nav=sources.length>1?`<button class="coll-card-photo-nav prev" onclick="collCardPhotoNav(this,-1,event)" aria-label="Previous photo">‹</button><button class="coll-card-photo-nav next" onclick="collCardPhotoNav(this,1,event)" aria-label="Next photo">›</button>`:'';
  return`<div class="coll-card-photo-wrap zoomable" data-photo-index="0" data-sources='${escapeAttr(JSON.stringify(sources))}' onclick="openFamilyPhotoLightbox('${key}',getCardPhotoIndex(this),event)" title="Enlarge family images"><img class="coll-card-photo" src="${escapeAttr(sources[0])}" alt="${escapeAttr(fam)} collection images" loading="lazy">${nav}</div>`;
}
function openFamilyPhotoLightbox(encodedFam,startIndex,event){
  if(event)event.stopPropagation();
  const fam=decodeURIComponent(encodedFam||'');
  const sources=collFamilyPhotoSources[fam]||[];
  if(!sources.length)return;
  const lb=document.getElementById('photo-lightbox');
  if(!lb)return;
  photoLightboxSources=sources;
  photoLightboxIndex=Math.max(0,Math.min(startIndex||0,sources.length-1));
  photoLightboxLabels=collFamilyPhotoLabels[fam]||null;
  photoLightboxAlt=(photoLightboxLabels&&photoLightboxLabels[photoLightboxIndex])||fam;
  setPhotoLightboxImage();
  lb.classList.toggle('has-nav',photoLightboxSources.length>1);
  lb.classList.add('open');
  document.body.style.overflow='hidden';
}
function wishlistCardPhotoHtml(c){
  const refPhoto=firstEncyclopediaPhoto(c);
  if(refPhoto){
    const refAlt=c&&c.n?`${c.n} reference image`:'Wishlist reference image';
    return`<div class="coll-card-photo-wrap"><img class="coll-card-photo" src="${escapeAttr(refPhoto)}" alt="${escapeAttr(refAlt)}" loading="lazy"></div>`;
  }
  return`<div class="coll-card-nophoto" style="background:var(--stone2)"><span style="font-size:18px">♡</span></div>`;
}

function collectionPieceSignature(p){
  if(!p)return'';
  const photoCount=(p.photos&&p.photos.length)||0;
  const combos=(p.comboCrystals||[]).slice().sort().join('|');
  return [
    p.crystalId||'',
    p.isCombo?'combo':'single',
    combos,
    p.nickname||'',
    p.form||'',
    p.size||'',
    p.treated||'',
    p.condition||'',
    p.locCustom||'',
    p.shelf||'',
    p.tier||'',
    p.pos||'',
    p.acquired||'',
    p.source||'',
    p.price||'',
    p.notes||'',
    photoCount
  ].map(v=>String(v).trim().toLowerCase()).join('::');
}
function dedupedCollectionItems(list){
  const seen=new Set();
  const out=[];
  (list||[]).forEach(p=>{
    const sig=collectionPieceSignature(p);
    if(!sig||seen.has(sig))return;
    seen.add(sig);
    out.push(p);
  });
  return out;
}

function encCardHtml(c){
  const isOwned=!!owned[c.i], isWish=!!wish[c.i];
  const badge=isOwned?'<span class="card-badge badge-owned"></span>':(isWish?'<span class="card-badge badge-wish"></span>':'');
  const roles=[c.er1,c.er2].filter(Boolean).map(t=>`<span class="card-role">${t}</span>`).join('<span class="card-role-sep">·</span>');
  const encPhotos=ENCYCLOPEDIA_PHOTOS[c.i];
  const imgSrc=encPhotos?SUPABASE_ENC+encPhotos[0]:null;
  const imgZone=imgSrc
    ?`<div class="card-img-zone has-photo" onclick="openEncLightbox('${imgSrc}','${c.n.replace(/'/g,"\\'")}',event)" title="View larger" style="cursor:zoom-in"><img src="${imgSrc}" alt="${c.n}" loading="lazy"></div>`
    :`<div onclick="openDetail('${c.i}')">${noPhotoZoneHtml(c)}</div>`;
  return`<div class="crystal-card">${badge}${imgZone}<div class="card-body" onclick="openDetail('${c.i}')" style="cursor:pointer"><div class="card-name">${c.n}</div><div class="card-color">${colorDotsHtml(c)}<span style="font-size:10.5px;color:var(--ink3);margin-left:3px">${c.c||''}</span></div>${roles?`<div>${roles}</div>`:''}</div></div>`;
}

function encRender(){
  const list = getFiltered();

  const filtersActive = Object.values(filters).some(v => v !== 'all') ||
    (document.getElementById('enc-search')?.value || '').trim().length > 0;

  // Active filter count
  const activeCount = Object.values(filters).filter(v => v !== 'all').length +
    ((document.getElementById('enc-search')?.value || '').trim().length > 0 ? 1 : 0);

  // Results count + filter indicator
  const cnt = document.getElementById('enc-count');
  if(cnt){
    cnt.textContent = list.length + ' of ' + CRYSTALS.length + ' entries';
    if(activeCount > 0) cnt.textContent += ' · ' + activeCount + ' filter' + (activeCount > 1 ? 's' : '') + ' active';
  }

  // Show Reset only when filters are on
  document.querySelectorAll('.reset-link').forEach(el => el.classList.toggle('filters-on', filtersActive));

  const grid = document.getElementById('crystal-grid');
  if(!grid) return;
  if(!list.length){
    grid.innerHTML = '<div class="empty-state">No crystals match.<br><span style="font-size:12px;margin-top:6px;display:block"><button onclick="resetFilters()" style="background:none;border:none;color:var(--accent);cursor:pointer;font-family:\'Jost\',sans-serif;font-size:12px;text-decoration:underline;text-underline-offset:2px;padding:0">Clear filters</button> to see all stones.</span></div>';
    document.getElementById('load-more-wrap').style.display = 'none';
    return;
  }

  const PAGE_SIZE = 30;
  window._encList = list;
  window._encPage = 1;

  if(filtersActive){
    grid.innerHTML = list.map(c => encCardHtml(c)).join('');
    document.getElementById('load-more-wrap').style.display = 'none';
  } else {
    grid.innerHTML = list.slice(0, PAGE_SIZE).map(c => encCardHtml(c)).join('');
    updateLoadMore(list, PAGE_SIZE);
  }
}

function loadMoreStones(){
  const list = window._encList || [];
  const PAGE_SIZE = 30;
  window._encPage = (window._encPage || 1) + 1;
  const showing = window._encPage * PAGE_SIZE;
  const grid = document.getElementById('crystal-grid');
  const newCards = list.slice(showing - PAGE_SIZE, showing).map(c => encCardHtml(c)).join('');
  grid.insertAdjacentHTML('beforeend', newCards);
  updateLoadMore(list, showing);
}

function updateLoadMore(list, showing){
  const wrap = document.getElementById('load-more-wrap');
  const btn = document.getElementById('load-more-btn');
  const countEl = document.getElementById('load-more-count');
  const actual = Math.min(showing, list.length);
  const remaining = list.length - actual;
  if(remaining > 0){
    wrap.style.display = 'block';
    btn.disabled = false;
    btn.textContent = 'Load more stones';
    countEl.textContent = actual + ' of ' + list.length + ' shown — ' + remaining + ' more';
  } else {
    wrap.style.display = actual < list.length ? 'none' : 'none';
    if(actual >= list.length) wrap.style.display = 'none';
  }
}

// ── DETAIL DRAWER ──
// ── DRAWER PHOTO CAROUSEL ──
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
      drawerPhotoWrap.innerHTML = '';
    }
  }
  document.getElementById('d-id').textContent=c.i;
  document.getElementById('d-name').textContent=c.n;
  document.getElementById('d-alt').textContent=c.a?'Also known as: '+c.a:'';
  document.getElementById('d-fam').textContent=c.fam+(c.sp&&c.sp!==c.fam?' · '+c.sp:'');
  
  document.getElementById('d-uw').textContent=c.uw||'—';
  document.getElementById('d-geo').textContent=c.g||'—';
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
  document.getElementById('drawer-overlay').classList.add('open');
  document.getElementById('detail-drawer').classList.add('open');
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
  } else if(detailReturnContext&&detailReturnContext.type==='usewhen'){
    detailReturnContext=null;
    switchTabByName('mood');
  }
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
  jumpToFamily(fam);
}

function updateDrawerStatus(id){
  const isOwned=!!owned[id];
  const isWish=!!wish[id];
  const pillOwned=document.getElementById('drawer-pill-owned');
  const pillWish=document.getElementById('drawer-pill-wish');
  if(pillOwned){
    pillOwned.textContent=isOwned?'♥ In your collection':'+ Add to collection';
    pillOwned.classList.toggle('drawer-pill-active',isOwned);
  }
  if(pillWish){
    pillWish.textContent=isWish?'♥ On your wishlist':'♡ Add to wishlist';
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
  if(owned[currentCrystal.i]){
    // Already owned — remove via synced toggle
    toggleOwned();
  } else {
    // Not owned — open add piece form
    addFromDetail();
  }
}
function drawerWishlistAction(){
  if(!currentCrystal)return;
  const wasWished=!!wish[currentCrystal.i];
  // Use synced toggleWish (saves to Supabase for logged-in users)
  toggleWish();
  if(!wasWished){
    // Brief confirmation on add
    const pill=document.getElementById('drawer-pill-wish');
    if(pill){pill.textContent='✓ Added!';setTimeout(()=>{updateDrawerStatus(currentCrystal?.i);},1200);}
  }
}
function toggleOwned(){
  if(!currentCrystal)return;
  owned[currentCrystal.i]=!owned[currentCrystal.i];
  if(!owned[currentCrystal.i])delete owned[currentCrystal.i];
  localStorage.setItem('lap_owned',JSON.stringify(owned));
  updateDrawerStatus(currentCrystal.i);
  encRender();
}
function toggleWish(){
  if(!currentCrystal)return;
  wish[currentCrystal.i]=!wish[currentCrystal.i];
  if(!wish[currentCrystal.i])delete wish[currentCrystal.i];
  localStorage.setItem('lap_wish',JSON.stringify(wish));
  updateDrawerStatus(currentCrystal.i);
  encRender();
}
function addFromDetail(){
  const c=currentCrystal;
  addPieceReturnContext={type:'encyclopedia',stoneId:c?.i||null};
  closeDrawer();
  openAddForm(c?.i);
}

// ── MOOD TAB ──

function intentionCardClick(group, el) {
  // Clear active state on all cards
  document.querySelectorAll('#intention-grid .intention-card').forEach(c => c.classList.remove('active'));
  el.classList.add('active');

  if (group === 'all') {
    clearMoodResults();
    renderMoodGrid('All');
    const grid = document.getElementById('mood-grid');
    if (grid) {
      const y = grid.getBoundingClientRect().top + window.scrollY - 120;
      window.scrollTo({ top: Math.max(0, y), behavior: 'smooth' });
    }
    return;
  }

  // Filter mood grid by group and scroll to results
  clearMoodResults();
  renderMoodGrid(group);
  const grid = document.getElementById('mood-grid');
  if (grid) {
    const y = grid.getBoundingClientRect().top + window.scrollY - 120;
    window.scrollTo({ top: Math.max(0, y), behavior: 'smooth' });
  }

  // TODO: Once primary_theme data is cleaned up in Supabase, replace renderMoodGrid(group)
  // with a direct stone filter using primary_theme:
  //   const THEME_MAP = {
  //     'Grounding & Stability': 'Grounding',
  //     'Heart & Emotional': 'Heart Healing',  // exact values pending data audit
  //     'Mind & Will': 'Clarity & Focus',
  //     'Spirit & Intuition': 'Intuition',
  //     'Body & Vitality': 'Vitality',
  //   };
  //   const matches = CRYSTALS.filter(c => (c.all_themes||[]).includes(THEME_MAP[group]));
  //   renderIntentionResults(matches, group);
}

function buildMoodGroupPills(){
  const wrap=document.getElementById('mood-group-pills');
  if(!wrap)return;
  wrap.innerHTML=MOOD_GROUPS.map((g,i)=>`<button class="fpill${i===0?' active':''}" onclick="moodGroupFilter('${g}',this)">${g}</button>`).join('');
}

function moodGroupFilter(group,btn){
  document.querySelectorAll('#mood-group-pills .fpill').forEach(p=>p.classList.remove('active'));
  btn.classList.add('active');
  clearMoodResults();
  renderMoodGrid(group);
}

function renderMoodGrid(group){
  const grid=document.getElementById('mood-grid');
  if(!grid)return;
  const items=group==='All'?MOOD_DATA:MOOD_DATA.filter(m=>m.group===group);
  grid.innerHTML=items.map(m=>{
    const idx=MOOD_DATA.indexOf(m);
    return`<div class="mood-card" onclick="showMoodResults(${idx},this)"><div class="mood-group-label">${m.group}</div><div class="mood-label">${m.label}</div><div class="mood-sub-text">${m.sub}</div></div>`;
  }).join('');
}

function getMoodMatches(moodIdx,subFilter){
  const themes=MOOD_THEME_MAP[String(moodIdx)]||[];
  let matches=CRYSTALS.filter(c=>c.all_themes&&themes.some(t=>c.all_themes.includes(t)));
  if(subFilter&&subFilter!=='all'){
    const subKwMap=SUB_FILTER_KW[String(moodIdx)];
    if(subKwMap&&subKwMap[subFilter]){
      const kws=subKwMap[subFilter];
      const filtered=matches.filter(c=>kws.some(k=>((c.uw||'')+(c.er1||'')+(c.er2||'')+(c.er3||'')).toLowerCase().includes(k)));
      if(filtered.length>0)matches=filtered;
    }
  }
  return matches.slice(0,30);
}

function showMoodResults(idx,el){
  activeMoodIdx=idx;activeSubFilter=null;
  const m=MOOD_DATA[idx];
  // Hide grid, show only selected card + results
  document.getElementById('mood-grid').style.display='none';
  const sv=document.getElementById('mood-selected-view');
  if(sv){
    sv.style.display='block';
    document.getElementById('mood-selected-group').textContent=m.group;
    document.getElementById('mood-selected-label').textContent=m.label;
    document.getElementById('mood-selected-sub').textContent=m.sub;
  }
  buildSubFilters(idx);
  renderMoodStones(idx,null);
  setTimeout(scrollToMoodNarrowBar,80);
}

function scrollToMoodNarrowBar(){
  const row=document.getElementById('sub-filter-row');
  const selected=document.getElementById('mood-selected-card');
  const target=(row&&row.style.display!=='none')?row:selected;
  if(!target)return;
  const y=target.getBoundingClientRect().top+window.scrollY-135;
  try{window.scrollTo({top:Math.max(0,y),left:0,behavior:'smooth'});}catch(e){window.scrollTo(0,Math.max(0,y));}
}

function buildSubFilters(idx){
  const subs=SUB_FILTERS[String(idx)];
  const row=document.getElementById('sub-filter-row');
  if(!row)return;
  if(!subs||!subs.length){row.style.display='none';return;}
  row.style.display='flex';
  const pillsEl=document.getElementById('sub-filter-pills');
  if(pillsEl)pillsEl.innerHTML=`<button class="sfpill active" onclick="setSubFilter(null,this)">All</button>`+
    subs.map(s=>`<button class="sfpill" onclick="setSubFilter('${s}',this)">${s}</button>`).join('');
}

function setSubFilter(val,btn){
  activeSubFilter=val;
  document.querySelectorAll('#sub-filter-pills .sfpill').forEach(p=>p.classList.remove('active'));
  btn.classList.add('active');
  renderMoodStones(activeMoodIdx,val);
}

function renderMoodStones(moodIdx,subFilter){
  const matches=getMoodMatches(moodIdx,subFilter);
  const grid=document.getElementById('mood-stone-grid');
  const countEl=document.getElementById('mood-results-count');
  const selectedView=document.getElementById('mood-selected-view');
  if(selectedView)selectedView.style.display='block';
  if(grid)grid.style.display='grid';
  const m=MOOD_DATA[moodIdx];
  if(countEl)countEl.textContent=matches.length+' stones'+(subFilter?' · '+subFilter:'');
  if(!grid)return;
  if(!matches.length){grid.innerHTML='<div class="empty-state">No stones match this combination.</div>';return;}
  const moodGrid=typeof CRYSTAL_GRIDS!=='undefined'&&CRYSTAL_GRIDS.find(g=>(g.moodLinks||[g.moodLink]).includes(moodIdx));
  const gridBanner=document.getElementById('mood-grid-banner');
  if(gridBanner){
    if(moodGrid){
      gridBanner.style.display='block';
      gridBanner.innerHTML=`<div style="margin-top:1rem;padding:0.75rem 1rem;background:var(--stone2);border-radius:8px;display:flex;align-items:center;justify-content:space-between;gap:1rem"><span style="font-size:13px;color:var(--ink2)">There is a grid for this intention.</span><button class="btn btn-sm" onclick="switchTab('101',document.querySelectorAll('.nav-tab')[4]);setTimeout(()=>{show101('grids');openGridModal('${moodGrid.id}');},400)">View ${moodGrid.name} →</button></div>`;
    } else {
      gridBanner.style.display='none';
    }
  }
grid.innerHTML=matches.map(c=>{
    const isOwned=!!owned[c.i],isWish=!!wish[c.i];
    const badge=isOwned?'<span class="card-badge badge-owned"></span>':(isWish?'<span class="card-badge badge-wish"></span>':'');
    const encPhotos=ENCYCLOPEDIA_PHOTOS[c.i];
    const imgZone=encPhotos?`<div class="card-img-zone has-photo"><img src="${SUPABASE_ENC}${encPhotos[0]}" alt="${c.n}" loading="lazy"></div>`:noPhotoZoneHtml(c);
    const roles=[c.er1,c.er2].filter(Boolean).map(t=>`<span class="card-role">${t}</span>`).join('<span class="card-role-sep">·</span>');
    return`<div class="crystal-card" onclick="detailReturnContext={type:'usewhen'};openDetail(${jsArg(c.i)})">${badge}${imgZone}<div class="card-body"><div class="card-name">${c.n}</div><div class="card-color">${colorDotsHtml(c)}<span style="font-size:10.5px;color:var(--ink3);margin-left:3px">${c.c||''}</span></div>${roles?`<div>${roles}</div>`:''}</div></div>`;
  }).join('');
}

// ── AI FREEFORM SEARCH ────────────────────────────────────────────────────
async function runAISearch(){
  const input=document.getElementById('ai-search-input');
  const btn=document.getElementById('ai-search-btn');
  const errEl=document.getElementById('ai-search-error');
  const query=input.value.trim();
  if(!query)return;

  // Build compact stone list
  const stones=CRYSTALS.map(s=>({id:s.i,name:s.n,er:[s.er1,s.er2,s.er3].filter(Boolean).join(' / '),uw:s.uw||''}));

  btn.classList.add('loading');
  btn.disabled=true;
  errEl.style.display='none';

  try{
    const res=await fetch(
      'https://vxujlgyhgnihnqrxzefw.supabase.co/functions/v1/claude-mood-match',
      {
        method:'POST',
        headers:{
          'Content-Type':'application/json',
          'Authorization':'Bearer sb_publishable_LfVL1UL-_8_8hXQktiF1BQ_UgbWvAPb'
        },
        body:JSON.stringify({query,stones})
      }
    );
    const data=await res.json();
    if(data.error) throw new Error(data.error);
    renderAIResults(data.matches, query);
  }catch(e){
    errEl.textContent='Something went wrong. Please try again.';
    errEl.style.display='block';
  }finally{
    btn.classList.remove('loading');
    btn.disabled=false;
  }
}

function renderAIResults(matches, query){
  const wrap=document.getElementById('ai-results-wrap');
  const grid=document.getElementById('ai-stone-grid');
  grid.innerHTML='';

  matches.forEach(m=>{
    const stone=CRYSTALS.find(s=>s.i===m.id);
    if(!stone)return;
    const card=document.createElement('div');
    card.className='ai-stone-card';
    card.innerHTML=`<div class="ai-stone-name">${m.name}</div><div class="ai-stone-reason">${m.reason}</div><div class="ai-stone-arrow">View stone →</div>`;
    card.onclick=()=>openDrawer(stone);
    grid.appendChild(card);
  });

  wrap.style.display='block';
  const top = wrap.getBoundingClientRect().top + window.scrollY - 120;
  window.scrollTo({top, behavior:'smooth'});
}

function clearAIResults(){
  document.getElementById('ai-results-wrap').style.display='none';
  document.getElementById('ai-search-input').value='';
  document.getElementById('ai-search-error').style.display='none';
}
// ─────────────────────────────────────────────────────────────────────────────

function clearMoodResults(){
  const grid=document.getElementById('mood-grid');
  if(grid)grid.style.display='';
  const sv=document.getElementById('mood-selected-view');
  if(sv)sv.style.display='none';
  document.querySelectorAll('.mood-card').forEach(c=>c.classList.remove('active-mood'));
  activeMoodIdx=null;activeSubFilter=null;
}

// ── COLLECTION ──
function setCollQuickFilter(mode){
  collQuickFilter=mode;
  // Update active stat cell
  document.querySelectorAll('.stat-clickable').forEach(el=>el.classList.remove('active-stat'));
  const cellMap={'all':'stat-cell-total','owned':'stat-cell-var','families':'stat-cell-var','wish':'stat-cell-wish'};
  const cell=document.getElementById(cellMap[mode]);
  if(cell)cell.classList.add('active-stat');
  renderCollection();
}

function openFamilyDetail(fam){
  collQuickFilter='__family__';
  collActiveFamilyName=fam;
  document.querySelectorAll('.stat-clickable').forEach(el=>el.classList.remove('active-stat'));
  const total=document.getElementById('stat-cell-total');
  if(total)total.classList.add('active-stat');
  renderCollection();
  const wrap=document.getElementById('coll-wrap');
  if(wrap){const y=wrap.getBoundingClientRect().top+window.scrollY-120;window.scrollTo({top:Math.max(0,y),behavior:'smooth'});}
}
function setCollFamilyFilter(fam){
  collQuickFilter='all';
  collFilters.cfam=fam;
  document.querySelectorAll('.stat-clickable').forEach(el=>el.classList.remove('active-stat'));
  const total=document.getElementById('stat-cell-total');
  if(total)total.classList.add('active-stat');
  renderCollection();
  // Show a "back to families" banner above the results
  const wrap=document.getElementById('coll-wrap');
  if(wrap){
    const banner=document.createElement('div');
    banner.id='fam-back-banner';
    banner.style.cssText='display:flex;align-items:center;gap:10px;margin-bottom:1rem;padding:8px 12px;background:var(--stone2);border-radius:8px;font-family:Jost,sans-serif;font-size:12px;letter-spacing:0.06em;text-transform:uppercase;color:var(--ink2)';
    banner.innerHTML='<button onclick="setCollQuickFilter(\'families\')" style="background:none;border:none;cursor:pointer;font-family:Jost,sans-serif;font-size:12px;letter-spacing:0.06em;text-transform:uppercase;color:var(--accent);padding:0">← All Families</button><span style="color:var(--ink3)">·</span><span>'+fam+'</span>';
    wrap.insertBefore(banner,wrap.firstChild);
  }
  scrollPageTop();
}

function renderCollection(){
  buildCollPanels();
  initCollectionFilterDelegation();

  // Stats use the visible collection list, with exact duplicate rows collapsed.
  // This protects against accidental double/triple saves without hiding genuinely different pieces.
  const displayCollection=dedupedCollectionItems(collection);
  const st=document.getElementById('stat-total');
  const sv=document.getElementById('stat-var');
  const sw=document.getElementById('stat-wish');
  if(st)st.textContent=displayCollection.length;
  if(sv)sv.textContent=new Set(displayCollection.map(p=>{const c=CRYSTALS.find(x=>x.i===p.crystalId);return c?.fam||c?.sp||'Other';}).filter(Boolean)).size;
  if(sw)sw.textContent=Object.keys(wish).length;

  const wrap=document.getElementById('coll-wrap');
  if(!wrap)return;

  // WISHLIST view
  if(collQuickFilter==='wish'){
    const wishIds=Object.keys(wish);
    const wishCrystals=CRYSTALS.filter(c=>wishIds.includes(c.i));
    if(!wishCrystals.length){
      wrap.innerHTML=_emptyWishHtml();
      return;
    }
    wrap.innerHTML='<div class="coll-grid">'+wishCrystals.map(c=>{
      return`<div class="coll-card" onclick="viewEncyclopediaFromWishlist('${c.i}')">
        ${wishlistCardPhotoHtml(c)}
        <div class="coll-card-name">${c.n}</div>
        <div class="coll-card-meta">${[c.er1,c.er2,c.er3].filter(Boolean).join(' · ')}</div>
      </div>`;
    }).join('')+'</div>';
    return;
  }


  // FAMILY GROUP view
  if(collQuickFilter==='families'){
    const groups={};
    displayCollection.forEach(p=>{
      const c=CRYSTALS.find(x=>x.i===p.crystalId);
      const fam=c?.fam||c?.sp||'Other';
      if(!groups[fam])groups[fam]=[];
      groups[fam].push({piece:p,crystal:c});
    });
    const fams=Object.keys(groups).sort((a,b)=>a.localeCompare(b));
    if(!fams.length){
      wrap.innerHTML=_emptyCollHtml();
      return;
    }
    collFamilyPhotoSources={};
    wrap.innerHTML='<div class="coll-grid">'+fams.map(fam=>{
      const entries=groups[fam];
      const names=[...new Set(entries.map(x=>x.crystal?.n||'Unknown'))].slice(0,4).join(' · ');
      const count=entries.length;
      const photoHtml=familyCardPhotoHtml(fam,entries);
      return`<div class="coll-card" onclick="openFamilyDetail('${fam.replace(/'/g,"\\'")}')" >
        ${photoHtml}
        <div class="coll-card-name">${escapeAttr(fam)}</div>
        <div class="coll-card-piece-count">${count} ${count===1?'piece':'pieces'}</div>
        <div class="coll-card-meta">${escapeAttr(names)}</div>
        <div class="coll-card-loc">Tap to view family</div>
      </div>`;
    }).join('')+'</div>';
    return;
  }

  // FAMILY DETAIL view
  if(collQuickFilter==='__family__'){
    const fam=collActiveFamilyName;
    const items=displayCollection.filter(p=>{
      const c=CRYSTALS.find(x=>x.i===p.crystalId);
      return (c?.fam===fam||c?.sp===fam)&&passesCollPieceFilters(p);
    });
    if(!items.length){
      wrap.innerHTML=`<div class="empty-coll">No pieces found in ${fam}.</div>`;
      return;
    }
    wrap.innerHTML=
      `<div id="fam-detail-banner" style="display:flex;align-items:center;gap:10px;margin-bottom:1rem;padding:8px 12px;background:var(--stone2);border-radius:8px;font-family:Jost,sans-serif;font-size:12px;letter-spacing:0.06em;text-transform:uppercase;color:var(--ink2)">
        <button onclick="setCollQuickFilter('families')" style="background:none;border:none;cursor:pointer;font-family:Jost,sans-serif;font-size:12px;letter-spacing:0.06em;text-transform:uppercase;color:var(--accent);padding:0">← All Families</button>
        <span style="color:var(--ink3)">·</span>
        <span>${escapeAttr(fam)}</span>
        <span style="color:var(--ink3);margin-left:4px">${items.length} ${items.length===1?'piece':'pieces'}</span>
      </div>
      <div class="coll-grid">`+
      items.map(p=>{
        const c=CRYSTALS.find(x=>x.i===p.crystalId);
        const name=p.nickname||(p.isCombo?'Combo piece':(c?.n||'Unknown'));
        const locParts=[p.locCustom,p.shelf,p.tier,p.pos].filter(Boolean);
        const loc=locParts.slice(0,2).join(' · ');
        const ri=collection.indexOf(p);
        const photoHtml=collectionCardPhotoHtml(p,c,name,ri);
        return`<div class="coll-card" onclick="openCollDetailFromFamily(${ri},'${fam.replace(/'/g,"\\'")}')">${photoHtml}<div class="coll-card-name">${escapeAttr(name)}</div><div class="coll-card-meta">${escapeAttr(c?.n||'')} ${p.size?'· '+escapeAttr(p.size):''}</div><div class="coll-card-loc">${escapeAttr(loc)}</div></div>`;
      }).join('')+
      `</div>`;
    return;
  }

  // COLLECTION view (filtered)
  const items=displayCollection.filter(p=>{
    const c=CRYSTALS.find(x=>x.i===p.crystalId);
    const loc=p.shelf||p.locCustom||'';
    return(collFilters.cfam==='all'||(c&&(c.fam===collFilters.cfam||c.sp===collFilters.cfam)))&&
           collectionStoneMatchesTheme(c,collFilters.ctheme)&&
           collectionStoneMatchesColor(c,collFilters.ccolor)&&
           collectionStoneMatchesChakra(c,collFilters.cchakra)&&
           collectionStoneMatchesMohs(c,collFilters.cmohs)&&
           collectionStoneMatchesFormation(c,collFilters.cformation)&&
           collectionStoneMatchesMaterial(c,collFilters.cmaterial)&&
           (collFilters.form==='all'||p.form===collFilters.form)&&
           (collFilters.size==='all'||p.size===collFilters.size)&&
           (collFilters.cshelf==='all'||loc.includes(collFilters.cshelf));
  });

  if(!items.length){
    wrap.innerHTML=displayCollection.length?'<div class="empty-coll">No pieces match your filters.</div>':_emptyCollHtml();
    return;
  }
  wrap.innerHTML='<div class="coll-grid">'+items.map(p=>{
    const c=CRYSTALS.find(x=>x.i===p.crystalId);
    const name=p.nickname||(p.isCombo?'Combo piece':(c?.n||'Unknown'));
    const locParts=[p.locCustom,p.shelf,p.tier,p.pos].filter(Boolean);
    const loc=locParts.slice(0,2).join(' · ');
    const ri=collection.indexOf(p);
    const photoHtml=collectionCardPhotoHtml(p,c,name,ri);
    return`<div class="coll-card" onclick="openCollDetail(${ri})">${photoHtml}<div class="coll-card-name">${name}</div><div class="coll-card-meta">${c?.n||''} ${p.size?'· '+p.size:''}</div><div class="coll-card-loc">${loc}</div></div>`;
  }).join('')+'</div>';
}


function collPieceName(p,c){
  return p?.nickname || (p?.isCombo ? 'Combo piece' : (c?.n || 'Unknown piece'));
}
function collPieceLocation(p){
  return [p?.locCustom,p?.shelf,p?.tier,p?.pos].filter(Boolean).join(' · ');
}
function collDetailPhotoHtml(p,c,name){
  const idx=(currentCollDetailIdx!==null&&currentCollDetailIdx!==undefined)?currentCollDetailIdx:collection.indexOf(p);
  const ownPhoto=firstCollectionPhoto(p);
  if(ownPhoto){
    const refBadge=isReferencePhotoUrl(ownPhoto,c)?'<span class="reference-image-badge">Reference image</span>':'';
    return`<div class="coll-detail-photo-wrap zoomable" onclick="openCollectionPhotoLightbox(${idx},0,event)" title="Enlarge photo"><img src="${escapeAttr(ownPhoto)}" alt="${escapeAttr(name)}">${refBadge}</div>`;
  }
  const refPhoto=firstEncyclopediaPhoto(c);
  if(refPhoto){
    const refAlt=c&&c.n?`${c.n} reference image`:name;
    return`<div class="coll-detail-photo-wrap zoomable" onclick="openCollectionPhotoLightbox(${idx},0,event)" title="Enlarge image"><img src="${escapeAttr(refPhoto)}" alt="${escapeAttr(refAlt)}"><span class="reference-image-badge">Reference image</span></div>`;
  }
  return`<div class="coll-detail-nophoto">No photo</div>`;
}
function formatDisplayDate(value){
  if(!value)return'';
  const m=String(value).match(/^(\d{4})-(\d{2})-(\d{2})/);
  if(!m)return value;
  return `${m[2]}/${m[3]}/${m[1]}`;
}
function formatDisplayPrice(value){
  if(value===undefined||value===null||String(value).trim()==='')return'';
  const raw=String(value).trim();
  const n=Number(raw.replace(/[^0-9.-]/g,''));
  if(!Number.isFinite(n))return raw.startsWith('$')?raw:`$${raw}`;
  return n%1===0?`$${n.toFixed(0)}`:`$${n.toFixed(2)}`;
}
function collRow(label,value){
  if(value===undefined||value===null||String(value).trim()==='')return'';
  return`<tr><td>${escapeAttr(label)}</td><td>${escapeAttr(value)}</td></tr>`;
}
function openCollDetail(idx){
  const p=collection[idx];if(!p)return;
  currentCollDetailIdx=idx;
  const c=CRYSTALS.find(x=>x.i===p.crystalId);
  const name=collPieceName(p,c);
  const loc=collPieceLocation(p);
  const comboNames=(p.comboCrystalNames&&p.comboCrystalNames.length?p.comboCrystalNames:(p.comboCrystals||[]).map(id=>CRYSTALS.find(x=>x.i===id)?.n||'').filter(Boolean));
  const detail=document.getElementById('coll-detail-content');if(!detail)return;
  const refLine=c?.uw||[c?.er1,c?.er2,c?.er3].filter(Boolean).join(' · ')||'';
  detail.innerHTML=`
    <div class="popup-title" style="margin-bottom:1rem">Collection piece</div>
    <div class="coll-detail-grid">
      ${collDetailPhotoHtml(p,c,name)}
      <div>
        <div class="coll-detail-name">${escapeAttr(name)}</div>
        <div class="coll-detail-sub">${escapeAttr(c?.n||'')} ${p.size?'· '+escapeAttr(p.size):''}</div>
        <table class="coll-detail-table">
          ${collRow('Form',p.form)}
          ${collRow('Size',p.size)}
          ${collRow('Location',loc)}
          ${collRow('Treatment',p.treated)}
          ${collRow('Condition',p.condition)}
          ${collRow('Acquired',formatDisplayDate(p.acquired))}
          ${collRow('Source',p.source)}
          ${collRow('Price',formatDisplayPrice(p.price))}
          ${comboNames.length?collRow('Combo',comboNames.join(' · ')):''}
          ${collRow('Notes',p.notes)}
        </table>
      </div>
    </div>
    ${c?`<div class="coll-ref-box"><div class="coll-ref-title">Stone reference</div>${escapeAttr(refLine||'Open the encyclopedia entry for full scientific, care, and metaphysical notes.')}</div>`:''}
    <div class="form-footer" style="justify-content:space-between;gap:8px;flex-wrap:wrap">
      <button class="btn" onclick="editCollPiece(${idx})">Edit piece</button>
      <button class="btn" onclick="deleteCollPiece(${idx})">Delete piece</button>
      ${c?`<button class="btn btn-accent" onclick="viewEncyclopediaFromColl('${c.i}')">View encyclopedia</button>`:''}
    </div>`;
  document.getElementById('coll-detail-overlay').classList.add('open');
}
function openCollDetailFromFamily(idx,fam){
  collDetailReturnFamily=fam;
  openCollDetail(idx);
}
function closeCollDetail(){
  const el=document.getElementById('coll-detail-overlay');if(el)el.classList.remove('open');
  if(collDetailReturnFamily){
    const fam=collDetailReturnFamily;
    collDetailReturnFamily=null;
    openFamilyDetail(fam);
  }
}
function viewEncyclopediaFromColl(stoneId){
  const p=(currentCollDetailIdx!==null)?collection[currentCollDetailIdx]:null;
  detailReturnContext={type:'collection',pieceId:p&&p.id?p.id:null,idx:currentCollDetailIdx};
  collDetailReturnFamily=null;
  closeCollDetail();
  switchTabByName('encyclopedia');
  setTimeout(()=>openDetail(stoneId),0);
}
function viewEncyclopediaFromWishlist(stoneId){
  detailReturnContext={type:'wishlist'};
  switchTabByName('encyclopedia');
  setTimeout(()=>openDetail(stoneId),0);
}
function editCollPiece(idx){
  const p=collection[idx];if(!p)return;
  collDetailReturnFamily=null;
  closeCollDetail();
  editingCollectionIndex=idx;
  openAddForm(p.crystalId||'');

  const title=document.querySelector('#add-form-overlay .form-title');if(title)title.textContent='Edit piece';
  const sub=document.querySelector('#add-form-overlay .form-sub');if(sub)sub.textContent='Update this specific physical piece in your collection.';
  const saveBtn=document.querySelector('#add-form-overlay .form-footer .btn-accent');if(saveBtn)saveBtn.textContent='Save changes';
  setFormVal('f-nick',p.nickname||'');
  setFormVal('f-form',p.form||'');
  setFormVal('f-size',p.size||'');
  setFormVal('f-treated',p.treated||'');
  setFormVal('f-condition',p.condition||'');
  setFormVal('f-source',p.source||'');
  setFormVal('f-price',p.price||'');
  setFormVal('f-acquired',p.acquired||'');
  setFormVal('f-loc-custom',p.locCustom||'');
  setFormVal('f-notes',p.notes||'');
  existingEditPhotos=(p.photos||[]).slice(0,3);
  editPrimaryPhotoKey=existingEditPhotos.length?photoKey(existingEditPhotos[0],'existing',0):null;
  pendingPhotos=[];
  renderPhotoPreviewRow();
  const combo=document.getElementById('f-combo');
  if(combo){combo.checked=!!p.isCombo;toggleCombo();}
  const rows=document.getElementById('combo-rows');
  if(rows&&p.isCombo){
    const ids=(p.comboCrystals||[]).slice(0,3);
    rows.innerHTML=ids.length?ids.map(()=>'<div class="combo-row"><select class="csel"><option value="">Select crystal…</option></select><button class="rm-combo" onclick="rmCombo(this)">×</button></div>').join(''):'<div class="combo-row"><select class="csel"><option value="">Select crystal…</option></select><button class="rm-combo" onclick="rmCombo(this)">×</button></div>';
    populateCombos();
    Array.from(rows.querySelectorAll('.csel')).forEach((sel,i)=>{sel.value=ids[i]||'';});
  }
}
function setFormVal(id,val){const el=document.getElementById(id);if(el)el.value=val;}
async function deleteCollPiece(idx){
  const p=collection[idx];if(!p)return;
  const c=CRYSTALS.find(x=>x.i===p.crystalId);
  const name=collPieceName(p,c);
  if(!confirm(`Delete ${name} from your collection?`))return;
  collDetailReturnFamily=null;
  try{
    if(_currentUser&&p.id){
      const { error } = await _supa.from('collection_items').delete().eq('user_id',_currentUser.id).eq('id',p.id);
      if(error)throw error;
      closeCollDetail();
      await loadSupabaseState();
    }else{
      collection.splice(idx,1);
      localStorage.setItem('lap_coll',JSON.stringify(collection));
      localStorage.setItem('lap_last_saved',new Date().toISOString());
      closeCollDetail();renderCollection();encRender();updateLastSaved();
    }
  }catch(err){
    console.error('Delete piece failed',err);
    alert('Could not delete piece: '+(err.message||err));
  }
}

// ── DATE CASCADE ──
function updateDateCascade(prefix){
  prefix=prefix||'f';
  const yr=document.getElementById(prefix+'-year');
  const mo=document.getElementById(prefix+'-month');
  const dy=document.getElementById(prefix+'-day');
  if(!yr||!mo||!dy)return;
  mo.disabled=!yr.value;
  if(!yr.value){mo.value='';mo.disabled=true;dy.value='';dy.disabled=true;return;}
  mo.disabled=false;
  dy.disabled=!mo.value;
  if(!mo.value){dy.value='';dy.disabled=true;return;}
  dy.disabled=false;
  const DIM={January:31,February:29,March:31,April:30,May:31,June:30,July:31,August:31,September:30,October:31,November:30,December:31};
  const max=DIM[mo.value]||31;
  const cur=dy.value;
  dy.innerHTML='<option value="">Day…</option>';
  for(let d=1;d<=max;d++) dy.innerHTML+=`<option value="${d}"${String(d)===cur?' selected':''}>${d}</option>`;
}

function getAcquiredStr(prefix){
  prefix=prefix||'f';
  const yr=document.getElementById(prefix+'-year')?.value||'';
  const mo=document.getElementById(prefix+'-month')?.value||'';
  const dy=document.getElementById(prefix+'-day')?.value||'';
  return [mo,dy,yr].filter(Boolean).join(' ').trim();
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
  if(mo){mo.disabled=true;}if(dy){dy.disabled=true;}if(_returnIdx!==null&&_returnIdx!==undefined)openCollDetail(_returnIdx);
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


// ── BATCH ADD ──
function openBatchForm(){
  batchEntries=[];
  const be=document.getElementById('batch-entries');if(be)be.innerHTML='';
  const bsb=document.getElementById('batch-save-btn');if(bsb)bsb.style.display='none';
  document.getElementById('batch-form-overlay').classList.add('open');
}
function closeBatchForm(){
  document.getElementById('batch-form-overlay').classList.remove('open');
  document.getElementById('batch-form-overlay').querySelectorAll('input:not([type=file]),select').forEach(el=>el.value='');

  batchEntries=[];
  const be=document.getElementById('batch-entries');if(be)be.innerHTML='';
  const bsb=document.getElementById('batch-save-btn');if(bsb)bsb.style.display='none';
}

function loadBatchPhotos(input){
  const files=Array.from(input.files||[]);
  batchEntries=[];
  const container=document.getElementById('batch-entries');
  if(container)container.innerHTML='';
  files.forEach((file,fileIdx)=>{
    const reader=new FileReader();
    reader.onload=e=>{
      const entryIdx=batchEntries.length;
      batchEntries.push({photo:e.target.result,file:file,crystalId:'',nickname:''});
      const div=document.createElement('div');
      div.style.cssText='display:grid;grid-template-columns:80px 1fr 1fr;gap:10px;align-items:center;background:var(--white);border:0.5px solid var(--border);border-radius:8px;padding:10px';
      div.innerHTML=`<img src="${e.target.result}" style="width:80px;height:80px;object-fit:cover;border-radius:6px">
        <div style="display:flex;flex-direction:column;gap:4px"><label style="font-size:10px;letter-spacing:0.06em;text-transform:uppercase;color:var(--ink3)">Crystal *</label>
          <div class="combobox-wrap">
            <input type="text" class="combobox-input" id="b-crystal-input-${entryIdx}" placeholder="Type to search…" autocomplete="off"
              oninput="batchComboFilter(${entryIdx})"
              onfocus="batchComboFocus(${entryIdx})"
              onkeydown="batchComboKey(event,${entryIdx})"
              style="padding:7px 10px;font-size:12px">
            <div class="combobox-dropdown" id="b-crystal-drop-${entryIdx}"></div>
          </div>
        </div>
        <div style="display:flex;flex-direction:column;gap:4px"><label style="font-size:10px;letter-spacing:0.06em;text-transform:uppercase;color:var(--ink3)">Nickname</label>
          <input type="text" placeholder="Optional…" onchange="batchEntries[${entryIdx}].nickname=this.value" style="padding:7px 10px;border:0.5px solid var(--border);border-radius:6px;background:var(--stone);font-family:'Jost',sans-serif;font-size:12px;color:var(--ink);outline:none">
        </div>`;
      if(container)container.appendChild(div);
      if(batchEntries.length===files.length){
        const bsb=document.getElementById('batch-save-btn');if(bsb)bsb.style.display='';
      }
    };
    reader.readAsDataURL(file);
  });
  input.value='';
}
function batchComboRender(idx,query){
  const drop=document.getElementById(`b-crystal-drop-${idx}`);if(!drop)return;
  const q=(query||'').toLowerCase().trim();
  const source=sortedCrystals(CRYSTALS);
  const matches=q?source.filter(c=>c.n.toLowerCase().includes(q)||(c.a&&c.a.toLowerCase().includes(q))).slice(0,50):source.slice(0,50);
  drop.innerHTML='';
  if(!matches.length){drop.innerHTML='<div class="combobox-empty">No crystals found</div>';return;}
  matches.forEach(c=>{
    const opt=document.createElement('div');
    opt.className='combobox-option';
    opt.textContent=c.n;
    opt.addEventListener('mousedown',e=>{e.preventDefault();batchComboSelect(idx,c.i,c.n,e);});
    opt.addEventListener('click',e=>batchComboSelect(idx,c.i,c.n,e));
    drop.appendChild(opt);
  });
}
function batchComboFocus(idx){
  const input=document.getElementById(`b-crystal-input-${idx}`);
  const drop=document.getElementById(`b-crystal-drop-${idx}`);
  if(!input||!drop)return;
  drop.classList.add('open');
  batchComboRender(idx,input.value||'');
}
function batchComboFilter(idx){
  const input=document.getElementById(`b-crystal-input-${idx}`);
  const drop=document.getElementById(`b-crystal-drop-${idx}`);
  if(batchEntries[idx])batchEntries[idx].crystalId='';
  if(!input||!drop)return;
  if(!input.value){drop.classList.remove('open');return;}
  drop.classList.add('open');
  batchComboRender(idx,input.value);
}
function batchComboSelect(idx,crystalId,crystalName,e){
  e&&e.stopPropagation();
  if(batchEntries[idx])batchEntries[idx].crystalId=crystalId;
  const input=document.getElementById(`b-crystal-input-${idx}`);if(input)input.value=crystalName;
  const drop=document.getElementById(`b-crystal-drop-${idx}`);if(drop)drop.classList.remove('open');
}
function batchComboKey(e,idx){
  const drop=document.getElementById(`b-crystal-drop-${idx}`);if(!drop)return;
  const opts=drop.querySelectorAll('.combobox-option');
  const focused=drop.querySelector('.combobox-option.focused');
  let pos=focused?Array.from(opts).indexOf(focused):-1;
  if(e.key==='ArrowDown'){e.preventDefault();pos=Math.min(pos+1,opts.length-1);opts.forEach((o,i)=>o.classList.toggle('focused',i===pos));}
  else if(e.key==='ArrowUp'){e.preventDefault();pos=Math.max(pos-1,0);opts.forEach((o,i)=>o.classList.toggle('focused',i===pos));}
  else if(e.key==='Enter'&&focused){e.preventDefault();focused.click();}
  else if(e.key==='Escape'){drop.classList.remove('open');}
}

async function saveBatch(){
  const source=document.getElementById('b-source')?.value||'';
  const loc=document.getElementById('b-loc')?.value||'';
  const form=document.getElementById('b-form')?.value||'';
  const acquired=document.getElementById('b-acquired')?.value||'';
  const validEntries=(batchEntries||[]).filter(entry=>entry&&entry.crystalId);
  if(!validEntries.length){alert('Please assign at least one photo to a crystal.');return;}
  const saveBtn=document.getElementById('batch-save-btn');
  const oldText=saveBtn?saveBtn.textContent:'';
  if(saveBtn){saveBtn.disabled=true;saveBtn.textContent='Saving…';}
  let saved=0;
  try{
    if(_currentUser&&_supa){
      for(const entry of validEntries){
        const payload={
          user_id:_currentUser.id,
          stone_id:entry.crystalId,
          form_type:form||null,
          size:null,
          notes:null,
          acquired_from:source.trim()||null,
          acquired_date:acquired||null,
          price_paid:null,
          nickname:(entry.nickname||'').trim()||null,
          treatment:'Natural',
          condition:null,
          location:loc.trim()||null,
          is_combo:false,
          combo_stone_ids:[],
          combo_stone_names:[]
        };
        const { data, error } = await _supa
          .from('collection_items')
          .insert(payload)
          .select('id')
          .single();
        if(error)throw error;
        if(entry.file instanceof File){
          await _uploadCollectionPhotos(data.id,[{file:entry.file,_pendingId:'batch-'+saved}],1);
        }
        saved++;
      }
      closeBatchForm();
      // Give Supabase a tiny breath, then reload the collection so newly saved batch items appear immediately.
      await new Promise(resolve=>setTimeout(resolve,350));
      collQuickFilter='all';
      document.querySelectorAll('.stat-clickable').forEach(el=>el.classList.remove('active-stat'));
      const totalCell=document.getElementById('stat-cell-total');
      if(totalCell)totalCell.classList.add('active-stat');
      await loadSupabaseState();
      renderCollection();
      encRender();
      updateLastSaved();
      scrollPageTop();
      alert(`Saved ${saved} piece${saved!==1?'s':''} to your collection.`);
    }else{
      validEntries.forEach(entry=>{
        collection.push({
          id:Date.now()+Math.random(),crystalId:entry.crystalId,isCombo:false,comboCrystals:[],
          nickname:entry.nickname,form,size:'',dims:'',treated:'Natural',
          locCustom:loc,shelf:'',tier:'',pos:'',acquired,source,price:'',notes:'',
          photos:entry.photo?[entry.photo]:[],
        });
        owned[entry.crystalId]=true;
        saved++;
      });
      localStorage.setItem('lap_coll',JSON.stringify(collection));
      localStorage.setItem('lap_owned',JSON.stringify(owned));
      localStorage.setItem('lap_last_saved',new Date().toISOString());
      closeBatchForm();renderCollection();encRender();scrollPageTop();
      alert(`Saved ${saved} piece${saved!==1?'s':''} to your collection.`);
    }
  }catch(err){
    console.error('Batch save failed',err);
    alert('Could not save batch entries: '+(err.message||err));
  }finally{
    if(saveBtn){saveBtn.disabled=false;saveBtn.textContent=oldText||'Save all entries';}
  }
}

// ── ENCYCLOPEDIA ENTRY ──
function openAddEncForm(){document.getElementById('add-enc-form-overlay').classList.add('open');}
function encCheckDupe(val){
  const warn=document.getElementById('enc-duplicate-warn');
  if(!warn)return;
  const match=val.trim()&&CRYSTALS.find(x=>x.n.toLowerCase()===val.trim().toLowerCase());
  if(match){warn.textContent='⚠ "'+match.n+'" already exists ('+match.i+')';warn.style.display='block';}
  else{warn.style.display='none';}
}
async function encAutoFill(){
  const name=(document.getElementById('enc-name')?.value||'').trim();
  if(!name){alert('Enter a stone name first.');return;}
  const btn=document.getElementById('enc-autofill-btn');
  const status=document.getElementById('enc-autofill-status');
  if(btn){btn.disabled=true;btn.textContent='✦ Looking up…';}
  if(status){status.textContent='Asking Claude about '+name+'…';status.style.display='block';}
  try{
    const resp=await fetch('https://vxujlgyhgnihnqrxzefw.supabase.co/functions/v1/claude-stone-lookup',{
      method:'POST',
      headers:{'Content-Type':'application/json','Authorization':'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ4dWpsZ3loZ25paG5xcnh6ZWZ3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkzMjQwNDQsImV4cCI6MjA5NDkwMDA0NH0.1qWY2MsxbiNsS6zzJ1y9amD_KIVwxvoFzODbH5RJoI8'},
      body:JSON.stringify({name})
    });
    const d=await resp.json();
    if(!resp.ok){throw new Error(d.message||d.error||'HTTP '+resp.status);}
    if(d.error){throw new Error(d.error);}
    const set=(id,val)=>{const el=document.getElementById(id);if(el&&val!==undefined)el.value=val;};
    set('enc-alt',d.a);set('enc-fam',d.fam);set('enc-sp',d.sp);
    set('enc-c',d.c);set('enc-cc',d.cc);set('enc-g',d.g);
    set('enc-er',[d.er1,d.er2,d.er3].filter(Boolean).join(' / '));set('enc-uw',d.uw);set('enc-chakra',Array.isArray(d.chakras)?d.chakras.join(', '):d.chakras);
    set('enc-element',d.element);set('enc-aff',d.aff);
    if(d.m){const parts=String(d.m).split(/[-–]/);set('enc-mmin',parts[0]?.trim());set('enc-mmax',parts[1]?.trim()||parts[0]?.trim());}
    const mtEl=document.getElementById('enc-mt');if(mtEl&&d.mt)mtEl.value=d.mt;
    const syEl=document.getElementById('enc-sy');if(syEl&&d.sy)syEl.value=d.sy;
    const foEl=document.getElementById('enc-fo');if(foEl&&d.fo)foEl.value=d.fo;
    const trEl=document.getElementById('enc-tr');if(trEl&&d.tr)trEl.value=d.tr;
    if(status){status.textContent='✓ Fields populated — review and adjust before saving.';}
  }catch(err){
    if(status){status.textContent='Something went wrong: '+err.message;}
  }finally{
    if(btn){btn.disabled=false;btn.textContent='✦ Auto-fill with AI';}
  }
}
function closeAddEncForm(){
  document.getElementById('add-enc-form-overlay').classList.remove('open');
  document.getElementById('add-enc-form-overlay').querySelectorAll('input,select,textarea').forEach(el=>el.value='');
}
function saveEncEntry(){
  const name=document.getElementById('enc-name').value.trim();
  if(!name){alert('Name is required.');return;}
  const newId='C-'+(9000+customEntries.length+1).toString().padStart(4,'0');
  const uw=document.getElementById('enc-uw').value.trim();
  const er=document.getElementById('enc-er').value.trim();
  const chakraStr=document.getElementById('enc-chakra').value.trim();
  const chakras=chakraStr?chakraStr.split(',').map(s=>s.trim()).filter(Boolean):[];
  const mmin=document.getElementById('enc-mmin').value.trim();
  const mmax=document.getElementById('enc-mmax').value.trim();
  const mohs=mmin&&mmax?(mmin===mmax?mmin:mmin+'–'+mmax):(mmin||mmax||'');
  const c=document.getElementById('enc-c').value.trim();
  const newEntry={
    i:newId,n:name,a:document.getElementById('enc-alt').value.trim(),
    fam:document.getElementById('enc-fam').value.trim(),
    sp:document.getElementById('enc-sp').value.trim(),
    mt:document.getElementById('enc-mt').value,sy:document.getElementById('enc-sy').value,
    fo:document.getElementById('enc-fo').value,tr:document.getElementById('enc-tr').value,
    c,ch:'#c8b89a',cc:document.getElementById('enc-cc').value.trim(),
    m:mohs,g:document.getElementById('enc-g').value.trim(),er,uw,o:false,w:false,
    chakras,element:document.getElementById('enc-element').value.trim(),
    zodiac:'',aff:document.getElementById('enc-aff').value.trim(),
    col_cats:['Multi'],all_themes:[],primary_theme:'',_search:'',isCustom:true,
  };
  customEntries.push(newEntry);
  localStorage.setItem('lap_enc_custom',JSON.stringify(customEntries));
  CRYSTALS.push(newEntry);
  closeAddEncForm();encRender();
  document.getElementById('stone-count').textContent=CRYSTALS.length+' entries';
  alert(`"${name}" added to encyclopedia as ${newId}.`);
}

// ── EXPORT ──
function exportPhotoValue(photo){
  if(!photo)return '';
  const raw=(typeof photo==='string')?photo:(photo.storage_path||photo.path||photo.name||photo.url||photo.signedUrl||photo.preview||photo.src||'');
  if(!raw)return '';
  if(String(raw).startsWith('data:image/'))return '[embedded local image omitted from CSV]';
  return raw;
}
function normalizePhotoList(piece){
  const photos=(piece&&Array.isArray(piece.photos))?piece.photos:[];
  return photos.map(exportPhotoValue).filter(Boolean);
}

function exportJSON(){dl(JSON.stringify({collection,owned,wish,exported:new Date().toISOString()},null,2),'application/json','TheLapidary_backup.json');}
function csvCell(value){return `"${String(value??'').replace(/"/g,'""')}"`;}
function downloadCSV(rows,filename){
  const csv='\ufeff'+rows.map(r=>r.map(csvCell).join(',')).join('\n');
  dl(csv,'text/csv;charset=utf-8',filename);
}
function exportCollectionCSV(){
  const rows=[['Piece ID','Crystal ID','Crystal','Nickname','Combo','Combo Stones','Form','Size','Treatment','Condition','Location','Acquired','Source','Price Paid','Primary Photo','Photo Count','Photo URLs','Notes']];
  const exportItems=dedupedCollectionItems(collection);
  exportItems.forEach(p=>{
    const c=CRYSTALS.find(x=>x.i===p.crystalId);
    const comboNames=(p.comboCrystalNames&&p.comboCrystalNames.length?p.comboCrystalNames:(p.comboCrystals||[]).map(id=>CRYSTALS.find(x=>x.i===id)?.n||'').filter(Boolean));
    const photos=normalizePhotoList(p);
    rows.push([
      p.id||'',
      p.crystalId||'',
      c?.n||'',
      p.nickname||'',
      p.isCombo?'Yes':'No',
      comboNames.join(' · '),
      p.form||'',
      p.size||'',
      p.treated||'',
      p.condition||'',
      collPieceLocation(p)||'',
      formatDisplayDate(p.acquired)||'',
      p.source||'',
      formatDisplayPrice(p.price)||'',
      photos[0]||'',
      photos.length,
      photos.join(' | '),
      p.notes||''
    ]);
  });
  downloadCSV(rows,'StillPointLapidary_collection.csv');
}
function exportWishlistCSV(){
  const rows=[['Crystal ID','Crystal','Alternate Names','Family','Species','Material Type','Crystal System','Dominant Color','Mohs','Energetic Role','Use When','Chakras','Primary Theme','All Themes']];
  const wishIds=Object.keys(wish||{}).filter(id=>wish[id]);
  CRYSTALS.filter(c=>wishIds.includes(c.i)).forEach(c=>{
    rows.push([
      c.i||'',
      c.n||'',
      c.a||'',
      c.fam||'',
      c.sp||'',
      c.mt||'',
      c.sy||'',
      c.c||'',
      c.m||'',
      [c.er1,c.er2,c.er3].filter(Boolean).join(' / '),
      c.uw||'',
      (c.chakras||[]).join(' · '),
      c.primary_theme||'',
      (c.all_themes||[]).join(' · ')
    ]);
  });
  downloadCSV(rows,'StillPointLapidary_wishlist.csv');
}
function exportCSV(){exportCollectionCSV();}
function exportEncyclopedia(){
  const rows=[['ID','Name','Alt Names','Family','Species','Material','System','Formation','Transparency','Color','Color Cause','Mohs','Geology Notes','Energetic Role 1','Energetic Role 2','Energetic Role 3','Use When','Chakras','Element','Zodiac','Intention','Primary Theme','All Themes']];
  CRYSTALS.forEach(c=>{rows.push([c.i,c.n,c.a||'',c.fam||'',c.sp||'',c.mt||'',c.sy||'',c.fo||'',c.tr||'',c.c||'',c.cc||'',c.m||'',c.g||'',c.er1||'',c.er2||'',c.er3||'',c.uw||'',(c.chakras||[]).join('; '),c.element||'',c.zodiac||'',c.aff||'',c.primary_theme||'',(c.all_themes||[]).join('; ')]);});
  dl(rows.map(r=>r.map(v=>`"${String(v).replace(/"/g,'""')}"`).join(',')).join('\n'),'text/csv','TheLapidary_Encyclopedia.csv');
}
function importJSON(input){
  const file=input.files[0];if(!file)return;
  const reader=new FileReader();
  reader.onload=e=>{
    try{
      const p=JSON.parse(e.target.result);
      if(p.collection){collection=p.collection;localStorage.setItem('lap_coll',JSON.stringify(collection));}
      if(p.owned){owned=p.owned;localStorage.setItem('lap_owned',JSON.stringify(owned));}
      if(p.wish){wish=p.wish;localStorage.setItem('lap_wish',JSON.stringify(wish));}
      renderCollection();encRender();alert('Restored '+collection.length+' pieces.');
    }catch(err){alert('Could not read file. Use a valid Lapidary JSON backup.');}
  };
  reader.readAsText(file);input.value='';
}
function dl(content,type,filename){const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([content],{type}));a.download=filename;a.click();}

let _reportType='collection';
function toggleExportMenu(id){
  const menu=document.getElementById(id);
  if(!menu)return;
  const isOpen=menu.style.display!=='none';
  ['coll-export-menu','wish-export-menu'].forEach(mid=>{const m=document.getElementById(mid);if(m)m.style.display='none';});
  if(!isOpen)menu.style.display='block';
}
document.addEventListener('click',e=>{
  if(!e.target.closest('[id$="-export-menu"]')&&!e.target.textContent?.includes('▾')){
    ['coll-export-menu','wish-export-menu'].forEach(id=>{const m=document.getElementById(id);if(m)m.style.display='none';});
  }
});
function selectReportLayout(el){
  document.querySelectorAll('.report-layout-opt').forEach(o=>{o.style.border='1px solid var(--border)';o.style.background='';o.classList.remove('selected');});
  el.style.border='1px solid var(--accent2)';el.style.background='#faf6f0';el.classList.add('selected');
  const thumbOpt=document.getElementById('report-thumb-option');
  if(thumbOpt)thumbOpt.style.display=el.dataset.val==='compact'?'block':'none';
}
function openReportOptions(type){
  _reportType=type;
  document.getElementById('report-options-title').textContent=type==='collection'?'Collection Report Options':'Wishlist Report Options';
  const collSection=document.getElementById('report-coll-section');
  if(collSection)collSection.style.display=type==='collection'?'':'none';
  const encPhotoSection=document.getElementById('report-enc-photo-section');
  if(encPhotoSection) encPhotoSection.style.display=type==='collection'?'block':'none';
  const overlay=document.getElementById('report-options-overlay');
  overlay.classList.add('open');
  const box=overlay.querySelector('.popup-box');
  if(box)box.scrollTop=0;
}
function toggleAllReportFields(){
  const boxes=Array.from(document.querySelectorAll('#report-options-overlay input[type=checkbox][data-field]')).filter(cb=>cb.dataset.field!=='thumbs');
  const allChecked=boxes.every(cb=>cb.checked);
  boxes.forEach(cb=>cb.checked=!allChecked);
  const btn=document.getElementById('report-select-all-btn');
  if(btn)btn.textContent=allChecked?'Select all fields':'Deselect all fields';
}
function closeReportOptions(){
  document.getElementById('report-options-overlay').classList.remove('open');
  document.getElementById('report-preparing').style.display='none';
  const btn=document.getElementById('report-generate-btn');
  if(btn){btn.disabled=false;btn.textContent='Generate report';}
}
function _reportFields(){
  const f={};
  document.querySelectorAll('#report-options-overlay input[type=checkbox]').forEach(cb=>{f[cb.dataset.field]=cb.checked;});
  f.layout=document.querySelector('.report-layout-opt.selected')?.dataset.val||'standard';
  return f;
}
function _reportBase(){
  return `@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=Jost:wght@300;400;500&display=swap');
  *{margin:0;padding:0;box-sizing:border-box}body{font-family:'Jost',sans-serif;color:#2a2520;background:#faf8f6;margin:0 auto}
  .sticky-header{background:#faf8f6;padding-bottom:0.75rem;margin-bottom:0.75rem;border-bottom:1.5px solid #c8a96e}
  .report-header{display:flex;align-items:flex-end;justify-content:space-between}
  .report-brand{font-family:'Cormorant Garamond',serif;font-size:26px;font-weight:300;color:#2a2520;letter-spacing:0.04em}
  .report-brand span{color:#c8a96e;font-style:italic}.report-subtitle{font-size:9px;letter-spacing:0.14em;text-transform:uppercase;color:#8a7e72;margin-top:2px}
  .report-meta{font-size:11px;color:#a09890;padding-top:0.3rem;letter-spacing:0.04em}
  .print-toolbar{display:flex;gap:10px;align-items:center;margin-bottom:1rem}
  .print-btn{background:#c8a96e;color:#fff;border:none;padding:8px 18px;font-family:'Jost',sans-serif;font-size:11px;letter-spacing:0.1em;text-transform:uppercase;border-radius:6px;cursor:pointer}
  .stone-name{font-family:'Cormorant Garamond',serif;font-weight:400;color:#2a2520;line-height:1.2}
  .stone-alt{font-size:11px;color:#8a7e72;margin-top:2px;letter-spacing:0.04em}
  .stone-detail{font-size:12px;color:#5a5149;margin-top:5px;line-height:1.5}
  .use-when{color:#5a5149;margin-top:8px;padding:7px 11px;background:#fff;border-left:2.5px solid #c8a96e;line-height:1.6;font-style:italic}
  .fact-grid{display:grid;grid-template-columns:1fr 1fr;gap:4px 16px;margin-top:8px}
  .fact{font-size:11px;color:#a09890;line-height:1.4}.fact strong{color:#5a5149;font-weight:500}
  .meta{font-size:11px;color:#a09890;margin-top:5px;line-height:1.6}
  .notes{font-size:12px;color:#5a5149;margin-top:6px;font-style:italic;line-height:1.5}
  .ref-photo-note{position:absolute;bottom:7px;left:50%;transform:translateX(-50%);font-size:7px;letter-spacing:0.08em;text-transform:uppercase;padding:2px 6px;border-radius:999px;background:rgba(250,248,246,0.85);border:0.5px solid rgba(42,37,32,0.12);color:rgba(60,52,42,0.6);white-space:nowrap;font-family:'Jost',sans-serif}
  .footer{padding-top:1rem;border-top:0.5px solid #e0dbd4;font-size:10px;color:#a09890;text-align:center;letter-spacing:0.08em}
  .report-table{width:100%;border-collapse:collapse}.report-thead-td{padding:0.75rem 0 1.25rem;border-bottom:1.5px solid #c8a96e}
  .report-table thead{display:table-header-group}.content-wrap{padding-top:0;vertical-align:top}
  .gallery-row td{padding-top:0;vertical-align:top}.gallery-row+.gallery-row{page-break-before:always;break-before:page}
  @media print{.print-toolbar{display:none}body{background:#fff}.card{break-inside:avoid;page-break-inside:avoid}.report-table thead{display:table-header-group}.gallery-row+.gallery-row{page-break-before:always;break-before:page}@page{size:portrait;margin:1.2cm 1cm}}`;
}
function _reportStyles(layout){
  const base=_reportBase();
  if(layout==='gallery') return base+`body{padding:0.75rem 1.25rem;max-width:780px}.content-wrap{padding-top:0}.card{padding:0.5rem 0 1rem;margin-top:0.75rem}.card-photo-outer{width:min(100%,420px);margin:0 auto 1rem}.card-photo-wrap{width:100%;position:relative;overflow:hidden;border-radius:10px;box-shadow:0 4px 24px rgba(42,37,32,0.14)}.card-photo-wrap::after{content:'';display:block;padding-bottom:85%}.card-photo{position:absolute;top:0;left:0;width:100%;height:100%;object-fit:cover;border-radius:10px}.card-photo-empty{position:absolute;top:0;left:0;width:100%;height:100%;background:#f0ece7;display:flex;align-items:center;justify-content:center;font-size:12px;color:#b0a89e;border-radius:10px}.stone-name{font-size:26px;margin-bottom:4px}.use-when{font-size:13px}.fact-grid{grid-template-columns:1fr 1fr 1fr}.footer{margin-top:1rem}`;
  if(layout==='standard') return base+`body{padding:0.75rem 1.25rem;max-width:none}.std-cell{width:50%;vertical-align:top;padding-bottom:1rem;page-break-inside:avoid}.std-cell:first-child{padding-right:0.625rem}.std-cell:last-child{padding-left:0.625rem}.card{background:#fff;border-radius:10px;padding:0.75rem;box-shadow:0 1px 8px rgba(42,37,32,0.07);break-inside:avoid;overflow:hidden}.card-photo-wrap{margin-bottom:0.65rem;position:relative;width:100%;overflow:hidden;border-radius:7px;box-shadow:0 2px 8px rgba(42,37,32,0.1)}.card-photo-wrap::after{content:'';display:block;padding-bottom:100%}.card-photo{position:absolute;top:0;left:0;width:100%;height:100%;object-fit:cover;border-radius:7px;display:block}.card-photo-empty{position:absolute;top:0;left:0;width:100%;height:100%;border-radius:7px;background:#f0ece7;display:flex;align-items:center;justify-content:center;font-size:11px;color:#b0a89e}.stone-name{font-size:18px}.use-when{font-size:12px;padding:5px 8px}.footer{margin-top:1rem}`;
  if(layout==='compact') return base+`body{padding:0.75rem 1.25rem;max-width:none}.content-wrap{padding-top:0}.inv-row{display:flex;gap:10px;padding:6px 0;border-bottom:0.5px solid #ede9e4;break-inside:avoid;align-items:flex-start}.inv-row:first-child{border-top:0.5px solid #ede9e4}.inv-thumb-wrap{flex-shrink:0;width:48px}.inv-thumb{width:48px;height:48px;aspect-ratio:1;object-fit:cover;border-radius:4px;display:block}.inv-thumb-empty{width:48px;height:48px;border-radius:4px;background:#f0ece7;display:flex;align-items:center;justify-content:center;font-size:8px;color:#b0a89e;text-align:center;line-height:1.3;padding:2px}.inv-body{flex:1;min-width:0}.stone-name{font-size:14px}.inv-line{font-size:11px;color:#5a5149;margin-top:2px;line-height:1.4}.use-when{font-size:11px;padding:3px 7px;margin-top:4px;border-left-width:2px}.ref-photo-note{max-width:48px;word-wrap:break-word;overflow-wrap:break-word}.footer{margin-top:1.5rem}`;
  return _reportStyles('standard');
}
function _reportHeaderHtml(title,count,unit){
  return `<table class="report-table"><thead><tr><td colspan="2" class="report-thead-td"><div class="report-header"><div><div class="report-brand">STILL POINT <span>Lapidary</span></div><div class="report-subtitle">Crystal Reference Library</div></div><div style="text-align:right;font-size:12px;color:#8a7e72;font-family:'Jost',sans-serif">${title}<br><span style="font-size:11px;color:#a09890">${new Date().toLocaleDateString('en-US',{year:'numeric',month:'long',day:'numeric'})}</span></div></div><div class="report-meta">${count} ${unit}${count!==1?'s':''}</div></td></tr></thead>`;
}
function _reportHeader(title,count,unit){return _reportHeaderHtml(title,count,unit);}
function _photoHtml(photoUrl,name,encFallback,useEnc,cssClass){
  const outer=(cssClass==='card-photo'&&arguments[5])?`<div class="card-photo-outer">`:'';
  const outerClose=outer?'</div>':'';
  if(photoUrl) return `${outer}<div class="card-photo-wrap"><img class="${cssClass}" src="${photoUrl}" alt="${name}"></div>${outerClose}`;
  if(useEnc&&encFallback) return `${outer}<div class="card-photo-wrap" style="position:relative"><img class="${cssClass}" src="${encFallback}" alt="${name} reference image"><div class="ref-photo-note">Reference image</div></div>${outerClose}`;
  return `${outer}<div class="card-photo-wrap"><div class="${cssClass.replace('card-photo','card-photo-empty')} ${cssClass.includes('inv-thumb')?'inv-thumb-empty':''}">No photo</div></div>${outerClose}`;
}
async function generateReport(){
  const btn=document.getElementById('report-generate-btn');
  const prep=document.getElementById('report-preparing');
  if(btn){btn.disabled=true;btn.textContent='Preparing…';}
  if(prep)prep.style.display='block';
  const f=_reportFields();
  try{
    if(_reportType==='collection') await _printCollectionReport(f);
    else _printWishlistReport(f);
  }finally{closeReportOptions();}
}
async function _printCollectionReport(f){
  const layout=f.layout||'standard';
  const items=dedupedCollectionItems(collection);
  if(!items.length){alert('Your collection is empty.');return;}
  const cards=await Promise.all(items.map(async p=>{
    const c=CRYSTALS.find(x=>x.i===p.crystalId);
    const name=c?.n||'Unknown';
    const photoUrl=firstCollectionPhoto(p);
    const encFallbackFile=ENCYCLOPEDIA_PHOTOS[p.crystalId]?.[0];
    const encFallback=encFallbackFile?SUPABASE_ENC+encFallbackFile:null;
    const nickname=p.nickname?` <span style="color:#8a7e72;font-style:italic">"${p.nickname}"</span>`:'';
    const comboNames=(p.comboCrystalNames&&p.comboCrystalNames.length?p.comboCrystalNames:(p.comboCrystals||[]).map(id=>CRYSTALS.find(x=>x.i===id)?.n||'').filter(Boolean));
    const formParts=[f.form&&p.form?`Form: ${p.form}`:'',f.form&&p.size?`Size: ${p.size}`:''].filter(Boolean).join(' · ');
    const treatLine=f.condition&&p.treated?`Treatment: ${p.treated}`:'';
    const condLine=f.condition&&p.condition?`Condition: ${p.condition}`:'';
    const formHtml=[formParts,treatLine,condLine].filter(Boolean).map(l=>`<div>${l}</div>`).join('');
    const metaParts=[f.acquired&&formatDisplayDate(p.acquired)?`Acquired ${formatDisplayDate(p.acquired)}`:'',f.acquired&&p.source?`Source: ${p.source}`:'',f.price&&formatDisplayPrice(p.price)?formatDisplayPrice(p.price):''].filter(Boolean);
    if(layout==='gallery'){
      const ph=_photoHtml(photoUrl,name,encFallback,f.encphoto,'card-photo',true);
      const facts=[[c?.fam,'Family'],[c?.sy,'System'],[c?.fo,'Formation'],[c?.m?c.m+' Mohs':null,'Hardness'],[c?.element,'Element'],[c?.chakras?.join(', '),'Chakra']].filter(r=>r[0]);
      return `<div class="card">${ph}<div class="stone-name">${name}${nickname}</div>${c?.a?`<div class="stone-alt">Also known as: ${c.a}</div>`:''}${p.isCombo&&comboNames.length?`<div class="stone-alt">Combo: ${comboNames.join(' · ')}</div>`:''} ${formHtml?`<div class="stone-detail">${formHtml}</div>`:''} ${f.usewhen&&c?.uw?`<div class="use-when">${c.uw}</div>`:''} ${facts.length?`<div class="fact-grid">${facts.map(([v,l])=>`<div class="fact"><strong>${l}:</strong> ${v}</div>`).join('')}</div>`:''} ${f.location&&collPieceLocation(p)?`<div class="meta">📍 ${collPieceLocation(p)}</div>`:''} ${metaParts.length?`<div class="meta">${metaParts.join(' · ')}</div>`:''} ${f.notes&&p.notes?`<div class="notes">${p.notes}</div>`:''} ${f.aff&&c?.aff?`<div class="meta" style="font-style:italic;margin-top:12px;font-size:13px">"${c.aff}"</div>`:''}</div>`;
    }
    if(layout==='compact'){
      const showThumb=f.thumbs!==false;
      const ph=showThumb?`<div class="inv-thumb-wrap">${_photoHtml(photoUrl,name,encFallback,f.encphoto,'inv-thumb')}</div>`:'';
      return `<div class="inv-row">${ph}<div class="inv-body"><div class="stone-name">${name}${nickname}</div><div class="inv-line">${formHtml}${f.location&&collPieceLocation(p)?`<div>📍 ${collPieceLocation(p)}</div>`:''}</div>${metaParts.length?`<div class="inv-line" style="color:#a09890">${metaParts.join(' · ')}</div>`:''} ${f.usewhen&&c?.uw?`<div class="use-when">${c.uw}</div>`:''} ${f.notes&&p.notes?`<div class="notes">${p.notes}</div>`:''}</div></div>`;
    }
    const ph=_photoHtml(photoUrl,name,encFallback,f.encphoto,'card-photo');
    return `<div class="card">${ph}<div class="stone-name">${name}${nickname}</div>${p.isCombo&&comboNames.length?`<div class="stone-alt">Combo: ${comboNames.join(' · ')}</div>`:''} ${formHtml?`<div class="stone-detail">${formHtml}</div>`:''} ${f.usewhen&&c?.uw?`<div class="use-when">${c.uw}</div>`:''} ${f.er&&c?.er?`<div class="stone-alt" style="margin-top:6px">${c.er}</div>`:''} ${f.location&&collPieceLocation(p)?`<div class="meta">📍 ${collPieceLocation(p)}</div>`:''} ${metaParts.length?`<div class="meta">${metaParts.join(' · ')}</div>`:''} ${f.notes&&p.notes?`<div class="notes">${p.notes}</div>`:''} ${f.chakras&&c?.chakras?.length?`<div class="meta">Chakra: ${c.chakras.join(' · ')}</div>`:''} ${f.aff&&c?.aff?`<div class="meta" style="font-style:italic">"${c.aff}"</div>`:''}</div>`;
  }));
  let tbody;
  if(layout==='gallery') tbody=cards.map(c=>`<tbody class="gallery-row"><tr><td>${c}</td></tr></tbody>`).join('');
  else if(layout==='standard'){const rows2=[];for(let i=0;i<cards.length;i+=2){rows2.push(`<tr><td class="std-cell">${cards[i]}</td><td class="std-cell">${cards[i+1]||''}</td></tr>`);}tbody=`<tbody>${rows2.join('')}<tr><td colspan="2" class="footer" style="padding-top:1rem;text-align:center">stillpointlapidary.com</td></tr></tbody>`;}
  else tbody=`<tbody><tr><td class="content-wrap">${cards.join('')}<div class="footer">stillpointlapidary.com</div></td></tr></tbody>`;
  const galleryFooter=layout==='gallery'?`<tbody><tr><td class="footer" style="padding-top:1rem;text-align:center;font-size:10px;color:#a09890;letter-spacing:0.08em">stillpointlapidary.com</td></tr></tbody>`:'';
  const _collHtml=`<!DOCTYPE html><html><head><meta charset="UTF-8"><title>My Stone Collection — Still Point Lapidary</title><style>${_reportStyles(layout)}</style></head><body><div class="print-toolbar"><button class="print-btn" onclick="window.print()">⎙ Print / Save as PDF</button></div>${_reportHeaderHtml('My Stone Collection',items.length,'piece')}${tbody}${galleryFooter}</table></body></html>`;
  const _collBlob=new Blob([_collHtml],{type:'text/html'});
  window.open(URL.createObjectURL(_collBlob),'_blank');
}
function _printWishlistReport(f){
  const layout=f.layout||'standard';
  const wishIds=Object.keys(wish||{}).filter(id=>wish[id]);
  const items=CRYSTALS.filter(c=>wishIds.includes(c.i));
  if(!items.length){alert('Your wishlist is empty.');return;}
  const cards=items.map(c=>{
    const encFile=ENCYCLOPEDIA_PHOTOS[c.i]?.[0];
    const photoUrl=encFile?SUPABASE_ENC+encFile:null;
    const detailLine=[c.fam,c.c,c.m?c.m+' Mohs':''].filter(Boolean).join(' · ');
    if(layout==='gallery'){
      const ph=photoUrl?`<div class="card-photo-wrap"><img class="card-photo" src="${photoUrl}" alt="${c.n}"></div>`:`<div class="card-photo-wrap"><div class="card-photo-empty">No photo</div></div>`;
      const facts=[[c.fam,'Family'],[c.sy,'System'],[c.fo,'Formation'],[c.m?c.m+' Mohs':null,'Hardness'],[c.element,'Element'],[c.chakras?.join(', '),'Chakra']].filter(r=>r[0]);
      return `<div class="card">${ph}<div class="stone-name">${c.n}</div>${c.a?`<div class="stone-alt">Also known as: ${c.a}</div>`:''}<div class="stone-detail">${detailLine}</div>${f.usewhen&&c.uw?`<div class="use-when">${c.uw}</div>`:''} ${facts.length?`<div class="fact-grid">${facts.map(([v,l])=>`<div class="fact"><strong>${l}:</strong> ${v}</div>`).join('')}</div>`:''} ${f.aff&&c.aff?`<div class="meta" style="font-style:italic;margin-top:12px;font-size:13px">"${c.aff}"</div>`:''}</div>`;
    }
    if(layout==='compact'){
      const showThumb=f.thumbs!==false;
      const ph=showThumb?`<div class="inv-thumb-wrap">${photoUrl?`<img class="inv-thumb" src="${photoUrl}" alt="${c.n}">`:`<div class="inv-thumb-empty">No photo</div>`}</div>`:'';
      return `<div class="inv-row">${ph}<div class="inv-body"><div class="stone-name">${c.n}</div><div class="inv-line">${detailLine}</div>${f.usewhen&&c.uw?`<div class="use-when">${c.uw}</div>`:''}</div></div>`;
    }
    const ph=photoUrl?`<div class="card-photo-wrap"><img class="card-photo" src="${photoUrl}" alt="${c.n}"></div>`:`<div class="card-photo-wrap"><div class="card-photo-empty">No photo</div></div>`;
    return `<div class="card">${ph}<div class="stone-name">${c.n}</div>${c.a?`<div class="stone-alt">Also known as: ${c.a}</div>`:''}<div class="stone-detail">${detailLine}</div>${f.usewhen&&c.uw?`<div class="use-when">${c.uw}</div>`:''} ${f.er&&c.er?`<div class="stone-alt" style="margin-top:6px">${c.er}</div>`:''} ${f.chakras&&c.chakras?.length?`<div class="meta">Chakra: ${c.chakras.join(' · ')}</div>`:''} ${f.aff&&c.aff?`<div class="meta" style="font-style:italic">"${c.aff}"</div>`:''}</div>`;
  });
  let tbody;
  const attrib=f.encphoto?'<div style="font-style:italic;margin-top:3px">Crystal reference images courtesy of Still Point Lapidary</div>':'';
  if(layout==='gallery') tbody=cards.map(c=>`<tbody class="gallery-row"><tr><td>${c}</td></tr></tbody>`).join('');
  else if(layout==='standard'){const rows2=[];for(let i=0;i<cards.length;i+=2){rows2.push(`<tr><td class="std-cell">${cards[i]}</td><td class="std-cell">${cards[i+1]||''}</td></tr>`);}tbody=`<tbody>${rows2.join('')}<tr><td colspan="2" class="footer" style="padding-top:1rem;text-align:center">stillpointlapidary.com${attrib}</td></tr></tbody>`;}
  else tbody=`<tbody><tr><td class="content-wrap">${cards.join('')}<div class="footer">stillpointlapidary.com${attrib}</div></td></tr></tbody>`;
  const galleryFooter=layout==='gallery'?`<tbody><tr><td class="footer" style="padding-top:1rem;text-align:center;font-size:10px;color:#a09890;letter-spacing:0.08em">stillpointlapidary.com${attrib}</td></tr></tbody>`:'';
  const win=window.open('','_blank');
  const _wishHtml=`<!DOCTYPE html><html><head><meta charset="UTF-8"><title>My Wishlist — Still Point Lapidary</title><style>${_reportStyles(layout)}</style></head><body><div class="print-toolbar"><button class="print-btn" onclick="window.print()">⎙ Print / Save as PDF</button></div>${_reportHeaderHtml('My Wishlist',items.length,'stone')}${tbody}${galleryFooter}</table></body></html>`;
  const _wishBlob=new Blob([_wishHtml],{type:'text/html'});
  window.open(URL.createObjectURL(_wishBlob),'_blank');
}

function scrollPageTop(){
  try{window.scrollTo({top:0,left:0,behavior:'smooth'});}catch(e){window.scrollTo(0,0);}
}
function scrollElementTop(id){
  const el=document.getElementById(id);
  if(el)el.scrollTop=0;
}

// ── TABS ──
function rememberActiveTab(name){
  try{localStorage.setItem('spl_active_tab',name);}catch(e){}
}
function getTabButton(name){
  const map={encyclopedia:0,mood:1,collection:2,identify:3,'101':4};
  const idx=map[name];
  return idx===undefined?null:document.querySelectorAll('.nav-tab')[idx];
}
function switchTab(name,btn){
  rememberActiveTab(name);
  document.querySelectorAll('main>section').forEach(s=>s.style.display='none');
  document.querySelectorAll('.nav-tab').forEach(b=>b.classList.remove('active'));
  const tab=document.getElementById('tab-'+name);
  if(tab)tab.style.display='block';
  const _navBtn=btn||getTabButton(name);
  _navBtn?.classList.add('active');
  _navBtn?.scrollIntoView({behavior:'smooth',block:'nearest',inline:'center'});
  scrollPageTop();
  if(name==='101'){init101();}
  if(name==='identify'){initId2();}
  if(name==='collection'){collQuickFilter='all';document.querySelectorAll('.stat-clickable').forEach(el=>el.classList.remove('active-stat'));const tc=document.getElementById('stat-cell-total');if(tc)tc.classList.add('active-stat');renderCollection();}
}
function switchTabByName(name){
  rememberActiveTab(name);
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
}

function scrollToTabTop(name){
  const tab=document.getElementById('tab-'+name);
  if(!tab)return;
  const y=tab.getBoundingClientRect().top+window.scrollY-120;
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
  const CACHE_KEY = 'spl_stones_cache';
  const CACHE_VER = 'v2';

  function mapRow(r) {
    const cats = Array.isArray(r.color_categories) ? r.color_categories : (r.color_categories ? [r.color_categories] : []);
    const er1  = (r.energetic_role_1 || '').toLowerCase();
    const er2  = (r.energetic_role_2 || '').toLowerCase();
    const er3  = (r.energetic_role_3 || '').toLowerCase();
    const pt   = (r.primary_theme   || '').toLowerCase();
    const at   = (r.all_themes      || []).map(t => t.toLowerCase()).join(' ');
    return {
      i:             r.id,
      n:             r.name              || '',
      a:             r.alternate_names   || '',
      fam:           r.family            || '',
      sp:            r.species           || '',
      mt:            r.material_type     || '',
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
      primary_theme: r.primary_theme     || '',
      all_themes:    r.all_themes        || [],
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


// ── IDENTIFY WIZARD ──

const IDENTIFY_STEPS = [
  {
    id: 'color',
    question: 'What is the dominant color?',
    hint: 'Choose the most prominent color. Multicolor stones with no single dominant color — select Multi.',
    type: 'grid',
    options: [
      {val:'Purple', label:'Purple / Violet', hex:'#7a5a9a'},
      {val:'Blue', label:'Blue / Indigo', hex:'#5a8ab0'},
      {val:'Green', label:'Green / Teal', hex:'#4a8a5a'},
      {val:'Pink', label:'Pink / Rose', hex:'#d4839a'},
      {val:'Red', label:'Red / Crimson', hex:'#b04a4a'},
      {val:'Orange', label:'Orange / Peach', hex:'#d4783a'},
      {val:'Yellow', label:'Yellow / Gold', hex:'#c9a832'},
      {val:'Black', label:'Black', hex:'#3a3530'},
      {val:'White', label:'White / Clear', hex:'#e8e4de'},
      {val:'Brown', label:'Brown / Earth tones', hex:'#8b6f47'},
      {val:'Gray', label:'Gray / Silver / Metallic', hex:'#8a8a8a'},
      {val:'Multi', label:'Multicolor / Iridescent', hex:'#9a8a7a'},
    ],
    filter: (crystals, val) => crystals.filter(c => c.col_cats && c.col_cats.includes(val)),
  },
  {
    id: 'transparency',
    question: 'Can you see light through it?',
    hint: 'Hold it up to a light source or window.',
    type: 'list',
    options: [
      {val:'Transparent', label:'Fully transparent', desc:'You can see clearly through it like glass'},
      {val:'Translucent', label:'Translucent', desc:'Light passes through but you cannot see clearly through it'},
      {val:'Opaque', label:'Opaque', desc:'No light passes through at all'},
    ],
    filter: (crystals, val) => {
      const map = {
        'Transparent': ['Transparent','Transparent to Translucent'],
        'Translucent': ['Translucent','Transparent to Translucent','Translucent to Opaque'],
        'Opaque': ['Opaque','Translucent to Opaque'],
      };
      const valid = map[val] || [];
      return crystals.filter(c => c.tr && valid.some(v => c.tr.includes(v)));
    },
  },
  {
    id: 'luster',
    question: 'How does the surface catch light?',
    hint: 'Look at a fresh surface or polished face, not a weathered outside.',
    type: 'list',
    options: [
      {val:'vitreous', label:'Glassy / Vitreous', desc:'Bright, glass-like shine (most common in crystals)'},
      {val:'metallic', label:'Metallic', desc:'Shiny like metal — gold, silver, or bronze'},
      {val:'pearly', label:'Pearly / Silky', desc:'Soft sheen like a pearl or silk fabric'},
      {val:'resinous', label:'Resinous / Waxy', desc:'Like dried resin or candle wax'},
      {val:'earthy', label:'Dull / Earthy', desc:'Matte, no shine at all'},
      {val:'adamantine', label:'Brilliant / Adamantine', desc:'Exceptionally bright, diamond-like fire'},
    ],
    filter: (crystals, val) => {
      // Map luster to material types and known stones
      const metallic = ['Pyrite','Hematite','Galena','Chalcopyrite','Peacock Ore','Stibnite','Marcasite','Magnetite','Lodestone','Copper','Bornite'];
      const pearly = ['Selenite','Satin Spar Gypsum','Lepidolite','Muscovite','Mica','Petalite','Stilbite','Tremolite','Talc'];
      const earthy = ['Jasper','Turquoise','Chrysocolla','Serpentine','Howlite','Magnesite','Rhyolite'];
      const adamantine = ['Diamond','Zircite','Sphene','Sphalerite','Rhodizite','Cassiterite','Cerussite'];
      const resinous = ['Amber','Jet','Obsidian','Opal'];
      if(val==='metallic') return crystals.filter(c=>metallic.some(n=>c.n.includes(n))||c.mt==='Sulfide'||(c.c&&c.c.toLowerCase().includes('metallic')));
      if(val==='pearly') return crystals.filter(c=>pearly.some(n=>c.n.includes(n))||(c.tr&&c.tr.toLowerCase().includes('translucent'))&&(c.fam==='Gypsum'||c.fam==='Mica'));
      if(val==='earthy') return crystals.filter(c=>earthy.some(n=>c.n.includes(n))||c.mt==='Aggregate'||(c.sy&&c.sy==='Polymineralic'));
      if(val==='adamantine') return crystals.filter(c=>adamantine.some(n=>c.n.includes(n)));
      if(val==='resinous') return crystals.filter(c=>resinous.some(n=>c.n.includes(n))||c.mt==='Organic'||c.mt==='Mineraloid');
      // vitreous = most minerals, default fallback
      return crystals.filter(c=>!metallic.some(n=>c.n.includes(n))&&!pearly.some(n=>c.n.includes(n))&&!earthy.some(n=>c.n.includes(n)));
    },
  },
  {
    id: 'hardness',
    question: 'How hard is the stone?',
    hint: 'Test carefully on an inconspicuous spot. Soft stones will scratch with a fingernail.',
    type: 'list',
    options: [
      {val:'very_soft', label:'Very soft (Mohs 1–3)', desc:'A fingernail easily scratches it'},
      {val:'soft', label:'Soft (Mohs 3–5)', desc:'A copper coin scratches it, not a fingernail'},
      {val:'medium', label:'Medium (Mohs 5–6.5)', desc:'A steel knife scratches it, not a copper coin'},
      {val:'hard', label:'Hard (Mohs 6.5–8)', desc:'A steel knife does NOT scratch it. It scratches glass.'},
      {val:'very_hard', label:'Very hard (Mohs 8+)', desc:'Extremely difficult to scratch. Very rare.'},
    ],
    filter: (crystals, val) => {
      const ranges = {
        very_soft: [0,3], soft: [2.5,5], medium: [4.5,6.5], hard: [6,8.5], very_hard: [7.5,11]
      };
      const [mn,mx] = ranges[val];
      return crystals.filter(c=>{
        const m = parseFloat(c.m);
        return !isNaN(m) && m>=mn && m<=mx;
      });
    },
  },
  {
    id: 'form',
    question: 'What is its natural form or structure?',
    hint: 'This refers to how it was formed, not how it was cut or polished.',
    type: 'list',
    options: [
      {val:'cubic', label:'Cubic / Blocky crystals', desc:'Square or octahedral shapes — pyrite, fluorite, garnet'},
      {val:'prismatic', label:'Prismatic columns', desc:'Long hexagonal or rectangular columns — quartz, tourmaline, beryl'},
      {val:'bladed', label:'Bladed / Flat', desc:'Thin flat blades or plates — kyanite, selenite, mica'},
      {val:'botryoidal', label:'Rounded / Botryoidal', desc:'Grape-like bubbled surfaces — malachite, chalcedony, smithsonite'},
      {val:'massive', label:'Massive / No visible crystals', desc:'Solid with no distinct crystal faces — most tumbled stones, jaspers'},
      {val:'fibrous', label:'Fibrous / Silky', desc:'Hair-like or needle-like structure — satin spar, ulexite, rutile'},
      {val:'dendritic', label:'Dendritic / Branching', desc:'Tree or fern-like inclusions — dendritic agate, pyrolusite'},
    ],
    filter: (crystals, val) => {
      const cubic_fams = ['Fluorite','Garnet','Obsidian','Iron Minerals'];
      const cubic_names = ['Pyrite','Galena','Magnetite','Halite','Diamond','Spinel','Sodalite'];
      const prismatic_fams = ['Quartz','Tourmaline','Beryl','Kyanite','Apatite'];
      const prismatic_sys = ['Trigonal','Hexagonal','Tetragonal'];
      const bladed = ['Kyanite','Selenite','Mica','Satin Spar','Barite','Stilbite','Wulfenite'];
      const botryoidal = ['Malachite','Chalcedony','Smithsonite','Hemimorphite','Prehnite','Chrysocolla','Goethite'];
      const fibrous = ['Ulexite','Satin Spar Gypsum','Tremolite','Tiger','Asbestos','Howlite'];
      const dendritic = ['Dendritic','Moss Agate','Pyrolusite','Psilomelane'];
      
      if(val==='cubic') return crystals.filter(c=>cubic_fams.some(f=>c.fam===f)||cubic_names.some(n=>c.n.includes(n))||c.sy==='Cubic');
      if(val==='prismatic') return crystals.filter(c=>prismatic_fams.some(f=>c.fam===f)||prismatic_sys.some(s=>c.sy===s));
      if(val==='bladed') return crystals.filter(c=>bladed.some(n=>c.n.includes(n))||c.sy==='Triclinic'||c.sy==='Monoclinic');
      if(val==='botryoidal') return crystals.filter(c=>botryoidal.some(n=>c.n.includes(n)));
      if(val==='fibrous') return crystals.filter(c=>fibrous.some(n=>c.n.includes(n)));
      if(val==='dendritic') return crystals.filter(c=>dendritic.some(n=>c.n.includes(n)));
      // massive = everything else
      return crystals.filter(c=>!prismatic_sys.some(s=>c.sy===s)||c.mt==='Aggregate');
    },
  },
  {
    id: 'formation',
    question: 'Where or how do you think it formed?',
    hint: 'This is optional but very helpful. Skip if unsure.',
    type: 'list',
    options: [
      {val:'Igneous', label:'From volcanic / magma activity', desc:'Formed in cooling lava or magma — obsidian, basalt, granite-family'},
      {val:'Metamorphic', label:'Deep earth pressure & heat', desc:'Transformed under extreme conditions — garnet, kyanite, ruby, jade'},
      {val:'Sedimentary', label:'Layers of sediment', desc:'Built up over time in layers — calcite, jasper, some agates'},
      {val:'Hydrothermal', label:'Hot water through rock', desc:'Crystallized from hot mineral-rich fluids — quartz, fluorite, pyrite'},
      {val:'Secondary', label:'From weathering / oxidation', desc:'Formed when other minerals broke down — malachite, azurite, chrysocolla'},
    ],
    filter: (crystals, val) => crystals.filter(c=>c.fo&&c.fo.toLowerCase().includes(val.toLowerCase())),
  }
];

let identifyCandidates = [];
let identifyAnswers = {};
let identifyStepHistory = [];
let identifyCurrentStep = 0;

function startIdentify(){
  identifyCandidates = [...CRYSTALS];
  identifyAnswers = {};
  identifyStepHistory = [];
  identifyCurrentStep = 0;
  document.getElementById('identify-start').style.display='none';
  document.getElementById('identify-wizard').style.display='block';
  document.getElementById('identify-results').style.display='none';
  showIdentifyStep(0);
}

function resetIdentify(){
  identifyCandidates = [...CRYSTALS];
  identifyAnswers = {};
  identifyStepHistory = [];
  identifyCurrentStep = 0;
  document.getElementById('identify-start').style.display='block';
  document.getElementById('identify-wizard').style.display='none';
  document.getElementById('identify-results').style.display='none';
}

function showIdentifyStep(stepIdx){
  identifyCurrentStep = stepIdx;
  const step = IDENTIFY_STEPS[stepIdx];
  const totalSteps = IDENTIFY_STEPS.length;
  const progress = (stepIdx / totalSteps) * 100;
  
  document.getElementById('id-progress-bar').style.width = progress+'%';
  document.getElementById('id-step-label').textContent = 'Step '+(stepIdx+1)+' of '+totalSteps;
  document.getElementById('id-back-btn').style.display = stepIdx>0?'':'none';
  
  // Candidate count
  const bar = document.getElementById('id-candidate-bar');
  if(identifyCandidates.length < CRYSTALS.length){
    bar.style.display='block';
    bar.textContent = identifyCandidates.length+' possible matches remaining';
  } else {
    bar.style.display='none';
  }
  
  // Render question
  const qa = document.getElementById('id-question-area');
  qa.innerHTML = `
    <div style="font-family:'Cormorant Garamond',serif;font-size:22px;font-weight:300;color:var(--ink);margin-bottom:6px">${step.question}</div>
    <div style="font-size:12px;color:var(--ink3);margin-bottom:1.25rem;line-height:1.6">${step.hint}</div>
    <div id="id-options-container">${renderIdentifyOptions(step)}</div>
  `;
}

function renderIdentifyOptions(step){
  if(step.type==='grid'){
    return '<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(140px,1fr));gap:8px">'+
      step.options.map(opt=>`
        <button onclick="selectIdentifyAnswer('${step.id}','${opt.val}',this)" style="padding:14px 10px;border:0.5px solid var(--border);border-radius:8px;background:var(--white);cursor:pointer;font-family:'Jost',sans-serif;font-size:12px;color:var(--ink2);transition:all 0.15s;display:flex;align-items:center;gap:8px;text-align:left">
          <span style="width:18px;height:18px;border-radius:50%;background:${opt.hex};border:0.5px solid rgba(0,0,0,0.1);flex-shrink:0"></span>
          ${opt.label}
        </button>`).join('')+
      '</div>';
  }
  return '<div style="display:flex;flex-direction:column;gap:8px">'+
    step.options.map(opt=>`
      <button onclick="selectIdentifyAnswer('${step.id}','${opt.val}',this)" style="padding:14px 16px;border:0.5px solid var(--border);border-radius:8px;background:var(--white);cursor:pointer;font-family:'Jost',sans-serif;text-align:left;transition:all 0.15s;display:flex;flex-direction:column;gap:3px">
        <span style="font-size:13px;color:var(--ink);font-weight:500">${opt.label}</span>
        <span style="font-size:11px;color:var(--ink3)">${opt.desc}</span>
      </button>`).join('')+
    '</div>';
}

function selectIdentifyAnswer(stepId, val, btn){
  // Highlight selected
  btn.closest('#id-options-container').querySelectorAll('button').forEach(b=>{
    b.style.background='var(--white)';b.style.borderColor='var(--border)';b.style.color='var(--ink2)';
  });
  btn.style.background='var(--ink)';btn.style.borderColor='var(--ink)';btn.style.color='var(--white)';
  btn.querySelectorAll('span').forEach(s=>s.style.color='var(--white)');
  
  // Brief delay then advance
  setTimeout(()=>applyIdentifyAnswer(stepId, val), 280);
}

function applyIdentifyAnswer(stepId, val){
  identifyAnswers[stepId] = val;
  identifyStepHistory.push(identifyCurrentStep);
  
  // Apply filter
  const step = IDENTIFY_STEPS.find(s=>s.id===stepId);
  const filtered = step.filter(identifyCandidates, val);
  
  // Only narrow if we still have reasonable results
  if(filtered.length >= 1){
    identifyCandidates = filtered;
  }
  
  // Check if done or advance
  const nextStep = identifyCurrentStep + 1;
  if(nextStep >= IDENTIFY_STEPS.length || identifyCandidates.length <= 3){
    showIdentifyResults();
  } else {
    showIdentifyStep(nextStep);
  }
}

function identifyBack(){
  if(identifyStepHistory.length === 0)return;
  const prevStep = identifyStepHistory.pop();
  // Undo the last answer's filter by re-running from scratch
  identifyCandidates = [...CRYSTALS];
  const answeredSteps = Object.keys(identifyAnswers).slice(0,-1);
  delete identifyAnswers[IDENTIFY_STEPS[identifyCurrentStep]?.id];
  // Re-apply all previous answers
  answeredSteps.forEach(sid=>{
    const s=IDENTIFY_STEPS.find(x=>x.id===sid);
    if(s){
      const filtered=s.filter(identifyCandidates,identifyAnswers[sid]);
      if(filtered.length>=1)identifyCandidates=filtered;
    }
  });
  showIdentifyStep(prevStep);
}

function identifySkip(){
  identifyStepHistory.push(identifyCurrentStep);
  const nextStep = identifyCurrentStep + 1;
  if(nextStep >= IDENTIFY_STEPS.length){
    showIdentifyResults();
  } else {
    showIdentifyStep(nextStep);
  }
}

function showIdentifyResults(){
  document.getElementById('identify-wizard').style.display='none';
  document.getElementById('identify-results').style.display='block';
  
  const count = identifyCandidates.length;
  const titleEl = document.getElementById('id-results-title');
  const subEl = document.getElementById('id-results-sub');
  
  if(count===0){
    titleEl.textContent='No exact matches found';
    subEl.textContent='Your stone may be rare, unlisted, or the answers may need adjustment. Try starting over with different selections.';
    document.getElementById('id-results-grid').innerHTML='<div class="empty-state">Try starting over and skipping the steps you\'re less certain about.</div>';
    return;
  }
  
  titleEl.textContent = count===1?'1 match found':count+' possible matches';
  subEl.textContent = count<=5?'These are your most likely candidates based on your answers.':'Tap any stone to see its full entry. Start with the most visually similar.';
  
  const grid = document.getElementById('id-results-grid');
  const display = identifyCandidates.slice(0,20);
  grid.innerHTML = display.map(c=>{
    const isOwned=!!owned[c.i],isWish=!!wish[c.i];
    const badge=isOwned?'<span class="card-badge badge-owned"></span>':(isWish?'<span class="card-badge badge-wish"></span>':'');
    const encPhotos=ENCYCLOPEDIA_PHOTOS[c.i];
    const imgZone=encPhotos
      ?`<div class="card-img-zone has-photo"><img src="${SUPABASE_ENC}${encPhotos[0]}" alt="${c.n}" loading="lazy"></div>`
      :noPhotoZoneHtml(c);
    const roles=[c.er1,c.er2].filter(Boolean).map(t=>`<span class="card-role">${t}</span>`).join('<span class="card-role-sep">·</span>');
    return`<div class="crystal-card" onclick="openDetailFromIdentify('${c.i}')">${badge}${imgZone}<div class="card-body"><div class="card-name">${c.n}</div><div class="card-color">${colorDotsHtml(c)}<span style="font-size:10.5px;color:var(--ink3);margin-left:3px">${c.c||''}</span></div>${roles?`<div>${roles}</div>`:''}</div></div>`;
  }).join('');
}

function openDetailFromIdentify(id){
  // Open detail drawer without switching tab
  openDetail(id);
}




// ── CRYSTALS 101 DATA ──
const C101_WATER = ["Angelite", "Black Kyanite", "Black Opal", "Blue Calcite", "Blue Fluorite", "Blue Halite", "Blue Kyanite", "Blue Opal", "Caribbean Calcite", "Chalcopyrite", "Cinnabar", "Clear Calcite", "Clear Fluorite", "Fire Opal", "Galena", "Green Calcite", "Green Fluorite", "Green Kyanite", "Green Opal", "Halite", "Honey Calcite", "Lapis Lazuli", "Lemurian Aquatine Calcite", "Lepidolite", "Malachite", "Mangano Calcite", "Opal", "Optical Calcite", "Orange Calcite", "Orange Kyanite", "Orange Selenite", "Pink Fluorite", "Pink Halite", "Pink Opal", "Purple Fluorite", "Pyrite", "Rainbow Fluorite", "Red Calcite", "Ruby in Kyanite", "Satin Spar Gypsum", "Selenite", "Teal Fluorite", "Turquoise", "White Kyanite", "White Opal", "Yellow Fluorite", "Zebra Calcite"];
const C101_SUN = ["Amethyst", "Aquamarine", "Black Amethyst", "Black Opal", "Blue Fluorite", "Blue Opal", "Blue Topaz", "Brandberg Amethyst", "Celestite", "Chevron Amethyst", "Clear Fluorite", "Fire Opal", "Green Fluorite", "Green Opal", "Imperial Topaz", "Kunzite", "Lavender Rose Quartz", "Opal", "Pink Fluorite", "Pink Opal", "Purple Fluorite", "Rainbow Fluorite", "Rose Quartz", "Teal Fluorite", "Topaz", "Vera Cruz Amethyst", "White Opal", "White Topaz", "Yellow Fluorite"];
const C101_CHAKRAS = [
    {name:'Root',color:'#8B2020',loc:'Base of spine',num:120,theme:'Safety, stability, physical health, belonging, survival instincts',imbalance:'Anxiety, disconnection from body, financial stress, feeling ungrounded'},
    {name:'Sacral',color:'#C45A10',loc:'Below the navel',num:37,theme:'Creativity, pleasure, emotional flow, sexuality, relationships',imbalance:'Creative blocks, emotional rigidity, guilt, numbness or overwhelm in feelings'},
    {name:'Solar Plexus',color:'#B8920A',loc:'Upper abdomen',num:74,theme:'Personal power, confidence, self-worth, will, digestion',imbalance:'Low self-esteem, powerlessness, people-pleasing, control issues'},
    {name:'Heart',color:'#2A7A3A',loc:'Center of chest',num:105,theme:'Love, compassion, grief, forgiveness, connection to others',imbalance:'Closed heart, resentment, codependency, difficulty giving or receiving love'},
    {name:'Throat',color:'#1A5A8A',loc:'Throat',num:54,theme:'Communication, truth, self-expression, listening, authenticity',imbalance:'Difficulty speaking up, fear of judgment, talking without listening, dishonesty'},
    {name:'Third Eye',color:'#3A2A8A',loc:'Between the eyebrows',num:121,theme:'Intuition, perception, imagination, inner vision, clarity',imbalance:'Mental fog, ignoring intuition, over-rationalization, poor memory'},
    {name:'Crown',color:'#6A3A9A',loc:'Top of head',num:122,theme:'Connection to the divine, expanded consciousness, spiritual purpose',imbalance:'Spiritual disconnection, cynicism, feeling meaningless, over-attachment to ego'},
    {name:'Earth Star',color:'#4A3525',loc:'Below the feet',num:6,theme:'Deep grounding, ancestral connection, earth anchoring, embodied safety',imbalance:'Feeling untethered, spiritually floaty, disconnected from place or body'},
];


const C101_FAMILIES=[["Quartz", 79, "The most abundant crystal family on Earth. Clear Quartz amplifies energy; colored varieties like Amethyst and Citrine carry their own distinct properties.", "Amplification · Clarity · Versatility", "Most varieties are durable (Mohs 7). Safe for water, sunlight, and most cleansing methods."], ["Feldspar", 9, "Includes Moonstone, Labradorite, and Sunstone. Known for adularescence \u2014 the inner glow that seems to move. Deeply connected to intuition and cycles.", "Intuition · Cycles · Inner light", "Mohs 6\u20136.5. Avoid harsh chemicals. Some varieties sensitive to sunlight over time."], ["Calcite", 13, "Soft, colorful, and energetically amplifying. Each color carries specific properties \u2014 orange for creativity, blue for calm, green for renewal. Easy to work with for beginners.", "Amplification · Emotional healing · Gentle energy", "Soft (Mohs 3). Do not use in water. Polish carefully."], ["Tourmaline", 6, "One of the most electrically active mineral families \u2014 tourmaline generates a charge when heated or compressed. Black Tourmaline is the premier protective stone.", "Protection · Grounding · Electromagnetic shielding", "Mohs 7\u20137.5. Generally durable. Black Tourmaline safe for most uses."], ["Garnet", 7, "A large family with many varieties \u2014 not just red. Known for passion, vitality, and grounding life-force energy. Almandine, Pyrope, and Grossular are all garnets.", "Vitality · Passion · Grounding", "Mohs 6.5\u20137.5. Generally durable and water-safe."], ["Jasper", 0, "A form of chalcedony, opaque and richly patterned. Nurturing, stabilizing stones that support endurance and connection to the earth.", "Grounding · Endurance · Nurturing", "Mohs 6.5\u20137. Durable and generally safe for all cleansing methods."], ["Obsidian", 6, "Volcanic glass \u2014 not technically a mineral but a natural glass formed from lava. Deeply protective and truth-revealing. Works fast and can be intense.", "Protection · Shadow work · Truth", "Mohs 5\u20135.5. Handle with care (sharp edges when fractured). Safe for water."], ["Agate", 0, "Banded chalcedony formed in cavities in volcanic rock. Stabilizing, grounding, and protective. Each variety has its own character depending on pattern and color.", "Stability · Grounding · Balance", "Mohs 7. Very durable. Safe for water and most cleansing."], ["Fluorite", 8, "Highly ordered crystal structure that makes it a powerful mental clarifier. Available in many colors; rainbow fluorite integrates all of them. Absorbs and neutralizes negative energy.", "Clarity · Mental focus · Neutralizing", "Soft (Mohs 4). Do not use in water. Sunlight may fade color over time."], ["Kyanite", 6, "One of the few stones said to never need cleansing \u2014 it doesn't accumulate negative energy. Available in blue, black, green, and orange. Aligns chakras automatically.", "Alignment · Communication · Self-cleansing", "Mohs 4.5\u20137 depending on direction. Handle carefully. Do not use in water."], ["Aragonite", 5, "A calcium carbonate mineral closely related to Calcite. Grounding, stabilizing, and supportive during stress. Star Aragonite radiates energy in all directions.", "Grounding · Patience · Stress relief", "Soft (Mohs 3.5\u20134). Do not use in water. Handle with care."], ["Opal", 7, "Unique structure that diffracts light into spectral colors. Amplifies emotions and traits \u2014 use intentionally. Ethiopian and Australian opals have different characters.", "Amplification · Emotion · Inspiration", "Soft (Mohs 5.5\u20136.5). Very water-sensitive \u2014 do not soak. Avoid heat and harsh light."]];
function set101StickyTop(){
  const sidebar = document.querySelector('.c101-sidebar');
  if(!sidebar || window.innerWidth <= 600) return;
  // Measure the sidebar's natural position BEFORE any scroll happens and lock it in
  requestAnimationFrame(function(){
    const top = sidebar.getBoundingClientRect().top;
    if(top > 0){
      sidebar.style.top = top + 'px';
      window._c101LayoutTop = top; // save for sidebar-click scroll target
    }
  });
}

function init101(){
  // If this is called from a restored tab before the later 101 constants have initialized,
  // retry after the script finishes instead of throwing and breaking the page.
  try { CRYSTAL_GRIDS; CRYSTAL_SHAPES; C101_FAM_DATA; } catch(e) { setTimeout(init101,0); return; }
  set101StickyTop();
  if(!window._101inited){
    window._101inited=true;
    initFamilies();
    renderShapes();
  } else {
    initFamilies();
    renderShapes();
  }
  init101Grids();
  // Restore last-viewed section within Crystals 101
  const saved101=(()=>{try{return localStorage.getItem('spl_101_section');}catch(e){return null;}})();
  if(saved101&&saved101!=='work'){
    const btn=document.querySelector(`.c101-sidebar-item[onclick*="${saved101}"]`);
    show101(saved101,btn);
  }
  // Water pills
  const wp = document.getElementById('water-pills');
  if(wp) wp.innerHTML = '';
  if(wp) C101_WATER.forEach(n=>{
    const p=document.createElement('span');
    p.className='stone-pill';p.textContent=n;
    p.onclick=()=>jumpToStone(n);wp.appendChild(p);
  });
  // Sun pills
  const sp = document.getElementById('sun-pills');
  if(sp) sp.innerHTML = '';
  if(sp) C101_SUN.forEach(n=>{
    const p=document.createElement('span');
    p.className='stone-pill';p.textContent=n;
    p.onclick=()=>jumpToStone(n);sp.appendChild(p);
  });
  // Chakra cards
  const cc = document.getElementById('chakra-cards');
  if(cc) cc.innerHTML = '';
  if(cc) C101_CHAKRAS.forEach(ch=>{
    const d=document.createElement('div');
    d.className='chakra-card';
    d.innerHTML=`<div class="chakra-name"><span class="chakra-dot" style="background:${ch.color}"></span>${ch.name}</div>
      <div class="chakra-loc">${ch.loc}</div>
      <div class="chakra-theme">${ch.theme}</div>
      <div class="chakra-count">${ch.num} stones in encyclopedia</div>
      <div class="chakra-imbalance">Signs of imbalance: ${ch.imbalance}</div>`;
    d.onclick=()=>jumpToChakra(ch.name);
    cc.appendChild(d);
  });
  // Family cards
  const fc = document.getElementById('fam-cards');
  if(fc) C101_FAMILIES.forEach(([name,count,desc,energy,care])=>{
    const d=document.createElement('div');
    d.className='fam-card';
    d.innerHTML=`<div class="fam-name">${name}</div>
      <div class="fam-count">${count} stones in encyclopedia</div>
      <div class="fam-desc">${desc}</div>
      ${energy?`<div class="fam-note">Energy: ${energy}</div>`:''}
      ${care?`<div class="fam-note">Care: ${care}</div>`:''}`;
    d.onclick=()=>jumpToFamily(name);
    d.title='View '+name+' stones in the encyclopedia';
    fc.appendChild(d);
  });
}

function ensure101BackTopButtons(){
  document.querySelectorAll('.c101-section').forEach(section=>{
    if(section.querySelector('.c101-backtop-wrap'))return;
    section.insertAdjacentHTML('beforeend','<div class="c101-backtop-wrap"><button class="c101-backtop" onclick="scrollTo101Top();return false;">Back to top</button></div>');
  });
}
function scrollTo101Top(){
  const nav=document.getElementById('c101-nav');
  const y=nav?nav.getBoundingClientRect().top+window.scrollY-96:0;
  try{window.scrollTo({top:Math.max(0,y),left:0,behavior:'smooth'});}catch(e){window.scrollTo(0,Math.max(0,y));}
}
function show101(sec,btn){
  ensure101BackTopButtons();
  try{localStorage.setItem('spl_101_section',sec);}catch(e){}
  document.querySelectorAll('.c101-section').forEach(s=>s.classList.remove('active'));
  document.querySelectorAll('.c101-sidebar-item').forEach(p=>p.classList.remove('active'));
  // Scroll so the layout top sits at the same position it naturally had on load
  const layout = document.querySelector('.c101-layout');
  if(layout){ const offset = window._c101LayoutTop || 180; const y = layout.getBoundingClientRect().top + window.scrollY - offset; window.scrollTo({top:Math.max(0,y),behavior:'smooth'}); }
  const section=document.getElementById('s101-'+sec);
  if(section)section.classList.add('active');
  const activeBtn=btn || (typeof event!=='undefined'&&event?event.target:null) || document.querySelector(`.c101-sidebar-item[onclick*="${sec}"]`);
  if(activeBtn)activeBtn.classList.add('active');
  if(sec==='grids')init101Grids();
  if(sec==='shapes'){renderShapes();requestAnimationFrame(function(){setTimeout(function(){if(window._updateShapeArrows)window._updateShapeArrows();},100);});}
  if(sec==='families')initFamilies();
}

function jumpToStone(name){
  switchTab('encyclopedia', document.querySelector('[onclick*=encyclopedia]'));
  setTimeout(()=>{
    resetEncyclopediaFiltersForJump();
    const searchEl = document.getElementById('enc-search');
    if(searchEl){ searchEl.value=name; searchEl.dispatchEvent(new Event('input')); }
    setTimeout(scrollToEncyclopediaResults, 150);
  },100);
}

function resetEncyclopediaFiltersForJump(){
  filters={fam:'all',theme:'all',color:'all',chakra:'all',mohs:'all',formation:'all',material:'all'};
  ['fam','theme','color','chakra','mohs','formation','material'].forEach(k=>{
    document.querySelectorAll('#pills-'+k+' .fpill').forEach(p=>p.classList.toggle('active',p.textContent.trim()==='All'));
    updateBtn('fbtn-'+k,'fval-'+k,'all');
  });
  const searchEl=document.getElementById('enc-search');
  if(searchEl)searchEl.value='';
}
function activateEncyclopediaFilter(key,val){
  filters[key]=val;
  const pills=document.querySelectorAll('#pills-'+key+' .fpill');
  pills.forEach(p=>p.classList.toggle('active',p.textContent.trim()===val));
  updateBtn('fbtn-'+key,'fval-'+key,val);
  closeAllPanels();
  encRender();
  setTimeout(scrollToEncyclopediaResults,120);
}
function scrollToEncyclopediaResults(){
  const el=document.getElementById('crystal-grid')||document.getElementById('enc-count')||document.getElementById('enc-search');
  if(!el)return;
  const y=el.getBoundingClientRect().top+window.scrollY-145;
  try{window.scrollTo({top:Math.max(0,y),left:0,behavior:'smooth'});}catch(e){window.scrollTo(0,Math.max(0,y));}
}
function jumpToFilteredEncyclopedia(key,val){
  switchTabByName('encyclopedia');
  setTimeout(()=>{
    resetEncyclopediaFiltersForJump();
    activateEncyclopediaFilter(key,val);
    setTimeout(scrollToEncyclopediaResults,180);
  },80);
}
function jumpToChakra(chakra){
  jumpToFilteredEncyclopedia('chakra',chakra);
}
function jumpToFamily(family){
  jumpToFilteredEncyclopedia('fam',family);
}
function jumpToTheme(theme){
  jumpToFilteredEncyclopedia('theme',theme);
}



// ── CARE SEARCH ──
const TOXIC_NOTES = {
  'Malachite':'Copper-based — toxic dust when dry-polished. Never use in water elixirs.',
  'Cinnabar':'Mercury sulfide — display only. Wash hands after handling.',
  'Galena':'Lead-based — wash hands after handling. Keep away from children.',
  'Pyrite':'Can release sulfuric acid when wet. Keep dry.',
  'Vanadinite':'Contains vanadium — handle finished specimens only. Wash hands.',
  'Chalcopyrite':'Copper-iron sulfide — keep dry, wash hands.',
};

function openEncLightbox(src, alt, e){
  if(e) e.stopPropagation();
  const lb = document.getElementById('enc-lightbox');
  const img = document.getElementById('enc-lightbox-img');
  const label = document.getElementById('enc-lightbox-label');
  if(!lb || !img) return;
  img.src = src;
  img.alt = alt || '';
  if(label){ label.textContent = alt || ''; label.style.display = alt ? 'block' : 'none'; }
  lb.classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeEncLightbox(){
  const lb = document.getElementById('enc-lightbox');
  if(lb) lb.classList.remove('open');
  document.body.style.overflow = '';
}
document.addEventListener('keydown', function(e){
  if(e.key === 'Escape') closeEncLightbox();
});

function toggleCareAccordion(hdr){
  const body = hdr.nextElementSibling;
  const isOpen = body.classList.contains('open');
  body.classList.toggle('open', !isOpen);
  hdr.classList.toggle('open', !isOpen);
  hdr.setAttribute('aria-expanded', String(!isOpen));
}

function runCareSearch(val){
  const result = document.getElementById('care-search-result');
  if(!val.trim()){ result.style.display='none'; return; }
  const q = val.toLowerCase().trim();
  const matches = CRYSTALS.filter(c => c.n.toLowerCase().includes(q));
  if(!matches.length){
    result.style.display='block';
    result.style.borderColor='var(--border)';
    result.innerHTML = `<span style="color:var(--ink3)">No stones found matching "<em>${val}</em>"</span>`;
    return;
  }
  const c = matches[0];
  const isWater = C101_WATER.includes(c.n);
  const isSun   = C101_SUN.includes(c.n);
  const toxNote = TOXIC_NOTES[c.n] || null;
  const allGood = !isWater && !isSun && !toxNote;

  let html = `<div style="font-size:14px;font-weight:500;color:var(--ink);margin-bottom:8px">${c.n}</div>`;
  if(allGood){
    html += `<div style="color:#3a6020">✓ Safe for water &nbsp;·&nbsp; ✓ Sun stable &nbsp;·&nbsp; ✓ No toxicity concerns</div>`;
  } else {
    if(isWater) html += `<div style="color:#8a3020;margin-bottom:4px">⚠ Keep dry — water sensitive</div>`;
    else        html += `<div style="color:#3a6020;margin-bottom:4px">✓ Safe for water</div>`;
    if(isSun)   html += `<div style="color:#8a6020;margin-bottom:4px">☀ Avoid extended sunlight — may fade</div>`;
    else        html += `<div style="color:#3a6020;margin-bottom:4px">✓ Sun stable</div>`;
    if(toxNote) html += `<div style="color:#8a3020;margin-bottom:4px">☠ Toxicity: ${toxNote}</div>`;
  }
  if(matches.length > 1){
    html += `<div style="margin-top:8px;font-size:11px;color:var(--ink3)">Also matched: ${matches.slice(1,4).map(x=>x.n).join(', ')}</div>`;
  }
  result.style.display='block';
  result.style.borderColor = allGood ? '#3a6020' : '#b04a4a';
  result.innerHTML = html;
}


// ── IDENTIFY V2 ──
var id2State={color:null,trans:null,luster:null,hard:null,heft:null};
const HEFT_FN={
  light:   c=>['Gypsum','Organic Material','Fossil Material'].includes(c.fam)||['Amber','Selenite','Satin Spar','Pumice','Desert Rose'].some(n=>c.n.includes(n)),
  heavy:   c=>['Iron Minerals','Sulfides'].includes(c.fam)||['Hematite','Pyrite','Galena','Magnetite','Lodestone','Chalcopyrite','Bismuth','Barite','Cassiterite'].some(n=>c.n.includes(n)),
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
const HARD_FN={
  delicate:c=>{const m=parseFloat(c.m);return m>0&&m<=4;},
  everyday:c=>{const m=parseFloat(c.m);return m>=4.5&&m<=6.5;},
  tough:   c=>{const m=parseFloat(c.m);return m>=7;},
};
function initId2(){
  const grid=document.getElementById('id2-colors');
  if(!grid)return;
  if(grid.children.length>0){runId2();return;}
  ID2_COLORS.forEach(col=>{
    const btn=document.createElement('button');
    btn.className='id2-color-btn'; btn.title=col.val;
    btn.style.cssText=`background:${col.hex};border:2.5px solid ${col.val==='White'?'var(--border)':'transparent'}`;
    btn.onclick=()=>{
      id2State.color=(id2State.color===col.val)?null:col.val;
      document.querySelectorAll('.id2-color-btn').forEach(b=>{b.classList.remove('active');b.style.border=b.title==='White'?'2.5px solid var(--border)':'2.5px solid transparent';});
      if(id2State.color)btn.classList.add('active');
      runId2();
    };
    grid.appendChild(btn);
  });
  runId2();
}
function setId2(type,val,el){
  const prev=id2State[type];
  id2State[type]=(prev===val)?null:val;
  el.closest('.id2-pills').querySelectorAll('.id2-pill').forEach(p=>p.classList.remove('active'));
  if(id2State[type])el.classList.add('active');
  runId2();
}
function runId2(){
  const results=CRYSTALS.filter(c=>{
    if(id2State.color&&!(c.col_cats&&c.col_cats.includes(id2State.color)))return false;
    if(id2State.trans){
      const m={Transparent:['Transparent','Transparent to Translucent'],Translucent:['Translucent','Transparent to Translucent','Translucent to Opaque'],Opaque:['Opaque','Translucent to Opaque']};
      if(!c.tr||!m[id2State.trans].some(v=>c.tr.includes(v)))return false;
    }
    if(id2State.luster&&LUSTER_FN[id2State.luster]&&!LUSTER_FN[id2State.luster](c))return false;
    if(id2State.hard&&HARD_FN[id2State.hard]&&!HARD_FN[id2State.hard](c))return false;
    if(id2State.heft&&HEFT_FN[id2State.heft]&&!HEFT_FN[id2State.heft](c))return false;
    return true;
  });
  const n=results.length;
  document.getElementById('id2-count').innerHTML=`<strong>${n}</strong> stone${n===1?'':'s'} match`;
  const g=document.getElementById('id2-grid');
  if(!n){g.innerHTML='<div class="id2-empty">No stones match — try removing a filter.</div>';return;}
  const owned=new Set((collection||[]).map(p=>p.crystalId));
  const wished=new Set(Object.keys(wish||{}));
  g.innerHTML=results.slice(0,72).map(c=>encCardHtml(c)).join('')+(results.length>72?`<div class="id2-empty" style="padding:1rem;font-size:12px">Showing 72 of ${results.length} — add a filter to narrow down.</div>`:'');
}
function clearId2(){
  id2State={color:null,trans:null,luster:null,hard:null,heft:null};
  document.querySelectorAll('.id2-color-btn').forEach(b=>{b.classList.remove('active');b.style.border=b.title==='White'?'2.5px solid var(--border)':'2.5px solid transparent';});
  document.querySelectorAll('.id2-pill').forEach(p=>p.classList.remove('active'));
  runId2();
}

// ── CRYSTAL FAMILIES DATA ──
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
  const filtered=C101_FAM_DATA.filter(f=>(tier==='all'||f.tier===tier)&&(!q||f.n.toLowerCase().includes(q.toLowerCase())||f.desc.toLowerCase().includes(q.toLowerCase())));
  if(!filtered.length){fc.innerHTML='<div style="color:var(--ink3);font-size:13px;grid-column:1/-1;padding:1rem">No families match.</div>';return;}
  fc.innerHTML=filtered.map(f=>{const cnt=window.FAM_COUNTS[f.n]||0;const fArg=jsArg(f.n);return`<div class="fam-card" data-family="${escapeAttr(f.n)}" onclick="jumpToFamily(${fArg});return false;" title="View ${escapeAttr(f.n)} stones in the encyclopedia"><div class="fam-name">${f.n}</div>${cnt?`<div class="fam-count">${cnt} stones in encyclopedia</div>`:''}<div class="fam-desc">${f.desc}</div>${f.energy?`<div class="fam-note"><strong style="color:var(--ink2)">Energy:</strong> ${f.energy}</div>`:''}<div class="fam-note"><strong style="color:var(--ink2)">Care:</strong> ${f.care}</div></div>`;}).join('');
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
    const allBtn=document.createElement('button');allBtn.className='c101-pill active';allBtn.textContent='All families';allBtn.onclick=()=>setFamTier('all',allBtn);nav.appendChild(allBtn);
    C101_TIERS.forEach(t=>{const btn=document.createElement('button');btn.className='c101-pill';btn.textContent=t.label;btn.onclick=()=>setFamTier(t.id,btn);nav.appendChild(btn);});
  }
  window.currentFamTier='all';renderFamilies('all');
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
        <div class="grid-card-mood">↗ Use When: ${moodLabel}</div>
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

const CRYSTAL_SHAPES = [
  {
    id: 'raw',
    name: 'Raw / Natural',
    tagline: 'Unfiltered, natural energy',
    body: 'Closest to how the stone formed. Energy radiates outward in all directions, unmodified. Most powerful for grounding, space-holding, and any work where you want the full unmediated quality of the stone. Less refined, but often more potent.',
    use: 'Grounding · Space clearing · Long-term placement · Altars',
    examples: ['Black Tourmaline', 'Selenite', 'Amethyst', 'Citrine'],
    draw: drawRawShape,
  },
  {
    id: 'tumbled',
    name: 'Tumbled',
    tagline: 'Polished, softened, accessible',
    body: 'Machine-polished until smooth. The energy is gentler and more diffuse than raw — easier to carry, hold, and work with daily. Ideal for beginners and for stones used in direct body contact. The most versatile and widely available form.',
    use: 'Daily carry · Body work · Grids · Gifting',
    examples: ['Rose Quartz', 'Carnelian', 'Labradorite', 'Obsidian'],
    draw: drawTumbledShape,
  },
  {
    id: 'palm',
    name: 'Palm Stone',
    tagline: 'Made for touch, somatic, grounding',
    body: 'Shaped to fit the palm — flat, smooth, slightly rounded. Direct skin contact amplifies the energetic exchange between stone and body. Ideal for nervous system work, anxiety, and any practice that benefits from physical sensation and presence.',
    use: 'Anxiety · Nervous system · Body presence · Meditation',
    examples: ['Lepidolite', 'Howlite', 'Rhodonite', 'Hematite'],
    draw: drawPalmShape,
  },
  {
    id: 'worry',
    name: 'Worry Stone',
    tagline: 'Repetitive touch, anxiety, presence',
    body: 'Flat oval with a thumb-sized indentation. Designed for repetitive rubbing — the physical repetition activates the parasympathetic nervous system and grounds attention in the body. A somatic tool as much as an energetic one. Keep one in a pocket.',
    use: 'Anxiety · Fidgeting · Grounding · Daily carry',
    examples: ['Howlite', 'Amethyst', 'Lepidolite', 'Sodalite'],
    draw: drawWorryShape,
  },
  {
    id: 'sphere',
    name: 'Sphere',
    tagline: 'Equal, continuous, panoramic',
    body: 'Emits energy equally in all directions — no point, no emphasis, no directionality. The most balanced form. Used in scrying, meditation, and spaces where you want steady ambient energy rather than focused projection.',
    use: 'Meditation · Scrying · Ambient energy · Balance work',
    examples: ['Clear Quartz', 'Rose Quartz', 'Obsidian', 'Labradorite'],
    draw: drawSphereShape,
  },
  {
    id: 'egg',
    name: 'Egg',
    tagline: 'New beginnings, fertility, grounding',
    body: 'The egg shape carries strong symbolism of new beginnings, potential, and fertility — and practically, the rounded base and tapered top create a natural energy concentration at the apex. Satisfying to hold and roll between the palms. Used in body work and new-chapter rituals.',
    use: 'New beginnings · Body rolling · Fertility · Transition work',
    examples: ['Rose Quartz', 'Obsidian', 'Malachite', 'Amazonite'],
    draw: drawEggShape,
  },
  {
    id: 'tower',
    name: 'Tower',
    tagline: 'Directed upward, projecting, anchoring',
    body: 'A flat-based, six-sided column that projects energy upward and outward continuously. Towers are among the most versatile forms — place them in a room to shift the ambient energy, use them in grids as anchor points, or hold during meditation. The flat base makes them stable and easy to place.',
    use: 'Room energy · Grids · Meditation · Intention setting',
    examples: ['Amethyst', 'Selenite', 'Labradorite', 'Black Tourmaline'],
    draw: drawPointShape,
  },
  {
    id: 'point',
    name: 'Point',
    tagline: 'Directed, focused, activating',
    body: 'A natural or cut termination that directs energy out through the apex. Used to direct intention, move energy in healing work, and activate crystal grids — touch each stone lightly with the point to connect them. Points can face inward (drawing energy toward you) or outward (projecting away).',
    use: 'Grid activation · Energy direction · Healing work · Amplification',
    examples: ['Clear Quartz', 'Amethyst', 'Citrine', 'Rose Quartz'],
    draw: drawPointShape,
  },
  {
    id: 'flame',
    name: 'Flame / Freeform',
    tagline: 'Organic, flowing, sculptural',
    body: 'Carved or naturally formed into a flame or free organic shape — no flat base, no hard geometry. Energy moves along the curves rather than projecting in a single direction. Each piece is unique. Used decoratively and energetically, often as a room centerpiece or meditation focal point.',
    use: 'Room presence · Meditation focus · Display · Transformation work',
    examples: ['Labradorite', 'Selenite', 'Rose Quartz', 'Malachite'],
    draw: drawFlameShape,
  },
  {
    id: 'pyramid',
    name: 'Pyramid',
    tagline: 'Concentrating, manifesting, anchoring',
    body: 'Four triangular faces meeting at an apex. Draws energy in through the base, concentrates and amplifies it, then projects upward through the point. Used in manifestation work, grid anchoring, and focusing intention. Connected to sacred geometry and ancient protective traditions.',
    use: 'Manifestation · Grid anchor · Intention amplification · Sacred space',
    examples: ['Citrine', 'Clear Quartz', 'Black Tourmaline', 'Pyrite'],
    draw: drawPyramidShape,
  },
  {
    id: 'cube',
    name: 'Cube',
    tagline: 'Grounding, structure, stability',
    body: 'Six equal faces representing perfect stability — the cube corresponds to the Earth element in sacred geometry. Places energy firmly on all six sides simultaneously. Used for grounding work, building stable foundations, and creating energetic structure in a space or intention.',
    use: 'Grounding · Structure · Earth element work · Stability',
    examples: ['Pyrite', 'Fluorite', 'Hematite', 'Black Tourmaline'],
    draw: drawCubeShape,
  },
  {
    id: 'heart',
    name: 'Heart',
    tagline: 'Emotional, receptive, heart-centered',
    body: 'Carved into a heart shape to concentrate and activate heart-center energy. The shape itself is an intention. Used in emotional healing, self-love practice, relationship work, and as a physical symbol of what you are working toward. Comforting to hold during difficult emotional work.',
    use: 'Heart healing · Self-love · Grief · Relationship intention',
    examples: ['Rose Quartz', 'Rhodonite', 'Green Aventurine', 'Malachite'],
    draw: drawHeartShape,
  },
  {
    id: 'moon',
    name: 'Moon',
    tagline: 'Cyclical, intuitive, feminine',
    body: 'Usually carved as a crescent. Strongly connected to lunar cycles, the feminine, and intuition. Used in moon rituals, cycle tracking, and any work tied to timing and rhythm — what to begin, what to release, what to allow to complete naturally. A powerful shape for water-sign energy.',
    use: 'Lunar rituals · Intuition · Feminine energy · Cyclical work',
    examples: ['Moonstone', 'Selenite', 'Labradorite', 'Amethyst'],
    draw: drawMoonShape,
  },
  {
    id: 'star',
    name: 'Star',
    tagline: 'Radiating, protection, divine connection',
    body: 'A five or six-pointed carved star. The radiating points send energy outward in multiple directions simultaneously — similar to a cluster, but intentionally geometric. Used in protection work, sacred space setting, and grid arrangements. The six-pointed star is particularly used in healing and balancing.',
    use: 'Protection · Grids · Sacred geometry · Radiating intention',
    examples: ['Clear Quartz', 'Black Tourmaline', 'Selenite', 'Pyrite'],
    draw: drawStarShape,
  },
  {
    id: 'slice',
    name: 'Slice / Slab',
    tagline: 'Display, altar, writing surface',
    body: 'A flat cross-section of a stone or geode, revealing the interior pattern. Used as altar bases, charging plates, display surfaces, and decorative pieces. Agate slices with natural banding are common; geode slices show the crystalline interior. Energy radiates from the flat face.',
    use: 'Altar base · Charging plate · Display · Space energy',
    examples: ['Agate', 'Amethyst', 'Selenite', 'Obsidian'],
    draw: drawSliceShape,
  },
  {
    id: 'cluster',
    name: 'Cluster',
    tagline: 'Radiating, communal, space-filling',
    body: 'Multiple points growing from a shared base. Each crystal in the cluster radiates in its own direction — the result is an omnidirectional broadcast. Excellent for spaces, rooms, and group settings. Clusters also continuously cleanse the energy around them and make impressive display pieces.',
    use: 'Room energy · Space cleansing · Group settings · Display',
    examples: ['Amethyst', 'Quartz', 'Celestite', 'Pyrite'],
    draw: drawClusterShape,
  },
  {
    id: 'druzy',
    name: 'Druzy',
    tagline: 'Amplifying surface, sparkle, coating',
    body: 'A surface covered in a layer of tiny, sparkling micro-crystals formed within a cavity or on a host stone. Not a carved shape but a natural formation. Amplifies the energy of whatever surrounds it, adds visual brilliance, and is commonly used in jewelry and decorative settings. Often found coating Agate or Chalcedony.',
    use: 'Amplification · Jewelry · Display · Enhancing other stones',
    examples: ['Druzy Agate', 'Grape Agate', 'Chalcopyrite', 'Uvarovite'],
    draw: drawDruzyShape,
  },
  {
    id: 'geode',
    name: 'Geode',
    tagline: 'Hidden interior, protective, amplifying',
    body: 'Unremarkable outside, crystalline interior. The hollow cavity amplifies and stores energy. Geodes protect what is inside — energetically and literally. A closed geode holds intention; an open geode broadcasts it. Excellent for spaces, altars, and long-term energetic work.',
    use: 'Space holding · Amplification · Protection · Altar',
    examples: ['Amethyst', 'Quartz', 'Celestite', 'Calcite'],
    draw: drawGeodeShape,
  },
  {
    id: 'wand',
    name: 'Wand',
    tagline: 'Channeling, directional, healing',
    body: 'Elongated and cylindrical, often with one pointed end. Wands channel and direct energy along their length — used in energy healing to move, clear, or focus energy in specific areas of the body or space. The pointed end sends energy; the rounded end receives.',
    use: 'Energy healing · Chakra work · Directing energy · Body work',
    examples: ['Selenite', 'Clear Quartz', 'Rose Quartz', 'Obsidian'],
    draw: drawWandShape,
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
const SHAPE_DISPLAY_ORDER = ['tumbled','palm','raw','flame','tower','point','sphere','egg','cluster','geode','slice','heart','moon','star','wand','worry','pyramid','cube','druzy'];

function renderShapes() {
  try { CRYSTAL_SHAPES; } catch(e) { setTimeout(renderShapes,0); return; }
  const container = document.getElementById('shapes-grid');
  if(!container) return;
  if(container.children.length > 0) return;

  const ordered = [...CRYSTAL_SHAPES].sort((a,b) => {
    const ai = SHAPE_DISPLAY_ORDER.indexOf(a.id);
    const bi = SHAPE_DISPLAY_ORDER.indexOf(b.id);
    return (ai === -1 ? 999 : ai) - (bi === -1 ? 999 : bi);
  });

  // Build horizontal strip
  const strip = document.createElement('div');
  strip.className = 'shapes-strip';

  // Build pane
  const pane = document.createElement('div');
  pane.className = 'shapes-pane';

  ordered.forEach((shape, i) => {
    const item = document.createElement('div');
    item.className = 'shape-strip-item' + (i === 0 ? ' active' : '');
    item.innerHTML = `<span class="shape-strip-icon">${shape.draw()}</span><span>${shape.name}</span>`;
    item.addEventListener('click', () => {
      strip.querySelectorAll('.shape-strip-item').forEach(el => el.classList.remove('active'));
      item.classList.add('active');
      showShapePane(shape, pane);
    });
    strip.appendChild(item);
  });

  // Wrap strip with scroll arrows
  const stripOuter = document.createElement('div');
  stripOuter.className = 'shapes-strip-outer';

  const chevL = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>`;
  const chevR = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>`;

  const arrowLeft = document.createElement('button');
  arrowLeft.className = 'shapes-scroll-arrow shapes-scroll-arrow--left';
  arrowLeft.innerHTML = chevL;
  arrowLeft.setAttribute('aria-label', 'Scroll left');
  arrowLeft.addEventListener('click', () => strip.scrollBy({left: -180, behavior: 'smooth'}));

  const arrowRight = document.createElement('button');
  arrowRight.className = 'shapes-scroll-arrow shapes-scroll-arrow--right visible';
  arrowRight.innerHTML = chevR;
  arrowRight.setAttribute('aria-label', 'Scroll right');
  arrowRight.addEventListener('click', () => strip.scrollBy({left: 180, behavior: 'smooth'}));

  function updateShapeArrows() {
    const atStart = strip.scrollLeft <= 2;
    const atEnd = strip.scrollLeft >= strip.scrollWidth - strip.clientWidth - 2;
    arrowLeft.classList.toggle('visible', !atStart);
    arrowRight.classList.toggle('visible', !atEnd);
  }
  strip.addEventListener('scroll', updateShapeArrows, {passive: true});
  // Can't measure scrollWidth while section is hidden — expose for call when section becomes visible
  window._updateShapeArrows = updateShapeArrows;

  stripOuter.appendChild(arrowLeft);
  stripOuter.appendChild(strip);
  stripOuter.appendChild(arrowRight);

  container.appendChild(stripOuter);
  container.appendChild(pane);

  // Show first shape by default
  showShapePane(ordered[0], pane);
}

function showShapePane(shape, pane) {
  pane.innerHTML = `
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
}





/* ── Supabase Client + Auth (from lines 6291–6735) ── */
const _supa = window.supabase.createClient(
  'https://vxujlgyhgnihnqrxzefw.supabase.co',
  'sb_publishable_LfVL1UL-_8_8hXQktiF1BQ_UgbWvAPb',
  {
    auth: {
      detectSessionInUrl: true,
      persistSession: true,
      autoRefreshToken: true
    }
  }
);

// ── Load stones from Supabase, then init app ──
loadStonesAndInit();

let _currentUser = null;
try{ ['lap_coll','lap_owned','lap_wish'].forEach(k=>localStorage.removeItem(k)); }catch(e){}

function _renderAuth(user) {
  const el = document.getElementById('topbar-auth');
  const manageBtn = document.getElementById('manage-btn');
  if(manageBtn) manageBtn.style.display = user ? '' : 'none';
  updateAdminEntryButtons();
  if (!el) return;
  if (user) {
    const name = user.email ? user.email.split('@')[0] : 'Account';
    el.innerHTML = '<span class="auth-user-name" title="'+user.email+'">'+name+'</span> <button class="auth-sign-out" onclick="_signOut()">Sign out</button>';
  } else {
    el.innerHTML = '<button class="btn btn-sm" onclick="_openAuth()">Sign in</button>';
  }
}

async function _authInit() {
  const { data: { session } } = await _supa.auth.getSession();
  _currentUser = session?.user ?? null;
  _renderAuth(_currentUser);
  if (_currentUser) { loadSupabaseState(); }
  _supa.auth.onAuthStateChange(function(_e, session) {
    _currentUser = session?.user ?? null;
    _renderAuth(_currentUser);
    if (_currentUser) { loadSupabaseState(); }
    if (_currentUser && window._pendingColl) {
      window._pendingColl = false;
      var t = document.querySelectorAll('.nav-tab')[2];
      if (t) switchTab('collection', t);
    }
  });
  var orig = window.switchTab;
  window.switchTab = function(name, btn) {
    if (name === 'collection' && !_currentUser) {
      window._pendingColl = true;
      _openAuth('collection');
      return;
    }
    orig(name, btn);
  };
}

function _openAuth(reason) {
  var title = document.getElementById('auth-modal-title');
  var sub = document.getElementById('auth-modal-sub');
  var msg = document.getElementById('auth-msg');
  var inp = document.getElementById('auth-email-input');
  var btn = document.getElementById('auth-submit-btn');
  if (reason === 'collection') {
    title.textContent = 'Sign in to use My Collection';
    sub.textContent = 'Your collection saves securely to your account and follows you across devices.';
  } else {
    title.textContent = 'Sign in to your collection';
    sub.textContent = "Enter your email and we'll send you a magic link — no password needed.";
  }
  msg.textContent = '';
  msg.style.color = '#8b7355';
  inp.value = '';
  btn.disabled = false;
  btn.textContent = 'Send magic link';
  document.getElementById('auth-modal-overlay').classList.add('open');
  setTimeout(function(){ inp.focus(); }, 80);
}

function closeAuthModal() {
  document.getElementById('auth-modal-overlay').classList.remove('open');
}

async function submitMagicLink() {
  var inp = document.getElementById('auth-email-input');
  var btn = document.getElementById('auth-submit-btn');
  var msg = document.getElementById('auth-msg');
  var email = (inp.value || '').trim().toLowerCase();
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    msg.textContent = 'Please enter a valid email address.';
    msg.style.color = '#c0392b';
    return;
  }
  btn.disabled = true;
  btn.textContent = 'Sending…';
  msg.textContent = '';
  var result = await _supa.auth.signInWithOtp({
    email: email,
    options: { emailRedirectTo: window.location.href }
  });
  if (result.error) {
    msg.textContent = result.error.message || 'Something went wrong. Please try again.';
    msg.style.color = '#c0392b';
    btn.disabled = false;
    btn.textContent = 'Send magic link';
  } else {
    msg.textContent = '✓ Check your email — link sent! Open it on this device.';
    msg.style.color = '#8b7355';
    btn.textContent = 'Link sent';
  }
}

async function _signOut() {
  await _supa.auth.signOut();
  _currentUser = null;
  collection=[]; owned={}; wish={};
  try{ ['lap_coll','lap_owned','lap_wish'].forEach(k=>localStorage.removeItem(k)); }catch(e){}
  _renderAuth(null);
  encRender();
}

// ── SUPABASE COLLECTION WRITE LAYER ──────────────────────────

// Load collection/wishlist state from Supabase when user logs in
function _priceToNumber(raw){
  const cleaned=String(raw||'').replace(/[^0-9.-]/g,'');
  if(!cleaned)return null;
  const n=Number(cleaned);
  return Number.isFinite(n)?n:null;
}
function _safeFileName(file,idx){
  const original=(file&&file.name?file.name:'photo-'+(idx+1)+'.jpg').toLowerCase();
  const clean=original.replace(/[^a-z0-9._-]+/g,'-').replace(/-+/g,'-').replace(/^-|-$/g,'');
  return clean || ('photo-'+(idx+1)+'.jpg');
}
async function _signedPhotoUrl(storagePath){
  if(!storagePath)return '';
  const { data, error } = await _supa.storage.from('collection-photos').createSignedUrl(storagePath, 60*60);
  if(error){ console.warn('Signed URL failed', error); return ''; }
  return data?.signedUrl || '';
}
async function _getSignedUrls(photoRows){
  const rows=(photoRows||[]).slice().sort((a,b)=>(a.display_order||0)-(b.display_order||0));
  const out=[];
  for(const row of rows){
    const url=await _signedPhotoUrl(row.storage_path);
    if(url)out.push({id:row.id,storage_path:row.storage_path,display_order:row.display_order,url});
  }
  return out;
}
function _rowToCollectionPiece(row,photos){
  return {
    id:row.id,
    crystalId:row.stone_id,
    isCombo:!!row.is_combo,
    comboCrystals:row.combo_stone_ids||[],
    comboCrystalNames:row.combo_stone_names||[],
    nickname:row.nickname||'',
    form:row.form_type||'',
    size:row.size||'',
    dims:'',
    treated:row.treatment||'',
    condition:row.condition||'',
    locCustom:row.location||'',
    shelf:'',tier:'',pos:'',
    acquired:row.acquired_date||'',
    source:row.acquired_from||'',
    price:row.price_paid==null?'':String(row.price_paid),
    notes:row.notes||'',
    photos:photos||[],
    _dbRow:row
  };
}
async function loadSupabaseState() {
  if (!_currentUser) return;

  const activeTab=document.querySelector('main>section[style*="block"]')?.id || '';
  const wrap=document.getElementById('coll-wrap');
  if(activeTab==='tab-collection' && wrap){
    wrap.innerHTML='<div class="empty-coll" style="opacity:0.5;font-size:12px">Syncing…</div>';
  }

  wish = {};
  owned = {};
  collection = [];

  const { data: wData, error: wErr } = await _supa
    .from('wishlist_items')
    .select('stone_id, notes')
    .eq('user_id', _currentUser.id);
  if (wErr) console.warn('Wishlist load failed', wErr);
  if (wData) wData.forEach(r => { wish[r.stone_id] = true; });

  const { data: cData, error: cErr } = await _supa
    .from('collection_items')
    .select('id,user_id,stone_id,form_type,size,notes,acquired_from,acquired_date,price_paid,created_at,updated_at,nickname,treatment,condition,location,is_combo,combo_stone_ids,combo_stone_names')
    .eq('user_id', _currentUser.id)
    .order('created_at',{ascending:false});
  if (cErr) {
    console.error('Collection load failed', cErr);
    alert('Collection could not load: '+cErr.message);
    return;
  }

  const ids=(cData||[]).map(r=>r.id);
  let photosByItem={};
  if(ids.length){
    const { data:pData, error:pErr } = await _supa
      .from('collection_photos')
      .select('id,collection_item_id,storage_path,display_order')
      .eq('user_id', _currentUser.id)
      .in('collection_item_id', ids)
      .order('display_order',{ascending:true});
    if (pErr) console.warn('Photo rows load failed', pErr);
    (pData||[]).forEach(p=>{
      if(!photosByItem[p.collection_item_id])photosByItem[p.collection_item_id]=[];
      photosByItem[p.collection_item_id].push(p);
    });
  }

  const pieceResults = await Promise.all(
    (cData||[]).map(async row => {
      owned[row.stone_id] = true;
      const urls = await _getSignedUrls(photosByItem[row.id]||[]);
      return _rowToCollectionPiece(row, urls);
    })
  );
  pieceResults.forEach(p => collection.push(p));

  localStorage.setItem('lap_owned', JSON.stringify(owned));
  localStorage.setItem('lap_wish', JSON.stringify(wish));
  encRender();
  renderCollection();
  const syncEl=document.getElementById('coll-sync-status');
  if(syncEl){const t=new Date().toLocaleTimeString([],{hour:'numeric',minute:'2-digit'});syncEl.textContent='Synced at '+t;syncEl.style.display='block';}
}

async function _uploadCollectionPhotos(collectionItemId,photos,startOrder){
  const uploaded=[];
  const items=(photos||[]).slice(0,3);
  const base=Number.isFinite(Number(startOrder))?Number(startOrder):1;
  for(let i=0;i<items.length;i++){
    const item=items[i];
    const file=item.file || item;
    if(!(file instanceof File))continue;
    const path=`${_currentUser.id}/${collectionItemId}/${Date.now()}-${i+1}-${_safeFileName(file,i)}`;
    const { error: upErr } = await _supa.storage
      .from('collection-photos')
      .upload(path, file, { cacheControl:'3600', upsert:false, contentType:file.type || 'image/jpeg' });
    if(upErr) throw upErr;
    const { data:photoRow, error: rowErr } = await _supa.from('collection_photos').insert({
      collection_item_id: collectionItemId,
      user_id: _currentUser.id,
      storage_path: path,
      display_order: base+i
    }).select('id,storage_path,display_order').single();
    if(rowErr) throw rowErr;
    uploaded.push({...photoRow,_pendingId:item._pendingId||null});
  }
  return uploaded;
}
async function _applyPrimaryPhotoOrder(collectionItemId,photoRows,primaryKey){
  const rows=(photoRows||[]).filter(r=>r&&r.id);
  if(!rows.length)return;
  const sorted=rows.slice().sort((a,b)=>{
    const ka=photoKey(a,'existing',0), kb=photoKey(b,'existing',0);
    if(primaryKey&&ka===primaryKey)return-1;
    if(primaryKey&&kb===primaryKey)return 1;
    return (a.display_order||0)-(b.display_order||0);
  });
  for(let i=0;i<sorted.length;i++){
    const { error } = await _supa.from('collection_photos')
      .update({display_order:i+1})
      .eq('user_id',_currentUser.id)
      .eq('collection_item_id',collectionItemId)
      .eq('id',sorted[i].id);
    if(error)throw error;
  }
}


function _isBlankCollectionPieceForUpgrade(p,stoneId){
  if(!p||!stoneId||p.crystalId!==stoneId)return false;
  const hasPhotos=Array.isArray(p.photos)&&p.photos.length>0;
  const meaningful=[p.nickname,p.form,p.size,p.treated,p.condition,p.locCustom,p.shelf,p.tier,p.pos,p.acquired,p.source,p.price,p.notes].some(v=>String(v||'').trim());
  const hasCombo=!!p.isCombo || ((p.comboCrystals||[]).length>0) || ((p.comboCrystalNames||[]).length>0);
  return !hasPhotos&&!meaningful&&!hasCombo;
}
function _findBlankCollectionPieceIndex(stoneId){
  if(!stoneId)return -1;
  return collection.findIndex(p=>_isBlankCollectionPieceForUpgrade(p,stoneId));
}
function _switchToCollectionAndMaybeOpen(pieceId){
  switchTabByName('collection');
  scrollPageTop();
  setTimeout(()=>{
    renderCollection();
    if(pieceId!==null&&pieceId!==undefined){
      const idx=collection.findIndex(p=>String(p.id)===String(pieceId));
      if(idx>=0)openCollDetail(idx);
    }
  },0);
}


window.savePiece = async function(){
  if(!_currentUser){ _openAuth('collection'); return; }
  const crystalId=document.getElementById('f-crystal-val')?.value||'';
  if(!crystalId){ alert('Please select a primary crystal.'); return; }

  const isCombo=document.getElementById('f-combo')?.checked||false;
  const comboIdsRaw=isCombo?Array.from(document.querySelectorAll('.csel')).map(s=>s.value).filter(Boolean):[];
  const comboIds=[...new Set(comboIdsRaw)].filter(id=>id!==crystalId).slice(0,3);
  const comboNames=comboIds.map(id=>CRYSTALS.find(c=>c.i===id)?.n||'').filter(Boolean);

  const payload={
    user_id:_currentUser.id,
    stone_id:crystalId,
    form_type:document.getElementById('f-form')?.value||null,
    size:document.getElementById('f-size')?.value||null,
    notes:document.getElementById('f-notes')?.value?.trim()||null,
    acquired_from:document.getElementById('f-source')?.value?.trim()||null,
    acquired_date:document.getElementById('f-acquired')?.value||null,
    price_paid:_priceToNumber(document.getElementById('f-price')?.value),
    nickname:document.getElementById('f-nick')?.value?.trim()||null,
    treatment:document.getElementById('f-treated')?.value||null,
    condition:document.getElementById('f-condition')?.value||null,
    location:document.getElementById('f-loc-custom')?.value?.trim()||null,
    is_combo:isCombo && comboIds.length>0,
    combo_stone_ids:comboIds,
    combo_stone_names:comboNames
  };

  const saveBtn=document.querySelector('#add-form-overlay .form-footer .btn-accent');
  const oldText=saveBtn?saveBtn.textContent:'';
  if(saveBtn){ saveBtn.disabled=true; saveBtn.textContent='Saving…'; }
  let savedPieceId=null;
  try{
    let editingPiece=(editingCollectionIndex!==null)?collection[editingCollectionIndex]:null;

    // If the user reached this form from an encyclopedia entry after toggling/adding the stone,
    // upgrade the blank placeholder row instead of creating a second minimal record.
    if(!editingPiece && addPieceReturnContext && addPieceReturnContext.type==='encyclopedia'){
      const blankIdx=_findBlankCollectionPieceIndex(crystalId);
      if(blankIdx>=0){
        editingCollectionIndex=blankIdx;
        editingPiece=collection[blankIdx];
      }
    }

    if(editingPiece&&editingPiece.id){
      savedPieceId=editingPiece.id;
      const { error } = await _supa
        .from('collection_items')
        .update(payload)
        .eq('user_id', _currentUser.id)
        .eq('id', editingPiece.id);
      if(error)throw error;
      const existingPhotos=(editingPiece.photos||[]).slice(0,3);
      const remaining=Math.max(0,3-existingPhotos.length);
      let uploadedRows=[];
      if(pendingPhotos.length&&remaining>0){
        uploadedRows=await _uploadCollectionPhotos(editingPiece.id,pendingPhotos.slice(0,remaining),existingPhotos.length+1);
      }
      const allPhotoRows=[...existingPhotos,...uploadedRows];
      let primaryKey=editPrimaryPhotoKey;
      const pendingPrimary=uploadedRows.find(r=>r._pendingId&&r._pendingId===editPrimaryPhotoKey);
      if(pendingPrimary)primaryKey=photoKey(pendingPrimary,'existing',0);
      if(primaryKey){ await _applyPrimaryPhotoOrder(editingPiece.id,allPhotoRows,primaryKey); }
    }else{
      const { data, error } = await _supa
        .from('collection_items')
        .insert(payload)
        .select('id')
        .single();
      if(error)throw error;
      savedPieceId=data.id;
      let uploadedRows=[];
      if(pendingPhotos.length){ uploadedRows=await _uploadCollectionPhotos(data.id,pendingPhotos,1); }
      let primaryKey=editPrimaryPhotoKey;
      const pendingPrimary=uploadedRows.find(r=>r._pendingId&&r._pendingId===editPrimaryPhotoKey);
      if(pendingPrimary)primaryKey=photoKey(pendingPrimary,'existing',0);
      if(primaryKey){ await _applyPrimaryPhotoOrder(data.id,uploadedRows,primaryKey); }
    }
    closeAddForm();
    addPieceReturnContext=null;
    await loadSupabaseState();
    updateLastSaved();
    _switchToCollectionAndMaybeOpen(savedPieceId);
  }catch(err){
    console.error('Save piece failed', err);
    alert('Could not save piece: '+(err.message||err));
  }finally{
    if(saveBtn){ saveBtn.disabled=false; saveBtn.textContent=oldText||'Save piece'; }
  }
};

window.toggleOwned = async function() {
  if (!currentCrystal) return;
  const stoneId = currentCrystal.i;
  if (!_currentUser) { _openAuth('collection'); return; }
  const isOwned = !!owned[stoneId];
  if (isOwned) {
    await _supa.from('collection_items').delete().eq('user_id', _currentUser.id).eq('stone_id', stoneId);
  } else {
    await _supa.from('collection_items').insert({ user_id: _currentUser.id, stone_id: stoneId });
  }
  await loadSupabaseState();
  updateDrawerStatus(stoneId);
  encRender();
};

window.toggleWish = async function() {
  if (!currentCrystal) return;
  const stoneId = currentCrystal.i;
  if (!_currentUser) { _openAuth('collection'); return; }
  const isWished = !!wish[stoneId];
  if (isWished) {
    await _supa.from('wishlist_items').delete().eq('user_id', _currentUser.id).eq('stone_id', stoneId);
    delete wish[stoneId];
  } else {
    await _supa.from('wishlist_items').insert({ user_id: _currentUser.id, stone_id: stoneId });
    wish[stoneId] = true;
  }
  localStorage.setItem('lap_wish', JSON.stringify(wish));
  updateDrawerStatus(stoneId);
  renderCollection();
  encRender();
};

_supa.auth.onAuthStateChange(function(_e, session) {
  const wasLoggedOut = !_currentUser;
  _currentUser = session?.user ?? null;
  _renderAuth(_currentUser);
  if (_currentUser && wasLoggedOut) { loadSupabaseState(); }
  if (_currentUser && window._pendingColl) {
    window._pendingColl = false;
    var t = document.querySelectorAll('.nav-tab')[2];
    if (t) switchTab('collection', t);
  }
});
_authInit();

/* ── Nav / Click Hardening (from lines 6737–6878) ── */
/* ── PRE-PASS REPAIR 5: targeted navigation + click hardening ── */
(function(){
  function safeScrollTo(el, offset){
    if(!el)return;
    const y = el.getBoundingClientRect().top + window.scrollY - (offset || 128);
    try{ window.scrollTo({top:Math.max(0,y), left:0, behavior:'smooth'}); }
    catch(e){ window.scrollTo(0, Math.max(0,y)); }
  }
  function encSearchEl(){ return document.getElementById('enc-search') || document.getElementById('enc-count') || document.getElementById('crystal-grid'); }
  window.scrollToFullEncyclopedia = function(){ safeScrollTo(document.querySelector('.featured-divider') || encSearchEl(), 165); };
  window.scrollToEncyclopediaResults = function(){ safeScrollTo(encSearchEl(), 130); };
  window.scrollToTabTop = function(name){
    if(name === '101'){
      safeScrollTo(document.getElementById('c101-nav') || document.getElementById('tab-101'), 112);
      return;
    }
    safeScrollTo(document.getElementById('tab-'+name) || document.querySelector('main.content'), 112);
  };
  window.scrollTo101Top = function(){ safeScrollTo(document.getElementById('c101-nav') || document.getElementById('tab-101'), 112); };

  function resetEncFiltersSafe(){
    if(typeof resetEncyclopediaFiltersForJump === 'function'){
      resetEncyclopediaFiltersForJump();
      return;
    }
    if(typeof filters === 'object'){
      filters={fam:'all',theme:'all',color:'all',chakra:'all',mohs:'all',formation:'all',material:'all'};
    }
    const s=document.getElementById('enc-search');
    if(s)s.value='';
  }
  window.jumpToFilteredEncyclopedia = function(key,val){
    if(typeof switchTabByName === 'function') switchTabByName('encyclopedia');
    else if(typeof switchTab === 'function') switchTab('encyclopedia', document.querySelectorAll('.nav-tab')[0]);
    setTimeout(function(){
      resetEncFiltersSafe();
      if(typeof activateEncyclopediaFilter === 'function'){
        activateEncyclopediaFilter(key,val);
      }else{
        if(typeof filters === 'object') filters[key]=val;
        if(typeof encRender === 'function') encRender();
      }
      setTimeout(window.scrollToEncyclopediaResults, 80);
    },80);
  };
  window.jumpToChakra = function(chakra){ window.jumpToFilteredEncyclopedia('chakra', chakra); };
  window.jumpToFamily = function(family){ window.jumpToFilteredEncyclopedia('fam', family); };

  try{
    initId2 = function(){
      const grid=document.getElementById('id2-colors');
      if(!grid)return;
      grid.innerHTML='';
      ID2_COLORS.forEach(function(col){
        const btn=document.createElement('button');
        btn.className='id2-color-btn';
        btn.title=col.val;
        btn.setAttribute('aria-label', col.val);
        btn.style.cssText='background:'+col.hex+';border:2.5px solid '+(col.val==='White'?'var(--border)':'transparent');
        btn.onclick=function(){
          id2State.color=(id2State.color===col.val)?null:col.val;
          document.querySelectorAll('.id2-color-btn').forEach(function(b){
            b.classList.remove('active');
            b.style.border=b.title==='White'?'2.5px solid var(--border)':'2.5px solid transparent';
          });
          if(id2State.color)btn.classList.add('active');
          if(typeof runId2==='function')runId2();
        };
        grid.appendChild(btn);
      });
      if(typeof runId2==='function')runId2();
    };
  }catch(e){}

  function stampCrystalCards(){
    document.querySelectorAll('#crystal-grid .crystal-card, #id2-grid .crystal-card').forEach(function(card){
      if(card.dataset.crystalId)return;
      const name=(card.querySelector('.card-name')||{}).textContent || '';
      if(!name || typeof CRYSTALS === 'undefined')return;
      const match=CRYSTALS.find(function(c){return c.n===name.trim();});
      if(match)card.dataset.crystalId=match.i;
    });
  }
  try{
    const oldEncRender=encRender;
    encRender=function(){ oldEncRender(); stampCrystalCards(); };
  }catch(e){}
  try{
    const oldRunId2=runId2;
    runId2=function(){ oldRunId2(); stampCrystalCards(); };
  }catch(e){}

  document.addEventListener('click', function(e){
    const famCard=e.target.closest && e.target.closest('#fam-cards .fam-card');
    if(famCard){
      const fam=famCard.getAttribute('data-family') || (famCard.querySelector('.fam-name')||{}).textContent;
      if(fam){ e.preventDefault(); e.stopPropagation(); window.jumpToFamily(fam.trim()); return; }
    }
    const chakraCard=e.target.closest && e.target.closest('#chakra-cards .chakra-card');
    if(chakraCard){
      const name=(chakraCard.querySelector('.chakra-name')||{}).textContent;
      if(name){ e.preventDefault(); e.stopPropagation(); window.jumpToChakra(name.trim()); return; }
    }
    const card=e.target.closest && e.target.closest('#crystal-grid .crystal-card, #id2-grid .crystal-card');
    if(card){
      // Let image zone clicks fall through to its own onclick (lightbox)
      if(e.target.closest('.card-img-zone')) return;
      const id=card.dataset.crystalId;
      if(id && typeof openDetail==='function'){
        e.preventDefault(); e.stopPropagation();
        openDetail(id);
        return;
      }
    }
    const back=e.target.closest && e.target.closest('.c101-backtop');
    if(back){
      e.preventDefault();
      e.stopPropagation();
      if(back.closest('#tab-101')) window.scrollTo101Top();
      else {
        const tab=back.closest('main > section[id^="tab-"]');
        if(tab && tab.id) window.scrollToTabTop(tab.id.replace('tab-',''));
        else window.scrollTo({top:0,left:0,behavior:'smooth'});
      }
      return;
    }
  }, true);

  document.addEventListener('DOMContentLoaded', function(){
    stampCrystalCards();
    if(document.getElementById('tab-identify')?.style.display !== 'none'){
      try{ initId2(); }catch(e){}
    }
  });
  setTimeout(function(){
    stampCrystalCards();
    const grid=document.getElementById('id2-colors');
    if(grid && !grid.children.length){ try{ initId2(); }catch(e){} }
  },250);
})();

/* ── Scroll Fixes (from lines 6882–7127) ── */
/* ── PRE-PASS TINYFIX 7: contained repairs only ── */
(function(){
  function safeScrollTo(el, offset){
    if(!el)return;
    const y=el.getBoundingClientRect().top+window.scrollY-(offset||118);
    try{window.scrollTo({top:Math.max(0,y),left:0,behavior:'smooth'});}catch(e){window.scrollTo(0,Math.max(0,y));}
  }

  // Quiet styling tweaks only.
  const style=document.createElement('style');
  style.textContent=`
    .mood-selected-clear{font-size:12.5px!important;color:var(--ink)!important;font-weight:500;letter-spacing:0.02em;}
    #mood-stone-grid .crystal-card{min-height:100%;}
    .c101-backtop-wrap{display:flex!important;justify-content:center!important;margin:2rem 0 0!important;}
  `;
  document.head.appendChild(style);

  // Remove the decorative dot before selected filter values. It was reading like punctuation.
  window.updateBtn=function(btnId,valId,val){
    const btn=document.getElementById(btnId);
    const valEl=document.getElementById(valId);
    if(btn)btn.classList.toggle('has-val',val!=='all');
    if(valEl)valEl.textContent=val==='all'?'':String(val);
  };

  // Make every Crystals 101 subtab carry a working Back to top button, including How to Work.
  function ensure101BackButtons(){
    document.querySelectorAll('#tab-101 .c101-section').forEach(function(section){
      if(!section.querySelector(':scope > .c101-backtop-wrap')){
        section.insertAdjacentHTML('beforeend','<div class="c101-backtop-wrap"><button type="button" class="c101-backtop">Back to top</button></div>');
      }
    });
  }
  window.scrollTo101Top=function(){
    try{window.scrollTo({top:0,left:0,behavior:'smooth'});}catch(e){window.scrollTo(0,0);}
  };
  const oldShow101=window.show101;
  if(typeof oldShow101==='function'){
    window.show101=function(sec,btn){
      const result=oldShow101.apply(this,arguments);
      ensure101BackButtons();
      return result;
    };
  }
  document.addEventListener('click',function(e){
    const back=e.target.closest&&e.target.closest('#tab-101 .c101-backtop');
    if(!back)return;
    e.preventDefault();
    e.stopPropagation();
    window.scrollTo101Top();
  },true);
  document.addEventListener('DOMContentLoaded',ensure101BackButtons);
  setTimeout(ensure101BackButtons,300);

  // Rotate AI search placeholder so repeat visitors see fresh prompts.
  (function(){
    const prompts=[
      'I want a stone for fresh energy, focus, and momentum…',
      'Something to help me feel calm and centered…',
      'I\'m ready for a new chapter and want support…',
      'I want to feel more grounded and present…',
      'A stone for creativity and inspired thinking…',
      'Something to help me feel more confident…',
      'I want to open my heart and attract more love…',
      'I want to attract more abundance and opportunity…',
      'Something for clarity when I have a big decision…',
      'I want to feel more joy and lightness…',
      'A stone to help me trust my intuition…',
      'Something to bring more peace into my home…',
    ];
    let pi=0;
    function rotatePlaceholder(){
      const el=document.getElementById('ai-search-input');
      if(!el||document.activeElement===el)return;
      pi=(pi+1)%prompts.length;
      el.placeholder=prompts[pi];
    }
    setInterval(rotatePlaceholder,4000);
  })();

  // Use When result stones now use the same card format/photos as Full Encyclopedia.
  window.renderMoodStones=function(moodIdx,subFilter){
    const matches=getMoodMatches(moodIdx,subFilter);
    const grid=document.getElementById('mood-stone-grid');
    const countEl=document.getElementById('mood-results-count');
    const selectedView=document.getElementById('mood-selected-view');
    if(selectedView)selectedView.style.display='block';
    if(grid)grid.style.display='grid';
    if(countEl)countEl.textContent=matches.length+' stones'+(subFilter?' · '+subFilter:'');
    if(!grid)return;
    if(!matches.length){grid.innerHTML='<div class="empty-state">No stones match this combination.</div>';return;}
    const moodGrid=typeof CRYSTAL_GRIDS!=='undefined'&&CRYSTAL_GRIDS.find(g=>(g.moodLinks||[g.moodLink]).includes(moodIdx));
    const gridBanner=document.getElementById('mood-grid-banner');
    if(gridBanner){
      if(moodGrid){
        gridBanner.style.display='block';
        gridBanner.innerHTML=`<div style="margin-top:1rem;padding:0.75rem 1rem;background:var(--stone2);border-radius:8px;display:flex;align-items:center;justify-content:space-between;gap:1rem"><span style="font-size:13px;color:var(--ink2)">There is a grid for this intention.</span><button class="btn btn-sm" onclick="switchTab('101',document.querySelectorAll('.nav-tab')[4]);setTimeout(()=>{show101('grids');openGridModal('${moodGrid.id}');},400)">View ${moodGrid.name} →</button></div>`;
      }else{gridBanner.style.display='none';}
    }
    grid.innerHTML=matches.map(function(c){
      // Build card html but replace the bare openDetail call with one that sets return context
      const raw=encCardHtml(c);
      return raw.replace(/onclick="openDetail\(/,'onclick="detailReturnContext={type:\'usewhen\'};openDetail(');
    }).join('');
  };

  // Helpers for My Collection filters across My Pieces, Families, and Wishlist.
  function passesCollStoneFilters(c){
    return !!c &&
      (collFilters.cfam==='all'||c.fam===collFilters.cfam||c.sp===collFilters.cfam)&&
      collectionStoneMatchesTheme(c,collFilters.ctheme)&&
      collectionStoneMatchesColor(c,collFilters.ccolor)&&
      collectionStoneMatchesChakra(c,collFilters.cchakra)&&
      collectionStoneMatchesMohs(c,collFilters.cmohs)&&
      collectionStoneMatchesFormation(c,collFilters.cformation)&&
      collectionStoneMatchesMaterial(c,collFilters.cmaterial);
  }
  function passesCollPieceFilters(p){
    const loc=p.shelf||p.locCustom||'';
    return (collFilters.form==='all'||p.form===collFilters.form)&&
      (collFilters.size==='all'||p.size===collFilters.size)&&
      (collFilters.cshelf==='all'||loc.includes(collFilters.cshelf));
  }

  window.renderCollection=function(){
    buildCollPanels();
    if(typeof initCollectionFilterDelegation==='function')initCollectionFilterDelegation();
    const displayCollection=dedupedCollectionItems(collection);
    const st=document.getElementById('stat-total');
    const sv=document.getElementById('stat-var');
    const sw=document.getElementById('stat-wish');
    if(st)st.textContent=displayCollection.length;
    if(sv)sv.textContent=new Set(displayCollection.map(p=>{const c=CRYSTALS.find(x=>x.i===p.crystalId);return c?.fam||c?.sp||'Other';}).filter(Boolean)).size;
    if(sw)sw.textContent=Object.keys(wish).length;
    const wrap=document.getElementById('coll-wrap');
    if(!wrap)return;

    if(collQuickFilter==='wish'){
      const wishIds=Object.keys(wish);
      let wishCrystals=CRYSTALS.filter(c=>wishIds.includes(c.i));
      wishCrystals=wishCrystals.filter(c=>passesCollStoneFilters(c));
      if(!wishCrystals.length){
        wrap.innerHTML=wishIds.length?'<div class="empty-coll">No wishlist items match your filters.</div>':_emptyWishHtml();
        return;
      }
      wrap.innerHTML='<div class="coll-grid">'+wishCrystals.map(c=>`<div class="coll-card" onclick="viewEncyclopediaFromWishlist('${c.i}')">
        ${wishlistCardPhotoHtml(c)}
        <div class="coll-card-name">${escapeAttr(c.n)}</div>
        <div class="coll-card-meta">${escapeAttr([c.er1,c.er2,c.er3].filter(Boolean).join(' · '))}</div>
      </div>`).join('')+'</div>';
      return;
    }

    if(collQuickFilter==='families'){
      const groups={};
      displayCollection.forEach(p=>{
        const c=CRYSTALS.find(x=>x.i===p.crystalId);
        if(!c||!passesCollStoneFilters(c)||!passesCollPieceFilters(p))return;
        const fam=c?.fam||c?.sp||'Other';
        if(!groups[fam])groups[fam]=[];
        groups[fam].push({piece:p,crystal:c});
      });
      const fams=Object.keys(groups).sort((a,b)=>a.localeCompare(b));
      if(!fams.length){
        wrap.innerHTML=displayCollection.length?'<div class="empty-coll">No families match your filters.</div>':_emptyCollHtml();
        return;
      }
      collFamilyPhotoSources={};
      wrap.innerHTML='<div class="coll-grid">'+fams.map(fam=>{
        const entries=groups[fam];
        const names=[...new Set(entries.map(x=>x.crystal?.n||'Unknown'))].slice(0,4).join(' · ');
        const count=entries.length;
        const photoHtml=familyCardPhotoHtml(fam,entries);
        return`<div class="coll-card" onclick="openFamilyDetail('${fam.replace(/'/g,"\\'")}')" >
          ${photoHtml}
          <div class="coll-card-name">${escapeAttr(fam)}</div>
          <div class="coll-card-piece-count">${count} ${count===1?'piece':'pieces'}</div>
          <div class="coll-card-meta">${escapeAttr(names)}</div>
          <div class="coll-card-loc">Tap to view family</div>
        </div>`;
      }).join('')+'</div>';
      return;
    }
    
if(collQuickFilter==='__family__'){
  const fam=collActiveFamilyName;
  const items=displayCollection.filter(p=>{
    const c=CRYSTALS.find(x=>x.i===p.crystalId);
    return (c?.fam===fam||c?.sp===fam)&&passesCollPieceFilters(p);
  });
  if(!items.length){
    wrap.innerHTML=`<div class="empty-coll">No pieces found in ${fam}.</div>`;
    return;
  }
  wrap.innerHTML=
    `<div id="fam-detail-banner" style="display:flex;align-items:center;gap:10px;margin-bottom:1rem;padding:8px 12px;background:var(--stone2);border-radius:8px;font-family:Jost,sans-serif;font-size:12px;letter-spacing:0.06em;text-transform:uppercase;color:var(--ink2)">
      <button onclick="setCollQuickFilter('families')" style="background:none;border:none;cursor:pointer;font-family:Jost,sans-serif;font-size:12px;letter-spacing:0.06em;text-transform:uppercase;color:var(--accent);padding:0">← All Families</button>
      <span style="color:var(--ink3)">·</span>
      <span>${escapeAttr(fam)}</span>
      <span style="color:var(--ink3);margin-left:4px">${items.length} ${items.length===1?'piece':'pieces'}</span>
    </div>
    <div class="coll-grid">`+
    items.map(p=>{
      const c=CRYSTALS.find(x=>x.i===p.crystalId);
      const name=p.nickname||(p.isCombo?'Combo piece':(c?.n||'Unknown'));
      const locParts=[p.locCustom,p.shelf,p.tier,p.pos].filter(Boolean);
      const loc=locParts.slice(0,2).join(' · ');
      const ri=collection.indexOf(p);
      const photoHtml=collectionCardPhotoHtml(p,c,name,ri);
      return`<div class="coll-card" onclick="openCollDetailFromFamily(${ri},'${fam.replace(/'/g,"\\'")}')">${photoHtml}<div class="coll-card-name">${escapeAttr(name)}</div><div class="coll-card-meta">${escapeAttr(c?.n||'')} ${p.size?'· '+escapeAttr(p.size):''}</div><div class="coll-card-loc">${escapeAttr(loc)}</div></div>`;
    }).join('')+
    `</div>`;
  return;
}
    
    const items=displayCollection.filter(p=>{
      const c=CRYSTALS.find(x=>x.i===p.crystalId);
      return passesCollStoneFilters(c)&&passesCollPieceFilters(p);
    });
    if(!items.length){
      wrap.innerHTML=displayCollection.length?'<div class="empty-coll">No pieces match your filters.</div>':_emptyCollHtml();
      return;
    }
    wrap.innerHTML='<div class="coll-grid">'+items.map(p=>{
      const c=CRYSTALS.find(x=>x.i===p.crystalId);
      const name=p.nickname||(p.isCombo?'Combo piece':(c?.n||'Unknown'));
      const locParts=[p.locCustom,p.shelf,p.tier,p.pos].filter(Boolean);
      const loc=locParts.slice(0,2).join(' · ');
      const ri=collection.indexOf(p);
      const photoHtml=collectionCardPhotoHtml(p,c,name,ri);
      return`<div class="coll-card" onclick="openCollDetail(${ri})">${photoHtml}<div class="coll-card-name">${escapeAttr(name)}</div><div class="coll-card-meta">${escapeAttr(c?.n||'')} ${p.size?'· '+escapeAttr(p.size):''}</div><div class="coll-card-loc">${escapeAttr(loc)}</div></div>`;
    }).join('')+'</div>';
  };

  // Strengthen collection filter pill clicks after the render override.
  document.addEventListener('click',function(e){
    const pill=e.target.closest&&e.target.closest('#collection-filter-shell .filter-panel .fpill');
    if(!pill)return;
    const panel=pill.closest('.filter-panel');
    if(!panel||!panel.id||!panel.id.startsWith('cpanel-'))return;
    e.preventDefault();e.stopPropagation();
    const key=panel.id.replace('cpanel-','');
    const raw=pill.getAttribute('data-value')||pill.textContent.trim();
    const val=raw==='All'?'all':raw;
    setCollFilter(key,val,pill);
  },true);
})();

