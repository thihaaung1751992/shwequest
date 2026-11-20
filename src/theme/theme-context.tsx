"use client";

import {
  createContext,
  useCallback,
  useContext,
  useLayoutEffect,
  useMemo,
  useSyncExternalStore,
} from "react";
import {
  THEME_KEY,
  isTheme,
  nextTheme,
  resolveTheme,
  type ResolvedTheme,
  type Theme,
} from "@/theme/theme";

type ThemeContextValue = {
  theme: Theme;
  resolvedTheme: ResolvedTheme;
  setTheme: (next: Theme) => void;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

const preferenceListeners = new Set<() => void>();

function emitPreference() {
  preferenceListeners.forEach((listener) => listener());
}

function subscribePreference(listener: () => void) {
  preferenceListeners.add(listener);
  return () => {
    preferenceListeners.delete(listener);
  };
}

function readPreference(): Theme {
  if (typeof window === "undefined") return "system";
  const stored = window.localStorage.getItem(THEME_KEY);
  return isTheme(stored) ? stored : "system";
}

function getPreferenceServerSnapshot(): Theme {
  return "system";
}

function subscribeSystemDark(listener: () => void) {
  const media = window.matchMedia("(prefers-color-scheme: dark)");
  media.addEventListener("change", listener);
  return () => media.removeEventListener("change", listener);
}

function readSystemDark(): boolean {
  return window.matchMedia("(prefers-color-scheme: dark)").matches;
}

function getSystemDarkServerSnapshot(): boolean {
  return false;
}

function applyResolved(resolved: ResolvedTheme) {
  const root = document.documentElement;
  root.classList.toggle("dark", resolved === "dark");
  root.style.colorScheme = resolved;
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const theme = useSyncExternalStore(
    subscribePreference,
    readPreference,
    getPreferenceServerSnapshot,
  );
  const systemDark = useSyncExternalStore(
    subscribeSystemDark,
    readSystemDark,
    getSystemDarkServerSnapshot,
  );

  const resolvedTheme: ResolvedTheme =
    theme === "system" ? (systemDark ? "dark" : "light") : theme;

  useLayoutEffect(() => {
    applyResolved(resolvedTheme);
  }, [resolvedTheme]);

  const setTheme = useCallback((next: Theme) => {
    window.localStorage.setItem(THEME_KEY, next);
    applyResolved(resolveTheme(next));
    emitPreference();
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme(nextTheme(readPreference()));
  }, [setTheme]);

  const value = useMemo(
    () => ({ theme, resolvedTheme, setTheme, toggleTheme }),
    [theme, resolvedTheme, setTheme, toggleTheme],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeContextValue {
  const value = useContext(ThemeContext);
  if (!value) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return value;
}
