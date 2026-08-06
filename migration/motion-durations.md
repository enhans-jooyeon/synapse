# Motion migration — Tailwind `duration-*` / `ease-linear` → the four-value scale + three curves

**For the product-repo migration (ruled by June, 2026-08-06 — migration audit test 9; contract: `foundations.md` §7; gate SY025, product-side only).** Written for the off-scale duration classes the audit found — **`duration-500`, `duration-120`, `duration-180`** — plus the **six `ease-linear` uses: five sidebar transitions and one progress ring**. Per-class use counts were not recorded for the duration findings, so scope your conversion script by the three class names, not by a total; the easing side is exactly six sites and both halves of it are ruled below.

## Why an off-scale duration is an error, not a warning

`foundations.md` §7 opens with the jurisdiction: *"Motion confirms causality; it never decorates."* The scale is **closed at four values** — *"`instant` 100ms (hover, focus) · `fast` 150ms (dropdowns, tooltips) · `base` 200ms (modals, drawers, accordions) · `slow` 300ms (page-level transitions, toasts)"* — and Tailwind's `duration-*` utilities are a *different* scale (0/75/100/150/200/300/500/700/1000), so three of its keys happen to be legal and the rest are not.

The reason the off-scale values are wrong rather than merely unsanctioned is that §7's durations are **role assignments, not speeds**:

- **Each value names an interaction class.** A 500ms transition is not "a slow 300" — it is longer than any sanctioned page-level transition, and §7's entrance rule caps the whole vocabulary: *"No entrance exceeds one duration step; nothing 'springs'."*
- **The direction is asymmetric by rule.** *"Exits are plain fades at `fast` — leaving must feel quicker than arriving."* An engineer who picks a duration by arithmetic will produce symmetric enter/exit pairs that pass a nearest-value check and still violate §7.
- **The floor is an accessibility contract.** *"Respect `prefers-reduced-motion`: all non-essential motion collapses to opacity fades ≤100ms."* A 500ms decorative transition has nowhere to collapse to that isn't already a redesign.

## The snap table

| App value | → | Token | Why |
|---:|---:|---|---|
| `duration-120` | **100ms** | `--sy-duration-instant` | nearest step; 120 was hover/focus work |
| `duration-180` | **200ms** | `--sy-duration-base` | nearest step |
| `duration-500` | **300ms** | `--sy-duration-slow` | 300 is the ceiling of the scale — there is nothing slower to snap to |

Any other off-scale `duration-<n>` snaps to the nearest of {100, 150, 200, 300}, ties away from the floor, and anything above 300 clamps to 300. **Prefer picking the token by the interaction's ROLE** over picking it by arithmetic — a 500ms toast entrance is `slow` because it is a toast, and it also happens to be the nearest step. While you are in the file, check the §7 structural rules too: exits are `fast`, no entrance exceeds one duration step, and non-essential motion collapses to ≤100ms opacity fades under `prefers-reduced-motion`.

## The easing half — ruled, and it splits six ways five-to-one

- **The five sidebar transitions migrate to `--sy-ease-standard`.** They are genuine transitions: a panel moving from state A to state B, which starts and stops and therefore needs acceleration. That part of June's original ruling was always right.
- **The progress ring keeps `linear`.** It loops. See the jurisdiction ruling below.

## The continuous-motion jurisdiction ruling (June, 2026-08-06)

> **Continuous motion is scoped OUT of the transition scale, and no tokens are minted.** `foundations` §7 now states it: *"Continuous (looping) animation is outside this scale's jurisdiction … `linear` and a loop-appropriate period … are therefore **permitted for `infinite` animation only** … A non-looping transition may never take `linear` or an off-scale duration."* `prefers-reduced-motion` still applies — *"a loop stops, it does not slow down."*

A loop has no end state and represents a **rate**, so an ease curve makes it visibly speed up and slow down each cycle and misrepresents what it is showing. This is the same move as the 24px icon ceiling (`migration/icon-sizing.md`): the value isn't wrong, it's governed elsewhere. It also makes the system's own components compliant by scope rather than by exception — the Button spinner runs `0.8s linear infinite` and the Avatar running-dot pulses at `1.6s`, neither of which is on the transition scale and neither of which should be. Full reasoning, including the two options not taken: `proposals/2026-08-06-continuous-motion-gap.md`.

Practical consequence: **product gate SY025 skips any line declaring `infinite`.** Do not "fix" a spinner to `duration-300`, and do not file a proposal for a loop period.

