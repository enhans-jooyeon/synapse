#!/usr/bin/env python3
"""synapse — the Synapse harness CLI. Generation-time tools an agent calls while building AgentOS UI,
so it self-corrects against the contract instead of waiting for the gate to reject its output.

  synapse lookup <name>            Is X a real component / recipe / token / archetype? Print its rules;
                                   if not found, suggest the closest real ones (prevents off-manifest
                                   components (RC6) and off-token values (RC3) at generation time).
  synapse validate <intent.json>   Validate a screen-intent declaration (schema + page-mode checks).
  synapse gate [paths...]          Run the full contract gate (validate.py all).
  synapse list <kind>              List a closed set: components | recipes | archetypes | tokens.
  synapse digest [folder]          Roll up correction-ledger entries (default: feedback/) into a
                                   pattern report — what LLM UI generation keeps getting wrong, and
                                   which design-system elements the evidence says to add/change.
                                   This is the harness MEMORY element (maintainer-facing).

Reads synapse.manifest.json (the machine index) + tokens/synapse.css; wraps tools/validate.py.
Stdlib only. Exit code is non-zero on validation failure or a not-found lookup, so it can gate a pipeline.
"""
import json, os, sys, subprocess, difflib, re
from collections import Counter

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MANIFEST_PATH = os.path.join(ROOT, "synapse.manifest.json")
VALIDATE = os.path.join(ROOT, "tools", "validate.py")
CSS = os.path.join(ROOT, "tokens", "synapse.css")
FEEDBACK = os.path.join(ROOT, "feedback")

# Closed sets for the correction ledger (see docs/process/correction-ledger.md).
LEDGER_CATEGORIES = {
    "token", "component-provenance", "state-coverage", "permission-context",
    "voice-content", "primary-action", "hierarchy", "layout-alignment",
    "density", "character-drift", "interaction", "copy", "other",
}
LEDGER_ATTRIBUTIONS = {
    "llm-generation", "contract-gap", "gate-gap",
    "prompt-gap", "reviewer-preference", "requirement-change",
}
# Attributions that indicate a real, harness-actionable defect (excludes taste + product churn).
HARNESS_SIGNAL = {"llm-generation", "contract-gap", "gate-gap"}
# A repeated hit in these categories points at a missing/weak DS element rather than a one-off.
DS_GAP_CATEGORIES = {"component-provenance", "contract-gap", "state-coverage", "character-drift"}


def manifest():
    return json.load(open(MANIFEST_PATH, encoding="utf-8"))


def token_names():
    """The --sy-* custom properties defined in the generated CSS (the closed token surface)."""
    css = open(CSS, encoding="utf-8").read()
    return sorted(set(re.findall(r"--sy-[a-z0-9-]+", css)))


def norm_token(q):
    """Accept --sy-bg-sunken, sy-bg-sunken, bg-sunken, or bg.sunken → --sy-bg-sunken."""
    q = q.strip().replace(".", "-")
    if q.startswith("--sy-"):
        return q
    if q.startswith("sy-"):
        return "--" + q
    return "--sy-" + q


def _print_component(name, entry):
    print(f"COMPONENT  {name}")
    print(f"  purpose: {entry.get('purpose','')}")
    if entry.get("variants"):
        print("  variants: " + " · ".join(entry["variants"]))
    if entry.get("sizes"):
        print("  sizes: " + ", ".join(entry["sizes"]))
    for r in entry.get("key_rules", []):
        print(f"  • {r}")


def lookup(query):
    m = manifest()
    comps, recipes, archetypes = m["components"], m["recipes"], m["archetypes"]
    tokens = token_names()
    ql = query.strip().lower()

    # recipe id (R7) or name
    if re.fullmatch(r"[Rr]\d{1,2}", query.strip()):
        rid = "R" + query.strip()[1:]
        if rid in recipes:
            print(f"RECIPE  {rid} · {recipes[rid]}  (see recipes.md)")
            return 0

    # archetype
    if ql in [a.lower() for a in archetypes]:
        print(f"ARCHETYPE  {query}  — one of: {', '.join(archetypes)} (patterns.md §1)")
        return 0

    # component: exact key, or a sub-name inside a grouped/qualified key
    def key_matches(k):
        kl = k.lower()
        if ql == kl:
            return True
        parts = re.split(r"[·()/]| ", kl)  # split grouped "a · b" and qualified "input (text)"
        return ql in [p.strip() for p in parts if p.strip()]
    hits = [k for k in comps if key_matches(k)]
    if hits:
        for k in hits:
            _print_component(k, comps[k])
        return 0

    # token
    nt = norm_token(query)
    if nt in tokens:
        print(f"TOKEN  {nt}  — defined (use var({nt}))")
        return 0

    # not found → closest across categories
    print(f"NOT FOUND: '{query}' is not in the Synapse manifest.")
    comp_near = difflib.get_close_matches(ql, [k.lower() for k in comps], n=3, cutoff=0.4)
    tok_near = difflib.get_close_matches(nt, tokens, n=3, cutoff=0.5)
    rec_near = difflib.get_close_matches(ql, [v.lower() for v in recipes.values()], n=2, cutoff=0.4)
    if comp_near:
        print("  closest components: " + ", ".join(comp_near))
    if tok_near:
        print("  closest tokens: " + ", ".join(tok_near))
    if rec_near:
        print("  closest recipes: " + ", ".join(rec_near))
    if not (comp_near or tok_near or rec_near):
        print("  no close match — this may be a coverage gap (RC6): propose it, don't improvise.")
    return 1


