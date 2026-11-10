import { createFileRoute, Link } from '@tanstack/react-router';
import { HomeLayout } from 'fumadocs-ui/layouts/home';
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@ktbhealth/ui/components/card';
import { Badge } from '@ktbhealth/ui/components/badge';
import * as m from '@/paraglide/messages.js';
import { toLocale, type Locale } from '@/paraglide/runtime.js';
import { baseOptions } from '@/lib/layout.shared';

export const Route = createFileRoute('/$lang/')({
  component: Home,
});

type MessageFn = (inputs?: Record<string, never>, options?: { locale?: Locale }) => string;

const audiences: {
  title: MessageFn;
  description: MessageFn;
  slugs: string;
  badge?: boolean;
}[] = [
  {
    title: m.audience_doctors_title,
    description: m.audience_doctors_desc,
    slugs: 'doctors/getting-started',
    badge: true,
  },
  {
    title: m.audience_patients_title,
    description: m.audience_patients_desc,
    slugs: 'patients/what-to-expect',
  },
  {
    title: m.audience_developers_title,
    description: m.audience_developers_desc,
    slugs: 'developers/tutorials/getting-started',
  },
  {
    title: m.audience_business_title,
    description: m.audience_business_desc,
    slugs: 'business/positioning',
  },
];

function Home() {
  const { lang } = Route.useParams();
  // $lang is validated by the parent route; toLocale narrows it for paraglide.
  const locale = (toLocale(lang) ?? 'en') as Locale;

  return (
    <HomeLayout {...baseOptions(lang)}>
      <div className="flex flex-col flex-1 px-4 py-16">
        <div className="mx-auto w-full max-w-4xl text-center">
          <Badge variant="secondary" className="mb-4">
            KTB Health
          </Badge>
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            {m.home_title({}, { locale })}
          </h1>
          <p className="mt-3 text-fd-muted-foreground">
            {m.home_tagline({}, { locale })}
          </p>
        </div>

        <div className="mx-auto mt-10 grid w-full max-w-4xl gap-4 sm:grid-cols-2">
          {audiences.map((a) => (
            <Link
              key={a.slugs}
              to="/$lang/docs/$"
              params={{ lang, _splat: a.slugs }}
              className="block"
            >
              <Card className="h-full transition-colors hover:border-fd-primary">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>{a.title({}, { locale })}</CardTitle>
                    {a.badge ? (
                      <Badge variant="outline">{m.badge_primary({}, { locale })}</Badge>
                    ) : null}
                  </div>
                  <CardDescription>{a.description({}, { locale })}</CardDescription>
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </HomeLayout>
  );
}
