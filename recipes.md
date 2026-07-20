# Synapse recipes

Preset multi-component assemblies. A recipe is a fixed composition: exact typography styles, spacing, and ordering. When a screen needs one of these assemblies, the agent uses the recipe verbatim rather than composing from scratch — improvised variations of a recipe are contract violations. Assemblies not covered here are composed from `components.md` under `patterns.md` rules; recurring improvisations should be proposed as new recipes (`design.md` §6).

Each recipe: structure top-to-bottom / left-to-right, with typography styles and spacing tokens.

---

## R1 · Page header

The top block of every Object and Workbench page.

```
[Breadcrumb]                                    ← only if depth > 2
space-4
[heading-xl page title]  [Badge status, size lg] [actions: ≤1 primary/accent + ≤1 secondary + overflow menu]
space-4
[caption fg.tertiary meta line: owner · updated timestamp · id]
space-24
```

Title truncation forbidden; long titles wrap. Actions right-aligned, vertically centered on the title line. Meta line items separated by "·".

## R2 · Section header

Above any content section or data region.

```
[heading-lg]  [count Badge]                     [≤1 secondary or ghost action]
space-4
[body-sm fg.secondary one-line description]     ← optional
space-16
```

Never more than one sentence of description — longer explanations go to a docs link.

## R3 · Card header

Inside Card: `heading-md` (or `heading-lg` for page-dominant cards) + optional trailing ghost action or SegmentedControl; full-bleed `border.subtle` rule below; header padding = card padding.

## R4 · Stat grid

2–6 `stat` Cards in an equal-column grid, gutter `space-24`.

Stat card internals (fixed order): `label` `fg.secondary` title → `stat` value (`stat-lg` if the grid has ≤3 cards; stat styles carry −1% numeral tracking, v6.4) with optional right-aligned **sparkline** on the same baseline row (64×24, 1.5px `viz.1` stroke, no fill, `aria-hidden`) → **delta row** (v6.4): 12px `trend-up`/`trend-down` registry icon + 12 medium tabular text, colored by direction of *goodness* (`status.success`/`status.danger`) — never a Badge (a badge inside a stat card is a box inside a box) → `caption` `fg.tertiary` comparison period ("vs last week" / "전주 대비").

## R5 · Action pair & footer conventions

- Dialog/form footers: right-aligned, `[secondary "Cancel"] [primary confirm]` — confirm always rightmost, gap `space-8`. Destructive: `[secondary "Cancel"] [danger confirm]`.
- Page-level forms: same pair pinned to the section bottom, never floating-sticky when only one section exists.
- Never two adjacent primaries; a third action becomes `ghost` leftmost ("Edit") or goes into an overflow menu.

## R6 · Filter bar

Above any filterable data region:

```
[search Input, max 320px] [filter Combobox/Select ×≤3] [DatePicker range] ··· [ghost "Clear" — only when ≥1 filter active] [right: view SegmentedControl / column menu]
```

Single row, gap `space-8`, wraps on narrow viewports (search full-width first). Active filters render as removable input Chips in a second row when they don't fit inline. "Clear" removes all; it never hides.

## R7 · Toolbar

Dense workbench control strip: height 40px, items gap `space-8`, groups separated by full-height 1px `border.subtle` dividers with `space-12` on both sides. Icon-buttons from the approved list; text buttons `ghost`/`secondary` sm. Max 3 groups; overflow into a ⋯ menu.

## R8 · Form section

```
[heading-md]  +  optional [body-sm fg.secondary description]
space-16
[fields, stack-gap]                              ← single column, patterns.md §3
space-24
```

Every 3–6 fields get a new section. Sections separated by full-bleed `border.subtle` + `space-24` in long forms.

## R9 · Stepper

