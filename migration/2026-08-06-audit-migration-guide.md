# Product-app migration guide — the 2026-08-06 audit rulings

**Source.** June and Dahye ran a **9-test migration audit** of the product app against the Synapse contract and ruled on four of the areas on **2026-08-06**. This doc is the consolidated *how* for those rulings: colors (test 3), scales (test 4), icons (test 6), shadows (test 8), and the duration half of motion (test 9).

**Read this first — the framing.** Almost none of this is a token release. **The scales stay closed.** June explicitly refused to add tokens for off-scale values, so for the great majority of the findings the DS side changes *nothing* and the product side snaps to what already exists. Each section below ends with a **"Not changing in the DS"** block, so nobody waits on a release that is not coming.

**One thing is genuinely open.** Test 9's **easing** half is *not* ruled here — the coordinator is writing it up as a separate proposal, because the DS's own Button spinner uses `linear` and applying the ruling as stated would break continuous motion. Do not migrate easing off this doc. Duration only.

**What did change in the DS, and it is small:** the icon/illustration boundary is now spec text (`icons.md`, `foundations.md` §8) and the SY019 size check honours it; the product gate gained SY009 (shadow classes) and SY025 (duration classes). Nothing else.

---

## 1. Colors (test 3) — three tiers, nearest-token snapping

### Audit numbers

| Class of value | Kinds | Uses | Share |
|---|---:|---:|---:|
| Already mappable to a `--sy-*` token | 37 | 1,983 | 3% |
| Tailwind **v3** palette classes (`slate-500`, `zinc-200`, …) | 117 | 1,098 | 11% |
| Tailwind **v4** palette classes | 1 | 2 | <1% |
| Hardcoded near-greys | 243 | 1,115 | 24% |
| Genuinely arbitrary colors | 582 | 1,314 | 59% |

The percentages are of **kinds**, which is the number that matters for automation: 59% of the distinct colors in the app are one-off values, and hand-reviewing 582 of them is not a migration plan.

### The ruling (June, 2026-08-06)

> Apply **nearest-token snapping** to BOTH the near-greys AND the 582 arbitrary colors — *"only pull out separately the ones that have truly nothing similar."* Tailwind palette classes get a deterministic palette→semantic mapping.

So the 582 are not 582 proposals. They are a mechanical pass with a small escalation tail.

### The three-tier policy

**Tier 1 — Tailwind palette classes → deterministic mapping. Fully automatic.**
The 117 v3 kinds + 1 v4 kind are a *closed, known* input set: `{gray,slate,zinc,neutral,stone,red,blue,…}-{50…950}` in a `text-` / `bg-` / `border-` / `ring-` / `divide-` position. Build a lookup table **once**, keyed on `(palette-family, step, CSS position)` → `--sy-*` semantic token, and codemod it. The position is what supplies the semantic role for free: `text-slate-500` is a text role, `border-zinc-200` is a border role. The neutral families all collapse onto the one Synapse neutral ramp; the hued families go to their status/brand counterparts. No human is in this loop — a wrong row in the table is fixed once, in the table.

**Tier 2 — near-greys and arbitrary colors → snap to the nearest token. Semi-automatic.**
The 243 near-greys and the 582 arbitrary kinds go through the snapper described below. It emits a proposed token per kind; a human reviews the *list*, not the pixels. Expect the near-greys to be near-unanimous (they are all trying to be one of five neutrals) and the arbitrary set to split into a large obvious majority and a small residue.

**Tier 3 — genuinely unmatched → escalate individually as proposals.**
Only the residue — a value with **truly nothing similar** in the resolved token set for its role — leaves the mechanical path and becomes a normal DS proposal (`design.md` §6), one per color, with its call sites attached. This is the tail June carved out, and it should be counted in the tens, not the hundreds. A Tier-3 escalation is the *only* route by which this audit adds a color token, and none has been ruled in yet.

### How the snapping works — the method, concretely

**Compare in a perceptual space, against the resolved token set, per mode.**

