#!/usr/bin/env node
/**
 * SY001/SY002 backstop for the product repo: scan source for raw hex/rgb colors,
 * bare px literals, and Tailwind arbitrary values ([...]) in class strings.
 * Runs in CI as a hard fail. Complements Tailwind's token-only theme.
 *
 * Usage: node tooling/synapse-gates/check-raw-values.mjs  (argv[2] = a glob of ts/tsx/css files)
 */
import { readFileSync } from 'node:fs';
import { globSync } from 'node:fs';
import process from 'node:process';

const pattern = process.argv[2] ?? 'src/**/*.{ts,tsx,css}';
const files = globSync(pattern);

const RAW_HEX = /#[0-9a-fA-F]{3,8}\b/;
const RAW_RGB = /\b(rgb|rgba|hsl|hsla)\(/;
const RAW_PX = /\b\d+(\.\d+)?px\b/;            // bare px literal
const TW_ARBITRARY = /\b[\w-]+\[[^\]]+\]/;      // e.g. p-[13px], text-[#abc]
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
