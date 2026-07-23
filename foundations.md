# Synapse foundations

Rationale and usage rules for the token layer. Token values live in `tokens/synapse.tokens.json` (canonical) and `tokens/synapse.css` (generated). This document explains *when* and *why* — an agent that only reads the JSON will produce technically valid but poorly judged UI; this file supplies the judgment.

Rule keywords: **MUST** / **NEVER** are machine-enforceable constraints. **SHOULD** indicates strong default, deviation requires stated reason. **MAY** is discretionary.

---

## 1. Color

### 1.1 Character

Synapse is a neutral, black-key system. The interface is built almost entirely from the gray ramp; color is a scarce resource spent only on meaning. The intended impression is engineered restraint — closer to a precision instrument than a consumer app.

- The primary action color is **black** (white in dark mode). Not blue.
- **Point color: `--sy-brand-point` / accent `#0621C4`.** The system's one vivid accent, from the Claude Design System palette. Black stays the brand/action color; the point color is used ONLY in two jurisdictions: (1) **brand identity objects** — the workspace monogram tile, the docs-hub/preview brand mark, the sanctioned Artific brand-hero moment, and logo/marketing surfaces; (2) **AI emphasis** — conversational-AI CTAs (`brand` Button: Ask agent / Composer send, max 1/screen) and **active AI running-state indicators** (live-agent beacon, in-progress `ai` ProgressBar via `ai.solid`). It is NOT for general chrome, operational agent actions (Run/Retry/Resume stay primary/black), or as text tint on slate AI surfaces (the 'colors mixed up' rejection still stands — slate remains the AI *surface*; point blue is a distinct solid accent on top, never blue-on-slate).
- **Functional blue stays separate.** `fg.link` / focus rings / `status.info` keep the calmer indigo (`#3155C6`) — a different role (utilitarian signal) and a different hue from the point color, so function and brand/AI-emphasis never collide. Point blue's white labels clear AA comfortably (white on `#0621C4` ≈ 10:1), so they take normal label weight — no solid-label exemption needed.
- Slate (`emphasis.*`, `ai.*` surfaces, and the slate-valued selected states) is the quiet-emphasis family — a barely-cool tint for marking importance without vibrant color. It is NOT a second neutral: never on default surfaces, borders, or text, and only through its closed job list (table emphasis column/cell; timeline/calendar now-markers; selected states; AI surfaces —. The hero-stat-card job was removed). Anti-collision: tint alone never signals AI — the squared avatar is the primary agency marker, supported by `ai.fg` slate marks; `emphasis.*` tokens themselves never appear on AI surfaces (use `ai.*`, same values, distinct semantics).
- Blue (`border.focus`, `fg.link`, status.info family) is *functional*, not brand: links, keyboard-focus rings on non-entry controls, informational status. AI *surfaces* stay slate (ai.surface/border/fg), but AI *emphasis* now takes the point color — see the point-color bullet above; `action.brand-*` is that point color, revived for conversational-AI CTAs and active running-state indicators. This functional-blue role (links/focus/info) is a separate, calmer hue that never overlaps it. It exists because pure monochrome cannot signal interactivity and focus accessibly. Exception: entry surfaces focus with the neutral `border.focus-input` perimeter — a text field shows focus on every click-to-type, and the caret + fill change + border swap form a compound indicator that doesn't need the accent.
- Status colors sit inside the neutral field without shouting, but they are chromatic, not muddy (recalibrated): text tokens carry as much chroma as AA contrast on their tints allows, and all solid fills are mid-tone with white `fg.on-solid` text — success/warning solids run ~3.5:1 under the documented solid-label policy (§8).

### 1.2 Rules