1. **Resolve the token set first.** Take `tokens/synapse.tokens.json` / `tokens/synapse.css` and resolve every semantic color to a concrete sRGB value **once per mode** — light and dark are two separate target sets. A value snapping to `--sy-bg-surface` must be checked against light's `bg.surface` *and* dark's, because the two ramps are not parallel and a snap that is right in light can be visibly wrong in dark.
2. **Convert both sides to CIELAB and score with ΔE** (CIEDE2000; ΔE76 is acceptable for a first pass but reports misleading distances in the near-neutral region, which is exactly where this migration lives). Pick the minimum-ΔE token *within the candidate role set* from step 4.
3. **Do NOT use naive hex/RGB distance.** This is not a style preference — the system's greys are deliberately close together (`gray.50 / 100 / 150 / 175 / 200 / 300 …`, including two half-steps), and Euclidean RGB distance is not perceptually uniform, so it mis-picks *across the ramp*: it will happily put a value one step too light or too dark because the numeric gap between two adjacent neutrals is smaller than the perceptual gap the eye reads. Near-greys are 24% of the uses; getting the ramp step wrong on them is the single largest way this migration can produce a visually wrong app that passes the gate.
4. **A snap MUST preserve the SEMANTIC role.** This is the hard constraint, and it comes before distance:
   - Determine the role from how the value is *used* — status, brand/AI accent, text, icon, background/surface, border — not from what it looks like.
   - Snap **only within that role's token family**: a status color snaps to `--sy-status-*` / `--sy-icon-{success,warning,danger,info}`; a border to `--sy-border-*`; a surface to `--sy-bg-*`; body text to `--sy-text-*`.
   - **A colour used as a status must snap to a status token, never merely to the nearest value.** A muted red on an error row snaps to `--sy-status-danger`, even when some `viz` or brand hue happens to sit closer in ΔE. Losing the role is worse than losing a few ΔE units: the value drifts back on the next redesign, and the semantics never come back.
   - Where the role is genuinely undecidable from the call site, the kind goes to human review — it is not a Tier-3 escalation (the color may match fine), it is a role question.
5. **Report ΔE with every proposed snap** and set a review threshold. Snaps under a small ΔE are rubber-stamped in bulk; the ones above it are the review queue and the source of the Tier-3 residue.
6. **Re-check contrast after snapping, do not assume it.** A snap changes a measured pair. Text/background and non-text pairs must still clear their floors (4.5:1 / 3:1; the documented chart-policy 2.5:1 where it applies) in **both** modes — `validate.py tokens` already gates the DS's own pairs, but a product-side pair the DS never declared is the product's to verify.

### Not changing in the DS

- **No new color tokens.** Not for the near-greys, not for the 582. The palette is closed; Tier 3 is the only door and it is a proposal, not a batch.
- `tokens/synapse.tokens.json` and `tokens/synapse.css` are untouched by this ruling.
- No change to `validate.py` SY001 — raw hex/rgb was already an error, and the product gate already scans for it.

---

## 2. Scales (test 4) — snap off-scale px to the closed scales

Scope: off-scale hardcoded px in the app measured against Synapse's space / radius / font scales. **Box width and height are excluded** — those are free values and were never on a scale.

### Audit numbers and the ruling (June, 2026-08-06)

> **10px font → 11px** (331 uses; no 10px token is created). **2px radius → 4px** (90 uses; no 2px token). **Decimal fonts** — 10.5 (×66), 11.5 (×39), 12.5 (×17), 9.5 (×6), 13.5 (×3), ~131 uses — **snap to the nearest scale value.** And generally: *"match everything to the proposed values."*

### The rounding rule

> **Nearest value on the scale; ties go away from the floor** (i.e. a value exactly between two steps takes the larger). **Anything below the floor goes to the floor.**

The font floor is **11** and the radius floor is **4**. The floor rule is not a rounding case — it is the scale's own bottom, and both `9.5` and `10` and `10.5` are simply below it.

### Font — verified against `FONT_SCALE` in `tools/validate.py`

`FONT_SCALE = {11, 12, 13, 14, 16, 18, 20, 24, 30, 36}` — floor 11.

