-- Batch 1: enc_collector_notes — Hematite, Moonstone, Sodalite, Malachite, Sunstone
-- icon_slug left null; template falls back to icon-bookmark

INSERT INTO enc_collector_notes (stone_id, title, body, icon_slug, display_order) VALUES

-- HEMATITE (4 notes)
('C-0041', 'The Red Streak',
  $$Metallic gray specimens leave a reddish-brown streak, a useful field clue that reveals Hematite's iron-oxide identity even when the surface appears nearly black.$$,
  null, 1),
('C-0041', 'Magnetic Hematite Warning',
  $$Natural Hematite is only weakly magnetic. Strongly magnetic beads and carvings are commonly manufactured iron-based material marketed as hematine or magnetic hematite.$$,
  null, 2),
('C-0041', 'Many Collector Forms',
  $$Collectors encounter mirror-bright specularite, rounded kidney ore, botryoidal masses, earthy red ochre, and martite pseudomorphs after Magnetite.$$,
  null, 3),
('C-0041', 'An Ancient Pigment',
  $$Finely powdered Hematite supplied durable red ochre pigment long before metallic specimens became popular as jewelry and display minerals.$$,
  null, 4),

-- MOONSTONE (4 notes)
('C-0162', 'A Feldspar Effect',
  $$Moonstone is defined by adularescence, the floating glow created by light scattering through thin feldspar layers rather than by one fixed mineral species.$$,
  null, 1),
('C-0162', 'Rainbow Moonstone Is Different',
  $$Material sold as Rainbow Moonstone is commonly transparent white Labradorite. Its multicolored labradorescence differs from traditional Moonstone's softer blue-white adularescence.$$,
  null, 2),
('C-0162', 'A Sacred Stone of India',
  $$Moonstone has a long history in Indian jewelry and spiritual tradition, while Western Art Nouveau jewelers helped popularize its dreamlike sheen.$$,
  null, 3),
('C-0162', 'Quality Lives in the Glow',
  $$Collector value rises with a strong, centered sheen, pleasing body color, transparency, and a cut oriented to display the optical effect without obvious fractures.$$,
  null, 4),

-- SODALITE (4 notes)
('C-0218', 'Princess Sodalite',
  $$Ontario's famous material gained its nickname after the Princess of Wales admired it in 1901 and stone was quarried for decoration at Marlborough House.$$,
  null, 1),
('C-0218', 'Not Lapis Lazuli',
  $$Sodalite usually shows white Calcite veining and lacks the abundant Pyrite flecks typical of Lapis Lazuli, though both belong to the wider Sodalite mineral family.$$,
  null, 2),
('C-0218', 'Hackmanite Connection',
  $$Hackmanite is a sulfur-bearing Sodalite variety known for tenebrescence, a reversible color change triggered by ultraviolet exposure.$$,
  null, 3),
('C-0218', 'A Useful White Streak',
  $$Despite its blue body color, Sodalite leaves a white streak. This can help separate it from some blue pigments, dyed materials, and look-alikes.$$,
  null, 4),

-- MALACHITE (4 notes)
('C-0020', 'Every Band Is Different',
  $$Its concentric, fibrous, and botryoidal growth creates distinctive banding. Natural patterns should look irregular rather than mechanically repeated.$$,
  null, 1),
('C-0020', 'Copper-Mine Classic',
  $$Malachite forms in the oxidized zones of copper deposits and often appears with Azurite, Chrysocolla, Cuprite, and native Copper.$$,
  null, 2),
('C-0020', 'Pigment and Ornament',
  $$The stone was ground for green pigment and carved for decorative objects long before large polished freeforms entered the modern collector market.$$,
  null, 3),
('C-0020', 'Imitations Are Common',
  $$Reconstituted powder, resin composites, dyed substitutes, and molded imitations may show uniform stripes, repeated patterns, or suspiciously light weight.$$,
  null, 4),

-- SUNSTONE (4 notes)
('C-0029', 'Several Feldspars, One Name',
  $$Sunstone can occur in different feldspar hosts, including Oligoclase and Labradorite, so composition and crystal system depend on the actual material.$$,
  null, 1),
('C-0029', 'What Makes It Sparkle',
  $$Aventurescence comes from oriented reflective inclusions, often Hematite, Ilmenite, or native Copper, rather than from surface glitter.$$,
  null, 2),
('C-0029', 'Oregon''s Copper Sunstone',
  $$Oregon Sunstone is commonly copper-bearing Labradorite and may show red, green, or bicolored zones prized by gem collectors.$$,
  null, 3),
('C-0029', 'Do Not Confuse It with Goldstone',
  $$Goldstone is manufactured glass filled with Copper crystals. Its dense, evenly distributed sparkle differs from natural feldspar aventurescence.$$,
  null, 4);
