// ── photo-id ────────────────────────────────────────────────────────────────
// Supabase Edge Function — Photo ID Beta
// Deploy: supabase functions deploy photo-id --no-verify-jwt
//
// Open-world visual identification from 1–3 specimen photos (OpenAI Responses
// API, image input, Structured Outputs). The application — not the model —
// owns every limit: photos, photo retry, follow-up questions, calls per
// session, monthly cost, and rate limiting. Images are never stored: they
// arrive in the request body, go to OpenAI with store:false, and are dropped.
//
// Secrets (supabase secrets set ...):
//   OPENAI_API_KEY                   required
//   PHOTO_ID_MODEL                   optional, default gpt-5.6-sol
//   PHOTO_ID_MONTHLY_BUDGET_USD      optional, default 10
//   PHOTO_ID_PRICE_IN_PER_M_USD      optional, default 5   (conservative input $/1M tokens)
//   PHOTO_ID_PRICE_OUT_PER_M_USD     optional, default 30  (conservative output $/1M tokens)
// SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY are provided automatically.
// ─────────────────────────────────────────────────────────────────────────────

import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// ── Limits (application-owned) ──
const MAX_INITIAL_PHOTOS = 3;
const MAX_PHOTO_RETRIES = 1;
const MAX_QUESTIONS = 2;
const MAX_CALLS = 4;
const MAX_IMAGE_BYTES = 2 * 1024 * 1024;       // per decoded image (client sends resized JPEG, typically ~300 KB)
const MAX_BODY_BYTES = 7 * 1024 * 1024;
const MAX_ALTERNATIVES = 3;
const RATE_PER_HOUR = 6;                        // new identification sessions per visitor per hour
const RATE_PER_DAY = 20;
const OPENAI_TIMEOUT_MS = 60_000;
const RESERVED_COST_PER_CALL_USD = 0.1;         // pre-call headroom check

const MODEL = Deno.env.get("PHOTO_ID_MODEL") || "gpt-5.6-sol";
const BUDGET_USD = Number(Deno.env.get("PHOTO_ID_MONTHLY_BUDGET_USD") || "10");
const PRICE_IN = Number(Deno.env.get("PHOTO_ID_PRICE_IN_PER_M_USD") || "5");
const PRICE_OUT = Number(Deno.env.get("PHOTO_ID_PRICE_OUT_PER_M_USD") || "30");

const supa = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  { auth: { persistSession: false } },
);

class PidError extends Error {
  code: string;
  extra: Record<string, unknown>;
  constructor(code: string, extra: Record<string, unknown> = {}) {
    super(code);
    this.code = code;
    this.extra = extra;
  }
}

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

// ── Structured output schema ──
const CONFIDENCE = ["strong", "good", "tentative", "more_information_needed"];
const MATERIAL_TYPES = [
  "mineral", "mineral_variety", "rock", "aggregate", "mineraloid", "fossil",
  "organic", "composite", "manmade", "glass", "synthetic", "meteorite",
  "trade_name", "other", "not_determined",
];
const STATUSES = ["identified", "narrowed_no_winner", "unable_to_identify"];
const UNCERTAINTY = [
  "insufficient_image_quality", "missing_view", "missing_observation",
  "inherent_visual_ambiguity", "insufficient_evidence", "none",
];
const NEXT_ACTIONS = ["final", "request_photo", "ask_question"];
const NOTE_TYPES = [
  "variety_relationship", "rock_or_aggregate", "trade_or_commercial_name",
  "treatment", "manmade_or_composite", "fossil_or_organic", "mineraloid",
  "locality_or_naming_clarification", "none",
];
const nullableString = { anyOf: [{ type: "string" }, { type: "null" }] };

