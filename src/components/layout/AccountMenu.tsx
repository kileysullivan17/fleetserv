import { useState } from "react";
import { useNavigate } from "react-router-dom";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { useAuth } from "@/hooks/useAuth";
import { AccountSettingsModal } from "@/components/auth/AccountSettingsModal";

// The sidebar-footer avatar. Clicking it opens a menu with account settings
// (display name + password) and sign out. onItemSelect lets the caller close
// the mobile drawer when the user acts.
export function AccountMenu({ onItemSelect }: { onItemSelect?: () => void }) {
  const { session, signOut } = useAuth();
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
            className="flex w-full items-center gap-3 rounded px-2 py-2 text-left transition-colors hover:bg-surface-sidebar-hover focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-teal"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-teal text-xs font-semibold text-white shrink-0">
              {initial}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-medium text-white">
                {primary}
              </p>
              <p className="truncate text-2xs text-slate-400">
                {displayName ? email : "FleetServ Hawaii"}
              </p>
            </div>
            <svg
              className="h-4 w-4 shrink-0 text-slate-400"
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
            className="z-50 w-56 rounded-md border border-brand-sand-dark bg-white p-1 shadow-xl"
          >
            <div className="px-3 py-2">
              <p className="truncate text-sm font-medium text-brand-navy">
                {primary}
              </p>
              <p className="truncate text-xs text-gray-500">{email}</p>
            </div>
            <DropdownMenu.Separator className="my-1 h-px bg-brand-sand-dark" />
            <DropdownMenu.Item
              className="flex cursor-pointer items-center gap-2 rounded px-3 py-2 text-sm text-brand-navy outline-none data-[highlighted]:bg-brand-sand"
              onSelect={() => setSettingsOpen(true)}
            >
              <svg
                className="h-4 w-4 shrink-0 text-gray-400"
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
              className="flex cursor-pointer items-center gap-2 rounded px-3 py-2 text-sm text-brand-coral outline-none data-[highlighted]:bg-brand-coral-subtle"
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
