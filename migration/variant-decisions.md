# Variant decisions — where the old system had something the new one doesn't

> ## ✅ DECIDED 2026-07-30
>
> All five decisions are closed. Three tokens added, plus a brand re-hue that wasn't on this list.
>
> | Decision | Outcome |
> |---|---|
> | 1. Hue-tinted disabled | **Added, but as labels not fills** — `action-danger-fg-disabled`, `action-brand-fg-disabled`. Fill stays neutral `bg.disabled`. A tinted *fill* was rejected: pale-red-fill + legible-red-label is pixel-identical to the subtle danger Banner/Badge. |
> | 2. Border/surface hovers | **Added `border-strong-hover`** (`gray.400`/`gray.500`). Ladder uncapped; the other seven `border-*` tokens keep the ladder convention. |
> | 3. Success outlines | **Not added.** Outlined badges already exist — components.md Badge `outline` = transparent + 1px `status.*` border + `status.*` text, so they need zero new tokens. `border-success` remains open only as a *form-field* perimeter if a validated-input state is ever specced. |
> | 4. Subtle selected surface | **Squashed** into `bg-selected`. |
> | 5. On-inverse disabled | **Squashed** into `text-on-inverse`. |
>
> **Also changed (not from this list):** `action-brand-*` and `ai-solid` re-hued **graphite → blue** (`blue.600` light / `blue.500` dark); `brand-point` stays graphite for identity objects only. See `CHANGELOG.md` → Unreleased for the full rationale, contrast figures, and the foundations §1 invariant that had to be rewritten.
>
> The sections below are the original analysis, kept for the reasoning.


Companion to `color-token-map.md`. This is the list you asked for: old tokens whose target **doesn't exist in the new system**, separated from the ones that map cleanly, so you can decide *add a variant* vs. *squash into an existing token*.

## Correction to the earlier pass

`color-token-map.md` currently marks all 7 original gaps as "RESOLVED (no new token)." **Treat five of those resolutions as provisional.** They were argued from current system principles — "success surfaces are borderless tints," "disabled is variant-independent" — which are statements about today's Synapse, not permanent truths. Since you're still fine-tuning, those are exactly the principles in play. The map's fallbacks are all *safe*; they are not all *settled*.

## Two things this list does differently

1. **It's not just the 7 gaps.** Every place multiple old tokens collapse into one new token is also a variant-doesn't-exist decision. **54 of 80 old tokens land in a shared bucket — the migration is 80 old → 45 new.** Some of those collapses are cleanup; some silently drop a distinction.
2. **It groups by the question, not the token.** Ten scattered gaps reduce to **five decisions**. Answer these five and the whole list resolves.

---

# The five decisions

## Decision 1 — Should disabled states carry variant hue?

**Old:** disabled fills were tinted per variant.

| Old token | Old hex | Tint |
|---|---|---|
| `bg-button-primary-disabled` | `#e5e5e6` | neutral |
| `bg-button-tertiary-disabled` | `#f7f7f8` | neutral |
| `bg-button-destructive-disabled` | `#ffa59f` | **red** |
| `bg-button-brand-disabled` | `#e2e8f0` | **slate/blue** |

**New:** all four → `bg-disabled #F4F4F6`, neutral. Hue is dropped.

**Recommendation: squash. Don't add hue-tinted disabled fills.** Three reasons, in strength order:

1. The old destructive-disabled ran **1.89:1** against white — below even the 3:1 hard floor. It wasn't an accessible state, so there's no working behavior to preserve.
2. `components.md` Button §States already reads `disabled (text.disabled, bg.disabled fill; 40% opacity is forbidden)` — variant-independent by construction. Adding hue means editing the Button contract, not just adding a token.
3. A tinted disabled fill competes with the *enabled* status colors. A pale red disabled button and a pale red danger tint are the same signal at the same intensity.

**Counter-argument worth weighing:** hue-tinted disabled preserves the button's identity while unavailable, which matters if your UI disables destructive actions often enough that users lose track of what the button *was*. If you have that pattern, the fix is a visible label + tooltip, not a tint.

