import { useCallback, useEffect, useState } from "react";
import { useUpdateCompany } from "@/hooks/useCompanies";
import type { Company } from "@/types/database";

// How long "Remind me in 2 weeks" hides the reminder before it nags again.
const SNOOZE_DAYS = 14;
const STORAGE_PREFIX = "fleetserv.taxRateReminder.";

// tax_rate is numeric(6, 3) and round-trips as a float, so compare the attested
// rate to the current one with a tolerance rather than with ===. Half of the
// smallest step the column can represent is enough to be exact without being
// fooled by a float that is off in the last bit.
const RATE_EPSILON = 0.0005;

export type TaxRateReminderStatus = "due" | "snoozed" | "confirmed";

function storageKey(companyId: string): string {
  return `${STORAGE_PREFIX}${companyId}`;
}

// The confirmation moved to the database in migration 003, because it is an
// attestation about the fleet and has to hold for everyone on every device.
// The snooze stays here on purpose: "not now" is one person's decision on one
// device, and losing it costs nothing worse than the banner reappearing.
function readSnooze(companyId: string): string | undefined {
  try {
    const raw = localStorage.getItem(storageKey(companyId));
    if (!raw) return undefined;
    return (JSON.parse(raw) as { snoozedUntil?: string }).snoozedUntil;
  } catch {
    // Private mode or storage disabled: treat as no snooze, so the reminder
    // shows (failing toward nagging rather than silently hiding).
    return undefined;
  }
}

function writeSnooze(companyId: string, snoozedUntil: string): void {
  try {
    localStorage.setItem(
      storageKey(companyId),
      JSON.stringify({ snoozedUntil })
    );
  } catch {
    // Ignore: nothing we can persist, the reminder simply stays visible.
  }
}

// Confirmed means the owner attested a rate AND that rate is still the one in
// use. Editing tax_rate afterwards makes the attestation stale and the reminder
// returns, which is the point of storing the value alongside the timestamp.
//
// Before migration 003 both fields read as undefined, so this returns false and
// every fleet nags. That is the safe direction to fail in.
function isConfirmed(company: Company | undefined): boolean {
  if (!company?.tax_rate_confirmed_at) return false;
  const attested = company.tax_rate_confirmed_value;
  if (attested == null) return false;
  return Math.abs(attested - company.tax_rate) < RATE_EPSILON;
}

export function useTaxRateReminder(company: Company | undefined) {
  const companyId = company?.id;
  const updateCompany = useUpdateCompany(companyId ?? "");

  const [snoozedUntil, setSnoozedUntil] = useState<string | undefined>(() =>
    companyId ? readSnooze(companyId) : undefined
  );

  // Re-read when switching between fleets (same route, different param).
  useEffect(() => {
    setSnoozedUntil(companyId ? readSnooze(companyId) : undefined);
  }, [companyId]);

  const confirm = useCallback(() => {
    if (!company) return;
    updateCompany.mutate({
      tax_rate_confirmed_at: new Date().toISOString(),
      tax_rate_confirmed_value: company.tax_rate,
    });
  }, [company, updateCompany]);

  const snooze = useCallback(() => {
    if (!companyId) return;
    const until = new Date(
      Date.now() + SNOOZE_DAYS * 24 * 60 * 60 * 1000
    ).toISOString();
    writeSnooze(companyId, until);
    setSnoozedUntil(until);
  }, [companyId]);

  const snoozeActive = Boolean(
    snoozedUntil && new Date(snoozedUntil).getTime() > Date.now()
  );

  const status: TaxRateReminderStatus = isConfirmed(company)
    ? "confirmed"
    : snoozeActive
      ? "snoozed"
      : "due";

  return {
    status,
    confirmedAt: company?.tax_rate_confirmed_at ?? undefined,
    confirm,
    snooze,
    isConfirming: updateCompany.isPending,
    // Surfaced so a failed write is visible. The likeliest cause is the app
    // running against a database where migration 003 has not been applied: the
    // update names columns that do not exist yet and PostgREST rejects it.
    confirmError: updateCompany.error,
  };
}
