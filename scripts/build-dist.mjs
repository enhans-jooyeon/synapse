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
import { readFileSync, writeFileSync, existsSync, statSync, rmSync, mkdirSync, cpSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const DIST = join(ROOT, 'dist');
const version = JSON.parse(readFileSync(join(ROOT, 'tokens/synapse.tokens.json'), 'utf8')).$version;

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

// 3. generate the slim CHANGELOG (released entries only: from first "## " release
//    header down to the "Internal pre-release history" divider; drop Unreleased).
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
writeFileSync(join(DIST, 'README.md'), `# Synapse — AgentOS design harness (v${version})

The machine-enforceable contract for generating AgentOS UI. This is the **curated team distribution** — generated from the design-system source; do not edit here (changes are made in the source repo and re-published on release).

## Point your LLM here

1. Load **\`synapse.manifest.json\`** first (the compact index), then **\`design.md\`** (the contract + hard rules).
2. Generate from the closed component set only — pull specs from \`components.md\`, \`ai-patterns.md\`, \`foundations.md\`, \`tokens/\`.
3. Use **\`docs/process/템플릿-PRD.md\`** as your generation prompt (fill it in, paste it, keep it as the review baseline).
4. Follow **\`docs/process/디자인-리뷰-프로토콜.md\`** for the generate → gate → review workflow.

## Enforce it

Wire **\`tooling/product-gates/\`** into your product repo's CI — the gate is green *before* design review (the harness owns compliance; humans review only judgment).

## Rules of the road

- The system is a closed set. A needed component/variant/token that doesn't exist is a **request to the design-system team**, never a local improvisation.
- EN is authoritative; \`*.ko.md\` are translations.
- Versioned by release: this bundle is **v${version}**. See \`CHANGELOG.md\`.
`);

console.log(`dist built: v${version} — ${copied} allowlisted path(s) + generated README.md + CHANGELOG.md → ./dist`);