| App value | → | Reason | Uses |
|---:|---:|---|---:|
| 9.5px | **11px** | below the 11px floor → floor | 6 |
| 10px | **11px** | below the 11px floor → floor | 331 |
| 10.5px | **11px** | below the 11px floor → floor | 66 |
| 11.5px | **12px** | tie (11 and 12 are both 0.5 away) → away from the floor | 39 |
| 12.5px | **13px** | tie (12 / 13) → away from the floor | 17 |
| 13.5px | **14px** | tie (13 / 14) → away from the floor | 3 |

Total ~462 uses, all mechanical. Note that **every decimal value in the audit landed on a tie or under the floor** — there was not one genuinely "nearer one side" case — so the tie rule is doing all of the work here, which is why it is stated rather than left to `round()` (Python's `round()` is banker's rounding and would send 12.5 → 12, contradicting the ruling).

Reproduce the table:

```python
FONT_SCALE = sorted({11, 12, 13, 14, 16, 18, 20, 24, 30, 36})   # tools/validate.py
def snap(v, scale):
    if v <= scale[0]:                       # below/at the floor
        return scale[0]
    return min(scale, key=lambda s: (abs(s - v), -s))   # nearest; ties → larger
```

Because the type styles are **bundles** (size + line-height + weight together — `design.md` hard rule 2), a font-size snap is not a `font-size` edit: 11px lands on `micro` / `micro-label` (11/16, weight 600), 12px on `caption` / `label-sm` (12/18), 13px on `body-sm` / `label` / `code` (13/20), 14px on `body` / `heading-sm` (14/22). Pick the **style**, and let it carry the line-height. See `typography-tailwind-migration.md` for the Tailwind-theme fix that makes the unbundled classes stop existing.

### Radius — verified against `RADIUS_SCALE` in `tools/validate.py`

`RADIUS_SCALE = {4, 6, 8, 10, 12, 16, 20, 24, 9999}` — floor 4 (6 and 10 are the documented control-optical exceptions).

| App value | → | Reason | Uses |
|---:|---:|---|---:|
| 2px | **4px** | below the 4px floor → floor | 90 |

4px is `--sy-radius-inset` in the containment-role tier — which is usually the right *name* for a 2px corner's job (a nested chip, an inner field, a corner-anchored child). Prefer the role alias over the size name; the concentric rule still overrides both for corner-anchored children (`foundations.md` §5 / §6).

### Spacing

The same rule applies to any off-scale spacing value: `SPACE_SCALE = {0, 1, 2, 4, 6, 8, 10, 12, 16, 20, 24, 28, 32, 40, 48, 64, 80, 96, 128, 160, 192, 224, 256, 320, 384}`, floor 0, nearest with ties away from the floor. (1 remains sanctioned only as a hairline offset paired with 1px borders.)

### Not changing in the DS — **Dahye: the answer to "which DS files do I update?" is NONE**

- **No tokens were added and no scale changed.** `FONT_SCALE`, `RADIUS_SCALE` and `SPACE_SCALE` in `tools/validate.py` stay **exactly** as they are. There is no 10px font token, no 9.5, no 10.5/11.5/12.5/13.5, and no 2px radius token.
- `tokens/synapse.tokens.json` and `tokens/synapse.css` are untouched.
- **Do not wait for a token release to start this migration** — there is nothing to release. Every value in the tables above already has its target in the shipped bundle.

---

## 3. Icons (test 6) — 12/16/20/24, and above 24 it is an illustration

### Audit numbers

- **14px icons: 331 uses** — off the 12/16/20/24 scale.
- **Icons above 24px: 29 uses** at 32 / 36 / 40 / 48 / 64.

### The ruling (June, 2026-08-06)

> **14px → 12px.** And **anything above 24px is an ILLUSTRATION, not an icon** — out of the icon registry's jurisdiction.

### The mechanical procedure

