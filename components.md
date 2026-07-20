# Synapse components

**This is a closed set.** The 50 component entries below (a `##` heading each; some entries group sibling controls, e.g. Checkbox · Radio · Switch) are the only building blocks permitted in generated UI. Common multi-component assemblies are specified in `recipes.md` — check there before composing from scratch. If a need cannot be met by these components or their documented composition (`patterns.md`), the correct action is to escalate per `design.md` §6 — never to invent a variant, add a prop, or restyle an existing component.

Every spec follows the same schema. `variants` and `sizes` are exhaustive enumerations. `forbidden` lists the modifications agents most commonly attempt and must not. Components use the single system size scale; Table runs compact by default (foundations §4).

Conventions: heights refer to `--sy-control-height-*` (`tokens/synapse.css`). "Focus ring" = a flush 2px ring in `--sy-border-focus` (box-shadow, so it hugs the corner radius) — except Buttons, whose focus ring is a lightened ~50% `color-mix` tint of the button’s own color (v6.58.1).

---

## Button

**Purpose:** trigger an action. Not for navigation (use Link) — a button never changes the URL.

**Variants (closed):**

| Variant | Style | Use |
|---|---|---|
| `primary` | `action.primary-bg` fill, `action.primary-fg` text | The single main action of a region. Max one visible per region. |
| `secondary` | tonal: `action.secondary-bg` fill, no border, `fg.primary` text (v5.0 — replaced the outlined style; hover steps to `secondary-bg-hover`) | Standard actions. Default choice. |
| `ghost` | transparent, no border, `fg.secondary` text | Low-emphasis, toolbars, repeated row actions. The transparent/tonal split is what keeps ghost and secondary distinguishable. |
| `danger` | `status.danger-bg-solid` fill (light-leaning red.400, ~3.4:1 — §8 policy), white text at semibold 600; hover/pressed darkens to `danger-bg-solid-hover` (red.500, AA) | Destructive confirmation only, inside confirm dialogs or after explicit intent. |
| `brand` | `action.brand-bg` fill | **The POINT / brand color `#0621C4` (variant renamed accent→brand, v6.58).** Jurisdiction: brand-identity objects + conversational-AI CTAs — Ask agent / Composer send, max 1/screen. Operational agent actions (Run/Retry/Resume) stay `primary`/black — executing a configured run never earns the point color; only conversationally invoking the agent does. White label clears AA (white on `#0621C4` ≈ 10:1). |

**Sizes:** `sm` (height-sm, label 13/12), `md` (height-md, default), `lg` (height-lg, heroes only).
**States:** default, hover (`primary`: bg-hover; `secondary`: `secondary-bg-hover`; `ghost`: `bg.hover`), active/pressed (identical to hover by design — pressed feedback comes from the click itself, not a third fill), focus-visible (ring), disabled (`fg.disabled`, `bg.disabled` fill; 40% opacity is forbidden), loading (spinner 16px replaces leading icon; label stays; width MUST NOT change).
**Pill option (v5.0):** `primary` buttons in Guided-archetype heroes and empty-state first-use moments MAY use `radius.full`. NEVER in forms, toolbars, tables, or dense regions — the pill silhouette is a hero mark, not a general style.
**Anatomy:** optional leading icon (16px) + label. **Optical padding trim (v6.17.2):** on icon+text buttons, the icon side's padding is `--sy-control-padding-x` minus 2px (a 16px stroke icon carries internal whitespace, so equal padding reads heavier on the icon side); applies per side — leading icon trims left, trailing chevron/external mark trims right; icon-only buttons are exempt (they're squares). Icon-only buttons allowed only for: close, more (⋯), edit, delete, copy, refresh, expand/collapse, settings — and MUST have `aria-label`. **Icon-only buttons are always square** (v6.2.4): width equals the size's control height (sm 32→32, md 36→36) — a non-square icon button is a bug, not a variant.

**Label & icon rules (v5.0.3 — closed policy):**

- **Text-only is the default.** A button earns an icon; it doesn't get one for decoration.
- **Icon + text is permitted only when:** (a) it is the conversational-AI entry button (`primary` since v6.19; the agent glyph is its marker), or (b) the button sits in a toolbar/filter-bar context and its icon is from the approved icon-action list, where the icon aids scanning across repeated controls. Everywhere else — dialog footers, forms, page headers — text only.
- **Trailing icons:** only the chevron (menu-opening buttons, split buttons) and the external-link mark. Never a trailing decorative icon; never two icons on one button.
- **Label text:** the `label` typography style (semibold on `danger`); sentence case; verb-first EN ("Save changes") / noun or -하기 form KO ("변경사항 저장") per `content.md` §3.2; no terminal punctuation; "…" only for in-progress verbs ("Saving…" / "저장 중…") or when the action opens a follow-up step before executing ("Export…" opens the format dialog).

**Forbidden:** fixed widths (KO/EN); custom colors; more than one `primary` per region; icon-only outside the approved list; ALL-CAPS labels; radius other than `sm`.
**A11y:** `<button>` element; Enter/Space activate; loading sets `aria-busy`.
**Bilingual:** label sizing from content + `--sy-control-padding-x`; verbs first in EN ("Save changes"), natural KO word order (variables allowed: "변경사항 저장"); never truncate.

---

## Link

**Purpose:** navigation. `fg.link` color, no underline at rest, underline on hover/focus. Inline links inside body text are always underlined. External links append a 16px external icon. **Forbidden:** styling a link as a button or vice versa; "click here" labels (KO: "여기를 클릭" 금지).

---

## Input (text)

**Purpose:** single-line text entry. Covers text, email, password, number, search (search adds leading 16px icon + clear button when filled).

