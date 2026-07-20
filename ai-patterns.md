# Synapse AI patterns

Interaction conventions for agent behavior in AgentOS. These patterns govern every surface where an AI agent acts, speaks, proposes, or produces content. They carry the same contractual force as `components.md` — the states and anatomies here are closed sets.

Applies on top of the base system: archetypes from `patterns.md`, components from `components.md` (including the AI-specific components added in v1.2: AgentStep, ProposalCard, SourceChip, ProgressBar, CommandPalette).

---

## 1. Principles — the four properties of visible agency

**Anti-collision (v6.11, final form v6.19):** the AI theme is fully slate — surfaces, borders, marks, solid fills — so color NEVER signals AI on its own. The **squared avatar is the primary agency marker**; `ai.fg` slate marks and placement support it. `emphasis.*` tokens never appear on AI surfaces (use `ai.*` — same family, distinct semantics, free to diverge later). The conversational-AI entry is a `primary` Button (v6.19; accent deprecated).

Every agent surface must make agency **visible** (users always know when AI is acting vs. a human or deterministic system), **interruptible** (any generation or run can be stopped), **attributable** (AI output is marked as such, with provenance when available), and **reviewable** (consequential actions pass through human approval).

**The two AI markers.** AI presence is signaled by exactly two devices, used consistently and used nowhere else:

1. The **squared avatar** (radius `sm` vs. round human avatars) on any actor row, message, or attribution chip.
2. The **`ai.*` token family** (`--sy-ai-surface`, `--sy-ai-border`, `--sy-ai-fg`) on surfaces that contain agent output or agent proposals, and the **`accent` (blue) fill** on the screen's single conversational-AI entry point only (v6.2.1 — Ask agent / Composer send; one per screen). Operational agent actions (Run/Retry/Resume) use the normal hierarchy — "executes an agent" never earns blue.

NEVER mark AI presence any other way — no sparkle gradients, no purple, no robot iconography beyond the standard agent glyph. NEVER use `ai.*` tokens on non-AI surfaces, and never substitute `status.info-*` for `ai.*` or vice versa, even though the families are related.

---

## 2. Streaming output