- Agents MUST use semantic tokens (`--sy-bg-*`, `--sy-fg-*`, `--sy-border-*`, `--sy-action-*`, `--sy-status-*`). Raw hex values and primitive ramp references are NEVER allowed in generated UI.
- One screen region SHOULD contain at most one solid-fill accent element (e.g. one primary button). Everything else uses outline, ghost, or text styles.
- Status colors are for status only. NEVER use `--sy-status-danger` for decoration or `--sy-status-success` as a generic "green accent."
- Solid red fills (`danger-bg-solid`) are reserved for destructive confirmation buttons.
- Data visualization MUST use `--sy-viz-1` … `--sy-viz-8`, assigned in order without skipping. If a chart encodes status (pass/fail, healthy/degraded), use status tokens instead of viz tokens.
- Text on colored status backgrounds MUST use the paired status foreground token, never `fg.primary`.
- All text/background pairings MUST meet WCAG 2.1 AA (4.5:1 body, 3:1 large text ≥18px semibold or ≥24px). The semantic pairs in the token file are pre-verified; novel combinations are forbidden, which makes verification unnecessary.

### 1.3 The layering model

Every surface sits on exactly one of five levels. Backgrounds express depth in dark mode; borders and shadows express it in light mode — the level tokens handle both automatically.

| Level | Token | Light | Dark | Used for |
|---|---|---|---|---|
| L0 | `bg.page` | white | black | The page itself. |
| L1 | `bg.surface` | gray-50 | gray-950 | Grouping regions: sidebar, table headers, toolbars, flat cards. |
| L2 | `bg.raised` | white + border | gray-900 | Cards, modals, drawers, menus — anything with its own boundary. |
| L3 | `bg.raised-2` | white + border + shadow | gray-800 | A layer on a layer: popover opened from a modal, nested panel, dragged item. |
| well | `bg.sunken` | gray-100 | gray-950 | Recessed content: code blocks, input wells, skeleton fills, dropzones. |

- Floating layers additionally take the shadow tier matching their behavior (`raised`/`overlay`/`modal`) — shadows communicate *floating*, levels communicate *stacking*.
- Do not invent intermediate grays, and do not skip levels (a popover from a modal is L3, not L2 again — in dark mode two L2 surfaces would visually merge).
- Interaction tints (`bg.hover`, `bg.active`, `bg.selected`, `bg.selected-hover`) apply *within* a level; they are not levels.

### 1.4 Token selection map — which token for which case

The full semantic vocabulary by use case. If a case isn't here and no token obviously fits, that's a proposal — not a raw value.

| Case | Token(s) |
|---|---|
| Page / grouping region / card / layer-on-layer / recessed well | `bg.page` / `bg.surface` / `bg.raised` / `bg.raised-2` / `bg.sunken` |
| Row or item hover · pressed · selected · hover on selected | `bg.hover` · `bg.active` · `bg.selected` · `bg.selected-hover` |
| Disabled control fill · disabled text · disabled border | `bg.disabled` · `fg.disabled` · `border.subtle` |
| Default text · supporting text · timestamps/hints · placeholder & mixed-value marker | `fg.primary` · `fg.secondary` · `fg.tertiary` · `fg.placeholder` |
| Links · links on `bg.inverse` strips | `fg.link` · `fg.link-inverse` |
| Component boundaries · inner dividers · bordered-element hover | `border.default` · `border.subtle` · `border.strong` |
| Focus ring · selected-card outline · invalid-field border | `border.focus` · `border.selected` · `border.error` |
| Primary button rest/hover/pressed + text | `action.primary-bg` / `-hover` / `-active` + `action.primary-fg` |
| AI action button rest/hover/pressed + text | `action.brand-bg` / `-hover` / `-active` + `action.brand-fg` |
| Destructive confirm fill + text | `status.danger-bg-solid` + `action.danger-fg` |
| Status text/icon · status tint · status solid fill · text on solid | `status.*` · `status.*-bg` · `status.*-bg-solid` · `fg.on-solid` |
| Status/link colors on `bg.inverse` surfaces | `status.*-inverse` · `fg.link-inverse` |
| Agent surfaces · agent borders · agent text/marks | `ai.surface` · `ai.border` · `ai.fg` |
| Quiet emphasis (hero stat, table emphasis column, now-markers) | `emphasis.surface` · `emphasis.border` · `emphasis.fg` |
| Categorical chart series (fixed order) | `viz-1` … `viz-8` |
| Modal backdrop · inverse emphasis block | `bg.scrim` · `bg.inverse` + `fg.inverse` |
| Identity tints (avatars, category Badges/Chips) | deterministic `viz-n` at 20% + matching `viz-n` text |

