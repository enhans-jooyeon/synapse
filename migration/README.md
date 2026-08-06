# `migration/` — two different things live in this folder

Read this before adding a file here, and before adding one to `scripts/dist.allowlist`. The folder holds **two unrelated bodies of work**, and only one of them ships to the team harness.

## 1. SHIPPED — the conversion guides (product-app migration, 2026-08-06 audit rulings)

These are written for a product engineer converting call sites, so they ship in the harness bundle and are listed individually in `scripts/dist.allowlist`. Index: `2026-08-06-audit-migration-guide.md`.

| File | Area |
|---|---|
| `2026-08-06-audit-migration-guide.md` | index — what the 9-test audit was, links to all seven guides, shared conventions |
| `color-token-snapping.md` | off-token colors → nearest `--sy-*` token, by semantic role (SY001/SY002) |
| `scale-snapping.md` | off-scale px → the closed font / radius / spacing scales (SY002) |
| `typography-tailwind-migration.md` | `leading-*` / `tracking-*` → type-style bundles (SY007/SY010) |
| `icon-sizing.md` | 14 → 12, and above 24px it is an illustration (SY019) |
| `shadow-triage.md` | ring / delete / `shadow-float-*` triage (SY009) |
| `motion-durations.md` | the four-value duration scale + the continuous-motion ruling (SY025) |
| `z-index-migration.md` | Tailwind `z-*` → the `--sy-z-*` layer contract (SY023) |

**Adding a new conversion guide?** Add its path to `scripts/dist.allowlist` individually — the directory is deliberately never allowlisted — and add a row above. A guide that is not in the allowlist is a 404 in the published harness, which is exactly how these eight sat unreachable until 2.4.0.

## 2. PRIVATE — the pre-1.0 shadcn migration's working papers

Everything else in this folder is the audit trail of the original shadcn → Synapse conversion: mapping tables, inventory diffs, naming proposals and generated review artifacts. They describe a migration that finished before 1.0, they name internal decisions and rejected options, and several are large generated HTML dumps. **They are maintainer-side and stay in the source repo.**

- Color/token maps and their verifier: color-token-map.md, color-token-map.README.md, color-token-map.csv, color-token-map.json, shadcn-token-map.csv, verify-token-map.py
- Component and variant working papers: component-inventory-diff.md, variant-decisions.md, replacement-rules.md, replacement-rules.csv, decisions.md
- Token restructure proposals: token-convention-audit.md, token-naming-proposal.md, token-restructure-krds.md
- Generated review artifacts (large HTML): button-matrix, component-token-mapping, shadcn-color-map, visual-diff

Do not add these to the allowlist. If a fact in one of them is genuinely consumer-facing, promote the *fact* into a spec or a conversion guide — do not ship the working paper.
