/**
 * Tailwind preset for the product repo — **Tailwind v3 ONLY**; a v4 app has no JS
 * theme and uses `tailwind.synapse.v4.css` instead. It sources the theme from Synapse
 * tokens and REPLACES (not extends) the defaults, so the named off-scale conveniences
 * cease to exist: `shadow-lg`, `text-3xl`, `leading-tight`, `tracking-wide` stop
 * compiling because no such theme key remains.
 *
 * IT DOES NOT DISABLE ARBITRARY VALUES — and no Tailwind config on any version can.
 * `p-[13px]`, `text-[#4f46e5]`, `leading-[1.1]`, `z-[9999]` are parsed as bracket
 * syntax BEFORE the theme is consulted, so they compile against any theme. SY001 and
 * SY002 are enforced by `check-raw-values.mjs`, NOT by this file. Earlier revisions of
 * this docstring claimed the opposite in three places; the claim was false on v3 and is
 * false on v4. **Wire the gate into CI before converting call sites** — until it runs,
 * nothing is enforced.
 *
 * Usage in the product's tailwind.config: `presets: [require('./tooling/synapse-gates/tailwind.synapse.cjs')]`
 * Generate the theme objects from tokens/synapse.tokens.json at build time so they never drift.
 */
const tokens = require('@enhans-jooyeon/synapse/tokens/synapse.tokens.json');

// Map DTCG token groups → Tailwind scales (illustrative; wire to your token shape).
const spacing = Object.fromEntries(
  Object.entries(tokens.primitive?.space ?? {})
    .filter(([k]) => !k.startsWith('$'))
    .map(([k, v]) => [k, v.$value])
);

module.exports = {
  // `future: {}` is a no-op. It never blocked bracket syntax; it is kept only so that a
  // reader who remembers the old "hard stop" comment lands on this correction rather
  // than on silence. The arbitrary-value ban is check-raw-values.mjs (SY002).
  future: {},
  theme: {
    // Replace (not extend) the defaults so only tokenized values exist.
    spacing,
    borderRadius: Object.fromEntries(
      Object.entries(tokens.primitive?.radius ?? {})
        .filter(([k]) => !k.startsWith('$'))
        .map(([k, v]) => [k, v.$value])
    ),
    // Shadows are PREFIXED, deliberately (ruling 2026-08-06, migration audit test 8).
    //
    // Synapse's token names are xs/sm/md/lg/xl — byte-identical to Tailwind's DEFAULT
    // boxShadow keys. Sourcing the scale under the same names would make `shadow-lg`
    // mean two different things depending on whether the theme loaded, and no lint rule
    // could tell a correct token class from a leftover Tailwind default. Prefixing kills
    // the ambiguity: after this, a bare `shadow-sm|md|lg|xl` is ALWAYS a leftover, and
    // SY009 can flag it permanently rather than only during the migration.
    //
    // `float` is not decoration — it is the jurisdiction. foundations §6 is borders-first:
    // shadows exist ONLY for floating layers. The engineer's triage (ring / static /
    // floating) resolves every other case to "no shadow at all", so the surviving class
    // should say what it is for. Writing `shadow-float-md` on a static card reads wrong,
    // which is the point.
    boxShadow: Object.fromEntries(
      Object.entries(tokens.primitive?.shadow ?? {})
        .filter(([k]) => !k.startsWith('$'))
        .map(([k, v]) => [`float-${k}`, v.$value])   // → shadow-float-xs … shadow-float-xl
    ),
    // colors, fontSize, fontFamily: build the same way from tokens. fontSize entries must
    // be full BUNDLES — [size, {lineHeight, fontWeight, letterSpacing}] — with lineHeight
    // and letterSpacing emptied, so `leading-*`/`tracking-*` cease to exist
    // (migration/typography-tailwind-migration.md).
  },
  // Empty ON PURPOSE, and it disables nothing. Tailwind exposes no switch for bracket
  // syntax on any version, so there is nothing that could go here. SY001/SY002 are
  // enforced by check-raw-values.mjs, run in CI over the same globs as this build.
  corePlugins: {},
};
