<!-- Agent- and human-facing. EN-only, ungated. The harness's MEMORY element, pointed at the MAINTAINERS (June + team) rather than the generator: a structured record of the fixes each generated screen needed to reach shippable, harvested into a pattern report. Companion to harness-refinement-protocol.md (this is the raw evidence; that is the decision) and .github/PULL_REQUEST_TEMPLATE/ui_review.md (where an entry is captured). Read by tools/synapse.py digest. Not a spec file — safe to edit freely. -->

# Synapse — correction ledger (the Memory element)

## What this is — and why it points at the maintainer, not the generator

The harness's durable memory is the **contract** (`design.md`, the gate): a lesson worth keeping is *promoted into a rule*, not parked in a side-file the generator re-reads. So Synapse deliberately has **no generator-facing memory** — that would be a shadow contract, a second place rules live, exactly the drift the harness exists to prevent.

What the contract *can't* capture is the **raw evidence of where LLM UI generation keeps failing** — the delta between what the model generated and what shipped, across many screens. That delta is the richest signal for two maintainer questions:

1. **Which design patterns do LLMs frequently get wrong?** (→ a rule, gate check, or anti-pattern line to add)
2. **Which design-system elements are missing or need to change?** (→ a component/recipe/token to add — a governance change)

The **correction ledger** is that evidence layer. One structured entry per reviewed screen, captured *in the PR* (where the fixes already happen), harvested by `synapse digest` into a pattern report the maintainers read. It is memory **for the humans who own the harness**, because they are the ones who turn a lesson into a contract change.

> **Ledger = raw evidence (every screen's fixes). Refinement register = the decision (this pattern → this harness change).** Many ledger entries roll up into one register entry. Don't duplicate: the ledger records *what was fixed*; the register records *what we changed in response*.

## Where it lives

Captured in the **PR review template** (`.github/PULL_REQUEST_TEMPLATE/ui_review.md`) as a fenced `synapse-corrections` block. The reviewer fills it during the review they already do — no separate chore. On merge, the block is the record. For aggregation, the merged blocks are collected (auto-harvest from merged PRs once the GitHub connector is authorized, or interim: drop the block into `feedback/` as a `.md` file). `synapse digest [folder]` parses them.

## The block format

A fenced block, so it is both human-readable in the PR and machine-parseable:

````
```synapse-corrections
screen: <slug>                # e.g. run-review-inspector
archetype: <archetype>        # workbench | object | settings | guided | console | home
harness_version: <version>    # e.g. 1.0.1 — makes the ledger longitudinal
- <category> | <attribution> | <severity> | <source> | <one-line note>
- <category> | <attribution> | <severity> | <source> | <one-line note>
```
````

One `-` line per fix applied to get from the generated output to the shipped screen. Empty ledger (nothing needed fixing) is a valid, and good, entry — record it as `- none`.

### The four fixed fields (keep them closed — free text defeats aggregation)

**`category` — what was fixed.** Half are machine-detectable from the diff/gate (auto-filled); half are judgment (reviewer-tagged).

| category | meaning | usual source |
|---|---|---|
| `token` | raw hex/rgb or off-scale value → `--sy-*` / on-scale (SY001/SY002) | auto |
| `component-provenance` | re-implemented markup → real component | auto |
| `state-coverage` | missing empty / loading / error / overflow (SY108) | auto |
| `permission-context` | viewer/role handling wrong or absent (SY109) | auto |
| `voice-content` | glossary / tone / forbidden term (SY012) | auto |
| `primary-action` | more than one primary per region (SY014) | auto |
| `hierarchy` | emphasis / ordering / what-reads-first wrong | manual |
| `layout-alignment` | alignment, grouping, spacing rhythm | manual |
| `density` | too sparse or too dense for the system's character | manual |
| `character-drift` | consumer-app polish: shadow, decorative color, oversized rounding, marketing warmth (Tier B) | manual |
| `interaction` | behavior / affordance / focus / keyboard | manual |
| `copy` | specific wording (not a voice-rule violation) | manual |
| `other` | none of the above (use sparingly; a full `other` column is a sign the schema needs a new category) | manual |

**`attribution` — whose fault, mapped to the RC taxonomy.** This is the field that keeps the pattern report honest. Without it you over-count reviewer taste as "LLMs fail at X."

| attribution | meaning | RC |
|---|---|---|
| `llm-generation` | good prompt + contract, model still produced it wrong | — (**the target signal**) |
| `contract-gap` | the contract was silent or too weak to prevent it | RC1 / RC2 |
| `gate-gap` | a checkable rule exists but the gate didn't enforce it — a bad output *passed* | RC3 |
| `prompt-gap` | the intake/prompt was vague; not a harness fault per se | RC5 |
| `reviewer-preference` | taste, not a defect — **excluded from the failure signal** | — |
| `requirement-change` | the product requirement changed mid-review — not a failure | — |

**`severity`** — `blocker` | `major` | `minor`.

**`source`** — `auto` (filled by the diff/gate classifier) | `manual` (added by the reviewer).

### Worked example

````
```synapse-corrections
screen: run-review-inspector
archetype: workbench
harness_version: 1.0.1
- state-coverage | llm-generation | major | auto | no empty state for the run list
- character-drift | llm-generation | major | manual | drop-shadow + rounded-2xl cards → border-only
- token | gate-gap | minor | auto | raw #6b7280 in a status label slipped past the gate
- hierarchy | reviewer-preference | minor | manual | reordered header actions to taste
```
````

Reading it: three of four are real harness signal; the `reviewer-preference` line is correctly quarantined. Two `llm-generation` fixes (missing state, character drift) are exactly the recurring-pattern candidates the digest counts. The `gate-gap` token line says the gate has a hole to close (RC3).

## How it becomes a decision

1. **Capture** — reviewer fills the block in the PR (auto lines pre-filled, manual lines added).
2. **Harvest** — merged blocks collected (GitHub connector, or `feedback/`).
3. **Digest** — `synapse digest` rolls up: counts by category and attribution, the `llm-generation`-only signal, recurring patterns, and **candidate DS gaps** (categories with repeated `contract-gap` / `component-provenance` hits).
4. **Decide** — the maintainer reads the digest, and a recurring pattern becomes one `harness-refinement-register.md` entry + a proposed contract change, held for June's approval.

The point is step 4: the ledger exists to make *what LLMs keep getting wrong* countable, so harness changes are driven by evidence instead of by whichever screen was reviewed most recently.
