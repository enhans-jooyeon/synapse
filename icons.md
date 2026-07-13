# Synapse icon registry

**Closed vocabulary.** Every icon in AgentOS comes from this concept→icon table (Lucide names, stroke 1.5 at the 20px grid, sizes 16/20/24 per foundations §7). A concept not listed here gets **no icon** — using an unlisted Lucide icon, inventing an SVG, or repurposing a listed icon for a different concept are contract violations; new concepts go through the proposal path (design.md §6). One concept, one icon: the same idea never renders with two different glyphs anywhere in the product.

## Navigation & chrome

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
| help | `circle-help` | |
| notifications | `bell` | |
| history / activity | `history` | |
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
| agent | **the Synapse agent glyph** (registered custom star path) | NEVER `sparkles`, `bot`, or any Lucide substitute — this is brand-registered, used in squared Avatars, accent buttons, palette rows |
| run | `circle-play` | in lists when no status dot |
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
| report | `file-chart-column` | |
| email | `mail` | |
| chat / console | `message-square` | |

## Hard rules

- Registry icons only; the mapping is bidirectional (concept↔icon).
- The agent glyph is the sole AI iconography — `sparkles`/`wand`/`bot` are permanently forbidden.
- Status icons pair with status colors only (foundations §1.2); never decorative.
- Filled Lucide variants are forbidden (stroke set only), matching the 1.5-stroke rule.
