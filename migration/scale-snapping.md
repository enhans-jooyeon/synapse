# Scale migration — off-scale px → the closed font / radius / spacing scales

**For the product-repo migration (ruled by June, 2026-08-06 — migration audit test 4; contract: `design.md` hard rule 2, `foundations.md` §2.2 / §3 / §5; gate SY002).** Written for the **~552 off-scale px call sites** the audit measured against Synapse's scales: **462 font sizes** (10px ×331 plus ~131 decimals — 10.5 ×66, 11.5 ×39, 12.5 ×17, 9.5 ×6, 13.5 ×3) and **90 radii** (2px ×90), plus any off-scale spacing. Those are the numbers a conversion script's coverage report must add up to.

**Answer to "which DS files do I update?" — NONE.** No token is added, no scale is widened; every target below already ships. Scope note: **box width and height are excluded** — free values, never on a scale.

## Why an off-scale px is an error, not a warning

`design.md` hard rule 2: *"NEVER use an off-scale spacing, radius, or font-size value. The scales in the token file are exhaustive."* Exhaustive is the operative word — these are not "preferred values with room around them".

- **The font floor of 11 is a legibility floor, not a taste floor, and it is bilingual.** `foundations.md` §2.2 records that 11 is already the edge: `micro` is the *"floor size [that] carries the reinforced weight: 500 fuzzes at 11px (especially Hangul), 700 clogs counters."* If the system needs a weight correction to keep Hangul readable **at** 11, there is nothing below it — 10 is off the bottom of the legible range in one of two required locales.
- **Decimal px do not survive rendering.** `10.5px` resolves per device pixel ratio and per browser rounding, so the same component renders at 10 or 11 depending on the machine — off-scale *and* non-deterministic.
- **A font size is not a property; it is a bundle.** Hard rule 2 again: *"Typography is set only through the typography styles (foundations §2.2 / `.sy-type-*`)."* A style fixes size + line-height + weight together, and the line-height is a floor sized for Hangul ascent/descent (`foundations.md` §2.3.3 — *"NEVER tighten"*). A font-size snap is a *style* choice, not a `font-size` edit.
- **Radius reads relative to height** (`foundations.md` §5: *"Radius reads relative to height, not just component tier"*). A 2px corner on a 36px control is indistinguishable from square, so it expresses no decision; the nonzero floor of 4 is where corners start meaning something. (`0` / `radius.none` stays legal for a deliberately squared container — SY002 special-cases zero.)

## The rounding rule

> **Nearest value on the scale; ties go away from the floor** (a value exactly between two steps takes the larger). **Anything below the floor goes to the floor.**

Not a rounding case but the scale's own bottom: `9.5` / `10` / `10.5` are below the font floor of 11, `2` is below the radius floor of 4. State the rule rather than reaching for `round()` — **Python's `round()` is banker's rounding and would send 12.5 → 12**, contradicting the ruling.

```python
FONT_SCALE   = sorted({11, 12, 13, 14, 16, 18, 20, 24, 30, 36})              # tools/validate.py
RADIUS_SCALE = sorted({4, 6, 8, 10, 12, 16, 20, 24, 9999})                   # tools/validate.py
SPACE_SCALE  = sorted({0, 1, 2, 4, 6, 8, 10, 12, 16, 20, 24, 28, 32, 40,
                       48, 64, 80, 96, 128, 160, 192, 224, 256, 320, 384})   # tools/validate.py

def snap(v, scale):
    if v <= scale[0]: return scale[0]                    # below/at the floor
    return min(scale, key=lambda s: (abs(s - v), -s))    # nearest; ties → the larger
```

## The real fix: source the three scales from tokens, REPLACING the defaults

The highest-value step in this area, and the cheapest: **it turns the migration from a lint problem into a build problem.** Today `text-[10.5px]` compiles and a gate complains afterwards. Wire the theme to the token file and the same string has no class to resolve to — **the ~131 decimal-px sites fail to compile**, along with every `rounded-[2px]` and `p-[7px]`, at the point where the wrong value was typed.

**Tailwind v3:**

