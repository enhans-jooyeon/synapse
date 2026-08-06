# Icon migration — 14 → 12, and above 24px it is an illustration

**For the product-repo migration (ruled by June, 2026-08-06 — migration audit test 6; contract: `icons.md` Hard rules, `foundations.md` §8 / §8.1, gate SY019).** Written for the **331 renders at 14px** and the **29 renders above 24px** (32 / 36 / 40 / 48 / 64) the audit found in the product app.

Two rulings in one, and they point in opposite directions: 14px is an icon drawn off the scale (**fix it**), while 48px is not an icon at all (**re-classify it**). Getting the second one wrong by "just snapping it to 24" is the main hazard in this area.

## Why this is a rule

The icon scale is **12 / 16 / 20 / 24, and no other sizes** (`foundations.md` §8). Two separate contract facts do the work:

- **12 is the floor, and it is a drawing constraint.** Every Synapse icon is a Lucide glyph on a 24-unit grid with the stroke down-weighted to **1.5px**. Below 12, that stroke on that grid *loses its interior detail and the glyph reads as a smudge* — which is why 10 and 11 are excluded rather than merely discouraged (`foundations.md` §8). 14 and 18 are not below the floor, but they are off the scale: they land between steps where nothing in the system pairs with them.
- **24 is the registry's CEILING, and that is a jurisdiction, not a size limit** (`icons.md` Hard rules, ruled 2026-08-06). The registry exists to make **one concept render as one glyph in UI chrome** — a 16px mark in a row, a 20px mark in navigation — where recognition is instant and any second glyph for the same idea is a defect. A 48px hero mark is not chrome; it is **compositional artwork** with different rules (motif sets, at-least-one-neutral-fill, depth layers, a closed placement set), and `foundations.md` §8.1 already governs it. Forcing that artwork through a concept→glyph table would either freeze illustration into the icon vocabulary or push the icon scale up to sizes where a 1.5px stroke on a 24-unit grid is no longer the point.

Why 12 is the target for the 331: **12 is the metadata step** — status glyphs inside Badges, source-type marks in provenance rows, and any icon paired with 11–12px text. That is what a 14px icon was almost always standing in for. (Corollary from the same section: a 24px `xs` Button cannot carry a 16px icon without swallowing the control, so `xs` icons take 12 as well.)

## The real fix: a type union, because **no `tailwind.config` fix exists for this one**

**Do not go looking for a theme key.** Every other area in this audit is fixed by deleting classes in `tailwind.config` — but an icon size is a **component prop** (`size={14}`), not a utility class, so there is no theme entry that can make it unexpressible. The registry is the config: `assets/icons/lucide-registry.json` carries `$sizes: [12, 16, 20, 24]`, which the gate reads.

The equivalent move for a prop is the **type system**: expose icons through one component whose size prop is the closed union, sourced from the registry, so the wrong value fails to typecheck instead of failing to compile.

```ts
// product-side icon wrapper — the size is a union, not a number
type IconSize = 12 | 16 | 20 | 24;          // = lucide-registry.json $sizes
export function Icon({ name, size = 20 }: { name: IconName; size?: IconSize }) { … }
```

`size={14}` then fails to typecheck, and `size={48}` fails too — which is correct, because a 48px mark should not be going through the icon component at all.

## Decision tree per call site

