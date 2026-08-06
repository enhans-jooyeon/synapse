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
  synapse doctor                   Read-only bundle + environment health for harness consumers:
                                   split-bundle version check, staleness vs the source repo's
                                   latest release tag (degrades to a warn offline), manifest/
                                   tokens/schema integrity, gate runnability, Python floor.
                                   Exit 0 when no check FAILS (warns allowed), 1 on any FAIL.

Global flag: --json (position-independent) — machine envelopes instead of human text;
see the JSON CONTRACT block below. Example: synapse --json lookup modal

Reads synapse.manifest.json (the machine index) + tokens/synapse.css; wraps tools/validate.py.
Stdlib only. Exit code is non-zero on validation failure or a not-found lookup, so it can gate a pipeline.
"""
import json, os, sys, subprocess, difflib, re
from collections import Counter

# ------------------------------------------------------------- JSON CONTRACT
# With --json, EVERY line of stdout is a single JSON object (agents parse line-
# by-line; human-facing notes go to stderr). Exit codes are unchanged from human
# mode. Success envelopes carry a `type` discriminator — STABLE, append-only:
#
#   lookup.component        one component matched (by name or a unique keyword);
#                           fields: name, matched_by ("name"|"keyword"), keyword?,
#                           entry (the full manifest entry)
#   lookup.component.multi  several components share the name part / keyword;
#                           fields: query, matched_by, keyword?, matches
#                           ([{name, purpose}] — run lookup <name> for the full entry)
#   lookup.token            fields: token, usage
#   lookup.recipe           fields: id, name, see
#   lookup.archetype        fields: archetype, archetypes (the closed set)
#   validate.ok             fields: files (the intent paths that passed)
#   gate.ok                 (full gate passed)
#   list.components | list.recipes | list.archetypes | list.tokens
#                           fields: items (recipes: [{id, name}])
#   digest.report           fields: folder, screens_reviewed, corrections,
#                           harness_versions, signal, excluded, by_attribution,
#                           by_category, signal_by_category, ds_gap_candidates,
#                           schema_warnings
#   doctor.report           fields: checks ([{name, status, message, fix?}] with
#                           status one of "ok"|"warn"|"fail"), ok (true iff no
#                           check failed). Check failures are carried INSIDE this
#                           envelope (ok:false), never as an error envelope.
#                           EXIT / CI POLICY: doctor exits 0 when nothing FAILS —
#                           warns (e.g. merely stale vs the source repo, or the
#                           staleness probe being offline) still pass — and 1 when
#                           any check fails (split-bundle corruption, broken gate,
#                           unsupported Python). Gate CI on the exit code; branch
#                           per-check on `name` + `status`, never on messages.
#
# Error envelope: {"error": "<human message>", "code": "<CODE>", "suggestions": [...]}
# (failed validate/gate envelopes additionally carry `issues`: the gate's report lines).
# Codes are APPEND-ONLY — agents branch on `code`, NEVER on the message string:
#
#   ERR_NOT_FOUND       lookup matched nothing; suggestions = closest real
#                       components / tokens / recipes (same set human mode prints)
#   ERR_INVALID_INTENT  screen-intent failed page-mode validation
#   ERR_GATE_FAILED     the full contract gate (validate.py all) failed
#   ERR_UNKNOWN_KIND    list <kind> is not components|recipes|archetypes|tokens
#   ERR_NO_LEDGER       digest found no ledger folder / no correction blocks
#   ERR_BAD_ARGS        missing or unsupported subcommand/arguments (emitted
#                       before any side effects)
# ---------------------------------------------------------------------------


def _j(obj):
    """One machine envelope per stdout line (--json mode)."""
    print(json.dumps(obj, ensure_ascii=False))


def _jerr(code, msg, suggestions=None, extra=None):
    env = {"error": msg, "code": code, "suggestions": suggestions or []}
    if extra:
        env.update(extra)
    _j(env)

# Piped output (lookup | head) must not traceback: restore default SIGPIPE
# handling on platforms that have it. (2026-08-05, migration-test feedback era)
import signal as _signal
if hasattr(_signal, "SIGPIPE"):
    _signal.signal(_signal.SIGPIPE, _signal.SIG_DFL)

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MANIFEST_PATH = os.path.join(ROOT, "synapse.manifest.json")
VALIDATE = os.path.join(ROOT, "tools", "validate.py")
CSS = os.path.join(ROOT, "tokens", "synapse.css")
FEEDBACK = os.path.join(ROOT, "feedback")
TOKENS_JSON = os.path.join(ROOT, "tokens", "synapse.tokens.json")
SCHEMA = os.path.join(ROOT, "tools", "screen-intent.schema.json")
# doctor's staleness probe always asks the SOURCE repo (works from a dist bundle,
# which has no .git); keep in sync with docs/DISTRIBUTION.md if the repo moves.
SOURCE_REPO = "https://github.com/enhans-jooyeon/synapse.git"

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
    # manifest fields are parsed from components.md's slots: a single-paragraph
    # slot is a string, a bullet-list/table slot is a list of strings
    def emit(field, sep=" · "):
        v = entry.get(field)
        if not v:
            return
        print(f"  {field}: " + (v if isinstance(v, str) else sep.join(v)))

    print(f"COMPONENT  {name}")
    print(f"  purpose: {entry.get('purpose','')}")
    emit("variants")
    emit("sizes", sep=", ")
    emit("states")
    emit("a11y")
    emit("forbidden")
    for r in entry.get("key_rules", []):
        print(f"  • {r}")


def lookup(query, as_json=False):
    m = manifest()
    comps, recipes, archetypes = m["components"], m["recipes"], m["archetypes"]
    tokens = token_names()
    ql = query.strip().lower()

    def component_hit(hits, matched_by, keyword=None):
        """Render component matches — one full entry, or a light multi list."""
        if as_json:
            if len(hits) == 1:
                env = {"type": "lookup.component", "name": hits[0],
                       "matched_by": matched_by, "entry": comps[hits[0]]}
                if keyword:
                    env["keyword"] = keyword
                _j(env)
            else:
                env = {"type": "lookup.component.multi", "query": query,
                       "matched_by": matched_by,
                       "matches": [{"name": k, "purpose": comps[k].get("purpose", "")} for k in hits]}
                if keyword:
                    env["keyword"] = keyword
                _j(env)
            return 0
        if matched_by == "keyword":
            if len(hits) == 1:
                print(f"KEYWORD '{keyword}' → {hits[0]}")
                _print_component(hits[0], comps[hits[0]])
            else:
                print(f"KEYWORD '{keyword}' matches {len(hits)} components:")
                for k in hits:
                    print(f"  COMPONENT  {k} — {comps[k].get('purpose','')}")
        else:
            for k in hits:
                _print_component(k, comps[k])
        return 0

    # recipe id (R7) or name
    if re.fullmatch(r"[Rr]\d{1,2}", query.strip()):
        rid = "R" + query.strip()[1:]
        if rid in recipes:
            if as_json:
                _j({"type": "lookup.recipe", "id": rid, "name": recipes[rid], "see": "recipes.md"})
            else:
                print(f"RECIPE  {rid} · {recipes[rid]}  (see recipes.md)")
            return 0

    # archetype
    if ql in [a.lower() for a in archetypes]:
        if as_json:
            _j({"type": "lookup.archetype", "archetype": query.strip(), "archetypes": archetypes})
        else:
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
        return component_hit(hits, "name")

    # token
    nt = norm_token(query)
    if nt in tokens:
        if as_json:
            _j({"type": "lookup.token", "token": nt, "usage": f"var({nt})"})
        else:
            print(f"TOKEN  {nt}  — defined (use var({nt}))")
        return 0

    # keywords index (manifest `keywords` — cross-system names and synonyms,
    # parsed from components.md's **Keywords:** slots). An exact keyword match
    # beats the fuzzy fallback; shared keywords list every carrier.
    # Matching is separator-insensitive (2026-08-05, migration-test feedback):
    # old shadcn/Radix names arrive joined ("dropdownmenu", "togglegroup") while
    # the slots spell them with spaces — both sides normalize to bare letters,
    # so no second alias table is needed (the keywords slot stays the single source).
    squash = lambda s: "".join(c for c in s.lower() if c.isalnum())
    qs = squash(ql)
    kw_hits = [k for k, e in comps.items() if qs in {squash(w) for w in (e.get("keywords") or [])}]
    if kw_hits:
        return component_hit(kw_hits, "keyword", keyword=ql)

    # not found → closest across categories
    comp_near = difflib.get_close_matches(ql, [k.lower() for k in comps], n=3, cutoff=0.4)
    tok_near = difflib.get_close_matches(nt, tokens, n=3, cutoff=0.5)
    rec_near = difflib.get_close_matches(ql, [v.lower() for v in recipes.values()], n=2, cutoff=0.4)
    if as_json:
        _jerr("ERR_NOT_FOUND", f"'{query}' is not in the Synapse manifest",
              suggestions=comp_near + tok_near + rec_near)
        return 1
    print(f"NOT FOUND: '{query}' is not in the Synapse manifest.")
    if comp_near:
        print("  closest components: " + ", ".join(comp_near))
    if tok_near:
        print("  closest tokens: " + ", ".join(tok_near))
    if rec_near:
        print("  closest recipes: " + ", ".join(rec_near))
    if not (comp_near or tok_near or rec_near):
        print("  no close match — this may be a coverage gap (RC6): propose it, don't improvise.")
    return 1


def do_list(kind, as_json=False):
    m = manifest()
    if kind in ("component", "components"):
        if as_json:
            _j({"type": "list.components", "items": list(m["components"])}); return 0
        for k in m["components"]:
            print(k)
    elif kind in ("recipe", "recipes"):
        if as_json:
            _j({"type": "list.recipes",
                "items": [{"id": rid, "name": name} for rid, name in m["recipes"].items()]}); return 0
        for rid, name in m["recipes"].items():
            print(f"{rid} · {name}")
    elif kind in ("archetype", "archetypes"):
        if as_json:
            _j({"type": "list.archetypes", "items": m["archetypes"]}); return 0
        print("\n".join(m["archetypes"]))
    elif kind in ("token", "tokens"):
        if as_json:
            _j({"type": "list.tokens", "items": token_names()}); return 0
        print("\n".join(token_names()))
    else:
        if as_json:
            _jerr("ERR_UNKNOWN_KIND", f"unknown list kind '{kind}'",
                  suggestions=["components", "recipes", "archetypes", "tokens"])
            return 2
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


def digest(folder, as_json=False):
    folder = folder or FEEDBACK
    if not os.path.isdir(folder):
        if as_json:
            _jerr("ERR_NO_LEDGER", f"no ledger folder at {folder} — nothing to digest yet "
                  "(reviewers capture entries in PRs; collect merged blocks here, "
                  "see docs/process/correction-ledger.md)")
            return 1
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
        if as_json:
            _jerr("ERR_NO_LEDGER", f"no synapse-corrections blocks found in {folder}")
            return 1
        print(f"No synapse-corrections blocks found in {folder}.")
        return 1

    cats = Counter(e["category"] for e in all_entries)
    attrs = Counter(e["attribution"] for e in all_entries)
    signal = [e for e in all_entries if e["attribution"] in HARNESS_SIGNAL]
    sig_cats = Counter(e["category"] for e in signal)
    excluded = len(all_entries) - len(signal)

    if as_json:
        gaps = [c for c, n in sig_cats.most_common() if c in DS_GAP_CATEGORIES and n >= 2]
        _j({"type": "digest.report", "folder": folder,
            "screens_reviewed": len(screens), "corrections": len(all_entries),
            "harness_versions": sorted(versions),
            "signal": len(signal), "excluded": excluded,
            "by_attribution": dict(attrs), "by_category": dict(cats),
            "signal_by_category": dict(sig_cats),
            "ds_gap_candidates": [
                {"category": c, "count": sig_cats[c],
                 "example": next((e["note"] for e in signal if e["category"] == c and e["note"]), "")}
                for c in gaps],
            "schema_warnings": warnings})
        return 0

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


# ------------------------------------------------------------------- doctor
# Read-only health checks for harness consumers (Astryx doctor pattern: never
# mutates, every finding names its fix, the exit code is the contract).
# Policy: warn = degraded-but-usable (stale bundle, offline probe, EOL Python);
# fail = the harness cannot be trusted (split-bundle corruption, unparseable
# contract files, gate broken, Python below the verified floor).

def _semver(s):
    """'v2.1.0' / '2.1.0' → (2, 1, 0); anything else → None."""
    m = re.fullmatch(r"v?(\d+)\.(\d+)\.(\d+)", (s or "").strip())
    return tuple(int(x) for x in m.groups()) if m else None


def _fmt_v(t):
    return "v" + ".".join(str(n) for n in t)


def _json_version(path):
    """$version from a bundle JSON file → (version|None, error|None)."""
    try:
        return json.load(open(path, encoding="utf-8")).get("$version"), None
    except (OSError, ValueError) as e:
        return None, str(e)


def _latest_source_tag(timeout=5):
    """Highest vX.Y.Z release tag of SOURCE_REPO, or None when offline /
    git absent / no semver tags — the caller degrades to a warn."""
    try:
        proc = subprocess.run(["git", "ls-remote", "--tags", SOURCE_REPO],
                              capture_output=True, text=True, timeout=timeout)
    except (OSError, subprocess.TimeoutExpired):
        return None  # git not installed, or the network probe hung
    if proc.returncode != 0:
        return None
    tags = [_semver(m) for m in re.findall(r"refs/tags/(v\d+\.\d+\.\d+)$",
                                           proc.stdout, re.MULTILINE)]
    return max(tags) if tags else None


def doctor(as_json=False):
    checks = []

    def add(name, status, message, fix=None):
        c = {"name": name, "status": status, "message": message}
        if fix:
            c["fix"] = fix
        checks.append(c)

    # 1 · bundle-version — the bundle ships $version in TWO files; disagreement
    # means a partial copy/merge (split-bundle corruption), the worst state
    # because every other file pair may silently mismatch too.
    mv, merr = _json_version(MANIFEST_PATH)
    tv, terr = _json_version(TOKENS_JSON)
    if mv and tv and mv == tv:
        add("bundle-version", "ok", f"manifest and tokens agree on v{mv}")
    elif merr or terr or not mv or not tv:
        missing = "synapse.manifest.json" if (merr or not mv) else "tokens/synapse.tokens.json"
        add("bundle-version", "fail", f"cannot read $version from {missing}",
            fix="re-sync the whole bundle from the source repo (never copy files piecemeal)")
    else:
        add("bundle-version", "fail",
            f"split bundle: synapse.manifest.json says v{mv} but tokens/synapse.tokens.json says v{tv}",
            fix="re-sync the whole bundle from the source repo (never copy files piecemeal)")

    # 2 · staleness — local $version vs the source repo's highest release tag.
    # Offline / no git / no tags degrades to warn: staleness is advice, not
    # integrity, so it must never fail CI on an air-gapped runner.
    local = _semver(mv) or _semver(tv)
    latest = _latest_source_tag()
    if latest is None:
        add("staleness", "warn", "offline — staleness unknown",
            fix="re-run with network access (and git installed) to compare against source release tags")
    elif local is None:
        add("staleness", "warn",
            f"local $version unreadable — cannot compare against latest release {_fmt_v(latest)}",
            fix="fix bundle-version first")
    elif local < latest:
        add("staleness", "warn",
            f"you are behind: local {_fmt_v(local)}, latest {_fmt_v(latest)} — git pull",
            fix="git pull (see CHANGELOG.md for what changed between the two)")
    elif local > latest:
        add("staleness", "ok",
            f"local {_fmt_v(local)} ahead of latest release {_fmt_v(latest)} — unreleased source checkout")
    else:
        add("staleness", "ok", f"up to date with the latest release ({_fmt_v(latest)})")

    # 3 · manifest-parses — the machine index loads and has its load-bearing keys.
    try:
        m = json.load(open(MANIFEST_PATH, encoding="utf-8"))
        missing = [k for k in ("components", "never", "archetypes") if k not in m]
        if missing:
            add("manifest-parses", "fail",
                f"synapse.manifest.json loads but lacks {', '.join(missing)}",
                fix="regenerate: python3 tools/build_manifest.py (or re-sync the bundle)")
        else:
            add("manifest-parses", "ok",
                f"synapse.manifest.json OK ({len(m['components'])} components, "
                f"{len(m['never'])} never-rules, {len(m['archetypes'])} archetypes)")
    except (OSError, ValueError) as e:
        add("manifest-parses", "fail", f"synapse.manifest.json unreadable: {e}",
            fix="regenerate: python3 tools/build_manifest.py (or re-sync the bundle)")

    # 4 · tokens-css-present — the closed token surface exists and is plausibly
    # complete (the real bundle defines ~180 --sy-* custom properties).
    try:
        css = open(CSS, encoding="utf-8").read()
        defined = set(re.findall(r"(--sy-[a-z0-9-]+)\s*:", css))
        if len(defined) > 100:
            add("tokens-css-present", "ok",
                f"tokens/synapse.css defines {len(defined)} --sy-* variables")
        else:
            add("tokens-css-present", "fail",
                f"tokens/synapse.css defines only {len(defined)} --sy-* variables (expected >100 — truncated file?)",
                fix="re-sync tokens/synapse.css from the source repo")
    except OSError as e:
        add("tokens-css-present", "fail", f"tokens/synapse.css unreadable: {e}",
            fix="re-sync tokens/synapse.css from the source repo")

    # 5 · gate-runnable — the gate SHIPS WITH the contract; prove it actually
    # runs here by executing its cheapest full mode (tokens).
    if not os.path.isfile(VALIDATE):
        add("gate-runnable", "fail", "tools/validate.py is missing — the gate cannot run",
            fix="re-sync the bundle (a harness that references validate.py must contain validate.py)")
    else:
        try:
            proc = subprocess.run([sys.executable, VALIDATE, "tokens"],
                                  capture_output=True, text=True, timeout=60)
            if proc.returncode == 0:
                add("gate-runnable", "ok", "python3 tools/validate.py tokens exits 0")
            else:
                tail = (proc.stdout or proc.stderr).strip().splitlines()
                add("gate-runnable", "fail",
                    f"validate.py tokens exits {proc.returncode}"
                    + (f": {tail[-1]}" if tail else ""),
                    fix="run python3 tools/validate.py tokens for the full report")
        except (OSError, subprocess.TimeoutExpired) as e:
            add("gate-runnable", "fail", f"could not run validate.py: {e}",
                fix="check the python3 interpreter this doctor ran under")

    # 6 · intent-schema — the screen-intent schema parses (synapse validate and
    # SY109/SY110 read their vocabularies out of this file at run time).
    try:
        json.load(open(SCHEMA, encoding="utf-8"))
        add("intent-schema", "ok", "tools/screen-intent.schema.json parses")
    except (OSError, ValueError) as e:
        add("intent-schema", "fail", f"tools/screen-intent.schema.json unreadable: {e}",
            fix="re-sync tools/screen-intent.schema.json from the source repo")

    # 7 · python-version — verified hard floor is 3.7 (all tools parse as 3.6
    # syntax — no walrus/PEP-585 — but synapse.py and validate.py call
    # subprocess.run(capture_output=, text=), 3.7+ kwargs, and rely on insertion-
    # ordered dicts). 3.7/3.8 are EOL and untested here, so they warn.
    py = sys.version_info[:3]
    pys = ".".join(str(n) for n in py)
    if py < (3, 7):
        add("python-version", "fail",
            f"Python {pys} is below the verified floor 3.7 (subprocess capture_output/text kwargs)",
            fix="install Python 3.9+ and re-run")
    elif py < (3, 9):
        add("python-version", "warn",
            f"Python {pys} meets the 3.7 floor but is end-of-life and untested with the harness",
            fix="prefer Python 3.9+")
    else:
        add("python-version", "ok", f"Python {pys} (floor: 3.7; recommended: 3.9+)")

    ok = all(c["status"] != "fail" for c in checks)
    if as_json:
        _j({"type": "doctor.report", "checks": checks, "ok": ok})
        return 0 if ok else 1

    mark = {"ok": "✓", "warn": "△", "fail": "✗"}
    print(f"SYNAPSE DOCTOR  (bundle root: {ROOT})")
    for c in checks:
        line = f"  {mark[c['status']]} {c['name']} — {c['message']}"
        if c.get("fix"):
            line += f"  → {c['fix']}"
        print(line)
    counts = Counter(c["status"] for c in checks)
    print(f"{len(checks)} checks: {counts['ok']} ok · {counts['warn']} warn · {counts['fail']} fail"
          + (" — healthy (warns don't fail CI)" if ok else " — UNHEALTHY"))
    return 0 if ok else 1


def run_validate(args, mode, as_json=False):
    if mode == "page" and not args:
        if as_json:
            _jerr("ERR_BAD_ARGS", "validate requires a screen-intent path: validate <screen-intent.json>")
            return 2
        print("validate <screen-intent.json>")
        return 2
    if not as_json:
        return subprocess.call([sys.executable, VALIDATE, mode] + args)
    # --json: wrap the gate — its human report must not reach stdout
    proc = subprocess.run([sys.executable, VALIDATE, mode] + args,
                          capture_output=True, text=True)
    if proc.returncode == 0:
        _j({"type": "validate.ok", "files": args} if mode == "page" else {"type": "gate.ok"})
        return 0
    issues = [l for l in proc.stdout.splitlines() if l.strip()]
    summary = issues[-1] if issues else f"validator exited {proc.returncode}"
    _jerr("ERR_INVALID_INTENT" if mode == "page" else "ERR_GATE_FAILED",
          ("screen intent failed validation: " if mode == "page" else "contract gate failed: ") + summary,
          extra={"issues": issues[:-1] if issues else []})
    return proc.returncode


COMMANDS = ("lookup", "validate", "validate-intent", "gate", "list", "digest", "doctor")


def main(argv):
    # --json is global and position-independent; in that mode every stdout line
    # is one JSON envelope (see the JSON CONTRACT block above)
    as_json = "--json" in argv
    argv = [a for a in argv if a != "--json"]
    if not argv or argv[0] in ("-h", "--help", "help"):
        if as_json:
            _jerr("ERR_BAD_ARGS", "--json requires a subcommand (help output is human-only)",
                  suggestions=list(COMMANDS))
            return 2
        print(__doc__)
        return 0
    cmd, rest = argv[0], argv[1:]
    if as_json and cmd not in COMMANDS:   # reject before any side effects
        _jerr("ERR_BAD_ARGS", f"unknown command: {cmd}", suggestions=list(COMMANDS))
        return 2
    if cmd == "lookup":
        if not rest:
            if as_json:
                _jerr("ERR_BAD_ARGS", "lookup requires a query: lookup <component|recipe|token|archetype>")
                return 2
            print("lookup <component|recipe|token|archetype>")
            return 2
        return lookup(" ".join(rest), as_json=as_json)
    if cmd in ("validate", "validate-intent"):
        return run_validate(rest, "page", as_json=as_json)
    if cmd == "gate":
        return run_validate(rest, "all", as_json=as_json)
    if cmd == "list":
        return do_list(rest[0] if rest else "", as_json=as_json)
    if cmd == "digest":
        return digest(rest[0] if rest else "", as_json=as_json)
    if cmd == "doctor":
        if rest:  # doctor is deliberately argument-free (read-only, fixed check set)
            if as_json:
                _jerr("ERR_BAD_ARGS", "doctor takes no arguments")
                return 2
            print("doctor takes no arguments")
            return 2
        return doctor(as_json=as_json)
    print(f"unknown command: {cmd}\n")
    print(__doc__)
    return 2


if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))
