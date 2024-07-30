import i18next from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import Backend from 'i18next-http-backend'
import enTranslation from './assets/translation/en/translation.json'
import esTranslation from './assets/translation/es/translation.json'

const resources = {
    en: { translation: enTranslation },
    es : { translation : esTranslation}
    // Add other languages here...
  };

i18next
    .use(initReactI18next)
    .use(LanguageDetector)
    .use(Backend)
    .init({
        resources,
        fallbackLng: 'en',
        debug: false,
        lng: 'en',
    })
