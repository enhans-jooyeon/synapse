# App Generation — component catalog

The chart/component catalog the **App Generation** feature (the Lovable-style app builder) pulls from, plus the design task list for the builder and generated-app screens.

## Contents

- `component-catalog.html` — the ECharts-based chart catalog (combo, stacked bar, waterfall, line/area, donut, scatter/bubble, treemap), self-contained, no external deps. The reference implementation.
- `CLAUDE.md` — build context: chart specs (LG/MD sizing, legend icon, gradients, the divergence tricks).
- `app-builder-design-task.md` — the design checklist for builder screens (A) and generated-app screens (B).
- `project_enhance_product_spec.md`, `project_agentic_work_spec.md` — product context for the surrounding features.
- `tokens-map.md` — the reconciliation bridge (old catalog tokens → Synapse v1.0.0 `--sy-*`).

## Reconciled to Synapse v1.0.0 — partially stale at v2.0.0

This catalog arrived on an **older token system** — the azure `#0a84ff` brand, an off-scale radius set (2/6/12), and a parallel token vocabulary (`Blue/500`, `text-text-primary`) — and was reconciled to **v1.0.0**: brand → `#0621C4` (the point color at the time), neutrals/borders/text → the `--sy-*` values, radius → the then-current scale, font → Pretendard.

**v2.0.0 broke part of that alignment.** The brand was re-pointed (point → achromatic graphite; `action.brand` → bright azure `#0073E6`) and `--sy-radius-md` moved 10px → 12px. The catalog's neutrals, status colors, and type remain aligned; its brand blue, blue data ramp, and md radius are now **catalog-scoped legacy values that match no current token**. `tokens-map.md` records exactly which rows still hold and which are orphaned — read its status note before copying any value out of this directory.

**Why it lives here and isn't gated:** ECharts option objects must hardcode hex in JavaScript — they can't reference `--sy-*` CSS variables — so this catalog is a **value-aligned reference asset**, not a token-linted artifact. `tools/validate.py` intentionally does not scan it (it lints the design-system's own root artifacts). Consistency is maintained by the reconciliation, not by the gate — which is precisely why the v2.0.0 divergence above must stay recorded until re-reconciliation.

## One open item (needs a designer's eye — sharper since v2.0.0)

The chart **blue data ramp** (Blue/50–800) was re-derived by interpolation anchored on `#0621C4`, because Synapse defines a point color and a multi-hue `viz` palette but **no monochromatic blue ramp**. As of v2.0.0 that anchor is a retired color, so the ramp is doubly unmoored: computed, and anchored on nothing. Resolution is a governance ruling, not a find-and-replace — under the two-blues law azure is the AI-capability marker, so the ramp likely re-anchors on the functional indigo (`blue.500 #3155C6`) or on a first-class chart ramp promoted into `tokens/synapse.tokens.json`. Until that ruling, treat the ramp in `tokens-map.md` as the app-generation-scoped **legacy** chart palette; re-reconcile the catalog (including the 10px md radii) in the same pass.
