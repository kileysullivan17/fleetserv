import { useCallback, useEffect, useState } from "react";
import {
  THEME_STORAGE_KEY,
  applyThemePreference,
  readThemePreference,
  writeThemePreference,
  type ThemePreference,
} from "@/lib/theme";

// The current theme preference and a setter that applies and stores it.
// A change made in another tab arrives through the storage event, so two
// open tabs never disagree.
export function useTheme() {
  const [preference, setPreference] = useState<ThemePreference>(
    readThemePreference
  );

  const setTheme = useCallback((next: ThemePreference) => {
    setPreference(next);
    applyThemePreference(next);
    writeThemePreference(next);
  }, []);

  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key !== null && e.key !== THEME_STORAGE_KEY) return;
      const next = readThemePreference();
      setPreference(next);
      applyThemePreference(next);
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  return { preference, setTheme };
}
