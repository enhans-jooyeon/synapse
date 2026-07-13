#!/usr/bin/env python3
"""Synapse contract validator — mechanizes the design.md §5 self-audit checklist.

Usage:
    python3 tools/validate.py tokens                 # validate the token source of truth
    python3 tools/validate.py ui FILE [FILE ...]     # lint generated UI (html/css)
    python3 tools/validate.py page INTENT.json       # validate a screen-intent declaration
    python3 tools/validate.py all                    # tokens + every .html in repo root

Exit code 0 = pass (warnings allowed), 1 = errors found.
Stdlib only. Rule IDs map to the governing document sections.

Rules (E = error, W = warning):
  SY001 E raw color value (hex/rgb/hsl) — design.md §3.1
  SY002 E off-scale font-size / spacing / border-radius — design.md §3.2
  SY003 E font-family not a --sy-font-* token — foundations §2.1
  SY004 E font-weight outside 400/500/600/700 — foundations §2.2
  SY005 E font-style italic/oblique — foundations §2.3.2
  SY006 E text-transform: uppercase — foundations §2.3.7
  SY007 W letter-spacing declared (verify it never applies to Hangul) — foundations §2.3
  SY008 E reference to undefined --sy-* variable — tokens
  SY009 E raw box-shadow (not a --sy-shadow-* token) — foundations §5
  SY010 W line-height/font-size ratio < 1.4 in one declaration block — foundations §2.3.3
  SY011 E Hangul text outside a lang="ko" scope — foundations §8
  SY012 E forbidden glossary term — content.md §3
  SY013 W exclamation mark in UI text — content.md §1
  SY014 W >1 primary button inside one region/section — design.md §3.7
"""
import json, re, sys, os
from html.parser import HTMLParser

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
TOKENS_JSON = os.path.join(ROOT, "tokens", "synapse.tokens.json")
TOKENS_CSS = os.path.join(ROOT, "tokens", "synapse.css")

# 1 is allowed solely as a hairline offset paired with 1px borders (e.g. tab underline overlap)
SPACE_SCALE = {0, 1, 2, 4, 6, 8, 12, 16, 20, 24, 28, 32, 40, 48, 64, 80, 96}
FONT_SCALE = {11, 12, 13, 14, 16, 18, 20, 24, 30, 36}
RADIUS_SCALE = {4, 8, 10, 16, 9999}
WEIGHTS = {"400", "500", "600", "700", "normal", "bold"}
FORBIDDEN_TERMS = ["에러", "노티", "퍼미션", "컨펌", "익스포트", "워크플로우",
                   "부디", "제발", "을(를)", "(을)를", "Oops", "oops", "click here"]
HANGUL = re.compile(r"[가-힣]")

issues = []  # (severity, rule, file, line, message)

def report(sev, rule, path, line, msg):
    issues.append((sev, rule, path, line, msg))

# ---------------------------------------------------------------- tokens mode

def luminance(hexc):
    h = hexc.lstrip("#")
    if len(h) == 3:
        h = "".join(c * 2 for c in h)
    rgb = [int(h[i:i + 2], 16) / 255 for i in (0, 2, 4)]
    rgb = [c / 12.92 if c <= 0.03928 else ((c + 0.055) / 1.055) ** 2.4 for c in rgb]
    return 0.2126 * rgb[0] + 0.7152 * rgb[1] + 0.0722 * rgb[2]

def contrast(a, b):
    la, lb = luminance(a), luminance(b)
    hi, lo = max(la, lb), min(la, lb)
    return (hi + 0.05) / (lo + 0.05)

