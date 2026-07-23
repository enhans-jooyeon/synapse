# Synapse — design system for AgentOS

**Version 1.0.0 · Enhans · This file is the entry point. Read it before generating any UI.**

Synapse is the design system for AgentOS, Enhans' enterprise AI work platform. It is built to be operated primarily by AI agents on behalf of non-designers, which means it is written as a *contract*, not an inspiration board: closed sets, enumerated options, explicit decision rules. An agent following this file mechanically should produce UI indistinguishable from designer-made AgentOS screens.

## 1. File map — canonical order of authority

| File | Contains | Authority |
|---|---|---|
| `design.md` (this file) | contract, hard rules, workflow, governance | Highest — overrides everything |
| `tokens/synapse.tokens.json` | canonical token values (DTCG) | Source of truth for all values |
| `tokens/synapse.css` | generated CSS custom properties | Implementation artifact — regenerate from JSON, never hand-edit values |
| `foundations.md` | color, type, spacing, sizing, elevation, motion, a11y — the *why* and usage rules | Governs token usage |
| `components.md` | the closed set of components (52 entries) | Governs all UI structure |
| `recipes.md` | preset multi-component assemblies (headers, stat grids, filter bars, footers) | Governs recurring compositions — use before composing from scratch |
| `patterns.md` | page archetypes, layout, forms, feedback, bilingual patterns | Governs composition |
| `ai-patterns.md` | agent interaction conventions: streaming, steps, approval, provenance, uncertainty, failure | Governs every AI surface |
| `content.md` | voice, KO/EN terminology glossary (closed), register, error catalog, formats | Governs all UI text |
| `preview.html` | living render of the system in light + dark | Reference only, not authority |
| `icons.md` | closed concept→icon registry — unlisted concepts get no icon | Governs all iconography |
| `synapse.manifest.json` | machine-readable index of the entire system (built by `tools/build_manifest.py`, never hand-edited) | Agents load this first; prose specs remain authoritative |
| `tools/screen-intent.schema.json` | the declaration an agent completes before generating a screen | Gate input |
| `tools/validate.py` | mechanized contract checks: `tokens`, `ui` (SY001–014), `page` (SY100–109 intent validation) | Enforcement gate |

Figma and any other design-tool representation of Synapse are **generated views** of these files, never sources of truth. If Figma and this repo disagree, the repo wins and Figma must be resynced.

## 2. Identity in one paragraph

Neutral, black-key, borders-first, engineered restraint. The UI is built from a cool-gray ramp; black (white in dark mode) is the brand action color; AI surfaces and marks are slate; the **point color** `#0621C4` is the one vivid accent, restricted to brand-identity objects and AI emphasis (conversational-AI CTAs + active AI running states); functional blue `#3155C6` stays the quiet signal for focus rings, links, and informational status; status colors are desaturated and semantic-only. Pretendard serves Korean and English equally as the sole UI face; Artific (display family) appears at most once per screen, only at brand moments, and only on English copy — KO locale keeps Artific titles in English; JetBrains Mono marks machine-significant text. Density is a per-region option: `dense` compacts controls, spacing, and table rows (not type) for data-heavy surfaces, `focus` is the default; archetypes recommend one but it is not enforced.

## 3. Hard rules (the agent contract)

These are absolute. Violating any of these means the output is wrong regardless of how good it looks.

**Values**
1. NEVER use a raw color value. Only `--sy-*` semantic tokens. If the color you need has no token, you are designing outside the system — stop and escalate.
2. NEVER use an off-scale spacing, radius, or font-size value. The scales in the token file are exhaustive. Typography is set only through the typography styles (foundations §2.2 / `.sy-type-*`).
3. NEVER introduce a font family beyond the three defined (`sans`, `display`, `mono`), a weight outside 400/500/600/700, or a shadow value. The display family only per foundations §2.1 jurisdiction; mono only for machine-significant text.

