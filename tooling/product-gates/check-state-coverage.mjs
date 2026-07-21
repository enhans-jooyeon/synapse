#!/usr/bin/env node
/**
 * Required-state coverage (protocol §6). The author declares the states a screen
 * must ship in a `<name>.states.json` next to it; this verifies a Storybook story
 * exists for each. A happy-path-only submission fails CI.
 *
 * states file shape:  { "component": "RunList", "states": ["default","empty","loading","error","overflow","long-ko"] }
 * story convention:   export const Empty / Loading / Error … (or story name matching the state, case-insensitive)
 *
 * Usage: node tooling/synapse-gates/check-state-coverage.mjs  (argv[2] = a glob of .states.json files)
 */
import { readFileSync, globSync } from 'node:fs';
import { basename, dirname, join } from 'node:path';
import process from 'node:process';

const pattern = process.argv[2] ?? 'src/**/*.states.json';
let missing = 0;

for (const decl of globSync(pattern)) {
  const { component, states } = JSON.parse(readFileSync(decl, 'utf8'));
  const dir = dirname(decl);
  const storyFile = globSync(join(dir, `${component}.stories.@(tsx|ts|jsx|js)`))[0];
  if (!storyFile) {
    console.error(`ERROR ${decl} — no ${component}.stories.* found`);
    missing += states.length;
    continue;
  }
  const src = readFileSync(storyFile, 'utf8').toLowerCase();
  for (const state of states) {
    const key = state.replace(/[^a-z0-9]/gi, '').toLowerCase();
    // match an exported story or an explicit story name for the state
    const hasStory = new RegExp(`export const \\w*${key}\\w*|name:\\s*['"\`][^'"\`]*${key}`, 'i').test(src);
    if (!hasStory) {
      console.error(`ERROR ${component}: declared state "${state}" has no story in ${basename(storyFile)}`);
      missing++;
    }
  }
}
console.error(`\n${missing} missing state story(ies)`);
process.exit(missing ? 1 : 0);