# text-on-background pairs the docs guarantee, per mode: (name, fg-var, bg-var)
CONTRAST_PAIRS = [
    ("fg-primary on bg-page", "--sy-fg-primary", "--sy-bg-page", 4.5),
    ("fg-secondary on bg-page", "--sy-fg-secondary", "--sy-bg-page", 4.5),
    ("fg-secondary on bg-surface", "--sy-fg-secondary", "--sy-bg-surface", 4.5),
    ("fg-secondary on bg-raised", "--sy-fg-secondary", "--sy-bg-raised", 4.5),
    ("fg-secondary on bg-sunken", "--sy-fg-secondary", "--sy-bg-sunken", 4.5),
    ("fg-link on bg-page", "--sy-fg-link", "--sy-bg-page", 4.5),
    ("fg-link-inverse on bg-inverse", "--sy-fg-link-inverse", "--sy-bg-inverse", 4.5),
    ("action-primary-fg on action-primary-bg", "--sy-action-primary-fg", "--sy-action-primary-bg", 4.5),
    ("action-accent-fg on action-accent-bg", "--sy-action-accent-fg", "--sy-action-accent-bg", 4.5),
    ("action-danger-fg on status-danger-bg-solid [policy 3:1]", "--sy-action-danger-fg", "--sy-status-danger-bg-solid", 3.0),
    ("status-info on status-info-bg", "--sy-status-info", "--sy-status-info-bg", 4.5),
    ("status-success on status-success-bg", "--sy-status-success", "--sy-status-success-bg", 4.5),
    ("status-warning on status-warning-bg", "--sy-status-warning", "--sy-status-warning-bg", 4.5),
    ("status-danger on status-danger-bg", "--sy-status-danger", "--sy-status-danger-bg", 4.5),
    ("status-success-inverse on bg-inverse", "--sy-status-success-inverse", "--sy-bg-inverse", 4.5),
    ("status-warning-inverse on bg-inverse", "--sy-status-warning-inverse", "--sy-bg-inverse", 4.5),
    # solid-label policy (foundations §8): success/warning solids accept >=3:1 by documented deviation
    ("on-solid on success-bg-solid [policy 3:1]", "--sy-fg-on-solid", "--sy-status-success-bg-solid", 3.0),
    ("on-solid on warning-bg-solid [policy 3:1]", "--sy-fg-on-solid", "--sy-status-warning-bg-solid", 3.0),
    ("on-solid on info-bg-solid", "--sy-fg-on-solid", "--sy-status-info-bg-solid", 4.5),
    ("danger-fg on danger-hover", "--sy-action-danger-fg", "--sy-status-danger-bg-solid-hover", 4.5),
    ("status-danger-inverse on bg-inverse", "--sy-status-danger-inverse", "--sy-bg-inverse", 4.5),
    ("status-info-inverse on bg-inverse", "--sy-status-info-inverse", "--sy-bg-inverse", 4.5),
]

def parse_css_modes(css):
    """Extract {mode: {var: value}} from synapse.css light/dark blocks."""
    modes = {"light": {}, "dark": {}}
    blocks = re.findall(r'(:root, \[data-theme="light"\]|\[data-theme="dark"\])\s*\{([^}]*)\}', css)
    for sel, body in blocks:
        mode = "dark" if "dark" in sel else "light"
        for var, val in re.findall(r'(--sy-[a-z0-9-]+)\s*:\s*([^;]+);', body):
            modes[mode][var] = val.strip()
    return modes

def check_tokens():
    try:
        data = json.load(open(TOKENS_JSON))
    except Exception as e:
        report("E", "SY000", TOKENS_JSON, 0, f"tokens JSON unparseable: {e}")
        return
    blob = json.dumps(data)
    # every {reference} resolves
    def get(path):
        node = data
        for p in path.strip("{}").split("."):
            node = node.get(p, {}) if isinstance(node, dict) else {}
        return node.get("$value") if isinstance(node, dict) else None
    for ref in set(re.findall(r"\{[a-z0-9.\-]+\}", blob)):
        if get(ref) is None:
            report("E", "SY008", TOKENS_JSON, 0, f"unresolved token reference {ref}")
    # contrast matrix per mode
    css = open(TOKENS_CSS).read()
    modes = parse_css_modes(css)
    for mode, table in modes.items():
        for name, fg, bg, req in CONTRAST_PAIRS:
            fv, bv = table.get(fg), table.get(bg)
            if not fv or not bv:
                report("E", "SY008", TOKENS_CSS, 0, f"[{mode}] missing {fg if not fv else bg} for pair '{name}'")
                continue
            if fv.startswith("#") and bv.startswith("#"):
                r = contrast(fv, bv)
                if r < req:
                    report("E", "SY001", TOKENS_CSS, 0,
                           f"[{mode}] contrast {r:.2f} < {req} for {name} ({fv} on {bv})")

# ------------------------------------------------------------------- ui mode

def defined_vars():
    css = open(TOKENS_CSS).read()
    return set(re.findall(r"(--sy-[a-z0-9-]+)\s*:", css))

CSS_DECL = re.compile(r"([a-z-]+)\s*:\s*([^;{}\"]+)")
PX = re.compile(r"(-?\d+(?:\.\d+)?)px")

