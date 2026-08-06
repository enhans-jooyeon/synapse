#!/usr/bin/env node
/**
 * SY001/SY002 backstop for the product repo: scan source for raw hex/rgb colors,
 * bare px literals, and Tailwind arbitrary values ([...]) in class strings.
 * Runs in CI as a hard fail. Complements Tailwind's token-only theme.
 *
 * Usage: node tooling/synapse-gates/check-raw-values.mjs  (argv[2] = a glob of ts/tsx/css files)
 */
import { readFileSync, globSync, statSync } from 'node:fs';
import { join } from 'node:path';
import process from 'node:process';

// A directory argument auto-expands to its source files; zero matches is a
// loud failure (exit 2), never a silent green. (2026-08-05, migration-test feedback)
let pattern = process.argv[2] ?? 'src/**/*.{ts,tsx,css}';
try { if (statSync(pattern).isDirectory()) pattern = join(pattern, '**/*.{ts,tsx,css}'); } catch {}
const files = globSync(pattern);
if (files.length === 0) { console.error(`No files matched: ${pattern}`); process.exit(2); }

const RAW_HEX = /#[0-9a-fA-F]{3,8}\b/;
const RAW_RGB = /\b(rgb|rgba|hsl|hsla)\(/;
const RAW_PX = /\b\d+(\.\d+)?px\b/;            // bare px literal
const TW_ARBITRARY = /-\[[^\]]+\]/;             // e.g. p-[13px], text-[#abc] — Tailwind arbitrary values always have a dash before the bracket; plain JS indexing (acc[key]) must not match (2026-08-05, migration-test feedback)
const TW_RAW_Z = /\bz-(?:[1-9]\d|\d{3,})\b/;    // Tailwind z classes at 10+ (z-10…z-50, z-9999): floating layers take the token classes (z-sticky…z-tooltip, mapped in the Tailwind theme); local sibling ordering is z-0/z-1/z-2 inside an isolated stacking context — foundations §6 / SY023 (ratified 2026-08-05)
const ALLOW = /synapse-allow/;                  // opt-out marker requires a harness ticket ref

let violations = 0;
for (const file of files) {
  const text = readFileSync(file, 'utf8');
  text.split('\n').forEach((line, i) => {
    if (ALLOW.test(line)) return;
    for (const [rule, re, msg] of [
      ['SY001', RAW_HEX, 'raw hex color'],
      ['SY001', RAW_RGB, 'raw rgb/hsl color'],
      ['SY002', RAW_PX, 'bare px literal (use a token)'],
      ['SY002', TW_ARBITRARY, 'Tailwind arbitrary value (use a token class)'],
      ['SY023', TW_RAW_Z, 'raw z-index class (floating layers: z-sticky…z-tooltip token classes; local ordering: z-0/1/2 + isolation)'],
    ]) {
      if (re.test(line)) {
        console.error(`ERROR ${rule} ${file}:${i + 1} — ${msg}: ${line.trim().slice(0, 80)}`);
        violations++;
      }
    }
  });
}
console.error(`\n${violations} violation(s)`);
process.exit(violations ? 1 : 0);
