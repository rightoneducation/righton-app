import { useTranslation } from 'react-i18next';

/**
 * True once the i18next catalogue for the active language has loaded.
 *
 * Meaningful only because Suspense is disabled in src/i18n.tsx — with Suspense
 * on, react-i18next throws to a boundary instead of exposing `ready`.
 */
// eslint-disable-next-line import/prefer-default-export
export function useI18nReady(): boolean {
  const { ready } = useTranslation();
  return ready;
}
