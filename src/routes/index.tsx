import { createFileRoute, Link } from '@tanstack/react-router';
import { HomeLayout } from 'fumadocs-ui/layouts/home';
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@ktbhealth/ui/components/card';
import { Badge } from '@ktbhealth/ui/components/badge';
import { baseOptions } from '@/lib/layout.shared';

export const Route = createFileRoute('/')({
  component: Home,
});

const audiences = [
  {
    title: 'Doctors',
    description: 'Run better consults — record, transcribe, review, approve, export.',
    to: '/docs/doctors/getting-started',
    badge: 'Primary',
  },
  {
    title: 'Patients',
    description: 'What to expect from your care and how your data is handled.',
    to: '/docs/patients/what-to-expect',
  },
  {
    title: 'Developers',
    description: 'Build on KTB — plugins, ports & adapters, deploy, contribute.',
    to: '/docs/developers/tutorials/getting-started',
  },
  {
    title: 'Business',
    description: 'Partner with KTB — positioning, security, deployment options.',
    to: '/docs/business/positioning',
  },
] as const;

function Home() {
  return (
    <HomeLayout {...baseOptions()}>
      <div className="flex flex-col flex-1 px-4 py-16">
        <div className="mx-auto w-full max-w-4xl text-center">
          <Badge variant="secondary" className="mb-4">
            KTB Health
          </Badge>
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Documentation
          </h1>
          <p className="mt-3 text-fd-muted-foreground">
            The AI drafts the record; the physician decides. Pick your path below.
          </p>
        </div>

        <div className="mx-auto mt-10 grid w-full max-w-4xl gap-4 sm:grid-cols-2">
          {audiences.map((a) => (
            <Link key={a.title} to={a.to} className="block">
              <Card className="h-full transition-colors hover:border-fd-primary">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>{a.title}</CardTitle>
                    {'badge' in a && a.badge ? (
                      <Badge variant="outline">{a.badge}</Badge>
                    ) : null}
                  </div>
                  <CardDescription>{a.description}</CardDescription>
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </HomeLayout>
  );
}
