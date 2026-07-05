import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/utils/cn";
import { useAuth } from "@/hooks/useAuth";

interface NavItem {
  label: string;
  to: string;
  icon: React.ReactNode;
}

const navItems: NavItem[] = [
  {
    label: "Fleets",
    to: "/fleets",
    icon: (
      <svg
        className="w-5 h-5"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.75}
        aria-hidden="true"
      >
        <rect x="2" y="7" width="20" height="14" rx="2" />
        <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
        <path d="M12 12v4" />
        <path d="M8 12h8" />
      </svg>
    ),
  },
  {
    label: "Service Visits",
    to: "/visits",
    icon: (
      <svg
        className="w-5 h-5"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.75}
        aria-hidden="true"
      >
        <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
      </svg>
    ),
  },
  {
    label: "Quotes",
    to: "/quotes",
    icon: (
      <svg
        className="w-5 h-5"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.75}
        aria-hidden="true"
      >
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
        <polyline points="10 9 9 9 8 9" />
      </svg>
    ),
  },
  {
    label: "Invoices",
    to: "/invoices",
    icon: (
      <svg
        className="w-5 h-5"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.75}
        aria-hidden="true"
      >
        <rect x="2" y="5" width="20" height="14" rx="2" />
        <line x1="2" y1="10" x2="22" y2="10" />
      </svg>
    ),
  },
];

export function Sidebar({
  open = false,
  onClose,
  onSearchClick,
}: {
  open?: boolean;
  onClose?: () => void;
  onSearchClick?: () => void;
}) {
  const location = useLocation();
  const navigate = useNavigate();
  const { session, signOut } = useAuth();
  const email = session?.user.email ?? "";

  const onSignOut = async () => {
    await signOut();
    onClose?.();
    navigate("/login", { replace: true });
  };

  return (
    <aside
      className={cn(
        "fixed inset-y-0 left-0 z-40 flex w-60 flex-col bg-surface-sidebar transition-transform duration-200",
        open ? "translate-x-0" : "-translate-x-full",
        "lg:translate-x-0"
      )}
    >
      {/* Logo / wordmark */}
      <div className="flex items-center gap-3 px-5 py-5 border-b border-brand-navy-muted">
        <div className="flex h-8 w-8 items-center justify-center rounded bg-brand-teal shrink-0">
          <svg
            viewBox="0 0 24 24"
            className="w-5 h-5 text-white"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            aria-hidden="true"
          >
            <path d="M1 17 L5 7 L14 7 L18 17 Z" />
            <rect x="3" y="17" width="3" height="2" rx="0.5" />
            <rect x="16" y="17" width="3" height="2" rx="0.5" />
          </svg>
        </div>
        <div>
          <span className="text-sm font-semibold text-white leading-none">
            FleetServ
          </span>
          <span className="block text-2xs font-medium text-brand-teal-light leading-none mt-0.5 tracking-wide uppercase">
            Hawaii
          </span>
        </div>
      </div>

      {/* Search trigger */}
      {onSearchClick && (
        <div className="px-3 pt-4">
          <button
            type="button"
            onClick={() => {
              onSearchClick?.();
              onClose?.();
            }}
            className="flex w-full items-center gap-3 rounded px-3 py-2 text-sm text-slate-400 bg-brand-navy-muted/40 hover:bg-surface-sidebar-hover hover:text-slate-200 transition-colors"
          >
            <svg
              className="w-4 h-4 shrink-0"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              aria-hidden="true"
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <span className="flex-1 text-left">Search</span>
            <kbd className="rounded border border-brand-navy-muted px-1.5 py-0.5 text-2xs font-mono text-slate-500">
              ⌘K
            </kbd>
          </button>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {navItems.map((item) => {
          const isActive =
            location.pathname === item.to ||
            location.pathname.startsWith(item.to + "/");

          return (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={() => onClose?.()}
              className={cn(
                "flex items-center gap-3 rounded px-3 py-2.5 text-sm font-medium transition-colors group",
                isActive
                  ? "bg-brand-teal text-white"
                  : "text-slate-300 hover:bg-surface-sidebar-hover hover:text-white"
              )}
            >
              <span
                className={cn(
                  "transition-colors",
                  isActive
                    ? "text-white"
                    : "text-slate-400 group-hover:text-slate-200"
                )}
              >
                {item.icon}
              </span>
              {item.label}
            </NavLink>
          );
        })}
      </nav>

      {/* Footer: signed-in user and sign out */}
      <div className="px-4 py-4 border-t border-brand-navy-muted">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-full bg-brand-navy-muted flex items-center justify-center shrink-0">
            <svg
              className="w-4 h-4 text-slate-400"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              aria-hidden="true"
            >
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </div>
          <div className="min-w-0">
            <p className="text-xs font-medium text-white truncate">
              {email || "Signed in"}
            </p>
            <p className="text-2xs text-slate-400 truncate">FleetServ Hawaii</p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => void onSignOut()}
          className="mt-3 flex w-full items-center justify-center gap-2 rounded px-3 py-2 text-xs font-medium text-slate-300 bg-brand-navy-muted/40 hover:bg-surface-sidebar-hover hover:text-white transition-colors"
        >
          <svg
            className="w-4 h-4 shrink-0"
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
          Sign Out
        </button>
      </div>
    </aside>
  );
}
