# Publishing `@enhans/synapse`

This workspace is **not publishable yet** and is kept `private: true` on purpose: it implements **4 of 52 components** (Button · Badge · Input · Card). Shipping it now would give consumers a near-empty design system. This is the checklist to make it a real package when the library reaches parity.

## Blocker

Build out the component library toward `synapse.manifest.json` parity — at minimum the Sample-pages dependency chain (Table, Sidebar, Chip, Avatar, SegmentedControl, Tabs, DescriptionList, AgentStep, ProposalCard, Composer), following the conventions in `README.md` here. Until then, keep `private: true`.

## When ready — package.json additions

```jsonc
{
  "private": false,
  "sideEffects": ["*.css"],
  "main": "./dist/index.js",
  "module": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": { "types": "./dist/index.d.ts", "import": "./dist/index.js" },
    "./tokens/synapse.css": "./dist/synapse.css",
    "./tokens/synapse.tokens.json": "./dist/synapse.tokens.json"
  },
  "files": ["dist"],
  "peerDependencies": { "react": ">=18", "react-dom": ">=18" },
  "scripts": {
    "build": "tsup src/index.ts --format esm --dts && cp ../tokens/synapse.css ../tokens/synapse.tokens.json dist/",
    "prepublishOnly": "npm run gate && npm run build"
  }
}
```

## Steps

1. Reach component parity (blocker above); export every component from `src/index.ts`.
2. Add a bundler (`tsup` or Vite lib mode) producing ESM + `.d.ts` into `dist/`.
3. Bundle tokens (`synapse.css` + `synapse.tokens.json`) into `dist/` so the product's Tailwind preset (`tooling/product-gates/tailwind.synapse.cjs`) can resolve them from the package.
4. `prepublishOnly` runs the DS gate — never publish a spec-noncompliant build.
5. Version in **lockstep** with the design-system version (currently 6.62.0). Publishing 6.62.0 means the components match the 6.62.0 specs.
6. `npm publish --access restricted` (or your private registry). Requires npm auth — a human step, not automatable here.

## Consumers then

```bash
npm i @enhans/synapse
```
```ts
import { Button, Badge } from '@enhans/synapse';
import '@enhans/synapse/tokens/synapse.css';
```
