-- Batch 1: enc_stone_content — Hematite, Moonstone, Sodalite, Malachite, Sunstone
-- published = false on all rows; Christie flips after visual QA

INSERT INTO enc_stone_content (
  stone_id, slug, collection_label, signature_line,
  pill_1, pill_2, pill_3,
  best_for, use_when, affirmation, image_alt,
  overview_p1, overview_p2, formation,
  collector_context_p1, collector_context_p2, collector_context_p3,
  nav_prev_slug, nav_prev_name, nav_next_slug, nav_next_name,
  energetic_role, energetic_role_icon,
  chakra_primary, chakra_secondary,
  element, planet, zodiac, color_energy,
  published
) VALUES

-- HEMATITE
(
  'C-0041', 'hematite', 'Essentials',
  $$Iron-rich grounding for returning scattered attention to the body and the task at hand.$$,
  'Grounding', 'Embodiment', 'Stability',
  $$Regaining stability, strengthening focus, and returning attention to practical reality$$,
  $$Your thoughts feel scattered, your footing feels uncertain, or the next practical step has become difficult to see.$$,
  $$I am grounded, steady, and fully present in my life.$$,
  $$Polished Hematite specimen with a dark metallic silver surface and dense reflective luster$$,
  $$Hematite is an iron oxide mineral known for its substantial weight, metallic gray surface, and diagnostic reddish-brown streak. It forms in settings ranging from sedimentary iron formations and hydrothermal veins to metamorphic rocks and volcanic environments. Collector material may be mirror-bright, botryoidal, earthy, or shaped into polished beads and carvings. Natural specimens are generally untreated, but strongly magnetic products sold as "magnetic hematite" are commonly manufactured iron-based material rather than natural hematite.$$,
  $$Hematite is the stone of grounding, embodiment, and practical steadiness. Its tradition centers on drawing attention out of mental overactivity and back toward the body, present circumstances, and concrete responsibilities. Root Chakra and Earth associations reinforce stability, while its Mars correspondence adds resolve and purposeful action. The emphasis is not passive stillness, but becoming centered enough to think clearly, hold a position, and take the next realistic step.$$,
  $$Hematite forms in several geological environments, including banded iron formations, hydrothermal veins, metamorphic rocks, volcanic settings, and oxidation zones. Its iron-oxide composition produces both the metallic gray appearance of many specimens and the reddish-brown streak seen in powdered material. Natural Hematite is not routinely treated, but manufactured magnetic material is widely sold under Hematite-adjacent names.$$,
  $$Look for strong metallic luster, well-developed crystal form, crisp botryoidal surfaces, or an attractive polished finish without excessive bruising. Specular plates, kidney ore, earthy red material, and martite pseudomorphs each have different collector appeal, so quality should be judged within the form rather than by shine alone.$$,
  $$Natural Hematite leaves a reddish-brown streak and is only weakly magnetic. Strongly magnetic beads, carvings, and polished shapes are commonly manufactured iron-based material sold as hematine or magnetic hematite. Magnetite is naturally more magnetic, while dark metallic coatings and molded products may imitate Hematite's appearance.$$,
  $$Ordinary polished pieces are widely available and usually affordable. Collector value rises for exceptional crystal form, bright specular luster, undamaged botryoidal growth, unusual pseudomorphs, historic localities, or specimens with strong provenance. Size alone does not establish rarity or quality.$$,
  'heliodor', 'Heliodor', 'hematoid-quartz', 'Hematoid Quartz',
  'Grounding', null, 'Root', null,
  'Earth', 'Mars', $$Aries · Aquarius$$, 'Metallic Silver',
  false
),

