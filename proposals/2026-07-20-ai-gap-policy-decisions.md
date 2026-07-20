# AI gap patterns — policy & governance decisions to resolve before UI

**Date:** 2026-07-20 · **Companion to:** `2026-07-20-shapeof-ai-pattern-audit.md` · **Tracker:** `2026-07-20-ai-gap-decision-register.xlsx`

## Why this doc exists

The Shape-of-AI audit surfaced a set of pattern gaps. June's read is correct: most of them can't be designed until upstream **policy, governance, and product-logic calls** are made — and several of those calls (data retention, memory, consent) aren't design's to make alone. This document lists, per gap, the decisions that must be settled first, the realistic options, who should own each call, and what's blocked until it's answered. The paired spreadsheet is the working tracker where each DRI records the decision and signs off.

**This is deliberately not a design doc.** No UI is proposed here. The point is to get the prerequisites decided so that when we *do* design, we're not re-litigating policy inside a Figma review.

## How to use it

1. Skim this brief for context on each area.
2. Open the register (`.xlsx`), filter by **Suggested DRI** to find your rows.
3. Fill **Decision**, **Owner sign-off**, **Status**, and **Notes**. Flag anything you disagree with in Notes.
4. Decisions marked **Blocks** must be resolved before the dependent ones can be finalized.

### DRI legend (suggested owners — adjust to your actual org)

- **PM** — Product Management (owns the call unless noted)
- **DES** — Design
- **LEG** — Legal & Privacy
- **SEC** — Security / IT admin
- **CMP** — Compliance
- **ML** — Data / ML Platform
- **ENG** — Engineering
- **FIN** — Finance / Billing
- **BRD** — Brand / Content

Each decision has a **primary** owner (makes the call) and **consulted** functions (must be heard).

---

## 1. Memory — what the agent remembers about a user / workspace

*Why policy-first:* what may be stored, for how long, who can see it, and whether it feeds training are legal/security calls, not UI calls. The UI (a memory manager, a "saved to memory" chip) is trivial once these are set — and impossible to design honestly before.

- **M1 · Eligibility.** What is eligible to be remembered — stable preferences/identity, explicit user-stated facts, derived behavior, raw conversation content? Draw the line. *(Primary: PM · Consulted: LEG, SEC)*
- **M2 · Scope & isolation.** Is memory global-per-user, per-workspace, per-space/project, or per-agent? How are scopes isolated so *work* context never leaks into *personal* (and vice versa)? *(Primary: PM · Consulted: SEC)* — **Blocks M-UI**
- **M3 · Capture trigger.** Automatic capture, explicit user confirmation, or hybrid? What's the moment a memory is written? *(Primary: PM · Consulted: DES)*
- **M4 · Retention & deletion.** Do memories persist indefinitely, decay, or expire? User-deletable? Admin-deletable? Bulk purge? *(Primary: LEG · Consulted: PM, SEC)*
- **M5 · Visibility & edit rights.** Can a user view/edit all their memories? Can a workspace admin see workspace-scoped memories? *(Primary: PM · Consulted: SEC, LEG)*
- **M6 · Enterprise controls.** Can an org admin disable memory org-wide, set a retention policy, and audit what's stored? *(Primary: SEC · Consulted: CMP, PM)*
- **M7 · Memory ≠ training.** Are memories ever used to train/improve models, or strictly runtime recall? *(Primary: LEG · Consulted: ML)* — depends on **D1/D3**

## 2. Incognito / memory-off — interacting outside memory

*Why policy-first:* the hard question isn't the toggle, it's what incognito actually suspends — and whether enterprise audit obligations *forbid* a true off-the-record mode.

