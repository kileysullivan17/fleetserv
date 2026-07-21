import { Link } from "react-router-dom";
import type { VisitBoardRow } from "@/hooks/useAllVisits";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { formatCurrency, formatDate, VISIT_STATUS_LABELS } from "@/utils/format";

interface JobRowProps {
  visit: VisitBoardRow;
}

// One urgency-sorted job. The whole row is the tap target (≥72px), opening the
// visit page — routing is unchanged. Amount is tabular mono, right-aligned;
// status is a dot + label chip, never color alone.
export function JobRow({ visit }: JobRowProps) {
  const company = visit.company_name ?? "Unknown customer";
  const unit = visit.unit_number ? `Unit ${visit.unit_number}` : "No unit";

  return (
    <Link
      to={`/visits/${visit.id}`}
      className="flex min-h-[72px] items-center justify-between gap-3 border-b border-fs-line-200 px-5 py-3 last:border-b-0 hover:bg-fs-navy-50"
    >
      <div className="min-w-0">
        <div className="truncate text-base font-semibold text-fs-ink-900">
          {company}
        </div>
        <div className="mt-1 truncate text-sm text-fs-ink-500">
          {unit} &middot; {visit.technician_name}
        </div>
      </div>
      <div className="flex flex-shrink-0 flex-col items-end gap-1.5">
        <div className="fs-money text-[17px] font-semibold text-fs-ink-900">
          {formatCurrency(visit.total)}
        </div>
        <StatusBadge
          status={visit.status}
          label={VISIT_STATUS_LABELS[visit.status]}
        />
        <div className="fs-money text-[11px] text-fs-ink-450">
          {formatDate(visit.visit_date)}
        </div>
      </div>
    </Link>
  );
}
