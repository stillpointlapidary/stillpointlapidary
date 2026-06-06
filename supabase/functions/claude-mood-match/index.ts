// ── claude-mood-match ──────────────────────────────────────────────────────
// Supabase Edge Function
// Deploy: supabase functions deploy claude-mood-match
//
// Takes a freeform user query + compact stone list,
// returns 6-8 best-matching stone IDs with a personalized reason for each.
// Uses claude-haiku for speed and low cost.
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
    const { query, stones } = await req.json();

    if (!query || !stones) {
      return new Response(JSON.stringify({ error: "Missing query or stones" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const client = new Anthropic({
      apiKey: Deno.env.get("ANTHROPIC_API_KEY"),
    });

    // Build a compact stone list: id | name | energetic role | use when
    const stoneList = stones
      .map((s: {id:string;name:string;er:string;uw:string}) => `${s.id}|${s.name}|${s.er}|${s.uw}`)
      .join("\n");

    const prompt = `A person described what they need: "${query}"

Your job: find the 6 to 8 most genuinely relevant stones from the list below.
Match based on emotional need, energetic role, and use-when descriptions.
Be selective — only include stones that truly fit. Do not pad the list.

For each match, write a single warm, direct sentence explaining why this stone fits this person right now. Write it to the person, not about them (use "you" not "they"). Keep it under 18 words.

Return ONLY a valid JSON array. No explanation, no markdown, no extra text.
Format: [{"id":"C-0001","name":"Stone Name","reason":"One warm sentence for this person."}]

Stone list (id|name|energetic role|use when):
${stoneList}`;

    const response = await client.messages.create({
      model: "claude-haiku-4-5",
      max_tokens: 1024,
      messages: [{ role: "user", content: prompt }],
    });

    const text = response.content[0].text.trim();

    // Extract JSON array robustly
    const jsonMatch = text.match(/\[[\s\S]*\]/);
    if (!jsonMatch) {
      throw new Error("Claude did not return a valid JSON array");
    }

    const matches = JSON.parse(jsonMatch[0]);

    return new Response(JSON.stringify({ matches }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: (err as Error).message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