---

## 2. Typography

### 2.1 Type families

Three families, each with a closed jurisdiction. Using a family outside its jurisdiction is a contract violation, same severity as a raw hex value.

| Family | Token | Jurisdiction |
|---|---|---|
| **Pretendard Variable** | `font.family.sans` | All UI text, KO and EN alike. The default; everything not explicitly granted to the other two families. |
| **Artific** (Power Type Foundry) | `font.family.display` | Stylized brand moments only — see below. |
| **JetBrains Mono** (D2Coding Hangul fallback) | `font.family.mono` | Code and data identifiers — see below. |

One sans for both scripts eliminates cross-language baseline drift, weight mismatch, and fallback flashing.

**Display family (Artific) rules.** Artific exists to create visual impact at brand moments; scarcity is what makes it read as branding.

- Permitted ONLY at Display sizes (30/40, 36/48) and ONLY in: Guided-archetype heroes (onboarding, login, first-run), empty-state hero titles, and marketing-adjacent surfaces. NEVER in body text, controls, tables, navigation, or any data-heavy region.
- Max one display-family element per screen.
- Weights 600/700 only, via `.sy-display`. The family's Thin–Medium weights and all oblique styles are excluded from the system.
- **Artific is English-only (hard rule).** The family has no Hangul glyphs, so Artific may style **Latin/English copy only**. A `.sy-display` / `sy-type-display*` element MUST NOT contain Hangul — this is not a fallback situation to tolerate, it is a content constraint to design around (SY016 enforces). Do not attempt mixed-family styling within one string, and never substitute a different stylized Korean face without a system proposal.
- **KO localization of an Artific header keeps the English copy verbatim.** When Artific styles a short brand title (a Guided/empty-state/HOME hero of a few words), that string is a **brand moment, not localizable UI copy**: the KO locale renders the *same English words*, still in Artific — it is not translated and it does not fall back to a Pretendard-Korean rendering. Example: the HOME greeting stays "Good morning" in both locales. This is the deliberate exception to the "all UI text is localized" rule (content §8), and it is confined to Artific brand titles — every other string localizes normally. If a surface genuinely needs Korean display text, it does not get Artific: use Pretendard bold at the display size (a normal, non-brand heading), which keeps the brand face from ever switching typefaces by content language.
- Latin display text may use -1% letter-spacing (built into `.sy-display`); Hangul never gets letter-spacing.
- Licensing: commercial family, self-hosted woff2 in `assets/fonts/` (600/700 only). Not on public CDNs. Verify Enhans' license covers app embedding before shipping.

**Mono family rules.** Mono signals "machine-significant text — copy it exactly."

- Use for: code blocks and inline code (`.sy-code-block`, `.sy-code-inline`), IDs/hashes/API keys, log and terminal output, file paths, keyboard hints (`.sy-kbd`).
- Do NOT use for: numeric table columns (use sans + `tabular-nums` — mono is for identifiers, not quantities), dates, currency, or any prose.
- Mono text is exempt from the no-truncation rules only for hashes/IDs, which MUST truncate middle-out (`a3f8…c92e`) with copy-on-click.

### 2.2 Typography styles — the closed typographic vocabulary

Typography is set through named **styles**, never through ad-hoc size/weight combinations. Each style is a complete recipe (family + size/line-height + weight) rendered as a `.sy-type-*` class and defined in `semantic.type` in the token file. If a text element doesn't fit a style, that's a proposal, not an excuse for a custom combination.

