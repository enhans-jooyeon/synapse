#!/usr/bin/env node
/**
 * build-dist — assemble the curated team-harness bundle from scripts/dist.allowlist.
 *
 * The full source repo (proposals, HANDOFF, audits, 6.x history, storybook internals)
 * stays private. This copies ONLY the allowlisted files into ./dist, then generates a
 * consumer README and a slim CHANGELOG (released versions only — no Unreleased, no 6.x).
 * The publish-harness workflow pushes ./dist to the separate team repo on a release tag.
 *
 * Run locally to preview:  node scripts/build-dist.mjs   (then inspect ./dist)
 */
import { readFileSync, writeFileSync, existsSync, statSync, rmSync, mkdirSync, cpSync, readdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const DIST = join(ROOT, 'dist');
const version = JSON.parse(readFileSync(join(ROOT, 'tokens/synapse.tokens.json'), 'utf8')).$version;

// Provenance stamp. In CI, publish-harness.yml exports SOURCE_SHA/SOURCE_DATE; locally
// we fall back to "local build" so a preview build is never mistaken for a release.
const SOURCE_SHA = process.env.SOURCE_SHA || 'local-build';
const SOURCE_DATE = process.env.SOURCE_DATE || new Date().toISOString().slice(0, 10);

// Paths a shipped doc may reference without shipping. Every entry needs a reason —
// an undocumented exception is how the harness shipped instructions to run a
// validator it didn't contain (the 1.0.2 defect this check exists to prevent).
const REF_EXCEPTIONS = new Set([
  'preview.html',            // design.md file map row — explicitly "reference only, not authority"; render stays in the source repo
  'feedback/',               // correction-ledger collection folder — ledger blocks are captured in product PRs; the collected folder is maintainer-side
  'docs/process/harness-refinement-register.md', // maintainer-facing refinement register, deliberately unshipped
  'scripts/build_icons.py',  // icon GENERATOR is maintainer tooling (needs the Tabler npm package); the registry it emits ships
  'radius.md',               // NOT a file — token dot-path (the md radius tier); regex false positive
  'ai/', 'gen/',             // NOT paths — branch-name prefixes cited in the review protocol
]);
// Prefix exceptions: any reference under these directories is allowed.
const REF_EXCEPTION_PREFIXES = [
  'proposals/', // design.md §6 governance — shipped specs CITE dated proposals as provenance; consumers file/read them in the source repo
];

// 1. clean staging dir
rmSync(DIST, { recursive: true, force: true });
mkdirSync(DIST, { recursive: true });

// 2. copy the allowlist
const allow = readFileSync(join(ROOT, 'scripts/dist.allowlist'), 'utf8')
  .split('\n').map(l => l.trim()).filter(l => l && !l.startsWith('#'));
let copied = 0;
for (const rel of allow) {
  const src = join(ROOT, rel);
  if (!existsSync(src)) { console.error(`MISSING allowlisted path: ${rel}`); process.exit(1); }
  const dest = join(DIST, rel);
  mkdirSync(dirname(dest), { recursive: true });
  cpSync(src, dest, { recursive: statSync(src).isDirectory() });
  copied++;
}

// 3. generate the slim CHANGELOG (released entries only: drop the Unreleased
//    section). The source changelog is already release-only since v1.0.0; the
//    legacy "Internal pre-release history" cut is kept as a harmless fallback.
const fullLog = readFileSync(join(ROOT, 'CHANGELOG.md'), 'utf8').split('\n');
const cut = fullLog.findIndex(l => /^##\s+Internal pre-release history/i.test(l));
const head = cut === -1 ? fullLog : fullLog.slice(0, cut);
const out = [];
let skipUnreleased = false;
for (const line of head) {
  if (/^##\s+Unreleased/i.test(line)) { skipUnreleased = true; continue; }
  if (skipUnreleased) { if (/^##\s+\d/.test(line)) skipUnreleased = false; else continue; }
  out.push(line);
}
writeFileSync(join(DIST, 'CHANGELOG.md'), out.join('\n').replace(/\n{3,}/g, '\n\n').trimEnd() + '\n');

// 4. generate the consumer README
// Dense never-list (adoption ruling #6a): the harness entrypoint dual-encodes the
// manifest's `never` array so an agent that reads only the README still sees the
// hard prohibitions. Read from the freshly copied bundle manifest, so README and
// manifest are two renderings of one source and cannot drift.
const never = JSON.parse(readFileSync(join(DIST, 'synapse.manifest.json'), 'utf8')).never;
const neverSection = `## Never (dense index — full list with rationale in design.md §8)

${never.map(n => `- ${n}`).join('\n')}
`;
writeFileSync(join(DIST, 'README.md'), `# Synapse — AgentOS design harness (v${version})

> **Provenance:** built from source \`${SOURCE_SHA}\` on ${SOURCE_DATE}. If the source repo has newer release tags than v${version}, this bundle is stale — \`git pull\` before generating.

The machine-enforceable contract for generating AgentOS UI. This is the **curated team distribution** — generated from the design-system source; do not edit here (changes are made in the source repo and re-published on release).

## Point your LLM here

1. Load **\`synapse.manifest.json\`** first (the compact index), then **\`design.md\`** (the contract + hard rules).
2. Generate from the closed component set only — pull specs from \`components.md\`, \`ai-patterns.md\`, \`foundations.md\`, \`tokens/\`.
3. Use **\`docs/process/prd-template.md\`** as your generation prompt (fill it in, paste it, keep it as the review baseline).
4. Follow **\`docs/process/design-review-protocol.md\`** for the generate → gate → review workflow.

## Run the gate (ships with this bundle — call it, don't remember it)

- \`python3 tools/validate.py all\` — full contract gate (tokens · manifest · UI rules)
- \`python3 tools/validate.py ui <files>\` — lint generated HTML/CSS artifacts
- \`python3 tools/synapse.py lookup <name>\` — is X a real component / token / recipe? (fuzzy; suggests the closest real ones)
- \`python3 tools/synapse.py validate <intent.json>\` — check a screen-intent declaration (\`tools/screen-intent.schema.json\`; worked example in \`examples/\`)

Stdlib-only Python 3 — no installs.

${neverSection}
## Enforce it

Wire **\`tooling/product-gates/\`** into your product repo's CI — the gate is green *before* design review (the harness owns compliance; humans review only judgment).

## Rules of the road

- The system is a closed set. A needed component/variant/token that doesn't exist is a **request to the design-system team**, never a local improvisation.
- EN is authoritative; \`*.ko.md\` are translations.
- Versioned by release: this bundle is **v${version}**. See \`CHANGELOG.md\`.
`);

// 5. self-consistency gate: no shipped markdown may reference a repo path that is
//    not in the bundle. At 1.0.2 the harness told agents to run `validate.py page`
//    while shipping no tools/ at all — this check makes that class of defect fatal.
//    CHANGELOG.md is skipped: it is history describing the source repo at points in
//    time, not instruction. Exceptions above must carry a written reason.
const mdFiles = [];
(function walk(dir) {
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    if (e.isDirectory()) walk(p);
    else if (e.name.endsWith('.md') && e.name !== 'CHANGELOG.md') mdFiles.push(p);
  }
})(DIST);
const REF_RE = /`([A-Za-z0-9_./-]+\.(?:md|json|py|css|html|mjs|js)|[A-Za-z0-9_-]+\/)`/g;
const broken = [];
for (const f of mdFiles) {
  const text = readFileSync(f, 'utf8');
  for (const m of text.matchAll(REF_RE)) {
    const ref = m[1];
    if (REF_EXCEPTIONS.has(ref)) continue;
    if (REF_EXCEPTION_PREFIXES.some(p => ref.startsWith(p))) continue;
    // resolve against the bundle root AND the referencing doc's own directory
    if (existsSync(join(DIST, ref)) || existsSync(join(dirname(f), ref))) continue;
    broken.push(`${f.slice(DIST.length + 1)} → \`${ref}\``);
  }
}
if (broken.length) {
  console.error(`REFERENCE CHECK FAILED — ${broken.length} shipped doc reference(s) do not resolve inside the bundle:`);
  for (const b of broken) console.error(`  ${b}`);
  console.error('Ship the referenced path, fix the doc, or add a REF_EXCEPTIONS entry WITH a reason.');
  process.exit(1);
}

console.log(`dist built: v${version} (${SOURCE_SHA.slice(0, 12)}, ${SOURCE_DATE}) — ${copied} allowlisted path(s) + generated README.md + CHANGELOG.md → ./dist; reference check: ${mdFiles.length} docs clean`);
