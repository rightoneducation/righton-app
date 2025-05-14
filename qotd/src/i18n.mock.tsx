import i18n from 'i18next';
import translations from '../public/locales/en/translation.json';

i18n.init({
  lng: 'en',
  resources: {
    en: {
      translation: translations,
    },
  },
});

export default i18n;
