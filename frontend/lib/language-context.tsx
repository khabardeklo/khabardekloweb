"use client";

import { createContext, useContext, useState, useEffect, useCallback } from "react";
import type { ReactNode } from "react";
import hi from "@/lib/translations/hi";
import en from "@/lib/translations/en";
import type { TranslationKeys } from "@/lib/translations/hi";

type Lang = "hi" | "en";

type LangContextType = {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: TranslationKeys;
};

const COOKIE_KEY = "kd_lang";
const DEFAULT_LANG: Lang = "hi";

const LangContext = createContext<LangContextType>({
  lang: DEFAULT_LANG,
  setLang: () => {},
  t: hi,
});

const getStoredLang = (): Lang => {
  if (typeof document === "undefined") return DEFAULT_LANG;
  const match = document.cookie.match(new RegExp(`(?:^|; )${COOKIE_KEY}=([^;]*)`));
  const val = match?.[1];
  return val === "en" || val === "hi" ? val : DEFAULT_LANG;
};

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(DEFAULT_LANG);

  useEffect(() => {
    setLangState(getStoredLang());
  }, []);

  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    // Persist for 1 year
    document.cookie = `${COOKIE_KEY}=${l}; path=/; max-age=31536000; SameSite=Lax`;
    // Update html lang attribute for screen readers / SEO
    document.documentElement.lang = l;
  }, []);

  const t = lang === "en" ? en : hi;

  return (
    <LangContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LangContext.Provider>
  );
}

export const useLang = () => useContext(LangContext);
