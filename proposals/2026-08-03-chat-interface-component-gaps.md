# Chat interface — component gap audit

**Date:** 2026-08-03 · **Status:** accepted (June, 2026-08-03) · **Scope:** the Console conversation surface

Audit of what a chat interface in AgentOS actually requires, measured against the closed component set. Prompted by the working assumption that the chat surface is "mainly covered under `ai-patterns.md`." It is covered as *behavior*. It is not covered as *anatomy*, and for the two most-used objects it is not covered anywhere the contract can see.

---

## 1. The finding — an authority inversion

`design.md` §1 ranks `preview.html` as **"Reference only, not authority."** Yet the anatomy of a chat message exists there and nowhere else:

```css
.msg-h { max-width: 75%; margin-left: auto; background: var(--sy-bg-sunken);
         border-radius: var(--sy-radius-xl); padding: var(--sy-space-2) var(--sy-space-3); ... }
.msg-a { display: flex; gap: var(--sy-space-2); ... }
.ans-h { display: flex; align-items: center; gap: var(--sy-space-2); margin-top: var(--sy-space-2); }
```

`patterns.md` §1E contributes three bullets (bubble side, fill, radius family). `ai-patterns.md` §12 governs what markdown *renders as* inside a message. Neither describes the message as an object: no state set, no variant set, no forbidden list, no a11y contract, no manifest entry.

**Consequence.** An agent following the documented load order (`design.md` → `synapse.manifest.json` → archetype section → prose specs) can build a complete Console screen without ever encountering a specification for the message. `synapse lookup Message` returns nothing. The gate has no rule to apply. The only complete description lives in the file the contract explicitly demotes.

