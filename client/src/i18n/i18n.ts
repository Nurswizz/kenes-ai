import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import translationEn from "./locales/en/translation.json";
import translationRu from "./locales/ru/translation.json";

const savedLang = localStorage.getItem("language") || "ru";

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: translationEn },
      ru: { translation: translationRu },
    },
    lng: savedLang,         // ✅ Устанавливаем здесь
    fallbackLng: "en",
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
