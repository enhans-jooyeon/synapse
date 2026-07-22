<!-- Agent-facing. EN-only, ungated. The running log of the harness refinement loop (see harness-refinement-protocol.md). One row per confirmed defect. Recurring root causes across rows are the map of where the harness is weakest. Not a spec file — safe to edit freely. -->

# Synapse — harness refinement register

One row per confirmed defect surfaced by a refinement cycle. Populated during step 3.5 of `harness-refinement-protocol.md`. Proposed fixes are drafted but only applied on June's approval — `Status` tracks that lifecycle.

## Fields

- **ID** — `HR-NNN`, sequential.
- **Date** — cycle date (YYYY-MM-DD).
- **Ver** — harness version that generated the output.
- **Source** — who/what test produced it (e.g. "team test — PM pair", "June spot-check").
- **Output** — path/ref to the evidence (screenshot, generated file).
- **Prompt?** — was the generating prompt/intent available? (Y/N — N weakens attribution, see RC5).
- **Issue** — one-line defect description.
- **Tier** — rubric tier violated (A / B / C / D).
- **Sev** — blocker / major / minor.
- **Delta** — blind-assessment bucket: `agree` / `missed` / `over-flag`.
- **RC** — root cause (RC1–RC6).
- **Fix** — the proposed harness change (where it lands).
- **Status** — `open` → `proposed` → `approved` → `applied` → `rejected`.
- **Resolved** — version it shipped in (if applied).

## Register

| ID | Date | Ver | Source | Output | Prompt? | Issue | Tier | Sev | Delta | RC | Fix | Status | Resolved |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| _HR-000_ | _2026-07-22_ | _1.0.0_ | _example row — delete when real entries land_ | _—_ | _N_ | _Example: cards used a drop-shadow, drifting toward consumer-app polish_ | _B_ | _major_ | _missed_ | _RC1_ | _foundations.md: add explicit "no decorative elevation on surfaces" rule_ | _open_ | _—_ |

## Root-cause tally (update as rows accrue)

A running count of root causes across all resolved+open rows. This is the actual diagnostic: a cluster on one RC or one spec file tells you where the harness is failing hardest.

| Root cause | Count | Notes |
|---|---|---|
| RC1 missing rule | 0 | |
| RC2 weak/ambiguous rule | 0 | |
| RC3 gate gap | 0 | |
| RC4 un-lintable quality | 0 | |
| RC5 prompt/intent failure | 0 | |
| RC6 coverage gap | 0 | |