const RESULT_SCHEMA = {
  type: "object",
  additionalProperties: false,
  required: [
    "best_match", "lookup_name", "confidence", "identification_class", "identification_status",
    "observed_features", "user_reported_evidence", "what_we_are_seeing", "alternatives",
    "uncertainty_reason", "next_action", "photo_problem", "photo_guidance", "question",
    "answer_options", "question_purpose", "confirmation_note", "identity_note_type_suggested",
  ],
  properties: {
    best_match: nullableString,
    lookup_name: nullableString,
    confidence: { type: "string", enum: CONFIDENCE },
    identification_class: { type: "string", enum: MATERIAL_TYPES },
    identification_status: { type: "string", enum: STATUSES },
    observed_features: { type: "array", items: { type: "string" } },
    user_reported_evidence: { type: "array", items: { type: "string" } },
    what_we_are_seeing: { type: "string" },
    alternatives: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        required: ["name", "reason"],
        properties: { name: { type: "string" }, reason: { type: "string" } },
      },
    },
    uncertainty_reason: { type: "string", enum: UNCERTAINTY },
    next_action: { type: "string", enum: NEXT_ACTIONS },
    photo_problem: nullableString,
    photo_guidance: nullableString,
    question: nullableString,
    answer_options: { type: "array", items: { type: "string" } },
    question_purpose: nullableString,
    confirmation_note: nullableString,
    identity_note_type_suggested: { type: "string", enum: NOTE_TYPES },
  },
};

const NOTE_SCHEMA = {
  type: "object",
  additionalProperties: false,
  required: ["note"],
  properties: { note: nullableString },
};

