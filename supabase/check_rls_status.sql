SELECT
  c.relname                          AS table_name,
  c.relrowsecurity                   AS rls_enabled,
  count(p.policyname)                AS policy_count
FROM pg_class c
LEFT JOIN pg_policies p
  ON p.tablename = c.relname AND p.schemaname = 'public'
WHERE c.relnamespace = 'public'::regnamespace
  AND c.relkind = 'r'
  AND c.relname IN (
    'stones',
    'enc_stone_content',
    'enc_themes',
    'enc_collector_notes',
    'enc_mineral_facts',
    'enc_localities',
    'enc_related_stones',
    'enc_care',
    'enc_reach_for'
  )
GROUP BY c.relname, c.relrowsecurity
ORDER BY c.relname;