1. **14 → 12** across all 331 call sites. 12 is the metadata step — status glyphs in Badges, source marks in provenance rows, and any icon paired with 11–12px text — which is what a 14px icon was almost always standing in for. It is also the floor: below 12 a 1.5px stroke on a 24-unit grid loses interior detail (`foundations.md` §8).
2. Any other off-scale size **at or below 24** (10, 11, 18) snaps the same way — nearest of {12, 16, 20, 24}, ties away from the floor.
3. **The 29 renders above 24 are re-classified, not resized.** They are illustrations. That means:
   - They leave the `icons.md` registry's jurisdiction entirely — no concept row, no closed-set check, no SY019 size error.
   - They pick up `foundations.md` **§8.1** instead, and must be brought into compliance with *it*: single-weight 1.5px stroke, achromatic (ink = `text.primary`, grey reserved for depth), at least one neutral fill and never all of them, corners follow the object, placement restricted to the closed set (EmptyState · the Guided archetype · full-page status states), one per surface, motifs governance-gated.
   - Practically: most of the 29 will be *fine as art and wrong as placement* — a 32px "icon" sitting in a table row is not an illustration that got big, it is an icon that should be 20 or 24. **Re-classification is a judgement per call site, not a blanket exemption:** if the mark is doing chrome work, shrink it onto the icon scale; if it is genuinely a hero/empty-state graphic, it is §8.1's and must meet §8.1's rules.

### This one IS a spec change (the only one in this doc)

- **`icons.md` — Hard rules** now states the size scale (12/16/20/24), that 24 is the registry's **ceiling**, and that stroke art above 24px is an illustration governed by `foundations.md` §8.1 and outside the registry's closed-set rule. The rationale is in the spec: the registry exists to make **one concept render as one glyph in UI chrome**, where recognition is instant and a second glyph for the same idea is a defect; a 48px hero mark is **compositional artwork** with different rules, and §8.1 already governs it. Off-scale sizes *at or below* 24 remain violations.
- **`foundations.md` §8** mirrors the boundary in one sentence, naming the 24px threshold.
- **`tools/check_icons.py`** — the SY019 off-scale-size check now **skips sizes above 24** (illustration, §8.1) while still erroring on off-scale sizes at or below 24. Negative-tested both directions: 14 and 18 error; 32/36/40/48/64 pass; 12/16/20/24 pass.

### Not changing in the DS

- **No new icon sizes.** The scale is still exactly 12/16/20/24; 14 was not added and 32+ was not added — the large sizes were moved to a *different tier*, which is not the same as widening the scale.
- No registry entries added or removed; `assets/icons/lucide-registry.json` `$sizes` stays `[12, 16, 20, 24]`.
- `foundations.md` §8.1 itself is unchanged — it already governed illustrations; the ruling only names where the boundary sits.

---

## 4. Shadows (test 8) — triage by role, then ring / delete / snap

### Audit numbers

| Violation form | Count |
|---|---:|
| Arbitrary `shadow-[…]` | 100 |
| Raw inline `boxShadow` (style objects) | 23 |
| Tailwind `shadow-sm` / `md` / `lg` / `xl` | 160 |

### The ruling (June, 2026-08-06 — approving Dahye's triage)

> Classify each call site by the **element's role**, then:
> - **ring** — `0 0 0 Npx`, blur 0 — is **not elevation at all**; it is a ring, which **foundations §6** already sanctions as an exception.
> - **static** — static cards, charts — **remove the shadow** per §6's borders-first rule, or promote the surface to a genuinely elevated one.
> - **floating** — menus, popovers, tooltips — **snap to `--sy-shadow-*`** (xs…xl).

*Reference correction:* Dahye's message cited "§7" for the ring exception. **Rings are §6** (Elevation & borders); §7 is Motion. Use §6.

### Decision tree

