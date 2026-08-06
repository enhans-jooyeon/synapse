# Color migration — off-token colors → nearest `--sy-*` token, by semantic role

**For the product-repo migration (ruled by June, 2026-08-06 — migration audit test 3; contract: `design.md` hard rule 1, `foundations.md` §1; gates SY001 raw literal + SY002 arbitrary value).** The audit found **980 distinct color kinds / 5,528 uses** in the product app, of which **943 kinds / 3,529 uses are off-token**: 117 Tailwind **v3** palette kinds (1,098 uses), 1 **v4** kind (2 uses), 243 hardcoded near-greys (1,115 uses), 582 genuinely arbitrary values (1,314 uses). Only **37 kinds / 1,983 uses** already resolve to a token. Those five pairs are what a conversion script's coverage report must add up to.

The headline: **582 arbitrary colors are not 582 proposals.** June's ruling — *"only pull out separately the ones that have truly nothing similar"* — makes this a mechanical pass with a small escalation tail.

## Why a raw color is an error, not a warning

`design.md` hard rule 1: *"NEVER use a raw color value. Only `--sy-*` semantic tokens. If the color you need has no token, you are designing outside the system — stop and escalate."*

The reason is not tidiness — it is that Synapse colors carry **jurisdiction**, not just value (`foundations.md` §1.1: *"Three families, three jurisdictions"*). Functional **indigo** `blue.600 #3155C6` owns `text.link` / `border.focus` / `status.info`; brand/AI **azure** `azure.500 #0073E6` owns `action.brand-*` / `ai.solid`; the achromatic **graphite point** owns `brand.point` — brand-identity objects only. The split is absolute: *"never use azure for a link or indigo for a CTA fill."* A hex value carries none of that, so a raw color is simultaneously (a) unverifiable for contrast — the token pairs are pre-verified and novel pairings are forbidden, (b) invisible to dark mode, since a literal cannot invert, and (c) semantically mute: the next redesign has no way to know a muted red *meant* "error".

That third point is what drives the hard constraint below. Snapping recovers the value; only the role recovers the meaning.

## The real fix: replace the palette in the theme, don't extend it

Same move as z-index and typography — make the wrong thing unexpressible, and leave the gate as the backstop.

```js
// tailwind.config — colors come from tokens, and NOTHING else exists.
// NOTE: tooling/product-gates/tailwind.synapse.cjs ships `spacing`, `borderRadius` and
// `boxShadow` wired to tokens; `colors` is still a TODO comment there. This is that entry.
const t = require('@enhans-jooyeon/synapse/tokens/synapse.tokens.json');

theme: {
  // REPLACE (not extend). Tailwind's 22 palette families cease to be classes, so
  // `text-slate-500` / `bg-zinc-200` stop compiling the moment this lands.
  colors: semanticColorsFromTokens(t),   // → text-primary, bg-surface, border-default, status-danger, …
}
```

A theme cannot delete bracket syntax, so the palette replacement kills the *named* classes only. `bg-[#4f46e5]` dies from the second half of the preset — the arbitrary-value ban, which today is enforced by `tooling/product-gates/check-raw-values.mjs` (SY002), not by the preset's `corePlugins` block (that block is a documented no-op). Land both, and the only expressible colors are tokens.

## The three-tier policy

**Tier 1 — Tailwind palette classes → a deterministic table. Fully automatic.**
The 117 v3 kinds + 1 v4 kind are a *closed, known* input set: `{gray,slate,zinc,neutral,stone,red,blue,…}-{50…950}` in a `text-` / `bg-` / `border-` / `ring-` / `divide-` position. Build a lookup keyed on **(palette family, step, CSS position)** → `--sy-*` semantic token, once, and codemod it. The position supplies the semantic role for free: `text-slate-500` is a text role, `border-zinc-200` a border role. The neutral families all collapse onto the one Synapse neutral ramp; hued families go to their status/brand counterparts. No human is in this loop — a wrong row is fixed once, in the table.

**Tier 2 — near-greys and arbitrary values → nearest-token snap. Semi-automatic.**
The 243 near-greys and 582 arbitrary kinds (825 kinds, 2,429 uses) go through the snapper below. It emits one proposed token per *kind*; a human reviews **the list, not the pixels**. Expect the near-greys to be near-unanimous (they are all trying to be one of five neutrals) and the arbitrary set to split into a large obvious majority plus a small residue.

**Tier 3 — genuinely unmatched → escalate individually.**
Only the residue — a value with **truly nothing similar** in the resolved token set *for its role* — leaves the mechanical path and becomes a normal proposal (`design.md` §6), one per color, with its call sites attached. This is the tail June carved out; count it in the tens, not the hundreds. **Tier 3 is the only route by which this audit can add a color token, and none has been ruled in yet.**

## How the snapping works

