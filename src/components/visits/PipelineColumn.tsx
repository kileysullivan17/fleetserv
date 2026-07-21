import { useDroppable } from "@dnd-kit/core";
import type { ServiceVisitStatus } from "@/types/database";
import type { VisitBoardRow } from "@/hooks/useAllVisits";
import { VisitCard } from "@/components/visits/VisitCard";
import { formatCurrency } from "@/utils/format";
import { cn } from "@/utils/cn";

// Column top accent uses the status dot color, matching the chip system.
const COLUMN_DOT: Record<ServiceVisitStatus, string> = {
  draft: "var(--fs-draft-dot)",
  quoted: "var(--fs-sent-dot)",
  approved: "var(--fs-accepted-dot)",
  invoiced: "var(--fs-invoiced-dot)",
  paid: "var(--fs-paid-dot)",
};

interface PipelineColumnProps {
  status: ServiceVisitStatus;
  label: string;
  visits: VisitBoardRow[];
  onOpen: (visitId: string) => void;
}

export function PipelineColumn({
  status,
  label,
  visits,
  onOpen,
}: PipelineColumnProps) {
  const { setNodeRef, isOver } = useDroppable({ id: status });

  const columnTotal = visits.reduce((sum, visit) => sum + visit.total, 0);

  return (
    <div className="flex w-64 shrink-0 flex-col">
      <div
        className="rounded-t-fs border border-b-0 border-fs-line-200 border-t-4 bg-white px-3 py-2.5"
        style={{ borderTopColor: COLUMN_DOT[status] }}
      >
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold text-fs-ink-900">
            {label}
            <span className="ml-2 text-xs font-normal text-fs-ink-450">
              {visits.length}
            </span>
          </p>
          <p className="fs-money text-xs text-fs-ink-500">
            {formatCurrency(columnTotal)}
          </p>
        </div>
      </div>

      <div
        ref={setNodeRef}
        className={cn(
          "min-h-[160px] flex-1 space-y-2 rounded-b-fs border border-fs-line-200 bg-fs-bg p-2 transition-colors",
          isOver && "border-fs-navy-700 bg-fs-navy-50"
        )}
      >
        {visits.map((visit) => (
          <VisitCard key={visit.id} visit={visit} onOpen={onOpen} />
        ))}

        {visits.length === 0 && (
          <p
            className={cn(
              "flex h-full min-h-[120px] items-center justify-center rounded-fs-sm border border-dashed text-xs transition-colors",
              isOver
                ? "border-fs-navy-700 text-fs-navy-700"
                : "border-fs-line-200 text-fs-ink-450"
            )}
          >
            {isOver ? "Drop to move here" : "No visits"}
          </p>
        )}
      </div>
    </div>
  );
}
