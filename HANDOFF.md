<!-- Session handoff. Paste this file (or point the new session at it) to resume with full context. Not a spec file; safe to edit freely. Last updated: 2026-07-22, at v1.0.0 — added the design-development process layer (docs/process/) and retargeted the package scope to @enhans-jooyeon/synapse. -->

# Synapse — session handoff

This doc lets a fresh Cowork session (or a new device) pick up where the last one left off. Read it first, then read `design.md` (the agent entry point / contract), then run the gate to confirm state.

## What this project is

**Synapse** is Enhans' machine-enforced, contract-based design system for **AgentOS** (an enterprise AI/agent-operations platform). Web-only. Bilingual **KO/EN**. Sole maintainer: **June** (jooyeon@enhans.ai). Repo: `github.com/enhans-jooyeon/synapse`. Local path on June's Mac: `~/Claude/Projects/Synapse` (git is the cross-device sync — clone anywhere, folder name doesn't matter).

The system's character: neutral, black-key, borders-first, engineered restraint — "precision instrument, not a consumer app." Closed sets everywhere; deviations are governance proposals, not ad-hoc edits.

## Repo map

- `design.md` — agent entry point + the contract; read this first. Carries the `**Version X.Y.Z` header.
- `foundations.md` — color, type, spacing, elevation, motion, a11y, keyboard (the "why").
- `components.md` — every component's anatomy/variants/states/rules.
- `ai-patterns.md` — agent-surface interaction rules (§1–35).
- `content.md`, `patterns.md` — voice/terminology, and archetypes.
- Specs are **English-only** (the single maintained source). Korean is rendered **on demand** in the docs hub (client-side Google Translate) — no committed `.ko.md`, no per-edit sync. The generated *product UI* stays bilingual KO/EN (governed by `content.md` + `foundations.md` §2.3 — unaffected by this).
- `product-context.md` — the AgentOS product model the Frame + Intake phases ground on. Reference layer, ungated, EN. **v1 (2026-07-23):** authoritative 4-module framing (Data Flow / Ontology / Agent Builder / View Generator) + rich ontology model + workflow nodes + MCP/Open-API from `docs.commerceos.ai`; screen inventory + role model from the `enhans-jooyeon/AOS` digital twin. **Role model now filled** (Guest<Member<Manager<Owner<Admin + My/Team/AOS ownership + ABAC attrs) — grounds SY109. IA verified read-only against the live product (2026-07-23): 7 top-level surfaces (Agentic AI, Application, Agentic Work, Ontology, Pipeline builder, Governance, Q&A); CUA/browser-automation is real but dev-only; admin console real but separate & live-outdated; CRM Kanban excluded.
- `tokens/synapse.tokens.json` — **source of truth** for tokens (carries `$version`). `tokens/synapse.css` — generated CSS custom properties (`--sy-*`).
- `preview.html` — the component browser / storybook (left sidenav + Overview gallery + per-component detail pages with When/When-not/Anti/Where guidance). Deployed to Vercel via the docs hub.
- `storybook/` — React component implementations (SEED: Button, Badge, Input, Card only — 4 of 57). `storybook/PUBLISHING.md` — how to make `@enhans-jooyeon/synapse` publishable (blocked on component parity).
- `README.md` — team-facing front door (who-you-are → start-here, repo map, status).
- `docs/process/` — the process doctrine, **all English now** (converted from Korean 2026-07-23 since the LLM fills the PRD, not the user). Team-facing: `design-review-protocol.md` (review protocol) + `prd-template.md` (PRD template, filled by the intake skill). Agent-facing (ungated): `design-cycle.md` (the canonical Frame→Intake→Generate→Review→Refine spine + opening triage — the phase spine the Synapse plugin runs), `screen-intake-skill.md` (the unskippable guided intake → filled PRD + validated screen-intent JSON; refuses on hand-waving), `harness-refinement-protocol.md` + `harness-refinement-register.md` (the self-correction loop: blind assess → mine the delta vs June's feedback → root-cause RC1–RC6 → route to a harness fix; edits held for approval). `.github/PULL_REQUEST_TEMPLATE/ui_review.md` — the review/PR template.
- `docs/DISTRIBUTION.md` — how the harness reaches the team; the five-artifact split + sequenced rollout.
- `tooling/product-gates/` — drop-in JS/TS gates for the PRODUCT repo (ESLint/Tailwind/raw-value/state-coverage/CI) — the protocol §6 gate that validate.py can't be.
- `scripts/dist.allowlist` + `scripts/build-dist.mjs` — the curated team-package builder (allowlist → `dist/`; internal docs excluded by construction). `.github/workflows/publish-harness.yml` mirrors `dist/` to the separate `synapse-harness` repo on each release tag. Two-repo workflow doc: `docs/DISTRIBUTION.md`.
- `tools/validate.py` — the DS-repo gate (SY001–SY018). `tools/build_manifest.py` — regenerates `synapse.manifest.json`.
- `app-generation/` — the App Generation (App Builder) feature's ECharts chart/component catalog + design task list, **reconciled from the old azure `#0a84ff` token system to v1.0.0** (`app-generation/tokens-map.md`). Un-gated by design (ECharts JS must hardcode hex — can't be `--sy-*`-linted); consistency held by the value reconciliation. Open item: the chart blue ramp was computed from `#0621C4` (Synapse has no blue ramp) and wants a designer's eye, or a governance token-ramp addition.
- `proposals/` — active governance/audit docs (not gated, no KO required); resolved/superseded pre-1.0 ones are in `proposals/archive/`.

## The working discipline (IMPORTANT — follow exactly)

Every change is spec law and is versioned in lockstep. For any change:

1. **Version is release-based (since 1.0.0).** The three locations stay in lockstep — `tokens/synapse.tokens.json` `$version` == `design.md` `**Version` header == `preview.html` `<span class="v">vX.Y.Z</span>` — but the number marks a TEAM RELEASE, not each edit. Ongoing work lands under `## Unreleased` in `CHANGELOG.md` at the SAME version; bump (semver: patch/minor/major) only when June cuts a release, and only then update the three locations + rebuild manifest. The gate enforces tokens==design.md, not a per-edit bump.
2. **CHANGELOG.md** entry at the top for every bump.
3. **Run `python3 tools/build_manifest.py`** after any version bump (or SY017 fails — stale manifest).
4. **Gate must be clean:** `python3 tools/validate.py all` → `0 error(s), 0 warning(s)`.
5. **Verify preview JS:** extract the last `<script>` from `preview.html` and `node --check` it (localhost/Chrome are not reachable from the sandbox, so this is how preview.html is verified).
6. **Docs are English-only.** No `.ko.md` to maintain — Korean is on-demand in the hub (client-side Google Translate). SY011/SY016 still apply to Hangul *example strings* inside the EN specs; only the KO-doc staleness check (SY018) and its `sy-source` hashes were removed.
7. **June pushes from her Mac.** The sandbox can commit-attempt but CANNOT push (no creds) and cannot delete `.git/index.lock` (permission denied). Push flow on Mac: `rm -f .git/index.lock && git add -A && git commit -m "…" && git push`.

Gate rules worth knowing: SY001 raw color, SY002 off-scale spacing/radius/font (scale = {0,2,4,6,8,12,16,20,24,28,32,40,48,64,80,96}; NOT 10), SY009 raw box-shadow (exempt: a zero-blur `0 0 0` ring — inset or outset — using a token; focus rings may wrap a token in `color-mix`), SY011 Hangul outside `lang=ko`, SY016 Hangul in Artific display element, SY017 manifest stale.

## Current state

**Version: 1.0.0 (initial team release).** Gate is green (0/0). The prior work (AI side-surface tranche §32–35 + the team-distribution layer: README, `docs/process/`, `.github/PULL_REQUEST_TEMPLATE/ui_review.md`, `docs/DISTRIBUTION.md`, `tooling/product-gates/`, `storybook/PUBLISHING.md`) was pushed as commit `d2e8bbd` (internal 6.62.0). This session then **re-baselined the version to 1.0.0**, switched to release-based versioning (design.md §6), and added the **curated-distribution workflow** (`scripts/build-dist.mjs` + `dist.allowlist` + `.github/workflows/publish-harness.yml`) that publishes a cleaned-up bundle to a separate `synapse-harness` repo on release tags. All of that is **uncommitted; needs a push from June's Mac** (working folder is now the real clone `~/Claude/Projects/synapse-clone`). Two-repo setup steps (create `synapse-harness`, add `HARNESS_DEPLOY_TOKEN` secret) are in `docs/DISTRIBUTION.md`. Vercel deploys the docs hub + preview; after pushes that touch token values or storybook, confirm the build is green.

## This session (2026-07-22) — process layer + scope retarget

Focus shifted from the design system to the **harness around it**, prompted by a disappointing team test round (testers gave generic instructions, skipped the PRD, got generic UI). Work done, all **uncommitted, gate green (0/0)**:

- **Added the design-development process layer** in `docs/process/` (EN, ungated — see repo map): `design-cycle.md`, `screen-intake-skill.md`, `harness-refinement-protocol.md`, `harness-refinement-register.md`. The cycle is `Triage → (Frame if net-new) → Intake (unskippable) → Generate (any tool) → Review (gate then judgment) → Refine (defects become harness edits)`.
- **Retargeted the npm package scope** harness-wide: `@enhans/synapse` → `@enhans-jooyeon/synapse` across 14 files (incl. `storybook/package.json` name, the product-gate `eslint`/`tailwind` configs that bind a consuming repo, PUBLISHING/DISTRIBUTION, PRD template, review protocol, README, app-generation docs, this file). Left `proposals/archive/2026-07-15-branding-system-comparison.md` intact — its `@enhans/synapse` is a true historical reference to the OLD (viralpick/CommerceOS) system.
- **Direction agreed:** the process layer ships as a **Synapse plugin** (guided + gate) for the internal team's agent tools — repo stays source of truth, no standalone app. Frame is deliberately *optional* (triaged) to avoid research theater.
- **v1 cleanup pass:** trimmed `CHANGELOG.md` to Unreleased + 1.0.0 (6.x history now only in git); deleted the superseded `app-generation/project_synapse_tokens.md`; archived 8 resolved proposals to `proposals/archive/`; and **stripped all `v2`–`v6` provenance tags** from the specs (EN+KO), tokens, manifest, `build_manifest.py`, preview, and storybook — rationale kept, version stamps gone. `v1.x` protected. NOTE: this file and `proposals/` intentionally still carry version references (they're history/handoff, not the contract). Two `v1.2`/`v1.3` tags in ai-patterns/components specs were left pending June's call.
- **Docs went English-only.** Deleted the 8 `*.ko.md`; removed SY018 + `translation_hash` + `check_translations` from `validate.py`; switched the docs hub (`index.html`) to translate EN → KO **on demand client-side** (Google Translate cookie+element, no maintainer step, nothing committed); pruned the `.ko.md` allowlist from `.vercelignore`. Product UI stays bilingual (content.md unaffected). NOTE: the hub's translate widget needs a **browser check** (couldn't render in-sandbox); harmless dead code (`koFile`, `stripMeta`, ko NAV labels) left in index.html.

## Key maintainer rulings / earlier decisions

- **Point color = `#0621C4`** (Claude Design System point blue), v6.61 — replaced the old brand-team-repo azure `#0A84FF`. Hover `#051AA0`, tint `#EBEDFA`. White-on-point ≈ 10:1, so it clears AA and no longer needs the ≥3:1 solid-label exemption; validator brand contrast pairs are at AA 4.5. Flows through `action.brand-*`, `brand.point`, `ai.solid`.
- **`accent` → `brand`** button-variant rename (v6.58): the point-color button is the `brand` variant (brand-identity + conversational-AI CTAs; Composer send). Operational agent actions (Run/Retry/Resume) stay `primary`/black.
- **Functional blue stays separate:** `#3155C6` indigo for links/focus/status.info. (Watch item: `#0621C4` is now closer in hue to `#3155C6` than the old azure was — eyeball focus ring next to a brand button.)
- **Focus rings** (v6.58.1): per-variant, flush, rendered as a `box-shadow` ring (hugs radius; `outline` left a corner gap) lightened via `color-mix` to a ~50% tint of the button's color. Transparent `outline` kept for forced-colors mode. SY009 was extended to permit token-based zero-blur rings.
- **`shadow.thumb` token** (v6.57.5) for the slider handle. **ChoiceCard selected state** = 1px `border.selected` + flush `border.subtle` outline halo.
- **Detail pages**: Examples column widened (doc-grid 1 : 2.1, max-width 1440) so tables aren't cramped.
- **NotificationCenter** upgraded (v6.59): All/Unread/Mentions filter tabs, typed items (run/approval/mention/comment/system), per-item hover controls that **overlay** (don't reflow / don't hide the timestamp), header settings gear + single full-width "View all" footer button.
- **Divider rule** (v6.59.2): an inset control against a full-bleed divider takes equal padding on all four sides (the divider gap == side/outer padding).
- **Shape-of-AI refinement tranche** (v6.60.0), threaded into ai-patterns.md: §4 connector freshness/reconnect/untrusted, §9 disclosure names the action, §19 follow-ups grouped refine-vs-pivot, §24 reviewable prompt-rewrite, new §31 editing-existing-content (diff + Accept/Discard, never silent overwrite; auto-fill pending-until-accept).
- **Component browser section splits** (v6.60.1–.2): combined stories that weren't one UX umbrella were split into standalone stories — Tree | CodeBlock·DiffView; Slider·NumberInput | ChoiceCard; Timeline | NotificationCenter; Toast | Tooltip; HoverCard | Popconfirm | ContextMenu; Reasoning | Guardrail | Handoff. Genuine families stayed grouped (Input·Textarea, Checkbox·Radio·Switch, Skeleton·Spinner·Progress, Tabs·Breadcrumb·Pagination, Modal·Drawer, Select·Menu, Provenance·Uncertainty, Spacing·radius·elevation).

## Open threads / what's next

- **AgentOS product-context layer — v1 (2026-07-23).** `product-context.md` rebuilt from two external sources June provided: `docs.commerceos.ai` (authoritative current docs) + the `enhans-jooyeon/AOS` public digital twin (React/TS, exploratory, old design system). Docs gave the authoritative 4-module model, the full ontology model, the 8 workflow nodes, the pipeline taxonomy, and MCP/Open-API. The twin gave the real screen inventory (3 consoles) and the **role model, which June confirmed authoritative for SY109** (Guest/Member/Manager/Owner/Admin + My/Team/AOS + ABAC). Surfaces since **verified against the live product** (2026-07-23) + June's clarifications: all real except the CRM Kanban (excluded); CUA/browser-automation is real but **dev-only**; admin console real but **separate & live-outdated** (twin = intended direction). **Remaining (June):** per-module nav detail; tone/voice ref; optional visual check of CUA + admin on the dev server (needs the dev URL). Naming: **AgentOS** confirmed correct (docs literally say "AOS = Agent Operating System"); the `app-generation/` specs still say "COS/Enhance".
- **Synapse plugin packaging.** Bundle the phase skills (`design-cycle.md` is the spine) into a plugin the team runs in their agent tools, each phase gating the next. Also tailor the `design` plugin's `user-research` + `research-synthesis` to AgentOS for the Frame phase. Not started.
- **Team distribution (biggest open thread).** `docs/DISTRIBUTION.md` has the full plan. The doctrine is team-ready to *read*; it is NOT ready to *use under enforcement* because two things don't exist yet: (1) an installable `@enhans-jooyeon/synapse` — the `storybook/` lib is 4 of 57 components (`storybook/PUBLISHING.md`); (2) the product-repo gates are provided in `tooling/product-gates/` but not wired into a product repo. Critical path: build out components → publish package → wire product gates → land process docs in product repo → pilot one screen → broaden. `npm publish`, product-repo CI, and the git push all require June's creds/environment.
- **Side-surface tranche** (shipped, from `proposals/2026-07-21-aiux-patterns-catalog-audit.md`): ai-patterns §32 Artifacts, §33 Source browser, §34 Conversation summary, §35 Feedback. Next-strongest catalog item still open: **Plan & Execute** (pre-flight editable plan). The catalog + framework audits (`proposals/2026-07-21-*`) list the rest.
- **Shape-of-AI gaps** are documented in two new proposal docs: `proposals/2026-07-20-shapeof-ai-pattern-audit.md` (full pattern audit) and `proposals/2026-07-20-ai-gap-policy-decisions.md` + `proposals/2026-07-20-ai-gap-decision-register.xlsx` (policy decisions the team's DRIs must settle before UI — Memory, Incognito, Data ownership, pre-flight Action plan, pre-run Cost estimates, Branches/Variations, Voice & tone, etc.). These are **blocked on policy calls**, not design.
- **Open question from June:** whether other tokens in the Claude Design System differ from ours (only the point blue was retargeted so far). If she provides the Claude DS palette, sync the rest in one pass.
- Media-playground patterns (inpainting, restyle/preset styles, watermarks, etc.) were deliberately marked out-of-domain in the audit.

## How to resume in a new session

1. `git pull` (on the device's clone).
2. Read `design.md` (contract + current version), then this file.
3. Run `python3 tools/validate.py all` — expect `0 error(s), 0 warning(s)`. If it complains about a stale manifest, run `python3 tools/build_manifest.py`.
4. Check the top of `CHANGELOG.md` for the latest version and what shipped.
5. Work in the established discipline above; June reviews and pushes.

## How June likes Claude to work

Critical/analytical by default on proposals and judgment calls — lead with the strongest objections/risks, name unstated assumptions and cheaper alternatives, distinguish fact vs. judgment vs. guess, and hold a position with reasons rather than caving. Don't manufacture criticism when something's solid. Be concise and direct; minimal fluff.

**Standing rule:** when changes land, refresh every doc that references them (this file, README, repo map, cross-references) **without asking** — proactively, as part of the same work.
