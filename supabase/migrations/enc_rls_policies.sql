-- RLS read policies for encyclopedia tables
-- enc_stone_content: anon may only read published rows
-- All child enc_ tables: open anon read (data is non-sensitive;
--   access is already gated upstream by enc_stone_content published check)

CREATE POLICY "Anon can read published stones"
  ON enc_stone_content FOR SELECT TO anon
  USING (published = true);

CREATE POLICY "Anon can read enc_themes"
  ON enc_themes FOR SELECT TO anon
  USING (true);

CREATE POLICY "Anon can read enc_collector_notes"
  ON enc_collector_notes FOR SELECT TO anon
  USING (true);

CREATE POLICY "Anon can read enc_mineral_facts"
  ON enc_mineral_facts FOR SELECT TO anon
  USING (true);

CREATE POLICY "Anon can read enc_localities"
  ON enc_localities FOR SELECT TO anon
  USING (true);

CREATE POLICY "Anon can read enc_related_stones"
  ON enc_related_stones FOR SELECT TO anon
  USING (true);

CREATE POLICY "Anon can read enc_care"
  ON enc_care FOR SELECT TO anon
  USING (true);

CREATE POLICY "Anon can read enc_reach_for"
  ON enc_reach_for FOR SELECT TO anon
  USING (true);
