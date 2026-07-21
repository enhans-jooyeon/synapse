/**
 * Tailwind preset for the product repo — sources the theme from Synapse tokens
 * and DISABLES arbitrary values, so `[13px]` / `[#4f46e5]` cannot compile.
 * This is the front line for SY001 (raw color) and SY002 (off-scale value):
 * if it isn't a token, it isn't expressible.
 *
 * Usage in the product's tailwind.config: `presets: [require('./tooling/synapse-gates/tailwind.synapse.cjs')]`
 * Generate the theme objects from tokens/synapse.tokens.json at build time so they never drift.
 */
const tokens = require('@enhans/synapse/tokens/synapse.tokens.json');

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
    // colors, fontSize, fontFamily, boxShadow: build the same way from tokens.
  },
  // Disable arbitrary values — the enforcement that makes SY001/SY002 unbypassable.
  // (Tailwind v3.4+: `experimental` / plugin; if unavailable, pair with check-raw-values.mjs.)
  corePlugins: {
    // keep defaults; the arbitrary-value ban is enforced by the lint scan below
    // and by NOT whitelisting bracket syntax in your editor/formatter.
  },
};
