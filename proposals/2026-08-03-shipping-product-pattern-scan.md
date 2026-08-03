# Shipping-product pattern scan — Manus · Perplexity · Claude · ChatGPT · Gemini

**Date:** 2026-08-03 · **Status:** proposal for maintainer decision (no components added) · **Scope:** chat/agent interface patterns in five shipping products, triaged against `ai-patterns.md` (§1–35) and `components.md` (67 entries).

## Why this is a different lens from the July audits

`proposals/2026-07-20-shapeof-ai-pattern-audit.md` and `proposals/2026-07-21-aiux-patterns-catalog-audit.md` audited **pattern catalogs** — curated taxonomies of what the industry *talks about*. This scan looks at what five products **actually ship**, which answers a different question: not "is this pattern named somewhere," but "has someone shipped it to millions of users and learned the mechanics."

**Headline: the harvest is small, and that is the finding.** Of everything these five products do in a conversation surface, the large majority is either already specified in `ai-patterns.md` — often more rigorously than the products implement it — or already on the known-gap list from July. **Six patterns are genuinely new.** Two of the six would be regressions if adopted as shipped, because they violate rulings Synapse made deliberately.

**Method limits, stated plainly.** This is desk research from documentation and secondary reporting, not hands-on use of current builds. Product UI changes weekly; treat specific mechanics (control placement, exact wording) as indicative, not verified. Where a claim matters, it is attributed below.

---

## Part A — known gaps, now with shipping evidence

These were already identified in July. What is new is **proof they work in production**, which should change their priority, not the gap list.

| Known gap | Shipping evidence | Effect on priority |
|---|---|---|
| **Plan & Execute (pre-flight editable plan)** — shapeof #4, catalog "strong" | **Gemini Deep Research** returns a proposed research plan instead of executing, with an explicit **"Edit plan"** step, and only browses after approval. | **Confirmed as the top open item.** HANDOFF already calls it "next-strongest catalog item still open." It is no longer speculative — the mechanic (propose → edit → approve → run) is shipped and documented. |
| **Branches & Variations** — shapeof #6 | **ChatGPT and Claude both ship native branching:** editing an earlier *user* message creates a sibling branch, and a branch navigator with ‹ › arrows appears below the message, loading the sibling **and its entire downstream thread**. | **Half of this is a real hole in what I shipped today.** See B-0 below — this is the most actionable item in the document. |
| **Voice & tone** — shapeof #7 | **Claude ships Styles** — presets (Concise / Explanatory / Formal) plus custom styles created from a writing sample or a description, selectable **from the composer, mid-conversation**. | Concrete mechanics for a gap we described abstractly. Note the jurisdiction: §24's refine-prompt acts on the *user's draft*; Styles act on the *agent's output*, where Synapse has nothing. |
| **Cost estimates (pre-run)** — shapeof #5 | Manus meters tasks in credits, per task. | Unchanged; still policy-adjacent. |
| **Memory / Incognito / Data ownership** — shapeof #1–3 | All five ship some form. | Unchanged — **blocked on policy calls**, not design (`2026-07-20-ai-gap-policy-decisions.md`). |
| **Shared vision** — shapeof #13, rated "niche" | **Manus makes it the headline feature**: a side panel ("Manus's computer") streaming the agent's actual browser — tabs opened, searches run, files written. | **Re-rate from niche to relevant.** It is a product's primary differentiator, not a curiosity. AgentOS already has CUA (dev-only per `product-context.md`), so the surface exists unspecified. |

---

## Part B — genuinely new

Ranked by value to AgentOS. Each names the Synapse rule it touches, because none of these drops in cleanly.

### B-0. Human-message edit → branch, with the pager carrying the downstream thread *(gap I created today — fix first)*

**What ships.** In ChatGPT and Claude, editing a sent user message does not mutate it and does not just re-ask: it **forks the conversation**. A branch navigator appears below the message; the arrows swap in the sibling message *and every turn descending from it*.

**Where Synapse stands.** Today's `Message` entry forbids "editing a sent message in place (append a new turn — Thread is append-only)." That is correct as far as it goes, and it is **the wrong shape of answer**. The products' model is *more* append-only than ours, not less: nothing is destroyed, a branch is added, and both routes stay reachable. Our `VariantPager` covers regenerations of an **agent reply**; nothing covers alternatives of a **human turn**, and `Thread`'s "no reordering" says nothing about a tree.

