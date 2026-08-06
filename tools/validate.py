#!/usr/bin/env python3
"""Synapse contract validator — mechanizes the design.md §5 self-audit checklist.

Usage:
    python3 tools/validate.py tokens                 # validate the token source of truth
    python3 tools/validate.py ui FILE [FILE ...]     # lint generated UI (html/css)
    python3 tools/validate.py page INTENT.json       # validate a screen-intent declaration
    python3 tools/validate.py all                    # tokens + every .html in repo root + storybook component CSS

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
  SY015 E backdrop-filter is forbidden — overlays are opaque, no glassmorphism (foundations §6)
  SY016 E Hangul inside an Artific display element — foundations §2.1 (Artific is English-only; brand titles stay English in KO)
  SY017 E synapse.manifest.json stale vs a fresh parse of components.md, or components.md unparseable — run tools/build_manifest.py (mirrors the CI gate locally)
  SY019 E icon not in assets/icons/lucide-registry.json, off-scale size, or stroke != 1.5 — run tools/check_icons.py (icons.md)
  SY020 E tokens/synapse.css disagrees with tokens/synapse.tokens.json (per mode); W = a CSS var with no JSON origin — closes the TOKEN half of audit Defect 7
  SY021 E synapse.manifest.json key_rules contradict components.md prose (never-list vocabulary, token names, radius names) — closes the PROSE half of audit Defect 7
  SY022 E a stated component-count claim disagrees with reality — the "67 vs 68" class; checks four surfaces (components.md preamble, README.md, docs/DISTRIBUTION.md, storybook/package.json) against components.md's ## heading count and storybook/src/components
  SY024 E a component's **Props:** slot disagrees with its React implementation — the prop
        NAME SET in components.md must equal the `<Name>Props` type in
        storybook/src/components/<Name>/<Name>.tsx (deprecated props excluded); the spec
        is the API contract (adoption ruling #5, 2026-08-05)
  SY023 E/W z-index outside the two sanctioned vocabularies — floating layers take --sy-z-* tokens; local sibling ordering is a −1..2 literal inside an isolated stacking context (W if the file lacks `isolation: isolate`) — foundations §6, ratified 2026-08-05
  SY008 E reference to undefined --sy-* variable — tokens
  SY009 E raw box-shadow (not a --sy-shadow-* token) — foundations §6
  SY010 W line-height/font-size ratio < 1.4 in one declaration block — foundations §2.3.3
  SY011 E Hangul text outside a lang="ko" scope — foundations §9
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
SPACE_SCALE = {0, 1, 2, 4, 6, 8, 10, 12, 16, 20, 24, 28, 32, 40, 48, 64, 80, 96,
               128, 160, 192, 224, 256, 320, 384}
FONT_SCALE = {11, 12, 13, 14, 16, 18, 20, 24, 30, 36}
RADIUS_SCALE = {4, 6, 8, 10, 12, 16, 20, 24, 9999}  # 6 and 10 are control-optical exceptions to the 4px scale
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
    # Chart series vs background: 2.5:1 is a DOCUMENTED DEVIATION from WCAG 1.4.11 / Carbon / Cloudscape (3:1),
    # taken so warm hues stay bright rather than collapsing to olive. Identification is carried by labels,
    # legends and series filters, never colour alone. Will surface in a formal audit — see foundations 9.
    ("viz-1 on bg-page [chart policy 2.5:1]", "--sy-viz-1", "--sy-bg-page", 2.5),
    ("viz-2 on bg-page [chart policy 2.5:1]", "--sy-viz-2", "--sy-bg-page", 2.5),
    ("viz-3 on bg-page [chart policy 2.5:1]", "--sy-viz-3", "--sy-bg-page", 2.5),
    ("viz-4 on bg-page [chart policy 2.5:1]", "--sy-viz-4", "--sy-bg-page", 2.5),
    ("viz-5 on bg-page [chart policy 2.5:1]", "--sy-viz-5", "--sy-bg-page", 2.5),
    ("viz-6 on bg-page [chart policy 2.5:1]", "--sy-viz-6", "--sy-bg-page", 2.5),
    ("viz-7 on bg-page [chart policy 2.5:1]", "--sy-viz-7", "--sy-bg-page", 2.5),
    ("viz-8 on bg-page [chart policy 2.5:1]", "--sy-viz-8", "--sy-bg-page", 2.5),
    ("fg-primary on bg-page", "--sy-text-primary", "--sy-bg-page", 4.5),
    # Dedicated icon family (2026-07-30). Meaningful icons are non-text content: WCAG 1.4.11 asks 3:1.
    # icon-primary is the one optical override — one ramp step less extreme than fg-primary.
    ("icon-primary on bg-page [1.4.11 non-text]", "--sy-icon-primary", "--sy-bg-page", 3.0),
    ("icon-secondary on bg-page", "--sy-icon-secondary", "--sy-bg-page", 3.0),
    ("icon-tertiary on bg-page", "--sy-icon-tertiary", "--sy-bg-page", 3.0),
    ("icon-info on bg-page", "--sy-icon-info", "--sy-bg-page", 3.0),
    ("icon-success on bg-page", "--sy-icon-success", "--sy-bg-page", 3.0),
    ("icon-warning on bg-page", "--sy-icon-warning", "--sy-bg-page", 3.0),
    ("icon-danger on bg-page", "--sy-icon-danger", "--sy-bg-page", 3.0),
    ("icon-inverse on bg-inverse", "--sy-icon-on-inverse", "--sy-bg-inverse", 3.0),
    ("fg-secondary on bg-page", "--sy-text-secondary", "--sy-bg-page", 4.5),
    ("fg-secondary on bg-surface", "--sy-text-secondary", "--sy-bg-surface", 4.5),
    ("fg-secondary on bg-raised", "--sy-text-secondary", "--sy-bg-raised", 4.5),
    ("fg-secondary on bg-sunken", "--sy-text-secondary", "--sy-bg-sunken", 4.5),
    ("fg-link on bg-page", "--sy-text-link", "--sy-bg-page", 4.5),
    ("emphasis-fg on emphasis-surface", "--sy-emphasis-fg", "--sy-emphasis-surface", 4.5),
    ("ai-fg on ai-surface", "--sy-ai-fg", "--sy-ai-surface", 4.5),
    # Composer capability toggle ON (2026-08-03): the reallocated AI accent. azure.600 on azure.100.
    ("action-brand-fg-on-page on action-brand-bg-subtle", "--sy-action-brand-fg-on-page", "--sy-action-brand-bg-subtle", 4.5),
    ("action-brand-fg on ai-solid", "--sy-action-brand-fg", "--sy-ai-solid", 3.0),
    ("emphasis-fg-soft on bg-surface (non-text mark)", "--sy-emphasis-fg-soft", "--sy-bg-surface", 3.0),
    ("fg-primary on emphasis-surface", "--sy-text-primary", "--sy-emphasis-surface", 4.5),
    ("fg-primary on bg-selected", "--sy-text-primary", "--sy-bg-selected", 4.5),
    ("fg-link-inverse on bg-inverse", "--sy-text-link-on-inverse", "--sy-bg-inverse", 4.5),
    ("action-primary-fg on action-primary-bg", "--sy-action-primary-fg", "--sy-action-primary-bg", 4.5),
    # brand is a saturated blue as of 2026-07-30 (was the graphite point). All THREE fill
    # states are gated at full AA: white label, normal weight, no §9 solid-label deviation.
    ("action-brand-fg on action-brand-bg [AA]", "--sy-action-brand-fg", "--sy-action-brand-bg", 4.5),
    ("action-brand-fg on action-brand-bg-hover [AA]", "--sy-action-brand-fg", "--sy-action-brand-bg-hover", 4.5),
    ("brand-point-fg on brand-point [AA, still graphite]", "--sy-brand-point-fg", "--sy-brand-point", 4.5),
    # Disabled labels: WCAG 1.4.3 exempts disabled controls, so the floor here is 3:1 as a
    # self-imposed quality bar — the old system's destructive-disabled ran 1.89:1.
    # Two-axis Button (2026-07-30): tonal coloured styles, rest AND hover. The hover pairs are
    # gated because red.200 / blue.200 were tried first and failed AA (3.84 / 4.25) — the whole
    # reason these fills sit one ramp step lighter than status.*-bg.
    ("status-danger on secondary-danger-bg [tonal rest]", "--sy-status-danger", "--sy-action-secondary-danger-bg", 4.5),
    ("status-danger on secondary-danger-bg-hover [tonal hover]", "--sy-status-danger", "--sy-action-secondary-danger-bg-hover", 4.5),
    # brand is bright AZURE as of 2026-07-30 (was indigo). azure.500 was tuned to clear AA with
    # white at normal weight (4.57) rather than accept the §9 deviation the old #0A84FF required (3.65).
    ("secondary-brand-fg on secondary-brand-bg [tonal rest]", "--sy-action-secondary-brand-fg", "--sy-action-secondary-brand-bg", 4.5),
    ("secondary-brand-fg on secondary-brand-bg-hover [tonal hover]", "--sy-action-secondary-brand-fg", "--sy-action-secondary-brand-bg-hover", 4.5),
    ("brand-fg-on-page on bg-page [outline/ghost x brand]", "--sy-action-brand-fg-on-page", "--sy-bg-page", 4.5),
    # viz 5/6/7 now derive from the purple/teal/magenta ramps, so each tint/text pair is checkable
    # outline style: label on the page fill it opens to
    ("fg-primary on bg-page [outline default]", "--sy-text-primary", "--sy-bg-page", 4.5),
    ("status-danger on bg-page [outline destructive]", "--sy-status-danger", "--sy-bg-page", 4.5),
    ("fg-link on bg-page [outline brand]", "--sy-text-link", "--sy-bg-page", 4.5),
    ("fg-secondary on bg-page [ghost default]", "--sy-text-secondary", "--sy-bg-page", 4.5),
    ("action-danger-fg on status-danger-bg-solid", "--sy-action-danger-fg", "--sy-status-danger-bg-solid", 4.5),  # tightened 3.0 -> 4.5 on 2026-07-30: danger left the §9 solid-label deviation (red.400 -> red.500, 4.62:1 normal weight)
    ("status-info on status-info-bg", "--sy-status-info", "--sy-status-info-bg", 4.5),
    ("status-success on status-success-bg", "--sy-status-success", "--sy-status-success-bg", 4.5),
    ("status-warning on status-warning-bg", "--sy-status-warning", "--sy-status-warning-bg", 4.5),
    ("status-danger on status-danger-bg", "--sy-status-danger", "--sy-status-danger-bg", 4.5),
    ("status-success-inverse on bg-inverse", "--sy-status-success-on-inverse", "--sy-bg-inverse", 4.5),
    ("status-warning-inverse on bg-inverse", "--sy-status-warning-on-inverse", "--sy-bg-inverse", 4.5),
    # solid-label policy (foundations §9): success/warning solids accept >=3:1 by documented deviation
    ("on-solid on success-bg-solid [policy 3:1]", "--sy-text-on-solid", "--sy-status-success-bg-solid", 3.0),
    ("on-solid on warning-bg-solid [policy 3:1]", "--sy-text-on-solid", "--sy-status-warning-bg-solid", 3.0),
    ("on-solid on info-bg-solid", "--sy-text-on-solid", "--sy-status-info-bg-solid", 4.5),
    ("default focus ring on page [1.4.11 3:1]", "--sy-border-focus-input", "--sy-bg-page", 3.0),
    ("soft focus ring on page [1.4.11 3:1]", "--sy-border-focus-soft", "--sy-bg-page", 3.0),
    ("soft destructive ring on page [1.4.11 3:1]", "--sy-border-error-soft", "--sy-bg-page", 3.0),
    ("soft brand ring on page [1.4.11 3:1]", "--sy-action-brand-border-soft", "--sy-bg-page", 3.0),
    ("focus ring on page [1.4.11 3:1]", "--sy-border-focus", "--sy-bg-page", 3.0),
    ("destructive focus ring on page [1.4.11 3:1]", "--sy-border-error-hover", "--sy-bg-page", 3.0),
    ("brand focus ring on page [1.4.11 3:1]", "--sy-action-brand-border-hover", "--sy-bg-page", 3.0),
    ("danger-fg on danger-hover", "--sy-action-danger-fg", "--sy-status-danger-bg-solid-hover", 4.5),  # now red.600, 6.19:1
    ("status-danger-inverse on bg-inverse", "--sy-status-danger-on-inverse", "--sy-bg-inverse", 4.5),
    ("status-info-inverse on bg-inverse", "--sy-status-info-on-inverse", "--sy-bg-inverse", 4.5),
]

def parse_css_modes(css):
    """Extract {mode: {var: value}} from synapse.css, modelling the real cascade.

    Mode-INVARIANT declarations (space, radius, shadow, z, motion, type) live in
    plain `:root` blocks; only colour is themed. Reading just the two theme blocks
    made every invariant token look absent, so the base layer is merged in first.
    """
    base, light, dark = {}, {}, {}
    for sel, body in re.findall(r"([^{}]*)\{([^{}]*)\}", css):
        sel = sel.strip().splitlines()[-1].strip() if sel.strip() else ""
        decls = {v: val.strip() for v, val in re.findall(VAR_DECL, body)}
        if not decls:
            continue
        if "data-theme=\"dark\"" in sel:
            dark.update(decls)
        elif "data-theme=\"light\"" in sel:
            light.update(decls)
        elif sel == ":root":
            base.update(decls)
    return {"light": {**base, **light}, "dark": {**base, **dark}}

# --------------------------------------------------- SY020 CSS<->JSON parity
#
# Token names MAY contain an underscore (the sanctioned fractional spacing steps
# --sy-space-0_5 / 1_5 / 2_5). Every var-name pattern below therefore includes
# `_`; omitting it silently truncated `var(--sy-space-1_5)` to `--sy-space-1`,
# which is itself a real token, so SY008 passed on names that did not exist.
VAR_NAME = r"--sy-[a-z0-9_-]+"
VAR_DECL = r"(" + VAR_NAME + r")\s*:\s*([^;]+);"

# JSON group -> CSS variable prefix. Explicit by design: a guessed mapping would
# make the gate's coverage unknowable, which is the failure it exists to prevent.
# `missing` is the severity when a JSON token has no matching CSS variable.
PARITY_GROUPS = [
    (("semantic", "color"),               [],           "E"),
    (("semantic", "padding"),             ["padding"],  "E"),
    (("semantic", "radius"),              ["radius"],   "E"),  # containment-role tier (V1, 2026-08-05): inset/nested/tray/card/overlay/shell
    (("density", "control"),              ["control"],  "E"),
    (("density", "layout"),               [],           "E"),
    (("primitive", "space"),              ["space"],    "E"),
    (("primitive", "shadow"),             ["shadow"],   "E"),
    (("primitive", "z"),                  ["z"],        "E"),
    (("primitive", "motion", "duration"), ["duration"], "E"),
    (("primitive", "motion", "easing"),   ["ease"],     "E"),
    (("primitive", "radius"),             ["radius"],   "W"),  # a few radius primitives are internal (radius.10 backs control-md)
]
# Deliberately NOT covered, and why:
#   semantic.type      composite $value (family/size/lineHeight/weight) -> .sy-type-* utility
#                      classes, not single custom properties; a value comparison is not meaningful.
#   primitive.color    internal ramps; only reach CSS through semantic tokens.
#   primitive.font     surfaced as paired --sy-text-N / --sy-text-N-lh, a 1:many mapping.
# Primitives deliberately NOT exposed as CSS variables (they exist only to back a
# named token). Listed explicitly so "unexposed" is a decision, not an accident.
PARITY_INTERNAL = {"--sy-radius-10", "--sy-radius-6"}
PARITY_SKIP_PREFIXES = ("--sy-text-", "--sy-body-", "--sy-label-", "--sy-heading-",
                        "--sy-display-", "--sy-stat-", "--sy-code-", "--sy-micro-",
                        "--sy-caption-", "--sy-font-", "--sy-weight-")

def _norm(v):
    """Compare values ignoring hex case and whitespace inside functional notation."""
    return re.sub(r"\s+", "", str(v)).upper()

def _fmt_json_value(v):
    """Render a DTCG value the way synapse.css writes it.

    Not every token is a plain string: cubicBezier is stored as a 4-element array
    and must be compared against `cubic-bezier(...)`, or every easing token reads
    as drift.
    """
    if isinstance(v, list):
        return "cubic-bezier(" + ", ".join(str(x) for x in v) + ")"
    return v

def _deref_css(val, table, depth=0):
    """Follow `var(--sy-x)` aliases inside synapse.css.

    Some CSS tokens alias another token instead of inlining its value (e.g.
    --sy-padding-2xs: var(--sy-space-1)); comparing the literal text would
    report drift where the values agree.
    """
    if depth > 8 or not isinstance(val, str):
        return val
    m = re.fullmatch(r"var\(\s*(" + VAR_NAME + r")\s*\)", val.strip())
    if not m:
        return val
    nxt = table.get(m.group(1))
    return _deref_css(nxt, table, depth + 1) if nxt is not None else val

def check_token_parity(data, modes):
    """SY020 — tokens/synapse.css must agree with tokens/synapse.tokens.json.

    synapse.css is documented as generated but is hand-maintained, so the two can
    drift with a green gate: SY017 covers the manifest (now parsed from
    components.md), not the CSS. Three drifts of this class were found by hand in a
    single session (danger fill hover modes; border.error-hover and
    action.brand-border-hover missing their dark modes), plus the earlier
    control-height-xs case, which is audit Defect 7.
    """
    def deref(ref, mode, depth=0):
        """Resolve a {reference} IN A MODE.

        A referenced token may itself be mode-aware (the viz primitives and the
        text.* family are), so following $value alone reports the light value in
        dark mode and every alias looks like drift. The mode must propagate
        through each hop of the chain.
        """
        if not isinstance(ref, str) or depth > 8:
            return ref
        m = re.fullmatch(r"\{([^}]+)\}", ref.strip())
        if not m:
            return ref
        node = data
        for k in m.group(1).split("."):
            node = node.get(k, {}) if isinstance(node, dict) else {}
        if not isinstance(node, dict):
            return None
        modes_ext = node.get("$extensions", {}).get("synapse", {}).get("modes", {}) or {}
        val = modes_ext.get(mode, node.get("$value"))
        return deref(val, mode, depth + 1) if val is not None else None

    accounted = set()
    for group, prefix, missing_sev in PARITY_GROUPS:
        node = data
        for k in group:
            node = node.get(k, {}) if isinstance(node, dict) else {}
        stack = [([], node)]
        while stack:
            path, n = stack.pop()
            if not isinstance(n, dict):
                continue
            if "$value" in n:
                var = "--sy-" + "-".join(prefix + path)
                accounted.add(var)
                exts = n.get("$extensions", {}).get("synapse", {}).get("modes", {}) or {}
                for mode in ("light", "dark"):
                    css_val = modes.get(mode, {}).get(var)
                    if css_val is None:
                        if mode == "light" and var not in PARITY_INTERNAL:
                            report(missing_sev, "SY020", TOKENS_JSON, 0,
                                   f"{'.'.join(group + tuple(path))} has no {var} in synapse.css")
                        continue
                    want = _fmt_json_value(deref(exts.get(mode, n.get("$value")), mode))
                    if want is None or isinstance(want, dict):
                        continue
                    css_val = _deref_css(css_val, modes.get(mode, {}))
                    if _norm(want) != _norm(css_val):
                        report("E", "SY020", TOKENS_CSS, 0,
                               f"[{mode}] {var}: css {css_val} != json {want} "
                               f"({'.'.join(group + tuple(path))}"
                               f"{'' if exts else ' — no $extensions.synapse.modes, so $value applies to both modes'})")
            for k, v in n.items():
                if not k.startswith("$"):
                    stack.append((path + [k], v))

    # Reverse direction: a CSS variable with no JSON origin is the control-height-xs
    # case — the canonical source does not describe something the system renders.
    for var in sorted(modes.get("light", {})):
        if var in accounted or var.startswith(PARITY_SKIP_PREFIXES):
            continue
        report("W", "SY020", TOKENS_CSS, 0,
               f"{var} exists in synapse.css but no token in synapse.tokens.json maps to it")

def check_tokens():
    try:
        data = json.load(open(TOKENS_JSON))
    except Exception as e:
        report("E", "SY000", TOKENS_JSON, 0, f"tokens JSON unparseable: {e}")
        return
    # version lockstep (v6.31.1): tokens $version must equal the design.md header —
    # this drifted silently for 12 versions before being checked here; CI alone was not enough
    dm = open(os.path.join(ROOT, "design.md")).read()
    m = re.search(r"\*\*Version (\d+\.\d+\.\d+)", dm)
    if m and data.get("$version") != m.group(1):
        report("E", "SY000", TOKENS_JSON, 4,
               f"version lockstep broken: tokens $version {data.get('$version')} != design.md {m.group(1)}")
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
    check_token_parity(data, modes)
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
    return set(re.findall(r"(" + VAR_NAME + r")\s*:", css))

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
        if prop.endswith("backdrop-filter") and val.strip() != "none":
            report("E", "SY015", path, ln, f"backdrop-filter is forbidden — overlays are opaque, no glassmorphism (foundations §6) — got '{val[:40]}'")
        if prop == "letter-spacing" and val not in ("0", "normal", "inherit", "unset"):
            # SUPPRESSED when the file carries the sanctioned Hangul reset — a
            # `:lang(ko)` rule zeroing letter-spacing means the tracking is
            # Latin-scoped exactly as foundations §2.3 requires; warning anyway
            # trains people to ignore SY007 (a noisy gate gets switched off).
            if not re.search(r":lang\(ko\)[^{]*\{[^}]*letter-spacing:\s*0", text):
                report("W", "SY007", path, ln, "letter-spacing declared — must never apply to Hangul (add a `:lang(ko) { letter-spacing: 0 }` reset to suppress this warning)")
        if prop == "z-index":
            # SY023 (ratified 2026-08-05, foundations §6): two z vocabularies split by
            # element class. Floating/pinned layers → a --sy-z-* token. Local sibling
            # ordering → small integers (−1..2) INSIDE an isolated stacking context;
            # the isolation requirement is checked at file granularity (same trick as
            # SY007's :lang(ko) suppression): a literal without `isolation: isolate`
            # anywhere in the file warns. Anything else — 9999, Tailwind-scale numbers,
            # token values typed as literals — is an error: the fix is the scale.
            v = val.strip()
            if "var(--sy-z-" in v or v == "auto":
                pass
            elif re.fullmatch(r"-?[0-2]", v):
                if "isolation: isolate" not in text and "isolation:isolate" not in text:
                    report("W", "SY023", path, ln, f"local z-index {v} without `isolation: isolate` in the file — local stacking must be inside an isolated stacking context (foundations §6)")
            else:
                report("E", "SY023", path, ln, f"z-index {v} — floating layers take a --sy-z-* token (sticky 100 … tooltip 600); local sibling ordering is −1..2 inside an isolated context; nothing else is sanctioned")
        if prop == "box-shadow" and "var(--sy-shadow" not in val and val != "none":
            # sanctioned exemption: a zero-blur, zero-offset ring (inset OR outset) using a token is a
            # border substitute / focus ring, not elevation (foundations §6). Elevation needs blur → a shadow token.
            stripped = val[6:].lstrip() if val.startswith("inset ") else val
            is_ring = stripped.startswith("0 0 0 ") and "var(--sy-" in val
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
    for vm in re.finditer(r"var\(\s*(" + VAR_NAME + r")", text):
        if vm.group(1) not in defined:
            report("E", "SY008", path, line_of(vm.start()), f"undefined variable {vm.group(1)}")

class UILinter(HTMLParser):
    def __init__(self, path, defined):
        super().__init__(convert_charrefs=True)
        self.path, self.defined = path, defined
        self.lang_stack = ["en"]
        self.display_stack = [False]     # True while inside an Artific display element (SY016)
        self.region_stack = []          # (tag, primary_count)
        self.in_style = False
        self.in_script = False
        self.style_buf, self.style_line = [], 0

    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        self.lang_stack.append(a.get("lang", self.lang_stack[-1]))
        cls_tokens = a.get("class", "").split()
        is_display = any(t == "sy-display" or t.startswith("sy-type-display") for t in cls_tokens)
        self.display_stack.append(self.display_stack[-1] or is_display)
        if tag in ("section", "main"):
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
        if len(self.display_stack) > 1:
            self.display_stack.pop()
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
        if HANGUL.search(txt) and self.display_stack[-1]:
            report("E", "SY016", self.path, ln, f"Hangul in Artific display element (English-only): '{txt[:30]}'")
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
            # Blank out /* … */ comment CONTENTS (newlines preserved so line numbers
            # hold): documentation prose citing hex values ("the ramp jumps #FFFFFF →
            # #F4F4F6") is not a violation — three such false positives surfaced the
            # day storybook CSS came under the gate (2026-08-05).
            stripped = re.sub(r"/\*.*?\*/", lambda m: re.sub(r"[^\n]", " ", m.group(0)), text, flags=re.S)
            lint_css_text(stripped, path, lambda pos, t=stripped: t[:pos].count("\n") + 1, defined)
        else:
            UILinter(path, defined).feed(text)

# ---------------------------------------------------------------- page mode

ARCHETYPES = {"workbench", "object", "settings", "guided", "console", "home"}
SCHEMA_PATH = os.path.join(ROOT, "tools", "screen-intent.schema.json")

def check_page(path):
    """Validate a screen-intent declaration (SY1xx rules) against the manifest + contract.

    The intent schema (tools/screen-intent.schema.json) is CLOSED — additionalProperties
    is false at every object level — and this checker enforces it (SY110): unknown keys,
    including removed concepts like 'density', are REJECTED, not ignored. The allowed-key
    sets and the viewer_role enum are read from the schema file itself, so the vocabulary
    lives in exactly one place (adoption ruling #4, 2026-08-05)."""
    try:
        intent = json.load(open(path, encoding="utf-8"))
    except Exception as e:
        report("E", "SY100", path, 0, f"intent unparseable: {e}"); return
    manifest_path = os.path.join(ROOT, "synapse.manifest.json")
    manifest = json.load(open(manifest_path, encoding="utf-8"))
    known = set(manifest["components"].keys())
    schema = json.load(open(SCHEMA_PATH, encoding="utf-8"))
    props = schema["properties"]

    # SY110 — closed schema: no unknown keys at any object level
    def closed(obj, allowed, where):
        for k in obj:
            if k not in allowed:
                report("E", "SY110", path, 0,
                       f"{where}: unknown key '{k}' — the intent schema is closed "
                       f"(additionalProperties: false); allowed keys: {sorted(allowed)}. "
                       f"Removed concepts (e.g. 'density') are rejected, not ignored")
    if isinstance(intent, dict):
        closed(intent, set(props), "intent")

    arch = intent.get("archetype")
    if arch not in ARCHETYPES:
        report("E", "SY101", path, 0, f"archetype '{arch}' not in {sorted(ARCHETYPES)}"); return

    regions = intent.get("regions") or []
    if not regions:
        report("E", "SY102", path, 0, "no regions declared")
    region_allowed = set(props["regions"]["items"]["properties"])
    for r in regions:
        rid = r.get("id", "?")
        closed(r, region_allowed, f"region '{rid}'")
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
    closed(states, set(props["states"]["properties"]), "states")
    for s in ("empty", "loading", "error"):
        if states.get(s) is not True:
            report("E", "SY108", path, 0, f"states.{s} must be declared true — a screen without it is unfinished (design.md §4.5)")

    perms = intent.get("permissions") or {}
    closed(perms, set(props["permissions"]["properties"]), "permissions")
    role = perms.get("viewer_role")
    roles = props["permissions"]["properties"]["viewer_role"]["enum"]  # single source: the schema
    if not role:
        report("E", "SY109", path, 0, "permissions.viewer_role missing — screens generated without viewer context are unreviewable (patterns.md §6)")
    elif role not in roles:
        report("E", "SY109", path, 0,
               f"permissions.viewer_role '{role}' is not a real role — the closed set is "
               f"{roles} (clearance order Guest < Member < Manager < Owner < Admin, product-context.md)")

# ------------------------------------------------------------------- runner

def check_manifest():
    """SY017 — the committed manifest must equal a fresh build (mirrors the CI gate locally,
    so version bumps and spec edits can't drift the manifest past a green local run).

    build_manifest.py is a pure parser over components.md's labelled slots (adoption
    ruling #1, 2026-08-05) — no hardcoded component data — so the two failure modes here
    are real, not circular: a STALE committed manifest (spec edited, manifest not
    regenerated) or an UNPARSEABLE spec (SpecParseError: missing **Purpose:** slot,
    empty **Key rules** slot, or a typo'd bold slot label)."""
    import importlib.util
    spec = importlib.util.spec_from_file_location(
        "build_manifest", os.path.join(ROOT, "tools", "build_manifest.py"))
    bm = importlib.util.module_from_spec(spec)
    try:
        spec.loader.exec_module(bm)
        expected = bm.serialize(bm.build())
    except bm.SpecParseError as e:  # type: ignore
        report("E", "SY017", os.path.join(ROOT, "components.md"), 0,
               f"components.md is unparseable by tools/build_manifest.py — {e}")
        return
    except Exception as e:
        report("E", "SY017", os.path.join(ROOT, "synapse.manifest.json"), 0, f"could not build manifest: {e}")
        return
    actual = open(bm.MANIFEST_PATH, encoding="utf-8").read()
    if actual != expected:
        report("E", "SY017", bm.MANIFEST_PATH, 0,
               "synapse.manifest.json is stale — run: python3 tools/build_manifest.py && commit the result")

# ------------------------------------------- SY021 prose <-> manifest parity

COMPONENTS_MD = os.path.join(ROOT, "components.md")

# Vocabulary the never-list forbids (design.md §8, foundations §6). A manifest
# entry may only name these to NEGATE them; an unqualified assertion is an error.
FORBIDDEN_SURFACE_TERMS = {
    "glass": "glass / glassmorphism (overlays are opaque — foundations §6, SY015)",
    "scrimless": "a scrimless overlay where the spec places a bg.scrim backdrop",
    "backdrop-filter": "backdrop-filter (SY015)",
    "glassmorphism": "glassmorphism",
    "gradient": "gradients",
    "glow": "glow",
}
# Negation/qualification within the same clause makes the mention legitimate:
# "NOT glass", "glass retired", "faux-glass … opaque", "reduced-transparency → opaque",
# "glass over a scrim reads muddy" (the spec's rejection idiom — Modal, FollowUpPanel).
NEGATORS = ("opaque", "retired", "faux", "forbidden", "corrected", "reversed",
            "without any translucency", "no backdrop-filter", "frosted", "reads muddy")
# A prohibition is not an assertion: "no gradient/glow", "never glass".
PROHIBITION_RE = re.compile(r"\b(?:no|not|never|without|zero)\s+[\w/ .-]{0,24}$")

# Dot-notation token families that appear in both documents and are precise
# enough to compare as strings (ai.surface, bg.raised-2, border.overlay, …).
TOKEN_FAMILIES = ("ai", "bg", "border", "text", "action", "status", "emphasis",
                  "shadow", "meter", "icon", "glass", "brand")
TOKEN_RE = re.compile(r"\b(" + "|".join(TOKEN_FAMILIES) + r")\.([a-z0-9-]+)\b")
RADIUS_NAMES = {"none", "xs", "sm", "md", "lg", "xl", "2xl", "3xl", "full", "pill"}
RADIUS_RE = re.compile(r"\bradius[ :`.-]+([a-z0-9]+)\b", re.I)

def _clauses(text):
    """Split a key_rule into clauses so negation is judged locally, not per rule."""
    return [c.strip().lower() for c in re.split(r"[;·—()]|\. ", text) if c.strip()]

def _md_sections(md):
    """components.md '## Name' -> that entry's body text (lowercased)."""
    out, cur, buf = {}, None, []
    for line in md.splitlines():
        m = re.match(r"^## (.+)$", line)
        if m:
            if cur:
                out[cur] = "\n".join(buf).lower()
            cur, buf = m.group(1).strip(), []
        elif cur:
            buf.append(line)
    if cur:
        out[cur] = "\n".join(buf).lower()
    return out

def check_prose_manifest_parity():
    """SY021 — synapse.manifest.json key_rules must not contradict components.md.

    The prose half of audit Defect 7. HISTORY: build_manifest.py used to HARDCODE
    each entry's key_rules while SY017 compared the manifest against that same
    generator, so a hardcoded string could drift from the spec it summarises
    indefinitely with a green gate — six real contradictions (control-height-xs,
    and (2026-08-03) three entries still describing glass/scrimless overlays after
    the glass->opaque reversal) before this rule existed. As of adoption ruling #1
    (2026-08-05) the manifest is parsed from components.md's own labelled slots, so
    that circularity is gone; SY021 is KEPT deliberately: a **Key rules (machine
    index):** bullet is still hand-authored summary text that can contradict the
    prose entry it sits under, and this rule also guards the committed manifest
    file directly (belt to SY017's braces).

    Deliberately narrow. Only claims precise enough to compare mechanically are
    checked, because a noisy gate gets switched off, which is worse than no gate:
      1. never-list surface vocabulary asserted without negation  -> E
      2. a dot-notation token named in the manifest but absent from that
         component's prose section                                -> E
      3. a `radius <name>` claim whose name never appears in the prose -> E
    Numeric dimensions are NOT compared: the manifest abbreviates them freely
    ("760", "28px height") and matching them produced false positives.
    """
    if not os.path.exists(COMPONENTS_MD):
        return
    try:
        manifest = json.load(open(os.path.join(ROOT, "synapse.manifest.json"), encoding="utf-8"))
    except Exception as e:
        report("E", "SY021", COMPONENTS_MD, 0, f"cannot read synapse.manifest.json — {e}")
        return
    sections = _md_sections(open(COMPONENTS_MD, encoding="utf-8").read())
    mpath = os.path.join(ROOT, "synapse.manifest.json")

    for name, entry in (manifest.get("components") or {}).items():
        prose = sections.get(name)
        if prose is None:
            report("E", "SY021", mpath, 0,
                   f"manifest component '{name}' has no '## {name}' entry in components.md")
            continue
        rules = list(entry.get("key_rules") or []) + [entry.get("purpose") or ""]
        for rule in rules:
            for clause in _clauses(rule):
                # 1 — forbidden surface vocabulary, unless negated in the same clause
                for term, label in FORBIDDEN_SURFACE_TERMS.items():
                    hits = [mm.start() for mm in re.finditer(re.escape(term), clause)]
                    # glass.surface / glass.rim / glass.border are LIVE tokens (the
                    # opaque faux-frost family) — a token name is not a surface claim.
                    hits = [h for h in hits if not re.match(r"[a-z-]*\.", clause[h + len(term):])]
                    # a prohibition immediately before the term is legitimate
                    hits = [h for h in hits if not PROHIBITION_RE.search(clause[:h])]
                    if hits and not any(n in clause for n in NEGATORS):
                        report("E", "SY021", mpath, 0,
                               f"{name}: manifest asserts {label} — the never-list forbids it "
                               f"(design.md §8); prose is authoritative. Clause: '{clause[:70]}'")
                # 2 — token claims must be supported by the prose entry
                for fam, leaf in TOKEN_RE.findall(clause):
                    tok = f"{fam}.{leaf}"
                    if tok not in prose and tok.replace(".", "-") not in prose:
                        report("E", "SY021", mpath, 0,
                               f"{name}: manifest names token '{tok}' which does not appear in "
                               f"its components.md entry — one of the two is stale")
                # 3 — radius names must agree
                for rad in RADIUS_RE.findall(clause):
                    if rad.lower() not in RADIUS_NAMES:
                        continue  # not a radius name (e.g. "pill radius: primary + lg")
                    if f"radius `{rad}`" not in prose and f"radius {rad}" not in prose \
                       and f"radius.{rad}" not in prose and f"radius-{rad}" not in prose:
                        report("E", "SY021", mpath, 0,
                               f"{name}: manifest claims radius '{rad}' which its components.md "
                               f"entry never states — one of the two is stale")

# ------------------------------------------------- SY022 count-claim parity

def check_count_claims():
    """SY022 — mechanically-checkable count claims must match reality.

    The "67 vs 68" class: prose states a component count, the set changes, the number
    survives. Deliberately NARROW (SY021's philosophy — a noisy gate gets switched
    off): exactly four surfaces, each with one fixed phrase shape. Ground truth:
    M = the number of '## ' headings in components.md; N (the built seed) = the
    number of component directories under storybook/src/components."""
    md = open(COMPONENTS_MD, encoding="utf-8").read()
    heading_count = len(re.findall(r"(?m)^## ", md))
    sb_dir = os.path.join(ROOT, "storybook", "src", "components")
    built_count = len([d for d in os.listdir(sb_dir)
                       if os.path.isdir(os.path.join(sb_dir, d))]) if os.path.isdir(sb_dir) else 0

    def check_pair(fpath, n, m, phrase):
        if int(n) != built_count:
            report("E", "SY022", fpath, 0,
                   f"claims '{phrase}' but storybook/src/components has {built_count} "
                   f"component directories — update the claim to {built_count}")
        if int(m) != heading_count:
            report("E", "SY022", fpath, 0,
                   f"claims '{phrase}' but components.md has {heading_count} '##' entries "
                   f"— update the claim to {heading_count}")

    # 1. components.md preamble: "The N component entries"
    m = re.search(r"The (\d+) component entries", md)
    if m and int(m.group(1)) != heading_count:
        report("E", "SY022", COMPONENTS_MD, 0,
               f"preamble claims 'The {m.group(1)} component entries' but the file has "
               f"{heading_count} '##' entries — update the claim to {heading_count}")

    # 2. README.md: "`components.md` (N)" and "N-of-M seed"
    readme_path = os.path.join(ROOT, "README.md")
    if os.path.exists(readme_path):
        readme = open(readme_path, encoding="utf-8").read()
        m = re.search(r"`components\.md` \((\d+)\)", readme)
        if m and int(m.group(1)) != heading_count:
            report("E", "SY022", readme_path, 0,
                   f"claims '`components.md` ({m.group(1)})' but components.md has "
                   f"{heading_count} '##' entries — update the claim to {heading_count}")
        m = re.search(r"(\d+)-of-(\d+) seed", readme)
        if m:
            check_pair(readme_path, m.group(1), m.group(2), m.group(0))

    # 3 + 4. docs/DISTRIBUTION.md and storybook/package.json: "N of M components"
    for rel in (os.path.join("docs", "DISTRIBUTION.md"), os.path.join("storybook", "package.json")):
        fpath = os.path.join(ROOT, rel)
        if not os.path.exists(fpath):
            continue
        text = open(fpath, encoding="utf-8").read()
        for m in re.finditer(r"(\d+) of (\d+) components", text):
            check_pair(fpath, m.group(1), m.group(2), m.group(0))


# ------------------------------------------- SY024 spec <-> React props parity

SB_COMPONENTS = os.path.join(ROOT, "storybook", "src", "components")

# One own member of a TS interface body, at brace depth 0: `name?: type;`.
TS_PROP_RE = re.compile(r"^\s*(?:readonly\s+)?(?P<name>[A-Za-z_$][A-Za-z0-9_$]*)\s*\??\s*:")


def _impl_dir(component_name):
    """'## Input (text)' -> 'Input'. Headings may carry a qualifying parenthetical;
    the implementation directory is the bare name before it."""
    return re.sub(r"\s*\(.*\)$", "", component_name).strip()


def _tsx_prop_names(src, iface):
    """Own, non-deprecated property names declared by `export interface <iface> {…}`.

    Returns (names, error) — `error` is a string when the interface is absent, which is
    itself a finding (the spec claims a props contract the file does not expose).
    Deliberately own-members-only: `extends React.ButtonHTMLAttributes<…>` contributes
    DOM plumbing, not design-system API, and documenting it would be noise. A member
    whose preceding JSDoc carries `@deprecated` is EXCLUDED — deprecated shims (Button's
    v1 single-axis `variant`) exist to be removed, so the spec must not list them.
    """
    m = re.search(r"^export interface " + re.escape(iface) + r"\b[^{]*\{", src, re.M)
    if not m:
        return None, (f"no `export interface {iface}` in the file — the spec declares a "
                      f"Props contract the implementation does not expose")
    names, doc, depth, in_comment = [], [], 1, False
    for line in src[m.end():].splitlines():
        stripped = line.strip()
        if in_comment or stripped.startswith(("/*", "//", "*")):
            doc.append(stripped)
            in_comment = stripped.startswith("/*") and "*/" not in stripped \
                if not in_comment else "*/" not in stripped
            continue
        if depth == 1:
            pm = TS_PROP_RE.match(line)
            if pm:
                # A member's own JSDoc sits immediately above it; @deprecated shims are
                # excluded from the contract (they exist only to be removed).
                if not any("@deprecated" in d for d in doc):
                    names.append(pm.group("name"))
            if stripped:
                doc = []
        depth += sum(line.count(c) for c in "{([") - sum(line.count(c) for c in "})]")
        if depth <= 0:
            break
    return names, None


def check_props_parity():
    """SY024 — the **Props:** slot IS the React API contract.

    Motivation (adoption ruling #5): `storybook/Button` shipped the superseded
    single-axis `variant: primary|secondary|ghost|danger|brand` API for a week while
    components.md described the two-axis one, and nothing failed. A prose slot that
    merely *describes* props rots the same way. So: wherever an entry carries a Props
    slot AND storybook/src/components/<Name>/<Name>.tsx exists, the two prop-name sets
    must be EQUAL — every offence names both sides, so the fix is unambiguous
    (add the prop to the spec, or delete it from the code).

    Only the NAME SET is compared. Types and descriptions are prose the spec is allowed
    to state more strictly than TypeScript can (SY021's philosophy: a noisy gate gets
    switched off). Entries with no implementation carry no Props slot at all — that is
    the point, not a gap: inventing an API for an unbuilt component is design.md §6
    improvisation.
    """
    mpath = os.path.join(ROOT, "synapse.manifest.json")
    try:
        manifest = json.load(open(mpath, encoding="utf-8"))
    except (OSError, ValueError) as e:
        report("E", "SY024", mpath, 0, f"cannot read synapse.manifest.json — {e}")
        return
    for name, entry in (manifest.get("components") or {}).items():
        spec_props = entry.get("props")
        if not spec_props:
            continue
        d = _impl_dir(name)
        tsx = os.path.join(SB_COMPONENTS, d, d + ".tsx")
        if not os.path.isfile(tsx):
            report("E", "SY024", COMPONENTS_MD, 0,
                   f"{name}: has a **Props:** slot but no {os.path.relpath(tsx, ROOT)} — "
                   f"a Props slot exists only where the React implementation does "
                   f"(delete the slot, or land the component)")
            continue
        code_names, err = _tsx_prop_names(open(tsx, encoding="utf-8").read(), d + "Props")
        if err:
            report("E", "SY024", tsx, 0, f"{name}: {err}")
            continue
        spec_names = [p["name"] if isinstance(p, dict) else str(p) for p in spec_props]
        missing = [n for n in code_names if n not in set(spec_names)]      # code has, spec lacks
        extra = [n for n in spec_names if n not in set(code_names)]        # spec has, code lacks
        if missing:
            report("E", "SY024", COMPONENTS_MD, 0,
                   f"{name}: **Props:** is missing {missing} — declared by {d}Props in "
                   f"{os.path.relpath(tsx, ROOT)} but absent from the spec slot "
                   f"(the spec is the API contract: document it, or remove it from the code)")
        if extra:
            report("E", "SY024", tsx, 0,
                   f"{name}: **Props:** declares {extra}, which {d}Props in "
                   f"{os.path.relpath(tsx, ROOT)} does not implement "
                   f"(props are DERIVED from the .tsx — never invented ahead of it)")


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
        html = [os.path.join(ROOT, f) for f in os.listdir(ROOT) if f.endswith(".html")]
        # Adoption ruling #5 (2026-08-05, proposals/2026-08-05-astryx-adoption-rulings.md):
        # the React layer's component CSS carries the same tokens-only contract as shipped
        # HTML, so `all` lints storybook/src/components/**/*.css with the existing ui rules
        # (SY001 raw colors, SY002 off-scale values, SY015 backdrop-filter, ...) — making
        # the components' "the gate lints this file" headers true rather than aspirational.
        sb_root = os.path.join(ROOT, "storybook", "src", "components")
        sb_css = sorted(
            os.path.join(dirpath, f)
            for dirpath, _dirs, files in os.walk(sb_root)
            for f in files
            if f.endswith(".css")
        )
        check_ui(html + sb_css)
        check_manifest()
        check_prose_manifest_parity()
        check_count_claims()
        check_props_parity()
    errors = [i for i in issues if i[0] == "E"]
    warnings = [i for i in issues if i[0] == "W"]
    for sev, rule, path, line, msg in issues:
        print(f"{'ERROR ' if sev == 'E' else 'warn  '}{rule} {os.path.relpath(path, ROOT)}:{line} — {msg}")
    print(f"\n{len(errors)} error(s), {len(warnings)} warning(s)")
    sys.exit(1 if errors else 0)

if __name__ == "__main__":
    main()
