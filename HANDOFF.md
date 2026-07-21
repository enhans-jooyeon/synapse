<!-- Session handoff. Paste this file (or point the new session at it) to resume with full context. Not a spec file; safe to edit freely. Last updated: 2026-07-21, at v6.61.0. -->

# Synapse — session handoff

This doc lets a fresh Cowork session (or a new device) pick up where the last one left off. Read it first, then read `design.md` (the agent entry point / contract), then run the gate to confirm state.

## What this project is

**Synapse** is Enhans' machine-enforced, contract-based design system for **AgentOS** (an enterprise AI/agent-operations platform). Web-only. Bilingual **KO/EN**. Sole maintainer: **June** (jooyeon@enhans.ai). Repo: `github.com/enhans-jooyeon/synapse`. Local path on June's Mac: `~/Claude/Projects/Synapse` (git is the cross-device sync — clone anywhere, folder name doesn't matter).

The system's character: neutral, black-key, borders-first, engineered restraint — "precision instrument, not a consumer app." Closed sets everywhere; deviations are governance proposals, not ad-hoc edits.

## Repo map

- `design.md` — agent entry point + the contract; read this first. Carries the `**Version X.Y.Z` header.
- `foundations.md` — color, type, spacing, elevation, motion, a11y, keyboard (the "why").
- `components.md` — every component's anatomy/variants/states/rules.
- `ai-patterns.md` — agent-surface interaction rules (§1–31).
- `content.md`, `patterns.md` — voice/terminology, and archetypes.
- `*.ko.md` — Korean translations of the 8 spec files (EN-authoritative; each carries a `<!-- sy-source: HASH -->` marker).
- `tokens/synapse.tokens.json` — **source of truth** for tokens (carries `$version`). `tokens/synapse.css` — generated CSS custom properties (`--sy-*`).
- `preview.html` — the component browser / storybook (left sidenav + Overview gallery + per-component detail pages with When/When-not/Anti/Where guidance). Deployed to Vercel via the docs hub.
- `storybook/` — real React component implementations (Button, Badge, …).
- `tools/validate.py` — the gate (SY001–SY018). `tools/build_manifest.py` — regenerates `synapse.manifest.json`.
- `proposals/` — governance/audit docs (not gated, no KO required).

## The working discipline (IMPORTANT — follow exactly)

Every change is spec law and is versioned in lockstep. For any change:

1. **Version bump in lockstep:** `tokens/synapse.tokens.json` `$version` == `design.md` `**Version` header == `preview.html` `<span class="v">vX.Y.Z</span>`. Patch for browser/fixes, minor for new capabilities/token-value changes.
2. **CHANGELOG.md** entry at the top for every bump.
3. **Run `python3 tools/build_manifest.py`** after any version bump (or SY017 fails — stale manifest).
4. **Gate must be clean:** `python3 tools/validate.py all` → `0 error(s), 0 warning(s)`.
5. **Verify preview JS:** extract the last `<script>` from `preview.html` and `node --check` it (localhost/Chrome are not reachable from the sandbox, so this is how preview.html is verified).
6. **Always refresh translations:** if an EN spec file changes, patch its `.ko.md` and re-inject the `sy-source` hash (`translation_hash()` in validate.py — version-agnostic sha256, first 16 hex). Browser chrome (`preview.html`) is **EN-only**; the 8 spec docs are bilingual.
7. **June pushes from her Mac.** The sandbox can commit-attempt but CANNOT push (no creds) and cannot delete `.git/index.lock` (permission denied). Push flow on Mac: `rm -f .git/index.lock && git add -A && git commit -m "…" && git push`.

Gate rules worth knowing: SY001 raw color, SY002 off-scale spacing/radius/font (scale = {0,2,4,6,8,12,16,20,24,28,32,40,48,64,80,96}; NOT 10), SY009 raw box-shadow (exempt: a zero-blur `0 0 0` ring — inset or outset — using a token; focus rings may wrap a token in `color-mix`), SY011 Hangul outside `lang=ko`, SY016 Hangul in Artific display element, SY017 manifest stale, SY018 `.ko.md` stale (warning).

## Current state

**Version: 6.61.0.** Gate is green (0/0). **Everything since the last successful push is uncommitted** — June needs to push from her Mac (see step 7). Vercel deploys the docs hub + preview; after pushes that touch token values or storybook, confirm the build is green.

## Key maintainer rulings / recent decisions (this session)

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

- **Push the uncommitted work** (v6.61.0 and everything above) from June's Mac.
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
