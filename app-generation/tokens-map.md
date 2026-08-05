# Token reconciliation — catalog → Synapse v1.0.0 (divergence recorded at v2.0.0)

The App Generation catalog arrived on a divergent (pre-v6.x) token set and was reconciled to **Synapse v1.0.0** values. **`tokens/synapse.tokens.json` is the single source of truth** — this table records what was swapped so the catalog matches it.

> **STATUS at v2.0.0 (2026-08-05).** The v1.0.0 reconciliation has partially rotted and this file now records that honestly rather than claiming alignment it no longer has:
>
> - **Still aligned:** all neutral/text/border/surface rows, both status rows, and type. Those values are unchanged in v2.0.0.
> - **Orphaned — brand.** v2.0.0 re-pointed the brand: `--sy-brand-point` is now achromatic graphite (`#1A1A1F` light / `#F2F2F4` dark, brand-identity objects only) and `--sy-action-brand-bg` is bright azure `#0073E6` (hover `#066ACE`). The catalog's `#0621C4`/`#051AA0` match **no current system color**.
> - **Drifted — radius.** `--sy-radius-md` moved 10px → 12px; the catalog still renders 10px.
> - **Resolution is a governance decision, not a find-and-replace:** under the two-blues law (design.md §2) azure is the AI-capability marker, so a chart data ramp arguably re-anchors on the functional indigo (`blue.500 #3155C6`) or on a first-class chart ramp promoted into the tokens — exactly the "open item" in `README.md`. Until that ruling, treat the catalog's Blue ramp as **catalog-scoped legacy values**, never as current Synapse tokens.

## Brand / accent — ⚠ ORPHANED at v2.0.0 (see status note)

| Old (catalog) | v1.0.0 value (as applied) | v1.0.0 token | v2.0.0 reality |
|---|---|---|---|
| `#0a84ff` (Brand / Blue-500) | `#0621C4` | `--sy-brand-point` / `--sy-action-brand-bg` | point → graphite pair; brand-bg → azure `#0073E6` |
| `#006bd6` (brand hover / Blue-600) | `#051AA0` | `--sy-action-brand-bg-hover` | → `#066ACE` |

## Neutrals — text / border / surface (still aligned at v2.0.0)

| Old | Value | Synapse token |
|---|---|---|
| `#000000` TextPrimary | `#09090B` | `--sy-text-primary` |
| `#808081` TextSecondary / Gray-600 | `#62626B` | `--sy-text-secondary` |
| `#b2b2b3` text-tertiary | `#83838D` | `--sy-text-tertiary` |
| `#262627` Gray-900 / dark surface | `#09090B` | `--sy-bg-inverse` / `--sy-text-primary` |
| `#e5e5e6` Border-100 / Gray-300 | `#E9E9ED` | `--sy-border-default` |
| `#d9d9da` Border-200 (`#cfcfcf` legacy typo) | `#D1D1D8` | `--sy-border-strong` |
| `#f2f2f3` Gray-200 / `#f7f7f8` bg-100 | `#F4F4F6` | `--sy-bg-sunken` |
| `#fbfbfc` bg-50 | `#FAFAFB` | `--sy-bg-surface` |
| `#ffffff` Background-0 | `#FFFFFF` (unchanged) | `--sy-bg-page` |

## Status (still aligned at v2.0.0)

| Old | Value | Synapse token |
|---|---|---|
| `#10b978` Success | `#1F9D5B` | `--sy-status-success-bg-solid` |
| `#e6483d` Error | `#D2403E` | `--sy-status-danger-bg-solid` |

## Radius (CSS)

| Old | v1.0.0 (as applied) | Synapse token | v2.0.0 reality |
|---|---|---|---|
| 2px | 4px | `--sy-radius-xs` | unchanged |
| 6px | 8px | `--sy-radius-sm` | unchanged |
| 12px | 10px | `--sy-radius-md` | **⚠ now 12px** — catalog still renders 10px |
| 8px (unchanged) | 8px | `--sy-radius-sm` | unchanged |

## Type (still aligned at v2.0.0)

`Pretendard Variable` → **Pretendard** (the system UI face). The catalog's `text-label-*` / `text-body-*` / `text-caption-*` scale maps onto Synapse's `.sy-type-*` styles (foundations §2.2); `caption-3` at 10px is below Synapse's 11px floor — round to 11 if used in linted CSS.

## Chart blue data ramp — ⚠ ORPHANED at v2.0.0, pending governance

The ramp was re-derived by interpolation anchored on `#0621C4` — a value that, as of v2.0.0, exists nowhere in the system (it was the v1.0.0 point color). The values below remain what the **catalog renders today**; they are catalog-scoped legacy, not Synapse tokens. Do not copy them into new UI. Resolution options are in the status note above.

| Step | Catalog value (legacy, anchored on the retired `#0621C4`) |
|---|---|
| Blue/50 | `#eeeffb` |
| Blue/200 | `#9ba6e7` |
| Blue/300 | `#6f7edd` |
| Blue/400 | `#384dd0` |
| Blue/500 | `#0621C4` (retired point color) |
| Blue/600 | `#051AA0` |
| Blue/700 | `#051a99` |
| Blue/800 | `#041476` |
