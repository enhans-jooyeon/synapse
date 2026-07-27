# Synapse icon registry

**Closed vocabulary.** Every icon in AgentOS comes from this concept→icon table (Tabler Icons — outline set — stroke down-weighted to 1.5, sizes 16/20/24 per foundations §7). A concept not listed here gets **no icon** — using an unlisted Tabler icon, inventing an SVG, or repurposing a listed icon for a different concept are contract violations; new concepts go through the proposal path (design.md §6). One concept, one icon: the same idea never renders with two different glyphs anywhere in the product.

## Navigation & chrome

**Third-party product logos:** brand logos (Slack, Zendesk, Google Calendar, …) are permitted ONLY in connector/integration contexts — connector lists, integration settings rows, source attribution rows. 16px, original brand colors, never recolored, never monochromed, never in navigation chrome, never as a substitute for registry icons. Everywhere else, the closed registry below is the only icon source.

| Concept | Icon | Notes |
|---|---|---|
| home | `home` | |
| search | `search` | also CommandPalette input |
| settings | `settings` | |
| menu (narrow-window nav) | `menu-2` | collapsed-rail trigger in narrow browser windows |
| back / forward | `chevron-left` / `chevron-right` | |
| expand / collapse (disclosure) | `chevron-right` rotating to down | Accordion, trees, expandable rows |
| open menu (dropdown) | `chevron-down` | Select, split buttons, switchers |
| breadcrumb separator | text `/` | not an icon |
| external link | `external-link` | trailing only |
| help | `help-circle` | |
| notifications | `bell` | |
| history / activity | `history` | |
| dashboard / charts | `chart-bar` | |
| table view | `table` | |
| list view / logs | `list` | |
| grid view | `layout-grid` | |
| workspace / org | `building` | |
| members / team | `users` | |
| single user | `user` | fallback when no Avatar |
| language / locale | `language` | |
| theme | `sun` / `moon` | |
| billing / plan | `credit-card` | |
| keyboard shortcuts | `keyboard` | |
| sign out | `logout` | |
| mark all read | `checks` | NotificationCenter header |

## Actions

| Concept | Icon | Notes |
|---|---|---|
| create / add | `plus` | |
| edit | `pencil` | approved icon-only |
| delete (permanent) | `trash` | approved icon-only |
| remove (from collection) | `x` | also Chip/dismiss ✕ |
| close | `x` | approved icon-only |
| copy | `copy` | approved icon-only |
| duplicate | `copy-plus` | |
| download / export | `download` | |
| upload / import | `upload` | also FileUpload dropzone |
| refresh / sync | `refresh` | approved icon-only |
| retry | `rotate-clockwise` | distinct from refresh |
| filter | `filter` | |
| sort | `arrow-up` / `arrow-down` | active column only |
| delta / trend | `trending-up` / `trending-down` | stat-card delta rows only — icon shows direction of change; color carries direction of goodness |
| more (overflow) | `dots` | approved icon-only |
| send | `arrow-up` in filled circle context | Composer only |
| stop (generation/run) | `player-stop` | |
| run / play | `player-play` | |
| pause | `player-pause` | |
| pin | `pin` | |
| drag handle | `grip-vertical` | |
| show / hide value | `eye` / `eye-off` | secrets reveal |
| link / attach reference | `link` | |
| attachment | `paperclip` | Composer |
| reply / quote | `corner-up-left` | Reply pill + ComposerQuote only |
| follow-up | `arrow-right` | follow-up panel rows only |
| refine prompt | `edit` | Composer input area, contextual overlay only (moved) |
| voice input | `microphone` | Composer footer, send-adjacent trailing (moved) |
| tools / capabilities | `tools` | Composer footer + tool rows |
| prompt template | `bookmark` | Composer footer + template library rows |
| favorite | `star` | template library favorite toggles (was pin); **active state renders FILLED (Tabler `star` filled variant) — the registry's one fill-on-active exception**; future list favoriting by governance |
| approve / confirm | `check` | |
| send (Composer) | `arrow-up` | Composer's sanctioned icon-only send |
| regenerate | `refresh-dot` | distinct from refresh/retry |
| feedback positive / negative | `thumb-up` / `thumb-down` | ResponseToolbar only |
| handoff / transfer | `arrows-exchange` | agent↔human transfer rows |
| expand to full screen | `maximize` | approved icon-only (maps to expand/collapse slot) |
| undo / redo | `arrow-back-up` / `arrow-forward-up` | |
| zoom in / out | `zoom-in` / `zoom-out` | |

## Objects & status

| Concept | Icon | Notes |
|---|---|---|
| agent | **the Synapse agent glyph** (registered custom star path) | NEVER `sparkles`, `robot`, or any Tabler substitute — this is brand-registered, used in squared Avatars, accent buttons, palette rows |
| run | `player-play` | in lists when no status dot (Tabler has no circled-play; the plain play glyph carries the run concept) |
| schedule | `calendar` | also DatePicker trigger |
| time | `clock` | also time fields, durations |
| connector | `plug` | |
| webhook / API | `webhook` | |
| database / source | `database` | |
| file / document | `file-text` | |
| folder | `folder` | |
| image | `photo` | |
| code | `code` | CodeBlock language chip area |
| terminal / logs | `terminal` | |
| key / credential | `key` | |
| security / policy / guardrail | `shield` | one concept: protection-by-rule (incl. guardrail notices) |
| lock / private | `lock` | |
| info status | `info-circle` | |
| warning status | `alert-triangle` | |
| error/danger status | `alert-circle` | |
| success status | `circle-check` | |
| report | `report` | |
| email | `mail` | |
| chat / console | `message` | |

## Hard rules

- Registry icons only; the mapping is bidirectional (concept↔icon).
- The agent glyph is the sole AI iconography — `sparkles`/`wand`/`robot` are permanently forbidden.
- Status icons pair with status colors only (foundations §1.2); never decorative.
- Filled Tabler variants are forbidden (outline set only), matching the 1.5-stroke rule — the sole exception is the favorite `star`, which fills on active state.
