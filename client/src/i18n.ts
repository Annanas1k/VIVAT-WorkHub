import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import translationRO from './locales/ro.json';
import translationEN from './locales/en.json';
import translationRU from './locales/ru.json'

i18n
  .use(LanguageDetector) 
  .use(initReactI18next) 
  .init({
    resources: {
      ro: { translation: translationRO },
      en: { translation: translationEN },
      ru: { translation: translationRU }
    },
    fallbackLng: 'en', 
    interpolation: {
      escapeValue: false 
    }
  });

export default i18n;