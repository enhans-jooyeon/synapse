# Review package / PR template

> **When it's produced:** at review submission (PR open). Tells the reviewer **what to look at** and hands them a **runnable artifact**.
> **Related protocol:** `design-review-protocol.md` §5-1, §8
> **Recommended location:** save as `.github/PULL_REQUEST_TEMPLATE/ui_review.md` → recorded in the repo and diffed (code-based end-to-end).

---

## UI review package

<!-- Paste or link the PRD above -->

### localhost run (required — the reviewer does not read raw code)
- **Run command (one command):** (e.g. `pnpm dev` or `pnpm storybook`)
- **Address:** (e.g. http://localhost:6006)
- **Per-branch preview deploy (if any):** (Vercel link — check without cloning)
- **Route / story to each state:** (link in the table below)

### What to look at first
1.
2.
3.

### State coverage
| State | story / route | notes |
|---|---|---|
| default | | |
| empty | | |
| loading | | |
| error | | |
| overflow / long content | | |
| long Korean string | | |
| permission variant: … | | |

### Breakpoint checks
- [ ] narrow / mobile
- [ ] default / desktop
- [ ] dense-data / wide

### Automated gate status
- [ ] all CI gates green (run link)

### Deviations needing explicit sign-off
-

### Correction ledger (fill as you fix — this is the harness's memory)

> One `- category | attribution | severity | source | note` line per fix needed to get from the generated output to what ships. `auto` lines are pre-filled from the diff/gate; add the `manual` (judgment) ones as you review. Nothing to fix? Write `- none`. Schema + category/attribution lists: [`docs/process/correction-ledger.md`](../../docs/process/correction-ledger.md). Harvested by `synapse digest`, so **keep the fields closed** — no free text in the first four columns.

```synapse-corrections
screen:
archetype:
harness_version:
- category | attribution | severity | source | note
```

<!--
category:    token | component-provenance | state-coverage | permission-context | voice-content |
             primary-action | hierarchy | layout-alignment | density | character-drift |
             interaction | copy | other
attribution: llm-generation | contract-gap | gate-gap | prompt-gap | reviewer-preference | requirement-change
severity:    blocker | major | minor
source:      auto | manual
-->

