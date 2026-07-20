# Shape of AI — pattern audit vs Synapse

**Date:** 2026-07-20 · **Source:** [shapeof.ai](https://www.shapeof.ai/) (Emily Campbell, CC-BY-NC-SA) · **Status:** proposal / evaluation, no spec changes made.

I went through all ~56 patterns across the site's six families (Wayfinders, Inputs, Tuners, Governors, Trust builders, Identifiers), read each page's *Design considerations*, and mapped them against our specs (`ai-patterns.md`, `components.md`, `content.md`, `foundations.md`).

**Lens.** Synapse serves AgentOS — an enterprise, web-only, agent-operations platform. It is *not* a generative-media playground, so a chunk of Shape-of-AI patterns (image inpainting, restyle galleries, preset/saved visual styles, describe/reverse-prompt, randomize, media watermarks) are out of our domain. I've marked those explicitly rather than skip them, so the "did we consider it" question is answered for every pattern.

Verdicts: **Covered** (we have it), **Refine** (we have it; the site suggests a point worth adopting), **Gap — relevant** (not considered, worth a tranche), **Gap — domain** (not considered, but low relevance to an enterprise agent platform).

---

## Headline takeaways

The system is already strong on the *oversight and trust* spine — verification (ProposalCard), provenance/citations, reasoning/stream-of-thought, streaming controls, disclosure via the squared avatar + point color. Shape of AI validates most of our existing rules almost verbatim (especially Color: "never rely on color alone" — exactly our anti-collision rule).

The real blank spots cluster in **memory & data governance** and **exploration/iteration**:

1. **Memory** (+ **Incognito**) — no pattern for what an agent retains about a user/workspace, how it's shown, managed, or switched off.
2. **Data ownership** — no UI-level pattern for training-vs-retention controls; for an enterprise product this is table stakes and belongs in the system.
3. **Pre-flight Action plan** and **pre-run Cost estimates** — we confirm *per action* (ProposalCard) and show *consumption* (usage meter), but we don't preview an editable plan or an estimate *before* a heavy run.
4. **Branches / Variations** — we only overwrite-or-regenerate; no parallel-exploration or compare-and-choose pattern.
5. **Voice & tone** — no brand-voice control for agent-written output, which enterprise doc/report generation wants.

Everything else is either covered, a small refinement, or out of our domain.

---

## Part A — refinements to patterns we already have

Small, high-signal points from the site worth folding into existing specs.

- **Follow-ups (§ followups).** The site's point: *signal why* a follow-up is offered (e.g. "You could also ask…") and deliberately mix **zoom-in** (refine) with **zoom-out** (pivot) suggestions. Ours are well-structured but treat all follow-ups uniformly — worth adding the refine/pivot distinction and an optional rationale.
- **Inline / content actions (Expand, Restructure, Summary, Synthesis, Transform).** These converge on one rule we should state once: **preview as a suggestion layer, show what changed (diff/highlight), and require verification before overwriting** human content; for high-stakes edits (facts, figures, citations) surface the reasoning. We have inline actions but no unified "preview-then-verify + show-the-diff" rule for content mutation.
- **Model management (model selector).** Add: **explain model differences in human terms** (accuracy / recency / cost / latency) rather than raw names, and **show cost implication before selection**. We show the model; we don't explain or price it at the point of choice.
- **Prompt enhancer (§24 refine-prompt).** The site: **highlight the material expansions** the rewrite introduced (so the user reviews what changed) and keep the **raw prompt accessible** (view/copy/token count). We have the refine affordance; adding "show what it changed" would make it trustworthy.
- **Citations / References (provenance).** Mostly covered. Two adds: **hover-preview + click-through** on a citation, and **let users rescope/remove references after generation**. Our broken-source warning-chip already matches their "never hide gaps" rule.
- **Verification (ProposalCard).** Add an **opt-out ("never ask again for this action") with a visible way to opt back in**, and, where verification is skipped by policy, **say so**. Our approvals are pessimistic (good) but always-on; risk-scaled opt-out is the maturity step.
- **Connectors.** Adopt: **freshness/last-synced labels + cached-result marking + graceful reconnect in-flow**, and treat connected content as **untrusted (prompt-injection surface)**. We have connectors/ContextCards but not the freshness + security posture spelled out.
- **Attachments.** Adopt: let users **assign a purpose** to an attachment (style reference vs subject-under-analysis) — a cheap disambiguation we don't currently offer.
- **Auto-fill / batch.** Adopt: auto-filled fields stay **visually distinct until accepted**, and **never overwrite human-entered content** without explicit action. Reinforces our batch-input honesty rules at the field level.
- **Caveat.** We have Guardrail refusals (neutral, not red — good). Add a **contextual accuracy caveat tied to the content** ("check dates/figures") placed *at the output*, not a footer disclaimer.
- **Disclosure.** We disclose via squared avatar + point color. Add: **label the specific action** ("Summarized with AI"), not a generic "AI" tag, and keep the actor identity **persistent across handoffs** (we have Handoff; make the label explicit).
- **Avatar.** Add explicit **state signaling** on the agent identity (listening / generating / waiting) beyond the live-activity beacon.
- **Controls.** We have Stop + queue. Consider **pause/resume** without losing progress for long autonomous runs.

## Part B — patterns not yet considered

Ranked by relevance to AgentOS.

### Relevant — worth proposing as tranches

1. **Memory** *(Gap — relevant).* No pattern for what the agent remembers about a user/workspace. Site guidance: never a black box; **mark the moment of capture** with a lightweight chip; make memories **viewable and manageable**; separate stable identity/preferences from transient style; support **scopes** (personal vs work). This is a real product surface we haven't designed.
2. **Incognito / memory-off** *(Gap — relevant).* Pairs with Memory: an unmistakable **"memory off" mode** with a persistent indicator, sessions sealed from memory/training, and connector scopes visibly limited. Enterprise users will ask for this.
3. **Data ownership** *(Gap — relevant, enterprise-critical).* A settings/governance pattern: **separate training permission from retention permission**, default to privacy, and **state the default in the UI itself** (not just policy). We have no token/component story for this and it's core to an enterprise pitch.
4. **Action plan (pre-flight)** *(Gap — relevant).* Distinct from AgentStep (shown *during* a run) and ProposalCard (approves *one* action): a **skimmable, editable plan shown before a heavy run**, with confirm/modify/collapse, for high-compute tasks. Site's line — "the right time to stop an erroneous run is before it begins" — is a genuine gap between our per-step and per-action gates.
5. **Cost estimates (pre-run)** *(Gap — relevant).* Our usage meter shows *consumption*; this shows an **estimate before committing** (low–high range, cost drivers, cheaper paths). Fits our "actuals vs estimates, never invented" honesty rule — we just don't have the pre-run half.
6. **Branches & Variations** *(Gap — relevant).* We overwrite-or-regenerate only. **Branches** = parallel exploration paths that retain a route back to the original; **Variations** = several outputs shown for compare/select/merge without overwriting. Both matter for iterative agent work and would extend ResponseToolbar/MediaGroup.
7. **Voice & tone** *(Gap — relevant).* A **brand-voice control** for agent-written output — lightweight presets at the point of generation plus a saved "Team Brand Voice" with a visible active label and reset-to-default. Enterprise report/doc generation wants this; distinct from the agent's own personality.
8. **Sample response (sample-before-scale)** *(Gap — relevant, small).* Before running across many records, generate **one sample** with per-record cost/time so the user confirms direction. A natural enhancement to our batch-input pattern.
9. **Modes as a contract** *(Refine → Gap).* AI "modes" (deep research, build-vs-chat, tutor) treated as a **stable contract** with explicit entry/exit, a visible active state, and a surface that reconfigures. We have agent scope but not a specced mode pattern (note: our `mode` hits are the old density/color modes, unrelated).

### Relevant but lighter

10. **Nudges** *(Refine).* Capability nudges **tied to content state** (offer "summarize" only once content exists) that build skill, not dependence — and the site's caution against "growth theater." We have quality hints and the deviation dot; a light contextual-nudge rule would round it out.
11. **Prompt details** *(Gap — light).* Make the prompt/params behind an agent output **copyable/reusable** from the output itself (we surface run config in the Drawer; not one-click reusable).
12. **Consent** *(Gap — domain-dependent).* If AgentOS ever records meetings or captures third-party data: **opt-in recording indicators, per-purpose consent, reversibility**. Out of scope until there's a capture surface, but flagged.
13. **Shared vision** *(Gap — niche).* Live ambient view of an autonomous agent acting on a shared canvas/browser, with **persistent scope boundaries** (colored outlines). Relevant only if we ship a fully autonomous "watch it work" surface.

## Part C — evaluated, out of our domain

Consciously *not* recommending these; they're generative-media playground patterns with little pull for an enterprise agent platform. Noting them so the audit is complete: **Example gallery** (of sample generations), **Randomize** (dice/shuffle prompt), **Describe** (reverse-prompt an image), **Inpainting** (region regeneration), **Restyle / Preset styles / Saved styles** (visual-style galleries, incl. LoRA), **Watermark** (C2PA on generated media), **Chained action** (visual node-graph workflow builder — possibly relevant if AgentOS builds a workflow canvas, but it's a product surface, not a DS component). **Name** and **Personality** are largely product/brand and content-voice decisions rather than design-system components, though Personality's "separate empathy from authority, guard against sycophancy" belongs in `content.md` voice guidance if we want it enforced.

---

## Suggested next steps

If you want to act on this, the natural first tranche is the **memory + data-governance** cluster (Memory, Incognito, Data ownership) since it's both a genuine gap and enterprise-critical, followed by the **plan/estimate** pair (pre-flight Action plan, pre-run Cost estimates) which slot cleanly next to our existing ProposalCard and usage meter. The Part A refinements can be folded into their existing spec sections opportunistically. Nothing here is urgent or breaking — it's a roadmap, not a defect list.
