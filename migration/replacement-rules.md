# Replacement rules — old `@enhans/synapse` 0.13.x · shadcn → Synapse v1

Every API that v1 **does not accept**, and what takes its place. Companion to `shadcn-token-map.csv` (colour) — this file covers components and props.

Written 2026-07-30, after adding the six consequence-free gaps to `components.md`. Supersedes the ⚠ column of the 2026-07-29 prop-mapping sheet, which was written before the Button two-axis reversal and reflects the built package rather than the specification.

## How to read `mode`

| mode | meaning |
|---|---|
| ⚙️ **mechanical** | A codemod can do it unattended. Rename, or a substitution with one correct answer. |
| 👁 **review** | The replacement depends on what the site *means*. Codemod proposes, human approves. |
| 🗑 **drop** | Remove the prop. Nothing replaces it — the system declines the feature on purpose. |
| ✎ **rewrite** | Structural change; the codemod can only flag it. |
| ❓ **engineering decision** | Not a design question. Needs an owner, not a rule. |
| 🔧 **build task** | The design system specifies it; the published package does not export it. Fix the build. |

## Before you start: three counts we do not have

`size="icon"`, `variant="link"` and `disabled:opacity-50` are the three highest-volume rules in this file and all three are `?`. They are also the three that need per-site judgement. **Get these counts before committing to the one-sprint plan** — they determine whether it is feasible. Everything else in this table is either mechanical or low-volume.


## Mechanical — codemod runs unattended (20)

| Component | From | Old API | → v1 | ≤ sites | Rule |
|---|---|---|---|---|---|
| **Button** | shadcn | `asChild` | render (same slot semantics) | ? | ADDED to v1 2026-07-30. Prop may keep the asChild name; behaviour is identical. |
| **Button** | old | `buttonStyle="tertiary"` | buttonStyle="secondary" | 43 | Rename only — the tonal tier kept the secondary name so no token renames. |
| **Button** | old | `buttonStyle="secondary"` | buttonStyle="outline" | 43 | Rename only. |
| **Button** | shadcn | `variant="outline"` | buttonStyle="outline" | ? | v1 HAS outline. Do NOT flatten to the tonal secondary — that was an error in the 07-29 prop sheet. |
| **Button** | shadcn | `variant="destructive"` | target="destructive" | ? | Two-axis API: target, not variant. |
| **Badge** | old | `active` | Chip selected | ? | Selection is interaction → Chip. This is where the retired neutral solid went. |
| **Badge** | old | `badgeStyle="light" / "filled"` | emphasis="subtle" / "solid" | 71 | Rename. |
| **Radio** | shadcn | `indicatorType="check"` | the dot (default) | 8 | Circle+dot vs box+check is the only pre-click signal of single vs multi choice. Large check-marked options are ChoiceCard. |
| **Tabs** | old | `DynamicTabs` | Tabs variant="editable" | 16 | ADDED to v1 2026-07-30. + button disables at 7. |
| **Textarea** | old | `Textarea.Actions` | Textarea action bar | 19 | ADDED to v1 2026-07-30. Max 2 buttons, secondary/ghost only. |
| **Modal** | old | `DialogHeaderWithAction` | Modal header action slot | 35 | ADDED to v1 2026-07-30. One ghost action; if it resolves the modal it belongs in the footer. |
| **Modal** | shadcn | `showCloseButton={false}` | hideClose | 126 | BOOLEAN INVERSION — the classic codemod bug. Require a test. |
| **Drawer** | shadcn | `side="bottom"` | Drawer (responsive — bottom below 768 automatically) | ? | ADDED to v1 2026-07-30 as a responsive rendering, NOT an author-set side. Drop the prop. |
| **Menu** | shadcn | `DropdownMenuShortcut` | Menu Kbd slot (.sy-kbd) | ? | ADDED to v1 2026-07-30. Same rendering as Tooltip and CommandPalette. |
| **Menu** | shadcn | `CheckboxItem / RadioItem` | Menu items with leading Checkbox / Radio | 42 | Already specified via Select/Combobox multi-select menus, incl. pinned select-all with mixed state. |
| **Pagination** | old | `pageSize` | page-size Select (already specified) | 13 | Exists — "optional page-size Select in dense tables". |
| **ProgressBar** | old | `.Header / .Value subparts` | the anatomy label row | 14 | Exists as anatomy: description left, "N of M" or percent right. |
| **Progress** | shadcn | `indicatorColor` | variant (default|ai|danger|success) | 12 | Rename to the closed variant set. |
| **Slider** | old | `.Control showStepper / showMinMax` | Slider min/max display (specified) | ? | Exists. |
| **Sheet→Drawer** | shadcn | `import { Sheet }` | Drawer | 17 | Renamed component. |