```
For each icon render:
│
├─ Is the rendered size ABOVE 24px?
│   └── YES → this is NOT an icon-scale problem. Decide what the mark actually is:
│       ├── It is doing CHROME work — a mark in a table row, a toolbar, a nav item,
│       │   a button, a list row, a card header.
│       │   └── It is an icon that got big. SHRINK it onto the scale (usually 20 or 24).
│       │       This is the common case: most of the 29 are "fine as art, wrong as placement".
│       └── It is genuinely a HERO / EMPTY-STATE graphic.
│           └── It is an ILLUSTRATION. It leaves the icons.md registry's jurisdiction
│               entirely — no concept row, no closed-set check, no SY019 size error —
│               and it must now MEET foundations §8.1 instead:
│                 · single-weight 1.5px stroke
│                 · achromatic (ink = text.primary; grey reserved for depth)
│                 · at least one visible neutral fill, and never all shapes filled
│                 · corners follow the object
│                 · placement in the CLOSED set only: EmptyState · the Guided archetype
│                   (patterns.md §1) · full-page status states. One per surface.
│                 · FORBIDDEN in dense/data surfaces, repeated grids, nav chrome, inline content
│                 · motifs are governance-gated
│               Re-classification is a JUDGEMENT PER CALL SITE, never a blanket exemption.
│
└─ NO — the size is at or below 24
    ├── Is it 12 / 16 / 20 / 24? → compliant, leave it.
    ├── Off-scale (10, 11, 14, 18) → snap to the nearest of {12, 16, 20, 24}, ties away
    │   from the floor. 14 → 12 (the metadata step). Then check the pairing: a 12px icon
    │   belongs beside 11–12px text; if the neighbouring text is body 14, the icon is
    │   probably 16 and the 14 was hiding a mismatched pair.
    └── The CONCEPT has no glyph in the registry, or the placement genuinely needs a size
        the scale lacks → file a proposal (design.md §6), never a local override and never
        an unlisted Lucide/Tabler name. A new concept row and a new step are both governance.
```

## Audit numbers

| Finding | Uses | Ruling |
|---|---:|---|
| **14px icons** — off the 12/16/20/24 scale | 331 | **→ 12px**, mechanically, across all call sites |
| **Icons above 24px** — 32 / 36 / 40 / 48 / 64 | 29 | **re-classified, not resized**: illustration (§8.1) or shrink to the scale |
| Other off-scale ≤ 24 (10, 11, 18) | — | snap to the nearest of {12, 16, 20, 24} |

June's ruling in her own terms: **14px → 12px**, and **anything above 24px is an ILLUSTRATION, not an icon** — out of the icon registry's jurisdiction.

## Enforcement

- DS repo — `tools/check_icons.py`: **SY019** errors on an off-scale icon size **at or below 24** (`ICON_CEILING = max($sizes)`) and, since the 2026-08-06 relaxation, **skips sizes above 24** (illustration, `foundations.md` §8.1). Negative-tested both directions: 14 and 18 error; 32 / 36 / 40 / 48 / 64 pass; 12 / 16 / 20 / 24 pass. SY019 also flags an unlisted glyph and a bare primitive inside a 24-grid `svg`. The relaxation is **not** a widening of the scale — the large renders moved to a *different tier*.
- Product repo — **there is no gate rule ID for this area**, and that is structural: `tooling/product-gates/check-raw-values.mjs` scans class strings and CSS, and an icon size is a prop. The product-side rule is the `IconSize` union above, enforced by `tsc`. Run `tools/check_icons.py` over rendered product HTML if you want the DS check on the way out.
- The **`synapse-allow`** marker remains the documented escape hatch and must carry a harness ticket reference on the line.
- Precedent: the same scope-it-elsewhere move (not a token, not a widening) closed continuous motion the same day — `migration/motion-durations.md`.

## What changed in the DS — this area is the audit's ONE spec change

- **`icons.md` Hard rules** now state the 12/16/20/24 scale, that **24 is the registry's ceiling**, and that stroke art above 24px is an illustration governed by `foundations.md` §8.1 and outside the registry's closed-set rule. `foundations.md` §8 mirrors the boundary in one sentence naming the 24px threshold. `tools/check_icons.py` honours it.
- **No new icon sizes.** The scale is still exactly 12 / 16 / 20 / 24 — 14 was not added, 32+ was not added.
- No registry entries added or removed; `assets/icons/lucide-registry.json` `$sizes` stays `[12, 16, 20, 24]`.
- `foundations.md` §8.1 itself is unchanged — it already governed illustrations; the ruling only names where the boundary sits.
