
import i18n from 'i18next';
import teTranslation from '../translations/te/translation.json';
import enTranslation from '../translations/en/translation.json';
import { I18nextProvider, initReactI18next } from 'react-i18next';


// Initialize i18next
export default i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: enTranslation },
      te: { translation: teTranslation },
    },
    // lng: 'en', // Set the default language
    lng: 'en', // Set the default language
    fallbackLng: 'en', // Fallback language in case translation is missing for the selected language
    interpolation: {
      escapeValue: false, // React already escapes strings, so no need for extra escaping
    },
  });

  