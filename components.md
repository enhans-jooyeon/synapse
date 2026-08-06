# Synapse components

**This is a closed set.** The 68 component entries below (a `##` heading each; some entries group sibling controls, e.g. Checkbox · Radio · Switch) are the only building blocks permitted in generated UI. Common multi-component assemblies are specified in `recipes.md` — check there before composing from scratch. If a need cannot be met by these components or their documented composition (`patterns.md`), the correct action is to escalate per `design.md` §6 — never to invent a variant, add a prop, or restyle an existing component.

Every spec follows the same schema. `variants` and `sizes` are exhaustive enumerations. `forbidden` lists the modifications agents most commonly attempt and must not. Components use the single system size scale; Table runs compact by default (foundations §4).
`Keywords:` slots are discovery aliases — cross-system names (shadcn / Radix / MUI / Ant) and synonyms an agent might search — not contract vocabulary: a keyword never adds a variant, prop, or jurisdiction.

Conventions: heights refer to `--sy-control-height-*` (`tokens/synapse.css`). "Focus ring" = a 2px ring in `--sy-border-focus`, **offset 2px from the element** — a `bg.page` gap ring drawn inside the colored ring (box-shadow, so it follows the corner radius) — so the ring reads detached. Except Buttons, whose focus ring is a lightened ~50% `color-mix` tint of the button’s own color (same 2px gap + 2px ring).

---

## Button

**Purpose:** trigger an action. Not for navigation (use Link) — a button never changes the URL.
**Keywords:** action, cta, submit, icon button, loading button, press

**Variants (closed) — TWO AXES as of 2026-07-30.** Reversal of the flat single-axis list, adopting the old `@enhans/synapse` API shape so the migration is a 1:1 prop mapping. The axes are orthogonal by design: `buttonStyle` says *how loud*, `target` says *what kind*. Conflating them into one flat list (the `btn-danger` pattern) is the weaker design; separating them is what Chakra (`variant` × `colorScheme`) and Ant (`type` × `danger`) do.

**Axis 1 — `buttonStyle`** (emphasis):

| Style | Rendering (target=`default`) | Use |
|---|---|---|
| `primary` | `action.primary-bg` fill, `action.primary-fg` text | The single main action of a region. Max one visible per region — counted per region regardless of `target`. |
| `secondary` | tonal: `action.secondary-bg` fill, no border, `text.primary` text; hover `secondary-bg-hover` | Standard actions. Default choice. **Renamed from the old `tertiary`** — the tonal tier keeps the `secondary` name so `action.secondary-bg` needs no token rename. |
| `outline` | `bg.page` fill + 1px `border.default`, `text.primary` text; hover steps the border to `border.strong` | Actions on tinted or sunken surfaces, where a tonal fill loses definition. **Renamed from the old `secondary`.** Restored after being dropped in v1.0 — the old library's most-used style (43 call sites). |
| `ghost` | transparent, no border, `text.secondary` text; hover `bg.hover` | Low-emphasis, toolbars, repeated row actions. |

**Axis 2 — `target`** (intent):

| Target | primary | secondary (tonal) | outline | ghost |
|---|---|---|---|---|
| `default` | `action.primary-bg` + white | `action.secondary-bg` + `text.primary` | `border.default` + `text.primary` | `text.secondary` |
| `destructive` | `status.danger-bg-solid` + white, **normal weight** (4.62:1 — left the §9 deviation 2026-07-30) | `action.secondary-danger-bg` + `status.danger` | `border.error` + `status.danger`; hover → `border.error-hover` | `status.danger` |
| `brand` | `action.brand-bg` + white | `action.secondary-brand-bg` + `action.secondary-brand-fg` | `action.brand-border` + `action.brand-fg-on-page`; hover → `action.brand-border-hover` | `action.brand-fg-on-page` |

API defaults (ratified 2026-08-05): `buttonStyle` defaults to `secondary`, `target` to `default`, `size` to `md` — the axis-1 table's "Default choice" is also the API default.

**All 12 combinations clear AA outright as of 2026-07-30** (min 4.62:1, which is `primary × destructive`). The last §9 solid-label exception in the Button matrix is gone: `status.danger-bg-solid` moved `red.400 → red.500`, so the destructive primary carries a normal-weight white label like every other cell. No Button variant now depends on weight compensation.

**Brand is bright AZURE, and its tokens are azure — not indigo.** `action.brand-bg` = `azure.500 #0073E6` in both modes (second re-hue 2026-07-30, superseding a brief indigo step). All three fill states clear AA with a white label (4.57 / 5.30 / 8.22), so normal weight holds and the §9 solid-label deviation does NOT apply — it was tuned 7% deeper than the old `#0A84FF` precisely to achieve that. **Hover DARKENS in both modes:** every azure step lighter than 500 fails white-label contrast (400 = 2.91:1), so a bright brand cannot lighten on hover the way `primary` does in light mode. **The hover step was softened to `azure.550 #066ACE` on 2026-07-31** (was `azure.600`): at ΔE 18.5 the 600 step was 2.15× the ΔE 8.6 house hover step — the largest hover jump in the system — and read as a drastic darkening on a large saturated fill. `azure.550` lands at ΔE 8.9, on the house step, with the white label at 5.30:1. The lower-emphasis brand cells previously borrowed `border.focus` and `text.link` — *functional indigo on a brand control*, which was a bug; they now use `action.brand-border`, `action.brand-fg-on-page` and `action.secondary-brand-fg`. **Never mix the two blues:** azure is brand/AI-emphasis, indigo is link/focus/info.

**Why the tonal coloured fills are one ramp step lighter.** `action.secondary-danger-bg` is `red.50`, not `red.100` — because `red.100` **is** `status.danger-bg`, so a tonal destructive button drawn on it would be byte-identical to a subtle danger Banner/Badge. Shifting to `red.50` keeps the two distinguishable at rest; the hover step lands on the status tint, which is acceptable because hover is transient. `red.200` / `blue.200` were rejected as hover fills: they drop the label to 3.84:1 / 4.25:1, below AA.

**`ghost` hover is NEUTRAL in all three targets (closed 2026-07-30).** All four ghost cells take the `bg.hover` alpha overlay; the hue stays in the label and never enters the backdrop. Two reasons. First, `bg.hover` is the universal hover overlay across the system — table rows, menu items, nav items, chips — and `ghost` is the button that most resembles those, so matching them is what makes a toolbar of ghost actions feel like one surface rather than three coloured zones. Second, a *tinted* ghost hover would be **byte-identical to `secondary × target` at rest** (`#FDF1F0` and `#F1F7FE` in both cases), so the lowest-emphasis and the standard tier would become indistinguishable mid-interaction — the same convergence objection that decided the `outline` hover above, but worse, because `outline` at least keeps a border to tell them apart while `ghost` has nothing. Label contrast on the composited hover surface (`#F5F5F5`) is 5.54 / 5.68 / 5.67:1, so nothing is lost by keeping the backdrop neutral.

**Ring strength tracks the button's own value.** A strong dark ring sits naturally on `primary` because the button is already near-black; the same ring around a `#F4F4F6` tonal fill or a transparent ghost is darker than anything else in the control and reads as foreign — the ring stops looking like part of the button. Hue still comes from `target`, so intent is preserved; only the weight changes. **The `default` ring is also NEUTRAL, not indigo (changed 2026-07-30).** `default` — which is the overwhelming majority of buttons — rings in `border.focus-input` `#33333A`. Higher measured contrast than the indigo it replaces (12.53:1 vs 5.21:1) yet it reads *quieter*, because at a 2px band chroma pulls the eye harder than luminance does; a saturated indigo band had nothing to balance it against on `outline` and `ghost`, where there is no fill weight. It also settles §1.1's own claim that the primary action colour is black, not blue. `destructive` and `brand` keep their hued rings — those are the two intents where the ring is worth spending attention on, and they are rare by construction. **This is the one place Button diverges from the general rule** that non-entry controls focus in `border.focus`; the neutral token is the same one entry surfaces already use, so the system carries two focus colours, not three.

**`outline` hover steps the border — in all three targets (closed 2026-07-30).** Previously only `outline × default` had a hover step (`border.default → border.strong`); the two coloured targets named a rest border and nothing else, so a coloured outline button gave **no feedback at all** that it was live. That was a defect, not a deliberate omission. Both now step darker in light mode and *lighter* in dark: `border.error → border.error-hover` (red.500 → red.600, ΔE 10.1) and `action.brand-border → action.brand-border-hover` (azure.500 → azure.600, ΔE 18.5). Both exceed the ΔE 8.6 that the default step already ships with, so the affordance is stronger than the case that was already accepted.
**Why the border and not the fill.** A tonal fill on hover was the alternative and was rejected on axis grounds: `buttonStyle` owns *behaviour*, `target` owns *hue*. If `default` stepped its border while `destructive` tinted its fill, `target` would start changing the interaction model, which breaks the orthogonality the two-axis API exists to provide. Secondary reason: an outline button that fills on hover momentarily becomes the tonal `secondary` button, so two variants converge mid-interaction. The fill stays `bg.page` in all three.

**Jurisdiction constraints on `target` (these do NOT relax because target is now an axis):**
- `destructive` **solid** (i.e. `primary × destructive`) remains destructive-confirmation-only — inside confirm dialogs or after explicit intent. The lower-emphasis destructive styles (`secondary`/`outline`/`ghost`) are the ones for row-level and inline deletes.
- `brand` remains **max 1 per screen** across ALL styles combined. Because four styles can now carry it, scarcity is no longer enforced by absence and MUST be enforced by review/lint. Jurisdiction unchanged: conversational-AI CTAs (Ask agent / Composer send). Operational agent actions (Run/Retry/Resume) stay `target="default"`.
- **`secondary` on a `bg.sunken` surface MUST open to `bg.page`** (the ProposalCard "tray rule"): the tonal fill `#F4F4F6` is the sunken surface colour, so on sunken it vanishes and `secondary` becomes indistinguishable from `ghost`. Prefer `outline` there.

**Sizes:** `xs` (height-xs 24, label 11, **padding-x 8**, **icon 12**) · `sm` (height-sm 32, label 13, **padding-x 10**, icon 16) · `md` (height-md 36, label 13 default, **padding-x 12**, icon 16) · `lg` (height-lg 40, heroes only, **label 14**, **padding-x 16**, icon 16). **The label deliberately does NOT step at every size.** `sm` and `md` share the 13px label because that is the dense range — toolbars, table rows, form footers — where a changing type size makes rows harder to scan than a changing height does; they are separated by height, padding and radius instead. Type steps only at the small end: `xs` drops to 11 to fit a 24px control; `sm`/`md` share 13, and `lg` sits at 14 — the `body` size. **Icons likewise step once, at `xs` (12), holding at 16 through `lg`.** A larger `lg` (label 16 / icon 20) was built and reverted on 2026-07-31: 14px is the industry norm for a button label — Carbon's productive set, Ant, Material 3 `Label Large` and shadcn/ui all use it — so 16 read oversized rather than heroic, and a 20px icon beside it inverted the conventional icon ≈ label pairing (an icon fills its box with strokes, so it carries more weight than text at the same nominal size). Note 20/40 *did* match the 0.50 icon ratio at `sm`/`xs`, which is a useful reminder that the ratio catches outliers but does not predict perceived weight. **`lg` gets its presence from height, padding and radius, not type.** **Radius by size** (not one fixed value): `xs` → `radius.control-xs` (6) · `sm` → `radius.sm` (8) · `md` → `radius.control-md` (10, default) · `lg` → `radius.md` (12). The progression is deliberately near-proportional — radius÷height runs 0.250 / 0.250 / 0.278 / 0.300 — so no size reads squarer or rounder than its neighbours. `xs` was `radius.xs` (4) until 2026-07-31, which put it at 0.167, a third below the band, and it read visibly squarer than the rest; the pill option (`primary` + `lg` + Guided heroes/empty-state first-use, `default` or `brand` target only) overrides to `full`.

**Padding steps per size (added 2026-07-30).** `control-padding-x-{xs,sm,md,lg}` = 8 / 10 / 12 / 16, all on the space scale. Padding had been the **only** Button dimension that did not step — height, radius and label size all did — which left `xs` at a padding-to-height ratio of 0.50 (reading as a wide, squat pill of mostly whitespace) and `lg` at 0.30 (cramped against its larger label). The ladder brings all four to 0.31–0.40. `md` keeps 12, so the default size is visually unchanged. The bare `control-padding-x` token survives as a deprecated alias for the `md` value so existing references do not break.
**This moves more than Buttons.** foundations §5 generalised the −2px icon trim to Select / Combobox / DatePicker triggers, Menu items, nav items, Chips, Tabs, Banner and Toast — everything that reads `control-padding-x` inherits the ladder at its own size step, and the trim is computed from the per-size value (at `xs`, 8 − 2 = 6 on the icon side). Any component that only ever renders at one size sees no change.

**`xs` is INLINE-ONLY (accessibility-scoped).** At 24px it sits exactly at the WCAG 2.5.8 target-size minimum with no tolerance, and is permitted **only** under that criterion's *Inline* exception — "the target is in a sentence or its size is otherwise constrained by the line-height of non-target text." Sanctioned: buttons inline within a sentence or a table cell's text flow. **Forbidden:** toolbars, dialog footers, form rows, or anywhere a 32px control would fit — using `xs` for general density loses the exemption and becomes a 2.5.8 failure. When in doubt use `sm`.
**States:** default, hover (`primary`: bg-hover; `secondary`: `secondary-bg-hover`; `ghost`: `bg.hover`), **No `active`/pressed state — dropped 2026-07-30.** Buttons have no third fill. Pressed feedback comes from the click itself; the cursor is already on the control and the hover state already confirms it is live, so a further fill change buys a frame of feedback at the cost of a state every implementer must build and every reviewer must check. Three tokens were deleted with it (`action.primary-bg-active`, `action.brand-bg-active`, `status.danger-bg-solid-active`). **`bg.active` survives** — it is not a Button token: table rows and menu items use it for their own pressed states, where the pointer travels across a large target and the confirmation does earn its keep), focus-visible (2px `bg.page` gap ring + 4px ring. **Hue comes from `target`; STRENGTH comes from `buttonStyle` — amended 2026-07-30.** `primary` is near-black and takes the strong ring; `secondary`, `outline` and `ghost` are light-valued and take the soft one:

| target | `primary` (strong) | `secondary` / `outline` / `ghost` (soft) |
|---|---|---|
| `default` | `border.focus-input` `#33333A` | `border.focus-soft` `#83838D` |
| `destructive` | `border.error-hover` `#B23230` | `border.error-soft` `#D2403E` |
| `brand` | `action.brand-border-hover` `#0D61B5` | `action.brand-border-soft` `#0073E6` |

The three soft rings are **mode-invariant** — each is the `500` step of its family, mid-tone enough to clear 1.4.11 against both pages (3.75/5.30, 4.62/4.30, 4.57/4.35), so one value inverts correctly by context instead of needing a per-mode pair. `azure.400` was rejected for the soft brand ring at 3.10:1 light: too little margin above the 3:1 floor — all four styles in a target share one ring because the ring signals intent; full strength, never lightened — foundations §6), disabled (`bg.disabled` fill in every **filled** variant — the grey fill is the unambiguous disabled signal there; 40% opacity remains forbidden in all cases. **AMENDED 2026-08-03 — `ghost` is carved out and takes NO fill.** The 2026-07-30 ruling applied the fill to every variant, accepting that a disabled `ghost` would gain a grey box it never had. Measurement shows the fill defeats its own purpose there: `ghost`'s hover is `bg.hover` `rgba(9,9,11,0.04)`, which over `bg.page` white computes to **#F5F5F5**, against `bg.disabled` **#F4F4F6** — **one step per channel out of 255**, i.e. a disabled ghost and a hovered ghost are the same colour in light mode (dark is better but still close, delta 6–10). `ghost` is the only variant with this collision: `outline`'s hover changes `border-color` only and keeps `bg.page`, and the filled variants each have a distinct hover fill. So on `ghost`, disabled is carried by the muted label/glyph (`text.disabled`) with **no fill** — which is what the original ruling wanted, an unambiguous signal, achieved the other way. **Noted deviation:** `text.disabled` on `bg.page` measures **2.33:1** light, below the 3:1 self-imposed floor for disabled labels. Accepted because WCAG 1.4.3 exempts disabled controls and a receding disabled affordance is the intent — but it means a disabled ghost must never be the *only* channel carrying the state. Where it matters, pair it with a second signal (VariantPager's arrows sit beside the `n/N` counter, which already says you are at an end). **The label is `text.disabled` in ALL twelve cells — reversed 2026-07-30.** The earlier per-`target` disabled labels were withdrawn: `action.brand-fg-disabled` was `azure.500`, **the exact same hex as the live brand fill**, and `action.danger-fg-disabled` was `red.400`, one step off the live danger fill. Both therefore ran at *higher* contrast on the disabled fill (4.16:1 and 3.63:1) than the neutral label does (2.12:1), which made a disabled destructive or brand button read as available — the opposite of what the state means. The reasoning that produced them — "the fill stays neutral so the hue is carried by the label" — was wrong on inspection: a disabled control does not need to communicate its *intent*, because intent only matters to someone who can invoke it, and the label text already says which action it is. Both tokens are deleted. A hue-tinted disabled *fill* remains forbidden for the original reason — it would render identically to the subtle status Banner/Badge. **Disabled `outline` keeps its border but drops the target hue — neutral `border.default` in ALL targets (ratified 2026-08-05):** a live-hued border on a dead control reads as available, the same logic as the all-cells-neutral disabled label), loading (spinner at the size's own icon size — **12 at `xs`, 16 at `sm`–`lg`** (ratified 2026-08-05; the earlier flat "16px" predates the `xs` size) — the registry `loader-circle` glyph, rotated by CSS — replaces the **leading icon, or on an icon-only button the glyph itself**; the label, where one exists, stays; width MUST NOT change wherever a leading icon exists to replace. On icon-only buttons width is preserved trivially because the button is a fixed square. **On a text-only button there is no icon to replace: the spinner prepends before the label, and the resulting width change is an accepted, documented exception (ratified 2026-08-05)** — reserving spinner space on every button and overlaying the label were both rejected as costlier than the honest shift. **The affordance disappears while busy, so `aria-label` MUST persist unchanged** — it is the only remaining identification of what the button does; add `aria-busy="true"` alongside it rather than relabelling to "Loading". Under `prefers-reduced-motion` the rotation stops and the glyph is never swapped for a different icon).
**Pill option (scoped 2026-07-30):** `primary` buttons in Guided-archetype heroes and empty-state first-use moments MAY use `radius.full`. The override is **radius-only** — padding stays the size's own `control-padding-x` step (ratified 2026-08-05; the old library's pill also widened padding, which did not carry over). **Scope is now closed on both axes:**

| | pill allowed |
|---|---|
| **Size** | `lg` **only** — pill and `lg` are both hero-scoped (`lg` is already "heroes only"), so they travel together. `xs`/`sm`/`md` have no sanctioned pill context: the `compact` EmptyState permits no button at all, and permitting pill at `md` would make the hero silhouette reachable from ordinary UI, which is exactly what the NEVER clause below exists to prevent. |
| **Target** | `default` and `brand`. **`destructive` is forbidden** — solid destructive is confirmation-only and lives inside dialogs, which are never Guided heroes, so a hero-scale delete is incoherent by construction. |