## Mechanical, but applied per component (1)

| Component | From | Old API | → v1 | ≤ sites | Rule |
|---|---|---|---|---|---|
| **Button** | both | `disabled:opacity-50` | bg.disabled + text.disabled + border.subtle | ? | Cannot be a token swap — opacity multiplies through descendants. foundations §1.2. Apply the component’s own disabled recipe. |

## Needs review — the replacement depends on meaning (13)

| Component | From | Old API | → v1 | ≤ sites | Rule |
|---|---|---|---|---|---|
| **Button** | shadcn | `variant="link"` | Link, or buttonStyle=ghost | ? | Navigates → Link. Acts → ghost. Decide per site; see components.md Link §decision table. GET THE COUNT — this is the largest unknown in the plan. |
| **Button** | shadcn | `size="icon" / size="icon-sm"` | buttonType=icon (approved glyphs only) OR icon + visible label | ? | Allowed bare only for close, more, edit, delete, copy, refresh, expand/collapse, settings. Anything else gains a label. GET THE COUNT. |
| **Button** | old | `tailIcon` | trailing affordance icon (closed set) | ? | Exists in v1. Closed set — verify the glyph is sanctioned. |
| **Badge** | both | `color={hex} / theme="purple"` | one of neutral|info|success|warning|danger|ai | 154 | Map by MEANING not hue. A purple category badge → neutral, not ai. ai is reserved for agent output. |
| **Badge** | shadcn | `variant="secondary" / "default"` | emphasis="subtle" color="neutral" | 83 | NOT neutral+solid — that combination is retired. Grey badges become subtle. |
| **Chip** | old | `tag (colour dot)` | Badge dot variant | 13 | Chip owns selection, Badge owns colour-keyed status. If the thing is selectable AND colour-coded, split it. |
| **Switch** | old | `labelPosition="left"` | label right + DescriptionList row layout | 10 | Label is always right. For a far-apart settings row, change the LAYOUT, not the label side. |
| **Tabs** | shadcn | `icon-only triggers` | icon + label | ? | An icon alone cannot carry a user-named view. |
| **Drawer** | shadcn | `side="top"` | Modal, or Banner for non-blocking notice | ? | Top edge is app chrome. Forbidden with no direct substitute. |
| **Drawer** | shadcn | `side="left"` | Sidebar, or right-side Drawer | ? | Left is reserved for Sidebar. |
| **Menu** | shadcn | `DropdownMenuSub (2+ levels)` | flatten to one level | ? | One level of submenu is allowed; deeper is forbidden. |
| **Combobox** | old | `trigger="search" / "input"` | Combobox (async + creatable already specified) | 69 | Covers the old Autocomplete too — no separate component needed. |
| **AlertDialog** | shadcn | `AlertDialog` | Modal (destructive/typed confirm) or Popconfirm (simple) | 62 | RULE: destructive, or requires typed confirmation → Modal. Everything else → Popconfirm. Makes it mechanical. |

## Structural rewrite (1)

| Component | From | Old API | → v1 | ≤ sites | Rule |
|---|---|---|---|---|---|
| **Select** | old | `options={[...]} array API` | compound Trigger/Value/Content/Item | 26 | Structural rewrite, not a rename. |

## Dropped — declined on purpose, no replacement (2)