// ── Instructions ──
const INSTRUCTIONS = `You are the visual identification engine for Still Point Lapidary's Photo ID Beta. A visitor has photographed a specimen (1–3 photos). Identify what it most likely is from what is actually visible, and return the structured result.

OPEN WORLD
- Do not assume the object is a crystal, a mineral, natural, or something a collection would cover. It may be a mineral, variety, rock, aggregate, mineraloid, fossil, organic material, composite, man-made material, glass, synthetic, trade-named material, treated material, meteorite, shell, carved object, or anything else a lapidary or collector might hold.
- Identify first, from the evidence. Never steer toward any particular catalog.
- "lookup_name" is the plain, standard name of your best match as a collector would name the material (for example "Fire Agate", "Lapis Lazuli", "Bumblebee Jasper"). Use null when best_match is null. Keep it free of qualifiers.

EVIDENCE DISCIPLINE
Keep four things distinct: visual evidence (features genuinely observable in the photos), user-reported evidence (answers to follow-up questions), reference knowledge about the proposed material, and your inference. Never present an unobserved property as though it were measured.
- observed_features: only what is genuinely visible (color and distribution, apparent transparency, apparent luster with lighting caveats, habit, banding, zoning, veining, mottling, dendrites, inclusions, matrix, fractures, cavities, botryoidal or druzy surfaces, grain size and texture, visible cleavage or fracture, optical effects actually shown, fossil morphology, obviously manufactured features, shape or lapidary form).
- user_reported_evidence: only what the visitor told you in answers to questions. Empty if none.
- Photographs alone generally do not establish Mohs hardness, specific gravity, composition, refractive index, streak, magnetism, acid reaction, precise locality or mine, UV response (unless photographed under known UV), specimen-specific geology, treatment with certainty, or natural origin/authenticity. Do not claim them.
- Absence from a photo is not evidence of absence. Say "Aventurescence isn't visible in these photos", never "The stone does not have aventurescence", unless the visitor reported checking.
- what_we_are_seeing: natural, warm, visitor-facing prose (roughly 2–5 sentences), grounded specifically in this specimen's visible features and any user-reported evidence. No bullet points. No percentages. No claims the evidence cannot support. Plain punctuation; do not use em dashes.

TREATMENTS, SYNTHETICS, IMITATIONS, TRADE NAMES
Recognize them when visually relevant, but never claim certainty a photograph cannot give. Example: "The intense color concentrated along fractures can be a sign of dye treatment. We can't confirm treatment from a photograph alone." Do not call a material fake without adequate evidence. Do not treat retailer or marketplace claims as technical authority.

CONFIDENCE (use exactly these values)
- strong: distinctive visible evidence strongly supports one identification. Return it as final. Never ask another question just to raise confidence further.
- good: one identification fits meaningfully better than the alternatives, but some uncertainty remains. Final, unless one obtainable observation could materially improve it.
- tentative: a reasonable leading candidate but the evidence is not distinctive. Keep meaningful alternatives; ask a targeted question only if useful evidence is still obtainable.
- more_information_needed: not enough evidence to responsibly choose. Set best_match and lookup_name to null. Do not manufacture a winner. If several candidates remain but none can be defended, list them in alternatives and set identification_status to narrowed_no_winner. If nothing can be responsibly proposed, use unable_to_identify.
identification_status: identified (a best match is returned), narrowed_no_winner, or unable_to_identify.

ALTERNATIVES
At most 3, only meaningful ones. Return none when there is no real competing identification. Never pad. "reason" is one short, visitor-facing sentence on why this alternative remains possible, grounded in what is visible (no unobserved claims, no percentages, no em dashes).

NEXT ACTION (you recommend; the application decides what is still allowed)
- final: give the result.
- request_photo: ask for one additional or replacement photo, for any legitimate visual reason (glare, focus, distance, missing diagnostic angle or detail). Fill photo_problem (visitor-facing, specific about what is not visible or evaluable, one or two sentences) and photo_guidance (visitor-facing, concrete: what to photograph and how). Leave question fields empty.
- ask_question: ask one targeted observation question. Fill question (ordinary language), answer_options (2–5 short choices, always including "Not sure"), and question_purpose (internal: how each answer could distinguish candidates or materially improve confidence). Leave photo fields null.
Ask only when the answer could materially change the identification, the confidence, or the meaningful alternatives. No curiosity questions. Reassess after every answer; a second question is not automatic. Never request a photo or ask a question that the status block says is no longer allowed. When no further action is allowed, conclude with the best defensible result.
Allowed follow-up evidence, in order of preference: (1) safe visual or tactile observation (edge translucency, glitter or sparkle when rotated, moving flash, visible striations, grains, whether color seems internal or on the surface, banding, texture, relative heft with choices like Heavy / About what I'd expect / Light / Not sure), (2) a harmless interaction such as a simple magnet check, only when genuinely discriminating, (3) known provenance or locality, only when materially useful.
NEVER suggest scratching the specimen or scratching glass, a streak test, acid, heat, solvents, scraping, or anything that could damage or alter an unknown material. Principle: look, rotate, feel, safely observe. Never damage.
Do not ask what a seller called the material unless it is genuinely discriminating, and never require provenance.

UNCERTAINTY DIAGNOSIS (uncertainty_reason)
insufficient_image_quality, missing_view, missing_observation, inherent_visual_ambiguity, insufficient_evidence, or none. Distinguish a bad photograph from a genuinely difficult identification. Never blame image quality merely because the material is hard to identify. When the photos are fine but the material is ambiguous, say so honestly in what_we_are_seeing.

OTHER FIELDS
- confirmation_note: optional (null otherwise). One short sentence about a genuinely useful additional observation that could strengthen the result but is not necessary enough to delay it. Same safety limits as above. Null when next_action is not final.
- identity_note_type_suggested: the kind of classification clarification that would help a reader understand what this material actually is (variety_relationship, rock_or_aggregate, trade_or_commercial_name, treatment, manmade_or_composite, fossil_or_organic, mineraloid, locality_or_naming_clarification), or none for a straightforward material. This is only a suggestion.
- identification_class: your best classification; not_determined when there is no best match.
- Use null for text fields that do not apply and empty arrays for lists that do not apply.
- The visitor's photos are the only visual evidence. Do not browse, do not claim to have searched, and do not describe photos you cannot see.`;

