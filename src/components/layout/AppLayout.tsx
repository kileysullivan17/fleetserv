import { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { BrandMark } from "@/components/ui/BrandMark";
import { Sidebar } from "./Sidebar";
import { CommandPalette } from "./CommandPalette";

export function AppLayout() {
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setPaletteOpen((open) => !open);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  // Close the mobile drawer whenever the route changes.
  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-surface-page">
      <div className="fs-app-chrome">
        <Sidebar
          open={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          onSearchClick={() => setPaletteOpen(true)}
        />

        {/* Backdrop behind the mobile drawer (mobile only) */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 z-30 bg-brand-navy/40 lg:hidden"
            aria-hidden="true"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </div>

      {/* Main content: offset by the sidebar width on desktop only */}
      <main className="min-h-screen lg:ml-60 print:!ml-0">
        {/* Mobile top bar: hamburger + wordmark. Hidden on desktop. */}
        <div className="fs-app-chrome sticky top-0 z-20 flex items-center gap-3 border-b border-brand-navy-muted bg-surface-sidebar px-4 py-3 lg:hidden">
          <button
            type="button"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open navigation menu"
            className="flex h-9 w-9 items-center justify-center rounded text-slate-200 hover:bg-surface-sidebar-hover"
          >
            <svg
              className="h-5 w-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              aria-hidden="true"
            >
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>
          <BrandMark tone="navy" size="sm" />
        </div>

        <div className="max-w-[1280px] px-4 py-6 sm:px-6 lg:px-8 lg:py-8 print:!max-w-none print:!p-0">
          <Outlet />
        </div>
      </main>

      <CommandPalette open={paletteOpen} onOpenChange={setPaletteOpen} />
    </div>
  );
}
