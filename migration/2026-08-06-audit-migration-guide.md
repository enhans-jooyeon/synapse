# Product-app migration — index to the 2026-08-06 audit conversion guides

**What this was.** June and Dahye ran a **9-test migration audit** of the product app against the Synapse contract and ruled on the findings on **2026-08-06**. Every ruling below is June's, on that date. This page is only the index: the *how* lives in one guide per area, because they are worked one area at a time.

**The framing, in one line: almost none of this is a token release.** June refused to add tokens for off-scale values, so the scales stay closed, `tokens/` is untouched by every area, and the product snaps to what already ships. Three of the rulings resolve a "violation" by stating that the value is **governed elsewhere** rather than by minting a token — the 24px icon ceiling, continuous motion, and the ring exception. **Nobody waits on a release.**

**What did change in the DS, and it is small:** the icon/illustration boundary became spec text (`icons.md` Hard rules, `foundations.md` §8) and `tools/check_icons.py` honours it; `foundations.md` §7 gained the continuous-motion jurisdiction sentence; the product gate gained SY009 (shadow classes) and SY025 (duration classes). Nothing else.

## The seven conversion guides

| Guide | Scope | Gates |
|---|---|---|
| `color-token-snapping.md` | 943 off-token color kinds → nearest `--sy-*` token **within the semantic role**, in three tiers: palette-class table · ΔE snap · escalate the residue | SY001, SY002 |
| `scale-snapping.md` | ~552 off-scale px (462 font, 90 radius) → the closed font / radius / spacing scales; nearest step, ties away from the floor, below the floor → the floor | SY002 |
| `typography-tailwind-migration.md` | ~424 `leading-*` / `tracking-*` call sites → type-style **bundles**; unbundling is the defect, not the value | SY007, SY010 |
| `icon-sizing.md` | 331 renders at 14px → 12px; the 29 renders above 24px are **re-classified as illustration**, not resized | SY019 |
| `shadow-triage.md` | 283 shadow call sites triaged by role → **ring** / **delete** (borders-first) / `shadow-float-*`; most lose the shadow | SY009 |
| `motion-durations.md` | off-scale `duration-*` → 100/150/200/300, five `ease-linear` transitions → `--sy-ease-standard`, and looping animation scoped **out** | SY025 |
| `z-index-migration.md` | ~250 Tailwind `z-*` + 8 `z-9999` → the `--sy-z-*` layer tokens, or −1..2 inside `isolation: isolate` | SY023 |

Each guide has the same six parts: the ruling with its audit counts, why the rule is an error rather than a warning (quoting the contract), a **copy-pasteable `tailwind.config` snippet that makes the wrong thing unexpressible**, a decision tree per call-site case, and the enforcement on both sides. Start with the snippet — it is the cheapest part of every area, and in most of them it converts a lint problem into a build problem.

## Shared conventions

- **`synapse-allow` needs a ticket reference on the line.** It is the documented escape hatch for a *scheduled* fix, never for a decision, and never a substitute for a ruling.
- **Snapping never invents a token.** If a value snaps, it snaps to something already in the shipped bundle. No area in this audit added a token to `tokens/synapse.tokens.json`.
- **A genuine gap is a proposal (`design.md` §6), not a local override.** Every decision tree ends in that branch on purpose. One-per-value, with call sites attached — and note that the jurisdiction rulings *narrow* this door: continuous motion and >24px stroke art are not gaps, they are out of scope.
- **Land the theme change before the gate.** Two areas (shadows, motion) flag classes that only become unambiguous once the theme replacement exists; running the gate first will flag correct code.
- **The counts in each lead paragraph are the coverage contract.** They are what a conversion script's report must add up to; if your numbers disagree, the script is wrong or the audit is stale — resolve it before converting.

One area of the audit is **not** here: the pre-1.0 shadcn migration's working papers also live in `migration/` and are unrelated to these rulings. See `README.md` in this folder for which half is which.
