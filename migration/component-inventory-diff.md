# Component pool & variant discrepancy — old vs. new

Companion to `color-token-map.md` (colors) and `variant-decisions.md` (color-variant decisions). This covers **components and their variants**.

**Sources — both authoritative, verified 2026-07-30:**

| Side | Source |
|---|---|
| **Old** | `@enhans/synapse` **v0.13.6** — `github.com/viralpick/synapse`. 95 component files, 117 exports, CVA configs read directly. |
| **New** | this repo — `synapse.manifest.json` (59 components), cross-checked against 59 `## ` sections in `components.md`. |

> **⚠️ Source caution.** Do **not** source old-system values from `Downloads/Copy of Synapse Design System` (the branding team's kit). It is built on **v0.9.3**, and the brand family changed between versions: `button-brand` was `#262627` near-black in v0.9.3 and is `#0a84ff` azure in v0.13.6. Both files are internally correct — they are different versions. `proposals/archive/2026-07-15-branding-system-comparison.md` analyses v0.9.3 and is **stale on brand**. All 67 mappable old-side color values in `color-token-map.csv` are verified against v0.13.6.

---

## The two headline structural differences

### 1. Variant density: 24/95 vs 12/59

The old system declares CVA variants in **24 of 95** component files. The new system declares them in **12 of 59**. Both are minorities, but the *kind* of variant differs completely (see #2).

### 2. Multi-axis matrices vs. flat lists — this is the real discrepancy

The old system composes variants from **independent axes**. The new system uses **one flat list**.

**Button is the clearest case:**

| | Old v0.13.6 | New |
|---|---|---|
| Axes | `buttonStyle` (primary, secondary, tertiary, ghost) × `size` (xs, sm, md, lg) × `target` (default, destructive, brand) × `buttonType` (default, icon) | `variant` (primary, secondary, ghost, danger, brand) × `size` (sm, md, lg) |
| Combinations | **96** | **15** |

The old API treats *destructive* and *brand* as **targets applicable to any style** — so `ghost × destructive`, `tertiary × brand`, and `secondary × destructive` all exist. The new API promotes them to styles, which makes them mutually exclusive. **Consequence: an old `ghost destructive` button (a low-emphasis delete action) has no direct new equivalent.** That's the single most likely real capability loss in the migration.

Also gone: `xs` size, and `buttonType: icon` as an axis (the new system handles icon-only via a square rule, not a variant).

**Badge is the second case — 6 axes:**

| | Old v0.13.6 | New |
|---|---|---|
| Axes | `size` (sm, md, lg) × `shape` (rounded, pill) × `badgeStyle` (light, filled) × `theme` (red, purple, slate, gray, blue, green, yellow) × `outline` × `active` | `colors` (neutral, info, success, warning, danger, ai, category) × `emphasis` (subtle, solid, outline, dot) × `shape` (pill, rounded) × `size` (md, lg) |
| Nature of color axis | **7 raw hues** — presentational | **7 semantic roles** — meaning-bound |

The new system's `colors` axis is not a renaming of `theme`; it's a different *kind* of axis. Old `theme: purple` says "make it purple." New `colors: info` says "this means informational." Notable specifics:

- **`purple` has no new equivalent** — the new palette has no purple role. If purple encoded a meaning in the old UI, it needs assigning to a semantic role (or to `category`, which auto-assigns a `viz` color).
- Old `slate` → new `ai` is a **role** now, not a hue choice.
- Old `active` (a boolean) has no new equivalent — the new Badge is static by contract; anything interactive is a Chip.
- Old `badgeStyle: light/filled` maps onto new `emphasis: subtle/solid`, and the new system adds `outline` and `dot`.

---

## Component pool — the mapping

### Same concept, renamed (watch for these — the name change hides the equivalence)

| Old | New |
|---|---|
| `seperator` *(sic)* | `Divider` |
| `resizable-panel` | `SplitPanel` |
| `sheet` | `Drawer` |
| `dialog` | `Modal` |
| `confirm-dialog` | `Popconfirm` / Modal confirm |
| `command` | `CommandPalette` |
| `notification` | `Toast` / `NotificationCenter` |
| `uploader` | `FileUpload` |
| `dot` | Badge `dot` emphasis / Avatar status dot |
| `collapsible-section` | `Accordion` |
| `dynamic-tabs` | `Tabs` |
| `label`, `form-field`, `form-section` | absorbed into component anatomy (Input label is part of Input) |

### Old-only — mostly domain, not gaps

**Commerce/BI domain (no new equivalent, and shouldn't need one):**
`charts/` (13 files — echarts: area, bar, funnel, gauge, heatmap, line, pie, scatter, sparkline, treemap, waterfall, kpi-card, container) · `maps/` (8 files — Kakao Maps) · `data-table/` (17 files — filter, export, bulk-actions, column-order/visibility, conditional-format, editable-cell, row-detail…) · `what-if-panel` · `widget-grid` · `hierarchical-filter` · `filter-preset` / `filter-context` · `cascading-select` · `api-action-button` · `sortable-list` · `theme-switcher` · `conditional-renderer`

The new system has `Chart` as **one** spec'd component and `PivotTable`/`Table`; the old system has a 13-file charting layer and a 17-file datatable layer. That's AgentOS vs. CommerceOS, not a hole.

**Genuine candidates worth a decision:**

| Old-only component | Old variants | Why it might matter |
|---|---|---|
| **`stepper`** | `size` (sm, md) × `stepperType` (fill, outline) × `shape` (default, pill) | Multi-step progress indicator. The new system has `Timeline` and the `guided` archetype but **no Stepper**. A guided flow arguably needs one. |
| **`autocomplete`** | — | New has `Combobox`; verify Combobox covers free-text-suggest, or this is a gap. |
| **`calendar`** | `CalendarDayButton` export | New has `DatePicker` + `CalendarView`; likely covered, worth confirming. |

### New-only — the AgentOS layer

`Composer` · `ProposalCard` · `AgentStep` · `SourceChip` · `ContextCard` · `AssistantPanel` · `ResponseToolbar` · `RunLog` · `GraphCanvas · FlowNode · Edge` · `DiffView` · `CodeBlock` · `MediaGroup` · `Timeline` · `Tree` · `ChoiceCard` · `HoverCard` · `ContextMenu` · `DescriptionList` · `ButtonGroup` · `ToggleButton` · `AppLauncher` · `EmptyState` (old has one too) · `Skeleton · Spinner` (old has both separately)

No action — these are the new system's reason to exist.

---

## Shared components — variant-level diff

This is where add-vs-squash decisions actually live.

| Component | Old axes | New | Discrepancy to decide |
|---|---|---|---|
| **Button** | 4 axes / 96 combos | 5 variants × 3 sizes | **`ghost×destructive`, `tertiary×brand`, `secondary×destructive` have no equivalent.** Also lost: `xs` size. |
| **Badge** | 6 axes | 4 axes, semantic | **`purple` unmapped**; `active` boolean dropped (Badge is static now). |
| **Alert** | `variant` (default, destructive) | `colors` ×5, `emphasis` ×2 | New is **richer**. Old had only 2 states; nothing lost. |
| **Tabs** | `variant` (segmented, fill, line) × `size` | no variants; `SegmentedControl` is separate | Old `segmented` → new `SegmentedControl`; old `fill` → **no equivalent**. Decide whether `fill` tabs are needed. |
| **Input** | `size` (sm, md) × `isFilled` | no variants | `isFilled` is **deliberately** gone — the new system reverted filled→outlined because the filled fill read as disabled. Squash. |
| **Card** | **no CVA variants** | 5 variants (flat, outlined, elevated, ai, stat) | New is richer. Nothing lost. |
| **Chip** | `size` × `shape` × `disabled` | 4 semantic variants | Old was presentational, new is role-bound (`input`/`filter`/`category`/`suggestion`). Check each old call site maps to a role. |
| **Progress** | `variant` (default, **stripped**) × `size` | `default`, `ai` | **`stripped` has no equivalent** — likely fine (decorative), but confirm it wasn't signalling indeterminate. |
| **Switch** | `switchStyle` (default, **brand**) | no variants | Old could render a brand-colored switch. New forbids key/brand color on toggle state (`never the point/brand color for the on-state`). **Squash — deliberate.** |
| **Tooltip** | `size` (sm, md, lg) | no variants | Squash; new Tooltip is one size. |
| **Checkbox / Radio** | `size` × `checked` states | no variants | `checked` is state not variant; `size` squashes. |
| **Pagination** | `size` ×3, `variant` (filled, ghost) | no variants | Decide if `ghost` pagination is needed. |
| **Stepper** | 3 axes | **absent** | See above. |
| **Uploader / FileUpload** | 3 CVA configs, `size` ×3, `variant` (card, inline) | no variants | Decide if `inline` progress is needed. |
| **DatePicker** | `datePickerHeaderVariants.variant`: **`variant-a`/`b`/`c`/`d`** | no variants | These are **unnamed** in the old system — nobody can tell what they mean without reading CSS. Don't port blind; identify what each was for first. |

---

## What I'd do with this

**Squash without further thought** (the new system's absence is a deliberate, documented decision): Input `isFilled`, Switch `brand`, Tooltip `size`, Checkbox/Radio `size`, Badge `active`.

**Three decisions worth real attention:**

1. **Button's lost cross-products** — `ghost × destructive` especially. A low-emphasis delete is a common pattern. If the FE uses it, the new flat API can't express it, and that's a Button spec change, not a token change.
2. **Badge `purple`** — find what it encoded. If it was a category, `category` covers it. If it was a distinct status, the new semantic set needs a role or the usage needs remapping.
3. **Stepper** — genuinely absent, and the `guided` archetype plausibly needs it.

**Investigate before porting:** DatePicker's `variant-a/b/c/d`. Unnamed variants are the one case where the old system is clearly worse, and copying them forward would import the problem.

**Ignore:** charts, maps, data-table subcomponents, and the BI panels. Different product.

---

## Known staleness fixed while here

`synapse.manifest.json` / `tools/build_manifest.py` described the Button variant as `accent (POINT color — graphite, mode-inverting)` — stale on two counts: the variant was renamed `accent` → `brand`, and the color went graphite → blue. `components.md` used `brand` correctly (7×), so the manifest had drifted from the spec. Note SY017 did **not** catch this: it compares the manifest against what `build_manifest.py` emits, and both carried the same stale string — a gate verifying self-consistency rather than agreement with the source of truth, the same class of problem as Defect 7 in `token-convention-audit.md`. Regenerated; gate green.