```
For each shadow call site:
│
├─ 1. MACHINE-DECIDABLE — is the blur component 0?
│     i.e. the value is `0 0 0 Npx <color>` (inset or outset), no blur, no spread-with-blur
│     └── YES → it is a RING, not elevation. foundations §6 sanctions it:
│              • inset  → a border substitute where a real border would shift layout
│              • outset → a focus ring (drawn as the 2px gap ring + the coloured 0 0 0 4px ring)
│              Convert to the ring form with a TOKEN colour at FULL strength.
│              NEVER color-mix / lighten a focus ring (deleted 2026-07-30: failed 1.4.11
│              in 11 of 12 Button cells). Do NOT map it to a --sy-shadow-* token.
│
└─ 2. Blur > 0 → it is elevation, and now the ELEMENT'S ROLE decides. Not machine-decidable:
      a human (or a component-name heuristic) answers "does this thing float above the page?"
      │
      ├─ STATIC — it sits in the flow: a card in a grid, a chart frame, a panel, a section
      │   header, a button, an input, a list row.
      │   └── DELETE the shadow. Synapse is borders-first: in-flow hierarchy is 1px borders
      │       + background steps (border.subtle inside, border.default at the boundary,
      │       border.strong on hover) — foundations §6.
      │       OR, if the element genuinely needs to read as lifted, PROMOTE the surface:
      │       Card `elevated` (shadow.xs at rest), or the hover-lift micro-treatment on
      │       interactive Cards only (translateY(−1px) + shadow.xs at `fast`).
      │       "It looked flat without it" is not a promotion; density and borders carry it.
      │
      └─ FLOATING — it is portalled / positioned above the page: menu, popover, dropdown,
          tooltip, command palette, dialog, drawer, toast, sticky bar.
          └── SNAP to the --sy-shadow-* step for that role:
                xs  resting lift    — elevated Card, sticky bars
                sm  hover/lift      — interactive Cards, draggable tiles
                md  shallow float   — menus/popovers close to the surface
                lg  standard float  — dropdowns, popovers, tooltips
                xl  deep            — dialogs, drawers
              Pick by ROLE from that list, not by matching the old blur radius.
              Remember border.overlay is part of the floating recipe (transparent in
              light — the shadow carries the edge — visible in dark).
```

**What is and is not mechanical.** Step 1 is fully decidable by machine: parse the value, and blur == 0 ⇒ ring. That alone is expected to account for a large share of the 100 arbitrary `shadow-[…]` and the 23 inline `boxShadow` objects (rings are exactly the thing people hand-write, because there was no class for them). Step 2 is **not** decidable from the value — `0 4px 12px rgba(0,0,0,.07)` on a static card and on a popover are the same string with opposite answers — so it needs the element. A good approximation is a **component-name allowlist** (`Menu`, `Popover`, `Tooltip`, `Dropdown`, `Dialog`, `Modal`, `Drawer`, `Toast`, `Palette` → floating; everything else → static-until-proven), which turns step 2 into a review of the exceptions rather than a review of all 283.

Three special cases:
- **`shadow-none`** — usually a *fix* someone applied to cancel an inherited shadow. Delete both sides: remove the source shadow, then remove the `shadow-none`.
- **`shadow-inner`** — an inset with blur. It is neither a ring (blur > 0) nor elevation (Synapse has no inset elevation). Almost always wants `bg.sunken` instead.
- **A slider/knob handle** on a track takes `--sy-shadow-thumb`, which is its own control token, not a step on the elevation scale.

### Enforcement (new, shipped in this repo)

`tooling/product-gates/check-raw-values.mjs` now flags, under **SY009** (the existing DS rule id for raw `box-shadow`):
- `shadow-{sm,md,lg,xl,2xl,inner,none}` — the Tailwind default scale;
- `shadow-[…]` — arbitrary values.

The message names the triage (ring / static / floating) so the fix is in the error, not in a doc lookup. The existing **`synapse-allow`** escape still works and still expects a harness ticket reference on the line.

`validate.py`'s SY009 continues to cover the CSS *declaration* form (`box-shadow:`) — the class form is product-side only, which is why it never fired on these 283.

**⚠ Name collision to resolve in the product's Tailwind theme.** The ruled class list is Tailwind's default `boxShadow` scale, and four of its keys (`sm`/`md`/`lg`/`xl`) are *also* Synapse's own shadow-token names. If the product theme maps `boxShadow` straight off the tokens, `shadow-lg` becomes legitimate and this rule flags it anyway. Do the **z-index move**: give the token scale names that cannot collide (e.g. `shadow-float-md`) or drop the Tailwind defaults entirely, so the raw names cease to exist. Until then, `synapse-allow` + a ticket is the documented escape. (`shadow-xs` and bare `shadow` are deliberately **not** in the ruled list and are not flagged.)

### Not changing in the DS

