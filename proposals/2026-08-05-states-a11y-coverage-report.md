# States / A11y slot coverage — promotion record + gap worklist — 2026-08-05

**Status: EXECUTED (promotions) + OPEN (gaps need June's spec authoring).** Background track A of the manifest single-sourcing work (adoption ruling #1): the parser can only project what the prose slots state, and 43/68 entries had no `**States:**` slot, 43/68 no `**A11y:**`. Every entry was read and classified. Facts the prose already stated were PROMOTED into slots (the ratified pattern from the Sizes/Variants promotion — compression only, zero new claims). Entries whose prose genuinely lacks coverage were NOT patched — inventing a state model or an aria contract is spec authoring, not promotion. This file is the worklist.

**Coverage: States 25 → 57/68 · A11y 25 → 47/68.**
Classification tally — States: 32 promoted · 5 static candidates (+1 inherits-by-reference) · 5 genuine gaps. A11y: 22 promoted · 21 genuine gaps.

## 1 · Promoted (slot added; text compressed from the entry's own prose)

**States (32):** Link · Textarea · Checkbox · Radio · Switch · Card · Table · FileUpload · SplitPanel · Sidebar (app navigation) · Popover / Menu · Tooltip · Toast · Avatar · ResponseToolbar · AnswerHeader · VariantPager · FloatingPill · SelectionPill · FollowUpPanel · ConversationSummary · DescriptionList · ContextCard · Timeline · Tree · CodeBlock · DiffView · MediaGroup · Slider · NumberInput · ChoiceCard · HoverCard · Popconfirm · CalendarView · NotificationCenter. The slot text is in each entry (and now in the manifest's `states` field); each is a compression of that entry's Anatomy/Behavior prose — e.g. Table's row hover/selected/empty/loading/invalid-edit-cell came from its Behavior paragraph and inline-edit bullet; Avatar's slot is the status-dot vocabulary (presence for humans, run state for agents), which is the only state model the entry states.

**A11y (22):** Link · Badge · Chip · Card · Table · DatePicker · FileUpload · Chart · Tooltip · Drawer · CommandPalette · Composer · SourceChip · Tree · DiffView · MediaGroup · Slider · NumberInput · HoverCard · ContextMenu · GraphCanvas · FlowNode · Edge · RunLog · AppLauncher. Sources: keyboard contracts (Composer's Enter/IME law, CommandPalette's full-keyboard Behavior line, Tree's Keyboard slot), stated aria facts (DatePicker `aria-disabled`, Chip/FileUpload required `aria-label`s), and stated colorblind-safety channels (Chart, DiffView).

## 2 · Static candidates (no slot added — no state model exists by design)

| Entry | Why static |
|---|---|
| Badge | "Never interactive" is its contract; the status VOCABULARY lives in content.md §3.3, not in Badge states. |
| Banner / Alert | Persistent notice; dismissal is an event, not a state the entry models. |
| Skeleton · Spinner | It IS a state renderer (someone else's loading state); holds none of its own. |
| EmptyState | The three flavors are variants; it renders an absence, holds no interactive state. |
| Divider | A 1px rule. |
| ContextMenu *(inherits)* | "The Menu component, opened at pointer" — its state model is Popover / Menu's, by reference. An explicit "inherits" marker would be new contract vocabulary — June's call. |

If June wants these machine-readable (an explicit `static`/`inherits` marker so the manifest distinguishes "no states by design" from "unspecified"), that is new slot vocabulary and needs a ruling.

## 3 · Genuine gaps — spec authoring needed (June's worklist)

### States (5)

- **Breadcrumb** — only the current-page tint distinction is stated; link hover/focus and the "…" overflow-menu open state are unstated.
- **Modal** — no state model at all: busy/submitting footer behavior, open/close motion, scrim interaction unstated; notably **dismissal (Esc / scrim-click) is stated for Drawer and CommandPalette but never for Modal itself**.
- **Drawer** — no state enumeration (open/closing; whether non-blocking-vs-scrimmed is a state or a variant); its stated Esc/scrim dismissal was promoted to A11y.
- **Pagination** — only the current-page `bg.selected` tint is stated; prev/next disabled-at-the-ends, loading, and keyboard model unstated.
- **ButtonGroup** — whether segments inherit Button's states, whole-group vs per-segment disabled, and the split-menu open state are all unstated.

### A11y (21)

- **Modal** — nothing stated on the system's primary blocking surface: focus trap, initial focus, focus return, Esc/scrim dismissal, `role="dialog"`/`aria-modal`.
- **Popover / Menu** — the base menu has NO keyboard model: arrow traversal, type-ahead, Esc-close, focus return, menu/menuitem roles (Select cites "listbox pattern" for itself; the Menu that everything else reuses states nothing).
- **ProposalCard** — the human-in-the-loop approval surface has no focus-order, resolution-announcement, or diff-accessibility spec (the entry only forbids a default-focused Approve-all).
- **Toast** — no live-region spec (`role="status"`/`aria-live`), no announcement rule for stacked toasts, no keyboard reach for the action/dismiss on a transient surface.
- **ProgressBar** — no `role="progressbar"`/`aria-valuenow`; completion never announced; the 1.2s indeterminate sweep has no `prefers-reduced-motion` behavior.
- **Sidebar (app navigation)** — no nav landmark, `aria-current`, or keyboard spec; the collapsed rail's tooltip-labels have no stated focus behavior.
- **Breadcrumb** — no `nav` landmark or `aria-current="page"`; the overflow "…" menu has no keyboard/label spec.
- **Banner / Alert** — no `role="alert"` vs `role="status"` distinction (solid app-critical vs subtle notice); dismiss-button semantics unstated.
- **Avatar** — no accessible-name spec (image alt / initials fallback); the status dot's meaning has no stated non-visual channel.
- **Skeleton · Spinner** — no `aria-busy`/live-region spec; the 1.5s pulse has no stated `prefers-reduced-motion` behavior.
- **EmptyState** — no heading-level or announcement spec; the error flavor's Retry has no stated post-retry focus behavior.
- **Pagination** — no `nav` landmark, `aria-current` on the current page, or disabled-end semantics.
- **ResponseToolbar** — icon-only actions lean on Button's global `aria-label` rule but the entry states no labels, no toolbar semantics, no roving focus.
- **ContextCard** — an interactive card with no element spec: button or link, focus behavior, stack-expansion semantics.
- **Timeline** — no feed/list semantics; relative timestamps have no accessible absolute (only hover is stated).
- **CodeBlock** — no region/label semantics; copy-button label unstated; line-number selection-exclusion has no announced equivalent.
- **Popconfirm** — initial focus (Cancel vs confirm), role, and focus return unstated on a confirm surface.
- **CalendarView** — no grid semantics or keyboard date-navigation spec.
- **NotificationCenter** — panel role (dialog vs region), focus entry, and announcement of newly arrived items unstated.
- **PivotTable** — no header-scope association for aggregated cells (row + column dimension headers) and no keyboard spec.
- **AssistantPanel** — launcher toggle semantics, focus into/out of the docked panel, and Esc behavior unstated.

## Found while reading (not this track's to fix)

- **EmptyState's Key rules bullets are stale against its own prose**: "no illustrations in v1" and "icon medallion: sunken circle + two concentric hairline rings" both predate the line-illustration redesign the entry now specifies (the prose explicitly calls the medallion retired). The machine index currently contradicts the entry it sits in; SY021 does not catch it (it checks token/radius/never-list vocabulary, not this). Needs a bullet rewrite under the ratified key-rules-in-prose regime.
