<!-- EN-only, ungated. The process doctrine — companion to design.md (the contract). Governs the TEAM's generate → gate → human-review workflow. Not a spec file — safe to edit freely. -->

# AI-driven UI — generation & design-review protocol

*Companion to `design.md` (the design doctrine) and `@enhans-jooyeon/synapse` (the harness). This is the **process** doctrine. It lives in the repo, versioned and diffed like any other artifact.*

---

## 1. Purpose and scope

Non-designers (engineers, PMs) generate production-seed UI with generative AI under the Synapse harness, and a designer reviews the result. This protocol defines **who is responsible for what, and in what order** — and above all draws a clear line between **what a human must own and what a human must not**.

It applies to every UI change that renders a user-visible screen. It does not apply to logic/copy-only changes with no visual output.

---

## 2. The one principle everything rests on

> **The harness owns compliance; humans review only judgment.**

Everything a machine can check — token use, component provenance, contrast, required-state coverage, prop validity — is a **gate**, not a review item. It must be green **before** a designer looks. If a designer is hand-checking spacing values, hardcoded hex, or whether someone re-built `Button`, the harness has a hole — and the fix is to close the hole, not to add a review step.

Tool freedom (using whatever generation tool you like) holds *only* because of this principle. `design.md` merely raises the quality of the first output; it enforces nothing. **The enforcing layer is CI.** Say this to the team plainly, so that "I read the guide" is never mistaken for "I complied."

---

## 3. Roles

| Role | Who | Responsibility |
|---|---|---|
| **Author** | the PM–engineer pair generating the UI | write the PRD, generate, pass all gates, open a reviewable package |
| **Reviewer** | the designer | judgment-only review, one of three outcomes, in-scope surface fixes |
| **Harness owner** | the Synapse / design-system owner | keep gates, tokens, variants, reference patterns current; triage the feedback loop |
| **Merge owner** | Jiyeon (FE tech lead) | integration and scheduling; merges only approved work |

The author may be a pair, but each submission names **one accountable person**.

---

## 4. PRD — the single starting point for generation and review

In this process the PRD plays two roles at once:

1. **The seed for generation**: the initial prompt the author feeds the LLM. Everyone starts from the same field list.
2. **The baseline for review**: the record of intent the designer checks the result against.

This dual role carries one trap you must be aware of.

> **The circularity problem:** the output is *derived from* the PRD. So "does the output match the PRD?" is almost automatically "yes." That means a **conformance review gives almost no signal.**

The reviewer's value survives in only two places:

- **Judgment on the PRD itself**: is building this screen, with this pattern and intent, the right thing to do.
- **What a text prompt can't fully specify**: information hierarchy against real data, whether each state actually *reads well*, whether the layout's *meaning* holds up under long Korean strings.

That's why the review rubric (§9) explicitly separates the **PRD-judgment level** from the **execution level**, and a kick-back can be a **PRD-level kick-back** that lands upstream of generation. Without this, a bad PRD produces UI that matches it perfectly and sails through review.

---

## 5. Workflow (state machine)

A submission moves through these states. Gates cannot be skipped.

```
write PRD → generate → automated gate → review → { approve | surface fix | kick-back } → merge
                          ▲                              │
                          └──────── (on fix) ────────────┘
                                                         │
              (a PRD-level kick-back returns to before generation)
                                                         │
                    (recurring findings) ────────────────┴──→ harness update
```

**Write PRD (author, before generation).** Write the PRD with the §7 template. Writing it *before* generating makes intent a real input, not a post-hoc rationalization. No PRD, no generation.

**Generate (author, any tool, under the harness).** Produce code. Import from `@enhans-jooyeon/synapse`. Run local checks before pushing.

**Automated gate (no humans).** CI runs the §6 checks. Until it's green the submission is **invisible to the reviewer.** This is the anti-bottleneck device — not optional, and not something the author can waive.

**Review (reviewer).** Run the localhost preview (§8) directly, apply the rubric (§9), and return exactly one outcome with structured feedback.

