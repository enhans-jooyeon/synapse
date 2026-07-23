# Proposal: Composer input-pattern audit (reference: aiuxplayground.com/patterns/input, all 22)

**Date:** 2026-07-14 · **Status:** all 8 approved (A1–A4, I1–I4), implemented v6.47.0; 4 rejections upheld · **Scope:** Composer, Console/HOME zero states, attachments, selection loop

## Coverage map — 22 reference patterns vs Synapse

**Already covered (12, no action):** Tool Switching (도구 popover, v6.41), Context Chip Management (+ menu 파일 첨부 + grouped removable chips/tiles), Follow-up Chips (§19/§20, max 3 + keyboard panel), Command Bar (CommandPalette ⌘K), Context Mentions (@ → ContextCard, §B1), Slash Commands (§B2, closed action glossary), Voice Input (§26 dictation + recording bar), Multimodal Input (attachments + dropzone), Prompt Templates (§23 + Library modal — reference's "editable before send" and "no untracked side effects" laws already hold), Persona Selector (agent picker — agents encapsulate persona), Dynamic Follow-ups (§19), Smart Autocomplete (subsumed under Predictive Type below).

**Recommend REJECT (4):**
- *Gesture Input* — pen/touch computer-vision input; AgentOS is web-only desktop enterprise. No jurisdiction.
- *Voice-to-Action* — voice-triggered command execution; contradicts the v6.26 maintainer ruling (dictation only, transcript never auto-sends). The reference's own safety line ("confirms actions before execution") is our ProposalCard, but the ruling stands.
- *Input Mode Toggle* — a text/voice/dictation mode switch presumes conversational voice mode, which was excluded in v6.26. The mic button IS our mode affordance.
- *Tone Sliders* — freeform style axes conflict with the §24 closed-preset law ("freeform rewrite styles are forbidden — glossary drift into the input"). The presets are the governed equivalent; a slider would reopen that door.

**Candidate ADDs (4):**
- **A1. Prompt starters (zero state).** Empty Console/HOME conversation shows 3–4 starter chips modeling good prompts. Reference laws worth adopting: starters must model good prompt structure (never "무엇이든 물어보세요"), personalize by role/recency after first session, dismissible, never advertise capabilities the agent can't deliver. Distinct from §19 follow-ups (post-answer) and §23 templates (maintained library) — this is the first-open teach moment.
- **A2. Selection-action menu** (merges reference Magic Edit + AI Context Menu). Extend the §18 Reply pill: selecting agent-message text raises the pill row with a CLOSED action set — 인용 (reply, existing), 설명, 다시 쓰기(user's own draft only). Governance: actions come from the action glossary; results render as normal agent turns (provenance preserved), never silent in-place mutation of the thread.
- **A3. Upload preview (attachment intelligence).** After attach, the chip/tile gains an advisory AI caption (e.g., "CSV · 328행 · 7/6–7/12 문의") with a pulse pending state. Laws: advisory only — never blocks send, never auto-modifies the attachment; caption is agent-attributed; failure = silent fallback to plain chip.
- **A4. Batch input processing.** Multiple homogeneous inputs → per-item queue (progress bars exist: R-progress anatomy), pause/cancel/prioritize per item, results as Table. Very AgentOS-shaped (bulk ticket/document runs); big surface, likely its own section + Workbench recipe rather than Composer-only.

**Candidate IMPROVEMENTS to existing (4):**
- **I1. Active-tools indicator.** Tools now live two clicks deep in the + menu; the reference's core warning is silent capability state ("why did it do that?" tickets). When toggles deviate from agent defaults, the + button gains a 6px dot (notification-dot anatomy).
- **I2. Slash discoverability.** Reference anti-pattern we currently commit: no visible hint that "/" exists. Add the composer placeholder variant "무엇을 도와드릴까요? ( / 명령)" or a one-time §24-style hint line.
- **I3. Follow-up honesty rule.** Adopt verbatim as law: a chip's label IS the query it sends — never a different/longer hidden prompt (§19 addition).
- **I4. Predictive ghost text (general).** Extend §B2's ghost completion beyond slash commands to whole-prompt continuations (accept →, the IME-safe key we already ruled; Tab forbidden). Costs: Korean IME composition interplay is genuinely hard; latency makes bad ghost text worse than none. Recommend: spec as OPTIONAL capability with strict jurisdiction, or skip.

## Sequencing
I1+I2+I3 are small (one minor version together). A1 is spec + zero-state preview work. A2 touches §18 + selection wiring. A3 is FileUpload/chip spec + demo. A4 is the largest — own section + Workbench recipe. I4 only if wanted despite IME risk.
