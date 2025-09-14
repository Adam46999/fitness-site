import { createContext, useContext, useEffect, useMemo, useState } from "react";

/** مخزن القواميس (سنملأه لاحقًا بملفات JSON) */
const i18nStore = { ar: {}, en: {} };

/** دالة عامة لتسجيل/تحديث القواميس من خارج الملف */

// eslint-disable-next-line react-refresh/only-export-components
export function setDictionaries(dict = {}) {
  // دمج آمن بدون كسر
  i18nStore.ar = { ...(i18nStore.ar || {}), ...(dict.ar || {}) };
  i18nStore.en = { ...(i18nStore.en || {}), ...(dict.en || {}) };
}

const LanguageContext = createContext(null);

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("site_lang");
      if (saved === "ar" || saved === "en") return saved;
      const nav = navigator.language?.toLowerCase() || "";
      return nav.startsWith("ar") ? "ar" : "en";
    }
    return "ar";
  });

  // ضبط اتجاه/لغة وثبات في localStorage
  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute("dir", lang === "ar" ? "rtl" : "ltr");
    root.setAttribute("lang", lang);
    localStorage.setItem("site_lang", lang);
  }, [lang]);

  // t: تبحث بمفتاح هرمي "namespace.key.subkey"
  function t(key, fallback = "") {
    if (!key) return "";
    const get = (obj, path) =>
      path
        .split(".")
        .reduce((acc, k) => (acc && acc[k] != null ? acc[k] : undefined), obj);

    const fromLang = get(i18nStore[lang], key);
    if (fromLang != null) return fromLang;

    const fromEn = get(i18nStore.en, key);
    if (fromEn != null) return fromEn;

    return fallback || key; // fallback أخير
  }

  const value = useMemo(
    () => ({ lang, setLang, dir: lang === "ar" ? "rtl" : "ltr", t }),
    [lang]
  );

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}
// eslint-disable-next-line react-refresh/only-export-components
export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within LanguageProvider");
  return ctx;
}
