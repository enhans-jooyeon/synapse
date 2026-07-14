# Synapse patterns

How components compose into pages. This layer is what makes agent-generated screens *look like AgentOS* instead of a component pile. Page archetypes are the primary decision mechanism: every new screen MUST be classified into exactly one archetype before any layout work, because the archetype fixes the density mode, layout grid, and allowed regions.

---

## 1. Page archetypes

### Decision rule

```
Is the page's job to display many records or live metrics at once?
├── yes → WORKBENCH (dense)
└── no
    ├── Is it a single object's detail or editing view? → OBJECT (focus, may embed dense regions)
    ├── Is it configuration, preferences, or account? → SETTINGS (focus)
    ├── Is it a first-run, wizard, or decision moment? → GUIDED (focus)
    └── Is it conversation with an agent? → CONSOLE (focus, own layout)
```

### A. Workbench — dense

Data tables, dashboards, monitoring, queues, logs.

- `data-density="dense"`, fluid width, `--sy-page-padding` 24.
- Structure top-to-bottom: **toolbar row** (page title 24/34 left; filters, search Input, primary action right; height 40, single row) → optional **metric strip** (2–6 stat Cards in a grid, dense padding) → **data region** (Table, or Card grid for visual records) → Pagination.
- Charts live in Cards with a 16-semibold header and one chart each; `viz` palette in fixed order; max 4 metric colors per dashboard view.
- Multi-panel workbenches (list + detail) use SplitPanel (default 40/60); the detail pane is an inline OBJECT region (focus) — this is the sanctioned mixed-density case, boundary = the divider.

### B. Object — focus

Detail view of one entity (a project, an agent run, a document).

- `data-density="focus"`; content max-width `--sy-content-max` (760px) centered, except when embedding a dense child table which MAY extend to 1200px.
- Structure: Breadcrumb → **header block** (title 24/34, meta line of Badges + `fg.tertiary` timestamps, actions right: max primary + secondary + overflow menu) → Tabs (if the object has facets) → stacked content sections (`--sy-section-gap`).
- Related records inside an Object page render as an embedded dense Table region — with a visible container boundary (Card frame).

### C. Settings — focus

- Max-width 760px. Left-anchored section list (Sidebar level-2 or Tabs) for >3 sections.
- Each section = Card with header; rows are label+control pairs: label + caption description left, control right, `border.subtle` row dividers. Instant-effect rows use Switch; form-style sections end with a right-aligned Save (primary) + Cancel.
- One Save per Card. NEVER a global sticky save bar and per-card saves simultaneously.

### D. Guided — focus

Onboarding, wizards, empty first-run, irreversible decisions. The only archetype where Display type (30/40, 36/48) and `lg` buttons are permitted.

- Single centered column, max-width 560px, generous `--sy-space-64` top offset.
- Multi-step flows: step indicator (13 medium, `fg.tertiary` "2/4" or dot row — composed from primitives, this is the sanctioned "stepper"), one decision per step, primary continue + ghost back.

### E. Console — focus

Agent conversation surface.

- Two-column: conversation (fluid, max-width 760 message column) + optional context Drawer.
- Messages: human messages right-anchored `bg.sunken` bubbles (radius `lg`); agent messages full-width plain text on `bg.page` — agents speak as the product, humans speak in bubbles.
- Agent identity uses the squared Avatar. Streaming, working steps, approvals, provenance, and failure conventions are governed by `ai-patterns.md` — the Console archetype is where most of those patterns live, but they apply to every AI surface in any archetype.

---

## 2. Layout grid

- App frame: Sidebar (240/64) + main area. Main area holds one archetype. **Scroll containers span the region (v6.17.5):** when content is a centered reading column inside a wider region (Console thread, focus documents), the scroll container is the full-width region and the column is centered inside it — the scrollbar sits at the region's edge, never beside the column. A mid-canvas scrollbar reads as a broken layout.

**App chrome is density-independent (v6.2.5):** the Topbar (R10) and Sidebar always render at focus metrics — page density governs content regions, never the frame around them (density-shifting chrome makes the same app feel different per page).
- Content grids use CSS grid with `--sy-space-16` (dense) / `--sy-space-24` (focus) gutters. Column counts: metric cards 2–6; card grids 2–4; never 12-column decorative grids.
- Breakpoints: <768 single column + collapsed sidebar; 768–1280 standard; >1440 workbenches keep fluid, focus archetypes stay at max-width (whitespace is intentional — do not fill it).

### 2.1 Narrow-window contract (v6.1 — web-only; browser windows get narrow, devices don't exist)

- **Sidebar** collapses to the 64px icon rail below 1024; below 768 the rail hides behind the `menu` icon in the topbar area. Labels move to Tooltips on the rail.
- **Workbench tables** scroll horizontally with the first column pinned — they NEVER collapse into card lists unless a per-view card mapping has been explicitly spec'd (an unspec'd collapse invents a new layout).
- **SplitPanel**: when panes can't both meet min-width, the secondary pane becomes a Drawer opened from the row — the divider disappears rather than producing two unusable panes.
- **Filter bars (R6)** wrap per their own rule; **stat grids (R4)** drop columns 6→3→2, never below 2; **page headers (R1)** wrap actions below the title line before ever truncating the title.
- **Modals** clamp to `min(90vw, spec width)`; Drawers to `min(90vw, 480/640/800)`.
- Hover-dependent affordances (row actions, HoverCards, ResponseToolbar) must remain reachable by keyboard focus at every width — narrow windows change layout, never capability.