This is the same failure mode as audit **Defect 7** (`components.md` ↔ `synapse.manifest.json` parity, HANDOFF open thread #3): a real specification exists, in a place nothing enforces.

---

## 2. Coverage table

Every object the Console renders, and where its specification actually lives.

| Object | Behavior rules | Component entry | Manifest | Preview story | Verdict |
|---|---|---|---|---|---|
| Composer | §2, §18, §23–24, §26–30 | ✅ | ✅ | `s-composer` | complete |
| ResponseToolbar | §35 | ✅ | ✅ | `s-response-toolbar` | complete |
| AgentStep | §3–4 | ✅ | ✅ | `s-agentstep` | complete |
| ProposalCard | §5 | ✅ | ✅ | `s-proposal` | complete |
| SourceChip | §6 | ✅ | ✅ | `s-provenance` | complete |
| ContextCard | §12, §28 | ✅ | ✅ | `s-contextcard` | complete |
| MediaGroup | §21 | ✅ | ✅ | `s-mediagroup` | complete |
| CommandPalette | §13 | ✅ | ✅ | `s-palette` | complete |
| ProgressBar | §11, §17 | ✅ | ✅ | `s-loading`, `s-usage` | complete |
| DiffView / CodeBlock | §31, §12 | ✅ | ✅ | `s-code` | complete |
| **Reasoning** | §14 | ❌ | ❌ | `s-reasoning` | **tier 1** |
| **FollowUpPanel** | §19 | ❌ | ❌ | `s-followups` | **tier 1** |
| **ConversationSummary** | §34 | ❌ | ❌ | `s-summary` | **tier 1** |
| Guardrail | §15 | ❌ | ❌ | `s-guardrail` | tier 1 (deferred) |
| Handoff | §16 | ❌ | ❌ | `s-handoff` | tier 1 (deferred) |
| **Message** | §12 (rendering only) | ❌ | ❌ | ❌ | **tier 2** |
| **Thread** | §2 (scroll bullets) | ❌ | ❌ | ❌ | **tier 2** |
| **AnswerHeader** | §20 | ❌ | ❌ | ❌ | **tier 2** |
| **VariantPager** | §22 | ❌ | ❌ | ❌ | **tier 2** |
| **SelectionPill** | §18, §22 | ❌ | ❌ | ❌ | **tier 2** |
| TemplateLibraryModal | §23 | ❌ | ❌ | (in `s-sample-console`) | tier 2 (deferred) |

**Tier 1** — the behavior is specified and a preview story renders it, but no component entry exists. These need *promotion*: lift the anatomy into `components.md`, leave the rules in `ai-patterns.md`.

**Tier 2** — no component entry and no dedicated story. The anatomy exists only as CSS classes inside `s-sample-console`, or not at all. These need *authoring*.

---

## 3. Anatomy drift — rules doc carrying component specs

`ai-patterns.md` is scoped to interaction conventions. Two sections have accumulated pure anatomy:

- **§19** (follow-up panel) — fill, border, shadow, radius, padding, row height, row radius, icon size, anchor offset, row cap. ~200 words of anatomy inside a behavior clause.
- **§23** (template library) — ~1,900 words specifying pane widths (260 / 760), padding (16 vertical / 24 sides), star-toggle states, group headers, scroll containers, footer keycaps. This is a component specification that happens to live in a rules file.

Anatomy outside `components.md` is anatomy outside `synapse.manifest.json`, which means it is outside `synapse lookup` and outside the gate. §19 is corrected by this proposal. **§23 is deliberately deferred** and remains an open thread.

---

## 4. Defects found during the audit

### 4.1 §18 ↔ §22 — a closed set contradicting itself

| Source | Selection pill actions |
|---|---|
| §18 | 답장 · 설명 · 재생성 — "and nothing else without governance" (**three**) |
| §22 | "carries **TWO** actions — 답장 and 재생성 … **Never a third pill action**" (**two**) |
| `preview.html` | 답장 · 설명 · 재생성 (**three**) |

A closed set with two definitions is not closed. **Ruling (June, 2026-08-03): three is law.** 설명 was a later addition whose ruling never propagated to §22; §22's "never a third pill action" sentence is stale and is struck. §22 retains its actual subject — that 재생성 scopes to the selection, not the surrounding paragraph.

### 4.2–4.4 Manifest instructs agents to build forbidden surfaces

The glass → opaque reversal ("Overlays are opaque — glassmorphism explored and dropped", CHANGELOG) updated the prose specs and left `tools/build_manifest.py`'s hardcoded strings untouched:

| Manifest string | Authoritative spec | Violation |
|---|---|---|
| Template Library Modal "(**glass 640**…)" | opaque `bg.raised`, **760** (components.md Modal; §23) | never-list glass; wrong width tier |
| CommandPalette "**glass material, SCRIMLESS**" | opaque `bg.raised` over `bg.scrim` (components.md; foundations §6) | never-list glass; missing scrim |
| AppLauncher "centered **glass-scrimless** overlay … **radius lg**" | faux-glass opaque over `bg.scrim`, radius **2xl** (components.md) | never-list glass; missing scrim; wrong radius |

**Severity.** `design.md` §7 instructs agents to load `synapse.manifest.json` *first*, as the compact index. All three strings describe surfaces that `design.md` §8 forbids and that SY015 rejects on sight. An agent trusting the load order builds a surface the gate then fails — the contract contradicting itself across two files.

**Why the gate is blind.** SY017 checks manifest freshness by comparing `synapse.manifest.json` against `tools/build_manifest.py` — the file that *contains* the stale strings. Regenerating propagates the error and reports success. No rule reads `components.md` prose and compares it to the manifest entry, so any hardcoded string can drift from its spec indefinitely with a green gate.

**Instance count.** HANDOFF thread #3 records `control-height-xs` as the third occurrence of the CSS/JSON/prose parity defect. These are the fourth, fifth, and sixth. The pattern is not "occasionally something drifts" — it is "nothing checks, so everything drifts eventually." A parity gate reading prose anatomy against manifest `key_rules` is the highest-value tooling fix open, and this audit raises its priority above the component work it interrupted.

---

## 5. Scope of this tranche

**In (8 components, ruled 2026-08-03):**

- Core thread stack — **Message**, **Thread**, **AnswerHeader**, **Reasoning**
- Response surface — **VariantPager**, **SelectionPill**, **FollowUpPanel**, **ConversationSummary**

**Deferred, explicitly:** Guardrail (§15), Handoff (§16), TemplateLibraryModal (§23), and a Console/chat **recipe** composing the eight. The recipe absence is worth naming as a risk: eight individually-specified objects with no canonical assembly is how a system accumulates parts that do not sit together. `patterns.md` §1E's three bullets are not a composition spec.

---

## 6. Method — codify, do not invent

Every anatomy below is lifted from what `preview.html` already renders and what `ai-patterns.md` already rules. Where the render and the spec agree, the spec is written from both. Where only the render exists (`.msg-h` max-width, `.ans-h` gap), the render is treated as the de-facto ruling and recorded as such — visible in the product, unspecified until now, not a new design decision. **No new tokens, no new icons, no new variants.** Per `design.md` §7: restraint is the design language, and an audit that ships new design alongside a correction is two changes wearing one commit message.

Two values are recorded as inherited-from-render rather than derived from a stated rule, and are flagged for a maintainer's eye:

1. `.msg-h` **max-width 75%** — a proportional cap inside an already-capped 760 column. Not obviously wrong; not obviously the intended rule either. No other component uses a percentage width.
2. `.msg-h` **radius `xl`** vs. the agent message's borderless plain text — correct per §1E, but the pairing (`xl` on a small bubble, nothing on the reply) is a deliberate asymmetry worth stating out loud in the spec so it is not "corrected" later by someone tidying radii.
