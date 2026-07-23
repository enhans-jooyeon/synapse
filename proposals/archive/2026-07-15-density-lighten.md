# Proposal: lighten the density architecture

**Date:** 2026-07-15 · **Status:** approved (maintainer chose "lighten, not remove"); implementing v6.52.0 · **Scope:** foundations §4, density tokens, design.md rules, patterns.md archetypes, validator page-mode, screen-intent schema, components.md notes, preview

## Diagnosis

Density earns its keep for one thing — letting data-heavy regions (run tables, monitoring) compact their **controls, spacing, and table rows** so operators can scan more per screen. That value is real and stays.

What was over-spec (maintainer's call, agreed): the *formalization* around it — a 1px type re-typeset carrying ~56 "density-bound" caveats, a subtle "never mix within a region / declare a structural boundary" rule, and a hard "archetype FIXES density" mandate enforced by the validator. High ceremony, low payoff.

## Changes (keep the compaction, drop the ceremony)

1. **Type is one scale now.** `body` 14/22, `label` 13/20, `heading-sm` 14/22 — fixed, regardless of density. Remove the `density.type` token group and the dense-block type overrides. Dense regions compact chrome, not text (text stays legible at one size — arguably cleaner).
2. **Drop the "never mix / structural boundary" rule.** Regions may differ in density freely; no boundary declaration required. Remove the schema `boundary` field and validator **SY104**.
3. **Archetype density becomes a recommended default, not a mandate.** patterns.md still lists each archetype's suggested density; design.md no longer says the archetype "fixes" it or that mixing is forbidden.
4. **Keep:** `data-density` regional mechanism affecting control heights, control padding/gap, page/section/card/stack spacing, table row/cell, content-max. The preview density toggle stays (it still changes controls/spacing/tables — just no longer re-typesets).

## Not done
Full removal (would force a single density → airy tables or cramped settings, and creep back as a Table prop). Rejected in favor of this.

## Touch surface
tokens (JSON+CSS), foundations §4, design.md §rules + one-liner, patterns.md §1, validator (SY104 out, boundary logic out), screen-intent schema (boundary out), components.md (type notes → fixed; drop mix/boundary mentions), build_manifest never-list, preview typography story, KO refresh (foundations/design/patterns/components). Minor bump 6.52.0 (visual delta: body text no longer shrinks 1px in dense regions).
