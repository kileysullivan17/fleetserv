// Currency: USD, formatted for display in Hawaii context.
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(amount);
}

// Date: display format for visit dates and issued dates.
export function formatDate(isoDate: string): string {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    timeZone: "Pacific/Honolulu",
  }).format(new Date(isoDate));
}

// Short date: MM/DD/YY for table rows.
export function formatDateShort(isoDate: string): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "2-digit",
    day: "2-digit",
    year: "2-digit",
    timeZone: "Pacific/Honolulu",
  }).format(new Date(isoDate));
}

// Today as YYYY-MM-DD for date input defaults.
export function todayIso(): string {
  return new Date().toISOString().split("T")[0];
}

// Human-readable service type labels.
export const SERVICE_TYPE_LABELS: Record<string, string> = {
  oil_change: "Oil Change",
  fluid: "Fluid",
  fuel: "Fuel",
  tire_air: "Tire Air",
  visual_inspection: "Visual Inspection",
  add_on: "Add-On",
};

// Status labels for display.
export const VISIT_STATUS_LABELS: Record<string, string> = {
  draft: "Draft",
  quoted: "Quoted",
  approved: "Approved",
  invoiced: "Invoiced",
  paid: "Paid",
};

export const QUOTE_STATUS_LABELS: Record<string, string> = {
  draft: "Draft",
  sent: "Sent",
  accepted: "Accepted",
  declined: "Declined",
};

export const INVOICE_STATUS_LABELS: Record<string, string> = {
  draft: "Draft",
  sent: "Sent",
  paid: "Paid",
  overdue: "Overdue",
};
