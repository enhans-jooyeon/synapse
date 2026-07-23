#!/usr/bin/env python3
"""Build synapse.manifest.json — the machine-readable component index for generation agents.

Run after any components.md change (governance: the manifest is a build artifact, never
hand-edited). Fails if the entry set here drifts from components.md's ## headings.

Entry fields: purpose (1 line) · variants/sizes (closed lists) · key_rules (the rules an
agent most often needs without opening the spec) · spec (authoritative section).
"""
import json, re, os, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

C = {
 "Button": {"purpose": "Trigger an action; never navigation (that is Link).",
  "variants": ["primary", "secondary (tonal)", "ghost", "danger", "accent (POINT color #0621C4, revived — conversational-AI CTA only: Ask agent / Composer send)"],
  "sizes": ["sm", "md", "lg"],
  "key_rules": ["max 1 primary per region", "conversational-AI entry (Ask agent / Composer send) = accent = the point color #0621C4 (max 1/screen); operational agent actions (Run/Retry/Resume) stay primary/black — executing a configured run never earns the point color; slate stays the AI surface, point blue is a distinct accent on top (never blue-on-slate)", "text-only labels by default; icon+text only for accent AI actions and toolbar/filter contexts (approved icons)", "pill radius only in Guided heroes / empty-state first-use", "icon-only buttons are always square (width = size height)", "optical trim: icon+text buttons drop 2px padding on the icon side", "loading keeps width; disabled is a fill, never opacity", "danger labels semibold; danger hover darkens to AA"]},
 "Link": {"purpose": "Navigation. fg.link; underline on hover/focus; inline links always underlined.",
  "key_rules": ["never styled as a button", "external links take the arrow-up-right mark", "no 'click here' labels"]},
 "Input (text)": {"purpose": "Single-line text entry (text/email/password/number/search).",
  "key_rules": ["filled anatomy: bg.sunken, borderless; focus = 1px NEUTRAL border.focus-input + fill opens to bg.page (no offset ring on fields; non-entry controls keep the blue 2px offset ring)", "label above, always; placeholder is example content only", "errors name the fix (border.error)", "mixed bulk values show 'Mixed'/'여러 값'", "no fixed widths on translatable content"]},
 "Textarea": {"purpose": "Multi-line Input; min 3 rows; vertical resize; char counter counts characters not bytes."},
 "Select": {"purpose": "Choose one of 5–15 static options. <5 → Radio; >15/async → Combobox.",
  "key_rules": ["trigger inherits filled Input anatomy", "menu is a Popover; selected shows leading check"]},
 "Checkbox · Radio · Switch": {"purpose": "Form on/off · one-of-2–5 · instant-effect toggle.",
  "key_rules": ["checked = key color, not blue", "switch never inside a Save-button form", "mixed states: checkbox minus, switch centered thumb + minus glyph (track NEVER key color), radio has none", "mixed-value convention applies across all controls"]},
 "Badge": {"purpose": "Static annotation: status, counts, categories. Never interactive (that is Chip).",
  "variants": ["colors: neutral,info,success,warning,danger,ai,category(subtle only)", "emphasis: subtle,solid,outline,dot", "shapes: pill(default),rounded — one shape per view", "sizes: md, lg(page headers only)"],
  "key_rules": ["status vocabulary = content.md §3.3 closed set", "undeclared color = neutral; a badge never renders unfilled", "solid has named jobs only: urgent marks (1 solid color/view), ops-table opt-in, neutral=release markers (must expire), ai=live-activity beacon on ai.solid slate (disappears on completion)", "dot uses status.*-bg-solid fills", "with-icon option: 12px registry status icon for triple redundancy (subtle/solid only)", "count overlay on the bell only: 18px bg.inverse-soft mini-pill + surface ring, half-in corner anchor (top/right -2px) covering part of the glyph; never neutral-subtle, never renders 0", "md optical nudge: line-height 1 + 1px top padding (md only)"]},
 "Chip": {"purpose": "Interactive compact element: select, refine, remove, accept a suggestion. Clickable=Chip, informs-only=Badge.",
  "variants": ["input (removable)", "filter (toggleable)", "category (click-to-filter, system-assigned viz color)", "suggestion (outlined bg.raised + hairline, hover bg.hover/border.strong — style swap w/ source pills; Console/empty states only, max 3)"],
  "key_rules": ["never carries commands (that is Button)", "no manual colors", "labels never truncate"]},
 "Card": {"purpose": "Bounded group of related content.",
  "variants": ["flat (default: bg.surface, borderless)", "outlined (separable/interactive objects)", "elevated (max 1/page; sole static shadow)", "ai (agent content)", "stat (KPI anatomy; uniform — the emphasized opt-in removed)"],
  "key_rules": ["interactive implies outlined/elevated + exactly one action + optional hover-lift", "no bordered nesting", "selected = border.selected ring (selection is key color; focus stays blue)"]},
 "Table": {"purpose": "Workhorse for data-heavy records with aligned columns.",
  "key_rules": ["18 closed cell renderers fix alignment/format per column; empty cell = em dash", "header row: label-size medium fg.tertiary, transparent fill, hairline rule only; sort glyph space reserved", "selection column: 40px, zero padding, centered both axes — control cell, not text cell", "emphasis column opt-in: emphasis.surface fill marks current period/totals, max 1/table", "status columns default dot+text; solid opt-in for ops walls", "frameless by default (bare header); scrolling/pinned-column tables framed", "column menu closed set; bulk selection bar; inline edit for text/number/select cells; 1-level grouping; virtualize >200 rows", "no zebra striping"]},
 "Tabs": {"purpose": "Peer views of one object (2–7). Underline style only.",
  "key_rules": ["never for sequential steps (use Stepper recipe)", "overflow scrolls, never wraps"]},
 "Sidebar (app navigation)": {"purpose": "The single global navigation surface.",
  "key_rules": ["240px expanded/64 rail", "container padding 12; items 32px, 4px gaps; group labels 16px top pad (micro-label, sentence case)", "collection rows may carry an 8px viz-tint category dot — the one color in the sidebar; never on system destinations", "labels never truncate when expanded — shorten the label", "max 2 nesting levels"]},
 "Breadcrumb": {"purpose": "Path context for depth >2; collapse middle beyond 4 into overflow."},
 "Modal": {"purpose": "Blocking decision or focused short task.",
  "key_rules": ["widths 400(confirm)/480/640 max", "opaque bg.raised (glass retired from scrimmed layers)", "footer: Cancel + one primary (danger for destructive, consequences named by count+noun)", "no modal-on-modal; z.modal"]},
 "Drawer": {"purpose": "Side detail/edit without leaving context; right side only; 480/640.",
  "key_rules": ["full-screen data drawers for review surfaces", "wide 800 variant for data review (DiffView)", "opaque bg.raised always (glass retired from scrimmed layers)", "z.drawer"]},
 "Popover / Menu": {"purpose": "Anchored floating panel; menus of actions/options.",
  "key_rules": ["border.overlay (none in light, visible in dark) + shadow.overlay; z.dropdown", "6px container padding (concentric: 10-6=4 item radius); items 32px with 4px gaps; destructive last; dividers full-bleed — binds EVERY horizontal rule in any floating panel, incl. search/hint/footer rows", "search row optional >8 items", "one submenu level max"]},
 "Tooltip": {"purpose": "≤10-word clarification of an icon or truncation. Same-scheme surface; 300ms delay; z.tooltip.",
  "key_rules": ["never interactive; never an error surface"]},
 "Toast": {"purpose": "Transient outcome notification; bottom-right; max 3; z.toast.",
  "key_rules": ["same-scheme surface (raised-2 + border.overlay + shadow)", "errors 8s + manual dismiss; never for validation or decisions", "contents first-line aligned; dismiss × = compact 20px box (not a form control )", "undo convention: reversible-lite ops get Undo toast (8s) instead of Popconfirm — never both"]},
 "Banner / Alert": {"purpose": "Persistent inline notice for a page/section.",
  "variants": ["colors: neutral,info,success,warning,danger", "emphasis: subtle (borderless status tint, no border/rail ), solid (app-critical strip; max 1 in app; semibold text)"],
  "key_rules": ["max 1 per region"]},
 "Avatar": {"purpose": "Identity. Round = human, squared = agent (mandatory product language).",
  "sizes": ["20 (no dot)", "24", "32", "40", "56"],
  "key_rules": ["dots per size 8/10/12/14 using status.*-bg-solid", "AvatarGroup: max 4 + '+N'", "initials on deterministic viz tint"]},
 "Skeleton · Spinner": {"purpose": "Loading: skeleton for known shapes >300ms; spinner (16 in controls / 20 standalone) for unknown.",
  "key_rules": ["skeleton mirrors true layout via line/block/circle presets only", "one spinner per region"]},
 "EmptyState": {"purpose": "Every list/table/search has one. Flavors: first-use, no-results, error (+retry).",
  "key_rules": ["always an action when possible", "no illustrations in v1", "icon medallion: sunken circle + two concentric hairline rings; error flavor tints it danger-bg", "explanations balance-wrapped", "compact variant (one line, no icon) required inside small overlays"]},
 "Pagination": {"purpose": "Table/list nav; 'Load more' for feeds; infinite scroll forbidden in tables."},
 "CommandPalette": {"purpose": "⌘K universal entry: navigation, actions, ask-agent.",
  "key_rules": ["never dead-ends — final row is 'Ask agent: {query}'", "glass material, SCRIMLESS (frost is the focus device; reduced-transparency → opaque)", "grouped results, kbd hints, match highlighting", "z.dropdown"]},
 "ProgressBar": {"purpose": "Long-running work. 4px track.",
  "variants": ["default (meter.fill gray)", "ai (accent)"],
  "key_rules": ["determinate needs a real denominator", "failed persists red; cancelled = border.strong", "never a bare spinner >10s"]},
 "Composer": {"purpose": "The message/instruction input for Console and ask-agent surfaces.",
  "key_rules": ["never disabled during generation (empty-send is the one sanctioned disable)", "send↔stop morph in place", "ComposerQuote bar: ai.surface radius-xs, max 1/send; follow-up panel above composer, max 4 rows, never auto-sends", "slash commands: / scopes palette to agent actions; ghost completion accepted with →, never Tab; closed glossary only", "follow-up panel = glass material (the one anchored glass exception)", "templates: / = expert quick-insert; bookmark opens the Template Library Modal (glass 640: search + grouped rich cards w/ description + cloze preview + 새 템플릿 만들기 footer ); slot chips = emphasis.surface, → moves slots, unfilled slot blocks send (§23)", "authoring coach: max one non-blocking quality hint; pen-line opens the CLOSED refinement-preset menu (다듬기/자세히/간결/범위/형식 ), rewrite replaces draft w/ Undo, disabled on empty", "voice = dictation only ( §26): tray morphs to recording bar (cancel / pulsing danger dot + timer / pause / primary check confirm); transcript inserts at caret, NEVER auto-sends; no audio in thread", "agent-picker menu: search + grouped rows + one submenu + mandatory request-footer escape (no model rows — reversed)", "model selector (trailing): menu grouped by provider under micro-label headers, real product names in mono, 자동 row = agent default; per-conversation, defaults from agent, lockable; never changes permissions/approval", "tools popover (plug): per-conversation capability switches; disabled tool → agent asks; enabling never bypasses ProposalCard", "composer footer: leading = + menu (첨부/템플릿/도구) + agent picker; trailing = model + mic (send-adjacent, never in + menu) + send; kbd hint removed; refine-prompt = contextual pen at input top-right, rendered only with a non-empty draft; 1 visible leading icon default, 5 hard cap", "input-pattern laws: starters = zero-state only, insert never send, dismissible; chip label IS the query; selection pill = 답장/설명/재생성 closed set, thread append-only; attachment captions advisory-only; batch = per-item queue, one failure never aborts, ProposalCard still gates; ghost text → accepts never Tab, suppressed during Hangul composition", "Enter sends, Shift+Enter breaks, Enter during IME composition NEVER sends", "attachments as input Chips; agent/scope picker ghost", "drafts persist; no formatting toolbar; one per screen"]},
 "ResponseToolbar": {"purpose": "Actions on an agent message: copy · regenerate · thumbs · overflow.",
  "key_rules": ["agent messages only; fixed order", "hover-reveal default, persistent where hover is unreliable", "regenerate on latest message only — creates variant N+1, never destroys; answer header carries the ‹n/N› pager ( §22)", "thumbs selected = stroke + bg.selected circle, never filled icons", "no destructive actions", "media variant: vertical rail beside a MediaGroup ONLY when media is the sole message content — text+media replies use the message toolbar alone, never both"]},
 "AgentStep": {"purpose": "One row of visible agent work (step/tool call).",
  "key_rules": ["closed states: pending/running/success/failed(+Retry)/skipped", "collapses to '5 steps · 12s' summary on completion", "tool ids in mono; payloads collapsed; max 1 nesting level", "role=log aria-live=polite", "named working line above steps while generating (pulse, no shimmer); long replies open with title + duration badge + collapse"]},
 "DescriptionList": {"purpose": "Key-value rows for detail views/drawers/expanded rows.",
  "key_rules": ["term column sized to widest term of active locale; never truncates", "empty = em dash", "not a form"]},
 "ButtonGroup": {"purpose": "Fused peer actions (attached tonal segments) or split button (main + chevron menu of true variants).",
  "key_rules": ["never attach primaries", "≤4 segments"]},
 "ProposalCard": {"purpose": "Human-in-the-loop approval of a consequential agent action.",
  "key_rules": ["tray anatomy: borderless ai.surface fill, radius lg, no shadow; header row + ai.border hairline (single-tone; two-tone reversed); payload surfaces open to bg.page; squared avatar FIRST in header (the agency marker); forbidden formula = tint + outline", "Approve=primary (danger if destructive; approving is a human decision, not an AI CTA), Reject=secondary (light mode: bg.page fill on the tray — tonal gray dissolves on slate; dark keeps standard fill)", "no auto-approve, no countdowns", "resolved collapses to attribution row, never deleted", "diffs: tint backgrounds + gutter markers, never color alone"]},
 "SourceChip": {"purpose": "Inline provenance marker [n] for agent claims; popover with source detail.",
  "key_rules": ["never fake citations — unsourced claims get the 'Model knowledge' badge", "≤3 per sentence", "sources row: 출처 eyebrow ABOVE pill source cards — leading 18px page-filled numeral circle (mirrors the inline marker) + 12px type icon + name (icon restored); card↔marker hover linkage; ≥24px hit areas", "marker = 18px circle, neutral bg.sunken + fg.secondary, bare numeral 11 semibold tabular — brackets/mono retired"]},
 "Combobox": {"purpose": "Large (>15) or async option sets; single or multi (input Chips).",
  "key_rules": ["conveniences opt-in: search-in-menu, select-all (filtered set), groups, descriptions, recent, load-more, virtualize >100", "creatable only when data model allows; never auto-create on blur"]},
 "DatePicker": {"purpose": "date · range (preset rail) · datetime (footer time row) · time.",
  "key_rules": ["locale formats per content.md §6; timezone label mandatory when it matters", "durations are number+unit, never a time picker", "today outlined; endpoints filled; range interior squared"]},
 "SegmentedControl": {"purpose": "Exclusive 2–5-way switch, immediate effect (not Tabs, not Radio).",
  "key_rules": ["content-based widths; disabled whole-control only", "concentric geometry: radius-sm container, 4px padding, radius-xs segments — inner = outer − inset; assembled control = 36"]},
 "Accordion": {"purpose": "Progressive disclosure of secondary content.",
  "key_rules": ["never hides primary content/actions/errors", "chevron is the affordance; height animates (sanctioned exception)"]},
 "FileUpload": {"purpose": "Dropzone or button; per-file progress rows.",
  "key_rules": ["constraints visible before selection; violations named per file", "no combined progress bar", "dropzone: dashed border.strong + radius lg + medallion; drag-over = border.focus-input + emphasis.surface; dashed = drop targets only"]},
 "SplitPanel": {"purpose": "Resizable workbench panes with a draggable divider.",
  "key_rules": ["≤3 panes; min widths 280/200; ratio persists; not in fixed-layout archetypes (Settings/Guided)", "container = section shell: radius xl + hairline, flush panes"]},
 "Chart": {"purpose": "Data viz inside Cards; closed types: line, area(1 series), bar, stacked-bar, donut(≤3), sparkline.",
  "key_rules": ["viz-1..8 in fixed order; status charts use status tokens", "bars start at 0; no dual y-axes; >8 series → 'Other'", "loading skeleton / EmptyState / error states required"]},
 "ContextCard": {"purpose": "Referenced object (doc/meeting/table) as a physical card in threads and Composer.",
  "key_rules": ["outlined radius-sm card: icon tile + title + one caption meta line; no thumbnails", "stack: flat -4px underlay + page-colored ring + '+N', max 3, never rotated", "compact inline variant for Composer @-mentions"]},
 "Timeline": {"purpose": "Chronological activity: audit trails, run feeds.",
  "key_rules": ["actor avatar shape carries authorship", "verb-first templated sentences; absolute time on hover", "day dividers; same-actor collapse; Load more (no infinite tables)", "history never editable"]},
 "Tree": {"purpose": "Hierarchy display/selection; folders, org units.",
  "key_rules": ["rows 28; indent 20/level; max 4 levels then drill-in", "checkbox mode uses mixed-state parents", "drop target = focus insertion line", "no guide lines; middle-out truncation + tooltip"]},
 "CodeBlock": {"purpose": "Code/log/config display (promoted from .sy-code-block).",
  "key_rules": ["header: language chip + copy", "one muted syntax theme ≤5 colors system-wide", "max-height 400 + expand; renders on fence close", "display only — no editing"]},
 "DiffView": {"purpose": "Standalone change comparison (promoted from ProposalCard diff rules).",
  "key_rules": ["unified default; side-by-side ≥960px", "tint + gutter markers, never color alone", "unchanged runs collapse; +N −M counts tabular", "no syntax highlighting inside diffs"]},
 "MediaGroup": {"purpose": "Agent-GENERATED media as a casual fan — the one sanctioned playful moment.",
  "key_rules": ["±2.5° alternating rotation, ~20% overlap, max 3 + '+N' (badge in caption strip); single item flat", "card = media area + surface caption strip with hairline rule", "hover straightens + raises; reduced-motion renders flat", "jurisdiction hard: generated media in agent replies ONLY — rotation exists nowhere else (design.md §8)", "playfulness lives in output, never chrome"]},
 "Slider · NumberInput": {"purpose": "Bounded continuous values (position=meaning) · precise numeric entry (paired, not interchangeable).",
  "key_rules": ["slider never without a visible value; never for unbounded/precision", "number input: steppers, unit suffix, clamp on blur, tabular"]},
 "ChoiceCard": {"purpose": "2–6 described options as selectable outlined cards (plan/agent-type pickers).",
  "key_rules": ["radio semantics default, multi variant shows checkboxes", "selected = border.selected ring + check", "equal heights; whole card is the target; >6 → Select"]},
 "HoverCard": {"purpose": "Rich entity preview on hover/focus (user/agent/run).",
  "key_rules": ["500ms delay; ≤320px; avatar header + 2–4 key-value rows + ≤1 ghost action", "hover is enhancement — same info must exist on click-through", "no forms; no nesting"]},
 "Popconfirm": {"purpose": "Inline confirm for low-stakes recreatable actions — between no-confirm and Modal.",
  "key_rules": ["one question + Cancel/confirm pair", "permanent loss, bulk, named counts → Modal", "no chaining; no inputs"]},
 "ContextMenu": {"purpose": "Right-click Menu on data surfaces.",
  "key_rules": ["same Menu component at pointer", "duplication rule: every action also exists in visible UI", "one submenu level; not on prose"]},
 "CalendarView": {"purpose": "Schedule visualization (month/week) — runs, not bookings.",
  "key_rules": ["day cells ≥96px; max 3 events + '+N' popover", "event colors = system-assigned viz tints only", "drag-reschedule only where model allows, Toast + undo", "empty days are empty"]},
 "NotificationCenter": {"purpose": "The bell's panel: what happened while away.",
  "key_rules": ["items templated from content verbs; unread dot + surface fill", "click navigates + marks read; consequential actions only OPEN their surface (never approve from a notification)", "30 items then View all"]},
}

