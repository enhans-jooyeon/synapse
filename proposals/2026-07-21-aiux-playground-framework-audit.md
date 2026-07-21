# AI UX Playground — framework audit vs Synapse

**Date:** 2026-07-21 · **Source:** [aiuxplayground.com/frameworks](https://aiuxplayground.com/frameworks) (curated by Bestfolios; framework pages v1.0, cite-with-attribution) · **Status:** proposal / evaluation, no spec changes made.

Went through all three live frameworks — **Agentic UX** (7 territories, ~38 patterns), **Chat UX** (5 territories, 29 patterns), **Trust Scaffolding** (7 territories, 21 patterns) — and mapped every pattern against our specs (`ai-patterns.md` §1–31, `components.md`, `content.md`, `foundations.md`).

**Relationship to the Shape-of-AI audit (`2026-07-20-shapeof-ai-pattern-audit.md`).** These frameworks overlap heavily with that one; where a gap was already flagged there (Memory, Incognito, Data ownership, pre-flight Action plan, pre-run Cost estimates, Branches/Variations, Voice & tone, Sample response, Modes), I note it and don't re-argue it. This doc's value is the **net-new** material aiuxplayground surfaces that Shape-of-AI did not — chiefly a coherent **permissions / autonomy / multi-agent** spine that our specs currently don't address.

**Lens (unchanged).** Synapse serves AgentOS — enterprise, web-only, agent-operations. Ambient/voice-agent and generative-media patterns stay largely out of domain; marked explicitly so "did we consider it" is answered.

Verdicts: **Covered** · **Refine** (we have it; a point worth adopting) · **Gap — relevant** · **Gap — domain** (low relevance to an enterprise web agent platform).

---

## Headline takeaways

1. **Our trust/oversight spine is validated, again.** Every one of aiuxplayground's anti-patterns — *Cheerful failure, Confidence theater, Trust theater, Disclaimer dumping, Opaque autopilot, Hidden cost, Ambiguous turn state, Opaque memory carryover* — is already a rule we enforce (§10 honest failure, §7 uncertainty, §6 provenance, §15 guardrails-not-red, §9 disclosure). No corrections needed; this is confirmation the system is well-calibrated.

2. **The big net-new theme is the pre-action control layer.** Shape-of-AI pushed us toward *memory & data governance*. This set pushes toward **permission, autonomy, and cost as first-class, standing controls** — not per-turn approvals (which we have) but a durable "what may this agent do, how independently, within what budget" surface. For an *agent-operations* platform this is arguably more core than memory.

3. **Multi-agent is a genuine hole and it's on-brand for AgentOS.** Our handoff pattern (§16) is human↔agent only. aiuxplayground's cross-app-handoffs territory (inter-agent chains, responsibility attribution across a chain) is directly relevant to a platform whose whole premise is *plural* agents, and we have nothing specced for it.

4. **Two small, cheap, genuinely-missing patterns:** clarifying-questions-before-generation (Trust: ambiguity escalation) and a repair contract (retry explains what changed). Both match shipped products and slot into existing sections.

---

## Part A — refinements to patterns we already have

Small points worth folding into existing sections. (Excludes ones already captured in the Shape-of-AI audit's Part A.)

- **Reversibility marking (Agentic 02).** Label *every* proposed action by how easily it undoes — fully reversible (draft), partially (restorable), irreversible (sent/charged) — shown before approval. We name consequences on *destructive* proposals (§5) but have no reversibility **class** on ordinary ones. A closed 3-value taxonomy fits our house style well and would strengthen ProposalCard (§5). **Refine.**
- **Time-delayed execution (Agentic 02).** A short cancel window (5–30s) on high-impact actions, single-click abort. We have Stop/Cancel (§8) and the "reversible-lite" Undo toast for regeneration — but no delayed-commit for irreversible operations. A natural extension of the Undo-toast convention to consequential actions. **Refine → small Gap.**
- **Repair contract (Chat 05).** A retry should state *what changed* and *what constraints persist* ("retrying with the date filter removed"), not silently rerun. Directly answers the "regeneration roulette" anti-pattern. Extends §10 (retry) and §22 (variants). **Refine.**
- **Retrieval context preview (Trust 02).** Preview the corpus (with freshness + exclusions) *before* acting on conclusions, not only via post-hoc SourceChips. We have connector freshness (§4) and sources (§6); the pre-generation preview is the missing half. **Refine.**
- **Evidence strength labels (Trust 03).** Per-*claim* typing (sourced / inferred / speculative), distinct from our message-level confidence Badge (§7). A finer grain on the same axis; adopt only if it doesn't collide with the three-level uncertainty vocabulary. **Refine (evaluate for collision).**
- **Agent identity detail (Agentic 07).** Our squared avatar + name is the marker; add a surfaceable **version + capability set** ("what this agent can/can't do") reachable from the identity. Ties to capability-boundary statements below. **Refine.**
- **@mention targeting (Chat 01).** We have @-mention as *object reference* (ContextCard). aiuxplayground uses it to **route a turn to a specific agent or teammate**. Same input affordance, new routing semantics — relevant once multiple agents/humans share a thread. **Refine → Gap when multi-agent lands.**

## Part B — patterns not yet considered (net-new vs both audits)

Ranked by relevance to AgentOS.

### Relevant — worth proposing as tranches

1. **Permissions & consent lifecycle** *(Gap — relevant, enterprise-critical).* An entire Agentic-UX territory we don't address (grep: zero hits for "permission/consent/revoke" in specs). Five linked patterns: **scope disclosure** at enrollment (plain-language "what this agent/connector can reach"), **granular per-capability consent** (read-email vs send-email as independent toggles — we have in-conversation tool toggles in §4, not standing grants), **duration-bound consent** (grants that expire by default), **permission drift indicator** (what's currently held + last reviewed), **revocation affordances** (one-click, as easy as granting). This is table-stakes for enterprise connector/OAuth surfaces and is the strongest single finding. Distinct from Shape-of-AI's "Data ownership" (training vs retention), which is a narrower slice of the same governance area.

2. **Autonomy gradient** *(Gap — relevant).* Also a whole territory (zero hits for "autonomy/budget"). **Suggest / confirm / execute** as a visible, per-task or per-session mode; **per-action autonomy** (auto-send to known contacts, approve new ones); **escalation thresholds** (auto-demote to human when risk crosses a $/impact/novelty line); **autonomy budgets** (run unattended for N minutes or M actions, then pause). We have per-turn approval (§5) and pre-approved tool budgets (§4) — the *level* abstraction above them is missing. Generalizes the lightly-flagged "Modes as a contract."

3. **Multi-agent handoffs & attribution** *(Gap — relevant, domain-core).* Our §16 handoff is human↔agent only. Needed: **inter-agent handoff display** (agent A → agent B, with payload + permissions visible), **responsibility attribution across a chain**, **context portability** (what travels across an app/agent boundary, inspectable). For an agent-*operations* platform this is close to the center of the product, not an edge case.

4. **Budget ceilings & enforcement** *(Gap — relevant).* Beyond the pre-run *estimate* already flagged: **hard budget ceilings** (user/admin caps per task/day/account; agent stops and asks rather than billing through) and **cross-session budgets** (a cap a new chat can't silently reset). Pairs with autonomy budgets (#2) and our usage meter (§17).

5. **Checkpoints & restore** *(Gap — relevant).* Named state snapshots before significant actions, with a visible restore. Distinct from Branches/Variations (already flagged, which are about *output* exploration) — this is about *state* recovery. Zero hits in specs.

6. **Clarifying questions before generation** *(Gap — relevant, small, genuinely missing).* Trust Scaffolding's "ambiguity escalation": when a request is ambiguous *and* high-stakes, ask a targeted question *before* generating, rather than guessing. We have no clarify-before-acting pattern (grep confirms), yet it's a headline behavior in shipped products (ChatGPT/Gemini human-loop). Slots next to §5/§20. Low cost, high trust return.

7. **Chat artifacts surface** *(Gap — relevant).* A dedicated, editable artifact panel for long-form output (docs, code, plans) that keeps the thread readable. We render agent docs *inline* (§12) with attribution, but have no persistent side-surface artifact object. Relevant to enterprise report/doc generation; overlaps conceptually with Branches/Variations tooling.

8. **Risk-tier task framing + capability boundary statements** *(Gap — relevant).* Classify tasks by risk and pair each tier with recommended verification (low-stakes drafting vs consequential action get different guidance); state plainly what the system is strong/weak/out-of-scope at. Underpins autonomy escalation (#2) and the verification opt-out already flagged in Shape-of-AI. Answers the "one blanket disclaimer" anti-pattern.

9. **Audit export** *(Gap — relevant).* One-click, user/admin-owned export of agent activity (inputs, tools called, outputs, costs). Enterprise compliance need; connects to Data ownership and the "action trail" surface implied by §5's permanent decision trail.

### Relevant but lighter

10. **Conversation management set (Chat 04).** Message **pinning**, **conversation search/retrieval** (jump-to-turn), **tags/labels**, **export/archive**. We have thread history (§25) but none of the find/organize/recover layer. Collaboration/long-horizon-work quality-of-life; batch as one small tranche if/when threads get heavy use.

11. **Live presence signaling (Chat 02).** Who's active in a shared/collaborative session. Relevant only if AgentOS ships team-shared threads.

### Expectation-setting

12. **Expectation mode switch (Trust 01).** Choose output mode (fast draft / balanced / evidence-first) before generation, mode stays visible. Overlaps "Modes as a contract" (flagged) and model selection (§4); evaluate together rather than as a separate pattern.

## Part C — evaluated, out of our domain

Consciously not recommending, noted for completeness:

- **Ambient & voice agents (entire Agentic territory 06)** — activation boundaries, ambient presence displays, interruptibility (we have Stop), voice confirmation, multi-user awareness. We deliberately scoped voice to *dictation only* (§26); always-on/ambient agents are out of domain for a web-only platform. **Multi-user awareness** is the one fragment worth revisiting *if* shared-device or shared-workspace surfaces appear.
- **Trust operations (Trust territory 07)** — calibration-metrics dashboard, trust-incident review loop, progressive guardrail tuning. These are product-analytics and ops-process surfaces, not design-system components. **Progressive guardrail tuning** (thresholds by user proficiency) connects to risk-tiering (#8) but is a product decision, not a DS pattern.
- **Streaming/composer basics** — slash commands, context chips, tool switching, streaming, status steps, skeletons, progressive disclosure, citation tooltips, confidence indicators, HITL checkpoints, action timeline, tool invocation disclosure, inline claim attribution, pre-commit checkpoints, confidence banding, failure disclosure — all **Covered** by existing sections; listed so the mapping is exhaustive.

---

## Suggested next steps

If acting on this, sequence by how core each is to *agent operations*:

1. **Permissions & consent lifecycle** (Part B #1) — the strongest gap and the most enterprise-load-bearing. Likely a new `components.md` surface + a new `ai-patterns.md` section, and partly policy-gated (overlaps the AI-gap decision register: data ownership, retention).
2. **Autonomy gradient + budgets** (#2, #4) — design the *level* abstraction above ProposalCard; some of this is also policy-gated (who may raise autonomy, org caps).
3. **Multi-agent handoffs** (#3) — extend §16 from human↔agent to agent↔agent; domain-core.
4. **Two quick wins, unblocked and cheap:** clarifying-questions-before-generation (#6) and repair contract (Part A) — both fold into existing sections with no new components.

Part A refinements can be folded opportunistically. Nothing here is breaking or urgent — it's a roadmap, and much of the top cluster is **policy-gated**, same as the existing Shape-of-AI decision register: worth settling those calls before designing the surfaces.