- **I1 · Granularity.** Session-level toggle, per-message, or a designated "no-memory" space? *(Primary: PM · Consulted: DES)*
- **I2 · What it excludes.** Memory only — or also logging, audit trail, training, and connectors? Note the tension: compliance may **require** audit logging even in incognito, which limits how "private" it can truthfully be. *(Primary: CMP · Consulted: LEG, SEC)* — **Blocks I-UI**
- **I3 · Connector behavior.** Which integrations are disabled or read-only in incognito? *(Primary: SEC · Consulted: PM)*
- **I4 · Admin authority.** Can an org forbid incognito (for recordkeeping) or force it in certain contexts? *(Primary: CMP · Consulted: PM)*

## 3. Data ownership — training vs retention controls

*Why policy-first:* this is a legal/exec commitment and an enterprise sales gate long before it's a settings screen. It also feeds Memory (M7) and Incognito (I2).

- **D1 · Training default.** Is customer data used to improve models by default? Opt-in or opt-out, and does it differ by tier (free vs. team vs. enterprise)? *(Primary: LEG · Consulted: PM, exec, ML)* — **Blocks D-UI, M7**
- **D2 · Retention default & duration.** How long are prompts, outputs, and attachments retained by default? Configurable floor/ceiling? *(Primary: LEG · Consulted: SEC)*
- **D3 · Separated permissions.** Are "train on my data" and "retain my data" independent controls (the audit's recommendation)? *(Primary: LEG · Consulted: PM)*
- **D4 · Scope of control.** User-level, workspace-level, or org-admin-level — and who can change it? *(Primary: SEC · Consulted: PM)*
- **D5 · Residency, deletion, export.** Data-residency regions, right-to-delete, export format — the GDPR/enterprise obligations. *(Primary: CMP · Consulted: LEG, ENG)*
- **D6 · Connector-sourced data.** How is data pulled from connectors governed for retention and training, and treated as untrusted (prompt-injection)? *(Primary: SEC · Consulted: LEG)*
- **D7 · In-product disclosure.** Where is the default stated *in the UI itself* (not just the policy PDF)? *(Primary: DES · Consulted: LEG)*

## 4. Consent — capturing third parties' data *(gated)*

*Why policy-first:* only relevant if the product ever records or ingests other people's data. Answer C1 first; if "no," park the rest.

- **C1 · Do we capture third-party data at all?** Meeting audio, shared docs, others' messages? If no → park §4. *(Primary: PM)* — **Gate**
- **C2 · Consent model.** Opt-in, with recording/training/sharing consent separated and reversible? *(Primary: LEG · Consulted: PM)*
- **C3 · Multi-party notification.** How are non-users in a captured session notified and given a choice? *(Primary: LEG · Consulted: DES)*
- **C4 · Jurisdiction.** Handling one-/two-party-consent laws across regions. *(Primary: CMP · Consulted: LEG)*

## 5. Action plan — pre-flight, editable plan before a heavy run

*Why policy-first:* the design is easy; the *threshold logic* (when does a run require a plan and a gate?) is a product-safety policy that must be defined consistently.

- **A1 · Trigger threshold.** What conditions require a plan — compute cost, blast radius, irreversibility, external side effects? Define the rule. *(Primary: PM · Consulted: ENG, SEC)* — **Blocks A-UI**
- **A2 · Advisory vs. contractual.** Which task classes merely *show* a plan vs. **block** until approved? *(Primary: PM · Consulted: SEC)*
- **A3 · Editability & fidelity.** Can users edit the plan? Must execution match the approved plan, and what happens on divergence? *(Primary: PM · Consulted: ENG)*
- **A4 · Bypass / trust.** Can experienced users or orgs disable plan-gating, or set per-agent defaults? *(Primary: PM)*
- **A5 · Overlap with ProposalCard.** Is the plan a superset (plan → steps → per-action approvals) or a separate gate? Resolve the governance overlap so we don't double-confirm. *(Primary: DES · Consulted: PM)*

## 6. Cost estimates — pre-run cost preview

*Why policy-first:* exposing a number creates an expectation (and a liability if wrong). Unit, accuracy, and whether it can block are finance/ML calls.

- **E1 · Unit & currency.** Tokens, credits, or money — and do we map to a currency? *(Primary: FIN · Consulted: PM)* — **Blocks E-UI**
- **E2 · Method & accuracy.** How is the estimate computed, what range/confidence do we show, and what's our stance if the actual exceeds it? *(Primary: ML · Consulted: FIN)*
- **E3 · When to show.** Always, or only above a cost threshold? *(Primary: PM)*
- **E4 · Informational vs. enforcing.** Does the estimate ever block or queue at a limit, and how does it relate to the existing usage meter and plan-limit banner? *(Primary: PM · Consulted: FIN)*
- **E5 · Driver detail.** How much of the cost breakdown (system prompt, context, tools, output) do we expose? *(Primary: DES · Consulted: ENG)*

## 7. Branches & Variations — parallel exploration and compare-and-choose

*Why policy-first:* mostly product/design, but persistence and audit representation need a call, and variations multiply compute (ties to §6).

- **B1 · Persistence & audit.** Are branches saved, and how do they appear in history and the audit trail? *(Primary: PM · Consulted: ENG)*
- **B2 · Inheritance.** What context carries into a branch (memory, files, model, tools) by default, and what can the user drop? *(Primary: PM · Consulted: DES)*
- **B3 · Merge/adopt semantics.** How is a branch or variation adopted back, and what does that record? *(Primary: DES · Consulted: PM)*
- **V1 · Variation cost governance.** Generating N variations multiplies compute — capped? counted against quota? surfaced via the cost estimate? *(Primary: PM · Consulted: FIN)*

## 8. Voice & tone — brand-consistent agent output

*Why policy-first:* who owns a "brand voice," whether it's enforced, and how it relates to the agent's own personality are brand/content governance calls.

- **VT1 · Ownership & scope.** Are brand voices org-level (admin-defined), team, or personal — and who can create/edit them? *(Primary: BRD · Consulted: PM)*
- **VT2 · Enforcement.** Is a brand voice a default, a hard constraint, or a suggestion — and can it be overridden? *(Primary: BRD · Consulted: PM)*
- **VT3 · Voice vs. personality.** Separate the *product's brand voice* from the *agent's native personality* so they don't fight. *(Primary: BRD · Consulted: DES)*
- **VT4 · Review of custom voices.** Do team-authored voices need approval before use? *(Primary: BRD)*

## 9. Modes — AI modes as a stable contract

- **MO1 · Taxonomy.** What modes exist (research, build, chat, tutor…), and is the set closed/governed like our other closed sets? *(Primary: PM · Consulted: DES)*
- **MO2 · Inheritance/reset.** What carries across a mode switch vs. resets? *(Primary: PM · Consulted: DES)*
- **MO3 · Permissions & cost per mode.** Do modes differ in permissions/cost, and can an org lock a mode? *(Primary: PM · Consulted: SEC)*

## 10. Lighter items — minimal policy, mostly design

- **N1 · Nudge policy.** What may a nudge promote — and what's our line against "growth-theater" upsell baiting? *(Primary: PM · Consulted: BRD)*
- **PD1 · Prompt-details safety.** What prompt/config is safe to expose and copy from an output, given it may contain a system prompt or secrets? *(Primary: SEC · Consulted: PM)*

---

## Suggested sequencing

The dependency spine is **Data ownership (§3) → Memory (§1) → Incognito (§2)**: settle training/retention defaults first, because Memory and Incognito inherit from them. **Consent (§4)** unblocks with a single yes/no (C1). The **Action plan (§5)** and **Cost estimate (§6)** pair is largely independent of the data-governance track and can proceed in parallel — both slot next to the existing ProposalCard and usage meter. **Branches/Variations, Voice & tone, and Modes** are mostly product/design and can wait until the governance calls above are moving.

Nothing here is a defect or an emergency — it's the decision backlog that has to clear before the UI work is honest.
