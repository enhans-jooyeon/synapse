# Distributing Synapse to the team

How the harness reaches the people who use it, what state each piece is in, and the order to ship it. Companion to `docs/process/디자인-리뷰-프로토콜.md` (the process doctrine) and `design.md` (the contract).

## It is not one package — it is five artifacts

The failure mode is treating "distribute Synapse" as shipping one thing. It is five, each with a different consumer and channel.

| Artifact | Consumer | Channel | Status |
|---|---|---|---|
| Doctrine / specs (`design.md`, `synapse.manifest.json`, tokens, `*.md`) | AI generation tools + humans | This git repo (source of truth) + tool adapters | **Ready** (v6.62.0) |
| Component library `@enhans/synapse` (React + tokens) | The product codebase | Versioned **npm package** | **Seed only** — 4 of 52 components; not published |
| The gates | CI in the **product** repo | `tooling/product-gates/` drop-in | **Provided, not wired** |
| Process docs (protocol, PRD template, PR template) | The team | In-repo (`docs/process/`, `.github/`) | **Ready** |
| Docs hub (`preview.html`) | Humans browsing | Vercel | **Ready** (already deployed) |

## The load-bearing gap

The protocol's entire model is "**CI enforces, humans don't**" (§2). That requires two things that do not exist yet:

1. **An installable `@enhans/synapse`** — the `storybook/` workspace is `private: true`, was version-drifted (fixed to 6.62.0), and implements Button · Badge · Input · Card only. You cannot ship a design system that implements 4 of 52 components. Until the library is built out, authors have little to import and the "component provenance" gate (§6) has nothing to check against.
2. **Product-repo gates** — the protocol §6 gates are a JS/TS stack (Tailwind arbitrary-value ban, ESLint `no-restricted-syntax`, CVA/TS variant typing, Storybook coverage, axe). `tools/validate.py` is a *Python* linter for HTML/CSS strings; it enforces this repo's own artifacts and **cannot enforce a React product repo.** The JS equivalents are scaffolded in `tooling/product-gates/` but must be installed in the product repo's CI.

**Consequence:** the team can *read and adopt the system today*; they cannot yet *generate production UI under enforcement*. Distributing before the gate exists hands out the guidebook and calls it a guardrail — which §2 explicitly warns against ("읽었다 ≠ 준수했다").

## Tool freedom

The protocol promises authors use any generation tool. Keep the doctrine **tool-agnostic**: `synapse.manifest.json` (load-first index) + the specs + the PRD-template-as-prompt is the lowest common denominator every tool consumes. Add thin per-tool adapters (a Claude skill/plugin, a Cursor `.cursorrules`) **only after the team converges on a tool** — each just points at the same manifest, and committing early locks in a choice the team hasn't made.

## Sequence (critical path — do in order, not in parallel)

1. **Build out the component library** toward manifest parity (or at least the Sample-pages dependency chain: Table, Sidebar, Chip, Avatar, SegmentedControl, Tabs, DescriptionList, AgentStep, ProposalCard, Composer). Without importable components, nothing downstream is real.
2. **Publish `@enhans/synapse`** to your npm registry (see `storybook/PUBLISHING.md`). Version in lockstep with the design-system version.
3. **Wire `tooling/product-gates/` into the product repo CI** — highest-leverage step; until this runs, "distribution" is just sharing docs. Same repo as product code (protocol §5-1 anti-drift), never a separate repo.
4. **Land the process docs + PR template in the product repo** (they already self-specify their locations).
5. **Pilot one real screen** — one PM-engineer pair, one full PRD → generate → gate → review loop — before team-wide rollout. Protocol §11 is a pre-mortem; run one live case to see which failure modes actually bite.
6. **Broaden** distribution and add per-tool adapters as the team settles on tooling.

## What requires your credentials / environment (I cannot do these)

- **Push this repo** — commands in `HANDOFF.md`. This working copy has no `.git`; commit from your actual clone.
- **`npm publish @enhans/synapse`** — needs npm auth and a built library; scaffold + checklist in `storybook/PUBLISHING.md`.
- **Wire CI in the product repo** — the product repo isn't part of this workspace; copy `tooling/product-gates/` in and enable it there.
- **Vercel** — already deployed; redeploys on push.

## Bilingual note

The specs are bilingual with EN authoritative. The process docs (`docs/process/`) are currently Korean-only. Decide whether the process layer stays KO-only or matches the EN-authoritative rule; if the latter, they need EN sources + `.ko.md` partners like the specs.
