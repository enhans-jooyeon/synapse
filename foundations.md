# Synapse foundations

Rationale and usage rules for the token layer. Token values live in `tokens/synapse.tokens.json` (canonical) and `tokens/synapse.css` (generated). This document explains *when* and *why* — an agent that only reads the JSON will produce technically valid but poorly judged UI; this file supplies the judgment.

Rule keywords: **MUST** / **NEVER** are machine-enforceable constraints. **SHOULD** indicates strong default, deviation requires stated reason. **MAY** is discretionary.

**Maintainer note — editing a numeric scale (spacing / radius / font-size).** A scale value lives in **four places that must move together**, or it drifts: (1) `tokens/synapse.tokens.json` defines it (source of truth); (2) `tokens/synapse.css` exposes the `--sy-*` variable; (3) `tools/validate.py` lists it in the allowed set (`SPACE_SCALE` / `RADIUS_SCALE` / `FONT_SCALE`) so the gate accepts it; (4) this file's prose describes it. Then rebuild the manifest (`python3 tools/build_manifest.py`) and run the gate. Miss (3) and the gate silently goes stale (renders but un-enforced); miss (1) or (2) and the token doesn't exist or doesn't render. **(1) and (2) are now gated:** `SY020` compares the JSON against the generated CSS per mode and in both directions, so a value that moves in one file and not the other is an error rather than a silent divergence. (3) and (4) are still on you.

---

## 1. Color

### 1.1 Character

Synapse is a neutral, black-key system. The interface is built almost entirely from the gray ramp; color is a scarce resource spent only on meaning. The intended impression is engineered restraint — closer to a precision instrument than a consumer app.

- The primary action color is **black** (white in dark mode). Not blue.
- **Point color: `--sy-brand-point` — graphite, achromatic, mode-inverting.** The system's **identity** accent — achromatic, not a hue. *(Since 2026-07-30 it is no longer the system's only accent: AI-emphasis CTAs took a blue accent, `action.brand-*`. The point color and the brand blue are separate accents with separate jurisdictions — identity objects vs. AI CTAs — and must never appear as alternatives for the same element.)* Because a near-black accent would vanish on a dark page, it inverts by mode: `#1A1A1F` (near-black) in light, `#F2F2F4` (near-white) in dark, and its foreground inverts with it (`--sy-brand-point-fg` / `action.brand-fg` = white in light, near-black in dark). Black stays the everyday brand/action color; the point is used ONLY in two jurisdictions: (1) **brand identity objects** — the workspace monogram tile, the docs-hub/preview brand mark, the sanctioned Artific brand-hero moment, and logo/marketing surfaces; (2) **AI emphasis** — conversational-AI CTAs (`brand` Button: Ask agent / Composer send, max 1/screen) and **active AI running-state indicators** (live-agent beacon, in-progress `ai` ProgressBar via `ai.solid`). **Jurisdiction narrowed 2026-07-30:** the graphite point now covers jurisdiction (1) brand identity objects ONLY; jurisdiction (2) AI emphasis moved to blue (`action.brand-*`, `ai.solid`) — so the one-point-per-screen scarcity rule now governs identity marks, and the separate max-1-brand-CTA-per-screen rule governs the blue AI CTA. It is NOT for general chrome, operational agent actions (Run/Retry/Resume stay primary/black), or as text tint on slate AI surfaces (the 'colors mixed up' rejection still stands — slate remains the AI *surface*; the graphite point is a distinct solid accent on top, never accent-on-slate). Because the accent is achromatic and sits close in value to ordinary dark chrome, scarcity is load-bearing — the one-point-per-screen rule is what gives it its pop.
- **Two blues, split by job: BRIGHT AZURE is brand, MUTED INDIGO is functional.** *(Second re-hue, 2026-07-30 — supersedes the graphite→indigo change earlier the same day.)* `action.brand-*` and `ai.solid` take **azure** (`azure.500 #0073E6`, hue 210 at full saturation); `text.link` / `border.focus` / `status.info` keep **indigo** (`blue.600 #3155C6`). Two blues is a deliberate cost, accepted because the jobs are genuinely different — brand is a *filled surface* you act on, functional blue is *text and 1px rings*. They are separated by saturation as much as hue: azure is 100% saturated at 210°, indigo is 60% at 226°. **Do not add a third blue, and never use azure for a link or indigo for a CTA fill** — the split only works if it is absolute. azure.500 is tuned 7% deeper than the old `#0A84FF` brand specifically so a white label clears AA at 4.57:1: the original ran 3.65:1 and would have made brand the fourth member of the §9 solid-label deviation, on the most-clicked control in the product. **Consequence to keep in view:** every azure step lighter than 500 fails white-label contrast, so the brand button **cannot lighten on hover** — it darkens in both modes, unlike `action.primary`. Because it can only darken, the *size* of the step is the only lever: it was softened to `azure.550` (ΔE 8.9, the house step) on 2026-07-31, down from `azure.600` (ΔE 18.5). The **graphite point survives for brand-identity objects only** (`brand.point`: monogram tiles, brand marks, the Artific hero) — that jurisdiction did NOT move.
- Slate (`emphasis.*`, `ai.*` surfaces, and the slate-valued selected states) is the quiet-emphasis family — a barely-cool tint for marking importance without vibrant color. It is NOT a second neutral: never on default surfaces, borders, or text, and only through its closed job list (table emphasis column/cell; timeline/calendar now-markers; selected states; AI surfaces —. The hero-stat-card job was removed). Anti-collision: tint alone never signals AI — the squared avatar is the primary agency marker, supported by `ai.fg` slate marks; `emphasis.*` tokens themselves never appear on AI surfaces (use `ai.*`, same values, distinct semantics).
- **Indigo** (`border.focus`, `text.link`, `status.info` family) is *functional*, not brand: links, keyboard-focus rings on non-entry controls, informational status. **Azure** (`action.brand-*`, `ai.solid`) is brand and AI emphasis: conversational-AI CTAs and active running-state indicators. See the two-blues bullet above — the split is by *job and render mode*, never mixed. AI *surfaces* stay slate (`ai.surface` / `ai.border` / `ai.fg`); AI *emphasis* takes azure; brand-*identity* objects take the graphite point (`brand.point`). Three families, three jurisdictions. Functional indigo exists because pure monochrome cannot signal interactivity and focus accessibly. A blue beacon (`ai.solid`, azure) on a slate tray is the sanctioned pairing; **azure-as-text on a slate surface remains forbidden** — the 'colors mixed up' rejection still stands. Costs accepted with the azure re-hue: `action.brand-fg` is no longer mode-inverting (white in both modes), and the system now carries two blues, which is why the never-mix rule is absolute. All three brand fill states clear AA with white (4.57 / 5.30 / 8.22), so normal label weight holds and no §9 deviation applies. Exception: entry surfaces focus with the neutral `border.focus-input` perimeter — a text field shows focus on every click-to-type, and the caret + fill change + border swap form a compound indicator that doesn't need the accent.
- Status colors sit inside the neutral field without shouting, but they are chromatic, not muddy (recalibrated): text tokens carry as much chroma as AA contrast on their tints allows, and all solid fills are mid-tone with white `text.on-solid` text — success/warning solids run ~3.5:1 under the documented solid-label policy (§9); **danger left that policy on 2026-07-30 and now clears AA at 4.62:1 on its own.**

