import { Button } from "@/components/ui/Button";
import type { HawaiiCounty } from "@/types/database";

interface TaxRateReminderBannerProps {
  county: HawaiiCounty;
  taxRate: number;
  onConfirm: () => void;
  onSnooze: () => void;
  // True while the attestation is being written to the fleet's row.
  isConfirming?: boolean;
  // Shown when that write fails. Without this the button would appear to do
  // nothing, which is the worst way for an attestation to fail.
  error?: Error | null;
}

// The actionable nag shown on a fleet whose tax rate has not been confirmed.
// Addressed to the account owner.
export function TaxRateReminderBanner({
  county,
  taxRate,
  onConfirm,
  onSnooze,
  isConfirming = false,
  error = null,
}: TaxRateReminderBannerProps) {
  return (
    <div className="mb-6 flex items-start gap-3 rounded-lg border border-fs-danger/30 bg-fs-overdue-bg px-4 py-3">
      <svg
        className="mt-0.5 h-5 w-5 shrink-0 text-fs-danger"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        aria-hidden="true"
      >
        <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
        <line x1="12" y1="9" x2="12" y2="13" />
        <line x1="12" y1="17" x2="12.01" y2="17" />
      </svg>
      <div className="flex-1">
        <p className="text-sm font-semibold text-fs-ink-900">
          Confirm this fleet's tax rate
        </p>
        <p className="mt-1 text-sm text-fs-ink-600">
          The {county} County rate of {taxRate}% is an illustrative placeholder,
          not a verified Hawaii GET rate. Until you confirm it, every quote and
          invoice for this fleet is billed at this placeholder value. Please
          verify the current rate, then confirm.
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          <Button size="sm" onClick={onConfirm} disabled={isConfirming}>
            {isConfirming ? "Saving..." : "The rate is correct"}
          </Button>
          <Button size="sm" variant="secondary" onClick={onSnooze}>
            Remind me in 2 weeks
          </Button>
        </div>
        {error && (
          <p role="alert" className="mt-2 text-sm text-fs-danger">
            That did not save, so the rate is still unconfirmed. {error.message}
          </p>
        )}
      </div>
    </div>
  );
}
