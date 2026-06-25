SELECT tbl, stone_id, rows FROM (
  SELECT 'enc_stone_content'   AS tbl, stone_id, count(*) AS rows FROM enc_stone_content   WHERE stone_id IN ('C-0041','C-0162','C-0218','C-0020','C-0029') GROUP BY stone_id
  UNION ALL
  SELECT 'enc_themes',              stone_id, count(*) FROM enc_themes           WHERE stone_id IN ('C-0041','C-0162','C-0218','C-0020','C-0029') GROUP BY stone_id
  UNION ALL
  SELECT 'enc_collector_notes',     stone_id, count(*) FROM enc_collector_notes  WHERE stone_id IN ('C-0041','C-0162','C-0218','C-0020','C-0029') GROUP BY stone_id
  UNION ALL
  SELECT 'enc_mineral_facts',       stone_id, count(*) FROM enc_mineral_facts    WHERE stone_id IN ('C-0041','C-0162','C-0218','C-0020','C-0029') GROUP BY stone_id
  UNION ALL
  SELECT 'enc_localities',          stone_id, count(*) FROM enc_localities        WHERE stone_id IN ('C-0041','C-0162','C-0218','C-0020','C-0029') GROUP BY stone_id
  UNION ALL
  SELECT 'enc_related_stones',      stone_id, count(*) FROM enc_related_stones   WHERE stone_id IN ('C-0041','C-0162','C-0218','C-0020','C-0029') GROUP BY stone_id
  UNION ALL
  SELECT 'enc_care',                stone_id, count(*) FROM enc_care              WHERE stone_id IN ('C-0041','C-0162','C-0218','C-0020','C-0029') GROUP BY stone_id
  UNION ALL
  SELECT 'enc_reach_for',           stone_id, count(*) FROM enc_reach_for        WHERE stone_id IN ('C-0041','C-0162','C-0218','C-0020','C-0029') GROUP BY stone_id
) x ORDER BY tbl, stone_id;
