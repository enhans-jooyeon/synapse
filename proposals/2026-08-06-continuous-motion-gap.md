# Continuous motion has no sanctioned curve or duration — 2026-08-06

**Status: RULED (June, 2026-08-06) — both questions closed; see the rulings at the bottom of each section.** Surfaced by migration-audit Test 9. June ruled that the app's `ease-linear` uses should switch to `--sy-ease-standard` "for now," with micro-interactions to be looked at more carefully later. **Five of the six cases are correct under that ruling. The sixth is not, and the system contradicts itself on it.**

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

## RULING (June, 2026-08-06)

> "I think it's fine to keep it as is since that's an animation specific requirement."

**Neither option A nor B: continuous motion is scoped OUT of the transition scale, and no tokens are minted.** The values the system already uses (`linear`, 0.8s, 1.6s) are correct for what they do; they were only "violations" because §7 claimed jurisdiction it never actually specified. Executed:

- `foundations` §7 gains an explicit jurisdiction sentence: the four durations and three curves govern **transitions**; `linear` and a loop-appropriate period are permitted for `infinite` animation only; a non-looping transition may never take either. `prefers-reduced-motion` still applies — a loop *stops*, it does not slow down.
- Product gate **SY025 skips any line declaring an `infinite` animation**, so the progress ring and the Button spinner are compliant by scope.
- The five sidebar transitions still migrate to `--sy-ease-standard` — they are transitions, and that part of the original ruling was always right.

This is the same move as the 24px icon ceiling: the value isn't wrong, it's governed elsewhere. Options considered and not taken:

## Options (considered)

**A — Add a scoped continuous-motion tier (recommended).** A `--sy-ease-linear` token plus one or two loop durations (e.g. `--sy-duration-spin: 800ms`, `--sy-duration-pulse: 1600ms`, matching what the components already use), with a jurisdiction rule in §7: *these apply only to `infinite`/looping animation — spinners, indeterminate progress, pulses — and never to a transition.* This regularizes what the system already ships, gives the product a correct target, and keeps the transition scale closed. Gate: SY025 exempts declarations carrying `infinite`, and the ring/pulse durations are only valid there.

**B — Apply the ruling literally.** Switch the progress ring to `ease-standard` and accept the stutter; leave the DS's own spinner as an un-gated exception. Cheapest, but it ships a known-wrong animation and leaves the contradiction in place.

**C — Forbid continuous motion above a threshold.** Argue that spinners are the only legitimate loop, spec them as a component-owned exception inside the Spinner entry, and keep the token scale untouched. Narrower than A; leaves the Avatar pulse unaccounted for.

## Recommendation (superseded by the ruling above)

**A**, scoped tightly. The cost is three tokens and one jurisdiction sentence; the benefit is that the system stops contradicting itself and the product gets a target that is actually correct. It also converts two existing off-contract values in the DS's own components into compliant ones without changing a single rendered pixel.

**What would change this:** if the Avatar pulse and Button spinner are both slated for redesign, or if the product's only loop is the one progress ring, option C's narrower framing is enough.

## Immediate action

The five sidebar transitions migrate to `--sy-ease-standard`. The progress ring keeps `linear` under the §7 jurisdiction rule.

---

## Related open decision — the shadow class-name collision (migration-audit Test 8)

**RULED (June, 2026-08-06): Option 1 — rename in the theme, with the prefix chosen to encode the engineer's own triage.** Rationale and execution below.

The new SY009 product-gate rule flags Tailwind `shadow-{sm,md,lg,xl,…}`. But **four of those names are also Synapse's own token names** (`--sy-shadow-sm/md/lg/xl`), and `tooling/product-gates/tailwind.synapse.cjs` tells consumers to build their `boxShadow` scale from the tokens. A correctly-migrated product would therefore emit `shadow-lg` meaning `var(--sy-shadow-lg)` — correct code that the rule flags anyway. A regex cannot tell the two apart.

**Why the triage decides it.** The engineer's own classification resolves ring → a ring token and static → *no shadow at all*; only **floating** layers keep one. So the surviving class should say what it is for. The token scale is therefore exposed as **`shadow-float-xs … shadow-float-xl`** (`tooling/product-gates/tailwind.synapse.cjs`), replacing Tailwind's `boxShadow` defaults rather than shadowing them.

Three things fall out of that, all better than the enumeration it replaces:

1. **The ambiguity is gone permanently.** A bare `shadow-sm|md|lg|xl` is now *always* a leftover Tailwind default — it cannot be a token class — so SY009 is a standing rule, not a migration-phase one. Option 2 was rejected for exactly this: it would have left nothing preventing a regression after the migration.
2. **The rule became an allowlist and got complete.** SY009 now flags any `shadow-*` that isn't the sanctioned prefixed form, which closes the two holes the enumeration left — `shadow-xs` and bare `shadow` were unflagged despite `xs` being a token name.
3. **`drop-shadow-*` gets its own rule** rather than matching incidentally: it is a CSS-filter effect with no Synapse token behind it, so it is always a violation, and it no longer double-reports under the box-shadow rule.

The name also does review work: writing `shadow-float-md` on a static card reads wrong, which is the triage's conclusion made visible at the call site.
