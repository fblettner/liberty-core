import i18next from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

// Import translation files
import english from "@ly_translations/root/translation.json";
import french from "@ly_translations/fr/translation.json";

// Define resources
const resources = {
  en: { translation: english },
  fr: { translation: french },
};

i18next.use(LanguageDetector).use(initReactI18next);

i18next.init({
  resources,
  detection: { order: ["path", "navigator"] },
  fallbackLng: "en",
  debug: false, // Enable debug logging
});

export default i18next; 
export const t = i18next.t; 