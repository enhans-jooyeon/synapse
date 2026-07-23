<!-- EN-only, ungated. The PRD the intake skill fills on the user's behalf (screen-intake-skill.md) and the reviewer's baseline. In the LLM-driven flow the user does NOT hand-write this — the intake skill parses their prompt and asks only for the missing fields. Not a spec file — safe to edit freely. -->

# PRD template (generation prompt + review baseline)

> **When it's produced:** *before* generation. This one document is used verbatim as the LLM prompt, and afterward as the review baseline.
> **Related protocol:** `design-review-protocol.md` §4, §7, §9
>
> **Field tags:**
> - **[Generation]** — the model reads this as instruction; it directly drives prompt quality.
> - **[Shared]** — used by generation, CI, and review alike.
> - **[Review context]** — for the human reviewer; also helps the model choose well.

---

## PRD — [screen / feature name]

### Context
- **Feature / screen:** [Review context]
- **User and goal:** (who arrives at this screen, and what they're trying to accomplish) [Shared]
- **Entry point / location:** [Review context]

### Generation instructions (put this block at the top when prompting the LLM)
- **Harness:** use only `@enhans-jooyeon/synapse` components; follow the rules and tokens in `design.md`. [Generation]
- **Reference pattern:** extend `design.md`'s [e.g. "detail-with-side-panel"]. [Generation]
- **Output format:** produce code, runnable on localhost, with a Storybook story for each required state below. [Generation]

### Data / content examples (required — do not leave blank)
- Give examples with real field names, real quantities, and real Korean strings (both short and long).
  (Without example data, the model produces plausible-but-wrong-shaped UI every time.) [Generation]

### Required states (state manifest — checked by CI)
- [ ] default
- [ ] empty
- [ ] loading
- [ ] error
- [ ] overflow / long content
- [ ] long Korean string
- [ ] permission variant: (list the roles that change this screen) [Shared]

### Constraints & anti-patterns (do NOT do)
- (List the `design.md` anti-patterns that apply to this screen as explicit "forbidden" lines.
  Negative instructions measurably raise output quality.) [Generation]

### Judgment (the human review points)
- **Intentional deviations from the pattern, and why:** ("none" is a valid answer) [Review context]
- **Alternatives considered and rejected:** (one line — forces a real decision) [Review context]

### Acceptance criteria (definition of done)
- (The prompt's goal and the reviewer's intent baseline.) [Shared]

### Out of review scope / open questions for the reviewer
- (Points where you actively want the reviewer's judgment) [Review context]

---

## Using this PRD as a prompt (order matters)

When you actually paste it into the LLM, this ordering produces better results:

1. **Harness + reference pattern + output format** (the generation-instruction block, at the top)
2. User and goal
3. **Data / content examples** (the more specific, the better)
4. **Required states** (enumerate them and instruct "generate all of these states")
5. **Constraints / anti-patterns** (explicit "do NOT")
6. Judgment + acceptance criteria (context so the model makes better choices)

When tuning a PRD as a prompt, the fields you'll touch are mostly the **[Generation]** ones. **[Review context]** fields are fine to include in the prompt, but their primary purpose is review.
