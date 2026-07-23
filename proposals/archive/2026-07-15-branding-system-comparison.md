# Branding-team design system vs. ours — discrepancy report

**Date:** 2026-07-15 · **Status:** analysis for maintainer decision (no changes made) · **Compared:** `Downloads/Copy of Synapse Design System/` (branding team) vs. this repo (AgentOS Synapse, v6.50.0)

## The headline

These are **two different design systems that happen to share the name "Synapse."** They are not versions of one thing — they descend from different repos, target different products, and encode different decisions.

| | Branding team's system | Ours |
|---|---|---|
| Origin | `viralpick/synapse` v0.9.3, packaged `@enhans/synapse` | this repo (`enhans-jooyeon/synapse`) |
| Self-described as | **CommerceOS** design system (commerce-operations dashboards) | **AgentOS** design system (enterprise AI work platform) |
| Nature | React/Radix/Tailwind v4/CVA **component library** | machine-enforced **design contract** + spec + component browser |
| Stated purpose (yours) | slideshows & branding assets | the product UI system |
| Theme | light only | light + dark |
| Fonts shipped | Pretendard (9 static weights) + system mono | Pretendard + **Artific** (display) + **JetBrains Mono** |
| AI/agent surfaces | none | the entire point (ai-patterns §1–30, ProposalCard, Composer) |

The good news: on the single most important decision — **the brand action color is near-black, not a vivid hue** — the two systems actually agree. The divergences are in tone, scale, naming, font strategy, and domain coverage.

---

## Where they already agree

- **Black-key action color.** Their semantic `button-primary`, `button-brand`, `text-brand`, `icon-brand` are all `#262627` (near-black) — *not* blue. Their README frames `#0a84ff` as "the brand," but the actual action tokens are monochrome. This matches our black-key philosophy directly.
- **Borders-first, low-chrome.** Both lean on 1px borders + background-stepping over shadows, decline gradients/photography, and keep motion minimal.
- **Pretendard as the Korean-first UI face.** Same primary family, same bilingual KO-primary/EN-identifiers content posture.
- **lucide icon base**, stroke style, 16/20px cadence, semantic icon colors.
- **Slate palette exists** in both (though used for different jobs — see below).

---

## Discrepancies, by axis

### 1. Neutral tone (cool vs. neutral-warm)
- **Theirs:** grays read neutral-to-slightly-warm — `#262627` / `#4d4d4c` / `#808081`; text-primary is **pure `#000000`**.
- **Ours:** cool-gray ramp — `#09090B` / `#62626B` / `#83838D`; fg-primary is `#09090B` (near-black, never pure).
- **If matching:** re-picking the entire neutral ramp — the most visible single change; touches every surface.

### 2. Blue / accent posture
- **Theirs:** `blue-500 #0a84ff` (iOS systemBlue) surfaced for focus rings (brand target), links, brand badges — a live accent.
- **Ours:** blue is **deliberately retreating** — only focus rings, links, `status.info`; link blue is the calmer `#3155C6`. We deprecated the accent button entirely.
- **If matching:** reverses a hard-won direction. Their blue is brighter and more present than ours.

### 3. Slate's role
- **Theirs:** slate = "highlights, heavy borders, syntax"; a `background-highlight #e2e8f0`. One utility color among many.
- **Ours:** slate is **the AI-surface signal** — the semantic marker of agent presence (with the squared-avatar anti-collision rule). Loading their slate role would collide with ours.

### 4. Typography — scale, density, weights, font strategy
- **Family for display:** Theirs has **no Artific** — display/decorative is Pretendard at weights **700/900 (incl. Black)**. Ours uses **Artific** for brand moments (and we just made it English-only, SY016). *For slideshow/branding work this is the biggest single difference: the branding team does not use Artific at all.*
- **Weights:** Theirs ships **9 static weights (100–900)** and uses Thin/Black expressively. Ours restricts to **400/500/600/700** (no thin/black; sub-400 is a gate violation).
- **Scale & density:** Theirs runs **larger and airier** — H1 32 / H2 28 / H3 24, body **M 16px/1.5 default**. Ours is **denser** — heading-xl 24 max, body **14px** default (13 in dense regions).
- **Letter-spacing:** Theirs applies `+0.01–0.02em` tracking on labels **globally** (including Korean). Ours **forbids letter-spacing on Hangul** (SY007). Direct rule conflict if adopted.
- **Mono:** Theirs = system `ui-monospace`. Ours = **JetBrains Mono** specifically.

