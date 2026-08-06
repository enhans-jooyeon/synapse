# Continuous motion has no sanctioned curve or duration — 2026-08-06

**Status: OPEN — needs June's ruling.** Surfaced by migration-audit Test 9. June ruled that the app's `ease-linear` uses should switch to `--sy-ease-standard` "for now," with micro-interactions to be looked at more carefully later. **Five of the six cases are correct under that ruling. The sixth is not, and the system contradicts itself on it.**

## The finding

The audit found `ease-linear` in six places: **five sidebar transitions** and **one progress ring**.

The five sidebar transitions are genuine *transitions* — a panel moving from state A to state B. `--sy-ease-standard` is exactly right there, and the ruling should be applied as stated.

The progress ring is **continuous motion**: it loops, it has no start and end state, and it represents a rate. Applying an ease curve to a loop makes it visibly accelerate and decelerate on every revolution, which (a) reads as stuttering rather than spinning and (b) misrepresents progress, because the visual speed no longer corresponds to anything.

## The system already knows this — and does it off-contract

Synapse's own components contain two looping animations, and **neither can be expressed with the sanctioned tokens**:

| Component | Declaration | Curve | Duration |
|---|---|---|---|
| `storybook/src/components/Button/Button.css:150` (loading spinner) | `animation: sy-btn-spin 0.8s linear infinite` | **`linear`** — not a token; no linear token exists | **800ms** — not on the 100/150/200/300 scale |
| `storybook/src/components/Avatar/Avatar.css:85` (running status dot) | `animation: sy-avatar-pulse 1.6s var(--sy-ease-standard) infinite` | token (defensible for a pulse) | **1600ms** — not on the scale |

So the design system's own spinner uses the exact value the ruling would forbid the product from using, and both looping animations sit outside the duration scale. This is a **contract gap**, not a product defect: `foundations` §7 specifies motion for *transitions* (enter/exit/standard, 100–300ms, with a mandatory entrance rule and a `prefers-reduced-motion` collapse) and is silent on continuous motion entirely.

## Why the gap exists

The three curves are all transition curves by construction — `standard` `cubic-bezier(0.2, 0, 0, 1)`, `enter`, `exit`. Every one has acceleration and deceleration because a transition *starts* and *stops*. A loop does neither. There is no value in the scale that can express "constant rate," and the duration band (100–300ms) is calibrated for state changes, not for a revolution period — 800ms and 1600ms are correct for their purpose and would be absurd as transition durations.

## Options

**A — Add a scoped continuous-motion tier (recommended).** A `--sy-ease-linear` token plus one or two loop durations (e.g. `--sy-duration-spin: 800ms`, `--sy-duration-pulse: 1600ms`, matching what the components already use), with a jurisdiction rule in §7: *these apply only to `infinite`/looping animation — spinners, indeterminate progress, pulses — and never to a transition.* This regularizes what the system already ships, gives the product a correct target, and keeps the transition scale closed. Gate: SY025 exempts declarations carrying `infinite`, and the ring/pulse durations are only valid there.

**B — Apply the ruling literally.** Switch the progress ring to `ease-standard` and accept the stutter; leave the DS's own spinner as an un-gated exception. Cheapest, but it ships a known-wrong animation and leaves the contradiction in place.

**C — Forbid continuous motion above a threshold.** Argue that spinners are the only legitimate loop, spec them as a component-owned exception inside the Spinner entry, and keep the token scale untouched. Narrower than A; leaves the Avatar pulse unaccounted for.

## Recommendation

**A**, scoped tightly. The cost is three tokens and one jurisdiction sentence; the benefit is that the system stops contradicting itself and the product gets a target that is actually correct. It also converts two existing off-contract values in the DS's own components into compliant ones without changing a single rendered pixel.

**What would change this:** if the Avatar pulse and Button spinner are both slated for redesign, or if the product's only loop is the one progress ring, option C's narrower framing is enough.

## Immediate action regardless of the ruling

The five sidebar transitions migrate to `--sy-ease-standard` now — that part of the ruling is unambiguous and correct. Only the progress ring waits on this proposal.

---

## Related open decision — the shadow class-name collision (migration-audit Test 8)

Not the same question, but it blocks the same migration and needs a ruling in the same pass.

The new SY009 product-gate rule flags Tailwind `shadow-{sm,md,lg,xl,…}`. But **four of those names are also Synapse's own token names** (`--sy-shadow-sm/md/lg/xl`), and `tooling/product-gates/tailwind.synapse.cjs` tells consumers to build their `boxShadow` scale from the tokens. A correctly-migrated product would therefore emit `shadow-lg` meaning `var(--sy-shadow-lg)` — correct code that the rule flags anyway. A regex cannot tell the two apart.

- **Option 1 — rename in the theme** (the z-index precedent): the product's shadow scale becomes distinguishable (`shadow-float-md` or similar) and the bare Tailwind names stay permanently forbidden. Consistent with how `z-sticky…z-tooltip` was solved.
- **Option 2 — treat SY009 as migration-phase only**: run it to triage the 160 uses, then relax it once the theme is token-sourced. Simpler, but leaves nothing preventing a later regression.

Also unresolved from the same rule: `shadow-xs` and bare `shadow` are **not** in the ruled class list so they are not flagged (though `xs` is a token name too), and `drop-shadow-*` matches the pattern incidentally — defensible, since it is a genuinely untokenized effect, but wider than the ruling named.
