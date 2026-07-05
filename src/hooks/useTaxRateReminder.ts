import { useCallback, useEffect, useState } from "react";

// How long "Remind me in 2 weeks" hides the reminder before it nags again.
const SNOOZE_DAYS = 14;
const STORAGE_PREFIX = "fleetserv.taxRateReminder.";

interface ReminderState {
  // Set once the owner attests the rate is a verified Hawaii GET rate. When
  // present, the reminder is gone for good on this fleet.
  confirmedAt?: string;
  // Set by "Remind me in 2 weeks". The reminder returns once this passes.
  snoozedUntil?: string;
}

export type TaxRateReminderStatus = "due" | "snoozed" | "confirmed";

function storageKey(companyId: string): string {
  return `${STORAGE_PREFIX}${companyId}`;
}

function readState(companyId: string): ReminderState {
  try {
    const raw = localStorage.getItem(storageKey(companyId));
    return raw ? (JSON.parse(raw) as ReminderState) : {};
  } catch {
    // Private mode or storage disabled: treat as no state, so the reminder
    // shows (failing toward nagging rather than silently hiding).
    return {};
  }
}

function writeState(companyId: string, state: ReminderState): void {
  try {
    localStorage.setItem(storageKey(companyId), JSON.stringify(state));
  } catch {
    // Ignore: nothing we can persist, the reminder simply stays visible.
  }
}

function deriveStatus(state: ReminderState): TaxRateReminderStatus {
  if (state.confirmedAt) return "confirmed";
  if (
    state.snoozedUntil &&
    new Date(state.snoozedUntil).getTime() > Date.now()
  ) {
    return "snoozed";
  }
  return "due";
}

export function useTaxRateReminder(companyId: string | undefined) {
  const [state, setState] = useState<ReminderState>(() =>
    companyId ? readState(companyId) : {}
  );

  // Re-read when switching between fleets (same route, different param).
  useEffect(() => {
    setState(companyId ? readState(companyId) : {});
  }, [companyId]);

  const update = useCallback(
    (next: ReminderState) => {
      if (!companyId) return;
      writeState(companyId, next);
      setState(next);
    },
    [companyId]
  );

  const confirm = useCallback(() => {
    update({ confirmedAt: new Date().toISOString() });
  }, [update]);

  const snooze = useCallback(() => {
    const until = new Date(Date.now() + SNOOZE_DAYS * 24 * 60 * 60 * 1000);
    update({ snoozedUntil: until.toISOString() });
  }, [update]);

  return {
    status: deriveStatus(state),
    confirmedAt: state.confirmedAt,
    confirm,
    snooze,
  };
}
