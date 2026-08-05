#!/usr/bin/env python3
"""Build synapse.manifest.json — the machine-readable component index for generation agents.

The components section is a PURE PROJECTION of components.md: every entry is parsed from
that file's labelled bold slots (**Purpose:**, **Keywords:**, **Variants:**, **Sizes:**,
**States:**, **A11y:**, **Forbidden:**, **Key rules (machine index):** — plus their
accepted wording variants). Nothing component-shaped is hardcoded here, so prose and
manifest can no longer drift apart: there is one authored copy (adoption rulings #1/#2,
proposals/2026-08-05-astryx-adoption-rulings.md).

Run after any components.md change (governance: the manifest is a build artifact, never
hand-edited). Exits 1, listing every offence, when the spec's slots are unparseable:
an entry without a **Purpose:** slot, a **Key rules** or **Keywords** slot without
content, or a bold `**Label:**` that matches no registered label (catches typos like
`**Purpos:**` — a genuinely new label is taught to LABELS / KNOWN_UNMAPPED, deliberately).

Entry fields, in order: purpose (always) · keywords (discovery aliases — lowercased,
comma-split; never contract vocabulary) · variants/sizes/states/a11y/forbidden (present
wherever the prose has the slot; a single-paragraph slot is a string; bullet-list, table
and multi-block slots are a list of strings) · key_rules (the rules an agent most often
needs without opening the spec — the **Key rules (machine index):** bullets, verbatim).
"""
import json, re, os, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
COMPONENTS_MD = os.path.join(ROOT, "components.md")

# --------------------------------------------------------------- slot labels
#
# Manifest field <- the prose labels that feed it. The FIRST entry per field is
# the canonical wording; the rest are accepted variants (the build prints a
# WARNING for each entry using one, so wording converges without blocking).
LABELS = {
    "purpose":   ["Purpose"],
    "keywords":  ["Keywords"],
    "variants":  ["Variants", "Variants (closed)", "Color variants",
                  "Emphasis variants", "Types (closed)"],
    "sizes":     ["Sizes"],
    "states":    ["States", "States (closed)"],
    "a11y":      ["A11y"],
    "forbidden": ["Forbidden", "Forbidden — with their replacements"],
    "key_rules": ["Key rules (machine index)"],
}
FIELD_ORDER = ["purpose", "keywords", "variants", "sizes", "states", "a11y", "forbidden", "key_rules"]
LABEL_TO_FIELD = {l: f for f, ls in LABELS.items() for l in ls}
CANONICAL = {f: ls[0] for f, ls in LABELS.items()}

# Labels that are legitimate prose structure but not manifest fields. Explicit by
# design (SY020's stance: a guessed mapping makes coverage unknowable). Matching
# strips backticks and, when the full label misses, retries without a trailing
# " — qualifier" and/or "(parenthetical)" — so "Anatomy (outlined)" and
# "Anatomy — `human`" both resolve to "Anatomy".
KNOWN_UNMAPPED = {
    "Anatomy", "Anatomy & behavior", "Behavior", "Bilingual", "Jurisdiction",
    "Keyboard", "Placement", "Affixes", "Optical centering", "Count badge",
    "with-icon option", "Selection column", "Column rules", "States per cell",
    "Multi-select", "Convenience features", "Calendar anatomy", "range",
    "datetime", "time", "Formats", "File rows", "Rules", "Color", "Scale rules",
    "AI side surfaces", "Dividers", "Optional search row", "Undo convention",
    "Status indicator", "AvatarGroup", "Results", "Usage-meter jurisdiction",
    "⚠ Two rules remain homeless. Recorded, not silently dropped",
    "⚠ Three rules are now homeless or contradicted. Recorded, not silently dropped",
    "Send ↔ Stop morph", "Slash commands", "Drafts", "Feedback completeness",
    "Scroll contract", "Append-only", "When", "When not", "Subordination rules",
    "Rejected on the way", "Dismissal", "Consumers", "Actions", "Scope law",
    "Grouping", "Chip honesty", "Mutual exclusion", "Grounded",
    "Refreshable, not authoritative", "Description content", "Optional row action",
    "Sources row", "Stack", "Compact", "Selection", "Drag", "Syntax theme",
    "Streaming", "Principle", "Slider", "NumberInput", "Rule",
    "The duplication rule", "Month grid", "Week variant", "Item types",
    "Per-item controls", "Empty state", "Canvas", "FlowNode", "Edge",
    "NodePalette", "CanvasControls", "Modes", "Icon well", "compact variant",
    "Label & icon rules", "Pill option", "Jurisdiction constraints on target",
    "Content column", "Attachment order",
}


class SpecParseError(Exception):
    """components.md's labelled slots could not be parsed into the manifest."""


# a bold run opening a line; the label may end ':' or '.' inside the bold
BOLD_LEAD = re.compile(r"^\*\*(.+?)\*\*")
# a MAPPED label opening mid-line (single-paragraph entries fold **Forbidden:**
# into their lead line); unknown mid-line bolds are inline emphasis, kept as text
MIDLINE = re.compile(r"(?<!^)\*\*([^*\n]+?):\*\*")


