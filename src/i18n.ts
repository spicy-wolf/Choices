import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import Backend from 'i18next-http-backend';

declare let __URL_BASE_ROOT__: string;

i18n
  .use(Backend)
  .use(initReactI18next)
  .init({
    fallbackLng: ['en', 'zhCN'],
    //debug: true,
    interpolation: {
      escapeValue: false, // not needed for react as it escapes by default
    },
    backend: {
      loadPath: `${__URL_BASE_ROOT__}/locales/{{lng}}/translation.json`
    }
  });

export default i18n;
