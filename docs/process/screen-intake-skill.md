<!-- Agent-facing runnable skill (repo-resident so it travels to any generation tool; can be lifted into an installable SKILL.md later). EN-only, ungated. This is the UNSKIPPABLE front door to generation: it turns a non-designer's one-line ask into a generation-ready package. Companion to 템플릿-PRD.md (the PRD it fills) and tools/screen-intent.schema.json (the JSON it produces). Not a spec file — safe to edit freely. -->

# Synapse — screen intake (guided)

**Run this before generating any screen.** It exists because testers went straight to the model with generic instructions and never realized a PRD was required. This skill makes intent unskippable: it walks a non-designer from *"I want a screen for X"* to a **generation-ready package** — a filled PRD plus a *validated* screen-intent JSON — and refuses to hand off until the intent is real.

## Prime directive: elicit, never invent

This skill **extracts real inputs from the human**. It does not fabricate them. If the user can't answer a required question, that is a signal — either they go get the real answer, or the screen isn't ready to generate. The skill must **never** invent field names, data, user roles, or requirements to fill a gap. Fabricated "research" or placeholder data is worse than a blank, because it launders a guess as a decision.

## Inputs to start

Just a one-line intent from the user, e.g. *"a screen where an operator reviews an agent run before approving it."* Everything else is elicited below.

## Grounding sources (read first)

- `product-context.md` — the AgentOS product model (entities, roles, JTBD, IA, tone). **The user's intent must map onto a real product surface here.** If this file doesn't exist yet, say so and ask the user for the product facts inline; do not guess.
- `synapse.manifest.json` — the closed sets this intake must resolve to: 6 archetypes (`workbench`, `object`, `settings`, `guided`, `console`, `home`), 12 recipes (`R1`–`R12`), 52 components, and the `never` list.
- `템플릿-PRD.md` — the PRD this skill fills. `tools/screen-intent.schema.json` — the JSON this skill emits.

## The intake sequence

Ask these in order. Each maps to a PRD field and/or a schema field. Confirm real answers before moving on; summarize back what you heard.

1. **Product grounding.** Which AgentOS surface/entity is this, per `product-context.md`? What does it connect to upstream/downstream? → resolves the **archetype** (one of the 6). If the user can't place it in the product, stop and locate it together.
2. **User & goal.** Who arrives here (which role from the product-context role model) and what are they trying to accomplish? What's the entry point? → PRD *컨텍스트*, schema `permissions.viewer_role`.
3. **Real data (no placeholders).** Actual field names, realistic quantities, and real KO **and** EN strings — short and long. Refuse "Lorem ipsum" / "Item 1". → PRD *데이터/콘텐츠 예시*.
4. **States (walk every one).** Confirm behavior for `default`, `empty`, `loading`, `error`, `overflow / long content`, `long Korean string`, and each `permission variant`. → PRD *필수 상태*, schema `states` + SY108.
5. **Permissions.** The viewer role, any plan-gated capabilities hidden, any org-obtainable capabilities shown-but-disabled with a reason. → schema `permissions` + SY109.
6. **Requirement → composition matching.** Map the need to `archetype → regions → components (manifest keys) + recipes (R1–R12)`. Prefer a recipe before composing from scratch. Every component named must be an exact manifest key. → schema `regions`.
7. **Anti-patterns.** Pull the `never`-list items and the archetype's anti-patterns relevant to this screen and state them as explicit "do NOT" lines (negative instructions measurably improve output). → PRD *제약과 안티패턴*.
8. **Acceptance criteria + open questions** for the reviewer. → PRD *수용 기준*, *열린 질문*.

## Refusal gates (stop and push back)

Do not proceed to handoff if any of these is true:

- **No real data** — step 3 answered with placeholders. (The single biggest cause of "plausible but wrong-shaped" UI.)
- **Unknown viewer role** — step 5 can't name a role from the product model.
- **Missing state decisions** — any of the mandatory states in step 4 is undecided.
- **Off-manifest need** — the intent requires a component/variant not in the manifest, or something on the `never` list. Do not substitute silently.
- **No product grounding** — the intent doesn't map to any surface in `product-context.md`.

When a gate trips, name the specific gap and what's needed to clear it. A refused screen is a correct outcome, not a failure.

## Coverage flag (RC6 hook)

If step 6 needs a component that exists in the **manifest/spec** but not yet as a React implementation in `storybook/` (currently 4 of 52 implemented), flag it explicitly: spec-conformant markup can be generated, but runnable `@enhans-jooyeon/synapse` code cannot until the component is built. Log it as an **RC6 (coverage gap)** entry in `harness-refinement-register.md` — this is how the intake feeds the harness backlog.

## Outputs (the generation-ready package)

1. **Filled PRD** using `템플릿-PRD.md`, with the *생성 지시* block placed first (it becomes the prompt).
2. **screen-intent JSON** conforming to the schema, then **validated**: `python3 tools/validate.py page <file>` must pass. Errors mean fix the *declaration*, not the rendering.
3. **The assembled generation prompt** — PRD generation-block + the validated intent + the explicit anti-pattern "do NOT" lines.

## Handoff

Hand the package to the generation tool of the user's choice (tool freedom is preserved — the harness raises first-output quality, CI enforces compliance). After generation, the output goes through the normal gated review (`디자인-리뷰-프로토콜.md`); dissatisfaction feeds `harness-refinement-protocol.md`.

## One-line summary

One-line ask → grounded in the product → archetype + real data + states + permissions + component match → refuse on hand-waving → emit a filled PRD + validated intent JSON → hand off to any generator.
