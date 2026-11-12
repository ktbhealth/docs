import { createFileRoute, notFound, redirect } from '@tanstack/react-router';
import { DocsLayout } from 'fumadocs-ui/layouts/docs';
import { createServerFn } from '@tanstack/react-start';
import { docs, source } from '@/lib/source';
import {
  DocsBody,
  DocsDescription,
  DocsPage,
  DocsTitle,
  MarkdownCopyButton,
  ViewOptionsPopover,
} from 'fumadocs-ui/layouts/docs/page';
import { baseOptions } from '@/lib/layout.shared';
import { getPageMarkdownUrl, gitConfig } from '@/lib/shared';
import { useFumadocsLoader } from 'fumadocs-core/source/client';
import { Suspense, use } from 'react';
import { useMDXComponents } from '@/components/mdx';

// Developers IA moved from flat quadrants to kernel/plugins/apps — keep the
// old /developers/<quad>/<page> URLs working.
const LEGACY_DEVELOPERS: Record<string, string> = {
  'tutorials/getting-started': 'apps/tutorials/getting-started',
  'tutorials/writing-content': 'apps/tutorials/writing-content',
  'tutorials/first-deploy': 'apps/tutorials/first-deploy',
  'tutorials/contribute': 'apps/tutorials/contribute',
  'tutorials/first-plugin': 'kernel/tutorials/first-plugin',
  'tutorials/add-a-port-adapter': 'kernel/tutorials/add-a-port-adapter',
  'how-to/dev-environment': 'apps/how-to/dev-environment',
  'how-to/dev-node': 'apps/how-to/dev-node',
  'how-to/deploy-to-cloudflare': 'apps/how-to/deploy-to-cloudflare',
  'how-to/e2e-tests': 'apps/how-to/e2e-tests',
  'how-to/migrations': 'kernel/how-to/migrations',
  'explanation/product-architecture': 'kernel/explanation/product-architecture',
  'explanation/ports-and-adapters': 'kernel/explanation/ports-and-adapters',
  'explanation/positioning': 'apps/explanation/positioning',
  'explanation/client-server-split': 'apps/explanation/client-server-split',
  'reference/commands': 'root/reference/commands',
  'reference/site-structure': 'apps/reference/site-structure',
  'reference/ui-components': 'apps/reference/ui-components',
  'reference/integration-surface': 'apps/reference/integration-surface',
  'reference/arch-rules': 'kernel/reference/arch-rules',
  'reference/ports-catalog': 'kernel/reference/ports-catalog',
  'reference/packages': 'kernel/reference/packages',
};

const PLUGIN_IDS = [
  'patients', 'consultations', 'groups', 'notifications', 'audit',
  'pages', 'auth', 'rbac', 'platform',
];

// Pages moved between quadrants after the initial IA restructure.
const MOVED_PAGES: Record<string, string> = {
  'apps/reference/commands': 'root/reference/commands',
  // general/cross-cutting pages moved kernel/ → root/
  'kernel/how-to/testing': 'root/how-to/testing',
  'kernel/how-to/debugging': 'root/how-to/debugging',
  'kernel/how-to/environment-variables': 'root/how-to/environment-variables',
  'kernel/how-to/ci': 'root/how-to/ci',
  'kernel/explanation/authentication': 'root/explanation/authentication',
  'kernel/explanation/internationalization': 'root/explanation/internationalization',
  'kernel/explanation/deployment': 'root/explanation/deployment',
  'kernel/explanation/error-handling': 'root/explanation/error-handling',
  'kernel/reference/commands': 'root/reference/commands',
  'kernel/reference/glossary': 'root/reference/glossary',
};

