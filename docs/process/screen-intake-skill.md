<!-- Agent-facing runnable skill (repo-resident so it travels to any generation tool; can be lifted into an installable SKILL.md later). EN-only, ungated. This is the UNSKIPPABLE front door to generation: it turns a non-designer's one-line ask into a generation-ready package. Companion to prd-template.md (the PRD it fills) and tools/screen-intent.schema.json (the JSON it produces). Not a spec file — safe to edit freely. -->

# Synapse — screen intake (guided)

**Run this before generating any screen.** It exists because testers went straight to the model with generic instructions and never realized a PRD was required. The user does **not** write a PRD — they just say what they want in a sentence or two. This skill reads that prompt, keeps whatever it already answers, and **asks targeted questions only for the PRD sections that are still missing** — turning a simple ask into a **generation-ready package** (a filled PRD plus a *validated* screen-intent JSON) and refusing to hand off until the intent is real.

## Prime directive: elicit, never invent

This skill **extracts real inputs from the human**. It does not fabricate them. If the user can't answer a required question, that is a signal — either they go get the real answer, or the screen isn't ready to generate. The skill must **never** invent field names, data, user roles, or requirements to fill a gap. Fabricated "research" or placeholder data is worse than a blank, because it launders a guess as a decision.

## Inputs to start

Just a one-line intent from the user, e.g. *"a screen where an operator reviews an agent run before approving it."* Everything else is elicited below.

## Grounding sources (read first)

- `product-context.md` — the AgentOS product model (entities, roles, JTBD, IA, tone). **The user's intent must map onto a real product surface here.** If this file doesn't exist yet, say so and ask the user for the product facts inline; do not guess.
- `synapse.manifest.json` — the closed sets this intake must resolve to: 6 archetypes (`workbench`, `object`, `settings`, `guided`, `console`, `home`), 16 recipes (`R1`–`R16`), 57 components, and the `never` list.
- **Tools (`tools/synapse.py`)** — call these instead of reading the manifest by hand: `synapse lookup <name>` (is a component / token / recipe / archetype real? prints its rules, or the closest matches if not), `synapse validate <intent.json>` (validate the screen-intent), `synapse gate` (full contract check).
- `prd-template.md` — the PRD this skill fills. `tools/screen-intent.schema.json` — the JSON this skill emits.

## Gap analysis first — ask only what's missing

Do **not** march the user through every question. Read their opening prompt and map it against the field checklist below. Classify each field:

- **Covered** — the prompt gives a real, specific answer. Keep it; confirm it back in one line (*"Got it — viewer is the Ops reviewer, the object is the agent run"*). Don't re-ask.
- **Partial** — the topic is mentioned but the answer isn't usable yet (*"some data"*, *"the usual states"*). Ask one targeted follow-up.
- **Missing** — not addressed. Ask.

**Hold the same bar as the refusal gates: a *mention* is not an *answer*.** "It has a table" does not cover the data field until real field names and rows exist; "for admins" doesn't cover permissions until the viewer role is named. Being generous here just relocates the hand-waving downstream and defeats the point.

Then ask only the **Partial + Missing** fields, in the checklist order, and stop as soon as every field is Covered. A one-line prompt that already pins down the surface, user, and data should sail through with two or three questions; a vague one gets the full set.

## The field checklist (ask only the gaps)

Ask only the fields the gap analysis flagged **Partial** or **Missing**, in this order. Each maps to a PRD field and/or a schema field. Confirm real answers before moving on; summarize back what you heard.

1. **Product grounding.** Which AgentOS surface/entity is this, per `product-context.md`? What does it connect to upstream/downstream? → resolves the **archetype** (one of the 6). If the user can't place it in the product, stop and locate it together.
2. **User & goal.** Who arrives here (which role from the product-context role model) and what are they trying to accomplish? What's the entry point? → PRD *Context*, schema `permissions.viewer_role`.
3. **Real data (no placeholders).** Actual field names, realistic quantities, and real KO **and** EN strings — short and long. Refuse "Lorem ipsum" / "Item 1". → PRD *Data / content examples*.
4. **States (walk every one).** Confirm behavior for `default`, `empty`, `loading`, `error`, `overflow / long content`, `long Korean string`, and each `permission variant`. → PRD *Required states*, schema `states` + SY108.
5. **Permissions.** The viewer role, any plan-gated capabilities hidden, any org-obtainable capabilities shown-but-disabled with a reason. → schema `permissions` + SY109.
6. **Requirement → composition matching.** Map the need to `archetype → regions → components (manifest keys) + recipes (R1–R16)`. Prefer a recipe before composing from scratch. Every component named must be an exact manifest key — **verify each with `synapse lookup <name>`**; if it returns NOT FOUND, use the suggested closest match or log an RC6. → schema `regions`.
7. **Anti-patterns.** Pull the `never`-list items and the archetype's anti-patterns relevant to this screen and state them as explicit "do NOT" lines (negative instructions measurably improve output). → PRD *Constraints & anti-patterns*.
8. **Acceptance criteria + open questions** for the reviewer. → PRD *Acceptance criteria*, *Open questions*.

## Refusal gates (stop and push back)

Do not proceed to handoff if any of these is true:

- **No real data** — step 3 answered with placeholders. (The single biggest cause of "plausible but wrong-shaped" UI.)
- **Unknown viewer role** — step 5 can't name a role from the product model.
- **Missing state decisions** — any of the mandatory states in step 4 is undecided.
- **Off-manifest need** — the intent requires a component/variant not in the manifest, or something on the `never` list. Do not substitute silently.
- **No product grounding** — the intent doesn't map to any surface in `product-context.md`.

When a gate trips, name the specific gap and what's needed to clear it. A refused screen is a correct outcome, not a failure.

## Coverage flag (RC6 hook)

If step 6 needs a component that exists in the **manifest/spec** but not yet as a React implementation in `storybook/` (currently 4 of 57 implemented), flag it explicitly: spec-conformant markup can be generated, but runnable `@enhans-jooyeon/synapse` code cannot until the component is built. Log it as an **RC6 (coverage gap)** entry in `harness-refinement-register.md` — this is how the intake feeds the harness backlog.

## Outputs (the generation-ready package)

1. **Filled PRD** using `prd-template.md`, with the *Generation instructions* block placed first (it becomes the prompt).
2. **screen-intent JSON** conforming to the schema, then **validated**: `python3 tools/synapse.py validate <file>` must pass (wraps `validate.py page`). Errors mean fix the *declaration*, not the rendering.
3. **The assembled generation prompt** — PRD generation-block + the validated intent + the explicit anti-pattern "do NOT" lines.

## Handoff

Hand the package to the generation tool of the user's choice (tool freedom is preserved — the harness raises first-output quality, CI enforces compliance). After generation, the output goes through the normal gated review (`design-review-protocol.md`); dissatisfaction feeds `harness-refinement-protocol.md`.

## One-line summary

Simple prompt → parse it, keep what's answered → ask only the missing PRD pieces (real answers, not mentions) → archetype + data + states + permissions + component match → refuse on hand-waving → emit a filled PRD + validated intent JSON → hand off to any generator.
