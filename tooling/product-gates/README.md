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

### What a theme can and cannot enforce — read this before converting call sites

A preset is **not** the enforcement layer, on either version. It removes the *named*
off-scale conveniences; everything else reaches `check-raw-values.mjs` or reaches
production. Verified by compiling both presets, not by reading them.

| | v3 preset | v4 preset | enforced by |
|---|---|---|---|
| Named off-scale (`shadow-lg`, `text-3xl`, `leading-tight`, `tracking-wide`) | blocked | blocked | the theme |
| **Bracket syntax** (`p-[13px]`, `leading-[1.1]`, `tracking-[.05em]`, `z-[9999]`) | **compiles** | **compiles** | SY002 only |
| Bare-number `z-10` / `z-50` / `duration-500` | blocked | **compiles** | SY023 / SY025 |
| `leading-<number>` (reads the *spacing* scale, not `--leading-*`) | blocked | **compiles** | SY010 only |
| `ease-linear`, `ease-initial` (static utilities) | compiles | **compiles** | **nothing — open gap** |

Bracket syntax is parsed before the theme is consulted, so no Tailwind config on any
version can delete it. The v3 preset's docstring claimed for a while that it did; that
claim was false and has been corrected in the file.

**The operational consequence: wire `check-raw-values.mjs` into CI BEFORE you convert a
single call site.** Converting first and gating later means the conversion is unverified
and the regressions are silent — on v4 most of all, where four of the five rows above
land on the gate alone.

**Exclude `tailwind.synapse.v4.css` from the gate's glob.** It necessarily writes `--sy-shadow-*` (SY009's regex), `1px` and `-0.01em` (SY002's px/literal scans): it is the theme, not product code.

## Install

1. Copy this folder into the product repo (e.g. `tooling/synapse-gates/`).
2. Merge `.eslintrc.synapse.cjs` into the repo's ESLint config (`extends` or spread `rules`), and add `eslint-plugin-jsx-a11y`.
3. **Add the scripts to CI first** (`ui-gate.yml` is a ready GitHub Actions job). This is step 3 and not step 5 deliberately — see the table above: the preset does not enforce SY002, and on v4 it does not enforce SY023/SY025/SY010 either. A conversion done before the gate runs is a conversion nobody checked.
4. Wire the preset for your version — **v3:** merge `tailwind.synapse.cjs`; its value is that the theme is sourced from `@enhans-jooyeon/synapse` tokens and **replaces** the defaults, so the named off-scale classes stop existing. **v4:** `@import` `tailwind.synapse.v4.css` in the order above.
5. Author declares required states in a `*.states.json` next to each screen; `check-state-coverage.mjs` verifies a story per declared state.

## Non-negotiable

A green gate is the precondition for review, not a suggestion (protocol §2). Do not add `eslint-disable` for these rules in generated screens — a genuine gap is a **harness ticket** (protocol §9/§10), not a local override.
