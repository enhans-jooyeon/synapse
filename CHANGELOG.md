# Synapse changelog

Versioning is **release-based** (design.md §6): ongoing work lands under **Unreleased**; the version bumps only when a release is cut for the team.

## Unreleased

- **Memory element — the correction ledger** (`docs/process/correction-ledger.md` + `feedback/` + `synapse digest`): the harness's memory, pointed at the **maintainers**, not the generator (a generator-facing memory would be a shadow contract — durable lessons belong promoted into `design.md`/the gate). Each reviewed screen gets a `synapse-corrections` block captured **in the PR** (embedded in `.github/PULL_REQUEST_TEMPLATE/ui_review.md`): one `category | attribution | severity | source | note` line per fix needed to reach shippable, with closed field sets so entries aggregate. `synapse digest` rolls the collected blocks up into a pattern report — separating the harness-actionable signal (`llm-generation`/`contract-gap`/`gate-gap`) from taste and requirement churn, and flagging categories that recur (≥2) as **DS-gap candidates** to take to the refinement register. Auto-detectable fixes (token/state/provenance) come from the diff+gate; only the un-lintable ones are hand-tagged. Wired into `design-cycle.md` (Review captures, Refine consumes). GitHub-PR auto-harvest lands once the connector is authorized; interim, blocks are dropped into `feedback/`.

- **Five component types added (52 → 57)**, extracted from the AOS digital twin (`proposals/2026-07-23-twin-component-candidates.md`) and specified to the Synapse contract — spec-only, not yet implemented in `storybook/`:
  - **GraphCanvas · FlowNode · Edge** — the node-graph editor for the Workflow / Pipeline / Ontology-Link builders (the biggest prior `workbench` coverage gap).
  - **RunLog** — hierarchical execution log (run → step → line).
  - **PivotTable** — cross-tab aggregation for dashboards.
  - **AssistantPanel** — the docked/floating global agent (composite).
  - **AppLauncher** — the app tile-grid overlay.
  - Manifest rebuilt; `build_manifest.py` `C` set extended in lockstep.
  - Added `preview.html` component-browser stories (token-only demos + When/Avoid/Anti/Where guidance) for all five, so they show in the browser.
- **New recipe R16 · Builder workbench shell** — the reusable `workbench` layout the Workflow, Pipeline, and dev-stage Replay/CUA builders share (generalizes the twin's replay-shell screens, which are too app-specific to be components). Also **reconciled the recipe cap**: the screen-intent schema and manifest recipe set were stuck at R1–R12 while `recipes.md` already defined R13–R15 — extended both to **R1–R16** (and the intake skill) so all recipes are actually declarable. Also filled the **preview.html Recipes group**: it demoed only 4 recipes (R1/R4/R6/R9); added token-only stories for the other 12 (R2/R3/R5/R7/R8/R10–R16) so all 16 show in the browser.
- **New harness CLI — `tools/synapse.py`** (the "tools" harness element): `lookup <name>` verifies a component/token/recipe/archetype is real and prints its rules — or the closest matches if not (prevents off-manifest components (RC6) and off-token values (RC3) *at generation time*, not just at the gate); `validate <intent.json>` and `gate` wrap `validate.py`; `list` prints a closed set. Wired into `screen-intake-skill.md` and `design-cycle.md` so the generating agent calls it. Stdlib-only; wrap-able as an MCP server later.
- **External-tools stance** documented in `design-cycle.md` (§Tools): the process is **strictly code-based** — no Figma/Canva or design-inspiration boards. The one sanctioned external tool is **bounded web reference research** — a *capability* (web search + viewing a live UI reference), tool-agnostic: fulfilled by whatever the generation tool provides or, at the floor, a human-supplied URL/screenshot, so it's not Claude-bound. The only hard tool dependency is bash (for `tools/synapse.py`). It may inform *structure/interaction* in Frame and maintainer refinement only — never visual style, never Generate directly, never Intake's data — and must clear the refinement rubric's Tier B (so it can't smuggle in consumer-app polish).

## 1.0.1 — 2026-07-23 — v1 cleanup release

Housekeeping and consumption-layer fixes; no new components, tokens, or rules.

- **Package scope → `@enhans-jooyeon/synapse`** across the harness (was `@enhans/synapse`) — consumers and the product-gates now point at this repo's system, not the superseded one.
- **Docs are English-only.** Removed the 8 `.ko.md` translations and the SY018 staleness gate; the docs hub renders Korean on demand (client-side). The generated product UI stays bilingual.
- **Stripped `v2`–`v6` provenance tags** from the specs, tokens, and manifest — rationale kept, version stamps gone.
- Archived resolved pre-1.0 proposals to `proposals/archive/`; removed a superseded token snapshot; fixed `scripts/dist.allowlist` after the `.ko.md` removal.

## 1.0.0 — 2026-07-21 — Initial team release

The first public/team release. Re-baselined from the internal 6.x pre-release line to **1.0.0** and adopted release-based versioning (the number now marks a team release, not each internal edit). **No spec or token changes in this bump** — it renumbers the system; everything shipped through internal 6.62.0 is the content of 1.0.0. The internal 6.x pre-release history — and the per-rule `(vX.Y)` provenance tags that used to annotate the specs — are preserved in git, not here; the specs now read as a clean v1 contract.

Also added in 1.0.0: **`app-generation/`** — the App Generation feature's ECharts chart/component catalog, **reconciled from its old azure `#0a84ff` token system to the v1.0.0 tokens** (brand → `#0621C4`, neutrals/borders/text → `--sy-*` values, radius → on-scale, Pretendard). Mapping in `app-generation/tokens-map.md`. The chart blue data ramp was computed from `#0621C4` (Synapse has no blue ramp token) and is flagged for a designer's review.
