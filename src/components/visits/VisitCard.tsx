import { useDraggable } from "@dnd-kit/core";
import type { VisitBoardRow } from "@/hooks/useAllVisits";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { formatCurrency, formatDateShort, VISIT_STATUS_LABELS } from "@/utils/format";
import { cn } from "@/utils/cn";

interface VisitCardProps {
  visit: VisitBoardRow;
  onOpen: (visitId: string) => void;
  overlay?: boolean;
}

export function VisitCard({ visit, onOpen, overlay = false }: VisitCardProps) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: visit.id,
    data: { visit },
    disabled: overlay,
  });

  return (
    <div
      ref={overlay ? undefined : setNodeRef}
      {...(overlay ? {} : attributes)}
      {...(overlay ? {} : listeners)}
      onClick={() => {
        if (!isDragging) onOpen(visit.id);
      }}
      className={cn(
        "cursor-grab select-none rounded-fs border border-fs-line-200 bg-white p-3 shadow-fs-card",
        "transition-shadow hover:border-fs-navy-700/40 hover:shadow-card-hover",
        isDragging && "opacity-40",
        overlay && "rotate-2 cursor-grabbing shadow-card-hover"
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <p className="min-w-0 truncate text-sm font-semibold text-fs-ink-900">
          {visit.company_name ?? "Unknown customer"}
        </p>
        <p className="fs-money shrink-0 text-sm font-semibold text-fs-ink-900">
          {formatCurrency(visit.total)}
        </p>
      </div>
      <p className="mt-0.5 truncate text-xs text-fs-ink-500">
        {visit.unit_number ? `Unit ${visit.unit_number}` : "No unit"}
      </p>
      <div className="mt-2 flex items-center justify-between gap-2">
        <StatusBadge
          status={visit.status}
          label={VISIT_STATUS_LABELS[visit.status]}
          mini
        />
        <p className="fs-money text-[11px] text-fs-ink-450">
          {formatDateShort(visit.visit_date)}
        </p>
      </div>
    </div>
  );
}
