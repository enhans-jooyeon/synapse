<!-- Agent-facing process doctrine. EN-only, ungated, no KO required (docs/process/ is outside the validate.py scope). Companion to 디자인-리뷰-프로토콜.md: that doc governs the TEAM's human review; this doc governs the MAINTAINER's harness-refinement loop (June + Claude). Not a spec file — safe to edit freely. -->

# Synapse — harness refinement protocol

The disciplined loop for turning team test outputs — and June's dissatisfaction with them — into targeted improvements to the **harness** (the generative contract: `design.md`, `foundations.md`, `components.md`, `ai-patterns.md`, the gate, the reference patterns). It is the mechanized form of the "harness owner — feedback-loop triage" role in the review protocol.

Read this whenever we sit down to raise UI-generation quality from test evidence.

## 0. What this is — and is not

- **It refines the harness, not the screen.** The output under review is disposable evidence. The deliverable is a change (or a decision not to change) to the *contract that generates all future screens*. If we end a cycle having improved one screen but not the harness, we failed.
- **It grades against Synapse's contract first, generic best-practice last.** Synapse is deliberately austere — neutral, black-key, borders-first, engineered restraint, "precision instrument, not a consumer app." Generic UI best-practice (more color, shadows, visual interest, rounded warmth) actively *fights* that identity. The contract is the ruler. Generic principles fill only the silences the contract leaves.
- **It never commits without June's explicit approval.** Every cycle may produce proposed edits. They are drafted, shown, and held. Nothing lands in the spec files, the gate, or git until June says so.

## 1. The core principle: mine the delta, don't trust the self-assessment

A model assessing its own generative output is an echo chamber: the same priors that produced a flaw tend to rate that flaw acceptable. So a bare self-assessment will systematically miss exactly what June is dissatisfied with.

The signal that matters is **the delta between the blind self-assessment and June's feedback.** Therefore the assessment is always done *blind first*, June's feedback is revealed *second*, and the cycle's real work is in the disagreements:

| Bucket | Meaning | Priority |
|---|---|---|
| **Agreement** — both flagged it | Confirmed harness gap. Straightforward to route. | Normal |
| **Missed** — June flagged, Claude didn't | Blind spot. Claude's priors are miscalibrated the *same way the generator's are* — this is the highest-value finding, because it's invisible to automated self-review. | **Highest** |
| **Over-flag** — Claude flagged, June is fine | Either the contract is too strict, or Claude is smuggling in generic best-practice that fights the character. Interrogate before "fixing." | Investigate |

## 2. Inputs June provides per cycle

Collect these before starting. Missing inputs weaken the conclusion — name the weakness explicitly rather than papering over it.

1. **The output** — screenshot/image and/or the generated code/files.
2. **The prompt / intent that produced it** — ideally the PRD or screen-intent used (ties to `tools/screen-intent.schema.json`). *Critical:* without it we cannot separate a harness failure from a garbage-in prompt failure (root cause RC5).
3. **The harness version** that generated it (so register entries are longitudinal).
4. **June's dissatisfaction notes** — provided **after** step 3.1, never before.

If (2) is missing, flag the attribution risk: a bad screen from a vague prompt may indict the prompt, not the harness.

## 3. The loop

### 3.1 Blind self-assessment (before seeing June's feedback)
Grade the output against the rubric in §4. Produce a short, itemized critique: each issue gets a one-line description, a rubric tier (A–D), and a severity (blocker / major / minor). Be honest and specific; vague praise is worthless here. Do **not** yet propose fixes.

### 3.2 Reveal and compute the delta
June provides her feedback. Sort every issue — mine and hers — into the three buckets in §1. State the misses plainly; do not retroactively claim to have caught something. The misses are the point.

### 3.3 Root-cause each confirmed issue
For every issue in **Agreement** and **Missed** (and any **Over-flag** that survives interrogation), assign exactly one root cause from the taxonomy in §5. This is the step that converts a critique into a harness change.

### 3.4 Route the fix
Map each root cause to where its fix lands (§6). Distinguish sharply between *gate-enforceable* and *un-lintable* — the un-lintable ones cannot be automated and must become prose guidance plus a human-review checkpoint, not a false promise of a new gate rule.

### 3.5 Log
Write one register entry per confirmed issue in `harness-refinement-register.md` (§7 of that file). Recurring root causes across cycles are the real map of where the harness is weakest.

### 3.6 Propose edits (do not apply)
Draft the concrete change for each routed fix: the exact file, the current text, the proposed text, and a one-line rationale tied to the root cause. Present as a reviewable diff. **Stop here.**

