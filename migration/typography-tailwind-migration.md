# Typography migration — Tailwind `leading-*` / `tracking-*` → type styles

**For the product-repo migration (2026-08-06, engineer's finding: 71 arbitrary `leading-[…]` + ~353 `tracking-*` slipping past SY007/SY010, which lex CSS declarations and never saw the class form).** Gate coverage is now closed on both sides; this doc is the *how* for the ~424 call sites.

## Why these classes are errors, not warnings

Typography in Synapse is a **bundle, not three properties.** `design.md` hard rule 2: *"Typography is set only through the typography styles (`.sy-type-*`)."* A style fixes size + line-height + weight together, plus the one sanctioned tracking (`heading-xl`, Latin-only). So `leading-*`/`tracking-*` are not off-scale-value problems — they are **unbundling** problems, and two of them are bilingual hazards:

- **`leading-*`** — the paired line-height is a **floor** that accommodates Hangul ascent/descent (`foundations` §2.3.3: *"Line heights are floors… NEVER tighten. Custom `line-height < 1.4` on body text is forbidden."*). `leading-tight` is 1.25 — below the floor by construction, before anyone measures anything.
- **`tracking-*`** — letter-spacing must never reach Hangul. Tailwind classes are unscoped, so `tracking-wider` on a bilingual string is a defect in KO and invisible in EN review.

## The real fix: delete the classes in the theme

Same move that worked for z-index — make the wrong thing unexpressible, and leave the gate as the backstop for what a theme can't delete.

```js
// tailwind.config — typography becomes bundles; the override classes cease to exist
theme: {
  // 1. Every type style as a full bundle. `text-body` now sets size + line-height + weight.
  fontSize: {
    'display-xl': ['44px', { lineHeight: '56px', fontWeight: '700' }],
    'display': ['36px', { lineHeight: '48px', fontWeight: '600' }],
    'display-sm': ['30px', { lineHeight: '40px', fontWeight: '600' }],
    'heading-xl': ['24px', { lineHeight: '34px', fontWeight: '700', letterSpacing: '-0.01em' }],
    'heading-lg': ['18px', { lineHeight: '27px', fontWeight: '600' }],
    'heading-md': ['16px', { lineHeight: '24px', fontWeight: '600' }],
    'heading-sm': ['14px', { lineHeight: '22px', fontWeight: '600' }],
    'body-lg': ['16px', { lineHeight: '24px', fontWeight: '400' }],
    'body': ['14px', { lineHeight: '22px', fontWeight: '400' }],
    'body-sm': ['13px', { lineHeight: '20px', fontWeight: '400' }],
    'label': ['13px', { lineHeight: '20px', fontWeight: '500' }],
    'label-sm': ['12px', { lineHeight: '18px', fontWeight: '500' }],
    'caption': ['12px', { lineHeight: '18px', fontWeight: '400' }],
    'micro': ['11px', { lineHeight: '16px', fontWeight: '600' }],
    'micro-label': ['11px', { lineHeight: '16px', fontWeight: '600' }],
    'code': ['13px', { lineHeight: '20px', fontWeight: '400' }],
    'code-sm': ['12px', { lineHeight: '18px', fontWeight: '400' }],
    'stat-lg': ['30px', { lineHeight: '40px', fontWeight: '600' }],
    'stat': ['24px', { lineHeight: '34px', fontWeight: '600' }],
    'stat-sm': ['20px', { lineHeight: '30px', fontWeight: '600' }],
  },
  // 2. No `leading-*`, no `tracking-*` classes at all. Unbundling becomes unexpressible.
  lineHeight: {},
  letterSpacing: {},
}
```

After this, `text-body` / `text-heading-md` / `text-micro-label` carry the whole decision, and the ~424 call sites collapse to "pick the right style."

## Migration decision tree

```
For each leading-* / tracking-* call site:
├── Is it paired with a text-* size class? → replace BOTH with the one type-style class
│   whose size matches (see the table in the config above)
├── Is it setting line-height alone on inherited text? → delete it; the inherited style's
│   line-height is the floor and was chosen deliberately
├── Is it tracking on an ALL-CAPS Latin label? → that is `micro-label` (11/16, weight 600) —
│   use the style; do not re-add tracking (and note text-transform: uppercase is SY006-forbidden)
└── Genuinely needs a value no style provides? → that is a DS gap: file a proposal
    (design.md §6), do not add a local override
```

## Enforcement (shipped)

- Product gate `tooling/product-gates/check-raw-values.mjs`: **SY007** flags any `tracking-*` (named or arbitrary), **SY010** flags any `leading-*`. Where an arbitrary `leading-[Npx]` sits beside a `text-[Npx]` on the same line, the message computes the ratio and says whether it breaches the 1.4 floor.
- DS repo `tools/validate.py`: SY007/SY010 continue to cover the CSS-declaration form (`letter-spacing:` / `line-height:`), with SY007 suppressed where a file carries the sanctioned `:lang(ko) { letter-spacing: 0 }` reset.
- The `synapse-allow` marker remains the documented escape hatch and should carry a harness ticket reference.
