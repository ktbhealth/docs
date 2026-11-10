import react from '@vitejs/plugin-react';
import { tanstackStart } from '@tanstack/react-start/plugin/vite';
import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';
import { fumadocsMdx } from 'fumadocs-mdx/vite';
import { nitro } from 'nitro/vite';

// The nitro `cloudflare_module` preset breaks `vite dev` (dual-React bug in
// nitro 3.0.261103-rc), so it is only selected for deploy builds:
// `bun run build:cf` (CLOUDFLARE_DEPLOY=1) or `NITRO_PRESET=cloudflare_module`.
// Dev/preview keep the `vercel` preset.
const preset =
  process.env.NITRO_PRESET ??
  (process.env.CLOUDFLARE_DEPLOY === '1' ? 'cloudflare_module' : 'vercel');

export default defineConfig({
  server: {
    port: 3000,
  },
  plugins: [
    fumadocsMdx(),
    tailwindcss(),
    tanstackStart({
      prerender: {
        enabled: true,
      },
    }),
    react(),
    // please see https://tanstack.com/start/latest/docs/framework/react/guide/hosting#nitro for guides on hosting
    nitro({
      preset,
    }),
  ],
  resolve: {
    tsconfigPaths: true,
    dedupe: ['react', 'react-dom'],
    alias: {
      tslib: 'tslib/tslib.es6.js',
    },
  },
});
