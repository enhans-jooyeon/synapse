# Proposal: remove density mode entirely

**Date:** 2026-07-15 · **Status:** approved (maintainer: the mode creates confusion); implementing v6.53.0 · supersedes the v6.52 lighten

## Decision
Remove the `focus`/`dense` density mode outright. Synapse uses **one size scale = the former `focus` scale** (36px controls, generous spacing, content cap 760), with **one exception: Table keeps a compact 36px row / 12px cell as its plain default** (not a mode — tables are just tables). Maintainer choice from the 3 options offered.

## Removed
- The `data-density` mechanism, the token density `$extensions`, and the dense value set.
- foundations §4 "Density" (repurposed to a short "Sizing" note; section number kept to avoid renumber churn).
- design.md rules coupling archetype→density; the "density per region" rule; workflow/checklist density lines.
- patterns.md archetype `(dense)`/`(focus)` labels and `data-density=` layout notes (width behavior — reading columns cap at 760, workbenches stay fluid — is retained as a plain layout rule, not a density mode).
- Component dual-size specs "(N dense)": collapsed to the single (focus) value; Table row/cell to compact.
- Validator SY103 density check + `ARCHETYPE_DENSITY` density values; screen-intent `density` region field; manifest `densities` + archetype→density map.
- Preview density toggle + `data-density` attributes.

## Kept
- Layout width behavior (reading columns 760 / workbenches fluid) as an archetype layout rule.
- The word "data-heavy"/"compact" as plain description where natural (no longer a mode).

## Touch surface
tokens (JSON+CSS), foundations §2/§4/§8, design.md, patterns.md §1, components.md (many dual-size collapses), ai-patterns.md, validator, schema, build_manifest, preview, KO refresh (foundations/design/patterns/components). Verify: no `data-density` or focus/dense-mode references remain. Bump 6.53.0.
