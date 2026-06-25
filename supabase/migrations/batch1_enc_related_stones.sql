-- Batch 1: enc_related_stones — Hematite, Moonstone, Sodalite, Malachite, Sunstone
-- group values: 'similar' | 'pairs'
-- 2 similar + 2 pairs per stone = 4 rows each = 20 rows total

INSERT INTO enc_related_stones (stone_id, "group", related_slug, related_name, reason, display_order) VALUES

-- HEMATITE
('C-0041', 'similar', 'smoky-quartz',    'Smoky Quartz',    $$Offers similarly steady grounding with a gentler, more spacious feel and less emphasis on embodiment.$$, 1),
('C-0041', 'similar', 'red-jasper',      'Red Jasper',      $$Shares earthy stability and practical endurance while adding warmth, stamina, and sustained forward movement.$$, 2),
('C-0041', 'pairs',   'clear-quartz',    'Clear Quartz',    $$Adds clarity and amplification to this stone's dense, stabilizing presence without replacing its grounding function.$$, 1),
('C-0041', 'pairs',   'black-tourmaline','Black Tourmaline', $$Combines firm energetic boundaries with the anchoring quality here for environments that feel scattered or intrusive.$$, 2),

-- MOONSTONE
('C-0162', 'similar', 'labradorite',      'Labradorite',      $$Shares feldspar shimmer and intuitive depth, but expresses it through transformation and protective mystery rather than lunar cycles.$$, 1),
('C-0162', 'similar', 'rainbow-moonstone','Rainbow Moonstone', $$Provides a brighter, multicolored feldspar counterpart with similar intuitive and transitional associations.$$, 2),
('C-0162', 'pairs',   'rose-quartz',      'Rose Quartz',      $$Softens the inward, cyclical quality here with compassion, self-kindness, and relational warmth.$$, 1),
('C-0162', 'pairs',   'sunstone',         'Sunstone',         $$Balances receptive lunar awareness with confidence, vitality, independence, and outward action.$$, 2),

-- SODALITE
('C-0218', 'similar', 'lapis-lazuli',   'Lapis Lazuli',   $$Shares truth and clear expression, but places greater weight on wisdom, symbolism, and articulate insight.$$, 1),
('C-0218', 'similar', 'blue-lace-agate','Blue Lace Agate', $$Offers a softer communication-centered alternative when reassurance and calm matter more than logical integration.$$, 2),
('C-0218', 'pairs',   'clear-quartz',   'Clear Quartz',   $$Sharpens focus and helps carry a clear intention through study, planning, or communication work.$$, 1),
('C-0218', 'pairs',   'carnelian',      'Carnelian',      $$Adds courage and outward momentum when clear thinking must become confident speech or decisive action.$$, 2),

-- MALACHITE
('C-0020', 'similar', 'moldavite',       'Moldavite',       $$Shares an uncompromising transformation theme, with a faster and more catalytic spiritual emphasis.$$, 1),
('C-0020', 'similar', 'labradorite',     'Labradorite',     $$Supports change and self-discovery with a more protective, intuitive, and gradually unfolding character.$$, 2),
('C-0020', 'pairs',   'rose-quartz',     'Rose Quartz',     $$Adds compassion and emotional gentleness to the direct pattern-breaking and growth work here.$$, 1),
('C-0020', 'pairs',   'black-tourmaline','Black Tourmaline', $$Provides firm grounding and boundaries when transformative work feels intense or exposing.$$, 2),

-- SUNSTONE
('C-0029', 'similar', 'carnelian',       'Carnelian',       $$Shares vitality, confidence, and creative drive with a steadier, more grounded emphasis on action.$$, 1),
('C-0029', 'similar', 'citrine',         'Citrine',         $$Offers similarly bright confidence and momentum while leaning more strongly toward abundance and manifestation.$$, 2),
('C-0029', 'pairs',   'moonstone',       'Moonstone',       $$Balances outward confidence with receptivity, intuition, cycles, and inward listening.$$, 1),
('C-0029', 'pairs',   'black-tourmaline','Black Tourmaline', $$Adds grounding and protective structure so enthusiasm can become sustained, practical action.$$, 2);