-- MOONSTONE
(
  'C-0162', 'moonstone', 'Essentials',
  $$Lunar feldspar for trusting inner rhythms, honoring change, and beginning again with intuition.$$,
  'Intuition', 'Balance', 'Dreams',
  $$Strengthening intuition, honoring natural cycles, and navigating change with greater inner trust$$,
  $$Life is shifting and you need to listen inward rather than force an immediate answer.$$,
  $$I trust my inner rhythm and welcome what is unfolding.$$,
  $$Polished Moonstone with a creamy translucent body and a soft floating blue-white sheen$$,
  $$Moonstone is a feldspar variety defined by adularescence, the floating light effect created when illumination scatters through fine internal layers. Traditional material is commonly associated with alkali feldspar, while commercial "moonstone" can span different feldspar hosts. Body color may be colorless, cream, peach, gray, or brown, with a white or blue sheen. Most material is untreated, although fracture filling and assembled imitations have been documented. Rainbow Moonstone is usually white Labradorite and should not be treated as identical to traditional Moonstone.$$,
  $$Moonstone is the stone of intuition, cycles, and receptive change. Its tradition encourages listening for timing, recognizing recurring patterns, and allowing insight to emerge without forcing certainty. Crown and Third Eye associations support inward perception, while the Heart adds emotional balance and self-trust. New beginnings are central here, but not as abrupt reinvention. The emphasis is on moving with change, honoring what is ending, and beginning again in a way that feels aligned with one's deeper rhythm.$$,
  $$Moonstone develops when feldspar separates into fine internal layers during slow cooling. Light scattering through those layers creates adularescence, the floating sheen that defines the variety. Because commercial Moonstone may come from more than one feldspar host, no single formula or crystal system applies universally. Most material is untreated, but fracture filling and assembled imitations occur in the market.$$,
  $$Look for a strong, centered sheen that moves cleanly across the surface, pleasing body color, and a cut oriented to display the optical effect. Transparency, attractive color, and minimal distracting fractures can raise value, but a bright, well-positioned glow matters more than size alone.$$,
  $$Rainbow Moonstone is commonly white Labradorite with multicolored labradorescence, while traditional Moonstone usually shows a softer white or blue adularescence. Glass, assembled material, and other feldspars may imitate the effect. Host identity and treatment status can be difficult to determine from appearance alone.$$,
  $$Commercial material ranges from affordable pale cabochons to fine transparent stones with vivid blue sheen. Sri Lankan material has long held prestige, but attractive specimens also come from India, Myanmar, Madagascar, Tanzania, and the United States. Value rises sharply with clarity, orientation, intensity, and centered movement of the sheen.$$,
  'mookaite-jasper', 'Mookaite Jasper', 'morganite', 'Morganite',
  'Intuition', null, 'Crown', $$Third Eye · Heart$$,
  'Water', 'Moon', $$Cancer · Libra$$, 'Cream / Ivory',
  false
),