**Why this matters more than it looks.** A transcript is currently specified as a list. If branching is ever adopted it is a **tree**, and `Thread`'s scroll contract, append-only law, and `role="log"` live region were all written for a list. That is a structural assumption worth settling before the eight new components get built on.

**Cost:** medium — it is a data-model question, not a styling one. **Recommendation: rule on it explicitly, even if the ruling is "lists only, branching is out of scope for v1."** An unstated assumption is the expensive outcome.

### B-1. Post-hoc verification pass *(strongest fit with Synapse's doctrine — and it breaks two rules)*

**What ships.** Gemini's **"Double-check response"**: a user-triggered action under a settled answer that re-checks it sentence by sentence against Google Search, then marks each sentence — corroborated, contradicted/not found, or not evaluable. Takes about seven seconds. Google is explicit that it does **not** guarantee accuracy; it surfaces context.

**Why it is the most on-brand pattern in this document.** Synapse's §7 uncertainty vocabulary is assigned **at generation time and is static** — the agent self-reports "Verified / Likely / Unverified." Nothing lets a *user* demand a check afterward. Given a system whose stated character is engineered restraint and whose §6/§10 rules are built around never faking certainty, a user-invocable verification pass is a natural extension of the honesty doctrine rather than a bolt-on.

**Two collisions, both real:**

1. **Colour-only signalling.** As shipped it is green/orange highlighting. Synapse forbids status by hue alone (`components.md` Badge: "status = dot + glyph, never hue alone"; the same rule recurs on AgentStep, RunLog, FlowNode). Adopting it requires a glyph or marker per sentence, not a tint.
2. **Append-only.** It mutates the annotation layer of a rendered Message. `Thread`'s append-only law and the §22 partial-regeneration conflict already open from this morning are the same class of question: *what may an action change about a settled turn?* These should be ruled together, not separately.

**Also:** §7's three-level vocabulary (Verified / Likely / Unverified) is a closed set assigned by the agent. A verification pass produces a *second, differently-sourced* judgment about the same sentence. Two confidence systems on one claim needs a ruling, or they will contradict each other in front of a user.

**Cost:** small in components (a ResponseToolbar overflow action + a per-sentence marker), non-trivial in doctrine. **Recommendation: adopt, after the append-only ruling.** High value for an enterprise platform whose buyers care about auditability.

### B-2. Externalized, durable plan file as the progress surface *(best structural idea for an agent-ops platform)*

**What ships.** Manus keeps a **`todo.md`** as a live checklist of plan steps, ticking items off as it works, and re-injects it every turn. The stated purpose is resilience: if the session pauses or context is lost, the file is the source of truth for what is done and what remains, and at the end the agent verifies nothing was skipped.

**Where Synapse stands.** `AgentStep` is transcript furniture — ephemeral, collapsing to "5 steps · 12s" on completion. `RunLog` is explicitly **display only**. Neither is a *durable, inspectable, resumable* plan object. For a platform whose whole subject is long-running agent operations, that is a conspicuous absence: our progress surfaces assume the run completes inside one attentive session.

**Distinct from Plan & Execute.** That pattern is about approving a plan *before* the run. This is about the plan **surviving** the run — persistence, resumability, and completion verification. They compose well (approve the plan, then watch the same object get ticked off), which is an argument for designing them together rather than sequentially.

**Cost:** medium-high; it implies a persisted artefact, so it touches §32 (artifacts) as much as §3. **Recommendation: pair with Plan & Execute as one tranche.** Do not scope Plan & Execute without it, or the plan object gets designed twice.

### B-3. Mid-run intervention short of takeover

**What ships.** Manus lets a user **jump in mid-run**, take control after it finishes, change an assumption, or **re-run a single subtask** — without killing the run.

**Where Synapse stands.** We have Stop (§2), Cancel (§8), per-step Retry (§3), and human handoff (§16). All are coarse: stop everything, retry one failed step, or take the whole task away from the agent. Nothing covers "the run is fine but its third assumption is wrong — fix that and continue." §16 is takeover of the *task*; this is correction of a *step* while the agent keeps the task.

**Cost:** small-to-medium; likely a new AgentStep affordance plus a rule about resuming from a corrected step. **Recommendation: relevant, queue behind B-2** — a durable plan object is what makes "re-run this subtask" expressible in the first place.

