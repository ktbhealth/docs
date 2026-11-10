import { createMiddleware, createCsrfMiddleware, createStart } from '@tanstack/react-start';
import { isMarkdownPreferred } from 'fumadocs-core/negotiation';
import { redirect } from '@tanstack/react-router';
import { getPageMarkdownUrl } from '@/lib/shared';
import { isLanguage } from '@/lib/i18n';

const csrfMiddleware = createCsrfMiddleware({
  filter: (ctx) => ctx.handlerType === 'serverFn',
});

const llmMiddleware = createMiddleware().server(({ next, request }) => {
  const url = new URL(request.url);

  // docs URLs are locale-prefixed: /<lang>/docs/…
  const segments = url.pathname.split('/').filter((v) => v.length > 0);
  const lang = segments[0];
  const isDocsPage =
    segments[1] === 'docs' &&
    isLanguage(lang) &&
    !url.pathname.endsWith('.md');

  if (isDocsPage && isMarkdownPreferred(request)) {
    const slugs = segments.slice(2);
    url.pathname = getPageMarkdownUrl({ slugs, locale: lang }).url;

    // this URL has two representations, selected by `Accept`
    throw redirect({ href: url.href, headers: { Vary: 'Accept' } });
  }

  return next();
});

export const startInstance = createStart(() => {
  return {
    requestMiddleware: [csrfMiddleware, llmMiddleware],
  };
});
