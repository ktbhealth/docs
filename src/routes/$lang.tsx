import { createFileRoute, notFound, Outlet } from '@tanstack/react-router';
import { isLanguage } from '@/lib/i18n';

export const Route = createFileRoute('/$lang')({
  beforeLoad: ({ params }) => {
    if (!isLanguage(params.lang)) throw notFound();
  },
  component: Outlet,
});