```js
// tailwind.config — the three scales come from tokens; Tailwind's defaults are REPLACED.
// tooling/product-gates/tailwind.synapse.cjs already ships `spacing` + `borderRadius`
// exactly like this (and `boxShadow`, prefixed); `fontSize` is still a TODO comment there.
const t = require('@enhans-jooyeon/synapse/tokens/synapse.tokens.json');
const scale = g => Object.fromEntries(
  Object.entries(t.primitive[g]).filter(([k]) => !k.startsWith('$')).map(([k, v]) => [k, v.$value]));

theme: {
  // Token keys are 4px-multiplier indexes, so Tailwind muscle memory survives (foundations §3):
  // p-1 = 4px, p-4 = 16px, p-96 = 384px. There is no 7 — `p-[7px]` has no home.
  spacing: { ...scale('space'), px: '1px' },  // `px` ONLY for the sanctioned hairline offset
                                              //   beside a 1px border; no 1px space token exists
  borderRadius: scale('radius'),              // rounded-none/xs 4/sm 8/6/10/md 12/lg 16/xl 20/
                                              //   2xl 24/full — and NOTHING else
  fontSize: TYPE_STYLE_BUNDLES,               // 20 styles as [size, {lineHeight, fontWeight,
  lineHeight: {}, letterSpacing: {},          //   letterSpacing}] — import that table from
                                              //   typography-tailwind-migration.md, don't restate it
}
```

**Tailwind v4:** there is no `theme` object — the three scales are theme *variables*, and "replace the defaults" is a `: initial` clear on each namespace. `spacing` → `--spacing-*`, `borderRadius` → `--radius-*`, `fontSize` → `--text-*`.

```css
/* app.css — after `@import "tailwindcss"` and Synapse's own tokens/synapse.css */
@theme inline {
  --spacing-*: initial;              /* also removes v4's bare `--spacing` multiplier, which */
  --radius-*:  initial;              /*   is what generates p-7/p-13 dynamically — so the    */
  --text-*:    initial;              /*   scale really is closed */
  --leading-*: initial;  --tracking-*: initial;    /* the fontSize rider, v4 spelling */

  --spacing-1: var(--sy-space-1);    /* p-1 = 4px … p-96 = 384px; half-steps keep the token */
  --spacing-0_5: var(--sy-space-0_5);/*   key, so the class is p-0_5 (not Tailwind's p-0.5) */
  --spacing-px: 1px;                 /* the sanctioned hairline offset ONLY */
  --radius-card: var(--sy-radius-card);   /* prefer the role tier: inset/nested/tray/card/  */
  --radius-md:   var(--sy-radius-md);     /*   overlay/shell. The two control-optical steps */
                                          /*   6/10 are rounded-control-xs / -control-md    */
  --text-body: var(--sy-body-size);       /* + --text-body--line-height / --font-weight     */
  /* …the full scales: tooling/product-gates/tailwind.synapse.v4.css */
}
```

Two riders, both versions. (1) `fontSize` **must** be bundles with `lineHeight`/`letterSpacing` emptied beside it (v4: `--text-NAME` + its paired `--line-height`/`--font-weight`, with `--leading-*`/`--tracking-*` cleared), so a font snap cannot leave an unbundled line-height behind. (2) A theme cannot delete bracket syntax: replacement kills every *named* off-scale class outright, and the arbitrary form needs the preset's arbitrary-value ban beside it — enforced today by `tooling/product-gates/check-raw-values.mjs` (SY002). Land both.

## The mapping tables

**Font** — verified against `FONT_SCALE` (floor **11**). 462 uses, all mechanical.

| App value | → | Reason | Uses |
|---:|---:|---|---:|
| 9.5px | **11px** | below the 11px floor → floor | 6 |
| 10px | **11px** | below the 11px floor → floor | 331 |
| 10.5px | **11px** | below the 11px floor → floor | 66 |
| 11.5px | **12px** | tie (11 and 12 are both 0.5 away) → away from the floor | 39 |
| 12.5px | **13px** | tie (12 / 13) → away from the floor | 17 |
| 13.5px | **14px** | tie (13 / 14) → away from the floor | 3 |