| Style | Spec | Jurisdiction |
|---|---|---|
| `display-xl` | display 44/56 bold | Marketing-adjacent heroes (sign-in, launch moments). At most one per flow. |
| `display` | display 36/48 semibold | Guided-archetype heroes, empty-state heroes. |
| `display-sm` | display 30/40 semibold | Compact brand moments; Guided step titles. |
| `heading-xl` | sans 24/34 bold, −1% Latin tracking | Page title. One per page. |
| `heading-lg` | sans 18/27 semibold, −1% Latin tracking | Section, card, modal, drawer titles. |
| `heading-md` | sans 16/24 semibold | Subsections, empty-state titles, settings group titles. |
| `heading-sm` | sans 14/22 semibold | Group titles inside cards, dense panel headers. |
| `body-lg` | sans 16/24 regular | Long-form reading: agent reports, docs, onboarding prose. Max width 680px. |
| `body` | sans 14/22 regular | Default text everywhere. |
| `body-sm` | sans 13/20 regular (fixed) | Menu items, toast text, meta sentences that must not scale with density. |
| `label` | sans 13/20 medium | Form labels, table headers, buttons. |
| `label-sm` | sans 12/18 medium | Compact labels, secondary table headers. |
| `caption` | sans 12/18 regular | Helper text, footnotes, attribution rows. |
| `micro` | sans 11/16 semibold | Badges, kbd hints. NEVER sentences. The floor size carries the reinforced weight: 500 fuzzes at 11px (especially Hangul), 700 clogs counters. |
| `micro-label` | sans 11/16 semibold, +2% Latin tracking | Eyebrow/group labels: sidebar groups, palette groups, card eyebrows, chart axis labels. Tracking does the work ALL-CAPS would — caps remain forbidden (§2.3). Hangul never tracked. |
| `code` / `code-sm` | mono 13/20 · 12/18 | Code blocks, logs / inline code, IDs in cells. |
| `stat-lg` / `stat` / `stat-sm` | sans 30/40 · 24/34 · 20/30 semibold, tabular-nums | KPI values: hero / standard stat card / dense dashboards. |

Rules:

- Type is a single scale — `heading-sm`/`body`/`label` are fixed sizes. Synapse uses one size scale throughout (the focus/dense mode was removed).
- Hierarchy within one surface needs at least a 2-step style gap or a color change (`fg.primary` vs `fg.secondary`) — adjacent styles alone (16 vs 14) read as an accident.
- NEVER use weights other than 400/500/600/700; NEVER 600+ for body-length text; NEVER a raw `font-size` where a style exists.
- Stat styles always carry `tabular-nums`; they are for numerals and units, not sentences.

### 2.3 Bilingual (KO/EN) rules — non-negotiable

These exist because Korean and English versions of the same string differ systematically: Korean is often 10–20% wider for UI labels, has taller glyphs, no italics, and different truncation behavior.

1. **No fixed-width text containers.** Buttons, tabs, badges, menu items MUST size from content plus padding. Minimum widths are allowed; fixed widths are NEVER allowed on anything containing translatable text.
2. **No italics, ever.** Hangul has no italic form; synthetic oblique is illegible. Emphasis = weight 600 or `fg.primary` against secondary text. The CSS layer force-normalizes `<em>/<i>`.
3. **Line heights are floors.** The paired line-height in the scale accommodates Hangul ascent/descent. NEVER tighten. Custom `line-height < 1.4` on body text is forbidden.
4. **Korean line breaking:** `word-break: keep-all; overflow-wrap: break-word;` on all Korean text (applied via `:lang(ko)` in the CSS layer). Mark language on the document or region root with `lang="ko"` / `lang="en"`.
5. **Layouts must survive +25% text width.** When designing any label-bearing component, verify the layout at 125% string length. If it breaks, the design is wrong, not the translation.
6. **Truncation:** single-line ellipsis truncation is allowed only in table cells and list rows, and every truncated string MUST be recoverable (tooltip or detail view). NEVER truncate buttons, form labels, error messages, or headings.
7. **No ALL-CAPS styling.** `text-transform: uppercase` does nothing to Hangul, so mixed-language UI renders inconsistently. Hierarchy comes from size/weight/color instead.
8. **Avoid text in images/icons.** All rendered text must be live text so it can localize.
9. **Line balancing.** Display styles, `heading-xl/lg`, and hero/empty-state explanation paragraphs take `text-wrap: balance` — short multi-line text breaks into even lines instead of one long line with an orphaned fragment. This matters doubly in Korean, where `keep-all` preserves words but produces extreme rag on centered short text. Long-form body text is exempt (balancing is for ≤ ~4 lines); use the `.sy-balance` utility on hero paragraphs.

