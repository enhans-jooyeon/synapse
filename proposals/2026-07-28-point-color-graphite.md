# Point color → graphite (achromatic, mode-inverting accent)

**Date:** 2026-07-28 · **Status:** applied, then **SUPERSEDED IN PART on 2026-07-30** · **Scope:** the point/accent color only. **Semver: MINOR** (visual retarget; no token renamed or removed, no API break).

> **Current state (read this first — 2026-07-31).** The graphite retarget below was applied, then partly superseded by the azure re-hue two days later. Settled jurisdiction, per June: **key color is black** (`action.primary`); **azure `azure.500 #0073E6` is used selectively** for brand + AI emphasis and now owns `action.brand-*` and `ai.solid`; **graphite survives on `brand.point` only**, for brand-identity objects (monogram tiles, brand marks, Artific hero). Consequences: `action.brand-fg` is **no longer mode-inverting** (white in both modes, since azure is constant), and the system deliberately carries **two blues** — azure for brand/AI-emphasis fills, indigo for links/focus/info — never mixed. The values table below is therefore historical for `action.brand-*` / `ai.solid`, and still accurate for `brand.point` / `brand-point-fg`. Authoritative: `foundations.md` §1 and `components.md` Button.

## What changed

The system's single accent — the point color, formerly the blue `#0621C4` — is retargeted to **graphite (achromatic near-black)**. Because a near-black accent is invisible on a dark page, the point now **inverts by mode**: near-black in light, near-white in dark. This matches the ElevenLabs / Sana benchmark direction (a restrained, monochrome accent) while preserving the "one deliberate point per screen" doctrine — it's simply no longer a hue.

**Blue is not gone from the system.** The functional blue ramp — `--sy-text-link` (`#3155C6` / `#9DB3EE`) and `--sy-border-focus` (`#3D63DD` / `#9DB3EE`) — is unchanged, by explicit decision. Blue now survives only in hyperlinks and focus rings, never in CTAs or AI markers.

## Values

| Token | Light | Dark |
|---|---|---|
| `--sy-action-brand-bg` | `#1A1A1F` | `#F2F2F4` |
| `--sy-action-brand-bg-hover` | `#33333B` | `#E4E4E7` |
| `--sy-action-brand-bg-active` | `#0E0E12` | `#D6D6DB` |
| `--sy-action-brand-fg` | `#FFFFFF` | `#1A1A1F` |
| `--sy-brand-point` | `#1A1A1F` | `#F2F2F4` |
| `--sy-brand-point-fg` | `#FFFFFF` | `#1A1A1F` |
| `--sy-ai-solid` | `#1A1A1F` | `#F2F2F4` |
| `--sy-glass-accent` (dormant) | `#33333B` | `#E4E4E7` |
| `--sy-text-link` / `--sy-border-focus` | *unchanged (blue)* | *unchanged (blue)* |

Primitive `point` ramp retargeted to graphite and extended with light steps (`100`/`200`) so the dark-mode inverted fills resolve from the ramp rather than ad-hoc values: `50 #F4F5F6 · 100 #F2F2F4 · 200 #E4E4E7 · 400 #33333B · 500 #1A1A1F · 600 #0E0E12`.

## The inversion mechanic (why the foreground tokens moved)

A colored accent could keep a constant-white foreground in both modes. An inverting achromatic accent cannot — white text on the near-white dark-mode button is illegible. So the accent's **foreground** inverts too:

- `action.brand-fg` and `category.point-fg`: light `white` → dark near-black (`point.500`). These are dedicated to the brand button / brand mark, so flipping them is safe.
- **AI-marker and Composer-send glyphs** previously drew their icon from `text.on-solid` (constant white, shared with the status `*-bg-solid` fills). They were **re-routed to `action.brand-fg`** so they invert with the accent. `text.on-solid` stays constant white — status solids (danger/success/warning) remain saturated and still need white labels, so that token was left untouched.

## Gate change

`tools/validate.py` `CONTRAST_PAIRS`: the `"fg-on-solid on ai-solid"` pair became `"action-brand-fg on ai-solid"` — the AI-solid label is now the inverting accent foreground, not the constant-white on-solid. All contrast pairs pass AA/policy in both modes after the change.

## Blast radius

`tokens/synapse.css` (both mode blocks), `tokens/synapse.tokens.json` (primitive ramp + semantic modes + de-blued descriptions), `preview.html` (accent glyph/text routing), `tools/validate.py` (one contrast pair). No component markup, no token names, no manifest entries changed.

## Risks / tradeoffs (stated plainly)

- **The "AI at work" beacon loses its blue signal.** `ai.solid` (live-activity Badge, in-progress AI ProgressBar) is now graphite, not blue. AI-at-work now reads by shape/context, not hue. This is the deliberate cost of removing blue.
- **Accent scarcity matters more.** A near-black accent sits closer in value to ordinary dark chrome/text than a saturated blue did, so an over-used point loses its "pop." The one-point-per-screen rule is now load-bearing, not just tidy.
- **Two blues could read as inconsistent.** Links/focus stay blue while everything else goes graphite; a reasonable reviewer could argue the link blue now looks orphaned. Left as-is per decision; revisit if it reads oddly in practice.

## Follow-ups (not done)

- ~~Update `foundations.md` §1 accent/point doctrine prose to describe the graphite inversion.~~ **Done** — aligned across `foundations.md` §1, `design.md` §2/§3, `components.md`, `ai-patterns.md`, and the manifest source.
- **Still open:** `app-generation/` (README, CLAUDE.md, tokens-map.md, component-catalog.html) and `HANDOFF.md` still describe/hardcode `#0621C4`. The app-generation charts use blue as a *viz* ramp (not the accent), so that's a separate reconciliation decision, not a straight find-replace.
- Decide whether the link/focus blue should eventually harmonize with graphite or stay as the lone functional hue.