- Streamed text is **append-only**: rendered markdown may progressively enhance (a heading completes, a list item closes) but existing lines never reflow or jump. Reserve block height where possible.
- The **streaming cursor** is a 2px × 1em `ai.fg` vertical bar after the last character, blinking at 1s intervals. It is the only blinking element permitted in the system.
- While streaming: a **Stop** control (`secondary` tonal Button, square-stop icon + "Stop" / "중지" — v6.17.1: ghost floated as bare text; the tonal fill gives the one interruption affordance a body, and matches the Composer's send→stop morph, which is also `secondary`) MUST be visible and reachable without scrolling. Stopping keeps partial output and appends a `fg.tertiary` caption: "Stopped by you" / "사용자가 중지함".
- Scroll behavior: stick to bottom while the user is at the bottom; the moment the user scrolls up, release the lock and show a "Jump to latest" pill (Toast surface — `bg.raised-2` + border + `shadow.overlay` — bottom-center).
- Never disable the composer during generation — queue or interrupt, don't lock the user out.
- Rate: render at natural token arrival. No artificial typewriter effects on non-streamed (already complete) content — instant render, no fake latency, ever.

## 3. Working states — AgentStep

All agent activity between "request" and "answer" renders as **AgentStep** rows (see `components.md`). The closed state set:

| State | Indicator | Text color |
|---|---|---|
| `pending` | 12px `border.strong` hollow circle | `fg.tertiary` |
| `running` | 12px Spinner | `fg.secondary` |
| `success` | 12px `status.success` check | `fg.tertiary` |
| `failed` | 12px `status.danger` ✕ | `fg.secondary` + trailing Retry ghost button |
| `skipped` | 12px `border.strong` dash | `fg.disabled` |

- Steps are 13px rows, one line each: verb-first summary ("Fetched 328 tickets" / "문의 데이터 328건 조회됨") + optional duration (`fg.tertiary`, tabular-nums).
- **Collapse rule:** while running, show at most the last 3 steps; on completion, collapse to a single summary row — "5 steps · 12s" / "5단계 · 12초" — expandable. Expanded step detail (tool payloads) renders as `.sy-code-block`, collapsed by default.
- Step hierarchy is flat or one level deep. NEVER nest deeper — restructure the agent's reporting instead.

## 4. Tool calls

- A tool call is an AgentStep whose summary carries the tool name in mono: `slack.post_message` — human-readable summary first, mono identifier second ("Posted summary to #ops · `slack.post_message`").
- Inputs and outputs are collapsed by default; expanding shows `.sy-code-block` with copy button. Redact secrets by default (`••••`, reveal requires explicit click and permission).
- **Model selection (v6.42):** a per-conversation Composer control beside the agent picker (reversal of the v6.41 in-picker placement). Defaults from the selected agent's config; switching agents resets it to that agent's default; org policy MAY lock it read-only. Model choice NEVER changes permissions, tool access, or approval rules.
- **User tool control (v6.41):** the Composer's tools popover toggles which capabilities/connectors the agent may use in this conversation (defaults from agent config). Disabling a tool the agent needs → the agent asks for it by name, never silently fails or silently re-enables. Enabling a tool NEVER bypasses approval: the next rule holds regardless of toggles.
- Tool calls with **external side effects** (sending, posting, purchasing, deleting, writing to third-party systems) MUST pass through a ProposalCard (§5) unless the user has granted standing approval for that specific tool+scope, in which case the step shows a "pre-approved" Badge (`neutral`).

## 5. Human-in-the-loop approval — ProposalCard

The agent never performs a consequential action silently. It proposes; the human disposes.

**Anatomy** (see `components.md`, v6.20 tray): borderless `ai.surface` object, radius `lg`, no shadow — Composer-tray language; payload surfaces (diff, previews) open to `bg.page`. Header row: squared agent avatar first (the agency marker) + agent name + "proposes" / "제안" (13 medium, `ai.fg`), `ai.border` hairline below (v6.21.1 — single-tone tray; the two-tone band was reversed). Body: one-sentence summary of the action and its scope, then the payload — a diff, a message preview, a list of affected records. Footer: **Approve** (`primary` Button — approving is a human decision about agent work, not an AI CTA; v6.2) + **Reject** (`secondary`) + optional **Edit** (`ghost`).

**Rules:**
- NEVER auto-approve by timeout. No countdown timers on approval. Absence of response = no action.
- Destructive proposals swap Approve for a `danger` Button and MUST name consequences by count and noun ("Deletes 14 runs permanently" / "실행 기록 14개가 영구 삭제됩니다").
- Batch proposals (agent proposes N similar actions) allow Approve all / Review individually — never approve-all as the default-focused control.
- A resolved ProposalCard collapses to a single attribution row: check/✕ icon + "Approved by June · 14:02" / "June 승인 · 14:02". The decision trail is permanent — resolved proposals are never deleted from the transcript.

**Diff rendering** inside proposals: added lines on `status.success-bg`, removed on `status.danger-bg`, mono for code/config, sans for prose diffs; word-level highlighting within changed lines. Never red/green text alone — background tint plus +/− gutter markers (colorblind-safe).

## 6. Provenance — SourceChip

- Any agent claim derived from retrievable sources SHOULD carry inline **SourceChips**: numbered chips `[1]` (18px height, `bg.sunken`, radius `xs`, mono 11) placed after the sentence they support. Hover/click opens a Popover: source title, origin (favicon or connector icon), timestamp, and an open-source link.
- A sources footer lists all citations for the message (13px, `fg.secondary`).
- Claims with no retrievable source and low verifiability are marked once per message with a `neutral` Badge: "Model knowledge" / "모델 지식" — never fake a citation, never cite the agent itself.
- Numbers, quotes, and named facts in agent-generated *documents* (not just chat) follow the same rule. If AgentOS renders an agent-written report, the chips come with it.
- **Sources row (v6.36):** below the message, sources render as compact ContextCards (index + icon tile + name) under a 출처 `micro-label` — never as a plain-text footnote line. Card↔marker hover linkage makes the mapping visual. Inline markers stay ≤3 per sentence.
- **Marker form (v6.37):** circular 18px chips with bare numerals on the emphasis tint — a citation is quiet emphasis; brackets and mono are retired (they read as code, not annotation).

## 7. Uncertainty

- Three-level vocabulary only: no raw percentages unless the underlying system is actually calibrated. Rendered as Badges: high = `success` "Verified" / "확인됨" (only when checked against a source), medium = `neutral` "Likely" / "추정", low = `warning` "Unverified" / "미확인".
- Low-confidence output additionally hedges in copy using approved templates ("Based on limited data, …" / "제한된 데이터 기준으로는 …"). Hedging lives in the text, uncertainty class lives in the Badge — don't duplicate the hedge in both.
- NEVER express uncertainty with opacity, italics (banned anyway), or decorative question marks.

## 8. Interruption & cancellation

- Every generation: Stop control (§2). Every long-running run: Cancel (`ghost` in the run's toolbar).
- Cancelling a run with no external side effects: immediate, no confirmation. With side effects already executed: Modal states what has and hasn't happened before confirming ("2 of 5 messages already sent. Cancel the remaining 3?").
- A cancelled run's status is `warning` Badge "Cancelled" / "취소됨" — distinct from `failed`.

## 9. Attribution

- Agent-produced artifacts (documents, table rows, configs) carry an attribution row: squared avatar + agent name + timestamp, 12px `fg.tertiary`.
- When a human edits agent output, attribution flips to "AI-drafted · edited by June" / "AI 초안 · June 편집" — the AI origin never silently disappears, and the human edit is never presented as AI output.
- In mixed lists (human and agent actors), every row shows its actor's avatar; shape alone (round vs squared) must be sufficient to scan authorship.

## 10. Failure & recovery

- A failed run or step uses the error EmptyState flavor inline: what failed, why in one sentence (cause, not stack trace), Retry action. Stack traces and raw errors live behind an expandable `.sy-code-block`.
- Copy never blames the user, never anthropomorphizes distress ("I'm so sorry!!"), and never fakes certainty about the cause. Neutral, factual, actionable: "The Slack connector rejected the request (rate limit). Retrying usually resolves this." / "Slack 연동이 요청을 거부했습니다(요청 한도 초과). 다시 시도하면 대부분 해결됩니다."
- After 2 automatic retries fail, stop retrying and escalate to the user with the manual-path alternative if one exists.
- Partial success is reported as partial: "Processed 312 of 328" with a link to the 16 failures — never rounded up to success.

## 11. Long-running work — ProgressBar

- Known-length work: determinate ProgressBar (see `components.md`) + "N of M" caption. Unknown: indeterminate bar + current AgentStep as the label. NEVER a bare spinner for work >10s.
- If the user navigates away, completion notifies via Toast (with View action); failure notifies via Toast danger variant. Runs in progress are always findable in the run list — background work is never orphaned.
- Time estimates only when derived from history ("usually ~4 min" / "평균 4분 소요") — never invented.

## 12. Agent-markdown rendering (v5.1)

Agent output is markdown; without fixed rendering rules every message improvises its own typography. The mapping is closed:

- **Headings demote:** agent `#` renders as `heading-md`, `##` as `heading-sm`, deeper levels as semibold `body`. Agent text NEVER produces `heading-xl/lg` — page hierarchy belongs to the page, not the message.
- **Body** = `body` style; lists get `space-4` item gaps, one level of nesting rendered, deeper flattened.
- **Code:** fences → the code block treatment (`bg.sunken`, `code` style, copy button, language chip, max-height 400px + expand); inline → `sy-code-inline`.
- **Links** = `fg.link` with the external mark for off-app targets; bare URLs auto-link and middle-truncate.
- **Tables** render as bare (frameless) dense tables — hairline header rule, `label` headers; wider than the message column → horizontal scroll, never reflow.
- **Blockquote:** 2px `border.strong` left rule + `fg.secondary`; one level, deeper flattened.
- **Images:** only user/workspace attachments render inline (max-width 100%, radius `md`, `caption` caption); remote URLs render as links, never fetched — provenance and safety. **Human messages (v6.28–28.1):** attachments stack above the bubble text in fixed order — document ContextCards first, then images (bubble-aligned, radius `md` + hairline, max-height 240; two side by side, 3+ as a 2-wide grid, never a MediaGroup fan — that is generated media only), then the text.
- **Task lists** → read-only Checkboxes; **hr** → full-bleed `border.subtle`; emphasis follows system rules (bold = 600; italics normalize to 600 per foundations §2.3.2).
- **Streaming safety:** block elements (tables, fences) render when their block closes — partial tables never flash unstyled; text streams per §2.

## 13. CommandPalette as the AI entry point

The palette (⌘K / Ctrl+K, see `components.md`) is the universal entry surface: navigation, actions, and the "Ask agent" escape hatch as its final item when no result matches ("Ask agent: '{query}'" with the accent treatment). This gives every screen an AI affordance without scattering accent buttons across the chrome — preserve that scarcity.

## 14. Reasoning disclosure (v5.2)

When the product exposes an agent's working/reasoning text, it renders as a **disclosure row**, never as answer content:

- Collapsed by default: chevron + "Reasoning" / "추론 과정" (`label`, `fg.tertiary`) + duration. Expanding reveals the text in `body-sm` `fg.secondary` on `bg.surface`, rendered with the agent-markdown rules (§12) but capped: no headings, no images.
- Reasoning is visually subordinate to the answer — it never uses `fg.primary`, never carries SourceChips (citations belong to claims in the *answer*), and is excluded from copy/regenerate (the ResponseToolbar acts on the answer only).
- Expand state persists per user per conversation; auto-expand is forbidden.
- Reasoning MAY be redacted by policy; a redacted section says so plainly ("Reasoning not available for this response" / "이 응답의 추론 과정은 제공되지 않습니다") — never renders as empty.

## 15. Guardrail notices (v5.2)

A refusal or blocked action is a *policy outcome*, not an error — it must not wear error styling:

- Render as an inline notice on `bg.sunken` with the shield icon and `fg.secondary` text (the neutral Banner treatment). NEVER `status.danger` — red teaches users that policy is breakage.
- Copy names the category and the path forward, without lecturing: "This request can't be completed under your workspace's data policy. An admin can review the policy in Settings." / "워크스페이스 데이터 정책에 따라 처리할 수 없는 요청입니다. 정책은 관리자가 설정에서 확인할 수 있습니다."
- Partial blocks (some sources excluded from an answer) note it in a `caption` line + the SourceChip broken state — the answer renders, the exclusion is visible.
- NEVER disguise a policy block as a technical failure, and never the reverse.

## 16. Human handoff (v5.2)

When an agent escalates to a person (or a person takes over):

- The transfer renders as a conversation row: transfer icon + "Handed off to {name}" / "{name}님에게 전달됨" (`caption`, `fg.tertiary`) with the assignee's round Avatar — from that row on, the actor shape flips and stays flipped. The avatar shape system (round=human, squared=agent) carries the state; no extra chrome.
- The waiting state is a status Badge: "Needs review" / "확인 필요" (`warning` subtle) on the run/task wherever it appears in lists.
- Handing *back* to the agent is an explicit action — `primary` or `secondary` per the region's hierarchy ("Resume agent" / "에이전트 계속하기"); it is operational, not a conversational entry, so never `accent`. Agents never silently reclaim a task a human took.
- In mixed activity feeds, handoffs are first-class events, never inferred from adjacent rows.

## 17. Usage & limits (v5.2)

- Quota display is the ProgressBar usage jurisdiction (`components.md`): determinate, tabular-nums values, warning fill at ≥80%, danger at 100% with the plan-limit Banner ("Workspace is out of agent credits — runs are queued." / "워크스페이스 크레딧이 소진되어 실행이 대기 중입니다.").
- Costs shown on runs are actuals, locale-formatted (content.md §6); estimates are labeled as estimates and derived from history, never invented (§11).
- Approaching-limit states degrade gracefully: agents keep accepting requests and queue them; the composer never locks on quota — the Banner carries the state.

## 18. Selection & reply (v6.12)

Selected text inside an agent message is a first-class conversational object.

**Reply pill:** selecting text in an agent message raises a single floating pill ("Reply" / "답장", reply icon) — `bg.raised-2`, `border.overlay`, `shadow.overlay`, pill radius, `z.dropdown`, standard entrance. One pill, no toolbar of options; it disappears on deselect or esc.
**Quote highlight:** the selected passage takes `ai.surface` fill + inset `ai.border` hairline while quoted.
**ComposerQuote:** choosing Reply inserts a quote bar into the Composer above the textarea — `ai.surface` fill, `ai.fg` text, reply icon, single-line ellipsis, × remove. Radius `xs` (concentric: composer radius 16 − 12 padding = 4). Max one quote per send; quoting replaces any existing quote. The sent message renders the quote above the user text.

**Selection actions (v6.47, closed set):** the floating pill carries 답장 · 설명 · 재생성 — and nothing else without governance (actions come from the action glossary). 설명 composes a quoted follow-up ("이 부분을 설명해 줘" + ComposerQuote of the selection); the explanation arrives as a NORMAL agent turn in the thread. Selection actions NEVER mutate the original message in place — thread history is append-only (provenance law). Rewrite-type actions apply only to the user's OWN draft (§24), never to agent output.

## 19. Follow-up panel (v6.12)

Suggestion chips (Chip `suggestion`, max 3) stay the passive default. When the Composer is focused and follow-ups exist, an anchored panel MAY open above it: **glass material** (v6.23 — the one anchored exception to the scrim-gating in foundations §5: the panel floats over thread content like a mini-palette, is static while open, and dismisses on esc/typing; reduced-transparency falls back opaque) with `border.overlay`, `shadow.overlay`, radius `md`, 6px padding, 32px rows at radius `xs`; rows lead with the 12px follow-up arrow, full-bleed keyboard header row in keycaps (↑↓ 이동 · ↵ 선택 · esc 닫기). **Placement (v6.23.1–2):** the panel is absolutely anchored **8px above the Composer's top edge** (a floating layer detaches from its anchor — flush contact reads as part of the input; anchored menus use 4px, the panel's larger mass earns 8) and OVERLAYS the last thread messages — it never pushes content down (layout shift on open is forbidden, and the glass material is meaningless without content behind it). Max 4 rows; selecting inserts the text into the Composer (never auto-sends). Chips and panel never show simultaneously.

**Chip honesty (v6.47, adopted law):** a suggestion chip's visible label IS the query it sends — never a longer or different hidden prompt. If the real query needs more words than the chip can show, the chip inserts into the Composer for editing instead of sending.

## 20. Answer anatomy & named working states (v6.13)

**Titled answer sections:** agent replies longer than ~4 paragraphs or produced by a multi-step run MAY open with an answer header: title (`heading-sm`, from the run's stated goal) + total duration Badge (`neutral` subtle, tabular numerals) + collapse chevron (ghost icon-button). Collapsed keeps title + duration; expansion state persists in the transcript. One header per reply — never per paragraph.
**Named working line:** during multi-step generation, a status line above the steps names the current activity from the step plan ("보고서 초안 생성 중…" / "Drafting the report…"), `body-sm` `fg.secondary` with the `pulse` opacity animation (skeleton precedent — gradients/shimmer remain forbidden). Replaces a bare spinner whenever step names exist; the stop control stays adjacent per §2. The line resolves into the answer header's title on completion.

**Point color for active states (v6.51):** while an agent run is ACTIVELY working, its running-state indicators use the point color `#0A84FF` — the live-agent beacon Badge and the in-progress `ai` ProgressBar (both via `ai.solid`, repointed to blue). Blue = AI at work; the moment it completes or idles, the indicator returns to neutral/slate. The AI *surface* (ai.surface/border/fg) stays slate throughout — blue is a solid accent mark, never a tint on the slate fill.

## 21. Generated media (v6.16)

Agent-generated media renders as a MediaGroup fan (see components.md). Media-only replies carry the `media` ResponseToolbar rail beside the fan; replies that mix text and media use the message-level ResponseToolbar alone — never both (v6.17.7). The governing principle: **playfulness lives in the agent's output, never in the chrome** — rotation, the one playful device in the system, is confined to media the agent made. Provenance still applies: generated media carries the standard attribution row, and image content follows the same honesty rules as text (no fake photographic "evidence" of claims).

## 22. Result variants & partial regeneration (v6.25)

**Variant pager:** an agent reply MAY hold multiple variants of itself. The answer header (§20) gains a right-aligned pager: ‹ › ghost icon-buttons (sm) around a `caption` tabular "2/2". Regenerate on the latest reply creates variant N+1 — it never destroys; switching is non-destructive; each variant keeps its own provenance and attribution. Max 5 variants, then regenerate replaces the oldest unpinned.
**Partial regeneration:** the §18 selection pill carries TWO actions — "답장" and "재생성" — separated by a hairline. 재생성 regenerates only the selected passage in place: the new text lands with a temporary `emphasis.surface` flash and an Undo Toast (reversible-lite convention). Never a third pill action; scope is the selection, never the paragraph around it.

## 23. Prompt templates & placeholders (v6.25)

**Library:** prompts can be saved ("템플릿으로 저장" in the sent message's ⋯ overflow) and recalled two ways — the Composer's `/` scope gains a 템플릿 group (expert quick-insert), and the **bookmark icon-button opens the Template Library Modal (v6.30–31 — upgraded from a menu: title-only rows cannot answer "what does this template do to my prompt?"; a library shows content before commitment).** Modal anatomy (opaque `bg.raised`, **760 — the browse-library width, a named Modal exception (v6.34): forms cap at 640, data-review Drawers run 800, libraries sit between**, **two-pane**): header (title + close, **16 vertical / 24 sides — vertical symmetric against the hairline; sides match the pane's 24 content column**, v6.34.2) over a hairline · left list column (260, **`bg.surface` fill — the layered-pane read**: full-bleed search row · **scope SegmentedControl (전체 / 내 템플릿 / 팀, v6.34)** · **즐겨찾기 group always first** (star toggles, v6.34.1 — was pin/고정됨) — favoriting is the volume answer: the working set stays on top regardless of library size — then `micro-label` group headers per scope, borderless 32px rows with a **hover-reveal star toggle** (20px compact, `aria-pressed`; idle = stroke, **active = FILLED at `emphasis.fg-soft` (v6.35 — slate.500/400, the lightest legal value: one step above the 3:1 non-text floor, gate-checked; the fill carries the mass so the mark affords lightness text cannot) — the one sanctioned fill-on-active icon: a favorite toggle's job is broadcasting state, and stroke+color alone read inactive.** Thumbs and all other icons stay stroke-only; favorited rows keep the star visible), selected = `bg.selected`; "새 템플릿 만들기" pinned at the bottom over a full-bleed hairline, uniform 8px padding around the row (v6.32.1)) · right preview pane (uniform 24 padding): **eyebrow lockup with a star toggle top-right (24px, mirrors the row state)** — group as a `micro-label` eyebrow over the `heading-sm` name (the eyebrow carries ownership; no badge needed), one-line description, the **cloze preview as a blockquote** (2px `border.strong` left rule — the system's quotation language, slots highlighted in `emphasis.surface`), and 삽입 (`primary`) bottom-right. Below the description sits a `caption` meta line (owner · last edited — v6.32), and under the cloze a `caption` slot summary ("입력 항목 N개 · 삽입 후 →로 이동" — v6.32.2, functional texture that teaches the → behavior); the pane footer pairs keycap hints (↵ 삽입 · esc 닫기, `micro` + `.sy-kbd`) left with 삽입 (`primary`) right, and ↵ inserts the selected template. Column-internal rules (search row, pinned footer) bleed to the column edges per the divider law. **At scale (v6.33):** the modal body fixes its height (420) and the row region scrolls independently — scrollbar at the column edge per the scroll-container law — with sticky group headers (surface-filled so rows slide beneath); search filters live on title, hiding emptied groups, with the compact no-results line ('…에 대한 결과가 없습니다'); ↑↓ move the selection through visible rows (scrolling it into view), ↵ inserts. Selecting a row previews; 삽입 or ↵ inserts with slot chips and closes. Content appears once in the pane — never repeated per row (boxes-in-boxes is the wireframe formula's cousin).
**Placeholders:** templates carry named slots rendered as inline slot chips in the Composer text — `emphasis.surface` fill, `fg.secondary`, radius `xs`, "[기간]" label. → moves between slots (consistent with ghost completion; never Tab — IME). Send with an unfilled slot is blocked with a caption error naming the slot (extends the empty-send rule; the ONLY other sanctioned send-block).
**Bilingual hard rule:** templates are authored as complete per-locale sentences with slots — a slot NEVER has a Korean particle attached to it (content.md §4); if the sentence needs a particle, rewrite the template so the slot sits particle-free.

## 24. Authoring coach (v6.25)

**Quality hint:** while the Composer is focused, ONE `caption` `fg.tertiary` line MAY appear below it naming a concrete improvement ("기간을 지정하면 더 정확한 결과를 얻습니다"). Anti-nag rules are absolute: max one hint visible, never blocks or delays send, disappears on send or edit, never reappears for the same draft after dismissal, never uses warning/danger color — coaching is an offer, not a gate.
**Refine prompt (extended v6.27 — assisted editing):** the pen-line `ghost` icon-button (contextual, v6.44: floats at the input's top-right only while the draft is non-empty) opens a small menu of **preset refinements** — a CLOSED set: 전체 다듬기 (general; relabeled from 프롬프트 다듬기 in v6.47.3 — that string became the menu's micro-label header, and a row must never duplicate its header), 더 자세히, 더 간결하게, 기간·범위 구체화, 형식 지정. Menu anatomy matches the picker family (v6.47.3): `micro-label` header + rows + separator before the preset group; the preset list is part of this spec and extends only by governance (freeform "rewrite styles" are forbidden — that is glossary drift into the input). The chosen rewrite REPLACES the composer text with an Undo Toast (reversible-lite); on an empty draft the button is NOT RENDERED (v6.44 — visibility replaces disablement: a contextual affordance appears when applicable rather than sitting disabled). Never automatic; the rewritten text is the user's to edit — no provenance marking inside the input (authorship stays with the user).
**Not adopted:** generative inline autocomplete of prompt text. Ghost completion stays closed-glossary — model output inside the user's input muddies authorship where provenance cannot mark it.

## 25. Threads (v6.25)

**History:** conversations list in the Sidebar as standard nav items under `micro-label` time groups (오늘 / 이전 — same grouping language as NotificationCenter), title single-line ellipsis, active = `bg.selected`. Max 2 groups visible, then "모두 보기".
**New thread:** "새 대화" — ghost button (plus icon + text) at the top of the conversation group; ⌘K also always offers it.
**Temporary chat:** a Switch row in the agent-picker footer area ("임시 대화" + caption "기록에 저장되지 않습니다"); while active, the Console header shows a `neutral` Badge "임시" — state must be visible, not just set.

## 26. Voice input (v6.26 — maintainer decision; supersedes the earlier "parked" ruling)

**Scope: dictation, not voice messages.** Speech becomes editable text in the Composer — the user reviews and sends. Audio never posts to the thread: agent conversations stay textual so provenance, search, and quote-reply hold. Authorship stays with the user (§24 logic — the transcript is the user's own speech).

**Trigger:** mic `ghost` icon-button on the Composer footer's trailing side, immediately left of send (v6.43 — relocated from the leading group: dictation fills the message about to be sent). Never inside the ⋯ overflow — voice input must stay one tap away.
**Recording state:** the Composer tray morphs in place (never a separate overlay): Cancel (`ghost` Button, "취소") · pulsing 8px `status.danger-bg-solid` dot + tabular timer ("0:04") · compact level meter (≤5 bars, 2px wide, `fg.tertiary`, transform-scaleY animation only — motion law; static under reduced-motion) · pause `ghost` icon-button · confirm as a **`primary` icon-only circle (check)** in the send position — the same morph language as send↔stop. Esc cancels; ↵ confirms.
**After confirm:** a working line ("받아쓰는 중…", pulse) while transcribing, then the transcript inserts at the caret — appended to any existing draft, NEVER auto-sent.
**A11y:** recording state change announced via `aria-live`; the ticking timer is `aria-hidden` (announce on start/stop, not every second); the mic button reflects state in its `aria-label`.
**Forbidden:** auto-send on transcription end; audio artifacts in the thread; waveform decoration outside the recording bar; recording without the visible danger-dot indicator.


## 27. Prompt starters (v6.47)

**Zero state only.** An empty conversation (new session, no turns) MAY show 3–4 starter chips above the Composer — `tag-sugg` anatomy, same object as §19 suggestions (one suggestion language system-wide). Selecting a starter INSERTS into the Composer for editing — never auto-sends (§19 chip law applies).

- Starters MUST model a complete, well-formed prompt in the workspace's domain — never "무엇이든 물어보세요" (a starter that doesn't teach prompt structure is decoration). **Label ≠ insertion (v6.47.4, demo-verified):** the chip label is a short task handle (2–4 words); selecting it inserts the full exemplar prompt (scope, format, constraints spelled out). The label is a handle; the insertion is the lesson. Chip-honesty (§19) is preserved because starters insert for editing — they never send.
- Personalize by role and recency after the first session (e.g., resume where the user left off); rotating generic starters past session one is an anti-pattern.
- Dismissible (× at row end); dismissal persists per user. Never advertise a capability the selected agent cannot deliver.
- Disappears at first turn; §19 follow-ups take over. The two never render together.

## 28. Attachment intelligence (v6.47)

After attach, the chip/tile MAY gain an advisory caption: extracted shape, not content judgment ("CSV · 328행 · 7/6–7/12 접수 문의") — `caption` style, `fg.tertiary`, marked 자동 요약. Laws: **advisory only** — never blocks send, never modifies the attachment, never required for send; pending state uses the `pulse` opacity animation (named-working-state family, §20); analysis failure falls back silently to the plain chip (no error surface for an optional nicety); agent-attributed like all generated text. Purpose: the user verifies the RIGHT file went in before spending a run.

## 29. Batch input processing (v6.47)

Multiple homogeneous inputs (files, records, queries) submitted at once run as a **queue**, not a mega-prompt:

- Per-item row: mono filename + progress bar (R-progress anatomy) + status (완료 / n% / 대기 / 실패).
- Individual control: pause and cancel per row (compact 20px icon buttons, v6.27.2 family); 실패 rows retry individually — one failure NEVER aborts the batch.
- Batch footer: aggregate line ("2/4 완료 · 예상 3분") + 결과 내보내기; results land in a Table (recipe R15), one row per item.
- External side effects inside a batch still pass ProposalCard (§5) — batching never bypasses approval; pre-approved tool budgets apply per item.
- The Composer stays usable during a batch run (never blocks on the queue).

## 30. Predictive text (v6.47 — generalizes the slash-command ghost completion)

Whole-prompt continuations MAY render as ghost text after the caret: `fg.placeholder`, max one line, plain text only.

- **→ accepts. Tab NEVER accepts** (IME law, same ruling as slash completion and template slots).
- Suppressed entirely while Hangul composition is active (compositionstart→compositionend) — ghost text inside composing syllables is unreadable.
- Continue typing = dismiss; no explicit dismiss control. Ghost text never changes what send submits — only accepted text is real.
- Sources: closed — the action glossary, the user's own recent prompts, and template titles. Freeform model-generated continuations require a governance proposal (latency + wrong-ghost cost: bad ghost text is worse than none).
