/* ------------------------------------------------------------------ */
/* LOC metrics charts — rendered from data emitted by cypera's         */
/* render-loc-mdx.py into codebase-metrics.mdx pages. Pure CSS stacked  */
/* bars (code / comments / blanks), SSR-safe, no chart dependency.      */
/* ------------------------------------------------------------------ */

export interface LocMetricRow {
  name: string;
  files: number;
  lines: number;
  code: number;
  comments?: number;
  blanks?: number;
}

const LEGENDS: Record<string, { code: string; comments: string; blanks: string }> = {
  en: { code: 'Code', comments: 'Comments', blanks: 'Blanks' },
  'pt-BR': { code: 'Código', comments: 'Comentários', blanks: 'Em branco' },
};

function formatNumber(n: number, locale: string) {
  return new Intl.NumberFormat(locale).format(n);
}

function formatShare(part: number, total: number) {
  if (total <= 0) return '0%';
  const pct = (part / total) * 100;
  return `${pct >= 10 ? Math.round(pct) : pct.toFixed(1).replace(/\.0$/, '')}%`;
}

function MetricChart({ rows, locale }: { rows: LocMetricRow[]; locale: string }) {
  const labels = LEGENDS[locale] ?? LEGENDS.en;
  const sorted = [...rows].sort((a, b) => b.code - a.code);
  const totalCode = sorted.reduce((sum, r) => sum + r.code, 0);
  const maxLines = Math.max(...sorted.map((r) => r.lines || r.code), 1);
  const hasSplit = sorted.some((r) => (r.comments ?? 0) > 0 || (r.blanks ?? 0) > 0);

  return (
    <div className="my-4 flex flex-col gap-1.5">
      {hasSplit ? (
        <div className="mb-1 flex items-center gap-4 text-xs text-fd-muted-foreground">
          <span className="flex items-center gap-1.5">
            <span className="size-2.5 rounded-sm bg-fd-primary" aria-hidden="true" />
            {labels.code}
          </span>
          <span className="flex items-center gap-1.5">
            <span className="size-2.5 rounded-sm bg-fd-muted-foreground/40" aria-hidden="true" />
            {labels.comments}
          </span>
          <span className="flex items-center gap-1.5">
            <span className="size-2.5 rounded-sm bg-fd-muted" aria-hidden="true" />
            {labels.blanks}
          </span>
        </div>
      ) : null}
      <ul className="flex flex-col gap-1.5">
        {sorted.map((row) => {
          const lines = row.lines || row.code;
          const comments = row.comments ?? 0;
          const blanks = row.blanks ?? 0;
          const codePct = (row.code / maxLines) * 100;
          const commentsPct = (comments / maxLines) * 100;
          const blanksPct = (blanks / maxLines) * 100;
          return (
            <li key={row.name} className="flex items-center gap-3">
              <span className="w-32 shrink-0 truncate text-sm sm:w-44">{row.name}</span>
              <span
                className="flex h-2.5 min-w-0 flex-1 overflow-hidden rounded-full bg-fd-muted/50"
                aria-hidden="true"
              >
                <span className="h-full bg-fd-primary" style={{ width: `${codePct}%` }} />
                {commentsPct > 0 ? (
                  <span className="h-full bg-fd-muted-foreground/40" style={{ width: `${commentsPct}%` }} />
                ) : null}
                {blanksPct > 0 ? (
                  <span className="h-full bg-fd-muted" style={{ width: `${blanksPct}%` }} />
                ) : null}
                <span className="h-full flex-1" />
              </span>
              <span className="flex w-28 shrink-0 items-baseline justify-end gap-1.5 text-sm">
                <span className="tabular-nums">{formatNumber(row.code, locale)}</span>
                <span className="text-xs text-fd-muted-foreground tabular-nums">
                  {formatShare(row.code, totalCode)}
                </span>
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export function LocRepoChart({
  data,
  locale = 'en',
}: {
  data: LocMetricRow[];
  locale?: string;
}) {
  return <MetricChart rows={data} locale={locale} />;
}

export function LocLangChart({
  data,
  locale = 'en',
}: {
  data: LocMetricRow[];
  locale?: string;
}) {
  return <MetricChart rows={data} locale={locale} />;
}