Sequential flow indicator for Guided archetypes (composed, not a component). **Numeral discipline (v6.24):** step numbers are `600 11px/1` tabular — line-height 1 is mandatory inside the 20px circle (inherited line-heights sit the digit low); rings are **1.5px** (2px outweighs an 11px numeral; 1.5 matches AgentStep's pending-dot ring):

```
[step dot/number 20px] — [label label-role] — [connector 1px border.default line] — …
```

States: done (key-color fill + check), current (key-color ring + `fg.primary` label), upcoming (`border.strong` ring + `fg.tertiary` label). Compact variant: "2/4" `label` `fg.tertiary` + 4-dot row. Horizontal ≤5 steps; vertical with descriptions for onboarding checklists.

## R10 · Topbar

App-frame top strip (when a product surface needs one in addition to Sidebar): height 48px, `bg.surface`, full-bleed bottom `border.subtle`. Left: context (workspace switcher — ghost Button: **20px squared monogram tile** (`bg.inverse` fill, `fg.inverse` letter, radius `xs` — the frame's one deliberate dark object, v6.7) + workspace name + chevron). Center: nothing (search lives in ⌘K). Right: solid Banner slot (system-critical only) never here — it pins *above* the topbar; then notification bell (icon-button + count Badge), help, Avatar 32 menu.

## R11 · Key-value panel

Object summary block: Card (`flat` default, `outlined` when it must read as a separable object) + DescriptionList `side-by-side`, grouped under `heading-sm` titles every ≤10 rows; row hover reveals copy/edit ghost actions. Standard row order: identity (name, ID) → state (status Badge, owner) → timestamps (created, updated) → configuration.

## R12 · Empty page (first-run)

Full content-area EmptyState, Guided styling: `display` style title permitted, `body-lg` explanation (≤2 sentences), one primary action (pill silhouette sanctioned here — Button spec v5.0) + optional ghost "Learn more" link, optional Stepper (vertical) for multi-step setup below. No other content on the page — resist filling the whitespace.

## R13 · Error page (403 / 404 / 500)

Full content-area EmptyState on the page background: error icon in the 48px circle · `heading-md` title · one-sentence `body` explanation · one action.

- **403**: "You don't have access to this page" / "이 페이지에 접근할 권한이 없습니다" + the permission-aware reason rule (patterns §6) + "Go to home" secondary. Never reveal what the page contains.
- **404**: "This page doesn't exist" / "존재하지 않는 페이지입니다" — likely-deleted objects get the object-specific not-found copy (content.md §5) + "Go back" secondary.
- **500**: error flavor + Retry primary + incident reference in `code-sm` for support. Chrome (sidebar) stays rendered whenever the shell is healthy — errors are content-region events.

## R14 · Exported report (print / PDF)

Agent-generated reports leave the app; the export is a Synapse surface with no interactivity.

- A4 portrait, 20mm margins; header: workspace name + report title (`heading-lg` equivalent) · footer: generation timestamp + "{n}/{m}" page numbers, both locales' date formats per content.md §6.
- Typography maps px→pt at 0.75 (body 14px → 10.5pt); the display family is NOT used in exports (documents, not brand moments); mono for IDs survives.
- Charts render static with direct series labels (no tooltips to lean on); status is always icon + text (print may be grayscale — color can never be the only channel, which the with-icon Badge variant provides).
- SourceChips convert to numbered footnotes on the page where cited, full source list at document end.
- Page-break rules: never inside a table row, a stat card, or a heading-plus-first-paragraph pair; tables repeat their header row per page.
- No interactive components render in exports: buttons, inputs, and toolbars are omitted, not disabled.

## R15 · Batch-run results (v6.47)

Queue (ai-patterns §29) completion lands here: Table, one row per input item — mono source name · status (dot+text) · count/metric columns (tabular) · per-row 열기 link; failed rows keep 다시 시도 inline. Header carries the aggregate line and 결과 내보내기 (`secondary`). Empty/failed-all uses the standard error EmptyState. Jurisdiction: Workbench archetype.
