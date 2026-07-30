# Token naming — proposed `category-property-modifier` pass

**Status: proposal, not applied.** 209 tokens · **111 renamed** · net count 209 → 205 (4 collapsed). Zero value changes.

## The convention

```
--sy-<category>-<property>-<modifier>
      |          |          |
      |          |          state or variant: hover · active · disabled · solid · subtle · on-inverse · soft
      |          role or slot: page · primary · danger · action-brand · category-5 · ai · series-3
      what is painted: text · icon · bg · border · overlay   (or the token type: font · space · radius · shadow · z · duration · ease)
```

**One rule, stated once:** the first segment says *what is painted*, never *which component*. Component identity, when it matters, lives in the property slot (`bg-action-primary`, not `action-primary-bg`).

## Why now

Three renames landed piecemeal today — `fg-*` → `text-*`, `-inverse` → `-on-inverse`, `radius-10` → `radius-control-md`. Each was locally correct; together they made the set feel arbitrary, because the *order* of segments was never fixed. This pass fixes the order, and it is the last rename the convention should need.

## Five real defects this closes

**1. A collision introduced by the `fg-*` → `text-*` rename.** `--sy-text-11` is a font size; `--sy-text-primary` is a colour. Same prefix, different categories. → `font-size-11` vs `text-primary`.

**2. Five tokens are the same white for one job.** `text-on-solid`, `action-primary-fg`, `action-brand-fg`, `action-danger-fg`, `brand-point-fg` are all `#FFFFFF` and all mean "label on a solid fill". → collapse to `text-on-solid`. **This is the only place the pass reduces token count.**

**3. `status-*` base tokens don't say they're text** (audit Defect 5). `status-danger` is a text colour with nothing marking it. → `text-danger`.

**4. `-bg` means three different things** (audit Defect 5, second half). The *fill of an action* (`action-primary-bg`), a *pale tint* (`status-danger-bg`), and — stacked — a *saturated fill* (`status-danger-bg-solid`), producing the four-segment `status-danger-bg-solid-hover`. → `bg-action-primary` / `bg-danger-subtle` / `bg-danger-solid` / `bg-danger-solid-hover`.

**5. Overlays are indistinguishable from surfaces.** `bg-sunken` is an opaque layer; `bg-hover` composites over anything. Nothing in the name warns you. → `overlay-hover`, `overlay-active`, `overlay-scrim`.

Plus two smaller ones: `bg-surface` stuttered ("background-surface") and was ambiguous against `bg-page`/`bg-raised` → `bg-subtle`; and `viz-*` said nothing about being chart-only → `chart-series-*`.

## Collision check

Exactly one new name receives multiple old ones — `text-on-solid`, from five tokens that are byte-identical. Every other rename is 1:1. Verified programmatically against the shipped CSS.

---

## Full mapping

### font (29)
Fixes the font-size/colour collision and gives the type scale an explicit category.

| old | new |
|---|---|
| `font-display` | `font-family-display` |
| `font-mono` | `font-family-mono` |
| `font-sans` | `font-family-sans` |
| `text-11` | `font-size-11` |
| `text-11-lh` | `font-lh-11` |
| `text-12` | `font-size-12` |
| `text-12-lh` | `font-lh-12` |
| `text-13` | `font-size-13` |
| `text-13-lh` | `font-lh-13` |
| `text-14` | `font-size-14` |
| `text-14-lh` | `font-lh-14` |
| `text-16` | `font-size-16` |
| `text-16-lh` | `font-lh-16` |
| `text-18` | `font-size-18` |
| `text-18-lh` | `font-lh-18` |
| `text-20` | `font-size-20` |
| `text-20-lh` | `font-lh-20` |
| `text-24` | `font-size-24` |
| `text-24-lh` | `font-lh-24` |
| `text-30` | `font-size-30` |
| `text-30-lh` | `font-lh-30` |
| `text-36` | `font-size-36` |
| `text-36-lh` | `font-lh-36` |
| `text-44` | `font-size-44` |
| `text-44-lh` | `font-lh-44` |
| `weight-bold` | `font-weight-bold` |
| `weight-medium` | `font-weight-medium` |
| `weight-regular` | `font-weight-regular` |
| `weight-semibold` | `font-weight-semibold` |

### text (27)

| old | new |
|---|---|
| `action-brand-fg` | `text-on-solid` |
| `action-brand-fg-disabled` | `text-action-brand-disabled` |
| `action-brand-fg-on-page` | `text-action-brand` |
| `action-danger-fg` | `text-on-solid` |
| `action-danger-fg-disabled` | `text-action-danger-disabled` |
| `action-primary-fg` | `text-on-solid` |
| `action-secondary-brand-fg` | `text-action-brand-subtle` |
| `ai-fg` | `text-ai` |
| `brand-point-fg` | `text-on-solid` |
| `category-1-text` | `text-category-1` |
| `category-2-text` | `text-category-2` |
| `category-3-text` | `text-category-3` |
| `category-4-text` | `text-category-4` |
| `category-5-text` | `text-category-5` |
| `category-6-text` | `text-category-6` |
| `category-7-text` | `text-category-7` |
| `category-8-text` | `text-category-8` |
| `emphasis-fg` | `text-emphasis` |
| `emphasis-fg-soft` | `text-emphasis-soft` |
| `status-danger` | `text-danger` |
| `status-danger-on-inverse` | `text-danger-on-inverse` |
| `status-info` | `text-info` |
| `status-info-on-inverse` | `text-info-on-inverse` |
| `status-success` | `text-success` |
| `status-success-on-inverse` | `text-success-on-inverse` |
| `status-warning` | `text-warning` |
| `status-warning-on-inverse` | `text-warning-on-inverse` |