function legacyDevelopersPath(slugs: string[]): string | null {
  if (slugs.length < 2) return null;
  // plugins/<plugin> content moved under reference/ (how-to/ is new).
  if (slugs[0] === 'developers' && slugs[1] === 'plugins' && PLUGIN_IDS.includes(slugs[2])) {
    const sub = slugs[3];
    // bare /plugins/<id> serves the hand-written index.mdx landing page
    if (!sub) return null;
    if (!['reference', 'how-to', 'tutorials', 'explanation'].includes(sub)) {
      return `developers/plugins/${slugs[2]}/reference/${slugs.slice(3).join('/')}`;
    }
    // table pages moved under reference/tables/ — redirect legacy flat URLs
    if (sub === 'reference' && slugs[4] && slugs[4] !== 'tables') {
      return `developers/plugins/${slugs[2]}/reference/tables/${slugs.slice(4).join('/')}`;
    }
    return null;
  }
  // plugins/ briefly hosted quadrant pages and reference/database — both moved.
  if (slugs[0] === 'developers' && slugs[1] === 'plugins' && ['tutorials', 'how-to', 'explanation', 'reference'].includes(slugs[2])) {
    const rest = slugs.slice(2).join('/');
    if (rest.startsWith('reference/database')) {
      const tail = rest.slice('reference/database'.length);
      return `developers/plugins${tail}`;
    }
    const mapped = LEGACY_DEVELOPERS[rest];
    if (mapped) {
      const tail = slugs.slice(4).join('/');
      return `developers/${mapped}${tail ? `/${tail}` : ''}`;
    }
    return null;
  }
  if (slugs[0] !== 'developers' || slugs.length < 3) return null;
  const rest = slugs.slice(1).join('/');
  const moved = MOVED_PAGES[rest];
  if (moved) return `developers/${moved}`;
  if (rest.startsWith('reference/database')) {
    const tail = rest.slice('reference/database'.length);
    return `developers/plugins${tail}`;
  }
  const page = slugs[2];
  const mapped = LEGACY_DEVELOPERS[`${slugs[1]}/${page}`];
  if (!mapped) return null;
  const tail = slugs.slice(3).join('/');
  return `developers/${mapped}${tail ? `/${tail}` : ''}`;
}

export const Route = createFileRoute('/$lang/docs/$')({
  beforeLoad: ({ params }) => {
    const slugs = params._splat?.split('/') ?? [];
    const mapped = legacyDevelopersPath(slugs);
    if (mapped) {
      throw redirect({
        to: '/$lang/docs/$',
        params: { lang: params.lang, _splat: mapped },
      });
    }
  },
  component: Page,
  loader: async ({ params }) => {
    const slugs = params._splat?.split('/') ?? [];
    const data = await serverLoader({ data: { slugs, lang: params.lang } });
    await docs.getPage(data.path)?.preload();
    return data;
  },
});

const serverLoader = createServerFn({
  method: 'GET',
})
  .validator((data: { slugs: string[]; lang: string }) => data)
  .handler(async ({ data: { slugs, lang } }) => {
    const page = source.getPage(slugs, lang);
    if (!page) throw notFound();

    return {
      path: page.path,
      markdownUrl: getPageMarkdownUrl(page).url,
      pageTree: await source.serializePageTree(source.getPageTree(lang)),
    };
  });

function Content({
  path,
  markdownUrl,
  lang,
}: {
  path: string;
  markdownUrl: string;
  lang: string;
}) {
  const page = docs.getPage(path);
  if (!page) throw new Error(`unknown page: ${path}`);

  const { toc } = use(page.load());
  const MDX = page.body;

  return (
    <DocsPage toc={toc}>
      <DocsTitle>{page.title}</DocsTitle>
      <DocsDescription>{page.description}</DocsDescription>
      <div className="flex flex-row gap-2 items-center border-b -mt-4 pb-6">
        <MarkdownCopyButton markdownUrl={markdownUrl} />
        <ViewOptionsPopover
          markdownUrl={markdownUrl}
          githubUrl={`https://github.com/${gitConfig.user}/${gitConfig.repo}/blob/${gitConfig.branch}/content/docs/${lang}/${encodeURI(path)}`}
        />
      </div>
      <DocsBody>
        <MDX components={useMDXComponents()} />
      </DocsBody>
    </DocsPage>
  );
}

function Page() {
  const { lang } = Route.useParams();
  const { path, pageTree, markdownUrl } = useFumadocsLoader(Route.useLoaderData());

  return (
    <DocsLayout {...baseOptions(lang)} tree={pageTree}>
      <Suspense>
        <Content path={path} markdownUrl={markdownUrl} lang={lang} />
      </Suspense>
    </DocsLayout>
  );
}
