# Agent-offered choice — an in-thread component the agent can render for bounded decisions

**Date:** 2026-07-24 · **Status:** proposal for maintainer decision (no components added) · **Source:** two external AI-UX references (Walia, *AI Chat Layout Patterns*; aiuxdesign.guide, *Conversational UI*), triaged against `ai-patterns.md` (35 sections) and `components.md` (50 entries).

## Method & scope

The agent's *behavior* — when to offer a choice, how it detects ambiguity, what options it emits — is **backend-driven and out of scope**. This proposal covers only the **design/component layer**: given that the backend emits a bounded-choice payload, what does the system render? Everything already covered by `ai-patterns.md` (streaming/status §2·3·11·20, prompt starters §27, human handoff §16, artifacts §32, palette entry §13) is explicitly *not* re-proposed here — the audit confirmed those are already specified, often more rigorously than the sources state them.

Two source patterns motivated this — "render a control for a finite choice, don't force text" and "design the misunderstanding (a specific clarifying question beats a generic error)." **At the component layer they collapse into one question:** how does an agent render a bounded choice that *acts when tapped*, inside the thread?

## The gap

Synapse has adjacent components, but none carries the contract "a set of agent-offered options that act on selection, in a conversation":

- **ChoiceCard** — closest. One-of/many-of selection with radio+checkbox semantics already defined. But its jurisdiction is *form-style* decisions with descriptions (plan pickers, onboarding, agent-type choice) and deferred effect. Not a conversational tap-to-answer.
- **Chip** — explicitly barred: "a chip never performs a primary or destructive action," and the `suggestion` chips of §19/§27 are contractually *insert-into-Composer, never send*. A quick-reply that acts on tap is the **opposite** contract.
- **SegmentedControl / Radio** — view-toggles and form data respectively; neither is an in-conversation choice.

So a consumer asked to render agent-offered choices today has no compliant primitive — they'd either misuse a suggestion chip (breaking its insert-not-send contract) or hand-roll Buttons in a row (undocumented, collides with the one-primary-per-region rule). That is an RC-gap per `design.md §6`.

## The decision for the maintainer

One choice, two viable shapes:

- **(A) Extend ChoiceCard** with a conversational `reply` variant — act-on-select semantics, sits in-thread, no descriptions required. Lighter; reuses existing radio/checkbox semantics and a11y.
- **(B) Sanction a new small `QuickReply` affordance** — a distinct in-thread choice row. Heavier (new manifest entry) but avoids overloading ChoiceCard's form jurisdiction.

Recommendation: lean **(A)** unless the shape-distinctness requirement below forces enough divergence that it's really a new object. That is the maintainer's call.

## Load-bearing design requirements (apply to either shape)

1. **Shape distinctness — the hard constraint.** The system already runs two chat-chip species (rounded `suggestion` chips that *insert*; pill source cards) with an explicit law that they be tellable apart by shape alone. A choice that *acts* on tap must not read as a suggestion chip that *inserts* — otherwise a tap's outcome is unpredictable. This likely forces a form distinct from the rounded suggestion chip (card-like, or a clearly different silhouette), and is the strongest argument for option (B).
2. **Resolved state (provenance law).** Thread history is append-only. After selection the choice must not vanish — it persists showing which option was picked and locks the rest, mirroring the resolved-ProposalCard precedent (§5) that collapses to an attribution row. Un-resolved → interactive; resolved → a settled record of the decision.
3. **Single vs multi.** Reuse ChoiceCard's existing radio (one-of) vs checkbox (many-of, with an explicit confirm) semantics; don't invent a third model.
4. **AI association.** Renders as agent output — on `ai.surface`, under the squared avatar, inside the agent turn (§9 attribution). Never styled as system chrome or the user's own input.
5. **Bilingual + count cap.** Labels size from content, wrap not truncate, survive +25% (foundations §2.3). Define the option-count ceiling above which the answer should be a Select/Combobox instead of inline choices.

## Clarification turn — needs nothing new

The second source pattern (the clarifying "did you mean X or Y?" turn) requires **no new component**. A clarification is an ordinary agent message (`ai.surface`, squared avatar, §12 markdown) that poses a question and renders the choice affordance above. The only net-new design surface is the choice component itself. Worth one sentence in `ai-patterns.md §10` noting that ambiguity is answered with a clarifying turn (+ choices), not error styling — but that's a doc note, not a component.

## Explicitly out of scope

- The two source articles' **layout patterns** (floating/OS-level assistant, full-screen autonomous canvas) are product-architecture / `patterns.md` archetype decisions, not AI-component rules. The system has already chosen its layout stance (workbench + side-surface artifacts, §32). Not proposed.
- All **agent decision logic** — backend, per the scope note.

## Recommended next step

Decide (A) vs (B), then promote one spec entry — a ChoiceCard `reply` variant in `components.md`, or a new `QuickReply` entry — with the resolved-state and shape-distinctness requirements written in, plus the one-sentence §10 note on clarification turns. Spec-only, character in the Synapse austere language, gate kept green, manifest rebuilt. Accumulates under `## Unreleased` until a release is cut. One change, on approval.