const NOTE_INSTRUCTIONS = `You write a short Identity Note for a Still Point Lapidary result. Use ONLY the approved Still Point text supplied below. Write one or two plain sentences that clarify what the material actually is, matching the requested clarification type (for example a variety of a mineral, a rock rather than a single mineral, a trade name, a treatment relationship, a man-made or composite material, a fossil or organic material, a mineraloid, or a naming clarification).
Rules: every claim must be present in the supplied text; add no new technical claim, no metaphysical content, no history, no care guidance, no trivia. Do not mention the encyclopedia or "approved text". No em dashes. If the supplied text does not support a useful classification clarification, or the stone is a straightforward mineral needing none, return null.`;

// ── Helpers ──
function normName(s: string): string {
  return String(s || "")
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[‘’ʼ]/g, "'")
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim();
}

async function sha256Hex(s: string): Promise<string> {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(s));
  return Array.from(new Uint8Array(buf)).map((b) => b.toString(16).padStart(2, "0")).join("");
}

function monthStartIso(): string {
  const d = new Date();
  return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), 1)).toISOString();
}

// Decode a data URL and verify it is a real JPEG/PNG/WebP by magic bytes.
function validateImage(dataUrl: unknown): string {
  if (typeof dataUrl !== "string") throw new PidError("unsupported_image");
  const m = dataUrl.match(/^data:(image\/(?:jpeg|png|webp));base64,([A-Za-z0-9+/=]+)$/);
  if (!m) throw new PidError("unsupported_image");
  const approxBytes = Math.floor((m[2].length * 3) / 4);
  if (approxBytes > MAX_IMAGE_BYTES) throw new PidError("image_too_large");
  let head: Uint8Array;
  try {
    head = Uint8Array.from(atob(m[2].slice(0, 32)), (c) => c.charCodeAt(0));
  } catch {
    throw new PidError("unsupported_image");
  }
  const isJpeg = head[0] === 0xff && head[1] === 0xd8 && head[2] === 0xff;
  const isPng = head[0] === 0x89 && head[1] === 0x50 && head[2] === 0x4e && head[3] === 0x47;
  const isWebp = head[0] === 0x52 && head[1] === 0x49 && head[2] === 0x46 && head[3] === 0x46 &&
    head[8] === 0x57 && head[9] === 0x45 && head[10] === 0x42 && head[11] === 0x50;
  const ok = (m[1] === "image/jpeg" && isJpeg) || (m[1] === "image/png" && isPng) ||
    (m[1] === "image/webp" && isWebp);
  if (!ok) throw new PidError("unsupported_image");
  return dataUrl;
}

async function monthlySpend(): Promise<number> {
  const { data, error } = await supa
    .from("photo_id_sessions")
    .select("est_cost_usd")
    .gte("created_at", monthStartIso());
  if (error) throw new Error("budget lookup failed");
  return (data || []).reduce((t, r) => t + Number(r.est_cost_usd || 0), 0);
}

async function assertBudget() {
  const spent = await monthlySpend();
  if (spent + RESERVED_COST_PER_CALL_USD > BUDGET_USD) throw new PidError("budget");
}

