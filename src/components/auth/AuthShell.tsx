// Shared visual shell for the unauthenticated pages (login, sign up, forgot
// password, reset password): the sand background, the FleetServ wordmark, and a
// titled card. Keeps the four pages visually identical.
interface AuthShellProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}

export function AuthShell({
  title,
  subtitle,
  children,
  footer,
}: AuthShellProps) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-brand-sand px-4 py-10">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex items-center justify-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded bg-brand-teal shrink-0">
            <svg
              viewBox="0 0 24 24"
              className="h-5 w-5 text-white"
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
            <span className="text-lg font-semibold leading-none text-brand-navy">
              FleetServ
            </span>
            <span className="mt-0.5 block text-2xs font-medium uppercase leading-none tracking-wide text-brand-teal">
              Hawaii
            </span>
          </div>
        </div>

        <div className="rounded-lg bg-surface-card p-6 shadow-card">
          <h1 className="text-base font-semibold text-brand-navy">{title}</h1>
          {subtitle && <p className="mt-1 text-sm text-gray-500">{subtitle}</p>}
          <div className="mt-5">{children}</div>
        </div>

        {footer && (
          <div className="mt-4 text-center text-xs text-gray-500">{footer}</div>
        )}
      </div>
    </div>
  );
}
