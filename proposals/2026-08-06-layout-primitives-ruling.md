# Layout primitives — decision brief for June

**Status: OPEN — awaiting ruling.** Research only; no spec, token, or tool was changed in producing this.
Follow-on to `proposals/2026-08-05-astryx-adoption-rulings.md` (layout was not on that audit's adopt list — this is a new question).
Sources read: `facebook/astryx@main` (`packages/core/src/{Stack,HStack,VStack,Grid,Center,Section,AspectRatio,Layout,AppShell,FormLayout,InputGroup}`, `packages/cli/foundation/agent-docs/agent-docs.mjs`, `packages/cli/api/build/kit/kit.mjs`, `packages/cli/assets/docs/layout.doc*.mjs`, `internal/vibe-tests/prompt-purity-test/`) and this repo at HEAD.

---

## The question

Astryx makes layout a **component** problem — 18 exported layout components and an agent rule that literally forbids `<div>` — while Synapse makes it a **specification** problem: six page archetypes in `patterns.md` that fix regions and grids in prose, rendered with raw CSS grid/flex against `--sy-*` tokens. Should Synapse adopt layout-primitive components, keep the archetype+CSS model, or take only the page-shell half?

---

## 1. How Synapse expresses layout today — factual

**There are no layout components.** The manifest has 68 entries; none is a Stack, Grid, Box, Container, or AppShell. The three nearest neighbours are `SplitPanel` (two-to-three resizable panes, Workbench-only), `Sidebar (app navigation)` (the nav surface itself, not a frame), and `Divider`. The app frame's top strip is **recipe R10 · Topbar**, not a component — so the outermost shell of every AgentOS screen exists only as prose.

**The archetype fixes regions in prose.** `patterns.md` §1A:

> Structure top-to-bottom: **toolbar row** (page title 24/34 left; filters, search Input, primary action right; height 40, single row) → optional **metric strip** (2–6 stat Cards in a grid) → **data region** (Table, or Card grid for visual records) → Pagination.

and §2:

> App frame: Sidebar (240/64) + main area. […] Content grids use CSS grid with `--sy-space-6` gutters. Column counts: metric cards 2–6; card grids 2–4; never 12-column decorative grids.

**Everything below that line is hand-written CSS.** Three real examples:

1. `preview.html` · Home sample page — the §1F metric strip, written as a literal grid:
   ```html
   <div style="display:grid; grid-template-columns: repeat(3, 1fr); gap: var(--sy-space-4);">
   ```
2. `preview.html` · Workbench sample page — the main content region, carrying region sizing, page padding, section rhythm, and a boundary in one attribute:
   ```html
   <div style="flex: 1.6; min-width: 0; padding: var(--sy-page-padding);
               display: flex; flex-direction: column; gap: var(--sy-section-gap);
               border-right: 1px solid var(--sy-border-default);">
   ```
3. `storybook/src/components/Thread/Thread.css:5` — the Console's reading column, in the one place layout *has* been componentized:
   ```css
   .sy-thread__column { max-width: 760px; width: 100%; margin: 0 auto;
     padding: var(--sy-space-6); display: flex; flex-direction: column; gap: var(--sy-space-6); }
   ```

**How much layout code a generated screen carries.** Measured across the six sample pages in `preview.html`, counting CSS declarations inside `style="…"` attributes and classing each as layout (`display`, `flex*`, `grid-template-columns`, `gap`, `align/justify`, `width/height/min/max`, `padding`, `margin`, `overflow`, `position`, insets) vs. everything else:

| Sample page | `style=` attrs | declarations | layout declarations |
|---|---|---|---|
| Home | 64 | 198 | 138 (**69 %**) |
| Workbench | 72 | 204 | 131 (**64 %**) |
| Console | 113 | 267 | 187 (**70 %**) |
| Settings | 37 | 92 | 62 (**67 %**) |
| Object detail | 37 | 102 | 72 (**70 %**) |
| First run (guided) | 222 | 539 | 302 (**56 %**) |

Roughly **two of every three style declarations in a Synapse screen are layout plumbing** — none of it reviewed, none of it gated.

**And it has already drifted, inside our own reference render.** Three findings, all from HEAD:

- **Sidebar width.** `components.md · Sidebar` says 240px expanded, with a stated reason — *"labels never truncate when expanded — the 240px width is sized for KO labels."* All four sample pages in `preview.html` render `<nav class="sidebar sample-side" style="width: 200px; …">`. A 40px deficit on the one dimension the spec justifies bilingually. `width` is not in SY002's property list (`margin/padding/gap/row-gap/column-gap/*-top/-bottom/-left/-right`), so the gate is structurally blind to it.
- **Sidebar icon size.** Same spec: *"20px icon + label (13 medium)."* `preview.html` `<style>`: `.nav-item .icon { width: 16px; height: 16px; … }`. 16 is on-scale, so SY019 passes; the spec-vs-render mismatch is not a rule anyone wrote.
- **Layout tokens exist and are unused.** `tokens/synapse.css` defines `--sy-content-max: 760px`, `--sy-page-padding: 32px`, `--sy-section-gap: 40px`, `--sy-stack-gap: 16px`. Usage across `preview.html` + `storybook/`: `page-padding` **3×**, `section-gap` **1×**, `content-max` **0×**, `stack-gap` **0×**. Meanwhile the literal `760px` appears **10×** in `preview.html` and once in `Thread.css`, and `560px` (the Guided max) **34×**. The semantic layout tokens are dead letters because raw CSS makes `var(--sy-space-6)` exactly as easy to type as the right one.

**One counter-fact worth holding onto:** Synapse has *already* componentized a layout rule once, and it was the rule agents were getting wrong. `Thread.css`'s header comment reads: *"Thread — components.md · Thread. The scroll container spans the full region; the 760 message column is centered INSIDE it (no mid-canvas scrollbar)."* That is `patterns.md` §2's scroll-container rule, encoded in a component because prose alone was not holding it. Precedent for option (c).

---

## 2. What Astryx's model buys

**The rule, verbatim.** `packages/cli/foundation/agent-docs/agent-docs.mjs`, `generateCompressedIndex()` lines 344–345 — the block injected into every consuming project's `AGENTS.md` / `CLAUDE.md`:

```
RULES:
- No <div> — components do all layout/spacing. Full page → AppShell; sidebar nav → SideNav.
- Frame first: pick the shell (AppShell / Layout+LayoutPanel) and budget regions in px BEFORE writing content (`astryx docs layout`).
```

`packages/cli/assets/docs/layout.doc.dense.mjs` states the failure it is aimed at:

> decide frame before content. content-first (Card-wrapped sections in a scroll column) = prototype look.

with hard region budgets attached — *"side nav 240-280, rail 64-72, inspector 340-420, facet rail 220-260."*

**The concrete failures it prevents.** What an agent gets wrong hand-rolling flex/grid is not "ugly CSS" — it is four specific, recurring, spec-violating bugs:

1. **Region geometry drifts from the number in the spec.** Our own 240→200 case. A component holds the number once; every hand-rolled frame re-decides it.
2. **The scroll container lands on the wrong element.** The natural way to write a centered reading column is `max-width` + `overflow:auto` on the *column*, which produces the mid-canvas scrollbar `patterns.md` §2 explicitly calls "a broken layout." Getting it right requires knowing that the scroller is the parent and the column is the child — exactly the knowledge `Thread` now encapsulates and every other archetype still leaves to the agent.
3. **`min-width: 0` is omitted.** A flex child containing a Table or a long unbroken string overflows its parent without it. Our Workbench sample carries `min-width: 0` because a human wrote it; a generated screen that omits it silently breaks §2.1's *"Workbench tables scroll horizontally with the first column pinned"* — the table pushes the layout instead of scrolling.
4. **The responsive contract is never written.** §2.1 enumerates per-region narrow-window behavior (sidebar collapses at 1024 then hides at 768; SplitPanel's secondary pane becomes a Drawer; stat grids drop 6→3→2). Not one of the six sample pages contains a media query. The contract is specified and unimplemented everywhere; a shell component is where that behavior would live once instead of six times.

**How they enforce it.** Three layers, and it matters that the third is missing from the first two:

- **Injection, not documentation.** The rule is spliced into the agent's own instruction file at `astryx init`, regenerated per project, with the styling-system branch chosen from the detected toolchain (`stylex` / `tailwind` / `css`) so it never recommends an uncompiled path.
- **Forced discovery.** `astryx build "<idea>"` always returns a `FRAME + FOUNDATION` section, `FRAME = ['AppShell','TopNav','SideNav','Layout']` + a 12-name FOUNDATION set, with the reason in the source (`api/build/kit/kit.mjs:26-30`): *"Every page needs a shell + layout/typography/action atoms, but these never keyword-match an idea (\"dashboard\" != \"Stack\"), so search alone never returns them."* Search relevance actively hides the frame; the kit re-injects it unconditionally.
- **A self-check promoted by measurement, not taste.** The comment above the SELF-CHECK line: *"Validated via vibe tests (internal/vibe-tests/prompt-purity-test): on complex multi-step UIs the rules above alone still leave raw CSS in ~11-13% of runs; a re-read-and-fix pass cuts that ~4x at negligible token cost."* The harness classifies each run as `neverVeered` / `caught` / `veeredUncaught` with Wilson CIs per condition.

**The honest limit of their enforcement:** there is **no lint rule**. `eslint.config.js` contains nothing about `div`. "No `<div>`" is a *prompt* rule whose compliance is measured statistically, not a gate. Adopting the components does not, by itself, buy Synapse a gate it doesn't have.

---

## 3. What it costs

**Against the closed-set doctrine.** `design.md` §3.4: *"The component set in `components.md` is closed (one `##` entry per component). NEVER invent a component, add a variant, or restyle an existing one."* Astryx spends **13 of 106 source directories** on layout, exporting 18 distinct layout components (Stack, StackItem, HStack, VStack, Grid, GridSpan, Center, Section, AspectRatio, Layout + LayoutHeader/Content/Footer/Panel, AppShell, FormLayout, InputGroup, InputGroupText). Porting that shape would add ~26 % to Synapse's component count and make layout the single largest category in a system whose current largest category is AI surfaces — the thing that actually differentiates it.

**The prop surface, and why it is the wrong *kind* of surface.** `Stack.tsx` exposes 16 props: `direction · hAlign · vAlign · justify · align · width · height · maxWidth · minHeight · gap · padding · paddingInline · paddingBlock · isScrollable · wrap · as`. `Grid.tsx` exposes 12; `AppShell.tsx` 10 plus a nested six-field `MobileNavConfig`. That is more enumerated surface than several complete Synapse component specs.

The deeper problem is the value space. Synapse props are **closed semantic sets** (`variant: primary|secondary|ghost|danger|brand`). Layout props are **open geometric spaces**: Astryx's `width`/`height`/`maxWidth`/`minHeight` take `SizeValue` — *"Numbers are treated as pixels, strings are used as-is (e.g. '100%')."* A `width={413}` is an off-scale raw value that has moved from CSS, where `validate.py`'s lexer can see it, into JSX, where it cannot. **Layout primitives launder arbitrary values past the gate.** Astryx mitigates half of this — `gap`/`padding` are the closed union `0|0.5|1|1.5|2|3|4|5|6|8|10` — but deliberately leaves sizing open, because a shell that cannot express "340px inspector" is useless. Any Synapse adoption inherits that hole and must either widen `validate.py` to a JSX-aware linter or accept it.

**Indirection with no design in it.** Stack ships *two* alignment APIs — `hAlign`/`vAlign` (absolute) and `justify`/`align` (flex-relative) — and resolves between them based on `direction`. That is real cognitive load for an agent, purchased for zero design judgment. This is the general case: **layout primitives are the least "designed" components in any system.** Synapse's worth is judgment — the concentric-corner rule, the 0.250–0.300 radius÷height band, azure tuned to 4.57:1, the 12px icon floor argued from stroke geometry. A `Stack` spec section would read "flex, gap, done." Every one added dilutes the information density of `components.md`, which is the artifact agents load.

**Migration.** Non-trivial and partly unpayable:
- `preview.html` is **hand-authored HTML** (4,862 lines, ~88 KB of sample-page markup), not React. A React-only primitive set has no expression there — so the reference render would keep speaking raw CSS while the library speaks components. **Two layout languages is strictly worse than one**, and preview.html is the maintainer's primary visual audit surface (`design.md` §1).
- The 17 shipped React components would need their layout re-routed through the primitives, re-flagging the batch-1 ambiguities that are still open.
- `tools/screen-intent.schema.json` declares `regions[]` with free-string `id`s; SY102 only requires ≥1 region and never checks ids against the archetype. Adopting shell components without also structuring the archetype means the declaration and the render still don't meet.

---

## 4. The three options

### (a) ADOPT — a minimum-viable layout set

**Exactly four components**, not eighteen: `Stack` (one component with `direction`, absorbing HStack/VStack), `Grid` (column count + gutter only — no `GridSpan`, no `minChildWidth`), `AppShell` (Sidebar + Topbar + main, encoding §2's frame and §2.1's collapse behavior), `Region` (the archetype's content container: `maxWidth` keyed to `content|guided|fluid` rather than a number, page padding, section gap, scroll ownership).

Hard constraint if adopted: **every dimension prop is a closed token key, never a `SizeValue`.** `gap="section"`, `maxWidth="content"`, `padding="page"` — no numbers, no strings. That preserves the gate and forces the dead layout tokens back into use.

**First step:** write the `Stack` and `Region` spec sections against the existing `--sy-stack-gap` / `--sy-section-gap` / `--sy-content-max` / `--sy-page-padding` tokens, implement both in `storybook/`, and rewrite the *Object detail* sample page (the smallest, 37 style attrs / 72 layout declarations) using them. Count what the declaration total drops to. If it does not fall by more than half, the set is not worth the four entries.

### (b) REJECT — keep archetypes + CSS, and close the gap in `patterns.md`

The gap is not that agents lack a `Stack`; it is that the archetype's region skeleton exists only as prose and has **no machine surface at all** — `synapse.manifest.json` carries `archetypes` as six bare strings (`["workbench","object","settings","guided","console","home"]`), with no regions, widths, gutters, or breakpoints.

**First step:** structure the archetypes the same way ruling #1 structured components — parse `patterns.md` §1–2 into the manifest as `archetypes[].regions[] {id, width, padding, gap, scrolls, collapse_at}`, add the missing frame tokens (`--sy-sidebar-width` 240, `--sy-sidebar-rail` 64, `--sy-topbar-height` 48, `--sy-guided-max` 560) so the product gate's existing bare-px ban actually binds on region geometry, then extend SY102 to validate declared region `id`s against the archetype's skeleton. Bonus: this closes the 240/200 and 760-literal drifts without adding a single component.

### (c) HYBRID — adopt the page-shell level only

One component, `AppShell` (or `PageFrame`), that takes the archetype as a prop and lays out the frame + region skeleton — Sidebar, Topbar, main area, region max-width, scroll ownership, and the §2.1 collapse behavior — while **everything inside a region stays raw CSS grid/flex with tokens.** The bet: the failures are concentrated at the frame (region widths, scroll ownership, `min-width:0`, breakpoints), and are rare inside a region, where a three-column stat grid is genuinely a one-liner.

`Thread` is the existing proof: componentizing exactly one layout rule (region-spanning scroller + centered column) fixed the one layout bug that kept recurring, and cost one component.

**First step:** spec `AppShell` with `archetype` as a closed enum prop, implement it, and re-render the *Home* and *Workbench* sample pages through it — the two that carry the drifted 200px sidebar. Success criterion: the sidebar width, topbar height, content max-width, and scroll container appear exactly once in the codebase each.

---

## 5. Recommendation

**(c) HYBRID, sequenced behind (b)'s first step.** Do (b)'s manifest+token work first — it is cheap, purely additive, closes three measured drifts, and is a prerequisite for (c) being anything more than a hard-coded box. Then ship exactly one shell component.

Reasoning:

1. **The measured drifts are all frame-level.** Every concrete defect this research surfaced — sidebar 240→200, `content-max` used zero times against ten hardcoded `760px`, no media queries anywhere — is region geometry, not intra-region composition. There is no evidence in the repo that agents get a three-column stat grid wrong; there is direct evidence that the frame drifts.
2. **The precedent already exists and worked.** `Thread` componentized one layout rule and that rule stopped being violated. `AppShell` is the same move at the next level up.
3. **Full adoption trades Synapse's strongest property for Astryx's.** Astryx's model is right *for Astryx*: 106 components, no closed-set doctrine, a StyleX compiler, enforcement by injected prompt + statistical measurement. Synapse's leverage is a small closed set of heavily-judged components plus a gate. Adding 18 unjudged components with open-valued sizing props weakens both halves — and a `SizeValue`-shaped prop actively defeats SY002.
4. **The frame is the one thing search will never surface.** Astryx's own comment — *"these never keyword-match an idea (\"dashboard\" != \"Stack\"), so search alone never returns them"* — applies verbatim to `synapse lookup`. An agent asking for "run history table" gets Table and Pagination and composes a frame from nothing. A single `AppShell` in the manifest, injected the way Astryx injects FRAME, fixes that with one entry.

**What would change this recommendation:**

- **→ ADOPT (a), the full set.** If the correction ledger, once populated, showed `layout-alignment` as a *top-three* category **and** the entries were predominantly intra-region (grid gutters, stat-card alignment, wrong gaps between sections) rather than frame-level. That distribution would say the archetype prose is not carrying composition, and prose cannot be strengthened into a component.
- **→ ADOPT, alternate trigger.** If Synapse goes React-only and `preview.html` is retired or generated. The "two layout languages" objection is the single largest cost of (a), and it evaporates the moment there is one rendering surface.
- **→ REJECT (b) alone, no shell.** If a frame-region audit of 5–10 real generated screens showed the frame is actually stable and the 200px sidebar was a one-off authoring slip in `preview.html` rather than what an agent produces. That is testable in an afternoon and would make (c) unnecessary.
- **→ REJECT.** If `AppShell`'s spec cannot be written without a `SizeValue`-shaped prop. If the shell needs open numeric widths to be usable, it is a gate hole wearing a component's clothes, and (b) is strictly better.

### The measurement that would settle this does not exist

Stated plainly, because it bears on how much weight this ruling can carry:

- `docs/process/harness-refinement-register.md` contains **one row**, `HR-000`, whose Issue field reads *"example row — delete when real entries land."* The root-cause tally is RC1–RC6 all at **0**.
- `feedback/` contains `README.md` and one `_example-2026-07-23-run-review.md` fixture. Its nine fixture entries cover `state-coverage`, `character-drift`, `token`, `hierarchy`, `component-provenance`, `other` — **not one `layout-alignment` entry**, and they are illustrative anyway.
- The refinement-protocol run that would populate both was formally **deferred** by June on 2026-08-05 (`proposals/2026-08-05-astryx-adoption-rulings.md`, item #7: *"Defer […] the P1 investments proceed on judgment, not register data"*), with **no trigger set**.

So this is a judgment ruling made without the instrument, exactly as #7 anticipated — and layout is the item where that hurts most, because unlike radius or contrast it cannot be settled by measuring a value. Astryx's equivalent rule was promoted *by* data (the ~11–13 % → ~4× reduction). Ours would not be. The recommendation above leans on the three drifts found in the repo precisely because they are the only real evidence available; a 5-screen frame audit would multiply that evidence base at very low cost and is worth doing before executing (c), even if the ruling is made now.

---

## 6. Precedent note

Synapse already anticipated layout as a recurring failure class. `tools/synapse.py:107-111` defines the correction ledger's closed category set:

```python
LEDGER_CATEGORIES = {
    "token", "component-provenance", "state-coverage", "permission-context",
    "voice-content", "primary-action", "hierarchy", "layout-alignment",
    "density", "character-drift", "interaction", "copy", "other",
}
```

`layout-alignment` is one of the 13, defined in `docs/process/correction-ledger.md:51` as *"alignment, grouping, spacing rhythm"* — and its detection column reads **`manual`**, not `auto`. Nine of the ledger's categories map to a gate rule; this one, by construction, does not. The system's own memory schema records that layout failures were expected to recur *and* expected to be unfindable by machine. That is the strongest internal argument for moving some layout decisions into components, where they become structure rather than judgment — and the strongest argument for doing it at the frame, where the structure is finite and nameable.
