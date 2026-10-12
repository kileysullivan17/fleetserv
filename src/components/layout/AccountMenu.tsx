import { useState } from "react";
import { useNavigate } from "react-router-dom";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { useAuth } from "@/hooks/useAuth";
import { useTheme } from "@/hooks/useTheme";
import { THEME_OPTIONS, type ThemePreference } from "@/lib/theme";
import { AccountSettingsModal } from "@/components/auth/AccountSettingsModal";
import { cn } from "@/utils/cn";

// The sidebar-footer avatar. Clicking it opens a menu with the theme choice,
// account settings (display name + password) and sign out. onItemSelect lets
// the caller close the mobile drawer when the user acts.
export function AccountMenu({ onItemSelect }: { onItemSelect?: () => void }) {
  const { session, signOut } = useAuth();
  const { preference, setTheme } = useTheme();
  const navigate = useNavigate();
  const [settingsOpen, setSettingsOpen] = useState(false);

  const email = session?.user.email ?? "";
  const displayName =
    (session?.user.user_metadata?.display_name as string | undefined) ?? "";
  const primary = displayName || email || "Signed in";
  const initial = (displayName || email || "?").charAt(0).toUpperCase();

  const onSignOut = async () => {
    await signOut();
    onItemSelect?.();
    navigate("/login", { replace: true });
  };

  return (
    <>
      <DropdownMenu.Root>
        <DropdownMenu.Trigger asChild>
          <button
            type="button"
            className="flex w-full items-center gap-3 rounded px-2 py-2 text-left transition-colors hover:bg-fs-navy-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-fs-focus"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-fs-navy-700 text-xs font-semibold text-white shrink-0">
              {initial}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-medium text-white">
                {primary}
              </p>
              <p className="truncate text-2xs text-fs-navy-100">
                {displayName ? email : "FleetServ Hawaii"}
              </p>
            </div>
            <svg
              className="h-4 w-4 shrink-0 text-fs-navy-100"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              aria-hidden="true"
            >
              <polyline points="18 15 12 9 6 15" />
            </svg>
          </button>
        </DropdownMenu.Trigger>

        <DropdownMenu.Portal>
          <DropdownMenu.Content
            side="top"
            align="start"
            sideOffset={8}
            className="z-50 w-56 rounded-md border border-fs-line-200 bg-fs-surface p-1 shadow-xl"
          >
            <div className="px-3 py-2">
              <p className="truncate text-sm font-medium text-fs-ink-900">
                {primary}
              </p>
              <p className="truncate text-xs text-fs-ink-500">{email}</p>
            </div>
            <DropdownMenu.Separator className="my-1 h-px bg-fs-line-200" />
            <DropdownMenu.Label
              id="fs-theme-label"
              className="px-3 pb-1.5 pt-2 text-2xs font-bold uppercase tracking-[0.08em] text-fs-ink-600"
            >
              Theme
            </DropdownMenu.Label>
            <DropdownMenu.RadioGroup
              aria-labelledby="fs-theme-label"
              value={preference}
              onValueChange={(value) => setTheme(value as ThemePreference)}
              className="mx-2 mb-1 flex gap-1 rounded-fs bg-fs-tint p-1"
            >
              {THEME_OPTIONS.map((option) => (
                <DropdownMenu.RadioItem
                  key={option.value}
                  value={option.value}
                  // Keep the menu open so the change is visible in place.
                  onSelect={(e) => e.preventDefault()}
                  className={cn(
                    "flex min-h-[44px] flex-1 cursor-pointer flex-col items-center justify-center gap-0.5 rounded-fs-sm text-xs font-semibold text-fs-ink-600 outline-none",
                    "data-[highlighted]:ring-2 data-[highlighted]:ring-fs-focus",
                    "data-[state=checked]:bg-fs-selected data-[state=checked]:text-fs-selected-fg"
                  )}
                >
                  <ThemeIcon value={option.value} />
                  {option.label}
                </DropdownMenu.RadioItem>
              ))}
            </DropdownMenu.RadioGroup>
            <DropdownMenu.Separator className="my-1 h-px bg-fs-line-200" />
            <DropdownMenu.Item
              className="flex min-h-[44px] cursor-pointer items-center gap-2 rounded px-3 py-2 text-sm text-fs-ink-900 outline-none data-[highlighted]:bg-fs-bg"
              onSelect={() => setSettingsOpen(true)}
            >
              <svg
                className="h-4 w-4 shrink-0 text-fs-ink-500"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                aria-hidden="true"
              >
                <circle cx="12" cy="12" r="3" />
                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
              </svg>
              Account settings
            </DropdownMenu.Item>
            <DropdownMenu.Item
              className="flex min-h-[44px] cursor-pointer items-center gap-2 rounded px-3 py-2 text-sm text-fs-danger outline-none data-[highlighted]:bg-fs-overdue-bg"
              onSelect={() => void onSignOut()}
            >
              <svg
                className="h-4 w-4 shrink-0"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                aria-hidden="true"
              >
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
              Sign out
            </DropdownMenu.Item>
          </DropdownMenu.Content>
        </DropdownMenu.Portal>
      </DropdownMenu.Root>

      <AccountSettingsModal open={settingsOpen} onOpenChange={setSettingsOpen} />
    </>
  );
}

// Sun, moon, and screen. Decorative: the label beside each carries the name.
function ThemeIcon({ value }: { value: ThemePreference }) {
  return (
    <svg
      className="h-4 w-4 shrink-0"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      aria-hidden="true"
    >
      {value === "light" && (
        <>
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
        </>
      )}
      {value === "dark" && <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />}
      {value === "system" && (
        <>
          <rect x="2" y="3" width="20" height="14" rx="2" />
          <path d="M8 21h8M12 17v4" />
        </>
      )}
    </svg>
  );
}
