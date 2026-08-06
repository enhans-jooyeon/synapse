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
// Typography is a BUNDLE, not three independent properties: a `.sy-type-*` style fixes
// size + line-height + weight (+ sanctioned Latin-only tracking) together — design.md hard
// rule 2. So `leading-*` / `tracking-*` are not "off-scale value" problems, they are
// *unbundling* problems, and the class form escaped SY007/SY010 entirely because those
// rules lex CSS declarations (2026-08-06, engineer's migration-test finding: 71 `leading-[…]`
// + ~353 `tracking-*` uncaught). Both are errors regardless of the value:
//   - tracking: letter-spacing must never reach Hangul (foundations §2.3); the type styles
//     already carry the one sanctioned tracking (heading-xl, Latin-only).
//   - leading: the paired line-height is a FLOOR that accommodates Hangul ascent/descent
//     ("NEVER tighten", foundations §2.3.3). `leading-tight` (1.25) is below the 1.4 floor
//     by construction; an arbitrary `leading-[Npx]` is unverifiable without its font-size.
// The real fix is the Tailwind theme (see tooling/product-gates/README.md): define fontSize
// entries as full [size, {lineHeight, letterSpacing, fontWeight}] bundles mirroring the type
// styles, and empty `letterSpacing`/`lineHeight` so these classes stop existing. This gate is
// the backstop for what the theme can't delete (arbitrary values, stray strings).
const TW_TRACKING = /\btracking-(?:tighter|tight|normal|wide|wider|widest|\[[^\]]+\])/;
const TW_LEADING = /\bleading-(?:none|tight|snug|normal|relaxed|loose|\d+|\[[^\]]+\])/;
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
      ['SY007', TW_TRACKING, 'tracking-* class — letter-spacing belongs to the type style (and must never reach Hangul); use a .sy-type-* / text-* bundle class'],
      ['SY010', TW_LEADING, 'leading-* class — the type style\'s line-height is a FLOOR that fits Hangul ascent/descent; never set it independently'],
    ]) {
      if (re.test(line)) {
        const hit = line.match(re)?.[0] ?? '';
        // Best-effort enrichment: if an arbitrary leading sits beside a px font-size on the
        // same element, compute the ratio so the message names the actual violation.
        let extra = '';
        if (rule === 'SY010') {
          const lh = hit.match(/leading-\[(\d+(?:\.\d+)?)px\]/);
          const fs = line.match(/text-\[(\d+(?:\.\d+)?)px\]/);
          if (lh && fs) {
            const r = (parseFloat(lh[1]) / parseFloat(fs[1]));
            extra = ` [ratio ${r.toFixed(2)}${r < 1.4 ? ' — below the 1.4 Hangul floor' : ''}]`;
          }
        }
        console.error(`ERROR ${rule} ${file}:${i + 1} — ${msg}${extra}: ${line.trim().slice(0, 80)}`);
        violations++;
      }
    }
  });
}
console.error(`\n${violations} violation(s)`);
process.exit(violations ? 1 : 0);