async function callOpenAI(
  content: unknown[],
  instructions: string,
  schemaName: string,
  schema: unknown,
  maxOut: number,
): Promise<{ parsed: Record<string, unknown>; costUsd: number }> {
  const apiKey = Deno.env.get("OPENAI_API_KEY");
  if (!apiKey) throw new PidError("provider");
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), OPENAI_TIMEOUT_MS);
  let res: Response;
  try {
    res = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      signal: ctrl.signal,
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
      body: JSON.stringify({
        model: MODEL,
        instructions,
        input: [{ role: "user", content }],
        text: { format: { type: "json_schema", name: schemaName, strict: true, schema } },
        reasoning: { effort: "low" },
        max_output_tokens: maxOut,
        store: false,
      }),
    });
  } catch (e) {
    if ((e as Error).name === "AbortError") throw new PidError("timeout");
    throw new PidError("provider");
  } finally {
    clearTimeout(timer);
  }
  if (!res.ok) {
    console.error("photo-id: provider status", res.status);
    throw new PidError("provider");
  }
  let body: any;
  try {
    body = await res.json();
  } catch {
    throw new PidError("provider");
  }
  const usage = body?.usage || {};
  const costUsd = ((usage.input_tokens || 0) * PRICE_IN + (usage.output_tokens || 0) * PRICE_OUT) / 1_000_000;
  if (body?.status && body.status !== "completed") throw new PidError("malformed", { costUsd });
  let text = "";
  for (const item of body?.output || []) {
    if (item?.type !== "message") continue;
    for (const part of item.content || []) {
      if (part?.type === "refusal") throw new PidError("malformed", { costUsd });
      if (part?.type === "output_text") text += part.text;
    }
  }
  try {
    return { parsed: JSON.parse(text), costUsd };
  } catch {
    throw new PidError("malformed", { costUsd });
  }
}

// Light runtime shape check — the schema is strict, but never trust blindly.
function coerceResult(r: Record<string, any>): Record<string, any> {
  const str = (v: unknown) => (typeof v === "string" && v.trim() ? v.trim() : null);
  const list = (v: unknown) => (Array.isArray(v) ? v.filter((x) => typeof x === "string" && x.trim()).map((x) => x.trim()) : []);
  if (!CONFIDENCE.includes(r.confidence) || !NEXT_ACTIONS.includes(r.next_action) || typeof r.what_we_are_seeing !== "string") {
    throw new PidError("malformed");
  }
  const alts = (Array.isArray(r.alternatives) ? r.alternatives : [])
    .filter((a: any) => a && typeof a.name === "string" && a.name.trim())
    .slice(0, MAX_ALTERNATIVES)
    .map((a: any) => ({ name: a.name.trim(), reason: str(a.reason) || "" }));
  return {
    best_match: str(r.best_match),
    lookup_name: str(r.lookup_name),
    confidence: r.confidence,
    identification_class: MATERIAL_TYPES.includes(r.identification_class) ? r.identification_class : "not_determined",
    identification_status: STATUSES.includes(r.identification_status) ? r.identification_status : "unable_to_identify",
    observed_features: list(r.observed_features),
    user_reported_evidence: list(r.user_reported_evidence),
    what_we_are_seeing: r.what_we_are_seeing.trim(),
    alternatives: alts,
    uncertainty_reason: UNCERTAINTY.includes(r.uncertainty_reason) ? r.uncertainty_reason : "none",
    next_action: r.next_action,
    photo_problem: str(r.photo_problem),
    photo_guidance: str(r.photo_guidance),
    question: str(r.question),
    answer_options: list(r.answer_options),
    question_purpose: str(r.question_purpose),
    confirmation_note: str(r.confirmation_note),
    identity_note_type_suggested: NOTE_TYPES.includes(r.identity_note_type_suggested) ? r.identity_note_type_suggested : "none",
  };
}

// Deterministic encyclopedia match: normalized exact canonical name only.
// No application-level alias map exists, so step 2 of the approved order is a no-op.
async function matchEncyclopedia(lookupName: string | null) {
  if (!lookupName) return null;
  const target = normName(lookupName);
  if (!target) return null;
  const { data, error } = await supa.from("stones").select("id,name,slug");
  if (error || !data) return null;
  const hit = data.find((s: any) => normName(s.name) === target);
  if (!hit) return null;
  const { data: enc } = await supa
    .from("enc_stone_content")
    .select("slug,published,material_type,overview_p2,collector_context_p2")
    .eq("stone_id", hit.id)
    .eq("published", true)
    .maybeSingle();
  return {
    id: hit.id as string,
    name: hit.name as string,
    slug: (enc?.slug || hit.slug || "") as string,
    fullEntry: !!enc,
    approved: enc
      ? { material_type: enc.material_type, mineral_physical_identity: enc.overview_p2, identification: enc.collector_context_p2 }
      : null,
  };
}

