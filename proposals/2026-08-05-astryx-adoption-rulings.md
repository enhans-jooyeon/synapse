# Astryx adoption rulings — 2026-08-05

**Status: RULED (June, 2026-08-05).** Follow-up to the Synapse-vs-Astryx audit (claude.ai project "Design Harness", `claude/2026-08-05-synapse-vs-astryx-audit.md`) and the v2.0.0 P0 release. Each item from the audit's adopt list was ruled individually. This file is the record; execution tracking happens in `HANDOFF.md` and `CHANGELOG.md`.

## Adopted

| # | Item | Ruling | Sequencing |
|---|---|---|---|
| 1 | **Manifest single-sourcing** — `build_manifest.py` becomes a parser over `components.md`'s labelled slots (`Purpose/Variants/Sizes/States/A11y/Forbidden`); manifest gains structured `states`/`a11y`/`forbidden`/`variants` on all 68 entries; gate fails on unparseable slots; SY017's validate-against-itself circularity dies | **Adopt** | First — everything else projects from this |
| 2 | **`keywords` per component** — cross-system discovery names (shadcn/MUI/Radix, seeded from `migration/`'s mapping) as a parseable slot in `components.md`, flowing into the generated manifest; `synapse lookup` consults it before difflib | **Adopt** | Strictly after #1 (lives in the generated manifest, never in a hand-maintained dict) |
| 3 | **`--json` + stable error codes on `synapse.py`** — `{error, code, suggestions}` envelopes on `lookup`/`validate`/`gate`/`list`; codes append-only; also fix SIGPIPE handling | **Adopt** | Independent; any time |
| 4 | **Gate tightening** — `additionalProperties: false` on `screen-intent.schema.json`; SY109 validates `viewer_role` *membership* against `Guest < Member < Manager < Owner < Admin` (grounded in `product-context.md`); new rule parsing numeric count claims (the "67 vs 68" class) | **Adopt** | Independent; any time |
| 5 | **Code-first direction** — the React library is the consumption endgame; spec remains the contract and review standard. Immediate scope: realign `storybook/Button` to the `buttonStyle × target` two-axis spec (drop `color-mix` focus rings + retired weight compensation, add `outline`, `xs`), extend `validate.py ui` to lint `storybook/**/*.css`, add SYNC headers (Astryx-style `@input/@output/SYNC:` + `Last synced props:`), put the library on the release train. Then parity build-out per `docs/DISTRIBUTION.md` sequence step 1 (Table, Sidebar, Chip, Avatar, SegmentedControl, Tabs, DescriptionList, AgentStep, ProposalCard, Composer first) | **Adopt — committed direction** | Hygiene scope immediately; parity build-out ongoing |
| 6 | **Agent-entrypoint dense block + `synapse doctor`** — (a) generated dense never-list-with-replacements block in the harness entrypoint (dual-encoded, generated from the manifest so it can't drift); (b) `doctor` command comparing consumer bundle version/SHA against the latest source tag ("you are N releases behind; breaking changes in X"), degrading to local-only report offline | **Adopt both** | (a) after #1; (b) independent |

## Deferred

| # | Item | Ruling | Trigger to revisit |
|---|---|---|---|
| 7 | **Run the refinement protocol** (5–10 real screens → fill `harness-refinement-register.md`) | **Defer** (June's ruling; recorded against the audit's recommendation to run it before further mechanism-building — the P1 investments proceed on judgment, not register data) | None set |
| 8 | **MCP wrapper** — thin stdio server, stdlib-only, two tools (`search`/`get`, + `validate`), pure projection of the generated manifest returning the CLI's JSON envelopes verbatim | **Defer with trigger** | ALL of: #1 landed · #3 landed · both shipped in a tagged release. **Override:** any team member consuming the harness from a shell-less client (claude.ai chat) jumps this to immediate |

## Rejected / out of scope (from the audit's "do not adopt" list — reaffirmed, no ruling needed)

- System-font default, Meta-blue accent, seven-theme/HCT expander machinery (white-label is never-listed), 24px h1 ceiling.
- Reverse-engineering (product → canvas) workflow from the GeekNews talk — Synapse is pre-drift by design; a canvas layer would be a second representation to keep honest.

## Visual items (audit §4) — RULED (June, 2026-08-05, same session)

| # | Item | Ruling | Notes |
|---|---|---|---|
| V1 | **Radius-by-nesting semantic tier** — EXECUTED 2026-08-05 as the containment-role tier `--sy-radius-{inset,nested,tray,card,overlay,shell}`, aliasing foundations §3's existing container ladder (names from Synapse's own vocabulary, not Astryx's) | **Adopt, with precedence rule — DONE** | Additive, minor version. The adoption MUST include a written precedence rule for how the nesting tier interacts with Button's per-size radius keys (`control-xs/sm/control-md/md`) — two radius vocabularies without a precedence rule would be a new drift surface. |
| V2 | **Alpha hairline borders** (one ~10%-alpha token over all surfaces, replacing opaque grays + `border.overlay` special-case) | **REJECTED** (June, 2026-08-05, after prototype review) | The prototype falsified the premise: the alpha token composites LIGHTER than `border.subtle` on `bg.page`, inverting the deliberately tuned subtle/default half-step, and `raised-2` gains a border it deliberately lacks. One-token simplicity does not cover breaking an intentional hierarchy. Dark would also need ~23% alpha, not the sketched 12–16%. |
| V3 | **Inset-ring state family** (`inset` box-shadow rings for Input field states) | **REJECTED** (June, 2026-08-05, after two prototype rounds) | Round 1: 2px rings read too heavy. Round 2 (1px / 1.5px / 2px weight study): 1px carries no advantage over the current border swap in light mode; 1.5px is DPR-fragile (half-pixel at 1x); dark error vs error+focus is color-degenerate at any weight. Ruling: keep the current border-ladder design. **Open residue, mechanism-independent:** round 1 exposed that error and error+focus are visually IDENTICAL today (spec holds the error border while focused) — if that ever needs fixing, it's a small border-ladder change (e.g. distinct focused-error treatment), filed here so the finding isn't lost with the rejection. |
| V4 | **`light-dark()` + `color-scheme` migration** (kills dual `data-theme` blocks and SY020's drift class) | **DEFERRED with trigger** (June, 2026-08-05, after prototype review) | Mechanism PROVEN: prototype parity script reports 9/9 computed properties pixel-identical between the two mechanisms in both modes. Sole blocker is non-visual: on any pre-2024 browser the CSS fails silently and totally, and the AgentOS customer browser baseline is unknown. **Trigger: confirm Chrome 123+/Safari 17.5+ coverage from customer analytics or IT policy → adopt (generator migration + retire SY020's per-mode parity class).** |
| V5 | **Categorical hue×slot matrix** (Astryx pattern: per hue — `bg`@~20% alpha / `border` / `icon` / `text`) | **DEFERRED** (June, 2026-08-05 — reversed same-session from adopt-now) | When picked up: AgentOS's ontology types make this need structural eventually; start with the hues the type/tag surfaces actually need, grow additively; every hue = 8 mode-paired values to the viz ΔE/AA standard. |
| V6 | **Single easing curve** | **Rejected — keep the three** | Enter/exit asymmetry is a deliberate motion principle; collapsing it is Tier-D tidying with no observed failure behind it. |

## Additional ruling — icon family (June, 2026-08-05, same session; not from the audit)

**Icon set reverted Tabler → Lucide, executed immediately.** Rationale: the 2026-07-30 Tabler switch created a migration cost the product never paid — the product frontend and the `app-generation/` catalog both stayed on Lucide (the switch commit itself deferred the catalog as a follow-up), so the DS spec was the only Tabler artifact. Reverting re-aligns the spec with what ships. June plans an icon swap later; when that happens it enters as a **planned migration with a codemod**, not a spec-only flip. Executed mechanics are in `CHANGELOG.md` Unreleased. Two rulings deliberately carried over from the Tabler era rather than reverted: the unified run/play glyph (Lucide's `circle-play` is available via proposal if run's circled form is wanted back) and the reply/undo collision fix.