| Component | From | Old API | → v1 | ≤ sites | Rule |
|---|---|---|---|---|---|
| **Chip** | old | `tailIcon` | — none | ? | Chip has one trailing slot and it is the remove ✕. |
| **Tooltip** | both | `TooltipArrow / tip / tipPosition` | — none | 77 | Ruled 2026-07-30: no floating surface in the system has an arrow. No replacement. |

## Engineering decisions — need an owner, not a rule (2)

| Component | From | Old API | → v1 | ≤ sites | Rule |
|---|---|---|---|---|---|
| **Toast** | old | `toast() / Toaster queue` | Toast (visual) + app-owned queue | 1 | Spec mentions the queue; the built package does not export an imperative API. Engineering decision: library ships it or the app owns it. |
| **FileUpload** | old | `Uploader strategy / onUploadComplete` | Dropzone + FileRow + app-owned transport | 1 | v1 is presentational. Upload transport stays in the app. |

## Build tasks — specified but not exported (1)

| Component | From | Old API | → v1 | ≤ sites | Rule |
|---|---|---|---|---|---|
| **Popover** | shadcn | `Popover` | Popover / Menu | 78 | EXISTS in the design system. The built package does not export it — that is a build task, not a design gap. |

## No change needed (listed because the old sheet said otherwise) (2)

| Component | From | Old API | → v1 | ≤ sites | Rule |
|---|---|---|---|---|---|
| **Button** | old | `size="xs"` | size="xs" (kept) | ? | xs was retained for inline cases. The 07-29 sheet said xs→sm; that is stale. |
| **SortableList / WhatIfPanel / ThemeSwitcher / WidgetGrid** | old | `—` | out of scope | ? | BI/domain. Confirm once in the tracker so it is not re-litigated per feature. |

---

## Added to v1 on 2026-07-30 (were gaps, now specified)

Six additions, all consequence-free or constrained so they do not conflict with an existing rule:

| Addition | Component | Constraint that keeps it safe |
|---|---|---|
| Action bar | `Textarea` | Max 2 buttons, `secondary`/`ghost` only — a text field never hosts a page's main action. Not allowed inside the Composer, which owns its own send row. |
| Header action slot | `Modal` | One `ghost` action, non-resolving. Does not breach the two-button footer cap because that cap counts *decisions*; a header action opens, navigates or toggles presentation. |
| `bottom` side | `Drawer` | Responsive rendering below 768px, **not** an author-set prop — edge is a function of available space, so the system decides it. `top` stays forbidden. |
| `editable` variant | `Tabs` | The `+` button disables at 7, preserving the existing cap. Beyond 7 open items is a Sidebar list or Tree, not a tab strip. |
| Kbd slot | `Popover / Menu` | Documents a binding that exists; never on a `danger` item. Renders identically to Tooltip's and CommandPalette's `.sy-kbd`. |
| `render` (polymorphic) | `Button` | Framework routing only — one child, no nested interactivity, not on `target=brand`. Not a licence to style links as buttons. |

## Ruled as refusals, with substitutes written into the spec

`Button` custom colours · `Button` `link` style · `Button` unapproved icon-only · `Badge` hex/`active` · `Chip` colour dot · `Radio` check indicator · `Switch` left label · `Tooltip` arrow · opacity-based disabling.

Each now names its replacement in its own **Forbidden** line in `components.md` (or `foundations.md` §1.2 for disabling), so the spec answers the question in place rather than sending the reader to this file.

## Still open

- **Three counts** (above) — blocks sizing the plan.
- **`Toast` imperative API** — library or app. No design content; needs an owner.
- **`FileUpload` transport** — presentational component, app-owned upload. Confirm the boundary.
- **`Popover` export** — build task. 78 call sites are waiting on a package change, not a design decision.
- **BI components** (`SortableList`, `WhatIfPanel`, `ThemeSwitcher`, `WidgetGrid`, `filter-preset`, `hierarchical-filter`) — confirm out-of-scope once in the tracker.
