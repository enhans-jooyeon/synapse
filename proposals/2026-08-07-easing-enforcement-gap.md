# Proposal — easing has no enforcement on either side (OPEN, needs a ruling)

**Filed:** 2026-08-07 · **Status:** OPEN · **Blocks:** nothing; the v4 preset ships without it
**Found by:** compiling `tooling/product-gates/tailwind.synapse.v4.css` against Tailwind 4.3.3 while verifying the v4 migration packet.

## The gap, in two facts

1. **`ease-linear` and `ease-initial` survive `--ease-*: initial`.** Tailwind v4 ships them as *static* utilities that never consult the easing namespace. `ease-in-out` is correctly removed; those two are not. On v3 the `transitionTimingFunction` replacement did remove `ease-linear`, so this is a **v4-only regression** in what the theme can reach.
2. **`check-raw-values.mjs` has no easing rule at all.** Its inventory is SY001, SY002, SY007, SY009, SY010, SY023, SY025. Nothing matches `ease-*`.

Net: on v4, `className="transition ease-linear"` on a hover is a contract violation that compiles clean and passes the gate. `tools/validate.py` catches only the CSS-declaration form (`transition-timing-function: linear`), so the class form is unenforced on both sides.

Audit context: the 2026-08-06 migration test found **five `ease-linear` transitions** in the product app. Those five are exactly the population this rule would govern.

## Why it is not a one-line fix

The obvious rule — "ban `ease-linear`" — contradicts a ruling we already made. `foundations` §7 and the 2026-08-06 continuous-motion ruling deliberately keep `linear` **legal** for continuous motion: the progress ring is `animation: sy-btn-spin 0.8s linear infinite`, and SY025 already carries an `infinite` exemption for exactly this reason. A spinner that eases is wrong.

So the rule has to separate **linear-on-a-loop** (correct, out of jurisdiction) from **linear-on-a-transition** (a violation). SY025's existing test — does the line declare `infinite`? — works for the CSS form but not for the class form, because `ease-linear` appears in a `className` string with no animation declaration anywhere near it.

## Options

**A. Mirror SY025 — flag `ease-*` on any line that also carries `transition`, exempt lines carrying `animate-`.**
Cheap, consistent with the SY025 precedent, catches the five real call sites. Weakness: `transition` and `ease-linear` need not share a line, and Tailwind's `animate-*` is not the only way to reach a keyframe animation. Under-catches; never over-catches.

**B. Flag every `ease-*` class that is not one of the three sanctioned curves.**
Strongest coverage, no line-proximity heuristic. Requires the three curves to exist as classes on v4 — they do (`ease-standard` / `ease-enter` / `ease-exit`, verified compiling). Weakness: over-catches the legitimate spinner if anyone ever writes it as a utility rather than a keyframe, forcing a `synapse-allow` with a ticket.

**C. Leave it review-only and document it.**
Zero code. What the migration guides now say. Weakness: it is the only area in the whole audit with no machine backstop, which is precisely the failure mode Synapse exists to prevent.

## What I need from you

Two decisions:

1. **Is `ease-linear` on a *transition* ever legitimate?** If never, option B is correct and simplest. If sometimes, we need A's heuristic and its under-catching is the price.
2. **Does this get a new rule ID (SY026) or extend SY025?** SY025 is "duration scale"; easing is a different property with a different jurisdiction rule. My read is a new ID, since error codes are append-only and conflating them makes the message unactionable — but that is a taxonomy call, not a technical one.

## Recommendation

**Option B with a new SY026.** The three curves are the closed set the contract already declares, the spinner lives in a keyframe (where no utility class is involved and the rule cannot reach it anyway), and B needs no proximity heuristic that will drift. A is a heuristic that will quietly stop catching things; C leaves the one hole in an otherwise complete gate.

**Confidence:** high on the two facts (compiled and grepped, not inferred); medium on the recommendation — it rests on the claim that no legitimate continuous motion is ever expressed as a Tailwind utility rather than a keyframe, which is true in this repo today but is a convention, not a guarantee.
