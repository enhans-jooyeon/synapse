# Proposal: system-wide character audit ("clean but not boring" pass)

**Date:** 2026-07-13 · **Status:** implemented v6.4.0–6.7.0; 1a rail and 4a nav bar reversed in v6.7.1 (maintainer: dated) · **References:** ElevenLabs, Sana AI · **Precedent:** v4/v5 sleek restyle, v6.3 AI-surface finish pass

## Diagnosis

The v6.3 pass fixed the AI surfaces, but the root pattern it fixed — one formula applied uniformly, color doing all the signaling — recurs elsewhere. Character in the reference products comes from four levers, all legal under §8: **layering** (tint confined to a zone, not a box), **micro-typography** (tracking, weight, numeral discipline at small sizes), **motion** (fast, consistent, everywhere), and **detail objects** (keycaps, medallions, rails — small things that look machined, not defaulted). Gradients/blur/glow remain forbidden; this proposal does not touch §8.

What is deliberately NOT proposed: zebra striping, decorative illustration, glassmorphism, colored section backgrounds, per-component radius play. Restraint is the language; these add noise, not finish.

---

## Tranche 1 — kill the remaining wireframe formula

**1a. Banner relayer.** Subtle banners currently use `status.*-bg` fill + full saturated `status.*` border — the exact formula removed from ProposalCard in 6.3, and now the worst offender in the system. Restyle: borderless status tint + **3px status rail on the left edge** (radius follows card corner), status icon + semibold title line. The rail is the classic "designed notice" anatomy; color area shrinks while scannability rises.

**1b. Stat card finish (R4).** Deltas are text glyphs (▲ 12%) inside badges — reads like a placeholder. Replace with 12px registry trend icons + tabular delta text colored by direction-of-goodness, dropping the badge wrapper (a badge inside a stat card is a box inside a box). Add optional right-aligned **sparkline slot** (viz.1 hairline path, no fill — flat, legal). Stat numerals get −1% tracking (Latin only, matching heading discipline).

**1c. Empty-state medallion.** The gray circle + icon is the most "default" object left. Upgrade: 48px icon tile with **two concentric hairline rings** stepping lighter (border.default → border.subtle) — pure borders, no gradient, reads as intentional craft. First-use flavor keeps the pill CTA; error flavor tints the medallion `status.danger-bg`.

## Tranche 2 — micro-typography & data texture

**2a. New type style `micro-label`** (20th style): 11px medium, +0.02em tracking (Latin only; Hangul exempt per foundations §2.3), fg.tertiary. Jurisdiction: table headers, sidebar group labels, palette group labels, card eyebrow labels, axis labels. This is the single cheapest "finished product" signal in the reference set — currently these five surfaces each improvise 11px styling.
**2b. Table header pass.** Apply `micro-label`, drop header fill on framed tables from `bg.surface` to transparent-with-hairline (the fill adds weight without signal), sort glyph reserved-space so columns don't shift on sort.
**2c. Keycap kbd.** Kbd hints become true keycaps: sunken fill, hairline border, **2px bottom border** (stepped edge — border, not shadow), radius-xs, mono 11. Applied in palette, tooltips, menu shortcut column.

## Tranche 3 — motion pass (spec'd as law, not sprinkled)

New foundations §"Motion jurisdiction" + tokens already exist (duration/ease). Rules: every interactive surface transitions `background, border-color, box-shadow, transform` at `duration-fast/ease-standard` (buttons, chips, nav items, rows, cards — today only Card.interactive has this); overlays enter with 4px translate + fade at `duration-base` (menus, popovers, palette, toasts — toast slides from right); nothing animates layout/size; `prefers-reduced-motion` kills all transforms. One law, applied system-wide — motion consistency is what reads as "engineered" in ElevenLabs.

## Tranche 4 — chrome & brand moments

**4a. Sidebar active indicator:** active nav item gains a 2px key-color bar on the left edge inside the item (in addition to `bg.selected`) — position signal survives squint/colorblind viewing, and it's the single most recognizable "product with a design team" tell (Linear, Slack, Datadog).
**4b. Workspace tile:** topbar "Enhans" ghost button becomes squared 20px monogram tile (key fill, white letter) + name — anchors the chrome, gives the frame one deliberate dark object.
**4c. One sanctioned Artific moment:** the Guided/Home sample's greeting moves to `display-sm` in Artific per its existing jurisdiction (max 1/screen, Latin only). The license exists; the samples never exercise it, so the brand face is currently invisible in the product's own preview.

---

**Sequencing note:** tranches are independent; 1 is highest impact-per-risk, 3 touches the most surface area but is pure CSS + one spec section. Each tranche = minor version, gate-clean, changelog'd.
