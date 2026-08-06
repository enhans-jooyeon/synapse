# Button spec ambiguities surfaced by the React realignment — 2026-08-05

**Status: RULED (June, 2026-08-05): all six implemented readings ratified.** The storybook Button rewrite (two-axis `buttonStyle × target` API, per adoption ruling #5 phase 1) forced an implementation decision at six points where `components.md`'s Button entry is silent or self-inconsistent. Each was implemented with a flagged reading, NOT resolved; the implementations are in `storybook/src/components/Button/` with the reading noted in JSDoc/CSS comments. The rulings below flowed into the spec entry on 2026-08-05 (and the manifest regenerates from it).

| # | Ambiguity | Implemented reading (provisional) | What needs ruling |
|---|---|---|---|
| 1 | The spec calls `secondary` the "default choice" as *usage guidance*, but never states the API's default prop value | `buttonStyle` defaults to `"secondary"`, `target` to `"default"` | Confirm or change the API defaults; add one sentence to the spec |
| 2 | Sizes line says `sm (… label 13/12 …)` while the same paragraph's rationale says sm/md *share* the 13px label | Label 13 at `sm`; the "/12" ignored | What does "/12" mean? (Line-height shorthand? A stale alternative?) Fix the Sizes line either way |
| 3 | "Spinner 16px" stated flatly, but `xs` icons are 12px and "width MUST NOT change" — a 16px spinner in a 12px slot changes width | Spinner takes the size's icon size (12 at `xs`, 16 elsewhere) | Confirm spinner-matches-icon-size, or scope the 16px claim to sm+ |
| 4 | Loading on a **text-only** button: spinner "replaces the leading icon", but there is none — prepending one changes width, contradicting "width never changes" | Spinner prepends (width does change on text-only buttons) | Options: (a) reserve spinner space always (costly), (b) overlay spinner on the label, (c) accept the width change for text-only and say so in the spec |
| 5 | Disabled `outline` border color unstated for the three targets | Neutral `border.default` in all targets (a live-hued border on a dead control reads as available — same logic as the all-cells-neutral disabled label) | Confirm neutral, or specify per-target disabled borders |
| 6 | Icon–label gap unstated | Kept the previous `--sy-space-1_5` (6px) | Confirm or specify per size |

## Resolutions (June, 2026-08-05 — follow the implemented reading on all six)

1. **Ratified** — API defaults are now spec text: `buttonStyle` → `secondary`, `target` → `default`, `size` → `md`.
2. **Ratified** — the "/12" was unexplained and is ruled out; the Sizes line now reads `label 13` at `sm`.
3. **Ratified** — the spinner takes the size's icon size (12 at `xs`, 16 at `sm`–`lg`); the flat "spinner 16px" claim is reconciled in the entry.
4. **Ratified** — option (c): on a text-only button the spinner prepends and the width change is an accepted, documented exception; "width never changes" remains the rule wherever a leading icon exists to replace.
5. **Ratified** — disabled `outline` border is neutral `border.default` in ALL targets (a live-hued border on a dead control reads as available — the all-cells-neutral disabled-label logic).
6. **Ratified** — icon–label gap is `space-1_5` (6px) at every size. Also ratified from the "Also noted" item: the pill override is radius-only; padding stays the size's own step.

**Fixed outright (not held):** the stale "(semibold on `danger`)" parenthetical in Label-text rules — it contradicted the entry's own two retirement statements (2026-07-30); removed 2026-08-05.

**Also noted:** the pill override was implemented as radius-only per the spec's letter; the old CSS also changed padding — dropped. If pill padding was intentional, it needs a spec sentence.