### 1.2 Rules

- Agents MUST use semantic tokens (`--sy-bg-*`, `--sy-text-*`, `--sy-icon-*`, `--sy-border-*`, `--sy-action-*`, `--sy-status-*`). Raw hex values and primitive ramp references are NEVER allowed in generated UI.
- One screen region SHOULD contain at most one solid-fill accent element (e.g. one primary button). Everything else uses outline, ghost, or text styles.
- Status colors are for status only. NEVER use `--sy-status-danger` for decoration or `--sy-status-success` as a generic "green accent."
- Solid red fills (`danger-bg-solid`) are reserved for destructive confirmation buttons.
- **Data visualization MUST use `--sy-viz-1` … `--sy-viz-8`, assigned in order without skipping — and ONLY in charts.** *(Rebuilt 2026-07-30.)* The palette is optimised for **discriminability, not harmony**, reversing the previous "muted saturation by design — must not compete with status colors" rule. That rule produced a minimum pairwise ΔE of **16.6** (a categorical palette needs 25–30) and one member at **chroma 7** — effectively grey, which reads as "no data" rather than as a category. Now: min ΔE **45.8** normal / **11.6** deuteranopia / **22.7** protanopia in light mode, **51.9 / 27.4 / 19.5** in dark, lightness spread 36–37 L*, chroma floor 37. **Lightness alternates by position deliberately** — lightness is the channel that survives colour-vision deficiency, so same-family hues (green L*65 vs lime L*30) are split far apart rather than left adjacent. **Values are per-mode:** the light set is measured against white, the dark set against `#09090B`; one shared set left the darkest members nearly invisible on a dark page. **Viz colours are chart-only — NEVER as text and NEVER in UI.** UI identity tints are the separate `category-*` family (see below); that decoupling is what removed the need for muting in the first place, since the old collision risk existed only because chart colours appeared as badges. If a chart encodes status (pass/fail, healthy/degraded), use status tokens instead of viz tokens.
- **UI category tints use `--sy-category-{1..8}-bg` + `--sy-category-{1..8}-text`** — deterministic hash, system-assigned, never hand-picked. They draw `ramp.100` / `ramp.700` from eight UI hues (blue, green, amber, red, purple, teal, magenta, slate), so every tint/text pair is gate-checked at AA (4.61–7.22:1) — the retired `viz-*-bg` / `viz-*-text` literals never were. Three of the eight are the status hues; a category badge still cannot be mistaken for a status because status labels are a **closed vocabulary** (`content.md` §3.3) — a badge reading "Billing" is not a status regardless of hue.
- **Naming: the text scale is `text-*`; a compound `<family>-fg` means something different.** *(Renamed from `fg-*` 2026-07-30.)* The standalone scale is `--sy-text-{primary,secondary,tertiary,placeholder,disabled,link,on-inverse,on-solid,link-on-inverse}` — text only, matching Atlassian `color.text.*`, Carbon `text-*`, Polaris `--p-color-text`. But `action.primary-fg`, `ai.fg`, `emphasis.fg` and `brand.point-fg` **keep the `-fg` suffix on purpose**: there it means *"the foreground that pairs with this family's fill"* — the same relational concept as Material's `onPrimary` or Carbon's `text-on-color` — which is a different idea from a position on the text scale. **Rule: `text-*` is a scale; `<family>-fg` is a pairing.** Also renamed in the same pass: the five *"for use on inverted"* tokens took the `-on-inverse` suffix (`text-on-inverse`, `icon-on-inverse`, `status-*-on-inverse`, `text-link-on-inverse`) so `-on-*` consistently marks that sense, matching the existing `text-on-solid`; `bg-inverse` keeps its name because it IS the surface, not something used on one. And `radius-10` — a raw pixel literal inside a t-shirt scale — became `radius-control-md`, named for its only job.
- **Identity is not colour-coded.** *(The `category-*` token family was removed 2026-07-30.)* Avatars, taxonomy Badges/Chips and calendar event dots take **`bg.sunken` + `text.secondary`** — one neutral treatment, no hash. The removed family assigned one of eight hues by hashing a label, which meant the token number carried no meaning (`category-5` meant "hash slot 5", which happened to be purple) and the mapping was an **undocumented stability contract**: changing the hash, the slot count, or a label would have silently recoloured every existing tag. Against §1.1's rule that *colour is a scarce resource spent only on meaning*, an arbitrary hash hue is decoration. Identity now reads from the **shape** (squared avatar = agent, round = human) and the **label**, which were always the load-bearing channels. Dropping it also removed the `purple`/`teal`/`magenta` ramps, whose only consumer it was.
- **Icons use `--sy-icon-*`, not `--sy-text-*`.** *(Dedicated family added 2026-07-30, reversing the earlier "icons draw from the foreground scale" rule.)* A separate icon family is what Atlassian (`color.icon.*`), Carbon (a distinct Icon token category) and Polaris (`--p-color-icon`, deliberately a different value from `--p-color-text`) all do; Material 3 is the outlier that unifies them under `onSurface`. **The reason is optical weight:** a 1.5px stroke icon is more contiguous dark area than a text glyph, so at equal value it reads heavier. `icon.primary` therefore sits **one ramp step less extreme than text** — lighter in light mode (`gray.900` vs black `text.primary`), darker in dark mode (`gray.200` vs near-white). Old Synapse (`#000000` text / `#262627` icon) and Polaris (`#303030` / `#4A4A4A`) independently reached the same correction in the same direction. This is the colour counterpart of the **−2px icon padding trim** already in §5 — the same perceptual fact, previously handled for space but not for colour. **Only `icon.primary` carries its own value; the rest ALIAS `fg.*` / `status.*`** — the old system shipped 22 hand-maintained tokens of which 8 of 10 comparable pairs were byte-identical, and aliasing keeps the API surface (icons can be retuned later without a breaking change) while making that 80% duplication structurally impossible. Meaningful icons clear the WCAG 1.4.11 3:1 floor; all nine pairs are gated.
- Text on colored status backgrounds MUST use the paired status foreground token, never `text.primary`.
- All text/background pairings MUST meet WCAG 2.1 AA (4.5:1 body, 3:1 large text ≥18px semibold or ≥24px). The semantic pairs in the token file are pre-verified; novel combinations are forbidden, which makes verification unnecessary.

