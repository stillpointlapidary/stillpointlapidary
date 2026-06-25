-- Batch 1: enc_care — Hematite, Moonstone, Sodalite, Malachite, Sunstone
-- Always exactly 4 rows per stone in fixed order: Cleaning, Water, Light & Heat, Storage

INSERT INTO enc_care (stone_id, category, body, display_order) VALUES

-- HEMATITE
('C-0041', 'Cleaning',    $$Wipe with a soft dry or slightly damp cloth; use mild soap only when needed and dry promptly.$$, 1),
('C-0041', 'Water',       $$Brief contact with water is generally acceptable, but avoid soaking pieces with fractures, porous matrix, or attached labels.$$, 2),
('C-0041', 'Light & Heat',$$Ordinary light is stable; avoid strong heat and rapid temperature changes that may stress fractured or matrix specimens.$$, 3),
('C-0041', 'Storage',     $$Store separately from softer stones and keep dry, especially for specimens with mixed iron minerals or unstable matrix.$$, 4),

-- MOONSTONE
('C-0162', 'Cleaning',    $$Clean with warm water, mild soap, and a soft cloth or brush; avoid ultrasonic and steam cleaning.$$, 1),
('C-0162', 'Water',       $$Brief gentle washing is suitable, but do not soak fracture-filled, assembled, or heavily included pieces.$$, 2),
('C-0162', 'Light & Heat',$$Protect from high heat, thermal shock, and prolonged intense light; feldspar cleavage makes sudden temperature change risky.$$, 3),
('C-0162', 'Storage',     $$Store in a padded compartment away from harder gems and protect rings from knocks along cleavage directions.$$, 4),

-- SODALITE
('C-0218', 'Cleaning',    $$Clean with lukewarm water, mild soap, and a soft cloth; avoid harsh chemicals, ultrasonic cleaners, and steam.$$, 1),
('C-0218', 'Water',       $$Brief washing is acceptable for untreated material, but avoid soaking because Calcite-rich areas and dyed or composite pieces may respond unevenly.$$, 2),
('C-0218', 'Light & Heat',$$Keep away from prolonged intense sunlight when tenebrescent Hackmanite is involved; avoid high heat and sudden temperature changes.$$, 3),
('C-0218', 'Storage',     $$Store separately from harder stones to reduce scratching and protect polished surfaces and Calcite-rich veins from impact.$$, 4),

-- MALACHITE
('C-0020', 'Cleaning',    $$Use a soft damp cloth and mild soap sparingly; never use acids, ammonia, ultrasonic cleaners, steam, or abrasive compounds.$$, 1),
('C-0020', 'Water',       $$Avoid soaking. Malachite is soft, copper-bearing, and may be porous, stabilized, dyed, or coated.$$, 2),
('C-0020', 'Light & Heat',$$Protect from heat, direct prolonged sunlight, solvents, and rapid temperature changes that can damage treatments or polish.$$, 3),
('C-0020', 'Storage',     $$Store separately in a padded compartment; avoid scratches, impacts, and contact with harder stones or acidic materials.$$, 4),

-- SUNSTONE
('C-0029', 'Cleaning',    $$Clean with warm water, mild soap, and a soft cloth or brush; avoid ultrasonic and steam cleaners.$$, 1),
('C-0029', 'Water',       $$Brief washing is suitable, but avoid soaking fracture-filled stones or pieces with uncertain treatment history.$$, 2),
('C-0029', 'Light & Heat',$$Avoid high heat, thermal shock, and prolonged intense light, especially in unusually saturated or potentially treated material.$$, 3),
('C-0029', 'Storage',     $$Store in a padded compartment away from harder gems; feldspar cleavage makes sharp impacts a greater concern than hardness suggests.$$, 4);