-- SODALITE
(
  'C-0218', 'sodalite', 'Essentials',
  $$Deep-blue clarity for organizing thought, integrating logic with intuition, and speaking what is true.$$,
  'Clarity', 'Communication', 'Truth',
  $$Organizing thoughts, communicating clearly, and balancing logic with intuitive understanding$$,
  $$Your thoughts feel tangled or you need to express a difficult idea with precision and honesty.$$,
  $$My mind is clear, and I speak with truth and purpose.$$,
  $$Polished Sodalite with deep blue color, white calcite veining, and a softly mottled surface$$,
  $$Sodalite is a sodium-rich aluminosilicate mineral best known for deep blue color broken by white calcite veining. It forms primarily in silica-poor alkaline igneous rocks such as nepheline syenite and may occur with other feldspathoid minerals. Most natural material is opaque to translucent and has a vitreous to greasy luster. Ordinary Sodalite is generally untreated, but dyed pale materials and other blue substitutes can enter the market. It is often confused with Lapis Lazuli, which is a multi-mineral rock and commonly includes visible Pyrite.$$,
  $$Sodalite is the stone of mental synthesis, logical-intuitive integration, and truthful communication. Its Clarity & Focus role is expressed through bringing analysis, observation, intuition, and pattern recognition into a coherent understanding. The Third Eye supports insight and the ability to perceive how separate ideas connect, while the Throat Chakra carries that understanding outward through clear, honest expression. Its center is not concentration alone, but the disciplined movement from information, to insight, to language precise enough to communicate what has been understood.$$,
  $$Sodalite forms mainly in silica-undersaturated alkaline igneous rocks, especially nepheline syenites, and in related metasomatic environments. Its blue color is tied to sulfur-bearing components within the crystal structure, while white areas are commonly Calcite. Natural material is usually untreated, though dyed porous stones and other blue materials may be sold as Sodalite or used to imitate it.$$,
  $$Look for saturated blue color, pleasing contrast with white veining, a sound polish, and patterning that feels natural rather than mechanically uniform. Large decorative material is common, so value depends more on color, pattern, finish, locality, and unusual associated minerals than on size alone.$$,
  $$Lapis Lazuli is the most familiar look-alike, but it is a rock rather than a single mineral and often contains Pyrite. Dyed Howlite, Magnesite, Calcite, and pale porous materials may imitate Sodalite. Hackmanite is a sulfur-bearing Sodalite variety known for reversible color change under ultraviolet exposure.$$,
  $$Commercial Sodalite is widely available as tumbles, beads, carvings, slabs, and ornamental stone. Most material is affordable, while collector premiums may apply to vivid blue specimens, distinct crystal form, tenebrescent Hackmanite, historic localities, or attractive associations from alkaline mineral complexes.$$,
  'snowflake-obsidian', 'Snowflake Obsidian', 'spectrolite', 'Spectrolite',
  'Clarity & Focus', null, 'Throat', 'Third Eye',
  'Air', 'Jupiter', 'Sagittarius', 'Deep Blue',
  false
),

-- MALACHITE
(
  'C-0020', 'malachite', 'Essentials',
  $$Banded green transformation for confronting old patterns and choosing courageous change.$$,
  'Transformation', 'Courage', 'Protection',
  $$Breaking entrenched patterns, facing necessary change, and moving forward with courage$$,
  $$Avoiding the truth has become harder than facing the change that needs to happen.$$,
  $$I meet change with courage and choose the path of growth.$$,
  $$Polished Malachite with vivid green concentric banding and dark curved patterning$$,
  $$Malachite is a copper carbonate hydroxide mineral recognized by vivid green color and curved, concentric, or fibrous banding. It forms in the oxidized zones of copper deposits, often with Azurite, Chrysocolla, Cuprite, and native Copper. Natural material is soft and may be porous or fractured. Wax, oil, resin, or polymer impregnation may improve durability or finish, while reconstructed powder, molded resin composites, and dyed substitutes are common enough that pattern, weight, polish, and disclosure all matter.$$,
  $$Malachite is the stone of transformation through courageous right action, personal responsibility, and conscious leadership. Its tradition centers on recognizing what must change, strengthening the will to respond, and choosing actions aligned with emotional truth rather than avoidance or impulse. The Heart Chakra keeps transformation connected to values and integrity, while the Solar Plexus adds confidence, resolve, and accountability. Protection is present as discernment and self-command, helping a person meet difficult circumstances with greater clarity, responsibility, and purpose.$$,
  $$Malachite forms as a secondary mineral in oxidized copper deposits, where copper-bearing fluids react with carbonate-rich conditions near the surface. Fibrous, botryoidal, mammillary, crust-forming, and banded habits are common, and it may replace Azurite. Wax, oil, resin, or polymer stabilization may be used on porous or fractured material, while reconstructed and imitation products are widespread.$$,
  $$Look for rich green color, natural variation in band width, crisp concentric or fibrous patterning, and a strong polish without obvious resin pooling or repeated molded designs. Large decorative pieces are common, so quality depends more on pattern, condition, treatment disclosure, and provenance than size alone.$$,
  $$Reconstructed powder, resin composites, dyed substitutes, and molded imitations may show mechanically repeated stripes, uniform color, suspiciously light weight, or a plastic surface. Natural banding is irregular and responds to the stone's growth geometry rather than repeating like printed fabric.$$,
  $$Ordinary tumbles and carvings are widely available, while collector value rises for exceptional botryoidal surfaces, velvety fibers, polished stalactitic sections, historic locality material, or specimens associated with Azurite, Chrysocolla, Cuprite, or native Copper. Treatment and repair should be disclosed because they can affect both value and care.$$,
  'mahogany-obsidian', 'Mahogany Obsidian', 'mangano-calcite', 'Mangano Calcite',
  'Transformation', null, 'Heart', 'Solar Plexus',
  'Fire', 'Venus', $$Scorpio · Capricorn$$, 'Vivid Green',
  false
),

