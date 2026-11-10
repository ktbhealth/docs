import { createRootRoute, HeadContent, Outlet, Scripts, useParams } from '@tanstack/react-router';
import * as React from 'react';
import appCss from '@/styles/app.css?url';
import { RootProvider } from 'fumadocs-ui/provider/tanstack';
import { i18nProvider } from 'fumadocs-ui/i18n';
import { i18n, isLanguage } from '@/lib/i18n';
import { translations } from '@/lib/layout.shared';

export const Route = createRootRoute({
  head: () => ({
    meta: [
      {
        charSet: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      {
        title: 'KTB Health Docs',
      },
    ],
    links: [{ rel: 'stylesheet', href: appCss }],
  }),
  component: RootComponent,
});

/** Replace the leading `/{lang}` segment of the current URL with `locale`. */
function localizedHref(pathname: string, locale: string): string {
  const segments = pathname.split('/');
  if (segments[1] && isLanguage(segments[1])) {
    return `/${locale}${segments.slice(2).join('/') ? `/${segments.slice(2).join('/')}` : ''}`;
  }
  return pathname === '/' ? `/${locale}` : `/${locale}${pathname}`;
}

function RootComponent() {
  const { lang = i18n.defaultLanguage } = useParams({ strict: false });

  return (
    <html lang={lang} suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body className="flex flex-col min-h-screen">
        <RootProvider
          i18n={{
            ...i18nProvider(translations, lang),
            onLocaleChange: (locale) => {
              // docs are prerendered per locale — a full navigation is the
              // simplest correct switch (also works from non-$lang routes).
              window.location.assign(
                localizedHref(window.location.pathname, locale) + window.location.search,
              );
            },
          }}
        >
          <Outlet />
        </RootProvider>
        <Scripts />
      </body>
    </html>
  );
}