function statusBlock(s: any, kind: string, history: { question: string; answer: string }[]): string {
  const retriesLeft = MAX_PHOTO_RETRIES - (s.photo_retry_used ? 1 : 0);
  const qLeft = MAX_QUESTIONS - s.question_count;
  const callsAfterThis = MAX_CALLS - (s.call_count + 1);
  const lines = [
    `Session status (enforced by the application):`,
    `- This is analysis call ${s.call_count + 1} of ${MAX_CALLS}.`,
    `- Photo request allowance remaining: ${retriesLeft > 0 ? "1 (one additional or replacement photo)" : "none. Do not request a photo."}`,
    `- Follow-up questions remaining: ${qLeft} of ${MAX_QUESTIONS}${qLeft <= 0 ? ". Do not ask a question." : ""}`,
  ];
  if (callsAfterThis <= 0) lines.push("- No further calls are possible after this one. next_action must be final.");
  lines.push(
    kind === "initial"
      ? "- The photos below are the visitor's initial submission."
      : kind === "retry"
        ? "- The photos below include the additional or replacement photo the visitor just supplied after your photo request."
        : "- The visitor has just answered your follow-up question. The photos below are the same as before.",
  );
  if (history.length) {
    lines.push("", "User-reported evidence so far (visitor answers to your questions):");
    history.forEach((h, i) => lines.push(`${i + 1}. Q: ${h.question} / A: ${h.answer}`));
  }
  lines.push("", "Return the structured result.");
  return lines.join("\n");
}

function encPublic(m: { id: string; name: string; slug: string; fullEntry: boolean } | null) {
  return m ? { id: m.id, name: m.name, slug: m.slug, full_entry: m.fullEntry } : null;
}

// altMatches[i] is the deterministic exact-name encyclopedia match (or null) for r.alternatives[i].
function visitorResult(r: Record<string, any>, extra: Record<string, unknown>, altMatches: any[] = []) {
  return {
    best_match: r.best_match,
    confidence: r.confidence,
    identification_status: r.identification_status,
    what_we_are_seeing: r.what_we_are_seeing,
    observed_features: r.observed_features.slice(0, 6),
    alternatives: r.alternatives.map((a: any, i: number) => ({
      name: a.name,
      reason: a.reason,
      encyclopedia: encPublic(altMatches[i] || null),
    })),
    confirmation_note: r.confirmation_note,
    ...extra,
  };
}

