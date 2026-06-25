-- Batch 1: enc_mineral_facts — Hematite, Moonstone, Sodalite, Malachite, Sunstone
-- Exactly 8 rows per stone; labels adapted per enc-editorial-schema.md rules

INSERT INTO enc_mineral_facts (stone_id, label, value, display_order) VALUES

-- HEMATITE (true mineral, standard 8 labels)
('C-0041', 'Mineral Family',  'Oxide mineral',                                    1),
('C-0041', 'Chemical Formula','Fe₂O₃',                                             2),
('C-0041', 'Crystal System',  'Trigonal',                                          3),
('C-0041', 'Mohs Hardness',   '5.5 to 6.5',                                        4),
('C-0041', 'Cleavage',        'None; parting may occur',                            5),
('C-0041', 'Fracture',        'Uneven to subconchoidal',                            6),
('C-0041', 'Luster',          'Metallic to submetallic; earthy in massive material',7),
('C-0041', 'Transparency',    'Opaque',                                             8),

-- MOONSTONE (feldspar variety; no single formula/system — adapted labels)
('C-0162', 'Material Type',       'Feldspar variety',                                          1),
('C-0162', 'Typical Composition', 'Intergrowths commonly involving orthoclase and albite',     2),
('C-0162', 'Feldspar Hosts',      'Alkali feldspar and related feldspar material',             3),
('C-0162', 'Crystal Structure',   'Monoclinic or triclinic, depending on host',               4),
('C-0162', 'Mohs Hardness',       '6 to 6.5',                                                  5),
('C-0162', 'Cleavage',            'Perfect in two directions, near 90 degrees',               6),
('C-0162', 'Luster',              'Vitreous; pearly on cleavage surfaces',                    7),
('C-0162', 'Optical Effect',      'Adularescence',                                             8),

-- SODALITE (true mineral)
('C-0218', 'Mineral Family',  $$Feldspathoid; sodalite group$$,                    1),
('C-0218', 'Chemical Formula','Na₈(Al₆Si₆O₂₄)Cl₂',                               2),
('C-0218', 'Crystal System',  'Isometric',                                          3),
('C-0218', 'Mohs Hardness',   '5.5 to 6',                                           4),
('C-0218', 'Cleavage',        'Poor; commonly described on dodecahedral directions', 5),
('C-0218', 'Fracture',        'Uneven to conchoidal',                               6),
('C-0218', 'Luster',          'Vitreous to greasy',                                 7),
('C-0218', 'Transparency',    'Opaque to translucent',                              8),

-- MALACHITE (true mineral)
('C-0020', 'Mineral Family',  'Carbonate mineral',                                  1),
('C-0020', 'Chemical Formula','Cu₂CO₃(OH)₂',                                        2),
('C-0020', 'Crystal System',  'Monoclinic',                                          3),
('C-0020', 'Mohs Hardness',   '3.5 to 4',                                            4),
('C-0020', 'Cleavage',        'Perfect in one direction; fair in another',           5),
('C-0020', 'Fracture',        'Splintery to uneven',                                 6),
('C-0020', 'Luster',          'Silky to earthy; vitreous on crystals',              7),
('C-0020', 'Transparency',    'Opaque to translucent',                               8),

-- SUNSTONE (feldspar variety; no single formula/system — adapted labels)
('C-0029', 'Material Type',        'Feldspar variety',                                           1),
('C-0029', 'Typical Composition',  'Feldspar with reflective mineral or native Copper inclusions',2),
('C-0029', 'Common Feldspar Hosts','Oligoclase, Labradorite, Orthoclase, Microcline, or Albite', 3),
('C-0029', 'Crystal Structure',    'Triclinic or monoclinic, depending on host',                4),
('C-0029', 'Mohs Hardness',        '6 to 6.5',                                                   5),
('C-0029', 'Cleavage',             'Perfect to good in two directions',                          6),
('C-0029', 'Luster',               'Vitreous',                                                   7),
('C-0029', 'Optical Effect',       'Aventurescence',                                             8);
