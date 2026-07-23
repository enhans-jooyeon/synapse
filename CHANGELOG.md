# Synapse changelog

Versioning is **release-based** (design.md §6): ongoing work lands under **Unreleased**; the version bumps only when a release is cut for the team.

## Unreleased

_Nothing yet._

## 1.0.0 — 2026-07-21 — Initial team release

The first public/team release. Re-baselined from the internal 6.x pre-release line to **1.0.0** and adopted release-based versioning (the number now marks a team release, not each internal edit). **No spec or token changes in this bump** — it renumbers the system; everything shipped through internal 6.62.0 is the content of 1.0.0. The internal 6.x pre-release history — and the per-rule `(vX.Y)` provenance tags that used to annotate the specs — are preserved in git, not here; the specs now read as a clean v1 contract.

Also added in 1.0.0: **`app-generation/`** — the App Generation feature's ECharts chart/component catalog, **reconciled from its old azure `#0a84ff` token system to the v1.0.0 tokens** (brand → `#0621C4`, neutrals/borders/text → `--sy-*` values, radius → on-scale, Pretendard). Mapping in `app-generation/tokens-map.md`. The chart blue data ramp was computed from `#0621C4` (Synapse has no blue ramp token) and is flagged for a designer's review.