### 1.3 The layering model

Every surface sits on exactly one of five levels. Backgrounds express depth in dark mode; borders and shadows express it in light mode — the level tokens handle both automatically.

| Level | Token | Light | Dark | Used for |
|---|---|---|---|---|
| L0 | `bg.page` | white | black | The page itself. |
| L1 | `bg.surface` | gray-50 | gray-950 | Grouping regions: sidebar, table headers, toolbars, flat cards. |
| L2 | `bg.raised` | white + border | gray-900 | Cards, modals, drawers, menus — anything with its own boundary. |
| L3 | `bg.raised-2` | white + border + shadow | gray-800 | A layer on a layer: popover opened from a modal, nested panel, dragged item. |
| well | `bg.sunken` | gray-100 | gray-950 | Recessed content: code blocks, recessed search fields, skeleton fills, dropzones. (Text Inputs are outlined white, not wells — components.md Input.) |

- Floating layers additionally take the shadow tier matching their behavior (the size-named `xs`–`xl` elevation scale) — shadows communicate *floating*, levels communicate *stacking*.
- Do not invent intermediate grays, and do not skip levels (a popover from a modal is L3, not L2 again — in dark mode two L2 surfaces would visually merge).
- Interaction tints (`bg.hover`, `bg.active`, `bg.selected`, `bg.selected-hover`) apply *within* a level; they are not levels.

### 1.4 Token selection map — which token for which case

The full semantic vocabulary by use case. If a case isn't here and no token obviously fits, that's a proposal — not a raw value.

| Case | Token(s) |
|---|---|
| Page / grouping region / card / layer-on-layer / recessed well | `bg.page` / `bg.surface` / `bg.raised` / `bg.raised-2` / `bg.sunken` |
| Row or item hover · pressed · selected · hover on selected | `bg.hover` · `bg.active` · `bg.selected` · `bg.selected-hover` |
| Disabled control fill · disabled text · disabled border | `bg.disabled` · `text.disabled` · `border.subtle` |

