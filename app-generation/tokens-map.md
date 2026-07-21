# Token reconciliation — catalog → Synapse v1.0.0

The App Generation catalog arrived on a divergent (pre-v6.x) token set. This maps each old value to the current Synapse v1.0.0 token. **`tokens/synapse.tokens.json` is the single source of truth** — this table records what was swapped so the catalog matches it.

## Brand / accent

| Old (catalog) | v1.0.0 value | Synapse token |
|---|---|---|
| `#0a84ff` (Brand / Blue-500) | `#0621C4` | `--sy-brand-point` / `--sy-action-brand-bg` |
| `#006bd6` (brand hover / Blue-600) | `#051AA0` | `--sy-action-brand-bg-hover` |

## Neutrals — text / border / surface

| Old | v1.0.0 | Synapse token |
|---|---|---|
| `#000000` TextPrimary | `#09090B` | `--sy-fg-primary` |
| `#808081` TextSecondary / Gray-600 | `#62626B` | `--sy-fg-secondary` |
| `#b2b2b3` text-tertiary | `#83838D` | `--sy-fg-tertiary` |
| `#262627` Gray-900 / dark surface | `#09090B` | `--sy-bg-inverse` / `--sy-fg-primary` |
| `#e5e5e6` Border-100 / Gray-300 | `#E9E9ED` | `--sy-border-default` |
| `#d9d9da` Border-200 (`#cfcfcf` legacy typo) | `#D1D1D8` | `--sy-border-strong` |
| `#f2f2f3` Gray-200 / `#f7f7f8` bg-100 | `#F4F4F6` | `--sy-bg-sunken` |
| `#fbfbfc` bg-50 | `#FAFAFB` | `--sy-bg-surface` |
| `#ffffff` Background-0 | `#FFFFFF` (unchanged) | `--sy-bg-page` |

## Status

| Old | v1.0.0 | Synapse token |
|---|---|---|
| `#10b978` Success | `#1F9D5B` | `--sy-status-success-bg-solid` |
| `#e6483d` Error | `#DB504D` | `--sy-status-danger-bg-solid` |

## Radius (CSS)

| Old | v1.0.0 | Synapse token |
|---|---|---|
| 2px | 4px | `--sy-radius-xs` |
| 6px | 8px | `--sy-radius-sm` |
| 12px | 10px | `--sy-radius-md` |
| 8px (unchanged) | 8px | `--sy-radius-sm` |

## Type

`Pretendard Variable` → **Pretendard** (the system UI face). The catalog's `text-label-*` / `text-body-*` / `text-caption-*` scale maps onto Synapse's `.sy-type-*` styles (foundations §2.2); `caption-3` at 10px is below Synapse's 11px floor — round to 11 if used in linted CSS.

## Chart blue data ramp — computed, pending review

Synapse has **no monochromatic blue ramp** (only the point color + a multi-hue `viz` palette). The catalog's Blue ramp was re-derived by interpolation anchored on `#0621C4`. Consistent and azure-free, but computed — see README's "open item".

| Step | v1.0.0 value |
|---|---|
| Blue/50 | `#eeeffb` |
| Blue/200 | `#9ba6e7` |
| Blue/300 | `#6f7edd` |
| Blue/400 | `#384dd0` |
| Blue/500 | `#0621C4` (= point) |
| Blue/600 | `#051AA0` |
| Blue/700 | `#051a99` |
| Blue/800 | `#041476` |
