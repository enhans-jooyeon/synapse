# Synapse product-repo gates

The JS/TS enforcement layer for the **product repo** — the machine half of the review protocol (`docs/process/디자인-리뷰-프로토콜.md` §6). Drop these into the repo that consumes `@enhans-jooyeon/synapse` so CI enforces the contract before a designer reviews.

`tools/validate.py` (in the DS repo) is **not** this. It lints HTML/CSS strings and guards the design-system repo's own artifacts. It cannot see React/JSX. These files re-express the same rules for product code.

## Rule map — DS rule → product-repo enforcement

| DS rule | Meaning | Enforced here by |
|---|---|---|
| SY001 | No raw color values | Tailwind (no arbitrary values) + `check-raw-values.mjs` scan for hex/rgb in JSX/CSS |
| SY002 | No off-scale spacing/type/radius | Tailwind theme = tokens only, arbitrary values off + `check-raw-values.mjs` px scan |
| SY003–006 | Font family/weight/italic/uppercase | Tailwind theme restriction + ESLint `no-restricted-syntax` |
| Component provenance | Use the system component, not a raw element | ESLint `no-restricted-syntax` (`.eslintrc.synapse.cjs`) |
| Variant validity | No nonexistent variants | TypeScript + CVA typing — `tsc --noEmit` in CI (compile-time, free) |
| Required-state coverage | Every declared state has a story | `check-state-coverage.mjs` |
| Accessibility floor | Contrast/role/label/target | `eslint-plugin-jsx-a11y` + `axe` in tests |
| Visual snapshots | Reviewer sees all states at a glance | Chromatic or Playwright (wire to your account) |

## Install

1. Copy this folder into the product repo (e.g. `tooling/synapse-gates/`).
2. Merge `.eslintrc.synapse.cjs` into the repo's ESLint config (`extends` or spread `rules`), and add `eslint-plugin-jsx-a11y`.
3. Merge `tailwind.synapse.cjs` — the point is `future.hoverOnlyWhenSupported` aside, **arbitrary values disabled** and the theme sourced from `@enhans-jooyeon/synapse` tokens.
4. Add the scripts to CI (`ui-gate.yml` is a ready GitHub Actions job).
5. Author declares required states in a `*.states.json` next to each screen; `check-state-coverage.mjs` verifies a story per declared state.

## Non-negotiable

A green gate is the precondition for review, not a suggestion (protocol §2). Do not add `eslint-disable` for these rules in generated screens — a genuine gap is a **harness ticket** (protocol §9/§10), not a local override.