**Disabling is a token change, never an opacity change.** `opacity: .5` / `.4` on a disabled control — shadcn's `disabled:opacity-50`, applied across its whole library — is forbidden system-wide, and it is the one migration rule that cannot be expressed as a token swap. Replace it with the three tokens above: `bg.disabled` fill, `text.disabled` label, `border.subtle` perimeter, plus `icon.disabled` for any glyph. Reasons it is a substitution and not a rename: (1) opacity multiplies through to **every** descendant, so a disabled Card dims its own borders, shadows, focus rings and any nested status colour by the same factor, producing values that exist in no ramp and pass no contrast check; (2) the result depends on whatever sits *behind* the element, so the same disabled control renders differently on `bg.page` and `bg.sunken`; (3) a semi-transparent control still composites its original hue, so a disabled `danger` button stays recognisably red and keeps signalling danger. The token treatment is deterministic, mode-correct, and reads as one unambiguous state. Disabled text is exempt from WCAG 1.4.3, which is why `text.disabled` may sit below 4.5:1 — but only because it is *stated* disabled, not merely faded.
| Default text · supporting text · timestamps/hints · placeholder & mixed-value marker | `text.primary` · `text.secondary` · `text.tertiary` · `text.placeholder` |
| Links · links on `bg.inverse` strips | `text.link` · `text.link-on-inverse` |
| Icons (all) | `icon.primary` / `icon.secondary` / `icon.tertiary` / `icon.disabled` / `icon.on-inverse` + `icon.{info,success,warning,danger}` |
| Component boundaries · inner dividers · bordered-element hover | `border.default` · `border.subtle` · `border.strong` |
| Focus ring · selected-card outline · invalid-field border | `border.focus` · `border.selected` · `border.error` |
| Primary button rest/hover/pressed + text | `action.primary-bg` / `-hover` / `-active` + `action.primary-fg` |
| AI action button rest/hover/pressed + text | `action.brand-bg` / `-hover` / `-active` + `action.brand-fg` |
| Destructive confirm fill + text | `status.danger-bg-solid` + `action.danger-fg` |
| Status text/icon · status tint · status solid fill · text on solid | `status.*` · `status.*-bg` · `status.*-bg-solid` · `text.on-solid` |
| Status/link colors on `bg.inverse` surfaces | `status.*-inverse` · `text.link-on-inverse` |
| Agent surfaces · agent borders · agent text/marks | `ai.surface` · `ai.border` · `ai.fg` |
| Quiet emphasis (hero stat, table emphasis column, now-markers) | `emphasis.surface` · `emphasis.border` · `emphasis.fg` |
| Categorical chart series (fixed order, **charts only**) | `viz-1` … `viz-8` |
| Modal backdrop · inverse emphasis block | `bg.scrim` · `bg.inverse` + `text.on-inverse` |
| Identity marks (avatars, taxonomy Badges/Chips, calendar event dots) | `bg.sunken` + `text.secondary` — **neutral, never colour-coded** |

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

**Loading.** Faces are wired in two files, both shipped with the harness so a render never depends on what the viewer has installed: `tokens/fonts.css` `@import`s Pretendard + JetBrains Mono from jsDelivr (both OFL — self-hostable later by swapping the imports for local `@font-face` against `assets/fonts/`), and `tokens/synapse.css` declares the Artific `@font-face` against `assets/fonts/` (commercial, gitignored — see the licensing note above). `preview.html` links both stylesheets; a consuming product imports both.

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
- Hierarchy within one surface needs at least a 2-step style gap or a color change (`text.primary` vs `text.secondary`) — adjacent styles alone (16 vs 14) read as an accident.
- NEVER use weights other than 400/500/600/700; NEVER 600+ for body-length text; NEVER a raw `font-size` where a style exists.
- Stat styles always carry `tabular-nums`; they are for numerals and units, not sentences.

### 2.3 Bilingual (KO/EN) rules — non-negotiable

These exist because Korean and English versions of the same string differ systematically: Korean is often 10–20% wider for UI labels, has taller glyphs, no italics, and different truncation behavior.

1. **No fixed-width text containers.** Buttons, tabs, badges, menu items MUST size from content plus padding. Minimum widths are allowed; fixed widths are NEVER allowed on anything containing translatable text.
2. **No italics, ever.** Hangul has no italic form; synthetic oblique is illegible. Emphasis = weight 600 or `text.primary` against secondary text. The CSS layer force-normalizes `<em>/<i>`.
3. **Line heights are floors.** The paired line-height in the scale accommodates Hangul ascent/descent. NEVER tighten. Custom `line-height < 1.4` on body text is forbidden.
4. **Korean line breaking:** `word-break: keep-all; overflow-wrap: break-word;` on all Korean text (applied via `:lang(ko)` in the CSS layer). Mark language on the document or region root with `lang="ko"` / `lang="en"`.
5. **Layouts must survive +25% text width.** When designing any label-bearing component, verify the layout at 125% string length. If it breaks, the design is wrong, not the translation.
6. **Truncation:** single-line ellipsis truncation is allowed only in table cells and list rows, and every truncated string MUST be recoverable (tooltip or detail view). NEVER truncate buttons, form labels, error messages, or headings.
7. **No ALL-CAPS styling.** `text-transform: uppercase` does nothing to Hangul, so mixed-language UI renders inconsistently. Hierarchy comes from size/weight/color instead.
8. **Avoid text in images/icons.** All rendered text must be live text so it can localize.
9. **Line balancing.** Display styles, `heading-xl/lg`, and hero/empty-state explanation paragraphs take `text-wrap: balance` — short multi-line text breaks into even lines instead of one long line with an orphaned fragment. This matters doubly in Korean, where `keep-all` preserves words but produces extreme rag on centered short text. Long-form body text is exempt (balancing is for ≤ ~4 lines); use the `.sy-balance` utility on hero paragraphs.

---

## 3. Spacing

