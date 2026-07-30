# Color token migration — old `@enhans/synapse` → new Synapse

Maps the **old** design system (`viralpick/synapse`, the `@enhans/synapse` npm package the FE consumes today) onto the **new** Synapse tokens in this repo, so FE code can be re-pointed color-by-color.

**Status: complete for light mode.** All 80 tokens map to an existing new token; the 7 original gaps were resolved 2026-07-30 without adding any new `--sy-*` token. Verified against `tokens/synapse.css` — every token referenced exists and every hex matches.

**Files**
- `color-token-map.csv` — spreadsheet-friendly (group, old class, old hex, new token, new hex, status, note)
- `color-token-map.json` — machine-readable (same data + meta) for scripting a codemod
- this README — how to use it and the decisions that aren't mechanical

## Direction & scope
- **Old → new.** Each row is an old token/hex the FE uses and the new `--sy-*` token to replace it with.
- **Light mode only.** The old system is light-theme; new values here are **light-mode**. The new system also ships dark values (`[data-theme="dark"]` in `tokens/synapse.css`) — pull those separately if the FE needs dark.
- **Source of truth** for the new side is `tokens/synapse.tokens.json` / `tokens/synapse.css`, not this file. If they disagree, they win.
- Covers color (text, background, border, icon, button), radius, and the chart ramp. Typography maps to the `.sy-type-*` styles (see `foundations.md` §2.2); shadows map by name (`shadow-sm`→ new `shadow-sm`, etc.) except `shadow-glow`, which has **no equivalent** — the new system forbids glow/blur and marks focus with a ring.

## How to read `status`
- **`direct`** — same role, safe value swap. **37 of 80 rows.**
- **`review`** — the role or appearance changed in the redesign; confirm intent before swapping. **43 of 80 rows.** Don't blind-replace these.
- **`gap`** — retired. Previously 7 rows; all resolved to existing tokens (see below).

## The decisions that are NOT find-and-replace
1. **Brand is still blue — but a different blue, and only for AI CTAs.** *(Revised 2026-07-30: the new system's brand color was re-hued graphite → blue, reversing the earlier graphite-point retarget. An earlier version of this file said "brand is no longer blue"; that is no longer true.)* The old `#0a84ff` brand blue was used for links, accents, and CTAs. The new system still splits that intent three ways, but two of the three are now blue:
   - **Links / focus / info** → functional blue `--sy-text-link #3155C6` / `--sy-border-focus #3D63DD` / `--sy-status-info`.
   - **Conversational-AI CTAs only** (Ask agent, Composer send) → `--sy-action-brand-bg #3155C6` (blue.600 light / blue.500 dark).
   - **Ordinary primary CTAs** → black `--sy-action-primary-bg #09090B`.

   Note that `text-link` and `action-brand-bg` **share `blue.600` deliberately** — one interactive hue, separated by render mode (text/ring vs. filled surface) rather than by two near-identical blues. So an old `*-brand` token still needs a human call on *which role* it becomes, but the value is the same for the first two, which makes the call cheaper than it was. **`--sy-brand-point #1A1A1F` stays graphite** — reserved for brand-identity objects (monogram tiles, brand marks), not CTAs.
2. **Status text vs. fill diverged.** Old error/success hexes (`#e6483d`, `#10b978`) were used for both text and fills. New text colors are deepened for AA (`--sy-status-danger #B23230`, `--sy-status-success #0E7A42`); the old brighter values survive as the **solid fills** (`--sy-status-danger-bg-solid #D2403E` — shifted a step deeper on 2026-07-30 so it clears AA unaided, `--sy-status-success-bg-solid #1F9D5B`). Pick text vs. fill per usage.
3. **Icons DO have a separate scale** *(reversed 2026-07-30)*. Old `icon-*` maps to the new `--sy-icon-*` family, not the text scale. Only `icon-primary` differs in value from its text counterpart (one ramp step lighter, for optical weight); the rest alias `text-*`/`status-*`. Also note the text scale itself was renamed `fg-*` → `text-*` in the same release, so old `text-*` → new `text-*` is now near-identity.
4. **Inputs went outlined-white.** Old `background-100 #f7f7f8` was the input fill. Text inputs are now white + a hairline border (`--sy-bg-page` + `--sy-border-default`); only truly disabled fields stay grey. Don't recolor inputs to a grey fill.
5. **Secondary button** bg changed white → light grey (`--sy-action-secondary-bg #F4F4F6`); there's no separate tertiary button (it folds into secondary).
6. **Radius** `medium 6px → 8px`, and control radius is now **size-relative** (sm 8 / md 10 / lg 12) — buttons/inputs usually land on `--sy-radius-control-md`.
7. **Chart ramp** maps by index; note `chart-7 lime` becomes a **neutral grey** (`--sy-viz-8`), not a lime — reassign if lime encoded meaning.

## The 7 resolved gaps — summary
None needed a new token. Full rationale in `color-token-map.md` → *Resolved gaps*.

| Old token | → | One-line reason |
|---|---|---|
| `text-text-syntax` | `text-secondary` | Syntax highlighting is untokenized by design (one muted theme, defined at implementation). |
| `bg-button-destructive-disabled` | `bg-disabled` + `text-disabled` | Disabled is variant-independent for all Buttons. Old value failed even 3:1. |
| `border-border-success` (+hover) | `status-success-bg` | Success is a borderless tint; tint + saturated outline is a forbidden pattern. |
| `border-border-300-hover` | `border-strong` | Bordered-element hover is `border.strong`; the old ladder collapsed. |
| `text-text-inverted-disabled` | `text-on-inverse` | Never a disabled treatment — 14.12:1 vs white's 15.12:1 on the old inverse. |
| `border-border-500` | `ai-border` **or** `border-strong` | **Needs FE inspection:** slate is now the AI-surface family. |

Two things deliberately left open, and shouldn't be closed by adding a token:
- **On-inverse disabled content** — needs a first-class inverse-surface context (every component carrying an on-dark variant), which `foundations.md` calls a governance proposal, not an ad-hoc surface.
- **Success outlines** — `border-error` exists only because form fields need a validation perimeter. There is no success field state, so the asymmetry is principled.

## Suggested use
Start with the 37 `direct` rows as a safe automated pass, then walk the 43 `review` rows by hand (they're the ones where the redesign actually changed something). The `note` column tells you what to decide. Note that a codemod's leverage is limited — most real FE usage sits in the `review` rows (`brand`, inputs, buttons).

## Still open
- **Dark mode is unmapped.** New values here are light-only; pull `[data-theme="dark"]` from `tokens/synapse.css` separately if the FE needs dark.
- **`border-border-500`** is the one row whose resolution depends on how the old FE actually used it.
