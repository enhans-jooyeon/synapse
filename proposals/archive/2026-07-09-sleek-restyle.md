# Proposal: "Sleek" visual restyle (ElevenLabs / Sana AI direction)

**Status: proposed · Author: Claude · Decider: June**

Target: clean but not boring — the references achieve it through monochrome discipline (already ours), *surface quietness* (fewer boxes, softer depth), *typographic confidence* (bigger contrast between display and UI text), and *finish* (radius, motion, tonal buttons). Synapse's architecture stays; this is a value-layer and default-layer revision.

What the references actually do, distilled:

- Separation by **space and hairlines**, not bordered boxes. Tables and cards are barely framed.
- **Tonal (filled gray) secondary buttons**, not outlined ones. Outlines read "enterprise form"; tonal fills read "product."
- **Soft, large-blur shadows** at low alpha for floating layers; borders nearly disappear on overlays.
- **Slightly larger radii** — controls ~8, surfaces 12–16; primary CTAs sometimes full pill.
- **Color is almost absent** in chrome; status is dots and plain text more often than tinted chips.
- **Type contrast**: large tight-tracked headings against small, quiet UI text; generous line air in reading contexts.
- **Motion finish**: fast (120–200ms), eased, everywhere — hover states never snap.

---

## Tier A — high impact, low risk (recommend: just do)

| # | Change | Concrete delta |
|---|---|---|
| A1 | Hairline the chrome | `border.default` #E3E3E8 → #E9E9ED (closer to subtle); component boundaries get quieter. Table outer frame removed in focus tables (kept in dense/scrolling tables); table header row loses its `bg.surface` fill — `label` `fg.tertiary` headers on the page bg with a single hairline rule. |
| A2 | Soften elevation | `shadow.overlay` → `0 8px 24px rgba(9,9,11,0.08)`; `shadow.modal` → `0 24px 48px rgba(9,9,11,0.12)`; floating layers drop their 1px border in light mode (keep in dark, where shadows die). |
| A3 | Radius step-up | `sm` 6→8 (controls), `md` 8→10 (cards, menus), `lg` 12→16 (modals). Full-pill stays for Badge/avatar. |
| A4 | Heading finish | Latin letter-spacing −0.01em on `heading-xl/lg` (Hangul exempt, as with display); `heading-xl` may go 700 for contrast. |
| A5 | Whitespace up in focus mode | `section-gap` 32→40, `card-padding` 24→28 (focus only; dense untouched — density architecture is the whole point). |
| A6 | Motion finish rule | All interactive elements transition background/border/color at `instant`(100ms)–`fast`(150ms) `standard` easing — as a hard rule, not a suggestion; add `hover-lift` (translateY(-1px) + shadow.raised) as a sanctioned card-interactive treatment. |

## Tier B — signature moves, medium risk (decide individually)

| # | Change | Trade-off to weigh |
|---|---|---|
| B1 | **Tonal secondary buttons**: `secondary` becomes `bg.sunken` fill, no border (hover: gray step up). The single biggest "product vs. enterprise-form" signal. | Loses the outline vocabulary entirely; ghost and tonal must stay distinguishable (ghost = transparent). |
| B2 | **Filled inputs**: fields become `bg.sunken`, borderless, with border only on focus/error. Very Sana. | Weaker affordance for "this is editable" in dense forms; needs testing with the mixed-value marker. |
| B3 | **Status quiets down**: table status default returns to `dot` + plain text (the sleekest rendering); `solid` becomes the opt-in for ops-heavy monitoring views. ⚠️ Directly reverses v3.8.4, which we adopted hours ago — but solid-chip tables and the sleek direction genuinely pull opposite ways. My call: dots align with the brief; you just chose solids for differentiation. Needs your ruling. | Dots differentiate perfectly on any highlight (no fill to melt) — they solve the original murk problem too. |
| B4 | **Primary CTA pill option**: `primary` buttons in Guided/hero contexts (only) may use `radius.full`. | Two button silhouettes in the system; jurisdiction must stay tight. |
| B5 | **Card default goes flat**: `flat` (bg.surface, borderless) becomes the default card; bordered becomes the variant for genuinely separable objects. | Big blast radius across recipes and existing specs. |

## Tier C — defer

- Bespoke display typography beyond Artific (custom cuts, variable-weight animation) — revisit at brand-refresh scale.
- Gradient/glass accents (both references use hints in marketing, not product) — conflicts with flat rule; skip.
- Illustration language — still the deliberate v1 gap.

## Not changing (guardrails that already match the references)

Black-key actions · blue-as-function-only · closed component set · density architecture · KO/EN rules · contrast policy floor (§8) · the enforcement gate.

## Execution order if approved

1. Tier A as one release (v4.0.0 — visual-breaking), preview updated, gate values retuned (border/shadow tokens).
2. Tier B items individually, each behind a browser before/after story for your sign-off.
3. Storybook build then starts from the settled look instead of retrofitting.
