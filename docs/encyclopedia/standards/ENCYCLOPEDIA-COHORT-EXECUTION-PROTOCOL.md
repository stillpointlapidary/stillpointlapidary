# STILL POINT LAPIDARY / COHORT 3 EXECUTION PROCESS v1.1 FINAL

📅 2026-06-30
📌 Status: Ready for Christie Approval
🧱 System State: Deterministic Classification Model Active

---

## 1. PURPOSE

This protocol defines the controlled execution pipeline for Cohort 3 and all future cohorts, governing:

- cohort intake
- structured research passes
- Energetic Role resolution
- MD drafting
- Supabase-ready output preparation

It enforces strict separation between:

- research
- synthesis
- normalization
- publication

---

## 2. GLOBAL SCOPE CORRECTION (IMPORTANT)

**NOT PART OF COHORT 3 WORK**

The following are Production Master cleanup tasks only:

- Hematite (already published)
- Malachite
- Moonstone
- Sodalite
- Sunstone

✔ These are handled by Claude Code only
✔ Not part of Cohort 3 research pipeline
✔ Not included in Pass 1–4 processing

**COHORT 2 FINAL STATE (REFERENCE ONLY)**

Cohort 2 = 7 stones:

- Labradorite
- Lapis Lazuli
- Lepidolite
- Pyrite
- Howlite
- Moss Agate
- Ocean Jasper

✔ Already locked (Energetic Role + Element finalized)
✔ No further research changes allowed unless Christie updates

---

## 3. SCOPE OF THIS DOCUMENT

This document controls:

- cohort intake and sequencing
- pass order and pass rules (Passes 1–4)
- gate flow and blocking conditions
- escalation triggers and escalation targets
- concurrency rules between cohorts
- submission and delivery format standards

This document does not control:

- page sections, layout behavior, or implementation — see `ENCYCLOPEDIA-PAGE-STRUCTURE.md`
- field definitions, counts, or optionality — see `ENCYCLOPEDIA-CONTENT-FIELDS.md`
- prose style or research evidence standards — see `ENCYCLOPEDIA-WRITING-AND-RESEARCH.md`
- source eligibility — see `ENCYCLOPEDIA-APPROVED-SOURCES.md`
- database schema, columns, or SQL — see `ENCYCLOPEDIA-DATABASE-REFERENCE.md`
- stone-specific structured values — see locked production data
- approved public copy — see approved canonical MD

When two sources conflict within the same domain, stop and escalate to Christie. Do not resolve silently.

---

## 4. COHORT SIZE RULES

- Standard cohort: ≤ 10 stones
- MD batch: ≤ 5 stones
- Only one cohort in research at a time
- MD drafting may overlap ONLY with previous cohort's completed research phase

No parallel research streams.

---

## 5. GATE 0 — ROSTER PREFLIGHT (HARD BLOCK)

Uses:
👉 ENCYCLOPEDIA-COHORT-PREFLIGHT.md

Each stone must validate:

**Required fields**

- Stone ID
- canonical slug
- tier alignment (333 catalog lock)
- Material Type OR exception flag
- Primary chakra
- Styling chakra
- Energetic Role (or explicit "pending")
- Color Energy (or flag)
- Element (or flag)
- navigation links
- image status

**BLOCKING CONDITIONS (STOP COHORT)**

- slug mismatch
- missing ID
- tier mismatch with catalog lock
- pre-assigned Energetic Role outside 12-value system
- unresolved material identity type

👉 If ANY exist → cohort cannot begin

---

## 6. RESEARCH PIPELINE (4-PASS SYSTEM)

### PASS 1 — GEOLOGICAL IDENTITY (LOCKED FACT LAYER)

Sources:
Mindat, GIA, IMA, RRUFF, USGS, Handbook of Mineralogy

Outputs:

- classification (mineral/rock/mineraloid/etc.)
- formation
- locality
- treatment status
- identity conflicts (flag only)

Rules:

- NO metaphysics
- NO chakra
- NO Energetic Role
- NO interpretation

### PASS 2 — METAPHYSICAL CONSENSUS (CANDIDATE ONLY)

Sources:
Tier A+ → A → B hierarchy

Outputs:

- chakra
- element (candidate validation)
- zodiac (if strong consensus)
- Energetic Role CANDIDATES ONLY

Rules:

