# assets/fonts/

Self-hosted font binaries. Only **Artific** lives here (Pretendard + JetBrains Mono
load from a CDN via `tokens/fonts.css`). The Artific `@font-face` blocks are already
declared in `tokens/synapse.css`; this directory just holds the files they point at.

## Drop the licensed Artific files here

Artific is a **commercial** font (Power Type Foundry). Embedding it requires Enhans'
**webfont license**. Place the licensed WOFF2 files here with these exact names
(matched by the `@font-face` `src` in `tokens/synapse.css`):

```
assets/fonts/Artific-SemiBold.woff2   (weight 600)
assets/fonts/Artific-Bold.woff2       (weight 700)
```

Only 600 and 700 are used (foundations §2.1). Until the files are present, brand
titles fall back to Pretendard Bold — acceptable given Artific's once-per-screen
scarcity.

## Do not redistribute

`*.woff2` here is **gitignored** on purpose (`.gitignore`) — the licensed binaries
must never be committed, mirrored to the public `synapse-harness` repo, or bundled
into the public `dist/`. Serving them from Enhans' own web properties (the product
app, and the Vercel hub if you choose to deploy them there) is what the webfont
license covers; public code redistribution is not.
