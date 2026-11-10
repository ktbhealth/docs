# @ktbhealth/docs

Documentation site for the [ktbhealth](https://github.com/ktbhealth) org —
Fumadocs on TanStack Start, deployed to Cloudflare Workers via Alchemy.

Content lives in `content/docs/` as MDX, organized by
[Diátaxis](https://diataxis.fr/): `tutorials/`, `how-to/`, `reference/`,
`explanation/`.

## Commands

```bash
bun install
bun run dev          # dev server on :3000
bun run types:check  # tsc --noEmit
bun run build        # production build (vercel preset)
bun run build:cf     # Cloudflare build → .output/
bun run deploy       # build:cf + alchemy deploy (needs Cloudflare creds)
bun run deploy:wrangler  # build:cf + wrangler deploy fallback
```

## Gotchas

- **Nitro preset is env-conditional.** The `cloudflare_module` preset breaks
  `vite dev` (dual-React bug in nitro `3.0.261103-rc`). Dev/preview use the
  `vercel` preset; only `build:cf` (`CLOUDFLARE_DEPLOY=1`) or
  `NITRO_PRESET=cloudflare_module` selects Cloudflare. See `vite.config.ts`.
- **`bunfig.toml` sets `linker = "hoisted"`.** Bun's isolated linker breaks
  the nitro dev server. Don't remove it; if `bun run dev` fails with module
  resolution errors, check this first.
- **`fumadocs-ui` is an alias** for `npm:@fumadocs/base-ui` — intentional, do
  not "fix" it.
- **OG images are not included.** The spike's takumi-js OG route (~5.8 MB
  wasm) was dropped to keep the Worker lean; `og:image` meta is omitted.
- Generated files (`src/routeTree.gen.ts`, `.source/`, `.output/`) are never
  hand-edited.

## Deploy

`bun run deploy` requires Cloudflare credentials configured for Alchemy (same
vault/setup as `product`'s `infra:deploy`). Without creds, scaffold only —
`bun run deploy:wrangler` is the wrangler fallback once `.output` exists.
