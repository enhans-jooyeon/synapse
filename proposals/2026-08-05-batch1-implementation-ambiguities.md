# Batch-1 spec ambiguities surfaced by the React build-out (Chip · Avatar · SegmentedControl · Tabs) — 2026-08-05

**Status: OPEN — nothing here is resolved.** Track B batch 1 (the smaller four of `docs/DISTRIBUTION.md`'s dependency chain) forced an implementation decision wherever `components.md` is silent or self-inconsistent. Each point was implemented with a **flagged provisional reading**, NOT resolved; the implementations are in `storybook/src/components/{Chip,Avatar,SegmentedControl,Tabs}/` with the reading noted in JSDoc/CSS comments, exactly as the Button realignment did (`proposals/2026-08-05-button-implementation-ambiguities.md` — that register's six readings were ratified 2026-08-05; these await the same pass). `components.md` was NOT touched.

## Chip

| # | Ambiguity | Implemented reading (provisional) | What needs ruling |
|---|---|---|---|
| C1 | The closed variant table names no API default | `variant` defaults to `"input"` (the table's first row) | State the default in the spec — or rule that Chip has no default and the prop is required |
| C2 | No type style stated — the entry pins only "height 24px, radius `sm`" | Label 12/18 medium (`label-sm` metrics), plain flex centering, no optical nudge — Badge's optical-centering note fixes "24px/12px proportions (`lg` badge, **Chip**)" and rules the nudge md-badge-only, so 12px is strongly implied but never stated in Chip's own entry | Add the type style to the Chip entry (one clause) |
| C3 | Padding-x and glyph–label gap unstated | Padding-x 8 (`control-padding-x-xs`, the 24px control step) with the foundations §3 −2px affix trim on glyph sides; glyph–label gap 4 (12px glyphs sit tighter than Button's 16px-icon 6px) | Confirm 8/−2/4 or state the Chip paddings |
| C4 | States slot says "hover (`bg.hover` **or** `border.strong`)" without assigning per variant; only `suggestion` states its hover (both channels) | `list-filter` hover = `bg.hover` + `text.primary` (the universal row/menu overlay); `input` body takes NO hover (it is not a target) — its ✕ takes `bg.hover` on its own 16px box. The ✕'s hover treatment and hit geometry are unstated | Assign the hover channel per variant; state the ✕'s box/hover |
| C5 | **Self-contradiction:** rule 1 says *every* Chip carries an affordance glyph ("a Chip with no glyph and no selected state is a mislabelled Badge"), but `suggestion`'s rendering names no glyph and the variant has no selected state | `suggestion` renders with NO glyph, per its own rendering column; the contradiction is recorded, not resolved | Either give `suggestion` its glyph (none of the closed three — ✕/✓/▾ — fits "accept a suggestion") or scope rule 1 to input/list-filter |
| C6 | The glyph closed set includes trailing ▾ "opens a menu", but no variant in the closed table carries a menu behavior | Not exposed in the API — no menu chip exists to attach it to | Name the variant that may carry ▾, or drop it from the glyph list |
| C7 | `input` "MAY carry a leading Avatar **16**" — 16 is outside Avatar's closed size set (20/24/32/40/56) | A 16px `avatar` slot that clamps whatever is passed to 16px | Add 16 to Avatar's Sizes (chip-embedded jurisdiction) or re-point Chip at Avatar 20 |
| C8 | `list-filter`'s selection model has no API default | `selectionMode` defaults to `"multi"` (filter ROWS are the lead use case and multi is the quiet treatment) | State the default |
| C9 | Disabled states only `text.disabled` + `border.subtle`; the interaction with the selected fills is unstated | Selected treatments collapse to the disabled outline (a live `bg.inverse-soft` fill or `border.selected` on a dead control reads as available — the Button disabled-outline logic); resting fills (`bg.page`/`bg.raised`) are kept | Confirm collapse, or specify disabled-selected rendering |

## Avatar

| # | Ambiguity | Implemented reading (provisional) | What needs ruling |
|---|---|---|---|
| A1 | No API defaults stated | `size` defaults to `32`, `kind` to `"human"` | State the defaults |
| A2 | "**deterministic** viz palette background" — no assignment function named | Char-code polynomial (×31 mod 997) over `name`, mod 8 → `--sy-viz-1…8`; stable across renders and sessions for the same name | Name the hash (it must match any other renderer of the same avatar, e.g. the product frontend) |
| A3 | **Token gap:** the 20%-opacity viz tint has NO tokens — `tokens/synapse.css` carries only the placeholder comments where the category tint/text families were removed ("category tint fills — SOLID (opaque) viz tints") | `color-mix(in srgb, var(--sy-viz-N) 20%, var(--sy-bg-page))` — an OPAQUE mix over the page (no alpha; mode-aware through both tokens) | Mint real `viz-*-tint` tokens (SY020-gated) and re-point; a color-mix in component CSS is exactly what the solid-tint comment retired |
| A4 | "matching 600-weight text" vs the tokens file's own rule "never use raw `--sy-viz-*` as text" (the AA-verified darkened text family was removed with the `category-*` chips) | The spec's letter: raw `--sy-viz-N` as the initials color at 600 — the AA conflict is recorded, not resolved | Mint darkened `viz-*-text` tokens AA-verified on the tint, or re-spec initials to a neutral |
| A5 | Initials type steps per avatar size unstated | 11/12/13/16/20 across 20/24/32/40/56 (≈ half the box, all on the closed type scale), line-height collapsed to 1 (sealed single-line container — the Badge precedent) | State the ladder |
| A6 | Agent `running` dot: "pulse" with no parameters | Opacity-only keyframes (motion law: animate only opacity/transform), 1.6s loop to 0.4 and back; `prefers-reduced-motion` stops it | Specify the pulse (or point at Badge `ai` solid's pulse, which is equally unspecified) |
| A7 | "+N" click → "popover listing all" — Popover is not in the library | The overflow circle renders as a `<button>` wired to `onOverflowClick`; without a handler, a static `<span>`. The listing itself is deferred to the Popover build-out | Note the dependency; wire the listing when Popover lands |
| A8 | Squared agent radius is `sm` (8) at EVERY size — at size 20 that is 0.40 radius/height, well above the 0.25–0.30 control band foundations §5 defends | The spec's letter: one step, all sizes | Confirm flat 8, or give the 20px agent a smaller step (`inset` 4?) |

## SegmentedControl

| # | Ambiguity | Implemented reading (provisional) | What needs ruling |
|---|---|---|---|
| S1 | **Self-contradiction:** the Anatomy prose says segments are height 24 and "the assembled control lands exactly on the control height (**32**)" (24 + 4 + 4), while the Key rules bullet ends "assembled control = **36**" | 32, per the detailed prose (the arithmetic the entry itself states; 36 would require 28px segments no sentence mentions — the bullet's SY021 correction note covers the radii, so the 36 looks like a stale or over-corrected tail) | Fix one of the two numbers; if 36 is intended, restate the segment height and the concentric arithmetic |
| S2 | Arrow-key behavior at the ends unstated | Wraps (ARIA radiogroup convention); arrows move SELECTION (the spec's words — selection follows focus) | Confirm wrap |
| S3 | Disabled rendering unstated (the States slot only scopes it to whole-control) | Labels drop to `text.disabled`; the selected segment keeps its `bg.page` fill with `border.subtle` so the parked choice stays readable; container fill unchanged; never opacity | Specify the disabled treatment |
| S4 | Icon-only segment geometry unstated | 32px wide × 24 high (square-plus), 16px glyph | State the width |
| S5 | The selected segment's 1px `border.default` vs the fixed 24px segment height — nothing says how the border is carried without a layout shift | A constant 1px transparent border on every segment (the box never changes); the foundations §6 inset-ring substitute was the alternative | Pick the mechanism (transparent border vs inset ring) so all implementations shift-proof it the same way |
| S6 | Uncontrolled default unstated | `defaultValue` falls back to the first option (an exclusive control is never empty) | Confirm |

## Tabs

| # | Ambiguity | Implemented reading (provisional) | What needs ruling |
|---|---|---|---|
| T1 | Activation model unstated: "arrow keys move between tabs" — contrast SegmentedControl's "arrow keys move **selection**"; and Delete/Backspace acts on "a **focused** tab", which only differs from the active tab under manual activation | MANUAL activation: arrows move focus only (wrapping at the ends — also unstated), Enter/Space activates. Fits workspace tabs, where arrow-activation would load documents on every keypress | State the model (and the wrap) in the A11y slot |
| T2 | **Cross-spec contradiction:** `closing` = "`fast` width collapse", but foundations §7 says "NEVER animate layout properties (width/height/top/left) except accordion height" | The component letter: width collapse at `fast` with `exit` easing; skipped entirely under reduced motion | Either add Tabs `closing` to the sanctioned exception list (as accordion height is) or re-spec the exit as a plain fade |
| T3 | The disabled + wants a Tooltip ("Close a tab to open another" / "탭을 닫고 새로 여세요") — Tooltip is not in the library; native disabled buttons also don't reliably surface hover UI | The hint renders as the button's `title` (placeholder), prop `addDisabledHint` carries the localized string | Wire the real Tooltip when it lands; rule how a DISABLED trigger shows one at all |
| T4 | Whether Tabs owns its panels is unstated (keywords say "tab panel"; the entry specs only the strip) | Strip-only component; each item takes `panelId` → `aria-controls`, tab ids are `sy-tab-{id}` for the page's `aria-labelledby` | State the scope |
| T5 | Tab padding-x and hover treatment unstated | Padding-x 12 (`space-3`; ✕-carrying tabs trim the trailing side per the foundations §3 affix rule); hover `text.primary` (the SegmentedControl hover channel — the finish rule demands a transition either way) | State both |
| T6 | "Never close the last remaining tab" — the preventing mechanism is unstated (hide the ✕? disable it?) | The ✕ is NOT RENDERED at one tab (and `Delete` no-ops) — nothing invites an impossible action | Pick hide vs disable |
| T7 | Dirty × touch intersection: the dot replaces the ✕ "until hover", but on touch there is no hover and the ✕ is "always present" | Touch wins — on `(hover: none)` the ✕ shows and the dirty dot is dropped (closability beats the unsaved marker; the panel itself must carry the dirty state there) | State the intersection |
| T8 | Rename commits on Enter, reverts on Esc — blur is unstated | Blur commits (abandoning an edit silently would discard user input) | Confirm |

**Also noted (not ambiguities):** Chip, SegmentedControl and Tabs give jurisdiction caps a dev-time `console.warn` + exported constants (`MAX_SEGMENTS` 5, `MAX_TABS` 7, `MAX_GROUP_VISIBLE` 4) in the VariantPager/FollowUpPanel house pattern; placement rules (suggestion chips' surfaces, one status vocabulary per view, editable-tabs-for-user-sets-only) remain review-enforced, as with Button `xs`.
