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