---

## 3. Spacing

4px base grid; the scale is enumerated in `--sy-space-*`. Off-scale values (e.g. 10px, 18px, 25px) are NEVER allowed. One sanctioned exception: ±1px as a hairline offset paired with a 1px border (e.g. a tab's active underline overlapping its container rule).

- Related items: 4–8. Grouped controls: 8–12. Between groups: 16–24. Between sections: `--sy-section-gap`. Page padding: `--sy-page-padding`.
- **Dividers span their container edge to edge.** Inside padded surfaces (menus, cards, lists), a divider extends into the padding (negative margin equal to the container padding) — a divider that stops short of the edges reads as an accident. If a divider *shouldn't* reach the edge, use spacing instead of a divider: every gap is either clearly intentional or absent.
- Layout-level spacing (page padding, section gaps, card padding, stack gaps) MUST use the `--sy-*` spacing tokens, not raw scale values.
- Vertical rhythm rule of thumb: the gap *above* a heading should be ~2× the gap below it.

---

## 4. Sizing

Synapse uses a **single size scale** (the former `focus`/`dense` density modes were removed as needless complexity). Controls, spacing, and type are one scale everywhere; there is no `data-density` and no per-region mode to reason about.

- The one exception is **Table**, which runs compact by default (`--sy-table-row` 36, `--sy-table-cell-x` 12) so data walls stay scannable — this is Table's normal metric, not a mode.
- Layout width is an archetype choice, not a density one: reading archetypes cap content at `--sy-content-max` (760px); workbench/data regions go fluid (`patterns.md` §1).
- All sizing/spacing MUST come from the `--sy-*` control and layout tokens, never raw values.

## 5. Elevation & borders

Synapse is **borders-first**: in-flow hierarchy is drawn with 1px borders and background steps, not shadows.

- `border.subtle` — dividers inside components (table rows, list separators).
- `border.default` — component boundaries (cards, inputs, table frames). Hairline-quiet.
- `border.strong` — hover state on interactive bordered elements.
- `border.overlay` — floating layers (menus, popovers, toasts, tooltips): **transparent in light mode** — the soft shadow carries the edge — visible in dark mode, where shadows die against black.

**Scrollbars:** quiet by law — thin (8px), trackless, borderless: thumb only, `border.strong` on a transparent track, radius `full`, `fg.tertiary` on hover; scroll buttons hidden. One global rule (`scrollbar-width: thin; scrollbar-color` + the `::-webkit-scrollbar` set) — never styled per component, never given a track fill or border. Native chrome scrollbars are the one default the borders-first rule does NOT extend to: a bordered track draws a permanent frame around content that only sometimes scrolls.
- Shadows are reserved for elements that float above the page: `raised` (sticky bars), `overlay` (dropdowns, popovers, tooltips — soft, large-blur), `modal` (dialogs, drawers). NEVER put shadows on static cards, buttons, or inputs (Card `elevated` excepted).
- `shadow.thumb` is a dedicated control token: a firm grounding drop plus a symmetric ambient halo so a borderless handle riding on a track (Slider thumb) defines its full circumference against a same-value background. Unlike the directional float shadows it carries an all-around component so the top edge reads. Scoped to draggable knobs on tracks — not general elevation.
- Sanctioned exception: a zero-blur `0 0 0` box-shadow ring using a token — inset (a border substitute where a true border would shift layout, e.g. calendar day cells) or outset (a focus ring, e.g. Buttons) — is not elevation and carries no blur; elevation needs blur, i.e. a `shadow.*` token. A focus ring may wrap its token in `color-mix` to lighten it. Box-shadow rings are used over `outline` where the ring must follow `border-radius` (outline leaves a gap at rounded corners).
- **Stacking:** floating/pinned elements take exactly one `--sy-z-*` token — `sticky` (100, table headers, toolbars, solid Banner strip) < `dropdown` (200, menus/popovers/palette) < `drawer` (300) < `modal` (400) < `toast` (500) < `tooltip` (600). Arbitrary z-index values are forbidden; if two things fight, the fix is the scale, not a 9999.

Radius: inputs/buttons/chips `sm` (8px) · cards/panels/menus `md` (10px) · modals/drawers `lg` (16px) · **section shells `xl` (24px)** · pills/avatars `full`. `xl` is the ceiling for rectangular containers and is reserved for section shells — the outermost rounded well a page region sits in (SplitPanel container, content wells, hero/empty wells): one shell level per region, never on cards or overlays, never nested inside another shell. Shells pad ≥ `space-24`, which keeps the concentric-corner rule from binding their children.

**Glass material (jurisdiction corrected):** glass belongs where LIVE CONTENT sits behind the panel — blur over a scrim samples an already-darkened backdrop and reads muddy gray by construction (the scrim-gating had the physics backwards; maintainer caught it on the Template Library). Jurisdiction: **unscrimmed floating layers only — CommandPalette (which drops its scrim; the frost itself is the focus device, esc/click-away still dismiss) and the Composer's follow-up panel.** Scrimmed blocking layers (Modal, Drawer) are OPAQUE `bg.raised` — the scrim already de-emphasizes. Anatomy: `glass.surface` fill (opacity floor 0.82 keeps pre-verified text pairs approximately valid) + `backdrop-filter: blur(glass.blur)` + light-mode `border.default` hairline (dark keeps `border.overlay`) + the layer's standard shadow. Menus, popovers, tooltips, toasts stay opaque — blur costs compound during scroll/pointer interaction; new glass surfaces require a governance proposal. `prefers-reduced-transparency: reduce` falls back opaque. `backdrop-filter` is legal ONLY in this form (SY015).

**Concentric-corner rule (mandatory):** when a rounded element sits in the corner region of a rounded container — the inset is smaller than the outer radius, so the two curves visually interact — the inner radius MUST equal the outer radius minus the inset (`inner = outer − inset`). Mismatched nesting is what makes a control read subtly "off". Both radii must come from the scale; when the subtraction lands off-scale, adjust the *inset*, never the radius (SegmentedControl: 8 − 4px padding = 4; Menu: 10 − 6px padding = 4). Insets of 0 share the radius exactly (flush nesting: tight Card headers, ProposalCard band). Elements inset ≥ the outer radius (e.g. a diff block 16px inside a card) are exempt — the corners no longer interact. Free-flowing content (chips wrapping inside a Combobox trigger) is exempt; the rule binds corner-anchored structure: segments, menu items, banded headers, attached groups.

---

## 6. Motion

Motion confirms causality; it never decorates. Durations: `instant` 100ms (hover, focus) · `fast` 150ms (dropdowns, tooltips) · `base` 200ms (modals, drawers, accordions) · `slow` 300ms (page-level transitions, toasts).

**Finish rule (mandatory):** every interactive element transitions its background, border-color, and color at `instant`–`fast` with `standard` easing — hover and pressed states NEVER snap. Sanctioned micro-treatment: `hover-lift` on interactive Cards only — translateY(−1px) + `shadow.raised` at `fast`; no scaling, no bounce, anywhere.

**Entrance rule (mandatory):** floating layers enter with a 4px translate + fade — menus/popovers/palette rise (`translateY(4px)→0`) at `base`; toasts slide in from the right (`translateX(8px)→0`) at `slow`; tooltips fade only. No entrance exceeds one duration step; nothing "springs". Exits are plain fades at `fast` — leaving must feel quicker than arriving.

- Easing: `standard` for most; `enter` for elements appearing; `exit` for elements leaving.
- Animate only `opacity` and `transform`. NEVER animate layout properties (width/height/top/left) except accordion height.
- NEVER animate large data regions (table sorting, filtering results) — data updates snap.
- Respect `prefers-reduced-motion`: all non-essential motion collapses to opacity fades ≤100ms.

---

## 7. Iconography

- Single icon family, stroke-based, 1.5px stroke at 20px grid (Lucide). The usable set is the **closed concept→icon registry in `icons.md`** — unlisted concepts get no icon; unlisted Lucide names are violations.
- Sizes: 16px (inline, compact controls), 20px (default controls, navigation), 24px (empty states, feature moments). No other sizes.
- Icons inherit text color of their context. Icon-only buttons MUST have an accessible label and are only allowed for actions from the approved icon-action list (`components.md` §Button).
- NEVER use emoji as UI iconography.

---

## 8. Accessibility baseline

**Documented deviation — solid status labels.** By explicit maintainer decision, white text on `success`/`warning`/`danger` solid fills runs ~3.4–3.5:1 — below AA's 4.5:1 for normal text, above the 3:1 hard floor. The deviation is bounded: it applies ONLY to solid Badge labels, solid Banner strips, and danger Button resting state (short labels, never sentences or body text; danger hover darkens back to AA), and the validator enforces ≥3:1 on these pairs while holding 4.5:1 everywhere else. **Weight compensation is mandatory:** text on any solid fill running below 4.5:1 is semibold (600) minimum — low contrast punishes thin strokes hardest (badges: `micro`/600 by default; `lg` solid badges upgrade to 600; solid Banner text is 13px semibold, not `body-sm` regular; danger Button labels are 600 because the resting fill runs ~3.4:1). Solid fills that pass AA (primary, accent) keep their normal label weight. Consequence to keep in view: this line item will surface in any formal WCAG/VPAT audit. If strict conformance becomes a requirement, revert these two fills to their 600-level primitives.

Otherwise, WCAG 2.1 AA is the floor for everything: contrast (see §1.2), visible focus (2px flush ring — 0 offset — on every interactive element, never removed; `border.focus` by default, but Buttons take a lightened box-shadow ring — a ~50% `color-mix` tint of the button’s own color, hugging the corner radius), full keyboard operability, pointer targets ≥ 24×24px (WCAG 2.5.8; the smallest control is 32px, comfortably above the floor), and correct `lang` attributes per region for screen readers to switch synthesis language.

**Focus management.** Deterministic, per overlay type:

- Opening: Modal → the least-destructive actionable control (Cancel in confirms — never the danger button); Drawer → its heading; Menu/Popover/ContextMenu → first item; CommandPalette → its input; Popconfirm → Cancel.
- Closing: focus ALWAYS returns to the triggering element (or its nearest surviving ancestor if it's gone — e.g., after row deletion, the next row).
- Modal and Drawer trap focus; Esc closes only the topmost layer of the z-scale.
- Roving tabindex in composite widgets (Menu, Tree, Table grid nav, ChoiceCard groups, SegmentedControl): one Tab stop per widget, arrows move within.
- Skeletons and disabled regions are not focusable; focus never lands on a placeholder.

## 9. Keyboard shortcuts (closed registry)

Global shortcuts are a closed set; adding one is a proposal:

| Shortcut | Action |
|---|---|
| ⌘K / Ctrl+K | CommandPalette |
| ⌘Enter | Send (Composer, when multiline entry made plain Enter ambiguous — product setting) |
| Esc | Close topmost layer / cancel edit / clear selection (in that priority) |
| ⌘/ | Shortcut reference overlay |

Rules: no single-character global shortcuts (they collide with typing and IME composition); browser-reserved combos (⌘L, ⌘T, ⌘W, ⌘R…) are NEVER overridden; component-scoped keys (arrows, Enter, Space, type-ahead) are defined in each component's spec and don't register globally; every shortcut surfaces in its Tooltip via the kbd slot and in the ⌘/ overlay; shortcuts are identical in both locales (kbd symbols don't localize).
