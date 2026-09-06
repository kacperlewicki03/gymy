import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { getLocales } from "expo-localization";
import AsyncStorage from "@react-native-async-storage/async-storage";
import en from "./locales/en.json";
import pl from "./locales/pl.json";

const systemLang = getLocales()[0]?.languageCode || "en";
const initialLang = systemLang === "pl" ? "pl" : "en";

i18n.use(initReactI18next).init({
  compatibilityJSON: "v4",
  resources: {
    en: { translation: en },
    pl: { translation: pl },
  },
  lng: initialLang,
  fallbackLng: "en",
  interpolation: {
    escapeValue: false,
  },
});

AsyncStorage.getItem("@gymy_language").then((savedLang) => {
  if (savedLang && (savedLang === "en" || savedLang === "pl")) {
    i18n.changeLanguage(savedLang);
  }
});

export default i18n;
