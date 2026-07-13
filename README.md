# Synapse

The design system for **AgentOS** (Enhans) — written as a machine-enforceable contract for
AI-driven UI generation, not an inspiration board.

**Start here → [`design.md`](design.md)** (the contract, authority order, hard rules, workflow).

| Layer | Where |
|---|---|
| Contract & governance | `design.md` |
| Tokens (source of truth) | `tokens/synapse.tokens.json` → generated `tokens/synapse.css` |
| Foundations · components (50) · recipes · patterns · AI patterns · content (KO/EN) · icons | `*.md` |
| Machine index for agents | `synapse.manifest.json` (built by `tools/build_manifest.py`) |
| Enforcement gate | `tools/validate.py` — `tokens` / `ui` / `page` modes |
| Component browser + sample pages | `preview.html` (open in a browser) |
| React + Storybook workspace | `storybook/` (see its README) |

## Quick checks

```bash
python3 tools/validate.py all                                # full gate
python3 tools/validate.py page examples/screen-intent.example.json
python3 tools/build_manifest.py                              # after any components.md change
```

Versioned by semver across the whole system; every change is in [`CHANGELOG.md`](CHANGELOG.md).
Contributions follow the one-way door rule (design.md §6): the system changes first, product UI second.