- **No new shadow tokens.** `--sy-shadow-{xs,sm,md,lg,xl}` plus `thumb` are the whole set; `glass` stays dormant.
- Foundations §6 is unchanged — the ring exception, the borders-first rule and the five-step scale were all already there. This ruling is an application of §6, not an amendment to it.
- `validate.py` gains no new rule; SY009 already existed and its docstring only gained a pointer to the product-side class form.

---

## 5. Motion — durations (test 9, partial)

> **Easing is NOT in scope here.** The easing half of test 9 is being handled separately by the coordinator as a proposal, because the DS's own Button spinner uses `linear` and the ruling as stated would break continuous motion. Nothing in this section touches easing.

### The ruling (June, 2026-08-06)

> `duration-500` → **300**. `duration-120` → **100**. `duration-180` → **200**.

### The scale

Four values, closed (`foundations.md` §7):

| Token | Value | Role |
|---|---:|---|
| `--sy-duration-instant` | 100ms | hover, focus |
| `--sy-duration-fast` | 150ms | dropdowns, tooltips, exits |
| `--sy-duration-base` | 200ms | modals, drawers, accordions |
| `--sy-duration-slow` | 300ms | page-level transitions, toasts |

### Mapping

| App value | → | Token | Note |
|---:|---:|---|---|
| `duration-120` | **100ms** | `--sy-duration-instant` | nearest step |
| `duration-180` | **200ms** | `--sy-duration-base` | nearest step |
| `duration-500` | **300ms** | `--sy-duration-slow` | 300 is the ceiling of the scale; there is nothing slower to snap to |

Any other off-scale `duration-<n>` snaps to the nearest of {100, 150, 200, 300}, ties away from the floor, and values above 300 clamp to 300. **Prefer picking the token by the interaction's ROLE** (the table above) over picking it by arithmetic — a 500ms toast entrance is `slow` because it is a toast, and it also happens to be the nearest step.

Also check the duration against §7's structural rules while you are in the file: exits are `fast` (leaving is quicker than arriving), no entrance exceeds one duration step, and under `prefers-reduced-motion` all non-essential motion collapses to opacity fades ≤100ms.

### Enforcement (new)

`tooling/product-gates/check-raw-values.mjs` gains **SY025**: an off-scale Tailwind `duration-<n>` class, or an arbitrary `duration-[…]`, is an error. On-scale values (`duration-100` / `150` / `200` / `300`) pass. The `synapse-allow` escape applies as everywhere else.

**SY025 is product-gate only.** The id is appended to `tools/validate.py`'s docstring rule list so it is reserved and discoverable, with an explicit note that it is *not implemented there*: the violating form is a Tailwind class, which only exists in product JSX, and this repo's own CSS already writes the `--sy-duration-*` tokens, so there is no declaration form on the DS side to lex.

The lasting fix is the same theme move used for z-index and typography: define `transitionDuration` in the product's Tailwind theme as exactly the four token values (`instant` / `fast` / `base` / `slow`) and delete the defaults, so `duration-500` stops being a class that compiles.

### Not changing in the DS

- **No new duration tokens.** Four values, closed. There is no 120, 180 or 500.
- `foundations.md` §7 is unchanged.
- **Easing tokens are untouched by this doc** — see the coordinator's proposal.

---

## Summary — what a migration engineer actually does

| Area | Automatic | Needs a human | DS change |
|---|---|---|---|
| Colors | Tailwind palette classes (118 kinds) via a lookup table | the ΔE snap list for 825 kinds (review the *list*); Tier-3 residue → proposals | **none** |
| Scales | all ~552 px call sites (fonts 462, radius 90) | pick the type *style*, not the size | **none** |
| Icons | 14 → 12 (331) and any off-scale ≤24 | the 29 above 24: shrink to the scale, or bring under §8.1 | `icons.md` + `foundations.md` §8 wording; `check_icons.py` exemption |
| Shadows | blur == 0 ⇒ ring (machine-decidable) | static vs floating (283 sites; component-name allowlist gets most of it) | product gate SY009 |
| Durations | 120/180/500 → 100/200/300 | confirm the role matches the step | product gate SY025 |
| **Easing** | — | — | **open — separate proposal, do not migrate** |