**Cost if you add it anyway:** 2 tokens (`action-danger-bg-disabled`, `action-brand-bg-disabled`) + a Button contract amendment + AA sign-off on both.

---

## Decision 2 — Should non-action surfaces and borders get explicit hover tokens?

This is the structural one, and it's the same question `token-convention-audit.md` Defect 1 raises from the other end.

**Old:** every surface and border weight had a paired `-hover`.

```
background-50 / -hover · background-100 / -hover · background-200 / -hover
border-100 / -hover · border-200 / -hover · border-300 / -hover
```

**New:** `bg-sunken` has no hover; **0 of 8 `border-*` tokens have a hover.** Instead:

- surfaces composite `bg-hover` / `bg-active` (alpha overlays) over any fill
- borders step the ladder — `border-default` → `border-strong` *is* the hover

Both approaches work and are cheaper than paired tokens. **But the border ladder is capped.** An element resting at `border-strong` has nowhere to hover except `border-selected` (near-black, 19.9:1 on white) — a jump that reads as selection, not hover. Old `border-border-300-hover #808081` had nowhere to land for exactly this reason.

**Recommendation: keep both strategies, add one token — `border-strong-hover`.** Not a paired set for all eight; just uncap the ladder. Then document all three state strategies so the next contributor knows which applies.

**Deciding question for you:** does any component rest at `border-strong` and need a hover? Outlined-secondary buttons and hovered-then-hovered-again bordered cards are the likely candidates. If nothing rests there, skip the token and just document the ladder.

**Resolves:** `border-border-300-hover`, `bg-background-50-hover`, `bg-background-100-hover`, `bg-background-200-hover`, `border-border-100-hover`, `border-border-200-hover`.

---

## Decision 3 — Does the system need success *outlines*?

**Old:** `border-border-success #6ee7b7` + `border-border-success-hover #10b978`.

**New:** nothing. `border-error` exists; `border-success` does not.

The current principle forbids it — Banner `subtle` is "borderless `status.*-bg` fill… no border, no rail," and "tint + saturated outline remains the forbidden wireframe formula." I previously called the asymmetry principled, on the grounds that `border-error` exists only as a form-field validation perimeter and there is no success field state.

**That argument holds only as long as there's no success field state.** If you add one — a validated-input checkmark, a "connection verified" field, a passed-check row — the asymmetry becomes an actual hole, and `border-error` is the precedent that says the hole is fillable.

**Recommendation: squash for now** (`status-success-bg` tint), **and revisit the moment you spec a validated-input state.** This is the item on the list most likely to flip.

**Deciding question:** are you planning a success/validated state on Input? If yes, add `border-success` in the same pass — one token, mirrors `border-error`, and it's a form perimeter rather than a surface outline, so it doesn't touch the forbidden tint+outline formula.

---

## Decision 4 — Is there a second, subtler "selected" surface?

**Old:** two highlight levels.

| Old token | Old hex |
|---|---|
| `bg-background-highlight` | `#e2e8f0` |
| `bg-background-highlight-light` | `#f8fafc` |

**New:** both → `bg-selected #EFF3F7`. The subtle tier is dropped. (`bg-selected-hover` exists, so the family has a state axis but no *intensity* axis.)

**Recommendation: squash, tentatively — but this is the one I'm least confident about.** Two selection intensities usually means the old UI had nested selection: a selected row inside a selected group, or a soft "current" vs. hard "chosen." If Synapse has nested-selection surfaces (tree navigation, a list inside a selected panel), one token will force them to look identical and the hierarchy collapses.

**Deciding question:** does any new-system surface show selection *inside* another selected surface? Check tree nav, the AppLauncher, and sidebar groups. If yes, add `bg-selected-subtle`.

---

## Decision 5 — On-inverse content states

**Old:** `text-text-inverted-disabled #f7f7f8`.

**New:** nothing. `text-on-inverse` (white) is the only on-inverse foreground besides `text-link-on-inverse` and the four `status-*-inverse`.

**Recommendation: squash, with high confidence.** The old token was never a disabled treatment — `#f7f7f8` on the old inverse `#262627` is **14.12:1** vs. plain white's **15.12:1**. A 1.0 delta is invisible. (Light mode's real disabled delta, for comparison: 2.12:1 vs 18.11:1.) Mapping it to `text-on-inverse` preserves what it actually did.

