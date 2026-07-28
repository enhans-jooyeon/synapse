# Radius + spacing refresh — softer, roomier, borders-first retained

**Date:** 2026-07-24 · **Status:** proposal for maintainer decision (no tokens changed yet) · **Source:** visual benchmark against ElevenLabs and Sana AI *product* UIs (Mobbin curated screens), piloted with June.

## Direction (approved in pilot)
Move Synapse toward the ElevenLabs/Sana product feel — **softer corners and a touch more air** — while explicitly **keeping** what already aligns: borders-first structure, achromatic chrome, black primary, cool-neutral palette. Button corner style: **Rounded (12px), not pill** (pill was rejected — it fights the square icon-only buttons and reads consumer-marketing).

This is a **token-value retune**, not a re-characterization. No token renames, no component API changes.

## Correction that shrinks the change
Cards are already roomy — `--sy-card-padding` is **28px** today, not the 16px shown in the first mock. So "roomier" is delivered mainly by radius + a small control-padding bump; already-generous surfaces are left alone.

## Proposed token deltas

### Radius scale (`tokens/synapse.css` + `tokens.json`)
| Token | Now | Proposed | Drives |
|---|---|---|---|
| `--sy-radius-xs` | 4px | 4px (unchanged) | tiny insets, chip-xs, calendar cell, slot chips |
| `--sy-radius-sm` | 8px | **12px** | **all controls** — Button, Input/Select/Combobox/DatePicker, Chip, SegmentedControl container |
| `--sy-radius-md` | 10px | **16px** | **surfaces** — Card, Popover, Menu, Modal, CodeBlock |
| `--sy-radius-lg` | 16px | **20px** | larger surfaces — Drawer, FileUpload dropzone, ChoiceCard |
| `--sy-radius-xl` | 24px | **28px** | SplitPanel shell, large containers |
| `--sy-radius-full` | 9999px | 9999px (unchanged) | pills/avatars |

Scale stays monotonic (4 < 12 < 16 < 20 < 28 < full). Components keep referencing their current tokens; only the token *values* move, so the change propagates uniformly and stays gate-clean (no raw/off-scale radii introduced).

### Spacing (light touch — data density preserved)
| Token | Now | Proposed | Note |
|---|---|---|---|
| `--sy-control-padding-x` | 12px | **16px** | roomier buttons/inputs horizontally |
| `--sy-control-gap` | 8px | **12px** | more separation between grouped controls |
| `--sy-card-padding` | 28px | 28px (unchanged) | already generous |
| `--sy-page-padding` / `--sy-section-gap` | 32 / 40 | unchanged | already generous |
| `--sy-table-row` / `--sy-table-cell-x` | 36 / 12 | **unchanged** | tables stay dense on purpose — data walls must stay scannable |

## Cascade, risks, and sub-decisions
- **Rounded validates over pill:** at 12px, square icon-only buttons simply get 12px corners — still square footprint, no clash with pill text buttons. This is a reason the rounded choice is cleaner than pill.
- **SegmentedControl concentric math** must be recomputed: inner segment = container(12) − inset(4) = **8px** (was 4). Implementation detail, not a new decision.
- **Surfaces at 16px — one sub-decision for you.** `md → 16` rounds cards *and* menus/popovers/modals together. Cards at 16 is the intent; menus at 16 may read rounder than you want. Options: (a) accept one surface radius (simplest), or (b) split surfaces so cards use `lg`/16 and floating menus stay tighter at ~12. Flagging; I lean (a) for scale simplicity.
- **Scale gap** xs(4) → sm(12): acceptable since xs is inset-only, but worth noting the 8px step disappears.
- **Downstream:** `preview.html`, storybook components, `synapse.manifest.json` rebuild, and Figma/code-theme regen on release.
- **Versioning:** value retune, no breaking renames → **minor** bump when released, accumulating under `## Unreleased`. Visually significant despite being non-breaking.

## Verification plan
Apply deltas → run `validate.py` (expect green; radii stay on-scale) → render the change across a fuller component set (not just button/input/card) in light + dark, KO + EN → confirm no layout breakage from the +4px control padding at +25% Korean string width.

## Next step
On approval of these numbers (and the surface-radius sub-decision), I edit `tokens/synapse.css` + `tokens.json`, rebuild the manifest, keep the gate green, and log under `## Unreleased`. One change, reversible, on your go.