**Structure**
4. The component set in `components.md` is closed (one `##` entry per component). NEVER invent a component, add a variant, or restyle an existing one. Unmet needs → §6 escalation.
5. Every screen MUST be classified into exactly one archetype (`patterns.md` §1) before layout begins.
7. Max one `primary` button and one Banner per region (the Composer counts as its own region — its send is that region's one primary). The conversational-AI entry (Ask agent / Composer send) uses the `brand` point color `#0621C4` (variant renamed accent→brand; max one per region). Operational agent actions (Run/Retry/Resume) stay `primary`/black: "executes an agent" never earns the point color.
7a. AI presence is marked only by the squared avatar (primary marker) and the `ai.*` slate treatments (`ai-patterns.md` §1). Consequential agent actions always pass through ProposalCard — no silent execution, no auto-approval.

**Language**
8. All UI must work in Korean and English. No fixed-width text containers, no italics, no ALL-CAPS, no line-height below the paired scale value, `keep-all` breaking for Korean, layouts verified at +25% string width. (Full rules: `foundations.md` §2.3.)
9. Never assemble sentences by concatenating fragments around variables — use complete per-locale templates, with Korean particle rules per `content.md` §4.
9a. Product nouns, standard actions, and status labels come from the closed glossary in `content.md` §3. Korean register is 합니다체; no exclamation marks in system text; errors follow the catalog structure.

**Accessibility**
10. WCAG 2.1 AA floor: pre-verified token pairs only, visible focus ring on everything interactive, full keyboard paths, `lang` attributes on language regions, targets ≥24px.

**Honesty of state**
11. Every list/table/search has an EmptyState; every >300ms load has Skeleton or Spinner per the feedback tree; every destructive action confirms with named consequences; every error names the fix.

## 4. Generation workflow

When asked to produce a screen or feature UI, follow this sequence — do not skip steps:

1. **Declare** — complete a screen-intent (`tools/screen-intent.schema.json`): archetype, regions, component inventory (manifest keys), locales, states, viewer permissions. Run `validate.py page` on it — errors mean stop and fix the declaration, not the rendering.
2. **Inventory** — components come from `synapse.manifest.json`; load only the entries you declared. If something is missing from the set, escalate now, not after building.
3. **Compose** — check `recipes.md` first for standard assemblies (page header, filter bar, stat grid, footers); lay out the rest per the archetype's structure. Use the `--sy-*` sizing/spacing tokens throughout.
4. **Bilingualize** — provide both EN and KO strings for every label; check the widest against the layout.
5. **State-complete** — specify empty, loading, error, and disabled states. A screen spec without them is unfinished.
6. **Self-audit** — run the checklist in §5. Fix violations before presenting.

## 5. Self-audit checklist

The machine-checkable half of this list is enforced by `python3 tools/validate.py ui <files>` (rule IDs SY001–SY014; also `validate.py tokens` for the token matrix). Run it on any generated HTML/CSS artifact — errors mean the output is non-compliant, full stop. The remaining items require judgment and stay manual.

Before presenting any generated UI, verify mechanically:

- [ ] No raw hex/rgb values; every color is a `--sy-*` token
- [ ] No off-scale spacing/type/radius values
- [ ] Only components from `components.md`, only their enumerated variants
- [ ] One archetype declared
- [ ] ≤1 primary button per region (Composer = its own region); the `accent` variant name appears nowhere (renamed to `brand`)
- [ ] EN + KO strings supplied; nothing fixed-width, italic, or uppercase-transformed
- [ ] Terminology, statuses, and actions match the `content.md` glossary; KO is 합니다체; no particle attached to a variable; no exclamation marks
- [ ] Empty/loading/error/disabled states specified
- [ ] Focus ring, labels, `lang` attributes, keyboard path present
- [ ] Charts use `viz` tokens in order; status colors only for status
- [ ] AI surfaces follow `ai-patterns.md`: squared avatars, stop controls on generation, ProposalCard for side effects, attribution rows on agent output

## 6. Governance — how the system changes

The system is closed to inline modification but open to proposals. This is the mechanism that prevents drift when many agents and non-designers generate UI.

**Roles.** *Consumers* (any agent or person generating product UI) may use the system but never alter it. *Maintainers* (design system owners at Enhans) may change these files and bump the version.

**When a consumer hits a gap** (needed component/variant/token doesn't exist):
1. Do not improvise. Build the nearest compliant alternative from existing components, and
2. File a proposal: what was needed, why existing components fail, the concrete use case, suggested spec. Record it in `proposals/` as a dated markdown file (e.g. `proposals/2026-07-09-split-button.md`).
3. A maintainer accepts (spec added to `components.md`/tokens, version bumped) or rejects with the sanctioned alternative documented.

**Versioning.** One version number in lockstep across `tokens/synapse.tokens.json` (`$version`), the `design.md` header, and `preview.html`. **The version marks a team-facing release, not each internal edit** (release-based since 1.0.0): ongoing changes accumulate under `## Unreleased` in `CHANGELOG.md`, and the number bumps only when a release is cut for the team. Bumps follow semver — patch = value tweaks and doc clarifications, minor = additive tokens/variants/components, major = breaking renames or removals (with a migration note). Generated Figma libraries and code themes rebuild on each released minor. (History before 1.0.0 is the internal 6.x pre-release line, retained in `CHANGELOG.md`.)

**The one-way door rule.** Nothing ships into product UI that isn't expressible in these files. If the product needs it, the system gets it *first*, then the product uses it. This ordering is the entire defense against unruly edits.

**White-label rule.** Per-client theming and re-branding of AgentOS chrome is **forbidden** in v1 — no client logos in the app frame, no client color substitution, no font swaps. This is written down precisely so the request becomes a governance decision instead of an improvisation; if white-labeling ever becomes a business requirement, it enters as a major-version proposal with its own token architecture, not as an override.

## 7. Working with this system as an LLM

- Load order for context budgets: `design.md` → `synapse.manifest.json` (the compact index: components, rules, never-list) → the relevant archetype section of `patterns.md` → full prose specs only for components whose manifest entry doesn't answer the question. `foundations.md` for judgment calls; `icons.md` before placing any icon.
- Quote rule numbers when explaining decisions ("scroll container spans the region per patterns §1", "no italics per foundations §2.3.2") — it keeps generations auditable.
- When two rules seem to conflict, the file-map authority order (§1) resolves it; if still ambiguous, choose the more restrictive reading and note the ambiguity as a proposal.
- Do not "improve" the system opportunistically. Restraint is the design language; an output that feels too plain is more likely correct than one that feels rich.

## 8. Appendix — the never list

One place to check. (Machine-readable copy: `synapse.manifest.json → never`.)

Raw color/spacing/radius/type values · components, variants, or icons outside the closed sets · italics, ALL-CAPS, fixed-width text containers, sub-floor line-heights · >1 primary button or Banner per region · carousels · marquee/auto-playing motion · infinite scroll in tables · nested modals, drawers, sheets-of-any-kind · rotated elements outside MediaGroup's generated-media fan · custom scrollbars · arbitrary z-index · per-client theming / white-label · gradients, glow, blur outside the glass material (scrimmed overlays only — foundations §5) · Korean particles attached to variables · concatenated sentence fragments · auto-approved agent proposals · silent agent side effects · fake citations · optimistic rendering of agent output.