1. **Resolve the token set first, per mode.** Resolve every semantic color in `tokens/synapse.tokens.json` / `tokens/synapse.css` to a concrete sRGB value **once for light and once for dark** — two separate target sets. A value snapping to `--sy-bg-surface` must be checked against light's `bg.surface` *and* dark's, because the ramps are not parallel and a snap that is right in light can be visibly wrong in dark.
2. **Score with ΔE in CIELAB** (CIEDE2000; ΔE76 is acceptable for a first pass but reports misleading distances in the near-neutral region, which is exactly where this migration lives). Take the minimum-ΔE token *within the candidate role set* from step 4.
3. **Do NOT use naive hex/RGB distance.** The system's greys are deliberately close together (`gray.50 / 100 / 150 / 175 / 200 / 300 …`, including two half-steps) and Euclidean RGB distance is not perceptually uniform, so it mis-picks **across the ramp** — one step too light or too dark, because the numeric gap between adjacent neutrals is smaller than the perceptual gap the eye reads. Near-greys are 32% of the off-token uses (1,115 of 3,529); getting the ramp step wrong on them is the single largest way this migration produces a visually wrong app that passes the gate.
4. **A snap MUST preserve the SEMANTIC role — this comes before distance.**
   - Determine the role from how the value is *used* — status, brand/AI accent, text, icon, background/surface, border — not from what it looks like.
   - Snap **only within that role's token family**: a status color → `--sy-status-*` / `--sy-icon-{success,warning,danger,info}`; a border → `--sy-border-*`; a surface → `--sy-bg-*`; body text → `--sy-text-*`.
   - **A color used as a status must snap to a status token, never merely to the nearest value.** A muted red on an error row snaps to `--sy-status-danger` even when some `viz` or brand hue sits closer in ΔE. Losing the role is worse than losing a few ΔE units: the value drifts back on the next redesign and the semantics never come back.
   - Where the role is genuinely undecidable from the call site, the kind goes to human review — that is a *role* question, not a Tier-3 escalation (the color may match fine).
5. **Report ΔE with every proposed snap** and set a review threshold. Snaps under a small ΔE are rubber-stamped in bulk; the ones above it are the review queue and the source of the Tier-3 residue.
6. **Re-check contrast after snapping; do not assume it.** A snap changes a measured pair. Text/background and non-text pairs must still clear their floors (4.5:1 / 3:1; the documented chart-policy 2.5:1 where it applies) in **both** modes. `validate.py tokens` gates the DS's own pairs; a product-side pair the DS never declared is the product's to verify.

## Decision tree per call site

```
For each off-token color:
├── Is it a Tailwind palette class (family-step in a text/bg/border/ring/divide position)?
│   └── YES → TIER 1: apply the (family, step, position) table row. Automatic, no review.
└── NO (hex / rgb() / hsl() / arbitrary bracket value) →
    ├── Can you name the SEMANTIC ROLE from the call site
    │   (status · brand-AI accent · text · icon · surface · border)?
    │   ├── NO  → role review queue. Do not snap on looks alone.
    │   └── YES → TIER 2: snap to the minimum-ΔE token WITHIN that role's family,
    │             checked in BOTH modes; record the ΔE.
    │             ├── ΔE under the review threshold → bulk rubber-stamp
    │             └── ΔE above it → review queue
    └── The role's family genuinely has nothing similar — it needs a value the system lacks
        └── TIER 3: file a proposal (design.md §6), one per color, call sites attached.
            NEVER a local override, and never snap across roles to make it fit.
```

## Audit numbers

| Class of value | Kinds | Uses | Share of kinds |
|---|---:|---:|---:|
| Already mappable to a `--sy-*` token | 37 | 1,983 | 4% |
| Tailwind **v3** palette classes (`slate-500`, `zinc-200`, …) | 117 | 1,098 | 12% |
| Tailwind **v4** palette classes | 1 | 2 | <1% |
| Hardcoded near-greys | 243 | 1,115 | 25% |
| Genuinely arbitrary colors | 582 | 1,314 | 59% |
| **Total distinct kinds** | **980** | **5,528** | |

The shares are of **kinds** (denominator 980), which is the number that matters for automation: 59% of the distinct colors in the app are one-off values, and hand-reviewing 582 of them is not a migration plan — which is why the ruling is a snapper plus an escalation tail.

## Enforcement

- Product repo — `tooling/product-gates/check-raw-values.mjs`: **SY001** flags any raw hex and any raw `rgb()` / `hsl()` literal; **SY002** flags Tailwind arbitrary values, which is where `bg-[#4f46e5]` is caught. Wire it into product CI. (Palette *classes* — `text-slate-500` — are killed by the theme replacement above, not by a lint rule: they are legal Tailwind until the palette stops existing.)
- DS repo — `tools/validate.py`: **SY001** covers the CSS-declaration form and has since before this audit; `validate.py tokens` verifies the DS's own contrast pairs in both modes.
- The **`synapse-allow`** marker remains the documented escape hatch and must carry a harness ticket reference on the line. It is for a *scheduled* fix, not a decision.
- Precedent worth citing: the same delete-the-wrong-thing move on z-index (`migration/z-index-migration.md`) found and fixed 3 errors + 4 missing isolations in this repo's own render on day one — the theme replacement is what makes the gate cheap to keep.

## Not changing in the DS

- **No new color tokens.** Not for the near-greys, not for the 582. The palette is closed; Tier 3 is the only door and it is a proposal, not a batch.
- `tokens/synapse.tokens.json` and `tokens/synapse.css` are **untouched** by this ruling — do not wait for a token release to start.
- No change to SY001's severity or scope; raw color was already an error on both sides.
