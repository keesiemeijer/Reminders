import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import resourcesToBackend from "i18next-resources-to-backend";

i18n.use(LanguageDetector)
    .use(resourcesToBackend((language: string, namespace: string) => import(`./locales/${language}/${namespace}.json`)))
    .use(initReactI18next) // Initializes react-i18next
    .init({
        fallbackLng: "en", // Default language if not set
        supportedLngs: ["en", "nl", "fr", "es", "zh", "de", "pt", "ru", "it", "ar", "hi"], // Supported languages
        ns: ["common", "date-lists", "date-settings", "new-settings", "settings", "tree-lists", "tree-settings"], // Define namespaces for each page
        defaultNS: "date-lists", // Default namespace
        interpolation: {
            escapeValue: false, // Disable escaping for simplicity
        },
    });

export default i18n;
