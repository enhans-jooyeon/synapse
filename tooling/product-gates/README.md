# Synapse product-repo gates

The JS/TS enforcement layer for the **product repo** — the machine half of the review protocol (`docs/process/design-review-protocol.md` §6). Drop these into the repo that consumes `@enhans-jooyeon/synapse` so CI enforces the contract before a designer reviews.

`tools/validate.py` (in the DS repo) is **not** this. It lints HTML/CSS strings and guards the design-system repo's own artifacts. It cannot see React/JSX. These files re-express the same rules for product code.

## Rule map — DS rule → product-repo enforcement

| DS rule | Meaning | Enforced here by |
|---|---|---|
| SY001 | No raw color values | Tailwind (no arbitrary values) + `check-raw-values.mjs` scan for hex/rgb in JSX/CSS |
| SY002 | No off-scale spacing/type/radius | Tailwind theme = tokens only, arbitrary values off + `check-raw-values.mjs` px scan |
| SY003–006 | Font family/weight/italic/uppercase | Tailwind theme restriction + ESLint `no-restricted-syntax` |
| SY007 / SY010 | Typography is a bundle — no independent tracking/leading | `check-raw-values.mjs` flags `tracking-*` / `leading-*` classes |
| SY009 | No raw box-shadow — borders-first, `--sy-shadow-*` for floating layers only | `check-raw-values.mjs` flags `shadow-{sm,md,lg,xl,2xl,inner,none}` + `shadow-[…]`, with the ring / static / floating triage in the message |
| SY023 | z-index on the sanctioned vocabularies only | `check-raw-values.mjs` flags `z-10`+ / `z-9999` classes |
| SY025 | Duration on the four-value motion scale (100/150/200/300) | `check-raw-values.mjs` flags off-scale `duration-<n>` + `duration-[…]` — **product-gate only**; there is no DS-side implementation |
| Component provenance | Use the system component, not a raw element | ESLint `no-restricted-syntax` (`.eslintrc.synapse.cjs`) |
| Variant validity | No nonexistent variants | TypeScript + CVA typing — `tsc --noEmit` in CI (compile-time, free) |
| Required-state coverage | Every declared state has a story | `check-state-coverage.mjs` |
| Accessibility floor | Contrast/role/label/target | `eslint-plugin-jsx-a11y` + `axe` in tests |
| Visual snapshots | Reviewer sees all states at a glance | Chromatic or Playwright (wire to your account) |

## The two Tailwind presets — pick by your Tailwind major version

| File | Targets | Form | Theme source |
|---|---|---|---|
| `tailwind.synapse.cjs` | **Tailwind v3** | JS config, used via `presets: [require(...)]` | reads `tokens/synapse.tokens.json` at build time |
| `tailwind.synapse.v4.css` | **Tailwind v4** | CSS `@theme inline` + `@utility`, used via `@import` | aliases the `--sy-*` variables from `tokens/synapse.css` |

They are not interchangeable: v4 has no JS theme, so a v3 config cannot be loaded, adapted, or half-used there. The v4 file is complete — colors, spacing, radius (incl. the containment-role tier), the prefixed `shadow-float-*` scale, easing, the three families, the four weights, all 20 type styles as `--text-*` bundles, plus `@utility` blocks for the six z roles and the four durations.

**Import order for v4 — this matters.** The preset declares no values; it only maps Tailwind namespaces onto `--sy-*` variables that must already exist.

```css
@import "tailwindcss";
@import "@enhans-jooyeon/synapse/tokens/synapse.css";      /* defines every --sy-*, incl. [data-theme="dark"] */
@import "./tooling/product-gates/tailwind.synapse.v4.css"; /* maps the namespaces onto them */
```

Aliasing rather than copying values is what keeps **dark mode working**: utilities resolve `var(--sy-…)` in the element's own scope, so `bg-bg-surface` follows `[data-theme]`. Copying resolved values into the theme would freeze one mode.

**Two things are worse on v4, and both land on `check-raw-values.mjs`:**

- v4 has **no `--z-index-*` and no `--transition-duration-*` namespace**. `z-10` / `z-9999` / `duration-500` are bare-value utilities that no theme can delete, so **SY023 and SY025 are the only enforcement on v4, not a backstop.** Wire the gate into CI *before* migrating.
- A CSS theme still cannot delete bracket syntax (`p-[7px]`, `bg-[#4f46e5]`) — SY002's job on both versions.

**Exclude `tailwind.synapse.v4.css` from the gate's glob.** It necessarily writes `--sy-shadow-*` (SY009's regex), `1px` and `-0.01em` (SY002's px/literal scans): it is the theme, not product code.

## Install

1. Copy this folder into the product repo (e.g. `tooling/synapse-gates/`).
2. Merge `.eslintrc.synapse.cjs` into the repo's ESLint config (`extends` or spread `rules`), and add `eslint-plugin-jsx-a11y`.
3. Wire the preset for your version — **v3:** merge `tailwind.synapse.cjs` (the point is `future.hoverOnlyWhenSupported` aside, **arbitrary values disabled** and the theme sourced from `@enhans-jooyeon/synapse` tokens). **v4:** `@import` `tailwind.synapse.v4.css` in the order above.
4. Add the scripts to CI (`ui-gate.yml` is a ready GitHub Actions job).
5. Author declares required states in a `*.states.json` next to each screen; `check-state-coverage.mjs` verifies a story per declared state.

## Non-negotiable

A green gate is the precondition for review, not a suggestion (protocol §2). Do not add `eslint-disable` for these rules in generated screens — a genuine gap is a **harness ticket** (protocol §9/§10), not a local override.
