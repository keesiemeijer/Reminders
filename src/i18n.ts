import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import resourcesToBackend from "i18next-resources-to-backend";

i18n.use(LanguageDetector)
    .use(resourcesToBackend((language: string, namespace: string) => import(`./locales/${language}/${namespace}.json`)))
    .use(initReactI18next) // Initializes react-i18next
    .init({
        fallbackLng: "en", // Default language if not set
        supportedLngs: ["en", "nl", "fr", "es"], // Supported languages
        ns: ["date-lists", "tree-lists", "manual-list", "settings", "new-settings", "tree-settings", "date-settings", "common"], // Define namespaces for each page
        defaultNS: "date-lists", // Default namespace
        interpolation: {
            escapeValue: false, // Disable escaping for simplicity
        },
    });

export default i18n;

// Todo: add more languages

// Mandarin Chinese
// Hindi
// Arabic
// Russian
// Portuguese
// German
// Italian