**Why `brand` is allowed.** A first-run "Ask the agent" hero is the most plausible pill context in the product — the Guided archetype's job is onboarding, and the AI CTA is what onboarding points at. Forbidding it would mean the one moment most in need of the hero silhouette cannot use it, and would push that moment to a squared brand button, costing the Guided archetype its distinctive button shape precisely where it matters. The combination is **self-limiting**: it already stacks two independent scarcity rules — max 1 `brand` per screen, and pill only in heroes — so it cannot proliferate.
**Forbidden:** NEVER in forms, toolbars, tables, or dense regions — the pill silhouette is a hero mark, not a general style; never at `xs`/`sm`/`md`; never on `target=destructive`; never on `secondary`/`outline`/`ghost` (the override is `primary`-only, unchanged).
**Anatomy:** optional leading icon (16px) + label + optional trailing affordance icon (16px — closed set, see Label & icon rules). The icon–label gap is `space-1_5` (6px) at every size (ratified 2026-08-05). **Optical padding trim:** on icon+text buttons, the icon side's padding is the size's `--sy-control-padding-x-*` minus 2px (a 16px stroke icon carries internal whitespace, so equal padding reads heavier on the icon side); applies per side — leading icon trims left, trailing chevron/external mark trims right; icon-only buttons are exempt (they're squares). Icon-only buttons allowed only for: close, more (⋯), edit, delete, copy, refresh, expand/collapse, settings — and MUST have `aria-label`. **Icon-only buttons are always square**: width equals the size's control height (sm 32→32, md 36→36) — a non-square icon button is a bug, not a variant. **Circular icon-buttons are a closed set of three (declared 2026-08-03):** the Composer row's **leading `+`** and **trailing send** — the bookend pair bracketing the input — plus the **AssistantPanel launcher**. Nothing else is circular. *The §26 recording-bar confirm is not a fourth: it occupies the **send position** in the tray's recording state, so it is the send bookend morphed, the same way send↔stop is one control in two states. The set counts positions, not glyphs (clarified 2026-08-03).* *The square rule above governs **footprint** (width = height), which a circle satisfies, so these three are exceptions to the **radius**, not to the aspect ratio.* Declaring the set resolved two contradictory claims: ResponseToolbar said send was "the ONLY circular control" while AssistantPanel called its launcher "the sanctioned circular exception it shares with the Composer send" — one said only, the other said shared.

**Label & icon rules (closed policy):**

- **Text-only is the default.** A button earns an icon; it doesn't get one for decoration.
- **Icon + text is permitted only when:** (a) it is the conversational-AI entry button (`primary`; the agent glyph is its marker), or (b) the button sits in a toolbar/filter-bar context and its icon is from the approved icon-action list, where the icon aids scanning across repeated controls. Everywhere else — dialog footers, forms, page headers — text only.
- **Trailing icon (optional slot — one 16px icon *after* the label):** a closed affordance set that signals what the button *does to the flow*, never decoration — `chevron-down` (opens a menu; split / disclosure buttons), `arrow-up-right` (opens externally / in a new context), or `chevron-right` (advances a step — wizard "Continue" / "Next"). A leading icon *names* the action; a trailing icon *signals its behavior*. One trailing icon max; never both a leading and a trailing chevron on one button; the −2px trailing-side padding trim (Anatomy) applies. **A leading icon AND a trailing icon together is permitted (confirmed 2026-07-30 — previously legal only by omission).** It is self-limiting: leading icons are permitted only in AI-entry or toolbar/filter contexts per clause (b) above, so the combination is reachable only in a toolbar — where icon + label + `chevron-down` is a filter dropdown, and the leading glyph is exactly the scanning aid clause (b) exists to provide. Both padding trims apply, so at `md` the button runs 10px / 10px.
- **Label text:** the `label` typography style at its normal weight in ALL cells (the danger weight compensation was retired 2026-07-30 — danger solid clears AA at normal weight; a stale "(semibold on `danger`)" survived here until 2026-08-05, contradicting the two retirement statements in this same entry); sentence case; verb-first EN ("Save changes") / noun or -하기 form KO ("변경사항 저장") per `content.md` §3.2; no terminal punctuation; "…" only for in-progress verbs ("Saving…" / "저장 중…") or when the action opens a follow-up step before executing ("Export…" opens the format dialog).

**`render` — polymorphic element (added 2026-07-30 — required for migration, not a variant).** A Button MAY render as a different element while keeping its own styling and behaviour, via a single-child slot (`render` / `asChild`): the child element receives the Button's classes, refs and event handlers instead of a `<button>` being emitted around it. This exists for one reason — framework routing. `<Button render><NextLink href="/x">Go</NextLink></Button>` must produce ONE `<a>`, because a `<button>` wrapping an `<a>` (or the reverse) is invalid HTML and screen readers announce it unpredictably. Without this the framework's own Link cannot carry Button styling at all.
**This is not a licence to style links as buttons.** The rule in `Link` still stands. `render` is for elements that are *semantically* the action the Button describes but must be emitted by the framework — a route push that is genuinely a navigation-shaped action (a "Create new" that navigates to a form). A link that reads as prose stays a Link.
**Forbidden:** more than one child; a child that is itself interactive in a second way (no `<a>` wrapping a `<button>`, no nested handlers); `render` used to avoid the Link rule; `render` on `target=brand` (the AI CTA is always a real button — it triggers an agent, it does not navigate).
**A11y:** the child element must accept the forwarded ref and props. When the child is an `<a>` without `href`, add `role="button"` and keyboard activation — an anchor without href is not focusable or Space-activatable by default. Disabled state cannot be expressed on an `<a>`: render a real `<button disabled>` instead of a styled-disabled link.

**Forbidden — with their replacements:** fixed widths (KO/EN); custom colors (**→ pick a `target`**: destructive intent → `target=destructive`, AI emphasis → `target=brand`; there is no hex escape hatch); more than one `primary` per region (**→ demote the others to `secondary`**); icon-only outside the approved list of close, more, edit, delete, copy, refresh, expand/collapse, settings (**→ add a visible label**, i.e. `buttonStyle=ghost` with icon + text; an unapproved bare glyph is unlearnable and fails 2.4.6 in practice even with `aria-label`); ALL-CAPS labels (**→ sentence case**); off-scale radius (**→ the size's own radius**, radius is size-relative per Sizes); **`link`-style buttons (→ use `Link`** — see the Link component; a borderless text action that navigates is a Link, and one that acts is `buttonStyle=ghost`).
**A11y:** `<button>` element; Enter/Space activate; loading sets `aria-busy`.
**Bilingual:** label sizing from content + `--sy-control-padding-x`; verbs first in EN ("Save changes"), natural KO word order (variables allowed: "변경사항 저장"); never truncate.

**Key rules (machine index):**
- API defaults (ratified 2026-08-05): buttonStyle=secondary · target=default · size=md
- max 1 primary per region
- target=brand = bright AZURE (azure ramp; never the indigo blue ramp, which is functional info/link/focus — the two blues must never be mixed), max 1/screen across ALL FOUR styles — scarcity is no longer enforced by absence and MUST be enforced by review/lint; operational agent actions (Run/Retry/Resume) stay target=default; primary x destructive (solid red) stays destructive-confirmation-only, lower-emphasis destructive styles serve row/inline deletes; secondary on bg.sunken MUST open to bg.page (tray rule) or it becomes indistinguishable from ghost; tonal coloured fills are one ramp step lighter than status.*-bg so they do not duplicate the subtle Banner/Badge tint
- text-only labels by default; icon+text only for brand AI actions and toolbar/filter contexts (approved icons)
- pill radius: primary + lg ONLY, in Guided heroes / empty-state first-use, target=default or brand (never destructive, never xs/sm/md, never secondary/outline/ghost); the override is radius-only (padding unchanged)
- icon-only buttons are always square in FOOTPRINT (width = size height) — a circle satisfies this, so the circular controls below are RADIUS exceptions, not aspect-ratio ones
- CIRCULAR ICON-BUTTONS ARE A CLOSED SET OF THREE (2026-08-03): the Composer row leading + and trailing send (the bookend pair bracketing the input) plus the AssistantPanel launcher. Nothing else is circular. The §26 recording-bar confirm is NOT a fourth — it occupies the SEND POSITION in the recording state, so it is the send bookend morphed (like send<->stop, one control in two states). The set counts POSITIONS, not glyphs. Declaring the set resolved two contradictory claims — ResponseToolbar said send was the ONLY circular control while AssistantPanel called its launcher an exception SHARED with send
- optical trim: icon+text buttons drop 2px padding on the icon side, computed from the SIZE-SPECIFIC control-padding-x-{xs,sm,md,lg} = 8/10/12/16; icon–label gap is space-1_5 (6px) at every size
- leading + trailing icon together is permitted (confirmed 2026-07-30) but only reachable in toolbar/filter context; never two chevrons
- pill: primary + lg only, Guided heroes / empty-state first-use, target default or brand, never destructive
- NO active/pressed state (dropped 2026-07-30) — pressed feedback comes from the click; bg.active is NOT a Button token, it belongs to table rows and menu items
- focus ring: HUE from target, STRENGTH from buttonStyle — primary takes the strong ring (border.focus-input / border.error-hover / action.brand-border-hover), secondary/outline/ghost take the soft one (border.focus-soft / border.error-soft / action.brand-border-soft); soft rings are mode-invariant 500 steps
- loading: spinner at the size's icon size (12 at xs, 16 at sm–lg; registry loader-circle) replaces the leading icon, or on an icon-only button the glyph itself; aria-label MUST persist + aria-busy=true since the affordance is gone while busy; width never changes where a leading icon exists to replace — a TEXT-ONLY button prepends the spinner and the width change is the documented exception (ratified 2026-08-05); disabled is a fill on FILLED variants, never opacity; disabled outline border is neutral border.default in ALL targets; ghost is CARVED OUT 2026-08-03 and takes no fill — bg.disabled #F4F4F6 was within one step per channel of ghost's own hover (#F5F5F5 over white), so the fill read as hover; ghost mutes the label/glyph to text.disabled instead (2.33:1 light, a noted deviation from the 3:1 disabled floor — never let it be the only channel); the disabled LABEL is text.disabled in ALL 12 cells (per-target disabled labels withdrawn 2026-07-30 — the brand one was azure.500, the same hex as the live brand fill, so disabled read as available)
- danger solid clears AA at 4.62:1 with NORMAL label weight (status.danger-bg-solid moved red.400->red.500 on 2026-07-30; danger LEFT the §9 solid-label deviation — do not emit semibold for it)
- render/asChild: polymorphic slot for framework routing ONLY — one child, no nested interactivity, never on target=brand; not a licence to style links as buttons

---

## Link

**Purpose:** navigation. `text.link` color, no underline at rest, underline on hover/focus. Inline links inside body text are always underlined. External links append a 16px external icon.
**Keywords:** anchor, hyperlink, href, navigation link, text link

**Deciding between Link and Button (the migration's most common question).** Ask what the element *does*, not what it looks like:

| It… | Use | Element |
|---|---|---|
| changes the URL | `Link` | `<a href>` |
| performs an action in place | `Button` | `<button>` |
| navigates, but must carry Button styling (framework routing) | `Button` with `render` | one `<a>`, see Button §`render` |
| looks borderless but acts | `Button` `buttonStyle=ghost` | `<button>` |

shadcn's `variant="link"` Button conflates the first and fourth rows, which is why it has no v1 equivalent. **Every `variant="link"` call site resolves to one of these four** — most to `Link`, the rest to `ghost`. A link is never `primary`, and a Button never sits inside a sentence.
**States:** rest (no underline; inline links inside body text are always underlined) · hover/focus (underline).
**Forbidden — with their replacements:** styling a link as a button or vice versa (**→ the table above**; if you need Button styling on a route change, that is `Button` + `render`, which emits a single `<a>`); "click here" labels (**→ label the destination**: "View the run log", KO: "여기를 클릭" 금지); a Link that acts without navigating (**→ `buttonStyle=ghost`**); `target="_blank"` without the external icon (**→ append it**, it is part of the affordance).

**A11y:** a real `<a href>` (the decision table's element column); an element that acts without navigating is a Button, not a Link; external links carry the 16px external icon as part of the affordance.
**Key rules (machine index):**
- never styled as a button
- external links take the arrow-up-right mark
- no 'click here' labels

---

## Input (text)

**Purpose:** single-line text entry. Covers text, email, password, number, search (search adds leading 16px icon + clear button when filled).
**Keywords:** text field, textbox, form field, search input, password, input group, addon

**Anatomy (outlined):** label (required, `--sy-label-size` medium, above) · field (height-md, `bg.page` fill, 1px `border.default` perimeter, radius `10`; the `sm`/`lg` field sizes step to `sm`/`md` per foundations §5) · optional helper text (caption, `text.secondary`) · error text (caption, `status.danger`, replaces helper). *(Maintainer reversal of the earlier borderless-filled anatomy: the `bg.sunken` field fill was tonally identical to the `bg.disabled` fill, so at-rest fields read as disabled. Fields are now white and outlined; a grey fill (`bg.disabled`) is reserved as the single unambiguous disabled signal.)*
**States:** default (white `bg.page`, 1px `border.default`), hover (border steps to `border.strong` — fill stays white), focus (border swaps to `border.focus-input` — neutral 1px perimeter, no offset ring: entry surfaces focus in the neutral key tone because click-to-type shows focus constantly and a blue offset ring overexposed the accent; non-entry controls keep the blue `border.focus` flush ring), disabled (`bg.disabled` grey fill — the one filled state — `text.disabled`), error (1px `border.error` + error text; error text MUST name the fix, not just "invalid"; error border holds while focused), read-only (`bg.surface` faint fill, no hover response). Select, Combobox, and DatePicker triggers inherit this outlined anatomy.
**Sizes:** `md` only.
**Affixes:** optional leading registry icon (16px, `text.tertiary` — search's magnifier is one instance of this general slot) and/or trailing affix: a unit/format suffix (`text.tertiary`, e.g. "KRW", "%") or one registry icon (e.g. eye/eye-off reveal on password). One leading + one trailing max; affixes sit inside the fill and never receive focus.

**Add-ons (InputGroup).** For richer fields the Input composes with fused add-ons — segments visually attached to the field, sharing one outer shape (radius on the outer corners only; 1px `border.default` seams between segments, like ButtonGroup). Every segment — text prefix/suffix, dropdown, button, shortcut hint — takes the **same horizontal side padding as the input body it is attached to** (`control-padding-x` at the field's size step; a dropdown's chevron uses that value as its right inset), so text and controls across the group align on one inset rather than the group reading tighter than a plain field. Closed set, one add-on per side, never both a dropdown and a button on the same side:

- **Leading / trailing text** — a static prefix/suffix on the field fill (`text.secondary`), e.g. `https://` before a URL or `$` before an amount. Not editable, not focusable.
- **Leading / trailing dropdown** — a fused `Select` (Input-anatomy trigger + chevron) for a unit or scope: a country code before a phone number, a currency after an amount. It is a real Select and follows Select's rules.
- **Trailing button** — one fused `secondary` `Button` acting on the value (Copy, Apply); icon-only follows the icon-only rules. Never `primary`/`brand` inside a field.
- **Keyboard-shortcut hint** — a trailing `.sy-kbd` badge (e.g. `⌘K`) on search/command fields; teaches the shortcut in place, never interactive.
- **Help tooltip** — an inline `circle-question-mark` icon beside the *label* opening a Tooltip, for a short clarification when persistent helper text below would be too heavy (helper text stays the default).

Add-ons are for genuine input enhancement — a dropdown that changes the value's meaning, an action on the value — never decoration.

**Forbidden:** placeholder as label (placeholder is example content only, `text.tertiary`); floating labels (break with Hangul metrics); fixed field widths under 240px for translatable content; hiding the label visually except in table inline-edit cells.
**A11y:** `<label for>` always; error linked via `aria-describedby`; `aria-invalid` on error.
**Bilingual:** labels above the field (never left-aligned beside — KO/EN label width divergence breaks alignment); helper/error text wraps, never truncates.

**Key rules (machine index):**
- outlined anatomy: white bg.page + 1px border.default; hover border.strong; focus = 1px NEUTRAL border.focus-input border swap (no offset ring on fields; non-entry controls keep the blue 2px offset ring); disabled bg.disabled grey is the one filled state (borderless-filled was reversed — its fill equaled disabled)
- label above, always; placeholder is example content only
- errors name the fix (border.error)
- mixed bulk values show 'Mixed'/'여러 값'
- no fixed widths on translatable content
- affixes: one leading registry icon + one trailing unit-suffix or registry icon, inside the fill, non-focusable
- add-ons (InputGroup): fused leading/trailing text, leading/trailing Select, trailing secondary Button, ⌘K kbd hint, or help-circle tooltip beside the label — one per side, shared outer shape (border.default seams), every segment takes the input body's side padding (control-padding-x; dropdown chevron uses it as right inset) so the group aligns on one inset, never a dropdown+button on one side, never decorative

---

## Textarea

**Purpose:** Multi-line Input. Min-height 3 rows, vertical resize only, otherwise inherits all Input rules. Character counter (caption, `text.tertiary`, bottom-right) when a limit exists — count characters, not bytes (Hangul). **`autogrow` variant:** grows with content from 1 row to a declared max (default 8), then scrolls internally; resize handle removed — Composer's behavior, now available to inline forms (comments, descriptions).
**Keywords:** multiline, text area, autosize, autogrow, comment box, long text

**Action bar (added 2026-07-30 — migration gap).** A Textarea MAY carry a trailing action row fused to the bottom of the field, sharing its outer shape: 1px `border.subtle` seam above the row (edge to edge, per the divider rule), row height 40px, `bg.page` fill, `control-padding-x` side padding matching the field body. Contents, left to right: optional metadata (character counter or hint, `caption`, `text.tertiary`) then right-aligned Buttons — `sm` size, at most two, `secondary` and/or `ghost`. The counter moves into this row when it exists rather than floating below the field. This is the generalized form of the Composer's send row and the replacement for the old library's `Textarea.Actions` compound.
**States:** as Input; `autogrow` grows from 1 row to the declared max (default 8), then scrolls internally.
**Forbidden:** `primary`, `brand` or `danger` Buttons in the action row (a text field is not the place to site a page's main action — put it in the form footer); more than two buttons; an action row on an `autogrow` Textarea inside the Composer (the Composer owns its own send row and must not nest a second one); icon-only buttons in the row outside the approved icon list.
**A11y:** the row is inside the field's labelled group, so it follows the Textarea in tab order — never before it. Buttons that act on the field's content (Clear, Copy) reference it with `aria-controls`.

**Key rules (machine index):**
- autogrow variant: 1 row to a declared max (default 8), then internal scroll, resize handle removed
- action bar (2026-07-30): trailing row fused to the field bottom, border.subtle full-bleed seam, height 40, bg.page, control-padding-x matching the field body; counter moves into it; max 2 buttons, secondary/ghost ONLY — never primary/brand/danger; forbidden inside the Composer, which owns its own send row
- action bar follows the Textarea in tab order, never precedes it

---

## Select

**Purpose:** choose one option from 5–15 known, static options. <5 options: use Radio. >15, async, or user-known values: use Combobox.
Trigger renders as Input anatomy with trailing chevron (16px). Menu is a Popover: `bg.raised`, `border.default`, radius `lg`, `shadow.lg`; options height-md, `bg.hover` on hover, `bg.selected` + leading 16px check on selected.
**States:** as Input, plus open (chevron rotates 180°, `fast` duration).
**Forbidden:** native `<select>` styling mixed with custom menus; multi-select without chip rendering (use input Chips inside the trigger); menus wider than 480px or narrower than trigger.
**A11y:** listbox pattern; full keyboard (arrows, Home/End, type-ahead); Esc closes.
**Bilingual:** menu width fits longest option of the active locale; no fixed trigger widths.
**Keywords:** dropdown, picker, single select, listbox, options

**Key rules (machine index):**
- trigger inherits outlined Input anatomy
- menu is a Popover; selected shows leading check

---

## Checkbox · Radio · Switch

**Purpose:** Form on/off · one-of-2–5 · instant-effect toggle.
**Keywords:** toggle, radio group, checkbox group, boolean, indeterminate, on off, form control

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
| Switch | thumb centered with a minus glyph inside (`icon.secondary`, 6×2px), track `border.strong` fill (`aria-checked="mixed"`) — track NEVER takes the key color: a filled track falsely signals ON for an instant-effect control | toggle → applies ON to all (destructive-off never defaults) |
| Radio | no mixed state exists — a heterogeneous radio group renders with **no** selection + a caption "Mixed values" / "여러 값" | selecting applies to all |

**The mixed-value convention (cross-component).** Whenever one control edits multiple objects whose current values differ, the control shows the mixed marker — never one object's value as if shared. Text-like controls (Input, Select, Combobox, DatePicker) display the placeholder-styled string "Mixed" / "여러 값" in `text.tertiary`; entering any value overwrites all. A cleared mixed field returns to "Mixed", not to empty.
**States:** unchecked · checked (`action.primary-bg` fill — key color, not blue) · mixed (Checkbox: key-color fill + minus bar; Switch: centered thumb + minus glyph on a `border.strong` track — never the key color; Radio: none — no selection + a "Mixed values" / "여러 값" caption).
**Forbidden — with their replacements:** a check-mark indicator on Radio (**→ the dot**; Radio is a circle with a dot and Checkbox is a box with a check, and that difference is what tells a user "one of these" from "any of these" before they click. **Re-litigated and upheld 2026-07-31, with the reasoning corrected:** the earlier claim that `indicatorType=check` "erases" the signal was overstated — a circle containing a check is still a circle, and the silhouette is what reads first at 16px. The ruling stands on three other grounds. (1) It would make **two renderings legal for one state**, which is exactly the drift the closed-variant policy exists to prevent — two engineers build the same form differently and the gate cannot adjudicate. (2) A 16px radio leaves ~8px of interior; a check there is 3–4 strokes against the dot's single solid form, and it sits **below the 12px icon floor** (§7), so it contradicts the icon scale and degrades further at the 24px `xs` control. (3) It carries **no meaning the dot lacks** — both say "selected". The 8 shadcn call sites are marked *mechanical* in `migration/replacement-rules.csv`; converting them is cheaper than permanent API surface. **A check is NOT forbidden for one-of selection — it is just not Radio's mark.** The system already uses one, twice, and picks by option count and content richness: <5 bare options → **Radio** (circle + dot) · 5–15 known options → **Select** (`bg.selected` + leading 16px check) · 2–6 options with descriptions → **ChoiceCard** (`border.selected` halo + 16px check top-right, *Radio semantics by default* — i.e. ChoiceCard already IS a check-marked radio). Note both sanctioned checks are **16px**, above the §7 12px icon floor; a check inside a 16px Radio has ~8px of interior, which is why the mark differs. So the answer to "I want a check-marked single choice" is to pick the right one of those three, not to add a fourth rendering); a label to the left of any of the three controls (**→ label stays right**, always — a left label puts a ragged right edge between text and control and the eye loses the row; for a settings row where the label reads far from the switch, use a `DescriptionList`-style row with the Switch in the trailing position, which is a layout, not a label position); Switch inside a form with a Save button (**→ `Checkbox`** — Switch means "applied now"); Radio for >5 options (**→ `Select`**); a key-colored track on a mixed Switch (**→ `border.strong` fill**, per the table above).
**A11y:** native inputs under the hood; radio groups use `fieldset/legend`; mixed states use `aria-checked="mixed"`.

**Key rules (machine index):**
- checked = key color, not blue
- switch never inside a Save-button form
- mixed states: checkbox minus, switch centered thumb + minus glyph (track NEVER key color), radio has none
- mixed-value convention applies across all controls

---

## Badge

**Purpose:** compact static annotation — status, counts, categories. Never interactive (interaction = Chip). **Default rendering:** a Badge with no declared color renders as `neutral` — a badge never appears as unfilled floating text.
**Keywords:** tag, label, pill, status, count, dot, annotation

**Sizes:**

| Size | Spec | Jurisdiction |
|---|---|---|
| `md` (default) | height 20px, `micro` text, padding-x 8 | Everywhere: tables, cards, lists, meta rows. The constant recognition size. |
| `lg` | height 24px, `label-sm` text (600 when `solid` — foundations §9 weight compensation), padding-x 12 | Only beside `heading-xl`+ titles (page headers, R1) and hero/empty-state contexts. NEVER inside tables, lists, or dense regions — size constancy there is what makes statuses scannable. |

One size per view, as with shape.

**Optical centering:** badge labels are single-line and flex-centered within the fixed height; line-height collapses to 1 (the container provides the box — the line-height floor rule targets wrapping text, not sealed single-line containers) plus a 1px top-padding nudge to compensate for descender space the font reserves but short labels rarely use. Without this, labels read as shifted toward the top of the pill. **Scale-bound:** the nudge applies ONLY to the tight 20px/11px geometry of the `md` badge. At 24px/12px proportions (`lg` badge, Chip) the container has enough optical room that plain flex centering is correct and the nudge overcorrects downward — verified empirically, both surfaces.

**Shape: `pill` or `rounded` — a density/tone choice, not a semantic one (2026-07-30 reversal of "pill only").** Interactivity is no longer encoded by shape. It is encoded by **fill**: a Badge is filled or tinted; a Chip is outlined at rest. Fill-vs-hollow is a far stronger perceptual signal than corner radius — nobody learns that a pill means "do not click" — and no major design system uses radius as its primary interactivity cue. Freeing shape also resolves the case that made the old rule look necessary: `category` existed as both a Badge and a Chip, near-identical under shape-encoding, cleanly separated under fill-encoding. **One shape per view** (unchanged); `pill` remains the default because it reads more status-like.

**Color variants:** `neutral`, `info`, `success`, `warning`, `danger`, `ai` (uses `ai.*` tokens — agent-related states only), `category` (static taxonomy label: **neutral** `bg.sunken` fill + `text.secondary` label — colour-coding removed 2026-07-30 with the `category-*` family; the taxonomy noun carries the meaning, not a hash-assigned hue). `category` supports the `subtle` emphasis only — taxonomy is never urgent, outlined, or reduced to a dot.
**Emphasis variants** (orthogonal to color; pick by surrounding density and importance):

| Emphasis | Rendering | Use |
|---|---|---|
| `subtle` (default) | `status.*-bg` fill, `status.*` text, no border | Standard status in tables, cards, headers. |
| `solid` | see per-color rules below | High-visibility marks that must be scannable from across the screen. Max one solid color per view. |
| ~~`outline`~~ | **RETIRED 2026-07-30** | Outline is now the resting appearance of **Chip**, so a hollow Badge would break the fill-encodes-interactivity rule. The dense-table case it served is covered by `dot`, which is quieter still. |
| `dot` | 8px `status.*-bg-solid` dot (mid value — dots are non-text, 3:1 floor; the darker `status.*` text tokens are not used for fills) + `body-sm` `text.secondary` text, no container | The quietest option: long lists, sidebar items, legend-like rows. |

**Solid rules per color.** Solid is not a style choice — every solid badge has a named job:

| Solid color | Rendering | The one job | Never |
|---|---|---|---|
| `info` / `success` / `warning` / `danger` | `status.*-bg-solid` + `text.on-solid` (white, all hues) | Two jurisdictions: (a) urgent states scannable across the screen — live incidents, blocking failures — capped at one solid color per view; (b) opt-in for ops/monitoring status columns (per-view cap does not apply there); the quiet default in tables is `dot`. Fills run ~3.5:1 with white — documented policy deviation (foundations §9): short semibold labels only, never sentences. | Routine status outside tables (that's `subtle`); solid fills behind anything longer than a two-word label. |
| ~~`neutral`~~ | **RETIRED 2026-07-30** — the treatment moved to **Chip's selected state** | The spec's own objection was that `bg.inverse` "renders in the key color, so misuse reads as a primary action" — an admission it reads as actionable. It now belongs to the component that IS actionable. **Release markers** ("New"/"신규", "Beta"/"베타", "Early access") move to `neutral` **`subtle`**: capped at one per view and expiring within a release cycle, a marker does not need to be the loudest element on screen. NOT `info` — blue already carries link, focus, informational status and brand/AI, and a blue "New" would add a fifth meaning to one hue. |
| `ai` | `ai.solid` + `text.on-solid` (was accent-bg) | **Live-activity beacon only**: visible while an agent is actively operating on the current surface (autonomous mode running, bulk mutation in progress — "실행 중" with pulse allowed). MUST disappear the moment activity stops. Max one per screen. | Provenance or agent-related static states (that's `ai` subtle); anything persistent; placement adjacent to a `brand` Button in the same cluster — solid blue means "AI acting" **and** is now also the brand CTA fill (`ai.solid` and `action.brand-bg` share the blue ramp as of 2026-07-30), so a static badge beside a brand Button reads as one continuous blue mass and muddies both. |

**Count badge:** numeric-only badge (`neutral` subtle, tabular-nums) on nav items and tabs; ≥100 renders "99+".
**Count overlay** — the count that sits ON an icon button (the NotificationCenter bell is its sole jurisdiction): 18px min-width/height mini-pill, `micro` numerals, **`bg.inverse-soft` fill + `text.on-inverse` text** (softened key — visible against any chrome without pure-black harshness or status semantics), 2px ring in the underlying surface color, anchored half-in at the button's top-right corner (fixed top/right −2px), so the pill covers part of the glyph's upper-right — the ring is what keeps the covered icon legible underneath. Fixed offsets, never percentage translation, so the coverage reads identically at every button size. Neutral-subtle fills are forbidden here — the overlay exists to be seen. Disappears at zero; never renders "0".
**`with-icon` option:** subtle and solid status badges MAY carry the matching 12px registry status icon before the label — icon + color + text triple redundancy for colorblind-safe scanning in status-critical views. The icon is always the status concept's registry icon; never decorative, never on `dot`/`outline` (already minimal) or `category`.
**Forbidden — with their replacements:** interactive badges (**→ `Chip`** — if it can be clicked, removed or toggled it is a Chip; Badge is a read-only mark); sentence-length content (**→ a `Banner`** for a sentence, or truncate to one or two words); inventing colors, including a `color={hex}` override (**→ one of the six semantic colors** — `neutral` / `info` / `success` / `warning` / `danger` / `ai`; map by *meaning*, not by hue: a purple category badge becomes `neutral`, not `ai`, unless it genuinely marks agent output); an `active` / `selected` prop (**→ `Chip` with `selected`** — selection is interaction, so it is Chip's job; this is where the retired `neutral solid` treatment went); mixing emphasis levels for the same status meaning within one view; mixing shapes within one view; solid outside its named job in the table above (**→ `subtle`**, which is the default for a reason).
**A11y:** never interactive (interaction is Chip); the `with-icon` option adds the 12px registry status icon for icon + color + text triple redundancy — colorblind-safe scanning in status-critical views.
**Bilingual:** KO status terms are often 2–4 syllables ("진행 중", "완료") — width from content, never fixed. Status vocabulary is the closed set in `content.md` §3.3.

**Key rules (machine index):**
- status vocabulary = content.md §3.3 closed set
- undeclared color = neutral; a badge never renders unfilled
- solid has named jobs only: urgent marks (1 solid color/view), ops-table opt-in, neutral=release markers (must expire), ai=live-activity beacon on ai.solid slate (disappears on completion)
- dot uses status.*-bg-solid fills
- with-icon option: 12px registry status icon for triple redundancy (subtle/solid only)
- count overlay on the bell only: 18px bg.inverse-soft mini-pill + surface ring, half-in corner anchor (top/right -2px) covering part of the glyph; never neutral-subtle, never renders 0
- md optical nudge: line-height 1 + 1px top padding (md only)

---

## Chip

**Purpose:** compact **interactive** element — select, refine, remove, or accept a suggestion. The static counterpart is Badge; the split is absolute: if it can be clicked, it's a Chip; if it only informs, it's a Badge. Height 24px, radius `sm`.
**Keywords:** tag, token, filter chip, removable, selectable, suggestion

**Interactivity is encoded by FILL, not shape (2026-07-30).** A Chip is **outlined at rest**; a Badge is filled or tinted. Shape is no longer the signal — it is a free density/tone choice on Badge. Two consequences that are NOT optional:

1. **Every Chip carries an affordance glyph** naming what it does — trailing `✕` (removable), leading `✓` (selected), trailing `▾` (opens a menu). Outline alone says "actionable"; the glyph says *how*. A Chip with no glyph and no selected state is a Badge that has been mislabelled.
2. **`list-filter` chips take a FILLED selected state.** Border weight alone cannot answer "am I on?" — outline means *at rest*, not *always*.

**Variants (closed):**

| Variant | Rendering | Behavior & use |
|---|---|---|
| `input` | outlined at rest: `bg.page` + 1px `border.default` + `text.primary`, trailing 12px ✕ (`aria-label` required); MAY carry a leading Avatar 16 when the value is a person or agent | A removable selection: Combobox multi-values, recipient lists, applied values. ✕ removes; chip body is not a second target. |
| `list-filter` | **at rest** transparent + 1px `border.default` + `text.secondary` · **selected, multi-select** *no fill* — transparent + 1px `border.selected` + `text.primary` + leading 12px ✓ · **selected, single-select/toggle** `bg.inverse-soft` + `text.on-inverse` + leading 12px ✓ | Toggleable refinement in filter bars and list headers. **Selection model decides the treatment** — see below. |
| `suggestion` | outlined — `bg.raised` + `border.default` hairline, `text.primary`; hover `bg.hover` + `border.strong` | Agent-suggested actions. Console and empty states only, max 3. |
| ~~`category`~~ | **RETIRED 2026-07-30** | It duplicated Badge `category`, separated only by clickability — the redundancy that made shape-encoding look necessary. **If it only labels, it is a Badge `category`. If clicking filters by it, it is a `list-filter` chip.** No third thing. |

**Why the selected treatment depends on the selection model.**

**Multi-select filter rows take NO fill** — transparent, 1px `border.selected`, `text.primary`, leading ✓. Three channels change at once and the border does the heavy lifting: `border.selected` `#09090B` against the `border.default` `#E9E9ED` of the rest state is **19.9:1 vs 1.13:1** on the page, so it is unmissable without adding weight. (The general warning that *border weight alone cannot answer "am I on?"* applies to `border.strong` vs `border.default`, which sit 1.35:1 apart — not to the near-black selected border.) Keeping the fill off is what makes a row of five selected filters stay quiet; a filled treatment out-weighs the content it filters, which is why Material uses a tonal fill rather than the key colour and why the earlier `bg.selected` version was still heavier than necessary.

**Single-select / toggle chips DO take a fill** — `bg.inverse-soft` (`#33333A`, white label at 12.53:1), inherited from the retired Badge `neutral solid`. With exactly one chip active, a solid dark fill reads unambiguously as "this is the one", and the density argument does not apply because there is only ever one. **Note:** `bg.inverse-soft`, not `bg.inverse` — pure `#09090B` is byte-identical to `action.primary-bg`, so a selected chip would render as a primary button. The softened key has precedent in the notification count overlay ("softened key, visible against any chrome without pure-black harshness").

**Chips do NOT carry the full colour palette.** Interactive elements stay quieter than status: status must be scannable across a screen, whereas chips sit in known locations (filter bars, input fields). Seven coloured chips would compete with the badges they sit beside.

**States:** default (outlined), hover (`bg.hover` or `border.strong`), selected (filled per selection model), focus ring, disabled (`text.disabled` + `border.subtle`, no interaction — **never `opacity`**, which the system forbids as a state signal).


**Forbidden — with their replacements:** chips as command buttons (**→ `Button`** — a chip never performs a primary or destructive action); mixing `input` and `list-filter` in one row (**→ split into two rows**, each with one job); manual color selection, including a leading colour dot or `tag` prop (**→ `Badge` `dot` variant** where a colour-keyed status marker is genuinely wanted — an 8px `status.*-bg-solid` dot with `text.secondary` text and no container; a chip's job is selection, and colour-coding a selectable thing means the user must learn two systems at once); `suggestion` chips outside their sanctioned surfaces; truncating chip labels (wrap the row instead).
**A11y:** the remove ✕ requires an `aria-label` (localized: "Remove" / "제거"); every chip carries an affordance glyph naming what it does.
**Bilingual:** width from content; remove-✕ `aria-label` localizes ("Remove" / "제거").

**Key rules (machine index):**
- interactivity is encoded by FILL not shape (2026-07-30): Chip is OUTLINED at rest, Badge is filled/tinted; shape is a free density choice on Badge
- every Chip carries an affordance glyph — trailing X removable, leading check selected, trailing chevron opens a menu; a chip with no glyph and no selected state is a mislabelled Badge
- chips do NOT carry the full colour palette — interactive stays quieter than status
- disabled uses text.disabled + border.subtle, NEVER opacity
- never carries commands (that is Button)
- no manual colors
- labels never truncate

---

## Card

**Purpose:** bounded group of related content. Radius `md`, padding `--sy-card-padding`. Optional header (`heading-lg` or `heading-md` + optional actions) and footer separated by full-bleed `border.subtle`.
**Keywords:** panel, container, tile, surface, box, stat, kpi

**Variants:**

| Variant | Rendering | Use |
|---|---|---|
| `flat` (default) | `bg.surface`, no border | The standard card: grouping by surface step and spacing, not boxes. Also the sanctioned inner grouping (card-in-card nesting with borders remains forbidden). |
| `outlined` | `bg.raised`, 1px `border.default` | Genuinely separable objects: items in a pickable grid, embedded data regions, anything `interactive` (clickability needs an edge — `interactive` implies `outlined` or `elevated`). |
| `elevated` | `bg.raised`, 1px `border.default`, `shadow.xs` | Focus-archetype key moments only (the one thing the page is about); max one per page. The sole sanctioned static-card shadow. |
| `ai` | `ai.surface`, 1px `ai.border` | Container for agent-produced content. ProposalCard is a specialization of this variant. |
| `stat` | `outlined` card with fixed anatomy: `label` + `text.secondary` title · `stat`/`stat-lg` value · optional delta row · optional sparkline. (the `emphasized` opt-in is REMOVED — maintainer: no slate on stat cards; metric grids render uniform, urgency belongs to queues and status, not card tint) | KPI display. See `recipes.md` for grid presets. |

**Modifiers** (combine with any variant): `interactive` (whole card clickable: hover `border.strong` + `bg.hover` + optional `hover-lift` per foundations §7; exactly one action; keyboard focusable), `selected` (1px `border.selected` outline — selection, not focus).
**States:** static by default; `interactive` adds hover (`border.strong` + `bg.hover` + optional hover-lift) and keyboard focus; `selected` = 1px `border.selected` outline (selection, not focus).
**Forbidden:** shadows outside `elevated`; nesting bordered cards (use `flat`); cards as page layout scaffolding; `ai` variant on non-agent content.

**A11y:** an `interactive` card is keyboard focusable, the whole card is clickable, and it carries exactly one action.
**Key rules (machine index):**
- interactive implies outlined/elevated + exactly one action + optional hover-lift
- no bordered nesting
- selected = border.selected ring (selection is key color; focus stays blue)

---

## Table

**Purpose:** the workhorse for data-heavy screens. Structured records with aligned columns.
**Keywords:** data table, datagrid, grid, rows, columns, list view, spreadsheet

**Selection column:** 40px fixed, zero cell padding, contents centered both axes (`vertical-align: middle` on the checkbox) — the selection cell holds a control, not text, so it never inherits text-cell padding/alignment. Header checkbox = select-all with the mixed state per the Checkbox rules.

**Anatomy (emphasis opt-in):** one column or cell range MAY take the `emphasis.surface` fill (+ `emphasis.fg` for its header label) to mark the current period, totals, or the comparison target — max one emphasized column per table, never combined with row selection tint on the same cells. Header row (`--sy-label-size` medium, `text.tertiary`, **no fill**: header background is transparent on framed and bare tables alike; the hairline bottom rule alone marks the header, and sort glyphs get reserved space so columns never shift on sort, sticky) · rows (height `--sy-table-row`, `border.subtle` dividers) · optional footer/pagination. **Framing:** tables are frameless by default — bare header on the page background with a single hairline rule below, no outer border, no header fill; horizontally-scrolling tables (or those with pinned columns) keep the frame (1px `border.default`, radius `lg`, clipped, `bg.surface` header) because scroll edges need the boundary.
**Column rules:** text left-aligned; numbers right-aligned with `font-variant-numeric: tabular-nums` (mono for IDs); dates/times in one consistent format per table; status as Badge; row actions as ghost icon-buttons at row-end, revealed on row hover.
**Behavior:** hover `bg.hover`; selected `bg.selected` + leading checkbox; sortable headers get trailing 12px arrow (active sort column only, one at a time). Empty state: EmptyState component inside the frame, never a bare "no data" string. Loading: Skeleton rows, matching column layout.
**States per cell:** truncation with tooltip allowed (the only sanctioned truncation site besides list rows).
**States:** row hover `bg.hover` · row selected `bg.selected` + leading checkbox · empty (EmptyState inside the frame, never a bare "no data" string) · loading (Skeleton rows matching the column layout) · invalid inline-edit cell (`status.danger` border + Tooltip naming the fix).
**Forbidden:** zebra striping (dividers suffice); >1 accent color inside a table; horizontal scroll without a pinned first column; card-per-row layouts pretending to be tables.
**A11y:** header checkbox = select-all with the Checkbox mixed state (indeterminate for partial); inline edit is keyboard-complete — double-click or Enter to edit, Enter commits, Esc cancels, Tab commits + moves; the borderless cell editor is the sanctioned hidden-label exception and keeps the standard focus ring.
**Bilingual:** column min-widths sized for the wider locale; header truncation forbidden.

**Advanced behaviors (v1.3)** — available on any Table; each is opt-in per view:

- **Column controls.** Resize by dragging the header edge (min 80px; persists per user per view). Pin to the left only, max 2 columns; pinned columns show a `border.strong` right edge and keep `bg.surface`/row background while scrolling. Hide/show and reorder via the header column menu (⋯). The column menu item set is closed: Sort ascending / Sort descending / Pin / Unpin / Hide / Resize to fit.
- **Bulk selection.** Leading checkbox column (header checkbox = all-on-page, indeterminate for partial). When ≥1 row is selected, the table toolbar is replaced by a selection bar: `bg.selected` strip, "14 selected" / "14개 선택됨" (13 medium), up to 4 action buttons (`ghost`) + overflow menu + Clear. Destructive bulk actions confirm via Modal with counts.
- **Inline edit.** Sanctioned only for text, number, and select cells. Enter edit via double-click or Enter on the focused cell; the editor is borderless inside the cell with the standard focus ring (this is the sanctioned hidden-label exception). Enter commits, Esc cancels, Tab commits + moves. Invalid values: `status.danger` cell border + Tooltip naming the fix; the cell does not exit edit until valid or cancelled.
- **Row grouping.** One level only. Group header rows: 32px, `bg.surface`, 13 medium label + count Badge, collapsible with chevron. Aggregations (sum/count) render right-aligned in the group header, tabular-nums.
- **Virtualization.** Required above 200 rows. Row heights are fixed for this reason — variable-height rows are forbidden in virtualized tables.
- **Expandable rows.** Leading chevron column; expanding reveals a detail panel (`bg.surface`, full row width, own padding) below the row. One level; an expanded panel MAY contain a `flat` Card or DescriptionList, never another table.
- **Totals/summary row.** Pinned bottom row, `bg.surface`, `label` type, values tabular-nums; states the aggregation in the cell ("Σ 1,204" or "avg 4m 02s") — never an unlabeled number.
- **Header extras.** Column headers MAY carry an info icon (13px, opens Tooltip with the column definition) and a unit suffix in `text.tertiary` ("Duration *(min)*" — unit in the header, never repeated per cell).

**Cell renderers (closed set).** Every column declares exactly one renderer; the renderer fixes alignment, formatting, and truncation behavior. This set exists so new data shapes never require inventing cell UI:

| Renderer | Spec |
|---|---|
| `text` | left, `body`, single-line ellipsis + Tooltip |
| `text-2line` | primary `body` + secondary `caption` `text.secondary`; only in reading-oriented tables (never in compact data walls) |
| `number` | right, tabular-nums |
| `currency` | right, tabular-nums, locale format (content.md §6) |
| `percent` | right, tabular-nums, "12%" |
| `delta` | right, signed, `status.success`/`status.danger` text + ▲▼ marker (never color alone) |
| `date` / `datetime` | left; one consistent format per table (ISO for machine/log tables, locale format otherwise) |
| `duration` | right, tabular-nums, "4m 12s" |
| `id` | left, `code-sm` mono, `text.secondary`, middle-out truncation, copy on click |
| `status` | Badge `dot` + plain text — the standard in status columns (per the sleek restyle): the quietest rendering, and dots have no fill to melt into row highlights. `solid` is the sanctioned opt-in for ops/monitoring views where states must scream across a wall of rows. |
| `labels` | up to 2 category Badges (static) or Chips (click-to-filter views) + "+N" overflow |
| `user` | Avatar 20 + name, single line |
| `agent` | squared Avatar 20 + name |
| `link` | `text.link`, single-line ellipsis |
| `progress` | ProgressBar (4px) + optional "N/M" caption |
| `sparkline` | Chart sparkline, 24px |
| `actions` | trailing ghost icon-buttons (approved icon list) |
| `checkbox` | leading selection column only |

Empty cell value is always an em dash "—" in `text.tertiary` — never blank, never "N/A", never "null".

**Key rules (machine index):**
- 18 closed cell renderers fix alignment/format per column; empty cell = em dash
- header row: label-size medium text.tertiary, transparent fill, hairline rule only; sort glyph space reserved
- selection column: 40px, zero padding, centered both axes — control cell, not text cell
- emphasis column opt-in: emphasis.surface fill marks current period/totals, max 1/table
- status columns default dot+text; solid opt-in for ops walls
- frameless by default (bare header); scrolling/pinned-column tables framed
- column menu closed set; bulk selection bar; inline edit for text/number/select cells; 1-level grouping; virtualize >200 rows
- no zebra striping

---

## Combobox

**Purpose:** choose one or many values from large (>15), async-loaded, or user-known option sets. This is Select's big sibling — Select stays for 5–15 static options.
**Keywords:** autocomplete, typeahead, multiselect, search select, async options, creatable

**Anatomy:** Input-style trigger (label above, height-md, chevron trailing). Typing filters instantly; matched substrings are highlighted (600 weight, no color change). Menu = Popover surface, options as Select's; async results show 3 Skeleton rows while loading.
**Multi-select:** selected values render as removable input Chips inside the trigger, wrapping to max 2 rows, then a "+N" overflow Chip (click → popover listing all). Menu options get leading Checkboxes; the menu stays open between picks; trigger placeholder becomes the selection count when collapsed.
**States:** as Input, plus open, loading, no-results ("No matches for '{query}'" row + optional "Create '{query}'" action — creation only where the data model explicitly allows it, styled as a menu item with a plus icon, never auto-created on blur).

**Convenience features (all opt-in per instance):**

- `search-in-menu` — when the trigger is a button rather than an input (e.g. inside a Modal or toolbar), the menu opens with a borderless search row at the top (full-bleed bottom rule), focused on open.
- `select-all` — multi-select menus MAY start with a pinned "Select all ({n})" / "전체 선택 ({n}건)" row with mixed-state checkbox behavior, plus a "Clear" action in the trailing position of the same row. Operates on the *filtered* set, and says so when a filter is active ("Select all 12 matching").
- `grouped` — options under sticky group labels (`micro`, `text.tertiary`); groups collapse only in menus >50 options.
- `descriptions` — option rows MAY carry a `caption` `text.secondary` second line and/or a leading 16px icon; row height grows to 40px.
- `recent` — a "Recent" group of up to 3 items pinned above all groups, based on the user's own selections.
- `async-more` — paginated sources append a "Load more" row (`ghost` styling); never infinite-scroll inside a menu.
- `virtualized` — required above 100 options.

**A11y:** ARIA combobox pattern; full keyboard including Backspace to remove the last Chip in multi.
**Forbidden:** Combobox for <5 options (Radio) or 5–15 static (Select); free-text values without explicit creatable mode; menus narrower than the trigger; selected Chips truncating (wrap instead); select-all defaulting destructive bulk changes.
**Bilingual:** filtering matches both locales' labels and romanized Hangul; option and Chip widths from content.

**Key rules (machine index):**
- conveniences opt-in: search-in-menu, select-all (filtered set), groups, descriptions, recent, load-more, virtualize >100
- creatable only when data model allows; never auto-create on blur

---

## DatePicker

**Purpose:** date, date-range, and time selection. Formatted Input trigger + calendar Popover.
**Keywords:** calendar, date input, date range, time picker, datetime, date field

**Variants (closed):** `date` (default) · `range` · `datetime` · `time`.

**Calendar anatomy:** header (month/year label 14 semibold + prev/next icon-buttons) · weekday row (11 medium, `text.tertiary`) · 7×6 day grid. Day cells 32px, radius `md`: today = `emphasis.surface` fill + `emphasis.border` inset hairline + `emphasis.fg` semibold numeral (the now-marker job); selected = `action.primary-bg` fill; range interior = `bg.selected` with squared edges, endpoints filled; other-month days `text.disabled`; disabled dates `text.disabled` + strikethrough forbidden — use no-hover + `aria-disabled` instead.
**`range`:** two calendars side-by-side (one in narrow contexts); preset rail on the left — closed preset set: Today, Last 7 days, Last 30 days, This month, Last month, Custom ("오늘", "지난 7일", "지난 30일", "이번 달", "지난달", "직접 선택"). When the underlying value is a datetime window (schedule windows, log queries), each endpoint MAY carry a time field per the `datetime` rules; otherwise range is date-only.
**`datetime`:** the calendar Popover gains a footer time row below a full-bleed `border.subtle` rule: 16px clock icon + time field + timezone label (`caption`, `text.tertiary` — mandatory, never ambiguous). Time entry is typed, 24-hour `HH:MM` (content.md §6); arrow keys step by 15 minutes on the focused segment; typed values normalize on blur ("930" → 09:30). The trigger displays the combined locale format ("2026년 1월 9일 14:02 KST" / "Jan 9, 2026, 14:02 KST").
**`time`:** standalone time field (no calendar) — same entry rules, width to content. For durations use Input `number` + unit, never a time picker.
**Formats:** display per locale — EN `Jan 9, 2026`, KO `2026년 1월 9일`; typed entry accepts the locale's numeric format (`01/09/2026` / `2026-01-09`) and normalizes on blur. Week start follows locale convention (both ko-KR and en-US: Sunday; honor explicit workspace override). When timezone matters (schedules, logs), show the tz label next to the value — never leave it ambiguous.
**States:** as Input, plus open, invalid-date error (names the accepted format), min/max-bounded (out-of-range days disabled with reason in a Tooltip).
**Forbidden:** text-only date entry without a picker; dropdown-per-unit (day/month/year Selects) except birthdate-style historic entry; two calendars for a single date; relative-only display without absolute on hover.

**A11y:** disabled dates take no-hover + `aria-disabled` (strikethrough forbidden); out-of-range days are disabled with the reason in a Tooltip; `datetime` arrow keys step the focused segment by 15 minutes; typed values normalize on blur.
**Key rules (machine index):**
- locale formats per content.md §6; timezone label mandatory when it matters
- durations are number+unit, never a time picker
- today outlined; endpoints filled; range interior squared

---

## SegmentedControl

**Purpose:** exclusive switch between 2–5 peer views or parameters with immediate effect — chart periods (1D/7D/30D), layout toggles (list/grid). Not Tabs (object facets), not Radio (form data, deferred effect).
**Keywords:** segmented button, toggle group, view switcher, exclusive choice, mode switch

**Anatomy:** container `bg.sunken`, radius `md`, **4px inner padding** (concentric-corner rule, foundations §5: inner radius = outer − inset; 12 − 4 = 8 keeps both radii on-scale, and the assembled control lands exactly on the control height (32). Segments: height 24, radius `sm`, padding-x 12, 13 medium, `text.secondary`; selected segment `bg.page` fill + 1px `border.default` + `text.primary`. Equal-content-based widths; the control sizes to its content.
**States:** default, hover (`text.primary`), selected, disabled (whole control only — never individual segments), focus-visible ring on the active segment.
**A11y:** `radiogroup` semantics; arrow keys move selection.
**Forbidden:** >5 segments (use Select); icon-only segments outside the approved icon list; mixed icon+text and text-only segments in one control; using it for navigation or form submission.
**Bilingual:** segment widths from content — "지난 30일" and "Last 30 days" must both fit without truncation.

**Key rules (machine index):**
- content-based widths; disabled whole-control only
- concentric geometry: radius-md container, 4px padding, radius-sm segments (prose states the arithmetic: 12 - 4 = 8; corrected 2026-08-03 by SY021, both were one step low) — inner = outer − inset; assembled control = 36

---

## Accordion

**Purpose:** progressive disclosure of secondary content — advanced settings, FAQ-style detail, raw payloads.
**Keywords:** collapsible, disclosure, expander, expand collapse, details

**Anatomy:** items separated by `border.subtle`. Header row: 40px, chevron (16px, rotates 90°→ down at `fast`), 14 medium title, optional right-aligned meta (`text.tertiary`, 13). Panel: body text, padding 0 0 16px, indented to the title edge. Height animates at `base` — the sanctioned height-animation exception.
**Behavior:** multiple items may be open simultaneously (default); single-open mode allowed for step-like content. State persists within the session.
**States:** collapsed, expanded, disabled item (`text.disabled`, no chevron rotation).
**A11y:** header is a `<button>` with `aria-expanded` and `aria-controls`.
**Forbidden:** hiding primary content, primary actions, or error states inside collapsed items; nesting accordions; accordion as a substitute for Tabs or table grouping; icons other than the chevron as the affordance.

**Key rules (machine index):**
- never hides primary content/actions/errors
- chevron is the affordance; height animates (sanctioned exception)

---

## FileUpload

**Purpose:** file input with visible progress and recoverable errors.
**Keywords:** uploader, dropzone, file input, drag and drop, attachment

**Variants:** `dropzone` (dashed 1px `border.strong`, radius `xl`, padding 32×24, centered: 20px upload icon in a 48px `bg.sunken` medallion (single `border.default` hairline ring — the dropzone keeps this icon medallion; it no longer references EmptyState, which now uses line illustrations) + "Drop files here or **browse**" (13 medium, browse as Link) + constraints caption — "PDF, CSV up to 20MB" / "PDF, CSV · 최대 20MB") and `button` (a `secondary` Button "Attach file" / "파일 첨부" for compact contexts). Drag-over state: `border.focus-input` border + `emphasis.surface` fill. Dashed borders remain sanctioned for drop targets ONLY.
**File rows:** 40px each below the input — 16px file-type icon, filename (middle-out truncation with full name in Tooltip), size (`text.tertiary`, tabular-nums), then per state: uploading = 4px determinate ProgressBar spanning the row bottom + percent; success = `status.success` check; error = `status.danger` icon + one-line cause + Retry ghost button; all rows get a remove ✕ icon-button (`aria-label` required).
**Rules:** constraints (types, size, count) are always visible before selection, and violations are named per file, not as a generic failure. Multiple files upload in parallel with individual progress; never a single combined bar.
**States:** drag-over (`border.focus-input` border + `emphasis.surface` fill); per file row: uploading (4px determinate ProgressBar + percent) · success (`status.success` check) · error (`status.danger` icon + one-line cause + Retry).
**Forbidden:** uploads without visible progress; silent rejection of oversized/wrong-type files; auto-submit on drop when a form has other unfilled required fields.

**A11y:** every file row's remove ✕ is an icon-button with a required `aria-label`; violations are named per file, never as a generic failure; a truncated filename keeps its full name in a Tooltip.
**Key rules (machine index):**
- constraints visible before selection; violations named per file
- no combined progress bar
- dropzone: dashed border.strong + radius xl + medallion (corrected 2026-08-03 by SY021, was lg); drag-over = border.focus-input + emphasis.surface; dashed = drop targets only

---

## SplitPanel

**Purpose:** resizable adjacent regions in Workbench archetypes — list + detail, editor + preview, table + inspector. Container is a section shell: radius `2xl`, 1px `border.default`, flush panes.
**Keywords:** resizable, splitter, panes, split view, resize handle, resizable panel

**Anatomy:** 2 panes (max 3) separated by a 1px `border.default` divider with an invisible 8px drag hit-area. Divider on hover/drag: `border.strong`, cursor `col-resize`. Optional collapse chevron centered on the divider (collapses the secondary pane to nothing; a re-open affordance stays at the edge).
**Behavior:** drag resizes within min widths (content pane ≥ 280px, rail/inspector ≥ 200px); double-click the divider resets the default ratio; the ratio persists per user per view. Panes scroll independently.
**States:** divider hover/drag (`border.strong`, `col-resize` cursor) · collapsed (secondary pane collapses to nothing; a re-open affordance stays at the edge).
**Forbidden:** more than 3 panes; nested splits beyond one horizontal + one vertical level; SplitPanel in fixed-layout archetypes (Settings, Guided); panes without min widths (KO labels need the floor).
**A11y:** divider is `role="separator"` with `aria-valuenow`, keyboard-resizable via arrow keys when focused.

**Key rules (machine index):**
- ≤3 panes; min widths 280/200; ratio persists; not in fixed-layout archetypes (Settings/Guided)
- container = section shell: radius 2xl + hairline, flush panes (corrected 2026-08-03 by SY021, was xl)

---

## Chart

**Purpose:** standardized data visualization. Charts live inside Cards with a 16-semibold header; one chart per Card.
**Keywords:** graph, plot, visualization, sparkline, line chart, bar chart, donut

**Types (closed):** `line` (trends; ≤8 series), `area` (single series only), `bar` vertical/horizontal (comparisons), `stacked-bar` (composition over categories), `donut` (composition, ≤3 slices — otherwise bar), `sparkline` (inline 24px, no axes, single series).
**Anatomy:** plot area · x/y axes (labels 12 `text.tertiary`, axis line `border.default`) · horizontal gridlines only (`border.subtle`) · legend only when >1 series (12px, 8px square swatches, above the plot right-aligned; prefer direct series labeling when space allows) · hover tooltip (Tooltip surface: shows the hovered x-value and all series values, tabular-nums, swatch-keyed).
**Color:** `viz-1…8` in fixed order; single series = `viz-1`; status-encoding charts use `status.*` tokens instead. Never gradients, never opacity ramps as a third dimension. **The viz palette is chart-only** — it was rebuilt 2026-07-30 for discriminability (min ΔE 45.8 light / 51.9 dark) and is per-mode; UI category tints are the separate `category-*` family. Chart marks are gated at 2.5:1 against the page, a documented deviation from 3:1 (foundations §9), so **labels, legends or series filters are REQUIRED** — colour alone never identifies a series.
**Scale rules:** bar charts start y at 0, always. Line charts may baseline above 0 only with a visible axis-break marker. Number and date axis labels format per locale; abbreviations use locale conventions (1.2k / 1.2천).
**States:** loading = skeleton plot (gray bar/line silhouette, pulsing); empty = EmptyState inside the plot area; error = error EmptyState with Retry. Data updates snap — no transition animation on refresh; initial draw may animate once at `base`.
**Sizes:** min-height 240px; sparkline 24px.
**Forbidden:** 3D, dual y-axes, pie beyond 3 slices, >8 series (aggregate the tail into "Other" / "기타"), decorative icons inside plots, y-axis label rotation (widen or abbreviate instead).

**A11y:** colour alone never identifies a series — labels, legends or series filters are REQUIRED (marks are gated at 2.5:1, a documented deviation from 3:1, foundations §9).
**Key rules (machine index):**
- viz-1..8 in fixed order; status charts use status tokens
- bars start at 0; no dual y-axes; >8 series → 'Other'
- loading skeleton / EmptyState / error states required

---

## Tabs

**Purpose:** switch between peer views of the same object. 2–7 tabs.
Style: text tabs (`--sy-body-size` medium), `text.secondary` at rest, active tab `text.primary` + 2px `bg.inverse` underline; container has `border.subtle` bottom rule. Height 40px. Optional count Badge after label.
**Keywords:** tab bar, tab strip, tab panel, dynamic tabs, views

**`editable` variant — user-created tabs (added 2026-07-30 — migration gap).** For surfaces where the *user* owns the tab set rather than the product: open query/document/run workspaces. Each tab gains a trailing 12px ✕ (appears on hover or when active; always present on touch, `aria-label` "Close {name}"), and a trailing `+` icon-button sits after the last tab, outside the scroll region so it never scrolls away. Double-click a tab label to rename in place (inline Input inheriting the tab's type scale, Enter commits, Esc reverts). Closing the active tab activates its right neighbour, or its left if it was last. Replaces the old library's `DynamicTabs`.
**The 7-tab cap still holds, and is enforced differently here.** Author-defined tabs are capped by review — 8 tabs means restructure the page. User-created tabs cannot be capped that way, so the `+` button **disables at 7** with a Tooltip ("Close a tab to open another" / "탭을 닫고 새로 여세요"), rather than allowing an unbounded scrolling strip. A workspace that genuinely needs more open items is not a tab strip: use a Sidebar list or a Tree, where 30 items is a normal quantity.
**States:** as base Tabs, plus `dirty` (unsaved content — a 6px `text.tertiary` dot replaces the ✕ until hover) and `closing` (`fast` width collapse).
**Forbidden:** boxed/pill tab styles; tabs for sequential steps (compose a stepper per `patterns.md` — R9 in `recipes.md` is the reference); >7 tabs (author-defined: restructure; `editable`: the `+` disables at 7); icon-only tabs (an icon alone cannot carry a user-named document — use icon + label); `editable` for product-defined views (if the user cannot create the tab, they must not be able to close it); closing the last remaining tab (leave one, or render an EmptyState in the panel instead).
**A11y:** the ✕ is a separate button inside the tab, not part of its activation target — arrow keys move between tabs, `Delete`/`Backspace` on a focused tab closes it, and the close button is reachable by Tab within the strip. Renaming moves focus into the inline Input and returns it to the tab on commit.
**Bilingual:** tab width from content; total overflow scrolls horizontally with fade edges, never wraps to two lines.

**Key rules (machine index):**
- never for sequential steps (use Stepper recipe — recipes.md R9)
- overflow scrolls, never wraps
- editable variant (2026-07-30) for USER-created tabs: trailing X per tab, trailing + after the last, double-click renames in place; closing the active tab activates its right neighbour
- the 7-tab cap holds — author-defined tabs are capped by review, editable tabs by DISABLING the + at 7; beyond 7 open items is a Sidebar list or Tree, not a tab strip
- editable never for product-defined views (if the user cannot create it, they must not close it); never close the last remaining tab
- dirty state = 6px text.tertiary dot replacing the X until hover

---

## Sidebar (app navigation)

**Purpose:** the single global navigation surface of AgentOS.
Width 240px expanded, 64px collapsed (icon rail with tooltips). `bg.surface`, right `border.subtle`, **container padding 12px** (previously unspecified). Items: height 32px, radius `md`, padding-x 8, 20px icon + label (13 medium), `text.secondary`, 4px vertical gap between items (2px proved sub-perceptual; adjacent hover/active tints need visible separation); hover `bg.hover`; active item `bg.selected` + `text.primary` + medium weight — no leading bar or edge indicator (maintainer reversal of the bar: dated; tint + weight carry the state). Sections separated by 16px gap + optional `micro-label` `text.tertiary` group label (16px top padding above the label; sentence case — caps forbidden). **Collection rows:** nav items representing user-created collections MAY carry an 8px neutral dot (`icon.tertiary`) before the label — the one place color enters the sidebar; never on system destinations. Max 2 nesting levels.
**States:** expanded (240px) · collapsed (64px icon rail — labels surface as tooltips) · item hover `bg.hover` · active item `bg.selected` + `text.primary` + medium weight (no leading bar or edge indicator).
**Forbidden:** third nesting level; badges on more than 3 items simultaneously; per-item custom icons outside the icon family.
**Bilingual:** labels never truncate when expanded — the 240px width is sized for KO labels; if a label exceeds it, shorten the label, not the type size.
**Keywords:** navigation, nav, side nav, rail, menu, app shell

**Key rules (machine index):**
- 240px expanded/64 rail
- container padding 12; items 32px, 4px gaps; group labels 16px top pad (micro-label, sentence case)
- collection rows may carry an 8px viz-tint category dot — the one color in the sidebar; never on system destinations
- labels never truncate when expanded — shorten the label
- max 2 nesting levels

---

## Breadcrumb

**Purpose:** Path context for pages deeper than 2 levels. 13px, `text.tertiary` links with `text.primary` current page, `/` separators. Collapse middle levels beyond 4 into an overflow menu ("…"). Forbidden on top-level pages.
**Keywords:** path, trail, navigation path, hierarchy, location

---

## Modal

**Purpose:** blocking decision or focused short task. `bg.scrim` backdrop, opaque `bg.raised` panel (glass over a scrim reads muddy; the scrim carries the de-emphasis), radius `xl`, `shadow.xl`, width 480px (confirm: 400px, max 640px for forms; **browse-library modals: 760, the tier between form-max and the 800 wide Drawer; the Template Library is the reference case**), padding 24. Header: section title + ghost close icon-button. Footer: right-aligned Button pair — secondary ("Cancel") then primary; destructive confirms use `danger` primary.
**Header action slot (added 2026-07-30 — migration gap).** The header MAY carry ONE action between the title and the close button, right-aligned against the close icon-button with a 12px gap: a `ghost` `sm` Button, a `ghost` icon-button from the approved list, or a Link. It is for *ancillary* affordances that are not the modal's decision — "Learn more", "Open in full page", a HoverCard help trigger, a view toggle. Replaces the old library's `DialogHeaderWithAction`.
**Why it does not break the two-button footer rule.** The footer cap counts *decisions* — the ways of resolving the modal. A header action never resolves the modal: it opens a secondary surface, navigates away, or changes presentation. If the affordance you want in the header would close the modal or commit its content, it is a decision and belongs in the footer, which means you have three decisions and the real fix is to simplify the modal.
**Forbidden:** modals opening modals; scrollable full-page content inside a modal (use Drawer or a page); more than 2 footer buttons; modals for non-blocking info (use Toast/Banner); more than one header action; `primary`, `brand` or `danger` styling on a header action (emphasis in the header competes with the footer's primary — if it deserves that weight it is a decision, see above); a header action on a `confirm` (400px) modal — confirms carry no ancillary affordances.
**Keywords:** dialog, popup, overlay, confirm, alertdialog, lightbox

**Key rules (machine index):**
- widths 400(confirm)/480/640 max
- opaque bg.raised (glass retired from scrimmed layers)
- footer: Cancel + one primary (danger for destructive, consequences named by count+noun)
- no modal-on-modal; z.modal
- header action slot (2026-07-30): at most ONE ghost action/icon-button/Link between title and close, 12px gap; for ancillary affordances only (Learn more, Open in full page, view toggle)
- the two-button footer cap counts DECISIONS — a header action never resolves the modal; if it would close or commit, it is a decision and belongs in the footer
- no header action on a 400px confirm modal; never primary/brand/danger styling in the header

---

## Drawer

**Purpose:** Side panel for detail/edit without leaving context. Slides from right, width 480px (max 640px; **`wide` variant 800px** for data-review surfaces — DiffView, run inspection — where 640 forces unusable wrapping), full height, `shadow.xl`, opaque `bg.raised` panel (glass retired from scrimmed layers, foundations §6), same header pattern as Modal. Non-blocking variant (no scrim) allowed in data workspaces.
**AI side surfaces:** the `wide` variant is also the home for agent **artifacts** (a generated doc/code/diagram/table opened for viewing and editing) and the **source browser** (retrieved sources shown beside the answer) — see `ai-patterns.md` §32–33. These are Drawer *content*, not new components; in the workbench archetype the same content MAY occupy a SplitPanel pane instead.
**Keywords:** sheet, side panel, slide over, slideout, bottom sheet, artifact panel

**`bottom` side — narrow viewports only (added 2026-07-30 — migration gap).** Below the 768px breakpoint (`patterns.md`) a 480px right-hand panel is wider than the viewport, so at `<768` a Drawer MUST render from the bottom instead: full width, height capped at 85vh, radius `xl` on the top two corners only, a 32×4px `border.strong` grab handle centered 8px below the top edge, same opaque `bg.raised` panel and header pattern. This is a **responsive rendering of the same Drawer**, not a `side` prop the author chooses — `side` stays unset and the component switches on viewport. Swipe-down dismiss is expected where the platform supports it; Esc and scrim-click still apply.
**Why `side` is not author-controlled.** Letting authors pick a side reintroduces the inconsistency the closed-variant policy exists to prevent — two teams would place the same detail panel differently. Edge is a function of available space, so the system decides it.
**Forbidden:** left-side drawers (reserved for Sidebar — use the right side, or a Modal if the content is a blocking decision); `top` drawers (the top edge is app chrome: topbar, CommandPalette entry, Banner strip — a panel from there is indistinguishable from a system message; use a Modal, or a Banner for non-blocking notice); nested drawers; `bottom` at ≥768 (a bottom sheet on a wide desktop viewport wastes the horizontal space that made the side panel the right shape to begin with).

**A11y:** Esc and scrim-click dismiss (they still apply in the bottom rendering; swipe-down where the platform supports it).
**Key rules (machine index):**
- full-screen data drawers for review surfaces
- wide 800 variant for data review (DiffView)
- opaque bg.raised always (glass retired from scrimmed layers)
- z.drawer
- bottom rendering below the 768 breakpoint (2026-07-30): full width, max-height 85vh, radius xl on the top two corners, 32x4 border.strong grab handle — this is RESPONSIVE, not an author-set side prop; edge is a function of available space so the system decides it
- side is NOT author-controlled: left is forbidden (Sidebar), top is forbidden (the top edge is app chrome — topbar/palette/Banner — so a panel from there reads as a system message; use a Modal or Banner), bottom is forbidden at >=768

---

## Popover / Menu

**Purpose:** Anchored floating panel: `bg.raised` (`bg.raised-2` when opened from an L2 surface such as a modal), `border.overlay`, radius `md`, **4px container padding** (concentric-corner rule: 12 − 4 = 8 = item radius `sm`), `shadow.lg`, `fast` fade+4px-shift enter. Menu items: height 32px, radius `sm`, 13px, 16px optional leading icon, **4px vertical gap between items** (without it, adjacent hover and selected tints fuse; 2px proved sub-perceptual). Destructive items `status.danger` text, always last. Max ~8 visible items, then scroll.
**Keywords:** dropdown, dropdown menu, popup menu, flyout, overflow menu, kebab, actions

**Kbd slot (added 2026-07-30 — migration gap).** A menu item MAY carry its keyboard shortcut right-aligned in the row as a `.sy-kbd` hint, `text.tertiary`, with a minimum 24px gap from the label (the label truncates before the hint does — the shortcut is fixed-width, the label is not). This completes the shortcut vocabulary already established in Tooltip's Kbd slot and CommandPalette's trailing `.sy-kbd`: **the same affordance renders identically in all three**, which is the point — a user who learns `⌘K` in the palette recognises it in a menu. Replaces shadcn's `DropdownMenuShortcut`.
**Forbidden:** invented shortcuts (the hint documents a binding that exists, it never implies one); hints on items without a global or surface-level binding; a Kbd slot on a `danger` item (destructive actions are not keyboard-accelerated).
**Dividers:** 1px `border.subtle`, spanning the panel **edge to edge** (through the container padding — negative-margin the rule or the bordered row out to the panel edge), 4px vertical margin. Never inset. **This binds every horizontal rule inside any floating panel AND inside any padded pane of a Modal** (menus, popovers, NotificationCenter, follow-up panel, picker search/footer rows, palette, the Template Library's column internals) — a rule that stops short of the edges reads as a rendering bug (reaffirmation; the rule dates to). **An inset control sitting against a full-bleed divider (such as a footer button) takes equal padding on all four sides — the gap between the divider and the control MUST equal its side and outer-edge padding; an asymmetric divider gap reads as a misalignment. (Full-bleed hover rows like menu escape rows are a separate pattern and keep their row padding.)**
**Optional search row:** menus with >8 items MAY start with a borderless filter input (search icon, 13px, `border.subtle` bottom rule, full-bleed) — same filtering behavior as Combobox, including match highlighting.
**States:** open (`fast` fade + 4px-shift enter) · item hover and selected tints (the 4px item gap keeps adjacent tints from fusing) · >8 visible items scroll.
**Forbidden:** forms beyond a single control inside popovers; submenus deeper than one level; inset dividers.

**Key rules (machine index):**
- border.overlay (none in light, visible in dark) + shadow.lg; z.dropdown
- 6px container padding (concentric: 10-6=4 item radius); items 32px with 4px gaps; destructive last; dividers full-bleed — binds EVERY horizontal rule in any floating panel, incl. search/hint/footer rows
- search row optional >8 items
- one submenu level max
- Kbd slot (2026-07-30): a menu item MAY carry its shortcut right-aligned as a .sy-kbd hint in text.tertiary, min 24px from the label, label truncates before the hint; renders IDENTICALLY to Tooltip's Kbd slot and CommandPalette's trailing kbd — one shortcut vocabulary across all three
- never invent a shortcut hint for a binding that does not exist; never a Kbd slot on a danger item

---

## Tooltip

**Purpose:** 10-word max clarification of an icon or truncated string. `bg.raised-2`, 1px `border.default`, `text.primary`, `caption` type, radius `xs`, padding 4/8, `shadow.lg`, appears after 300ms hover/focus. **Kbd slot:** MAY append the action's shortcut as a trailing `.sy-kbd` hint ("Copy ⌘C") — the sanctioned way to teach shortcuts in place. Same-scheme surface: light in light mode, dark in dark mode (changed — inverse surfaces read too stark against the neutral field).
**No arrow / tail — deliberate (ruled 2026-07-30).** Tooltips are plain rectangles. `Popover / Menu`, `HoverCard` and `Popconfirm` carry no arrow either, and one floating surface growing a tail while the others do not is the kind of drift the closed-variant policy exists to prevent. Proximity plus the 4px enter-shift already establish what the surface is anchored to; an arrow adds a rendering edge case at every viewport boundary for no comprehension gain. shadcn's `TooltipArrow` and the old library's `tip` / `tipPosition` props therefore have **no replacement — drop them.** If an anchor is ever genuinely ambiguous, the fix is to move the tooltip closer, not to point at the target.
**States:** hidden at rest · shown after a 300ms hover/focus delay.
**Forbidden — with their replacements:** interactive content (**→ `HoverCard`** for rich hoverable content, `Popover` if it needs a click); tooltips as error surfaces (**→ the field's error text**, `caption` / `status.danger` below the field — an error the user must read cannot live behind a hover); tooltips on plainly labeled elements (**→ nothing**; delete it, a tooltip repeating a visible label is noise); inverse/contrast-flipped styling (**→ the same-scheme surface** described above); arrows/tails (**→ nothing**, see above).
**Keywords:** hint, hover label, info bubble, title, shortcut hint

**A11y:** triggered on focus as well as hover; never interactive content (that is HoverCard/Popover); never an error surface — an error the user must read cannot live behind a hover.
**Key rules (machine index):**
- never interactive; never an error surface

---

## Toast

**Purpose:** Transient outcome notification, bottom-right stack, max 3. `bg.raised-2` panel, 1px `border.overlay`, `shadow.lg`, `text.primary` `body-sm` text, radius `md`, leading status icon (`status.*` color), optional single action (`text.link` text button), auto-dismiss 5s (errors: 8s + manual dismiss), `slow` slide+fade. *Hairline corrected 2026-08-03 (SY021): this read `border.default`, but `foundations.md` §6 explicitly lists **toasts** among the floating layers that take `border.overlay` — transparent in light mode, where the shadow carries the edge, visible in dark mode where shadows die against black. Token usage is foundations' jurisdiction (design.md §1), so the component entry was the stale side. **Superseded 2026-08-03:** the phrase "Toast surface" no longer resolves anywhere else — Thread's "Jump to latest" and SelectionPill were re-pointed at `FloatingPill`, which owns that shell. They shared Toast's tokens and none of its contract, so the citation was false. Toast's hairline is still `border.overlay` on its own merits (foundations §6 lists toasts among the floating layers).*
**Keywords:** notification, snackbar, flash message, undo, transient alert

**Undo convention:** reversible-lite mutations (archive, remove-from-view, single delete with soft-delete backing) confirm via Toast with an Undo action at 8s instead of pre-confirming — prefer undo over Popconfirm when the operation is safely reversible; the pair never both appear for one action. Same-scheme surface: light in light mode, dark in dark mode (changed). **First-line alignment:** contents top-align to the first text line — icon at +2px, action link on the text line-height, and the dismiss × as a compact 20px box (inline dismiss affordances in Toasts and quote bars are not form controls; the control-height scale does not apply to them). Trailing controls never center against a wrapped block.
**States:** entering (`slow` slide+fade) · visible (auto-dismiss 5s; errors 8s + manual dismiss) · stacked (max 3, then queue).
**Forbidden:** toasts for validation errors (inline at the field); toasts requiring a decision (Modal); stacking >3 (queue instead); inverse/contrast-flipped styling.

**Key rules (machine index):**
- same-scheme surface (raised-2 + border.overlay + shadow)
- errors 8s + manual dismiss; never for validation or decisions
- contents first-line aligned; dismiss × = compact 20px box (not a form control )
- undo convention: reversible-lite ops get Undo toast (8s) instead of Popconfirm — never both

---

## Banner / Alert

**Purpose:** Persistent inline notice for a page or section. Full-width of container, radius `md`, padding 12/16: 16px icon + `body-sm` text + optional action link + optional dismiss.
**Keywords:** callout, notice, inline message, announcement, system strip

**Color variants:** `neutral` (non-status notices: scheduled maintenance windows, informational context — `bg.sunken`, `text.secondary`), `info`, `success`, `warning`, `danger`.
**Emphasis variants:**

| Emphasis | Rendering | Use |
|---|---|---|
| `subtle` (default) | borderless `status.*-bg` fill, `status.*` text — no border, no rail (maintainer reversal of the left rail: dated; the fill + colored text alone is the modern rendering. Tint + saturated outline remains the forbidden wireframe formula) | Page- and section-level notices. |
| `solid` | `status.*-bg-solid` fill + `text.on-solid` white at **semibold (600)** — never regular weight on a solid fill, no border | System-critical, app-wide strip pinned above all chrome (outage, billing lock, forced upgrade). Full-bleed, no radius, max one in the entire app, always with an action. Keep the message short — the solid-label contrast policy (foundations §9) applies. |

**Forbidden:** more than one Banner visible per region; `solid` for anything a user can simply dismiss; Banners as marketing surfaces.

**Key rules (machine index):**
- max 1 per region

---

## Avatar

**Purpose:** User/agent identity. Sizes 20/24/32/40/56px (20 = dense table cells and inline mentions; 56 = profile surfaces). `full` radius for humans; squared (`sm` radius) for agents — mandatory product language, shape alone must scan authorship. Image, or initials (2 Latin letters / 1 Hangul syllable) on deterministic `viz` palette background at 20% opacity with matching 600-weight text.
**Keywords:** profile picture, user image, initials, presence, identity

**Sizes:** `20` (dense table cells and inline mentions; never carries a status dot) · `24` · `32` · `40` · `56` (profile surfaces).
**Status indicator:** optional dot, bottom-right, 2px `bg.page` ring. Sized per avatar: 24→8px, 32→10px, 40→12px, 56→14px; the 20px avatar NEVER carries a dot (illegible at that scale — surface the state elsewhere in the row). Humans: presence (`status.success-bg-solid` = active, `border.strong` = away). Agents: run state (`status.info-bg-solid` pulse = running, `status.danger-bg-solid` = failed, none = idle). Dots use the mid `-bg-solid` values, never the darker text tokens. One vocabulary per product surface — never both meanings in one view.
**AvatarGroup:** overlapping stack (offset −25%, each with 2px `bg.page` ring), max 4 visible + "+N" overflow circle (`bg.sunken`, `micro` text; click → popover listing all). Humans and agents may mix in a group; ordering is humans first, then agents.
**States:** carried by the optional status dot — humans: presence (`status.success-bg-solid` = active, `border.strong` = away); agents: run state (`status.info-bg-solid` pulse = running, `status.danger-bg-solid` = failed, none = idle); one vocabulary per product surface.
**Forbidden:** rectangular human avatars or round agent avatars; status dots without an established vocabulary; groups hiding the overflow count.

**Key rules (machine index):**
- dots per size 8/10/12/14 using status.*-bg-solid
- AvatarGroup: max 4 + '+N'
- initials on deterministic viz tint

---

## Skeleton · Spinner

**Purpose:** Skeleton (preferred): `bg.sunken` blocks, radius `xs`, subtle 1.5s opacity pulse, mirroring the true layout — for any load >300ms with known shape. **Preset shapes:** `line` (one text row at the local type style's height), `block` (rect at the target's dimensions), `circle` (avatar placeholder at avatar sizes) — compose these three; free-form skeleton shapes are forbidden. Spinner (16/20px, `text.tertiary` stroke): inside controls and unknown-shape loads only. **Forbidden:** full-page spinners when layout is known; skeletons that don't match the loaded layout; more than one spinner visible per region.
**Keywords:** loading, loader, placeholder, shimmer, busy indicator

**Key rules (machine index):**
- skeleton mirrors true layout via line/block/circle presets only
- one spinner per region

---

## EmptyState

**Purpose:** Every list, table, and search MUST have one. Centered in the content area: a **line illustration** (~112×80, see below) · one-line title (16 semibold) · one-line explanation (body, `text.secondary`) · optional single action (primary if creating the first object, secondary otherwise). The illustration reserves its own vertical box with `space-4` clear beneath it to the title — it never crowds the text (the retired medallion's concentric rings overran their box and collided with the title; the illustration must not repeat that).
**Keywords:** no data, no results, zero state, blank slate, first use

**Illustration.** Follows the shared illustration language (foundations §8.1): single **1.5px-stroke** line art at scene scale, **achromatic** — **ink** `text.primary` for outlines and content lines, `border.default` grey for depth/stacked layers only, no status or brand color (including the error spot) — carrying **at least one visible neutral fill, used sparingly** (typically one element) from the light-fill tier (`bg.page`/`bg.surface` faces over `bg.sunken` recesses). A stacked/back layer may sit at a slight angle (~5–8°) for layered depth; the foreground object stays upright. ~112×84, `space-4` clear beneath. Motifs are a **closed set, one per flavor** — a new motif (for a new empty context) is added by governance, never improvised:
- **first-use** — **depicts the object being created** (per surface; new object types are added by governance, not improvised). A generic tray/box is wrong — the spot names the object. The agent-list first-use is a **new agent tile**: the registered agent glyph on a squared agent card, with a create badge (`plus` in a `bg.inverse` circle) and an empty agent slot angled behind; the glyph is the real brand path, never a substitute star.
- **no-results** — a magnifier over faint dashed result lines: the search found nothing.
- **error** — a disconnected connector (neutral, with a `bg.sunken` fill like the others): it couldn't load.
Three sanctioned flavors: first-use ("Create your first …" — KO: "첫 … 만들기"), no-results ("No matches for '{query}'" + clear-filters action), error ("Couldn't load …" + retry action).
**`compact` variant:** for small containers (Drawer sections, popovers, NotificationCenter, HoverCard bodies): no illustration, single `body-sm` `text.secondary` line + optional inline Link action, padding 16. Full-size EmptyStates inside small overlays are forbidden — use compact.
**Forbidden:** motifs outside the closed set above; illustration off the foundations §8.1 language (any status or brand color — fill or stroke, including the error spot — saturated/multi-color fills, gradients, glow, off-weight strokes, or a line-only spot with no fill); illustrations on components outside the sanctioned tier (foundations §8.1 — ChoiceCard and dense/data/chrome surfaces stay illustration-free); multi-paragraph explanations; dead-end empty states with no action when an action is possible.

**Key rules (machine index):**
- always an action when possible
- no illustrations in v1
- icon medallion: sunken circle + two concentric hairline rings; error flavor tints it danger-bg
- explanations balance-wrapped
- compact variant (one line, no icon) required inside small overlays

---

## Pagination

**Purpose:** Table/list navigation: 13px, previous/next icon-buttons + page numbers (current: `bg.selected`), plus "N of M" summary (`text.tertiary`) and optional page-size Select in dense tables. Use cursor-style "Load more" (secondary Button) for feeds. **Forbidden:** infinite scroll in data tables.
**Keywords:** pager, page numbers, load more, paging, next previous

---

## CommandPalette

**Purpose:** universal keyboard-first entry point for navigation, actions, and asking the agent. Opened with ⌘K / Ctrl+K from anywhere; also via the topbar search affordance.
**Keywords:** command, cmdk, omnibox, quick switcher, global search, shortcut palette

**Anatomy:** centered overlay, 560px wide, offset 15vh from top, **opaque `bg.raised` over a `bg.scrim` backdrop** (foundations §6: overlays are opaque, not glass; the scrim gives separation on the light app; esc / scrim-click / click-away dismiss), radius `lg`, `border.default` hairline, `shadow.xl`. Search input (borderless, 16px, full-width, leading search icon) · result list (max 8 visible, then scroll) · footer strip (11px `text.tertiary` keyboard hints using `.sy-kbd`).
**Results:** grouped under 11px medium `text.tertiary` group labels (Recent / Navigation / Actions / Agents). Rows: height 40px, 16px leading icon, 13px label, trailing `.sy-kbd` shortcut or `text.tertiary` context; selected row `bg.selected`. Actions that invoke AI carry the squared agent glyph.
**States:** empty query → recent items; no results → single EmptyState-style row plus the mandatory final fallback row **"Ask agent: '{query}'"** (`ai.fg` text + squared glyph) — the palette never dead-ends; loading → 3 skeleton rows.
**Behavior:** full keyboard (arrows, Enter, Esc, ⌘K toggles); type-ahead filters instantly (<50ms local, async results appended under their group); executing closes the palette; focus returns to the invoking context on close.
**Forbidden:** more than one palette; palette as a form container; mouse-only affordances; fuzzy-match results without highlighting the matched substring.
**A11y:** full keyboard — arrows, Enter, Esc, ⌘K toggles; esc / scrim-click / click-away dismiss; focus returns to the invoking context on close.
**Bilingual:** matching must work across both locales' labels and reasonable romanization of Hangul; group labels localize; result rows never truncate the label (truncate the trailing context instead).

**Key rules (machine index):**
- never dead-ends — final row is 'Ask agent: {query}'
- opaque bg.raised panel over a bg.scrim backdrop, radius lg, border.default hairline, shadow.xl — NOT glass (corrected 2026-08-03: this entry still said 'glass material, SCRIMLESS' after the glass→opaque reversal; backdrop-filter is forbidden by SY015 and glass is on the design.md §8 never-list)
- 560 wide, offset 15vh from top; esc / scrim-click / click-away dismiss
- grouped results, kbd hints, match highlighting
- z.dropdown

---

## ProgressBar

**Purpose:** progress of long-running work (agent runs, imports, batch jobs). See `ai-patterns.md` §11 for when it is mandatory.
**Keywords:** progress, meter, loading bar, percent, determinate, usage

**Anatomy:** 4px track (`bg.sunken`, radius `full`) + fill (radius `full`). Optional label row above: 13px description left, "N of M" or percent right (`text.tertiary`, tabular-nums).
**Variants:** `default` (fill `meter.fill` — neutral mid-gray, user-initiated work; changed from key-black), `ai` (fill `ai.solid` — agent runs;, was accent-bg). **Determinate** fill animates width at `base` duration; **indeterminate** shows a 30%-width segment sweeping at 1.2s intervals.
**States:** in-progress, success (fill switches to `status.success-bg-solid` for one `slow` beat, then the bar is replaced by its completion state), failed (fill `status.danger-bg-solid`, bar persists with error text below), cancelled (fill `border.strong`).
**Usage-meter jurisdiction:** plan/token/quota consumption is the sanctioned "capacity" use of ProgressBar — determinate, `meter.fill`, switching to `status.warning-bg-solid` at ≥80% and `status.danger-bg-solid` at 100% (with the plan-limit Banner escalation). Lives in settings/billing surfaces and MAY appear as a compact bar adjacent to the Composer when a limit is near; NEVER as permanent navigation chrome. Values tabular-nums ("1.2M / 2M tokens").
**Forbidden:** heights other than 4px; percent text without a known denominator; static "score" displays (compose a stat Card instead — quota consumption is the one sanctioned capacity meter); more than one indeterminate bar per region.

**Key rules (machine index):**
- determinate needs a real denominator
- failed persists red; cancelled = border.strong
- never a bare spinner >10s

---

## Composer

**Purpose:** the message/instruction input for Console and inline ask-agent surfaces — the single most-used control in AgentOS. (Added.)
**Keywords:** message input, chat input, prompt, send box, chat box, instruction input

**Anatomy:** container (**`bg.page` fill + 1px `border.default`** — a light outlined tray, radius `md`, **uniform 12px inset — `space-3`**, focus ring on the container). **Alpha ring (2026-08-03).** The tray carries a **4px zero-blur ring in `bg.hover`** outside its hairline — literally an alpha value (`rgba(9,9,11,0.04)` light, `rgba(255,255,255,0.06)` dark), so it inverts by mode without a per-mode pair. Zero-blur token rings are the sanctioned SY009 exemption, so this needs no raw shadow and no new token. It reads as a soft halo lifting the composer off the page without the weight of an elevation shadow.

**Radius and control size (2026-08-03).** The tray takes **`lg` (16)** in its grown state — `xl` (20) would sit closer to the reference designs but `foundations.md` §5 reserves it for section shells, so `lg` is the ceiling for this container. The composer row uses **`md` (36) icon-buttons** rather than `sm` (32): the extra height is what lets the single-line state read as a pill rather than a thin lozenge, without disturbing the 12px inset. A fused panel follows the tray to `lg` on its top corners (flush nesting shares the parent radius exactly).

**Surface model — inverted 2026-08-03.** The tray is the **light** container and the draft-owned panel above the input carries the tint; it used to be the reverse (`bg.sunken` across the whole tray). Tinting the tray put the tint *under the text*, which is what made the input read cramped at every padding value we tried — the fix was the surface, not the inset. Consequence: the chip override that forced attachment Chips to `bg.page` is retired, since Chip's own outlined-at-rest treatment now reads correctly against a light tray.

**Anatomy (2026-08-03, settled).** The tray holds the **input row only** — circular leading `+` · textarea · mic · circular send — and the **agent picker, capability toggle and model selector sit in a footer row below the container**, on the page.

*The footer was briefly removed earlier the same day and is restored: the removal had left the real composers out of step with the reference arrangement, and — because the removal pass matched only the `.cmp-footer` class — the comparison story kept its footer while the real composers lost theirs. Two renderings of one component diverged silently for several commits. The footer is the settled anatomy.*

**Shape morph.** The tray is a **pill (`radius.full`)** only while its content occupies **a single line**; past that it is a rounded rectangle at **`lg` (16)** with **the same radius on all four corners** — the rect never takes asymmetric corners. It also takes the rect when **any attachment, chip or quote is present**, regardless of line count. The pill only reads as a pill because the footer sits *below* the tray: with the controls inside, a single-line composer would still be two rows and `radius.full` would read as a lozenge.

**⚠ Two rules remain homeless. Recorded, not silently dropped:**

1. **§24's refine-prompt has no trigger.** The `pen-line` ghost icon-button at the input's top-right was removed, so the whole affordance — closed preset menu, reviewable rewrite, Undo Toast — is unreachable until it gets a new entry point. **Open.**
2. **Capability state is silent, which the spec forbids in those words.** The `+` deviation dot was removed. The rule read "capability state is never silent"; a tool toggle differing from the agent default now has no visible marker. Either the rule is withdrawn or the indicator returns in another form. **Open.** *(Note the capability toggle in the footer is a different thing — it shows one named capability, not deviation from the agent's defaults.)*

**How single-line is determined.** Where the tray holds a **textarea**, the *text* decides: the field's own empty-state height is the one-row baseline, so the flip happens on the first **wrap**, not the first keystroke. Control height is deliberately excluded — a 36px button beside an empty field is still one line of text. Where the tray holds **static content** (the ghost-text, recording-bar, slot-chip and slash-completion demos), its content height is measured in line units. *Corrected 2026-08-03: those four were briefly marked single-row by hand, which was wrong — the slot-chip case is genuinely two lines (prompt + caption) and was being forced into a pill. Measurement replaced the assumption.*

**⚠ Three rules are now homeless or contradicted. Recorded, not silently dropped:**

1. **The agent picker and model selector have no home.** Both are specified anatomy — §4 rules that the model selector sits "beside the agent picker" in the trailing group, and that switching agents resets it. With the footer gone, neither control exists in the composer. Either they move to another surface (a topbar or a per-conversation header) or §4's placement rulings need rewriting. **Open.**
2. **§24's refine-prompt has no trigger.** The `pen-line` ghost icon-button at the input's top-right was removed. The whole §24 affordance — the closed preset menu, the reviewable rewrite, the Undo Toast — is unreachable until it gets a new entry point. **Open.**
3. **Capability state is now silent, which the spec forbids in those words.** The `+` deviation dot was removed. The rule read "capability state is never silent" — a tool toggle differing from the agent default now has no visible marker. Either the rule is withdrawn or the indicator returns in another form. **Open.**

**The leading `+`** takes a very light resting fill (`bg.sunken`) with `icon.secondary`, and **hover darkens the glyph** rather than the fill — reversing the 2026-08-03 ghost treatment at June's request. The affordance stays visible at rest and the hover feedback lands on the icon.

**Draft-owned content sits ON the tray surface — no tint, no hairline (2026-08-03).** Attachments, the ComposerQuote bar and knowledge/source pickers stack directly above the input row with nothing separating them. They are part of the message being composed, so they need no separating device: the tray is **one surface**. *This reverses the fused-tinted-panel treatment introduced earlier the same day — the tint and hairline were drawing a boundary that should not exist, and the flush-nesting radius argument for the panel's top corners now applies to nothing, so it is gone rather than left as a rule with no subject.* `FollowUpPanel` still detaches 8px above the tray for the unchanged reason: a suggestion is **not** part of the draft, so it must not read as part of the input.

**The input textarea is `display: block` — required, not cosmetic (2026-08-03).** A textarea is **inline-level** by default, so the `position:relative` wrapper that anchors it measures the field *plus a ~4–5px baseline/descender gap beneath it*. The wrapper ends up taller than its content with the text pinned to its top, so however the row aligns that wrapper the text sits above true centre. `display: block` removes the phantom space and the wrapper becomes exactly the field's height. *Four earlier passes chased this symptom — splitting alignment from radius, unifying the row's control heights, adding `rows="1"`, and a 1px optical nudge. The first three were real defects; the nudge was compensating for this gap and was removed with the fix, since it would otherwise push the text a pixel low.*

**Spacing between draft-owned content and the input row is 12px** (`space-3`, raised from 8px). With no tint or hairline separating the two regions, spacing is the *only* device distinguishing them, so it has to carry more than it did when a boundary was drawn. It matches the tray inset.

**Row alignment and tray radius answer different questions.** Alignment depends on the **text alone** — one line centres against the controls, multiple lines bottom-align so the last line meets them. Radius depends on the text **and** whether draft content is present. *Conflating them (2026-08-03) meant a composer with one line of text plus an attachment lost the centred alignment along with the pill, so a 22px line bottom-aligned against 36px controls and read as sitting too low.*

*Stated here as of 2026-08-03; it had never been authored, only inferrable from ComposerQuote's concentric parenthetical, and the 4px that produced made this the tightest container in the system while being the only one holding text. 12 matches `control-padding-x-md` and the header inset of every other text container (ProposalCard, ConversationSummary). **The concentric-corner rule does not bind:** `foundations.md` §5 exempts elements "inset ≥ the outer radius", and 12 equals the tray's `md` radius, so children clear the corner region and take the radius that suits them — ComposerQuote stays `sm`, its nested-element tier. (An intermediate pass set 8px on the mistaken reading that 12 would force an inner radius of 0; that applied the rule outside its stated domain.) **One inset governs every child** so text and the leading `+` button share one left edge; children add no horizontal padding of their own — the textarea's 40px right padding to clear the refine button is the one exception.* · optional ComposerQuote bar (ai-patterns §18: ai.surface, radius `sm`, single line + ×, max one) · attachment rows above the text area (**grouped by kind: image tiles on one row, document chips on the row below — chronological within a kind, a row disappears when empty; mixed heights in one row read ragged, and attachments are a set, not a sequence**) (input Chips; remove per chip; **image attachments render as 48px thumb tiles instead — radius `xs`, hairline, compact 16px × overlay (the compact-dismiss family), filename in the tooltip. Images are the one attachment type where the thumbnail IS the identity; document attachments stay text chips, and ContextCard's no-thumbnail rule is untouched —**) · auto-growing textarea (1→8 rows, then internal scroll; placeholder per content rules, `text.placeholder`) · **contextual refine-prompt:** an `pen-line` `ghost` icon-button floating at the input's top-right (textarea gains 40px right padding), rendered ONLY while the draft is non-empty — an empty prompt has nothing to refine (§24), so the affordance earns its pixels instead of idling in the footer · footer row (anatomy): leading **+ composer-menu icon-button** (`plus` — menu: 파일 첨부, 템플릿 라이브러리… §23, 도구 → switch popover; replaces the paperclip + ⋯ pair — the tray itself remains the drop target per the dropzone pattern) + agent/scope picker (`ghost` button, **compact 8px side padding: labeled ghost controls inside the tray (agent + model pickers) drop from the 12px control default; the avatar and chevron already carry visual mass, so default padding reads detached**: squared agent Avatar 20 + name + chevron; its menu: search row on top, `micro-label` groups, per-row squared avatars + optional `neutral` Badge, one "모든 에이전트" submenu, and a mandatory footer escape row "에이전트 요청" — the picker never dead-ends; the in-picker model rows were pulled out (maintainer reversal): model is a sibling Composer control and agent rows carry NO model captions — one object per menu); trailing side: **model selector** (repositioned to the trailing group, where the kbd hint sat — mono model name + chevron; menu = provider groups under `micro-label` headers (Anthropic / OpenAI / Google …), single-line rows with the model name in mono 12 + trailing check on the active row, separator, 자동/에이전트-기본값 row; **model names are real product nouns: English, mono, never translated, never truncated; provider headers are plain text — brand logos stay in connector contexts, a menu group header is not one**; per-conversation, defaults from agent config, org policy MAY lock it read-only; never changes permissions, tools, or approval rules) + **mic** (§26 — send-adjacent: dictation fills the message you are about to send; NEVER inside the + menu) + **send** (**`brand`** icon-only circle, arrow-up — a sanctioned icon-only exception unique to Composer;: **`primary`/black** (reallocated 2026-08-03 — send does not carry the accent; see `design.md` §3.7). The circular shape is now a **bookend pair**: the row's **leading `+`** is circular too (2026-08-03), because circularity marks the two ends bracketing the input rather than one control. The leading one is **tonal** (`action.secondary-bg`) so it reads as an affordance rather than a second CTA against the black send; the **mic between them stays a bare ghost square**, which is what keeps the pair legible as a pair rather than a row of circles. The **azure accent moved to the capability toggle** in the footer (`action.brand-bg-subtle` fill + `action.brand-fg-on-page` label, 5.25:1 light / 7.06:1 dark), where an easily-missed state change earns the colour more than the screen's most predictable button does *(corrected 2026-08-03: this read "the graphite point color", stale since the 2026-07-30 re-hue — `brand` resolves to azure, while `brand.point` stayed graphite, so the prose named one token and described another. A near-black send is `primary`, which is reserved for operational agent actions.)* — it is the screen's one brand accent; the send↔stop morph swaps brand→`secondary` for stop). The ⏎/⇧⏎ kbd hint caption is REMOVED from the footer (behavior unchanged; shortcuts teach via tooltip/onboarding, not permanent chrome). One visible leading icon is the new default; five stays the hard cap. ** input-pattern adoptions:** + button carries a 6px `icon.primary` deviation dot (top/right −2px, notification-overlay family) whenever tool toggles differ from the agent's defaults — capability state is never silent; placeholder gains the slash hint variant ("… · / 명령") — an undiscoverable trigger is an anti-pattern; attachments MAY carry the §28 advisory caption; zero-state starters per §27 render above the tray; ghost-text continuations per §30.

**Send ↔ Stop morph:** while the agent is generating, the send button becomes **stop** (square icon, `secondary` tonal) in the same position — never a second button, never disabled. The composer input itself is NEVER disabled during generation (ai-patterns §2): typing continues; Enter queues or interrupts per product setting.
**Slash commands:** `/` at the start of an empty Composer scopes the command palette to agent actions; while typing, the remainder of the single best match renders as `text.placeholder` ghost text, accepted with → (never Tab — IME conflict) and dismissed by typing on. Commands come only from the closed action glossary; free text never triggers completion.
**Keyboard:** Enter sends, Shift+Enter breaks line — and **Enter during IME composition NEVER sends** (Korean/Japanese input composes via Enter; sending mid-composition is the classic KO input bug). Kbd hint (`micro`, `text.tertiary`) below on focus, first-run only.
**States:** default, focus (ring on container), generating (stop morph), send-failed (inline `caption` `status.danger` error + retry text button above; draft preserved), empty (send disabled is the ONE sanctioned disable — nothing to send).
**Drafts:** content persists per conversation across navigation; never silently discarded.
**Forbidden:** disabling the composer during generation; toolbar clutter (formatting buttons — agent input is plain text + attachments); more than one Composer per screen; placeholder carrying instructions that vanish on focus (use the kbd hint).

**A11y:** Enter sends, Shift+Enter breaks the line, and Enter during IME composition NEVER sends (Korean/Japanese compose via Enter); ghost completion accepts with →, never Tab, and is suppressed during Hangul composition; never disabled during generation (empty-send is the one sanctioned disable).
**Key rules (machine index):**
- never disabled during generation (empty-send is the one sanctioned disable)
- SHAPE MORPH: pill (radius.full) ONLY while content occupies a single line; past that a rounded rect at lg (16) with THE SAME RADIUS ON ALL FOUR CORNERS — the rect never takes asymmetric corners. Any attachment, chip or quote forces the rect regardless of line count
- HOW SINGLE-LINE IS DETERMINED: where the tray holds a TEXTAREA the text decides — the field's own empty-state height is the one-row baseline, so the flip is on the first WRAP not the first keystroke, and control height is deliberately excluded (a 36px button beside an empty field is still one line of text). Where the tray holds STATIC content, its content height is measured in LINE UNITS. Corrected 2026-08-03: four static demos were briefly marked single-row by hand, which was wrong — the slot-chip case is genuinely two lines (prompt + caption) and was forced into a pill
- ANATOMY (settled 2026-08-03): the tray holds the INPUT ROW ONLY — circular leading + / textarea / mic / circular send — and the agent picker, capability toggle and model selector sit in a FOOTER ROW BELOW the container. The footer was briefly removed the same day and restored: the removal matched only the .cmp-footer class, so the comparison story kept its footer while the real composers lost theirs and the two renderings diverged silently for several commits
- TWO RULES REMAIN HOMELESS, recorded as OPEN not dropped: (1) §24 refine-prompt has no trigger, so the preset menu / reviewable rewrite / Undo Toast are unreachable; (2) the + deviation dot was removed so capability state is SILENT, which the spec forbids in those words. The footer capability toggle is a DIFFERENT thing — one named capability, not deviation from the agent's defaults
- MORPH CONDITIONS (both required for the pill): exactly one text row AND no fused panel — an attachment or quote makes the tray two regions so it takes lg regardless of line count. The morph fires on the first WRAP, not the first keystroke: detection compares the field's own empty-state height, not a computed line-height
- this AMENDS foundations §5, which assigned the tray a flat md — the Composer tray is now the only container in the system whose radius depends on its content
- the composer row has a CIRCULAR BOOKEND PAIR: leading + (tonal, action.secondary-bg) and trailing send (primary/black). The mic between them stays a bare ghost SQUARE — that is what keeps the pair legible as a pair rather than a row of circles
- send is PRIMARY/BLACK — the accent was REALLOCATED 2026-08-03 (design.md §3.7): the most predictable control on the screen does not need an accent to be found, so the azure brand accent moved onto AI-CAPABILITY markers (the palette Ask-agent escape hatch, and the Composer capability toggle whose state changes what the agent can do). Send keeps its circular icon-only exception. A brand-coloured send is now WRONG; operational agent actions and send are both primary, which removes send as an exception
- capability toggle ON uses action.brand-bg-subtle (azure.100 light / azure.900 dark, a token ADDED 2026-08-03) with action.brand-fg-on-page — 5.25:1 light, 7.06:1 dark, gated by a new SY-contrast pair
- tray carries a 4px ZERO-BLUR ring in bg.hover outside its hairline — literally an alpha value (rgba(9,9,11,0.04) light / rgba(255,255,255,0.06) dark) so it inverts by mode with no per-mode pair; zero-blur token rings are the sanctioned SY009 exemption, so no raw shadow and no new token
- tray radius is lg (16) in the grown state — xl (20) is closer to reference designs but foundations §5 reserves it for section shells; the composer row uses md (36) icon-buttons not sm (32), which is what lets the single-line state read as a pill rather than a thin lozenge without disturbing the 12px inset; a fused panel follows the tray to lg on its top corners
- SURFACE MODEL inverted 2026-08-03: the tray is the LIGHT container (bg.page + 1px border.default) and the draft-owned panel above the input carries the bg.sunken tint — it used to be sunken across the whole tray, which put the tint UNDER THE TEXT and is what made the input read cramped at every padding value. The chip bg.page override is retired since Chip reads correctly on a light tray
- DRAFT-OWNED CONTENT SITS ON THE TRAY SURFACE — no tint, no hairline (2026-08-03, reversing the fused-tinted panel from earlier the same day): attachments, ComposerQuote and knowledge/source pickers stack directly above the input row with nothing separating them, because they ARE part of the message and the tray is ONE surface. The flush-nesting radius argument for the panel top corners now applies to nothing and is gone. FollowUpPanel still detaches 8px above for the unchanged reason — a suggestion is NOT part of the draft. Attachments still force the rect radius
- the input textarea MUST be display: block — a textarea is INLINE-LEVEL by default, so the position:relative wrapper anchoring it measures the field PLUS a ~4-5px baseline/descender gap beneath, leaving the wrapper taller than its content with the text pinned to its top, so the text sits above true centre however the row aligns. display: block removes the phantom space. Four earlier passes chased the symptom (alignment flag, control heights, rows=1, a 1px optical nudge); the nudge was compensating for this gap and was removed with the fix
- spacing between draft-owned content and the input row is 12px (space-3, raised from 8px): with no tint or hairline separating the regions, spacing is the ONLY device distinguishing them, so it carries more than when a boundary was drawn; matches the tray inset
- ROW ALIGNMENT AND TRAY RADIUS ANSWER DIFFERENT QUESTIONS: alignment depends on the TEXT ALONE (one line centres against the controls, multiple lines bottom-align so the last line meets them); radius depends on the text AND whether draft content is present. Conflating them meant one line of text plus an attachment lost the centred alignment along with the pill, so a 22px line bottom-aligned against 36px controls and read as sitting too low
- tray inset is a UNIFORM 12px (space-3), stated 2026-08-03 — it had never been authored, only inferrable from ComposerQuote's concentric note, and the 4px that produced made this the tightest container in the system while being the only one holding text. 12 matches control-padding-x-md and the header inset of ProposalCard and ConversationSummary. The CONCENTRIC RULE DOES NOT BIND: foundations §5 exempts elements inset >= the outer radius, and 12 == the tray's md radius, so children clear the corner region and take the radius that suits them (ComposerQuote stays sm). ONE inset governs every child; children add no horizontal padding of their own
- send↔stop morph in place
- ComposerQuote bar: ai.surface radius-xs, max 1/send; the follow-up panel anchors above the tray — see the FollowUpPanel entry, which owns its anatomy (relocated 2026-08-03)
- slash commands: / scopes palette to agent actions; ghost completion accepted with →, never Tab; closed glossary only
- templates: / = expert quick-insert; bookmark opens the Template Library Modal — anatomy is in ai-patterns.md §23 and is NOT restated here. KNOWN DEBT (2026-08-03): §23 carries ~1,900 words of pure component anatomy (pane widths, padding, star-toggle states) that belongs in components.md; until it is relocated, the manifest cannot source it, and SY021 will flag any attempt to restate it in this entry. Slot chips and the unfilled-slot send block are also §23
- authoring coach: max one non-blocking quality hint; the `pen-line` icon opens the CLOSED refinement-preset menu (다듬기/자세히/간결/범위/형식 ), rewrite replaces draft w/ Undo, disabled on empty
- voice = dictation only ( §26): tray morphs to recording bar (cancel / pulsing danger dot + timer / pause / primary check confirm); transcript inserts at caret, NEVER auto-sends; no audio in thread
- agent-picker menu: search + grouped rows + one submenu + mandatory request-footer escape (no model rows — reversed)
- model selector (trailing): menu grouped by provider under micro-label headers, real product names in mono, 자동 row = agent default; per-conversation, defaults from agent, lockable; never changes permissions/approval
- tools popover (plug): per-conversation capability switches; disabled tool → agent asks; enabling never bypasses ProposalCard
- composer footer: leading = + menu (첨부/템플릿/도구) + agent picker; trailing = model + mic (send-adjacent, never in + menu) + send; kbd hint removed; refine-prompt = contextual pen at input top-right, rendered only with a non-empty draft; 1 visible leading icon default, 5 hard cap
- input-pattern laws: starters = zero-state only, insert never send, dismissible; chip label IS the query; selection pill = 답장/설명/재생성 closed set, thread append-only; attachment captions advisory-only; batch = per-item queue, one failure never aborts, ProposalCard still gates; ghost text → accepts never Tab, suppressed during Hangul composition
- Enter sends, Shift+Enter breaks, Enter during IME composition NEVER sends
- attachments as input Chips; agent/scope picker ghost
- drafts persist; no formatting toolbar; one per screen

---

## ResponseToolbar

**Purpose:** actions on an agent message: copy · regenerate · feedback (thumbs) · overflow. (Added.)
**Keywords:** message actions, feedback, thumbs, copy, regenerate toolbar

**Anatomy:** row of `ghost` icon-buttons (16px icons), bottom-left of the agent message, `text.tertiary` at rest. Order fixed: copy, regenerate, thumbs-up, thumbs-down, ⋯ overflow.
**`media` variant — RETIRED 2026-08-03.** A media-only reply used to carry a vertical rail beside the fan. It now uses the **standard toolbar in its standard place**: a horizontal row of `ghost` icon-buttons below the MediaGroup, exactly as a text reply places it below the prose (see the Console sample).

**Why it went.** The rule it replaced was conditional — rail *only* when media was the sole content, message-level toolbar the moment any text appeared. Two problems. First, it made the feedback surface **move depending on the reply's content type**, so a user who learned "actions live at the bottom-left" found them rotated onto the right edge in some replies and not others; a learned position is worth more than a tidier anchor. Second, it required the renderer to know whether text accompanied the media before choosing a treatment, and a conditional that depends on sibling content is exactly the kind that drifts. The original rationale — "two feedback surfaces on one message is redundant" — is preserved and better served: there is now one surface, in one place, always.

**Placement:** hover/focus-reveal on desktop focus surfaces; persistent in dense consoles (hover-dependent affordances need persistent fallbacks there).
**Behavior:** copy copies the markdown source (Toast confirms); regenerate only on the latest agent message (earlier messages drop it); thumbs select-state = `bg.selected` fill at the button's standard radius + `text.primary` stroke (was `border.focus` blue + circle, a relic violating two later laws: blue is reserved for focus/links/status.info, and selection reads as fill + ink, not shape — circular controls are the closed set of three named under Button — the Composer bookend pair and the AssistantPanel launcher; a thumbs button is not among them) (NEVER a filled icon — stroke set only; the favorite star is the sole fill-on-active exception), mutually exclusive, tappable to undo. **Optical centering (numeral-nudge family):** the thumbs glyphs carry asymmetric ink (up is right-heavy, down left-heavy — ~1.5px off geometric center in a 16px render); both get a ∓1px translateX so ink centers inside any visible fill. Applies wherever the thumbs pair renders — since 2026-08-03 that is the message toolbar only, the media rail having been retired; thumbs-down MAY open a one-field comment Popover ("What went wrong?" / "어떤 점이 아쉬웠나요?"), never required.
**Jurisdiction:** agent messages only — never on human bubbles, never on ProposalCards (those have their own footer).
**Feedback completeness:** a registered thumb or comment gives a quiet acknowledgment (the select-state persists; a Toast confirms a submitted comment); feedback is never forced (no rating modal gates the next turn) and the affordance appears only after the answer settles, never on streaming tokens (`ai-patterns.md` §35).
**States:** rest `text.tertiary` · hover/focus-revealed (persistent in dense consoles) · thumbs selected = `bg.selected` fill + `text.primary` stroke, mutually exclusive, tappable to undo · appears only after the answer settles, never on streaming tokens.
**Forbidden:** destructive actions in the toolbar; share/export actions outside the ⋯ overflow; feedback icons anywhere except here.

**Key rules (machine index):**
- agent messages only; fixed order
- hover-reveal default, persistent where hover is unreliable
- regenerate on latest message only — creates variant N+1, never destroys; answer header carries the ‹n/N› pager ( §22)
- thumbs selected = stroke + bg.selected circle, never filled icons
- no destructive actions
- media variant RETIRED 2026-08-03: a media-only reply now takes the STANDARD toolbar in its standard place, a horizontal row below the MediaGroup — same as a text reply places it below the prose. The old rule was conditional (rail only when media was the sole content) which moved the feedback surface depending on the reply's content type and made the renderer inspect sibling content to choose a treatment. One surface, one place, always

---

## AgentStep

**Purpose:** one row of visible agent work (a reasoning step or tool call). Full behavior: `ai-patterns.md` §3–4.
**Keywords:** tool call, step, run step, activity row, working log

**Anatomy:** 12px state indicator · 13px verb-first summary · optional mono tool identifier · optional duration (`text.tertiary`, tabular-nums) · optional trailing Retry ghost button (failed only). Row height 28px; expanded detail renders `.sy-code-block` below the row, indented to the text edge.
**States (closed):** the **nine-state superset in `ai-patterns.md` §3** is the single source — `pending`, `queued`, `running`, `awaiting-input`, `partial`, `success`, `failed`, `cancelled`, `skipped`. That table also carries the *reachability* column: a thread step is never `queued`, a batch item never `skipped`. Consolidated 2026-08-03 from three incompatible copies (this entry's five, RunLog's five different ones, and the manifest's false claim that they matched). A step list collapses to a summary row on completion ("5 steps · 12s", expandable).
**Forbidden:** nesting beyond one level; paragraph-length summaries; using AgentStep outside agent activity (it is not a generic checklist — compose Checkbox lists for that); animating state transitions beyond the indicator swap.
**A11y:** the list is `role="log"` with `aria-live="polite"` **when it is the announcing surface — i.e. standalone (RunLog, Workbench run views). Inside a Thread the step list does NOT declare its own live region** (clarified 2026-08-03): the Thread already owns one, and a nested live region double-announces every step. State changes announce as text, not sound.

**Key rules (machine index):**
- closed states are the NINE-STATE SUPERSET in ai-patterns §3 (single source since 2026-08-03): pending, queued, running, awaiting-input, partial, success, failed(+Retry), cancelled, skipped. §3 also carries a REACHABILITY column — a thread step is never queued, a batch item never skipped. Added 2026-08-03 to close real defects, not to add features: awaiting-input (a blocked step rendered as running forever), cancelled (specified for runs in §8 and in RunLog but not for steps, so Stop left the in-flight step stateless), partial (§10 REQUIRES partial reporting and the five-state set could not express it), queued (already in RunLog and §29). retrying was REJECTED: a retry emits a NEW step, keeping the record append-only
- collapses to '5 steps · 12s' summary on completion (the summary counts LEAVES, not groups)
- CONCURRENT fan-out (2026-08-03): when >1 step runs at once the list switches to a concurrent group — one parent row with the shared goal + a live tally, children indented one level (the single nesting level §3 allows). Children order by START TIME and NEVER reorder as they finish. The parent state is DERIVED not authored: running while any child runs, partial if some failed and some succeeded, failed only if all failed, success if all succeeded, cancelled if stopped — this is why partial had to exist. The 3-row cap applies to GROUPS, not children. Forbidden: a progress bar on the parent instead of the tally (§11 needs a real denominator per run), nesting a group inside a group, or rendering concurrent children as separate top-level steps
- tool ids in mono; payloads collapsed; max 1 nesting level
- role=log aria-live=polite
- named working line above steps while generating (pulse, no shimmer); long replies open with title + duration badge + collapse

---

## ProposalCard

**Purpose:** human-in-the-loop approval of a consequential agent action. Full behavior: `ai-patterns.md` §5.
**Keywords:** approval, human in the loop, review, consent, action request, permission

**Anatomy (tray):** borderless `ai.surface` fill, radius `md`, no shadow — the same borderless-filled language as the Composer tray; the Console's two anchor objects speak one dialect. Header row (**uniform 12px padding**: the icon reads the spacing; `ai.border` bottom hairline on the single-tone tray — maintainer reversal of the two-tone band): squared agent Avatar (24, **first in the row — with color no longer signaling AI, the avatar is the agency marker**) + agent name (13 medium) + "proposes" (`ai.fg`). Body (padding 12×16, on the tint): one-sentence action summary + payload (diff block, message preview, or affected-record list — max one payload type per card); **payload surfaces open to `bg.page`** (tray rule — this is what gives the object internal depth). Footer (padding 0 16 16): Approve (`primary`; `danger` if destructive) + Reject (`secondary` — **on-tint rendering:** in light mode the tonal gray fill is near-identical to the slate tray, so secondary opens to `bg.page` here, the tray rule applied to controls; dark mode keeps the standard fill, whose contrast holds) + optional Edit (`ghost`), directly on the tint. The forbidden formula remains tint + outline (the wireframe callout); borderless tint with page-filled internals is its opposite.
**States:** open, resolved-approved / resolved-rejected (collapses to attribution row: icon + "Approved by {user} · {time}"), expired (agent withdrew or context changed — `text.tertiary` note, actions removed).
**Forbidden:** auto-approval, approval countdowns, default-focused Approve-all in batches; more than 3 footer actions; ProposalCards for non-consequential acts (answering a question needs no approval); removing resolved proposals from the transcript.
**Bilingual:** consequence statements name count + noun in both locales; button labels never truncate.

**Key rules (machine index):**
- tray anatomy: borderless ai.surface fill, radius md, no shadow (corrected 2026-08-03 by SY021, was lg); header row + ai.border hairline (single-tone; two-tone reversed); payload surfaces open to bg.page; squared avatar FIRST in header (the agency marker); forbidden formula = tint + outline
- Approve=primary (danger if destructive; approving is a human decision, not an AI CTA), Reject=secondary (light mode: bg.page fill on the tray — tonal gray dissolves on slate; dark keeps standard fill)
- no auto-approve, no countdowns
- resolved collapses to attribution row, never deleted
- diffs: tint backgrounds + gutter markers, never color alone

---

## Thread

**Purpose:** the transcript container — the scrolling conversation region that holds Messages in order and owns scroll position, the bottom-stick contract, and catch-up affordances. Full behavior: `ai-patterns.md` §2 (the scroll and streaming contract). Conversation *history* in the Sidebar, new-thread, and temporary chat are §25 — a different surface, not this container. (Added 2026-08-03 — chat-interface gap audit: the region was specified only as `patterns.md` §1E layout bullets and rendered only in `preview.html`.)
**Keywords:** transcript, conversation, chat history, message list, scrollback

**Variants:** `default` — a single form.
**Anatomy:** the scroll container spans the full Console region (Console law: no mid-canvas scrollbar beside the message column) with a **max-width 760 message column centered inside it**, padding 24, and `space-6` between turns. Turns stack in strict chronological order; there is no grouping chrome between consecutive messages from the same actor — the avatar and bubble shape carry authorship, so a "message group" wrapper would add a third redundant signal.
**Scroll contract (§2):** stick to bottom while the user is at the bottom; the instant the user scrolls up, release the lock — never re-acquire it automatically while output streams. A released lock raises the **"Jump to latest"** affordance: a **`FloatingPill`** (`horizontal`, one action — chevron + label) at the bottom-centre of the column, dismissed by reaching the bottom. *Corrected 2026-08-03: this said "Toast surface", which was a false citation — a Toast is a transient notification (bottom-right, max 3, auto-dismiss, status icon) and this is a persistent action. It shared Toast's tokens and none of its contract.
**Append-only (provenance law):** Messages are never edited, reordered, or removed once rendered — not by a 답장 or 설명 selection action (§18), not by a whole-reply regeneration (§22's variant model adds a variant, it does not replace a turn), not by a summary (§34 renders beside the transcript, never over it). A resolved ProposalCard collapses in place; it does not leave.

> **UNRESOLVED (2026-08-03) — partial regeneration vs. append-only.** §22's *partial* regeneration rewrites a selected passage **in place** with an Undo Toast, which is an edit of a rendered Message. §18 states selection actions "NEVER mutate the original message in place — thread history is append-only". These cannot both hold. This is the same missed-propagation pattern as the §18/§22 action-count defect (`proposals/2026-08-03-chat-interface-component-gaps.md` §4.1): §18's blanket prohibition was written when the pill carried only 답장 and 설명, both non-mutating, and was not revisited when 재생성 was added. **Held for a maintainer ruling** — either partial regeneration is a named carve-out from the append-only law, or it must produce a variant rather than an in-place rewrite. Do not implement partial regeneration until this is ruled.
**States:** empty (zero turns — prompt starters per §27 render above the Composer, and the Thread region itself carries no EmptyState: the Composer is the affordance), populated, streaming (the last Message is live per §2), loading-history (Skeleton lines at the top edge while older turns page in).
**Forbidden:** more than one Thread per screen; a second scroll container nested inside it; re-acquiring the bottom lock while the user is reading above it; infinite-scroll paging of history (older turns page in via an explicit affordance — the feed cursor case, `patterns.md` §4); date/actor group headers between turns; rendering the human and agent columns as two separate scroll regions.
**A11y:** the container is `role="log"` `aria-live="polite"`, **declared once here and nowhere inside it** — not per Message, and not on the AgentStep list, which drops its own live region when nested in a Thread (see AgentStep A11y). A nested live region double-announces every step. "Jump to latest" is a real button in the tab order, not a scroll-position artifact.

**Key rules (machine index):**
- scroll container spans the full region with a max-width 760 message column centered inside it — no mid-canvas scrollbar beside the column
- stick to bottom only while the user IS at the bottom; on scroll-up release the lock and NEVER re-acquire it while streaming; a released lock raises the 'Jump to latest' affordance — a FloatingPill (horizontal, one action) at the bottom-centre of the column, dismissed by reaching the bottom. NOT a Toast: that citation was false (a Toast is a transient notification — bottom-right, max 3, auto-dismiss, status icon)
- APPEND-ONLY (provenance law): messages are never edited, reordered, or removed — 답장/설명 compose new turns, whole-reply regeneration adds a variant, a summary renders beside the transcript never over it. OPEN: §22 partial regeneration writes in place, which conflicts with this law — held for a ruling 2026-08-03
- no group headers between turns (avatar shape + bubble already carry authorship — a third signal is redundant)
- space-6 between turns, padding 24
- one Thread per screen; no nested scroll container; no infinite-scroll history paging
- empty state carries NO EmptyState — the Composer is the affordance and §27 starters render above it
- role=log aria-live=polite declared ONCE at the Thread, never per Message (nested live regions double-announce)

---

## Message

**Purpose:** one turn in a Thread — the single most-rendered object in AgentOS. Two actor forms, closed. Content rendering: `ai-patterns.md` §12; attribution: §9. (Added 2026-08-03 — chat-interface gap audit; anatomy previously existed only as `preview.html` CSS.)
**Keywords:** chat bubble, turn, reply, chat message, utterance

**Variants:** `human` · `agent` — the two actor forms, closed (anatomy below).
**Anatomy — `human`:** right-anchored bubble, `margin-left: auto`, **max-width 75% of the message column**, `bg.sunken` fill, radius `xl`, padding 8×12, `body` type. No avatar (position and fill identify the author — a right-anchored bubble in a two-actor thread needs no third marker), no timestamp at rest, no toolbar (ResponseToolbar is agent-only jurisdiction).
**Anatomy — `agent`:** full-width, **no bubble and no fill** — plain `body` text on `bg.page`, laid out as a flex row: squared agent Avatar (24, `flex:none`, the agency marker per §1) + content column (`flex:1`, `min-width:0`). Agents speak as the product; humans speak in bubbles. The asymmetry is deliberate and load-bearing: **it is the shape channel that makes authorship scannable without reading**, and it is why the human bubble's radius `xl` sits beside an agent reply with no radius at all. Do not "tidy" this into matching containers.
**Attachment order (`human`, §12):** attachments stack **above** the bubble text in fixed order — document ContextCards first, then images (bubble-aligned, radius `lg` + hairline, max-height 240; two side by side, 3+ as a 2-wide grid), then the text. Never a MediaGroup fan — rotation is generated-media only (§21).
**Content column (`agent`) — order is fixed:** working line (§20) → AgentStep list (§3) → Reasoning disclosure (§14) → AnswerHeader (§20, optional) → answer body (§12) → sources row (§6) → ProposalCard (§5) → MediaGroup (§21) → ResponseToolbar (§35) → follow-up Chips (§19). A renderer MAY omit any element; it MAY NOT reorder them. Fixed order is what lets a user learn one scan path and reuse it on every reply.
**States:** `human` — sent, send-failed (inline `caption` `status.danger` + retry, draft preserved). `agent` — streaming (§2 cursor + Stop reachable), settled, stopped (partial output + `text.tertiary` "Stopped by you" caption), failed (§10 inline error flavor + Retry), guardrail-blocked (§15 neutral notice in place of the answer body — never `status.danger`).
**Forbidden:** avatars on human messages; bubbles, fills, or borders on agent messages; ResponseToolbar or feedback affordances on human messages; timestamps on every message at rest (they belong to attribution rows and handoff events, not to the bubble); editing a sent message in place (append a new turn — Thread is append-only); a third actor form (system notices are Banners, handoffs are §16 events, neither is a Message); italics or ALL-CAPS in message content (`foundations.md` §2.3.2).
**A11y:** each Message is an `<article>` with an accessible name naming its actor ("June", "{agent name}") so a screen reader can traverse turns; the Thread owns the live region, the Message does not declare its own.
**Bilingual:** the 75% cap is proportional, so KO and EN wrap differently at the same content — verified at +25% string width per `foundations.md` §2.3. Nothing inside a Message is fixed-width.

**Key rules (machine index):**
- human = right-anchored bubble, margin-left auto, max-width 75% of the column, bg.sunken, radius xl, padding 8x12, body type — NO avatar, no timestamp at rest, no toolbar
- agent = full-width, NO bubble and NO fill: plain body text on bg.page, flex row of squared Avatar 24 + content column (flex 1, min-width 0)
- the bubble/no-bubble asymmetry is LOAD-BEARING — it is the shape channel that makes authorship scannable without reading; never tidy it into matching containers
- agent content column order is FIXED (may omit, may NOT reorder): working line → AgentStep list → Reasoning → AnswerHeader → answer body → sources row → ProposalCard → MediaGroup → ResponseToolbar → follow-up chips
- human attachments stack ABOVE the bubble text: document ContextCards first, then images (radius lg + hairline, max-height 240; 2 side by side, 3+ as a 2-wide grid), then text — never a MediaGroup fan
- states: human sent/send-failed; agent streaming/settled/stopped/failed/guardrail-blocked
- no avatars on human messages, no fills or borders on agent messages, no feedback affordances on human messages, no editing a sent message in place, no third actor form (system = Banner, handoff = §16 event)
- each Message is an <article> named for its actor; the Thread owns the live region

---

## AnswerHeader

**Purpose:** the titled opening of a substantial agent reply — names what the run produced, states how long it took, and carries the variant pager. Full behavior: `ai-patterns.md` §20, §22. (Added 2026-08-03 — chat-interface gap audit.)
**Keywords:** reply title, response header, run title, duration, collapse header

**Anatomy:** a flex row, `space-2` gaps, `space-2` top margin, inside the agent Message content column: title (`heading-sm`, taken from the run's stated goal) + total-duration Badge (`neutral` subtle, tabular numerals) + right-aligned trailing cluster (VariantPager when variants exist, then a collapse chevron as a `ghost` `sm` icon-button).
**When:** replies longer than ~4 paragraphs, or any reply produced by a multi-step run. **One header per reply** — never one per section or paragraph. A short conversational answer with a title on it reads as a document, which is the §32 artifact case, not a chat reply.
**Behavior:** the §20 named working line resolves *into* this title on completion — the same string, promoted from `body-sm` `text.secondary` pulse to `heading-sm` — so the user watches the label they were given become the heading they keep. Collapsed keeps title + duration and hides the answer body; expansion state persists in the transcript per user.
**States:** expanded · collapsed (keeps title + duration, hides the answer body); expansion state persists in the transcript per user.
**Forbidden:** more than one header per reply; a header on a reply with no title-worthy goal (an untitled answer is correct, not unfinished); `heading-md` or larger (agent text never produces page-level hierarchy, §12); a duration Badge with an invented or estimated number — actuals only (§11); auto-collapsing a reply the user has not collapsed.
**A11y:** the chevron is a real toggle with `aria-expanded` and an accessible name naming the section; the duration Badge is not a live region — it settles once.

**Key rules (machine index):**
- flex row inside the agent content column: heading-sm title (from the run's stated goal) + neutral duration Badge (tabular-nums) + right-aligned VariantPager + collapse chevron (ghost sm icon-button)
- WHEN: replies over ~4 paragraphs or produced by a multi-step run — ONE header per reply, never per section
- the §20 named working line resolves INTO this title on completion — same string, promoted from body-sm pulse to heading-sm
- collapsed keeps title + duration; expansion state persists in the transcript per user
- never heading-md or larger (agent text never produces page-level hierarchy)
- duration is an ACTUAL, never invented or estimated
- no auto-collapsing a reply the user did not collapse

---

## VariantPager

**Purpose:** non-destructive navigation between regenerations of one agent reply. Full behavior: `ai-patterns.md` §22. (Added 2026-08-03 — chat-interface gap audit.)
**Keywords:** regeneration, version switcher, alternatives, variant counter

**Anatomy:** right-aligned in the AnswerHeader — ‹ and › as `ghost` `sm` icon-buttons around a `caption` tabular-nums counter ("2/2"). Nothing else; no dots, no dropdown of versions, no labels.
**Behavior:** regenerate on the latest reply creates variant N+1 and never destroys the prior one; switching is non-destructive and instant. **Each variant keeps its own provenance and attribution** — its own SourceChips, its own uncertainty Badges, its own AgentStep record. Max 5 variants; the next regeneration replaces the **oldest unpinned** variant.
**Jurisdiction:** the latest agent reply only — the same rule that governs ResponseToolbar's regenerate. Earlier replies show no pager, because they cannot be regenerated.
**States:** arrows disable at the ends (never wrap); switching is instant and non-destructive.
**Forbidden:** destructive regeneration (overwriting the current variant); a pager on a human message or on an earlier agent reply; carrying one variant's citations onto another (a provenance break — §6 never fake a citation); more than 5 retained variants; exposing variants as a Tabs or Select control (the pager is the closed form).
**A11y:** each arrow carries an accessible name stating the destination ("Previous version, 1 of 2"); the counter is `aria-live="polite"` so switching announces; arrows disable at the ends rather than wrapping.

**Key rules (machine index):**
- ‹ › ghost sm icon-buttons around a caption tabular-nums counter ('2/2') — no dots, no version dropdown, no labels
- regenerate creates variant N+1 and NEVER destroys; switching is non-destructive
- each variant keeps its OWN provenance and attribution — its own SourceChips, uncertainty Badges, AgentStep record; carrying one variant's citations onto another is a provenance break
- max 5 variants, then the oldest UNPINNED is replaced
- latest agent reply only — earlier replies show no pager because they cannot be regenerated
- never expose variants as Tabs or a Select; the pager is the closed form
- arrows name their destination; counter is aria-live polite; arrows disable at the ends, never wrap

---

## Reasoning

**Purpose:** disclosure of an agent's working text, rendered subordinate to the answer and never as answer content. Full behavior: `ai-patterns.md` §14. (Added 2026-08-03 — chat-interface gap audit; previously specified only in `ai-patterns.md` §14 with a `preview.html` story.)
**Keywords:** thinking, chain of thought, working text, scratchpad, thoughts

**Anatomy:** collapsed by default — a 24px disclosure row: chevron (12px) + "Reasoning" / "추론 과정" (`label`, `text.tertiary`) + duration (`text.tertiary`, tabular-nums). Expanded reveals the text in `body-sm` `text.secondary` on `bg.surface`, rendered with the agent-markdown rules (§12) but **capped: no headings, no images**.
**Subordination rules (all three are structural, not stylistic):** it never uses `text.primary`; it never carries SourceChips (citations belong to claims in the *answer*); and it is excluded from copy and regenerate — the ResponseToolbar acts on the answer only.
**States:** collapsed, expanded (persists per user per conversation), running (the row renders while reasoning streams, duration counting), redacted (policy-suppressed — says so plainly: "Reasoning not available for this response" / "이 응답의 추론 과정은 제공되지 않습니다").
**Forbidden:** auto-expanding (absolutely — the answer is the deliverable, the reasoning is an offer); rendering empty when redacted; `text.primary` or any emphasis that competes with the answer; SourceChips inside it; including it in copy/regenerate scope; presenting reasoning as the answer when no answer was produced (that is a §10 failure state).
**A11y:** `aria-expanded` on the row; the expanded region is *not* a live region even while streaming — announcing working text over the answer inverts the subordination the component exists to enforce.

**Key rules (machine index):**
- collapsed by default: 24px row = chevron + 'Reasoning'/'추론 과정' (label, text.tertiary) + duration (tabular-nums)
- expanded = body-sm text.secondary on bg.surface, agent-markdown rules BUT capped: no headings, no images
- three structural subordination rules: never text.primary, never carries SourceChips (citations belong to the ANSWER), excluded from copy/regenerate
- AUTO-EXPAND IS FORBIDDEN — the answer is the deliverable, reasoning is an offer; expand state persists per user per conversation
- redacted by policy says so plainly, never renders empty
- the expanded region is NOT a live region even while streaming — announcing working text over the answer inverts the subordination

---

## FloatingPill

**Purpose:** the shared surface for a small, transient action affordance that floats over content — raised by a condition (a selection, a released scroll lock, a hovered media group) and gone when that condition ends. It is a **surface primitive, not a standalone affordance**: it owns the shell, and its consumers own the behaviour. (Added 2026-08-03 — the anatomy below was already implemented three times, identically, and declared nowhere.)
**Keywords:** floating action, transient affordance, overlay pill, jump to latest

**Why it exists.** `SelectionPill`, the `Thread` "Jump to latest" affordance, and `ResponseToolbar`'s `media` rail were byte-identical on every structural property (28px, `bg.raised-2`, 1px `border.overlay`, radius `full`, `shadow.lg`, `z.dropdown`, `0 12` padding) while being described in three places — one of them by a **false citation to Toast**, which shares the tokens and none of the behaviour (a Toast is a transient *notification*: bottom-right, max 3, auto-dismiss, status icon). Three copies of one shell is how the shell drifts. This entry is the single source; consumers reference it and never restate it.

**Anatomy (shared, `horizontal` — the default):** 28px height · padding `0 space-3` · radius `full` · `shadow.lg` · `z.dropdown` · `label-sm` type (sans 12/18 medium — never a raw font-size, `foundations.md` §2.2) · standard entrance. Multiple actions are separated by a 1px `border.default` hairline, 12px tall. Icons are 12px, from the registry.
**Surface is per-mode, deliberately (added 2026-08-03).** Dark mode takes `bg.raised-2` (`#33333A`) + a 1px `border.overlay` hairline (`#4A4A52`). **Light mode takes `glass.surface` (`#F6F8FB`) + a 1px `glass.border` hairline (`#E4E9F0`)** — the opaque faux-frost family, AppLauncher's treatment, extended here.

**Why the asymmetry.** In light mode `bg.raised-2` *is* `#FFFFFF`, the same value as `bg.page`, and `border.overlay` is **`transparent`** — so a light-mode pill was `#FFFFFF` on `#FFFFFF` (**1.00:1**) with no hairline, separated from the thread only by an 8% shadow. Dark mode had three separation channels (fill contrast, a real hairline, a 50% shadow); light had one weak one. That is a **missing channel, not a taste gap** — and it could not be closed by choosing a darker fill, because the light surface ramp jumps `#FFFFFF` → `#F4F4F6` (1.10:1) → `#33333A` (12.53:1) with nothing in between. So light mode gains the hairline it never had, plus the faintest cool tint to give the shell a material read. Per-mode divergence with a stated reason is established practice here — cf. ProposalCard's `secondary`, which opens to `bg.page` in light and keeps the standard fill in dark.

**Not glass.** `glass.surface` / `glass.border` are **opaque** tokens (`foundations.md` §6): the frost is baked in, there is no `backdrop-filter`, and SY015 still holds. Real translucency was explored and dropped, and reintroducing it needs an inverse-surface governance proposal — §19 rejected it for the follow-up panel on exactly this substrate (small, dense, over thread text).

**Rejected on the way:** an inverse (`bg.inverse-soft`) fill. It reads far too heavy for a catch-up hint at 12.53:1, and `bg.inverse-soft` is the system's *emphasis* fill (single-select Chips, the notification count) — emphasis inside a floating layer competes with the region's real primary.

**`rail` variant — REMOVED 2026-08-03, same day it was declared.** It existed for exactly one consumer, `ResponseToolbar`'s `media` rail, which was retired the same day (see that entry). A variant with no consumer is dead spec that the next reader has to evaluate and discard, so it went with its only caller rather than waiting for one. If a genuine vertical case appears, it returns through governance with that case as its justification.

**Every child is a real control.** A `FloatingPill` action is a `<button>` (or a Link where it navigates) — focusable, in the tab order, keyboard-activatable. **A pill rendered as a `<span>` is a defect**, not a shortcut: these affordances are frequently the only path to the action they carry, so a non-interactive element makes that action keyboard-unreachable.

**Placement:** anchored to whatever raised it, never to the viewport — above a selection, bottom-centre of a scroll column, beside a media group. It overlays content and **never displaces it** (no layout shift on appear, the §19 rule generalised).
**Dismissal:** it disappears when its raising condition ends — deselect, Esc, reaching the bottom, pointer-out. It is never manually closed by an × , and never persists as chrome.

**Variants:** none — FloatingPill has a single form. (`rail` was declared and removed on 2026-08-03; see above.)
**Consumers (closed — extension is governance):** `SelectionPill` (§18) and `Thread`'s "Jump to latest". *`ResponseToolbar` `media` was the third and was retired 2026-08-03.*
**States:** raised while its raising condition holds · dismissed when the condition ends (deselect, Esc, reaching the bottom, pointer-out) — never an ✕, never persists as chrome.
**Forbidden:** destructive actions (a floating affordance is too easy to hit by accident — destructive goes through Popconfirm or a Modal); more than 3 actions (past that it is a Menu); a `primary`, `brand` or `danger` fill on the pill or its children (the surface is neutral by construction — emphasis inside a floating layer competes with the region's real primary); persisting after the raising condition ends; anchoring to the viewport; carrying a status icon (that is Toast's vocabulary and invites the confusion this entry exists to end); a `<span>` or `<div>` where a control belongs; more than one pill per raising condition.
**A11y:** each action independently focusable and labelled; Esc dismisses and returns focus to the anchor; the pill's appearance is not announced (it is an affordance, not a status change) — but its actions must be reachable without a pointer, since hover-reveal alone is a keyboard trap.

**Key rules (machine index):**
- WHY IT EXISTS: this anatomy was implemented three times identically (SelectionPill, Thread's jump-to-latest, and ResponseToolbar's media rail — the last since retired) and declared nowhere — one of them citing Toast, which shares the tokens and none of the behaviour. Consumers now reference this entry and never restate it
- horizontal: 28px height, padding 0 space-3, radius full, shadow.lg, z.dropdown, label-sm type (never a raw font-size), standard entrance; multiple actions split by a 1px border.default hairline 12px tall; 12px registry icons
- SURFACE IS PER-MODE (2026-08-03): dark takes bg.raised-2 (#33333A) + 1px border.overlay (#4A4A52); LIGHT takes glass.surface (#F6F8FB) + 1px glass.border (#E4E9F0) — the OPAQUE faux-frost family, no backdrop-filter, SY015 still holds. Why: in light mode bg.raised-2 IS #FFFFFF (same as bg.page) and border.overlay is TRANSPARENT, so the pill was 1.00:1 on the page with no hairline — separated only by an 8% shadow, while dark had three separation channels. A missing channel, not a taste gap, and unfixable by a darker fill because the light ramp jumps #FFFFFF -> #F4F4F6 (1.10:1) -> #33333A (12.53:1). Per-mode divergence with a reason is established practice (cf. ProposalCard secondary). REJECTED: an inverse bg.inverse-soft fill — too heavy for a catch-up hint at 12.53:1, and it is the system emphasis fill
- EVERY CHILD IS A REAL CONTROL — a <button>, or a Link where it navigates. A pill rendered as a <span> is a DEFECT: these affordances are often the only path to the action they carry, so a non-interactive element makes it keyboard-unreachable
- anchored to whatever raised it, NEVER to the viewport; overlays content and never displaces it (no layout shift on appear — the §19 rule generalised)
- dismissed by its raising condition ending (deselect, Esc, reaching the bottom, pointer-out) — never an x, never persists as chrome
- consumers are a CLOSED set: SelectionPill (§18) and Thread's jump-to-latest. ResponseToolbar media was the third and was RETIRED 2026-08-03, which also removed the rail variant — a variant with no consumer is dead spec
- FORBIDDEN: destructive actions (too easy to hit by accident — use Popconfirm or a Modal); more than 3 actions (past that it is a Menu); primary/brand/danger fill on the pill or its children; a status icon (Toast's vocabulary, and it invites the confusion this entry ends); more than one pill per raising condition

---

## SelectionPill

**Purpose:** the floating action pill raised by selecting text inside an agent Message — the affordance that makes a passage a conversational object. Full behavior: `ai-patterns.md` §18, §22. (Added 2026-08-03 — chat-interface gap audit.)
**Keywords:** text selection, highlight menu, quote, reply actions, selection toolbar

**Anatomy:** a **`FloatingPill`** (`horizontal`) anchored above the selection — that entry owns the shell (28px, `bg.raised-2`, `border.overlay`, radius `full`, `shadow.lg`, `z.dropdown`, `label-sm`, the 1px `border.default` separators, and the real-`<button>` requirement). Restated here 2026-08-03 → referenced, so the shell has one source. SelectionPill adds only what is its own: **which** actions, and where they apply.
**Actions (closed set — three):** **답장** (reply) · **설명** (explain) · **재생성** (regenerate). *Ruling 2026-08-03: three is law; `ai-patterns.md` §22's earlier "never a third pill action" sentence was stale and is struck (`proposals/2026-08-03-chat-interface-component-gaps.md` §4.1).* Extending the set requires governance — actions come from the action glossary.
**Behavior:** 답장 inserts a ComposerQuote of the selection into the Composer (max one quote per send; quoting replaces any existing quote). 설명 composes a quoted follow-up and the explanation arrives as a **normal agent turn** in the thread. 재생성 regenerates **only the selected passage in place**, landing with a one-shot `emphasis.surface` flash and an Undo Toast (reversible-lite). While a selection is quoted, the passage takes a **bare `ai.surface` fill** at radius `xs` with **no outline** — a marker, not a badge (amended 2026-08-03; the inset `ai.border` hairline it originally carried is the forbidden tint + outline formula, and read as a Badge). `box-decoration-break: clone` gives each wrapped line its own tint box.
**Scope law:** 재생성's scope is *the selection*, never the paragraph around it. Rewrite-type actions apply only to the user's own draft (§24), never to agent output.
**Jurisdiction:** agent Messages only. Selecting text in a human bubble raises nothing — a user's own words need no reply affordance.
**States:** raised on selection in an agent Message · dismissed on deselect or Esc (never persists) · quoted passage carries a bare `ai.surface` fill at radius `xs`, no outline, `box-decoration-break: clone` per wrapped line.
**Forbidden:** a toolbar of options instead of one pill; more than one pill visible; a fourth action without governance; mutating the original Message in place for **답장 or 설명** — both compose new turns and never touch the source passage; the pill on human messages, on ProposalCards, or on Reasoning text; persisting after deselect or Esc.
**⚠ 재생성 is blocked pending a ruling.** Its "in place" write conflicts with the append-only law — see the UNRESOLVED note under `Thread`. The action stays in the closed set (that was ruled 2026-08-03); its *write semantics* are what is open.
**A11y:** the pill is keyboard-reachable from the selection, each action independently focusable and labeled; Esc dismisses and returns focus to the selection anchor.

**Key rules (machine index):**
- surface is a FloatingPill (horizontal) — that entry owns the shell (28px, bg.raised-2, border.overlay, radius full, shadow.lg, z.dropdown, label-sm, the 1px border.default separators, the real-<button> requirement); anchored above the selection. SelectionPill adds only WHICH actions and where they apply
- closed set is THREE actions: 답장 · 설명 · 재생성 (ruling 2026-08-03 — ai-patterns §22's 'never a third pill action' was stale and is struck; a closed set with two definitions is not closed)
- 답장 inserts a ComposerQuote (max 1 per send, quoting replaces any existing quote); 설명 composes a quoted follow-up answered as a NORMAL agent turn — neither mutates the source. 재생성 is IN THE CLOSED SET but its write semantics are UNRESOLVED as of 2026-08-03: an in-place passage rewrite contradicts the append-only law, held for a maintainer ruling — do not implement it yet
- quoted passage takes a BARE ai.surface fill at radius xs — NO outline (tint + outline is the forbidden wireframe formula and read as a Badge; amended 2026-08-03), box-decoration-break: clone per wrapped line; ai.* not emphasis.* since §1 bars emphasis tokens from AI surfaces
- scope law: 재생성 scopes to the SELECTION, never the surrounding paragraph; rewrite-type actions apply only to the user's OWN draft (§24), never to agent output
- agent Messages only — selecting a human bubble raises nothing
- no toolbar of options, no second pill, no fourth action without governance, never persists past deselect or Esc

---

## FollowUpPanel

**Purpose:** the anchored panel of suggested next turns that MAY open above a focused Composer — the active counterpart to passive suggestion Chips. Full behavior and ordering law: `ai-patterns.md` §19. (Added 2026-08-03 — chat-interface gap audit; **anatomy relocated here from `ai-patterns.md` §19**, which retains the behavior rules.)
**Keywords:** suggestions, follow ups, next steps, prompt suggestions, suggestion panel

**Anatomy:** a **solid `bg.raised` panel** — explicitly NOT glass: it is small, dense, and sits over thread text where translucency reads muddy (`foundations.md` §6) — with a `border.default` hairline, `shadow.lg`, radius `md`, 6px padding. Rows are 32px at radius `xs`, leading with the 12px follow-up arrow; a full-bleed keyboard header row carries keycaps (↑↓ 이동 · ↵ 선택 · esc 닫기). Row hover/selected = `bg.selected`.
**Placement — and why this panel does NOT fuse.** The Composer fuses *draft-owned* content flush to its tray (attachments, quote, knowledge pickers) because that content is part of the message. A suggestion is not part of the draft yet, so it must not read as part of the input — hence this panel is absolutely anchored **8px above the Composer's top edge** — a floating layer detaches from its anchor, and flush contact would read as part of the input; anchored menus use 4px, the panel's larger mass earns 8. It **overlays** the last thread messages and never pushes content down (layout shift on open is forbidden).
**Grouping (§19 refine vs pivot):** **refine** rows (zoom in on the current answer) sit above **pivot** rows (zoom out to a related next step), split by the standard full-bleed divider. When both kinds are present each group MAY carry a `micro-label` header ("더 자세히" / "다음 단계"). Rows stay ranked within a group; **max 4 rows total**.
**Chip honesty (adopted law):** a row's visible label **is** the query it sends. If the real query needs more words than the row can show, it inserts into the Composer for editing instead of sending. Selecting a row inserts into the Composer — **never auto-sends**.
**Mutual exclusion:** suggestion Chips and the panel never render simultaneously; the panel never renders in the zero state (prompt starters own the empty conversation, §27, and hand off at the first turn).
**States:** row hover/selected `bg.selected` · opens only above a focused Composer, never in the zero state · esc closes.
**Forbidden:** glass or `backdrop-filter` (SY015); more than 4 rows; auto-sending on selection; pushing thread content down; a per-row rationale line (it would break chip honesty — the label is the query, and grouping is how the panel signals *why* a row is offered); rendering alongside Chips or in the zero state.
**A11y:** `role="listbox"` with ↑↓ traversal and ↵ selection; the keycap header is decorative (`aria-hidden`) — the shortcuts are real key handlers, not a rendered legend doing the work.

**Key rules (machine index):**
- SOLID bg.raised panel — explicitly NOT glass (small, dense, over thread text where translucency reads muddy; foundations §6; backdrop-filter forbidden by SY015) — border.default hairline, shadow.lg, radius md, 6px padding
- 32px rows at radius xs leading with the 12px follow-up arrow; full-bleed keycap header row (↑↓ 이동 · ↵ 선택 · esc 닫기); row hover/selected = bg.selected
- anchored 8px above the Composer's top edge (anchored menus use 4px; the panel's larger mass earns 8) and OVERLAYS thread messages — never pushes content down, layout shift on open is forbidden
- refine rows above pivot rows, split by the standard full-bleed divider; optional micro-label group headers ('더 자세히'/'다음 단계'); MAX 4 ROWS total
- chip honesty: a row's visible label IS the query it sends; if the query needs more words the row inserts into the Composer instead of sending
- selecting INSERTS into the Composer, never auto-sends
- chips and panel never render together; the panel never renders in the zero state (§27 starters own it)
- no per-row rationale line — it would break chip honesty; grouping is how the panel signals why a row is offered
- role=listbox, ↑↓ traversal, ↵ selection; the keycap header is aria-hidden decoration over real key handlers

---

## ConversationSummary

**Purpose:** an agent-generated recap of a long thread — decisions, action items, open questions — so a user can catch up without rereading. Full behavior: `ai-patterns.md` §34. (Added 2026-08-03 — chat-interface gap audit.)
**Keywords:** recap, tldr, catch up, digest, thread summary

**Anatomy:** a collapsible block, **borderless `ai.surface` fill, radius `md`, no shadow — deliberately identical to ProposalCard's tray, since the Console's agent-output objects speak one dialect** (added explicitly 2026-08-03: the entry originally named no radius or border, and the two renders had drifted to `xl` and `md`). **The body stays on `ai.surface` — it does NOT open to `bg.page`** (corrected 2026-08-03). ProposalCard's tray rule opens its *payload* to `bg.page` — a diff, a message preview, an affected-record list — because a bounded object inside a tray gains internal depth that way. A summary's body **is the content, not a payload**, so applying the same rule dissolved the object: `bg.page` is `#FFFFFF` in light mode and so is the thread behind it, leaving a tinted header bar with loose text hanging below it. The rule generalises: **"opens to `bg.page`" only means anything when the container is not already sitting on `bg.page`.** It carries the standard agent attribution row (squared Avatar + agent name + timestamp, §9), placed at the top of the Thread or inside the thread's detail Drawer. Header carries a refresh `ghost` action and a `last-generated` caption. Body follows agent-markdown rules (§12).
**It is agent output, marked as such** — never presented as system chrome, never as the user's own notes. The `ai.surface` fill and the attribution row are both required; a summary that reads as chrome is a provenance failure.
**Grounded:** each point links back to the turns it summarizes (SourceChip-style jump, §6). A summary that cannot point at its source turns, or that states a decision not present in the thread, violates §10 honesty.
**Refreshable, not authoritative:** regenerated on demand; it **never** replaces or rewrites the transcript (Thread is append-only). After the conversation continues, a stale summary shows its age — never a false "current".
**When not:** short threads (a summary longer than the thread is noise); never summarize into a surface that widens who can see the underlying content.
**States:** expanded/collapsed (collapsible block) · refreshed on demand (refresh action + last-generated caption) · stale (shows its generation age — never a false "current").
**Forbidden:** replacing or editing transcript turns; a point with no jump-back link; stating a decision absent from the thread; presenting it as chrome or as the user's notes; auto-generating on every thread regardless of length; a summary with no visible generation age.
**A11y:** the collapse toggle carries `aria-expanded`; jump-back links are real links that move focus to the target turn.

**Key rules (machine index):**
- collapsible block on ai.surface WITH the standard agent attribution row (squared Avatar + name + timestamp) — both required; a summary that reads as chrome is a provenance failure. The BODY STAYS ON ai.surface and does NOT open to bg.page: ProposalCard's tray rule opens a PAYLOAD (diff, preview, record list) to bg.page, but a summary's body IS the content, and bg.page is #FFFFFF in light mode exactly like the thread behind it, so the body dissolved. Generally: 'opens to bg.page' only means something when the container is not already on bg.page
- at the top of the Thread or in the thread's detail Drawer; header carries a refresh ghost action + a last-generated caption
- GROUNDED: each point links back to the turns it summarizes (SourceChip-style jump); a point with no jump-back link, or a decision absent from the thread, violates §10 honesty
- refreshable, NOT authoritative: never replaces or rewrites the transcript (Thread is append-only); a stale summary shows its age, never a false 'current'
- NOT for short threads (a summary longer than the thread is noise); never summarize into a surface that widens who can see the content
- never presented as system chrome or as the user's own notes

---

## DescriptionList

**Purpose:** key–value display — the backbone of Object detail views, drawers, and expanded table rows. (Added gap audit: previously improvised with ad-hoc label/value stacks.)
**Keywords:** key value, definition list, dl, property list, details, metadata

**Anatomy:** rows of term + description. Two layouts: `side-by-side` (term `label` `text.secondary` left column, min-width 120px sized to the widest term of the active locale, max 200px; description `body` right) and `stacked` (term above description; use in narrow panes <360px). Rows separated by `--sy-space-2`; optional full-bleed `border.subtle` row dividers.
**Description content:** plain text, or exactly one inline component: Badge, Chip list, user/agent (Avatar 20 + name), `code-sm` ID, Link, or timestamp. Empty value = "—" (`text.tertiary`).
**Optional row action:** trailing ghost icon-button (copy, edit) visible on row hover.
**States:** static display · row hover reveals the optional trailing action · empty value = "—" (`text.tertiary`).
**Forbidden:** more than ~10 rows without grouping under `heading-sm` titles; two-column term/value grids (KO/EN term widths diverge — one list per column region instead); using it as a form (labels + inputs = form, `patterns.md` §3).
**A11y:** semantic `<dl>/<dt>/<dd>`.
**Bilingual:** term column width from the active locale's widest term; terms never truncate.

**Key rules (machine index):**
- term column sized to widest term of active locale; never truncates
- empty = em dash
- not a form

---

## ButtonGroup

**Purpose:** visually attached group of related actions. (Added gap audit.)
**Keywords:** split button, attached buttons, action group, fused buttons

**Variants:**

| Variant | Composition | Use |
|---|---|---|
| `attached` | 2–4 `secondary` (tonal) buttons fused into one shape (radius only on outer corners; 1px `border.default` separators between segments) | Peer actions operated together: zoom in/out, prev/next, view toggles with actions. |
| `split` | primary action button + attached chevron button opening a Menu of alternative actions | "Run" + ▾ (Run with options…, Schedule run…). The menu's actions must be true variants of the main action. |

Split follows its main button's variant (`primary` or `secondary`; `brand` is the azure AI CTA and is not used in split buttons); the chevron segment is 28px wide, same height/variant, separated by a 1px divider in the border color (or `alpha.white-16` on solid fills).
**Forbidden:** attaching `primary` buttons to each other (one primary per region still holds); split buttons whose menu contains unrelated actions; more than 4 segments; using `attached` where SegmentedControl (exclusive state) is the real need.
**A11y:** `role="group"` with a group label; split's chevron gets `aria-haspopup` + its own label ("More run options").

**Key rules (machine index):**
- never attach primaries
- ≤4 segments

---

## SourceChip

**Purpose:** inline provenance marker for agent claims. Full behavior: `ai-patterns.md` §6. **Marker anatomy (maintainer reference: circular superscript style):** an 18px round chip (`radius.full`, **neutral `bg.sunken` fill, `text.secondary` bare numeral** — no brackets, 11px semibold tabular, sans not mono, **1px top-padding optical nudge — the Badge md-nudge precedent: Pretendard's 11px digits sit high at line-height 1 in small containers; applies to the pill's numeral circle too,**) at the end of the supported sentence, `text-bottom` aligned; hover/link-highlight steps to `ai.surface-hover`. The bracketed mono `[n]` form is retired.
**Keywords:** citation, footnote, reference, provenance, source marker

**Anatomy:** 18px height, `bg.sunken`, radius `xs`, mono 11 numeral (`[1]`), placed after the supported sentence, 2px baseline offset. Hover/click → Popover with source title, origin icon, timestamp, open link. Message footer lists all sources (13px `text.secondary`).
**States:** default, hover (`bg.selected`), broken (source no longer retrievable — chip gets `status.warning` numeral and the popover says so).
**Forbidden:** decorative use, self-citation, fake numbering, more than 3 chips per sentence (synthesize instead); footnote styles other than this one.

---
**Sources row (layout):** the plain-text footnote line is retired — a `micro-label` "출처" eyebrow sits on its own line ABOVE a row of **pill-shaped** source cards — borderless `bg.sunken` fill; anatomy: a **leading 18px page-filled numeral circle** (11/1 semibold tabular — structurally mirrors the inline marker: both are numbered circles, at text scale and pill scale) + **12px source-type icon (`text.tertiary`)** + source name (12/18, `text.secondary`), gap 6, padding 2×8 with a 2px leading inset so the circle sits evenly (icon restored, maintainer preference — with the numeral contained in its circle, the icon reads as clean metadata rather than clutter; it aids scanning when several sources share a row). Hover on the gray ladder's next step. The pill silhouette deliberately differs from the rounded suggestion Chips sharing the Console — the two chat-chip species must be tellable apart by shape alone; source pills are ContextCard derivatives, outside the Chip family's rounded rule. Hovering a card highlights its inline [n] markers and vice versa — the number mapping becomes visual, not mental. **Hit target:** the 18px chip keeps its visual size but carries an invisible ≥24px hit area (inset −4 pseudo) — the 24px floor applies to targets, not glyphs.

**A11y:** the 18px marker keeps an invisible ≥24px hit area (the 24px floor applies to targets, not glyphs); hovering a source card highlights its inline [n] markers and vice versa — the number mapping is visual, not mental.
**Key rules (machine index):**
- never fake citations — unsourced claims get the 'Model knowledge' badge
- ≤3 per sentence
- sources row: 출처 eyebrow ABOVE pill source cards — leading 18px page-filled numeral circle (mirrors the inline marker) + 12px type icon + name (icon restored); card↔marker hover linkage; ≥24px hit areas
- marker = 18px circle, neutral bg.sunken + text.secondary, bare numeral 11 semibold tabular — brackets/mono retired

## ContextCard

**Purpose:** a referenced object (document, meeting, table, page) rendered as a physical card in Console threads and the Composer — the visible form of "what the agent is looking at". (Added.)
**Keywords:** attachment card, document card, reference card, mention, file card

**Anatomy:** outlined `bg.raised` card, radius `md`, padding 8×12, max-width 240: object-type icon (14px) on a 24px `bg.sunken` tile (radius `xs`, concentric-exempt: flowing content) · title (13 medium, single line, ellipsis) · `caption` meta (source · date), one line max. Hover: `border.strong`; click opens the object.
**Stack:** 2+ referenced objects stack flat — a single offset underlay card at −4px with the top card separated by a 2px page-colored outline ring (count-overlay precedent), plus a `+N` Badge on the top card. Max 3 visible objects; expand lists vertically. **No rotation** — precision, not playfulness.
**Compact (Composer @-mention):** icon tile 16px + title only, padding 2×8; renders inline in the Composer text row.
**States:** hover `border.strong` (click opens the object) · stacks past 3 expand to a vertical list.
**Forbidden:** thumbnails or content previews inside the card (v1 has no preview language); more than one meta line; manual colors; stacks used for anything but referenced objects.

**Key rules (machine index):**
- outlined radius-md card: icon tile + title + one caption meta line (corrected 2026-08-03 by SY021, was sm); no thumbnails
- stack: flat -4px underlay + page-colored ring + '+N', max 3, never rotated
- compact inline variant for Composer @-mentions

---

## Timeline

**Purpose:** chronological activity — audit trails, run history feeds. (P3,.)
**Keywords:** activity feed, audit log, history, event stream, changelog

**Anatomy:** rows of actor Avatar 20 (shape = actor type — the round/squared system carries authorship) · verb-first sentence (`body-sm`; actor name and object at weight 500, object is a Link) · timestamp (`caption` `text.tertiary`, relative with absolute on hover). Day dividers: full-bleed hairline + `label-sm` `text.tertiary` date. Filterable via the R6 filter bar.
**Behavior:** consecutive same-actor events MAY collapse ("edited 3 fields" / "필드 3개 수정") expandable; handoffs render as first-class events (ai-patterns §16); load older via "Load more" (never infinite table rules — feeds are the sanctioned cursor case).
**`compact` variant:** avatar-less `caption`-height rows for embedded mini-logs inside Cards/Drawers (actor name inline, weight 500); full Timeline remains the page-level form.
**States:** consecutive same-actor events MAY collapse, expandable · timestamps show absolute on hover · older entries load via "Load more".
**Forbidden:** editable or deletable history rows; relative-only timestamps; mixing a comment thread into the audit feed (separate surfaces); icons per row unless the concept is in the registry.

**Key rules (machine index):**
- actor avatar shape carries authorship
- verb-first templated sentences; absolute time on hover
- day dividers; same-actor collapse; Load more (no infinite tables)
- history never editable

---

## Tree

**Purpose:** hierarchy display and selection — folders, org units, nested resources. (P3.)
**Keywords:** tree view, hierarchy, folder tree, file explorer, nested list

**Anatomy:** rows 28px: disclosure chevron (rotates, `fast`) · optional registry icon 16 · label (`body-sm`) · optional trailing count Badge. Indent 20px per level; max 4 rendered levels — deeper hierarchies drill in, never scroll horizontally (labels truncate middle-out + Tooltip).
**Selection:** single (row `bg.selected`) or checkbox mode with mixed-state parents (the cross-component mixed convention).
**Keyboard:** arrows navigate/expand/collapse, roving tabindex, type-ahead.
**Drag:** re-parent only where the model allows; drop target = 2px `border.focus` insertion line.
**States:** expanded/collapsed per node (chevron rotates, `fast`) · selected row `bg.selected` (single) or checkbox mode with mixed-state parents · drag drop-target = 2px `border.focus` insertion line.
**Forbidden:** trees for flat or 2-level data (grouped list instead); connecting guide lines (indent + chevron suffice).

**A11y:** arrows navigate/expand/collapse, roving tabindex, type-ahead; checkbox mode uses mixed-state parents per the cross-component convention.
**Key rules (machine index):**
- rows 28; indent 20/level; max 4 levels then drill-in
- checkbox mode uses mixed-state parents
- drop target = focus insertion line
- no guide lines; middle-out truncation + tooltip

---

## CodeBlock

**Purpose:** code, logs, config display — promotion of `.sy-code-block`. (P3.)
**Keywords:** code snippet, syntax, log viewer, pre, monospace, code display

**Anatomy:** `bg.sunken` container, radius `lg`; header row: language chip (`micro` mono `text.tertiary`) + copy icon-button (ghost, Toast confirms); body `code` style, optional non-selectable line numbers (`text.tertiary`); wrap off by default with horizontal scroll; max-height 400px + "Show all" expander.
**Syntax theme:** one muted theme system-wide, ≤5 colors drawn from `viz` + `fg` tokens, defined once at implementation — never bright/rainbow themes, never per-surface themes.
**Streaming:** renders when the fence closes (ai-patterns §12).
**States:** capped at max-height 400px with a "Show all" expander · streaming content renders when the fence closes · copy confirms via Toast.
**Forbidden:** editing affordances (this is display; editors are out of system scope); nested scrolling beyond the one horizontal overflow.

**Key rules (machine index):**
- header: language chip + copy
- one muted syntax theme ≤5 colors system-wide
- max-height 400 + expand; renders on fence close
- display only — no editing

---

## DiffView

**Purpose:** standalone change comparison — run configs, policy edits; promotion of the ProposalCard diff rules. (P3.)
**Keywords:** diff, comparison, side by side, unified diff, changes

**Anatomy:** unified layout default; side-by-side variant permitted ≥960px for config comparisons. Line rows: gutter (+/− marker + optional line number) + mono 12 content. Added = `status.success-bg`, removed = `status.danger-bg`, word-level changes darker tint within the line — NEVER color alone (gutter markers are the colorblind-safe channel). Unchanged runs collapse to an expandable "⋯ 24 unchanged lines" row. Header: object name + change counts (+12 −4, tabular).
**States:** unchanged runs collapse to an expandable "⋯ N unchanged lines" row.
**Forbidden:** three-way diffs (out of scope v1); syntax highlighting inside diffs (one signal at a time); scroll-linked panes that can desynchronize.

**A11y:** never color alone — the +/− gutter markers are the colorblind-safe channel for added/removed lines.
**Key rules (machine index):**
- unified default; side-by-side ≥960px
- tint + gutter markers, never color alone
- unchanged runs collapse; +N −M counts tabular
- no syntax highlighting inside diffs

---

## MediaGroup

**Purpose:** agent-**generated** media (images, chart renders, previews) presented as a casual fan in Console replies — the system's one sanctioned playful moment. (Added.)
**Keywords:** gallery, image group, media fan, thumbnails, generated images

**Anatomy:** cards `bg.page`, 1px `border.default`, radius `lg`, 2px page-colored outline ring for separation, overflow hidden; media area object-fit cover on top + **caption strip** below (`bg.surface`, hairline top rule, `micro` label; the `+N` Badge sits right-aligned in the strip). 2–3 cards fan with **±2.5° alternating rotation** and ~20% overlap; a single item renders flat. Max 3 visible + `+N` Badge on the last card; click opens the media viewer.
**Behavior:** hover/focus straightens the card (rotate → 0) and raises it (`shadow.xs`) at `fast`; `prefers-reduced-motion` renders the whole group flat and static.
**States:** rest (2–3 cards fanned; a single item flat) · hover/focus (card straightens to 0° and raises `shadow.xs` at `fast`) · `prefers-reduced-motion` renders the whole group flat and static.
**Jurisdiction (hard):** ONLY agent-generated media inside agent replies. Referenced/attached objects use ContextCard (always flat); thumbnails elsewhere are forbidden. **Rotation exists nowhere else in the system** — see design.md §8.
**Principle:** playfulness lives in the agent's *output*, never in the chrome.

**A11y:** cards respond to focus as they do to hover (straighten + raise); `prefers-reduced-motion` renders the group flat and static.
**Key rules (machine index):**
- ±2.5° alternating rotation, ~20% overlap, max 3 + '+N' (badge in caption strip); single item flat
- card = media area + surface caption strip with hairline rule
- hover straightens + raises; reduced-motion renders flat
- jurisdiction hard: generated media in agent replies ONLY — rotation exists nowhere else (design.md §8)
- playfulness lives in output, never chrome

---

## Slider · NumberInput

**Purpose:** bounded continuous values (Slider) and precise numeric entry (NumberInput). They pair; neither replaces the other. (P3.)
**Keywords:** range, numeric field, spinbox, number field, range slider

**Slider:** 4px track (`bg.sunken`) + `action.primary-bg` fill + 16px thumb (focus ring); value label appears above the thumb while dragging (Tooltip surface); optional tick marks at enumerated stops; arrows step, Shift = 10×; `range` variant = two thumbs, `bg.selected`… no — fill between thumbs uses the standard fill. Jurisdiction: values where *position is meaning* (thresholds, sampling %, volume). NEVER without a visible numeric value; NEVER for unbounded or precision-critical values.
**NumberInput:** filled Input + stacked stepper (chevrons, 24px hit each) + optional unit suffix (`text.tertiary`); typed entry free, clamps to min/max on blur with a `caption` note; arrows step. Tabular numerals.
**States:** dragging (value label above the thumb, Tooltip surface) · thumb focus ring · NumberInput clamps to min/max on blur with a `caption` note.
**Forbidden:** sliders for dates/times; steppers on non-numeric inputs; percent sliders whose denominator is unknown.

**A11y:** keyboard steps — Slider arrows step, Shift = 10×; NumberInput stepper chevrons carry 24px hit areas and arrows step; a Slider never renders without a visible numeric value.
**Key rules (machine index):**
- slider never without a visible value; never for unbounded/precision
- number input: steppers, unit suffix, clamp on blur, tabular

---

## ChoiceCard

**Purpose:** one-of or many-of selection where options deserve descriptions — plan pickers, agent-type choice, onboarding decisions. (P3.)
**Keywords:** selectable card, option card, radio card, plan picker, pricing options

**Anatomy:** grid of `outlined` Cards (2–3 columns, equal height), padding 16: optional 20px registry icon · title (`heading-sm`) · description (`caption` `text.secondary`, ≤2 lines). Selected = 1px `border.selected` border + a 4px lighter `border.subtle` outline flush against it (offset 0 — no gap, so the thin selected line and the wider gray band read as one continuous two-tone halo, not a thickened single border) + 16px check top-right. Radio semantics by default; `multi` variant uses checkbox semantics and shows Checkboxes.
**Jurisdiction:** 2–6 options that need explanation. >6 or bare labels → Radio/Select.
**A11y:** `radiogroup`/`group`, arrow-key navigation, whole card is the target.
**States:** unselected (`outlined` Card) · selected = 1px `border.selected` + flush 4px `border.subtle` outline (one continuous two-tone halo) + 16px check top-right.
**Forbidden:** nesting inputs inside choice cards; unequal card heights in one group; images/illustrations (v1 has none).

**Key rules (machine index):**
- radio semantics default, multi variant shows checkboxes
- selected = border.selected ring + check
- equal heights; whole card is the target; >6 → Select

---

## HoverCard

**Purpose:** rich preview of an entity reference (user, agent, run) on hover/focus. (P3.)
**Keywords:** preview, profile preview, peek, entity preview, hover popover

**Anatomy:** popover ≤320px, `bg.raised-2`, `border.overlay`, `shadow.lg`, `z.dropdown`: Avatar header (name + `caption` role/state) + 2–4 DescriptionList rows + optional single ghost action. Opens after 500ms hover or on focus; closes on leave/Esc.
**Rule:** hover is enhancement, never requirement — everything in a HoverCard must also exist on the entity's click-through page (keyboard and assistive access must not depend on hover).
**States:** closed at rest · open after 500ms hover or on focus · closes on leave/Esc.
**Forbidden:** forms; nested HoverCards; hover cards on elements that already open popovers.

**A11y:** opens on focus, not only hover; Esc closes; hover is enhancement, never requirement — everything in the card must also exist on the entity's click-through page, so keyboard and assistive access never depend on hover.
**Key rules (machine index):**
- 500ms delay; ≤320px; avatar header + 2–4 key-value rows + ≤1 ghost action
- hover is enhancement — same info must exist on click-through
- no forms; no nesting

---

## Popconfirm

**Purpose:** inline confirmation for low-stakes reversible-ish actions — the step between no-confirm and Modal. (P3.)
**Keywords:** inline confirm, confirm popover, quick confirm, are you sure, delete confirm

**Anatomy:** popover anchored to the trigger (`z.dropdown`): one consequence-naming question (`body-sm`) + Cancel (`ghost` sm) + confirm (`danger`/`primary` sm). Esc/outside-click cancels.
**Jurisdiction:** single-object actions whose result is easily recreatable (unpin, clear a saved filter, remove one attachment). Permanent data loss, bulk operations, or anything with named counts → Modal (R5 rules).
**States:** open, anchored to the trigger · Esc/outside-click cancels.
**Forbidden:** chaining popconfirms; inputs inside; using it to soften actions that deserve a Modal.

**Key rules (machine index):**
- one question + Cancel/confirm pair
- permanent loss, bulk, named counts → Modal
- no chaining; no inputs

---

## ContextMenu

**Purpose:** right-click menu on dense data surfaces. (P3.)
**Keywords:** right click, right click menu, contextual actions, secondary menu

**Anatomy & behavior:** the Menu component, opened at pointer position (`z.dropdown`); same item rules (registry icons, destructive last, full-bleed dividers, 4px gaps).
**The duplication rule:** every context-menu action MUST also exist in visible UI (row actions, toolbar, ⋯ menu) — context menus are an accelerator, never the only path (discoverability — pointer-hidden affordances must not gate any action).
**Jurisdiction:** dense tables, trees, canvas-like surfaces. Not on focus-archetype prose.
**Forbidden:** context-only actions; submenus beyond one level; overriding browser context menu on text selections.

**A11y:** an accelerator, never the only path — every action also exists in visible UI (pointer-hidden affordances must not gate any action); the browser context menu on text selections is never overridden.
**Key rules (machine index):**
- same Menu component at pointer
- duplication rule: every action also exists in visible UI
- one submenu level; not on prose

---

## CalendarView

**Purpose:** schedule visualization — when agents run, what ran. Not a booking system. (P3.)
**Keywords:** schedule, month view, week view, events, agenda

**Month grid:** DatePicker cell anatomy scaled up — day cells ≥96px tall, day number `label-sm` (today = outlined pill), events as dot + `body-sm` text rows (event dot is neutral `icon.tertiary` — category colour-coding was removed 2026-07-30), max 3 per cell then "+N" → popover listing all.
**Week variant:** hour rows (48px) with event blocks; block = viz tint fill + `label-sm`; overlaps split width.
**Behavior:** click event → popover with DescriptionList + open action; drag-to-reschedule only where the schedule model allows, with Toast confirm + undo.
**States:** today = outlined pill · >3 events per cell collapse to "+N" (popover lists all) · empty days are simply empty.
**Forbidden:** month cells scrolling internally; empty-day placeholders (empty days are simply empty); more than one event color system (viz assignment only).

**Key rules (machine index):**
- day cells ≥96px; max 3 events + '+N' popover
- event colors = system-assigned viz tints only
- drag-reschedule only where model allows, Toast + undo
- empty days are empty

---

## NotificationCenter

**Purpose:** the bell's panel — what happened while you were away. (P3.)
**Keywords:** inbox, bell, notification, activity center, unread

**Anatomy:** popover panel 360px (`z.dropdown`): header ("Notifications" / "알림" + settings and mark-all-read ghost icon-buttons) · a **filter SegmentedControl** (All / Unread / Mentions, full-width, immediate filter) · a scrolling list grouped Today / Earlier (`label-sm`; a group header hides when its filter leaves it empty) · items: a **leading marker** — the actor's Avatar 20 for actor events (round human / squared agent) or a neutral 20px type medallion for system events — plus a templated sentence (content.md verbs), a `caption` timestamp, and an optional single inline action; unread = `bg.surface` fill + 8px `status.info-bg-solid` dot on the left edge · footer: a single full-width "View all" ghost button to the full page (after 30 items).
**Item types:** `run` (agent run finished), `approval` (a proposal awaiting review — its one inline action only *opens* the ProposalCard), `mention` (what the Mentions filter selects), `comment`, and `system`. Type is carried by the leading marker and the verb — never by tint alone.
**Per-item controls:** hovering or focusing a row floats a small control cluster over its right edge — toggle read/unread and dismiss (×) — without hiding the timestamp or changing the row's height (reveal-on-hover only *adds* an overlay, it never removes existing content or reflows the row); the header's mark-all-read clears every unread at once. These are chrome, separate from the single content inline action.
**Behavior:** clicking an item navigates to the object and marks it read. A present inline action only *opens* its surface for consequential acts — approving an agent proposal happens on the ProposalCard, never from a notification. The Unread and Mentions filters and the read/dismiss controls never surface a number — the bell's count overlay is the only count.
**Empty state:** the compact flavor ("You're all caught up" / "모두 확인했습니다"), shown when a filter yields nothing or the list is cleared.
**States:** unread (`bg.surface` fill + 8px `status.info-bg-solid` dot on the left edge) · row hover/focus floats the read/dismiss cluster (adds an overlay, never reflows the row) · empty (compact EmptyState flavor).
**Forbidden:** marketing content; more than one content inline action per item (the read/dismiss hover controls are exempt — they are chrome, not content actions); unread counts anywhere except the bell's count overlay (99+ rule); type expressed by color/tint alone.

**Key rules (machine index):**
- items templated from content verbs; unread dot + surface fill
- click navigates + marks read; consequential actions only OPEN their surface (never approve from a notification)
- 30 items then View all

## GraphCanvas · FlowNode · Edge

**Purpose:** the node-graph editor behind the `workbench` builders — Workflow Builder, Pipeline Builder, and the Ontology Link / Lineage graph. A pannable, zoomable canvas of node cards connected by typed edges, with a node palette and canvas controls. One family, grouped because the parts only exist together.
**Keywords:** node editor, flow, workflow canvas, dag, node graph, pipeline builder, minimap

**Variants:** modes: `build` (edit) · `run` (read-only + per-node run status); edge: default · Condition branch (If / Else `label-sm` tag).
**Canvas:** a full-bleed workbench surface on `bg.sunken` with a subtle dot grid (dots `border.subtle`) — the one sanctioned background texture, never a decorative pattern. Pan (space-drag) + zoom (wheel/controls). Every graph has one fixed **Start** anchor and one or more **End** nodes.

**FlowNode:** an `outlined` card — `bg.surface`, 1px `border.default`, radius `lg`; `border.selected` when selected, blue `border.focus` ring on keyboard focus. Header row: 16px type icon + node-type label (`label`) + a leading status dot using the AgentStep state vocabulary. Body: a compact config summary (`caption`, `text.secondary`). **Ports:** input on the left edge, output on the right — 8px squared handles (`border.strong`; eligible/hover = `border.focus`). Fixed width tier (240); height to content.

**Edge:** a 1px `border.strong` connector from an output port to an input port; one connector style system-wide. The Condition branch variant carries a small `label-sm` tag (`bg.surface`) for If / Else. A running edge may pulse (transform/opacity only; static under reduced-motion). State is a token + a glyph, never a hue alone.

**NodePalette:** a docked left panel (`bg.surface`, right `border.subtle`) or an "Add node" Popover; node types grouped under `micro-label` headers (mirroring the Pipeline Extract/Transform/Load grouping); drag-to-canvas or click-to-insert. Closed set — only node types in the manifest.

**CanvasControls:** a floating cluster bottom-left (`bg.raised` + `border.overlay` + `shadow.lg`): zoom in/out, fit-view, and an optional minimap (`bg.surface`, viewport rect in `border.strong`). Icon-only, square, `aria-label` required.

**Modes:** **Build** (edit — add/configure/connect; edit-permission gated) and **Run** (read-only + per-node run status + a `RunLog`).

**States:** empty (a lone Start node + "add first node" affordance), default, node selected, node running/failed, connecting (a live edge follows the cursor; invalid targets dim), read-only (Run mode or insufficient permission).

**Forbidden:** decorative node fill-colors (status is dot + glyph, never hue alone); free-form node shapes (one silhouette); mixing straight and curved edge styles; gradients/glow on nodes or edges; more than one grouping nesting level; any node type absent from the manifest.

**A11y:** FlowNode takes the blue `border.focus` ring on keyboard focus; CanvasControls are icon-only squares with required `aria-label`; a running edge's pulse is static under reduced-motion; state is a token + a glyph, never a hue alone.
**Key rules (machine index):**
- canvas = bg.sunken + subtle dot grid (the one sanctioned bg texture); one fixed Start anchor, ≥1 End
- FlowNode = outlined card: header (16px icon + type label + AgentStep status dot) + config summary + left input / right output ports (8px squared handles); fixed width tier (240)
- Edge = 1px border.strong output→input, one connector style system-wide; Condition branch carries a label-sm If/Else tag; state = token + glyph, never hue alone
- NodePalette = grouped closed node-type list (micro-label headers), drag or click to insert; manifest node types only
- CanvasControls = floating zoom/fit/minimap cluster (bg.raised + border.overlay + shadow.lg); icon-only square + aria-label
- build vs run mode (run = read-only + per-node status + RunLog)
- no decorative node fill-color, no free-form shapes, no gradient/glow, no mixed edge styles, one grouping nesting level

## RunLog

**Purpose:** the execution record of a run — Workflow Run mode, Pipeline runs, and the CUA run review. A hierarchical, append-capable log: run → step → line.
**Keywords:** execution log, run history, step log, job output, console log

**Anatomy:** a bordered panel or Drawer content (`bg.surface`, radius `lg`). Header: run title + status `Badge` + duration (tabular). Body: an expandable list of **steps** (each row = status dot + step name + `caption` duration), each expanding to its **log lines** in a mono `CodeBlock`-style block on `bg.sunken`.

**States:** from the **`ai-patterns.md` §3 superset** (single source since 2026-08-03) — a run reaches `pending`, `queued`, `running`, `awaiting-input`, `partial`, `success`, `failed`, `cancelled`, `skipped`. RunLog's own behaviours on top of the shared indicators: `running` live-appends with a named working line (`aria-live=polite`) and pulses, no shimmer; `success` collapses to "N steps · 12s"; `failed` auto-expands and surfaces the error line + an optional Retry ghost action; `awaiting-input` surfaces the unblocking action and does **not** auto-expand (a blocked run is not an error). *This line previously listed five states that differed from AgentStep's five while the manifest claimed they were identical.*

**Behavior:** reuses AgentStep's closed state vocabulary; machine text in mono; timestamps absolute on hover; virtualize long logs; **pin-to-bottom is a toggle**, never forced. Display only.

**Forbidden:** color-only status; editing log content; auto-scroll that fights manual scroll.

**A11y:** live-append is `aria-live=polite` with a named working line; the running step pulses, never shimmers; pin-to-bottom is a toggle, never forced; status = dot + glyph, never hue alone.
**Key rules (machine index):**
- expandable steps using the ai-patterns §3 state superset (SHARED with AgentStep — this entry previously claimed the two vocabularies matched while the two prose specs listed different five-state sets) → mono log lines in a bg.sunken block
- header: title + status Badge + tabular duration; success collapses to 'N steps · 12s'
- failed steps auto-expand + surface the error + optional Retry
- live-append aria-live polite; running step pulses (no shimmer); pin-to-bottom is a toggle, never forced
- display only; virtualize long logs; status = dot + glyph, never hue alone

## PivotTable

**Purpose:** cross-tabulated aggregation (dimensions × measures) of ontology/dataset rows for the Application/dashboard surface. Extends `Table` but is a distinct component — it has row- and column-header dimensions and aggregated cells, not flat records.
**Keywords:** pivot, crosstab, aggregation, cube, summary table, measures

**Anatomy:** a framed Table-family grid with a sticky **row-dimension gutter** (leftmost, `bg.surface`, nested dimensions indent with expand/collapse) and grouped, sticky **column-dimension headers** (hairline rules only, per Table). Cells are aggregated measures using Table's numeric renderers (right-aligned, tabular; empty = em dash). Subtotal/total bands take the `emphasis.surface` fill (the Table emphasis rule — totals only). A field bar (rows / columns / measures pickers) sits above as a filter-bar recipe.

**States:** default · loading (skeleton mirroring the grid) · empty (no data for the pivot) · expanded/collapsed dimension levels · error.

**Behavior:** inherits Table's cell renderers, alignment, and header treatment; pivots are always framed (they scroll); drill via expand, not a modal; virtualize >200 rows.

**Forbidden:** zebra striping; default heatmap cell-coloring (a governed decision, not a default); emphasis beyond the total/subtotal band; two aggregations muddled in one cell.

**Key rules (machine index):**
- sticky row-dimension gutter (nested, expand/collapse) + grouped sticky column-dimension headers; always framed (scrolls)
- cells = Table's numeric renderers, right-aligned tabular; empty = em dash
- subtotal/total bands use emphasis.surface (Table emphasis rule; totals only)
- field bar (rows/columns/measures) above = filter-bar recipe
- inherits Table alignment/renderers/header treatment; virtualize >200 rows
- no zebra, no default heatmap cell-coloring, no dual aggregation per cell

## AssistantPanel

**Purpose:** the persistent docked/floating global agent — a compact chat available across the app that maximizes into the full Console. A composite (like `CommandPalette` and `NotificationCenter`), assembled from existing parts, never a re-implemented chat.
**Keywords:** copilot, chat widget, docked chat, chatbot, floating assistant

**Anatomy:** a floating launcher — a `brand` circular icon-button bottom-right (one of the three circular controls named under Button) — opening a docked panel: `bg.raised`, radius `xl`, 1px `border.default`, `shadow.lg`, `z.dropdown` tier. Panel = header (squared agent `Avatar` 24 + name + maximize + close ghost icon-buttons) · a scrolling message stream (agent turns on `ai.surface`, human turns plain; `AgentStep` / `ProposalCard` / `SourceChip` as usual) · one docked `Composer` at the bottom. Maximize navigates to the Console and carries state over.

**States:** collapsed (launcher only) · open (panel) · maximized (full Console) · running (AgentStep working line) · empty (starters per ai-patterns §27).

**Behavior:** exactly one per app; non-modal (no scrim); hidden on the full Console page (it *is* the Console there); never overlaps a primary action region — it offsets.

**Forbidden:** a second persistent chat surface; auto-opening or nagging; a scrim/blocking behavior; re-implementing the Composer.

**Key rules (machine index):**
- floating brand circular launcher (the shared circular exception) → docked panel (bg.raised, border.default, shadow.lg, z.dropdown)
- header (squared Avatar 24 + name + maximize + close) · ai.surface message stream (AgentStep/ProposalCard/SourceChip) · one docked Composer
- reuses Composer/ResponseToolbar/AgentStep — never a re-implemented chat
- exactly one per app; non-modal (no scrim); hidden on the full Console page; never overlaps a primary action region
- no second persistent chat, no auto-open/nagging

## AppLauncher

**Purpose:** a browsable overlay grid of system apps + user-published apps — the entry to the Application surface. Distinct from `CommandPalette` (which is ⌘K search); this is a tile grid.
**Keywords:** app grid, waffle, app switcher, tile grid, applications

**Anatomy:** a centered overlay with a **faux-glass surface** over a `bg.scrim` backdrop — opaque frosted `glass.surface` + top inner-rim highlight (`glass.rim`, `inset 0 1px 0`) + `glass.border` hairline, reading as macOS-Launchpad frosted glass with **no `backdrop-filter`** (foundations §6; SY015 holds — the frost is baked into opaque tokens, not inherited from content behind). Radius `2xl`, `shadow.xl`, `z.modal`. **Header row:** `heading-lg` title + a right-aligned pill search (`bg.sunken`, `radius.md`, search icon + placeholder). Below, sections under `micro-label` headers (**system apps**, **your apps**), each a fixed-column grid of **icon-forward tiles** — a tile is a 56px squircle **image well** (`radius.lg`, `shadow.xs`) with the app **name** (`body-sm`) centered beneath, **no bordered card**. Whole tile opens the app; hover lifts the icon.

**Icon well (the fallback ladder):** the squircle is an image container that clips whatever a published app supplies (`object-fit: cover`) — a **user-generated custom icon** (user content, may carry color) → else a graphite `bg.inverse` squircle with a 2-letter **monogram** (`text.on-inverse`, `text-16` semibold) → else a **system glyph** (white on graphite). A hairline (inset `border.subtle`) keeps a light/white custom icon defined against the panel; the graphite fallbacks self-define and take no ring. An unpublished/empty slot is a pale `bg.sunken` squircle + `text.tertiary` "App name" placeholder.

**States:** default · search-filtered (empty groups hide; compact no-results line) · loading (skeleton squircles) · empty ("no apps yet" + create action).

**Behavior:** icon-forward tiles (this is **not** the `Card` component — the earlier outlined-Card tile was replaced); the squircle is a fixed image well so generated icons drop in at a consistent size and shape. One action per tile; keyboard traversal + ↵ opens; fixed responsive column steps.

**Forbidden:** color in the launcher's **own chrome** — panel, labels, frame, system-app tiles, and empty slots stay achromatic (graphite / neutral); color lives ONLY inside a user-supplied app icon, never in the frame or the system-app marks (the icon rule holds for chrome). A modal stacked on top; arbitrary grid reflow; bordered-card tiles (icon-forward, not boxed).

**A11y:** keyboard traversal with ↵ opening a tile; one action per tile.
**Key rules (machine index):**
- centered FAUX-GLASS overlay over a bg.scrim backdrop — an OPAQUE frosted tint (glass.surface + glass.rim inset highlight + glass.border), radius 2xl, shadow.xl, z.modal; it READS as frosted glass with NO backdrop-filter (corrected 2026-08-03: this entry said 'glass-scrimless … radius lg', stale after the glass→opaque reversal — real translucency is forbidden by SY015 and the design.md §8 never-list, and the launcher does sit over a scrim)
- optional search + system-apps grid + your-apps grid under micro-label headers
- tiles = outlined Card (icon medallion + name + caption), whole-tile click opens, hover-lift
- keyboard traversal + ↵ opens; empty groups hide on filter
- no decorative tile color, no nested modal, fixed responsive column steps

## Divider

**Purpose:** separate content with a 1px rule — the standalone, documented form of the borders-first divider (foundations §6). Most separation is already carried by whitespace or a component's own border; reach for Divider only when a visible line genuinely aids grouping.
**Keywords:** separator, hr, horizontal rule, hairline, section break

**Variants:**

| Variant | Composition | Use |
|---|---|---|
| `full` | full-bleed 1px `border.subtle` horizontal rule | Separating stacked sections or list rows edge-to-edge. |
| `inset` | horizontal rule indented to the content edge | Dividers between rows that align to text, not the container edge. |
| `labeled` | rule broken by a centered or leading `caption`/`micro` label (`text.tertiary`) | A titled break ("or", a group name) between sections. |
| `vertical` | 1px `border.default` vertical rule at control height | Separating inline controls or meta items in a toolbar/row. |

**Anatomy:** a 1px line — `border.subtle` for division inside a component (rows, sections), `border.default` for a stronger boundary and the `vertical` variant. Labeled: line · label · line (or label · line for leading). Margins come from the surrounding rhythm (`space-4` / `space-6`), never baked into the Divider itself.

**Forbidden:** thick (>1px) or colored dividers; a Divider where whitespace already separates; decorative rules with no grouping purpose; more than one divider weight in a single region.

**A11y:** `role="separator"` (add `aria-orientation="vertical"` for the vertical variant); a purely decorative rule is `aria-hidden`.

**Key rules (machine index):**
- 1px only — border.subtle inside components, border.default for stronger boundaries + the vertical variant
- labeled = rule · caption/micro label (text.tertiary) · rule
- margins come from surrounding rhythm, never baked in
- reach for it only when a visible line aids grouping — whitespace/component borders first
- no thick or colored dividers; one divider weight per region
- role=separator (aria-orientation=vertical for vertical); a decorative rule is aria-hidden

## ToggleButton

**Purpose:** a button that toggles a single on/off state — pin, favorite, mute, show/hide a panel, a display or formatting option. Distinct from **Switch** (an instant-effect *setting*, in forms and settings rows) and **SegmentedControl** (an *exclusive* choice among peers).
**Keywords:** toggle, pressed button, pin, favorite, mute, icon toggle, toggle group

**Variants:**

| Variant | Composition | Use |
|---|---|---|
| `icon` | square icon-only toggle (control height) | Pin, favorite, mute, panel toggle — `aria-label` required. |
| `labeled` | icon + label toggle | When the toggled state needs a word ("Pinned"). |
| `group` | a `ToggleButtonGroup` of independently toggleable buttons | Multi-select display options (gridlines / legend / labels). NOT exclusive choice — that is SegmentedControl. |

**Anatomy:** built on Button (`ghost` or `secondary`, size-relative radius). **On-state** = `bg.selected` fill + `text.primary`, with the icon kept as a **stroke** glyph on the selected tint — never a filled icon. The favorite **star** is the single sanctioned fill-on-active exception (matching ResponseToolbar). Icon-only toggles are square (width = control height).

**Sizes:** `sm` · `md` · `lg` — built on Button, size-relative radius (Anatomy above).
**States:** off (default) · hover · **on** (`aria-pressed="true"`, `bg.selected`) · focus (the standard offset ring) · disabled (**`bg.disabled` fill + `text.disabled` label**, never opacity — *aligned to Button 2026-07-30*: this previously specified a text-only disabled treatment, which contradicted foundations §1.2's "the grey fill is the single unambiguous disabled signal" and made ToggleButton the only control in the system that disabled without a fill. `text.disabled` runs 2.12:1 on the page, so with no fill to frame it a disabled toggle was very faint).

**Forbidden:** using a ToggleButton for an exclusive choice (that is SegmentedControl) or an instant-effect form setting (that is Switch); a filled-icon on-state (except the favorite star); the point/accent color for the on-state — selection is the neutral `bg.selected`, never the accent.

**A11y:** `aria-pressed` reflects the state; icon-only toggles require `aria-label`; a `group` is `role="group"` with a label.

**Key rules (machine index):**
- disabled = bg.disabled fill + text.disabled label, never text-only and never opacity (aligned to Button 2026-07-30; ToggleButton was the only control disabling without a fill)
- distinct from Switch (instant setting) and SegmentedControl (exclusive choice)
- on-state = bg.selected + text.primary; icon stays stroke — favorite star is the sole fill-on-active exception
- aria-pressed reflects state; icon-only requires aria-label
- never the point/brand color for the on-state — selection is neutral bg.selected
- group is multi-select (role=group + label); exclusive choice is SegmentedControl
- icon-only toggles are square (width = control height)
