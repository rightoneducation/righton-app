import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import Backend from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';

// react-i18n configuration as per: https://react.i18next.com/latest/using-with-hooks
i18n
  // load translation using http -> see /public/locales
  .use(Backend)
  .use(initReactI18next)
  // automatically detect user language from browswer
  .use(LanguageDetector)
  .init({
    fallbackLng: 'en',
    keySeparator: '.', // to support nested translations
    debug: false,
    detection: {
      // move browser detection up in the priority line for autodetecting language
      order: [
        'querystring',
        'navigator',
        'cookie',
        'localStorage',
        'sessionStorage',
        'htmlTag',
        'path',
        'subdomain',
      ],
    },
    interpolation: {
      escapeValue: false, // not needed for react as it escapes by default
    },
  });

export default i18n;