### B-4. Selection-scoped edit inside the artifact surface

**What ships.** ChatGPT Canvas: select text inside the artifact and request an edit to **that span**; OpenAI states the model is trained to make targeted edits when the user has explicitly selected text, and to prefer rewrites otherwise.

**Where Synapse stands.** §18's SelectionPill is scoped, deliberately and explicitly, to **agent Messages only**. §31 covers the agent editing content you own via diff + Accept/Discard. The uncovered case is **selection inside a §32 artifact** — the surface where substantial editable output actually lives. So the affordance exists on conversational text and is absent on the document.

**Cost:** small. It is mostly a jurisdiction extension plus a ruling on which actions apply (재생성 makes sense; 답장 probably does not). **Recommendation: adopt** — cheapest genuine gap here, and §32 already anticipates editing.

### B-5. Artifact version navigation and restore *(coverage question I opened today)*

**What ships.** Canvas exposes version history via arrows in the artifact toolbar, with the ability to **restore** a previous version.

**Where Synapse stands.** §32 says regenerating an artifact creates a new version, never a silent overwrite, and prior versions are "retained, switchable." Today I added `VariantPager` for **agent-reply variants** with an explicit forbidden line: *"a pager on a human message or on an earlier agent reply."* That does not say whether the same component serves artifact versions, and §32 has no component for it, nor any **restore** action.

**Cost:** trivial to rule, small to spec. **Recommendation: rule whether `VariantPager` extends to the artifact surface or artifacts get their own version bar.** Two pagers with different rules on one screen is the failure mode; so is a spec that mentions switchable versions with no control.

### B-6. Persistent scope object carrying instructions and files across threads

**What ships.** Perplexity **Projects** (formerly Spaces), ChatGPT Projects, Claude Projects: a container with **custom instructions applied to every new thread in it**, plus attached files and connectors, with citations resolving back to those files.

**Where Synapse stands.** We have the Sidebar's conversation groups and collections, the Composer's agent picker, and the per-conversation tools popover. What we do not have is a **scope object whose instructions and knowledge persist across threads**. `product-context.md` may already answer this at the product layer.

**Honest assessment: this is probably product, not design system** — the same call the catalog audit made for Scheduled Tasks. **Recommendation: verify against `product-context.md` before treating it as a DS gap.** Listed for completeness, not urgency.

---

## Part C — shipping patterns we should deliberately NOT adopt

Worth writing down, because "five major products do this" is the argument that will eventually be made in a review.

- **Suggestion chips that send on click.** Common across these products. Synapse's chip-honesty law is the opposite: the label *is* the query, and selecting **inserts for editing, never sends** (§19, §27). Ours is the better rule for an enterprise tool where a mis-sent prompt costs a run. **Hold the line.** (Note: `2026-07-24-agent-offered-choice.md` is the legitimate exception — a bounded choice that *acts* on tap — and is still open for a maintainer decision.)
- **Colour-only correctness signalling.** See B-1.1. Adopt the pattern, never the encoding.
- **Agent-rendered arbitrary UI.** The catalog audit already flagged that the pattern's own guidance excludes strict design-system products. Nothing in this scan changes that.
- **Continuous sliders for output transforms.** Canvas offers length and reading-level as sliders (Shortest→Longest, Kindergarten→Graduate). §24's refinement presets are a **closed set** by design, and a continuum is the opposite of a closed set. If output-transform controls are ever wanted, they should be presets, consistent with §24 — not a slider that produces unenumerable states.

---

## Recommended sequencing

1. **Rule the append-only boundary once**, covering all three open cases together: §22 partial regeneration (open from this morning), B-1 verification annotations, B-0 branching. They are one question — *what may an action change about a rendered turn?* — and answering them separately is how the §18/§22 contradiction happened in the first place.
2. **B-0 branching**: rule in or out. If out, say so in `Thread`, so the list assumption is explicit rather than incidental.
3. **Plan & Execute + B-2 durable plan object** as one tranche. Highest value, and Gemini has de-risked the interaction.
4. **B-4 and B-5** as a small artifact-surface tranche — both cheap, both tidy up §32.
5. **B-1 verification pass** once (1) is ruled.
6. **B-3** after B-2. **B-6** only if `product-context.md` does not already own it.

Nothing here needs a new token or icon. B-0 is the only item that could touch the data model, which is why it sits second.
