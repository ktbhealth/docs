import { cn } from '@/lib/cn';

/* ------------------------------------------------------------------ */
/* LOC metrics charts — rendered from data emitted by cypera's         */
/* render-loc-mdx.py into codebase-metrics.mdx pages. Pure CSS bars,   */
/* SSR-safe, no chart dependency.                                      */
/* ------------------------------------------------------------------ */

export interface LocMetricRow {
  name: string;
  files: number;
  lines: number;
  code: number;
  comments?: number;
  blanks?: number;
}

function formatNumber(n: number, locale: string) {
  return new Intl.NumberFormat(locale).format(n);
}

function MetricBars({
  rows,
  locale,
  className,
}: {
  rows: LocMetricRow[];
  locale: string;
  className?: string;
}) {
  const sorted = [...rows].sort((a, b) => b.code - a.code);
  const max = Math.max(...sorted.map((r) => r.code), 1);
  return (
    <ul className={cn('my-4 flex flex-col gap-1.5', className)}>
      {sorted.map((row) => (
        <li key={row.name} className="flex items-center gap-3">
          <span className="w-36 shrink-0 truncate text-sm sm:w-44">{row.name}</span>
          <span
            className="h-2 min-w-0 flex-1 overflow-hidden rounded-full bg-fd-muted"
            aria-hidden="true"
          >
            <span
              className="block h-full rounded-full bg-fd-primary"
              style={{ width: `${(row.code / max) * 100}%` }}
            />
          </span>
          <span className="w-20 shrink-0 text-right text-sm tabular-nums">
            {formatNumber(row.code, locale)}
          </span>
        </li>
      ))}
    </ul>
  );
}

export function LocRepoChart({
  data,
  locale = 'en',
}: {
  data: LocMetricRow[];
  locale?: string;
}) {
  return <MetricBars rows={data} locale={locale} />;
}

export function LocLangChart({
  data,
  locale = 'en',
}: {
  data: LocMetricRow[];
  locale?: string;
}) {
  return <MetricBars rows={data} locale={locale} />;
}
