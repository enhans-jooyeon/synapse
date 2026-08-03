#!/usr/bin/env python3
"""Verify migration/color-token-map.csv against the live tokens.

WHY THIS EXISTS
    color-token-map.csv is the authoritative old->new colour mapping the FE
    codemod works from, so a stale `new_hex_light` becomes a wrong colour in the
    product. It is a migration artefact, so tools/validate.py does not lint it
    (migration/ legitimately carries raw hex to show old values) — nothing was
    comparing its target column to tokens/synapse.css.

    On 2026-07-31 that check was run by hand for the first time and found
    12 of 82 rows stale: both `action-brand-bg` rows still held the brief indigo
    step (#3155C6) that the azure re-hue superseded hours later, `brand-bg-hover`
    likewise, `danger-bg-solid-hover` predated the red.550 softening, and ALL
    EIGHT viz rows still held pre-rebuild values. Run this after any token change.

USAGE
    python3 migration/verify-token-map.py          # report only
    python3 migration/verify-token-map.py --fix    # rewrite stale values in place

Exit 0 = in sync, 1 = drift found.
"""
import os, re, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CSV = os.path.join(ROOT, "migration", "color-token-map.csv")
TOKENS_CSS = os.path.join(ROOT, "tokens", "synapse.css")

# Underscore is required: the sanctioned fractional spacing steps (--sy-space-0_5)
# are real token names, and omitting `_` silently truncates them.
VAR = r"--sy-[a-z0-9_-]+"


def live_light():
    """The light-mode value of every token, honouring the :root -> theme cascade."""
    css = open(TOKENS_CSS).read()
    base, light = {}, {}
    for sel, body in re.findall(r"([^{}]*)\{([^{}]*)\}", css):
        sel = sel.strip().splitlines()[-1].strip() if sel.strip() else ""
        decls = dict(re.findall(r"(" + VAR + r")\s*:\s*([^;]+);", body))
        if not decls:
            continue
        if 'data-theme="dark"' in sel:
            continue
        elif 'data-theme="light"' in sel:
            light.update(decls)
        elif sel == ":root":
            base.update(decls)
    return {k: v.strip() for k, v in {**base, **light}.items()}


def main():
    fix = "--fix" in sys.argv
    live = live_light()
    lines = open(CSV).read().split("\n")
    header = lines[0].split(",")
    try:
        ti, hi = header.index("new_sy_token"), header.index("new_hex_light")
    except ValueError:
        print("! unexpected header:", header)
        return 1

    drift, changed = [], 0
    for i, ln in enumerate(lines[1:], start=1):
        if not ln.strip():
            continue
        cells = ln.split(",")
        if len(cells) <= max(ti, hi):
            continue
        tok, claimed = cells[ti].strip(), cells[hi].strip()
        if not tok.startswith("--sy-") or not claimed.startswith("#"):
            continue
        actual = live.get(tok)
        if actual is None:
            drift.append((i + 1, tok, claimed, "TOKEN NO LONGER EXISTS"))
        elif actual.upper() != claimed.upper():
            drift.append((i + 1, tok, claimed, actual))
            if fix:
                cells[hi] = actual
                lines[i] = ",".join(cells)
                changed += 1

    if not drift:
        print("color-token-map.csv is in sync with tokens/synapse.css")
        return 0

    print(f"{len(drift)} stale row(s) in color-token-map.csv:\n")
    for line, tok, claimed, actual in drift:
        print(f"  L{line:<4} {tok:34} csv {claimed}  ->  live {actual}")
    if fix:
        open(CSV, "w").write("\n".join(lines))
        print(f"\n--fix applied: {changed} value(s) rewritten")
        return 0
    print("\nre-run with --fix to rewrite, or correct the rows by hand")
    return 1


if __name__ == "__main__":
    sys.exit(main())
