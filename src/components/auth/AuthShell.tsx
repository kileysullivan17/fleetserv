// Shared visual shell for the unauthenticated pages (login, sign up, forgot
// password, reset password): the sand background, the FleetServ wordmark, and a
// titled card. Keeps the four pages visually identical.
import { BrandMark } from "@/components/ui/BrandMark";

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
        <div className="mb-8 flex justify-center">
          <BrandMark tone="light" size="lg" subline="Hawaiʻi" />
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
