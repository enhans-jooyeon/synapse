# Synapse icon registry

**Closed vocabulary.** Every icon in AgentOS comes from this concept→icon table (Lucide — stroke down-weighted from Lucide's native 2 to the system's 1.5, sizes **12/16/20/24** per foundations §8). A concept not listed here gets **no icon** — using an unlisted Lucide icon, inventing an SVG, or repurposing a listed icon for a different concept are contract violations; new concepts go through the proposal path (design.md §6). One concept, one icon: the same idea never renders with two different glyphs anywhere in the product.

> **2026-08-05 — icon family reverted Tabler → Lucide** (rulings: `proposals/2026-08-05-astryx-adoption-rulings.md`). The 2026-07-30 Tabler switch was never completed — the product frontend and the `app-generation/` catalog stayed on Lucide — so the spec re-aligns with what actually ships and the migration cost is cancelled. A future icon-family swap, if ruled, enters as a planned migration with a codemod, not a spec-only flip. Concept rulings from the Tabler era (unified run/play glyph, reply/undo collision fix) are preserved.

## Navigation & chrome

**Third-party product logos:** brand logos (Slack, Zendesk, Google Calendar, …) are permitted ONLY in connector/integration contexts — connector lists, integration settings rows, source attribution rows. 16px, original brand colors, never recolored, never monochromed, never in navigation chrome, never as a substitute for registry icons. Everywhere else, the closed registry below is the only icon source.

| Concept | Icon | Notes |
|---|---|---|
| home | `house` | |
| search | `search` | also CommandPalette input |
| settings | `settings` | |
| menu (narrow-window nav) | `menu` | collapsed-rail trigger in narrow browser windows |
| back / forward | `chevron-left` / `chevron-right` | |
| expand / collapse (disclosure) | `chevron-right` rotating to down | Accordion, trees, expandable rows |
| open menu (dropdown) | `chevron-down` | Select, split buttons, switchers |
| breadcrumb separator | text `/` | not an icon |
| external link | `arrow-up-right` | trailing only |
| help | `circle-question-mark` | |
| notifications | `bell` | |
| history / activity | `rotate-ccw-clock` | |
| dashboard / charts | `chart-column` | |
| table view | `table-2` | |
| list view / logs | `list` | |
| grid view | `layout-grid` | |
| workspace / org | `building-2` | |
| members / team | `users` | |
| single user | `user` | fallback when no Avatar |
| language / locale | `languages` | |
| theme | `sun` / `moon` | |
| billing / plan | `credit-card` | |
| keyboard shortcuts | `keyboard` | |
| sign out | `log-out` | |
| mark all read | `check-check` | NotificationCenter header |

## Actions

| Concept | Icon | Notes |
|---|---|---|
| create / add | `plus` | |
| edit | `pencil` | approved icon-only |
| delete (permanent) | `trash-2` | approved icon-only |
| remove (from collection) | `x` | also Chip/dismiss ✕ |
| close | `x` | approved icon-only |
| copy | `copy` | approved icon-only |
| duplicate | `copy-plus` | |
| download / export | `download` | |
| upload / import | `upload` | also FileUpload dropzone |
| refresh / sync | `refresh-cw` | approved icon-only |
| retry | `rotate-cw` | distinct from refresh |
| filter | `list-filter` | |
| sort | `arrow-up` / `arrow-down` | active column only |
| delta / trend | `trending-up` / `trending-down` | stat-card delta rows only — icon shows direction of change; color carries direction of goodness |
| more (overflow) | `ellipsis` | approved icon-only |
| send | `arrow-up` in filled circle context | Composer only |
| stop (generation/run) | `square` | |
| run / play | `play` | |
| pause | `pause` | |
| pin | `pin` | |
| drag handle | `grip-vertical` | |
| show / hide value | `eye` / `eye-off` | secrets reveal |
| link / attach reference | `link` | |
| attachment | `paperclip` | Composer |
| reply / quote | `corner-up-left` | Reply pill + ComposerQuote only |
| follow-up | `arrow-right` | follow-up panel rows only |
| refine prompt | `pen-line` | Composer input area, contextual overlay only (moved) |
| voice input | `mic` | Composer footer, send-adjacent trailing (moved) |
| tools / capabilities | `plug` | Composer footer + tool rows |
| prompt template | `bookmark` | Composer footer + template library rows |
| favorite | `star` | template library favorite toggles (was pin); **active state renders FILLED (the outline `star` rendered with `fill: currentColor`) — the registry's one fill-on-active exception**; future list favoriting by governance |
| approve / confirm | `check` | |
| send (Composer) | `arrow-up` | Composer's sanctioned icon-only send |
| regenerate | `refresh-ccw` | distinct from refresh/retry |
| feedback positive / negative | `thumbs-up` / `thumbs-down` | ResponseToolbar only |
| handoff / transfer | `arrow-right-left` | agent↔human transfer rows |
| expand to full screen | `maximize-2` | approved icon-only (maps to expand/collapse slot) |
| undo / redo | `undo-2` / `redo-2` | |
| zoom in / out | `zoom-in` / `zoom-out` | |

