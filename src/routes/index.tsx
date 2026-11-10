import { createFileRoute, redirect } from '@tanstack/react-router';
import { i18n } from '@/lib/i18n';

// Legacy entry point: the locale prefix is mandatory, land on the default
// locale's home page.
export const Route = createFileRoute('/')({
  beforeLoad: () => {
    throw redirect({ to: '/$lang', params: { lang: i18n.defaultLanguage } });
  },
});