def _norm_label(label):
    """Strip backticks and trailing punctuation for registry matching."""
    return label.replace("`", "").strip().rstrip(".:").strip()


def _match_label(label, table):
    """Exact label, else without a ' — qualifier' suffix, else without a trailing
    '(parenthetical)'. Returns the registered form that matched, or None."""
    cands = [label]
    if " — " in label:
        cands.append(label.split(" — ")[0].strip())
    for c in list(cands):
        stripped = re.sub(r"\s*\([^)]*\)$", "", c).strip()
        if stripped != c:
            cands.append(stripped)
    for c in cands:
        if c in table:
            return c
    return None


def _clean(text):
    """Markdown -> plain manifest text: drop emphasis/backticks, collapse space.

    A `*` inside a backtick code span is a literal wildcard (`status.*-bg`) and
    survives; a bare `*` outside one is an emphasis marker and is dropped.
    """
    text = re.sub(r"`([^`]*)`", lambda m: m.group(1).replace("*", "\x00"), text)
    text = re.sub(r"\*\*(.+?)\*\*", r"\1", text)
    text = re.sub(r"~~(.+?)~~", r"\1", text)
    text = text.replace("`", "").replace("*", "").replace("\x00", "*")
    return re.sub(r"\s+", " ", text).strip()


def _blocks(lines):
    """Slot content lines -> cleaned blocks: a paragraph is one string; a bullet
    list contributes one string per bullet; a table one string per data row
    (cells joined with ' — ', |---| separator rows dropped)."""
    out, para = [], []
    def flush():
        if para:
            out.append(_clean(" ".join(para)))
            para.clear()
    for ln in lines:
        s = ln.strip()
        if not s:
            flush()
        elif s.startswith("- "):
            flush()
            out.append(_clean(s[2:]))
        elif s.startswith("|"):
            flush()
            cells = [c.strip() for c in s.strip("|").split("|")]
            if all(re.fullmatch(r":?-{3,}:?", c) for c in cells):
                continue
            out.append(_clean(" — ".join(c for c in cells if c)))
        else:
            para.append(s)
    flush()
    return [b for b in out if b]


def _split_sections(md):
    """components.md -> [(name, [body lines])] in file order."""
    sections, cur, buf = [], None, []
    for line in md.splitlines():
        m = re.match(r"^## (.+)$", line)
        if m:
            if cur is not None:
                sections.append((cur, buf))
            cur, buf = m.group(1).strip(), []
        elif cur is not None:
            buf.append(line)
    if cur is not None:
        sections.append((cur, buf))
    return sections


def _parse_entry(name, lines, errors, warnings):
    """One ## section -> manifest entry dict, or None (error recorded).

    A slot opens at a line-initial registered bold label — or at a mapped label
    mid-line — and closes at the next line-initial bold run, '---', or section
    end. A line-initial bold ending ':' that matches nothing is a typo -> error.
    """
    slots = {f: [] for f in FIELD_ORDER}   # field -> [slot line-list, ...]
    open_seg = None                        # the line-list currently being filled

    def note_label(matched):
        field = LABEL_TO_FIELD[matched]
        if matched != CANONICAL[field]:
            warnings.append(f"{name}: non-canonical slot label '{matched}' "
                            f"(canonical: '{CANONICAL[field]}')")
        return field

    def feed(text):
        """Append text to the open slot; a mapped mid-line label splits it."""
        nonlocal open_seg
        pos = 0
        for m in MIDLINE.finditer(text):
            matched = _match_label(_norm_label(m.group(1)), LABEL_TO_FIELD)
            if not matched:
                continue
            if open_seg is not None:
                open_seg.append(text[pos:m.start()])
            open_seg = []
            slots[note_label(matched)].append(open_seg)
            pos = m.end()
        if open_seg is not None:
            open_seg.append(text[pos:])

    for ln in lines:
        if ln.strip() == "---":
            open_seg = None
            continue
        m = BOLD_LEAD.match(ln)
        if m:
            raw = m.group(1)
            mapped = _match_label(_norm_label(raw), LABEL_TO_FIELD)
            if mapped:
                open_seg = []
                slots[note_label(mapped)].append(open_seg)
                feed(ln[m.end():].lstrip(": "))
                continue
            colon_marked = raw.rstrip().endswith(":") or ln[m.end():m.end() + 1] == ":"
            if colon_marked and not _match_label(_norm_label(raw), KNOWN_UNMAPPED):
                errors.append(f"{name}: unrecognised slot label '**{raw}**' — typo, or teach "
                              f"tools/build_manifest.py the new label (LABELS / KNOWN_UNMAPPED)")
            open_seg = None   # any bold lead closes the open slot
            continue
        feed(ln)              # inside a slot: content; outside: free prose whose
                              # mapped mid-line labels may still open a slot

    entry = {}
    for field in FIELD_ORDER:
        segs = slots[field]
        if not segs:
            continue
        if field == "key_rules":
            rules = [s.strip()[2:] for seg in segs for s in seg if s.strip().startswith("- ")]
            if not rules:
                errors.append(f"{name}: **Key rules (machine index):** slot has no '- ' bullets")
                continue
            entry[field] = rules
            continue
        if field == "keywords":
            # SINGLE-LINE slot by format: comma-separated discovery aliases on the
            # label line itself -> lowercased, trimmed list. Content on later lines
            # is deliberately ignored so an adjacent paragraph is never swallowed.
            terms = [t.strip().lower().rstrip(".")
                     for seg in segs for t in _clean(seg[0] if seg else "").split(",")]
            terms = [t for t in terms if t]
            if not terms:
                errors.append(f"{name}: **Keywords:** slot is empty — list 3–8 discovery aliases")
                continue
            entry[field] = terms
            continue
        blocks = [b for seg in segs for b in _blocks(seg)]
        if not blocks:
            continue
        if field == "purpose":
            entry[field] = blocks[0]   # the slot's text, single paragraph
        else:
            entry[field] = blocks[0] if len(blocks) == 1 else blocks
    if "purpose" not in entry:
        errors.append(f"{name}: no **Purpose:** slot — every entry must declare one")
        return None
    return entry


