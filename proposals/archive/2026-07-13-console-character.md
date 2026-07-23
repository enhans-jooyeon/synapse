# Proposal: Console character pass (reference: attached AI-chat shots)

**Date:** 2026-07-13 · **Status:** all four groups approved; implemented v6.12.0–6.15.0 · **Scope:** Console archetype, Composer, agent-reply anatomy

## What the references actually do well

Dissecting the five shots, the character comes from six repeatable moves, not from their visual skin: (1) selected text becomes a first-class conversational object (Reply pill → quoted chip in the composer); (2) follow-up suggestions are keyboard-first, not just clickable chips; (3) context objects (meetings, docs) are visible physical cards in the thread, not just filenames; (4) long answers have real anatomy — title, duration, collapse; (5) the composer is a workbench (slash commands, ghost completion, action chips, drop target); (6) working states are named ("Getting a detailed report…"), not generic spinners.

Not adoptable under §8 or product reality: the sparkle/glow backdrop (glow forbidden), gradient shimmer text (gradients forbidden — a `pulse`-style opacity animation achieves the same read legally), provider-colored model chips (AgentOS pickers select *agents*, which already carry tinted squared avatars), and the voice-recording suite (a product-feature decision — parked at the time; superseded v6.26: adopted as dictation-only, ai-patterns §26).

## A — Selection & reply loop (highest character-per-effort)

**A1. Quote-reply.** Selecting text in an agent message raises a floating ghost "Reply" pill (raised-2 surface, shadow.overlay, z.dropdown). Choosing it inserts a **ComposerQuote** bar into the Composer: `ai.surface` fill, `ai.fg` text, quote icon, × dismiss, one per message send. The selected passage gets a temporary `ai.surface` highlight. New ai-patterns section + Composer anatomy extension.

**A2. Follow-up panel.** The static suggestion chips (max 3) gain a keyboard mode: an anchored panel above the Composer listing up to 4 follow-ups as rows (arrow icon + 13px text), navigable with ↑↓/↵/esc shown as existing `.sy-kbd` keycaps in a header rule row. Reuses palette row anatomy; entrance per motion law. Chips remain the default; panel appears on focus/shortcut.

## B — Composer as workbench

**B1. ContextCard + stack.** Attached objects (docs, meetings, tables) render as small cards in the thread: 16px icon tile + title (13 medium, truncating) + `caption` meta, outlined, radius `sm`. Multiple attachments stack with a flat 4px offset (max 3 visible + "+N") — no rotation, we're not playful, we're precise. Doubles as the @-mention render inside Composer text.

**B2. Slash commands + ghost completion.** `/` in an empty Composer opens the command palette scoped to agent actions; mid-word the rest of the match renders as `fg.placeholder` ghost text completed with →. Content rule: commands come from the closed action glossary.

**B3. Dropzone.** ~~New component~~ Correction: FileUpload already exists with a dropzone variant — this is a retune of it: `bg.sunken` fill, 1px **dashed** `border.strong` (the system's first sanctioned dashed border — jurisdiction: drop targets only), radius `xl` shell, icon medallion + title + `caption` format list + browse Link. Drag-over: border → `border.focus-input`, fill → `emphasis.surface`.

**B4. Agent-picker menu upgrades.** The Composer's agent selector adopts what the model-picker shot does structurally: search row (already legal >8 items), grouped toggles at top, one submenu ("More agents"), `micro` badges on rows (BETA/SOON equivalents from the glossary), and a footer escape row ("에이전트 요청" — proposals never dead-end).

## C — Answer anatomy & working states

**C1. Titled answer sections.** Long agent replies MAY open with a section header: title (`heading-sm`) + duration Badge (neutral, tabular mono numerals) + collapse chevron; collapsed state keeps title + duration. Extends the existing steps/reasoning disclosure — durations already exist there.

**C2. Named working line.** While generating, a status line names the activity from the step plan ("보고서 초안 생성 중…") with the `pulse` opacity animation (skeleton precedent — no gradient shimmer). Replaces bare spinner during multi-step runs; the stop control stays adjacent per ai-patterns.

## Sequencing

A and C are pattern/spec + preview work on existing components (one minor each). B3 and B1 add components (governance: new `##` entries + manifest). B4 is menu-spec extension. Suggested order: A → C → B1/B3 → B2/B4.
