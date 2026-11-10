import defaultMdxComponents from 'fumadocs-ui/mdx';
import type { MDXComponents } from 'mdx/types';
import type { ComponentProps, HTMLAttributes, ReactNode } from 'react';
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from '@ktbhealth/ui/components/alert';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@ktbhealth/ui/components/accordion';
import { Badge } from '@ktbhealth/ui/components/badge';
import {
  Card as KtbCard,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@ktbhealth/ui/components/card';
import {
  Table as KtbTable,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '@ktbhealth/ui/components/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@ktbhealth/ui/components/tabs';
import { CircleCheck, CircleX, Info, Lightbulb, TriangleAlert } from 'lucide-react';
import { cn } from '@/lib/cn';

/* ------------------------------------------------------------------ */
/* Callout → KTB Alert                                                 */
/* ------------------------------------------------------------------ */

type CalloutType = 'info' | 'warn' | 'warning' | 'error' | 'success' | 'idea' | 'tip';

const calloutIcons: Record<string, typeof Info> = {
  info: Info,
  tip: Info,
  warning: TriangleAlert,
  warn: TriangleAlert,
  error: CircleX,
  success: CircleCheck,
  idea: Lightbulb,
};

function resolveCalloutType(type: CalloutType = 'info') {
  if (type === 'warn') return 'warning';
  if (type === 'tip') return 'info';
  return type;
}

function CalloutContainer({
  type: inputType = 'info',
  icon,
  children,
  className,
  ...props
}: ComponentProps<'div'> & { type?: CalloutType; icon?: ReactNode }) {
  const type = resolveCalloutType(inputType);
  const Icon = calloutIcons[type] ?? Info;
  return (
    <Alert
      variant={type === 'error' ? 'destructive' : 'default'}
      className={cn('my-4', className)}
      {...props}
    >
      {icon ?? <Icon />}
      <div className="flex min-w-0 flex-1 flex-col gap-1">{children}</div>
    </Alert>
  );
}

function CalloutTitle({ children, className, ...props }: ComponentProps<'p'>) {
  return (
    <AlertTitle className={className} {...props}>
      {children}
    </AlertTitle>
  );
}

function CalloutDescription({ children, className, ...props }: ComponentProps<'div'>) {
  return (
    <AlertDescription className={className} {...props}>
      {children}
    </AlertDescription>
  );
}

function Callout({
  children,
  title,
  ...props
}: { title?: ReactNode } & Omit<ComponentProps<'div'>, 'title'> & { type?: CalloutType }) {
  return (
    <CalloutContainer {...props}>
      {title ? <CalloutTitle>{title}</CalloutTitle> : null}
      <CalloutDescription>{children}</CalloutDescription>
    </CalloutContainer>
  );
}

/* ------------------------------------------------------------------ */
/* Cards/Card → KTB Card (fumadocs signature: title/description/href)  */
/* ------------------------------------------------------------------ */

function Cards({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('grid grid-cols-1 gap-3 sm:grid-cols-2', className)} {...props} />;
}

function Card({
  icon,
  title,
  description,
  href,
  external,
  className,
  ...props
}: HTMLAttributes<HTMLElement> & {
  icon?: ReactNode;
  title: ReactNode;
  description?: ReactNode;
  href?: string;
  external?: boolean;
}) {
  const card = (
    <KtbCard className={cn('h-full transition-colors hover:bg-muted/50', className)} {...props}>
      <CardHeader>
        {icon ? <div className="mb-1 text-muted-foreground [&_svg]:size-5">{icon}</div> : null}
        <CardTitle>{title}</CardTitle>
        {description ? <CardDescription>{description}</CardDescription> : null}
      </CardHeader>
    </KtbCard>
  );

  if (!href) return card;
  const isExternal = external || /^https?:\/\//.test(href);
  return (
    <a
      href={href}
      className="block h-full rounded-xl outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
      {...(isExternal ? { target: '_blank', rel: 'noreferrer' } : {})}
    >
      {card}
    </a>
  );
}

/* Table intrinsics → KTB Table; Tabs / Accordion → KTB (Base UI)    */

export function getMDXComponents(components?: MDXComponents) {
  return {
    ...defaultMdxComponents,
    // Callouts
    Callout,
    CalloutContainer,
    CalloutTitle,
    CalloutDescription,
    // Cards
    Cards,
    Card,
    // Badge
    Badge,
    // Tables
    table: KtbTable,
    thead: TableHeader,
    tbody: TableBody,
    tfoot: TableFooter,
    tr: TableRow,
    th: TableHead,
    td: TableCell,
    caption: TableCaption,
    // Tabs (Base UI: <Tabs defaultValue="…">, <TabsTrigger value="…">)
    Tabs,
    TabsList,
    TabsTrigger,
    TabsContent,
    // Accordion (Base UI: <Accordion multiple>, <AccordionItem value="…">)
    Accordion,
    AccordionItem,
    AccordionTrigger,
    AccordionContent,
    ...components,
  } satisfies MDXComponents;
}

export const useMDXComponents = getMDXComponents;

declare global {
  type MDXProvidedComponents = ReturnType<typeof getMDXComponents>;
}