class ManifestDrift(Exception):
    """components.md headings and the C entry set have diverged."""


def build():
    """Return the manifest dict from components.md + C + tokens. Raises ManifestDrift on heading drift.
    Pure (no file writes) so validators can compare against the on-disk manifest without side effects."""
    comps = open(os.path.join(ROOT, "components.md"), encoding="utf-8").read()
    headings = re.findall(r"^## (.+)$", comps, flags=re.M)
    missing = [h for h in headings if h not in C]
    extra = [k for k in C if k not in headings]
    if missing or extra:
        raise ManifestDrift(f"missing entries: {missing} | stale entries: {extra}")
    tokens = json.load(open(os.path.join(ROOT, "tokens", "synapse.tokens.json"), encoding="utf-8"))
    manifest = {
        "$version": tokens["$version"],
        "$generated_by": "tools/build_manifest.py — regenerate after any components.md change; never hand-edit",
        "authority": "design.md > tokens/synapse.tokens.json > foundations.md > components.md > recipes.md > ai-patterns.md > content.md",
        "archetypes": ["workbench", "object", "settings", "guided", "console", "home"],
        "locales": ["en", "ko"],
        "typography_styles": list(tokens["semantic"]["type"].keys() - {"$description"}) if isinstance(tokens["semantic"]["type"], dict) else [],
        "z_scale": {k: v["$value"] for k, v in tokens["primitive"]["z"].items() if not k.startswith("$")},
        "recipes": {"R1": "page header", "R2": "section header", "R3": "card header", "R4": "stat grid", "R5": "action pairs/footers", "R6": "filter bar", "R7": "toolbar", "R8": "form section", "R9": "stepper", "R10": "topbar", "R11": "key-value panel", "R12": "empty page"},
        "never": ["raw color/spacing/radius/type values (semantic tokens + typography styles only)",
                  "components or variants outside this manifest", "icons outside icons.md registry",
                  "italics, ALL-CAPS, fixed-width text containers, line-height below paired floor",
                  ">1 primary button or Banner per region; the deprecated accent variant anywhere",
                  "carousels; infinite scroll in tables; nested modals; custom scrollbars; per-client theming; arbitrary z-index",
                  "gradients; glow; blur outside the glass material (scrimmed overlays only); rotation outside MediaGroup's generated-media fan",
                  "particle attached to a variable in Korean; concatenated sentence fragments",
                  "auto-approval of agent proposals; silent agent side effects; fake citations",
                  "optimistic rendering of agent output; marquee/auto-playing motion; white-label/per-client theming"],
        "components": {h: C[h] for h in headings},
    }
    manifest["typography_styles"] = [k for k in tokens["semantic"]["type"] if not k.startswith("$")]
    return manifest


MANIFEST_PATH = os.path.join(ROOT, "synapse.manifest.json")


def serialize(manifest):
    """The exact on-disk representation — keep in lockstep with main()'s json.dump call."""
    return json.dumps(manifest, ensure_ascii=False, indent=1)


def main():
    manifest = build()
    with open(MANIFEST_PATH, "w", encoding="utf-8") as f:
        f.write(serialize(manifest))
    print("wrote", MANIFEST_PATH, "-", len(manifest["components"]), "components")


if __name__ == "__main__":
    main()
