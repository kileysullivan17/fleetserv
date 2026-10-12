// Theme preference: light, dark, or follow the device (system).
//
// The choice is one person's on one device, so it lives in localStorage like
// the tax-rate snooze, not on the account. Every read and write is wrapped:
// private mode or blocked storage falls back to System, and the app still
// renders correctly.
//
// How it applies: light and dark set data-theme on <html>, which tokens.css
// reads. System removes the attribute, and the prefers-color-scheme block in
// tokens.css follows the device live, with no listener needed. The inline
// script in index.html applies the stored choice before first paint; keep its
// storage key and values in step with this file.

export type ThemePreference = "light" | "dark" | "system";

export const THEME_STORAGE_KEY = "fleetserv.theme";

export const THEME_OPTIONS: { value: ThemePreference; label: string }[] = [
  { value: "light", label: "Light" },
  { value: "dark", label: "Dark" },
  { value: "system", label: "System" },
];

function isPreference(value: unknown): value is ThemePreference {
  return value === "light" || value === "dark" || value === "system";
}

export function readThemePreference(): ThemePreference {
  try {
    const raw = localStorage.getItem(THEME_STORAGE_KEY);
    return isPreference(raw) ? raw : "system";
  } catch {
    return "system";
  }
}

export function writeThemePreference(preference: ThemePreference): void {
  try {
    if (preference === "system") {
      localStorage.removeItem(THEME_STORAGE_KEY);
    } else {
      localStorage.setItem(THEME_STORAGE_KEY, preference);
    }
  } catch {
    // Nothing to persist: the choice still applies for this page load.
  }
}

export function applyThemePreference(preference: ThemePreference): void {
  const root = document.documentElement;
  if (preference === "system") {
    root.removeAttribute("data-theme");
  } else {
    root.setAttribute("data-theme", preference);
  }
}