## 3. Forms

- Single column always. Two-column field layouts are forbidden (KO/EN label divergence + scanning cost).
- Field order: required before optional; riskiest last. Group with 16-semibold subsection headers every 3–6 fields.
- Field widths signal expected content: full (default), but constrain obviously short fields (date, code) to their natural width — via max-width on the field, never fixed width on label containers.
- Validation: inline, on blur for format errors, on submit for completeness; error summary Banner on top only for >3 errors, linking to fields.
- Destructive or irreversible submissions confirm via Modal with `danger` Button and consequence-naming copy ("This deletes 14 runs permanently" / "실행 기록 14개가 영구 삭제됩니다").

## 4. Data display choices

```
Records with comparable fields        → Table
Visual/preview-led records           → Card grid (2–4 col)
Single figure + trend                → Stat card (label 13 medium fg.secondary,
                                        value 24 semibold tabular-nums, delta Badge)
Trends over time                     → line chart · Composition → stacked bar
Distribution                         → bar/histogram · NEVER pie beyond 3 slices
Live status of many systems          → Table with Badge column, not a tile wall
```

All charts render via the Chart component (`components.md`) — closed type set, axis/legend/tooltip anatomy, and loading/empty/error states are specified there. Period switchers on charts use SegmentedControl.

## 5. Feedback decision tree

```
Outcome of a user/agent action, no decision needed → Toast
Validation problem on a field                      → inline field error
Condition affecting a whole page/section           → Banner
Blocking decision or confirmation                  → Modal
Progress, shape known                              → Skeleton
Progress, inside a control                         → Spinner in Button
```

### 5.1 Loading orchestration (v6.1)

- Page-level load order is fixed: chrome (sidebar/topbar) renders immediately → header block skeletons → content region skeletons. Chrome never skeletons.
- **One primary skeleton region at a time** — the region the user came for; secondary panels show nothing until the primary resolves, then skeleton if still pending.
- Skeletons compose only the three presets (line/block/circle); table skeletons render the expected row count, capped at 10; chart skeletons are the type's silhouette.
- Under 300ms nothing renders (existing rule); NEVER mix a Spinner and a Skeleton in one region; a region that fails mid-load swaps its skeleton for the error EmptyState, never leaves a pulsing corpse.

### 5.2 Optimistic vs. pessimistic mutations (v6.1)

- **Optimistic** (render the result immediately, reconcile in background): local, reversible, single-user metadata — rename, toggle a Switch, add/remove a Chip or tag, mark-read, reorder. On failure: revert visibly + danger Toast naming what failed ("Rename didn't save — check your connection." / "이름 변경이 저장되지 않았습니다 — 연결을 확인하세요.").
- **Pessimistic** (spinner/disabled until confirmed): anything an agent executes, anything destructive, anything affecting other users or permissions, anything with named consequences. ProposalCard approvals are ALWAYS pessimistic — an approval that silently failed is the worst state in the product.
- Never optimistic-render agent output or run state; agents report, they are not predicted.

## 6. Permission-aware rendering (v5.1)

One rule decides visible-disabled vs. hidden:

- **Disabled + reason** when the user could plausibly obtain the capability inside their org: render the control disabled with a Tooltip naming the requirement ("Requires editor access — ask your admin" / "편집자 권한이 필요합니다 — 관리자에게 요청하세요"). Discoverability is a feature.
- **Hidden entirely** when the capability is plan-gated, org-disabled, or irrelevant to the user's role surface: absent features aren't advertised through dead chrome.
- NEVER render an actionable control that errors on click for permission reasons — permission is resolved at render time, not at action time.
- In lists/tables, rows the user can't act on still *display* (data visibility ≠ action permission); only their action cells disable.
- Generation agents MUST receive the viewer's permission context before composing a screen (the screen-intent schema carries a `permissions` field) — a screen generated without it is unreviewable.

## 7. Bilingual layout patterns

- Reserve horizontal slack: any row pairing text with controls must tolerate the KO/EN wider string (+25%) without wrapping controls.
- Date/number formats are locale tokens, not layout choices: EN `Jan 9, 2026` / KO `2026년 1월 9일`; both use tabular-nums in tables. Time relative-format allowed only with absolute on hover.
- Never build sentences from concatenated fragments around a variable — word order differs; use full templated strings per locale.
- CJK-specific: no letter-spacing adjustments on Hangul; no synthetic bold (Pretendard has true weights).

## 8. Session & system states (v6.1)

- **Session expiry:** a Modal 60s before expiry ("Your session ends in {n}s — continue working?" / "{n}초 후 세션이 만료됩니다 — 계속하시겠어요?") with a single continue action; on expiry, re-auth in place and ALL drafts (Composer, forms) survive the round-trip. Silent logout mid-edit is forbidden.
- **Maintenance:** announced via `warning` subtle Banner app-wide ("Scheduled maintenance {window} — saves may be delayed." / content.md template). The `solid` strip stays reserved for outage-grade events.
- **Degraded connection:** a `neutral` Banner ("Reconnecting… changes will sync when back." / "다시 연결하는 중입니다… 연결되면 변경사항이 동기화됩니다.") — optimistic mutations queue, pessimistic ones disable with the reason. Never a full-screen block while cached content is readable.
- **Error pages:** recipe R13 — never a bare browser error.
