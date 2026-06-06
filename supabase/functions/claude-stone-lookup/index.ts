// ── claude-stone-lookup ───────────────────────────────────────────────────────
// Supabase Edge Function
// Deploy: supabase functions deploy claude-stone-lookup
//
// Takes a stone name, returns encyclopedia fields pre-filled by Claude.
// Used by the "Auto-fill with AI" button on the Add Encyclopedia Entry form.
// ─────────────────────────────────────────────────────────────────────────────

import Anthropic from "npm:@anthropic-ai/sdk";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { name } = await req.json();

    if (!name) {
      return new Response(JSON.stringify({ error: "Missing stone name" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const client = new Anthropic({
      apiKey: Deno.env.get("ANTHROPIC_API_KEY"),
    });

    const prompt = `You are a mineralogy and crystal encyclopedia assistant. Look up the crystal or mineral called "${name}" and return its properties as a JSON object.

Return ONLY a valid JSON object with these exact keys. No explanation, no markdown, no extra text.

{
  "a": "alternate or trade names, comma-separated (empty string if none)",
  "fam": "mineral family name",
  "sp": "species name (often same as family)",
  "mt": "material type — one of: Mineral, Mineraloid, Rock, Organic",
  "sy": "crystal system — one of: Cubic, Tetragonal, Orthorhombic, Hexagonal, Trigonal, Monoclinic, Triclinic, Amorphous",
  "fo": "formation type — one of: Igneous, Metamorphic, Sedimentary, Hydrothermal, Pegmatitic, Secondary/Oxidation, Synthetic",
  "tr": "transparency — one of: Transparent, Translucent, Opaque",
  "c": "typical color description (e.g. 'Deep blue' or 'Purple to violet')",
  "ch": "representative hex color code (e.g. '#4a3a8a')",
  "cc": "what causes the color (e.g. 'Iron', 'Copper', 'Manganese')",
  "m": "Mohs hardness as string (e.g. '7' or '6.5–7')",
  "g": "2-3 sentence geological notes: how it forms, where it's found, what makes it distinctive",
  "er": "energetic role — short phrase like 'Grounding / Stabilizing' or 'Intuition / Psychic Awareness'",
  "uw": "Use When description — 1 sentence starting with 'Use when...'",
  "chakras": ["Primary chakra", "Secondary chakra if applicable"],
  "element": "elemental association — one of: Earth, Fire, Water, Air, Storm, Spirit (empty string if unclear)",
  "zodiac": "primary zodiac sign(s), comma-separated (empty string if unclear)",
  "aff": "a short affirmation in first person, 1-2 sentences starting with 'I'",
  "primary_theme": "single primary theme — one of: Grounding, Protection, Heart Healing, Emotional Regulation, Calm & Peace, Self-Love, Joy, Clarity & Focus, Communication, Intuition, Spiritual Connection, Vitality, Amplification, Transformation, Manifestation, Confidence",
  "all_themes": ["primary theme", "any additional relevant themes from the list above"]
}`;

    const response = await client.messages.create({
      model: "claude-opus-4-5",
      max_tokens: 1024,
      messages: [{ role: "user", content: prompt }],
    });

    const text = response.content[0].text.trim();

    // Extract JSON object robustly
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("Claude did not return a valid JSON object");
    }

    const data = JSON.parse(jsonMatch[0]);

    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: (err as Error).message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
