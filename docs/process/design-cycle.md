<!-- Agent-facing process doctrine. EN-only, ungated. The canonical design-development cycle for the Synapse harness — the phase spine the Synapse plugin runs. This is the "how to approach the harness" map; each phase links to the skill/doc that executes it. Not a spec file — safe to edit freely. -->

# Synapse — design-development cycle

The canonical path from a need to a reviewed, shippable seed screen. This is **how a non-designer approaches the harness**: a sequence of phases, each run by a skill, each gated so the next phase can't start until the current one's output is real. It is the spine the **Synapse plugin** bundles and runs in order.

Guided + gate, not advisory: a phase may refuse to advance, and the CI gate catches non-compliance regardless of how the UI was generated (tool freedom is preserved).

## The spine

```
        ┌─ net-new / ambiguous ─→ [1] FRAME ─┐
TRIAGE ─┤                                    ├─→ [2] INTAKE ─→ [3] GENERATE ─→ [4] REVIEW ─→ [5] REFINE
        └─ known screen ─────────────────────┘                                                   │
                                                          ▲                                       │
                                                          └───────── harness edits ───────────────┘
```

## Phase 0 — Triage (always first)

Before anything, classify the work:

- **Net-new or ambiguous surface** — the problem, users, or requirements aren't yet clear → start at **Frame**.
- **Known screen** — a well-understood screen type against a settled part of the product → skip Frame, start at **Intake**.

Triage exists to prevent **research theater**. Do not run Frame on a simple settings or object screen just to be thorough; a research phase with no real inputs manufactures false confidence. When in doubt, ask one question: *do we already know who this is for and what it must do?* If yes, skip to Intake.

## Phase 1 — Frame *(optional)*

**Purpose.** For net-new/ambiguous surfaces only: establish the problem, the real users, and the constraints before any screen is specified.

**Who.** Author (PM–engineer pair), with real product knowledge — not invented personas.

**Runs on.** The design plugin's `user-research` + `research-synthesis`, tailored to AgentOS via `product-context.md`. These structure and elicit; they must not fabricate users or findings.

**Gate to advance.** A problem statement grounded in a real product surface (`product-context.md`) and a named real user role. If these can't be produced from real knowledge, the screen isn't ready — get the facts, don't guess.

**Hands to Intake.** The framed problem + target role + constraints.

## Phase 2 — Intake *(unskippable)*

**Purpose.** Turn the ask into a generation-ready package. This is the front door that closes the "testers gave generic instructions" gap.

**Runs on.** `screen-intake-skill.md`.

**Gate to advance.** All intake refusal gates clear (real data, known viewer role, decided states, on-manifest need, product grounding) **and** the screen-intent JSON passes `python3 tools/validate.py page <file>`. Off-manifest needs that are spec'd but not yet implemented are logged as RC6 in the refinement register.

**Hands to Generate.** A filled PRD (`템플릿-PRD.md`), a validated screen-intent JSON, and the assembled generation prompt (generation-block + intent + explicit anti-pattern "do NOT" lines).

## Phase 3 — Generate

**Purpose.** Produce the UI from the package.

**Runs on.** Any generation tool the author prefers — the harness supplies the prompt, not the tool. `design.md` raises first-output quality; enforcement is the gate, not the tool.

**Gate to advance.** Output exists in the expected form (spec-conformant markup, or runnable `@enhans-jooyeon/synapse` code where the component is implemented) with a Storybook story per required state.

**Hands to Review.** The generated output + its PRD.

## Phase 4 — Review

**Purpose.** Separate machine-checkable compliance from human judgment.

**Runs on.** The CI gate first (`validate.py all` / `tooling/product-gates`), then the human review in `디자인-리뷰-프로토콜.md`.

**Gate to advance.** **The gate must be green before a human looks.** A human hand-checking tokens, spacing, or component provenance means the harness has a hole — fix the hole, don't add a review step. Human review is judgment-only and yields one of three outcomes (approve / revise-in-scope / reject).

**Hands to Refine.** Any dissatisfaction, defect, or judgment miss — especially outputs that passed the gate but still fall short.

## Phase 5 — Refine

**Purpose.** Convert dissatisfaction into a *harness* improvement, not a one-off screen fix. Closes the loop back to the contract every earlier phase depends on.

**Runs on.** `harness-refinement-protocol.md`, logged in `harness-refinement-register.md`.

**Gate to advance (loop closure).** Each confirmed defect is root-caused (RC1–RC6) and routed to a harness fix; proposed edits are held until June approves and pushes. Applied edits feed back into the contract, raising the floor for every future run of the cycle.

## How this reaches the team

Bundled as the **Synapse plugin**: the phases above become sequenced skills a teammate runs inside their agent tool, each refusing to advance until its gate clears. The repo remains the source of truth; the plugin is the guided surface over it. No standalone app — the generation tool the team already uses does the generating.

## One-line summary

Triage → (Frame if net-new) → Intake (unskippable, validated) → Generate (any tool) → Review (gate green, then judgment) → Refine (defects become harness edits). Guided by skills, enforced by the gate.
