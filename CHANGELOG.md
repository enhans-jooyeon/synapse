# Synapse changelog

## 6.1.1 — 2026-07-09

Storybook workspace scaffolded (`storybook/`) — no spec changes.

- Stack: React 18 + TypeScript + Storybook 8 (react-vite). Tokens consumed directly from `tokens/synapse.css` (never forked). Radix primitives declared for behavior-heavy components (Dialog/Popover/Tooltip/Tabs/Checkbox — foundations §8 focus management is what Radix ships tested); simple components dependency-free. Per-component, reversible.
- Toolbar globals mirror the browser: theme × density × locale, applied via a `sy-root` decorator.
- Seed reference implementations: Button (variants, loading-keeps-width, pill jurisdiction in JSDoc), Badge (color × emphasis × shape × size + with-icon), Input (filled anatomy, required label, error-names-fix, v6.0 affixes, aria wiring), Card (flat default; `interactive` auto-upgrades flat→outlined per spec). All four component CSS files pass the gate.
- `npm run gate` wires the Python validator + manifest build into the workspace. `storybook/README.md` records the six contribution conventions and the suggested build order (Sample-pages dependency chain first).

## 6.1.0 — 2026-07-09

P4 — the rules layer (roadmap complete). No new components, no visual changes.

- **Narrow-window contract** (patterns §2.1): sidebar→rail→menu-icon thresholds; workbench tables scroll (never unspec'd card collapse); SplitPanel's secondary pane becomes a Drawer below min widths; R1/R4/R6 wrap rules; overlay width clamps; capability never shrinks with the window.
- **Loading orchestration** (patterns §5.1): chrome→header→content order, one primary skeleton region, preset-only shapes, row-count cap, failed loads swap to error EmptyState.
- **Optimistic vs. pessimistic** (patterns §5.2): optimistic only for local reversible single-user metadata with visible rollback; agent-executed/destructive/cross-user always pessimistic; ProposalCard approvals never optimistic.
- **Session & system states** (patterns §8): expiry Modal with draft survival, maintenance = warning subtle Banner, degraded-connection queueing, no full-screen blocks over readable cached content.
- **Focus management** (foundations §8): deterministic initial focus per overlay (confirms focus Cancel, never the danger button), focus return on close, traps, Esc closes topmost only, roving tabindex, placeholders never focusable.
- **Keyboard registry** (foundations §9): closed global set (⌘K, ⌘Enter, Esc, ⌘/); no single-char globals (IME collision), no browser-combo overrides; shortcuts surface via Tooltip kbd slots + ⌘/ overlay.
- **Error pages** (recipes R13: 403/404/500 — 403 never reveals contents; chrome survives content errors) and **exported reports** (recipes R14: A4 template, px→pt mapping, no display family, static charts, SourceChips→footnotes, page-break rules, grayscale-safe status).
- **System-state microcopy** (content §5): unsaved changes, session expiry, rate limit, plan limit, maintenance, reconnecting — both locales.
- **White-label rule** (design §6): per-client theming formally forbidden; future white-labeling is a major-version proposal, not an override. **Never-list appendix** added as design.md §8, mirrored in the manifest.

## 6.0.0 — 2026-07-09

Web-only rescope + variant audit. Breaking: Sheet removed.

**De-mobiled (AgentOS is a web app; maintainer decision):**
- **Sheet component removed** (50 entries). Drawer no longer has a <768px device rendering; NotificationCenter is popover-only. Roadmap's responsive item rescoped to a *narrow-window* web contract (sidebar→rail, dense tables scroll); mobile-device rules (44px touch targets, touch affordances) out of scope until a mobile client exists.
- Touch/long-press language stripped: ResponseToolbar persistence is now dense-console-scoped; ContextMenu is right-click with the duplication rule justified by discoverability; HoverCard's click-through rule re-grounded in keyboard/assistive access; foundations target rule reworded to WCAG 2.5.8 pointer targets.

**Variant audit — ten additions (each closes an improvisation gap):**
- Input: affix slots (leading registry icon / trailing unit-or-icon; password reveal formalized) · Textarea: `autogrow` (Composer's behavior for inline forms) · Badge: `with-icon` (12px registry status icon — colorblind-safe triple redundancy; subtle/solid only) · Chip input: leading Avatar 16 for person/agent values · Toast: the Undo convention (reversible-lite ops get Undo@8s instead of Popconfirm — never both) · EmptyState: `compact` (mandatory inside small overlays) · Tooltip: trailing `.sy-kbd` shortcut slot · Drawer: `wide` 800 for data review (DiffView fits) · Timeline: `compact` embedded mini-log rows · Skeleton: closed preset shapes (line/block/circle; free-form skeletons forbidden).
- Manifest rebuilt (50); browser shows with-icon badge and kbd tooltip inline.

## 5.3.0 — 2026-07-09

P3 — workhorse components, all twelve spec'd (roadmap). Component count 39 → 51.

- **Timeline** (audit feeds: actor-shape authorship, templated verbs, uneditable history) · **Tree** (4-level cap then drill-in, mixed-state checkbox parents, focus-line drop targets) · **CodeBlock** (promoted from CSS class: language chip, copy, one muted syntax theme system-wide, display-only) · **DiffView** (promoted from ProposalCard: unified default, gutter markers so color is never the sole signal, collapsed unchanged runs) · **Slider · NumberInput** (position-is-meaning vs precision; slider never without a visible value) · **ChoiceCard** (2–6 described options, selected ring + check) · **HoverCard** (500ms, enhancement-never-requirement rule) · **Popconfirm** (the step between no-confirm and Modal; recreatable single-object actions only) · **ContextMenu** (same Menu at pointer; duplication rule — never the only path) · **CalendarView** (schedules not bookings; viz-tinted events, +N popover) · **Sheet** (Drawer <768px: top-corner radius exception, grab handle, half/full stops) · **NotificationCenter** (unread dots, click-navigates-and-marks-read, consequential actions only open their surface).
- Icon registry: mark-all-read (`check-check`). Manifest rebuilt (51). Browser: five grouped P3 stories.
- Gate caught off-scale 2px radii on calendar event dots during build — corrected to `radius.xs`.

## 5.2.0 — 2026-07-09

P2 — AI-surface completion (roadmap, approved). Component count 37 → 39.

- **Composer** — the Console input, previously unspecified: filled container, attachment input Chips, agent/scope picker, send↔stop morph in place, never-disabled-during-generation, Enter/Shift+Enter with the IME composition guard (Enter mid-composition never sends — the classic KO input bug, now contract), draft persistence, no formatting toolbar.
- **ResponseToolbar** — copy/regenerate/thumbs/overflow on agent messages only; fixed order; hover-reveal desktop, persistent touch/dense; regenerate on latest only; thumbs selection via stroke + tint circle (stroke icon set preserved).
- **ai-patterns §14–17:** reasoning disclosure (subordinate, collapsed, no citations, no auto-expand, redaction renders plainly), guardrail notices (policy ≠ error — neutral shield treatment, names the path forward, never red), human handoff (avatar shape flip carries the state; handing back to the agent is always explicit), usage & limits (ProgressBar usage jurisdiction: warning ≥80%, danger + Banner at 100%; composer never locks on quota).
- Icon registry: send, regenerate, thumbs-up/down, handoff added; shield row widened to one protection-by-rule concept.
- Manifest rebuilt (39 components); browser gains four AI-pattern stories.

## 5.1.0 — 2026-07-09

P1 harness infrastructure (comprehensiveness roadmap, approved). No visual changes.

- **`synapse.manifest.json`** — machine-readable index of the whole system (37 components with variants/rules, typography styles, z-scale, recipes, archetype→density map, consolidated never-list). Built by `tools/build_manifest.py`, which fails on drift from components.md headings; never hand-edited. Agents load this before prose.
- **Screen-intent schema + validator `page` mode** — agents declare archetype/regions/components/locales/states/permissions before generating; `validate.py page` enforces (SY100–109: archetype validity, density-boundary rule, closed component set, mandatory ko+en, state completeness, viewer context). design.md §4 workflow now starts with the declaration.
- **Z-layer scale** — `--sy-z-{sticky,dropdown,drawer,modal,toast,tooltip}` (100–600); arbitrary z-index forbidden.
- **`icons.md`** — closed concept→icon registry (~70 concepts, Lucide names, bidirectional mapping); the agent glyph is the sole AI iconography (`sparkles`/`bot` permanently forbidden); unlisted concepts get no icon.
- **Agent-markdown rendering rules** (ai-patterns §12) — heading demotion, code/table/link/blockquote/image mappings, streaming-safe block rendering; remote images never fetched.
- **Permission-aware rendering** (patterns §6) — disabled+reason vs hidden rule; permission resolved at render time; intent schema carries viewer context.

## 5.0.4 — 2026-07-09

- Correction: the 5.0.2/5.0.3 sidebar styling never actually rendered — the storybook rewrite had dropped the `.sidebar` CSS class, so the sample nav had no flex container, gap, or surface fill, and the "fix" patched a ghost. Now properly styled at a verified anchor. Item gap raised 2px → 4px in both Sidebar and Menu specs (2px proved sub-perceptual — the point is visible separation between adjacent hover/active tints).

## 5.0.3 — 2026-07-09

- Menu items gain a 2px vertical gap (adjacent hover/selected tints were fusing into one block); separators adjusted. Popover spec also corrected to reference `border.overlay` (missed in the v4.0 sweep).
- Button label & icon policy closed (previously only partial rules existed): text-only is the default; icon+text limited to accent AI actions and toolbar/filter contexts with approved icons; trailing icons limited to menu chevron and external-link; label format consolidated (label style, sentence case, verb-first EN / noun·-하기 KO, "…" for in-progress or follow-up-step actions only).

## 5.0.2 — 2026-07-09

Two spec gaps exposed by the sample pages (visual QA):

- Sidebar container padding was never specified — now 12px, with item padding-x 8, 2px item gap, and 16px top padding above group labels written into the spec. Workbench sample fixed to spec metrics (32px items).
- New bilingual rule (foundations §2.3.9): `text-wrap: balance` on display styles, `heading-xl/lg`, and hero/empty-state explanation paragraphs (`.sy-balance` utility) — short centered text breaks into even lines instead of an orphaned fragment, which Korean `keep-all` otherwise makes severe. Long-form body exempt.

## 5.0.1 — 2026-07-09

- Browser: new "Sample pages" group — three full screens composed strictly from shipped tokens/components: Workbench (dense: sidebar, R6 filter bar, R4 stat grid, framed table with dot statuses and totals row), Object detail (focus: R1 header with lg badge, tabs, flat key-value card, agent proposal, activity steps), First run (guided: Artific display title, pill primary, stepper). Both densities and all Tier A/B decisions visible in context.

## 5.0.0 — 2026-07-09

"Sleek" restyle, Tier B — all five signature moves approved. Visual-breaking.

**Migration notes:**
- **B1** `secondary` Button is tonal: `action.secondary-bg` fill (new tokens, gray-100/gray-800), no border; outlined secondaries no longer exist. Ghost stays transparent — that split is the disambiguator. ButtonGroup `attached` segments separate with explicit 1px dividers.
- **B2** Inputs are filled: `bg.sunken`, borderless; hover steps the fill, focus rings and switches to `bg.page`, error draws `border.error` on the fill. Select/Combobox/DatePicker triggers inherit.
- **B3** Table status columns default to Badge `dot` + text; `solid` is the opt-in for ops/monitoring views (reverses 3.8.4 by approved proposal — dots also solve the highlight-melt problem that motivated it).
- **B4** `primary` Buttons may be pill (`radius.full`) in Guided heroes and empty-state first-use only.
- **B5** Card default is `flat` (bg.surface, borderless); the bordered style is now the `outlined` variant, required for `interactive` cards (clickability needs an edge) and `stat` cards.

## 4.0.0 — 2026-07-09

"Sleek" restyle, Tier A (proposals/2026-07-09-sleek-restyle.md, approved). Visual-breaking.

**Migration notes:**
- Radius scale rebased: sm 6→8, md 8→10, lg 12→16 (xs 4 and full unchanged). Validator radius scale updated; any hardcoded 6/12px radii are now violations.
- `border.default` (light) quieted to new primitive gray.175 #E9E9ED. Floating layers (menus, popovers, toasts, tooltips, calendar) switch to new `border.overlay`: transparent in light — the softened `shadow.overlay`/`shadow.modal` (8/24 · 24/48, lower alpha) carries the edge — visible in dark.
- Focus tables are frameless: bare `fg.tertiary` header on the page bg + hairline rule, no outer border, no header fill. Dense/scrolling tables keep the frame (pinned columns and scroll edges need it).
- `heading-xl` 600→700 with −1% Latin tracking; `heading-lg` gains the tracking (Hangul exempt on both).
- Focus density: `section-gap` 32→40, `card-padding` 24→28 (new space.28 step). Dense untouched.
- Motion finish rule (foundations §6, mandatory): interactive elements never snap — bg/border/color transition at instant–fast, standard easing. `hover-lift` sanctioned for interactive Cards.

Tier B items (tonal secondary, filled inputs, status quieting, pill CTAs, flat-default cards) pending individual rulings.

## 3.8.4 — 2026-07-09

- Table status columns now use `solid` badge emphasis as the standard (third iteration of the highlighted-row differentiation problem: outline read poorly, lightened highlight stayed murky; solid's mid fills + white text differentiate on any row state). Badge solid jurisdiction rewritten as two contexts: urgent marks (one-solid-per-view cap holds) and table status columns (cap does not apply; in-table urgency is carried by hue, not emphasis). The v3.8.3 lightened `bg.selected` stays — revisit if selection now reads too faint with solid badges no longer needing it.

## 3.8.3 — 2026-07-09

- Reverted 3.8.2's outline-badges-in-tables ruling after visual review; took the other branch: `bg.selected` lightened gray.150 → gray.100 (light mode; `selected-hover` follows to gray.150). Badge tints now differentiate on highlighted rows and tables keep subtle badges. Accepted trade, recorded in the token: selected now sits very close to `bg.hover`, so selection leans on its secondary cues (checkbox in tables, `fg.primary` + weight in nav, check in menus, ring on cards). Dark mode unchanged. Watch item for Storybook QA: selected-state visibility in menus and the command palette.

## 3.8.2 — 2026-07-09

- Table `status` renderer guidance hardened: tables with row selection (or dense tiling) use `outline` or `dot` badge emphasis — subtle tint fills sit at near-identical luminance to `bg.selected` and lose differentiation on highlighted rows; `subtle` is reserved for selection-free focus tables. Chosen over lightening `bg.selected`, whose blast radius (menus, nav, palette, chips, pagination) and proximity to `bg.hover` made global lightening the worse trade. Browser table stories converted to outline badges.

## 3.8.1 — 2026-07-09

- Browser: size ladders completed for all multi-size components — Avatar now shows all five sizes (20–56, labeled, incl. 56 agent) ahead of the dot/group demos; Spinner shows both 16 and 20 with their jurisdictions; Modal/Drawer story gains a half-scale width comparison (400/480/640). Button and Badge already displayed theirs.

## 3.8.0 — 2026-07-09

- Badge shape axis loosened from jurisdiction-bound to a view-level style choice: `rounded` is now available at any size/context as the view's chosen shape (it remains the default expectation in dense tables and code-adjacent contexts). This legalizes the previously impossible `rounded lg` combination; the size × shape matrix now renders all four cells. One-shape-per-view still holds.

## 3.7.3 — 2026-07-09

- Button active/pressed state unified with hover: `action.primary-bg-active` and `action.accent-bg-active` now alias their hover values (tokens kept so the states can diverge later without an API change); danger already shared its hover/pressed fill. Button spec updated — pressed feedback comes from the interaction, not a third fill.

## 3.7.2 — 2026-07-09

- Primitive red.400 retuned #E4615C → #DB504D (danger resting fill was its only consumer; the ramp had no step between 400 and 500). Resting danger deepens from salmon toward true red; white label contrast improves 3.41 → 3.99:1; hover (red.500) remains a clear darkening step; ramp stays luminance-monotonic.

## 3.7.1 — 2026-07-09

- Danger solid arrangement swapped after visual review: resting fill is now the lighter red.400 #E4615C (~3.4:1, §8 policy + semibold labels), hover/pressed darkens to red.500 #D2403E (AA). Restores the conventional darken-on-hover cue while keeping the lighter resting palette. Applies everywhere `danger-bg-solid` is used (danger buttons, solid danger badges/banners, failed progress fills).

## 3.7.0 — 2026-07-09

Danger hover lightened (inventory item 9; all other deep fills kept by maintainer decision).

- `status.danger-bg-solid-hover` red.600 #B23230 → red.400 #E4615C: danger buttons now lighten on hover (precedent: dark-mode primary). White label runs ~3.4:1 on hover, added to the §8 policy surfaces; danger Button labels upgraded to semibold per weight compensation.
- §8 weight rule scope corrected: 600 minimum applies to text on solid fills below 4.5:1, not to AA-passing solids (primary/accent keep normal label weight).
- Kept as-is by decision: the key-black family (primary buttons, checked selectors, calendar endpoints, stepper, tab underline, "New" marker, selected outline, scrim), status text colors (AA-bound), diff tints, AgentStep icons (thin strokes need the darker value), dark-mode deep surfaces.

## 3.6.0 — 2026-07-09

Lighter indicator fills.

- Status dots (Badge `dot` emphasis, Avatar presence/run-state dots) now use the mid `status.*-bg-solid` values instead of the darker text tokens — dots are non-text, so the 3:1 floor applies and 500-level fills clear it.
- ProgressBar `default` fill changed from key-black (`action.primary-bg`) to a new neutral mid-gray `meter.fill` token (gray-500 light / gray-400 dark); success flash now uses `status.success-bg-solid`. AI variant (blue.500) and failed (red.500) were already mid-value.

## 3.5.1 — 2026-07-09

- Weight compensation added to the solid-label contrast policy (foundations §8): all text on solid fills is semibold (600) minimum — low contrast punishes thin strokes hardest. Solid Banner text upgraded from `body-sm` regular to 13px semibold; `lg` solid badges upgrade their label to 600; `md` badges were already 600 via `micro`.

## 3.5.0 — 2026-07-09

Solid labels return to white text under a documented contrast policy.

- Maintainer decision: dark-on-bright solids (3.4.0) reverted; all solid fills pair with `fg.on-solid` white. Success/warning solid fills move to 500-level primitives (#1F9D5B, #BA7C14) — mid-tone, clearly brighter than the original 600s — running ~3.5:1 with white.
- Policy recorded in foundations §8: solid Badge labels and solid Banner strips accept ≥3:1 (short semibold labels only, never sentences); everything else holds AA 4.5:1. The validator enforces exactly this split. Flagged consequence: this is the line item a formal WCAG/VPAT audit will surface; reverting to 600-level fills restores full conformance.
- `status.success-on-solid` / `status.warning-on-solid` tokens removed (introduced in 3.4.0, superseded same day).

## 3.4.0 — 2026-07-09

Status color recalibration — livelier without breaking AA.

- Status text (light mode): green.600 #146B3D → #0E7A42, amber.600 #7E5309 → #8C5A00 — chroma raised at held luminance, so contrast on tints stays ≥4.5 while the colors stop reading muddy. Blue/red text unchanged (already mid-tone). Dark-mode `*-inverse` values follow the primitives.
- Solid fills rebalanced by hue: info → blue.500 #3D63DD (lighter, white text); success → bright green.400 #2FAF6D with new dark `status.success-on-solid` (green.950); warning → bright amber.300 #D99A27 with `status.warning-on-solid` (amber.950). Danger stays #D2403E + white — the one hue where a bright fill with dark text reads wrong. Rationale: fills only need to be dark when their text is white; splitting text color by hue is what lets green/amber solids get bright.
- Badge/Banner solid specs updated with the pairing rule; forbidden to cross-pair. Validator contrast matrix extended with the on-solid pairs.

## 3.3.2 — 2026-07-09

- Avatar status dots resized: the flat 25% ratio produced sub-legible dots. Now a fixed per-size map — 24→8px, 32→10px, 40→12px, 56→14px — and the 20px avatar never carries a dot (state surfaces elsewhere in the row).

## 3.3.1 — 2026-07-09

- Badge `dot` emphasis: dot enlarged 6px → 8px (6px under-weighted against 13px text and neared invisibility at a glance in dense lists). Avatar status dots are unaffected — they scale at 25% of avatar size.

## 3.3.0 — 2026-07-09

DatePicker time entry + calendar style fix.

- DatePicker variants formalized as a closed set: `date` · `range` · `datetime` · `time`. `datetime` adds a full-bleed footer time row to the calendar (typed 24h HH:MM, 15-minute arrow stepping, blur normalization, mandatory timezone label). `time` is a standalone field; durations stay Input `number` + unit. `range` endpoints may carry time fields only for datetime windows.
- Browser: calendar no longer inherits the data-table styles (header-row surface fill and row hover were bleeding into day cells); datetime and time-only demos added.
- Badge optical-centering scope finalized (3.2.x follow-ups): 1px nudge on `md` only; `lg` and Chip use plain flex centering.

## 3.2.1 — 2026-07-09

- Badge matrices completed: color × emphasis now includes the `category` row (subtle only — spec clarified: taxonomy is never urgent, outlined, or a dot), and a new size × shape matrix shows md/lg × pill/rounded with `rounded lg` marked impossible (contradictory jurisdictions: lg = page headers, rounded = dense tables).

## 3.2.0 — 2026-07-09

Badge sizing and micro legibility.

- Badge `lg` size added (24px, `label-sm` text, padding-x 12): jurisdiction-bound to page headers beside `heading-xl`+ titles (R1) and hero/empty-state contexts. Never in tables, lists, or dense regions — `md` stays the constant recognition size there. One size per view. R1 updated.
- `micro` typography style weight raised 500 → 600 system-wide (badges, kbd hints, group labels): the floor size carries the reinforced weight — 500 fuzzes at 11px, especially in Hangul; 700 clogs counters. Rationale recorded in the style token.

## 3.1.0 — 2026-07-09

Restricted solid badges — each with one named job.

- Badge `neutral` solid enabled: **release markers only** ("New"/"신규", "Beta"/"베타"), `bg.inverse` + `fg.inverse`, max one per view, must expire within a release cycle with expiry ownership assigned. Renders in the key color, so any other use reads as a primary action — forbidden.
- Badge `ai` solid enabled: **live-activity beacon only** (`action.accent-bg` + `accent-fg`), visible strictly while an agent operates on the current surface, disappears on completion, max one per screen, never adjacent to an `accent` Button. Static agent states stay `ai` subtle.
- Solid emphasis is now governed by a per-color jurisdiction table in the Badge spec; the matrix's "—" cells are replaced with the two restricted renders.

## 3.0.0 — 2026-07-09

Tag removed; Badge/Chip split along the static/interactive line.

**Breaking — migration map:**
- `Tag` component removed. If it can be clicked, it's a **Chip**; if it only informs, it's a **Badge**.
  - Removable selections (Combobox multi, applied filters) → Chip `input`
  - Toggleable filter chips → Chip `filter`
  - Clickable taxonomy labels → Chip `category` · static taxonomy display → Badge `category` (new color variant)
  - Read-only outline metadata → Badge `outline` emphasis (rounded shape)
- Table cell renderer `tags` renamed `labels` (category Badges static / Chips in click-to-filter views).

**Added:**
- Badge shape axis: `pill` (default) and `rounded` (`sm` radius, dense-table contexts). One shape per view — mixing shapes is forbidden. New `category` color variant (viz hashing).
- Chip component (count unchanged at 37 entries): closed variants `input`, `filter`, `category`, `suggestion` (agent-proposed actions, `ai.*` surface, Console/empty states only, max 3). Rounded radius is the interactivity marker against pill badges. Chips never carry commands.

## 2.2.0 — 2026-07-09

Primitive palette completion and visibility.

- Chromatic primitive ramps (blue, green, amber, red) filled out to complete 11-step scales (50–950); all pre-existing anchor values unchanged, so no semantic token resolution shifted.
- New "Primitive palette" story in the component browser: full ramps with step names and hex values, with the guardrail stated — primitives are never exposed as CSS variables; only the semantic layer references them (hard rule 1 / SY001).

## 2.1.0 — 2026-07-09

Terminology, semantic color depth, and matrix previews.

- Renamed "type roles" → "typography styles" across docs and browser UI ("Typography" in the sidebar). `.sy-type-*` classes and the `semantic.type` JSON key are unchanged (non-breaking).
- Typography specimen now states each style's full spec: family · size/line-height · weight, including both density resolutions for density-bound styles.
- New semantic tokens: `bg.selected-hover`, `bg.disabled`, `fg.placeholder`, `border.error`, `action.primary-bg-active`, `action.accent-bg-active`, `status.danger-bg-solid-hover` (gap exposed by the button matrix — danger buttons had no hover/pressed fill).
- New foundations §1.4: token selection map — the full use-case → token table.
- Browser: color story now shows every semantic token grouped by family (56 tokens); Button gets a variant × state matrix (5×6 incl. simulated hover/active/focus), Badge a color × emphasis matrix (6×4), Banner a color × emphasis matrix (5×2). Impossible combinations render as "—" by design (e.g. neutral solid).

## 2.0.0 — 2026-07-09

Major revision ahead of the Storybook build: role-based typography, explicit layering model, variant expansion across the component set, and preset recipes.

**Breaking / visual changes (migration notes):**
- Toast and Tooltip switch from inverse to same-scheme surfaces (`bg.raised-2` + border + `shadow.overlay`). Anything styled "Toast-like" must follow. The `*-inverse` tokens remain valid for true `bg.inverse` surfaces but are no longer used by any core component.
- Menu dividers are now full-bleed (edge to edge through container padding); inset dividers are forbidden everywhere (foundations §3).
- Raw type styling deprecated: typography must go through the 19 type roles (`semantic.type` / `.sy-type-*`). Existing size tokens remain, but role-less font declarations now fail intent review.
- Card nesting guidance changed: bordered-card-in-card remains forbidden; the new `flat` variant is the sanctioned inner grouping.

**Added:**
- Type roles (display-xl…stat-sm) incl. new gaps found in audit: `display-xl` 44/56, `heading-sm` (density-bound), `body-lg` reading role, `body-sm` fixed 13, `stat-*` tabular trio. New primitives: size 44/56.
- Layering model L0–L3 + well (foundations §1.3); new tokens `bg.raised-2`, `border.selected`, `fg.on-solid`, `status.{info,success,warning}-bg-solid`.
- Badge: emphasis variants (subtle/solid/outline/dot), `ai` color, count badge. Tag: outline + system-assigned `colored` variants. Avatar: sizes 20/56, presence and agent-state dots, AvatarGroup.
- Card: `flat`, `elevated` (sole sanctioned static shadow), `ai`, `stat` variants + `selected` modifier. Banner: `neutral` color + `solid` emphasis (app-wide critical strip).
- Mixed-state convention across all selectors (checkbox minus, centered switch thumb, "Mixed"/"여러 값" in text controls).
- Table: closed cell-renderer set (18), expandable rows, totals row, header info/unit conventions, em-dash empty cells.
- Combobox conveniences: search-in-menu, select-all on filtered set, groups, descriptions, recent, async load-more, virtualization. Menus >8 items may carry a search row.
- New components (35 → 37): DescriptionList, ButtonGroup (attached + split).
- New `recipes.md` (R1–R12): page/section/card headers, stat grid, action pairs, filter bar, toolbar, form section, stepper, topbar, key-value panel, empty page.

## 1.5.0 — 2026-07-09

Enforcement tooling — the contract is now a gate, not an honor system.

- New `tools/validate.py`: `tokens` mode (reference resolution + full WCAG AA contrast matrix per mode) and `ui` mode (SY001–SY014: raw colors, off-scale values, font violations, italics/uppercase, undefined variables, raw shadows, line-height floors, Hangul outside lang="ko", glossary terms, exclamation marks, primary-button count). Exit 1 on errors.
- New tokens the gate forced into existence: `action.danger-fg`, `fg.link-inverse`, `status.{info,success,warning,danger}-inverse` (readable status/link colors on `bg.inverse` surfaces such as Toast).
- Violations the gate caught in our own preview, now fixed: raw `#fff` on the danger button, viz tokens misused as toast icon/action colors, Hangul outside a lang scope, off-scale radius/padding.
- Two techniques codified as sanctioned exemptions (foundations §3, §5): ±1px hairline offset with a 1px border; `inset 0 0 0 1px` border-token ring as a border substitute.

## 1.4.0 — 2026-07-09

Content and terminology system.

- New `content.md`: voice rules, EN/KO register (sentence case; 합니다체), closed terminology glossary with forbidden alternatives (product nouns, standard actions, status vocabulary), template rules including Korean particle handling, error-message catalog, date/number/currency formats, punctuation mechanics, agent speech rules, glossary governance.
- design.md: hard rule 9a (glossary compliance), self-audit item, file map entry.
- Consistency fixes surfaced by the new glossary: "완료됨" → "완료" (components.md Badge example), bar-chart status label "취소" → "취소됨" (preview).
- No token value changes.

## 1.3.0 — 2026-07-09

Workhorse components for complex product surfaces.

- New components (28 → 35 entries): Combobox (single/multi with tags, async, creatable), DatePicker (single/range, locale formats, preset rail), SegmentedControl, Accordion, FileUpload (dropzone + button, per-file progress), SplitPanel (resizable, sanctioned mixed-density boundary), Chart (closed type set, axis/legend/tooltip anatomy, loading/empty/error states).
- Table: advanced behaviors added — column resize/pin/hide/reorder with a closed column-menu set, bulk selection bar, inline edit, one-level grouping, virtualization above 200 rows.
- Select's jurisdiction narrowed to 5–15 static options; larger/async sets now belong to Combobox.
- patterns.md: workbench split now references SplitPanel; chart guidance delegates to the Chart component.
- No token changes.

## 1.2.0 — 2026-07-09

Added the AI-native interaction layer.

- New `ai-patterns.md`: streaming, AgentStep working states, tool calls, human-in-the-loop approval, provenance, uncertainty vocabulary, interruption, attribution, failure/recovery, long-running work, palette-as-AI-entry.
- New components (closed set 23 → 28 entries): CommandPalette, ProgressBar, AgentStep, ProposalCard, SourceChip. Also corrected the entry count claimed in `components.md` (previously stated as 19; the accurate count is one per `##` heading).
- New tokens: `semantic.color.ai.{surface,border,fg}` (light/dark), primitives `blue.50`, `blue.950`. `ai.*` is semantically distinct from `status.info-*` — do not substitute.
- design.md: hard rule 7a (AI marking + no silent execution), self-audit item for AI surfaces, file map entry.
- preview.html: AI patterns section.

## 1.1.0 — 2026-07-09

- Added Artific as `font.family.display` (brand moments only; weights 600/700; no Hangul — intentional Pretendard fallback; self-hosted, license required).
- Codified mono jurisdiction (code, IDs, logs, kbd hints — never quantities); added `.sy-display`, `.sy-code-inline`, `.sy-code-block`, `.sy-kbd`.
- Rebuilt preview.html as a full component gallery.

## 1.0.0 — 2026-07-09

Initial system: tokens (light/dark × focus/dense), foundations, 19 components, page archetypes, agent contract and governance. Status color values corrected during initial verification to meet WCAG 2.1 AA in both modes.
