# Proposal: comprehensiveness roadmap — closing the harness gaps

**Status: proposed · Decider: June**

Goal: minimize the situations where a generation agent meets a need the system doesn't answer. Ordered by harness leverage, not by component count — a closed rule that removes a degree of freedom is worth more than a new widget.

---

## P1 — Harness infrastructure (highest leverage; build before more components)

| Item | What & why |
|---|---|
| **Machine manifest (`synapse.manifest.json`)** | Compiled index of every component: variants, sizes, states, token bindings, forbidden list, jurisdiction — generated from `components.md`. Agents retrieve the 2KB entry they need instead of parsing prose; context budgets shrink; drift from stale summaries disappears. |
| **Screen-intent schema** | A small JSON schema an agent fills *before* generating (archetype, density, regions, components inventory, locales, states covered). The validator gains a `page` mode that lints the declaration against the contract. Turns design.md §4's workflow from prose into a gate. |
| **Z-layer scale** | Tokens for stacking: `z.sticky < z.dropdown < z.drawer < z.modal < z.toast < z.tooltip`. Currently unspecified — the classic source of overlay bugs no component spec catches. |
| **Icon registry (closed)** | Today: "Lucide, plus an approved icon-action list." Replace with an enumerated concept→icon table (~60 entries: create→plus, agent→glyph, schedule→calendar…). Unlisted concept = no icon + proposal. Kills the largest remaining free-choice surface. |
| **Agent-markdown rendering rules** | Agent output *is* markdown. Rules: heading demotion (agent `#` renders as `heading-md`, never page titles), table/code/link styling, image handling, max blockquote depth, streaming-safe rendering. Without this every Console message is improvised typography. |
| **Hide vs. disable rule** | Permission-aware rendering: no-permission = visible but disabled + reason Tooltip when discoverability aids the org; hidden entirely when the feature is plan-gated. One rule, huge consistency payoff. |

## P2 — AI-surface completion (the product's core, still thin in places)

| Item | What & why |
|---|---|
| **Composer** (component) | The Console input bar: attachment Chips, agent/scope picker, send↔stop morph button, disabled-never rule, multiline growth, kbd hints. Currently the single most-used surface in AgentOS is unspecified. |
| **Response toolbar** (component) | Copy · regenerate · thumbs up/down on agent messages; feedback states; where it appears (hover vs persistent per density). |
| **Reasoning disclosure** | Collapsed "thinking/working" section conventions beyond AgentStep — token budget display, expand persistence. |
| **Guardrail notice pattern** | How a refusal/blocked action renders (neutral Banner flavor + escalation path — never a scary error). |
| **Usage meter** | Plan/token consumption display (ProgressBar variant + jurisdiction: where it may appear). |
| **Handoff pattern** | Agent→human escalation: who's holding the task, how it renders in lists (avatar shape swap is already the marker). |

## P3 — Missing workhorse components (add as first real screens demand, spec now)

| Item | Notes |
|---|---|
| **Timeline / ActivityFeed** | Audit trails — enterprise table stakes. Rows = actor avatar + verb-first sentence + timestamp; day dividers; filters. |
| **Tree** | Hierarchies (folders, org units); disclosure, selection, drag rules. |
| **CodeBlock** (promote from CSS class) | Copy button, optional line numbers, language chip, wrap rules, max-height + expand. |
| **DiffView** (promote from ProposalCard) | Standalone run-comparison / config-diff surface. |
| **Slider / NumberInput** | Thresholds, quotas; steppers, unit suffix, keyboard steps. |
| **ChoiceCard** | Selectable card group (onboarding plan/agent-type pickers) — RadioCard semantics, `border.selected` ring. |
| **HoverCard** | Rich hover preview for users/agents/runs (popover jurisdiction, delay, non-interactive rule?). |
| **Popconfirm** | Inline low-stakes confirm (popover with one question + pair) — closes the gap between "no confirm" and full Modal. |
| **ContextMenu** | Right-click = same Menu component + trigger rules; dense-table jurisdiction. |
| **Calendar view** | Schedule visualization (AgentOS runs on schedules); month/week grids reuse DatePicker cells. |
| ~~Sheet (mobile)~~ | Removed v6.0 — AgentOS is web-only; revisit only if a mobile client ships. |
| **NotificationCenter** | Bell panel: item anatomy (actor, verb, object, time), read states, grouping. |

## P4 — System rules to write (no new components)

- **Narrow-window contract** (web-only, v6.0 rescope): what each archetype does in narrow browser windows (<768: sidebar→rail, dense tables scroll — never collapse to cards without a spec'd mapping); hover-dependent affordances get keyboard-reachable fallbacks. Mobile-device rules removed from scope.
- **Focus management**: open/close focus return, initial focus per overlay type, roving tabindex in menus/grids.
- **Loading orchestration**: page-level skeleton order (chrome → header → content), one primary skeleton region at a time, no skeleton for <300ms (exists) + no spinner+skeleton mixing per region.
- **Optimistic UI rules**: which mutations render optimistically (rename, toggle) vs. pessimistically (anything an agent executes), rollback rendering.
- **Session/system states**: expiry modal, maintenance banner (neutral solid? no — `warning` subtle), offline indicator, error-page recipes (403/404/500) with content.md copy.
- **Keyboard shortcut registry**: closed table of global shortcuts, display convention (`.sy-kbd`), conflict rule (no single-letter globals outside lists).
- **Report/export styling**: agent-generated reports leave the app (PDF/print) — page template, typography mapping, chart fallbacks, citation rendering (SourceChips → footnotes).
- **Microcopy templates**: unsaved changes, rate limit, session timeout, plan limit, maintenance — extend content.md §5 catalog.
- **White-label rule**: explicitly forbidden in v1 (enterprise clients don't re-brand AgentOS chrome) — saying "no" in writing prevents the request from becoming improvisation.

## Explicit forbiddens to add (cheap, high value)

Carousels · marquee/auto-playing motion · infinite scroll outside feeds (exists) · nested modals (exists) · custom scrollbar styling · icon invention outside the registry · per-client theming · gradients (exists via flat rule) · toast stacking >3 (exists) — consolidate all into a single "never list" appendix in design.md so agents have one place to check.

## Sequencing recommendation

1. P1 in one release (manifest + schema + z-scale + icon registry + markdown rules + hide/disable) — pure harness leverage, no visual change.
2. P2 next — it's the product's identity and currently the thinnest layer relative to importance.
3. P3 lazily but spec-first: when a screen needs one, the spec lands before the screen ships (one-way door rule already guarantees this).
4. P4 rules written opportunistically alongside whichever P2/P3 item touches them.