**Merge (merge owner).** Only `approve` reaches merge. Design approval is a **merge gate** — not advisory. (If you'd rather run it as advisory, decide that now and write it here. Leaving it ambiguous creates conflict later.)

**Harness update (harness owner, on a regular cadence).** Recurring findings become variants / rules / patterns. See §10.

### 5-1. Handoff and branching strategy

The author → reviewer → merge code handoff runs on a **branch off the product repo's main** — not a separate repo. The reason is the same principle that runs through the whole harness: gate, preview, and merge must share one single source.

- **A separate repo re-introduces the drift we've been eliminating.**
  - The CI gate is configured in the product repo. A separate repo either duplicates that config (drift) or can't run the real gate at all.
  - A screen preview usually needs the app shell (routing, providers, mocks). A separate repo either stubs these (maintenance burden) or can't do integrated previews.
  - Above all it creates a **second handoff** — moving code from repo A into the product repo. "Passed in A" isn't "passed in product," so every re-integration is a fresh rot point.

- **Governance concerns are solved with branch protection, not repo walls.** If the worry is "should a PM push AI-generated code to the production repo," the answer is branch protection + CODEOWNERS + required design/engineering approvals + merge rights limited to Jiyeon (merge owner). That just enforces the existing model (merge owner + design approval as the merge gate). A repo wall doesn't remove the risk — it just defers it to a promotion step where someone still has to bring the code in.

- **Concretely:**
  - Short-lived branches, prefixed (`ai/` or `gen/`) to identify generation work.
  - **Squash-merge** — however messy the AI iteration on the branch, main history stays clean.
  - **Per-branch preview deploys** (the Vercel you already use) as the reviewer's zero-setup stand-in for localhost — one click, no clone.
  - A Storybook story per required state as the review unit on the branch.

- **Component vs. screen (important):** a new Synapse **component** goes in the harness / design-system repo — that repo is correctly separate. A generated **screen** using existing components goes to a product-repo branch. If a generation needs a new component, that's a **kick-back + harness ticket** per §9 — not a component quietly born inside a feature branch.

- **Exception:** consider a separate repo only for a greenfield with no product repo yet, or when a regulated buyer contractually forbids the generation tool from touching the production codebase.

---

## 6. Automated gate spec (what CI enforces so a human doesn't)

Tuned to the stack (React + Radix + Tailwind + CVA + TS). Each is a hard fail.

- **No arbitrary values.** Configure Tailwind to reject arbitrary values (`[13px]`, `[#4f46e5]`); a lint rule scans JSX/CSS for raw hex/rgb/px literals. Token use is enforced.
- **Component provenance.** ESLint `no-restricted-syntax` flags a raw element (`<button>`, `<input>`, `<dialog>`…) used where a Synapse component exists. If it's in the system, use the system.
- **Variant validity via types.** TS compilation is the gate. CVA variants are typed, so a nonexistent variant fails to compile — the "rules baked into the variant" principle works for free at build time.
- **Required-state coverage.** The author declares a state manifest; CI verifies a Storybook story exists for each declared state. Single-state (happy-path-only) submissions are rejected.
- **Accessibility floor.** Run `jsx-a11y` + axe in CI (contrast, role, label, target size). Use tokens correctly and contrast is already guaranteed; this gate catches misuse.
- **Visual snapshot generation.** Chromatic / Playwright capture every story so the reviewer sees states at a glance instead of hunting for them.

If there's a check a designer *would like* to do but that can't be automated yet, that's the harness owner's backlog — not a human's permanent job.

---

## 7. PRD template (prompt + review baseline)

This one document is used both as the **initial prompt fed to the LLM** and as the **review baseline**. Each field is tagged: **[Generation]** (model reads as instruction), **[Shared]** (generation + CI + review), **[Review context]** (for the human reviewer; also helps the model).

> **The fill-in template is a separate file → `prd-template.md`**
> Per-field detail and the "order when using it as a prompt" guide live in that file. This doctrine keeps only the explanation; the actual fill-in form is managed in the one template file (duplication = drift).

What the template holds: Context (feature · user · entry point) / Generation instructions (harness · reference pattern · output format) / Data & content examples (required) / required-state manifest / constraints & anti-patterns / judgment (intentional deviations · rejected alternatives) / acceptance criteria / open questions for the reviewer.

---

## 8. Review package / PR template (with localhost run)

This is where the reviewer is told **exactly what to look at** and handed a **runnable artifact**.

> **The fill-in PR template lives at → `.github/PULL_REQUEST_TEMPLATE/ui_review.md`**
> Kept in the repo so it's recorded and diffed — code-based end-to-end.

What the template holds: localhost run (command · address · branch preview · per-state routes) / what to look at first / a state-coverage table / breakpoint checks / automated-gate status / deviations needing explicit sign-off.

---

## 9. Design-review rubric + three outcomes

**Scope discipline:** the reviewer looks **only at what a machine cannot**. They do not re-check tokens, contrast, imports, or state existence — the gate handles those. If they find such a thing, the gate has a hole: file a harness issue, don't absorb it as work.

Review happens at **two levels**:

**A. PRD-judgment level (is building this, this way, right)**
- Is this pattern right for this job, or a plausible wrong answer.
- Is the intent/goal itself sound.
- → a problem here is a **PRD-level kick-back** (back to before generation).

**B. Execution level (what the PRD couldn't fully specify — the reviewer's real value)**
- Information hierarchy and scannability at real data density.
- Whether each state *reads well* — is empty useful, is error actionable, does the layout's **meaning** (not just its pixels) survive long Korean text.
- Whether permission variants make sense *as an experience*, not just show/hide.
- Copy quality and tone (if there's no separate copy pass).

### Three outcomes — decided by **where the fix lives**

| Outcome | Meaning | Who fixes | Merge gate |
|---|---|---|---|
| **Approve** | intent met, right pattern, all states read well. | — | ✅ release |
| **Surface fix** | the approach is right and the problem is **inside the existing system** without changing the approach (swap a token, pick a variant, spacing within the existing scale, copy). | reviewer pushes the fix to the PR directly if trivial; otherwise a *precise* comment (exact token / prop / value). The author needn't rethink. | ✅ after fix |
| **Kick-back** | the approach or **the system itself** is wrong: intent mismatch, wrong pattern, missing state, or a need Synapse doesn't yet support. Includes PRD-level kick-backs. | back to the author (rework) — or, if the system is missing it, await a harness decision. **Do not patch a missing system capability with a workaround.** | ❌ |

The key distinction: **surface fix = the fix is inside the system and the approach holds. Kick-back = the approach or the system is the problem.** If you're tempted to "surface fix" with custom CSS or a one-off component, that's a kick-back + a harness ticket.

**Feedback format (all outcomes):** state the outcome first, then per item — *what → why it matters → the specific change or decision needed*. No "make it pop" feedback.

---

## 10. The feedback loop (so the harness doesn't rot)

Log every kick-back / surface fix that flagged a **system gap** (missing variant, ambiguous rule, absent reference pattern). On a set cadence (weekly is enough) the harness owner triages.

- **Recurs 2+ times → mechanize it.** A new CVA variant, a new lint rule, or a new gate. Now it never reaches a human again.
- **Recurring judgment matter → add a reference pattern to `design.md`.** So the next generation comes out right on the first try.
- **Ambiguous rule → tighten the doctrine.**

Without this loop, review load is a permanently flat line. With it, load *decreases* — the more recurring findings the harness absorbs, the smaller the surface left to review. Treat review findings as the backlog for "what to mechanize next."

---

## 11. Failure modes to watch (quarterly check)

- **Review is slower than generation.** If true, the gate is weak — mechanizable work is leaking to humans. Fix the gate, not the reviewer.
- **PRDs are being written after generation.** Symptom: the PRD describes the output perfectly and has no rejected alternatives. Enforce "PRD before generation" as workflow, not an honor rule.
- **The reviewer is reviewing screenshots.** Symptom: state/breakpoint bugs leak to production. localhost is unrunnable or not being run. Non-negotiable premise.
- **"Surface fix" is ballooning.** If most outcomes are surface fixes, the harness is too loose (push it to a gate) or the reviewer is dodging kick-backs. Recalibrate the boundary.
- **The same finding recurs.** The feedback loop is broken. There's a mechanization owner who isn't doing it.
