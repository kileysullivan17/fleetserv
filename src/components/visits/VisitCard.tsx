import { useDraggable } from "@dnd-kit/core";
import type { VisitBoardRow } from "@/hooks/useAllVisits";
import { formatCurrency, formatDateShort } from "@/utils/format";
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
        "rounded-lg border border-brand-sand-dark bg-white p-3 shadow-card cursor-grab select-none",
        "hover:shadow-card-hover hover:border-brand-teal/40 transition-shadow",
        isDragging && "opacity-40",
        overlay && "shadow-card-hover rotate-2 cursor-grabbing"
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <p className="text-sm font-semibold text-brand-navy">
          {visit.unit_number ? `Unit ${visit.unit_number}` : "Unknown truck"}
        </p>
        <p className="text-sm font-mono font-medium text-brand-navy shrink-0">
          {formatCurrency(visit.total)}
        </p>
      </div>
      {visit.company_name && (
        <p className="mt-0.5 text-xs text-gray-500 truncate">
          {visit.company_name}
        </p>
      )}
      <div className="mt-2 flex items-center justify-between">
        <p className="text-xs text-gray-400">
          {formatDateShort(visit.visit_date)}
        </p>
        <p className="text-xs text-gray-400 truncate max-w-[50%]">
          {visit.technician_name}
        </p>
      </div>
    </div>
  );
}