def do_list(kind):
    m = manifest()
    if kind in ("component", "components"):
        for k in m["components"]:
            print(k)
    elif kind in ("recipe", "recipes"):
        for rid, name in m["recipes"].items():
            print(f"{rid} · {name}")
    elif kind in ("archetype", "archetypes"):
        print("\n".join(m["archetypes"]))
    elif kind in ("token", "tokens"):
        print("\n".join(token_names()))
    else:
        print("list <components|recipes|archetypes|tokens>")
        return 2
    return 0


BLOCK_RE = re.compile(r"```synapse-corrections\s*\n(.*?)```", re.DOTALL)


def parse_ledger_block(body):
    """Parse one fenced synapse-corrections block → (meta dict, [entry dicts], [warnings])."""
    meta, entries, warnings = {}, [], []
    for raw in body.splitlines():
        line = raw.strip()
        if not line:
            continue
        if line.startswith("-"):
            item = line[1:].strip()
            if item.lower() == "none":
                continue
            parts = [p.strip() for p in item.split("|")]
            if len(parts) < 4:
                warnings.append(f"malformed entry (need 4+ fields): {item!r}")
                continue
            cat, attr, sev, src = parts[0], parts[1], parts[2], parts[3]
            note = parts[4] if len(parts) > 4 else ""
            if cat not in LEDGER_CATEGORIES:
                warnings.append(f"unknown category {cat!r}")
            if attr not in LEDGER_ATTRIBUTIONS:
                warnings.append(f"unknown attribution {attr!r}")
            entries.append({"category": cat, "attribution": attr, "severity": sev,
                            "source": src, "note": note, "screen": meta.get("screen", "?")})
        elif ":" in line:
            k, v = line.split(":", 1)
            meta[k.strip()] = v.strip()
    for e in entries:
        e["screen"] = meta.get("screen", "?")
    return meta, entries, warnings


def _bar(n, total, width=24):
    fill = 0 if not total else round(width * n / total)
    return "█" * fill + "·" * (width - fill)


def digest(folder):
    folder = folder or FEEDBACK
    if not os.path.isdir(folder):
        print(f"No ledger folder at {folder}. Nothing to digest yet.")
        print("(Reviewers capture entries in PRs; collect merged blocks here — see")
        print(" docs/process/correction-ledger.md.)")
        return 1

    files = sorted(f for f in os.listdir(folder) if f.endswith((".md", ".txt")))
    all_entries, screens, warnings, versions = [], [], [], set()
    for fn in files:
        text = open(os.path.join(folder, fn), encoding="utf-8").read()
        for body in BLOCK_RE.findall(text):
            meta, entries, warns = parse_ledger_block(body)
            screens.append(meta.get("screen", fn))
            if meta.get("harness_version"):
                versions.add(meta["harness_version"])
            all_entries.extend(entries)
            warnings.extend(f"{fn}: {w}" for w in warns)

    if not screens:
        print(f"No synapse-corrections blocks found in {folder}.")
        return 1

    cats = Counter(e["category"] for e in all_entries)
    attrs = Counter(e["attribution"] for e in all_entries)
    signal = [e for e in all_entries if e["attribution"] in HARNESS_SIGNAL]
    sig_cats = Counter(e["category"] for e in signal)
    excluded = len(all_entries) - len(signal)

    print("SYNAPSE CORRECTION DIGEST")
    print(f"  folder: {folder}")
    print(f"  screens reviewed: {len(screens)}   corrections logged: {len(all_entries)}"
          + (f"   harness versions: {', '.join(sorted(versions))}" if versions else ""))
    print(f"  harness-actionable signal: {len(signal)}   excluded (taste/requirement-change): {excluded}")

    print("\nBY ATTRIBUTION (all entries)")
    for a, n in attrs.most_common():
        tag = "  <- signal" if a in HARNESS_SIGNAL else ""
        print(f"  {n:>3}  {_bar(n, len(all_entries))}  {a}{tag}")

    print("\nWHAT LLMs KEEP GETTING WRONG (signal only, by category)")
    if sig_cats:
        for c, n in sig_cats.most_common():
            flag = "  ***DS-gap candidate" if (c in DS_GAP_CATEGORIES and n >= 2) else ""
            print(f"  {n:>3}  {_bar(n, len(signal))}  {c}{flag}")
    else:
        print("  (no harness-actionable corrections yet)")

    gaps = [c for c, n in sig_cats.most_common() if c in DS_GAP_CATEGORIES and n >= 2]
    if gaps:
        print("\nCANDIDATE DESIGN-SYSTEM CHANGES (recurring ≥2 — take to the refinement register)")
        for c in gaps:
            ex = next((e["note"] for e in signal if e["category"] == c and e["note"]), "")
            print(f"  • {c} ×{sig_cats[c]}" + (f"  e.g. {ex}" if ex else ""))

    if warnings:
        print("\nSCHEMA WARNINGS (fix so entries stay comparable)")
        for w in warnings:
            print(f"  ! {w}")
    return 0


def run_validate(args, mode):
    if mode == "page" and not args:
        print("validate <screen-intent.json>")
        return 2
    return subprocess.call([sys.executable, VALIDATE, mode] + args)


def main(argv):
    if not argv or argv[0] in ("-h", "--help", "help"):
        print(__doc__)
        return 0
    cmd, rest = argv[0], argv[1:]
    if cmd == "lookup":
        if not rest:
            print("lookup <component|recipe|token|archetype>")
            return 2
        return lookup(" ".join(rest))
    if cmd in ("validate", "validate-intent"):
        return run_validate(rest, "page")
    if cmd == "gate":
        return run_validate(rest, "all")
    if cmd == "list":
        return do_list(rest[0] if rest else "")
    if cmd == "digest":
        return digest(rest[0] if rest else "")
    print(f"unknown command: {cmd}\n")
    print(__doc__)
    return 2


if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))
