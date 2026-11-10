import type { BaseLayoutProps } from 'fumadocs-ui/layouts/shared';
import { uiTranslations } from 'fumadocs-ui/i18n';
import { appName, gitConfig } from './shared';
import { i18n } from './i18n';
import { productUrl } from './site-links';

export const translations = i18n
  .translations()
  .extend(uiTranslations())
  .add({
    en: {
      displayName: 'English',
    },
    'pt-BR': {
      displayName: 'Português (Brasil)',
      // fumadocs-ui chrome strings (keys fall back to their English text)
      'Choose a language(language switcher)': 'Escolha um idioma',
      'Choose a language(language switcher)(aria-label)': 'Escolha um idioma',
      'Language(language switcher)': 'Idioma',
      'Search(search trigger)': 'Buscar',
      'Search(search dialog)': 'Buscar',
      'Open Search(search trigger)(aria-label)': 'Abrir busca',
      'Close Search(search dialog)(aria-label)': 'Fechar busca',
      'No results found(search dialog)': 'Nenhum resultado encontrado',
      'On this page(table of contents)': 'Nesta página',
      'Table of Contents(inline table of contents)': 'Sumário',
      'No Headings(table of contents)': 'Sem títulos',
      'Open Sidebar(sidebar)(aria-label)': 'Abrir barra lateral',
      'Close Sidebar(sidebar)(aria-label)': 'Fechar barra lateral',
      'Show Sidebar(sidebar)': 'Mostrar barra lateral',
      'Hide Sidebar(sidebar)': 'Ocultar barra lateral',
      'Collapse Sidebar(sidebar)(aria-label)': 'Recolher barra lateral',
      'Skip to Content(skip link)': 'Pular para o conteúdo',
      'Theme(site menu)': 'Tema',
      'Light(theme switcher)(aria-label)': 'Claro',
      'Dark(theme switcher)(aria-label)': 'Escuro',
      'System(theme switcher)(aria-label)': 'Sistema',
      'Edit on GitHub(edit page)': 'Editar no GitHub',
      'Copy Markdown(page actions)': 'Copiar Markdown',
      'Copied Markdown(page actions)': 'Markdown copiado',
      'Page Not Found(404 not found page)': 'Página não encontrada',
      'Back to Home(404 not found page)': 'Voltar ao início',
      'The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.(404 not found page)':
        'A página que você procura pode ter sido removida, ter mudado de nome ou estar temporariamente indisponível.',
      'Toggle Menu(home layout header)(aria-label)': 'Alternar menu',
    },
  });

export function baseOptions(locale: string = i18n.defaultLanguage): BaseLayoutProps {
  return {
    nav: {
      // JSX supported
      title: appName,
      // keep the home link inside the current locale (/en, /pt-BR)
      url: `/${locale}`,
    },
    links: [
      {
        type: 'main',
        text: 'Product',
        url: productUrl,
        external: true,
      },
    ],
    githubUrl: `https://github.com/${gitConfig.user}/${gitConfig.repo}`,
  };
}