-- SUNSTONE
(
  'C-0029', 'sunstone', 'Essentials',
  $$Light-filled feldspar for reclaiming confidence, acting independently, and choosing wholehearted engagement.$$,
  'Confidence', 'Joy', 'Independence',
  $$Restoring vitality, building confidence, and moving through life with greater independence$$,
  $$Hesitation, self-doubt, or depleted enthusiasm is keeping you from taking up space and moving forward.$$,
  $$I act with confidence, warmth, and joyful purpose.$$,
  $$Polished Sunstone with warm peach-orange color and bright reflective aventurescence$$,
  $$Sunstone is a feldspar variety whose reflective aventurescence comes from oriented inclusions such as Hematite, Ilmenite, or native Copper. The commercial name can apply to several feldspar hosts, including Oligoclase and Labradorite, so no single formula or crystal system describes every specimen. Oregon Sunstone is commonly copper-bearing Labradorite and may display red, green, peach, or bicolored zones. Most ordinary material is untreated, but diffusion-treated feldspar, irradiation-colored stones, fracture filling, and manufactured Goldstone create important identification and disclosure concerns.$$,
  $$Sunstone is the stone of vitality, confidence, and independent action. Its tradition encourages a warmer relationship with visibility, leadership, pleasure, and personal authority. Sacral Chakra associations bring creative movement and engagement, while the Solar Plexus adds resolve and self-direction. Joy here is not passive cheerfulness. It is the willingness to participate, choose, initiate, and take up appropriate space without waiting for perfect certainty or external permission.$$,
  $$Sunstone forms when reflective platelets or crystals become oriented within feldspar during growth and cooling. Hematite, Ilmenite, and native Copper can each produce aventurescence, while the host may be Oligoclase, Labradorite, Orthoclase, Microcline, or Albite. Most material is untreated, but copper diffusion, irradiation-related color modification, fracture filling, and manufactured glass imitations require careful disclosure.$$,
  $$Look for lively aventurescence that moves with the stone, pleasing body color, good transparency where appropriate, and a cut oriented to display reflective inclusions. Oregon material may command premiums for vivid red, green, or bicolored color, but saturation alone should not replace treatment disclosure and provenance.$$,
  $$Goldstone is manufactured glass filled with Copper crystals and usually shows dense, evenly distributed sparkle. Natural Sunstone tends to show directional aventurescence tied to internal inclusions and feldspar structure. Different host feldspars may also look and behave differently, so trade-name identification should not be mistaken for a single mineral species.$$,
  $$Commercial Indian Sunstone is widely available and usually affordable, while fine Oregon material can be significantly more valuable. Price rises with attractive color, transparency, strong oriented aventurescence, size, cut, documented origin, and natural untreated status. Unusually saturated red or green material deserves careful verification.$$,
  'sulfur', 'Sulfur', 'super-seven', 'Super Seven',
  'Vitality', null, 'Sacral', 'Solar Plexus',
  'Fire', 'Sun', $$Leo · Libra$$, 'Iridescent',
  false
);
