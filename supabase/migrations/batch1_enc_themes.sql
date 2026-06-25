-- Batch 1: enc_themes — Hematite, Moonstone, Sodalite, Malachite, Sunstone
-- tier values: 'primary' | 'secondary' | 'occasional'
-- occasional rows have null description (displayed as tags, no body)

INSERT INTO enc_themes (stone_id, tier, title, description, display_order) VALUES

-- HEMATITE
('C-0041', 'primary',    'Grounding and Embodiment',     $$Its strongest tradition centers on bringing awareness back to the body, the present moment, and the concrete conditions that require attention.$$, 1),
('C-0041', 'primary',    'Stability and Presence',        $$The emphasis here is steady footing rather than rigidity, helping scattered energy settle into a more composed and responsive state.$$, 2),
('C-0041', 'secondary',  'Focus and Practical Clarity',   $$A grounded baseline can make priorities easier to sort, supporting concentration on what is immediate, useful, and realistically achievable.$$, 1),
('C-0041', 'secondary',  'Protection and Boundaries',     $$Its dense, self-contained character is often associated with maintaining personal limits without becoming defensive or emotionally closed.$$, 2),
('C-0041', 'occasional', 'Courage',                       null, 1),
('C-0041', 'occasional', 'Determination',                 null, 2),

-- MOONSTONE
('C-0162', 'primary',    'Intuition and Inner Guidance',  $$Its strongest tradition centers on receptive knowing, helping attention turn inward when an answer cannot be reached through analysis alone.$$, 1),
('C-0162', 'primary',    'Cyclical Awareness and Change', $$The lunar emphasis supports recognizing phases, transitions, endings, and beginnings as parts of an unfolding rhythm rather than isolated disruptions.$$, 2),
('C-0162', 'secondary',  'Emotional Balance',             $$Heart and Water associations bring a softer, more responsive quality to periods when emotions shift quickly or feel difficult to interpret.$$, 1),
('C-0162', 'secondary',  'New Beginnings',                $$Rather than pushing for dramatic reinvention, this theme supports entering a new phase with openness, patience, and trust in timing.$$, 2),
('C-0162', 'occasional', 'Dreams',                        null, 1),
('C-0162', 'occasional', 'Feminine Wisdom',               null, 2),

-- SODALITE
('C-0218', 'primary',    'Mental Synthesis and Integration',  $$Its strongest tradition centers on bringing analysis, intuition, observation, and creativity together so scattered information can become a coherent understanding.$$, 1),
('C-0218', 'primary',    'Logical-Intuitive Insight',         $$Rather than treating reason and intuition as opposites, this theme supports their deliberate integration, allowing each to test, refine, and deepen the other.$$, 2),
('C-0218', 'secondary',  'Truthful Communication',            $$The Throat emphasis carries inward understanding into clear expression, especially when honesty, precision, and thoughtful language all matter.$$, 1),
('C-0218', 'secondary',  'Self-Understanding',                $$Its reflective quality supports a more dispassionate view of personal motives, strengths, habits, and contradictions without immediately defending or distorting them.$$, 2),
('C-0218', 'occasional', 'Group Harmony',                     null, 1),

-- MALACHITE
('C-0020', 'primary',    'Transformation Through Right Action',  $$Its strongest tradition centers on turning insight into responsible action, especially when growth requires a clear choice rather than further delay or emotional avoidance.$$, 1),
('C-0020', 'primary',    'Courage and Personal Responsibility',  $$This theme supports the willingness to acknowledge one's role, make a conscious decision, and follow through with integrity even when the path is uncomfortable.$$, 2),
('C-0020', 'secondary',  'Conscious Leadership',                 $$Solar Plexus associations emphasize conviction, self-discipline, and the ability to influence circumstances through responsible, values-based leadership.$$, 1),
('C-0020', 'secondary',  'Heart-Centered Discernment',           $$Heart Chakra traditions connect transformation with emotional clarity, helping compassion and honesty guide decisions without weakening necessary boundaries.$$, 2),
('C-0020', 'occasional', 'Protection',                           null, 1),
('C-0020', 'occasional', 'Abundance',                            null, 2),

-- SUNSTONE
('C-0029', 'primary',    'Vitality and Engagement',        $$Its strongest tradition centers on renewed life force, enthusiasm, and the willingness to participate fully rather than remain on the sidelines.$$, 1),
('C-0029', 'primary',    'Confidence and Independence',    $$The emphasis here is self-directed action, helping personal authority grow without becoming rigid, performative, or dependent on applause.$$, 2),
('C-0029', 'secondary',  'Joy and Creative Warmth',        $$Sacral associations support pleasure, creative expression, sociability, and a brighter emotional relationship with action.$$, 1),
('C-0029', 'secondary',  'Leadership and Initiative',      $$Solar energy strengthens visible, benevolent leadership, supporting initiative, conviction, and the responsibility to use personal influence with warmth, generosity, and purpose.$$, 2),
('C-0029', 'occasional', 'Good Fortune',                   null, 1);
