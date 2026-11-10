import { createFileRoute, redirect } from '@tanstack/react-router';
import { i18n } from '@/lib/i18n';

// Legacy docs URLs had no locale prefix — redirect them to the default
// locale, preserving the page path (and .md suffix).
export const Route = createFileRoute('/docs/$')({
  beforeLoad: ({ params }) => {
    throw redirect({
      to: '/$lang/docs/$',
      params: { lang: i18n.defaultLanguage, _splat: params._splat ?? '' },
    });
  },
});
