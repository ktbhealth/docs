import { createFileRoute } from '@tanstack/react-router';
import { source } from '@/lib/source';
import { createFromSource } from 'fumadocs-core/search/server';

const server = createFromSource(source, {
  // 'multilingual' (zbsearch default) tokenizes/stems en + pt-BR together
  // in the single locale-filtered i18n index — 'english' would stem
  // Portuguese queries wrong. Per-locale DBs via localeMap are deprecated.
  language: 'multilingual',
});

export const Route = createFileRoute('/api/search')({
  server: {
    handlers: {
      GET: async ({ request }) => server.GET(request),
    },
  },
});