### bg (38)

| old | new |
|---|---|
| `action-brand-bg` | `bg-action-brand` |
| `action-brand-bg-active` | `bg-action-brand-active` |
| `action-brand-bg-hover` | `bg-action-brand-hover` |
| `action-primary-bg` | `bg-action-primary` |
| `action-primary-bg-active` | `bg-action-primary-active` |
| `action-primary-bg-hover` | `bg-action-primary-hover` |
| `action-secondary-bg` | `bg-action-secondary` |
| `action-secondary-bg-hover` | `bg-action-secondary-hover` |
| `action-secondary-brand-bg` | `bg-action-brand-subtle` |
| `action-secondary-brand-bg-hover` | `bg-action-brand-subtle-hover` |
| `action-secondary-danger-bg` | `bg-action-danger-subtle` |
| `action-secondary-danger-bg-hover` | `bg-action-danger-subtle-hover` |
| `ai-solid` | `bg-ai-solid` |
| `ai-surface` | `bg-ai` |
| `ai-surface-hover` | `bg-ai-hover` |
| `bg-surface` | `bg-subtle` |
| `brand-point` | `bg-identity` |
| `category-1-bg` | `bg-category-1` |
| `category-2-bg` | `bg-category-2` |
| `category-3-bg` | `bg-category-3` |
| `category-4-bg` | `bg-category-4` |
| `category-5-bg` | `bg-category-5` |
| `category-6-bg` | `bg-category-6` |
| `category-7-bg` | `bg-category-7` |
| `category-8-bg` | `bg-category-8` |
| `emphasis-surface` | `bg-emphasis` |
| `glass-accent` | `bg-glass-accent` |
| `glass-surface` | `bg-glass` |
| `meter-fill` | `bg-meter` |
| `status-danger-bg` | `bg-danger-subtle` |
| `status-danger-bg-solid` | `bg-danger-solid` |
| `status-danger-bg-solid-hover` | `bg-danger-solid-hover` |
| `status-info-bg` | `bg-info-subtle` |
| `status-info-bg-solid` | `bg-info-solid` |
| `status-success-bg` | `bg-success-subtle` |
| `status-success-bg-solid` | `bg-success-solid` |
| `status-warning-bg` | `bg-warning-subtle` |
| `status-warning-bg-solid` | `bg-warning-solid` |

### border (5)

| old | new |
|---|---|
| `action-brand-border` | `border-action-brand` |
| `ai-border` | `border-ai` |
| `emphasis-border` | `border-emphasis` |
| `glass-border` | `border-glass` |
| `glass-rim` | `border-glass-rim` |

### overlay (4)
Split out of `bg-*` because these composite rather than replace.

| old | new |
|---|---|
| `bg-active` | `overlay-active` |
| `bg-hover` | `overlay-hover` |
| `bg-scrim` | `overlay-scrim` |
| `glass-selected` | `overlay-glass-selected` |

### chart (8)

| old | new |
|---|---|
| `viz-1` | `chart-series-1` |
| `viz-2` | `chart-series-2` |
| `viz-3` | `chart-series-3` |
| `viz-4` | `chart-series-4` |
| `viz-5` | `chart-series-5` |
| `viz-6` | `chart-series-6` |
| `viz-7` | `chart-series-7` |
| `viz-8` | `chart-series-8` |

---

## Unchanged (98)

`bg-page` · `bg-raised` · `bg-raised-2` · `bg-sunken` · `bg-selected` · `bg-selected-hover` · `bg-disabled` · `bg-inverse` · `bg-inverse-soft` · all `text-*` roles from the last rename · all `icon-*` · all `border-*` weights · `space-*` · `radius-*` · `padding-*` · `shadow-*` · `z-*` · `duration-*` · `ease-*` · `control-*`

The last rename already put `text-*` and `icon-*` in the right shape, which is why those two families need no further work.

## Cost

- **111 renames** across ~30 files. `preview.html` alone carries ~500 references.
- **Breaking for consumers** — the third breaking version in one day, which is the argument for doing it completely now and then freezing the convention.
- **Zero value changes.** Every hex, px and ms is identical; only names move. So the visual regression surface is nil and the risk is entirely mechanical.
- The gate, the parity sweep and the per-column render checks all catch mechanical errors, as they did on the previous three passes.

## Recommendation

Do it, once, and then **freeze the naming convention** — write the three-segment rule into `foundations.md` as a governance rule so the next addition has a shape to follow rather than a precedent to guess at. The reason today produced four renames is that no such rule existed.
