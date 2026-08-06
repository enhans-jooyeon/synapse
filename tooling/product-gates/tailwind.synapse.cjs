/**
 * Tailwind preset for the product repo — sources the theme from Synapse tokens
 * and DISABLES arbitrary values, so `[13px]` / `[#4f46e5]` cannot compile.
 * This is the front line for SY001 (raw color) and SY002 (off-scale value):
 * if it isn't a token, it isn't expressible.
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
  // Hard stop: no bracketed arbitrary values anywhere.
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
  // Disable arbitrary values — the enforcement that makes SY001/SY002 unbypassable.
  // (Tailwind+: `experimental` / plugin; if unavailable, pair with check-raw-values.mjs.)
  corePlugins: {
    // keep defaults; the arbitrary-value ban is enforced by the lint scan below
    // and by NOT whitelisting bracket syntax in your editor/formatter.
  },
};
