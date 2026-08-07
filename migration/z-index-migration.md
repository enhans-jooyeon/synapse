# z-index migration guide — Tailwind numbers → the Synapse z contract

**For the product-repo migration (2026-08-05, ratified ruling — foundations §6, gate SY023).** Written for the ~250 Tailwind default z classes and 8 `z-9999`-class values found in the migration test.

## The rule (two vocabularies, split by element class)

1. **Floating/pinned layers** — anything that orders against *page-level* chrome (sticky headers/toolbars, dropdowns/popovers/palettes, drawers, modals, toasts, tooltips) — take exactly one token:
   `--sy-z-sticky` 100 · `--sy-z-dropdown` 200 · `--sy-z-drawer` 300 · `--sy-z-modal` 400 · `--sy-z-toast` 500 · `--sy-z-tooltip` 600
2. **Local sibling ordering** — elements ordering only against siblings *inside one component* (an overlap stack, a hover-raised card, a drag handle above its track) — use integers **−1 to 2**, and the component root MUST create an isolated stacking context: `isolation: isolate`. This is what makes local values structurally unable to fight the page scale.
3. Nothing else is sanctioned. A local value that "needs" 3+ is doing layer work — it belongs on the token scale (or reveals a missing layer role → proposal, not a bigger number).

## Decision tree per call site

```
Does this element order against page-level chrome (or escape its component via a portal)?
├── YES → replace with the matching token class (see Tailwind mapping below)
└── NO (siblings only) →
    ├── value fits −1..2 → keep/renumber to 0/1/2, add `isolation: isolate` to the component root
    └── value "needs" more → it is layer work: token, or file a proposal for a missing layer
```

The 8 × `z-9999`: all are case 1 by definition — map each to its real layer (usually toast or tooltip; a 9999 that "had" to beat a modal is `--sy-z-toast`).

## Tailwind theme mapping (do this once; engineers never type numbers again)

**Tailwind v3** — replace the `zIndex` scale, and the wrong classes stop compiling.

```js
// tailwind.config — z scale becomes the contract
theme: { zIndex: {
  0: '0', 1: '1', 2: '2',                       // local ordering only (requires isolation on the root)
  sticky:  'var(--sy-z-sticky)',  dropdown: 'var(--sy-z-dropdown)',
  drawer:  'var(--sy-z-drawer)',  modal:    'var(--sy-z-modal)',
  toast:   'var(--sy-z-toast)',   tooltip:  'var(--sy-z-tooltip)',
}}
```

With this in place, `z-10`…`z-50`/`z-9999` no longer exist as classes, `z-sticky`…`z-tooltip` carry the tokens, and `z-0/1/2` remain for local ordering.

**Tailwind v4** — *there is no equivalent.* v4 has **no `--z-index-*` theme namespace**: `z-<n>` is a bare-value utility resolved arithmetically, so there is no scale to replace and `z-9999` compiles no matter what the theme says. The named roles must be **minted** with `@utility` instead (variants like `lg:z-drawer` still work):

```css
/* tooling/product-gates/tailwind.synapse.v4.css — the complete preset; this is its z half */
@utility z-sticky   { z-index: var(--sy-z-sticky);   }
@utility z-dropdown { z-index: var(--sy-z-dropdown); }
@utility z-drawer   { z-index: var(--sy-z-drawer);   }
@utility z-modal    { z-index: var(--sy-z-modal);    }
@utility z-toast    { z-index: var(--sy-z-toast);    }
@utility z-tooltip  { z-index: var(--sy-z-tooltip);  }
```

`z-0/1/2` are already bare values, so local ordering needs nothing. **The consequence to plan for: on v4 the theme cannot make `z-10` unexpressible, so `tooling/product-gates/check-raw-values.mjs` (SY023) is not a backstop — it is the only enforcement.** Wire it into CI *before* the conversion, not after. (`z-(--sy-z-modal)` is v4 shorthand for `z-[var(--sy-z-modal)]`, but it is an arbitrary value and trips SY002 — use the named utilities.)

## Enforcement (already shipped in this repo)

- DS repo: `tools/validate.py` **SY023** — z-index literals outside −1..2 error; local literals warn unless the file carries `isolation: isolate`; tokens always pass.
- Product repo: `tooling/product-gates/check-raw-values.mjs` flags `z-10`+ and `z-9999` classes (SY023) — wire it into product CI. **Mandatory on Tailwind v4**, where no theme change can delete those classes.
- Presets: `tooling/product-gates/tailwind.synapse.cjs` (v3) and `tooling/product-gates/tailwind.synapse.v4.css` (v4) ship both forms wired to the tokens — take the whole preset rather than pasting the snippet above.
- Precedent: applying SY023 to this repo's own render found and fixed 3 errors + 4 missing isolations on day one (two dropdowns and two sticky headers typed as `20`/`2`; media-fan and split-panel local stacks lacked isolation).