4px base grid with 2px fine steps at the low end (2/6/10); the scale is enumerated in `--sy-space-*` and runs 0 → 384px (aligned to the BeyondUI / Tailwind spacing primitives). Tokens are named **Tailwind-style, by 4px-multiplier index** — `space-1` = 4px, `space-4` = 16px (1rem), `space-96` = 384px — so the numeric name matches an LLM's Tailwind muscle memory. The three sub-grid fine steps are written with an underscore (`space-0_5` = 2px, `space-1_5` = 6px, `space-2_5` = 10px), because a bare dot is invalid in a CSS custom-property name.

**Padding tokens.** `--sy-padding-{none,2xs,xs,sm,md,lg,xl}` are a **semantic alias layer over the spacing scale** — `padding-md` = `space-4` (16px) — for expressing container/component padding by *intent* rather than a raw step; they reference the space primitives and never redefine a value. Sizes: `2xs` 4 · `xs` 8 · `sm` 12 · `md` 16 · `lg` 24 · `xl` 32 (+ `none` 0). Role-specific paddings (`control-padding-x-{xs,sm,md,lg}` — **stepped per size as of 2026-07-30**, 8/10/12/16; `card-padding`; `page-padding`) stay for their named components. The bare `control-padding-x` is a deprecated alias for the `md` step. Off-scale values (e.g. 18px, 25px, 36px) are NEVER allowed. One sanctioned exception: ±1px as a hairline offset paired with a 1px border (e.g. a tab's active underline overlapping its container rule). A second sanctioned optical exception: a **−2px leading/trailing icon trim** — any inline control or row with a leading icon (or trailing chevron/affix) trims that side's padding by 2px, because a 16px stroke icon's internal whitespace makes symmetric padding read icon-heavy. Applies per side; square icon-only controls are exempt (Button §28 is the canonical case, now generalized to Select/Combobox/DatePicker triggers, Menu items, nav items, Chips, Tabs, Banner, and Toast).

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

## 5. Radius

Containers use the t-shirt scale; **controls use a size-relative control radius, not one fixed value.** Containers: squared `none` (0) · tiny insets `xs` (4px) · nested elements (segments, menu items, quote) `sm` (8px) · menus, trays, and assembled controls (SegmentedControl, Composer tray) `md` (12px) · cards `lg` (16px) · modals/drawers `xl` (20px) · **section shells `2xl` (24px)** · pills/avatars `full`. Controls (button, input, Select/Combobox trigger): `xs` size → **`control-xs` (6)** · `sm` size → `sm` (8) · default → **`10`** (`control-md`) · `lg` size → `md` (12); the smaller Chip (24px) stays `sm` (8). The 12px `md` read too round on 32–36px controls, so the default control corner is the off-4px-step **`10`** — a size variant varies its radius (this retires the old "one radius per component" rule). **The control radii are near-proportional to height on purpose:** radius÷height runs 0.250 (`xs` 6/24) / 0.250 (`sm` 8/32) / 0.278 (`md` 10/36) / 0.300 (`lg` 12/40), so no size reads squarer or rounder than its neighbours. `xs` used `xs` (4) until 2026-07-31, which put it at 0.167 — a third below the band — and it read visibly squarer; **`6` is the second sanctioned off-4px-scale control step**, added for the same optical reason as `10`. Reusing `sm` (8) was rejected: at 0.333 it would have made the smallest control proportionally the roundest, overshooting `lg`. **Radius reads relative to height, not just component tier:** short, wide notice strips (Banner, Toast) sit at roughly control height, so they take the control radius `md` (12px), NOT the card `lg` — a card-scale radius on a ~40px strip curves a third of its half-height and reads disproportionately round. Match radius to the element's shorter dimension. `xl` is the ceiling for rectangular containers and is reserved for section shells — the outermost rounded well a page region sits in (SplitPanel container, content wells, hero/empty wells): one shell level per region, never on cards or overlays, never nested inside another shell. Shells pad ≥ `space-6`, which keeps the concentric-corner rule from binding their children.

**Concentric-corner rule (mandatory):** when a rounded element sits in the corner region of a rounded container — the inset is smaller than the outer radius, so the two curves visually interact — the inner radius MUST equal the outer radius minus the inset (`inner = outer − inset`). Mismatched nesting is what makes a control read subtly "off". Both radii must come from the scale; when the subtraction lands off-scale, adjust the *inset*, never the radius (SegmentedControl: 12 − 4px padding = 8; Menu: 12 − 4px padding = 8). Insets of 0 share the radius exactly (flush nesting: tight Card headers, ProposalCard band). Elements inset ≥ the outer radius (e.g. a diff block 16px inside a card) are exempt — the corners no longer interact. Free-flowing content (chips wrapping inside a Combobox trigger) is exempt; the rule binds corner-anchored structure: segments, menu items, banded headers, attached groups.

---

## 6. Elevation & borders

Synapse is **borders-first**: in-flow hierarchy is drawn with 1px borders and background steps, not shadows.

- `border.subtle` — dividers inside components (table rows, list separators).
- `border.default` — component boundaries (cards, inputs, table frames). Hairline-quiet.
- `border.strong` — hover state on interactive bordered elements.
- `border.overlay` — floating layers (menus, popovers, toasts, tooltips): **transparent in light mode** — the soft shadow carries the edge — visible in dark mode, where shadows die against black.

**Scrollbars:** quiet by law — thin (8px), trackless, borderless: thumb only, `border.strong` on a transparent track, radius `full`, `icon.tertiary` on hover; scroll buttons hidden. One global rule (`scrollbar-width: thin; scrollbar-color` + the `::-webkit-scrollbar` set) — never styled per component, never given a track fill or border. Native chrome scrollbars are the one default the borders-first rule does NOT extend to: a bordered track draws a permanent frame around content that only sometimes scrolls.
- Shadows are reserved for elements that float above the page. The elevation scale is size-named `xs`–`xl` (referenced against the BeyondUI / Tailwind scale): `xs` (resting — the `elevated` Card, sticky bars), `sm` (hover/lift on interactive Cards and draggable tiles), `md` (shallow floating — menus/popovers close to the surface), `lg` (standard floating — dropdowns, popovers, tooltips — soft, large-blur), `xl` (deep — dialogs, drawers). NEVER put shadows on static cards, buttons, or inputs (Card `elevated` excepted).
- `shadow.thumb` is a dedicated control token: a firm grounding drop plus a symmetric ambient halo so a borderless handle riding on a track (Slider thumb) defines its full circumference against a same-value background. Unlike the directional float shadows it carries an all-around component so the top edge reads. Scoped to draggable knobs on tracks — not general elevation.
- Sanctioned exception: a zero-blur `0 0 0` box-shadow ring using a token — inset (a border substitute where a true border would shift layout, e.g. calendar day cells) or outset (a focus ring, e.g. Buttons) — is not elevation and carries no blur; elevation needs blur, i.e. a `shadow.*` token. **A focus ring MUST NOT be lightened with `color-mix`** — the clause that permitted it was deleted 2026-07-30 after measurement: a 50% lightened tint of the element's own colour failed WCAG 1.4.11's 3:1 floor in **11 of 12 Button cells**, including `secondary × default` at 1.04:1 and `outline × default` at 1.10:1 — effectively invisible rings on the two most-used variants. Rings use their token at full strength. Box-shadow rings are used over `outline` where the ring must follow `border-radius` (outline leaves a gap at rounded corners). **Focus rings are offset 2px from the element:** the outset ring is drawn as two stacked box-shadows — an inner `0 0 0 2px var(--sy-bg-page)` gap ring, then the colored `0 0 0 4px` ring — so the ring reads detached rather than fused to the edge (the transparent `outline` carries a matching `outline-offset: 2px` for forced-colors mode). The gap ring uses the surface the control sits on (`bg.page` default); override it to the actual surface token when a focusable control sits on `bg.surface`/`bg.raised`.
- **Stacking:** floating/pinned elements take exactly one `--sy-z-*` token — `sticky` (100, table headers, toolbars, solid Banner strip) < `dropdown` (200, menus/popovers/palette) < `drawer` (300) < `modal` (400) < `toast` (500) < `tooltip` (600). Arbitrary z-index values are forbidden; if two things fight, the fix is the scale, not a 9999.

**Floating overlays are opaque — no true glassmorphism.** CommandPalette is an **opaque `bg.raised` panel over a `bg.scrim` backdrop** (radius `lg`, `border.default` hairline, `shadow.xl`); the scrim gives the separation on a mostly-light app, and esc / scrim-click / click-away dismiss. **AppLauncher uses a faux-glass surface** — an OPAQUE frosted tint (`glass.surface`) + a top inner-rim highlight (`glass.rim`, `inset 0 1px 0`) + soft `glass.border`, so it *reads* as macOS-Launchpad frosted glass without any translucency. This is not real glass: there is **no `backdrop-filter`** (SY015 still holds); the frost is baked into an opaque token, not inherited from content behind. The Composer follow-up panel is also solid `bg.raised` (`border.default` + `shadow.lg`) — small, dense, over thread text. Modal and Drawer are opaque `bg.raised` behind their scrim. Menus, popovers, tooltips, toasts are opaque.

**Why not glass:** a translucent surface inherits whatever sits behind it, which in an austere, mostly-light UI reads either muddy (light-on-light) or as a heavy dark slab (dark-on-light) — and every child element (input, selection, keycaps, chips) then needs per-surface restyling. The cost outweighs the effect, so *real* (translucent, blurred) glassmorphism is not used. **`backdrop-filter` is forbidden (SY015).** Instead, the frosted look is faked with OPAQUE tokens: **`glass.surface` / `glass.rim` / `glass.border` are live** (AppLauncher's faux-glass surface); the translucency tokens `glass.blur` / `glass.filter` and `shadow.glass` remain **dormant — do not apply them.** Reintroducing a translucent or dark overlay surface would require a first-class inverse-surface context (all components carrying an on-dark variant), which is a governance proposal, not an ad-hoc surface.

---

## 7. Motion

Motion confirms causality; it never decorates. Durations: `instant` 100ms (hover, focus) · `fast` 150ms (dropdowns, tooltips) · `base` 200ms (modals, drawers, accordions) · `slow` 300ms (page-level transitions, toasts).

**Finish rule (mandatory):** every interactive element transitions its background, border-color, and color at `instant`–`fast` with `standard` easing — hover and pressed states NEVER snap. Sanctioned micro-treatment: `hover-lift` on interactive Cards only — translateY(−1px) + `shadow.xs` at `fast`; no scaling, no bounce, anywhere.

**Entrance rule (mandatory):** floating layers enter with a 4px translate + fade — menus/popovers/palette rise (`translateY(4px)→0`) at `base`; toasts slide in from the right (`translateX(8px)→0`) at `slow`; tooltips fade only. No entrance exceeds one duration step; nothing "springs". Exits are plain fades at `fast` — leaving must feel quicker than arriving.

- Easing: `standard` for most; `enter` for elements appearing; `exit` for elements leaving.
- Animate only `opacity` and `transform`. NEVER animate layout properties (width/height/top/left) except accordion height.
- NEVER animate large data regions (table sorting, filtering results) — data updates snap.
- Respect `prefers-reduced-motion`: all non-essential motion collapses to opacity fades ≤100ms.

---

## 8. Iconography & illustration

- Single icon family, stroke-based, 1.5px stroke at 20px grid (Tabler Icons, outline set — down-weighted from Tabler's 2px default to 1.5). The usable set is the **closed concept→icon registry in `icons.md`** — unlisted concepts get no icon; unlisted Tabler names are violations.
- Sizes: **12px** (metadata scale — status glyphs inside Badges, source-type marks in provenance rows, and any icon paired with 11–12px text), 16px (inline, compact controls), 20px (default controls, navigation), 24px (empty states, feature moments). **No other sizes** — 10, 11, 14 and 18 are off-scale.
- **12 was added 2026-07-30, resolving a contradiction rather than relaxing the rule.** The scale previously read "16 / 20 / 24, no other sizes" while `components.md` simultaneously specified 12px icons in two places — Badge's `with-icon` option ("12px registry status icon") and the SourceChip sources row ("12px source-type icon") — and `preview.html` carried 92 off-scale icon renders, 55 of them at 12. The spec was already broken; the choice was to add the step or delete the components that need it. 12 is the honest floor: below it a 1.5px stroke on a 24-unit grid loses its interior detail and the glyph reads as a smudge, which is why 10 and 11 are excluded rather than merely discouraged. **Corollary for controls:** a 24px `xs` Button cannot carry a 16px icon without swallowing the control, so `xs` icons take 12. The 20 step remains unassigned to any control height and exists for navigation and standalone use.
- Icons inherit text color of their context. Icon-only buttons MUST have an accessible label and are only allowed for actions from the approved icon-action list (`components.md` §Button).
- NEVER use emoji as UI iconography.

**8.1 Illustration — curated spot graphics (the one expressive-graphic tier).** Illustration is the icon line language drawn at scene scale, for the handful of moments a surface is otherwise empty or introductory and a human benefits from warmth or orientation.

- **Where — closed set.** Only in: (a) **EmptyState**; (b) the **Guided archetype** — onboarding / first-run heroes and feature-intro cards (`patterns.md` §1); (c) **full-page status states** — error, success/confirmation, and permission/access walls. One illustration per surface. This is the *same* expressive tier that permits pill buttons and `lg` Badges — illustrations ride it, they do not open a second boundary. **FORBIDDEN** in dense or data surfaces (tables, lists, dashboards, toolbars), repeated card/row grids, navigation chrome, and inline within populated content — repetition turns illustration into noise, and density fights it.
- **Style.** Single-weight **1.5px stroke** line art in the icon language; never scale the stroke with the drawing. **Achromatic — always, no exceptions:** the **ink** — every object outline and any detail/content line (e.g. writing on a document) — is `text.primary`; **grey line is reserved for depth only** (a stacked/back layer or recessive edge, `border.default`), never the content itself. Neutral fills only (below). Illustrations never take a status or brand color — not even the error spot; error reads by its motif and the surrounding copy (title + Retry), never by a red drawing. **A stacked/back layer may sit at a slight angle** (~5–8°) for the layered depth seen in the reference cards — keep the tilt gentle and reserve it for the background layer; the primary/foreground object stays upright.
- **Corners follow the object, not the token radius scale.** Illustration corners are artistic, not bound to the component radius tokens: geometric or technical forms (a cube, nodes, a connector) take **sharp corners** (miter joins, small or zero radius); containers and cards may stay lightly rounded. Default toward crisp over soft — the system's engineered character reads better in precise line-work than in uniformly rounded shapes.
- **Fill — at least one, always.** Every illustration MUST carry **at least one visible neutral fill** — a `bg.sunken` recess or stacked layer, or a `bg.page`/`bg.surface` face that reads against the page. A purely line-only spot is not permitted; it looks unfinished beside filled ones and breaks the set's cohesion. But fill **sparingly** — typically a single element, not every shape: a filled surface is an accent that adds dynamism, and filling everything flattens the drawing (at least one, never all). Fills are light neutrals only (`bg.page`/`bg.surface` for raised faces, `bg.sunken` for recesses or a stacked layer behind), giving body and a subtle two-tone depth (an image-placeholder panel, a card face, a tray pocket). Never a saturated, brand, or status fill; never a gradient; never glow. Fills sit behind the strokes; the piece still reads as line art.
- **Size.** EmptyState spots ~112×80; Guided / feature illustrations may run larger (up to ~200 wide) at the same stroke weight.
- **Action badge (optional).** An illustration whose surface exists to perform one action MAY carry a single badge — the registry icon for that action (e.g. `plus`) in a filled `bg.inverse` (graphite) circle, top-right. Max one; it is that surface's one primary affordance.
- **Motifs are governance-gated.** Each context draws from a closed motif set (EmptyState's lives in `components.md`); a new motif is a proposal, never improvised.
- **Out of scope.** Gradient or atmospheric *backdrops* behind illustrations are NOT part of this language — gradients remain forbidden (§9 / `design.md` §8); expressive backdrops are handled outside Synapse.

---

## 9. Accessibility baseline

**Documented deviation — chart series contrast.** The eight `viz-*` chart colours are gated at **2.5:1** against the page, not the **3:1** that WCAG 1.4.11 (non-text contrast) and both Carbon and Cloudscape apply to categorical palettes. Reason: at 3:1 no chart colour can be light, and any warm hue collapses to olive or brown — the palette became legible but muddy. The deviation is bounded to chart marks only, never to UI, text or borders, and identification never rests on colour alone (labels, legends and series filters are required). The validator enforces ≥2.5:1 on these eight pairs and 3:1+ everywhere else. **Consequence to keep in view:** like the solid-label deviation below, this will surface in a formal WCAG/VPAT audit. If strict conformance becomes a requirement, the fix is to re-derive the palette at a 3:1 floor and accept the darker, browner warm hues — a version of that palette was measured at min ΔE 31.4 and is a viable fallback.

**Documented deviation — solid status labels. Narrowed to `success`/`warning` on 2026-07-30 — DANGER NO LONGER DEVIATES.** By explicit maintainer decision, white text on `success`/`warning` solid fills runs ~3.4–3.5:1 — below AA's 4.5:1 for normal text, above the 3:1 hard floor. The deviation is bounded: it applies ONLY to solid Badge labels and solid Banner strips (short labels, never sentences or body text), and the validator enforces ≥3:1 on those two pairs while holding 4.5:1 everywhere else. **Weight compensation is mandatory:** text on any solid fill running below 4.5:1 is semibold (600) minimum — low contrast punishes thin strokes hardest (badges: `micro`/600 by default; `lg` solid badges upgrade to 600; solid Banner text is 13px semibold, not `body-sm` regular). Solid fills that pass AA (primary, accent, **and now danger**) keep their normal label weight. Consequence to keep in view: this line item will surface in any formal WCAG/VPAT audit. If strict conformance becomes a requirement, revert these two fills to their 600-level primitives — the same move already applied to danger below.

**Danger left the deviation (2026-07-30).** `status.danger-bg-solid` was shifted `red.400 #DB504D` → `red.500 #D2403E`, and its hover `red.500` → `red.600 #B23230`. A white label on the resting fill now runs **4.62:1** — clearing AA with **normal weight**, so the semibold mandate on danger Button labels is withdrawn. Rationale: the deviation's whole justification is that it applies to short, glanceable labels where weight compensation is adequate mitigation. The destructive **Button** is not that case — it is the confirmation step for irreversible actions, the one control in the system where a misread has consequences, and it was carrying the thinnest contrast in the set at 3.99:1. Rest→hover separation actually *improved* (ΔE 5.9 → 10.1), then was **softened to `red.550 #C23937` on 2026-07-31** (ΔE 5.0, white label 5.34:1) because 10.1 sat above the ΔE 8.6 house hover step and read heavy on a large saturated fill. This also retired the `red.600` sharing with `status.danger` (the danger **text** token) that the earlier step had accepted. Two of the three solid-label deviations remain; danger was the one worth spending a ramp step on.

Otherwise, WCAG 2.1 AA is the floor for everything: contrast (see §1.2), visible focus (2px ring offset 2px from the element — a `bg.page` gap ring inside the colored ring — on every interactive element, never removed; `border.focus` by default; **Buttons key the ring to `target`, at full strength, following the corner radius** — `default` → `border.focus`, `destructive` → `border.error-hover`, `brand` → `action.brand-border-hover` (5.21 / 6.19 / 6.19:1 light, 9.58 / 7.75 / 6.42:1 dark). The ring is independent of `buttonStyle`, so all four styles in one target share it: the ring signals *intent*, which is exactly what `target` means. The earlier lightened-mix rule was removed — see §6.), full keyboard operability, pointer targets ≥ 24×24px (WCAG 2.5.8; the smallest control is 32px, comfortably above the floor), and correct `lang` attributes per region for screen readers to switch synthesis language.

**Focus management.** Deterministic, per overlay type:

- Opening: Modal → the least-destructive actionable control (Cancel in confirms — never the danger button); Drawer → its heading; Menu/Popover/ContextMenu → first item; CommandPalette → its input; Popconfirm → Cancel.
- Closing: focus ALWAYS returns to the triggering element (or its nearest surviving ancestor if it's gone — e.g., after row deletion, the next row).
- Modal and Drawer trap focus; Esc closes only the topmost layer of the z-scale.
- Roving tabindex in composite widgets (Menu, Tree, Table grid nav, ChoiceCard groups, SegmentedControl): one Tab stop per widget, arrows move within.
- Skeletons and disabled regions are not focusable; focus never lands on a placeholder.

## 10. Keyboard shortcuts (closed registry)

Global shortcuts are a closed set; adding one is a proposal:

| Shortcut | Action |
|---|---|
| ⌘K / Ctrl+K | CommandPalette |
| ⌘Enter | Send (Composer, when multiline entry made plain Enter ambiguous — product setting) |
| Esc | Close topmost layer / cancel edit / clear selection (in that priority) |
| ⌘/ | Shortcut reference overlay |

Rules: no single-character global shortcuts (they collide with typing and IME composition); browser-reserved combos (⌘L, ⌘T, ⌘W, ⌘R…) are NEVER overridden; component-scoped keys (arrows, Enter, Space, type-ahead) are defined in each component's spec and don't register globally; every shortcut surfaces in its Tooltip via the kbd slot and in the ⌘/ overlay; shortcuts are identical in both locales (kbd symbols don't localize).