### 3.7 Approval and apply
On June's explicit go — per approved edit, not in bulk unless she says so — apply under the standing working discipline: version lockstep only when she cuts a release (otherwise land under `## Unreleased` in `CHANGELOG.md`), `build_manifest.py` after any bump, gate green (`validate.py all` → 0/0), preview JS `node --check`, `.ko.md` refresh for any changed EN spec, and **June pushes from her Mac**. Update the register status and refresh `HANDOFF.md`.

## 4. Grading rubric (the ruler, in priority order)

Grade top-down. A lower tier never overrides a higher one. An issue is tagged with the *highest* tier it violates.

- **Tier A — Contract compliance.** Does it obey the closed sets and hard rules: tokens only (no raw hex/rgb — SY001), on-scale spacing/radius/type (SY002), real components not re-implementations, required state coverage (SY108), viewer/permission context (SY109), one primary per region (SY014), contrast pairs, glossary/voice (SY012). *Much of Tier A is already the gate's job* — if a Tier-A violation reached June, that itself is a finding (RC3: the gate has a hole).
- **Tier B — Character fidelity.** Does it embody the system's character: neutral/black-key, borders-first, dense-but-legible, engineered restraint? Or does it drift toward consumer-app polish (decorative color, gratuitous shadow/gradient, oversized rounding, marketing warmth)? **This tier is the un-lintable core** and the most likely home of June's dissatisfaction.
- **Tier C — Visual craft within the system.** Hierarchy, alignment, spacing rhythm, information density and grouping, scannability, handling of empty/loading/error/overflow, keyboard and a11y affordances — done *well*, not merely *present*.
- **Tier D — Generic best-practice.** Only where Tiers A–C are silent. If a Tier-D instinct conflicts with Tier B, Tier B wins and the instinct is discarded.

## 5. Root-cause taxonomy

Every confirmed defect maps to exactly one:

- **RC1 — Missing rule.** The contract is silent on this case.
- **RC2 — Weak / ambiguous rule.** The contract addresses it but too softly or interpretably; the generator read it and still went wrong.
- **RC3 — Gate gap.** A checkable rule exists in prose but `validate.py` doesn't enforce it (or enforces it too narrowly); a bad output passed the gate.
- **RC4 — Un-lintable quality.** Inherently a judgment call (most of Tier B/C craft). Cannot be mechanized; needs prose guidance + a human-review checkpoint.
- **RC5 — Prompt / intent failure.** Not a harness fault — the prompt was vague or wrong. Possible sub-finding: the harness should scaffold intent better (screen-intent schema / PRD template).
- **RC6 — Coverage gap.** The needed component or pattern doesn't exist yet (the storybook lib is 4 of 52). Feeds the component build-out backlog, not a spec edit.

## 6. Fix routing

| Root cause | Where the fix lands |
|---|---|
| RC1 / RC2 | Prose edit to the relevant spec file (`design.md` / `foundations.md` / `components.md` / `ai-patterns.md`), with `.ko.md` refresh. |
| RC3 | New or tightened `SYxxx` rule in `tools/validate.py`, mirrored into `tooling/product-gates/`. Prefer this whenever a defect is *mechanically checkable* — a gate beats a guideline. |
| RC4 | Prose "quality guidance" in the spec **and** an item added to the human-review checklist (review protocol / PR template). Be explicit that this is not automatable. |
| RC5 | Improve the PRD template / `screen-intent.schema.json` / prompting guidance. No spec change. |
| RC6 | Add to the component build-out backlog (distribution critical path). Note it; don't fake a fix. |

## 7. Guardrails (what the assessment must not do)

- **Don't push consumer-app polish.** Any proposed edit must be defensible against Synapse's character. "It looks more modern/friendly/premium" is a red flag, not a rationale.
- **Don't fix symptoms.** No edit that would only correct the one screen in hand without generalizing to the class of defect.
- **Don't launder the misses.** Report blind-assessment misses honestly; they are the most valuable output.
- **Don't over-fit to one screen.** One dissatisfying output may be a worst-case or a prompt artifact. Look for the pattern across cycles (the register) before large edits.
- **Don't promise a gate for an un-lintable problem.** If it's judgment, say so and route to RC4.
- **Don't commit.** Draft, show, hold. June approves and pushes.

## 8. One-line summary

Assess blind → reveal June's feedback → mine the delta → root-cause each confirmed defect → route to a *harness* fix → log it → propose the diff → wait for approval.