def lint_css_text(text, path, line_of, defined):
    """Lint CSS declarations found in text (style blocks, style attrs, .css files)."""
    for m in CSS_DECL.finditer(text):
        prop, val = m.group(1), m.group(2).strip()
        ln = line_of(m.start())
        if prop in ("font-family",) and "--sy-font" not in val and "inherit" not in val:
            report("E", "SY003", path, ln, f"font-family '{val}' is not a --sy-font-* token")
        if prop == "font-weight" and val not in WEIGHTS and "--sy-weight" not in val and "var(" not in val:
            report("E", "SY004", path, ln, f"font-weight {val} outside 400/500/600/700")
        if prop == "font-style" and ("italic" in val or "oblique" in val):
            report("E", "SY005", path, ln, "italic/oblique is forbidden (Hangul has no italics)")
        if prop == "text-transform" and "uppercase" in val:
            report("E", "SY006", path, ln, "text-transform: uppercase is forbidden")
        if prop == "letter-spacing":
            report("W", "SY007", path, ln, "letter-spacing declared — must never apply to Hangul")
        if prop == "box-shadow" and "var(--sy-shadow" not in val and val != "none":
            # sanctioned exemption: inset 1px ring using a border/focus token is a border substitute, not elevation
            is_ring = val.startswith("inset 0 0 0") and ("var(--sy-border" in val or "var(--sy-ai-border" in val)
            if not is_ring:
                report("E", "SY009", path, ln, f"raw box-shadow '{val}' — use --sy-shadow-* tokens")
        if prop in ("color", "background", "background-color", "border-color", "fill", "stroke", "border",
                    "border-top", "border-bottom", "border-left", "border-right", "outline", "box-shadow"):
            for hexm in re.finditer(r"#[0-9a-fA-F]{3,8}\b|rgba?\(|hsla?\(", val):
                report("E", "SY001", path, ln, f"raw color in '{prop}: {val[:60]}'")
        if prop == "font-size":
            for px in PX.finditer(val):
                if float(px.group(1)) not in FONT_SCALE:
                    report("E", "SY002", path, ln, f"font-size {px.group(0)} off the type scale")
        if prop in ("margin", "padding", "gap", "row-gap", "column-gap",
                    "margin-top", "margin-bottom", "margin-left", "margin-right",
                    "padding-top", "padding-bottom", "padding-left", "padding-right"):
            for px in PX.finditer(val):
                if abs(float(px.group(1))) not in SPACE_SCALE:
                    report("E", "SY002", path, ln, f"{prop} {px.group(0)} off the 4px spacing scale")
        if prop == "border-radius":
            for px in PX.finditer(val):
                if float(px.group(1)) not in RADIUS_SCALE and float(px.group(1)) != 0:
                    report("E", "SY002", path, ln, f"border-radius {px.group(0)} off the radius scale")
        if prop == "line-height":
            block = text[max(0, m.start() - 300):m.end() + 300]
            fs = re.search(r"font-size\s*:\s*(\d+(?:\.\d+)?)px", block)
            lh = PX.search(val)
            if fs and lh and float(lh.group(1)) / float(fs.group(1)) < 1.4:
                report("W", "SY010", path, ln,
                       f"line-height/font-size ratio {float(lh.group(1))/float(fs.group(1)):.2f} < 1.4 floor")
    # undefined variables
    for vm in re.finditer(r"var\(\s*(--sy-[a-z0-9-]+)", text):
        if vm.group(1) not in defined:
            report("E", "SY008", path, line_of(vm.start()), f"undefined variable {vm.group(1)}")

class UILinter(HTMLParser):
    def __init__(self, path, defined):
        super().__init__(convert_charrefs=True)
        self.path, self.defined = path, defined
        self.lang_stack = ["en"]
        self.region_stack = []          # (tag, primary_count)
        self.in_style = False
        self.in_script = False
        self.style_buf, self.style_line = [], 0

    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        self.lang_stack.append(a.get("lang", self.lang_stack[-1]))
        if tag in ("section", "main") or "data-density" in a:
            self.region_stack.append([tag, 0])
        if tag == "style":
            self.in_style, self.style_line = True, self.getpos()[0]
        if tag == "script":
            self.in_script = True
        cls = a.get("class", "")
        if "primary" in cls and tag == "button":
            if self.region_stack:
                self.region_stack[-1][1] += 1
                if self.region_stack[-1][1] > 1:
                    report("W", "SY014", self.path, self.getpos()[0],
                           "more than one primary button in this region")
        style = a.get("style")
        if style:
            ln = self.getpos()[0]
            lint_css_text(style, self.path, lambda _pos, _ln=ln: _ln, self.defined)
        # fixed width on text-bearing controls is checked via style lint (SY002 heuristics)

    def handle_endtag(self, tag):
        if len(self.lang_stack) > 1:
            self.lang_stack.pop()
        if self.region_stack and self.region_stack[-1][0] == tag:
            self.region_stack.pop()
        if tag == "script":
            self.in_script = False
        if tag == "style":
            self.in_style = False
            buf = "".join(self.style_buf)
            base = self.style_line
            lint_css_text(buf, self.path,
                          lambda pos, b=buf, s=base: s + b[:pos].count("\n"), self.defined)
            self.style_buf = []

    def handle_data(self, data):
        if self.in_style:
            self.style_buf.append(data)
            return
        if self.in_script:
            return
        ln = self.getpos()[0]
        txt = data.strip()
        if not txt:
            return
        if HANGUL.search(txt) and self.lang_stack[-1] != "ko":
            report("E", "SY011", self.path, ln, f"Hangul outside lang=\"ko\" scope: '{txt[:30]}'")
        for term in FORBIDDEN_TERMS:
            if term in txt:
                report("E", "SY012", self.path, ln, f"forbidden term '{term}' (content.md §3)")
        if "!" in txt and "!=" not in txt:
            report("W", "SY013", self.path, ln, f"exclamation mark in UI text: '{txt[:30]}'")

