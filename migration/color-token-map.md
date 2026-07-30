# Color token map — old `@enhans/synapse` → new Synapse (light mode)

Direction: **old → new**. Old = `viralpick/synapse` (`@enhans/synapse`, what the FE uses today). New = this repo's tokens (`tokens/synapse.css`, source of truth). Light mode only.

**Status:** `direct` = safe value swap · `review` = role/appearance changed, confirm intent. The `gap` status is retired — see [Resolved gaps](#resolved-gaps).

_**82 tokens**: 43 direct · 39 review · **0 gap**. Old-side values verified against `@enhans/synapse` v0.13.6. **Two Button disabled rows were added 2026-07-30** after auditing real component token usage — the original map had 80 and missed `button-secondary-disabled` and `button-ghost-disabled`._

## Text

| Old token | Old hex | New token | New hex | Status | Note |
|---|---|---|---|---|---|
| `text-text-primary` | `#000000` | `--sy-text-primary` | `#09090B` | direct | Pure black → near-black. |
| `text-text-primary-disabled` | `#d9d9da` | `--sy-text-disabled` | `#A9A9B2` | review | New disabled fg is darker/more legible. |
| `text-text-secondary` | `#808081` | `--sy-text-secondary` | `#62626B` | direct | Slightly darker. |
| `text-text-secondary-disabled` | `#f2f2f3` | `--sy-text-disabled` | `#A9A9B2` | review | New system has ONE disabled fg; old two collapse into it. |
| `text-text-tertiary` | `#b2b2b3` | `--sy-text-tertiary` | `#83838D` | direct |  |
| `text-text-inverted` | `#ffffff` | `--sy-text-on-inverse` | `#FFFFFF` | direct |  |
| `text-text-inverted-disabled` | `#f7f7f8` | `--sy-text-on-inverse` | `#FFFFFF` | review | RESOLVED (no new token). The old token was never a disabled treatment: #f7f7f8 on the old inverse #262627 runs 14.12:1 vs plain white's 15.12:1 — a 1.0 delta, visually identical to enabled. Mapping to fg-inverse is behaviour-preserving. A real on-inverse disabled affordance would be a governance proposal (foundations.md §glass: an inverse-surface context requires every component to carry an on-dark variant); no bg.inverse surface in the new system renders disabled text. |
| `text-text-error` | `#e6483d` | `--sy-status-danger` | `#B23230` | review | New danger TEXT deepened for AA; #e6483d survives as the solid fill. |
| `text-text-success` | `#10b978` | `--sy-status-success` | `#0E7A42` | review | New success TEXT deepened for AA; #10b978 survives as the solid fill. |
| `text-text-brand` | `#0a84ff` | `--sy-text-link` | `#3155C6` | review | Verified 2026-07-30 against the REAL source (@enhans/synapse v0.13.6 src/styles.css). Brand-blue-as-link -> functional link blue. If it was an accent rather than a link, see the brand note in the README. |
| `text-text-syntax` | `#64748b` | `--sy-text-secondary` | `#62626B` | direct | RESOLVED (no new token, by design). Code/ID/mono TEXT is text.secondary (components.md Table §id row). Syntax HIGHLIGHTING is deliberately untokenized: 'one muted theme system-wide, ≤5 colors drawn from viz + fg tokens, defined once at implementation' (components.md CodeBlock §Syntax theme). |

## Background

| Old token | Old hex | New token | New hex | Status | Note |
|---|---|---|---|---|---|
| `bg-background-0` | `#ffffff` | `--sy-bg-page` | `#FFFFFF` | direct |  |
| `bg-background-0-hover` | `#fbfbfc` | `--sy-bg-hover` | `rgba(9,9,11,0.04)` | review | New hovers are alpha overlays; solid nearest is --sy-bg-surface. |
| `bg-background-50` | `#fbfbfc` | `--sy-bg-surface` | `#FAFAFB` | direct | Subtle surface. |
| `bg-background-50-hover` | `#f7f7f8` | `--sy-bg-sunken` | `#F4F4F6` | direct |  |
| `bg-background-100` | `#f7f7f8` | `--sy-bg-sunken` | `#F4F4F6` | review | Old card/INPUT fill. Cards → --sy-bg-surface; text inputs are now white+outlined, not filled grey. |
| `bg-background-100-hover` | `#f2f2f3` | `--sy-bg-sunken` | `#F4F4F6` | direct |  |
| `bg-background-200` | `#f2f2f3` | `--sy-bg-sunken` | `#F4F4F6` | direct | Elevated surface. |
| `bg-background-200-hover` | `#e5e5e6` | `--sy-bg-active` | `rgba(9,9,11,0.06)` | review | New uses an alpha active overlay. |
| `bg-background-track` | `#e5e5e6` | `--sy-bg-sunken` | `#F4F4F6` | direct | Slider/Switch track. |
| `bg-background-inverted` | `#262627` | `--sy-bg-inverse` | `#09090B` | direct |  |
| `bg-background-inverted-hover` | `#666667` | `--sy-bg-inverse-soft` | `#33333A` | direct |  |
| `bg-background-brand` | `#0a84ff` | `--sy-action-brand-bg` | `#3155C6` | review | Verified 2026-07-30 against the REAL source (@enhans/synapse v0.13.6 src/styles.css). Brand IS azure in v0.13.6, and the new brand is blue.600 -> hue-preserving. Still decide per element: AI/brand CTA -> --sy-action-brand-bg; ordinary primary -> --sy-action-primary-bg #09090B; info surface -> --sy-status-info-bg. |
| `bg-background-brand-light` | `#e6f2ff` | `--sy-status-info-bg` | `#E4EAFB` | direct | Verified 2026-07-30 against the REAL source (@enhans/synapse v0.13.6 src/styles.css). #e6f2ff is old blue-50; new info tint E4EAFB is new blue.100. Light brand tint -> info tint, same role, near-same value. |
| `bg-background-highlight` | `#e2e8f0` | `--sy-bg-selected` | `#EFF3F7` | review | Selection/highlight surface. |
| `bg-background-highlight-light` | `#f8fafc` | `--sy-bg-selected` | `#EFF3F7` | review | Subtle highlight; or --sy-bg-surface if not selection. |

## Border

| Old token | Old hex | New token | New hex | Status | Note |
|---|---|---|---|---|---|
| `border-border-100` | `#e5e5e6` | `--sy-border-default` | `#E9E9ED` | direct |  |
| `border-border-100-hover` | `#d9d9da` | `--sy-border-strong` | `#D1D1D8` | direct |  |
| `border-border-200` | `#d9d9da` | `--sy-border-strong` | `#D1D1D8` | direct |  |
| `border-border-200-hover` | `#b2b2b3` | `--sy-border-strong` | `#D1D1D8` | review | New has one 'strong' border; old 200/300 collapse in. |
| `border-border-300` | `#b2b2b3` | `--sy-border-strong` | `#D1D1D8` | review |  |
| `border-border-300-hover` | `#808081` | `--sy-border-strong-hover` | `#A9A9B2` | direct | RESOLVED by adding a token (2026-07-30), superseding the earlier squash to border-strong. The border ladder was capped at border.strong; --sy-border-strong-hover (gray.400) is the hover step above it. This old token now has a true 1:1 target. |
| `border-border-500` | `#64748b` | `--sy-ai-border` | `#DCE3EB` | review | RESOLVED (no new token) — CONDITIONAL, the one row needing FE-side inspection. Slate is now the AI-surface family: if this bordered an AI/slate surface → --sy-ai-border; otherwise → --sy-border-strong. NOTE this is a role reassignment, not a value swap (#64748b = 4.76:1 on white; ai-border = 1.29:1) because the new system forbids tint + saturated outline. |
| `border-border-900` | `#262627` | `--sy-border-selected` | `#09090B` | direct | Darkest border → selected (near-black). |
| `border-border-inverted` | `#ffffff` | `--sy-text-on-inverse` | `#FFFFFF` | direct | Border on dark surfaces. |
| `border-border-success` | `#6ee7b7` | `--sy-status-success-bg` | `#DCF2E6` | review | RESOLVED (no new token, by design). Success surfaces are borderless tints: Banner `subtle` is 'borderless status.*-bg fill, status.* text — no border, no rail' and 'tint + saturated outline remains the forbidden wireframe formula' (components.md Banner/Alert). border.error exists only as a form-field validation perimeter, and there is no success field state — principled asymmetry, not an oversight. |
| `border-border-success-hover` | `#10b978` | `--sy-status-success-bg` | `#DCF2E6` | review | RESOLVED (no new token, by design). Same as border-border-success: no success outline exists to hover. If a success surface needs an interactive step, use the tint's hover on the container, not a saturated border. |
| `border-border-error` | `#ff5c51` | `--sy-border-error` | `#D2403E` | direct | Dedicated error border exists. |
| `border-border-error-hover` | `#e6483d` | `--sy-border-error` | `#D2403E` | direct |  |
| `border-border-brand` | `#369aff` | `--sy-border-focus` | `#3D63DD` | review | Verified 2026-07-30 against the REAL source (@enhans/synapse v0.13.6 src/styles.css). Old blue-400 brand border -> functional focus blue. |
| `border-border-brand-hover` | `#0a84ff` | `--sy-border-focus` | `#3D63DD` | review | Verified 2026-07-30 against the REAL source (@enhans/synapse v0.13.6 src/styles.css). Old brand border hover -> the single new focus token (new focus has no hover step). |

## Icon

| Old token | Old hex | New token | New hex | Status | Note |
|---|---|---|---|---|---|
| `text-icon-primary` | `#262627` | `--sy-icon-primary` | `#1E1E24` | direct | Verified against @enhans/synapse v0.13.6. CORRECTED 2026-07-30 — the new system now has a DEDICATED icon family, so this no longer collapses into fg-primary. Old #262627 -> new icon-primary #1E1E24: both are one ramp step lighter than their text counterpart, for the same optical reason (a stroke icon reads heavier than a glyph at equal value). Near 1:1. |
| `text-icon-primary-disabled` | `#d9d9da` | `--sy-icon-disabled` | `#A9A9B2` | review | Verified against @enhans/synapse v0.13.6. -> icon-disabled (aliases fg-disabled). |
| `text-icon-secondary` | `#808081` | `--sy-icon-secondary` | `#62626B` | direct | Verified against @enhans/synapse v0.13.6. -> icon-secondary (aliases fg-secondary; no optical delta at mid-grey). |
| `text-icon-secondary-disabled` | `#e5e5e6` | `--sy-icon-disabled` | `#A9A9B2` | review | Verified against @enhans/synapse v0.13.6. Old had three icon-disabled steps; new has one. |
| `text-icon-tertiary` | `#b2b2b3` | `--sy-icon-tertiary` | `#83838D` | direct | Verified against @enhans/synapse v0.13.6. -> icon-tertiary (aliases fg-tertiary). |
| `text-icon-tertiary-disabled` | `#f7f7f8` | `--sy-icon-disabled` | `#A9A9B2` | review | Verified against @enhans/synapse v0.13.6. Collapses into the single icon-disabled. |
| `text-icon-inverted` | `#ffffff` | `--sy-icon-on-inverse` | `#FFFFFF` | direct | Verified against @enhans/synapse v0.13.6. -> icon-inverse. |
| `text-icon-error` | `#e6483d` | `--sy-icon-danger` | `#B23230` | review | Verified against @enhans/synapse v0.13.6. -> icon-danger (aliases status-danger; deepened for AA — #e6483d survives as the solid fill). |
| `text-icon-success` | `#10b978` | `--sy-icon-success` | `#0E7A42` | review | Verified against @enhans/synapse v0.13.6. -> icon-success (aliases status-success). |
| `text-icon-brand` | `#0a84ff` | `--sy-icon-info` | `#3155C6` | review | Verified against @enhans/synapse v0.13.6. Old brand-blue icon -> icon-info (functional indigo). Use --sy-action-brand-fg-on-page (azure) if it marked a brand/AI action rather than information. |

## Button

| Old token | Old hex | New token | New hex | Status | Note |
|---|---|---|---|---|---|
| `bg-button-primary` | `#262627` | `--sy-action-primary-bg` | `#09090B` | direct | Primary = black (new is truer black). |
| `bg-button-primary-hover` | `#4d4d4c` | `--sy-action-primary-bg-hover` | `#33333A` | direct |  |
| `bg-button-primary-disabled` | `#e5e5e6` | `--sy-bg-disabled` | `#F4F4F6` | review | Pair text with --sy-text-disabled. |
| `bg-button-secondary` | `#ffffff` | `--sy-action-secondary-bg` | `#F4F4F6` | review | Secondary bg white → light grey. For outlined-white use --sy-bg-page + --sy-border-default. |
| `bg-button-secondary-hover` | `#fbfbfc` | `--sy-action-secondary-bg-hover` | `#ECECEF` | direct |  |
| `bg-button-tertiary` | `#f2f2f3` | `--sy-action-secondary-bg` | `#F4F4F6` | review | No tertiary button in new system — folds into secondary. |
| `bg-button-tertiary-hover` | `#e5e5e6` | `--sy-action-secondary-bg-hover` | `#ECECEF` | review |  |
| `bg-button-tertiary-disabled` | `#f7f7f8` | `--sy-bg-disabled` | `#F4F4F6` | review |  |
| `bg-button-ghost` | `transparent` | (transparent) | `transparent` | direct | Ghost stays transparent. |
| `bg-button-ghost-hover` | `#fbfbfc` | `--sy-bg-hover` | `rgba(9,9,11,0.04)` | review | Ghost hover is now an alpha overlay. |
| `bg-button-destructive` | `#e6483d` | `--sy-status-danger-bg-solid` | `#D2403E` | direct | Destructive solid fill. **Value changed 2026-07-30**: `red.400` → `red.500`, so a white label clears AA at 4.62:1 with normal weight and danger left the §9 solid-label deviation. Side effect: `#e6483d` → `#D2403E` is a *closer* match than the old target (ΔE 30.5 vs 35.0). |
| `bg-button-destructive-hover` | `#c4342a` | `--sy-status-danger-bg-solid-hover` | `#B23230` | direct | Hover moved `red.500` → `red.600` with the rest-state shift; rest→hover separation improved from ΔE 5.9 to 10.1. |
| `bg-button-destructive-disabled` | `#ffa59f` | `--sy-bg-disabled` | `#F4F4F6` | review | RESOLVED by adding a token (2026-07-30), superseding the earlier squash. Fill -> neutral --sy-bg-disabled; the danger hue moves to the LABEL via the new --sy-action-danger-fg-disabled #DB504D (3.63:1). Old #ffa59f ran 1.89:1 with white and is not carried over. A pale-red FILL was rejected: it renders identically to the subtle danger Banner/Badge. |
| `bg-button-brand` | `#0a84ff` | `--sy-action-brand-bg` | `#3155C6` | direct | Verified 2026-07-30 against the REAL source (@enhans/synapse v0.13.6 src/styles.css). Near-mechanical swap: old azure brand button -> new brand blue. Reserved for conversational-AI CTAs (Ask agent / Composer send), max 1/screen; operational agent actions (Run/Retry/Resume) stay --sy-action-primary-bg. |
| `bg-button-brand-hover` | `#006bd6` | `--sy-action-brand-bg-hover` | `#3D63DD` | review | Verified 2026-07-30 against the REAL source (@enhans/synapse v0.13.6 src/styles.css). Direction FLIPPED: old hover darkened (#0a84ff -> #006bd6); new hover lightens in light mode (blue.600 -> blue.500) and darkens in dark mode. Use the token, never hand-derive. |
| `bg-button-brand-disabled` | `#e2e8f0` | `--sy-bg-disabled` | `#F4F4F6` | review | Verified 2026-07-30 against the REAL source (@enhans/synapse v0.13.6 src/styles.css). Old #e2e8f0 is slate-200 — a cool tinted disabled fill. New fill is neutral --sy-bg-disabled with the hue moved to the label via --sy-action-brand-fg-disabled #3D63DD (4.75:1). So v0.13.6 DID tint brand-disabled, which retroactively justifies that token. |
| `bg-button-secondary-disabled` | `#ffffff` | `--sy-bg-disabled` | `#F4F4F6` | review | ADDED 2026-07-30 — missing from the original map, found by auditing component token usage. Old secondary-disabled was WHITE (no visual disabled signal at all); the new system uses the neutral bg-disabled fill in every variant with the label carrying the state. |
| `bg-button-ghost-disabled` | `transparent` | `--sy-bg-disabled` | `#F4F4F6` | review | ADDED 2026-07-30 — missing from the original map. Old ghost-disabled was TRANSPARENT. New: disabled is a fill in every variant (components.md Button §States, "40% opacity is forbidden"), so a disabled ghost now gains the grey fill — a deliberate appearance change. |

## Radius

| Old token | Old hex | New token | New hex | Status | Note |
|---|---|---|---|---|---|
| `rounded-small (4px)` | `4px` | `--sy-radius-xs` | `4px` | direct |  |
| `rounded-medium (6px)` | `6px` | `--sy-radius-sm` | `8px` | review | 6→8. Control radius is size-relative now: sm8/md10/lg12; buttons/inputs usually → --sy-radius-control-md. |
| `rounded-large (8px)` | `8px` | `--sy-radius-sm` | `8px` | review | Value matches; cards use --sy-radius-lg 16px in new system. |
| `rounded-xlarge (12px)` | `12px` | `--sy-radius-md` | `12px` | direct |  |
| `rounded-round` | `9999px` | `--sy-radius-full` | `9999px` | direct |  |

## Chart

| Old token | Old hex | New token | New hex | Status | Note |
|---|---|---|---|---|---|
| `chart-0 blue` | `#3b82f6` | `--sy-viz-1` | `#5B7CE0` | direct | Categorical ramp by index. |
| `chart-1 green` | `#10b981` | `--sy-viz-2` | `#4FAE8B` | direct |  |
| `chart-2 yellow` | `#eab308` | `--sy-viz-3` | `#C9932E` | direct |  |
| `chart-3 red` | `#ef4444` | `--sy-viz-4` | `#C15D5D` | direct |  |
| `chart-4 purple` | `#a855f7` | `--sy-viz-5` | `#8A6FC9` | direct |  |
| `chart-5 teal` | `#14b8a6` | `--sy-viz-6` | `#4FA3C4` | direct |  |
| `chart-6 pink` | `#ec4899` | `--sy-viz-7` | `#B36FA3` | direct |  |
| `chart-7 lime` | `#84cc16` | `--sy-viz-8` | `#7A828E` | review | New viz-8 is a NEUTRAL grey, not lime — reassign if lime carried meaning. |

## Resolved gaps
<a id="resolved-gaps"></a>

> **Five of these seven are provisional.** The resolutions below argue from *current* system principles ("success surfaces are borderless tints", "disabled is variant-independent"). While the new system is still being fine-tuned, those principles are themselves in play. Every fallback here is **safe**; not every one is **settled**. See **`variant-decisions.md`** for the add-variant-vs-squash decision framing, which also covers the many-to-one collapses this table doesn't — 54 of 80 old tokens land in a shared bucket.

Seven old tokens originally had no new equivalent. All were resolved on **2026-07-30** and **none required a new `--sy-*` token** — five are deliberate omissions in the new system, one was never functional in the old system, and one is conditional on FE usage.

| Old token | Old hex | Resolution | Why no new token |
|---|---|---|---|
| `text-text-syntax` | `#64748b` | `--sy-text-secondary` | Code/ID/mono **text** is `text.secondary`. Syntax **highlighting** is untokenized by design: "one muted theme system-wide, ≤5 colors drawn from `viz` + `fg` tokens, defined once at implementation" (components.md → CodeBlock). |
| `bg-button-destructive-disabled` | `#ffa59f` | `--sy-bg-disabled` + `--sy-text-disabled` | Disabled is variant-independent for every Button (components.md → Button §States), danger included. The old value ran **1.89:1** with white — below the 3:1 hard floor, so there is no accessible behaviour to preserve. |
| `border-border-success` | `#6ee7b7` | `--sy-status-success-bg` (borderless tint) | Success surfaces are borderless tints. Banner `subtle` = "no border, no rail", and "tint + saturated outline remains the forbidden wireframe formula". A success border token would only enable the forbidden pattern. |
| `border-border-success-hover` | `#10b978` | `--sy-status-success-bg` | No success outline exists to hover. Interactive steps go on the container tint, not a saturated border. |
| `border-border-300-hover` | `#808081` | `--sy-border-strong` | foundations.md §5 assigns bordered-element hover to `border.strong`. The old 100/200/300(+hover) ladder collapses into subtle/default/strong + `border.selected`; `#808081` has no distinct role. Use `border.selected` if it signalled selection, not hover. |
| `text-text-inverted-disabled` | `#f7f7f8` | `--sy-text-on-inverse` | **It was never a disabled treatment.** `#f7f7f8` on the old inverse `#262627` runs **14.12:1** vs plain white's **15.12:1** — a 1.0 delta, indistinguishable from enabled. (Light mode's real disabled delta, for contrast: 2.12:1 vs 18.11:1.) Mapping to `text-on-inverse` preserves the actual behaviour. |
| `border-border-500` | `#64748b` | `--sy-ai-border`, **else** `--sy-border-strong` | **The one row needing FE-side inspection.** Slate is now the AI-surface family: if this bordered an AI/slate surface → `ai-border`; otherwise → `border-strong`. This is a role reassignment, not a value swap (`#64748b` = 4.76:1 on white; `ai-border` = 1.29:1) because tint + saturated outline is forbidden. |

**Why the error/success asymmetry is principled.** `--sy-border-error` exists while `--sy-border-success` does not, which looks like an oversight. It isn't: error borders are **form-field validation perimeters**, and the new system has no success field state. Success communicates through tint + deepened text, never an outline.

**Open governance question (not a gap).** If the FE ever needs genuinely disabled content on a `bg.inverse` surface, that requires a first-class inverse-surface context — every component carrying an on-dark variant — which foundations.md §glass names explicitly as "a governance proposal, not an ad-hoc surface." Do not add a single on-inverse disabled token to paper over it.

### Also gone, no token (non-color, noted for completeness)
- `shadow-glow` (`0 0 12px rgba(10,132,255,.4)`) — the new system forbids glow/blur; focus is a ring, not a glow. No replacement token.
- Old `icon-*` scale — intentionally **not** a gap: the new system draws icons with `fg-*` tokens (see the Icon table).