**Anatomy (v5.0 — filled):** label (required, `--sy-label-size` medium, above) · field (height-md, `bg.sunken` fill, borderless, radius `sm`) · optional helper text (caption, `fg.secondary`) · error text (caption, `status.danger`, replaces helper).
**States:** default (filled, borderless), hover (fill steps to `bg.selected-hover`), focus (1px `border.focus-input` perimeter — neutral, v6.10 — + fill switches to `bg.page`: the field "opens" for entry. Entry surfaces focus in the neutral key tone because click-to-type shows focus constantly and blue overexposed the accent; non-entry controls keep the blue `border.focus` flush ring. No focus ring on filled fields (v6.8.1) — border swap + fill change form the compound indicator. Error fields keep `border.error` while focused; the fill change carries focus), disabled (`bg.disabled`, `fg.disabled`), error (1px `border.error` on the filled field + error text; error text MUST name the fix, not just "invalid"), read-only (`bg.surface`, no hover response). Select, Combobox, and DatePicker triggers inherit this filled anatomy.
**Sizes:** `md` only.
**Affixes (v6.0):** optional leading registry icon (16px, `fg.tertiary` — search's magnifier is one instance of this general slot) and/or trailing affix: a unit/format suffix (`fg.tertiary`, e.g. "KRW", "%") or one registry icon (e.g. eye/eye-off reveal on password). One leading + one trailing max; affixes sit inside the fill and never receive focus.

**Forbidden:** placeholder as label (placeholder is example content only, `fg.tertiary`); floating labels (break with Hangul metrics); fixed field widths under 240px for translatable content; hiding the label visually except in table inline-edit cells.
**A11y:** `<label for>` always; error linked via `aria-describedby`; `aria-invalid` on error.
**Bilingual:** labels above the field (never left-aligned beside — KO/EN label width divergence breaks alignment); helper/error text wraps, never truncates.

---

## Textarea

Multi-line Input. Min-height 3 rows, vertical resize only, otherwise inherits all Input rules. Character counter (caption, `fg.tertiary`, bottom-right) when a limit exists — count characters, not bytes (Hangul). **`autogrow` variant (v6.0):** grows with content from 1 row to a declared max (default 8), then scrolls internally; resize handle removed — Composer's behavior, now available to inline forms (comments, descriptions).

---

## Select

**Purpose:** choose one option from 5–15 known, static options. <5 options: use Radio. >15, async, or user-known values: use Combobox.
Trigger renders as Input anatomy with trailing chevron (16px). Menu is a Popover: `bg.raised`, `border.default`, radius `md`, `shadow.overlay`; options height-md, `bg.hover` on hover, `bg.selected` + leading 16px check on selected.
**States:** as Input, plus open (chevron rotates 180°, `fast` duration).
**Forbidden:** native `<select>` styling mixed with custom menus; multi-select without chip rendering (use input Chips inside the trigger); menus wider than 480px or narrower than trigger.
**A11y:** listbox pattern; full keyboard (arrows, Home/End, type-ahead); Esc closes.
**Bilingual:** menu width fits longest option of the active locale; no fixed trigger widths.

---

## Checkbox · Radio · Switch

| Control | Semantic | Never |
|---|---|---|
| Checkbox (16px box, radius `xs`) | independent on/off in forms; multi-select in lists | as instant-effect toggle |
| Radio (16px circle) | exactly one of 2–5 visible options | for >5 options (use Select) |
| Switch (32×18 track) | instant-effect toggle, applies immediately | inside a form that has a Save button |

Checked state: `action.primary-bg` fill (black/white — key color, not blue). Label always to the right, clickable, `--sy-body-size`.

**Mixed states** (representing heterogeneous values, e.g. bulk-select parents or multi-object editing):

| Control | Mixed rendering | Interaction |
|---|---|---|
| Checkbox | key-color fill + horizontal minus bar (`aria-checked="mixed"`) | click → checks all; second click → unchecks all |
| Switch | thumb centered with a minus glyph inside (`fg.secondary`, 6×2px), track `border.strong` fill (`aria-checked="mixed"`) — track NEVER takes the key color: a filled track falsely signals ON for an instant-effect control | toggle → applies ON to all (destructive-off never defaults) |
| Radio | no mixed state exists — a heterogeneous radio group renders with **no** selection + a caption "Mixed values" / "여러 값" | selecting applies to all |

**The mixed-value convention (cross-component).** Whenever one control edits multiple objects whose current values differ, the control shows the mixed marker — never one object's value as if shared. Text-like controls (Input, Select, Combobox, DatePicker) display the placeholder-styled string "Mixed" / "여러 값" in `fg.tertiary`; entering any value overwrites all. A cleared mixed field returns to "Mixed", not to empty.
**A11y:** native inputs under the hood; radio groups use `fieldset/legend`; mixed states use `aria-checked="mixed"`.

---

## Badge

**Purpose:** compact static annotation — status, counts, categories. Never interactive (interaction = Chip). **Default rendering (v6.24):** a Badge with no declared color renders as `neutral` — a badge never appears as unfilled floating text.

**Sizes:**

| Size | Spec | Jurisdiction |
|---|---|---|
| `md` (default) | height 20px, `micro` text, padding-x 8 | Everywhere: tables, cards, lists, meta rows. The constant recognition size. |
| `lg` | height 24px, `label-sm` text (600 when `solid` — foundations §8 weight compensation), padding-x 12 | Only beside `heading-xl`+ titles (page headers, R1) and hero/empty-state contexts. NEVER inside tables, lists, or dense regions — size constancy there is what makes statuses scannable. |

One size per view, as with shape.

**Optical centering:** badge labels are single-line and flex-centered within the fixed height; line-height collapses to 1 (the container provides the box — the line-height floor rule targets wrapping text, not sealed single-line containers) plus a 1px top-padding nudge to compensate for descender space the font reserves but short labels rarely use. Without this, labels read as shifted toward the top of the pill. **Scale-bound:** the nudge applies ONLY to the tight 20px/11px geometry of the `md` badge. At 24px/12px proportions (`lg` badge, Chip) the container has enough optical room that plain flex centering is correct and the nudge overcorrects downward — verified empirically, both surfaces.

**Shape variants** (a view-level style choice, NEVER per instance — one shape per view):

| Shape | Radius | Use |
|---|---|---|
| `pill` (default) | `full` | The default everywhere. |
| `rounded` | `sm` | Available at any size/context as the view's chosen shape. It is the *default expectation* in dense tables and code-adjacent contexts, where tiling pills read as noise. |

**Color variants:** `neutral`, `info`, `success`, `warning`, `danger`, `ai` (uses `ai.*` tokens — agent-related states only), `category` (static taxonomy label: deterministic `viz-n` at 20% fill + matching text, same hashing as Avatar; system-assigned, never user-picked). `category` supports the `subtle` emphasis only — taxonomy is never urgent, outlined, or reduced to a dot.
**Emphasis variants** (orthogonal to color; pick by surrounding density and importance):

| Emphasis | Rendering | Use |
|---|---|---|
| `subtle` (default) | `status.*-bg` fill, `status.*` text, no border | Standard status in tables, cards, headers. |
| `solid` | see per-color rules below | High-visibility marks that must be scannable from across the screen. Max one solid color per view. |
| `outline` | transparent, 1px `status.*` border, `status.*` text | Dense tables where subtle fills would tile the screen with color. |
| `dot` | 8px `status.*-bg-solid` dot (mid value — dots are non-text, 3:1 floor; the darker `status.*` text tokens are not used for fills) + `body-sm` `fg.secondary` text, no container | The quietest option: long lists, sidebar items, legend-like rows. |

**Solid rules per color.** Solid is not a style choice — every solid badge has a named job:

| Solid color | Rendering | The one job | Never |
|---|---|---|---|
| `info` / `success` / `warning` / `danger` | `status.*-bg-solid` + `fg.on-solid` (white, all hues) | Two jurisdictions: (a) urgent states scannable across the screen — live incidents, blocking failures — capped at one solid color per view; (b) opt-in for ops/monitoring status columns (per-view cap does not apply there); the quiet default in tables is `dot` (v5.0). Fills run ~3.5:1 with white — documented policy deviation (foundations §8): short semibold labels only, never sentences. | Routine status outside tables (that's `subtle`); solid fills behind anything longer than a two-word label. |
| `neutral` | `bg.inverse` + `fg.inverse` | **Release marker only**: "New" / "신규", "Beta" / "베타", "Early access". Max one per view. Markers expire — a "New" older than one release cycle is a bug, and expiry ownership must be assigned when the marker ships. | Status of any kind; generic emphasis; counts. It renders in the key color, so misuse reads as a primary action. |
| `ai` | `ai.solid` + `fg.on-solid` (v6.19, was accent-bg) | **Live-activity beacon only**: visible while an agent is actively operating on the current surface (autonomous mode running, bulk mutation in progress — "실행 중" with pulse allowed). MUST disappear the moment activity stops. Max one per screen. | Provenance or agent-related static states (that's `ai` subtle); anything persistent; placement adjacent to a `brand` Button in the same cluster — solid blue means "AI acting", and a static badge next to an action button muddies both. |

**Count badge:** numeric-only badge (`neutral` subtle, tabular-nums) on nav items and tabs; ≥100 renders "99+".
**Count overlay (v6.2.4–5)** — the count that sits ON an icon button (the NotificationCenter bell is its sole jurisdiction): 18px min-width/height mini-pill, `micro` numerals, **`bg.inverse-soft` fill + `fg.inverse` text** (softened key — visible against any chrome without pure-black harshness or status semantics), 2px ring in the underlying surface color, anchored half-in at the button's top-right corner (fixed top/right −2px), so the pill covers part of the glyph's upper-right — the ring is what keeps the covered icon legible underneath. Fixed offsets, never percentage translation, so the coverage reads identically at every button size. Neutral-subtle fills are forbidden here — the overlay exists to be seen. Disappears at zero; never renders "0".
**`with-icon` option (v6.0):** subtle and solid status badges MAY carry the matching 12px registry status icon before the label — icon + color + text triple redundancy for colorblind-safe scanning in status-critical views. The icon is always the status concept's registry icon; never decorative, never on `dot`/`outline` (already minimal) or `category`.
**Forbidden:** interactive badges (use Chip); sentence-length content; inventing colors; mixing emphasis levels for the same status meaning within one view; mixing shapes within one view; solid outside its named job in the table above.
**Bilingual:** KO status terms are often 2–4 syllables ("진행 중", "완료") — width from content, never fixed. Status vocabulary is the closed set in `content.md` §3.3.

---

## Chip

**Purpose:** compact **interactive** element — select, refine, remove, or accept a suggestion. The static counterpart is Badge; the split is absolute: if it can be clicked, it's a Chip; if it only informs, it's a Badge. Height 24px, radius `sm` (rounded — deliberately distinct from pill badges so interactivity is scannable by shape), text 12, plain flex centering (the Badge optical nudge does NOT apply here — at 24px/12px the container has enough room that the nudge overcorrects downward).

**Variants (closed):**

| Variant | Rendering | Behavior & use |
|---|---|---|
| `input` | `bg.sunken`, `fg.primary`, trailing 12px ✕ (`aria-label` required); MAY carry a leading Avatar 16 when the value is a person or agent (recipient/assignee chips — shape rule applies) (v6.0) | A removable selection: Combobox multi-values, recipient lists, applied values. ✕ removes; chip body is not otherwise clickable. |
| `filter` | unselected: transparent + 1px `border.default` + `fg.secondary` · selected: `bg.selected` + 1px `border.strong` + `fg.primary` + leading 12px check | Toggleable refinement in filter bars and list headers. |
| `category` | deterministic `viz-n` at 20% fill + matching text (Avatar hashing) | Clickable taxonomy label — clicking filters by it. Static display of the same taxonomy uses Badge `category`. |
| `suggestion` | **outlined** — `bg.raised` + `border.default` hairline, `fg.primary`; hover `bg.hover` + `border.strong` (v6.38 — style swapped with source pills: suggestions are ACTIONS and the crisp outline reads clickable; the tint moved to provenance where it matches the emphasis-tinted markers) | Agent-suggested next prompt/action; tap inserts or executes. Sanctioned only in Console and empty states, max 3 per surface. |

**States:** default, hover (`bg.hover` or `border.strong`), selected (filter/category), focus ring, disabled (`fg.disabled`, no interaction).
**Forbidden:** chips as command buttons (commands are Buttons — a chip never performs a primary or destructive action); mixing `input` and `filter` in one row; manual color selection; `suggestion` chips outside their sanctioned surfaces; truncating chip labels (wrap the row instead).
**Bilingual:** width from content; remove-✕ `aria-label` localizes ("Remove" / "제거").

---

## Card

**Purpose:** bounded group of related content. Radius `md`, padding `--sy-card-padding`. Optional header (`heading-lg` or `heading-md` + optional actions) and footer separated by full-bleed `border.subtle`.

**Variants:**

| Variant | Rendering | Use |
|---|---|---|
| `flat` (default, v5.0) | `bg.surface`, no border | The standard card: grouping by surface step and spacing, not boxes. Also the sanctioned inner grouping (card-in-card nesting with borders remains forbidden). |
| `outlined` | `bg.raised`, 1px `border.default` | Genuinely separable objects: items in a pickable grid, embedded data regions, anything `interactive` (clickability needs an edge — `interactive` implies `outlined` or `elevated`). |
| `elevated` | `bg.raised`, 1px `border.default`, `shadow.raised` | Focus-archetype key moments only (the one thing the page is about); max one per page. The sole sanctioned static-card shadow. |
| `ai` | `ai.surface`, 1px `ai.border` | Container for agent-produced content. ProposalCard is a specialization of this variant. |
| `stat` | `outlined` card with fixed anatomy: `label` + `fg.secondary` title · `stat`/`stat-lg` value · optional delta row · optional sparkline. (the v6.11 `emphasized` opt-in is REMOVED in v6.40 — maintainer: no slate on stat cards; metric grids render uniform, urgency belongs to queues and status, not card tint) | KPI display. See `recipes.md` for grid presets. |

**Modifiers** (combine with any variant): `interactive` (whole card clickable: hover `border.strong` + `bg.hover` + optional `hover-lift` per foundations §6; exactly one action; keyboard focusable), `selected` (1px `border.selected` outline — selection, not focus).
**Forbidden:** shadows outside `elevated`; nesting bordered cards (use `flat`); cards as page layout scaffolding; `ai` variant on non-agent content.

---

## Table

**Purpose:** the workhorse for data-heavy screens. Structured records with aligned columns.

**Selection column (v6.24.1):** 40px fixed, zero cell padding, contents centered both axes (`vertical-align: middle` on the checkbox) — the selection cell holds a control, not text, so it never inherits text-cell padding/alignment. Header checkbox = select-all with the mixed state per the Checkbox rules.

**Anatomy (emphasis opt-in, v6.11):** one column or cell range MAY take the `emphasis.surface` fill (+ `emphasis.fg` for its header label) to mark the current period, totals, or the comparison target — max one emphasized column per table, never combined with row selection tint on the same cells. Header row (`--sy-label-size` medium, `fg.tertiary`, **no fill** — v6.5: header background is transparent on framed and bare tables alike; the hairline bottom rule alone marks the header, and sort glyphs get reserved space so columns never shift on sort, sticky) · rows (height `--sy-table-row`, `border.subtle` dividers) · optional footer/pagination. **Framing (v4.0):** tables are frameless by default — bare header on the page background with a single hairline rule below, no outer border, no header fill; horizontally-scrolling tables (or those with pinned columns) keep the frame (1px `border.default`, radius `md`, clipped, `bg.surface` header) because scroll edges need the boundary.
**Column rules:** text left-aligned; numbers right-aligned with `font-variant-numeric: tabular-nums` (mono for IDs); dates/times in one consistent format per table; status as Badge; row actions as ghost icon-buttons at row-end, revealed on row hover.
**Behavior:** hover `bg.hover`; selected `bg.selected` + leading checkbox; sortable headers get trailing 12px arrow (active sort column only, one at a time). Empty state: EmptyState component inside the frame, never a bare "no data" string. Loading: Skeleton rows, matching column layout.
**States per cell:** truncation with tooltip allowed (the only sanctioned truncation site besides list rows).
**Forbidden:** zebra striping (dividers suffice); >1 accent color inside a table; horizontal scroll without a pinned first column; card-per-row layouts pretending to be tables.
**Bilingual:** column min-widths sized for the wider locale; header truncation forbidden.

**Advanced behaviors (v1.3)** — available on any Table; each is opt-in per view:

- **Column controls.** Resize by dragging the header edge (min 80px; persists per user per view). Pin to the left only, max 2 columns; pinned columns show a `border.strong` right edge and keep `bg.surface`/row background while scrolling. Hide/show and reorder via the header column menu (⋯). The column menu item set is closed: Sort ascending / Sort descending / Pin / Unpin / Hide / Resize to fit.
- **Bulk selection.** Leading checkbox column (header checkbox = all-on-page, indeterminate for partial). When ≥1 row is selected, the table toolbar is replaced by a selection bar: `bg.selected` strip, "14 selected" / "14개 선택됨" (13 medium), up to 4 action buttons (`ghost`) + overflow menu + Clear. Destructive bulk actions confirm via Modal with counts.
- **Inline edit.** Sanctioned only for text, number, and select cells. Enter edit via double-click or Enter on the focused cell; the editor is borderless inside the cell with the standard focus ring (this is the sanctioned hidden-label exception). Enter commits, Esc cancels, Tab commits + moves. Invalid values: `status.danger` cell border + Tooltip naming the fix; the cell does not exit edit until valid or cancelled.
- **Row grouping.** One level only. Group header rows: 32px, `bg.surface`, 13 medium label + count Badge, collapsible with chevron. Aggregations (sum/count) render right-aligned in the group header, tabular-nums.
- **Virtualization.** Required above 200 rows. Row heights are fixed for this reason — variable-height rows are forbidden in virtualized tables.
- **Expandable rows.** Leading chevron column; expanding reveals a detail panel (`bg.surface`, full row width, own padding) below the row. One level; an expanded panel MAY contain a `flat` Card or DescriptionList, never another table.
- **Totals/summary row.** Pinned bottom row, `bg.surface`, `label` type, values tabular-nums; states the aggregation in the cell ("Σ 1,204" or "avg 4m 02s") — never an unlabeled number.
- **Header extras.** Column headers MAY carry an info icon (13px, opens Tooltip with the column definition) and a unit suffix in `fg.tertiary` ("Duration *(min)*" — unit in the header, never repeated per cell).

**Cell renderers (closed set).** Every column declares exactly one renderer; the renderer fixes alignment, formatting, and truncation behavior. This set exists so new data shapes never require inventing cell UI:

| Renderer | Spec |
|---|---|
| `text` | left, `body`, single-line ellipsis + Tooltip |
| `text-2line` | primary `body` + secondary `caption` `fg.secondary`; only in reading-oriented tables (never in compact data walls) |
| `number` | right, tabular-nums |
| `currency` | right, tabular-nums, locale format (content.md §6) |
| `percent` | right, tabular-nums, "12%" |
| `delta` | right, signed, `status.success`/`status.danger` text + ▲▼ marker (never color alone) |
| `date` / `datetime` | left; one consistent format per table (ISO for machine/log tables, locale format otherwise) |
| `duration` | right, tabular-nums, "4m 12s" |
| `id` | left, `code-sm` mono, `fg.secondary`, middle-out truncation, copy on click |
| `status` | Badge `dot` + plain text — the standard in status columns (v5.0, per the sleek restyle): the quietest rendering, and dots have no fill to melt into row highlights. `solid` is the sanctioned opt-in for ops/monitoring views where states must scream across a wall of rows. |
| `labels` | up to 2 category Badges (static) or Chips (click-to-filter views) + "+N" overflow |
| `user` | Avatar 20 + name, single line |
| `agent` | squared Avatar 20 + name |
| `link` | `fg.link`, single-line ellipsis |
| `progress` | ProgressBar (4px) + optional "N/M" caption |
| `sparkline` | Chart sparkline, 24px |
| `actions` | trailing ghost icon-buttons (approved icon list) |
| `checkbox` | leading selection column only |

Empty cell value is always an em dash "—" in `fg.tertiary` — never blank, never "N/A", never "null".

---

## Combobox

**Purpose:** choose one or many values from large (>15), async-loaded, or user-known option sets. This is Select's big sibling — Select stays for 5–15 static options.

**Anatomy:** Input-style trigger (label above, height-md, chevron trailing). Typing filters instantly; matched substrings are highlighted (600 weight, no color change). Menu = Popover surface, options as Select's; async results show 3 Skeleton rows while loading.
**Multi-select:** selected values render as removable input Chips inside the trigger, wrapping to max 2 rows, then a "+N" overflow Chip (click → popover listing all). Menu options get leading Checkboxes; the menu stays open between picks; trigger placeholder becomes the selection count when collapsed.
**States:** as Input, plus open, loading, no-results ("No matches for '{query}'" row + optional "Create '{query}'" action — creation only where the data model explicitly allows it, styled as a menu item with a plus icon, never auto-created on blur).

**Convenience features (all opt-in per instance):**

- `search-in-menu` — when the trigger is a button rather than an input (e.g. inside a Modal or toolbar), the menu opens with a borderless search row at the top (full-bleed bottom rule), focused on open.
- `select-all` — multi-select menus MAY start with a pinned "Select all ({n})" / "전체 선택 ({n}건)" row with mixed-state checkbox behavior, plus a "Clear" action in the trailing position of the same row. Operates on the *filtered* set, and says so when a filter is active ("Select all 12 matching").
- `grouped` — options under sticky group labels (`micro`, `fg.tertiary`); groups collapse only in menus >50 options.
- `descriptions` — option rows MAY carry a `caption` `fg.secondary` second line and/or a leading 16px icon; row height grows to 40px.
- `recent` — a "Recent" group of up to 3 items pinned above all groups, based on the user's own selections.
- `async-more` — paginated sources append a "Load more" row (`ghost` styling); never infinite-scroll inside a menu.
- `virtualized` — required above 100 options.

**A11y:** ARIA combobox pattern; full keyboard including Backspace to remove the last Chip in multi.
**Forbidden:** Combobox for <5 options (Radio) or 5–15 static (Select); free-text values without explicit creatable mode; menus narrower than the trigger; selected Chips truncating (wrap instead); select-all defaulting destructive bulk changes.
**Bilingual:** filtering matches both locales' labels and romanized Hangul; option and Chip widths from content.

---

## DatePicker

**Purpose:** date, date-range, and time selection. Formatted Input trigger + calendar Popover.

**Variants (closed):** `date` (default) · `range` · `datetime` · `time`.

**Calendar anatomy:** header (month/year label 14 semibold + prev/next icon-buttons) · weekday row (11 medium, `fg.tertiary`) · 7×6 day grid. Day cells 32px, radius `sm`: today = `emphasis.surface` fill + `emphasis.border` inset hairline + `emphasis.fg` semibold numeral (v6.11 — the now-marker job); selected = `action.primary-bg` fill; range interior = `bg.selected` with squared edges, endpoints filled; other-month days `fg.disabled`; disabled dates `fg.disabled` + strikethrough forbidden — use no-hover + `aria-disabled` instead.
**`range`:** two calendars side-by-side (one in narrow contexts); preset rail on the left — closed preset set: Today, Last 7 days, Last 30 days, This month, Last month, Custom ("오늘", "지난 7일", "지난 30일", "이번 달", "지난달", "직접 선택"). When the underlying value is a datetime window (schedule windows, log queries), each endpoint MAY carry a time field per the `datetime` rules; otherwise range is date-only.
**`datetime`:** the calendar Popover gains a footer time row below a full-bleed `border.subtle` rule: 16px clock icon + time field + timezone label (`caption`, `fg.tertiary` — mandatory, never ambiguous). Time entry is typed, 24-hour `HH:MM` (content.md §6); arrow keys step by 15 minutes on the focused segment; typed values normalize on blur ("930" → 09:30). The trigger displays the combined locale format ("2026년 1월 9일 14:02 KST" / "Jan 9, 2026, 14:02 KST").
**`time`:** standalone time field (no calendar) — same entry rules, width to content. For durations use Input `number` + unit, never a time picker.
**Formats:** display per locale — EN `Jan 9, 2026`, KO `2026년 1월 9일`; typed entry accepts the locale's numeric format (`01/09/2026` / `2026-01-09`) and normalizes on blur. Week start follows locale convention (both ko-KR and en-US: Sunday; honor explicit workspace override). When timezone matters (schedules, logs), show the tz label next to the value — never leave it ambiguous.
**States:** as Input, plus open, invalid-date error (names the accepted format), min/max-bounded (out-of-range days disabled with reason in a Tooltip).
**Forbidden:** text-only date entry without a picker; dropdown-per-unit (day/month/year Selects) except birthdate-style historic entry; two calendars for a single date; relative-only display without absolute on hover.

---

## SegmentedControl

**Purpose:** exclusive switch between 2–5 peer views or parameters with immediate effect — chart periods (1D/7D/30D), layout toggles (list/grid). Not Tabs (object facets), not Radio (form data, deferred effect).

**Anatomy:** container `bg.sunken`, radius `sm`, **4px inner padding** (v6.8 — concentric-corner rule, foundations §5: inner radius = outer − inset; 8 − 4 = 4 keeps both radii on-scale, and the assembled control lands exactly on the control height (36). Segments: height 28, radius `xs`, padding-x 12, 13 medium, `fg.secondary`; selected segment `bg.page` fill + 1px `border.default` + `fg.primary`. Equal-content-based widths; the control sizes to its content.
**States:** default, hover (`fg.primary`), selected, disabled (whole control only — never individual segments), focus-visible ring on the active segment.
**A11y:** `radiogroup` semantics; arrow keys move selection.
**Forbidden:** >5 segments (use Select); icon-only segments outside the approved icon list; mixed icon+text and text-only segments in one control; using it for navigation or form submission.
**Bilingual:** segment widths from content — "지난 30일" and "Last 30 days" must both fit without truncation.

---

## Accordion

**Purpose:** progressive disclosure of secondary content — advanced settings, FAQ-style detail, raw payloads.

**Anatomy:** items separated by `border.subtle`. Header row: 40px, chevron (16px, rotates 90°→ down at `fast`), 14 medium title, optional right-aligned meta (`fg.tertiary`, 13). Panel: body text, padding 0 0 16px, indented to the title edge. Height animates at `base` — the sanctioned height-animation exception.
**Behavior:** multiple items may be open simultaneously (default); single-open mode allowed for step-like content. State persists within the session.
**States:** collapsed, expanded, disabled item (`fg.disabled`, no chevron rotation).
**A11y:** header is a `<button>` with `aria-expanded` and `aria-controls`.
**Forbidden:** hiding primary content, primary actions, or error states inside collapsed items; nesting accordions; accordion as a substitute for Tabs or table grouping; icons other than the chevron as the affordance.

---

## FileUpload

**Purpose:** file input with visible progress and recoverable errors.

**Variants:** `dropzone` (dashed 1px `border.strong`, radius `lg`, padding 32×24, centered: 20px upload icon in the 48px EmptyState-style medallion (single −8px hairline ring) + "Drop files here or **browse**" (13 medium, browse as Link) + constraints caption — "PDF, CSV up to 20MB" / "PDF, CSV · 최대 20MB") and `button` (a `secondary` Button "Attach file" / "파일 첨부" for compact contexts). Drag-over state (v6.14): `border.focus-input` border + `emphasis.surface` fill. Dashed borders remain sanctioned for drop targets ONLY.
**File rows:** 40px each below the input — 16px file-type icon, filename (middle-out truncation with full name in Tooltip), size (`fg.tertiary`, tabular-nums), then per state: uploading = 4px determinate ProgressBar spanning the row bottom + percent; success = `status.success` check; error = `status.danger` icon + one-line cause + Retry ghost button; all rows get a remove ✕ icon-button (`aria-label` required).
**Rules:** constraints (types, size, count) are always visible before selection, and violations are named per file, not as a generic failure. Multiple files upload in parallel with individual progress; never a single combined bar.
**Forbidden:** uploads without visible progress; silent rejection of oversized/wrong-type files; auto-submit on drop when a form has other unfilled required fields.

---

## SplitPanel

**Purpose:** resizable adjacent regions in Workbench archetypes — list + detail, editor + preview, table + inspector. Container is a section shell: radius `xl`, 1px `border.default`, flush panes (v6.9).

**Anatomy:** 2 panes (max 3) separated by a 1px `border.default` divider with an invisible 8px drag hit-area. Divider on hover/drag: `border.strong`, cursor `col-resize`. Optional collapse chevron centered on the divider (collapses the secondary pane to nothing; a re-open affordance stays at the edge).
**Behavior:** drag resizes within min widths (content pane ≥ 280px, rail/inspector ≥ 200px); double-click the divider resets the default ratio; the ratio persists per user per view. Panes scroll independently.
**Forbidden:** more than 3 panes; nested splits beyond one horizontal + one vertical level; SplitPanel in fixed-layout archetypes (Settings, Guided); panes without min widths (KO labels need the floor).
**A11y:** divider is `role="separator"` with `aria-valuenow`, keyboard-resizable via arrow keys when focused.

---

## Chart

**Purpose:** standardized data visualization. Charts live inside Cards with a 16-semibold header; one chart per Card.

**Types (closed):** `line` (trends; ≤8 series), `area` (single series only), `bar` vertical/horizontal (comparisons), `stacked-bar` (composition over categories), `donut` (composition, ≤3 slices — otherwise bar), `sparkline` (inline 24px, no axes, single series).
**Anatomy:** plot area · x/y axes (labels 12 `fg.tertiary`, axis line `border.default`) · horizontal gridlines only (`border.subtle`) · legend only when >1 series (12px, 8px square swatches, above the plot right-aligned; prefer direct series labeling when space allows) · hover tooltip (Tooltip surface: shows the hovered x-value and all series values, tabular-nums, swatch-keyed).
**Color:** `viz-1…8` in fixed order; single series = `viz-1`; status-encoding charts use `status.*` tokens instead. Never gradients, never opacity ramps as a third dimension.
**Scale rules:** bar charts start y at 0, always. Line charts may baseline above 0 only with a visible axis-break marker. Number and date axis labels format per locale; abbreviations use locale conventions (1.2k / 1.2천).
**States:** loading = skeleton plot (gray bar/line silhouette, pulsing); empty = EmptyState inside the plot area; error = error EmptyState with Retry. Data updates snap — no transition animation on refresh; initial draw may animate once at `base`.
**Sizes:** min-height 240px; sparkline 24px.
**Forbidden:** 3D, dual y-axes, pie beyond 3 slices, >8 series (aggregate the tail into "Other" / "기타"), decorative icons inside plots, y-axis label rotation (widen or abbreviate instead).

---

## Tabs

**Purpose:** switch between peer views of the same object. 2–7 tabs.
Style: text tabs (`--sy-body-size` medium), `fg.secondary` at rest, active tab `fg.primary` + 2px `bg.inverse` underline; container has `border.subtle` bottom rule. Height 40px. Optional count Badge after label.
**Forbidden:** boxed/pill tab styles; tabs for sequential steps (compose a stepper per `patterns.md`); >7 tabs (restructure); icon-only tabs.
**Bilingual:** tab width from content; total overflow scrolls horizontally with fade edges, never wraps to two lines.

---

## Sidebar (app navigation)

**Purpose:** the single global navigation surface of AgentOS.
Width 240px expanded, 64px collapsed (icon rail with tooltips). `bg.surface`, right `border.subtle`, **container padding 12px** (v5.0.2 — previously unspecified). Items: height 32px, radius `sm`, padding-x 8, 20px icon + label (13 medium), `fg.secondary`, 4px vertical gap between items (v5.0.4 — 2px proved sub-perceptual; adjacent hover/active tints need visible separation); hover `bg.hover`; active item `bg.selected` + `fg.primary` + medium weight — no leading bar or edge indicator (v6.7.1 maintainer reversal of the v6.7 bar: dated; tint + weight carry the state). Sections separated by 16px gap + optional `micro-label` `fg.tertiary` group label (16px top padding above the label; sentence case — caps forbidden). **Collection rows (v6.17):** nav items representing user-created collections MAY carry an 8px category dot (system-assigned viz tint, same assignment rule as category Badges) before the label — the one place color enters the sidebar; never on system destinations. Max 2 nesting levels.
**Forbidden:** third nesting level; badges on more than 3 items simultaneously; per-item custom icons outside the icon family.
**Bilingual:** labels never truncate when expanded — the 240px width is sized for KO labels; if a label exceeds it, shorten the label, not the type size.

---

## Breadcrumb

Path context for pages deeper than 2 levels. 13px, `fg.tertiary` links with `fg.primary` current page, `/` separators. Collapse middle levels beyond 4 into an overflow menu ("…"). Forbidden on top-level pages.

---

## Modal

**Purpose:** blocking decision or focused short task. `bg.scrim` backdrop, opaque `bg.raised` panel (v6.31 — glass over a scrim reads muddy; the scrim carries the de-emphasis), radius `lg`, `shadow.modal`, width 480px (confirm: 400px, max 640px for forms; **browse-library modals: 760 — v6.34, the tier between form-max and the 800 wide Drawer; the Template Library is the reference case**), padding 24. Header: section title + ghost close icon-button. Footer: right-aligned Button pair — secondary ("Cancel") then primary; destructive confirms use `danger` primary.
**Behavior:** `base` duration scale+fade enter; focus trapped; Esc and scrim-click close (disabled only when data would be lost — then require explicit cancel).
**Forbidden:** modals opening modals; scrollable full-page content inside a modal (use Drawer or a page); more than 2 footer buttons; modals for non-blocking info (use Toast/Banner).

---

## Drawer

Side panel for detail/edit without leaving context. Slides from right, width 480px (max 640px; **`wide` variant 800px (v6.0)** for data-review surfaces — DiffView, run inspection — where 640 forces unusable wrapping), full height, `shadow.modal`, opaque `bg.raised` panel (v6.31 — glass retired from scrimmed layers, foundations §5), same header pattern as Modal. Non-blocking variant (no scrim) allowed in data workspaces.
**Forbidden:** left-side drawers (reserved for Sidebar); nested drawers.

---

## Popover / Menu

Anchored floating panel: `bg.raised` (`bg.raised-2` when opened from an L2 surface such as a modal), `border.overlay` (v4.0), radius `md`, **6px container padding** (v6.8 concentric-corner rule: 10 − 6 = 4 = item radius `xs`), `shadow.overlay`, `fast` fade+4px-shift enter. Menu items: height 32px, radius `xs`, 13px, 16px optional leading icon, **4px vertical gap between items** (v5.0.3–4 — without it, adjacent hover and selected tints fuse; 2px proved sub-perceptual). Destructive items `status.danger` text, always last. Max ~8 visible items, then scroll.
**Dividers:** 1px `border.subtle`, spanning the panel **edge to edge** (through the container padding — negative-margin the rule or the bordered row out to the panel edge), 4px vertical margin. Never inset. **This binds every horizontal rule inside any floating panel AND inside any padded pane of a Modal** (menus, popovers, NotificationCenter, follow-up panel, picker search/footer rows, palette, the Template Library's column internals — v6.32) — a rule that stops short of the edges reads as a rendering bug (v6.21.2 reaffirmation; the rule dates to v2.0). **An inset control sitting against a full-bleed divider (such as a footer button) takes equal padding on all four sides — the gap between the divider and the control MUST equal its side and outer-edge padding (v6.59.2); an asymmetric divider gap reads as a misalignment. (Full-bleed hover rows like menu escape rows are a separate pattern and keep their row padding.)**
**Optional search row:** menus with >8 items MAY start with a borderless filter input (search icon, 13px, `border.subtle` bottom rule, full-bleed) — same filtering behavior as Combobox, including match highlighting.
**Forbidden:** forms beyond a single control inside popovers; submenus deeper than one level; inset dividers.

---

## Tooltip

10-word max clarification of an icon or truncated string. `bg.raised-2`, 1px `border.default`, `fg.primary`, `caption` type, radius `xs`, padding 4/8, `shadow.overlay`, appears after 300ms hover/focus. **Kbd slot (v6.0):** MAY append the action's shortcut as a trailing `.sy-kbd` hint ("Copy ⌘C") — the sanctioned way to teach shortcuts in place. Same-scheme surface: light in light mode, dark in dark mode (changed in v2.0 — inverse surfaces read too stark against the neutral field).
**Forbidden:** interactive content; tooltips as error surfaces; tooltips on plainly labeled elements; inverse/contrast-flipped styling.

---

## Toast

Transient outcome notification, bottom-right stack, max 3. `bg.raised-2` panel, 1px `border.default`, `shadow.overlay`, `fg.primary` `body-sm` text, radius `md`, leading status icon (`status.*` color), optional single action (`fg.link` text button), auto-dismiss 5s (errors: 8s + manual dismiss), `slow` slide+fade. **Undo convention (v6.0):** reversible-lite mutations (archive, remove-from-view, single delete with soft-delete backing) confirm via Toast with an Undo action at 8s instead of pre-confirming — prefer undo over Popconfirm when the operation is safely reversible; the pair never both appear for one action. Same-scheme surface: light in light mode, dark in dark mode (changed in v2.0). **First-line alignment (v6.27.2):** contents top-align to the first text line — icon at +2px, action link on the text line-height, and the dismiss × as a compact 20px box (inline dismiss affordances in Toasts and quote bars are not form controls; the control-height scale does not apply to them). Trailing controls never center against a wrapped block.
**Forbidden:** toasts for validation errors (inline at the field); toasts requiring a decision (Modal); stacking >3 (queue instead); inverse/contrast-flipped styling.

---

## Banner / Alert

Persistent inline notice for a page or section. Full-width of container, radius `md`, padding 12/16: 16px icon + `body-sm` text + optional action link + optional dismiss.

**Color variants:** `neutral` (non-status notices: scheduled maintenance windows, informational context — `bg.sunken`, `fg.secondary`), `info`, `success`, `warning`, `danger`.
**Emphasis variants:**

| Emphasis | Rendering | Use |
|---|---|---|
| `subtle` (default) | borderless `status.*-bg` fill, `status.*` text — no border, no rail (v6.7.1 maintainer reversal of the v6.4 left rail: dated; the fill + colored text alone is the modern rendering. Tint + saturated outline remains the forbidden wireframe formula) | Page- and section-level notices. |
| `solid` | `status.*-bg-solid` fill + `fg.on-solid` white at **semibold (600)** — never regular weight on a solid fill, no border | System-critical, app-wide strip pinned above all chrome (outage, billing lock, forced upgrade). Full-bleed, no radius, max one in the entire app, always with an action. Keep the message short — the solid-label contrast policy (foundations §8) applies. |

**Forbidden:** more than one Banner visible per region; `solid` for anything a user can simply dismiss; Banners as marketing surfaces.

---

## Avatar

User/agent identity. Sizes 20/24/32/40/56px (20 = dense table cells and inline mentions; 56 = profile surfaces). `full` radius for humans; squared (`sm` radius) for agents — mandatory product language, shape alone must scan authorship. Image, or initials (2 Latin letters / 1 Hangul syllable) on deterministic `viz` palette background at 20% opacity with matching 600-weight text.

**Status indicator:** optional dot, bottom-right, 2px `bg.page` ring. Sized per avatar: 24→8px, 32→10px, 40→12px, 56→14px; the 20px avatar NEVER carries a dot (illegible at that scale — surface the state elsewhere in the row). Humans: presence (`status.success-bg-solid` = active, `border.strong` = away). Agents: run state (`status.info-bg-solid` pulse = running, `status.danger-bg-solid` = failed, none = idle). Dots use the mid `-bg-solid` values, never the darker text tokens. One vocabulary per product surface — never both meanings in one view.
**AvatarGroup:** overlapping stack (offset −25%, each with 2px `bg.page` ring), max 4 visible + "+N" overflow circle (`bg.sunken`, `micro` text; click → popover listing all). Humans and agents may mix in a group; ordering is humans first, then agents.
**Forbidden:** rectangular human avatars or round agent avatars; status dots without an established vocabulary; groups hiding the overflow count.

---

## Skeleton · Spinner

Skeleton (preferred): `bg.sunken` blocks, radius `xs`, subtle 1.5s opacity pulse, mirroring the true layout — for any load >300ms with known shape. **Preset shapes (v6.0):** `line` (one text row at the local type style's height), `block` (rect at the target's dimensions), `circle` (avatar placeholder at avatar sizes) — compose these three; free-form skeleton shapes are forbidden. Spinner (16/20px, `fg.tertiary` stroke): inside controls and unknown-shape loads only. **Forbidden:** full-page spinners when layout is known; skeletons that don't match the loaded layout; more than one spinner visible per region.

---

## EmptyState

Every list, table, and search MUST have one. Centered in the content area: optional 24px icon in a 48px `bg.sunken` **medallion — two concentric hairline rings** (1px `border.default` at −8px, 1px `border.subtle` at −16px; v6.4, pure borders, no gradient/glow) · one-line title (16 semibold) · one-line explanation (body, `fg.secondary`) · optional single action (primary if creating the first object, secondary otherwise). The error flavor tints the medallion `status.danger-bg`/`status.danger`.
Three sanctioned flavors: first-use ("Create your first …" — KO: "첫 … 만들기"), no-results ("No matches for '{query}'" + clear-filters action), error ("Couldn't load …" + retry action).
**`compact` variant (v6.0):** for small containers (Drawer sections, popovers, NotificationCenter, HoverCard bodies): no icon circle, single `body-sm` `fg.secondary` line + optional inline Link action, padding 16. Full-size EmptyStates inside small overlays are forbidden — use compact.
**Forbidden:** illustrations (v1 has no illustration language); multi-paragraph explanations; dead-end empty states with no action when an action is possible.

---

## Pagination

Table/list navigation: 13px, previous/next icon-buttons + page numbers (current: `bg.selected`), plus "N of M" summary (`fg.tertiary`) and optional page-size Select in dense tables. Use cursor-style "Load more" (secondary Button) for feeds. **Forbidden:** infinite scroll in data tables.

---

## CommandPalette

**Purpose:** universal keyboard-first entry point for navigation, actions, and asking the agent. Opened with ⌘K / Ctrl+K from anywhere; also via the topbar search affordance.

**Anatomy:** centered overlay, 560px wide, offset 15vh from top, **glass material, scrimless** (foundations §5, v6.31: the frost is the focus device — glass over a scrim goes muddy; esc/click-away dismiss as before; reduced-transparency → opaque `bg.raised`), radius `lg`, `shadow.modal`. Search input (borderless, 16px, full-width, leading search icon) · result list (max 8 visible, then scroll) · footer strip (11px `fg.tertiary` keyboard hints using `.sy-kbd`).
**Results:** grouped under 11px medium `fg.tertiary` group labels (Recent / Navigation / Actions / Agents). Rows: height 40px, 16px leading icon, 13px label, trailing `.sy-kbd` shortcut or `fg.tertiary` context; selected row `bg.selected`. Actions that invoke AI carry the squared agent glyph.
**States:** empty query → recent items; no results → single EmptyState-style row plus the mandatory final fallback row **"Ask agent: '{query}'"** (`ai.fg` text + squared glyph) — the palette never dead-ends; loading → 3 skeleton rows.
**Behavior:** full keyboard (arrows, Enter, Esc, ⌘K toggles); type-ahead filters instantly (<50ms local, async results appended under their group); executing closes the palette; focus returns to the invoking context on close.
**Forbidden:** more than one palette; palette as a form container; mouse-only affordances; fuzzy-match results without highlighting the matched substring.
**Bilingual:** matching must work across both locales' labels and reasonable romanization of Hangul; group labels localize; result rows never truncate the label (truncate the trailing context instead).

---

## ProgressBar

**Purpose:** progress of long-running work (agent runs, imports, batch jobs). See `ai-patterns.md` §11 for when it is mandatory.

**Anatomy:** 4px track (`bg.sunken`, radius `full`) + fill (radius `full`). Optional label row above: 13px description left, "N of M" or percent right (`fg.tertiary`, tabular-nums).
**Variants:** `default` (fill `meter.fill` — neutral mid-gray, user-initiated work; changed from key-black in v3.6), `ai` (fill `ai.solid` — agent runs; v6.19, was accent-bg). **Determinate** fill animates width at `base` duration; **indeterminate** shows a 30%-width segment sweeping at 1.2s intervals.
**States:** in-progress, success (fill switches to `status.success-bg-solid` for one `slow` beat, then the bar is replaced by its completion state), failed (fill `status.danger-bg-solid`, bar persists with error text below), cancelled (fill `border.strong`).
**Usage-meter jurisdiction (v5.2):** plan/token/quota consumption is the sanctioned "capacity" use of ProgressBar — determinate, `meter.fill`, switching to `status.warning-bg-solid` at ≥80% and `status.danger-bg-solid` at 100% (with the plan-limit Banner escalation). Lives in settings/billing surfaces and MAY appear as a compact bar adjacent to the Composer when a limit is near; NEVER as permanent navigation chrome. Values tabular-nums ("1.2M / 2M tokens").
**Forbidden:** heights other than 4px; percent text without a known denominator; static "score" displays (compose a stat Card instead — quota consumption is the one sanctioned capacity meter); more than one indeterminate bar per region.

---

## Composer

**Purpose:** the message/instruction input for Console and inline ask-agent surfaces — the single most-used control in AgentOS. (Added v5.2.)

**Anatomy:** container (`bg.sunken` fill, radius `lg`, focus ring on the container) · optional ComposerQuote bar (ai-patterns §18: ai.surface, radius `xs`, single line + ×, max one) · attachment rows above the text area (**grouped by kind, v6.28.1: image tiles on one row, document chips on the row below — chronological within a kind, a row disappears when empty; mixed heights in one row read ragged, and attachments are a set, not a sequence**) (input Chips; remove per chip; **image attachments render as 48px thumb tiles instead — radius `xs`, hairline, compact 16px × overlay (the v6.27.2 compact-dismiss family), filename in the tooltip. Images are the one attachment type where the thumbnail IS the identity; document attachments stay text chips, and ContextCard's no-thumbnail rule is untouched — v6.28**) · auto-growing textarea (1→8 rows, then internal scroll; placeholder per content rules, `fg.placeholder`) · **contextual refine-prompt (v6.44):** a pen-line `ghost` icon-button floating at the input's top-right (textarea gains 40px right padding), rendered ONLY while the draft is non-empty — an empty prompt has nothing to refine (§24), so the affordance earns its pixels instead of idling in the footer · footer row (v6.44 anatomy): leading **+ composer-menu icon-button** (`plus` — menu: 파일 첨부, 템플릿 라이브러리… §23, 도구 → switch popover v6.41; replaces the v6.43 paperclip + ⋯ pair — the tray itself remains the drop target per the dropzone pattern) + agent/scope picker (`ghost` button, **compact 8px side padding — v6.44.1: labeled ghost controls inside the tray (agent + model pickers) drop from the 12px control default; the avatar and chevron already carry visual mass, so default padding reads detached**: squared agent Avatar 20 + name + chevron; its menu (v6.15): search row on top, `micro-label` groups, per-row squared avatars + optional `neutral` Badge, one "모든 에이전트" submenu, and a mandatory footer escape row "에이전트 요청" — the picker never dead-ends; the v6.41 in-picker model rows were pulled out in v6.42 (maintainer reversal): model is a sibling Composer control and agent rows carry NO model captions — one object per menu); trailing side: **model selector** (v6.42; repositioned to the trailing group v6.44, where the kbd hint sat — mono model name + chevron; menu (v6.45) = provider groups under `micro-label` headers (Anthropic / OpenAI / Google …), single-line rows with the model name in mono 12 + trailing check on the active row, separator, 자동/에이전트-기본값 row; **model names are real product nouns: English, mono, never translated, never truncated; provider headers are plain text — brand logos stay in connector contexts (v6.17), a menu group header is not one**; per-conversation, defaults from agent config, org policy MAY lock it read-only; never changes permissions, tools, or approval rules) + **mic** (§26 — send-adjacent since v6.43: dictation fills the message you are about to send; NEVER inside the + menu) + **send** (**`brand`** icon-only circle, arrow-up — a sanctioned icon-only exception unique to Composer; v6.51: the point color `#0621C4` as a conversational-AI CTA, reversing the v6.19 primary — it is the screen's one brand accent; the send↔stop morph swaps brand→`secondary` for stop). The ⏎/⇧⏎ kbd hint caption is REMOVED from the footer (v6.44 — behavior unchanged; shortcuts teach via tooltip/onboarding, not permanent chrome). One visible leading icon is the new default; five stays the hard cap. **v6.47 input-pattern adoptions:** + button carries a 6px `fg.primary` deviation dot (top/right −2px, notification-overlay family) whenever tool toggles differ from the agent's defaults — capability state is never silent; placeholder gains the slash hint variant ("… · / 명령") — an undiscoverable trigger is an anti-pattern; attachments MAY carry the §28 advisory caption; zero-state starters per §27 render above the tray; ghost-text continuations per §30.

**Send ↔ Stop morph:** while the agent is generating, the send button becomes **stop** (square icon, `secondary` tonal) in the same position — never a second button, never disabled. The composer input itself is NEVER disabled during generation (ai-patterns §2): typing continues; Enter queues or interrupts per product setting.
**Slash commands (v6.15):** `/` at the start of an empty Composer scopes the command palette to agent actions; while typing, the remainder of the single best match renders as `fg.placeholder` ghost text, accepted with → (never Tab — IME conflict) and dismissed by typing on. Commands come only from the closed action glossary; free text never triggers completion.
**Keyboard:** Enter sends, Shift+Enter breaks line — and **Enter during IME composition NEVER sends** (Korean/Japanese input composes via Enter; sending mid-composition is the classic KO input bug). Kbd hint (`micro`, `fg.tertiary`) below on focus, first-run only.
**States:** default, focus (ring on container), generating (stop morph), send-failed (inline `caption` `status.danger` error + retry text button above; draft preserved), empty (send disabled is the ONE sanctioned disable — nothing to send).
**Drafts:** content persists per conversation across navigation; never silently discarded.
**Forbidden:** disabling the composer during generation; toolbar clutter (formatting buttons — agent input is plain text + attachments); more than one Composer per screen; placeholder carrying instructions that vanish on focus (use the kbd hint).

---

## ResponseToolbar

**Purpose:** actions on an agent message: copy · regenerate · feedback (thumbs) · overflow. (Added v5.2.)

**Anatomy:** row of `ghost` icon-buttons (16px icons), bottom-left of the agent message, `fg.tertiary` at rest. Order fixed: copy, regenerate, thumbs-up, thumbs-down, ⋯ overflow.
**`media` variant (v6.16, jurisdiction tightened v6.17.7):** a vertical pill rail (raised fill, `border.overlay`, `shadow.raised`, radius `full`, 4px padding) anchored beside a MediaGroup — copy + thumbs only, hover-reveal, one rail per group. ONLY when the MediaGroup is the message's sole content: when media accompanies text, the message-level toolbar governs the whole reply and the rail is forbidden (two feedback surfaces on one message is redundant).
**Placement:** hover/focus-reveal on desktop focus surfaces; persistent in dense consoles (hover-dependent affordances need persistent fallbacks there).
**Behavior:** copy copies the markdown source (Toast confirms); regenerate only on the latest agent message (earlier messages drop it); thumbs select-state = `bg.selected` fill at the button's standard radius + `fg.primary` stroke (v6.47.1 — was `border.focus` blue + circle, a v5.2 relic violating two later laws: blue is reserved for focus/links/status.info, and selection reads as fill + ink, not shape — the Composer send button stays the ONLY circular control) (NEVER a filled icon — stroke set only; the favorite star is the sole fill-on-active exception), mutually exclusive, tappable to undo. **Optical centering (v6.47.2, numeral-nudge family):** the thumbs glyphs carry asymmetric ink (up is right-heavy, down left-heavy — ~1.5px off geometric center in a 16px render); both get a ∓1px translateX so ink centers inside any visible fill. Applies wherever the thumbs pair renders (message toolbar + media rail); thumbs-down MAY open a one-field comment Popover ("What went wrong?" / "어떤 점이 아쉬웠나요?"), never required.
**Jurisdiction:** agent messages only — never on human bubbles, never on ProposalCards (those have their own footer).
**Forbidden:** destructive actions in the toolbar; share/export actions outside the ⋯ overflow; feedback icons anywhere except here.

---

## AgentStep

**Purpose:** one row of visible agent work (a reasoning step or tool call). Full behavior: `ai-patterns.md` §3–4.

**Anatomy:** 12px state indicator · 13px verb-first summary · optional mono tool identifier · optional duration (`fg.tertiary`, tabular-nums) · optional trailing Retry ghost button (failed only). Row height 28px; expanded detail renders `.sy-code-block` below the row, indented to the text edge.
**States (closed):** `pending`, `running`, `success`, `failed`, `skipped` — exactly as specified in `ai-patterns.md` §3. A step list collapses to a summary row on completion ("5 steps · 12s", expandable).
**Forbidden:** nesting beyond one level; paragraph-length summaries; using AgentStep outside agent activity (it is not a generic checklist — compose Checkbox lists for that); animating state transitions beyond the indicator swap.
**A11y:** the list is `role="log"` with `aria-live="polite"`; state changes announce as text, not sound.

---

## ProposalCard

**Purpose:** human-in-the-loop approval of a consequential agent action. Full behavior: `ai-patterns.md` §5.

**Anatomy (v6.20 — tray):** borderless `ai.surface` fill, radius `lg`, no shadow — the same borderless-filled language as the Composer tray; the Console's two anchor objects speak one dialect. Header row (**uniform 12px padding** — v6.20.1: the icon reads the spacing; `ai.border` bottom hairline on the single-tone tray — v6.21.1 maintainer reversal of the v6.21 two-tone band): squared agent Avatar (24, **first in the row — with color no longer signaling AI, the avatar is the agency marker**) + agent name (13 medium) + "proposes" (`ai.fg`). Body (padding 12×16, on the tint): one-sentence action summary + payload (diff block, message preview, or affected-record list — max one payload type per card); **payload surfaces open to `bg.page`** (tray rule — this is what gives the object internal depth). Footer (padding 0 16 16): Approve (`primary`; `danger` if destructive — v6.2) + Reject (`secondary` — **on-tint rendering, v6.21.3:** in light mode the tonal gray fill is near-identical to the slate tray, so secondary opens to `bg.page` here, the tray rule applied to controls; dark mode keeps the standard fill, whose contrast holds) + optional Edit (`ghost`), directly on the tint. The forbidden formula remains tint + outline (the wireframe callout); borderless tint with page-filled internals is its opposite.
**States:** open, resolved-approved / resolved-rejected (collapses to attribution row: icon + "Approved by {user} · {time}"), expired (agent withdrew or context changed — `fg.tertiary` note, actions removed).
**Forbidden:** auto-approval, approval countdowns, default-focused Approve-all in batches; more than 3 footer actions; ProposalCards for non-consequential acts (answering a question needs no approval); removing resolved proposals from the transcript.
**Bilingual:** consequence statements name count + noun in both locales; button labels never truncate.

---

## DescriptionList

**Purpose:** key–value display — the backbone of Object detail views, drawers, and expanded table rows. (Added v2.0 gap audit: previously improvised with ad-hoc label/value stacks.)

**Anatomy:** rows of term + description. Two layouts: `side-by-side` (term `label` `fg.secondary` left column, min-width 120px sized to the widest term of the active locale, max 200px; description `body` right) and `stacked` (term above description; use in narrow panes <360px). Rows separated by `--sy-space-8`; optional full-bleed `border.subtle` row dividers.
**Description content:** plain text, or exactly one inline component: Badge, Chip list, user/agent (Avatar 20 + name), `code-sm` ID, Link, or timestamp. Empty value = "—" (`fg.tertiary`).
**Optional row action:** trailing ghost icon-button (copy, edit) visible on row hover.
**Forbidden:** more than ~10 rows without grouping under `heading-sm` titles; two-column term/value grids (KO/EN term widths diverge — one list per column region instead); using it as a form (labels + inputs = form, `patterns.md` §3).
**A11y:** semantic `<dl>/<dt>/<dd>`.
**Bilingual:** term column width from the active locale's widest term; terms never truncate.

---

## ButtonGroup

**Purpose:** visually attached group of related actions. (Added v2.0 gap audit.)

**Variants:**

| Variant | Composition | Use |
|---|---|---|
| `attached` | 2–4 `secondary` (tonal) buttons fused into one shape (radius only on outer corners; 1px `border.default` separators between segments) | Peer actions operated together: zoom in/out, prev/next, view toggles with actions. |
| `split` | primary action button + attached chevron button opening a Menu of alternative actions | "Run" + ▾ (Run with options…, Schedule run…). The menu's actions must be true variants of the main action. |

Split follows its main button's variant (`primary` or `secondary`; `brand` is the point-color CTA and is not used in split buttons); the chevron segment is 28px wide, same height/variant, separated by a 1px divider in the border color (or `alpha.white-16` on solid fills).
**Forbidden:** attaching `primary` buttons to each other (one primary per region still holds); split buttons whose menu contains unrelated actions; more than 4 segments; using `attached` where SegmentedControl (exclusive state) is the real need.
**A11y:** `role="group"` with a group label; split's chevron gets `aria-haspopup` + its own label ("More run options").

---

## SourceChip

**Purpose:** inline provenance marker for agent claims. Full behavior: `ai-patterns.md` §6. **Marker anatomy (v6.37 — maintainer reference: circular superscript style):** an 18px round chip (`radius.full`, **neutral `bg.sunken` fill, `fg.secondary` bare numeral** — no brackets, 11px semibold tabular, sans not mono, **1px top-padding optical nudge — the Badge md-nudge precedent: Pretendard's 11px digits sit high at line-height 1 in small containers; applies to the pill's numeral circle too, v6.38.4**) at the end of the supported sentence, `text-bottom` aligned; hover/link-highlight steps to `ai.surface-hover`. The bracketed mono `[n]` form is retired.

**Anatomy:** 18px height, `bg.sunken`, radius `xs`, mono 11 numeral (`[1]`), placed after the supported sentence, 2px baseline offset. Hover/click → Popover with source title, origin icon, timestamp, open link. Message footer lists all sources (13px `fg.secondary`).
**States:** default, hover (`bg.selected`), broken (source no longer retrievable — chip gets `status.warning` numeral and the popover says so).
**Forbidden:** decorative use, self-citation, fake numbering, more than 3 chips per sentence (synthesize instead); footnote styles other than this one.

---
**Sources row (v6.36, layout v6.37.1):** the plain-text footnote line is retired — a `micro-label` "출처" eyebrow sits on its own line ABOVE a row of **pill-shaped** source cards — borderless `bg.sunken` fill; anatomy (v6.38.2): a **leading 18px page-filled numeral circle** (11/1 semibold tabular — structurally mirrors the inline marker: both are numbered circles, at text scale and pill scale) + **12px source-type icon (`fg.tertiary`)** + source name (12/18, `fg.secondary`), gap 6, padding 2×8 with a 2px leading inset so the circle sits evenly (icon restored v6.38.3, maintainer preference — with the numeral contained in its circle, the icon reads as clean metadata rather than clutter; it aids scanning when several sources share a row). Hover on the gray ladder's next step. The pill silhouette deliberately differs from the rounded suggestion Chips sharing the Console — the two chat-chip species must be tellable apart by shape alone; source pills are ContextCard derivatives, outside the Chip family's rounded rule. Hovering a card highlights its inline [n] markers and vice versa — the number mapping becomes visual, not mental. **Hit target (v6.36):** the 18px chip keeps its visual size but carries an invisible ≥24px hit area (inset −4 pseudo) — the 24px floor applies to targets, not glyphs.

## ContextCard

**Purpose:** a referenced object (document, meeting, table, page) rendered as a physical card in Console threads and the Composer — the visible form of "what the agent is looking at". (Added v6.14.)

**Anatomy:** outlined `bg.raised` card, radius `sm`, padding 8×12, max-width 240: object-type icon (14px) on a 24px `bg.sunken` tile (radius `xs`, concentric-exempt: flowing content) · title (13 medium, single line, ellipsis) · `caption` meta (source · date), one line max. Hover: `border.strong`; click opens the object.
**Stack:** 2+ referenced objects stack flat — a single offset underlay card at −4px with the top card separated by a 2px page-colored outline ring (count-overlay precedent), plus a `+N` Badge on the top card. Max 3 visible objects; expand lists vertically. **No rotation** — precision, not playfulness.
**Compact (Composer @-mention):** icon tile 16px + title only, padding 2×8; renders inline in the Composer text row.
**Forbidden:** thumbnails or content previews inside the card (v1 has no preview language); more than one meta line; manual colors; stacks used for anything but referenced objects.

---

## Timeline

**Purpose:** chronological activity — audit trails, run history feeds. (P3, v5.3.)

**Anatomy:** rows of actor Avatar 20 (shape = actor type — the round/squared system carries authorship) · verb-first sentence (`body-sm`; actor name and object at weight 500, object is a Link) · timestamp (`caption` `fg.tertiary`, relative with absolute on hover). Day dividers: full-bleed hairline + `label-sm` `fg.tertiary` date. Filterable via the R6 filter bar.
**Behavior:** consecutive same-actor events MAY collapse ("edited 3 fields" / "필드 3개 수정") expandable; handoffs render as first-class events (ai-patterns §16); load older via "Load more" (never infinite table rules — feeds are the sanctioned cursor case).
**`compact` variant (v6.0):** avatar-less `caption`-height rows for embedded mini-logs inside Cards/Drawers (actor name inline, weight 500); full Timeline remains the page-level form.
**Forbidden:** editable or deletable history rows; relative-only timestamps; mixing a comment thread into the audit feed (separate surfaces); icons per row unless the concept is in the registry.

---

## Tree

**Purpose:** hierarchy display and selection — folders, org units, nested resources. (P3.)

**Anatomy:** rows 28px: disclosure chevron (rotates, `fast`) · optional registry icon 16 · label (`body-sm`) · optional trailing count Badge. Indent 20px per level; max 4 rendered levels — deeper hierarchies drill in, never scroll horizontally (labels truncate middle-out + Tooltip).
**Selection:** single (row `bg.selected`) or checkbox mode with mixed-state parents (the cross-component mixed convention).
**Keyboard:** arrows navigate/expand/collapse, roving tabindex, type-ahead.
**Drag:** re-parent only where the model allows; drop target = 2px `border.focus` insertion line.
**Forbidden:** trees for flat or 2-level data (grouped list instead); connecting guide lines (indent + chevron suffice).

---

## CodeBlock

**Purpose:** code, logs, config display — promotion of `.sy-code-block`. (P3.)

**Anatomy:** `bg.sunken` container, radius `md`; header row: language chip (`micro` mono `fg.tertiary`) + copy icon-button (ghost, Toast confirms); body `code` style, optional non-selectable line numbers (`fg.tertiary`); wrap off by default with horizontal scroll; max-height 400px + "Show all" expander.
**Syntax theme:** one muted theme system-wide, ≤5 colors drawn from `viz` + `fg` tokens, defined once at implementation — never bright/rainbow themes, never per-surface themes.
**Streaming:** renders when the fence closes (ai-patterns §12).
**Forbidden:** editing affordances (this is display; editors are out of system scope); nested scrolling beyond the one horizontal overflow.

---

## DiffView

**Purpose:** standalone change comparison — run configs, policy edits; promotion of the ProposalCard diff rules. (P3.)

**Anatomy:** unified layout default; side-by-side variant permitted ≥960px for config comparisons. Line rows: gutter (+/− marker + optional line number) + mono 12 content. Added = `status.success-bg`, removed = `status.danger-bg`, word-level changes darker tint within the line — NEVER color alone (gutter markers are the colorblind-safe channel). Unchanged runs collapse to an expandable "⋯ 24 unchanged lines" row. Header: object name + change counts (+12 −4, tabular).
**Forbidden:** three-way diffs (out of scope v1); syntax highlighting inside diffs (one signal at a time); scroll-linked panes that can desynchronize.

---

## MediaGroup

**Purpose:** agent-**generated** media (images, chart renders, previews) presented as a casual fan in Console replies — the system's one sanctioned playful moment. (Added v6.16.)

**Anatomy:** cards `bg.page`, 1px `border.default`, radius `md`, 2px page-colored outline ring for separation, overflow hidden; media area object-fit cover on top + **caption strip** below (`bg.surface`, hairline top rule, `micro` label; the `+N` Badge sits right-aligned in the strip — v6.17.6). 2–3 cards fan with **±2.5° alternating rotation** and ~20% overlap; a single item renders flat. Max 3 visible + `+N` Badge on the last card; click opens the media viewer.
**Behavior:** hover/focus straightens the card (rotate → 0) and raises it (`shadow.raised`) at `fast`; `prefers-reduced-motion` renders the whole group flat and static.
**Jurisdiction (hard):** ONLY agent-generated media inside agent replies. Referenced/attached objects use ContextCard (always flat); thumbnails elsewhere are forbidden. **Rotation exists nowhere else in the system** — see design.md §8.
**Principle (v6.16):** playfulness lives in the agent's *output*, never in the chrome.

---

## Slider · NumberInput

**Purpose:** bounded continuous values (Slider) and precise numeric entry (NumberInput). They pair; neither replaces the other. (P3.)

**Slider:** 4px track (`bg.sunken`) + `action.primary-bg` fill + 16px thumb (focus ring); value label appears above the thumb while dragging (Tooltip surface); optional tick marks at enumerated stops; arrows step, Shift = 10×; `range` variant = two thumbs, `bg.selected`… no — fill between thumbs uses the standard fill. Jurisdiction: values where *position is meaning* (thresholds, sampling %, volume). NEVER without a visible numeric value; NEVER for unbounded or precision-critical values.
**NumberInput:** filled Input + stacked stepper (chevrons, 24px hit each) + optional unit suffix (`fg.tertiary`); typed entry free, clamps to min/max on blur with a `caption` note; arrows step. Tabular numerals.
**Forbidden:** sliders for dates/times; steppers on non-numeric inputs; percent sliders whose denominator is unknown.

---

## ChoiceCard

**Purpose:** one-of or many-of selection where options deserve descriptions — plan pickers, agent-type choice, onboarding decisions. (P3.)

**Anatomy:** grid of `outlined` Cards (2–3 columns, equal height), padding 16: optional 20px registry icon · title (`heading-sm`) · description (`caption` `fg.secondary`, ≤2 lines). Selected = 1px `border.selected` border + a 4px lighter `border.subtle` outline flush against it (offset 0 — no gap, so the thin selected line and the wider gray band read as one continuous two-tone halo, not a thickened single border) + 16px check top-right. Radio semantics by default; `multi` variant uses checkbox semantics and shows Checkboxes.
**Jurisdiction:** 2–6 options that need explanation. >6 or bare labels → Radio/Select.
**A11y:** `radiogroup`/`group`, arrow-key navigation, whole card is the target.
**Forbidden:** nesting inputs inside choice cards; unequal card heights in one group; images/illustrations (v1 has none).

---

## HoverCard

**Purpose:** rich preview of an entity reference (user, agent, run) on hover/focus. (P3.)

**Anatomy:** popover ≤320px, `bg.raised-2`, `border.overlay`, `shadow.overlay`, `z.dropdown`: Avatar header (name + `caption` role/state) + 2–4 DescriptionList rows + optional single ghost action. Opens after 500ms hover or on focus; closes on leave/Esc.
**Rule:** hover is enhancement, never requirement — everything in a HoverCard must also exist on the entity's click-through page (keyboard and assistive access must not depend on hover).
**Forbidden:** forms; nested HoverCards; hover cards on elements that already open popovers.

---

## Popconfirm

**Purpose:** inline confirmation for low-stakes reversible-ish actions — the step between no-confirm and Modal. (P3.)

**Anatomy:** popover anchored to the trigger (`z.dropdown`): one consequence-naming question (`body-sm`) + Cancel (`ghost` sm) + confirm (`danger`/`primary` sm). Esc/outside-click cancels.
**Jurisdiction:** single-object actions whose result is easily recreatable (unpin, clear a saved filter, remove one attachment). Permanent data loss, bulk operations, or anything with named counts → Modal (R5 rules).
**Forbidden:** chaining popconfirms; inputs inside; using it to soften actions that deserve a Modal.

---

## ContextMenu

**Purpose:** right-click menu on dense data surfaces. (P3.)

**Anatomy & behavior:** the Menu component, opened at pointer position (`z.dropdown`); same item rules (registry icons, destructive last, full-bleed dividers, 4px gaps).
**The duplication rule:** every context-menu action MUST also exist in visible UI (row actions, toolbar, ⋯ menu) — context menus are an accelerator, never the only path (discoverability — pointer-hidden affordances must not gate any action).
**Jurisdiction:** dense tables, trees, canvas-like surfaces. Not on focus-archetype prose.
**Forbidden:** context-only actions; submenus beyond one level; overriding browser context menu on text selections.

---

## CalendarView

**Purpose:** schedule visualization — when agents run, what ran. Not a booking system. (P3.)

**Month grid:** DatePicker cell anatomy scaled up — day cells ≥96px tall, day number `label-sm` (today = outlined pill), events as dot + `body-sm` text rows (event dot follows the category color rule: system-assigned viz tint), max 3 per cell then "+N" → popover listing all.
**Week variant:** hour rows (48px) with event blocks; block = viz tint fill + `label-sm`; overlaps split width.
**Behavior:** click event → popover with DescriptionList + open action; drag-to-reschedule only where the schedule model allows, with Toast confirm + undo.
**Forbidden:** month cells scrolling internally; empty-day placeholders (empty days are simply empty); more than one event color system (viz assignment only).

---

## NotificationCenter

**Purpose:** the bell's panel — what happened while you were away. (P3.)

**Anatomy:** popover panel 360px (`z.dropdown`): header ("Notifications" / "알림" + settings and mark-all-read ghost icon-buttons) · a **filter SegmentedControl** (All / Unread / Mentions, full-width, immediate filter) · a scrolling list grouped Today / Earlier (`label-sm`; a group header hides when its filter leaves it empty) · items: a **leading marker** — the actor's Avatar 20 for actor events (round human / squared agent) or a neutral 20px type medallion for system events — plus a templated sentence (content.md verbs), a `caption` timestamp, and an optional single inline action; unread = `bg.surface` fill + 8px `status.info-bg-solid` dot on the left edge · footer: a single full-width "View all" ghost button to the full page (after 30 items).
**Item types (v6.59):** `run` (agent run finished), `approval` (a proposal awaiting review — its one inline action only *opens* the ProposalCard), `mention` (what the Mentions filter selects), `comment`, and `system`. Type is carried by the leading marker and the verb — never by tint alone.
**Per-item controls (v6.59):** hovering or focusing a row floats a small control cluster over its right edge — toggle read/unread and dismiss (×) — without hiding the timestamp or changing the row's height (reveal-on-hover only *adds* an overlay, it never removes existing content or reflows the row); the header's mark-all-read clears every unread at once. These are chrome, separate from the single content inline action.
**Behavior:** clicking an item navigates to the object and marks it read. A present inline action only *opens* its surface for consequential acts — approving an agent proposal happens on the ProposalCard, never from a notification. The Unread and Mentions filters and the read/dismiss controls never surface a number — the bell's count overlay is the only count.
**Empty state:** the compact flavor ("You're all caught up" / "모두 확인했습니다"), shown when a filter yields nothing or the list is cleared.
**Forbidden:** marketing content; more than one content inline action per item (the read/dismiss hover controls are exempt — they are chrome, not content actions); unread counts anywhere except the bell's count overlay (99+ rule); type expressed by color/tint alone.
