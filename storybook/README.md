# Synapse — React + Storybook workspace

The specs one directory up (`design.md`, `components.md`, `synapse.manifest.json`, …) are the
contract. This workspace renders it. When code and spec disagree, the spec wins and the code
is a bug (design.md §1 authority order).

## Run

```bash
cd storybook
npm install
npm run storybook   # http://localhost:6006
npm run gate        # spec gate: tokens + UI lint + manifest sync (python3 required)
npm run typecheck
```

## Conventions (read before adding a component)

1. **One component per manifest entry**, named exactly after its `components.md` heading.
   Check `synapse.manifest.json` for the closed variant/size/rule lists — props mirror them 1:1.
2. **Spec-first**: no component lands here before its spec exists (the one-way door rule).
   Jurisdiction notes travel into JSDoc so misuse is visible at the call site.
3. **Tokens only**: components import nothing but `../../tokens/synapse.css` variables.
   Raw values fail `npm run gate`.
4. **Stories mirror the manifest**: a Playground story with controls + one story per
   closed list (variants, states, sizes) + KO samples with `lang="ko"` — both locales always.
5. **Toolbar globals** (theme × density × locale) come from `.storybook/preview.tsx` —
   never hardcode `data-theme`/`data-density` inside a story.
6. **Radix policy**: behavior-heavy components (Dialog, Popover, Tooltip, Tabs, Checkbox)
   wrap Radix primitives — the focus-management spec (foundations §8) is what Radix ships
   tested. Simple components stay dependency-free. Decided per-component; reversible.

## Seed set

Button · Badge · Input · Card — the reference implementations that encode these conventions.
Build the remaining 46 entries by copying their shape. Suggested order: the Sample-pages
dependency chain first (Table, Sidebar, Chip, Avatar, SegmentedControl, DatePicker, Tabs,
DescriptionList, AgentStep, ProposalCard, Composer), then the rest of the manifest.
