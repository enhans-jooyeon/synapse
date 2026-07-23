# App Generation — component catalog

The chart/component catalog the **App Generation** feature (the Lovable-style app builder) pulls from, plus the design task list for the builder and generated-app screens.

## Contents

- `component-catalog.html` — the ECharts-based chart catalog (combo, stacked bar, waterfall, line/area, donut, scatter/bubble, treemap), self-contained, no external deps. The reference implementation.
- `CLAUDE.md` — build context: chart specs (LG/MD sizing, legend icon, gradients, the divergence tricks).
- `app-builder-design-task.md` — the design checklist for builder screens (A) and generated-app screens (B).
- `project_enhance_product_spec.md`, `project_agentic_work_spec.md` — product context for the surrounding features.
- `tokens-map.md` — the reconciliation bridge (old catalog tokens → Synapse v1.0.0 `--sy-*`).

## Reconciled to Synapse v1.0.0

This catalog arrived on an **older token system** — the azure `#0a84ff` brand, an off-scale radius set (2/6/12), and a parallel token vocabulary (`Blue/500`, `text-text-primary`). That azure is exactly the value Synapse **replaced** with the point color `#0621C4`. It has been reconciled to v1.0.0: brand → `#0621C4`, neutrals/borders/text → the `--sy-*` values, radius → the on-scale set, font → Pretendard. See `tokens-map.md` for the full mapping.

**Why it lives here and isn't gated:** ECharts option objects must hardcode hex in JavaScript — they can't reference `--sy-*` CSS variables — so this catalog is a **value-aligned reference asset**, not a token-linted artifact. `tools/validate.py` intentionally does not scan it (it lints the design-system's own root artifacts). Consistency is maintained by the reconciliation above, not by the gate.

## One open item (needs a designer's eye)

The chart **blue data ramp** (Blue/50–800) was re-derived by interpolation anchored on `#0621C4`, because Synapse defines a point color and a multi-hue `viz` palette but **no monochromatic blue ramp**. The values are consistent and azure-free, but they were computed, not visually tuned. Two clean follow-ups when you have bandwidth: (a) have a designer eyeball/adjust the ramp against real charts, or (b) promote a sanctioned blue ramp into `tokens/synapse.tokens.json` via governance so charts reference first-class tokens. Until then, treat the ramp in `tokens-map.md` as the app-generation-scoped chart palette.
