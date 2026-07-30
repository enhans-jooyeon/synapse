# Token naming convention — audit

Audit of the new Synapse token set: is the naming convention internally consistent, and is it the right *kind* of convention for this system? Scope: `tokens/synapse.css` (187 light-mode custom properties) + `tokens/synapse.tokens.json` (176 primitive leaves, 100 semantic leaves), as of 2026-07-30.

---

## Verdict up front

**The convention type is right. Don't change the model.** The defects below are consistency bugs on the naming surface, not evidence of the wrong architecture. Specifically:

- **Two-tier primitive → semantic is correct** and correctly implemented. 75 of 100 semantic tokens alias a primitive via `{primitive.*}` references; the ramps (`gray` 13 steps, `slate`/`blue`/`green`/`amber`/`red` 11 each, `alpha` 10, `point` 6, `viz` 8) are real and reasoned-about. This is the DTCG-shaped setup you want, and it's the thing that makes adding variants cheap — a new variant picks a ramp step rather than inventing a hex.
- **Aliasing is genuinely aliasing, not copy-paste.** `action-brand-bg`, `brand-point`, and `ai-solid` are all `#1A1A1F` but each independently references `{primitive.color.point.500}`. They cannot drift. I checked for duplicated literals masquerading as aliases and found none in the color families.
- **Zero value drift** between `synapse.css` and `synapse.tokens.json` today (all 100 comparable semantic leaves agree; the 6 that look mismatched are CSS `var(--sy-space-N)` references resolving to the JSON's px value).

What's actually wrong is that the system encodes the *same idea* three different ways in three different families, and never says so out loud. That's what made the migration hit gaps exactly where it did.

---

## Defect 1 — ⚠️ PARTIALLY RESOLVED · three state-encoding strategies coexist

**This is the highest-impact finding and the root cause of most migration gaps.**

The system expresses "the hover/active version of this thing" in three incompatible ways:

| Strategy | Where | Example |
|---|---|---|
| **Suffix variant** | `action-*`, `bg-selected`, `ai-surface`, `status-danger-bg-solid` | `action-primary-bg` → `action-primary-bg-hover` |
| **Ladder step** | `border-*` | `border-default` → `border-strong` *is* the hover (foundations §5: "`border.strong` — hover state on interactive bordered elements") |
| **Composited overlay** | `bg-hover`, `bg-active` | a standalone alpha layered over *any* surface, so `bg-sunken` needs no `bg-sunken-hover` |

Measured coverage — **0 of 8 `border-*` tokens have a `-hover`**, while `action-*`, `bg-selected`, `ai-surface`, and `status-danger-bg-solid` all do:

```
action-primary-bg      hover=Y  active=Y     border-default    hover=·  active=·
action-brand-bg        hover=Y  active=Y     border-strong     hover=·  active=·
action-secondary-bg    hover=Y  active=·     border-subtle     hover=·  active=·
ai-surface             hover=Y  active=·     border-error      hover=·  active=·
bg-selected            hover=Y  active=·     border-selected   hover=·  active=·
status-danger-bg-solid hover=Y  active=·     (all 8 border-*: no state variants)
```

Read as a suffix convention, the border family looks broken. It isn't — it's a ladder. But nothing in `foundations.md` or the token file states the rule, so:

- A contributor adding a variant can't tell which strategy applies to their family.
- `border-strong` is silently doing **double duty** — it is both a weight and a state. That's precisely why old `border-border-300-hover` had nowhere to land: the new system's "hover" slot for borders is already occupied by a weight.
- The ladder has no room above `border-strong` except `border-selected` (near-black, `19.9:1` on white). A bordered element resting *at* `border-strong` has no hover.

**Recommended fix:** document the three strategies explicitly in `foundations.md`, one line each, naming which families use which. Then decide whether `border-*` should keep the ladder (cheap, works) or move to suffixes (consistent, costs ~4 new tokens). I'd keep the ladder and document it — but add `border-strong-hover` so the ladder isn't capped. **`border-strong-hover` was added 2026-07-30; the three strategies are still not documented in one place in `foundations.md`.**

---

## Defect 2 — ✅ RESOLVED 2026-07-30 · `-inverse` meant two different things

| Token | Meaning of `-inverse` |
|---|---|
| `bg-inverse`, `text-on-inverse` | **is** the inverted thing (a dark surface; white text) |
| `text-link-on-inverse`, `status-*-inverse` | is **for use on** inverted things |

`text-link-on-inverse` (`#9DB3EE`) isn't an inverted link — it's a link tuned for a dark surface. The system already has the right convention for that sense: **`text-on-solid`**. Same semantic role ("foreground for use on X"), different convention.

**RESOLVED** — the five "for use on" tokens now carry `-on-inverse`. Original recommendation: rename the five "for use on" tokens to `-on-inverse` (`fg-link-on-inverse`, `status-info-on-inverse`, …). Cheap, mechanical, and it makes the `-on-*` prefix a real rule rather than a one-off. Do it before the FE re-points, not after.

---

## Defect 3 — ✅ RESOLVED 2026-07-30 · `radius-10` was a literal inside a t-shirt scale

```
radius-none · radius-xs(4) · radius-sm(8) · radius-10 · radius-md(12) · radius-lg · radius-xl · radius-2xl · radius-full
```

One member is named by its pixel value and sorts between `sm` and `md`. It exists because controls needed a 10px step the t-shirt scale didn't have (foundations §5: control radius is size-relative, sm 8 / md 10 / lg 12).

**Recommended fix — pick one:**

- **(a)** Add a parallel `radius-control-sm/md/lg` set aliasing `radius-sm` / the 10px step / `radius-md`. Keeps the t-shirt scale clean, names the actual intent, and reads better at call sites than `radius-control-md`. **My preference.**
- **(b)** Convert the whole radius scale to literals (`radius-4/6/8/10/12/16/24/full`). Consistent, but throws away the semantic layer everywhere else in the system uses.

**RESOLVED** as `radius-control-md`, named for its only job. Original note: do not leave it as-is; it's the one defect a contributor will copy as precedent ("I guess we name radii by value sometimes").

---

## Defect 4 — ⚠️ HALF RESOLVED · semantic tokens holding raw literals

16 of the 25 are the `viz-bg-*` and `viz-text-*` families:

```
color.viz-bg.1   = #DEE5F9      ← raw, not {primitive.color.*}
color.viz-text.1 = #4761AF      ← raw
```

Meanwhile `primitive.color.viz` **does** have steps 1–8 for the base ramp. So the base viz colors are reasoned about as a ramp and their tint/text variants are hand-picked hexes. Consequence: adding a 9th categorical color means hand-deriving two more values with no ramp to guide them, and nothing checks that `viz-3-text` is actually AA on `viz-3-bg`.

**HALF RESOLVED 2026-07-30:** the 16 `viz-bg`/`viz-text` literals became the `category-*` family, which references the UI ramps and is fully AA-gated. But `viz-1..8` themselves are still literals (now per-mode), so backing ramps for the eight chart hues remain open. Original recommendation: promote them to `primitive.color.viz-bg.1-8` / `primitive.color.viz-text.1-8`, or derive them from the base ramp with a documented rule (e.g. tint = ramp step 100, text = ramp step 700). The remaining 9 literals (`padding-none: 0px`, `border-overlay: transparent`) are fine — genuine zero/keyword values.

---

## Defect 5 — the `status-*` base token omits the role suffix every other text token declares

`text-primary`, `text-secondary`, `ai-fg`, `emphasis-fg` all declare their role. But:

```
status-success      = #0E7A42   ← this is a TEXT color, unmarked
status-success-bg   = #DCF2E6   ← tint
status-success-bg-solid = #1F9D5B ← saturated fill
```

A consumer reading `status-success` cannot tell it's a foreground. And `-bg` is carrying three distinct meanings across the set: the *fill of an action* (`action-primary-bg`), a *pale tint* (`status-*-bg`, `viz-*-bg`), and — stacked — a *saturated fill* (`status-*-bg-solid`). That stacking produces `status-danger-bg-solid-hover`: four segments, ambiguous parse.

**Recommended fix (only if you're already touching the status family):** `status-success-fg` / `status-success-tint` / `status-success-fill` / `status-success-fill-hover`. This is the most invasive rename in this document and the least urgent — it's a legibility win, not a correctness one. If the FE migration is imminent, defer it; renaming twice is worse than a mediocre name.

---

## Defect 6 — `meter-fill` is a family of one with a unique suffix

`--sy-meter-fill` (`{primitive.color.gray.500}`) is the only `meter-*` token and the only use of `-fill` anywhere. It's a component token living in the semantic tier.

**Recommended fix:** low priority. Either accept it as a documented component-token exception, or fold it into the family it belongs to. But if you're planning a component-token tier, this is the first resident — worth deciding before there are ten of them.

---

## Defect 7 — ❌ STILL OPEN · nothing gates CSS ↔ JSON parity

`tools/validate.py` checks a lot: internal `{reference}` resolution (SY008), `$version` lockstep against `design.md`, contrast pairs, raw-value bans (SY001/SY009), manifest drift (SY017). It does **not** check that a semantic token's value in `synapse.css` equals its resolved value in `synapse.tokens.json`. The two files are hand-maintained in parallel with no generator (`scripts/build-dist.mjs` doesn't emit the CSS).

There is **no drift today** — I verified all 100 comparable leaves. But the repo has been burned by exactly this class of bug before; the code says so:

> `# version lockstep (v6.31.1): tokens $version must equal the design.md header — this drifted silently for 12 versions before being checked here, CI alone was not enough`

**Recommended fix:** add the parity check to `validate.py` as a new rule. ~30 lines, and it's the highest value-per-line change in this document — it protects everything else you're about to edit. Better still, generate `synapse.css` from the JSON and delete the possibility.

---

## Priority order

| # | Defect | Effort | Do it when |
|---|---|---|---|
| 7 | No CSS↔JSON parity gate | S | **Now** — protects every edit below |
| 1 | Three state strategies undocumented | S (doc) | **Now** — blocks correct variant decisions |
| 2 | `-inverse` overloaded → `-on-inverse` | S | Before the FE re-points |
| 3 | `radius-control-md` in a t-shirt scale | S | Before the FE re-points |
| 4 | `viz-bg`/`viz-text` bypass the primitive tier | M | Before adding a 9th viz color |
| 5 | `status-*` role suffix + `-bg` overload | L | Only outside a migration window |
| 6 | `meter-fill` orphan | XS | Whenever a component tier is decided |

Defects 1, 2, 3, and 7 are the set I'd ship as one pass. They're all small, none changes a single color value, and together they make the naming rules stateable in a paragraph — which is what a contributor adding variants actually needs.