## Objects & status

| Concept | Icon | Notes |
|---|---|---|
| agent | **the Synapse agent glyph** (registered custom star path) | NEVER `sparkles`, `robot`, or any Lucide substitute — this is brand-registered, used in squared Avatars, accent buttons, palette rows |
| loading / in-progress | `loader-circle` | Spinner component, Button `loading` state, indeterminate ProgressBar. **Added 2026-07-30** — the registry had no entry despite the system shipping a Spinner, so every spinner in the repo was an off-registry glyph. Rotation is applied by CSS; the glyph itself is static (reduced-motion stops the animation, never swaps the icon). |
| run | `play` | in lists when no status dot (unified ruling kept from the Tabler era: the plain play glyph carries the run concept; Lucide does offer `circle-play`, so re-splitting run to a circled form is available via the proposal path) |
| schedule | `calendar` | also DatePicker trigger |
| time | `clock` | also time fields, durations |
| connector | `plug` | |
| webhook / API | `webhook` | |
| database / source | `database` | |
| file / document | `file-text` | |
| folder | `folder` | |
| image | `image` | |
| code | `code` | CodeBlock language chip area |
| terminal / logs | `terminal` | |
| key / credential | `key-round` | |
| security / policy / guardrail | `shield` | one concept: protection-by-rule (incl. guardrail notices) |
| lock / private | `lock` | |
| info status | `info` | |
| warning status | `triangle-alert` | |
| error/danger status | `circle-alert` | |
| success status | `circle-check` | |
| step: queued | `clock` | AgentStep/RunLog `queued` — waiting for a slot. **Added 2026-08-03** |
| step: awaiting input | `user` | AgentStep/RunLog `awaiting-input` — blocked on a person. **Added 2026-08-03** |
| step: partial | `triangle-alert` | AgentStep `partial` — shares the warning-status glyph; the count carries the specifics. **Added 2026-08-03** |
| step: cancelled | `square` | AgentStep `cancelled` — deliberately the same mark as the Stop control that produces it. **Added 2026-08-03** |
| report | `file-chart-column` | |
| email | `mail` | |
| chat / console | `message-square` | |

## Hard rules

- Registry icons only; the mapping is bidirectional (concept↔icon).
- **Sizes are 12 / 16 / 20 / 24 (foundations §8) — and 24 is also the registry's CEILING.** Stroke art rendered **above 24px is an illustration, not an icon**: it is governed by foundations §8.1 (the curated spot-graphic tier) and sits **outside this registry's closed-set rule** entirely — it needs no concept row here, and the SY019 size check does not fire on it. *Why the boundary exists:* the registry's job is to make **one concept render as one glyph in UI chrome** — a 16px mark in a row, a 20px mark in navigation — where recognition is instant and any second glyph for the same idea is a defect. A 48px hero mark is not chrome; it is **compositional artwork** with different rules (motif sets, at-least-one-neutral-fill, depth layers, placement limited to EmptyState / Guided / full-page status states), and §8.1 already governs it. Forcing that artwork through a concept→glyph table would either freeze illustration into the icon vocabulary or push the icon scale up to sizes where a 1.5px stroke on a 24-unit grid is no longer the point. **Between the two:** an off-scale size *at or below* 24 (10, 11, 14, 18) is still a violation — that is an icon drawn off the scale, and it snaps to the nearest scale step (see the 2026-08-06 audit rulings: 14 → 12).
- The agent glyph is the sole AI iconography — `sparkles`/`wand`/`robot` are permanently forbidden.
- Status icons pair with status colors only (foundations §1.2); never decorative.
- **Paths are generated, never written.** `assets/icons/lucide-registry.json` is the machine-readable form of this table, built from a pinned `lucide-static` version by `scripts/build_icons.py` (canonical names only — deprecated Lucide aliases are rejected at build time). Consumers read the registry; nobody types a `d=` attribute. This closes the loophole that produced the 2026-07-30 cleanup: 313 icon renders in `preview.html` had been hand-drawn as *Lucide* approximations of these same concepts, so 51 concepts were rendering with two different glyphs each — a direct breach of the one-concept-one-icon rule that no reviewer could plausibly catch by eye.
- **The `agent` glyph is the one sanctioned custom path** and lives in the registry as `agent-glyph` with `"custom": true`. It too had drifted into two variants (37 renders of one 4-point star, 3 of another); the 37-render form is now canonical.
- **`chevron-up` is not an entry.** Collapse is `chevron-down` rotated 180°, per the disclosure row above — a separate up-glyph would make the same concept two icons.
- Filled renders are forbidden (stroke-only, 1.5), matching the 1.5-stroke rule — the sole exception is the favorite `star`, which fills on active state.
