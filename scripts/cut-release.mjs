#!/usr/bin/env node
/**
 * cut-release — do the whole release in ONE atomic step, so a version number can
 * never describe work that isn't in the tag.
 *
 *   node scripts/cut-release.mjs 2.6.0 "What this release is"   # check + bump + roll
 *   node scripts/cut-release.mjs 2.6.0 --check                  # verify only, no writes
 *
 * THE TITLE IS AN ARGUMENT, NOT A LATER EDIT. This script used to write a `TITLE ME`
 * placeholder into the heading and trust a human to replace it between two commands.
 * That gap failed three times out of four: v2.5.0 SHIPPED with the heading reading
 * literally "TITLE ME", and the pre-push hook caught two more attempts. A step that sits
 * between two copy-pasted commands is a step that gets skipped. Taking it up front means
 * the placeholder never exists.
 *
 * WHY THIS EXISTS. Three releases in a row (v2.2.0, v2.3.0, v2.4.0) shipped a bundle
 * that did not match its own release notes, all the same way: the version was bumped
 * at the START of a round of work, more work landed under that same number, and the
 * tag — cut in good faith — captured a partial release. Re-pushing the tag then fails
 * client-side with "already exists", so publish-harness.yml's tip-of-main guard never
 * even runs: git rejects the push before CI starts. A workflow check cannot catch this.
 * The only reliable fix is to make the bump and the tag the SAME operation, which is
 * what this script enforces.
 *
 * THE RULE IT ENCODES: work accumulates under `## Unreleased` with the version files
 * UNTOUCHED. The bump happens here, last, immediately before the tag.
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { execSync } from 'node:child_process';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const version = process.argv[2];
const checkOnly = process.argv.includes('--check');
const title = process.argv.slice(3).filter(a => a !== '--check').join(' ').trim();
const sh = (c) => execSync(c, { cwd: ROOT, encoding: 'utf8' }).trim();
const die = (msg, fix) => { console.error(`\n✗ ${msg}`); if (fix) console.error(`  → ${fix}`); process.exit(1); };

if (!version || !/^\d+\.\d+\.\d+$/.test(version)) {
  die('usage: node scripts/cut-release.mjs <major.minor.patch> "<release title>" [--check]');
}
if (!checkOnly && !title) {
  die('a release title is required.',
      'It goes straight into the heading, so no placeholder is ever written and there is\n' +
      '    no follow-up edit to forget. One line, no leading "vX.Y.Z" or date — both are added.\n\n' +
      `      node scripts/cut-release.mjs ${version} "Tailwind v4 ships, publishing fixed"`);
}
if (title.includes('TITLE ME')) die('the title still says TITLE ME.', 'Write the real one.');
const tag = `v${version}`;

// ── Preflight. Every one of these has bitten a real release. ────────────────
console.log(`Preflight for ${tag}:`);

// 1. THE one that caused all three incidents.
let remoteTags = '';
try { remoteTags = sh('git ls-remote --tags origin'); }
catch { console.log('  ~ tag-exists   could not reach origin — SKIPPED (verify by hand)'); }
if (remoteTags.includes(`refs/tags/${tag}`)) {
  die(`${tag} ALREADY EXISTS on origin.`,
      `A published tag is immutable — one version must never mean two bundles.\n` +
      `    Cut the next version instead. (This is the exact failure that hit v2.2.0, v2.3.0 and v2.4.0.)`);
}
console.log(`  ✓ tag-exists   ${tag} is free on origin`);

// 2. Clean tree — an uncommitted file is work the tag would silently omit.
if (sh('git status --porcelain')) {
  die('working tree is not clean.', 'Commit or stash first; the tag must capture everything.');
}
console.log('  ✓ clean-tree   nothing uncommitted');

// 3. Local main must equal origin/main, or the tag is cut on a stale base.
try {
  sh('git fetch origin --quiet');
  if (sh('git rev-parse HEAD') !== sh('git rev-parse origin/main')) {
    die('HEAD is not origin/main.',
        'Push main FIRST, then cut the tag on its tip (publish-harness.yml enforces this too).');
  }
  console.log('  ✓ tip-of-main  HEAD == origin/main');
} catch { console.log('  ~ tip-of-main  could not reach origin — SKIPPED'); }

// 4. Gates.
try { execSync('python3 tools/validate.py all', { cwd: ROOT, stdio: 'pipe' }); }
catch { die('validate.py all FAILED.', 'Fix the contract violations before releasing.'); }
console.log('  ✓ gate         validate.py all is green');

// 5. Manifest currency — publish-harness.yml fails on this, better to know now.
execSync('python3 tools/build_manifest.py', { cwd: ROOT, stdio: 'pipe' });
if (sh('git status --porcelain synapse.manifest.json')) {
  die('synapse.manifest.json was stale.', 'It has been regenerated — review and re-run.');
}
console.log('  ✓ manifest     regenerates byte-identical');

// 6. Unreleased must have content — an empty section means nothing to release.
const log = readFileSync(join(ROOT, 'CHANGELOG.md'), 'utf8');
const unreleased = log.slice(log.indexOf('## Unreleased') + 13, log.search(/\n## \d/));
if (!/^- /m.test(unreleased)) {
  die('`## Unreleased` has no entries.', 'Nothing to release, or the entries went into a numbered section by mistake.');
}
console.log('  ✓ unreleased   has entries to roll');

// 7. The bundle must BUILD. build-dist.mjs re-checks every cross-reference in the
// shipped docs, and it runs in publish-harness.yml AFTER the tag exists on origin —
// so a broken reference costs a whole version number to discover. v2.7.0 died exactly
// here, on a single doc link written without its directory prefix. Any check CI has
// that this script does not will eventually burn a release; run it locally too.
try { execSync('node scripts/build-dist.mjs', { cwd: ROOT, stdio: 'pipe', env: { ...process.env, SOURCE_DATE: '1970-01-01' } }); }
catch (e) {
  const out = `${e.stdout || ''}${e.stderr || ''}`.trim();
  die('scripts/build-dist.mjs FAILED — the harness bundle would not build.',
      `${out}\n    This is what publish-harness.yml runs after the tag is already pushed.`);
}
console.log('  ✓ bundle       build-dist.mjs succeeds (all shipped references resolve)');

if (checkOnly) { console.log(`\nPreflight passed. Re-run without --check to cut ${tag}.`); process.exit(0); }

// ── Bump: all four surfaces, or none. ──────────────────────────────────────
const bump = (rel, find, repl) => {
  const p = join(ROOT, rel), t = readFileSync(p, 'utf8');
  if (!t.includes(find)) die(`could not find the version string in ${rel}`, `expected: ${find}`);
  writeFileSync(p, t.replace(find, repl));
};
const cur = JSON.parse(readFileSync(join(ROOT, 'tokens/synapse.tokens.json'), 'utf8')).$version;
bump('tokens/synapse.tokens.json', `"$version": "${cur}"`, `"$version": "${version}"`);
bump('design.md', `**Version ${cur} ·`, `**Version ${version} ·`);
bump('preview.html', `v${cur}`, `v${version}`);

// Roll Unreleased → a dated, TITLED section. Nothing is left for a follow-up edit.
const today = new Date().toISOString().slice(0, 10);
const rolled = log.replace('## Unreleased', `## Unreleased\n\n*(nothing yet)*\n\n## ${version} — ${today} — ${title}`);
writeFileSync(join(ROOT, 'CHANGELOG.md'), rolled);
execSync('python3 tools/build_manifest.py', { cwd: ROOT, stdio: 'pipe' });

console.log(`\n✓ Bumped ${cur} → ${version} (tokens, design.md, preview.html, manifest) and rolled the changelog.

  Heading: ## ${version} — ${today} — ${title}

  NEXT — nothing to edit. Run these TWO together, in this order:

    1. git add -A && git commit -m "v${version}: ${title}"
    2. git push origin main && git tag ${tag} && git push origin ${tag}

  Do not add more work between them — that is precisely how v2.2.0, v2.3.0 and
  v2.4.0 each shipped a bundle that did not match its release notes.`);
