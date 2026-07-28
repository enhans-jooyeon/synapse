# Spacing scale → 4px-multiplier naming (with underscore fractional steps)

**Date:** 2026-07-28 · **Status:** proposal for maintainer decision (no tokens renamed yet) · **Scope:** the `--sy-space-*` scale only. **Semver: MAJOR** (breaking token rename).

## What changes

Rename the spacing scale from **literal-px names** (`--sy-space-8` = 8px) to the **4px-multiplier convention** (`--sy-space-2` = 8px, i.e. index × 4px), matching Tailwind muscle-memory. The two sub-grid values (2px, 6px) become **fractional steps**, encoded with an underscore because a bare `.` is invalid in a CSS custom-property name (`var(--sy-space-0.5)` won't parse).

**Pixel values do not change.** The 4px grid, the actual spacing of every component, and the sanctioned sub-grid jurisdiction (2/6 for hairline offsets + optical corrections) are all identical. This is a pure **naming** change.

## Rename map

| px | current | new |
|---|---|---|
| 0 | `space-0` | `space-0` |
| 2 | `space-2` | `space-0_5` |
| 4 | `space-4` | `space-1` |
| 6 | `space-6` | `space-1_5` |
| 8 | `space-8` | `space-2` |
| 12 | `space-12` | `space-3` |
| 16 | `space-16` | `space-4` |
| 20 | `space-20` | `space-5` |
| 24 | `space-24` | `space-6` |
| 28 | `space-28` | `space-7` |
| 32 | `space-32` | `space-8` |
| 40 | `space-40` | `space-10` |
| 48 | `space-48` | `space-12` |
| 64 | `space-64` | `space-16` |
| 80 | `space-80` | `space-20` |
| 96 | `space-96` | `space-24` |

Fractional steps are the sanctioned sub-grid: `space-0_5` (2px) and `space-1_5` (6px) — jurisdiction unchanged (hairline/border-adjacent offsets, optical corrections; never general layout). The gate keeps enforcing "only enumerated steps."

## Why underscore for fractionals

CSS custom-property names can't contain an unescaped `.`. Tailwind's `0.5`/`1.5` live in *class names*, not CSS variables, so it never hits this. `--sy-space-0_5` is the CSS-safe stand-in — clearer than a hyphen (`0-5` reads like a range) and cleaner than an escape (`0\.5`).

## The migration hazard — must be atomic

The map **crosses over**: old `space-8` (8px) → new `space-2`, but old `space-2` (2px) → new `space-0_5`; likewise `space-16`→`space-4` while old `space-4`→`space-1`, and `space-24`→`space-6` while old `space-6`→`space-1_5`. Eight of the new names collide with existing old names. A naive find-replace corrupts everything.

**Execution plan (single atomic commit):**
1. Rename every `var(--sy-space-N)` usage and every definition to a **temporary unique token** (e.g. `--sy-space-TMP-<px>`), so no name is both a source and a target.
2. Rename the temporaries to the final multiplier names.
3. Files touched: `tokens/synapse.css` (defs), `tokens/synapse.tokens.json` (the `space` group keys), `preview.html`, `components.md`, `foundations.md`, `patterns.md`, `recipes.md`, `ai-patterns.md`, storybook CSS — every `var(--sy-space-*)` and doc reference.
4. Update `tools/validate.py` if it names specific space tokens (the px-based `SPACE_SCALE` check is unaffected — values don't change — but any hard-coded token-name references must move).
5. Rebuild manifest; run `validate.py all`; expect 0 errors.
6. Update `foundations.md §3` to describe the multiplier convention + the underscore fractional rule.

## Risks / tradeoffs (stated plainly)

- **Breaking for any consumer** that references `--sy-space-*` by name — hence a major bump and a migration note in `CHANGELOG`.
- **Loss of self-documenting names.** `space-3` now requires knowing the ×4 base; `space-8` used to *be* 8px. This is the deliberate cost of Tailwind alignment.
- **One-time churn**, but mechanical and gate-verifiable once the atomic rename is scripted.

## Out of scope (flagged, not included)

The **radius** scale is also 4px-based (4/8/12/16/20/24) and could adopt the same multiplier convention for consistency (`radius-1` = 4px …). Not proposed here — it's a separate decision, and radius already uses t-shirt names (`xs/sm/md/lg`) that components reference heavily, so renaming it is a bigger, independent migration. Left for a follow-up if you want system-wide consistency.

## Recommendation

Approve → I execute as one atomic rename commit (temp-name pass, then finalize), gate-green, with the `CHANGELOG` migration note under `## Unreleased`. If you want radius folded in too, say so and I'll extend the proposal rather than do it silently.
