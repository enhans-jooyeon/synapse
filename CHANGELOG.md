# Synapse changelog

## 6.49.0 — 2026-07-15

- **Docs hub (index.html) — the Vercel app is now the source-of-truth site** (maintainer request). Left-nav across every spec (Overview/design, Foundations, Content, Icons, Components, Recipes, AI patterns, Page patterns, Changelog) + a link to the live component browser (preview.html). The hub fetches the actual .md files at runtime and renders them client-side (marked@12) — no build step, and the docs can never drift from the specs because they ARE the specs. On-page TOC from H2s, light/dark toggle, version read live from tokens $version.
- The hub dogfoods the system: built entirely from --sy-* tokens (passes the same validate.py gate as preview.html — SY001/SY002 clean).
- Vercel: `/` now serves the hub; preview.html remains the live browser, linked from the hub and nav. `.vercelignore` switched from a browser-only allowlist to shipping index.html + preview.html + all rendered .md + tokens.
- Note: runtime .md fetch works on the Vercel origin; confirm on the preview deploy (can't be exercised from the sandbox, which has no served origin reachable by a browser).

## 6.48.0 — 2026-07-15

- **Artific is English-only (hard rule, maintainer):** Artific may style Latin copy only — a `.sy-display`/`sy-type-display*` element must not contain Hangul. New SY016 validator rule enforces it (gate now catches Hangul inside any display element, incl. nested). foundations §2.1 + design.md + content §8 updated.
- **KO localization of an Artific brand title keeps the English copy verbatim:** a short display hero (Guided/empty-state/HOME) is a brand moment, not localizable UI copy — the KO locale renders the same English words in Artific, never translated, never a Pretendard-Korean fallback. The lone documented exception to "all UI text localizes." If a heading must be Korean, it isn't a brand moment: drop Artific, use Pretendard bold at display size.
- Preview: typography specimen replaced its KO Artific example with the rule demo; display-sm specimen sample switched to English; type intro line updated. Gate green.

## 6.47.5 — 2026-07-15

- Vercel deploy config (infra, no spec changes): the deployment is EXACTLY the component browser — allowlist-style `.vercelignore` ships only preview.html + tokens/, and `/` rewrites to preview.html. Specs, tools, proposals, and the stale Storybook scaffold are not deployed (they remain in the repo). Artific stays uncommitted per license; fallback renders by design.

## 6.47.4 — 2026-07-15

- §27 starters: label ≠ insertion — chip shows a short task handle, click inserts the full exemplar prompt (scope/format/constraints). Found by running the reference's interactive demos in a browser (the earlier audit had only static page text): our HOME starters inserted their literal labels, violating our own "model complete prompts" law. Demo-verified findings also confirmed §18/§29/§30 as spec'd; batch demo is sequential-only with no per-item controls (we exceed it).

## 6.47.3 — 2026-07-14

- Assisted-editing menu joins the picker anatomy (maintainer: didn't match the other pickers): `micro-label` header "프롬프트 다듬기" like every other composer menu, general preset row relabeled 전체 다듬기 (a row never duplicates its header), separator before the preset group. §24 + glossary updated; preset SET unchanged.

## 6.47.2 — 2026-07-14

- Thumbs glyph optical centering (maintainer: icon off-center — the 6.47.1 visible fill exposed it): thumbs-up ink is right-heavy, thumbs-down left-heavy; ∓1px translateX on both, all 3 render sites each. Numeral-nudge family rule recorded in ResponseToolbar spec.

## 6.47.1 — 2026-07-14

- ResponseToolbar thumbs select-state: `border.focus` blue circle → `bg.selected` square + `fg.primary` stroke (maintainer question surfaced a v5.2 relic breaking the blue-retreat ruling and the fill+ink selection language; circles remain exclusive to Composer send).

## 6.47.0 — 2026-07-14

Input-pattern audit adoption (proposals/2026-07-14-input-patterns-audit.md — all 22 aiuxplayground input patterns reviewed; 12 already covered, 4 rejected as spec'd there, 8 adopted per maintainer):

- **§27 Prompt starters:** zero-state chips above the Composer (live on HOME: 3 starters + dismiss ×; click inserts, never sends). Laws: model complete prompts, personalize after session one, dismiss persists, gone at first turn.
- **§18 + Selection actions:** the selection pill's closed set is now 답장 · 설명 · 재생성; 설명 composes a quoted follow-up, answers arrive as normal turns — thread history is append-only, rewrites only ever touch the user's own draft.
- **§28 Attachment intelligence:** advisory caption on attachments (shape, not judgment; 자동 요약 marked; pulse while pending; silent fallback; never blocks send). Demo on the Composer story.
- **§29 Batch input + R15:** per-item queue with individual pause/cancel/retry, one failure never aborts, ProposalCard still gates side effects, results Table recipe. New "Batch input" story.
- **§30 Predictive text:** generalizes slash ghost completion — → accepts (never Tab), suppressed during Hangul composition, closed suggestion sources; freeform model continuations need governance (maintainer accepted the IME risk knowingly).
- **§19 chip honesty law (verbatim adoption):** a chip's label IS the query it sends.
- **Active-tools dot:** + button gains a 6px ink dot when toggles deviate from agent defaults — live in the demo (toggle Slack on). Fixes the silent-capability-state cost of nesting tools.
- **Slash discoverability:** composer placeholders gain "· / 명령" — we were committing the reference's top anti-pattern.
- Rejected with rationale (recorded in the proposal): gesture input, voice-to-action, input-mode-toggle (v6.26 dictation-only ruling), tone sliders (§24 closed-preset law).

## 6.46.0 — 2026-07-14

- Quiet scrollbar law (maintainer: remove scrollbar borders — they were native browser chrome; no styling existed): global thin trackless scrollbars — thumb only, `border.strong` on transparent, radius `full`, hover `fg.tertiary`, buttons hidden. Foundations §5 addition; one global rule, never per-component.

## 6.45.1 — 2026-07-14

- Preview repair (maintainer report — composer blocks rendering in every section): the 6.45 model-story replacement left a duplicate `</div>` that closed the Composer story container early, spilling every block after it (assisted-editing menu, recording bar, template trays, …) outside the story scoping. Removed; added a structural audit pass over all 57 stories (each story div must balance before the next begins) — clean.

## 6.45.0 — 2026-07-14

- **Home composer wiring parity** (maintainer report — selectors not appearing): the agent picker was wired only on the Console frame, and the v6.44 footer rewiring had silently DELETED the model-selector popup wiring everywhere (the cut span included the adjacent block). Agent picker, model menu, and the template library now wire generically on every sample frame with a composer tray; picker lookup scoped to `.composer-tray` so it can't grab a stray avatar.
- **Real model names, grouped by provider** (maintainer request, replacing the placeholder K-1 family): menu = provider groups under `micro-label` headers — Anthropic (Claude Sonnet 5 ✓, Claude Opus 4.8), OpenAI (GPT-5.6, GPT-5.5), Google (Gemini 3.1 Pro, Gemini 3.5 Flash) — single-line mono rows, then 자동/에이전트-기본값. Naming law: model names are untranslated English product nouns in mono; provider headers are plain text, not logos (v6.17 keeps logos in connector contexts). Footer buttons show the active model (Claude Sonnet 5).
- Lesson recorded: index-range JS surgery must assert what the cut span contains — a regression test would have caught the dead model button a version earlier.

## 6.44.1 — 2026-07-14

- Compact side padding (12→8) for labeled ghost controls inside the Composer tray — agent picker and model selector (maintainer: sides too wide on 자동 선택). Scoped CSS rule, not a Button variant: `btn-icon` and non-tray ghosts untouched.

## 6.44.0 — 2026-07-14

- **+ composer menu** replaces the paperclip + ⋯ pair (maintainer request): one leading icon opening 파일 첨부 / 템플릿 라이브러리 / 도구. The tray itself remains the drop target, so demoting attach doesn't orphan drag-and-drop.
- **kbd send hint removed from the footer** (maintainer request); the **model selector moves into its slot** on the trailing side — footer reads: + · agent picker · … · model · mic · send. Send behavior unchanged; shortcut teaching moves to tooltip/onboarding.
- **Refine-prompt is now contextual** (maintainer request): pen ghost icon-button floats at the input's top-right (textarea +40px right padding), rendered only while the draft is non-empty — visibility replaces disablement (§24 + icon registry updated). Wired live: typing in any sample composer reveals it; presets/Undo-Toast behavior unchanged. Composer story now shows a filled draft so the state is visible.
- Composer anatomy paragraph rewritten wholesale — the 6.41→6.42 patch-on-patch had left a duplicated agent-picker description in the spec text.
- Glossary +추가.

## 6.43.0 — 2026-07-14

- **Composer footer simplified** (maintainer: too many buttons): leading group is now attach + ⋯ overflow only — 템플릿 라이브러리, 프롬프트 다듬기, and 도구 (with its switch popover) moved into the overflow menu, fully wired in the Console sample. Two visible leading icons is the new default; five remains the hard cap. Attach stays visible as the drop-target affordance.
- **Mic relocated send-adjacent** (maintainer request): trailing side now reads kbd hint · mic · send. Rationale spec'd in §26: dictation fills the message about to be sent, so it belongs with send, not the authoring aids — and it may never be buried in the overflow.
- Composer entry, §26, icon registry (mic jurisdiction), manifest key_rules updated.

## 6.42.0 — 2026-07-14

- **Model selector pulled out of the agent picker** (maintainer reversal of the 6.41 placement): now its own ghost control right of the agent picker — mono model name + chevron; menu = model rows (mono name + 11px caption), separator, 자동/에이전트-기본값 row. Per-conversation, defaults from agent config, org-lockable, never changes permissions or approval rules. Agent-picker rows lose their model captions and 모델 submenu — one object per menu; picker restored to v6.15 anatomy (260px, single-line rows, group label, 모든 에이전트, footer escape — the 6.41 edit had also dropped these).
- **Tools popover retune** (maintainer: awkward proportions): 260→280 (governance note fits one line), group header gets real micro-label padding (the 6.41 header borrowed the palette-scoped `.grp` class, which is a no-op in menus — cramped against the top edge), rows gain leading 16px fg-tertiary icons (search/code from the registry; connector rows use the plug glyph — brand logos need real assets, registry glyph until then).
- Footer cap clarified: the 5-affordance cap covers leading ICON buttons; labeled trailing controls (agent, model) are exempt.
- Two-line menu row law: trailing glyphs align to the FIRST line via a first-line-height (20px) flex wrapper — the toast v6.27.2 precedent — never flex-centered across both lines, never off-scale margin nudges (SY002 caught exactly that in this change's first draft).
- Glossary +모델.

## 6.41.0 — 2026-07-13

- Composer tools affordance (plug icon → popover of per-conversation capability Switches, seeded from agent config). Governance rules: disabling a needed tool makes the agent ask by name — never silent failure or silent re-enable; enabling never bypasses ProposalCard approval for external side effects. Wired live in Console and Home.
- Model selection surfaces INSIDE the agent picker (maintainer choice, refining — not reversing — the agents-encapsulate-models ruling): rows show a read-only mono model caption (configured agents pin their model), and a 모델 submenu applies to 자동 선택 conversations only. No composer model chip.
- Composer footer cap spec'd: five leading affordances maximum (now reached: attach·template·refine·mic·tools), further additions go to a ⋯ overflow.
- Registry +plug; glossary +도구.

## 6.40.1 — 2026-07-13

- Home agent shelf cards: padding 12 uniform → 8 vertical / 12 sides. The two-line text block's line-height slack (label 13/20 + caption 12/18) adds ~4px of built-in vertical air, so numerically-uniform padding read taller than the sides — the optical complement of the uniform-padding rule: when content carries internal leading, the box compensates.

## 6.40.0 — 2026-07-13

- Emphasized stat card REMOVED (maintainer: no slate on stat cards) — the hero-stat job leaves the slate family's closed list (remaining jurisdiction: table emphasis, now-markers, selected states, AI surfaces). Metric grids render uniform; urgency belongs to queues and status colors, not card tint. All three emphasized instances (R4 story, Workbench, Home) reverted; recipes/foundations/patterns/tokens/manifest synced. Note: strictly a variant-treatment removal — recorded as such, migration is deletion of the opt-in.

## 6.39.1 — 2026-07-13

- Home archetype: one-viewport rule (maintainer — no scroll on Home): content is contracted to fit, never scrolled — stat cards compact to stat-sm numerals with 16 padding, agent shelf cards to 12, section gaps 16, greeting inset 24; caps spec'd (≤3 metrics, ≤2 queued proposals then 모두 보기, one shelf row). If content would overflow, cut content — the Composer never leaves view.

## 6.39.0 — 2026-07-13

- New page archetype: HOME (patterns §1F + decision-tree line + screen-intent schema enum). The workspace's start surface: greeting block (the screen's Display moment), hero metric strip with the actionable number emphasized, approval queue first (the human-in-the-loop backlog surfaces here before anywhere else), agent shelf, and the Composer pinned at the bottom — Console anatomy without a thread; sending opens a Console. Suggestion chips explicitly not sanctioned here; an empty Home never shows an EmptyState ("no work" is the good state).
- Home sample page added (first in the Sample pages group) with the shared interactive topbar.

## 6.38.4 — 2026-07-13

- Citation numeral optical nudge (maintainer caught digits riding high): 1px top padding on both numbered circles — inline marker and pill numeral — the same v2.1 Badge md-nudge remedy for Pretendard's 11px digits at line-height 1. Spec'd with the precedent cited so the two nudges stay linked.

## 6.38.3 — 2026-07-13

- Source-type icon restored to pills (maintainer preference, reversing the v6.38.2 retirement): 12px fg.tertiary icon between the numeral circle and the name. The earlier clutter was the naked mono index, not the icon — with the numeral contained, the icon reads as metadata and aids scanning across multiple sources.

## 6.38.2 — 2026-07-13

- Source pill anatomy rebuilt (maintainer: numbers and icons misaligned): the naked mono index + icon-tile pair collapses into one leading 18px page-filled numeral circle — marker↔pill correspondence becomes structural (both are numbered circles), baselines unify, and the type icon retires (the source name carries the scent). Numeral 11/1 semibold tabular sans; name 12/18.

## 6.38.1 — 2026-07-13

- Provenance family goes neutral gray (maintainer): markers and source pills together move from emphasis tint to bg.sunken + fg.secondary — family unity preserved, now on the neutral badge palette; hover uses the gray ladder's next step. The emphasis.surface-hover token (added in 6.38.0 solely for tinted pills, never pushed) is removed rather than orphaned. Suggestion chips keep their v6.38 outlined style.

## 6.38.0 — 2026-07-13

- Style swap between suggestion chips and source pills, shapes retained (maintainer direction — and semantically sounder than before): suggestions go OUTLINED (bg.raised + hairline, fg.primary; actions should read clickable), source pills take the borderless emphasis tint (emphasis.surface + emphasis.fg), unifying them with their emphasis-tinted circular markers into one provenance family. New token emphasis.surface-hover (the family's first interactive fill); icon tiles inside tinted pills go page-filled circular per the tray rule (sunken-on-slate is invisible — third occurrence of that collision).

## 6.37.1 — 2026-07-13

- Sources row layout (maintainer): 출처 micro-label moves from inline-leading to an eyebrow above the row (the reference's "Reference Sources" placement, consistent with the system's eyebrow lockups); source cards become pill-shaped with circular icon tiles — the pill silhouette distinguishes them from the rounded suggestion Chips sharing the Console. Spec notes source pills are ContextCard derivatives, exempt from the Chip family's rounded rule.

## 6.37.0 — 2026-07-13

- Citation markers restyled to the circular superscript form (maintainer reference shots): 18px round chip, emphasis.surface fill + emphasis.fg bare numeral (11 semibold tabular, sans) — the bracketed mono [n] is retired; brackets and mono read as code, not annotation. A citation is quiet emphasis, so the tint is semantically exact. Provenance story's stale text footnote also replaced with the v6.36 sources row. Hover/link highlight steps to ai.surface-hover.

## 6.36.0 — 2026-07-13

- Citations upgraded (maintainer asked for better): the plain-text footnote line is retired — sources render as a row of compact ContextCards (mono index + source-type icon + name) under a 출처 micro-label, and hovering a card highlights its inline [n] markers (and vice versa), turning number-mapping from mental to visual. Inline markers keep their 18px visual but gain an invisible ≥24px hit area — they'd been below the target floor since v5.2. Demo live in the Console sample.

## 6.35.0 — 2026-07-13

- New token emphasis.fg-soft (slate.500 light / slate.400 dark): soft emphasis marks where a fill carries the visual mass — the favorite star moves to it (maintainer wanted lighter than emphasis.fg). Floor stated in the token itself: one step above 3:1 non-text contrast vs surfaces, gate-checked with a new pair — nothing lighter is legal for stateful marks, so this is the end of the lightness ladder. Never for text.

## 6.34.4 — 2026-07-13

- Favorite star active color: fg.primary → emphasis.fg (maintainer: key-black read stark). Semantically exact — favoriting is quiet emphasis, the slate family's defined job. The conventional gold star was considered and passed over: amber is a status color and status colors stay status-only; if the classic gold is ever wanted, it enters as a governed status-color exception, not a default.

## 6.34.3 — 2026-07-13

- Favorite star: active state now renders FILLED (maintainer: stroke+color read inactive). Carved as the registry's one fill-on-active exception — a favorite toggle's job is broadcasting state at a glance; thumbs and every other icon remain stroke-only, and the exception is written into the registry entry so it cannot spread by precedent.

## 6.34.2 — 2026-07-13

- Template Library header padding: 16/24/12 → 16/24/16 (maintainer question exposed the leftover 12 bottom). Ruling nuance recorded: vertical padding is symmetric against the hairline; side padding intentionally differs (24) because it serves cross-alignment with the pane's 24 content column — uniform-all-around applies to compact containers around a single element, not full-width headers with column alignment duties.

## 6.34.1 — 2026-07-13

- Favorite glyph: pin → star (maintainer preference; bookmark was unavailable — it IS the template entry button). Terminology follows the metaphor: 고정됨 → 즐겨찾기, 고정/고정 해제 → 즐겨찾기 추가/해제. Star stays stroke-only in both states per the thumbs precedent (state = color, never fill); registry entry updated.

## 6.34.0 — 2026-07-13

- Template Library: pin system + scope navigation (maintainer: flat 내/팀 groups won't scale, wants favorites). 고정됨 group always renders first — pinning is the volume answer, the working set stays on top; scope SegmentedControl (전체/내 템플릿/팀) under the search keeps each view short; rows get hover-reveal pin toggles (20px compact, aria-pressed; pinned stay visible at fg.primary) mirrored by a pane-header pin. Modal widens to 760 — spec'd as the browse-library width tier in the Modal entry (forms 640 · libraries 760 · wide Drawer 800). Registry +pin; glossary +고정/고정 해제.

## 6.33.0 — 2026-07-13

- Template Library at scale (maintainer stress test; demo grown to 12 templates / 4 owners): fixed 420 body height with an independently scrolling row region (scrollbar at the column edge), sticky surface-filled group headers, live title filtering that hides emptied groups + compact no-results line, and full keyboard traversal (↑↓ through visible rows with scroll-into-view, ↵ inserts) — hints row updated to match.

## 6.32.2 — 2026-07-13

- Template Library visual pass (system levers only): list column takes a bg.surface fill (layered panes — list zone vs content zone), micro-label group headers return to the list (lost in the two-pane rewrite; the 팀 badge moves out of rows), preview pane gets the eyebrow lockup (group as micro-label over the heading — eyebrow carries ownership) with uniform 24 padding, and a slot-summary caption under the cloze ("입력 항목 N개 · 삽입 후 →로 이동") that doubles as instruction for the → behavior.

## 6.32.1 — 2026-07-13

- Template Library: 새 템플릿 만들기 footer row gets uniform 8px padding (was 4 top / 8 sides+bottom — the asymmetry read as misalignment against the hairline).

## 6.32.0 — 2026-07-13

- Template Library polish (maintainer direction): column-internal rules (search row, pinned 새 템플릿 만들기 footer) now bleed to the column edges — the divider law explicitly extended to padded Modal panes; header gets breathing room above a flush hairline. Sleek additions: caption meta line (owner · last edited) in the preview pane, keycap footer hints (↵ 삽입 · esc 닫기) paired with the primary, and ↵ inserts the selected template.

## 6.31.1 — 2026-07-13

- Version-lockstep drift found and fixed: BOTH design.md's header and tokens $version had silently stuck at 6.19.0 since the 6.19.1 bump failed — every later bump matched a stale string and no-op'd, and because both halves drifted together, nothing mismatched visibly. The lockstep check now lives in validate.py itself (tokens mode errors on tokens-vs-design.md mismatch), so this fails locally and immediately. Changelog was unaffected (its anchor never depended on the version string).

## 6.31.0 — 2026-07-13

- Glass jurisdiction corrected (maintainer caught the Template Library modal reading gray): blur over a scrim samples an already-darkened backdrop — muddy by construction; the v6.22 scrim-gating had the physics backwards. Glass now = UNSCRIMMED floating layers over live content (CommandPalette — which drops its scrim, the frost is the focus device — and the follow-up panel). Modal and Drawer revert to opaque bg.raised; the scrim carries their de-emphasis.
- Template Library redesigned (maintainer: boxed cards were not clean): opaque two-pane modal — borderless list rows + search left, single preview pane right (name, description, cloze as a blockquote with emphasis-highlighted slots, 삽입 primary). Content appears once, never repeated per row.

## 6.30.0 — 2026-07-13

- Template browse surface upgraded menu → Template Library Modal (maintainer: title-only menu rows give no context on what a template is for; a library must show content before commitment). Glass Modal 640: search field, 내/팀 groups, rich template cards (title + 팀 badge + one-line description + cloze preview in a sunken box with emphasis-highlighted slots), 새 템플릿 만들기 footer. Whole card clickable → inserts and closes. / remains the expert quick-insert path. Wired live in the Console sample.

## 6.29.0 — 2026-07-13

- Prompt-template library surfaced (completing §23 from the aiuxpatterns pass): bookmark icon-button in the Composer footer opens the browse menu — search row, 내 템플릿 / 팀 템플릿 groups (team rows carry a 팀 badge), 새 템플릿 만들기 footer escape. Rationale spec'd: / is the expert path, the button is the novice path (the pattern's core audience). Wired live in the Console sample — choosing a template inserts its cloze draft with [슬롯] placeholders. Registry +bookmark; glossary +새 템플릿 만들기.

## 6.28.1 — 2026-07-13

- Mixed-attachment ordering spec'd (maintainer question: "what if a file follows an image?"): Composer attachments group by kind — image tiles on one row, document chips below, chronological within a kind (mixed 24px/48px heights in one row read ragged; attachments are a set, not a sequence). Sent messages fix the order docs → images → text; 3+ images = 2-wide grid, never a MediaGroup fan (generated media only). Console demo now shows one tile row + two document chips.

## 6.28.0 — 2026-07-13

- Image attachments spec'd (Composer + §12): in the Composer, images render as 48px thumb tiles (radius xs, hairline, compact 16px × overlay, filename in tooltip) — the one attachment type where the thumbnail is the identity; documents stay text chips and ContextCard's no-thumbnail rule is untouched. Sent human messages render the image above the bubble text (radius md, hairline, max-height 240). Console sample demos both with a token-pure mock screenshot.

## 6.27.2 — 2026-07-13

- Toast alignment regression fixed (maintainer caught it on the refine toast): the v6.24 flex-start fix solved two-line icon float but left the 32px dismiss button dangling below single-line text. Ruling: toast contents top-align to the FIRST text line — icon +2px, action link on the text line-height, dismiss × as a compact 20px box. Spec'd that inline dismiss affordances (Toast ×, ComposerQuote ×) are not form controls, so the control-height scale doesn't apply — this also legitimizes the quote bar's existing 20px ×.

## 6.27.1 — 2026-07-13

- Preview only: assisted editing wired live in the Console sample — pen-line in the composer footer opens the preset menu upward; each preset rewrites the (prefilled rough) draft; the confirmation Toast carries 실행 취소 which restores the previous text — the full §24 loop including reversibility. Toast helper gained an action slot; empty drafts no-op per spec.

## 6.27.0 — 2026-07-13

- Assisted editing (from aiuxpatterns.com "AI Assisted Editing"): the §24 pen-line refine grows a preset menu — a CLOSED refinement set (프롬프트 다듬기 · 더 자세히 · 더 간결하게 · 기간·범위 구체화 · 형식 지정), standard Popover anatomy, rewrite replaces the draft with Undo, disabled on empty drafts. Freeform rewrite styles are explicitly forbidden — preset extension is a governance act. Glossary +4 presets; demo in the Composer story.

## 6.26.0 — 2026-07-13

- Voice input adopted (maintainer decision, superseding the "parked" ruling) as ai-patterns §26 — DICTATION ONLY: mic ghost icon-button in the Composer footer; recording morphs the tray in place (Cancel · pulsing danger dot + tabular timer · ≤5-bar transform-only level meter, static under reduced-motion · pause · primary check confirm in the send position, matching the send↔stop morph language); transcript inserts at the caret and NEVER auto-sends. Audio never posts to the thread — conversations stay textual for provenance/search/quote-reply. Registry +mic/+pause (Composer/recording only); glossary +음성 입력/녹음 중.

## 6.25.0 — 2026-07-13 (AIUX gap pass: ai-patterns §22–25)

- Gap analysis against aiuxpatterns.com (28 patterns; ~2/3 already covered). Four groups spec'd:
- §22 Result variants (‹n/N› pager in the answer header; regenerate = new variant, never destroys) & partial regeneration (selection pill gains 재생성 — in-place, emphasis flash + Undo).
- §23 Prompt templates & placeholders (library via / group + picker-menu pattern; slot chips on emphasis.surface; → moves slots; unfilled slot is the only other sanctioned send-block; slots never carry Korean particles).
- §24 Authoring coach (one non-blocking quality hint with absolute anti-nag rules; pen-line refine with Undo). Explicitly NOT adopted: generative inline autocomplete — authorship stays with the user.
- §25 Threads (sidebar history under time groups, 새 대화, 임시 대화 switch with visible 임시 badge).
- Glossary +5 actions; registry +pen-line (Composer footer only).

## 6.24.1 — 2026-07-13

- Table selection column (maintainer caught the header checkbox off-center): the cell was inheriting text-cell padding and left alignment. Now spec'd anatomy — 40px fixed, zero padding, centered both axes; a selection cell holds a control, not text. Applied to header and body cells in the bulk-selection demo.

## 6.24.0 — 2026-07-13 (micro-polish audit, all 12 approved)

1. Stepper (R9): numerals 600 11px/1 tabular (inherited line-height sat digits low in the 20px circle); rings 2px → 1.5px (outweighed the numeral). Spec'd as R9 numeral discipline.
2. Bare Badge = neutral by default (several recent badges — 사전 승인됨, 베타, durations, +N — rendered as unfilled floating text); outline instances now declare transparent explicitly. Spec'd: a badge never renders unfilled.
3. .menu-search content left-aligns with menu items (14px from panel edge — miss introduced by the 6.23.3 bleed fix).
4. Quote highlight survives line wrap (box-decoration-break: clone).
5. Input leading icon: left 10px/32px magic numbers → derived from control-padding-x (+ space-24).
6. Console retry step: off-scale 20px button height removed; row sizes to the natural btn-sm.
7. Drawer template key column: fixed 96px width → min-width (translatable-text rule).
8. Toast icon anchors to the first text line (flex-start + 2px top) instead of floating mid-block on two-liners.
9. Glass panels get a border.default hairline in light mode (border.overlay is transparent there; edgeless glass read unfinished). Foundations §5 updated.
10. Keycap hint rows (follow-up panel, palette footer) vertically center their mixed keycap/label content.
11. AgentStep skipped-dash 2px → 1.5px, matching the pending ring's stroke.
12. SourceChip baseline: vertical-align 2px magic number → text-bottom.

## 6.23.3 — 2026-07-13

- Full-bleed divider drift fixed in HoverCard/Popconfirm/ContextMenu (maintainer caught side gaps): .menu-sep bled with a hardcoded −4px from the era of 4px menu padding; the v6.8 concentric fix moved panel padding to 6px and the separator silently stopped 2px short. Now token-derived (−space-6) so it tracks the panel padding. Same fix applied to .menu-search (same stale −4px). Lesson encoded: bleed offsets must be derived from the padding token, never hardcoded.

## 6.23.2 — 2026-07-13

- Follow-up panel anchor offset: 8px gap above the Composer restored (lost in the v6.23.1 absolute-positioning fix) and spec'd — floating layers detach from their anchors; flush contact reads as part of the input. Menus stay at 4px; the panel's larger mass earns 8.

## 6.23.1 — 2026-07-13

- Follow-up panel placement fixed (maintainer caught the glass not reading): the panel was in document flow, pushing content instead of overlaying it — glass over empty background shows nothing. Now absolutely anchored to the Composer's top edge, floating over the last thread messages; spec'd in §19 with the rule that the panel never pushes content (no layout shift on open). Story demo gets thread text behind the panel so the frost is visible.

## 6.23.0 — 2026-07-13

- Follow-up panel gets its own story in the AI patterns group (it previously existed only inside the Console sample) and adopts the glass material — spec'd as the ONE named anchored exception to glass's scrim-gating (it behaves like a mini-palette: floats over thread content, static while open, dismisses on esc/typing). Foundations §5 jurisdiction updated with the exception named explicitly and a rule that further exceptions require a governance proposal, not precedent-matching. Reduced-transparency fallback covers it.

## 6.22.0 — 2026-07-13 (§8 amendment: the glass material)

- Maintainer amendment to the never-list: blur is now permitted solely as the GLASS MATERIAL on scrimmed screen-level overlays — CommandPalette, Modal, and scrimmed Drawers (the no-scrim Drawer variant stays opaque). glass.surface (0.85 white / 0.82 dark over bg.raised values — the opacity floor keeps pre-verified text pairs approximately valid over unknown backdrops) + blur(glass.blur 20px) + border.overlay + the layer's standard shadow. prefers-reduced-transparency falls back to opaque bg.raised.
- Enforcement: new SY015 — backdrop-filter anywhere except blur(var(--sy-glass-blur)) is an error; anchored surfaces (menus, popovers, tooltips, toasts) remain opaque by law (blur cost compounds during scroll/pointer interaction).
- Manifest never-list drift fixed while in there: stale accent-CTA phrasing (pre-6.19) and the missing gradients/glow/rotation entries now mirror design.md §8.

## 6.21.3 — 2026-07-13

- Secondary buttons on the ProposalCard tray open to bg.page in light mode (maintainer caught 거절 dissolving: secondary gray.100 vs tray slate.100 is near-identical luminance) — the tray rule applied to controls. Dark mode keeps the standard secondary fill, which already contrasts with the dark tray; hover unchanged in both.

## 6.21.2 — 2026-07-13

- Full-bleed divider compliance sweep (maintainer re-flagged; the rule dates to v2.0): the follow-up panel hint row, NotificationCenter header/footer rules, and agent-picker search rows were bordering padded rows instead of bleeding through the 6px panel padding — all now negative-margin to the panel edge with content alignment preserved. Spec generalized: the edge-to-edge rule binds every horizontal rule inside any floating panel, not just menu item dividers.

## 6.21.1 — 2026-07-13 (maintainer reversal)

- v6.21.0 two-tone ProposalCard header reversed on sight: back to the single-tone tray with the ai.border hairline (v6.20.2 state). The ai.surface-strong token is removed — it existed only within this unpushed session, so no migration surface exists; its gate pair is dropped with it.

## 6.21.0 — 2026-07-13

- ProposalCard goes two-tone (maintainer direction): new ai.surface-strong token (slate.200/800 — same values as surface-hover today, separate token so they can diverge) fills the header band, one slate step above the body; the divider is retired — the fill step does the separating, layering not lines. New gate pair ai-fg/ai-surface-strong.

## 6.20.2 — 2026-07-13

- ProposalCard header divider: border.strong → ai.border (slate.200/800) — the whole object is slate now, and the neutral gray rule read foreign on the tint. Full circle: the divider that was blue (odd), then dark gray (v6.17.8), lands on the tray's own family.

## 6.20.1 — 2026-07-13

- ProposalCard header padding → uniform 12px (maintainer, second pass on icon spacing): the avatar reads the spacing, so top/side/bottom must match around it; the 4px offset from the body's 16px column is sub-perceptual at avatar scale and loses to even icon breathing room.

## 6.20.0 — 2026-07-13

- ProposalCard goes borderless (maintainer direction): tray anatomy — whole-object ai.surface fill, radius lg, no shadow, header band dissolved into a hairline-separated row, payload surfaces open to bg.page (tray rule), footer buttons on the tint. The Console's two anchor objects (Composer, ProposalCard) now share one borderless-filled language. Header padding realigns to the 16px text column — supersedes v6.17.8's uniform-8 band padding, whose rationale (even spacing inside the filled band) dissolved with the band.
- Note for a future call: Card's `ai` variant still specs an outlined ai.surface container; ProposalCard has now diverged from it. If the tray read wins, the ai Card variant should follow.

## 6.19.2 — 2026-07-13

- ComposerQuote rendered as a blockquote, not a box (maintainer: the boxed bar's radius/style looked out of place — diagnosis: a white outlined rounded bar above a textarea reads as a second input). Now the §12 quotation anatomy: 2px border.strong left rule + fg.secondary text, no fill/border/radius; reply icon fg.tertiary. Supersedes the v6.19.1 boxed fix; the tray page-fill rule still governs surface objects (chips, ContextCards) — the quote is typographic, exempt.

## 6.19.0 — 2026-07-13

- Full-slate AI theme (maintainer: the v6.18 blue-on-slate mix read as mixed-up): ai.fg → slate.600/300, new ai.solid (slate.600/500) replaces accent-bg on the live-activity beacon Badge and ai ProgressBar. The squared avatar is now THE agency marker; ai.* slate treatments support it.
- Composer send → `primary` (icon-only circle exception stands). Rule 7 amended: the Composer counts as its own region, so its send is that region's one primary.
- Button `accent` variant DEPRECATED — no jurisdiction, any use is a violation, removal at the next major (kept defined per one-way-door discipline; still rendered in the Button matrix, marked deprecated). Blue's remaining territory: focus rings (non-entry), links, status.info.
- New gate pair fg-on-solid/ai-solid (3:1 solid-label policy).

## 6.18.0 — 2026-07-13

- AI surfaces retire the blue wash (maintainer direction, "surfaces only" scope): ai.surface/surface-hover/border retarget to slate (slate.100/200 light; slate.900/800 dark). ai.fg stays blue — AI is now signaled by blue text/marks + the squared avatar on calm slate tint; action.accent, border.focus, fg.link unchanged. Affects ProposalCard band, suggestion chips, ComposerQuote, quote highlight, AI Card, palette ask-row — all via tokens, no markup changes.
- ai.* and emphasis.* now share values by design but stay separate token groups (distinct semantics; can diverge without migration). Anti-collision rule updated accordingly; new gate pair ai-fg/ai-surface.

## 6.17.8 — 2026-07-13

- ProposalCard header band: bottom hairline ai.border → border.strong (maintainer: blue rule read odd — the tint alone marks AI, the rule just separates), and padding 8×16 → uniform 8px so the avatar sits with even spacing on all sides.

## 6.17.7 — 2026-07-13

- Media rail jurisdiction tightened (maintainer caught the redundancy in the Console sample): the side rail appears ONLY on media-only replies; when media accompanies text, the message-level ResponseToolbar governs the whole reply — two feedback surfaces on one message is forbidden. Console sample drops the rail; the MediaGroup story keeps it as the media-only demo.

## 6.17.6 — 2026-07-13

- Preview only: MediaGroup cards now carry mock assets (inline token-pure SVG — line chart, flow diagram, report cover) with a caption strip, replacing the gray icon placeholders, in both the MediaGroup story and the Console fan. Card anatomy: asset area + surface caption row with hairline rule; "+N" badge lives in the caption row.

## 6.17.5 — 2026-07-13

- New composition rule (patterns §2): scroll containers span the full region — centered reading columns live inside the scroller, so scrollbars sit at the region edge, never mid-canvas beside the column. Console sample restructured accordingly.

## 6.17.4 — 2026-07-13

- Preview only: the Console sample is now a complete ai-patterns walkthrough — added pre-approved tool call, failure→retry escalation, uncertainty register + Model-knowledge badge, resolved-proposal attribution row, MediaGroup + media rail, guardrail notice, human handoff + continue, long-running ProgressBar, and a live streaming tail with Stop. Discreet mono §-tags label each pattern for review; thread column scrolls (max-height 820).

## 6.17.3 — 2026-07-13

- Preview only (no contract change): the three app-frame sample pages are now interactive — bell opens NotificationCenter, avatar/workspace open their menus, a new topbar search trigger opens the CommandPalette, Workbench table rows open a detail Drawer, Settings 워크스페이스 삭제 runs the destructive Modal → Toast flow, and the Console composer is live (follow-ups/chips insert, send↔stop morphs, quote removes, agent picker opens). Esc and scrim clicks dismiss everything; all overlays use the spec'd anatomies and motion.

## 6.17.2 — 2026-07-13

- Optical padding trim on icon+text Buttons (maintainer caught it on the streaming Stop): the icon side's padding drops 2px — stroke icons carry internal whitespace, so equal side padding reads heavier on the icon side. Per-side rule: leading icon trims left, trailing chevron trims right; icon-only squares exempt.

## 6.17.1 — 2026-07-13

- Streaming Stop control: ghost → `secondary` tonal (maintainer: ghost read as floating text). Stop generation now renders identically everywhere — the Composer's send→stop morph was already secondary. Run-toolbar Cancel stays ghost (it halts a job, not an in-flight stream).

## 6.17.0 — 2026-07-13 (governed fun, part 2: color moments)

- Third-party product logos sanctioned (icons.md): connector/integration contexts only, 16px, original brand colors, never recolored, never in nav chrome — imports the liveliness of connector rows legally.
- Sidebar collection rows may carry an 8px system-assigned viz-tint dot (same assignment rule as category Badges) — the one place color enters the sidebar; never on system destinations. Demo in the Console sample sidebar.

## 6.16.0 — 2026-07-13 (governed fun, part 1)

- New component MediaGroup (52nd): agent-generated media as a ±2.5° fan — the system's ONE sanctioned playful moment. Principle written into ai-patterns §21: playfulness lives in the agent's output, never in the chrome. Never-list now bans rotation everywhere else; hover straightens; reduced-motion renders flat; referenced objects stay in flat ContextCards.
- ResponseToolbar `media` variant: vertical pill rail (copy + thumbs) anchored beside a MediaGroup.
- Declined from the reference shots, for the record: glassmorphism (§8 blur), mascot/proactive nudge bubbles (violates rule 7a and the human-in-the-loop trust posture), emoji in system text (register).

## 6.15.0 — 2026-07-13 (Console character B2+B4: composer commands)

- Slash commands in the Composer: / scopes the command palette to agent actions; single-best-match ghost completion in fg.placeholder, accepted with → (never Tab — IME conflict), closed action glossary only.
- Agent-picker menu upgraded: search row, micro-label groups, squared-avatar rows with optional neutral Badge (베타), one submenu, and a mandatory "에이전트 요청" footer escape — pickers never dead-end.

## 6.14.0 — 2026-07-13 (Console character B1+B3: context objects)

- New component ContextCard (51st): referenced objects as physical cards in threads/Composer — icon tile + title + one meta line, flat 4px stack with page-colored ring + "+N" (max 3, never rotated), compact inline @-mention form. No thumbnails.
- FileUpload dropzone retuned: dashed border.strong, radius lg, EmptyState-style medallion; drag-over = border.focus-input + emphasis.surface. Dashed borders spec'd as drop-targets-only. (Proposal doc corrected — this was a retune, not a gap.)

## 6.13.0 — 2026-07-13 (Console character C: answer anatomy)

- Titled answer sections (ai-patterns §20): long/multi-step replies open with heading-sm title + tabular duration Badge + collapse chevron; one per reply.
- Named working line: multi-step generation shows the current activity by name with the pulse animation (no gradient shimmer — §8 stands); resolves into the answer title on completion.

## 6.12.0 — 2026-07-13 (Console character A: selection & reply loop)

- Quote-reply (ai-patterns §18): selecting agent text raises a floating Reply pill; choosing it inserts an ai-tinted ComposerQuote bar (radius xs by the concentric rule, single line, ×, max one per send). Selected passage highlights ai.surface + inset hairline.
- Follow-up panel (§19): suggestion chips can escalate to a keyboard-first anchored panel above the Composer — menu anatomy, keycap hint row (↑↓/↵/esc), max 4 rows, inserts never auto-sends. Chips and panel are mutually exclusive.
- Registry: reply/quote = corner-up-left (Reply pill + ComposerQuote only); follow-up = arrow-right (panel rows only). Glossary: Reply / 답장.

## 6.11.0 — 2026-07-13

- Slate primitive ramp (11 steps) + `emphasis.*` semantic trio (surface/border/fg) — quiet emphasis without vibrant color (maintainer direction, chosen over retinting the neutrals; the tone-experiment toolbar stays in preview for reference). Slate is NOT a second neutral: closed job list only — hero stat card (max 1/grid), table emphasis column (max 1/table), timeline/calendar now-markers — plus selected states, which move from gray to slate (bg.selected/selected-hover, both modes; the subtle cool read on selection is the character gain).
- Anti-collision rule (foundations §1 + ai-patterns §1): bare cool tint alone never signals AI; AI surfaces always carry a squared avatar or ai.fg text; emphasis.* never on AI surfaces. Slate.100 tuned visibly grayer than blue.50.
- Calendar "today" upgraded from hairline outline to the emphasis treatment. New contrast pairs added to the gate (emphasis-fg/emphasis-surface, fg-primary/emphasis-surface, fg-primary/bg-selected).
- Preview-chrome fix: component-browser nav group labels were JS-uppercased — caps ban applies there too; now sentence case.

## 6.10.0 — 2026-07-13

- Entry-surface focus goes neutral: new `border.focus-input` token (gray.800 light / gray.200 dark — softened key tone, bg.inverse-soft precedent) replaces blue on Input/Textarea and, by inheritance, Select/Combobox/DatePicker triggers. Rationale: text fields show focus on every click-to-type, so blue overexposed the accent during ordinary form-filling. Focus language is now deliberately split: entry surfaces neutral, non-entry controls keep the blue offset ring (inseparable focus/focus-visible on text fields makes a keyboard-only blue impossible). Foundations §1 blue-is-functional rule amended accordingly.

## 6.9.0 — 2026-07-13

- New radius step `xl` (24px) — maintainer request. Jurisdiction is deliberately narrow to prevent radius drift: section shells only (the outermost rounded well a page region sits in: SplitPanel container, content wells, hero/empty wells), one shell level per region, never on cards/overlays/nested shells. Shells pad ≥ space-24 so the concentric-corner rule never binds their children.
- This amends the former "never exceed 16px on rectangular containers" line in foundations §3 — xl is now the ceiling.
- SplitPanel container adopts the shell treatment (radius md → xl). Validator RADIUS_SCALE updated.

## 6.8.1 — 2026-07-13

- Input/Textarea focus quieted (maintainer: the 2px offset ring was too much on filled fields): now a 1px border.focus perimeter + the existing sunken→page fill change — a compound indicator, still clearly visible for keyboard users. Buttons and non-field controls keep the 2px offset ring (they have no fill change to lean on). Error fields keep the danger border while focused; the fill change carries focus.

## 6.8.0 — 2026-07-13

- New foundations §5 law: the concentric-corner rule — nested rounded elements MUST satisfy inner radius = outer radius − inset; when the subtraction lands off-scale, adjust the inset, never the radius (maintainer caught the SegmentedControl violating this: radius-8 frame, 2px padding, radius-4 segments = 2px corner mismatch).
- SegmentedControl inner padding 2px → 4px: 8 − 4 = 4 makes the nesting exactly concentric with both radii on-scale, and the assembled control now lands on standard control heights (36 focus / 32 dense).
- The rule immediately caught Menu/Popover too: radius-10 container with 4px padding around radius-4 items. Container padding → 6px (10 − 6 = 4).
- Rule scoped precisely: binds corner-anchored structure (segments, menu items, banded headers, attached groups) where inset < outer radius; flush nesting shares the radius; inset ≥ outer radius and free-flowing content are exempt.

## 6.7.1 — 2026-07-13 (maintainer reversals)

- Banner subtle: left status rail (v6.4) removed — dated. Now a pure borderless status tint with colored text; no border of any kind.
- Sidebar active leading bar (v6.7) removed — same verdict. Active = bg.selected + fg.primary + medium weight.
- Ruling recorded: Artific stays out of page header titles — titles are KO/user-generated, and Latin-only Artific would make the same chrome slot switch typefaces by content language.

## 6.7.0 — 2026-07-13 (character audit, tranche 4: chrome & brand)

- Sidebar active item gains a 2px key-color leading bar (16px, pill radius) alongside bg.selected — position signal that survives squint/colorblind viewing.
- Topbar workspace switcher (R10): 20px squared monogram tile (bg.inverse/fg.inverse, radius xs) before the workspace name — the frame's one deliberate dark object.
- Guided hero switched to EN so the Artific display face actually renders: the KO headline had been silently falling back to Pretendard, so the licensed brand face appeared nowhere in the product's own samples. Hangul fallback remains by design.

## 6.6.0 — 2026-07-13 (character audit, tranche 3: motion law)

- Entrance rule added to foundations §6: floating layers enter with 4px translate + fade (menus/popovers/palette rise at base; toasts slide from the right at slow; tooltips fade only); exits are plain fast fades. No springs, no multi-step choreography.
- Finish rule now actually applied everywhere: chips, nav items, menu items, tabs, palette rows, source chips, inputs and combo triggers all transition at instant/standard (previously only buttons, switches and interactive cards).
- prefers-reduced-motion in preview upgraded from "slow the spinners" to the spec'd full collapse: entrances and hover transforms off.

## 6.5.0 — 2026-07-13 (character audit, tranche 2: micro-typography)

- New type style `micro-label` (20th): sans 11/16 semibold + 2% Latin tracking (Hangul never tracked). Jurisdiction: sidebar/palette group labels, card eyebrows, axis labels. Tracking does the work ALL-CAPS would; caps stay forbidden.
- Contract violation fixed in our own samples: literal ALL-CAPS group labels ("WORKSPACE", "NAVIGATION", "ACTIONS") — hard rule 8 breach the linter can't see (literal text, not text-transform). Now sentence-case micro-labels.
- Table headers: fill dropped (transparent on framed and bare tables), fg.tertiary; hairline rule alone marks the header. Sort-glyph space reservation spec'd.
- kbd keycap treatment: no change — already spec'd (v6.1 stepped bottom edge); audit item closed as done.

## 6.4.0 — 2026-07-13 (character audit, tranche 1: wireframe killers)

- Banner subtle relayered: borderless status tint + 3px status rail on the left edge — the last surface using the tint-plus-saturated-outline formula removed from ProposalCard in 6.3.
- Stat cards (R4): delta text-glyph badges (▲ 12%) replaced with a delta row — 12px trend-up/trend-down registry icons (new, sanctioned for stat deltas only) + 12 medium tabular text colored by direction of goodness. Optional 64×24 viz.1 hairline sparkline slot on the value baseline. Stat type styles gain −1% numeral tracking.
- EmptyState medallion: icon circle gains two concentric hairline rings (border.default/-8, border.subtle/-16 — pure borders, §8 untouched); error flavor tints the medallion danger-bg.

## 6.3.0 — 2026-07-13

AI-surface finish pass — the "wireframe callout" fix. Root cause: every AI surface used the same flat formula (full ai.surface tint + saturated blue.300 outline). Character now comes from layering, not more color. Gradients/blur/glow remain forbidden (§8 unchanged — maintainer ruling).

- ProposalCard relayered: neutral surface card + border.default hairline + shadow.raised; the ai.surface tint is confined to a header band with an ai.border bottom hairline. Body and diff sit on clean surface.
- Suggestion chips: borderless soft fill (ai.surface → ai.surface-hover on hover), matching the borderless filled-input language. Saturated outline removed.
- Subtle ai Badge: outline dropped — now a borderless fill like every other subtle badge.
- Token: ai.border softened blue.300→200 (dark 700→800) — hairline weight everywhere it appears (AI Card border, ProposalCard band rule, outline ai badge). New ai.surface-hover (blue.100 / blue.900).

## 6.2.6 — 2026-07-13

- Count overlay anchoring finalized (maintainer direction): the pill sits half-in at the button's top-right corner (fixed top/right −2px), covering part of the glyph's upper-right — the 2px surface ring keeps the covered icon legible. Coverage identical at every button size.

## 6.2.5 — 2026-07-13

- Root cause of the still-different bells: the Workbench topbar sat inside the page's dense region, so its chrome shrank to dense metrics while Console/Settings stayed focus. New rule (patterns §2): **app chrome (Topbar, Sidebar) is density-independent** — density governs content regions, never the frame. Workbench sample rescoped accordingly.
- Count overlay: anchor changed to fixed −4px/−4px overlapping offsets (maintainer preferred the overlapping look; fixed offsets read identically at every button size, unlike percentage translation) and fill softened to new `bg.inverse-soft` token (gray-800 light / gray-200 dark, pairs with fg.inverse) — key-family visibility without pure-black harshness.

## 6.2.4 — 2026-07-13

- Icon-only buttons are now spec-square: width equals the size's control height (the preview hardcoded md width on all icon buttons, so small ones rendered 36×24 and drifted with density — the source of the inconsistent bells).
- Count overlay spec'd (Badge): the on-icon-button count (bell only) is an 18px key-color mini-pill (`bg.inverse` + `fg.inverse`, 2px surface ring, translate 30%/−30% from the corner) — visible against any chrome without borrowing status red; neutral-subtle fills forbidden there; never renders "0". All three sample topbars updated; Storybook Button.css gains the square rules.

## 6.2.3 — 2026-07-13

- Browser: sample pages no longer render proportionally squished — selecting a Sample-pages story lifts the canvas's 920px reading cap, and the screens carry natural widths (app frames min 1160px, single-column pages min 960px, all capped at 1440px) with horizontal canvas scroll as the fallback in narrow windows.

## 6.2.2 — 2026-07-13

Sample pages rebuilt as five full screens (browser only).

- **Console** (new — the product's heart was missing): sidebar + topbar frame, human bubble, agent reply with reasoning disclosure, collapsed steps, SourceChips + sources footer, inline ProposalCard (Approve = primary), ResponseToolbar, suggestion chips, Composer with the screen's one accent (send).
- **Settings** (new): tabs, form card with save pair, switch rows, warning-level usage meter, danger zone. Zero accent — nothing prompts an AI.
- **Workbench** enriched: R10 topbar (workspace switcher, bell + count, avatar), SplitPanel detail pane (dense list ↔ focus detail with DescriptionList + steps), pagination, selected row.
- **Object detail** enriched: trend chart card, embedded dense runs table, schedule-change proposal with diff; Run is `primary` per v6.2.1.
- **Guided** gains its step-2 moment: ChoiceCard agent-type selection with compact stepper counter.
- Accent audit across all five: exactly one per conversational surface (Workbench ask-entry, Console send), zero elsewhere — the sample pages now demonstrate the accent discipline in context.

## 6.2.1 — 2026-07-13

Accent boundary corrected after maintainer review of the R1 example: "executes an agent" never earns blue.

- v6.2's "initiating AI CTA" was still ambiguous — in AgentOS everything executes agents, so Run/Retry/Resume all technically qualified. Final rule: `accent` = **conversational/generative AI entry only** (Ask agent, Composer send, generate-from-prompt — the button through which the user *prompts* an AI), max one per screen. Operational actions on agent objects follow the normal hierarchy: Run on an agent's page is `primary`.
- Demoted accordingly: the object-page Run button (`primary`), the handoff "Resume agent" (`primary`/`secondary` per region — operational, not conversational), the split-button Run example (`primary` split). Remaining accents: Ask-agent entries and the Composer send.

## 6.2.0 — 2026-07-13

Accent tightened to the single AI CTA (maintainer direction: "VERY selectively").

- Accent was already AI-only, but "any agent-invoking action" made blue ubiquitous in an AI-native product — nominal scarcity. New rule: `accent` = the screen's **single initiating AI call-to-action** (Ask agent / Run / Composer send), **max one per screen** (was implicitly per-region). All other agent-related actions use standard variants; AI context is carried by the glyph, `ai.*` surfaces, and squared avatars.
- ProposalCard Approve demoted `accent` → `primary`: approving is a human decision about agent work, not an AI CTA. Destructive approvals stay `danger`. (ai-patterns §1/§5, components.md, hard rule 7, self-audit, manifest, browser stories, Storybook Button JSDoc all updated.)
- Unchanged: the AI solid Badge beacon (status, not a CTA), the palette's ask-agent row (text treatment), accent ProgressBar fills (meters, not buttons).

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
