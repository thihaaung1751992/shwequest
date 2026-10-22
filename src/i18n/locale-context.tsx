"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { LOCALE_KEY, messages, type Locale, type Messages } from "@/i18n/messages";

type LocaleContextValue = {
  locale: Locale;
  setLocale: (next: Locale) => void;
};

const LocaleContext = createContext<LocaleContextValue | null>(null);

function applyLang(locale: Locale) {
  document.documentElement.lang = locale === "my" ? "my" : "en";
}

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("en");

  useEffect(() => {
    const stored = window.localStorage.getItem(LOCALE_KEY);
    if (stored !== "my" && stored !== "en") return;
    setLocaleState(stored);
    applyLang(stored);
  }, []);

  const setLocale = useCallback((next: Locale) => {
    window.localStorage.setItem(LOCALE_KEY, next);
    applyLang(next);
    setLocaleState(next);
  }, []);

  const value = useMemo(() => ({ locale, setLocale }), [locale, setLocale]);

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

export function useLocale(): LocaleContextValue {
  const value = useContext(LocaleContext);
  if (!value) {
    throw new Error("useLocale must be used within LocaleProvider");
  }
  return value;
}

export function useMessages(): Messages {
  const { locale } = useLocale();
  // Hydration render stays English so it matches prerendered HTML.
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setReady(true);
  }, []);

  return messages[ready ? locale : "en"];
}