**The reason not to add one is bigger than the token, though.** `foundations.md` §glass: reintroducing a dark overlay surface "would require a first-class inverse-surface context (all components carrying an on-dark variant), which is a governance proposal, not an ad-hoc surface." A lone `fg-disabled-on-inverse` is the first brick of a context you deliberately declined. If you want on-dark surfaces, that's a scoped project — not a token.

Note the existing `status-*-inverse` set already half-crosses this line: those *are* on-inverse variants shipping today. Worth deciding whether that's a sanctioned exception (status on `bg.inverse` strips, per foundations §4) or the start of an unmanaged drift.

---

# Safe squashes — no decision needed

These lose nothing. The old granularity didn't encode meaning; it was ramp-shaped naming.

| Old → new | Count | Why it's safe |
|---|---|---|
| `icon-*` → `fg-*` | 10 → 7 | Explicit design choice: icons draw with foreground tokens. A parallel icon scale would need to stay in lockstep with `fg-*` forever, for no gain. |
| `text-*-disabled` ×2 + `icon-*-disabled` ×3 → `text-disabled` | 5 → 1 | Disabled text with a hierarchy is a contradiction — nothing disabled is more important than anything else disabled. |
| `border-100/200/300` + hovers → `subtle`/`default`/`strong` | 5 → 3 | Old range `#d9d9da`–`#808081` had no per-step role; see Decision 2 for the one real casualty. |
| `bg-background-50/100/200` + hovers → `bg-surface`/`bg-sunken` | 5 → 2 | Old ladder was value-named, not role-named. New names state intent. |
| `rounded-medium(6)` + `rounded-large(8)` → `radius-sm(8)` | 2 → 1 | A 2px difference at small radii is sub-perceptual. |
| `button-tertiary*` → `action-secondary-*` | 3 → 2 | Deliberate: no tertiary button tier. |
| `text-text-error`/`icon-error` → `status-danger` | 2 → 1 | Same value, same role. |
| `border-brand`/`-hover` → `border-focus` | 2 → 1 | Brand-as-focus → functional focus blue. |

**Also gone, correctly:** `shadow-glow` (glow/blur forbidden; focus is a ring) and syntax colors — `components.md` CodeBlock specifies "one muted theme system-wide, ≤5 colors drawn from `viz` + `fg`, **defined once at implementation**." Syntax highlighting is deliberately outside the token layer. Code *text* is `text-secondary`. **No decision needed on either.**

---

# One item needs FE data, not a design decision

**`border-border-500` `#64748b`** (slate-500). Slate is now the AI-surface family, so this goes to `ai-border` if it outlined an AI/slate surface, otherwise `border-strong`. Note it's a role reassignment, not a value swap — `#64748b` is 4.76:1 on white; `ai-border` is 1.29:1.

Resolvable with one grep of the old FE for `border-border-500`, which I can't run from here — I don't have the `viralpick/synapse` repo mounted. Same grep would also firm up Decisions 2 and 4 (do any call sites rest at `border-strong`, or nest selection?), so it's worth doing before you answer those.

---

# Summary

| Decision | My recommendation | Confidence | Tokens if you add |
|---|---|---|---|
| 1. Hue-tinted disabled | Squash | High | 2 + Button contract change |
| 2. Border/surface hovers | **Add `border-strong-hover`** | Medium-high | 1 |
| 3. Success outlines | Squash now, revisit at validated-input | Medium — most likely to flip | 1 (mirrors `border-error`) |
| 4. Subtle selected surface | Squash | **Low — check nested selection first** | 1 |
| 5. On-inverse disabled | Squash | High | Don't; it's a governance project |

Net: **1 token to add now**, 2 conditional on specs you haven't written yet, 2 to close. Everything else squashes cleanly.

The pattern across all five is worth naming: the new system is thinner than the old one specifically on **interaction states for non-action elements**. That's not an oversight — it's the overlay and ladder strategies doing their job — but it's the seam where old→new mappings run out of targets, and it's where future variants will pull hardest.
