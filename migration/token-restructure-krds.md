# Token restructure — KRDS three-tier model

**Status: proposal.** Reference: [KRDS 디자인 토큰](https://www.krds.go.kr/html/site/style/style_07.html)

Applied first, separately: **`category-*` removed** (16 semantic tokens + the `purple`/`teal`/`magenta` ramps, 33 primitive steps). Identity marks are now neutral `bg.sunken` + `text.secondary`.

---

## What KRDS actually prescribes

| Tier | Purpose | Notation | Used directly? |
|---|---|---|---|
| **Primitive** | raw values — colour ramps, type sizes, spacing numbers | `primary-50`, `gray-5`, `number-4` | **No** — reference only |
| **Semantic** | meaning in context, references primitives | `color-icon-primary`, `color-border-gray-light` | Yes |
| **Component** | one component's specifics, references semantics | `--namespace-component--theme-type-size-modifier` | Yes |

Three rules that change Synapse:

1. **Component name comes first, separated by a double dash.** `--sy-button--primary-bg`, not `--sy-action-primary-bg`. The `--` is what marks the tier visually.
2. **Semantic tokens carry an explicit type category** — `color-`, `font-`, `space-`. This is what kills the `text-11`/`text-primary` collision.
3. **Component tokens are defined in code, not the design tool.** KRDS keeps Figma at the semantic tier deliberately, so designers and engineers own different layers. Component tokens live inside each component's CSS class.

KRDS also notes an exception worth borrowing: **layout components and third-party-wrapped components get no component tokens** — they consume semantics directly. That maps cleanly onto Synapse's Sidebar/Header/GraphCanvas.

---

## The structural finding

**193 tokens split 163 semantic / 30 component.** The 30 component tokens are the interesting part, because Synapse currently files them as though they were system-wide semantics:

| Currently | Actually | Count |
|---|---|---|
| `action-*` | **Button**-only. No other component consumes them. | 20 |
| `glass-*` + `shadow-glass` | **AppLauncher**-only — foundations says so explicitly ("AppLauncher's faux-glass surface") | 8 |
| `meter-fill` | **ProgressBar**-only | 1 |
| `shadow-thumb` | **Switch**-only | 1 |

This is the root cause of the inconsistency you noticed. `action-primary-bg` and `bg-page` sit in the same namespace and look like peers, but one is a Button implementation detail and the other is a system-wide surface. Every naming decision made about them since has had to straddle both readings — which is why the segment order kept coming out different.

It also explains the `glass-*` awkwardness flagged in the convention audit: a family of 8 tokens for one component's faux-glass treatment is obviously a component token set, mis-filed as a semantic family.

---

## Component tier — 30 tokens

### button (20)

| old | KRDS |
|---|---|
| `action-brand-bg` | `--sy-button--brand-bg` |
| `action-brand-bg-active` | `--sy-button--brand-bg-active` |
| `action-brand-bg-hover` | `--sy-button--brand-bg-hover` |
| `action-brand-border` | `--sy-button--brand-border` |
| `action-brand-fg` | `--sy-button--brand-fg` |
| `action-brand-fg-disabled` | `--sy-button--brand-fg-disabled` |
| `action-brand-fg-on-page` | `--sy-button--brand-fg-on-page` |
| `action-danger-fg` | `--sy-button--danger-fg` |
| `action-danger-fg-disabled` | `--sy-button--danger-fg-disabled` |
| `action-primary-bg` | `--sy-button--primary-bg` |
| `action-primary-bg-active` | `--sy-button--primary-bg-active` |
| `action-primary-bg-hover` | `--sy-button--primary-bg-hover` |
| `action-primary-fg` | `--sy-button--primary-fg` |
| `action-secondary-bg` | `--sy-button--secondary-bg` |
| `action-secondary-bg-hover` | `--sy-button--secondary-bg-hover` |
| `action-secondary-brand-bg` | `--sy-button--brand-subtle-bg` |
| `action-secondary-brand-bg-hover` | `--sy-button--brand-subtle-bg-hover` |
| `action-secondary-brand-fg` | `--sy-button--brand-subtle-fg` |
| `action-secondary-danger-bg` | `--sy-button--danger-subtle-bg` |
| `action-secondary-danger-bg-hover` | `--sy-button--danger-subtle-bg-hover` |

### applauncher (8)

| old | KRDS |
|---|---|
| `glass-accent` | `--sy-applauncher--accent` |
| `glass-blur` | `--sy-applauncher--blur` |
| `glass-border` | `--sy-applauncher--border` |
| `glass-filter` | `--sy-applauncher--filter` |
| `glass-rim` | `--sy-applauncher--rim` |
| `glass-selected` | `--sy-applauncher--selected` |
| `glass-surface` | `--sy-applauncher--surface` |
| `shadow-glass` | `--sy-applauncher--shadow` |

### progressbar · switch

| old | KRDS |
|---|---|
| `meter-fill` | `--sy-progressbar--fill` |
| `shadow-thumb` | `--sy-switch--thumb-shadow` |

---

## Semantic tier — 163 tokens

### colour — bg (24)

| old | KRDS |
|---|---|
| `ai-solid` | `--sy-color-bg-ai-solid` |
| `ai-surface` | `--sy-color-bg-ai` |
| `ai-surface-hover` | `--sy-color-bg-ai-hover` |
| `bg-disabled` | `--sy-color-bg-disabled` |
| `bg-inverse` | `--sy-color-bg-inverse` |
| `bg-inverse-soft` | `--sy-color-bg-inverse-soft` |
| `bg-page` | `--sy-color-bg-page` |
| `bg-raised` | `--sy-color-bg-raised` |
| `bg-raised-2` | `--sy-color-bg-raised-2` |
| `bg-selected` | `--sy-color-bg-selected` |
| `bg-selected-hover` | `--sy-color-bg-selected-hover` |
| `bg-sunken` | `--sy-color-bg-sunken` |
| `bg-surface` | `--sy-color-bg-subtle` |
| `brand-point` | `--sy-color-bg-identity` |
| `emphasis-surface` | `--sy-color-bg-emphasis` |
| `status-danger-bg` | `--sy-color-bg-danger-subtle` |
| `status-danger-bg-solid` | `--sy-color-bg-danger-solid` |
| `status-danger-bg-solid-hover` | `--sy-color-bg-danger-solid-hover` |
| `status-info-bg` | `--sy-color-bg-info-subtle` |
| `status-info-bg-solid` | `--sy-color-bg-info-solid` |
| `status-success-bg` | `--sy-color-bg-success-subtle` |
| `status-success-bg-solid` | `--sy-color-bg-success-solid` |
| `status-warning-bg` | `--sy-color-bg-warning-subtle` |
| `status-warning-bg-solid` | `--sy-color-bg-warning-solid` |

### colour — text (21)

| old | KRDS |
|---|---|
| `ai-fg` | `--sy-color-text-ai` |
| `brand-point-fg` | `--sy-color-text-on-solid` |
| `emphasis-fg` | `--sy-color-text-emphasis` |
| `emphasis-fg-soft` | `--sy-color-text-emphasis-soft` |
| `status-danger` | `--sy-color-text-danger` |
| `status-danger-on-inverse` | `--sy-color-text-danger-on-inverse` |
| `status-info` | `--sy-color-text-info` |
| `status-info-on-inverse` | `--sy-color-text-info-on-inverse` |
| `status-success` | `--sy-color-text-success` |
| `status-success-on-inverse` | `--sy-color-text-success-on-inverse` |
| `status-warning` | `--sy-color-text-warning` |
| `status-warning-on-inverse` | `--sy-color-text-warning-on-inverse` |
| `text-disabled` | `--sy-color-text-disabled` |
| `text-link` | `--sy-color-text-link` |
| `text-link-on-inverse` | `--sy-color-text-link-on-inverse` |
| `text-on-inverse` | `--sy-color-text-on-inverse` |
| `text-on-solid` | `--sy-color-text-on-solid` |
| `text-placeholder` | `--sy-color-text-placeholder` |
| `text-primary` | `--sy-color-text-primary` |
| `text-secondary` | `--sy-color-text-secondary` |
| `text-tertiary` | `--sy-color-text-tertiary` |

### colour — icon / border / overlay / chart

| old | KRDS |
|---|---|
| `icon-danger` | `--sy-color-icon-danger` |
| `icon-disabled` | `--sy-color-icon-disabled` |
| `icon-info` | `--sy-color-icon-info` |
| `icon-on-inverse` | `--sy-color-icon-on-inverse` |
| `icon-primary` | `--sy-color-icon-primary` |
| `icon-secondary` | `--sy-color-icon-secondary` |
| `icon-success` | `--sy-color-icon-success` |
| `icon-tertiary` | `--sy-color-icon-tertiary` |
| `icon-warning` | `--sy-color-icon-warning` |
| `ai-border` | `--sy-color-border-ai` |
| `border-default` | `--sy-color-border-default` |
| `border-error` | `--sy-color-border-error` |
| `border-focus` | `--sy-color-border-focus` |
| `border-focus-input` | `--sy-color-border-focus-input` |
| `border-overlay` | `--sy-color-border-overlay` |
| `border-selected` | `--sy-color-border-selected` |
| `border-strong` | `--sy-color-border-strong` |
| `border-strong-hover` | `--sy-color-border-strong-hover` |
| `border-subtle` | `--sy-color-border-subtle` |
| `emphasis-border` | `--sy-color-border-emphasis` |
| `bg-active` | `--sy-color-overlay-active` |
| `bg-hover` | `--sy-color-overlay-hover` |
| `bg-scrim` | `--sy-color-overlay-scrim` |
| `viz-1` | `--sy-color-chart-series-1` |
| `viz-2` | `--sy-color-chart-series-2` |
| `viz-3` | `--sy-color-chart-series-3` |
| `viz-4` | `--sy-color-chart-series-4` |
| `viz-5` | `--sy-color-chart-series-5` |
| `viz-6` | `--sy-color-chart-series-6` |
| `viz-7` | `--sy-color-chart-series-7` |
| `viz-8` | `--sy-color-chart-series-8` |

### type (29)

| old | KRDS |
|---|---|
| `font-display` | `--sy-font-family-display` |
| `font-mono` | `--sy-font-family-mono` |
| `font-sans` | `--sy-font-family-sans` |
| `text-11` | `--sy-font-size-11` |
| `text-11-lh` | `--sy-font-lh-11` |
| `text-12` | `--sy-font-size-12` |
| `text-12-lh` | `--sy-font-lh-12` |
| `text-13` | `--sy-font-size-13` |
| `text-13-lh` | `--sy-font-lh-13` |
| `text-14` | `--sy-font-size-14` |
| … +19 more | |

### unchanged prefixes

`space-*` · `radius-*` · `padding-*` · `shadow-*` (except the two component ones) · `z-*` · `duration-*` · `ease-*` · `control-*` — these already read as `<type>-<role>` and need no change.

---

## What this buys, beyond consistency

1. **Kills the `text-11` / `text-primary` collision** — becomes `font-size-11` vs `color-text-primary`.
2. **Makes the tier visible at the call site.** Seeing `--sy-button--brand-bg` in a stylesheet tells you immediately that it belongs to Button and shouldn't be reached for elsewhere. `--sy-action-brand-bg` does not.
3. **Gives the design tool a clean boundary.** Figma holds semantics only; the 30 component tokens live in code. That's the split KRDS argues for, and it removes 30 variables from the Figma library.
4. **Resolves audit Defect 5** — `status-danger` becomes `color-text-danger`, and the three meanings of `-bg` separate into `color-bg-*-subtle` / `-solid` / `--sy-button--*-bg`.

## The costs, stated plainly

- **Every semantic colour token gains a `color-` prefix.** `--sy-color-text-primary` is 4 segments and 22 characters. That is more verbose than `--sy-text-primary`, and verbosity is a real cost paid on every line of CSS forever.
- **~190 renames**, on top of today's 111-rename proposal and the 832 references already moved. This would be the fourth breaking naming change in one day.
- **The component tier needs somewhere to live.** KRDS puts them inside each component's CSS class. Synapse has no component CSS — it ships tokens plus specs, and `preview.html` is a single file. Adopting the tier honestly means deciding where component tokens are defined and how the gate validates them.
- **`bg` vs `background`:** KRDS's own examples use full words (`color-border-gray-light`). Synapse abbreviates. Mixing KRDS structure with Synapse abbreviations is defensible but is no longer strictly "following KRDS".

## My recommendation

**Adopt the tier split — that part is a genuine structural fix.** Moving `action-*` → `button--*` and `glass-*` → `applauncher--*` corrects a real mis-filing and would have prevented several of today's naming problems.

**Be more sceptical about the `color-` prefix.** It solves exactly one live problem — the `text-11` collision — which `font-size-11` alone also solves. Adding 4 characters to ~120 tokens to fix one collision is a poor trade, and KRDS carries that prefix because it also namespaces `font-`/`space-` families that Synapse already distinguishes by name.

**Suggested subset:** component tier + `font-size-*` / `font-lh-*` / `font-weight-*` / `font-family-*`, and leave `bg-*` / `text-*` / `icon-*` / `border-*` unprefixed. That captures the structural win and the collision fix at roughly a third of the churn.