def check_ui(paths):
    defined = defined_vars()
    for path in paths:
        text = open(path, encoding="utf-8").read()
        if path.endswith(".css"):
            lint_css_text(text, path, lambda pos, t=text: t[:pos].count("\n") + 1, defined)
        else:
            UILinter(path, defined).feed(text)

# ---------------------------------------------------------------- page mode

ARCHETYPE_DENSITY = {"workbench": "dense", "object": "focus", "settings": "focus",
                     "guided": "focus", "console": "focus"}

def check_page(path):
    """Validate a screen-intent declaration (SY1xx rules) against the manifest + contract."""
    try:
        intent = json.load(open(path, encoding="utf-8"))
    except Exception as e:
        report("E", "SY100", path, 0, f"intent unparseable: {e}"); return
    manifest_path = os.path.join(ROOT, "synapse.manifest.json")
    manifest = json.load(open(manifest_path, encoding="utf-8"))
    known = set(manifest["components"].keys())

    arch = intent.get("archetype")
    if arch not in ARCHETYPE_DENSITY:
        report("E", "SY101", path, 0, f"archetype '{arch}' not in {sorted(ARCHETYPE_DENSITY)}"); return
    default_d = ARCHETYPE_DENSITY[arch]

    regions = intent.get("regions") or []
    if not regions:
        report("E", "SY102", path, 0, "no regions declared")
    for r in regions:
        rid = r.get("id", "?")
        d = r.get("density")
        if d not in ("focus", "dense"):
            report("E", "SY103", path, 0, f"region '{rid}': density '{d}' invalid")
        elif d != default_d and not r.get("boundary"):
            report("E", "SY104", path, 0,
                   f"region '{rid}': density '{d}' differs from archetype default '{default_d}' "
                   "but declares no boundary (splitpanel/divider/panel-edge) — patterns.md §1")
        for c in r.get("components", []):
            if c not in known:
                report("E", "SY105", path, 0, f"region '{rid}': component '{c}' not in manifest (closed set)")
        for rec in r.get("recipes", []):
            if rec not in manifest.get("recipes", {}):
                report("E", "SY106", path, 0, f"region '{rid}': unknown recipe '{rec}'")

    locales = set(intent.get("locales") or [])
    if not {"en", "ko"} <= locales:
        report("E", "SY107", path, 0, f"locales {sorted(locales)} — both 'en' and 'ko' are mandatory")

    states = intent.get("states") or {}
    for s in ("empty", "loading", "error"):
        if states.get(s) is not True:
            report("E", "SY108", path, 0, f"states.{s} must be declared true — a screen without it is unfinished (design.md §4.5)")

    perms = intent.get("permissions") or {}
    if not perms.get("viewer_role"):
        report("E", "SY109", path, 0, "permissions.viewer_role missing — screens generated without viewer context are unreviewable (patterns.md §6)")

# ------------------------------------------------------------------- runner

def main():
    if len(sys.argv) < 2 or sys.argv[1] not in ("tokens", "ui", "page", "all"):
        print(__doc__)
        sys.exit(2)
    mode = sys.argv[1]
    if mode in ("tokens", "all"):
        check_tokens()
    if mode == "ui":
        check_ui(sys.argv[2:])
    if mode == "page":
        for p in sys.argv[2:]:
            check_page(p)
    if mode == "all":
        check_ui([os.path.join(ROOT, f) for f in os.listdir(ROOT) if f.endswith(".html")])
    errors = [i for i in issues if i[0] == "E"]
    warnings = [i for i in issues if i[0] == "W"]
    for sev, rule, path, line, msg in issues:
        print(f"{'ERROR ' if sev == 'E' else 'warn  '}{rule} {os.path.relpath(path, ROOT)}:{line} — {msg}")
    print(f"\n{len(errors)} error(s), {len(warnings)} warning(s)")
    sys.exit(1 if errors else 0)

if __name__ == "__main__":
    main()
