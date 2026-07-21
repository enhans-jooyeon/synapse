# AI UX Playground — patterns catalog audit vs Synapse

**Date:** 2026-07-21 · **Source:** [aiuxplayground.com/patterns](https://aiuxplayground.com/patterns) (173 patterns, 11 categories; curated by Bestfolios, cite-with-attribution) · **Status:** proposal / evaluation, no spec changes made. · **Companion to:** `2026-07-21-aiux-playground-framework-audit.md` (the three frameworks from the same site).

Enumerated the full 173-pattern catalog and deep-read the detail pages (when-to-use / when-NOT / anti-patterns / how-products-use-it) of every candidate that survived triage. **Scope is deliberately design-centered** — the permissions/consent/data-governance cluster is excluded on June's call (it drifts into policy; see the parked `2026-07-21-permissions-lifecycle-draft.md`). Out-of-domain categories (Audio, generative-media Design Tools, most Commerce, ops/analytics dashboards) are noted once, not itemized.

Verdicts: **Adopt** (design-centered gap worth a tranche) · **Refine** (have it; a point to fold in) · **Covered** · **Domain** (out of scope).

---

## Headline

The catalog confirms our conversational/oversight core is saturated — streaming, citations, slash/command, approval, reasoning, uncertainty, selection, templates, batch, predictive text are all **Covered**. The design-centered gaps that remain cluster in **three areas**, none of which touch policy:

1. **Persistent output surfaces** — we render agent output *inline and append-only* (§12). The catalog's Artifacts / Generative UI / Source Browser patterns are about giving substantial output a *dedicated, inspectable surface*. This is the richest vein.
2. **Pre-run planning** — Plan & Execute is the design half of the pre-flight-plan gap (already flagged in the shape-of-ai audit); the catalog gives concrete anti-patterns for it.
3. **Onboarding & collaboration** — two whole categories our `ai-patterns.md` doesn't address at all (first-run onboarding; multi-user review of agent output).

Plus two small, standard, genuinely-absent patterns: **Feedback** and **Conversation Summary**.

---

## Adopt — design-centered gaps worth a tranche

Ranked by value to an enterprise agent console.

### 1. Chat Artifacts *(Gap — strong)*
A dedicated side panel for substantial generated output (docs, code, diagrams, structured data) instead of a long inline block; persistent, editable, iterable while the thread stays readable. **We render agent docs inline (§12) with attribution — we have no artifact surface.** The pattern's anti-patterns map cleanly onto rules we'd want: a **visible link back** to the originating message (our provenance law), **version history** to compare/revert (aligns with §22 variant pager), an **export/copy** path, and **resizable/collapsible** panels. Touches: new surface in `components.md` (or a Drawer content pattern) + a new `ai-patterns.md` section; reuses §22 (variants) and §31 (diff/accept for edits). Design-only.

### 2. Plan & Execute (pre-flight plan) *(Gap — strong)*
Agent breaks a goal into an **ordered, editable plan shown before execution**, then reports progress against it. Distinct from AgentStep (during a run, §3) and ProposalCard (one action, §5) — this is the missing *whole-run* preview. The design half of the "Action plan" gap already flagged in the shape-of-ai audit; the catalog adds sharp anti-patterns: don't show a plan then **silently deviate**, allow **edit/reject of individual steps** (not accept-all/cancel-all), and **adjust remaining steps on failure** rather than re-plan from scratch. Touches: new `ai-patterns.md` section next to §3/§5; likely a new PlanCard-ish object or an AgentStep variant. Design-only (the *autonomy* to skip review is policy — keep that out).

### 3. Source Browser *(Gap — extends §6)*
Source documents shown **beside** the answer with **answer-span ↔ source-excerpt highlight mapping** and jump-to-passage from a citation. We have SourceChips + hover Popover + a sources row (§6) — the browse-the-evidence-beside-the-answer surface is the missing half. Anti-patterns reinforce rules we already hold (never list filenames without the grounding excerpt; highlights must match the cited sentence). Their mobile guidance — a **slide-over Sources view**, not a dual pane — fits our web-but-responsive posture. Touches: extends §6 + a new panel/Drawer; pairs naturally with Chat Artifacts (#1) as the same "side surface" system.

### 4. Conversation Summary *(Gap — small, clean fit)*
Auto-generated recap of a long thread (decisions, action items), **refreshable, editable, marked model-written, with links back to the turns it summarizes**. We have nothing here, and it slots perfectly into our provenance rules (mark as AI per §9, cite source turns per §6, never replace the transcript per our append-only law, never invent decisions per §10 honesty). Touches: new short `ai-patterns.md` section; reuses existing attribution + citation vocabulary. Design-only.

### 5. Feedback *(Gap — standard, surprisingly absent)*
Low-friction judgment on an answer (thumbs / reason codes / flag) on the message. We have the ResponseToolbar but no specced feedback capture. Design rules worth stating: **confirm receipt** (feedback that vanishes is an anti-pattern), **reason codes on thumbs-down** (not a bare down-vote), **never a forced rating modal**, and don't sample **during** streaming — wait until the answer settles. Touches: ResponseToolbar in `components.md` + a line in `ai-patterns.md`. The *UI* is design; where the signal goes is product — spec only the surface.

### 6. Natural Language Filter *(Gap — high utility)*
Turn a free-text query into **editable filter chips** the user can inspect and adjust ("결제 오류 · 지난 7일 · #ops"). Framed as Commerce on the site, but the mechanic is broadly useful for a **data-heavy console** — filtering runs, tickets, tables, logs. Reuses our Chip + removable-chip vocabulary; the key rule is the parse renders as *visible, editable* chips (never an opaque hidden query — consistent with our §19 chip-honesty law). Touches: a `patterns.md`/`components.md` pattern for filter chips; light. Design-only.

## Refine — fold into existing sections

- **Output Format Selection.** A JSON / CSV / Markdown / HTML toggle on generated output, switchable **without regenerating**. Small, useful for enterprise export; extends §12 rendering + the ResponseToolbar. **Refine.**
- **Regeneration Carousel / Output History.** Both are variant-navigation ideas we largely have as the §22 variant pager (non-destructive, keeps provenance per variant). Worth checking their "browse/restore previous outputs" framing against §22 — likely just a naming/coverage confirmation, not new work. **Covered → verify.**
- **Generative UI *(Refine → caution)*.** Agent renders interactive UI (forms/tables/charts) inline, not just text. Genuinely powerful, but the pattern's **own "when not to use" flags strict design-system products that can't safely render arbitrary generated components** — that's us. If adopted, it must be constrained to the **closed component set** (agent composes from Synapse components, never invents markup), with a **fallback to text/copy-out** and stable state (no regen-on-keystroke). More a governed capability than a drop-in pattern; flag for a dedicated discussion, don't fold in casually.
- **Message Reactions.** Quick emoji reactions on messages — light collaboration nicety; only relevant if threads become multi-user. **Refine (defer).**

## Adopt-cluster — two categories we don't cover at all

- **Onboarding & first-run** *(Gap — territory)*. `ai-patterns.md` has zero-state prompt starters (§27) and EmptyState, but no onboarding *system*. The catalog's cluster — **Use Case Wizard** (goal/role questions that configure first success; must offer skip, must actually change config, must be changeable later), First Success Flow, Interactive Tutorials, Progressive Feature Unlock, Onboarding Progress — is a coherent gap for an enterprise tool where "blank composer" is a poor first run. Note aiuxplayground's own **AI Onboarding framework is "coming soon Q4 2026,"** so this space is still crystallizing; reasonable to scope a light first tranche (Use Case Wizard + First Success) and watch the framework. **Adopt (light, phased).**
- **Collaboration on agent output** *(Gap — relevant)*. **Inline Comment Thread** — anchor a comment to a span of AI (or human) output, mention/resolve, review asynchronously. Directly fits enterprise review of agent-drafted PRDs, policies, reports. Extends our §18 selection model (we raise a Reply pill on selection; comments are the async, multi-user sibling). Live Presence / Shared Session Link round out the category but carry sharing-permission edges — keep those lighter. **Adopt (Inline Comment Thread first).**

## Domain / excluded (noted for completeness)

- **Out of domain:** all **Audio** (voice/ambient — we're web + dictation-only §26), all generative-media **Design Tools** (in-painting, style transfer, upscaling, text-to-image, etc.), most **Commerce** (checkout, pricing, inventory, recommendations, fraud), and the **ops/analytics dashboards** (Agent Performance Metrics, Resource Usage, Output Analytics, Transparency Report) — product surfaces, not DS components.
- **Excluded as policy (June's call):** Scope Disclosure, Granular/Duration-Bound Consent, Permission Drift, Revocation, Data Ownership, Privacy Filters, Audit Trail, Autonomy Budgets / Escalation Thresholds / Hard Budget Ceilings. The *design* surfaces exist but their defaults are policy-gated; parked, not pursued.
- **Also flagged, product-not-DS:** Scheduled Tasks & Recurring Actions and Multi-step Forms with AI are relevant to AgentOS but read as product features rather than design-system patterns — worth a look when those surfaces get built, not a tranche now.

## Suggested next step

If you want to act, the tightest first tranche is the **side-surface system**: **Chat Artifacts + Source Browser** designed together (they're the same "dedicated panel beside the thread" primitive), with **Conversation Summary** and **Feedback** as cheap standalone adds that reuse existing vocabulary. **Plan & Execute** is the highest-value agent-side gap but slightly larger. Everything here is design-only and ungated; nothing needs a policy call.
