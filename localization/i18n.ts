import i18n, {
  InitOptions,
  LanguageDetectorAsyncModule,
  Services,
} from 'i18next';
import { initReactI18next } from 'react-i18next';
import { en, de } from './translations';
import { getLocales } from 'expo-localization';

const allTranslations: Record<string, typeof en | typeof de> = { en, de };

const languageDetector: LanguageDetectorAsyncModule = {
  type: 'languageDetector',
  async: true,
  init: (
    _services: Services,
    _detectorOptions: object,
    _i18nextOptions: InitOptions,
  ) => {},
  detect: (callback: (lng: string) => void) => {
    try {
      const language = getLocales()
        .map((locale) => locale.languageTag)
        .find((tag) => tag in allTranslations);
      console.log(language);
      if (language) {
        callback(language);
      } else {
        //if language was not found use german
        callback('de');
      }
    } catch (error) {
      console.log('Error reading language', error);
      callback('de'); // fallback to German in case of error
    }
  },
  cacheUserLanguage: () => {},
};

const resources = {
  en: {
    translation: en,
  },
  de: {
    translation: de,
  },
};

i18n
  .use(initReactI18next)
  .use(languageDetector)
  .init({
    resources,
    compatibilityJSON: 'v3',
    // fallback language is set to german
    fallbackLng: 'de',
    interpolation: {
      escapeValue: false,
    },
  });
export default i18n;
