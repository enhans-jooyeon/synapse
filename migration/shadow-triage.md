# Shadow migration — triage by role, then ring / delete / snap

**For the product-repo migration (ruled by June, 2026-08-06, approving Dahye's triage — migration audit test 8; contract: `design.md` hard rule 3, `foundations.md` §6; gate SY009 on both sides).** Written for the **283 shadow call sites** the audit found: **100 arbitrary `shadow-[…]`**, **23 raw inline `boxShadow` style objects**, **160 Tailwind `shadow-sm` / `md` / `lg` / `xl`**. Those three counts are what a conversion script's coverage report must add up to.

The shape of this one is different from the other areas: **most of these call sites do not get a token — they lose the shadow entirely.** Snapping to `--sy-shadow-*` is the *last* branch of the triage, not the default.

## Why this is a rule

`design.md` hard rule 3: *"NEVER introduce a font family beyond the three defined …, a weight outside 400/500/600/700, or **a shadow value**."* The reason is in `foundations.md` §6, whose first line is *"Synapse is **borders-first**: in-flow hierarchy is drawn with 1px borders and background steps, not shadows"* — `border.subtle` for dividers inside a component, `border.default` at the component boundary, `border.strong` on hover. And on the other side: *"Shadows are reserved for elements that float above the page … NEVER put shadows on static cards, buttons, or inputs (Card `elevated` excepted)."*

So a raw `box-shadow` is usually not an off-scale-value problem; it is a **claim that something floats when it doesn't**. Three consequences:

- **A shadow on a static card is a false depth signal.** If everything in a grid is lifted, nothing is, and the one genuinely floating layer above it has no headroom left to read as floating.
- **The five-step scale is assigned by ROLE, not by blur radius.** `xs` resting · `sm` hover/lift · `md` shallow float · `lg` standard float · `xl` deep. Matching an old `0 4px 12px` to whichever token has a similar blur reproduces the mistake with tokens.
- **A zero-blur `0 0 0` shadow is not elevation at all.** §6 sanctions it as a distinct exception — a ring, inset (a border substitute where a real border would shift layout) or outset (a focus ring) — which *"is not elevation and carries no blur; **elevation needs blur**, i.e. a `shadow.*` token."* Mapping a ring onto a `--sy-shadow-*` token destroys a focus indicator.

## The real fix: a PREFIXED theme scale

One correction to carry forward first: Dahye's original message cited **§7** for the ring exception — **rings are §6** (Elevation & borders); §7 is Motion. Now the config-level fix, which is the whole reason SY009 can be a permanent rule.

Four of Tailwind's default `boxShadow` keys — `sm` / `md` / `lg` / `xl` — are **byte-identical to Synapse's own shadow token names.** Source the scale under the same names and `shadow-lg` means two different things depending on whether the theme loaded, and no lint rule can tell correct code from a leftover. So the scale is exposed **prefixed**, replacing Tailwind's defaults (`tooling/product-gates/tailwind.synapse.cjs`):

**Tailwind v3:**

```js
// tailwind.config — the token scale, prefixed; Tailwind's defaults are REPLACED
theme: {
  boxShadow: Object.fromEntries(
    Object.entries(tokens.primitive.shadow)
      .filter(([k]) => !k.startsWith('$'))
      .map(([k, v]) => [`float-${k}`, v.$value])   // → shadow-float-xs … xl (+ thumb/glass, see below)
  ),
}
```

**Tailwind v4:** `boxShadow` becomes the `--shadow-*` namespace — clear it, then re-add the five steps prefixed. Enumerated rather than generated, which drops `thumb`/`glass` by construction (the v3 snippet emits them and SY009 flags them):

```css
/* app.css — after `@import "tailwindcss"` and Synapse's own tokens/synapse.css */
@theme inline {
  --shadow-*: initial;                        /* Tailwind's sm…2xl/inner cease to exist */
  --shadow-float-xs: var(--sy-shadow-xs);     /* resting lift  */
  --shadow-float-sm: var(--sy-shadow-sm);     /* hover/lift    */
  --shadow-float-md: var(--sy-shadow-md);     /* shallow float */
  --shadow-float-lg: var(--sy-shadow-lg);     /* standard float */
  --shadow-float-xl: var(--sy-shadow-xl);     /* deep          */
  /* thumb + glass deliberately absent — see the special cases below */
}
```

The complete preset is `tooling/product-gates/tailwind.synapse.v4.css` (v4) / `tooling/product-gates/tailwind.synapse.cjs` (v3); take it whole rather than pasting this block.

Two things follow, and both matter:

1. **A bare `shadow-*` is now ALWAYS a leftover.** That is what makes **SY009 a standing rule rather than a migration-phase one**, and it lets the rule work as an *allowlist* — which also closes the `shadow-xs` and bare-`shadow` holes that a denylist left open.
2. **`float` is not decoration — it is the jurisdiction.** Only floating layers keep a shadow, so the class says so. Writing `shadow-float-md` on a static card reads wrong, which is the point.

`drop-shadow-*` gets its own rule: it is a CSS-filter effect with no Synapse token behind it.

## Decision tree per call site

```
For each shadow call site:
│
├─ 1. MACHINE-DECIDABLE — is the blur component 0?
│     i.e. the value is `0 0 0 Npx <color>` (inset or outset), no blur, no spread-with-blur
│     └── YES → it is a RING, not elevation. foundations §6 sanctions it:
│              • inset  → a border substitute where a real border would shift layout
│                         (e.g. calendar day cells)
│              • outset → a focus ring, drawn as TWO stacked shadows: an inner
│                         `0 0 0 2px var(--sy-bg-page)` gap ring, then the coloured
│                         `0 0 0 4px` ring (so the ring reads detached, offset 2px)
│              Convert to the ring form with a TOKEN colour at FULL strength.
│              NEVER color-mix / lighten a focus ring — that clause was deleted
│              2026-07-30 after it failed WCAG 1.4.11's 3:1 floor in 11 of 12 Button
│              cells. Do NOT map a ring to a --sy-shadow-* token.
│
└─ 2. Blur > 0 → it is elevation, and the ELEMENT'S ROLE decides. Not machine-decidable:
      a human (or a component-name heuristic) answers "does this thing float above the page?"
      │
      ├─ STATIC — it sits in the flow: a card in a grid, a chart frame, a panel, a section
      │   header, a button, an input, a list row.
      │   └── DELETE the shadow. Borders-first: in-flow hierarchy is 1px borders +
      │       background steps (border.subtle inside, border.default at the boundary,
      │       border.strong on hover) — foundations §6.
      │       OR, if the element genuinely must read as lifted, PROMOTE THE SURFACE:
      │       Card `elevated` (shadow.xs at rest), or the hover-lift micro-treatment on
      │       interactive Cards only (translateY(−1px) + shadow.xs at `fast`).
      │       "It looked flat without it" is not a promotion; density and borders carry it.
      │
      ├─ FLOATING — portalled / positioned above the page: menu, popover, dropdown,
      │   tooltip, command palette, dialog, drawer, toast, sticky bar.
      │   └── SNAP to the step for that ROLE (class: shadow-float-<step>):
      │         xs  resting lift    — elevated Card, sticky bars
      │         sm  hover/lift      — interactive Cards, draggable tiles
      │         md  shallow float   — menus/popovers close to the surface
      │         lg  standard float  — dropdowns, popovers, tooltips
      │         xl  deep            — dialogs, drawers
      │       Pick by ROLE from that list, NOT by matching the old blur radius.
      │       border.overlay is part of the floating recipe — transparent in light (the
      │       shadow carries the edge), visible in dark (where shadows die against black).
      │
      └─ It floats, and NO step expresses what it needs — a genuinely new elevation role
          └── file a proposal (design.md §6), never a local override and never a
              hand-tuned `shadow-[…]`. No proposal of this kind was ruled in by this audit.
```

**Which branch is machine-decidable:** branch 1 only. `blur == 0 ⇒ ring` is a pure parse of the value, and it should account for a large share of the 100 arbitrary `shadow-[…]` and the 23 inline `boxShadow` objects — rings are exactly the thing people hand-write, because there was no class for them. Branch 2 is **not** decidable from the value: `0 4px 12px rgba(0,0,0,.07)` on a static card and on a popover are the same string with opposite answers.

A good approximation for branch 2 is a **component-name allowlist** (`Menu`, `Popover`, `Tooltip`, `Dropdown`, `Dialog`, `Modal`, `Drawer`, `Toast`, `Palette` → floating; everything else → static-until-proven), which turns it into a review of the exceptions instead of a review of all 283. Expect the split to be lopsided toward *deletion*: the 160 Tailwind defaults are overwhelmingly on in-flow cards and panels, and a large share of the 123 hand-written values are rings.

Three special cases:

- **`shadow-none`** — usually a *fix* someone applied to cancel an inherited shadow. Delete both sides: remove the source shadow, then remove the `shadow-none`.
- **`shadow-inner`** — an inset *with* blur. Neither a ring (blur > 0) nor elevation (Synapse has no inset elevation). Almost always wants `bg.sunken` instead.
- **A slider / knob handle** on a track takes `--sy-shadow-thumb` — a dedicated control token with an all-around ambient component so a borderless handle defines its circumference against a same-value background. It is **not** a step on the elevation scale and is scoped to draggable knobs on tracks. **Mind the class form:** `primitive.shadow` also carries `thumb` and `glass`, so the **v3** snippet — which maps the group programmatically — emits `shadow-float-thumb` / `shadow-float-glass`, and SY009's allowlist only passes `shadow-float-{xs,sm,md,lg,xl}`, so both would be flagged. The **v4** block enumerates the five steps instead, so neither exists. Either way, reach the thumb through the Slider component or the CSS var, not a utility class.

## Enforcement

- Product repo — `tooling/product-gates/check-raw-values.mjs`, **SY009**, now an **allowlist**: any un-prefixed shadow class is an error — `shadow-{sm,md,lg,xl,2xl,inner,none}`, bare `shadow`, `shadow-xs`, and `shadow-[…]`. Only `shadow-float-*` passes. `drop-shadow-*` is flagged under SY009 by its own rule. The message names the triage (ring / static / floating) so the fix is in the error, not in a doc lookup.
- **SY009 is a standing rule, not a migration-phase one.** The prefixed theme scale is what makes that possible: after it lands, a bare `shadow-*` cannot be legitimate, so the rule never needs to be relaxed. Land the theme change *first* — running the gate before the prefix exists will flag correct token classes.
- DS repo — `tools/validate.py`: **SY009** covers the CSS *declaration* form (`box-shadow:`). The class form is product-side only, which is why it never fired on these 283. The **`synapse-allow`** marker remains the documented escape hatch and must carry a harness ticket reference on the line — use it for the window between the gate landing and the theme prefix landing, not as a decision.
- Precedent for the prefix: the same delete-the-collision move on z-index (`migration/z-index-migration.md`) replaced Tailwind's `z-10…z-50` outright rather than aliasing over them — and SY023 then found 3 real errors in this repo's own render on day one.

## Not changing in the DS

- **No new shadow tokens.** `--sy-shadow-{xs,sm,md,lg,xl}` plus `thumb` are the whole set; `shadow.glass` stays **dormant — do not apply it** (`glass.surface` / `rim` / `border` are live for AppLauncher's faux-glass, but the translucency tokens are not — `foundations.md` §6).
- `foundations.md` §6 is **unchanged** — the ring exception, the borders-first rule and the five-step scale were all already there; this ruling is an *application* of §6, not an amendment. `tools/validate.py` gains no new rule either: SY009 already existed and its docstring only gained a pointer to the product-side class form.