def build_components(md, warnings):
    """Parse every ## entry of components.md; raise SpecParseError listing every
    offence if any entry is unparseable."""
    errors, components = [], {}
    for name, lines in _split_sections(md):
        entry = _parse_entry(name, lines, errors, warnings)
        if entry is not None:
            components[name] = entry
    if errors:
        raise SpecParseError("components.md is unparseable:\n  " + "\n  ".join(errors))
    return components


def build(verbose=False):
    """Return the manifest dict parsed from components.md + tokens. Raises
    SpecParseError when the prose's slots cannot be parsed. Pure (no file writes)
    so validators can compare against the on-disk manifest without side effects."""
    md = open(COMPONENTS_MD, encoding="utf-8").read()
    warnings = []
    components = build_components(md, warnings)
    if verbose:
        for w in dict.fromkeys(warnings):
            print("WARNING:", w, file=sys.stderr)
    tokens = json.load(open(os.path.join(ROOT, "tokens", "synapse.tokens.json"), encoding="utf-8"))
    manifest = {
        "$version": tokens["$version"],
        "$generated_by": "tools/build_manifest.py — pure projection of components.md's labelled slots; regenerate after any components.md change; never hand-edit",
        "authority": "design.md > tokens/synapse.tokens.json > foundations.md > components.md > recipes.md > ai-patterns.md > content.md",
        "archetypes": ["workbench", "object", "settings", "guided", "console", "home"],
        "locales": ["en", "ko"],
        "typography_styles": list(tokens["semantic"]["type"].keys() - {"$description"}) if isinstance(tokens["semantic"]["type"], dict) else [],
        "z_scale": {k: v["$value"] for k, v in tokens["primitive"]["z"].items() if not k.startswith("$")},
        "recipes": {"R1": "page header", "R2": "section header", "R3": "card header", "R4": "stat grid", "R5": "action pairs/footers", "R6": "filter bar", "R7": "toolbar", "R8": "form section", "R9": "stepper", "R10": "topbar", "R11": "key-value panel", "R12": "empty page", "R13": "error page", "R14": "exported report", "R15": "batch-run results", "R16": "builder workbench shell"},
        "never": [
                  "--sy-text-* on an icon — icons take the dedicated --sy-icon-* family (2026-07-30); only icon.primary differs in value, the rest alias text.*/status.*","raw color/spacing/radius/type values (semantic tokens + typography styles only)",
                  "components or variants outside this manifest", "icons outside icons.md registry",
                  "italics, ALL-CAPS, fixed-width text containers, line-height below paired floor",
                  ">1 primary button or Banner per region; the pre-rename 'accent' variant name anywhere (it is 'brand')",
                  "carousels; infinite scroll in tables; nested modals; custom scrollbars; per-client theming; arbitrary z-index",
                  "gradients; glow; blur / backdrop-filter (overlays are opaque, no glassmorphism); rotation outside MediaGroup's generated-media fan",
                  "particle attached to a variable in Korean; concatenated sentence fragments",
                  "auto-approval of agent proposals; silent agent side effects; fake citations",
                  "optimistic rendering of agent output; marquee/auto-playing motion; white-label/per-client theming"],
        "components": components,
    }
    manifest["typography_styles"] = [k for k in tokens["semantic"]["type"] if not k.startswith("$")]
    return manifest


MANIFEST_PATH = os.path.join(ROOT, "synapse.manifest.json")


def serialize(manifest):
    """The exact on-disk representation — keep in lockstep with main()'s json.dump call."""
    return json.dumps(manifest, ensure_ascii=False, indent=1)


def main():
    try:
        manifest = build(verbose=True)
    except SpecParseError as e:
        print(f"ERROR: {e}", file=sys.stderr)
        sys.exit(1)
    with open(MANIFEST_PATH, "w", encoding="utf-8") as f:
        f.write(serialize(manifest))
    print("wrote", MANIFEST_PATH, "-", len(manifest["components"]), "components")


if __name__ == "__main__":
    main()
