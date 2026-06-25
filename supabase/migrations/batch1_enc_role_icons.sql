-- Batch 1: set energetic_role_icon on enc_stone_content
UPDATE enc_stone_content SET energetic_role_icon = 'icon-grounding'       WHERE slug = 'hematite';
UPDATE enc_stone_content SET energetic_role_icon = 'icon-intuition'       WHERE slug = 'moonstone';
UPDATE enc_stone_content SET energetic_role_icon = 'icon-clarity-focus'   WHERE slug = 'sodalite';
UPDATE enc_stone_content SET energetic_role_icon = 'icon-transformation'  WHERE slug = 'malachite';
UPDATE enc_stone_content SET energetic_role_icon = 'icon-vitality'        WHERE slug = 'sunstone';