## The real fix: `transitionDuration` replaces Tailwind's scale

Same move as z-index and typography — make the wrong thing unexpressible. `duration-500` / `duration-700` / `duration-1000` / `duration-75` cease to be classes, and so does `ease-linear`, which is what closes the easing half in the same edit.

```js
// tailwind.config — motion comes from tokens; Tailwind's defaults are REPLACED, not extended.
const t = require('@enhans-jooyeon/synapse/tokens/synapse.tokens.json');
const ms = k => t.primitive.motion.duration[k].$value;

theme: {
  transitionDuration: {                        // four keys, no DEFAULT: 0/75/500/700/1000 GONE
    instant: ms('instant'),                    // 100ms — hover, focus
    fast:    ms('fast'),                       // 150ms — dropdowns, tooltips, ALL exits
    base:    ms('base'),                       // 200ms — modals, drawers, accordions
    slow:    ms('slow'),                       // 300ms — page-level transitions, toasts
  },
  transitionTimingFunction: {                  // three curves by ROLE; `ease-linear` ceases
    standard: 'var(--sy-ease-standard)',       //   to exist, which is the easing migration
    enter:    'var(--sy-ease-enter)',
    exit:     'var(--sy-ease-exit)',
  },
  // Deliberately NOT touched: keyframes / animationDuration. Loops are outside §7's
  // jurisdiction, so a spinner writes `animation: … 0.8s linear infinite` in CSS and is
  // correct — the theme should not offer a utility that makes a loop look like a transition.
}
```

After this, `duration-instant…slow` and `ease-standard/enter/exit` are the whole transition vocabulary, and the only way to write `linear` is in a keyframe animation — which is exactly where it is legal.

## Decision tree per call site

```
For each duration / easing declaration:
├── Does the line declare an `infinite` (looping) animation — spinner, indeterminate ring,
│   status pulse?
│   └── YES → OUT OF SCOPE (foundations §7 jurisdiction, ruled 2026-08-06). `linear` and a
│       loop-appropriate period are correct; SY025 skips the line. Leave it alone.
│       (Under prefers-reduced-motion the loop STOPS — it does not slow down.)
└── NO — it is a transition (state A → state B) →
    ├── Is the class already 100 / 150 / 200 / 300? → compliant; verify the ROLE matches
    │   the step (hover/focus instant · dropdown/tooltip/EXIT fast · modal/drawer base ·
    │   page-level/toast slow), because the arithmetic can be right and the role wrong.
    ├── Off-scale duration → snap per the table (500→300, 180→200, 120→100); nearest step,
    │   ties away from the floor, >300 clamps to 300. Pick by role, confirm by arithmetic.
    ├── Is it `ease-linear` on a transition? → `--sy-ease-standard` (the five sidebar cases),
    │   or `enter` / `exit` if the element is appearing or leaving.
    └── Does the transition genuinely need a duration or curve the system lacks?
        └── file a proposal (design.md §6), never a local override. Note that this door
            is narrower than it looks: continuous motion is not a gap, it is out of scope.
```

## Enforcement

- Product repo — `tooling/product-gates/check-raw-values.mjs`, **SY025**: an off-scale Tailwind `duration-<n>` class or an arbitrary `duration-[…]` is an error; on-scale values (100/150/200/300) pass via a negative lookahead. A line matching `/\binfinite\b/` is exempt from the duration rules only — every other rule still runs on it. `synapse-allow` + a harness ticket reference is the documented escape.
- DS repo — **SY025 is deliberately NOT implemented in `tools/validate.py`.** The id is listed in its docstring so it is reserved and discoverable, with the reason: the violating form is a Tailwind class that exists only in product JSX, and this repo's own CSS already writes `--sy-duration-*`, so there is no declaration form here to lex.
- Precedent worth citing: the jurisdiction move itself. SY019's >24px relaxation (`migration/icon-sizing.md`) resolved an identical shape — a value that looked like a violation because a spec claimed jurisdiction it never specified — by naming the boundary instead of minting a token. Two rulings, one pattern, same day.

## Not changing in the DS

- **No new duration or easing tokens.** Four durations, three curves, closed. There is no 120, no 180, no 500, and no `--sy-ease-linear`.
- `tokens/synapse.tokens.json` and `tokens/synapse.css` are **untouched**; `foundations.md` §7 gained the jurisdiction sentence and nothing else.