async function handle(req: Request): Promise<Response> {
  const len = Number(req.headers.get("content-length") || "0");
  if (len > MAX_BODY_BYTES) throw new PidError("image_too_large");
  let body: any;
  try {
    body = await req.json();
  } catch {
    throw new PidError("bad_request");
  }

  const kind = body?.kind;
  if (!["initial", "retry", "answer"].includes(kind)) throw new PidError("bad_request");

  // Images are required on initial and retry; on answer the client re-sends the same set
  // (the server stores nothing), so the count rule applies to every call.
  const rawImages = body?.images;
  if (!Array.isArray(rawImages) || rawImages.length < 1 || rawImages.length > MAX_INITIAL_PHOTOS) {
    throw new PidError("bad_image_count");
  }
  const images = rawImages.map(validateImage);

  // ── Session ──
  let session: any;
  if (kind === "initial") {
    const ip = (req.headers.get("cf-connecting-ip") || req.headers.get("x-forwarded-for") || "unknown").split(",")[0].trim();
    const ipHash = (await sha256Hex(`${Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")}|${ip}`)).slice(0, 32);
    const now = Date.now();
    const [{ count: hourCount }, { count: dayCount }] = await Promise.all([
      supa.from("photo_id_sessions").select("id", { count: "exact", head: true }).eq("ip_hash", ipHash).gte("created_at", new Date(now - 3600_000).toISOString()),
      supa.from("photo_id_sessions").select("id", { count: "exact", head: true }).eq("ip_hash", ipHash).gte("created_at", new Date(now - 86400_000).toISOString()),
    ]);
    if ((hourCount || 0) >= RATE_PER_HOUR || (dayCount || 0) >= RATE_PER_DAY) throw new PidError("rate_limited");
    await assertBudget();
    const { data, error } = await supa
      .from("photo_id_sessions")
      .insert({ ip_hash: ipHash, initial_photo_count: images.length, qa_history: [] })
      .select()
      .single();
    if (error || !data) throw new Error("session create failed");
    session = data;
  } else {
    if (typeof body?.session_id !== "string") throw new PidError("session_not_found");
    const { data } = await supa.from("photo_id_sessions").select("*").eq("id", body.session_id).maybeSingle();
    if (!data || data.status !== "in_progress") throw new PidError("session_not_found");
    session = data;
    await assertBudget();
  }

  if (session.call_count >= MAX_CALLS) throw new PidError("session_limit");

  // ── Legality of this action, from stored state ──
  let history: { question: string; answer: string }[] = Array.isArray(session.qa_history) ? session.qa_history : [];
  const patch: Record<string, unknown> = {};
  if (kind === "retry") {
    if (session.pending_action !== "request_photo" || session.photo_retry_used) throw new PidError("session_limit");
    patch.photo_retry_used = true;
  } else if (kind === "answer") {
    const pq = session.pending_question;
    if (session.pending_action !== "ask_question" || !pq || session.question_count >= MAX_QUESTIONS) throw new PidError("session_limit");
    const answer = typeof body?.answer === "string" ? body.answer.trim() : "";
    if (!answer || !Array.isArray(pq.options) || !pq.options.includes(answer)) throw new PidError("bad_request");
    history = [...history, { question: pq.question, answer }];
    patch.question_count = session.question_count + 1;
    patch.qa_history = history;
  }
  const state = { ...session, ...patch };

  // ── Call 1: identification ──
  const content: unknown[] = [{ type: "input_text", text: statusBlock(state, kind, history) }];
  images.forEach((img) => content.push({ type: "input_image", image_url: img, detail: "high" }));

  let callCount = session.call_count + 1;
  let cost = Number(session.est_cost_usd || 0);
  // The call is counted up front; the retry/question counters are committed only once the call succeeds,
  // so a provider failure leaves the same action available (the 4-call cap still bounds it).
  await supa.from("photo_id_sessions").update({ call_count: callCount, updated_at: new Date().toISOString() }).eq("id", session.id);

  let result: Record<string, any>;
  try {
    const out = await callOpenAI(content, INSTRUCTIONS, "photo_id_result", RESULT_SCHEMA, 4000);
    cost += out.costUsd;
    result = coerceResult(out.parsed);
  } catch (e) {
    const extraCost = Number((e as PidError).extra?.costUsd || 0);
    await supa.from("photo_id_sessions").update({ est_cost_usd: cost + extraCost, updated_at: new Date().toISOString() }).eq("id", session.id);
    throw e;
  }

  // ── The application decides what is still legal ──
  const retryUsed = !!state.photo_retry_used;
  const questionsUsed = state.question_count;
  const canRequestPhoto = !retryUsed && callCount < MAX_CALLS;
  const canAsk = questionsUsed < MAX_QUESTIONS && callCount < MAX_CALLS;
  let action = result.next_action as string;
  let photoLimitReached = false;
  if (action === "request_photo" && (!canRequestPhoto || !result.photo_problem)) {
    action = "final";
    // A photo is still what's missing and none may be requested: the approved terminal photo-limit pattern.
    photoLimitReached = result.uncertainty_reason === "insufficient_image_quality" || result.uncertainty_reason === "missing_view";
  }
  if (action === "ask_question" && (!canAsk || !result.question)) action = "final";

  // ── Interim: photo or question ──
  if (action === "request_photo") {
    await supa.from("photo_id_sessions").update({
      ...patch, est_cost_usd: cost, pending_action: "request_photo", pending_question: null, updated_at: new Date().toISOString(),
    }).eq("id", session.id);
    return json({
      session_id: session.id,
      phase: "photo",
      photo_problem: result.photo_problem,
      photo_guidance: result.photo_guidance,
    });
  }
  if (action === "ask_question") {
    const options = result.answer_options.filter((o: string) => normName(o) !== "not sure").slice(0, 5);
    if (options.length < 2) {
      action = "final";
    } else {
      options.push("Not sure");
      await supa.from("photo_id_sessions").update({
        ...patch, est_cost_usd: cost, pending_action: "ask_question",
        pending_question: { question: result.question, options }, updated_at: new Date().toISOString(),
      }).eq("id", session.id);
      return json({
        session_id: session.id,
        phase: "question",
        question: result.question,
        answer_options: options,
        question_number: questionsUsed + 1,
      });
    }
  }

  // ── Final: deterministic encyclopedia matching, then optional Identity Note ──
  const hasWinner = !!result.best_match && result.confidence !== "more_information_needed";
  const match = hasWinner ? await matchEncyclopedia(result.lookup_name || result.best_match) : null;
  const altMatches = await Promise.all(result.alternatives.map((a: any) => matchEncyclopedia(a.name)));

  let identityNote: string | null = null;
  if (
    hasWinner && match?.fullEntry && match.approved &&
    result.identity_note_type_suggested !== "none" && callCount < MAX_CALLS
  ) {
    try {
      await assertBudget();
      callCount += 1;
      const noteContent = [{
        type: "input_text",
        text: `Clarification type requested: ${result.identity_note_type_suggested}\nStone: ${match.name}\n\nApproved Still Point text:\nMaterial Type: ${match.approved.material_type}\nMineral/Physical Identity: ${match.approved.mineral_physical_identity}\nIdentification: ${match.approved.identification}`,
      }];
      await supa.from("photo_id_sessions").update({ call_count: callCount }).eq("id", session.id);
      const out = await callOpenAI(noteContent, NOTE_INSTRUCTIONS, "identity_note", NOTE_SCHEMA, 800);
      cost += out.costUsd;
      const n = (out.parsed as any)?.note;
      identityNote = typeof n === "string" && n.trim() ? n.trim() : null;
    } catch (e) {
      // The note is optional; its failure must never block the result.
      cost += Number((e as PidError).extra?.costUsd || 0);
      console.error("photo-id: identity note skipped", (e as PidError).code || e);
    }
  }

  const unresolved = !hasWinner;
  await supa.from("photo_id_sessions").update({
    ...patch,
    est_cost_usd: cost,
    status: unresolved ? "unresolved" : "final",
    pending_action: null,
    pending_question: null,
    qa_history: null,
    identified_material: hasWinner ? normName(result.lookup_name || result.best_match) : null,
    encyclopedia_match: hasWinner ? !!match : null,
    confidence: result.confidence,
    updated_at: new Date().toISOString(),
  }).eq("id", session.id);

  return json({
    session_id: session.id,
    phase: "result",
    result: visitorResult(result, {
      identity_note: identityNote,
      encyclopedia: encPublic(match),
      photo_limit_reached: photoLimitReached,
      photo_problem: photoLimitReached ? result.photo_problem : null,
    }, altMatches),
  });
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") return json({ error: "bad_request" }, 405);
  try {
    return await handle(req);
  } catch (e) {
    if (e instanceof PidError) {
      const status = e.code === "rate_limited" ? 429 : e.code === "budget" ? 503 : e.code === "timeout" ? 504 : e.code === "provider" || e.code === "malformed" ? 502 : 400;
      return json({ error: e.code }, status);
    }
    console.error("photo-id: unexpected", (e as Error).message);
    return json({ error: "provider" }, 500);
  }
});