### 5. Radii
- **Theirs:** `4 / 6 / 8 / 12 / 9999` (small/medium/large/xlarge/round); buttons 6, cards/dialogs 8, modals 12.
- **Ours:** `4 / 8 / 10 / 16 / 24 / 9999`; larger container radii (cards to 16, sections to 24).
- **If matching:** every corner in the system shifts; our concentric-corner rule (inner = outer − inset) would need re-derivation.

### 6. Elevation / shadows
- **Theirs:** 7-step scale `xs → 2xl` + `glow`, used more freely (cards ship `shadow-sm`).
- **Ours:** 3 tokens (`raised/overlay/modal`), borders-first, shadows reserved for true floating layers; **glow is forbidden**.

### 7. Token naming & structure (migration cost lives here)
- **Theirs:** numeric-step families — `background-0/50/100/200`, `border-100/200/300`, `text-primary/secondary/tertiary`, `button-primary/secondary/tertiary/ghost/destructive/brand`, `icon-*`. Tailwind v4 utilities.
- **Ours:** named-role families — `--sy-bg-page/surface/sunken/raised`, `--sy-border-subtle/default/strong`, `--sy-fg-*`, `--sy-action-*`. Hand-authored CSS from DTCG JSON.
- **If matching:** a full token rename — every reference in tokens, preview, docs hub, and the validator would change. This is the single largest mechanical cost of alignment.

### 8. Buttons
- **Theirs:** style (`primary/secondary/tertiary/ghost`) × target (`default/destructive/brand`) — note a **tertiary** we don't have, and target-as-separate-axis.
- **Ours:** `primary/secondary/ghost/danger` (+ accent, deprecated). One-primary-per-region rule, conversational-AI-entry = primary.

### 9. Component inventory
- **Theirs (previews):** buttons, badges, inputs, cards, alerts, table, **datatable**, **charts** (echarts/oklch), **pickers** (date/calendar), controls, uploader, misc — a **commerce-dashboard** kit (also lists kakao-maps as an optional peer).
- **Ours:** 52-component closed spec centered on **agent/AI** surfaces (ProposalCard, Composer, SourceChip, MediaGroup, threads) plus workhorse components — little commerce/charting emphasis.
- **Overlap** is the basics (Button/Badge/Input/Card/Alert/Table); the two diverge hard at the edges toward each product's domain.

### 10. Dark theme & governance
- **Theirs:** light only; conventions enforced by lint rules + Do/Don't prose.
- **Ours:** full light+dark; a machine gate (SY001–SY018), version lockstep, manifest sync, closed sets, proposals governance.

---

## What this means for your stated purpose (slideshows & branding assets)

If the goal is that decks and brand assets look like **what the branding team ships**, the discrepancies that actually show up on a slide are, in order: **(1) no Artific — they use Pretendard Black for display; (2) larger/airier type scale; (3) neutral-warm grays + pure-black text; (4) their radii (smaller); (5) blue accent present rather than retreating.** Token naming and the AI-pattern domain (items 7, 9) are invisible on a slide — they only matter if you merge the *systems*, not the *look*.

## Options

- **A — Keep ours; treat theirs as the marketing/brand layer.** Accept that AgentOS-product-UI and branding-assets are two contexts. Don't touch our contract. When you need on-brand slides, use the branding team's `colors_and_type.css` + Pretendard weights directly. *Lowest cost, no drift; the "Synapse" name collision remains an org-level thing to resolve.*
- **B — Thin brand-mapping layer.** Add an optional `synapse.brand.css` that maps our tokens to theirs (or vice-versa) for export surfaces only, leaving the product contract intact. *Moderate; gives slides the branding look without rewriting the system.*
- **C — Align ours to theirs wholesale.** Re-tone grays, adopt their scale/radii/naming, drop Artific, re-introduce blue. *Highest cost, and it would unwind several deliberate AgentOS decisions (blue-retreat, slate-as-AI, Artific brand face, dark theme) that theirs simply doesn't need because it isn't an AI product.*

## My read (your call)

I'd lean **A, edging toward B** — and treat the shared name as the thing most worth fixing. The branding team's system is the org's real, shipped npm component library for CommerceOS; ours is a purpose-built AgentOS contract. They're not competing drafts of one system, so "matching" mostly means importing decisions that serve a *different* product. The parts genuinely worth stealing regardless of what you decide: their **9-weight Pretendard packaging** (useful for display without Artific), and confirming our black-key instinct — the branding team independently landed on near-black actions too. The parts I'd resist adopting: their live-blue accent and label letter-spacing on Korean (a direct conflict with our Hangul rule).

The one thing I would *not* leave alone: two different systems both called "Synapse" inside one org will keep causing exactly this confusion. Worth deciding which name belongs to which, or namespacing (AgentOS Synapse vs. CommerceOS Synapse).
