import { defineI18n } from 'fumadocs-core/i18n';

/**
 * Docs content locales. `parser: 'dir'` reads content/docs/<locale>/…
 * (English at content/docs/en, pt-BR at content/docs/pt-BR). Missing
 * translations fall back to `defaultLanguage`.
 *
 * URLs always carry the locale prefix (`hideLocale: 'never'`):
 * /en/docs/…, /pt-BR/docs/…, home pages at /en and /pt-BR.
 */
export const i18n = defineI18n({
  defaultLanguage: 'en',
  languages: ['en', 'pt-BR'],
  parser: 'dir',
});

const languageSet: ReadonlySet<string> = new Set(i18n.languages);

/** Type-narrowing check for untrusted input (route params, cookies…). */
export function isLanguage(value: string): boolean {
  return languageSet.has(value);
}
