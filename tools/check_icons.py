#!/usr/bin/env python3
"""SY019 — every 24-viewBox icon resolves to the registry; stroke 1.5; sizes on-scale.
Catches hand-drawn glyphs, off-registry concepts, and one-concept-two-glyphs drift.
Excludes illustrations (foundations §8.1) and chart marks, which have their own rules.
"""
import re, os, json, sys, collections
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
REG = json.load(open(os.path.join(ROOT, "assets/icons/tabler-registry.json")))
KNOWN = {re.sub(r"\s", "", d) for v in REG["icons"].values() for d in re.findall(r'd="([^"]*)"', v["paths"])}
SIZES = set(REG["$sizes"])
FILES = ["preview.html", "migration/button-matrix.html", "app-generation/component-catalog.html"]

def main():
    errs, warns = [], []
    for rel in FILES:
        p = os.path.join(ROOT, rel)
        if not os.path.exists(p): continue
        s = open(p).read()
        # A. hand-drawn icon glyphs
        for m in re.finditer(r'<svg([^>]*viewBox="0 0 24 24"[^>]*)>(.*?)</svg>', s, re.S):
            b = re.sub(r"\s+", " ", m.group(2)).strip()
            if not b or "' +" in b or "${" in b: continue          # JS templates
            ds = re.findall(r'd="([^"]*)"', b)
            prim = re.search(r"<(circle|rect|ellipse|polyline|polygon)", b)
            if ds and all(re.sub(r"\s", "", d) in KNOWN for d in ds) and not prim: continue
            if prim and not ds: warns.append((rel, "SY019 W bare primitive in a 24-grid svg (dot/frame?) — verify it is not an icon", b[:70])); continue
            errs.append((rel, "SY019 E icon path not in the registry — hand-drawn or off-registry concept", b[:70]))
        # B. stroke width on icons
        for m in re.finditer(r'<svg[^>]*viewBox="0 0 24 24"[^>]*stroke-width="([0-9.]+)"', s):
            if m.group(1) != "1.5":
                errs.append((rel, f"SY019 E icon stroke-width {m.group(1)} (must be 1.5)", ""))
        # C. icon sizes on-scale
        for m in re.finditer(r'class="icon"[^>]*?width:(\d+)px', s):
            if int(m.group(1)) not in SIZES:
                errs.append((rel, f"SY019 E off-scale icon size {m.group(1)}px (allowed {sorted(SIZES)})", ""))
    for f, msg, ctx in errs: print(f"{f}: {msg} {ctx}")
    for f, msg, ctx in warns: print(f"{f}: {msg} {ctx}")
    print(f"\n{len(errs)} error(s), {len(warns)} warning(s)")
    return 1 if errs else 0

if __name__ == "__main__": sys.exit(main())
