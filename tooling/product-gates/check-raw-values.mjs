#!/usr/bin/env node
/**
 * SY001/SY002 backstop for the product repo: scan source for raw hex/rgb colors,
 * bare px literals, and Tailwind arbitrary values ([...]) in class strings — plus the
 * Tailwind CLASS forms of rules validate.py can only see as CSS declarations: z-index
 * (SY023), tracking/leading (SY007/SY010), box-shadow (SY009), duration (SY025).
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
// SY009 — box-shadow is not a free property. Synapse is BORDERS-FIRST (foundations §6):
// in-flow hierarchy is 1px borders + background steps, and shadows are reserved for things
// that genuinely float. Tailwind's own `shadow-*` scale and arbitrary `shadow-[…]` both
// bypass `--sy-shadow-*` entirely, and SY009 in validate.py only lexes the CSS declaration
// form (`box-shadow:`), so the class form was invisible — the 2026-08-06 migration test
// found 100 arbitrary `shadow-[…]`, 23 raw inline `boxShadow`, and 160 `shadow-sm/md/lg/xl`.
// The fix is not "pick the nearest token": June's 2026-08-06 ruling (adopting the engineer's
// triage) classifies each call site by the ELEMENT'S ROLE first —
//   • RING   — `0 0 0 Npx` with blur 0 is not elevation at all; it is the ring that
//              foundations §6 already sanctions as an exception (inset border-substitute or
//              outset focus ring). Machine-decidable: blur component is 0. Use a ring, at
//              full token strength, never a `--sy-shadow-*`.
//   • STATIC — static cards, chart frames, panels: DELETE the shadow (borders-first), or
//              promote the surface to a genuinely elevated one (Card `elevated`).
//   • FLOAT  — menus, popovers, tooltips, dialogs, drawers, toasts: snap to the nearest
//              `--sy-shadow-*` step (xs · sm · md · lg · xl).
// Arbitrary `shadow-[…]` also trips SY002 as a Tailwind arbitrary value; that is intentional
// and matches how `leading-[…]` already double-reports — SY009 is the one that names the fix.
// SY009, completed by the 2026-08-06 naming ruling. The token-sourced scale is PREFIXED
// (`shadow-float-xs…xl`, see tailwind.synapse.cjs), so the rule is now an allowlist rather
// than an enumeration of Tailwind's defaults: ANY `shadow-*` class that is not the sanctioned
// prefixed form is a violation. That closes three holes the enumeration left — `shadow-xs`
// and bare `shadow` were unflagged despite `xs` being a token name, and a correctly-migrated
// product emitting `shadow-lg` from a same-named token scale would have been flagged forever.
// `drop-shadow-*` is a CSS-filter utility with no Synapse token behind it: always a violation.
const TW_SHADOW = /(?<!drop-)\bshadow(?!-float-(?:xs|sm|md|lg|xl)\b)(?:-[a-z0-9[\]()#.,%_-]+)?\b/;
const TW_DROP_SHADOW = /\bdrop-shadow(?:-[a-z0-9[\]()#.,%_-]+)?\b/;
// SY025 — off-scale transition duration. foundations §7 closes motion duration to FOUR values:
// instant 100 · fast 150 · base 200 · slow 300 (`--sy-duration-*`). Tailwind's `duration-<n>`
// utilities are a different scale (75/300/500/700/1000…) and arbitrary `duration-[…]` is
// unbounded. Ruling 2026-08-06 (June): `duration-500` → 300, `duration-120` → 100,
// `duration-180` → 200 — snap, do not add a token; the scale stays closed. The negative
// lookahead means on-scale values (100/150/200/300) pass untouched.
// Easing is NOT covered here, by ruling (2026-08-06): continuous/looping animation is outside
// the transition scale's jurisdiction (foundations §7), so `linear` and loop periods are
// permitted for `infinite` animation. A line declaring an infinite animation is therefore
// skipped by SY025 — the scale governs transitions, and a spinner is not a transition.
const TW_DURATION = /\bduration-(?!(?:100|150|200|300)\b)\d+\b/;
const TW_DURATION_ARBITRARY = /\bduration-\[[^\]]+\]/;
const ALLOW = /synapse-allow/;                  // opt-out marker requires a harness ticket ref

let violations = 0;
for (const file of files) {
  const text = readFileSync(file, 'utf8');
  text.split('\n').forEach((line, i) => {
    if (ALLOW.test(line)) return;
    // Continuous motion exemption (foundations §7, ruled 2026-08-06): a looping animation
    // legitimately carries `linear` and an off-scale period. Only duration rules are relaxed.
    const isLoop = /\binfinite\b/.test(line);
    for (const [rule, re, msg] of [
      ['SY001', RAW_HEX, 'raw hex color'],
      ['SY001', RAW_RGB, 'raw rgb/hsl color'],
      ['SY002', RAW_PX, 'bare px literal (use a token)'],
      ['SY002', TW_ARBITRARY, 'Tailwind arbitrary value (use a token class)'],
      ['SY023', TW_RAW_Z, 'raw z-index class (floating layers: z-sticky…z-tooltip token classes; local ordering: z-0/1/2 + isolation)'],
      ['SY007', TW_TRACKING, 'tracking-* class — letter-spacing belongs to the type style (and must never reach Hangul); use a .sy-type-* / text-* bundle class'],
      ['SY010', TW_LEADING, 'leading-* class — the type style\'s line-height is a FLOOR that fits Hangul ascent/descent; never set it independently'],
      ['SY009', TW_SHADOW, 'un-tokenized shadow class — the sanctioned scale is `shadow-float-xs…xl` (prefixed so it cannot collide with Tailwind\'s defaults). Triage by the element\'s role: blur-0 `0 0 0 Npx` is a RING (foundations §6 exception, not elevation) · static card/chart → delete the shadow (borders-first) or promote to an elevated surface · floating menu/popover/tooltip → `shadow-float-*`'],
      ['SY009', TW_DROP_SHADOW, 'drop-shadow-* — a CSS-filter shadow with no Synapse token behind it; elevation is box-shadow on floating layers only (foundations §6)'],
      ...(isLoop ? [] : [['SY025', TW_DURATION, 'off-scale transition duration — the scale is 100/150/200/300 (--sy-duration-instant/fast/base/slow, foundations §7); snap to the nearest step (500→300, 180→200, 120→100). No token is added for an off-scale value'],
      ['SY025', TW_DURATION_ARBITRARY, 'arbitrary duration-[…] — the duration scale is closed at 100/150/200/300 (--sy-duration-instant/fast/base/slow, foundations §7); pick a step']]),
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
