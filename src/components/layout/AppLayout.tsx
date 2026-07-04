import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { CommandPalette } from "./CommandPalette";

export function AppLayout() {
  const [paletteOpen, setPaletteOpen] = useState(false);

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

  return (
    <div className="min-h-screen bg-surface-page">
      <Sidebar onSearchClick={() => setPaletteOpen(true)} />
      {/* Main content: offset by sidebar width */}
      <main className="ml-60 min-h-screen">
        <div className="px-8 py-8 max-w-[1280px]">
          <Outlet />
        </div>
      </main>
      <CommandPalette open={paletteOpen} onOpenChange={setPaletteOpen} />
    </div>
  );
}