**Every decimal in the audit landed on a tie or under the floor** — not one genuinely "nearer one side" case — so the tie rule does all of the work. Then pick the **style**, not the size: 11 → `micro` / `micro-label` (11/16, 600) · 12 → `caption` (12/18, 400) / `label-sm` (12/18, 500) / `code-sm` · 13 → `body-sm` (13/20, 400) / `label` (13/20, 500) / `code` · 14 → `body` (14/22, 400) / `heading-sm` (14/22, 600).

**Radius** — verified against `RADIUS_SCALE` (nonzero floor **4**; 6 and 10 are the documented control-optical exceptions). One value in the audit: **2px ×90 → 4px**, below the floor → floor.

4px is `--sy-radius-inset` in the containment-role tier — usually the right *name* for a 2px corner's job (a nested chip, an inner field, a corner-anchored child). **Prefer the role alias over the size name**; the concentric rule (`inner = outer − inset`) still overrides both for corner-anchored children (`foundations.md` §5).

**Spacing** — same rule, same code path: nearest step in `SPACE_SCALE`, floor 0, ties away from the floor. `1` is sanctioned only as a hairline offset paired with a 1px border — never snap *to* 1 for anything else.

## Decision tree per call site

```
For each off-scale px value:
├── Is it a box WIDTH or HEIGHT? → out of scope. Free value, never on a scale. Leave it.
├── Is it a FONT SIZE?
│   ├── snap per the font table (below 11 → 11; ties → larger)
│   └── then replace the size class with the TYPE STYLE for that size — one class carries
│       size + line-height + weight. Do NOT keep a separate leading-*/tracking-* beside it.
├── Is it a RADIUS?
│   ├── snap per the radius table (below 4 → 4; 0 stays 0 if the corner is meant to be square)
│   └── prefer the ROLE alias (--sy-radius-inset/nested/tray/…) over the size name; if the
│       element is a corner-anchored child, the concentric rule decides instead (foundations §5)
├── Is it SPACING? → nearest SPACE_SCALE step, ties away from the floor (±1px only as the
│   sanctioned hairline offset beside a 1px border)
└── Does it genuinely need a value the system lacks — no step on the scale expresses it?
    └── file a proposal (design.md §6), never a local override and never "close enough"
        rounding. No proposal of this kind was ruled in by this audit.
```

June's summary: **10px font → 11px** (331 uses; no 10px token created), **2px radius → 4px** (90 uses; no 2px token), decimal fonts (~131 uses) **snap to the nearest scale value**, and generally *"match everything to the proposed values."*

## Enforcement

- Product repo — `tooling/product-gates/check-raw-values.mjs`: **SY002** flags a bare px literal and any Tailwind arbitrary value (`text-[10.5px]`, `rounded-[2px]`, `p-[7px]`). Wire it into product CI, and land the theme replacement above so the gate is a backstop rather than the front line. Presets: `tooling/product-gates/tailwind.synapse.cjs` (v3) · `tooling/product-gates/tailwind.synapse.v4.css` (v4).
- DS repo — `tools/validate.py`: **SY002** lexes the CSS-declaration form against `FONT_SCALE` / `RADIUS_SCALE` / `SPACE_SCALE`; **SY007 / SY010** cover the unbundling side. **`synapse-allow`** remains the documented escape hatch and must carry a harness ticket reference on the line. Dogfooding precedent: replace-the-theme is what closed z-index (`migration/z-index-migration.md` — 3 errors + 4 missing isolations in this repo's own render on day one) and typography.

## Not changing in the DS — the answer to "which DS files do I update?" is **NONE**

**No tokens were added and no scale changed.** `FONT_SCALE`, `RADIUS_SCALE`, `SPACE_SCALE` stay **exactly** as they are: no 10px font token, no 9.5 / 10.5 / 11.5 / 12.5 / 13.5, no 2px radius token. `tokens/synapse.tokens.json` and `tokens/synapse.css` are **untouched**, so **do not wait for a token release** — every value in the tables already has its target in the shipped bundle.
