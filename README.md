# Synapse

The design system for **AgentOS** (Enhans) — written as a machine-enforceable **contract** for AI-driven UI generation, not an inspiration board. Non-designers (PMs, engineers) generate production-seed UI under the harness; designers review only judgment; CI enforces compliance.

Web-only · bilingual **KO/EN** (EN authoritative) · current version **1.0.0**.

---

## Who you are → start here

| You are… | Start with |
|---|---|
| **New to Synapse** (anyone) | This file, then [`design.md`](design.md) — the contract and hard rules |
| **Author** (PM/engineer generating UI) | [`docs/process/design-cycle.md`](docs/process/design-cycle.md) — the step-by-step cycle — then run [`screen-intake-skill.md`](docs/process/screen-intake-skill.md) (it fills the [PRD template](docs/process/prd-template.md) for you). Don't skip intake — generic instructions produce generic UI |
| **Reviewer** (designer) | The protocol §9 rubric (three outcomes) + the [PR/review template](.github/PULL_REQUEST_TEMPLATE/ui_review.md) |
| **Consuming the system in product code** | [`storybook/`](storybook/) (React components) + `tokens/` — see [status](docs/DISTRIBUTION.md) |
| **Browsing the system** | Open [`preview.html`](preview.html) in a browser (also deployed as the docs hub) |

## The one principle everything rests on

> **The harness owns compliance; humans review only judgment.**

Anything a machine can check — token use, component provenance, contrast, required-state coverage, prop validity — is a **gate**, green before a designer ever looks. If a designer is hand-checking spacing or hardcoded hex, the harness has a hole; the fix is closing the hole, not adding a review step. Full doctrine: [`docs/process/design-review-protocol.md`](docs/process/design-review-protocol.md).

## Repo map

| Layer | Where |
|---|---|
| Contract & governance | [`design.md`](design.md) — read first; authority order, hard rules, workflow |
| Tokens (source of truth) | `tokens/synapse.tokens.json` → generated `tokens/synapse.css` |
| Specs (English — Korean rendered on demand in the hub) | `foundations.md` · `components.md` (57) · `recipes.md` · `patterns.md` · `ai-patterns.md` · `content.md` · `icons.md` |
| Machine index for agents | `synapse.manifest.json` (built by `tools/build_manifest.py`; agents load this first) |
| DS-repo gate | `tools/validate.py` — `tokens` / `ui` / `page` modes (enforces this repo's own artifacts) |
| Component browser + sample pages | `preview.html` |
| React + Storybook workspace | `storybook/` (seed: Button · Badge · Input · Card) |
| **Process doctrine** | `docs/process/` — design-development cycle (`design-cycle.md`), guided intake (`screen-intake-skill.md`), refinement loop (`harness-refinement-protocol.md` + `harness-refinement-register.md`), review protocol + PRD template, `.github/PULL_REQUEST_TEMPLATE/ui_review.md` |
| **Distribution & rollout** | [`docs/DISTRIBUTION.md`](docs/DISTRIBUTION.md) — how this reaches the team + current status |
| Product-repo gate bundle | `tooling/product-gates/` — drop-in ESLint/Tailwind/coverage gates for the product CI |
| App Generation catalog | `app-generation/` — the App Builder's ECharts chart/component catalog, reconciled to v1.0.0 tokens (`app-generation/tokens-map.md`) |
| Governance proposals / audits | `proposals/` (dated; not gated) — resolved pre-1.0 ones in `proposals/archive/` |

## Quick checks (DS-repo)

```bash
python3 tools/validate.py all                                # full gate → 0 error(s), 0 warning(s)
python3 tools/validate.py page examples/screen-intent.example.json
python3 tools/build_manifest.py                              # after any components.md change
```

## Status (read before adopting)

The **doctrine is mature** (57 components, AI patterns, tokens, gate, bilingual specs at 1.0.0). The **consumption layer is not finished**: the React library in `storybook/` is a 4-of-57 seed and is not yet published as an installable `@enhans-jooyeon/synapse` package, and the product-repo gates (protocol §6) are provided in `tooling/product-gates/` but not yet wired into a product repo. See [`docs/DISTRIBUTION.md`](docs/DISTRIBUTION.md) for the sequenced path from "readable" to "usable under enforcement."

## Governance

Versioned by semver across the whole system; every change is in [`CHANGELOG.md`](CHANGELOG.md). Changes follow the **one-way door rule** (design.md §6): the system changes first, product UI second. Unmet needs are proposals in `proposals/`, not improvisations.