- NO final Energetic Role assignment
- NO blending terms
- NO synonym expansion
- NO invention of categories

If weak consensus → mark:

> INSUFFICIENT CONSENSUS

### PASS 3 — COLLECTOR CONTEXT LAYER

Outputs:

- care implications (non-spiritual)
- market context
- confusion risks (trade names, composites)
- related stone candidates

Rules:

- observational only
- no metaphysical escalation
- no role assignment

---

## 6a. OUTPUT AND SUBMISSION STANDARDS

### Gate Submission Format

Final pass submissions must contain only: locked values table, documented conflicts with resolution rationale, and open escalations. Internal working notes, omit/narrow lists, and per-stone evidence breakdowns are not included in submissions.

### Pass 3 and Beyond — File Delivery

Pass 3 output and all subsequent pass outputs must be delivered as downloadable files. Do not paste full pass output into the chat. Claude Chat will analyze files directly.

---

### PASS 4 — NORMALIZATION + ROLE RESOLUTION (CRITICAL LOCK)

Inputs:

- Pass 1–3 outputs
- 12-value Energetic Role system

Process:

- map candidates → ONLY allowed roles
- select exactly one PRIMARY ROLE
- validate against vocabulary list

**VALID ROLE SET (HARD CONSTRAINT)**

1. Grounding
2. Protection
3. Vitality
4. Heart Healing
5. Calm & Peace
6. Emotional Regulation
7. Clarity & Focus
8. Intuition
9. Spiritual Connection
10. Transformation
11. Manifestation
12. Amplification

**FAILURE MODE**

If no clean mapping:

- STOP
- present top 2 candidates
- escalate to Christie
- DO NOT assign fallback

---

## 7. NEW PRE-SUBMISSION VALIDATION GATE (ADDED)

Before ANY output (MD, matrix, Supabase payload):

**REQUIRED CHECK:**
scan output for non-vocabulary Energetic Role terms

If found:

- self-correct BEFORE submission
- if unresolved → escalate

Examples of invalid terms:

- "Stability"
- "Grounded Energy"
- "Insight"
- "Calming Presence"

These MUST map to one of the 12 roles or be rejected.

---

## 8. CLEAN PATH ELIGIBILITY

A stone may use compressed processing ONLY if:

- single mineral species
- no trade-name ambiguity
- no treatment uncertainty
- no composite or rock complexity
- stable metaphysical consensus
- no identity conflicts in Pass 1

Otherwise → full 4-pass system required.

---

## 9. EXCEPTION ROUTING (PRE-PASS 1)

Flag BEFORE research:

- rocks
- mineraloids
- composites
- organics
- synthetics
- fossils
- trade names
- mixed materials
- treated stones

Must include:

- classification type
- uncertainty level
- research safety flag

---

## 10. MD GENERATION RULES

- max 5 stones per batch
- one batch at a time
- no concurrent research + drafting on same cohort
- strictly follow:
  - Content Fields doc
  - Writing & Research doc

No new research during MD stage.

---

## 11. PRODUCTION MASTER OWNERSHIP

- Claude Code = ONLY writer
- Claude Chat = structure + validation
- Lyra = synthesis + briefing

Never:

- manually edit production file without Claude Code
- bypass validation chain

---

## 12. COHORT CONCURRENCY MODEL (CLARIFIED)

**Allowed:**

- Cohort A → research phase
- Cohort B → MD drafting phase

**NOT allowed:**

- two cohorts in research simultaneously
- two cohorts in MD drafting simultaneously

---

## 13. ESCALATION TRIGGERS

Escalate to Christie if:

- Energetic Role cannot resolve cleanly
- identity conflict persists after Pass 1
- material classification is disputed
- catalog-tier mismatch appears
- exception affects schema integrity

---

## 14. SYSTEM INTENT STATEMENT

Cohort 3 operates as:

> a deterministic classification pipeline with controlled semantic resolution

Meaning:

- no interpretive freedom in role assignment
- no vocabulary drift
- no parallel research ambiguity
- strict escalation at uncertainty boundaries

---

## ✔ FINAL STATE

This is now the fully integrated Cohort 3 execution protocol, including:

✔ Claude Chat corrections
✔ Cohort 2 scope correction
✔ Production Master separation logic
✔ Element dependency handling
✔ Energetic Role enforcement upgrade
✔ Concurrency clarification
✔ Self-validation rule addition
