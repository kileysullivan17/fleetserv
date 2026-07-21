import type { Company, ServiceLineItem, Truck } from "@/types/database";
import { formatCurrency, formatDate, SERVICE_TYPE_LABELS } from "@/utils/format";

interface DocumentArtifactProps {
  kind: "quote" | "invoice";
  /** Display number, e.g. "Q-1053" or "INV-0114". */
  number: string;
  issuedDate: string;
  /** Expiry (quote) or due date (invoice). */
  secondaryDate: string;
  company: Company | null;
  truck: Truck | null;
  lineItems: ServiceLineItem[];
  subtotal: number;
  taxAmount: number;
  total: number;
  taxRate: number | null;
  /** Stamp the artifact PAID (invoices only). */
  paid?: boolean;
}

// The FleetServ mark: two skewed bars + wordmark. Matches the design boards.
function BrandMark() {
  return (
    <div className="flex items-center gap-1.5">
      <div className="flex gap-[2.5px]">
        <div className="h-4 w-[6.5px] -skew-x-[16deg] rounded-[1px] bg-fs-teal-500" />
        <div className="h-4 w-[6.5px] -skew-x-[16deg] rounded-[1px] bg-fs-navy-900" />
      </div>
      <span className="text-[15px] font-extrabold italic tracking-[0.03em] text-fs-navy-900">
        FLEETSERV
      </span>
    </div>
  );
}

export function DocumentArtifact({
  kind,
  number,
  issuedDate,
  secondaryDate,
  company,
  truck,
  lineItems,
  subtotal,
  taxAmount,
  total,
  taxRate,
  paid = false,
}: DocumentArtifactProps) {
  const isInvoice = kind === "invoice";
  const docTitle = isInvoice ? "INVOICE" : "QUOTE";
  const totalLabel = isInvoice ? "TOTAL DUE" : "QUOTED TOTAL";
  const metaALabel = isInvoice ? "Issued" : "Prepared";
  const metaBLabel = isInvoice ? "Due" : "Valid until";
  const terms = isInvoice
    ? "Payment due by the date above. Check payable to FleetServ Hawaii; GET is included on the line above."
    : "Estimate based on the inspection of this vehicle. Approve by reply, text, or signature. Pricing valid through the date above.";

  return (
    <div className="fs-doc relative rounded-fs border border-fs-line-200 bg-white p-5 shadow-[0_2px_8px_rgba(13,30,45,0.08)] sm:p-7">
      {paid && (
        <div className="pointer-events-none absolute right-8 top-52 -rotate-12 rounded-lg border-[3px] border-fs-paid-bg bg-white/70 px-4 py-1 text-2xl font-extrabold tracking-[0.18em] text-fs-paid-bg opacity-90">
          PAID
        </div>
      )}

      {/* Letterhead */}
      <div className="flex justify-between gap-3">
        <div>
          <BrandMark />
          <div className="mt-2 text-[11px] leading-relaxed text-fs-ink-500">
            Mobile fleet service across the islands
            <br />
            Fleet servicing &middot; Hawai&#699;i
          </div>
        </div>
        <div className="text-right">
          <div className="text-[17px] font-extrabold leading-none tracking-[0.1em] text-fs-navy-900">
            {docTitle}
          </div>
          <div className="fs-money mt-1 text-xs font-semibold text-fs-ink-900">
            {number}
          </div>
          <div className="fs-money mt-1.5 whitespace-nowrap text-[10.5px] leading-relaxed text-fs-ink-500">
            {metaALabel} {formatDate(issuedDate)}
            <br />
            {metaBLabel} {formatDate(secondaryDate)}
          </div>
        </div>
      </div>

      <div className="my-3 h-[2.5px] bg-fs-navy-900" />

      {/* Bill to + vehicle */}
      <div className="flex gap-5">
        <div className="flex-1">
          <div className="text-[9.5px] font-bold uppercase tracking-[0.13em] text-fs-ink-500">
            Bill to
          </div>
          {company ? (
            <div className="mt-1 text-[11.5px] leading-[1.55] text-fs-ink-900">
              {company.name}
              <br />
              {company.contact_name}
              <br />
              {company.billing_address}
            </div>
          ) : (
            <div className="mt-1 text-[11.5px] text-fs-ink-450">
              No customer on file
            </div>
          )}
        </div>
        <div className="flex-1">
          <div className="text-[9.5px] font-bold uppercase tracking-[0.13em] text-fs-ink-500">
            Vehicle
          </div>
          {truck ? (
            <div className="mt-1 text-[11.5px] leading-[1.55] text-fs-ink-900">
              Unit {truck.unit_number}
              <br />
              {truck.year} {truck.make} {truck.model}
              <br />
              <span className="fs-money text-[10.5px]">VIN {truck.vin}</span>
            </div>
          ) : (
            <div className="mt-1 text-[11.5px] text-fs-ink-450">
              No vehicle on file
            </div>
          )}
        </div>
      </div>

      {/* Line items */}
      <div className="mt-3 flex justify-between border-b-[1.5px] border-fs-ink-900 pb-1.5 text-[9.5px] font-bold uppercase tracking-[0.13em] text-fs-ink-500">
        <span>Description</span>
        <span>Amount</span>
      </div>
      {lineItems.map((item) => (
        <div
          key={item.id}
          className="flex items-baseline justify-between gap-3 border-b border-fs-line-200 py-1.5"
        >
          <span className="text-xs leading-snug text-fs-ink-900">
            {item.description || SERVICE_TYPE_LABELS[item.service_type]}{" "}
            <span className="fs-money text-[10.5px] text-fs-ink-450">
              {Number(item.quantity)} {item.unit} &times;{" "}
              {formatCurrency(Number(item.unit_price))}
            </span>
          </span>
          <span className="fs-money text-xs font-semibold text-fs-ink-900">
            {formatCurrency(Number(item.subtotal))}
          </span>
        </div>
      ))}

      {/* Totals */}
      <div className="mt-2 flex flex-col items-end">
        <div className="flex w-52 justify-between py-0.5">
          <span className="text-[11.5px] text-fs-ink-500">Subtotal</span>
          <span className="fs-money text-xs font-semibold text-fs-ink-900">
            {formatCurrency(subtotal)}
          </span>
        </div>
        <div className="flex w-52 justify-between py-0.5">
          <span className="text-[11.5px] text-fs-ink-500">
            Hawai&#699;i GET{taxRate != null ? ` (${taxRate}%)` : ""}
          </span>
          <span className="fs-money text-xs font-semibold text-fs-ink-900">
            {formatCurrency(taxAmount)}
          </span>
        </div>
        <div className="mt-1 flex w-52 items-center justify-between border-t-2 border-fs-navy-900 pt-1.5">
          <span className="text-[10.5px] font-extrabold uppercase tracking-[0.1em] text-fs-navy-900">
            {totalLabel}
          </span>
          <span className="fs-money text-[19px] font-bold text-fs-navy-900">
            {formatCurrency(total)}
          </span>
        </div>
      </div>

      {/* Terms */}
      <div className="mt-3 border-t border-fs-line-200 pt-2 text-[10.5px] leading-relaxed text-fs-ink-500">
        {terms}
      </div>
      <div className="mt-1.5 text-[11px] font-semibold italic text-fs-ink-600">
        Mahalo for keeping your fleet with FleetServ.
      </div>
    </div>
  );
}
